import react, { useEffect, useState } from 'react'
import { sliderdata } from './sliderdata'
//import { AiOutlineCaretLeft, AiOutlineCaretRight } from 'react-icons/ai'
import { GoPrimitiveDot } from 'react-icons/go'
import "./imagesliderv3.css"

//importing announcement section
import Announcementslider from "../announcements/announcementv3";
import { announcementdata } from "../announcements/announcementdata";

//creating a function which takes slides as arguments 
const Imageslider = ({ slides }) => {
    const [current, setcurrent] = useState(0);
    const length = slides.length;
    const [slideindex, setslideindex] = useState(0);

    //function to traverse to next slide.
    const nextslide = () => {
        setcurrent(current === length - 1 ? 0 : current + 1)
        setslideindex(slideindex === length - 1 ? 0 : current + 1)
    }

    const prevslide = () => {
        setcurrent(current === 0 ? length - 1 : current - 1)

    }
    //debugging purpose
    //console.log(current);



    //variable for autoscroll functionality
    const autoscroll = true;
    let slideinterval;
    let intervaltime = 7000;

    //autoscroll fuction
    function auto() {
        slideinterval = setInterval(nextslide, intervaltime)
    }

    //useEffect runs the function idependent of others,
    useEffect(() => {
        if (autoscroll) {
            auto();
        }
        //clean up function, stops memory leaks
        return () => clearInterval(slideinterval);
    }, [current]/*the elements in this array dosent get called, refreshed,(negation)*/ );


    //function for container dots
    const movedot = index => {
        setslideindex(index)
    }

    //to check if the array is not empty
    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    /* || BUTTONS ||
     <AiOutlineCaretLeft className="left-arrow" onClick={prevslide} />
            <AiOutlineCaretRight className="right-arrow" onClick={nextslide} />
     */

    //returning function
    return ( //returns the slider -> (slideactive,slide) -> bannerdescription and (left-arrow,right-arrow) classes
        <section className="slider">

            {sliderdata.map((slide, index) => {
                return (

                    <div className={index === current ? 'slide active' : 'slide'} key={index}>
                        {index === current && (
                            <>
                                <div className="bannerdescription">
                                    <p>{slide.description}</p>
                                </div>
                                <div className="imagedivision">
                                    <img src={slide.image} alt='banner'/>
                                </div>
                            </>
                        )}
                    </div>

                );
            })}
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