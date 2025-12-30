import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-incidents",
  name: "Get Incidents",
  description: "Returns a list of incidents. [See the documentation](https://developers.topdesk.com/explorer/?page=incident#/incident/getIncidents)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of incidents to return. Leave empty to return all incidents.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The sort order of the returned incidents (e.g., `callDate:asc,creationDate:desc`)",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "A FIQL string to select which incidents should be returned. [See the documentation](https://developers.topdesk.com/tutorial.html#query)",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "A comma-separated list of which fields should be returned. By default all fields will be returned.",
      optional: true,
    },
    all: {
      type: "boolean",
      label: "All",
      description: "When set to true, will return all incidents including partials and archived. Otherwise only firstLine and secondLine incidents are returned.",
      optional: true,
      default: false,
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      maxResults,
      sort,
      query,
      fields,
      all,
    } = this;

    const incidents = [];
    const paginator = app.paginate({
      fn: app.listIncidents,
      fnArgs: {
        $,
        params: {
          sort,
          query,
          fields: Array.isArray(fields) && fields?.length
            ? fields.join(",")
            : typeof fields === "string" && fields.length
              ? fields
              : undefined,
          all,
          page_size: 100,
        },
      },
      maxResults,
    });

    for await (const incident of paginator) {
      incidents.push(incident);
    }

    $.export("$summary", `Successfully retrieved \`${incidents.length}\` incident(s)`);

    return incidents;
  },
};
