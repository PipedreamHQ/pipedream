import assert from "node:assert/strict";
import { test } from "node:test";
import action, { normalizeAttachmentPolicy } from "./get-catalog-attachment-policy.mjs";

const SYS_ID = "a".repeat(32);

function exportProbe() {
  const calls = [];
  return {
    export(...args) {
      calls.push(args);
    },
    calls,
  };
}

function actionContext({
  catalogRecord = {},
  tableRows = [],
  portalPage = {},
  sysClassName,
  catalogError,
  tableError,
  portalError,
} = {}) {
  const calls = [];
  return {
    ...action,
    catalogItemSysId: SYS_ID,
    sysClassName,
    servicenow: {
      async getCatalogItem(args) {
        calls.push([
          "catalog",
          args,
        ]);
        if (catalogError) {
          throw catalogError;
        }
        return catalogRecord;
      },
      async getTableRecords(args) {
        calls.push([
          "table",
          args,
        ]);
        if (tableError) {
          throw tableError;
        }
        return tableRows;
      },
      async getServicePortalCatalogItem(args) {
        calls.push([
          "portal",
          args,
        ]);
        if (portalError) {
          throw portalError;
        }
        return portalPage;
      },
    },
    calls,
  };
}

test("normalizes explicit optional attachment support", () => {
  assert.deepEqual(normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: false,
    },
    tableRecord: {
      sys_id: SYS_ID,
      no_attachment: "false",
    },
    table: "sc_cat_item",
  }), {
    sys_id: SYS_ID,
    sys_class_name: "sc_cat_item",
    target_table: "",
    policy: "allowed",
    supported: true,
    required: false,
    field_presence: {
      mandatory_attachment: true,
      no_attachment: true,
    },
    policy_fields: {
      required: "mandatory_attachment",
      prohibited: "no_attachment_v2",
      requested: [
        "sys_id",
        "sys_class_name",
        "mandatory_attachment",
        "no_attachment_v2",
        "no_attachment",
        "table_name",
      ],
    },
    sources: {
      service_catalog: true,
      concrete_table: true,
      service_portal: false,
    },
  });
});

test("normalizes explicit attachment prohibition", () => {
  const result = normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: false,
    },
    tableRecord: {
      sys_id: SYS_ID,
      no_attachment: true,
    },
    table: "sc_cat_item",
  });

  assert.equal(result.policy, "prohibited");
  assert.equal(result.supported, false);
  assert.equal(result.required, false);
});

test("uses ServiceNow's canonical no_attachment_v2 field", () => {
  const result = normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: false,
    },
    tableRecord: {
      sys_id: SYS_ID,
      no_attachment_v2: "false",
    },
    table: "sc_cat_item",
  });

  assert.equal(result.policy, "allowed");
  assert.equal(result.supported, true);
  assert.equal(result.policy_diagnostic, undefined);
});

test("uses the evaluated Service Portal attachment policy when table ACLs omit the field", async () => {
  const context = actionContext({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: false,
    },
    tableRows: [
      {
        sys_id: SYS_ID,
      },
    ],
    portalPage: {
      containers: [
        {
          widgets: [
            {
              data: {
                unrelated: true,
              },
            },
          ],
        },
        {
          widgets: [
            {
              data: {
                sc_cat_item: {
                  mandatory_attachment: false,
                  no_attachments: true,
                },
              },
            },
          ],
        },
      ],
    },
  });

  const result = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(result.policy, "prohibited");
  assert.equal(result.supported, false);
  assert.equal(result.sources.service_portal, true);
  assert.equal(result.policy_diagnostic, undefined);
  assert.equal(context.calls[1][0], "portal");
});

test("normalizes required attachments", () => {
  const result = normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: "true",
    },
    tableRecord: {},
    table: "sc_cat_item",
  });

  assert.equal(result.policy, "allowed");
  assert.equal(result.supported, true);
  assert.equal(result.required, true);
});

test("concrete required metadata overrides a false catalog summary", () => {
  const result = normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: false,
    },
    tableRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: true,
    },
    table: "sc_cat_item",
  });

  assert.equal(result.policy, "allowed");
  assert.equal(result.supported, true);
  assert.equal(result.required, true);
});

test("preserves omitted metadata as unknown", () => {
  const result = normalizeAttachmentPolicy({
    catalogRecord: {
      sys_id: SYS_ID,
      mandatory_attachment: "",
    },
    tableRecord: {
      sys_id: SYS_ID,
    },
    table: "sc_cat_item_producer",
  });

  assert.equal(result.policy, "unknown");
  assert.equal(result.supported, null);
  assert.deepEqual(result.field_presence, {
    mandatory_attachment: false,
    no_attachment: false,
  });
  assert.match(result.policy_diagnostic, /could not read no_attachment_v2/);
});

test("queries the concrete record producer table", async () => {
  const context = actionContext({
    catalogRecord: {
      sys_id: SYS_ID,
      sys_class_name: "sc_cat_item_producer",
      mandatory_attachment: false,
    },
    tableRows: [
      {
        sys_id: SYS_ID,
        no_attachment: false,
      },
    ],
  });
  const $ = exportProbe();

  const result = await action.run.call(context, {
    $,
  });

  assert.equal(result.policy, "allowed");
  assert.equal(context.calls[2][1].table, "sc_cat_item_producer");
  assert.equal(context.calls[2][1].params.sysparm_query, `sys_id=${SYS_ID}`);
  assert.deepEqual($.calls, [
    [
      "$summary",
      `Attachment policy for ${SYS_ID}: allowed`,
    ],
  ]);
});

test("uses a supplied class when catalog details are incomplete", async () => {
  const context = actionContext({
    catalogRecord: {
      sys_id: SYS_ID,
    },
    sysClassName: "sc_cat_item_producer",
  });

  const result = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(result.policy, "unknown");
  assert.equal(context.calls[2][1].table, "sc_cat_item_producer");
});

test("starts all metadata reads immediately when the concrete class is supplied", async () => {
  const context = actionContext({
    catalogRecord: {
      sys_id: SYS_ID,
    },
    tableRows: [
      {
        sys_id: SYS_ID,
      },
    ],
    portalPage: {
      result: {
        sc_cat_item: {
          mandatory_attachment: false,
          no_attachments: false,
        },
      },
    },
    sysClassName: "sc_cat_item_producer",
  });

  const result = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.deepEqual(context.calls.map(([
    source,
  ]) => source), [
    "catalog",
    "portal",
    "table",
  ]);
  assert.equal(result.sys_class_name, "sc_cat_item_producer");
  assert.equal(result.policy, "allowed");
});

test("returns portal policy when other metadata sources fail", async () => {
  const context = actionContext({
    catalogError: Object.assign(new Error("catalog unavailable"), {
      name: "CatalogError",
    }),
    tableError: Object.assign(new Error("table forbidden"), {
      response: {
        status: 403,
      },
    }),
    portalPage: {
      result: {
        sc_cat_item: {
          mandatory_attachment: true,
          no_attachments: false,
        },
      },
    },
    sysClassName: "sc_cat_item_producer",
  });

  const result = await action.run.call(context, {
    $: exportProbe(),
  });

  assert.equal(result.policy, "allowed");
  assert.equal(result.required, true);
  assert.deepEqual(result.metadata_errors, [
    {
      source: "service_catalog",
      category: "CatalogError",
    },
    {
      source: "concrete_table",
      category: "http_403",
    },
  ]);
});

test("rejects malformed catalog sys_ids", async () => {
  const context = {
    ...actionContext(),
    catalogItemSysId: "not-a-sys-id",
  };

  await assert.rejects(
    action.run.call(context, {
      $: exportProbe(),
    }),
    /32-character hexadecimal/,
  );
  assert.deepEqual(context.calls, []);
});
