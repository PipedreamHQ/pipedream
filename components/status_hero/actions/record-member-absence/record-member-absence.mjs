import app from "../../status_hero.app.mjs";

export default {
  type: "action",
  key: "status_hero-record-member-absence",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Record Member Absence",
  description: "Creates a vacation or leave day for an individual team member, [See the docs](https://api.statushero.com/#add-member-absence)",
  props: {
    app,
    memberId: {
      propDefinition: [
        app,
        "memberId",
      ],
    },
    date: {
      propDefinition: [
        app,
        "date",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addMemberAbsence({
      $,
      memberId: this.memberId,
      data: {
        date: this.date,
      },
    });
    $.export("$summary", `Absence has been created. Member(${this.memberId}) Date(${this.date})`);
    return resp;
  },
};
