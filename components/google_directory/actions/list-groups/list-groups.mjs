import googleDirectory from "../../google_directory.app.mjs";

export default {
  key: "google_directory-list-groups",
  name: "List Groups",
  description: "Retrieves a list of directory groups. [See the documentation](https://developers.google.com/admin-sdk/directory/reference/rest/v1/groups/list)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDirectory,
  },
  async run({ $ }) {
    const results = this.googleDirectory.paginate({
      fn: this.googleDirectory.listGroups,
      params: {
        customer: "my_customer",
      },
      itemType: "groups",
      $,
    });

    const groups = [];
    for await (const group of results) {
      groups.push(group);
    }

    $.export("$summary", `Successfully retrieved ${groups.length} group${groups.length === 1
      ? ""
      : "s"}.`);

    return groups;
  },
};
