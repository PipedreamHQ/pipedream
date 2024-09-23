import common from "../common/base.mjs";

export default {
  ...common,
  key: "mailblaze-update-subscriber",
  name: "Update Subscriber",
  description: "Updates information for an existing subscriber in your mailing list. [See the documentation](https://www.mailblaze.com/support/api-documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    subscriberUid: {
      propDefinition: [
        common.props.mailblaze,
        "subscriberUid",
        ({ listUid }) => ({
          listUid,
        }),
      ],
      reloadProps: true,
    },
  },
  methods: {
    ...common.methods,
    getAction() {
      return "update";
    },
    getAdditionalProp() {
      return {
        subscriberUid: this.subscriberUid,
      };
    },
    getSummary() {
      return `Successfully updated subscriber with Id: ${this.subscriberUid}`;
    },
  },
};
