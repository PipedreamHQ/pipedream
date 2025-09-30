import { ConfigurationError } from "@pipedream/platform";
import {
  LANGUAGE_ACCESS_POLICY_OPTIONS,
  TAGS_DETECTION_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import crowdin from "../../crowdin.app.mjs";

export default {
  key: "crowdin-create-project",
  name: "Create Project",
  description: "Creates a new project within Crowdin. [See the documentation](https://support.crowdin.com/developer/api/v2/#/projects-api/create-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "sourceLanguageId",
      ],
      type: "string[]",
      label: "Target Language IDs",
      description: "Array of target language IDs",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "A custom identifier for the project",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Defines how users can join the project.",
      options: VISIBILITY_OPTIONS,
      optional: true,
    },
    languageAccessPolicy: {
      type: "string",
      label: "Language Access Policy",
      description: "Defines access to project languages.",
      optional: true,
      options: LANGUAGE_ACCESS_POLICY_OPTIONS,
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
      type: "string",
      label: "Tags Detection",
      description: "The type of the tags detection.",
      options: TAGS_DETECTION_OPTIONS,
      optional: true,
    },
    isMtAllowed: {
      type: "boolean",
      label: "Allow Machine Translation",
      description: "Allows machine translations to be visible for translators. Default is **true**.",
      optional: true,
    },
    taskBasedAccessControl: {
      type: "boolean",
      label: "Task Based Access Control",
      description: "Allow project members to work with tasks they're assigned to. Default is **false**.",
      optional: true,
      default: false,
    },
    autoSubstitution: {
      type: "boolean",
      label: "Auto Substitution",
      description: "Allows auto-substitution. Default is **true**.",
      optional: true,
      default: true,
    },
    autoTranslateDialects: {
      type: "boolean",
      label: "Auto Translate Dialects",
      description: "Automatically fill in regional dialects. Default is **false**.",
      optional: true,
    },
    publicDownloads: {
      type: "boolean",
      label: "Public Downloads",
      description: "Allows translators to download source files. Default is **true**.",
      optional: true,
    },
    hiddenStringsProofreadersAccess: {
      type: "boolean",
      label: "Hidden Strings Proofreaders Access",
      description: "Allows proofreaders to work with hidden strings. Default is **true**.",
      optional: true,
      default: true,
    },
    useGlobalTm: {
      type: "boolean",
      label: "Use Global Translation Memory",
      description: "If true, machine translations from connected MT engines will appear as suggestions. Default is **true**.",
      optional: true,
    },
    showTmSuggestionsDialects: {
      type: "boolean",
      label: "Show TM Suggestions for Dialects",
      description: "Show primary language TM suggestions for dialects if there are no dialect-specific ones. Default is **true**.",
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
      description: "If true, QA checks are active. Default is **true**.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Defines the project type. To create a file-based project, use 0.",
      options: [
        "0",
        "1",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const {
        crowdin,
        type,
        targetLanguageIds,
        tagsDetection,
        ...data
      } = this;

      const response = await crowdin.createProject({
        $,
        data: {
          ...data,
          type: parseInt(type),
          targetLanguageIds: parseObject(targetLanguageIds),
          tagsDetection: parseInt(tagsDetection),
        },
      });
      $.export("$summary", `Project created successfully with Id: ${response.data.id}`);
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.errors[0]?.error?.errors[0]?.message);
    }
  },
};
