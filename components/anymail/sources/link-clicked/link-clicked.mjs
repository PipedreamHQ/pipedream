import common from "../common/base.mjs";

export default {
  ...common,
  key: "anymail-link-clicked",
  name: "Link Clicked (Instant)",
  description: "Emit new event when a prospect clicks a tracked link. [See the docs](https://developers.anymail.watch/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "link_clicked";
    },
    getLabel() {
      return "Link Clicked";
    },
  },
};
