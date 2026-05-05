import app from "../../servicem8.app.mjs";
import { normalizeUserApiPath } from "../../common/logic.mjs";

const DOCS = "https://developer.servicem8.com/docs/rest-overview";

export default {
  key: "servicem8-make-api-request",
  name: "Make API Request",
  description: `Send an authenticated ServiceM8 API request. [See the documentation](${DOCS})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    method: {
      type: "string",
      label: "HTTP Method",
      description: "HTTP method",
      options: [
        "GET",
        "POST",
        "DELETE",
      ],
    },
    path: {
      type: "string",
      label: "Path",
      description:
        "Path relative to `https://api.servicem8.com/` (e.g. `api_1.0/company` or `api_1.0/company.json`). For `api_1.0/...` routes, `.json` is appended when omitted so responses use the JSON API. Webhook and platform paths (no `api_1.0/` prefix) are unchanged.",
    },
    query: {
      type: "object",
      label: "Query Parameters",
      description: "Optional query parameters (e.g. `{ \"$filter\": \"active eq 1\" }`)",
      optional: true,
    },
    body: {
      type: "object",
      label: "Body",
      description: "Optional JSON body for POST or DELETE (ignored for GET)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      method, path, query, body,
    } = this;
    const resolvedPath = normalizeUserApiPath(path);
    const includeBody = method !== "GET" && body !== undefined;
    const response = await this.servicem8._makeRequest({
      $,
      path: resolvedPath,
      method,
      ...(query && {
        params: query,
      }),
      ...(includeBody && {
        data: body,
      }),
    });
    $.export("$summary", `Completed ${method} ${resolvedPath}`);
    return response;
  },
};
