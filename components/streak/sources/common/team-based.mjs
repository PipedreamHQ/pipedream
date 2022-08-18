import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.streak,
        "teamId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const { key } = await this.streak.createWebhook({
        params: {
          teamKey: this.teamId,
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
