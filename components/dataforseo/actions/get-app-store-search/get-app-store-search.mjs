import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-app-store-search",
  name: "Get App Store Search",
  description: "Search iOS App Store apps by keywords for app store optimization (ASO) analysis. [See the documentation](https://docs.dataforseo.com/v3/app_data/apple/app_searches/task_post/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
    waitForResults: {
      type: "boolean",
      label: "Wait for Results",
      description: "Wait for the results to be available. Not for use with Pipedream Connect.",
      default: true,
      optional: true,
    },
    postbackUrl: {
      type: "string",
      label: "Postback URL",
      description: "The URL to receive the search results. Only applicable when \"Wait for Results\" = `FALSE`",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };

    if (run.runs === 1) {
      let postbackUrl  = this.postbackUrl;
      if (context && this.waitForResults) {
        ({ resume_url: postbackUrl } = $.flow.rerun(600000, null, 1));
      }
      response = await this.dataforseo.getAppStoreSearch({
        $,
        data: [
          {
            keyword: this.keyword,
            location_code: this.locationCode,
            language_code: this.languageCode,
            postback_url: postbackUrl,
          },
        ],
      });

      if (response.status_code !== 20000) {
        throw new ConfigurationError(`Error: ${response.status_message}`);
      }

      if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
        throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
      }
    }

    if (run.runs > 1) {
      response = run.callback_request.body;
    }

    $.export("$summary", `Successfully searched App Store for "${this.keyword}".`);
    return response;
  },
};
