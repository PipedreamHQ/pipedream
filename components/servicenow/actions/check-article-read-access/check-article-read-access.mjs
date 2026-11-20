import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

const MAX_ARTICLES = 50;
const CONCURRENCY = 5;
const SYS_ID = /^[0-9a-f]{32}$/;

export default {
  key: "servicenow-check-article-read-access",
  name: "Check Article Read Access",
  description: "Check which knowledge articles the connected user may read, by asking ServiceNow's Knowledge API for each one as that user: it applies the article's and its knowledge base's Can Read and Cannot Read criteria. Use it before quoting, summarizing, or linking articles that came from somewhere other than **Search Knowledge Base** run as this user, such as a copy of the knowledge base indexed by another account, and use only articles whose `can_read` is `true`. Each result has the article `sys_id`, `can_read`, and a `reason`: `readable` when it is `true`; `not_readable` when it is `false` (the user's criteria exclude it, or it is not published or no longer exists: ServiceNow answers the same for all of these). `can_read` is `null` when ServiceNow refused the check (`unreadable`, HTTP 403) or returned an error, an unexpected response, or could not be reached (`check_failed`): treat a `null` article as not readable. The view count is not changed. Requires the Knowledge API (`sn_km_api`) plugin. Example: articles `[\"0b48fd75474321009db4b5b08b9a71c2\"]` return `[{\"sys_id\": \"0b48fd75474321009db4b5b08b9a71c2\", \"can_read\": true, \"reason\": \"readable\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    articleSysIds: {
      type: "string[]",
      label: "Article Sys IDs",
      description: `The \`sys_id\`s of the knowledge articles (\`kb_knowledge\`) to check (1-${MAX_ARTICLES}). Example: \`["0b48fd75474321009db4b5b08b9a71c2"]\`.`,
    },
  },
  methods: {
    sysIds(value) {
      const ids = [
        ...new Set((Array.isArray(value)
          ? value
          : [
            value,
          ]).map((id) => String(id ?? "").trim()).filter(Boolean)),
      ];
      if (!ids.length || ids.length > MAX_ARTICLES) {
        throw new ConfigurationError(`\`Article Sys IDs\` must list 1-${MAX_ARTICLES} \`sys_id\`s. Got ${ids.length}.`);
      }
      const invalid = ids.find((id) => !SYS_ID.test(id));
      if (invalid) {
        throw new ConfigurationError(`\`Article Sys IDs\` must hold 32-character ServiceNow \`sys_id\`s. Got: \`${invalid}\`.`);
      }
      return ids;
    },
    async articleAnswer($, sysId) {
      try {
        const response = await this.servicenow.getKnowledgeArticle({
          $,
          articleId: sysId,
          params: {
            fields: "sys_id",
          },
        });
        if (response !== null && typeof response !== "object") {
          console.log(`Unexpected Knowledge API response for article ${sysId}`);
          return {
            can_read: null,
            reason: "check_failed",
          };
        }
        // The Knowledge API answers 200 with an empty article when the user may not read it.
        const readable = response?.sys_id === sysId;
        return {
          can_read: readable,
          reason: readable
            ? "readable"
            : "not_readable",
        };
      } catch (error) {
        const status = error?.response?.status;
        // A broken connection (401) or a bug fails the whole action; any other request error is
        // that article's answer.
        if (!error?.isAxiosError || status === 401) {
          throw error;
        }
        console.log(`Article read check failed for ${sysId}: ${status
          ? `HTTP ${status}`
          : error.code}`);
        return {
          can_read: null,
          reason: status === 403
            ? "unreadable"
            : "check_failed",
        };
      }
    },
  },
  async run({ $ }) {
    const articleIds = this.sysIds(this.articleSysIds ?? []);

    const result = new Array(articleIds.length);
    let next = 0;
    const worker = async () => {
      while (next < articleIds.length) {
        const index = next++;
        result[index] = {
          sys_id: articleIds[index],
          ...(await this.articleAnswer($, articleIds[index])),
        };
      }
    };
    await Promise.all(Array.from({
      length: Math.min(CONCURRENCY, articleIds.length),
    }, worker));

    const readable = result.filter((row) => row.can_read === true).length;
    const unknown = result.filter((row) => row.can_read === null).length;
    $.export("$summary", `The connected user may read ${readable} of ${result.length} article(s)${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
