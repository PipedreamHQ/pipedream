import zerotier from "../../zerotier.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    zerotier,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    networkId: {
      propDefinition: [
        zerotier,
        "networkId",
      ],
    },
  },
};
