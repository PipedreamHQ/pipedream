import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-mdm-apn-certs",
  name: "List MDM APN Certificates",
  description:
    "List APN (Apple Push Notification) certificates from the MDM API on Universal API. [See the documentation](https://docs.universalapi.io/reference/list-apn-certs).",
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
        "mdmServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listMdmApnCerts({
      $,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} MDM APN certificate(s)`);
    return response;
  },
};
