import app from "../../universal_api.app.mjs";
import { SSO_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-get-sso-profile",
  name: "Get SSO Profile",
  description:
    "Retrieve the SSO profile from the connected SSO integration on Universal API. [See the documentation](https://docs.universalapi.io/reference/profile-model).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active SSO integrations. One of: `google-saml`, `azure-saml`, `google-oidc`, `azure-oidc`.",
      options: SSO_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.getSsoProfile({
      $,
      serviceId: this.serviceId,
    });
    $.export("$summary", "Successfully retrieved SSO profile");
    return response;
  },
};
