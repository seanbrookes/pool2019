export const FETCH_LAST_WEEK_HITTERS = 'FETCH_LAST_WEEK_HITTERS';
export const FETCH_LAST_WEEK_HITTERS_SUCCESS = 'FETCH_LAST_WEEK_HITTERS_SUCCESS';
export const FETCH_LAST_WEEK_HITTERS_FAIL = 'FETCH_LAST_WEEK_HITTERS_FAIL';
export const FETCH_LAST_WEEK_PITCHERS = 'FETCH_LAST_WEEK_PITCHERS';
export const FETCH_LAST_WEEK_PITCHERS_SUCCESS = 'FETCH_LAST_WEEK_PITCHERS_SUCCESS';
export const FETCH_LAST_WEEK_PITCHERS_FAIL = 'FETCH_LAST_WEEK_PITCHERS_FAIL';
export const FETCH_ROSTER_HITTERS_STATS = 'FETCH_ROSTER_HITTERS_STATS';
export const FETCH_ROSTER_HITTERS_STATS_SUCCESS = 'FETCH_ROSTER_HITTERS_STATS_SUCCESS';
export const FETCH_ROSTER_HITTERS_STATS_FAIL = 'FETCH_ROSTER_HITTERS_STATS_FAIL';
export const FETCH_ROSTER_PITCHERS_STATS = 'FETCH_ROSTER_PITCHERS_STATS';
export const FETCH_ROSTER_PITCHERS_STATS_SUCCESS = 'FETCH_ROSTER_PITCHERS_STATS_SUCCESS';
export const FETCH_ROSTER_PITCHERS_STATS_FAIL = 'FETCH_ROSTER_PITCHERS_STATS_FAIL';
export const FETCH_ROSTER_TOTALS = 'FETCH_ROSTER_TOTALS';
export const FETCH_ROSTER_TOTALS_SUCCESS = 'FETCH_ROSTER_TOTALS_SUCCESS';
export const FETCH_ROSTER_TOTALS_FAIL = 'FETCH_ROSTER_TOTALS_FAIL';
export const CREATE_ROSTER_TOTALS = 'CREATE_ROSTER_TOTALS';
export const CREATE_ROSTER_TOTALS_SUCCESS = 'CREATE_ROSTER_TOTALS_SUCCESS';
export const CREATE_ROSTER_TOTALS_FAIL = 'CREATE_ROSTER_TOTALS_FAIL';
export const FETCH_DAILY_PITCHER_STATS = 'FETCH_DAILY_PITCHER_STATS';
export const UPDATE_DAILY_PITCHER_STATS = 'UPDATE_DAILY_PITCHER_STATS';

export const updateDailyPitcherStat = (stat) => {
  return (dispatch) => {
    const query = '/api/dailypitcherstats';
    const options = {
      method: 'PUT',
      cache: 'no-cache',
      body: JSON.stringify(stat),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return fetch(query, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch(fetchDailyPitcherStats());
        return {
          type: UPDATE_DAILY_PITCHER_STATS,
          payload: {
            data: data,
          }
        };
      })
      .catch((error) => {
        console.log('something wrong with update pitcher stats')
        return true;
      });

  };
}
export const fetchDailyPitcherStats = () => {
  return (dispatch) => {
    const query = `/api/dailypitcherstats`;
    return fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch({
          type: FETCH_DAILY_PITCHER_STATS,
          payload: {
            data: data,
          }
        });
      })
      .catch((error) => {
        console.log('something wrong with totals fetch')
        return true;
      });

  };
};

export const isUniqueRosterTotal = (slug, grandTotal) => {
  const query = `/api/totals?filter[order]=grandTotal+DESC&filter[where][roster]=${slug}`;

  return (dispatch) => {
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data && data.length) {
          let isUnique = true;
          data.map((totalItem) => {
            if (totalItem.grandTotal >= grandTotal) {
              isUnique = false;
            }
          });
          return isUnique;
        }
      })
      .catch((error) => {
        console.log('something wrong with totals fetch')
        return true;
      });
  };

};



export const createRosterTotals = (totalsObj) => {


  return (dispatch) => {
    return isUniqueRosterTotal(totalsObj.slug, totalsObj.grandTotal)
      .then((isUnique) => {
        if (isUnique) {
          const options = {
            method: 'POST',
            cache: 'no-cache',
            body: JSON.stringify(totalsObj),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          };

          fetch('api/totals', options)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              dispatch(fetchRosterTotals(totalsObj.slug));
              return dispatch(createRosterTotalsSuccess(data, totalsObj.slug));
            })
            .catch((error) => {
              return dispatch(createRosterTotalsFail(error));
            });
        }
        else {
          return dispatch(createRosterTotalsSuccess(data, totalsObj.slug));
        }

      });














  //
  //
  //
  //
  // const query = `/api/totals?filter[order]=grandTotal+DESC&filter[where][roster]=${totalsObj.slug}`;
  // fetch(query)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     if (data && data.length) {
  //       let isUnique = true;
  //       data.map((totalItem) => {
  //         if (totalItem.grandTotal >= totalsObj.grandTotal) {
  //           isUnique = false;
  //         }
  //       });
  //       if (isUnique) {
  //
  //           const options = {
  //             method: 'POST',
  //             cache: 'no-cache',
  //             body: JSON.stringify(totalsObj),
  //             headers: new Headers({
  //               'Content-Type': 'application/json'
  //             })
  //           };
  //
  //           fetch('api/totals', options)
  //             .then((response) => {
  //               return response.json();
  //             })
  //             .then((data) => {
  //               dispatch(fetchRosterTotals(totalsObj.slug));
  //               return dispatch(createRosterTotalsSuccess(data, totalsObj.slug));
  //             })
  //             .catch((error) => {
  //               return dispatch(createRosterTotalsFail(error));
  //             })
  //
  //
  //
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     console.log('something wrong with totals fetch')
  //   });



}


};
export const createRosterTotalsSuccess = (data, slug) => {
  return {
    type: CREATE_ROSTER_TOTALS_SUCCESS,
    payload: {
      slug: slug,
      data: data,
    }
  };
};
export const createRosterTotalsFail = (error, slug) => {
  return {
    type: CREATE_ROSTER_TOTALS_FAIL,
    payload: {
      slug: slug,
      error: error,
    }
  };
};



export const fetchRosterTotals = (slug) => {
  return (dispatch) => {
    const query = `/api/totals?filter[order]=grandTotal+DESC&filter[where][roster]=${slug}`;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchRosterTotalsSuccess(data, slug));
      })
      .catch((error) => {
        return dispatch(fetchRosterTotalsFail(error, slug));
      });
  }
};
export const fetchRosterTotalsSuccess = (data, slug) => {
  return {
    type: FETCH_ROSTER_TOTALS_SUCCESS,
    payload: {
      slug: slug,
      data: data,
    }
  };
};
export const fetchRosterTotalsFail = (error, slug) => {
  return {
    type: FETCH_ROSTER_TOTALS_FAIL,
    payload: {
      slug: slug,
      error: error,
    }
  };
};


export const initiateFetchRosterHittersStats = () => {
  return {
    type: FETCH_ROSTER_HITTERS_STATS,
    payload: {
      loading: true,
    }
  };
};
export const fetchRosterHittersStats = (slug) => {
  return (dispatch) => {
    const query = `/api/dailybatterstats?filter[order]=lastUpdate+DESC&filter[where][roster]=${slug}`;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchRosterHittersStatsSuccess(data, slug));
      })
      .catch((error) => {
        return dispatch(fetchRosterHittersStatsFail(error, slug));
      });
  }
};
export const fetchRosterHittersStatsSuccess = (data, slug) => {
  return {
    type: FETCH_ROSTER_HITTERS_STATS_SUCCESS,
    payload: {
      slug: slug,
      data: data,
    }
  };
};
export const fetchRosterHittersStatsFail = (error, slug) => {
  return {
    type: FETCH_ROSTER_HITTERS_STATS_FAIL,
    payload: {
      slug: slug,
      error: error,
    }
  };
};
export const initiateFetchRosterPitchersStats = () => {
  return {
    type: FETCH_ROSTER_PITCHERS_STATS,
    payload: {
      loading: true,
    }
  };
};
export const fetchRosterPitchersStats = (slug) => {
  return (dispatch) => {
    const query = `/api/dailypitcherstats?filter[order]=lastUpdate+DESC&filter[where][roster]=${slug}`;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchRosterPitchersStatsSuccess(data, slug));
      })
      .catch((error) => {
        return dispatch(fetchRosterPitchersStatsFail(error, slug));
      });
  }
};
export const fetchRosterPitchersStatsSuccess = (data, slug) => {
  return {
    type: FETCH_ROSTER_PITCHERS_STATS_SUCCESS,
    payload: {
      slug: slug,
      data: data,
    }
  };
};
export const fetchRosterPitchersStatsFail = (error, slug) => {
  return {
    type: FETCH_ROSTER_PITCHERS_STATS_FAIL,
    payload: {
      slug: slug,
      error: error,
    }
  };
};

export const initiateFetchLastWeekStats = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_LAST_WEEK_HITTERS,
      payload: {
        loading: true,
      }
    });
    return {
      type: FETCH_LAST_WEEK_PITCHERS,
      payload: {
        loading: true,
      }
    };
  };
};
export const fetchLastWeekStats = () => {
  return (dispatch) => {
    dispatch(initiateFetchLastWeekStats);

    const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;  // 4 days in milliseconds
    const dataFilter = (Date.now() - FOUR_DAYS);
    const filter = {
      "where": {
        "lastUpdate": {
          "gt": dataFilter
        }
      }
    };

    const batterQuery = `/api/dailybatterstats?filter=${JSON.stringify(filter)}`;
    const pitcherQuery = `/api/dailypitcherstats?filter=${JSON.stringify(filter)}`;
    /*
    *
    * ?filter={"where":{"lastUpdate":{"gt":1522165641645}}}
    *
    * */
    fetch(batterQuery)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchLastWeekHittersSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchLastWeekHittersFail(error));
      });
    fetch(pitcherQuery)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return dispatch(fetchLastWeekPitchersSuccess(data));
      })
      .catch((error) => {
        return dispatch(fetchLastWeekPitchersFail(error));
      });
  }
};

export const fetchLastWeekHittersSuccess = (data) => {
  return {
    type: FETCH_LAST_WEEK_HITTERS_SUCCESS,
    payload: {
      data: data,
    }
  };
};
export const fetchLastWeekHittersFail = (error) => {
  return {
    type: FETCH_LAST_WEEK_HITTERS_FAIL,
    payload: {
      error: error,
    }
  };
};
export const fetchLastWeekPitchersSuccess = (data) => {
  return {
    type: FETCH_LAST_WEEK_PITCHERS_SUCCESS,
    payload: {
      data: data,
    }
  };
};
export const fetchLastWeekPitchersFail = (error) => {
  return {
    type: FETCH_LAST_WEEK_PITCHERS_FAIL,
    payload: {
      error: error,
    }
  };
};
