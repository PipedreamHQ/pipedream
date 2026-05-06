import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-list-spaces",
  name: "List Spaces",
  description: "List all spaces in Confluence. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-space/#api-spaces-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluence,
    ids: {
      propDefinition: [
        confluence,
        "spaceId",
      ],
      type: "string[]",
      label: "IDs",
      description: "Filter results to spaces with these numeric IDs. Accepts up to 250 IDs. Example: `[123456, 789012]`",
      optional: true,
    },
    keys: {
      type: "string[]",
      label: "Keys",
      description: "Filter results to spaces with these space keys. Accepts up to 250 keys. Example: `[\"ENG\", \"MKTG\"]`",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter results to spaces of this type. Example: `\"global\"`",
      optional: true,
      options: [
        "global",
        "collaboration",
        "knowledge_base",
        "personal",
        "system",
        "onboarding",
        "xflow_sample_space",
      ],
    },
    spaceStatus: {
      type: "string",
      label: "Status",
      description: "Filter results to spaces with this status. Use `current` for active spaces or `archived` for archived ones. Example: `\"current\"`",
      optional: true,
      options: [
        "current",
        "archived",
      ],
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Filter results to spaces that have all of these labels applied. Accepts up to 250 labels. Example: `[\"team-docs\", \"public\"]`",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Field to sort results by. Prefix with `-` for descending order. Example: `\"-name\"` (Z to A by name)",
      optional: true,
      options: [
        "id",
        "-id",
        "key",
        "-key",
        "name",
        "-name",
      ],
    },
    descriptionFormat: {
      type: "string",
      label: "Description Format",
      description: "Content format for the `description` field in the response. Use `plain` for plain text or `view` for rendered HTML. Example: `\"plain\"`",
      optional: true,
      options: [
        "plain",
        "view",
      ],
    },
    includeIcon: {
      type: "boolean",
      label: "Include Icon",
      description: "Whether to include the space icon in the response. Example: `true`",
      optional: true,
      default: false,
    },
    cursor: {
      propDefinition: [
        confluence,
        "cursor",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of spaces to return per request (1–250). Use the cursor from the `Link` response header to retrieve the next page. Example: `25`",
      optional: true,
      default: 25,
      min: 1,
      max: 250,
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const response = await this.confluence.listSpaces({
      $,
      cloudId,
      params: {
        "ids": this.ids?.join(","),
        "keys": this.keys?.join(","),
        "type": this.type,
        "status": this.spaceStatus,
        "labels": this.labels?.join(","),
        "sort": this.sort,
        "description-format": this.descriptionFormat,
        "include-icon": this.includeIcon,
        "cursor": this.cursor,
        "limit": this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.results.length} space${response.results.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
