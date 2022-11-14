import "./staffadmin.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Staffsidenavigation from "./staffsidenavigation/staffsidenavigation";

const Staffadministration = () => {
    
    return (

        <div className="staffadmincontainer">
           
                <Staffsidenavigation/>

        </div>
        )

}

export default Staffadministration;