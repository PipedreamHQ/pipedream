import zamzar from "../../zamzar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zamzar-create-content-file",
  name: "Create Content File",
  description: "Creates a PDF file from the provided content. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zamzar,
    content: {
      type: "string",
      label: "Content",
      description: "The content to create a PDF file from",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The desired name for the created PDF file",
    },
  },
  async run({ $ }) {
    const response = await this.zamzar.convertToPDF({
      content: this.content,
      fileName: this.fileName,
    });

    $.export("$summary", `Started conversion to PDF for file: ${this.fileName}`);
    return response;
  },
};
