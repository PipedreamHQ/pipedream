import onesignalRestApi from "../../onesignal_rest_api.app.mjs";

export default {
  key: "onesignal_rest_api-create-notification",
  name: "Create Notification",
  description: "Create a notification. [See docs here](https://documentation.onesignal.com/reference/create-notification)",
  version: "0.1.1652718587",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onesignalRestApi,
    name: {
      label: "Name",
      description: "The name of the campaign",
      type: "string",
      optional: true,
    },
    included_segments: {
      label: "Included Segments",
      description: "The segment names you want to target. E.g. [\"Active Users\", \"Inactive Users\"]",
      type: "string[]",
      optional: true,
    },
    contents: {
      label: "Contents",
      description: "The notification's content (excluding the title), a map of language codes to text for each language. E.g. {\"en\": \"English Message\", \"es\": \"Spanish Message\"}",
      type: "object",
    },
  },
  async run({ $ }) {
    const response = await this.onesignalRestApi.sendNotification({
      data: {
        name: this.name,
        included_segments: this.included_segments,
        contents: typeof this.contents === "string"
          ? JSON.parse(this.contents)
          : this.contents,
      },
      $,
    });

    $.export("$summary", "Successfully created notification.");

    return response;
  },
};
