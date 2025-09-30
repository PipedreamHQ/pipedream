import mautic from "../../mautic.app.mjs";
import {
  pick,
  pickBy,
} from "lodash-es";

export default {
  key: "mautic-search-companies",
  name: "Search Companies",
  description: "Gets a list of companies by a search term. [See docs](https://developer.mautic.org/#list-contact-companies)",
  version: "0.3.1",
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
  },
  async run({ $ }) {
    const params = pickBy(pick(this, [
      "search",
      "orderBy",
      "orderByDir",
    ]));

    const paginator = this.mautic.paginate({
      $,
      fn: this.mautic.listCompanies,
      maxResults: this.maxResults,
      params,
    });

    const results = this.mautic.listAll(paginator);
    const suffix = results.length === 1
      ? "company"
      : "companies";
    $.export("$summary", `Retrieved ${results.length} ${suffix}`);
    return results;
  },
};
