import sidetracker from "../../sidetracker.app.mjs";

export default {
  key: "sidetracker-list-sessions-for-domain",
  name: "List Sessions for Domain",
  description: "Retrieve a list of all sessions for a domain tracker. [See the documentation](https://app.sidetracker.io/api/schema/redoc#tag/Tracking/operation/TrackerSessionRetrieval)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sidetracker,
    domainId: {
      type: "string",
      label: "Domain ID",
      description: "The unique ID of a domain tracker. Present in the embed code for the domain and in the URL of the domain settings. Example: `hmdlvldjh4`",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of sessions to return per page",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.sidetracker.listSessions({
      $,
      domainId: this.domainId,
      params: {
        page: this.page,
        page_size: this.pageSize,
      },
    });

    $.export("$summary", `Retrieved ${response.results?.length || 0} session${response.results?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
