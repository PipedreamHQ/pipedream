import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-parse-page-content",
  name: "Parse Page Content with OnPage",
  description:
    "Parse the content on any page and return its structured content. [See the documentation](https://docs.dataforseo.com/v3/on_page/content_parsing/live/)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    parsePageContent(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/on_page/content_parsing/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    url: {
      type: "string",
      label: "URL",
      description:
        "The URL of the page to parse, e.g. `https://pipedream.com/`",
    },
    customUserAgent: {
      type: "string",
      label: "Custom User Agent",
      description: "Custom user agent for crawling a website. Default is `Mozilla/5.0 (compatible; RSiteAuditor)`",
      optional: true,
    },
    storeRawHtml: {
      type: "boolean",
      label: "Store Raw HTML",
      description: "Set to `true` if you want to get the HTML of the page using the [https://docs.dataforseo.com/v3/on_page/raw_html/](OnPage Raw HTML endpoint)",
      optional: true,
    },
    enableJavascript: {
      type: "boolean",
      label: "Enable Javascript",
      description: "Set to `true` if you want to load the scripts available on a page",
      optional: true,
    },
    additionalOptions: {
      propDefinition: [
        dataforseo,
        "additionalOptions",
      ],
      description:
        "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/on_page/content_parsing/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.parsePageContent({
      $,
      data: [
        {
          url: this.url,
          custom_user_agent: this.customUserAgent,
          store_raw_html: this.storeRawHtml,
          enable_javascript: this.enableJavascript,
          ...parseObjectEntries(this.additionalOptions),
        },
      ],
    });
    $.export("$summary", "Successfully parsed page content");
    return response;
  },
};
