import { ConfigurationError } from "@pipedream/platform";
import pipedriveApp from "../../pipedrive.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Creates a new deal in Pipedrive. Only `Title` is required; everything else is optional."
    + " To link the deal, pass a person ID from **Search persons** / **List Persons**, an organization ID from **List Organizations**, and an owner ID from **List User ID Options**."
    + " To place it in a specific pipeline stage, pass a `Stage ID` from **List Stages** (use **List Pipelines** first to find the pipeline); if omitted, the deal goes to the first stage of the default pipeline."
    + " Example: `Title` `Northgate Logistics - Annual Renewal 2026`, `Value` `5000`, `Currency` `USD`, `Person ID` `42`, `Stage ID` `3`."
    + " Custom fields are keyed by their 40-character field hash, not their display name. Setting `Note` adds a note to the new deal after it is created."
    + " Use **Update Deal** to change it later. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#addDeal)",
  version: "0.1.27",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "The ID of the pipeline to add the deal to, e.g. `1`. Use **List Pipelines** to find it (the `id` field). If `Stage ID` is also set, the stage must belong to this pipeline.",
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
