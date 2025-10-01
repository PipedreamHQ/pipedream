import app from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-cancel-return",
  name: "Cancel Return",
  description: "Cancels a pending return request in Loop. [See the documentation](https://docs.loopreturns.com/reference/cancelreturn)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    cancelReturn({
      returnId, ...args
    } = {}) {
      return this.app.post({
        path: `/warehouse/return/${returnId}/cancel`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      cancelReturn,
      returnId,
    } = this;

    const response = await cancelReturn({
      $,
      returnId,
    });

    $.export("$summary", `Successfully cancelled return with ID \`${returnId}\``);
    return response;
  },
};
