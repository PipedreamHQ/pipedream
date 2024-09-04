import app from "../../chainaware_ai.app.mjs";

export default {
  key: "chainaware_ai-fraud-check",
  name: "Comprehensive Fraud Check",
  description: "Conducts a comprehensive fraud check. [See the documentation](https://learn.chainaware.ai/api/fraud-detection-api).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    network: {
      type: "string",
      label: "Network",
      description: "The network to which the transaction belongs. Eg. `ETH`.",
      default: "ETH",
    },
    walletAddress: {
      type: "string",
      label: "Wallet Address",
      description: "The wallet address associated with the transaction.",
    },
  },
  methods: {
    fraudCheck(args = {}) {
      return this.app.post({
        path: "/fraud/check",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      fraudCheck,
      network,
      walletAddress,
    } = this;

    const response = await fraudCheck({
      $,
      data: {
        network,
        walletAddress,
        onlyFraud: [
          true,
        ],
      },
    });
    $.export("$summary", `Conducted fraud check with message \`${response.message}\`.`);
    return response;
  },
};
