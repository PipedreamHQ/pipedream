import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-uptime-check",
  name: "Create Uptime Check",
  description: "Starts monitoring a URL, a keyword on a page, a TCP port or a DNS name for a site. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Display name, max 100 characters. Defaults to the target hostname.",
      optional: true,
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "What to check. http requires a response with the expected status from url. keyword also requires keyword in the body. tcp connects to host and port. dns requires host to resolve.",
      options: [
        "http",
        "keyword",
        "tcp",
        "dns",
      ],
      default: "http",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "Full URL including https://, for http and keyword checks. Defaults to the site's home page for site checks. Private addresses are refused.",
      optional: true,
    },
    host: {
      type: "string",
      label: "Host",
      description: "Hostname without scheme, like example.com, for tcp and dns checks. Private addresses are refused.",
      optional: true,
    },
    port: {
      type: "integer",
      label: "Port",
      description: "TCP port from 1 to 65535, required for tcp checks.",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Text the response body must contain, case sensitive, max 200 characters. Required for keyword checks.",
      optional: true,
    },
    expectedStatus: {
      type: "integer",
      label: "Expected Status",
      description: "HTTP status code that counts as up, from 100 to 599. Default 200. For http and keyword checks.",
      default: 200,
      optional: true,
    },
    httpMethod: {
      type: "string",
      label: "HTTP Method",
      description: "HTTP method used to probe: GET (default) or HEAD. For http and keyword checks.",
      options: [
        "GET",
        "HEAD",
      ],
      default: "GET",
      optional: true,
    },
    intervalSeconds: {
      type: "integer",
      label: "Interval Seconds",
      description: "Seconds between probes, from 30 to 86400, and at least your plan minimum (Free 300, Pro 60, Business 30). Default 300 or the plan minimum if higher.",
      optional: true,
    },
    timeoutSeconds: {
      type: "integer",
      label: "Timeout Seconds",
      description: "Seconds before a probe counts as failed, from 1 to 30. Default 20.",
      default: 20,
      optional: true,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Allow this check to be shown on public status pages. Default false.",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/uptime.json`,
      data: utils.compact({
        name: this.name,
        kind: this.kind,
        url: this.url,
        host: this.host,
        port: this.port,
        keyword: this.keyword,
        expected_status: this.expectedStatus,
        http_method: this.httpMethod,
        interval_seconds: this.intervalSeconds,
        timeout_seconds: this.timeoutSeconds,
        public: this.public,
      }),
    });
    $.export("$summary", `Successfully created uptime check '${response.name}'`);
    return response;
  },
};
