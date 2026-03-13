import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-find-contact",
  name: "Find Contact",
  description: "Search for a contact by id, name, or using a custom filter. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/overview)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
    contactId: {
      propDefinition: [
        microsoft,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Find contacts whose full name contains the name entered",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Enter a custom filter to search contacts. E.g. `lastname eq 'Smith'`. [See the documentation] for more information about [filters](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/filter-rows)",
      optional: true,
    },
  },
  async run({ $ }) {
    const filterArray = [];
    if (this.contactId) {
      filterArray.push(`contactid eq '${this.contactId}'`);
    }
    if (this.name) {
      filterArray.push(`contains(fullname, '${this.name}')`);
    }
    if (this.filter) {
      filterArray.push(`(${this.filter})`);
    }

    const filter = filterArray.length
      ? filterArray.join(" and ")
      : undefined;

    const { value } = await this.microsoft.listContacts({
      $,
      params: {
        $filter: filter,
      },
    });

    $.export("$summary", `Successfully retrieved ${value.length} contact${value.length === 1
      ? ""
      : "s"}`);

    return value;
  },
};
