import googleSearchConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs";

export default {
  name: "Submit URL for Indexing",
  description: "Sends a URL update notification to the Google Indexing API",
  key: "google_search_console-submit-url-for-indexing",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleSearchConsole,
    siteUrl: {
      type: "string",
      label: "URL for indexing",
      description: "URL to be submitted for indexing (must be a canonical URL that's verified in Google Search Console)",
    },
    notificationType: {
      type: "string",
      label: "Notification Type",
      description: "Type of notification to send to Google",
      options: [
        {
          label: "URL Updated (content has been updated)",
          value: "URL_UPDATED",
        },
        {
          label: "URL Deleted (page no longer exists)",
          value: "URL_DELETED",
        },
      ],
      default: "URL_UPDATED",
    },
  },
  async run({ $ }) {
    const {
      siteUrl, notificationType,
    } = this;
    const trimmedUrl = trimIfString(siteUrl);

    const warnings = [];

    const urlCheck = this.googleSearchConsole.checkIfUrlValid(trimmedUrl);
    if (urlCheck.warnings) {
      warnings.push(...urlCheck.warnings);
    }

    let response;
    try {
      response = await this.googleSearchConsole.submitUrlForIndexing({
        $,
        data: {
          url: trimmedUrl,
          type: notificationType,
        },
      });
    } catch (error) {
      const thrower = this.googleSearchConsole.checkWhoThrewError(error);

      // Add more helpful error messages for common errors
      if (error.response?.status === 403) {
        throw new Error("Access denied. Make sure the URL belongs to a property you have access to in Google Search Console.");
      }

      if (error.response?.status === 400) {
        throw new Error("Invalid request. Ensure the URL is canonical and belongs to a verified property.");
      }

      throw new Error(`Failed to submit URL (${thrower.whoThrew} error): ${error.message}`);
    }

    // Format warnings string if any warnings exist
    const warningsString = warnings.length > 0
      ? `\n- ${warnings.join("\n- ")}`
      : "";

    // Output a summary message and any accumulated warnings
    $.export("$summary", `URL submitted to Google: ${trimmedUrl}${warningsString}`);

    return response;
  },
};
