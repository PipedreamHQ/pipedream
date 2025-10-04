import app from "../../appsflyer.app.mjs";

export default {
  key: "appsflyer-get-message-fields",
  name: "Get Message Fields",
  description: "Returns a list of the available message fields for each platform. [See the documentation](https://dev.appsflyer.com/hc/reference/get_fields-platform)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    platform: {
      type: "string",
      label: "Platform",
      description: "The platform to retrieve message fields for.",
      options: [
        "ios",
        "android",
        "windowsphone",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      platform,
    } = this;

    const response = await app.getMessageFields({
      $,
      platform,
    });

    $.export("$summary", `Successfully retrieved message fields with request ID \`${response.request_id}\`.`);
    return response;
  },
};
