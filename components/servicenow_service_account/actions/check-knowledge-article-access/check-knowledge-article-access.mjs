import servicenow from "../../servicenow_service_account.app.mjs";
import { referenceId } from "../../common/utils.mjs";
import {
  anyIs,
  assertSysIds,
  evaluateList,
  isBoolean,
  personRefusal,
  readByIds,
  readCriteria,
  readFailure,
  readLinks,
  readPerson,
  readProperties,
  splitIds,
  undecidedReason,
} from "../../common/user-criteria.mjs";

const MAX_ARTICLES = 50;
const BLOCK_WITHOUT_CRITERIA = "glide.knowman.block_access_with_no_user_criteria";
const APPLY_READ_CRITERIA = "glide.knowman.apply_article_read_criteria";
const ROLE_BASED_SECURITY = "glide.knowman.search.apply_role_based_security";
// Roles that read every article of an active, global knowledge base, before any user criteria.
const ADMIN_ROLES = [
  "admin",
  "knowledge_admin",
];
// Article states a reader may see.
const READABLE_STATES = [
  "published",
  "outdated",
];

export default {
  key: "servicenow_service_account-check-knowledge-article-access",
  name: "Check Knowledge Article Access",
  description: "Check which knowledge articles a given ServiceNow user may read, following ServiceNow's own article read check: knowledge admins, the knowledge base owner, and its managers read without criteria; anyone else needs the read criteria of the knowledge base (Can Read and Cannot Read) and of the article to allow it, plus the article's roles, or must be able to contribute to the knowledge base (Can Contribute and Cannot Contribute). **Search Knowledge Base** and **Get Article** run as the integration user, so they return articles the person you act for may not be allowed to read: run this with that person's `sys_id` from **Find Users** (never the `sys_id` from **Get Current User**) and the article `sys_id`s before quoting, summarizing, or linking any of them, and use only articles whose `can_read` is `true`. Each result has the article `sys_id`, its `knowledge_base`, `can_read`, and a `reason`: `can_read`, `can_contribute`, `knowledge_base_manager` (the owner or a manager), `open_to_all`, or `admin` (the person holds `admin` or `knowledge_admin`, and the knowledge base is not in a scoped application) when it is `true`; `cannot_read`, `not_in_can_read`, `no_read_criteria` (the knowledge base has no Can Read criteria and the instance blocks access then), `article_cannot_read`, `article_not_in_can_read`, `article_roles` (the person holds none of the article's roles), `article_not_published` (neither published nor outdated, or inactive), `article_expired` (it has no Valid to date, or that date is before today's date in UTC, as ServiceNow's article page checks it), `article_not_found`, `knowledge_base_inactive`, `knowledge_base_not_found`, `user_not_found`, `user_inactive`, or `user_locked_out` when it is `false`. `can_read` is `null` when the answer cannot be determined for that person, with reason `unresolved_script` (a scripted criterion, which ServiceNow runs in the integration user's session), `unreadable` (the integration user cannot read a table, a criterion, or a field of the article, knowledge base, link, user, or criterion), or `check_failed` (ServiceNow returned an error or could not be reached): treat a `null` article as not readable. The integration user must be able to read every row of the tables below: a row it cannot read looks the same as no row, and a hidden article, knowledge base, or user comes back `article_not_found`, `knowledge_base_not_found`, or `user_not_found`. Criteria are read from `user_criteria`, `kb_uc_can_read_mtom`, `kb_uc_cannot_read_mtom`, `kb_uc_can_contribute_mtom`, `kb_uc_cannot_contribute_mtom`, and the article's own Can Read and Cannot Read lists, with the `glide.knowman.block_access_with_no_user_criteria`, `glide.knowman.apply_article_read_criteria`, and `glide.knowman.search.apply_role_based_security` properties (each read as `true` when hidden or missing); an empty Can Contribute list grants nobody. The person's roles, groups, company, department, and location come from `sys_user`, `sys_user_has_role`, and `sys_user_grmember`. Example: user `62826bf03710200044e0bfc8bcbe5df1` and articles `[\"0b48fd75474321009db4b5b08b9a71c2\"]` return `[{\"sys_id\": \"0b48fd75474321009db4b5b08b9a71c2\", \"knowledge_base\": \"a7e8a78bff0221009b20ffffffffff17\", \"can_read\": true, \"reason\": \"can_read\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/servicenow-platform/knowledge-management/user-access-knowledge.html)",
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
    userSysId: {
      type: "string",
      label: "User Sys ID",
      description: "The `sys_id` of the person you act for, from **Find Users** (`sys_user`). Example: `62826bf03710200044e0bfc8bcbe5df1`.",
    },
    articleSysIds: {
      type: "string[]",
      label: "Article Sys IDs",
      description: `The \`sys_id\`s of the knowledge articles (\`kb_knowledge\`) to check (1-${MAX_ARTICLES}), from **Search Knowledge Base**. Example: \`["0b48fd75474321009db4b5b08b9a71c2"]\`.`,
    },
  },
  methods: {
    // The answer the article's own record and the person settle before any knowledge base is read,
    // or `null` when its knowledge base decides. `today` is the date in UTC, `YYYY-MM-DD`.
    articleGate(article, refused, today) {
      if (!article) {
        return {
          allowed: false,
          reason: "article_not_found",
        };
      }
      if (!article.workflow_state || !isBoolean(article.active) || [
        "valid_to",
        "kb_knowledge_base",
        "can_read_user_criteria",
        "cannot_read_user_criteria",
        "roles",
      ].some((field) => article[field] === undefined)) {
        return {
          allowed: null,
          reason: "unreadable",
        };
      }
      if (!READABLE_STATES.includes(article.workflow_state) || article.active === "false") {
        return {
          allowed: false,
          reason: "article_not_published",
        };
      }
      // ServiceNow's article page (KBViewModel.isArticleExpired) treats a blank Valid to, or one
      // before today's UTC date, as expired.
      if (!article.valid_to || article.valid_to < today) {
        return {
          allowed: false,
          reason: "article_expired",
        };
      }
      return refused;
    },
    // The knowledge base's and the article's read criteria together: `true` only when both allow.
    readCriteriaVerdict(article, lists, criteriaById, person, settings) {
      const decide = (ids) => evaluateList(ids, criteriaById, person.facts);
      const cannotRead = decide(lists.cannotRead);
      const articleCannotRead = decide(splitIds(article.cannot_read_user_criteria));
      if (anyIs(cannotRead, true)) {
        return {
          allowed: false,
          reason: "cannot_read",
        };
      }
      if (anyIs(articleCannotRead, true)) {
        return {
          allowed: false,
          reason: "article_cannot_read",
        };
      }
      const listVerdict = (results, granted, denied) => {
        if (anyIs(results, true)) {
          return {
            allowed: true,
            reason: granted,
          };
        }
        return results.every((result) => result.value === false)
          ? {
            allowed: false,
            reason: denied,
          }
          : {
            allowed: null,
            reason: undecidedReason(results),
          };
      };
      const canRead = decide(lists.canRead);
      const baseRead = canRead.length
        ? listVerdict(canRead, "can_read", "not_in_can_read")
        : {
          allowed: !settings.blockWithoutCriteria,
          reason: settings.blockWithoutCriteria
            ? "no_read_criteria"
            : "open_to_all",
        };
      const articleCanRead = decide(splitIds(article.can_read_user_criteria));
      const articleRead = articleCanRead.length
        ? listVerdict(articleCanRead, baseRead.reason, "article_not_in_can_read")
        : baseRead;
      const exclusions = [
        ...cannotRead,
        ...articleCannotRead,
      ];
      return [
        baseRead,
        articleRead,
      ].find((verdict) => verdict.allowed === false)
        ?? (anyIs(exclusions, null)
          ? {
            allowed: null,
            reason: undecidedReason(exclusions),
          }
          : null)
        ?? [
          baseRead,
          articleRead,
        ].find((verdict) => verdict.allowed === null)
        ?? baseRead;
    },
    // Whether the knowledge base's contribute criteria let the person contribute, and so read.
    // ponytail: an empty Can Contribute list grants nobody; ServiceNow's own default for it is in
    // its native knowledge helper, so it is not modeled here.
    contributeVerdict(lists, criteriaById, person) {
      const cannot = evaluateList(lists.cannotContribute, criteriaById, person.facts);
      if (anyIs(cannot, true)) {
        return {
          allowed: false,
        };
      }
      const can = evaluateList(lists.canContribute, criteriaById, person.facts);
      if (anyIs(can, true) && !anyIs(cannot, null)) {
        return {
          allowed: true,
          reason: "can_contribute",
        };
      }
      const undecided = [
        ...can,
        ...(anyIs(can, true)
          ? cannot
          : []),
      ].filter((result) => result.value === null);
      return undecided.length
        ? {
          allowed: null,
          reason: undecidedReason(undecided),
        }
        : {
          allowed: false,
        };
    },
    // Whether the person may read the article, in the order of ServiceNow's KBKnowledge.canRead:
    // admins, the owner, and managers; then the read criteria with the article's roles; then
    // contributors, unless `glide.knowman.apply_article_read_criteria` is true.
    articleVerdict(article, base, lists, criteriaById, person, settings) {
      if (!base) {
        return {
          allowed: false,
          reason: "knowledge_base_not_found",
        };
      }
      if (!isBoolean(base.active) || lists.unreadable) {
        return {
          allowed: null,
          reason: "unreadable",
        };
      }
      if (base.active === "false") {
        return {
          allowed: false,
          reason: "knowledge_base_inactive",
        };
      }
      // A knowledge base in a scoped application can restrict even admins, so the bypass applies
      // only to a global one; a hidden application gets none.
      const scope = base.application;
      if (ADMIN_ROLES.some((role) => person.roleNames.has(role))
        && (scope === "" || scope === "global")) {
        return {
          allowed: true,
          reason: "admin",
        };
      }
      const userSysId = [
        ...person.facts.user,
      ][0];
      if (referenceId(base.owner) === userSysId || splitIds(base.kb_managers).includes(userSysId)) {
        return {
          allowed: true,
          reason: "knowledge_base_manager",
        };
      }
      const read = this.readCriteriaVerdict(article, lists, criteriaById, person, settings);
      const roles = splitIds(article.roles);
      const rolesAllow = !settings.applyRoles || !roles.length || person.roleNames.has("admin")
        || roles.some((role) => person.roleNames.has(role));
      if (read.allowed === true) {
        return rolesAllow
          ? read
          : {
            allowed: false,
            reason: "article_roles",
          };
      }
      const contribute = settings.applyReadCriteria
        ? {
          allowed: false,
        }
        : this.contributeVerdict(lists, criteriaById, person);
      if (read.allowed === false) {
        return contribute.allowed === false
          ? read
          : contribute;
      }
      // The read criteria are undecided: answer only when both of their outcomes agree.
      if (rolesAllow && contribute.allowed === true) {
        return contribute;
      }
      if (!rolesAllow && contribute.allowed === false) {
        return {
          allowed: false,
          reason: "article_roles",
        };
      }
      return read;
    },
    // `{ articlesById, verdicts }`, where `verdicts` maps each article sys_id to its verdict for
    // the person; rejects when a read of the person or the articles fails.
    async articleVerdicts($, userSysId, articleIds) {
      const app = this.servicenow;
      const [
        properties,
        person,
        articles,
      ] = await Promise.all([
        readProperties(app, $, [
          BLOCK_WITHOUT_CRITERIA,
          APPLY_READ_CRITERIA,
          ROLE_BASED_SECURITY,
        ]),
        readPerson(app, $, userSysId),
        readByIds(app, $, "kb_knowledge", "sys_id", articleIds, [
          "sys_id",
          "active",
          "workflow_state",
          "valid_to",
          "kb_knowledge_base",
          "can_read_user_criteria",
          "cannot_read_user_criteria",
          "roles",
        ]),
      ]);
      const articlesById = new Map(articles.map((row) => [
        row.sys_id,
        row,
      ]));
      const today = new Date().toISOString()
        .slice(0, 10);
      const refused = personRefusal(person);
      const verdicts = new Map(articleIds.map((sysId) => [
        sysId,
        this.articleGate(articlesById.get(sysId), refused, today),
      ]));
      // Only the articles left undecided need their knowledge bases, links, and criteria read; a
      // failed read there leaves the settled answers standing.
      const pending = articles.filter((row) => !verdicts.get(row.sys_id));
      try {
        const decided = await this.baseVerdicts($, pending, person, properties);
        decided.forEach((verdict, sysId) => verdicts.set(sysId, verdict));
      } catch (error) {
        const failed = readFailure(error);
        pending.forEach((row) => verdicts.set(row.sys_id, failed));
      }
      return {
        articlesById,
        verdicts,
      };
    },
    // Each pending article's verdict from its knowledge base and its own lists; rejects when a
    // read fails.
    async baseVerdicts($, pending, person, properties) {
      const app = this.servicenow;
      const baseIds = [
        ...new Set(pending.map((row) => referenceId(row.kb_knowledge_base)).filter(Boolean)),
      ];
      const [
        bases,
        canRead,
        cannotRead,
        canContribute,
        cannotContribute,
      ] = await Promise.all([
        readByIds(app, $, "kb_knowledge_base", "sys_id", baseIds, [
          "sys_id",
          "active",
          "application",
          "owner",
          "kb_managers",
        ]),
        readLinks(app, $, "kb_uc_can_read_mtom", "kb_knowledge_base", baseIds),
        readLinks(app, $, "kb_uc_cannot_read_mtom", "kb_knowledge_base", baseIds),
        readLinks(app, $, "kb_uc_can_contribute_mtom", "kb_knowledge_base", baseIds),
        readLinks(app, $, "kb_uc_cannot_contribute_mtom", "kb_knowledge_base", baseIds),
      ]);
      const basesById = new Map(bases.map((row) => [
        row.sys_id,
        row,
      ]));
      const criteriaById = await readCriteria(app, $, [
        ...[
          canRead,
          cannotRead,
          canContribute,
          cannotContribute,
        ].flatMap(({ byParent }) => [
          ...byParent.values(),
        ].flat()),
        ...pending.flatMap((row) => [
          ...splitIds(row.can_read_user_criteria),
          ...splitIds(row.cannot_read_user_criteria),
        ]),
      ]);
      // Each property is read the restrictive way when it is hidden or missing.
      const settings = {
        // ServiceNow blocks a knowledge base without Can Read criteria when this is true.
        blockWithoutCriteria: properties.get(BLOCK_WITHOUT_CRITERIA) !== "false",
        // When true, contributing grants no read access of its own.
        applyReadCriteria: properties.get(APPLY_READ_CRITERIA) !== "false",
        // When true, an article with roles is read only by holders of one of them.
        applyRoles: [
          undefined,
          "true",
        ].includes(properties.get(ROLE_BASED_SECURITY)),
      };
      const decided = new Map();
      for (const article of pending) {
        const baseId = referenceId(article.kb_knowledge_base);
        const lists = {
          canRead: canRead.byParent.get(baseId) ?? [],
          cannotRead: cannotRead.byParent.get(baseId) ?? [],
          canContribute: canContribute.byParent.get(baseId) ?? [],
          cannotContribute: cannotContribute.byParent.get(baseId) ?? [],
          unreadable: [
            canRead,
            cannotRead,
            canContribute,
            cannotContribute,
          ].some(({ unreadable }) => unreadable.has(baseId)),
        };
        decided.set(article.sys_id, this.articleVerdict(
          article, basesById.get(baseId), lists, criteriaById, person, settings,
        ));
      }
      return decided;
    },
  },
  async run({ $ }) {
    const userSysId = assertSysIds(this.userSysId, "User Sys ID", 1)[0];
    const articleIds = assertSysIds(this.articleSysIds ?? [], "Article Sys IDs", MAX_ARTICLES);

    let read;
    try {
      read = await this.articleVerdicts($, userSysId, articleIds);
    } catch (error) {
      const failed = readFailure(error);
      read = {
        articlesById: new Map(),
        verdicts: new Map(articleIds.map((sysId) => [
          sysId,
          failed,
        ])),
      };
    }
    const result = articleIds.map((sysId) => {
      const verdict = read.verdicts.get(sysId);
      return {
        sys_id: sysId,
        knowledge_base: referenceId(read.articlesById.get(sysId)?.kb_knowledge_base),
        can_read: verdict.allowed,
        reason: verdict.reason,
      };
    });

    const readable = result.filter((row) => row.can_read === true).length;
    const unknown = result.filter((row) => row.can_read === null).length;
    $.export("$summary", `User ${userSysId} may read ${readable} of ${result.length} knowledge article(s)${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
