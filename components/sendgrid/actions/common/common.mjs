import sendgrid from "../../sendgrid.app.mjs";

export default {
  props: {
    sendgrid,
  },
  methods: {
    /**
     * Gets a validation constraint for integer values greater than 0 to use with the
     * `validation.js` library.
     *
     * @returns {{onlyInteger: boolean, greaterThan: integer, message: string} numericality}
     * structure of the validation constraint for integer values greater than 0.
     */
    getIntegerGtZeroConstraint() {
      return {
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          message: "must be positive integer, greater than zero.",
        },
      };
    },
    /**
     * Checks if an object is an array or a JSON array string, returns an error message when it
     * fails.
     *
     * @param {object} value the object to check for array or JSON array string.
     * @param {string} key a name of the object being checked that will be used in the result
     * message.
     * @returns {arrayValidatorMsg: string} the validation error if `value` is not an array, nor
     * a JSON array string. Otherwise returns `null`.
     */
    validateArray(value, params) {
      const arrayValidatorMsgFormat = "parameter must be an array of % objects or a string that will `JSON.parse` to an array of & objects.";
      let arrayValidatorMsg = arrayValidatorMsgFormat.replace("%", params.key);
      arrayValidatorMsg = arrayValidatorMsg.replace("&", params.key);
      if (Array.isArray(value)) {
        return null;
      }
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) ?
          null :
          arrayValidatorMsg;
      } catch {
        return arrayValidatorMsg;
      }
    },
    /**
     * Checks if the asm object is properly configuroed group_id is
     * required when groups_to_show is set and returns an error if not set
     *
     * @param {asm} ASM object
     * @param {asmGroupId} asmGroupId param value
     * @param {asmGroupsToDisplay} asmGroupsToDisplay param value
     *
     * @returns {arrayValidatorMsg: string} the validation error if asm.groups_to_display
     * or asmGroupsToDisplay is set but asm.group_id or asmGroupId is not set
     */
    validateAsm(value, {
      asm, asmGroupId, asmGroupsToDisplay,
    }) {
      const asmValidatorMsg = "If asm object or asmGroupsToDisplay param is set, group_id key or asmGroupId param is required to be set";
      if ((asm && asm.groups_to_display) || asmGroupsToDisplay) {
        // asmGroupsToDisplay or asm.groups_to_display are set, check for asm.group_id or asmGroupId
        if (asm?.group_id || asmGroupId) {
          return null;
        }
        return asmValidatorMsg;
      }
      return null;
    },
    /**
     * Returns a validation message
     *
     * @param {object} validationResults a validation results object from validate.js library
     * @returns tt will generate validation message for each of the validation results present in
     * `validationResults`.
     */
    checkValidationResults(validationResults) {
      if (validationResults) {
        const validationErrorMsg = Object.keys(validationResults)
          .map((key) => `\t${validationResults[key]}`)
          .join("\n");
        const errorMsg = `Parameter validation failed with the following errors:\n${validationErrorMsg}`;
        throw new Error(errorMsg);
      }
    },
    /**
     * Returns `undefined` when `value` is an empty string or `null`.
     *
     * @param {object} value the value to check for returning `undefined`.
     */
    convertEmptyStringToUndefined(value) {
      if (value === "" || value === null) {
        return undefined;
      }
      return value;
    },
    /**
     * Checks if an object is an array, if not it will attempt to JSON parse.
     *
     * @param {object} object the input object to check for array type or JSON parse.
     * @returns The same object, if it's an array, otherwise the "JSON.parsed" object.
     */
    getArrayObject(object) {
      return Array.isArray(object) ?
        object :
        JSON.parse(object);
    },
    /**
     * Iterates on an object's properties and sets each property value to
     * `undefined` when property value is an empty string or `null`.
     *
     * @param {object} object the input object to check for setting its properties
     * values to `undefined`.
     * @returns The same object, with its properties values set to `undefined`
     * accordingly.
     */
    omitEmptyStringValues (object) {
      Object.keys(object).map((prop) => {
        const propvalue = object[prop];
        object[prop] = this.convertEmptyStringToUndefined(propvalue);
      });
      return object;
    },
    /**
     * Prepares the asm object or the asmGroupId. Sendgrid API requires the
     * params to be an int, so make sure it can be parsed as one
     *
     * @returns an object with the asm configuration, or `undefined` if none
     */
    getAsmConfig() {
      //
      //
      let asmConfig = undefined;
      if (this.asm) {
        if (this.asm.group_id) {
          const groupId = parseInt(this.asm.group_id, 10);
          if (!isNaN(groupId)) {
            asmConfig = {
              group_id: groupId,
            };
          }
        }
        //If the asmGroupId param was set, configure that
        if (this.asmGroupId) {
          asmConfig = {
            group_id: this.asmGroupId,
          };
        }
        //If asm.groups_to_display is configured, parse that and copy over
        if (this.asm?.groups_to_display) {
          const groups = JSON.parse(this.asm.groups_to_display);
          const groupIds = [];
          for (let i = 0; i < groups.length; i++) {
            const groupId = parseInt(groups[i], 10);
            if (!isNaN(groupId)) {
              groupIds.push(groupId);
            }
          }
          if (groupIds.length > 0) {
            asmConfig.groups_to_display = groupIds;
          }
        }
        //if asmGroupsToDisplay is configured, copy that over
        if (this.asmGroupsToDisplay) {
          asmConfig.groups_to_display = this.asmGroupsToDisplay;
        }
      }
      return asmConfig;
    },

  },
};
