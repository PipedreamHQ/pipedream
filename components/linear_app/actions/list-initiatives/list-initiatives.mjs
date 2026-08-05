import linearApp from "../../linear_app.app.mjs";
import fields from "../../common/fields.mjs";

// Documented Initiative fields, used to validate `fields`.
const INITIATIVE_FIELDS = [
  "archivedAt",
  "color",
  "content",
  "createdAt",
  "creator",
  "description",
  "health",
  "icon",
  "id",
  "name",
  "owner",
  "slugId",
  "sortOrder",
  "status",
  "targetDate",
  "trashed",
  "updatedAt",
  "url",
];

// Enough to identify an initiative and report where it stands.
const COMPACT_FIELDS = [
  "id",
  "name",
  "description",
  "status",
  "targetDate",
];

export default {
  key: "linear_app-list-initiatives",
  name: "List Initiatives",
  description: "List initiatives in Linear. **Response size matters here:** by default every field of every initiative is returned, including the full markdown `content` body, which makes the response grow with how much people have written rather than how many initiatives there are. `fields: \"compact\"` returns `id,name,description,status,targetDate`, which is what a question about initiatives normally needs. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=initiatives)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    name: {
      type: "string",
      label: "Name",
      description: "Search for initiatives that contain the provided name",
      optional: true,
    },
    status: {
      propDefinition: [
        linearApp,
        "initiativeStatus",
      ],
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
      description: "The number of initiatives to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of initiatives",
      optional: true,
    },
    fields: fields.fieldsProp({
      resource: "initiatives",
      compact: COMPACT_FIELDS,
      guidance: "`content` is the initiative's full markdown body and is usually the largest field; request it only when the initiative's write-up is what you need.",
    }),
  },
  async run({ $ }) {
    const variables = {
      filter: {
        name: {
          contains: this.name,
        },
        status: {
          eq: this.status,
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listInitiatives(variables);

    $.export("$summary", `Found ${nodes.length} initiatives`);

    return {
      nodes: fields.projectRecords(nodes, this.fields, {
        compact: COMPACT_FIELDS,
        known: INITIATIVE_FIELDS,
      }),
      pageInfo,
    };
  },
};
