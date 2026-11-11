import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "pipedrive-list-organizations",
  name: "List Organizations",
  description: "List organizations in your Pipedrive account. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Organizations#getOrganizations)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
          filterType: "org",
        }),
      ],
      label: "Filter ID",
      description: "The ID of the filter to apply to organizations",
    },
    organizationIds: {
      propDefinition: [
        pipedriveApp,
        "organizationId",
      ],
      type: "string[]",
      label: "Organization IDs",
      description: "The IDs of the organizations to list (up to 100). **Filter ID** takes precedence over **Organization IDs** when supplied.",
    },
    ownerId: {
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
      label: "Owner ID",
      description: "ID of the user who owns the organization. If omitted, organizations owned by any user are returned. **Filter ID** takes precedence over **Owner ID** when supplied.",
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "If set, only organizations with an update_time later than or equal to this time are returned. In RFC3339 format, e.g. 2025-01-01T10:20:00Z.",
      optional: true,
    },
    updatedUntil: {
      type: "string",
      label: "Updated Until",
      description: "If set, only organizations with an update_time earlier than this time are returned. In RFC3339 format, e.g. 2025-01-01T10:20:00Z.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort by",
      options: constants.ORGANIZATION_SORT_BY_OPTIONS,
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
      options: constants.ORGANIZATION_INCLUDE_FIELDS_OPTIONS,
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Optional string array of custom field keys to include in the response.",
      optional: true,
    },
    includeOptionLabels: {
      type: "boolean",
      label: "Include Option Labels",
      description: "When `true`, single-option and multi-option custom field values include the option labels alongside their IDs. Defaults to `false`.",
      optional: true,
    },
    includeLabels: {
      type: "boolean",
      label: "Include Labels",
      description: "When `true`, the response includes an array of label objects (`{ id, label, color }`) for each organization. Defaults to `false`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "For pagination, the limit of entries to be returned. If not provided, 100 items will be returned. Maximum allowed value is 500.",
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
    const response = await this.pipedriveApp.getOrganizations({
      filter_id: this.filterId,
      ids: this.organizationIds
        ? this.organizationIds.join(",")
        : undefined,
      owner_id: this.ownerId,
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
      include_option_labels: this.includeOptionLabels,
      include_labels: this.includeLabels,
      limit: this.limit,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully listed ${response.data?.length ?? 0} organization(s)`);
    return response;
  },
};
