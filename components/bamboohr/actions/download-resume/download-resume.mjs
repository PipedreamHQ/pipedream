import bamboohr from "../../bamboohr.app.mjs";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-download-resume",
  name: "Download Resume",
  description: "Download a resume from an application. [See the documentation](https://documentation.bamboohr.com/reference/get-company-file)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bamboohr,
    applicationId: {
      propDefinition: [
        bamboohr,
        "applicationId",
      ],
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The filename to save the downloaded file as in the `/tmp` directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const { resumeFileId } = await this.bamboohr.getApplication({
      $,
      applicationId: this.applicationId,
    });

    if (!resumeFileId) {
      throw new ConfigurationError("No resume file ID found for application");
    }

    const response = await this.bamboohr.downloadFile({
      $,
      fileId: resumeFileId,
    });

    const rawcontent = response.toString("base64");
    const buffer = Buffer.from(rawcontent, "base64");
    const downloadedFilepath = `/tmp/${this.filename}`;
    fs.writeFileSync(downloadedFilepath, buffer);

    $.export("$summary", `Downloaded resume for application ${this.applicationId}`);

    return {
      filename: this.filename,
      downloadedFilepath,
    };
  },
};
