function getTextContentFromDocument(content) {
  let textContent = "";
  content.forEach((element) => {
    if (element.paragraph) {
      element.paragraph.elements.forEach((textRun) => {
        if (textRun.textRun) {
          textContent += textRun.textRun.content;
        }
      });
    }
  });
  return textContent;
}

function addTextContentToDocument(response) {
  const textContent = getTextContentFromDocument(response.body.content);
  return {
    textContent,
    ...response,
  };
}

function flattenTables(content) {
  return (content || [])
    .filter((element) => element.table)
    .map((element) => ({
      startIndex: element.startIndex,
      endIndex: element.endIndex,
      table: element.table,
    }));
}

// Selects the table that was just inserted by ordinal position, not by
// comparing startIndex values: inserting a table immediately before an
// existing one gives the new table the exact startIndex the existing table
// used to have, and shifts the existing table forward onto some other index.
// Comparing indexes alone can't tell which of the two is "new" in that case,
// so instead we count how many tables preceded the insertion point (before
// inserting) and read off the table at that same position afterwards — a
// newly inserted table can only ever occupy the slot at that ordinal index.
function selectInsertedTable(beforeTables, afterTables, requestedIndex) {
  if (afterTables.length !== beforeTables.length + 1) {
    return null;
  }
  const precedingCount = requestedIndex == null
    ? beforeTables.length
    : beforeTables.filter(({ startIndex }) => startIndex < requestedIndex).length;
  return afterTables[precedingCount] ?? null;
}

function adjustPropDefinitions(props, app) {
  return Object.fromEntries(
    Object.entries(props).map(([
      key,
      prop,
    ]) => {
      if (typeof prop === "string") return [
        key,
        prop,
      ];
      const {
        propDefinition, ...otherValues
      } = prop;
      if (propDefinition) {
        const [
          , ...otherDefs
        ] = propDefinition;
        return [
          key,
          {
            propDefinition: [
              app,
              ...otherDefs,
            ],
            ...otherValues,
          },
        ];
      }
      return [
        key,
        otherValues.type === "app"
          ? null
          : otherValues,
      ];
    })
      .filter(([
        , value,
      ]) => value),
  );
}

export default {
  getTextContentFromDocument,
  addTextContentToDocument,
  flattenTables,
  selectInsertedTable,
  adjustPropDefinitions,
};
