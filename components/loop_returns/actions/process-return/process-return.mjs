import app from "../../loop_returns.app.mjs";

export default {
  key: "loop_returns-process-return",
  name: "Process Return",
  description: "Starts the processing of a return inside Loop. Return ID is a required prop to initiate the process. [See the documentation](https://docs.loopreturns.com/reference/post_warehouse-return-return-id-process)",
  version: "0.0.1",
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
    processReturn({
      returnId, ...args
    } = {}) {
      return this.post({
        path: `/warehouse/return/${returnId}/process`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      processReturn,
      returnId,
    } = this;

    const response = await processReturn({
      $,
      returnId,
    });

    $.export("$summary", `Successfully processed return with ID ${this.returnId}`);
    return response;
  },
};
