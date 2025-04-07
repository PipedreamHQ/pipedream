/**
 * @deprecated
 * @since 1.0.0
 */
import { isLeft } from 'fp-ts/es6/Either';
import { PathReporter } from './PathReporter';
/**
 * @category deprecated
 * @since 1.0.0
 * @deprecated
 */
export var ThrowReporter = {
    report: function (validation) {
        if (isLeft(validation)) {
            throw new Error(PathReporter.report(validation).join('\n'));
        }
    }
};
