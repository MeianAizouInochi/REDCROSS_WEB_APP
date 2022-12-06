

export default function RequestSelector({ Request_selected_by_user }) {


    return (
        <div className="requestselectorcontainer">

            <select className="requestselector" onChange={(e) => Request_selected_by_user(e.target.value)}>

                <option value="all" >All requests</option>

                <option value="MONETARY">Monetary</option>

                <option value="EDUCATIONAL">Educational</option>

                <option value="MEDICINAL">Medicinal</option>

                <option value="EDIBLE">Edible</option>

                <option value="MACHINARY">Machinery</option>

                <option value="MISCELLANEOUS">MISCELLANEOUS</option>

            </select>

        </div>

        )
}
//{Request_selected_by_user("MONETARY")
//MISCELLANEOUS