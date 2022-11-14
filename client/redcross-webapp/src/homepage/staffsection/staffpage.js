import Navbar from "../navbar/navbar";

import Staffnavbar from "./staffnavigation/staffnavbar";

import Staffdashboard from "./dashboard/staffdashboard";

import Staffadministration from "./admin/staffadmin";

import { useEffect, useState } from "react";
import Axios from 'axios';

const Staffpage = () => {
   
    const [Dsection, setDsection] = useState(0);

    const changesection = (props) => {

        setDsection(props)
    }

    return (

        <div className="staffpage" >

            <div className="staffpageNavbar">

                <Navbar />

            </div>

            <div className="staffpage">

                <Staffnavbar passingchangesectiondata={changesection} />

            </div>

            {Dsection === 0 ? <div className="staffdashboard">

                <Staffdashboard />

            </div> : <div className="staffAdministration" >

                    <Staffadministration />

            </div>}

        </div>
    );
}
export default Staffpage;