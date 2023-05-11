import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

import Mesh from "./Components/Mesh";
import Layout from "./Components/Layout";
import Tall from "./Components/Tall";
import Ceil from "./Components/Ceil";
import EachWall from "./Components/EachWall";

const Setting = () => {
  const settingTitltes = [
    'What kind of mesh?',
    'What kind of layout?',
    'How tall',
    'Do your partitions need a ceiling?',
    'What goes on each wall?',
    'Add measurements',
    'Review',
    'Checkout '
  ]
  const [step, setStep] = useState(0);
  let maxStep = useRef(0);

  useEffect(() => {
    maxStep.current = maxStep.current < step ? step : maxStep.current;
  }, [step])

  return (
		<div className="setting">
			<div className="setting-header">
        <div className="title">{ settingTitltes[step] }</div>
        <div className="d-flex align-items-center">
          <div className="arrow" onClick={() => setStep(step - 1)} style={{ visibility: step ? 'visible' : 'hidden' }}>
            <i className="d-flex align-items-center bi bi-chevron-left"></i>
          </div>
          <div className="step">{ step + 1 + ' / ' + settingTitltes.length }</div>
          <div className="arrow" onClick={() => setStep(step + 1)} style={{ visibility: maxStep.current > step ? 'visible' : 'hidden' }}>
            <i className="d-flex align-items-center bi bi-chevron-right"></i>
          </div>
        </div>
      </div>
      <div className="setting-content">
        { step === 0 && <Mesh setStep={setStep} /> }
        { step === 1 && <Layout setStep={setStep} /> }
        { step === 2 && <Tall setStep={setStep} /> }
        { step === 3 && <Ceil setStep={setStep} /> }
        { step === 4 && <EachWall setStep={setStep} /> }
      </div>
		</div>
  );
};

export default Setting;
