import app from "../../current_rms.app.mjs";

export default {
  key: "current_rms-get-member",
  name: "Get Member",
  description: "Get the details of one member, including its addresses, phones, emails and custom fields."
    + " Use **List Members** to find the member."
    + " [See the documentation](https://api.current-rms.com/doc#members-member-get)",
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
    memberId: {
      propDefinition: [
        app,
        "memberId",
      ],
    },
  },
  async run({ $ }) {
    const { member } = await this.app.getMember({
      $,
      memberId: this.memberId,
    });
    $.export("$summary", `Retrieved member ${member.name}`);
    return member;
  },
};
