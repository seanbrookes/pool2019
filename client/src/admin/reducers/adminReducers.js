import {
  FETCH_MLB_HITTERS,
  FETCH_MLB_HITTERS_SUCCESS,
  FETCH_MLB_HITTERS_FAIL,
  FETCH_MLB_PITCHERS,
  FETCH_MLB_PITCHERS_SUCCESS,
  FETCH_MLB_PITCHERS_FAIL } from '../actions/adminActions';

export const adminReducers = (state={}, action) => {

  const newState = Object.assign({}, state);

  switch(action.type) {

    case FETCH_MLB_HITTERS:
      newState.loading = true;
      return newState;

    case FETCH_MLB_HITTERS_SUCCESS:
      newState.loading = false;
      newState.entities = {hitters: action.payload.data};
      return newState;

    case FETCH_MLB_HITTERS_FAIL:
      newState.loading = false;
      newState.error = action.payload.error;

      return newState;

    case FETCH_MLB_PITCHERS:
      newState.loading = true;
      return newState;

    case FETCH_MLB_PITCHERS_SUCCESS:
      newState.loading = false;
      newState.entities = {pitchers: action.payload.data};
      return newState;

    case FETCH_MLB_PITCHERS_FAIL:
      newState.loading = false;
      newState.error = action.payload.error;

      return newState;



    default:

      return newState;
  }

};
