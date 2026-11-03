import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import app from "../servicenow_service_account.app.mjs";
import {
  DESCRIPTION_REWRITES,
  DOCUMENTATION_LINK,
} from "./constants.mjs";

function repointProps(props) {
  return Object.fromEntries(
    Object.entries(props).map(([
      name,
      prop,
    ]) => {
      if (prop?.type === "app") {
        return [
          name,
          app,
        ];
      }
      if (prop?.propDefinition) {
        const [
          , ...definition
        ] = prop.propDefinition;
        return [
          name,
          {
            ...prop,
            propDefinition: [
              app,
              ...definition,
            ],
          },
        ];
      }
      return [
        name,
        prop,
      ];
    }),
  );
}

function withNote(description, note) {
  if (!note) {
    return description;
  }
  const linkStart = description.indexOf(DOCUMENTATION_LINK);
  return linkStart === -1
    ? `${description} ${note}`
    : `${description.slice(0, linkStart)} ${note}${description.slice(linkStart)}`;
}

function rewriteDescription(description) {
  return DESCRIPTION_REWRITES.reduce(
    (text, [
      from,
      to,
    ]) => text.split(from).join(to),
    description,
  );
}

function withRewrittenDescriptions(props) {
  return Object.fromEntries(
    Object.entries(props).map(([
      name,
      prop,
    ]) => [
      name,
      typeof prop?.description === "string"
        ? {
          ...prop,
          description: rewriteDescription(prop.description),
        }
        : prop,
    ]),
  );
}

function withPropDescriptions(props, propDescriptions) {
  return Object.fromEntries(
    Object.entries(props).map(([
      name,
      prop,
    ]) => [
      name,
      propDescriptions[name]
        ? {
          ...prop,
          description: propDescriptions[name],
        }
        : prop,
    ]),
  );
}

export function wrapAction(action, {
  key, version, description: descriptionOverride, example, note, propDescriptions = {},
}) {
  const description = withNote(
    withNote(descriptionOverride ?? rewriteDescription(action.description), note),
    example && `Example: ${example}`,
  );
  return {
    ...action,
    key,
    version,
    ai: "optimized",
    description,
    props: withPropDescriptions(
      withRewrittenDescriptions(repointProps(action.props)),
      propDescriptions,
    ),
  };
}

export function referenceId(value) {
  if (value && typeof value === "object") {
    return String(value.value ?? "").trim();
  }
  return String(value ?? "").trim();
}

export function groupByReference(rows, referenceField) {
  const groups = new Map();
  for (const row of rows) {
    const parentId = referenceId(row[referenceField]);
    if (!groups.has(parentId)) {
      groups.set(parentId, []);
    }
    groups.get(parentId).push(row);
  }
  return groups;
}

export function buildIdListQuery(field, ids) {
  for (const id of ids) {
    assertSafeQueryValue(id, "sys_id");
  }
  return `${field}IN${ids.join(",")}`;
}

export function withSysId(fields) {
  return fields.includes("sys_id")
    ? fields
    : [
      ...fields,
      "sys_id",
    ];
}

export function attachChildren(parents, {
  requestedFields, childrenByParent, childKey,
}) {
  const keepSysId = requestedFields.includes("sys_id");
  return parents.map(({
    sys_id: parentId, ...fields
  }) => ({
    ...(keepSysId && {
      sys_id: parentId,
    }),
    ...fields,
    [childKey]: childrenByParent.get(parentId) ?? [],
  }));
}

export function asRows(response) {
  return Array.isArray(response)
    ? response
    : [];
}
