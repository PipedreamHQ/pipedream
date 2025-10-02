import smiirl from "../../smiirl.app.mjs";

export default {
  key: "smiirl-increment-count",
  name: "Increment count",
  description: "Increment count or add a number to the current value. [See the docs here](https://www.npmjs.com/package/@smiirl/smiirl-library-js).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    const response = await this.smiirl.incrementCount(this.number);

    $.export("$summary", "Successfully incremented the counter");

    return response;
  },
};
