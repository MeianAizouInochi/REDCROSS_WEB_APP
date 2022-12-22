import "./requesterform.css";

import Axios from 'axios';

import { useState } from "react"

import DbURL from "../../../domainconfig";

const RequesterForm = (props) => {

    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES START---------------------------------------------------------------------------------------------------------------------------------------*/
    const Type = props.Type;

    const VerifiedUsername = props.RequesterUsername;

    const [Document1, setDocument1] = useState([]);

    const [Document1Img, setDocument1Img] = useState(null);

    const [Document1Desc, setDocument1Desc] = useState("");

    const [Document2, setDocument2] = useState([]);

    const [Document2Img, setDocument2Img] = useState(null);

    const [Document2Desc, setDocument2Desc] = useState("");

    const [Document3, setDocument3] = useState([]);

    const [Document3Img, setDocument3Img] = useState(null);

    const [Document3Desc, setDocument3Desc] = useState("");

    const [Document4, setDocument4] = useState([]);

    const [Document4Img, setDocument4Img] = useState(null);

    const [Document4Desc, setDocument4Desc] = useState("");

    const [Description, setDescription] = useState("");

    const [Title, setTitle] = useState("");

    const [CharacterRatioTitle, setCharacterRatioTitle] = useState(0);

    const [CharacterRatioDescription, setCharacterRatioDescription] = useState(0);
    /*-------------------------------------------------------------------------------------------------------------REQUIRED VARIABLES END---------------------------------------------------------------------------------------------------------------------------------------*/

    /*
     * THIS TITLE CHANGER NOTIFIER FUNCTION HANDLES TITLE CHANGING AND UPDATING THE NUMBER OF CHARACTERS USED IN THE INPUT FIELD.
     */
    const TitleChangeNotifier = (e) => {

        setTitle(e.target.value);

        var TitleString = e.target.value;

        var TitleStringLength = TitleString.length;

        setCharacterRatioTitle(TitleStringLength);

    }

    /*
     * THIS DESCRIPTION CHANGER NOTIFIER FUNCTION HANDLES DESCRIPTION CHANGING AND NUMBER OF CHARACTERS USED.
     */
    const DescriptionChangeNotifier = (e) => {

        setDescription(e.target.value);

        var DescriptionString = e.target.value;

        var DescriptionStringLength = DescriptionString.length;

        setCharacterRatioDescription(DescriptionStringLength);

    }

    /*
     * THIS IMAGE HANDLER FUNCTION HANDLES IMAGES DISPLAY AND CALLS IMAGE SETTER
     */
    const ImageHandler = (props1, props2) => {

        if (props1.target.files.length !== 0) {

            if (props2 === 1) {

                ImageSetter(props1, props2);

                setDocument1Img(URL.createObjectURL(props1.target.files[0]));
            }
            else if (props2 === 2) {

                ImageSetter(props1, props2);

                setDocument2Img(URL.createObjectURL(props1.target.files[0]));
            }
            else if (props2 === 3) {

                ImageSetter(props1, props2);

                setDocument3Img(URL.createObjectURL(props1.target.files[0]));
            }
            else if (props2 === 4) {

                ImageSetter(props1, props2);

                setDocument4Img(URL.createObjectURL(props1.target.files[0]));
            }
        }
    }

    /*
     * CALLED BY IMAGE HANDLER FUNCTION.
     * READS THE IMAGE AS A BINARY FILE AND SETS IT INTO RESPECTIVE STATE ARRAY.
     */
    function ImageSetter(props1, props2)
    {
        const filebytearray = [];

        const filereader = new FileReader();

        filereader.readAsArrayBuffer(props1.target.files[0]);

        filereader.onloadend = (evt) => {

            if (evt.target.readyState === FileReader.DONE) {

                const arraybuffer = evt.target.result,
                    array = new Uint8Array(arraybuffer);

                for (const a of array) {

                    filebytearray.push(a);
                }

                if (props2 == 1) {

                    setDocument1(filebytearray);

                }
                else if (props2 === 2) {

                    setDocument2(filebytearray);
                }
                else if (props2 === 3) {

                    setDocument3(filebytearray);
                }
                else if (props2 === 4) {

                    setDocument4(filebytearray);
                }
            }
        }
    }

    /*
     * THIS IS THE CANCEL FUNCTION, IT CANCELS THE FORM AND TAKES BACK TO DASHBOARD/REQUESTER PAGE.
     */
    const Cancel = () => {

        props.RequesterFormVisChanger("");
    }

    const HandleSubmit = (props) => {

        props.preventDefault();

        console.log("submitted");

        Submittion();
        console.log("Submittoin called");
        //submittion code here.
    }

    const Submittion = async () => {

        var CreateEntityResponse = await Axios.post(DbURL + "/api/CreateRequestEntity", {

            Type: Type,
            VerifiedUsername: props.RequesterUsername

        });

        if (CreateEntityResponse.status === 200) {

            //console.log(response);

            console.log("Got Table Created!");

            console.log("Sending Data...");

            var SendData1ToEntity = await SendReqData("Request_data", Description, Title, null, 0);

            if (SendData1ToEntity.status === 200) {

                var SendData2ToEntity = await SendReqData("Document1", null, Document1Desc, Document1, 0);

                if (SendData2ToEntity.status === 200) {

                    var SendData3ToEntity = await SendReqData("Document2", null, Document2Desc, Document2, 0);

                    if (SendData3ToEntity.status === 200) {

                        var SendData4ToEntity = await SendReqData("Document3", null, Document3Desc, Document3, 0);

                        if (SendData4ToEntity.status === 200) {

                            var SendData5ToEntity = await SendReqData("Document4", null, Document4Desc, Document4, 0);

                            if (SendData5ToEntity.status === 200) {

                                console.log("Succesfully uploaded data!.");

                                props.RequesterFormVisChanger("");
                            }
                            else {
                                console.log("Problem in Uploading Doc4!.");
                            }
                        }
                        else {
                            console.log("Problem in Uploading Doc3!.");
                        }
                    }
                    else {
                        console.log("Problem in Uploading Doc2!.");
                    }
                }
                else {
                    console.log("Problem in Uploading Doc1!.");
                }
            }
            else
            {
                console.log("Problem in Uploading Request_data!.");
            }
        }
        else
        {
            console.log("error occured when creating request table in db.(requester section)");
        }
    }

    /*
     * SEND REQUEST DATA FUNCTION -  CALLED IN SUBMITTION FUNCTION.
     */
    function SendReqData(DETAILS_TYPE, DETAILS_DESCRIPTION, DETAILS, FILE_DETAILS, REQUEST_ID)
    {
        var Response = Axios.post(DbURL + "/api/SendRequestData", {

            Type: Type,

            VerifiedUsername: VerifiedUsername,

            DETAILS_TYPE: DETAILS_TYPE,

            DETAILS_DESCRIPTION: DETAILS_DESCRIPTION,

            DETAILS : DETAILS,

            FILE_DETAILS : FILE_DETAILS,

            REQUEST_ID : REQUEST_ID
        });

        return Response;
    }
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER START.--------------------------------------------------------------------------------------------------*/
    return (
        <div className="RequesterFormContainerOuter">

            <form onSubmit={(e) => { HandleSubmit(e); } }>

                <label>Provide Your Request Title here:</label>

                { /*TITLE OF REQUEST*/ }
                <input className="Title" type="text" value={Title} maxLength="255" placeholder="Please Help me get money for Admission at cgcjhanjeri. " onChange={(e) => { TitleChangeNotifier(e); }} required />

                <div>{CharacterRatioTitle}/255</div>

                <label>Provide your Request Description here:</label>

                { /*DESCRIPTION OF REQUEST*/ }
                <textarea className="Description"  cols="100" rows="5" value={Description} maxLength="500" placeholder="Description" onChange={(e) => { DescriptionChangeNotifier(e); }} required />

                <div>{CharacterRatioDescription}/500</div>

                <label>Provide Supporting Documents here:</label>

                { /*CONTAINER FOR DOCUMENTS*/ }
                <div className="DocumentInputContainer">

                    { /*FIRST DOCUMENT*/ }
                    <div>
                        
                        <input type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 1); }} required />

                        <img src={Document1Img} alt="Document1" />

                    </div>

                    { /*SECOND DOCUMENT*/}
                    <div>

                        <input type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 2); }} required />

                        <img src={Document2Img} alt="Document2" />

                    </div>                    

                    { /*THIRD DOCUMENT*/}
                    <div>

                        <input type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 3); }} required />

                        <img src={Document3Img} alt="Document3" />

                    </div>                    

                    { /*FOURTH DOCUMENT*/}
                    <div>

                        <input type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 4); }} required />

                        <img src={Document4Img} alt="Document4" />

                    </div>
                    
                </div>

                <div>{Type}</div>

                <div className="SubmittionDivision" >

                    <button type="submit" value="Submit">Submit</button>

                    <button onClick={(e) => { Cancel(); }}>Cancel</button>

                </div>

            </form>

        </div>
    );
    /*------------------------------------------------------------------------------------------------THE JSX RENDER THAT WILL BE VISIBLE TO END-USER END.--------------------------------------------------------------------------------------------------*/
}
export default RequesterForm;