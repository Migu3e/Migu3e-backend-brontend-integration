import React from 'react';
import './ButtonGrid.css';
import Button1Lite from "./Buttons/1_LITE.tsx";
import Button2Freq from "./Buttons/2_FREQ.tsx";
import Button3Test from "./Buttons/3_TEST.tsx";
import Button4FncRst from "./Buttons/4_FNC_RST.tsx";
import Button5Clr from "./Buttons/5_CLR.tsx";
import Button6Sec from "./Buttons/6_SEC.tsx";
import Button7Aj from "./Buttons/7_AJ.tsx";
import Button8Ent from "./Buttons/8_ENT.tsx";


const ControlPanel: React.FC = () => (
    <div className="control-panel">
        <div className="button-grid">
            <Button1Lite/>
            <Button2Freq/>
            <Button3Test/>
            <Button4FncRst label="FNC" subLabel="RST" className="fnc-rst-button" />
            <Button5Clr label="CLR" className="arrow-button">
                <span className="arrow down">▼</span>
            </Button5Clr>
            <Button6Sec label="SEC" className="arrow-button">
                <span className="arrow up">▲</span>
            </Button6Sec>
            <Button7Aj label="AJ" className="arrow-button">
                <span className="arrow right">►</span>
            </Button7Aj>
            <Button8Ent/>
        </div>
        <div className="ers-container">
            <div className="ers-lines">
                <div className="ers-line"></div>
                <div className="ers-line"></div>
            </div>
            <div className="ers-text">ERS</div>
        </div>
    </div>
);

export default ControlPanel;