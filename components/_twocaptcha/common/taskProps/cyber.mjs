export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the ArkoseLabs task.",
    options: [
      "AntiCyberSiAraTask",
      "AntiCyberSiAraTaskProxyless",
    ],
    default: "AntiCyberSiAraTask",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded.",
  },
  SlideMasterUrlId: {
    type: "string",
    label: "Slide Master Url Id",
    description: "The value of the **MasterUrlId** parameter obtained from the request to the endpoint **API/CyberSiara/GetCyberSiara**.",
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
};
