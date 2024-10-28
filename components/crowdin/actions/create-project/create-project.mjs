import crowdin from "../../crowdin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crowdin-create-project",
  name: "Create Project",
  description: "Creates a new project within Crowdin. [See the documentation](https://support.crowdin.com/developer/api/v2/#/projects-api/create-project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    crowdin,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to be created",
    },
    sourceLanguageId: {
      propDefinition: [
        crowdin,
        "sourceLanguageId",
      ],
    },
    targetLanguageIds: {
      propDefinition: [
        crowdin,
        "targetLanguageIds",
      ],
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "A custom identifier for the project",
      optional: true,
    },
    type: {
      type: "integer",
      label: "Type",
      description: "Defines the project type. To create a file-based project, use 0.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Defines how users can join the project.",
      optional: true,
      options: [
        "open",
        "private",
      ],
      default: "private",
    },
    languageAccessPolicy: {
      type: "string",
      label: "Language Access Policy",
      description: "Defines access to project languages.",
      optional: true,
      options: [
        "open",
        "moderate",
      ],
      default: "open",
    },
    cname: {
      type: "string",
      label: "Custom Domain Name",
      description: "Custom domain name for the project.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Project Description",
      description: "The description of the project.",
      optional: true,
    },
    tagsDetection: {
      type: "integer",
      label: "Tags Detection",
      description: "Values available: 0 - Auto, 1 - Count tags, 2 - Skip tags.",
      optional: true,
      default: 0,
    },
    isMtAllowed: {
      type: "boolean",
      label: "Allow Machine Translation",
      description: "Allows machine translations to be visible for translators.",
      optional: true,
      default: true,
    },
    taskBasedAccessControl: {
      type: "boolean",
      label: "Task Based Access Control",
      description: "Allow project members to work with tasks they're assigned to.",
      optional: true,
      default: false,
    },
    autoSubstitution: {
      type: "boolean",
      label: "Auto Substitution",
      description: "Allows auto-substitution.",
      optional: true,
      default: true,
    },
    autoTranslateDialects: {
      type: "boolean",
      label: "Auto Translate Dialects",
      description: "Automatically fill in regional dialects.",
      optional: true,
      default: false,
    },
    publicDownloads: {
      type: "boolean",
      label: "Public Downloads",
      description: "Allows translators to download source files.",
      optional: true,
      default: true,
    },
    hiddenStringsProofreadersAccess: {
      type: "boolean",
      label: "Hidden Strings Proofreaders Access",
      description: "Allows proofreaders to work with hidden strings.",
      optional: true,
      default: true,
    },
    useGlobalTm: {
      type: "boolean",
      label: "Use Global Translation Memory",
      description: "If true, machine translations from connected MT engines will appear as suggestions.",
      optional: true,
    },
    showTmSuggestionsDialects: {
      type: "boolean",
      label: "Show TM Suggestions for Dialects",
      description: "Show primary language TM suggestions for dialects if there are no dialect-specific ones.",
      optional: true,
      default: true,
    },
    skipUntranslatedStrings: {
      type: "boolean",
      label: "Skip Untranslated Strings",
      description: "Defines whether to skip untranslated strings.",
      optional: true,
    },
    exportApprovedOnly: {
      type: "boolean",
      label: "Export Approved Only",
      description: "Defines whether to export only approved strings.",
      optional: true,
    },
    qaCheckIsActive: {
      type: "boolean",
      label: "QA Check Is Active",
      description: "If true, QA checks are active.",
      optional: true,
      default: true,
    },
    savingsReportSettingsTemplateId: {
      type: "integer",
      label: "Savings Report Settings Template ID",
      description: "Report Settings Templates Identifier.",
      optional: true,
      async options() {
        const templates = await this.crowdin.listSavingsReportSettingsTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
    defaultTmId: {
      type: "integer",
      label: "Default TM ID",
      description: "Translation Memory ID. If omitted, a new translation memory will be created.",
      optional: true,
      async options() {
        const tms = await this.crowdin.listTMs();
        return tms.map((tm) => ({
          label: tm.name,
          value: tm.id,
        }));
      },
    },
    defaultGlossaryId: {
      type: "integer",
      label: "Default Glossary ID",
      description: "Glossary ID. If omitted, a new Glossary will be created.",
      optional: true,
      async options() {
        const glossaries = await this.crowdin.listGlossaries();
        return glossaries.map((glossary) => ({
          label: glossary.name,
          value: glossary.id,
        }));
      },
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      sourceLanguageId: this.sourceLanguageId,
      identifier: this.identifier,
      type: this.type,
      targetLanguageIds: this.targetLanguageIds,
      visibility: this.visibility,
      languageAccessPolicy: this.languageAccessPolicy,
      cname: this.cname,
      description: this.description,
      tagsDetection: this.tagsDetection,
      isMtAllowed: this.isMtAllowed,
      taskBasedAccessControl: this.taskBasedAccessControl,
      autoSubstitution: this.autoSubstitution,
      autoTranslateDialects: this.autoTranslateDialects,
      publicDownloads: this.publicDownloads,
      hiddenStringsProofreadersAccess: this.hiddenStringsProofreadersAccess,
      useGlobalTm: this.useGlobalTm,
      showTmSuggestionsDialects: this.showTmSuggestionsDialects,
      skipUntranslatedStrings: this.skipUntranslatedStrings,
      exportApprovedOnly: this.exportApprovedOnly,
      qaCheckIsActive: this.qaCheckIsActive,
      savingsReportSettingsTemplateId: this.savingsReportSettingsTemplateId,
      defaultTmId: this.defaultTmId,
      defaultGlossaryId: this.defaultGlossaryId,
    };

    const response = await this.crowdin.createProject(data);
    $.export("$summary", `Project "${response.name}" created successfully`);
    return response;
  },
};
