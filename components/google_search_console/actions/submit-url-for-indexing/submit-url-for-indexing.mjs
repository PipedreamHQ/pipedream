import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit URL for Indexing",
  description: "Sends a URL update notification to the Google Indexing API",
  key: "google_search_console-submit-url-for-indexing",
  version: "0.0.2",
  type: "action",
  props: {
    googleSearchConsole,
    siteUrl: {
      type: "string",
      label: "URL for indexing",
      description: "URL to be submitted for indexing",
    },
  },
  async run({ $ }) {
    const siteUrl = trimIfString(this.siteUrl);

    const warnings = [];

    const urlCheck = this.googleSearchConsole.checkIfUrlValid(siteUrl);
    if (urlCheck.warnings) {
      warnings.push(...urlCheck.warnings);
    }

    let response;
    try {
      response = await this.googleSearchConsole.submitUrlForIndexing({
        $,
        data: {
          url: siteUrl,
          type: "URL_UPDATED", // Notifies Google that the content at this URL has been updated
        },
      });
    } catch (error) {
      const thrower = this.googleSearchConsole.checkWhoThrewError(error);
      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. ` + warnings.join("\n- "));

    };

    // Output a summary message and any accumulated warnings
    $.export("$summary", ` URL submitted to Google: ${this.siteUrl}`  + warnings.join("\n- "));

    return response;
  },
};
