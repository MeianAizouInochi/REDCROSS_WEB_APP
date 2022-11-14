
import { useEffect, useState } from "react";

import "./uiupdate.css";

import Axios from "axios";

import DbURL from "../../../../../../domainconfig";

const Uiupdate = () => {

    //Logo states start.
    const [UploadingLogoPicData, setUploadingLogoPicData] = useState([]);

    const [UploadingLogoPic, setUploadingLogoPic] = useState(null);

    const [LogoUploadButtonVis, setLogoUploadButtonVis] = useState(true);

    const [CurrentLogoImage, setCurrentLogoImage] = useState(null);

    const [DbLogoStatus, setDbLogoStatus] = useState(false);
    //Logo states end.

    //Carousel states start.
    const [UploadingCarouselPicData, setUploadingCarouselPicData] = useState([]);

    const [CurrentCarouselImage, setCurrentCarouselImage] = useState(null);

    const [UploadingCarouselPic, setUploadingCarouselPic] = useState(null);

    const [TotalCarouselPicinDb, setTotalCarouselPicinDb] = useState(0);

    const [CarouselLinkerArray, seteCarouselLinkerArray] = useState([]);

    const [CarouselUpdaterCurrentIndex, setCarouselUpdaterCurrentIndex] = useState(0);

    const [CarouselUploadButtonVis, setCarouselUploadButtonVis] = useState(true);
    //Carousel states end.


    //Getting db assets in the beginning.
    useEffect(() => {

        GetCarouselItemCount();
        GetLogoImage();

    }, []);

    //getting number of Carousel stored in DB
    const GetCarouselItemCount = async () => {

        const requiredURL = DbURL + "/api/admin/getCarouseldata";

        const response = await Axios.post(requiredURL, {

            SEMA: 0,
            ID: 0,
            RequiredItem: 'ITEMS'

        }, { withCredentials:true });

        if (response.data.recordset.length === 0) {

            console.log("Something Bad Happened!");

        }
        else if (response.data.recordset.length === 1) {

            setTotalCarouselPicinDb(response.data.recordset[0].ITEMS);

            var arr = [];

            for (var i = 0; i < TotalCarouselPicinDb; i++) {

                arr.push(i + 1);

            }

            seteCarouselLinkerArray(arr);

        }
        else {

            console.log("Dublicacy error! in db.");

        }
    }

    const GetCarouselImage = async () => {

        if (CarouselUpdaterCurrentIndex !== 0) {

            const requiredURL = DbURL + "/api/admin/getCarouseldata";

            var Carouseldata = await Axios(requiredURL, {

                ID: CarouselUpdaterCurrentIndex,
                RequiredItem: 'PICTURE',
                SEMA: 2

            });

            console.log(Carouseldata);
        }

    }

    //getting the Logo Image stored in the DB.
    const GetLogoImage = async () => {

        const requiredURL = DbURL + "/api/admin/getdblogo";

        var imagedata = await Axios.post(requiredURL);

        if (imagedata.data.recordset.length === 0) {

            setCurrentLogoImage(null);

            setDbLogoStatus(false);

        }
        else if (imagedata.data.recordset.length === 1) {

            const base64String = await btoa(String.fromCharCode(...new Uint8Array(imagedata.data.recordset[0].PICTURE.data)));

            //console.log(base64String);

            setCurrentLogoImage(base64String);

            setDbLogoStatus(true);

        }
    }

    //Uploading new Logo to DB.
    const UploadLogoProcessStart = () => {

        const requiredURL = DbURL + "/api/admin/logoupdate";

        if (DbLogoStatus) {

            Axios.post(requiredURL, {

                RequestId: 1,
                LogoImage: UploadingLogoPicData

            }).then((response) => {

                console.log(response.status);

                if (response.status === 200) {

                    //console.log("success!");

                    GetLogoImage();

                    setUploadingLogoPic(null);

                    setLogoUploadButtonVis(!LogoUploadButtonVis);
                }

            }).catch(function (error) {

                console.log(error);

            });

        }
        else {

            const requiredURL = DbURL + "/api/admin/logoupdate";

            Axios.post(requiredURL, {

                RequestId: 0,
                LogoImage: UploadingLogoPicData

            }).then((response) => {

                console.log(response.status);

                if (response.status === 200) { console.log("success!"); }

            }).catch(function (error) {

                console.log(error);

            });

        }


    }

    //checking logo before Uploading.
    const CheckLogoBeforeUpload = () => {

        //console.log(DbLogoStatus);

        if (UploadingLogoPicData !== null) {

            if (UploadingLogoPicData.length > 102400) {

                alert("Pic size is greater than 100kb.");

            }
            else if (UploadingLogoPicData.length !== 0 && UploadingLogoPicData.length <= 102400) {

                console.log(UploadingLogoPicData);

                setLogoUploadButtonVis(!LogoUploadButtonVis);

            }
            else if (UploadingLogoPicData.length === 0) {

                alert("Please choose a Logo Pic to upload first!");

            }
        }
        else {

            alert("Something Unexpected Happened!");

        }
    }

    //converting logo data to send to DB.
    const convert_Logo_pic_data = (props) => {

        if (props !== null) {

            const filebytearray = [];

            const filereader = new FileReader();

            if (props.target.files.length !== 0) {

                filereader.readAsArrayBuffer(props.target.files[0]);

                filereader.onloadend = (evt) => {

                    if (evt.target.readyState === FileReader.DONE) {

                        const arraybuffer = evt.target.result,
                            array = new Uint8Array(arraybuffer);

                        for (const a of array) {

                            filebytearray.push(a);
                        }

                        setUploadingLogoPicData(filebytearray);

                        setUploadingLogoPic(URL.createObjectURL(props.target.files[0]));

                    }

                }

            }

        }
    }

    //converting carousel pic data for sending to DB.
    const convert_Carousel_pic_data = (props) => {

        if (props !== null) {

            const filebytearray = [];

            const filereader = new FileReader();

            if (props.target.files.length !== 0) {

                filereader.readAsArrayBuffer(props.target.files[0]);

                filereader.onloadend = (evt) => {

                    if (evt.target.readyState === FileReader.DONE) {

                        const arraybuffer = evt.target.result,
                            array = new Uint8Array(arraybuffer);

                        for (const a of array) {

                            filebytearray.push(a);
                        }

                        setUploadingCarouselPicData(filebytearray);

                        setUploadingCarouselPic(URL.createObjectURL(props.target.files[0]));

                    }

                }

            }

        }

    }

    //checking Carousel Pic before Upload.
    const CheckCarouselBeforeUpload = () => {

        if (UploadingCarouselPicData !== null) {

            if (UploadingCarouselPicData.length > 102400) {

                alert("Pic size is greater than 100kb.");

            }
            else if (UploadingCarouselPicData.length !== 0 && UploadingCarouselPicData.length <= 102400) {

                console.log(UploadingCarouselPicData);

                setCarouselUploadButtonVis(!CarouselUploadButtonVis);

            }
            else if (UploadingCarouselPicData.length === 0) {

                alert("Please choose a Logo Pic to upload first!");

            }
        }
        else {

            alert("Something Unexpected Happened!");

        }
    }
    const UploadCarouselProcessStart = () => {

        const requiredURL = DbURL + "/api/admin/CarouselUpdate"; 

        if (DbLogoStatus) {

            Axios.post(requiredURL, {

                ID: CarouselUpdaterCurrentIndex,
                PICTURE: UploadingCarouselPicData

            }).then((response) => {

                console.log(response.status);

                if (response.status === 200) {

                    //console.log("success!");

                    GetLogoImage();

                    setUploadingLogoPic(null);

                    setLogoUploadButtonVis(!LogoUploadButtonVis);
                }

            }).catch(function (error) {

                console.log(error);

            });

        }
        else {

            const requiredURL = DbURL + "/api/admin/logoupdate";

            Axios.post(requiredURL, {

                RequestId: 0,
                LogoImage: UploadingLogoPicData

            }).then((response) => {

                console.log(response.status);

                if (response.status === 200) { console.log("success!"); }

            }).catch(function (error) {

                console.log(error);

            });

        }


    }
        return (
            <div className="uiupdatecontainer">

                <div className="uiupdateheading">

                    <p>UI Updates</p>

                    <hr />

                </div>

                <div className="uiupdatelogoupdatecontainer">

                    <div className="logoupdateheading">

                        <p>Logo section</p>

                        <hr />

                    </div>

                    <p>Current logo View</p>

                    <img src={CurrentLogoImage === null ? "../onerrorimage.svg" : `data:image/jpeg;base64,${CurrentLogoImage}`} className="uiupdatecurrentlogoimg" alt="Current Logo" onError={({ currentTarget }) => {

                        currentTarget.onerror = null;
                        currentTarget.src = "../onerrorimage.svg";

                    }} />

                    <p>uploaded logo View</p>

                    <img src={UploadingLogoPic} className="uiupdateupdatedlogoimg" alt="" onError={({ currentTarget }) => {

                        currentTarget.onerror = null; // prevents looping

                        currentTarget.src = "../onerrorimage.svg";

                    }} />

                    {LogoUploadButtonVis && < input type='file' className="ImageUploadinput" accept="image/png, image/jpg" onChange={(e) => { convert_Logo_pic_data(e); }} />}

                    {LogoUploadButtonVis && <button className="changelogobutton" onClick={(e) => { CheckLogoBeforeUpload(); }}>Upload logo</button>}

                    {!LogoUploadButtonVis && <button className="changelogobutton" onClick={(e) => { UploadLogoProcessStart(); }}> Confirm Upload logo</button>}

                    {!LogoUploadButtonVis && <button className="changelogobutton" onClick={(e) => { setLogoUploadButtonVis(!LogoUploadButtonVis); setUploadingLogoPic(null); }}> Cancel Upload Logo</button>}

                </div>

                <div className="uibannerdatacontainer">

                    <div className="carouselupdateheading">

                        <p>carousel section</p>

                        <hr />

                    </div>

                    <label>Chooose the index of the Carousel to change-</label>

                    <select id="CarouselIndex" name="CarouselIndex" onChange={(e) => { setCarouselUpdaterCurrentIndex(e.target.value); }}>

                        <option value={0}>-None Selected-</option>

                        {CarouselLinkerArray.map((element, key) => {

                            return <option value={element}>{ element}</option>

                        })}

                    </select>

                    <div className="bannerimgcontainer1">

                        <p>Current carousel image 1 </p>

                        <img src="/first.jpg" className="bannerimg1" />

                        <p>New uploaded carousel image 1 </p>

                        <img src="" className="bannerimg1" onError={({ currentTarget }) => {

                            currentTarget.onerror = null; // prevents looping

                            currentTarget.src = "../onerrorimage.svg";

                        }} />

                        {CarouselUploadButtonVis && <input type="file" className="ImageUploadinput" accept="image/png, image/jpg" onChange={(e) => { convert_Carousel_pic_data(e); }} />}

                        {CarouselUploadButtonVis && <button className="changebannerbutton" onClick={() => { CheckCarouselBeforeUpload(); }}>upload new carousel image</button>}

                        {!CarouselUploadButtonVis && <button className="changebannerbutton" onClick={() => { CheckCarouselBeforeUpload(); }}>Confirm upload</button>}


                    </div>

                </div>

            </div>);
}
export default Uiupdate;
