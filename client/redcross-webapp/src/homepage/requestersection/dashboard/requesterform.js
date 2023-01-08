import "./requesterform.css";

import Axios from 'axios';

import { useState } from "react"

import DbURL from "../../../domainconfig";

const RequesterForm = (props) => {

    const Type = props.Type;

    const [Document1, setDocument1] = useState([]);

    const [Document1Img, setDocument1Img] = useState(null);

    const [Document2, setDocument2] = useState([]);

    const [Document2Img, setDocument2Img] = useState(null);

    const [Document3, setDocument3] = useState([]);

    const [Document3Img, setDocument3Img] = useState(null);

    const [Document4, setDocument4] = useState([]);

    const [Document4Img, setDocument4Img] = useState(null);

    const [Description, setDescription] = useState("");

    const [Title, setTitle] = useState("");

    const [CharacterRatioTitle, setCharacterRatioTitle] = useState(0);

    const [CharacterRatioDescription, setCharacterRatioDescription] = useState(0);

    const Cancel = () => {

        props.RequesterFormVisChanger("");

    }

    const TitleChangeNotifier = (e) => {

        setTitle(e.target.value);

        var TitleString = e.target.value;

        var TitleStringLength = TitleString.length;

        setCharacterRatioTitle(TitleStringLength);

    }

    const DescriptionChangeNotifier = (e) => {

        setDescription(e.target.value);

        var DescriptionString = e.target.value;

        var DescriptionStringLength = DescriptionString.length;

        setCharacterRatioDescription(DescriptionStringLength);

    }

    const ImageHandler = (props1,props2) => {

        if (props1.target.files.length !== 0) {

            if (props2 === 1) {

                const filebytearray=[];

                const filereader = new FileReader();

                filereader.readAsArrayBuffer(props1.target.files[0]);

                filereader.onloadend = (evt) => {

                    if (evt.target.readyState === FileReader.DONE) {

                        const arraybuffer = evt.target.result,
                            array = new Uint8Array(arraybuffer);

                        for (const a of array) {

                            filebytearray.push(a);

                        }

                        setDocument1(filebytearray);
                    }

                }

                setDocument1Img(URL.createObjectURL(props1.target.files[0]));

            }
            else if (props2 === 2) {

                setDocument2Img(URL.createObjectURL(props1.target.files[0]));

            } else if (props2 === 3) {

                setDocument3Img(URL.createObjectURL(props1.target.files[0]));

            } else if (props2 === 4) {

                setDocument4Img(URL.createObjectURL(props1.target.files[0]));

            }

        }

    }

    const Submittion = () => {

        Axios.post(DbURL + "/api/CreateRequestEntity", {

            Type: Type,
            VerifiedUsername: props.RequesterUsername

        }).then((response) => {

            console.log(response);

            if (response.status === 200) {

                console.log("Got Table Created!");

            }

        }).catch(function (error) {

            console.log(error);

        });

    }
    const HandleSubmit = (props) => {

        props.preventDefault();

        console.log("submitted");

        Submittion();
       
        //submittion code here.
    }

    return (
        <div className="RequesterFormContainer">

            <form className="Formcontainer" onSubmit={(e) => { HandleSubmit(e); }}>

                <p><b>{Type} REQUEST FORM</b></p>

                <div className="Requesttitle">

                    <p>Provide Your Request Title here:</p>

                    <input className="Title" type="text" value={Title} maxLength="255" placeholder="Please Help me " onChange={(e) => { TitleChangeNotifier(e); }} required />
                
                    <p>{CharacterRatioTitle}/255</p>

                </div>

                <div className="RequestDescription">

                    <p>Provide your Request Description here:</p>

                    <textarea className="Description"  cols="100" rows="5" value={Description} maxLength="500" placeholder="Description" onChange={(e) => { DescriptionChangeNotifier(e); }} required />

                    <p>{CharacterRatioDescription}/500</p>

                </div>

                <div className="DocumentContainer">

                    <p>Provide Supporting Documents here:</p>

                    <div className="DocumentInputContainer">

                        <div className="DOCUMENT">

                            <input className="Documentinput" type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 1); }} required />

                            <img src={Document1Img === null ? './OnerrorDocumentPreview.svg' : Document1Img} alt="Document1" />

                            <textarea id="DocumentDescriptionTextInput"  maxLength="255" placeholder="Describe Document "/>

                        </div>

                        <div className="DOCUMENT">

                            <input className="Documentinput" type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 2); }} required />

                            <img src={Document2Img === null ? './OnerrorDocumentPreview.svg' : Document2Img } alt="Document2" />

                            <textarea id="DocumentDescriptionTextInput"  maxLength="255" placeholder="Describe Document " />

                        </div>                    

                        <div className="DOCUMENT">

                            <input className="Documentinput" type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 3); }} required />

                            <img src={Document3Img === null ? './OnerrorDocumentPreview.svg' : Document3Img} alt="Document3" />

                            <textarea id="DocumentDescriptionTextInput"  maxLength="255" placeholder="Describe Document " />

                        </div>                    

                        <div className="DOCUMENT">

                            <input className="Documentinput" type="file" accept="image/png, image/jpg" onChange={(e) => { ImageHandler(e, 4); }} required />

                            <img src={Document4Img === null ? './OnerrorDocumentPreview.svg' : Document4Img} alt="Document4" />

                            <textarea id="DocumentDescriptionTextInput"  maxLength="255" placeholder="Describe Document " />

                        </div>
                    
                    </div>

                </div>
                
            </form>

            <div className="SubmittionDivision" >

                <button id="requestsubmitbutton" type="submit" value="Submit">Submit</button>

                <button id="requestcancelbutton" onClick={(e) => { Cancel(); }}>Cancel</button>

            </div>

        </div>
        );
}
export default RequesterForm;