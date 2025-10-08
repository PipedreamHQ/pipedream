import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-service-point-carriers",
  name: "List Service Point Carriers",
  description: "List carriers that support service points. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/service-points/operations/list-carriers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    accessToken: {
      propDefinition: [
        app,
        "accessToken",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      accessToken,
    } = this;

    const response = await app.listServicePointCarriers({
      $,
      params: {
        access_token: accessToken,
      },
    });

    $.export("$summary", "Successfully listed service point carriers");

    return response;
  },
};

