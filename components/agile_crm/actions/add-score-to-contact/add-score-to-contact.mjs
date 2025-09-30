import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-add-score-to-contact",
  name: "Add Score to Contact",
  description: "Used to change the score of a contact. [See the documentation](https://github.com/agilecrm/rest-api#15-update-lead-score-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    contact: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
    },
    score: {
      propDefinition: [
        agileCrm,
        "score",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agileCrm.addScoreToContact({
      data: {
        id: this.contact,
        lead_score: this.score,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated score of contact with ID ${this.contact}`);
    }

    return response;
  },
};
