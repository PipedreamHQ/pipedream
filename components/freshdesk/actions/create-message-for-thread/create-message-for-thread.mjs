import { parseObject } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-message-for-thread",
  name: "Create Message For Thread",
  description: "Create message for a thread. [See the documentation](https://developers.freshdesk.com/api/#create_message_for_thread).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
      label: "Ticket ID",
      description: "ID of the ticket to create the message for.",
    },
    threadId: {
      propDefinition: [
        freshdesk,
        "threadId",
        ({ ticketId }) => ({
          ticketId,
        }),
      ],
      label: "Thread ID",
      description: "ID of the thread to create the message for.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the note in HTML format.",
      optional: true,
    },
    participants: {
      type: "string[]",
      label: "Participants",
      description: "List of the participants to be added to the message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.createMessageForThread({
      $,
      data: {
        body: this.body,
        participants: {
          email: {
            to: parseObject(this.participants),
          },
        },
        thread_id: this.threadId,
      },
    });

    $.export("$summary", `Message created successfully with ID: ${response.id}`);
    return response;
  },
};
