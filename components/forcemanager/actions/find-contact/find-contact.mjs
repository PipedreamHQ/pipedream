import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-find-contact",
  name: "Find Contact",
  description: "Search for an existing contact by email, name, or phone. [See the documentation](https://developer.forcemanager.com/#c1c37cd1-5cb9-473f-8918-7583ee0469e4)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    forcemanager,
    email: {
      type: "string",
      label: "Email",
      description: "Email address to search for",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name to search for",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name to search for",
      optional: true,
    },
    phone1: {
      type: "string",
      label: "Phone",
      description: "Phone number to search for",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      forcemanager,
      ...fields
    } = this;
    const conditions = Object.keys(fields)?.length
      ? Object.keys(fields).map((key) => `${key}='${fields[key]}'`)
      : [];
    const response = await forcemanager.listContacts({
      $,
      params: {
        where: conditions.join(" AND "),
      },
    });
    $.export("$summary", `Found ${response.length} contact${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
