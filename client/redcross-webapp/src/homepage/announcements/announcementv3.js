
import { announcementdata } from './announcementdata';
import { GoMegaphone } from 'react-icons/go';
import "./announcementv3.css";


const Announcementslider = ({ announcementsdata }) => {
    //const spaces = ' '.repeat(5);
    const addedstring = announcementdata.join("\n \n #");
    const finalstring = "#" + addedstring;

    if (!Array.isArray(announcementdata) || announcementdata.length <= 0) {
        return null;
    }

    //returning 
    return (
        <section className="Announcementslider">
            <div className="headingdivision">
                <p className="headingtext">Announcements</p>
                <GoMegaphone className="Announcementsicon" />
            </div>
            <marquee direction="up" className="Marquee">
                <pre className="Marqueetext">{finalstring}</pre>
            </marquee>
        </section>
    );
}


export default Announcementslider;