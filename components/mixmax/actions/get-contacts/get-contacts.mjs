import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import FIELDS from "../common/fields.mjs";

export default {
  ...common,
  key: "mixmax-get-contacts",
  name: "Get Contacts",
  description: "Lists all your Mixmax Contacts (ie people you've emailed using Mixmax). Does not currently return contacts shared with you via shared contact groups (a performance limitiation). [See the docs here](https://developer.mixmax.com/reference/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    sort: {
      type: "string",
      label: "Sort Field",
      description: "Sort by this field in order to get a list of results to then return in pages.",
      optional: true,
      options: FIELDS.SORTCONTACT,
    },
    sortAscending: {
      type: "boolean",
      label: "Sort Ascending",
      description: "True to sort ascending (A-Z).",
      optional: true,
    },
    email: {
      propDefinition: [
        common.props.mixmax,
        "email",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        common.props.mixmax,
        "name",
      ],
      optional: true,
    },
    groups: {
      propDefinition: [
        common.props.mixmax,
        "groups",
      ],
      withLabel: true,
      optional: true,
    },
    includeShared: {
      type: "boolean",
      label: "Include Shared",
      description: "True to include contacts shared with you. Can only be used when also using any filters due to current performance limitations.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Fields to expand.",
      options: FIELDS.EXPAND,
      optional: true,
    },
    withAnalytics: {
      type: "boolean",
      label: "With Analytics",
      description: "Include analytics in the response",
      optional: true,
    },
    dates: {
      type: "string",
      label: "Dates",
      description: "A string describing the analytics date range.",
      reloadProps: true,
      options: FIELDS.DATES,
      optional: true,
    },
    limit: {
      propDefinition: [
        common.props.mixmax,
        "limit",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        common.props.mixmax,
        "fields",
      ],
      options: FIELDS.CONTACT,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.dates) {
      props.timezoneOffset = {
        type: "integer",
        label: "Timezone Offset",
        description: "The client's timezone offset, in minutes. Used to determine date ranges.",
        optional: true,
      };

      if (this.dates === "specific") {
        props.since = {
          type: "string",
          label: "Since",
          description: "When dates is `specific`, the lower bound (in ms).",
          optional: true,
        };
        props.until = {
          type: "string",
          label: "Until",
          description: "When dates is `specific`, the upper bound (in ms).",
          optional: true,
        };
      }
    }
    return props;
  },
  methods: {
    async processEvent() {
      const {
        limit,
        sort,
        sortAscending,
        email,
        name,
        groups,
        includeShared,
        expand,
        withAnalytics,
        dates,
        timezoneOffset,
        since,
        until,
        fields,
      } = this;

      const search = [];
      if (email?.length) search.push(`email:${email.toString()}`);
      if (name) search.push(`name:${name}`);
      if (groups?.length) search.push(`group:${groups.map((group) => `"${group.label}"`).toString()}`);

      if (includeShared === true && !search.length) {
        throw new ConfigurationError("Either `email` or `name` or `groups` if using `includeShared=true`");
      }

      const items = this.mixmax.paginate({
        fn: this.mixmax.listContacts,
        maxResults: limit,
        params: {
          sort,
          sortAscending,
          search: search?.toString(),
          includeShared,
          expand: expand?.toString(),
          withAnalytics,
          dates,
          timezoneOffset,
          since,
          until,
          fields: fields?.toString(),
        },
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
    getSummary() {
      return "Contacts Successfully fetched!";
    },
  },
};
