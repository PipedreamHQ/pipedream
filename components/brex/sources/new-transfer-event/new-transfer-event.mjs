import common from "./common.mjs";
import brexApp from "../../brex.app.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "brex-new-transfer-event",
  name: "New Transfer Event (Instant)",
  description: "Emit new event for new failed or processed events",
  version: "0.1.1",
  props: {
    brexApp,
    ...common.props,
  },
};
