export const getSummary = ({
  inserted, errors, duplicates, skipped,
}) => {
  const actions  = {
    inserted,
    errors,
    duplicates,
    skipped,
  };

  const [
    action,
  ] = Object.keys(actions).filter((key) => actions[key].length > 0);

  switch (action) {
  case "inserted":
    return "Inserted transaction";
  case "errors":
    return "Transaction creation failed";
  case "duplicates":
    return "Transaction creation duplicate";
  case "skipped":
    return "Transaction creation skipped";
  }
};
