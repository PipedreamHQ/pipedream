import utils from "../../common/utils.mjs";
import app from "../../maestra.app.mjs";

export default {
  key: "maestra-translate-file",
  name: "Translate File",
  description: "Translates an existing file in the Maestra system. [See the documentation](https://maestra.ai/docs#translate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fileId: {
      propDefinition: [
        app,
        "fileId",
      ],
    },
    operationType: {
      optional: true,
      propDefinition: [
        app,
        "operationType",
      ],
    },
    targetLanguages: {
      propDefinition: [
        app,
        "targetLanguages",
      ],
    },
  },
  methods: {
    translate(args = {}) {
      return this.app.post({
        path: "/translate",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      translate,
      targetLanguages,
      ...data
    } = this;

    const response = await translate({
      $,
      data: {
        ...data,
        targetLanguages: utils.arrayToObj(targetLanguages),
      },
    });

    $.export("$summary", `Successfully translated file with message \`${response.message}\``);

    return response;
  },
};
