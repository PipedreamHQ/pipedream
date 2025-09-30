import webscrapingAI from "../../webscraping_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "webscraping_ai-ask-question",
  name: "Ask Question about Webpage",
  description: "Gets an answer to a question about a given webpage. [See the documentation](https://webscraping.ai/docs#tag/AI/operation/getQuestion)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    webscrapingAI,
    targetUrl: {
      propDefinition: [
        webscrapingAI,
        "targetUrl",
      ],
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask about the given webpage. E.g. `What is the summary of this page content?`",
    },
    headers: {
      propDefinition: [
        webscrapingAI,
        "headers",
      ],
    },
    timeout: {
      propDefinition: [
        webscrapingAI,
        "timeout",
      ],
    },
    js: {
      propDefinition: [
        webscrapingAI,
        "js",
      ],
    },
    jsTimeout: {
      propDefinition: [
        webscrapingAI,
        "jsTimeout",
      ],
    },
    waitFor: {
      propDefinition: [
        webscrapingAI,
        "waitFor",
      ],
    },
    proxy: {
      propDefinition: [
        webscrapingAI,
        "proxy",
      ],
    },
    country: {
      propDefinition: [
        webscrapingAI,
        "country",
      ],
    },
    customProxy: {
      propDefinition: [
        webscrapingAI,
        "customProxy",
      ],
    },
    device: {
      propDefinition: [
        webscrapingAI,
        "device",
      ],
    },
    errorOn404: {
      propDefinition: [
        webscrapingAI,
        "errorOn404",
      ],
    },
    errorOnRedirect: {
      propDefinition: [
        webscrapingAI,
        "errorOnRedirect",
      ],
    },
    jsScript: {
      propDefinition: [
        webscrapingAI,
        "jsScript",
      ],
    },
    format: {
      propDefinition: [
        webscrapingAI,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.webscrapingAI.getAnswerToQuestion({
      $,
      params: {
        url: this.targetUrl,
        question: this.question,
        headers: utils.stringifyHeaders(this.headers),
        timeout: this.timeout,
        js: this.js,
        js_timeout: this.jsTimeout,
        wait_for: this.waitFor,
        proxy: this.proxy,
        country: this.country,
        custom_proxy: this.customProxy,
        device: this.device,
        error_on_404: this.errorOn404,
        error_on_redirect: this.errorOnRedirect,
        js_script: this.jsScript,
        format: this.format,
      },
    });
    $.export("$summary", "Successfully retrieved answer to question");
    return response;
  },
};
