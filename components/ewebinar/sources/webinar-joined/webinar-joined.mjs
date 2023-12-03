import common from "../common/base.mjs";

export default {
  ...common,
  key: "ewebinar-webinar-joined",
  name: "New Webinar Joined",
  description: "Emit new event immediately after a registrant joins a webinar session or starts a replay.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(registrant) {
      return `Registrant ${registrant.name} joined webinar`;
    },
    filterArray(array) {
      return array.filter((item) => item.state === "Joined");
    },
  },
};
