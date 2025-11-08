"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneSafe = cloneSafe;
exports.jsonStringifySafe = jsonStringifySafe;
function cloneSafe(o) {
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
function jsonStringifySafe(v, set) {
    try {
        return JSON.stringify(v);
    }
    catch (err) {
        set = new Set(set || []);
        if (set.has(v))
            return;
        set.add(v);
        if (typeof v === "object") {
            const strs = [];
            if (Array.isArray(v)) {
                for (const el of v) {
                    const str = jsonStringifySafe(el, set);
                    if (str)
                        strs.push(str);
                }
                return `[${strs.join(",")}]`;
            }
            for (const k in v) {
                const str = jsonStringifySafe(v[k], set);
                if (str) {
                    const kStr = JSON.stringify(k);
                    strs.push(`${kStr}:${str}`);
                }
            }
            return `{${strs.join(",")}}`;
        }
    }
}
