import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-add-file",
  name: "Add File to Hansei Knowledge Base",
  description: "Uploads a file to the Hansei Knowledge Base. The file type can be text, word, or pdf.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hansei,
    file: {
      type: "any",
      label: "File",
      description: "The file you want to upload to the knowledge base",
    },
    filetype: {
      type: "string",
      label: "File Type",
      description: "The type of the file (text, word, pdf)",
      options: [
        "text",
        "word",
        "pdf",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hansei.uploadFileToKnowledgeBase({
      file: this.file,
      filetype: this.filetype,
    });
    $.export("$summary", `Successfully uploaded ${this.filetype} file to Hansei Knowledge Base`);
    return response;
  },
};
