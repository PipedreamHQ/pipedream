import coinbase from "./coinbase.app.mjs";

export default {
  props: {
    coinbase,
    accountId: {
      propDefinition: [
        coinbase,
        "accountId",
      ],
    },
  },
};
