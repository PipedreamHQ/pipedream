import bigcommerce from "../../bigcommerce.app.mjs";
import constants from "../../common/constants.mjs";
import { filterObj } from "../../utils.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Custom Events",
  version: "0.0.3",
  type: "source",
  key: "bigcommerce-custom-events",
  description: "Emit new custom webhook event",
  props: {
    ...common.props,
    channel: {
      propDefinition: [
        bigcommerce,
        "channel",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.channel) {
      props.channelId = {
        type: "string",
        label: "Channel Id",
        description: "Id of the channel",
      };
    }

    props.type = {
      type: "string",
      label: "Webhook type",
      description: "Type of the webhook",
      options: Object.getOwnPropertyNames(
        filterObj(
          constants.WEBHOOK_SCOPES,
          (scope) => !!scope[this.channel
            ? "channel"
            : "default"],
        ),
      ),
      reloadProps: true,
    };

    if (this.type) {
      const scope = constants.WEBHOOK_SCOPES[this.type];
      props.scope = {
        type: "string",
        label: "Scope of the webhook",
        options: this.channel
          ? scope.channel
          : scope.default,
      };
    }

    return props;
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const hookId = await this.bigcommerce.createHook(
        this.http.endpoint,
        this.type,
        this.scope,
        this.channel,
        this.channelId,
      );
      this.setHookId(hookId);
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "Custom event created";
    },
  },
};
