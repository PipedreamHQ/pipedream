import nuclino from "../../nuclino.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "nuclino-update-item-or-collection",
  name: "Update Item or Collection",
  description: "Update an existing item or collection in Nuclino. [See the documentation](https://help.nuclino.com/fa38d15f-items-and-collections)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nuclino,
    workspaceId: {
      propDefinition: [
        nuclino,
        "workspaceId",
      ],
      description: "The ID of the workspace containing the item to update",
    },
    object: {
      propDefinition: [
        nuclino,
        "object",
      ],
    },
    itemId: {
      propDefinition: [
        nuclino,
        "itemId",
        (c) => ({
          workspaceId: c.workspaceId,
          object: c.object,
        }),
      ],
      label: "Object ID",
      description: "The ID of the object to update",
    },
    title: {
      propDefinition: [
        nuclino,
        "title",
      ],
    },
    content: {
      propDefinition: [
        nuclino,
        "content",
      ],
    },
  },
  async run({ $ }) {
    if (!this.title && !this.content) {
      throw new ConfigurationError("At least one of `title` or `content` must be provided");
    }
    const response = await this.nuclino.updateItem({
      $,
      itemId: this.itemId,
      data: {
        title: this.title,
        content: this.content,
      },
    });
    $.export("$summary", `Successfully updated object with ID ${response.data.id}`);
    return response;
  },
};
