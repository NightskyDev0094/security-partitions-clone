import React, { useCallback, useEffect, useMemo } from "react"
import { connect } from 'react-redux';

const DoorWide = ({activeModal, wallPos, surfaceData, doorStyle, doorWide, setDoorWide}) => {
	const sideSurface = surfaceData[wallPos];
	const FT = 12;
	const wides = useMemo(() => {
		return {
			'Door': [3 * FT, 4 * FT],
			'Double Door': [6 * FT, 8 * FT],
		}
	}, [])

	const selectOption = useCallback((value) => {
		if(!doorStyle){
			setDoorWide(0);
			return
		}
		let modal = document.querySelector('.door-wide')
		let options = modal.querySelectorAll('.card-selector');

		for(let i = 0; i < options.length; i++)
			options[i].checked = false;

		let option_index = wides[doorStyle].indexOf(value);
		if(option_index < 0) option_index = 0
		options[option_index].checked = true;

		setDoorWide(wides[doorStyle][option_index]);
	}, [setDoorWide, doorStyle, wides])

	useEffect(() => {
		if(!sideSurface || !doorStyle) return;

		selectOption(sideSurface.door?.wide)
	}, [activeModal, sideSurface, selectOption, doorStyle, wides])

	return (
		<div className="door-wide d-flex flex-column cards">
			{
				wides[doorStyle] && wides[doorStyle].map((wide, index) => {
					return (
						<div className={`setting-card ${ doorWide === wide ? 'is-active' : '' }`} onClick={() => selectOption(wide)} key={index}>
							<div><input className="card-selector" type='radio' defaultChecked /></div>
							<div>
								<div>{wide / FT} foot door</div>
							</div>
						</div>
					)
				})
			}
			{/* <div className={`setting-card ${ doorWide === 3 * FT ? 'is-active' : '' }`} onClick={() => selectOption(3 * FT)}>
				<div><input className="card-selector" type='radio' defaultChecked /></div>
				<div>
					<div>3 foot door</div>
				</div>
			</div>
			<div className={`setting-card ${ doorWide === 4 * FT ? 'is-active' : '' }`} onClick={() => selectOption(4 * FT)}>
				<div><input className="card-selector" type='radio' /></div>
				<div>
					<div>4 foot door</div>
				</div>
			</div> */}
		</div>
	)
}

const mapStateToProps = (state) => ({
	activeModal: state.wall.activeModal,
	wallPos: state.wall.pos,
	surfaceData: state.surface
});
export default connect(mapStateToProps, null)(DoorWide);