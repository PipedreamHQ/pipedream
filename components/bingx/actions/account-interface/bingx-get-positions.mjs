import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Account GetPositions",
  version: "0.0.3",
  key: "bingx-account-get-positions",
  description: "Get Account Positions of BingX [here](https://bingx-api.github.io/docs/swap/account-api.html#_2-perpetual-swap-positions).",
  props: {
    bingx,
    symbol: {
      label: "Symbol",
      description: "Symbol/Ticker for which perpetual swap positions need to be fetched.",
      type: "string",
      optional: true,
      default: "",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let positions = await this.bingx.getPositions(this.symbol);
    console.log(positions);
    $.export("$summary", `Positions retrieved for symbol \`${this.symbol}\``);
    return positions;
  },
};
