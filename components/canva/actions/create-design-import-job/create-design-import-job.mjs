import canva from "../../canva.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "canva-create-design-import-job",
  name: "Create Design Import Job",
  description: "Starts a new job to import an external file as a new design in Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/design-imports/create-design-import-job/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    canva,
    title: {
      propDefinition: [
        canva,
        "title",
      ],
    },
    filePath: {
      propDefinition: [
        canva,
        "filePath",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        canva,
        "waitForCompletion",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const titleBase64 = Buffer.from(this.title).toString("base64");
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);

    let response = await this.canva.importDesign({
      $,
      headers: {
        "Import-Metadata": JSON.stringify({
          "title_base64": titleBase64,
        }),
        "Content-Length": metadata.size,
        "Content-Type": "application/octet-stream",
      },
      data: stream,
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const importId = response.job_id;
      while (!response?.status || response.status?.state === "importing") {
        response = await this.canva.getDesignImportJob({
          $,
          importId,
        });
        if (response.status.error) {
          throw new Error(response.status.error.message);
        }
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "imported"
      : "started import job for"} design "${this.title}"`);
    return response;
  },
};
