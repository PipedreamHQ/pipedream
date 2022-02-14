import common from "./common.mjs";
import brexApp from "../../brex.app.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "brex-new-transfer-event",
  name: "New Transfer Event",
  description: "Emit new event for new failed or processed events",
  version: "0.0.10",
  props: {
    brexApp,
    ...common.props,
  },
};
