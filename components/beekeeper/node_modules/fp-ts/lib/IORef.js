"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IORef = void 0;
exports.newIORef = newIORef;
/**
 * @example
 * import { flatMap } from 'fp-ts/IO'
 * import { newIORef } from 'fp-ts/IORef'
 *
 * assert.strictEqual(flatMap(newIORef(1), ref => flatMap(ref.write(2), () => ref.read))(), 2)
 *
 * @category model
 * @since 2.0.0
 */
var IORef = /** @class */ (function () {
    function IORef(value) {
        var _this = this;
        this.value = value;
        this.read = function () { return _this.value; };
        this.write = this.write.bind(this);
        this.modify = this.modify.bind(this);
    }
    /**
     * @since 2.0.0
     */
    IORef.prototype.write = function (a) {
        var _this = this;
        return function () {
            _this.value = a;
        };
    };
    /**
     * @since 2.0.0
     */
    IORef.prototype.modify = function (f) {
        var _this = this;
        return function () {
            _this.value = f(_this.value);
        };
    };
    return IORef;
}());
exports.IORef = IORef;
/**
 * @category constructors
 * @since 2.0.0
 */
function newIORef(a) {
    return function () { return new IORef(a); };
}
