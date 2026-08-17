import linearApp from "../../linear_app.app.mjs";
import fields from "../../common/fields.mjs";

// Documented CustomView fields, used to validate `fields`.
const VIEW_FIELDS = [
  "archivedAt",
  "color",
  "createdAt",
  "creator",
  "description",
  "filterData",
  "filters",
  "icon",
  "id",
  "modelName",
  "name",
  "organization",
  "owner",
  "projectFilterData",
  "shared",
  "slugId",
  "team",
  "updatedAt",
  "updatedBy",
  "userViewPreferences",
];

// Enough to pick a view and pass its id to Get View Issues.
const COMPACT_FIELDS = [
  "id",
  "name",
  "description",
  "modelName",
];

export default {
  key: "linear_app-list-views",
  name: "List Views",
  description: "List views in Linear. **Response size matters here:** by default every field of every view is returned, including the serialized filter definitions (`filterData`, `projectFilterData`, `filters`) which are large nested blobs — measured at 26 KB average and 44 KB worst case on a real workspace, enough to exceed an AI agent's tool-output ceiling entirely. `fields: \"compact\"` returns `id,name,description,modelName`, which is what you need to pick a view and pass its id to **Get View Issues**. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=views)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "Filter views by team",
      optional: true,
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of views to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of views",
      optional: true,
    },
    fields: fields.fieldsProp({
      resource: "views",
      compact: COMPACT_FIELDS,
      guidance: "`filterData`, `projectFilterData` and `filters` are serialized filter definitions and are the bulk of the response; request them only when inspecting how a view is configured.",
    }),
  },
  async run({ $ }) {
    const variables = {
      filter: {
        team: {
          id: {
            eq: this.teamId,
          },
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listCustomViews(variables);

    $.export("$summary", `Found ${nodes.length} view${nodes.length === 1
      ? ""
      : "s"}`);

    return {
      nodes: fields.projectRecords(nodes, this.fields, {
        compact: COMPACT_FIELDS,
        known: VIEW_FIELDS,
      }),
      pageInfo,
    };
  },
};
