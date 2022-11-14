
import { useEffect, useState } from "react";

import Axios from "axios";

import "./donatordashboard.css"

import Requestdummyslider from './requestdummys/requestdummy';

import DbURL from "../../../domainconfig";

const Donatordashboard = (props) => {

    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES----------------------------------------------------------------------------------------------------------------------*/
    const username = props.username;

    const donatorkeyword = "DONATOR_";

    const Fullusername = donatorkeyword + username;

    const [Name, setName] = useState("");

    const [Adhaar, setAdhaar] = useState("");

    const [Address, setAddress] = useState("");

    const [Pan, setPan] = useState("");

    const [Mobilenumber, setMobilenumber] = useState("");

    const [Imagevarbinaryarray, setImagevarbinaryarray] = useState(null);
    /*----------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END.----------------------------------------------------------------------------------------------------------------------*/





    /*------------------------------------------------------------------------------------------------DASHBOARD FUNCTIONAL COMPONENTS ACCORDING TO WORKFLOW----------------------------------------------------------------------------------------------------*/

    /*
     * ASYNCHRONOUS FUNCTION GETUSERDATA.
     * IT GETS USER DATA TO DISPLAY TO END USER
     * IT SETS THE DATA TO ITS RESPECTIVE VARIABLES TO DISPLAY TO END USER.
     */
    async function getuserdata() {

        // GETTING DATA.
        var responsedata = await Axios.post(DbURL + "/api/getuserdata", { verifiedusername: Fullusername });

        // SETTING THE DATA.
        setName(responsedata.data.recordset[0].DETAILS);

        setMobilenumber(responsedata.data.recordset[1].DETAILS);

        setAdhaar(responsedata.data.recordset[2].DETAILS);

        setAddress(responsedata.data.recordset[3].DETAILS);

        setPan(responsedata.data.recordset[4].DETAILS);

    }

    /*
     * ASYNCHRONOUS FUNCTION GETIMAGE OF USER.
     * IT GETS USER IMAGE TO DISPLAY TO END USER
     * IT SETS THE IMAGE TO ITS RESPECTIVE VARIABLES TO DISPLAY TO END USER.
     */
    async function getImage() {

        // GETTING USER IMAGE.
        var responseimagedata = await Axios.post(DbURL + "/api/getuserimagedata", { username: Fullusername });

        // TRANSFORMING THE IMAGE IS DISPLAYABLE FORMAT.
        const base64string = await btoa(String.fromCharCode(...new Uint8Array(responseimagedata.data.recordset[0].DETAILS.data)));

        // SETTING THE DATA INTO THE VARIABLE.
        setImagevarbinaryarray(base64string);

    }

    /*
     *USE EFFECT HOOK.
     * IT WILL RUN AFTER FIRST RENDER IS DONE.
     * INSIDE THIS 2 ASYNCHRONOUS FUNCTION ARE CALLED.
     * BOTH ARE CALLED SIMULTANEOUSLY IRRESPECTIVE OF THEIR COMPLETION.
     * THEY BOTH COMPLETE AT THEIR OWN TIME.
     */
    useEffect(() => {

        // CALLED GET USER DATA FUNCTION.
        getuserdata();

        // CALLED GET IMAGE OF USER FUNCTION.
        getImage();

    },[]);

    /*------------------------------------------------------------------------------------------------DASHBOARD FUNCTIONAL COMPONENTS ACCORDING TO WORKFLOW END.----------------------------------------------------------------------------------------------------*/



    

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER.--------------------------------------------------------------------------------------------------*/
    return (

        <div className="Accountinfocontainer" >

            <div className="Accountinfo">

                <div className="Accountinfocover">

                    <div className="ProfilepicContainer">

                        { /*SETTING THE USER'S IMAGE HERE*/}

                        {Imagevarbinaryarray !== null && <img src={`data:image/jpeg;base64,${Imagevarbinaryarray}`} className="Profilepic" />}

                    </div>

                    <div className="info">

                        <section className="donornamecontainer">

                            <p className="dontorName">Name</p>

                            { /*SETTING USER'S NAME*/}

                            <p className="donorNamedata">{Name}</p>

                        </section>

                        <section className="donormobilecontainer">

                            <p className="donormobile">Mobile Number</p>


                            { /*SETTING USER'S MOBILE NUMBER*/}

                            <p className="donormobiledata">{Mobilenumber}</p>

                        </section>

                        <section className="donoradhaarcontainer">

                            <p className="donoradhaar">Adhaar Number:</p>

                            { /*SETTING USER'S ADDHAAR NUMBER*/}

                            <p className="donoradhaardata">{Adhaar}</p>

                        </section>

                        <section className="donorpancontainer">

                            <p className="donorpan">Pan Number:</p>

                            { /*SETTING USER'S PAN NUMBER*/}

                            <p className="donorpandata">{Pan}</p>

                        </section>

                        <section className="donoraddresscontainer">

                            <p className="donoraddress">Address:</p>

                            { /*SETTING USER'S ADDRESS*/}

                            <p className="donoraddressdata">{Address}</p>

                        </section>

                        <section className="donorusernamecontainer">

                            <p className="donorusername">Username:</p>

                            { /*SETTING USER'S USERNAME*/}

                            <p className="donorusernamedata">{username}</p>

                        </section>

                    </div>

                </div>

            </div>

            { /* SHOWS CURRENT REQUEST AVAILABLE FOR DONATOR TO DONATE.*/}

            <div className="Listofrequesters">

                <p className="CurrentRequestsText">Current Requests</p>

                <div className="Listofrequesterscover">

                    { /*CALLING THE IMPORTED COMPONENT*/}

                    <Requestdummyslider />

                </div>

            </div>

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}

export default Donatordashboard;