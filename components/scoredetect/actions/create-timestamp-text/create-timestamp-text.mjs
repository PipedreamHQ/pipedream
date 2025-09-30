import scoreDetect from "../../scoredetect.app.mjs";

export default {
  key: "scoredetect-create-timestamp-text",
  name: "Create Timestamped Blockchain Certificate",
  description: "Creates a timestamped blockchain certificate using the provided text. [See the documentation](https://api.scoredetect.com/docs/routes#create-certificate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.scoreDetect.createCertificate({
      $,
      file: this.text,
    });

    $.export("$summary", "Successfully created certificate");
    return response;
  },
};
