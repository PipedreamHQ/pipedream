import picdefense from "../../picdefense.app.mjs";

export default {
  key: "picdefense-check-landmark",
  name: "Check Landmark",
  description: "Returns whether the image contains a landmark and any detected landmark names. [See the documentation](https://app.picdefense.io/apidocs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    picdefense,
    url: {
      propDefinition: [
        picdefense,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.picdefense.checkLandmark({
      $,
      data: {
        url: this.url,
      },
    });

    if (response.data.landmark) {
      $.export("$summary", "Image contains a landmark");
    } else {
      $.export("$summary", "Image does not contain a landmark");
    }

    return response;
  },
};
