import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-topic-sessions",
  name: "Get Topic Sessions",
  description: "Retrieves a paginated list of Hedy sessions belonging to a specific topic."
    + " Use **Get Many Topics** first to find the topic ID."
    + " Paginate using the `startAfter` cursor (a session ID from the last item in the previous page)."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Topics/get_topics__topicId__sessions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    topicId: {
      propDefinition: [
        app,
        "topicId",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    startAfter: {
      type: "string",
      label: "Start After (Session ID)",
      description: "Pagination cursor — pass the session ID of the last item from the previous page to retrieve the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.limit) params.limit = this.limit;
    if (this.startAfter) params.startAfter = this.startAfter;

    const response = await this.app.getTopicSessions({
      $,
      topicId: this.topicId,
      params,
    });
    const sessions = response?.data || [];
    $.export("$summary", `Retrieved ${sessions.length} session${sessions.length === 1
      ? ""
      : "s"} for topic ${this.topicId}`);
    return response;
  },
};
