import React, { useState } from "react";
import { connect } from 'react-redux';
import "./index.scss";

import Measurements from './Components/Measurements';
import WallFeatures from "./Components/WallFeatures";
import DoorHandOption from "./Components/DoorHandOption";
import DoorWide from "./Components/DoorWide";
import DoorPos from "./Components/DoorPos"

const SettingModal = ({ activeModal, toggleModal, wallTitle, setSideWidth, setDoorOption }) => {
	const optionTitles = [
		'ADD MEASUREMENTS',
		'WHAT GOES ON THIS WALL',
		'HOW IS THE DOOR HANDED', 
		'HOW WIDE IS THE DOOR',
		'WHERE IS THE DOOR'
	]

	const [step, setStep] = useState(0)
	// Measurements
	const [lengthAsFT, setLengthAsFT] = useState(0)
	const [lengthAsIN, setLengthAsIN] = useState(0)
	const [lengthAsFraction, setLengthAsFraction] = useState(0)
	// WHAT GOES ON THIS WALL
	const [doorStyle, setDoorStyle] = useState('')
	// HOW IS THE DOOR HANDED
	const [doorHandOption, setDoorHandOption] = useState('')
	// HOW WIDE IS THE DOOR
	const [doorWide, setDoorWide] = useState(0)
	// WHERE IS THE DOOR
	const [doorPos, setDoorPos] = useState('')

	const nextStep = () => {
		if(
			step < 1 ||
			(step < optionTitles.length - 1 && doorStyle)
		)
			setStep(step + 1);
		else {
			setSideOption();
			setStep(0);
			toggleModal()
		}
	}
	const prevStep = () => {
		if(step > 0) setStep(step - 1);
	}
	const closeModal = (e) => {
		let target = e.target;

		if(target.querySelector('.modal-content')) {
			setStep(0);
			toggleModal()
		}
	}
	const setSideOption = () => {
		const pos = () => {
			switch(wallTitle) {
				case 'Wall 1':
					return 'Left'
				case 'Wall 2':
					return 'Bottom'
				case 'Wall 3':
					return 'Right'
				default:
					return 'Left'
			}
		}
		const FT = 12;

		// Set the width of the side
		let width = lengthAsFT * FT + lengthAsIN + lengthAsFraction;

		if(pos() === 'Left' || pos() === 'Right') {
			setSideWidth(width, 'Left')
			setSideWidth(width, 'Right')
		} else setSideWidth(width, pos())

		// Set the door on the side
		let door = {
			style: doorStyle,
			hand_option: doorStyle ? doorHandOption : '',
			wide: doorStyle ? doorWide : 0,
			pos: doorStyle ? doorPos : ''
		}
		setDoorOption(door, pos());
	}

  return (
		<div className={`setting-modal ${ activeModal ? "show" : "fade" }`} onClick={(e) => closeModal(e)}>
			<div className="modal-content">
				<div className="title">Configrue { wallTitle }</div>
				<div className="options" style={{width: `calc(100% * ${optionTitles.length})`, transform: `translateX(calc(-100% / ${optionTitles.length} * ${step}))`}}>
					{
						optionTitles.map((title, index) => {
							return (
								<div className="option-content" key={index}>
									<div>
										<div className="d-flex justify-content-between step-title">
											<div className="arrow" onClick={() => prevStep()} style={{ visibility: step ? 'visible' : 'hidden' }}>
												<i className="d-flex align-items-center bi bi-chevron-left"></i>
											</div>
											<div>{`${index + 1}. ${title}`}</div>
											<div className="arrow" onClick={() => nextStep()} style={{ visibility: step < 1 || (step < optionTitles.length - 1 && doorStyle) ? 'visible' : 'hidden' }}>
												<i className="d-flex align-items-center bi bi-chevron-right"></i>
											</div>
										</div>
										{
											index === 0 &&
											<Measurements
												lengthAsFT={lengthAsFT}
												lengthAsIN={lengthAsIN}
												lengthAsFraction={lengthAsFraction}
												setLengthAsFT={setLengthAsFT}
												setLengthAsIN={setLengthAsIN}
												setLengthAsFraction={setLengthAsFraction}
											/>
										}
										{
											index === 1 &&
											<WallFeatures
												doorStyle={doorStyle}
												setDoorStyle={setDoorStyle}
												setDoorWide={setDoorWide}
												setDoorPos={setDoorPos}
											/>
										}
										{
											index === 2 &&
											<DoorHandOption
												doorHandOption={doorHandOption}
												setDoorHandOption={setDoorHandOption}
												doorStyle={doorStyle}
											/>
										}
										{ index === 3 && <DoorWide doorStyle={doorStyle} doorWide={doorWide} setDoorWide={setDoorWide}/> }
										{ index === 4 && <DoorPos doorPos={doorPos} setDoorPos={setDoorPos} /> }
									</div>
								</div>
							)
						})
					}
				</div>
				<button className="btn" onClick={() => nextStep()}>Save & Continue </button>
			</div>
		</div>
  );
};

const mapStateToProps = (state) => ({
	wallTitle: state.wall.title,
  activeModal: state.wall.activeModal,
});

const mapDispatchToProps = (dispatch) => ({
	setDoorOption: (door, pos) => {
		dispatch({
			type: 'SET_SIDE_DOOR',
			pos: pos,
			door: door
		})
	},
	setSideWidth: (width, pos) => {
		dispatch({
			type: 'SET_SIDE_WIDTH',
			pos: pos,
			width: width
		})
	},
  toggleModal: () => {
    dispatch({
      type: 'TOGGLE_MODAL',
    })
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingModal);