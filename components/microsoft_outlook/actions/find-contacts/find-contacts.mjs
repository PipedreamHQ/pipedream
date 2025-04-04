import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  type: "action",
  key: "microsoft_outlook-find-contacts",
  version: "0.0.11",
  name: "Find Contacts",
  description: "Finds contacts with given search string",
  props: {
    microsoftOutlook,
    searchString: {
      label: "Search string",
      description: "Provide email address, given name, surname or display name (case sensitive)",
      type: "string",
    },
  },
  async run({ $ }) {
    const contactList = await this.microsoftOutlook.listContacts({
      $,
    });
    const relatedContacts = contactList.value.filter((c) => {
      return c.displayName.includes(this.searchString) ||
        c.givenName.includes(this.searchString) ||
        c.surname.includes(this.searchString) ||
        c.emailAddresses.find((e) =>
          e.address == this.searchString ||
          e.name.includes(this.searchString));
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${relatedContacts.length} contact${relatedContacts.length != 1 ? "s" : ""} has been filtered.`);
    return relatedContacts;
  },
};
