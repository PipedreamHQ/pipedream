import cody from "../../cody.app.mjs";

export default {
  key: "cody-create-document",
  name: "Create Document",
  description: "Turn text content into a document and add it directly to your knowledge base. [See the documentation]()",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cody,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the document.",
    },
    folderId: {
      propDefinition: [
        cody,
        "folderId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the document. It can be text or html.",
    },
  },
  async run({ $ }) {
    const response = await this.cody.createDocument({
      $,
      data: {
        name: this.name,
        folder_id: this.folderId,
        content: this.content,
      },
    });
    $.export("$summary", `Successfully created document with ID: ${response.data?.id}`);
    return response;
  },
};
