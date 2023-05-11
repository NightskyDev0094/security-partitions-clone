import React from "react";
import { connect } from "react-redux";
import "./index.scss";

const Ceil = ({ ceil, setCeil, setStep }) => {
  const setData = (value) => {
    setCeil(value);
    setStep((state) => {return state + 1})
  }
  
  return (
		<div className="ceil">
      <div className={`card ${ceil === true ? 'is-active' : ''}`} onClick={() => setData(true)}>
        <div className="card-img"></div>
        <div className="card-title">YES</div>
      </div>
      <div className={`card ${ceil === false ? 'is-active' : ''}`} onClick={() => setData(false)}>
        <div className="card-img"></div>
        <div className="card-title">NO</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
	ceil: state.surface.Ceil,
});

const mapDispatchToProps = (dispatch) => ({
  setCeil: (value) => {
    dispatch({
      type: 'SET_CEIL',
      payload: value
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Ceil);