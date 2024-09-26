import common, { STATUS_FAILED } from "../common.mjs";

export default {
  ...common,
  key: "deployhq-deploy-failed",
  name: "New Deploy Failed",
  version: "0.0.2",
  description: "Emit new event when a deploy fails",
  type: "source",
  async run(request) {
    const { payload } = this.validateRequest(request);

    if (payload.status !== STATUS_FAILED) {
      console.log(`Deploy status [${payload.status}] is not ${STATUS_FAILED}`);
      return;
    }

    this.$emit({
      payload,
    }, {
      id: payload.identifier,
      summary: `Failed ${payload.identifier}`,
      ts: Date.now(),
    });
  },
};
