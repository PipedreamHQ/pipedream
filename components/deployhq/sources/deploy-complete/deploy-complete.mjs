import common, { STATUS_COMPLETE } from "../common.mjs";

export default {
  ...common,
  key: "deployhq-deploy-complete",
  name: "Deploy Complete",
  version: "0.0.1",
  description: "Emit new events when deploys complete",
  type: "source",
  props: {
    http: "$.interface.http",
  },
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
