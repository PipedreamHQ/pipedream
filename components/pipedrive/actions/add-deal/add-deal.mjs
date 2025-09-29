import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Adds a new deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.1.16",
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
    isDeleted: {
      propDefinition: [
        pipedriveApp,
        "isDeleted",
      ],
    },
    isArchived: {
      propDefinition: [
        pipedriveApp,
        "isArchived",
      ],
    },
    archiveTime: {
      propDefinition: [
        pipedriveApp,
        "archiveTime",
      ],
    },
    closeTime: {
      propDefinition: [
        pipedriveApp,
        "closeTime",
      ],
    },
    wonTime: {
      propDefinition: [
        pipedriveApp,
        "wonTime",
      ],
    },
    lostTime: {
      propDefinition: [
        pipedriveApp,
        "lostTime",
      ],
    },
    expectedCloseDate: {
      propDefinition: [
        pipedriveApp,
        "expectedCloseDate",
      ],
    },
    labelIds: {
      propDefinition: [
        pipedriveApp,
        "labelIds",
      ],
    },
    customFields: {
      propDefinition: [
        pipedriveApp,
        "customFields",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "The content of a note to be attached to the deal. The note will be created after the deal is successfully added.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pipedriveApp,
      title,
      ownerId,
      personId,
      orgId,
      pipelineId,
      stageId,
      value,
      currency,
      status,
      probability,
      lostReason,
      visibleTo,
      isDeleted,
      isArchived,
      archiveTime,
      closeTime,
      wonTime,
      lostTime,
      expectedCloseDate,
      labelIds,
      customFields,
      note,
    } = this;

    try {
      const resp = await pipedriveApp.addDeal({
        title,
        owner_id: ownerId,
        person_id: personId,
        org_id: orgId,
        pipeline_id: pipelineId,
        stage_id: stageId,
        value,
        currency,
        status,
        probability,
        lost_reason: lostReason,
        visible_to: visibleTo,
        is_deleted: isDeleted,
        is_archived: isArchived,
        archive_time: archiveTime,
        close_time: closeTime,
        won_time: wonTime,
        lost_time: lostTime,
        expected_close_date: expectedCloseDate,
        label_ids: parseObject(labelIds),
        custom_fields: parseObject(customFields),
      });

      if (note) {
        await pipedriveApp.addNote({
          content: note,
          deal_id: resp.data?.id,
        });
      }

      $.export("$summary", "Successfully added deal");

      return resp;
    } catch ({ error }) {
      throw new ConfigurationError(error);
    }
  },
};
