export const snakeCaseToTitleCase = (s) =>
  s.replace(/^_*(.)|_+(.)/g, (s, c, d) => c
    ? c.toUpperCase()
    : " " + d.toUpperCase());
