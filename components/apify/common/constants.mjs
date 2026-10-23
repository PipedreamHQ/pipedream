export const WCC_ACTOR_ID = "aYG0l9s7dbB7j3gbS";
export const LIMIT = 100;

// Apify platform memory limits: memory must be a power of two, from 128 MB to 32 GB.
// See https://docs.apify.com/actors/running/usage-and-resources#memory
export const MIN_MEMORY_MBYTES = 128;
export const MAX_MEMORY_MBYTES = 32768;

function memoryLabel(mb) {
  return mb >= 1024
    ? `${mb / 1024} GB`
    : `${mb} MB`;
}

// Ordered dropdown options for the run memory limit (128 MB -> 32 GB).
export const MEMORY_MBYTES_OPTIONS = (() => {
  const options = [];
  for (let mb = MIN_MEMORY_MBYTES; mb <= MAX_MEMORY_MBYTES; mb *= 2) {
    options.push({
      label: memoryLabel(mb),
      value: mb,
    });
  }
  return options;
})();
