import _2markdown from "../../_2markdown.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "_2markdown-html-file-to-markdown",
  name: "HTML File to Markdown",
  description: "Convert an HTML file to Markdown format. [See the documentation](https://2markdown.com/docs#file2md)",
  version: "0.0.1",
  type: "action",
  props: {
    _2markdown,
    filePath: {
      propDefinition: [
        _2markdown,
        "filePath",
      ],
    },
  },
  async run({ $ }) {
    const form = new FormData();

    form.append("document", fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`));

    const response = await this._2markdown.htmlFileToMarkdown({
      $,
      headers: form.getHeaders(),
      data: form,
    });

    $.export("$summary", "Successfully converted HTML file to markdown.");

    return response;
  },
};
