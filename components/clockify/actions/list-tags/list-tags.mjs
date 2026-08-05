// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-tags",
  name: "List Tags",
  description: "List all tags in a Clockify workspace. [See the documentation](https://docs.clockify.me/#tag/Tag)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "If provided, you'll get a filtered list of tags that contains the provided string in the tag name",
      optional: true,
    },
    page: {
      propDefinition: [
        clockify,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        clockify,
        "pageSize",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.listTags({
      $,
      workspaceId: this.workspaceId,
      params: {
        "name": this.name,
        "page": this.page,
        "page-size": this.pageSize,
      },
    });

    $.export("$summary", `Successfully listed ${response.length} tags in the workspace`);

    return response;
  },
};
