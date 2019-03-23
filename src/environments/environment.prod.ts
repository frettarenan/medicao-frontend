export const environment = {
  production: true,
  apiUrl: 'https://medicao-backend.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('medicao-backend.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
