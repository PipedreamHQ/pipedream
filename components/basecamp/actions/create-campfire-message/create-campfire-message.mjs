import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-campfire-message",
  name: "Create Campfire Message",
  description: "Creates a line in the Campfire for the selected project. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/campfires.md#create-a-campfire-line)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
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
      description: "The plain text body for the Campfire line.",
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

    $.export("$summary", `Successfully posted campfire message with ID ${message.id}`);
    return message;
  },
};
