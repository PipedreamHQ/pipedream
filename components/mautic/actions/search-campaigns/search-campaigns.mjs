import mautic from "../../mautic.app.mjs";
import {
  pick,
  pickBy,
} from "lodash-es";

export default {
  key: "mautic-search-campaigns",
  name: "Search Campaigns",
  description: "Gets a list of campaigns by a search term. [See docs](https://developer.mautic.org/#list-campaigns)",
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
    published: {
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
      "published",
      "minimal",
    ]));

    const paginator = this.mautic.paginate({
      $,
      fn: this.mautic.listCampaigns,
      maxResults: this.maxResults,
      params,
    });

    const results = this.mautic.listAll(paginator);
    const suffix = results.length === 1
      ? ""
      : "s";
    $.export("$summary", `Retrieved ${results.length} campaign${suffix}`);
    return results;
  },
};
