import style from "../assets/css/avatar.module.css";
import colors from "../assets/js/colors";
import { useState, useEffect } from 'react';

function Human(props) {
    const [headColor, setHeadColor] = useState(colors[7]);
    const [leftEye, setLeftEye] = useState(colors[5]);
    const [rightEye, setRightEye] = useState(colors[5])
    const [bodyColor, setBodyColor] = useState(colors[7]);
    const [legColor, setLegColor] = useState(colors[7]);

    const setStyle = (dna) => {

        setHeadColor(colors[dna[0]]);
        setLeftEye(colors[dna[1]]);
        setRightEye(colors[dna[2]]);
        setBodyColor(colors[dna[3]]);
        setLegColor(colors[dna[4]]);
    }

    useEffect(() => {
        if(!props.dna) return;
        setStyle(props.dna);
      }, [props.dna]);

    return (
        <div className={style.humanContainer}>
            <div
            className={style.head}
            style={{ backgroundColor: headColor }}>
            <div
                className={[style.eye, style.eyeLeft].join(' ')}
                style={{ backgroundColor: leftEye }}>
                <div className={style.eyeBall}></div>
            </div>
            <div
                className={[style.eye, style.eyeRight].join(' ')}
                style={{ backgroundColor: rightEye }}>
                <div className={style.eyeBall}></div>
            </div>        
            </div>
            <div className={style.bodyContainer}>
            <div className={style.headShadow}></div>
            <div className={style.body}
             style={{ backgroundColor: bodyColor }}></div>
             <div className={[style.arm, style.armRight].join(' ')}
             style={{ backgroundColor: bodyColor }}></div>
             <div className={[style.arm, style.armLeft].join(' ')}
             style={{ backgroundColor: bodyColor }}></div>
            <div className={style.legLeft}
             style={{ backgroundColor: legColor }}></div>
            <div className={style.legRight}
             style={{ backgroundColor: legColor }}></div>
            </div>          
        </div>
    );
}

export default Human;