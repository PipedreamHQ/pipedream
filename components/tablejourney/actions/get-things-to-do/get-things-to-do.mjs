import tablejourney from "../../tablejourney.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "tablejourney-get-things-to-do",
  name: "Get Things To Do",
  description: "Get an overview of food-related things to do in one city in a single call: bookable food tours and classes (`experiences`), tickets and passes, food festivals in the date window, places to eat, stays and car hire."
    + " Use it for trip planning or a broad \"what can I do in this city\" question; use **Search Places**, **List Festivals**, **List Experiences** or **List Stays** for a narrower or longer list."
    + " Use **List Cities** to find valid `country` and `city` slugs."
    + " Each item carries a `page` on tablejourney.com to cite, and bookable items carry a `book` link that forwards to the booking partner through TableJourney."
    + " [See the documentation](https://tablejourney.com/api/v1/docs#/bookable/things_to_do_rest_api_v1_things_to_do__country___city__get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tablejourney,
    country: {
      propDefinition: [
        tablejourney,
        "country",
      ],
    },
    city: {
      propDefinition: [
        tablejourney,
        "city",
        (c) => ({
          country: c.country,
        }),
      ],
    },
    dateFrom: {
      propDefinition: [
        tablejourney,
        "dateFrom",
      ],
      description: "First day of the trip, as an ISO 8601 date, e.g. `2026-11-01`. Festivals running in the window are included. Defaults to today.",
    },
    dateTo: {
      propDefinition: [
        tablejourney,
        "dateTo",
      ],
      description: "Last day of the trip, as an ISO 8601 date, e.g. `2026-11-05`.",
    },
  },
  async run({ $ }) {
    const response = await this.tablejourney.getThingsToDo({
      $,
      country: this.country,
      city: this.city,
      params: {
        from: this.dateFrom,
        to: this.dateTo,
      },
    });
    const parts = [
      utils.pluralize(utils.countOf(response.experiences), "experience"),
      utils.pluralize(utils.countOf(response.festivals), "festival"),
      utils.pluralize(utils.countOf(response.places_to_eat), "place to eat", "places to eat"),
      utils.pluralize(utils.countOf(response.stays), "stay option"),
    ];
    $.export("$summary", `Found ${parts.join(", ")} in ${response.city ?? this.city}`);
    return response;
  },
};
