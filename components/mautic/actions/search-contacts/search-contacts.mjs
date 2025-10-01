import mautic from "../../mautic.app.mjs";
import {
  pick,
  pickBy,
} from "lodash-es";

export default {
  key: "mautic-search-contacts",
  name: "Search Contacts",
  description: "Gets a list of contacts by a search term. [See docs](https://developer.mautic.org/#list-contacts)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mautic,
    search: {
      propDefinition: [
        mautic,
        "search",
      ],
    },
    orderBy: {
      propDefinition: [
        mautic,
        "orderBy",
      ],
    },
    orderByDir: {
      propDefinition: [
        mautic,
        "orderByDir",
      ],
    },
    publishedOnly: {
      propDefinition: [
        mautic,
        "publishedOnly",
      ],
    },
    minimal: {
      propDefinition: [
        mautic,
        "minimal",
      ],
    },
    where: {
      propDefinition: [
        mautic,
        "where",
      ],
    },
    order: {
      propDefinition: [
        mautic,
        "order",
      ],
    },
    maxResults: {
      propDefinition: [
        mautic,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = pickBy(pick(this, [
      "search",
      "orderBy",
      "orderByDir",
      "publishedOnly",
      "minimal",
      "where",
      "order",
    ]));

    const paginator = this.mautic.paginate({
      $,
      fn: this.mautic.listContacts,
      maxResults: this.maxResults,
      params,
    });

    const results = this.mautic.listAll(paginator);
    const suffix = results.length === 1
      ? ""
      : "s";
    $.export("$summary", `Retrieved ${results.length} contact${suffix}`);
    return results;
  },
};
