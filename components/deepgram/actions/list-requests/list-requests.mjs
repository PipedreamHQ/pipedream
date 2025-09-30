import deepgram from "../../deepgram.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "deepgram-list-requests",
  name: "List Requests",
  description: "Generates a list of requests sent to the Deepgram API for the specified project over a given time range. [See the documentation](https://developers.deepgram.com/api-reference/usage/#get-all-requests)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    deepgram,
    projectId: {
      propDefinition: [
        deepgram,
        "projectId",
      ],
    },
    start: {
      propDefinition: [
        deepgram,
        "start",
      ],
    },
    end: {
      propDefinition: [
        deepgram,
        "end",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of requests to return",
      optional: true,
      default: 50,
    },
  },
  async run({ $ }) {
    const allRequests = [];
    const params = {
      start: this.start,
      end: this.end,
      limit: constants.DEFAULT_LIMIT,
      page: 0,
    };

    do {
      const { requests } = await this.deepgram.listRequests({
        params,
        projectId: this.projectId,
        $,
      });
      allRequests.push(...requests);
      if (requests?.length < params.limit) {
        break;
      }
      params.page += 1;
    } while (allRequests.length < this.maxResults);

    if (allRequests.length > this.maxResults) {
      allRequests.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${allRequests.length} request${allRequests.length === 1
      ? ""
      : "s"}`);

    return allRequests;
  },
};
