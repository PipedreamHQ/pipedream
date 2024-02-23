export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the reCAPTCHA V2 Enterprise task.",
    options: [
      "KeyCaptchaTaskProxyless",
      "KeyCaptchaTask",
    ],
    default: "KeyCaptchaTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  sscUserId: {
    type: "string",
    label: "S S C user id",
    description: "The value of **s_s_c_user_id** parameter found on page.",
  },
  sscSessionId: {
    type: "string",
    label: "S S C session id",
    description: "The value of **s_s_c_session_id** parameter found on page.",
  },
  sscWebServerSign: {
    type: "string",
    label: "S S C web server sign",
    description: "The value of **s_s_c_web_server_sign** parameter found on page.",
  },
  sscWebServerSign2: {
    type: "string",
    label: "S S C web server sign 2",
    description: "The value of **s_s_c_web_server_sign2** parameter found on page.",
  },
};
