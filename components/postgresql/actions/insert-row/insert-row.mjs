import postgresql from "../../postgresql.app.mjs";
import { parseRowValues } from "../../common/utils.mjs";

export default {
  name: "Insert Row",
  key: "postgresql-insert-row",
  description: "Adds a new row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postgresql,
    schema: {
      propDefinition: [
        postgresql,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        postgresql,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
      ],
      description: "JSON representation of your table rows. Accept a single row (JSON Object) or multiple rows (JSON array). For example: `{ \"product_id\": 1, \"product_name\": \"Laptop Pro 15\", \"price\": 1200.50, \"stock_quantity\": 50, \"created_at\": \"2023-10-26T10:00:00Z\" }`",
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      rowValues,
    } = this;

    if (!schema || !table) {
      throw new Error("Schema and table are required");
    }

    if (!rowValues) {
      throw new Error("Row values are required");
    }

    const results = [];
    let parsedRowValues;
    
    try {
      parsedRowValues = parseRowValues(rowValues);
    } catch (error) {
      throw new Error(`Invalid row values format: ${error.message}`);
    }

    if (!parsedRowValues) {
      throw new Error("Parsed row values cannot be null or undefined");
    }

    const parsedRowValuesArray = Array.isArray(parsedRowValues)
      ? parsedRowValues
      : [parsedRowValues];

    if (parsedRowValuesArray.length === 0) {
      throw new Error("No valid rows to insert");
    }

    const errorMsg = "New row(s) not inserted due to an error. ";


    for (let i = 0; i < parsedRowValuesArray.length; i++) {
      const row = parsedRowValuesArray[i];
      
      try {
   
        if (!row || typeof row !== 'object') {
          throw new Error(`Row ${i + 1} is not a valid object`);
        }

        const columns = Object.keys(row);
        const values = Object.values(row);

        if (columns.length === 0) {
          throw new Error(`Row ${i + 1} cannot be empty`);
        }

        console.log(`Inserting row ${i + 1}:`, { 
          schema, 
          table, 
          columns, 
          values: values.map(v => typeof v === 'string' && v.length > 100 ? `${v.substring(0, 100)}...` : v)
        });

        const res = await this.postgresql.insertRow(
          schema,
          table,
          columns,
          values,
          errorMsg,
        );
        
        results.push(res);
        console.log(`Successfully inserted row ${i + 1}`);
        
      } catch (error) {
        console.error(`Failed to insert row ${i + 1}:`, {
          row,
          error: error.message,
          stack: error.stack
        });
        

        throw new Error(`${errorMsg}Row ${i + 1}: ${error.message}`);
      }
    }

    const summary = `Successfully inserted ${results.length} row${results.length === 1 ? "" : "s"}`;
    console.log(summary);
    $.export("$summary", summary);
    
    return results;
  },
};

