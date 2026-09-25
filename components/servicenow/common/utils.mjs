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
