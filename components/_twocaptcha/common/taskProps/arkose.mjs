export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the ArkoseLabs task.",
    options: [
      "FunCaptchaTaskProxyless",
      "FunCaptchaTask",
    ],
    default: "FunCaptchaTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  websitePublicKey: {
    type: "string",
    label: "Website Public Key",
    description: "ArkoseLabs CAPTCHA public key. The public key can be found in the value of the **data-pkey** parameter of the **div** element FunCaptcha, or you can find an element named (name) **fc-token** and from its value cut out the key that is specified after **pk**.",
  },
  funcaptchaApiJSSubdomain: {
    type: "string",
    label: "Funcaptcha Api JS Subdomain",
    description: "Custom subdomain used to load the captcha widget, like: **sample-api.arkoselabs.com**.",
    optional: true,
  },
  data: {
    type: "string",
    label: "Data",
    description: "Additional data payload object converted to a string with **JSON.stringify**. Example: **{\"blob\":\"BLOB_DATA_VALUE\"}**.",
    optional: true,
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
};
