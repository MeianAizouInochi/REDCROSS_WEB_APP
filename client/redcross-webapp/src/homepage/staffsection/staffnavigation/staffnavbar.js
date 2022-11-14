import "./staffnavbar.css";
import { IoMdArrowDropdown } from 'react-icons/io';
import { BsChatSquareTextFill } from 'react-icons/bs';
import { IoMagnetSharp } from 'react-icons/io5';
const Staffnavbar = (props) => {

    return (
        <nav className="staffnavbar">

            <ul className="staffnavbarulcontainer" >

                <li className="staffnavbarDashboard" onClick={() => { props.passingchangesectiondata(0) }}>

                    Dashboard

                </li>

                <li className="staffnavbaradmin" onClick={() => { props.passingchangesectiondata(1) }}>

                    Administration

                </li>

            </ul>

            <div className="staffnavbarmagnet">
                <IoMagnetSharp className="magnetimg" />
            </div>

        </nav>
    );
}
export default Staffnavbar;