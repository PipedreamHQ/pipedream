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
// Roles that read every article of an active knowledge base, before any user criteria.
const ADMIN_ROLES = [
  "admin",
  "knowledge_admin",
];
const HOUR = 60 * 60 * 1000;

export default {
  key: "servicenow_service_account-check-knowledge-article-access",
  name: "Check Knowledge Article Access",
  description: "Check which knowledge articles a given ServiceNow user may read, by evaluating the user criteria of each article's knowledge base (Can Read, Cannot Read, Can Contribute, and Cannot Contribute) and of the article itself. **Search Knowledge Base** and **Get Article** run as the integration user, so they return articles the person you act for may not be allowed to read: run this with that person's `sys_id` from **Find Users** (never the `sys_id` from **Get Current User**) and the article `sys_id`s before quoting, summarizing, or linking any of them, and use only articles whose `can_read` is `true`. Each result has the article `sys_id`, its `knowledge_base`, `can_read`, and a `reason`: `can_read`, `can_contribute`, `knowledge_base_manager`, `open_to_all`, or `admin` (the person holds `admin` or `knowledge_admin`) when it is `true`; `cannot_read`, `not_in_can_read`, `no_read_criteria` (the knowledge base has no Can Read criteria and the instance blocks access then), `article_cannot_read`, `article_not_in_can_read`, `article_roles`, `article_not_published`, `article_expired` (it has no Valid to date, or that date has passed; dates are compared at UTC+14, so this can come a day early), `article_not_found`, `knowledge_base_inactive`, `knowledge_base_not_found`, `user_not_found`, `user_inactive`, or `user_locked_out` when it is `false`. `can_read` is `null` when the answer cannot be determined for that person, with reason `unresolved_script` (a scripted criterion, which ServiceNow runs in the integration user's session, or a match-all criterion with a multi-value field), `unreadable` (the integration user cannot read a table, a criterion, or a field of the article, knowledge base, link, or user), or `check_failed` (ServiceNow returned an error or could not be reached): treat a `null` article as not readable. The integration user must be able to read every row of the tables below: a row it cannot read looks the same as no row, and a hidden article, knowledge base, or user comes back `article_not_found`, `knowledge_base_not_found`, or `user_not_found`. Criteria are read from `user_criteria`, `kb_uc_can_read_mtom`, `kb_uc_cannot_read_mtom`, `kb_uc_can_contribute_mtom`, `kb_uc_cannot_contribute_mtom`, and the article's own Can Read and Cannot Read lists, with the `glide.knowman.block_access_with_no_user_criteria` and `glide.knowman.apply_article_read_criteria` properties (read as `true` when hidden); the person's roles, groups, company, department, and location from `sys_user`, `sys_user_has_role`, and `sys_user_grmember`. Example: user `62826bf03710200044e0bfc8bcbe5df1` and articles `[\"0b48fd75474321009db4b5b08b9a71c2\"]` return `[{\"sys_id\": \"0b48fd75474321009db4b5b08b9a71c2\", \"knowledge_base\": \"a7e8a78bff0221009b20ffffffffff17\", \"can_read\": true, \"reason\": \"can_read\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/servicenow-platform/knowledge-management/user-access-knowledge.html)",
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
    // or `null` when its knowledge base decides.
    articleGate(article, refused, today) {
      if (!article) {
        return {
          allowed: false,
          reason: "article_not_found",
        };
      }
      if (!article.workflow_state || !isBoolean(article.active) || [
        "valid_to",
        "can_read_user_criteria",
        "cannot_read_user_criteria",
        "roles",
      ].some((field) => article[field] === undefined)) {
        return {
          allowed: null,
          reason: "unreadable",
        };
      }
      if (article.workflow_state !== "published" || article.active === "false") {
        return {
          allowed: false,
          reason: "article_not_published",
        };
      }
      // ServiceNow shows readers only articles whose Valid to is today or later; a blank one counts
      // as expired.
      if (!article.valid_to || article.valid_to < today) {
        return {
          allowed: false,
          reason: "article_expired",
        };
      }
      return refused;
    },
    // Whether the person may read the knowledge base's articles, before any article-level rule.
    knowledgeBaseVerdict(base, lists, criteriaById, person, settings, isAdmin) {
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
      if (isAdmin) {
        return {
          allowed: true,
          reason: "admin",
        };
      }
      const cannotRead = evaluateList(lists.cannotRead, criteriaById, person.facts);
      if (anyIs(cannotRead, true)) {
        return {
          allowed: false,
          reason: "cannot_read",
        };
      }
      if (anyIs(cannotRead, null)) {
        return {
          allowed: null,
          reason: undecidedReason(cannotRead),
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
      const canRead = evaluateList(lists.canRead, criteriaById, person.facts);
      if (anyIs(canRead, true)) {
        return {
          allowed: true,
          reason: "can_read",
        };
      }
      // Contributors can read too, unless the instance applies the read criteria to them or
      // Cannot Contribute excludes them.
      const cannotContribute = evaluateList(lists.cannotContribute, criteriaById, person.facts);
      const canContribute = settings.applyReadCriteria || anyIs(cannotContribute, true)
        ? []
        : evaluateList(lists.canContribute, criteriaById, person.facts);
      if (anyIs(canContribute, true) && !anyIs(cannotContribute, null)) {
        return {
          allowed: true,
          reason: "can_contribute",
        };
      }
      const contributeMayGrant = canContribute.some((result) => result.value !== false);
      const undecided = [
        ...canRead,
        ...canContribute,
        ...(contributeMayGrant
          ? cannotContribute
          : []),
      ].filter((result) => result.value === null);
      if (undecided.length) {
        return {
          allowed: null,
          reason: undecidedReason(undecided),
        };
      }
      if (canRead.length) {
        return {
          allowed: false,
          reason: "not_in_can_read",
        };
      }
      return settings.blockWithoutCriteria
        ? {
          allowed: false,
          reason: "no_read_criteria",
        }
        : {
          allowed: true,
          reason: "open_to_all",
        };
    },
    // The article's own Can Read and Cannot Read lists and roles, once its base allows it.
    articleVerdict(article, criteriaById, person) {
      const decide = (field) => evaluateList(splitIds(article[field]), criteriaById, person.facts);
      const cannotRead = decide("cannot_read_user_criteria");
      if (anyIs(cannotRead, true)) {
        return {
          allowed: false,
          reason: "article_cannot_read",
        };
      }
      const canRead = decide("can_read_user_criteria");
      if (canRead.length && canRead.every((result) => result.value === false)) {
        return {
          allowed: false,
          reason: "article_not_in_can_read",
        };
      }
      const roles = splitIds(article.roles);
      if (roles.length && !roles.some((role) => person.roleNames.has(role))) {
        return {
          allowed: false,
          reason: "article_roles",
        };
      }
      const undecided = [
        ...cannotRead,
        ...(anyIs(canRead, true)
          ? []
          : canRead),
      ].filter((result) => result.value === null);
      return undecided.length
        ? {
          allowed: null,
          reason: undecidedReason(undecided),
        }
        : null;
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
      // Today where the date is furthest ahead (UTC+14), so an article is never read past its
      // Valid to in the instance's time zone.
      // ponytail: refuses an article up to a day early west of UTC+14; read the time zone if that
      // matters.
      const today = new Date(Date.now() + 14 * HOUR).toISOString()
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
      // Each property is read the restrictive way when the integration user cannot read it.
      const settings = {
        // ServiceNow blocks a knowledge base without Can Read criteria unless this is false.
        blockWithoutCriteria: properties.get(BLOCK_WITHOUT_CRITERIA) !== "false",
        // When true, contributing grants no read access of its own.
        applyReadCriteria: properties.get(APPLY_READ_CRITERIA) !== "false",
      };
      const isAdmin = ADMIN_ROLES.some((role) => person.roleNames.has(role));
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
        const base = this.knowledgeBaseVerdict(
          basesById.get(baseId), lists, criteriaById, person, settings, isAdmin,
        );
        decided.set(article.sys_id, base.allowed !== true || base.reason === "admin"
          ? base
          : this.articleVerdict(article, criteriaById, person) ?? base);
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
