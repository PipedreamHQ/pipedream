import { ConfigurationError } from "@pipedream/platform";
import app from "../../pipedrive.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Adds a new deal. See the Pipedrive API docs for Deals [here](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.1.14",
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "dealTitle",
      ],
    },
    ownerId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    orgId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    pipelineId: {
      propDefinition: [
        app,
        "pipelineId",
      ],
      optional: true,
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
    },
    value: {
      propDefinition: [
        app,
        "dealValue",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "dealCurrency",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    probability: {
      propDefinition: [
        app,
        "probability",
      ],
    },
    lostReason: {
      propDefinition: [
        app,
        "lostReason",
      ],
    },
    visibleTo: {
      propDefinition: [
        app,
        "visibleTo",
      ],
    },
    isDeleted: {
      propDefinition: [
        app,
        "isDeleted",
      ],
    },
    isArchived: {
      propDefinition: [
        app,
        "isArchived",
      ],
    },
    archiveTime: {
      propDefinition: [
        app,
        "archiveTime",
      ],
    },
    closeTime: {
      propDefinition: [
        app,
        "closeTime",
      ],
    },
    wonTime: {
      propDefinition: [
        app,
        "wonTime",
      ],
    },
    lostTime: {
      propDefinition: [
        app,
        "lostTime",
      ],
    },
    expectedCloseDate: {
      propDefinition: [
        app,
        "expectedCloseDate",
      ],
    },
    labelIds: {
      propDefinition: [
        app,
        "labelIds",
      ],
    },
    customFields: {
      propDefinition: [
        app,
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
      app,
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
      const resp = await app.addDeal({
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
        await app.addNote({
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
