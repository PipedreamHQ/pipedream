import { assertSafeQueryValue } from "@pipedream/servicenow/common/utils.mjs";
import app from "../servicenow_service_account.app.mjs";

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

const SHARED_CART = "the integration user's cart (one cart shared by every session of this integration user, so concurrent sessions can add, remove, or submit each other's items)";

const DESCRIPTION_REWRITES = [
  [
    "the current user's ServiceNow cart",
    SHARED_CART,
  ],
  [
    "the current user's cart",
    SHARED_CART,
  ],
  [
    "added to the user's default cart",
    `added to ${SHARED_CART}`,
  ],
  [
    "already filtered by ServiceNow for the signed-in user",
    "already filtered by ServiceNow for the integration user, which can differ from what the person you act for would see",
  ],
  [
    "Script defaults such as the current user are resolved into `value`",
    "Script defaults are resolved into `value` as the integration user, so a current-user default is the integration user, not the person you act for (replace it with their `sys_id` from **Find Users**)",
  ],
  [
    "usually requires a catalog admin role, so most signed-in employees get a 403 here",
    "requires the integration user's roles and ACLs to grant read access to `question_choice` (a ServiceNow admin must configure this), otherwise it returns 403",
  ],
];

const DOCUMENTATION_LINK = " [See the documentation";

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
  key, description: descriptionOverride, example, note, propDescriptions = {},
}) {
  const description = withNote(
    withNote(descriptionOverride ?? rewriteDescription(action.description), note),
    example && `Example: ${example}`,
  );
  return {
    ...action,
    key,
    version: "0.0.1",
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
