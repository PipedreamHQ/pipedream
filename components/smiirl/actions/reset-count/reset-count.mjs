import smiirl from "../../smiirl.app.mjs";

export default {
  key: "smiirl-reset-count",
  name: "Reset count",
  description: "Reset count to zero. [See the docs here](https://www.npmjs.com/package/@smiirl/smiirl-library-js).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smiirl,
  },
  async run({ $ }) {
    const response = await this.smiirl.resetCount();

    $.export("$summary", "Successfully reset the counter");

    return response;
  },
};
