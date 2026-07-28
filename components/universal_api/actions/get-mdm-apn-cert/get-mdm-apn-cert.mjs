import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-mdm-apn-cert",
  name: "Get MDM APN Certificate",
  description:
    "Retrieve the APN certificate from the MDM API on Universal API. [See the documentation](https://docs.universalapi.io/reference/get-apn-cert).",
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
        "mdmServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMdmApnCert({
      $,
      consumerId: this.consumerId,
      serviceId: this.serviceId,
    });
    $.export("$summary", "Successfully retrieved MDM APN certificate.");
    return response;
  },
};
