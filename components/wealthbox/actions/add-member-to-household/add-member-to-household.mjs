import wealthbox from "../../wealthbox.app.mjs";
import { HOUSEHOLD_MEMBER_TITLES } from "../../common/constants.mjs";

export default {
  key: "wealthbox-add-member-to-household",
  name: "Add Member To Household",
  description: "Add an existing contact as a member of an existing household via POST /households/{household_id}/members. Run **List Households** to find household ids and **List Contact Options** to find contact ids. Example: add contact `67890` as `Spouse` to household `12345`; returns the household object including `id` and a `members` array, each member with `id`, `first_name`, `last_name`, `title`, and `type`. [See the documentation](https://dev.wealthbox.com/#household-members-create-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wealthbox,
    householdId: {
      type: "string",
      label: "Household ID",
      description: "Free-form id of the household to add the member to. Run **List Households** first to obtain valid ids. Example: `12345`.",
    },
    contactId: {
      propDefinition: [
        wealthbox,
        "contactId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The member's role in the household. One of: `Head`, `Spouse`, `Partner`, `Child`, `Grandchild`, `Parent`, `Grandparent`, `Sibling`, `Other Dependent`.",
      options: HOUSEHOLD_MEMBER_TITLES,
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.addHouseholdMember({
      $,
      householdId: this.householdId,
      data: {
        id: Number(this.contactId),
        title: this.title,
      },
    });

    $.export("$summary", `Successfully added contact ${this.contactId} to household ${this.householdId}`);
    return response;
  },
};
