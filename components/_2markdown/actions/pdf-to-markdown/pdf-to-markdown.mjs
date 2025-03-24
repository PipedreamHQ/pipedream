import _2markdown from "../../_2markdown.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "_2markdown-pdf-to-markdown",
  name: "PDF to Markdown",
  description: "Convert a PDF document to Markdown format. [See the documentation](https://2markdown.com/docs#pdf2md)",
  version: "0.0.1",
  type: "action",
  props: {
    _2markdown,
    filePath: {
      propDefinition: [
        _2markdown,
        "filePath",
      ],
      description: "The path to a PDF file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the job is complete",
      optional: true,
    },
  },
  async run({ $ }) {
    const form = new FormData();

    form.append("document", fs.createReadStream(this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`));

    let response = await this._2markdown.pdfToMarkdown({
      $,
      headers: form.getHeaders(),
      data: form,
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const jobId = response.jobId;
      while (response.status === "processing" || response.status === "pending") {
        response = await this._2markdown.getJobStatus({
          $,
          jobId,
        });
        await timer(3000);
      }
    }

    $.export("$summary", `${this.waitForCompletion
      ? "Finished"
      : "Started"} converting PDF file to markdown.`);

    return response;
  },
};
