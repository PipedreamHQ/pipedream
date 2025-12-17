import {
  LANGUAGE_CODE_OPTIONS,
  PRICE_LEVEL_OPTIONS,
  RANK_PREFERENCE_OPTIONS,
} from "../../common/constants.mjs";
import {
  parseObject, simplifyPlace,
} from "../../common/utils.mjs";
import app from "../../google_maps_platform.app.mjs";

export default {
  key: "google_maps_platform-search-places",
  name: "Search Places",
  description: "Searches for places based on location, radius, and optional filters like keywords, place type, or name. [See the documentation](https://developers.google.com/maps/documentation/places/web-service/text-search)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    textQuery: {
      type: "string",
      label: "Text Query",
      description: "The text string on which to search, for example: \"restaurant\", \"123 Main Street\", or \"best place to visit in San Francisco\". The API returns candidate matches based on this string and orders the results based on their perceived relevance.",
    },
    includedType: {
      type: "string",
      label: "Included Type",
      description: "Restricts the results to places matching the specified type defined by [Table A](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a). Only one type may be specified.",
      optional: true,
    },
    includePureServiceAreaBusinesses: {
      type: "boolean",
      label: "Include Pure Service Area Businesses",
      description: "If set to `true`, the response includes businesses that visit or deliver to customers directly, but don't have a physical business location. If set to `false`, the API returns only businesses with a physical business location.",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language in which to return results.",
      options: LANGUAGE_CODE_OPTIONS,
      optional: true,
    },
    locationBias: {
      type: "object",
      label: "Location Bias",
      description: "Specifies an area to search. This location serves as a bias which means results around the specified location can be returned, including results outside the specified area. [See the documentation](https://developers.google.com/maps/documentation/places/web-service/text-search#location-bias) for further information.",
      optional: true,
    },
    locationRestriction: {
      type: "string",
      label: "Location Restriction",
      description: "Specifies an area to search. Results outside the specified area are not returned.",
      optional: true,
    },
    evOptions: {
      type: "object",
      label: "EV Options",
      description: "Specifies parameters for identifying available electric vehicle (EV) charging connectors and charging rates. [See the documentation](https://developers.google.com/maps/documentation/places/web-service/text-search#evoptions) for further information.",
      optional: true,
    },
    minRating: {
      type: "string",
      label: "Min Rating",
      description: "Restricts results to only those whose average user rating is greater than or equal to this limit. Values must be between 0.0 and 5.0 (inclusive) in increments of 0.5. For example: 0, 0.5, 1.0, ... , 5.0 inclusive. Values are rounded up to the nearest 0.5. For example, a value of 0.6 eliminates all results with a rating less than 1.0.",
      optional: true,
    },
    openNow: {
      type: "boolean",
      label: "Open Now",
      description: "If `true`, return only those places that are open for business at the time the query is sent. If `false`, return all businesses regardless of open status. Places that don't specify opening hours in the Google Places database are returned if you set this parameter to `false`.",
      optional: true,
    },
    priceLevels: {
      type: "string[]",
      label: "Price Levels",
      description: "Restrict the search to places that are marked at certain price levels. The default is to select all price levels.",
      options: PRICE_LEVEL_OPTIONS,
      optional: true,
    },
    rankPreference: {
      type: "string",
      label: "Rank Preference",
      description: "Specifies how the results are ranked in the response based on the type of query: For a categorical query such as \"Restaurants in New York City\", RELEVANCE (rank results by search relevance) is the default. You can set Rank Preference to RELEVANCE or DISTANCE (rank results by distance). For a non-categorical query such as \"Mountain View, CA\", it is recommended that you leave Rank Preference unset.",
      options: RANK_PREFERENCE_OPTIONS,
      optional: true,
    },
    regionCode: {
      type: "string",
      label: "Region Code",
      description: "The region code used to format the response, specified as a [two-character CLDR code](https://www.unicode.org/cldr/charts/46/supplemental/territory_language_information.html) value. This parameter can also have a bias effect on the search results.",
      optional: true,
    },
    strictTypeFiltering: {
      type: "boolean",
      label: "Strict Type Filtering",
      description: "Used with the `Included Type` parameter. When set to `true`, only places that match the specified types specified by includeType are returned. When `false`, the default, the response can contain places that don't match the specified types.",
      optional: true,
    },
    simplified: {
      propDefinition: [
        app,
        "simplified",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchPlaces({
      $,
      data: {
        textQuery: this.textQuery,
        includedType: this.includedType,
        includePureServiceAreaBusinesses: this.includePureServiceAreaBusinesses,
        languageCode: this.languageCode,
        locationBias: parseObject(this.locationBias),
        locationRestriction: this.locationRestriction,
        evOptions: parseObject(this.evOptions),
        minRating: this.minRating,
        openNow: this.openNow,
        priceLevels: parseObject(this.priceLevels),
        rankPreference: this.rankPreference,
        regionCode: this.regionCode,
        strictTypeFiltering: this.strictTypeFiltering,
      },
    });

    if (this.simplified && response.places) {
      response.places = response.places.map((place) => simplifyPlace(place));
    }

    const placeCount = response.places?.length || 0;
    $.export("$summary", `Found ${placeCount} place(s)`);

    return response;
  },
};
