import app from "../../picdefense.app.mjs";

export default {
  key: "picdefense-check-image-risk",
  name: "Check Image Risk",
  description: "Check the risk of the image on the provided URL. [See the documentation](https://app.picdefense.io/apidocs/)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.checkImageRisk({
      $,
      data: {
        url: this.url,
      },
    });

    $.export("$summary", `Image check: ${response.message}`);

    return response;
  },
};
