import constants from "../../common/constants.mjs";
import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-list-subscribers",
  name: "List Subscribers",
  description: "Lists all subscribers in a group. [See the documentation](https://developers.mailerlite.com/docs/subscribers.html#list-all-subscribers)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailerlite,
    group: {
      propDefinition: [
        mailerlite,
        "group",
      ],
      description: "List subscribers in the selected group. Leave blank to list all active subscribers.",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.group) {
      props.type = {
        type: "string",
        label: "Type",
        description: "Subscriber Type",
        options: constants.SUBSCRIBER_TYPE_OPTIONS,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const subscribers = [];
    const params = {
      type: this.type,
      limit: constants.PAGE_LIMIT,
      offset: 0,
    };
    let resp;

    do {
      resp = await this.mailerlite.listSubscribers({
        $,
        group: this.group,
        params,
      });
      subscribers.push(...resp);
      params.offset += params.limit;
    } while (resp?.length === params.limit);

    $.export("$summary", `Retrieved ${subscribers.length} subscriber(s)`);
    return subscribers;
  },
};
