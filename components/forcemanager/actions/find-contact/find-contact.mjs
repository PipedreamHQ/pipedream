import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-find-contact",
  name: "Find Contact",
  description: "Search for an existing contact by any field. One of the required props need to be 'name', 'email', or 'phone_number'.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    forcemanager,
    searchField: forcemanager.propDefinitions.searchField,
    searchValue: forcemanager.propDefinitions.searchValue,
  },
  async run({ $ }) {
    const response = await this.forcemanager.searchContact(this.searchField, this.searchValue);
    $.export("$summary", `Found ${response.length} contact(s)`);
    return response;
  },
};
