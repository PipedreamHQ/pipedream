import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-list-session-types",
  name: "List Session Types",
  description:
    "Returns all bookable session types (services) available at the studio, including their IDs, names, and program associations."
    + " Use this to discover the `sessionTypeId` values needed by **Book Appointment**."
    + " Optionally filter by `programIds` to narrow results to a specific program category."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/site/get-session-types)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    programIds: {
      type: "string",
      label: "Program IDs",
      description: "Comma-separated list of program IDs to filter session types (e.g., `1,2,3`). Leave blank to return all session types.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      Limit: this.limit,
      Offset: this.offset,
    };
    if (this.programIds) {
      params.ProgramIds = this.programIds.split(",").map((id) => id.trim())
        .filter(Boolean);
    }
    const response = await this.app.listSessionTypes({
      $,
      params,
    });
    const types = response.SessionTypes || [];
    $.export("$summary", `Found ${types.length} session type${types.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
