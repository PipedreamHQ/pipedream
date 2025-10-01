import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-create-location",
  name: "Create Location",
  description: "Creates a new location in Deputy. [See the documentation](https://developer.deputy.com/deputy-docs/reference/addalocation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    deputy,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the workplace",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the workplace",
    },
    parentCompanyId: {
      propDefinition: [
        deputy,
        "locationId",
      ],
      label: "Parent Company ID",
      description: "The identifier of the parent company",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone of the workplace. Example: `Australia/Sydney`",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the location",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deputy.createLocation({
      $,
      data: {
        strWorkplaceName: this.name,
        strAddress: this.address,
        intParentCompany: this.parentCompanyId,
        strTimezone: this.timezone,
        strAddressNotes: this.notes,
      },
    });
    $.export("$summary", `Successfully created location with ID: ${response.Id}`);
    return response;
  },
};
