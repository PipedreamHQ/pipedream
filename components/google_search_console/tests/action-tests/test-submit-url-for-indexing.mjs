/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOCAL TEST RUNNER – DO NOT DEPLOY
 *
 * This file is used to run and debug a Pipedream action **locally** outside
 * of the Pipedream platform. Safe to delete. It does **not** affect production.
 *
 *  It:
 * - Injects a mocked `$` object (`mockery$`)
 * - Bypasses OAuth using a hardcoded access token (get-token.mjs)
 * - Sends a URL submission request to the Google Indexing API
 *
 *   You MUST:
 * - Replace the `Authorization` token with a valid one manually
 * - Ensure the `siteUrl` is verified in your Search Console account
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mockery$ from "../mockery-dollar.mjs"; // TEST ONLY. Delete in production code
import { axios } from "@pipedream/platform";
import gsConsole from "../../google_search_console.app.mjs";
import {trimIfString } from "../../common/utils.mjs"

const mockeryData = {
  siteUrl: "https://falc1.com/", // Must be verified in your GSC account
};

 
const testAction = { // TEST ONLY. Replace to export in real code

  ...mockeryData,  // TEST ONLY. Delete in production code

  name: "Google test",
  description: "This is a demo action",
  key: "google_test",
  version: "0.0.23",
  type: "action",
  props: {
    gsConsole,
    url : {type: "string", label: "URL for indexing", description: "URL to be submitted for indexing"},
  },
  async run({ $ }) {

    this.siteUrl = trimIfString(this.siteUrl);

    // warnings accumulator 
    let warnings = [];

    const urlCheck = gsConsole.methods.checkIfUrlValid(this.siteUrl); // TEST ONLY. Replace to "this"

    if (urlCheck.warnings) warnings.push(...urlCheck.warnings);


    // Response of the POST request.
    let response;

    try {
      response = await axios($, {
        method: "POST",
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        headers: {
          // Tested with real hardcoded token that had required scopes.
          Authorization: `Bearer *HARDCODED TOKEN HERE*`, // Replace with a token from get-token.mjs with scope: "https://www.googleapis.com/auth/indexing".
          "Content-Type": "application/json",
        },
        data: {
          url: this.siteUrl,
          type: "URL_UPDATED",
        },
      });
    } catch (error) {
      // Check who threw the error. Internal code or the request. To ease debugging.
      const thrower = gsConsole.methods.checkWhoThrewError(error);
                                                  
      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. ` + warnings.join("\n- "));
          
    };

    $.export("$summary", ` URL submitted to Google: ${this.siteUrl}`  + warnings.join("\n- "));
    return response;
  },
};

// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();