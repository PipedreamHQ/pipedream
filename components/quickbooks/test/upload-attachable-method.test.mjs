import assert from "node:assert/strict";
import test from "node:test";
import quickbooks from "../quickbooks.app.mjs";

test("uploadAttachable posts multipart bytes to the company upload endpoint", async () => {
  let captured;
  const fakeApp = {
    _companyId: () => "company-123",
    _makeRequest: async (request) => {
      captured = request;
      return {
        AttachableResponse: [
          {
            Attachable: {
              Id: "9001",
            },
          },
        ],
      };
    },
  };

  const body = Buffer.from("multipart-body");
  const $ = {
    export: () => {},
  };
  const response = await quickbooks.methods.uploadAttachable.call(fakeApp, {
    $,
    body,
    contentType: "multipart/form-data; boundary=qbo-boundary",
  });

  assert.deepEqual(captured, {
    path: "company/company-123/upload",
    method: "post",
    data: body,
    $,
    headers: {
      "Content-Type": "multipart/form-data; boundary=qbo-boundary",
    },
  });
  assert.equal(response.AttachableResponse[0].Attachable.Id, "9001");
});
