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
   * Internal helper to unwrap a potentially labeled value.
   * Note: For most use cases, prefer using sharepoint.resolveWrappedValue() from the app.
   * This is only for utility functions that don't have access to the app instance.
   * @private
   * @param {*} value - The value to unwrap
   * @returns {*} The unwrapped value
   */
  _unwrapValue(value) {
    return value?.__lv?.value || value;
  },

  /**
   * Parses a file or folder value from JSON string or returns wrapped object
   * @param {*} value - The value to parse (JSON string or raw ID)
   * @returns {{ id: string, name?: string, isFolder: boolean } | null}
   */
  parseFileOrFolder(value) {
    if (!value) return null;
    const resolved = this._unwrapValue(value);
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
    if (!Array.isArray(roles)) return "read";
    if (roles.includes("owner")) return "owner";
    if (roles.includes("write")) return "write";
    if (roles.includes("read")) return "read";
    return "read";
  },

  parseObject(obj) {
    if (!obj) return undefined;

    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch (e) {
            return item;
          }
        }
        return item;
      });
    }
    if (typeof obj === "string") {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return obj;
      }
    }
    return obj;
  },
};
