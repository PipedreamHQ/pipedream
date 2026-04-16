import picdefense from "../../picdefense.app.mjs";

export default {
  key: "picdefense-check-logos",
  name: "Check Logos",
  description: "Returns whether the image contains a logo and any detected logo names. [See the documentation](https://app.picdefense.io/apidocs/)",
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
    const response = await this.picdefense.checkLogos({
      $,
      data: {
        url: this.url,
      },
    });

    if (response.data.logo) {
      $.export("$summary", "Image contains a logo");
    } else {
      $.export("$summary", "Image does not contain a logo");
    }

    return response;
  },
};
