#!/usr/bin/env node

// Script to generate Infobip app methods from OpenAPI specification
// Follows the standards defined in .claude/generate-actions.prompt.md
// Downloads OpenAPI spec and generates methods for infobip.app.mjs

import fs from "fs";
import https from "https";

// Configuration
const CONFIG = {
  openApiUrl: "https://api.infobip.com/platform/1/openapi/sms",
  openApiFile: "./openapi-spec.json",
  appFile: "./infobip.app.mjs",
  methodsStartMarker: "    // Generated methods from Infobip SMS OpenAPI specification",
  methodsEndMarker: "  },",
};

class InfobipMethodGenerator {
  constructor() {
    this.generatedMethods = [];
    this.methodCount = 0;
  }

  // Download OpenAPI specification
  async downloadOpenApiSpec() {
    console.log("📡 Downloading OpenAPI specification...");

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(CONFIG.openApiFile);

      https.get(CONFIG.openApiUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log("✅ OpenAPI specification downloaded successfully");
          resolve();
        });

        file.on("error", (err) => {
          fs.unlink(CONFIG.openApiFile, () => {}); // Clean up
          reject(err);
        });
      }).on("error", (err) => {
        reject(err);
      });
    });
  }

  // Read and parse OpenAPI specification
  readOpenApiSpec() {
    console.log("📖 Reading OpenAPI specification...");

    if (!fs.existsSync(CONFIG.openApiFile)) {
      throw new Error("OpenAPI specification file not found. Please download it first.");
    }

    const content = fs.readFileSync(CONFIG.openApiFile, "utf8");
    const spec = JSON.parse(content);

    console.log(`✅ Found ${Object.keys(spec.paths || {}).length} API endpoints`);
    return spec;
  }

  // Convert operationId to camelCase method name
  operationIdToCamelCase(operationId) {
    if (!operationId) return null;

    return operationId
      .split("-")
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  }

  // Generate method name from summary if operationId not available
  summaryToMethodName(summary) {
    if (!summary) return "unknownMethod";

    return summary
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .map((word, index) => {
        if (index === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
  }

  // Generate JSDoc comment for method
  generateJSDoc(operation, path) {
    const summary = operation.summary || "API method";
    const description = operation.description || summary;
    const externalDocs = operation.externalDocs?.url;
    const hasRequestBody = operation.requestBody && Object.keys(operation.requestBody).length > 0;
    const pathParams = this.extractPathParameters(path);
    const queryParams = this.extractQueryParameters(operation);

    // Break long lines for better readability
    const formatDescription = (text) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "     * ";

      for (const word of words) {
        if ((currentLine + word).length > 95) {
          lines.push(currentLine.trimEnd());
          currentLine = "     * " + word + " ";
        } else {
          currentLine += word + " ";
        }
      }

      if (currentLine.trim() !== "*") {
        lines.push(currentLine.trimEnd());
      }

      return lines.join("\n");
    };

    let jsDoc = `    /**
     * ${summary}
     *
${formatDescription(description)}`;

    if (externalDocs) {
      jsDoc += `\n     *
     * @see {@link ${externalDocs}|External Documentation}`;
    }

    jsDoc += `\n     *
     * @param {{
     *   data?: object, // Request body${hasRequestBody
    ? ", required"
    : ", if applicable"}`;

    if (pathParams.length > 0) {
      jsDoc += `\n     *   pathParams?: [{
     *     name: string;
     *     value: string;
     *   }] // Path parameters: ${pathParams.join(", ")},`;
    }

    if (queryParams.length > 0 || path.includes("query")) {
      jsDoc += `\n     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,`;
    }

    jsDoc += `\n     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */`;

    return jsDoc;
  }

  // Generate method implementation following the exact pattern from the prompt
  generateMethodImplementation(methodName, path, httpMethod) {
    // Check if path has parameters
    const hasPathParams = path.includes("{");

    let pathHandling;
    if (hasPathParams) {
      pathHandling = `    const { pathParams, pathQuery, ...rest } = opts;
    // Example of paths:
    // * /ct/1/log/end/{messageId}
    // * /sms/3/messages
    //* /whatsapp/{versionId}/message/template/{templateName}
    let path = \`${path}\`;
    pathParams.forEach(({ name, value }) => {
        path = path.replace(\`{\${name}}\`, value);
    });

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += \`\${separator}\${name}=\${encodeURIComponent(value)}\`;
    });`;
    } else {
      pathHandling = `    const { pathQuery, ...rest } = opts;
    let path = "${path}";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += \`\${separator}\${name}=\${encodeURIComponent(value)}\`;
    });`;
    }

    return `${pathHandling}

    return this._makeRequest({
        method: "${httpMethod.toUpperCase()}",
        path,
        ...rest,
    });`;
  }

  // Extract path parameters from path
  extractPathParameters(path) {
    const matches = path.match(/{([^}]+)}/g);
    return matches
      ? matches.map((match) => match.slice(1, -1))
      : [];
  }

  // Extract query parameters from operation
  extractQueryParameters(operation) {
    const parameters = operation.parameters || [];
    return parameters
      .filter((param) => param.in === "query")
      .map((param) => param.name);
  }

  // Generate complete method
  generateMethod(path, httpMethod, operation) {
    const operationId = operation.operationId;
    const summary = operation.summary;

    // Generate method name
    let methodName;
    if (operationId) {
      methodName = this.operationIdToCamelCase(operationId);
    } else {
      methodName = this.summaryToMethodName(summary);
    }

    // Generate JSDoc
    const jsDoc = this.generateJSDoc(operation, path, httpMethod);

    // Generate implementation
    const implementation = this.generateMethodImplementation(methodName, path, httpMethod);

    return `${jsDoc}
${methodName}(opts = {}) {
${implementation}
}`;
  }

  // Process OpenAPI specification and generate methods
  generateMethodsFromSpec(spec) {
    console.log("⚡ Generating methods from OpenAPI specification...");

    const paths = spec.paths || {};
    const methods = [];

    for (const [
      path,
      pathObj,
    ] of Object.entries(paths)) {
      for (const [
        httpMethod,
        operation,
      ] of Object.entries(pathObj)) {
        if (typeof operation === "object" && operation.operationId) {
          try {
            const method = this.generateMethod(path, httpMethod, operation);
            methods.push(method);
            this.methodCount++;
          } catch (error) {
            console.warn(`⚠️  Skipped ${httpMethod.toUpperCase()} ${path}: ${error.message}`);
          }
        }
      }
    }

    console.log(`✅ Generated ${this.methodCount} methods`);
    return methods;
  }

  // Update the infobip.app.mjs file
  updateAppFile(methods) {
    console.log("📝 Updating infobip.app.mjs file...");

    if (!fs.existsSync(CONFIG.appFile)) {
      throw new Error(`App file not found: ${CONFIG.appFile}`);
    }

    const content = fs.readFileSync(CONFIG.appFile, "utf8");
    const lines = content.split("\n");

    // Find markers
    const startIndex = lines.findIndex((line) => line.includes("Generated methods from Infobip"));
    // Find the closing brace of the methods object
    let endIndex = -1;

    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() === "};" && i > 0 && lines[i - 1].trim() === "},") {
        endIndex = i - 1; // The "  }," line
        break;
      }
    }

    if (startIndex === -1) {
      throw new Error("Could not find method start marker in app file");
    }
    if (endIndex === -1) {
      throw new Error("Could not find method end marker in app file. Looking for the methods object closing brace");
    }

    // Generate new content
    const timestamp = new Date().toISOString();
    const methodsHeader = [
      "",
      "    // Generated methods from Infobip SMS OpenAPI specification",
      `    // Total methods generated: ${this.methodCount}`,
      `    // Generated on: ${timestamp}`,
      "",
    ];

    // Combine everything
    const methodLines = methods.map((method, index) => {
      const isLast = index === methods.length - 1;
      return method + (isLast
        ? ""
        : ",");
    }).join("\n")
      .split("\n");

    const newLines = [
      ...lines.slice(0, startIndex),
      ...methodsHeader,
      ...methodLines,
      "",
      "  },",
      "};",
    ];

    // Write back to file
    const newContent = newLines.join("\n");
    fs.writeFileSync(CONFIG.appFile, newContent, "utf8");

    console.log(`✅ Updated ${CONFIG.appFile} with ${this.methodCount} methods`);
  }

  // Clean up temporary files
  cleanup() {
    if (fs.existsSync(CONFIG.openApiFile)) {
      fs.unlinkSync(CONFIG.openApiFile);
      console.log("🧹 Cleaned up temporary files");
    }
  }

  // Main generation process
  async generate() {
    try {
      console.log("🚀 Starting Infobip method generation...");

      // Download OpenAPI spec
      await this.downloadOpenApiSpec();

      // Read and parse spec
      const spec = this.readOpenApiSpec();

      // Generate methods
      const methods = this.generateMethodsFromSpec(spec);

      // Update app file
      this.updateAppFile(methods);

      // Keep OpenAPI spec for reference

      console.log("\n🎉 Method generation completed successfully!");
      console.log(`📊 Generated ${this.methodCount} methods from OpenAPI specification`);

    } catch (error) {
      console.error("\n💥 Generation failed:", error.message);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Infobip Method Generator

Generates methods for infobip.app.mjs from OpenAPI specification.
Follows standards defined in .claude/generate-actions.prompt.md

Usage:
  node generate-app.mjs [options]

Options:
  --help, -h    Show this help

The script will:
1. Download the OpenAPI spec from ${CONFIG.openApiUrl}
2. Parse the specification and generate methods
3. Update ${CONFIG.appFile} with the new methods
4. Clean up temporary files
    `);
    return;
  }

  const generator = new InfobipMethodGenerator();

  try {
    await generator.generate();
  } catch (error) {
    console.error("\n💥 Generation failed:", error.message);
    process.exit(1);
  }
}

// Export for use as module
export default InfobipMethodGenerator;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
