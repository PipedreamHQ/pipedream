import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-get-group",
  name: "Get Group",
  description: "Retrieves information about a group. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/groups/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDirectory,
    group: {
      propDefinition: [
        googleDirectory,
        "group",
      ],
    },
  },
  async run({ $ }) {
    const group = await this.googleDirectory.getGroup({
      groupId: this.group,
      $,
    });

    $.export("$summary", `Successfully retrieved group with ID ${this.group}.`);

    return group;
  },
};
