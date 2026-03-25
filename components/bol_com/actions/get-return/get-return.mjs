import bolCom from "../../bol_com.app.mjs";

export default {
  key: "bol_com-get-return",
  name: "Get Return",
  description: "Get a return. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Returns/operation/get-return)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    returnId: {
      propDefinition: [
        bolCom,
        "returnId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.getReturn({
      $,
      returnId: this.returnId,
    });
    $.export("$summary", `Successfully retrieved return: ${response.returnId}`);
    return response;
  },
};
