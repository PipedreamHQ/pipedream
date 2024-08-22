import canva from "../../canva.app.mjs";
import fs from "fs";

export default {
  key: "canva-upload-asset",
  name: "Upload Asset",
  description: "Uploads an asset to Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/assets/create-asset-upload-job/)",
  version: "0.0.5",
  type: "action",
  props: {
    canva,
    name: {
      type: "string",
      label: "Asset Name",
      description: "The asset's name",
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
  },
  async run({ $ }) {
    const nameBase64 = Buffer.from(this.name).toString("base64");
    const filePath = this.filePath.includes("tmp/")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    let response = await this.canva.uploadAsset({
      $,
      headers: {
        "Asset-Upload-Metadata": JSON.stringify({
          "name_base64": nameBase64,
        }),
        "Content-Length": fs.statSync(filePath).size,
        "Content-Type": "application/octet-stream",
      },
      data: fs.createReadStream(filePath),
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      const jobId = response.job.id;
      while (response.job.status === "in_progress") {
        response = await this.canva.getUploadJob({
          $,
          jobId,
        });
        if (response.job.error) {
          throw new Error(response.job.error.message);
        }
        await timer(3000);
      }
    }

    $.export("$summary", `Successfully ${this.waitForCompletion
      ? "uploaded"
      : "started upload job for"} asset "${this.name}"`);
    return response;
  },
};
