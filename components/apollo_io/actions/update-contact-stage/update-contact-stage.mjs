import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-update-contact-stage",
  name: "Update Contact Stage",
  description: "Updates the stage of one or more contacts in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#update-contact-stage)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactIds: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "string[]",
      label: "Contact IDs",
      description: "Identifiers of the contacts to update",
    },
    contactStageId: {
      propDefinition: [
        app,
        "contactStageId",
      ],
    },
  },
  async run({ $ }) {
    const { contacts } = await this.app.updateContactStage({
      $,
      data: {
        contact_ids: this.contactIds,
        contact_stage_id: this.contactStageId,
      },
    });

    $.export("$summary", `Successfully updated ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}.`);

    return contacts;
  },
};
