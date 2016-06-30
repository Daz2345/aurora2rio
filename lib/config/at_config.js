// AccountsTemplates.configure({
//     // Behavior
//     confirmPassword: false,
//     enablePasswordChange: false,
//     forbidClientAccountCreation: false,
//     overrideLoginErrors: true,
//     sendVerificationEmail: false,
//     lowercaseUsername: false,
//     focusFirstInput: true,

//     // Appearance
//     showAddRemoveServices: false,
//     showForgotPasswordLink: false,
//     showLabels: true,
//     showPlaceholders: true,
//     showResendVerificationEmailLink: false,

//     // Client-side Validation
//     continuousValidation: false,
//     negativeFeedback: false,
//     negativeValidation: true,
//     positiveValidation: true,
//     positiveFeedback: true,
//     showValidating: true,

//     // Privacy Policy and Terms of Use
//     privacyUrl: 'privacy',
//     termsUrl: 'terms-of-use',

//     // Redirects
//     homeRoutePath: '/',
//     redirectTimeout: 4000,

//     // Hooks
//     // onLogoutHook: myLogoutFunc,
//     // onSubmitHook: mySubmitFunc,
//     // preSignUpHook: myPreSubmitFunc,
//     // postSignUpHook: myPostSubmitFunc,

//     // Texts
//     texts: {
//       button: {
//           signUp: "Register Now!"
//       },
//       socialSignUp: "Register",
//       socialIcons: {
//           "meteor-developer": "fa fa-rocket"
//       },
//       title: {
//           forgotPwd: "Recover Your Password"
//       },
//     },
// });

AccountsTemplates.configure({
  defaultTemplate: 'Auth_page',
  defaultLayout: 'mainLayout',
  defaultContentRegion: 'content',
  defaultLayoutRegions: {}
});

// Define these routes in a file loaded on both client and server
AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/signin'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'join',
  path: '/join'
});