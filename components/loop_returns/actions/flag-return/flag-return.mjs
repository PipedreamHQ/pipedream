import app from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-flag-return",
  name: "Flag Return",
  description: "Flags a particular return as important inside Loop. Requires return ID as a mandatory prop. [See the documentation](https://docs.loopreturns.com/reference/flagreturn)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    returnId: {
      propDefinition: [
        app,
        "returnId",
      ],
    },
  },
  methods: {
    flagReturn({
      returnId, ...args
    } = {}) {
      return this.app.post({
        path: `/warehouse/return/${returnId}/flag`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      flagReturn,
      returnId,
    } = this;

    const response = await flagReturn({
      $,
      returnId,
    });
    $.export("$summary", `Successfully flagged return with ID \`${returnId}\``);
    return response;
  },
};
