import React, { useEffect } from "react"
import { connect } from 'react-redux';

const DoorPos = ({activeModal, wallPos, surfaceData, doorPos, setDoorPos}) => {
	const sideSurface = surfaceData[wallPos];
	const DOOR_POS = [
		'Far Left',
		'Left Of Center',
		'Center',
		'Right Of Center',
		'Far Right'
	]

	const selectOption = (pos) => {
		let modal = document.querySelector('.door-pos')
		let options = modal.querySelectorAll('.card-selector');

		for(let i = 0; i < options.length; i++)
			options[i].checked = false;
		options[DOOR_POS.indexOf(pos)].checked = true;

		setDoorPos(pos);
	}

	useEffect(() => {
		if(!sideSurface) return;

		selectOption((sideSurface.door?.pos || 'Far Left'))
	}, [activeModal, sideSurface, setDoorPos])

	return (
		<div className="door-pos d-flex flex-column cards">
			{
				DOOR_POS.map((pos, index) => {
					return (
						<div className={`setting-card ${ pos === doorPos ? 'is-active' : '' }`} onClick={() => selectOption(pos)} key={index}>
							<div><input className="card-selector" type='radio' defaultChecked /></div>
							<div>
								<div>{pos}</div>
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
export default connect(mapStateToProps, null)(DoorPos);