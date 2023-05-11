const initialState = {
	Mesh: null,
	Layout: null,
	Tall: null,
	Ceil: null,
	Left: {
		width: 96
	},
	Right: {
		width: 96
	},
	Bottom: {
		width: 96
	}
}

const surfaceReducer = (state = initialState, action) => {
	let data = JSON.parse(JSON.stringify(state))

	switch (action.type) {
		case 'SET_MESH':
			return {
				...state,
				Mesh: action.payload
			}
		case 'SET_LAYOUT':
			return {
				...state,
				Layout: action.payload
			}
		case 'SET_TALL':
			return {
				...state,
				Tall: action.payload
			}
		case 'SET_CEIL':
			return {
				...state,
				Ceil: action.payload
			}	
		case 'SET_SIDE_WIDTH':
			data[action.pos].width = action.width;
			return data
		case 'SET_SIDE_DOOR':
			data[action.pos].door = action.door;
			return data
		default:
			return state
	}
}

export default surfaceReducer;