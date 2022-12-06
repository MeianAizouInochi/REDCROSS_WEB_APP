
import "./login.css";

import logo from "../navbar/redcrosslogo.png";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Axios from 'axios';

import { phoneauth, chatRDB } from "../../authchatsystem/firebaseconfig";

import { ref, runTransaction, set, update } from "firebase/database";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import DbURL from "../../domainconfig";

const Login = (props) => {

    /*-------------------------------------------------------------------------------------------------------REQUIRED VARIABLES--------------------------------------------------------------------------------------------------------------------------*/
    const [Username, setUsername] = useState("");

    const [Password, setPassword] = useState("");

    const [Mobile, setMobile] = useState("");

    const [Usertype, setUsertype] = useState("");

    const [Expandform, setExpandform] = useState(false);

    const [OTP, setOTP] = useState("");

    const [usertyevisibility, setusertyevisibility] = useState(true);

    const sema = props.Sema;
    /*-------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END.--------------------------------------------------------------------------------------------------------------------------*/


    /*
     * THIS USE EFFECT RUNS ONCE WHEN THIS COMPONENT MOUNTS.
     * IT CHECKS SEMAPHORE OF DONATOR/ REQUESTER/ STAFF TYPE OF FORM IS REQUIRED.
     */
    useEffect(() => {

        if (sema === 1) {// DONATOR IF 1

            setUsertype("DONATOR_");

        }
        else if (sema === 2) {// REQUESTER IF 2

            setUsertype("REQUESTER_");

        }
    }, [])

    /**
     * USER TYPE SELECTOR SPINNER/SELECTOR HTML ELEMENT HANDLING COMPONENT.
     * */
    const usertypeselector = () => {

        if (sema === 0) {

            return (<div>

                <label for="type">

                    User Type:

                </label>

                <select name="usertype" form="loginform" id="type" required onChange={(e) => { setUsertype(e.target.value) }}>

                    <option value="">None Selected</option>

                    <option value="DONATOR_">Donator</option>

                    <option value="REQUESTER_">Requester</option>

                </select>

            </div>);

        }
        else if (sema === 1) {

            return (<div>

                <label >

                    User Type:

                </label>

                <p>Donator</p>

            </div>);

        }
        else if (sema === 2) {

            return (<div>

                <label >

                    User Type:

                </label>

                <p>Requester</p>

            </div>);

        }
        else if (sema === 3) {

            return <div></div>
        }

    }

    /**
     * FORM PART 1 SUBMIT
     * COMPONENT
     */
    const handlesubmit = (e) => {

        e.preventDefault();// PREVENTING DEFAULT ACTION.

        checkprovidedusername(); // CALLING CHECK PROVIDED USERNAME COMPONENT.

    };
    
    /**
     * CHECK PROVIDED USERNAME COMPONENT.
     * */    
    const checkprovidedusername = () => {

        setusertyevisibility(false); // SETTING SPINNER/SELECTOR VISIBILITY FALSE.

        if (Usertype !== "") {

            Axios.post(DbURL+"/api/checkuser", { // CHECKING IF USER EXISTS.

                providedusername: Usertype + Username

            }).then((responsedata) => {

                if (responsedata.data.recordset.length === 1) {// USERNAME EXISTS CONDITION.

                    checkpassword(Username, Usertype); // CALLING CHECK PASSWORD.

                }
                else if (responsedata.data.recordset.length === 0) {// USERNAME DOESNT EXISTS CONDITION.

                    setusertyevisibility(true);

                    alert("Account does not exists.");

                }
                else {

                    alert("Error DB series.");

                }

            }).catch(function (error) {

                console.log(error);

            });
        }
        else {
            alert("please select a User Type.");

            setusertyevisibility(true);
        }        
    }

    /**
     * CHECK PASS WORD COMPONENT.
     * USED TO CHECK IF PASSWORD IS CORRECT.
     */
    const checkpassword = (Username,Usertype) => { // CALLED IN USERNAME CHECKER COMPONENT.

        if (Usertype !== "" && Username !== "") {

            Axios.post(DbURL+"/api/checkvalidity", {// API CALL FOR PASSWORD CHECK.

                verifiedusername: Usertype + Username,

                ValidityDETAILS_TYPE : "PASSWORD"

            }).then((responsepassword) => {

                if (responsepassword.data.recordset[0].DETAILS == Password) {// IF CORRECT.

                    MobileNumberChecker();// CALLING MOBILE CHECKER COMPONENT.
                    
                }
                else {// IF NOT CORRECT.

                    setusertyevisibility(true);

                    alert("wrong password.");
                }
            });

        }
        else {// NO TYPE SELECtED IN SELECTOR.

            setusertyevisibility(true);

            alert("Please select a User Type.");

        }
    }

    /**
     * MOBILE CHECKER cOMPONENT CALLED IN PASSWORD CHECKER COMPONENT SUCCESS.
     * */
    const MobileNumberChecker = () => {

        Axios.post(DbURL+"/api/checkvalidity", {// API CALL TO CHECK MOBILE NUMBER.

            verifiedusername: Usertype + Username,
            ValidityDETAILS_TYPE: "MOBILENUMBER"

        }).then((responsedatamobile) => {

            if (responsedatamobile.data.recordset[0].DETAILS === Mobile) {// OTP VERIFICATION CALLED.

                OtpSender(); // COMPONENT THAT SENDS OTP TO USER.
                
                setExpandform(true); // CHANGING FORM TO PART2.

            } else {

                setusertyevisibility(true);

                alert("Mobile Number not valid for provided Account.");
            }

        });

    }

    /**
     * OTP SENDER COMPONENT.
     * SENDS OTP TO USER.
     * */
    function OtpSender()
    {
        let appVerifier = new RecaptchaVerifier('RecaptchaVerifier', { // DEFINING RECAPTCHA.

            'size': 'invisible',

            'callback': (response) => {

                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log(response);

            }
        }, phoneauth);

        // SENDING OTP.
        signInWithPhoneNumber(phoneauth, "+91" + Mobile, appVerifier)
            .then(confirmationResult => { window.confirmationResult = confirmationResult; })
            .catch((error) => {

                console.log("ERROR MESSAGE: OTP SENDING ERROR: "+error);

            });
    }

    /**
     * VERIFY OTP FUNCTION CALLED ON BUTTON CLICK.
     * */
    const verifyOTP = () => {

        if (OTP.length === 6) { // CHECKING OTP LENGTH.

            let confirmationResult = window.confirmationResult;

            confirmationResult.confirm(OTP)
                .then((result) => {

                    const user = result.user;

                    const username_for_fdb = Usertype + Username;

                    // SENDING AXIOS REQUEST TO LOGIN SESSION.
                    Axios.post(DbURL + "/api/user/login", {

                        username: Usertype + Username,

                        password: Password

                    }).then((response) => {

                        if (response.data.LoginStatus)
                        {
                            props.Data(Username, Usertype,response.data.LoginStatus);
                        }
                    });

                }).catch((error) => {

                    console.log(error);

                    alert("Some error occured during otp verification.");
                });
        }
        else {

            alert("OTP should be of 6 digits!");

        }     
        
    }

    //RTDb logger function.
    async function RTDBLogIn() {

        const userlink = Usertype + Username;

        console.log(userlink);

        const arr = [];
        //logging values for realtime login.
        const response = await runTransaction(ref(chatRDB, "/users/" + userlink), (userdatafdb) => {

            Object.keys(userdatafdb).map((element) => { console.log(element); arr.push(element); })

            console.log(arr);

            var tempMax = parseInt(arr[0], 10);

            for (var looper = 1; looper < arr.length; looper++) {

                tempMax = tempMax < parseInt(arr[looper], 10) ? parseInt(arr[looper], 10) : tempMax;

            }
            tempMax = tempMax + 1;

            var ReturningJsonObj = {}

            for (var looper = 0; looper < arr.length; looper++) {

                ReturningJsonObj[arr[looper]] = { LOG: 0 }; 

            }
            var tempMaxString = tempMax.toString();

            ReturningJsonObj[tempMaxString] = { LOG: 1 }

            return ReturningJsonObj;
        });

        return response;
        
    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (
        <div className="Loginpage">

            { /*LOGO*/}
            <img src={logo} alt="redcross logo" />

            <div className="Loginpageinner">

                <h1>Sign in to Redcross</h1>

                { /*MAIN LOGIN FORM*/ }
                <form acceptCharset="UTF-8" id="loginform" onSubmit={(e) => { handlesubmit(e) }} >

                    { /*USERNAME*/ }
                    {!Expandform && <div className="data1">

                        <label>Username</label>

                        <input type="text" value={Username} onChange={(e) => { setUsername(e.target.value); }} />

                    </div>}     

                    { /*PASSWORD*/}
                    {!Expandform && <div className="data2">

                        <label>Password:</label>

                        <input type="password" value={Password} onChange={(e) => { setPassword(e.target.value) }} />

                    </div>}

                    { /*MOBILE NUMBER*/ }
                    {!Expandform && <div className="data3">

                        <label>Mobile Number</label>

                        <input type="tel" value={Mobile} minLength={10} maxLength={10} onChange={(e) => { setMobile(e.target.value) }} />

                    </div>}

                    { /*SPINNER VISIBILITY DEPENDING ON SEMAPHORE FROM HOMEPAGE*/ }
                    {usertyevisibility && usertypeselector()}

                    { /*SUBMIT OR CANCEL*/ }
                    {!Expandform && <div className="data0">

                        <input type="submit" value="Submit" />

                        <button type = "button" onClick={(e) => { props.Canceler(); }}>Cancel</button>

                    </div>}

                    { /*
                     * SECOND PART.
                     * OTP PART
                     */ }
                    {Expandform && <div className="data4">

                        <label>OTP (please input correct otp. Incorrect attempts will block from logging in for 24 hours.)</label>

                        <input type="tel" minLength={6} maxLength={6} value={OTP} onChange={(e) => { setOTP(e.target.value) }} />

                        <button type = "button" onClick={() => { verifyOTP() }}>Submit OTP</button>

                        <button type = "button" onClick={() => { props.Canceler(); } }>Cancel</button>

                    </div>}

                </form>
                

            </div>

            <div id="RecaptchaVerifier"></div>

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/
}
export default Login;