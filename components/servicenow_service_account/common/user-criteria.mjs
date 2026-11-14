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
  "script",
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

export async function readAll(app, $, table, query, fields) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = asRows(await app.getTableRecords({
      $,
      table,
      params: {
        sysparm_query: `${query}^ORDERBYsys_id`,
        sysparm_fields: fields.join(","),
        sysparm_exclude_reference_link: true,
        sysparm_limit: PAGE_SIZE,
        sysparm_offset: offset,
      },
    }));
    rows.push(...page);
    if (page.length < PAGE_SIZE) {
      return rows;
    }
  }
}

export async function readByIds(app, $, table, field, ids, fields) {
  if (!ids.length) {
    return [];
  }
  const batches = [];
  for (let i = 0; i < ids.length; i += ID_BATCH_SIZE) {
    batches.push(ids.slice(i, i + ID_BATCH_SIZE));
  }
  const rows = await Promise.all(batches.map((batch) => readAll(app, $, table, `${field}IN${batch.join(",")}`, fields)));
  return rows.flat();
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

// The person's record, role names, and the sys_ids each criteria field is matched against.
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
  const one = (field) => new Set(splitIds(user?.[field]));
  return {
    user,
    roleNames: new Set(roles.map((row) => row["role.name"]).filter(Boolean)),
    facts: {
      user: new Set([
        userSysId,
      ]),
      group: new Set(groups.map((row) => referenceId(row.group)).filter(Boolean)),
      role: new Set(roles.map((row) => referenceId(row.role)).filter(Boolean)),
      company: one("company"),
      department: one("department"),
      location: one("location"),
    },
  };
}

// Why nobody may act as this person, or `null` when the record is usable.
export function personRefusal(person) {
  if (!person.user) {
    return {
      allowed: false,
      reason: "user_not_found",
    };
  }
  if (![
    person.user.active,
    person.user.locked_out,
  ].every(isBoolean)) {
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
// integration user could not fully read. A row whose parent is hidden could belong to any of them.
export async function readLinks(app, $, table, parentField, parentIds) {
  const byParent = new Map(parentIds.map((id) => [
    id,
    [],
  ]));
  const unreadable = new Set();
  for (const row of await readByIds(app, $, table, parentField, parentIds, [
    "sys_id",
    parentField,
    "user_criteria",
  ])) {
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
// here (`why` says which), and `skip` marks an inactive criterion, which ServiceNow ignores.
export function criterionMatches(criterion, facts) {
  if (!criterion || ![
    criterion.active,
    criterion.advanced,
    criterion.match_all,
  ].every(isBoolean)) {
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
    ]) => ({
      any: ids.some((id) => facts[field].has(id)),
      all: ids.every((id) => facts[field].has(id)),
    }));
  // The script is one more condition beside the fields; ServiceNow ignores it unless advanced.
  const scripted = criterion.advanced === "true";
  const undecided = {
    value: null,
    why: scripted
      ? "script"
      : "ambiguous",
    script: scripted
      ? String(criterion.script ?? "")
      : "",
  };
  if (!fields.length && !scripted) {
    return {
      value: true,
    };
  }
  if (criterion.match_all === "true") {
    // Whether every value of a multi-value field must match is unproven: both readings must agree.
    const anyReading = fields.every((field) => field.any);
    const allReading = fields.every((field) => field.all);
    if (!anyReading && !allReading) {
      return {
        value: false,
      };
    }
    return anyReading !== allReading || scripted
      ? undecided
      : {
        value: true,
      };
  }
  if (fields.some((field) => field.any)) {
    return {
      value: true,
    };
  }
  return scripted
    ? undecided
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
