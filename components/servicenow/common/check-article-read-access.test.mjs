// Unit tests for Check Article Read Access, with stubbed ServiceNow calls. Run from the
// repository root:
// node --test components/servicenow/common/check-article-read-access.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import action from "../actions/check-article-read-access/check-article-read-access.mjs";

const id = (c) => c.repeat(32);

const requestError = (status, code) => Object.assign(new Error(status
  ? `HTTP ${status}`
  : code), {
  isAxiosError: true,
  code,
  response: status
    ? {
      status,
    }
    : undefined,
});

// Runs the action with `answer(articleId, params)` standing in for the Knowledge API.
async function run(articleIds, answer) {
  const calls = [];
  const summary = {};
  const self = {
    ...action.methods,
    articleSysIds: articleIds,
    servicenow: {
      async getKnowledgeArticle({
        articleId, params,
      }) {
        calls.push([
          articleId,
          params,
        ]);
        return answer(articleId, params);
      },
    },
  };
  const result = await action.run.call(self, {
    $: {
      export: (key, value) => {
        summary[key] = value;
      },
    },
  });
  return {
    result,
    calls,
    summary: summary.$summary,
  };
}

test("an article the Knowledge API returns is readable; an empty answer is not", async () => {
  const { result } = await run([
    id("1"),
    id("2"),
  ], (article) => (article === id("1")
    ? {
      sys_id: article,
      number: "KB0001",
    }
    : {}));
  assert.deepEqual(result, [
    {
      sys_id: id("1"),
      can_read: true,
      reason: "readable",
    },
    {
      sys_id: id("2"),
      can_read: false,
      reason: "not_readable",
    },
  ]);
});

test("an answer for another article is not a read of this one", async () => {
  const { result } = await run([
    id("1"),
  ], () => ({
    sys_id: id("9"),
  }));
  assert.deepEqual(result[0], {
    sys_id: id("1"),
    can_read: false,
    reason: "not_readable",
  });
});

test("asks once per distinct article, without counting a view", async () => {
  const { calls } = await run([
    id("1"),
    ` ${id("1")} `,
    id("2"),
  ], (article) => ({
    sys_id: article,
  }));
  assert.deepEqual(calls.map(([
    article,
  ]) => article).sort(), [
    id("1"),
    id("2"),
  ]);
  assert.ok(calls.every(([
    , params,
  ]) => !("update_view" in params) && !("search_id" in params)));
});

test("a 403 is unreadable and any other request error check_failed, per article", async () => {
  const { result } = await run([
    id("1"),
    id("2"),
    id("3"),
  ], (article) => {
    if (article === id("1")) throw requestError(403);
    if (article === id("2")) throw requestError(500);
    throw requestError(undefined, "ECONNRESET");
  });
  assert.deepEqual(result.map(({
    can_read, reason,
  }) => [
    can_read,
    reason,
  ]), [
    [
      null,
      "unreadable",
    ],
    [
      null,
      "check_failed",
    ],
    [
      null,
      "check_failed",
    ],
  ]);
});

test("a response that is not an article is check_failed, never readable", async () => {
  const { result } = await run([
    id("1"),
  ], () => "<html>maintenance</html>");
  assert.deepEqual(result[0], {
    sys_id: id("1"),
    can_read: null,
    reason: "check_failed",
  });
});

test("a broken connection (401) or a bug fails the whole action", async () => {
  await assert.rejects(run([
    id("1"),
  ], () => {
    throw requestError(401);
  }), /HTTP 401/);
  await assert.rejects(run([
    id("1"),
  ], () => {
    throw new TypeError("bug");
  }), /bug/);
});

test("rejects missing, too many, or malformed sys_ids before calling ServiceNow", async () => {
  const answer = () => assert.fail("ServiceNow was called");
  await assert.rejects(run([], answer), /1-50/);
  await assert.rejects(run(Array.from({
    length: 51,
  }, (_, i) => i.toString(16).padStart(32, "0")), answer), /1-50/);
  await assert.rejects(run([
    "KB0000017",
  ], answer), /32-character/);
});

test("the summary counts readable and undetermined articles", async () => {
  const { summary } = await run([
    id("1"),
    id("2"),
    id("3"),
  ], (article) => {
    if (article === id("3")) throw requestError(500);
    return article === id("1")
      ? {
        sys_id: article,
      }
      : {};
  });
  assert.equal(summary, "The connected user may read 1 of 3 article(s); 1 could not be determined");
});
