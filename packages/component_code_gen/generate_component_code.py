import argparse
import generate_action
import generate_webhook_sample
import generate_webhook_source


def main(action, app, prompt, verbose=False):
    validate_inputs(app, prompt)
    result = actions[action](app, prompt, verbose)
    return result


def validate_inputs(app, prompt):
    if not (bool(app) and bool(prompt)):
        raise Exception('app and prompt are required')

    if type(app) != str and type(prompt) != str:
        raise Exception('app and prompt should be strings')


actions = {
    'generate_action': generate_action.main,
    'generate_webhook_sample': generate_webhook_sample.main,
    'generate_webhook_source': generate_webhook_source.main,
}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', help='which kind of code you want to generate?', choices=actions.keys(), required=True)
    parser.add_argument('--app', help='the app_name_slug', required=True)
    parser.add_argument('prompt', help='the prompt to send to gpt, in between quotes')
    parser.add_argument('--verbose', dest='verbose', help='set the logging to debug', required=False, default=False, action='store_true')
    args = parser.parse_args()
    result = main(args.action, args.app, args.prompt, args.verbose)
    print(result)
