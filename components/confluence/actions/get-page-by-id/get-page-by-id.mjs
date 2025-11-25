import confluence from "../../confluence.app.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";
import { BODY_FORMAT_FULL_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "confluence-get-page-by-id",
  name: "Get Page by ID",
  description: "Retrieve a page by its ID. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-id-get)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    confluence,
    pageId: {
      propDefinition: [
        confluence,
        "pageId",
      ],
    },
    bodyFormat: {
      propDefinition: [
        confluence,
        "bodyFormat",
      ],
      options: BODY_FORMAT_FULL_OPTIONS,
    },
    getDraft: {
      type: "boolean",
      label: "Get Draft",
      description: "If true, retrieves the draft version of this page.",
      optional: true,
      default: false,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter the page being retrieved by its status.",
      optional: true,
      options: [
        "current",
        "archived",
        "trashed",
        "deleted",
        "historical",
        "draft",
      ],
    },
    version: {
      type: "integer",
      label: "Version",
      description: "Allows you to retrieve a previously published version. Specify the previous version's number to retrieve its details.",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description:
        "Additional parameters to send in the request. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/#api-pages-id-get) for available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });
    const response = await this.confluence.getPageById({
      $,
      cloudId,
      pageId: this.pageId,
      params: {
        "body-format": this.bodyFormat,
        "get-draft": this.getDraft,
        "status": this.status,
        "version": this.version,
        ...parseObjectEntries(this.additionalOptions),
      },
    });
    $.export("$summary", `Successfully retrieved page with ID: ${this.pageId}`);
    return response;
  },
};
