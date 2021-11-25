import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDepositRequests = createAsyncThunk('eCommerceApp/DepositRequests/getDepositRequests', async () => {
  // const response = await axios.get('/api/employee-crud-app/DepositRequests');
  // const data = await response.data;
  const data = [
    {
      id: 1,
      bankName: "HBL",
      accountNumber: "3454593876305783",
      accountTitle: "Zeeshan",
      amount: "3000",
      createdOn: new Date(2021, 10, 11),
      depositRequestStatus: "Pending",
      userName: "Zeeshan Ahmad",
    },
    {
      id: 2,
      bankName: "HBL",
      accountNumber: "3454593876305783",
      accountTitle: "Zeeshan",
      amount: "3000",
      createdOn: new Date(2021, 10, 11),
      depositRequestStatus: "Pending",
      userName: "Zeeshan Ahmad",
    },
    {
      id: 3,
      bankName: "HBL",
      accountNumber: "3454593876305783",
      accountTitle: "Zeeshan",
      amount: "3000",
      createdOn: new Date(2021, 10, 11),
      depositRequestStatus: "Pending",
      userName: "Zeeshan Ahmad",
    },
  ]
  return data;
});

export const removeDepositRequests = createAsyncThunk(
  'eCommerceApp/DepositRequests/removeDepositRequests',
  async (depositRequestIds, { dispatch, getState }) => {
    await axios.post('/api/employee-crud-app/remove-DepositRequests', { depositRequestIds });

    return depositRequestIds;
  }
);

const DepositRequestsAdapter = createEntityAdapter({});

export const { selectAll: selectDepositRequests, selectById: selectDepositRequestById } =
  DepositRequestsAdapter.getSelectors((state) => state.eCommerceApp.depositRequests);

const DepositRequestsSlice = createSlice({
  name: 'eCommerceApp/DepositRequests',
  initialState: DepositRequestsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setDepositRequestsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [getDepositRequests.fulfilled]: DepositRequestsAdapter.setAll,
    [removeDepositRequests.fulfilled]: (state, action) =>
      DepositRequestsAdapter.removeMany(state, action.payload),
  },
});

export const { setDepositRequestsSearchText } = DepositRequestsSlice.actions;

export default DepositRequestsSlice.reducer;
