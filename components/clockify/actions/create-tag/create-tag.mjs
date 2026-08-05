// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-tag",
  name: "Create Tag",
  description: "Creates a new tag in a Clockify workspace. Requires the tag name. [See the documentation](https://docs.clockify.me/#tag/Tag)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "Name of the tag",
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createTag({
      $,
      workspaceId: this.workspaceId,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created tag "${response.name}" with ID ${response.id}`);

    return response;
  },
};
