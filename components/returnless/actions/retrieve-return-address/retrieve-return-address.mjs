import app from "../../returnless.app.mjs";

export default {
  key: "returnless-retrieve-return-address",
  name: "Retrieve Return Address",
  description: "Retrieve a return address. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/b702161eed54f-retrieve-a-return-address)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    returnAddressId: {
      propDefinition: [
        app,
        "returnAddressId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.app.getReturnAddress({
      $,
      returnAddressId: this.returnAddressId,
    });

    $.export("$summary", `Successfully retrieved return address ${this.returnAddressId}`);
    return data;
  },
};
