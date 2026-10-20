import app from "../../privatus_analytics.app.mjs";

export default {
  key: "privatus_analytics-send-custom-api-request",
  name: "Send Custom API Request",
  description: "Calls any endpoint of the Privatus Analytics API with the connected account, for what the other actions do not cover. Only paths on privatusanalytics.com are accepted. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    method: {
      type: "string",
      label: "HTTP Method",
      description: "The HTTP method, e.g. `GET`. `DELETE` is not offered. `PATCH` and `PUT` can overwrite existing data.",
      options: [
        "GET",
        "PATCH",
        "POST",
        "PUT",
      ],
      default: "GET",
    },
    path: {
      type: "string",
      label: "Path",
      description: "The path of the endpoint, like `/sites/pa_7Q2K9XH3AB/stats/aggregate.json`. `.json` is added when it is missing.",
    },
    query: {
      type: "object",
      label: "Query Parameters",
      description: "Query parameters as an object, e.g. `{\"period\":\"30d\"}`.",
      optional: true,
    },
    body: {
      type: "object",
      label: "Body",
      description: "The JSON body for `POST`, `PATCH` and `PUT`, e.g. `{\"name\":\"Signed up\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.sendCustomRequest({
      $,
      method: this.method,
      path: this.path,
      query: this.query,
      data: this.body,
    });
    $.export("$summary", "Successfully sent the " + this.method + " request");
    return response;
  },
};
