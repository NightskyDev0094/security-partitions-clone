import React, { useEffect, useMemo } from "react"
import { connect } from 'react-redux';

const DoorOption = ({activeModal, wallPos, surfaceData, doorHandOption, setDoorHandOption, doorStyle}) => {
	let handOptions = useMemo(() => {
		if(doorStyle === 'Door')
			return [
				'Hinge Left, Swing Out',
				'Hinge Right, Swing Out',
				'Hinge Left, Swing In',
				'Hinge Right, Swing In'
			]
		else if(doorStyle === 'Double Door')
			return [
				'Swing In',
				'Swing Out'
			]
	}, [doorStyle])
	const sideSurface = surfaceData[wallPos];

	const selectOption = (index) => {
		let modal = document.querySelector('.door-option')
		let options = modal.querySelectorAll('.card-selector');

		for(let i = 0; i < options.length; i++)
			options[i].checked = false;
		options[index].checked = true;

		setDoorHandOption(handOptions[index]);
	}

	useEffect(() => {
		if(!sideSurface || !doorStyle) return;

		let hand_option =
			handOptions.indexOf(sideSurface.door?.hand_option) < 0 ?
				handOptions[0] : sideSurface.door.hand_option

		setDoorHandOption(hand_option)

		// set the radio box
		let modal = document.querySelector('.door-option')
		let options = modal.querySelectorAll('.card-selector');

		for(let i = 0; i < options.length; i++)
			options[i].checked = false;
		options[handOptions.indexOf(hand_option)].checked = true;
	}, [activeModal, sideSurface, handOptions, setDoorHandOption, doorStyle])

	return (
		<div className="door-option d-flex flex-column cards">
			{
				handOptions && handOptions.map((option, index) => {
					return(
						<div className={`setting-card ${ doorHandOption === handOptions[index] ? 'is-active' : '' }`} onClick={() => selectOption(index)} key={index}>
							<div><input className="card-selector" type='radio' /></div>
							<div>
								<div>{option}</div>
							</div>
						</div>
					)
				})
			}
		</div>
	)
}

const mapStateToProps = (state) => ({
	activeModal: state.wall.activeModal,
	wallPos: state.wall.pos,
	surfaceData: state.surface
});

export default connect(mapStateToProps, null)(DoorOption);