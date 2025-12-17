import app from "../../returnless.app.mjs";

export default {
  key: "returnless-retrieve-return-status",
  name: "Retrieve Return Status",
  description: "Retrieve a return status. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/ba30f75e2c5fd-retrieve-a-return-status)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    returnStatusId: {
      propDefinition: [
        app,
        "returnStatusId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.app.getReturnStatus({
      $,
      returnStatusId: this.returnStatusId,
    });

    $.export("$summary", `Successfully retrieved return status ${this.returnStatusId}`);
    return data;
  },
};
