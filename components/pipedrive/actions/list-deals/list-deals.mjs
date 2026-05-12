import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pipedrive-list-deals",
  name: "List Deals",
  description: "List deals in your Pipedrive account. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Deals#listDeals)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedriveApp,
    filterId: {
      propDefinition: [
        pipedriveApp,
        "filterId",
        () => ({
          filterType: "deals",
        }),
      ],
      label: "Filter ID",
      description: "The ID of the filter to apply to deals",
    },
    dealIds: {
      propDefinition: [
        pipedriveApp,
        "dealId",
      ],
      type: "string[]",
      label: "Deal IDs",
      description: "The IDs of the deals to list. **Filter ID** takes precedence over **Deal IDs** when supplied.",
    },
    ownerId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used. However, **Filter ID** takes precedence over **Owner ID** when supplied.",
    },
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
      description: "If supplied, only deals matching the given person will be returned. However, **Filter ID** takes precedence over **Person ID** when supplied.",
    },
    organizationId: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      description: "If supplied, only deals matching the given organization will be returned. However, **Filter ID** takes precedence over **Organization ID** when supplied.",
    },
    pipelineId: {
      propDefinition: [
        pipedriveApp,
        "pipelineId",
      ],
      description: "If supplied, only deals matching the given pipeline will be returned. However, **Filter ID** takes precedence over **Pipeline ID** when supplied.",
    },
    stageId: {
      propDefinition: [
        pipedriveApp,
        "stageId",
      ],
      description: "If supplied, only deals matching the given stage will be returned. However, **Filter ID** takes precedence over **Stage ID** when supplied.",
    },
    status: {
      propDefinition: [
        pipedriveApp,
        "status",
      ],
      description: "Only fetch deals with a specific status",
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "If set, only deals with an update_time later than or equal to this time are returned. In RFC3339 format, e.g. 2025-01-01T10:20:00Z.",
      optional: true,
    },
    updatedUntil: {
      type: "string",
      label: "Updated Until",
      description: "If set, only deals with an update_time earlier than or equal to this time are returned. In RFC3339 format, e.g. 2025-01-01T10:20:00Z.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by",
      options: constants.DEAL_SORT_BY_OPTIONS,
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort by",
      options: constants.SORT_DIRECTION_OPTIONS,
      optional: true,
    },
    includeFields: {
      type: "string[]",
      label: "Include Fields",
      description: "Additional fields to include in the response",
      options: constants.DEAL_INCLUDE_FIELDS_OPTIONS,
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Optional comma separated string array of custom fields keys to include",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "For pagination, the limit of entries to be returned. If not provided, 100 items will be returned. Please note that a maximum value of 500 is allowed.",
      max: 500,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "For pagination, the cursor to the next page of results. If not provided, the first page will be returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pipedriveApp.getDeals({
      filter_id: this.filterId,
      ids: this.dealIds
        ? this.dealIds.join(",")
        : undefined,
      owner_id: this.ownerId,
      person_id: this.personId,
      org_id: this.organizationId,
      pipeline_id: this.pipelineId,
      stage_id: this.stageId,
      status: this.status,
      updated_since: this.updatedSince,
      updated_until: this.updatedUntil,
      sort_by: this.sortBy,
      sort_direction: this.sortDirection,
      include_fields: this.includeFields
        ? this.includeFields.join(",")
        : undefined,
      custom_fields: this.customFields
        ? this.customFields.join(",")
        : undefined,
      limit: this.limit,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully listed ${response.data.length} deals`);
    return response;
  },
};
