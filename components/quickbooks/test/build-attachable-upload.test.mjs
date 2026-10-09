import assert from "node:assert/strict";
import test from "node:test";
import { buildAttachableUpload } from "../common/build-attachable-upload.mjs";

test("builds a multipart upload linked to the requested QuickBooks entity", () => {
  const file = Buffer.from([
    0,
    1,
    2,
    255,
  ]);
  const result = buildAttachableUpload({
    boundary: "qbo-boundary",
    contentType: "image/jpeg",
    entityId: "1357",
    entityType: "Customer",
    file,
    fileName: "damage.jpg",
  });

  assert.equal(result.contentType, "multipart/form-data; boundary=qbo-boundary");
  const body = result.body.toString("latin1");
  assert.match(body, /name="file_metadata_01"/);
  assert.match(body, /"type":"Customer"/);
  assert.match(body, /"value":"1357"/);
  assert.match(body, /"FileName":"damage.jpg"/);
  assert.match(body, /name="file_content_01"; filename="damage.jpg"/);
  assert.match(body, /Content-Type: image\/jpeg/);
  assert.notEqual(result.body.indexOf(file), -1);
  assert.ok(body.endsWith("--qbo-boundary--\r\n"));
});

test("rejects multipart header injection through the filename", () => {
  assert.throws(() => buildAttachableUpload({
    boundary: "qbo-boundary",
    contentType: "image/jpeg",
    entityId: "1357",
    entityType: "Customer",
    file: Buffer.from("image"),
    fileName: "damage.jpg\r\nX-Injected: true",
  }), /file name/i);
});

test("rejects backslashes in quoted multipart filenames", () => {
  assert.throws(() => buildAttachableUpload({
    boundary: "qbo-boundary",
    contentType: "image/jpeg",
    entityId: "1357",
    entityType: "Customer",
    file: Buffer.from("image"),
    fileName: "damage\\.jpg",
  }), /file name/i);
});

test("rejects an unsafe MIME type before building the request", () => {
  assert.throws(() => buildAttachableUpload({
    boundary: "qbo-boundary",
    contentType: "image/jpeg\r\nX-Injected: true",
    entityId: "1357",
    entityType: "Customer",
    file: Buffer.from("image"),
    fileName: "damage.jpg",
  }), /content type/i);
});
