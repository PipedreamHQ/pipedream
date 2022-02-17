// legacy_hash_id: a_G1illB
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-list-contact",
  name: "List Companies",
  description: "Gets a list of contacts.",
  version: "0.2.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    start: {
      type: "string",
      description: "Starting row for the entities returned. Defaults to 0.",
      optional: true,
    },
    limit: {
      type: "string",
      description: "Limit number of entities to return. Defaults to the system configuration for pagination (30).",
      optional: true,
    },
    orderBy: {
      type: "string",
      description: "Column to sort by. Can use any column listed in the response. However, all properties in the response that are written in camelCase need to be changed a bit. Before every capital add an underscore _ and then change the capital letters to non-capital letters. So `dateIdentified` becomes `date_identified`, `modifiedByUser` becomes `modified_by_user` etc.",
      optional: true,
    },
    orderByDir: {
      type: "string",
      description: "Sort direction: `asc` or `desc`.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    publishedOnly: {
      type: "boolean",
      description: "Only return currently published entities.",
      optional: true,
    },
    minimal: {
      type: "string",
      description: "Return only array of entities without additional lists in it.",
      optional: true,
    },
    where: {
      type: "any",
      description: "An array of advanced where conditions.",
      optional: true,
    },
    order: {
      type: "any",
      description: "An array of advanced order statements.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#list-contacts

    return await axios($, {
      method: "get",
      url: `${this.mautic.$auth.mautic_url}/api/contacts`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
      params: {
        start: this.start,
        limit: this.limit,
        orderBy: this.orderBy,
        orderByDir: this.orderByDir,
        publishedOnly: this.publishedOnly,
        minimal: this.minimal,
        where: this.where,
        order: this.order,
      },
    });
  },
};
