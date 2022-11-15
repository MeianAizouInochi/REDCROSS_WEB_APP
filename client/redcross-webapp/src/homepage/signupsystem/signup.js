
import logo from "../navbar/redcrosslogo.png";

import { useState } from "react";

import Axios from 'axios';

import { chatRDB, phoneauth } from "../../authchatsystem/firebaseconfig";

import "./signup.css";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import DbURL from "../../domainconfig";

import { ref, runTransaction, set, update } from "firebase/database";

import { useEffect } from "react";

const Signup = (props) => {

    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES----------------------------------------------------------------------------------------------------------------------*/
    const [Name, setName] = useState(""); //User's actual Name

    const [Mobile, setMobile] = useState(""); //User's Mobie Number

    const [Adhaar, setAdhaar] = useState(""); //User's Adhaar Number

    const [Pan, setPan] = useState(""); //User's Pan Number

    const [Address, setAddress] = useState(""); //User's Address

    const [Username, setUsername] = useState(""); //User's username for REDCROSS Account

    const [Usertype, setUsertype] = useState(""); //User's TYPE, that is if user is DONATOR or REQUESTER

    const [Password, setPassword] = useState(""); //User's Password for their Account.

    const [Profilepic, setProfilepic] = useState([]); //User's Profile Pic

    const [ExpandForm, setExpandForm] = useState(false); //ExpandForm Semaphore (Used to change Form Components dynamicaly)

    const [OTP, setOTP] = useState(""); //OTP stored here for checking.
    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END--------------------------------------------------------------------------------------------------------------------*/





    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS ACCORDING TO WORKFLOW----------------------------------------------------------------------------------------------------*/



    Axios.defaults.withCredentials = true;
    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS FIRST PART----------------------------------------------------------------------------------------------------*/
    /**
     * CHECKING NAME HERE.
     */
    const namechecker = (e) => {

        const h = e.target.value.replace(/[^a-zA-z\s]/g, "")
        return h

    }

    /**
     * CHECKING MOBILE NUMBER HERE.
     */
    const mobilechecker = (e) => {

        const h = e.target.value.replace(/[^0-9]/g, "")
        return h

    }

    /**
     * CHECKING ADDHAAR NUMBER HERE.
     */
    const adharchecker = (e) => {

        const h = e.target.value.replace(/[^0-9]/g, "")
        return h

    }

    /**
     * CHECKING ADDRESS HERE.
     */
    const addresschecker = (e) => {

        const h = e.target.value.replace(/[^a-zA-Z0-9|\-|,|'|.]/g, "")
        return h

    }

    /**
     * CHECKING PAN NUMBER HERE.
     */
    const panchecker = (e) => {

        const h = e.target.value.replace(/[^a-zA-Z0-9]/g, "")
        return h

    }

    /**
     * CHECKING USERNAME HERE.
     */
    const usernamechecker = (e) => {

        const h = e.target.value.replace(/[^a-zA-Z]/g, "")
        return h

    }

    /**
     * CHECKING PASSWORD HERE.
     */
    const passwordchecker = (e) => {

        const h = e.target.value.replace(/[^0-9]/g, "")
        return h

    }

    /**
     *CONVERTING PROFILE PIC DATA HERE TO SUITABLE FORMAT FOR SENDING TO DATABASE. 
     */
    const Convert_profile_pic_data = (props) => {

        if (props !== null)
        {
            const fileByteArray = []; //getting a temporary array.

            const filereader = new FileReader(); //instantiating FileReder() Class

            //checking if file is empty [can occur in certain situations]
            if (props.target.files.length !== 0) {

                filereader.readAsArrayBuffer(props.target.files[0]); //load the file into buffer.

                //activating this when the loading ends of the data.
                filereader.onloadend = (evt) => {

                    if (evt.target.readyState === FileReader.DONE) { //checking if is DONE state.

                        const arrayBuffer = evt.target.result,

                            array = new Uint8Array(arrayBuffer); //storing the data into further variables

                        for (const a of array) { //pushing the data into the temporary array.

                            fileByteArray.push(a);
                        }

                        setProfilepic(fileByteArray); //Pushing the data from filebyte array into the Dynamic State PROFILE PIC Variable.

                    }
                }
            }
            else
            {
                //do nothing.
            }
        }
        else
        {
            //if props is null do nothing.
        }
    }

    /**
     *HANDLING FORM SUBMITTION HERE. 
     */
    const handlesubmit = (e) => {

        e.preventDefault(); //PREVENTING DEFAULT FUNCTIONALITY.

        
        if (Profilepic.length > 102400) { //checking profilepic size here.

            alert("please submit a picture of 100kb or less.");
        }
        else {

            if (Usertype !== "") {//Checking USERTYPE validity here.

                //Checking if USERNAME GOT THE FOLLOWING PATTERNS
                if (
                    Username.search("donator") === -1 &&
                    Username.search("DONATOR") === -1 &&
                    Username.search("_") === -1 &&
                    Username.search("requester") === -1 &&
                    Username.search("REQUESTER") === -1 &&
                    Username.search("_") === -1
                )
                {
                    /*
                     * Calling USERNAME EXiSTANCE CHECKER COMPONENT HERE, to check whether it exists or not in the DB already.
                     * USERNAME EXISTENCE CHECKER IS ANYCHRONOUS FUNCTION.
                     * NOTHING SHOULD BE CALLED AFTER THIS FUNCTION AND ITS .THEN CALL, IF IT IS UNWANTED THAT THEY BOTH RUN UnSEQUENTIALLY.
                     * IF THIS FUNCTION IS CALLED WITH ITS .THEN, AFTER THAT A FUNCTION NAMED 'FUNC' IS CALLED, THEN WHILE THIS FUNCTION IS EXECUTING AND TAKES TIME, FUNC WILL ALSO START EXECUTING.
                     */
                    usernameexistencechecker().then((response) => { //WHEN WE RECIEVE THE RESPONSE WE EXECUTE THE FOLLOWING CODE.

                        if (response.data.recordset.length === 1) { //IF USERNAME ALREADY EXISTS.

                            alert("Username already exist, please try another username!");

                        }
                        else { //IF USERNAME DOESNT EXISTS.

                            //CREATING APPVERIFIER RECAPTCHA VARIABLE HERE.
                            let appVerifier = new RecaptchaVerifier('RecaptchaVerifier', {

                                'size': 'invisible',
                                'callback': (responsefromcaptcha) => {

                                    //something here
                                }

                            }, phoneauth);

                            //CALLING FIREBASE API SIGN IN WITH PHONE NUMBER FUNCTION, AND SENDING OTP.
                            /*signInWithPhoneNumber(phoneauth, "+91" + Mobile, appVerifier)
                                .then(confirmationResult => {
                                    window.confirmationResult = confirmationResult;
                                })
                                .catch((error) => {

                                    console.log("ERROR MESSAGE: FIREBASE SIGN IN WITH PHONE NUMBER FUNCTION: " + error);

                                });
                                */

                            //CHANGING THE FORM TO SECOND PART FOR OTP VERIFICATION AND IF CORRECT THEN DATA UPLOAD TO DB..
                            setExpandForm(true);

                        }

                    }).catch((ERR) => { console.log("ERROR MESSAGE: Error Occured at UsernameExistance Checker CAll in SignUp Component."); });
                    /*
                     * NOTHING IS CALLED AFTER THE ABOVE FUNCTION, SINCE SEQUENTIAL RUN IS DESIRED HERE.
                     */
                }
                else {

                    alert("Username cannot contain any relevence to words - Donator , Requester");

                }
            }
            else {

                alert("Please choose a usertype!");

            }
        }
    }

    /*
     * USERNAME CHECKER FUNCTION THAT WAS CALLED ABOVE INSIDE HANDLE SUBMIT.
    */
    async function usernameexistencechecker() {

        var response = await Axios.post(DbURL + "/api/checkuser", {

            providedusername: Usertype + Username

        });

        return response;
    }
    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS FIRST PART END----------------------------------------------------------------------------------------------------*/





    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS SECOND PART----------------------------------------------------------------------------------------------------*/
    /*
     * VERIFY OTP FUNCTION , IT VERIFIES THE OTP AND DOES OTHER FUNCTIONALITIES
     */
    const verifyOTP = () => {

        //CHECKING OTP LENGTH
        if (OTP.length === 6) {
            /*
            //GETTING THE CONFIRMATION INTO A VARIABLE.
            let confirmationResult = window.confirmationResult;

            //CONFIRMING THE OTP
            confirmationResult
                .confirm(OTP)
                .then((result) => {// IF CORRECT PERFORMING FUNCTIONS

                    const user = result.user;

                    /*
                     * CALLING UPLOAD_DATA FUNCTION.
                     * UPLOAD DATA IS AN ASYNC FUNCTION.
                     * IT IS UNWANTED THAT ANY OTHER FUNCTIONALITY OCCURS BEFORE THIS FUNCTION COMPLETES EXECUTING.
                     * HENCE NO OTHER FUNCTION IS CALLED AFTER THIS.
                     
                    UPLOAD_DATA(); 
            });
        */
            UPLOAD_DATA();
        }
    }

    /*
     * UPLOAD_DATA FUNCTION, ITS USED TO EXECUTE MOST OF THE SEND DATA QUERIES.
     */
    async function UPLOAD_DATA()
    {
        const arr = ["NAME", "MOBILENUMBER", "ADHR", "ADDRESS", "PAN", "PASSWORD"]; // CREATED ARRAY FOR DETAILS TYPE IN QUERY.

        const arrvalue = [Name, Mobile, Adhaar, Address, Pan, Password]; // CREATED ARRAY WITH THE DETAILS WE GOT INPUT.

        /*
         * STARTED THE QUERY WITH AWAIT.
         */
        var CREATE_TABLE = await Axios.post(DbURL + "/api/newuser", {verifiedusername: Usertype + Username});

        // CHECKING IF CREATE TABLE QUERY EXECUTED CORRECTLY.
        if (CREATE_TABLE.status === 200) {
            var SEND_INFO_1 = await Axios.post(DbURL + "/api/newuserinfo", {
                verifiedusername: Usertype + Username,
                DETAILS_TYPE: arr[0],
                DETAILS: arrvalue[0],
                CONFIRMATION: "1"
            });

            // CHECKING IF NAME QUERY EXECUTED CORRECTLY.
            if (SEND_INFO_1.status === 200) {
                var SEND_INFO_2 = await Axios.post(DbURL + "/api/newuserinfo", {
                    verifiedusername: Usertype + Username,
                    DETAILS_TYPE: arr[1],
                    DETAILS: arrvalue[1],
                    CONFIRMATION: "1"
                });

                // CHECKING IF MOBILE NUMBER QUERY EXECUTED CORRECTLY.
                if (SEND_INFO_2.status === 200) {
                    var SEND_INFO_3 = await Axios.post(DbURL + "/api/newuserinfo", {
                        verifiedusername: Usertype + Username,
                        DETAILS_TYPE: arr[2],
                        DETAILS: arrvalue[2],
                        CONFIRMATION: "1"
                    });

                    // CHECKING IF ADDHAAR QUERY EXECUTED CORRECTLY.
                    if (SEND_INFO_3.status === 200) {
                        var SEND_INFO_4 = await Axios.post(DbURL + "/api/newuserinfo", {
                            verifiedusername: Usertype + Username,
                            DETAILS_TYPE: arr[3],
                            DETAILS: arrvalue[3],
                            CONFIRMATION: "1"
                        });

                        // CHECKING IF ADDRESS QUERY EXECUTED CORRECTLY.
                        if (SEND_INFO_4.status === 200) {
                            var SEND_INFO_5 = await Axios.post(DbURL + "/api/newuserinfo", {
                                verifiedusername: Usertype + Username,
                                DETAILS_TYPE: arr[4],
                                DETAILS: arrvalue[4],
                                CONFIRMATION: "1"
                            });

                            // CHECKING IF PAN QUERY EXECUTED CORRECTLY.
                            if (SEND_INFO_5.status === 200) {
                                var SEND_INFO_6 = await Axios.post(DbURL + "/api/newuserinfo", {
                                    verifiedusername: Usertype + Username,
                                    DETAILS_TYPE: arr[5],
                                    DETAILS: arrvalue[5],
                                    CONFIRMATION: "1"
                                });

                                // CHECKING IF PASSWORD QUERY EXECUTED CORRECTLY.
                                if (SEND_INFO_6.status === 200) {
                                    console.log("DATA UPLOAD S DONE.");
                                }
                                else
                                {
                                    console.log("ERROR MESSAGE: ERROR IN SENDING PASSWORD QUERY IN SIGNUP.");
                                }
                            }
                            else
                            {
                                console.log("ERROR MESSAGE: ERROR IN SENDING PAN QUERY IN SIGNUP.");
                            }

                        }
                        else
                        {
                            console.log("ERROR MESSAGE: ERROR IN SENDING ADDRESS QUERY IN SIGNUP.");
                        }

                    }
                    else
                    {
                        console.log("ERROR MESSAGE: ERROR IN SENDING ADDHAAR NUMBER QUERY IN SIGNUP.");
                    }

                }
                else
                {
                    console.log("ERROR MESSAGE: ERROR IN SENDING MOBILE NUMBER QUERY IN SIGNUP.");
                }
            }
            else
            {
                console.log("ERROR MESSAGE: ERROR IN SENDING NAME QUERY IN SIGNUP.");
            }
        }
        else
        {
            console.log("ERROR MESSAGE: ERROR IN CREATE TABLE QUERY IN SIGNUP.");
        }

        /*
         * CREATE FILE TYPE TABLE IN DATABASE QUERY.
        */
        var CREATE_FILE_TYPE_TABLE = await Axios.post(DbURL + "/api/newuserdata", { verifiedusername: Usertype + Username });

        //CHECKING IF CREATE FILE TYPE TABLE QUERY EXECUTED CORRECTLY.
        if (CREATE_FILE_TYPE_TABLE.status === 200)
        {
            var SEND_PROFILE_PIC_DATA = await Axios.post(DbURL + "/api/sendprofilepicdata", {
                verifiedusername: Usertype + Username,
                Profilepicdata: Profilepic
            });

            //CHECKING IF SEND PROFILE PIC DATA QUERY EXECUTED CORRECTLY.
            if (SEND_PROFILE_PIC_DATA.status === 200)
            {

                /*
                 * LOGIN API CALL.
                 * IT STARTS SESSION IN SERVER.
                 */
                var LoginSema = await Axios.post(DbURL + "/api/user/login", {
                    username: Usertype + Username,
                    password: Password
                });

                if (LoginSema.data.LoginStatus) // CHEKING RESULT.
                {
                    /*
                     * A SECURITY FEATURE STARTS HERE, TO PREVENT MULTIPLE LOGINS AT A TIME IN AN ACCOUNT. (BY THE SAME PERSON OR MULTIPLE PERSONS.)
                     * THIS USES FIREBASE RTDB.
                     * LOGGINGIN IS AN ASYNC FUNCTION, HENCE NOTHING IS PERFORMED AFTER IT, RATHER ON ITS COMPLETION.
                     */
                    LoggingIn().then((responsefromfdb) => {// IF SUCCESSFULL THEN PROCEEDING WITH FURTHER FUNCTIONALITIES.

                        console.log(responsefromfdb);

                        console.log("inside responsefdb not error");

                        //props.Data(Username, Usertype, LoginSema.data.LoginStatus);// LOGGING IN AND SENDING USER BACK TO HOMEPAGE WITH ABILITY TO ENTER THEIR PROFILE.

                        Axios.get(DbURL + "/").then((response) => { console.log(response); }).catch((err) => { console.log(err); });

                    }).catch(function (errorfromfdb) {// CATCHING ANY ERROR ON UNEXPECTED EXECUTION.

                        console.log(errorfromfdb);

                        console.log("error occured fdb login api call");

                        props.VisChangerSignup(); // IN CASE OF ERROR REROUTING USER TO START FROM BEGINNING.

                    });
                }
                else
                {
                    console.log("ERROR MESSAGE: SOMETHING REALLY BAD HAPPENED IN SIGNUP ENDING LOGIN API CALL.");

                    props.VisChangerSignup(); // IN CASE OF ERROR REROUTING USER TO START FROM BEGINNING.
                }
            }
        }
    }
    
    /*
     * LoggingIn FUNCTION CONNECTS TO RTDB.
     * IT PROVIDES A LOG VALUE INSIDE THE USERNAME NODE IN FIREBASE RTDB.
     * ITS VALUE IS SET TO 1 AT THE START.
     * DIFFERENT LOGIN TAKES DIFFERENT VALUES.
     */
    async function LoggingIn() {

        const username_fdb = Usertype + Username; //STORING THE FULL USERNAME IN A VARIABLE.

        // CONDUCTING A TRANSACTION.
        const response = await runTransaction(ref(chatRDB, "/users/" + username_fdb), (userdatafdb) => {

            if (userdatafdb === null) {

                set(ref(chatRDB, "/users/" + username_fdb + "/1"), { LOG: "1" });

                // SETTING LOG VALUE TO 1.
                userdatafdb = {
                    1: { LOG: "1" }
                }
            }
            else {

                console.log("ERRO TYPE: DUP-U")

            }
            return userdatafdb;
        });

        //RETURNING THE RESULT.
        return response;
    }
    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS SECOND PART END----------------------------------------------------------------------------------------------------*/





    /*------------------------------------------------------------------------------------------------FORM FUNCTIONAL COMPONENTS ACCORDING TO WORKFLOW END----------------------------------------------------------------------------------------------------*/



    
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (
        <div className="Signuppage">

            <img src={logo} alt="redcross logo" />

            <div className="Signuppageinner">

                <h1><u>Create Account on Redcross</u></h1>

                <form id="Signupform" acceptCharset="UTF-8" onSubmit={(e) => { handlesubmit(e) }} >

                    { /*When Expand Form Semaphore is false, the first part of form is visible*/}

                    {/*----------------------------------------------------------------------------------------------FORM FIRST PART------------------------------------------------------------------------------------------------------------------*/ }
                    { /*
                     * CALLING RESPECTIVE CHECKERS FROM NAME TO USERNAME SPACES IN FORM.
                     */}
                    {!ExpandForm && <div className="data1">

                        {/*NAME OF USER*/}

                        <label>Name</label>

                        <input type="text" value={Name} onChange={(e) => { setName(namechecker(e)); }} required /> { /*CALLING NAME CHECKER*/ }

                    </div>
                    }

                    {!ExpandForm && <div className="data2">

                        {/*MOBILE NUMBER OF USER*/}

                        <label>Mobile Number</label>

                        <input type="tel" value={Mobile} minLength={10} maxLength={10} onChange={(e) => { setMobile(mobilechecker(e)); }} required />

                    </div>
                    }
                    {!ExpandForm && <div className="data3">

                        {/*ADDHAAR NUMBER OF USER*/}

                        <label>Adhaar Number</label>

                        <input type="tel" value={Adhaar} minLength={12} maxLength={12} onChange={(e) => { setAdhaar(adharchecker(e)); }} required />

                    </div>
                    }
                    {!ExpandForm && <div className="data4">

                        {/*PAN NUMBER OF USER*/}

                        <label>Pan Number</label>

                        <input type="text" value={Pan} minLength={10} maxLength={10} onChange={(e) => { setPan(panchecker(e)); }} />

                    </div>
                    }
                    {!ExpandForm && <div className="data5">

                        {/*ADDRESS OF USER*/}

                        <label>Address</label>

                        <input type="text" value={Address} minLength={10} maxLength={255} onChange={(e) => { setAddress(addresschecker(e)); }} required />

                    </div>

                    }
                    {!ExpandForm && <div className="data6">

                        {/*USERNAME FOR ACCOUNT OF USER*/}

                        <label>Username</label>

                        <input type="text" value={Username} onChange={(e) => { setUsername(usernamechecker(e)); }} required />

                    </div>
                    }
                    {!ExpandForm && <div className="data7">

                        {/*PASSWORD OF USER*/}

                        <label>Password:</label>

                        <input type="password" value={Password} onChange={(e) => { setPassword(e.target.value); }} required />

                    </div>
                    }
                    {!ExpandForm && <div className="data8">

                        {/*PROFILE PIC OF USER*/}

                        <label>Choose your profile pic: (jpg,png) [size: less than 100kb]</label>

                        { /*SENDING PROFILE PIC DATA TO CONVERT PROFILE PIC DATA COMPONENT.*/ }

                        <input type="file" accept="image/png , image/jpeg" onChange={(e) => { Convert_profile_pic_data(e); }} required />

                    </div>
                    }

                    {!ExpandForm && <div>

                        {/*TYPE OF USER*/}

                        { /*SETTING THE TYPE OF USER FROM THE SELECTOR*/ }

                        <label for="Usertype">User Type:</label>

                        <select id="Usertype" name="Usertype" form="Signupform" onChange={(e) => { setUsertype(e.target.value); }} required>

                            <option value="">None selected</option>

                            <option value="DONATOR_">

                                Donator

                            </option>

                            <option value="REQUESTER_">

                                Requester

                            </option>

                        </select>

                    </div>
                    }

                    {!ExpandForm && <div className="data0">

                        {/*SUBMIT BUTTON FOR FIRST PART OF FORM*/}

                        { /* CALLING HANDLESUBMIT COMPONENT WHEN CLICK ON SUBMIT*/ }
                        <input type = "submit" value="Submit" />

                        { /*  CALLING VISCHANGERSIGNUP COMPONENT() FROM HOMEPAGE TO CHANGE FORM TO FORM BACK TO HOME PAGE. */ }
                        <button type = "button" onClick={() => { props.VisChangerSignup(); }}>Cancel</button>

                    </div>
                    }
                    { /*---------------------------------------------------------------------------------------------FORM FIRST PART END.------------------------------------------------------------------------------------------------------------*/}

                    { /*---------------------------------------------------------------------------------------------FORM SECOND PART START.------------------------------------------------------------------------------------------------------------*/}
                    {ExpandForm && <div className="data9">

                        { /*GETTING OTP INPUT HERE*/ }

                        <label> Provide OTP here: </label>

                        <input type="tel" maxLength={6} minLength={6} value={OTP} onChange={(e) => { setOTP(e.target.value) }} required />

                    </div>
                    }
                    {ExpandForm && <div className="data10">

                        { /*CALLING VERIFY OTP IF SUBMIT OTP IS CLICKED*/ }
                        <button type = "button" onClick={() => { verifyOTP(); }}>Submit OTP</button>

                        { /*CALLING VISCHANGER SIGNUP FUNCTION FROM HOMEPAGE IF CANCEL BUTTON IS PRESSED.*/ }
                        <button type = "button" onClick={() => { props.VisChangerSignup(); } }>Cancel</button>

                    </div>
                    }
                </form>

                <div id ="RecaptchaVerifier"></div>

            </div>

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}
export default Signup;