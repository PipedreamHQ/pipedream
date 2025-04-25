/**
 * Fetches performance data (clicks, impressions, etc.) for a verified site
 * via the Google Search Console Search Analytics API.
 *
 * Full usage docs in README.md
 */

import { axios } from "@pipedream/platform";
import gsConsole from "../../google_search_console.app.mjs";
import {
  removeCustomPropFields, trimIfString,
} from "../../common/utils.mjs";

/*
  Define prop metadata separately, including custom fields used for extended validation
  and runtime behavior.

  These extended fields (like `extendedType`, `postBody`, etc.) are not part of the standard
  Pipedream prop schema.

  A helper function (`removeCustomPropFields`) will later strip these non-standard fields,
  returning only valid Pipedream props for use in the UI.

  Keeping the full metadata in closure allows access to helpful context (e.g. validation rules)
  during runtime.
*/
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

export default {
  name: "Retrieve Site Performance Data",
  description: "Fetches search analytics from Google Search Console for a verified site.",
  key: "google_search_console-retrieve-site-performance-data",
  version: "0.0.1",
  type: "action",
  props: {
    gsConsole,
    // Remove non-standard fields and expose only valid props to Pipedream UI
    ...removeCustomPropFields(propsMeta),
  },

  //=================== RUN ==============================
  //======================================================

  async run({ $ }) {

    /*
      `dimensionFilterGroups` is expected to be an object.
      If a JSON string is passed instead (e.g. from UI input), attempt to parse it.
      - Returns parsed object if successful
      - Returns original input if not a string
      - Throws a descriptive error if JSON parsing fails
    */
    this.dimensionFilterGroups = this.gsConsole.parseIfJsonString(this.dimensionFilterGroups);

    // Prepare the POST request payload
    const body = {};

    // Accumulator for non-blocking input warnings
    const warnings = [];

    /*
      This loop:
      - Trims and validates all defined props
      - Skips empty optional fields
      - Accumulates non-blocking warnings
      - Adds valid props to the POST request payload (`body`) if marked with `postBody: true`
    */
    for (let propName in propsMeta) {

      // Just for convenience.
      const meta = propsMeta[propName];

      // Trim the value if it's a string
      this[propName] = trimIfString(this[propName]);

      // Skip if the prop is optional and empty (null, undefined, or blank string)
      if (meta.optional === true && ((this[propName] ?? "") === "")) continue;

      // Validate input (may throw or return warning messages)
      const validationResult = this.gsConsole.validateUserInput(meta, this[propName]);

      // Push the warnings into warnings accumulator if any.
      if (validationResult.warnings) warnings.push(...validationResult.warnings);

      // Include prop in the request body if marked as postBody
      if (meta.postBody === true) body[propName] = this[propName];
    };

    // Already trimmed earlier
    const url = this.siteUrl;

    // Response of the POST request.
    let response;

    try {
      response = await axios($, {
        method: "POST",
        url: `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(url)}/searchAnalytics/query`,
        headers: {
          "Authorization": `Bearer ${this.gsConsole.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: body,
      });

    } catch (error) {
      // Identify if the error was thrown by internal validation or by the API call
      const thrower = this.gsConsole.checkWhoThrewError(error);

      throw new Error(`Failed to fetch data ( ${thrower.whoThrew} error ) : ${error.message}. ` + warnings.join("\n- "));
    };

    // Output summary and any warnings for the user
    $.export("$summary", ` Fetched ${response.rows?.length || 0} rows of data. ` + warnings.join("\n- "));
    return response;
  },
};

