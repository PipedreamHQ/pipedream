from templates.apps.additional_rules import additional_rules
from templates.apps.introduction import introduction
from templates.apps.main_example import main_example
from templates.apps.methods import methods
from templates.apps.prop_definitions import prop_definitions
from templates.common.props import props
from templates.common.common_files import common_files
from templates.common.platform_axios import platform_axios
from templates.common.rules import rules
from templates.common.async_options import async_options
from templates.common.typescript_definitions import typescript_definitions
from templates.common.end import end

checks = [platform_axios, async_options, methods, props,
          prop_definitions, rules, additional_rules, typescript_definitions, end]

always_include = [introduction, typescript_definitions,
                  main_example, end]


def system_instructions(auth_details="", parsed_common_files=""):
    return f"""{introduction}

{rules}

{additional_rules}

{main_example}

{typescript_definitions}

{auth_details}

{prop_definitions}

{props}

{methods}

{platform_axios}

{async_options}

{end}"""
