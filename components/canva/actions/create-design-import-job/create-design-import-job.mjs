// x-pd-ai: optimized
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40; // ~2 minutes at 3s intervals

export default {
  key: "canva-create-design-import-job",
  name: "Create Design Import Job",
  description: "Starts a new job to import an external file as a new design in Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/design-imports/create-design-import-job/)",
  version: "0.1.4",
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
      const importId = response.job?.id;
      let attempts = 0;
      while (response.job?.status === constants.JOB_STATUS.IN_PROGRESS) {
        if (attempts >= MAX_POLL_ATTEMPTS) {
          throw new Error(`Import job "${importId}" did not complete after ~${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s.`);
        }
        attempts += 1;
        await timer(POLL_INTERVAL_MS);
        response = await this.canva.getDesignImportJob({
          $,
          importId,
        });
        if (response.job?.status === constants.JOB_STATUS.FAILED) {
          throw new Error(response.job?.error?.message ?? "Design import job failed");
        }
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "imported"
      : "started import job for"} design "${this.title}"`);
    return response;
  },
};
