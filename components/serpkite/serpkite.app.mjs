import { axios } from "@pipedream/platform";
import { cleanBody } from "./common/utils.mjs";

export default {
  type: "app",
  app: "serpkite",
  propDefinitions: {
    q: {
      type: "string",
      label: "Query",
      description: "The search query, e.g. `best running shoes`.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code used to localize results, e.g. `us` or `gb`.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language code for results, e.g. `en` or `de`.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City-level location, e.g. `Austin, Texas, United States`.",
      optional: true,
    },
    num: {
      type: "integer",
      label: "Number of Results",
      description: "Requested results, from 1 to 100, e.g. `20`. Counts above 10 round up to whole pages and cost more credits ([see pricing](https://serpkite.com/pricing)).",
      min: 1,
      max: 100,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Result page, from 1 to 10, e.g. `2`.",
      min: 1,
      max: 10,
      optional: true,
    },
    time: {
      type: "string",
      label: "Time Window",
      description: "Only return results from the last `hour`, `day`, `week`, `month` or `year`, e.g. `week`.",
      optional: true,
      options: [
        "hour",
        "day",
        "week",
        "month",
        "year",
      ],
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "Only return results from these sources: a domain (subdomains match), a path prefix or a TLD, e.g. `[\"example.com\", \"github.com/org\", \".gov\"]`.",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Drop results from these sources: a domain (subdomains match), a path prefix or a TLD, e.g. `[\"pinterest.com\", \".info\"]`.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A public HTTP or HTTPS URL, e.g. `https://example.com/blog/post`.",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The message to the assistant, up to 4,000 characters, e.g. `What is the best CRM for a five-person startup?`",
    },
    track: {
      type: "string[]",
      label: "Track",
      description: "Brands or domains to check the answer for, up to 20, e.g. `[\"Acme\", \"acme.com\"]`. Each comes back in `mentions`: whether the answer names it and whether a cited source is on it.",
      optional: true,
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The task ID returned by **Start Crawl** or **Start Research** (the `id` field), e.g. `0b9f3c1e-6a2d-4f5b-9c7e-2d4a8b1f6e30`.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A public HTTPS URL that receives a signed event when the task finishes, e.g. `https://example.com/hooks/serpkite`. Defaults to the account webhook set in the SerpKite dashboard.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.serpkite.com/v1";
    },
    _makeRequest({
      $ = this, path, method = "POST", ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    _post({
      path, data, ...opts
    }) {
      return this._makeRequest({
        path,
        data: cleanBody(data),
        ...opts,
      });
    },
    // AI assistants answer in seconds (Brave) to under a minute; the API gives up after 90 s.
    _askAssistant({
      path, ...opts
    }) {
      return this._post({
        path,
        timeout: 120000,
        ...opts,
      });
    },
    searchWeb(opts) {
      return this._post({
        path: "/search",
        ...opts,
      });
    },
    searchNews(opts) {
      return this._post({
        path: "/news",
        ...opts,
      });
    },
    searchImages(opts) {
      return this._post({
        path: "/images",
        ...opts,
      });
    },
    searchVideos(opts) {
      return this._post({
        path: "/videos",
        ...opts,
      });
    },
    searchShopping(opts) {
      return this._post({
        path: "/shopping",
        ...opts,
      });
    },
    searchScholar(opts) {
      return this._post({
        path: "/scholar",
        ...opts,
      });
    },
    searchPatents(opts) {
      return this._post({
        path: "/patents",
        ...opts,
      });
    },
    getAutocomplete(opts) {
      return this._post({
        path: "/autocomplete",
        ...opts,
      });
    },
    searchMaps(opts) {
      return this._post({
        path: "/maps",
        ...opts,
      });
    },
    getPlace(opts) {
      return this._post({
        path: "/place",
        ...opts,
      });
    },
    fetchWebpage(opts) {
      return this._post({
        path: "/webpage",
        ...opts,
      });
    },
    extractPages(opts) {
      return this._post({
        path: "/extract",
        timeout: 120000,
        ...opts,
      });
    },
    mapSite(opts) {
      return this._post({
        path: "/map",
        ...opts,
      });
    },
    answerQuestion(opts) {
      return this._post({
        path: "/answer",
        timeout: 120000,
        ...opts,
      });
    },
    askChatgpt(opts) {
      return this._askAssistant({
        path: "/chatgpt",
        ...opts,
      });
    },
    askGemini(opts) {
      return this._askAssistant({
        path: "/gemini",
        ...opts,
      });
    },
    askCopilot(opts) {
      return this._askAssistant({
        path: "/copilot",
        ...opts,
      });
    },
    askAiMode(opts) {
      return this._askAssistant({
        path: "/ai_mode",
        ...opts,
      });
    },
    askBraveAi(opts) {
      return this._askAssistant({
        path: "/brave_ai",
        ...opts,
      });
    },
    startCrawl(opts) {
      return this._post({
        path: "/crawl",
        ...opts,
      });
    },
    getCrawl({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/crawl/${encodeURIComponent(taskId)}`,
        ...opts,
      });
    },
    startResearch(opts) {
      return this._post({
        path: "/research",
        ...opts,
      });
    },
    getResearch({
      taskId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/research/${encodeURIComponent(taskId)}`,
        ...opts,
      });
    },
  },
};
