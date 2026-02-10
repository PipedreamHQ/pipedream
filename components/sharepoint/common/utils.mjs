export default {
  cleanObject(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },

  /**
   * Resolves the actual value from a prop that may be wrapped in __lv format
   * @param {*} prop - The prop value (may be raw value or { __lv: { value: ... } })
   * @returns {*} The resolved value
   */
  resolveValue(prop) {
    if (!prop) return null;
    if (typeof prop === "object" && prop.__lv) {
      return prop.__lv.value;
    }
    return prop;
  },

  /**
   * Parses a file or folder value from JSON string or returns wrapped object
   * @param {*} value - The value to parse (JSON string or raw ID)
   * @returns {{ id: string, name?: string, isFolder: boolean } | null}
   */
  parseFileOrFolder(value) {
    if (!value) return null;
    const resolved = this.resolveValue(value);
    try {
      return JSON.parse(resolved);
    } catch {
      return {
        id: resolved,
        isFolder: false,
      };
    }
  },

  /**
   * Parses a list of file or folder values
   * @param {*} values - Single value or array of values
   * @returns {Array<{ id: string, name?: string, isFolder: boolean }>}
   */
  parseFileOrFolderList(values) {
    if (!values) return [];
    const list = Array.isArray(values)
      ? values
      : [
        values,
      ];
    return list.map((v) => this.parseFileOrFolder(v)).filter(Boolean);
  },

  /**
   * Attempts to decode a base64 string (SharePoint encodes group names in base64)
   * @param {string} str - String that may be base64 encoded
   * @returns {string | null} Decoded string or null if not valid base64
   */
  tryDecodeBase64(str) {
    try {
      if (/^[A-Za-z0-9+/]+=*$/.test(str) && str.length > 10) {
        const decoded = Buffer.from(str, "base64").toString("utf-8");
        if (/^[\x20-\x7E\s]+$/.test(decoded)) {
          return decoded;
        }
      }
    } catch {
      // Not valid base64
    }
    return null;
  },

  /**
   * Determines access level from roles array
   * @param {string[]} roles - Array of role strings
   * @returns {"owner" | "write" | "read"}
   */
  getAccessLevel(roles) {
    if (roles.includes("owner")) return "owner";
    if (roles.includes("write")) return "write";
    if (roles.includes("read")) return "read";
    return "read";
  },
};
