import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value) {
  if (!value) return undefined;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new ConfigurationError(`Invalid JSON: ${value}`);
    }
  }

  return value;
}

export function assertSafeQueryValue(value, label) {
  if (typeof value === "string" && value.includes("^")) {
    throw new ConfigurationError(`\`${label}\` cannot contain the \`^\` character, which is reserved by ServiceNow's encoded-query syntax.`);
  }
}

function guideItemLabel(index) {
  return `items[${index}]`;
}

function assertPositiveQuantity(quantityRaw, label) {
  if (quantityRaw == null || String(quantityRaw).trim() === "") {
    throw new ConfigurationError(`${label} is missing quantity.`);
  }
  const quantity = String(quantityRaw).trim();
  if (!/^\d+$/.test(quantity) || Number(quantity) <= 0) {
    throw new ConfigurationError(`${label} quantity must be greater than 0.`);
  }
  return quantity;
}

function assertVariableValue(name, value, label) {
  const variableName = String(name ?? "").trim();
  if (!variableName) {
    throw new ConfigurationError(`${label} has a variable with an empty name.`);
  }
  if (value === null || value === undefined || value === "") {
    throw new ConfigurationError(`${label} variable \`${variableName}\` is missing a value. Fill mandatory variables and omit optional blank ones before checkout.`);
  }
  return variableName;
}

function collectGuideVariables(entries, variables, label) {
  for (const entry of entries) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new ConfigurationError(`${label} has a variable entry that is not an object.`);
    }
    if (Array.isArray(entry.children) && entry.children.length) {
      collectGuideVariables(entry.children, variables, label);
      continue;
    }
    const variableName = assertVariableValue(
      entry.name,
      "value" in entry
        ? entry.value
        : undefined,
      label,
    );
    variables[variableName] = entry.value;
  }
}

function normalizeGuideVariables(variablesRaw, label) {
  const variables = {};
  if (variablesRaw == null) {
    return variables;
  }
  if (Array.isArray(variablesRaw)) {
    collectGuideVariables(variablesRaw, variables, label);
    return variables;
  }
  if (typeof variablesRaw === "object") {
    for (const [
      key,
      value,
    ] of Object.entries(variablesRaw)) {
      const variableName = assertVariableValue(key, value, label);
      variables[variableName] = value;
    }
    return variables;
  }
  throw new ConfigurationError(`${label} variables must be an object or an array.`);
}

const REFERENCE_VARIABLE_TYPES = new Set([
  8,
  31,
]);
const LOOKUP_VARIABLE_TYPES = new Set([
  18,
  22,
]);
const LIST_COLLECTOR_VARIABLE_TYPE = 21;

export function isScriptValue(value) {
  return typeof value === "string" && /^\s*javascript\s*:/i.test(value);
}

function splitNames(value) {
  return String(value ?? "")
    .split(/[,;]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function scriptDependencies(script) {
  return [
    ...new Set([
      ...String(script).matchAll(/current\.variables(?:\.(\w+)|\[\s*['"](\w+)['"]\s*\])/g),
    ].map((match) => match[1] ?? match[2])),
  ];
}

function tableOptions(table, qualifier, extra = {}) {
  const options = {
    source: "table",
    table,
    value_field: "sys_id",
    ...extra,
  };
  const raw = String(qualifier ?? "").trim();
  const trimmed = isScriptValue(raw)
    ? raw
    : raw.replace(/(^|\^)EQ$/, "");
  if (!trimmed) {
    return options;
  }
  if (isScriptValue(trimmed)) {
    const dependsOn = scriptDependencies(trimmed);
    return {
      ...options,
      qualifier_unresolved: true,
      qualifier_script: trimmed,
      ...(dependsOn.length && {
        depends_on: dependsOn,
      }),
    };
  }
  return {
    ...options,
    query: trimmed,
  };
}

function describeVariable(variable, scriptDefaults) {
  const type = Number(variable.type);
  const described = {
    ...variable,
  };

  if (Array.isArray(variable.children)) {
    described.children = variable.children.map((child) =>
      describeVariable(child, scriptDefaults));
  }

  if (REFERENCE_VARIABLE_TYPES.has(type) && variable.reference) {
    described.options = tableOptions(variable.reference, variable.ref_qualifier);
  } else if (type === LIST_COLLECTOR_VARIABLE_TYPE && variable.table) {
    delete described.columns;
    described.options = tableOptions(variable.table, variable.ref_qualifier, {
      label_field: variable.display_field,
      multiple: true,
      ...(variable.ref_qualifier === undefined && {
        qualifier_unavailable: true,
      }),
    });
  } else if (LOOKUP_VARIABLE_TYPES.has(type)) {
    const dependsOn = splitNames(variable.ref_qual_elements);
    described.options = {
      source: "choices",
      evaluated_by_servicenow: true,
      table: variable.lookup_table,
      value_field: variable.lookup_value,
      label_field: variable.lookup_label,
      ...(dependsOn.length && {
        depends_on: dependsOn,
      }),
    };
  } else if (Array.isArray(variable.choices)) {
    described.options = {
      source: "choices",
    };
  }

  if (isScriptValue(variable.value)) {
    described.default_script = variable.value;
    if (REFERENCE_VARIABLE_TYPES.has(type) && variable.reference) {
      described.value = "";
      scriptDefaults.push(described);
    } else if (variable.displayvalue !== undefined && variable.displayvalue !== "") {
      described.value = variable.displayvalue;
    } else {
      described.value = "";
      described.default_unresolved = true;
    }
  }

  return described;
}

/**
 * Annotate Service Catalog variables with where their valid values come from.
 * `options.source` is `choices` when every valid value is already inline
 * (lookup choices are evaluated by ServiceNow as the calling user), or `table`
 * when values must be looked up with **Get Table Records**. Script qualifiers
 * cannot be evaluated outside the catalog form, and ServiceNow silently ignores
 * them in a Table API query, so they are flagged with `qualifier_unresolved`
 * rather than returned as `query`. List collector `columns` (filter-builder UI
 * metadata) are dropped. Reference variables whose default is a `javascript:`
 * script are returned in `scriptDefaults` for the caller to resolve.
 */
export function describeCatalogVariables(variables) {
  const scriptDefaults = [];
  const described = (Array.isArray(variables)
    ? variables
    : []).map((variable) => describeVariable(variable, scriptDefaults));
  return {
    variables: described,
    scriptDefaults,
  };
}

/**
 * Map Submit Order Guide rows onto Checkout Order Guide's request body.
 * Submit returns `quantity` and `variables` as `{name, value}` arrays
 * (containers nest further fields under `children`); checkout expects
 * `sysparm_quantity` and a flat variables object.
 * Throws on an empty `sys_id`, a quantity that is not greater than 0, or a
 * named variable with a missing or empty value.
 */
export function normalizeGuideCheckoutItems(items) {
  if (!Array.isArray(items) || !items.length) {
    throw new ConfigurationError("Items must be a non-empty JSON array from Submit Order Guide, not a JSON object.");
  }

  return items.map((raw, index) => {
    const label = guideItemLabel(index);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new ConfigurationError(`${label} must be an object with sys_id, quantity, and variables.`);
    }

    const sysId = String(raw.sys_id ?? raw.item_sys_id ?? "").trim();
    if (!sysId) {
      throw new ConfigurationError(`${label} is missing sys_id.`);
    }

    return {
      sys_id: sysId,
      sysparm_quantity: assertPositiveQuantity(raw.sysparm_quantity ?? raw.quantity, label),
      variables: normalizeGuideVariables(raw.variables, label),
    };
  });
}
