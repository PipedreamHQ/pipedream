import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-linkedin-people",
  name: "Search LinkedIn People",
  description: "Searches LinkedIn for people profiles by first and/or last name. At least one of First Name or Last Name is required. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/linkedin/people/search&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name to search for (string). At least one of First Name or Last Name is required.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name to search for (string). At least one of First Name or Last Name is required.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.searchLinkedinPeople({
      $,
      firstName: this.firstName,
      lastName: this.lastName,
    });
    const nameLabel = [
      this.firstName,
      this.lastName,
    ].filter(Boolean).join(" ")
      .trim();
    $.export("$summary", `Successfully fetched LinkedIn people matching "${nameLabel}"`);
    return response;
  },
};
