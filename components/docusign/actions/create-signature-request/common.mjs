export default {
  name: "Create Signature Request",
  description: "Creates a signature request from a template",
  type: "action",
  async run() {
    const baseUri = await this.docusign.getBaseUri(this.account);
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
    if (this.emailBlurb) data.emailBlurb = this.emailBlurb;
    try {
      return await this.docusign.createEnvelope(baseUri, data);
    } catch (err) {
      throw new Error(err.message);
    }
  },
}