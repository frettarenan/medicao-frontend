export const environment = {
  production: true,
  apiUrl: 'https://medicaobackend.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('medicaobackend.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
