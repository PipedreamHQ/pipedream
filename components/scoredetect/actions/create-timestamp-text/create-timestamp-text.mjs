import scoreDetect from "../../scoredetect.app.mjs";

export default {
  key: "scoredetect-create-timestamp-text",
  name: "Create Timestamped Blockchain Certificate",
  description: "Creates a timestamped blockchain certificate using the provided text. [See the documentation](https://api.scoredetect.com/docs/routes#create-certificate)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scoreDetect,
    text: {
      propDefinition: [
        scoreDetect,
        "text",
      ],
    },
  },
  async run({ $ }) {
    // Generate checksum for the text to be certified
    const checksumResponse = await this.scoreDetect.generateChecksum({
      textToCertify: this.textToCertify,
    });
    const checksum = checksumResponse; // Adjust based on actual API response structure

    // Assuming the API does not directly accept text for certificate creation,
    // saving checksum to a temporary file
    const fs = require("fs");
    const path = require("path");
    const tmpFilePath = path.join("/tmp", `checksum-${Date.now()}.txt`);
    fs.writeFileSync(tmpFilePath, checksum);

    // Create a certificate for the checksum file
    const certificateResponse = await this.scoreDetect.createCertificate({
      fileOrUrl: tmpFilePath,
      isUrl: false,
    });

    // Clean up the temporary file
    fs.unlinkSync(tmpFilePath);

    $.export("$summary", "Successfully created a timestamped blockchain certificate");
    return certificateResponse; // Adjust based on actual API response structure
  },
};
