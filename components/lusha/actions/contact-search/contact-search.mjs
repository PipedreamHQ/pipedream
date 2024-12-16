import lusha from "../../lusha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lusha-contact-search",
  name: "Search Contacts",
  description: "Search for contacts using various filters. [See the documentation](https://www.lusha.com/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha,
    searchContactNames: {
      propDefinition: [
        lusha,
        "searchContactNames",
      ],
    },
    searchContactJobTitles: {
      propDefinition: [
        lusha,
        "searchContactJobTitles",
      ],
    },
    searchContactJobTitlesExactMatch: {
      propDefinition: [
        lusha,
        "searchContactJobTitlesExactMatch",
      ],
    },
    searchContactCountries: {
      propDefinition: [
        lusha,
        "searchContactCountries",
      ],
    },
    searchContactSeniority: {
      propDefinition: [
        lusha,
        "searchContactSeniority",
      ],
    },
    searchContactDepartments: {
      propDefinition: [
        lusha,
        "searchContactDepartments",
      ],
    },
    searchContactExistingDataPoints: {
      propDefinition: [
        lusha,
        "searchContactExistingDataPoints",
      ],
    },
    searchContactLocation: {
      propDefinition: [
        lusha,
        "searchContactLocation",
      ],
    },
  },
  async run({ $ }) {
    const args = {};

    if (this.searchContactNames && this.searchContactNames.length > 0) {
      args.searchContactNames = this.searchContactNames;
    }

    if (this.searchContactJobTitles && this.searchContactJobTitles.length > 0) {
      args.searchContactJobTitles = this.searchContactJobTitles;
    }

    if (
      this.searchContactJobTitlesExactMatch &&
      this.searchContactJobTitlesExactMatch.length > 0
    ) {
      args.searchContactJobTitlesExactMatch = this.searchContactJobTitlesExactMatch;
    }

    if (this.searchContactCountries && this.searchContactCountries.length > 0) {
      args.searchContactCountries = this.searchContactCountries;
    }

    if (this.searchContactSeniority && this.searchContactSeniority.length > 0) {
      args.searchContactSeniority = this.searchContactSeniority;
    }

    if (this.searchContactDepartments && this.searchContactDepartments.length > 0) {
      args.searchContactDepartments = this.searchContactDepartments;
    }

    if (
      this.searchContactExistingDataPoints &&
      this.searchContactExistingDataPoints.length > 0
    ) {
      args.searchContactExistingDataPoints = this.searchContactExistingDataPoints;
    }

    if (this.searchContactLocation && this.searchContactLocation.length > 0) {
      args.searchContactLocation = this.searchContactLocation;
    }

    const response = await this.lusha.searchContacts(args);

    $.export("$summary", `Found ${response.totalResults} contacts`);
    return response;
  },
};
