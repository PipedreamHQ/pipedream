import { QUERY_TYPE_OPTIONS } from "../../common/constants.mjs";
import app from "../../people_data_labs.app.mjs";

export default {
  key: "people_data_labs-search-people",
  name: "Search People",
  description: "Find specific segments of people that you need to power your projects and products. [See the docs here](https://docs.peopledatalabs.com/docs/reference-person-search-api)",
  version: "0.0.1",
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
      type: "string",
      description: "The batch size or the maximum number of matched records to return for this query if they exist",
      default: 1,
      min: 1,
      max: 100,
      optional: true,
    },
    datasets: {
      label: "Datasets",
      type: "string[]",
      description: "Specifies which [dataset(s)](https://docs.peopledatalabs.com/docs/datasets the API should search against.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      [this.queryType]: this.query,
      size: this.size,
      datasets: this.datasets,
    };

    const res = await this.app.searchPeople(params);
    $.export(`Found ${res.data.length} records`);
    return res;
  },
};
