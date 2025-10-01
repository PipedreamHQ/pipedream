import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-campfire-message",
  name: "Create Campfire Message",
  description: "Creates a message in a selected Campfire. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/campfires.md#create-a-campfire-line)",
  type: "action",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    campfireId: {
      propDefinition: [
        app,
        "campfireId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The plain text body for the Campfire message.",
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      campfireId,
      content,
    } = this;

    const message = await this.app.createCampfireMessage({
      $,
      accountId,
      projectId,
      campfireId,
      data: {
        content,
      },
    });

    $.export("$summary", `Successfully created campfire message (ID: ${message.id})`);
    return message;
  },
};
