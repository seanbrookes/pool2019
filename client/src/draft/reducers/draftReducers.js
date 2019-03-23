import {
  FETCH_DRAFTPICKS_SUCCESS,
  FETCH_DRAFTPICKS,
  FETCH_DRAFTPICKS_FAIL,
  UPDATE_DRAFTPICK,
  UPDATE_DRAFTPICK_SUCCESS,
  UPDATE_DRAFTPICK_FAIL
} from '../actions/draftActions';

export const draftReducers = (state={}, action) => {

  const newState = Object.assign({}, state);

  switch(action.type) {

    case FETCH_DRAFTPICKS:
      newState.loading = true;
      return newState;

    case FETCH_DRAFTPICKS_SUCCESS:
      newState.loading = false;
      newState.entities = action.payload.data;
      return newState;

    case FETCH_DRAFTPICKS_FAIL:
      newState.loading = false;
      newState.error = action.payload.error;

      return newState;

    case UPDATE_DRAFTPICK:
      return newState;

    case UPDATE_DRAFTPICK_SUCCESS:
      newState.entities[action.payload.slug] = action.payload.data;
      return newState;

    case UPDATE_DRAFTPICK_FAIL:
      newState.error = action.payload.error;

      return newState



    default:

      return state;
  }

};
