import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-add-deal",
  name: "Add Deal (Anility)",
  description: "Adds a new deal if missing. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    title: {
      propDefinition: [
        pipedriveApp,
        "dealTitle",
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
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
    },
    pipelineId: {
      propDefinition: [
        pipedriveApp,
        "pipelineId",
      ],
    },
    anilityIdFieldKey: {
      type: "string",
      label: "AnilityId field key",
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    anilityCustomerIdFieldKey: {
      type: "string",
      label: "CustomerId field key",
      description: "Pipedrive organization id for customer",
    },
    anilityCustomerIdFieldValue: {
      type: "string",
      label: "CustomerId field key",
      description: "Pipedrive organization id  (value) for customer",
    },
    anilityOrderByIdFieldKey: {
      type: "string",
      label: "Order By Id field key",
      description: "Pipedrive person id who ordered the assessment",
    },
    anilityOrderByIdFieldValue: {
      type: "string",
      label: "Order By Id field key",
      description: "Pipedrive person id (value) who ordered the assessment",
    },
  },
  async run({ $ }) {
    const {
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
      addTime,
      pipelineId,
      anilityIdFieldKey,
      anilityIdFieldValue,
      anilityCustomerIdFieldKey,
      anilityCustomerIdFieldValue,
      anilityOrderByIdFieldKey,
      anilityOrderByIdFieldValue,
    } = this;

    try {
      const searchResp = await this.pipedriveApp.searchDeals({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        start: 0,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        var customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        customFieldValue[anilityCustomerIdFieldKey] = anilityCustomerIdFieldValue;
        customFieldValue[anilityOrderByIdFieldKey] = anilityOrderByIdFieldValue;
        const resp = await this.pipedriveApp.addDeal({
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
          add_time: addTime,
          pipeline_id: pipelineId,
          ...customFieldValue,
        });

        $.export("$summary", "Successfully added deal");

        return resp;
      }
      else {
        $.export("$summary", "Deal already exists");
        return {
          data: searchResp.data.items[0].item,
        };
      }

    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add deal";
    }
  },
};
