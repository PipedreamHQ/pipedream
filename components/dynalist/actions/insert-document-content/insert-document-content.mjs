import { ConfigurationError } from "@pipedream/platform";
import dynalist from "../../dynalist.app.mjs";

export default {
  key: "dynalist-insert-document-content",
  name: "Insert Document Content",
  description: "Inserts content to a specific document. If the document has existing content, the new content will be appended. [See the documentation](https://apidocs.dynalist.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dynalist,
    documentId: {
      propDefinition: [
        dynalist,
        "documentId",
      ],
    },
    parentId: {
      propDefinition: [
        dynalist,
        "parentId",
        ({ documentId }) => ({
          documentId,
        }),
      ],
    },
    index: {
      type: "integer",
      label: "Index",
      description: "This field is an integer that's the zero-indexed position you want the file to land in the parent folder, supply -1 to place it at the end, and 0 to place it at the top.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The new item title.",
    },
    note: {
      type: "string",
      label: "Note",
      description: "The new item note.",
      optional: true,
    },
    checked: {
      type: "boolean",
      label: "Checked",
      description: "The new item checked status.",
      optional: true,
    },
    checkbox: {
      type: "boolean",
      label: "Checkbox",
      description: "Whether the new item should be a checklist.",
      optional: true,
    },
    heading: {
      type: "integer",
      label: "Heading",
      description: "What heading level is new item, from level 1 to level 3. Default is 0",
      min: 1,
      max: 3,
      optional: true,
    },
    color: {
      type: "integer",
      label: "Color",
      description: "What color label does the new item have, from color 1 to 6. Default is 0.",
      min: 1,
      max: 6,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dynalist.insertContentToDocument({
      $,
      data: {
        file_id: this.documentId,
        changes: [
          {
            parent_id: this.parentId,
            action: "insert",
            index: this.index,
            content: this.content,
            note: this.note,
            checked: this.checked,
            checkbox: this.checkbox,
            heading: this.heading,
            color: this.color,
          },
        ],
      },
    });

    if (response._code != "Ok") {
      throw new ConfigurationError(response._msg);
    }

    $.export("$summary", `Successfully inserted content to document ${this.documentId}`);
    return response;
  },
};
