import { ConfigurationError } from "@pipedream/platform";
import {
  asRows, referenceId,
} from "./utils.mjs";

// Shared by the access checks: read a person's facts and ServiceNow user criteria with the Table
// API, and decide each criterion for that person. ServiceNow's own evaluator runs scripts in the
// caller's session, which here is the integration user, so it cannot answer for someone else.

const PAGE_SIZE = 1000;
const ID_BATCH_SIZE = 50;
const SYS_ID = /^[0-9a-f]{32}$/i;
export const CONDITION_FIELDS = [
  "user",
  "group",
  "role",
  "company",
  "department",
  "location",
];
const CRITERIA_FIELDS = [
  "sys_id",
  "active",
  "advanced",
  "match_all",
  ...CONDITION_FIELDS,
];

// The distinct ids, lowercase: ServiceNow matches sys_ids in any case but returns them lowercase.
export function assertSysIds(values, label, max) {
  const ids = [
    ...new Set((Array.isArray(values)
      ? values
      : [
        values,
      ]).map((value) => String(value ?? "").trim()
      .toLowerCase())),
  ];
  if (!ids.length || ids.length > max) {
    throw new ConfigurationError(`\`${label}\` must list 1-${max} \`sys_id\`s. Got ${ids.length}.`);
  }
  for (const id of ids) {
    if (!SYS_ID.test(id)) {
      throw new ConfigurationError(`\`${label}\` must hold 32-character ServiceNow \`sys_id\`s. Got: \`${id}\`.`);
    }
  }
  return ids;
}

export function splitIds(value) {
  return String(referenceId(value))
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isBoolean(value) {
  return value === "true" || value === "false";
}

// The answer for the undecided items of a call whose ServiceNow read failed, instead of failing
// the call: `unreadable` when a permission rule refused it (403), `check_failed` for any other
// HTTP error, timeout, or network error. A 401 means the connection itself is broken, so it is
// rethrown, as is anything that is not a request error (a bug).
export function readFailure(error) {
  const status = error?.response?.status;
  if (!error?.isAxiosError || status === 401) {
    throw error;
  }
  console.log(`A ServiceNow read failed: ${status
    ? `HTTP ${status}`
    : error.code ?? "no response"}`);
  return {
    allowed: null,
    reason: status === 403
      ? "unreadable"
      : "check_failed",
  };
}

// Every row of the query. ServiceNow applies `sysparm_limit` before read ACLs, so a short page does
// not mean the last one: paging stops only once `X-Total-Count` (all matching rows) is covered.
// `complete` is false when fewer rows came back than that total, so an ACL hid some. It is also
// false when the count is missing or invalid, or changes between pages: rows may have been
// skipped, so nothing proves the read whole.
export async function readAll(app, $, table, query, fields) {
  const rows = [];
  let firstTotal;
  let counted = true;
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const response = await app._makeRawRequest({
      $,
      url: `/table/${table}`,
      params: {
        sysparm_query: `${query}^ORDERBYsys_id`,
        sysparm_fields: fields.join(","),
        sysparm_exclude_reference_link: true,
        sysparm_limit: PAGE_SIZE,
        sysparm_offset: offset,
      },
      returnFullResponse: true,
    });
    const page = asRows(response?.data?.result);
    rows.push(...page);
    const header = String(response?.headers?.["x-total-count"] ?? "");
    const total = /^\d+$/.test(header)
      ? Number(header)
      : NaN;
    firstTotal ??= total;
    // One bad or changed count makes the whole read incomplete, even if a later page agrees again.
    counted &&= Number.isSafeInteger(total) && total === firstTotal;
    if (page.length < PAGE_SIZE && (!counted || offset + PAGE_SIZE >= total)) {
      return Object.assign(rows, {
        complete: counted && rows.length >= total,
      });
    }
  }
}

export async function readByIds(app, $, table, field, ids, fields) {
  const batches = [];
  for (let i = 0; i < ids.length; i += ID_BATCH_SIZE) {
    batches.push(ids.slice(i, i + ID_BATCH_SIZE));
  }
  const rows = await Promise.all(batches.map((batch) => readAll(app, $, table, `${field}IN${batch.join(",")}`, fields)));
  return Object.assign(rows.flat(), {
    complete: rows.every((batch) => batch.complete),
  });
}

// The named system properties' values; a row the integration user cannot read is left out, so the
// caller applies ServiceNow's default for it. Only a 403 counts as hidden: any other failure
// rejects, for the caller's `readFailure`.
export async function readProperties(app, $, names) {
  try {
    const rows = asRows(await app.getTableRecords({
      $,
      table: "sys_properties",
      params: {
        sysparm_query: `nameIN${names.join(",")}`,
        sysparm_fields: "name,value",
      },
    }));
    return new Map(rows.map((row) => [
      row.name,
      row.value,
    ]));
  } catch (error) {
    if (error?.response?.status !== 403) {
      throw error;
    }
    console.log("System properties unreadable (HTTP 403); using ServiceNow's defaults");
    return new Map();
  }
}

// The person's record, role names, and the sys_ids each criteria field is matched against; a
// field the integration user cannot read is `null` (unknown), not an empty set.
export async function readPerson(app, $, userSysId) {
  const [
    users,
    roles,
    groups,
  ] = await Promise.all([
    readAll(app, $, "sys_user", `sys_id=${userSysId}`, [
      "sys_id",
      "active",
      "locked_out",
      "company",
      "department",
      "location",
    ]),
    readAll(app, $, "sys_user_has_role", `user=${userSysId}^state=active^ORstateISEMPTY`, [
      "sys_id",
      "role",
      "role.name",
    ]),
    readAll(app, $, "sys_user_grmember", `user=${userSysId}^group.active=true`, [
      "sys_id",
      "group",
    ]),
  ]);
  const [
    user,
  ] = users;
  const one = (field) => user?.[field] === undefined
    ? null
    : new Set(splitIds(user[field]));
  // Memberships are unknown when an ACL hid a row or the reference of one.
  const memberships = (rows, field) => rows.complete
    && rows.every((row) => referenceId(row[field]))
    ? new Set(rows.map((row) => referenceId(row[field])))
    : null;
  return {
    user,
    hidden: !users.complete,
    roleNames: new Set(roles.map((row) => row["role.name"]).filter(Boolean)),
    facts: {
      user: new Set([
        userSysId,
      ]),
      group: memberships(groups, "group"),
      role: memberships(roles, "role"),
      company: one("company"),
      department: one("department"),
      location: one("location"),
    },
  };
}

// Why nobody may act as this person, or `null` when the record is usable. `locked_out` is
// admin-only on default ACLs, so a hidden one is decided on `active` alone.
export function personRefusal(person) {
  if (!person.user) {
    return person.hidden
      ? {
        allowed: null,
        reason: "unreadable",
      }
      : {
        allowed: false,
        reason: "user_not_found",
      };
  }
  if (!isBoolean(person.user.active)) {
    return {
      allowed: null,
      reason: "unreadable",
    };
  }
  if (person.user.active !== "true") {
    return {
      allowed: false,
      reason: "user_inactive",
    };
  }
  if (person.user.locked_out === "true") {
    return {
      allowed: false,
      reason: "user_locked_out",
    };
  }
  return null;
}

export async function readCriteria(app, $, ids) {
  const rows = await readByIds(app, $, "user_criteria", "sys_id", [
    ...new Set(ids),
  ], CRITERIA_FIELDS);
  return new Map(rows.map((row) => [
    row.sys_id,
    row,
  ]));
}

// `{ parent sys_id: [criterion sys_id] }` from a link table, and the parents whose links the
// integration user could not fully read. A hidden row, or a row whose parent is hidden, could
// belong to any of them.
export async function readLinks(app, $, table, parentField, parentIds) {
  const byParent = new Map(parentIds.map((id) => [
    id,
    [],
  ]));
  const unreadable = new Set();
  const rows = await readByIds(app, $, table, parentField, parentIds, [
    "sys_id",
    parentField,
    "user_criteria",
  ]);
  if (!rows.complete) {
    parentIds.forEach((id) => unreadable.add(id));
  }
  for (const row of rows) {
    const parentId = referenceId(row[parentField]);
    const criterionId = referenceId(row.user_criteria);
    if (!parentId) {
      parentIds.forEach((id) => unreadable.add(id));
      continue;
    }
    if (!byParent.has(parentId)) {
      continue;
    }
    if (criterionId) {
      byParent.get(parentId).push(criterionId);
    } else {
      unreadable.add(parentId);
    }
  }
  return {
    byParent,
    unreadable,
  };
}

// One criterion for this person: `value` is `true`, `false`, or `null` when it cannot be decided
// here (`why` says which), and `skip` marks an inactive criterion, which ServiceNow ignores. A
// condition field hidden from the integration user, on the criterion or the person, is unknown,
// never empty.
export function criterionMatches(criterion, facts) {
  if (!criterion || !isBoolean(criterion.active)) {
    return {
      value: null,
      why: "unreadable",
    };
  }
  if (criterion.active === "false") {
    return {
      skip: true,
    };
  }
  if (![
    criterion.advanced,
    criterion.match_all,
  ].every(isBoolean) || CONDITION_FIELDS.some((field) => criterion[field] === undefined)) {
    return {
      value: null,
      why: "unreadable",
    };
  }
  // A populated field matches when the person has any one of its values; `null` when the
  // person's value is hidden.
  const fields = CONDITION_FIELDS
    .map((field) => [
      field,
      splitIds(criterion[field]),
    ])
    .filter(([
      , ids,
    ]) => ids.length)
    .map(([
      field,
      ids,
    ]) => facts[field] && ids.some((id) => facts[field].has(id)));
  // The script is one more condition beside the fields; ServiceNow ignores it unless advanced. It
  // runs in the caller's session, the integration user's here, so it is never decided.
  const scripted = criterion.advanced === "true";
  if (!fields.length && !scripted) {
    // ServiceNow's user criteria guide: a criterion with no conditions matches no users.
    return {
      value: false,
    };
  }
  const script = {
    value: null,
    why: "script",
  };
  const unknown = {
    value: null,
    why: "unreadable",
  };
  if (criterion.match_all === "true") {
    // Every populated field must match, and the script too.
    if (fields.includes(false)) {
      return {
        value: false,
      };
    }
    if (scripted) {
      return script;
    }
    return fields.includes(null)
      ? unknown
      : {
        value: true,
      };
  }
  if (fields.includes(true)) {
    return {
      value: true,
    };
  }
  if (scripted) {
    return script;
  }
  return fields.includes(null)
    ? unknown
    : {
      value: false,
    };
}

// The active criteria of one list, each decided for this person.
export function evaluateList(ids, criteriaById, facts) {
  return ids
    .map((id) => criterionMatches(criteriaById.get(id), facts))
    .filter((result) => !result.skip);
}

export function anyIs(results, value) {
  return results.some((result) => result.value === value);
}

export function undecidedReason(results) {
  return results.some(({ why }) => why === "unreadable")
    ? "unreadable"
    : "unresolved_script";
}
