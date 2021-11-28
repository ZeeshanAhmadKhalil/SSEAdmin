import { combineReducers } from '@reduxjs/toolkit';
import depositRequests from './depositRequestsSlice';
require('dotenv').config()

const reducer = combineReducers({
  depositRequests,
});

export default reducer;
