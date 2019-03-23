import {
  FETCH_ROSTERS_SUCCESS,
  FETCH_ROSTERS,
  FETCH_ROSTERS_FAIL,
  UPDATE_ROSTER,
  UPDATE_ROSTER_SUCCESS,
  UPDATE_ROSTER_FAIL
} from '../actions/rostersActions';

export const rostersReducers = (state={}, action) => {

  const newState = Object.assign({}, state);

  switch(action.type) {

    case FETCH_ROSTERS:
      newState.loading = true;
      return newState;

    case FETCH_ROSTERS_SUCCESS:
      newState.loading = false;
      newState.entities = action.payload.data;
      return newState;

    case FETCH_ROSTERS_FAIL:
      newState.loading = false;
      newState.error = action.payload.error;

      return newState;

    case UPDATE_ROSTER:
      return newState;

    case UPDATE_ROSTER_SUCCESS:
      newState.entities[action.payload.slug] = action.payload.data;
      return newState;

    case UPDATE_ROSTER_FAIL:
      newState.error = action.payload.error;

      return newState



    default:

      return state;
  }

};
