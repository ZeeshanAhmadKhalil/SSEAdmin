import { combineReducers } from '@reduxjs/toolkit';
import depositRequests from './depositRequestsSlice';

const reducer = combineReducers({
  depositRequests,
});

export default reducer;
