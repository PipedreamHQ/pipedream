export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the reCAPTCHA V3 task.",
    options: [
      "RecaptchaV3TaskProxyless",
    ],
    default: "RecaptchaV3TaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  websiteKey: {
    type: "string",
    label: "Website Key",
    description: "reCAPTCHA sitekey. Can be found inside data-sitekey property of the reCAPTCHA div element or inside k parameter of the requests to reCAPTHCHA API. You can also use the [script](https://gist.github.com/2captcha/2ee70fa1130e756e1693a5d4be4d8c70) to find the value.",
  },
  minScore: {
    type: "string",
    label: "Min Score",
    description: "The minimum score valid.",
    optional: true,
  },
  pageAction: {
    type: "string",
    label: "Page Action",
    description: "Action parameter value. The value is set by website owner inside **data-action** property of the reCAPTCHA **div** element or passed inside options object of **execute** method call, like **grecaptcha.execute('websiteKey'{ action: 'myAction' })**.",
    optional: true,
  },
  isEnterprise: {
    type: "boolean",
    label: "Is Enterprise",
    description: "Pass **true** for Enterprise version of reCAPTCHA. You can identify it by **enterprise.js** script used instead of **api.js** or by **grecaptcha.enterprise.execute** call used instead of **grecaptcha.execute**.",
    optional: true,
  },
  apiDomain: {
    type: "boolean",
    label: "API Domain",
    description: "Domain used to load the captcha: **google.com** or **recaptcha.net**. Default value: **google.com**.",
    optional: true,
  },
};
