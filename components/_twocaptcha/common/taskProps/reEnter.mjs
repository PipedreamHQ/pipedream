export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the reCAPTCHA V2 Enterprise task.",
    options: [
      "RecaptchaV2EnterpriseTaskProxyless",
      "RecaptchaV2EnterpriseTask",
    ],
    default: "RecaptchaV2EnterpriseTaskProxyless",
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
    description: "reCAPTCHA sitekey. Can be found inside **data-sitekey** property of the reCAPTCHA **div** element or inside **k** parameter of the requests to reCAPTHCHA API. You can also use the [script](https://gist.github.com/2captcha/2ee70fa1130e756e1693a5d4be4d8c70) to find the value.",
  },
  enterprisePayload: {
    type: "string",
    label: "Enterprise Payload",
    description: "Additional parameters passed to **grecaptcha.enterprise.render** call. For example, there can be an object containing **s** value.",
    optional: true,
  },
  isInvisible: {
    type: "boolean",
    label: "Is Invisible",
    description: "Pass **true** for Invisible version of reCAPTCHA - a case when you don't see the checkbox, but the challenge appears. Mostly used with a callback function.",
    optional: true,
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
  cookies: {
    type: "string",
    label: "Cookies",
    description: "Your cookies will be set in a browser of our worker. Suitable for captcha on Google services. The format is: **key1=val1; key2=val2**.",
    optional: true,
  },
  apiDomain: {
    type: "boolean",
    label: "API Domain",
    description: "Domain used to load the captcha: **google.com** or **recaptcha.net**. Default value: **google.com**.",
    optional: true,
  },
};
