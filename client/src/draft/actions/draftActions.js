export const FETCH_DRAFTPICKS = 'FETCH_DRAFTPICKS';
export const FETCH_DRAFTPICKS_SUCCESS = 'FETCH_DRAFTPICKS_SUCCESS';
export const FETCH_DRAFTPICKS_FAIL = 'FETCH_DRAFTPICKS_FAIL';
export const UPDATE_DRAFTPICK = 'UPDATE_DRAFTPICK';
export const UPDATE_DRAFTPICK_SUCCESS = 'UPDATE_DRAFTPICK_SUCCESS';
export const UPDATE_DRAFTPICK_FAIL = 'UPDATE_DRAFTPICK_FAIL';

export const initiateFetchDraftPicks = () => {
  return {
    action: FETCH_DRAFTPICKS,
    payload: {
      loading: true,
    }
  }
};
export const pollDraftPicks = () => {
  return (dispatch) => {
    fetch('api/draftpicks')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch(fetchDraftPicksSuccess(data));
        setTimeout(() => {
          return dispatch(pollDraftPicks());
        }, 5000);
      })
      .catch((error) => {
        return dispatch(fetchDraftPicksFail(error));
      })
  }
};
export const fetchDraftPicks = () => {
  return (dispatch) => {
    dispatch(initiateFetchDraftPicks);

    fetch('api/draftpicks')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchDraftPicksSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchDraftPicksFail(error));
      })
  }
};

export const fetchDraftPicksSuccess = (data) => {
  const draftPickData = {};
  data.map((draftPick) => {
    draftPickData[draftPick.pickNumber] = draftPick;
  });

  return {
    type: FETCH_DRAFTPICKS_SUCCESS,
    payload: {
      loading: false,
      data: draftPickData,
    }
  }
};

export const fetchDraftPicksFail = (error) => {
  return {
    type: FETCH_DRAFTPICKS_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};

export const updateDraftPick = (pick) => {
  return (dispatch) => {

    const options = {
      method: 'PUT',
      cache: 'no-cache',
      body: JSON.stringify(pick),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    fetch('api/draftpicks', options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch(fetchDraftPicks());
        return dispatch(updateDraftPickSuccess(roster.slug, data));
      })
      .catch((error) => {
        return dispatch(updateDraftPickFail(error));
      })
  }
};

export const updateDraftPickSuccess = (slug, data) => {
  return {
    type: UPDATE_DRAFTPICK_SUCCESS,
    payload: {
      loading: false,
      slug: slug,
      data: data,
    }
  }
};

export const updateDraftPickFail = (error) => {
  return {
    type: UPDATE_DRAFTPICK_FAIL,
    payload: {
      loading: false,
      error: error,
    }
  }
};
