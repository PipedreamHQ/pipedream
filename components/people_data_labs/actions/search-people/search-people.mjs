import { QUERY_TYPE_OPTIONS } from "../../common/constants.mjs";
import app from "../../people_data_labs.app.mjs";

export default {
  key: "people_data_labs-search-people",
  name: "Search People",
  description: "Find specific segments of people that you need to power your projects and products. [See the docs here](https://docs.peopledatalabs.com/docs/reference-person-search-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      label: "Query",
      type: "string",
      description: "The query to perform (can be an [Elasticsearch](https://docs.peopledatalabs.com/docs/input-parameters-person-search-api#query) or [SQL query](https://docs.peopledatalabs.com/docs/input-parameters-person-search-api#sql)). Click the preferred query type for the documentation.",
    },
    queryType: {
      label: "Query Type",
      type: "string",
      description: "Which type of query is being used.",
      options: QUERY_TYPE_OPTIONS,
    },
    size: {
      label: "Size",
      type: "integer",
      description: "The batch size or the maximum number of matched records to return for this query if they exist",
      default: 1,
      min: 1,
      max: 100,
      optional: true,
    },
    datasets: {
      label: "Datasets",
      type: "string[]",
      description: "Specifies which [dataset(s)](https://docs.peopledatalabs.com/docs/datasets) the API should search against.",
      optional: true,
    },
    titlecase: {
      type: "boolean",
      label: "Title Case",
      description: "By default, all text in the response data returns as lowercase. Setting to `true` will titlecase any records returned.",
      optional: true,
    },
    pretty: {
      propDefinition: [
        app,
        "pretty",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, query, queryType, ...data
    } = this;
    const params = {
      [queryType]: query,
      ...data,
    };

    const res = await app.searchPeople({
      $,
      params,
    });
    $.export("$summary", res?.status === 200
      ? `Found ${res?.data?.length} records`
      : "No records found");
    return res;
  },
};
