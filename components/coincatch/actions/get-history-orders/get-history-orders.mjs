import coincatch from "../../coincatch.app.mjs";

export default {
  key: "coincatch-get-history-orders",
  name: "Get History Orders",
  description: "Gets history orders. [See the documentation](https://coincatch.github.io/github.io/en/mix/#get-history-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coincatch,
    productType: {
      propDefinition: [
        coincatch,
        "productType",
      ],
    },
    symbol: {
      propDefinition: [
        coincatch,
        "symbol",
        ({ productType }) => ({
          productType,
        }),
      ],
    },
    startTime: {
      propDefinition: [
        coincatch,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        coincatch,
        "endTime",
      ],
    },
    pageSize: {
      propDefinition: [
        coincatch,
        "pageSize",
      ],
    },
    lastEndId: {
      type: "string",
      label: "Last End ID",
      description: "last end ID of last query. This is used to paginate the results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.coincatch.getHistoryOrders({
      $,
      params: {
        symbol: this.symbol,
        startTime: new Date(this.startTime).getTime(),
        endTime: new Date(this.endTime).getTime(),
        pageSize: this.pageSize,
        lastEndId: this.lastEndId,
      },
    });
    $.export("$summary", `Successfully retrieved history orders for \`${this.symbol}\``);
    return response;
  },
};
