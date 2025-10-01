import loops from "../../loops_so.app.mjs";

export default {
  key: "loops_so-find-contact",
  name: "Find Contact",
  description: "Search for a contact by email address. [See the Documentation](https://loops.so/docs/add-users/api-reference#find)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    loops,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to search for",
    },
  },
  async run({ $ }) {
    const response = await this.loops.findContact({
      params: {
        email: this.email,
      },
      $,
    });

    if (response.length) {
      $.export("$summary", `Found contact with email address ${this.email}.`);
    } else {
      $.export("$summary", `Could not find contact with email address ${this.email}.`);
    }

    return response[0];
  },
};
