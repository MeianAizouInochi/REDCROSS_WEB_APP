import Navbar from "../navbar/navbar";

import RequesterNavbar from "./requesternavigation/requesternavbar";

import { useLocation } from "react-router-dom";

import Requesterdashboard from "./dashboard/requesterdashboard";

import Requesttypes from "./dashboard/requesttypes/requesttypes";

import Requesterchat from "./chat/requesterchat";

import { useState } from "react";

const Requesterpage = (props) => {

    let getdatafromredirect = useLocation();

    let username = props.UsernameData;

    const [Rsection, setRsection] = useState(0);

    const changesection = (props) => {

        setRsection(props)
    }

    return (

        <div className="Requesterpage">

            <div className="Requesternavbar">

                <RequesterNavbar passingchangesectiondata={changesection} />

            </div>

            {Rsection === 0 ? <div className="Requesterdashboard">

                <Requesterdashboard username={username} />

            </div> : (Rsection === 1 && < div className="Requesterdashboard">

                <Requesterchat username={username} />

            </div>) 
            }

        </div>
        );
}
export default Requesterpage;