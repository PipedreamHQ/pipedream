import app from "../../limitless_ai.app.mjs";

export default {
  key: "limitless_ai-get-lifelogs",
  name: "Get Lifelogs",
  description: "Returns a list of lifelog entries based on specified time range or date. [See the documentation](https://www.limitless.ai/developers#get-lifelogs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    timezone: {
      propDefinition: [
        app,
        "timezone",
      ],
    },
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
    start: {
      propDefinition: [
        app,
        "start",
      ],
    },
    end: {
      propDefinition: [
        app,
        "end",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    direction: {
      propDefinition: [
        app,
        "direction",
      ],
    },
    includeMarkdown: {
      propDefinition: [
        app,
        "includeMarkdown",
      ],
    },
    includeHeadings: {
      propDefinition: [
        app,
        "includeHeadings",
      ],
    },
    isStarred: {
      propDefinition: [
        app,
        "isStarred",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getLifelogs({
      $,
      params: {
        timezone: this.timezone,
        date: this.date,
        start: this.start,
        end: this.end,
        cursor: this.cursor,
        direction: this.direction,
        includeMarkdown: this.includeMarkdown,
        includeHeadings: this.includeHeadings,
        isStarred: this.isStarred,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.meta.lifelogs.count} Lifelogs`);
    return response;
  },
};
