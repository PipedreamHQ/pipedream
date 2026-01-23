import app from "../../picdefense.app.mjs";

export default {
  key: "picdefense-check-credits",
  name: "Check Credits",
  description: "Check how many credits the associated account have. [See the documentation](https://app.picdefense.io/apidocs/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.checkCredits({
      $,
    });

    $.export("$summary", `The associated account have: '${response.data.credits}' credits`);

    return response;
  },
};
