import fs from "node:fs";

/**
 * HTTP request wrapper with retry logic.
 *
 * @param {Function} func - Function which perform request that should be retried.
 * @param {number} [maxAttempts=3] - Max retry attempts before throw error.
 * @param {number} [baseDelayS=2] - Base delay in seconds.
 * @returns {Promise}
 */
const retryWithExponentialBackoff = (func, maxAttempts = 3, baseDelayS = 2) => {
  let attempt = 0;

  const execute = async () => {
    try {
      console.log(`Attempt ${attempt + 1}`);
      return await func();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }

      const delayMs = Math.pow(baseDelayS, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      attempt++;
      return execute();
    }
  };

  return execute();
};

/**
 * Represent file.
 *
 * @param {*} file - File represent as url or base64.
 * @param {string} representation - New file representation.
 * @param {string} format - file format (PNG or JPEG).
 * @returns {*} Represented file.
 */
const representFile = (file, format, representation) => {
  if (representation != "Base64 string" && representation != "URL to file") {
    const buf = Buffer.from(file, "base64");
    if (representation == "Path to file") {
      const name = Math.random()
        .toString(36)
        .substring(2, 10);
      file = `/tmp/${name}`;
      if (format !== "" && format !== undefined) {
        file = `${file}.${format.toLowerCase()}`;
      }
      console.log(`Writing file to ${file}`);
      fs.writeFileSync(file, buf);
    }
    else if (representation == "JSON Buffer") {
      file = buf.toJSON();
    }
    else if (representation == "Array") {
      file = buf.toJSON().data;
    }
    else {
      throw Error("Unsupported representation");
    }
  }
  return file;
};

export {
  retryWithExponentialBackoff,
  representFile,
};
