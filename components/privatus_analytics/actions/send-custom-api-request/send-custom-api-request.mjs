import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-send-custom-api-request",
  name: "Send Custom API Request",
  description: "Calls any endpoint of the Privatus Analytics API with the connected account, for what the other actions do not cover. Only paths on privatusanalytics.com are accepted. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    app,
    method: {
      type: "string",
      label: "HTTP Method",
      description: "The HTTP method. Nothing here can delete data, so `DELETE` is not offered.",
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
      description: "Query parameters, such as the name `period` with the value `30d`.",
      optional: true,
    },
    body: {
      type: "object",
      label: "Body",
      description: "The JSON body, for `POST`, `PATCH` and `PUT`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const [
      base,
      existing,
    ] = utils.apiPath(this.path).split("?");
    const extra = this.query
      ? utils.queryString(this.query)
      : "";
    const search = [
      existing,
      extra,
    ].filter(Boolean).join("&");
    const response = await this.app._makeRequest({
      $,
      method: this.method,
      path: search
        ? base + "?" + search
        : base,
      data: this.method === "GET"
        ? undefined
        : this.body,
    });
    $.export("$summary", "Successfully sent the " + this.method + " request");
    return response;
  },
};
