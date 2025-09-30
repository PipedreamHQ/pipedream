import whatsapp from "../../whatsapp_business.app.mjs";

const docLink = "https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates";

export default {
  key: "whatsapp_business-list-message-templates",
  name: "List Message Templates",
  description: `Lists message templates. [See the docs.](${docLink})`,
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    whatsapp,
  },
  async run({ $ }) {
    const response = await this.whatsapp.listMessageTemplates({
      $,
      paginate: true,
    });
    $.export("$summary", "Successfully retrieved templates");
    return response;
  },
};
