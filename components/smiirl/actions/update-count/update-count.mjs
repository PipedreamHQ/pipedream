import smiirl from "../../smiirl.app.mjs";

export default {
  key: "smiirl-update-count",
  name: "Update count",
  description: "Update count or push a number. [See the docs here](https://www.npmjs.com/package/@smiirl/smiirl-library-js).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smiirl,
    number: {
      propDefinition: [
        smiirl,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smiirl.updateCount(this.number);

    $.export("$summary", "Successfully updated the counter");

    return response;
  },
};
