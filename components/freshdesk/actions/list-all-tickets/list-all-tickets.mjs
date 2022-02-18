// legacy_hash_id: a_A6i5zz
import { axios } from "@pipedream/platform";

export default {
  key: "freshdesk-list-all-tickets",
  name: "List All Tickets",
  description: "Use filters to view only specific tickets (those which match the criteria that you choose). By default, only tickets that have not been deleted or marked as spam will be returned, unless you use the 'deleted' filter.",
  version: "0.1.1",
  type: "action",
  props: {
    freshdesk: {
      type: "app",
      app: "freshdesk",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://${this.freshdesk.$auth.domain}.freshdesk.com/api/v2/tickets`,
      auth: {
        username: `${this.freshdesk.$auth.api_key}:X`,
        password: "",
      },
    });
  },
};
