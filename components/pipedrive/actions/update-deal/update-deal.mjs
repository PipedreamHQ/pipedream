import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-update-deal",
  name: "Update Deal",
  description: "Updates the properties of a deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/#!/Deals)",
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
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "ID of the deal",
    },
    title: {
      propertyDefinition: [
        pipedriveApp,
        "dealTitle",
      ],
      optional: true,
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
  },
  async run({ $ }) {
    const {
      companyDomain,
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

    const resp =
      await this.pipedriveApp.updateDeal({
        companyDomain,
        dealId,
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
        },
      });

    $.export("$summary", "Successfully updated deal");

    return resp;
  },
};
