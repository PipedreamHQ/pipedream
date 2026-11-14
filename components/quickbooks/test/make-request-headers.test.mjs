import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import quickbooks from "../quickbooks.app.mjs";

test("_makeRequest preserves authorization when an upload adds Content-Type", async (t) => {
  let captured;
  const server = http.createServer((request, response) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      captured = {
        body: Buffer.concat(chunks),
        headers: request.headers,
      };
      response.writeHead(200, {
        "Content-Type": "application/json",
      });
      response.end("{}");
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());

  const fakeApp = Object.assign(Object.create(quickbooks.methods), {
    $auth: {
      company_id: "company-123",
      oauth_access_token: "test-access-token",
    },
    _apiUrl: () => `http://127.0.0.1:${server.address().port}`,
  });

  await fakeApp._makeRequest({
    path: "company/company-123/upload",
    method: "post",
    data: Buffer.from("multipart-body"),
    headers: {
      "Content-Type": "multipart/form-data; boundary=qbo-boundary",
    },
  });

  assert.equal(captured.headers.authorization, "Bearer test-access-token");
  assert.equal(captured.headers["content-type"], "multipart/form-data; boundary=qbo-boundary");
  assert.deepEqual(captured.body, Buffer.from("multipart-body"));
});
