// Unit tests for Check Catalog Item Access and Check Knowledge Article Access, with stubbed
// ServiceNow reads. Run from the repository root:
// node --test components/servicenow_service_account/common/access-checks.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import catalog from "../actions/check-catalog-item-access/check-catalog-item-access.mjs";
import knowledge from "../actions/check-knowledge-article-access/check-knowledge-article-access.mjs";
import {
  criterionMatches, personRefusal,
} from "./user-criteria.mjs";

const id = (c) => c.repeat(32);
const U = id("a");

// A readable criterion: every condition field present, empty unless given.
const criterion = (fields = {}) => ({
  sys_id: id("c"),
  active: "true",
  advanced: "false",
  match_all: "false",
  user: "",
  group: "",
  role: "",
  company: "",
  department: "",
  location: "",
  ...fields,
});
const facts = (fields = {}) => ({
  user: new Set([
    U,
  ]),
  group: new Set(),
  role: new Set(),
  company: new Set(),
  department: new Set(),
  location: new Set(),
  ...fields,
});
const person = (roles = [], factFields = {}) => ({
  user: {
    sys_id: U,
    active: "true",
    locked_out: "false",
  },
  roleNames: new Set(roles),
  facts: facts(factFields),
});
const byId = (...criteria) => new Map(criteria.map((c) => [
  c.sys_id,
  c,
]));
const yes = criterion({
  sys_id: id("y"),
  user: U,
});
const no = criterion({
  sys_id: id("n"),
  role: id("r"),
});
const script = criterion({
  sys_id: id("s"),
  advanced: "true",
});

test("criterionMatches: any populated field matches, or none does", () => {
  const c = criterion({
    group: `${id("g")},${id("h")}`,
  });
  assert.deepEqual(criterionMatches(c, facts({
    group: new Set([
      id("h"),
    ]),
  })), {
    value: true,
  });
  assert.deepEqual(criterionMatches(c, facts()), {
    value: false,
  });
});

test("criterionMatches: match all needs one value of every populated field", () => {
  // ServiceNow's example: locations A or B and companies C or D; location A with company C matches.
  const c = criterion({
    match_all: "true",
    location: `${id("1")},${id("2")}`,
    company: `${id("3")},${id("4")}`,
  });
  const at = (location, company) => facts({
    location,
    company,
  });
  assert.equal(criterionMatches(c, at(new Set([
    id("1"),
  ]), new Set([
    id("3"),
  ]))).value, true);
  assert.equal(criterionMatches(c, at(new Set([
    id("1"),
  ]), new Set([
    id("9"),
  ]))).value, false);
  assert.deepEqual(criterionMatches(c, at(null, new Set([
    id("3"),
  ]))), {
    value: null,
    why: "unreadable",
  });
  assert.equal(criterionMatches(c, at(null, new Set([
    id("9"),
  ]))).value, false);
});

test("criterionMatches: a hidden condition field is unknown, never empty", () => {
  const hidden = criterion();
  delete hidden.company;
  assert.deepEqual(criterionMatches(hidden, facts()), {
    value: null,
    why: "unreadable",
  });
  // An inactive criterion is skipped even when a field is hidden.
  assert.deepEqual(criterionMatches({
    ...hidden,
    active: "false",
  }, facts()), {
    skip: true,
  });
  const byCompany = criterion({
    company: id("3"),
  });
  assert.deepEqual(criterionMatches(byCompany, facts({
    company: null,
  })), {
    value: null,
    why: "unreadable",
  });
});

test("criterionMatches: scripts are never decided, empty and inactive criteria", () => {
  assert.deepEqual(criterionMatches(script, facts()), {
    value: null,
    why: "script",
  });
  // Match all: a failing field decides; matching fields still leave the script.
  const scriptedRole = criterion({
    advanced: "true",
    match_all: "true",
    role: id("r"),
  });
  assert.deepEqual(criterionMatches(scriptedRole, facts()), {
    value: false,
  });
  assert.deepEqual(criterionMatches(scriptedRole, facts({
    role: new Set([
      id("r"),
    ]),
  })), {
    value: null,
    why: "script",
  });
  assert.deepEqual(criterionMatches(criterion({
    advanced: "true",
    match_all: "true",
  }), facts()), {
    value: null,
    why: "script",
  });
  // A criterion with no conditions matches nobody.
  assert.deepEqual(criterionMatches(criterion(), facts()), {
    value: false,
  });
  assert.deepEqual(criterionMatches(criterion({
    active: "false",
  }), facts()), {
    skip: true,
  });
  assert.deepEqual(criterionMatches(criterion({
    match_all: undefined,
  }), facts()), {
    value: null,
    why: "unreadable",
  });
});

test("personRefusal", () => {
  const refusal = (user, hidden = false) => personRefusal({
    user,
    hidden,
  });
  assert.equal(refusal(undefined).reason, "user_not_found");
  assert.deepEqual(refusal(undefined, true), {
    allowed: null,
    reason: "unreadable",
  });
  assert.equal(refusal({
    active: "true",
  }).reason, "unreadable");
  assert.equal(refusal({
    active: "false",
    locked_out: "false",
  }).reason, "user_inactive");
  assert.equal(refusal({
    active: "true",
    locked_out: "true",
  }).reason, "user_locked_out");
  assert.equal(refusal({
    active: "true",
    locked_out: "false",
  }), null);
});

test("itemVerdict", () => {
  const { itemVerdict } = catalog.methods;
  const verdict = (item, links, criteria = byId(), roles = [], override = []) => itemVerdict(
    item,
    {
      available: [],
      notAvailable: [],
      unreadable: false,
      ...links,
    },
    criteria,
    person(roles),
    override,
  );
  const active = {
    active: "true",
  };
  const all = byId(yes, no, script);
  assert.deepEqual(verdict(undefined, {}), {
    can_request: false,
    reason: "item_not_found",
  });
  assert.equal(verdict({}, {}).reason, "unreadable");
  assert.equal(verdict({
    active: "false",
  }, {}).reason, "item_inactive");
  assert.equal(verdict(active, {}, all, [
    "catalog_admin",
  ], [
    "catalog_admin",
  ]).reason, "entitlement_override");
  assert.equal(verdict(active, {
    unreadable: true,
  }).reason, "unreadable");
  assert.equal(verdict(active, {}).reason, "open_to_all");
  assert.equal(verdict(active, {
    available: [
      yes.sys_id,
    ],
  }, all).reason, "available_for");
  assert.equal(verdict(active, {
    available: [
      no.sys_id,
    ],
  }, all).reason, "not_in_available_for");
  assert.deepEqual(verdict(active, {
    available: [
      script.sys_id,
    ],
  }, all), {
    can_request: null,
    reason: "unresolved_script",
  });
  assert.equal(verdict(active, {
    available: [
      id("x"),
    ],
  }).reason, "unreadable");
  // Not Available For wins over a matching Available For, and an undecided one is never ignored.
  assert.equal(verdict(active, {
    available: [
      yes.sys_id,
    ],
    notAvailable: [
      yes.sys_id,
    ],
  }, all).reason, "not_available_for");
  assert.deepEqual(verdict(active, {
    available: [
      yes.sys_id,
    ],
    notAvailable: [
      script.sys_id,
    ],
  }, all), {
    can_request: null,
    reason: "unresolved_script",
  });
});

test("articleGate", () => {
  const today = "2026-11-16";
  const gate = (fields, refused = null) => knowledge.methods.articleGate(fields && {
    active: "true",
    workflow_state: "published",
    valid_to: "2100-01-01",
    kb_knowledge_base: id("b"),
    can_read_user_criteria: "",
    cannot_read_user_criteria: "",
    roles: "",
    ...fields,
  }, refused, today);
  assert.equal(gate(undefined).reason, "article_not_found");
  for (const field of [
    "active",
    "valid_to",
    "kb_knowledge_base",
    "can_read_user_criteria",
    "cannot_read_user_criteria",
    "roles",
  ]) {
    assert.equal(gate({
      [field]: undefined,
    }).reason, "unreadable", field);
  }
  assert.equal(gate({
    workflow_state: "draft",
  }).reason, "article_not_published");
  assert.equal(gate({
    active: "false",
  }).reason, "article_not_published");
  assert.equal(gate({
    workflow_state: "outdated",
  }), null);
  assert.equal(gate({
    valid_to: "2026-11-15",
  }).reason, "article_expired");
  assert.equal(gate({
    valid_to: "",
  }).reason, "article_expired");
  assert.equal(gate({
    valid_to: today,
  }), null);
  assert.equal(gate({}, {
    allowed: false,
    reason: "user_inactive",
  }).reason, "user_inactive");
});

test("articleVerdict follows ServiceNow's read order", () => {
  const decide = ({
    base = {}, lists = {}, article = {}, roles = [], over = {},
  } = {}) => knowledge.methods.articleVerdict.call(knowledge.methods, {
    can_read_user_criteria: "",
    cannot_read_user_criteria: "",
    roles: "",
    ...article,
  }, base && {
    active: "true",
    application: "global",
    owner: "",
    kb_managers: "",
    ...base,
  }, {
    canRead: [],
    cannotRead: [],
    canContribute: [],
    cannotContribute: [],
    unreadable: false,
    ...lists,
  }, byId(yes, no, script), person(roles), {
    blockWithoutCriteria: false,
    applyReadCriteria: false,
    applyRoles: true,
    ...over,
  });
  // The knowledge base itself.
  assert.equal(decide({
    base: null,
  }).reason, "knowledge_base_not_found");
  assert.equal(decide({
    base: {
      active: undefined,
    },
  }).reason, "unreadable");
  assert.equal(decide({
    base: {
      active: "false",
    },
  }).reason, "knowledge_base_inactive");
  assert.equal(decide({
    lists: {
      unreadable: true,
    },
    roles: [
      "admin",
    ],
  }).reason, "unreadable");
  // Admins, on a global knowledge base only.
  assert.equal(decide({
    roles: [
      "knowledge_admin",
    ],
  }).reason, "admin");
  assert.equal(decide({
    base: {
      application: id("9"),
    },
    roles: [
      "admin",
    ],
    lists: {
      cannotRead: [
        yes.sys_id,
      ],
    },
  }).reason, "cannot_read");
  assert.equal(decide({
    base: {
      application: undefined,
    },
    roles: [
      "admin",
    ],
    lists: {
      canRead: [
        no.sys_id,
      ],
    },
  }).reason, "not_in_can_read");
  // The owner and managers read before any criteria or roles.
  assert.equal(decide({
    base: {
      owner: U,
    },
    lists: {
      cannotRead: [
        yes.sys_id,
      ],
    },
  }).reason, "knowledge_base_manager");
  assert.equal(decide({
    base: {
      kb_managers: `${id("m")},${U}`,
    },
    article: {
      roles: "itil",
    },
  }).reason, "knowledge_base_manager");
  // Read criteria.
  assert.equal(decide().reason, "open_to_all");
  assert.equal(decide({
    over: {
      blockWithoutCriteria: true,
    },
  }).reason, "no_read_criteria");
  assert.equal(decide({
    lists: {
      canRead: [
        yes.sys_id,
      ],
    },
  }).reason, "can_read");
  assert.equal(decide({
    article: {
      cannot_read_user_criteria: yes.sys_id,
    },
  }).reason, "article_cannot_read");
  assert.equal(decide({
    lists: {
      canRead: [
        yes.sys_id,
      ],
    },
    article: {
      can_read_user_criteria: no.sys_id,
    },
  }).reason, "article_not_in_can_read");
  // An undecided Cannot Read keeps a matching Can Read from granting.
  assert.deepEqual(decide({
    lists: {
      canRead: [
        yes.sys_id,
      ],
      cannotRead: [
        script.sys_id,
      ],
    },
  }), {
    allowed: null,
    reason: "unresolved_script",
  });
  // Roles, only while role-based security is on.
  assert.equal(decide({
    article: {
      roles: "itil",
    },
  }).reason, "article_roles");
  assert.equal(decide({
    article: {
      roles: "itil",
    },
    roles: [
      "itil",
    ],
  }).reason, "open_to_all");
  assert.equal(decide({
    article: {
      roles: "itil",
    },
    over: {
      applyRoles: false,
    },
  }).reason, "open_to_all");
  // Contributors read when the read criteria refuse, unless apply_article_read_criteria is true.
  const contributor = {
    canRead: [
      no.sys_id,
    ],
    canContribute: [
      yes.sys_id,
    ],
  };
  assert.equal(decide({
    lists: contributor,
  }).reason, "can_contribute");
  assert.equal(decide({
    lists: contributor,
    over: {
      applyReadCriteria: true,
    },
  }).reason, "not_in_can_read");
  assert.equal(decide({
    lists: {
      ...contributor,
      cannotContribute: [
        yes.sys_id,
      ],
    },
  }).reason, "not_in_can_read");
  assert.deepEqual(decide({
    lists: {
      ...contributor,
      cannotContribute: [
        script.sys_id,
      ],
    },
  }), {
    allowed: null,
    reason: "unresolved_script",
  });
  // Undecided read criteria: answered only when both outcomes agree.
  const undecided = {
    canRead: [
      script.sys_id,
    ],
  };
  assert.equal(decide({
    lists: {
      ...undecided,
      canContribute: [
        yes.sys_id,
      ],
    },
  }).reason, "can_contribute");
  assert.deepEqual(decide({
    lists: undecided,
  }), {
    allowed: null,
    reason: "unresolved_script",
  });
  assert.equal(decide({
    lists: undecided,
    article: {
      roles: "itil",
    },
  }).reason, "article_roles");
  // Readers would be refused by the roles, contributors let in: undecided.
  assert.deepEqual(decide({
    lists: {
      ...undecided,
      canContribute: [
        yes.sys_id,
      ],
    },
    article: {
      roles: "itil",
    },
  }), {
    allowed: null,
    reason: "unresolved_script",
  });
});

// A stubbed ServiceNow app: `tables` holds rows (a row with `hidden: true` counts in
// X-Total-Count but is not returned, as with a read ACL); `fail` maps a table to an HTTP status,
// or "net" for a connection error.
function stubApp(tables, fail = {}) {
  const calls = [];
  const error = (status) => Object.assign(new Error(`HTTP ${status}`), status === "net"
    ? {
      isAxiosError: true,
      code: "ECONNRESET",
    }
    : {
      isAxiosError: true,
      response: {
        status,
      },
    });
  const select = (table, params) => {
    calls.push(table);
    if (fail[table]) {
      throw error(fail[table]);
    }
    const query = params.sysparm_query.replace(/\^ORDERBYsys_id$/, "");
    const rows = tables[table] ?? [];
    const inList = query.match(/^(\w+)IN([^^]*)/);
    if (inList) {
      const ids = inList[2].split(",");
      return rows.filter((row) => ids.includes(row[inList[1]]));
    }
    const equals = query.match(/^(\w+)=([0-9a-f]{32})/);
    return equals
      ? rows.filter((row) => row[equals[1]] === equals[2])
      : rows;
  };
  return {
    calls,
    async getTableRecords({
      table, params,
    }) {
      return select(table, params).filter((row) => !row.hidden);
    },
    async _makeRawRequest({
      url, params,
    }) {
      const all = select(url.split("/")[2], params);
      const offset = params.sysparm_offset ?? 0;
      return {
        data: {
          result: all.slice(offset, offset + params.sysparm_limit).filter((row) => !row.hidden),
        },
        headers: {
          "x-total-count": String(all.length),
        },
      };
    },
  };
}

async function run(action, app, props) {
  const self = {
    servicenow: app,
    ...props,
  };
  for (const [
    name,
    fn,
  ] of Object.entries(action.methods)) {
    self[name] = fn.bind(self);
  }
  return action.run.call(self, {
    $: {
      export() {},
    },
  });
}

const userRow = (fields = {}) => ({
  sys_id: U,
  active: "true",
  locked_out: "false",
  company: "",
  department: "",
  location: "",
  ...fields,
});
const catalogTables = (items, extra = {}) => ({
  sys_properties: [
    {
      name: "glide.sc.use_user_criteria",
      value: "true",
    },
  ],
  sys_user: [
    userRow(),
  ],
  sc_cat_item: items,
  user_criteria: [
    yes,
    no,
    criterion({
      sys_id: id("g"),
      group: id("9"),
    }),
  ],
  ...extra,
});
const itemRows = (...chars) => chars.map((c) => ({
  sys_id: id(c),
  active: "true",
}));
const link = (c, item, criterionId) => ({
  sys_id: id(c),
  sc_cat_item: id(item),
  user_criteria: criterionId,
});
const ask = (app, items) => run(catalog, app, {
  userSysId: U,
  catalogItemSysIds: items.map((item) => item.sys_id),
});

test("a failed read answers the undecided items instead of failing", async () => {
  // 1: Available For; 2: no links; 3: Not Available For only; 4: a link with a hidden criterion.
  const items = itemRows("1", "2", "3", "4");
  const tables = () => catalogTables(items, {
    sc_cat_item_user_criteria_mtom: [
      link("l", "1", yes.sys_id),
    ],
    sc_cat_item_user_criteria_no_mtom: [
      link("m", "3", no.sys_id),
      link("n", "4", ""),
    ],
  });
  for (const [
    status,
    reason,
  ] of [
      [
        403,
        "unreadable",
      ],
      [
        503,
        "check_failed",
      ],
      [
        "net",
        "check_failed",
      ],
    ]) {
    const early = await ask(stubApp(tables(), {
      sys_user_grmember: status,
    }), items);
    assert.ok(early.every((row) => row.can_request === null && row.reason === reason),
      String(status));
    // A late failure keeps the item without criteria decided.
    const late = await ask(stubApp(tables(), {
      user_criteria: status,
    }), items);
    assert.deepEqual(late.map((row) => [
      row.can_request,
      row.reason,
    ]), [
      [
        null,
        reason,
      ],
      [
        true,
        "open_to_all",
      ],
      [
        null,
        reason,
      ],
      [
        null,
        reason,
      ],
    ], String(status));
  }
  await assert.rejects(ask(stubApp(tables(), {
    sc_cat_item: 401,
  }), items));
});

test("catalog properties", async () => {
  const items = itemRows("1");
  const reason = async (properties, roles = []) => (await ask(stubApp(catalogTables(items, {
    sys_properties: properties,
    sys_user_has_role: roles.map((name, i) => ({
      "sys_id": id(String(i)),
      "user": U,
      "role": id("e"),
      "role.name": name,
    })),
    sc_cat_item_user_criteria_mtom: [
      link("l", "1", no.sys_id),
    ],
  })), items))[0].reason;
  assert.equal(await reason([]), "unreadable");
  assert.equal(await reason([
    {
      name: "glide.sc.use_user_criteria",
      value: "false",
    },
  ]), "legacy_entitlements");
  const useCriteria = {
    name: "glide.sc.use_user_criteria",
    value: "true",
  };
  assert.equal(await reason([
    useCriteria,
    {
      name: "glide.sc.entitlement.override",
      value: "admin, catalog_admin",
    },
  ], [
    "catalog_admin",
  ]), "entitlement_override");
  // A hidden override list grants nobody, admins included.
  assert.equal(await reason([
    useCriteria,
  ], [
    "admin",
  ]), "not_in_available_for");
});

test("hidden rows and hidden references are unknown, not missing", async () => {
  const items = itemRows("1");
  const notForGroup = {
    sc_cat_item_user_criteria_no_mtom: [
      link("m", "1", id("g")),
    ],
  };
  // The person is in the excluded group, but the membership row hides its group.
  const hiddenGroup = await ask(stubApp(catalogTables(items, {
    ...notForGroup,
    sys_user_grmember: [
      {
        sys_id: id("8"),
        user: U,
      },
    ],
  })), items);
  assert.equal(hiddenGroup[0].reason, "unreadable");
  // An ACL hides the membership row itself.
  const hiddenRow = await ask(stubApp(catalogTables(items, {
    ...notForGroup,
    sys_user_grmember: [
      {
        sys_id: id("8"),
        user: U,
        group: id("9"),
        hidden: true,
      },
    ],
  })), items);
  assert.equal(hiddenRow[0].reason, "unreadable");
  // An ACL hides a Not Available For link.
  const hiddenLink = await ask(stubApp(catalogTables(items, {
    sc_cat_item_user_criteria_no_mtom: [
      {
        ...link("m", "1", yes.sys_id),
        hidden: true,
      },
    ],
  })), items);
  assert.equal(hiddenLink[0].reason, "unreadable");
  // An ACL hides the person's record.
  const hiddenUser = await ask(stubApp(catalogTables(items, {
    sys_user: [
      userRow({
        hidden: true,
      }),
    ],
  })), items);
  assert.equal(hiddenUser[0].reason, "unreadable");
});

test("paging follows X-Total-Count past a short page", async () => {
  // 1,001 link rows for one item; the first page loses a row to an ACL, so it comes back short.
  const links = Array.from({
    length: 1001,
  }, (_, i) => ({
    sys_id: String(i).padStart(32, "0"),
    sc_cat_item: id("1"),
    user_criteria: i === 1000
      ? yes.sys_id
      : id("z"),
    hidden: i === 0,
  }));
  const items = itemRows("1");
  const app = stubApp(catalogTables(items, {
    sc_cat_item_user_criteria_mtom: links,
  }));
  const [
    row,
  ] = await ask(app, items);
  // The second window is still read, and the hidden row makes the item unreadable.
  assert.equal(app.calls.filter((table) => table === "sc_cat_item_user_criteria_mtom").length, 2);
  assert.equal(row.reason, "unreadable");
  links[0].hidden = false;
  const [
    readable,
  ] = await ask(stubApp(catalogTables(items, {
    sc_cat_item_user_criteria_mtom: links,
  })), items);
  assert.equal(readable.reason, "available_for");
});

const KB = id("b");
const kbTables = (extra = {}) => ({
  sys_properties: [],
  sys_user: [
    userRow(),
  ],
  kb_knowledge: [
    {
      sys_id: id("1"),
      active: "true",
      workflow_state: "published",
      valid_to: "2100-01-01",
      kb_knowledge_base: KB,
      can_read_user_criteria: "",
      cannot_read_user_criteria: "",
      roles: "",
    },
  ],
  kb_knowledge_base: [
    {
      sys_id: KB,
      active: "true",
      application: "global",
      owner: "",
      kb_managers: "",
    },
  ],
  ...extra,
});
const read = (app, articles = [
  id("1"),
]) => run(knowledge, app, {
  userSysId: U,
  articleSysIds: articles,
});

test("knowledge properties are read the restrictive way when missing", async () => {
  // No properties: a knowledge base without Can Read criteria is blocked.
  assert.equal((await read(stubApp(kbTables())))[0].reason, "no_read_criteria");
  const open = [
    {
      name: "glide.knowman.block_access_with_no_user_criteria",
      value: "false",
    },
  ];
  const [
    row,
  ] = await read(stubApp(kbTables({
    sys_properties: open,
  })));
  assert.deepEqual(row, {
    sys_id: id("1"),
    knowledge_base: KB,
    can_read: true,
    reason: "open_to_all",
  });
  // Article roles apply unless role-based security is readable and not true.
  const withRoles = (properties) => kbTables({
    sys_properties: properties,
    kb_knowledge: kbTables().kb_knowledge.map((article) => ({
      ...article,
      roles: "itil",
    })),
  });
  assert.equal((await read(stubApp(withRoles(open))))[0].reason, "article_roles");
  assert.equal((await read(stubApp(withRoles([
    ...open,
    {
      name: "glide.knowman.search.apply_role_based_security",
      value: "false",
    },
  ]))))[0].reason, "open_to_all");
});

test("knowledge read failures keep settled answers", async () => {
  const tables = kbTables({
    kb_knowledge: [
      ...kbTables().kb_knowledge,
      {
        ...kbTables().kb_knowledge[0],
        sys_id: id("2"),
        valid_to: "2020-01-01",
      },
    ],
  });
  const out = await read(stubApp(tables, {
    kb_uc_can_read_mtom: 503,
  }), [
    id("1"),
    id("2"),
    id("3"),
  ]);
  assert.deepEqual(out.map((row) => [
    row.can_read,
    row.reason,
    row.knowledge_base,
  ]), [
    [
      null,
      "check_failed",
      KB,
    ],
    [
      false,
      "article_expired",
      KB,
    ],
    [
      false,
      "article_not_found",
      "",
    ],
  ]);
  const early = await read(stubApp(tables, {
    kb_knowledge: 403,
  }));
  assert.deepEqual(early.map((row) => row.reason), [
    "unreadable",
  ]);
});

test("a refused person or settled articles read no knowledge bases", async () => {
  const app = stubApp(kbTables({
    sys_user: [
      userRow({
        active: "false",
      }),
    ],
  }));
  const out = await read(app, [
    id("1"),
    id("2"),
  ]);
  assert.deepEqual(out.map((row) => row.reason), [
    "user_inactive",
    "article_not_found",
  ]);
  assert.ok(!app.calls.some((table) => table.startsWith("kb_uc_") || table === "kb_knowledge_base"));
});
