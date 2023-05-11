import React, { useEffect } from "react"
import { connect } from 'react-redux';

import { TextField } from '@mui/material';

const WallFeatures = ({activeModal, wallPos, surfaceData, doorStyle, setDoorStyle, setDoorWide, setDoorPos}) => {
	const sideSurface = surfaceData[wallPos];
	const wallFeatures = [
		'Door',
		'Double Door',
		'Sliding Door',
		'Door + Service Window',
		'Service Window'
	]

	const selectOption = (value) => {
		let modal = document.querySelector('.wall-feature')

		modal.querySelectorAll('.card-selector')[value].checked = true;
		modal.querySelectorAll('.card-selector')[value ? 0 : 1].checked = false;

		if(!value) {
			setDoorStyle('');
			setDoorWide(0);
			setDoorPos('');
		} else setDoorStyle('Door');
	}

	const setDoorStyles = (value) => {
		setTimeout(() => {
			setDoorStyle(value)
		})
	}

	useEffect(() => {
		if(!sideSurface) return;

		setDoorStyle((sideSurface.door?.style || ''))

		// set the radio box
		let modal = document.querySelector('.wall-feature')
		modal.querySelectorAll('.card-selector')[sideSurface.door?.style ? 0 : 1].checked = false;
		modal.querySelectorAll('.card-selector')[sideSurface.door?.style ? 1 : 0].checked = true;

	}, [activeModal, sideSurface, setDoorStyle, setDoorWide])

	return (
		<div className="wall-feature d-flex flex-column cards">
			<div className={`setting-card ${ !doorStyle ? 'is-active' : '' }`} onClick={() => selectOption(0)}>
				<div><input className="card-selector" type='radio' defaultChecked /></div>
				<div>
					<div>Mesh Only</div>
					<div>Secure wire measurements with no doors or windows</div>
				</div>
			</div>
			<div className={`setting-card ${ doorStyle ? 'is-active' : '' }`} onClick={() => selectOption(1)}>
				<div><input className="card-selector" type='radio' /></div>
				<div>
					<div>Mesh + Something Else</div>
					<div>Select additional wall features</div>
					<div className="d-flex">
						<TextField
							style={{width: '100%'}}
							select
							value={doorStyle}
							onChange={(e) => {setDoorStyles(e.target.value)}}
							SelectProps={{
								native: true,
							}}
						>
							{wallFeatures.map((feature, index) => (
								<option key={index} value={feature}>
									{feature}
								</option>
							))}
						</TextField>
					</div>
				</div>
			</div>
		</div>
	)
}


const mapStateToProps = (state) => ({
	activeModal: state.wall.activeModal,
	wallPos: state.wall.pos,
	surfaceData: state.surface
});

export default connect(mapStateToProps, null)(WallFeatures);