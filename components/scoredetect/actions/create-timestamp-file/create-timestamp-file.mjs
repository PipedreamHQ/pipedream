import scoreDetect from "../../scoredetect.app.mjs";

export default {
  key: "scoredetect-create-timestamp-file",
  name: "Create Timestamped Blockchain Certificate",
  description: "Creates a timestamped blockchain certificate using a provided file. The file can be a local file path or a URL. If it's a URL, the file will be fetched from it.",
  version: "0.0.1",
  type: "action",
  props: {
    scoreDetect,
    fileOrUrl: scoreDetect.propDefinitions.fileOrUrl,
    textToCertify: scoreDetect.propDefinitions.textToCertify,
  },
  async run({ $ }) {
    // Determine if the provided input is a URL
    const isUrl = this.fileOrUrl.startsWith("http://") || this.fileOrUrl.startsWith("https://");

    // Generate checksum for the provided text
    const checksumResponse = await this.scoreDetect.generateChecksum({
      textToCertify: this.textToCertify,
    });
    const checksum = checksumResponse.data.checksum;

    // Create a certificate using the file or URL
    const certificateResponse = await this.scoreDetect.createCertificate({
      fileOrUrl: this.fileOrUrl,
      isUrl,
    });

    // Extract the certificate ID from the response
    const certificateId = certificateResponse.data.certificateId;

    // Export a summary of the operation
    $.export("$summary", `Successfully created a blockchain certificate with ID ${certificateId} and checksum ${checksum}`);

    return {
      certificateId,
      checksum,
    };
  },
};
