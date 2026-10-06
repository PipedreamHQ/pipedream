import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";

const REQUIRE = createRequire(import.meta.url);
const argument = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  if (!process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
    throw new Error(`Missing value for ${name}`);
  }
  return path.resolve(process.argv[index + 1]);
};
const CLIENT_ROOT = argument("--client-root")
  ?? path.dirname(path.dirname(REQUIRE.resolve("@html-css-to-image/client")));
const CLIENT_PACKAGE = JSON.parse(fs.readFileSync(path.join(CLIENT_ROOT, "package.json"), "utf8"));
const COMPONENT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const COMPONENT_PACKAGE = JSON.parse(fs.readFileSync(path.join(COMPONENT_ROOT, "package.json"), "utf8"));
if (COMPONENT_PACKAGE.dependencies[CLIENT_PACKAGE.name] !== CLIENT_PACKAGE.version) {
  throw new Error("The installed client must match the exact version pinned in dependencies.");
}
const SOURCE_PATH = path.join(CLIENT_ROOT, "dist/types/request.d.ts");
const SOURCE = ts.createSourceFile(SOURCE_PATH, fs.readFileSync(SOURCE_PATH, "utf8"), ts.ScriptTarget.Latest, true);
const DECLARATIONS = new Map();
const ALIASES = new Map();
for (const statement of SOURCE.statements) {
  if (ts.isClassDeclaration(statement) || ts.isInterfaceDeclaration(statement)) {
    DECLARATIONS.set(statement.name.text, statement);
  }
  if (ts.isTypeAliasDeclaration(statement)) {
    ALIASES.set(statement.name.text, statement.type);
  }
}

const camelCase = (value) => value.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
const INITIALISMS = { css: "CSS", html: "HTML", id: "ID", pdf: "PDF", url: "URL", ms: "MS", hcti: "HCTI" };
const label = (value) => value.split("_").map((part) => INITIALISMS[part] ?? `${part[0].toUpperCase()}${part.slice(1)}`).join(" ");
const getProperties = (name) => {
  const declaration = DECLARATIONS.get(name);
  if (!declaration) throw new Error(`Missing client declaration: ${name}`);
  return declaration.members
    .filter((member) => ts.isPropertyDeclaration(member) || ts.isPropertySignature(member))
    .filter((member) => member.name.text !== "__type")
    .map((member) => ({
      apiName: member.name.text,
      type: member.type,
      optional: Boolean(member.questionToken),
      description: ts.getJSDocCommentsAndTags(member)
        .filter(ts.isJSDoc)
        .map((doc) => typeof doc.comment === "string" ? doc.comment : (doc.comment ?? []).map((part) => part.text).join(""))
        .join(" ").replace(/\s+/g, " ").trim(),
    }));
};
const resolveType = (type) => {
  if (ts.isTypeReferenceNode(type) && ALIASES.has(type.typeName.getText(SOURCE))) {
    return resolveType(ALIASES.get(type.typeName.getText(SOURCE)));
  }
  return type;
};

// Pipedream presentation and validation hints only. API types, names, enum values,
// requiredness, and the primary descriptions always come from the client.
const HINTS = {
  html: { example: "<div>Hello world</div>" },
  css: { example: "body { background: white; }" },
  url: { example: "https://example.com" },
  selector: { example: ".card" },
  device_scale: { example: "1.5", guidance: "Enter a positive number; fractional values are supported.", type: "string" },
  viewport_width: { example: "1200", guidance: "Supply Viewport Height together with this value.", min: 1 },
  viewport_height: { example: "630", guidance: "Supply Viewport Width together with this value.", min: 1 },
  jumbo_max_width: { example: "10000", guidance: "Supply Jumbo Max Height together with this value.", min: 1 },
  jumbo_max_height: { example: "10000", guidance: "Supply Jumbo Max Width together with this value.", min: 1 },
  ms_delay: { example: "1000", min: 0 },
  max_wait_ms: { example: "5000", min: 0 },
  dedupe_duration_s: { example: "3600", label: "Deduplication Duration (Seconds)", min: 0 },
  timezone: { example: "America/New_York" },
  google_fonts: { example: '["Roboto", "Open Sans"]' },
  headers: { example: '{"Authorization": "Bearer token"}', label: "Webpage Headers", type: "object", secret: true, guidance: "These authenticate the webpage, not the HTML/CSS to Image API." },
  additional_header_origins: { example: '["https://api.example.com"]' },
  proxy_id: { example: "your-proxy-id", guidance: "Find the ID in the Proxies section of the HTML/CSS to Image dashboard." },
  storage_destination_id: { example: "your-storage-destination-id", guidance: "Find the ID in the Storage Destinations section of the HTML/CSS to Image dashboard." },
  template_id: { example: "t-b0354248-e7f6-4cca-81c6-2b4a70a16388", guidance: "Use **List Templates** and read the `id` field." },
  template_version: { example: "1594409399761", guidance: "Use **List Templates** and read the `version` field for its latest version. Omit to use the latest version at execution time.", min: 1 },
  template_values: { example: '{"title": "Hello", "price": 19.99, "featured": true}', type: "object", guidance: "Names must match your template. Use `{}` for a template without variables." },
  "pdf.scale": { example: "0.75", type: "string", guidance: "Enter a number from 0.1 to 2." },
  "pdf.page_width": { example: "8.5in", type: "string", guidance: "Include a px, in, cm, or mm unit." },
  "pdf.page_height": { example: "11in", type: "string", guidance: "Include a px, in, cm, or mm unit." },
  "pdf.margins": { example: '["1cm", "1cm", "1cm", "1cm"]', type: "string[]", guidance: "Exactly four dimensions in top, right, bottom, left order. Units: px, in, cm, mm." },
};
const toProp = (property, prefix = "") => {
  const hint = HINTS[`${prefix}${property.apiName}`] ?? {};
  const type = resolveType(property.type);
  let propType;
  let options;
  if (type.kind === ts.SyntaxKind.StringKeyword) propType = "string";
  else if (type.kind === ts.SyntaxKind.BooleanKeyword) propType = "boolean";
  else if (type.kind === ts.SyntaxKind.NumberKeyword) propType = "integer";
  else if (ts.isArrayTypeNode(type) && type.elementType.kind === ts.SyntaxKind.StringKeyword) propType = "string[]";
  else if (ts.isUnionTypeNode(type) && type.types.every((item) => ts.isLiteralTypeNode(item) && ts.isStringLiteral(item.literal))) {
    propType = "string";
    options = type.types.map((item) => item.literal.text);
  }
  propType = hint.type ?? propType;
  if (!propType) throw new Error(`Unsupported client type for ${prefix}${property.apiName}: ${type.getText(SOURCE)}. Add an explicit Pipedream adapter or exclusion.`);
  const example = hint.example ?? options?.[0] ?? (propType === "boolean" ? "true" : propType === "integer" ? "100" : "example");
  if (!property.description) throw new Error(`Missing client JSDoc for ${property.apiName}`);
  return {
    type: propType,
    label: hint.label ?? `${prefix ? "PDF " : ""}${label(property.apiName)}`,
    description: `${property.description}${hint.guidance ? ` ${hint.guidance}` : ""} Example: \`${example}\`.`,
    ...(property.optional ? { optional: true } : {}),
    ...(options ? { options } : {}),
    ...(hint.min !== undefined ? { min: hint.min } : {}),
    ...(hint.secret ? { secret: true } : {}),
  };
};

const PROP_DEFINITIONS = {};
const API_NAMES = {};
const NUMBER_PARAMETERS = [];
const PDF_API_NAMES = {};
const addProperty = (property, prefix = "") => {
  const parameter = `${prefix ? "pdf_" : ""}${property.apiName}`;
  const name = camelCase(parameter);
  const definition = toProp(property, prefix);
  // CSS occurs on both models; URL-specific guidance is a useful shared definition.
  PROP_DEFINITIONS[name] = definition;
  (prefix ? PDF_API_NAMES : API_NAMES)[name] = property.apiName;
  if (resolveType(property.type).kind === ts.SyntaxKind.NumberKeyword) NUMBER_PARAMETERS.push(name);
  return name;
};
// Nested PDF options get their own native controls below. Request override rules
// are intentionally outside this first update, rather than silently dropped.
const EXCLUDED_SHARED = ["pdf_options", "request_overrides"];
const SHARED = getProperties("BaseCreateImageRequest")
  .filter((property) => !EXCLUDED_SHARED.includes(property.apiName)).map((property) => addProperty(property));
const HTML = getProperties("CreateHtmlCssImageRequest").map((property) => addProperty(property));
const URL = getProperties("CreateUrlImageRequest").map((property) => addProperty(property));
const TEMPLATE = getProperties("CreateTemplatedImageRequest").map((property) => addProperty(property));
const PDF = getProperties("PDFOptions").map((property) => addProperty(property, "pdf."));
// The official generateCreateAndRenderUrl helper omits these parameters.
// Generate the signed action's fields from the same model, excluding controls
// that would otherwise be accepted by the UI but silently ignored at signing.
// The helper also omits false disable_twemoji values, so it cannot express the
// webpage model's "false injects Twemoji" behavior. Leave that control out.
const SIGNED_URL_EXCLUDED = ["dedupeDurationS", "disableTwemoji"];
const requiredFirst = (parameters) => parameters.sort((left, right) =>
  Number(Boolean(PROP_DEFINITIONS[left].optional)) - Number(Boolean(PROP_DEFINITIONS[right].optional)));
const HTML_PROP_OVERRIDES = Object.fromEntries(getProperties("CreateHtmlCssImageRequest")
  .filter((property) => URL.includes(camelCase(property.apiName)))
  .map((property) => [camelCase(property.apiName), { description: toProp(property).description }]));
const EXPORTS = {
  propDefinitions: PROP_DEFINITIONS,
  apiNameByParameter: API_NAMES,
  numericParameters: [...new Set(NUMBER_PARAMETERS)],
  pdfApiNameByParameter: PDF_API_NAMES,
  htmlParameters: requiredFirst([...HTML, ...SHARED, ...PDF]),
  urlParameters: requiredFirst([...URL, ...SHARED, ...PDF]),
  templateParameters: requiredFirst(TEMPLATE),
  signedUrlParameters: requiredFirst([...URL, ...SHARED]
    .filter((parameter) => !SIGNED_URL_EXCLUDED.includes(parameter))),
  htmlPropOverrides: HTML_PROP_OVERRIDES,
};
const serialize = (value, indent = 0) => {
  const padding = "  ".repeat(indent);
  if (Array.isArray(value)) return `[\n${value.map((item) => `${padding}  ${serialize(item, indent + 1)},\n`).join("")}${padding}]`;
  if (value !== null && typeof value === "object") {
    return `{\n${Object.entries(value).map(([key, item]) => `${padding}  ${key}: ${serialize(item, indent + 1)},\n`).join("")}${padding}}`;
  }
  return JSON.stringify(value);
};
const CONTENTS = `/*\n * Generated from ${CLIENT_PACKAGE.name}@${CLIENT_PACKAGE.version} (dist/types/request.d.ts).\n * Do not edit by hand. Run: npm run generate:client\n */\n\n${Object.entries(EXPORTS).map(([name, value]) => `export const ${name} = ${serialize(value)};\n`).join("\n")}`;
const OUTPUT_PATH = argument("--output") ?? path.join(COMPONENT_ROOT, "common/generated-props.mjs");
if (process.argv.includes("--check")) {
  if (!fs.existsSync(OUTPUT_PATH) || fs.readFileSync(OUTPUT_PATH, "utf8") !== CONTENTS) {
    throw new Error("Generated client props are stale. Run npm run generate:client and commit common/generated-props.mjs.");
  }
} else {
  fs.writeFileSync(OUTPUT_PATH, CONTENTS);
}
