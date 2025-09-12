#!/usr/bin/env node

// Enhanced script to fetch Infobip OpenAPI spec and update infobip-enhanced.app.mjs
// This script follows the standard patterns from infobip.app.mjs
// Usage: node update-infobip-app.mjs

import fs from "fs";
import InfobipOpenAPIGenerator from "./lib/openapi-generator.mjs";

// Configuration
const CONFIG = {
  enhancedAppFile: "./infobip-enhanced.app.mjs",
  backupSuffix: ".backup",
  methodsStartMarker: "    // OpenAPI Generated Methods - START",
  methodsEndMarker: "    // OpenAPI Generated Methods - END",
  propsStartMarker: "    // OpenAPI Generated Props - START",
  propsEndMarker: "    // OpenAPI Generated Props - END",
};

// Mock Infobip app instance for the generator
const mockApp = {
  $auth: {
    api_key: "test-key",
    base_url: "https://api.infobip.com",
  },
  async axios(config) {
    const { default: axios } = await import("axios");
    return axios(config);
  },
};

/**
 * Read the current enhanced app file
 */
function readEnhancedAppFile() {
  if (!fs.existsSync(CONFIG.enhancedAppFile)) {
    // Create a minimal app shell if file does not exist
    const initialContent = `export default {
  type: "app",
  app: "infobip",
  propDefinitions: {
    // OpenAPI Generated Props - START
    // OpenAPI Generated Props - END
  },
  methods: {
    // OpenAPI Generated Methods - START
    // OpenAPI Generated Methods - END
  },
};
`;
    fs.writeFileSync(CONFIG.enhancedAppFile, initialContent);
    console.log(`🆕 Created blank enhanced app file at: ${CONFIG.enhancedAppFile}`);
  }
  return fs.readFileSync(CONFIG.enhancedAppFile, "utf8");
}

/**
 * Generate appropriate options example based on method and path
 */
function generateOptionsExample(method, path) {
  const examples = [];

  // For POST methods that send messages
  if (method === "POST" && (path.includes("/messages") || path.includes("/sms"))) {
    examples.push(`{
     *   data: {
     *     messages: [{
     *       from: "InfoSMS",
     *       to: "41793026727",
     *       text: "Hello world!"
     *     }]
     *   }
     * }`);
  }
  // For GET methods with query parameters
  else if (method === "GET") {
    const queryParams = [];
    if (path.includes("/reports") || path.includes("/logs")) {
      queryParams.push("limit: 10");
      if (path.includes("/reports")) {
        queryParams.push("bulkId: 'bulk-id-123'");
      }
    }
    if (path.includes("/bulks")) {
      queryParams.push("bulkId: 'bulk-id-123'");
    }
    if (queryParams.length > 0) {
      examples.push(`{
     *   params: {
     *     ${queryParams.join(",\n     *     ")}
     *   }
     * }`);
    } else {
      examples.push(`{
     *   params: {
     *     limit: 50
     *   }
     * }`);
    }
  }
  // For PUT methods (updates)
  else if (method === "PUT") {
    if (path.includes("/bulks/status")) {
      examples.push(`{
     *   data: {
     *     status: "PAUSED"
     *   }
     * }`);
    } else if (path.includes("/bulks")) {
      examples.push(`{
     *   data: {
     *     sendAt: "2024-12-25T10:00:00.000+01:00"
     *   }
     * }`);
    }
  }
  // For DELETE or other methods
  else {
    examples.push(`{
     *   // Request options here
     * }`);
  }

  return examples.length > 0
    ? examples[0]
    : null;
}

/**
 * Generate method implementations following infobip.app.mjs patterns
 */
function generateMethodImplementations(methods) {
  const methodImpls = [];

  // Skip methods that already exist in the enhanced app to avoid duplicates
  const skipMethods = new Set([
    "sendSmsMessage", // Already exists as enhanced wrapper
    "messageId", // Already exists in props
  ]);

  for (const [
    methodName,
    methodInfo,
  ] of Object.entries(methods)) {
    if (skipMethods.has(methodName)) {
      console.log(`⏭️  Skipping existing method: ${methodName}`);
      continue;
    }
    const {
      path, method, operation,
    } = methodInfo;

    // Parse path parameters first
    const pathParams = [];
    const pathPattern = path.replace(/{([^}]+)}/g, (_, paramName) => {
      pathParams.push(paramName);
      return `\${${paramName}}`;
    });

    // Generate JSDoc comment with parameter examples
    const jsdoc = [];
    if (operation.summary || operation.description) {
      jsdoc.push("    /**");
      if (operation.summary) {
        jsdoc.push(`     * ${operation.summary}`);
      }
      if (operation.description && operation.description !== operation.summary) {
        jsdoc.push("     *");
        // Split long descriptions and wrap them properly
        const desc = operation.description.replace(/\n/g, " ").trim();
        const words = desc.split(" ");
        let line = "     * ";
        for (const word of words) {
          if (line.length + word.length > 80) {
            jsdoc.push(line.trim());
            line = "     * " + word + " ";
          } else {
            line += word + " ";
          }
        }
        if (line.trim() !== "     *") {
          jsdoc.push(line.trim());
        }
      }
      if (operation.externalDocs?.url) {
        jsdoc.push("     *");
        jsdoc.push(`     * @see ${operation.externalDocs.url}`);
      }

      // Add parameter documentation with examples
      jsdoc.push("     * @param {Object} opts - Request options");

      // Generate example based on method and path
      const exampleOpts = generateOptionsExample(method, path);
      if (exampleOpts) {
        jsdoc.push("     * @example");
        jsdoc.push("     * // Example usage:");
        if (pathParams.length > 0) {
          const paramExample = pathParams.map((param) => `${param}: "example-${param}"`).join(", ");
          jsdoc.push(`     * await infobip.${methodName}({ ${paramExample}, ...otherOptions });`);
        } else {
          jsdoc.push(`     * await infobip.${methodName}(${exampleOpts});`);
        }
      }

      jsdoc.push("     * @returns {Promise<Object>} API response");
      jsdoc.push("     */");
    }

    // Generate method implementation following infobip.app.mjs style
    let methodImpl;
    if (pathParams.length > 0) {
      // Method with path parameters - destructure them from opts
      const paramList = pathParams.join(", ");
      methodImpl = `    ${methodName}({ ${paramList}, ...opts } = {}) {
      return this._makeRequest({
        method: "${method}",
        path: \`${pathPattern}\`,
        ...opts,
      });
    }`;
    } else {
      // Method without path parameters - standard pattern
      methodImpl = `    ${methodName}(opts = {}) {
      return this._makeRequest({
        method: "${method}",
        path: "${path}",
        ...opts,
      });
    }`;
    }

    // Combine JSDoc and implementation
    const fullMethod = jsdoc.length > 0
      ? jsdoc.join("\n") + "\n" + methodImpl
      : methodImpl;

    methodImpls.push(fullMethod);
  }

  return methodImpls.join(",\n\n");
}

/**
 * Generate prop definitions following infobip.app.mjs patterns
 */
function generatePropDefinitions() {
  const propDefs = [];

  // Skip props that already exist in the enhanced app
  const skipProps = new Set([
    "messageId", // Already exists in original props
  ]);

  // Generate common props from the OpenAPI spec
  const commonProps = {
    bulkId: {
      type: "string",
      label: "Bulk ID",
      description: "The ID which uniquely identifies the request for which the delivery reports are returned.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to retrieve. Default is 50.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "Date and time when the message is to be sent. Used for scheduling messages.",
      optional: true,
    },
    validityPeriod: {
      type: "integer",
      label: "Validity Period",
      description: "The message validity period in minutes. How long the delivery will be attempted.",
      optional: true,
    },
    deliveryTimeWindow: {
      type: "object",
      label: "Delivery Time Window",
      description: "Sets specific delivery window for sending messages.",
      optional: true,
    },
    flash: {
      type: "boolean",
      label: "Flash Message",
      description: "Allows you to send a flash SMS to the destination number.",
      optional: true,
    },
    transliteration: {
      type: "string",
      label: "Transliteration",
      description: "Conversion of a message text from one script to another.",
      optional: true,
      options: [
        "TURKISH",
        "GREEK",
        "CYRILLIC",
        "SERBIAN_CYRILLIC",
        "CENTRAL_EUROPEAN",
        "BALTIC",
      ],
    },
  };

  for (const [
    propName,
    propDef,
  ] of Object.entries(commonProps)) {
    if (skipProps.has(propName)) {
      console.log(`⏭️  Skipping existing prop: ${propName}`);
      continue;
    }

    const propLines = [
      `    ${propName}: {`,
    ];
    propLines.push(`      type: "${propDef.type}",`);
    propLines.push(`      label: "${propDef.label}",`);
    propLines.push(`      description: "${propDef.description}",`);

    if (propDef.optional) {
      propLines.push("      optional: true,");
    }
    if (propDef.options) {
      propLines.push(`      options: ${JSON.stringify(propDef.options)},`);
    }

    propLines.push("    },");
    propDefs.push(propLines.join("\n"));
  }

  return propDefs.join("\n");
}

/**
 * Update the enhanced app file with new methods and props
 */
function updateEnhancedAppFile(content, methods, generator) {
  let updatedContent = content;

  // Generate new method implementations
  const newMethods = generateMethodImplementations(methods);
  const methodsSection = `${CONFIG.methodsStartMarker}
${newMethods}
    ${CONFIG.methodsEndMarker}`;

  // Generate new prop definitions
  const newProps = generatePropDefinitions(generator);
  const propsSection = `${CONFIG.propsStartMarker}
${newProps}
    ${CONFIG.propsEndMarker}`;

  // Replace or add methods section
  const methodsStartIndex = updatedContent.indexOf(CONFIG.methodsStartMarker);
  const methodsEndIndex = updatedContent.indexOf(CONFIG.methodsEndMarker);

  if (methodsStartIndex !== -1 && methodsEndIndex !== -1) {
    // Replace existing methods section
    const before = updatedContent.substring(0, methodsStartIndex);
    const after = updatedContent.substring(methodsEndIndex + CONFIG.methodsEndMarker.length);
    updatedContent = before + methodsSection + after;
    console.log("🔄 Updated existing methods section");
  } else {
    // Add methods section before the closing bracket of the methods object
    const methodsObjectEnd = updatedContent.lastIndexOf("  },\n};");
    if (methodsObjectEnd !== -1) {
      const before = updatedContent.substring(0, methodsObjectEnd);
      const after = updatedContent.substring(methodsObjectEnd);
      updatedContent = before + "\n" + methodsSection + ",\n" + after;
      console.log("➕ Added new methods section");
    } else {
      throw new Error("Could not find methods object end to insert new methods");
    }
  }

  // Replace or add props section
  const propsStartIndex = updatedContent.indexOf(CONFIG.propsStartMarker);
  const propsEndIndex = updatedContent.indexOf(CONFIG.propsEndMarker);

  if (propsStartIndex !== -1 && propsEndIndex !== -1) {
    // Replace existing props section
    const before = updatedContent.substring(0, propsStartIndex);
    const after = updatedContent.substring(propsEndIndex + CONFIG.propsEndMarker.length);
    updatedContent = before + propsSection + after;
    console.log("🔄 Updated existing props section");
  } else {
    // Add props section after the existing props
    const propDefinitionsEnd = updatedContent.indexOf("  },\n  methods:");
    if (propDefinitionsEnd !== -1) {
      const before = updatedContent.substring(0, propDefinitionsEnd);
      const after = updatedContent.substring(propDefinitionsEnd);
      updatedContent = before + ",\n" + propsSection + "\n  " + after;
      console.log("➕ Added new props section");
    } else {
      console.log("⚠️ Could not find props section location, skipping props update");
    }
  }

  return updatedContent;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("🚀 Starting Infobip Enhanced App Update...\n");

    // Read current enhanced app file
    console.log("📖 Reading current enhanced app file...");
    const currentContent = readEnhancedAppFile();

    // Initialize generator and fetch methods
    console.log("📡 Fetching OpenAPI specification...");
    const generator = new InfobipOpenAPIGenerator(mockApp);
    const { methods } = await generator.generateMethods();

    console.log(`✅ Generated ${Object.keys(methods).length} methods from OpenAPI spec\n`);

    // Update the enhanced app file
    console.log("🔧 Updating enhanced app file...");
    const updatedContent = updateEnhancedAppFile(currentContent, methods, generator);

    // Write updated file
    fs.writeFileSync(CONFIG.enhancedAppFile, updatedContent);
    console.log(`💾 Updated ${CONFIG.enhancedAppFile}`);

    // Summary
    console.log("\n📋 Update Summary:");
    console.log("=".repeat(50));

    const methodNames = Object.keys(methods);
    console.log(`📊 Total methods: ${methodNames.length}`);
    console.log(`📁 Updated file: ${CONFIG.enhancedAppFile}`);
    console.log(`💾 Backup created: ${CONFIG.enhancedAppFile}${CONFIG.backupSuffix}`);

    console.log("\n🔍 Sample Generated Methods:");
    console.log("-".repeat(30));
    methodNames.slice(0, 5).forEach((name, index) => {
      const method = methods[name];
      console.log(`${index + 1}. ${name}`);
      console.log(`   ${method.method} ${method.path}`);
      if (method.operation.summary) {
        console.log(`   → ${method.operation.summary}`);
      }
    });

    if (methodNames.length > 5) {
      console.log(`   ... and ${methodNames.length - 5} more methods`);
    }

    console.log("\n✅ Enhanced app update completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   1. Review the updated infobip-enhanced.app.mjs file");
    console.log("   2. Test the new methods with your Infobip credentials");
    console.log("   3. Run any linting/type checking if needed");
    console.log("   4. Commit the changes when satisfied");

  } catch (error) {
    console.error("❌ Error updating enhanced app:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
