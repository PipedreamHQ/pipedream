import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-deal",
  name: "Update Deal",
  description: "Updates the properties of a deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.1.5",
  type: "action",
  props: {
    pipedriveApp,
    dealId: {
      description: "ID of the deal",
      optional: false,
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
    },
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
      optional: true,
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
    userId: {
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
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    stageId: {
      propDefinition: [
        pipedriveApp,
        "stageId",
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
    const {
      dealId,
      title,
      value,
      currency,
      userId,
      personId,
      organizationId,
      stageId,
      status,
      probability,
      lostReason,
      visibleTo,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.updateDeal({
          dealId,
          title,
          value,
          currency,
          user_id: userId,
          person_id: personId,
          org_id: organizationId,
          stage_id: stageId,
          status,
          probability,
          lost_reason: lostReason,
          visible_to: visibleTo,
        });

      $.export("$summary", "Successfully updated deal");

      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to update deal";
    }
  },
};
