export function EffectiveDateDescription(substring: string) {
  return `UNIX timestamp (in seconds) of when ${substring}.
    \\
    You can also provide a valid date/time string and Pipedream will convert it to a UNIX timestamp.
    \\
    Examples: \`1644933600\` \`2022-02-15\` \`2022-02-15T14:00Z\``;
}
