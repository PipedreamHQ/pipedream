import app from "../../txt_werk.app.mjs";

export default {
  key: "txt_werk-analyze-text",
  name: "Analyze Text",
  description: "Send a text to be analyzed by TXTWerk. [See the documentation](https://services.txtwerk.de/ws/documentation/showRequest)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    services: {
      propDefinition: [
        app,
        "services",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.analyzeText({
      $,
      params: {
        text: this.text,
        title: this.title,
        services: this.services.join(","),
      },
    });

    $.export("$summary", "Text successfully analyzed");

    return response;
  },
};
