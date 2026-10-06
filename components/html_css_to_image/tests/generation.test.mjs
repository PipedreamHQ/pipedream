import assert from "node:assert/strict";
import nodeTest from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import {
  fileURLToPath, pathToFileURL,
} from "node:url";
import {
  propDefinitions,
  htmlParameters,
  urlParameters,
  templateParameters,
  signedUrlParameters,
} from "../common/generated-props.mjs";
import {
  htmlClientProps,
  urlClientProps,
  templateClientProps,
  signedUrlClientProps,
} from "../common/rendering-props.mjs";

const REQUIRE = createRequire(import.meta.url);
const CLIENT_ROOT = path.dirname(path.dirname(REQUIRE.resolve("@html-css-to-image/client")));
const SCRIPT = fileURLToPath(new URL("../scripts/generate-client-props.mjs", import.meta.url));
const SOURCE = fs.readFileSync(path.join(CLIENT_ROOT, "dist/types/request.d.ts"), "utf8");
const makeFixture = (context, source) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hcti-pipedream-generation-"));
  context.after(() => fs.rmSync(root, {
    recursive: true,
    force: true,
  }));
  fs.mkdirSync(path.join(root, "dist/types"), {
    recursive: true,
  });
  fs.copyFileSync(path.join(CLIENT_ROOT, "package.json"), path.join(root, "package.json"));
  fs.writeFileSync(path.join(root, "dist/types/request.d.ts"), source);
  const output = path.join(root, "generated.mjs");
  return {
    output,
    generate: (...args) => spawnSync(process.execPath, [
      SCRIPT,
      "--client-root",
      root,
      "--output",
      output,
      ...args,
    ], {
      encoding: "utf8",
    }),
  };
};

nodeTest("client changes propagate to descriptions, enum choices, props, and API mappings", async (context) => {
  const fixture = makeFixture(context, SOURCE
    .replace("'png' | 'jpg' | 'webp' | 'pdf'", "'png' | 'jpg' | 'webp' | 'pdf' | 'avif'")
    .replace("A CSS selector to target a specific element on the page.", "Changed upstream selector guidance.")
    .replace("export declare abstract class BaseCreateImageRequest {", "export declare abstract class BaseCreateImageRequest {\n/** Newly added upstream option. */\nfuture_option?: boolean;"));
  const result = fixture.generate();
  assert.equal(result.status, 0, result.stderr);
  const generated = await import(pathToFileURL(fixture.output).href);
  assert.match(generated.propDefinitions.selector.description, /Changed upstream selector guidance/);
  assert.ok(generated.propDefinitions.format.options.includes("avif"));
  assert.equal(generated.propDefinitions.futureOption.type, "boolean");
  assert.equal(generated.apiNameByParameter.futureOption, "future_option");
  assert.ok(generated.htmlParameters.includes("futureOption"));
  assert.ok(generated.urlParameters.includes("futureOption"));
  assert.ok(!generated.templateParameters.includes("futureOption"));
});

nodeTest("unsupported new client types require an explicit adapter", (context) => {
  const fixture = makeFixture(context, SOURCE.replace(
    "export declare abstract class BaseCreateImageRequest {",
    "export declare abstract class BaseCreateImageRequest {\n/** Unsupported new option. */\nfuture_option?: Date;",
  ));
  const result = fixture.generate();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsupported client type for future_option/);
});

nodeTest("freshness check detects stale generated files", (context) => {
  const fixture = makeFixture(context, SOURCE);
  assert.equal(fixture.generate().status, 0);
  assert.equal(fixture.generate("--check").status, 0);
  fs.appendFileSync(fixture.output, "// stale edit\n");
  const result = fixture.generate("--check");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Generated client props are stale/);
});

nodeTest("every generated input reaches its action and required inputs precede optional ones", () => {
  for (const [
    parameters,
    props,
  ] of [
      [
        htmlParameters,
        htmlClientProps,
      ],
      [
        urlParameters,
        urlClientProps,
      ],
      [
        templateParameters,
        templateClientProps,
      ],
      [
        signedUrlParameters,
        signedUrlClientProps,
      ],
    ]) {
    assert.deepEqual(Object.keys(props), parameters);
    let optionalSeen = false;
    for (const parameter of parameters) {
      const definition = propDefinitions[parameter];
      assert.ok(definition.description);
      if (definition.optional) optionalSeen = true;
      else assert.equal(optionalSeen, false, `${parameter} must precede optional inputs`);
    }
  }
  assert.ok(!propDefinitions.html.optional);
  assert.ok(!propDefinitions.url.optional);
  assert.ok(!propDefinitions.templateId.optional);
  assert.ok(!propDefinitions.templateValues.optional);
});
