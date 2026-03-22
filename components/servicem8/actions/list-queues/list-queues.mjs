import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-list-queues",
  name: "List Queues",
  description: "List Queue records with optional filtering. [See the documentation](https://developer.servicem8.com/reference/listqueues)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8: app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
    sort: {
      propDefinition: [
        app,
        "sort",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const params = this.servicem8.buildListQueryParams({
      filter: this.filter,
      sort: this.sort,
      cursor: this.cursor,
    });
    const response = await this.servicem8.listResource({
      $,
      resource: "queue",
      params,
    });
    $.export("$summary", "Successfully retrieved Queue records");
    return response;
  },
};
