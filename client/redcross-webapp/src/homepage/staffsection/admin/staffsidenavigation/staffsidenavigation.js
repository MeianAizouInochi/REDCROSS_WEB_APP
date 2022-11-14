import { useEffect, useState } from "react";
import "./staffsidenavigation.css";

import Uiupdate from "./navigatedcomponents/uiupdate/uiupdate";

import Uidataupdate from "./navigatedcomponents/uidataupdate/uidataupdate";

import Additionaluidataupdate from "./navigatedcomponents/additionaluidataupdate/additionaluidataupdate"

const Staffsidenavigation = () => {

    /*switches variables*/
    const [uiupdateswitch, setuiupdateswitch] = useState(true);//1

    const [uidataupdateswitch, setuidataupdateswitch] = useState(false);//2

    const [internalupdateswitch, setinternalupdateswitch] = useState(false);//3

    const [chatadministration, setchatadministration] = useState(false);//4

    const [additionaluidataupdate, setadditionaluidataupdate] = useState(false);//5

    function toggler(arg) {

        if (arg === 1 && !uiupdateswitch) {

            setuiupdateswitch(!uiupdateswitch);

            setuidataupdateswitch(false);

            setinternalupdateswitch(false);

            setchatadministration(false);

            setadditionaluidataupdate(false);
        }
        else if (arg === 2 && !uidataupdateswitch) {

            setuiupdateswitch(false);

            setuidataupdateswitch(!uidataupdateswitch);

            setinternalupdateswitch(false);

            setchatadministration(false);

            setadditionaluidataupdate(false);
        }
        else if (arg === 3 && !internalupdateswitch) {

            setuiupdateswitch(false);

            setuidataupdateswitch(false);

            setinternalupdateswitch(!internalupdateswitch);

            setchatadministration(false);

            setadditionaluidataupdate(false);
        }
        else if (arg === 4 && !chatadministration) {

            setuiupdateswitch(false);

            setuidataupdateswitch(false);

            setinternalupdateswitch(false);

            setchatadministration(!chatadministration);

            setadditionaluidataupdate(false);
        }
        else if (arg === 5 && !additionaluidataupdate) {

            setuiupdateswitch(false);

            setuidataupdateswitch(false);

            setinternalupdateswitch(false);

            setchatadministration(false);

            setadditionaluidataupdate(!additionaluidataupdate);
        }
    }

    //Resizing 
    const [pcsidenavbar, setpcsidenavbar] = useState(false);

    const [mobilesidenavbar, setmobilesidenavbar] = useState(false);

    

    useEffect(() => {

        window.innerWidth > 801 ? setpcsidenavbar(true) : setpcsidenavbar(false);

        window.innerWidth <= 801 ? setmobilesidenavbar(true) : setmobilesidenavbar(false);

        window.addEventListener("resize", () => {
           
            window.innerWidth > 801 ? setpcsidenavbar(true) : setpcsidenavbar(false);

            window.innerWidth <= 801 ? setmobilesidenavbar(true) : setmobilesidenavbar(false);
        });

        return window.removeEventListener("resize", () => {
            
            window.innerWidth > 801 ? setpcsidenavbar(true) : setpcsidenavbar(false);

            window.innerWidth <= 801 ? setmobilesidenavbar(true) : setmobilesidenavbar(false);
        });

    }, []);
    
    return (
        <div className="stafsidenavigationmothercontainer">

            <button onClick={() => { setmobilesidenavbar(!mobilesidenavbar) }} className="mobileopensidenavigation">Open Menu</button>

            {pcsidenavbar && (
                <div className="pcstaffsidenavigationcontainer">

                    <p className="pcstaffsidenavigationheading">Admin Menu</p>

                    <ul>

                        <li onClick={() => { toggler(1) }}><img src="/Staffsectionsvgs/uiupdate.svg" className="staffnavicons" />UI updates</li>

                        <li onClick={() => { toggler(2) }}><img src="/Staffsectionsvgs/uidataupdate.svg" className="staffnavicons" />UI Data updates</li>

                        <li onClick={() => { toggler(3) }}><img src="/Staffsectionsvgs/internalupdates.svg" className="staffnavicons" />Internal updates</li>

                        <li onClick={() => { toggler(4) }}><img src="/Staffsectionsvgs/chatadministration.svg" className="staffnavicons" />Chat administration</li>

                        <li onClick={() => { toggler(5) }}><img src="/Staffsectionsvgs/additionaluidataupdate.svg" className="staffnavicons" />Additional UI data update </li>

                    </ul>

                </div>)}

            {mobilesidenavbar && (<div className="mobilestaffsidenavigationcontainer">

                <p className="mobilestaffsidenavigationheading">Admin Menu

                    <button onClick={() => { setmobilesidenavbar(!mobilesidenavbar); }} className="mobilesidenavigationclose">X</button>

                </p>

                <ul>

                    <li onClick={() => { toggler(1); setmobilesidenavbar(!mobilesidenavbar); }}><img src="/Staffsectionsvgs/uiupdate.svg" className="staffnavicons" />UI updates</li>

                    <li onClick={() => { toggler(2); setmobilesidenavbar(!mobilesidenavbar); }}><img src="/Staffsectionsvgs/uidataupdate.svg" className="staffnavicons" />UI Data updates</li>

                    <li onClick={() => { toggler(3); setmobilesidenavbar(!mobilesidenavbar); }}><img src="/Staffsectionsvgs/internalupdates.svg" className="staffnavicons" />Internal updates</li>

                    <li onClick={() => { toggler(4); setmobilesidenavbar(!mobilesidenavbar); }}><img src="/Staffsectionsvgs/chatadministration.svg" className="staffnavicons" />Chat administration</li>

                    <li onClick={() => { toggler(5); setmobilesidenavbar(!mobilesidenavbar); }}><img src="/Staffsectionsvgs/additionaluidataupdate.svg" className="staffnavicons" />Additional UI data update </li>

                </ul>

            </div>)}

            <div className="navigatedcomponents">

                {uiupdateswitch && (<Uiupdate/>)}

                {uidataupdateswitch && (<Uidataupdate />)}

                {additionaluidataupdate && (<Additionaluidataupdate />) }

            </div>

        </div>
    );
}

export default Staffsidenavigation;