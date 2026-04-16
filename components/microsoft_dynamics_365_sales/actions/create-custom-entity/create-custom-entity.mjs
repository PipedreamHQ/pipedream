import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";
import languageCodes from "../../common/language-codes.mjs";
import pluralize from "pluralize";

export default {
  key: "microsoft_dynamics_365_sales-create-custom-entity",
  name: "Create Custom Entity",
  description: "Create a custom entity. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/create-update-entity-definitions-using-web-api)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoft,
    solutionId: {
      propDefinition: [
        microsoft,
        "solutionId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the new entity. E.g. `Bank Account`",
    },
    primaryAttribute: {
      type: "string",
      label: "Primary Attribute",
      description: "The primary name attribute of the new entity. E.g. `Account Name`",
    },
    languageCode: {
      type: "integer",
      label: "Language Code",
      description: "The language code to use for the entity",
      options: languageCodes,
      default: 1033,
      optional: true,
    },
    additionalAttributes: {
      type: "object",
      label: "Additional Attributes",
      description: "An array of objects representing attributes to add to the custom entity. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/create-update-entity-definitions-using-web-api) for more information about formatting attribute objects",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the new entity",
      optional: true,
    },
    hasActivities: {
      type: "boolean",
      label: "Has Activities",
      description: "Set to `true` if the new entity has activities",
      default: false,
      optional: true,
    },
    hasNotes: {
      type: "boolean",
      label: "Has Notes",
      description: "Set to `true` if the new entity has notes",
      default: false,
      optional: true,
    },
  },
  methods: {
    parseAttributes() {
      return this.additionalAttributes
        ? typeof this.additionalAttributes === "string"
          ? JSON.parse(this.additionalAttributes)
          : this.additionalAttributes
        : [];
    },
    removeSpaces(str) {
      return str.replace(/\s+/g, "");
    },
    buildLocalizedLabelArray(label) {
      return [
        {
          "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
          "Label": label,
          "LanguageCode": this.languageCode,
        },
      ];
    },
  },
  async run({ $ }) {
    const solution = await this.microsoft.getSolution({
      $,
      solutionId: this.solutionId,
    });

    const { customizationprefix } = await this.microsoft.getPublisher({
      $,
      publisherId: solution._publisherid_value,
    });

    const attributes = this.parseAttributes();

    const { headers } = await this.microsoft.createCustomEntity({
      $,
      returnFullResponse: true,
      headers: {
        "MSCRM.SolutionUniqueName": solution.uniquename,
      },
      data: {
        "@odata.type": "Microsoft.Dynamics.CRM.EntityMetadata",
        "Attributes": [
          {
            "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
            "DisplayName": {
              "@odata.type": "Microsoft.Dynamics.CRM.Label",
              "LocalizedLabels": this.buildLocalizedLabelArray(this.primaryAttribute),
            },
            "IsPrimaryName": true,
            "SchemaName": `${customizationprefix}_${this.removeSpaces(this.primaryAttribute)}`,
            "MaxLength": 100,
            "FormatName": {
              "Value": "Text",
            },
            "RequiredLevel": {
              "Value": "None",
              "CanBeChanged": true,
              "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings",
            },
          },
          ...attributes,
        ],
        "DisplayName": {
          "@odata.type": "Microsoft.Dynamics.CRM.Label",
          "LocalizedLabels": this.buildLocalizedLabelArray(this.displayName),
        },
        "DisplayCollectionName": {
          "@odata.type": "Microsoft.Dynamics.CRM.Label",
          "LocalizedLabels": this.buildLocalizedLabelArray(pluralize(this.displayName)),
        },
        "Description": this.description && {
          "@odata.type": "Microsoft.Dynamics.CRM.Label",
          "LocalizedLabels": this.buildLocalizedLabelArray(this.description),
        },
        "HasActivities": this.hasActivities,
        "HasNotes": this.hasNotes,
        "SchemaName": `${customizationprefix}_${this.removeSpaces(this.displayName)}`,
        "PrimaryNameAttribute": `${customizationprefix}_${this.removeSpaces(this.primaryAttribute)}`,
        "OwnershipType": "UserOwned",
      },
    });

    const entityId = headers["odata-entityid"].substring(headers["odata-entityid"].lastIndexOf("/") + 1);
    const response = await this.microsoft.getEntity({
      $,
      entityId,
    });

    $.export("$summary", `Successfully created custom entity with ID: ${entityId}`);

    return response;
  },
};
