export default {
  proxyType: {
    type: "string",
    label: "Proxy Type",
    description: "The type of proxy.",
    options: [
      "http",
      "socks4",
      "socks5",
    ],
  },
  proxyAddress: {
    type: "string",
    label: "Proxy Address",
    description: "Proxy IP address or hostname.",
  },
  proxyPort: {
    type: "string",
    label: "Proxy Port",
    description: "The port of the proxy.",
  },
  proxyLogin: {
    type: "string",
    label: "Proxy Login",
    description: "Login for basic authentication on the proxy.",
    optional: true,
  },
  proxyPassword: {
    type: "string",
    label: "Proxy Password",
    description: "Password for basic authentication on the proxy.",
    optional: true,
  },
};
