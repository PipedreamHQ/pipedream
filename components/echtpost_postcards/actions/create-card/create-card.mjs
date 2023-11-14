import echtpost_postcards from "../../echtpost_postcards.app.mjs";

export default {
  key: "echtpost_postcards-create-card",
  name: "Create and Schedule a Postcard",
  description: "This action creates and schedules a postcard for delivery. [See the documentation](https://hilfe.echtpost.de/article/20/postkartenversand-uber-api-programmierschnittstelle)",
  version: "0.0.1",
  type: "action",
  props: {
    echtpost_postcards,
    templateId: {
      propDefinition: [
        echtpost_postcards,
        "templateId",
      ],
    },
    contactId: {
      propDefinition: [
        echtpost_postcards,
        "contactId",
      ],
    },
    scheduledDate: {
      propDefinition: [
        echtpost_postcards,
        "scheduledDate",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      template_id: this.templateId,
      deliver_at: this.scheduledDate,
    };
    const { contactId } = this;
    data[typeof contactId === "string"
      ? "contact_id"
      : "contact_ids"] = contactId;
    const response = await this.echtpost_postcards.sendPostcard({
      $,
      data,
    });

    $.export("$summary", `Successfully scheduled postcard creation with design template ID ${this.design}`);
    return response;
  },
};
