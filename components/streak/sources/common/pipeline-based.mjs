import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    pipelineId: {
      propDefinition: [
        common.props.streak,
        "pipelineId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const { key } = await this.streak.createWebhook({
        params: {
          pipelineKey: this.pipelineId,
        },
        data: {
          targetUrl: this.http.endpoint,
          event: this.getEventType(),
        },
      });
      this._setHookId(key);
    },
  },
};
