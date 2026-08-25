// x-pd-ai: optimized
import attio from "../../attio.app.mjs";

export default {
  key: "attio-list-records",
  name: "List Records",
  description: "List records for an object (people, companies, deals, or a custom object), most recent first. Use when you need to find or enumerate records and don't have a specific id. Set **Object** and optionally a **Limit** and **Fields**. Example: Object `companies`, Limit `20`. Returns an array of records with their attribute values. If the number of records returned equals the **Limit**, call again with **Offset** advanced by the limit to fetch the next page. [See the documentation](https://developers.attio.com/reference/post_v2-objects-object-records-query)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    attio,
    objectId: {
      propDefinition: [
        attio,
        "objectId",
      ],
      description: "The object to list records from (e.g. people, companies, deals, or a custom object).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return (1–500). Lower it when you only need a few. Defaults to 50.",
      min: 1,
      max: 500,
      default: 50,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of records to skip, for paging. If the number of records returned equals the **Limit**, call again with this advanced by the limit to fetch the next page.",
      default: 0,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Return only these attribute slugs per record (e.g. `[\"name\", \"domains\"]`), to keep results small. Omit to return all attributes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      attio, objectId, limit = 50, offset = 0, fields,
    } = this;

    const resolvedLimit = Math.min(Math.max(limit, 1), 500);

    const { data } = await attio.listRecords({
      $,
      targetObject: objectId,
      data: {
        limit: resolvedLimit,
        offset,
        sorts: [
          {
            direction: "desc",
            attribute: "created_at",
            field: "value",
          },
        ],
      },
    });

    const records = data ?? [];
    // `fields` projection: pluck only the requested attribute slugs to trim payload.
    const shaped = fields?.length
      ? records.map((rec) => ({
        id: rec.id,
        values: Object.fromEntries(
          fields
            .filter((f) => f in (rec.values ?? {}))
            .map((f) => [
              f,
              rec.values[f],
            ]),
        ),
      }))
      : records;

    $.export("$summary", `Found ${records.length} record(s).`);
    return shaped;
  },
};
