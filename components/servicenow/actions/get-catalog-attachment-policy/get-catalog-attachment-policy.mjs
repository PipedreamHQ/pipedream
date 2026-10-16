import servicenow from "../../servicenow.app.mjs";
import { assertSysId } from "../../common/utils.mjs";

const ITEM_TABLES = new Set([
  "sc_cat_item",
  "sc_cat_item_producer",
]);
const POLICY_FIELDS = [
  "sys_id",
  "sys_class_name",
  "mandatory_attachment",
  "no_attachment_v2",
  "no_attachment",
  "table_name",
];

function scalar(value) {
  if (value && typeof value === "object") {
    return value.value ?? value.display_value;
  }
  return value;
}

function booleanField(record, keys) {
  if (!record || typeof record !== "object") {
    return {
      present: false,
      value: null,
    };
  }
  for (const key of keys) {
    if (!Object.hasOwn(record, key)) {
      continue;
    }
    const value = scalar(record[key]);
    if (value === null || value === undefined || (typeof value === "string" && !value.trim())) {
      continue;
    }
    return {
      present: true,
      value: typeof value === "string"
        ? [
          "true",
          "1",
          "yes",
        ].includes(value.trim().toLowerCase())
        : Boolean(value),
    };
  }
  return {
    present: false,
    value: null,
  };
}

function catalogItem(record) {
  if (record?.result && typeof record.result === "object") {
    return record.result;
  }
  return record && typeof record === "object"
    ? record
    : {};
}

function servicePortalCatalogItem(node) {
  if (typeof node === "string") {
    try {
      return servicePortalCatalogItem(JSON.parse(node));
    } catch {
      return {};
    }
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      const match = servicePortalCatalogItem(item);
      if (Object.keys(match).length > 0) {
        return match;
      }
    }
    return {};
  }
  if (!node || typeof node !== "object") {
    return {};
  }
  if (
    node.sc_cat_item
    && typeof node.sc_cat_item === "object"
    && (
      Object.hasOwn(node.sc_cat_item, "no_attachments")
      || Object.hasOwn(node.sc_cat_item, "mandatory_attachment")
    )
  ) {
    return node.sc_cat_item;
  }
  for (const value of Object.values(node)) {
    const match = servicePortalCatalogItem(value);
    if (Object.keys(match).length > 0) {
      return match;
    }
  }
  return {};
}

function itemTable(record, fallback) {
  const candidate = String(
    record?.sys_class_name
      ?? record?.sysClassName
      ?? record?.type
      ?? fallback
      ?? "",
  )
    .trim()
    .toLowerCase();
  if ([
    "record_producer",
    "sc_cat_item_producer",
  ].includes(candidate)) {
    return "sc_cat_item_producer";
  }
  return ITEM_TABLES.has(candidate)
    ? candidate
    : "sc_cat_item";
}

function errorCategory(error) {
  const status = error?.response?.status;
  if (Number.isInteger(status)) {
    return `http_${status}`;
  }
  return error?.name || "request_failed";
}

async function metadataRead(source, read) {
  try {
    return {
      source,
      value: await read(),
    };
  } catch (error) {
    return {
      source,
      error: {
        source,
        category: errorCategory(error),
      },
      value: {},
    };
  }
}

export function normalizeAttachmentPolicy({
  catalogRecord,
  tableRecord,
  portalRecord = {},
  table,
  errors = [],
}) {
  const mandatoryFields = [
    catalogRecord,
    tableRecord,
    portalRecord,
  ].map((record) => booleanField(record, [
    "mandatory_attachment",
    "mandatoryAttachment",
  ]));
  const hiddenFields = [
    catalogRecord,
    tableRecord,
    portalRecord,
  ].map((record) => booleanField(record, [
    "no_attachment_v2",
    "no_attachments",
    "no_attachment",
    "hide_attachment",
    "hideAttachment",
  ]));
  const mandatory = {
    present: mandatoryFields.some((field) => field.present),
    value: mandatoryFields.some((field) => field.present && field.value),
  };
  const hidden = {
    present: hiddenFields.some((field) => field.present),
    value: hiddenFields.some((field) => field.present && field.value),
  };

  let policy = "unknown";
  if (hidden.present && hidden.value === true) {
    policy = "prohibited";
  } else if (
    (mandatory.present && mandatory.value === true)
    || (hidden.present && hidden.value === false)
  ) {
    policy = "allowed";
  }

  return {
    sys_id: String(catalogRecord?.sys_id ?? tableRecord?.sys_id ?? ""),
    sys_class_name: table,
    target_table: String(
      scalar(tableRecord?.table_name)
      ?? scalar(catalogRecord?.table_name)
      ?? scalar(portalRecord?.table_name)
      ?? "",
    ),
    policy,
    supported: policy === "unknown"
      ? null
      : policy === "allowed",
    required: mandatory.value === true,
    field_presence: {
      mandatory_attachment: mandatory.present,
      no_attachment: hidden.present,
    },
    policy_fields: {
      required: "mandatory_attachment",
      prohibited: "no_attachment_v2",
      requested: POLICY_FIELDS,
    },
    sources: {
      service_catalog: Object.keys(catalogRecord ?? {}).length > 0,
      concrete_table: Object.keys(tableRecord ?? {}).length > 0,
      service_portal: Object.keys(portalRecord ?? {}).length > 0,
    },
    ...(errors.length
      ? {
        metadata_errors: errors,
      }
      : {}),
    ...(!hidden.present
      ? {
        policy_diagnostic: "The connector could not read no_attachment_v2; verify the ServiceNow field ACL and inbound REST policy.",
      }
      : {}),
  };
}

export default {
  key: "servicenow-get-catalog-attachment-policy",
  name: "Get Catalog Attachment Policy",
  description: "Determines whether a ServiceNow catalog item or record producer allows, prohibits, or requires file attachments. Use before **Upload Attachment**. Missing metadata is returned as `unknown`, never as prohibited. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    servicenow,
    catalogItemSysId: {
      propDefinition: [
        servicenow,
        "catalogItemSysId",
      ],
    },
    sysClassName: {
      type: "string",
      label: "System Class Name",
      description: "Optional concrete catalog table. Use **Search Catalog Items** to find it in the `sys_class_name` response field. Example: `sc_cat_item_producer`.",
      optional: true,
    },
  },
  async run({ $ }) {
    assertSysId(this.catalogItemSysId, "Catalog Item Sys ID");

    const catalogRead = metadataRead("service_catalog", async () => catalogItem(
      await this.servicenow.getCatalogItem({
        catalogItemSysId: this.catalogItemSysId,
      }),
    ));
    const portalRead = metadataRead("service_portal", async () => {
      const portalPage = await this.servicenow.getServicePortalCatalogItem({
        catalogItemSysId: this.catalogItemSysId,
      });
      const record = servicePortalCatalogItem(portalPage);
      return {
        record,
        responseShape: Array.isArray(portalPage)
          ? "array"
          : {
            keys: Object.keys(portalPage ?? {}).slice(0, 10),
            result_type: typeof portalPage?.result,
            result_keys: portalPage?.result && typeof portalPage.result === "object"
              ? Object.keys(portalPage.result).slice(0, 10)
              : [],
          },
      };
    });

    const hintedTable = this.sysClassName
      ? itemTable({}, this.sysClassName)
      : null;
    const tableReadFor = (table) => metadataRead("concrete_table", async () => {
      const rows = await this.servicenow.getTableRecords({
        table,
        params: {
          sysparm_query: `sys_id=${this.catalogItemSysId}`,
          sysparm_fields: POLICY_FIELDS.join(","),
          sysparm_display_value: "false",
          sysparm_exclude_reference_link: true,
          sysparm_limit: 1,
        },
      });
      return Array.isArray(rows)
        ? (rows[0] ?? {})
        : {};
    });

    const hintedTableRead = hintedTable
      ? tableReadFor(hintedTable)
      : null;
    const [
      catalogResult,
      portalResult,
    ] = await Promise.all([
      catalogRead,
      portalRead,
    ]);
    const catalogRecord = catalogResult.value;
    const table = hintedTable ?? itemTable(catalogRecord, this.sysClassName);
    const tableResult = hintedTableRead
      ? await hintedTableRead
      : await tableReadFor(table);
    const tableRecord = tableResult.value;
    const portalRecord = portalResult.value.record ?? {};
    const errors = [
      catalogResult.error,
      tableResult.error,
      portalResult.error,
    ].filter(Boolean);
    if (!portalResult.error && Object.keys(portalRecord).length === 0) {
      errors.push({
        source: "service_portal",
        category: "missing_attachment_metadata",
        response_shape: portalResult.value.responseShape,
      });
    }

    const result = normalizeAttachmentPolicy({
      catalogRecord,
      tableRecord,
      portalRecord,
      table,
      errors,
    });
    if (!result.sys_id) {
      result.sys_id = this.catalogItemSysId;
    }
    $.export("$summary", `Attachment policy for ${this.catalogItemSysId}: ${result.policy}`);
    return result;
  },
};
