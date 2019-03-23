export const FETCH_ROSTERS = 'FETCH_ROSTERS';
export const FETCH_ROSTERS_SUCCESS = 'FETCH_ROSTERS_SUCCESS';
export const FETCH_ROSTERS_FAIL = 'FETCH_ROSTERS_FAIL';
export const UPDATE_ROSTER = 'UPDATE_ROSTER';
export const UPDATE_ROSTER_SUCCESS = 'UPDATE_ROSTER_SUCCESS';
export const UPDATE_ROSTER_FAIL = 'UPDATE_ROSTER_FAIL';

export const initiateFetchRosters = () => {
  return {
    action: FETCH_ROSTERS,
    payload: {
      loading: true,
    }
  }
};
export const fetchRosters = () => {
  return (dispatch) => {
    dispatch(initiateFetchRosters);

    fetch('api/rosters')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchRostersSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchRostersFail(error));
      })
  }
};

export const fetchRostersSuccess = (data) => {
  const rosterData = {};
  data.map((roster) => {
    rosterData[roster.slug] = roster;
  });

  return {
    type: FETCH_ROSTERS_SUCCESS,
    payload: {
      loading: false,
      data: rosterData,
    }
  }
};

export const fetchRostersFail = (error) => {
  return {
    type: FETCH_ROSTERS_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};

export const updateRoster = (roster) => {
  return (dispatch) => {


    const options = {
      method: 'PUT',
      cache: 'no-cache',
      body: JSON.stringify(roster),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    fetch('api/rosters', options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(updateRosterSuccess(roster.slug, data));
      })
      .catch((error) => {
        return dispatch(updateRosterFail(error));
      })
  }
};

export const updateRosterSuccess = (slug, data) => {
  return {
    type: UPDATE_ROSTER_SUCCESS,
    payload: {
      loading: false,
      slug: slug,
      data: data,
    }
  }
};

export const updateRosterFail = (error) => {
  return {
    type: UPDATE_ROSTER_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};

