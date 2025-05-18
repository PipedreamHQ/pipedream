import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import pipedriveApp from "../../pipedrive.app.mjs";

dayjs.extend(utc)

export default {
  key: "fiable-pipedrive-add-deal",
  name: "Add Deal (Fiable)",
  description: "Adds a new deal if missing. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.0.28",
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
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Anility Id custom field in Pipedrive",
    },
    anilityIdFieldValue: {
      type: "string",
      label: "AnilityId field value",
      description: "Anility Id custom field value in Pipedrive",
    },
    anilityCustomerIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "orgCustomFieldKey",
      ],
      description: "Customer Id custom field in Pipedrive",
    },
    anilityCustomerIdFieldValue: {
      type: "integer",
      label: "CustomerId field key",
      description: "Pipedrive organization id (value) for customer",
    },
    anilityOrderByIdFieldKey: {
      propDefinition: [
        pipedriveApp,
        "personCustomFieldKey",
      ],
      description: "Order By Id custom field in Pipedrive",
    },
    anilityOrderByIdFieldValue: {
      type: "integer",
      label: "Order By Id field key",
      description: "Pipedrive person id (value) who ordered the assessment",
    },
    anilityDelayRequestFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Delay Request field in Pipedrive",
    },
    anilityDelayRequestFieldValue: {
      type: "string",
      label: "Delay Request field value",
      description: "Custom field to decide if the emails should be delayed",
    },
    anilityExpiryDateFieldKey: {
      propDefinition: [
        pipedriveApp,
        "dealCustomFieldKey",
      ],
      description: "Expiry date field in Pipedrive",
    },
    anilityExpiryDateFieldValue: {
      type: "string",
      label: "Expiry date field value",
      description: "Custom field to set the proposed expiry date",
    },
    label: {
      type: "string",
      label: "label",
      description: "Deal label",
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
      anilityDelayRequestFieldKey,
      anilityDelayRequestFieldValue,
      anilityExpiryDateFieldKey,
      anilityExpiryDateFieldValue,
      label,
    } = this;

    const { data: stages } = await this.pipedriveApp.getDealFields();
    var labelOption = stages.find((stage) => stage.key === "label")
      .options.find((option) => option.label.toLowerCase() === label.toLowerCase());

    var labelValue = {};
    if (labelOption) {
      labelValue["label_ids"] = [
        labelOption.id,
      ];
    }

    var delayRequestOption = stages.find((stage) => stage.key === anilityDelayRequestFieldKey)
      .options.find((option) => option.label.toLowerCase() === anilityDelayRequestFieldValue.toLowerCase());

    try {
      const searchResp = await this.pipedriveApp.searchDeals({
        term: anilityIdFieldValue,
        fields: "custom_fields",
        exact_match: true,
        limit: 1,
      });
      if (searchResp.data.items.length === 0) {
        const utcAddTime = dayjs(addTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]")
        var customFieldValue = {};
        customFieldValue[anilityIdFieldKey] = anilityIdFieldValue;
        customFieldValue[anilityCustomerIdFieldKey] = anilityCustomerIdFieldValue;
        customFieldValue[anilityOrderByIdFieldKey] = anilityOrderByIdFieldValue;
        customFieldValue[anilityDelayRequestFieldKey] = delayRequestOption.id;
        customFieldValue[anilityExpiryDateFieldKey] = anilityExpiryDateFieldValue;
        const resp = await this.pipedriveApp.addDeal({
          title,
          value,
          currency,
          owner_id: userId,
          person_id: personId,
          org_id: organizationId,
          stage_id: stageId,
          status,
          probability,
          lost_reason: lostReason,
          visible_to: visibleTo,
          add_time: utcAddTime,
          pipeline_id: pipelineId,
          "custom_fields": {
            ...customFieldValue,
          },
          ...labelValue,
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
