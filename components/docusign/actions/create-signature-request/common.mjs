export default {
  async additionalProps() {
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    const tabs = await this.docusign.listTemplateTabs(baseUri, this.template);
    return tabs.map((tab) => ({
      type: "string",
      label: tab.tabLabel,
      default: tab.value
        ? tab.value
        : undefined,
      options: tab.listItems?.map((i) => i.value),
      optional: true,
    }));
  },
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
