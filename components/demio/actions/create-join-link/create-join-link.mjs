import demio from "../../demio.app.mjs";

export default {
  key: "demio-create-join-link",
  name: "Create Join Link",
  description: "Create Join Link. [See docs here](https://publicdemioapi.docs.apiary.io/#reference/events/event-session-info/register)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    demio,
    eventId: {
      propDefinition: [
        demio,
        "eventId",
      ],
    },
    name: {
      label: "Name",
      description: "The registrant's first name",
      type: "string",
    },
    email: {
      label: "Email",
      description: "The registrant's email address.",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.demio.createJoinLink({
      $,
      data: {
        id: this.eventId,
        name: this.name,
        email: this.email,
      },
    });

    $.export("$summary", "Successfully created join link");

    return response;
  },
};
