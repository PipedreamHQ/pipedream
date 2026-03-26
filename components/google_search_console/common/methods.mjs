export default {

  /* ============================================================================================
    Throws a custom error and marks it with a flag (`isCustom`) for easier debugging and testing.
================================================================================================ */

  throwCustomError(msg) {
    const err = new Error(msg);
    err.isCustom = true;
    throw err;
  },

  /* ============================================================================================
    Determines whether an error originated from your own validation code or from the API request.
    Useful for debugging and crafting more helpful error messages.
=============================================================================================== */

  // =====================================================================
  checkWhoThrewError(error) {
    return {
      whoThrew: error?.response?.status
        ? "API response"
        : "Internal Code",
      error,
    };
  },

  /* ==========================================================================================
    Throws if the input is not a string or is a blank string (only whitespace, tabs,
    newlines, etc.).
============================================================================================= */

  throwIfBlankOrNotString(input, reason) {

    if (typeof input !== "string") {
      this.throwCustomError(
        `Expected a string, but got ${typeof input}` + this._reasonMsg(reason),
      );
    }

    if (input.trim() === "") {
      this.throwCustomError(
        "Expected a non-empty string with visible characters." + this._reasonMsg(reason),
      );
    }

    return input;
  },

  /* ==============================================================================================
    Throws if the input is not a whole number (non-negative integer).
================================================================================================= */

  throwIfNotWholeNumber(input, reason) {
    if (!Number.isInteger(input) || input < 0) {
      this.throwCustomError( `Expected a whole number (0 or positive integer), but got ${typeof input}` + this._reasonMsg(reason));

    }

    return input;
  },

  /* =============================================================================================
    Throws if the input is not an array.
================================================================================================= */

  throwIfNotArray(input, reason) {

    if (!Array.isArray(input)) {
      this.throwCustomError("Invalid argument type. Expected an array " +  this._reasonMsg(reason));
    };

    return input;
  },

  /* =============================================================================================
    Throws if the input is not an array of strings.
================================================================================================ */

  throwIfNotArrayOfStrings(input, reason) {

    this.throwIfNotArray(input, reason);

    for (let i = 0; i < input.length; i++) {
      if (typeof input[i] !== "string") {
        this.throwCustomError("Expected an array of strings " +  this._reasonMsg(reason));
      }
    };

    return input;
  },

  /* ==============================================================================================
    Throws if the input is not a plain object (arrays are excluded).
================================================================================================= */

  throwIfNotObject(input, reason) {

    if ( typeof input === "object" && input !== null && !Array.isArray(input)) {
      return input;
    };

    this.throwCustomError("Invalid argument type. Expected an object " +  this._reasonMsg(reason));

  },

  /* ==============================================================================================
    Throws if the input is neither an object nor an array.
================================================================================================= */

  throwIfNotObjectOrArray(input, reason) {

    if ( typeof input === "object" && input !== null) {
      return input;
    };

    this.throwCustomError("Invalid argument type. Expected an object or array" +  this._reasonMsg(reason));

  },

  /* ==============================================================================================
    Validates that a string follows the YYYY-MM-DD date format.
    Throws if the format or any individual part (year, month, day) is invalid.
================================================================================================= */

  throwIfNotYMDDashDate(input, reason) {

    this.throwIfBlankOrNotString(input, reason);

    const parts = input.trim().split("-");

    if (parts.length !== 3) {
      this.throwCustomError("Date must be in format YYYY-MM-DD"  +  this._reasonMsg(reason));
    };

    let [
      year,
      month,
      day,
    ] = parts;

    // --- YEAR ---
    year = +year;
    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      this.throwCustomError("Year must be between 1990 and 2100" +  this._reasonMsg(reason));
    };

    const monthNum = +month;
    if (month.length !== 2 || Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12 ) {
      this.throwCustomError(`Month must be between 01 and 12. Got: '${month}'` +  this._reasonMsg(reason));
    };

    const dayNum = +day;
    if (day.length !== 2 || Number.isNaN(dayNum) || dayNum < 1 || dayNum > 31 ) {
      this.throwCustomError(`Day must be between 01 and 31. Got: '${day}'` +  this._reasonMsg(reason));
    };

    return input;
  },

  /* ==============================================================================================
    Validates a URL string:
    - Rejects blank strings, spaces, tabs, and newlines
    - Warns about suspicious or unusual characters
    - Adds a warning if protocol is missing or malformed
    Returns:
      {
        warnings: string[],
        url: string (trimmed original input)
      }
================================================================================================= */

  // =====================================================================
  checkIfUrlValid(input, reason) {

    // Throws an error if the input is not a string or if its a blank string;
    this.throwIfBlankOrNotString(input);

    // Warning accumulator
    let warnings = [];
    ;
    // Trim the input (already checked for string);
    const trimmedInput = input.trim();

    // Reject if spaces, tabs, or newlines are present
    if ((/[ \t\n]/.test(trimmedInput))) {
      this.throwCustomError( "Url contains invalid characters like space, backslash etc., please check."  +  this._reasonMsg(reason));
    };

    // Warn about suspicious characters
    const dubiousCharRegex = /[\\<>{}|"`^]|\u200B|\u200C|\u200D|\u2060|\uFEFF|\u00A0/g;

    const dubiousMatches = trimmedInput.match(dubiousCharRegex);

    if (dubiousMatches) {
      const uniqueChars = [
        ...new Set(dubiousMatches),
      ].join(" ");

      warnings.push(` URL contains dubious or non-standard characters " ${uniqueChars} " ` +
          `that may be rejected by Google. Proceed only if you know what you are doing.  ${this._reasonMsg(reason)}`) ;
    };

    // urlObject for further use if the next check passes.
    let urlObject;
    // Tries to create a new URL object with the input string;
    try {
      urlObject =  new URL(trimmedInput); // throws if invalid or has no protocol

      // Warn if user typed only one slash (e.g., https:/)
      if (/^(https?):\/(?!\/)/.test(input)) {

        warnings.push(` It looks like you're missing one slash after "${urlObject.protocol}".` +
        `Did you mean "${urlObject.protocol}//..."? ${this._reasonMsg(reason)} `);

      };

    } catch (err) {
      // If the URL is invalid, try to create a new URL object with "http://" in case user forgot to add it;
      try  {
        // If it works then there was no protocol in the input string;
        urlObject = new URL("http://" + trimmedInput);

        warnings.push(" URL does not have http or https protocol \"");

      } catch (err) {
        // If after all checks we are here that means that the url
        // contain potentially unacceptable characters.
        warnings.push(` URL contains potentially unacceptable characters"  ${this._reasonMsg(reason)}`);

      };

    };

    // Here I wanted to check for "ftp" and other protocols but if user
    // uses them they know what they are doing.

    return {
      warnings: warnings,
      url: input,
    };

  },

  /* ==============================================================================================
    Appends a reason string to error messages for additional context.
================================================================================================= */

  _reasonMsg(reason) {

    return (reason && typeof reason === "string")
      ? ` Reason: ${reason} `
      : "";
  },

  /* ==============================================================================================
    Calls the appropriate validation method based on the input's type.
    Uses either the standard `type` or an extended override via `extendedType`.
    Throws if no validator is found or if the value fails validation.
================================================================================================= */

  validateUserInput(propMeta, value) {

    this.throwIfNotObject(propMeta, propMeta.label);

    // Check if there is extra type in prop meta. Like string can be also date type
    const type = ("extendedType" in propMeta)
      ? propMeta.extendedType
      : propMeta.type;

    // Decide which method to call based on the input we want to check.

    const validators = {
      "string": this.throwIfBlankOrNotString,
      "integer": this.throwIfNotWholeNumber,
      "string[]": this.throwIfNotArrayOfStrings,
      "object": this.throwIfNotObjectOrArray,
      "array": this.throwIfNotArray,
      "YYYY-MM-DD": this.throwIfNotYMDDashDate,
      "url": this.checkIfUrlValid,
    };

    const validator = validators[type];

    if (!validator) {
      this.throwCustomError(`No validator found for type "${type}"`, propMeta.label);
    };

    // Calls the correct function and passes label
    // to show as a reason if it throws an error or issues a warning.
    return validator.call(this, value, propMeta.label);

  },

  /* ==============================================================================================
    Attempts to parse a string as JSON.
    - Returns the parsed object if valid
    - Returns the original value if not a string
    - Throws a custom error if parsing fails
================================================================================================= */

  parseIfJsonString(input, reason) {
    if (typeof input !== "string") return input;

    try {
      return JSON.parse(input);
    } catch (err) {
      this.throwCustomError( `Can not parse JSON. Error : ${err}`  +  this._reasonMsg(reason));
    };
  },

};
