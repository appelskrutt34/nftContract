import { useState } from 'react';
import Human from "../Human";
import { useEth } from "../../contexts/EthContext";

function CreateNFT() {
    const { createToken } = useEth();
    const [dna, setDna] = useState("75577");

    const colorRange = 7;

    const changeHeadColor = (e) => {
        setDna(dna.replaceAt(0, e.target.value));
    }
    const changeRightEyeColor = (e) => {
        setDna(dna.replaceAt(1, e.target.value));
    }

    const changeLeftEyeColor = (e) => {
        setDna(dna.replaceAt(2, e.target.value));
    }

    const changeBodyColor = (e) => {
        setDna(dna.replaceAt(3, e.target.value));
    }

    const changeLegColor = (e) => {
        setDna(dna.replaceAt(4, e.target.value));
    }
 
    const onSubmit = async() => {
        await createToken(dna);
    }

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }

    return ( 
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <Human dna={dna}/>
                </div>
                <div className="col">
                <ul className="list-group">
                    <li className="list-group-item">
                        <label htmlFor="headColorRange">Head Color</label>
                        <input className="form-range" 
                        type="range" 
                        id="headColorRange" 
                        onChange={changeHeadColor}
                        min="0" max={colorRange} /></li>
                        
                    <li className="list-group-item" >Eyes</li>
                    <li className="list-group-item">
                        <label htmlFor="eyeColorRangeLeft">Left Eye color</label>
                        <input className="form-range" 
                        type="range" 
                        id="eyeColorRangeLeft" 
                        onChange={changeLeftEyeColor}
                        min="0" max={colorRange}/>
                    </li>
                    <li className="list-group-item">
                        <label htmlFor="eyeColorRangeRight">Right Eye Color</label>
                        <input className="form-range" 
                        type="range" 
                        id="eyeColorRangeRight" 
                        onChange={changeRightEyeColor}
                        min="0" max="3"/>
                    </li>
                    <li className="list-group-item">Body</li>
                    <li className="list-group-item">
                        <label htmlFor="bodyColor">Body Color</label>
                        <input className="form-range" 
                        type="range" 
                        id="bodyColor" 
                        onChange={changeBodyColor}
                        min="0" max={colorRange}/>
                    </li>
                    <li className="list-group-item">
                        <label htmlFor="legColor">Leg Color</label>
                        <input className="form-range" 
                        type="range" 
                        id="legColor" 
                        onChange={changeLegColor}
                        min="0" max={colorRange}/>
                    </li>
                </ul>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary" onClick={onSubmit}>create nft</button>
            </div>
        </div>
     );
}

export default CreateNFT;