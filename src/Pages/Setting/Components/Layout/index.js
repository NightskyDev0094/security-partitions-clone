import React from "react";
import { connect } from "react-redux";
import "./index.scss";

const Layout = ({layout, setLayout, setStep}) => {
  const layout_titles = [
    'SINGLE WALL',
    'CORNER LEFT',
    'CORNER RIGHT',
    'U - SHAPE',
    '4 WALLS'
  ]
  const setData = (value) => {
    setLayout(value)
    setStep((state) => {return state + 1})
  }

  return (
		<div className="layout">
      {
        layout_titles.map((title, index) => {
          return (
            <div className={`card ${layout === index ? 'is-active' : ''}`} onClick={() => setData(index)} key={index}>
              <div>
                <div className="card-img">
                  <div></div>
                </div>
              </div>
              <div className="card-title">{title}</div>
            </div>
          )
        })
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
	layout: state.surface.Layout,
});

const mapDispatchToProps = (dispatch) => ({
  setLayout: (value) => {
    dispatch({
      type: 'SET_LAYOUT',
      payload: value
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);