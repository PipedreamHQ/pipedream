// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";
import { SEARCHABLE_OBJECT_TYPES } from "../../common/object-types.mjs";

export default {
  key: "hubspot-get-crm-objects",
  name: "Get CRM Objects",
  description:
    "Fetch one or more CRM objects by their IDs in a single request."
    + " Returns the requested properties for each object."
    + " Use **Search CRM Objects** first to find record IDs, then use this tool to fetch full details."
    + " Max 100 IDs per request."
    + " [See the documentation](https://developers.hubspot.com/docs/api/crm/objects)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The CRM object type to fetch.",
      options: SEARCHABLE_OBJECT_TYPES,
    },
    objectIds: {
      type: "string[]",
      label: "Object IDs",
      description:
        "List of object IDs to fetch. Min 1, max 100.",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description:
        "Property names to include in results."
        + " Use **Search Properties** to discover available property names."
        + " If not specified, returns default properties.",
      optional: true,
    },
  },
  async run({ $ }) {
    const inputs = this.objectIds.map((id) => ({
      id,
    }));

    const data = {
      inputs,
    };

    if (this.properties?.length) {
      data.properties = this.properties;
    }

    const response = await this.hubspot.batchGetObjects({
      $,
      objectType: this.objectType,
      data,
    });

    const count = response?.results?.length ?? 0;
    $.export(
      "$summary",
      `Retrieved ${count} ${this.objectType} record${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
