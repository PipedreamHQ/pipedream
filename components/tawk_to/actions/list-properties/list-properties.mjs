import tawk_to from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-list-properties",
  name: "List Properties",
  description:
    "Retrieve a list of properties associated with the authenticated tawk.to account via `POST /property.list`. Optionally filter by property type (`business` or `profile`). Returns property objects with `propertyId`, `name`, and configuration details. Run this first to discover valid `propertyId` values for other tawk.to actions. [See the documentation](https://developer.tawk.to/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tawk_to,
    type: {
      propDefinition: [
        tawk_to,
        "type",
      ],
      description:
        "Optional filter to restrict properties by type (`business` or `profile`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tawk_to.listProperties({
      $,
      data: {
        ...(this.type && {
          type: this.type,
        }),
      },
    });

    const properties = response?.data || [];
    $.export(
      "$summary",
      `Successfully retrieved ${properties.length} property(s)`,
    );
    return response;
  },
};
