import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-list-active-staff",
  name: "List Active Staff",
  description: "Retrieves a list of all active staff members. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=164#private.util.getActiveStaff)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpspot,
  },
  async run({ $ }) {
    const response = await this.helpspot.listActiveStaff({
      $,
    });

    const staff = response?.person ?? [];
    const count = Array.isArray(staff)
      ? staff.length
      : 1;
    $.export("$summary", `Successfully retrieved ${count} staff member${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
