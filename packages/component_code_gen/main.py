import os
import argparse
import templates.generate_actions
import templates.generate_webhook_sources
import templates.generate_polling_sources
import templates.generate_apps


available_templates = {
    'action': templates.generate_actions,
    'webhook_source': templates.generate_webhook_sources,
    'polling_source': templates.generate_polling_sources,
    'app': templates.generate_apps,
}


def main(component_type, app, instructions, tries, verbose=False):
    if verbose:
        os.environ['LOGGING_LEVEL'] = 'DEBUG'

    try:
        templates = available_templates[component_type]
    except:
        raise ValueError(
            f'Templates for {component_type}s are not available. Please choose one of {available_templates.keys()}')

    # this is here so that the DEBUG environment variable is set before the import
    from code_gen.generate_component_code import generate_code
    result = generate_code(app, instructions, templates, tries)
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--type', help='Which kind of code you want to generate?',
                        choices=available_templates.keys(), required=True)
    parser.add_argument('--app', help='The app_name_slug', required=True)
    parser.add_argument(
        '--instructions', help='Markdown file with instructions: prompt + api docs', required=True)
    parser.add_argument('--num_tries', dest='tries', help='The number of times we call the model to generate code',
                        required=False, default=3, type=int)
    parser.add_argument('--verbose', dest='verbose', help='Set the logging to debug',
                        required=False, default=False, action='store_true')
    args = parser.parse_args()

    with open(args.instructions, 'r') as f:
        instructions = f.read()

    result = main(args.type, args.app, instructions, args.tries, args.verbose)
    print(result)
