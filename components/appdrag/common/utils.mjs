import axios from "axios";
import { ConfigurationError } from "@pipedream/platform";

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    console.log("Error parsing array", e);
    throw new ConfigurationError(`Make sure the custom expression contains a valid array object: \`${value}\``);
  }
}

function cleanObject(obj) {
  return Object.entries(obj || {})
    .reduce((acc, [
      key,
      valuealue,
    ]) => valuealue === undefined
      ? acc
      : {
        ...acc,
        [key]: valuealue,
      }, {});
}

function cloneSafe(obj) {
  const str = jsonStringifySafe(obj);
  return str
    ? JSON.parse(str)
    : null;
}

function jsonStringifySafe(value, set = new Set()) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    if (set.has(value)) {
      return;
    }

    set.add(value);

    if (typeof(value) === "object") {
      if (Array.isArray(value)) {
        const result =
          value.map((el) => jsonStringifySafe(el, set))
            .filter(Boolean)
            .join(",");
        return `[${result}]`;
      }
      const result = Object.entries(value)
        .map(([
          key,
          val,
        ]) => {
          const str = jsonStringifySafe(val, set);
          return str
            ? `${JSON.stringify(key)}:${str}`
            : null;
        })
        .filter(Boolean)
        .join(",");
      return `{${result}}`;
    }
  }
}

function stepExport(step, message, id) {
  const exportFunc = step?.export
    ? step.export
    : (id, msg) => {
      if (step) {
        step[id] = msg;
      }
      return console.log(`export: ${id} - ${JSON.stringify(msg, null, 2)}`);
    };

  return exportFunc(id, cloneSafe(message));
}

function convertAxiosError(err) {
  const {
    response: {
      data,
      // eslint-disable-next-line no-unused-vars
      request,
      ...restResponse
    },
    name,
    message: originalMessage,
    ...restErr
  } = err;

  let message;
  try {
    message = JSON.stringify(data);
  } catch (error) {
    console.error("Error trying to convert `err.response.data` to string");
    message = originalMessage;
  }

  return {
    ...restErr,
    response: {
      ...restResponse,
      data,
    },
    name: `${name} - ${message}`,
    message,
  };
}

async function callAxios({
  step, debug, returnFullResponse, headers, params, data, ...args
} = {}) {
  const config = cleanObject({
    ...args,
    headers: cleanObject(headers),
    params: cleanObject(params),
    data: cleanObject(data),
  });

  try {
    if (debug) {
      stepExport(step, config, "debug_config");
    }

    const response = await axios(config);

    if (debug) {
      stepExport(step, response?.data, "debug_response");
    }

    return returnFullResponse
      ? response
      : response?.data;
  } catch (err) {
    if (err.response) {
      convertAxiosError(err);
      stepExport(step, err.response, "debug");
    }
    throw err;
  }
}

export default {
  callAxios,
  parseArray,
};
