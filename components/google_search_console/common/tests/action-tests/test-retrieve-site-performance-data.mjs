/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOCAL TEST RUNNER – DO NOT DEPLOY
 *
 * This file is used to run and debug a Pipedream action **locally** outside
 * of the Pipedream platform. Safe to delete. It does **not** affect production.
 *
 *  It:
 * - Injects mocked `$` object (logs, summary)
 * - Bypasses OAuth by using hardcoded access token (get-token.mjs)
 * - Validates, builds, and sends the Search Console request
 *
 *   You MUST:
 * - Replace `Authorization` token with a valid one manually
 * - Ensure `siteUrl` is verified in your Search Console
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mockery$ from "../mockery-dollar.mjs";
import { axios } from "@pipedream/platform";
import gsConsole from "../../../google_search_console.app.mjs";
import {
  removeCustomPropFields, trimIfString,
} from "../../../common/utils.mjs";

// Define prop metadata separately and spread it into the props object.
// Useful for accessing extended metadata during runtime — available because it stays in closure.

// ====================== TEST PREPARATION =====================================================

// TEST ONLY
const mockeryData = {
  siteUrl: "https://falc1.com/", // Must be verified in your GSC account

  // Required
  startDate: "2025-12-22",
  endDate: "2025-12-31",

  // Recommended
  dimensions: [
    "query",
    "page",
    "country",
    "device",
  ], // valid values only

  searchType: "web", // one of: web, image, video, news, googleNews, discover

  rowLimit: 10,

  startRow: 0, // Optional pagination

  // Optional but valid
  aggregationType: "auto", // or "byPage"
  dataState: "final", // or "all"

  // Optional filter (valid structure)
  dimensionFilterGroups: [
    {
      groupType: "and", // "and" or "or"
      filters: [
        {
          dimension: "query",
          operator: "contains", // "equals", "contains", "notEquals", etc.
          expression: "example",
        },
        {
          dimension: "country",
          operator: "equals",
          expression: "USA",
        },
      ],
    },
  ],
};

const propsMeta = {

  siteUrl: {
    type: "string",
    extendedType: "url",
    label: "Verified Site URL",
    description: "Including https:// is strongly advised",
  },
  startDate: {
    type: "string",
    extendedType: "YYYY-MM-DD",
    label: "Start Date (YYYY-MM-DD)",
    postBody: true,
  },
  endDate: {
    type: "string",
    extendedType: "YYYY-MM-DD",
    label: "End Date (YYYY-MM-DD)",
    postBody: true,
  },
  dimensions: {
    type: "string[]",
    label: "Dimensions",
    optional: true,
    description: "e.g. ['query', 'page', 'country', 'device']",
    postBody: true,
  },
  searchType: {
    type: "string",
    label: "Search Type",
    optional: true,
    options: [
      "web",
      "image",
      "video",
      "news",
      "googleNews",
      "discover",
    ],
    default: "web",
    postBody: true,
  },
  aggregationType: {
    type: "string",
    label: "Aggregation Type",
    optional: true,
    options: [
      "auto",
      "byPage",
    ],
    postBody: true,
  },
  rowLimit: {
    type: "integer",
    label: "Max rows to return",
    default: 10,
    postBody: true,
  },
  startRow: {
    type: "integer",
    label: "Start row (for pagination)",
    optional: true,
    postBody: true,
  },
  dimensionFilterGroups: {
    type: "object",
    label: "Dimension Filters",
    optional: true,
    description: "Follow Search Console API structure for filters",
    postBody: true,
  },
  dataState: {
    type: "string",
    label: "Data State",
    optional: true,
    options: [
      "all",
      "final",
    ],
    default: "final",
    postBody: true,
  },

};

const testAction = {

  ...mockeryData,

  name: "Get Site Performance Data",
  description: "Fetches search analytics data for a verified site.",
  key: "get_search_console_analytics",
  version: "0.0.47",
  type: "action",
  props: {
    gsConsole,
    // Remove custom prop metadata and spread only valid prop fields
    ...removeCustomPropFields(propsMeta),
  },

  async run({ $ }) {

    // body for POST request. Will be filled in the following loop.
    const body = {};

    // warnings accumulator
    let warnings = [];

    /* This loop performs the following tasks:
   - Validates user input
   - Populates the `body` object for the upcoming POST request
   - Accumulates messages to display to the user at the end of the action
*/
    for (let propName in propsMeta) {

      console.log("===VALUE", this[propName]);
      const meta = propsMeta[propName];

      // Trim the input if it's a string
      this[propName] = trimIfString(this[propName]);

      // If the optional prop is undefined, null, or a blank string — skip it
      if (meta.optional === true && ((this[propName] ?? "") === "")) continue;

      // Validate the input and throw an error if it's invalid.
      // Also return an empty string or a warning message, if applicable
      const validationResult = gsConsole.methods.validateUserInput(meta, this[propName]);

      // Push the warnings into warnings accumulator if any.
      if (validationResult.warnings) warnings.push(...validationResult.warnings);

      // If the prop should be included in the POST request, add it to the body
      if (meta.postBody === true) body[propName] = this[propName];

      console.log(" SUCCESS");
    };

    // Trimmed in loop above
    const url = this.siteUrl;

    // Response of the POST request.
    let response;

    try {
      response = await axios($, {
        method: "POST",
        url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}/searchAnalytics/query`,
        headers: {
          // TEMP: Local-only token for manual testing. Do not commit this to source control.
          "Authorization": "Bearer  *HARDCODED TOKEN HERE*",
          "Content-Type": "application/json",
        },
        data: body,
      });

    } catch (error) {
      // Check who threw the error. Internal code or the request. To ease debugging.
      const thrower = gsConsole.methods.checkWhoThrewError(error);

      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. `  + warnings.join("\n- "));

    };

    $.export("$summary", ` Fetched ${response.rows?.length || 0} rows of data. ` + warnings.join("\n- "));
    return response;
  },
};

// await is just in case if node wants to finish its job before time =)
async function runTest() {
  await testAction.run(mockery$);
}

runTest();
