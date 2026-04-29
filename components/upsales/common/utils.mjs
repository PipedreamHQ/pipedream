export function makePropsOptional(props) {
  const optionalProps = {};
  for (const [
    key,
    value,
  ] of Object.entries(props)) {
    optionalProps[key] = {
      ...value,
      optional: true,
    };
  }
  return optionalProps;
}
