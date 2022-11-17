import react, { useEffect, useState } from 'react'

import { GoPrimitiveDot } from 'react-icons/go'

import "./imagesliderv3.css"

import { Carousal } from './sliderdata.js'

import Announcementslider from "../announcements/announcementv3";

import { announcementdata } from "../announcements/announcementdata";


const Imageslider = () => {

    //VARIABLES
    var [slides, setslides] = useState([]);

    let [load, setload] = useState(0);

    const [current, setcurrent] = useState(0);

    const [flag, setflag] = useState(1);//THIS STATE IS USED TO CLEAN THE CRAOUSAL ARRAY

    const [NULL, setnull] = useState(0);//USED TO DISPLAY ERROR SLIDE IF DATA DIDN'T CAME INTO ARRAY.

    const length = slides.length;

    const [slideindex, setslideindex] = useState(0);

    //SYNCHRONIZER FUNCTION GETS DATA FROM SLIDERDATA MODULE AND STORES THEM INTO A ARRAY OF OBJECT 'slides'
    async function sync() {

        await Carousal().then(data => {

            console.log("RAW DATA " + data);
            setslides(slides = data);

        });

        setload(load = 1);

    }

    //USEEFFECT WHICH CALLS THE SYNCHRONIZER FUNCTION AND
    useEffect(() => {

        if (load === 0) {

            sync();

        }

    }, [])


    //FUNCTION TO TRAVERSE TO NEXT SLIDE
    const nextslide = () => {

        setcurrent(current === length - 1 ? 0 : current + 1)

        setslideindex(slideindex === length - 1 ? 0 : current + 1)

    }


    /*-----------------------------AUTO SCROLLER FUNCTIONALITY STARTS--------------------------*/

    //VARIABLES FOR AUTO SCROLL FUNCTIONALITY
    const autoscroll = true;
    let slideinterval;
    let intervaltime = 7000;

    //AUTO FUNCTION 
    function auto() {

        slideinterval = setInterval(nextslide, intervaltime)

    }

    //USEEFFECT WHICH RUNS THE AUTO FUNCTION
    useEffect(() => {

        if (autoscroll) {

            auto();

        }

        //clean up function, stops memory leaks
        return () => clearInterval(slideinterval);

    }, [current]);


    //FUNCTION FOR CONTAINER DOTS 
    const movedot = index => {
        setslideindex(index)
    }

    /*-----------------------------AUTO SCROLLER FUNCTIONALITY ENDS--------------------------*/



    /*-----------------------------IMPORTANT SECTION OF CRAOUSAL DEALS WITH LOADING SCREEN,ERROR SCREEN , EMPTY DATA START------------------------------------- */

    //THIS CHECKS IF THE ARRAY RECIVED IS NOT EMPTY AS THE DATA LOADS IT PUSHES A LOADING SCREEN IN COLLECTION
    if (!Array.isArray(slides) || slides.length <= 0) {

        setslides(oldArray => [...oldArray, { image: './loadingbanner.svg', description: "loading please wait" }]);

    }

    //THIS CLEANS UP ARRAY OF LOADING SCREEN AFTER RECIVING DATA
    if (slides.length > 2 && flag === 1 && NULL !== 1) {

        slides.shift();

        setflag(0);

    }

    //IF WE GOT A EMPTY ARRAY , NO DATA CAME 
    if (length === 1 && flag === 1) {

        setslides(oldArray => [...oldArray, { image: null, description: null }]);

        setnull(1);
    }

    /*-----------------------------IMPORTANT SECTION OF CRAOUSAL DEALS WITH LOADING SCREEN,ERROR SCREEN , EMPTY DATA END-------------------------------------- */


    return (
        <section className="slider">
            {
                slides.map((slide, index) => {

                    return (

                        <div className={index === current ? 'slide active' : 'slide'} key={index}>
                            {index === current && (
                                <>
                                    {console.log("its coming here")}
                                    <div className="bannerdescription">
                                        <p>{slide.description === null ? "Error displaying Info" : slide.description}</p>
                                    </div>
                                    <div className="imagedivision">
                                        <img src={slide.image === null ? './BannerOnError.svg' : slide.image} alt='banner' />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })
            }
            <div className="container-dots">
                {Array.from({ length: slides.length }).map((slides, index) => (
                    <GoPrimitiveDot className={index === current ? 'dot active' : 'dot'} key={index} />
                ))}
            </div>
            <div className="Announcementdivision">
                <Announcementslider announcementsdata={announcementdata} />
            </div>
        </section>
    )
}

export default Imageslider;