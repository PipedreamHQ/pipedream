import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Adds a new deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/#!/Deals)",
  version: "0.1.1",
  type: "action",
  props: {
    pipedriveApp,
    companyDomain: {
      propertyDefinition: [
        pipedriveApp,
        "companyDomain",
      ],
    },
    title: {
      propertyDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
    },
    value: {
      propertyDefinition: [
        pipedriveApp,
        "dealValue",
      ],
    },
    currency: {
      propertyDefinition: [
        pipedriveApp,
        "dealCurrency",
      ],
    },
    userId: {
      propertyDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    personId: {
      propertyDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
    organizationId: {
      propertyDefinition: [
        pipedriveApp,
        "organizationId",
      ],
    },
    stageId: {
      propertyDefinition: [
        pipedriveApp,
        "stageId",
      ],
    },
    status: {
      propertyDefinition: [
        pipedriveApp,
        "status",
      ],
    },
    probability: {
      propertyDefinition: [
        pipedriveApp,
        "probability",
      ],
    },
    lostReason: {
      propertyDefinition: [
        pipedriveApp,
        "lostReason",
      ],
    },
    visibleTo: {
      propertyDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
    },
    addTime: {
      propertyDefinition: [
        pipedriveApp,
        "addTime",
      ],
    },
  },
  async run({ $ }) {
    const {
      companyDomain,
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
    } = this;

    const resp =
      await this.pipedriveApp.createDeal({
        companyDomain,
        data: {
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
        },
      });

    $.export("$summary", "Successfully added deal");

    return resp;
  },
};
