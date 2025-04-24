/**
 * Submits a URL to the Google Indexing API to notify that content was updated.
 * Uses `URL_UPDATED` type. Full docs in README.md
 */

import { axios } from "@pipedream/platform";
import gsConsole from "../../google_search_console.app.mjs";
import { trimIfString } from "../../common/utils.mjs"


 
export default {

  name: "Submit URL for Indexing",
  description: "Sends a URL update notification to the Google Indexing API",
  key: "submit-url-for-indexing",
  version: "0.0.1",
  type: "action",
  props: {
    gsConsole,
    siteUrl : {
      type: "string", 
      label: "URL for indexing", 
      description: "URL to be submitted for indexing"
    },
  },


  //=================== RUN ==============================
  //======================================================


  async run({ $ }) {

    this.siteUrl = trimIfString(this.siteUrl);

    // Accumulator for non-blocking warnings
    let warnings = [];

      /*
      Validate the submitted site URL.
      - May throw if invalid
      - May return warnings for issues like suspicious characters
    */
    const urlCheck = this.gsConsole.checkIfUrlValid(this.siteUrl);

    if (urlCheck.warnings) warnings.push(...urlCheck.warnings);


    // Prepare the API response object
    let response;

    try {
      // Submit the URL to the Google Indexing API
      response = await axios($, {
        method: "POST",
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        headers: {

          Authorization: `Bearer ${this.gsConsole.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: {
          url: this.siteUrl,
          type: "URL_UPDATED", // Notifies Google that the content at this URL has been updated
        },
      });
    } catch (error) {
      /*
        Determine whether the error originated from:
        - Internal validation logic
        - The external API call

        Helps distinguish between coding issues vs API issues.
      */
      const thrower = gsConsole.methods.checkWhoThrewError(error);
                                                  
      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. ` + warnings.join("\n- "));
          
    };
    // Output a summary message and any accumulated warnings
    $.export("$summary", ` URL submitted to Google: ${this.siteUrl}`  + warnings.join("\n- "));
     // Return the raw API response
    return response;
  },
};
