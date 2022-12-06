import Navbar from "../navbar/navbar";

import DonatorNavbar from "./donatornavigation/donatornavbar";

import { useLocation } from "react-router-dom";

import Donatordashboard from "./dashboard/donatordashboard";

import Donatorchat from "./chat/donatorchat";

import { useState } from "react";

const Donatorpage = (props) => {

    let getdatafromredirect = useLocation();

    let username = props.UsernameData;

    const [Dsection, setDsection] = useState(0);

    const changesection = (props) => {

        setDsection(props)
    }

    return (

        <div className="Donatorpage">

            <div className="Donatornavbar">

                <DonatorNavbar passingchangesectiondata={changesection} />

            </div>

            {Dsection === 0 ? <div className="Donatordashboard">

                <Donatordashboard username={username} passingchangesectiondata={changesection} />

            </div> : <div className="Donatordashboard">

                    <Donatorchat username={username} />

            </div>
            }

        </div>
        );
}
export default Donatorpage;