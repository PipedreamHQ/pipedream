import coinmarketcal from "../../coinmarketcal.app.mjs";
import {
  SHOW_ONLY,
  SORT_BY,
  TRANSLATIONS,
} from "../common/constants.mjs";

export default {
  key: "coinmarketcal-search-events",
  name: "Search Events",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of events based on specified filters. [See the docs here](https://coinmarketcal.com/en/doc/redoc#/paths/~1events/get)",
  type: "action",
  props: {
    coinmarketcal,
    dateRangeStart: {
      type: "string",
      label: "Date Range Start",
      description: "Start date (default value is today) (format like 2017-11-25).",
      optional: true,
    },
    dateRangeEnd: {
      type: "string",
      label: "Date Range End",
      description: "End date (default value is date of furthest event) (format like 2017-11-25).",
      optional: true,
    },
    coins: {
      propDefinition: [
        coinmarketcal,
        "coins",
      ],
      optional: true,
    },
    categories: {
      propDefinition: [
        coinmarketcal,
        "categories",
      ],
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The order in which the results will be listed.",
      options: SORT_BY,
      optional: true,
    },
    showOnly: {
      type: "string",
      label: "Show Only",
      description: "The type of results that will be listed.",
      options: SHOW_ONLY,
      optional: true,
    },
    showViews: {
      type: "boolean",
      label: "Show Views",
      description: "Show the number of views of the event.",
      optional: true,
    },
    translations: {
      type: "string",
      label: "Translations",
      description: "Translated title and description.",
      options: TRANSLATIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      coinmarketcal,
      coins,
      categories,
      ...params
    } = this;

    const response = [];

    const items = coinmarketcal.paginate({
      fn: coinmarketcal.searchEvents,
      params: {
        coins: coins && coins.toString(),
        categories: categories && categories.toString(),
        max: 75,
        ...params,
      },
    });

    for await (const item of items) {
      response.push(item);
    }

    $.export("$summary", `${response.length} events were successfully fetched`);
    return response;
  },
};
