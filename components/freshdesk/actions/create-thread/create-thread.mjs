import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-thread",
  name: "Create a Thread",
  description: "Create a thread to a ticket. [See the documentation](https://developers.freshdesk.com/api/#create_a_thread).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    type: {
      type: "string",
      label: "Type",
      description: "Type of the thread.",
      options: [
        "forward",
        "discussion",
      ],
    },
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
      label: "Parent ID",
      description: "The ID of the ticket to create the thread for.",
    },
    emailConfigId: {
      propDefinition: [
        freshdesk,
        "fromEmail",
      ],
      label: "Email Config ID",
      description: "The ID of the email config to use for the thread.",
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.createThread({
      $,
      data: {
        type: this.type,
        parent: {
          id: this.ticketId,
          type: "ticket",
        },
        additional_info: {
          email_config_id: this.emailConfigId.value,
        },
      },
    });

    $.export("$summary", `Thread created successfully with ID: ${response.id}`);
    return response;
  },
};
