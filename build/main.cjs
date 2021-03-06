'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var os = _interopDefault(require('os'));
var NodeWorker_mod = _interopDefault(require('worker_threads'));

/* global BigInt */
const hexLen = [ 0, 1, 2, 2, 3, 3, 3, 3, 4 ,4 ,4 ,4 ,4 ,4 ,4 ,4];

function fromString(s, radix) {
    if ((!radix)||(radix==10)) {
        return BigInt(s);
    } else if (radix==16) {
        if (s.slice(0,2) == "0x") {
            return BigInt(s);
        } else {
            return BigInt("0x"+s);
        }
    }
}

const e = fromString;

function fromArray(a, radix) {
    let acc =0n;
    radix = BigInt(radix);
    for (let i=0; i<a.length; i++) {
        acc = acc*radix + BigInt(a[i]);
    }
    return acc;
}

function bitLength(a) {
    const aS =a.toString(16);
    return (aS.length-1)*4 +hexLen[parseInt(aS[0], 16)];
}

function isNegative(a) {
    return BigInt(a) < 0n;
}

function isZero(a) {
    return !a;
}

function shiftLeft(a, n) {
    return BigInt(a) << BigInt(n);
}

function shiftRight(a, n) {
    return BigInt(a) >> BigInt(n);
}

const shl = shiftLeft;
const shr = shiftRight;

function isOdd(a) {
    return (BigInt(a) & 1n) == 1n;
}


function naf(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            const z = 2 - Number(E % 4n);
            res.push( z );
            E = E - BigInt(z);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
}


function bits(n) {
    let E = BigInt(n);
    const res = [];
    while (E) {
        if (E & 1n) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E >> 1n;
    }
    return res;
}

function toNumber(s) {
    if (s>BigInt(Number.MAX_SAFE_INTEGER )) {
        throw new Error("Number too big");
    }
    return Number(s);
}

function toArray(s, radix) {
    const res = [];
    let rem = BigInt(s);
    radix = BigInt(radix);
    while (rem) {
        res.unshift( Number(rem % radix));
        rem = rem / radix;
    }
    return res;
}


function add(a, b) {
    return BigInt(a) + BigInt(b);
}

function sub(a, b) {
    return BigInt(a) - BigInt(b);
}

function neg(a) {
    return -BigInt(a);
}

function mul(a, b) {
    return BigInt(a) * BigInt(b);
}

function square(a) {
    return BigInt(a) * BigInt(a);
}

function pow(a, b) {
    return BigInt(a) ** BigInt(b);
}

function exp(a, b) {
    return BigInt(a) ** BigInt(b);
}

function abs(a) {
    return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
}

function div(a, b) {
    return BigInt(a) / BigInt(b);
}

function mod(a, b) {
    return BigInt(a) % BigInt(b);
}

function eq(a, b) {
    return BigInt(a) == BigInt(b);
}

function neq(a, b) {
    return BigInt(a) != BigInt(b);
}

function lt(a, b) {
    return BigInt(a) < BigInt(b);
}

function gt(a, b) {
    return BigInt(a) > BigInt(b);
}

function leq(a, b) {
    return BigInt(a) <= BigInt(b);
}

function geq(a, b) {
    return BigInt(a) >= BigInt(b);
}

function band(a, b) {
    return BigInt(a) & BigInt(b);
}

function bor(a, b) {
    return BigInt(a) | BigInt(b);
}

function bxor(a, b) {
    return BigInt(a) ^ BigInt(b);
}

function land(a, b) {
    return BigInt(a) && BigInt(b);
}

function lor(a, b) {
    return BigInt(a) || BigInt(b);
}

function lnot(a) {
    return !BigInt(a);
}

var Scalar_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString,
    e: e,
    fromArray: fromArray,
    bitLength: bitLength,
    isNegative: isNegative,
    isZero: isZero,
    shiftLeft: shiftLeft,
    shiftRight: shiftRight,
    shl: shl,
    shr: shr,
    isOdd: isOdd,
    naf: naf,
    bits: bits,
    toNumber: toNumber,
    toArray: toArray,
    add: add,
    sub: sub,
    neg: neg,
    mul: mul,
    square: square,
    pow: pow,
    exp: exp,
    abs: abs,
    div: div,
    mod: mod,
    eq: eq,
    neq: neq,
    lt: lt,
    gt: gt,
    leq: leq,
    geq: geq,
    band: band,
    bor: bor,
    bxor: bxor,
    land: land,
    lor: lor,
    lnot: lnot
});

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var BigInteger = createCommonjsModule(function (module) {
var bigInt = (function (undefined$1) {

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    };
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    };
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    };

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    };


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    };
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    };

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    };

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    };

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    };
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    };

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    };

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    };

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    };

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined$1) return isPrime;
        var n = this.abs();
        var t = iterations === undefined$1 ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    };

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    };

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    };
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < top) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix !== 10) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined$1) radix = 10;
        if (radix != 10) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    };

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}
});

function fromString$1(s, radix) {
    if (typeof s == "string") {
        if (s.slice(0,2) == "0x") {
            return BigInteger(s.slice(2), 16);
        } else {
            return BigInteger(s,radix);
        }
    } else {
        return BigInteger(s, radix);
    }
}

const e$1 = fromString$1;

function fromArray$1(a, radix) {
    return BigInteger.fromArray(a, radix);
}

function bitLength$1(a) {
    return BigInteger(a).bitLength();
}

function isNegative$1(a) {
    return BigInteger(a).isNegative();
}

function isZero$1(a) {
    return BigInteger(a).isZero();
}

function shiftLeft$1(a, n) {
    return BigInteger(a).shiftLeft(n);
}

function shiftRight$1(a, n) {
    return BigInteger(a).shiftRight(n);
}

const shl$1 = shiftLeft$1;
const shr$1 = shiftRight$1;

function isOdd$1(a) {
    return BigInteger(a).isOdd();
}


function naf$1(n) {
    let E = BigInteger(n);
    const res = [];
    while (E.gt(BigInteger.zero)) {
        if (E.isOdd()) {
            const z = 2 - E.mod(4).toJSNumber();
            res.push( z );
            E = E.minus(z);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function bits$1(n) {
    let E = BigInteger(n);
    const res = [];
    while (E.gt(BigInteger.zero)) {
        if (E.isOdd()) {
            res.push(1);
        } else {
            res.push( 0 );
        }
        E = E.shiftRight(1);
    }
    return res;
}

function toNumber$1(s) {
    if (!s.lt(BigInteger("9007199254740992", 10))) {
        throw new Error("Number too big");
    }
    return s.toJSNumber();
}

function toArray$1(s, radix) {
    return BigInteger(s).toArray(radix);
}

function add$1(a, b) {
    return BigInteger(a).add(BigInteger(b));
}

function sub$1(a, b) {
    return BigInteger(a).minus(BigInteger(b));
}

function neg$1(a) {
    return BigInteger.zero.minus(BigInteger(a));
}

function mul$1(a, b) {
    return BigInteger(a).times(BigInteger(b));
}

function square$1(a) {
    return BigInteger(a).square();
}

function pow$1(a, b) {
    return BigInteger(a).pow(BigInteger(b));
}

function exp$1(a, b) {
    return BigInteger(a).pow(BigInteger(b));
}

function abs$1(a) {
    return BigInteger(a).abs();
}

function div$1(a, b) {
    return BigInteger(a).divide(BigInteger(b));
}

function mod$1(a, b) {
    return BigInteger(a).mod(BigInteger(b));
}

function eq$1(a, b) {
    return BigInteger(a).eq(BigInteger(b));
}

function neq$1(a, b) {
    return BigInteger(a).neq(BigInteger(b));
}

function lt$1(a, b) {
    return BigInteger(a).lt(BigInteger(b));
}

function gt$1(a, b) {
    return BigInteger(a).gt(BigInteger(b));
}

function leq$1(a, b) {
    return BigInteger(a).leq(BigInteger(b));
}

function geq$1(a, b) {
    return BigInteger(a).geq(BigInteger(b));
}

function band$1(a, b) {
    return BigInteger(a).and(BigInteger(b));
}

function bor$1(a, b) {
    return BigInteger(a).or(BigInteger(b));
}

function bxor$1(a, b) {
    return BigInteger(a).xor(BigInteger(b));
}

function land$1(a, b) {
    return (!BigInteger(a).isZero()) && (!BigInteger(b).isZero());
}

function lor$1(a, b) {
    return (!BigInteger(a).isZero()) || (!BigInteger(b).isZero());
}

function lnot$1(a) {
    return BigInteger(a).isZero();
}

var Scalar_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromString: fromString$1,
    e: e$1,
    fromArray: fromArray$1,
    bitLength: bitLength$1,
    isNegative: isNegative$1,
    isZero: isZero$1,
    shiftLeft: shiftLeft$1,
    shiftRight: shiftRight$1,
    shl: shl$1,
    shr: shr$1,
    isOdd: isOdd$1,
    naf: naf$1,
    bits: bits$1,
    toNumber: toNumber$1,
    toArray: toArray$1,
    add: add$1,
    sub: sub$1,
    neg: neg$1,
    mul: mul$1,
    square: square$1,
    pow: pow$1,
    exp: exp$1,
    abs: abs$1,
    div: div$1,
    mod: mod$1,
    eq: eq$1,
    neq: neq$1,
    lt: lt$1,
    gt: gt$1,
    leq: leq$1,
    geq: geq$1,
    band: band$1,
    bor: bor$1,
    bxor: bxor$1,
    land: land$1,
    lor: lor$1,
    lnot: lnot$1
});

const supportsNativeBigInt = typeof BigInt === "function";

let Scalar = {};
if (supportsNativeBigInt) {
    Object.assign(Scalar, Scalar_native);
} else {
    Object.assign(Scalar, Scalar_bigint);
}


// Returns a buffer with Little Endian Representation
Scalar.toRprLE = function rprBE(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
    for (let i=l; i<v.length; i++) v[i] = 0;
    for (let i=v.length*4; i<n8; i++) buff[i] = Scalar.toNumber(Scalar.band(Scalar.shiftRight(e, i*8), 0xFF));
};

// Returns a buffer with Big Endian Representation
Scalar.toRprBE = function rprLEM(buff, o, e, n8) {
    const s = "0000000" + e.toString(16);
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
    for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
    for (let i=0; i<n8/4-l; i++) v[i] = 0;
};

// Pases a buffer with Little Endian Representation
Scalar.fromRprLE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new Uint32Array(buff.buffer, o, n8/4);
    const a = new Array(n8/4);
    v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
    return Scalar.fromString(a.join(""), 16);
};

// Pases a buffer with Big Endian Representation
Scalar.fromRprBE = function rprLEM(buff, o, n8) {
    n8 = n8 || buff.byteLength;
    const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
    const a = new Array(n8/4);
    for (let i=0; i<n8/4; i++) {
        a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
    }
    return Scalar.fromString(a.join(""), 16);
};

Scalar.toString = function toString(a, radix) {
    return a.toString(radix);
};

Scalar.toLEBuff = function toLEBuff(a) {
    const buff = new Uint8Array(Math.floor((Scalar.bitLength(a) - 1) / 8) +1);
    Scalar.toRprLE(buff, 0, a, buff.byteLength);
    return buff;
};


Scalar.zero = Scalar.e(0);
Scalar.one = Scalar.e(1);

let {
    toRprLE,
    toRprBE,
    fromRprLE,
    fromRprBE,
    toString,
    toLEBuff,
    zero,
    one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2,
} = Scalar;

var _Scalar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toRprLE: toRprLE,
    toRprBE: toRprBE,
    fromRprLE: fromRprLE,
    fromRprBE: fromRprBE,
    toString: toString,
    toLEBuff: toLEBuff,
    zero: zero,
    one: one,
    fromString: fromString$2,
    e: e$2,
    fromArray: fromArray$2,
    bitLength: bitLength$2,
    isNegative: isNegative$2,
    isZero: isZero$2,
    shiftLeft: shiftLeft$2,
    shiftRight: shiftRight$2,
    shl: shl$2,
    shr: shr$2,
    isOdd: isOdd$2,
    naf: naf$2,
    bits: bits$2,
    toNumber: toNumber$2,
    toArray: toArray$2,
    add: add$2,
    sub: sub$2,
    neg: neg$2,
    mul: mul$2,
    square: square$2,
    pow: pow$2,
    exp: exp$2,
    abs: abs$2,
    div: div$2,
    mod: mod$2,
    eq: eq$2,
    neq: neq$2,
    lt: lt$2,
    gt: gt$2,
    leq: leq$2,
    geq: geq$2,
    band: band$2,
    bor: bor$2,
    bxor: bxor$2,
    land: land$2,
    lor: lor$2,
    lnot: lnot$2
});

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

/*
    This library does operations on polynomials with coefficients in a field F.

    A polynomial P(x) = p0 + p1 * x + p2 * x^2 + ... + pn * x^n  is represented
    by the array [ p0, p1, p2, ... , pn ].
 */

class PolField {
    constructor (F) {
        this.F = F;

        let rem = F.sqrt_t;
        let s = F.sqrt_s;

        const five = this.F.add(this.F.add(this.F.two, this.F.two), this.F.one);

        this.w = new Array(s+1);
        this.wi = new Array(s+1);
        this.w[s] = this.F.pow(five, rem);
        this.wi[s] = this.F.inv(this.w[s]);

        let n=s-1;
        while (n>=0) {
            this.w[n] = this.F.square(this.w[n+1]);
            this.wi[n] = this.F.square(this.wi[n+1]);
            n--;
        }


        this.roots = [];
/*        for (let i=0; i<16; i++) {
            let r = this.F.one;
            n = 1 << i;
            const rootsi = new Array(n);
            for (let j=0; j<n; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }

            this.roots.push(rootsi);
        }
    */
        this._setRoots(15);
    }

    _setRoots(n) {
        for (let i=n; (i>=0) && (!this.roots[i]); i--) {
            let r = this.F.one;
            const nroots = 1 << i;
            const rootsi = new Array(nroots);
            for (let j=0; j<nroots; j++) {
                rootsi[j] = r;
                r = this.F.mul(r, this.w[i]);
            }
            this.roots[i] = rootsi;
        }
    }

    add(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.add(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        const m = Math.max(a.length, b.length);
        const res = new Array(m);
        for (let i=0; i<m; i++) {
            res[i] = this.F.sub(a[i] || this.F.zero, b[i] || this.F.zero);
        }
        return this.reduce(res);
    }

    mulScalar(p, b) {
        if (this.F.eq(b, this.F.zero)) return [];
        if (this.F.eq(b, this.F.one)) return p;
        const res = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.mul(p[i], b);
        }
        return res;
    }



    mul(a, b) {
        if (a.length == 0) return [];
        if (b.length == 0) return [];
        if (a.length == 1) return this.mulScalar(b, a[0]);
        if (b.length == 1) return this.mulScalar(a, b[0]);

        if (b.length > a.length) {
            [b, a] = [a, b];
        }

        if ((b.length <= 2) || (b.length < log2(a.length))) {
            return this.mulNormal(a,b);
        } else {
            return this.mulFFT(a,b);
        }
    }

    mulNormal(a, b) {
        let res = [];
        for (let i=0; i<b.length; i++) {
            res = this.add(res, this.scaleX(this.mulScalar(a, b[i]), i) );
        }
        return res;
    }

    mulFFT(a,b) {
        const longestN = Math.max(a.length, b.length);
        const bitsResult = log2(longestN-1)+2;
        this._setRoots(bitsResult);

        const m = 1 << bitsResult;
        const ea = this.extend(a,m);
        const eb = this.extend(b,m);

        const ta = __fft(this, ea, bitsResult, 0, 1);
        const tb = __fft(this, eb, bitsResult, 0, 1);

        const tres = new Array(m);

        for (let i=0; i<m; i++) {
            tres[i] = this.F.mul(ta[i], tb[i]);
        }

        const res = __fft(this, tres, bitsResult, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return this.reduce(resn);
    }



    square(a) {
        return this.mul(a,a);
    }

    scaleX(p, n) {
        if (n==0) {
            return p;
        } else if (n>0) {
            const z = new Array(n).fill(this.F.zero);
            return z.concat(p);
        } else {
            if (-n >= p.length) return [];
            return p.slice(-n);
        }
    }

    eval2(p, x) {
        let v = this.F.zero;
        let ix = this.F.one;
        for (let i=0; i<p.length; i++) {
            v = this.F.add(v, this.F.mul(p[i], ix));
            ix = this.F.mul(ix, x);
        }
        return v;
    }

    eval(p,x) {
        const F = this.F;
        if (p.length == 0) return F.zero;
        const m = this._next2Power(p.length);
        const ep = this.extend(p, m);

        return _eval(ep, x, 0, 1, m);

        function _eval(p, x, offset, step, n) {
            if (n==1) return p[offset];
            const newX = F.square(x);
            const res= F.add(
                _eval(p, newX, offset, step << 1, n >> 1),
                F.mul(
                    x,
                    _eval(p, newX, offset+step , step << 1, n >> 1)));
            return res;
        }
    }

    lagrange(points) {
        let roots = [this.F.one];
        for (let i=0; i<points.length; i++) {
            roots = this.mul(roots, [this.F.neg(points[i][0]), this.F.one]);
        }

        let sum = [];
        for (let i=0; i<points.length; i++) {
            let mpol = this.ruffini(roots, points[i][0]);
            const factor =
                this.F.mul(
                    this.F.inv(this.eval(mpol, points[i][0])),
                    points[i][1]);
            mpol = this.mulScalar(mpol, factor);
            sum = this.add(sum, mpol);
        }
        return sum;
    }


    fft(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res = __fft(this, ep, bits, 0, 1);
        return res;
    }

    fft2(p) {
        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);

        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res = __fft2(this, ep, bits);
        return res;
    }


    ifft(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        const res =  __fft(this, ep, bits, 0, 1);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }


    ifft2(p) {

        if (p.length <= 1) return p;
        const bits = log2(p.length-1)+1;
        this._setRoots(bits);
        const m = 1 << bits;
        const ep = this.extend(p, m);
        __bitReverse(ep, bits);
        const res =  __fft2(this, ep, bits);

        const twoinvm = this.F.inv( this.F.mulScalar(this.F.one, m) );
        const resn = new Array(m);
        for (let i=0; i<m; i++) {
            resn[i] = this.F.mul(res[(m-i)%m], twoinvm);
        }

        return resn;

    }

    _fft(pall, bits, offset, step) {

        const n = 1 << bits;
        if (n==1) {
            return [ pall[offset] ];
        }

        const ndiv2 = n >> 1;
        const p1 = this._fft(pall, bits-1, offset, step*2);
        const p2 = this._fft(pall, bits-1, offset+step, step*2);

        const out = new Array(n);

        let m= this.F.one;
        for (let i=0; i<ndiv2; i++) {
            out[i] = this.F.add(p1[i], this.F.mul(m, p2[i]));
            out[i+ndiv2] = this.F.sub(p1[i], this.F.mul(m, p2[i]));
            m = this.F.mul(m, this.w[bits]);
        }

        return out;
    }

    extend(p, e) {
        if (e == p.length) return p;
        const z = new Array(e-p.length).fill(this.F.zero);

        return p.concat(z);
    }

    reduce(p) {
        if (p.length == 0) return p;
        if (! this.F.eq(p[p.length-1], this.F.zero) ) return p;
        let i=p.length-1;
        while( i>0 && this.F.eq(p[i], this.F.zero) ) i--;
        return p.slice(0, i+1);
    }

    eq(a, b) {
        const pa = this.reduce(a);
        const pb = this.reduce(b);

        if (pa.length != pb.length) return false;
        for (let i=0; i<pb.length; i++) {
            if (!this.F.eq(pa[i], pb[i])) return false;
        }

        return true;
    }

    ruffini(p, r) {
        const res = new Array(p.length-1);
        res[res.length-1] = p[p.length-1];
        for (let i = res.length-2; i>=0; i--) {
            res[i] = this.F.add(this.F.mul(res[i+1], r), p[i+1]);
        }
        return res;
    }

    _next2Power(v) {
        v--;
        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;
        v++;
        return v;
    }

    toString(p) {
        const ap = this.normalize(p);
        let S = "";
        for (let i=ap.length-1; i>=0; i--) {
            if (!this.F.eq(p[i], this.F.zero)) {
                if (S!="") S += " + ";
                S = S + p[i].toString(10);
                if (i>0) {
                    S = S + "x";
                    if (i>1) {
                        S = S + "^" +i;
                    }
                }
            }
        }
        return S;
    }

    normalize(p) {
        const res  = new Array(p.length);
        for (let i=0; i<p.length; i++) {
            res[i] = this.F.normalize(p[i]);
        }
        return res;
    }


    _reciprocal(p, bits) {
        const k = 1 << bits;
        if (k==1) {
            return [ this.F.inv(p[0]) ];
        }
        const np = this.scaleX(p, -k/2);
        const q = this._reciprocal(np, bits-1);
        const a = this.scaleX(this.double(q), 3*k/2-2);
        const b = this.mul( this.square(q), p);

        return this.scaleX(this.sub(a,b),   -(k-2));
    }

    // divides x^m / v
    _div2(m, v) {
        const kbits = log2(v.length-1)+1;
        const k = 1 << kbits;

        const scaleV = k - v.length;

        // rec = x^(k - 2) / v* x^scaleV =>
        // rec = x^(k-2-scaleV)/ v
        //
        // res = x^m/v = x^(m + (2*k-2 - scaleV) - (2*k-2 - scaleV)) /v =>
        // res = rec * x^(m - (2*k-2 - scaleV)) =>
        // res = rec * x^(m - 2*k + 2 + scaleV)

        const rec = this._reciprocal(this.scaleX(v, scaleV), kbits);
        const res = this.scaleX(rec, m - 2*k + 2 + scaleV);

        return res;
    }

    div(_u, _v) {
        if (_u.length < _v.length) return [];
        const kbits = log2(_v.length-1)+1;
        const k = 1 << kbits;

        const u = this.scaleX(_u, k-_v.length);
        const v = this.scaleX(_v, k-_v.length);

        const n = v.length-1;
        let m = u.length-1;

        const s = this._reciprocal(v, kbits);
        let t;
        if (m>2*n) {
            t = this.sub(this.scaleX([this.F.one], 2*n), this.mul(s, v));
        }

        let q = [];
        let rem = u;
        let us, ut;
        let finish = false;

        while (!finish) {
            us = this.mul(rem, s);
            q = this.add(q, this.scaleX(us, -2*n));

            if ( m > 2*n ) {
                ut = this.mul(rem, t);
                rem = this.scaleX(ut, -2*n);
                m = rem.length-1;
            } else {
                finish = true;
            }
        }

        return q;
    }


    // returns the ith nth-root of one
    oneRoot(n, i) {
        let nbits = log2(n-1)+1;
        let res = this.F.one;
        let r = i;

        if(i>=n) {
            throw new Error("Given 'i' should be lower than 'n'");
        }
        else if (1<<nbits !== n) {
            throw new Error(`Internal errlr: ${n} should equal ${1<<nbits}`);
        }

        while (r>0) {
            if (r & 1 == 1) {
                res = this.F.mul(res, this.w[nbits]);
            }
            r = r >> 1;
            nbits --;
        }
        return res;
    }

    computeVanishingPolinomial(bits, t) {
        const m = 1 << bits;
        return this.F.sub(this.F.pow(t, m), this.F.one);
    }

    evaluateLagrangePolynomials(bits, t) {
        const m= 1 << bits;
        const tm = this.F.pow(t, m);
        const u= new Array(m).fill(this.F.zero);
        this._setRoots(bits);
        const omega = this.w[bits];

        if (this.F.eq(tm, this.F.one)) {
            for (let i = 0; i < m; i++) {
                if (this.F.eq(this.roots[bits][0],t)) { // i.e., t equals omega^i
                    u[i] = this.F.one;
                    return u;
                }
            }
        }

        const z = this.F.sub(tm, this.F.one);
        //        let l = this.F.mul(z,  this.F.pow(this.F.twoinv, m));
        let l = this.F.mul(z,  this.F.inv(this.F.e(m)));
        for (let i = 0; i < m; i++) {
            u[i] = this.F.mul(l, this.F.inv(this.F.sub(t,this.roots[bits][i])));
            l = this.F.mul(l, omega);
        }

        return u;
    }

    log2(V) {
        return log2(V);
    }
}

function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
}


function __fft(PF, pall, bits, offset, step) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[offset] ];
    } else if (n==2) {
        return [
            PF.F.add(pall[offset], pall[offset + step]),
            PF.F.sub(pall[offset], pall[offset + step])];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft(PF, pall, bits-1, offset, step*2);
    const p2 = __fft(PF, pall, bits-1, offset+step, step*2);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}


function __fft2(PF, pall, bits) {

    const n = 1 << bits;
    if (n==1) {
        return [ pall[0] ];
    }

    const ndiv2 = n >> 1;
    const p1 = __fft2(PF, pall.slice(0, ndiv2), bits-1);
    const p2 = __fft2(PF, pall.slice(ndiv2), bits-1);

    const out = new Array(n);

    for (let i=0; i<ndiv2; i++) {
        out[i] = PF.F.add(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
        out[i+ndiv2] = PF.F.sub(p1[i], PF.F.mul(PF.roots[bits][i], p2[i]));
    }

    return out;
}

const _revTable = [];
for (let i=0; i<256; i++) {
    _revTable[i] = _revSlow(i, 8);
}

function _revSlow(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

function rev(idx, bits) {
    return (
        _revTable[idx >>> 24] |
        (_revTable[(idx >>> 16) & 0xFF] << 8) |
        (_revTable[(idx >>> 8) & 0xFF] << 16) |
        (_revTable[idx & 0xFF] << 24)
    ) >>> (32-bits);
}

function __bitReverse(p, bits) {
    for (let k=0; k<p.length; k++) {
        const r = rev(k, bits);
        if (r>k) {
            const tmp= p[k];
            p[k] = p[r];
            p[r] = tmp;
        }
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/


function mulScalar(F, base, e) {
    let res;

    if (isZero$2(e)) return F.zero;

    const n = naf$2(e);

    if (n[n.length-1] == 1) {
        res = base;
    } else if (n[n.length-1] == -1) {
        res = F.neg(base);
    } else {
        throw new Error("invlaud NAF");
    }

    for (let i=n.length-2; i>=0; i--) {

        res = F.double(res);

        if (n[i] == 1) {
            res = F.add(res, base);
        } else if (n[i] == -1) {
            res = F.sub(res, base);
        }
    }

    return res;
}


/*
exports.mulScalar = (F, base, e) =>{
    let res = F.zero;
    let rem = bigInt(e);
    let exp = base;

    while (! rem.eq(bigInt.zero)) {
        if (rem.and(bigInt.one).eq(bigInt.one)) {
            res = F.add(res, exp);
        }
        exp = F.double(exp);
        rem = rem.shiftRight(1);
    }

    return res;
};
*/


function exp$3(F, base, e) {

    if (isZero$2(e)) return F.one;

    const n = bits$2(e);

    if (n.legth==0) return F.one;

    let res = base;

    for (let i=n.length-2; i>=0; i--) {

        res = F.square(res);

        if (n[i]) {
            res = F.mul(res, base);
        }
    }

    return res;
}

// Check here: https://eprint.iacr.org/2012/685.pdf

function buildSqrt (F) {
    if ((F.m % 2) == 1) {
        if (eq$2(mod$2(F.p, 4), 1 )) {
            if (eq$2(mod$2(F.p, 8), 1 )) {
                if (eq$2(mod$2(F.p, 16), 1 )) {
                    // alg7_muller(F);
                    alg5_tonelliShanks(F);
                } else if (eq$2(mod$2(F.p, 16), 9 )) {
                    alg4_kong(F);
                } else {
                    throw new Error("Field withot sqrt");
                }
            } else if (eq$2(mod$2(F.p, 8), 5 )) {
                alg3_atkin(F);
            } else {
                throw new Error("Field withot sqrt");
            }
        } else if (eq$2(mod$2(F.p, 4), 3 )) {
            alg2_shanks(F);
        }
    } else {
        const pm2mod4 = mod$2(pow$2(F.p, F.m/2), 4);
        if (pm2mod4 == 1) {
            alg10_adj(F);
        } else if (pm2mod4 == 3) {
            alg9_adj(F);
        } else {
            alg8_complex(F);
        }

    }
}


function alg5_tonelliShanks(F) {
    F.sqrt_q = pow$2(F.p, F.m);

    F.sqrt_s = 0;
    F.sqrt_t = sub$2(F.sqrt_q, 1);

    while (!isOdd$2(F.sqrt_t)) {
        F.sqrt_s = F.sqrt_s + 1;
        F.sqrt_t = div$2(F.sqrt_t, 2);
    }

    let c0 = F.one;

    while (F.eq(c0, F.one)) {
        const c = F.random();
        F.sqrt_z = F.pow(c, F.sqrt_t);
        c0 = F.pow(F.sqrt_z, 1 << (F.sqrt_s-1) );
    }

    F.sqrt_tm1d2 = div$2(sub$2(F.sqrt_t, 1),2);

    F.sqrt = function(a) {
        const F=this;
        if (F.isZero(a)) return F.zero;
        let w = F.pow(a, F.sqrt_tm1d2);
        const a0 = F.pow( F.mul(F.square(w), a), 1 << (F.sqrt_s-1) );
        if (F.eq(a0, F.negone)) return null;

        let v = F.sqrt_s;
        let x = F.mul(a, w);
        let b = F.mul(x, w);
        let z = F.sqrt_z;
        while (!F.eq(b, F.one)) {
            let b2k = F.square(b);
            let k=1;
            while (!F.eq(b2k, F.one)) {
                b2k = F.square(b2k);
                k++;
            }

            w = z;
            for (let i=0; i<v-k-1; i++) {
                w = F.square(w);
            }
            z = F.square(w);
            b = F.mul(b, z);
            x = F.mul(x, w);
            v = k;
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg4_kong(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 4 not implemented");
    };
}

function alg3_atkin(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 3 not implemented");
    };
}

function alg2_shanks(F) {

    F.sqrt_q = pow$2(F.p, F.m);
    F.sqrt_e1 = div$2( sub$2(F.sqrt_q, 3) , 4);

    F.sqrt = function(a) {
        if (this.isZero(a)) return this.zero;

        // Test that have solution
        const a1 = this.pow(a, this.sqrt_e1);

        const a0 = this.mul(this.square(a1), a);

        if ( this.eq(a0, this.negone) ) return null;

        const x = this.mul(a1, a);

        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}

function alg10_adj(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 10 not implemented");
    };
}

function alg9_adj(F) {
    F.sqrt_q = pow$2(F.p, F.m/2);
    F.sqrt_e34 = div$2( sub$2(F.sqrt_q, 3) , 4);
    F.sqrt_e12 = div$2( sub$2(F.sqrt_q, 1) , 2);

    F.frobenius = function(n, x) {
        if ((n%2) == 1) {
            return F.conjugate(x);
        } else {
            return x;
        }
    };

    F.sqrt = function(a) {
        const F = this;
        const a1 = F.pow(a, F.sqrt_e34);
        const alfa = F.mul(F.square(a1), a);
        const a0 = F.mul(F.frobenius(1, alfa), alfa);
        if (F.eq(a0, F.negone)) return null;
        const x0 = F.mul(a1, a);
        let x;
        if (F.eq(alfa, F.negone)) {
            x = F.mul(x0, [F.F.zero, F.F.one]);
        } else {
            const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
            x = F.mul(b, x0);
        }
        return F.geq(x, F.zero) ? x : F.neg(x);
    };
}


function alg8_complex(F) {
    F.sqrt = function() {
        throw new Error("Sqrt alg 8 not implemented");
    };
}

function quarterRound(st, a, b, c, d) {

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 16) | ((st[d]>>>16) & 0xFFFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 12) | ((st[b]>>>20) & 0xFFF)) >>> 0;

    st[a] = (st[a] + st[b]) >>> 0;
    st[d] = (st[d] ^ st[a]) >>> 0;
    st[d] = ((st[d] << 8) | ((st[d]>>>24) & 0xFF)) >>> 0;

    st[c] = (st[c] + st[d]) >>> 0;
    st[b] = (st[b] ^ st[c]) >>> 0;
    st[b] = ((st[b] << 7) | ((st[b]>>>25) & 0x7F)) >>> 0;
}

function doubleRound(st) {
    quarterRound(st, 0, 4, 8,12);
    quarterRound(st, 1, 5, 9,13);
    quarterRound(st, 2, 6,10,14);
    quarterRound(st, 3, 7,11,15);

    quarterRound(st, 0, 5,10,15);
    quarterRound(st, 1, 6,11,12);
    quarterRound(st, 2, 7, 8,13);
    quarterRound(st, 3, 4, 9,14);
}

class ChaCha {

    constructor(seed) {
        seed = seed || [0,0,0,0,0,0,0,0];
        this.state = [
            0x61707865,
            0x3320646E,
            0x79622D32,
            0x6B206574,
            seed[0],
            seed[1],
            seed[2],
            seed[3],
            seed[4],
            seed[5],
            seed[6],
            seed[7],
            0,
            0,
            0,
            0
        ];
        this.idx = 16;
        this.buff = new Array(16);
    }

    nextU32() {
        if (this.idx == 16) this.update();
        return this.buff[this.idx++];
    }

    nextU64() {
        return add$2(mul$2(this.nextU32(), 0x100000000), this.nextU32());
    }

    nextBool() {
        return (this.nextU32() & 1) == 1;
    }

    update() {
        // Copy the state
        for (let i=0; i<16; i++) this.buff[i] = this.state[i];

        // Apply the rounds
        for (let i=0; i<10; i++) doubleRound(this.buff);

        // Add to the initial
        for (let i=0; i<16; i++) this.buff[i] = (this.buff[i] + this.state[i]) >>> 0;

        this.idx = 0;

        this.state[12] = (this.state[12] + 1) >>> 0;
        if (this.state[12] != 0) return;
        this.state[13] = (this.state[13] + 1) >>> 0;
        if (this.state[13] != 0) return;
        this.state[14] = (this.state[14] + 1) >>> 0;
        if (this.state[14] != 0) return;
        this.state[15] = (this.state[15] + 1) >>> 0;
    }
}

/* global window */

function getRandomBytes(n) {
    let array = new Uint8Array(n);
    if (typeof window !== "undefined") { // Browser
        if (typeof window.crypto !== "undefined") { // Supported
            window.crypto.getRandomValues(array);
        } else { // fallback
            for (let i=0; i<n; i++) {
                array[i] = (Math.random()*4294967296)>>>0;
            }
        }
    }
    else { // NodeJS
        crypto.randomFillSync(array);
    }
    return array;
}

function getRandomSeed() {
    const arr = getRandomBytes(32);
    const arrV = new Uint32Array(arr.buffer);
    const seed = [];
    for (let i=0; i<8; i++) {
        seed.push(arrV[i]);
    }
    return seed;
}

let threadRng = null;

function getThreadRng() {
    if (threadRng) return threadRng;
    threadRng = new ChaCha(getRandomSeed());
    return threadRng;
}

/* global BigInt */

class ZqField {
    constructor(p) {
        this.type="F1";
        this.one = 1n;
        this.zero = 0n;
        this.p = BigInt(p);
        this.m = 1;
        this.negone = this.p-1n;
        this.two = 2n;
        this.half = this.p >> 1n;
        this.bitLength = bitLength$2(this.p);
        this.mask = (1n << BigInt(this.bitLength)) - 1n;

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = this.e(1n << BigInt(this.n64*64));
        this.Ri = this.inv(this.R);

        const e = this.negone >> 1n;
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.nqr + 1n;
            r = this.pow(this.nqr, e);
        }


        this.s = 0;
        this.t = this.negone;

        while ((this.t & 1n) == 0n) {
            this.s = this.s + 1;
            this.t = this.t >> 1n;
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {
        let res;
        if (!b) {
            res = BigInt(a);
        } else if (b==16) {
            res = BigInt("0x"+a);
        }
        if (res < 0) {
            let nres = -res;
            if (nres >= this.p) nres = nres % this.p;
            return this.p - nres;
        } else {
            return (res>= this.p) ? res%this.p : res;
        }

    }

    add(a, b) {
        const res = a + b;
        return res >= this.p ? res-this.p : res;
    }

    sub(a, b) {
        return (a >= b) ? a-b : this.p-b+a;
    }

    neg(a) {
        return a ? this.p-a : a;
    }

    mul(a, b) {
        return (a*b)%this.p;
    }

    mulScalar(base, s) {
        return (base * this.e(s)) % this.p;
    }

    square(a) {
        return (a*a) % this.p;
    }

    eq(a, b) {
        return a==b;
    }

    neq(a, b) {
        return a!=b;
    }

    lt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa < bb;
    }

    gt(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa > bb;
    }

    leq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa <= bb;
    }

    geq(a, b) {
        const aa = (a > this.half) ? a - this.p : a;
        const bb = (b > this.half) ? b - this.p : b;
        return aa >= bb;
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    idiv(a, b) {
        if (!b) throw new Error("Division by zero");
        return a / b;
    }

    inv(a) {
        if (!a) throw new Error("Division by zero");

        let t = 0n;
        let r = this.p;
        let newt = 1n;
        let newr = a % this.p;
        while (newr) {
            let q = r/newr;
            [t, newt] = [newt, t-q*newt];
            [r, newr] = [newr, r-q*newr];
        }
        if (t<0n) t += this.p;
        return t;
    }

    mod(a, b) {
        return a % b;
    }

    pow(b, e) {
        return exp$3(this, b, e);
    }

    exp(b, e) {
        return exp$3(this, b, e);
    }

    band(a, b) {
        const res =  ((a & b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bor(a, b) {
        const res =  ((a | b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bxor(a, b) {
        const res =  ((a ^ b) & this.mask);
        return res >= this.p ? res-this.p : res;
    }

    bnot(a) {
        const res = a ^ this.mask;
        return res >= this.p ? res-this.p : res;
    }

    shl(a, b) {
        if (Number(b) < this.bitLength) {
            const res = (a << b) & this.mask;
            return res >= this.p ? res-this.p : res;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                return a >> nb;
            } else {
                return 0n;
            }
        }
    }

    shr(a, b) {
        if (Number(b) < this.bitLength) {
            return a >> b;
        } else {
            const nb = this.p - b;
            if (Number(nb) < this.bitLength) {
                const res = (a << nb) & this.mask;
                return res >= this.p ? res-this.p : res;
            } else {
                return 0;
            }
        }
    }

    land(a, b) {
        return (a && b) ? 1n : 0n;
    }

    lor(a, b) {
        return (a || b) ? 1n : 0n;
    }

    lnot(a) {
        return (a) ? 0n : 1n;
    }

    sqrt_old(n) {

        if (n == 0n) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone >> this.one);
        if ( res != 1n ) return null;

        let m = this.s;
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one) >> 1n );

        while ( t != 1n ) {
            let sq = this.square(t);
            let i = 1;
            while (sq != 1n ) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r > (this.p >> 1n)) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a, b) {
        a = BigInt(a,b);
        if (a < 0) {
            let na = -a;
            if (na >= this.p) na = na % this.p;
            return this.p - na;
        } else {
            return (a>= this.p) ? a%this.p : a;
        }
    }

    random() {
        const nBytes = (this.bitLength*2 / 8);
        let res =0n;
        for (let i=0; i<nBytes; i++) {
            res = (res << 8n) + BigInt(getRandomBytes(1)[0]);
        }
        return res % this.p;
    }

    toString(a, base) {
        let vs;
        if (a > this.half) {
            const v = this.p-a;
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }
        return vs;
    }

    isZero(a) {
        return a == 0n;
    }

    fromRng(rng) {
        let v;
        do {
            v=0n;
            for (let i=0; i<this.n64; i++) {
                v += rng.nextU64() << BigInt(64 *i);
            }
            v &= this.mask;
        } while (v >= this.p);
        v = (v * this.Ri) % this.p;   // Convert from montgomery
        return v;
    }

}

class ZqField$1 {
    constructor(p) {
        this.type="F1";
        this.one = BigInteger.one;
        this.zero = BigInteger.zero;
        this.p = BigInteger(p);
        this.m = 1;
        this.negone = this.p.minus(BigInteger.one);
        this.two = BigInteger(2);
        this.half = this.p.shiftRight(1);
        this.bitLength = this.p.bitLength();
        this.mask = BigInteger.one.shiftLeft(this.bitLength).minus(BigInteger.one);

        this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
        this.R = BigInteger.one.shiftLeft(this.n64*64);
        this.Ri = this.inv(this.R);

        const e = this.negone.shiftRight(this.one);
        this.nqr = this.two;
        let r = this.pow(this.nqr, e);
        while (!r.equals(this.negone)) {
            this.nqr = this.nqr.add(this.one);
            r = this.pow(this.nqr, e);
        }

        this.s = this.zero;
        this.t = this.negone;

        while (!this.t.isOdd()) {
            this.s = this.s.add(this.one);
            this.t = this.t.shiftRight(this.one);
        }

        this.nqr_to_t = this.pow(this.nqr, this.t);

        buildSqrt(this);
    }

    e(a,b) {

        const res = BigInteger(a,b);

        return this.normalize(res);

    }

    add(a, b) {
        let res = a.add(b);
        if (res.geq(this.p)) {
            res = res.minus(this.p);
        }
        return res;
    }

    sub(a, b) {
        if (a.geq(b)) {
            return a.minus(b);
        } else {
            return this.p.minus(b.minus(a));
        }
    }

    neg(a) {
        if (a.isZero()) return a;
        return this.p.minus(a);
    }

    mul(a, b) {
        return a.times(b).mod(this.p);
    }

    mulScalar(base, s) {
        return base.times(BigInteger(s)).mod(this.p);
    }

    square(a) {
        return a.square().mod(this.p);
    }

    eq(a, b) {
        return a.eq(b);
    }

    neq(a, b) {
        return a.neq(b);
    }

    lt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.lt(bb);
    }

    gt(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.gt(bb);
    }

    leq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.leq(bb);
    }

    geq(a, b) {
        const aa = a.gt(this.half) ? a.minus(this.p) : a;
        const bb = b.gt(this.half) ? b.minus(this.p) : b;
        return aa.geq(bb);
    }

    div(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.times(b.modInv(this.p)).mod(this.p);
    }

    idiv(a, b) {
        if (b.isZero()) throw new Error("Division by zero");
        return a.divide(b);
    }

    inv(a) {
        if (a.isZero()) throw new Error("Division by zero");
        return a.modInv(this.p);
    }

    mod(a, b) {
        return a.mod(b);
    }

    pow(a, b) {
        return a.modPow(b, this.p);
    }

    exp(a, b) {
        return a.modPow(b, this.p);
    }

    band(a, b) {
        return a.and(b).and(this.mask).mod(this.p);
    }

    bor(a, b) {
        return a.or(b).and(this.mask).mod(this.p);
    }

    bxor(a, b) {
        return a.xor(b).and(this.mask).mod(this.p);
    }

    bnot(a) {
        return a.xor(this.mask).mod(this.p);
    }

    shl(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftLeft(b).and(this.mask).mod(this.p);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shr(a, nb);
            } else {
                return BigInteger.zero;
            }
        }
    }

    shr(a, b) {
        if (b.lt(this.bitLength)) {
            return a.shiftRight(b);
        } else {
            const nb = this.p.minus(b);
            if (nb.lt(this.bitLength)) {
                return this.shl(a, nb);
            } else {
                return BigInteger.zero;
            }
        }
    }

    land(a, b) {
        return (a.isZero() || b.isZero()) ? BigInteger.zero : BigInteger.one;
    }

    lor(a, b) {
        return (a.isZero() && b.isZero()) ? BigInteger.zero : BigInteger.one;
    }

    lnot(a) {
        return a.isZero() ? BigInteger.one : BigInteger.zero;
    }

    sqrt_old(n) {

        if (n.equals(this.zero)) return this.zero;

        // Test that have solution
        const res = this.pow(n, this.negone.shiftRight(this.one));
        if (!res.equals(this.one)) return null;

        let m = parseInt(this.s);
        let c = this.nqr_to_t;
        let t = this.pow(n, this.t);
        let r = this.pow(n, this.add(this.t, this.one).shiftRight(this.one) );

        while (!t.equals(this.one)) {
            let sq = this.square(t);
            let i = 1;
            while (!sq.equals(this.one)) {
                i++;
                sq = this.square(sq);
            }

            // b = c ^ m-i-1
            let b = c;
            for (let j=0; j< m-i-1; j ++) b = this.square(b);

            m = i;
            c = this.square(b);
            t = this.mul(t, c);
            r = this.mul(r, b);
        }

        if (r.greater(this.p.shiftRight(this.one))) {
            r = this.neg(r);
        }

        return r;
    }

    normalize(a) {
        a = BigInteger(a);
        if (a.isNegative()) {
            return this.p.minus(a.abs().mod(this.p));
        } else {
            return a.mod(this.p);
        }
    }

    random() {
        let res = BigInteger(0);
        let n = BigInteger(this.p.square());
        while (!n.isZero()) {
            res = res.shiftLeft(8).add(BigInteger(getRandomBytes(1)[0]));
            n = n.shiftRight(8);
        }
        return res.mod(this.p);
    }

    toString(a, base) {
        let vs;
        if (!a.lesserOrEquals(this.p.shiftRight(BigInteger(1)))) {
            const v = this.p.minus(a);
            vs = "-"+v.toString(base);
        } else {
            vs = a.toString(base);
        }

        return vs;
    }

    isZero(a) {
        return a.isZero();
    }

    fromRng(rng) {
        let v;
        do {
            v = BigInteger(0);
            for (let i=0; i<this.n64; i++) {
                v = v.add(v, rng.nextU64().shiftLeft(64*i));
            }
            v = v.and(this.mask);
        } while (v.geq(this.p));
        v = v.times(this.Ri).mod(this.q);
        return v;
    }


}

const supportsNativeBigInt$1 = typeof BigInt === "function";
let _F1Field;
if (supportsNativeBigInt$1) {
    _F1Field = ZqField;
} else {
    _F1Field = ZqField$1;
}

class F1Field extends _F1Field {

    // Returns a buffer with Little Endian Representation
    toRprLE(buff, o, e) {
        toRprLE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Representation
    toRprBE(buff, o, e) {
        toRprBE(buff, o, e, this.n64*8);
    }

    // Returns a buffer with Big Endian Montgomery Representation
    toRprBEM(buff, o, e) {
        return this.toRprBE(buff, o, this.mul(this.R, e));
    }

    toRprLEM(buff, o, e) {
        return this.toRprLE(buff, o, this.mul(this.R, e));
    }


    // Pases a buffer with Little Endian Representation
    fromRprLE(buff, o) {
        return fromRprLE(buff, o, this.n8);
    }

    // Pases a buffer with Big Endian Representation
    fromRprBE(buff, o) {
        return fromRprBE(buff, o, this.n8);
    }

    fromRprLEM(buff, o) {
        return this.mul(this.fromRprLE(buff, o), this.Ri);
    }

    fromRprBEM(buff, o) {
        return this.mul(this.fromRprBE(buff, o), this.Ri);
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

class F2Field {
    constructor(F, nonResidue) {
        this.type="F2";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*2;
        this.p = F.p;
        this.n64 = F.n64*2;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;

        buildSqrt(this);
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    conjugate(a) {
        return [
            a[0],
            this.F.neg(a[1])
        ];
    }

    mul(a, b) {
        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);

        return [
            this.F.add( aA , this._mulByNonResidue(bB)),
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]),
                    this.F.add(b[0], b[1])),
                this.F.add(aA, bB))];
    }

    inv(a) {
        const t0 = this.F.square(a[0]);
        const t1 = this.F.square(a[1]);
        const t2 = this.F.sub(t0, this._mulByNonResidue(t1));
        const t3 = this.F.inv(t2);
        return [
            this.F.mul(a[0], t3),
            this.F.neg(this.F.mul( a[1], t3)) ];
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const ab = this.F.mul(a[0] , a[1]);

        /*
        [
            (a + b) * (a + non_residue * b) - ab - non_residue * ab,
            ab + ab
        ];
        */

        return [
            this.F.sub(
                this.F.mul(
                    this.F.add(a[0], a[1]) ,
                    this.F.add(
                        a[0] ,
                        this._mulByNonResidue(a[1]))),
                this.F.add(
                    ab,
                    this._mulByNonResidue(ab))),
            this.F.add(ab, ab)
        ];
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        return [c0, c1];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        return false;
    }

    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[1]);
        this.F.toRprBE(buff, o+this.F.n8, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBE(buff, o);
        const c0 = this.F.fromRprBE(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.F.n8);
        return [c0, c1];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c1 = this.F.fromRprBEM(buff, o);
        const c0 = this.F.fromRprBEM(buff, o+this.F.n8);
        return [c0, c1];
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/

class F3Field {
    constructor(F, nonResidue) {
        this.type="F3";
        this.F = F;
        this.zero = [this.F.zero, this.F.zero, this.F.zero];
        this.one = [this.F.one, this.F.zero, this.F.zero];
        this.negone = this.neg(this.one);
        this.nonResidue = nonResidue;
        this.m = F.m*3;
        this.p = F.p;
        this.n64 = F.n64*3;
        this.n32 = this.n64*2;
        this.n8 = this.n64*8;
    }

    _mulByNonResidue(a) {
        return this.F.mul(this.nonResidue, a);
    }

    copy(a) {
        return [this.F.copy(a[0]), this.F.copy(a[1]), this.F.copy(a[2])];
    }

    add(a, b) {
        return [
            this.F.add(a[0], b[0]),
            this.F.add(a[1], b[1]),
            this.F.add(a[2], b[2])
        ];
    }

    double(a) {
        return this.add(a,a);
    }

    sub(a, b) {
        return [
            this.F.sub(a[0], b[0]),
            this.F.sub(a[1], b[1]),
            this.F.sub(a[2], b[2])
        ];
    }

    neg(a) {
        return this.sub(this.zero, a);
    }

    mul(a, b) {

        const aA = this.F.mul(a[0] , b[0]);
        const bB = this.F.mul(a[1] , b[1]);
        const cC = this.F.mul(a[2] , b[2]);

        return [
            this.F.add(
                aA,
                this._mulByNonResidue(
                    this.F.sub(
                        this.F.mul(
                            this.F.add(a[1], a[2]),
                            this.F.add(b[1], b[2])),
                        this.F.add(bB, cC)))),    // aA + non_residue*((b+c)*(B+C)-bB-cC),

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[1]),
                        this.F.add(b[0], b[1])),
                    this.F.add(aA, bB)),
                this._mulByNonResidue( cC)),   // (a+b)*(A+B)-aA-bB+non_residue*cC

            this.F.add(
                this.F.sub(
                    this.F.mul(
                        this.F.add(a[0], a[2]),
                        this.F.add(b[0], b[2])),
                    this.F.add(aA, cC)),
                bB)];                           // (a+c)*(A+C)-aA+bB-cC)
    }

    inv(a) {
        const t0 = this.F.square(a[0]);             // t0 = a^2 ;
        const t1 = this.F.square(a[1]);             // t1 = b^2 ;
        const t2 = this.F.square(a[2]);             // t2 = c^2;
        const t3 = this.F.mul(a[0],a[1]);           // t3 = ab
        const t4 = this.F.mul(a[0],a[2]);           // t4 = ac
        const t5 = this.F.mul(a[1],a[2]);           // t5 = bc;
        // c0 = t0 - non_residue * t5;
        const c0 = this.F.sub(t0, this._mulByNonResidue(t5));
        // c1 = non_residue * t2 - t3;
        const c1 = this.F.sub(this._mulByNonResidue(t2), t3);
        const c2 = this.F.sub(t1, t4);              // c2 = t1-t4

        // t6 = (a * c0 + non_residue * (c * c1 + b * c2)).inv();
        const t6 =
            this.F.inv(
                this.F.add(
                    this.F.mul(a[0], c0),
                    this._mulByNonResidue(
                        this.F.add(
                            this.F.mul(a[2], c1),
                            this.F.mul(a[1], c2)))));

        return [
            this.F.mul(t6, c0),         // t6*c0
            this.F.mul(t6, c1),         // t6*c1
            this.F.mul(t6, c2)];        // t6*c2
    }

    div(a, b) {
        return this.mul(a, this.inv(b));
    }

    square(a) {
        const s0 = this.F.square(a[0]);                   // s0 = a^2
        const ab = this.F.mul(a[0], a[1]);                // ab = a*b
        const s1 = this.F.add(ab, ab);                    // s1 = 2ab;
        const s2 = this.F.square(
            this.F.add(this.F.sub(a[0],a[1]), a[2]));     // s2 = (a - b + c)^2;
        const bc = this.F.mul(a[1],a[2]);                 // bc = b*c
        const s3 = this.F.add(bc, bc);                    // s3 = 2*bc
        const s4 = this.F.square(a[2]);                   // s4 = c^2


        return [
            this.F.add(
                s0,
                this._mulByNonResidue(s3)),           // s0 + non_residue * s3,
            this.F.add(
                s1,
                this._mulByNonResidue(s4)),           // s1 + non_residue * s4,
            this.F.sub(
                this.F.add( this.F.add(s1, s2) , s3 ),
                this.F.add(s0, s4))];                      // s1 + s2 + s3 - s0 - s4
    }

    isZero(a) {
        return this.F.isZero(a[0]) && this.F.isZero(a[1]) && this.F.isZero(a[2]);
    }

    eq(a, b) {
        return this.F.eq(a[0], b[0]) && this.F.eq(a[1], b[1]) && this.F.eq(a[2], b[2]);
    }

    affine(a) {
        return [this.F.affine(a[0]), this.F.affine(a[1]), this.F.affine(a[2])];
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    pow(base, e) {
        return exp$3(this, base, e);
    }

    exp(base, e) {
        return exp$3(this, base, e);
    }

    toString(a) {
        return `[ ${this.F.toString(a[0])} , ${this.F.toString(a[1])}, ${this.F.toString(a[2])} ]`;
    }

    fromRng(rng) {
        const c0 = this.F.fromRng(rng);
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        return [c0, c1, c2];
    }

    gt(a, b) {
        if (this.F.gt(a[0], b[0])) return true;
        if (this.F.gt(b[0], a[0])) return false;
        if (this.F.gt(a[1], b[1])) return true;
        if (this.F.gt(b[1], a[1])) return false;
        if (this.F.gt(a[2], b[2])) return true;
        return false;
    }


    geq(a, b) {
        return this.gt(a, b) || this.eq(a, b);
    }

    lt(a, b) {
        return !this.geq(a,b);
    }

    leq(a, b) {
        return !this.gt(a,b);
    }

    neq(a, b) {
        return !this.eq(a,b);
    }

    random() {
        return [this.F.random(), this.F.random(), this.F.random()];
    }


    toRprLE(buff, o, e) {
        this.F.toRprLE(buff, o, e[0]);
        this.F.toRprLE(buff, o+this.F.n8, e[1]);
        this.F.toRprLE(buff, o+this.F.n8*2, e[2]);
    }

    toRprBE(buff, o, e) {
        this.F.toRprBE(buff, o, e[2]);
        this.F.toRprBE(buff, o+this.F.n8, e[1]);
        this.F.toRprBE(buff, o+this.F.n8*2, e[0]);
    }

    toRprLEM(buff, o, e) {
        this.F.toRprLEM(buff, o, e[0]);
        this.F.toRprLEM(buff, o+this.F.n8, e[1]);
        this.F.toRprLEM(buff, o+this.F.n8*2, e[2]);
    }


    toRprBEM(buff, o, e) {
        this.F.toRprBEM(buff, o, e[2]);
        this.F.toRprBEM(buff, o+this.F.n8, e[1]);
        this.F.toRprBEM(buff, o+this.F.n8*2, e[0]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLE(buff, o);
        const c1 = this.F.fromRprLE(buff, o+this.n8);
        const c2 = this.F.fromRprLE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBE(buff, o);
        const c1 = this.F.fromRprBE(buff, o+this.n8);
        const c0 = this.F.fromRprBE(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const c0 = this.F.fromRprLEM(buff, o);
        const c1 = this.F.fromRprLEM(buff, o+this.n8);
        const c2 = this.F.fromRprLEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const c2 = this.F.fromRprBEM(buff, o);
        const c1 = this.F.fromRprBEM(buff, o+this.n8);
        const c0 = this.F.fromRprBEM(buff, o+this.n8*2);
        return [c0, c1, c2];
    }

}

/*
    Copyright 2018 0kims association.

    This file is part of snarkjs.

    snarkjs is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    snarkjs is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    snarkjs. If not, see <https://www.gnu.org/licenses/>.
*/


function isGreatest(F, a) {
    if (Array.isArray(a)) {
        for (let i=a.length-1; i>=0; i--) {
            if (!F.F.isZero(a[i])) {
                return isGreatest(F.F, a[i]);
            }
        }
        return 0;
    } else {
        const na = F.neg(a);
        return gt$2(a, na);
    }
}


class EC {

    constructor(F, g) {
        this.F = F;
        this.g = g;
        if (this.g.length == 2) this.g[2] = this.F.one;
        this.zero = [this.F.zero, this.F.one, this.F.zero];
    }

    add(p1, p2) {

        const F = this.F;

        if (this.eq(p1, this.zero)) return p2;
        if (this.eq(p2, this.zero)) return p1;

        const res = new Array(3);

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );     // U1 = X1  * Z2Z2
        const U2 = F.mul( p2[0] , Z1Z1 );     // U2 = X2  * Z1Z1

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);  // S1 = Y1 * Z2 * Z2Z2
        const S2 = F.mul( p2[1] , Z1_cubed);  // S2 = Y2 * Z1 * Z1Z1

        if (F.eq(U1,U2) && F.eq(S1,S2)) {
            return this.double(p1);
        }

        const H = F.sub( U2 , U1 );                    // H = U2-U1

        const S2_minus_S1 = F.sub( S2 , S1 );

        const I = F.square( F.add(H,H) );         // I = (2 * H)^2
        const J = F.mul( H , I );                      // J = H * I

        const r = F.add( S2_minus_S1 , S2_minus_S1 );  // r = 2 * (S2-S1)
        const V = F.mul( U1 , I );                     // V = U1 * I

        res[0] =
            F.sub(
                F.sub( F.square(r) , J ),
                F.add( V , V ));                       // X3 = r^2 - J - 2 * V

        const S1_J = F.mul( S1 , J );

        res[1] =
            F.sub(
                F.mul( r , F.sub(V,res[0])),
                F.add( S1_J,S1_J ));                   // Y3 = r * (V-X3)-2 S1 J

        res[2] =
            F.mul(
                H,
                F.sub(
                    F.square( F.add(p1[2],p2[2]) ),
                    F.add( Z1Z1 , Z2Z2 )));            // Z3 = ((Z1+Z2)^2-Z1Z1-Z2Z2) * H

        return res;
    }

    neg(p) {
        return [p[0], this.F.neg(p[1]), p[2]];
    }

    sub(a, b) {
        return this.add(a, this.neg(b));
    }

    double(p) {
        const F = this.F;

        const res = new Array(3);

        if (this.eq(p, this.zero)) return p;

        const A = F.square( p[0] );                    // A = X1^2
        const B = F.square( p[1] );                    // B = Y1^2
        const C = F.square( B );                       // C = B^2

        let D =
            F.sub(
                F.square( F.add(p[0] , B )),
                F.add( A , C));
        D = F.add(D,D);                    // D = 2 * ((X1 + B)^2 - A - C)

        const E = F.add( F.add(A,A), A);          // E = 3 * A
        const FF =F.square( E );                       // F = E^2

        res[0] = F.sub( FF , F.add(D,D) );         // X3 = F - 2 D

        let eightC = F.add( C , C );
        eightC = F.add( eightC , eightC );
        eightC = F.add( eightC , eightC );

        res[1] =
            F.sub(
                F.mul(
                    E,
                    F.sub( D, res[0] )),
                eightC);                                    // Y3 = E * (D - X3) - 8 * C

        const Y1Z1 = F.mul( p[1] , p[2] );
        res[2] = F.add( Y1Z1 , Y1Z1 );                 // Z3 = 2 * Y1 * Z1

        return res;
    }

    timesScalar(base, e) {
        return mulScalar(this, base, e);
    }

    mulScalar(base, e) {
        return mulScalar(this, base, e);
    }

    affine(p) {
        const F = this.F;
        if (this.isZero(p)) {
            return this.zero;
        } else if (F.eq(p[2], F.one)) {
            return p;
        } else {
            const Z_inv = F.inv(p[2]);
            const Z2_inv = F.square(Z_inv);
            const Z3_inv = F.mul(Z2_inv, Z_inv);

            const res = new Array(3);
            res[0] = F.mul(p[0],Z2_inv);
            res[1] = F.mul(p[1],Z3_inv);
            res[2] = F.one;

            return res;
        }
    }

    multiAffine(arr) {
        const keys = Object.keys(arr);
        const F = this.F;
        const accMul = new Array(keys.length+1);
        accMul[0] = F.one;
        for (let i = 0; i< keys.length; i++) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i+1] = accMul[i];
            } else {
                accMul[i+1] = F.mul(accMul[i], arr[keys[i]][2]);
            }
        }

        accMul[keys.length] = F.inv(accMul[keys.length]);

        for (let i = keys.length-1; i>=0; i--) {
            if (F.eq(arr[keys[i]][2], F.zero)) {
                accMul[i] = accMul[i+1];
                arr[keys[i]] = this.zero;
            } else {
                const Z_inv = F.mul(accMul[i], accMul[i+1]);
                accMul[i] = F.mul(arr[keys[i]][2], accMul[i+1]);

                const Z2_inv = F.square(Z_inv);
                const Z3_inv = F.mul(Z2_inv, Z_inv);

                arr[keys[i]][0] = F.mul(arr[keys[i]][0],Z2_inv);
                arr[keys[i]][1] = F.mul(arr[keys[i]][1],Z3_inv);
                arr[keys[i]][2] = F.one;
            }
        }

    }

    eq(p1, p2) {
        const F = this.F;

        if (this.F.eq(p1[2], this.F.zero)) return this.F.eq(p2[2], this.F.zero);
        if (this.F.eq(p2[2], this.F.zero)) return false;

        const Z1Z1 = F.square( p1[2] );
        const Z2Z2 = F.square( p2[2] );

        const U1 = F.mul( p1[0] , Z2Z2 );
        const U2 = F.mul( p2[0] , Z1Z1 );

        const Z1_cubed = F.mul( p1[2] , Z1Z1);
        const Z2_cubed = F.mul( p2[2] , Z2Z2);

        const S1 = F.mul( p1[1] , Z2_cubed);
        const S2 = F.mul( p2[1] , Z1_cubed);

        return (F.eq(U1,U2) && F.eq(S1,S2));
    }

    isZero(p) {
        return this.F.isZero(p[2]);
    }

    toString(p) {
        const cp = this.affine(p);
        return `[ ${this.F.toString(cp[0])} , ${this.F.toString(cp[1])} ]`;
    }

    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
            P[1] = F.sqrt(x3b);
        } while ((P[1] == null)||(F.isZero[P]));

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        if (this.cofactor) {
            P = this.mulScalar(P, this.cofactor);
        }

        P = this.affine(P);

        return P;

    }

    toRprLE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLE(buff, o, p[0]);
        this.F.toRprLE(buff, o+this.F.n8, p[1]);
    }

    toRprBE(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBE(buff, o, p[0]);
        this.F.toRprBE(buff, o+this.F.n8, p[1]);
    }

    toRprLEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
    }

    toRprLEJM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprLEM(buff, o, p[0]);
        this.F.toRprLEM(buff, o+this.F.n8, p[1]);
        this.F.toRprLEM(buff, o+2*this.F.n8, p[2]);
    }


    toRprBEM(buff, o, p) {
        p = this.affine(p);
        if (this.isZero(p)) {
            const BuffV = new Uint8Array(buff, o, this.F.n8*2);
            BuffV.fill(0);
            return;
        }
        this.F.toRprBEM(buff, o, p[0]);
        this.F.toRprBEM(buff, o+this.F.n8, p[1]);
    }

    fromRprLE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLE(buff, o);
        const y = this.F.fromRprLE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprBE(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBE(buff, o);
        const y = this.F.fromRprBE(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprLEJM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprLEM(buff, o);
        const y = this.F.fromRprLEM(buff, o+this.F.n8);
        const z = this.F.fromRprLEM(buff, o+this.F.n8*2);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, z];
    }

    fromRprBEM(buff, o) {
        o = o || 0;
        const x = this.F.fromRprBEM(buff, o);
        const y = this.F.fromRprBEM(buff, o+this.F.n8);
        if (this.F.isZero(x) && this.F.isZero(y)) {
            return this.zero;
        }
        return [x, y, this.F.one];
    }

    fromRprCompressed(buff, o) {
        const F = this.F;
        const v = new Uint8Array(buff.buffer, o, F.n8);
        if (v[0] & 0x40) return this.zero;
        const P = new Array(3);

        const greatest = ((v[0] & 0x80) != 0);
        v[0] = v[0] & 0x7F;
        P[0] = F.fromRprBE(buff, o);
        if (greatest) v[0] = v[0] | 0x80;  // set back again the old value

        const x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        P[1] = F.sqrt(x3b);

        if (P[1] === null) {
            throw new Error("Invalid Point!");
        }

        const s = isGreatest(F, P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);
        P[2] = F.one;

        return P;
    }

    toRprCompressed(buff, o, p) {
        p = this.affine(p);
        const v = new Uint8Array(buff.buffer, o, this.F.n8);
        if (this.isZero(p)) {
            v.fill(0);
            v[0] = 0x40;
            return;
        }
        this.F.toRprBE(buff, o, p[0]);

        if (isGreatest(this.F, p[1])) {
            v[0] = v[0] | 0x80;
        }
    }


    fromRprUncompressed(buff, o) {
        if (buff[0] & 0x40) return this.zero;

        return this.fromRprBE(buff, o);
    }

    toRprUncompressed(buff, o, p) {
        this.toRprBE(buff, o, p);

        if (this.isZero(p)) {
            buff[o] = buff[o] | 0x40;
        }
    }


}

var code = "AGFzbQEAAAABiQERYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgCH9/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIQAQNlbnYGbWVtb3J5AgDoBwO0ArICAAECAQMDBAQFAAAGBwgFAgUFAAAFAAAAAAICAAEFCAkFBQgAAgIFBQAABQAAAAACAgABBQgJBQUIAAIFAAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAUABQAAAAAFBQUFBQoACwkKAAsJCAgDAAgIAgAACQkJBQUJAAgMCQICAQEABQUABQUAAAAAAwAIAgIJCAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkJCQUFCQUDAAgIAgAACQkJBQUJBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQAAAAAICAUAAAAAAAAAAAAAAAAAAAAABA0ODxAFB5UkowIIaW50X2NvcHkAAAhpbnRfemVybwABB2ludF9vbmUAAwppbnRfaXNaZXJvAAIGaW50X2VxAAQHaW50X2d0ZQAFB2ludF9hZGQABgdpbnRfc3ViAAcHaW50X211bAAICmludF9zcXVhcmUACQ1pbnRfc3F1YXJlT2xkAAoHaW50X2RpdgANDmludF9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACIQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACMMZjFtX2lzU3F1YXJlACQVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQhmcm1fY29weQAACGZybV96ZXJvAAEKZnJtX2lzWmVybwACBmZybV9lcQAEB2ZybV9hZGQAJgdmcm1fc3ViACcHZnJtX25lZwAoDmZybV9pc05lZ2F0aXZlAC8JZnJtX2lzT25lACUIZnJtX3NpZ24AMAtmcm1fbVJlZHVjdAApB2ZybV9tdWwAKgpmcm1fc3F1YXJlACsNZnJtX3NxdWFyZU9sZAAsEmZybV9mcm9tTW9udGdvbWVyeQAuEGZybV90b01vbnRnb21lcnkALQtmcm1faW52ZXJzZQAxB2ZybV9vbmUAMghmcm1fbG9hZAAzD2ZybV90aW1lc1NjYWxhcgA0B2ZybV9leHAAOBBmcm1fYmF0Y2hJbnZlcnNlADUIZnJtX3NxcnQAOQxmcm1faXNTcXVhcmUAOhVmcm1fYmF0Y2hUb01vbnRnb21lcnkANhdmcm1fYmF0Y2hGcm9tTW9udGdvbWVyeQA3BmZyX2FkZAAmBmZyX3N1YgAnBmZyX25lZwAoBmZyX211bAA7CWZyX3NxdWFyZQA8CmZyX2ludmVyc2UAPQ1mcl9pc05lZ2F0aXZlAD4HZnJfY29weQAAB2ZyX3plcm8AAQZmcl9vbmUAMglmcl9pc1plcm8AAgVmcl9lcQAEDGcxbV9tdWx0aWV4cABnEmcxbV9tdWx0aWV4cF9jaHVuawBmEmcxbV9tdWx0aWV4cEFmZmluZQBrGGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawBqCmcxbV9pc1plcm8AQBBnMW1faXNaZXJvQWZmaW5lAD8GZzFtX2VxAEgLZzFtX2VxTWl4ZWQARwxnMW1fZXFBZmZpbmUARghnMW1fY29weQBEDmcxbV9jb3B5QWZmaW5lAEMIZzFtX3plcm8AQg5nMW1femVyb0FmZmluZQBBCmcxbV9kb3VibGUAShBnMW1fZG91YmxlQWZmaW5lAEkHZzFtX2FkZABNDGcxbV9hZGRNaXhlZABMDWcxbV9hZGRBZmZpbmUASwdnMW1fbmVnAE8NZzFtX25lZ0FmZmluZQBOB2cxbV9zdWIAUgxnMW1fc3ViTWl4ZWQAUQ1nMW1fc3ViQWZmaW5lAFASZzFtX2Zyb21Nb250Z29tZXJ5AFQYZzFtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAFMQZzFtX3RvTW9udGdvbWVyeQBWFmcxbV90b01vbnRnb21lcnlBZmZpbmUAVQ9nMW1fdGltZXNTY2FsYXIAbBVnMW1fdGltZXNTY2FsYXJBZmZpbmUAbQ1nMW1fbm9ybWFsaXplAFkKZzFtX0xFTXRvVQBbCmcxbV9MRU10b0MAXApnMW1fVXRvTEVNAF0KZzFtX0N0b0xFTQBeD2cxbV9iYXRjaExFTXRvVQBfD2cxbV9iYXRjaExFTXRvQwBgD2cxbV9iYXRjaFV0b0xFTQBhD2cxbV9iYXRjaEN0b0xFTQBiDGcxbV90b0FmZmluZQBXDmcxbV90b0phY29iaWFuAEURZzFtX2JhdGNoVG9BZmZpbmUAWBNnMW1fYmF0Y2hUb0phY29iaWFuAGMHZnJtX2ZmdABzCGZybV9pZmZ0AHQKZnJtX3Jhd2ZmdABxC2ZybV9mZnRKb2luAHUOZnJtX2ZmdEpvaW5FeHQAdhFmcm1fZmZ0Sm9pbkV4dEludgB3CmZybV9mZnRNaXgAeAxmcm1fZmZ0RmluYWwAeR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgB6CHBvbF96ZXJvAHsPcG9sX2NvbnN0cnVjdExDAHwMcWFwX2J1aWxkQUJDAH0LcWFwX2pvaW5BQkMAfgpmMm1faXNaZXJvAH8JZjJtX2lzT25lAIABCGYybV96ZXJvAIEBB2YybV9vbmUAggEIZjJtX2NvcHkAgwEHZjJtX211bACEAQhmMm1fbXVsMQCFAQpmMm1fc3F1YXJlAIYBB2YybV9hZGQAhwEHZjJtX3N1YgCIAQdmMm1fbmVnAIkBCGYybV9zaWduAJABDWYybV9jb25qdWdhdGUAigESZjJtX2Zyb21Nb250Z29tZXJ5AIwBEGYybV90b01vbnRnb21lcnkAiwEGZjJtX2VxAI0BC2YybV9pbnZlcnNlAI4BB2YybV9leHAAkwEPZjJtX3RpbWVzU2NhbGFyAI8BEGYybV9iYXRjaEludmVyc2UAkgEIZjJtX3NxcnQAlAEMZjJtX2lzU3F1YXJlAJUBDmYybV9pc05lZ2F0aXZlAJEBDGcybV9tdWx0aWV4cAC+ARJnMm1fbXVsdGlleHBfY2h1bmsAvQESZzJtX211bHRpZXhwQWZmaW5lAMIBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDBAQpnMm1faXNaZXJvAJcBEGcybV9pc1plcm9BZmZpbmUAlgEGZzJtX2VxAJ8BC2cybV9lcU1peGVkAJ4BDGcybV9lcUFmZmluZQCdAQhnMm1fY29weQCbAQ5nMm1fY29weUFmZmluZQCaAQhnMm1femVybwCZAQ5nMm1femVyb0FmZmluZQCYAQpnMm1fZG91YmxlAKEBEGcybV9kb3VibGVBZmZpbmUAoAEHZzJtX2FkZACkAQxnMm1fYWRkTWl4ZWQAowENZzJtX2FkZEFmZmluZQCiAQdnMm1fbmVnAKYBDWcybV9uZWdBZmZpbmUApQEHZzJtX3N1YgCpAQxnMm1fc3ViTWl4ZWQAqAENZzJtX3N1YkFmZmluZQCnARJnMm1fZnJvbU1vbnRnb21lcnkAqwEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAKoBEGcybV90b01vbnRnb21lcnkArQEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQCsAQ9nMm1fdGltZXNTY2FsYXIAwwEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lAMQBDWcybV9ub3JtYWxpemUAsAEKZzJtX0xFTXRvVQCyAQpnMm1fTEVNdG9DALMBCmcybV9VdG9MRU0AtAEKZzJtX0N0b0xFTQC1AQ9nMm1fYmF0Y2hMRU10b1UAtgEPZzJtX2JhdGNoTEVNdG9DALcBD2cybV9iYXRjaFV0b0xFTQC4AQ9nMm1fYmF0Y2hDdG9MRU0AuQEMZzJtX3RvQWZmaW5lAK4BDmcybV90b0phY29iaWFuAJwBEWcybV9iYXRjaFRvQWZmaW5lAK8BE2cybV9iYXRjaFRvSmFjb2JpYW4AugELZzFtX3RpbWVzRnIAxQEHZzFtX2ZmdADLAQhnMW1faWZmdADMAQpnMW1fcmF3ZmZ0AMkBC2cxbV9mZnRKb2luAM0BDmcxbV9mZnRKb2luRXh0AM4BEWcxbV9mZnRKb2luRXh0SW52AM8BCmcxbV9mZnRNaXgA0AEMZzFtX2ZmdEZpbmFsANEBHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uANIBC2cybV90aW1lc0ZyANMBB2cybV9mZnQA2QEIZzJtX2lmZnQA2gEKZzJtX3Jhd2ZmdADXAQtnMm1fZmZ0Sm9pbgDbAQ5nMm1fZmZ0Sm9pbkV4dADcARFnMm1fZmZ0Sm9pbkV4dEludgDdAQpnMm1fZmZ0TWl4AN4BDGcybV9mZnRGaW5hbADfAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDgARFnMW1fdGltZXNGckFmZmluZQDhARFnMm1fdGltZXNGckFmZmluZQDiARFmcm1fYmF0Y2hBcHBseUtleQDjARFnMW1fYmF0Y2hBcHBseUtleQDkARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAOUBEWcybV9iYXRjaEFwcGx5S2V5AOYBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA5wEKZjZtX2lzWmVybwDpAQlmNm1faXNPbmUA6gEIZjZtX3plcm8A6wEHZjZtX29uZQDsAQhmNm1fY29weQDtAQdmNm1fbXVsAO4BCmY2bV9zcXVhcmUA7wEHZjZtX2FkZADwAQdmNm1fc3ViAPEBB2Y2bV9uZWcA8gEIZjZtX3NpZ24A8wESZjZtX2Zyb21Nb250Z29tZXJ5APUBEGY2bV90b01vbnRnb21lcnkA9AEGZjZtX2VxAPYBC2Y2bV9pbnZlcnNlAPcBB2Y2bV9leHAA+wEPZjZtX3RpbWVzU2NhbGFyAPgBEGY2bV9iYXRjaEludmVyc2UA+gEOZjZtX2lzTmVnYXRpdmUA+QEKZnRtX2lzWmVybwD9AQlmdG1faXNPbmUA/gEIZnRtX3plcm8A/wEHZnRtX29uZQCAAghmdG1fY29weQCBAgdmdG1fbXVsAIICCGZ0bV9tdWwxAIMCCmZ0bV9zcXVhcmUAhAIHZnRtX2FkZACFAgdmdG1fc3ViAIYCB2Z0bV9uZWcAhwIIZnRtX3NpZ24AjgINZnRtX2Nvbmp1Z2F0ZQCIAhJmdG1fZnJvbU1vbnRnb21lcnkAigIQZnRtX3RvTW9udGdvbWVyeQCJAgZmdG1fZXEAiwILZnRtX2ludmVyc2UAjAIHZnRtX2V4cACRAg9mdG1fdGltZXNTY2FsYXIAjQIQZnRtX2JhdGNoSW52ZXJzZQCQAghmdG1fc3FydACSAgxmdG1faXNTcXVhcmUAkwIOZnRtX2lzTmVnYXRpdmUAjwIUYm4xMjhfX2Zyb2Jlbml1c01hcDAAnAIUYm4xMjhfX2Zyb2Jlbml1c01hcDEAnQIUYm4xMjhfX2Zyb2Jlbml1c01hcDIAngIUYm4xMjhfX2Zyb2Jlbml1c01hcDMAnwIUYm4xMjhfX2Zyb2Jlbml1c01hcDQAoAIUYm4xMjhfX2Zyb2Jlbml1c01hcDUAoQIUYm4xMjhfX2Zyb2Jlbml1c01hcDYAogIUYm4xMjhfX2Zyb2Jlbml1c01hcDcAowIUYm4xMjhfX2Zyb2Jlbml1c01hcDgApAIUYm4xMjhfX2Zyb2Jlbml1c01hcDkApQIQYm4xMjhfcGFpcmluZ0VxMQCsAhBibjEyOF9wYWlyaW5nRXEyAK0CEGJuMTI4X3BhaXJpbmdFcTMArgIQYm4xMjhfcGFpcmluZ0VxNACvAhBibjEyOF9wYWlyaW5nRXE1ALACDWJuMTI4X3BhaXJpbmcAsQIPYm4xMjhfcHJlcGFyZUcxAJYCD2JuMTI4X3ByZXBhcmVHMgCYAhBibjEyOF9taWxsZXJMb29wAJsCGWJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb24AqwIcYm4xMjhfZmluYWxFeHBvbmVudGlhdGlvbk9sZACmAg9ibjEyOF9fbXVsQnkwMjQAmQISYm4xMjhfX211bEJ5MDI0T2xkAJoCF2JuMTI4X19jeWNsb3RvbWljU3F1YXJlAKgCF2JuMTI4X19jeWNsb3RvbWljRXhwX3cwAKkCCuDZA7ICKgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYCx4AIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGAszACAAKQMYUARAIAApAxBQBEAgACkDCFAEQCAAKQMAUA8FQQAPCwVBAA8LBUEADwtBAA8LHgAgAEIBNwMAIABCADcDCCAAQgA3AxAgAEIANwMYC0cAIAApAxggASkDGFEEQCAAKQMQIAEpAxBRBEAgACkDCCABKQMIUQRAIAApAwAgASkDAFEPBUEADwsFQQAPCwVBAA8LQQAPC30AIAApAxggASkDGFQEQEEADwUgACkDGCABKQMYVgRAQQEPBSAAKQMQIAEpAxBUBEBBAA8FIAApAxAgASkDEFYEQEEBDwUgACkDCCABKQMIVARAQQAPBSAAKQMIIAEpAwhWBEBBAQ8FIAApAwAgASkDAFoPCwsLCwsLQQAPC9QBAQF+IAA1AgAgATUCAHwhAyACIAM+AgAgADUCBCABNQIEfCADQiCIfCEDIAIgAz4CBCAANQIIIAE1Agh8IANCIIh8IQMgAiADPgIIIAA1AgwgATUCDHwgA0IgiHwhAyACIAM+AgwgADUCECABNQIQfCADQiCIfCEDIAIgAz4CECAANQIUIAE1AhR8IANCIIh8IQMgAiADPgIUIAA1AhggATUCGHwgA0IgiHwhAyACIAM+AhggADUCHCABNQIcfCADQiCIfCEDIAIgAz4CHCADQiCIpwuMAgEBfiAANQIAIAE1AgB9IQMgAiADQv////8Pgz4CACAANQIEIAE1AgR9IANCIId8IQMgAiADQv////8Pgz4CBCAANQIIIAE1Agh9IANCIId8IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCADQiCHpwuPEBIBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4gA0L/////D4MgADUCACIFIAE1AgAiBn58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgBSABNQIEIgh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgcgBn58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgBSABNQIIIgp+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIgkgBn58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgBSABNQIMIgx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIgsgBn58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgBSABNQIQIg5+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIg0gBn58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgBSABNQIUIhB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIg8gBn58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgBSABNQIYIhJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAHIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAJIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyALIAx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIhEgBn58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgBSABNQIcIhR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAHIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAJIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIAp+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIhMgBn58IQQgAyAEQiCIfCEDIAIgBD4CHCADQiCIIQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgAiADPgIgIARCIIghAyAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyALIBJ+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAPIA5+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIAp+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAsgFH58IQMgBCADQiCIfCEEIANC/////w+DIA0gEn58IQMgBCADQiCIfCEEIANC/////w+DIA8gEH58IQMgBCADQiCIfCEEIANC/////w+DIBEgDn58IQMgBCADQiCIfCEEIANC/////w+DIBMgDH58IQMgBCADQiCIfCEEIAIgAz4CKCAEQiCIIQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgAiAEPgIsIANCIIghBCADQv////8PgyAPIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBB+fCEDIAQgA0IgiHwhBCACIAM+AjAgBEIgiCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgEn58IQQgAyAEQiCIfCEDIAIgBD4CNCADQiCIIQQgA0L/////D4MgEyAUfnwhAyAEIANCIIh8IQQgAiADPgI4IARCIIghAyACIAQ+AjwLjBIMAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIGIAZ+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCBCIHfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIIIgh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgwiCX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCECIKfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIUIgt+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhgiDH58IQIgAyACQiCIfCEDIAJC/////w+DIAcgC358IQIgAyACQiCIfCEDIAJC/////w+DIAggCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAkgCX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCHCINfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCyALfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CKCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCyAMfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CLCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCyANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDCAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CMCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDCANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CNCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4COCADIQQgBEIgiCEFIAEgBD4CPAsKACAAIAAgARAIC7YBAQF+IAA1AAAgAX4hAyACIAM+AAAgADUABCABfiADQiCIfCEDIAIgAz4ABCAANQAIIAF+IANCIIh8IQMgAiADPgAIIAA1AAwgAX4gA0IgiHwhAyACIAM+AAwgADUAECABfiADQiCIfCEDIAIgAz4AECAANQAUIAF+IANCIIh8IQMgAiADPgAUIAA1ABggAX4gA0IgiHwhAyACIAM+ABggADUAHCABfiADQiCIfCEDIAIgAz4AHAtOAgF+AX8gACEDIAM1AAAgAXwhAiADIAI+AAAgAkIgiCECAkADQCACUA0BIANBBGohAyADNQAAIAJ8IQIgAyACPgAAIAJCIIghAgwACwsLsAIHAX8BfwF/AX8BfgF+AX8gAgRAIAIhBQVB6AAhBQsgAwRAIAMhBAVBiAEhBAsgACAEEAAgAUHIABAAIAUQAUGoARABQR8hBkEfIQcCQANAQcgAIAdqLQAAIAdBA0ZyDQEgB0EBayEHDAALC0HIACAHakEDazUAAEIBfCEIIAhCAVEEQEIAQgCAGgsCQANAAkADQCAEIAZqLQAAIAZBB0ZyDQEgBkEBayEGDAALCyAEIAZqQQdrKQAAIQkg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AjhB6AYgA0IgiD4CHEHoBiAAQSBqIAEQEAu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QonHmaQOIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AogEIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjAQiDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQBCIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQEIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmAQiGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcBCIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAEIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpAQiJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkGIBCACEAcaBSACQYgEEAUEQCACQYgEIAIQBxoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+QonHmaQOIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1AogEIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQKMBCIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkAQiDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQEIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYBCIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnAQiGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAEIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkBCIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgHX58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AgwgADUCECADQiCIfEHIDjUCECAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AhxBqBEgA0IgiD4CAEIAIQMgADUCBCACfkL/////D4MhBCAANQIEIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CIEGoESADQiCIPgIEQgAhAyAANQIIIAJ+Qv////8PgyEEIAA1AgggA0IgiHxByA41AgAgBH58IQMgACADPgIIIAA1AgwgA0IgiHxByA41AgQgBH58IQMgACADPgIMIAA1AhAgA0IgiHxByA41AgggBH58IQMgACADPgIQIAA1AhQgA0IgiHxByA41AgwgBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AhAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AhQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AhggBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AhwgBH58IQMgACADPgIkQagRIANCIIg+AghCACEDIAA1AgwgAn5C/////w+DIQQgADUCDCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AihBqBEgA0IgiD4CDEIAIQMgADUCECACfkL/////D4MhBCAANQIQIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CLEGoESADQiCIPgIQQgAhAyAANQIUIAJ+Qv////8PgyEEIAA1AhQgA0IgiHxByA41AgAgBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AgQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AgggBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AgwgBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AhAgBH58IQMgACADPgIkIAA1AiggA0IgiHxByA41AhQgBH58IQMgACADPgIoIAA1AiwgA0IgiHxByA41AhggBH58IQMgACADPgIsIAA1AjAgA0IgiHxByA41AhwgBH58IQMgACADPgIwQagRIANCIIg+AhRCACEDIAA1AhggAn5C/////w+DIQQgADUCGCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AjRBqBEgA0IgiD4CGEIAIQMgADUCHCACfkL/////D4MhBCAANQIcIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QcgONQIYIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QcgONQIcIAR+fCEDIAAgAz4COEGoESADQiCIPgIcQagRIABBIGogARAmC74fIwF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/////w4hBSADQv////8PgyAANQIAIgYgATUCACIHfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIQggA0L/////D4NBADUCyA4iCSAIfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCBCILfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIKIAd+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLMDiINIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhDCAEQv////8PgyAJIAx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIIIg9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIIIg4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AtAOIhEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEQIANC/////w+DIAkgEH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgwiE358IQQgAyAEQiCIfCEDIARC/////w+DIAogD358IQQgAyAEQiCIfCEDIARC/////w+DIA4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgwiEiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC1A4iFSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRQgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCECIXfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECIWIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLYDiIZIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhGCADQv////8PgyAJIBh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIUIht+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIUIhogB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gGH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtwOIh0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEcIARC/////w+DIAkgHH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhgiH358IQMgBCADQiCIfCEEIANC/////w+DIAogG358IQMgBCADQiCIfCEEIANC/////w+DIA4gF358IQMgBCADQiCIfCEEIANC/////w+DIBIgE358IQMgBCADQiCIfCEEIANC/////w+DIBYgD358IQMgBCADQiCIfCEEIANC/////w+DIBogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhgiHiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC4A4iISAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DISAgA0L/////D4MgCSAgfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCHCIjfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAffnwhBCADIARCIIh8IQMgBEL/////D4MgDiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgFiATfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgHiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCIiIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLkDiIlIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhJCAEQv////8PgyAJICR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgCiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgEiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAMfnwhAyAEIANCIIh8IQQgAiADPgIAIARCIIghAyAEQv////8PgyAOICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBB+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIBIgI358IQMgBCADQiCIfCEEIANC/////w+DIBYgH358IQMgBCADQiCIfCEEIANC/////w+DIBogG358IQMgBCADQiCIfCEEIANC/////w+DIB4gF358IQMgBCADQiCIfCEEIANC/////w+DICIgE358IQMgBCADQiCIfCEEIANC/////w+DIBUgJH58IQMgBCADQiCIfCEEIANC/////w+DIBkgIH58IQMgBCADQiCIfCEEIANC/////w+DIB0gHH58IQMgBCADQiCIfCEEIANC/////w+DICEgGH58IQMgBCADQiCIfCEEIANC/////w+DICUgFH58IQMgBCADQiCIfCEEIAIgAz4CCCAEQiCIIQMgBEL/////D4MgFiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAffnwhBCADIARCIIh8IQMgBEL/////D4MgHiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgISAcfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAYfnwhBCADIARCIIh8IQMgAiAEPgIMIANCIIghBCADQv////8PgyAaICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAdICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBx+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIB4gI358IQQgAyAEQiCIfCEDIARC/////w+DICIgH358IQQgAyAEQiCIfCEDIARC/////w+DICEgJH58IQQgAyAEQiCIfCEDIARC/////w+DICUgIH58IQQgAyAEQiCIfCEDIAIgBD4CFCADQiCIIQQgA0L/////D4MgIiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAkfnwhAyAEIANCIIh8IQQgAiADPgIYIARCIIghAyACIAQ+AhwgA6cEQCACQcgOIAIQBxoFIAJByA4QBQRAIAJByA4gAhAHGgsLC7shHQF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/////w4hBkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQggAkL/////D4NBADUCyA4iCSAIfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCBCIKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DQQA1AswOIgwgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyELIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AggiDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLQDiIPIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhDiACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIMIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC1A4iEiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIREgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCECITfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gDn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtgOIhUgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEUIAJC/////w+DIAkgFH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhQiFn58IQIgAyACQiCIfCEDIAJC/////w+DIAogE358IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8PgyASIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAVIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLcDiIYIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFyACQv////8PgyAJIBd+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIYIhl+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyANIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC4A4iGyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRogAkL/////D4MgCSAafnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCHCIcfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgECATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgGn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gF358IQIgAyACQiCIfCEDIAJC/////w+DIBIgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBggDn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AuQOIh4gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEdIAJC/////w+DIAkgHX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAKIBx+fCECIAMgAkIgiHwhAyACQv////8PgyANIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyATIBN+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiALfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyANIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBl+fCECIAMgAkIgiHwhAyACQv////8PgyATIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAOfnwhAiADIAJCIIh8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAQIBx+fCECIAMgAkIgiHwhAyACQv////8PgyATIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAWIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgEiAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiARfnwhAiADIAJCIIh8IQMgASACPgIIIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyATIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAWIBl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgFSAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAUfnwhAiADIAJCIIh8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAWIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAZIBl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGCAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyAafnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAXfnwhAiADIAJCIIh8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAZIBx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgGyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAafnwhAiADIAJCIIh8IQMgASACPgIUIAMhBCAEQiCIIQVCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAcIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgHiAdfnwhAiADIAJCIIh8IQMgASACPgIYIAMhBCAEQiCIIQUgASAEPgIcIAWnBEAgAUHIDiABEAcaBSABQcgOEAUEQCABQcgOIAEQBxoLCwsKACAAIAAgARAqCwsAIABBiA8gARAqCxUAIABBqBUQAEHIFRABQagVIAEQKQsRACAAQegVEC5B6BVBiBAQBQskACAAEAIEQEEADwsgAEGIFhAuQYgWQYgQEAUEQEF/DwtBAQ8LFwAgACABEC4gAUHIDiABEA4gASABEC0LCQBBqA8gABAAC8sBBAF/AX8BfwF/IAIQAUEgIQUgACEDAkADQCAFIAFLDQEgBUEgRgRAQagWEDIFQagWQYgPQagWECoLIANBqBZByBYQKiACQcgWIAIQJiADQSBqIQMgBUEgaiEFDAALCyABQSBwIQQgBEUEQA8LQcgWEAFBACEGAkADQCAGIARGDQEgBiADLQAAOgDIFiADQQFqIQMgBkEBaiEGDAALCyAFQSBGBEBBqBYQMgVBqBZBiA9BqBYQKgtByBZBqBZByBYQKiACQcgWIAIQJgscACABIAJB6BYQM0HoFkHoFhAtIABB6BYgAxAqC/gBBAF/AX8BfwF/QQAoAgAhBUEAIAUgAkEBakEgbGo2AgAgBRAyIAAhBiAFQSBqIQVBACEIAkADQCAIIAJGDQEgBhACBEAgBUEgayAFEAAFIAYgBUEgayAFECoLIAYgAWohBiAFQSBqIQUgCEEBaiEIDAALCyAGIAFrIQYgBUEgayEFIAMgAkEBayAEbGohByAFIAUQMQJAA0AgCEUNASAGEAIEQCAFIAVBIGsQACAHEAEFIAVBIGtBiBcQACAFIAYgBUEgaxAqIAVBiBcgBxAqCyAGIAFrIQYgByAEayEHIAVBIGshBSAIQQFrIQgMAAsLQQAgBTYCAAs+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAtIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCws+AwF/AX8BfyAAIQQgAiEFQQAhAwJAA0AgAyABRg0BIAQgBRAuIARBIGohBCAFQSBqIQUgA0EBaiEDDAALCwuyAgIBfwF/IAJFBEAgAxAyDwsgAEGoFxAAIAMQMiACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADECsgBUGAAU8EQCAFQYABayEFIANBqBcgAxAqCyADIAMQKyAFQcAATwRAIAVBwABrIQUgA0GoFyADECoLIAMgAxArIAVBIE8EQCAFQSBrIQUgA0GoFyADECoLIAMgAxArIAVBEE8EQCAFQRBrIQUgA0GoFyADECoLIAMgAxArIAVBCE8EQCAFQQhrIQUgA0GoFyADECoLIAMgAxArIAVBBE8EQCAFQQRrIQUgA0GoFyADECoLIAMgAxArIAVBAk8EQCAFQQJrIQUgA0GoFyADECoLIAMgAxArIAVBAU8EQCAFQQFrIQUgA0GoFyADECoLIARFDQEMAAsLC94BAwF/AX8BfyAAEAIEQCABEAEPC0EcIQJB6BBByBcQACAAQcgQQSBB6BcQOCAAQYgRQSBBiBgQOAJAA0BB6BdBqA8QBA0BQegXQagYECtBASEDAkADQEGoGEGoDxAEDQFBqBhBqBgQKyADQQFqIQMMAAsLQcgXQcgYEAAgAiADa0EBayEEAkADQCAERQ0BQcgYQcgYECsgBEEBayEEDAALCyADIQJByBhByBcQK0HoF0HIF0HoFxAqQYgYQcgYQYgYECoMAAsLQYgYEC8EQEGIGCABECgFQYgYIAEQAAsLIAAgABACBEBBAQ8LIABB6A9BIEHoGBA4QegYQagPEAQLFQAgACABQYgZECpBiBlBiA8gAhAqCwoAIAAgACABEDsLCwAgAEHIDiABEA4LCQAgAEGIEBAFCw4AIAAQAiAAQSBqEAJxCwoAIABBwABqEAILDQAgABABIABBIGoQAQsVACAAEAEgAEEgahAcIABBwABqEAELUgAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOAt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWAscACABQcAAahAcIABBIGogAUEgahAAIAAgARAACxgBAX8gACABEAQgAEEgaiABQSBqEARxDwt1AQF/IABBwABqIQIgABBABEAgARA/DwsgARA/BEBBAA8LIAIQDwRAIAAgARBGDwsgAkHIGRAVIAFByBlB6BkQFCACQcgZQYgaEBQgAUEgakGIGkGoGhAUIABB6BkQBARAIABBIGpBqBoQBARAQQEPCwtBAA8LtAECAX8BfyAAQcAAaiECIAFBwABqIQMgABBABEAgARBADwsgARBABEBBAA8LIAIQDwRAIAEgABBHDwsgAxAPBEAgACABEEcPCyACQcgaEBUgA0HoGhAVIABB6BpBiBsQFCABQcgaQagbEBQgAkHIGkHIGxAUIANB6BpB6BsQFCAAQSBqQegbQYgcEBQgAUEgakHIG0GoHBAUQYgbQagbEAQEQEGIHEGoHBAEBEBBAQ8LC0EADwvoAQAgABA/BEAgACABEEUPCyAAQcgcEBUgAEEgakHoHBAVQegcQYgdEBUgAEHoHEGoHRAQQagdQagdEBVBqB1ByBxBqB0QEUGoHUGIHUGoHRARQagdQagdQagdEBBByBxByBxByB0QEEHIHUHIHEHIHRAQIABBIGogAEEgaiABQcAAahAQQcgdIAEQFSABQagdIAEQESABQagdIAEQEUGIHUGIHUHoHRAQQegdQegdQegdEBBB6B1B6B1B6B0QEEGoHSABIAFBIGoQESABQSBqQcgdIAFBIGoQFCABQSBqQegdIAFBIGoQEQuJAgAgABBABEAgACAB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ACAHIAgQJyAFQSBqIQUgBkEgaiEGIAdBIGohByAIQSBqIQgMAAsLCw4AIAAQAiAAQSBqEAJxCw8AIAAQDyAAQSBqEAJxDwsNACAAEAEgAEEgahABCw0AIAAQHCAAQSBqEAELFAAgACABEAAgAEEgaiABQSBqEAALdQAgACABQejXABAUIABBIGogAUEgakGI2AAQFCAAIABBIGpBqNgAEBAgASABQSBqQcjYABAQQajYAEHI2ABBqNgAEBRBiNgAIAIQEkHo1wAgAiACEBBB6NcAQYjYACACQSBqEBBBqNgAIAJBIGogAkEgahARCxgAIAAgASACEBQgAEEgaiABIAJBIGoQFAtwACAAIABBIGpB6NgAEBQgACAAQSBqQYjZABAQIABBIGpBqNkAEBIgAEGo2QBBqNkAEBBB6NgAQcjZABASQcjZAEHo2ABByNkAEBBBiNkAQajZACABEBQgAUHI2QAgARARQejYAEHo2AAgAUEgahAQCxsAIAAgASACEBAgAEEgaiABQSBqIAJBIGoQEAsbACAAIAEgAhARIABBIGogAUEgaiACQSBqEBELFAAgACABEBIgAEEgaiABQSBqEBILFAAgACABEAAgAEEgaiABQSBqEBILFAAgACABEBcgAEEgaiABQSBqEBcLFAAgACABEBggAEEgaiABQSBqEBgLFQAgACABEAQgAEEgaiABQSBqEARxC10AIABB6NkAEBUgAEEgakGI2gAQFUGI2gBBqNoAEBJB6NkAQajaAEGo2gAQEUGo2gBByNoAEBsgAEHI2gAgARAUIABBIGpByNoAIAFBIGoQFCABQSBqIAFBIGoQEgscACAAIAEgAiADEB4gAEEgaiABIAIgA0EgahAeCxoBAX8gAEEgahAaIQEgAQRAIAEPCyAAEBoPCxkAIABBIGoQAgRAIAAQGQ8LIABBIGoQGQ8LjQIEAX8BfwF/AX9BACgCACEFQQAgBSACQQFqQcAAbGo2AgAgBRCCASAAIQYgBUHAAGohBUEAIQgCQANAIAggAkYNASAGEH8EQCAFQcAAayAFEIMBBSAGIAVBwABrIAUQhAELIAYgAWohBiAFQcAAaiEFIAhBAWohCAwACwsgBiABayEGIAVBwABrIQUgAyACQQFrIARsaiEHIAUgBRCOAQJAA0AgCEUNASAGEH8EQCAFIAVBwABrEIMBIAcQgQEFIAVBwABrQejaABCDASAFIAYgBUHAAGsQhAEgBUHo2gAgBxCEAQsgBiABayEGIAcgBGshByAFQcAAayEFIAhBAWshCAwACwtBACAFNgIAC84CAgF/AX8gAkUEQCADEIIBDwsgAEGo2wAQgwEgAxCCASACIQQCQANAIARBAWshBCABIARqLQAAIQUgAyADEIYBIAVBgAFPBEAgBUGAAWshBSADQajbACADEIQBCyADIAMQhgEgBUHAAE8EQCAFQcAAayEFIANBqNsAIAMQhAELIAMgAxCGASAFQSBPBEAgBUEgayEFIANBqNsAIAMQhAELIAMgAxCGASAFQRBPBEAgBUEQayEFIANBqNsAIAMQhAELIAMgAxCGASAFQQhPBEAgBUEIayEFIANBqNsAIAMQhAELIAMgAxCGASAFQQRPBEAgBUEEayEFIANBqNsAIAMQhAELIAMgAxCGASAFQQJPBEAgBUECayEFIANBqNsAIAMQhAELIAMgAxCGASAFQQFPBEAgBUEBayEFIANBqNsAIAMQhAELIARFDQEMAAsLC80BAEHo3QAQggFB6N0AQejdABCJASAAQejbAEEgQajcABCTAUGo3ABB6NwAEIYBIABB6NwAQejcABCEAUHo3ABBqN0AEIoBQajdAEHo3ABBqN0AEIQBQajdAEHo3QAQjQEEQAALQajcACAAQajeABCEAUHo3ABB6N0AEI0BBEBB6N0AEAFBiN4AEBxB6N0AQajeACABEIQBBUHo3gAQggFB6N4AQejcAEHo3gAQhwFB6N4AQYjcAEEgQejeABCTAUHo3gBBqN4AIAEQhAELC2kAQYjhABCCAUGI4QBBiOEAEIkBIABBqN8AQSBByN8AEJMBQcjfAEGI4AAQhgEgAEGI4ABBiOAAEIQBQYjgAEHI4AAQigFByOAAQYjgAEHI4AAQhAFByOAAQYjhABCNAQRAQQAPC0EBDwsPACAAEH8gAEHAAGoQf3ELCgAgAEGAAWoQfwsQACAAEIEBIABBwABqEIEBCxkAIAAQgQEgAEHAAGoQggEgAEGAAWoQgQELogEAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEg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ahCIASADIAQgAkGAAWoQhwEgAkGAAWogAkGAAWoQhgEgAkGAAWpBiPsAIAJBgAFqEIgBIAJBgAFqQcj7ACACQYABahCIASACQYABakGI/wAgAkGAAWoQhAELGAAgACABEIMBIABBwABqIAFBwABqEIkBCycAIAAgARCDASAAQcAAaiABQcAAahCJASAAQYABaiABQYABahCDAQsWACABQciDARClASAAQciDASACEKIBCxYAIAFBiIUBEKUBIABBiIUBIAIQowELFgAgAUHIhgEQpgEgAEHIhgEgAhCkAQsYACAAIAEQjAEgAEHAAGogAUHAAGoQjAELJwAgACABEIwBIABBwABqIAFBwABqEIwBIABBgAFqIAFBgAFqEIwBCxgAIAAgARCLASAAQcAAaiABQcAAahCLAQsnACAAIAEQiwEgAEHAAGogAUHAAGoQiwEgAEGAAWogAUGAAWoQiwELXgAgABCXAQRAIAEQgQEgAUHAAGoQgQEFIABBgAFqQYiIARCOAUGIiAFByIgBEIYBQYiIAUHIiAFBiIkBEIQBIABByIgBIAEQhAEgAEHAAGpBiIkBIAFBwABqEIQBCwu9AQUBfwF/AX8BfwF/QQAoAgAhA0EAIAMgAUHAAGxqNgIAIABBgAFqQcABIAEgA0HAABCSASAAIQQgAyEFIAIhBkEAIQcCQANAIAcgAUYNASAFEH8EQCAGEIEBIAZBwABqEIEBBSAFIARBwABqQciJARCEASAFIAUQhgEgBSAEIAYQhAEgBUHIiQEgBkHAAGoQhAELIARBwAFqIQQgBkGAAWohBiAFQcAAaiEFIAdBAWohBwwACwtBACADNgIAC14AIAAQlwEEQCABEJkBBSAAQYABakGIigEQjgFBiIoBQciKARCGAUGIigFByIoBQYiLARCEASAAQciKASABEIQBIABBwABqQYiLASABQcAAahCEASABQYABahCCAQsLOwIBfwF/IAIgAWpBAWshAyAAIQQCQANAIAMgAkgNASADIAQtAAA6AAAgA0EBayEDIARBAWohBAwACwsLPQAgABCWAQRAIAEQmAEgAUHAADoAAA8LIABByIsBEKoBQciLAUHAACABELEBQYiMAUHAACABQcAAahCxAQtKACAAEJcBBEAgARCBASABQcAAOgAADwsgAEHIjAEQjAFByIwBQcAAIAEQsQEgAEHAAGoQkAFBf0YEQCABIAEtAABBgAFyOgAACws5ACAALQAAQcAAcQRAIAEQmAEPCyAAQcAAQYiNARCxASAAQcAAakHAAEHIjQEQsQFBiI0BIAEQrAEL2QECAX8BfyAALQAAIQIgAkHAAHEEQCABEJgBDwsgAkGAAXEhAyAAQciOARCDAUHIjgEgAkE/cToAAEHIjgFBwABBiI4BELEBQYiOASABEIsBIAFByI4BEIYBIAFByI4BQciOARCEAUHIjgFByOEAQciOARCHAUHIjgFByI4BEJQBQciOAUGIjgEQiQFByI4BEJABQX9GBEAgAwRAQciOASABQcAAahCDAQVByI4BIAFBwABqEIkBCwUgAwRAQciOASABQcAAahCJAQVByI4BIAFBwABqEIMBCwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQsgEgBEGAAWohBCAFQYABaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQswEgBEGAAWohBCAFQcAAaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQtAEgBEGAAWohBCAFQYABaiEFIANBAWohAwwACwsLVQMBfwF/AX8gACABQQFrQcAAbGohBCACIAFBAWtBgAFsaiEFQQAhAwJAA0AgAyABRg0BIAQgBRC1ASAEQcAAayEEIAVBgAFrIQUgA0EBaiEDDAALCwtVAwF/AX8BfyAAIAFBAWtBgAFsaiEEIAIgAUEBa0HAAWxqIQVBACEDAkADQCADIAFGDQEgBCAFEJwBIARBgAFrIQQgBUHAAWshBSADQQFqIQMMAAsLC0ECAX8BfyABQQhsIAJrIQQgAyAESgRAQQEgBHRBAWshBQVBASADdEEBayEFCyAAIAJBA3ZqKAAAIAJBB3F2IAVxC5oBBAF/AX8BfwF/IAFBAUYEQA8LQQEgAUEBa3QhAiAAIQMgACACQcABbGohBCAEQcABayEFAkADQCADIAVGDQEgAyAEIAMQpAEgBSAEIAUQpAEgA0HAAWohAyAEQcABaiEEDAALCyAAIAFBAWsQvAEgAUEBayEBAkADQCABRQ0BIAUgBRChASABQQFrIQEMAAsLIAAgBSAAEKQBC9IBCgF/AX8BfwF/AX8BfwF/AX8BfwF/IANFBEAgBhCZAQ8LQQEgBXQhDUEAKAIAIQ5BACAOIA1BwAFsajYCAEEAIQwCQANAIAwgDUYNASAOIAxBwAFsahCZASAMQQFqIQwMAAsLIAAhCiABIQggASADIAJsaiEJAkADQCAIIAlGDQEgCCACIAQgBRC7ASEPIA8EQCAOIA9BAWtBwAFsaiEQIBAgCiAQEKQBCyAIIAJqIQggCkHAAWohCgwACwsgDiAFELwBIA4gBhCbAUEAIA42AgALqAEMAX8BfwF/AX8BfwF/AX8BfwF/AX8BfwF/IAQQmQEgA0UEQA8LIANnLQDIkAEhBSACQQN0QQFrIAVuQQFqIQYgBkEBayAFbCEKAkADQCAKQQBIDQEgBBCXAUUEQEEAIQwCQANAIAwgBUYNASAEIAQQoQEgDEEBaiEMDAALCwsgACABIAIgAyAKIAVBiI8BEL0BIARBiI8BIAQQpAEgCiAFayEKDAALCwtBAgF/AX8gAUEIbCACayEEIAMgBEoEQEEBIAR0QQFrIQUFQQEgA3RBAWshBQsgACACQQN2aigAACACQQdxdiAFcQuaAQQBfwF/AX8BfyABQQFGBEAPC0EBIAFBAWt0IQIgACEDIAAgAkHAAWxqIQQgBEHAAWshBQJAA0AgAyAFRg0BIAMgBCADEKQBIAUgBCAFEKQBIANBwAFqIQMgBEHAAWohBAwACwsgACABQQFrEMABIAFBAWshAQJAA0AgAUUNASAFIAUQoQEgAUEBayEBDAALCyAAIAUgABCkAQvSAQoBfwF/AX8BfwF/AX8BfwF/AX8BfyADRQRAIAYQmQEPC0EBIAV0IQ1BACgCACEOQQAgDiANQcABbGo2AgBBACEMAkADQCAMIA1GDQEgDiAMQcABbGoQmQEgDEEBaiEMDAALCyAAIQogASEIIAEgAyACbGohCQJAA0AgCCAJRg0BIAggAiAEIAUQvwEhDyAPBEAgDiAPQQFrQcABbGohECAQIAogEBCjAQsgCCACaiEIIApBgAFqIQoMAAsLIA4gBRDAASAOIAYQmwFBACAONgIAC6gBDAF/AX8BfwF/AX8BfwF/AX8BfwF/AX8BfyAEEJkBIANFBEAPCyADZy0AqJIBIQUgAkEDdEEBayAFbkEBaiEGIAZBAWsgBWwhCgJAA0AgCkEASA0BIAQQlwFFBEBBACEMAkADQCAMIAVGDQEgBCAEEKEBIAxBAWohDAwACwsLIAAgASACIAMgCiAFQeiQARDBASAEQeiQASAEEKQBIAogBWshCgwACwsLtAQHAX8BfwF/AX8BfwF/AX8gAkUEQCADEJkBDwsgAkEDdCEFQQAoAgAhBCAEIQpBACAEQSBqIAVqQXhxNgIAQQEhBiABQQBBA3ZBfHFqKAIAQQBBH3F2QQFxIQdBACEJAkADQCAGIAVGDQEgASAGQQN2QXxxaigCACAGQR9xdkEBcSEIIAcEQCAIBEAgCQRAQQAhB0EBIQkgCkEBOgAAIApBAWohCgVBACEHQQEhCSAKQf8BOgAAIApBAWohCgsFIAkEQEEAIQdBASEJIApB/wE6AAAgCkEBaiEKBUEAIQdBACEJIApBAToAACAKQQFqIQoLCwUgCARAIAkEQEEAIQdBASEJIApBADoAACAKQQFqIQoFQQEhB0EAIQkgCkEAOgAAIApBAWohCgsFIAkEQEEBIQdBACEJIApBADoAACAKQQFqIQoFQQAhB0EAIQkgCkEAOgAAIApBAWohCgsLCyAGQQFqIQYMAAsLIAcEQCAJBEAgCkH/AToAACAKQQFqIQogCkEAOgAAIApBAWohCiAKQQE6AAAgCkEBaiEKBSAKQQE6AAAgCkEBaiEKCwUgCQRAIApBADoAACAKQQFqIQogCkEBOgAAIApBAWohCgsLIApBAWshCiAAQciSARCbASADEJkBAkADQCADIAMQoQEgCi0AACEIIAgEQCAIQQFGBEAgA0HIkgEgAxCkAQUgA0HIkgEgAxCpAQsLIAQgCkYNASAKQQFrIQoMAAsLQQAgBDYCAAu0BAcBfwF/AX8BfwF/AX8BfyACRQRAIAMQmQEPCyACQQN0IQVBACgCACEEIAQhCkEAIARBIGogBWpBeHE2AgBBASEGIAFBAEEDdkF8cWooAgBBAEEfcXZBAXEhB0EAIQkCQANAIAYgBUYNASABIAZBA3ZBfHFqKAIAIAZBH3F2QQFxIQggBwRAIAgEQCAJBEBBACEHQQEhCSAKQQE6AAAgCkEBaiEKBUEAIQdBASEJIApB/wE6AAAgCkEBaiEKCwUgCQRAQQAhB0EBIQkgCkH/AToAACAKQQFqIQoFQQAhB0EAIQkgCkEBOgAAIApBAWohCgsLBSAIBEAgCQRAQQAhB0EBIQkgCkEAOgAAIApBAWohCgVBASEHQQAhCSAKQQA6AAAgCkEBaiEKCwUgCQRAQQEhB0EAIQkgCkEAOgAAIApBAWohCgVBACEHQQAhCSAKQQA6AAAgCkEBaiEKCwsLIAZBAWohBgwACwsgBwRAIAkEQCAKQf8BOgAAIApBAWohCiAKQQA6AAAgCkEBaiEKIApBAToAACAKQQFqIQoFIApBAToAACAKQQFqIQoLBSAJBEAgCkEAOgAAIApBAWohCiAKQQE6AAAgCkEBaiEKCwsgCkEBayEKIABBiJQBEJoBIAMQmQECQANAIAMgAxChASAKLQAAIQggCARAIAhBAUYEQCADQYiUASADEKMBBSADQYiUASADEKgBCwsgBCAKRg0BIApBAWshCgwACwtBACAENgIACxYAIAFBiJUBEC4gAEGIlQFBICACEGwLRgAgAEH/AXEtAKiyAUEYdCAAQQh2Qf8BcS0AqLIBQRB0aiAAQRB2Qf8BcS0AqLIBQQh0IABBGHZB/wFxLQCosgFqaiABdwtqBQF/AX8BfwF/AX9BASABdCECQQAhAwJAA0AgAyACRg0BIAAgA0HgAGxqIQUgAyABEMYBIQQgACAEQeAAbGohBiADIARJBEAgBUGotAEQRCAGIAUQREGotAEgBhBECyADQQFqIQMMAAsLC+MBBwF/AX8BfwF/AX8BfwF/IAJFIAMQJXEEQA8LQQEgAXQhBCAEQQFrIQhBASEHIARBAXYhBQJAA0AgByAFTw0BIAAgB0HgAGxqIQkgACAEIAdrQeAAbGohCiACBEAgAxAlBEAgCUGItQEQRCAKIAkQREGItQEgChBEBSAJQYi1ARBEIAogAyAJEMUBQYi1ASADIAoQxQELBSADECUEQAUgCSADIAkQxQEgCiADIAoQxQELCyAHQQFqIQcMAAsLIAMQJQRABSAAIAMgABDFASAAIAVB4ABsaiEKIAogAyAKEMUBCwvtAQkBfwF/AX8BfwF/AX8BfwF/AX8gACABEMcBQQEgAXQhCUEBIQQCQANAIAQgAUsNAUEBIAR0IQdBqJUBIARBIGxqIQpBACEFAkADQCAFIAlPDQFB6LUBEDIgB0EBdiEIQQAhBgJAA0AgBiAITw0BIAAgBSAGakHgAGxqIQsgCyAIQeAAbGohDCAMQei1AUGItgEQxQEgC0HotgEQREHotgFBiLYBIAsQTUHotgFBiLYBIAwQUkHotQEgCkHotQEQKiAGQQFqIQYMAAsLIAUgB2ohBQwACwsgBEEBaiEEDAALCyAAIAEgAiADEMgBC0MCAX8BfyAAQQF2IQJBACEBAkADQCACRQ0BIAJBAXYhAiABQQFqIQEMAAsLIABBASABdEcEQAALIAFBHEsEQAALIAELHgEBfyABEMoBIQJByLcBEDIgACACQQBByLcBEMkBCyQCAX8BfyABEMoBIQJByJwBIAJBIGxqIQMgACACQQEgAxDJAQt5AwF/AX8BfyADQei3ARAAQQAhBwJAA0AgByACRg0BIAAgB0HgAGxqIQUgASAHQeAAbGohBiAGQei3AUGIuAEQxQEgBUHouAEQREHouAFBiLgBIAUQTUHouAFBiLgBIAYQUkHotwEgBEHotwEQKiAHQQFqIQcMAAsLC5EBBQF/AX8BfwF/AX8gAhDKASEIQeijASAIQSBsaiEJIANByLkBEABBACEHAkADQCAHIAJGDQEgACAHQeAAbGohBSABIAdB4ABsaiEGIAUgBkHouQEQTSAGIAkgBhDFASAFIAYgBhBNIAZByLkBIAYQxQFB6LkBIAUQREHIuQEgBEHIuQEQKiAHQQFqIQcMAAsLC60BBgF/AX8BfwF/AX8BfyACEMoBIQhB6KMBIAhBIGxqIQlBiKsBIAhBIGxqIQogA0HIugEQAEEAIQcCQANAIAcgAkYNASAAIAdB4ABsaiEFIAEgB0HgAGxqIQYgBkHIugFB6LoBEMUBIAVB6LoBIAYQUiAGIAogBhDFASAFIAkgBRDFAUHougEgBSAFEFIgBSAKIAUQxQFByLoBIARByLoBECogB0EBaiEHDAALCwvIAQkBfwF/AX8BfwF/AX8BfwF/AX9BASACdCEEIARBAXYhBSABIAJ2IQMgBUHgAGwhBkGolQEgAkEgbGohC0EAIQkCQANAIAkgA0YNAUHIuwEQMkEAIQoCQANAIAogBUYNASAAIAkgBGwgCmpB4ABsaiEHIAcgBmohCCAIQci7AUHouwEQxQEgB0HIvAEQREHIvAFB6LsBIAcQTUHIvAFB6LsBIAgQUkHIuwEgC0HIuwEQKiAKQQFqIQoMAAsLIAlBAWohCQwACwsLggEEAX8BfwF/AX8gAUEBdiEGIAFBAXEEQCAAIAZB4ABsaiACIAAgBkHgAGxqEMUBC0EAIQUCQANAIAUgBk8NASAAIAVB4ABsaiEDIAAgAUEBayAFa0HgAGxqIQQgBCACQai9ARDFASADIAIgBBDFAUGovQEgAxBEIAVBAWohBQwACwsLpgEGAX8BfwF/AX8BfwF/IAIQygEhCEHoowEgCEEgbGohCUGIqwEgCEEgbGohCiADQYi+ARAAQQAhBwJAA0AgByACRg0BIAAgB0HgAGxqIQUgASAHQeAAbGohBiAFIAlBqL4BEMUBIAZBqL4BQai+ARBSIAUgBiAGEFJBqL4BIAogBRDFASAGQYi+ASAGEMUBQYi+ASAEQYi+ARAqIAdBAWohBwwACwsLFwAgAUGIvwEQLiAAQYi/AUEgIAIQwwELRgAgAEH/AXEtAKjcAUEYdCAAQQh2Qf8BcS0AqNwBQRB0aiAAQRB2Qf8BcS0AqNwBQQh0IABBGHZB/wFxLQCo3AFqaiABdwttBQF/AX8BfwF/AX9BASABdCECQQAhAwJAA0AgAyACRg0BIAAgA0HAAWxqIQUgAyABENQBIQQgACAEQcABbGohBiADIARJBEAgBUGo3gEQmwEgBiAFEJsBQajeASAGEJsBCyADQQFqIQMMAAsLC+cBBwF/AX8BfwF/AX8BfwF/IAJFIAMQJXEEQA8LQQEgAXQhBCAEQQFrIQhBASEHIARBAXYhBQJAA0AgByAFTw0BIAAgB0HAAWxqIQkgACAEIAdrQcABbGohCiACBEAgAxAlBEAgCUHo3wEQmwEgCiAJEJsBQejfASAKEJsBBSAJQejfARCbASAKIAMgCRDTAUHo3wEgAyAKENMBCwUgAxAlBEAFIAkgAyAJENMBIAogAyAKENMBCwsgB0EBaiEHDAALCyADECUEQAUgACADIAAQ0wEgACAFQcABbGohCiAKIAMgChDTAQsL8AEJAX8BfwF/AX8BfwF/AX8BfwF/IAAgARDVAUEBIAF0IQlBASEEAkADQCAEIAFLDQFBASAEdCEHQai/ASAEQSBsaiEKQQAhBQJAA0AgBSAJTw0BQajhARAyIAdBAXYhCEEAIQYCQANAIAYgCE8NASAAIAUgBmpBwAFsaiELIAsgCEHAAWxqIQwgDEGo4QFByOEBENMBIAtBiOMBEJsBQYjjAUHI4QEgCxCkAUGI4wFByOEBIAwQqQFBqOEBIApBqOEBECogBkEBaiEGDAALCyAFIAdqIQUMAAsLIARBAWohBAwACwsgACABIAIgAxDWAQtDAgF/AX8gAEEBdiECQQAhAQJAA0AgAkUNASACQQF2IQIgAUEBaiEBDAALCyAAQQEgAXRHBEAACyABQRxLBEAACyABCx4BAX8gARDYASECQcjkARAyIAAgAkEAQcjkARDXAQskAgF/AX8gARDYASECQcjGASACQSBsaiEDIAAgAkEBIAMQ1wELfAMBfwF/AX8gA0Ho5AEQAEEAIQcCQANAIAcgAkYNASAAIAdBwAFsaiEFIAEgB0HAAWxqIQYgBkHo5AFBiOUBENMBIAVByOYBEJsBQcjmAUGI5QEgBRCkAUHI5gFBiOUBIAYQqQFB6OQBIARB6OQBECogB0EBaiEHDAALCwuUAQUBfwF/AX8BfwF/IAIQ2AEhCEHozQEgCEEgbGohCSADQYjoARAAQQAhBwJAA0AgByACRg0BIAAgB0HAAWxqIQUgASAHQcABbGohBiAFIAZBqOgBEKQBIAYgCSAGENMBIAUgBiAGEKQBIAZBiOgBIAYQ0wFBqOgBIAUQmwFBiOgBIARBiOgBECogB0EBaiEHDAALCwuvAQYBfwF/AX8BfwF/AX8gAhDYASEIQejNASAIQSBsaiEJQYjVASAIQSBsaiEKIANB6OkBEABBACEHAkADQCAHIAJGDQEgACAHQcABbGohBSABIAdBwAFsaiEGIAZB6OkBQYjqARDTASAFQYjqASAGEKkBIAYgCiAGENMBIAUgCSAFENMBQYjqASAFIAUQqQEgBSAKIAUQ0wFB6OkBIARB6OkBECogB0EBaiEHDAALCwvLAQkBfwF/AX8BfwF/AX8BfwF/AX9BASACdCEEIARBAXYhBSABIAJ2IQMgBUHAAWwhBkGovwEgAkEgbGohC0EAIQkCQANAIAkgA0YNAUHI6wEQMkEAIQoCQANAIAogBUYNASAAIAkgBGwgCmpBwAFsaiEHIAcgBmohCCAIQcjrAUHo6wEQ0wEgB0Go7QEQmwFBqO0BQejrASAHEKQBQajtAUHo6wEgCBCpAUHI6wEgC0HI6wEQKiAKQQFqIQoMAAsLIAlBAWohCQwACwsLgwEEAX8BfwF/AX8gAUEBdiEGIAFBAXEEQCAAIAZBwAFsaiACIAAgBkHAAWxqENMBC0EAIQUCQANAIAUgBk8NASAAIAVBwAFsaiEDIAAgAUEBayAFa0HAAWxqIQQgBCACQejuARDTASADIAIgBBDTAUHo7gEgAxCbASAFQQFqIQUMAAsLC6gBBgF/AX8BfwF/AX8BfyACENgBIQhB6M0BIAhBIGxqIQlBiNUBIAhBIGxqIQogA0Go8AEQAEEAIQcCQANAIAcgAkYNASAAIAdBwAFsaiEFIAEgB0HAAWxqIQYgBSAJQcjwARDTASAGQcjwAUHI8AEQqQEgBSAGIAYQqQFByPABIAogBRDTASAGQajwASAGENMBQajwASAEQajwARAqIAdBAWohBwwACwsLFgAgAUGI8gEQLiAAQYjyAUEgIAIQbQsXACABQajyARAuIABBqPIBQSAgAhDEAQtYBAF/AX8BfwF/IAAhByAEIQggAkHI8gEQAEEAIQYCQANAIAYgAUYNASAHQcjyASAIECogB0EgaiEHIAhBIGohCEHI8gEgA0HI8gEQKiAGQQFqIQYMAAsLC1sEAX8BfwF/AX8gACEHIAQhCCACQejyARAAQQAhBgJAA0AgBiABRg0BIAdB6PIBIAgQxQEgB0HgAGohByAIQeAAaiEIQejyASADQejyARAqIAZBAWohBgwACwsLWwQBfwF/AX8BfyAAIQcgBCEIIAJBiPMBEABBACEGAkADQCAGIAFGDQEgB0GI8wEgCBDhASAHQcAAaiEHIAhB4ABqIQhBiPMBIANBiPMBECogBkEBaiEGDAALCwtbBAF/AX8BfwF/IAAhByAEIQggAkGo8wEQAEEAIQYCQANAIAYgAUYNASAHQajzASAIENMBIAdBwAFqIQcgCEHAAWohCEGo8wEgA0Go8wEQKiAGQQFqIQYMAAsLC1sEAX8BfwF/AX8gACEHIAQhCCACQcjzARAAQQAhBgJAA0AgBiABRg0BIAdByPMBIAgQ4gEgB0GAAWohByAIQcABaiEIQcjzASADQcjzARAqIAZBAWohBgwACwsLDQBBqPsBIAAgARCEAQsYACAAEH8gAEHAAGoQf3EgAEGAAWoQf3ELGgAgABCAASAAQcAAahB/cSAAQYABahB/cQ8LGQAgABCBASAAQcAAahCBASAAQYABahCBAQsZACAAEIIBIABBwABqEIEBIABBgAFqEIEBCycAIAAgARCDASAAQcAAaiABQcAAahCDASAAQYABaiABQYABahCDAQvlAgAgACABQej8ARCEASAAQcAAaiABQcAAakGo/QEQhAEgAEGAAWogAUGAAWpB6P0BEIQBIAAgAEHAAGpBqP4BEIcBIAEgAUHAAGpB6P4BEIcBIAAgAEGAAWpBqP8BEIcBIAEgAUGAAWpB6P8BEIcBIABBwABqIABBgAFqQaiAAhCHASABQcAAaiABQYABakHogAIQhwFB6PwBQaj9AUGogQIQhwFB6PwBQej9AUHogQIQhwFBqP0BQej9AUGoggIQhwFBqIACQeiAAiACEIQBIAJBqIICIAIQiAEgAiACEOgBQej8ASACIAIQhwFBqP4BQej+ASACQcAAahCEASACQcAAakGogQIgAkHAAGoQiAFB6P0BQeiCAhDoASACQcAAakHoggIgAkHAAGoQhwFBqP8BQej/ASACQYABahCEASACQYABakHogQIgAkGAAWoQiAEgAkGAAWpBqP0BIAJBgAFqEIcBC4ECACAAQaiDAhCGASAAIABBwABqQeiDAhCEAUHogwJB6IMCQaiEAhCHASAAIABBwABqQeiEAhCIAUHohAIgAEGAAWpB6IQCEIcBQeiEAkHohAIQhgEgAEHAAGogAEGAAWpBqIUCEIQBQaiFAkGohQJB6IUCEIcBIABBgAFqQaiGAhCGAUHohQIgARDoAUGogwIgASABEIcBQaiGAiABQcAAahDoAUGohAIgAUHAAGogAUHAAGoQhwFBqIMCQaiGAiABQYABahCHAUHohQIgAUGAAWogAUGAAWoQiAFB6IQCIAFBgAFqIAFBgAFqEIcBQaiEAiABQYABaiABQYABahCHAQs1ACAAIAEgAhCHASAAQcAAaiABQcAAaiACQcAAahCHASAAQYABaiABQYABaiACQYABahCHAQs1ACAAIAEgAhCIASAAQcAAaiABQcAAaiACQcAAahCIASAAQYABaiABQYABaiACQYABahCIAQsnACAAIAEQiQEgAEHAAGogAUHAAGoQiQEgAEGAAWogAUGAAWoQiQELMAEBfyAAQYABahCQASEBIAEEQCABDwsgAEHAAGoQkAEhASABBEAgAQ8LIAAQkAEPCycAIAAgARCLASAAQcAAaiABQcAAahCLASAAQYABaiABQYABahCLAQsnACAAIAEQjAEgAEHAAGogAUHAAGoQjAEgAEGAAWogAUGAAWoQ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ahCEAQuKAgAgACABEAAgAEEgaiABQSBqEBIgAUHwhwQgARCEASAAQcAAaiABQcAAahAAIABB4ABqIAFB4ABqEBIgAUHAAGpBsIgEIAFBwABqEIQBIABBgAFqIAFBgAFqEAAgAEGgAWogAUGgAWoQEiABQYABakHwiAQgAUGAAWoQhAEgAEHAAWogAUHAAWoQACAAQeABaiABQeABahASIAFBwAFqQbCJBCABQcABahCEASAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBIgAUGAAmpB8IkEIAFBgAJqEIQBIABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQEiABQcACakGwigQgAUHAAmoQhAELbAAgAEHwigQgARCEASAAQcAAakGwiwQgAUHAAGoQhAEgAEGAAWpB8IsEIAFBgAFqEIQBIABBwAFqQbCMBCABQcABahCEASAAQYACakHwjAQgAUGAAmoQhAEgAEHAAmpBsI0EIAFBwAJqEIQBC4oCACAAIAEQACAAQSBqIAFBIGoQEiABQfCNBCABEIQBIABBwABqIAFBwABqEAAgAEHgAGogAUHgAGoQEiABQcAAakGwjgQgAUHAAGoQhAEgAEGAAWogAUGAAWoQACAAQaABaiABQaABahASIAFBgAFqQfCOBCABQYABahCEASAAQcABaiABQcABahAAIABB4AFqIAFB4AFqEBIgAUHAAWpBsI8EIAFBwAFqEIQBIABBgAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQEiABQYACakHwjwQgAUGAAmoQhAEgAEHAAmogAUHAAmoQACAAQeACaiABQeACahASIAFBwAJqQbCQBCABQcACahCEAQtsACAAQfCQBCABEIQBIABBwABqQbCRBCABQcAAahCEASAAQYABakHwkQQgAUGAAWoQhAEgAEHAAWpBsJIEIAFBwAFqEIQBIABBgAJqQfCSBCABQYACahCEASAAQcACakGwkwQgAUHAAmoQhAELigIAIAAgARAAIABBIGogAUEgahASIAFB8JMEIAEQhAEgAEHAAGogAUHAAGoQACAAQeAAaiABQeAAahASIAFBwABqQbCUBCABQcAAahCEASAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBIgAUGAAWpB8JQEIAFBgAFqEIQBIABBwAFqIAFBwAFqEAAg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";
            var pq = 520;
            var pr = 1864;
            var pG1gen = 31208;
            var pG1zero = 31304;
            var pG1b = 3240;
            var pG2gen = 31400;
            var pG2zero = 31592;
            var pG2b = 12488;
            var pOneT = 31784;
            var prePSize = 192;
            var preQSize = 19776;
            var n8q = 32;
            var n8r = 32;
            var q = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
            var r = "21888242871839275222246405745257275088548364400416034343698204186575808495617";

var bn128_wasm = {
	code: code,
	pq: pq,
	pr: pr,
	pG1gen: pG1gen,
	pG1zero: pG1zero,
	pG1b: pG1b,
	pG2gen: pG2gen,
	pG2zero: pG2zero,
	pG2b: pG2b,
	pOneT: pOneT,
	prePSize: prePSize,
	preQSize: preQSize,
	n8q: n8q,
	n8r: n8r,
	q: q,
	r: r
};

var code$1 = "AGFzbQEAAAABiQERYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgCH9/f39/f39/AGAFf39/f38Bf2AHf39/f39/fwF/YAl/f39/f39/f38Bf2ALf39/f39/f39/f38BfwIQAQNlbnYGbWVtb3J5AgDoBwPCAsACAAECAQMDBAQFAAAGBwgFAgUFAAAFAAAAAAICAAEFCAkFBQgAAgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUIAAIFAAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAUABQAAAAAFBQUFBQoACwkKAAsJCAgDAAgIAgAACQkJBQUJAAgMCQICAQEABQUABQUAAAAAAwAIAgIJCAACAgIBAQAAAAMDAwAABQUFAAAFBQUAAAAAAAUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkJCQUFCQUDAAgIAgAACQkJBQUJBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQgJBQAAAAAAAAAAAAAFAAAABQAAAAAEDQ4PEAUHliaxAglpbnRxX2NvcHkAAAlpbnRxX3plcm8AAQhpbnRxX29uZQADC2ludHFfaXNaZXJvAAIHaW50cV9lcQAECGludHFfZ3RlAAUIaW50cV9hZGQABghpbnRxX3N1YgAHCGludHFfbXVsAAgLaW50cV9zcXVhcmUACQ5pbnRxX3NxdWFyZU9sZAAKCGludHFfZGl2AA0PaW50cV9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACIQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACMMZjFtX2lzU3F1YXJlACQVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQlpbnRyX2NvcHkAJQlpbnRyX3plcm8AJghpbnRyX29uZQAoC2ludHJfaXNaZXJvACcHaW50cl9lcQApCGludHJfZ3RlACoIaW50cl9hZGQAKwhpbnRyX3N1YgAsCGludHJfbXVsAC0LaW50cl9zcXVhcmUALg5pbnRyX3NxdWFyZU9sZAAvCGludHJfZGl2ADIPaW50cl9pbnZlcnNlTW9kADMIZnJtX2NvcHkAJQhmcm1femVybwAmCmZybV9pc1plcm8AJwZmcm1fZXEAKQdmcm1fYWRkADUHZnJtX3N1YgA2B2ZybV9uZWcANw5mcm1faXNOZWdhdGl2ZQA+CWZybV9pc09uZQA0CGZybV9zaWduAD8LZnJtX21SZWR1Y3QAOAdmcm1fbXVsADkKZnJtX3NxdWFyZQA6DWZybV9zcXVhcmVPbGQAOxJmcm1fZnJvbU1vbnRnb21lcnkAPRBmcm1fdG9Nb250Z29tZXJ5ADwLZnJtX2ludmVyc2UAQAdmcm1fb25lAEEIZnJtX2xvYWQAQg9mcm1fdGltZXNTY2FsYXIAQwdmcm1fZXhwAEcQZnJtX2JhdGNoSW52ZXJzZQBECGZybV9zcXJ0AEgMZnJtX2lzU3F1YXJlAEkVZnJtX2JhdGNoVG9Nb250Z29tZXJ5AEUXZnJtX2JhdGNoRnJvbU1vbnRnb21lcnkARgZmcl9hZGQANQZmcl9zdWIANgZmcl9uZWcANwZmcl9tdWwASglmcl9zcXVhcmUASwpmcl9pbnZlcnNlAEwNZnJfaXNOZWdhdGl2ZQBNB2ZyX2NvcHkAJQdmcl96ZXJvACYGZnJfb25lAEEJZnJfaXNaZXJvACcFZnJfZXEAKQxnMW1fbXVsdGlleHAAdhJnMW1fbXVsdGlleHBfY2h1bmsAdRJnMW1fbXVsdGlleHBBZmZpbmUAehhnMW1fbXVsdGlleHBBZmZpbmVfY2h1bmsAeQpnMW1faXNaZXJvAE8QZzFtX2lzWmVyb0FmZmluZQBOBmcxbV9lcQBXC2cxbV9lcU1peGVkAFYMZzFtX2VxQWZmaW5lAFUIZzFtX2NvcHkAUw5nMW1fY29weUFmZmluZQBSCGcxbV96ZXJvAFEOZzFtX3plcm9BZmZpbmUAUApnMW1fZG91YmxlAFkQZzFtX2RvdWJsZUFmZmluZQBYB2cxbV9hZGQAXAxnMW1fYWRkTWl4ZWQAWw1nMW1fYWRkQWZmaW5lAFoHZzFtX25lZwBeDWcxbV9uZWdBZmZpbmUAXQdnMW1fc3ViAGEMZzFtX3N1Yk1peGVkAGANZzFtX3N1YkFmZmluZQBfEmcxbV9mcm9tTW9udGdvbWVyeQBjGGcxbV9mcm9tTW9udGdvbWVyeUFmZmluZQBiEGcxbV90b01vbnRnb21lcnkAZRZnMW1fdG9Nb250Z29tZXJ5QWZmaW5lAGQPZzFtX3RpbWVzU2NhbGFyAHsVZzFtX3RpbWVzU2NhbGFyQWZmaW5lAHwNZzFtX25vcm1hbGl6ZQBoCmcxbV9MRU10b1UAagpnMW1fTEVNdG9DAGsKZzFtX1V0b0xFTQBsCmcxbV9DdG9MRU0AbQ9nMW1fYmF0Y2hMRU10b1UAbg9nMW1fYmF0Y2hMRU10b0MAbw9nMW1fYmF0Y2hVdG9MRU0AcA9nMW1fYmF0Y2hDdG9MRU0AcQxnMW1fdG9BZmZpbmUAZg5nMW1fdG9KYWNvYmlhbgBUEWcxbV9iYXRjaFRvQWZmaW5lAGcTZzFtX2JhdGNoVG9KYWNvYmlhbgByB2ZybV9mZnQAggEIZnJtX2lmZnQAgwEKZnJtX3Jhd2ZmdACAAQtmcm1fZmZ0Sm9pbgCEAQ5mcm1fZmZ0Sm9pbkV4dACFARFmcm1fZmZ0Sm9pbkV4dEludgCGAQpmcm1fZmZ0TWl4AIcBDGZybV9mZnRGaW5hbACIAR1mcm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgCJAQhwb2xfemVybwCKAQ9wb2xfY29uc3RydWN0TEMAiwEMcWFwX2J1aWxkQUJDAIwBC3FhcF9qb2luQUJDAI0BCmYybV9pc1plcm8AjgEJZjJtX2lzT25lAI8BCGYybV96ZXJvAJABB2YybV9vbmUAkQEIZjJtX2NvcHkAkgEHZjJtX211bACTAQhmMm1fbXVsMQCUAQpmMm1fc3F1YXJlAJUBB2YybV9hZGQAlgEHZjJtX3N1YgCXAQdmMm1fbmVnAJgBCGYybV9zaWduAJ8BDWYybV9jb25qdWdhdGUAmQESZjJtX2Zyb21Nb250Z29tZXJ5AJsBEGYybV90b01vbnRnb21lcnkAmgEGZjJtX2VxAJwBC2YybV9pbnZlcnNlAJ0BB2YybV9leHAAogEPZjJtX3RpbWVzU2NhbGFyAJ4BEGYybV9iYXRjaEludmVyc2UAoQEIZjJtX3NxcnQAowEMZjJtX2lzU3F1YXJlAKQBDmYybV9pc05lZ2F0aXZlAKABDGcybV9tdWx0aWV4cADNARJnMm1fbXVsdGlleHBfY2h1bmsAzAESZzJtX211bHRpZXhwQWZmaW5lANEBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDQAQpnMm1faXNaZXJvAKYBEGcybV9pc1plcm9BZmZpbmUApQEGZzJtX2VxAK4BC2cybV9lcU1peGVkAK0BDGcybV9lcUFmZmluZQCsAQhnMm1fY29weQCqAQ5nMm1fY29weUFmZmluZQCpAQhnMm1femVybwCoAQ5nMm1femVyb0FmZmluZQCnAQpnMm1fZG91YmxlALABEGcybV9kb3VibGVBZmZpbmUArwEHZzJtX2FkZACzAQxnMm1fYWRkTWl4ZWQAsgENZzJtX2FkZEFmZmluZQCxAQdnMm1fbmVnALUBDWcybV9uZWdBZmZpbmUAtAEHZzJtX3N1YgC4AQxnMm1fc3ViTWl4ZWQAtwENZzJtX3N1YkFmZmluZQC2ARJnMm1fZnJvbU1vbnRnb21lcnkAugEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lALkBEGcybV90b01vbnRnb21lcnkAvAEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQC7AQ9nMm1fdGltZXNTY2FsYXIA0gEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lANMBDWcybV9ub3JtYWxpemUAvwEKZzJtX0xFTXRvVQDBAQpnMm1fTEVNdG9DAMIBCmcybV9VdG9MRU0AwwEKZzJtX0N0b0xFTQDEAQ9nMm1fYmF0Y2hMRU10b1UAxQEPZzJtX2JhdGNoTEVNdG9DAMYBD2cybV9iYXRjaFV0b0xFTQDHAQ9nMm1fYmF0Y2hDdG9MRU0AyAEMZzJtX3RvQWZmaW5lAL0BDmcybV90b0phY29iaWFuAKsBEWcybV9iYXRjaFRvQWZmaW5lAL4BE2cybV9iYXRjaFRvSmFjb2JpYW4AyQELZzFtX3RpbWVzRnIA1AEHZzFtX2ZmdADaAQhnMW1faWZmdADbAQpnMW1fcmF3ZmZ0ANgBC2cxbV9mZnRKb2luANwBDmcxbV9mZnRKb2luRXh0AN0BEWcxbV9mZnRKb2luRXh0SW52AN4BCmcxbV9mZnRNaXgA3wEMZzFtX2ZmdEZpbmFsAOABHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAOEBC2cybV90aW1lc0ZyAOIBB2cybV9mZnQA6AEIZzJtX2lmZnQA6QEKZzJtX3Jhd2ZmdADmAQtnMm1fZmZ0Sm9pbgDqAQ5nMm1fZmZ0Sm9pbkV4dADrARFnMm1fZmZ0Sm9pbkV4dEludgDsAQpnMm1fZmZ0TWl4AO0BDGcybV9mZnRGaW5hbADuAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDvARFnMW1fdGltZXNGckFmZmluZQDwARFnMm1fdGltZXNGckFmZmluZQDxARFmcm1fYmF0Y2hBcHBseUtleQDyARFnMW1fYmF0Y2hBcHBseUtleQDzARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAPQBEWcybV9iYXRjaEFwcGx5S2V5APUBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA9gEKZjZtX2lzWmVybwD4AQlmNm1faXNPbmUA+QEIZjZtX3plcm8A+gEHZjZtX29uZQD7AQhmNm1fY29weQD8AQdmNm1fbXVsAP0BCmY2bV9zcXVhcmUA/gEHZjZtX2FkZAD/AQdmNm1fc3ViAIACB2Y2bV9uZWcAgQIIZjZtX3NpZ24AggISZjZtX2Zyb21Nb250Z29tZXJ5AIQCEGY2bV90b01vbnRnb21lcnkAgwIGZjZtX2VxAIUCC2Y2bV9pbnZlcnNlAIYCB2Y2bV9leHAAigIPZjZtX3RpbWVzU2NhbGFyAIcCEGY2bV9iYXRjaEludmVyc2UAiQIOZjZtX2lzTmVnYXRpdmUAiAIKZnRtX2lzWmVybwCMAglmdG1faXNPbmUAjQIIZnRtX3plcm8AjgIHZnRtX29uZQCPAghmdG1fY29weQCQAgdmdG1fbXVsAJECCGZ0bV9tdWwxAJICCmZ0bV9zcXVhcmUAkwIHZnRtX2FkZACUAgdmdG1fc3ViAJUCB2Z0bV9uZWcAlgIIZnRtX3NpZ24AnQINZnRtX2Nvbmp1Z2F0ZQCXAhJmdG1fZnJvbU1vbnRnb21lcnkAmQIQZnRtX3RvTW9udGdvbWVyeQCYAgZmdG1fZXEAmgILZnRtX2ludmVyc2UAmwIHZnRtX2V4cACgAg9mdG1fdGltZXNTY2FsYXIAnAIQZnRtX2JhdGNoSW52ZXJzZQCfAghmdG1fc3FydAChAgxmdG1faXNTcXVhcmUAogIOZnRtX2lzTmVnYXRpdmUAngIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDAApwIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDEAqAIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDIAqQIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDMAqgIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDQAqwIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDUArAIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDYArQIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDcArgIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDgArwIXYmxzMTIzODFfX2Zyb2Jlbml1c01hcDkAsAITYmxzMTIzODFfcGFpcmluZ0VxMQC6AhNibHMxMjM4MV9wYWlyaW5nRXEyALsCE2JsczEyMzgxX3BhaXJpbmdFcTMAvAITYmxzMTIzODFfcGFpcmluZ0VxNAC9AhNibHMxMjM4MV9wYWlyaW5nRXE1AL4CEGJsczEyMzgxX3BhaXJpbmcAvwISYmxzMTIzODFfcHJlcGFyZUcxALMCEmJsczEyMzgxX3ByZXBhcmVHMgC0AhNibHMxMjM4MV9taWxsZXJMb29wALUCHGJsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb24AuQIfYmxzMTIzODFfZmluYWxFeHBvbmVudGlhdGlvbk9sZAC2AhpibHMxMjM4MV9fY3ljbG90b21pY1NxdWFyZQC3AhpibHMxMjM4MV9fY3ljbG90b21pY0V4cF93MAC4AghmNm1fbXVsMQCjAglmNm1fbXVsMDEApAIKZnRtX211bDAxNAClAgqgiAXAAj4AIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoCywAIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC00AIAApAyhQBEAgACkDIFAEQCAAKQMYUARAIAApAxBQBEAgACkDCFAEQCAAKQMAUA8FQQAPCwVBAA8LBUEADwsFQQAPCwVBAA8LQQAPCywAIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC2sAIAApAyggASkDKFEEQCAAKQMgIAEpAyBRBEAgACkDGCABKQMYUQRAIAApAxAgASkDEFEEQCAAKQMIIAEpAwhRBEAgACkDACABKQMAUQ8FQQAPCwVBAA8LBUEADwsFQQAPCwVBAA8LQQAPC8UBACAAKQMoIAEpAyhUBEBBAA8FIAApAyggASkDKFYEQEEBDwUgACkDICABKQMgVARAQQAPBSAAKQMgIAEpAyBWBEBBAQ8FIAApAxggASkDGFQEQEEADwUgACkDGCABKQMYVgRAQQEPBSAAKQMQIAEpAxBUBEBBAA8FIAApAxAgASkDEFYEQEEBDwUgACkDCCABKQMIVARAQQAPBSAAKQMIIAEpAwhWBEBBAQ8FIAApAwAgASkDAFoPCwsLCwsLCwsLC0EADwu8AgEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgADUCICABNQIgfCADQiCIfCEDIAIgAz4CICAANQIkIAE1AiR8IANCIIh8IQMgAiADPgIkIAA1AiggATUCKHwgA0IgiHwhAyACIAM+AiggADUCLCABNQIsfCADQiCIfCEDIAIgAz4CLCADQiCIpwuQAwEBfiAANQIAIAE1AgB9IQMgAiADQv////8Pgz4CACAANQIEIAE1AgR9IANCIId8IQMgAiADQv////8Pgz4CBCAANQIIIAE1Agh9IANCIId8IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCAANQIgIAE1AiB9IANCIId8IQMgAiADQv////8Pgz4CICAANQIkIAE1AiR9IANCIId8IQMgAiADQv////8Pgz4CJCAANQIoIAE1Aih9IANCIId8IQMgAiADQv////8Pgz4CKCAANQIsIAE1Aix9IANCIId8IQMgAiADQv////8Pgz4CLCADQiCHpwunIhoBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAUgATUCICIWfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCICIVIAZ+fCEDIAQgA0IgiHwhBCACIAM+AiAgBEIgiCEDIARC/////w+DIAUgATUCJCIYfnwhBCADIARCIIh8IQMgBEL/////D4MgByAWfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCJCIXIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAUgATUCKCIafnwhAyAEIANCIIh8IQQgA0L/////D4MgByAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCKCIZIAZ+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIAUgATUCLCIcfnwhBCADIARCIIh8IQMgBEL/////D4MgByAafnwhBCADIARCIIh8IQMgBEL/////D4MgCSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCLCIbIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AiwgA0IgiCEEIANC/////w+DIAcgHH58IQMgBCADQiCIfCEEIANC/////w+DIAkgGn58IQMgBCADQiCIfCEEIANC/////w+DIAsgGH58IQMgBCADQiCIfCEEIANC/////w+DIA0gFn58IQMgBCADQiCIfCEEIANC/////w+DIA8gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEn58IQMgBCADQiCIfCEEIANC/////w+DIBMgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDn58IQMgBCADQiCIfCEEIANC/////w+DIBcgDH58IQMgBCADQiCIfCEEIANC/////w+DIBkgCn58IQMgBCADQiCIfCEEIANC/////w+DIBsgCH58IQMgBCADQiCIfCEEIAIgAz4CMCAEQiCIIQMgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAafnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgEyASfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAKfnwhBCADIARCIIh8IQMgAiAEPgI0IANCIIghBCADQv////8PgyALIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIAx+fCEDIAQgA0IgiHwhBCACIAM+AjggBEIgiCEDIARC/////w+DIA0gHH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gGn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgFn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgEn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgDn58IQQgAyAEQiCIfCEDIAIgBD4CPCADQiCIIQQgA0L/////D4MgDyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAafnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAQfnwhAyAEIANCIIh8IQQgAiADPgJAIARCIIghAyAEQv////8PgyARIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AkQgA0IgiCEEIANC/////w+DIBMgHH58IQMgBCADQiCIfCEEIANC/////w+DIBUgGn58IQMgBCADQiCIfCEEIANC/////w+DIBcgGH58IQMgBCADQiCIfCEEIANC/////w+DIBkgFn58IQMgBCADQiCIfCEEIANC/////w+DIBsgFH58IQMgBCADQiCIfCEEIAIgAz4CSCAEQiCIIQMgBEL/////D4MgFSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAafnwhBCADIARCIIh8IQMgBEL/////D4MgGSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAWfnwhBCADIARCIIh8IQMgAiAEPgJMIANCIIghBCADQv////8PgyAXIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIBh+fCEDIAQgA0IgiHwhBCACIAM+AlAgBEIgiCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgGn58IQQgAyAEQiCIfCEDIAIgBD4CVCADQiCIIQQgA0L/////D4MgGyAcfnwhAyAEIANCIIh8IQQgAiADPgJYIARCIIghAyACIAQ+AlwLziAQAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5CACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgYgBn58IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIEIgd+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AggiCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAcgB358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCDCIJfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIQIgp+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAIIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhQiC358IQIgAyACQiCIfCEDIAJC/////w+DIAcgCn58IQIgAyACQiCIfCEDIAJC/////w+DIAggCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCGCIMfnwhAiADIAJCIIh8IQMgAkL/////D4MgByALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCSAJfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CGCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIcIg1+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAJIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIcIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiAiDn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCJCIPfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIoIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAHIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAIIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAKIAx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyALIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIoIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiwiEX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAggD358IQIgAyACQiCIfCEDIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAggEH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgD358IQIgAyACQiCIfCEDIAJC/////w+DIAogDn58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggEX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogD358IQIgAyACQiCIfCEDIAJC/////w+DIAsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DIAsgD358IQIgAyACQiCIfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogEX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAwgD358IQIgAyACQiCIfCEDIAJC/////w+DIA0gDn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAwgEH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gD358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA4gDn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DIA4gD358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gEX58IQIgAyACQiCIfCEDIAJC/////w+DIA4gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA8gD358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA4gEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AlAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgEX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AlQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBEgEX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AlggAyEEIARCIIghBSABIAQ+AlwLCgAgACAAIAEQCAuSAgEBfiAANQAAIAF+IQMgAiADPgAAIAA1AAQgAX4gA0IgiHwhAyACIAM+AAQgADUACCABfiADQiCIfCEDIAIgAz4ACCAANQAMIAF+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NQI0IANCIIh8QfgFNQIIIAR+fCEDIAAgAz4CNCAANQI4IANCIIh8QfgFNQIMIAR+fCEDIAAgAz4COCAANQI8IANCIIh8QfgFNQIQIAR+fCEDIAAgAz4CPCAANQJAIANCIIh8QfgFNQIUIAR+fCEDIAAgAz4CQCAANQJEIANCIIh8QfgFNQIYIAR+fCEDIAAgAz4CRCAANQJIIANCIIh8QfgFNQIcIAR+fCEDIAAgAz4CSCAANQJMIANCIIh8QfgFNQIgIAR+fCEDIAAgAz4CTCAANQJQIANCIIh8QfgFNQIkIAR+fCEDIAAgAz4CUCAANQJUIANCIIh8QfgFNQIoIAR+fCEDIAAgAz4CVCAANQJYIANCIIh8QfgFNQIsIAR+fCEDIAAgAz4CWEGICiADQiCIPgIsQYgKIABBMGogARAQC6ZDMwF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL9//P/DyEFIANC/////w+DIAA1AgAiBiABNQIAIgd+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhCCADQv////8Pg0EANQL4BSIJIAh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIEIgt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgogB358IQQgAyAEQiCIfCEDIARC/////w+DQQA1AvwFIg0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEMIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AggiD358IQMgBCADQiCIfCEEIANC/////w+DIAogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiDiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCgAYiESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKEBiIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AogGIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjAYiHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQBiIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQGIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AiAiJ358IQMgBCADQiCIfCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AiAiJiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmAYiKSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DISggA0L/////D4MgCSAofnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCJCIrfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgJiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCJCIqIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcBiItIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhLCAEQv////8PgyAJICx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIoIi9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOICd+fCEDIAQgA0IgiHwhBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAmIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAqIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIoIi4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gLH58IQMgBCADQiCIfCEEIANC/////w+DIBEgKH58IQMgBCADQiCIfCEEIANC/////w+DIBUgJH58IQMgBCADQiCIfCEEIANC/////w+DIBkgIH58IQMgBCADQiCIfCEEIANC/////w+DIB0gHH58IQMgBCADQiCIfCEEIANC/////w+DICEgGH58IQMgBCADQiCIfCEEIANC/////w+DICUgFH58IQMgBCADQiCIfCEEIANC/////w+DICkgEH58IQMgBCADQiCIfCEEIANC/////w+DIC0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAGIjEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEwIANC/////w+DIAkgMH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AiwiM358IQQgAyAEQiCIfCEDIARC/////w+DIAogL358IQQgAyAEQiCIfCEDIARC/////w+DIA4gK358IQQgAyAEQiCIfCEDIARC/////w+DIBIgJ358IQQgAyAEQiCIfCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DICYgE358IQQgAyAEQiCIfCEDIARC/////w+DICogD358IQQgAyAEQiCIfCEDIARC/////w+DIC4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiwiMiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgESAsfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAofnwhBCADIARCIIh8IQMgBEL/////D4MgGSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgISAcfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgKSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpAYiNSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DITQgBEL/////D4MgCSA0fnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogM358IQMgBCADQiCIfCEEIANC/////w+DIA4gL358IQMgBCADQiCIfCEEIANC/////w+DIBIgK358IQMgBCADQiCIfCEEIANC/////w+DIBYgJ358IQMgBCADQiCIfCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DICYgF358IQMgBCADQiCIfCEEIANC/////w+DICogE358IQMgBCADQiCIfCEEIANC/////w+DIC4gD358IQMgBCADQiCIfCEEIANC/////w+DIDIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gNH58IQMgBCADQiCIfCEEIANC/////w+DIBEgMH58IQMgBCADQiCIfCEEIANC/////w+DIBUgLH58IQMgBCADQiCIfCEEIANC/////w+DIBkgKH58IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIANC/////w+DICkgGH58IQMgBCADQiCIfCEEIANC/////w+DIC0gFH58IQMgBCADQiCIfCEEIANC/////w+DIDEgEH58IQMgBCADQiCIfCEEIANC/////w+DIDUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgFiArfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgJiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgLiATfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESA0fnwhBCADIARCIIh8IQMgBEL/////D4MgFSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAsfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAofnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgKSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeICd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAmIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAqIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAyIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdICx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhICh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCADQv////8PgyApICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAtIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAxIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgM358IQQgAyAEQiCIfCEDIARC/////w+DIBogL358IQQgAyAEQiCIfCEDIARC/////w+DIB4gK358IQQgAyAEQiCIfCEDIARC/////w+DICIgJ358IQQgAyAEQiCIfCEDIARC/////w+DICYgI358IQQgAyAEQiCIfCEDIARC/////w+DICogH358IQQgAyAEQiCIfCEDIARC/////w+DIC4gG358IQQgAyAEQiCIfCEDIARC/////w+DIDIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgNH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gMH58IQQgAyAEQiCIfCEDIARC/////w+DICEgLH58IQQgAyAEQiCIfCEDIARC/////w+DICUgKH58IQQgAyAEQiCIfCEDIARC/////w+DICkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIC0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIDEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgMiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgISAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1ICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgM358IQMgBCADQiCIfCEEIANC/////w+DICYgL358IQMgBCADQiCIfCEEIANC/////w+DICogK358IQMgBCADQiCIfCEEIANC/////w+DIC4gJ358IQMgBCADQiCIfCEEIANC/////w+DIDIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgNH58IQMgBCADQiCIfCEEIANC/////w+DICkgMH58IQMgBCADQiCIfCEEIANC/////w+DIC0gLH58IQMgBCADQiCIfCEEIANC/////w+DIDEgKH58IQMgBCADQiCIfCEEIANC/////w+DIDUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgJiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgLiArfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgKSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgLSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAsfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAofnwhBCADIARCIIh8IQMgAiAEPgIcIANCIIghBCADQv////8PgyAqIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAyICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAtIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAxIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyA1ICx+fCEDIAQgA0IgiHwhBCACIAM+AiAgBEIgiCEDIARC/////w+DIC4gM358IQQgAyAEQiCIfCEDIARC/////w+DIDIgL358IQQgAyAEQiCIfCEDIARC/////w+DIDEgNH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgMH58IQQgAyAEQiCIfCEDIAIgBD4CJCADQiCIIQQgA0L/////D4MgMiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSA0fnwhAyAEIANCIIh8IQQgAiADPgIoIARCIIghAyACIAQ+AiwgA6cEQCACQfgFIAIQBxoFIAJB+AUQBQRAIAJB+AUgAhAHGgsLC81BKQF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/f/z/w8hBkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQggAkL/////D4NBADUC+AUiCSAIfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCBCIKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DQQA1AvwFIgwgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyELIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AggiDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKABiIPIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhDiACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIMIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUChAYiEiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIREgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCECITfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gDn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AogGIhUgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEUIAJC/////w+DIAkgFH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhQiFn58IQIgAyACQiCIfCEDIAJC/////w+DIAogE358IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8PgyASIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAVIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKMBiIYIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFyACQv////8PgyAJIBd+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIYIhl+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyANIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkAYiGyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRogAkL/////D4MgCSAafnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCHCIcfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgECATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgGn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gF358IQIgAyACQiCIfCEDIAJC/////w+DIBIgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBggDn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQGIh4gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEdIAJC/////w+DIAkgHX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiAiH358IQIgAyACQiCIfCEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYBiIhIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhICACQv////8PgyAJICB+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIkIiJ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIB9+fCECIAMgAkIgiHwhAyACQv////8PgyANIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBl+fCECIAMgAkIgiHwhAyACQv////8PgyATIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgISALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnAYiJCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DISMgAkL/////D4MgCSAjfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCKCIlfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAffnwhAiADIAJCIIh8IQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgI358IQIgAyACQiCIfCEDIAJC/////w+DIA8gIH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAJC/////w+DICEgDn58IQIgAyACQiCIfCEDIAJC/////w+DICQgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAGIicgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEmIAJC/////w+DIAkgJn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiwiKH58IQIgAyACQiCIfCEDIAJC/////w+DIAogJX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gIn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgH358IQIgAyACQiCIfCEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMICZ+fCECIAMgAkIgiHwhAyACQv////8PgyAPICN+fCECIAMgAkIgiHwhAyACQv////8PgyASICB+fCECIAMgAkIgiHwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAhIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAkIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAnIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkBiIqIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhKSACQv////8PgyAJICl+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAofnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAifnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAffnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgKX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gJn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgI358IQIgAyACQiCIfCEDIAJC/////w+DIBUgIH58IQIgAyACQiCIfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAJC/////w+DICEgFH58IQIgAyACQiCIfCEDIAJC/////w+DICQgEX58IQIgAyACQiCIfCEDIAJC/////w+DICcgDn58IQIgAyACQiCIfCEDIAJC/////w+DICogC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAofnwhAiADIAJCIIh8IQMgAkL/////D4MgECAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAifnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAffnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gKX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgJn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgI358IQIgAyACQiCIfCEDIAJC/////w+DIBggIH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgHX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gGn58IQIgAyACQiCIfCEDIAJC/////w+DICEgF358IQIgAyACQiCIfCEDIAJC/////w+DICQgFH58IQIgAyACQiCIfCEDIAJC/////w+DICcgEX58IQIgAyACQiCIfCEDIAJC/////w+DICogDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAofnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAffnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHCAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgKX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgJn58IQIgAyACQiCIfCEDIAJC/////w+DIBggI358IQIgAyACQiCIfCEDIAJC/////w+DIBsgIH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gHX58IQIgAyACQiCIfCEDIAJC/////w+DICEgGn58IQIgAyACQiCIfCEDIAJC/////w+DICQgF358IQIgAyACQiCIfCEDIAJC/////w+DICcgFH58IQIgAyACQiCIfCEDIAJC/////w+DICogEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAofnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAifnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAffnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgKX58IQIgAyACQiCIfCEDIAJC/////w+DIBggJn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgI358IQIgAyACQiCIfCEDIAJC/////w+DIB4gIH58IQIgAyACQiCIfCEDIAJC/////w+DICEgHX58IQIgAyACQiCIfCEDIAJC/////w+DICQgGn58IQIgAyACQiCIfCEDIAJC/////w+DICcgF358IQIgAyACQiCIfCEDIAJC/////w+DICogFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAofnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAifnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHyAffnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggKX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgJn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gI358IQIgAyACQiCIfCEDIAJC/////w+DICEgIH58IQIgAyACQiCIfCEDIAJC/////w+DICQgHX58IQIgAyACQiCIfCEDIAJC/////w+DICcgGn58IQIgAyACQiCIfCEDIAJC/////w+DICogF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAofnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgHyAifnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgKX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gJn58IQIgAyACQiCIfCEDIAJC/////w+DICEgI358IQIgAyACQiCIfCEDIAJC/////w+DICQgIH58IQIgAyACQiCIfCEDIAJC/////w+DICcgHX58IQIgAyACQiCIfCEDIAJC/////w+DICogGn58IQIgAyACQiCIfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgHCAofnwhAiADIAJCIIh8IQMgAkL/////D4MgHyAlfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgIiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIB4gKX58IQIgAyACQiCIfCEDIAJC/////w+DICEgJn58IQIgAyACQiCIfCEDIAJC/////w+DICQgI358IQIgAyACQiCIfCEDIAJC/////w+DICcgIH58IQIgAyACQiCIfCEDIAJC/////w+DICogHX58IQIgAyACQiCIfCEDIAEgAj4CGCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgHyAofnwhAiADIAJCIIh8IQMgAkL/////D4MgIiAlfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DICEgKX58IQIgAyACQiCIfCEDIAJC/////w+DICQgJn58IQIgAyACQiCIfCEDIAJC/////w+DICcgI358IQIgAyACQiCIfCEDIAJC/////w+DICogIH58IQIgAyACQiCIfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgIiAofnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgJSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DICQgKX58IQIgAyACQiCIfCEDIAJC/////w+DICcgJn58IQIgAyACQiCIfCEDIAJC/////w+DICogI358IQIgAyACQiCIfCEDIAEgAj4CICADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgJSAofnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DICcgKX58IQIgAyAC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ASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLC0EADwvUAQEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgA0IgiKcLjAIBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgA0Igh6cLjxASAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyALIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyARIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAx+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIAIgBD4CLCADQiCIIQQgA0L/////D4MgDyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESASfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAQfnwhAyAEIANCIIh8IQQgAiADPgIwIARCIIghAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AjQgA0IgiCEEIANC/////w+DIBMgFH58IQMgBCADQiCIfCEEIAIgAz4COCAEQiCIIQMgAiAEPgI8C4wSDAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiBiAGfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgQiB358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCCCIIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIMIgl+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhAiCn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAggCH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCFCILfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIYIgx+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAJIAl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhwiDX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAggC358IQIgAyACQiCIfCEDIAJC/////w+DIAkgCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAogDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAsgC358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBSABIAQ+AjwLCgAgACAAIAEQLQu2AQEBfiAANQAAIAF+IQMgAiADPgAAIAA1AAQgAX4gA0IgiHwhAyACIAM+AAQgADUACCABfiADQiCIfCEDIAIgAz4ACCAANQAMIAF+IANCIIh8IQMgAiADPgAMIAA1ABAgAX4gA0IgiHwhAyACIAM+ABAgADUAFCABfiADQiCIfCEDIAIgAz4AFCAANQAYIAF+IANCIIh8IQMgAiADPgAYIAA1ABwgAX4gA0IgiHwhAyACIAM+ABwLTgIBfgF/IAAhAyADNQAAIAF8IQIgAyACPgAAIAJCIIghAgJAA0AgAlANASADQQRqIQMgAzUAACACfCECIAMgAj4AACACQiCIIQIMAAsLC7ACBwF/AX8BfwF/AX4BfgF/IAIEQCACIQUFQZgZIQULIAMEQCADIQQFQbgZIQQLIAAgBBAlIAFB+BgQJSAFECZB2BkQJkEfIQZBHyEHAkADQEH4GCAHai0AACAHQQNGcg0BIAdBAWshBwwACwtB+BggB2pBA2s1AABCAXwhCCAIQgFRBEBCAEIAgBoLAkADQAJAA0AgBCAGai0AACAG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PgI0IAA1AjggA0IgiHxBuBw1AhwgBH58IQMgACADPgI4QZgfIANCIIg+AhxBmB8gAEEgaiABEDULvh8jAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL/////DyEFIANC/////w+DIAA1AgAiBiABNQIAIgd+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhCCADQv////8Pg0EANQK4HCIJIAh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIEIgt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgogB358IQQgAyAEQiCIfCEDIARC/////w+DQQA1ArwcIg0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEMIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AggiD358IQMgBCADQiCIfCEEIANC/////w+DIAogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiDiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCwBwiESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLEHCIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AsgcIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCzBwiHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLQHCIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtQcIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAKICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIA4gI358IQQgAyAEQiCIfCEDIARC/////w+DIBIgH358IQQgAyAEQiCIfCEDIARC/////w+DIBYgG358IQQgAyAEQiCIfCEDIARC/////w+DIBogF358IQQgAyAEQiCIfCEDIARC/////w+DIB4gE358IQQgAyAEQiCIfCEDIARC/////w+DICIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgEiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAWICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIAIgBD4CHCADpwRAIAJBuBwgAhAsGgUgAkG4HBAqBEAgAkG4HCACECwaCwsLuyEdAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL/////DyEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQK4HCIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUCvBwiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AsAcIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLEHCISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCyBwiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AswcIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLQHCIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC1BwiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBMgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBYgFn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyASIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBF+fCECIAMgAkIgiHwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBYgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBkgGX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAYIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBd+fCECIAMgAkIgiHwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBkgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAbIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBp+fCECIAMgAkIgiHwhAyABIAI+AhQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBwgHH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAeIB1+fCECIAMgAkIgiHwhAyABIAI+AhggAyEEIARCIIghBSABIAQ+AhwgBacEQCABQbgcIAEQLBoFIAFBuBwQKgRAIAFBuBwgARAsGgsLCwoAIAAgACABEDkLCwAgAEH4HCABEDkLFQAgAEGYIxAlQbgjECZBmCMgARA4CxEAIABB2CMQPUHYI0H4HRAqCyQAIAAQJwRAQQAPCyAAQfgjED1B+CNB+B0QKgRAQX8PC0EBDwsXACAAIAEQPSABQbgcIAEQMyABIAEQPAsJAEGYHSAAECULywEEAX8BfwF/AX8gAhAmQSAhBSAAIQMCQANAIAUgAUsNASAFQSBGBEBBmCQQQQVBmCRB+BxBmCQQOQsgA0GYJEG4JBA5IAJBuCQgAhA1IANBIGohAyAFQSBqIQUMAAsLIAFBIHAhBCAERQRADwtBuCQQJkEAIQYCQANAIAYgBEYNASAGIAMtAAA6ALgkIANBAWohAyAGQQFqIQYMAAsLIAVBIEYEQEGYJBBBBUGYJEH4HEGYJBA5C0G4JEGYJEG4JBA5IAJBuCQgAhA1CxwAIAEgAkHYJBBCQdgkQdgkEDwgAEHYJCADEDkL+AEEAX8BfwF/AX9BACgCACEFQQAgBSACQQFqQSBsajYCACAFEEEgACEGIAVBIGohBUEAIQgCQANAIAggAkYNASAGECcEQCAFQSBrIAUQJQUgBiAFQSBrIAUQOQsgBiABaiEGIAVBIGohBSAIQQFqIQgMAAsLIAYgAWshBiAFQSBrIQUgAyACQQFrIARsaiEHIAUgBRBAAkADQCAIRQ0BIAYQJwRAIAUgBUEgaxAlIAcQJgUgBUEga0H4JBAlIAUgBiAFQSBrEDkgBUH4JCAHEDkLIAYgAWshBiAHIARrIQcgBUEgayEFIAhBAWshCAwACwtBACAFNgIACz4DAX8BfwF/IAAhBCACIQVBACEDAkADQCADIAFGDQEgBCAFEDwgBEEgaiEEIAVBIGohBSADQQFqIQMMAAsLCz4DAX8BfwF/IAAhBCACIQVBACEDAkADQCADIAFGDQEgBCAFED0gBEEgaiEEIAVBIGohBSADQQFqIQMMAAsLC7ICAgF/AX8gAkUEQCADEEEPCyAAQZglECUgAxBBIAIhBAJAA0AgBEEBayEEIAEgBGotAAAhBSADIAMQOiAFQYABTwRAIAVBgAFrIQUgA0GYJSADEDkLIAMgAxA6IAVBwABPBEAgBUHAAGshBSADQZglIAMQOQsgAyADEDogBUEgTwRAIAVBIGshBSADQZglIAMQOQsgAyADEDogBUEQTwRAIAVBEGshBSADQZglIAMQOQsgAyADEDogBUEITwRAIAVBCGshBSADQZglIAMQOQsgAyADEDogBUEETwRAIAVBBGshBSADQZglIAMQOQsgAyADEDogBUECTwRAIAVBAmshBSADQZglIAMQOQsgAyADEDogBUEBTwRAIAVBAWshBSADQZglIAMQOQsgBEUNAQwACwsL3gEDAX8BfwF/IAAQJwRAIAEQJg8LQSAhAkHYHkG4JRAlIABBuB5BIEHYJRBHIABB+B5BIEH4JRBHAkADQEHYJUGYHRApDQFB2CVBmCYQOkEBIQMCQANAQZgmQZgdECkNAUGYJkGYJhA6IANBAWohAwwACwtBuCVBuCYQJSACIANrQQFrIQQCQANAIARFDQFBuCZBuCYQOiAEQQFrIQQMAAsLIAMhAkG4JkG4JRA6QdglQbglQdglEDlB+CVBuCZB+CUQOQwACwtB+CUQPgRAQfglIAEQNwVB+CUgARAlCwsgACAAECcEQEEBDwsgAEHYHUEgQdgmEEdB2CZBmB0QKQsVACAAIAFB+CYQOUH4JkH4HCACEDkLCgAgACAAIAEQSgsLACAAQbgcIAEQMwsJACAAQfgdECoLDgAgABACIABBMGoQAnELCgAgAEHgAGoQAgsNACAAEAEgAEEwahABCxUAIAAQASAAQTBqEBwgAEHgAGoQAQt6ACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3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kwEgA0HIiQFByIwBEJMBIABB4ABqQciMAUGojQEQkwEgAUHgAGpB6IsBQYiOARCTAUGoigFBiIsBEJwBBEBBqI0BQYiOARCcAQRAQQEPCwtBAA8LrAIAIAAQpQEEQCAAIAEQqwEPCyAAQeiOARCVASAAQeAAakHIjwEQlQFByI8BQaiQARCVASAAQciPAUGIkQEQlgFBiJEBQYiRARCVAUGIkQFB6I4BQYiRARCXAUGIkQFBqJABQYiRARCXAUGIkQFBiJEBQYiRARCWAUHojgFB6I4BQeiRARCWAUHokQFB6I4BQeiRARCWASAAQeAAaiAAQeAAaiABQcABahCWAUHokQEgARCVASABQYiRASABEJcBIAFBiJEBIAEQlwFBqJABQaiQAUHIkgEQlgFByJIBQciSAUHIkgEQlgFByJIBQciSAUHIkgEQlgFBiJEBIAEgAUHgAGoQlwEgAUHgAGpB6JEBIAFB4ABqEJMBIAFB4ABqQciSASABQeAAahCXAQvUAgAgABCmAQRAIAAgARCqAQ8LIABBwAFqEI8BBEAgACABEK8BDw8LIABBqJMBEJUBIABB4ABqQYiUARCVAUGIlAFB6JQBEJUBIABBiJQBQciVARCWAUHIlQFByJUBEJUBQciVAUGokwFByJUBEJcBQciVAUHolAFByJUBEJcBQciVAUHIlQFByJUBEJYBQaiTAUGokwFBqJYBEJYBQaiWAUGokwFBqJYBEJYBQaiWAUGIlwEQlQEgAEHgAGogAEHAAWpB6JcBEJMBQciVAUHIlQEgARCWAUGIlwEgASABEJcBQeiUAUHolAFByJgBEJYBQciYAUHImAFByJgBEJYBQciYAUHImAFByJgBEJYBQciVASABIAFB4ABqEJcBIAFB4ABqQaiWASABQeAAahCTASABQeAAakHImAEgAUHgAGoQlwFB6JcBQeiXASABQcABahCWAQvsAgEBfyAAQcABaiEDIAAQpQEEQCABIAIQqQEgAkHAAWoQkQEPCyABEKUBBEAgACACEKkBIAJBwAFqEJEBDwsgACABEJwBBEAgAEHgAGogAUHgAGoQnAEEQCABIAIQrwEPCwsgASAAQaiZARCXASABQeAAaiAAQeAAakHomgEQlwFBqJkBQYiaARCVAUGImgFBiJoBQcibARCWAUHImwFByJsBQcibARCWAUGomQFByJsBQaicARCTAUHomgFB6JoBQYidARCWASAAQcibAUHIngEQkwFBiJ0BQeidARCVAUHIngFByJ4BQaifARCWAUHonQFBqJwBIAIQlwEgAkGonwEgAhCXASAAQeAAakGonAFBiKABEJMBQYigAUGIoAFBiKABEJYBQcieASACIAJB4ABqEJcBIAJB4ABqQYidASACQeAAahCTASACQeAAakGIoAEgAkHgAGoQlwFBqJkBQaiZASACQcABahCWAQvcAwEBfyAAQcABaiEDIAAQpgEEQCABIAIQqQEgAkHAAWoQkQEPCyABEKUBBEAgACACEKoBDwsgAxCPAQRAIAAgASACELEBDwsgA0HooAEQlQEgAUHooAFByKEBEJMBIANB6KABQaiiARCTASABQeAAakGoogFBiKMBEJMBIABByKEBEJwBBEAgAEHgAGpBiKMBEJwBBEAgASACEK8BDwsLQcihASAAQeijARCXAUGIowEgAEHgAGpBqKUBEJcBQeijAUHIpAEQlQFByKQBQcikAUGIpgEQlgFBiKYBQYimAUGIpgEQlgFB6KMBQYimAUHopgEQkwFBqKUBQailAUHIpwEQlgEgAEGIpgFBiKkBEJMBQcinAUGoqAEQlQFBiKkBQYipAUHoqQEQlgFBqKgBQeimASACEJcBIAJB6KkBIAIQlwEgAEHgAGpB6KYBQciqARCTAUHIqgFByKoBQciqARCWAUGIqQEgAiACQeAAahCXASACQeAAakHIpwEgAkHgAGoQkwEgAkHgAGpByKoBIAJB4ABqEJcBIANB6KMBIAJBwAFqEJYBIAJBwAFqIAJBwAFqEJUBIAJBwAFqQeigASACQcABahCXASACQcABakHIpAEgAkHAAWoQlwELpQQCAX8BfyAAQcABaiEDIAFBwAFqIQQgABCmAQRAIAEgAhCqAQ8LIAEQpgEEQCAAIAIQqgEPCyADEI8BBEAgASAAIAIQsgEPCyAEEI8BBEAgACABIAIQsgEPCyADQairARCVASAEQYisARCVASAAQYisAUHorAEQkwEgAUGoqwFByK0BEJMBIANBqKsBQaiuARCTASAEQYisAUGIrwEQkwEgAEHgAGpBiK8BQeivARCTASABQeAAakGorgFByLABEJMBQeisAUHIrQEQnAEEQEHorwFByLABEJwBBEAgACACELABDwsLQcitAUHorAFBqLEBEJcBQciwAUHorwFBiLIBEJcBQaixAUGosQFB6LIBEJYBQeiyAUHosgEQlQFBqLEBQeiyAUHIswEQkwFBiLIBQYiyAUGotAEQlgFB6KwBQeiyAUHotQEQkwFBqLQBQYi1ARCVAUHotQFB6LUBQci2ARCWAUGItQFByLMBIAIQlwEgAkHItgEgAhCXAUHorwFByLMBQai3ARCTAUGotwFBqLcBQai3ARCWAUHotQEgAiACQeAAahCXASACQeAAakGotAEgAkHgAGoQkwEgAkHgAGpBqLcBIAJB4ABqEJcBIAMgBCACQcABahCWASACQcABaiACQcABahCVASACQcABakGoqwEgAkHAAWoQlwEgAkHAAWpBiKwBIAJBwAFqEJcBIAJBwAFqQaixASACQcABahCTAQsYACAAIAEQkgEgAEHgAGogAUHgAGoQmAELJwAgACABEJIBIABB4ABqIAFB4ABqEJgBIABBwAFqIAFBwAFqEJIBCxYAIAFBiLgBELQBIABBiLgBIAIQsQELFgAgAUGougEQtAEgAEGougEgAhCyAQsWACABQci8ARC1ASAAQci8ASACELMBCxgAIAAgARCbASAAQeAAaiABQeAAahCbAQsnACAAIAEQmwEgAEHgAGogAUHgAGoQmwEgAEHAAWogAUHAAWoQmwELGAAgACABEJoBIABB4ABqIAFB4ABqEJoBCycAIAAgARCaASAAQeAAaiABQeAAahCaASAAQcABaiABQcABahCaAQteACAAEKYBBEAgARCQASABQeAAahCQAQUgAEHAAWpB6L4BEJ0BQei+AUHIvwEQlQFB6L4BQci/AUGowAEQkwEgAEHIvwEgARCTASAAQeAAakGowAEgAUHgAGoQkwELC74BBQF/AX8BfwF/AX9BACgCACEDQQAgAyABQeAAbGo2AgAgAEHAAWpBoAIgASADQeAAEKEBIAAhBCADIQUgAiEGQQAhBwJAA0AgByABRg0BIAUQjgEEQCAGEJABIAZB4ABqEJABBSAFIARB4ABqQYjBARCTASAFIAUQlQEgBSAEIAYQkwEgBUGIwQEgBkHgAGoQkwELIARBoAJqIQQgBkHAAWohBiAFQeAAaiEFIAdBAWohBwwACwtBACADNgIAC14AIAAQpgEEQCABEKgBBSAAQcABakHowQEQnQFB6MEBQcjCARCVAUHowQFByMIBQajDARCTASAAQcjCASABEJMBIABB4ABqQajDASABQeAAahCTASABQcABahCRAQsLOwIBfwF/IAIgAWpBAWshAyAAIQQCQANAIAMgAkgNASADIAQtAAA6AAAgA0EBayEDIARBAWohBAwACwsLPQAgABClAQRAIAEQpwEgAUHAADoAAA8LIABBiMQBELkBQYjEAUHgACABEMABQejEAUHgACABQeAAahDAAQtKACAAEKYBBEAgARCQASABQcAAOgAADwsgAEHIxQEQmwFByMUBQeAAIAEQwAEgAEHgAGoQnwFBf0YEQCABIAEtAABBgAFyOgAACws5ACAALQAAQcAAcQRAIAEQpwEPCyAAQeAAQajGARDAASAAQeAAakHgAEGIxwEQwAFBqMYBIAEQuwEL2QECAX8BfyAALQAAIQIgAkHAAHEEQCABEKcBDwsgAkGAAXEhAyAAQcjIARCSAUHIyAEgAkE/cToAAEHIyAFB4ABB6McBEMABQejHASABEJoBIAFByMgBEJUBIAFByMgBQcjIARCTAUHIyAFBiIUBQcjIARCWAUHIyAFByMgBEKMBQcjIAUHoxwEQmAFByMgBEJ8BQX9GBEAgAwRAQcjIASABQeAAahCSAQVByMgBIAFB4ABqEJgBCwUgAwRAQcjIASABQeAAahCYAQVByMgBIAFB4ABqEJIBCwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQwQEgBEHAAWohBCAFQcABaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQwgEgBEHAAWohBCAFQeAAaiEFIANBAWohAwwACwsLQQMBfwF/AX8gACEEIAIhBUEAIQMCQANAIAMgAUYNASAEIAUQwwEgBEHAAWohBCAFQcABaiEFIANBAWohAwwACwsLVQMBfwF/AX8gACABQQFrQeAAbGohBCACIAFBAWtBwAFsaiEFQQAhAwJAA0AgAyABRg0BIAQgBRDEASAEQeAAayEEIAVBwAFrIQUgA0EBaiEDDAALCwtVAwF/AX8BfyAAIAFBAWtBwAFsaiEEIAIgAUEBa0GgAmxqIQVBACEDAkADQCADIAFGDQEgBCAFEKsBIARBwAFrIQQgBUGgAmsh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FCABQTBqIABBMGpBiNMDEBQgAUHgAGogAEG40wMQFCABQZABaiAAQejTAxAUIAIgAUHAAWpBuNMDQdjSAyACEKUCC2wAIABBmPYEIAEQkwEgAEHgAGpB+PYEIAFB4ABqEJMBIABBwAFqQdj3BCABQcABahCTASAAQaACakG4+AQgAUGgAmoQkwEgAEGAA2pBmPkEIAFBgANqEJMBIABB4ANqQfj5BCABQeADahCTAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHY+gQgARCTASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpBuPsEIAFB4ABqEJMBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGY/AQgAUHAAWoQkwEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQfj8BCABQaACahCTASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB2P0EIAFBgANqEJMBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakG4/gQgAUHgA2oQkwELbAAgAEGY/wQgARCTASAAQeAAakH4/wQgAUHgAGoQkwEgAEHAAWpB2IAFIAFBwAFqEJMBIABBoAJqQbiBBSABQaACahCTASAAQYADakGYggUgAUGAA2oQkwEgAEHgA2pB+IIFIAFB4ANqEJMBC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQdiDBSABEJMBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakG4hAUgAUHgAGoQkwEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQZiFBSABQcABahCTASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpB+IUFIAFBoAJqEJMBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakHYhgUgAUGAA2oQkwEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQbiHBSABQeADahCTAQtsACAAQZiIBSABEJMBIABB4ABqQfiIBSABQeAAahCTASAAQcABakHYiQUgAUHAAWoQkwEgAEGgAmpBuIoFIAFBoAJqEJMBIABBgANqQZiLBSABQYADahCTASAAQeADakH4iwUgAUHgA2oQkwELigIAIAAgARAAIABBMGogAUEwahASIAFB2IwFIAEQkwEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQbiNBSABQeAAahCTASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpBmI4FIAFBwAFqEJMBIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiABQaACakH4jgUgAUGgAmoQkwEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahASIAFBgANqQdiPBSABQYADahCTASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBIgAUHgA2pBuJAFIAFB4ANqEJMBC2wAIABBmJEFIAEQkwEgAEHgAGpB+JEFIAFB4ABqEJMBIABBwAFqQdiSBSABQcABahCTASAAQaACakG4kwUgAUGgAmoQkwEgAEGAA2pBmJQFIAFBgANqEJMBIABB4ANqQfiUBSABQeADahCTAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUHYlQUgARCTASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpBuJYFIAFB4ABqEJMBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakGYlwUgAUHAAWoQkwEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQfiXBSABQaACahCTASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pB2JgFIAFBgANqEJMBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakG4mQUgAUHgA2oQkwELbAAgAEGYmgUgARCTASAAQeAAakH4mgUgAUHgAGoQkwEgAEHAAWpB2JsFIAFBwAFqEJMBIABBoAJqQbicBSABQaACahCTASAAQYADakGYnQUgAUGAA2oQkwEgAEHgA2pB+J0FIAFB4ANqEJMBC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQdieBSABEJMBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakG4nwUgAUHgAGoQkwEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQZig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AAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAABBuN4AC6AIyf///zYAAAA3PFoAW8NBAtuW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";
            var pq$1 = 760;
            var pr$1 = 3640;
            var pG1gen$1 = 41768;
            var pG1zero$1 = 41912;
            var pG1b$1 = 5016;
            var pG2gen$1 = 42056;
            var pG2zero$1 = 42344;
            var pG2b$1 = 17032;
            var pOneT$1 = 42632;
            var prePSize$1 = 288;
            var preQSize$1 = 20448;
            var n8q$1 = 48;
            var n8r$1 = 32;
            var q$1 = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
            var r$1 = "52435875175126190479447740508185965837690552500527637822603658699938581184513";

var bls12381_wasm = {
	code: code$1,
	pq: pq$1,
	pr: pr$1,
	pG1gen: pG1gen$1,
	pG1zero: pG1zero$1,
	pG1b: pG1b$1,
	pG2gen: pG2gen$1,
	pG2zero: pG2zero$1,
	pG2b: pG2b$1,
	pOneT: pOneT$1,
	prePSize: prePSize$1,
	preQSize: preQSize$1,
	n8q: n8q$1,
	n8r: n8r$1,
	q: q$1,
	r: r$1
};

/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

// module.exports.buildF1 = require("./src/f1.js");
// module.exports.buildBn128 = require("./src/bn128.js");
// module.exports.buildMnt6753 = require("./src/mnt6753.js");

var bn128_wasm$1 = bn128_wasm;
var bls12381_wasm$1 = bls12381_wasm;
// module.exports.mnt6753_wasm = require("./build/mnt6753_wasm.js");

var wasmcurves = {
	bn128_wasm: bn128_wasm$1,
	bls12381_wasm: bls12381_wasm$1
};

/* global BigInt */

function stringifyBigInts(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int(buff) {
    let res = 0n;
    let i = buff.length;
    let offset = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i>0) {
        if (i >= 4) {
            i -= 4;
            res += BigInt(buffV.getUint32(i)) << BigInt(offset*8);
            offset += 4;
        } else if (i >= 2) {
            i -= 2;
            res += BigInt(buffV.getUint16(i)) << BigInt(offset*8);
            offset += 2;
        } else {
            i -= 1;
            res += BigInt(buffV.getUint8(i)) << BigInt(offset*8);
            offset += 1;
        }
    }
    return res;
}

function beInt2Buff(n, len) {
    let r = n;
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = len;
    while (o > 0) {
        if (o-4 >= 0) {
            o -= 4;
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn));
            r = r >> 32n;
        } else if (o-2 >= 0) {
            o -= 2;
            buffV.setUint16(o, Number(r & 0xFFFFn));
            r = r >> 16n;
        } else {
            o -= 1;
            buffV.setUint8(o, Number(r & 0xFFn));
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int(buff) {
    let res = 0n;
    let i = 0;
    const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    while (i<buff.length) {
        if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint32(i, true)) << BigInt( i*8);
            i += 4;
        } else if (i + 4 <= buff.length) {
            res += BigInt(buffV.getUint16(i, true)) << BigInt( i*8);
            i += 2;
        } else {
            res += BigInt(buffV.getUint8(i, true)) << BigInt( i*8);
            i += 1;
        }
    }
    return res;
}

function leInt2Buff(n, len) {
    let r = n;
    if (typeof len === "undefined") {
        len = Math.floor((bitLength$2(n) - 1) / 8) +1;
        if (len==0) len = 1;
    }
    const buff = new Uint8Array(len);
    const buffV = new DataView(buff.buffer);
    let o = 0;
    while (o < len) {
        if (o+4 <= len) {
            buffV.setUint32(o, Number(r & 0xFFFFFFFFn), true );
            o += 4;
            r = r >> 32n;
        } else if (o+2 <= len) {
            buffV.setUint16(Number(o, r & 0xFFFFn), true );
            o += 2;
            r = r >> 16n;
        } else {
            buffV.setUint8(Number(o, r & 0xFFn), true );
            o += 1;
            r = r >> 8n;
        }
    }
    if (r) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_native = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts,
    unstringifyBigInts: unstringifyBigInts,
    beBuff2int: beBuff2int,
    beInt2Buff: beInt2Buff,
    leBuff2int: leBuff2int,
    leInt2Buff: leInt2Buff
});

function stringifyBigInts$1(o) {
    if ((typeof(o) == "bigint") || o.eq !== undefined)  {
        return o.toString(10);
    } else if (Array.isArray(o)) {
        return o.map(stringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = stringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function unstringifyBigInts$1(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInteger(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts$1);
    } else if (typeof o == "object") {
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts$1(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

function beBuff2int$1(buff) {
    let res = BigInteger.zero;
    for (let i=0; i<buff.length; i++) {
        const n = BigInteger(buff[buff.length - i - 1]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function beInt2Buff$1(n, len) {
    let r = n;
    let o =len-1;
    const buff = new Uint8Array(len);
    while ((r.gt(BigInteger.zero))&&(o>=0)) {
        let c = Number(r.and(BigInteger("255")));
        buff[o] = c;
        o--;
        r = r.shiftRight(8);
    }
    if (!r.eq(BigInteger.zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}


function leBuff2int$1 (buff) {
    let res = BigInteger.zero;
    for (let i=0; i<buff.length; i++) {
        const n = BigInteger(buff[i]);
        res = res.add(n.shiftLeft(i*8));
    }
    return res;
}

function leInt2Buff$1(n, len) {
    let r = n;
    let o =0;
    const buff = new Uint8Array(len);
    while ((r.gt(BigInteger.zero))&&(o<buff.length)) {
        let c = Number(r.and(BigInteger(255)));
        buff[o] = c;
        o++;
        r = r.shiftRight(8);
    }
    if (!r.eq(BigInteger.zero)) {
        throw new Error("Number does not fit in this length");
    }
    return buff;
}

var utils_bigint = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringifyBigInts: stringifyBigInts$1,
    unstringifyBigInts: unstringifyBigInts$1,
    beBuff2int: beBuff2int$1,
    beInt2Buff: beInt2Buff$1,
    leBuff2int: leBuff2int$1,
    leInt2Buff: leInt2Buff$1
});

let utils = {};

const supportsNativeBigInt$2 = typeof BigInt === "function";
if (supportsNativeBigInt$2) {
    Object.assign(utils, utils_native);
} else {
    Object.assign(utils, utils_bigint);
}


const _revTable$1 = [];
for (let i=0; i<256; i++) {
    _revTable$1[i] = _revSlow$1(i, 8);
}

function _revSlow$1(idx, bits) {
    let res =0;
    let a = idx;
    for (let i=0; i<bits; i++) {
        res <<= 1;
        res = res | (a &1);
        a >>=1;
    }
    return res;
}

utils.bitReverse = function bitReverse(idx, bits) {
    return (
        _revTable$1[idx >>> 24] |
        (_revTable$1[(idx >>> 16) & 0xFF] << 8) |
        (_revTable$1[(idx >>> 8) & 0xFF] << 16) |
        (_revTable$1[idx & 0xFF] << 24)
    ) >>> (32-bits);
};


utils.log2 = function log2( V )
{
    return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
};

utils.buffReverseBits = function buffReverseBits(buff, eSize) {
    const n = buff.byteLength /eSize;
    const bits = utils.log2(n);
    if (n != (1 << bits)) {
        throw new Error("Invalid number of pointers");
    }
    for (let i=0; i<n; i++) {
        const r = utils.bitReverse(i,bits);
        if (i>r) {
            const tmp = buff.slice(i*eSize, (i+1)*eSize);
            buff.set( buff.slice(r*eSize, (r+1)*eSize), i*eSize);
            buff.set(tmp, r*eSize);
        }
    }
};

let {
    bitReverse,
    log2: log2$1,
    buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2,
} = utils;

var _utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bitReverse: bitReverse,
    log2: log2$1,
    buffReverseBits: buffReverseBits,
    stringifyBigInts: stringifyBigInts$2,
    unstringifyBigInts: unstringifyBigInts$2,
    beBuff2int: beBuff2int$2,
    beInt2Buff: beInt2Buff$2,
    leBuff2int: leBuff2int$2,
    leInt2Buff: leInt2Buff$2
});

const PAGE_SIZE = 1<<28;

class BigBuffer {

    constructor(size) {
        this.buffers = [];
        this.byteLength = size;
        for (let i=0; i<size; i+= PAGE_SIZE) {
            const n = Math.min(size-i, PAGE_SIZE);
            this.buffers.push(new Uint8Array(n));
        }

    }

    slice(fr, to) {
        if (typeof to == "undefined") to = this.byteLength;
        if (typeof fr == "undefined") fr = 0;
        const len = to-fr;

        const firstPage = Math.floor(fr / PAGE_SIZE);

        let buff;

        if (len <= PAGE_SIZE) {
            buff = new Uint8Array(len);
        } else {
            buff = new BigBuffer(len);
        }
        let p = firstPage;
        let o = fr % PAGE_SIZE;
        // Remaining bytes to read
        let r = len;
        while (r>0) {
            // bytes to copy from this page
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = new Uint8Array(this.buffers[p].buffer, o, l);
            buff.set(srcView, len-r);
            r = r-l;
            p ++;
            o = 0;
        }

        return buff;
    }

    set(buff, offset) {
        if (typeof offset == "undefined") offset = 0;

        const firstPage = Math.floor(offset / PAGE_SIZE);

        let p = firstPage;
        let o = offset % PAGE_SIZE;
        let r = buff.byteLength;
        while (r>0) {
            const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
            const srcView = buff.slice( buff.byteLength -r, buff.byteLength -r+l);
            const dstView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l);
            dstView.set(srcView);
            r = r-l;
            p ++;
            o = 0;
        }

    }
}

function buildBatchConvert(tm, fnName, sIn, sOut) {
    return async function batchConvert(buffIn) {
        const nPoints = Math.floor(buffIn.byteLength / sIn);
        if ( nPoints * sIn !== buffIn.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
            const task = [
                {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                {cmd: "ALLOC", var: 1, len:sOut * n},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: n},
                    {var: 1}
                ]},
                {cmd: "GET", out: 0, var: 1, len:sOut * n},
            ];
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buffIn instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

class WasmField1 {

    constructor(tm, prefix, n8, p) {
        this.tm = tm;
        this.prefix = prefix;

        this.p = p;
        this.n8 = n8;
        this.type = "F1";
        this.m = 1;

        this.half = shiftRight$2(p, one);
        this.bitLength = bitLength$2(p);
        this.mask = sub$2(shiftLeft$2(one, this.bitLength), one);

        this.pOp1 = tm.alloc(n8);
        this.pOp2 = tm.alloc(n8);
        this.pOp3 = tm.alloc(n8);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = this.tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.n64 = Math.floor(n8/8);
        this.n32 = Math.floor(n8/4);

        if(this.n64*8 != this.n8) {
            throw new Error("n8 must be a multiple of 8");
        }

        this.half = shiftRight$2(this.p, one);
        this.nqr = this.two;
        let r = this.exp(this.nqr, this.half);
        while (!this.eq(r, this.negone)) {
            this.nqr = this.add(this.nqr, this.one);
            r = this.exp(this.nqr, this.half);
        }

        this.shift = this.mul(this.nqr, this.nqr);
        this.shiftInv = this.inv(this.shift);

        this.s = 0;
        let t = sub$2(this.p, one);

        while ( !isOdd$2(t) ) {
            this.s = this.s + 1;
            t = shiftRight$2(t, one);
        }

        this.w = [];
        this.w[this.s] = this.exp(this.nqr, t);

        for (let i= this.s-1; i>=0; i--) {
            this.w[i] = this.square(this.w[i+1]);
        }

        if (!this.eq(this.w[0], this.one)) {
            throw new Error("Error calculating roots of unity");
        }

        this.batchToMontgomery = buildBatchConvert(tm, prefix + "_batchToMontgomery", this.n8, this.n8);
        this.batchFromMontgomery = buildBatchConvert(tm, prefix + "_batchFromMontgomery", this.n8, this.n8);
    }


    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        let ra = e$2(a, b);
        if (isNegative$2(ra)) {
            ra = neg$2(ra);
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
            ra = sub$2(this.p, ra);
        } else {
            if (gt$2(ra, this.p)) {
                ra = mod$2(ra, this.p);
            }
        }
        const buff = leInt2Buff$2(ra, this.n8);
        return this.toMontgomery(buff);
    }

    toString(a, radix) {
        const an = this.fromMontgomery(a);
        const s = fromRprLE(an, 0);
        return toString(s, radix);
    }

    fromRng(rng) {
        let v;
        const buff = new Uint8Array(this.n8);
        do {
            v = zero;
            for (let i=0; i<this.n64; i++) {
                v = add$2(v,  shiftLeft$2(rng.nextU64(), 64*i));
            }
            v = band$2(v, this.mask);
        } while (geq$2(v, this.p));
        toRprLE(buff, 0, v, this.n8);
        return buff;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const an = this.fromMontgomery(a);
        return fromRprLE(an, 0);
    }

    fromObject(a) {
        const buff = new Uint8Array(this.n8);
        toRprLE(buff, 0, a, this.n8);
        return this.toMontgomery(buff);
    }

    toRprLE(buff, offset, a) {
        buff.set(this.fromMontgomery(a), offset);
    }

    fromRprLE(buff, offset) {
        const res = buff.slice(offset, offset + this.n8);
        return this.toMontgomery(res);
    }


}

class WasmField2 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F2";
        this.m = F.m * 2;
        this.n8 = this.F.n8*2;
        this.n32 = this.F.n32*2;
        this.n64 = this.F.n64*2;

        this.pOp1 = tm.alloc(F.n8*2);
        this.pOp2 = tm.alloc(F.n8*2);
        this.pOp3 = tm.alloc(F.n8*2);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 2)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const res = new Uint8Array(this.F.n8*2);
            res.set(c1);
            res.set(c2, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F2");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8), radix);
        return `[${s1}, ${s2}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*2);
        res.set(c1);
        res.set(c2, this.F.n8);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        return [c1, c2];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*2);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        return buff;
    }

}

class WasmField3 {

    constructor(tm, prefix, F) {
        this.tm = tm;
        this.prefix = prefix;

        this.F = F;
        this.type = "F3";
        this.m = F.m * 3;
        this.n8 = this.F.n8*3;
        this.n32 = this.F.n32*3;
        this.n64 = this.F.n64*3;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = tm.getBuff(this.pOp1, this.n8);
        this.tm.instance.exports[prefix + "_one"](this.pOp1);
        this.one = tm.getBuff(this.pOp1, this.n8);

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op2Bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }


    eq(a,b) {
        return this.op2Bool("_eq", a, b);
    }

    isZero(a) {
        return this.op1Bool("_isZero", a);
    }

    add(a,b) {
        return this.op2("_add", a, b);
    }

    sub(a,b) {
        return this.op2("_sub", a, b);
    }

    neg(a) {
        return this.op1("_neg", a);
    }

    inv(a) {
        return this.op1("_inverse", a);
    }

    isNegative(a) {
        return this.op1Bool("_isNegative", a);
    }

    toMontgomery(a) {
        return this.op1("_toMontgomery", a);
    }

    fromMontgomery(a) {
        return this.op1("_fromMontgomery", a);
    }

    mul(a,b) {
        return this.op2("_mul", a, b);
    }

    div(a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
        this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.n8);
    }

    square(a) {
        return this.op1("_square", a);
    }

    isSquare(a) {
        return this.op1Bool("_isSquare", a);
    }

    sqrt(a) {
        return this.op1("_sqrt", a);
    }

    exp(a, b) {
        if (!(b instanceof Uint8Array)) {
            b = toLEBuff(e$2(b));
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
        return this.getBuff(this.pOp3, this.n8);
    }

    e(a, b) {
        if (a instanceof Uint8Array) return a;
        if ((Array.isArray(a)) && (a.length == 3)) {
            const c1 = this.F.e(a[0], b);
            const c2 = this.F.e(a[1], b);
            const c3 = this.F.e(a[2], b);
            const res = new Uint8Array(this.F.n8*3);
            res.set(c1);
            res.set(c2, this.F.n8);
            res.set(c3, this.F.n8*2);
            return res;
        } else {
            throw new Error("invalid F3");
        }
    }

    toString(a, radix) {
        const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
        const s2 = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
        const s3 = this.F.toString(a.slice(this.F.n8*2), radix);
        return `[${s1}, ${s2}, ${s3}]`;
    }

    fromRng(rng) {
        const c1 = this.F.fromRng(rng);
        const c2 = this.F.fromRng(rng);
        const c3 = this.F.fromRng(rng);
        const res = new Uint8Array(this.F.n8*3);
        res.set(c1);
        res.set(c2, this.F.n8);
        res.set(c3, this.F.n8*2);
        return res;
    }

    random() {
        return this.fromRng(getThreadRng());
    }

    toObject(a) {
        const c1 = this.F.toObject(a.slice(0, this.F.n8));
        const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        const c3 = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        return [c1, c2, c3];
    }

    fromObject(a) {
        const buff = new Uint8Array(this.F.n8*3);
        const b1 = this.F.fromObject(a[0]);
        const b2 = this.F.fromObject(a[1]);
        const b3 = this.F.fromObject(a[2]);
        buff.set(b1);
        buff.set(b2, this.F.n8);
        buff.set(b3, this.F.n8*2);
        return buff;
    }

}

class WasmCurve {

    constructor(tm, prefix, F, pGen, pGb, cofactor) {
        this.tm = tm;
        this.prefix = prefix;
        this.F = F;

        this.pOp1 = tm.alloc(F.n8*3);
        this.pOp2 = tm.alloc(F.n8*3);
        this.pOp3 = tm.alloc(F.n8*3);
        this.tm.instance.exports[prefix + "_zero"](this.pOp1);
        this.zero = this.tm.getBuff(this.pOp1, F.n8*3);
        this.tm.instance.exports[prefix + "_zeroAffine"](this.pOp1);
        this.zeroAffine = this.tm.getBuff(this.pOp1, F.n8*2);
        this.one = this.tm.getBuff(pGen, F.n8*3);
        this.g = this.one;
        this.oneAffine = this.tm.getBuff(pGen, F.n8*2);
        this.gAffine = this.oneAffine;
        this.b = this.tm.getBuff(pGb, F.n8);

        if (cofactor) {
            this.cofactor = toLEBuff(cofactor);
        }

        this.negone = this.neg(this.one);
        this.two = this.add(this.one, this.one);

        this.batchLEMtoC = buildBatchConvert(tm, prefix + "_batchLEMtoC", F.n8*2, F.n8);
        this.batchLEMtoU = buildBatchConvert(tm, prefix + "_batchLEMtoU", F.n8*2, F.n8*2);
        this.batchCtoLEM = buildBatchConvert(tm, prefix + "_batchCtoLEM", F.n8, F.n8*2);
        this.batchUtoLEM = buildBatchConvert(tm, prefix + "_batchUtoLEM", F.n8*2, F.n8*2);
        this.batchToJacobian = buildBatchConvert(tm, prefix + "_batchToJacobian", F.n8*2, F.n8*3);
        this.batchToAffine = buildBatchConvert(tm, prefix + "_batchToAffine", F.n8*3, F.n8*2);
    }

    op2(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op2bool(opName, a, b) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, b);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
    }

    op1(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    op1Affine(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*2);
    }

    op1Bool(opName, a) {
        this.tm.setBuff(this.pOp1, a);
        return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
    }

    add(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_add", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_addMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_addAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    sub(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_sub", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2("_subMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2("_subAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    neg(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_neg", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Affine("_negAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    double(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1("_double", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_doubleAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    isZero(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Bool("_isZero", a);
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1Bool("_isZeroAffine", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    timesScalar(a, s) {
        if (!(s instanceof Uint8Array)) {
            s = toLEBuff(e$2(s));
        }
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesScalar";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesScalarAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, s.byteLength, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    timesFr(a, s) {
        let fnName;
        if (a.byteLength == this.F.n8*3) {
            fnName = this.prefix + "_timesFr";
        } else if (a.byteLength == this.F.n8*2) {
            fnName = this.prefix + "_timesFrAffine";
        } else {
            throw new Error("invalid point size");
        }
        this.tm.setBuff(this.pOp1, a);
        this.tm.setBuff(this.pOp2, s);
        this.tm.instance.exports[fnName](this.pOp1, this.pOp2, this.pOp3);
        return this.tm.getBuff(this.pOp3, this.F.n8*3);
    }

    eq(a,b) {
        if (a.byteLength == this.F.n8*3) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eq", a, b);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqMixed", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else if (a.byteLength == this.F.n8*2) {
            if (b.byteLength == this.F.n8*3) {
                return this.op2bool("_eqMixed", b, a);
            } else if (b.byteLength == this.F.n8*2) {
                return this.op2bool("_eqAffine", a, b);
            } else {
                throw new Error("invalid point size");
            }
        } else {
            throw new Error("invalid point size");
        }
    }

    toAffine(a) {
        if (a.byteLength == this.F.n8*3) {
            return this.op1Affine("_toAffine", a);
        } else if (a.byteLength == this.F.n8*2) {
            return a;
        } else {
            throw new Error("invalid point size");
        }
    }

    toJacobian(a) {
        if (a.byteLength == this.F.n8*3) {
            return a;
        } else if (a.byteLength == this.F.n8*2) {
            return this.op1("_toJacobian", a);
        } else {
            throw new Error("invalid point size");
        }
    }

    toRprUncompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoU"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
        arr.set(res, offset);
    }

    fromRprUncompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8*2);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_UtoLEM"](this.pOp1, this.pOp1);
        return this.tm.getBuff(this.pOp1, this.F.n8*2);
    }

    toRprCompressed(arr, offset, a) {
        this.tm.setBuff(this.pOp1, a);
        if (a.byteLength == this.F.n8*3) {
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
        } else if (a.byteLength != this.F.n8*2) {
            throw new Error("invalid point size");
        }
        this.tm.instance.exports[this.prefix + "_LEMtoC"](this.pOp1, this.pOp1);
        const res = this.tm.getBuff(this.pOp1, this.F.n8);
        arr.set(res, offset);
    }

    fromRprCompressed(arr, offset) {
        const buff = arr.slice(offset, offset + this.F.n8);
        this.tm.setBuff(this.pOp1, buff);
        this.tm.instance.exports[this.prefix + "_CtoLEM"](this.pOp1, this.pOp2);
        return this.tm.getBuff(this.pOp2, this.F.n8*2);
    }

    toUncompressed(a) {
        const buff = new Uint8Array(this.F.n8*2);
        this.toRprUncompressed(buff, 0, a);
        return buff;
    }

    toRprLEM(arr, offset, a) {
        if (a.byteLength == this.F.n8*2) {
            arr.set(a, offset);
            return;
        } else if (a.byteLength == this.F.n8*3) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
            const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
            arr.set(res, offset);
        } else {
            throw new Error("invalid point size");
        }
    }

    fromRprLEM(arr, offset) {
        offset = offset || 0;
        return arr.slice(offset, offset+this.F.n8*2);
    }

    toString(a, radix) {
        if (a.byteLength == this.F.n8*3) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
            const z = this.F.toString(a.slice(this.F.n8*2), radix);
            return `[ ${x}, ${y}, ${z} ]`;
        } else if (a.byteLength == this.F.n8*2) {
            const x = this.F.toString(a.slice(0, this.F.n8), radix);
            const y = this.F.toString(a.slice(this.F.n8), radix);
            return `[ ${x}, ${y} ]`;
        } else {
            throw new Error("invalid point size");
        }
    }


    fromRng(rng) {
        const F = this.F;
        let P = [];
        let greatest;
        let x3b;
        do {
            P[0] = F.fromRng(rng);
            greatest = rng.nextBool();
            x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
        } while (!F.isSquare(x3b));

        P[1] = F.sqrt(x3b);

        const s = F.isNegative(P[1]);
        if (greatest ^ s) P[1] = F.neg(P[1]);

        let Pbuff = new Uint8Array(this.F.n8*2);
        Pbuff.set(P[0]);
        Pbuff.set(P[1], this.F.n8);

        if (this.cofactor) {
            Pbuff = this.timesScalar(Pbuff, this.cofactor);
        }

        return Pbuff;
    }



    toObject(a) {
        if (this.isZero(a)) {
            return [
                this.F.toObject(this.F.zero),
                this.F.toObject(this.F.one),
                this.F.toObject(this.F.zero),
            ];
        }
        const x = this.F.toObject(a.slice(0, this.F.n8));
        const y = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
        let z;
        if (a.byteLength == this.F.n8*3) {
            z = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
        } else {
            z = this.F.toObject(this.F.one);
        }
        return [x, y, z];
    }

    fromObject(a) {
        const x = this.F.fromObject(a[0]);
        const y = this.F.fromObject(a[1]);
        let z;
        if (a.length==3) {
            z = this.F.fromObject(a[2]);
        } else {
            z = this.F.one;
        }
        if (this.F.isZero(z, this.F.one)) {
            return this.zeroAffine;
        } else if (this.F.eq(z, this.F.one)) {
            const buff = new Uint8Array(this.F.n8*2);
            buff.set(x);
            buff.set(y, this.F.n8);
            return buff;
        } else {
            const buff = new Uint8Array(this.F.n8*3);
            buff.set(x);
            buff.set(y, this.F.n8);
            buff.set(z, this.F.n8*2);
            return buff;
        }
    }

    e(a) {
        if (a instanceof Uint8Array) return a;
        return this.fromObject(a);
    }

}

/* global WebAssembly */

function thread(self) {
    let instance;
    let memory;

    if (self) {
        self.onmessage = function(e) {
            let data;
            if (e.data) {
                data = e.data;
            } else {
                data = e;
            }

            if (data[0].cmd == "INIT") {
                init(data[0]).then(function() {
                    self.postMessage(data.result);
                });
            } else if (data[0].cmd == "TERMINATE") {
                process.exit();
            } else {
                const res = runTask(data);
                self.postMessage(res);
            }
        };
    }

    async function init(data) {
        const code = new Uint8Array(data.code);
        const wasmModule = await WebAssembly.compile(code);
        memory = new WebAssembly.Memory({initial:data.init, maximum: 32767});

        instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            }
        });
    }



    function alloc(length) {
        const u32 = new Uint32Array(memory.buffer, 0, 1);
        while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
        const res = u32[0];
        u32[0] += length;
        if (u32[0] + length > memory.buffer.byteLength) {
            const currentPages = memory.buffer.byteLength / 0x10000;
            let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;
            if (requiredPages>32767) requiredPages=32767;
            memory.grow(requiredPages-currentPages);
        }
        return res;
    }

    function allocBuffer(buffer) {
        const p = alloc(buffer.byteLength);
        setBuffer(p, buffer);
        return p;
    }

    function getBuffer(pointer, length) {
        const u8 = new Uint8Array(memory.buffer);
        return new Uint8Array(u8.buffer, u8.byteOffset + pointer, length);
    }

    function setBuffer(pointer, buffer) {
        const u8 = new Uint8Array(memory.buffer);
        u8.set(new Uint8Array(buffer), pointer);
    }

    function runTask(task) {
        if (task[0].cmd == "INIT") {
            return init(task[0]);
        }
        const ctx = {
            vars: [],
            out: []
        };
        const u32a = new Uint32Array(memory.buffer, 0, 1);
        const oldAlloc = u32a[0];
        for (let i=0; i<task.length; i++) {
            switch (task[i].cmd) {
            case "ALLOCSET":
                ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                break;
            case "ALLOC":
                ctx.vars[task[i].var] = alloc(task[i].len);
                break;
            case "SET":
                setBuffer(ctx.vars[task[i].var], task[i].buff);
                break;
            case "CALL": {
                const params = [];
                for (let j=0; j<task[i].params.length; j++) {
                    const p = task[i].params[j];
                    if (typeof p.var !== "undefined") {
                        params.push(ctx.vars[p.var] + (p.offset || 0));
                    } else if (typeof p.val != "undefined") {
                        params.push(p.val);
                    }
                }
                instance.exports[task[i].fnName](...params);
                break;
            }
            case "GET":
                ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
                break;
            default:
                throw new Error("Invalid cmd");
            }
        }
        const u32b = new Uint32Array(memory.buffer, 0, 1);
        u32b[0] = oldAlloc;
        return ctx.out;
    }


    return runTask;
}

/* global window, navigator, Blob, Worker, WebAssembly */
/*
    Copyright 2019 0KIMS association.

    This file is part of wasmsnark (Web Assembly zkSnark Prover).

    wasmsnark is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    wasmsnark is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
*/

const MEM_SIZE = 1000;  // Memory size in 64K Pakes (512Mb)
const inBrowser = (typeof window !== "undefined");
let NodeWorker;
if (!inBrowser) {
    NodeWorker = NodeWorker_mod.Worker;
}

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function base64ToArrayBuffer(base64) {
    if (process.browser) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    } else {
        return new Uint8Array(Buffer.from(base64, "base64"));
    }
}




async function buildThreadManager(wasm, singleThread) {
    const tm = new ThreadManager();

    tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
    tm.u8 = new Uint8Array(tm.memory.buffer);
    tm.u32 = new Uint32Array(tm.memory.buffer);

    const wasmModule = await WebAssembly.compile(base64ToArrayBuffer(wasm.code));

    tm.instance = await WebAssembly.instantiate(wasmModule, {
        env: {
            "memory": tm.memory
        }
    });

    tm.singleThread = singleThread;
    tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
    tm.pq = wasm.pq;
    tm.pr = wasm.pr;
    tm.pG1gen = wasm.pG1gen;
    tm.pG1zero = wasm.pG1zero;
    tm.pG2gen = wasm.pG2gen;
    tm.pG2zero = wasm.pG2zero;
    tm.pOneT = wasm.pOneT;

    //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
    //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);


    if (singleThread) {
        tm.code = base64ToArrayBuffer(wasm.code);
        tm.taskManager = thread();
        await tm.taskManager([{
            cmd: "INIT",
            init: MEM_SIZE,
            code: tm.code.slice()
        }]);
        tm.concurrency  = 1;
    } else {
        tm.workers = [];
        tm.pendingDeferreds = [];
        tm.working = [];

        let concurrency;

        if ((typeof(navigator) === "object") && navigator.hardwareConcurrency) {
            concurrency = navigator.hardwareConcurrency;
        } else {
            concurrency = os.cpus().length;
        }
        tm.concurrency = concurrency;

        for (let i = 0; i<concurrency; i++) {

            if (inBrowser) {
                const blob = new Blob(["(", thread.toString(), ")(self);"], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);

                tm.workers[i] = new Worker(url);

                tm.workers[i].onmessage = getOnMsg(i);

            } else {
                tm.workers[i] = new NodeWorker("(" + thread.toString()+ ")(require('worker_threads').parentPort);", {eval: true});

                tm.workers[i].on("message", getOnMsg(i));
            }

            tm.working[i]=false;
        }

        const initPromises = [];
        for (let i=0; i<tm.workers.length;i++) {
            const copyCode = base64ToArrayBuffer(wasm.code).slice();
            initPromises.push(tm.postAction(i, [{
                cmd: "INIT",
                init: MEM_SIZE,
                code: copyCode
            }], [copyCode.buffer]));
        }

        await Promise.all(initPromises);

    }
    return tm;

    function getOnMsg(i) {
        return function(e) {
            let data;
            if ((e)&&(e.data)) {
                data = e.data;
            } else {
                data = e;
            }

            tm.working[i]=false;
            tm.pendingDeferreds[i].resolve(data);
            tm.processWorks();
        };
    }

}

class ThreadManager {
    constructor() {
        this.actionQueue = [];
        this.oldPFree = 0;
    }

    startSyncOp() {
        if (this.oldPFree != 0) throw new Error("Sync operation in progress");
        this.oldPFree = this.u32[0];
    }

    endSyncOp() {
        if (this.oldPFree == 0) throw new Error("No sync operation in progress");
        this.u32[0] = this.oldPFree;
        this.oldPFree = 0;
    }

    postAction(workerId, e, transfers, _deferred) {
        if (this.working[workerId]) {
            throw new Error("Posting a job t a working worker");
        }
        this.working[workerId] = true;

        this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
        this.workers[workerId].postMessage(e, transfers);

        return this.pendingDeferreds[workerId].promise;
    }

    processWorks() {
        for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
            if (this.working[i] == false) {
                const work = this.actionQueue.shift();
                this.postAction(i, work.data, work.transfers, work.deferred);
            }
        }
    }

    queueAction(actionData, transfers) {
        const d = new Deferred();

        if (this.singleThread) {
            const res = this.taskManager(actionData);
            d.resolve(res);
        } else {
            this.actionQueue.push({
                data: actionData,
                transfers: transfers,
                deferred: d
            });
            this.processWorks();
        }
        return d.promise;
    }

    resetMemory() {
        this.u32[0] = this.initalPFree;
    }

    allocBuff(buff) {
        const pointer = this.alloc(buff.byteLength);
        this.setBuff(pointer, buff);
        return pointer;
    }

    getBuff(pointer, length) {
        return this.u8.slice(pointer, pointer+ length);
    }

    setBuff(pointer, buffer) {
        this.u8.set(new Uint8Array(buffer), pointer);
    }

    alloc(length) {
        while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
        const res = this.u32[0];
        this.u32[0] += length;
        return res;
    }

    async terminate() {
        for (let i=0; i<this.workers.length; i++) {
            this.workers[i].postMessage([{cmd: "TERMINATE"}]);
        }
        await sleep(200);
    }

}

function buildBatchApplyKey(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = curve.tm;

    curve[groupName].batchApplyKey = async function(buff, first, inc, inType, outType) {
        inType = inType || "affine";
        outType = outType || "affine";
        let fnName, fnAffine;
        let sGin, sGmid, sGout;
        if (groupName == "G1") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g1m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g1m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g1m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "G2") {
            if (inType == "jacobian") {
                sGin = G.F.n8*3;
                fnName = "g2m_batchApplyKey";
            } else {
                sGin = G.F.n8*2;
                fnName = "g2m_batchApplyKeyMixed";
            }
            sGmid = G.F.n8*3;
            if (outType == "jacobian") {
                sGout = G.F.n8*3;
            } else {
                fnAffine = "g2m_batchToAffine";
                sGout = G.F.n8*2;
            }
        } else if (groupName == "Fr") {
            fnName = "frm_batchApplyKey";
            sGin = G.n8;
            sGmid = G.n8;
            sGout = G.n8;
        } else {
            throw new Error("Invalid group: " + groupName);
        }
        const nPoints = Math.floor(buff.byteLength / sGin);
        const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
        const opPromises = [];
        inc = Fr.e(inc);
        let t = Fr.e(first);
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;

            const task = [];

            task.push({
                cmd: "ALLOCSET",
                var: 0,
                buff: buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin)
            });
            task.push({cmd: "ALLOCSET", var: 1, buff: t});
            task.push({cmd: "ALLOCSET", var: 2, buff: inc});
            task.push({cmd: "ALLOC", var: 3, len: n*Math.max(sGmid, sGout)});
            task.push({
                cmd: "CALL",
                fnName: fnName,
                params: [
                    {var: 0},
                    {val: n},
                    {var: 1},
                    {var: 2},
                    {var:3}
                ]
            });
            if (fnAffine) {
                task.push({
                    cmd: "CALL",
                    fnName: fnAffine,
                    params: [
                        {var: 3},
                        {val: n},
                        {var: 3},
                    ]
                });
            }
            task.push({cmd: "GET", out: 0, var: 3, len: n*sGout});

            opPromises.push(tm.queueAction(task));
            t = Fr.mul(t, Fr.exp(inc, n));
        }

        const result = await Promise.all(opPromises);

        const outBuff = new Uint8Array(nPoints*sGout);
        let p=0;
        for (let i=0; i<result.length; i++) {
            outBuff.set(result[i][0], p);
            p += result[i][0].byteLength;
        }

        return outBuff;
    };
}

function buildPairing(curve) {
    const tm = curve.tm;
    curve.pairing = function pairing(a, b) {

        tm.startSyncOp();
        const pA = tm.allocBuff(curve.G1.toJacobian(a));
        const pB = tm.allocBuff(curve.G2.toJacobian(b));
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);

        const res = tm.getBuff(pRes, curve.Gt.n8);

        tm.endSyncOp();
        return res;
    };

    curve.pairingEq = async function pairingEq() {
        let  buffCt;
        let nEqs;
        if ((arguments.length % 2) == 1) {
            buffCt = arguments[arguments.length-1];
            nEqs = (arguments.length -1) /2;
        } else {
            buffCt = curve.Gt.one;
            nEqs = arguments.length /2;
        }

        const opPromises = [];
        for (let i=0; i<nEqs; i++) {

            const task = [];

            const g1Buff = curve.G1.toJacobian(arguments[i*2]);
            task.push({cmd: "ALLOCSET", var: 0, buff: g1Buff});
            task.push({cmd: "ALLOC", var: 1, len: curve.prePSize});

            const g2Buff = curve.G2.toJacobian(arguments[i*2 +1]);
            task.push({cmd: "ALLOCSET", var: 2, buff: g2Buff});
            task.push({cmd: "ALLOC", var: 3, len: curve.preQSize});

            task.push({cmd: "ALLOC", var: 4, len: curve.Gt.n8});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG1", params: [
                {var: 0},
                {var: 1}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_prepareG2", params: [
                {var: 2},
                {var: 3}
            ]});

            task.push({cmd: "CALL", fnName: curve.name + "_millerLoop", params: [
                {var: 1},
                {var: 3},
                {var: 4}
            ]});

            task.push({cmd: "GET", out: 0, var: 4, len: curve.Gt.n8});

            opPromises.push(
                tm.queueAction(task)
            );
        }


        const result = await Promise.all(opPromises);

        tm.startSyncOp();
        const pRes = tm.alloc(curve.Gt.n8);
        tm.instance.exports.ftm_one(pRes);

        for (let i=0; i<result.length; i++) {
            const pMR = tm.allocBuff(result[i][0]);
            tm.instance.exports.ftm_mul(pRes, pMR, pRes);
        }
        tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);

        const pCt = tm.allocBuff(buffCt);

        const r = !!tm.instance.exports.ftm_eq(pRes, pCt);

        tm.endSyncOp();

        return r;
    };

    curve.prepareG1 = function(p) {
        this.tm.startSyncOp();
        const pP = this.tm.allocBuff(p);
        const pPrepP = this.tm.alloc(this.prePSize);
        this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
        const res = this.tm.getBuff(pPrepP, this.prePSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.prepareG2 = function(q) {
        this.tm.startSyncOp();
        const pQ = this.tm.allocBuff(q);
        const pPrepQ = this.tm.alloc(this.preQSize);
        this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
        const res = this.tm.getBuff(pPrepQ, this.preQSize);
        this.tm.endSyncOp();
        return res;
    };

    curve.millerLoop = function(preP, preQ) {
        this.tm.startSyncOp();
        const pPreP = this.tm.allocBuff(preP);
        const pPreQ = this.tm.allocBuff(preQ);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

    curve.finalExponentiation = function(a) {
        this.tm.startSyncOp();
        const pA = this.tm.allocBuff(a);
        const pRes = this.tm.alloc(this.Gt.n8);
        this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
        const res = this.tm.getBuff(pRes, this.Gt.n8);
        this.tm.endSyncOp();
        return res;
    };

}

const pTSizes = [
    1 ,  1,  1,  1,    2,  3,  4,  5,
    6 ,  7,  7,  8,    9, 10, 11, 12,
    13, 13, 14, 15,   16, 16, 17, 17,
    17, 17, 17, 17,   17, 17, 17, 17
];

function buildMultiexp(curve, groupName) {
    const G = curve[groupName];
    const tm = G.tm;
    async function _multiExpChunk(buffBases, buffScalars, inType) {
        inType = inType || "affine";

        let sGIn;
        let fnName;
        if (groupName == "G1") {
            if (inType == "affine") {
                fnName = "g1m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g1m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                fnName = "g2m_multiexpAffine_chunk";
                sGIn = G.F.n8*2;
            } else {
                fnName = "g2m_multiexp_chunk";
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }
        const nPoints = Math.floor(buffBases.byteLength / sGIn);

        if (nPoints == 0) return G.zero;
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [
                {cmd: "ALLOCSET", var: 0, buff: buffBases},
                {cmd: "ALLOCSET", var: 1, buff: buffScalars},
                {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                {cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: sScalar},
                    {val: nPoints},
                    {val: i*bitChunkSize},
                    {val: Math.min(sScalar*8 - i*bitChunkSize, bitChunkSize)},
                    {var: 2}
                ]},
                {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
            ];
            opPromises.push(
                G.tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            if (!G.isZero(res)) {
                for (let j=0; j<bitChunkSize; j++) res = G.double(res);
            }
            res = G.add(res, result[i][0]);
        }

        return res;
    }

    async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
        const MAX_CHUNK_SIZE = 1 << 22;
        const MIN_CHUNK_SIZE = 1 << 10;
        let sGIn;

        if (groupName == "G1") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sGIn = G.F.n8*2;
            } else {
                sGIn = G.F.n8*3;
            }
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buffBases.byteLength / sGIn);
        const sScalar = Math.floor(buffScalars.byteLength / nPoints);
        if( sScalar * nPoints != buffScalars.byteLength) {
            throw new Error("Scalar size does not match");
        }

        const bitChunkSize = pTSizes[log2$1(nPoints)];
        const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

        let chunkSize;
        chunkSize = Math.floor(nPoints / (tm.concurrency /nChunks));
        if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
        if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

        const opPromises = [];
        for (let i=0; i<nPoints; i += chunkSize) {
            if (logger) logger.debug(`Multiexp: ${logText}: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, chunkSize);
            const buffBasesChunk = await buffBases.slice(i*sGIn, (i+n)*sGIn);
            const buffScalarsChunk = await buffScalars.slice(i*sScalar, (i+n)*sScalar);
            opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType));
        }

        const result = await Promise.all(opPromises);

        let res = G.zero;
        for (let i=result.length-1; i>=0; i--) {
            res = G.add(res, result[i]);
        }

        return res;
    }

    G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
    };
    G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
        return await _multiExp(buffBases, buffScalars, "affine", logger, logText);
    };
}

function buildFFT(curve, groupName) {
    const G = curve[groupName];
    const Fr = curve.Fr;
    const tm = G.tm;
    async function _fft(buff, inverse, inType, outType, logger, loggerTxt) {

        inType = inType || "affine";
        outType = outType || "affine";
        const MAX_BITS_THREAD = 14;

        let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g1m_fftFinal";
            }
            fnFFTJoin = "g1m_fftJoin";
            fnFFTMix = "g1m_fftMix";

            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g1m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }

        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            if (inverse) {
                fnFFTFinal = "g2m_fftFinal";
            }
            fnFFTJoin = "g2m_fftJoin";
            fnFFTMix = "g2m_fftMix";
            if (outType == "affine") {
                sOut = G.F.n8*2;
                fnMid2Out = "g2m_batchToAffine";
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = G.n8;
            sMid = G.n8;
            sOut = G.n8;
            if (inverse) {
                fnFFTFinal = "frm_fftFinal";
            }
            fnFFTMix = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        }


        let returnArray = false;
        if (Array.isArray(buff)) {
            buff = curve.array2buffer(buff, sIn);
            returnArray = true;
        }

        const nPoints = buff.byteLength / sIn;
        const bits = log2$1(nPoints);

        if  ((1 << bits) != nPoints) {
            throw new Error("fft must be multiple of 2" );
        }

        if (bits == Fr.s +1) {
            let buffOut;

            if (inverse) {
                buffOut =  await _fftExtInv(buff, inType, outType, logger, loggerTxt);
            } else {
                buffOut =  await _fftExt(buff, inType, outType, logger, loggerTxt);
            }

            if (returnArray) {
                return curve.buffer2array(buffOut, sOut);
            } else {
                return buffOut;
            }
        }

        let inv;
        if (inverse) {
            inv = Fr.inv(Fr.e(nPoints));
        }

        let buffOut;

        buffReverseBits(buff, sIn);

        let chunks;
        let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
        let nChunks = nPoints / pointsInChunk;

        while ((nChunks < tm.concurrency)&&(pointsInChunk>=16)) {
            nChunks *= 2;
            pointsInChunk /= 2;
        }

        const l2Chunk = log2$1(pointsInChunk);

        const promises = [];
        for (let i = 0; i< nChunks; i++) {
            const task = [];
            task.push({cmd: "ALLOC", var: 0, len: sMid*pointsInChunk});
            const buffChunk = buff.slice( (pointsInChunk * i)*sIn, (pointsInChunk * (i+1))*sIn);
            task.push({cmd: "SET", var: 0, buff: buffChunk});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
            }
            for (let j=1; j<=l2Chunk;j++) {
                task.push({cmd: "CALL", fnName:fnFFTMix, params: [{var:0}, {val: pointsInChunk}, {val: j}]});
            }

            if (l2Chunk==bits) {
                if (fnFFTFinal) {
                    task.push({cmd: "ALLOCSET", var: 1, buff: inv});
                    task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                        {var: 0},
                        {val: pointsInChunk},
                        {var: 1},
                    ]});
                }
                if (fnMid2Out) {
                    task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                }
                task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
            } else {
                task.push({cmd: "GET", out:0, var: 0, len: sMid*pointsInChunk});
            }
            promises.push(tm.queueAction(task).then( (r) => {
                if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix: ${i}/${nChunks}`);
                return r;
            }));
        }

        chunks = await Promise.all(promises);
        for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

        for (let i = l2Chunk+1;   i<=bits; i++) {
            if (logger) logger.debug(`${loggerTxt}: fft  ${bits}  join: ${i}/${bits}`);
            const nGroups = 1 << (bits - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsInChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsInChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    if (i==bits) {
                        if (fnFFTFinal) {
                            task.push({cmd: "ALLOCSET", var: 4, buff: inv});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 0},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                            task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                {var: 1},
                                {val: pointsInChunk},
                                {var: 4},
                            ]});
                        }
                        if (fnMid2Out) {
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                            task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: pointsInChunk}, {var: 1}]});
                        }
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sOut});
                    } else {
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sMid});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sMid});
                    }
                    opPromises.push(tm.queueAction(task));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        if (buff instanceof BigBuffer) {
            buffOut = new BigBuffer(nPoints*sOut);
        } else {
            buffOut = new Uint8Array(nPoints*sOut);
        }
        if (inverse) {
            buffOut.set(chunks[0].slice((pointsInChunk-1)*sOut));
            let p= sOut;
            for (let i=nChunks-1; i>0; i--) {
                buffOut.set(chunks[i], p);
                p += pointsInChunk*sOut;
                delete chunks[i];  // Liberate mem
            }
            buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
            delete chunks[0];
        } else {
            for (let i=0; i<nChunks; i++) {
                buffOut.set(chunks[i], pointsInChunk*sOut*i);
                delete chunks[i];
            }
        }

        if (returnArray) {
            return curve.buffer2array(buffOut, sOut);
        } else {
            return buffOut;
        }
    }

    async function _fftExt(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        [b1, b2] = await _fftJoinExt(b1, b2, "fftJoinExt", Fr.one, Fr.shift, inType, "jacobian", logger, loggerTxt);

        promises.push( _fft(b1, false, "jacobian", outType, logger, loggerTxt));
        promises.push( _fft(b2, false, "jacobian", outType, logger, loggerTxt));

        const res1 = await Promise.all(promises);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }

    async function _fftExtInv(buff, inType, outType, logger, loggerTxt) {
        let b1, b2;
        b1 = buff.slice( 0 , buff.byteLength/2);
        b2 = buff.slice( buff.byteLength/2, buff.byteLength);

        const promises = [];

        promises.push( _fft(b1, true, inType, "jacobian", logger, loggerTxt));
        promises.push( _fft(b2, true, inType, "jacobian", logger, loggerTxt));

        [b1, b2] = await Promise.all(promises);

        const res1 = await _fftJoinExt(b1, b2, "fftJoinExtInv", Fr.one, Fr.shiftInv, "jacobian", outType, logger, loggerTxt);

        let buffOut;
        if (res1[0].byteLength > (1<<28)) {
            buffOut = new BigBuffer(res1[0].byteLength*2);
        } else {
            buffOut = new Uint8Array(res1[0].byteLength*2);
        }

        buffOut.set(res1[0]);
        buffOut.set(res1[1], res1[0].byteLength);

        return buffOut;
    }


    async function _fftJoinExt(buff1, buff2, fn, first, inc, inType, outType, logger, loggerTxt) {
        const MAX_CHUNK_SIZE = 1<<16;

        let fnName;
        let fnIn2Mid, fnMid2Out;
        let sOut, sIn, sMid;

        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g1m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            sMid = G.F.n8*3;
            fnName = "g1m_"+fn;
            if (outType == "affine") {
                fnMid2Out = "g1m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
                fnIn2Mid = "g2m_batchToJacobian";
            } else {
                sIn = G.F.n8*3;
            }
            fnName = "g2m_"+fn;
            sMid = G.F.n8*3;
            if (outType == "affine") {
                fnMid2Out = "g2m_batchToAffine";
                sOut = G.F.n8*2;
            } else {
                sOut = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
            sOut = Fr.n8;
            sMid = Fr.n8;
            fnName = "frm_" + fn;
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sIn);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        const opPromises = [];

        for (let i=0; i<nPoints; i += MAX_CHUNK_SIZE) {
            if (logger) logger.debug(`${loggerTxt}: fftJoinExt: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, MAX_CHUNK_SIZE);

            const firstChunk = Fr.mul(first, Fr.exp( inc, i*MAX_CHUNK_SIZE));
            const task = [];

            const b1 = buff1.slice(i*sIn, (i+n)*sIn);
            const b2 = buff2.slice(i*sIn, (i+n)*sIn);


            task.push({cmd: "ALLOC", var: 0, len: sMid*n});
            task.push({cmd: "SET", var: 0, buff: b1});
            task.push({cmd: "ALLOC", var: 1, len: sMid*n});
            task.push({cmd: "SET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            if (fnIn2Mid) {
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: n},
                {var: 2},
                {var: 3}
            ]});
            if (fnMid2Out) {
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: n}, {var: 0}]});
                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: n}, {var: 1}]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: n*sOut});
            task.push({cmd: "GET", out: 1, var: 1, len: n*sOut});
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (nPoints * sOut > 1<<28) {
            fullBuffOut1 = new BigBuffer(nPoints*sOut);
            fullBuffOut2 = new BigBuffer(nPoints*sOut);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sOut);
            fullBuffOut2 = new Uint8Array(nPoints*sOut);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    }


    G.fft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, false, inType, outType, logger, loggerTxt);
    };

    G.ifft = async function(buff, inType, outType, logger, loggerTxt) {
        return await _fft(buff, true, inType, outType, logger, loggerTxt);
    };

    G.lagrangeEvaluations = async function (buff, inType, outType, logger, loggerTxt) {
        inType = inType || "affine";
        outType = outType || "affine";

        let sIn;
        if (groupName == "G1") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "G2") {
            if (inType == "affine") {
                sIn = G.F.n8*2;
            } else {
                sIn = G.F.n8*3;
            }
        } else if (groupName == "Fr") {
            sIn = Fr.n8;
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = buff.byteLength /sIn;
        const bits = log2$1(nPoints);

        if ((2 ** bits)*sIn != buff.byteLength) {
            if (logger) logger.error("lagrangeEvaluations iinvalid input size");
            throw new Error("lagrangeEvaluations invalid Input size");
        }

        if (bits <= Fr.s) {
            return await G.ifft(buff, inType, outType, logger, loggerTxt);
        }

        if (bits > Fr.s+1) {
            if (logger) logger.error("lagrangeEvaluations input too big");
            throw new Error("lagrangeEvaluations input too big");
        }

        let t0 = buff.slice(0, buff.byteLength/2);
        let t1 = buff.slice(buff.byteLength/2, buff.byteLength);


        const shiftToSmallM = Fr.exp(Fr.shift, nPoints/2);
        const sConst = Fr.inv( Fr.sub(Fr.one, shiftToSmallM));

        [t0, t1] = await _fftJoinExt(t0, t1, "prepareLagrangeEvaluation", sConst, Fr.shiftInv, inType, "jacobian", logger, loggerTxt + " prep");

        const promises = [];

        promises.push( _fft(t0, true, "jacobian", outType, logger, loggerTxt + " t0"));
        promises.push( _fft(t1, true, "jacobian", outType, logger, loggerTxt + " t1"));

        [t0, t1] = await Promise.all(promises);

        let buffOut;
        if (t0.byteLength > (1<<28)) {
            buffOut = new BigBuffer(t0.byteLength*2);
        } else {
            buffOut = new Uint8Array(t0.byteLength*2);
        }

        buffOut.set(t0);
        buffOut.set(t1, t0.byteLength);

        return buffOut;
    };

    G.fftMix = async function fftMix(buff) {
        const sG = G.F.n8*3;
        let fnName, fnFFTJoin;
        if (groupName == "G1") {
            fnName = "g1m_fftMix";
            fnFFTJoin = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftMix";
            fnFFTJoin = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftMix";
            fnFFTJoin = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        const power = log2$1(nPoints);

        let nChunks = 1 << log2$1(tm.concurrency);

        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;

        const powerChunk = log2$1(pointsPerChunk);

        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            for (let j=1; j<=powerChunk; j++) {
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: pointsPerChunk},
                    {val: j}
                ]});
            }
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );
        }

        const result = await Promise.all(opPromises);

        const chunks = [];
        for (let i=0; i<result.length; i++) chunks[i] = result[i][0];


        for (let i = powerChunk+1; i<=power; i++) {
            const nGroups = 1 << (power - i);
            const nChunksPerGroup = nChunks / nGroups;
            const opPromises = [];
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const first = Fr.exp( Fr.w[i], k*pointsPerChunk);
                    const inc = Fr.w[i];
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                    const task = [];
                    task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                    task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                    task.push({cmd: "ALLOCSET", var: 2, buff: first});
                    task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                    task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                        {var: 0},
                        {var: 1},
                        {val: pointsPerChunk},
                        {var: 2},
                        {var: 3}
                    ]});
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                    task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                    opPromises.push(tm.queueAction(task));
                }
            }

            const res = await Promise.all(opPromises);
            for (let j=0; j<nGroups; j++) {
                for (let k=0; k <nChunksPerGroup/2; k++) {
                    const o1 = j*nChunksPerGroup + k;
                    const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                    const resChunk = res.shift();
                    chunks[o1] = resChunk[0];
                    chunks[o2] = resChunk[1];
                }
            }
        }

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sG);
        }
        let p =0;
        for (let i=0; i<nChunks; i++) {
            fullBuffOut.set(chunks[i], p);
            p+=chunks[i].byteLength;
        }

        return fullBuffOut;
    };

    G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
        const sG = G.F.n8*3;
        let fnName;
        if (groupName == "G1") {
            fnName = "g1m_fftJoin";
        } else if (groupName == "G2") {
            fnName = "g2m_fftJoin";
        } else if (groupName == "Fr") {
            fnName = "frm_fftJoin";
        } else {
            throw new Error("Invalid group");
        }

        if (buff1.byteLength != buff2.byteLength) {
            throw new Error("Invalid buffer size");
        }
        const nPoints = Math.floor(buff1.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        let nChunks = 1 << log2$1(tm.concurrency);
        if (nPoints <= nChunks*2) nChunks = 1;

        const pointsPerChunk = nPoints / nChunks;


        const opPromises = [];
        for (let i=0; i<nChunks; i++) {
            const task = [];

            const firstChunk = Fr.mul(first, Fr.exp(inc, i*pointsPerChunk));
            const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b1});
            task.push({cmd: "ALLOCSET", var: 1, buff: b2});
            task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
            task.push({cmd: "ALLOCSET", var: 3, buff: inc});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {var: 1},
                {val: pointsPerChunk},
                {var: 2},
                {var: 3}
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
            task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
            opPromises.push(
                tm.queueAction(task)
            );

        }


        const result = await Promise.all(opPromises);

        let fullBuffOut1;
        let fullBuffOut2;
        if (buff1 instanceof BigBuffer) {
            fullBuffOut1 = new BigBuffer(nPoints*sG);
            fullBuffOut2 = new BigBuffer(nPoints*sG);
        } else {
            fullBuffOut1 = new Uint8Array(nPoints*sG);
            fullBuffOut2 = new Uint8Array(nPoints*sG);
        }

        let p =0;
        for (let i=0; i<result.length; i++) {
            fullBuffOut1.set(result[i][0], p);
            fullBuffOut2.set(result[i][1], p);
            p+=result[i][0].byteLength;
        }

        return [fullBuffOut1, fullBuffOut2];
    };



    G.fftFinal =  async function fftFinal(buff, factor) {
        const sG = G.F.n8*3;
        const sGout = G.F.n8*2;
        let fnName, fnToAffine;
        if (groupName == "G1") {
            fnName = "g1m_fftFinal";
            fnToAffine = "g1m_batchToAffine";
        } else if (groupName == "G2") {
            fnName = "g2m_fftFinal";
            fnToAffine = "g2m_batchToAffine";
        } else {
            throw new Error("Invalid group");
        }

        const nPoints = Math.floor(buff.byteLength / sG);
        if (nPoints != 1 << log2$1(nPoints)) {
            throw new Error("Invalid number of points");
        }

        const pointsPerChunk = Math.floor(nPoints / tm.concurrency);

        const opPromises = [];
        for (let i=0; i<tm.concurrency; i++) {
            let n;
            if (i< tm.concurrency-1) {
                n = pointsPerChunk;
            } else {
                n = nPoints - i*pointsPerChunk;
            }
            if (n==0) continue;
            const task = [];
            const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
            task.push({cmd: "ALLOCSET", var: 0, buff: b});
            task.push({cmd: "ALLOCSET", var: 1, buff: factor});
            task.push({cmd: "CALL", fnName: fnName, params: [
                {var: 0},
                {val: n},
                {var: 1},
            ]});
            task.push({cmd: "CALL", fnName: fnToAffine, params: [
                {var: 0},
                {val: n},
                {var: 0},
            ]});
            task.push({cmd: "GET", out: 0, var: 0, len: n*sGout});
            opPromises.push(
                tm.queueAction(task)
            );

        }

        const result = await Promise.all(opPromises);

        let fullBuffOut;
        if (buff instanceof BigBuffer) {
            fullBuffOut = new BigBuffer(nPoints*sGout);
        } else {
            fullBuffOut = new Uint8Array(nPoints*sGout);
        }

        let p =0;
        for (let i=result.length-1; i>=0; i--) {
            fullBuffOut.set(result[i][0], p);
            p+=result[i][0].byteLength;
        }

        return fullBuffOut;
    };
}

async function buildEngine(params) {

    const tm = await buildThreadManager(params.wasm, params.singleThread);


    const curve = {};

    curve.q = e$2(params.wasm.q);
    curve.r = e$2(params.wasm.r);
    curve.name = params.name;
    curve.tm = tm;
    curve.prePSize = params.wasm.prePSize;
    curve.preQSize = params.wasm.preQSize;
    curve.Fr = new WasmField1(tm, "frm", params.n8r, params.r);
    curve.F1 = new WasmField1(tm, "f1m", params.n8q, params.q);
    curve.F2 = new WasmField2(tm, "f2m", curve.F1);
    curve.G1 = new WasmCurve(tm, "g1m", curve.F1, params.wasm.pG1gen, params.wasm.pG1b, params.cofactorG1);
    curve.G2 = new WasmCurve(tm, "g2m", curve.F2, params.wasm.pG2gen, params.wasm.pG2b, params.cofactorG2);
    curve.F6 = new WasmField3(tm, "f6m", curve.F2);
    curve.F12 = new WasmField2(tm, "ftm", curve.F6);

    curve.Gt = curve.F12;

    buildBatchApplyKey(curve, "G1");
    buildBatchApplyKey(curve, "G2");
    buildBatchApplyKey(curve, "Fr");

    buildMultiexp(curve, "G1");
    buildMultiexp(curve, "G2");

    buildFFT(curve, "G1");
    buildFFT(curve, "G2");
    buildFFT(curve, "Fr");

    buildPairing(curve);

    curve.array2buffer = function(arr, sG) {
        const buff = new Uint8Array(sG*arr.length);

        for (let i=0; i<arr.length; i++) {
            buff.set(arr[i], i*sG);
        }

        return buff;
    };

    curve.buffer2array = function(buff , sG) {
        const n= buff.byteLength / sG;
        const arr = new Array(n);
        for (let i=0; i<n; i++) {
            arr[i] = buff.slice(i*sG, i*sG+sG);
        }
        return arr;
    };

    return curve;
}

let curve;

async function buildBn128() {

    if (curve) return curve;
    const params = {
        name: "bn128",
        wasm: wasmcurves.bn128_wasm,
        q: e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
        r: e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
        n8q: 32,
        n8r: 32,
        cofactorG2: e$2("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
        singleThread: false
    };

    curve = await buildEngine(params);
    curve.terminate = async function() {
        curve = null;
        if (!params.singleThread) {
            await this.tm.terminate();
        }
    };

    return curve;
}

let curve$1;

async function buildBls12381() {

    if (curve$1) return curve$1;
    const params = {
        name: "bls12381",
        wasm: wasmcurves.bls12381_wasm,
        q: e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
        r: e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
        n8q: 48,
        n8r: 32,
        cofactorG1: e$2("0x396c8c005555e1568c00aaab0000aaab", 16),
        cofactorG2: e$2("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
        singleThread: false
    };

    curve$1 = await buildEngine(params);

    curve$1.terminate = async function() {
        curve$1 = null;
        await this.tm.terminate();
    };
    return curve$1;
}

const Scalar$1=_Scalar;
const utils$1 = _utils;

exports.BigBuffer = BigBuffer;
exports.ChaCha = ChaCha;
exports.EC = EC;
exports.F1Field = F1Field;
exports.F2Field = F2Field;
exports.F3Field = F3Field;
exports.PolField = PolField;
exports.Scalar = Scalar$1;
exports.ZqField = F1Field;
exports.buildBls12381 = buildBls12381;
exports.buildBn128 = buildBn128;
exports.utils = utils$1;
