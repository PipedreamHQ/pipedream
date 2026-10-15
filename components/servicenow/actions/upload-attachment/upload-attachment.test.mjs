import assert from "node:assert/strict";
import { test } from "node:test";
import servicenow from "../../servicenow.app.mjs";
import action, { decodeAttachment } from "./upload-attachment.mjs";

const TABLE_SYS_ID = "a".repeat(32);
const ATTACHMENT_SYS_ID = "b".repeat(32);

function actionContext(overrides = {}, { uploadError } = {}) {
  const uploadCalls = [];
  return {
    ...action,
    tableName: "sc_request",
    tableSysId: TABLE_SYS_ID,
    fileName: "evidence.pdf",
    contentType: "application/pdf",
    contentBase64: Buffer.from("binary-content").toString("base64"),
    servicenow: {
      async uploadAttachment(args) {
        uploadCalls.push(args);
        if (uploadError) {
          throw uploadError;
        }
        return {
          sys_id: ATTACHMENT_SYS_ID,
        };
      },
      uploadCalls,
    },
    ...overrides,
  };
}

function exportProbe() {
  const calls = [];
  return {
    export(...args) {
      calls.push(args);
    },
    calls,
  };
}

test("calls the ServiceNow Attachment API with query parameters and raw bytes", async () => {
  const content = Buffer.from("binary-content");
  const requestCalls = [];
  const context = {
    ...servicenow.methods,
    async _makeRequest(args) {
      requestCalls.push(args);
      return {
        sys_id: ATTACHMENT_SYS_ID,
      };
    },
  };

  await servicenow.methods.uploadAttachment.call(context, {
    tableName: "sc_request",
    tableSysId: TABLE_SYS_ID,
    fileName: "evidence.pdf",
    contentType: "application/pdf",
    data: content,
  });

  assert.deepEqual(requestCalls, [
    {
      method: "post",
      url: "/attachment/file",
      headers: {
        "Content-Type": "application/pdf",
      },
      params: {
        table_name: "sc_request",
        table_sys_id: TABLE_SYS_ID,
        file_name: "evidence.pdf",
      },
      data: content,
    },
  ]);
});

test("decodes base64 without changing bytes", () => {
  const content = Buffer.from([
    0,
    1,
    127,
    128,
    255,
  ]);

  assert.deepEqual(decodeAttachment(content.toString("base64")), content);
});

test("uploads raw bytes with record and MIME metadata", async () => {
  const context = actionContext();
  const $ = exportProbe();

  const result = await action.run.call(context, {
    $,
  });

  assert.deepEqual(result, {
    sys_id: ATTACHMENT_SYS_ID,
  });
  assert.deepEqual(context.servicenow.uploadCalls, [
    {
      $,
      tableName: "sc_request",
      tableSysId: TABLE_SYS_ID,
      fileName: "evidence.pdf",
      contentType: "application/pdf",
      data: Buffer.from("binary-content"),
    },
  ]);
  assert.deepEqual($.calls, [
    [
      "$summary",
      `Successfully uploaded attachment "evidence.pdf" with ID ${ATTACHMENT_SYS_ID}`,
    ],
  ]);
});

for (const [
  label,
  overrides,
  error,
] of [
  [
    "malformed base64",
    {
      contentBase64: "not base64!",
    },
    /valid base64/,
  ],
  [
    "invalid sys_id",
    {
      tableSysId: "not-a-sys-id",
    },
    /32-character hexadecimal/,
  ],
  [
    "invalid table name",
    {
      tableName: "sc_request?bad=true",
    },
    /letters, numbers, and underscores/,
  ],
]) {
  test(`rejects ${label}`, async () => {
    const context = actionContext(overrides);

    await assert.rejects(
      action.run.call(context, {
        $: exportProbe(),
      }),
      error,
    );
    assert.deepEqual(context.servicenow.uploadCalls, []);
  });
}

test("propagates ServiceNow upload errors", async () => {
  const expected = new Error("ServiceNow rejected upload");
  const context = actionContext({}, {
    uploadError: expected,
  });

  await assert.rejects(
    action.run.call(context, {
      $: exportProbe(),
    }),
    (error) => {
      assert.equal(error, expected);
      return true;
    },
  );
});
