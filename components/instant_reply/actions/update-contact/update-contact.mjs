import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-update-contact",
  name: "Update Contact",
  description: "Update an existing contact's name, email, or lead classification in Instant Reply. [See the documentation](https://www.instantreply.co/api-reference)",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    instantReply,
    contactId: {
      propDefinition: [
        instantReply,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      optional: true,
    },
    leadStage: {
      type: "string",
      label: "Lead Stage",
      optional: true,
    },
    leadTemperature: {
      type: "string",
      label: "Lead Temperature",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = Object.fromEntries(Object.entries({
      name: this.name,
      email: this.email,
      lead_stage: this.leadStage,
      lead_temperature: this.leadTemperature,
    }).filter(([, value]) => value !== undefined && value !== ""));
    if (!Object.keys(data).length) throw new Error("Provide at least one contact field to update.");
    const response = await this.instantReply.updateContact({
      $,
      contactId: this.contactId,
      data,
    });
    $.export("$summary", `Contact ${this.contactId} updated`);
    return response;
  },
};
