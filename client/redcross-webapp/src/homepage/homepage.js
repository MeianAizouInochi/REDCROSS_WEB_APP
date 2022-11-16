import "./homepage.css"

import { phoneauth, chatRDB } from "../authchatsystem/firebaseconfig";

import { ref, runTransaction, set, onValue } from "firebase/database";

import Axios from 'axios';

import DbURL from "../domainconfig";

//below is navbar imports
import Navbar from "./navbar/navbar";

//below banner(carousel) imports 
import Imageslider from "./banner/imagesliderv3";

import { sliderdata } from "./banner/sliderdata";

//official info imports
import Officialinfo from "./officalinfo/Officialinfov2";

//linker todonator requester and staff pages component import.
import "./drslinkerv2.css";

//statistics component import.
import Statistics from "./statistics/Statistics";

//age router imports
import { useLocation, useNavigate } from "react-router-dom";

//Bottom panel of page import.
import Footer from "./bottompanel/Footer";

import { useEffect, useState } from "react";

//FOOTERPAGE IMPORT
import Aboutuspage from "./bottompanel/aboutus/aboutuspage";

import Feedbackpage from "./bottompanel/feedback/feedbackpage";

import Tcprivacypoilcy from "./bottompanel/tcprivacypolicy/tcprivacypolicypage";

import Tieupspage from "./bottompanel/tieups/tieupspage";

import Login from "./loginsystem/login";

import Signup from "./signupsystem/signup";

import Donatorpage from "./donatorsection/donatorpage";

import Requesterpage from "./requestersection/requesterpage";

const Homepage = () => {

    /*-------------------------------------------------------------------------------------------------------REQUIRED VARIABLES--------------------------------------------------------------------------------------------------------------------------*/
    const DONATOR = 1; // DONATOR CODES.

    const REQUESTER = 2; // REQUESTER CODE>

    const STAFF = 3; // STAFF CODE.

    const [vardefaultpage, setvardefaultpage] = useState(true); // VARIABLE FOR DEFAULT PAGE

    const [varaboutus, setvaraboutus] = useState(false); // VARIABLES FOR ABOUTUS 

    const [varfeedback, setvarfeedback] = useState(false); // VARIABLES FOR feedback

    const [vartcprivacypolicy, setvartcprivacypolicy] = useState(false); // VARIABLES FOR tcprivacypolicy

    const [vartieups, setvartieups] = useState(false); // VARIABLES FOR Tieups

    const [LogStatus, setLogStatus] = useState(false); // STATES FOR LOGIN AND SIGNUP

    const [LoginPageVis, setLoginPageVis] = useState(false); // STATE FOR CHANGING VISIBILITY TO LOGIN FORM.

    const [SemaForLoginClickOrigin, setSemaForLoginClickOrigin] = useState(0); // LOGIN CLICK SEMAPHORE.

    const [LoginSignupDataUserType, setLoginSignupDataUserType] = useState(""); // STATES FOR LOGIN AND SIGNUP DATA.

    const [LoginSignupDataUsername, setLoginSignupDataUsername] = useState(""); // STATES FOR LOGIN AND SIGNUP DATA USERNAME.

    const [LoginSignupLogHash, setLoginSignupLogHash] = useState(null); // SOME UNKNOWN STATES.

    const [SignupPageVis, setSignupPageVis] = useState(false); // STATE FOR SIGNUP PAGE VISIIBILITY.

    const [DonatorSectionVis, setDonatorSectionVis] = useState(false); // STATE FOR DONATOR SECTION VISIBILITY.

    const [StaffSectionVis, setStaffSectionVis] = useState(false); // STATE FOR STAFF SECTION VISIBILITY.

    const [RequesterSectionVis, setRequesterSectionVis] = useState(false); // STATE FOR REQUESTER SECTION VISIBILITY.

    let openpage = useNavigate(); // THIS NEEDS TO GET CHANGES TO NORMAL SEmAPHORE STATE FOR STAFF SECTION.

    /*-------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END.--------------------------------------------------------------------------------------------------------------------------*/
    Axios.defaults.withCredentials = true;

    /*
     * THIS USE EFFECT IS FOR LOGIN SESSION.
     * IT IS STILL UNDER DEVELOPMENT.
     */
    useEffect(() => {

        Axios.get(DbURL + "/api/user/login").then((response) => {

            if (response.data.LoginStatus) {

                var temparr = response.data.user.split('_');

                var usertype = temparr[0] + '_'

                setLoginSignupDataUserType(usertype);

                setLoginSignupDataUsername(temparr[1]);

                setLogStatus(true);

            }

        }).catch((err) => { console.log(err); });


    }, []);


    /*
     * THIS USE EFFECT HOOKS EXECUTES WHEN LOGSTATUS STATE IS CHANGED.
     */
    useEffect(() => {

        if (LogStatus) {

            //LoggerListener();// CALLING LOGGERLISTENER IF LOGSTATUS IS TRUE.

        }
        else {

            console.log("Logged out.");// CONSOLE LOGGING LOGGED OUT.

        }

    }, [LogStatus]);

    /*
     * LOGGER LISTENER FUNCTION.
     * IT IS THE SECURITY FEATURE THAT GOT IMPLEMENTED.
     * STILL NEEDS WORK
     */
    function LoggerListener(){

        var Username_for_Fdb = LoginSignupDataUserType + LoginSignupDataUsername;

        onValue(ref(chatRDB, "/users/" + Username_for_Fdb), (snapshot) => {

            //console.log(snapshot);
            const data = snapshot.val();

            if (data !== null) {

                //console.log(data);
                Object.keys(data).map((element) => { console.log(element); })

            }
            else {

                console.log("Logger listener!");
            }
        });

    }

    /*
     * REDIRECTOR TO DONATOR PAGE FUNCTION, TO CHANGE VISIBILITY OF PAGE.
     */
    const redirectortodonatorpage = () => {

        setvardefaultpage(false);

        setDonatorSectionVis(true);
    }

    /*
     * REDIRECTOR TO REQUESTER PAGE FUNCTION, TO CHANGE VISIBILITY OF PAGE.
     */
    const redirectortorequesterpage = () => {

        setvardefaultpage(false);

        setRequesterSectionVis(true);
    }

    /*
     * REDIRECTOR TO STAFF PAGE FUNCTION, TO CHANGE VISIBILITY OF PAGE.
     * STILL UNDER DEVELOPMENT.
     */
    const redirectortostaffpage = () => {

        // NEEDS WORK HERE.

    }

    /**
     * REDIRECTOR TO LOGIN PAGE.
     * CHANGES VISIBILITY TO LOGIN PAGE.
     */
    const redirectortologin = (props) => {

        setSemaForLoginClickOrigin(props);

        setLoginPageVis(true);

    }

    /*
     * LOGIN PAGE VISIBILITY CHANGER.
     */
    const LoginPageVischanger = () => {

        setLoginPageVis(!LoginPageVis);

    }

    /*
     * LOGIN PAGE VISIBILITY CHANGER BY CANCEL.
     */
    const LoginPageCancelVis = () => {

        setSemaForLoginClickOrigin(0);

        setLoginPageVis(!LoginPageVis);

    }

    /*
     * SIGNUP PAGE VISIBILITY CHANGER.
     */
    const SignupPageVischanger = () => {

        setSignupPageVis(!SignupPageVis);

    }

    /*
     * LOG OUT FUNCTION.
     */
    const Logoutfunc = () => {

        Axios.get(DbURL + "/api/user/logout").then((response) => {

            console.log("LOGINSTATUS: "+ response.data.LoginStatus);

        });

        setLogStatus(false);

        setLoginSignupDataUserType("");

        setLoginSignupDataUsername("");

        setRequesterSectionVis(false);

        setDonatorSectionVis(false);

        setvardefaultpage(true);
    }

    /**
     * RETRIEVES DATA FROM LOGIN PAGE.
     */
    const DataRetrieverFromLogin = (props1, props2) => {

        setLoginSignupDataUserType(props2);

        setLoginSignupDataUsername(props1);

        setLoginPageVis(false);

        setLogStatus(true);

    }

    /**
     * DATA RETRIEVER FROM SIGN UP PAGE.
     */
    const DataRetrieverFromSignup = (props1,props2,props3) => {

        setLoginSignupDataUserType(props2);

        setLoginSignupDataUsername(props1);

        setSignupPageVis(false);

        setLogStatus(props3);
    }

    /**
     * REDIRECTOR TO FOOTER PAGE.
     */
    const redirectortofooter = (props) => {

        if (props === 1) {

            setvaraboutus(true);

            setvarfeedback(false);

            setvardefaultpage(false);

            setvartcprivacypolicy(false);

            setvartieups(false);

            setDonatorSectionVis(false);

            setRequesterSectionVis(false);

        }
        else if (props === 2) {

            setvarfeedback(true);

            setvardefaultpage(false);

            setvartcprivacypolicy(false);

            setvartieups(false);

            setvaraboutus(false);

            setDonatorSectionVis(false);

            setRequesterSectionVis(false);

        }
        else if (props === 3) {

            setvartcprivacypolicy(true);

            setvardefaultpage(false);

            setvartieups(false);

            setvaraboutus(false);

            setvarfeedback(false);

            setDonatorSectionVis(false);

            setRequesterSectionVis(false);

        }
        else if (props === 4) {

            setvartieups(true);

            setvardefaultpage(false);

            setvaraboutus(false);

            setvartcprivacypolicy(false);

            setvarfeedback(false);

            setDonatorSectionVis(false);

            setRequesterSectionVis(false);

        }
        else if (props === 0) {

            if (vardefaultpage === false) {

                setvardefaultpage(true);

                setvartieups(false);

                setvaraboutus(false);

                setvarfeedback(false);

                setvartcprivacypolicy(false);

                setDonatorSectionVis(false);

                setRequesterSectionVis(false);

            }
            
        }

    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (
        <div className="HomepageLoginSignupContainer">

            {(!LoginPageVis && !SignupPageVis) && <div className="Homapage">

                { /*NAVBAR COMPONENT CALLED HERE*/ }
                <div className="Navbar">

                    { /*
                     * PASSED LOGIN PAGE VIS CHANGER TO NAVBAR LOGIN BUTTON
                     * PASSED SIGN UP PAGE VIS CHANGER TO NAVBAR SIGN UP BUTTON.
                     */ }
                    <Navbar info={LogStatus ? "ok" : null} VisChangerLogin={LoginPageVischanger} VisChangerSignup={SignupPageVischanger} LogOuttodefault={Logoutfunc} />

                </div>

                { /*DEFAULTPAGE START*/}

                {vardefaultpage && (<div className="defaultpage">

                    <div className="carousel">

                        <Imageslider slides={sliderdata} />

                    </div>

                    { /*LINKS TO DONATOR PAGE, REQUESTER PAGE, STAFF PAGE.*/ }

                    <section className="linksection">

                        <div className="headingoflinksection">

                            <p className="linksectionheading">Your identity ?</p>

                            <hr className="underlineidentity" />

                        </div>

                        { /*DONATOR PAGE LINK SECTION*/ }

                        <div className="donatorpagelink">

                            { /*
                             * ON CLICK FUNCTIONALITY FOR EVERY LINK BELOW:
                             * CHECK LOG STATUS,
                             * IF TRUE 
                             * CHECK IF TYPE MATCHES TO CORRESPONDING LINK TYPE,
                             * IF TRUE,
                             * CALL REDIRECTOR TO DONATOR PAGE FUNCTION 
                             * IF FALSE DO NOTHING
                             * IF FALSE CALL REDIRECTOR TO LOGIN PAGE FUNCTION WITH DONATOR TYPE AS PROPERTY.
                             */ }

                            <div className="donatorlink" >

                                <img src="/dsrlinkersvgs/money.svg" alt="donator" className="imagefordonator" onClick={(e) => {

                                    LogStatus ? (LoginSignupDataUserType === "DONATOR_" && redirectortodonatorpage()) : redirectortologin(DONATOR);

                                }} />

                                <p className="donatortext" onClick={(e) => {

                                    LogStatus ? (LoginSignupDataUserType === "DONATOR_" && redirectortodonatorpage()) : redirectortologin(DONATOR);

                                }} >Donater</p>

                                <p className="donordescription">Do you want to help someone in need ?</p>

                                <button className="buttonDonatorsignin" onClick={(e) => {

                                    LogStatus ? (LoginSignupDataUserType === "DONATOR_" && redirectortodonatorpage()) : redirectortologin(DONATOR);

                                }}>

                                    <p className="buttonDonatorsignintext">

                                        Enter Donator Portal

                                    </p>

                                </button>

                            </div>

                            <hr className="underlinedonator" />

                            { /*REQUESTER PAGE LINK SECTION*/}

                            <div className="requester">
                                    { /*
                                    * ON CLICK FUNCTIONALITY FOR EVERY LINK BELOW:
                                    * CHECK LOG STATUS,
                                    * IF TRUE 
                                    * CHECK IF TYPE MATCHES TO CORRESPONDING LINK TYPE,
                                    * IF TRUE,
                                    * CALL REDIRECTOR TO REQEUSTER PAGE FUNCTION 
                                    * IF FALSE DO NOTHING
                                    * IF FALSE CALL REDIRECTOR TO LOGIN PAGE FUNCTION WITH REQUESTER TYPE AS PROPERTY.
                                    */ }

                                <img src="/dsrlinkersvgs/requestersvg.svg" className="imageforrequester" onClick={(e) => {

                                    LogStatus ? (LoginSignupDataUserType === "REQUESTER_" && redirectortorequesterpage()) : redirectortologin(REQUESTER);

                                }} />

                                <p className="requestertext" onClick={(e) => {

                                    LogStatus ? (LoginSignupDataUserType === "REQUESTER_" && redirectortorequesterpage()) : redirectortologin(REQUESTER);

                                }} >Requester</p>

                                <p className="requesterdescription">Do you want help ?</p>

                                <button className="buttonrequestersignin" onClick={() => {

                                    LogStatus ? (LoginSignupDataUserType === "REQUESTER_" && redirectortorequesterpage()) : redirectortologin(REQUESTER);

                                }}>

                                    <p className="buttonrequestersignintext">

                                        Enter Requester Portal

                                    </p>

                                </button>

                            </div>

                            <hr className="underlinerequester" />

                            { /*
                             * STAFF PORTION IS STILL GETTING DEVELOPED.
                             */ }
                            <div className="staff">

                                <img src="/dsrlinkersvgs/staffsvg.svg" className="imageforstaff" />

                                <p className="stafftext">Staff</p>

                                <p className="staffdescription">Section reserved for redcross mohali staff</p>

                                <button className="buttonstaffsignin" onClick={(e) => { redirectortostaffpage() }}>

                                    <p className="buttonstaffsignintext">

                                        staff sign in

                                    </p>

                                </button>

                            </div>

                            <hr className="underlinerstaff" />

                        </div>

                    </section>

                    { /*OFFICIAL INFO SECTION*/}

                    <div className="Officialsinfo">

                        <Officialinfo />

                    </div>

                    { /*STATISTICS SECTION*/ }

                    <div className="Statistics">

                        <Statistics />

                    </div>

                </div>)
                }
                { /*DEFAULT PAGE END*/}

                { /*REPLACES SECTION OF HOME PAGE WITH DONATOR PAGE IF DONATOR SECTION VIS IS TRUE*/}

                {DonatorSectionVis && <Donatorpage UsernameData={LoginSignupDataUsername} />}

                { /*REPLACES SECTION OF HOME PAGE WITH DONATOR PAGE IF REQUESTER SECTION VIS IS TRUE*/}

                {RequesterSectionVis && <Requesterpage UsernameData={LoginSignupDataUsername} />}


                { /*ABOUTUSPAGE START*/}

                {varaboutus && (
                    <div className="aboutushomepage">
                        <Aboutuspage />
                    </div>
                )}
                { /*ABOUTUSPAGE END*/ }

                { /*FEEDBACKPAGE START*/ }

                {varfeedback && (
                    <Feedbackpage />
                )}

                { /*FEEDBACKPAGE END*/ }

                { /*TCprivacypolicy START*/ }

                {vartcprivacypolicy && (
                    <Tcprivacypoilcy />
                )}

                { /*TCprivacypolicy END*/ }


                { /*Tieups START*/ }

                {vartieups && (
                    <Tieupspage />
                )}

                { /*Tieups END*/ }

                { /*FOOTER SECTION FOR REDIECTING TO FOOTER ITEMS DEDICATED COMPONENT.*/ }
                <div className="Footer">

                    <Footer changepagetofooter={redirectortofooter} />

                </div>

            </div>}

            { /*LOGIN AND SIGNUP PAGE TO REPLACE THE HOMEPAGE WHEN THEIR RESPECTIVE VISIBILITY IS TRUE*/}

            {LoginPageVis && <Login Canceler={LoginPageCancelVis} Data={DataRetrieverFromLogin} Sema={SemaForLoginClickOrigin} />}

            {SignupPageVis && <Signup VisChangerSignup={SignupPageVischanger} Data={DataRetrieverFromSignup} />}

        </div>

    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}

//homepage main component end.
export default Homepage; //exporting homepage.