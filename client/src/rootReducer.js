import { combineReducers } from 'redux';

import {
  rostersReducers
} from './rosters/reducers/rostersReducers';
import {
  draftReducers
} from './draft/reducers/draftReducers';
import {
  adminReducers
} from './admin/reducers/adminReducers';
import {
  statsReducers
} from './stats/reducers/statsReducers';

const allReducers = {
  rosters: rostersReducers,
  draft: draftReducers,
  admin: adminReducers,
  stats: statsReducers,
};

const rootReducer = combineReducers(allReducers);

export default rootReducer;
