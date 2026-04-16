export function cloneSafe(o: unknown): unknown {
  const str = jsonStringifySafe(o);
  return str
    ? JSON.parse(str)
    : null;
}

// this looks pretty terrible, but on axios return value,
//
// jsonStringifySafe ~1ms
// util.inspect      ~2ms
//
// XXX could most likely be improved
export function jsonStringifySafe(v: unknown, set?: Set<unknown>): string | undefined {
  try {
    return JSON.stringify(v);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    set = new Set(set || []);
    if (set.has(v)) return;
    set.add(v);
    if (typeof v === "object" && v !== null) {
      const strs: Array<string> = [];
      if (Array.isArray(v)) {
        for (const el of v) {
          const str = jsonStringifySafe(el, set);
          if (str) strs.push(str);
        }
        return `[${strs.join(",")}]`;
      }
      for (const k in v) {
        const str = jsonStringifySafe((v as Record<string, unknown>)[k], set);
        if (str) {
          const kStr = JSON.stringify(k);
          strs.push(`${kStr}:${str}`);
        }
      }
      return `{${strs.join(",")}}`;
    }
  }
}
