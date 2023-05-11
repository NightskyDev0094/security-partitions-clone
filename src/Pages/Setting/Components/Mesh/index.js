import React from "react";
import { connect } from "react-redux";
import "./index.scss";

import MeshImg from 'Assets/Images/mesh.png'

const Mesh = ({mesh, setMesh, setStep}) => {
  const mesh_items = [
    'WIRE MESH',
    'DEA / PHARMA',
    'SERVER / DATA',
    'TOOL CRIB',
    'DRIVER CAGE',
    'MACHINE',
    'EVIDENCE LOCKER',
    'HOLDING CELL'
  ]

  const setData = (value) => {
    setMesh(value);
    setStep((state) => {return state + 1})
  }

  return (
		<div className="mesh">
      {
        mesh_items.map((title, index) => {
          return (
            <div className={`card ${mesh === index ? 'is-active' : ''}`} onClick={() => setData(index)} key={index}>
              <div>
                <div className="card-img">
                  <img src={MeshImg} alt="" />
                </div>
                <div className="card-title">{title}</div>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

const mapStateToProps = (state) => ({
	mesh: state.surface.Mesh,
});

const mapDispatchToProps = (dispatch) => ({
  setMesh: (value) => {
    dispatch({
      type: 'SET_MESH',
      payload: value
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Mesh);