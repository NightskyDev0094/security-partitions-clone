import React from "react";
import { connect } from "react-redux";
import "./index.scss";

const Tall = ({tall, setTall, setStep}) => {
  const tall_titles = [
    '8 FT',
    '9 FT',
    '10 FT'
  ]
  const setData = (value) => {
    setTall(value);
    setStep((state) => {return state + 1})
  }

  return (
		<div className="tall">
      {
        tall_titles.map((title, index) => {
          return (
            <div className={`card ${tall === index ? 'is-active' : ''}`} onClick={() => setData(index)} key={index}>
              <div className="card-img"></div>
              <div className="card-title">{title}</div>
            </div>
          )
        })
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
	tall: state.surface.Tall,
});

const mapDispatchToProps = (dispatch) => ({
  setTall: (value) => {
    dispatch({
      type: 'SET_TALL',
      payload: value
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tall);