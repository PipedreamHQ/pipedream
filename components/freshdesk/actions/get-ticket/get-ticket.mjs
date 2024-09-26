import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-get-ticket",
  name: "Get Ticket Details",
  description: "Get a Ticket. [See docs here](https://developers.freshdesk.com/api/#tickets)",
  version: "0.0.1",
  type: "action",
  props: {
    freshdesk,
    id: {
      type: "string",
      label: "Ticket ID",
      description: "Ticket ID.",
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.getTicket({
      $,
      id: this.id,
    });
    response && $.export("$summary", "Successfully found ticket");
    return response;
  },
};
