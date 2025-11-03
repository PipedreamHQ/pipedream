import zohoDesk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-help-centers",
  name: "List Help Centers",
  description: "Lists the help centers configured in an organization. [See the documentation](https://desk.zoho.com/portal/APIDocument.do#HelpCenters_Listhelpcenters)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
  },
  async run({ $ }) {
    const { orgId } = this;

    const { data: helpCenters = [] } =
      await this.zohoDesk.listHelpCenters({
        params: {
          orgId,
        },
      });

    $.export("$summary", `Retrieved ${helpCenters.length} help center${helpCenters.length === 1
      ? ""
      : "s"}.`);

    return helpCenters;
  },
};
