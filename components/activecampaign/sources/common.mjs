import activecampaign from "../activecampaign.app.mjs";

export default {
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
  },
};
