export default {
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });
    const data = {
      status: "sent",
      templateId: this.template,
      templateRoles: [
        {
          roleName: this.role,
          name: this.recipientName,
          email: this.recipientEmail,
        },
      ],
      emailSubject: this.emailSubject,
    };
    if (this.emailBlurb) {
      data.emailBlurb = this.emailBlurb;
    }
    const resp = await this.docusign.createEnvelope({
      $,
      baseUri,
      data,
    });

    $.export("$summary", "Successfully created a new signature request");

    return resp;
  },
};
