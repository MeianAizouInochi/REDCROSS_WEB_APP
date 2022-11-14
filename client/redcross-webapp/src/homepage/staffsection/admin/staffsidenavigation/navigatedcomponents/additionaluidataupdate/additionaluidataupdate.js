import "./additionaluidataupdate.css";



const Additionaluidataupdate = () => {
    return (
        <div className="additionaluidataupdatecontainer">
            <div className="additionaluidataupdateheading">
                <p>UI data update section</p>
                <hr />
            </div>
            <div className="additionaluiemergencynotificationcontainer">
            <div className="additionaluiemergencynotificationheading">
                <p>Emergency Notification section</p>
                <hr />
                </div>
               
                <input className="additionaluiemergencyupdateinput" placeholder="enter Emergency Statement here" />
                <button className="additionaluiemergencyupdatesubmitbutton">Issue Emergency</button>
            </div>
        </div>
    );
}

export default Additionaluidataupdate;