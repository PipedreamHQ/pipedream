import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-update-deal-note",
  name: "Update Deal Note",
  description: "Update a note attached to a deal. [See the documentation](https://github.com/agilecrm/rest-api#46-update-note-to-a-deal)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    deal: {
      propDefinition: [
        agileCrm,
        "deal",
      ],
    },
    note: {
      propDefinition: [
        agileCrm,
        "dealNote",
        (c) => ({
          dealId: c.deal,
        }),
      ],
    },
    subject: {
      propDefinition: [
        agileCrm,
        "noteSubject",
      ],
    },
    description: {
      propDefinition: [
        agileCrm,
        "noteDescription",
      ],
    },
  },
  async run({ $ }) {
    const notes = await this.agileCrm.listDealNotes({
      dealId: this.deal,
      $,
    });
    const note = notes.find(({ id }) => id === this.note);
    const response = await this.agileCrm.updateDealNote({
      data: {
        id: this.note,
        subject: this.subject,
        description: this.description || note.description,
        deal_ids: [
          this.deal,
        ],
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated note for deal with ID ${this.deal}`);
    }

    return response;
  },
};
