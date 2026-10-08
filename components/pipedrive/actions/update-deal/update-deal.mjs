import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal in Pipedrive. Only the fields you set are changed; omitted fields keep their current values."
    + " Find the `Deal ID` with **List Deals**. Look up replacement values with **Search persons** (person), **List Organizations** (organization), **List User ID Options** (owner), and **List Pipelines** / **List Stages** (to move the deal to another pipeline or stage)."
    + " Example: to mark deal `1024` as won, set `Deal ID` `1024` and `Status` `won`; to move it, set `Stage ID` `5`."
    + " Setting `Note` adds a new note to the deal rather than editing an existing one. Use **Get Deal** to read the result."
    + " [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.1.25",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    pipedriveApp,
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      optional: false,
      description: "The ID of the deal to update, e.g. `1024`. Use **List Deals** to find it (the `id` field).",
    },
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
      optional: true,
    },
    ownerId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
    orgId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    pipelineId: {
      propDefinition: [
        pipedriveApp,
        "pipelineId",
      ],
      description: "The ID of the pipeline to move the deal to, e.g. `1`. Use **List Pipelines** to find it (the `id` field). If `Stage ID` is also set, the stage must belong to this pipeline.",
      optional: true,
    },
    stageId: {
      propDefinition: [
        pipedriveApp,
        "stageId",
      ],
    },
    value: {
      propDefinition: [
        pipedriveApp,
        "dealValue",
      ],
    },
    currency: {
      propDefinition: [
        pipedriveApp,
        "dealCurrency",
      ],
    },
    status: {
      propDefinition: [
        pipedriveApp,
        "status",
      ],
    },
    probability: {
      propDefinition: [
        pipedriveApp,
        "probability",
      ],
    },
    lostReason: {
      propDefinition: [
        pipedriveApp,
        "lostReason",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Text of a new note to add to the deal, e.g. `Customer asked for a revised quote`. HTML is allowed. This creates a new note; existing notes are not changed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = [
      "title",
      "ownerId",
      "personId",
      "orgId",
      "pipelineId",
      "stageId",
      "value",
      "currency",
      "status",
      "probability",
      "lostReason",
      "visibleTo",
      "note",
    ];
    if (fields.every((field) => this[field] === undefined)) {
      throw new ConfigurationError("Set at least one field to update, or a `Note` to add.");
    }

    try {
      const resp = await this.pipedriveApp.updateDeal({
        dealId: this.dealId,
        title: this.title,
        owner_id: this.ownerId,
        person_id: this.personId,
        org_id: this.orgId,
        pipeline_id: this.pipelineId,
        stage_id: this.stageId,
        value: this.value,
        currency: this.currency,
        status: this.status,
        probability: this.probability,
        lost_reason: this.lostReason,
        visible_to: this.visibleTo,
      });

      if (this.note) {
        await this.pipedriveApp.addNote({
          content: this.note,
          deal_id: this.dealId,
        });
      }

      $.export("$summary", "Successfully updated deal");

      return resp;

    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
