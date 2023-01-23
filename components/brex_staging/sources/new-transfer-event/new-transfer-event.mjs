import common from "../../../brex/sources/new-transfer-event/common.mjs";
import brexApp from "../../brex_staging.app.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "brex_staging-new-transfer-event",
  name: "New Transfer Event (Instant)",
  description: "Emit new event for new failed or processed events",
  version: "0.0.2",
  props: {
    brexApp,
    ...common.props,
  },
};
