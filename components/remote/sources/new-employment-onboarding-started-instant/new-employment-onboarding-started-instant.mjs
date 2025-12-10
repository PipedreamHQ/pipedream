import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "remote-new-employment-onboarding-started-instant",
  name: "New Employment Onboarding Started (Instant)",
  description: "Emit new event when an employment onboarding is started. [See the documentation](https://developer.remote.com/reference/employmentonboardingstarted)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "employment.onboarding.started",
      ];
    },
    generateMeta({
      body,
      ts,
    }) {
      return {
        id: body.employment_id,
        summary: `Onboarding for employment with ID ${body.employment_id} has been started`,
        ts,
      };
    },
  },
  sampleEmit,
};
