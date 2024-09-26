export default {
  async additionalProps() {
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    const tabs = await this.docusign.listTemplateTabs(baseUri, this.template);
    const templateRecipientsResponse = await this.docusign.listTemplateRecipients(
      baseUri,
      this.template,
    );

    const props = {};
    this._buildRecipientsProps(templateRecipientsResponse, props);
    return this._buildTemplateTabsProps(tabs, props);
  },
  methods: {
    _buildRecipientsProps(templateRecipientsResponse, props) {
      templateRecipientsResponse.signers.forEach((signer) => {
        props[signer.roleName + " - Name"] = {
          type: "string",
          label: signer.roleName + " - Name",
          description: `The name of the ${signer.roleName} recipient`,
        };
        props[signer.roleName + " - Email"] = {
          type: "string",
          label: signer.roleName + " - Email",
          description: `The email of the ${signer.roleName} recipient`,
        };
      });
    },
    _getStatusType() {
      throw new Error("_getStatusType is not defined");
    },
    // iterates through template tabs
    _buildTemplateTabsProps(originalTabs, props = {}) {
      for (const documentTabs of originalTabs) {
        for (const [
          tabType,
          tabsOfSomeType,
        ] of Object.entries(documentTabs)) {
          for (const tab of tabsOfSomeType) {
            this._buildTabProp(tabType, tab, props);
          }
        }
      }
      return props;
    },
    // creates prop for specific tab type
    _buildTabProp(tabType, tab, props) {
      let propType, propLabel, propDefault, propOptions;
      switch (tabType) {
      case "textTabs":
      case "formulaTabs":
      case "numericalTabs":
      case "numberTabs":
      case "dateTabs":
      case "noteTabs":
      case "emailTabs":
      case "ssnTabs":
      case "zipTabs":
        propType = "string";
        propLabel = tab.tabLabel;
        propDefault = tab.value
          ? tab.value
          : undefined;
        break;
      case "checkboxTabs":
        propType = "boolean";
        propLabel = tab.tabLabel;
        break;
      case "listTabs":
        propType = "string";
        propLabel = tab.tabLabel;
        propOptions = tab.listItems?.map((i) => i.value);
        propDefault = tab.value
          ? tab.value
          : undefined;
        break;
      case "radioGroupTabs":
        propType = "string";
        propLabel = tab.groupName;
        propOptions = tab.radios?.map((i) => i.value);
        propDefault = tab.value
          ? tab.value
          : undefined;
        break;
      case "notarizeTabs":
      case "viewTabs":
        console.log(`Not yet implemented tab type: ${tabType}`);
        return;
      default:
        console.log(`Skipped tab type: ${tabType}`);
        return;
      }
      props[`_${propLabel}`] = {
        type: propType,
        label: propLabel,
        default: propDefault,
        options: propOptions,
        optional: true,
      };
    },
    // iterates through template tabs
    _setTemplateTabs(originalTabs, props, tabs = {}) {
      for (const documentTabs of originalTabs) {
        for (const [
          tabType,
          tabsOfSomeType,
        ] of Object.entries(documentTabs)) {
          if (!tabs[tabType]) {
            tabs[tabType] = [];
          }

          for (const tab of tabsOfSomeType) {
            const value = props[`_${tab.tabLabel}`] ?? props[`_${tab.groupName}`];
            if (value && this._insertTabValue(tabType, tab, value)) {
              tabs[tabType].push(tab);
            }
          }
        }
      }
      return tabs;
    },
    // returns true if value was added, false if ignored
    _insertTabValue(tabType, tab, value) {
      switch (tabType) {
      case "textTabs":
      case "dateTabs":
      case "noteTabs":
      case "emailTabs":
      case "ssnTabs":
      case "zipTabs":
        tab.value = value;
        return true;
      case "checkboxTabs":
        value
          ? tab.selected = true
          : tab.selected = false;
        return true;
      case "formulaTabs":
        tab.value = value;
        tab.formula = value;
        return true;
      case "listTabs":
        tab.value = value;
        tab.listItems
          .filter((item) => item.text === value)
          .forEach((item) => item.selected = true);
        return true;
      case "radioGroupTabs":
        tab.value = value;
        tab.radios
          .filter((radio) => radio.value === value)
          .forEach((radio) => radio.selected = true);
        return true;
      case "numericalTabs":
      case "numberTabs":
        tab.value = +value;
        tab.numericalValue = +value;
        return true;
      case "notarizeTabs":
      case "viewTabs":
        console.log(`Not yet implemented tab type: ${tabType}`);
        return false;
      default:
        console.log(`Skipped tab type: ${tabType}`);
        return false;
      }
    },
  },
  async run({ $ }) {
    const baseUri = await this.docusign.getBaseUri({
      $,
      accountId: this.account,
    });

    const templateRecipientsResponse = await this.docusign.listTemplateRecipients(
      baseUri,
      this.template,
    );

    const originalTabs = await this.docusign.listTemplateTabs(baseUri, this.template);
    const tabs = this._setTemplateTabs(originalTabs, this);

    const templateRoles = templateRecipientsResponse.signers.map((role) => {
      const roleTabs = {};
      Object.keys(tabs).forEach((key) => {
        roleTabs[key] = tabs[key].filter((tab) => tab.recipientId === role.recipientIdGuid);
      });

      return {
        roleName: role.roleName,
        name: this[`${role.roleName} - Name`],
        email: this[`${role.roleName} - Email`],
        tabs: roleTabs,
      };
    });

    const data = {
      status: this._getStatusType(),
      templateId: this.template,
      templateRoles: templateRoles,
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
