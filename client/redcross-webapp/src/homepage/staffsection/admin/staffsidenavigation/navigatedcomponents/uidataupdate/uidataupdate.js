import "./uidataupdate.css";
import { AiOutlineArrowDown } from "react-icons/ai";


const Uidataupdate = () => {
    return (
        <div className="uidataupdatecontainer">

            <div className="uidataupdateheading">
                <p>UI data update section</p>
                <hr />
            </div>

            <div className="uidataannouncementupdatecontainer">
                <div className="announcementupdateheading">
                    <p>Annoucement update </p>
                    <hr />
                </div>
                <select  className="uidataannouncementselctor">
                    <option value="annpucement1" >Annoucement1</option>
                    <option value="annpucement2">Annoucement2</option>
                    <option value="annpucement3">Annoucement3</option>
                    <option value="annpucement4">Annoucement4</option>
                </select>
                <input className="announcementupdateinput" placeholder="Selected announcement appear here" />
                <AiOutlineArrowDown className="uiupdatedownarrow" />
                <input className="announcementupdateinput" placeholder="enter new annoucements here" />
                <button className="announcementupdatesubmitbutton">submit Annoucements</button>
            </div>

            <div className="uidatafooterupdatecontainer">
                <div className="uidatafooterupdateheading">
                    <p>footer updates </p>
                    <hr />
                </div>
                <p>Address Replacement</p>
                <input className="uidatafooterupdateinput" placeholder="enter address here" />
                <button className="uidatafooterupdatesubmitbutton">Update Address</button>
                <p>contract (Phoneno) Replacement</p>
                <input className="uidatafooterupdateinput" placeholder="enter phone no's here" />
                <button className="uidatafooterupdatesubmitbutton">Update phone no</button>
                <p>contract (email) Replacement</p>
                <input className="uidatafooterupdateinput" placeholder="enter email here" />
                <button className="uidatafooterupdatesubmitbutton">Update Email</button>
            </div>

            <div className="uidatabankingdetailupdatecontainer">
                <div className="uidatabankingdetailupdateheading">
                    <p>Banking detail update</p>
                    <hr />
                </div>

                <p>Note*:end annoucement with with four hash#,"####"</p>
                <input className="uidatabankingdetailupdateinput" placeholder="enter your Banking Details here" />
                <button className="uidatabankingdetailupdatesubmitbutton">Update Bankingdetail</button>
            </div>
            <div className="allsqlupdatecontainer">
                <div className="allsqlupdateheading">
                    <p>all sql update</p>
                    <hr />
                </div>
            </div>
        </div>
            )
}

export default Uidataupdate;