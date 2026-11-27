import app from "../../current_rms.app.mjs";

export default {
  key: "current_rms-list-members",
  name: "List Members",
  description: "List members in Current RMS, such as organizations, contacts, venues and users. Returns active members unless you set **Filter Mode**."
    + " Use the `id` field with **Get Member**."
    + " [See the documentation](https://api.current-rms.com/doc#members-members-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Search name, street, work phone, work email, user email or tags, e.g. `Bralton`.",
    },
    filterMode: {
      propDefinition: [
        app,
        "filterMode",
      ],
      description: "Which members to return, e.g. `organisation`. Defaults to active members.",
      options: [
        "active",
        "inactive",
        "all",
        "organisation",
        "contact",
        "venue",
        "user",
        "with_pending_activities",
        "with_live_opportunities",
        "bookable",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const members = await this.app.paginate({
      $,
      fn: this.app.listMembers,
      resourceKey: "members",
      maxResults: this.maxResults,
      params: {
        "filtermode": this.filterMode,
        "q[name_or_primary_address_street_or_work_phone_number_or_work_email_address_or_identity_email_or_tags_name_cont]": this.search,
      },
    });
    $.export("$summary", `Found ${members.length} member${members.length === 1
      ? ""
      : "s"}`);
    return members;
  },
};
