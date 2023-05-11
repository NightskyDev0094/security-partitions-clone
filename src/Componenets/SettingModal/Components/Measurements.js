import React, { useState, useEffect } from "react"
import { connect } from 'react-redux';

import { TextField } from '@mui/material';

const Measurements = (
	{
		surfaceData,
		wallTitle,
		lengthAsFT,
		lengthAsIN,
		lengthAsFraction,
		setLengthAsFT,
		setLengthAsIN,
		setLengthAsFraction
	}
) => {
	const [option, setOption] = useState(0);

	const sidePosition = {
		'Wall 1': 'Left',
		'Wall 2': 'Bottom',
		'Wall 3': 'Right'
	}
	const fractions = [
		{
			value: 0,
			label: '0',
		},
		{
			value: 0.125,
			label: '1/8',
		},
		{
			value: 0.25,
			label: '1/4',
		},
		{
			value: 0.375,
			label: '3/8',
		},
		{
			value: 0.5,
			label: '1/2',
		},
		{
			value: 0.625,
			label: '5/8',
		},
		{
			value: 0.75,
			label: '3/4',
		},
		{
			value: 0.875,
			label: '7/8',
		}
	];
	const sideSurface = surfaceData[sidePosition[wallTitle]];

	const selectOption = (value) => {
		let modal = document.querySelector('.measurements')

		modal.querySelectorAll('.card-selector')[value].checked = true;
		modal.querySelectorAll('.card-selector')[value ? 0 : 1].checked = false;

		setOption(value);

		// set the wide of the side
		setTimeout(() => {
			let inputs = modal.querySelector('.is-active').querySelector('.measurements-input').querySelectorAll('input');
			let lengthAsFT = inputs[0].value;
			let lengthAsIn = 0;
			let lengthAsFraction = 0;

			if(inputs.length > 1) {
				lengthAsIn = Number(inputs[1].value)
				lengthAsFraction = Number(modal.querySelector('.is-active').querySelector('select').value);
			}

			setLengthAsFT(lengthAsFT < 0 ? 0 : lengthAsFT)
			setLengthAsIN(lengthAsIn > 11 ? 11 : (lengthAsIn < 0 ? 0 : lengthAsIn))
			setLengthAsFraction(lengthAsFraction)
		});
	}

	useEffect(() => {
		const FT = 12; // 1 ft = 12 in

		setLengthAsFT(parseInt(sideSurface?.width / FT))
		setLengthAsIN(parseInt(sideSurface?.width % FT))
		setLengthAsFraction(sideSurface?.width % FT - parseInt(sideSurface?.width % FT))
	}, [sideSurface, setLengthAsFT, setLengthAsIN, setLengthAsFraction])

	return (
		<div className="measurements d-flex flex-column cards">
			<div className={`setting-card ${ !option ? 'is-active' : '' }`} onClick={() => selectOption(0)}>
				<div><input className="card-selector" type='radio' defaultChecked /></div>
				<div>
					<div>Approximate Measurement</div>
					<div>Lowest cost, measurements in feet only</div>
					<div className="d-flex measurements-input">
						<TextField
							type="number"
							value={lengthAsFT || 0}
							onChange={(e) => {setLengthAsFT(Number(e.target.value) < 0 ? 0 : Number(e.target.value))}}
						/>
						<div>ft</div>
					</div>
				</div>
			</div>
			<div className={`setting-card ${ option ? 'is-active' : '' }`} onClick={() => selectOption(1)}>
				<div><input className="card-selector" type='radio' /></div>
				<div style={{ overflow: 'hidden' }}>
					<div>Exact Measurement</div>
					<div>May require adjustable filler piece</div>
					<div className="d-flex measurements-input">
						<div className="d-flex">
							<TextField
								type="number"
								value={lengthAsFT || 0}
								onChange={(e) => {setLengthAsFT(Number(e.target.value) < 0 ? 0 : Number(e.target.value))}}
							/>
							<div>ft</div>
						</div>
						<div className="d-flex">
							<TextField
								type="number"
								value={lengthAsIN || 0}
								onChange={
									(e) => {
										setLengthAsIN(
											Number(e.target.value) > 11 ?
												11 :
												(Number(e.target.value) < 0 ? 0 : Number(e.target.value))
										)
									}
								}
							/>
							<div>&</div>
							<TextField
								select
								value={lengthAsFraction || 0}
								SelectProps={{
									native: true,
								}}
								onChange={(e) => {setLengthAsFraction(Number(e.target.value))}}
							>
								{fractions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</TextField>
							<div>in</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => ({
	wallTitle: state.wall.title,
	surfaceData: state.surface
});

export default connect(mapStateToProps, null)(Measurements);