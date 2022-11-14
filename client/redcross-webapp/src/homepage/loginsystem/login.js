
import "./login.css";

import logo from "../navbar/redcrosslogo.png";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import Axios from 'axios';

import { phoneauth, chatRDB } from "../../authchatsystem/firebaseconfig";

import { ref, runTransaction, set, update } from "firebase/database";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import DbURL from "../../domainconfig";

//main login component.
const Login = (props) => {

    const [Username, setUsername] = useState("");

    const [Password, setPassword] = useState("");

    const [Mobile, setMobile] = useState("");

    const [Usertype, setUsertype] = useState("");

    const [Expandform, setExpandform] = useState(false);

    const [OTP, setOTP] = useState("");

    const [usertyevisibility, setusertyevisibility] = useState(true);

    //sema data from parent component.
    const sema = props.Sema;

    useEffect(() => {

        //storing data depending on form.
        if (sema === 1) {

            setUsertype("DONATOR_");

        }
        else if (sema === 2) {

            setUsertype("REQUESTER_");

        }

    }, [])

    
    
    //checking provided username in login.
    const checkprovidedusername = () => {

        setusertyevisibility(false);

        if (Usertype !== "") {

            //sending request to server.
            Axios.post(DbURL+"/api/checkuser", {

                providedusername: Usertype + Username

            }).then((responsedata) => {

                if (responsedata.data.recordset.length === 1) {

                    //if good then proceeding to check password.
                    checkpassword(Username, Usertype);

                }
                else if (responsedata.data.recordset.length === 0) {

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

    //checking password provided in login form.
    const checkpassword = (Username,Usertype) => {

        if (Usertype !== "" && Username !== "") {

            //sending request to server.
            Axios.post(DbURL+"/api/checkvalidity", {

                verifiedusername: Usertype + Username,

                ValidityDETAILS_TYPE : "PASSWORD"

            }).then((responsepassword) => {

                if (responsepassword.data.recordset[0].DETAILS == Password) {

                    //if good then proceeding for mobile verification.
                    MobileNumberChecker();
                    
                }
                else {

                    setusertyevisibility(true);

                    alert("wrong password.");
                }
            });

        }
        else {


            setusertyevisibility(true);

            alert("Please select a User Type.");

        }
    }

    //checking mobile number provided in login form.
    const MobileNumberChecker = () => {

        Axios.post(DbURL+"/api/checkvalidity", {

            verifiedusername: Usertype + Username,
            ValidityDETAILS_TYPE: "MOBILENUMBER"

        }).then((responsedatamobile) => {

            if (responsedatamobile.data.recordset[0].DETAILS === Mobile) {

                //if good proceeding for OTP verification.

                //OTP verification started.

                //OtpSender();//contains otp sending process.
                
                //changing the form for otp submittion after otp is sent.
                setExpandform(true); //contains the verifyOTP() call.

            } else {

                setusertyevisibility(true);

                alert("Mobile Number not valid for provided Account.");
            }

        });

    }

    //otp sender function start.
    function OtpSender()
    {

        //defining recaptcha.
        let appVerifier = new RecaptchaVerifier('RecaptchaVerifier', {

            'size': 'invisible',

            'callback': (response) => {

                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log(response);

            }
        }, phoneauth);

        //calling signin with phone number.
        signInWithPhoneNumber(phoneauth, "+91" + Mobile, appVerifier)
            .then(confirmationResult => { window.confirmationResult = confirmationResult; })
            .catch((error) => {

                console.log(error);

            });
    }
    //otp sender function end.


    //on press of submitotp button activatiing otp check and submittion.
    const verifyOTP = () => {

        if (OTP.length === 6) {

            let confirmationResult = window.confirmationResult;

            confirmationResult.confirm(OTP)
                .then((result) => {

                    const user = result.user;

                    //if good then Updating LOG to IN in FDB.

                    const username_for_fdb = Usertype + Username;

                    //need more testing below portion.

                    //running real time transaction.
                    RTDBLogIn().then((resultfromfdb) => {

                        console.log(resultfromfdb);

                        props.Data(Username, Usertype);//entering Logged in View.

                    }).catch(errrorinfdb => {

                        console.log(errrorinfdb);

                        console.log("Something Happenned while executing Transasction.");

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

    const handlesubmit = (e) => {

        e.preventDefault();

        checkprovidedusername();

    };

    //depending on sema value changing the form.
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

    //returning the jsx element.
    return (
        <div className="Loginpage">

            <img src={logo} alt="redcross logo" />

            <div className="Loginpageinner">

                <h1>Sign in to Redcross</h1>

                <form acceptCharset="UTF-8" id="loginform" onSubmit={(e) => { handlesubmit(e) }} >

                    {!Expandform && <div className="data1">

                        <label>Username</label>

                        <input type="text" value={Username} onChange={(e) => { setUsername(e.target.value); }} />

                    </div>}     

                    {!Expandform && <div className="data2">

                        <label>Password:</label>

                        <input type="password" value={Password} onChange={(e) => { setPassword(e.target.value) }} />

                    </div>}

                    {!Expandform && <div className="data3">

                        <label>Mobile Number</label>

                        <input type="tel" value={Mobile} minLength={10} maxLength={10} onChange={(e) => { setMobile(e.target.value) }} />

                    </div>}

                    {usertyevisibility && usertypeselector()}

                    {!Expandform && <div className="data0">

                        <input type="submit" value="Submit" />

                        <button onClick={(e) => { props.Canceler(); }}>Cancel</button>

                    </div>}

                    {Expandform && <div className="data4">

                        <label>OTP (please input correct otp. Incorrect attempts will block from logging in for 24 hours.)</label>

                        <input type="tel" minLength={6} maxLength={6} value={OTP} onChange={(e) => { setOTP(e.target.value) }} />

                        <button onClick={() => { verifyOTP() }}>Submit OTP</button>

                        <button onClick={() => { props.Canceler(); } }>Cancel</button>

                    </div>}

                </form>
                

            </div>

            <div id="RecaptchaVerifier"></div>

        </div>
        
    );
}
export default Login;