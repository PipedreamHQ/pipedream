function filterProps(props) {
  if (!props) {
    return;
  }
  return Object.fromEntries(
    Object.entries(props)
      .filter(([
        key,
        value,
      ]) => typeof(value) !== "function" && key !== "app"),
  );
}

export default {
  filterProps,
};
