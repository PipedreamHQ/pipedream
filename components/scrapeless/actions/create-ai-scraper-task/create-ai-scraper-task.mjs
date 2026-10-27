import scrapeless from "../../scrapeless.app.mjs";
import { buildAiScraperRequest } from "../../common/ai-scraper.mjs";
import { AI_SCRAPER_ACTORS } from "../../common/constants.mjs";
import { assertAiScraperCreateResponse } from "../../common/ai-scraper-response.mjs";

export default {
  key: "scrapeless-create-ai-scraper-task",
  name: "Create AI Scraper Task",
  description: "Create one asynchronous AI Scraper task and return its task_id. Use **Get AI Scraper Result** to retrieve the answer. [See the documentation](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/quickstart/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    scrapeless,
    actor: {
      type: "string",
      label: "AI Engine",
      description: "AI engine to run, e.g. `scraper.chatgpt`. Copilot and Grok require a mode in Engine Options.",
      options: AI_SCRAPER_ACTORS,
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Question to send, e.g. `Explain how solar panels generate electricity.` Required with Country unless using AI Mode URL; omit in URL mode.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code, e.g. `US`. Required in prompt mode; omit in AI Mode URL mode. Availability depends on the engine and your account.",
      optional: true,
    },
    aiModeUrl: {
      type: "string",
      label: "AI Mode URL",
      description: "Complete HTTPS Google AI Mode access link, e.g. `https://www.google.com/search?udm=50&q=Best+Google+AI+Mode+Scraper`. See the [official example](https://www.scrapeless.com/en/product/web-scraper/google-ai-mode). Only for Google AI Mode: omit Prompt, Country, and Engine Options. The link is sent unchanged; this action requires HTTPS and no URL credentials.",
      optional: true,
    },
    engineOptions: {
      type: "object",
      label: "Engine Options",
      description: "Engine-specific JSON object, e.g. `{\"web_search\":true,\"shopping\":false}` for ChatGPT. ChatGPT: {\"web_search\":true,\"shopping\":false,\"should_fetch_share_link\":false}; Perplexity: {\"web_search\":true,\"should_fetch_share_link\":false}; Copilot: {\"mode\":\"search\",\"should_fetch_share_link\":false} (mode required: search, smart, chat, reasoning, study); Gemini: {\"shopping\":false}; AI Mode/Overview: {\"shopping\":false,\"location\":\"New York,New York,United States\",\"should_fetch_share_link\":false} (uule may replace location); Grok: {\"mode\":\"MODEL_MODE_AUTO\",\"should_fetch_share_link\":false} (mode required: MODEL_MODE_FAST, MODEL_MODE_EXPERT, MODEL_MODE_AUTO); Alexa: {}. Omit in URL mode. Booleans must be JSON booleans. Unknown fields are rejected. Shopping defaults to false in prompt mode for supported engines; enabling it can increase charges.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Optional HTTPS receiver for the completed result, e.g. `https://example.com/ai-scraper-callback`. URL credentials are not allowed. Configure and secure your own receiver; this does not create a Pipedream trigger.",
      optional: true,
    },
  },
  /**
   * Validate the configured inputs and create exactly one asynchronous task.
   * Return the original API response after validating its task identifier.
   *
   * @param {object} context Pipedream execution context.
   * @param {object} context.$ Step context used to export the task summary.
   * @returns {Promise<object>} Original creation response containing task_id.
   * @throws {Error} If input validation, transport, or response validation fails.
   */
  async run({ $ }) {
    const data = buildAiScraperRequest({
      actor: this.actor,
      prompt: this.prompt,
      country: this.country,
      aiModeUrl: this.aiModeUrl,
      engineOptions: this.engineOptions,
      webhookUrl: this.webhookUrl,
    });
    const response = await this.scrapeless.createAiScraperTask({
      $,
      data,
    });
    assertAiScraperCreateResponse(response);
    $.export("$summary", `Created AI Scraper task ${response.task_id}`);
    return response;
  },
};
