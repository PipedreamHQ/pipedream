import common, { STATUS_RUNNING } from "../common.mjs";

export default {
  ...common,
  key: "deployhq-deploy-started",
  name: "New Deploy Started",
  version: "0.0.2",
  description: "Emit new event when a deploy starts",
  type: "source",
  async run(request) {
    const { payload } = this.validateRequest(request);

    if (payload.status !== STATUS_RUNNING) {
      console.log(`Deploy status [${payload.status}] is not ${STATUS_RUNNING}`);
      return;
    }

    this.$emit({
      payload,
    }, {
      id: payload.identifier,
      summary: `Started ${payload.identifier}`,
      ts: Date.now(),
    });
  },
};
