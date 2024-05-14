import platerecognizer from "../../platerecognizer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "platerecognizer-run-recognition",
  name: "Run Recognition",
  description: "Triggers a recognition process using the Plate Recognizer SDK.",
  version: "0.0.1",
  type: "action",
  props: {
    platerecognizer,
    imageFileOrUrl: platerecognizer.propDefinitions.imageFileOrUrl,
    regions: platerecognizer.propDefinitions.regions,
    cameraId: platerecognizer.propDefinitions.cameraId,
    mmc: platerecognizer.propDefinitions.mmc,
    config: platerecognizer.propDefinitions.config,
  },
  async run({ $ }) {
    const formData = new FormData();
    if (this.imageFileOrUrl.startsWith("http")) {
      formData.append("upload", this.imageFileOrUrl);
    } else {
      const fs = require("fs");
      formData.append("upload", fs.createReadStream(this.imageFileOrUrl));
    }
    if (this.regions) formData.append("regions", this.regions.join(","));
    if (this.cameraId) formData.append("camera_id", this.cameraId);
    if (this.mmc !== undefined) formData.append("mmc", this.mmc);
    if (this.config) formData.append("config", this.config);

    const response = await axios(this, {
      method: "POST",
      url: `${this.platerecognizer._baseUrl()}/plate-reader/`,
      headers: {
        "Authorization": `Token ${this.platerecognizer.$auth.api_key}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    $.export("$summary", "Recognition process triggered successfully");
    return response;
  },
};
