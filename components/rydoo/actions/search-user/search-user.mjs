import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-search-user",
  name: "Search User",
  description: "Searches for a user by email. [See the documentation](https://developers.rydoo.com/reference/v2usersearchuser)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rydoo,
    search: {
      type: "string",
      label: "Search",
      description: "Search string to filter users",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by user's email address",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Filter by user's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Filter by user's last name",
      optional: true,
    },
    hasCard: {
      type: "boolean",
      label: "Has Card",
      description: "Filter users with (`true`) or without (`false`) the card module",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Filter by user's external ID",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of users to return per page (defaults to `50`)",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of users to skip for paging (defaults to `0`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.listUsers({
      $,
      params: {
        search: this.search,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        hasCard: this.hasCard,
        externalId: this.externalId,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Successfully searched for users and found ${response.length} user${response.length === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
