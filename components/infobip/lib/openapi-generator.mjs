// OpenAPI method generator for Infobip SMS API
// Automatically generates methods from the OpenAPI specification

import { axios } from "@pipedream/platform";

export class InfobipOpenAPIGenerator {
  constructor(app) {
    this.app = app;
    this.openApiUrl = "https://api.infobip.com/platform/1/openapi/sms";
    this.spec = null;
    this.generatedMethods = {};
  }

  async fetchOpenAPISpec() {
    if (this.spec) return this.spec;
    
    try {
      console.log("Fetching OpenAPI specification from:", this.openApiUrl);
      const response = await axios(this.app, {
        url: this.openApiUrl,
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });
      
      this.spec = response;
      console.log(`✅ Loaded OpenAPI spec v${this.spec.info?.version} with ${Object.keys(this.spec.paths || {}).length} endpoints`);
      return this.spec;
    } catch (error) {
      console.error("Failed to fetch OpenAPI specification:", error.message);
      throw new Error(`Cannot load OpenAPI spec: ${error.message}`);
    }
  }

  // Convert OpenAPI path parameters to method parameters
  parsePathParameters(path) {
    const params = [];
    const pathPattern = path.replace(/{([^}]+)}/g, (match, paramName) => {
      params.push(paramName);
      return `\${${paramName}}`;
    });
    return { pathPattern, params };
  }

  // Generate method name from operationId or path
  generateMethodName(operationId, path, method) {
    if (operationId) {
      // Convert kebab-case to camelCase
      return operationId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    }
    
    // Fallback: generate from path and method
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const methodName = method.toLowerCase() + pathParts.map(p => 
      p.charAt(0).toUpperCase() + p.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    ).join('');
    
    return methodName;
  }

  // Generate JSDoc documentation from OpenAPI spec
  generateJSDoc(operation, path, method) {
    const lines = [];
    
    if (operation.summary) {
      lines.push(`/**`);
      lines.push(` * ${operation.summary}`);
      if (operation.description) {
        lines.push(` * `);
        lines.push(` * ${operation.description.replace(/\n/g, '\n * ')}`);
      }
      if (operation.externalDocs?.url) {
        lines.push(` * `);
        lines.push(` * @see ${operation.externalDocs.url}`);
      }
      lines.push(` * @param {Object} opts - Request options`);
      lines.push(` * @returns {Promise<Object>} API response`);
      lines.push(` */`);
    }
    
    return lines.join('\n');
  }

  // Generate method implementation
  generateMethod(path, method, operation) {
    const { pathPattern, params } = this.parsePathParameters(path);
    const methodName = this.generateMethodName(operation.operationId, path, method);
    const jsDoc = this.generateJSDoc(operation, path, method);
    
    // Handle path parameters
    let methodImpl;
    if (params.length > 0) {
      // Method with path parameters
      const paramDestructuring = params.map(p => p).join(', ');
      methodImpl = `
${jsDoc}
${methodName}({ ${paramDestructuring}, ...opts }) {
  return this._makeRequest({
    method: "${method.toUpperCase()}",
    path: \`${pathPattern}\`,
    ...opts,
  });
}`;
    } else {
      // Method without path parameters
      methodImpl = `
${jsDoc}
${methodName}(opts = {}) {
  return this._makeRequest({
    method: "${method.toUpperCase()}",
    path: "${path}",
    ...opts,
  });
}`;
    }

    return { methodName, methodImpl };
  }

  // Generate all methods from OpenAPI spec
  async generateMethods() {
    await this.fetchOpenAPISpec();
    
    if (!this.spec?.paths) {
      throw new Error("No paths found in OpenAPI specification");
    }

    const methods = {};
    const methodCode = [];

    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
          continue; // Skip non-HTTP methods
        }

        try {
          const { methodName, methodImpl } = this.generateMethod(path, method, operation);
          
          // Avoid duplicate method names
          if (methods[methodName]) {
            console.warn(`⚠️  Duplicate method name: ${methodName} (${path} ${method})`);
            continue;
          }

          methods[methodName] = {
            path,
            method: method.toUpperCase(),
            operation,
            implementation: methodImpl,
          };

          methodCode.push(methodImpl);
        } catch (error) {
          console.error(`Failed to generate method for ${path} ${method}:`, error.message);
        }
      }
    }

    this.generatedMethods = methods;
    console.log(`✅ Generated ${Object.keys(methods).length} methods from OpenAPI spec`);
    
    return {
      methods,
      methodCode: methodCode.join(',\n'),
    };
  }

  // Get method by name
  getMethod(methodName) {
    return this.generatedMethods[methodName];
  }

  // List all available methods
  listMethods() {
    return Object.keys(this.generatedMethods);
  }

  // Generate property definitions from OpenAPI components
  generatePropDefinitions() {
    if (!this.spec?.components?.schemas) {
      return {};
    }

    const propDefs = {};
    
    // Add common properties that appear in multiple endpoints
    propDefs.sender = {
      type: "string",
      label: "Sender",
      description: "The sender ID which can be alphanumeric or numeric (e.g., CompanyName). Make sure you don't exceed character limit.",
    };

    propDefs.destinations = {
      type: "string[]",
      label: "Destinations",
      description: "Array of destination phone numbers in international format.",
    };

    propDefs.messageText = {
      type: "string",
      label: "Message Text", 
      description: "Content of the message being sent.",
    };

    return propDefs;
  }
}

export default InfobipOpenAPIGenerator;
