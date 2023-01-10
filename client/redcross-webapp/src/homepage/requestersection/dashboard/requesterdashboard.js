
import { useEffect, useState } from "react";

import Axios from "axios";

import "./requesterdashboard.css"

import Requesttype from "./requesttypes/requesttypes";

import DbURL from "../../../domainconfig";

import RequesterForm from "./requesterform";

const Requesterdashboard = (props) => {

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES START---------------------------------------------------------------------------------------------------------------------------------------*/
    const username = props.username;

    const requesterkeyword = "REQUESTER_";

    const Fullusername = requesterkeyword + username;

    const [Name, setName] = useState("");

    const [Adhaar, setAdhaar] = useState("");

    const [Address, setAddress] = useState("");

    const [Pan, setPan] = useState("");

    const [Mobilenumber, setMobilenumber] = useState("");

    const [Imagevarbinaryarray, setImagevarbinaryarray] = useState(null);

    const [RequestingFormVis, setRequestingFormVis] = useState(false);

    const [RequesterPageVis, setRequesterPageVis] = useState(true);

    const [SelectedType, setSelectedType] = useState("");

    const [ActiveRequests, setActiveRequests] = useState([]);
    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END---------------------------------------------------------------------------------------------------------------------------------------*/

    /*
     * THIS USEEFFECT IS EXECUTED WHEN THIS COMPONENT IS MOUNTED (EXACTLY ONCE).
     */
    useEffect(() => {

        getuserdata();

        getImage();

        GetActiveRequests();

    }, []);


    /*
     * THIS IS THE GET USER DATA FUNCTION - GETS TExTUAL USER INFORMATION.
     */
    async function getuserdata() {

        /*
         * WAITING FOR ALL DATA TO BE LOADED INTO RESPONSEDATA VARIABLE.
         */
        var responsedata = await Axios.post(DbURL + "/api/getuserdata", {

            verifiedusername: Fullusername

        });

        /*
         * ITERATING THROUGH THE DATA.
         */
        Object.keys(responsedata.data.recordset).map((element) => {

            if (responsedata.data.recordset[element].DETAILS_TYPE === "NAME") {

                setName(responsedata.data.recordset[element].DETAILS);

            }
            else if (responsedata.data.recordset[element].DETAILS_TYPE === "MOBILENUMBER") {

                setMobilenumber(responsedata.data.recordset[element].DETAILS);

            }
            else if (responsedata.data.recordset[element].DETAILS_TYPE === "ADHR") {

                setAdhaar(responsedata.data.recordset[element].DETAILS);

            }
            else if (responsedata.data.recordset[element].DETAILS_TYPE === "PAN") {

                setPan(responsedata.data.recordset[element].DETAILS);

            }
            else if (responsedata.data.recordset[element].DETAILS_TYPE === "ADDRESS") {

                setAddress(responsedata.data.recordset[element].DETAILS);

            }
        });
    }
    /*
     * THIS GET IMAGE FUNCTION GETS THE USER PROFILE IMAGE
     */
    async function getImage() {
        /*
         * WAITING FOR THE PROFILEPIC IMAGE DATA TO BE LOADED IN RESPONSEIMAGE DATA VARIABLE.
         */
        var responseimagedata = await Axios.post(DbURL + "/api/getuserimagedata", {

            username: Fullusername

        });

        /*
         * WAITING FOR THE WHOLE IMAGE DATA TO BE CONVERTED INTO READABLE FORMAT FOR REACTJS/HTML URL.
         */
        const base64string = await btoa(String.fromCharCode(...new Uint8Array(responseimagedata.data.recordset[0].DETAILS.data)));

        /*
         * SETTING THE DATA INTO A STATE.
         */
        await setImagevarbinaryarray(base64string);
    }
    /*
     * THIS GET ACTIVE REQUESTS FUNCTION GETS THE ACTIVE REQUESTS MADE BY THE CURRENT USER.
     */
    async function GetActiveRequests()
    {
        var responsedata = await Axios.post(DbURL + "/api/GetActiveRequests", {

            FullUsername: username

        });

        var temparr = [];

        responsedata.data.recordset.map((val) => {

            var tempstringarr = val.TABLE_NAME.split('_');

            temparr.push(tempstringarr[1]);
        })

        // SETTING THE REQUESTS MADE INFORMATION.

        setActiveRequests(temparr); 
        
    }

    /*
     * THIS REQUESTERFORMVISCHANGER FUNCTION SWITCHES BETWEEN FORM AND DASHBOARD VIEWS.
     */
    const RequesterFormVisChanger = (props) => {

        setRequestingFormVis(!RequestingFormVis);

        setRequesterPageVis(!RequesterPageVis);

        setSelectedType(props);
    }

    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER START.--------------------------------------------------------------------------------------------------*/
    return (
        <div className="Requesterdashboardmothercontainer">

            { /*REQUESTERPAGEVIS CONTROLS THE VISIBILITY OF REQUESTER FORM AND THE REQUESTER SECTION PAGE AS A WHOLE.*/ }

            {RequesterPageVis && <div className="Requesterdashboardcontainer" >

                { /*REQUESTER USER INFORMATION CONTAINER*/ }

                <div className="RequesterAccountinfo">

                    <div className="RequesterAccountinfocover">

                        <div className="RequesterProfilepicContainer">

                            { /*PROFILE PIC OF USER*/ }
                            {Imagevarbinaryarray !== null && <img src={`data:image/jpeg;base64,${Imagevarbinaryarray}`} width="260" height="260" className="RequesterProfilepic" />}

                        </div>

                        { /*REQUESTER TEXTUAL INFORMATION*/ }
                        <div className="Requesterinfo">

                            <section className="Requesterdonornamecontainer">

                                <p className="RequesterdontorName">Name</p>

                                <p className="RequesterdonorNamedata">{Name}</p>

                            </section>

                            <section className="Requesterdonormobilecontainer">

                                <p className="Requesterdonormobile">Mobile Number</p>

                                <p className="Requesterdonormobiledata">{Mobilenumber}</p>

                            </section>

                            <section className="Requesterdonoradhaarcontainer">

                                <p className="Requesterdonoradhaar">Adhaar Number:</p>

                                <p className="Requesterdonoradhaardata">{Adhaar}</p>

                            </section>

                            <section className="Requesterdonorpancontainer">

                                <p className="Requesterdonorpan">Pan Number:</p>

                                <p className="Requesterdonorpandata">{Pan}</p>

                            </section>

                            <section className="Requesterdonoraddresscontainer">

                                <p className="Requesterdonoraddress">Address:</p>

                                <p className="Requesterdonoraddressdata">{Address}</p>

                            </section>

                            <section className="Requesterdonorusernamecontainer">

                                <p className="Requesterdonorusername">Username:</p>

                                <p className="Requesterdonorusernamedata">{username}</p>

                            </section>

                        </div>

                    </div>

                </div>

                { /*ACTIVE REQUEST CONTAINER*/ }
                <div className="Requesteractiverequestscontainer">

                    <p className="Requesteractiverequestsheading">
                        ACTIVE REQUESTS
                    </p>
                    

                    <ul className="Requesteractiverequestsbody">

                        {ActiveRequests.map((ele, key) => {
                            return (<li className="Requesteractiverequests" key={key} onClick={(e) => { console.log(ele); } }>
                                {ele}
                            </li>
                            );
                        })}

                    </ul>

                </div>
                { /*CONTAINER FOR INFORMATION ABOUT REQUEST*/}

                { /*CONTAINS THE TYPE OF REQUESTS FOR THE USER TO MAKE A REQUEST*/ }
                <div className="Requestermakerequestcontainer">

                    <p className="Requestermakerequestheading">Create a request</p>

                    <div className="Requestermakerequestbody">

                      { /*CALLING REQUESTTYPE COMPNENT TO BE MOUNTED 
                         * (THIS IS CALLED BEFORE THE USE EFFECT OF REQUESTERDASHBOARD COMPONENT IS CALLED.)
                         */ }
                        <Requesttype RequesterFormVisChanger={RequesterFormVisChanger} />

                    </div>

                </div>

            </div>}

            { /*THE ACTUAL REQUEST MAKER FORM*/ }
            {RequestingFormVis && <RequesterForm Type={SelectedType} RequesterUsername={username} RequesterFormVisChanger={RequesterFormVisChanger} />}
            
        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/

}

export default Requesterdashboard;