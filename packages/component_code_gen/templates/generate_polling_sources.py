from templates.sources.db import db
from templates.sources.polling.additional_rules import additional_rules
from templates.sources.polling.hooks import hooks
from templates.sources.polling.introduction import introduction
from templates.sources.polling.main_example import main_example
from templates.common.app_prop import app_prop
from templates.common.auth import auth
from templates.common.common_files import common_files
from templates.common.component_metadata import source_metadata
from templates.common.platform_axios import platform_axios
from templates.common.props import props
from templates.common.rules import rules
from templates.common.async_options import async_options
from templates.common.typescript_definitions import typescript_definitions
from templates.common.end import end

checks = [app_prop, auth, props, hooks, db, platform_axios, async_options,
          source_metadata, rules, additional_rules, typescript_definitions, end]

always_include = [introduction, typescript_definitions,
                  main_example, end]


def system_instructions(auth_details="", parsed_common_files=""):
    return f"""{introduction}

{typescript_definitions}

{rules}

{additional_rules}

{main_example}

{app_prop}

{auth}

{auth_details}

{props}

{db}

{hooks}

{platform_axios}

{async_options}

{source_metadata}

{common_files(parsed_common_files)}

{end}"""
