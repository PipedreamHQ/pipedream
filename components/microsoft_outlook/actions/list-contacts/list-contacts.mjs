import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-list-contacts",
  version: "0.0.11",
  name: "List Contacts",
  description: "Get a contact collection from the default contacts folder, [See the docs](https://docs.microsoft.com/en-us/graph/api/user-list-contacts)",
  props: {
    microsoftOutlook,
    filterAddress: {
      label: "Email adress",
      description: "If this is given, only contacts with the given address will be retrieved.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftOutlook.listContacts({
      $,
      filterAddress: this.filterAddress,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${response.value.length} contact${response.value.length != 1 ? "s" : ""} has been retrieved.`);
    return response.value;
  },
};
