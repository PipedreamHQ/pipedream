import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Adds a new deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.1.7",
  type: "action",
  props: {
    pipedriveApp,
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
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
  },
  async run({ $ }) {
    try {
      const resp =
        await this.pipedriveApp.addDeal({
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

      $.export("$summary", "Successfully added deal");

      return resp;
    }  catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
