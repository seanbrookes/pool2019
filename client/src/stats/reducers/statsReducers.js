import {
  FETCH_LAST_WEEK_HITTERS,
  FETCH_LAST_WEEK_HITTERS_SUCCESS,
  FETCH_LAST_WEEK_HITTERS_FAIL,
  FETCH_LAST_WEEK_PITCHERS,
  FETCH_LAST_WEEK_PITCHERS_SUCCESS,
  FETCH_LAST_WEEK_PITCHERS_FAIL,
  FETCH_ROSTER_HITTERS_STATS,
  FETCH_ROSTER_HITTERS_STATS_SUCCESS,
  FETCH_ROSTER_HITTERS_STATS_FAIL,
  FETCH_ROSTER_PITCHERS_STATS,
  FETCH_ROSTER_PITCHERS_STATS_SUCCESS,
  FETCH_ROSTER_PITCHERS_STATS_FAIL,
  FETCH_ROSTER_TOTALS,
  FETCH_ROSTER_TOTALS_SUCCESS,
  FETCH_ROSTER_TOTALS_FAIL,
  CREATE_ROSTER_TOTALS,
  CREATE_ROSTER_TOTALS_SUCCESS,
  CREATE_ROSTER_TOTALS_FAIL,
  FETCH_DAILY_PITCHER_STATS,
} from '../actions/statsActions';

const initialState = {
  hitters: {
    lastWeek: {entities: []},
    rosters: {},
  },
  pitchers: {
    lastWeek: {entities: []},
    rosters: {},
  },
  totals: {},
};


export const statsReducers = (state = initialState, action) => {

  const newState = Object.assign({}, state);

  if (action.payload && action.payload.slug) {
    newState.hitters.rosters[action.payload.slug] = newState.hitters.rosters[action.payload.slug] ? newState.hitters.rosters[action.payload.slug] : {};
    newState.pitchers.rosters[action.payload.slug] = newState.pitchers.rosters[action.payload.slug] ? newState.pitchers.rosters[action.payload.slug] : {};
    newState.totals[action.payload.slug] = newState.totals[action.payload.slug] ? newState.totals[action.payload.slug] : {};
  }


  switch(action.type) {

    case FETCH_LAST_WEEK_HITTERS:
      newState.hitters.lastWeek.loading = true;
      return newState;

    case FETCH_LAST_WEEK_HITTERS_SUCCESS:
      newState.hitters.lastWeek.loading = false;
      newState.hitters.lastWeek.entities = action.payload.data;
      return newState;

    case FETCH_LAST_WEEK_HITTERS_FAIL:
      newState.hitters.lastWeek.loading = false;
      newState.hitters.lastWeek.error = action.payload.error;
      return newState;

    case FETCH_LAST_WEEK_PITCHERS:
      newState.pitchers.lastWeek.loading = true;
      return newState;

    case FETCH_LAST_WEEK_PITCHERS_SUCCESS:
      newState.pitchers.lastWeek.loading = false;
      newState.pitchers.lastWeek.entities = action.payload.data;
      return newState;

    case FETCH_LAST_WEEK_PITCHERS_FAIL:
      newState.pitchers.lastWeek.loading = false;
      newState.pitchers.lastWeek.entities = action.payload.error;
      return newState;

    case FETCH_ROSTER_HITTERS_STATS:
      newState.hitters.rosters[action.payload.slug].loading = true;
      return newState;

    case FETCH_ROSTER_HITTERS_STATS_SUCCESS:
      newState.hitters.rosters[action.payload.slug].loading = false;
      newState.hitters.rosters[action.payload.slug].entities = action.payload.data;
      return newState;

    case FETCH_ROSTER_HITTERS_STATS_FAIL:
      newState.hitters.rosters[action.payload.slug].loading = false;
      newState.hitters.rosters[action.payload.slug].error = action.payload.error;
      return newState;

    case FETCH_ROSTER_PITCHERS_STATS:
      newState.pitchers.rosters[action.payload.slug].loading = true;
      return newState;

    case FETCH_ROSTER_PITCHERS_STATS_SUCCESS:
      newState.pitchers.rosters[action.payload.slug].loading = false;
      newState.pitchers.rosters[action.payload.slug].entities = action.payload.data;
      return newState;

    case FETCH_ROSTER_PITCHERS_STATS_FAIL:
      newState.pitchers.rosters[action.payload.slug].loading = false;
      newState.pitchers.rosters[action.payload.slug].error = action.payload.error;
      return newState;

    case FETCH_ROSTER_TOTALS:
      newState.totals[action.payload.slug].loading = true;
      newState.totals[action.payload.slug].error = {};
      return newState;

    case FETCH_ROSTER_TOTALS_SUCCESS:
      newState.totals[action.payload.slug].loading = false;
      newState.totals[action.payload.slug].error = {};
      newState.totals[action.payload.slug].entities = action.payload.data;
      return newState;

    case FETCH_ROSTER_TOTALS_FAIL:
      newState.totals[action.payload.slug].loading = false;
      newState.totals[action.payload.slug].error = action.payload.error;
      return newState;

    case CREATE_ROSTER_TOTALS:
      newState.totals[action.payload.slug].error = {};
      return newState;

    case CREATE_ROSTER_TOTALS_SUCCESS:
      newState.totals[action.payload.slug].error = {};
      return newState;

    case CREATE_ROSTER_TOTALS_FAIL:
      newState.totals[action.payload.slug].error = action.payload.error;
      return newState;

    case FETCH_DAILY_PITCHER_STATS:
      newState.dailyPitcherStats = action.payload.data;
      return newState;

    default:

      return newState;
  }

};
