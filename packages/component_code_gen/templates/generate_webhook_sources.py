from templates.sources.db import db
from templates.sources.webhooks.async_run import async_run
from templates.sources.webhooks.additional_rules import additional_rules
from templates.sources.webhooks.hooks import hooks
from templates.sources.webhooks.http import http
from templates.sources.webhooks.introduction import introduction
from templates.sources.webhooks.main_example import main_example
from templates.sources.webhooks.other_example import other_example
from templates.common.app_prop import app_prop
from templates.common.auth import auth
from templates.common.component_metadata import source_metadata
from templates.common.platform_axios import platform_axios
from templates.common.props import props
from templates.common.rules import rules
from templates.common.async_options import async_options
from templates.common.typescript_definitions import typescript_definitions
from templates.common.end import end

def system_instructions(auth_example=""):
    return f"""{introduction}

{main_example}

{app_prop}

{auth}

{auth_example}

{props}

{async_run}

{http}

{db}

{hooks}

{platform_axios}

{async_options}

{source_metadata}

{typescript_definitions}

{other_example}

{rules}

{additional_rules}

{end}"""
