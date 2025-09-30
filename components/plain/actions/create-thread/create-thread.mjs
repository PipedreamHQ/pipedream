import plain from "../../plain.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "plain-create-thread",
  name: "Create Thread",
  description: "Creates a new thread with a given customer. [See the documentation](https://www.plain.com/docs/api-reference/graphql/threads/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    plain,
    customerId: {
      propDefinition: [
        plain,
        "customerId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the thread",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text message to start the thread",
    },
    labelTypeIds: {
      propDefinition: [
        plain,
        "labelTypeIds",
      ],
    },
    assigneeId: {
      propDefinition: [
        plain,
        "userId",
      ],
      label: "Assignee ID",
    },
  },
  async run({ $ }) {
    const variables = {
      input: {
        title: this.title,
        customerIdentifier: {
          customerId: this.customerId,
        },
        components: [
          {
            componentText: {
              text: this.text,
            },
          },
        ],
        labelTypeIds: this.labelTypeIds,
        assignedTo: this.assigneeId
          ? {
            userId: this.assigneeId,
          }
          : undefined,
      },
    };
    const { data } = await this.plain.post({
      $,
      data: {
        query: mutations.createThread,
        variables,
      },
    });

    $.export("$summary", `Successfully created thread with ID ${data.createThread.thread.id}`);

    return data;
  },
};
