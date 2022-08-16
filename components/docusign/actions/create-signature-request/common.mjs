export default {
  async additionalProps() {
    const baseUri = await this.docusign.getBaseUri({
      accountId: this.account,
    });
    const tabs = await this.docusign.listTemplateTabs(baseUri, this.template);
    return this._buildTemplateTabsProps(tabs);
  },
  methods: {
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
      case "dateTabs":
      case "notarizeTabs":
      case "noteTabs":
      case "numberTabs":
      case "ssnTabs":
      case "viewTabs":
      case "zipTabs":
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
      case "dateTabs":
      case "notarizeTabs":
      case "noteTabs":
      case "numberTabs":
      case "ssnTabs":
      case "viewTabs":
      case "zipTabs":
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

    const originalTabs = await this.docusign.listTemplateTabs(baseUri, this.template);
    const tabs = this._setTemplateTabs(originalTabs, this);

    const data = {
      status: "sent",
      templateId: this.template,
      templateRoles: [
        {
          roleName: this.role,
          name: this.recipientName,
          email: this.recipientEmail,
          tabs,
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
