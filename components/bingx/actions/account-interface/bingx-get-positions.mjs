import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetPositions",
  version: "0.0.1",
  key: "bingx-account-get-positions",
  description: "Perpetual Swap Positions [reference](https://bingx-api.github.io/docs/swap/account-api.html#_2-perpetual-swap-positions).",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getPositions(this.symbol);
    $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    return returnValue;
  },
};
