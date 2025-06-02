/**
 * @since 2.0.0
 */
import { getApplicativeComposition } from './Applicative';
import * as E from './Either';
import * as _ from './internal';
/** @deprecated */
export function getValidationM(S, M) {
    var A = getApplicativeComposition(M, E.getApplicativeValidation(S));
    return {
        map: A.map,
        ap: A.ap,
        of: A.of,
        chain: function (ma, f) { return M.chain(ma, function (e) { return (_.isLeft(e) ? M.of(_.left(e.left)) : f(e.right)); }); },
        alt: function (me, that) {
            return M.chain(me, function (e1) {
                return _.isRight(e1) ? M.of(e1) : M.map(that(), function (e2) { return (_.isLeft(e2) ? _.left(S.concat(e1.left, e2.left)) : e2); });
            });
        }
    };
}
