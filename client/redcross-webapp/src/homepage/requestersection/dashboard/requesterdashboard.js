import { useEffect, useState } from "react";

import Axios from "axios";

import "./requesterdashboard.css"

import Requesttype from "./requesttypes/requesttypes";

import DbURL from "../../../domainconfig";
import RequesterForm from "./requesterform";

const Donatordashboard = (props) => {

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

    useEffect(() => {

        async function getuserdata() {

            var responsedata = await Axios.post(DbURL+"/api/getuserdata", {

                verifiedusername: Fullusername

            });

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

        getuserdata();
        
    },[]);

    useEffect(() => {

        async function getImage() {

            var responseimagedata = await Axios.post(DbURL+"/api/getuserimagedata", {

                username: Fullusername

            });

            console.log(responseimagedata.data);

            const base64string = await btoa(String.fromCharCode(...new Uint8Array(responseimagedata.data.recordset[0].DETAILS.data)));

            setImagevarbinaryarray(base64string);

        }
        getImage();

    },[])

    const RequesterFormVisChanger = (props) => {

        setRequestingFormVis(!RequestingFormVis);

        setRequesterPageVis(!RequesterPageVis);

        setSelectedType(props);

    }
    return (
        <div className="Requesterdashboardmothercontainer">
            {RequesterPageVis && <div className="Requesterdashboardcontainer" >

                <div className="RequesterAccountinfo">

                    <div className="RequesterAccountinfocover">

                        <div className="RequesterProfilepicContainer">

                            {Imagevarbinaryarray !== null && <img src={`data:image/jpeg;base64,${Imagevarbinaryarray}`} width="260" height="260" className="RequesterProfilepic" />}

                        </div>

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

                <div className="Requesteractiverequestscontainer">

                    <p className="Requesteractiverequestsheading">

                        Active Requests

                    </p>

                    <ul className="Requesteractiverequestsbody">

                        <li className="Requesteractiverequests">Active Request1</li>

                    </ul>

                </div>



                <div className="Requestermakerequestcontainer">

                    <p className="Requestermakerequestheading">Create a request</p>

                    <div className="Requestermakerequestbody">

                        <Requesttype RequesterFormVisChanger={RequesterFormVisChanger} />

                    </div>

                </div>

            </div>}
            {RequestingFormVis && <RequesterForm Type={SelectedType} RequesterUsername={username} RequesterFormVisChanger={RequesterFormVisChanger} />}
            
        </div>
        
    );
}

export default Donatordashboard;