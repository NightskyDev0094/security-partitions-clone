const initialState = {
	title: null,
	activeModal: false,
	pos: null,
}

const wallReducer = (state = initialState, action) => {
	const sidePosition = {
		'Wall 1': 'Left',
		'Wall 2': 'Bottom',
		'Wall 3': 'Right'
	}
	
	switch (action.type) {
		case 'SELECT_WALL':
			return {
				...state,
				title: action.title,
				activeModal: action.title ? true : false,
				pos: sidePosition[action.title]
			}
		case 'TOGGLE_MODAL':
			return {
				...state,
				activeModal: false
			}
		default:
			return state
	}
}

export default wallReducer;