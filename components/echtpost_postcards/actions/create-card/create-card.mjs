import echtpost_postcards from "../../echtpost_postcards.app.mjs";

export default {
  key: "echtpost_postcards-create-card",
  name: "Create and Schedule a Postcard",
  description: "This action creates and schedules a postcard for delivery. [See the documentation](https://hilfe.echtpost.de/article/20/postkartenversand-uber-api-programmierschnittstelle)",
  version: "0.0.1",
  type: "action",
  props: {
    echtpost_postcards,
    design: {
      propDefinition: [
        echtpost_postcards,
        "design",
      ],
    },
    message: {
      propDefinition: [
        echtpost_postcards,
        "message",
      ],
    },
    recipient: {
      propDefinition: [
        echtpost_postcards,
        "recipient",
      ],
    },
    scheduledDate: {
      propDefinition: [
        echtpost_postcards,
        "scheduledDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.echtpost_postcards.sendPostcard({
      design: this.design,
      message: this.message,
      recipient: this.recipient,
      scheduledDate: this.scheduledDate,
    });

    $.export("$summary", `Successfully scheduled postcard creation with design template ID ${this.design}`);
    return response;
  },
};
