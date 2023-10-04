from supabase import create_client
from config.config import config
from dotenv import load_dotenv
load_dotenv()


class SupabaseConnector:
    def __init__(self):
        self.client = create_client(
            config['supabase']['url'],
            config['supabase']['api_key']
        )

    def get_app_auth_meta(self, app):
        row = self.client \
            .table('apps') \
            .select('auth_type,component_code_scaffold_raw,custom_fields_json') \
            .match({'name_slug': app}) \
            .execute()
        return row.data[0] if len(row.data) else {}

    def get_app_docs_meta(self, app):
        row = self.client \
            .table('components') \
            .select('docs_url, openapi_url') \
            .match({'app_name_slug': app}) \
            .execute()
        return row.data[0] if len(row.data) else {}

    def get_docs_contents(self, app):
        rows = self.client \
            .table('api_reference_urls') \
            .select('url, content') \
            .neq('content', None) \
            .match({'app': app}) \
            .execute() \
            .data
        if rows and len(rows) > 0:
            return rows

    def get_openapi_contents(self, app):
        rows = self.client \
            .table('openapi_paths') \
            .select('path,content') \
            .match({'app': app}) \
            .neq('content', None) \
            .execute() \
            .data
        if rows and len(rows) > 0:
            return rows
