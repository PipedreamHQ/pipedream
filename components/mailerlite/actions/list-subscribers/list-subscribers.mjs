import mailerlite from "../../mailerlite.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mailerlite-list-subscribers",
  name: "List Subscribers",
  description: "Lists all subscribers in a group. [See the docs here](https://developers.mailerlite.com/reference/campaigns-by-type)",
  version: "0.0.1",
  type: "action",
  props: {
    mailerlite,
    group: {
      propDefinition: [
        mailerlite,
        "group",
      ],
      description: "List subscribers in the selected group. Leave blank to list all subscribers.",
      optional: true,
    },
  },
  async run({ $ }) {
    const subscribers = [];
    const params = {
      limit: constants.PAGE_LIMIT,
      offset: 0,
    };
    let resp;

    do {
      resp = await this.mailerlite.listSubscribers(this.group, params);
      subscribers.push(...resp);
      params.offset += params.limit;
    } while (resp?.length === params.limit);

    $.export("$summary", `Retrieved ${subscribers.length} subscriber(s)`);
    return subscribers;
  },
};
