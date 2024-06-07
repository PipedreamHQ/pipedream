import navigatr from "../../navigatr.app.mjs";

export default {
  key: "navigatr-issue-badge",
  name: "Issue Badge",
  description: "Issues a new badge to a recipient. [See the documentation](https://api.navigatr.app/docs)",
  version: "0.0.${ts}",
  type: "action",
  props: {
    navigatr,
    badgeId: navigatr.propDefinitions.badgeId,
    providerId: navigatr.propDefinitions.providerId,
    recipientId: {
      propDefinition: [
        navigatr,
        "recipientId",
        (c) => ({
          optional: !c.recipientEmail,
        }),
      ],
      optional: true,
    },
    recipientEmail: {
      propDefinition: [
        navigatr,
        "recipientEmail",
        (c) => ({
          optional: !c.recipientId,
        }),
      ],
      optional: true,
    },
    recipientFirstname: navigatr.propDefinitions.recipientFirstname,
    recipientLastname: {
      propDefinition: [
        navigatr,
        "recipientLastname",
        (c) => ({
          optional: !c.recipientOrganisation,
        }),
      ],
      optional: true,
    },
    recipientOrganisation: {
      propDefinition: [
        navigatr,
        "recipientOrganisation",
        (c) => ({
          optional: !c.recipientLastname,
        }),
      ],
      optional: true,
    },
    issueDate: navigatr.propDefinitions.issueDate,
    endDate: navigatr.propDefinitions.endDate,
    evidenceText: navigatr.propDefinitions.evidenceText,
    evidenceUrl: navigatr.propDefinitions.evidenceUrl,
    score: navigatr.propDefinitions.score,
    minScore: navigatr.propDefinitions.minScore,
  },
  async run({ $ }) {
    const response = await this.navigatr.issueBadge({
      badgeId: this.badgeId,
      providerId: this.providerId,
      recipientId: this.recipientId,
      recipientEmail: this.recipientEmail,
      recipientFirstname: this.recipientFirstname,
      recipientLastname: this.recipientLastname,
      recipientOrganisation: this.recipientOrganisation,
      issueDate: this.issueDate,
      endDate: this.endDate,
      evidenceText: this.evidenceText,
      evidenceUrl: this.evidenceUrl,
      score: this.score,
      minScore: this.minScore,
    });

    $.export("$summary", `Successfully issued badge to ${this.recipientFirstname} ${this.recipientLastname || this.recipientOrganisation}`);
    return response;
  },
};
