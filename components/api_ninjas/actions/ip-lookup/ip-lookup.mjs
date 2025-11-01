import app from "../../api_ninjas.app.mjs";

export default {
  key: "api_ninjas-ip-lookup",
  name: "IP Lookup",
  description: "Returns the location of the IP address specified. [See the documentation](https://api-ninjas.com/api/iplookup)",
  version: "0.0.1",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.ipLookup({
      $,
      params: {
        address: this.address,
      },
    });
    $.export("$summary", "Successfully sent the request to lookup the IP: " + this.address);
    return response;
  },
};
