import safebrowsing from "../../google_safebrowsing.app.mjs";

export default {
  key: "google_safebrowsing-get-threat-list-updates",
  name: "Get Threat List Updates",
  description: "Get the latest threat list update information from Google Safe Browsing API. [See the documentation](https://developers.google.com/safe-browsing/v4/reference/rest/v4/threatListUpdates/fetch#ListUpdateRequest)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    safebrowsing,
    threatLists: {
      propDefinition: [
        safebrowsing,
        "threatLists",
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "The current state of the client for the requested list (the encrypted client state that was received from the last successful list update). A base64-encoded string.",
      optional: true,
    },
  },
  async run({ $ }) {
    const threatLists = this.threatLists.map((list) => JSON.parse(list));

    const listUpdateRequests = this.state
      ? threatLists.map((list) => ({
        ...list,
        state: this.state,
      }))
      : threatLists;

    const response = await this.safebrowsing.fetchThreatListUpdates({
      data: {
        listUpdateRequests,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved updates.");
    }

    return response;
  },
};
