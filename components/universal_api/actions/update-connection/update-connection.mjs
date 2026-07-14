import app from "../../universal_api.app.mjs";
import { CONNECTION_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-update-connection",
  name: "Update Connection",
  description:
    "Update a connection identified by `universalApi` and `serviceId` via the Platform API on Universal API (PATCH; only supplied fields are changed). Run **List Connections** first to find the correct `serviceId`. [See the documentation](https://docs.universalapi.io/reference/update-connection).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
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
    universalApi: {
      propDefinition: [
        app,
        "universalApi",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "The service ID that, together with `universalApi`, identifies the connection (e.g. `kandji`, `jamf`, `teamtailor`).",
      optional: false,
      options: CONNECTION_SERVICE_IDS,
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Required for BambooHR, Teamtailor, Bring, Posti, PostNord, Hexnode.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Required for Velory, BambooHR, Kandji, Hexnode.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Required for Velory.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Required for Velory.",
      optional: true,
      secret: true,
    },
    accessToken: {
      type: "string",
      label: "Access Token",
      description: "Required for Kandji, HaileyHR, Deel.",
      optional: true,
      secret: true,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "Required for CatalystOne, Fedex.",
      optional: true,
    },
    clientSecret: {
      type: "string",
      label: "Client Secret",
      description: "Required for CatalystOne, Fedex.",
      optional: true,
      secret: true,
    },
    serviceUserId: {
      type: "string",
      label: "Service User ID",
      description: "Required for HiBob.",
      optional: true,
    },
    serviceUserToken: {
      type: "string",
      label: "Service User Token",
      description: "Required for HiBob.",
      optional: true,
      secret: true,
    },
    login: {
      type: "string",
      label: "Login",
      description: "Required for Bring.",
      optional: true,
    },
    apiSecret: {
      type: "string",
      label: "API Secret",
      description: "Required for Posti.",
      optional: true,
      secret: true,
    },
    ssoUrl: {
      type: "string",
      label: "SSO URL",
      description: "Required for AzureSAML, GoogleSAML.",
      optional: true,
    },
    certificate: {
      type: "string",
      label: "Certificate",
      description: "Required for AzureSAML, GoogleSAML.",
      optional: true,
    },
    ipEntityId: {
      type: "string",
      label: "IP Entity ID",
      description: "Required for AzureSAML, GoogleSAML.",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Whether the connection is enabled.",
      optional: true,
    },
    redirectUri: {
      type: "string",
      label: "Redirect URI",
      description: "Required for AzureSAML, GoogleSAML. Optional for GoogleWorkspace, Azure Active Directory, Microsoft Intune, Google Devices.",
      optional: true,
    },
    acsUrl: {
      type: "string",
      label: "ACS URL",
      description: "Required for AzureSAML, GoogleSAML.",
      optional: true,
    },
    spEntityId: {
      type: "string",
      label: "SP Entity ID",
      description: "Required for AzureSAML, GoogleSAML.",
      optional: true,
    },
  },
  async run({ $ }) {
    const settings = {
      apiKey: this.apiKey,
      domain: this.domain,
      email: this.email,
      password: this.password,
      accessToken: this.accessToken,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      serviceUserId: this.serviceUserId,
      serviceUserToken: this.serviceUserToken,
      login: this.login,
      apiSecret: this.apiSecret,
      ssoUrl: this.ssoUrl,
      certificate: this.certificate,
      ipEntityId: this.ipEntityId,
    };
    const metadata = {
      redirectUri: this.redirectUri,
      acsUrl: this.acsUrl,
      spEntityId: this.spEntityId,
    };
    const hasEntries = (obj) => Object.values(obj).some((value) => value !== undefined);
    const response = await this.app.updateConnection({
      $,
      consumerId: this.consumerId,
      universalApi: this.universalApi,
      serviceId: this.serviceId,
      data: {
        ...(hasEntries(settings) && {
          settings,
        }),
        ...(hasEntries(metadata) && {
          metadata,
        }),
        enabled: this.enabled,
      },
    });
    $.export("$summary", `Successfully updated connection ${this.universalApi} ${this.serviceId}`);
    return response;
  },
};
