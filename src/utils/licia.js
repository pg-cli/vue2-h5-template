// Built by eustia.
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root._ = factory(); }
}(this, function ()
{
    /* eslint-disable */

    var _ = {};

    if (typeof window === 'object' && window._) _ = window._;

    /* ------------------------------ base64 ------------------------------ */

    var base64 = _.base64 = (function (exports) {
        /* Basic base64 encoding and decoding.
         *
         * ### encode
         *
         * Turn a byte array into a base64 string.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |bytes |Byte array   |
         * |return|Base64 string|
         *
         * ### decode
         *
         * Turn a base64 string into a byte array.
         *
         * |Name  |Desc         |
         * |------|-------------|
         * |str   |Base64 string|
         * |return|Byte array   |
         */

        /* example
         * base64.encode([168, 174, 155, 255]); // -> 'qK6b/w=='
         * base64.decode('qK6b/w=='); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare const base64: {
         *     encode(bytes: number[]): string;
         *     decode(str: string): number[];
         * };
         */
        exports = {
            encode: function(bytes) {
                var ret = [];
                var len = bytes.length;
                var remain = len % 3;
                len = len - remain;

                for (var i = 0; i < len; i += 3) {
                    ret.push(
                        numToBase64(
                            (bytes[i] << 16) + (bytes[i + 1] << 8) + bytes[i + 2]
                        )
                    );
                }

                len = bytes.length;
                var tmp;

                if (remain === 1) {
                    tmp = bytes[len - 1];
                    ret.push(code[tmp >> 2]);
                    ret.push(code[(tmp << 4) & 0x3f]);
                    ret.push('==');
                } else if (remain === 2) {
                    tmp = (bytes[len - 2] << 8) + bytes[len - 1];
                    ret.push(code[tmp >> 10]);
                    ret.push(code[(tmp >> 4) & 0x3f]);
                    ret.push(code[(tmp << 2) & 0x3f]);
                    ret.push('=');
                }

                return ret.join('');
            },
            decode: function(str) {
                var len = str.length,
                    remain = 0;
                if (str[len - 2] === '=') remain = 2;
                else if (str[len - 1] === '=') remain = 1;
                var ret = new Array((len * 3) / 4 - remain);
                len = remain > 0 ? len - 4 : len;
                var i, j;

                for (i = 0, j = 0; i < len; i += 4) {
                    var num = base64ToNum(str[i], str[i + 1], str[i + 2], str[i + 3]);
                    ret[j++] = (num >> 16) & 0xff;
                    ret[j++] = (num >> 8) & 0xff;
                    ret[j++] = num & 0xff;
                }

                var tmp;

                if (remain === 2) {
                    tmp =
                        (codeMap[str.charCodeAt(i)] << 2) |
                        (codeMap[str.charCodeAt(i + 1)] >> 4);
                    ret[j++] = tmp & 0xff;
                } else if (remain === 1) {
                    tmp =
                        (codeMap[str.charCodeAt(i)] << 10) |
                        (codeMap[str.charCodeAt(i + 1)] << 4) |
                        (codeMap[str.charCodeAt(i + 2)] >> 2);
                    ret[j++] = (tmp >> 8) & 0xff;
                    ret[j++] = tmp & 0xff;
                }

                return ret;
            }
        };
        var codeMap = [];
        var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        for (var i = 0, len = code.length; i < len; i++) {
            codeMap[code.charCodeAt(i)] = i;
        }

        function numToBase64(num) {
            return (
                code[(num >> 18) & 0x3f] +
                code[(num >> 12) & 0x3f] +
                code[(num >> 6) & 0x3f] +
                code[num & 0x3f]
            );
        }

        function base64ToNum(str1, str2, str3, str4) {
            return (
                (codeMap[str1.charCodeAt(0)] << 18) |
                (codeMap[str2.charCodeAt(0)] << 12) |
                (codeMap[str3.charCodeAt(0)] << 6) |
                codeMap[str4.charCodeAt(0)]
            );
        }

        return exports;
    })({});

    /* ------------------------------ bytesToWords ------------------------------ */

    var bytesToWords = _.bytesToWords = (function (exports) {
        /* Convert bytes to 32-bit words.
         *
         * Useful when using CryptoJS.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |bytes |Byte array|
         * |return|Word array|
         */

        /* example
         * bytesToWords([0x12, 0x34, 0x56, 0x78]); // -> [0x12345678]
         */

        /* typescript
         * export declare function bytesToWords(bytes: number[]): number[];
         */
        exports = function(bytes) {
            var words = [];

            for (var i = 0, len = bytes.length; i < len; i++) {
                words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
            }

            return words;
        };

        return exports;
    })({});

    /* ------------------------------ has ------------------------------ */

    var has = _.has = (function (exports) {
        /* Checks if key is a direct property.
         *
         * |Name  |Desc                            |
         * |------|--------------------------------|
         * |obj   |Object to query                 |
         * |key   |Path to check                   |
         * |return|True if key is a direct property|
         */

        /* example
         * has({ one: 1 }, 'one'); // -> true
         */

        /* typescript
         * export declare function has(obj: {}, key: string): boolean;
         */
        var hasOwnProp = Object.prototype.hasOwnProperty;

        exports = function(obj, key) {
            return hasOwnProp.call(obj, key);
        };

        return exports;
    })({});

    /* ------------------------------ chunk ------------------------------ */

    var chunk = _.chunk = (function (exports) {
        /* Split array into groups the length of given size.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |arr   |Array to process    |
         * |size=1|Length of each chunk|
         * |return|Chunks of given size|
         */

        /* example
         * chunk([1, 2, 3, 4], 2); // -> [[1, 2], [3, 4]]
         * chunk([1, 2, 3, 4], 3); // -> [[1, 2, 3], [4]]
         * chunk([1, 2, 3, 4]); // -> [[1], [2], [3], [4]]
         */

        /* typescript
         * export declare function chunk(arr: any[], size?: number): Array<any[]>;
         */
        exports = function(arr, size) {
            var ret = [];
            size = size || 1;

            for (var i = 0, len = Math.ceil(arr.length / size); i < len; i++) {
                var start = i * size;
                var end = start + size;
                ret.push(arr.slice(start, end));
            }

            return ret;
        };

        return exports;
    })({});

    /* ------------------------------ isUndef ------------------------------ */

    var isUndef = _.isUndef = (function (exports) {
        /* Check if value is undefined.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is undefined|
         */

        /* example
         * isUndef(void 0); // -> true
         * isUndef(null); // -> false
         */

        /* typescript
         * export declare function isUndef(val: any): boolean;
         */
        exports = function(val) {
            return val === void 0;
        };

        return exports;
    })({});

    /* ------------------------------ types ------------------------------ */

    var types = _.types = (function (exports) {
        /* Used for typescript definitions only.
         */

        /* typescript
         * export declare namespace types {
         *     interface Collection<T> {}
         *     interface List<T> extends Collection<T> {
         *         [index: number]: T;
         *         length: number;
         *     }
         *     interface ListIterator<T, TResult> {
         *         (value: T, index: number, list: List<T>): TResult;
         *     }
         *     interface Dictionary<T> extends Collection<T> {
         *         [index: string]: T;
         *     }
         *     interface ObjectIterator<T, TResult> {
         *         (element: T, key: string, list: Dictionary<T>): TResult;
         *     }
         *     interface MemoIterator<T, TResult> {
         *         (prev: TResult, curr: T, index: number, list: List<T>): TResult;
         *     }
         *     interface MemoObjectIterator<T, TResult> {
         *         (prev: TResult, curr: T, key: string, list: Dictionary<T>): TResult;
         *     }
         *     type Fn<T> = (...args: any[]) => T;
         *     type AnyFn = Fn<any>;
         *     type PlainObj<T> = { [name: string]: T };
         * }
         * export declare const types: {};
         */
        exports = {};

        return exports;
    })({});

    /* ------------------------------ keys ------------------------------ */

    var keys = _.keys = (function (exports) {
        /* Create an array of the own enumerable property names of object.
         *
         * |Name  |Desc                   |
         * |------|-----------------------|
         * |obj   |Object to query        |
         * |return|Array of property names|
         */

        /* example
         * keys({ a: 1 }); // -> ['a']
         */

        /* typescript
         * export declare function keys(obj: any): string[];
         */

        /* dependencies
         * has 
         */

        if (Object.keys && !false) {
            exports = Object.keys;
        } else {
            exports = function(obj) {
                var ret = [];

                for (var key in obj) {
                    if (has(obj, key)) ret.push(key);
                }

                return ret;
            };
        }

        return exports;
    })({});

    /* ------------------------------ optimizeCb ------------------------------ */

    var optimizeCb = _.optimizeCb = (function (exports) {
        /* Used for function context binding.
         */

        /* typescript
         * export declare function optimizeCb(
         *     fn: types.AnyFn,
         *     ctx: any,
         *     argCount?: number
         * ): types.AnyFn;
         */

        /* dependencies
         * isUndef types 
         */

        exports = function(fn, ctx, argCount) {
            if (isUndef(ctx)) return fn;

            switch (argCount == null ? 3 : argCount) {
                case 1:
                    return function(val) {
                        return fn.call(ctx, val);
                    };

                case 3:
                    return function(val, idx, collection) {
                        return fn.call(ctx, val, idx, collection);
                    };

                case 4:
                    return function(accumulator, val, idx, collection) {
                        return fn.call(ctx, accumulator, val, idx, collection);
                    };
            }

            return function() {
                return fn.apply(ctx, arguments);
            };
        };

        return exports;
    })({});

    /* ------------------------------ identity ------------------------------ */

    var identity = _.identity = (function (exports) {
        /* Return the first argument given.
         *
         * |Name  |Desc       |
         * |------|-----------|
         * |val   |Any value  |
         * |return|Given value|
         */

        /* example
         * identity('a'); // -> 'a'
         */

        /* typescript
         * export declare function identity<T>(val: T): T;
         */
        exports = function(val) {
            return val;
        };

        return exports;
    })({});

    /* ------------------------------ objToStr ------------------------------ */

    var objToStr = _.objToStr = (function (exports) {
        /* Alias of Object.prototype.toString.
         *
         * |Name  |Desc                                |
         * |------|------------------------------------|
         * |val   |Source value                        |
         * |return|String representation of given value|
         */

        /* example
         * objToStr(5); // -> '[object Number]'
         */

        /* typescript
         * export declare function objToStr(val: any): string;
         */
        var ObjToStr = Object.prototype.toString;

        exports = function(val) {
            return ObjToStr.call(val);
        };

        return exports;
    })({});

    /* ------------------------------ isArr ------------------------------ */

    var isArr = _.isArr = (function (exports) {
        /* Check if value is an `Array` object.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |val   |Value to check                    |
         * |return|True if value is an `Array` object|
         */

        /* example
         * isArr([]); // -> true
         * isArr({}); // -> false
         */

        /* typescript
         * export declare function isArr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        if (Array.isArray && !false) {
            exports = Array.isArray;
        } else {
            exports = function(val) {
                return objToStr(val) === '[object Array]';
            };
        }

        return exports;
    })({});

    /* ------------------------------ castPath ------------------------------ */

    var castPath = _.castPath = (function (exports) {
        /* Cast value into a property path array.
         *
         * |Name  |Desc               |
         * |------|-------------------|
         * |path  |Value to inspect   |
         * |obj   |Object to query    |
         * |return|Property path array|
         */

        /* example
         * castPath('a.b.c'); // -> ['a', 'b', 'c']
         * castPath(['a']); // -> ['a']
         * castPath('a[0].b'); // -> ['a', '0', 'b']
         * castPath('a.b.c', { 'a.b.c': true }); // -> ['a.b.c']
         */

        /* typescript
         * export declare function castPath(path: string | string[], obj?: any): string[];
         */

        /* dependencies
         * has isArr 
         */

        exports = function(str, obj) {
            if (isArr(str)) return str;
            if (obj && has(obj, str)) return [str];
            var ret = [];
            str.replace(regPropName, function(match, number, quote, str) {
                ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
            });
            return ret;
        }; // Lodash _stringToPath

        var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var regEscapeChar = /\\(\\)?/g;

        return exports;
    })({});

    /* ------------------------------ isNum ------------------------------ */

    var isNum = _.isNum = (function (exports) {
        /* Check if value is classified as a Number primitive or object.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is correctly classified|
         */

        /* example
         * isNum(5); // -> true
         * isNum(5.1); // -> true
         * isNum({}); // -> false
         */

        /* typescript
         * export declare function isNum(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object Number]';
        };

        return exports;
    })({});

    /* ------------------------------ isFn ------------------------------ */

    var isFn = _.isFn = (function (exports) {
        /* Check if value is a function.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |val   |Value to check             |
         * |return|True if value is a function|
         *
         * Generator function is also classified as true.
         */

        /* example
         * isFn(function() {}); // -> true
         * isFn(function*() {}); // -> true
         * isFn(async function() {}); // -> true
         */

        /* typescript
         * export declare function isFn(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            var objStr = objToStr(val);
            return (
                objStr === '[object Function]' ||
                objStr === '[object GeneratorFunction]' ||
                objStr === '[object AsyncFunction]'
            );
        };

        return exports;
    })({});

    /* ------------------------------ isArrLike ------------------------------ */

    var isArrLike = _.isArrLike = (function (exports) {
        /* Check if value is array-like.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |val   |Value to check             |
         * |return|True if value is array like|
         *
         * Function returns false.
         */

        /* example
         * isArrLike('test'); // -> true
         * isArrLike(document.body.children); // -> true;
         * isArrLike([1, 2, 3]); // -> true
         */

        /* typescript
         * export declare function isArrLike(val: any): boolean;
         */

        /* dependencies
         * isNum isFn 
         */

        var MAX_ARR_IDX = Math.pow(2, 53) - 1;

        exports = function(val) {
            if (!val) return false;
            var len = val.length;
            return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
        };

        return exports;
    })({});

    /* ------------------------------ each ------------------------------ */

    var each = _.each = (function (exports) {
        /* Iterate over elements of collection and invokes iterator for each element.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |obj     |Collection to iterate over    |
         * |iterator|Function invoked per iteration|
         * |ctx     |Function context              |
         */

        /* example
         * each({ a: 1, b: 2 }, function(val, key) {});
         */

        /* typescript
         * export declare function each<T>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, void>,
         *     ctx?: any
         * ): types.List<T>;
         * export declare function each<T>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, void>,
         *     ctx?: any
         * ): types.Collection<T>;
         */

        /* dependencies
         * isArrLike keys optimizeCb types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = optimizeCb(iterator, ctx);
            var i, len;

            if (isArrLike(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    iterator(obj[i], i, obj);
                }
            } else {
                var _keys = keys(obj);

                for (i = 0, len = _keys.length; i < len; i++) {
                    iterator(obj[_keys[i]], _keys[i], obj);
                }
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ createAssigner ------------------------------ */

    var createAssigner = _.createAssigner = (function (exports) {
        /* Used to create extend, extendOwn and defaults.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |keysFn  |Function to get object keys   |
         * |defaults|No override when set to true  |
         * |return  |Result function, extend...    |
         */

        /* typescript
         * export declare function createAssigner(
         *     keysFn: types.AnyFn,
         *     defaults: boolean
         * ): types.AnyFn;
         */

        /* dependencies
         * isUndef each types 
         */

        exports = function(keysFn, defaults) {
            return function(obj) {
                each(arguments, function(src, idx) {
                    if (idx === 0) return;
                    var keys = keysFn(src);
                    each(keys, function(key) {
                        if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                    });
                });
                return obj;
            };
        };

        return exports;
    })({});

    /* ------------------------------ extendOwn ------------------------------ */

    var extendOwn = _.extendOwn = (function (exports) {
        /* Like extend, but only copies own properties over to the destination object.
         *
         * |Name       |Desc              |
         * |-----------|------------------|
         * |destination|Destination object|
         * |...sources |Sources objects   |
         * |return     |Destination object|
         */

        /* example
         * extendOwn({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
         */

        /* typescript
         * export declare function extendOwn(destination: any, ...sources: any[]): any;
         */

        /* dependencies
         * keys createAssigner 
         */

        exports = createAssigner(keys);

        return exports;
    })({});

    /* ------------------------------ isInt ------------------------------ */

    var isInt = _.isInt = (function (exports) {
        /* Checks if value is classified as a Integer.
         *
         * |Name  |Desc                                 |
         * |------|-------------------------------------|
         * |val   |Value to check                       |
         * |return|True if value is correctly classified|
         */

        /* example
         * isInt(5); // -> true
         * isInt(5.1); // -> false
         * isInt({}); // -> false
         */

        /* typescript
         * export declare function isInt(val: any): boolean;
         */

        /* dependencies
         * isNum 
         */

        exports = function(val) {
            return isNum(val) && val % 1 === 0;
        };

        return exports;
    })({});

    /* ------------------------------ isOdd ------------------------------ */

    var isOdd = _.isOdd = (function (exports) {
        /* Check if number is odd.
         *
         * |Name  |Desc                 |
         * |------|---------------------|
         * |num   |Number to check      |
         * |return|True if number is odd|
         */

        /* example
         * isOdd(0); // -> false
         * isOdd(1); // -> true
         * isOdd(2); // -> false
         */

        /* typescript
         * export declare function isOdd(num: number): boolean;
         */

        /* dependencies
         * isInt 
         */

        exports = function(num) {
            if (!isInt(num)) return false;
            return num % 2 !== 0;
        };

        return exports;
    })({});

    /* ------------------------------ hex ------------------------------ */

    var hex = _.hex = (function (exports) {
        /* Hex encoding and decoding.
         *
         * ### encode
         *
         * Turn a byte array into a hex string.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |bytes |Byte array|
         * |return|hex string|
         *
         * ### decode
         *
         * Turn a hex string into a byte array.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |str   |hex string|
         * |return|Byte array|
         */

        /* example
         * hex.encode([168, 174, 155, 255]); // -> 'a8ae9bff'
         * hex.decode('a8ae9bff'); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare const hex: {
         *     encode(bytes: number[]): string;
         *     decode(str: string): number[];
         * };
         */

        /* dependencies
         * isOdd 
         */

        exports = {
            encode: function(bytes) {
                var hex = [];

                for (var i = 0, len = bytes.length; i < len; i++) {
                    var byte = bytes[i];
                    hex.push((byte >>> 4).toString(16));
                    hex.push((byte & 0xf).toString(16));
                }

                return hex.join('');
            },
            decode: function(str) {
                var bytes = [];
                var len = str.length;
                if (isOdd(len)) len--;

                for (var i = 0; i < len; i += 2) {
                    bytes.push(parseInt(str.substr(i, 2), 16));
                }

                return bytes;
            }
        };

        return exports;
    })({});

    /* ------------------------------ isMatch ------------------------------ */

    var isMatch = _.isMatch = (function (exports) {
        /* Check if keys and values in src are contained in obj.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |obj   |Object to inspect                 |
         * |src   |Object of property values to match|
         * |return|True if object is match           |
         */

        /* example
         * isMatch({ a: 1, b: 2 }, { a: 1 }); // -> true
         */

        /* typescript
         * export declare function isMatch(obj: any, src: any): boolean;
         */

        /* dependencies
         * keys 
         */

        exports = function(obj, src) {
            var _keys = keys(src);

            var len = _keys.length;
            if (obj == null) return !len;
            obj = Object(obj);

            for (var i = 0; i < len; i++) {
                var key = _keys[i];
                if (src[key] !== obj[key] || !(key in obj)) return false;
            }

            return true;
        };

        return exports;
    })({});

    /* ------------------------------ isObj ------------------------------ */

    var isObj = _.isObj = (function (exports) {
        /* Check if value is the language type of Object.
         *
         * |Name  |Desc                      |
         * |------|--------------------------|
         * |val   |Value to check            |
         * |return|True if value is an object|
         *
         * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
         */

        /* example
         * isObj({}); // -> true
         * isObj([]); // -> true
         */

        /* typescript
         * export declare function isObj(val: any): boolean;
         */
        exports = function(val) {
            var type = typeof val;
            return !!val && (type === 'function' || type === 'object');
        };

        return exports;
    })({});

    /* ------------------------------ isStr ------------------------------ */

    var isStr = _.isStr = (function (exports) {
        /* Check if value is a string primitive.
         *
         * |Name  |Desc                               |
         * |------|-----------------------------------|
         * |val   |Value to check                     |
         * |return|True if value is a string primitive|
         */

        /* example
         * isStr('licia'); // -> true
         */

        /* typescript
         * export declare function isStr(val: any): boolean;
         */

        /* dependencies
         * objToStr 
         */

        exports = function(val) {
            return objToStr(val) === '[object String]';
        };

        return exports;
    })({});

    /* ------------------------------ matcher ------------------------------ */

    var matcher = _.matcher = (function (exports) {
        /* Return a predicate function that checks if attrs are contained in an object.
         *
         * |Name  |Desc                              |
         * |------|----------------------------------|
         * |attrs |Object of property values to match|
         * |return|New predicate function            |
         */

        /* example
         * const filter = require('licia/filter');
         *
         * const objects = [
         *     { a: 1, b: 2, c: 3 },
         *     { a: 4, b: 5, c: 6 }
         * ];
         * filter(objects, matcher({ a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
         */

        /* typescript
         * export declare function matcher(attrs: any): types.AnyFn;
         */

        /* dependencies
         * extendOwn isMatch types 
         */

        exports = function(attrs) {
            attrs = extendOwn({}, attrs);
            return function(obj) {
                return isMatch(obj, attrs);
            };
        };

        return exports;
    })({});

    /* ------------------------------ wordsToBytes ------------------------------ */

    var wordsToBytes = _.wordsToBytes = (function (exports) {
        /* Convert 32-bit words to bytes.
         *
         * |Name  |Desc      |
         * |------|----------|
         * |words |Word array|
         * |return|Byte array|
         */

        /* example
         * wordsToBytes([0x12345678]); // -> [0x12, 0x34, 0x56, 0x78]
         */

        /* typescript
         * export declare function wordsToBytes(words: number[]): number[];
         */
        exports = function(words) {
            var bytes = [];

            for (var b = 0, len = words.length * 32; b < len; b += 8) {
                bytes.push((words[b >>> 5] >>> (24 - (b % 32))) & 0xff);
            }

            return bytes;
        };

        return exports;
    })({});

    /* ------------------------------ safeGet ------------------------------ */

    var safeGet = _.safeGet = (function (exports) {
        /* Get object property, don't throw undefined error.
         *
         * |Name  |Desc                     |
         * |------|-------------------------|
         * |obj   |Object to query          |
         * |path  |Path of property to get  |
         * |return|Target value or undefined|
         */

        /* example
         * const obj = { a: { aa: { aaa: 1 } } };
         * safeGet(obj, 'a.aa.aaa'); // -> 1
         * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
         * safeGet(obj, 'a.b'); // -> undefined
         */

        /* typescript
         * export declare function safeGet(obj: any, path: string | string[]): any;
         */

        /* dependencies
         * isUndef castPath 
         */

        exports = function(obj, path) {
            path = castPath(path, obj);
            var prop;
            prop = path.shift();

            while (!isUndef(prop)) {
                obj = obj[prop];
                if (obj == null) return;
                prop = path.shift();
            }

            return obj;
        };

        return exports;
    })({});

    /* ------------------------------ property ------------------------------ */

    var property = _.property = (function (exports) {
        /* Return a function that will itself return the key property of any passed-in object.
         *
         * |Name  |Desc                       |
         * |------|---------------------------|
         * |path  |Path of the property to get|
         * |return|New accessor function      |
         */

        /* example
         * const obj = { a: { b: 1 } };
         * property('a')(obj); // -> {b: 1}
         * property(['a', 'b'])(obj); // -> 1
         */

        /* typescript
         * export declare function property(path: string | string[]): types.AnyFn;
         */

        /* dependencies
         * isArr safeGet types 
         */

        exports = function(path) {
            if (!isArr(path)) return shallowProperty(path);
            return function(obj) {
                return safeGet(obj, path);
            };
        };

        function shallowProperty(key) {
            return function(obj) {
                return obj == null ? void 0 : obj[key];
            };
        }

        return exports;
    })({});

    /* ------------------------------ safeCb ------------------------------ */

    var safeCb = _.safeCb = (function (exports) {
        /* Create callback based on input value.
         */

        /* typescript
         * export declare function safeCb(
         *     val?: any,
         *     ctx?: any,
         *     argCount?: number
         * ): types.AnyFn;
         */

        /* dependencies
         * isFn isObj isArr optimizeCb matcher identity types property 
         */

        exports = function(val, ctx, argCount) {
            if (val == null) return identity;
            if (isFn(val)) return optimizeCb(val, ctx, argCount);
            if (isObj(val) && !isArr(val)) return matcher(val);
            return property(val);
        };

        return exports;
    })({});

    /* ------------------------------ map ------------------------------ */

    var map = _.map = (function (exports) {
        /* Create an array of values by running each element in collection through iteratee.
         *
         * |Name    |Desc                          |
         * |--------|------------------------------|
         * |object  |Collection to iterate over    |
         * |iterator|Function invoked per iteration|
         * |context |Function context              |
         * |return  |New mapped array              |
         */

        /* example
         * map([4, 8], function(n) {
         *     return n * n;
         * }); // -> [16, 64]
         */

        /* typescript
         * export declare function map<T, TResult>(
         *     list: types.List<T>,
         *     iterator: types.ListIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         * export declare function map<T, TResult>(
         *     object: types.Dictionary<T>,
         *     iterator: types.ObjectIterator<T, TResult>,
         *     context?: any
         * ): TResult[];
         */

        /* dependencies
         * safeCb keys isArrLike types 
         */

        exports = function(obj, iterator, ctx) {
            iterator = safeCb(iterator, ctx);

            var _keys = !isArrLike(obj) && keys(obj);

            var len = (_keys || obj).length;
            var results = Array(len);

            for (var i = 0; i < len; i++) {
                var curKey = _keys ? _keys[i] : i;
                results[i] = iterator(obj[curKey], curKey, obj);
            }

            return results;
        };

        return exports;
    })({});

    /* ------------------------------ ucs2 ------------------------------ */

    var ucs2 = _.ucs2 = (function (exports) {
        /* UCS-2 encoding and decoding.
         *
         * ### encode
         *
         * Create a string using an array of code point values.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |arr   |Array of code points|
         * |return|Encoded string      |
         *
         * ### decode
         *
         * Create an array of code point values using a string.
         *
         * |Name  |Desc                |
         * |------|--------------------|
         * |str   |Input string        |
         * |return|Array of code points|
         */

        /* example
         * ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
         * ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
         * '𝌆'.length; // -> 2
         * ucs2.decode('𝌆').length; // -> 1
         */

        /* typescript
         * export declare const ucs2: {
         *     encode(arr: number[]): string;
         *     decode(str: string): number[];
         * };
         */

        /* dependencies
         * chunk map 
         */ // https://mathiasbynens.be/notes/javascript-encoding

        exports = {
            encode: function(arr) {
                // https://stackoverflow.com/questions/22747068/is-there-a-max-number-of-arguments-javascript-functions-can-accept
                if (arr.length < 32768) {
                    return String.fromCodePoint.apply(String, arr);
                }

                return map(chunk(arr, 32767), function(nums) {
                    return String.fromCodePoint.apply(String, nums);
                }).join('');
            },
            decode: function(str) {
                var ret = [];
                var i = 0;
                var len = str.length;

                while (i < len) {
                    var c = str.charCodeAt(i++); // A high surrogate

                    if (c >= 0xd800 && c <= 0xdbff && i < len) {
                        var tail = str.charCodeAt(i++); // nextC >= 0xDC00 && nextC <= 0xDFFF

                        if ((tail & 0xfc00) === 0xdc00) {
                            // C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
                            ret.push(((c & 0x3ff) << 10) + (tail & 0x3ff) + 0x10000);
                        } else {
                            ret.push(c);
                            i--;
                        }
                    } else {
                        ret.push(c);
                    }
                }

                return ret;
            }
        };

        return exports;
    })({});

    /* ------------------------------ utf8 ------------------------------ */

    var utf8 = _.utf8 = (function (exports) {
        /* UTF-8 encoding and decoding.
         *
         * ### encode
         *
         * Turn any UTF-8 decoded string into UTF-8 encoded string.
         *
         * |Name  |Desc            |
         * |------|----------------|
         * |str   |String to encode|
         * |return|Encoded string  |
         *
         * ### decode
         *
         * Turn any UTF-8 encoded string into UTF-8 decoded string.
         *
         * |Name      |Desc                  |
         * |----------|----------------------|
         * |str       |String to decode      |
         * |safe=false|Suppress error if true|
         * |return    |Decoded string        |
         */

        /* example
         * utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
         * utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
         */

        /* typescript
         * export declare const utf8: {
         *     encode(str: string): string;
         *     decode(str: string, safe?: boolean): string;
         * };
         */

        /* dependencies
         * ucs2 
         */ // https://encoding.spec.whatwg.org/#utf-8

        exports = {
            encode: function(str) {
                var codePoints = ucs2.decode(str);
                var byteArr = '';

                for (var i = 0, len = codePoints.length; i < len; i++) {
                    byteArr += encodeCodePoint(codePoints[i]);
                }

                return byteArr;
            },
            decode: function(str, safe) {
                byteArr = ucs2.decode(str);
                byteIdx = 0;
                byteCount = byteArr.length;
                codePoint = 0;
                bytesSeen = 0;
                bytesNeeded = 0;
                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                var codePoints = [];
                var tmp;

                while ((tmp = decodeCodePoint(safe)) !== false) {
                    codePoints.push(tmp);
                }

                return ucs2.encode(codePoints);
            }
        };
        var fromCharCode = String.fromCharCode;

        function encodeCodePoint(codePoint) {
            // U+0000 to U+0080, ASCII code point
            if ((codePoint & 0xffffff80) === 0) {
                return fromCharCode(codePoint);
            }

            var ret = '',
                count,
                offset; // U+0080 to U+07FF, inclusive

            if ((codePoint & 0xfffff800) === 0) {
                count = 1;
                offset = 0xc0;
            } else if ((codePoint & 0xffff0000) === 0) {
                // U+0800 to U+FFFF, inclusive
                count = 2;
                offset = 0xe0;
            } else if ((codePoint & 0xffe00000) == 0) {
                // U+10000 to U+10FFFF, inclusive
                count = 3;
                offset = 0xf0;
            }

            ret += fromCharCode((codePoint >> (6 * count)) + offset);

            while (count > 0) {
                var tmp = codePoint >> (6 * (count - 1));
                ret += fromCharCode(0x80 | (tmp & 0x3f));
                count--;
            }

            return ret;
        }

        var byteArr,
            byteIdx,
            byteCount,
            codePoint,
            bytesSeen,
            bytesNeeded,
            lowerBoundary,
            upperBoundary;

        function decodeCodePoint(safe) {
            /* eslint-disable no-constant-condition */
            while (true) {
                if (byteIdx >= byteCount && bytesNeeded) {
                    if (safe) return goBack();
                    throw new Error('Invalid byte index');
                }

                if (byteIdx === byteCount) return false;
                var byte = byteArr[byteIdx];
                byteIdx++;

                if (!bytesNeeded) {
                    // 0x00 to 0x7F
                    if ((byte & 0x80) === 0) {
                        return byte;
                    } // 0xC2 to 0xDF

                    if ((byte & 0xe0) === 0xc0) {
                        bytesNeeded = 1;
                        codePoint = byte & 0x1f;
                    } else if ((byte & 0xf0) === 0xe0) {
                        // 0xE0 to 0xEF
                        if (byte === 0xe0) lowerBoundary = 0xa0;
                        if (byte === 0xed) upperBoundary = 0x9f;
                        bytesNeeded = 2;
                        codePoint = byte & 0xf;
                    } else if ((byte & 0xf8) === 0xf0) {
                        // 0xF0 to 0xF4
                        if (byte === 0xf0) lowerBoundary = 0x90;
                        if (byte === 0xf4) upperBoundary = 0x8f;
                        bytesNeeded = 3;
                        codePoint = byte & 0x7;
                    } else {
                        if (safe) return goBack();
                        throw new Error('Invalid UTF-8 detected');
                    }

                    continue;
                }

                if (byte < lowerBoundary || byte > upperBoundary) {
                    if (safe) {
                        byteIdx--;
                        return goBack();
                    }

                    throw new Error('Invalid continuation byte');
                }

                lowerBoundary = 0x80;
                upperBoundary = 0xbf;
                codePoint = (codePoint << 6) | (byte & 0x3f);
                bytesSeen++;
                if (bytesSeen !== bytesNeeded) continue;
                var tmp = codePoint;
                codePoint = 0;
                bytesNeeded = 0;
                bytesSeen = 0;
                return tmp;
            }
        }

        function goBack() {
            var start = byteIdx - bytesSeen - 1;
            byteIdx = start + 1;
            codePoint = 0;
            bytesNeeded = 0;
            bytesSeen = 0;
            lowerBoundary = 0x80;
            upperBoundary = 0xbf;
            return byteArr[start];
        }

        return exports;
    })({});

    /* ------------------------------ strToBytes ------------------------------ */

    var strToBytes = _.strToBytes = (function (exports) {
        /* Convert string into bytes.
         *
         * |Name         |Desc              |
         * |-------------|------------------|
         * |str          |String to convert |
         * |encoding=utf8|Encoding of string|
         * |return       |Bytes array       |
         *
         * Supported encoding: utf8, hex, base64
         */

        /* example
         * strToBytes('licia'); // -> [108, 105, 99, 105, 97]
         * strToBytes('qK6b/w==', 'base64'); // -> [168, 174, 155, 255]
         */

        /* typescript
         * export declare function strToBytes(str: string, encoding?: string): number[];
         */

        /* dependencies
         * utf8 hex base64 
         */

        exports = function(str) {
            var encoding =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : 'utf8';
            if (encoding === 'hex') return hex.decode(str);
            if (encoding === 'base64') return base64.decode(str);
            var bytes = [];

            if (encoding === 'utf8') {
                str = utf8.encode(str);
            }

            for (var i = 0, len = str.length; i < len; i++) {
                bytes.push(str.charCodeAt(i) & 0xff);
            }

            return bytes;
        };

        return exports;
    })({});

    /* ------------------------------ md5 ------------------------------ */
    _.md5 = (function (exports) {
        /* MD5 implementation.
         *
         * |Name  |Desc              |
         * |------|------------------|
         * |msg   |Message to encrypt|
         * |return|MD5 hash          |
         */

        /* example
         * md5('licia'); // -> 'e59f337d85e9a467f1783fab282a41d0'
         */

        /* typescript
         * export declare function md5(msg: string | number[]): string;
         */

        /* dependencies
         * isStr strToBytes hex bytesToWords wordsToBytes 
         */ // https://github.com/pvorb/node-md5

        exports = function(msg) {
            if (isStr(msg)) msg = strToBytes(msg);
            var m = bytesToWords(msg);
            var l = msg.length * 8;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878; // Swap endian

            for (var i = 0; i < m.length; i++) {
                m[i] =
                    (((m[i] << 8) | (m[i] >>> 24)) & 0x00ff00ff) |
                    (((m[i] << 24) | (m[i] >>> 8)) & 0xff00ff00);
            } // Padding

            m[l >>> 5] |= 0x80 << l % 32;
            m[(((l + 64) >>> 9) << 4) + 14] = l;

            for (var _i = 0; _i < m.length; _i += 16) {
                var aa = a;
                var bb = b;
                var cc = c;
                var dd = d;
                a = FF(a, b, c, d, m[_i + 0], 7, -680876936);
                d = FF(d, a, b, c, m[_i + 1], 12, -389564586);
                c = FF(c, d, a, b, m[_i + 2], 17, 606105819);
                b = FF(b, c, d, a, m[_i + 3], 22, -1044525330);
                a = FF(a, b, c, d, m[_i + 4], 7, -176418897);
                d = FF(d, a, b, c, m[_i + 5], 12, 1200080426);
                c = FF(c, d, a, b, m[_i + 6], 17, -1473231341);
                b = FF(b, c, d, a, m[_i + 7], 22, -45705983);
                a = FF(a, b, c, d, m[_i + 8], 7, 1770035416);
                d = FF(d, a, b, c, m[_i + 9], 12, -1958414417);
                c = FF(c, d, a, b, m[_i + 10], 17, -42063);
                b = FF(b, c, d, a, m[_i + 11], 22, -1990404162);
                a = FF(a, b, c, d, m[_i + 12], 7, 1804603682);
                d = FF(d, a, b, c, m[_i + 13], 12, -40341101);
                c = FF(c, d, a, b, m[_i + 14], 17, -1502002290);
                b = FF(b, c, d, a, m[_i + 15], 22, 1236535329);
                a = GG(a, b, c, d, m[_i + 1], 5, -165796510);
                d = GG(d, a, b, c, m[_i + 6], 9, -1069501632);
                c = GG(c, d, a, b, m[_i + 11], 14, 643717713);
                b = GG(b, c, d, a, m[_i + 0], 20, -373897302);
                a = GG(a, b, c, d, m[_i + 5], 5, -701558691);
                d = GG(d, a, b, c, m[_i + 10], 9, 38016083);
                c = GG(c, d, a, b, m[_i + 15], 14, -660478335);
                b = GG(b, c, d, a, m[_i + 4], 20, -405537848);
                a = GG(a, b, c, d, m[_i + 9], 5, 568446438);
                d = GG(d, a, b, c, m[_i + 14], 9, -1019803690);
                c = GG(c, d, a, b, m[_i + 3], 14, -187363961);
                b = GG(b, c, d, a, m[_i + 8], 20, 1163531501);
                a = GG(a, b, c, d, m[_i + 13], 5, -1444681467);
                d = GG(d, a, b, c, m[_i + 2], 9, -51403784);
                c = GG(c, d, a, b, m[_i + 7], 14, 1735328473);
                b = GG(b, c, d, a, m[_i + 12], 20, -1926607734);
                a = HH(a, b, c, d, m[_i + 5], 4, -378558);
                d = HH(d, a, b, c, m[_i + 8], 11, -2022574463);
                c = HH(c, d, a, b, m[_i + 11], 16, 1839030562);
                b = HH(b, c, d, a, m[_i + 14], 23, -35309556);
                a = HH(a, b, c, d, m[_i + 1], 4, -1530992060);
                d = HH(d, a, b, c, m[_i + 4], 11, 1272893353);
                c = HH(c, d, a, b, m[_i + 7], 16, -155497632);
                b = HH(b, c, d, a, m[_i + 10], 23, -1094730640);
                a = HH(a, b, c, d, m[_i + 13], 4, 681279174);
                d = HH(d, a, b, c, m[_i + 0], 11, -358537222);
                c = HH(c, d, a, b, m[_i + 3], 16, -722521979);
                b = HH(b, c, d, a, m[_i + 6], 23, 76029189);
                a = HH(a, b, c, d, m[_i + 9], 4, -640364487);
                d = HH(d, a, b, c, m[_i + 12], 11, -421815835);
                c = HH(c, d, a, b, m[_i + 15], 16, 530742520);
                b = HH(b, c, d, a, m[_i + 2], 23, -995338651);
                a = II(a, b, c, d, m[_i + 0], 6, -198630844);
                d = II(d, a, b, c, m[_i + 7], 10, 1126891415);
                c = II(c, d, a, b, m[_i + 14], 15, -1416354905);
                b = II(b, c, d, a, m[_i + 5], 21, -57434055);
                a = II(a, b, c, d, m[_i + 12], 6, 1700485571);
                d = II(d, a, b, c, m[_i + 3], 10, -1894986606);
                c = II(c, d, a, b, m[_i + 10], 15, -1051523);
                b = II(b, c, d, a, m[_i + 1], 21, -2054922799);
                a = II(a, b, c, d, m[_i + 8], 6, 1873313359);
                d = II(d, a, b, c, m[_i + 15], 10, -30611744);
                c = II(c, d, a, b, m[_i + 6], 15, -1560198380);
                b = II(b, c, d, a, m[_i + 13], 21, 1309151649);
                a = II(a, b, c, d, m[_i + 4], 6, -145523070);
                d = II(d, a, b, c, m[_i + 11], 10, -1120210379);
                c = II(c, d, a, b, m[_i + 2], 15, 718787259);
                b = II(b, c, d, a, m[_i + 9], 21, -343485551);
                a = (a + aa) >>> 0;
                b = (b + bb) >>> 0;
                c = (c + cc) >>> 0;
                d = (d + dd) >>> 0;
            }

            return hex.encode(wordsToBytes(endian([a, b, c, d])));
        };

        function FF(a, b, c, d, x, s, t) {
            var n = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function GG(a, b, c, d, x, s, t) {
            var n = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
            return ((n << s) | (n >>> (32 - s))) + b;
        }

        function endian(n) {
            if (n.constructor == Number) {
                return (rotl(n, 8) & 0x00ff00ff) | (rotl(n, 24) & 0xff00ff00);
            }

            for (var i = 0; i < n.length; i++) {
                n[i] = endian(n[i]);
            }

            return n;
        }

        function rotl(n, b) {
            return (n << b) | (n >>> (32 - b));
        }

        return exports;
    })({});

    return _;
}));