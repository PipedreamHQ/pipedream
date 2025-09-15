import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-deal",
  name: "Update Deal",
  description: "Updates the properties of a deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.1.17",
  type: "action",
  props: {
    pipedriveApp,
    dealId: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      optional: false,
      description: "ID of the deal",
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
      description: "A note to add to the deal",
      optional: true,
    },
  },
  async run({ $ }) {
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
