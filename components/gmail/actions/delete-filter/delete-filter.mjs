import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-delete-filter",
  name: "Delete Filter",
  description:
    "Permanently delete a Gmail filter from the authenticated user's settings. Mail already processed by the filter is not changed; the filter simply stops applying to future incoming mail."
    + " The Gmail API deletes by filter ID — call **List Filters** first to find the `id` of the filter to remove."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.settings.filters/delete).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    gmail,
    filterId: {
      type: "string",
      label: "Filter ID",
      description:
        "The ID of the filter to permanently delete (e.g. `ANe1BmjXXXXXXXX`)."
        + " Use the **List Filters** action to look up filter IDs and inspect each filter's criteria before deleting.",
    },
  },
  async run({ $ }) {
    await this.gmail.deleteFilter(this.filterId);

    $.export("$summary", `Deleted filter ${this.filterId}`);
    return {
      id: this.filterId,
      deleted: true,
    };
  },
};
