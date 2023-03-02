import app from "../../memix.app.mjs";
export default {
  name: "Caption to Memix URL",
  description:
    "Generate a Memix share URL with a random template using the supplied caption. [See the docs here](https://api.memix.com/docs)",
  key: "memix-random",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    caption: {
      type: "string",
      label: "Caption",
    },
  },
  async run() {
    var template = await app.getRandomTemplate();
    return app.gifURIForTemplate(template);
  },
};
