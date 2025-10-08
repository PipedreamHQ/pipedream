import ipbase from "../../ipbase.app.mjs";

export default {
  key: "ipbase-check-ip-address",
  name: "Check IP Address",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Checks the provided IP address (both `v4` & `v6` formats) and returns all available information. [See the docs here](https://ipbase.com/docs/info)",
  type: "action",
  props: {
    ipbase,
    ip: {
      propDefinition: [
        ipbase,
        "ip",
      ],
    },
    language: {
      type: "string",
      label: "Language",
      description: "An ISO Alpha 2 Language Code for localizing the IP data.",
      optional: true,
    },
    hostname: {
      type: "boolean",
      label: "Hostname",
      description: "If the hostname parameter is set to `TRUE`, the API response will contain the hostname of the ip. Default to `FALSE`",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      ipbase,
      hostname,
      ...params
    } = this;
    const response = await ipbase.getIPInfo({
      $,
      params: {
        ...params,
        hostname: +hostname,
      },
    });

    $.export("$summary", `IP address ${response.data.ip} was successfully fetched!`);
    return response;
  },
};
