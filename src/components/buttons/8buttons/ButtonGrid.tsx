import React from 'react';
import './ControlPanel.css';

interface ButtonProps {
    label: string;
    subLabel?: string;
    className?: string;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, subLabel, className = '', children }) => (
    <button className={`button ${className}`}>
        {label}
        {subLabel && (
            <>
                <span className="button-divider"></span>
                <span className="sub-label">{subLabel}</span>
            </>
        )}
        {children}
    </button>
);

const ControlPanel: React.FC = () => (
    <div className="control-panel">
        <div className="button-grid">
            <Button label="LITE" />
            <Button label="FREQ" />
            <Button label="TEST" />
            <Button label="FNC" subLabel="RST" className="fnc-rst-button" />
            <Button label="CLR" className="arrow-button">
                <span className="arrow down">▼</span>
            </Button>
            <Button label="SEC" className="arrow-button">
                <span className="arrow up">▲</span>
            </Button>
            <Button label="AJ" className="arrow-button">
                <span className="arrow right">►</span>
            </Button>
            <Button label="ENT" />
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