import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-sso-profile",
  name: "Get SSO Profile",
  description:
    "Retrieve the SSO profile from the connected SSO integration on Universal API. [See the documentation](https://docs.universalapi.io/reference/get-profile).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "ssoServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSsoProfile({
      $,
      consumerId: this.consumerId,
      serviceId: this.serviceId,
    });
    $.export("$summary", "Successfully retrieved SSO profile");
    return response;
  },
};
