import servicenow from "../../servicenow.app.mjs";
import {
  mapConcurrently, sysIdList,
} from "../../common/utils.mjs";

const MAX_ARTICLES = 50;
const CONCURRENCY = 5;

export default {
  key: "servicenow-check-article-read-access",
  name: "Check Article Read Access",
  description: "Check which knowledge articles the connected user may read, by asking ServiceNow's Knowledge API for each one as that user: it applies the article's and its knowledge base's Can Read and Cannot Read criteria. Use it before quoting, summarizing, or linking articles that came from somewhere other than **Search Knowledge Base** run as this user, such as a copy of the knowledge base indexed by another account, and use only articles whose `can_read` is `true`. Each result has the article `sys_id`, `can_read`, and a `reason`: `readable` when it is `true`; `not_readable` when it is `false` (the user's criteria exclude it, or it is not published or no longer exists). `can_read` is `null` when ServiceNow refused the check (`unreadable`, HTTP 403) or returned an error, an unexpected response, or could not be reached (`check_failed`): treat a `null` article as not readable. The view count is not changed. Requires the Knowledge API (`sn_km_api`) plugin. Example: articles `[\"0b48fd75474321009db4b5b08b9a71c2\"]` return `[{\"sys_id\": \"0b48fd75474321009db4b5b08b9a71c2\", \"can_read\": true, \"reason\": \"readable\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
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
      description: `The \`sys_id\`s of the knowledge articles (\`kb_knowledge\`) to check (1-${MAX_ARTICLES}). **Search Knowledge Base** returns them in \`articles[].id\` with a \`kb_knowledge:\` prefix: pass only the 32-character \`sys_id\` after it (an \`id\` of \`kb_knowledge:3b07857187032100deddb882a2e3ec20\` means a \`sys_id\` of \`3b07857187032100deddb882a2e3ec20\`). Example: \`["0b48fd75474321009db4b5b08b9a71c2"]\`.`,
    },
  },
  methods: {
    async articleAnswer($, sysId) {
      try {
        const response = await this.servicenow.getKnowledgeArticle({
          $,
          articleId: sysId,
        });
        if (response?.sys_id === sysId) {
          return {
            can_read: true,
            reason: "readable",
          };
        }
        // The Knowledge API answers 200 with only an `error_msg` when the user may not read the
        // article or it does not exist.
        if (response && typeof response === "object" && !Array.isArray(response)
          && typeof response.error_msg === "string") {
          return {
            can_read: false,
            reason: "not_readable",
          };
        }
        console.log(`Unexpected Knowledge API response for article ${sysId}`);
        return {
          can_read: null,
          reason: "check_failed",
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
          : error.code ?? "no response"}`);
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
    const articleIds = sysIdList(this.articleSysIds ?? [], "Article Sys IDs", MAX_ARTICLES);

    const result = await mapConcurrently(articleIds, CONCURRENCY, async (id) => ({
      sys_id: id,
      ...(await this.articleAnswer($, id)),
    }));

    const readable = result.filter((row) => row.can_read === true).length;
    const unknown = result.filter((row) => row.can_read === null).length;
    $.export("$summary", `The connected user may read ${readable} of ${result.length} article(s)${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
