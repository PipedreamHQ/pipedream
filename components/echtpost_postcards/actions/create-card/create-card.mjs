import echtpostPostcards from "../../echtpost_postcards.app.mjs";

export default {
  key: "echtpost_postcards-create-card",
  name: "Create and Schedule a Postcard",
  description: "This action creates and schedules a postcard for delivery. [See the documentation](https://hilfe.echtpost.de/article/20/postkartenversand-uber-api-programmierschnittstelle)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    echtpostPostcards,
    templateId: {
      propDefinition: [
        echtpostPostcards,
        "templateId",
      ],
    },
    contactId: {
      propDefinition: [
        echtpostPostcards,
        "contactId",
      ],
    },
    scheduledDate: {
      propDefinition: [
        echtpostPostcards,
        "scheduledDate",
      ],
    },
  },
  async run({ $ }) {
    const card = {
      template_id: this.templateId,
      deliver_at: this.scheduledDate,
      contact_id: this.contactId,
    };
    const response = await this.echtpostPostcards.sendPostcard({
      $,
      data: {
        card,
      },
    });

    $.export("$summary", "Successfully scheduled postcard");
    return response;
  },
};
