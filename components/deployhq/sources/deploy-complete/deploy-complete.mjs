import common, { STATUS_COMPLETE } from "../common.mjs";

export default {
  ...common,
  key: "deployhq-deploy-complete",
  name: "New Deploy Complete",
  version: "0.0.2",
  description: "Emit new event when a deploy is completed",
  type: "source",
  async run(request) {
    const { payload } = this.validateRequest(request);

    if (payload.status !== STATUS_COMPLETE) {
      console.log(`Deploy status [${payload.status}] is not ${STATUS_COMPLETE}`);
      return;
    }

    this.$emit({
      payload,
    }, {
      id: payload.identifier,
      summary: `Completed ${payload.identifier}`,
      ts: Date.now(),
    });
  },
};
