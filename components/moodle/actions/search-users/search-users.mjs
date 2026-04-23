import moodle from "../../moodle.app.mjs";

export default {
  key: "moodle-search-users",
  name: "Search Users",
  description: "Searches for Moodle users that match specific criteria such as username, email, or ID. [See the documentation](https://moodledev.io/docs/5.2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moodle,
    key: {
      type: "string",
      label: "Search Field",
      description: "The field to search by",
      options: [
        "id",
        "ids",
        "username",
        "email",
        "firstname",
        "lastname",
        "auth",
        "idnumber",
        "city",
        "country",
        "deleted",
        "suspended",
        "confirmed",
      ],
    },
    value: {
      type: "string",
      label: "Search Value",
      description: "The value to match against the selected field",
    },
  },
  async run({ $ }) {
    const response = await this.moodle.searchUsers({
      $,
      params: {
        "criteria[0][key]": this.key,
        "criteria[0][value]": this.value,
      },
    });
    const users = response?.users ?? [];
    $.export("$summary", `Successfully retrieved ${users.length} user(s)`);
    return response;
  },
};
