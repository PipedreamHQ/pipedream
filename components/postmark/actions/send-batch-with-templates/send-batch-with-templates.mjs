import postmark from "../../postmark.app.mjs";
import common from "../common/common.mjs";
import props from "../common/props.mjs";
import templateProps from "../common/templateProps.mjs";

export default {
  ...common,
  key: "postmark-send-batch-with-templates",
  name: "Send Batch With Templates",
  description: "Send a batch of emails using a template [See the documentation](https://postmarkapp.com/developer/api/templates-api#send-batch-with-templates)",
  version: "0.0.1",
  type: "action",
  props: {
    postmark,
    amountOfEmails: {
      type: "integer",
      label: "Amount of emails",
      description: "The amount of emails to send in the batch.",
      min: 1,
      max: 20,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const allProps = {
      ...templateProps,
      ...props,
    };
    const amount = this.amountOfEmails ?? 0;
    const arr = [];
    for (let i = 1; i <= amount; i++) {
      arr.push(i);
    }
    return Object.fromEntries(arr.flatMap((i) => Object.entries(allProps).map(([
      key,
      value,
    ]) => [
      `${i}_${key}`,
      {
        ...value,
        label: `Email #${i} - ${value.label}`,
      },
    ])));
  },
  async run({ $ }) {
    const {
      postmark, amountOfEmails, ...data
    } = this;
    console.log(postmark, amountOfEmails, $);
    return data;
  },
};
