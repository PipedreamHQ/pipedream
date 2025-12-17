import wachete from "../../wachete.app.mjs";

export default {
  key: "wachete-create-monitor",
  name: "Create Monitor",
  description: "Creates a new monitor for a specific website or web page. [See the documentation(https://api.wachete.com/swagger/ui/index/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wachete,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new Wachet",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to watch",
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "Type of monitoring job. \"SinglePage\" watches a single URL, while \"Portal\" can be used for crawling",
      options: [
        "SinglePage",
        "Portal",
      ],
      reloadProps: true,
    },
    notificationEndpoint: {
      type: "string",
      label: "Notification Endpoint",
      description: "URL to receive webhook notifications",
      optional: true,
    },
    notificationEmail: {
      type: "string",
      label: "Notification Email",
      description: "Email address to receive notifications at",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.jobType === "Portal") {
      props.crawlingDepth = {
        type: "integer",
        label: "Crawling Depth",
        description: "How deep to crawl. Must be between 1 - 3",
        default: 2,
      };
    }
    return props;
  },
  async run({ $ }) {
    const notificationEndpoints = [];
    if (this.notificationEndpoint) {
      notificationEndpoints.push({
        type: "Webhook",
        value: this.notificationEndpoint,
      });
    }
    if (this.notificationEmail) {
      notificationEndpoints.push({
        type: "Email",
        value: this.notificationEmail,
      });
    }
    const response = await this.wachete.createOrUpdateMonitor({
      $,
      data: {
        name: this.name,
        url: this.url,
        notificationEndpoints,
        jobType: this.jobType,
        crawlingDepth: this.crawlingDepth,
        alerts: [
          {
            type: "Error",
          },
          {
            type: "NotEq",
          },
        ],
      },
    });

    $.export("$summary", `Successfully created Wachet with ID ${response.id}`);
    return response;
  },
};
