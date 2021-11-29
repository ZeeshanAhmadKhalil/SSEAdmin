import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const ChangeDepositRequestStatus = createAsyncThunk(
  'eCommerceApp/DepositRequests/ChangeDepositRequestStatus',
  async ({ status, depositRequestId }, { dispatch, getState }) => {

    const token = getState().auth.user.token

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-auth-token", token);

    var raw = JSON.stringify({
      depositRequestId,
      status,
    });

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    var requestOptionsGet = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(process.env.REACT_APP_API_URL + "/Api/Admin/ChangeDepositRequestStatus",
      requestOptions
    ).then(response => {
      console.log("RESPONSE")
      console.log(response)
      return response.status
    }).then(async status => {
      console.log("STATUS")
      console.log(status)
      if (status == 200) {
        console.info("Status changed successfully")
        dispatch(getDepositRequests())
      } else {
        console.error("Something went changing deposit req status")
      }
    }).catch(error => {
      console.error('error', error)
    })
  }
)

export const getDepositRequests = createAsyncThunk(
  'eCommerceApp/DepositRequests/getDepositRequests',
  async (params, { dispatch, getState }) => {
    try {
      const token = getState().auth.user.token

      console.log("TOKEN")
      console.log(token)

      var myHeaders = new Headers();
      myHeaders.append("x-auth-token", token);
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      let result = await fetch(process.env.REACT_APP_API_URL + "/Api/Admin/GetDepositRequests",
        requestOptions
      ).then(async response => {
        console.log("RESPONSE")
        console.log(response)
        return response.json().then(data => ({
          status: response.status,
          data,
        }))
      })

      console.log("RESULT")
      console.log(result)
      const { status, data } = result
      let data_ = []
      if (status == 200) {
        data.forEach(element => {
          data_.push({
            id: element._id,
            bankName: element.bankName,
            accountNumber: element.accountNumber,
            accountTitle: element.accountTitle,
            amount: element.amount,
            createdOn: element.createdOn,
            depositRequestStatus: element.depositRequestStatus.depositRequestStatus,
            userName: element.user.fullName,
          })
        });
      } else {
        console.error("Something went wrong while getting deposit requests")
      }
      return data_;
    } catch (e) {
      console.error(e)
      return []
    }
  }
);

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
    [removeDepositRequests.fulfilled]: (state, action) => DepositRequestsAdapter.removeMany(state, action.payload),
  },
});

export const { setDepositRequestsSearchText } = DepositRequestsSlice.actions;

export default DepositRequestsSlice.reducer;
