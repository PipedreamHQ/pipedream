import zohoSurvey from "../../zoho_survey.app.mjs";

export default {
  key: "zoho_survey-send-email-invitation",
  name: "Send Email Invitation",
  description: "Sends an email invitation with Zoho Survey.",
  version: "0.0.2",
  type: "action",
  props: {
    zohoSurvey,
    portalId: {
      propDefinition: [
        zohoSurvey,
        "portalId",
      ],
    },
    groupId: {
      propDefinition: [
        zohoSurvey,
        "groupId",
        (c) => ({
          portalId: c.portalId,
        }),
      ],
    },
    surveyId: {
      propDefinition: [
        zohoSurvey,
        "surveyId",
        (c) => ({
          portalId: c.portalId,
          groupId: c.groupId,
        }),
      ],
    },
    collectorId: {
      propDefinition: [
        zohoSurvey,
        "collectorId",
        (c) => ({
          portalId: c.portalId,
          groupId: c.groupId,
          surveyId: c.surveyId,
        }),
      ],
    },
    distributionId: {
      propDefinition: [
        zohoSurvey,
        "distributionId",
        (c) => ({
          portalId: c.portalId,
          groupId: c.groupId,
          surveyId: c.surveyId,
          collectorId: c.collectorId,
        }),
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const fields = await this.zohoSurvey.listEmailFields({
      portalId: this.portalId,
      groupId: this.groupId,
      surveyId: this.surveyId,
      collectorId: this.collectorId,
      distributionId: this.distributionId,
    });
    for (const field of fields) {
      props[field.key] = {
        type: "string",
        label: field.label,
        optional: !field.required,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      zohoSurvey,
      portalId,
      groupId,
      surveyId,
      collectorId,
      distributionId,
      ...otherProps
    } = this;

    const response = await zohoSurvey.sendEmailInvitation({
      portalId,
      groupId,
      surveyId,
      collectorId,
      distributionId,
      data: {
        contactsList: [
          otherProps,
        ],
      },
      $,
    });

    if (response?.errormessage) {
      throw new Error(response.errormessage);
    }

    $.export("$summary", "Successfully sent email inviation.");

    return response;
  },
};
