// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-list-segments",
  name: "List Segments",
  description:
    "List subscriber segments for a publication. Segments are"
    + " pre-defined subscriber groups (dynamic rules, static"
    + " lists, or manual selections)."
    + " Use this for discovery — to understand how subscribers"
    + " are organized."
    + " Use **Get Publication Info** to get the publication ID."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "segments/index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Use **Get Publication Info** to find"
        + " this.",
    },
    type: {
      type: "string",
      label: "Segment Type",
      description:
        "Filter segments by type. Options: `dynamic`, `static`,"
        + " `manual`, `all`. Default: `all`.",
      optional: true,
      options: [
        "dynamic",
        "static",
        "manual",
        "all",
      ],
    },
  },
  async run({ $ }) {
    const params: Record<string, string> = {};
    if (this.type) {
      params.type = this.type;
    }

    const response = await this.app.listSegments(
      $,
      this.publicationId,
      params,
    );

    const segments = response.data || [];

    $.export(
      "$summary",
      `Found ${segments.length} segment${segments.length === 1
        ? ""
        : "s"}`,
    );

    return segments;
  },
});
