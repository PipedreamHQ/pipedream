// x-pd-ai: optimized
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-search-directory-people",
  name: "Search Directory People",
  description:
    "Searches for people in the authenticated user's Google Workspace directory. [See the documentation](https://developers.google.com/people/api/rest/v1/people/searchDirectoryPeople)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  type: "action",
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description:
        "The prefix query used to search for people in the Google Workspace directory.",
    },
    fields: {
      propDefinition: [
        common.props.googleContacts,
        "fields",
      ],
    },
  },
  methods: {
    async processResults(client) {
      const params = {
        query: this.query,
        readMask: this.fields.join(),
        sources: [
          "DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE",
        ],
      };

      const people = [];

      do {
        const {
          people: results = [],
          nextPageToken,
        } =
          await this.googleContacts.searchDirectoryPeople(client, params);

        people.push(...results);
        params.pageToken = nextPageToken;
      } while (params.pageToken);

      return people;
    },
    emitSummary($, people) {
      $.export("$summary", `Successfully found ${people.length} people`);
    },
  },
};
