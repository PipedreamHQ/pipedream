import { axios } from "@pipedream/platform";
import { ACTION_PRIORITY } from "./common/constants.mjs";

export default {
  type: "app",
  app: "deepkeep",
  propDefinitions: {
    baseUrl: {
      type: "string",
      label: "Base URL",
      description: "The base URL of your DeepKeep instance, without a trailing slash.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "DeepKeep firewall ID to send as the OpenAI-compatible `model` field. Find this ID in your DeepKeep firewall settings. For example, `fw_abc123`.",
    },
    input: {
      type: "string",
      label: "Input",
      description: "The input text to check before sending it to a model.",
    },
    output: {
      type: "string",
      label: "Output",
      description: "The model output text to check before returning it downstream.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to check with DeepKeep.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Optional request title sent to DeepKeep.",
      optional: true,
    },
    chat: {
      type: "string",
      label: "Chat",
      description: "Optional chat identifier or context sent to DeepKeep.",
      optional: true,
    },
    stopOnBlock: {
      type: "boolean",
      label: "Stop Workflow on Block",
      description: "Stop the workflow when DeepKeep returns a `block` guardrail action.",
      default: true,
    },
  },
  methods: {
    /**
     * Return the configured DeepKeep API key.
     */
    _apiKey() {
      const key = this.$auth?.api_key;
      if (!key) {
        throw new Error("DeepKeep API key is required.");
      }
      return key;
    },
    /**
     * Return a normalized DeepKeep base URL without trailing slashes.
     */
    _baseUrl(baseUrl) {
      baseUrl = baseUrl || this.$auth?.base_url || this.$auth?.baseUrl;
      if (!baseUrl) {
        throw new Error("DeepKeep base URL is required.");
      }
      return baseUrl.replace(/\/+$/, "");
    },
    /**
     * Return headers required for DeepKeep API requests.
     */
    _headers() {
      return {
        "X-API-Key": this._apiKey(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    /**
     * Send an authenticated request to a DeepKeep endpoint.
     */
    _request({
      $ = this,
      path,
      data,
      baseUrl,
      ...args
    }) {
      return axios($, {
        method: "POST",
        ...args,
        url: `${this._baseUrl(baseUrl)}${path}`,
        headers: this._headers(),
        data,
      });
    },
    /**
     * Check model input with DeepKeep pre-model moderation.
     */
    moderatePreModel({
      $, baseUrl, model, input, title = "", chat = "",
    }) {
      return this._request({
        $,
        baseUrl,
        path: "/api/v3/openai/moderations/pre",
        data: {
          model,
          input,
          title,
          chat,
        },
      });
    },
    /**
     * Check model output with DeepKeep post-model moderation.
     */
    moderatePostModel({
      $, baseUrl, model, output, title = "", chat = "",
    }) {
      return this._request({
        $,
        baseUrl,
        path: "/api/v3/openai/moderations/post",
        data: {
          model,
          output,
          title,
          chat,
        },
      });
    },
    /**
     * Return the highest-priority guardrail action from a DeepKeep response.
     */
    highestPriorityAction(result = {}) {
      let selected;
      for (const item of result.verbosity || []) {
        const action = item?.details?.guardrail_action;
        if (
          Object.prototype.hasOwnProperty.call(ACTION_PRIORITY, action)
          && (!selected || ACTION_PRIORITY[action] > ACTION_PRIORITY[selected])
        ) {
          selected = action;
        }
      }
      return selected;
    },
    /**
     * Return the first unsupported guardrail action from a DeepKeep response.
     */
    unsupportedGuardrailAction(result = {}) {
      for (const item of result.verbosity || []) {
        const action = item?.details?.guardrail_action;
        if (
          action
          && !Object.prototype.hasOwnProperty.call(ACTION_PRIORITY, action)
        ) {
          return action;
        }
      }
    },
    /**
     * Return modified content from a DeepKeep response, when present.
     */
    modifiedContent(result = {}) {
      let modifiedContent;
      for (const item of result.verbosity || []) {
        for (const modified of item?.details?.modified || []) {
          if (typeof modified?.content === "string") {
            modifiedContent = modified.content;
          }
        }
      }
      if (modifiedContent !== undefined) {
        return modifiedContent;
      }
      const [
        firstInput,
      ] = result.inputs || [];
      if (firstInput && typeof firstInput.content === "string") {
        return firstInput.content;
      }
    },
    /**
     * Convert a DeepKeep moderation response into action-friendly output.
     */
    normalizeModerationResult(result, originalText) {
      const action = this.highestPriorityAction(result);
      const unsupportedAction = this.unsupportedGuardrailAction(result);
      const blocked = action === "block" || Boolean(!action && unsupportedAction);
      const modifiedContent = this.modifiedContent(result);
      const processedText = [
        "redact",
        "modify",
      ].includes(action) && modifiedContent !== undefined
        ? modifiedContent
        : originalText;

      return {
        allowed: !blocked,
        blocked,
        action: action || unsupportedAction || null,
        flagged: Boolean(result?.flagged),
        processedText,
        modified: processedText !== originalText,
        result,
      };
    },
    /**
     * Return the best available reason for a blocked moderation result.
     */
    blockReason(normalized) {
      for (const item of normalized.result?.verbosity || []) {
        const details = item?.details || {};
        if (details.guardrail_action === "block") {
          return details.message || details.reason || item.message || item.name || "DeepKeep blocked this content.";
        }
      }
      return "DeepKeep blocked this content.";
    },
    /**
     * Return a Pipedream summary for a normalized moderation result.
     */
    summary(normalized, phase) {
      const label = phase === "post"
        ? "Post-model"
        : "Pre-model";
      if (normalized.blocked) {
        return `${label} content blocked by DeepKeep.`;
      }
      if (normalized.modified) {
        return `${label} content modified by DeepKeep.`;
      }
      if (normalized.flagged || normalized.action) {
        return `${label} content flagged by DeepKeep with action ${normalized.action || "unknown"}.`;
      }
      return `${label} content allowed by DeepKeep.`;
    },
  },
};
