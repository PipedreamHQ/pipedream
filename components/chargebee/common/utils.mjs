export function clearObject(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([
    ,
    v,
  ]) => v !== undefined));
}
