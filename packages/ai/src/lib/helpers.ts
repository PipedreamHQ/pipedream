export function toNonEmptyTuple<T extends string>(
  arr: T[],
): [T, ...T[]] | undefined {
  return arr.length > 0
    ? (arr as [T, ...T[]])
    : undefined;
}

type EnumLike = string | { value: string };

export function extractEnumValues(values: EnumLike[]): string[] {
  return values.map((v) => (typeof v === "string"
    ? v
    : v.value));
}
