export function getOptionsDescription(name: string) {
  return `Select a **${name}** from the list.
  \\
  Alternatively, you can provide a custom *${name} ID*.`;
}

export function getFlagPropDescription(name: string, flagName: string) {
  return `One or more ${name}s. If a ${name} is to be flagged as ${flagName}, suffix it with \`!${flagName}\`.`;
}
