import { ConfigurationError } from "@pipedream/platform";
import {
  MEMORY_MBYTES_OPTIONS, MIN_MEMORY_MBYTES, MAX_MEMORY_MBYTES,
} from "./constants.mjs";

// Converts a value to integer or returns null for invalid/missing input.
function toMemoryInt(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isInteger(num)
    ? num
    : null;
}

// Valid memory steps (powers of two, 128 MB–32 GB) within [min, max], for dropdown and validation.
function memoryOptions({
  min, max,
}) {
  const filtered = MEMORY_MBYTES_OPTIONS.filter(({ value }) => value >= min && value <= max);
  return filtered.length
    ? filtered
    : MEMORY_MBYTES_OPTIONS;
}

// Reads the Actor's declared memory limits from an already-fetched build,
// falling back to the platform limits (128 MB - 32 GB) when not declared.
export function getMemoryLimits(build = null) {
  const {
    minMemoryMbytes, maxMemoryMbytes,
  } = build?.actorDefinition ?? {};
  return {
    min: toMemoryInt(minMemoryMbytes) ?? MIN_MEMORY_MBYTES,
    max: toMemoryInt(maxMemoryMbytes) ?? MAX_MEMORY_MBYTES,
  };
}

// Builds the ordered memory dropdown prop for [min, max], with a description
// that reflects the range shown.
export function buildMemoryProp(limits) {
  const options = memoryOptions(limits);
  const low = options[0].label;
  const high = options.at(-1).label;
  return {
    type: "integer",
    label: "Memory (MB)",
    description: `Memory limit for the run, in megabytes. Must be a power of two between ${low} and ${high}. By default, the run uses the memory limit specified in the run configuration.`,
    optional: true,
    options,
  };
}

// Checks if memory is a valid allowed value; throws if not, else returns the value or undefined.
export function validateMemory(memory, limits) {
  if (memory === undefined || memory === null || memory === "") {
    return undefined;
  }
  const options = memoryOptions(limits);
  const value = Number(memory);
  if (!options.some((option) => option.value === value)) {
    throw new ConfigurationError(
      `Memory "${memory}" MB is not valid. Choose a power of two between ${options[0].label} and ${options.at(-1).label}.`,
    );
  }
  return value;
}
