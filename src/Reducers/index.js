import { combineReducers } from 'redux';

import wallReducer from './wallReducer.js'
import surfaceReducer from './surfaceReducer.js';

const appReducer = combineReducers({
	wall: wallReducer,
	surface: surfaceReducer
})

const rootReducer = (state, action) => {
	return appReducer(state, action)
}

export default rootReducer