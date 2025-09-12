#!/usr/bin/env node

// Action Generator for Infobip Enhanced App
// Generates Pipedream actions from OpenAPI specification
// Follows ESLint rules and existing file patterns

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import InfobipOpenAPIGenerator from "./lib/openapi-generator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class InfobipActionGenerator {
  constructor() {
    this.componentsDir = __dirname;
    this.actionsDir = path.join(this.componentsDir, "actions");
    this.existingActions = new Set();
    this.generatedCount = 0;
    this.skippedCount = 0;
    this.errorCount = 0;
  }

  // Load existing actions to avoid duplicates
  loadExistingActions() {
    try {
      const actionDirs = fs.readdirSync(this.actionsDir, {
        withFileTypes: true,
      });

      for (const dirent of actionDirs) {
        if (dirent.isDirectory()) {
          this.existingActions.add(dirent.name);
        }
      }

      console.log(`📂 Found ${this.existingActions.size} existing actions`);
    } catch (error) {
      console.warn("⚠️  Could not read actions directory:", error.message);
    }
  }

  // Create action directory and file
  createActionFile(actionData, overwrite = false) {
    const actionDir = path.join(this.actionsDir, actionData.actionKey);
    const actionFile = path.join(actionDir, `${actionData.actionKey}.mjs`);

    // Skip if exists and not overwriting
    if (!overwrite && this.existingActions.has(actionData.actionKey)) {
      console.log(`⏭️  Skipping existing action: ${actionData.actionKey}`);
      this.skippedCount++;
      return false;
    }

    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(actionDir)) {
        fs.mkdirSync(actionDir, {
          recursive: true,
        });
      }

      // Format content to match ESLint rules
      const formattedContent = this.formatForESLint(actionData.content);

      // Write action file
      fs.writeFileSync(actionFile, formattedContent, "utf8");

      console.log(`✅ Generated: ${actionData.actionKey}`);
      this.generatedCount++;
      return true;
    } catch (error) {
      console.error(`❌ Failed to create ${actionData.actionKey}:`, error.message);
      this.errorCount++;
      return false;
    }
  }

  // Format content according to ESLint rules
  formatForESLint(content) {
    return content
      // Ensure proper indentation (2 spaces)
      .replace(/^( {2,})/gm, (match) => {
        const spaces = match.length;
        return "  ".repeat(Math.floor(spaces / 2));
      })
      // Ensure trailing comma on multiline objects/arrays - more precise pattern
      .replace(/([}\]"'\w])\n(\s+)([}\]])/g, "$1,\n$2$3")
      // Ensure object properties are on new lines
      .replace(/\{\s*(\w)/g, "{\n  $1")
      .replace(/,\s*(\w)/g, ",\n  $1")
      // Add trailing newline
      .replace(/\n?$/, "\n")
      // Remove trailing spaces
      .replace(/ +$/gm, "")
      // Ensure no multiple empty lines
      .replace(/\n{3,}/g, "\n\n");
  }

  // Generate action name that follows patterns
  generateConsistentActionName(operation, path, method) {
    // Use existing patterns from the codebase
    if (operation.summary) {
      // Clean up the summary to match existing patterns
      return operation.summary
        .replace(/^(Get|Send|Create|Update|Delete)\s+/i, (match) =>
          match.charAt(0).toUpperCase() + match.slice(1).toLowerCase())
        .replace(/\s+sms\s+/gi, " SMS ")
        .replace(/\s+mms\s+/gi, " MMS ")
        .trim();
    }

    // Fallback to generated name with proper capitalization
    const pathParts = path.split("/").filter((p) => p && !p.startsWith("{"));
    const methodName = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
    const resource = pathParts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "))
      .join(" ");

    return `${methodName} ${resource}`;
  }

  // Generate action description following existing patterns
  generateConsistentDescription(operation, actionName) {
    let description = operation.description || operation.summary || actionName;

    // Clean up description
    description = description
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Ensure it ends with period if not already
    if (!description.endsWith(".")) {
      description += ".";
    }

    // Add documentation link
    const docUrl = operation.externalDocs?.url || "https://www.infobip.com/docs/sms";
    return `${description} [See the documentation](${docUrl})`;
  }

  // Enhanced action generation with consistent patterns
  async generateEnhancedActions(options = {}) {
    const {
      overwrite = false,
      filter = null,
      limit = null,
    } = options;

    console.log("🚀 Starting Infobip action generation...");

    // Create mock app instance for OpenAPI generator
    const mockApp = {
      $auth: {
        api_key: "mock-key",
        base_url: "https://api.infobip.com",
      },
      _baseUrl: () => "https://api.infobip.com",
      _headers: () => ({
        "Authorization": "App mock-key",
        "Content-type": "application/json",
      }),
    };

    const generator = new InfobipOpenAPIGenerator(mockApp);

    try {
      // Load existing actions
      this.loadExistingActions();

      // Generate all actions from OpenAPI spec
      console.log("📡 Fetching OpenAPI specification...");
      const actions = await generator.generateAllActions();

      console.log(`📋 Found ${actions.length} potential actions in OpenAPI spec`);

      let processedActions = actions;

      // Apply filter if provided
      if (filter) {
        processedActions = actions.filter((action) =>
          action.actionKey.includes(filter) ||
          action.actionName.toLowerCase().includes(filter.toLowerCase()));
        console.log(`🔍 Filtered to ${processedActions.length} actions matching "${filter}"`);
      }

      // Apply limit if provided
      if (limit && limit > 0) {
        processedActions = processedActions.slice(0, limit);
        console.log(`📏 Limited to first ${processedActions.length} actions`);
      }

      // Generate action files
      console.log("⚡ Generating action files...");

      for (const actionData of processedActions) {
        // Enhance the action with consistent naming
        actionData.actionName = this.generateConsistentActionName(
          actionData.operation,
          actionData.path,
          actionData.method,
        );

        // Update the content with enhanced names and descriptions
        const enhancedContent = this.enhanceActionContent(actionData);
        actionData.content = enhancedContent;

        this.createActionFile(actionData, overwrite);
      }

      // Print summary
      console.log("\n📊 Generation Summary:");
      console.log(`✅ Generated: ${this.generatedCount}`);
      console.log(`⏭️  Skipped: ${this.skippedCount}`);
      console.log(`❌ Errors: ${this.errorCount}`);
      console.log(`📋 Total processed: ${processedActions.length}`);

      return {
        generated: this.generatedCount,
        skipped: this.skippedCount,
        errors: this.errorCount,
        total: processedActions.length,
      };

    } catch (error) {
      console.error("💥 Action generation failed:", error.message);
      throw error;
    }
  }

  // Enhance action content with better formatting and patterns
  enhanceActionContent(actionData) {
    const {
      actionKey, operation, path, method,
    } = actionData;

    const actionName = this.generateConsistentActionName(operation, path, method);
    const description = this.generateConsistentDescription(operation, actionName);

    // Parse path parameters
    const pathParams = path.match(/{([^}]+)}/g)?.map((p) => p.slice(1, -1)) || [];

    // Build props based on operation parameters and request body - use propDefinition pattern
    const propDefinitions = [];

    // Add path parameters as props with propDefinition pattern
    for (const param of pathParams) {
      const label = param.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      propDefinitions.push(`    ${param}: {
      type: "string",
      label: "${label}",
      description: "The ${param} parameter for the API call.",
    }`);
    }

    // Add common props based on the endpoint type using propDefinition pattern
    if (path.includes("/messages") || path.includes("/sms")) {
      if (method.toUpperCase() === "POST") {
        propDefinitions.push(`    from: {
      propDefinition: [
        infobip,
        "from",
      ],
    }`);

        propDefinitions.push(`    to: {
      propDefinition: [
        infobip,
        "phoneNumber",
      ],
    }`);

        propDefinitions.push(`    text: {
      propDefinition: [
        infobip,
        "text",
      ],
    }`);
      }
    }

    // Add query parameters for GET endpoints
    if (method.toUpperCase() === "GET") {
      propDefinitions.push(`    limit: {
      propDefinition: [
        infobip,
        "limit",
      ],
      optional: true,
    }`);
    }

    // Build props section with proper ESLint formatting
    let propsSection = "    infobip,";
    if (propDefinitions.length > 0) {
      propsSection += "\n" + propDefinitions.join(",\n") + ",";
    }

    // Escape description properly and keep under 100 chars per line
    const cleanDescription = description
      .replace(/\\/g, "")  // Remove escape characters
      .replace(/"/g, "\\\"")  // Escape quotes properly
      .replace(/\s+/g, " ")  // Clean whitespace
      .trim();

    // Use existing pattern - destructure and use data wrapper
    const destructureProps = [];
    if (pathParams.length > 0) {
      destructureProps.push(...pathParams);
    }
    if (method.toUpperCase() === "POST" && (path.includes("/messages") || path.includes("/sms"))) {
      destructureProps.push("from", "to", "text");
    }

    const allDestructureItems = [
      "infobip",
      ...destructureProps,
    ];
    const destructureSection = destructureProps.length > 0
      ? `    const {
      ${allDestructureItems.join(",\n      ")}
      ...data
    } = this;`
      : "    const { infobip } = this;";

    // Build data object for method call following existing pattern
    let dataObjectContent = "";
    if (method.toUpperCase() === "POST" && (path.includes("/messages") || path.includes("/sms"))) {
      dataObjectContent = `      data: {
        messages: [
          {
            from,
            to,
            text,
            ...data,
          },
        ],
      },`;
    } else {
      dataObjectContent = "      ...data,";
    }

    // Create the complete action content with proper ESLint formatting
    const actionContent = `import infobip from "../../infobip-enhanced.app.mjs";

export default {
  key: "${actionKey}",
  name: "${actionName}",
  description: "${cleanDescription}",
  version: "0.0.1",
  type: "action",
  props: {
${propsSection}
  },
  async run({ $ }) {
${destructureSection}

    const response = await infobip.${actionData.methodName}({
      $,
${dataObjectContent}
    });

    $.export("$summary", "${actionName} completed successfully");
    return response;
  },
};
`;

    return actionContent;
  }

  // Utility method to clean action directories
  async cleanActions(pattern = null) {
    console.log("🧹 Cleaning action directories...");

    try {
      const actionDirs = fs.readdirSync(this.actionsDir, {
        withFileTypes: true,
      });

      let cleanedCount = 0;

      for (const dirent of actionDirs) {
        if (dirent.isDirectory()) {
          const dirName = dirent.name;

          // Skip if pattern provided and doesn't match
          if (pattern && !dirName.includes(pattern)) {
            continue;
          }

          // Skip existing core actions
          if ([
            "send-sms",
            "send-whatsapp-text-message",
            "send-viber-text-message",
          ].includes(dirName)) {
            console.log(`⏭️  Skipping core action: ${dirName}`);
            continue;
          }

          const fullPath = path.join(this.actionsDir, dirName);
          fs.rmSync(fullPath, {
            recursive: true,
            force: true,
          });
          console.log(`🗑️  Removed: ${dirName}`);
          cleanedCount++;
        }
      }

      console.log(`✅ Cleaned ${cleanedCount} action directories`);
      return cleanedCount;
    } catch (error) {
      console.error("❌ Error cleaning actions:", error.message);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const generator = new InfobipActionGenerator();

  try {
    if (args.includes("--clean")) {
      const pattern = args[args.indexOf("--clean") + 1];
      await generator.cleanActions(pattern);
      return;
    }

    const options = {
      overwrite: args.includes("--overwrite") || args.includes("-f"),
      filter: args.includes("--filter")
        ? args[args.indexOf("--filter") + 1]
        : null,
      limit: args.includes("--limit")
        ? parseInt(args[args.indexOf("--limit") + 1])
        : null,
    };

    if (args.includes("--help") || args.includes("-h")) {
      console.log(`
Infobip Action Generator

Usage:
  node generate-actions.mjs [options]

Options:
  --overwrite, -f     Overwrite existing actions
  --filter <pattern>  Only generate actions matching pattern
  --limit <number>    Limit number of actions to generate  
  --clean [pattern]   Clean action directories (optionally matching pattern)
  --help, -h         Show this help

Examples:
  node generate-actions.mjs
  node generate-actions.mjs --overwrite --filter sms
  node generate-actions.mjs --limit 5
  node generate-actions.mjs --clean infobip-
      `);
      return;
    }

    const result = await generator.generateEnhancedActions(options);

    if (result.generated > 0) {
      console.log("\n🎉 Action generation completed successfully!");
    }

  } catch (error) {
    console.error("\n💥 Generation failed:", error.message);
    process.exit(1);
  }
}

// Export for use as module
export default InfobipActionGenerator;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
