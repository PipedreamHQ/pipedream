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

/**
 * Map Submit Order Guide rows onto Checkout Order Guide's request body.
 * Submit returns `quantity` and `variables` as `{name, value}` arrays;
 * checkout expects `sysparm_quantity` and a variables object.
 */
export function normalizeGuideCheckoutItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return [];
    }

    const sysId = String(raw.sys_id ?? raw.item_sys_id ?? "").trim();
    if (!sysId) {
      return [];
    }

    const quantityRaw = raw.sysparm_quantity ?? raw.quantity ?? "1";
    const quantity = String(quantityRaw == null || quantityRaw === ""
      ? "1"
      : quantityRaw).trim() || "1";

    const variablesRaw = raw.variables;
    const variables = {};
    if (variablesRaw && typeof variablesRaw === "object" && !Array.isArray(variablesRaw)) {
      for (const [key, value] of Object.entries(variablesRaw)) {
        if (value === null || value === undefined) {
          continue;
        }
        const name = String(key).trim();
        if (name) {
          variables[name] = value;
        }
      }
    } else if (Array.isArray(variablesRaw)) {
      for (const entry of variablesRaw) {
        if (!entry || typeof entry !== "object") {
          continue;
        }
        const name = String(entry.name ?? "").trim();
        if (!name || !("value" in entry) || entry.value === null || entry.value === undefined) {
          continue;
        }
        variables[name] = entry.value;
      }
    }

    return [
      {
        sys_id: sysId,
        sysparm_quantity: quantity,
        variables,
      },
    ];
  });
}
