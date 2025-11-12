import app from "../../botpress.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "botpress-list-conversations",
  name: "List Conversations",
  description: "List conversations. [See the documentation](https://botpress.com/docs/api-documentation/#list-conversations)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    participanIds: {
      type: "string[]",
      label: "Participant IDs",
      description: "IDs of the participants.",
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
    },
    integrationName: {
      type: "string",
      label: "Integration Name",
      description: "Name of the integration. Eg. `webchat`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      participantIds,
      integrationName,
    } = this;

    const resources = await app.paginate({
      resourcesFn: app.listConversations,
      resourcesFnArgs: {
        $,
        params: {
          participantIds: utils.parseArray(participantIds),
          integrationName,
        },
      },
      resourceName: "conversations",
    });

    $.export("$summary", `Successfully listed \`${resources.length}\` conversation(s).`);

    return resources;
  },
};
