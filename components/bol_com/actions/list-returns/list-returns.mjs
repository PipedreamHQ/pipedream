import bolCom from "../../bol_com.app.mjs";

export default {
  key: "bol_com-list-returns",
  name: "List Returns",
  description: "List returns. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Returns/operation/get-returns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    page: {
      propDefinition: [
        bolCom,
        "page",
      ],
    },
    handled: {
      type: "boolean",
      label: "Handled",
      description: "The status of the returns you wish to see, shows either handled or unhandled returns",
      optional: true,
    },
    fulfilmentMethod: {
      propDefinition: [
        bolCom,
        "fulfilmentMethod",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bolCom.listReturns({
      $,
      params: {
        "page": this.page,
        "handled": this.handled,
        "fulfilment-method": this.fulfilmentMethod,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.returns.length} return${response.returns.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
