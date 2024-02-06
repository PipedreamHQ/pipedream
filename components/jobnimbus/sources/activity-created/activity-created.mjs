import common from "../common/activity-based.mjs";

export default {
  ...common,
  key: "jobnimbus-activity-created",
  name: "New Activity Created Event",
  description: "Emit new events when a new activity created. [See the docs](https://documenter.getpostman.com/view/3919598/S11PpG4x#62c713fe-5d46-4fd6-9953-db49255fd5e0)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
