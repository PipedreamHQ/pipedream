import { createClient } from "@supabase/supabase-js";

export default {
  type: "app",
  app: "supabase",
  propDefinitions: {},
  methods: {
    async _client() {
      return createClient(`https://${this.$auth.subdomain}.supabase.co`, this.$auth.service_key);
    },
    async selectRow(table, column, value) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .select()
        .eq(column, value);
      return data;
    },
    async insertRow(table, rowData = {}) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .insert(rowData)
        .select();
      return data;
    },
    async upsertRow(table, rowData = {}) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .upsert(rowData)
        .select();
      return data;
    },
  },
};
