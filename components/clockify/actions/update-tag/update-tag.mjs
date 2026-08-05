// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-update-tag",
  name: "Update Tag",
  description: "Updates the name of an existing tag in a Clockify workspace. Use **List Tags** to find the ID of the tag to update. [See the documentation](https://docs.clockify.me/#tag/Tag)",
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
    tagId: {
      propDefinition: [
        clockify,
        "tagId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name of the tag",
    },
  },
  async run({ $ }) {
    const response = await this.clockify.updateTag({
      $,
      workspaceId: this.workspaceId,
      tagId: this.tagId,
      data: {
        name: this.name,
      },
    });

    $.export("$summary", `Successfully updated tag with ID ${this.tagId}`);

    return response;
  },
};
