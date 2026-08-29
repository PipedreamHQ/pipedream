import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import test from "node:test";
import action from "../actions/upload-customer-attachment/upload-customer-attachment.mjs";

test("uploads a customer attachment and reads it back", async () => {
  const testFile = "/tmp/qbo-upload-customer-attachment-test.jpg";
  await writeFile(testFile, Buffer.from([
    0xff,
    0xd8,
    0xff,
    0xd9,
  ]));

  let uploaded;
  const summaries = [];
  const quickbooks = {
    getCustomer: async ({ customerId }) => ({
      Customer: {
        Id: customerId,
        DisplayName: "John Herter",
      },
    }),
    uploadAttachable: async (request) => {
      uploaded = request;
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
    getAttachable: async ({ attachableId }) => ({
      Attachable: {
        Id: attachableId,
        FileName: "damage.jpg",
        ContentType: "image/jpeg",
        AttachableRef: [
          {
            EntityRef: {
              type: "Customer",
              value: "1357",
            },
          },
        ],
      },
    }),
  };

  const $ = {
    export: (...args) => summaries.push(args),
  };
  const result = await action.run.call({
    ...action,
    quickbooks,
    customerId: "1357",
    filePath: testFile,
    fileName: "damage.jpg",
    contentType: "image/jpeg",
  }, {
    $,
  });

  assert.equal(uploaded.contentType.startsWith("multipart/form-data; boundary="), true);
  assert.equal(uploaded.$, $);
  assert.notEqual(uploaded.body.indexOf(Buffer.from([
    0xff,
    0xd8,
    0xff,
    0xd9,
  ])), -1);
  assert.deepEqual(result, {
    attachableId: "9001",
    contentType: "image/jpeg",
    customerId: "1357",
    fileName: "damage.jpg",
    persisted: true,
  });
  assert.match(summaries[0][1], /9001/);
});

test("refuses to upload when QuickBooks returns a different customer", async () => {
  const testFile = "/tmp/qbo-upload-wrong-customer-test.jpg";
  await writeFile(testFile, Buffer.from([
    0xff,
    0xd8,
    0xff,
    0xd9,
  ]));
  let uploadCalled = false;
  const quickbooks = {
    getCustomer: async () => ({
      Customer: {
        Id: "different-customer",
      },
    }),
    uploadAttachable: async () => {
      uploadCalled = true;
    },
  };

  await assert.rejects(() => action.run.call({
    ...action,
    quickbooks,
    customerId: "1357",
    filePath: testFile,
    fileName: "damage.jpg",
    contentType: "image/jpeg",
  }, {
    $: {
      export: () => {},
    },
  }), /requested customer/i);
  assert.equal(uploadCalled, false);
});

test("fails closed when attachment read-back points to another customer", async () => {
  const testFile = "/tmp/qbo-upload-readback-mismatch-test.jpg";
  await writeFile(testFile, Buffer.from([
    0xff,
    0xd8,
    0xff,
    0xd9,
  ]));
  const quickbooks = {
    getCustomer: async () => ({
      Customer: {
        Id: "1357",
      },
    }),
    uploadAttachable: async () => ({
      AttachableResponse: [
        {
          Attachable: {
            Id: "9001",
          },
        },
      ],
    }),
    getAttachable: async () => ({
      Attachable: {
        Id: "9001",
        FileName: "damage.jpg",
        ContentType: "image/jpeg",
        AttachableRef: [
          {
            EntityRef: {
              type: "Customer",
              value: "other-customer",
            },
          },
        ],
      },
    }),
  };

  await assert.rejects(() => action.run.call({
    ...action,
    quickbooks,
    customerId: "1357",
    filePath: testFile,
    fileName: "damage.jpg",
    contentType: "image/jpeg",
  }, {
    $: {
      export: () => {},
    },
  }), /read-back.*requested customer/i);
});
