import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-list-contact-id-options",
  name: "List Contact Options",
  description: "List Wealthbox contacts (paginated, 25 per page) so agents and users can discover valid contact IDs to supply to other actions. Use this before any action that requires a Contact ID — for example **Create Opportunity**, **Create Note**, **Add Member To Household**, or **Start Workflow**. Returns objects with `label` (full name) and `value` (numeric contact ID, e.g. `67890`). Increment Page to load the next batch. [See the documentation](https://dev.wealthbox.com/#contacts-retrieve-all-contacts-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wealthbox,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await wealthbox.propDefinitions.contactId.options.call(this.wealthbox, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
