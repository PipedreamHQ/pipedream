import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-list-filters",
  name: "List Filters",
  description:
    "List every filter configured in the authenticated user's Gmail settings, including each filter's `id`, `criteria` (what it matches) and `action` (what it does to matching mail)."
    + " Call this before **Delete Filter** to find the `id` of the filter to remove, or before **Create Filter** to check whether an equivalent filter already exists."
    + " Returns an empty `filter` list (or no `filter` key) when the user has no filters."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/list).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    gmail,
  },
  async run({ $ }) {
    const resp = await this.gmail.listFilters();
    const count = resp.filter?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} filter${count === 1
      ? ""
      : "s"}`);
    return {
      filter: [],
      ...resp,
    };
  },
};
