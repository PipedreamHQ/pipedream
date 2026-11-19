const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1
  ? singular
  : plural}`;

const countOf = (value) => Array.isArray(value)
  ? value.length
  : 0;

export default {
  pluralize,
  countOf,
};
