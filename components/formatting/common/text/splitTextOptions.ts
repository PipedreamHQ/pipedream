export const INDEX_ALL_SEGMENTS = 999;

export const SPLIT_TEXT_OPTIONS = [
  {
    label: "First",
    value: INDEX_ALL_SEGMENTS * -1, // value should be 0, but that is not accepted - see issue #5429
  },
  {
    label: "Second",
    value: 1,
  },
  {
    label: "Last",
    value: -1,
  },
  {
    label: "Second to Last",
    value: -2,
  },
  {
    label: "All",
    value: INDEX_ALL_SEGMENTS,
  },
];
