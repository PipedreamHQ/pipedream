/**
 * Tests for the _resolveCloudId logic in jira.app.mjs.
 *
 * Run directly (no Jest required):
 *   node components/jira/common/__tests__/resolve-cloud-id.test.mjs
 */

/* eslint-disable no-console */

import assert from "node:assert/strict";

function buildApp({
  getCloudsResult, getCloudsError,
} = {}) {
  return {
    _cloudId: null,

    async getClouds() {
      if (getCloudsError) throw getCloudsError;
      return getCloudsResult;
    },

    async _resolveCloudId() {
      if (this._cloudId) {
        return this._cloudId;
      }

      let clouds;
      try {
        clouds = await this.getClouds();
      } catch (err) {
        throw new Error(`Unable to retrieve your Jira Cloud instance. Please check your connection. (${err.message})`);
      }

      if (!clouds?.length) {
        throw new Error("No Jira Cloud instances found. Please reconnect your Jira account and confirm site access was granted.");
      }

      if (clouds.length > 1) {
        const names = clouds.map((c) => `"${c.name}"`).join(", ");
        console.log(`Multiple Jira Cloud instances found (${names}). Using "${clouds[0].name}" (${clouds[0].id}).`);
      }

      this._cloudId = clouds[0].id;
      return this._cloudId;
    },

    async _makeRequest({
      url, path, cloudId,
    } = {}) {
      if (url) {
        return {
          resolvedCloudId: cloudId ?? null,
          url,
        };
      }
      const resolved = cloudId ?? await this._resolveCloudId();
      return {
        resolvedCloudId: resolved,
        url: `https://api.atlassian.com/ex/jira/${resolved}/rest/api/3${path}`,
      };
    },
  };
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function run() {
  console.log("\njira _resolveCloudId");

  await test("resolves cloudId from getClouds on first call", async () => {
    const app = buildApp({
      getCloudsResult: [
        {
          id: "abc123",
          name: "My Workspace",
        },
      ],
    });
    const id = await app._resolveCloudId();
    assert.equal(id, "abc123");
  });

  await test("caches the result and does not call getClouds again", async () => {
    let callCount = 0;
    const app = buildApp({
      getCloudsResult: [
        {
          id: "cached-id",
          name: "Workspace",
        },
      ],
    });
    const original = app.getClouds.bind(app);
    app.getClouds = async () => {
      callCount++;
      return original();
    };

    await app._resolveCloudId();
    await app._resolveCloudId();
    await app._resolveCloudId();

    assert.equal(callCount, 1, "getClouds should only be called once");
    assert.equal(app._cloudId, "cached-id");
  });

  await test("throws ConfigurationError when getClouds returns empty array", async () => {
    const app = buildApp({
      getCloudsResult: [],
    });
    await assert.rejects(
      () => app._resolveCloudId(),
      /No Jira Cloud instances found/,
    );
  });

  await test("throws ConfigurationError when getClouds returns null", async () => {
    const app = buildApp({
      getCloudsResult: null,
    });
    await assert.rejects(
      () => app._resolveCloudId(),
      /No Jira Cloud instances found/,
    );
  });

  await test("throws ConfigurationError wrapping the original error when getClouds fails", async () => {
    const app = buildApp({
      getCloudsError: new Error("Network timeout"),
    });
    await assert.rejects(
      () => app._resolveCloudId(),
      /Unable to retrieve your Jira Cloud instance/,
    );
    await assert.rejects(
      () => app._resolveCloudId(),
      /Network timeout/,
    );
  });

  await test("picks first cloud and logs when multiple instances are found", async () => {
    const logs = [];
    const app = buildApp({
      getCloudsResult: [
        {
          id: "first",
          name: "Prod",
        },
        {
          id: "second",
          name: "Staging",
        },
      ],
    });

    const originalLog = console.log;
    let id;
    try {
      console.log = (...args) => logs.push(args.join(" "));
      id = await app._resolveCloudId();
    } finally {
      console.log = originalLog;
    }

    assert.equal(id, "first", "should pick the first cloud");
    assert.ok(
      logs.some((l) => l.includes("Prod") && l.includes("Staging")),
      "should log the available instance names",
    );
  });

  await test("_makeRequest auto-resolves cloudId when not provided", async () => {
    const app = buildApp({
      getCloudsResult: [
        {
          id: "auto-resolved",
          name: "Workspace",
        },
      ],
    });
    const result = await app._makeRequest({
      path: "/issue/PROJ-1",
    });
    assert.equal(result.resolvedCloudId, "auto-resolved");
    assert.ok(result.url.includes("auto-resolved"), "URL should contain the resolved cloud ID");
  });

  await test("_makeRequest uses provided cloudId without calling getClouds", async () => {
    let getCloudsWasCalled = false;
    const app = buildApp({
      getCloudsResult: [
        {
          id: "should-not-be-used",
          name: "Workspace",
        },
      ],
    });
    app.getClouds = async () => {
      getCloudsWasCalled = true;
      return [];
    };

    const result = await app._makeRequest({
      cloudId: "explicit-id",
      path: "/issue/PROJ-1",
    });

    assert.equal(result.resolvedCloudId, "explicit-id");
    assert.equal(getCloudsWasCalled, false, "getClouds should not be called when cloudId is provided");
  });

  await test("_makeRequest uses the full url directly when provided, skipping cloudId resolution", async () => {
    let getCloudsWasCalled = false;
    const app = buildApp();
    app.getClouds = async () => {
      getCloudsWasCalled = true;
      return [];
    };

    const result = await app._makeRequest({
      url: "https://custom.endpoint/api",
    });

    assert.equal(result.url, "https://custom.endpoint/api");
    assert.equal(getCloudsWasCalled, false);
  });

  console.log(`\n${passed} passing, ${failed} failing\n`);
  if (failed > 0) process.exit(1);
}

run();
