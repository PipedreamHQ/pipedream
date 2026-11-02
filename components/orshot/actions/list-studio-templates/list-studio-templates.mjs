import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-list-studio-templates",
  name: "List Studio Templates",
  description: "List the Studio templates in your workspace, with name search, tag filter and pagination. [See the documentation](https://orshot.com/docs/api-reference/studio-templates-list)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
    search: {
      type: "string",
      label: "Search",
      description: "Case-insensitive match on the template name",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Only return templates that have all of these tags",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, starting at 1",
      min: 1,
      optional: true,
      default: 1,
    },
    limit: {
      propDefinition: [
        orshot,
        "limit",
      ],
      description: "Templates per page, from 1 to 40, e.g. `10`",
      max: 40,
      default: 10,
    },
    embedId: {
      type: "string",
      label: "Embed ID",
      description: "Embed instance ID. Use with `Embed User ID` to list one embed user's templates.",
      optional: true,
    },
    embedUserId: {
      type: "string",
      label: "Embed User ID",
      description: "Embed user ID. Use with `Embed ID`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      page: this.page ?? 1,
      limit: this.limit ?? 10,
    };
    if (this.search) params.search = this.search;
    if (this.tags?.length) params.tags = this.tags.join(",");
    if (this.embedId) params.embedId = this.embedId;
    if (this.embedUserId) params.embedUserId = this.embedUserId;

    const response = await this.orshot.listStudioTemplates({
      $,
      params,
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Retrieved ${count} studio template${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
