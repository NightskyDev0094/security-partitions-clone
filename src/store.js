import { createStore } from 'redux';
import rootReducer from './Reducers/index.js';

const initialState = {};
const store = createStore(
  rootReducer,
  initialState
);

export { store };