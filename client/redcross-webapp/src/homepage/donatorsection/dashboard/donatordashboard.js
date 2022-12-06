import { useEffect, useState } from "react";
import Axios from "axios";
import "./donatordashboard.css"
import RequestLoader from './RequestsLoader/RequestsLoader';

import DbURL from "../../../domainconfig";

const Donatordashboard = (props) => {

    const username = props.username;

    const donatorkeyword = "DONATOR_";

    const Fullusername = donatorkeyword + username;

    const [Name, setName] = useState("");

    const [Adhaar, setAdhaar] = useState("");

    const [Address, setAddress] = useState("");

    const [Pan, setPan] = useState("");

    const [Mobilenumber, setMobilenumber] = useState("");

    const [Imagevarbinaryarray, setImagevarbinaryarray] = useState(null);

    useEffect(() => {

        async function getuserdata() {

            var responsedata = await Axios.post(DbURL+"/api/getuserdata", {

                verifiedusername: Fullusername

            });

            setName(responsedata.data.recordset[0].DETAILS);

            setMobilenumber(responsedata.data.recordset[1].DETAILS);

            setAdhaar(responsedata.data.recordset[2].DETAILS);

            setAddress(responsedata.data.recordset[3].DETAILS);

            setPan(responsedata.data.recordset[4].DETAILS);

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

    }, [])



    


    return (

        <div className="Accountinfocontainer" >

            <div className="Accountinfo">

                <div className="Accountinfocover">

                    <div className="ProfilepicContainer">

                        {Imagevarbinaryarray !== null && <img src={`data:image/jpeg;base64,${Imagevarbinaryarray}`} className="Profilepic" />}

                    </div>

                    <div className="info">

                        <section className="donornamecontainer">

                            <p className="dontorName">Name</p>

                            <p className="donorNamedata">{Name}</p>

                        </section>

                        <section className="donormobilecontainer">

                            <p className="donormobile">Mobile Number</p>

                            <p className="donormobiledata">{Mobilenumber}</p>

                        </section>

                        <section className="donoradhaarcontainer">

                            <p className="donoradhaar">Adhaar Number:</p>

                            <p className="donoradhaardata">{Adhaar}</p>

                        </section>

                        <section className="donorpancontainer">

                            <p className="donorpan">Pan Number:</p>

                            <p className="donorpandata">{Pan}</p>

                        </section>

                        <section className="donoraddresscontainer">

                            <p className="donoraddress">Address:</p>

                            <p className="donoraddressdata">{Address}</p>

                        </section>

                        <section className="donorusernamecontainer">

                            <p className="donorusername">Username:</p>

                            <p className="donorusernamedata">{username}</p>

                        </section>

                    </div>

                </div>

            </div>

            <div className="Listofrequesters">

                <p className="CurrentRequestsText">Current Requests</p>

                <div className="Listofrequesterscover">

                    <RequestLoader DONATOR_TABLENAME={Fullusername} passingchangesectiondata={props.passingchangesectiondata} />

                </div>

            </div>

        </div>
    );
}

export default Donatordashboard;