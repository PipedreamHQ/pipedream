import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-update-deal",
  name: "Update Deal (Anility)",
  description: "Updates the properties of a deal. With optional custom field. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#updateDeal)",
  version: "0.0.2",
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
    customFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      label: "Custom field key",
      description: "Custom field in Pipedrive",
    },
    customFieldValue: {
      type: "string",
      label: "Custom field value",
      description: "Custom field value",
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
      customFieldKey,
      customFieldValue,
    } = this;

    try {
      const customField = {};
      customField[customFieldKey] = customFieldValue;

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
          ...customField,
        });

      $.export("$summary", "Successfully updated deal");

      return resp;

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to update deal";
    }
  },
};
