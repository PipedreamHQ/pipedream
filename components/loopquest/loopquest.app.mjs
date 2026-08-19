import { axios } from "@pipedream/platform";
import { buildTaskBody } from "./common/body.mjs";

export default {
  type: "app",
  app: "loopquest",
  propDefinitions: {
    content: { type: "string", label: "Content", description: "The AI/automation output a human should review." },
    title: { type: "string", label: "Title", optional: true, description: "Optional heading shown on the review card." },
    module: {
      type: "string",
      label: "Game",
      optional: true,
      default: "swiper",
      description: "How the reviewer sees the item.",
      options: [
        { label: "Swiper — approve or reject", value: "swiper" },
        { label: "Versus — pick the better of two", value: "versus" },
        { label: "Sorter — bucket into categories", value: "sorter" },
        { label: "Detective — spot the problem", value: "detective" },
        { label: "Fixer — correct the output", value: "fixer" },
        { label: "Redact — mask sensitive text", value: "redact" },
        { label: "Grounding — verify a claim against a source", value: "grounding" },
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      optional: true,
      default: "monitor",
      description: "`gate` blocks a downstream step until a human approves (pair with the New Verdict trigger). `monitor` reviews in the background without pausing.",
      options: ["monitor", "gate"],
    },
    claim: { type: "string", label: "Claim", optional: true, description: "Grounding only: the statement to verify." },
    sourceText: { type: "string", label: "Source Text", optional: true, description: "Grounding only: the reference text the claim is checked against." },
    timeoutSeconds: { type: "integer", label: "Timeout (seconds)", optional: true, description: "Gate only: apply the fallback if no one reviews in time (30–2592000)." },
    onTimeout: {
      type: "string",
      label: "On Timeout",
      optional: true,
      description: "Gate only: what to do if the timeout is hit. Defaults to escalate (fail-closed).",
      options: ["escalate", "reject", "approve"],
    },
    source: { type: "string", label: "Source", optional: true, default: "pipedream", description: "A label for where this came from." },
    externalId: { type: "string", label: "External ID", optional: true, description: "Your own id for the item — echoed back in the verdict so you can correlate it." },
    callbackUrl: { type: "string", label: "Callback URL", optional: true, description: "Optional. A single webhook for this task's verdict. Leave blank if you use the New Verdict trigger." },
    reviewsRequired: { type: "integer", label: "Reviewers Required", optional: true, description: "How many people must review before the verdict resolves. Defaults to 1." },
    taskId: { type: "string", label: "Task ID", description: "The task id returned by **Create Review Task** — used by **Get Task Status**." },
  },
  methods: {
    _baseUrl() {
      return (this.$auth.base_url || "https://loopquest.tomphillips.uk").replace(/\/+$/, "");
    },
    _headers() {
      return { authorization: `Bearer ${this.$auth.api_key}`, "content-type": "application/json" };
    },
    // Single place that constructs the axios call — every method delegates here.
    _makeRequest({ $, path, ...opts }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async createTask({ $, props }) {
      return this._makeRequest({ $, method: "POST", path: "/api/v1/tasks", data: buildTaskBody(props) });
    },
    async getTask({ $, taskId }) {
      return this._makeRequest({ $, method: "GET", path: `/api/v1/tasks/${taskId}` });
    },
    // Verdict subscriptions — power the New Verdict source (REST-hook style).
    async subscribeVerdicts({ $, url }) {
      return this._makeRequest({ $, method: "POST", path: "/api/v1/hooks", data: { url } });
    },
    async unsubscribeVerdicts({ $, id }) {
      return this._makeRequest({ $, method: "DELETE", path: `/api/v1/hooks/${id}` });
    },
  },
};
