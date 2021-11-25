import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'administration',
    title: 'Administration',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'deposit-requests',
        title: 'Deposit Requests',
        type: 'item',
        icon: 'whatshot',
        url: '/deposit-requests',
      },
    ],
  },
];

export default navigationConfig;
