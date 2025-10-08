import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-get-return",
  name: "Get Return",
  description: "Retrieve a return by ID. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/returns/operations/get-a-return)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
    },
    returnId: {
      propDefinition: [
        app,
        "returnId",
        ({
          fromDate, toDate,
        }) => ({
          fromDate,
          toDate,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      returnId,
    } = this;

    const response = await app.getReturn({
      $,
      returnId,
    });

    $.export("$summary", "Successfully retrieved return");

    return response;
  },
};

