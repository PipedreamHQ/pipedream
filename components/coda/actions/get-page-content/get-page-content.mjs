import fs from "fs";
import coda from "../../coda.app.mjs";
import { sleep } from "../../common/utils.mjs";

export default {
  key: "coda-get-page-content",
  name: "Get Page Content",
  description: "Fetch the content of a single page by name or ID. [See docs](https://coda.io/developers/apis/v1#tag/Pages/operation/beginPageContentExport)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
    },
    pageId: {
      propDefinition: [
        coda,
        "pageId",
        (c) => ({
          docId: c.docId,
        }),
      ],
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The format of the output",
      options: [
        "html",
        "markdown",
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to save the downloaded content as, under the `/tmp` folder. Make sure to not include the file extension, it will be added automatically.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.coda.getPageContent(
      $,
      this.docId,
      this.pageId,
      {
        outputFormat: this.outputFormat,
      },
    );

    let exportStatus;
    let responseStatus;

    do {
      await sleep(3000);
      try {
        responseStatus = await this.coda.getPageContentExportStatus(
          $,
          this.docId,
          this.pageId,
          response.id,
        );

        exportStatus = responseStatus.status;
      } catch (error) {
        exportStatus = "notFound";
      }
    } while (exportStatus !== "complete");

    const pageFile = await this.coda.downloadPageFile(
      $,
      responseStatus.downloadLink,
    );

    const fileName = `${this.fileName}${this.outputFormat === "html"
      ? ".html"
      : ".md"}`;
    const filePath = `/tmp/${fileName}`;
    const rawcontent = pageFile.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    fs.writeFileSync(filePath, buffer);

    $.export("$summary", `Successfully fetched page with ID ${response.id}.`);

    return {
      message: "Successfully downloaded page content to /tmp.",
      fileName,
      filePath,
    };
  },
};
