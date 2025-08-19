import { getFileStream } from "@pipedream/platform";

const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      // Only parse if the string looks like a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return parseJson(JSON.parse(value), maxDepth - 1);
        } catch (e) {
          return value;
        }
      }
      return value;
    } else if (typeof(value) === "object" && value !== null && !Array.isArray(value)) {
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    } else if (Array.isArray(value)) {
      return value.map((item) => parse(item));
    }
    return value;
  };

  return parse(input);
};

function parseArray (input, maxDepth = 100) {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => parseArray(item, maxDepth - 1));
        }
      } catch (e) {
        throw new Error(`Invalid JSON array format: ${e.message}`);
      }
    }
    return parseJson(input, maxDepth);
  }

  if (Array.isArray(input)) {
    return input.map((item) => parseArray(item, maxDepth));
  }

  return input;
}

async function fromStreamToBase64(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("base64");
};

async function fromFilePathToBase64(filePath) {
  const stream = await getFileStream(filePath);
  return fromStreamToBase64(stream);
}

export default {
  parseJson,
  parseArray,
  fromStreamToBase64,
  fromFilePathToBase64,
};
