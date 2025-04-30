import pexels from "../../pexels.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "pexels-download-photo",
  name: "Download Photo",
  description: "Download a specific photo by providing its photo ID and optionally choosing the desired size. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.1",
  type: "action",
  props: {
    pexels,
    photoId: {
      propDefinition: [
        pexels,
        "photoId",
      ],
    },
    desiredSize: {
      propDefinition: [
        pexels,
        "desiredSize",
      ],
    },
  },
  async run({ $ }) {
    const filePath = await this.pexels.downloadPhoto({
      photoId: this.photoId,
      desiredSize: this.desiredSize,
    });

    $.export("$summary", `Successfully downloaded photo with ID ${this.photoId} to ${filePath}`);
    return {
      filePath,
    };
  },
};
