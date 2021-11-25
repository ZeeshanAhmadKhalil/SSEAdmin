import { authRoles } from 'app/auth';
import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const DepositRequestsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyAdmin,
  routes: [
    {
      path: '/deposit-requests',
      component: lazy(() => import('./DepositRequests/DepositRequests')),
    },
    {
      path: '/deposit-requests',
      component: () => <Redirect to="/deposit-requests" />,
    },
  ],
};

export default DepositRequestsConfig;
