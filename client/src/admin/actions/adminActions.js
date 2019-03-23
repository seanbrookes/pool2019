export const FETCH_MLB_HITTERS = 'FETCH_MLB_HITTERS';
export const FETCH_MLB_HITTERS_SUCCESS = 'FETCH_MLB_HITTERS_SUCCESS';
export const FETCH_MLB_HITTERS_FAIL = 'FETCH_MLB_HITTERS_FAIL';
export const FETCH_MLB_PITCHERS = 'FETCH_MLB_PITCHERS';
export const FETCH_MLB_PITCHERS_SUCCESS = 'FETCH_MLB_PITCHERS_SUCCESS';
export const FETCH_MLB_PITCHERS_FAIL = 'FETCH_MLB_PITCHERS_FAIL';


export const initiateFetchMlbHitters = () => {
  return {
    action: FETCH_MLB_HITTERS,
    payload: {
      loading: true,
    }
  }
};
export const fetchMlbHitters = () => {
  return (dispatch) => {
    dispatch(initiateFetchMlbHitters);

    fetch('/api/mlbbatters/fetchBatters')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchMlbHittersSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchMlbHittersFail(error));
      })
  }
};

export const fetchMlbHittersSuccess = (data) => {

  return {
    type: FETCH_MLB_HITTERS_SUCCESS,
    payload: {
      loading: false,
      data: data.data,
    }
  }
};

export const fetchMlbHittersFail = (error) => {
  return {
    type: FETCH_MLB_HITTERS_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};


export const initiateFetchPitchers = () => {
  return {
    type: FETCH_MLB_PITCHERS,
    payload: {
      loading: true,
    }
  }
};
export const fetchPitchers = () => {
  return (dispatch) => {
    dispatch(initiateFetchPitchers);

    fetch('/api/mlbpitchers/fetchPitchers')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchPitchersSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchPitchersFail(error));
      })
  }
};

export const fetchPitchersSuccess = (data) => {
  return {
    type: FETCH_MLB_PITCHERS_SUCCESS,
    payload: {
      loading: false,
      data: data.data,
    }
  }
};

export const fetchPitchersFail = (error) => {
  return {
    type: FETCH_MLB_PITCHERS_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};
