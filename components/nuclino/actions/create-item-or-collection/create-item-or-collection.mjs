import nuclino from "../../nuclino.app.mjs";

export default {
  key: "nuclino-create-item-or-collection",
  name: "Create Item or Collection",
  description: "Create a new item or collection in Nuclino. [See the documentation](https://help.nuclino.com/fa38d15f-items-and-collections)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "The ID of the workspace to create the item in",
    },
    parentId: {
      propDefinition: [
        nuclino,
        "itemId",
        (c) => ({
          workspaceId: c.workspaceId,
          object: "collection",
        }),
      ],
      label: "Parent ID",
      description: "The ID of the collection to create the item in",
      optional: true,
    },
    object: {
      propDefinition: [
        nuclino,
        "object",
      ],
      optional: true,
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
    index: {
      type: "integer",
      label: "Index",
      description: "The zero-based index at which to insert the item/collection in the parent. Defaults to the end of the parent.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nuclino.createItem({
      $,
      data: {
        workspaceId: this.parentId
          ? undefined
          : this.workspaceId,
        parentId: this.parentId,
        object: this.object,
        title: this.title,
        content: this.content,
        index: this.index,
      },
    });
    $.export("$summary", `Successfully created ${this.object || "item"} with ID ${response.data.id}`);
    return response;
  },
};
