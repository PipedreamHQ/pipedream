import { limit } from "../../common/constants.mjs";
import unbounce from "../../unbounce.app.mjs";

export default {
  key: "unbounce-list-page-leads",
  name: "List Page Leads",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all leads for a given page (including AMP), pop-up, or sticky-bar. [See the documentation](https://developer.unbounce.com/api_reference/#id_pages__page_id__leads)",
  type: "action",
  props: {
    unbounce,
    pageId: {
      propDefinition: [
        unbounce,
        "pageId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Limit",
      description: "Limit number of results. **Default: 1000**. ",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Omit the first offset number of results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      unbounce,
      pageId,
      offset = 0,
      maxResults,
    } = this;

    let responseArray = [];

    const items = unbounce.paginate({
      fn: unbounce.listPageLeads,
      maxResults: maxResults,
      pageId,
      params: {
        offset,
        limit,
      },
    });

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} ${responseArray.length > 1
      ? "were"
      : "was"} successfully fetched!`);
    return responseArray;
  },
};
