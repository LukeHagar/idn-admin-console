import { g as getDefaultExportFromCjs, a as getAugmentedNamespace, c as commonjsGlobal } from './_commonjsHelpers-2155838d.js';
import require$$0$2 from 'fs';
import require$$2 from 'path';
import require$$3 from 'react-native-fs';
import Stream from 'stream';
import http from 'http';
import Url from 'url';
import require$$0$1 from 'punycode';
import require$$4 from 'https';
import zlib from 'zlib';
import require$$5 from 'react-native-fetch-blob';

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var alasql_fs = {exports: {}};

var nodePonyfill = {exports: {}};

var publicApi = {};

var URL$2 = {exports: {}};

var lib$1;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib$1;
	hasRequiredLib = 1;

	var conversions = {};
	lib$1 = conversions;

	function sign(x) {
	    return x < 0 ? -1 : 1;
	}

	function evenRound(x) {
	    // Round x to the nearest integer, choosing the even integer if it lies halfway between two.
	    if ((x % 1) === 0.5 && (x & 1) === 0) { // [even number].5; round down (i.e. floor)
	        return Math.floor(x);
	    } else {
	        return Math.round(x);
	    }
	}

	function createNumberConversion(bitLength, typeOpts) {
	    if (!typeOpts.unsigned) {
	        --bitLength;
	    }
	    const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
	    const upperBound = Math.pow(2, bitLength) - 1;

	    const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
	    const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);

	    return function(V, opts) {
	        if (!opts) opts = {};

	        let x = +V;

	        if (opts.enforceRange) {
	            if (!Number.isFinite(x)) {
	                throw new TypeError("Argument is not a finite number");
	            }

	            x = sign(x) * Math.floor(Math.abs(x));
	            if (x < lowerBound || x > upperBound) {
	                throw new TypeError("Argument is not in byte range");
	            }

	            return x;
	        }

	        if (!isNaN(x) && opts.clamp) {
	            x = evenRound(x);

	            if (x < lowerBound) x = lowerBound;
	            if (x > upperBound) x = upperBound;
	            return x;
	        }

	        if (!Number.isFinite(x) || x === 0) {
	            return 0;
	        }

	        x = sign(x) * Math.floor(Math.abs(x));
	        x = x % moduloVal;

	        if (!typeOpts.unsigned && x >= moduloBound) {
	            return x - moduloVal;
	        } else if (typeOpts.unsigned) {
	            if (x < 0) {
	              x += moduloVal;
	            } else if (x === -0) { // don't return negative zero
	              return 0;
	            }
	        }

	        return x;
	    }
	}

	conversions["void"] = function () {
	    return undefined;
	};

	conversions["boolean"] = function (val) {
	    return !!val;
	};

	conversions["byte"] = createNumberConversion(8, { unsigned: false });
	conversions["octet"] = createNumberConversion(8, { unsigned: true });

	conversions["short"] = createNumberConversion(16, { unsigned: false });
	conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });

	conversions["long"] = createNumberConversion(32, { unsigned: false });
	conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });

	conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
	conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });

	conversions["double"] = function (V) {
	    const x = +V;

	    if (!Number.isFinite(x)) {
	        throw new TypeError("Argument is not a finite floating-point value");
	    }

	    return x;
	};

	conversions["unrestricted double"] = function (V) {
	    const x = +V;

	    if (isNaN(x)) {
	        throw new TypeError("Argument is NaN");
	    }

	    return x;
	};

	// not quite valid, but good enough for JS
	conversions["float"] = conversions["double"];
	conversions["unrestricted float"] = conversions["unrestricted double"];

	conversions["DOMString"] = function (V, opts) {
	    if (!opts) opts = {};

	    if (opts.treatNullAsEmptyString && V === null) {
	        return "";
	    }

	    return String(V);
	};

	conversions["ByteString"] = function (V, opts) {
	    const x = String(V);
	    let c = undefined;
	    for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
	        if (c > 255) {
	            throw new TypeError("Argument is not a valid bytestring");
	        }
	    }

	    return x;
	};

	conversions["USVString"] = function (V) {
	    const S = String(V);
	    const n = S.length;
	    const U = [];
	    for (let i = 0; i < n; ++i) {
	        const c = S.charCodeAt(i);
	        if (c < 0xD800 || c > 0xDFFF) {
	            U.push(String.fromCodePoint(c));
	        } else if (0xDC00 <= c && c <= 0xDFFF) {
	            U.push(String.fromCodePoint(0xFFFD));
	        } else {
	            if (i === n - 1) {
	                U.push(String.fromCodePoint(0xFFFD));
	            } else {
	                const d = S.charCodeAt(i + 1);
	                if (0xDC00 <= d && d <= 0xDFFF) {
	                    const a = c & 0x3FF;
	                    const b = d & 0x3FF;
	                    U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
	                    ++i;
	                } else {
	                    U.push(String.fromCodePoint(0xFFFD));
	                }
	            }
	        }
	    }

	    return U.join('');
	};

	conversions["Date"] = function (V, opts) {
	    if (!(V instanceof Date)) {
	        throw new TypeError("Argument is not a Date object");
	    }
	    if (isNaN(V)) {
	        return undefined;
	    }

	    return V;
	};

	conversions["RegExp"] = function (V, opts) {
	    if (!(V instanceof RegExp)) {
	        V = new RegExp(V);
	    }

	    return V;
	};
	return lib$1;
}

var utils$1 = {exports: {}};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils$1.exports;
	hasRequiredUtils = 1;
	(function (module) {

		module.exports.mixin = function mixin(target, source) {
		  const keys = Object.getOwnPropertyNames(source);
		  for (let i = 0; i < keys.length; ++i) {
		    Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
		  }
		};

		module.exports.wrapperSymbol = Symbol("wrapper");
		module.exports.implSymbol = Symbol("impl");

		module.exports.wrapperForImpl = function (impl) {
		  return impl[module.exports.wrapperSymbol];
		};

		module.exports.implForWrapper = function (wrapper) {
		  return wrapper[module.exports.implSymbol];
		}; 
	} (utils$1));
	return utils$1.exports;
}

var URLImpl = {};

var urlStateMachine = {exports: {}};

var tr46 = {};

var require$$1 = [
	[
		[
			0,
			44
		],
		"disallowed_STD3_valid"
	],
	[
		[
			45,
			46
		],
		"valid"
	],
	[
		[
			47,
			47
		],
		"disallowed_STD3_valid"
	],
	[
		[
			48,
			57
		],
		"valid"
	],
	[
		[
			58,
			64
		],
		"disallowed_STD3_valid"
	],
	[
		[
			65,
			65
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			66,
			66
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			67,
			67
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			68,
			68
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			69,
			69
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			70,
			70
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			71,
			71
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			72,
			72
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			73,
			73
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			74,
			74
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			75,
			75
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			76,
			76
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			77,
			77
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			78,
			78
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			79,
			79
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			80,
			80
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			81,
			81
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			82,
			82
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			83,
			83
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			84,
			84
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			85,
			85
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			86,
			86
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			87,
			87
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			88,
			88
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			89,
			89
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			90,
			90
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			91,
			96
		],
		"disallowed_STD3_valid"
	],
	[
		[
			97,
			122
		],
		"valid"
	],
	[
		[
			123,
			127
		],
		"disallowed_STD3_valid"
	],
	[
		[
			128,
			159
		],
		"disallowed"
	],
	[
		[
			160,
			160
		],
		"disallowed_STD3_mapped",
		[
			32
		]
	],
	[
		[
			161,
			167
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			168,
			168
		],
		"disallowed_STD3_mapped",
		[
			32,
			776
		]
	],
	[
		[
			169,
			169
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			170,
			170
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			171,
			172
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			173,
			173
		],
		"ignored"
	],
	[
		[
			174,
			174
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			175,
			175
		],
		"disallowed_STD3_mapped",
		[
			32,
			772
		]
	],
	[
		[
			176,
			177
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			178,
			178
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			179,
			179
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			180,
			180
		],
		"disallowed_STD3_mapped",
		[
			32,
			769
		]
	],
	[
		[
			181,
			181
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			182,
			182
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			183,
			183
		],
		"valid"
	],
	[
		[
			184,
			184
		],
		"disallowed_STD3_mapped",
		[
			32,
			807
		]
	],
	[
		[
			185,
			185
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			186,
			186
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			187,
			187
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			188,
			188
		],
		"mapped",
		[
			49,
			8260,
			52
		]
	],
	[
		[
			189,
			189
		],
		"mapped",
		[
			49,
			8260,
			50
		]
	],
	[
		[
			190,
			190
		],
		"mapped",
		[
			51,
			8260,
			52
		]
	],
	[
		[
			191,
			191
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			192,
			192
		],
		"mapped",
		[
			224
		]
	],
	[
		[
			193,
			193
		],
		"mapped",
		[
			225
		]
	],
	[
		[
			194,
			194
		],
		"mapped",
		[
			226
		]
	],
	[
		[
			195,
			195
		],
		"mapped",
		[
			227
		]
	],
	[
		[
			196,
			196
		],
		"mapped",
		[
			228
		]
	],
	[
		[
			197,
			197
		],
		"mapped",
		[
			229
		]
	],
	[
		[
			198,
			198
		],
		"mapped",
		[
			230
		]
	],
	[
		[
			199,
			199
		],
		"mapped",
		[
			231
		]
	],
	[
		[
			200,
			200
		],
		"mapped",
		[
			232
		]
	],
	[
		[
			201,
			201
		],
		"mapped",
		[
			233
		]
	],
	[
		[
			202,
			202
		],
		"mapped",
		[
			234
		]
	],
	[
		[
			203,
			203
		],
		"mapped",
		[
			235
		]
	],
	[
		[
			204,
			204
		],
		"mapped",
		[
			236
		]
	],
	[
		[
			205,
			205
		],
		"mapped",
		[
			237
		]
	],
	[
		[
			206,
			206
		],
		"mapped",
		[
			238
		]
	],
	[
		[
			207,
			207
		],
		"mapped",
		[
			239
		]
	],
	[
		[
			208,
			208
		],
		"mapped",
		[
			240
		]
	],
	[
		[
			209,
			209
		],
		"mapped",
		[
			241
		]
	],
	[
		[
			210,
			210
		],
		"mapped",
		[
			242
		]
	],
	[
		[
			211,
			211
		],
		"mapped",
		[
			243
		]
	],
	[
		[
			212,
			212
		],
		"mapped",
		[
			244
		]
	],
	[
		[
			213,
			213
		],
		"mapped",
		[
			245
		]
	],
	[
		[
			214,
			214
		],
		"mapped",
		[
			246
		]
	],
	[
		[
			215,
			215
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			216,
			216
		],
		"mapped",
		[
			248
		]
	],
	[
		[
			217,
			217
		],
		"mapped",
		[
			249
		]
	],
	[
		[
			218,
			218
		],
		"mapped",
		[
			250
		]
	],
	[
		[
			219,
			219
		],
		"mapped",
		[
			251
		]
	],
	[
		[
			220,
			220
		],
		"mapped",
		[
			252
		]
	],
	[
		[
			221,
			221
		],
		"mapped",
		[
			253
		]
	],
	[
		[
			222,
			222
		],
		"mapped",
		[
			254
		]
	],
	[
		[
			223,
			223
		],
		"deviation",
		[
			115,
			115
		]
	],
	[
		[
			224,
			246
		],
		"valid"
	],
	[
		[
			247,
			247
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			248,
			255
		],
		"valid"
	],
	[
		[
			256,
			256
		],
		"mapped",
		[
			257
		]
	],
	[
		[
			257,
			257
		],
		"valid"
	],
	[
		[
			258,
			258
		],
		"mapped",
		[
			259
		]
	],
	[
		[
			259,
			259
		],
		"valid"
	],
	[
		[
			260,
			260
		],
		"mapped",
		[
			261
		]
	],
	[
		[
			261,
			261
		],
		"valid"
	],
	[
		[
			262,
			262
		],
		"mapped",
		[
			263
		]
	],
	[
		[
			263,
			263
		],
		"valid"
	],
	[
		[
			264,
			264
		],
		"mapped",
		[
			265
		]
	],
	[
		[
			265,
			265
		],
		"valid"
	],
	[
		[
			266,
			266
		],
		"mapped",
		[
			267
		]
	],
	[
		[
			267,
			267
		],
		"valid"
	],
	[
		[
			268,
			268
		],
		"mapped",
		[
			269
		]
	],
	[
		[
			269,
			269
		],
		"valid"
	],
	[
		[
			270,
			270
		],
		"mapped",
		[
			271
		]
	],
	[
		[
			271,
			271
		],
		"valid"
	],
	[
		[
			272,
			272
		],
		"mapped",
		[
			273
		]
	],
	[
		[
			273,
			273
		],
		"valid"
	],
	[
		[
			274,
			274
		],
		"mapped",
		[
			275
		]
	],
	[
		[
			275,
			275
		],
		"valid"
	],
	[
		[
			276,
			276
		],
		"mapped",
		[
			277
		]
	],
	[
		[
			277,
			277
		],
		"valid"
	],
	[
		[
			278,
			278
		],
		"mapped",
		[
			279
		]
	],
	[
		[
			279,
			279
		],
		"valid"
	],
	[
		[
			280,
			280
		],
		"mapped",
		[
			281
		]
	],
	[
		[
			281,
			281
		],
		"valid"
	],
	[
		[
			282,
			282
		],
		"mapped",
		[
			283
		]
	],
	[
		[
			283,
			283
		],
		"valid"
	],
	[
		[
			284,
			284
		],
		"mapped",
		[
			285
		]
	],
	[
		[
			285,
			285
		],
		"valid"
	],
	[
		[
			286,
			286
		],
		"mapped",
		[
			287
		]
	],
	[
		[
			287,
			287
		],
		"valid"
	],
	[
		[
			288,
			288
		],
		"mapped",
		[
			289
		]
	],
	[
		[
			289,
			289
		],
		"valid"
	],
	[
		[
			290,
			290
		],
		"mapped",
		[
			291
		]
	],
	[
		[
			291,
			291
		],
		"valid"
	],
	[
		[
			292,
			292
		],
		"mapped",
		[
			293
		]
	],
	[
		[
			293,
			293
		],
		"valid"
	],
	[
		[
			294,
			294
		],
		"mapped",
		[
			295
		]
	],
	[
		[
			295,
			295
		],
		"valid"
	],
	[
		[
			296,
			296
		],
		"mapped",
		[
			297
		]
	],
	[
		[
			297,
			297
		],
		"valid"
	],
	[
		[
			298,
			298
		],
		"mapped",
		[
			299
		]
	],
	[
		[
			299,
			299
		],
		"valid"
	],
	[
		[
			300,
			300
		],
		"mapped",
		[
			301
		]
	],
	[
		[
			301,
			301
		],
		"valid"
	],
	[
		[
			302,
			302
		],
		"mapped",
		[
			303
		]
	],
	[
		[
			303,
			303
		],
		"valid"
	],
	[
		[
			304,
			304
		],
		"mapped",
		[
			105,
			775
		]
	],
	[
		[
			305,
			305
		],
		"valid"
	],
	[
		[
			306,
			307
		],
		"mapped",
		[
			105,
			106
		]
	],
	[
		[
			308,
			308
		],
		"mapped",
		[
			309
		]
	],
	[
		[
			309,
			309
		],
		"valid"
	],
	[
		[
			310,
			310
		],
		"mapped",
		[
			311
		]
	],
	[
		[
			311,
			312
		],
		"valid"
	],
	[
		[
			313,
			313
		],
		"mapped",
		[
			314
		]
	],
	[
		[
			314,
			314
		],
		"valid"
	],
	[
		[
			315,
			315
		],
		"mapped",
		[
			316
		]
	],
	[
		[
			316,
			316
		],
		"valid"
	],
	[
		[
			317,
			317
		],
		"mapped",
		[
			318
		]
	],
	[
		[
			318,
			318
		],
		"valid"
	],
	[
		[
			319,
			320
		],
		"mapped",
		[
			108,
			183
		]
	],
	[
		[
			321,
			321
		],
		"mapped",
		[
			322
		]
	],
	[
		[
			322,
			322
		],
		"valid"
	],
	[
		[
			323,
			323
		],
		"mapped",
		[
			324
		]
	],
	[
		[
			324,
			324
		],
		"valid"
	],
	[
		[
			325,
			325
		],
		"mapped",
		[
			326
		]
	],
	[
		[
			326,
			326
		],
		"valid"
	],
	[
		[
			327,
			327
		],
		"mapped",
		[
			328
		]
	],
	[
		[
			328,
			328
		],
		"valid"
	],
	[
		[
			329,
			329
		],
		"mapped",
		[
			700,
			110
		]
	],
	[
		[
			330,
			330
		],
		"mapped",
		[
			331
		]
	],
	[
		[
			331,
			331
		],
		"valid"
	],
	[
		[
			332,
			332
		],
		"mapped",
		[
			333
		]
	],
	[
		[
			333,
			333
		],
		"valid"
	],
	[
		[
			334,
			334
		],
		"mapped",
		[
			335
		]
	],
	[
		[
			335,
			335
		],
		"valid"
	],
	[
		[
			336,
			336
		],
		"mapped",
		[
			337
		]
	],
	[
		[
			337,
			337
		],
		"valid"
	],
	[
		[
			338,
			338
		],
		"mapped",
		[
			339
		]
	],
	[
		[
			339,
			339
		],
		"valid"
	],
	[
		[
			340,
			340
		],
		"mapped",
		[
			341
		]
	],
	[
		[
			341,
			341
		],
		"valid"
	],
	[
		[
			342,
			342
		],
		"mapped",
		[
			343
		]
	],
	[
		[
			343,
			343
		],
		"valid"
	],
	[
		[
			344,
			344
		],
		"mapped",
		[
			345
		]
	],
	[
		[
			345,
			345
		],
		"valid"
	],
	[
		[
			346,
			346
		],
		"mapped",
		[
			347
		]
	],
	[
		[
			347,
			347
		],
		"valid"
	],
	[
		[
			348,
			348
		],
		"mapped",
		[
			349
		]
	],
	[
		[
			349,
			349
		],
		"valid"
	],
	[
		[
			350,
			350
		],
		"mapped",
		[
			351
		]
	],
	[
		[
			351,
			351
		],
		"valid"
	],
	[
		[
			352,
			352
		],
		"mapped",
		[
			353
		]
	],
	[
		[
			353,
			353
		],
		"valid"
	],
	[
		[
			354,
			354
		],
		"mapped",
		[
			355
		]
	],
	[
		[
			355,
			355
		],
		"valid"
	],
	[
		[
			356,
			356
		],
		"mapped",
		[
			357
		]
	],
	[
		[
			357,
			357
		],
		"valid"
	],
	[
		[
			358,
			358
		],
		"mapped",
		[
			359
		]
	],
	[
		[
			359,
			359
		],
		"valid"
	],
	[
		[
			360,
			360
		],
		"mapped",
		[
			361
		]
	],
	[
		[
			361,
			361
		],
		"valid"
	],
	[
		[
			362,
			362
		],
		"mapped",
		[
			363
		]
	],
	[
		[
			363,
			363
		],
		"valid"
	],
	[
		[
			364,
			364
		],
		"mapped",
		[
			365
		]
	],
	[
		[
			365,
			365
		],
		"valid"
	],
	[
		[
			366,
			366
		],
		"mapped",
		[
			367
		]
	],
	[
		[
			367,
			367
		],
		"valid"
	],
	[
		[
			368,
			368
		],
		"mapped",
		[
			369
		]
	],
	[
		[
			369,
			369
		],
		"valid"
	],
	[
		[
			370,
			370
		],
		"mapped",
		[
			371
		]
	],
	[
		[
			371,
			371
		],
		"valid"
	],
	[
		[
			372,
			372
		],
		"mapped",
		[
			373
		]
	],
	[
		[
			373,
			373
		],
		"valid"
	],
	[
		[
			374,
			374
		],
		"mapped",
		[
			375
		]
	],
	[
		[
			375,
			375
		],
		"valid"
	],
	[
		[
			376,
			376
		],
		"mapped",
		[
			255
		]
	],
	[
		[
			377,
			377
		],
		"mapped",
		[
			378
		]
	],
	[
		[
			378,
			378
		],
		"valid"
	],
	[
		[
			379,
			379
		],
		"mapped",
		[
			380
		]
	],
	[
		[
			380,
			380
		],
		"valid"
	],
	[
		[
			381,
			381
		],
		"mapped",
		[
			382
		]
	],
	[
		[
			382,
			382
		],
		"valid"
	],
	[
		[
			383,
			383
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			384,
			384
		],
		"valid"
	],
	[
		[
			385,
			385
		],
		"mapped",
		[
			595
		]
	],
	[
		[
			386,
			386
		],
		"mapped",
		[
			387
		]
	],
	[
		[
			387,
			387
		],
		"valid"
	],
	[
		[
			388,
			388
		],
		"mapped",
		[
			389
		]
	],
	[
		[
			389,
			389
		],
		"valid"
	],
	[
		[
			390,
			390
		],
		"mapped",
		[
			596
		]
	],
	[
		[
			391,
			391
		],
		"mapped",
		[
			392
		]
	],
	[
		[
			392,
			392
		],
		"valid"
	],
	[
		[
			393,
			393
		],
		"mapped",
		[
			598
		]
	],
	[
		[
			394,
			394
		],
		"mapped",
		[
			599
		]
	],
	[
		[
			395,
			395
		],
		"mapped",
		[
			396
		]
	],
	[
		[
			396,
			397
		],
		"valid"
	],
	[
		[
			398,
			398
		],
		"mapped",
		[
			477
		]
	],
	[
		[
			399,
			399
		],
		"mapped",
		[
			601
		]
	],
	[
		[
			400,
			400
		],
		"mapped",
		[
			603
		]
	],
	[
		[
			401,
			401
		],
		"mapped",
		[
			402
		]
	],
	[
		[
			402,
			402
		],
		"valid"
	],
	[
		[
			403,
			403
		],
		"mapped",
		[
			608
		]
	],
	[
		[
			404,
			404
		],
		"mapped",
		[
			611
		]
	],
	[
		[
			405,
			405
		],
		"valid"
	],
	[
		[
			406,
			406
		],
		"mapped",
		[
			617
		]
	],
	[
		[
			407,
			407
		],
		"mapped",
		[
			616
		]
	],
	[
		[
			408,
			408
		],
		"mapped",
		[
			409
		]
	],
	[
		[
			409,
			411
		],
		"valid"
	],
	[
		[
			412,
			412
		],
		"mapped",
		[
			623
		]
	],
	[
		[
			413,
			413
		],
		"mapped",
		[
			626
		]
	],
	[
		[
			414,
			414
		],
		"valid"
	],
	[
		[
			415,
			415
		],
		"mapped",
		[
			629
		]
	],
	[
		[
			416,
			416
		],
		"mapped",
		[
			417
		]
	],
	[
		[
			417,
			417
		],
		"valid"
	],
	[
		[
			418,
			418
		],
		"mapped",
		[
			419
		]
	],
	[
		[
			419,
			419
		],
		"valid"
	],
	[
		[
			420,
			420
		],
		"mapped",
		[
			421
		]
	],
	[
		[
			421,
			421
		],
		"valid"
	],
	[
		[
			422,
			422
		],
		"mapped",
		[
			640
		]
	],
	[
		[
			423,
			423
		],
		"mapped",
		[
			424
		]
	],
	[
		[
			424,
			424
		],
		"valid"
	],
	[
		[
			425,
			425
		],
		"mapped",
		[
			643
		]
	],
	[
		[
			426,
			427
		],
		"valid"
	],
	[
		[
			428,
			428
		],
		"mapped",
		[
			429
		]
	],
	[
		[
			429,
			429
		],
		"valid"
	],
	[
		[
			430,
			430
		],
		"mapped",
		[
			648
		]
	],
	[
		[
			431,
			431
		],
		"mapped",
		[
			432
		]
	],
	[
		[
			432,
			432
		],
		"valid"
	],
	[
		[
			433,
			433
		],
		"mapped",
		[
			650
		]
	],
	[
		[
			434,
			434
		],
		"mapped",
		[
			651
		]
	],
	[
		[
			435,
			435
		],
		"mapped",
		[
			436
		]
	],
	[
		[
			436,
			436
		],
		"valid"
	],
	[
		[
			437,
			437
		],
		"mapped",
		[
			438
		]
	],
	[
		[
			438,
			438
		],
		"valid"
	],
	[
		[
			439,
			439
		],
		"mapped",
		[
			658
		]
	],
	[
		[
			440,
			440
		],
		"mapped",
		[
			441
		]
	],
	[
		[
			441,
			443
		],
		"valid"
	],
	[
		[
			444,
			444
		],
		"mapped",
		[
			445
		]
	],
	[
		[
			445,
			451
		],
		"valid"
	],
	[
		[
			452,
			454
		],
		"mapped",
		[
			100,
			382
		]
	],
	[
		[
			455,
			457
		],
		"mapped",
		[
			108,
			106
		]
	],
	[
		[
			458,
			460
		],
		"mapped",
		[
			110,
			106
		]
	],
	[
		[
			461,
			461
		],
		"mapped",
		[
			462
		]
	],
	[
		[
			462,
			462
		],
		"valid"
	],
	[
		[
			463,
			463
		],
		"mapped",
		[
			464
		]
	],
	[
		[
			464,
			464
		],
		"valid"
	],
	[
		[
			465,
			465
		],
		"mapped",
		[
			466
		]
	],
	[
		[
			466,
			466
		],
		"valid"
	],
	[
		[
			467,
			467
		],
		"mapped",
		[
			468
		]
	],
	[
		[
			468,
			468
		],
		"valid"
	],
	[
		[
			469,
			469
		],
		"mapped",
		[
			470
		]
	],
	[
		[
			470,
			470
		],
		"valid"
	],
	[
		[
			471,
			471
		],
		"mapped",
		[
			472
		]
	],
	[
		[
			472,
			472
		],
		"valid"
	],
	[
		[
			473,
			473
		],
		"mapped",
		[
			474
		]
	],
	[
		[
			474,
			474
		],
		"valid"
	],
	[
		[
			475,
			475
		],
		"mapped",
		[
			476
		]
	],
	[
		[
			476,
			477
		],
		"valid"
	],
	[
		[
			478,
			478
		],
		"mapped",
		[
			479
		]
	],
	[
		[
			479,
			479
		],
		"valid"
	],
	[
		[
			480,
			480
		],
		"mapped",
		[
			481
		]
	],
	[
		[
			481,
			481
		],
		"valid"
	],
	[
		[
			482,
			482
		],
		"mapped",
		[
			483
		]
	],
	[
		[
			483,
			483
		],
		"valid"
	],
	[
		[
			484,
			484
		],
		"mapped",
		[
			485
		]
	],
	[
		[
			485,
			485
		],
		"valid"
	],
	[
		[
			486,
			486
		],
		"mapped",
		[
			487
		]
	],
	[
		[
			487,
			487
		],
		"valid"
	],
	[
		[
			488,
			488
		],
		"mapped",
		[
			489
		]
	],
	[
		[
			489,
			489
		],
		"valid"
	],
	[
		[
			490,
			490
		],
		"mapped",
		[
			491
		]
	],
	[
		[
			491,
			491
		],
		"valid"
	],
	[
		[
			492,
			492
		],
		"mapped",
		[
			493
		]
	],
	[
		[
			493,
			493
		],
		"valid"
	],
	[
		[
			494,
			494
		],
		"mapped",
		[
			495
		]
	],
	[
		[
			495,
			496
		],
		"valid"
	],
	[
		[
			497,
			499
		],
		"mapped",
		[
			100,
			122
		]
	],
	[
		[
			500,
			500
		],
		"mapped",
		[
			501
		]
	],
	[
		[
			501,
			501
		],
		"valid"
	],
	[
		[
			502,
			502
		],
		"mapped",
		[
			405
		]
	],
	[
		[
			503,
			503
		],
		"mapped",
		[
			447
		]
	],
	[
		[
			504,
			504
		],
		"mapped",
		[
			505
		]
	],
	[
		[
			505,
			505
		],
		"valid"
	],
	[
		[
			506,
			506
		],
		"mapped",
		[
			507
		]
	],
	[
		[
			507,
			507
		],
		"valid"
	],
	[
		[
			508,
			508
		],
		"mapped",
		[
			509
		]
	],
	[
		[
			509,
			509
		],
		"valid"
	],
	[
		[
			510,
			510
		],
		"mapped",
		[
			511
		]
	],
	[
		[
			511,
			511
		],
		"valid"
	],
	[
		[
			512,
			512
		],
		"mapped",
		[
			513
		]
	],
	[
		[
			513,
			513
		],
		"valid"
	],
	[
		[
			514,
			514
		],
		"mapped",
		[
			515
		]
	],
	[
		[
			515,
			515
		],
		"valid"
	],
	[
		[
			516,
			516
		],
		"mapped",
		[
			517
		]
	],
	[
		[
			517,
			517
		],
		"valid"
	],
	[
		[
			518,
			518
		],
		"mapped",
		[
			519
		]
	],
	[
		[
			519,
			519
		],
		"valid"
	],
	[
		[
			520,
			520
		],
		"mapped",
		[
			521
		]
	],
	[
		[
			521,
			521
		],
		"valid"
	],
	[
		[
			522,
			522
		],
		"mapped",
		[
			523
		]
	],
	[
		[
			523,
			523
		],
		"valid"
	],
	[
		[
			524,
			524
		],
		"mapped",
		[
			525
		]
	],
	[
		[
			525,
			525
		],
		"valid"
	],
	[
		[
			526,
			526
		],
		"mapped",
		[
			527
		]
	],
	[
		[
			527,
			527
		],
		"valid"
	],
	[
		[
			528,
			528
		],
		"mapped",
		[
			529
		]
	],
	[
		[
			529,
			529
		],
		"valid"
	],
	[
		[
			530,
			530
		],
		"mapped",
		[
			531
		]
	],
	[
		[
			531,
			531
		],
		"valid"
	],
	[
		[
			532,
			532
		],
		"mapped",
		[
			533
		]
	],
	[
		[
			533,
			533
		],
		"valid"
	],
	[
		[
			534,
			534
		],
		"mapped",
		[
			535
		]
	],
	[
		[
			535,
			535
		],
		"valid"
	],
	[
		[
			536,
			536
		],
		"mapped",
		[
			537
		]
	],
	[
		[
			537,
			537
		],
		"valid"
	],
	[
		[
			538,
			538
		],
		"mapped",
		[
			539
		]
	],
	[
		[
			539,
			539
		],
		"valid"
	],
	[
		[
			540,
			540
		],
		"mapped",
		[
			541
		]
	],
	[
		[
			541,
			541
		],
		"valid"
	],
	[
		[
			542,
			542
		],
		"mapped",
		[
			543
		]
	],
	[
		[
			543,
			543
		],
		"valid"
	],
	[
		[
			544,
			544
		],
		"mapped",
		[
			414
		]
	],
	[
		[
			545,
			545
		],
		"valid"
	],
	[
		[
			546,
			546
		],
		"mapped",
		[
			547
		]
	],
	[
		[
			547,
			547
		],
		"valid"
	],
	[
		[
			548,
			548
		],
		"mapped",
		[
			549
		]
	],
	[
		[
			549,
			549
		],
		"valid"
	],
	[
		[
			550,
			550
		],
		"mapped",
		[
			551
		]
	],
	[
		[
			551,
			551
		],
		"valid"
	],
	[
		[
			552,
			552
		],
		"mapped",
		[
			553
		]
	],
	[
		[
			553,
			553
		],
		"valid"
	],
	[
		[
			554,
			554
		],
		"mapped",
		[
			555
		]
	],
	[
		[
			555,
			555
		],
		"valid"
	],
	[
		[
			556,
			556
		],
		"mapped",
		[
			557
		]
	],
	[
		[
			557,
			557
		],
		"valid"
	],
	[
		[
			558,
			558
		],
		"mapped",
		[
			559
		]
	],
	[
		[
			559,
			559
		],
		"valid"
	],
	[
		[
			560,
			560
		],
		"mapped",
		[
			561
		]
	],
	[
		[
			561,
			561
		],
		"valid"
	],
	[
		[
			562,
			562
		],
		"mapped",
		[
			563
		]
	],
	[
		[
			563,
			563
		],
		"valid"
	],
	[
		[
			564,
			566
		],
		"valid"
	],
	[
		[
			567,
			569
		],
		"valid"
	],
	[
		[
			570,
			570
		],
		"mapped",
		[
			11365
		]
	],
	[
		[
			571,
			571
		],
		"mapped",
		[
			572
		]
	],
	[
		[
			572,
			572
		],
		"valid"
	],
	[
		[
			573,
			573
		],
		"mapped",
		[
			410
		]
	],
	[
		[
			574,
			574
		],
		"mapped",
		[
			11366
		]
	],
	[
		[
			575,
			576
		],
		"valid"
	],
	[
		[
			577,
			577
		],
		"mapped",
		[
			578
		]
	],
	[
		[
			578,
			578
		],
		"valid"
	],
	[
		[
			579,
			579
		],
		"mapped",
		[
			384
		]
	],
	[
		[
			580,
			580
		],
		"mapped",
		[
			649
		]
	],
	[
		[
			581,
			581
		],
		"mapped",
		[
			652
		]
	],
	[
		[
			582,
			582
		],
		"mapped",
		[
			583
		]
	],
	[
		[
			583,
			583
		],
		"valid"
	],
	[
		[
			584,
			584
		],
		"mapped",
		[
			585
		]
	],
	[
		[
			585,
			585
		],
		"valid"
	],
	[
		[
			586,
			586
		],
		"mapped",
		[
			587
		]
	],
	[
		[
			587,
			587
		],
		"valid"
	],
	[
		[
			588,
			588
		],
		"mapped",
		[
			589
		]
	],
	[
		[
			589,
			589
		],
		"valid"
	],
	[
		[
			590,
			590
		],
		"mapped",
		[
			591
		]
	],
	[
		[
			591,
			591
		],
		"valid"
	],
	[
		[
			592,
			680
		],
		"valid"
	],
	[
		[
			681,
			685
		],
		"valid"
	],
	[
		[
			686,
			687
		],
		"valid"
	],
	[
		[
			688,
			688
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			689,
			689
		],
		"mapped",
		[
			614
		]
	],
	[
		[
			690,
			690
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			691,
			691
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			692,
			692
		],
		"mapped",
		[
			633
		]
	],
	[
		[
			693,
			693
		],
		"mapped",
		[
			635
		]
	],
	[
		[
			694,
			694
		],
		"mapped",
		[
			641
		]
	],
	[
		[
			695,
			695
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			696,
			696
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			697,
			705
		],
		"valid"
	],
	[
		[
			706,
			709
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			710,
			721
		],
		"valid"
	],
	[
		[
			722,
			727
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			728,
			728
		],
		"disallowed_STD3_mapped",
		[
			32,
			774
		]
	],
	[
		[
			729,
			729
		],
		"disallowed_STD3_mapped",
		[
			32,
			775
		]
	],
	[
		[
			730,
			730
		],
		"disallowed_STD3_mapped",
		[
			32,
			778
		]
	],
	[
		[
			731,
			731
		],
		"disallowed_STD3_mapped",
		[
			32,
			808
		]
	],
	[
		[
			732,
			732
		],
		"disallowed_STD3_mapped",
		[
			32,
			771
		]
	],
	[
		[
			733,
			733
		],
		"disallowed_STD3_mapped",
		[
			32,
			779
		]
	],
	[
		[
			734,
			734
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			735,
			735
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			736,
			736
		],
		"mapped",
		[
			611
		]
	],
	[
		[
			737,
			737
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			738,
			738
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			739,
			739
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			740,
			740
		],
		"mapped",
		[
			661
		]
	],
	[
		[
			741,
			745
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			746,
			747
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			748,
			748
		],
		"valid"
	],
	[
		[
			749,
			749
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			750,
			750
		],
		"valid"
	],
	[
		[
			751,
			767
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			768,
			831
		],
		"valid"
	],
	[
		[
			832,
			832
		],
		"mapped",
		[
			768
		]
	],
	[
		[
			833,
			833
		],
		"mapped",
		[
			769
		]
	],
	[
		[
			834,
			834
		],
		"valid"
	],
	[
		[
			835,
			835
		],
		"mapped",
		[
			787
		]
	],
	[
		[
			836,
			836
		],
		"mapped",
		[
			776,
			769
		]
	],
	[
		[
			837,
			837
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			838,
			846
		],
		"valid"
	],
	[
		[
			847,
			847
		],
		"ignored"
	],
	[
		[
			848,
			855
		],
		"valid"
	],
	[
		[
			856,
			860
		],
		"valid"
	],
	[
		[
			861,
			863
		],
		"valid"
	],
	[
		[
			864,
			865
		],
		"valid"
	],
	[
		[
			866,
			866
		],
		"valid"
	],
	[
		[
			867,
			879
		],
		"valid"
	],
	[
		[
			880,
			880
		],
		"mapped",
		[
			881
		]
	],
	[
		[
			881,
			881
		],
		"valid"
	],
	[
		[
			882,
			882
		],
		"mapped",
		[
			883
		]
	],
	[
		[
			883,
			883
		],
		"valid"
	],
	[
		[
			884,
			884
		],
		"mapped",
		[
			697
		]
	],
	[
		[
			885,
			885
		],
		"valid"
	],
	[
		[
			886,
			886
		],
		"mapped",
		[
			887
		]
	],
	[
		[
			887,
			887
		],
		"valid"
	],
	[
		[
			888,
			889
		],
		"disallowed"
	],
	[
		[
			890,
			890
		],
		"disallowed_STD3_mapped",
		[
			32,
			953
		]
	],
	[
		[
			891,
			893
		],
		"valid"
	],
	[
		[
			894,
			894
		],
		"disallowed_STD3_mapped",
		[
			59
		]
	],
	[
		[
			895,
			895
		],
		"mapped",
		[
			1011
		]
	],
	[
		[
			896,
			899
		],
		"disallowed"
	],
	[
		[
			900,
			900
		],
		"disallowed_STD3_mapped",
		[
			32,
			769
		]
	],
	[
		[
			901,
			901
		],
		"disallowed_STD3_mapped",
		[
			32,
			776,
			769
		]
	],
	[
		[
			902,
			902
		],
		"mapped",
		[
			940
		]
	],
	[
		[
			903,
			903
		],
		"mapped",
		[
			183
		]
	],
	[
		[
			904,
			904
		],
		"mapped",
		[
			941
		]
	],
	[
		[
			905,
			905
		],
		"mapped",
		[
			942
		]
	],
	[
		[
			906,
			906
		],
		"mapped",
		[
			943
		]
	],
	[
		[
			907,
			907
		],
		"disallowed"
	],
	[
		[
			908,
			908
		],
		"mapped",
		[
			972
		]
	],
	[
		[
			909,
			909
		],
		"disallowed"
	],
	[
		[
			910,
			910
		],
		"mapped",
		[
			973
		]
	],
	[
		[
			911,
			911
		],
		"mapped",
		[
			974
		]
	],
	[
		[
			912,
			912
		],
		"valid"
	],
	[
		[
			913,
			913
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			914,
			914
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			915,
			915
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			916,
			916
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			917,
			917
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			918,
			918
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			919,
			919
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			920,
			920
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			921,
			921
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			922,
			922
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			923,
			923
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			924,
			924
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			925,
			925
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			926,
			926
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			927,
			927
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			928,
			928
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			929,
			929
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			930,
			930
		],
		"disallowed"
	],
	[
		[
			931,
			931
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			932,
			932
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			933,
			933
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			934,
			934
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			935,
			935
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			936,
			936
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			937,
			937
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			938,
			938
		],
		"mapped",
		[
			970
		]
	],
	[
		[
			939,
			939
		],
		"mapped",
		[
			971
		]
	],
	[
		[
			940,
			961
		],
		"valid"
	],
	[
		[
			962,
			962
		],
		"deviation",
		[
			963
		]
	],
	[
		[
			963,
			974
		],
		"valid"
	],
	[
		[
			975,
			975
		],
		"mapped",
		[
			983
		]
	],
	[
		[
			976,
			976
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			977,
			977
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			978,
			978
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			979,
			979
		],
		"mapped",
		[
			973
		]
	],
	[
		[
			980,
			980
		],
		"mapped",
		[
			971
		]
	],
	[
		[
			981,
			981
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			982,
			982
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			983,
			983
		],
		"valid"
	],
	[
		[
			984,
			984
		],
		"mapped",
		[
			985
		]
	],
	[
		[
			985,
			985
		],
		"valid"
	],
	[
		[
			986,
			986
		],
		"mapped",
		[
			987
		]
	],
	[
		[
			987,
			987
		],
		"valid"
	],
	[
		[
			988,
			988
		],
		"mapped",
		[
			989
		]
	],
	[
		[
			989,
			989
		],
		"valid"
	],
	[
		[
			990,
			990
		],
		"mapped",
		[
			991
		]
	],
	[
		[
			991,
			991
		],
		"valid"
	],
	[
		[
			992,
			992
		],
		"mapped",
		[
			993
		]
	],
	[
		[
			993,
			993
		],
		"valid"
	],
	[
		[
			994,
			994
		],
		"mapped",
		[
			995
		]
	],
	[
		[
			995,
			995
		],
		"valid"
	],
	[
		[
			996,
			996
		],
		"mapped",
		[
			997
		]
	],
	[
		[
			997,
			997
		],
		"valid"
	],
	[
		[
			998,
			998
		],
		"mapped",
		[
			999
		]
	],
	[
		[
			999,
			999
		],
		"valid"
	],
	[
		[
			1000,
			1000
		],
		"mapped",
		[
			1001
		]
	],
	[
		[
			1001,
			1001
		],
		"valid"
	],
	[
		[
			1002,
			1002
		],
		"mapped",
		[
			1003
		]
	],
	[
		[
			1003,
			1003
		],
		"valid"
	],
	[
		[
			1004,
			1004
		],
		"mapped",
		[
			1005
		]
	],
	[
		[
			1005,
			1005
		],
		"valid"
	],
	[
		[
			1006,
			1006
		],
		"mapped",
		[
			1007
		]
	],
	[
		[
			1007,
			1007
		],
		"valid"
	],
	[
		[
			1008,
			1008
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			1009,
			1009
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			1010,
			1010
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			1011,
			1011
		],
		"valid"
	],
	[
		[
			1012,
			1012
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			1013,
			1013
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			1014,
			1014
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1015,
			1015
		],
		"mapped",
		[
			1016
		]
	],
	[
		[
			1016,
			1016
		],
		"valid"
	],
	[
		[
			1017,
			1017
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			1018,
			1018
		],
		"mapped",
		[
			1019
		]
	],
	[
		[
			1019,
			1019
		],
		"valid"
	],
	[
		[
			1020,
			1020
		],
		"valid"
	],
	[
		[
			1021,
			1021
		],
		"mapped",
		[
			891
		]
	],
	[
		[
			1022,
			1022
		],
		"mapped",
		[
			892
		]
	],
	[
		[
			1023,
			1023
		],
		"mapped",
		[
			893
		]
	],
	[
		[
			1024,
			1024
		],
		"mapped",
		[
			1104
		]
	],
	[
		[
			1025,
			1025
		],
		"mapped",
		[
			1105
		]
	],
	[
		[
			1026,
			1026
		],
		"mapped",
		[
			1106
		]
	],
	[
		[
			1027,
			1027
		],
		"mapped",
		[
			1107
		]
	],
	[
		[
			1028,
			1028
		],
		"mapped",
		[
			1108
		]
	],
	[
		[
			1029,
			1029
		],
		"mapped",
		[
			1109
		]
	],
	[
		[
			1030,
			1030
		],
		"mapped",
		[
			1110
		]
	],
	[
		[
			1031,
			1031
		],
		"mapped",
		[
			1111
		]
	],
	[
		[
			1032,
			1032
		],
		"mapped",
		[
			1112
		]
	],
	[
		[
			1033,
			1033
		],
		"mapped",
		[
			1113
		]
	],
	[
		[
			1034,
			1034
		],
		"mapped",
		[
			1114
		]
	],
	[
		[
			1035,
			1035
		],
		"mapped",
		[
			1115
		]
	],
	[
		[
			1036,
			1036
		],
		"mapped",
		[
			1116
		]
	],
	[
		[
			1037,
			1037
		],
		"mapped",
		[
			1117
		]
	],
	[
		[
			1038,
			1038
		],
		"mapped",
		[
			1118
		]
	],
	[
		[
			1039,
			1039
		],
		"mapped",
		[
			1119
		]
	],
	[
		[
			1040,
			1040
		],
		"mapped",
		[
			1072
		]
	],
	[
		[
			1041,
			1041
		],
		"mapped",
		[
			1073
		]
	],
	[
		[
			1042,
			1042
		],
		"mapped",
		[
			1074
		]
	],
	[
		[
			1043,
			1043
		],
		"mapped",
		[
			1075
		]
	],
	[
		[
			1044,
			1044
		],
		"mapped",
		[
			1076
		]
	],
	[
		[
			1045,
			1045
		],
		"mapped",
		[
			1077
		]
	],
	[
		[
			1046,
			1046
		],
		"mapped",
		[
			1078
		]
	],
	[
		[
			1047,
			1047
		],
		"mapped",
		[
			1079
		]
	],
	[
		[
			1048,
			1048
		],
		"mapped",
		[
			1080
		]
	],
	[
		[
			1049,
			1049
		],
		"mapped",
		[
			1081
		]
	],
	[
		[
			1050,
			1050
		],
		"mapped",
		[
			1082
		]
	],
	[
		[
			1051,
			1051
		],
		"mapped",
		[
			1083
		]
	],
	[
		[
			1052,
			1052
		],
		"mapped",
		[
			1084
		]
	],
	[
		[
			1053,
			1053
		],
		"mapped",
		[
			1085
		]
	],
	[
		[
			1054,
			1054
		],
		"mapped",
		[
			1086
		]
	],
	[
		[
			1055,
			1055
		],
		"mapped",
		[
			1087
		]
	],
	[
		[
			1056,
			1056
		],
		"mapped",
		[
			1088
		]
	],
	[
		[
			1057,
			1057
		],
		"mapped",
		[
			1089
		]
	],
	[
		[
			1058,
			1058
		],
		"mapped",
		[
			1090
		]
	],
	[
		[
			1059,
			1059
		],
		"mapped",
		[
			1091
		]
	],
	[
		[
			1060,
			1060
		],
		"mapped",
		[
			1092
		]
	],
	[
		[
			1061,
			1061
		],
		"mapped",
		[
			1093
		]
	],
	[
		[
			1062,
			1062
		],
		"mapped",
		[
			1094
		]
	],
	[
		[
			1063,
			1063
		],
		"mapped",
		[
			1095
		]
	],
	[
		[
			1064,
			1064
		],
		"mapped",
		[
			1096
		]
	],
	[
		[
			1065,
			1065
		],
		"mapped",
		[
			1097
		]
	],
	[
		[
			1066,
			1066
		],
		"mapped",
		[
			1098
		]
	],
	[
		[
			1067,
			1067
		],
		"mapped",
		[
			1099
		]
	],
	[
		[
			1068,
			1068
		],
		"mapped",
		[
			1100
		]
	],
	[
		[
			1069,
			1069
		],
		"mapped",
		[
			1101
		]
	],
	[
		[
			1070,
			1070
		],
		"mapped",
		[
			1102
		]
	],
	[
		[
			1071,
			1071
		],
		"mapped",
		[
			1103
		]
	],
	[
		[
			1072,
			1103
		],
		"valid"
	],
	[
		[
			1104,
			1104
		],
		"valid"
	],
	[
		[
			1105,
			1116
		],
		"valid"
	],
	[
		[
			1117,
			1117
		],
		"valid"
	],
	[
		[
			1118,
			1119
		],
		"valid"
	],
	[
		[
			1120,
			1120
		],
		"mapped",
		[
			1121
		]
	],
	[
		[
			1121,
			1121
		],
		"valid"
	],
	[
		[
			1122,
			1122
		],
		"mapped",
		[
			1123
		]
	],
	[
		[
			1123,
			1123
		],
		"valid"
	],
	[
		[
			1124,
			1124
		],
		"mapped",
		[
			1125
		]
	],
	[
		[
			1125,
			1125
		],
		"valid"
	],
	[
		[
			1126,
			1126
		],
		"mapped",
		[
			1127
		]
	],
	[
		[
			1127,
			1127
		],
		"valid"
	],
	[
		[
			1128,
			1128
		],
		"mapped",
		[
			1129
		]
	],
	[
		[
			1129,
			1129
		],
		"valid"
	],
	[
		[
			1130,
			1130
		],
		"mapped",
		[
			1131
		]
	],
	[
		[
			1131,
			1131
		],
		"valid"
	],
	[
		[
			1132,
			1132
		],
		"mapped",
		[
			1133
		]
	],
	[
		[
			1133,
			1133
		],
		"valid"
	],
	[
		[
			1134,
			1134
		],
		"mapped",
		[
			1135
		]
	],
	[
		[
			1135,
			1135
		],
		"valid"
	],
	[
		[
			1136,
			1136
		],
		"mapped",
		[
			1137
		]
	],
	[
		[
			1137,
			1137
		],
		"valid"
	],
	[
		[
			1138,
			1138
		],
		"mapped",
		[
			1139
		]
	],
	[
		[
			1139,
			1139
		],
		"valid"
	],
	[
		[
			1140,
			1140
		],
		"mapped",
		[
			1141
		]
	],
	[
		[
			1141,
			1141
		],
		"valid"
	],
	[
		[
			1142,
			1142
		],
		"mapped",
		[
			1143
		]
	],
	[
		[
			1143,
			1143
		],
		"valid"
	],
	[
		[
			1144,
			1144
		],
		"mapped",
		[
			1145
		]
	],
	[
		[
			1145,
			1145
		],
		"valid"
	],
	[
		[
			1146,
			1146
		],
		"mapped",
		[
			1147
		]
	],
	[
		[
			1147,
			1147
		],
		"valid"
	],
	[
		[
			1148,
			1148
		],
		"mapped",
		[
			1149
		]
	],
	[
		[
			1149,
			1149
		],
		"valid"
	],
	[
		[
			1150,
			1150
		],
		"mapped",
		[
			1151
		]
	],
	[
		[
			1151,
			1151
		],
		"valid"
	],
	[
		[
			1152,
			1152
		],
		"mapped",
		[
			1153
		]
	],
	[
		[
			1153,
			1153
		],
		"valid"
	],
	[
		[
			1154,
			1154
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1155,
			1158
		],
		"valid"
	],
	[
		[
			1159,
			1159
		],
		"valid"
	],
	[
		[
			1160,
			1161
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1162,
			1162
		],
		"mapped",
		[
			1163
		]
	],
	[
		[
			1163,
			1163
		],
		"valid"
	],
	[
		[
			1164,
			1164
		],
		"mapped",
		[
			1165
		]
	],
	[
		[
			1165,
			1165
		],
		"valid"
	],
	[
		[
			1166,
			1166
		],
		"mapped",
		[
			1167
		]
	],
	[
		[
			1167,
			1167
		],
		"valid"
	],
	[
		[
			1168,
			1168
		],
		"mapped",
		[
			1169
		]
	],
	[
		[
			1169,
			1169
		],
		"valid"
	],
	[
		[
			1170,
			1170
		],
		"mapped",
		[
			1171
		]
	],
	[
		[
			1171,
			1171
		],
		"valid"
	],
	[
		[
			1172,
			1172
		],
		"mapped",
		[
			1173
		]
	],
	[
		[
			1173,
			1173
		],
		"valid"
	],
	[
		[
			1174,
			1174
		],
		"mapped",
		[
			1175
		]
	],
	[
		[
			1175,
			1175
		],
		"valid"
	],
	[
		[
			1176,
			1176
		],
		"mapped",
		[
			1177
		]
	],
	[
		[
			1177,
			1177
		],
		"valid"
	],
	[
		[
			1178,
			1178
		],
		"mapped",
		[
			1179
		]
	],
	[
		[
			1179,
			1179
		],
		"valid"
	],
	[
		[
			1180,
			1180
		],
		"mapped",
		[
			1181
		]
	],
	[
		[
			1181,
			1181
		],
		"valid"
	],
	[
		[
			1182,
			1182
		],
		"mapped",
		[
			1183
		]
	],
	[
		[
			1183,
			1183
		],
		"valid"
	],
	[
		[
			1184,
			1184
		],
		"mapped",
		[
			1185
		]
	],
	[
		[
			1185,
			1185
		],
		"valid"
	],
	[
		[
			1186,
			1186
		],
		"mapped",
		[
			1187
		]
	],
	[
		[
			1187,
			1187
		],
		"valid"
	],
	[
		[
			1188,
			1188
		],
		"mapped",
		[
			1189
		]
	],
	[
		[
			1189,
			1189
		],
		"valid"
	],
	[
		[
			1190,
			1190
		],
		"mapped",
		[
			1191
		]
	],
	[
		[
			1191,
			1191
		],
		"valid"
	],
	[
		[
			1192,
			1192
		],
		"mapped",
		[
			1193
		]
	],
	[
		[
			1193,
			1193
		],
		"valid"
	],
	[
		[
			1194,
			1194
		],
		"mapped",
		[
			1195
		]
	],
	[
		[
			1195,
			1195
		],
		"valid"
	],
	[
		[
			1196,
			1196
		],
		"mapped",
		[
			1197
		]
	],
	[
		[
			1197,
			1197
		],
		"valid"
	],
	[
		[
			1198,
			1198
		],
		"mapped",
		[
			1199
		]
	],
	[
		[
			1199,
			1199
		],
		"valid"
	],
	[
		[
			1200,
			1200
		],
		"mapped",
		[
			1201
		]
	],
	[
		[
			1201,
			1201
		],
		"valid"
	],
	[
		[
			1202,
			1202
		],
		"mapped",
		[
			1203
		]
	],
	[
		[
			1203,
			1203
		],
		"valid"
	],
	[
		[
			1204,
			1204
		],
		"mapped",
		[
			1205
		]
	],
	[
		[
			1205,
			1205
		],
		"valid"
	],
	[
		[
			1206,
			1206
		],
		"mapped",
		[
			1207
		]
	],
	[
		[
			1207,
			1207
		],
		"valid"
	],
	[
		[
			1208,
			1208
		],
		"mapped",
		[
			1209
		]
	],
	[
		[
			1209,
			1209
		],
		"valid"
	],
	[
		[
			1210,
			1210
		],
		"mapped",
		[
			1211
		]
	],
	[
		[
			1211,
			1211
		],
		"valid"
	],
	[
		[
			1212,
			1212
		],
		"mapped",
		[
			1213
		]
	],
	[
		[
			1213,
			1213
		],
		"valid"
	],
	[
		[
			1214,
			1214
		],
		"mapped",
		[
			1215
		]
	],
	[
		[
			1215,
			1215
		],
		"valid"
	],
	[
		[
			1216,
			1216
		],
		"disallowed"
	],
	[
		[
			1217,
			1217
		],
		"mapped",
		[
			1218
		]
	],
	[
		[
			1218,
			1218
		],
		"valid"
	],
	[
		[
			1219,
			1219
		],
		"mapped",
		[
			1220
		]
	],
	[
		[
			1220,
			1220
		],
		"valid"
	],
	[
		[
			1221,
			1221
		],
		"mapped",
		[
			1222
		]
	],
	[
		[
			1222,
			1222
		],
		"valid"
	],
	[
		[
			1223,
			1223
		],
		"mapped",
		[
			1224
		]
	],
	[
		[
			1224,
			1224
		],
		"valid"
	],
	[
		[
			1225,
			1225
		],
		"mapped",
		[
			1226
		]
	],
	[
		[
			1226,
			1226
		],
		"valid"
	],
	[
		[
			1227,
			1227
		],
		"mapped",
		[
			1228
		]
	],
	[
		[
			1228,
			1228
		],
		"valid"
	],
	[
		[
			1229,
			1229
		],
		"mapped",
		[
			1230
		]
	],
	[
		[
			1230,
			1230
		],
		"valid"
	],
	[
		[
			1231,
			1231
		],
		"valid"
	],
	[
		[
			1232,
			1232
		],
		"mapped",
		[
			1233
		]
	],
	[
		[
			1233,
			1233
		],
		"valid"
	],
	[
		[
			1234,
			1234
		],
		"mapped",
		[
			1235
		]
	],
	[
		[
			1235,
			1235
		],
		"valid"
	],
	[
		[
			1236,
			1236
		],
		"mapped",
		[
			1237
		]
	],
	[
		[
			1237,
			1237
		],
		"valid"
	],
	[
		[
			1238,
			1238
		],
		"mapped",
		[
			1239
		]
	],
	[
		[
			1239,
			1239
		],
		"valid"
	],
	[
		[
			1240,
			1240
		],
		"mapped",
		[
			1241
		]
	],
	[
		[
			1241,
			1241
		],
		"valid"
	],
	[
		[
			1242,
			1242
		],
		"mapped",
		[
			1243
		]
	],
	[
		[
			1243,
			1243
		],
		"valid"
	],
	[
		[
			1244,
			1244
		],
		"mapped",
		[
			1245
		]
	],
	[
		[
			1245,
			1245
		],
		"valid"
	],
	[
		[
			1246,
			1246
		],
		"mapped",
		[
			1247
		]
	],
	[
		[
			1247,
			1247
		],
		"valid"
	],
	[
		[
			1248,
			1248
		],
		"mapped",
		[
			1249
		]
	],
	[
		[
			1249,
			1249
		],
		"valid"
	],
	[
		[
			1250,
			1250
		],
		"mapped",
		[
			1251
		]
	],
	[
		[
			1251,
			1251
		],
		"valid"
	],
	[
		[
			1252,
			1252
		],
		"mapped",
		[
			1253
		]
	],
	[
		[
			1253,
			1253
		],
		"valid"
	],
	[
		[
			1254,
			1254
		],
		"mapped",
		[
			1255
		]
	],
	[
		[
			1255,
			1255
		],
		"valid"
	],
	[
		[
			1256,
			1256
		],
		"mapped",
		[
			1257
		]
	],
	[
		[
			1257,
			1257
		],
		"valid"
	],
	[
		[
			1258,
			1258
		],
		"mapped",
		[
			1259
		]
	],
	[
		[
			1259,
			1259
		],
		"valid"
	],
	[
		[
			1260,
			1260
		],
		"mapped",
		[
			1261
		]
	],
	[
		[
			1261,
			1261
		],
		"valid"
	],
	[
		[
			1262,
			1262
		],
		"mapped",
		[
			1263
		]
	],
	[
		[
			1263,
			1263
		],
		"valid"
	],
	[
		[
			1264,
			1264
		],
		"mapped",
		[
			1265
		]
	],
	[
		[
			1265,
			1265
		],
		"valid"
	],
	[
		[
			1266,
			1266
		],
		"mapped",
		[
			1267
		]
	],
	[
		[
			1267,
			1267
		],
		"valid"
	],
	[
		[
			1268,
			1268
		],
		"mapped",
		[
			1269
		]
	],
	[
		[
			1269,
			1269
		],
		"valid"
	],
	[
		[
			1270,
			1270
		],
		"mapped",
		[
			1271
		]
	],
	[
		[
			1271,
			1271
		],
		"valid"
	],
	[
		[
			1272,
			1272
		],
		"mapped",
		[
			1273
		]
	],
	[
		[
			1273,
			1273
		],
		"valid"
	],
	[
		[
			1274,
			1274
		],
		"mapped",
		[
			1275
		]
	],
	[
		[
			1275,
			1275
		],
		"valid"
	],
	[
		[
			1276,
			1276
		],
		"mapped",
		[
			1277
		]
	],
	[
		[
			1277,
			1277
		],
		"valid"
	],
	[
		[
			1278,
			1278
		],
		"mapped",
		[
			1279
		]
	],
	[
		[
			1279,
			1279
		],
		"valid"
	],
	[
		[
			1280,
			1280
		],
		"mapped",
		[
			1281
		]
	],
	[
		[
			1281,
			1281
		],
		"valid"
	],
	[
		[
			1282,
			1282
		],
		"mapped",
		[
			1283
		]
	],
	[
		[
			1283,
			1283
		],
		"valid"
	],
	[
		[
			1284,
			1284
		],
		"mapped",
		[
			1285
		]
	],
	[
		[
			1285,
			1285
		],
		"valid"
	],
	[
		[
			1286,
			1286
		],
		"mapped",
		[
			1287
		]
	],
	[
		[
			1287,
			1287
		],
		"valid"
	],
	[
		[
			1288,
			1288
		],
		"mapped",
		[
			1289
		]
	],
	[
		[
			1289,
			1289
		],
		"valid"
	],
	[
		[
			1290,
			1290
		],
		"mapped",
		[
			1291
		]
	],
	[
		[
			1291,
			1291
		],
		"valid"
	],
	[
		[
			1292,
			1292
		],
		"mapped",
		[
			1293
		]
	],
	[
		[
			1293,
			1293
		],
		"valid"
	],
	[
		[
			1294,
			1294
		],
		"mapped",
		[
			1295
		]
	],
	[
		[
			1295,
			1295
		],
		"valid"
	],
	[
		[
			1296,
			1296
		],
		"mapped",
		[
			1297
		]
	],
	[
		[
			1297,
			1297
		],
		"valid"
	],
	[
		[
			1298,
			1298
		],
		"mapped",
		[
			1299
		]
	],
	[
		[
			1299,
			1299
		],
		"valid"
	],
	[
		[
			1300,
			1300
		],
		"mapped",
		[
			1301
		]
	],
	[
		[
			1301,
			1301
		],
		"valid"
	],
	[
		[
			1302,
			1302
		],
		"mapped",
		[
			1303
		]
	],
	[
		[
			1303,
			1303
		],
		"valid"
	],
	[
		[
			1304,
			1304
		],
		"mapped",
		[
			1305
		]
	],
	[
		[
			1305,
			1305
		],
		"valid"
	],
	[
		[
			1306,
			1306
		],
		"mapped",
		[
			1307
		]
	],
	[
		[
			1307,
			1307
		],
		"valid"
	],
	[
		[
			1308,
			1308
		],
		"mapped",
		[
			1309
		]
	],
	[
		[
			1309,
			1309
		],
		"valid"
	],
	[
		[
			1310,
			1310
		],
		"mapped",
		[
			1311
		]
	],
	[
		[
			1311,
			1311
		],
		"valid"
	],
	[
		[
			1312,
			1312
		],
		"mapped",
		[
			1313
		]
	],
	[
		[
			1313,
			1313
		],
		"valid"
	],
	[
		[
			1314,
			1314
		],
		"mapped",
		[
			1315
		]
	],
	[
		[
			1315,
			1315
		],
		"valid"
	],
	[
		[
			1316,
			1316
		],
		"mapped",
		[
			1317
		]
	],
	[
		[
			1317,
			1317
		],
		"valid"
	],
	[
		[
			1318,
			1318
		],
		"mapped",
		[
			1319
		]
	],
	[
		[
			1319,
			1319
		],
		"valid"
	],
	[
		[
			1320,
			1320
		],
		"mapped",
		[
			1321
		]
	],
	[
		[
			1321,
			1321
		],
		"valid"
	],
	[
		[
			1322,
			1322
		],
		"mapped",
		[
			1323
		]
	],
	[
		[
			1323,
			1323
		],
		"valid"
	],
	[
		[
			1324,
			1324
		],
		"mapped",
		[
			1325
		]
	],
	[
		[
			1325,
			1325
		],
		"valid"
	],
	[
		[
			1326,
			1326
		],
		"mapped",
		[
			1327
		]
	],
	[
		[
			1327,
			1327
		],
		"valid"
	],
	[
		[
			1328,
			1328
		],
		"disallowed"
	],
	[
		[
			1329,
			1329
		],
		"mapped",
		[
			1377
		]
	],
	[
		[
			1330,
			1330
		],
		"mapped",
		[
			1378
		]
	],
	[
		[
			1331,
			1331
		],
		"mapped",
		[
			1379
		]
	],
	[
		[
			1332,
			1332
		],
		"mapped",
		[
			1380
		]
	],
	[
		[
			1333,
			1333
		],
		"mapped",
		[
			1381
		]
	],
	[
		[
			1334,
			1334
		],
		"mapped",
		[
			1382
		]
	],
	[
		[
			1335,
			1335
		],
		"mapped",
		[
			1383
		]
	],
	[
		[
			1336,
			1336
		],
		"mapped",
		[
			1384
		]
	],
	[
		[
			1337,
			1337
		],
		"mapped",
		[
			1385
		]
	],
	[
		[
			1338,
			1338
		],
		"mapped",
		[
			1386
		]
	],
	[
		[
			1339,
			1339
		],
		"mapped",
		[
			1387
		]
	],
	[
		[
			1340,
			1340
		],
		"mapped",
		[
			1388
		]
	],
	[
		[
			1341,
			1341
		],
		"mapped",
		[
			1389
		]
	],
	[
		[
			1342,
			1342
		],
		"mapped",
		[
			1390
		]
	],
	[
		[
			1343,
			1343
		],
		"mapped",
		[
			1391
		]
	],
	[
		[
			1344,
			1344
		],
		"mapped",
		[
			1392
		]
	],
	[
		[
			1345,
			1345
		],
		"mapped",
		[
			1393
		]
	],
	[
		[
			1346,
			1346
		],
		"mapped",
		[
			1394
		]
	],
	[
		[
			1347,
			1347
		],
		"mapped",
		[
			1395
		]
	],
	[
		[
			1348,
			1348
		],
		"mapped",
		[
			1396
		]
	],
	[
		[
			1349,
			1349
		],
		"mapped",
		[
			1397
		]
	],
	[
		[
			1350,
			1350
		],
		"mapped",
		[
			1398
		]
	],
	[
		[
			1351,
			1351
		],
		"mapped",
		[
			1399
		]
	],
	[
		[
			1352,
			1352
		],
		"mapped",
		[
			1400
		]
	],
	[
		[
			1353,
			1353
		],
		"mapped",
		[
			1401
		]
	],
	[
		[
			1354,
			1354
		],
		"mapped",
		[
			1402
		]
	],
	[
		[
			1355,
			1355
		],
		"mapped",
		[
			1403
		]
	],
	[
		[
			1356,
			1356
		],
		"mapped",
		[
			1404
		]
	],
	[
		[
			1357,
			1357
		],
		"mapped",
		[
			1405
		]
	],
	[
		[
			1358,
			1358
		],
		"mapped",
		[
			1406
		]
	],
	[
		[
			1359,
			1359
		],
		"mapped",
		[
			1407
		]
	],
	[
		[
			1360,
			1360
		],
		"mapped",
		[
			1408
		]
	],
	[
		[
			1361,
			1361
		],
		"mapped",
		[
			1409
		]
	],
	[
		[
			1362,
			1362
		],
		"mapped",
		[
			1410
		]
	],
	[
		[
			1363,
			1363
		],
		"mapped",
		[
			1411
		]
	],
	[
		[
			1364,
			1364
		],
		"mapped",
		[
			1412
		]
	],
	[
		[
			1365,
			1365
		],
		"mapped",
		[
			1413
		]
	],
	[
		[
			1366,
			1366
		],
		"mapped",
		[
			1414
		]
	],
	[
		[
			1367,
			1368
		],
		"disallowed"
	],
	[
		[
			1369,
			1369
		],
		"valid"
	],
	[
		[
			1370,
			1375
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1376,
			1376
		],
		"disallowed"
	],
	[
		[
			1377,
			1414
		],
		"valid"
	],
	[
		[
			1415,
			1415
		],
		"mapped",
		[
			1381,
			1410
		]
	],
	[
		[
			1416,
			1416
		],
		"disallowed"
	],
	[
		[
			1417,
			1417
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1418,
			1418
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1419,
			1420
		],
		"disallowed"
	],
	[
		[
			1421,
			1422
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1423,
			1423
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1424,
			1424
		],
		"disallowed"
	],
	[
		[
			1425,
			1441
		],
		"valid"
	],
	[
		[
			1442,
			1442
		],
		"valid"
	],
	[
		[
			1443,
			1455
		],
		"valid"
	],
	[
		[
			1456,
			1465
		],
		"valid"
	],
	[
		[
			1466,
			1466
		],
		"valid"
	],
	[
		[
			1467,
			1469
		],
		"valid"
	],
	[
		[
			1470,
			1470
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1471,
			1471
		],
		"valid"
	],
	[
		[
			1472,
			1472
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1473,
			1474
		],
		"valid"
	],
	[
		[
			1475,
			1475
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1476,
			1476
		],
		"valid"
	],
	[
		[
			1477,
			1477
		],
		"valid"
	],
	[
		[
			1478,
			1478
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1479,
			1479
		],
		"valid"
	],
	[
		[
			1480,
			1487
		],
		"disallowed"
	],
	[
		[
			1488,
			1514
		],
		"valid"
	],
	[
		[
			1515,
			1519
		],
		"disallowed"
	],
	[
		[
			1520,
			1524
		],
		"valid"
	],
	[
		[
			1525,
			1535
		],
		"disallowed"
	],
	[
		[
			1536,
			1539
		],
		"disallowed"
	],
	[
		[
			1540,
			1540
		],
		"disallowed"
	],
	[
		[
			1541,
			1541
		],
		"disallowed"
	],
	[
		[
			1542,
			1546
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1547,
			1547
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1548,
			1548
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1549,
			1551
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1552,
			1557
		],
		"valid"
	],
	[
		[
			1558,
			1562
		],
		"valid"
	],
	[
		[
			1563,
			1563
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1564,
			1564
		],
		"disallowed"
	],
	[
		[
			1565,
			1565
		],
		"disallowed"
	],
	[
		[
			1566,
			1566
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1567,
			1567
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1568,
			1568
		],
		"valid"
	],
	[
		[
			1569,
			1594
		],
		"valid"
	],
	[
		[
			1595,
			1599
		],
		"valid"
	],
	[
		[
			1600,
			1600
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1601,
			1618
		],
		"valid"
	],
	[
		[
			1619,
			1621
		],
		"valid"
	],
	[
		[
			1622,
			1624
		],
		"valid"
	],
	[
		[
			1625,
			1630
		],
		"valid"
	],
	[
		[
			1631,
			1631
		],
		"valid"
	],
	[
		[
			1632,
			1641
		],
		"valid"
	],
	[
		[
			1642,
			1645
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1646,
			1647
		],
		"valid"
	],
	[
		[
			1648,
			1652
		],
		"valid"
	],
	[
		[
			1653,
			1653
		],
		"mapped",
		[
			1575,
			1652
		]
	],
	[
		[
			1654,
			1654
		],
		"mapped",
		[
			1608,
			1652
		]
	],
	[
		[
			1655,
			1655
		],
		"mapped",
		[
			1735,
			1652
		]
	],
	[
		[
			1656,
			1656
		],
		"mapped",
		[
			1610,
			1652
		]
	],
	[
		[
			1657,
			1719
		],
		"valid"
	],
	[
		[
			1720,
			1721
		],
		"valid"
	],
	[
		[
			1722,
			1726
		],
		"valid"
	],
	[
		[
			1727,
			1727
		],
		"valid"
	],
	[
		[
			1728,
			1742
		],
		"valid"
	],
	[
		[
			1743,
			1743
		],
		"valid"
	],
	[
		[
			1744,
			1747
		],
		"valid"
	],
	[
		[
			1748,
			1748
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1749,
			1756
		],
		"valid"
	],
	[
		[
			1757,
			1757
		],
		"disallowed"
	],
	[
		[
			1758,
			1758
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1759,
			1768
		],
		"valid"
	],
	[
		[
			1769,
			1769
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1770,
			1773
		],
		"valid"
	],
	[
		[
			1774,
			1775
		],
		"valid"
	],
	[
		[
			1776,
			1785
		],
		"valid"
	],
	[
		[
			1786,
			1790
		],
		"valid"
	],
	[
		[
			1791,
			1791
		],
		"valid"
	],
	[
		[
			1792,
			1805
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			1806,
			1806
		],
		"disallowed"
	],
	[
		[
			1807,
			1807
		],
		"disallowed"
	],
	[
		[
			1808,
			1836
		],
		"valid"
	],
	[
		[
			1837,
			1839
		],
		"valid"
	],
	[
		[
			1840,
			1866
		],
		"valid"
	],
	[
		[
			1867,
			1868
		],
		"disallowed"
	],
	[
		[
			1869,
			1871
		],
		"valid"
	],
	[
		[
			1872,
			1901
		],
		"valid"
	],
	[
		[
			1902,
			1919
		],
		"valid"
	],
	[
		[
			1920,
			1968
		],
		"valid"
	],
	[
		[
			1969,
			1969
		],
		"valid"
	],
	[
		[
			1970,
			1983
		],
		"disallowed"
	],
	[
		[
			1984,
			2037
		],
		"valid"
	],
	[
		[
			2038,
			2042
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2043,
			2047
		],
		"disallowed"
	],
	[
		[
			2048,
			2093
		],
		"valid"
	],
	[
		[
			2094,
			2095
		],
		"disallowed"
	],
	[
		[
			2096,
			2110
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2111,
			2111
		],
		"disallowed"
	],
	[
		[
			2112,
			2139
		],
		"valid"
	],
	[
		[
			2140,
			2141
		],
		"disallowed"
	],
	[
		[
			2142,
			2142
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2143,
			2207
		],
		"disallowed"
	],
	[
		[
			2208,
			2208
		],
		"valid"
	],
	[
		[
			2209,
			2209
		],
		"valid"
	],
	[
		[
			2210,
			2220
		],
		"valid"
	],
	[
		[
			2221,
			2226
		],
		"valid"
	],
	[
		[
			2227,
			2228
		],
		"valid"
	],
	[
		[
			2229,
			2274
		],
		"disallowed"
	],
	[
		[
			2275,
			2275
		],
		"valid"
	],
	[
		[
			2276,
			2302
		],
		"valid"
	],
	[
		[
			2303,
			2303
		],
		"valid"
	],
	[
		[
			2304,
			2304
		],
		"valid"
	],
	[
		[
			2305,
			2307
		],
		"valid"
	],
	[
		[
			2308,
			2308
		],
		"valid"
	],
	[
		[
			2309,
			2361
		],
		"valid"
	],
	[
		[
			2362,
			2363
		],
		"valid"
	],
	[
		[
			2364,
			2381
		],
		"valid"
	],
	[
		[
			2382,
			2382
		],
		"valid"
	],
	[
		[
			2383,
			2383
		],
		"valid"
	],
	[
		[
			2384,
			2388
		],
		"valid"
	],
	[
		[
			2389,
			2389
		],
		"valid"
	],
	[
		[
			2390,
			2391
		],
		"valid"
	],
	[
		[
			2392,
			2392
		],
		"mapped",
		[
			2325,
			2364
		]
	],
	[
		[
			2393,
			2393
		],
		"mapped",
		[
			2326,
			2364
		]
	],
	[
		[
			2394,
			2394
		],
		"mapped",
		[
			2327,
			2364
		]
	],
	[
		[
			2395,
			2395
		],
		"mapped",
		[
			2332,
			2364
		]
	],
	[
		[
			2396,
			2396
		],
		"mapped",
		[
			2337,
			2364
		]
	],
	[
		[
			2397,
			2397
		],
		"mapped",
		[
			2338,
			2364
		]
	],
	[
		[
			2398,
			2398
		],
		"mapped",
		[
			2347,
			2364
		]
	],
	[
		[
			2399,
			2399
		],
		"mapped",
		[
			2351,
			2364
		]
	],
	[
		[
			2400,
			2403
		],
		"valid"
	],
	[
		[
			2404,
			2405
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2406,
			2415
		],
		"valid"
	],
	[
		[
			2416,
			2416
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2417,
			2418
		],
		"valid"
	],
	[
		[
			2419,
			2423
		],
		"valid"
	],
	[
		[
			2424,
			2424
		],
		"valid"
	],
	[
		[
			2425,
			2426
		],
		"valid"
	],
	[
		[
			2427,
			2428
		],
		"valid"
	],
	[
		[
			2429,
			2429
		],
		"valid"
	],
	[
		[
			2430,
			2431
		],
		"valid"
	],
	[
		[
			2432,
			2432
		],
		"valid"
	],
	[
		[
			2433,
			2435
		],
		"valid"
	],
	[
		[
			2436,
			2436
		],
		"disallowed"
	],
	[
		[
			2437,
			2444
		],
		"valid"
	],
	[
		[
			2445,
			2446
		],
		"disallowed"
	],
	[
		[
			2447,
			2448
		],
		"valid"
	],
	[
		[
			2449,
			2450
		],
		"disallowed"
	],
	[
		[
			2451,
			2472
		],
		"valid"
	],
	[
		[
			2473,
			2473
		],
		"disallowed"
	],
	[
		[
			2474,
			2480
		],
		"valid"
	],
	[
		[
			2481,
			2481
		],
		"disallowed"
	],
	[
		[
			2482,
			2482
		],
		"valid"
	],
	[
		[
			2483,
			2485
		],
		"disallowed"
	],
	[
		[
			2486,
			2489
		],
		"valid"
	],
	[
		[
			2490,
			2491
		],
		"disallowed"
	],
	[
		[
			2492,
			2492
		],
		"valid"
	],
	[
		[
			2493,
			2493
		],
		"valid"
	],
	[
		[
			2494,
			2500
		],
		"valid"
	],
	[
		[
			2501,
			2502
		],
		"disallowed"
	],
	[
		[
			2503,
			2504
		],
		"valid"
	],
	[
		[
			2505,
			2506
		],
		"disallowed"
	],
	[
		[
			2507,
			2509
		],
		"valid"
	],
	[
		[
			2510,
			2510
		],
		"valid"
	],
	[
		[
			2511,
			2518
		],
		"disallowed"
	],
	[
		[
			2519,
			2519
		],
		"valid"
	],
	[
		[
			2520,
			2523
		],
		"disallowed"
	],
	[
		[
			2524,
			2524
		],
		"mapped",
		[
			2465,
			2492
		]
	],
	[
		[
			2525,
			2525
		],
		"mapped",
		[
			2466,
			2492
		]
	],
	[
		[
			2526,
			2526
		],
		"disallowed"
	],
	[
		[
			2527,
			2527
		],
		"mapped",
		[
			2479,
			2492
		]
	],
	[
		[
			2528,
			2531
		],
		"valid"
	],
	[
		[
			2532,
			2533
		],
		"disallowed"
	],
	[
		[
			2534,
			2545
		],
		"valid"
	],
	[
		[
			2546,
			2554
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2555,
			2555
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2556,
			2560
		],
		"disallowed"
	],
	[
		[
			2561,
			2561
		],
		"valid"
	],
	[
		[
			2562,
			2562
		],
		"valid"
	],
	[
		[
			2563,
			2563
		],
		"valid"
	],
	[
		[
			2564,
			2564
		],
		"disallowed"
	],
	[
		[
			2565,
			2570
		],
		"valid"
	],
	[
		[
			2571,
			2574
		],
		"disallowed"
	],
	[
		[
			2575,
			2576
		],
		"valid"
	],
	[
		[
			2577,
			2578
		],
		"disallowed"
	],
	[
		[
			2579,
			2600
		],
		"valid"
	],
	[
		[
			2601,
			2601
		],
		"disallowed"
	],
	[
		[
			2602,
			2608
		],
		"valid"
	],
	[
		[
			2609,
			2609
		],
		"disallowed"
	],
	[
		[
			2610,
			2610
		],
		"valid"
	],
	[
		[
			2611,
			2611
		],
		"mapped",
		[
			2610,
			2620
		]
	],
	[
		[
			2612,
			2612
		],
		"disallowed"
	],
	[
		[
			2613,
			2613
		],
		"valid"
	],
	[
		[
			2614,
			2614
		],
		"mapped",
		[
			2616,
			2620
		]
	],
	[
		[
			2615,
			2615
		],
		"disallowed"
	],
	[
		[
			2616,
			2617
		],
		"valid"
	],
	[
		[
			2618,
			2619
		],
		"disallowed"
	],
	[
		[
			2620,
			2620
		],
		"valid"
	],
	[
		[
			2621,
			2621
		],
		"disallowed"
	],
	[
		[
			2622,
			2626
		],
		"valid"
	],
	[
		[
			2627,
			2630
		],
		"disallowed"
	],
	[
		[
			2631,
			2632
		],
		"valid"
	],
	[
		[
			2633,
			2634
		],
		"disallowed"
	],
	[
		[
			2635,
			2637
		],
		"valid"
	],
	[
		[
			2638,
			2640
		],
		"disallowed"
	],
	[
		[
			2641,
			2641
		],
		"valid"
	],
	[
		[
			2642,
			2648
		],
		"disallowed"
	],
	[
		[
			2649,
			2649
		],
		"mapped",
		[
			2582,
			2620
		]
	],
	[
		[
			2650,
			2650
		],
		"mapped",
		[
			2583,
			2620
		]
	],
	[
		[
			2651,
			2651
		],
		"mapped",
		[
			2588,
			2620
		]
	],
	[
		[
			2652,
			2652
		],
		"valid"
	],
	[
		[
			2653,
			2653
		],
		"disallowed"
	],
	[
		[
			2654,
			2654
		],
		"mapped",
		[
			2603,
			2620
		]
	],
	[
		[
			2655,
			2661
		],
		"disallowed"
	],
	[
		[
			2662,
			2676
		],
		"valid"
	],
	[
		[
			2677,
			2677
		],
		"valid"
	],
	[
		[
			2678,
			2688
		],
		"disallowed"
	],
	[
		[
			2689,
			2691
		],
		"valid"
	],
	[
		[
			2692,
			2692
		],
		"disallowed"
	],
	[
		[
			2693,
			2699
		],
		"valid"
	],
	[
		[
			2700,
			2700
		],
		"valid"
	],
	[
		[
			2701,
			2701
		],
		"valid"
	],
	[
		[
			2702,
			2702
		],
		"disallowed"
	],
	[
		[
			2703,
			2705
		],
		"valid"
	],
	[
		[
			2706,
			2706
		],
		"disallowed"
	],
	[
		[
			2707,
			2728
		],
		"valid"
	],
	[
		[
			2729,
			2729
		],
		"disallowed"
	],
	[
		[
			2730,
			2736
		],
		"valid"
	],
	[
		[
			2737,
			2737
		],
		"disallowed"
	],
	[
		[
			2738,
			2739
		],
		"valid"
	],
	[
		[
			2740,
			2740
		],
		"disallowed"
	],
	[
		[
			2741,
			2745
		],
		"valid"
	],
	[
		[
			2746,
			2747
		],
		"disallowed"
	],
	[
		[
			2748,
			2757
		],
		"valid"
	],
	[
		[
			2758,
			2758
		],
		"disallowed"
	],
	[
		[
			2759,
			2761
		],
		"valid"
	],
	[
		[
			2762,
			2762
		],
		"disallowed"
	],
	[
		[
			2763,
			2765
		],
		"valid"
	],
	[
		[
			2766,
			2767
		],
		"disallowed"
	],
	[
		[
			2768,
			2768
		],
		"valid"
	],
	[
		[
			2769,
			2783
		],
		"disallowed"
	],
	[
		[
			2784,
			2784
		],
		"valid"
	],
	[
		[
			2785,
			2787
		],
		"valid"
	],
	[
		[
			2788,
			2789
		],
		"disallowed"
	],
	[
		[
			2790,
			2799
		],
		"valid"
	],
	[
		[
			2800,
			2800
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2801,
			2801
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2802,
			2808
		],
		"disallowed"
	],
	[
		[
			2809,
			2809
		],
		"valid"
	],
	[
		[
			2810,
			2816
		],
		"disallowed"
	],
	[
		[
			2817,
			2819
		],
		"valid"
	],
	[
		[
			2820,
			2820
		],
		"disallowed"
	],
	[
		[
			2821,
			2828
		],
		"valid"
	],
	[
		[
			2829,
			2830
		],
		"disallowed"
	],
	[
		[
			2831,
			2832
		],
		"valid"
	],
	[
		[
			2833,
			2834
		],
		"disallowed"
	],
	[
		[
			2835,
			2856
		],
		"valid"
	],
	[
		[
			2857,
			2857
		],
		"disallowed"
	],
	[
		[
			2858,
			2864
		],
		"valid"
	],
	[
		[
			2865,
			2865
		],
		"disallowed"
	],
	[
		[
			2866,
			2867
		],
		"valid"
	],
	[
		[
			2868,
			2868
		],
		"disallowed"
	],
	[
		[
			2869,
			2869
		],
		"valid"
	],
	[
		[
			2870,
			2873
		],
		"valid"
	],
	[
		[
			2874,
			2875
		],
		"disallowed"
	],
	[
		[
			2876,
			2883
		],
		"valid"
	],
	[
		[
			2884,
			2884
		],
		"valid"
	],
	[
		[
			2885,
			2886
		],
		"disallowed"
	],
	[
		[
			2887,
			2888
		],
		"valid"
	],
	[
		[
			2889,
			2890
		],
		"disallowed"
	],
	[
		[
			2891,
			2893
		],
		"valid"
	],
	[
		[
			2894,
			2901
		],
		"disallowed"
	],
	[
		[
			2902,
			2903
		],
		"valid"
	],
	[
		[
			2904,
			2907
		],
		"disallowed"
	],
	[
		[
			2908,
			2908
		],
		"mapped",
		[
			2849,
			2876
		]
	],
	[
		[
			2909,
			2909
		],
		"mapped",
		[
			2850,
			2876
		]
	],
	[
		[
			2910,
			2910
		],
		"disallowed"
	],
	[
		[
			2911,
			2913
		],
		"valid"
	],
	[
		[
			2914,
			2915
		],
		"valid"
	],
	[
		[
			2916,
			2917
		],
		"disallowed"
	],
	[
		[
			2918,
			2927
		],
		"valid"
	],
	[
		[
			2928,
			2928
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2929,
			2929
		],
		"valid"
	],
	[
		[
			2930,
			2935
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			2936,
			2945
		],
		"disallowed"
	],
	[
		[
			2946,
			2947
		],
		"valid"
	],
	[
		[
			2948,
			2948
		],
		"disallowed"
	],
	[
		[
			2949,
			2954
		],
		"valid"
	],
	[
		[
			2955,
			2957
		],
		"disallowed"
	],
	[
		[
			2958,
			2960
		],
		"valid"
	],
	[
		[
			2961,
			2961
		],
		"disallowed"
	],
	[
		[
			2962,
			2965
		],
		"valid"
	],
	[
		[
			2966,
			2968
		],
		"disallowed"
	],
	[
		[
			2969,
			2970
		],
		"valid"
	],
	[
		[
			2971,
			2971
		],
		"disallowed"
	],
	[
		[
			2972,
			2972
		],
		"valid"
	],
	[
		[
			2973,
			2973
		],
		"disallowed"
	],
	[
		[
			2974,
			2975
		],
		"valid"
	],
	[
		[
			2976,
			2978
		],
		"disallowed"
	],
	[
		[
			2979,
			2980
		],
		"valid"
	],
	[
		[
			2981,
			2983
		],
		"disallowed"
	],
	[
		[
			2984,
			2986
		],
		"valid"
	],
	[
		[
			2987,
			2989
		],
		"disallowed"
	],
	[
		[
			2990,
			2997
		],
		"valid"
	],
	[
		[
			2998,
			2998
		],
		"valid"
	],
	[
		[
			2999,
			3001
		],
		"valid"
	],
	[
		[
			3002,
			3005
		],
		"disallowed"
	],
	[
		[
			3006,
			3010
		],
		"valid"
	],
	[
		[
			3011,
			3013
		],
		"disallowed"
	],
	[
		[
			3014,
			3016
		],
		"valid"
	],
	[
		[
			3017,
			3017
		],
		"disallowed"
	],
	[
		[
			3018,
			3021
		],
		"valid"
	],
	[
		[
			3022,
			3023
		],
		"disallowed"
	],
	[
		[
			3024,
			3024
		],
		"valid"
	],
	[
		[
			3025,
			3030
		],
		"disallowed"
	],
	[
		[
			3031,
			3031
		],
		"valid"
	],
	[
		[
			3032,
			3045
		],
		"disallowed"
	],
	[
		[
			3046,
			3046
		],
		"valid"
	],
	[
		[
			3047,
			3055
		],
		"valid"
	],
	[
		[
			3056,
			3058
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3059,
			3066
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3067,
			3071
		],
		"disallowed"
	],
	[
		[
			3072,
			3072
		],
		"valid"
	],
	[
		[
			3073,
			3075
		],
		"valid"
	],
	[
		[
			3076,
			3076
		],
		"disallowed"
	],
	[
		[
			3077,
			3084
		],
		"valid"
	],
	[
		[
			3085,
			3085
		],
		"disallowed"
	],
	[
		[
			3086,
			3088
		],
		"valid"
	],
	[
		[
			3089,
			3089
		],
		"disallowed"
	],
	[
		[
			3090,
			3112
		],
		"valid"
	],
	[
		[
			3113,
			3113
		],
		"disallowed"
	],
	[
		[
			3114,
			3123
		],
		"valid"
	],
	[
		[
			3124,
			3124
		],
		"valid"
	],
	[
		[
			3125,
			3129
		],
		"valid"
	],
	[
		[
			3130,
			3132
		],
		"disallowed"
	],
	[
		[
			3133,
			3133
		],
		"valid"
	],
	[
		[
			3134,
			3140
		],
		"valid"
	],
	[
		[
			3141,
			3141
		],
		"disallowed"
	],
	[
		[
			3142,
			3144
		],
		"valid"
	],
	[
		[
			3145,
			3145
		],
		"disallowed"
	],
	[
		[
			3146,
			3149
		],
		"valid"
	],
	[
		[
			3150,
			3156
		],
		"disallowed"
	],
	[
		[
			3157,
			3158
		],
		"valid"
	],
	[
		[
			3159,
			3159
		],
		"disallowed"
	],
	[
		[
			3160,
			3161
		],
		"valid"
	],
	[
		[
			3162,
			3162
		],
		"valid"
	],
	[
		[
			3163,
			3167
		],
		"disallowed"
	],
	[
		[
			3168,
			3169
		],
		"valid"
	],
	[
		[
			3170,
			3171
		],
		"valid"
	],
	[
		[
			3172,
			3173
		],
		"disallowed"
	],
	[
		[
			3174,
			3183
		],
		"valid"
	],
	[
		[
			3184,
			3191
		],
		"disallowed"
	],
	[
		[
			3192,
			3199
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3200,
			3200
		],
		"disallowed"
	],
	[
		[
			3201,
			3201
		],
		"valid"
	],
	[
		[
			3202,
			3203
		],
		"valid"
	],
	[
		[
			3204,
			3204
		],
		"disallowed"
	],
	[
		[
			3205,
			3212
		],
		"valid"
	],
	[
		[
			3213,
			3213
		],
		"disallowed"
	],
	[
		[
			3214,
			3216
		],
		"valid"
	],
	[
		[
			3217,
			3217
		],
		"disallowed"
	],
	[
		[
			3218,
			3240
		],
		"valid"
	],
	[
		[
			3241,
			3241
		],
		"disallowed"
	],
	[
		[
			3242,
			3251
		],
		"valid"
	],
	[
		[
			3252,
			3252
		],
		"disallowed"
	],
	[
		[
			3253,
			3257
		],
		"valid"
	],
	[
		[
			3258,
			3259
		],
		"disallowed"
	],
	[
		[
			3260,
			3261
		],
		"valid"
	],
	[
		[
			3262,
			3268
		],
		"valid"
	],
	[
		[
			3269,
			3269
		],
		"disallowed"
	],
	[
		[
			3270,
			3272
		],
		"valid"
	],
	[
		[
			3273,
			3273
		],
		"disallowed"
	],
	[
		[
			3274,
			3277
		],
		"valid"
	],
	[
		[
			3278,
			3284
		],
		"disallowed"
	],
	[
		[
			3285,
			3286
		],
		"valid"
	],
	[
		[
			3287,
			3293
		],
		"disallowed"
	],
	[
		[
			3294,
			3294
		],
		"valid"
	],
	[
		[
			3295,
			3295
		],
		"disallowed"
	],
	[
		[
			3296,
			3297
		],
		"valid"
	],
	[
		[
			3298,
			3299
		],
		"valid"
	],
	[
		[
			3300,
			3301
		],
		"disallowed"
	],
	[
		[
			3302,
			3311
		],
		"valid"
	],
	[
		[
			3312,
			3312
		],
		"disallowed"
	],
	[
		[
			3313,
			3314
		],
		"valid"
	],
	[
		[
			3315,
			3328
		],
		"disallowed"
	],
	[
		[
			3329,
			3329
		],
		"valid"
	],
	[
		[
			3330,
			3331
		],
		"valid"
	],
	[
		[
			3332,
			3332
		],
		"disallowed"
	],
	[
		[
			3333,
			3340
		],
		"valid"
	],
	[
		[
			3341,
			3341
		],
		"disallowed"
	],
	[
		[
			3342,
			3344
		],
		"valid"
	],
	[
		[
			3345,
			3345
		],
		"disallowed"
	],
	[
		[
			3346,
			3368
		],
		"valid"
	],
	[
		[
			3369,
			3369
		],
		"valid"
	],
	[
		[
			3370,
			3385
		],
		"valid"
	],
	[
		[
			3386,
			3386
		],
		"valid"
	],
	[
		[
			3387,
			3388
		],
		"disallowed"
	],
	[
		[
			3389,
			3389
		],
		"valid"
	],
	[
		[
			3390,
			3395
		],
		"valid"
	],
	[
		[
			3396,
			3396
		],
		"valid"
	],
	[
		[
			3397,
			3397
		],
		"disallowed"
	],
	[
		[
			3398,
			3400
		],
		"valid"
	],
	[
		[
			3401,
			3401
		],
		"disallowed"
	],
	[
		[
			3402,
			3405
		],
		"valid"
	],
	[
		[
			3406,
			3406
		],
		"valid"
	],
	[
		[
			3407,
			3414
		],
		"disallowed"
	],
	[
		[
			3415,
			3415
		],
		"valid"
	],
	[
		[
			3416,
			3422
		],
		"disallowed"
	],
	[
		[
			3423,
			3423
		],
		"valid"
	],
	[
		[
			3424,
			3425
		],
		"valid"
	],
	[
		[
			3426,
			3427
		],
		"valid"
	],
	[
		[
			3428,
			3429
		],
		"disallowed"
	],
	[
		[
			3430,
			3439
		],
		"valid"
	],
	[
		[
			3440,
			3445
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3446,
			3448
		],
		"disallowed"
	],
	[
		[
			3449,
			3449
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3450,
			3455
		],
		"valid"
	],
	[
		[
			3456,
			3457
		],
		"disallowed"
	],
	[
		[
			3458,
			3459
		],
		"valid"
	],
	[
		[
			3460,
			3460
		],
		"disallowed"
	],
	[
		[
			3461,
			3478
		],
		"valid"
	],
	[
		[
			3479,
			3481
		],
		"disallowed"
	],
	[
		[
			3482,
			3505
		],
		"valid"
	],
	[
		[
			3506,
			3506
		],
		"disallowed"
	],
	[
		[
			3507,
			3515
		],
		"valid"
	],
	[
		[
			3516,
			3516
		],
		"disallowed"
	],
	[
		[
			3517,
			3517
		],
		"valid"
	],
	[
		[
			3518,
			3519
		],
		"disallowed"
	],
	[
		[
			3520,
			3526
		],
		"valid"
	],
	[
		[
			3527,
			3529
		],
		"disallowed"
	],
	[
		[
			3530,
			3530
		],
		"valid"
	],
	[
		[
			3531,
			3534
		],
		"disallowed"
	],
	[
		[
			3535,
			3540
		],
		"valid"
	],
	[
		[
			3541,
			3541
		],
		"disallowed"
	],
	[
		[
			3542,
			3542
		],
		"valid"
	],
	[
		[
			3543,
			3543
		],
		"disallowed"
	],
	[
		[
			3544,
			3551
		],
		"valid"
	],
	[
		[
			3552,
			3557
		],
		"disallowed"
	],
	[
		[
			3558,
			3567
		],
		"valid"
	],
	[
		[
			3568,
			3569
		],
		"disallowed"
	],
	[
		[
			3570,
			3571
		],
		"valid"
	],
	[
		[
			3572,
			3572
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3573,
			3584
		],
		"disallowed"
	],
	[
		[
			3585,
			3634
		],
		"valid"
	],
	[
		[
			3635,
			3635
		],
		"mapped",
		[
			3661,
			3634
		]
	],
	[
		[
			3636,
			3642
		],
		"valid"
	],
	[
		[
			3643,
			3646
		],
		"disallowed"
	],
	[
		[
			3647,
			3647
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3648,
			3662
		],
		"valid"
	],
	[
		[
			3663,
			3663
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3664,
			3673
		],
		"valid"
	],
	[
		[
			3674,
			3675
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3676,
			3712
		],
		"disallowed"
	],
	[
		[
			3713,
			3714
		],
		"valid"
	],
	[
		[
			3715,
			3715
		],
		"disallowed"
	],
	[
		[
			3716,
			3716
		],
		"valid"
	],
	[
		[
			3717,
			3718
		],
		"disallowed"
	],
	[
		[
			3719,
			3720
		],
		"valid"
	],
	[
		[
			3721,
			3721
		],
		"disallowed"
	],
	[
		[
			3722,
			3722
		],
		"valid"
	],
	[
		[
			3723,
			3724
		],
		"disallowed"
	],
	[
		[
			3725,
			3725
		],
		"valid"
	],
	[
		[
			3726,
			3731
		],
		"disallowed"
	],
	[
		[
			3732,
			3735
		],
		"valid"
	],
	[
		[
			3736,
			3736
		],
		"disallowed"
	],
	[
		[
			3737,
			3743
		],
		"valid"
	],
	[
		[
			3744,
			3744
		],
		"disallowed"
	],
	[
		[
			3745,
			3747
		],
		"valid"
	],
	[
		[
			3748,
			3748
		],
		"disallowed"
	],
	[
		[
			3749,
			3749
		],
		"valid"
	],
	[
		[
			3750,
			3750
		],
		"disallowed"
	],
	[
		[
			3751,
			3751
		],
		"valid"
	],
	[
		[
			3752,
			3753
		],
		"disallowed"
	],
	[
		[
			3754,
			3755
		],
		"valid"
	],
	[
		[
			3756,
			3756
		],
		"disallowed"
	],
	[
		[
			3757,
			3762
		],
		"valid"
	],
	[
		[
			3763,
			3763
		],
		"mapped",
		[
			3789,
			3762
		]
	],
	[
		[
			3764,
			3769
		],
		"valid"
	],
	[
		[
			3770,
			3770
		],
		"disallowed"
	],
	[
		[
			3771,
			3773
		],
		"valid"
	],
	[
		[
			3774,
			3775
		],
		"disallowed"
	],
	[
		[
			3776,
			3780
		],
		"valid"
	],
	[
		[
			3781,
			3781
		],
		"disallowed"
	],
	[
		[
			3782,
			3782
		],
		"valid"
	],
	[
		[
			3783,
			3783
		],
		"disallowed"
	],
	[
		[
			3784,
			3789
		],
		"valid"
	],
	[
		[
			3790,
			3791
		],
		"disallowed"
	],
	[
		[
			3792,
			3801
		],
		"valid"
	],
	[
		[
			3802,
			3803
		],
		"disallowed"
	],
	[
		[
			3804,
			3804
		],
		"mapped",
		[
			3755,
			3737
		]
	],
	[
		[
			3805,
			3805
		],
		"mapped",
		[
			3755,
			3745
		]
	],
	[
		[
			3806,
			3807
		],
		"valid"
	],
	[
		[
			3808,
			3839
		],
		"disallowed"
	],
	[
		[
			3840,
			3840
		],
		"valid"
	],
	[
		[
			3841,
			3850
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3851,
			3851
		],
		"valid"
	],
	[
		[
			3852,
			3852
		],
		"mapped",
		[
			3851
		]
	],
	[
		[
			3853,
			3863
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3864,
			3865
		],
		"valid"
	],
	[
		[
			3866,
			3871
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3872,
			3881
		],
		"valid"
	],
	[
		[
			3882,
			3892
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3893,
			3893
		],
		"valid"
	],
	[
		[
			3894,
			3894
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3895,
			3895
		],
		"valid"
	],
	[
		[
			3896,
			3896
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3897,
			3897
		],
		"valid"
	],
	[
		[
			3898,
			3901
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3902,
			3906
		],
		"valid"
	],
	[
		[
			3907,
			3907
		],
		"mapped",
		[
			3906,
			4023
		]
	],
	[
		[
			3908,
			3911
		],
		"valid"
	],
	[
		[
			3912,
			3912
		],
		"disallowed"
	],
	[
		[
			3913,
			3916
		],
		"valid"
	],
	[
		[
			3917,
			3917
		],
		"mapped",
		[
			3916,
			4023
		]
	],
	[
		[
			3918,
			3921
		],
		"valid"
	],
	[
		[
			3922,
			3922
		],
		"mapped",
		[
			3921,
			4023
		]
	],
	[
		[
			3923,
			3926
		],
		"valid"
	],
	[
		[
			3927,
			3927
		],
		"mapped",
		[
			3926,
			4023
		]
	],
	[
		[
			3928,
			3931
		],
		"valid"
	],
	[
		[
			3932,
			3932
		],
		"mapped",
		[
			3931,
			4023
		]
	],
	[
		[
			3933,
			3944
		],
		"valid"
	],
	[
		[
			3945,
			3945
		],
		"mapped",
		[
			3904,
			4021
		]
	],
	[
		[
			3946,
			3946
		],
		"valid"
	],
	[
		[
			3947,
			3948
		],
		"valid"
	],
	[
		[
			3949,
			3952
		],
		"disallowed"
	],
	[
		[
			3953,
			3954
		],
		"valid"
	],
	[
		[
			3955,
			3955
		],
		"mapped",
		[
			3953,
			3954
		]
	],
	[
		[
			3956,
			3956
		],
		"valid"
	],
	[
		[
			3957,
			3957
		],
		"mapped",
		[
			3953,
			3956
		]
	],
	[
		[
			3958,
			3958
		],
		"mapped",
		[
			4018,
			3968
		]
	],
	[
		[
			3959,
			3959
		],
		"mapped",
		[
			4018,
			3953,
			3968
		]
	],
	[
		[
			3960,
			3960
		],
		"mapped",
		[
			4019,
			3968
		]
	],
	[
		[
			3961,
			3961
		],
		"mapped",
		[
			4019,
			3953,
			3968
		]
	],
	[
		[
			3962,
			3968
		],
		"valid"
	],
	[
		[
			3969,
			3969
		],
		"mapped",
		[
			3953,
			3968
		]
	],
	[
		[
			3970,
			3972
		],
		"valid"
	],
	[
		[
			3973,
			3973
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			3974,
			3979
		],
		"valid"
	],
	[
		[
			3980,
			3983
		],
		"valid"
	],
	[
		[
			3984,
			3986
		],
		"valid"
	],
	[
		[
			3987,
			3987
		],
		"mapped",
		[
			3986,
			4023
		]
	],
	[
		[
			3988,
			3989
		],
		"valid"
	],
	[
		[
			3990,
			3990
		],
		"valid"
	],
	[
		[
			3991,
			3991
		],
		"valid"
	],
	[
		[
			3992,
			3992
		],
		"disallowed"
	],
	[
		[
			3993,
			3996
		],
		"valid"
	],
	[
		[
			3997,
			3997
		],
		"mapped",
		[
			3996,
			4023
		]
	],
	[
		[
			3998,
			4001
		],
		"valid"
	],
	[
		[
			4002,
			4002
		],
		"mapped",
		[
			4001,
			4023
		]
	],
	[
		[
			4003,
			4006
		],
		"valid"
	],
	[
		[
			4007,
			4007
		],
		"mapped",
		[
			4006,
			4023
		]
	],
	[
		[
			4008,
			4011
		],
		"valid"
	],
	[
		[
			4012,
			4012
		],
		"mapped",
		[
			4011,
			4023
		]
	],
	[
		[
			4013,
			4013
		],
		"valid"
	],
	[
		[
			4014,
			4016
		],
		"valid"
	],
	[
		[
			4017,
			4023
		],
		"valid"
	],
	[
		[
			4024,
			4024
		],
		"valid"
	],
	[
		[
			4025,
			4025
		],
		"mapped",
		[
			3984,
			4021
		]
	],
	[
		[
			4026,
			4028
		],
		"valid"
	],
	[
		[
			4029,
			4029
		],
		"disallowed"
	],
	[
		[
			4030,
			4037
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4038,
			4038
		],
		"valid"
	],
	[
		[
			4039,
			4044
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4045,
			4045
		],
		"disallowed"
	],
	[
		[
			4046,
			4046
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4047,
			4047
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4048,
			4049
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4050,
			4052
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4053,
			4056
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4057,
			4058
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4059,
			4095
		],
		"disallowed"
	],
	[
		[
			4096,
			4129
		],
		"valid"
	],
	[
		[
			4130,
			4130
		],
		"valid"
	],
	[
		[
			4131,
			4135
		],
		"valid"
	],
	[
		[
			4136,
			4136
		],
		"valid"
	],
	[
		[
			4137,
			4138
		],
		"valid"
	],
	[
		[
			4139,
			4139
		],
		"valid"
	],
	[
		[
			4140,
			4146
		],
		"valid"
	],
	[
		[
			4147,
			4149
		],
		"valid"
	],
	[
		[
			4150,
			4153
		],
		"valid"
	],
	[
		[
			4154,
			4159
		],
		"valid"
	],
	[
		[
			4160,
			4169
		],
		"valid"
	],
	[
		[
			4170,
			4175
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4176,
			4185
		],
		"valid"
	],
	[
		[
			4186,
			4249
		],
		"valid"
	],
	[
		[
			4250,
			4253
		],
		"valid"
	],
	[
		[
			4254,
			4255
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4256,
			4293
		],
		"disallowed"
	],
	[
		[
			4294,
			4294
		],
		"disallowed"
	],
	[
		[
			4295,
			4295
		],
		"mapped",
		[
			11559
		]
	],
	[
		[
			4296,
			4300
		],
		"disallowed"
	],
	[
		[
			4301,
			4301
		],
		"mapped",
		[
			11565
		]
	],
	[
		[
			4302,
			4303
		],
		"disallowed"
	],
	[
		[
			4304,
			4342
		],
		"valid"
	],
	[
		[
			4343,
			4344
		],
		"valid"
	],
	[
		[
			4345,
			4346
		],
		"valid"
	],
	[
		[
			4347,
			4347
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4348,
			4348
		],
		"mapped",
		[
			4316
		]
	],
	[
		[
			4349,
			4351
		],
		"valid"
	],
	[
		[
			4352,
			4441
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4442,
			4446
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4447,
			4448
		],
		"disallowed"
	],
	[
		[
			4449,
			4514
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4515,
			4519
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4520,
			4601
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4602,
			4607
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4608,
			4614
		],
		"valid"
	],
	[
		[
			4615,
			4615
		],
		"valid"
	],
	[
		[
			4616,
			4678
		],
		"valid"
	],
	[
		[
			4679,
			4679
		],
		"valid"
	],
	[
		[
			4680,
			4680
		],
		"valid"
	],
	[
		[
			4681,
			4681
		],
		"disallowed"
	],
	[
		[
			4682,
			4685
		],
		"valid"
	],
	[
		[
			4686,
			4687
		],
		"disallowed"
	],
	[
		[
			4688,
			4694
		],
		"valid"
	],
	[
		[
			4695,
			4695
		],
		"disallowed"
	],
	[
		[
			4696,
			4696
		],
		"valid"
	],
	[
		[
			4697,
			4697
		],
		"disallowed"
	],
	[
		[
			4698,
			4701
		],
		"valid"
	],
	[
		[
			4702,
			4703
		],
		"disallowed"
	],
	[
		[
			4704,
			4742
		],
		"valid"
	],
	[
		[
			4743,
			4743
		],
		"valid"
	],
	[
		[
			4744,
			4744
		],
		"valid"
	],
	[
		[
			4745,
			4745
		],
		"disallowed"
	],
	[
		[
			4746,
			4749
		],
		"valid"
	],
	[
		[
			4750,
			4751
		],
		"disallowed"
	],
	[
		[
			4752,
			4782
		],
		"valid"
	],
	[
		[
			4783,
			4783
		],
		"valid"
	],
	[
		[
			4784,
			4784
		],
		"valid"
	],
	[
		[
			4785,
			4785
		],
		"disallowed"
	],
	[
		[
			4786,
			4789
		],
		"valid"
	],
	[
		[
			4790,
			4791
		],
		"disallowed"
	],
	[
		[
			4792,
			4798
		],
		"valid"
	],
	[
		[
			4799,
			4799
		],
		"disallowed"
	],
	[
		[
			4800,
			4800
		],
		"valid"
	],
	[
		[
			4801,
			4801
		],
		"disallowed"
	],
	[
		[
			4802,
			4805
		],
		"valid"
	],
	[
		[
			4806,
			4807
		],
		"disallowed"
	],
	[
		[
			4808,
			4814
		],
		"valid"
	],
	[
		[
			4815,
			4815
		],
		"valid"
	],
	[
		[
			4816,
			4822
		],
		"valid"
	],
	[
		[
			4823,
			4823
		],
		"disallowed"
	],
	[
		[
			4824,
			4846
		],
		"valid"
	],
	[
		[
			4847,
			4847
		],
		"valid"
	],
	[
		[
			4848,
			4878
		],
		"valid"
	],
	[
		[
			4879,
			4879
		],
		"valid"
	],
	[
		[
			4880,
			4880
		],
		"valid"
	],
	[
		[
			4881,
			4881
		],
		"disallowed"
	],
	[
		[
			4882,
			4885
		],
		"valid"
	],
	[
		[
			4886,
			4887
		],
		"disallowed"
	],
	[
		[
			4888,
			4894
		],
		"valid"
	],
	[
		[
			4895,
			4895
		],
		"valid"
	],
	[
		[
			4896,
			4934
		],
		"valid"
	],
	[
		[
			4935,
			4935
		],
		"valid"
	],
	[
		[
			4936,
			4954
		],
		"valid"
	],
	[
		[
			4955,
			4956
		],
		"disallowed"
	],
	[
		[
			4957,
			4958
		],
		"valid"
	],
	[
		[
			4959,
			4959
		],
		"valid"
	],
	[
		[
			4960,
			4960
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4961,
			4988
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			4989,
			4991
		],
		"disallowed"
	],
	[
		[
			4992,
			5007
		],
		"valid"
	],
	[
		[
			5008,
			5017
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5018,
			5023
		],
		"disallowed"
	],
	[
		[
			5024,
			5108
		],
		"valid"
	],
	[
		[
			5109,
			5109
		],
		"valid"
	],
	[
		[
			5110,
			5111
		],
		"disallowed"
	],
	[
		[
			5112,
			5112
		],
		"mapped",
		[
			5104
		]
	],
	[
		[
			5113,
			5113
		],
		"mapped",
		[
			5105
		]
	],
	[
		[
			5114,
			5114
		],
		"mapped",
		[
			5106
		]
	],
	[
		[
			5115,
			5115
		],
		"mapped",
		[
			5107
		]
	],
	[
		[
			5116,
			5116
		],
		"mapped",
		[
			5108
		]
	],
	[
		[
			5117,
			5117
		],
		"mapped",
		[
			5109
		]
	],
	[
		[
			5118,
			5119
		],
		"disallowed"
	],
	[
		[
			5120,
			5120
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5121,
			5740
		],
		"valid"
	],
	[
		[
			5741,
			5742
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5743,
			5750
		],
		"valid"
	],
	[
		[
			5751,
			5759
		],
		"valid"
	],
	[
		[
			5760,
			5760
		],
		"disallowed"
	],
	[
		[
			5761,
			5786
		],
		"valid"
	],
	[
		[
			5787,
			5788
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5789,
			5791
		],
		"disallowed"
	],
	[
		[
			5792,
			5866
		],
		"valid"
	],
	[
		[
			5867,
			5872
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5873,
			5880
		],
		"valid"
	],
	[
		[
			5881,
			5887
		],
		"disallowed"
	],
	[
		[
			5888,
			5900
		],
		"valid"
	],
	[
		[
			5901,
			5901
		],
		"disallowed"
	],
	[
		[
			5902,
			5908
		],
		"valid"
	],
	[
		[
			5909,
			5919
		],
		"disallowed"
	],
	[
		[
			5920,
			5940
		],
		"valid"
	],
	[
		[
			5941,
			5942
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			5943,
			5951
		],
		"disallowed"
	],
	[
		[
			5952,
			5971
		],
		"valid"
	],
	[
		[
			5972,
			5983
		],
		"disallowed"
	],
	[
		[
			5984,
			5996
		],
		"valid"
	],
	[
		[
			5997,
			5997
		],
		"disallowed"
	],
	[
		[
			5998,
			6000
		],
		"valid"
	],
	[
		[
			6001,
			6001
		],
		"disallowed"
	],
	[
		[
			6002,
			6003
		],
		"valid"
	],
	[
		[
			6004,
			6015
		],
		"disallowed"
	],
	[
		[
			6016,
			6067
		],
		"valid"
	],
	[
		[
			6068,
			6069
		],
		"disallowed"
	],
	[
		[
			6070,
			6099
		],
		"valid"
	],
	[
		[
			6100,
			6102
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6103,
			6103
		],
		"valid"
	],
	[
		[
			6104,
			6107
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6108,
			6108
		],
		"valid"
	],
	[
		[
			6109,
			6109
		],
		"valid"
	],
	[
		[
			6110,
			6111
		],
		"disallowed"
	],
	[
		[
			6112,
			6121
		],
		"valid"
	],
	[
		[
			6122,
			6127
		],
		"disallowed"
	],
	[
		[
			6128,
			6137
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6138,
			6143
		],
		"disallowed"
	],
	[
		[
			6144,
			6149
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6150,
			6150
		],
		"disallowed"
	],
	[
		[
			6151,
			6154
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6155,
			6157
		],
		"ignored"
	],
	[
		[
			6158,
			6158
		],
		"disallowed"
	],
	[
		[
			6159,
			6159
		],
		"disallowed"
	],
	[
		[
			6160,
			6169
		],
		"valid"
	],
	[
		[
			6170,
			6175
		],
		"disallowed"
	],
	[
		[
			6176,
			6263
		],
		"valid"
	],
	[
		[
			6264,
			6271
		],
		"disallowed"
	],
	[
		[
			6272,
			6313
		],
		"valid"
	],
	[
		[
			6314,
			6314
		],
		"valid"
	],
	[
		[
			6315,
			6319
		],
		"disallowed"
	],
	[
		[
			6320,
			6389
		],
		"valid"
	],
	[
		[
			6390,
			6399
		],
		"disallowed"
	],
	[
		[
			6400,
			6428
		],
		"valid"
	],
	[
		[
			6429,
			6430
		],
		"valid"
	],
	[
		[
			6431,
			6431
		],
		"disallowed"
	],
	[
		[
			6432,
			6443
		],
		"valid"
	],
	[
		[
			6444,
			6447
		],
		"disallowed"
	],
	[
		[
			6448,
			6459
		],
		"valid"
	],
	[
		[
			6460,
			6463
		],
		"disallowed"
	],
	[
		[
			6464,
			6464
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6465,
			6467
		],
		"disallowed"
	],
	[
		[
			6468,
			6469
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6470,
			6509
		],
		"valid"
	],
	[
		[
			6510,
			6511
		],
		"disallowed"
	],
	[
		[
			6512,
			6516
		],
		"valid"
	],
	[
		[
			6517,
			6527
		],
		"disallowed"
	],
	[
		[
			6528,
			6569
		],
		"valid"
	],
	[
		[
			6570,
			6571
		],
		"valid"
	],
	[
		[
			6572,
			6575
		],
		"disallowed"
	],
	[
		[
			6576,
			6601
		],
		"valid"
	],
	[
		[
			6602,
			6607
		],
		"disallowed"
	],
	[
		[
			6608,
			6617
		],
		"valid"
	],
	[
		[
			6618,
			6618
		],
		"valid",
		[
		],
		"XV8"
	],
	[
		[
			6619,
			6621
		],
		"disallowed"
	],
	[
		[
			6622,
			6623
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6624,
			6655
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6656,
			6683
		],
		"valid"
	],
	[
		[
			6684,
			6685
		],
		"disallowed"
	],
	[
		[
			6686,
			6687
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6688,
			6750
		],
		"valid"
	],
	[
		[
			6751,
			6751
		],
		"disallowed"
	],
	[
		[
			6752,
			6780
		],
		"valid"
	],
	[
		[
			6781,
			6782
		],
		"disallowed"
	],
	[
		[
			6783,
			6793
		],
		"valid"
	],
	[
		[
			6794,
			6799
		],
		"disallowed"
	],
	[
		[
			6800,
			6809
		],
		"valid"
	],
	[
		[
			6810,
			6815
		],
		"disallowed"
	],
	[
		[
			6816,
			6822
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6823,
			6823
		],
		"valid"
	],
	[
		[
			6824,
			6829
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6830,
			6831
		],
		"disallowed"
	],
	[
		[
			6832,
			6845
		],
		"valid"
	],
	[
		[
			6846,
			6846
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			6847,
			6911
		],
		"disallowed"
	],
	[
		[
			6912,
			6987
		],
		"valid"
	],
	[
		[
			6988,
			6991
		],
		"disallowed"
	],
	[
		[
			6992,
			7001
		],
		"valid"
	],
	[
		[
			7002,
			7018
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7019,
			7027
		],
		"valid"
	],
	[
		[
			7028,
			7036
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7037,
			7039
		],
		"disallowed"
	],
	[
		[
			7040,
			7082
		],
		"valid"
	],
	[
		[
			7083,
			7085
		],
		"valid"
	],
	[
		[
			7086,
			7097
		],
		"valid"
	],
	[
		[
			7098,
			7103
		],
		"valid"
	],
	[
		[
			7104,
			7155
		],
		"valid"
	],
	[
		[
			7156,
			7163
		],
		"disallowed"
	],
	[
		[
			7164,
			7167
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7168,
			7223
		],
		"valid"
	],
	[
		[
			7224,
			7226
		],
		"disallowed"
	],
	[
		[
			7227,
			7231
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7232,
			7241
		],
		"valid"
	],
	[
		[
			7242,
			7244
		],
		"disallowed"
	],
	[
		[
			7245,
			7293
		],
		"valid"
	],
	[
		[
			7294,
			7295
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7296,
			7359
		],
		"disallowed"
	],
	[
		[
			7360,
			7367
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7368,
			7375
		],
		"disallowed"
	],
	[
		[
			7376,
			7378
		],
		"valid"
	],
	[
		[
			7379,
			7379
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			7380,
			7410
		],
		"valid"
	],
	[
		[
			7411,
			7414
		],
		"valid"
	],
	[
		[
			7415,
			7415
		],
		"disallowed"
	],
	[
		[
			7416,
			7417
		],
		"valid"
	],
	[
		[
			7418,
			7423
		],
		"disallowed"
	],
	[
		[
			7424,
			7467
		],
		"valid"
	],
	[
		[
			7468,
			7468
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			7469,
			7469
		],
		"mapped",
		[
			230
		]
	],
	[
		[
			7470,
			7470
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			7471,
			7471
		],
		"valid"
	],
	[
		[
			7472,
			7472
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			7473,
			7473
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			7474,
			7474
		],
		"mapped",
		[
			477
		]
	],
	[
		[
			7475,
			7475
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			7476,
			7476
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			7477,
			7477
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			7478,
			7478
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			7479,
			7479
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			7480,
			7480
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			7481,
			7481
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			7482,
			7482
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			7483,
			7483
		],
		"valid"
	],
	[
		[
			7484,
			7484
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			7485,
			7485
		],
		"mapped",
		[
			547
		]
	],
	[
		[
			7486,
			7486
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			7487,
			7487
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			7488,
			7488
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			7489,
			7489
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			7490,
			7490
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			7491,
			7491
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			7492,
			7492
		],
		"mapped",
		[
			592
		]
	],
	[
		[
			7493,
			7493
		],
		"mapped",
		[
			593
		]
	],
	[
		[
			7494,
			7494
		],
		"mapped",
		[
			7426
		]
	],
	[
		[
			7495,
			7495
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			7496,
			7496
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			7497,
			7497
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			7498,
			7498
		],
		"mapped",
		[
			601
		]
	],
	[
		[
			7499,
			7499
		],
		"mapped",
		[
			603
		]
	],
	[
		[
			7500,
			7500
		],
		"mapped",
		[
			604
		]
	],
	[
		[
			7501,
			7501
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			7502,
			7502
		],
		"valid"
	],
	[
		[
			7503,
			7503
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			7504,
			7504
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			7505,
			7505
		],
		"mapped",
		[
			331
		]
	],
	[
		[
			7506,
			7506
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			7507,
			7507
		],
		"mapped",
		[
			596
		]
	],
	[
		[
			7508,
			7508
		],
		"mapped",
		[
			7446
		]
	],
	[
		[
			7509,
			7509
		],
		"mapped",
		[
			7447
		]
	],
	[
		[
			7510,
			7510
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			7511,
			7511
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			7512,
			7512
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			7513,
			7513
		],
		"mapped",
		[
			7453
		]
	],
	[
		[
			7514,
			7514
		],
		"mapped",
		[
			623
		]
	],
	[
		[
			7515,
			7515
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			7516,
			7516
		],
		"mapped",
		[
			7461
		]
	],
	[
		[
			7517,
			7517
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			7518,
			7518
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			7519,
			7519
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			7520,
			7520
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			7521,
			7521
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			7522,
			7522
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			7523,
			7523
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			7524,
			7524
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			7525,
			7525
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			7526,
			7526
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			7527,
			7527
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			7528,
			7528
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			7529,
			7529
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			7530,
			7530
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			7531,
			7531
		],
		"valid"
	],
	[
		[
			7532,
			7543
		],
		"valid"
	],
	[
		[
			7544,
			7544
		],
		"mapped",
		[
			1085
		]
	],
	[
		[
			7545,
			7578
		],
		"valid"
	],
	[
		[
			7579,
			7579
		],
		"mapped",
		[
			594
		]
	],
	[
		[
			7580,
			7580
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			7581,
			7581
		],
		"mapped",
		[
			597
		]
	],
	[
		[
			7582,
			7582
		],
		"mapped",
		[
			240
		]
	],
	[
		[
			7583,
			7583
		],
		"mapped",
		[
			604
		]
	],
	[
		[
			7584,
			7584
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			7585,
			7585
		],
		"mapped",
		[
			607
		]
	],
	[
		[
			7586,
			7586
		],
		"mapped",
		[
			609
		]
	],
	[
		[
			7587,
			7587
		],
		"mapped",
		[
			613
		]
	],
	[
		[
			7588,
			7588
		],
		"mapped",
		[
			616
		]
	],
	[
		[
			7589,
			7589
		],
		"mapped",
		[
			617
		]
	],
	[
		[
			7590,
			7590
		],
		"mapped",
		[
			618
		]
	],
	[
		[
			7591,
			7591
		],
		"mapped",
		[
			7547
		]
	],
	[
		[
			7592,
			7592
		],
		"mapped",
		[
			669
		]
	],
	[
		[
			7593,
			7593
		],
		"mapped",
		[
			621
		]
	],
	[
		[
			7594,
			7594
		],
		"mapped",
		[
			7557
		]
	],
	[
		[
			7595,
			7595
		],
		"mapped",
		[
			671
		]
	],
	[
		[
			7596,
			7596
		],
		"mapped",
		[
			625
		]
	],
	[
		[
			7597,
			7597
		],
		"mapped",
		[
			624
		]
	],
	[
		[
			7598,
			7598
		],
		"mapped",
		[
			626
		]
	],
	[
		[
			7599,
			7599
		],
		"mapped",
		[
			627
		]
	],
	[
		[
			7600,
			7600
		],
		"mapped",
		[
			628
		]
	],
	[
		[
			7601,
			7601
		],
		"mapped",
		[
			629
		]
	],
	[
		[
			7602,
			7602
		],
		"mapped",
		[
			632
		]
	],
	[
		[
			7603,
			7603
		],
		"mapped",
		[
			642
		]
	],
	[
		[
			7604,
			7604
		],
		"mapped",
		[
			643
		]
	],
	[
		[
			7605,
			7605
		],
		"mapped",
		[
			427
		]
	],
	[
		[
			7606,
			7606
		],
		"mapped",
		[
			649
		]
	],
	[
		[
			7607,
			7607
		],
		"mapped",
		[
			650
		]
	],
	[
		[
			7608,
			7608
		],
		"mapped",
		[
			7452
		]
	],
	[
		[
			7609,
			7609
		],
		"mapped",
		[
			651
		]
	],
	[
		[
			7610,
			7610
		],
		"mapped",
		[
			652
		]
	],
	[
		[
			7611,
			7611
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			7612,
			7612
		],
		"mapped",
		[
			656
		]
	],
	[
		[
			7613,
			7613
		],
		"mapped",
		[
			657
		]
	],
	[
		[
			7614,
			7614
		],
		"mapped",
		[
			658
		]
	],
	[
		[
			7615,
			7615
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			7616,
			7619
		],
		"valid"
	],
	[
		[
			7620,
			7626
		],
		"valid"
	],
	[
		[
			7627,
			7654
		],
		"valid"
	],
	[
		[
			7655,
			7669
		],
		"valid"
	],
	[
		[
			7670,
			7675
		],
		"disallowed"
	],
	[
		[
			7676,
			7676
		],
		"valid"
	],
	[
		[
			7677,
			7677
		],
		"valid"
	],
	[
		[
			7678,
			7679
		],
		"valid"
	],
	[
		[
			7680,
			7680
		],
		"mapped",
		[
			7681
		]
	],
	[
		[
			7681,
			7681
		],
		"valid"
	],
	[
		[
			7682,
			7682
		],
		"mapped",
		[
			7683
		]
	],
	[
		[
			7683,
			7683
		],
		"valid"
	],
	[
		[
			7684,
			7684
		],
		"mapped",
		[
			7685
		]
	],
	[
		[
			7685,
			7685
		],
		"valid"
	],
	[
		[
			7686,
			7686
		],
		"mapped",
		[
			7687
		]
	],
	[
		[
			7687,
			7687
		],
		"valid"
	],
	[
		[
			7688,
			7688
		],
		"mapped",
		[
			7689
		]
	],
	[
		[
			7689,
			7689
		],
		"valid"
	],
	[
		[
			7690,
			7690
		],
		"mapped",
		[
			7691
		]
	],
	[
		[
			7691,
			7691
		],
		"valid"
	],
	[
		[
			7692,
			7692
		],
		"mapped",
		[
			7693
		]
	],
	[
		[
			7693,
			7693
		],
		"valid"
	],
	[
		[
			7694,
			7694
		],
		"mapped",
		[
			7695
		]
	],
	[
		[
			7695,
			7695
		],
		"valid"
	],
	[
		[
			7696,
			7696
		],
		"mapped",
		[
			7697
		]
	],
	[
		[
			7697,
			7697
		],
		"valid"
	],
	[
		[
			7698,
			7698
		],
		"mapped",
		[
			7699
		]
	],
	[
		[
			7699,
			7699
		],
		"valid"
	],
	[
		[
			7700,
			7700
		],
		"mapped",
		[
			7701
		]
	],
	[
		[
			7701,
			7701
		],
		"valid"
	],
	[
		[
			7702,
			7702
		],
		"mapped",
		[
			7703
		]
	],
	[
		[
			7703,
			7703
		],
		"valid"
	],
	[
		[
			7704,
			7704
		],
		"mapped",
		[
			7705
		]
	],
	[
		[
			7705,
			7705
		],
		"valid"
	],
	[
		[
			7706,
			7706
		],
		"mapped",
		[
			7707
		]
	],
	[
		[
			7707,
			7707
		],
		"valid"
	],
	[
		[
			7708,
			7708
		],
		"mapped",
		[
			7709
		]
	],
	[
		[
			7709,
			7709
		],
		"valid"
	],
	[
		[
			7710,
			7710
		],
		"mapped",
		[
			7711
		]
	],
	[
		[
			7711,
			7711
		],
		"valid"
	],
	[
		[
			7712,
			7712
		],
		"mapped",
		[
			7713
		]
	],
	[
		[
			7713,
			7713
		],
		"valid"
	],
	[
		[
			7714,
			7714
		],
		"mapped",
		[
			7715
		]
	],
	[
		[
			7715,
			7715
		],
		"valid"
	],
	[
		[
			7716,
			7716
		],
		"mapped",
		[
			7717
		]
	],
	[
		[
			7717,
			7717
		],
		"valid"
	],
	[
		[
			7718,
			7718
		],
		"mapped",
		[
			7719
		]
	],
	[
		[
			7719,
			7719
		],
		"valid"
	],
	[
		[
			7720,
			7720
		],
		"mapped",
		[
			7721
		]
	],
	[
		[
			7721,
			7721
		],
		"valid"
	],
	[
		[
			7722,
			7722
		],
		"mapped",
		[
			7723
		]
	],
	[
		[
			7723,
			7723
		],
		"valid"
	],
	[
		[
			7724,
			7724
		],
		"mapped",
		[
			7725
		]
	],
	[
		[
			7725,
			7725
		],
		"valid"
	],
	[
		[
			7726,
			7726
		],
		"mapped",
		[
			7727
		]
	],
	[
		[
			7727,
			7727
		],
		"valid"
	],
	[
		[
			7728,
			7728
		],
		"mapped",
		[
			7729
		]
	],
	[
		[
			7729,
			7729
		],
		"valid"
	],
	[
		[
			7730,
			7730
		],
		"mapped",
		[
			7731
		]
	],
	[
		[
			7731,
			7731
		],
		"valid"
	],
	[
		[
			7732,
			7732
		],
		"mapped",
		[
			7733
		]
	],
	[
		[
			7733,
			7733
		],
		"valid"
	],
	[
		[
			7734,
			7734
		],
		"mapped",
		[
			7735
		]
	],
	[
		[
			7735,
			7735
		],
		"valid"
	],
	[
		[
			7736,
			7736
		],
		"mapped",
		[
			7737
		]
	],
	[
		[
			7737,
			7737
		],
		"valid"
	],
	[
		[
			7738,
			7738
		],
		"mapped",
		[
			7739
		]
	],
	[
		[
			7739,
			7739
		],
		"valid"
	],
	[
		[
			7740,
			7740
		],
		"mapped",
		[
			7741
		]
	],
	[
		[
			7741,
			7741
		],
		"valid"
	],
	[
		[
			7742,
			7742
		],
		"mapped",
		[
			7743
		]
	],
	[
		[
			7743,
			7743
		],
		"valid"
	],
	[
		[
			7744,
			7744
		],
		"mapped",
		[
			7745
		]
	],
	[
		[
			7745,
			7745
		],
		"valid"
	],
	[
		[
			7746,
			7746
		],
		"mapped",
		[
			7747
		]
	],
	[
		[
			7747,
			7747
		],
		"valid"
	],
	[
		[
			7748,
			7748
		],
		"mapped",
		[
			7749
		]
	],
	[
		[
			7749,
			7749
		],
		"valid"
	],
	[
		[
			7750,
			7750
		],
		"mapped",
		[
			7751
		]
	],
	[
		[
			7751,
			7751
		],
		"valid"
	],
	[
		[
			7752,
			7752
		],
		"mapped",
		[
			7753
		]
	],
	[
		[
			7753,
			7753
		],
		"valid"
	],
	[
		[
			7754,
			7754
		],
		"mapped",
		[
			7755
		]
	],
	[
		[
			7755,
			7755
		],
		"valid"
	],
	[
		[
			7756,
			7756
		],
		"mapped",
		[
			7757
		]
	],
	[
		[
			7757,
			7757
		],
		"valid"
	],
	[
		[
			7758,
			7758
		],
		"mapped",
		[
			7759
		]
	],
	[
		[
			7759,
			7759
		],
		"valid"
	],
	[
		[
			7760,
			7760
		],
		"mapped",
		[
			7761
		]
	],
	[
		[
			7761,
			7761
		],
		"valid"
	],
	[
		[
			7762,
			7762
		],
		"mapped",
		[
			7763
		]
	],
	[
		[
			7763,
			7763
		],
		"valid"
	],
	[
		[
			7764,
			7764
		],
		"mapped",
		[
			7765
		]
	],
	[
		[
			7765,
			7765
		],
		"valid"
	],
	[
		[
			7766,
			7766
		],
		"mapped",
		[
			7767
		]
	],
	[
		[
			7767,
			7767
		],
		"valid"
	],
	[
		[
			7768,
			7768
		],
		"mapped",
		[
			7769
		]
	],
	[
		[
			7769,
			7769
		],
		"valid"
	],
	[
		[
			7770,
			7770
		],
		"mapped",
		[
			7771
		]
	],
	[
		[
			7771,
			7771
		],
		"valid"
	],
	[
		[
			7772,
			7772
		],
		"mapped",
		[
			7773
		]
	],
	[
		[
			7773,
			7773
		],
		"valid"
	],
	[
		[
			7774,
			7774
		],
		"mapped",
		[
			7775
		]
	],
	[
		[
			7775,
			7775
		],
		"valid"
	],
	[
		[
			7776,
			7776
		],
		"mapped",
		[
			7777
		]
	],
	[
		[
			7777,
			7777
		],
		"valid"
	],
	[
		[
			7778,
			7778
		],
		"mapped",
		[
			7779
		]
	],
	[
		[
			7779,
			7779
		],
		"valid"
	],
	[
		[
			7780,
			7780
		],
		"mapped",
		[
			7781
		]
	],
	[
		[
			7781,
			7781
		],
		"valid"
	],
	[
		[
			7782,
			7782
		],
		"mapped",
		[
			7783
		]
	],
	[
		[
			7783,
			7783
		],
		"valid"
	],
	[
		[
			7784,
			7784
		],
		"mapped",
		[
			7785
		]
	],
	[
		[
			7785,
			7785
		],
		"valid"
	],
	[
		[
			7786,
			7786
		],
		"mapped",
		[
			7787
		]
	],
	[
		[
			7787,
			7787
		],
		"valid"
	],
	[
		[
			7788,
			7788
		],
		"mapped",
		[
			7789
		]
	],
	[
		[
			7789,
			7789
		],
		"valid"
	],
	[
		[
			7790,
			7790
		],
		"mapped",
		[
			7791
		]
	],
	[
		[
			7791,
			7791
		],
		"valid"
	],
	[
		[
			7792,
			7792
		],
		"mapped",
		[
			7793
		]
	],
	[
		[
			7793,
			7793
		],
		"valid"
	],
	[
		[
			7794,
			7794
		],
		"mapped",
		[
			7795
		]
	],
	[
		[
			7795,
			7795
		],
		"valid"
	],
	[
		[
			7796,
			7796
		],
		"mapped",
		[
			7797
		]
	],
	[
		[
			7797,
			7797
		],
		"valid"
	],
	[
		[
			7798,
			7798
		],
		"mapped",
		[
			7799
		]
	],
	[
		[
			7799,
			7799
		],
		"valid"
	],
	[
		[
			7800,
			7800
		],
		"mapped",
		[
			7801
		]
	],
	[
		[
			7801,
			7801
		],
		"valid"
	],
	[
		[
			7802,
			7802
		],
		"mapped",
		[
			7803
		]
	],
	[
		[
			7803,
			7803
		],
		"valid"
	],
	[
		[
			7804,
			7804
		],
		"mapped",
		[
			7805
		]
	],
	[
		[
			7805,
			7805
		],
		"valid"
	],
	[
		[
			7806,
			7806
		],
		"mapped",
		[
			7807
		]
	],
	[
		[
			7807,
			7807
		],
		"valid"
	],
	[
		[
			7808,
			7808
		],
		"mapped",
		[
			7809
		]
	],
	[
		[
			7809,
			7809
		],
		"valid"
	],
	[
		[
			7810,
			7810
		],
		"mapped",
		[
			7811
		]
	],
	[
		[
			7811,
			7811
		],
		"valid"
	],
	[
		[
			7812,
			7812
		],
		"mapped",
		[
			7813
		]
	],
	[
		[
			7813,
			7813
		],
		"valid"
	],
	[
		[
			7814,
			7814
		],
		"mapped",
		[
			7815
		]
	],
	[
		[
			7815,
			7815
		],
		"valid"
	],
	[
		[
			7816,
			7816
		],
		"mapped",
		[
			7817
		]
	],
	[
		[
			7817,
			7817
		],
		"valid"
	],
	[
		[
			7818,
			7818
		],
		"mapped",
		[
			7819
		]
	],
	[
		[
			7819,
			7819
		],
		"valid"
	],
	[
		[
			7820,
			7820
		],
		"mapped",
		[
			7821
		]
	],
	[
		[
			7821,
			7821
		],
		"valid"
	],
	[
		[
			7822,
			7822
		],
		"mapped",
		[
			7823
		]
	],
	[
		[
			7823,
			7823
		],
		"valid"
	],
	[
		[
			7824,
			7824
		],
		"mapped",
		[
			7825
		]
	],
	[
		[
			7825,
			7825
		],
		"valid"
	],
	[
		[
			7826,
			7826
		],
		"mapped",
		[
			7827
		]
	],
	[
		[
			7827,
			7827
		],
		"valid"
	],
	[
		[
			7828,
			7828
		],
		"mapped",
		[
			7829
		]
	],
	[
		[
			7829,
			7833
		],
		"valid"
	],
	[
		[
			7834,
			7834
		],
		"mapped",
		[
			97,
			702
		]
	],
	[
		[
			7835,
			7835
		],
		"mapped",
		[
			7777
		]
	],
	[
		[
			7836,
			7837
		],
		"valid"
	],
	[
		[
			7838,
			7838
		],
		"mapped",
		[
			115,
			115
		]
	],
	[
		[
			7839,
			7839
		],
		"valid"
	],
	[
		[
			7840,
			7840
		],
		"mapped",
		[
			7841
		]
	],
	[
		[
			7841,
			7841
		],
		"valid"
	],
	[
		[
			7842,
			7842
		],
		"mapped",
		[
			7843
		]
	],
	[
		[
			7843,
			7843
		],
		"valid"
	],
	[
		[
			7844,
			7844
		],
		"mapped",
		[
			7845
		]
	],
	[
		[
			7845,
			7845
		],
		"valid"
	],
	[
		[
			7846,
			7846
		],
		"mapped",
		[
			7847
		]
	],
	[
		[
			7847,
			7847
		],
		"valid"
	],
	[
		[
			7848,
			7848
		],
		"mapped",
		[
			7849
		]
	],
	[
		[
			7849,
			7849
		],
		"valid"
	],
	[
		[
			7850,
			7850
		],
		"mapped",
		[
			7851
		]
	],
	[
		[
			7851,
			7851
		],
		"valid"
	],
	[
		[
			7852,
			7852
		],
		"mapped",
		[
			7853
		]
	],
	[
		[
			7853,
			7853
		],
		"valid"
	],
	[
		[
			7854,
			7854
		],
		"mapped",
		[
			7855
		]
	],
	[
		[
			7855,
			7855
		],
		"valid"
	],
	[
		[
			7856,
			7856
		],
		"mapped",
		[
			7857
		]
	],
	[
		[
			7857,
			7857
		],
		"valid"
	],
	[
		[
			7858,
			7858
		],
		"mapped",
		[
			7859
		]
	],
	[
		[
			7859,
			7859
		],
		"valid"
	],
	[
		[
			7860,
			7860
		],
		"mapped",
		[
			7861
		]
	],
	[
		[
			7861,
			7861
		],
		"valid"
	],
	[
		[
			7862,
			7862
		],
		"mapped",
		[
			7863
		]
	],
	[
		[
			7863,
			7863
		],
		"valid"
	],
	[
		[
			7864,
			7864
		],
		"mapped",
		[
			7865
		]
	],
	[
		[
			7865,
			7865
		],
		"valid"
	],
	[
		[
			7866,
			7866
		],
		"mapped",
		[
			7867
		]
	],
	[
		[
			7867,
			7867
		],
		"valid"
	],
	[
		[
			7868,
			7868
		],
		"mapped",
		[
			7869
		]
	],
	[
		[
			7869,
			7869
		],
		"valid"
	],
	[
		[
			7870,
			7870
		],
		"mapped",
		[
			7871
		]
	],
	[
		[
			7871,
			7871
		],
		"valid"
	],
	[
		[
			7872,
			7872
		],
		"mapped",
		[
			7873
		]
	],
	[
		[
			7873,
			7873
		],
		"valid"
	],
	[
		[
			7874,
			7874
		],
		"mapped",
		[
			7875
		]
	],
	[
		[
			7875,
			7875
		],
		"valid"
	],
	[
		[
			7876,
			7876
		],
		"mapped",
		[
			7877
		]
	],
	[
		[
			7877,
			7877
		],
		"valid"
	],
	[
		[
			7878,
			7878
		],
		"mapped",
		[
			7879
		]
	],
	[
		[
			7879,
			7879
		],
		"valid"
	],
	[
		[
			7880,
			7880
		],
		"mapped",
		[
			7881
		]
	],
	[
		[
			7881,
			7881
		],
		"valid"
	],
	[
		[
			7882,
			7882
		],
		"mapped",
		[
			7883
		]
	],
	[
		[
			7883,
			7883
		],
		"valid"
	],
	[
		[
			7884,
			7884
		],
		"mapped",
		[
			7885
		]
	],
	[
		[
			7885,
			7885
		],
		"valid"
	],
	[
		[
			7886,
			7886
		],
		"mapped",
		[
			7887
		]
	],
	[
		[
			7887,
			7887
		],
		"valid"
	],
	[
		[
			7888,
			7888
		],
		"mapped",
		[
			7889
		]
	],
	[
		[
			7889,
			7889
		],
		"valid"
	],
	[
		[
			7890,
			7890
		],
		"mapped",
		[
			7891
		]
	],
	[
		[
			7891,
			7891
		],
		"valid"
	],
	[
		[
			7892,
			7892
		],
		"mapped",
		[
			7893
		]
	],
	[
		[
			7893,
			7893
		],
		"valid"
	],
	[
		[
			7894,
			7894
		],
		"mapped",
		[
			7895
		]
	],
	[
		[
			7895,
			7895
		],
		"valid"
	],
	[
		[
			7896,
			7896
		],
		"mapped",
		[
			7897
		]
	],
	[
		[
			7897,
			7897
		],
		"valid"
	],
	[
		[
			7898,
			7898
		],
		"mapped",
		[
			7899
		]
	],
	[
		[
			7899,
			7899
		],
		"valid"
	],
	[
		[
			7900,
			7900
		],
		"mapped",
		[
			7901
		]
	],
	[
		[
			7901,
			7901
		],
		"valid"
	],
	[
		[
			7902,
			7902
		],
		"mapped",
		[
			7903
		]
	],
	[
		[
			7903,
			7903
		],
		"valid"
	],
	[
		[
			7904,
			7904
		],
		"mapped",
		[
			7905
		]
	],
	[
		[
			7905,
			7905
		],
		"valid"
	],
	[
		[
			7906,
			7906
		],
		"mapped",
		[
			7907
		]
	],
	[
		[
			7907,
			7907
		],
		"valid"
	],
	[
		[
			7908,
			7908
		],
		"mapped",
		[
			7909
		]
	],
	[
		[
			7909,
			7909
		],
		"valid"
	],
	[
		[
			7910,
			7910
		],
		"mapped",
		[
			7911
		]
	],
	[
		[
			7911,
			7911
		],
		"valid"
	],
	[
		[
			7912,
			7912
		],
		"mapped",
		[
			7913
		]
	],
	[
		[
			7913,
			7913
		],
		"valid"
	],
	[
		[
			7914,
			7914
		],
		"mapped",
		[
			7915
		]
	],
	[
		[
			7915,
			7915
		],
		"valid"
	],
	[
		[
			7916,
			7916
		],
		"mapped",
		[
			7917
		]
	],
	[
		[
			7917,
			7917
		],
		"valid"
	],
	[
		[
			7918,
			7918
		],
		"mapped",
		[
			7919
		]
	],
	[
		[
			7919,
			7919
		],
		"valid"
	],
	[
		[
			7920,
			7920
		],
		"mapped",
		[
			7921
		]
	],
	[
		[
			7921,
			7921
		],
		"valid"
	],
	[
		[
			7922,
			7922
		],
		"mapped",
		[
			7923
		]
	],
	[
		[
			7923,
			7923
		],
		"valid"
	],
	[
		[
			7924,
			7924
		],
		"mapped",
		[
			7925
		]
	],
	[
		[
			7925,
			7925
		],
		"valid"
	],
	[
		[
			7926,
			7926
		],
		"mapped",
		[
			7927
		]
	],
	[
		[
			7927,
			7927
		],
		"valid"
	],
	[
		[
			7928,
			7928
		],
		"mapped",
		[
			7929
		]
	],
	[
		[
			7929,
			7929
		],
		"valid"
	],
	[
		[
			7930,
			7930
		],
		"mapped",
		[
			7931
		]
	],
	[
		[
			7931,
			7931
		],
		"valid"
	],
	[
		[
			7932,
			7932
		],
		"mapped",
		[
			7933
		]
	],
	[
		[
			7933,
			7933
		],
		"valid"
	],
	[
		[
			7934,
			7934
		],
		"mapped",
		[
			7935
		]
	],
	[
		[
			7935,
			7935
		],
		"valid"
	],
	[
		[
			7936,
			7943
		],
		"valid"
	],
	[
		[
			7944,
			7944
		],
		"mapped",
		[
			7936
		]
	],
	[
		[
			7945,
			7945
		],
		"mapped",
		[
			7937
		]
	],
	[
		[
			7946,
			7946
		],
		"mapped",
		[
			7938
		]
	],
	[
		[
			7947,
			7947
		],
		"mapped",
		[
			7939
		]
	],
	[
		[
			7948,
			7948
		],
		"mapped",
		[
			7940
		]
	],
	[
		[
			7949,
			7949
		],
		"mapped",
		[
			7941
		]
	],
	[
		[
			7950,
			7950
		],
		"mapped",
		[
			7942
		]
	],
	[
		[
			7951,
			7951
		],
		"mapped",
		[
			7943
		]
	],
	[
		[
			7952,
			7957
		],
		"valid"
	],
	[
		[
			7958,
			7959
		],
		"disallowed"
	],
	[
		[
			7960,
			7960
		],
		"mapped",
		[
			7952
		]
	],
	[
		[
			7961,
			7961
		],
		"mapped",
		[
			7953
		]
	],
	[
		[
			7962,
			7962
		],
		"mapped",
		[
			7954
		]
	],
	[
		[
			7963,
			7963
		],
		"mapped",
		[
			7955
		]
	],
	[
		[
			7964,
			7964
		],
		"mapped",
		[
			7956
		]
	],
	[
		[
			7965,
			7965
		],
		"mapped",
		[
			7957
		]
	],
	[
		[
			7966,
			7967
		],
		"disallowed"
	],
	[
		[
			7968,
			7975
		],
		"valid"
	],
	[
		[
			7976,
			7976
		],
		"mapped",
		[
			7968
		]
	],
	[
		[
			7977,
			7977
		],
		"mapped",
		[
			7969
		]
	],
	[
		[
			7978,
			7978
		],
		"mapped",
		[
			7970
		]
	],
	[
		[
			7979,
			7979
		],
		"mapped",
		[
			7971
		]
	],
	[
		[
			7980,
			7980
		],
		"mapped",
		[
			7972
		]
	],
	[
		[
			7981,
			7981
		],
		"mapped",
		[
			7973
		]
	],
	[
		[
			7982,
			7982
		],
		"mapped",
		[
			7974
		]
	],
	[
		[
			7983,
			7983
		],
		"mapped",
		[
			7975
		]
	],
	[
		[
			7984,
			7991
		],
		"valid"
	],
	[
		[
			7992,
			7992
		],
		"mapped",
		[
			7984
		]
	],
	[
		[
			7993,
			7993
		],
		"mapped",
		[
			7985
		]
	],
	[
		[
			7994,
			7994
		],
		"mapped",
		[
			7986
		]
	],
	[
		[
			7995,
			7995
		],
		"mapped",
		[
			7987
		]
	],
	[
		[
			7996,
			7996
		],
		"mapped",
		[
			7988
		]
	],
	[
		[
			7997,
			7997
		],
		"mapped",
		[
			7989
		]
	],
	[
		[
			7998,
			7998
		],
		"mapped",
		[
			7990
		]
	],
	[
		[
			7999,
			7999
		],
		"mapped",
		[
			7991
		]
	],
	[
		[
			8000,
			8005
		],
		"valid"
	],
	[
		[
			8006,
			8007
		],
		"disallowed"
	],
	[
		[
			8008,
			8008
		],
		"mapped",
		[
			8000
		]
	],
	[
		[
			8009,
			8009
		],
		"mapped",
		[
			8001
		]
	],
	[
		[
			8010,
			8010
		],
		"mapped",
		[
			8002
		]
	],
	[
		[
			8011,
			8011
		],
		"mapped",
		[
			8003
		]
	],
	[
		[
			8012,
			8012
		],
		"mapped",
		[
			8004
		]
	],
	[
		[
			8013,
			8013
		],
		"mapped",
		[
			8005
		]
	],
	[
		[
			8014,
			8015
		],
		"disallowed"
	],
	[
		[
			8016,
			8023
		],
		"valid"
	],
	[
		[
			8024,
			8024
		],
		"disallowed"
	],
	[
		[
			8025,
			8025
		],
		"mapped",
		[
			8017
		]
	],
	[
		[
			8026,
			8026
		],
		"disallowed"
	],
	[
		[
			8027,
			8027
		],
		"mapped",
		[
			8019
		]
	],
	[
		[
			8028,
			8028
		],
		"disallowed"
	],
	[
		[
			8029,
			8029
		],
		"mapped",
		[
			8021
		]
	],
	[
		[
			8030,
			8030
		],
		"disallowed"
	],
	[
		[
			8031,
			8031
		],
		"mapped",
		[
			8023
		]
	],
	[
		[
			8032,
			8039
		],
		"valid"
	],
	[
		[
			8040,
			8040
		],
		"mapped",
		[
			8032
		]
	],
	[
		[
			8041,
			8041
		],
		"mapped",
		[
			8033
		]
	],
	[
		[
			8042,
			8042
		],
		"mapped",
		[
			8034
		]
	],
	[
		[
			8043,
			8043
		],
		"mapped",
		[
			8035
		]
	],
	[
		[
			8044,
			8044
		],
		"mapped",
		[
			8036
		]
	],
	[
		[
			8045,
			8045
		],
		"mapped",
		[
			8037
		]
	],
	[
		[
			8046,
			8046
		],
		"mapped",
		[
			8038
		]
	],
	[
		[
			8047,
			8047
		],
		"mapped",
		[
			8039
		]
	],
	[
		[
			8048,
			8048
		],
		"valid"
	],
	[
		[
			8049,
			8049
		],
		"mapped",
		[
			940
		]
	],
	[
		[
			8050,
			8050
		],
		"valid"
	],
	[
		[
			8051,
			8051
		],
		"mapped",
		[
			941
		]
	],
	[
		[
			8052,
			8052
		],
		"valid"
	],
	[
		[
			8053,
			8053
		],
		"mapped",
		[
			942
		]
	],
	[
		[
			8054,
			8054
		],
		"valid"
	],
	[
		[
			8055,
			8055
		],
		"mapped",
		[
			943
		]
	],
	[
		[
			8056,
			8056
		],
		"valid"
	],
	[
		[
			8057,
			8057
		],
		"mapped",
		[
			972
		]
	],
	[
		[
			8058,
			8058
		],
		"valid"
	],
	[
		[
			8059,
			8059
		],
		"mapped",
		[
			973
		]
	],
	[
		[
			8060,
			8060
		],
		"valid"
	],
	[
		[
			8061,
			8061
		],
		"mapped",
		[
			974
		]
	],
	[
		[
			8062,
			8063
		],
		"disallowed"
	],
	[
		[
			8064,
			8064
		],
		"mapped",
		[
			7936,
			953
		]
	],
	[
		[
			8065,
			8065
		],
		"mapped",
		[
			7937,
			953
		]
	],
	[
		[
			8066,
			8066
		],
		"mapped",
		[
			7938,
			953
		]
	],
	[
		[
			8067,
			8067
		],
		"mapped",
		[
			7939,
			953
		]
	],
	[
		[
			8068,
			8068
		],
		"mapped",
		[
			7940,
			953
		]
	],
	[
		[
			8069,
			8069
		],
		"mapped",
		[
			7941,
			953
		]
	],
	[
		[
			8070,
			8070
		],
		"mapped",
		[
			7942,
			953
		]
	],
	[
		[
			8071,
			8071
		],
		"mapped",
		[
			7943,
			953
		]
	],
	[
		[
			8072,
			8072
		],
		"mapped",
		[
			7936,
			953
		]
	],
	[
		[
			8073,
			8073
		],
		"mapped",
		[
			7937,
			953
		]
	],
	[
		[
			8074,
			8074
		],
		"mapped",
		[
			7938,
			953
		]
	],
	[
		[
			8075,
			8075
		],
		"mapped",
		[
			7939,
			953
		]
	],
	[
		[
			8076,
			8076
		],
		"mapped",
		[
			7940,
			953
		]
	],
	[
		[
			8077,
			8077
		],
		"mapped",
		[
			7941,
			953
		]
	],
	[
		[
			8078,
			8078
		],
		"mapped",
		[
			7942,
			953
		]
	],
	[
		[
			8079,
			8079
		],
		"mapped",
		[
			7943,
			953
		]
	],
	[
		[
			8080,
			8080
		],
		"mapped",
		[
			7968,
			953
		]
	],
	[
		[
			8081,
			8081
		],
		"mapped",
		[
			7969,
			953
		]
	],
	[
		[
			8082,
			8082
		],
		"mapped",
		[
			7970,
			953
		]
	],
	[
		[
			8083,
			8083
		],
		"mapped",
		[
			7971,
			953
		]
	],
	[
		[
			8084,
			8084
		],
		"mapped",
		[
			7972,
			953
		]
	],
	[
		[
			8085,
			8085
		],
		"mapped",
		[
			7973,
			953
		]
	],
	[
		[
			8086,
			8086
		],
		"mapped",
		[
			7974,
			953
		]
	],
	[
		[
			8087,
			8087
		],
		"mapped",
		[
			7975,
			953
		]
	],
	[
		[
			8088,
			8088
		],
		"mapped",
		[
			7968,
			953
		]
	],
	[
		[
			8089,
			8089
		],
		"mapped",
		[
			7969,
			953
		]
	],
	[
		[
			8090,
			8090
		],
		"mapped",
		[
			7970,
			953
		]
	],
	[
		[
			8091,
			8091
		],
		"mapped",
		[
			7971,
			953
		]
	],
	[
		[
			8092,
			8092
		],
		"mapped",
		[
			7972,
			953
		]
	],
	[
		[
			8093,
			8093
		],
		"mapped",
		[
			7973,
			953
		]
	],
	[
		[
			8094,
			8094
		],
		"mapped",
		[
			7974,
			953
		]
	],
	[
		[
			8095,
			8095
		],
		"mapped",
		[
			7975,
			953
		]
	],
	[
		[
			8096,
			8096
		],
		"mapped",
		[
			8032,
			953
		]
	],
	[
		[
			8097,
			8097
		],
		"mapped",
		[
			8033,
			953
		]
	],
	[
		[
			8098,
			8098
		],
		"mapped",
		[
			8034,
			953
		]
	],
	[
		[
			8099,
			8099
		],
		"mapped",
		[
			8035,
			953
		]
	],
	[
		[
			8100,
			8100
		],
		"mapped",
		[
			8036,
			953
		]
	],
	[
		[
			8101,
			8101
		],
		"mapped",
		[
			8037,
			953
		]
	],
	[
		[
			8102,
			8102
		],
		"mapped",
		[
			8038,
			953
		]
	],
	[
		[
			8103,
			8103
		],
		"mapped",
		[
			8039,
			953
		]
	],
	[
		[
			8104,
			8104
		],
		"mapped",
		[
			8032,
			953
		]
	],
	[
		[
			8105,
			8105
		],
		"mapped",
		[
			8033,
			953
		]
	],
	[
		[
			8106,
			8106
		],
		"mapped",
		[
			8034,
			953
		]
	],
	[
		[
			8107,
			8107
		],
		"mapped",
		[
			8035,
			953
		]
	],
	[
		[
			8108,
			8108
		],
		"mapped",
		[
			8036,
			953
		]
	],
	[
		[
			8109,
			8109
		],
		"mapped",
		[
			8037,
			953
		]
	],
	[
		[
			8110,
			8110
		],
		"mapped",
		[
			8038,
			953
		]
	],
	[
		[
			8111,
			8111
		],
		"mapped",
		[
			8039,
			953
		]
	],
	[
		[
			8112,
			8113
		],
		"valid"
	],
	[
		[
			8114,
			8114
		],
		"mapped",
		[
			8048,
			953
		]
	],
	[
		[
			8115,
			8115
		],
		"mapped",
		[
			945,
			953
		]
	],
	[
		[
			8116,
			8116
		],
		"mapped",
		[
			940,
			953
		]
	],
	[
		[
			8117,
			8117
		],
		"disallowed"
	],
	[
		[
			8118,
			8118
		],
		"valid"
	],
	[
		[
			8119,
			8119
		],
		"mapped",
		[
			8118,
			953
		]
	],
	[
		[
			8120,
			8120
		],
		"mapped",
		[
			8112
		]
	],
	[
		[
			8121,
			8121
		],
		"mapped",
		[
			8113
		]
	],
	[
		[
			8122,
			8122
		],
		"mapped",
		[
			8048
		]
	],
	[
		[
			8123,
			8123
		],
		"mapped",
		[
			940
		]
	],
	[
		[
			8124,
			8124
		],
		"mapped",
		[
			945,
			953
		]
	],
	[
		[
			8125,
			8125
		],
		"disallowed_STD3_mapped",
		[
			32,
			787
		]
	],
	[
		[
			8126,
			8126
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			8127,
			8127
		],
		"disallowed_STD3_mapped",
		[
			32,
			787
		]
	],
	[
		[
			8128,
			8128
		],
		"disallowed_STD3_mapped",
		[
			32,
			834
		]
	],
	[
		[
			8129,
			8129
		],
		"disallowed_STD3_mapped",
		[
			32,
			776,
			834
		]
	],
	[
		[
			8130,
			8130
		],
		"mapped",
		[
			8052,
			953
		]
	],
	[
		[
			8131,
			8131
		],
		"mapped",
		[
			951,
			953
		]
	],
	[
		[
			8132,
			8132
		],
		"mapped",
		[
			942,
			953
		]
	],
	[
		[
			8133,
			8133
		],
		"disallowed"
	],
	[
		[
			8134,
			8134
		],
		"valid"
	],
	[
		[
			8135,
			8135
		],
		"mapped",
		[
			8134,
			953
		]
	],
	[
		[
			8136,
			8136
		],
		"mapped",
		[
			8050
		]
	],
	[
		[
			8137,
			8137
		],
		"mapped",
		[
			941
		]
	],
	[
		[
			8138,
			8138
		],
		"mapped",
		[
			8052
		]
	],
	[
		[
			8139,
			8139
		],
		"mapped",
		[
			942
		]
	],
	[
		[
			8140,
			8140
		],
		"mapped",
		[
			951,
			953
		]
	],
	[
		[
			8141,
			8141
		],
		"disallowed_STD3_mapped",
		[
			32,
			787,
			768
		]
	],
	[
		[
			8142,
			8142
		],
		"disallowed_STD3_mapped",
		[
			32,
			787,
			769
		]
	],
	[
		[
			8143,
			8143
		],
		"disallowed_STD3_mapped",
		[
			32,
			787,
			834
		]
	],
	[
		[
			8144,
			8146
		],
		"valid"
	],
	[
		[
			8147,
			8147
		],
		"mapped",
		[
			912
		]
	],
	[
		[
			8148,
			8149
		],
		"disallowed"
	],
	[
		[
			8150,
			8151
		],
		"valid"
	],
	[
		[
			8152,
			8152
		],
		"mapped",
		[
			8144
		]
	],
	[
		[
			8153,
			8153
		],
		"mapped",
		[
			8145
		]
	],
	[
		[
			8154,
			8154
		],
		"mapped",
		[
			8054
		]
	],
	[
		[
			8155,
			8155
		],
		"mapped",
		[
			943
		]
	],
	[
		[
			8156,
			8156
		],
		"disallowed"
	],
	[
		[
			8157,
			8157
		],
		"disallowed_STD3_mapped",
		[
			32,
			788,
			768
		]
	],
	[
		[
			8158,
			8158
		],
		"disallowed_STD3_mapped",
		[
			32,
			788,
			769
		]
	],
	[
		[
			8159,
			8159
		],
		"disallowed_STD3_mapped",
		[
			32,
			788,
			834
		]
	],
	[
		[
			8160,
			8162
		],
		"valid"
	],
	[
		[
			8163,
			8163
		],
		"mapped",
		[
			944
		]
	],
	[
		[
			8164,
			8167
		],
		"valid"
	],
	[
		[
			8168,
			8168
		],
		"mapped",
		[
			8160
		]
	],
	[
		[
			8169,
			8169
		],
		"mapped",
		[
			8161
		]
	],
	[
		[
			8170,
			8170
		],
		"mapped",
		[
			8058
		]
	],
	[
		[
			8171,
			8171
		],
		"mapped",
		[
			973
		]
	],
	[
		[
			8172,
			8172
		],
		"mapped",
		[
			8165
		]
	],
	[
		[
			8173,
			8173
		],
		"disallowed_STD3_mapped",
		[
			32,
			776,
			768
		]
	],
	[
		[
			8174,
			8174
		],
		"disallowed_STD3_mapped",
		[
			32,
			776,
			769
		]
	],
	[
		[
			8175,
			8175
		],
		"disallowed_STD3_mapped",
		[
			96
		]
	],
	[
		[
			8176,
			8177
		],
		"disallowed"
	],
	[
		[
			8178,
			8178
		],
		"mapped",
		[
			8060,
			953
		]
	],
	[
		[
			8179,
			8179
		],
		"mapped",
		[
			969,
			953
		]
	],
	[
		[
			8180,
			8180
		],
		"mapped",
		[
			974,
			953
		]
	],
	[
		[
			8181,
			8181
		],
		"disallowed"
	],
	[
		[
			8182,
			8182
		],
		"valid"
	],
	[
		[
			8183,
			8183
		],
		"mapped",
		[
			8182,
			953
		]
	],
	[
		[
			8184,
			8184
		],
		"mapped",
		[
			8056
		]
	],
	[
		[
			8185,
			8185
		],
		"mapped",
		[
			972
		]
	],
	[
		[
			8186,
			8186
		],
		"mapped",
		[
			8060
		]
	],
	[
		[
			8187,
			8187
		],
		"mapped",
		[
			974
		]
	],
	[
		[
			8188,
			8188
		],
		"mapped",
		[
			969,
			953
		]
	],
	[
		[
			8189,
			8189
		],
		"disallowed_STD3_mapped",
		[
			32,
			769
		]
	],
	[
		[
			8190,
			8190
		],
		"disallowed_STD3_mapped",
		[
			32,
			788
		]
	],
	[
		[
			8191,
			8191
		],
		"disallowed"
	],
	[
		[
			8192,
			8202
		],
		"disallowed_STD3_mapped",
		[
			32
		]
	],
	[
		[
			8203,
			8203
		],
		"ignored"
	],
	[
		[
			8204,
			8205
		],
		"deviation",
		[
		]
	],
	[
		[
			8206,
			8207
		],
		"disallowed"
	],
	[
		[
			8208,
			8208
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8209,
			8209
		],
		"mapped",
		[
			8208
		]
	],
	[
		[
			8210,
			8214
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8215,
			8215
		],
		"disallowed_STD3_mapped",
		[
			32,
			819
		]
	],
	[
		[
			8216,
			8227
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8228,
			8230
		],
		"disallowed"
	],
	[
		[
			8231,
			8231
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8232,
			8238
		],
		"disallowed"
	],
	[
		[
			8239,
			8239
		],
		"disallowed_STD3_mapped",
		[
			32
		]
	],
	[
		[
			8240,
			8242
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8243,
			8243
		],
		"mapped",
		[
			8242,
			8242
		]
	],
	[
		[
			8244,
			8244
		],
		"mapped",
		[
			8242,
			8242,
			8242
		]
	],
	[
		[
			8245,
			8245
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8246,
			8246
		],
		"mapped",
		[
			8245,
			8245
		]
	],
	[
		[
			8247,
			8247
		],
		"mapped",
		[
			8245,
			8245,
			8245
		]
	],
	[
		[
			8248,
			8251
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8252,
			8252
		],
		"disallowed_STD3_mapped",
		[
			33,
			33
		]
	],
	[
		[
			8253,
			8253
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8254,
			8254
		],
		"disallowed_STD3_mapped",
		[
			32,
			773
		]
	],
	[
		[
			8255,
			8262
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8263,
			8263
		],
		"disallowed_STD3_mapped",
		[
			63,
			63
		]
	],
	[
		[
			8264,
			8264
		],
		"disallowed_STD3_mapped",
		[
			63,
			33
		]
	],
	[
		[
			8265,
			8265
		],
		"disallowed_STD3_mapped",
		[
			33,
			63
		]
	],
	[
		[
			8266,
			8269
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8270,
			8274
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8275,
			8276
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8277,
			8278
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8279,
			8279
		],
		"mapped",
		[
			8242,
			8242,
			8242,
			8242
		]
	],
	[
		[
			8280,
			8286
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8287,
			8287
		],
		"disallowed_STD3_mapped",
		[
			32
		]
	],
	[
		[
			8288,
			8288
		],
		"ignored"
	],
	[
		[
			8289,
			8291
		],
		"disallowed"
	],
	[
		[
			8292,
			8292
		],
		"ignored"
	],
	[
		[
			8293,
			8293
		],
		"disallowed"
	],
	[
		[
			8294,
			8297
		],
		"disallowed"
	],
	[
		[
			8298,
			8303
		],
		"disallowed"
	],
	[
		[
			8304,
			8304
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			8305,
			8305
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8306,
			8307
		],
		"disallowed"
	],
	[
		[
			8308,
			8308
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			8309,
			8309
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			8310,
			8310
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			8311,
			8311
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			8312,
			8312
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			8313,
			8313
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			8314,
			8314
		],
		"disallowed_STD3_mapped",
		[
			43
		]
	],
	[
		[
			8315,
			8315
		],
		"mapped",
		[
			8722
		]
	],
	[
		[
			8316,
			8316
		],
		"disallowed_STD3_mapped",
		[
			61
		]
	],
	[
		[
			8317,
			8317
		],
		"disallowed_STD3_mapped",
		[
			40
		]
	],
	[
		[
			8318,
			8318
		],
		"disallowed_STD3_mapped",
		[
			41
		]
	],
	[
		[
			8319,
			8319
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			8320,
			8320
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			8321,
			8321
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			8322,
			8322
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			8323,
			8323
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			8324,
			8324
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			8325,
			8325
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			8326,
			8326
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			8327,
			8327
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			8328,
			8328
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			8329,
			8329
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			8330,
			8330
		],
		"disallowed_STD3_mapped",
		[
			43
		]
	],
	[
		[
			8331,
			8331
		],
		"mapped",
		[
			8722
		]
	],
	[
		[
			8332,
			8332
		],
		"disallowed_STD3_mapped",
		[
			61
		]
	],
	[
		[
			8333,
			8333
		],
		"disallowed_STD3_mapped",
		[
			40
		]
	],
	[
		[
			8334,
			8334
		],
		"disallowed_STD3_mapped",
		[
			41
		]
	],
	[
		[
			8335,
			8335
		],
		"disallowed"
	],
	[
		[
			8336,
			8336
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			8337,
			8337
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			8338,
			8338
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			8339,
			8339
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			8340,
			8340
		],
		"mapped",
		[
			601
		]
	],
	[
		[
			8341,
			8341
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			8342,
			8342
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			8343,
			8343
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			8344,
			8344
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			8345,
			8345
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			8346,
			8346
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			8347,
			8347
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			8348,
			8348
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			8349,
			8351
		],
		"disallowed"
	],
	[
		[
			8352,
			8359
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8360,
			8360
		],
		"mapped",
		[
			114,
			115
		]
	],
	[
		[
			8361,
			8362
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8363,
			8363
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8364,
			8364
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8365,
			8367
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8368,
			8369
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8370,
			8373
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8374,
			8376
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8377,
			8377
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8378,
			8378
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8379,
			8381
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8382,
			8382
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8383,
			8399
		],
		"disallowed"
	],
	[
		[
			8400,
			8417
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8418,
			8419
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8420,
			8426
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8427,
			8427
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8428,
			8431
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8432,
			8432
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8433,
			8447
		],
		"disallowed"
	],
	[
		[
			8448,
			8448
		],
		"disallowed_STD3_mapped",
		[
			97,
			47,
			99
		]
	],
	[
		[
			8449,
			8449
		],
		"disallowed_STD3_mapped",
		[
			97,
			47,
			115
		]
	],
	[
		[
			8450,
			8450
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			8451,
			8451
		],
		"mapped",
		[
			176,
			99
		]
	],
	[
		[
			8452,
			8452
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8453,
			8453
		],
		"disallowed_STD3_mapped",
		[
			99,
			47,
			111
		]
	],
	[
		[
			8454,
			8454
		],
		"disallowed_STD3_mapped",
		[
			99,
			47,
			117
		]
	],
	[
		[
			8455,
			8455
		],
		"mapped",
		[
			603
		]
	],
	[
		[
			8456,
			8456
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8457,
			8457
		],
		"mapped",
		[
			176,
			102
		]
	],
	[
		[
			8458,
			8458
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			8459,
			8462
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			8463,
			8463
		],
		"mapped",
		[
			295
		]
	],
	[
		[
			8464,
			8465
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8466,
			8467
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			8468,
			8468
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8469,
			8469
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			8470,
			8470
		],
		"mapped",
		[
			110,
			111
		]
	],
	[
		[
			8471,
			8472
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8473,
			8473
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			8474,
			8474
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			8475,
			8477
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			8478,
			8479
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8480,
			8480
		],
		"mapped",
		[
			115,
			109
		]
	],
	[
		[
			8481,
			8481
		],
		"mapped",
		[
			116,
			101,
			108
		]
	],
	[
		[
			8482,
			8482
		],
		"mapped",
		[
			116,
			109
		]
	],
	[
		[
			8483,
			8483
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8484,
			8484
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			8485,
			8485
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8486,
			8486
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			8487,
			8487
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8488,
			8488
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			8489,
			8489
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8490,
			8490
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			8491,
			8491
		],
		"mapped",
		[
			229
		]
	],
	[
		[
			8492,
			8492
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			8493,
			8493
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			8494,
			8494
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8495,
			8496
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			8497,
			8497
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			8498,
			8498
		],
		"disallowed"
	],
	[
		[
			8499,
			8499
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			8500,
			8500
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			8501,
			8501
		],
		"mapped",
		[
			1488
		]
	],
	[
		[
			8502,
			8502
		],
		"mapped",
		[
			1489
		]
	],
	[
		[
			8503,
			8503
		],
		"mapped",
		[
			1490
		]
	],
	[
		[
			8504,
			8504
		],
		"mapped",
		[
			1491
		]
	],
	[
		[
			8505,
			8505
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8506,
			8506
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8507,
			8507
		],
		"mapped",
		[
			102,
			97,
			120
		]
	],
	[
		[
			8508,
			8508
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			8509,
			8510
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			8511,
			8511
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			8512,
			8512
		],
		"mapped",
		[
			8721
		]
	],
	[
		[
			8513,
			8516
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8517,
			8518
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			8519,
			8519
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			8520,
			8520
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8521,
			8521
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			8522,
			8523
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8524,
			8524
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8525,
			8525
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8526,
			8526
		],
		"valid"
	],
	[
		[
			8527,
			8527
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8528,
			8528
		],
		"mapped",
		[
			49,
			8260,
			55
		]
	],
	[
		[
			8529,
			8529
		],
		"mapped",
		[
			49,
			8260,
			57
		]
	],
	[
		[
			8530,
			8530
		],
		"mapped",
		[
			49,
			8260,
			49,
			48
		]
	],
	[
		[
			8531,
			8531
		],
		"mapped",
		[
			49,
			8260,
			51
		]
	],
	[
		[
			8532,
			8532
		],
		"mapped",
		[
			50,
			8260,
			51
		]
	],
	[
		[
			8533,
			8533
		],
		"mapped",
		[
			49,
			8260,
			53
		]
	],
	[
		[
			8534,
			8534
		],
		"mapped",
		[
			50,
			8260,
			53
		]
	],
	[
		[
			8535,
			8535
		],
		"mapped",
		[
			51,
			8260,
			53
		]
	],
	[
		[
			8536,
			8536
		],
		"mapped",
		[
			52,
			8260,
			53
		]
	],
	[
		[
			8537,
			8537
		],
		"mapped",
		[
			49,
			8260,
			54
		]
	],
	[
		[
			8538,
			8538
		],
		"mapped",
		[
			53,
			8260,
			54
		]
	],
	[
		[
			8539,
			8539
		],
		"mapped",
		[
			49,
			8260,
			56
		]
	],
	[
		[
			8540,
			8540
		],
		"mapped",
		[
			51,
			8260,
			56
		]
	],
	[
		[
			8541,
			8541
		],
		"mapped",
		[
			53,
			8260,
			56
		]
	],
	[
		[
			8542,
			8542
		],
		"mapped",
		[
			55,
			8260,
			56
		]
	],
	[
		[
			8543,
			8543
		],
		"mapped",
		[
			49,
			8260
		]
	],
	[
		[
			8544,
			8544
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8545,
			8545
		],
		"mapped",
		[
			105,
			105
		]
	],
	[
		[
			8546,
			8546
		],
		"mapped",
		[
			105,
			105,
			105
		]
	],
	[
		[
			8547,
			8547
		],
		"mapped",
		[
			105,
			118
		]
	],
	[
		[
			8548,
			8548
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			8549,
			8549
		],
		"mapped",
		[
			118,
			105
		]
	],
	[
		[
			8550,
			8550
		],
		"mapped",
		[
			118,
			105,
			105
		]
	],
	[
		[
			8551,
			8551
		],
		"mapped",
		[
			118,
			105,
			105,
			105
		]
	],
	[
		[
			8552,
			8552
		],
		"mapped",
		[
			105,
			120
		]
	],
	[
		[
			8553,
			8553
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			8554,
			8554
		],
		"mapped",
		[
			120,
			105
		]
	],
	[
		[
			8555,
			8555
		],
		"mapped",
		[
			120,
			105,
			105
		]
	],
	[
		[
			8556,
			8556
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			8557,
			8557
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			8558,
			8558
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			8559,
			8559
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			8560,
			8560
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			8561,
			8561
		],
		"mapped",
		[
			105,
			105
		]
	],
	[
		[
			8562,
			8562
		],
		"mapped",
		[
			105,
			105,
			105
		]
	],
	[
		[
			8563,
			8563
		],
		"mapped",
		[
			105,
			118
		]
	],
	[
		[
			8564,
			8564
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			8565,
			8565
		],
		"mapped",
		[
			118,
			105
		]
	],
	[
		[
			8566,
			8566
		],
		"mapped",
		[
			118,
			105,
			105
		]
	],
	[
		[
			8567,
			8567
		],
		"mapped",
		[
			118,
			105,
			105,
			105
		]
	],
	[
		[
			8568,
			8568
		],
		"mapped",
		[
			105,
			120
		]
	],
	[
		[
			8569,
			8569
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			8570,
			8570
		],
		"mapped",
		[
			120,
			105
		]
	],
	[
		[
			8571,
			8571
		],
		"mapped",
		[
			120,
			105,
			105
		]
	],
	[
		[
			8572,
			8572
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			8573,
			8573
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			8574,
			8574
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			8575,
			8575
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			8576,
			8578
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8579,
			8579
		],
		"disallowed"
	],
	[
		[
			8580,
			8580
		],
		"valid"
	],
	[
		[
			8581,
			8584
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8585,
			8585
		],
		"mapped",
		[
			48,
			8260,
			51
		]
	],
	[
		[
			8586,
			8587
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8588,
			8591
		],
		"disallowed"
	],
	[
		[
			8592,
			8682
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8683,
			8691
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8692,
			8703
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8704,
			8747
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8748,
			8748
		],
		"mapped",
		[
			8747,
			8747
		]
	],
	[
		[
			8749,
			8749
		],
		"mapped",
		[
			8747,
			8747,
			8747
		]
	],
	[
		[
			8750,
			8750
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8751,
			8751
		],
		"mapped",
		[
			8750,
			8750
		]
	],
	[
		[
			8752,
			8752
		],
		"mapped",
		[
			8750,
			8750,
			8750
		]
	],
	[
		[
			8753,
			8799
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8800,
			8800
		],
		"disallowed_STD3_valid"
	],
	[
		[
			8801,
			8813
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8814,
			8815
		],
		"disallowed_STD3_valid"
	],
	[
		[
			8816,
			8945
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8946,
			8959
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8960,
			8960
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8961,
			8961
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			8962,
			9000
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9001,
			9001
		],
		"mapped",
		[
			12296
		]
	],
	[
		[
			9002,
			9002
		],
		"mapped",
		[
			12297
		]
	],
	[
		[
			9003,
			9082
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9083,
			9083
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9084,
			9084
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9085,
			9114
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9115,
			9166
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9167,
			9168
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9169,
			9179
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9180,
			9191
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9192,
			9192
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9193,
			9203
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9204,
			9210
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9211,
			9215
		],
		"disallowed"
	],
	[
		[
			9216,
			9252
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9253,
			9254
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9255,
			9279
		],
		"disallowed"
	],
	[
		[
			9280,
			9290
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9291,
			9311
		],
		"disallowed"
	],
	[
		[
			9312,
			9312
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			9313,
			9313
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			9314,
			9314
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			9315,
			9315
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			9316,
			9316
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			9317,
			9317
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			9318,
			9318
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			9319,
			9319
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			9320,
			9320
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			9321,
			9321
		],
		"mapped",
		[
			49,
			48
		]
	],
	[
		[
			9322,
			9322
		],
		"mapped",
		[
			49,
			49
		]
	],
	[
		[
			9323,
			9323
		],
		"mapped",
		[
			49,
			50
		]
	],
	[
		[
			9324,
			9324
		],
		"mapped",
		[
			49,
			51
		]
	],
	[
		[
			9325,
			9325
		],
		"mapped",
		[
			49,
			52
		]
	],
	[
		[
			9326,
			9326
		],
		"mapped",
		[
			49,
			53
		]
	],
	[
		[
			9327,
			9327
		],
		"mapped",
		[
			49,
			54
		]
	],
	[
		[
			9328,
			9328
		],
		"mapped",
		[
			49,
			55
		]
	],
	[
		[
			9329,
			9329
		],
		"mapped",
		[
			49,
			56
		]
	],
	[
		[
			9330,
			9330
		],
		"mapped",
		[
			49,
			57
		]
	],
	[
		[
			9331,
			9331
		],
		"mapped",
		[
			50,
			48
		]
	],
	[
		[
			9332,
			9332
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			41
		]
	],
	[
		[
			9333,
			9333
		],
		"disallowed_STD3_mapped",
		[
			40,
			50,
			41
		]
	],
	[
		[
			9334,
			9334
		],
		"disallowed_STD3_mapped",
		[
			40,
			51,
			41
		]
	],
	[
		[
			9335,
			9335
		],
		"disallowed_STD3_mapped",
		[
			40,
			52,
			41
		]
	],
	[
		[
			9336,
			9336
		],
		"disallowed_STD3_mapped",
		[
			40,
			53,
			41
		]
	],
	[
		[
			9337,
			9337
		],
		"disallowed_STD3_mapped",
		[
			40,
			54,
			41
		]
	],
	[
		[
			9338,
			9338
		],
		"disallowed_STD3_mapped",
		[
			40,
			55,
			41
		]
	],
	[
		[
			9339,
			9339
		],
		"disallowed_STD3_mapped",
		[
			40,
			56,
			41
		]
	],
	[
		[
			9340,
			9340
		],
		"disallowed_STD3_mapped",
		[
			40,
			57,
			41
		]
	],
	[
		[
			9341,
			9341
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			48,
			41
		]
	],
	[
		[
			9342,
			9342
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			49,
			41
		]
	],
	[
		[
			9343,
			9343
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			50,
			41
		]
	],
	[
		[
			9344,
			9344
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			51,
			41
		]
	],
	[
		[
			9345,
			9345
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			52,
			41
		]
	],
	[
		[
			9346,
			9346
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			53,
			41
		]
	],
	[
		[
			9347,
			9347
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			54,
			41
		]
	],
	[
		[
			9348,
			9348
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			55,
			41
		]
	],
	[
		[
			9349,
			9349
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			56,
			41
		]
	],
	[
		[
			9350,
			9350
		],
		"disallowed_STD3_mapped",
		[
			40,
			49,
			57,
			41
		]
	],
	[
		[
			9351,
			9351
		],
		"disallowed_STD3_mapped",
		[
			40,
			50,
			48,
			41
		]
	],
	[
		[
			9352,
			9371
		],
		"disallowed"
	],
	[
		[
			9372,
			9372
		],
		"disallowed_STD3_mapped",
		[
			40,
			97,
			41
		]
	],
	[
		[
			9373,
			9373
		],
		"disallowed_STD3_mapped",
		[
			40,
			98,
			41
		]
	],
	[
		[
			9374,
			9374
		],
		"disallowed_STD3_mapped",
		[
			40,
			99,
			41
		]
	],
	[
		[
			9375,
			9375
		],
		"disallowed_STD3_mapped",
		[
			40,
			100,
			41
		]
	],
	[
		[
			9376,
			9376
		],
		"disallowed_STD3_mapped",
		[
			40,
			101,
			41
		]
	],
	[
		[
			9377,
			9377
		],
		"disallowed_STD3_mapped",
		[
			40,
			102,
			41
		]
	],
	[
		[
			9378,
			9378
		],
		"disallowed_STD3_mapped",
		[
			40,
			103,
			41
		]
	],
	[
		[
			9379,
			9379
		],
		"disallowed_STD3_mapped",
		[
			40,
			104,
			41
		]
	],
	[
		[
			9380,
			9380
		],
		"disallowed_STD3_mapped",
		[
			40,
			105,
			41
		]
	],
	[
		[
			9381,
			9381
		],
		"disallowed_STD3_mapped",
		[
			40,
			106,
			41
		]
	],
	[
		[
			9382,
			9382
		],
		"disallowed_STD3_mapped",
		[
			40,
			107,
			41
		]
	],
	[
		[
			9383,
			9383
		],
		"disallowed_STD3_mapped",
		[
			40,
			108,
			41
		]
	],
	[
		[
			9384,
			9384
		],
		"disallowed_STD3_mapped",
		[
			40,
			109,
			41
		]
	],
	[
		[
			9385,
			9385
		],
		"disallowed_STD3_mapped",
		[
			40,
			110,
			41
		]
	],
	[
		[
			9386,
			9386
		],
		"disallowed_STD3_mapped",
		[
			40,
			111,
			41
		]
	],
	[
		[
			9387,
			9387
		],
		"disallowed_STD3_mapped",
		[
			40,
			112,
			41
		]
	],
	[
		[
			9388,
			9388
		],
		"disallowed_STD3_mapped",
		[
			40,
			113,
			41
		]
	],
	[
		[
			9389,
			9389
		],
		"disallowed_STD3_mapped",
		[
			40,
			114,
			41
		]
	],
	[
		[
			9390,
			9390
		],
		"disallowed_STD3_mapped",
		[
			40,
			115,
			41
		]
	],
	[
		[
			9391,
			9391
		],
		"disallowed_STD3_mapped",
		[
			40,
			116,
			41
		]
	],
	[
		[
			9392,
			9392
		],
		"disallowed_STD3_mapped",
		[
			40,
			117,
			41
		]
	],
	[
		[
			9393,
			9393
		],
		"disallowed_STD3_mapped",
		[
			40,
			118,
			41
		]
	],
	[
		[
			9394,
			9394
		],
		"disallowed_STD3_mapped",
		[
			40,
			119,
			41
		]
	],
	[
		[
			9395,
			9395
		],
		"disallowed_STD3_mapped",
		[
			40,
			120,
			41
		]
	],
	[
		[
			9396,
			9396
		],
		"disallowed_STD3_mapped",
		[
			40,
			121,
			41
		]
	],
	[
		[
			9397,
			9397
		],
		"disallowed_STD3_mapped",
		[
			40,
			122,
			41
		]
	],
	[
		[
			9398,
			9398
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			9399,
			9399
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			9400,
			9400
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			9401,
			9401
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			9402,
			9402
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			9403,
			9403
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			9404,
			9404
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			9405,
			9405
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			9406,
			9406
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			9407,
			9407
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			9408,
			9408
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			9409,
			9409
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			9410,
			9410
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			9411,
			9411
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			9412,
			9412
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			9413,
			9413
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			9414,
			9414
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			9415,
			9415
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			9416,
			9416
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			9417,
			9417
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			9418,
			9418
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			9419,
			9419
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			9420,
			9420
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			9421,
			9421
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			9422,
			9422
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			9423,
			9423
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			9424,
			9424
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			9425,
			9425
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			9426,
			9426
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			9427,
			9427
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			9428,
			9428
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			9429,
			9429
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			9430,
			9430
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			9431,
			9431
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			9432,
			9432
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			9433,
			9433
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			9434,
			9434
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			9435,
			9435
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			9436,
			9436
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			9437,
			9437
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			9438,
			9438
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			9439,
			9439
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			9440,
			9440
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			9441,
			9441
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			9442,
			9442
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			9443,
			9443
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			9444,
			9444
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			9445,
			9445
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			9446,
			9446
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			9447,
			9447
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			9448,
			9448
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			9449,
			9449
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			9450,
			9450
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			9451,
			9470
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9471,
			9471
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9472,
			9621
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9622,
			9631
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9632,
			9711
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9712,
			9719
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9720,
			9727
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9728,
			9747
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9748,
			9749
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9750,
			9751
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9752,
			9752
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9753,
			9753
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9754,
			9839
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9840,
			9841
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9842,
			9853
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9854,
			9855
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9856,
			9865
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9866,
			9873
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9874,
			9884
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9885,
			9885
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9886,
			9887
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9888,
			9889
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9890,
			9905
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9906,
			9906
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9907,
			9916
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9917,
			9919
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9920,
			9923
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9924,
			9933
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9934,
			9934
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9935,
			9953
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9954,
			9954
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9955,
			9955
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9956,
			9959
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9960,
			9983
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9984,
			9984
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9985,
			9988
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9989,
			9989
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9990,
			9993
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9994,
			9995
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			9996,
			10023
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10024,
			10024
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10025,
			10059
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10060,
			10060
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10061,
			10061
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10062,
			10062
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10063,
			10066
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10067,
			10069
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10070,
			10070
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10071,
			10071
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10072,
			10078
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10079,
			10080
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10081,
			10087
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10088,
			10101
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10102,
			10132
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10133,
			10135
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10136,
			10159
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10160,
			10160
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10161,
			10174
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10175,
			10175
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10176,
			10182
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10183,
			10186
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10187,
			10187
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10188,
			10188
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10189,
			10189
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10190,
			10191
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10192,
			10219
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10220,
			10223
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10224,
			10239
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10240,
			10495
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10496,
			10763
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10764,
			10764
		],
		"mapped",
		[
			8747,
			8747,
			8747,
			8747
		]
	],
	[
		[
			10765,
			10867
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10868,
			10868
		],
		"disallowed_STD3_mapped",
		[
			58,
			58,
			61
		]
	],
	[
		[
			10869,
			10869
		],
		"disallowed_STD3_mapped",
		[
			61,
			61
		]
	],
	[
		[
			10870,
			10870
		],
		"disallowed_STD3_mapped",
		[
			61,
			61,
			61
		]
	],
	[
		[
			10871,
			10971
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			10972,
			10972
		],
		"mapped",
		[
			10973,
			824
		]
	],
	[
		[
			10973,
			11007
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11008,
			11021
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11022,
			11027
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11028,
			11034
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11035,
			11039
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11040,
			11043
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11044,
			11084
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11085,
			11087
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11088,
			11092
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11093,
			11097
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11098,
			11123
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11124,
			11125
		],
		"disallowed"
	],
	[
		[
			11126,
			11157
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11158,
			11159
		],
		"disallowed"
	],
	[
		[
			11160,
			11193
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11194,
			11196
		],
		"disallowed"
	],
	[
		[
			11197,
			11208
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11209,
			11209
		],
		"disallowed"
	],
	[
		[
			11210,
			11217
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11218,
			11243
		],
		"disallowed"
	],
	[
		[
			11244,
			11247
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11248,
			11263
		],
		"disallowed"
	],
	[
		[
			11264,
			11264
		],
		"mapped",
		[
			11312
		]
	],
	[
		[
			11265,
			11265
		],
		"mapped",
		[
			11313
		]
	],
	[
		[
			11266,
			11266
		],
		"mapped",
		[
			11314
		]
	],
	[
		[
			11267,
			11267
		],
		"mapped",
		[
			11315
		]
	],
	[
		[
			11268,
			11268
		],
		"mapped",
		[
			11316
		]
	],
	[
		[
			11269,
			11269
		],
		"mapped",
		[
			11317
		]
	],
	[
		[
			11270,
			11270
		],
		"mapped",
		[
			11318
		]
	],
	[
		[
			11271,
			11271
		],
		"mapped",
		[
			11319
		]
	],
	[
		[
			11272,
			11272
		],
		"mapped",
		[
			11320
		]
	],
	[
		[
			11273,
			11273
		],
		"mapped",
		[
			11321
		]
	],
	[
		[
			11274,
			11274
		],
		"mapped",
		[
			11322
		]
	],
	[
		[
			11275,
			11275
		],
		"mapped",
		[
			11323
		]
	],
	[
		[
			11276,
			11276
		],
		"mapped",
		[
			11324
		]
	],
	[
		[
			11277,
			11277
		],
		"mapped",
		[
			11325
		]
	],
	[
		[
			11278,
			11278
		],
		"mapped",
		[
			11326
		]
	],
	[
		[
			11279,
			11279
		],
		"mapped",
		[
			11327
		]
	],
	[
		[
			11280,
			11280
		],
		"mapped",
		[
			11328
		]
	],
	[
		[
			11281,
			11281
		],
		"mapped",
		[
			11329
		]
	],
	[
		[
			11282,
			11282
		],
		"mapped",
		[
			11330
		]
	],
	[
		[
			11283,
			11283
		],
		"mapped",
		[
			11331
		]
	],
	[
		[
			11284,
			11284
		],
		"mapped",
		[
			11332
		]
	],
	[
		[
			11285,
			11285
		],
		"mapped",
		[
			11333
		]
	],
	[
		[
			11286,
			11286
		],
		"mapped",
		[
			11334
		]
	],
	[
		[
			11287,
			11287
		],
		"mapped",
		[
			11335
		]
	],
	[
		[
			11288,
			11288
		],
		"mapped",
		[
			11336
		]
	],
	[
		[
			11289,
			11289
		],
		"mapped",
		[
			11337
		]
	],
	[
		[
			11290,
			11290
		],
		"mapped",
		[
			11338
		]
	],
	[
		[
			11291,
			11291
		],
		"mapped",
		[
			11339
		]
	],
	[
		[
			11292,
			11292
		],
		"mapped",
		[
			11340
		]
	],
	[
		[
			11293,
			11293
		],
		"mapped",
		[
			11341
		]
	],
	[
		[
			11294,
			11294
		],
		"mapped",
		[
			11342
		]
	],
	[
		[
			11295,
			11295
		],
		"mapped",
		[
			11343
		]
	],
	[
		[
			11296,
			11296
		],
		"mapped",
		[
			11344
		]
	],
	[
		[
			11297,
			11297
		],
		"mapped",
		[
			11345
		]
	],
	[
		[
			11298,
			11298
		],
		"mapped",
		[
			11346
		]
	],
	[
		[
			11299,
			11299
		],
		"mapped",
		[
			11347
		]
	],
	[
		[
			11300,
			11300
		],
		"mapped",
		[
			11348
		]
	],
	[
		[
			11301,
			11301
		],
		"mapped",
		[
			11349
		]
	],
	[
		[
			11302,
			11302
		],
		"mapped",
		[
			11350
		]
	],
	[
		[
			11303,
			11303
		],
		"mapped",
		[
			11351
		]
	],
	[
		[
			11304,
			11304
		],
		"mapped",
		[
			11352
		]
	],
	[
		[
			11305,
			11305
		],
		"mapped",
		[
			11353
		]
	],
	[
		[
			11306,
			11306
		],
		"mapped",
		[
			11354
		]
	],
	[
		[
			11307,
			11307
		],
		"mapped",
		[
			11355
		]
	],
	[
		[
			11308,
			11308
		],
		"mapped",
		[
			11356
		]
	],
	[
		[
			11309,
			11309
		],
		"mapped",
		[
			11357
		]
	],
	[
		[
			11310,
			11310
		],
		"mapped",
		[
			11358
		]
	],
	[
		[
			11311,
			11311
		],
		"disallowed"
	],
	[
		[
			11312,
			11358
		],
		"valid"
	],
	[
		[
			11359,
			11359
		],
		"disallowed"
	],
	[
		[
			11360,
			11360
		],
		"mapped",
		[
			11361
		]
	],
	[
		[
			11361,
			11361
		],
		"valid"
	],
	[
		[
			11362,
			11362
		],
		"mapped",
		[
			619
		]
	],
	[
		[
			11363,
			11363
		],
		"mapped",
		[
			7549
		]
	],
	[
		[
			11364,
			11364
		],
		"mapped",
		[
			637
		]
	],
	[
		[
			11365,
			11366
		],
		"valid"
	],
	[
		[
			11367,
			11367
		],
		"mapped",
		[
			11368
		]
	],
	[
		[
			11368,
			11368
		],
		"valid"
	],
	[
		[
			11369,
			11369
		],
		"mapped",
		[
			11370
		]
	],
	[
		[
			11370,
			11370
		],
		"valid"
	],
	[
		[
			11371,
			11371
		],
		"mapped",
		[
			11372
		]
	],
	[
		[
			11372,
			11372
		],
		"valid"
	],
	[
		[
			11373,
			11373
		],
		"mapped",
		[
			593
		]
	],
	[
		[
			11374,
			11374
		],
		"mapped",
		[
			625
		]
	],
	[
		[
			11375,
			11375
		],
		"mapped",
		[
			592
		]
	],
	[
		[
			11376,
			11376
		],
		"mapped",
		[
			594
		]
	],
	[
		[
			11377,
			11377
		],
		"valid"
	],
	[
		[
			11378,
			11378
		],
		"mapped",
		[
			11379
		]
	],
	[
		[
			11379,
			11379
		],
		"valid"
	],
	[
		[
			11380,
			11380
		],
		"valid"
	],
	[
		[
			11381,
			11381
		],
		"mapped",
		[
			11382
		]
	],
	[
		[
			11382,
			11383
		],
		"valid"
	],
	[
		[
			11384,
			11387
		],
		"valid"
	],
	[
		[
			11388,
			11388
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			11389,
			11389
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			11390,
			11390
		],
		"mapped",
		[
			575
		]
	],
	[
		[
			11391,
			11391
		],
		"mapped",
		[
			576
		]
	],
	[
		[
			11392,
			11392
		],
		"mapped",
		[
			11393
		]
	],
	[
		[
			11393,
			11393
		],
		"valid"
	],
	[
		[
			11394,
			11394
		],
		"mapped",
		[
			11395
		]
	],
	[
		[
			11395,
			11395
		],
		"valid"
	],
	[
		[
			11396,
			11396
		],
		"mapped",
		[
			11397
		]
	],
	[
		[
			11397,
			11397
		],
		"valid"
	],
	[
		[
			11398,
			11398
		],
		"mapped",
		[
			11399
		]
	],
	[
		[
			11399,
			11399
		],
		"valid"
	],
	[
		[
			11400,
			11400
		],
		"mapped",
		[
			11401
		]
	],
	[
		[
			11401,
			11401
		],
		"valid"
	],
	[
		[
			11402,
			11402
		],
		"mapped",
		[
			11403
		]
	],
	[
		[
			11403,
			11403
		],
		"valid"
	],
	[
		[
			11404,
			11404
		],
		"mapped",
		[
			11405
		]
	],
	[
		[
			11405,
			11405
		],
		"valid"
	],
	[
		[
			11406,
			11406
		],
		"mapped",
		[
			11407
		]
	],
	[
		[
			11407,
			11407
		],
		"valid"
	],
	[
		[
			11408,
			11408
		],
		"mapped",
		[
			11409
		]
	],
	[
		[
			11409,
			11409
		],
		"valid"
	],
	[
		[
			11410,
			11410
		],
		"mapped",
		[
			11411
		]
	],
	[
		[
			11411,
			11411
		],
		"valid"
	],
	[
		[
			11412,
			11412
		],
		"mapped",
		[
			11413
		]
	],
	[
		[
			11413,
			11413
		],
		"valid"
	],
	[
		[
			11414,
			11414
		],
		"mapped",
		[
			11415
		]
	],
	[
		[
			11415,
			11415
		],
		"valid"
	],
	[
		[
			11416,
			11416
		],
		"mapped",
		[
			11417
		]
	],
	[
		[
			11417,
			11417
		],
		"valid"
	],
	[
		[
			11418,
			11418
		],
		"mapped",
		[
			11419
		]
	],
	[
		[
			11419,
			11419
		],
		"valid"
	],
	[
		[
			11420,
			11420
		],
		"mapped",
		[
			11421
		]
	],
	[
		[
			11421,
			11421
		],
		"valid"
	],
	[
		[
			11422,
			11422
		],
		"mapped",
		[
			11423
		]
	],
	[
		[
			11423,
			11423
		],
		"valid"
	],
	[
		[
			11424,
			11424
		],
		"mapped",
		[
			11425
		]
	],
	[
		[
			11425,
			11425
		],
		"valid"
	],
	[
		[
			11426,
			11426
		],
		"mapped",
		[
			11427
		]
	],
	[
		[
			11427,
			11427
		],
		"valid"
	],
	[
		[
			11428,
			11428
		],
		"mapped",
		[
			11429
		]
	],
	[
		[
			11429,
			11429
		],
		"valid"
	],
	[
		[
			11430,
			11430
		],
		"mapped",
		[
			11431
		]
	],
	[
		[
			11431,
			11431
		],
		"valid"
	],
	[
		[
			11432,
			11432
		],
		"mapped",
		[
			11433
		]
	],
	[
		[
			11433,
			11433
		],
		"valid"
	],
	[
		[
			11434,
			11434
		],
		"mapped",
		[
			11435
		]
	],
	[
		[
			11435,
			11435
		],
		"valid"
	],
	[
		[
			11436,
			11436
		],
		"mapped",
		[
			11437
		]
	],
	[
		[
			11437,
			11437
		],
		"valid"
	],
	[
		[
			11438,
			11438
		],
		"mapped",
		[
			11439
		]
	],
	[
		[
			11439,
			11439
		],
		"valid"
	],
	[
		[
			11440,
			11440
		],
		"mapped",
		[
			11441
		]
	],
	[
		[
			11441,
			11441
		],
		"valid"
	],
	[
		[
			11442,
			11442
		],
		"mapped",
		[
			11443
		]
	],
	[
		[
			11443,
			11443
		],
		"valid"
	],
	[
		[
			11444,
			11444
		],
		"mapped",
		[
			11445
		]
	],
	[
		[
			11445,
			11445
		],
		"valid"
	],
	[
		[
			11446,
			11446
		],
		"mapped",
		[
			11447
		]
	],
	[
		[
			11447,
			11447
		],
		"valid"
	],
	[
		[
			11448,
			11448
		],
		"mapped",
		[
			11449
		]
	],
	[
		[
			11449,
			11449
		],
		"valid"
	],
	[
		[
			11450,
			11450
		],
		"mapped",
		[
			11451
		]
	],
	[
		[
			11451,
			11451
		],
		"valid"
	],
	[
		[
			11452,
			11452
		],
		"mapped",
		[
			11453
		]
	],
	[
		[
			11453,
			11453
		],
		"valid"
	],
	[
		[
			11454,
			11454
		],
		"mapped",
		[
			11455
		]
	],
	[
		[
			11455,
			11455
		],
		"valid"
	],
	[
		[
			11456,
			11456
		],
		"mapped",
		[
			11457
		]
	],
	[
		[
			11457,
			11457
		],
		"valid"
	],
	[
		[
			11458,
			11458
		],
		"mapped",
		[
			11459
		]
	],
	[
		[
			11459,
			11459
		],
		"valid"
	],
	[
		[
			11460,
			11460
		],
		"mapped",
		[
			11461
		]
	],
	[
		[
			11461,
			11461
		],
		"valid"
	],
	[
		[
			11462,
			11462
		],
		"mapped",
		[
			11463
		]
	],
	[
		[
			11463,
			11463
		],
		"valid"
	],
	[
		[
			11464,
			11464
		],
		"mapped",
		[
			11465
		]
	],
	[
		[
			11465,
			11465
		],
		"valid"
	],
	[
		[
			11466,
			11466
		],
		"mapped",
		[
			11467
		]
	],
	[
		[
			11467,
			11467
		],
		"valid"
	],
	[
		[
			11468,
			11468
		],
		"mapped",
		[
			11469
		]
	],
	[
		[
			11469,
			11469
		],
		"valid"
	],
	[
		[
			11470,
			11470
		],
		"mapped",
		[
			11471
		]
	],
	[
		[
			11471,
			11471
		],
		"valid"
	],
	[
		[
			11472,
			11472
		],
		"mapped",
		[
			11473
		]
	],
	[
		[
			11473,
			11473
		],
		"valid"
	],
	[
		[
			11474,
			11474
		],
		"mapped",
		[
			11475
		]
	],
	[
		[
			11475,
			11475
		],
		"valid"
	],
	[
		[
			11476,
			11476
		],
		"mapped",
		[
			11477
		]
	],
	[
		[
			11477,
			11477
		],
		"valid"
	],
	[
		[
			11478,
			11478
		],
		"mapped",
		[
			11479
		]
	],
	[
		[
			11479,
			11479
		],
		"valid"
	],
	[
		[
			11480,
			11480
		],
		"mapped",
		[
			11481
		]
	],
	[
		[
			11481,
			11481
		],
		"valid"
	],
	[
		[
			11482,
			11482
		],
		"mapped",
		[
			11483
		]
	],
	[
		[
			11483,
			11483
		],
		"valid"
	],
	[
		[
			11484,
			11484
		],
		"mapped",
		[
			11485
		]
	],
	[
		[
			11485,
			11485
		],
		"valid"
	],
	[
		[
			11486,
			11486
		],
		"mapped",
		[
			11487
		]
	],
	[
		[
			11487,
			11487
		],
		"valid"
	],
	[
		[
			11488,
			11488
		],
		"mapped",
		[
			11489
		]
	],
	[
		[
			11489,
			11489
		],
		"valid"
	],
	[
		[
			11490,
			11490
		],
		"mapped",
		[
			11491
		]
	],
	[
		[
			11491,
			11492
		],
		"valid"
	],
	[
		[
			11493,
			11498
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11499,
			11499
		],
		"mapped",
		[
			11500
		]
	],
	[
		[
			11500,
			11500
		],
		"valid"
	],
	[
		[
			11501,
			11501
		],
		"mapped",
		[
			11502
		]
	],
	[
		[
			11502,
			11505
		],
		"valid"
	],
	[
		[
			11506,
			11506
		],
		"mapped",
		[
			11507
		]
	],
	[
		[
			11507,
			11507
		],
		"valid"
	],
	[
		[
			11508,
			11512
		],
		"disallowed"
	],
	[
		[
			11513,
			11519
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11520,
			11557
		],
		"valid"
	],
	[
		[
			11558,
			11558
		],
		"disallowed"
	],
	[
		[
			11559,
			11559
		],
		"valid"
	],
	[
		[
			11560,
			11564
		],
		"disallowed"
	],
	[
		[
			11565,
			11565
		],
		"valid"
	],
	[
		[
			11566,
			11567
		],
		"disallowed"
	],
	[
		[
			11568,
			11621
		],
		"valid"
	],
	[
		[
			11622,
			11623
		],
		"valid"
	],
	[
		[
			11624,
			11630
		],
		"disallowed"
	],
	[
		[
			11631,
			11631
		],
		"mapped",
		[
			11617
		]
	],
	[
		[
			11632,
			11632
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11633,
			11646
		],
		"disallowed"
	],
	[
		[
			11647,
			11647
		],
		"valid"
	],
	[
		[
			11648,
			11670
		],
		"valid"
	],
	[
		[
			11671,
			11679
		],
		"disallowed"
	],
	[
		[
			11680,
			11686
		],
		"valid"
	],
	[
		[
			11687,
			11687
		],
		"disallowed"
	],
	[
		[
			11688,
			11694
		],
		"valid"
	],
	[
		[
			11695,
			11695
		],
		"disallowed"
	],
	[
		[
			11696,
			11702
		],
		"valid"
	],
	[
		[
			11703,
			11703
		],
		"disallowed"
	],
	[
		[
			11704,
			11710
		],
		"valid"
	],
	[
		[
			11711,
			11711
		],
		"disallowed"
	],
	[
		[
			11712,
			11718
		],
		"valid"
	],
	[
		[
			11719,
			11719
		],
		"disallowed"
	],
	[
		[
			11720,
			11726
		],
		"valid"
	],
	[
		[
			11727,
			11727
		],
		"disallowed"
	],
	[
		[
			11728,
			11734
		],
		"valid"
	],
	[
		[
			11735,
			11735
		],
		"disallowed"
	],
	[
		[
			11736,
			11742
		],
		"valid"
	],
	[
		[
			11743,
			11743
		],
		"disallowed"
	],
	[
		[
			11744,
			11775
		],
		"valid"
	],
	[
		[
			11776,
			11799
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11800,
			11803
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11804,
			11805
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11806,
			11822
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11823,
			11823
		],
		"valid"
	],
	[
		[
			11824,
			11824
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11825,
			11825
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11826,
			11835
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11836,
			11842
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11843,
			11903
		],
		"disallowed"
	],
	[
		[
			11904,
			11929
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11930,
			11930
		],
		"disallowed"
	],
	[
		[
			11931,
			11934
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			11935,
			11935
		],
		"mapped",
		[
			27597
		]
	],
	[
		[
			11936,
			12018
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12019,
			12019
		],
		"mapped",
		[
			40863
		]
	],
	[
		[
			12020,
			12031
		],
		"disallowed"
	],
	[
		[
			12032,
			12032
		],
		"mapped",
		[
			19968
		]
	],
	[
		[
			12033,
			12033
		],
		"mapped",
		[
			20008
		]
	],
	[
		[
			12034,
			12034
		],
		"mapped",
		[
			20022
		]
	],
	[
		[
			12035,
			12035
		],
		"mapped",
		[
			20031
		]
	],
	[
		[
			12036,
			12036
		],
		"mapped",
		[
			20057
		]
	],
	[
		[
			12037,
			12037
		],
		"mapped",
		[
			20101
		]
	],
	[
		[
			12038,
			12038
		],
		"mapped",
		[
			20108
		]
	],
	[
		[
			12039,
			12039
		],
		"mapped",
		[
			20128
		]
	],
	[
		[
			12040,
			12040
		],
		"mapped",
		[
			20154
		]
	],
	[
		[
			12041,
			12041
		],
		"mapped",
		[
			20799
		]
	],
	[
		[
			12042,
			12042
		],
		"mapped",
		[
			20837
		]
	],
	[
		[
			12043,
			12043
		],
		"mapped",
		[
			20843
		]
	],
	[
		[
			12044,
			12044
		],
		"mapped",
		[
			20866
		]
	],
	[
		[
			12045,
			12045
		],
		"mapped",
		[
			20886
		]
	],
	[
		[
			12046,
			12046
		],
		"mapped",
		[
			20907
		]
	],
	[
		[
			12047,
			12047
		],
		"mapped",
		[
			20960
		]
	],
	[
		[
			12048,
			12048
		],
		"mapped",
		[
			20981
		]
	],
	[
		[
			12049,
			12049
		],
		"mapped",
		[
			20992
		]
	],
	[
		[
			12050,
			12050
		],
		"mapped",
		[
			21147
		]
	],
	[
		[
			12051,
			12051
		],
		"mapped",
		[
			21241
		]
	],
	[
		[
			12052,
			12052
		],
		"mapped",
		[
			21269
		]
	],
	[
		[
			12053,
			12053
		],
		"mapped",
		[
			21274
		]
	],
	[
		[
			12054,
			12054
		],
		"mapped",
		[
			21304
		]
	],
	[
		[
			12055,
			12055
		],
		"mapped",
		[
			21313
		]
	],
	[
		[
			12056,
			12056
		],
		"mapped",
		[
			21340
		]
	],
	[
		[
			12057,
			12057
		],
		"mapped",
		[
			21353
		]
	],
	[
		[
			12058,
			12058
		],
		"mapped",
		[
			21378
		]
	],
	[
		[
			12059,
			12059
		],
		"mapped",
		[
			21430
		]
	],
	[
		[
			12060,
			12060
		],
		"mapped",
		[
			21448
		]
	],
	[
		[
			12061,
			12061
		],
		"mapped",
		[
			21475
		]
	],
	[
		[
			12062,
			12062
		],
		"mapped",
		[
			22231
		]
	],
	[
		[
			12063,
			12063
		],
		"mapped",
		[
			22303
		]
	],
	[
		[
			12064,
			12064
		],
		"mapped",
		[
			22763
		]
	],
	[
		[
			12065,
			12065
		],
		"mapped",
		[
			22786
		]
	],
	[
		[
			12066,
			12066
		],
		"mapped",
		[
			22794
		]
	],
	[
		[
			12067,
			12067
		],
		"mapped",
		[
			22805
		]
	],
	[
		[
			12068,
			12068
		],
		"mapped",
		[
			22823
		]
	],
	[
		[
			12069,
			12069
		],
		"mapped",
		[
			22899
		]
	],
	[
		[
			12070,
			12070
		],
		"mapped",
		[
			23376
		]
	],
	[
		[
			12071,
			12071
		],
		"mapped",
		[
			23424
		]
	],
	[
		[
			12072,
			12072
		],
		"mapped",
		[
			23544
		]
	],
	[
		[
			12073,
			12073
		],
		"mapped",
		[
			23567
		]
	],
	[
		[
			12074,
			12074
		],
		"mapped",
		[
			23586
		]
	],
	[
		[
			12075,
			12075
		],
		"mapped",
		[
			23608
		]
	],
	[
		[
			12076,
			12076
		],
		"mapped",
		[
			23662
		]
	],
	[
		[
			12077,
			12077
		],
		"mapped",
		[
			23665
		]
	],
	[
		[
			12078,
			12078
		],
		"mapped",
		[
			24027
		]
	],
	[
		[
			12079,
			12079
		],
		"mapped",
		[
			24037
		]
	],
	[
		[
			12080,
			12080
		],
		"mapped",
		[
			24049
		]
	],
	[
		[
			12081,
			12081
		],
		"mapped",
		[
			24062
		]
	],
	[
		[
			12082,
			12082
		],
		"mapped",
		[
			24178
		]
	],
	[
		[
			12083,
			12083
		],
		"mapped",
		[
			24186
		]
	],
	[
		[
			12084,
			12084
		],
		"mapped",
		[
			24191
		]
	],
	[
		[
			12085,
			12085
		],
		"mapped",
		[
			24308
		]
	],
	[
		[
			12086,
			12086
		],
		"mapped",
		[
			24318
		]
	],
	[
		[
			12087,
			12087
		],
		"mapped",
		[
			24331
		]
	],
	[
		[
			12088,
			12088
		],
		"mapped",
		[
			24339
		]
	],
	[
		[
			12089,
			12089
		],
		"mapped",
		[
			24400
		]
	],
	[
		[
			12090,
			12090
		],
		"mapped",
		[
			24417
		]
	],
	[
		[
			12091,
			12091
		],
		"mapped",
		[
			24435
		]
	],
	[
		[
			12092,
			12092
		],
		"mapped",
		[
			24515
		]
	],
	[
		[
			12093,
			12093
		],
		"mapped",
		[
			25096
		]
	],
	[
		[
			12094,
			12094
		],
		"mapped",
		[
			25142
		]
	],
	[
		[
			12095,
			12095
		],
		"mapped",
		[
			25163
		]
	],
	[
		[
			12096,
			12096
		],
		"mapped",
		[
			25903
		]
	],
	[
		[
			12097,
			12097
		],
		"mapped",
		[
			25908
		]
	],
	[
		[
			12098,
			12098
		],
		"mapped",
		[
			25991
		]
	],
	[
		[
			12099,
			12099
		],
		"mapped",
		[
			26007
		]
	],
	[
		[
			12100,
			12100
		],
		"mapped",
		[
			26020
		]
	],
	[
		[
			12101,
			12101
		],
		"mapped",
		[
			26041
		]
	],
	[
		[
			12102,
			12102
		],
		"mapped",
		[
			26080
		]
	],
	[
		[
			12103,
			12103
		],
		"mapped",
		[
			26085
		]
	],
	[
		[
			12104,
			12104
		],
		"mapped",
		[
			26352
		]
	],
	[
		[
			12105,
			12105
		],
		"mapped",
		[
			26376
		]
	],
	[
		[
			12106,
			12106
		],
		"mapped",
		[
			26408
		]
	],
	[
		[
			12107,
			12107
		],
		"mapped",
		[
			27424
		]
	],
	[
		[
			12108,
			12108
		],
		"mapped",
		[
			27490
		]
	],
	[
		[
			12109,
			12109
		],
		"mapped",
		[
			27513
		]
	],
	[
		[
			12110,
			12110
		],
		"mapped",
		[
			27571
		]
	],
	[
		[
			12111,
			12111
		],
		"mapped",
		[
			27595
		]
	],
	[
		[
			12112,
			12112
		],
		"mapped",
		[
			27604
		]
	],
	[
		[
			12113,
			12113
		],
		"mapped",
		[
			27611
		]
	],
	[
		[
			12114,
			12114
		],
		"mapped",
		[
			27663
		]
	],
	[
		[
			12115,
			12115
		],
		"mapped",
		[
			27668
		]
	],
	[
		[
			12116,
			12116
		],
		"mapped",
		[
			27700
		]
	],
	[
		[
			12117,
			12117
		],
		"mapped",
		[
			28779
		]
	],
	[
		[
			12118,
			12118
		],
		"mapped",
		[
			29226
		]
	],
	[
		[
			12119,
			12119
		],
		"mapped",
		[
			29238
		]
	],
	[
		[
			12120,
			12120
		],
		"mapped",
		[
			29243
		]
	],
	[
		[
			12121,
			12121
		],
		"mapped",
		[
			29247
		]
	],
	[
		[
			12122,
			12122
		],
		"mapped",
		[
			29255
		]
	],
	[
		[
			12123,
			12123
		],
		"mapped",
		[
			29273
		]
	],
	[
		[
			12124,
			12124
		],
		"mapped",
		[
			29275
		]
	],
	[
		[
			12125,
			12125
		],
		"mapped",
		[
			29356
		]
	],
	[
		[
			12126,
			12126
		],
		"mapped",
		[
			29572
		]
	],
	[
		[
			12127,
			12127
		],
		"mapped",
		[
			29577
		]
	],
	[
		[
			12128,
			12128
		],
		"mapped",
		[
			29916
		]
	],
	[
		[
			12129,
			12129
		],
		"mapped",
		[
			29926
		]
	],
	[
		[
			12130,
			12130
		],
		"mapped",
		[
			29976
		]
	],
	[
		[
			12131,
			12131
		],
		"mapped",
		[
			29983
		]
	],
	[
		[
			12132,
			12132
		],
		"mapped",
		[
			29992
		]
	],
	[
		[
			12133,
			12133
		],
		"mapped",
		[
			30000
		]
	],
	[
		[
			12134,
			12134
		],
		"mapped",
		[
			30091
		]
	],
	[
		[
			12135,
			12135
		],
		"mapped",
		[
			30098
		]
	],
	[
		[
			12136,
			12136
		],
		"mapped",
		[
			30326
		]
	],
	[
		[
			12137,
			12137
		],
		"mapped",
		[
			30333
		]
	],
	[
		[
			12138,
			12138
		],
		"mapped",
		[
			30382
		]
	],
	[
		[
			12139,
			12139
		],
		"mapped",
		[
			30399
		]
	],
	[
		[
			12140,
			12140
		],
		"mapped",
		[
			30446
		]
	],
	[
		[
			12141,
			12141
		],
		"mapped",
		[
			30683
		]
	],
	[
		[
			12142,
			12142
		],
		"mapped",
		[
			30690
		]
	],
	[
		[
			12143,
			12143
		],
		"mapped",
		[
			30707
		]
	],
	[
		[
			12144,
			12144
		],
		"mapped",
		[
			31034
		]
	],
	[
		[
			12145,
			12145
		],
		"mapped",
		[
			31160
		]
	],
	[
		[
			12146,
			12146
		],
		"mapped",
		[
			31166
		]
	],
	[
		[
			12147,
			12147
		],
		"mapped",
		[
			31348
		]
	],
	[
		[
			12148,
			12148
		],
		"mapped",
		[
			31435
		]
	],
	[
		[
			12149,
			12149
		],
		"mapped",
		[
			31481
		]
	],
	[
		[
			12150,
			12150
		],
		"mapped",
		[
			31859
		]
	],
	[
		[
			12151,
			12151
		],
		"mapped",
		[
			31992
		]
	],
	[
		[
			12152,
			12152
		],
		"mapped",
		[
			32566
		]
	],
	[
		[
			12153,
			12153
		],
		"mapped",
		[
			32593
		]
	],
	[
		[
			12154,
			12154
		],
		"mapped",
		[
			32650
		]
	],
	[
		[
			12155,
			12155
		],
		"mapped",
		[
			32701
		]
	],
	[
		[
			12156,
			12156
		],
		"mapped",
		[
			32769
		]
	],
	[
		[
			12157,
			12157
		],
		"mapped",
		[
			32780
		]
	],
	[
		[
			12158,
			12158
		],
		"mapped",
		[
			32786
		]
	],
	[
		[
			12159,
			12159
		],
		"mapped",
		[
			32819
		]
	],
	[
		[
			12160,
			12160
		],
		"mapped",
		[
			32895
		]
	],
	[
		[
			12161,
			12161
		],
		"mapped",
		[
			32905
		]
	],
	[
		[
			12162,
			12162
		],
		"mapped",
		[
			33251
		]
	],
	[
		[
			12163,
			12163
		],
		"mapped",
		[
			33258
		]
	],
	[
		[
			12164,
			12164
		],
		"mapped",
		[
			33267
		]
	],
	[
		[
			12165,
			12165
		],
		"mapped",
		[
			33276
		]
	],
	[
		[
			12166,
			12166
		],
		"mapped",
		[
			33292
		]
	],
	[
		[
			12167,
			12167
		],
		"mapped",
		[
			33307
		]
	],
	[
		[
			12168,
			12168
		],
		"mapped",
		[
			33311
		]
	],
	[
		[
			12169,
			12169
		],
		"mapped",
		[
			33390
		]
	],
	[
		[
			12170,
			12170
		],
		"mapped",
		[
			33394
		]
	],
	[
		[
			12171,
			12171
		],
		"mapped",
		[
			33400
		]
	],
	[
		[
			12172,
			12172
		],
		"mapped",
		[
			34381
		]
	],
	[
		[
			12173,
			12173
		],
		"mapped",
		[
			34411
		]
	],
	[
		[
			12174,
			12174
		],
		"mapped",
		[
			34880
		]
	],
	[
		[
			12175,
			12175
		],
		"mapped",
		[
			34892
		]
	],
	[
		[
			12176,
			12176
		],
		"mapped",
		[
			34915
		]
	],
	[
		[
			12177,
			12177
		],
		"mapped",
		[
			35198
		]
	],
	[
		[
			12178,
			12178
		],
		"mapped",
		[
			35211
		]
	],
	[
		[
			12179,
			12179
		],
		"mapped",
		[
			35282
		]
	],
	[
		[
			12180,
			12180
		],
		"mapped",
		[
			35328
		]
	],
	[
		[
			12181,
			12181
		],
		"mapped",
		[
			35895
		]
	],
	[
		[
			12182,
			12182
		],
		"mapped",
		[
			35910
		]
	],
	[
		[
			12183,
			12183
		],
		"mapped",
		[
			35925
		]
	],
	[
		[
			12184,
			12184
		],
		"mapped",
		[
			35960
		]
	],
	[
		[
			12185,
			12185
		],
		"mapped",
		[
			35997
		]
	],
	[
		[
			12186,
			12186
		],
		"mapped",
		[
			36196
		]
	],
	[
		[
			12187,
			12187
		],
		"mapped",
		[
			36208
		]
	],
	[
		[
			12188,
			12188
		],
		"mapped",
		[
			36275
		]
	],
	[
		[
			12189,
			12189
		],
		"mapped",
		[
			36523
		]
	],
	[
		[
			12190,
			12190
		],
		"mapped",
		[
			36554
		]
	],
	[
		[
			12191,
			12191
		],
		"mapped",
		[
			36763
		]
	],
	[
		[
			12192,
			12192
		],
		"mapped",
		[
			36784
		]
	],
	[
		[
			12193,
			12193
		],
		"mapped",
		[
			36789
		]
	],
	[
		[
			12194,
			12194
		],
		"mapped",
		[
			37009
		]
	],
	[
		[
			12195,
			12195
		],
		"mapped",
		[
			37193
		]
	],
	[
		[
			12196,
			12196
		],
		"mapped",
		[
			37318
		]
	],
	[
		[
			12197,
			12197
		],
		"mapped",
		[
			37324
		]
	],
	[
		[
			12198,
			12198
		],
		"mapped",
		[
			37329
		]
	],
	[
		[
			12199,
			12199
		],
		"mapped",
		[
			38263
		]
	],
	[
		[
			12200,
			12200
		],
		"mapped",
		[
			38272
		]
	],
	[
		[
			12201,
			12201
		],
		"mapped",
		[
			38428
		]
	],
	[
		[
			12202,
			12202
		],
		"mapped",
		[
			38582
		]
	],
	[
		[
			12203,
			12203
		],
		"mapped",
		[
			38585
		]
	],
	[
		[
			12204,
			12204
		],
		"mapped",
		[
			38632
		]
	],
	[
		[
			12205,
			12205
		],
		"mapped",
		[
			38737
		]
	],
	[
		[
			12206,
			12206
		],
		"mapped",
		[
			38750
		]
	],
	[
		[
			12207,
			12207
		],
		"mapped",
		[
			38754
		]
	],
	[
		[
			12208,
			12208
		],
		"mapped",
		[
			38761
		]
	],
	[
		[
			12209,
			12209
		],
		"mapped",
		[
			38859
		]
	],
	[
		[
			12210,
			12210
		],
		"mapped",
		[
			38893
		]
	],
	[
		[
			12211,
			12211
		],
		"mapped",
		[
			38899
		]
	],
	[
		[
			12212,
			12212
		],
		"mapped",
		[
			38913
		]
	],
	[
		[
			12213,
			12213
		],
		"mapped",
		[
			39080
		]
	],
	[
		[
			12214,
			12214
		],
		"mapped",
		[
			39131
		]
	],
	[
		[
			12215,
			12215
		],
		"mapped",
		[
			39135
		]
	],
	[
		[
			12216,
			12216
		],
		"mapped",
		[
			39318
		]
	],
	[
		[
			12217,
			12217
		],
		"mapped",
		[
			39321
		]
	],
	[
		[
			12218,
			12218
		],
		"mapped",
		[
			39340
		]
	],
	[
		[
			12219,
			12219
		],
		"mapped",
		[
			39592
		]
	],
	[
		[
			12220,
			12220
		],
		"mapped",
		[
			39640
		]
	],
	[
		[
			12221,
			12221
		],
		"mapped",
		[
			39647
		]
	],
	[
		[
			12222,
			12222
		],
		"mapped",
		[
			39717
		]
	],
	[
		[
			12223,
			12223
		],
		"mapped",
		[
			39727
		]
	],
	[
		[
			12224,
			12224
		],
		"mapped",
		[
			39730
		]
	],
	[
		[
			12225,
			12225
		],
		"mapped",
		[
			39740
		]
	],
	[
		[
			12226,
			12226
		],
		"mapped",
		[
			39770
		]
	],
	[
		[
			12227,
			12227
		],
		"mapped",
		[
			40165
		]
	],
	[
		[
			12228,
			12228
		],
		"mapped",
		[
			40565
		]
	],
	[
		[
			12229,
			12229
		],
		"mapped",
		[
			40575
		]
	],
	[
		[
			12230,
			12230
		],
		"mapped",
		[
			40613
		]
	],
	[
		[
			12231,
			12231
		],
		"mapped",
		[
			40635
		]
	],
	[
		[
			12232,
			12232
		],
		"mapped",
		[
			40643
		]
	],
	[
		[
			12233,
			12233
		],
		"mapped",
		[
			40653
		]
	],
	[
		[
			12234,
			12234
		],
		"mapped",
		[
			40657
		]
	],
	[
		[
			12235,
			12235
		],
		"mapped",
		[
			40697
		]
	],
	[
		[
			12236,
			12236
		],
		"mapped",
		[
			40701
		]
	],
	[
		[
			12237,
			12237
		],
		"mapped",
		[
			40718
		]
	],
	[
		[
			12238,
			12238
		],
		"mapped",
		[
			40723
		]
	],
	[
		[
			12239,
			12239
		],
		"mapped",
		[
			40736
		]
	],
	[
		[
			12240,
			12240
		],
		"mapped",
		[
			40763
		]
	],
	[
		[
			12241,
			12241
		],
		"mapped",
		[
			40778
		]
	],
	[
		[
			12242,
			12242
		],
		"mapped",
		[
			40786
		]
	],
	[
		[
			12243,
			12243
		],
		"mapped",
		[
			40845
		]
	],
	[
		[
			12244,
			12244
		],
		"mapped",
		[
			40860
		]
	],
	[
		[
			12245,
			12245
		],
		"mapped",
		[
			40864
		]
	],
	[
		[
			12246,
			12271
		],
		"disallowed"
	],
	[
		[
			12272,
			12283
		],
		"disallowed"
	],
	[
		[
			12284,
			12287
		],
		"disallowed"
	],
	[
		[
			12288,
			12288
		],
		"disallowed_STD3_mapped",
		[
			32
		]
	],
	[
		[
			12289,
			12289
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12290,
			12290
		],
		"mapped",
		[
			46
		]
	],
	[
		[
			12291,
			12292
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12293,
			12295
		],
		"valid"
	],
	[
		[
			12296,
			12329
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12330,
			12333
		],
		"valid"
	],
	[
		[
			12334,
			12341
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12342,
			12342
		],
		"mapped",
		[
			12306
		]
	],
	[
		[
			12343,
			12343
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12344,
			12344
		],
		"mapped",
		[
			21313
		]
	],
	[
		[
			12345,
			12345
		],
		"mapped",
		[
			21316
		]
	],
	[
		[
			12346,
			12346
		],
		"mapped",
		[
			21317
		]
	],
	[
		[
			12347,
			12347
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12348,
			12348
		],
		"valid"
	],
	[
		[
			12349,
			12349
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12350,
			12350
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12351,
			12351
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12352,
			12352
		],
		"disallowed"
	],
	[
		[
			12353,
			12436
		],
		"valid"
	],
	[
		[
			12437,
			12438
		],
		"valid"
	],
	[
		[
			12439,
			12440
		],
		"disallowed"
	],
	[
		[
			12441,
			12442
		],
		"valid"
	],
	[
		[
			12443,
			12443
		],
		"disallowed_STD3_mapped",
		[
			32,
			12441
		]
	],
	[
		[
			12444,
			12444
		],
		"disallowed_STD3_mapped",
		[
			32,
			12442
		]
	],
	[
		[
			12445,
			12446
		],
		"valid"
	],
	[
		[
			12447,
			12447
		],
		"mapped",
		[
			12424,
			12426
		]
	],
	[
		[
			12448,
			12448
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12449,
			12542
		],
		"valid"
	],
	[
		[
			12543,
			12543
		],
		"mapped",
		[
			12467,
			12488
		]
	],
	[
		[
			12544,
			12548
		],
		"disallowed"
	],
	[
		[
			12549,
			12588
		],
		"valid"
	],
	[
		[
			12589,
			12589
		],
		"valid"
	],
	[
		[
			12590,
			12592
		],
		"disallowed"
	],
	[
		[
			12593,
			12593
		],
		"mapped",
		[
			4352
		]
	],
	[
		[
			12594,
			12594
		],
		"mapped",
		[
			4353
		]
	],
	[
		[
			12595,
			12595
		],
		"mapped",
		[
			4522
		]
	],
	[
		[
			12596,
			12596
		],
		"mapped",
		[
			4354
		]
	],
	[
		[
			12597,
			12597
		],
		"mapped",
		[
			4524
		]
	],
	[
		[
			12598,
			12598
		],
		"mapped",
		[
			4525
		]
	],
	[
		[
			12599,
			12599
		],
		"mapped",
		[
			4355
		]
	],
	[
		[
			12600,
			12600
		],
		"mapped",
		[
			4356
		]
	],
	[
		[
			12601,
			12601
		],
		"mapped",
		[
			4357
		]
	],
	[
		[
			12602,
			12602
		],
		"mapped",
		[
			4528
		]
	],
	[
		[
			12603,
			12603
		],
		"mapped",
		[
			4529
		]
	],
	[
		[
			12604,
			12604
		],
		"mapped",
		[
			4530
		]
	],
	[
		[
			12605,
			12605
		],
		"mapped",
		[
			4531
		]
	],
	[
		[
			12606,
			12606
		],
		"mapped",
		[
			4532
		]
	],
	[
		[
			12607,
			12607
		],
		"mapped",
		[
			4533
		]
	],
	[
		[
			12608,
			12608
		],
		"mapped",
		[
			4378
		]
	],
	[
		[
			12609,
			12609
		],
		"mapped",
		[
			4358
		]
	],
	[
		[
			12610,
			12610
		],
		"mapped",
		[
			4359
		]
	],
	[
		[
			12611,
			12611
		],
		"mapped",
		[
			4360
		]
	],
	[
		[
			12612,
			12612
		],
		"mapped",
		[
			4385
		]
	],
	[
		[
			12613,
			12613
		],
		"mapped",
		[
			4361
		]
	],
	[
		[
			12614,
			12614
		],
		"mapped",
		[
			4362
		]
	],
	[
		[
			12615,
			12615
		],
		"mapped",
		[
			4363
		]
	],
	[
		[
			12616,
			12616
		],
		"mapped",
		[
			4364
		]
	],
	[
		[
			12617,
			12617
		],
		"mapped",
		[
			4365
		]
	],
	[
		[
			12618,
			12618
		],
		"mapped",
		[
			4366
		]
	],
	[
		[
			12619,
			12619
		],
		"mapped",
		[
			4367
		]
	],
	[
		[
			12620,
			12620
		],
		"mapped",
		[
			4368
		]
	],
	[
		[
			12621,
			12621
		],
		"mapped",
		[
			4369
		]
	],
	[
		[
			12622,
			12622
		],
		"mapped",
		[
			4370
		]
	],
	[
		[
			12623,
			12623
		],
		"mapped",
		[
			4449
		]
	],
	[
		[
			12624,
			12624
		],
		"mapped",
		[
			4450
		]
	],
	[
		[
			12625,
			12625
		],
		"mapped",
		[
			4451
		]
	],
	[
		[
			12626,
			12626
		],
		"mapped",
		[
			4452
		]
	],
	[
		[
			12627,
			12627
		],
		"mapped",
		[
			4453
		]
	],
	[
		[
			12628,
			12628
		],
		"mapped",
		[
			4454
		]
	],
	[
		[
			12629,
			12629
		],
		"mapped",
		[
			4455
		]
	],
	[
		[
			12630,
			12630
		],
		"mapped",
		[
			4456
		]
	],
	[
		[
			12631,
			12631
		],
		"mapped",
		[
			4457
		]
	],
	[
		[
			12632,
			12632
		],
		"mapped",
		[
			4458
		]
	],
	[
		[
			12633,
			12633
		],
		"mapped",
		[
			4459
		]
	],
	[
		[
			12634,
			12634
		],
		"mapped",
		[
			4460
		]
	],
	[
		[
			12635,
			12635
		],
		"mapped",
		[
			4461
		]
	],
	[
		[
			12636,
			12636
		],
		"mapped",
		[
			4462
		]
	],
	[
		[
			12637,
			12637
		],
		"mapped",
		[
			4463
		]
	],
	[
		[
			12638,
			12638
		],
		"mapped",
		[
			4464
		]
	],
	[
		[
			12639,
			12639
		],
		"mapped",
		[
			4465
		]
	],
	[
		[
			12640,
			12640
		],
		"mapped",
		[
			4466
		]
	],
	[
		[
			12641,
			12641
		],
		"mapped",
		[
			4467
		]
	],
	[
		[
			12642,
			12642
		],
		"mapped",
		[
			4468
		]
	],
	[
		[
			12643,
			12643
		],
		"mapped",
		[
			4469
		]
	],
	[
		[
			12644,
			12644
		],
		"disallowed"
	],
	[
		[
			12645,
			12645
		],
		"mapped",
		[
			4372
		]
	],
	[
		[
			12646,
			12646
		],
		"mapped",
		[
			4373
		]
	],
	[
		[
			12647,
			12647
		],
		"mapped",
		[
			4551
		]
	],
	[
		[
			12648,
			12648
		],
		"mapped",
		[
			4552
		]
	],
	[
		[
			12649,
			12649
		],
		"mapped",
		[
			4556
		]
	],
	[
		[
			12650,
			12650
		],
		"mapped",
		[
			4558
		]
	],
	[
		[
			12651,
			12651
		],
		"mapped",
		[
			4563
		]
	],
	[
		[
			12652,
			12652
		],
		"mapped",
		[
			4567
		]
	],
	[
		[
			12653,
			12653
		],
		"mapped",
		[
			4569
		]
	],
	[
		[
			12654,
			12654
		],
		"mapped",
		[
			4380
		]
	],
	[
		[
			12655,
			12655
		],
		"mapped",
		[
			4573
		]
	],
	[
		[
			12656,
			12656
		],
		"mapped",
		[
			4575
		]
	],
	[
		[
			12657,
			12657
		],
		"mapped",
		[
			4381
		]
	],
	[
		[
			12658,
			12658
		],
		"mapped",
		[
			4382
		]
	],
	[
		[
			12659,
			12659
		],
		"mapped",
		[
			4384
		]
	],
	[
		[
			12660,
			12660
		],
		"mapped",
		[
			4386
		]
	],
	[
		[
			12661,
			12661
		],
		"mapped",
		[
			4387
		]
	],
	[
		[
			12662,
			12662
		],
		"mapped",
		[
			4391
		]
	],
	[
		[
			12663,
			12663
		],
		"mapped",
		[
			4393
		]
	],
	[
		[
			12664,
			12664
		],
		"mapped",
		[
			4395
		]
	],
	[
		[
			12665,
			12665
		],
		"mapped",
		[
			4396
		]
	],
	[
		[
			12666,
			12666
		],
		"mapped",
		[
			4397
		]
	],
	[
		[
			12667,
			12667
		],
		"mapped",
		[
			4398
		]
	],
	[
		[
			12668,
			12668
		],
		"mapped",
		[
			4399
		]
	],
	[
		[
			12669,
			12669
		],
		"mapped",
		[
			4402
		]
	],
	[
		[
			12670,
			12670
		],
		"mapped",
		[
			4406
		]
	],
	[
		[
			12671,
			12671
		],
		"mapped",
		[
			4416
		]
	],
	[
		[
			12672,
			12672
		],
		"mapped",
		[
			4423
		]
	],
	[
		[
			12673,
			12673
		],
		"mapped",
		[
			4428
		]
	],
	[
		[
			12674,
			12674
		],
		"mapped",
		[
			4593
		]
	],
	[
		[
			12675,
			12675
		],
		"mapped",
		[
			4594
		]
	],
	[
		[
			12676,
			12676
		],
		"mapped",
		[
			4439
		]
	],
	[
		[
			12677,
			12677
		],
		"mapped",
		[
			4440
		]
	],
	[
		[
			12678,
			12678
		],
		"mapped",
		[
			4441
		]
	],
	[
		[
			12679,
			12679
		],
		"mapped",
		[
			4484
		]
	],
	[
		[
			12680,
			12680
		],
		"mapped",
		[
			4485
		]
	],
	[
		[
			12681,
			12681
		],
		"mapped",
		[
			4488
		]
	],
	[
		[
			12682,
			12682
		],
		"mapped",
		[
			4497
		]
	],
	[
		[
			12683,
			12683
		],
		"mapped",
		[
			4498
		]
	],
	[
		[
			12684,
			12684
		],
		"mapped",
		[
			4500
		]
	],
	[
		[
			12685,
			12685
		],
		"mapped",
		[
			4510
		]
	],
	[
		[
			12686,
			12686
		],
		"mapped",
		[
			4513
		]
	],
	[
		[
			12687,
			12687
		],
		"disallowed"
	],
	[
		[
			12688,
			12689
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12690,
			12690
		],
		"mapped",
		[
			19968
		]
	],
	[
		[
			12691,
			12691
		],
		"mapped",
		[
			20108
		]
	],
	[
		[
			12692,
			12692
		],
		"mapped",
		[
			19977
		]
	],
	[
		[
			12693,
			12693
		],
		"mapped",
		[
			22235
		]
	],
	[
		[
			12694,
			12694
		],
		"mapped",
		[
			19978
		]
	],
	[
		[
			12695,
			12695
		],
		"mapped",
		[
			20013
		]
	],
	[
		[
			12696,
			12696
		],
		"mapped",
		[
			19979
		]
	],
	[
		[
			12697,
			12697
		],
		"mapped",
		[
			30002
		]
	],
	[
		[
			12698,
			12698
		],
		"mapped",
		[
			20057
		]
	],
	[
		[
			12699,
			12699
		],
		"mapped",
		[
			19993
		]
	],
	[
		[
			12700,
			12700
		],
		"mapped",
		[
			19969
		]
	],
	[
		[
			12701,
			12701
		],
		"mapped",
		[
			22825
		]
	],
	[
		[
			12702,
			12702
		],
		"mapped",
		[
			22320
		]
	],
	[
		[
			12703,
			12703
		],
		"mapped",
		[
			20154
		]
	],
	[
		[
			12704,
			12727
		],
		"valid"
	],
	[
		[
			12728,
			12730
		],
		"valid"
	],
	[
		[
			12731,
			12735
		],
		"disallowed"
	],
	[
		[
			12736,
			12751
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12752,
			12771
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12772,
			12783
		],
		"disallowed"
	],
	[
		[
			12784,
			12799
		],
		"valid"
	],
	[
		[
			12800,
			12800
		],
		"disallowed_STD3_mapped",
		[
			40,
			4352,
			41
		]
	],
	[
		[
			12801,
			12801
		],
		"disallowed_STD3_mapped",
		[
			40,
			4354,
			41
		]
	],
	[
		[
			12802,
			12802
		],
		"disallowed_STD3_mapped",
		[
			40,
			4355,
			41
		]
	],
	[
		[
			12803,
			12803
		],
		"disallowed_STD3_mapped",
		[
			40,
			4357,
			41
		]
	],
	[
		[
			12804,
			12804
		],
		"disallowed_STD3_mapped",
		[
			40,
			4358,
			41
		]
	],
	[
		[
			12805,
			12805
		],
		"disallowed_STD3_mapped",
		[
			40,
			4359,
			41
		]
	],
	[
		[
			12806,
			12806
		],
		"disallowed_STD3_mapped",
		[
			40,
			4361,
			41
		]
	],
	[
		[
			12807,
			12807
		],
		"disallowed_STD3_mapped",
		[
			40,
			4363,
			41
		]
	],
	[
		[
			12808,
			12808
		],
		"disallowed_STD3_mapped",
		[
			40,
			4364,
			41
		]
	],
	[
		[
			12809,
			12809
		],
		"disallowed_STD3_mapped",
		[
			40,
			4366,
			41
		]
	],
	[
		[
			12810,
			12810
		],
		"disallowed_STD3_mapped",
		[
			40,
			4367,
			41
		]
	],
	[
		[
			12811,
			12811
		],
		"disallowed_STD3_mapped",
		[
			40,
			4368,
			41
		]
	],
	[
		[
			12812,
			12812
		],
		"disallowed_STD3_mapped",
		[
			40,
			4369,
			41
		]
	],
	[
		[
			12813,
			12813
		],
		"disallowed_STD3_mapped",
		[
			40,
			4370,
			41
		]
	],
	[
		[
			12814,
			12814
		],
		"disallowed_STD3_mapped",
		[
			40,
			44032,
			41
		]
	],
	[
		[
			12815,
			12815
		],
		"disallowed_STD3_mapped",
		[
			40,
			45208,
			41
		]
	],
	[
		[
			12816,
			12816
		],
		"disallowed_STD3_mapped",
		[
			40,
			45796,
			41
		]
	],
	[
		[
			12817,
			12817
		],
		"disallowed_STD3_mapped",
		[
			40,
			46972,
			41
		]
	],
	[
		[
			12818,
			12818
		],
		"disallowed_STD3_mapped",
		[
			40,
			47560,
			41
		]
	],
	[
		[
			12819,
			12819
		],
		"disallowed_STD3_mapped",
		[
			40,
			48148,
			41
		]
	],
	[
		[
			12820,
			12820
		],
		"disallowed_STD3_mapped",
		[
			40,
			49324,
			41
		]
	],
	[
		[
			12821,
			12821
		],
		"disallowed_STD3_mapped",
		[
			40,
			50500,
			41
		]
	],
	[
		[
			12822,
			12822
		],
		"disallowed_STD3_mapped",
		[
			40,
			51088,
			41
		]
	],
	[
		[
			12823,
			12823
		],
		"disallowed_STD3_mapped",
		[
			40,
			52264,
			41
		]
	],
	[
		[
			12824,
			12824
		],
		"disallowed_STD3_mapped",
		[
			40,
			52852,
			41
		]
	],
	[
		[
			12825,
			12825
		],
		"disallowed_STD3_mapped",
		[
			40,
			53440,
			41
		]
	],
	[
		[
			12826,
			12826
		],
		"disallowed_STD3_mapped",
		[
			40,
			54028,
			41
		]
	],
	[
		[
			12827,
			12827
		],
		"disallowed_STD3_mapped",
		[
			40,
			54616,
			41
		]
	],
	[
		[
			12828,
			12828
		],
		"disallowed_STD3_mapped",
		[
			40,
			51452,
			41
		]
	],
	[
		[
			12829,
			12829
		],
		"disallowed_STD3_mapped",
		[
			40,
			50724,
			51204,
			41
		]
	],
	[
		[
			12830,
			12830
		],
		"disallowed_STD3_mapped",
		[
			40,
			50724,
			54980,
			41
		]
	],
	[
		[
			12831,
			12831
		],
		"disallowed"
	],
	[
		[
			12832,
			12832
		],
		"disallowed_STD3_mapped",
		[
			40,
			19968,
			41
		]
	],
	[
		[
			12833,
			12833
		],
		"disallowed_STD3_mapped",
		[
			40,
			20108,
			41
		]
	],
	[
		[
			12834,
			12834
		],
		"disallowed_STD3_mapped",
		[
			40,
			19977,
			41
		]
	],
	[
		[
			12835,
			12835
		],
		"disallowed_STD3_mapped",
		[
			40,
			22235,
			41
		]
	],
	[
		[
			12836,
			12836
		],
		"disallowed_STD3_mapped",
		[
			40,
			20116,
			41
		]
	],
	[
		[
			12837,
			12837
		],
		"disallowed_STD3_mapped",
		[
			40,
			20845,
			41
		]
	],
	[
		[
			12838,
			12838
		],
		"disallowed_STD3_mapped",
		[
			40,
			19971,
			41
		]
	],
	[
		[
			12839,
			12839
		],
		"disallowed_STD3_mapped",
		[
			40,
			20843,
			41
		]
	],
	[
		[
			12840,
			12840
		],
		"disallowed_STD3_mapped",
		[
			40,
			20061,
			41
		]
	],
	[
		[
			12841,
			12841
		],
		"disallowed_STD3_mapped",
		[
			40,
			21313,
			41
		]
	],
	[
		[
			12842,
			12842
		],
		"disallowed_STD3_mapped",
		[
			40,
			26376,
			41
		]
	],
	[
		[
			12843,
			12843
		],
		"disallowed_STD3_mapped",
		[
			40,
			28779,
			41
		]
	],
	[
		[
			12844,
			12844
		],
		"disallowed_STD3_mapped",
		[
			40,
			27700,
			41
		]
	],
	[
		[
			12845,
			12845
		],
		"disallowed_STD3_mapped",
		[
			40,
			26408,
			41
		]
	],
	[
		[
			12846,
			12846
		],
		"disallowed_STD3_mapped",
		[
			40,
			37329,
			41
		]
	],
	[
		[
			12847,
			12847
		],
		"disallowed_STD3_mapped",
		[
			40,
			22303,
			41
		]
	],
	[
		[
			12848,
			12848
		],
		"disallowed_STD3_mapped",
		[
			40,
			26085,
			41
		]
	],
	[
		[
			12849,
			12849
		],
		"disallowed_STD3_mapped",
		[
			40,
			26666,
			41
		]
	],
	[
		[
			12850,
			12850
		],
		"disallowed_STD3_mapped",
		[
			40,
			26377,
			41
		]
	],
	[
		[
			12851,
			12851
		],
		"disallowed_STD3_mapped",
		[
			40,
			31038,
			41
		]
	],
	[
		[
			12852,
			12852
		],
		"disallowed_STD3_mapped",
		[
			40,
			21517,
			41
		]
	],
	[
		[
			12853,
			12853
		],
		"disallowed_STD3_mapped",
		[
			40,
			29305,
			41
		]
	],
	[
		[
			12854,
			12854
		],
		"disallowed_STD3_mapped",
		[
			40,
			36001,
			41
		]
	],
	[
		[
			12855,
			12855
		],
		"disallowed_STD3_mapped",
		[
			40,
			31069,
			41
		]
	],
	[
		[
			12856,
			12856
		],
		"disallowed_STD3_mapped",
		[
			40,
			21172,
			41
		]
	],
	[
		[
			12857,
			12857
		],
		"disallowed_STD3_mapped",
		[
			40,
			20195,
			41
		]
	],
	[
		[
			12858,
			12858
		],
		"disallowed_STD3_mapped",
		[
			40,
			21628,
			41
		]
	],
	[
		[
			12859,
			12859
		],
		"disallowed_STD3_mapped",
		[
			40,
			23398,
			41
		]
	],
	[
		[
			12860,
			12860
		],
		"disallowed_STD3_mapped",
		[
			40,
			30435,
			41
		]
	],
	[
		[
			12861,
			12861
		],
		"disallowed_STD3_mapped",
		[
			40,
			20225,
			41
		]
	],
	[
		[
			12862,
			12862
		],
		"disallowed_STD3_mapped",
		[
			40,
			36039,
			41
		]
	],
	[
		[
			12863,
			12863
		],
		"disallowed_STD3_mapped",
		[
			40,
			21332,
			41
		]
	],
	[
		[
			12864,
			12864
		],
		"disallowed_STD3_mapped",
		[
			40,
			31085,
			41
		]
	],
	[
		[
			12865,
			12865
		],
		"disallowed_STD3_mapped",
		[
			40,
			20241,
			41
		]
	],
	[
		[
			12866,
			12866
		],
		"disallowed_STD3_mapped",
		[
			40,
			33258,
			41
		]
	],
	[
		[
			12867,
			12867
		],
		"disallowed_STD3_mapped",
		[
			40,
			33267,
			41
		]
	],
	[
		[
			12868,
			12868
		],
		"mapped",
		[
			21839
		]
	],
	[
		[
			12869,
			12869
		],
		"mapped",
		[
			24188
		]
	],
	[
		[
			12870,
			12870
		],
		"mapped",
		[
			25991
		]
	],
	[
		[
			12871,
			12871
		],
		"mapped",
		[
			31631
		]
	],
	[
		[
			12872,
			12879
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12880,
			12880
		],
		"mapped",
		[
			112,
			116,
			101
		]
	],
	[
		[
			12881,
			12881
		],
		"mapped",
		[
			50,
			49
		]
	],
	[
		[
			12882,
			12882
		],
		"mapped",
		[
			50,
			50
		]
	],
	[
		[
			12883,
			12883
		],
		"mapped",
		[
			50,
			51
		]
	],
	[
		[
			12884,
			12884
		],
		"mapped",
		[
			50,
			52
		]
	],
	[
		[
			12885,
			12885
		],
		"mapped",
		[
			50,
			53
		]
	],
	[
		[
			12886,
			12886
		],
		"mapped",
		[
			50,
			54
		]
	],
	[
		[
			12887,
			12887
		],
		"mapped",
		[
			50,
			55
		]
	],
	[
		[
			12888,
			12888
		],
		"mapped",
		[
			50,
			56
		]
	],
	[
		[
			12889,
			12889
		],
		"mapped",
		[
			50,
			57
		]
	],
	[
		[
			12890,
			12890
		],
		"mapped",
		[
			51,
			48
		]
	],
	[
		[
			12891,
			12891
		],
		"mapped",
		[
			51,
			49
		]
	],
	[
		[
			12892,
			12892
		],
		"mapped",
		[
			51,
			50
		]
	],
	[
		[
			12893,
			12893
		],
		"mapped",
		[
			51,
			51
		]
	],
	[
		[
			12894,
			12894
		],
		"mapped",
		[
			51,
			52
		]
	],
	[
		[
			12895,
			12895
		],
		"mapped",
		[
			51,
			53
		]
	],
	[
		[
			12896,
			12896
		],
		"mapped",
		[
			4352
		]
	],
	[
		[
			12897,
			12897
		],
		"mapped",
		[
			4354
		]
	],
	[
		[
			12898,
			12898
		],
		"mapped",
		[
			4355
		]
	],
	[
		[
			12899,
			12899
		],
		"mapped",
		[
			4357
		]
	],
	[
		[
			12900,
			12900
		],
		"mapped",
		[
			4358
		]
	],
	[
		[
			12901,
			12901
		],
		"mapped",
		[
			4359
		]
	],
	[
		[
			12902,
			12902
		],
		"mapped",
		[
			4361
		]
	],
	[
		[
			12903,
			12903
		],
		"mapped",
		[
			4363
		]
	],
	[
		[
			12904,
			12904
		],
		"mapped",
		[
			4364
		]
	],
	[
		[
			12905,
			12905
		],
		"mapped",
		[
			4366
		]
	],
	[
		[
			12906,
			12906
		],
		"mapped",
		[
			4367
		]
	],
	[
		[
			12907,
			12907
		],
		"mapped",
		[
			4368
		]
	],
	[
		[
			12908,
			12908
		],
		"mapped",
		[
			4369
		]
	],
	[
		[
			12909,
			12909
		],
		"mapped",
		[
			4370
		]
	],
	[
		[
			12910,
			12910
		],
		"mapped",
		[
			44032
		]
	],
	[
		[
			12911,
			12911
		],
		"mapped",
		[
			45208
		]
	],
	[
		[
			12912,
			12912
		],
		"mapped",
		[
			45796
		]
	],
	[
		[
			12913,
			12913
		],
		"mapped",
		[
			46972
		]
	],
	[
		[
			12914,
			12914
		],
		"mapped",
		[
			47560
		]
	],
	[
		[
			12915,
			12915
		],
		"mapped",
		[
			48148
		]
	],
	[
		[
			12916,
			12916
		],
		"mapped",
		[
			49324
		]
	],
	[
		[
			12917,
			12917
		],
		"mapped",
		[
			50500
		]
	],
	[
		[
			12918,
			12918
		],
		"mapped",
		[
			51088
		]
	],
	[
		[
			12919,
			12919
		],
		"mapped",
		[
			52264
		]
	],
	[
		[
			12920,
			12920
		],
		"mapped",
		[
			52852
		]
	],
	[
		[
			12921,
			12921
		],
		"mapped",
		[
			53440
		]
	],
	[
		[
			12922,
			12922
		],
		"mapped",
		[
			54028
		]
	],
	[
		[
			12923,
			12923
		],
		"mapped",
		[
			54616
		]
	],
	[
		[
			12924,
			12924
		],
		"mapped",
		[
			52280,
			44256
		]
	],
	[
		[
			12925,
			12925
		],
		"mapped",
		[
			51452,
			51032
		]
	],
	[
		[
			12926,
			12926
		],
		"mapped",
		[
			50864
		]
	],
	[
		[
			12927,
			12927
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			12928,
			12928
		],
		"mapped",
		[
			19968
		]
	],
	[
		[
			12929,
			12929
		],
		"mapped",
		[
			20108
		]
	],
	[
		[
			12930,
			12930
		],
		"mapped",
		[
			19977
		]
	],
	[
		[
			12931,
			12931
		],
		"mapped",
		[
			22235
		]
	],
	[
		[
			12932,
			12932
		],
		"mapped",
		[
			20116
		]
	],
	[
		[
			12933,
			12933
		],
		"mapped",
		[
			20845
		]
	],
	[
		[
			12934,
			12934
		],
		"mapped",
		[
			19971
		]
	],
	[
		[
			12935,
			12935
		],
		"mapped",
		[
			20843
		]
	],
	[
		[
			12936,
			12936
		],
		"mapped",
		[
			20061
		]
	],
	[
		[
			12937,
			12937
		],
		"mapped",
		[
			21313
		]
	],
	[
		[
			12938,
			12938
		],
		"mapped",
		[
			26376
		]
	],
	[
		[
			12939,
			12939
		],
		"mapped",
		[
			28779
		]
	],
	[
		[
			12940,
			12940
		],
		"mapped",
		[
			27700
		]
	],
	[
		[
			12941,
			12941
		],
		"mapped",
		[
			26408
		]
	],
	[
		[
			12942,
			12942
		],
		"mapped",
		[
			37329
		]
	],
	[
		[
			12943,
			12943
		],
		"mapped",
		[
			22303
		]
	],
	[
		[
			12944,
			12944
		],
		"mapped",
		[
			26085
		]
	],
	[
		[
			12945,
			12945
		],
		"mapped",
		[
			26666
		]
	],
	[
		[
			12946,
			12946
		],
		"mapped",
		[
			26377
		]
	],
	[
		[
			12947,
			12947
		],
		"mapped",
		[
			31038
		]
	],
	[
		[
			12948,
			12948
		],
		"mapped",
		[
			21517
		]
	],
	[
		[
			12949,
			12949
		],
		"mapped",
		[
			29305
		]
	],
	[
		[
			12950,
			12950
		],
		"mapped",
		[
			36001
		]
	],
	[
		[
			12951,
			12951
		],
		"mapped",
		[
			31069
		]
	],
	[
		[
			12952,
			12952
		],
		"mapped",
		[
			21172
		]
	],
	[
		[
			12953,
			12953
		],
		"mapped",
		[
			31192
		]
	],
	[
		[
			12954,
			12954
		],
		"mapped",
		[
			30007
		]
	],
	[
		[
			12955,
			12955
		],
		"mapped",
		[
			22899
		]
	],
	[
		[
			12956,
			12956
		],
		"mapped",
		[
			36969
		]
	],
	[
		[
			12957,
			12957
		],
		"mapped",
		[
			20778
		]
	],
	[
		[
			12958,
			12958
		],
		"mapped",
		[
			21360
		]
	],
	[
		[
			12959,
			12959
		],
		"mapped",
		[
			27880
		]
	],
	[
		[
			12960,
			12960
		],
		"mapped",
		[
			38917
		]
	],
	[
		[
			12961,
			12961
		],
		"mapped",
		[
			20241
		]
	],
	[
		[
			12962,
			12962
		],
		"mapped",
		[
			20889
		]
	],
	[
		[
			12963,
			12963
		],
		"mapped",
		[
			27491
		]
	],
	[
		[
			12964,
			12964
		],
		"mapped",
		[
			19978
		]
	],
	[
		[
			12965,
			12965
		],
		"mapped",
		[
			20013
		]
	],
	[
		[
			12966,
			12966
		],
		"mapped",
		[
			19979
		]
	],
	[
		[
			12967,
			12967
		],
		"mapped",
		[
			24038
		]
	],
	[
		[
			12968,
			12968
		],
		"mapped",
		[
			21491
		]
	],
	[
		[
			12969,
			12969
		],
		"mapped",
		[
			21307
		]
	],
	[
		[
			12970,
			12970
		],
		"mapped",
		[
			23447
		]
	],
	[
		[
			12971,
			12971
		],
		"mapped",
		[
			23398
		]
	],
	[
		[
			12972,
			12972
		],
		"mapped",
		[
			30435
		]
	],
	[
		[
			12973,
			12973
		],
		"mapped",
		[
			20225
		]
	],
	[
		[
			12974,
			12974
		],
		"mapped",
		[
			36039
		]
	],
	[
		[
			12975,
			12975
		],
		"mapped",
		[
			21332
		]
	],
	[
		[
			12976,
			12976
		],
		"mapped",
		[
			22812
		]
	],
	[
		[
			12977,
			12977
		],
		"mapped",
		[
			51,
			54
		]
	],
	[
		[
			12978,
			12978
		],
		"mapped",
		[
			51,
			55
		]
	],
	[
		[
			12979,
			12979
		],
		"mapped",
		[
			51,
			56
		]
	],
	[
		[
			12980,
			12980
		],
		"mapped",
		[
			51,
			57
		]
	],
	[
		[
			12981,
			12981
		],
		"mapped",
		[
			52,
			48
		]
	],
	[
		[
			12982,
			12982
		],
		"mapped",
		[
			52,
			49
		]
	],
	[
		[
			12983,
			12983
		],
		"mapped",
		[
			52,
			50
		]
	],
	[
		[
			12984,
			12984
		],
		"mapped",
		[
			52,
			51
		]
	],
	[
		[
			12985,
			12985
		],
		"mapped",
		[
			52,
			52
		]
	],
	[
		[
			12986,
			12986
		],
		"mapped",
		[
			52,
			53
		]
	],
	[
		[
			12987,
			12987
		],
		"mapped",
		[
			52,
			54
		]
	],
	[
		[
			12988,
			12988
		],
		"mapped",
		[
			52,
			55
		]
	],
	[
		[
			12989,
			12989
		],
		"mapped",
		[
			52,
			56
		]
	],
	[
		[
			12990,
			12990
		],
		"mapped",
		[
			52,
			57
		]
	],
	[
		[
			12991,
			12991
		],
		"mapped",
		[
			53,
			48
		]
	],
	[
		[
			12992,
			12992
		],
		"mapped",
		[
			49,
			26376
		]
	],
	[
		[
			12993,
			12993
		],
		"mapped",
		[
			50,
			26376
		]
	],
	[
		[
			12994,
			12994
		],
		"mapped",
		[
			51,
			26376
		]
	],
	[
		[
			12995,
			12995
		],
		"mapped",
		[
			52,
			26376
		]
	],
	[
		[
			12996,
			12996
		],
		"mapped",
		[
			53,
			26376
		]
	],
	[
		[
			12997,
			12997
		],
		"mapped",
		[
			54,
			26376
		]
	],
	[
		[
			12998,
			12998
		],
		"mapped",
		[
			55,
			26376
		]
	],
	[
		[
			12999,
			12999
		],
		"mapped",
		[
			56,
			26376
		]
	],
	[
		[
			13000,
			13000
		],
		"mapped",
		[
			57,
			26376
		]
	],
	[
		[
			13001,
			13001
		],
		"mapped",
		[
			49,
			48,
			26376
		]
	],
	[
		[
			13002,
			13002
		],
		"mapped",
		[
			49,
			49,
			26376
		]
	],
	[
		[
			13003,
			13003
		],
		"mapped",
		[
			49,
			50,
			26376
		]
	],
	[
		[
			13004,
			13004
		],
		"mapped",
		[
			104,
			103
		]
	],
	[
		[
			13005,
			13005
		],
		"mapped",
		[
			101,
			114,
			103
		]
	],
	[
		[
			13006,
			13006
		],
		"mapped",
		[
			101,
			118
		]
	],
	[
		[
			13007,
			13007
		],
		"mapped",
		[
			108,
			116,
			100
		]
	],
	[
		[
			13008,
			13008
		],
		"mapped",
		[
			12450
		]
	],
	[
		[
			13009,
			13009
		],
		"mapped",
		[
			12452
		]
	],
	[
		[
			13010,
			13010
		],
		"mapped",
		[
			12454
		]
	],
	[
		[
			13011,
			13011
		],
		"mapped",
		[
			12456
		]
	],
	[
		[
			13012,
			13012
		],
		"mapped",
		[
			12458
		]
	],
	[
		[
			13013,
			13013
		],
		"mapped",
		[
			12459
		]
	],
	[
		[
			13014,
			13014
		],
		"mapped",
		[
			12461
		]
	],
	[
		[
			13015,
			13015
		],
		"mapped",
		[
			12463
		]
	],
	[
		[
			13016,
			13016
		],
		"mapped",
		[
			12465
		]
	],
	[
		[
			13017,
			13017
		],
		"mapped",
		[
			12467
		]
	],
	[
		[
			13018,
			13018
		],
		"mapped",
		[
			12469
		]
	],
	[
		[
			13019,
			13019
		],
		"mapped",
		[
			12471
		]
	],
	[
		[
			13020,
			13020
		],
		"mapped",
		[
			12473
		]
	],
	[
		[
			13021,
			13021
		],
		"mapped",
		[
			12475
		]
	],
	[
		[
			13022,
			13022
		],
		"mapped",
		[
			12477
		]
	],
	[
		[
			13023,
			13023
		],
		"mapped",
		[
			12479
		]
	],
	[
		[
			13024,
			13024
		],
		"mapped",
		[
			12481
		]
	],
	[
		[
			13025,
			13025
		],
		"mapped",
		[
			12484
		]
	],
	[
		[
			13026,
			13026
		],
		"mapped",
		[
			12486
		]
	],
	[
		[
			13027,
			13027
		],
		"mapped",
		[
			12488
		]
	],
	[
		[
			13028,
			13028
		],
		"mapped",
		[
			12490
		]
	],
	[
		[
			13029,
			13029
		],
		"mapped",
		[
			12491
		]
	],
	[
		[
			13030,
			13030
		],
		"mapped",
		[
			12492
		]
	],
	[
		[
			13031,
			13031
		],
		"mapped",
		[
			12493
		]
	],
	[
		[
			13032,
			13032
		],
		"mapped",
		[
			12494
		]
	],
	[
		[
			13033,
			13033
		],
		"mapped",
		[
			12495
		]
	],
	[
		[
			13034,
			13034
		],
		"mapped",
		[
			12498
		]
	],
	[
		[
			13035,
			13035
		],
		"mapped",
		[
			12501
		]
	],
	[
		[
			13036,
			13036
		],
		"mapped",
		[
			12504
		]
	],
	[
		[
			13037,
			13037
		],
		"mapped",
		[
			12507
		]
	],
	[
		[
			13038,
			13038
		],
		"mapped",
		[
			12510
		]
	],
	[
		[
			13039,
			13039
		],
		"mapped",
		[
			12511
		]
	],
	[
		[
			13040,
			13040
		],
		"mapped",
		[
			12512
		]
	],
	[
		[
			13041,
			13041
		],
		"mapped",
		[
			12513
		]
	],
	[
		[
			13042,
			13042
		],
		"mapped",
		[
			12514
		]
	],
	[
		[
			13043,
			13043
		],
		"mapped",
		[
			12516
		]
	],
	[
		[
			13044,
			13044
		],
		"mapped",
		[
			12518
		]
	],
	[
		[
			13045,
			13045
		],
		"mapped",
		[
			12520
		]
	],
	[
		[
			13046,
			13046
		],
		"mapped",
		[
			12521
		]
	],
	[
		[
			13047,
			13047
		],
		"mapped",
		[
			12522
		]
	],
	[
		[
			13048,
			13048
		],
		"mapped",
		[
			12523
		]
	],
	[
		[
			13049,
			13049
		],
		"mapped",
		[
			12524
		]
	],
	[
		[
			13050,
			13050
		],
		"mapped",
		[
			12525
		]
	],
	[
		[
			13051,
			13051
		],
		"mapped",
		[
			12527
		]
	],
	[
		[
			13052,
			13052
		],
		"mapped",
		[
			12528
		]
	],
	[
		[
			13053,
			13053
		],
		"mapped",
		[
			12529
		]
	],
	[
		[
			13054,
			13054
		],
		"mapped",
		[
			12530
		]
	],
	[
		[
			13055,
			13055
		],
		"disallowed"
	],
	[
		[
			13056,
			13056
		],
		"mapped",
		[
			12450,
			12497,
			12540,
			12488
		]
	],
	[
		[
			13057,
			13057
		],
		"mapped",
		[
			12450,
			12523,
			12501,
			12449
		]
	],
	[
		[
			13058,
			13058
		],
		"mapped",
		[
			12450,
			12531,
			12506,
			12450
		]
	],
	[
		[
			13059,
			13059
		],
		"mapped",
		[
			12450,
			12540,
			12523
		]
	],
	[
		[
			13060,
			13060
		],
		"mapped",
		[
			12452,
			12491,
			12531,
			12464
		]
	],
	[
		[
			13061,
			13061
		],
		"mapped",
		[
			12452,
			12531,
			12481
		]
	],
	[
		[
			13062,
			13062
		],
		"mapped",
		[
			12454,
			12457,
			12531
		]
	],
	[
		[
			13063,
			13063
		],
		"mapped",
		[
			12456,
			12473,
			12463,
			12540,
			12489
		]
	],
	[
		[
			13064,
			13064
		],
		"mapped",
		[
			12456,
			12540,
			12459,
			12540
		]
	],
	[
		[
			13065,
			13065
		],
		"mapped",
		[
			12458,
			12531,
			12473
		]
	],
	[
		[
			13066,
			13066
		],
		"mapped",
		[
			12458,
			12540,
			12512
		]
	],
	[
		[
			13067,
			13067
		],
		"mapped",
		[
			12459,
			12452,
			12522
		]
	],
	[
		[
			13068,
			13068
		],
		"mapped",
		[
			12459,
			12521,
			12483,
			12488
		]
	],
	[
		[
			13069,
			13069
		],
		"mapped",
		[
			12459,
			12525,
			12522,
			12540
		]
	],
	[
		[
			13070,
			13070
		],
		"mapped",
		[
			12460,
			12525,
			12531
		]
	],
	[
		[
			13071,
			13071
		],
		"mapped",
		[
			12460,
			12531,
			12510
		]
	],
	[
		[
			13072,
			13072
		],
		"mapped",
		[
			12462,
			12460
		]
	],
	[
		[
			13073,
			13073
		],
		"mapped",
		[
			12462,
			12491,
			12540
		]
	],
	[
		[
			13074,
			13074
		],
		"mapped",
		[
			12461,
			12517,
			12522,
			12540
		]
	],
	[
		[
			13075,
			13075
		],
		"mapped",
		[
			12462,
			12523,
			12480,
			12540
		]
	],
	[
		[
			13076,
			13076
		],
		"mapped",
		[
			12461,
			12525
		]
	],
	[
		[
			13077,
			13077
		],
		"mapped",
		[
			12461,
			12525,
			12464,
			12521,
			12512
		]
	],
	[
		[
			13078,
			13078
		],
		"mapped",
		[
			12461,
			12525,
			12513,
			12540,
			12488,
			12523
		]
	],
	[
		[
			13079,
			13079
		],
		"mapped",
		[
			12461,
			12525,
			12527,
			12483,
			12488
		]
	],
	[
		[
			13080,
			13080
		],
		"mapped",
		[
			12464,
			12521,
			12512
		]
	],
	[
		[
			13081,
			13081
		],
		"mapped",
		[
			12464,
			12521,
			12512,
			12488,
			12531
		]
	],
	[
		[
			13082,
			13082
		],
		"mapped",
		[
			12463,
			12523,
			12476,
			12452,
			12525
		]
	],
	[
		[
			13083,
			13083
		],
		"mapped",
		[
			12463,
			12525,
			12540,
			12493
		]
	],
	[
		[
			13084,
			13084
		],
		"mapped",
		[
			12465,
			12540,
			12473
		]
	],
	[
		[
			13085,
			13085
		],
		"mapped",
		[
			12467,
			12523,
			12490
		]
	],
	[
		[
			13086,
			13086
		],
		"mapped",
		[
			12467,
			12540,
			12509
		]
	],
	[
		[
			13087,
			13087
		],
		"mapped",
		[
			12469,
			12452,
			12463,
			12523
		]
	],
	[
		[
			13088,
			13088
		],
		"mapped",
		[
			12469,
			12531,
			12481,
			12540,
			12512
		]
	],
	[
		[
			13089,
			13089
		],
		"mapped",
		[
			12471,
			12522,
			12531,
			12464
		]
	],
	[
		[
			13090,
			13090
		],
		"mapped",
		[
			12475,
			12531,
			12481
		]
	],
	[
		[
			13091,
			13091
		],
		"mapped",
		[
			12475,
			12531,
			12488
		]
	],
	[
		[
			13092,
			13092
		],
		"mapped",
		[
			12480,
			12540,
			12473
		]
	],
	[
		[
			13093,
			13093
		],
		"mapped",
		[
			12487,
			12471
		]
	],
	[
		[
			13094,
			13094
		],
		"mapped",
		[
			12489,
			12523
		]
	],
	[
		[
			13095,
			13095
		],
		"mapped",
		[
			12488,
			12531
		]
	],
	[
		[
			13096,
			13096
		],
		"mapped",
		[
			12490,
			12494
		]
	],
	[
		[
			13097,
			13097
		],
		"mapped",
		[
			12494,
			12483,
			12488
		]
	],
	[
		[
			13098,
			13098
		],
		"mapped",
		[
			12495,
			12452,
			12484
		]
	],
	[
		[
			13099,
			13099
		],
		"mapped",
		[
			12497,
			12540,
			12475,
			12531,
			12488
		]
	],
	[
		[
			13100,
			13100
		],
		"mapped",
		[
			12497,
			12540,
			12484
		]
	],
	[
		[
			13101,
			13101
		],
		"mapped",
		[
			12496,
			12540,
			12524,
			12523
		]
	],
	[
		[
			13102,
			13102
		],
		"mapped",
		[
			12500,
			12450,
			12473,
			12488,
			12523
		]
	],
	[
		[
			13103,
			13103
		],
		"mapped",
		[
			12500,
			12463,
			12523
		]
	],
	[
		[
			13104,
			13104
		],
		"mapped",
		[
			12500,
			12467
		]
	],
	[
		[
			13105,
			13105
		],
		"mapped",
		[
			12499,
			12523
		]
	],
	[
		[
			13106,
			13106
		],
		"mapped",
		[
			12501,
			12449,
			12521,
			12483,
			12489
		]
	],
	[
		[
			13107,
			13107
		],
		"mapped",
		[
			12501,
			12451,
			12540,
			12488
		]
	],
	[
		[
			13108,
			13108
		],
		"mapped",
		[
			12502,
			12483,
			12471,
			12455,
			12523
		]
	],
	[
		[
			13109,
			13109
		],
		"mapped",
		[
			12501,
			12521,
			12531
		]
	],
	[
		[
			13110,
			13110
		],
		"mapped",
		[
			12504,
			12463,
			12479,
			12540,
			12523
		]
	],
	[
		[
			13111,
			13111
		],
		"mapped",
		[
			12506,
			12477
		]
	],
	[
		[
			13112,
			13112
		],
		"mapped",
		[
			12506,
			12491,
			12498
		]
	],
	[
		[
			13113,
			13113
		],
		"mapped",
		[
			12504,
			12523,
			12484
		]
	],
	[
		[
			13114,
			13114
		],
		"mapped",
		[
			12506,
			12531,
			12473
		]
	],
	[
		[
			13115,
			13115
		],
		"mapped",
		[
			12506,
			12540,
			12472
		]
	],
	[
		[
			13116,
			13116
		],
		"mapped",
		[
			12505,
			12540,
			12479
		]
	],
	[
		[
			13117,
			13117
		],
		"mapped",
		[
			12509,
			12452,
			12531,
			12488
		]
	],
	[
		[
			13118,
			13118
		],
		"mapped",
		[
			12508,
			12523,
			12488
		]
	],
	[
		[
			13119,
			13119
		],
		"mapped",
		[
			12507,
			12531
		]
	],
	[
		[
			13120,
			13120
		],
		"mapped",
		[
			12509,
			12531,
			12489
		]
	],
	[
		[
			13121,
			13121
		],
		"mapped",
		[
			12507,
			12540,
			12523
		]
	],
	[
		[
			13122,
			13122
		],
		"mapped",
		[
			12507,
			12540,
			12531
		]
	],
	[
		[
			13123,
			13123
		],
		"mapped",
		[
			12510,
			12452,
			12463,
			12525
		]
	],
	[
		[
			13124,
			13124
		],
		"mapped",
		[
			12510,
			12452,
			12523
		]
	],
	[
		[
			13125,
			13125
		],
		"mapped",
		[
			12510,
			12483,
			12495
		]
	],
	[
		[
			13126,
			13126
		],
		"mapped",
		[
			12510,
			12523,
			12463
		]
	],
	[
		[
			13127,
			13127
		],
		"mapped",
		[
			12510,
			12531,
			12471,
			12519,
			12531
		]
	],
	[
		[
			13128,
			13128
		],
		"mapped",
		[
			12511,
			12463,
			12525,
			12531
		]
	],
	[
		[
			13129,
			13129
		],
		"mapped",
		[
			12511,
			12522
		]
	],
	[
		[
			13130,
			13130
		],
		"mapped",
		[
			12511,
			12522,
			12496,
			12540,
			12523
		]
	],
	[
		[
			13131,
			13131
		],
		"mapped",
		[
			12513,
			12460
		]
	],
	[
		[
			13132,
			13132
		],
		"mapped",
		[
			12513,
			12460,
			12488,
			12531
		]
	],
	[
		[
			13133,
			13133
		],
		"mapped",
		[
			12513,
			12540,
			12488,
			12523
		]
	],
	[
		[
			13134,
			13134
		],
		"mapped",
		[
			12516,
			12540,
			12489
		]
	],
	[
		[
			13135,
			13135
		],
		"mapped",
		[
			12516,
			12540,
			12523
		]
	],
	[
		[
			13136,
			13136
		],
		"mapped",
		[
			12518,
			12450,
			12531
		]
	],
	[
		[
			13137,
			13137
		],
		"mapped",
		[
			12522,
			12483,
			12488,
			12523
		]
	],
	[
		[
			13138,
			13138
		],
		"mapped",
		[
			12522,
			12521
		]
	],
	[
		[
			13139,
			13139
		],
		"mapped",
		[
			12523,
			12500,
			12540
		]
	],
	[
		[
			13140,
			13140
		],
		"mapped",
		[
			12523,
			12540,
			12502,
			12523
		]
	],
	[
		[
			13141,
			13141
		],
		"mapped",
		[
			12524,
			12512
		]
	],
	[
		[
			13142,
			13142
		],
		"mapped",
		[
			12524,
			12531,
			12488,
			12466,
			12531
		]
	],
	[
		[
			13143,
			13143
		],
		"mapped",
		[
			12527,
			12483,
			12488
		]
	],
	[
		[
			13144,
			13144
		],
		"mapped",
		[
			48,
			28857
		]
	],
	[
		[
			13145,
			13145
		],
		"mapped",
		[
			49,
			28857
		]
	],
	[
		[
			13146,
			13146
		],
		"mapped",
		[
			50,
			28857
		]
	],
	[
		[
			13147,
			13147
		],
		"mapped",
		[
			51,
			28857
		]
	],
	[
		[
			13148,
			13148
		],
		"mapped",
		[
			52,
			28857
		]
	],
	[
		[
			13149,
			13149
		],
		"mapped",
		[
			53,
			28857
		]
	],
	[
		[
			13150,
			13150
		],
		"mapped",
		[
			54,
			28857
		]
	],
	[
		[
			13151,
			13151
		],
		"mapped",
		[
			55,
			28857
		]
	],
	[
		[
			13152,
			13152
		],
		"mapped",
		[
			56,
			28857
		]
	],
	[
		[
			13153,
			13153
		],
		"mapped",
		[
			57,
			28857
		]
	],
	[
		[
			13154,
			13154
		],
		"mapped",
		[
			49,
			48,
			28857
		]
	],
	[
		[
			13155,
			13155
		],
		"mapped",
		[
			49,
			49,
			28857
		]
	],
	[
		[
			13156,
			13156
		],
		"mapped",
		[
			49,
			50,
			28857
		]
	],
	[
		[
			13157,
			13157
		],
		"mapped",
		[
			49,
			51,
			28857
		]
	],
	[
		[
			13158,
			13158
		],
		"mapped",
		[
			49,
			52,
			28857
		]
	],
	[
		[
			13159,
			13159
		],
		"mapped",
		[
			49,
			53,
			28857
		]
	],
	[
		[
			13160,
			13160
		],
		"mapped",
		[
			49,
			54,
			28857
		]
	],
	[
		[
			13161,
			13161
		],
		"mapped",
		[
			49,
			55,
			28857
		]
	],
	[
		[
			13162,
			13162
		],
		"mapped",
		[
			49,
			56,
			28857
		]
	],
	[
		[
			13163,
			13163
		],
		"mapped",
		[
			49,
			57,
			28857
		]
	],
	[
		[
			13164,
			13164
		],
		"mapped",
		[
			50,
			48,
			28857
		]
	],
	[
		[
			13165,
			13165
		],
		"mapped",
		[
			50,
			49,
			28857
		]
	],
	[
		[
			13166,
			13166
		],
		"mapped",
		[
			50,
			50,
			28857
		]
	],
	[
		[
			13167,
			13167
		],
		"mapped",
		[
			50,
			51,
			28857
		]
	],
	[
		[
			13168,
			13168
		],
		"mapped",
		[
			50,
			52,
			28857
		]
	],
	[
		[
			13169,
			13169
		],
		"mapped",
		[
			104,
			112,
			97
		]
	],
	[
		[
			13170,
			13170
		],
		"mapped",
		[
			100,
			97
		]
	],
	[
		[
			13171,
			13171
		],
		"mapped",
		[
			97,
			117
		]
	],
	[
		[
			13172,
			13172
		],
		"mapped",
		[
			98,
			97,
			114
		]
	],
	[
		[
			13173,
			13173
		],
		"mapped",
		[
			111,
			118
		]
	],
	[
		[
			13174,
			13174
		],
		"mapped",
		[
			112,
			99
		]
	],
	[
		[
			13175,
			13175
		],
		"mapped",
		[
			100,
			109
		]
	],
	[
		[
			13176,
			13176
		],
		"mapped",
		[
			100,
			109,
			50
		]
	],
	[
		[
			13177,
			13177
		],
		"mapped",
		[
			100,
			109,
			51
		]
	],
	[
		[
			13178,
			13178
		],
		"mapped",
		[
			105,
			117
		]
	],
	[
		[
			13179,
			13179
		],
		"mapped",
		[
			24179,
			25104
		]
	],
	[
		[
			13180,
			13180
		],
		"mapped",
		[
			26157,
			21644
		]
	],
	[
		[
			13181,
			13181
		],
		"mapped",
		[
			22823,
			27491
		]
	],
	[
		[
			13182,
			13182
		],
		"mapped",
		[
			26126,
			27835
		]
	],
	[
		[
			13183,
			13183
		],
		"mapped",
		[
			26666,
			24335,
			20250,
			31038
		]
	],
	[
		[
			13184,
			13184
		],
		"mapped",
		[
			112,
			97
		]
	],
	[
		[
			13185,
			13185
		],
		"mapped",
		[
			110,
			97
		]
	],
	[
		[
			13186,
			13186
		],
		"mapped",
		[
			956,
			97
		]
	],
	[
		[
			13187,
			13187
		],
		"mapped",
		[
			109,
			97
		]
	],
	[
		[
			13188,
			13188
		],
		"mapped",
		[
			107,
			97
		]
	],
	[
		[
			13189,
			13189
		],
		"mapped",
		[
			107,
			98
		]
	],
	[
		[
			13190,
			13190
		],
		"mapped",
		[
			109,
			98
		]
	],
	[
		[
			13191,
			13191
		],
		"mapped",
		[
			103,
			98
		]
	],
	[
		[
			13192,
			13192
		],
		"mapped",
		[
			99,
			97,
			108
		]
	],
	[
		[
			13193,
			13193
		],
		"mapped",
		[
			107,
			99,
			97,
			108
		]
	],
	[
		[
			13194,
			13194
		],
		"mapped",
		[
			112,
			102
		]
	],
	[
		[
			13195,
			13195
		],
		"mapped",
		[
			110,
			102
		]
	],
	[
		[
			13196,
			13196
		],
		"mapped",
		[
			956,
			102
		]
	],
	[
		[
			13197,
			13197
		],
		"mapped",
		[
			956,
			103
		]
	],
	[
		[
			13198,
			13198
		],
		"mapped",
		[
			109,
			103
		]
	],
	[
		[
			13199,
			13199
		],
		"mapped",
		[
			107,
			103
		]
	],
	[
		[
			13200,
			13200
		],
		"mapped",
		[
			104,
			122
		]
	],
	[
		[
			13201,
			13201
		],
		"mapped",
		[
			107,
			104,
			122
		]
	],
	[
		[
			13202,
			13202
		],
		"mapped",
		[
			109,
			104,
			122
		]
	],
	[
		[
			13203,
			13203
		],
		"mapped",
		[
			103,
			104,
			122
		]
	],
	[
		[
			13204,
			13204
		],
		"mapped",
		[
			116,
			104,
			122
		]
	],
	[
		[
			13205,
			13205
		],
		"mapped",
		[
			956,
			108
		]
	],
	[
		[
			13206,
			13206
		],
		"mapped",
		[
			109,
			108
		]
	],
	[
		[
			13207,
			13207
		],
		"mapped",
		[
			100,
			108
		]
	],
	[
		[
			13208,
			13208
		],
		"mapped",
		[
			107,
			108
		]
	],
	[
		[
			13209,
			13209
		],
		"mapped",
		[
			102,
			109
		]
	],
	[
		[
			13210,
			13210
		],
		"mapped",
		[
			110,
			109
		]
	],
	[
		[
			13211,
			13211
		],
		"mapped",
		[
			956,
			109
		]
	],
	[
		[
			13212,
			13212
		],
		"mapped",
		[
			109,
			109
		]
	],
	[
		[
			13213,
			13213
		],
		"mapped",
		[
			99,
			109
		]
	],
	[
		[
			13214,
			13214
		],
		"mapped",
		[
			107,
			109
		]
	],
	[
		[
			13215,
			13215
		],
		"mapped",
		[
			109,
			109,
			50
		]
	],
	[
		[
			13216,
			13216
		],
		"mapped",
		[
			99,
			109,
			50
		]
	],
	[
		[
			13217,
			13217
		],
		"mapped",
		[
			109,
			50
		]
	],
	[
		[
			13218,
			13218
		],
		"mapped",
		[
			107,
			109,
			50
		]
	],
	[
		[
			13219,
			13219
		],
		"mapped",
		[
			109,
			109,
			51
		]
	],
	[
		[
			13220,
			13220
		],
		"mapped",
		[
			99,
			109,
			51
		]
	],
	[
		[
			13221,
			13221
		],
		"mapped",
		[
			109,
			51
		]
	],
	[
		[
			13222,
			13222
		],
		"mapped",
		[
			107,
			109,
			51
		]
	],
	[
		[
			13223,
			13223
		],
		"mapped",
		[
			109,
			8725,
			115
		]
	],
	[
		[
			13224,
			13224
		],
		"mapped",
		[
			109,
			8725,
			115,
			50
		]
	],
	[
		[
			13225,
			13225
		],
		"mapped",
		[
			112,
			97
		]
	],
	[
		[
			13226,
			13226
		],
		"mapped",
		[
			107,
			112,
			97
		]
	],
	[
		[
			13227,
			13227
		],
		"mapped",
		[
			109,
			112,
			97
		]
	],
	[
		[
			13228,
			13228
		],
		"mapped",
		[
			103,
			112,
			97
		]
	],
	[
		[
			13229,
			13229
		],
		"mapped",
		[
			114,
			97,
			100
		]
	],
	[
		[
			13230,
			13230
		],
		"mapped",
		[
			114,
			97,
			100,
			8725,
			115
		]
	],
	[
		[
			13231,
			13231
		],
		"mapped",
		[
			114,
			97,
			100,
			8725,
			115,
			50
		]
	],
	[
		[
			13232,
			13232
		],
		"mapped",
		[
			112,
			115
		]
	],
	[
		[
			13233,
			13233
		],
		"mapped",
		[
			110,
			115
		]
	],
	[
		[
			13234,
			13234
		],
		"mapped",
		[
			956,
			115
		]
	],
	[
		[
			13235,
			13235
		],
		"mapped",
		[
			109,
			115
		]
	],
	[
		[
			13236,
			13236
		],
		"mapped",
		[
			112,
			118
		]
	],
	[
		[
			13237,
			13237
		],
		"mapped",
		[
			110,
			118
		]
	],
	[
		[
			13238,
			13238
		],
		"mapped",
		[
			956,
			118
		]
	],
	[
		[
			13239,
			13239
		],
		"mapped",
		[
			109,
			118
		]
	],
	[
		[
			13240,
			13240
		],
		"mapped",
		[
			107,
			118
		]
	],
	[
		[
			13241,
			13241
		],
		"mapped",
		[
			109,
			118
		]
	],
	[
		[
			13242,
			13242
		],
		"mapped",
		[
			112,
			119
		]
	],
	[
		[
			13243,
			13243
		],
		"mapped",
		[
			110,
			119
		]
	],
	[
		[
			13244,
			13244
		],
		"mapped",
		[
			956,
			119
		]
	],
	[
		[
			13245,
			13245
		],
		"mapped",
		[
			109,
			119
		]
	],
	[
		[
			13246,
			13246
		],
		"mapped",
		[
			107,
			119
		]
	],
	[
		[
			13247,
			13247
		],
		"mapped",
		[
			109,
			119
		]
	],
	[
		[
			13248,
			13248
		],
		"mapped",
		[
			107,
			969
		]
	],
	[
		[
			13249,
			13249
		],
		"mapped",
		[
			109,
			969
		]
	],
	[
		[
			13250,
			13250
		],
		"disallowed"
	],
	[
		[
			13251,
			13251
		],
		"mapped",
		[
			98,
			113
		]
	],
	[
		[
			13252,
			13252
		],
		"mapped",
		[
			99,
			99
		]
	],
	[
		[
			13253,
			13253
		],
		"mapped",
		[
			99,
			100
		]
	],
	[
		[
			13254,
			13254
		],
		"mapped",
		[
			99,
			8725,
			107,
			103
		]
	],
	[
		[
			13255,
			13255
		],
		"disallowed"
	],
	[
		[
			13256,
			13256
		],
		"mapped",
		[
			100,
			98
		]
	],
	[
		[
			13257,
			13257
		],
		"mapped",
		[
			103,
			121
		]
	],
	[
		[
			13258,
			13258
		],
		"mapped",
		[
			104,
			97
		]
	],
	[
		[
			13259,
			13259
		],
		"mapped",
		[
			104,
			112
		]
	],
	[
		[
			13260,
			13260
		],
		"mapped",
		[
			105,
			110
		]
	],
	[
		[
			13261,
			13261
		],
		"mapped",
		[
			107,
			107
		]
	],
	[
		[
			13262,
			13262
		],
		"mapped",
		[
			107,
			109
		]
	],
	[
		[
			13263,
			13263
		],
		"mapped",
		[
			107,
			116
		]
	],
	[
		[
			13264,
			13264
		],
		"mapped",
		[
			108,
			109
		]
	],
	[
		[
			13265,
			13265
		],
		"mapped",
		[
			108,
			110
		]
	],
	[
		[
			13266,
			13266
		],
		"mapped",
		[
			108,
			111,
			103
		]
	],
	[
		[
			13267,
			13267
		],
		"mapped",
		[
			108,
			120
		]
	],
	[
		[
			13268,
			13268
		],
		"mapped",
		[
			109,
			98
		]
	],
	[
		[
			13269,
			13269
		],
		"mapped",
		[
			109,
			105,
			108
		]
	],
	[
		[
			13270,
			13270
		],
		"mapped",
		[
			109,
			111,
			108
		]
	],
	[
		[
			13271,
			13271
		],
		"mapped",
		[
			112,
			104
		]
	],
	[
		[
			13272,
			13272
		],
		"disallowed"
	],
	[
		[
			13273,
			13273
		],
		"mapped",
		[
			112,
			112,
			109
		]
	],
	[
		[
			13274,
			13274
		],
		"mapped",
		[
			112,
			114
		]
	],
	[
		[
			13275,
			13275
		],
		"mapped",
		[
			115,
			114
		]
	],
	[
		[
			13276,
			13276
		],
		"mapped",
		[
			115,
			118
		]
	],
	[
		[
			13277,
			13277
		],
		"mapped",
		[
			119,
			98
		]
	],
	[
		[
			13278,
			13278
		],
		"mapped",
		[
			118,
			8725,
			109
		]
	],
	[
		[
			13279,
			13279
		],
		"mapped",
		[
			97,
			8725,
			109
		]
	],
	[
		[
			13280,
			13280
		],
		"mapped",
		[
			49,
			26085
		]
	],
	[
		[
			13281,
			13281
		],
		"mapped",
		[
			50,
			26085
		]
	],
	[
		[
			13282,
			13282
		],
		"mapped",
		[
			51,
			26085
		]
	],
	[
		[
			13283,
			13283
		],
		"mapped",
		[
			52,
			26085
		]
	],
	[
		[
			13284,
			13284
		],
		"mapped",
		[
			53,
			26085
		]
	],
	[
		[
			13285,
			13285
		],
		"mapped",
		[
			54,
			26085
		]
	],
	[
		[
			13286,
			13286
		],
		"mapped",
		[
			55,
			26085
		]
	],
	[
		[
			13287,
			13287
		],
		"mapped",
		[
			56,
			26085
		]
	],
	[
		[
			13288,
			13288
		],
		"mapped",
		[
			57,
			26085
		]
	],
	[
		[
			13289,
			13289
		],
		"mapped",
		[
			49,
			48,
			26085
		]
	],
	[
		[
			13290,
			13290
		],
		"mapped",
		[
			49,
			49,
			26085
		]
	],
	[
		[
			13291,
			13291
		],
		"mapped",
		[
			49,
			50,
			26085
		]
	],
	[
		[
			13292,
			13292
		],
		"mapped",
		[
			49,
			51,
			26085
		]
	],
	[
		[
			13293,
			13293
		],
		"mapped",
		[
			49,
			52,
			26085
		]
	],
	[
		[
			13294,
			13294
		],
		"mapped",
		[
			49,
			53,
			26085
		]
	],
	[
		[
			13295,
			13295
		],
		"mapped",
		[
			49,
			54,
			26085
		]
	],
	[
		[
			13296,
			13296
		],
		"mapped",
		[
			49,
			55,
			26085
		]
	],
	[
		[
			13297,
			13297
		],
		"mapped",
		[
			49,
			56,
			26085
		]
	],
	[
		[
			13298,
			13298
		],
		"mapped",
		[
			49,
			57,
			26085
		]
	],
	[
		[
			13299,
			13299
		],
		"mapped",
		[
			50,
			48,
			26085
		]
	],
	[
		[
			13300,
			13300
		],
		"mapped",
		[
			50,
			49,
			26085
		]
	],
	[
		[
			13301,
			13301
		],
		"mapped",
		[
			50,
			50,
			26085
		]
	],
	[
		[
			13302,
			13302
		],
		"mapped",
		[
			50,
			51,
			26085
		]
	],
	[
		[
			13303,
			13303
		],
		"mapped",
		[
			50,
			52,
			26085
		]
	],
	[
		[
			13304,
			13304
		],
		"mapped",
		[
			50,
			53,
			26085
		]
	],
	[
		[
			13305,
			13305
		],
		"mapped",
		[
			50,
			54,
			26085
		]
	],
	[
		[
			13306,
			13306
		],
		"mapped",
		[
			50,
			55,
			26085
		]
	],
	[
		[
			13307,
			13307
		],
		"mapped",
		[
			50,
			56,
			26085
		]
	],
	[
		[
			13308,
			13308
		],
		"mapped",
		[
			50,
			57,
			26085
		]
	],
	[
		[
			13309,
			13309
		],
		"mapped",
		[
			51,
			48,
			26085
		]
	],
	[
		[
			13310,
			13310
		],
		"mapped",
		[
			51,
			49,
			26085
		]
	],
	[
		[
			13311,
			13311
		],
		"mapped",
		[
			103,
			97,
			108
		]
	],
	[
		[
			13312,
			19893
		],
		"valid"
	],
	[
		[
			19894,
			19903
		],
		"disallowed"
	],
	[
		[
			19904,
			19967
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			19968,
			40869
		],
		"valid"
	],
	[
		[
			40870,
			40891
		],
		"valid"
	],
	[
		[
			40892,
			40899
		],
		"valid"
	],
	[
		[
			40900,
			40907
		],
		"valid"
	],
	[
		[
			40908,
			40908
		],
		"valid"
	],
	[
		[
			40909,
			40917
		],
		"valid"
	],
	[
		[
			40918,
			40959
		],
		"disallowed"
	],
	[
		[
			40960,
			42124
		],
		"valid"
	],
	[
		[
			42125,
			42127
		],
		"disallowed"
	],
	[
		[
			42128,
			42145
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42146,
			42147
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42148,
			42163
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42164,
			42164
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42165,
			42176
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42177,
			42177
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42178,
			42180
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42181,
			42181
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42182,
			42182
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42183,
			42191
		],
		"disallowed"
	],
	[
		[
			42192,
			42237
		],
		"valid"
	],
	[
		[
			42238,
			42239
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42240,
			42508
		],
		"valid"
	],
	[
		[
			42509,
			42511
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42512,
			42539
		],
		"valid"
	],
	[
		[
			42540,
			42559
		],
		"disallowed"
	],
	[
		[
			42560,
			42560
		],
		"mapped",
		[
			42561
		]
	],
	[
		[
			42561,
			42561
		],
		"valid"
	],
	[
		[
			42562,
			42562
		],
		"mapped",
		[
			42563
		]
	],
	[
		[
			42563,
			42563
		],
		"valid"
	],
	[
		[
			42564,
			42564
		],
		"mapped",
		[
			42565
		]
	],
	[
		[
			42565,
			42565
		],
		"valid"
	],
	[
		[
			42566,
			42566
		],
		"mapped",
		[
			42567
		]
	],
	[
		[
			42567,
			42567
		],
		"valid"
	],
	[
		[
			42568,
			42568
		],
		"mapped",
		[
			42569
		]
	],
	[
		[
			42569,
			42569
		],
		"valid"
	],
	[
		[
			42570,
			42570
		],
		"mapped",
		[
			42571
		]
	],
	[
		[
			42571,
			42571
		],
		"valid"
	],
	[
		[
			42572,
			42572
		],
		"mapped",
		[
			42573
		]
	],
	[
		[
			42573,
			42573
		],
		"valid"
	],
	[
		[
			42574,
			42574
		],
		"mapped",
		[
			42575
		]
	],
	[
		[
			42575,
			42575
		],
		"valid"
	],
	[
		[
			42576,
			42576
		],
		"mapped",
		[
			42577
		]
	],
	[
		[
			42577,
			42577
		],
		"valid"
	],
	[
		[
			42578,
			42578
		],
		"mapped",
		[
			42579
		]
	],
	[
		[
			42579,
			42579
		],
		"valid"
	],
	[
		[
			42580,
			42580
		],
		"mapped",
		[
			42581
		]
	],
	[
		[
			42581,
			42581
		],
		"valid"
	],
	[
		[
			42582,
			42582
		],
		"mapped",
		[
			42583
		]
	],
	[
		[
			42583,
			42583
		],
		"valid"
	],
	[
		[
			42584,
			42584
		],
		"mapped",
		[
			42585
		]
	],
	[
		[
			42585,
			42585
		],
		"valid"
	],
	[
		[
			42586,
			42586
		],
		"mapped",
		[
			42587
		]
	],
	[
		[
			42587,
			42587
		],
		"valid"
	],
	[
		[
			42588,
			42588
		],
		"mapped",
		[
			42589
		]
	],
	[
		[
			42589,
			42589
		],
		"valid"
	],
	[
		[
			42590,
			42590
		],
		"mapped",
		[
			42591
		]
	],
	[
		[
			42591,
			42591
		],
		"valid"
	],
	[
		[
			42592,
			42592
		],
		"mapped",
		[
			42593
		]
	],
	[
		[
			42593,
			42593
		],
		"valid"
	],
	[
		[
			42594,
			42594
		],
		"mapped",
		[
			42595
		]
	],
	[
		[
			42595,
			42595
		],
		"valid"
	],
	[
		[
			42596,
			42596
		],
		"mapped",
		[
			42597
		]
	],
	[
		[
			42597,
			42597
		],
		"valid"
	],
	[
		[
			42598,
			42598
		],
		"mapped",
		[
			42599
		]
	],
	[
		[
			42599,
			42599
		],
		"valid"
	],
	[
		[
			42600,
			42600
		],
		"mapped",
		[
			42601
		]
	],
	[
		[
			42601,
			42601
		],
		"valid"
	],
	[
		[
			42602,
			42602
		],
		"mapped",
		[
			42603
		]
	],
	[
		[
			42603,
			42603
		],
		"valid"
	],
	[
		[
			42604,
			42604
		],
		"mapped",
		[
			42605
		]
	],
	[
		[
			42605,
			42607
		],
		"valid"
	],
	[
		[
			42608,
			42611
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42612,
			42619
		],
		"valid"
	],
	[
		[
			42620,
			42621
		],
		"valid"
	],
	[
		[
			42622,
			42622
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42623,
			42623
		],
		"valid"
	],
	[
		[
			42624,
			42624
		],
		"mapped",
		[
			42625
		]
	],
	[
		[
			42625,
			42625
		],
		"valid"
	],
	[
		[
			42626,
			42626
		],
		"mapped",
		[
			42627
		]
	],
	[
		[
			42627,
			42627
		],
		"valid"
	],
	[
		[
			42628,
			42628
		],
		"mapped",
		[
			42629
		]
	],
	[
		[
			42629,
			42629
		],
		"valid"
	],
	[
		[
			42630,
			42630
		],
		"mapped",
		[
			42631
		]
	],
	[
		[
			42631,
			42631
		],
		"valid"
	],
	[
		[
			42632,
			42632
		],
		"mapped",
		[
			42633
		]
	],
	[
		[
			42633,
			42633
		],
		"valid"
	],
	[
		[
			42634,
			42634
		],
		"mapped",
		[
			42635
		]
	],
	[
		[
			42635,
			42635
		],
		"valid"
	],
	[
		[
			42636,
			42636
		],
		"mapped",
		[
			42637
		]
	],
	[
		[
			42637,
			42637
		],
		"valid"
	],
	[
		[
			42638,
			42638
		],
		"mapped",
		[
			42639
		]
	],
	[
		[
			42639,
			42639
		],
		"valid"
	],
	[
		[
			42640,
			42640
		],
		"mapped",
		[
			42641
		]
	],
	[
		[
			42641,
			42641
		],
		"valid"
	],
	[
		[
			42642,
			42642
		],
		"mapped",
		[
			42643
		]
	],
	[
		[
			42643,
			42643
		],
		"valid"
	],
	[
		[
			42644,
			42644
		],
		"mapped",
		[
			42645
		]
	],
	[
		[
			42645,
			42645
		],
		"valid"
	],
	[
		[
			42646,
			42646
		],
		"mapped",
		[
			42647
		]
	],
	[
		[
			42647,
			42647
		],
		"valid"
	],
	[
		[
			42648,
			42648
		],
		"mapped",
		[
			42649
		]
	],
	[
		[
			42649,
			42649
		],
		"valid"
	],
	[
		[
			42650,
			42650
		],
		"mapped",
		[
			42651
		]
	],
	[
		[
			42651,
			42651
		],
		"valid"
	],
	[
		[
			42652,
			42652
		],
		"mapped",
		[
			1098
		]
	],
	[
		[
			42653,
			42653
		],
		"mapped",
		[
			1100
		]
	],
	[
		[
			42654,
			42654
		],
		"valid"
	],
	[
		[
			42655,
			42655
		],
		"valid"
	],
	[
		[
			42656,
			42725
		],
		"valid"
	],
	[
		[
			42726,
			42735
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42736,
			42737
		],
		"valid"
	],
	[
		[
			42738,
			42743
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42744,
			42751
		],
		"disallowed"
	],
	[
		[
			42752,
			42774
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42775,
			42778
		],
		"valid"
	],
	[
		[
			42779,
			42783
		],
		"valid"
	],
	[
		[
			42784,
			42785
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42786,
			42786
		],
		"mapped",
		[
			42787
		]
	],
	[
		[
			42787,
			42787
		],
		"valid"
	],
	[
		[
			42788,
			42788
		],
		"mapped",
		[
			42789
		]
	],
	[
		[
			42789,
			42789
		],
		"valid"
	],
	[
		[
			42790,
			42790
		],
		"mapped",
		[
			42791
		]
	],
	[
		[
			42791,
			42791
		],
		"valid"
	],
	[
		[
			42792,
			42792
		],
		"mapped",
		[
			42793
		]
	],
	[
		[
			42793,
			42793
		],
		"valid"
	],
	[
		[
			42794,
			42794
		],
		"mapped",
		[
			42795
		]
	],
	[
		[
			42795,
			42795
		],
		"valid"
	],
	[
		[
			42796,
			42796
		],
		"mapped",
		[
			42797
		]
	],
	[
		[
			42797,
			42797
		],
		"valid"
	],
	[
		[
			42798,
			42798
		],
		"mapped",
		[
			42799
		]
	],
	[
		[
			42799,
			42801
		],
		"valid"
	],
	[
		[
			42802,
			42802
		],
		"mapped",
		[
			42803
		]
	],
	[
		[
			42803,
			42803
		],
		"valid"
	],
	[
		[
			42804,
			42804
		],
		"mapped",
		[
			42805
		]
	],
	[
		[
			42805,
			42805
		],
		"valid"
	],
	[
		[
			42806,
			42806
		],
		"mapped",
		[
			42807
		]
	],
	[
		[
			42807,
			42807
		],
		"valid"
	],
	[
		[
			42808,
			42808
		],
		"mapped",
		[
			42809
		]
	],
	[
		[
			42809,
			42809
		],
		"valid"
	],
	[
		[
			42810,
			42810
		],
		"mapped",
		[
			42811
		]
	],
	[
		[
			42811,
			42811
		],
		"valid"
	],
	[
		[
			42812,
			42812
		],
		"mapped",
		[
			42813
		]
	],
	[
		[
			42813,
			42813
		],
		"valid"
	],
	[
		[
			42814,
			42814
		],
		"mapped",
		[
			42815
		]
	],
	[
		[
			42815,
			42815
		],
		"valid"
	],
	[
		[
			42816,
			42816
		],
		"mapped",
		[
			42817
		]
	],
	[
		[
			42817,
			42817
		],
		"valid"
	],
	[
		[
			42818,
			42818
		],
		"mapped",
		[
			42819
		]
	],
	[
		[
			42819,
			42819
		],
		"valid"
	],
	[
		[
			42820,
			42820
		],
		"mapped",
		[
			42821
		]
	],
	[
		[
			42821,
			42821
		],
		"valid"
	],
	[
		[
			42822,
			42822
		],
		"mapped",
		[
			42823
		]
	],
	[
		[
			42823,
			42823
		],
		"valid"
	],
	[
		[
			42824,
			42824
		],
		"mapped",
		[
			42825
		]
	],
	[
		[
			42825,
			42825
		],
		"valid"
	],
	[
		[
			42826,
			42826
		],
		"mapped",
		[
			42827
		]
	],
	[
		[
			42827,
			42827
		],
		"valid"
	],
	[
		[
			42828,
			42828
		],
		"mapped",
		[
			42829
		]
	],
	[
		[
			42829,
			42829
		],
		"valid"
	],
	[
		[
			42830,
			42830
		],
		"mapped",
		[
			42831
		]
	],
	[
		[
			42831,
			42831
		],
		"valid"
	],
	[
		[
			42832,
			42832
		],
		"mapped",
		[
			42833
		]
	],
	[
		[
			42833,
			42833
		],
		"valid"
	],
	[
		[
			42834,
			42834
		],
		"mapped",
		[
			42835
		]
	],
	[
		[
			42835,
			42835
		],
		"valid"
	],
	[
		[
			42836,
			42836
		],
		"mapped",
		[
			42837
		]
	],
	[
		[
			42837,
			42837
		],
		"valid"
	],
	[
		[
			42838,
			42838
		],
		"mapped",
		[
			42839
		]
	],
	[
		[
			42839,
			42839
		],
		"valid"
	],
	[
		[
			42840,
			42840
		],
		"mapped",
		[
			42841
		]
	],
	[
		[
			42841,
			42841
		],
		"valid"
	],
	[
		[
			42842,
			42842
		],
		"mapped",
		[
			42843
		]
	],
	[
		[
			42843,
			42843
		],
		"valid"
	],
	[
		[
			42844,
			42844
		],
		"mapped",
		[
			42845
		]
	],
	[
		[
			42845,
			42845
		],
		"valid"
	],
	[
		[
			42846,
			42846
		],
		"mapped",
		[
			42847
		]
	],
	[
		[
			42847,
			42847
		],
		"valid"
	],
	[
		[
			42848,
			42848
		],
		"mapped",
		[
			42849
		]
	],
	[
		[
			42849,
			42849
		],
		"valid"
	],
	[
		[
			42850,
			42850
		],
		"mapped",
		[
			42851
		]
	],
	[
		[
			42851,
			42851
		],
		"valid"
	],
	[
		[
			42852,
			42852
		],
		"mapped",
		[
			42853
		]
	],
	[
		[
			42853,
			42853
		],
		"valid"
	],
	[
		[
			42854,
			42854
		],
		"mapped",
		[
			42855
		]
	],
	[
		[
			42855,
			42855
		],
		"valid"
	],
	[
		[
			42856,
			42856
		],
		"mapped",
		[
			42857
		]
	],
	[
		[
			42857,
			42857
		],
		"valid"
	],
	[
		[
			42858,
			42858
		],
		"mapped",
		[
			42859
		]
	],
	[
		[
			42859,
			42859
		],
		"valid"
	],
	[
		[
			42860,
			42860
		],
		"mapped",
		[
			42861
		]
	],
	[
		[
			42861,
			42861
		],
		"valid"
	],
	[
		[
			42862,
			42862
		],
		"mapped",
		[
			42863
		]
	],
	[
		[
			42863,
			42863
		],
		"valid"
	],
	[
		[
			42864,
			42864
		],
		"mapped",
		[
			42863
		]
	],
	[
		[
			42865,
			42872
		],
		"valid"
	],
	[
		[
			42873,
			42873
		],
		"mapped",
		[
			42874
		]
	],
	[
		[
			42874,
			42874
		],
		"valid"
	],
	[
		[
			42875,
			42875
		],
		"mapped",
		[
			42876
		]
	],
	[
		[
			42876,
			42876
		],
		"valid"
	],
	[
		[
			42877,
			42877
		],
		"mapped",
		[
			7545
		]
	],
	[
		[
			42878,
			42878
		],
		"mapped",
		[
			42879
		]
	],
	[
		[
			42879,
			42879
		],
		"valid"
	],
	[
		[
			42880,
			42880
		],
		"mapped",
		[
			42881
		]
	],
	[
		[
			42881,
			42881
		],
		"valid"
	],
	[
		[
			42882,
			42882
		],
		"mapped",
		[
			42883
		]
	],
	[
		[
			42883,
			42883
		],
		"valid"
	],
	[
		[
			42884,
			42884
		],
		"mapped",
		[
			42885
		]
	],
	[
		[
			42885,
			42885
		],
		"valid"
	],
	[
		[
			42886,
			42886
		],
		"mapped",
		[
			42887
		]
	],
	[
		[
			42887,
			42888
		],
		"valid"
	],
	[
		[
			42889,
			42890
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			42891,
			42891
		],
		"mapped",
		[
			42892
		]
	],
	[
		[
			42892,
			42892
		],
		"valid"
	],
	[
		[
			42893,
			42893
		],
		"mapped",
		[
			613
		]
	],
	[
		[
			42894,
			42894
		],
		"valid"
	],
	[
		[
			42895,
			42895
		],
		"valid"
	],
	[
		[
			42896,
			42896
		],
		"mapped",
		[
			42897
		]
	],
	[
		[
			42897,
			42897
		],
		"valid"
	],
	[
		[
			42898,
			42898
		],
		"mapped",
		[
			42899
		]
	],
	[
		[
			42899,
			42899
		],
		"valid"
	],
	[
		[
			42900,
			42901
		],
		"valid"
	],
	[
		[
			42902,
			42902
		],
		"mapped",
		[
			42903
		]
	],
	[
		[
			42903,
			42903
		],
		"valid"
	],
	[
		[
			42904,
			42904
		],
		"mapped",
		[
			42905
		]
	],
	[
		[
			42905,
			42905
		],
		"valid"
	],
	[
		[
			42906,
			42906
		],
		"mapped",
		[
			42907
		]
	],
	[
		[
			42907,
			42907
		],
		"valid"
	],
	[
		[
			42908,
			42908
		],
		"mapped",
		[
			42909
		]
	],
	[
		[
			42909,
			42909
		],
		"valid"
	],
	[
		[
			42910,
			42910
		],
		"mapped",
		[
			42911
		]
	],
	[
		[
			42911,
			42911
		],
		"valid"
	],
	[
		[
			42912,
			42912
		],
		"mapped",
		[
			42913
		]
	],
	[
		[
			42913,
			42913
		],
		"valid"
	],
	[
		[
			42914,
			42914
		],
		"mapped",
		[
			42915
		]
	],
	[
		[
			42915,
			42915
		],
		"valid"
	],
	[
		[
			42916,
			42916
		],
		"mapped",
		[
			42917
		]
	],
	[
		[
			42917,
			42917
		],
		"valid"
	],
	[
		[
			42918,
			42918
		],
		"mapped",
		[
			42919
		]
	],
	[
		[
			42919,
			42919
		],
		"valid"
	],
	[
		[
			42920,
			42920
		],
		"mapped",
		[
			42921
		]
	],
	[
		[
			42921,
			42921
		],
		"valid"
	],
	[
		[
			42922,
			42922
		],
		"mapped",
		[
			614
		]
	],
	[
		[
			42923,
			42923
		],
		"mapped",
		[
			604
		]
	],
	[
		[
			42924,
			42924
		],
		"mapped",
		[
			609
		]
	],
	[
		[
			42925,
			42925
		],
		"mapped",
		[
			620
		]
	],
	[
		[
			42926,
			42927
		],
		"disallowed"
	],
	[
		[
			42928,
			42928
		],
		"mapped",
		[
			670
		]
	],
	[
		[
			42929,
			42929
		],
		"mapped",
		[
			647
		]
	],
	[
		[
			42930,
			42930
		],
		"mapped",
		[
			669
		]
	],
	[
		[
			42931,
			42931
		],
		"mapped",
		[
			43859
		]
	],
	[
		[
			42932,
			42932
		],
		"mapped",
		[
			42933
		]
	],
	[
		[
			42933,
			42933
		],
		"valid"
	],
	[
		[
			42934,
			42934
		],
		"mapped",
		[
			42935
		]
	],
	[
		[
			42935,
			42935
		],
		"valid"
	],
	[
		[
			42936,
			42998
		],
		"disallowed"
	],
	[
		[
			42999,
			42999
		],
		"valid"
	],
	[
		[
			43000,
			43000
		],
		"mapped",
		[
			295
		]
	],
	[
		[
			43001,
			43001
		],
		"mapped",
		[
			339
		]
	],
	[
		[
			43002,
			43002
		],
		"valid"
	],
	[
		[
			43003,
			43007
		],
		"valid"
	],
	[
		[
			43008,
			43047
		],
		"valid"
	],
	[
		[
			43048,
			43051
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43052,
			43055
		],
		"disallowed"
	],
	[
		[
			43056,
			43065
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43066,
			43071
		],
		"disallowed"
	],
	[
		[
			43072,
			43123
		],
		"valid"
	],
	[
		[
			43124,
			43127
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43128,
			43135
		],
		"disallowed"
	],
	[
		[
			43136,
			43204
		],
		"valid"
	],
	[
		[
			43205,
			43213
		],
		"disallowed"
	],
	[
		[
			43214,
			43215
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43216,
			43225
		],
		"valid"
	],
	[
		[
			43226,
			43231
		],
		"disallowed"
	],
	[
		[
			43232,
			43255
		],
		"valid"
	],
	[
		[
			43256,
			43258
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43259,
			43259
		],
		"valid"
	],
	[
		[
			43260,
			43260
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43261,
			43261
		],
		"valid"
	],
	[
		[
			43262,
			43263
		],
		"disallowed"
	],
	[
		[
			43264,
			43309
		],
		"valid"
	],
	[
		[
			43310,
			43311
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43312,
			43347
		],
		"valid"
	],
	[
		[
			43348,
			43358
		],
		"disallowed"
	],
	[
		[
			43359,
			43359
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43360,
			43388
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43389,
			43391
		],
		"disallowed"
	],
	[
		[
			43392,
			43456
		],
		"valid"
	],
	[
		[
			43457,
			43469
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43470,
			43470
		],
		"disallowed"
	],
	[
		[
			43471,
			43481
		],
		"valid"
	],
	[
		[
			43482,
			43485
		],
		"disallowed"
	],
	[
		[
			43486,
			43487
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43488,
			43518
		],
		"valid"
	],
	[
		[
			43519,
			43519
		],
		"disallowed"
	],
	[
		[
			43520,
			43574
		],
		"valid"
	],
	[
		[
			43575,
			43583
		],
		"disallowed"
	],
	[
		[
			43584,
			43597
		],
		"valid"
	],
	[
		[
			43598,
			43599
		],
		"disallowed"
	],
	[
		[
			43600,
			43609
		],
		"valid"
	],
	[
		[
			43610,
			43611
		],
		"disallowed"
	],
	[
		[
			43612,
			43615
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43616,
			43638
		],
		"valid"
	],
	[
		[
			43639,
			43641
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43642,
			43643
		],
		"valid"
	],
	[
		[
			43644,
			43647
		],
		"valid"
	],
	[
		[
			43648,
			43714
		],
		"valid"
	],
	[
		[
			43715,
			43738
		],
		"disallowed"
	],
	[
		[
			43739,
			43741
		],
		"valid"
	],
	[
		[
			43742,
			43743
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43744,
			43759
		],
		"valid"
	],
	[
		[
			43760,
			43761
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43762,
			43766
		],
		"valid"
	],
	[
		[
			43767,
			43776
		],
		"disallowed"
	],
	[
		[
			43777,
			43782
		],
		"valid"
	],
	[
		[
			43783,
			43784
		],
		"disallowed"
	],
	[
		[
			43785,
			43790
		],
		"valid"
	],
	[
		[
			43791,
			43792
		],
		"disallowed"
	],
	[
		[
			43793,
			43798
		],
		"valid"
	],
	[
		[
			43799,
			43807
		],
		"disallowed"
	],
	[
		[
			43808,
			43814
		],
		"valid"
	],
	[
		[
			43815,
			43815
		],
		"disallowed"
	],
	[
		[
			43816,
			43822
		],
		"valid"
	],
	[
		[
			43823,
			43823
		],
		"disallowed"
	],
	[
		[
			43824,
			43866
		],
		"valid"
	],
	[
		[
			43867,
			43867
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			43868,
			43868
		],
		"mapped",
		[
			42791
		]
	],
	[
		[
			43869,
			43869
		],
		"mapped",
		[
			43831
		]
	],
	[
		[
			43870,
			43870
		],
		"mapped",
		[
			619
		]
	],
	[
		[
			43871,
			43871
		],
		"mapped",
		[
			43858
		]
	],
	[
		[
			43872,
			43875
		],
		"valid"
	],
	[
		[
			43876,
			43877
		],
		"valid"
	],
	[
		[
			43878,
			43887
		],
		"disallowed"
	],
	[
		[
			43888,
			43888
		],
		"mapped",
		[
			5024
		]
	],
	[
		[
			43889,
			43889
		],
		"mapped",
		[
			5025
		]
	],
	[
		[
			43890,
			43890
		],
		"mapped",
		[
			5026
		]
	],
	[
		[
			43891,
			43891
		],
		"mapped",
		[
			5027
		]
	],
	[
		[
			43892,
			43892
		],
		"mapped",
		[
			5028
		]
	],
	[
		[
			43893,
			43893
		],
		"mapped",
		[
			5029
		]
	],
	[
		[
			43894,
			43894
		],
		"mapped",
		[
			5030
		]
	],
	[
		[
			43895,
			43895
		],
		"mapped",
		[
			5031
		]
	],
	[
		[
			43896,
			43896
		],
		"mapped",
		[
			5032
		]
	],
	[
		[
			43897,
			43897
		],
		"mapped",
		[
			5033
		]
	],
	[
		[
			43898,
			43898
		],
		"mapped",
		[
			5034
		]
	],
	[
		[
			43899,
			43899
		],
		"mapped",
		[
			5035
		]
	],
	[
		[
			43900,
			43900
		],
		"mapped",
		[
			5036
		]
	],
	[
		[
			43901,
			43901
		],
		"mapped",
		[
			5037
		]
	],
	[
		[
			43902,
			43902
		],
		"mapped",
		[
			5038
		]
	],
	[
		[
			43903,
			43903
		],
		"mapped",
		[
			5039
		]
	],
	[
		[
			43904,
			43904
		],
		"mapped",
		[
			5040
		]
	],
	[
		[
			43905,
			43905
		],
		"mapped",
		[
			5041
		]
	],
	[
		[
			43906,
			43906
		],
		"mapped",
		[
			5042
		]
	],
	[
		[
			43907,
			43907
		],
		"mapped",
		[
			5043
		]
	],
	[
		[
			43908,
			43908
		],
		"mapped",
		[
			5044
		]
	],
	[
		[
			43909,
			43909
		],
		"mapped",
		[
			5045
		]
	],
	[
		[
			43910,
			43910
		],
		"mapped",
		[
			5046
		]
	],
	[
		[
			43911,
			43911
		],
		"mapped",
		[
			5047
		]
	],
	[
		[
			43912,
			43912
		],
		"mapped",
		[
			5048
		]
	],
	[
		[
			43913,
			43913
		],
		"mapped",
		[
			5049
		]
	],
	[
		[
			43914,
			43914
		],
		"mapped",
		[
			5050
		]
	],
	[
		[
			43915,
			43915
		],
		"mapped",
		[
			5051
		]
	],
	[
		[
			43916,
			43916
		],
		"mapped",
		[
			5052
		]
	],
	[
		[
			43917,
			43917
		],
		"mapped",
		[
			5053
		]
	],
	[
		[
			43918,
			43918
		],
		"mapped",
		[
			5054
		]
	],
	[
		[
			43919,
			43919
		],
		"mapped",
		[
			5055
		]
	],
	[
		[
			43920,
			43920
		],
		"mapped",
		[
			5056
		]
	],
	[
		[
			43921,
			43921
		],
		"mapped",
		[
			5057
		]
	],
	[
		[
			43922,
			43922
		],
		"mapped",
		[
			5058
		]
	],
	[
		[
			43923,
			43923
		],
		"mapped",
		[
			5059
		]
	],
	[
		[
			43924,
			43924
		],
		"mapped",
		[
			5060
		]
	],
	[
		[
			43925,
			43925
		],
		"mapped",
		[
			5061
		]
	],
	[
		[
			43926,
			43926
		],
		"mapped",
		[
			5062
		]
	],
	[
		[
			43927,
			43927
		],
		"mapped",
		[
			5063
		]
	],
	[
		[
			43928,
			43928
		],
		"mapped",
		[
			5064
		]
	],
	[
		[
			43929,
			43929
		],
		"mapped",
		[
			5065
		]
	],
	[
		[
			43930,
			43930
		],
		"mapped",
		[
			5066
		]
	],
	[
		[
			43931,
			43931
		],
		"mapped",
		[
			5067
		]
	],
	[
		[
			43932,
			43932
		],
		"mapped",
		[
			5068
		]
	],
	[
		[
			43933,
			43933
		],
		"mapped",
		[
			5069
		]
	],
	[
		[
			43934,
			43934
		],
		"mapped",
		[
			5070
		]
	],
	[
		[
			43935,
			43935
		],
		"mapped",
		[
			5071
		]
	],
	[
		[
			43936,
			43936
		],
		"mapped",
		[
			5072
		]
	],
	[
		[
			43937,
			43937
		],
		"mapped",
		[
			5073
		]
	],
	[
		[
			43938,
			43938
		],
		"mapped",
		[
			5074
		]
	],
	[
		[
			43939,
			43939
		],
		"mapped",
		[
			5075
		]
	],
	[
		[
			43940,
			43940
		],
		"mapped",
		[
			5076
		]
	],
	[
		[
			43941,
			43941
		],
		"mapped",
		[
			5077
		]
	],
	[
		[
			43942,
			43942
		],
		"mapped",
		[
			5078
		]
	],
	[
		[
			43943,
			43943
		],
		"mapped",
		[
			5079
		]
	],
	[
		[
			43944,
			43944
		],
		"mapped",
		[
			5080
		]
	],
	[
		[
			43945,
			43945
		],
		"mapped",
		[
			5081
		]
	],
	[
		[
			43946,
			43946
		],
		"mapped",
		[
			5082
		]
	],
	[
		[
			43947,
			43947
		],
		"mapped",
		[
			5083
		]
	],
	[
		[
			43948,
			43948
		],
		"mapped",
		[
			5084
		]
	],
	[
		[
			43949,
			43949
		],
		"mapped",
		[
			5085
		]
	],
	[
		[
			43950,
			43950
		],
		"mapped",
		[
			5086
		]
	],
	[
		[
			43951,
			43951
		],
		"mapped",
		[
			5087
		]
	],
	[
		[
			43952,
			43952
		],
		"mapped",
		[
			5088
		]
	],
	[
		[
			43953,
			43953
		],
		"mapped",
		[
			5089
		]
	],
	[
		[
			43954,
			43954
		],
		"mapped",
		[
			5090
		]
	],
	[
		[
			43955,
			43955
		],
		"mapped",
		[
			5091
		]
	],
	[
		[
			43956,
			43956
		],
		"mapped",
		[
			5092
		]
	],
	[
		[
			43957,
			43957
		],
		"mapped",
		[
			5093
		]
	],
	[
		[
			43958,
			43958
		],
		"mapped",
		[
			5094
		]
	],
	[
		[
			43959,
			43959
		],
		"mapped",
		[
			5095
		]
	],
	[
		[
			43960,
			43960
		],
		"mapped",
		[
			5096
		]
	],
	[
		[
			43961,
			43961
		],
		"mapped",
		[
			5097
		]
	],
	[
		[
			43962,
			43962
		],
		"mapped",
		[
			5098
		]
	],
	[
		[
			43963,
			43963
		],
		"mapped",
		[
			5099
		]
	],
	[
		[
			43964,
			43964
		],
		"mapped",
		[
			5100
		]
	],
	[
		[
			43965,
			43965
		],
		"mapped",
		[
			5101
		]
	],
	[
		[
			43966,
			43966
		],
		"mapped",
		[
			5102
		]
	],
	[
		[
			43967,
			43967
		],
		"mapped",
		[
			5103
		]
	],
	[
		[
			43968,
			44010
		],
		"valid"
	],
	[
		[
			44011,
			44011
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			44012,
			44013
		],
		"valid"
	],
	[
		[
			44014,
			44015
		],
		"disallowed"
	],
	[
		[
			44016,
			44025
		],
		"valid"
	],
	[
		[
			44026,
			44031
		],
		"disallowed"
	],
	[
		[
			44032,
			55203
		],
		"valid"
	],
	[
		[
			55204,
			55215
		],
		"disallowed"
	],
	[
		[
			55216,
			55238
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			55239,
			55242
		],
		"disallowed"
	],
	[
		[
			55243,
			55291
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			55292,
			55295
		],
		"disallowed"
	],
	[
		[
			55296,
			57343
		],
		"disallowed"
	],
	[
		[
			57344,
			63743
		],
		"disallowed"
	],
	[
		[
			63744,
			63744
		],
		"mapped",
		[
			35912
		]
	],
	[
		[
			63745,
			63745
		],
		"mapped",
		[
			26356
		]
	],
	[
		[
			63746,
			63746
		],
		"mapped",
		[
			36554
		]
	],
	[
		[
			63747,
			63747
		],
		"mapped",
		[
			36040
		]
	],
	[
		[
			63748,
			63748
		],
		"mapped",
		[
			28369
		]
	],
	[
		[
			63749,
			63749
		],
		"mapped",
		[
			20018
		]
	],
	[
		[
			63750,
			63750
		],
		"mapped",
		[
			21477
		]
	],
	[
		[
			63751,
			63752
		],
		"mapped",
		[
			40860
		]
	],
	[
		[
			63753,
			63753
		],
		"mapped",
		[
			22865
		]
	],
	[
		[
			63754,
			63754
		],
		"mapped",
		[
			37329
		]
	],
	[
		[
			63755,
			63755
		],
		"mapped",
		[
			21895
		]
	],
	[
		[
			63756,
			63756
		],
		"mapped",
		[
			22856
		]
	],
	[
		[
			63757,
			63757
		],
		"mapped",
		[
			25078
		]
	],
	[
		[
			63758,
			63758
		],
		"mapped",
		[
			30313
		]
	],
	[
		[
			63759,
			63759
		],
		"mapped",
		[
			32645
		]
	],
	[
		[
			63760,
			63760
		],
		"mapped",
		[
			34367
		]
	],
	[
		[
			63761,
			63761
		],
		"mapped",
		[
			34746
		]
	],
	[
		[
			63762,
			63762
		],
		"mapped",
		[
			35064
		]
	],
	[
		[
			63763,
			63763
		],
		"mapped",
		[
			37007
		]
	],
	[
		[
			63764,
			63764
		],
		"mapped",
		[
			27138
		]
	],
	[
		[
			63765,
			63765
		],
		"mapped",
		[
			27931
		]
	],
	[
		[
			63766,
			63766
		],
		"mapped",
		[
			28889
		]
	],
	[
		[
			63767,
			63767
		],
		"mapped",
		[
			29662
		]
	],
	[
		[
			63768,
			63768
		],
		"mapped",
		[
			33853
		]
	],
	[
		[
			63769,
			63769
		],
		"mapped",
		[
			37226
		]
	],
	[
		[
			63770,
			63770
		],
		"mapped",
		[
			39409
		]
	],
	[
		[
			63771,
			63771
		],
		"mapped",
		[
			20098
		]
	],
	[
		[
			63772,
			63772
		],
		"mapped",
		[
			21365
		]
	],
	[
		[
			63773,
			63773
		],
		"mapped",
		[
			27396
		]
	],
	[
		[
			63774,
			63774
		],
		"mapped",
		[
			29211
		]
	],
	[
		[
			63775,
			63775
		],
		"mapped",
		[
			34349
		]
	],
	[
		[
			63776,
			63776
		],
		"mapped",
		[
			40478
		]
	],
	[
		[
			63777,
			63777
		],
		"mapped",
		[
			23888
		]
	],
	[
		[
			63778,
			63778
		],
		"mapped",
		[
			28651
		]
	],
	[
		[
			63779,
			63779
		],
		"mapped",
		[
			34253
		]
	],
	[
		[
			63780,
			63780
		],
		"mapped",
		[
			35172
		]
	],
	[
		[
			63781,
			63781
		],
		"mapped",
		[
			25289
		]
	],
	[
		[
			63782,
			63782
		],
		"mapped",
		[
			33240
		]
	],
	[
		[
			63783,
			63783
		],
		"mapped",
		[
			34847
		]
	],
	[
		[
			63784,
			63784
		],
		"mapped",
		[
			24266
		]
	],
	[
		[
			63785,
			63785
		],
		"mapped",
		[
			26391
		]
	],
	[
		[
			63786,
			63786
		],
		"mapped",
		[
			28010
		]
	],
	[
		[
			63787,
			63787
		],
		"mapped",
		[
			29436
		]
	],
	[
		[
			63788,
			63788
		],
		"mapped",
		[
			37070
		]
	],
	[
		[
			63789,
			63789
		],
		"mapped",
		[
			20358
		]
	],
	[
		[
			63790,
			63790
		],
		"mapped",
		[
			20919
		]
	],
	[
		[
			63791,
			63791
		],
		"mapped",
		[
			21214
		]
	],
	[
		[
			63792,
			63792
		],
		"mapped",
		[
			25796
		]
	],
	[
		[
			63793,
			63793
		],
		"mapped",
		[
			27347
		]
	],
	[
		[
			63794,
			63794
		],
		"mapped",
		[
			29200
		]
	],
	[
		[
			63795,
			63795
		],
		"mapped",
		[
			30439
		]
	],
	[
		[
			63796,
			63796
		],
		"mapped",
		[
			32769
		]
	],
	[
		[
			63797,
			63797
		],
		"mapped",
		[
			34310
		]
	],
	[
		[
			63798,
			63798
		],
		"mapped",
		[
			34396
		]
	],
	[
		[
			63799,
			63799
		],
		"mapped",
		[
			36335
		]
	],
	[
		[
			63800,
			63800
		],
		"mapped",
		[
			38706
		]
	],
	[
		[
			63801,
			63801
		],
		"mapped",
		[
			39791
		]
	],
	[
		[
			63802,
			63802
		],
		"mapped",
		[
			40442
		]
	],
	[
		[
			63803,
			63803
		],
		"mapped",
		[
			30860
		]
	],
	[
		[
			63804,
			63804
		],
		"mapped",
		[
			31103
		]
	],
	[
		[
			63805,
			63805
		],
		"mapped",
		[
			32160
		]
	],
	[
		[
			63806,
			63806
		],
		"mapped",
		[
			33737
		]
	],
	[
		[
			63807,
			63807
		],
		"mapped",
		[
			37636
		]
	],
	[
		[
			63808,
			63808
		],
		"mapped",
		[
			40575
		]
	],
	[
		[
			63809,
			63809
		],
		"mapped",
		[
			35542
		]
	],
	[
		[
			63810,
			63810
		],
		"mapped",
		[
			22751
		]
	],
	[
		[
			63811,
			63811
		],
		"mapped",
		[
			24324
		]
	],
	[
		[
			63812,
			63812
		],
		"mapped",
		[
			31840
		]
	],
	[
		[
			63813,
			63813
		],
		"mapped",
		[
			32894
		]
	],
	[
		[
			63814,
			63814
		],
		"mapped",
		[
			29282
		]
	],
	[
		[
			63815,
			63815
		],
		"mapped",
		[
			30922
		]
	],
	[
		[
			63816,
			63816
		],
		"mapped",
		[
			36034
		]
	],
	[
		[
			63817,
			63817
		],
		"mapped",
		[
			38647
		]
	],
	[
		[
			63818,
			63818
		],
		"mapped",
		[
			22744
		]
	],
	[
		[
			63819,
			63819
		],
		"mapped",
		[
			23650
		]
	],
	[
		[
			63820,
			63820
		],
		"mapped",
		[
			27155
		]
	],
	[
		[
			63821,
			63821
		],
		"mapped",
		[
			28122
		]
	],
	[
		[
			63822,
			63822
		],
		"mapped",
		[
			28431
		]
	],
	[
		[
			63823,
			63823
		],
		"mapped",
		[
			32047
		]
	],
	[
		[
			63824,
			63824
		],
		"mapped",
		[
			32311
		]
	],
	[
		[
			63825,
			63825
		],
		"mapped",
		[
			38475
		]
	],
	[
		[
			63826,
			63826
		],
		"mapped",
		[
			21202
		]
	],
	[
		[
			63827,
			63827
		],
		"mapped",
		[
			32907
		]
	],
	[
		[
			63828,
			63828
		],
		"mapped",
		[
			20956
		]
	],
	[
		[
			63829,
			63829
		],
		"mapped",
		[
			20940
		]
	],
	[
		[
			63830,
			63830
		],
		"mapped",
		[
			31260
		]
	],
	[
		[
			63831,
			63831
		],
		"mapped",
		[
			32190
		]
	],
	[
		[
			63832,
			63832
		],
		"mapped",
		[
			33777
		]
	],
	[
		[
			63833,
			63833
		],
		"mapped",
		[
			38517
		]
	],
	[
		[
			63834,
			63834
		],
		"mapped",
		[
			35712
		]
	],
	[
		[
			63835,
			63835
		],
		"mapped",
		[
			25295
		]
	],
	[
		[
			63836,
			63836
		],
		"mapped",
		[
			27138
		]
	],
	[
		[
			63837,
			63837
		],
		"mapped",
		[
			35582
		]
	],
	[
		[
			63838,
			63838
		],
		"mapped",
		[
			20025
		]
	],
	[
		[
			63839,
			63839
		],
		"mapped",
		[
			23527
		]
	],
	[
		[
			63840,
			63840
		],
		"mapped",
		[
			24594
		]
	],
	[
		[
			63841,
			63841
		],
		"mapped",
		[
			29575
		]
	],
	[
		[
			63842,
			63842
		],
		"mapped",
		[
			30064
		]
	],
	[
		[
			63843,
			63843
		],
		"mapped",
		[
			21271
		]
	],
	[
		[
			63844,
			63844
		],
		"mapped",
		[
			30971
		]
	],
	[
		[
			63845,
			63845
		],
		"mapped",
		[
			20415
		]
	],
	[
		[
			63846,
			63846
		],
		"mapped",
		[
			24489
		]
	],
	[
		[
			63847,
			63847
		],
		"mapped",
		[
			19981
		]
	],
	[
		[
			63848,
			63848
		],
		"mapped",
		[
			27852
		]
	],
	[
		[
			63849,
			63849
		],
		"mapped",
		[
			25976
		]
	],
	[
		[
			63850,
			63850
		],
		"mapped",
		[
			32034
		]
	],
	[
		[
			63851,
			63851
		],
		"mapped",
		[
			21443
		]
	],
	[
		[
			63852,
			63852
		],
		"mapped",
		[
			22622
		]
	],
	[
		[
			63853,
			63853
		],
		"mapped",
		[
			30465
		]
	],
	[
		[
			63854,
			63854
		],
		"mapped",
		[
			33865
		]
	],
	[
		[
			63855,
			63855
		],
		"mapped",
		[
			35498
		]
	],
	[
		[
			63856,
			63856
		],
		"mapped",
		[
			27578
		]
	],
	[
		[
			63857,
			63857
		],
		"mapped",
		[
			36784
		]
	],
	[
		[
			63858,
			63858
		],
		"mapped",
		[
			27784
		]
	],
	[
		[
			63859,
			63859
		],
		"mapped",
		[
			25342
		]
	],
	[
		[
			63860,
			63860
		],
		"mapped",
		[
			33509
		]
	],
	[
		[
			63861,
			63861
		],
		"mapped",
		[
			25504
		]
	],
	[
		[
			63862,
			63862
		],
		"mapped",
		[
			30053
		]
	],
	[
		[
			63863,
			63863
		],
		"mapped",
		[
			20142
		]
	],
	[
		[
			63864,
			63864
		],
		"mapped",
		[
			20841
		]
	],
	[
		[
			63865,
			63865
		],
		"mapped",
		[
			20937
		]
	],
	[
		[
			63866,
			63866
		],
		"mapped",
		[
			26753
		]
	],
	[
		[
			63867,
			63867
		],
		"mapped",
		[
			31975
		]
	],
	[
		[
			63868,
			63868
		],
		"mapped",
		[
			33391
		]
	],
	[
		[
			63869,
			63869
		],
		"mapped",
		[
			35538
		]
	],
	[
		[
			63870,
			63870
		],
		"mapped",
		[
			37327
		]
	],
	[
		[
			63871,
			63871
		],
		"mapped",
		[
			21237
		]
	],
	[
		[
			63872,
			63872
		],
		"mapped",
		[
			21570
		]
	],
	[
		[
			63873,
			63873
		],
		"mapped",
		[
			22899
		]
	],
	[
		[
			63874,
			63874
		],
		"mapped",
		[
			24300
		]
	],
	[
		[
			63875,
			63875
		],
		"mapped",
		[
			26053
		]
	],
	[
		[
			63876,
			63876
		],
		"mapped",
		[
			28670
		]
	],
	[
		[
			63877,
			63877
		],
		"mapped",
		[
			31018
		]
	],
	[
		[
			63878,
			63878
		],
		"mapped",
		[
			38317
		]
	],
	[
		[
			63879,
			63879
		],
		"mapped",
		[
			39530
		]
	],
	[
		[
			63880,
			63880
		],
		"mapped",
		[
			40599
		]
	],
	[
		[
			63881,
			63881
		],
		"mapped",
		[
			40654
		]
	],
	[
		[
			63882,
			63882
		],
		"mapped",
		[
			21147
		]
	],
	[
		[
			63883,
			63883
		],
		"mapped",
		[
			26310
		]
	],
	[
		[
			63884,
			63884
		],
		"mapped",
		[
			27511
		]
	],
	[
		[
			63885,
			63885
		],
		"mapped",
		[
			36706
		]
	],
	[
		[
			63886,
			63886
		],
		"mapped",
		[
			24180
		]
	],
	[
		[
			63887,
			63887
		],
		"mapped",
		[
			24976
		]
	],
	[
		[
			63888,
			63888
		],
		"mapped",
		[
			25088
		]
	],
	[
		[
			63889,
			63889
		],
		"mapped",
		[
			25754
		]
	],
	[
		[
			63890,
			63890
		],
		"mapped",
		[
			28451
		]
	],
	[
		[
			63891,
			63891
		],
		"mapped",
		[
			29001
		]
	],
	[
		[
			63892,
			63892
		],
		"mapped",
		[
			29833
		]
	],
	[
		[
			63893,
			63893
		],
		"mapped",
		[
			31178
		]
	],
	[
		[
			63894,
			63894
		],
		"mapped",
		[
			32244
		]
	],
	[
		[
			63895,
			63895
		],
		"mapped",
		[
			32879
		]
	],
	[
		[
			63896,
			63896
		],
		"mapped",
		[
			36646
		]
	],
	[
		[
			63897,
			63897
		],
		"mapped",
		[
			34030
		]
	],
	[
		[
			63898,
			63898
		],
		"mapped",
		[
			36899
		]
	],
	[
		[
			63899,
			63899
		],
		"mapped",
		[
			37706
		]
	],
	[
		[
			63900,
			63900
		],
		"mapped",
		[
			21015
		]
	],
	[
		[
			63901,
			63901
		],
		"mapped",
		[
			21155
		]
	],
	[
		[
			63902,
			63902
		],
		"mapped",
		[
			21693
		]
	],
	[
		[
			63903,
			63903
		],
		"mapped",
		[
			28872
		]
	],
	[
		[
			63904,
			63904
		],
		"mapped",
		[
			35010
		]
	],
	[
		[
			63905,
			63905
		],
		"mapped",
		[
			35498
		]
	],
	[
		[
			63906,
			63906
		],
		"mapped",
		[
			24265
		]
	],
	[
		[
			63907,
			63907
		],
		"mapped",
		[
			24565
		]
	],
	[
		[
			63908,
			63908
		],
		"mapped",
		[
			25467
		]
	],
	[
		[
			63909,
			63909
		],
		"mapped",
		[
			27566
		]
	],
	[
		[
			63910,
			63910
		],
		"mapped",
		[
			31806
		]
	],
	[
		[
			63911,
			63911
		],
		"mapped",
		[
			29557
		]
	],
	[
		[
			63912,
			63912
		],
		"mapped",
		[
			20196
		]
	],
	[
		[
			63913,
			63913
		],
		"mapped",
		[
			22265
		]
	],
	[
		[
			63914,
			63914
		],
		"mapped",
		[
			23527
		]
	],
	[
		[
			63915,
			63915
		],
		"mapped",
		[
			23994
		]
	],
	[
		[
			63916,
			63916
		],
		"mapped",
		[
			24604
		]
	],
	[
		[
			63917,
			63917
		],
		"mapped",
		[
			29618
		]
	],
	[
		[
			63918,
			63918
		],
		"mapped",
		[
			29801
		]
	],
	[
		[
			63919,
			63919
		],
		"mapped",
		[
			32666
		]
	],
	[
		[
			63920,
			63920
		],
		"mapped",
		[
			32838
		]
	],
	[
		[
			63921,
			63921
		],
		"mapped",
		[
			37428
		]
	],
	[
		[
			63922,
			63922
		],
		"mapped",
		[
			38646
		]
	],
	[
		[
			63923,
			63923
		],
		"mapped",
		[
			38728
		]
	],
	[
		[
			63924,
			63924
		],
		"mapped",
		[
			38936
		]
	],
	[
		[
			63925,
			63925
		],
		"mapped",
		[
			20363
		]
	],
	[
		[
			63926,
			63926
		],
		"mapped",
		[
			31150
		]
	],
	[
		[
			63927,
			63927
		],
		"mapped",
		[
			37300
		]
	],
	[
		[
			63928,
			63928
		],
		"mapped",
		[
			38584
		]
	],
	[
		[
			63929,
			63929
		],
		"mapped",
		[
			24801
		]
	],
	[
		[
			63930,
			63930
		],
		"mapped",
		[
			20102
		]
	],
	[
		[
			63931,
			63931
		],
		"mapped",
		[
			20698
		]
	],
	[
		[
			63932,
			63932
		],
		"mapped",
		[
			23534
		]
	],
	[
		[
			63933,
			63933
		],
		"mapped",
		[
			23615
		]
	],
	[
		[
			63934,
			63934
		],
		"mapped",
		[
			26009
		]
	],
	[
		[
			63935,
			63935
		],
		"mapped",
		[
			27138
		]
	],
	[
		[
			63936,
			63936
		],
		"mapped",
		[
			29134
		]
	],
	[
		[
			63937,
			63937
		],
		"mapped",
		[
			30274
		]
	],
	[
		[
			63938,
			63938
		],
		"mapped",
		[
			34044
		]
	],
	[
		[
			63939,
			63939
		],
		"mapped",
		[
			36988
		]
	],
	[
		[
			63940,
			63940
		],
		"mapped",
		[
			40845
		]
	],
	[
		[
			63941,
			63941
		],
		"mapped",
		[
			26248
		]
	],
	[
		[
			63942,
			63942
		],
		"mapped",
		[
			38446
		]
	],
	[
		[
			63943,
			63943
		],
		"mapped",
		[
			21129
		]
	],
	[
		[
			63944,
			63944
		],
		"mapped",
		[
			26491
		]
	],
	[
		[
			63945,
			63945
		],
		"mapped",
		[
			26611
		]
	],
	[
		[
			63946,
			63946
		],
		"mapped",
		[
			27969
		]
	],
	[
		[
			63947,
			63947
		],
		"mapped",
		[
			28316
		]
	],
	[
		[
			63948,
			63948
		],
		"mapped",
		[
			29705
		]
	],
	[
		[
			63949,
			63949
		],
		"mapped",
		[
			30041
		]
	],
	[
		[
			63950,
			63950
		],
		"mapped",
		[
			30827
		]
	],
	[
		[
			63951,
			63951
		],
		"mapped",
		[
			32016
		]
	],
	[
		[
			63952,
			63952
		],
		"mapped",
		[
			39006
		]
	],
	[
		[
			63953,
			63953
		],
		"mapped",
		[
			20845
		]
	],
	[
		[
			63954,
			63954
		],
		"mapped",
		[
			25134
		]
	],
	[
		[
			63955,
			63955
		],
		"mapped",
		[
			38520
		]
	],
	[
		[
			63956,
			63956
		],
		"mapped",
		[
			20523
		]
	],
	[
		[
			63957,
			63957
		],
		"mapped",
		[
			23833
		]
	],
	[
		[
			63958,
			63958
		],
		"mapped",
		[
			28138
		]
	],
	[
		[
			63959,
			63959
		],
		"mapped",
		[
			36650
		]
	],
	[
		[
			63960,
			63960
		],
		"mapped",
		[
			24459
		]
	],
	[
		[
			63961,
			63961
		],
		"mapped",
		[
			24900
		]
	],
	[
		[
			63962,
			63962
		],
		"mapped",
		[
			26647
		]
	],
	[
		[
			63963,
			63963
		],
		"mapped",
		[
			29575
		]
	],
	[
		[
			63964,
			63964
		],
		"mapped",
		[
			38534
		]
	],
	[
		[
			63965,
			63965
		],
		"mapped",
		[
			21033
		]
	],
	[
		[
			63966,
			63966
		],
		"mapped",
		[
			21519
		]
	],
	[
		[
			63967,
			63967
		],
		"mapped",
		[
			23653
		]
	],
	[
		[
			63968,
			63968
		],
		"mapped",
		[
			26131
		]
	],
	[
		[
			63969,
			63969
		],
		"mapped",
		[
			26446
		]
	],
	[
		[
			63970,
			63970
		],
		"mapped",
		[
			26792
		]
	],
	[
		[
			63971,
			63971
		],
		"mapped",
		[
			27877
		]
	],
	[
		[
			63972,
			63972
		],
		"mapped",
		[
			29702
		]
	],
	[
		[
			63973,
			63973
		],
		"mapped",
		[
			30178
		]
	],
	[
		[
			63974,
			63974
		],
		"mapped",
		[
			32633
		]
	],
	[
		[
			63975,
			63975
		],
		"mapped",
		[
			35023
		]
	],
	[
		[
			63976,
			63976
		],
		"mapped",
		[
			35041
		]
	],
	[
		[
			63977,
			63977
		],
		"mapped",
		[
			37324
		]
	],
	[
		[
			63978,
			63978
		],
		"mapped",
		[
			38626
		]
	],
	[
		[
			63979,
			63979
		],
		"mapped",
		[
			21311
		]
	],
	[
		[
			63980,
			63980
		],
		"mapped",
		[
			28346
		]
	],
	[
		[
			63981,
			63981
		],
		"mapped",
		[
			21533
		]
	],
	[
		[
			63982,
			63982
		],
		"mapped",
		[
			29136
		]
	],
	[
		[
			63983,
			63983
		],
		"mapped",
		[
			29848
		]
	],
	[
		[
			63984,
			63984
		],
		"mapped",
		[
			34298
		]
	],
	[
		[
			63985,
			63985
		],
		"mapped",
		[
			38563
		]
	],
	[
		[
			63986,
			63986
		],
		"mapped",
		[
			40023
		]
	],
	[
		[
			63987,
			63987
		],
		"mapped",
		[
			40607
		]
	],
	[
		[
			63988,
			63988
		],
		"mapped",
		[
			26519
		]
	],
	[
		[
			63989,
			63989
		],
		"mapped",
		[
			28107
		]
	],
	[
		[
			63990,
			63990
		],
		"mapped",
		[
			33256
		]
	],
	[
		[
			63991,
			63991
		],
		"mapped",
		[
			31435
		]
	],
	[
		[
			63992,
			63992
		],
		"mapped",
		[
			31520
		]
	],
	[
		[
			63993,
			63993
		],
		"mapped",
		[
			31890
		]
	],
	[
		[
			63994,
			63994
		],
		"mapped",
		[
			29376
		]
	],
	[
		[
			63995,
			63995
		],
		"mapped",
		[
			28825
		]
	],
	[
		[
			63996,
			63996
		],
		"mapped",
		[
			35672
		]
	],
	[
		[
			63997,
			63997
		],
		"mapped",
		[
			20160
		]
	],
	[
		[
			63998,
			63998
		],
		"mapped",
		[
			33590
		]
	],
	[
		[
			63999,
			63999
		],
		"mapped",
		[
			21050
		]
	],
	[
		[
			64000,
			64000
		],
		"mapped",
		[
			20999
		]
	],
	[
		[
			64001,
			64001
		],
		"mapped",
		[
			24230
		]
	],
	[
		[
			64002,
			64002
		],
		"mapped",
		[
			25299
		]
	],
	[
		[
			64003,
			64003
		],
		"mapped",
		[
			31958
		]
	],
	[
		[
			64004,
			64004
		],
		"mapped",
		[
			23429
		]
	],
	[
		[
			64005,
			64005
		],
		"mapped",
		[
			27934
		]
	],
	[
		[
			64006,
			64006
		],
		"mapped",
		[
			26292
		]
	],
	[
		[
			64007,
			64007
		],
		"mapped",
		[
			36667
		]
	],
	[
		[
			64008,
			64008
		],
		"mapped",
		[
			34892
		]
	],
	[
		[
			64009,
			64009
		],
		"mapped",
		[
			38477
		]
	],
	[
		[
			64010,
			64010
		],
		"mapped",
		[
			35211
		]
	],
	[
		[
			64011,
			64011
		],
		"mapped",
		[
			24275
		]
	],
	[
		[
			64012,
			64012
		],
		"mapped",
		[
			20800
		]
	],
	[
		[
			64013,
			64013
		],
		"mapped",
		[
			21952
		]
	],
	[
		[
			64014,
			64015
		],
		"valid"
	],
	[
		[
			64016,
			64016
		],
		"mapped",
		[
			22618
		]
	],
	[
		[
			64017,
			64017
		],
		"valid"
	],
	[
		[
			64018,
			64018
		],
		"mapped",
		[
			26228
		]
	],
	[
		[
			64019,
			64020
		],
		"valid"
	],
	[
		[
			64021,
			64021
		],
		"mapped",
		[
			20958
		]
	],
	[
		[
			64022,
			64022
		],
		"mapped",
		[
			29482
		]
	],
	[
		[
			64023,
			64023
		],
		"mapped",
		[
			30410
		]
	],
	[
		[
			64024,
			64024
		],
		"mapped",
		[
			31036
		]
	],
	[
		[
			64025,
			64025
		],
		"mapped",
		[
			31070
		]
	],
	[
		[
			64026,
			64026
		],
		"mapped",
		[
			31077
		]
	],
	[
		[
			64027,
			64027
		],
		"mapped",
		[
			31119
		]
	],
	[
		[
			64028,
			64028
		],
		"mapped",
		[
			38742
		]
	],
	[
		[
			64029,
			64029
		],
		"mapped",
		[
			31934
		]
	],
	[
		[
			64030,
			64030
		],
		"mapped",
		[
			32701
		]
	],
	[
		[
			64031,
			64031
		],
		"valid"
	],
	[
		[
			64032,
			64032
		],
		"mapped",
		[
			34322
		]
	],
	[
		[
			64033,
			64033
		],
		"valid"
	],
	[
		[
			64034,
			64034
		],
		"mapped",
		[
			35576
		]
	],
	[
		[
			64035,
			64036
		],
		"valid"
	],
	[
		[
			64037,
			64037
		],
		"mapped",
		[
			36920
		]
	],
	[
		[
			64038,
			64038
		],
		"mapped",
		[
			37117
		]
	],
	[
		[
			64039,
			64041
		],
		"valid"
	],
	[
		[
			64042,
			64042
		],
		"mapped",
		[
			39151
		]
	],
	[
		[
			64043,
			64043
		],
		"mapped",
		[
			39164
		]
	],
	[
		[
			64044,
			64044
		],
		"mapped",
		[
			39208
		]
	],
	[
		[
			64045,
			64045
		],
		"mapped",
		[
			40372
		]
	],
	[
		[
			64046,
			64046
		],
		"mapped",
		[
			37086
		]
	],
	[
		[
			64047,
			64047
		],
		"mapped",
		[
			38583
		]
	],
	[
		[
			64048,
			64048
		],
		"mapped",
		[
			20398
		]
	],
	[
		[
			64049,
			64049
		],
		"mapped",
		[
			20711
		]
	],
	[
		[
			64050,
			64050
		],
		"mapped",
		[
			20813
		]
	],
	[
		[
			64051,
			64051
		],
		"mapped",
		[
			21193
		]
	],
	[
		[
			64052,
			64052
		],
		"mapped",
		[
			21220
		]
	],
	[
		[
			64053,
			64053
		],
		"mapped",
		[
			21329
		]
	],
	[
		[
			64054,
			64054
		],
		"mapped",
		[
			21917
		]
	],
	[
		[
			64055,
			64055
		],
		"mapped",
		[
			22022
		]
	],
	[
		[
			64056,
			64056
		],
		"mapped",
		[
			22120
		]
	],
	[
		[
			64057,
			64057
		],
		"mapped",
		[
			22592
		]
	],
	[
		[
			64058,
			64058
		],
		"mapped",
		[
			22696
		]
	],
	[
		[
			64059,
			64059
		],
		"mapped",
		[
			23652
		]
	],
	[
		[
			64060,
			64060
		],
		"mapped",
		[
			23662
		]
	],
	[
		[
			64061,
			64061
		],
		"mapped",
		[
			24724
		]
	],
	[
		[
			64062,
			64062
		],
		"mapped",
		[
			24936
		]
	],
	[
		[
			64063,
			64063
		],
		"mapped",
		[
			24974
		]
	],
	[
		[
			64064,
			64064
		],
		"mapped",
		[
			25074
		]
	],
	[
		[
			64065,
			64065
		],
		"mapped",
		[
			25935
		]
	],
	[
		[
			64066,
			64066
		],
		"mapped",
		[
			26082
		]
	],
	[
		[
			64067,
			64067
		],
		"mapped",
		[
			26257
		]
	],
	[
		[
			64068,
			64068
		],
		"mapped",
		[
			26757
		]
	],
	[
		[
			64069,
			64069
		],
		"mapped",
		[
			28023
		]
	],
	[
		[
			64070,
			64070
		],
		"mapped",
		[
			28186
		]
	],
	[
		[
			64071,
			64071
		],
		"mapped",
		[
			28450
		]
	],
	[
		[
			64072,
			64072
		],
		"mapped",
		[
			29038
		]
	],
	[
		[
			64073,
			64073
		],
		"mapped",
		[
			29227
		]
	],
	[
		[
			64074,
			64074
		],
		"mapped",
		[
			29730
		]
	],
	[
		[
			64075,
			64075
		],
		"mapped",
		[
			30865
		]
	],
	[
		[
			64076,
			64076
		],
		"mapped",
		[
			31038
		]
	],
	[
		[
			64077,
			64077
		],
		"mapped",
		[
			31049
		]
	],
	[
		[
			64078,
			64078
		],
		"mapped",
		[
			31048
		]
	],
	[
		[
			64079,
			64079
		],
		"mapped",
		[
			31056
		]
	],
	[
		[
			64080,
			64080
		],
		"mapped",
		[
			31062
		]
	],
	[
		[
			64081,
			64081
		],
		"mapped",
		[
			31069
		]
	],
	[
		[
			64082,
			64082
		],
		"mapped",
		[
			31117
		]
	],
	[
		[
			64083,
			64083
		],
		"mapped",
		[
			31118
		]
	],
	[
		[
			64084,
			64084
		],
		"mapped",
		[
			31296
		]
	],
	[
		[
			64085,
			64085
		],
		"mapped",
		[
			31361
		]
	],
	[
		[
			64086,
			64086
		],
		"mapped",
		[
			31680
		]
	],
	[
		[
			64087,
			64087
		],
		"mapped",
		[
			32244
		]
	],
	[
		[
			64088,
			64088
		],
		"mapped",
		[
			32265
		]
	],
	[
		[
			64089,
			64089
		],
		"mapped",
		[
			32321
		]
	],
	[
		[
			64090,
			64090
		],
		"mapped",
		[
			32626
		]
	],
	[
		[
			64091,
			64091
		],
		"mapped",
		[
			32773
		]
	],
	[
		[
			64092,
			64092
		],
		"mapped",
		[
			33261
		]
	],
	[
		[
			64093,
			64094
		],
		"mapped",
		[
			33401
		]
	],
	[
		[
			64095,
			64095
		],
		"mapped",
		[
			33879
		]
	],
	[
		[
			64096,
			64096
		],
		"mapped",
		[
			35088
		]
	],
	[
		[
			64097,
			64097
		],
		"mapped",
		[
			35222
		]
	],
	[
		[
			64098,
			64098
		],
		"mapped",
		[
			35585
		]
	],
	[
		[
			64099,
			64099
		],
		"mapped",
		[
			35641
		]
	],
	[
		[
			64100,
			64100
		],
		"mapped",
		[
			36051
		]
	],
	[
		[
			64101,
			64101
		],
		"mapped",
		[
			36104
		]
	],
	[
		[
			64102,
			64102
		],
		"mapped",
		[
			36790
		]
	],
	[
		[
			64103,
			64103
		],
		"mapped",
		[
			36920
		]
	],
	[
		[
			64104,
			64104
		],
		"mapped",
		[
			38627
		]
	],
	[
		[
			64105,
			64105
		],
		"mapped",
		[
			38911
		]
	],
	[
		[
			64106,
			64106
		],
		"mapped",
		[
			38971
		]
	],
	[
		[
			64107,
			64107
		],
		"mapped",
		[
			24693
		]
	],
	[
		[
			64108,
			64108
		],
		"mapped",
		[
			148206
		]
	],
	[
		[
			64109,
			64109
		],
		"mapped",
		[
			33304
		]
	],
	[
		[
			64110,
			64111
		],
		"disallowed"
	],
	[
		[
			64112,
			64112
		],
		"mapped",
		[
			20006
		]
	],
	[
		[
			64113,
			64113
		],
		"mapped",
		[
			20917
		]
	],
	[
		[
			64114,
			64114
		],
		"mapped",
		[
			20840
		]
	],
	[
		[
			64115,
			64115
		],
		"mapped",
		[
			20352
		]
	],
	[
		[
			64116,
			64116
		],
		"mapped",
		[
			20805
		]
	],
	[
		[
			64117,
			64117
		],
		"mapped",
		[
			20864
		]
	],
	[
		[
			64118,
			64118
		],
		"mapped",
		[
			21191
		]
	],
	[
		[
			64119,
			64119
		],
		"mapped",
		[
			21242
		]
	],
	[
		[
			64120,
			64120
		],
		"mapped",
		[
			21917
		]
	],
	[
		[
			64121,
			64121
		],
		"mapped",
		[
			21845
		]
	],
	[
		[
			64122,
			64122
		],
		"mapped",
		[
			21913
		]
	],
	[
		[
			64123,
			64123
		],
		"mapped",
		[
			21986
		]
	],
	[
		[
			64124,
			64124
		],
		"mapped",
		[
			22618
		]
	],
	[
		[
			64125,
			64125
		],
		"mapped",
		[
			22707
		]
	],
	[
		[
			64126,
			64126
		],
		"mapped",
		[
			22852
		]
	],
	[
		[
			64127,
			64127
		],
		"mapped",
		[
			22868
		]
	],
	[
		[
			64128,
			64128
		],
		"mapped",
		[
			23138
		]
	],
	[
		[
			64129,
			64129
		],
		"mapped",
		[
			23336
		]
	],
	[
		[
			64130,
			64130
		],
		"mapped",
		[
			24274
		]
	],
	[
		[
			64131,
			64131
		],
		"mapped",
		[
			24281
		]
	],
	[
		[
			64132,
			64132
		],
		"mapped",
		[
			24425
		]
	],
	[
		[
			64133,
			64133
		],
		"mapped",
		[
			24493
		]
	],
	[
		[
			64134,
			64134
		],
		"mapped",
		[
			24792
		]
	],
	[
		[
			64135,
			64135
		],
		"mapped",
		[
			24910
		]
	],
	[
		[
			64136,
			64136
		],
		"mapped",
		[
			24840
		]
	],
	[
		[
			64137,
			64137
		],
		"mapped",
		[
			24974
		]
	],
	[
		[
			64138,
			64138
		],
		"mapped",
		[
			24928
		]
	],
	[
		[
			64139,
			64139
		],
		"mapped",
		[
			25074
		]
	],
	[
		[
			64140,
			64140
		],
		"mapped",
		[
			25140
		]
	],
	[
		[
			64141,
			64141
		],
		"mapped",
		[
			25540
		]
	],
	[
		[
			64142,
			64142
		],
		"mapped",
		[
			25628
		]
	],
	[
		[
			64143,
			64143
		],
		"mapped",
		[
			25682
		]
	],
	[
		[
			64144,
			64144
		],
		"mapped",
		[
			25942
		]
	],
	[
		[
			64145,
			64145
		],
		"mapped",
		[
			26228
		]
	],
	[
		[
			64146,
			64146
		],
		"mapped",
		[
			26391
		]
	],
	[
		[
			64147,
			64147
		],
		"mapped",
		[
			26395
		]
	],
	[
		[
			64148,
			64148
		],
		"mapped",
		[
			26454
		]
	],
	[
		[
			64149,
			64149
		],
		"mapped",
		[
			27513
		]
	],
	[
		[
			64150,
			64150
		],
		"mapped",
		[
			27578
		]
	],
	[
		[
			64151,
			64151
		],
		"mapped",
		[
			27969
		]
	],
	[
		[
			64152,
			64152
		],
		"mapped",
		[
			28379
		]
	],
	[
		[
			64153,
			64153
		],
		"mapped",
		[
			28363
		]
	],
	[
		[
			64154,
			64154
		],
		"mapped",
		[
			28450
		]
	],
	[
		[
			64155,
			64155
		],
		"mapped",
		[
			28702
		]
	],
	[
		[
			64156,
			64156
		],
		"mapped",
		[
			29038
		]
	],
	[
		[
			64157,
			64157
		],
		"mapped",
		[
			30631
		]
	],
	[
		[
			64158,
			64158
		],
		"mapped",
		[
			29237
		]
	],
	[
		[
			64159,
			64159
		],
		"mapped",
		[
			29359
		]
	],
	[
		[
			64160,
			64160
		],
		"mapped",
		[
			29482
		]
	],
	[
		[
			64161,
			64161
		],
		"mapped",
		[
			29809
		]
	],
	[
		[
			64162,
			64162
		],
		"mapped",
		[
			29958
		]
	],
	[
		[
			64163,
			64163
		],
		"mapped",
		[
			30011
		]
	],
	[
		[
			64164,
			64164
		],
		"mapped",
		[
			30237
		]
	],
	[
		[
			64165,
			64165
		],
		"mapped",
		[
			30239
		]
	],
	[
		[
			64166,
			64166
		],
		"mapped",
		[
			30410
		]
	],
	[
		[
			64167,
			64167
		],
		"mapped",
		[
			30427
		]
	],
	[
		[
			64168,
			64168
		],
		"mapped",
		[
			30452
		]
	],
	[
		[
			64169,
			64169
		],
		"mapped",
		[
			30538
		]
	],
	[
		[
			64170,
			64170
		],
		"mapped",
		[
			30528
		]
	],
	[
		[
			64171,
			64171
		],
		"mapped",
		[
			30924
		]
	],
	[
		[
			64172,
			64172
		],
		"mapped",
		[
			31409
		]
	],
	[
		[
			64173,
			64173
		],
		"mapped",
		[
			31680
		]
	],
	[
		[
			64174,
			64174
		],
		"mapped",
		[
			31867
		]
	],
	[
		[
			64175,
			64175
		],
		"mapped",
		[
			32091
		]
	],
	[
		[
			64176,
			64176
		],
		"mapped",
		[
			32244
		]
	],
	[
		[
			64177,
			64177
		],
		"mapped",
		[
			32574
		]
	],
	[
		[
			64178,
			64178
		],
		"mapped",
		[
			32773
		]
	],
	[
		[
			64179,
			64179
		],
		"mapped",
		[
			33618
		]
	],
	[
		[
			64180,
			64180
		],
		"mapped",
		[
			33775
		]
	],
	[
		[
			64181,
			64181
		],
		"mapped",
		[
			34681
		]
	],
	[
		[
			64182,
			64182
		],
		"mapped",
		[
			35137
		]
	],
	[
		[
			64183,
			64183
		],
		"mapped",
		[
			35206
		]
	],
	[
		[
			64184,
			64184
		],
		"mapped",
		[
			35222
		]
	],
	[
		[
			64185,
			64185
		],
		"mapped",
		[
			35519
		]
	],
	[
		[
			64186,
			64186
		],
		"mapped",
		[
			35576
		]
	],
	[
		[
			64187,
			64187
		],
		"mapped",
		[
			35531
		]
	],
	[
		[
			64188,
			64188
		],
		"mapped",
		[
			35585
		]
	],
	[
		[
			64189,
			64189
		],
		"mapped",
		[
			35582
		]
	],
	[
		[
			64190,
			64190
		],
		"mapped",
		[
			35565
		]
	],
	[
		[
			64191,
			64191
		],
		"mapped",
		[
			35641
		]
	],
	[
		[
			64192,
			64192
		],
		"mapped",
		[
			35722
		]
	],
	[
		[
			64193,
			64193
		],
		"mapped",
		[
			36104
		]
	],
	[
		[
			64194,
			64194
		],
		"mapped",
		[
			36664
		]
	],
	[
		[
			64195,
			64195
		],
		"mapped",
		[
			36978
		]
	],
	[
		[
			64196,
			64196
		],
		"mapped",
		[
			37273
		]
	],
	[
		[
			64197,
			64197
		],
		"mapped",
		[
			37494
		]
	],
	[
		[
			64198,
			64198
		],
		"mapped",
		[
			38524
		]
	],
	[
		[
			64199,
			64199
		],
		"mapped",
		[
			38627
		]
	],
	[
		[
			64200,
			64200
		],
		"mapped",
		[
			38742
		]
	],
	[
		[
			64201,
			64201
		],
		"mapped",
		[
			38875
		]
	],
	[
		[
			64202,
			64202
		],
		"mapped",
		[
			38911
		]
	],
	[
		[
			64203,
			64203
		],
		"mapped",
		[
			38923
		]
	],
	[
		[
			64204,
			64204
		],
		"mapped",
		[
			38971
		]
	],
	[
		[
			64205,
			64205
		],
		"mapped",
		[
			39698
		]
	],
	[
		[
			64206,
			64206
		],
		"mapped",
		[
			40860
		]
	],
	[
		[
			64207,
			64207
		],
		"mapped",
		[
			141386
		]
	],
	[
		[
			64208,
			64208
		],
		"mapped",
		[
			141380
		]
	],
	[
		[
			64209,
			64209
		],
		"mapped",
		[
			144341
		]
	],
	[
		[
			64210,
			64210
		],
		"mapped",
		[
			15261
		]
	],
	[
		[
			64211,
			64211
		],
		"mapped",
		[
			16408
		]
	],
	[
		[
			64212,
			64212
		],
		"mapped",
		[
			16441
		]
	],
	[
		[
			64213,
			64213
		],
		"mapped",
		[
			152137
		]
	],
	[
		[
			64214,
			64214
		],
		"mapped",
		[
			154832
		]
	],
	[
		[
			64215,
			64215
		],
		"mapped",
		[
			163539
		]
	],
	[
		[
			64216,
			64216
		],
		"mapped",
		[
			40771
		]
	],
	[
		[
			64217,
			64217
		],
		"mapped",
		[
			40846
		]
	],
	[
		[
			64218,
			64255
		],
		"disallowed"
	],
	[
		[
			64256,
			64256
		],
		"mapped",
		[
			102,
			102
		]
	],
	[
		[
			64257,
			64257
		],
		"mapped",
		[
			102,
			105
		]
	],
	[
		[
			64258,
			64258
		],
		"mapped",
		[
			102,
			108
		]
	],
	[
		[
			64259,
			64259
		],
		"mapped",
		[
			102,
			102,
			105
		]
	],
	[
		[
			64260,
			64260
		],
		"mapped",
		[
			102,
			102,
			108
		]
	],
	[
		[
			64261,
			64262
		],
		"mapped",
		[
			115,
			116
		]
	],
	[
		[
			64263,
			64274
		],
		"disallowed"
	],
	[
		[
			64275,
			64275
		],
		"mapped",
		[
			1396,
			1398
		]
	],
	[
		[
			64276,
			64276
		],
		"mapped",
		[
			1396,
			1381
		]
	],
	[
		[
			64277,
			64277
		],
		"mapped",
		[
			1396,
			1387
		]
	],
	[
		[
			64278,
			64278
		],
		"mapped",
		[
			1406,
			1398
		]
	],
	[
		[
			64279,
			64279
		],
		"mapped",
		[
			1396,
			1389
		]
	],
	[
		[
			64280,
			64284
		],
		"disallowed"
	],
	[
		[
			64285,
			64285
		],
		"mapped",
		[
			1497,
			1460
		]
	],
	[
		[
			64286,
			64286
		],
		"valid"
	],
	[
		[
			64287,
			64287
		],
		"mapped",
		[
			1522,
			1463
		]
	],
	[
		[
			64288,
			64288
		],
		"mapped",
		[
			1506
		]
	],
	[
		[
			64289,
			64289
		],
		"mapped",
		[
			1488
		]
	],
	[
		[
			64290,
			64290
		],
		"mapped",
		[
			1491
		]
	],
	[
		[
			64291,
			64291
		],
		"mapped",
		[
			1492
		]
	],
	[
		[
			64292,
			64292
		],
		"mapped",
		[
			1499
		]
	],
	[
		[
			64293,
			64293
		],
		"mapped",
		[
			1500
		]
	],
	[
		[
			64294,
			64294
		],
		"mapped",
		[
			1501
		]
	],
	[
		[
			64295,
			64295
		],
		"mapped",
		[
			1512
		]
	],
	[
		[
			64296,
			64296
		],
		"mapped",
		[
			1514
		]
	],
	[
		[
			64297,
			64297
		],
		"disallowed_STD3_mapped",
		[
			43
		]
	],
	[
		[
			64298,
			64298
		],
		"mapped",
		[
			1513,
			1473
		]
	],
	[
		[
			64299,
			64299
		],
		"mapped",
		[
			1513,
			1474
		]
	],
	[
		[
			64300,
			64300
		],
		"mapped",
		[
			1513,
			1468,
			1473
		]
	],
	[
		[
			64301,
			64301
		],
		"mapped",
		[
			1513,
			1468,
			1474
		]
	],
	[
		[
			64302,
			64302
		],
		"mapped",
		[
			1488,
			1463
		]
	],
	[
		[
			64303,
			64303
		],
		"mapped",
		[
			1488,
			1464
		]
	],
	[
		[
			64304,
			64304
		],
		"mapped",
		[
			1488,
			1468
		]
	],
	[
		[
			64305,
			64305
		],
		"mapped",
		[
			1489,
			1468
		]
	],
	[
		[
			64306,
			64306
		],
		"mapped",
		[
			1490,
			1468
		]
	],
	[
		[
			64307,
			64307
		],
		"mapped",
		[
			1491,
			1468
		]
	],
	[
		[
			64308,
			64308
		],
		"mapped",
		[
			1492,
			1468
		]
	],
	[
		[
			64309,
			64309
		],
		"mapped",
		[
			1493,
			1468
		]
	],
	[
		[
			64310,
			64310
		],
		"mapped",
		[
			1494,
			1468
		]
	],
	[
		[
			64311,
			64311
		],
		"disallowed"
	],
	[
		[
			64312,
			64312
		],
		"mapped",
		[
			1496,
			1468
		]
	],
	[
		[
			64313,
			64313
		],
		"mapped",
		[
			1497,
			1468
		]
	],
	[
		[
			64314,
			64314
		],
		"mapped",
		[
			1498,
			1468
		]
	],
	[
		[
			64315,
			64315
		],
		"mapped",
		[
			1499,
			1468
		]
	],
	[
		[
			64316,
			64316
		],
		"mapped",
		[
			1500,
			1468
		]
	],
	[
		[
			64317,
			64317
		],
		"disallowed"
	],
	[
		[
			64318,
			64318
		],
		"mapped",
		[
			1502,
			1468
		]
	],
	[
		[
			64319,
			64319
		],
		"disallowed"
	],
	[
		[
			64320,
			64320
		],
		"mapped",
		[
			1504,
			1468
		]
	],
	[
		[
			64321,
			64321
		],
		"mapped",
		[
			1505,
			1468
		]
	],
	[
		[
			64322,
			64322
		],
		"disallowed"
	],
	[
		[
			64323,
			64323
		],
		"mapped",
		[
			1507,
			1468
		]
	],
	[
		[
			64324,
			64324
		],
		"mapped",
		[
			1508,
			1468
		]
	],
	[
		[
			64325,
			64325
		],
		"disallowed"
	],
	[
		[
			64326,
			64326
		],
		"mapped",
		[
			1510,
			1468
		]
	],
	[
		[
			64327,
			64327
		],
		"mapped",
		[
			1511,
			1468
		]
	],
	[
		[
			64328,
			64328
		],
		"mapped",
		[
			1512,
			1468
		]
	],
	[
		[
			64329,
			64329
		],
		"mapped",
		[
			1513,
			1468
		]
	],
	[
		[
			64330,
			64330
		],
		"mapped",
		[
			1514,
			1468
		]
	],
	[
		[
			64331,
			64331
		],
		"mapped",
		[
			1493,
			1465
		]
	],
	[
		[
			64332,
			64332
		],
		"mapped",
		[
			1489,
			1471
		]
	],
	[
		[
			64333,
			64333
		],
		"mapped",
		[
			1499,
			1471
		]
	],
	[
		[
			64334,
			64334
		],
		"mapped",
		[
			1508,
			1471
		]
	],
	[
		[
			64335,
			64335
		],
		"mapped",
		[
			1488,
			1500
		]
	],
	[
		[
			64336,
			64337
		],
		"mapped",
		[
			1649
		]
	],
	[
		[
			64338,
			64341
		],
		"mapped",
		[
			1659
		]
	],
	[
		[
			64342,
			64345
		],
		"mapped",
		[
			1662
		]
	],
	[
		[
			64346,
			64349
		],
		"mapped",
		[
			1664
		]
	],
	[
		[
			64350,
			64353
		],
		"mapped",
		[
			1658
		]
	],
	[
		[
			64354,
			64357
		],
		"mapped",
		[
			1663
		]
	],
	[
		[
			64358,
			64361
		],
		"mapped",
		[
			1657
		]
	],
	[
		[
			64362,
			64365
		],
		"mapped",
		[
			1700
		]
	],
	[
		[
			64366,
			64369
		],
		"mapped",
		[
			1702
		]
	],
	[
		[
			64370,
			64373
		],
		"mapped",
		[
			1668
		]
	],
	[
		[
			64374,
			64377
		],
		"mapped",
		[
			1667
		]
	],
	[
		[
			64378,
			64381
		],
		"mapped",
		[
			1670
		]
	],
	[
		[
			64382,
			64385
		],
		"mapped",
		[
			1671
		]
	],
	[
		[
			64386,
			64387
		],
		"mapped",
		[
			1677
		]
	],
	[
		[
			64388,
			64389
		],
		"mapped",
		[
			1676
		]
	],
	[
		[
			64390,
			64391
		],
		"mapped",
		[
			1678
		]
	],
	[
		[
			64392,
			64393
		],
		"mapped",
		[
			1672
		]
	],
	[
		[
			64394,
			64395
		],
		"mapped",
		[
			1688
		]
	],
	[
		[
			64396,
			64397
		],
		"mapped",
		[
			1681
		]
	],
	[
		[
			64398,
			64401
		],
		"mapped",
		[
			1705
		]
	],
	[
		[
			64402,
			64405
		],
		"mapped",
		[
			1711
		]
	],
	[
		[
			64406,
			64409
		],
		"mapped",
		[
			1715
		]
	],
	[
		[
			64410,
			64413
		],
		"mapped",
		[
			1713
		]
	],
	[
		[
			64414,
			64415
		],
		"mapped",
		[
			1722
		]
	],
	[
		[
			64416,
			64419
		],
		"mapped",
		[
			1723
		]
	],
	[
		[
			64420,
			64421
		],
		"mapped",
		[
			1728
		]
	],
	[
		[
			64422,
			64425
		],
		"mapped",
		[
			1729
		]
	],
	[
		[
			64426,
			64429
		],
		"mapped",
		[
			1726
		]
	],
	[
		[
			64430,
			64431
		],
		"mapped",
		[
			1746
		]
	],
	[
		[
			64432,
			64433
		],
		"mapped",
		[
			1747
		]
	],
	[
		[
			64434,
			64449
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			64450,
			64466
		],
		"disallowed"
	],
	[
		[
			64467,
			64470
		],
		"mapped",
		[
			1709
		]
	],
	[
		[
			64471,
			64472
		],
		"mapped",
		[
			1735
		]
	],
	[
		[
			64473,
			64474
		],
		"mapped",
		[
			1734
		]
	],
	[
		[
			64475,
			64476
		],
		"mapped",
		[
			1736
		]
	],
	[
		[
			64477,
			64477
		],
		"mapped",
		[
			1735,
			1652
		]
	],
	[
		[
			64478,
			64479
		],
		"mapped",
		[
			1739
		]
	],
	[
		[
			64480,
			64481
		],
		"mapped",
		[
			1733
		]
	],
	[
		[
			64482,
			64483
		],
		"mapped",
		[
			1737
		]
	],
	[
		[
			64484,
			64487
		],
		"mapped",
		[
			1744
		]
	],
	[
		[
			64488,
			64489
		],
		"mapped",
		[
			1609
		]
	],
	[
		[
			64490,
			64491
		],
		"mapped",
		[
			1574,
			1575
		]
	],
	[
		[
			64492,
			64493
		],
		"mapped",
		[
			1574,
			1749
		]
	],
	[
		[
			64494,
			64495
		],
		"mapped",
		[
			1574,
			1608
		]
	],
	[
		[
			64496,
			64497
		],
		"mapped",
		[
			1574,
			1735
		]
	],
	[
		[
			64498,
			64499
		],
		"mapped",
		[
			1574,
			1734
		]
	],
	[
		[
			64500,
			64501
		],
		"mapped",
		[
			1574,
			1736
		]
	],
	[
		[
			64502,
			64504
		],
		"mapped",
		[
			1574,
			1744
		]
	],
	[
		[
			64505,
			64507
		],
		"mapped",
		[
			1574,
			1609
		]
	],
	[
		[
			64508,
			64511
		],
		"mapped",
		[
			1740
		]
	],
	[
		[
			64512,
			64512
		],
		"mapped",
		[
			1574,
			1580
		]
	],
	[
		[
			64513,
			64513
		],
		"mapped",
		[
			1574,
			1581
		]
	],
	[
		[
			64514,
			64514
		],
		"mapped",
		[
			1574,
			1605
		]
	],
	[
		[
			64515,
			64515
		],
		"mapped",
		[
			1574,
			1609
		]
	],
	[
		[
			64516,
			64516
		],
		"mapped",
		[
			1574,
			1610
		]
	],
	[
		[
			64517,
			64517
		],
		"mapped",
		[
			1576,
			1580
		]
	],
	[
		[
			64518,
			64518
		],
		"mapped",
		[
			1576,
			1581
		]
	],
	[
		[
			64519,
			64519
		],
		"mapped",
		[
			1576,
			1582
		]
	],
	[
		[
			64520,
			64520
		],
		"mapped",
		[
			1576,
			1605
		]
	],
	[
		[
			64521,
			64521
		],
		"mapped",
		[
			1576,
			1609
		]
	],
	[
		[
			64522,
			64522
		],
		"mapped",
		[
			1576,
			1610
		]
	],
	[
		[
			64523,
			64523
		],
		"mapped",
		[
			1578,
			1580
		]
	],
	[
		[
			64524,
			64524
		],
		"mapped",
		[
			1578,
			1581
		]
	],
	[
		[
			64525,
			64525
		],
		"mapped",
		[
			1578,
			1582
		]
	],
	[
		[
			64526,
			64526
		],
		"mapped",
		[
			1578,
			1605
		]
	],
	[
		[
			64527,
			64527
		],
		"mapped",
		[
			1578,
			1609
		]
	],
	[
		[
			64528,
			64528
		],
		"mapped",
		[
			1578,
			1610
		]
	],
	[
		[
			64529,
			64529
		],
		"mapped",
		[
			1579,
			1580
		]
	],
	[
		[
			64530,
			64530
		],
		"mapped",
		[
			1579,
			1605
		]
	],
	[
		[
			64531,
			64531
		],
		"mapped",
		[
			1579,
			1609
		]
	],
	[
		[
			64532,
			64532
		],
		"mapped",
		[
			1579,
			1610
		]
	],
	[
		[
			64533,
			64533
		],
		"mapped",
		[
			1580,
			1581
		]
	],
	[
		[
			64534,
			64534
		],
		"mapped",
		[
			1580,
			1605
		]
	],
	[
		[
			64535,
			64535
		],
		"mapped",
		[
			1581,
			1580
		]
	],
	[
		[
			64536,
			64536
		],
		"mapped",
		[
			1581,
			1605
		]
	],
	[
		[
			64537,
			64537
		],
		"mapped",
		[
			1582,
			1580
		]
	],
	[
		[
			64538,
			64538
		],
		"mapped",
		[
			1582,
			1581
		]
	],
	[
		[
			64539,
			64539
		],
		"mapped",
		[
			1582,
			1605
		]
	],
	[
		[
			64540,
			64540
		],
		"mapped",
		[
			1587,
			1580
		]
	],
	[
		[
			64541,
			64541
		],
		"mapped",
		[
			1587,
			1581
		]
	],
	[
		[
			64542,
			64542
		],
		"mapped",
		[
			1587,
			1582
		]
	],
	[
		[
			64543,
			64543
		],
		"mapped",
		[
			1587,
			1605
		]
	],
	[
		[
			64544,
			64544
		],
		"mapped",
		[
			1589,
			1581
		]
	],
	[
		[
			64545,
			64545
		],
		"mapped",
		[
			1589,
			1605
		]
	],
	[
		[
			64546,
			64546
		],
		"mapped",
		[
			1590,
			1580
		]
	],
	[
		[
			64547,
			64547
		],
		"mapped",
		[
			1590,
			1581
		]
	],
	[
		[
			64548,
			64548
		],
		"mapped",
		[
			1590,
			1582
		]
	],
	[
		[
			64549,
			64549
		],
		"mapped",
		[
			1590,
			1605
		]
	],
	[
		[
			64550,
			64550
		],
		"mapped",
		[
			1591,
			1581
		]
	],
	[
		[
			64551,
			64551
		],
		"mapped",
		[
			1591,
			1605
		]
	],
	[
		[
			64552,
			64552
		],
		"mapped",
		[
			1592,
			1605
		]
	],
	[
		[
			64553,
			64553
		],
		"mapped",
		[
			1593,
			1580
		]
	],
	[
		[
			64554,
			64554
		],
		"mapped",
		[
			1593,
			1605
		]
	],
	[
		[
			64555,
			64555
		],
		"mapped",
		[
			1594,
			1580
		]
	],
	[
		[
			64556,
			64556
		],
		"mapped",
		[
			1594,
			1605
		]
	],
	[
		[
			64557,
			64557
		],
		"mapped",
		[
			1601,
			1580
		]
	],
	[
		[
			64558,
			64558
		],
		"mapped",
		[
			1601,
			1581
		]
	],
	[
		[
			64559,
			64559
		],
		"mapped",
		[
			1601,
			1582
		]
	],
	[
		[
			64560,
			64560
		],
		"mapped",
		[
			1601,
			1605
		]
	],
	[
		[
			64561,
			64561
		],
		"mapped",
		[
			1601,
			1609
		]
	],
	[
		[
			64562,
			64562
		],
		"mapped",
		[
			1601,
			1610
		]
	],
	[
		[
			64563,
			64563
		],
		"mapped",
		[
			1602,
			1581
		]
	],
	[
		[
			64564,
			64564
		],
		"mapped",
		[
			1602,
			1605
		]
	],
	[
		[
			64565,
			64565
		],
		"mapped",
		[
			1602,
			1609
		]
	],
	[
		[
			64566,
			64566
		],
		"mapped",
		[
			1602,
			1610
		]
	],
	[
		[
			64567,
			64567
		],
		"mapped",
		[
			1603,
			1575
		]
	],
	[
		[
			64568,
			64568
		],
		"mapped",
		[
			1603,
			1580
		]
	],
	[
		[
			64569,
			64569
		],
		"mapped",
		[
			1603,
			1581
		]
	],
	[
		[
			64570,
			64570
		],
		"mapped",
		[
			1603,
			1582
		]
	],
	[
		[
			64571,
			64571
		],
		"mapped",
		[
			1603,
			1604
		]
	],
	[
		[
			64572,
			64572
		],
		"mapped",
		[
			1603,
			1605
		]
	],
	[
		[
			64573,
			64573
		],
		"mapped",
		[
			1603,
			1609
		]
	],
	[
		[
			64574,
			64574
		],
		"mapped",
		[
			1603,
			1610
		]
	],
	[
		[
			64575,
			64575
		],
		"mapped",
		[
			1604,
			1580
		]
	],
	[
		[
			64576,
			64576
		],
		"mapped",
		[
			1604,
			1581
		]
	],
	[
		[
			64577,
			64577
		],
		"mapped",
		[
			1604,
			1582
		]
	],
	[
		[
			64578,
			64578
		],
		"mapped",
		[
			1604,
			1605
		]
	],
	[
		[
			64579,
			64579
		],
		"mapped",
		[
			1604,
			1609
		]
	],
	[
		[
			64580,
			64580
		],
		"mapped",
		[
			1604,
			1610
		]
	],
	[
		[
			64581,
			64581
		],
		"mapped",
		[
			1605,
			1580
		]
	],
	[
		[
			64582,
			64582
		],
		"mapped",
		[
			1605,
			1581
		]
	],
	[
		[
			64583,
			64583
		],
		"mapped",
		[
			1605,
			1582
		]
	],
	[
		[
			64584,
			64584
		],
		"mapped",
		[
			1605,
			1605
		]
	],
	[
		[
			64585,
			64585
		],
		"mapped",
		[
			1605,
			1609
		]
	],
	[
		[
			64586,
			64586
		],
		"mapped",
		[
			1605,
			1610
		]
	],
	[
		[
			64587,
			64587
		],
		"mapped",
		[
			1606,
			1580
		]
	],
	[
		[
			64588,
			64588
		],
		"mapped",
		[
			1606,
			1581
		]
	],
	[
		[
			64589,
			64589
		],
		"mapped",
		[
			1606,
			1582
		]
	],
	[
		[
			64590,
			64590
		],
		"mapped",
		[
			1606,
			1605
		]
	],
	[
		[
			64591,
			64591
		],
		"mapped",
		[
			1606,
			1609
		]
	],
	[
		[
			64592,
			64592
		],
		"mapped",
		[
			1606,
			1610
		]
	],
	[
		[
			64593,
			64593
		],
		"mapped",
		[
			1607,
			1580
		]
	],
	[
		[
			64594,
			64594
		],
		"mapped",
		[
			1607,
			1605
		]
	],
	[
		[
			64595,
			64595
		],
		"mapped",
		[
			1607,
			1609
		]
	],
	[
		[
			64596,
			64596
		],
		"mapped",
		[
			1607,
			1610
		]
	],
	[
		[
			64597,
			64597
		],
		"mapped",
		[
			1610,
			1580
		]
	],
	[
		[
			64598,
			64598
		],
		"mapped",
		[
			1610,
			1581
		]
	],
	[
		[
			64599,
			64599
		],
		"mapped",
		[
			1610,
			1582
		]
	],
	[
		[
			64600,
			64600
		],
		"mapped",
		[
			1610,
			1605
		]
	],
	[
		[
			64601,
			64601
		],
		"mapped",
		[
			1610,
			1609
		]
	],
	[
		[
			64602,
			64602
		],
		"mapped",
		[
			1610,
			1610
		]
	],
	[
		[
			64603,
			64603
		],
		"mapped",
		[
			1584,
			1648
		]
	],
	[
		[
			64604,
			64604
		],
		"mapped",
		[
			1585,
			1648
		]
	],
	[
		[
			64605,
			64605
		],
		"mapped",
		[
			1609,
			1648
		]
	],
	[
		[
			64606,
			64606
		],
		"disallowed_STD3_mapped",
		[
			32,
			1612,
			1617
		]
	],
	[
		[
			64607,
			64607
		],
		"disallowed_STD3_mapped",
		[
			32,
			1613,
			1617
		]
	],
	[
		[
			64608,
			64608
		],
		"disallowed_STD3_mapped",
		[
			32,
			1614,
			1617
		]
	],
	[
		[
			64609,
			64609
		],
		"disallowed_STD3_mapped",
		[
			32,
			1615,
			1617
		]
	],
	[
		[
			64610,
			64610
		],
		"disallowed_STD3_mapped",
		[
			32,
			1616,
			1617
		]
	],
	[
		[
			64611,
			64611
		],
		"disallowed_STD3_mapped",
		[
			32,
			1617,
			1648
		]
	],
	[
		[
			64612,
			64612
		],
		"mapped",
		[
			1574,
			1585
		]
	],
	[
		[
			64613,
			64613
		],
		"mapped",
		[
			1574,
			1586
		]
	],
	[
		[
			64614,
			64614
		],
		"mapped",
		[
			1574,
			1605
		]
	],
	[
		[
			64615,
			64615
		],
		"mapped",
		[
			1574,
			1606
		]
	],
	[
		[
			64616,
			64616
		],
		"mapped",
		[
			1574,
			1609
		]
	],
	[
		[
			64617,
			64617
		],
		"mapped",
		[
			1574,
			1610
		]
	],
	[
		[
			64618,
			64618
		],
		"mapped",
		[
			1576,
			1585
		]
	],
	[
		[
			64619,
			64619
		],
		"mapped",
		[
			1576,
			1586
		]
	],
	[
		[
			64620,
			64620
		],
		"mapped",
		[
			1576,
			1605
		]
	],
	[
		[
			64621,
			64621
		],
		"mapped",
		[
			1576,
			1606
		]
	],
	[
		[
			64622,
			64622
		],
		"mapped",
		[
			1576,
			1609
		]
	],
	[
		[
			64623,
			64623
		],
		"mapped",
		[
			1576,
			1610
		]
	],
	[
		[
			64624,
			64624
		],
		"mapped",
		[
			1578,
			1585
		]
	],
	[
		[
			64625,
			64625
		],
		"mapped",
		[
			1578,
			1586
		]
	],
	[
		[
			64626,
			64626
		],
		"mapped",
		[
			1578,
			1605
		]
	],
	[
		[
			64627,
			64627
		],
		"mapped",
		[
			1578,
			1606
		]
	],
	[
		[
			64628,
			64628
		],
		"mapped",
		[
			1578,
			1609
		]
	],
	[
		[
			64629,
			64629
		],
		"mapped",
		[
			1578,
			1610
		]
	],
	[
		[
			64630,
			64630
		],
		"mapped",
		[
			1579,
			1585
		]
	],
	[
		[
			64631,
			64631
		],
		"mapped",
		[
			1579,
			1586
		]
	],
	[
		[
			64632,
			64632
		],
		"mapped",
		[
			1579,
			1605
		]
	],
	[
		[
			64633,
			64633
		],
		"mapped",
		[
			1579,
			1606
		]
	],
	[
		[
			64634,
			64634
		],
		"mapped",
		[
			1579,
			1609
		]
	],
	[
		[
			64635,
			64635
		],
		"mapped",
		[
			1579,
			1610
		]
	],
	[
		[
			64636,
			64636
		],
		"mapped",
		[
			1601,
			1609
		]
	],
	[
		[
			64637,
			64637
		],
		"mapped",
		[
			1601,
			1610
		]
	],
	[
		[
			64638,
			64638
		],
		"mapped",
		[
			1602,
			1609
		]
	],
	[
		[
			64639,
			64639
		],
		"mapped",
		[
			1602,
			1610
		]
	],
	[
		[
			64640,
			64640
		],
		"mapped",
		[
			1603,
			1575
		]
	],
	[
		[
			64641,
			64641
		],
		"mapped",
		[
			1603,
			1604
		]
	],
	[
		[
			64642,
			64642
		],
		"mapped",
		[
			1603,
			1605
		]
	],
	[
		[
			64643,
			64643
		],
		"mapped",
		[
			1603,
			1609
		]
	],
	[
		[
			64644,
			64644
		],
		"mapped",
		[
			1603,
			1610
		]
	],
	[
		[
			64645,
			64645
		],
		"mapped",
		[
			1604,
			1605
		]
	],
	[
		[
			64646,
			64646
		],
		"mapped",
		[
			1604,
			1609
		]
	],
	[
		[
			64647,
			64647
		],
		"mapped",
		[
			1604,
			1610
		]
	],
	[
		[
			64648,
			64648
		],
		"mapped",
		[
			1605,
			1575
		]
	],
	[
		[
			64649,
			64649
		],
		"mapped",
		[
			1605,
			1605
		]
	],
	[
		[
			64650,
			64650
		],
		"mapped",
		[
			1606,
			1585
		]
	],
	[
		[
			64651,
			64651
		],
		"mapped",
		[
			1606,
			1586
		]
	],
	[
		[
			64652,
			64652
		],
		"mapped",
		[
			1606,
			1605
		]
	],
	[
		[
			64653,
			64653
		],
		"mapped",
		[
			1606,
			1606
		]
	],
	[
		[
			64654,
			64654
		],
		"mapped",
		[
			1606,
			1609
		]
	],
	[
		[
			64655,
			64655
		],
		"mapped",
		[
			1606,
			1610
		]
	],
	[
		[
			64656,
			64656
		],
		"mapped",
		[
			1609,
			1648
		]
	],
	[
		[
			64657,
			64657
		],
		"mapped",
		[
			1610,
			1585
		]
	],
	[
		[
			64658,
			64658
		],
		"mapped",
		[
			1610,
			1586
		]
	],
	[
		[
			64659,
			64659
		],
		"mapped",
		[
			1610,
			1605
		]
	],
	[
		[
			64660,
			64660
		],
		"mapped",
		[
			1610,
			1606
		]
	],
	[
		[
			64661,
			64661
		],
		"mapped",
		[
			1610,
			1609
		]
	],
	[
		[
			64662,
			64662
		],
		"mapped",
		[
			1610,
			1610
		]
	],
	[
		[
			64663,
			64663
		],
		"mapped",
		[
			1574,
			1580
		]
	],
	[
		[
			64664,
			64664
		],
		"mapped",
		[
			1574,
			1581
		]
	],
	[
		[
			64665,
			64665
		],
		"mapped",
		[
			1574,
			1582
		]
	],
	[
		[
			64666,
			64666
		],
		"mapped",
		[
			1574,
			1605
		]
	],
	[
		[
			64667,
			64667
		],
		"mapped",
		[
			1574,
			1607
		]
	],
	[
		[
			64668,
			64668
		],
		"mapped",
		[
			1576,
			1580
		]
	],
	[
		[
			64669,
			64669
		],
		"mapped",
		[
			1576,
			1581
		]
	],
	[
		[
			64670,
			64670
		],
		"mapped",
		[
			1576,
			1582
		]
	],
	[
		[
			64671,
			64671
		],
		"mapped",
		[
			1576,
			1605
		]
	],
	[
		[
			64672,
			64672
		],
		"mapped",
		[
			1576,
			1607
		]
	],
	[
		[
			64673,
			64673
		],
		"mapped",
		[
			1578,
			1580
		]
	],
	[
		[
			64674,
			64674
		],
		"mapped",
		[
			1578,
			1581
		]
	],
	[
		[
			64675,
			64675
		],
		"mapped",
		[
			1578,
			1582
		]
	],
	[
		[
			64676,
			64676
		],
		"mapped",
		[
			1578,
			1605
		]
	],
	[
		[
			64677,
			64677
		],
		"mapped",
		[
			1578,
			1607
		]
	],
	[
		[
			64678,
			64678
		],
		"mapped",
		[
			1579,
			1605
		]
	],
	[
		[
			64679,
			64679
		],
		"mapped",
		[
			1580,
			1581
		]
	],
	[
		[
			64680,
			64680
		],
		"mapped",
		[
			1580,
			1605
		]
	],
	[
		[
			64681,
			64681
		],
		"mapped",
		[
			1581,
			1580
		]
	],
	[
		[
			64682,
			64682
		],
		"mapped",
		[
			1581,
			1605
		]
	],
	[
		[
			64683,
			64683
		],
		"mapped",
		[
			1582,
			1580
		]
	],
	[
		[
			64684,
			64684
		],
		"mapped",
		[
			1582,
			1605
		]
	],
	[
		[
			64685,
			64685
		],
		"mapped",
		[
			1587,
			1580
		]
	],
	[
		[
			64686,
			64686
		],
		"mapped",
		[
			1587,
			1581
		]
	],
	[
		[
			64687,
			64687
		],
		"mapped",
		[
			1587,
			1582
		]
	],
	[
		[
			64688,
			64688
		],
		"mapped",
		[
			1587,
			1605
		]
	],
	[
		[
			64689,
			64689
		],
		"mapped",
		[
			1589,
			1581
		]
	],
	[
		[
			64690,
			64690
		],
		"mapped",
		[
			1589,
			1582
		]
	],
	[
		[
			64691,
			64691
		],
		"mapped",
		[
			1589,
			1605
		]
	],
	[
		[
			64692,
			64692
		],
		"mapped",
		[
			1590,
			1580
		]
	],
	[
		[
			64693,
			64693
		],
		"mapped",
		[
			1590,
			1581
		]
	],
	[
		[
			64694,
			64694
		],
		"mapped",
		[
			1590,
			1582
		]
	],
	[
		[
			64695,
			64695
		],
		"mapped",
		[
			1590,
			1605
		]
	],
	[
		[
			64696,
			64696
		],
		"mapped",
		[
			1591,
			1581
		]
	],
	[
		[
			64697,
			64697
		],
		"mapped",
		[
			1592,
			1605
		]
	],
	[
		[
			64698,
			64698
		],
		"mapped",
		[
			1593,
			1580
		]
	],
	[
		[
			64699,
			64699
		],
		"mapped",
		[
			1593,
			1605
		]
	],
	[
		[
			64700,
			64700
		],
		"mapped",
		[
			1594,
			1580
		]
	],
	[
		[
			64701,
			64701
		],
		"mapped",
		[
			1594,
			1605
		]
	],
	[
		[
			64702,
			64702
		],
		"mapped",
		[
			1601,
			1580
		]
	],
	[
		[
			64703,
			64703
		],
		"mapped",
		[
			1601,
			1581
		]
	],
	[
		[
			64704,
			64704
		],
		"mapped",
		[
			1601,
			1582
		]
	],
	[
		[
			64705,
			64705
		],
		"mapped",
		[
			1601,
			1605
		]
	],
	[
		[
			64706,
			64706
		],
		"mapped",
		[
			1602,
			1581
		]
	],
	[
		[
			64707,
			64707
		],
		"mapped",
		[
			1602,
			1605
		]
	],
	[
		[
			64708,
			64708
		],
		"mapped",
		[
			1603,
			1580
		]
	],
	[
		[
			64709,
			64709
		],
		"mapped",
		[
			1603,
			1581
		]
	],
	[
		[
			64710,
			64710
		],
		"mapped",
		[
			1603,
			1582
		]
	],
	[
		[
			64711,
			64711
		],
		"mapped",
		[
			1603,
			1604
		]
	],
	[
		[
			64712,
			64712
		],
		"mapped",
		[
			1603,
			1605
		]
	],
	[
		[
			64713,
			64713
		],
		"mapped",
		[
			1604,
			1580
		]
	],
	[
		[
			64714,
			64714
		],
		"mapped",
		[
			1604,
			1581
		]
	],
	[
		[
			64715,
			64715
		],
		"mapped",
		[
			1604,
			1582
		]
	],
	[
		[
			64716,
			64716
		],
		"mapped",
		[
			1604,
			1605
		]
	],
	[
		[
			64717,
			64717
		],
		"mapped",
		[
			1604,
			1607
		]
	],
	[
		[
			64718,
			64718
		],
		"mapped",
		[
			1605,
			1580
		]
	],
	[
		[
			64719,
			64719
		],
		"mapped",
		[
			1605,
			1581
		]
	],
	[
		[
			64720,
			64720
		],
		"mapped",
		[
			1605,
			1582
		]
	],
	[
		[
			64721,
			64721
		],
		"mapped",
		[
			1605,
			1605
		]
	],
	[
		[
			64722,
			64722
		],
		"mapped",
		[
			1606,
			1580
		]
	],
	[
		[
			64723,
			64723
		],
		"mapped",
		[
			1606,
			1581
		]
	],
	[
		[
			64724,
			64724
		],
		"mapped",
		[
			1606,
			1582
		]
	],
	[
		[
			64725,
			64725
		],
		"mapped",
		[
			1606,
			1605
		]
	],
	[
		[
			64726,
			64726
		],
		"mapped",
		[
			1606,
			1607
		]
	],
	[
		[
			64727,
			64727
		],
		"mapped",
		[
			1607,
			1580
		]
	],
	[
		[
			64728,
			64728
		],
		"mapped",
		[
			1607,
			1605
		]
	],
	[
		[
			64729,
			64729
		],
		"mapped",
		[
			1607,
			1648
		]
	],
	[
		[
			64730,
			64730
		],
		"mapped",
		[
			1610,
			1580
		]
	],
	[
		[
			64731,
			64731
		],
		"mapped",
		[
			1610,
			1581
		]
	],
	[
		[
			64732,
			64732
		],
		"mapped",
		[
			1610,
			1582
		]
	],
	[
		[
			64733,
			64733
		],
		"mapped",
		[
			1610,
			1605
		]
	],
	[
		[
			64734,
			64734
		],
		"mapped",
		[
			1610,
			1607
		]
	],
	[
		[
			64735,
			64735
		],
		"mapped",
		[
			1574,
			1605
		]
	],
	[
		[
			64736,
			64736
		],
		"mapped",
		[
			1574,
			1607
		]
	],
	[
		[
			64737,
			64737
		],
		"mapped",
		[
			1576,
			1605
		]
	],
	[
		[
			64738,
			64738
		],
		"mapped",
		[
			1576,
			1607
		]
	],
	[
		[
			64739,
			64739
		],
		"mapped",
		[
			1578,
			1605
		]
	],
	[
		[
			64740,
			64740
		],
		"mapped",
		[
			1578,
			1607
		]
	],
	[
		[
			64741,
			64741
		],
		"mapped",
		[
			1579,
			1605
		]
	],
	[
		[
			64742,
			64742
		],
		"mapped",
		[
			1579,
			1607
		]
	],
	[
		[
			64743,
			64743
		],
		"mapped",
		[
			1587,
			1605
		]
	],
	[
		[
			64744,
			64744
		],
		"mapped",
		[
			1587,
			1607
		]
	],
	[
		[
			64745,
			64745
		],
		"mapped",
		[
			1588,
			1605
		]
	],
	[
		[
			64746,
			64746
		],
		"mapped",
		[
			1588,
			1607
		]
	],
	[
		[
			64747,
			64747
		],
		"mapped",
		[
			1603,
			1604
		]
	],
	[
		[
			64748,
			64748
		],
		"mapped",
		[
			1603,
			1605
		]
	],
	[
		[
			64749,
			64749
		],
		"mapped",
		[
			1604,
			1605
		]
	],
	[
		[
			64750,
			64750
		],
		"mapped",
		[
			1606,
			1605
		]
	],
	[
		[
			64751,
			64751
		],
		"mapped",
		[
			1606,
			1607
		]
	],
	[
		[
			64752,
			64752
		],
		"mapped",
		[
			1610,
			1605
		]
	],
	[
		[
			64753,
			64753
		],
		"mapped",
		[
			1610,
			1607
		]
	],
	[
		[
			64754,
			64754
		],
		"mapped",
		[
			1600,
			1614,
			1617
		]
	],
	[
		[
			64755,
			64755
		],
		"mapped",
		[
			1600,
			1615,
			1617
		]
	],
	[
		[
			64756,
			64756
		],
		"mapped",
		[
			1600,
			1616,
			1617
		]
	],
	[
		[
			64757,
			64757
		],
		"mapped",
		[
			1591,
			1609
		]
	],
	[
		[
			64758,
			64758
		],
		"mapped",
		[
			1591,
			1610
		]
	],
	[
		[
			64759,
			64759
		],
		"mapped",
		[
			1593,
			1609
		]
	],
	[
		[
			64760,
			64760
		],
		"mapped",
		[
			1593,
			1610
		]
	],
	[
		[
			64761,
			64761
		],
		"mapped",
		[
			1594,
			1609
		]
	],
	[
		[
			64762,
			64762
		],
		"mapped",
		[
			1594,
			1610
		]
	],
	[
		[
			64763,
			64763
		],
		"mapped",
		[
			1587,
			1609
		]
	],
	[
		[
			64764,
			64764
		],
		"mapped",
		[
			1587,
			1610
		]
	],
	[
		[
			64765,
			64765
		],
		"mapped",
		[
			1588,
			1609
		]
	],
	[
		[
			64766,
			64766
		],
		"mapped",
		[
			1588,
			1610
		]
	],
	[
		[
			64767,
			64767
		],
		"mapped",
		[
			1581,
			1609
		]
	],
	[
		[
			64768,
			64768
		],
		"mapped",
		[
			1581,
			1610
		]
	],
	[
		[
			64769,
			64769
		],
		"mapped",
		[
			1580,
			1609
		]
	],
	[
		[
			64770,
			64770
		],
		"mapped",
		[
			1580,
			1610
		]
	],
	[
		[
			64771,
			64771
		],
		"mapped",
		[
			1582,
			1609
		]
	],
	[
		[
			64772,
			64772
		],
		"mapped",
		[
			1582,
			1610
		]
	],
	[
		[
			64773,
			64773
		],
		"mapped",
		[
			1589,
			1609
		]
	],
	[
		[
			64774,
			64774
		],
		"mapped",
		[
			1589,
			1610
		]
	],
	[
		[
			64775,
			64775
		],
		"mapped",
		[
			1590,
			1609
		]
	],
	[
		[
			64776,
			64776
		],
		"mapped",
		[
			1590,
			1610
		]
	],
	[
		[
			64777,
			64777
		],
		"mapped",
		[
			1588,
			1580
		]
	],
	[
		[
			64778,
			64778
		],
		"mapped",
		[
			1588,
			1581
		]
	],
	[
		[
			64779,
			64779
		],
		"mapped",
		[
			1588,
			1582
		]
	],
	[
		[
			64780,
			64780
		],
		"mapped",
		[
			1588,
			1605
		]
	],
	[
		[
			64781,
			64781
		],
		"mapped",
		[
			1588,
			1585
		]
	],
	[
		[
			64782,
			64782
		],
		"mapped",
		[
			1587,
			1585
		]
	],
	[
		[
			64783,
			64783
		],
		"mapped",
		[
			1589,
			1585
		]
	],
	[
		[
			64784,
			64784
		],
		"mapped",
		[
			1590,
			1585
		]
	],
	[
		[
			64785,
			64785
		],
		"mapped",
		[
			1591,
			1609
		]
	],
	[
		[
			64786,
			64786
		],
		"mapped",
		[
			1591,
			1610
		]
	],
	[
		[
			64787,
			64787
		],
		"mapped",
		[
			1593,
			1609
		]
	],
	[
		[
			64788,
			64788
		],
		"mapped",
		[
			1593,
			1610
		]
	],
	[
		[
			64789,
			64789
		],
		"mapped",
		[
			1594,
			1609
		]
	],
	[
		[
			64790,
			64790
		],
		"mapped",
		[
			1594,
			1610
		]
	],
	[
		[
			64791,
			64791
		],
		"mapped",
		[
			1587,
			1609
		]
	],
	[
		[
			64792,
			64792
		],
		"mapped",
		[
			1587,
			1610
		]
	],
	[
		[
			64793,
			64793
		],
		"mapped",
		[
			1588,
			1609
		]
	],
	[
		[
			64794,
			64794
		],
		"mapped",
		[
			1588,
			1610
		]
	],
	[
		[
			64795,
			64795
		],
		"mapped",
		[
			1581,
			1609
		]
	],
	[
		[
			64796,
			64796
		],
		"mapped",
		[
			1581,
			1610
		]
	],
	[
		[
			64797,
			64797
		],
		"mapped",
		[
			1580,
			1609
		]
	],
	[
		[
			64798,
			64798
		],
		"mapped",
		[
			1580,
			1610
		]
	],
	[
		[
			64799,
			64799
		],
		"mapped",
		[
			1582,
			1609
		]
	],
	[
		[
			64800,
			64800
		],
		"mapped",
		[
			1582,
			1610
		]
	],
	[
		[
			64801,
			64801
		],
		"mapped",
		[
			1589,
			1609
		]
	],
	[
		[
			64802,
			64802
		],
		"mapped",
		[
			1589,
			1610
		]
	],
	[
		[
			64803,
			64803
		],
		"mapped",
		[
			1590,
			1609
		]
	],
	[
		[
			64804,
			64804
		],
		"mapped",
		[
			1590,
			1610
		]
	],
	[
		[
			64805,
			64805
		],
		"mapped",
		[
			1588,
			1580
		]
	],
	[
		[
			64806,
			64806
		],
		"mapped",
		[
			1588,
			1581
		]
	],
	[
		[
			64807,
			64807
		],
		"mapped",
		[
			1588,
			1582
		]
	],
	[
		[
			64808,
			64808
		],
		"mapped",
		[
			1588,
			1605
		]
	],
	[
		[
			64809,
			64809
		],
		"mapped",
		[
			1588,
			1585
		]
	],
	[
		[
			64810,
			64810
		],
		"mapped",
		[
			1587,
			1585
		]
	],
	[
		[
			64811,
			64811
		],
		"mapped",
		[
			1589,
			1585
		]
	],
	[
		[
			64812,
			64812
		],
		"mapped",
		[
			1590,
			1585
		]
	],
	[
		[
			64813,
			64813
		],
		"mapped",
		[
			1588,
			1580
		]
	],
	[
		[
			64814,
			64814
		],
		"mapped",
		[
			1588,
			1581
		]
	],
	[
		[
			64815,
			64815
		],
		"mapped",
		[
			1588,
			1582
		]
	],
	[
		[
			64816,
			64816
		],
		"mapped",
		[
			1588,
			1605
		]
	],
	[
		[
			64817,
			64817
		],
		"mapped",
		[
			1587,
			1607
		]
	],
	[
		[
			64818,
			64818
		],
		"mapped",
		[
			1588,
			1607
		]
	],
	[
		[
			64819,
			64819
		],
		"mapped",
		[
			1591,
			1605
		]
	],
	[
		[
			64820,
			64820
		],
		"mapped",
		[
			1587,
			1580
		]
	],
	[
		[
			64821,
			64821
		],
		"mapped",
		[
			1587,
			1581
		]
	],
	[
		[
			64822,
			64822
		],
		"mapped",
		[
			1587,
			1582
		]
	],
	[
		[
			64823,
			64823
		],
		"mapped",
		[
			1588,
			1580
		]
	],
	[
		[
			64824,
			64824
		],
		"mapped",
		[
			1588,
			1581
		]
	],
	[
		[
			64825,
			64825
		],
		"mapped",
		[
			1588,
			1582
		]
	],
	[
		[
			64826,
			64826
		],
		"mapped",
		[
			1591,
			1605
		]
	],
	[
		[
			64827,
			64827
		],
		"mapped",
		[
			1592,
			1605
		]
	],
	[
		[
			64828,
			64829
		],
		"mapped",
		[
			1575,
			1611
		]
	],
	[
		[
			64830,
			64831
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			64832,
			64847
		],
		"disallowed"
	],
	[
		[
			64848,
			64848
		],
		"mapped",
		[
			1578,
			1580,
			1605
		]
	],
	[
		[
			64849,
			64850
		],
		"mapped",
		[
			1578,
			1581,
			1580
		]
	],
	[
		[
			64851,
			64851
		],
		"mapped",
		[
			1578,
			1581,
			1605
		]
	],
	[
		[
			64852,
			64852
		],
		"mapped",
		[
			1578,
			1582,
			1605
		]
	],
	[
		[
			64853,
			64853
		],
		"mapped",
		[
			1578,
			1605,
			1580
		]
	],
	[
		[
			64854,
			64854
		],
		"mapped",
		[
			1578,
			1605,
			1581
		]
	],
	[
		[
			64855,
			64855
		],
		"mapped",
		[
			1578,
			1605,
			1582
		]
	],
	[
		[
			64856,
			64857
		],
		"mapped",
		[
			1580,
			1605,
			1581
		]
	],
	[
		[
			64858,
			64858
		],
		"mapped",
		[
			1581,
			1605,
			1610
		]
	],
	[
		[
			64859,
			64859
		],
		"mapped",
		[
			1581,
			1605,
			1609
		]
	],
	[
		[
			64860,
			64860
		],
		"mapped",
		[
			1587,
			1581,
			1580
		]
	],
	[
		[
			64861,
			64861
		],
		"mapped",
		[
			1587,
			1580,
			1581
		]
	],
	[
		[
			64862,
			64862
		],
		"mapped",
		[
			1587,
			1580,
			1609
		]
	],
	[
		[
			64863,
			64864
		],
		"mapped",
		[
			1587,
			1605,
			1581
		]
	],
	[
		[
			64865,
			64865
		],
		"mapped",
		[
			1587,
			1605,
			1580
		]
	],
	[
		[
			64866,
			64867
		],
		"mapped",
		[
			1587,
			1605,
			1605
		]
	],
	[
		[
			64868,
			64869
		],
		"mapped",
		[
			1589,
			1581,
			1581
		]
	],
	[
		[
			64870,
			64870
		],
		"mapped",
		[
			1589,
			1605,
			1605
		]
	],
	[
		[
			64871,
			64872
		],
		"mapped",
		[
			1588,
			1581,
			1605
		]
	],
	[
		[
			64873,
			64873
		],
		"mapped",
		[
			1588,
			1580,
			1610
		]
	],
	[
		[
			64874,
			64875
		],
		"mapped",
		[
			1588,
			1605,
			1582
		]
	],
	[
		[
			64876,
			64877
		],
		"mapped",
		[
			1588,
			1605,
			1605
		]
	],
	[
		[
			64878,
			64878
		],
		"mapped",
		[
			1590,
			1581,
			1609
		]
	],
	[
		[
			64879,
			64880
		],
		"mapped",
		[
			1590,
			1582,
			1605
		]
	],
	[
		[
			64881,
			64882
		],
		"mapped",
		[
			1591,
			1605,
			1581
		]
	],
	[
		[
			64883,
			64883
		],
		"mapped",
		[
			1591,
			1605,
			1605
		]
	],
	[
		[
			64884,
			64884
		],
		"mapped",
		[
			1591,
			1605,
			1610
		]
	],
	[
		[
			64885,
			64885
		],
		"mapped",
		[
			1593,
			1580,
			1605
		]
	],
	[
		[
			64886,
			64887
		],
		"mapped",
		[
			1593,
			1605,
			1605
		]
	],
	[
		[
			64888,
			64888
		],
		"mapped",
		[
			1593,
			1605,
			1609
		]
	],
	[
		[
			64889,
			64889
		],
		"mapped",
		[
			1594,
			1605,
			1605
		]
	],
	[
		[
			64890,
			64890
		],
		"mapped",
		[
			1594,
			1605,
			1610
		]
	],
	[
		[
			64891,
			64891
		],
		"mapped",
		[
			1594,
			1605,
			1609
		]
	],
	[
		[
			64892,
			64893
		],
		"mapped",
		[
			1601,
			1582,
			1605
		]
	],
	[
		[
			64894,
			64894
		],
		"mapped",
		[
			1602,
			1605,
			1581
		]
	],
	[
		[
			64895,
			64895
		],
		"mapped",
		[
			1602,
			1605,
			1605
		]
	],
	[
		[
			64896,
			64896
		],
		"mapped",
		[
			1604,
			1581,
			1605
		]
	],
	[
		[
			64897,
			64897
		],
		"mapped",
		[
			1604,
			1581,
			1610
		]
	],
	[
		[
			64898,
			64898
		],
		"mapped",
		[
			1604,
			1581,
			1609
		]
	],
	[
		[
			64899,
			64900
		],
		"mapped",
		[
			1604,
			1580,
			1580
		]
	],
	[
		[
			64901,
			64902
		],
		"mapped",
		[
			1604,
			1582,
			1605
		]
	],
	[
		[
			64903,
			64904
		],
		"mapped",
		[
			1604,
			1605,
			1581
		]
	],
	[
		[
			64905,
			64905
		],
		"mapped",
		[
			1605,
			1581,
			1580
		]
	],
	[
		[
			64906,
			64906
		],
		"mapped",
		[
			1605,
			1581,
			1605
		]
	],
	[
		[
			64907,
			64907
		],
		"mapped",
		[
			1605,
			1581,
			1610
		]
	],
	[
		[
			64908,
			64908
		],
		"mapped",
		[
			1605,
			1580,
			1581
		]
	],
	[
		[
			64909,
			64909
		],
		"mapped",
		[
			1605,
			1580,
			1605
		]
	],
	[
		[
			64910,
			64910
		],
		"mapped",
		[
			1605,
			1582,
			1580
		]
	],
	[
		[
			64911,
			64911
		],
		"mapped",
		[
			1605,
			1582,
			1605
		]
	],
	[
		[
			64912,
			64913
		],
		"disallowed"
	],
	[
		[
			64914,
			64914
		],
		"mapped",
		[
			1605,
			1580,
			1582
		]
	],
	[
		[
			64915,
			64915
		],
		"mapped",
		[
			1607,
			1605,
			1580
		]
	],
	[
		[
			64916,
			64916
		],
		"mapped",
		[
			1607,
			1605,
			1605
		]
	],
	[
		[
			64917,
			64917
		],
		"mapped",
		[
			1606,
			1581,
			1605
		]
	],
	[
		[
			64918,
			64918
		],
		"mapped",
		[
			1606,
			1581,
			1609
		]
	],
	[
		[
			64919,
			64920
		],
		"mapped",
		[
			1606,
			1580,
			1605
		]
	],
	[
		[
			64921,
			64921
		],
		"mapped",
		[
			1606,
			1580,
			1609
		]
	],
	[
		[
			64922,
			64922
		],
		"mapped",
		[
			1606,
			1605,
			1610
		]
	],
	[
		[
			64923,
			64923
		],
		"mapped",
		[
			1606,
			1605,
			1609
		]
	],
	[
		[
			64924,
			64925
		],
		"mapped",
		[
			1610,
			1605,
			1605
		]
	],
	[
		[
			64926,
			64926
		],
		"mapped",
		[
			1576,
			1582,
			1610
		]
	],
	[
		[
			64927,
			64927
		],
		"mapped",
		[
			1578,
			1580,
			1610
		]
	],
	[
		[
			64928,
			64928
		],
		"mapped",
		[
			1578,
			1580,
			1609
		]
	],
	[
		[
			64929,
			64929
		],
		"mapped",
		[
			1578,
			1582,
			1610
		]
	],
	[
		[
			64930,
			64930
		],
		"mapped",
		[
			1578,
			1582,
			1609
		]
	],
	[
		[
			64931,
			64931
		],
		"mapped",
		[
			1578,
			1605,
			1610
		]
	],
	[
		[
			64932,
			64932
		],
		"mapped",
		[
			1578,
			1605,
			1609
		]
	],
	[
		[
			64933,
			64933
		],
		"mapped",
		[
			1580,
			1605,
			1610
		]
	],
	[
		[
			64934,
			64934
		],
		"mapped",
		[
			1580,
			1581,
			1609
		]
	],
	[
		[
			64935,
			64935
		],
		"mapped",
		[
			1580,
			1605,
			1609
		]
	],
	[
		[
			64936,
			64936
		],
		"mapped",
		[
			1587,
			1582,
			1609
		]
	],
	[
		[
			64937,
			64937
		],
		"mapped",
		[
			1589,
			1581,
			1610
		]
	],
	[
		[
			64938,
			64938
		],
		"mapped",
		[
			1588,
			1581,
			1610
		]
	],
	[
		[
			64939,
			64939
		],
		"mapped",
		[
			1590,
			1581,
			1610
		]
	],
	[
		[
			64940,
			64940
		],
		"mapped",
		[
			1604,
			1580,
			1610
		]
	],
	[
		[
			64941,
			64941
		],
		"mapped",
		[
			1604,
			1605,
			1610
		]
	],
	[
		[
			64942,
			64942
		],
		"mapped",
		[
			1610,
			1581,
			1610
		]
	],
	[
		[
			64943,
			64943
		],
		"mapped",
		[
			1610,
			1580,
			1610
		]
	],
	[
		[
			64944,
			64944
		],
		"mapped",
		[
			1610,
			1605,
			1610
		]
	],
	[
		[
			64945,
			64945
		],
		"mapped",
		[
			1605,
			1605,
			1610
		]
	],
	[
		[
			64946,
			64946
		],
		"mapped",
		[
			1602,
			1605,
			1610
		]
	],
	[
		[
			64947,
			64947
		],
		"mapped",
		[
			1606,
			1581,
			1610
		]
	],
	[
		[
			64948,
			64948
		],
		"mapped",
		[
			1602,
			1605,
			1581
		]
	],
	[
		[
			64949,
			64949
		],
		"mapped",
		[
			1604,
			1581,
			1605
		]
	],
	[
		[
			64950,
			64950
		],
		"mapped",
		[
			1593,
			1605,
			1610
		]
	],
	[
		[
			64951,
			64951
		],
		"mapped",
		[
			1603,
			1605,
			1610
		]
	],
	[
		[
			64952,
			64952
		],
		"mapped",
		[
			1606,
			1580,
			1581
		]
	],
	[
		[
			64953,
			64953
		],
		"mapped",
		[
			1605,
			1582,
			1610
		]
	],
	[
		[
			64954,
			64954
		],
		"mapped",
		[
			1604,
			1580,
			1605
		]
	],
	[
		[
			64955,
			64955
		],
		"mapped",
		[
			1603,
			1605,
			1605
		]
	],
	[
		[
			64956,
			64956
		],
		"mapped",
		[
			1604,
			1580,
			1605
		]
	],
	[
		[
			64957,
			64957
		],
		"mapped",
		[
			1606,
			1580,
			1581
		]
	],
	[
		[
			64958,
			64958
		],
		"mapped",
		[
			1580,
			1581,
			1610
		]
	],
	[
		[
			64959,
			64959
		],
		"mapped",
		[
			1581,
			1580,
			1610
		]
	],
	[
		[
			64960,
			64960
		],
		"mapped",
		[
			1605,
			1580,
			1610
		]
	],
	[
		[
			64961,
			64961
		],
		"mapped",
		[
			1601,
			1605,
			1610
		]
	],
	[
		[
			64962,
			64962
		],
		"mapped",
		[
			1576,
			1581,
			1610
		]
	],
	[
		[
			64963,
			64963
		],
		"mapped",
		[
			1603,
			1605,
			1605
		]
	],
	[
		[
			64964,
			64964
		],
		"mapped",
		[
			1593,
			1580,
			1605
		]
	],
	[
		[
			64965,
			64965
		],
		"mapped",
		[
			1589,
			1605,
			1605
		]
	],
	[
		[
			64966,
			64966
		],
		"mapped",
		[
			1587,
			1582,
			1610
		]
	],
	[
		[
			64967,
			64967
		],
		"mapped",
		[
			1606,
			1580,
			1610
		]
	],
	[
		[
			64968,
			64975
		],
		"disallowed"
	],
	[
		[
			64976,
			65007
		],
		"disallowed"
	],
	[
		[
			65008,
			65008
		],
		"mapped",
		[
			1589,
			1604,
			1746
		]
	],
	[
		[
			65009,
			65009
		],
		"mapped",
		[
			1602,
			1604,
			1746
		]
	],
	[
		[
			65010,
			65010
		],
		"mapped",
		[
			1575,
			1604,
			1604,
			1607
		]
	],
	[
		[
			65011,
			65011
		],
		"mapped",
		[
			1575,
			1603,
			1576,
			1585
		]
	],
	[
		[
			65012,
			65012
		],
		"mapped",
		[
			1605,
			1581,
			1605,
			1583
		]
	],
	[
		[
			65013,
			65013
		],
		"mapped",
		[
			1589,
			1604,
			1593,
			1605
		]
	],
	[
		[
			65014,
			65014
		],
		"mapped",
		[
			1585,
			1587,
			1608,
			1604
		]
	],
	[
		[
			65015,
			65015
		],
		"mapped",
		[
			1593,
			1604,
			1610,
			1607
		]
	],
	[
		[
			65016,
			65016
		],
		"mapped",
		[
			1608,
			1587,
			1604,
			1605
		]
	],
	[
		[
			65017,
			65017
		],
		"mapped",
		[
			1589,
			1604,
			1609
		]
	],
	[
		[
			65018,
			65018
		],
		"disallowed_STD3_mapped",
		[
			1589,
			1604,
			1609,
			32,
			1575,
			1604,
			1604,
			1607,
			32,
			1593,
			1604,
			1610,
			1607,
			32,
			1608,
			1587,
			1604,
			1605
		]
	],
	[
		[
			65019,
			65019
		],
		"disallowed_STD3_mapped",
		[
			1580,
			1604,
			32,
			1580,
			1604,
			1575,
			1604,
			1607
		]
	],
	[
		[
			65020,
			65020
		],
		"mapped",
		[
			1585,
			1740,
			1575,
			1604
		]
	],
	[
		[
			65021,
			65021
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65022,
			65023
		],
		"disallowed"
	],
	[
		[
			65024,
			65039
		],
		"ignored"
	],
	[
		[
			65040,
			65040
		],
		"disallowed_STD3_mapped",
		[
			44
		]
	],
	[
		[
			65041,
			65041
		],
		"mapped",
		[
			12289
		]
	],
	[
		[
			65042,
			65042
		],
		"disallowed"
	],
	[
		[
			65043,
			65043
		],
		"disallowed_STD3_mapped",
		[
			58
		]
	],
	[
		[
			65044,
			65044
		],
		"disallowed_STD3_mapped",
		[
			59
		]
	],
	[
		[
			65045,
			65045
		],
		"disallowed_STD3_mapped",
		[
			33
		]
	],
	[
		[
			65046,
			65046
		],
		"disallowed_STD3_mapped",
		[
			63
		]
	],
	[
		[
			65047,
			65047
		],
		"mapped",
		[
			12310
		]
	],
	[
		[
			65048,
			65048
		],
		"mapped",
		[
			12311
		]
	],
	[
		[
			65049,
			65049
		],
		"disallowed"
	],
	[
		[
			65050,
			65055
		],
		"disallowed"
	],
	[
		[
			65056,
			65059
		],
		"valid"
	],
	[
		[
			65060,
			65062
		],
		"valid"
	],
	[
		[
			65063,
			65069
		],
		"valid"
	],
	[
		[
			65070,
			65071
		],
		"valid"
	],
	[
		[
			65072,
			65072
		],
		"disallowed"
	],
	[
		[
			65073,
			65073
		],
		"mapped",
		[
			8212
		]
	],
	[
		[
			65074,
			65074
		],
		"mapped",
		[
			8211
		]
	],
	[
		[
			65075,
			65076
		],
		"disallowed_STD3_mapped",
		[
			95
		]
	],
	[
		[
			65077,
			65077
		],
		"disallowed_STD3_mapped",
		[
			40
		]
	],
	[
		[
			65078,
			65078
		],
		"disallowed_STD3_mapped",
		[
			41
		]
	],
	[
		[
			65079,
			65079
		],
		"disallowed_STD3_mapped",
		[
			123
		]
	],
	[
		[
			65080,
			65080
		],
		"disallowed_STD3_mapped",
		[
			125
		]
	],
	[
		[
			65081,
			65081
		],
		"mapped",
		[
			12308
		]
	],
	[
		[
			65082,
			65082
		],
		"mapped",
		[
			12309
		]
	],
	[
		[
			65083,
			65083
		],
		"mapped",
		[
			12304
		]
	],
	[
		[
			65084,
			65084
		],
		"mapped",
		[
			12305
		]
	],
	[
		[
			65085,
			65085
		],
		"mapped",
		[
			12298
		]
	],
	[
		[
			65086,
			65086
		],
		"mapped",
		[
			12299
		]
	],
	[
		[
			65087,
			65087
		],
		"mapped",
		[
			12296
		]
	],
	[
		[
			65088,
			65088
		],
		"mapped",
		[
			12297
		]
	],
	[
		[
			65089,
			65089
		],
		"mapped",
		[
			12300
		]
	],
	[
		[
			65090,
			65090
		],
		"mapped",
		[
			12301
		]
	],
	[
		[
			65091,
			65091
		],
		"mapped",
		[
			12302
		]
	],
	[
		[
			65092,
			65092
		],
		"mapped",
		[
			12303
		]
	],
	[
		[
			65093,
			65094
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65095,
			65095
		],
		"disallowed_STD3_mapped",
		[
			91
		]
	],
	[
		[
			65096,
			65096
		],
		"disallowed_STD3_mapped",
		[
			93
		]
	],
	[
		[
			65097,
			65100
		],
		"disallowed_STD3_mapped",
		[
			32,
			773
		]
	],
	[
		[
			65101,
			65103
		],
		"disallowed_STD3_mapped",
		[
			95
		]
	],
	[
		[
			65104,
			65104
		],
		"disallowed_STD3_mapped",
		[
			44
		]
	],
	[
		[
			65105,
			65105
		],
		"mapped",
		[
			12289
		]
	],
	[
		[
			65106,
			65106
		],
		"disallowed"
	],
	[
		[
			65107,
			65107
		],
		"disallowed"
	],
	[
		[
			65108,
			65108
		],
		"disallowed_STD3_mapped",
		[
			59
		]
	],
	[
		[
			65109,
			65109
		],
		"disallowed_STD3_mapped",
		[
			58
		]
	],
	[
		[
			65110,
			65110
		],
		"disallowed_STD3_mapped",
		[
			63
		]
	],
	[
		[
			65111,
			65111
		],
		"disallowed_STD3_mapped",
		[
			33
		]
	],
	[
		[
			65112,
			65112
		],
		"mapped",
		[
			8212
		]
	],
	[
		[
			65113,
			65113
		],
		"disallowed_STD3_mapped",
		[
			40
		]
	],
	[
		[
			65114,
			65114
		],
		"disallowed_STD3_mapped",
		[
			41
		]
	],
	[
		[
			65115,
			65115
		],
		"disallowed_STD3_mapped",
		[
			123
		]
	],
	[
		[
			65116,
			65116
		],
		"disallowed_STD3_mapped",
		[
			125
		]
	],
	[
		[
			65117,
			65117
		],
		"mapped",
		[
			12308
		]
	],
	[
		[
			65118,
			65118
		],
		"mapped",
		[
			12309
		]
	],
	[
		[
			65119,
			65119
		],
		"disallowed_STD3_mapped",
		[
			35
		]
	],
	[
		[
			65120,
			65120
		],
		"disallowed_STD3_mapped",
		[
			38
		]
	],
	[
		[
			65121,
			65121
		],
		"disallowed_STD3_mapped",
		[
			42
		]
	],
	[
		[
			65122,
			65122
		],
		"disallowed_STD3_mapped",
		[
			43
		]
	],
	[
		[
			65123,
			65123
		],
		"mapped",
		[
			45
		]
	],
	[
		[
			65124,
			65124
		],
		"disallowed_STD3_mapped",
		[
			60
		]
	],
	[
		[
			65125,
			65125
		],
		"disallowed_STD3_mapped",
		[
			62
		]
	],
	[
		[
			65126,
			65126
		],
		"disallowed_STD3_mapped",
		[
			61
		]
	],
	[
		[
			65127,
			65127
		],
		"disallowed"
	],
	[
		[
			65128,
			65128
		],
		"disallowed_STD3_mapped",
		[
			92
		]
	],
	[
		[
			65129,
			65129
		],
		"disallowed_STD3_mapped",
		[
			36
		]
	],
	[
		[
			65130,
			65130
		],
		"disallowed_STD3_mapped",
		[
			37
		]
	],
	[
		[
			65131,
			65131
		],
		"disallowed_STD3_mapped",
		[
			64
		]
	],
	[
		[
			65132,
			65135
		],
		"disallowed"
	],
	[
		[
			65136,
			65136
		],
		"disallowed_STD3_mapped",
		[
			32,
			1611
		]
	],
	[
		[
			65137,
			65137
		],
		"mapped",
		[
			1600,
			1611
		]
	],
	[
		[
			65138,
			65138
		],
		"disallowed_STD3_mapped",
		[
			32,
			1612
		]
	],
	[
		[
			65139,
			65139
		],
		"valid"
	],
	[
		[
			65140,
			65140
		],
		"disallowed_STD3_mapped",
		[
			32,
			1613
		]
	],
	[
		[
			65141,
			65141
		],
		"disallowed"
	],
	[
		[
			65142,
			65142
		],
		"disallowed_STD3_mapped",
		[
			32,
			1614
		]
	],
	[
		[
			65143,
			65143
		],
		"mapped",
		[
			1600,
			1614
		]
	],
	[
		[
			65144,
			65144
		],
		"disallowed_STD3_mapped",
		[
			32,
			1615
		]
	],
	[
		[
			65145,
			65145
		],
		"mapped",
		[
			1600,
			1615
		]
	],
	[
		[
			65146,
			65146
		],
		"disallowed_STD3_mapped",
		[
			32,
			1616
		]
	],
	[
		[
			65147,
			65147
		],
		"mapped",
		[
			1600,
			1616
		]
	],
	[
		[
			65148,
			65148
		],
		"disallowed_STD3_mapped",
		[
			32,
			1617
		]
	],
	[
		[
			65149,
			65149
		],
		"mapped",
		[
			1600,
			1617
		]
	],
	[
		[
			65150,
			65150
		],
		"disallowed_STD3_mapped",
		[
			32,
			1618
		]
	],
	[
		[
			65151,
			65151
		],
		"mapped",
		[
			1600,
			1618
		]
	],
	[
		[
			65152,
			65152
		],
		"mapped",
		[
			1569
		]
	],
	[
		[
			65153,
			65154
		],
		"mapped",
		[
			1570
		]
	],
	[
		[
			65155,
			65156
		],
		"mapped",
		[
			1571
		]
	],
	[
		[
			65157,
			65158
		],
		"mapped",
		[
			1572
		]
	],
	[
		[
			65159,
			65160
		],
		"mapped",
		[
			1573
		]
	],
	[
		[
			65161,
			65164
		],
		"mapped",
		[
			1574
		]
	],
	[
		[
			65165,
			65166
		],
		"mapped",
		[
			1575
		]
	],
	[
		[
			65167,
			65170
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			65171,
			65172
		],
		"mapped",
		[
			1577
		]
	],
	[
		[
			65173,
			65176
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			65177,
			65180
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			65181,
			65184
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			65185,
			65188
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			65189,
			65192
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			65193,
			65194
		],
		"mapped",
		[
			1583
		]
	],
	[
		[
			65195,
			65196
		],
		"mapped",
		[
			1584
		]
	],
	[
		[
			65197,
			65198
		],
		"mapped",
		[
			1585
		]
	],
	[
		[
			65199,
			65200
		],
		"mapped",
		[
			1586
		]
	],
	[
		[
			65201,
			65204
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			65205,
			65208
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			65209,
			65212
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			65213,
			65216
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			65217,
			65220
		],
		"mapped",
		[
			1591
		]
	],
	[
		[
			65221,
			65224
		],
		"mapped",
		[
			1592
		]
	],
	[
		[
			65225,
			65228
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			65229,
			65232
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			65233,
			65236
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			65237,
			65240
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			65241,
			65244
		],
		"mapped",
		[
			1603
		]
	],
	[
		[
			65245,
			65248
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			65249,
			65252
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			65253,
			65256
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			65257,
			65260
		],
		"mapped",
		[
			1607
		]
	],
	[
		[
			65261,
			65262
		],
		"mapped",
		[
			1608
		]
	],
	[
		[
			65263,
			65264
		],
		"mapped",
		[
			1609
		]
	],
	[
		[
			65265,
			65268
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			65269,
			65270
		],
		"mapped",
		[
			1604,
			1570
		]
	],
	[
		[
			65271,
			65272
		],
		"mapped",
		[
			1604,
			1571
		]
	],
	[
		[
			65273,
			65274
		],
		"mapped",
		[
			1604,
			1573
		]
	],
	[
		[
			65275,
			65276
		],
		"mapped",
		[
			1604,
			1575
		]
	],
	[
		[
			65277,
			65278
		],
		"disallowed"
	],
	[
		[
			65279,
			65279
		],
		"ignored"
	],
	[
		[
			65280,
			65280
		],
		"disallowed"
	],
	[
		[
			65281,
			65281
		],
		"disallowed_STD3_mapped",
		[
			33
		]
	],
	[
		[
			65282,
			65282
		],
		"disallowed_STD3_mapped",
		[
			34
		]
	],
	[
		[
			65283,
			65283
		],
		"disallowed_STD3_mapped",
		[
			35
		]
	],
	[
		[
			65284,
			65284
		],
		"disallowed_STD3_mapped",
		[
			36
		]
	],
	[
		[
			65285,
			65285
		],
		"disallowed_STD3_mapped",
		[
			37
		]
	],
	[
		[
			65286,
			65286
		],
		"disallowed_STD3_mapped",
		[
			38
		]
	],
	[
		[
			65287,
			65287
		],
		"disallowed_STD3_mapped",
		[
			39
		]
	],
	[
		[
			65288,
			65288
		],
		"disallowed_STD3_mapped",
		[
			40
		]
	],
	[
		[
			65289,
			65289
		],
		"disallowed_STD3_mapped",
		[
			41
		]
	],
	[
		[
			65290,
			65290
		],
		"disallowed_STD3_mapped",
		[
			42
		]
	],
	[
		[
			65291,
			65291
		],
		"disallowed_STD3_mapped",
		[
			43
		]
	],
	[
		[
			65292,
			65292
		],
		"disallowed_STD3_mapped",
		[
			44
		]
	],
	[
		[
			65293,
			65293
		],
		"mapped",
		[
			45
		]
	],
	[
		[
			65294,
			65294
		],
		"mapped",
		[
			46
		]
	],
	[
		[
			65295,
			65295
		],
		"disallowed_STD3_mapped",
		[
			47
		]
	],
	[
		[
			65296,
			65296
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			65297,
			65297
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			65298,
			65298
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			65299,
			65299
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			65300,
			65300
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			65301,
			65301
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			65302,
			65302
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			65303,
			65303
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			65304,
			65304
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			65305,
			65305
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			65306,
			65306
		],
		"disallowed_STD3_mapped",
		[
			58
		]
	],
	[
		[
			65307,
			65307
		],
		"disallowed_STD3_mapped",
		[
			59
		]
	],
	[
		[
			65308,
			65308
		],
		"disallowed_STD3_mapped",
		[
			60
		]
	],
	[
		[
			65309,
			65309
		],
		"disallowed_STD3_mapped",
		[
			61
		]
	],
	[
		[
			65310,
			65310
		],
		"disallowed_STD3_mapped",
		[
			62
		]
	],
	[
		[
			65311,
			65311
		],
		"disallowed_STD3_mapped",
		[
			63
		]
	],
	[
		[
			65312,
			65312
		],
		"disallowed_STD3_mapped",
		[
			64
		]
	],
	[
		[
			65313,
			65313
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			65314,
			65314
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			65315,
			65315
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			65316,
			65316
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			65317,
			65317
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			65318,
			65318
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			65319,
			65319
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			65320,
			65320
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			65321,
			65321
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			65322,
			65322
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			65323,
			65323
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			65324,
			65324
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			65325,
			65325
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			65326,
			65326
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			65327,
			65327
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			65328,
			65328
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			65329,
			65329
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			65330,
			65330
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			65331,
			65331
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			65332,
			65332
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			65333,
			65333
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			65334,
			65334
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			65335,
			65335
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			65336,
			65336
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			65337,
			65337
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			65338,
			65338
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			65339,
			65339
		],
		"disallowed_STD3_mapped",
		[
			91
		]
	],
	[
		[
			65340,
			65340
		],
		"disallowed_STD3_mapped",
		[
			92
		]
	],
	[
		[
			65341,
			65341
		],
		"disallowed_STD3_mapped",
		[
			93
		]
	],
	[
		[
			65342,
			65342
		],
		"disallowed_STD3_mapped",
		[
			94
		]
	],
	[
		[
			65343,
			65343
		],
		"disallowed_STD3_mapped",
		[
			95
		]
	],
	[
		[
			65344,
			65344
		],
		"disallowed_STD3_mapped",
		[
			96
		]
	],
	[
		[
			65345,
			65345
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			65346,
			65346
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			65347,
			65347
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			65348,
			65348
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			65349,
			65349
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			65350,
			65350
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			65351,
			65351
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			65352,
			65352
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			65353,
			65353
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			65354,
			65354
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			65355,
			65355
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			65356,
			65356
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			65357,
			65357
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			65358,
			65358
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			65359,
			65359
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			65360,
			65360
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			65361,
			65361
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			65362,
			65362
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			65363,
			65363
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			65364,
			65364
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			65365,
			65365
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			65366,
			65366
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			65367,
			65367
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			65368,
			65368
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			65369,
			65369
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			65370,
			65370
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			65371,
			65371
		],
		"disallowed_STD3_mapped",
		[
			123
		]
	],
	[
		[
			65372,
			65372
		],
		"disallowed_STD3_mapped",
		[
			124
		]
	],
	[
		[
			65373,
			65373
		],
		"disallowed_STD3_mapped",
		[
			125
		]
	],
	[
		[
			65374,
			65374
		],
		"disallowed_STD3_mapped",
		[
			126
		]
	],
	[
		[
			65375,
			65375
		],
		"mapped",
		[
			10629
		]
	],
	[
		[
			65376,
			65376
		],
		"mapped",
		[
			10630
		]
	],
	[
		[
			65377,
			65377
		],
		"mapped",
		[
			46
		]
	],
	[
		[
			65378,
			65378
		],
		"mapped",
		[
			12300
		]
	],
	[
		[
			65379,
			65379
		],
		"mapped",
		[
			12301
		]
	],
	[
		[
			65380,
			65380
		],
		"mapped",
		[
			12289
		]
	],
	[
		[
			65381,
			65381
		],
		"mapped",
		[
			12539
		]
	],
	[
		[
			65382,
			65382
		],
		"mapped",
		[
			12530
		]
	],
	[
		[
			65383,
			65383
		],
		"mapped",
		[
			12449
		]
	],
	[
		[
			65384,
			65384
		],
		"mapped",
		[
			12451
		]
	],
	[
		[
			65385,
			65385
		],
		"mapped",
		[
			12453
		]
	],
	[
		[
			65386,
			65386
		],
		"mapped",
		[
			12455
		]
	],
	[
		[
			65387,
			65387
		],
		"mapped",
		[
			12457
		]
	],
	[
		[
			65388,
			65388
		],
		"mapped",
		[
			12515
		]
	],
	[
		[
			65389,
			65389
		],
		"mapped",
		[
			12517
		]
	],
	[
		[
			65390,
			65390
		],
		"mapped",
		[
			12519
		]
	],
	[
		[
			65391,
			65391
		],
		"mapped",
		[
			12483
		]
	],
	[
		[
			65392,
			65392
		],
		"mapped",
		[
			12540
		]
	],
	[
		[
			65393,
			65393
		],
		"mapped",
		[
			12450
		]
	],
	[
		[
			65394,
			65394
		],
		"mapped",
		[
			12452
		]
	],
	[
		[
			65395,
			65395
		],
		"mapped",
		[
			12454
		]
	],
	[
		[
			65396,
			65396
		],
		"mapped",
		[
			12456
		]
	],
	[
		[
			65397,
			65397
		],
		"mapped",
		[
			12458
		]
	],
	[
		[
			65398,
			65398
		],
		"mapped",
		[
			12459
		]
	],
	[
		[
			65399,
			65399
		],
		"mapped",
		[
			12461
		]
	],
	[
		[
			65400,
			65400
		],
		"mapped",
		[
			12463
		]
	],
	[
		[
			65401,
			65401
		],
		"mapped",
		[
			12465
		]
	],
	[
		[
			65402,
			65402
		],
		"mapped",
		[
			12467
		]
	],
	[
		[
			65403,
			65403
		],
		"mapped",
		[
			12469
		]
	],
	[
		[
			65404,
			65404
		],
		"mapped",
		[
			12471
		]
	],
	[
		[
			65405,
			65405
		],
		"mapped",
		[
			12473
		]
	],
	[
		[
			65406,
			65406
		],
		"mapped",
		[
			12475
		]
	],
	[
		[
			65407,
			65407
		],
		"mapped",
		[
			12477
		]
	],
	[
		[
			65408,
			65408
		],
		"mapped",
		[
			12479
		]
	],
	[
		[
			65409,
			65409
		],
		"mapped",
		[
			12481
		]
	],
	[
		[
			65410,
			65410
		],
		"mapped",
		[
			12484
		]
	],
	[
		[
			65411,
			65411
		],
		"mapped",
		[
			12486
		]
	],
	[
		[
			65412,
			65412
		],
		"mapped",
		[
			12488
		]
	],
	[
		[
			65413,
			65413
		],
		"mapped",
		[
			12490
		]
	],
	[
		[
			65414,
			65414
		],
		"mapped",
		[
			12491
		]
	],
	[
		[
			65415,
			65415
		],
		"mapped",
		[
			12492
		]
	],
	[
		[
			65416,
			65416
		],
		"mapped",
		[
			12493
		]
	],
	[
		[
			65417,
			65417
		],
		"mapped",
		[
			12494
		]
	],
	[
		[
			65418,
			65418
		],
		"mapped",
		[
			12495
		]
	],
	[
		[
			65419,
			65419
		],
		"mapped",
		[
			12498
		]
	],
	[
		[
			65420,
			65420
		],
		"mapped",
		[
			12501
		]
	],
	[
		[
			65421,
			65421
		],
		"mapped",
		[
			12504
		]
	],
	[
		[
			65422,
			65422
		],
		"mapped",
		[
			12507
		]
	],
	[
		[
			65423,
			65423
		],
		"mapped",
		[
			12510
		]
	],
	[
		[
			65424,
			65424
		],
		"mapped",
		[
			12511
		]
	],
	[
		[
			65425,
			65425
		],
		"mapped",
		[
			12512
		]
	],
	[
		[
			65426,
			65426
		],
		"mapped",
		[
			12513
		]
	],
	[
		[
			65427,
			65427
		],
		"mapped",
		[
			12514
		]
	],
	[
		[
			65428,
			65428
		],
		"mapped",
		[
			12516
		]
	],
	[
		[
			65429,
			65429
		],
		"mapped",
		[
			12518
		]
	],
	[
		[
			65430,
			65430
		],
		"mapped",
		[
			12520
		]
	],
	[
		[
			65431,
			65431
		],
		"mapped",
		[
			12521
		]
	],
	[
		[
			65432,
			65432
		],
		"mapped",
		[
			12522
		]
	],
	[
		[
			65433,
			65433
		],
		"mapped",
		[
			12523
		]
	],
	[
		[
			65434,
			65434
		],
		"mapped",
		[
			12524
		]
	],
	[
		[
			65435,
			65435
		],
		"mapped",
		[
			12525
		]
	],
	[
		[
			65436,
			65436
		],
		"mapped",
		[
			12527
		]
	],
	[
		[
			65437,
			65437
		],
		"mapped",
		[
			12531
		]
	],
	[
		[
			65438,
			65438
		],
		"mapped",
		[
			12441
		]
	],
	[
		[
			65439,
			65439
		],
		"mapped",
		[
			12442
		]
	],
	[
		[
			65440,
			65440
		],
		"disallowed"
	],
	[
		[
			65441,
			65441
		],
		"mapped",
		[
			4352
		]
	],
	[
		[
			65442,
			65442
		],
		"mapped",
		[
			4353
		]
	],
	[
		[
			65443,
			65443
		],
		"mapped",
		[
			4522
		]
	],
	[
		[
			65444,
			65444
		],
		"mapped",
		[
			4354
		]
	],
	[
		[
			65445,
			65445
		],
		"mapped",
		[
			4524
		]
	],
	[
		[
			65446,
			65446
		],
		"mapped",
		[
			4525
		]
	],
	[
		[
			65447,
			65447
		],
		"mapped",
		[
			4355
		]
	],
	[
		[
			65448,
			65448
		],
		"mapped",
		[
			4356
		]
	],
	[
		[
			65449,
			65449
		],
		"mapped",
		[
			4357
		]
	],
	[
		[
			65450,
			65450
		],
		"mapped",
		[
			4528
		]
	],
	[
		[
			65451,
			65451
		],
		"mapped",
		[
			4529
		]
	],
	[
		[
			65452,
			65452
		],
		"mapped",
		[
			4530
		]
	],
	[
		[
			65453,
			65453
		],
		"mapped",
		[
			4531
		]
	],
	[
		[
			65454,
			65454
		],
		"mapped",
		[
			4532
		]
	],
	[
		[
			65455,
			65455
		],
		"mapped",
		[
			4533
		]
	],
	[
		[
			65456,
			65456
		],
		"mapped",
		[
			4378
		]
	],
	[
		[
			65457,
			65457
		],
		"mapped",
		[
			4358
		]
	],
	[
		[
			65458,
			65458
		],
		"mapped",
		[
			4359
		]
	],
	[
		[
			65459,
			65459
		],
		"mapped",
		[
			4360
		]
	],
	[
		[
			65460,
			65460
		],
		"mapped",
		[
			4385
		]
	],
	[
		[
			65461,
			65461
		],
		"mapped",
		[
			4361
		]
	],
	[
		[
			65462,
			65462
		],
		"mapped",
		[
			4362
		]
	],
	[
		[
			65463,
			65463
		],
		"mapped",
		[
			4363
		]
	],
	[
		[
			65464,
			65464
		],
		"mapped",
		[
			4364
		]
	],
	[
		[
			65465,
			65465
		],
		"mapped",
		[
			4365
		]
	],
	[
		[
			65466,
			65466
		],
		"mapped",
		[
			4366
		]
	],
	[
		[
			65467,
			65467
		],
		"mapped",
		[
			4367
		]
	],
	[
		[
			65468,
			65468
		],
		"mapped",
		[
			4368
		]
	],
	[
		[
			65469,
			65469
		],
		"mapped",
		[
			4369
		]
	],
	[
		[
			65470,
			65470
		],
		"mapped",
		[
			4370
		]
	],
	[
		[
			65471,
			65473
		],
		"disallowed"
	],
	[
		[
			65474,
			65474
		],
		"mapped",
		[
			4449
		]
	],
	[
		[
			65475,
			65475
		],
		"mapped",
		[
			4450
		]
	],
	[
		[
			65476,
			65476
		],
		"mapped",
		[
			4451
		]
	],
	[
		[
			65477,
			65477
		],
		"mapped",
		[
			4452
		]
	],
	[
		[
			65478,
			65478
		],
		"mapped",
		[
			4453
		]
	],
	[
		[
			65479,
			65479
		],
		"mapped",
		[
			4454
		]
	],
	[
		[
			65480,
			65481
		],
		"disallowed"
	],
	[
		[
			65482,
			65482
		],
		"mapped",
		[
			4455
		]
	],
	[
		[
			65483,
			65483
		],
		"mapped",
		[
			4456
		]
	],
	[
		[
			65484,
			65484
		],
		"mapped",
		[
			4457
		]
	],
	[
		[
			65485,
			65485
		],
		"mapped",
		[
			4458
		]
	],
	[
		[
			65486,
			65486
		],
		"mapped",
		[
			4459
		]
	],
	[
		[
			65487,
			65487
		],
		"mapped",
		[
			4460
		]
	],
	[
		[
			65488,
			65489
		],
		"disallowed"
	],
	[
		[
			65490,
			65490
		],
		"mapped",
		[
			4461
		]
	],
	[
		[
			65491,
			65491
		],
		"mapped",
		[
			4462
		]
	],
	[
		[
			65492,
			65492
		],
		"mapped",
		[
			4463
		]
	],
	[
		[
			65493,
			65493
		],
		"mapped",
		[
			4464
		]
	],
	[
		[
			65494,
			65494
		],
		"mapped",
		[
			4465
		]
	],
	[
		[
			65495,
			65495
		],
		"mapped",
		[
			4466
		]
	],
	[
		[
			65496,
			65497
		],
		"disallowed"
	],
	[
		[
			65498,
			65498
		],
		"mapped",
		[
			4467
		]
	],
	[
		[
			65499,
			65499
		],
		"mapped",
		[
			4468
		]
	],
	[
		[
			65500,
			65500
		],
		"mapped",
		[
			4469
		]
	],
	[
		[
			65501,
			65503
		],
		"disallowed"
	],
	[
		[
			65504,
			65504
		],
		"mapped",
		[
			162
		]
	],
	[
		[
			65505,
			65505
		],
		"mapped",
		[
			163
		]
	],
	[
		[
			65506,
			65506
		],
		"mapped",
		[
			172
		]
	],
	[
		[
			65507,
			65507
		],
		"disallowed_STD3_mapped",
		[
			32,
			772
		]
	],
	[
		[
			65508,
			65508
		],
		"mapped",
		[
			166
		]
	],
	[
		[
			65509,
			65509
		],
		"mapped",
		[
			165
		]
	],
	[
		[
			65510,
			65510
		],
		"mapped",
		[
			8361
		]
	],
	[
		[
			65511,
			65511
		],
		"disallowed"
	],
	[
		[
			65512,
			65512
		],
		"mapped",
		[
			9474
		]
	],
	[
		[
			65513,
			65513
		],
		"mapped",
		[
			8592
		]
	],
	[
		[
			65514,
			65514
		],
		"mapped",
		[
			8593
		]
	],
	[
		[
			65515,
			65515
		],
		"mapped",
		[
			8594
		]
	],
	[
		[
			65516,
			65516
		],
		"mapped",
		[
			8595
		]
	],
	[
		[
			65517,
			65517
		],
		"mapped",
		[
			9632
		]
	],
	[
		[
			65518,
			65518
		],
		"mapped",
		[
			9675
		]
	],
	[
		[
			65519,
			65528
		],
		"disallowed"
	],
	[
		[
			65529,
			65531
		],
		"disallowed"
	],
	[
		[
			65532,
			65532
		],
		"disallowed"
	],
	[
		[
			65533,
			65533
		],
		"disallowed"
	],
	[
		[
			65534,
			65535
		],
		"disallowed"
	],
	[
		[
			65536,
			65547
		],
		"valid"
	],
	[
		[
			65548,
			65548
		],
		"disallowed"
	],
	[
		[
			65549,
			65574
		],
		"valid"
	],
	[
		[
			65575,
			65575
		],
		"disallowed"
	],
	[
		[
			65576,
			65594
		],
		"valid"
	],
	[
		[
			65595,
			65595
		],
		"disallowed"
	],
	[
		[
			65596,
			65597
		],
		"valid"
	],
	[
		[
			65598,
			65598
		],
		"disallowed"
	],
	[
		[
			65599,
			65613
		],
		"valid"
	],
	[
		[
			65614,
			65615
		],
		"disallowed"
	],
	[
		[
			65616,
			65629
		],
		"valid"
	],
	[
		[
			65630,
			65663
		],
		"disallowed"
	],
	[
		[
			65664,
			65786
		],
		"valid"
	],
	[
		[
			65787,
			65791
		],
		"disallowed"
	],
	[
		[
			65792,
			65794
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65795,
			65798
		],
		"disallowed"
	],
	[
		[
			65799,
			65843
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65844,
			65846
		],
		"disallowed"
	],
	[
		[
			65847,
			65855
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65856,
			65930
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65931,
			65932
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65933,
			65935
		],
		"disallowed"
	],
	[
		[
			65936,
			65947
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65948,
			65951
		],
		"disallowed"
	],
	[
		[
			65952,
			65952
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			65953,
			65999
		],
		"disallowed"
	],
	[
		[
			66000,
			66044
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66045,
			66045
		],
		"valid"
	],
	[
		[
			66046,
			66175
		],
		"disallowed"
	],
	[
		[
			66176,
			66204
		],
		"valid"
	],
	[
		[
			66205,
			66207
		],
		"disallowed"
	],
	[
		[
			66208,
			66256
		],
		"valid"
	],
	[
		[
			66257,
			66271
		],
		"disallowed"
	],
	[
		[
			66272,
			66272
		],
		"valid"
	],
	[
		[
			66273,
			66299
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66300,
			66303
		],
		"disallowed"
	],
	[
		[
			66304,
			66334
		],
		"valid"
	],
	[
		[
			66335,
			66335
		],
		"valid"
	],
	[
		[
			66336,
			66339
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66340,
			66351
		],
		"disallowed"
	],
	[
		[
			66352,
			66368
		],
		"valid"
	],
	[
		[
			66369,
			66369
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66370,
			66377
		],
		"valid"
	],
	[
		[
			66378,
			66378
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66379,
			66383
		],
		"disallowed"
	],
	[
		[
			66384,
			66426
		],
		"valid"
	],
	[
		[
			66427,
			66431
		],
		"disallowed"
	],
	[
		[
			66432,
			66461
		],
		"valid"
	],
	[
		[
			66462,
			66462
		],
		"disallowed"
	],
	[
		[
			66463,
			66463
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66464,
			66499
		],
		"valid"
	],
	[
		[
			66500,
			66503
		],
		"disallowed"
	],
	[
		[
			66504,
			66511
		],
		"valid"
	],
	[
		[
			66512,
			66517
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66518,
			66559
		],
		"disallowed"
	],
	[
		[
			66560,
			66560
		],
		"mapped",
		[
			66600
		]
	],
	[
		[
			66561,
			66561
		],
		"mapped",
		[
			66601
		]
	],
	[
		[
			66562,
			66562
		],
		"mapped",
		[
			66602
		]
	],
	[
		[
			66563,
			66563
		],
		"mapped",
		[
			66603
		]
	],
	[
		[
			66564,
			66564
		],
		"mapped",
		[
			66604
		]
	],
	[
		[
			66565,
			66565
		],
		"mapped",
		[
			66605
		]
	],
	[
		[
			66566,
			66566
		],
		"mapped",
		[
			66606
		]
	],
	[
		[
			66567,
			66567
		],
		"mapped",
		[
			66607
		]
	],
	[
		[
			66568,
			66568
		],
		"mapped",
		[
			66608
		]
	],
	[
		[
			66569,
			66569
		],
		"mapped",
		[
			66609
		]
	],
	[
		[
			66570,
			66570
		],
		"mapped",
		[
			66610
		]
	],
	[
		[
			66571,
			66571
		],
		"mapped",
		[
			66611
		]
	],
	[
		[
			66572,
			66572
		],
		"mapped",
		[
			66612
		]
	],
	[
		[
			66573,
			66573
		],
		"mapped",
		[
			66613
		]
	],
	[
		[
			66574,
			66574
		],
		"mapped",
		[
			66614
		]
	],
	[
		[
			66575,
			66575
		],
		"mapped",
		[
			66615
		]
	],
	[
		[
			66576,
			66576
		],
		"mapped",
		[
			66616
		]
	],
	[
		[
			66577,
			66577
		],
		"mapped",
		[
			66617
		]
	],
	[
		[
			66578,
			66578
		],
		"mapped",
		[
			66618
		]
	],
	[
		[
			66579,
			66579
		],
		"mapped",
		[
			66619
		]
	],
	[
		[
			66580,
			66580
		],
		"mapped",
		[
			66620
		]
	],
	[
		[
			66581,
			66581
		],
		"mapped",
		[
			66621
		]
	],
	[
		[
			66582,
			66582
		],
		"mapped",
		[
			66622
		]
	],
	[
		[
			66583,
			66583
		],
		"mapped",
		[
			66623
		]
	],
	[
		[
			66584,
			66584
		],
		"mapped",
		[
			66624
		]
	],
	[
		[
			66585,
			66585
		],
		"mapped",
		[
			66625
		]
	],
	[
		[
			66586,
			66586
		],
		"mapped",
		[
			66626
		]
	],
	[
		[
			66587,
			66587
		],
		"mapped",
		[
			66627
		]
	],
	[
		[
			66588,
			66588
		],
		"mapped",
		[
			66628
		]
	],
	[
		[
			66589,
			66589
		],
		"mapped",
		[
			66629
		]
	],
	[
		[
			66590,
			66590
		],
		"mapped",
		[
			66630
		]
	],
	[
		[
			66591,
			66591
		],
		"mapped",
		[
			66631
		]
	],
	[
		[
			66592,
			66592
		],
		"mapped",
		[
			66632
		]
	],
	[
		[
			66593,
			66593
		],
		"mapped",
		[
			66633
		]
	],
	[
		[
			66594,
			66594
		],
		"mapped",
		[
			66634
		]
	],
	[
		[
			66595,
			66595
		],
		"mapped",
		[
			66635
		]
	],
	[
		[
			66596,
			66596
		],
		"mapped",
		[
			66636
		]
	],
	[
		[
			66597,
			66597
		],
		"mapped",
		[
			66637
		]
	],
	[
		[
			66598,
			66598
		],
		"mapped",
		[
			66638
		]
	],
	[
		[
			66599,
			66599
		],
		"mapped",
		[
			66639
		]
	],
	[
		[
			66600,
			66637
		],
		"valid"
	],
	[
		[
			66638,
			66717
		],
		"valid"
	],
	[
		[
			66718,
			66719
		],
		"disallowed"
	],
	[
		[
			66720,
			66729
		],
		"valid"
	],
	[
		[
			66730,
			66815
		],
		"disallowed"
	],
	[
		[
			66816,
			66855
		],
		"valid"
	],
	[
		[
			66856,
			66863
		],
		"disallowed"
	],
	[
		[
			66864,
			66915
		],
		"valid"
	],
	[
		[
			66916,
			66926
		],
		"disallowed"
	],
	[
		[
			66927,
			66927
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			66928,
			67071
		],
		"disallowed"
	],
	[
		[
			67072,
			67382
		],
		"valid"
	],
	[
		[
			67383,
			67391
		],
		"disallowed"
	],
	[
		[
			67392,
			67413
		],
		"valid"
	],
	[
		[
			67414,
			67423
		],
		"disallowed"
	],
	[
		[
			67424,
			67431
		],
		"valid"
	],
	[
		[
			67432,
			67583
		],
		"disallowed"
	],
	[
		[
			67584,
			67589
		],
		"valid"
	],
	[
		[
			67590,
			67591
		],
		"disallowed"
	],
	[
		[
			67592,
			67592
		],
		"valid"
	],
	[
		[
			67593,
			67593
		],
		"disallowed"
	],
	[
		[
			67594,
			67637
		],
		"valid"
	],
	[
		[
			67638,
			67638
		],
		"disallowed"
	],
	[
		[
			67639,
			67640
		],
		"valid"
	],
	[
		[
			67641,
			67643
		],
		"disallowed"
	],
	[
		[
			67644,
			67644
		],
		"valid"
	],
	[
		[
			67645,
			67646
		],
		"disallowed"
	],
	[
		[
			67647,
			67647
		],
		"valid"
	],
	[
		[
			67648,
			67669
		],
		"valid"
	],
	[
		[
			67670,
			67670
		],
		"disallowed"
	],
	[
		[
			67671,
			67679
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67680,
			67702
		],
		"valid"
	],
	[
		[
			67703,
			67711
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67712,
			67742
		],
		"valid"
	],
	[
		[
			67743,
			67750
		],
		"disallowed"
	],
	[
		[
			67751,
			67759
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67760,
			67807
		],
		"disallowed"
	],
	[
		[
			67808,
			67826
		],
		"valid"
	],
	[
		[
			67827,
			67827
		],
		"disallowed"
	],
	[
		[
			67828,
			67829
		],
		"valid"
	],
	[
		[
			67830,
			67834
		],
		"disallowed"
	],
	[
		[
			67835,
			67839
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67840,
			67861
		],
		"valid"
	],
	[
		[
			67862,
			67865
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67866,
			67867
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67868,
			67870
		],
		"disallowed"
	],
	[
		[
			67871,
			67871
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67872,
			67897
		],
		"valid"
	],
	[
		[
			67898,
			67902
		],
		"disallowed"
	],
	[
		[
			67903,
			67903
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			67904,
			67967
		],
		"disallowed"
	],
	[
		[
			67968,
			68023
		],
		"valid"
	],
	[
		[
			68024,
			68027
		],
		"disallowed"
	],
	[
		[
			68028,
			68029
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68030,
			68031
		],
		"valid"
	],
	[
		[
			68032,
			68047
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68048,
			68049
		],
		"disallowed"
	],
	[
		[
			68050,
			68095
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68096,
			68099
		],
		"valid"
	],
	[
		[
			68100,
			68100
		],
		"disallowed"
	],
	[
		[
			68101,
			68102
		],
		"valid"
	],
	[
		[
			68103,
			68107
		],
		"disallowed"
	],
	[
		[
			68108,
			68115
		],
		"valid"
	],
	[
		[
			68116,
			68116
		],
		"disallowed"
	],
	[
		[
			68117,
			68119
		],
		"valid"
	],
	[
		[
			68120,
			68120
		],
		"disallowed"
	],
	[
		[
			68121,
			68147
		],
		"valid"
	],
	[
		[
			68148,
			68151
		],
		"disallowed"
	],
	[
		[
			68152,
			68154
		],
		"valid"
	],
	[
		[
			68155,
			68158
		],
		"disallowed"
	],
	[
		[
			68159,
			68159
		],
		"valid"
	],
	[
		[
			68160,
			68167
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68168,
			68175
		],
		"disallowed"
	],
	[
		[
			68176,
			68184
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68185,
			68191
		],
		"disallowed"
	],
	[
		[
			68192,
			68220
		],
		"valid"
	],
	[
		[
			68221,
			68223
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68224,
			68252
		],
		"valid"
	],
	[
		[
			68253,
			68255
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68256,
			68287
		],
		"disallowed"
	],
	[
		[
			68288,
			68295
		],
		"valid"
	],
	[
		[
			68296,
			68296
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68297,
			68326
		],
		"valid"
	],
	[
		[
			68327,
			68330
		],
		"disallowed"
	],
	[
		[
			68331,
			68342
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68343,
			68351
		],
		"disallowed"
	],
	[
		[
			68352,
			68405
		],
		"valid"
	],
	[
		[
			68406,
			68408
		],
		"disallowed"
	],
	[
		[
			68409,
			68415
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68416,
			68437
		],
		"valid"
	],
	[
		[
			68438,
			68439
		],
		"disallowed"
	],
	[
		[
			68440,
			68447
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68448,
			68466
		],
		"valid"
	],
	[
		[
			68467,
			68471
		],
		"disallowed"
	],
	[
		[
			68472,
			68479
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68480,
			68497
		],
		"valid"
	],
	[
		[
			68498,
			68504
		],
		"disallowed"
	],
	[
		[
			68505,
			68508
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68509,
			68520
		],
		"disallowed"
	],
	[
		[
			68521,
			68527
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68528,
			68607
		],
		"disallowed"
	],
	[
		[
			68608,
			68680
		],
		"valid"
	],
	[
		[
			68681,
			68735
		],
		"disallowed"
	],
	[
		[
			68736,
			68736
		],
		"mapped",
		[
			68800
		]
	],
	[
		[
			68737,
			68737
		],
		"mapped",
		[
			68801
		]
	],
	[
		[
			68738,
			68738
		],
		"mapped",
		[
			68802
		]
	],
	[
		[
			68739,
			68739
		],
		"mapped",
		[
			68803
		]
	],
	[
		[
			68740,
			68740
		],
		"mapped",
		[
			68804
		]
	],
	[
		[
			68741,
			68741
		],
		"mapped",
		[
			68805
		]
	],
	[
		[
			68742,
			68742
		],
		"mapped",
		[
			68806
		]
	],
	[
		[
			68743,
			68743
		],
		"mapped",
		[
			68807
		]
	],
	[
		[
			68744,
			68744
		],
		"mapped",
		[
			68808
		]
	],
	[
		[
			68745,
			68745
		],
		"mapped",
		[
			68809
		]
	],
	[
		[
			68746,
			68746
		],
		"mapped",
		[
			68810
		]
	],
	[
		[
			68747,
			68747
		],
		"mapped",
		[
			68811
		]
	],
	[
		[
			68748,
			68748
		],
		"mapped",
		[
			68812
		]
	],
	[
		[
			68749,
			68749
		],
		"mapped",
		[
			68813
		]
	],
	[
		[
			68750,
			68750
		],
		"mapped",
		[
			68814
		]
	],
	[
		[
			68751,
			68751
		],
		"mapped",
		[
			68815
		]
	],
	[
		[
			68752,
			68752
		],
		"mapped",
		[
			68816
		]
	],
	[
		[
			68753,
			68753
		],
		"mapped",
		[
			68817
		]
	],
	[
		[
			68754,
			68754
		],
		"mapped",
		[
			68818
		]
	],
	[
		[
			68755,
			68755
		],
		"mapped",
		[
			68819
		]
	],
	[
		[
			68756,
			68756
		],
		"mapped",
		[
			68820
		]
	],
	[
		[
			68757,
			68757
		],
		"mapped",
		[
			68821
		]
	],
	[
		[
			68758,
			68758
		],
		"mapped",
		[
			68822
		]
	],
	[
		[
			68759,
			68759
		],
		"mapped",
		[
			68823
		]
	],
	[
		[
			68760,
			68760
		],
		"mapped",
		[
			68824
		]
	],
	[
		[
			68761,
			68761
		],
		"mapped",
		[
			68825
		]
	],
	[
		[
			68762,
			68762
		],
		"mapped",
		[
			68826
		]
	],
	[
		[
			68763,
			68763
		],
		"mapped",
		[
			68827
		]
	],
	[
		[
			68764,
			68764
		],
		"mapped",
		[
			68828
		]
	],
	[
		[
			68765,
			68765
		],
		"mapped",
		[
			68829
		]
	],
	[
		[
			68766,
			68766
		],
		"mapped",
		[
			68830
		]
	],
	[
		[
			68767,
			68767
		],
		"mapped",
		[
			68831
		]
	],
	[
		[
			68768,
			68768
		],
		"mapped",
		[
			68832
		]
	],
	[
		[
			68769,
			68769
		],
		"mapped",
		[
			68833
		]
	],
	[
		[
			68770,
			68770
		],
		"mapped",
		[
			68834
		]
	],
	[
		[
			68771,
			68771
		],
		"mapped",
		[
			68835
		]
	],
	[
		[
			68772,
			68772
		],
		"mapped",
		[
			68836
		]
	],
	[
		[
			68773,
			68773
		],
		"mapped",
		[
			68837
		]
	],
	[
		[
			68774,
			68774
		],
		"mapped",
		[
			68838
		]
	],
	[
		[
			68775,
			68775
		],
		"mapped",
		[
			68839
		]
	],
	[
		[
			68776,
			68776
		],
		"mapped",
		[
			68840
		]
	],
	[
		[
			68777,
			68777
		],
		"mapped",
		[
			68841
		]
	],
	[
		[
			68778,
			68778
		],
		"mapped",
		[
			68842
		]
	],
	[
		[
			68779,
			68779
		],
		"mapped",
		[
			68843
		]
	],
	[
		[
			68780,
			68780
		],
		"mapped",
		[
			68844
		]
	],
	[
		[
			68781,
			68781
		],
		"mapped",
		[
			68845
		]
	],
	[
		[
			68782,
			68782
		],
		"mapped",
		[
			68846
		]
	],
	[
		[
			68783,
			68783
		],
		"mapped",
		[
			68847
		]
	],
	[
		[
			68784,
			68784
		],
		"mapped",
		[
			68848
		]
	],
	[
		[
			68785,
			68785
		],
		"mapped",
		[
			68849
		]
	],
	[
		[
			68786,
			68786
		],
		"mapped",
		[
			68850
		]
	],
	[
		[
			68787,
			68799
		],
		"disallowed"
	],
	[
		[
			68800,
			68850
		],
		"valid"
	],
	[
		[
			68851,
			68857
		],
		"disallowed"
	],
	[
		[
			68858,
			68863
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			68864,
			69215
		],
		"disallowed"
	],
	[
		[
			69216,
			69246
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69247,
			69631
		],
		"disallowed"
	],
	[
		[
			69632,
			69702
		],
		"valid"
	],
	[
		[
			69703,
			69709
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69710,
			69713
		],
		"disallowed"
	],
	[
		[
			69714,
			69733
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69734,
			69743
		],
		"valid"
	],
	[
		[
			69744,
			69758
		],
		"disallowed"
	],
	[
		[
			69759,
			69759
		],
		"valid"
	],
	[
		[
			69760,
			69818
		],
		"valid"
	],
	[
		[
			69819,
			69820
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69821,
			69821
		],
		"disallowed"
	],
	[
		[
			69822,
			69825
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69826,
			69839
		],
		"disallowed"
	],
	[
		[
			69840,
			69864
		],
		"valid"
	],
	[
		[
			69865,
			69871
		],
		"disallowed"
	],
	[
		[
			69872,
			69881
		],
		"valid"
	],
	[
		[
			69882,
			69887
		],
		"disallowed"
	],
	[
		[
			69888,
			69940
		],
		"valid"
	],
	[
		[
			69941,
			69941
		],
		"disallowed"
	],
	[
		[
			69942,
			69951
		],
		"valid"
	],
	[
		[
			69952,
			69955
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			69956,
			69967
		],
		"disallowed"
	],
	[
		[
			69968,
			70003
		],
		"valid"
	],
	[
		[
			70004,
			70005
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70006,
			70006
		],
		"valid"
	],
	[
		[
			70007,
			70015
		],
		"disallowed"
	],
	[
		[
			70016,
			70084
		],
		"valid"
	],
	[
		[
			70085,
			70088
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70089,
			70089
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70090,
			70092
		],
		"valid"
	],
	[
		[
			70093,
			70093
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70094,
			70095
		],
		"disallowed"
	],
	[
		[
			70096,
			70105
		],
		"valid"
	],
	[
		[
			70106,
			70106
		],
		"valid"
	],
	[
		[
			70107,
			70107
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70108,
			70108
		],
		"valid"
	],
	[
		[
			70109,
			70111
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70112,
			70112
		],
		"disallowed"
	],
	[
		[
			70113,
			70132
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70133,
			70143
		],
		"disallowed"
	],
	[
		[
			70144,
			70161
		],
		"valid"
	],
	[
		[
			70162,
			70162
		],
		"disallowed"
	],
	[
		[
			70163,
			70199
		],
		"valid"
	],
	[
		[
			70200,
			70205
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70206,
			70271
		],
		"disallowed"
	],
	[
		[
			70272,
			70278
		],
		"valid"
	],
	[
		[
			70279,
			70279
		],
		"disallowed"
	],
	[
		[
			70280,
			70280
		],
		"valid"
	],
	[
		[
			70281,
			70281
		],
		"disallowed"
	],
	[
		[
			70282,
			70285
		],
		"valid"
	],
	[
		[
			70286,
			70286
		],
		"disallowed"
	],
	[
		[
			70287,
			70301
		],
		"valid"
	],
	[
		[
			70302,
			70302
		],
		"disallowed"
	],
	[
		[
			70303,
			70312
		],
		"valid"
	],
	[
		[
			70313,
			70313
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70314,
			70319
		],
		"disallowed"
	],
	[
		[
			70320,
			70378
		],
		"valid"
	],
	[
		[
			70379,
			70383
		],
		"disallowed"
	],
	[
		[
			70384,
			70393
		],
		"valid"
	],
	[
		[
			70394,
			70399
		],
		"disallowed"
	],
	[
		[
			70400,
			70400
		],
		"valid"
	],
	[
		[
			70401,
			70403
		],
		"valid"
	],
	[
		[
			70404,
			70404
		],
		"disallowed"
	],
	[
		[
			70405,
			70412
		],
		"valid"
	],
	[
		[
			70413,
			70414
		],
		"disallowed"
	],
	[
		[
			70415,
			70416
		],
		"valid"
	],
	[
		[
			70417,
			70418
		],
		"disallowed"
	],
	[
		[
			70419,
			70440
		],
		"valid"
	],
	[
		[
			70441,
			70441
		],
		"disallowed"
	],
	[
		[
			70442,
			70448
		],
		"valid"
	],
	[
		[
			70449,
			70449
		],
		"disallowed"
	],
	[
		[
			70450,
			70451
		],
		"valid"
	],
	[
		[
			70452,
			70452
		],
		"disallowed"
	],
	[
		[
			70453,
			70457
		],
		"valid"
	],
	[
		[
			70458,
			70459
		],
		"disallowed"
	],
	[
		[
			70460,
			70468
		],
		"valid"
	],
	[
		[
			70469,
			70470
		],
		"disallowed"
	],
	[
		[
			70471,
			70472
		],
		"valid"
	],
	[
		[
			70473,
			70474
		],
		"disallowed"
	],
	[
		[
			70475,
			70477
		],
		"valid"
	],
	[
		[
			70478,
			70479
		],
		"disallowed"
	],
	[
		[
			70480,
			70480
		],
		"valid"
	],
	[
		[
			70481,
			70486
		],
		"disallowed"
	],
	[
		[
			70487,
			70487
		],
		"valid"
	],
	[
		[
			70488,
			70492
		],
		"disallowed"
	],
	[
		[
			70493,
			70499
		],
		"valid"
	],
	[
		[
			70500,
			70501
		],
		"disallowed"
	],
	[
		[
			70502,
			70508
		],
		"valid"
	],
	[
		[
			70509,
			70511
		],
		"disallowed"
	],
	[
		[
			70512,
			70516
		],
		"valid"
	],
	[
		[
			70517,
			70783
		],
		"disallowed"
	],
	[
		[
			70784,
			70853
		],
		"valid"
	],
	[
		[
			70854,
			70854
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			70855,
			70855
		],
		"valid"
	],
	[
		[
			70856,
			70863
		],
		"disallowed"
	],
	[
		[
			70864,
			70873
		],
		"valid"
	],
	[
		[
			70874,
			71039
		],
		"disallowed"
	],
	[
		[
			71040,
			71093
		],
		"valid"
	],
	[
		[
			71094,
			71095
		],
		"disallowed"
	],
	[
		[
			71096,
			71104
		],
		"valid"
	],
	[
		[
			71105,
			71113
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			71114,
			71127
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			71128,
			71133
		],
		"valid"
	],
	[
		[
			71134,
			71167
		],
		"disallowed"
	],
	[
		[
			71168,
			71232
		],
		"valid"
	],
	[
		[
			71233,
			71235
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			71236,
			71236
		],
		"valid"
	],
	[
		[
			71237,
			71247
		],
		"disallowed"
	],
	[
		[
			71248,
			71257
		],
		"valid"
	],
	[
		[
			71258,
			71295
		],
		"disallowed"
	],
	[
		[
			71296,
			71351
		],
		"valid"
	],
	[
		[
			71352,
			71359
		],
		"disallowed"
	],
	[
		[
			71360,
			71369
		],
		"valid"
	],
	[
		[
			71370,
			71423
		],
		"disallowed"
	],
	[
		[
			71424,
			71449
		],
		"valid"
	],
	[
		[
			71450,
			71452
		],
		"disallowed"
	],
	[
		[
			71453,
			71467
		],
		"valid"
	],
	[
		[
			71468,
			71471
		],
		"disallowed"
	],
	[
		[
			71472,
			71481
		],
		"valid"
	],
	[
		[
			71482,
			71487
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			71488,
			71839
		],
		"disallowed"
	],
	[
		[
			71840,
			71840
		],
		"mapped",
		[
			71872
		]
	],
	[
		[
			71841,
			71841
		],
		"mapped",
		[
			71873
		]
	],
	[
		[
			71842,
			71842
		],
		"mapped",
		[
			71874
		]
	],
	[
		[
			71843,
			71843
		],
		"mapped",
		[
			71875
		]
	],
	[
		[
			71844,
			71844
		],
		"mapped",
		[
			71876
		]
	],
	[
		[
			71845,
			71845
		],
		"mapped",
		[
			71877
		]
	],
	[
		[
			71846,
			71846
		],
		"mapped",
		[
			71878
		]
	],
	[
		[
			71847,
			71847
		],
		"mapped",
		[
			71879
		]
	],
	[
		[
			71848,
			71848
		],
		"mapped",
		[
			71880
		]
	],
	[
		[
			71849,
			71849
		],
		"mapped",
		[
			71881
		]
	],
	[
		[
			71850,
			71850
		],
		"mapped",
		[
			71882
		]
	],
	[
		[
			71851,
			71851
		],
		"mapped",
		[
			71883
		]
	],
	[
		[
			71852,
			71852
		],
		"mapped",
		[
			71884
		]
	],
	[
		[
			71853,
			71853
		],
		"mapped",
		[
			71885
		]
	],
	[
		[
			71854,
			71854
		],
		"mapped",
		[
			71886
		]
	],
	[
		[
			71855,
			71855
		],
		"mapped",
		[
			71887
		]
	],
	[
		[
			71856,
			71856
		],
		"mapped",
		[
			71888
		]
	],
	[
		[
			71857,
			71857
		],
		"mapped",
		[
			71889
		]
	],
	[
		[
			71858,
			71858
		],
		"mapped",
		[
			71890
		]
	],
	[
		[
			71859,
			71859
		],
		"mapped",
		[
			71891
		]
	],
	[
		[
			71860,
			71860
		],
		"mapped",
		[
			71892
		]
	],
	[
		[
			71861,
			71861
		],
		"mapped",
		[
			71893
		]
	],
	[
		[
			71862,
			71862
		],
		"mapped",
		[
			71894
		]
	],
	[
		[
			71863,
			71863
		],
		"mapped",
		[
			71895
		]
	],
	[
		[
			71864,
			71864
		],
		"mapped",
		[
			71896
		]
	],
	[
		[
			71865,
			71865
		],
		"mapped",
		[
			71897
		]
	],
	[
		[
			71866,
			71866
		],
		"mapped",
		[
			71898
		]
	],
	[
		[
			71867,
			71867
		],
		"mapped",
		[
			71899
		]
	],
	[
		[
			71868,
			71868
		],
		"mapped",
		[
			71900
		]
	],
	[
		[
			71869,
			71869
		],
		"mapped",
		[
			71901
		]
	],
	[
		[
			71870,
			71870
		],
		"mapped",
		[
			71902
		]
	],
	[
		[
			71871,
			71871
		],
		"mapped",
		[
			71903
		]
	],
	[
		[
			71872,
			71913
		],
		"valid"
	],
	[
		[
			71914,
			71922
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			71923,
			71934
		],
		"disallowed"
	],
	[
		[
			71935,
			71935
		],
		"valid"
	],
	[
		[
			71936,
			72383
		],
		"disallowed"
	],
	[
		[
			72384,
			72440
		],
		"valid"
	],
	[
		[
			72441,
			73727
		],
		"disallowed"
	],
	[
		[
			73728,
			74606
		],
		"valid"
	],
	[
		[
			74607,
			74648
		],
		"valid"
	],
	[
		[
			74649,
			74649
		],
		"valid"
	],
	[
		[
			74650,
			74751
		],
		"disallowed"
	],
	[
		[
			74752,
			74850
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			74851,
			74862
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			74863,
			74863
		],
		"disallowed"
	],
	[
		[
			74864,
			74867
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			74868,
			74868
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			74869,
			74879
		],
		"disallowed"
	],
	[
		[
			74880,
			75075
		],
		"valid"
	],
	[
		[
			75076,
			77823
		],
		"disallowed"
	],
	[
		[
			77824,
			78894
		],
		"valid"
	],
	[
		[
			78895,
			82943
		],
		"disallowed"
	],
	[
		[
			82944,
			83526
		],
		"valid"
	],
	[
		[
			83527,
			92159
		],
		"disallowed"
	],
	[
		[
			92160,
			92728
		],
		"valid"
	],
	[
		[
			92729,
			92735
		],
		"disallowed"
	],
	[
		[
			92736,
			92766
		],
		"valid"
	],
	[
		[
			92767,
			92767
		],
		"disallowed"
	],
	[
		[
			92768,
			92777
		],
		"valid"
	],
	[
		[
			92778,
			92781
		],
		"disallowed"
	],
	[
		[
			92782,
			92783
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			92784,
			92879
		],
		"disallowed"
	],
	[
		[
			92880,
			92909
		],
		"valid"
	],
	[
		[
			92910,
			92911
		],
		"disallowed"
	],
	[
		[
			92912,
			92916
		],
		"valid"
	],
	[
		[
			92917,
			92917
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			92918,
			92927
		],
		"disallowed"
	],
	[
		[
			92928,
			92982
		],
		"valid"
	],
	[
		[
			92983,
			92991
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			92992,
			92995
		],
		"valid"
	],
	[
		[
			92996,
			92997
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			92998,
			93007
		],
		"disallowed"
	],
	[
		[
			93008,
			93017
		],
		"valid"
	],
	[
		[
			93018,
			93018
		],
		"disallowed"
	],
	[
		[
			93019,
			93025
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			93026,
			93026
		],
		"disallowed"
	],
	[
		[
			93027,
			93047
		],
		"valid"
	],
	[
		[
			93048,
			93052
		],
		"disallowed"
	],
	[
		[
			93053,
			93071
		],
		"valid"
	],
	[
		[
			93072,
			93951
		],
		"disallowed"
	],
	[
		[
			93952,
			94020
		],
		"valid"
	],
	[
		[
			94021,
			94031
		],
		"disallowed"
	],
	[
		[
			94032,
			94078
		],
		"valid"
	],
	[
		[
			94079,
			94094
		],
		"disallowed"
	],
	[
		[
			94095,
			94111
		],
		"valid"
	],
	[
		[
			94112,
			110591
		],
		"disallowed"
	],
	[
		[
			110592,
			110593
		],
		"valid"
	],
	[
		[
			110594,
			113663
		],
		"disallowed"
	],
	[
		[
			113664,
			113770
		],
		"valid"
	],
	[
		[
			113771,
			113775
		],
		"disallowed"
	],
	[
		[
			113776,
			113788
		],
		"valid"
	],
	[
		[
			113789,
			113791
		],
		"disallowed"
	],
	[
		[
			113792,
			113800
		],
		"valid"
	],
	[
		[
			113801,
			113807
		],
		"disallowed"
	],
	[
		[
			113808,
			113817
		],
		"valid"
	],
	[
		[
			113818,
			113819
		],
		"disallowed"
	],
	[
		[
			113820,
			113820
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			113821,
			113822
		],
		"valid"
	],
	[
		[
			113823,
			113823
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			113824,
			113827
		],
		"ignored"
	],
	[
		[
			113828,
			118783
		],
		"disallowed"
	],
	[
		[
			118784,
			119029
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119030,
			119039
		],
		"disallowed"
	],
	[
		[
			119040,
			119078
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119079,
			119080
		],
		"disallowed"
	],
	[
		[
			119081,
			119081
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119082,
			119133
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119134,
			119134
		],
		"mapped",
		[
			119127,
			119141
		]
	],
	[
		[
			119135,
			119135
		],
		"mapped",
		[
			119128,
			119141
		]
	],
	[
		[
			119136,
			119136
		],
		"mapped",
		[
			119128,
			119141,
			119150
		]
	],
	[
		[
			119137,
			119137
		],
		"mapped",
		[
			119128,
			119141,
			119151
		]
	],
	[
		[
			119138,
			119138
		],
		"mapped",
		[
			119128,
			119141,
			119152
		]
	],
	[
		[
			119139,
			119139
		],
		"mapped",
		[
			119128,
			119141,
			119153
		]
	],
	[
		[
			119140,
			119140
		],
		"mapped",
		[
			119128,
			119141,
			119154
		]
	],
	[
		[
			119141,
			119154
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119155,
			119162
		],
		"disallowed"
	],
	[
		[
			119163,
			119226
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119227,
			119227
		],
		"mapped",
		[
			119225,
			119141
		]
	],
	[
		[
			119228,
			119228
		],
		"mapped",
		[
			119226,
			119141
		]
	],
	[
		[
			119229,
			119229
		],
		"mapped",
		[
			119225,
			119141,
			119150
		]
	],
	[
		[
			119230,
			119230
		],
		"mapped",
		[
			119226,
			119141,
			119150
		]
	],
	[
		[
			119231,
			119231
		],
		"mapped",
		[
			119225,
			119141,
			119151
		]
	],
	[
		[
			119232,
			119232
		],
		"mapped",
		[
			119226,
			119141,
			119151
		]
	],
	[
		[
			119233,
			119261
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119262,
			119272
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119273,
			119295
		],
		"disallowed"
	],
	[
		[
			119296,
			119365
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119366,
			119551
		],
		"disallowed"
	],
	[
		[
			119552,
			119638
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119639,
			119647
		],
		"disallowed"
	],
	[
		[
			119648,
			119665
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			119666,
			119807
		],
		"disallowed"
	],
	[
		[
			119808,
			119808
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119809,
			119809
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119810,
			119810
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119811,
			119811
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119812,
			119812
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119813,
			119813
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119814,
			119814
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119815,
			119815
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119816,
			119816
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119817,
			119817
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119818,
			119818
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119819,
			119819
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119820,
			119820
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119821,
			119821
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119822,
			119822
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119823,
			119823
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119824,
			119824
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119825,
			119825
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119826,
			119826
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119827,
			119827
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119828,
			119828
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119829,
			119829
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119830,
			119830
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119831,
			119831
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119832,
			119832
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119833,
			119833
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119834,
			119834
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119835,
			119835
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119836,
			119836
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119837,
			119837
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119838,
			119838
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119839,
			119839
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119840,
			119840
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119841,
			119841
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119842,
			119842
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119843,
			119843
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119844,
			119844
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119845,
			119845
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119846,
			119846
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119847,
			119847
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119848,
			119848
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119849,
			119849
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119850,
			119850
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119851,
			119851
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119852,
			119852
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119853,
			119853
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119854,
			119854
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119855,
			119855
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119856,
			119856
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119857,
			119857
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119858,
			119858
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119859,
			119859
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119860,
			119860
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119861,
			119861
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119862,
			119862
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119863,
			119863
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119864,
			119864
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119865,
			119865
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119866,
			119866
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119867,
			119867
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119868,
			119868
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119869,
			119869
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119870,
			119870
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119871,
			119871
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119872,
			119872
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119873,
			119873
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119874,
			119874
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119875,
			119875
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119876,
			119876
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119877,
			119877
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119878,
			119878
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119879,
			119879
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119880,
			119880
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119881,
			119881
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119882,
			119882
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119883,
			119883
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119884,
			119884
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119885,
			119885
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119886,
			119886
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119887,
			119887
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119888,
			119888
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119889,
			119889
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119890,
			119890
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119891,
			119891
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119892,
			119892
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119893,
			119893
		],
		"disallowed"
	],
	[
		[
			119894,
			119894
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119895,
			119895
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119896,
			119896
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119897,
			119897
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119898,
			119898
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119899,
			119899
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119900,
			119900
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119901,
			119901
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119902,
			119902
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119903,
			119903
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119904,
			119904
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119905,
			119905
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119906,
			119906
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119907,
			119907
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119908,
			119908
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119909,
			119909
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119910,
			119910
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119911,
			119911
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119912,
			119912
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119913,
			119913
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119914,
			119914
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119915,
			119915
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119916,
			119916
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119917,
			119917
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119918,
			119918
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119919,
			119919
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119920,
			119920
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119921,
			119921
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119922,
			119922
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119923,
			119923
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119924,
			119924
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119925,
			119925
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119926,
			119926
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119927,
			119927
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119928,
			119928
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119929,
			119929
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119930,
			119930
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119931,
			119931
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119932,
			119932
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119933,
			119933
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119934,
			119934
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119935,
			119935
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119936,
			119936
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119937,
			119937
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119938,
			119938
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119939,
			119939
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119940,
			119940
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119941,
			119941
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119942,
			119942
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			119943,
			119943
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119944,
			119944
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119945,
			119945
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119946,
			119946
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119947,
			119947
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119948,
			119948
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119949,
			119949
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			119950,
			119950
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			119951,
			119951
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119952,
			119952
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119953,
			119953
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119954,
			119954
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119955,
			119955
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			119956,
			119956
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119957,
			119957
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119958,
			119958
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119959,
			119959
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119960,
			119960
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119961,
			119961
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119962,
			119962
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119963,
			119963
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119964,
			119964
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119965,
			119965
		],
		"disallowed"
	],
	[
		[
			119966,
			119966
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119967,
			119967
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119968,
			119969
		],
		"disallowed"
	],
	[
		[
			119970,
			119970
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			119971,
			119972
		],
		"disallowed"
	],
	[
		[
			119973,
			119973
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			119974,
			119974
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			119975,
			119976
		],
		"disallowed"
	],
	[
		[
			119977,
			119977
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			119978,
			119978
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			119979,
			119979
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			119980,
			119980
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			119981,
			119981
		],
		"disallowed"
	],
	[
		[
			119982,
			119982
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			119983,
			119983
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			119984,
			119984
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			119985,
			119985
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			119986,
			119986
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			119987,
			119987
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			119988,
			119988
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			119989,
			119989
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			119990,
			119990
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			119991,
			119991
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			119992,
			119992
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			119993,
			119993
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			119994,
			119994
		],
		"disallowed"
	],
	[
		[
			119995,
			119995
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			119996,
			119996
		],
		"disallowed"
	],
	[
		[
			119997,
			119997
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			119998,
			119998
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			119999,
			119999
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120000,
			120000
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120001,
			120001
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120002,
			120002
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120003,
			120003
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120004,
			120004
		],
		"disallowed"
	],
	[
		[
			120005,
			120005
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120006,
			120006
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120007,
			120007
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120008,
			120008
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120009,
			120009
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120010,
			120010
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120011,
			120011
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120012,
			120012
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120013,
			120013
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120014,
			120014
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120015,
			120015
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120016,
			120016
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120017,
			120017
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120018,
			120018
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120019,
			120019
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120020,
			120020
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120021,
			120021
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120022,
			120022
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120023,
			120023
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120024,
			120024
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120025,
			120025
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120026,
			120026
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120027,
			120027
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120028,
			120028
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120029,
			120029
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120030,
			120030
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120031,
			120031
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120032,
			120032
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120033,
			120033
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120034,
			120034
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120035,
			120035
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120036,
			120036
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120037,
			120037
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120038,
			120038
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120039,
			120039
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120040,
			120040
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120041,
			120041
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120042,
			120042
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120043,
			120043
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120044,
			120044
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120045,
			120045
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120046,
			120046
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120047,
			120047
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120048,
			120048
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120049,
			120049
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120050,
			120050
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120051,
			120051
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120052,
			120052
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120053,
			120053
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120054,
			120054
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120055,
			120055
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120056,
			120056
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120057,
			120057
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120058,
			120058
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120059,
			120059
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120060,
			120060
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120061,
			120061
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120062,
			120062
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120063,
			120063
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120064,
			120064
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120065,
			120065
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120066,
			120066
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120067,
			120067
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120068,
			120068
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120069,
			120069
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120070,
			120070
		],
		"disallowed"
	],
	[
		[
			120071,
			120071
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120072,
			120072
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120073,
			120073
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120074,
			120074
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120075,
			120076
		],
		"disallowed"
	],
	[
		[
			120077,
			120077
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120078,
			120078
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120079,
			120079
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120080,
			120080
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120081,
			120081
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120082,
			120082
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120083,
			120083
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120084,
			120084
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120085,
			120085
		],
		"disallowed"
	],
	[
		[
			120086,
			120086
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120087,
			120087
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120088,
			120088
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120089,
			120089
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120090,
			120090
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120091,
			120091
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120092,
			120092
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120093,
			120093
		],
		"disallowed"
	],
	[
		[
			120094,
			120094
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120095,
			120095
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120096,
			120096
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120097,
			120097
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120098,
			120098
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120099,
			120099
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120100,
			120100
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120101,
			120101
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120102,
			120102
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120103,
			120103
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120104,
			120104
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120105,
			120105
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120106,
			120106
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120107,
			120107
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120108,
			120108
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120109,
			120109
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120110,
			120110
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120111,
			120111
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120112,
			120112
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120113,
			120113
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120114,
			120114
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120115,
			120115
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120116,
			120116
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120117,
			120117
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120118,
			120118
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120119,
			120119
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120120,
			120120
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120121,
			120121
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120122,
			120122
		],
		"disallowed"
	],
	[
		[
			120123,
			120123
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120124,
			120124
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120125,
			120125
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120126,
			120126
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120127,
			120127
		],
		"disallowed"
	],
	[
		[
			120128,
			120128
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120129,
			120129
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120130,
			120130
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120131,
			120131
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120132,
			120132
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120133,
			120133
		],
		"disallowed"
	],
	[
		[
			120134,
			120134
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120135,
			120137
		],
		"disallowed"
	],
	[
		[
			120138,
			120138
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120139,
			120139
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120140,
			120140
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120141,
			120141
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120142,
			120142
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120143,
			120143
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120144,
			120144
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120145,
			120145
		],
		"disallowed"
	],
	[
		[
			120146,
			120146
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120147,
			120147
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120148,
			120148
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120149,
			120149
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120150,
			120150
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120151,
			120151
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120152,
			120152
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120153,
			120153
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120154,
			120154
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120155,
			120155
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120156,
			120156
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120157,
			120157
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120158,
			120158
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120159,
			120159
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120160,
			120160
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120161,
			120161
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120162,
			120162
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120163,
			120163
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120164,
			120164
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120165,
			120165
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120166,
			120166
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120167,
			120167
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120168,
			120168
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120169,
			120169
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120170,
			120170
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120171,
			120171
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120172,
			120172
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120173,
			120173
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120174,
			120174
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120175,
			120175
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120176,
			120176
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120177,
			120177
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120178,
			120178
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120179,
			120179
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120180,
			120180
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120181,
			120181
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120182,
			120182
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120183,
			120183
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120184,
			120184
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120185,
			120185
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120186,
			120186
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120187,
			120187
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120188,
			120188
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120189,
			120189
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120190,
			120190
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120191,
			120191
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120192,
			120192
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120193,
			120193
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120194,
			120194
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120195,
			120195
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120196,
			120196
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120197,
			120197
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120198,
			120198
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120199,
			120199
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120200,
			120200
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120201,
			120201
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120202,
			120202
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120203,
			120203
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120204,
			120204
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120205,
			120205
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120206,
			120206
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120207,
			120207
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120208,
			120208
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120209,
			120209
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120210,
			120210
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120211,
			120211
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120212,
			120212
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120213,
			120213
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120214,
			120214
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120215,
			120215
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120216,
			120216
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120217,
			120217
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120218,
			120218
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120219,
			120219
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120220,
			120220
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120221,
			120221
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120222,
			120222
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120223,
			120223
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120224,
			120224
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120225,
			120225
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120226,
			120226
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120227,
			120227
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120228,
			120228
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120229,
			120229
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120230,
			120230
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120231,
			120231
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120232,
			120232
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120233,
			120233
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120234,
			120234
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120235,
			120235
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120236,
			120236
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120237,
			120237
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120238,
			120238
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120239,
			120239
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120240,
			120240
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120241,
			120241
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120242,
			120242
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120243,
			120243
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120244,
			120244
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120245,
			120245
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120246,
			120246
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120247,
			120247
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120248,
			120248
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120249,
			120249
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120250,
			120250
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120251,
			120251
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120252,
			120252
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120253,
			120253
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120254,
			120254
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120255,
			120255
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120256,
			120256
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120257,
			120257
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120258,
			120258
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120259,
			120259
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120260,
			120260
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120261,
			120261
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120262,
			120262
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120263,
			120263
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120264,
			120264
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120265,
			120265
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120266,
			120266
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120267,
			120267
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120268,
			120268
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120269,
			120269
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120270,
			120270
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120271,
			120271
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120272,
			120272
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120273,
			120273
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120274,
			120274
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120275,
			120275
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120276,
			120276
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120277,
			120277
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120278,
			120278
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120279,
			120279
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120280,
			120280
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120281,
			120281
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120282,
			120282
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120283,
			120283
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120284,
			120284
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120285,
			120285
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120286,
			120286
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120287,
			120287
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120288,
			120288
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120289,
			120289
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120290,
			120290
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120291,
			120291
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120292,
			120292
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120293,
			120293
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120294,
			120294
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120295,
			120295
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120296,
			120296
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120297,
			120297
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120298,
			120298
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120299,
			120299
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120300,
			120300
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120301,
			120301
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120302,
			120302
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120303,
			120303
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120304,
			120304
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120305,
			120305
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120306,
			120306
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120307,
			120307
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120308,
			120308
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120309,
			120309
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120310,
			120310
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120311,
			120311
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120312,
			120312
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120313,
			120313
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120314,
			120314
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120315,
			120315
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120316,
			120316
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120317,
			120317
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120318,
			120318
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120319,
			120319
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120320,
			120320
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120321,
			120321
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120322,
			120322
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120323,
			120323
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120324,
			120324
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120325,
			120325
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120326,
			120326
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120327,
			120327
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120328,
			120328
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120329,
			120329
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120330,
			120330
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120331,
			120331
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120332,
			120332
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120333,
			120333
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120334,
			120334
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120335,
			120335
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120336,
			120336
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120337,
			120337
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120338,
			120338
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120339,
			120339
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120340,
			120340
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120341,
			120341
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120342,
			120342
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120343,
			120343
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120344,
			120344
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120345,
			120345
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120346,
			120346
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120347,
			120347
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120348,
			120348
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120349,
			120349
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120350,
			120350
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120351,
			120351
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120352,
			120352
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120353,
			120353
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120354,
			120354
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120355,
			120355
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120356,
			120356
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120357,
			120357
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120358,
			120358
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120359,
			120359
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120360,
			120360
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120361,
			120361
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120362,
			120362
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120363,
			120363
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120364,
			120364
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120365,
			120365
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120366,
			120366
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120367,
			120367
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120368,
			120368
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120369,
			120369
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120370,
			120370
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120371,
			120371
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120372,
			120372
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120373,
			120373
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120374,
			120374
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120375,
			120375
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120376,
			120376
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120377,
			120377
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120378,
			120378
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120379,
			120379
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120380,
			120380
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120381,
			120381
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120382,
			120382
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120383,
			120383
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120384,
			120384
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120385,
			120385
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120386,
			120386
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120387,
			120387
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120388,
			120388
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120389,
			120389
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120390,
			120390
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120391,
			120391
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120392,
			120392
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120393,
			120393
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120394,
			120394
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120395,
			120395
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120396,
			120396
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120397,
			120397
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120398,
			120398
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120399,
			120399
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120400,
			120400
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120401,
			120401
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120402,
			120402
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120403,
			120403
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120404,
			120404
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120405,
			120405
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120406,
			120406
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120407,
			120407
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120408,
			120408
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120409,
			120409
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120410,
			120410
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120411,
			120411
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120412,
			120412
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120413,
			120413
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120414,
			120414
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120415,
			120415
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120416,
			120416
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120417,
			120417
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120418,
			120418
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120419,
			120419
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120420,
			120420
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120421,
			120421
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120422,
			120422
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120423,
			120423
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120424,
			120424
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120425,
			120425
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120426,
			120426
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120427,
			120427
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120428,
			120428
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120429,
			120429
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120430,
			120430
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120431,
			120431
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120432,
			120432
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120433,
			120433
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120434,
			120434
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120435,
			120435
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120436,
			120436
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120437,
			120437
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120438,
			120438
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120439,
			120439
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120440,
			120440
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120441,
			120441
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120442,
			120442
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120443,
			120443
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120444,
			120444
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120445,
			120445
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120446,
			120446
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120447,
			120447
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120448,
			120448
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120449,
			120449
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120450,
			120450
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120451,
			120451
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120452,
			120452
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120453,
			120453
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120454,
			120454
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120455,
			120455
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120456,
			120456
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120457,
			120457
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120458,
			120458
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			120459,
			120459
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			120460,
			120460
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			120461,
			120461
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			120462,
			120462
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			120463,
			120463
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			120464,
			120464
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			120465,
			120465
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			120466,
			120466
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			120467,
			120467
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			120468,
			120468
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			120469,
			120469
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			120470,
			120470
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			120471,
			120471
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			120472,
			120472
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			120473,
			120473
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			120474,
			120474
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			120475,
			120475
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			120476,
			120476
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			120477,
			120477
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			120478,
			120478
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			120479,
			120479
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			120480,
			120480
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			120481,
			120481
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			120482,
			120482
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			120483,
			120483
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			120484,
			120484
		],
		"mapped",
		[
			305
		]
	],
	[
		[
			120485,
			120485
		],
		"mapped",
		[
			567
		]
	],
	[
		[
			120486,
			120487
		],
		"disallowed"
	],
	[
		[
			120488,
			120488
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120489,
			120489
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120490,
			120490
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120491,
			120491
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120492,
			120492
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120493,
			120493
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120494,
			120494
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120495,
			120495
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120496,
			120496
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120497,
			120497
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120498,
			120498
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120499,
			120499
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120500,
			120500
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120501,
			120501
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120502,
			120502
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120503,
			120503
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120504,
			120504
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120505,
			120505
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120506,
			120506
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120507,
			120507
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120508,
			120508
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120509,
			120509
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120510,
			120510
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120511,
			120511
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120512,
			120512
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120513,
			120513
		],
		"mapped",
		[
			8711
		]
	],
	[
		[
			120514,
			120514
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120515,
			120515
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120516,
			120516
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120517,
			120517
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120518,
			120518
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120519,
			120519
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120520,
			120520
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120521,
			120521
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120522,
			120522
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120523,
			120523
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120524,
			120524
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120525,
			120525
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120526,
			120526
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120527,
			120527
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120528,
			120528
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120529,
			120529
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120530,
			120530
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120531,
			120532
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120533,
			120533
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120534,
			120534
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120535,
			120535
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120536,
			120536
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120537,
			120537
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120538,
			120538
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120539,
			120539
		],
		"mapped",
		[
			8706
		]
	],
	[
		[
			120540,
			120540
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120541,
			120541
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120542,
			120542
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120543,
			120543
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120544,
			120544
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120545,
			120545
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120546,
			120546
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120547,
			120547
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120548,
			120548
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120549,
			120549
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120550,
			120550
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120551,
			120551
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120552,
			120552
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120553,
			120553
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120554,
			120554
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120555,
			120555
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120556,
			120556
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120557,
			120557
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120558,
			120558
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120559,
			120559
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120560,
			120560
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120561,
			120561
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120562,
			120562
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120563,
			120563
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120564,
			120564
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120565,
			120565
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120566,
			120566
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120567,
			120567
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120568,
			120568
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120569,
			120569
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120570,
			120570
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120571,
			120571
		],
		"mapped",
		[
			8711
		]
	],
	[
		[
			120572,
			120572
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120573,
			120573
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120574,
			120574
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120575,
			120575
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120576,
			120576
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120577,
			120577
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120578,
			120578
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120579,
			120579
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120580,
			120580
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120581,
			120581
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120582,
			120582
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120583,
			120583
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120584,
			120584
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120585,
			120585
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120586,
			120586
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120587,
			120587
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120588,
			120588
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120589,
			120590
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120591,
			120591
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120592,
			120592
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120593,
			120593
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120594,
			120594
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120595,
			120595
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120596,
			120596
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120597,
			120597
		],
		"mapped",
		[
			8706
		]
	],
	[
		[
			120598,
			120598
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120599,
			120599
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120600,
			120600
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120601,
			120601
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120602,
			120602
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120603,
			120603
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120604,
			120604
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120605,
			120605
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120606,
			120606
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120607,
			120607
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120608,
			120608
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120609,
			120609
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120610,
			120610
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120611,
			120611
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120612,
			120612
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120613,
			120613
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120614,
			120614
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120615,
			120615
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120616,
			120616
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120617,
			120617
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120618,
			120618
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120619,
			120619
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120620,
			120620
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120621,
			120621
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120622,
			120622
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120623,
			120623
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120624,
			120624
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120625,
			120625
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120626,
			120626
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120627,
			120627
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120628,
			120628
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120629,
			120629
		],
		"mapped",
		[
			8711
		]
	],
	[
		[
			120630,
			120630
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120631,
			120631
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120632,
			120632
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120633,
			120633
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120634,
			120634
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120635,
			120635
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120636,
			120636
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120637,
			120637
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120638,
			120638
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120639,
			120639
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120640,
			120640
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120641,
			120641
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120642,
			120642
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120643,
			120643
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120644,
			120644
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120645,
			120645
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120646,
			120646
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120647,
			120648
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120649,
			120649
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120650,
			120650
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120651,
			120651
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120652,
			120652
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120653,
			120653
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120654,
			120654
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120655,
			120655
		],
		"mapped",
		[
			8706
		]
	],
	[
		[
			120656,
			120656
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120657,
			120657
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120658,
			120658
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120659,
			120659
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120660,
			120660
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120661,
			120661
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120662,
			120662
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120663,
			120663
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120664,
			120664
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120665,
			120665
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120666,
			120666
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120667,
			120667
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120668,
			120668
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120669,
			120669
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120670,
			120670
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120671,
			120671
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120672,
			120672
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120673,
			120673
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120674,
			120674
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120675,
			120675
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120676,
			120676
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120677,
			120677
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120678,
			120678
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120679,
			120679
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120680,
			120680
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120681,
			120681
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120682,
			120682
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120683,
			120683
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120684,
			120684
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120685,
			120685
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120686,
			120686
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120687,
			120687
		],
		"mapped",
		[
			8711
		]
	],
	[
		[
			120688,
			120688
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120689,
			120689
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120690,
			120690
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120691,
			120691
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120692,
			120692
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120693,
			120693
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120694,
			120694
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120695,
			120695
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120696,
			120696
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120697,
			120697
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120698,
			120698
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120699,
			120699
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120700,
			120700
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120701,
			120701
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120702,
			120702
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120703,
			120703
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120704,
			120704
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120705,
			120706
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120707,
			120707
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120708,
			120708
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120709,
			120709
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120710,
			120710
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120711,
			120711
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120712,
			120712
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120713,
			120713
		],
		"mapped",
		[
			8706
		]
	],
	[
		[
			120714,
			120714
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120715,
			120715
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120716,
			120716
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120717,
			120717
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120718,
			120718
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120719,
			120719
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120720,
			120720
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120721,
			120721
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120722,
			120722
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120723,
			120723
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120724,
			120724
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120725,
			120725
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120726,
			120726
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120727,
			120727
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120728,
			120728
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120729,
			120729
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120730,
			120730
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120731,
			120731
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120732,
			120732
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120733,
			120733
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120734,
			120734
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120735,
			120735
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120736,
			120736
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120737,
			120737
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120738,
			120738
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120739,
			120739
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120740,
			120740
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120741,
			120741
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120742,
			120742
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120743,
			120743
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120744,
			120744
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120745,
			120745
		],
		"mapped",
		[
			8711
		]
	],
	[
		[
			120746,
			120746
		],
		"mapped",
		[
			945
		]
	],
	[
		[
			120747,
			120747
		],
		"mapped",
		[
			946
		]
	],
	[
		[
			120748,
			120748
		],
		"mapped",
		[
			947
		]
	],
	[
		[
			120749,
			120749
		],
		"mapped",
		[
			948
		]
	],
	[
		[
			120750,
			120750
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120751,
			120751
		],
		"mapped",
		[
			950
		]
	],
	[
		[
			120752,
			120752
		],
		"mapped",
		[
			951
		]
	],
	[
		[
			120753,
			120753
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120754,
			120754
		],
		"mapped",
		[
			953
		]
	],
	[
		[
			120755,
			120755
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120756,
			120756
		],
		"mapped",
		[
			955
		]
	],
	[
		[
			120757,
			120757
		],
		"mapped",
		[
			956
		]
	],
	[
		[
			120758,
			120758
		],
		"mapped",
		[
			957
		]
	],
	[
		[
			120759,
			120759
		],
		"mapped",
		[
			958
		]
	],
	[
		[
			120760,
			120760
		],
		"mapped",
		[
			959
		]
	],
	[
		[
			120761,
			120761
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120762,
			120762
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120763,
			120764
		],
		"mapped",
		[
			963
		]
	],
	[
		[
			120765,
			120765
		],
		"mapped",
		[
			964
		]
	],
	[
		[
			120766,
			120766
		],
		"mapped",
		[
			965
		]
	],
	[
		[
			120767,
			120767
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120768,
			120768
		],
		"mapped",
		[
			967
		]
	],
	[
		[
			120769,
			120769
		],
		"mapped",
		[
			968
		]
	],
	[
		[
			120770,
			120770
		],
		"mapped",
		[
			969
		]
	],
	[
		[
			120771,
			120771
		],
		"mapped",
		[
			8706
		]
	],
	[
		[
			120772,
			120772
		],
		"mapped",
		[
			949
		]
	],
	[
		[
			120773,
			120773
		],
		"mapped",
		[
			952
		]
	],
	[
		[
			120774,
			120774
		],
		"mapped",
		[
			954
		]
	],
	[
		[
			120775,
			120775
		],
		"mapped",
		[
			966
		]
	],
	[
		[
			120776,
			120776
		],
		"mapped",
		[
			961
		]
	],
	[
		[
			120777,
			120777
		],
		"mapped",
		[
			960
		]
	],
	[
		[
			120778,
			120779
		],
		"mapped",
		[
			989
		]
	],
	[
		[
			120780,
			120781
		],
		"disallowed"
	],
	[
		[
			120782,
			120782
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			120783,
			120783
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			120784,
			120784
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			120785,
			120785
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			120786,
			120786
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			120787,
			120787
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			120788,
			120788
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			120789,
			120789
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			120790,
			120790
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			120791,
			120791
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			120792,
			120792
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			120793,
			120793
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			120794,
			120794
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			120795,
			120795
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			120796,
			120796
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			120797,
			120797
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			120798,
			120798
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			120799,
			120799
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			120800,
			120800
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			120801,
			120801
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			120802,
			120802
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			120803,
			120803
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			120804,
			120804
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			120805,
			120805
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			120806,
			120806
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			120807,
			120807
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			120808,
			120808
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			120809,
			120809
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			120810,
			120810
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			120811,
			120811
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			120812,
			120812
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			120813,
			120813
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			120814,
			120814
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			120815,
			120815
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			120816,
			120816
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			120817,
			120817
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			120818,
			120818
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			120819,
			120819
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			120820,
			120820
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			120821,
			120821
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			120822,
			120822
		],
		"mapped",
		[
			48
		]
	],
	[
		[
			120823,
			120823
		],
		"mapped",
		[
			49
		]
	],
	[
		[
			120824,
			120824
		],
		"mapped",
		[
			50
		]
	],
	[
		[
			120825,
			120825
		],
		"mapped",
		[
			51
		]
	],
	[
		[
			120826,
			120826
		],
		"mapped",
		[
			52
		]
	],
	[
		[
			120827,
			120827
		],
		"mapped",
		[
			53
		]
	],
	[
		[
			120828,
			120828
		],
		"mapped",
		[
			54
		]
	],
	[
		[
			120829,
			120829
		],
		"mapped",
		[
			55
		]
	],
	[
		[
			120830,
			120830
		],
		"mapped",
		[
			56
		]
	],
	[
		[
			120831,
			120831
		],
		"mapped",
		[
			57
		]
	],
	[
		[
			120832,
			121343
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			121344,
			121398
		],
		"valid"
	],
	[
		[
			121399,
			121402
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			121403,
			121452
		],
		"valid"
	],
	[
		[
			121453,
			121460
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			121461,
			121461
		],
		"valid"
	],
	[
		[
			121462,
			121475
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			121476,
			121476
		],
		"valid"
	],
	[
		[
			121477,
			121483
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			121484,
			121498
		],
		"disallowed"
	],
	[
		[
			121499,
			121503
		],
		"valid"
	],
	[
		[
			121504,
			121504
		],
		"disallowed"
	],
	[
		[
			121505,
			121519
		],
		"valid"
	],
	[
		[
			121520,
			124927
		],
		"disallowed"
	],
	[
		[
			124928,
			125124
		],
		"valid"
	],
	[
		[
			125125,
			125126
		],
		"disallowed"
	],
	[
		[
			125127,
			125135
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			125136,
			125142
		],
		"valid"
	],
	[
		[
			125143,
			126463
		],
		"disallowed"
	],
	[
		[
			126464,
			126464
		],
		"mapped",
		[
			1575
		]
	],
	[
		[
			126465,
			126465
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			126466,
			126466
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126467,
			126467
		],
		"mapped",
		[
			1583
		]
	],
	[
		[
			126468,
			126468
		],
		"disallowed"
	],
	[
		[
			126469,
			126469
		],
		"mapped",
		[
			1608
		]
	],
	[
		[
			126470,
			126470
		],
		"mapped",
		[
			1586
		]
	],
	[
		[
			126471,
			126471
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126472,
			126472
		],
		"mapped",
		[
			1591
		]
	],
	[
		[
			126473,
			126473
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126474,
			126474
		],
		"mapped",
		[
			1603
		]
	],
	[
		[
			126475,
			126475
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			126476,
			126476
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			126477,
			126477
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126478,
			126478
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126479,
			126479
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126480,
			126480
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			126481,
			126481
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126482,
			126482
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126483,
			126483
		],
		"mapped",
		[
			1585
		]
	],
	[
		[
			126484,
			126484
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126485,
			126485
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			126486,
			126486
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			126487,
			126487
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126488,
			126488
		],
		"mapped",
		[
			1584
		]
	],
	[
		[
			126489,
			126489
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126490,
			126490
		],
		"mapped",
		[
			1592
		]
	],
	[
		[
			126491,
			126491
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126492,
			126492
		],
		"mapped",
		[
			1646
		]
	],
	[
		[
			126493,
			126493
		],
		"mapped",
		[
			1722
		]
	],
	[
		[
			126494,
			126494
		],
		"mapped",
		[
			1697
		]
	],
	[
		[
			126495,
			126495
		],
		"mapped",
		[
			1647
		]
	],
	[
		[
			126496,
			126496
		],
		"disallowed"
	],
	[
		[
			126497,
			126497
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			126498,
			126498
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126499,
			126499
		],
		"disallowed"
	],
	[
		[
			126500,
			126500
		],
		"mapped",
		[
			1607
		]
	],
	[
		[
			126501,
			126502
		],
		"disallowed"
	],
	[
		[
			126503,
			126503
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126504,
			126504
		],
		"disallowed"
	],
	[
		[
			126505,
			126505
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126506,
			126506
		],
		"mapped",
		[
			1603
		]
	],
	[
		[
			126507,
			126507
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			126508,
			126508
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			126509,
			126509
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126510,
			126510
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126511,
			126511
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126512,
			126512
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			126513,
			126513
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126514,
			126514
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126515,
			126515
		],
		"disallowed"
	],
	[
		[
			126516,
			126516
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126517,
			126517
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			126518,
			126518
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			126519,
			126519
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126520,
			126520
		],
		"disallowed"
	],
	[
		[
			126521,
			126521
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126522,
			126522
		],
		"disallowed"
	],
	[
		[
			126523,
			126523
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126524,
			126529
		],
		"disallowed"
	],
	[
		[
			126530,
			126530
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126531,
			126534
		],
		"disallowed"
	],
	[
		[
			126535,
			126535
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126536,
			126536
		],
		"disallowed"
	],
	[
		[
			126537,
			126537
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126538,
			126538
		],
		"disallowed"
	],
	[
		[
			126539,
			126539
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			126540,
			126540
		],
		"disallowed"
	],
	[
		[
			126541,
			126541
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126542,
			126542
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126543,
			126543
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126544,
			126544
		],
		"disallowed"
	],
	[
		[
			126545,
			126545
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126546,
			126546
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126547,
			126547
		],
		"disallowed"
	],
	[
		[
			126548,
			126548
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126549,
			126550
		],
		"disallowed"
	],
	[
		[
			126551,
			126551
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126552,
			126552
		],
		"disallowed"
	],
	[
		[
			126553,
			126553
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126554,
			126554
		],
		"disallowed"
	],
	[
		[
			126555,
			126555
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126556,
			126556
		],
		"disallowed"
	],
	[
		[
			126557,
			126557
		],
		"mapped",
		[
			1722
		]
	],
	[
		[
			126558,
			126558
		],
		"disallowed"
	],
	[
		[
			126559,
			126559
		],
		"mapped",
		[
			1647
		]
	],
	[
		[
			126560,
			126560
		],
		"disallowed"
	],
	[
		[
			126561,
			126561
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			126562,
			126562
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126563,
			126563
		],
		"disallowed"
	],
	[
		[
			126564,
			126564
		],
		"mapped",
		[
			1607
		]
	],
	[
		[
			126565,
			126566
		],
		"disallowed"
	],
	[
		[
			126567,
			126567
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126568,
			126568
		],
		"mapped",
		[
			1591
		]
	],
	[
		[
			126569,
			126569
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126570,
			126570
		],
		"mapped",
		[
			1603
		]
	],
	[
		[
			126571,
			126571
		],
		"disallowed"
	],
	[
		[
			126572,
			126572
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			126573,
			126573
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126574,
			126574
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126575,
			126575
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126576,
			126576
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			126577,
			126577
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126578,
			126578
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126579,
			126579
		],
		"disallowed"
	],
	[
		[
			126580,
			126580
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126581,
			126581
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			126582,
			126582
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			126583,
			126583
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126584,
			126584
		],
		"disallowed"
	],
	[
		[
			126585,
			126585
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126586,
			126586
		],
		"mapped",
		[
			1592
		]
	],
	[
		[
			126587,
			126587
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126588,
			126588
		],
		"mapped",
		[
			1646
		]
	],
	[
		[
			126589,
			126589
		],
		"disallowed"
	],
	[
		[
			126590,
			126590
		],
		"mapped",
		[
			1697
		]
	],
	[
		[
			126591,
			126591
		],
		"disallowed"
	],
	[
		[
			126592,
			126592
		],
		"mapped",
		[
			1575
		]
	],
	[
		[
			126593,
			126593
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			126594,
			126594
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126595,
			126595
		],
		"mapped",
		[
			1583
		]
	],
	[
		[
			126596,
			126596
		],
		"mapped",
		[
			1607
		]
	],
	[
		[
			126597,
			126597
		],
		"mapped",
		[
			1608
		]
	],
	[
		[
			126598,
			126598
		],
		"mapped",
		[
			1586
		]
	],
	[
		[
			126599,
			126599
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126600,
			126600
		],
		"mapped",
		[
			1591
		]
	],
	[
		[
			126601,
			126601
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126602,
			126602
		],
		"disallowed"
	],
	[
		[
			126603,
			126603
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			126604,
			126604
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			126605,
			126605
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126606,
			126606
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126607,
			126607
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126608,
			126608
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			126609,
			126609
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126610,
			126610
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126611,
			126611
		],
		"mapped",
		[
			1585
		]
	],
	[
		[
			126612,
			126612
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126613,
			126613
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			126614,
			126614
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			126615,
			126615
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126616,
			126616
		],
		"mapped",
		[
			1584
		]
	],
	[
		[
			126617,
			126617
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126618,
			126618
		],
		"mapped",
		[
			1592
		]
	],
	[
		[
			126619,
			126619
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126620,
			126624
		],
		"disallowed"
	],
	[
		[
			126625,
			126625
		],
		"mapped",
		[
			1576
		]
	],
	[
		[
			126626,
			126626
		],
		"mapped",
		[
			1580
		]
	],
	[
		[
			126627,
			126627
		],
		"mapped",
		[
			1583
		]
	],
	[
		[
			126628,
			126628
		],
		"disallowed"
	],
	[
		[
			126629,
			126629
		],
		"mapped",
		[
			1608
		]
	],
	[
		[
			126630,
			126630
		],
		"mapped",
		[
			1586
		]
	],
	[
		[
			126631,
			126631
		],
		"mapped",
		[
			1581
		]
	],
	[
		[
			126632,
			126632
		],
		"mapped",
		[
			1591
		]
	],
	[
		[
			126633,
			126633
		],
		"mapped",
		[
			1610
		]
	],
	[
		[
			126634,
			126634
		],
		"disallowed"
	],
	[
		[
			126635,
			126635
		],
		"mapped",
		[
			1604
		]
	],
	[
		[
			126636,
			126636
		],
		"mapped",
		[
			1605
		]
	],
	[
		[
			126637,
			126637
		],
		"mapped",
		[
			1606
		]
	],
	[
		[
			126638,
			126638
		],
		"mapped",
		[
			1587
		]
	],
	[
		[
			126639,
			126639
		],
		"mapped",
		[
			1593
		]
	],
	[
		[
			126640,
			126640
		],
		"mapped",
		[
			1601
		]
	],
	[
		[
			126641,
			126641
		],
		"mapped",
		[
			1589
		]
	],
	[
		[
			126642,
			126642
		],
		"mapped",
		[
			1602
		]
	],
	[
		[
			126643,
			126643
		],
		"mapped",
		[
			1585
		]
	],
	[
		[
			126644,
			126644
		],
		"mapped",
		[
			1588
		]
	],
	[
		[
			126645,
			126645
		],
		"mapped",
		[
			1578
		]
	],
	[
		[
			126646,
			126646
		],
		"mapped",
		[
			1579
		]
	],
	[
		[
			126647,
			126647
		],
		"mapped",
		[
			1582
		]
	],
	[
		[
			126648,
			126648
		],
		"mapped",
		[
			1584
		]
	],
	[
		[
			126649,
			126649
		],
		"mapped",
		[
			1590
		]
	],
	[
		[
			126650,
			126650
		],
		"mapped",
		[
			1592
		]
	],
	[
		[
			126651,
			126651
		],
		"mapped",
		[
			1594
		]
	],
	[
		[
			126652,
			126703
		],
		"disallowed"
	],
	[
		[
			126704,
			126705
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			126706,
			126975
		],
		"disallowed"
	],
	[
		[
			126976,
			127019
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127020,
			127023
		],
		"disallowed"
	],
	[
		[
			127024,
			127123
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127124,
			127135
		],
		"disallowed"
	],
	[
		[
			127136,
			127150
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127151,
			127152
		],
		"disallowed"
	],
	[
		[
			127153,
			127166
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127167,
			127167
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127168,
			127168
		],
		"disallowed"
	],
	[
		[
			127169,
			127183
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127184,
			127184
		],
		"disallowed"
	],
	[
		[
			127185,
			127199
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127200,
			127221
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127222,
			127231
		],
		"disallowed"
	],
	[
		[
			127232,
			127232
		],
		"disallowed"
	],
	[
		[
			127233,
			127233
		],
		"disallowed_STD3_mapped",
		[
			48,
			44
		]
	],
	[
		[
			127234,
			127234
		],
		"disallowed_STD3_mapped",
		[
			49,
			44
		]
	],
	[
		[
			127235,
			127235
		],
		"disallowed_STD3_mapped",
		[
			50,
			44
		]
	],
	[
		[
			127236,
			127236
		],
		"disallowed_STD3_mapped",
		[
			51,
			44
		]
	],
	[
		[
			127237,
			127237
		],
		"disallowed_STD3_mapped",
		[
			52,
			44
		]
	],
	[
		[
			127238,
			127238
		],
		"disallowed_STD3_mapped",
		[
			53,
			44
		]
	],
	[
		[
			127239,
			127239
		],
		"disallowed_STD3_mapped",
		[
			54,
			44
		]
	],
	[
		[
			127240,
			127240
		],
		"disallowed_STD3_mapped",
		[
			55,
			44
		]
	],
	[
		[
			127241,
			127241
		],
		"disallowed_STD3_mapped",
		[
			56,
			44
		]
	],
	[
		[
			127242,
			127242
		],
		"disallowed_STD3_mapped",
		[
			57,
			44
		]
	],
	[
		[
			127243,
			127244
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127245,
			127247
		],
		"disallowed"
	],
	[
		[
			127248,
			127248
		],
		"disallowed_STD3_mapped",
		[
			40,
			97,
			41
		]
	],
	[
		[
			127249,
			127249
		],
		"disallowed_STD3_mapped",
		[
			40,
			98,
			41
		]
	],
	[
		[
			127250,
			127250
		],
		"disallowed_STD3_mapped",
		[
			40,
			99,
			41
		]
	],
	[
		[
			127251,
			127251
		],
		"disallowed_STD3_mapped",
		[
			40,
			100,
			41
		]
	],
	[
		[
			127252,
			127252
		],
		"disallowed_STD3_mapped",
		[
			40,
			101,
			41
		]
	],
	[
		[
			127253,
			127253
		],
		"disallowed_STD3_mapped",
		[
			40,
			102,
			41
		]
	],
	[
		[
			127254,
			127254
		],
		"disallowed_STD3_mapped",
		[
			40,
			103,
			41
		]
	],
	[
		[
			127255,
			127255
		],
		"disallowed_STD3_mapped",
		[
			40,
			104,
			41
		]
	],
	[
		[
			127256,
			127256
		],
		"disallowed_STD3_mapped",
		[
			40,
			105,
			41
		]
	],
	[
		[
			127257,
			127257
		],
		"disallowed_STD3_mapped",
		[
			40,
			106,
			41
		]
	],
	[
		[
			127258,
			127258
		],
		"disallowed_STD3_mapped",
		[
			40,
			107,
			41
		]
	],
	[
		[
			127259,
			127259
		],
		"disallowed_STD3_mapped",
		[
			40,
			108,
			41
		]
	],
	[
		[
			127260,
			127260
		],
		"disallowed_STD3_mapped",
		[
			40,
			109,
			41
		]
	],
	[
		[
			127261,
			127261
		],
		"disallowed_STD3_mapped",
		[
			40,
			110,
			41
		]
	],
	[
		[
			127262,
			127262
		],
		"disallowed_STD3_mapped",
		[
			40,
			111,
			41
		]
	],
	[
		[
			127263,
			127263
		],
		"disallowed_STD3_mapped",
		[
			40,
			112,
			41
		]
	],
	[
		[
			127264,
			127264
		],
		"disallowed_STD3_mapped",
		[
			40,
			113,
			41
		]
	],
	[
		[
			127265,
			127265
		],
		"disallowed_STD3_mapped",
		[
			40,
			114,
			41
		]
	],
	[
		[
			127266,
			127266
		],
		"disallowed_STD3_mapped",
		[
			40,
			115,
			41
		]
	],
	[
		[
			127267,
			127267
		],
		"disallowed_STD3_mapped",
		[
			40,
			116,
			41
		]
	],
	[
		[
			127268,
			127268
		],
		"disallowed_STD3_mapped",
		[
			40,
			117,
			41
		]
	],
	[
		[
			127269,
			127269
		],
		"disallowed_STD3_mapped",
		[
			40,
			118,
			41
		]
	],
	[
		[
			127270,
			127270
		],
		"disallowed_STD3_mapped",
		[
			40,
			119,
			41
		]
	],
	[
		[
			127271,
			127271
		],
		"disallowed_STD3_mapped",
		[
			40,
			120,
			41
		]
	],
	[
		[
			127272,
			127272
		],
		"disallowed_STD3_mapped",
		[
			40,
			121,
			41
		]
	],
	[
		[
			127273,
			127273
		],
		"disallowed_STD3_mapped",
		[
			40,
			122,
			41
		]
	],
	[
		[
			127274,
			127274
		],
		"mapped",
		[
			12308,
			115,
			12309
		]
	],
	[
		[
			127275,
			127275
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			127276,
			127276
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			127277,
			127277
		],
		"mapped",
		[
			99,
			100
		]
	],
	[
		[
			127278,
			127278
		],
		"mapped",
		[
			119,
			122
		]
	],
	[
		[
			127279,
			127279
		],
		"disallowed"
	],
	[
		[
			127280,
			127280
		],
		"mapped",
		[
			97
		]
	],
	[
		[
			127281,
			127281
		],
		"mapped",
		[
			98
		]
	],
	[
		[
			127282,
			127282
		],
		"mapped",
		[
			99
		]
	],
	[
		[
			127283,
			127283
		],
		"mapped",
		[
			100
		]
	],
	[
		[
			127284,
			127284
		],
		"mapped",
		[
			101
		]
	],
	[
		[
			127285,
			127285
		],
		"mapped",
		[
			102
		]
	],
	[
		[
			127286,
			127286
		],
		"mapped",
		[
			103
		]
	],
	[
		[
			127287,
			127287
		],
		"mapped",
		[
			104
		]
	],
	[
		[
			127288,
			127288
		],
		"mapped",
		[
			105
		]
	],
	[
		[
			127289,
			127289
		],
		"mapped",
		[
			106
		]
	],
	[
		[
			127290,
			127290
		],
		"mapped",
		[
			107
		]
	],
	[
		[
			127291,
			127291
		],
		"mapped",
		[
			108
		]
	],
	[
		[
			127292,
			127292
		],
		"mapped",
		[
			109
		]
	],
	[
		[
			127293,
			127293
		],
		"mapped",
		[
			110
		]
	],
	[
		[
			127294,
			127294
		],
		"mapped",
		[
			111
		]
	],
	[
		[
			127295,
			127295
		],
		"mapped",
		[
			112
		]
	],
	[
		[
			127296,
			127296
		],
		"mapped",
		[
			113
		]
	],
	[
		[
			127297,
			127297
		],
		"mapped",
		[
			114
		]
	],
	[
		[
			127298,
			127298
		],
		"mapped",
		[
			115
		]
	],
	[
		[
			127299,
			127299
		],
		"mapped",
		[
			116
		]
	],
	[
		[
			127300,
			127300
		],
		"mapped",
		[
			117
		]
	],
	[
		[
			127301,
			127301
		],
		"mapped",
		[
			118
		]
	],
	[
		[
			127302,
			127302
		],
		"mapped",
		[
			119
		]
	],
	[
		[
			127303,
			127303
		],
		"mapped",
		[
			120
		]
	],
	[
		[
			127304,
			127304
		],
		"mapped",
		[
			121
		]
	],
	[
		[
			127305,
			127305
		],
		"mapped",
		[
			122
		]
	],
	[
		[
			127306,
			127306
		],
		"mapped",
		[
			104,
			118
		]
	],
	[
		[
			127307,
			127307
		],
		"mapped",
		[
			109,
			118
		]
	],
	[
		[
			127308,
			127308
		],
		"mapped",
		[
			115,
			100
		]
	],
	[
		[
			127309,
			127309
		],
		"mapped",
		[
			115,
			115
		]
	],
	[
		[
			127310,
			127310
		],
		"mapped",
		[
			112,
			112,
			118
		]
	],
	[
		[
			127311,
			127311
		],
		"mapped",
		[
			119,
			99
		]
	],
	[
		[
			127312,
			127318
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127319,
			127319
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127320,
			127326
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127327,
			127327
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127328,
			127337
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127338,
			127338
		],
		"mapped",
		[
			109,
			99
		]
	],
	[
		[
			127339,
			127339
		],
		"mapped",
		[
			109,
			100
		]
	],
	[
		[
			127340,
			127343
		],
		"disallowed"
	],
	[
		[
			127344,
			127352
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127353,
			127353
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127354,
			127354
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127355,
			127356
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127357,
			127358
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127359,
			127359
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127360,
			127369
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127370,
			127373
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127374,
			127375
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127376,
			127376
		],
		"mapped",
		[
			100,
			106
		]
	],
	[
		[
			127377,
			127386
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127387,
			127461
		],
		"disallowed"
	],
	[
		[
			127462,
			127487
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127488,
			127488
		],
		"mapped",
		[
			12411,
			12363
		]
	],
	[
		[
			127489,
			127489
		],
		"mapped",
		[
			12467,
			12467
		]
	],
	[
		[
			127490,
			127490
		],
		"mapped",
		[
			12469
		]
	],
	[
		[
			127491,
			127503
		],
		"disallowed"
	],
	[
		[
			127504,
			127504
		],
		"mapped",
		[
			25163
		]
	],
	[
		[
			127505,
			127505
		],
		"mapped",
		[
			23383
		]
	],
	[
		[
			127506,
			127506
		],
		"mapped",
		[
			21452
		]
	],
	[
		[
			127507,
			127507
		],
		"mapped",
		[
			12487
		]
	],
	[
		[
			127508,
			127508
		],
		"mapped",
		[
			20108
		]
	],
	[
		[
			127509,
			127509
		],
		"mapped",
		[
			22810
		]
	],
	[
		[
			127510,
			127510
		],
		"mapped",
		[
			35299
		]
	],
	[
		[
			127511,
			127511
		],
		"mapped",
		[
			22825
		]
	],
	[
		[
			127512,
			127512
		],
		"mapped",
		[
			20132
		]
	],
	[
		[
			127513,
			127513
		],
		"mapped",
		[
			26144
		]
	],
	[
		[
			127514,
			127514
		],
		"mapped",
		[
			28961
		]
	],
	[
		[
			127515,
			127515
		],
		"mapped",
		[
			26009
		]
	],
	[
		[
			127516,
			127516
		],
		"mapped",
		[
			21069
		]
	],
	[
		[
			127517,
			127517
		],
		"mapped",
		[
			24460
		]
	],
	[
		[
			127518,
			127518
		],
		"mapped",
		[
			20877
		]
	],
	[
		[
			127519,
			127519
		],
		"mapped",
		[
			26032
		]
	],
	[
		[
			127520,
			127520
		],
		"mapped",
		[
			21021
		]
	],
	[
		[
			127521,
			127521
		],
		"mapped",
		[
			32066
		]
	],
	[
		[
			127522,
			127522
		],
		"mapped",
		[
			29983
		]
	],
	[
		[
			127523,
			127523
		],
		"mapped",
		[
			36009
		]
	],
	[
		[
			127524,
			127524
		],
		"mapped",
		[
			22768
		]
	],
	[
		[
			127525,
			127525
		],
		"mapped",
		[
			21561
		]
	],
	[
		[
			127526,
			127526
		],
		"mapped",
		[
			28436
		]
	],
	[
		[
			127527,
			127527
		],
		"mapped",
		[
			25237
		]
	],
	[
		[
			127528,
			127528
		],
		"mapped",
		[
			25429
		]
	],
	[
		[
			127529,
			127529
		],
		"mapped",
		[
			19968
		]
	],
	[
		[
			127530,
			127530
		],
		"mapped",
		[
			19977
		]
	],
	[
		[
			127531,
			127531
		],
		"mapped",
		[
			36938
		]
	],
	[
		[
			127532,
			127532
		],
		"mapped",
		[
			24038
		]
	],
	[
		[
			127533,
			127533
		],
		"mapped",
		[
			20013
		]
	],
	[
		[
			127534,
			127534
		],
		"mapped",
		[
			21491
		]
	],
	[
		[
			127535,
			127535
		],
		"mapped",
		[
			25351
		]
	],
	[
		[
			127536,
			127536
		],
		"mapped",
		[
			36208
		]
	],
	[
		[
			127537,
			127537
		],
		"mapped",
		[
			25171
		]
	],
	[
		[
			127538,
			127538
		],
		"mapped",
		[
			31105
		]
	],
	[
		[
			127539,
			127539
		],
		"mapped",
		[
			31354
		]
	],
	[
		[
			127540,
			127540
		],
		"mapped",
		[
			21512
		]
	],
	[
		[
			127541,
			127541
		],
		"mapped",
		[
			28288
		]
	],
	[
		[
			127542,
			127542
		],
		"mapped",
		[
			26377
		]
	],
	[
		[
			127543,
			127543
		],
		"mapped",
		[
			26376
		]
	],
	[
		[
			127544,
			127544
		],
		"mapped",
		[
			30003
		]
	],
	[
		[
			127545,
			127545
		],
		"mapped",
		[
			21106
		]
	],
	[
		[
			127546,
			127546
		],
		"mapped",
		[
			21942
		]
	],
	[
		[
			127547,
			127551
		],
		"disallowed"
	],
	[
		[
			127552,
			127552
		],
		"mapped",
		[
			12308,
			26412,
			12309
		]
	],
	[
		[
			127553,
			127553
		],
		"mapped",
		[
			12308,
			19977,
			12309
		]
	],
	[
		[
			127554,
			127554
		],
		"mapped",
		[
			12308,
			20108,
			12309
		]
	],
	[
		[
			127555,
			127555
		],
		"mapped",
		[
			12308,
			23433,
			12309
		]
	],
	[
		[
			127556,
			127556
		],
		"mapped",
		[
			12308,
			28857,
			12309
		]
	],
	[
		[
			127557,
			127557
		],
		"mapped",
		[
			12308,
			25171,
			12309
		]
	],
	[
		[
			127558,
			127558
		],
		"mapped",
		[
			12308,
			30423,
			12309
		]
	],
	[
		[
			127559,
			127559
		],
		"mapped",
		[
			12308,
			21213,
			12309
		]
	],
	[
		[
			127560,
			127560
		],
		"mapped",
		[
			12308,
			25943,
			12309
		]
	],
	[
		[
			127561,
			127567
		],
		"disallowed"
	],
	[
		[
			127568,
			127568
		],
		"mapped",
		[
			24471
		]
	],
	[
		[
			127569,
			127569
		],
		"mapped",
		[
			21487
		]
	],
	[
		[
			127570,
			127743
		],
		"disallowed"
	],
	[
		[
			127744,
			127776
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127777,
			127788
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127789,
			127791
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127792,
			127797
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127798,
			127798
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127799,
			127868
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127869,
			127869
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127870,
			127871
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127872,
			127891
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127892,
			127903
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127904,
			127940
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127941,
			127941
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127942,
			127946
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127947,
			127950
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127951,
			127955
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127956,
			127967
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127968,
			127984
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127985,
			127991
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			127992,
			127999
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128000,
			128062
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128063,
			128063
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128064,
			128064
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128065,
			128065
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128066,
			128247
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128248,
			128248
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128249,
			128252
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128253,
			128254
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128255,
			128255
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128256,
			128317
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128318,
			128319
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128320,
			128323
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128324,
			128330
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128331,
			128335
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128336,
			128359
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128360,
			128377
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128378,
			128378
		],
		"disallowed"
	],
	[
		[
			128379,
			128419
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128420,
			128420
		],
		"disallowed"
	],
	[
		[
			128421,
			128506
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128507,
			128511
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128512,
			128512
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128513,
			128528
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128529,
			128529
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128530,
			128532
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128533,
			128533
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128534,
			128534
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128535,
			128535
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128536,
			128536
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128537,
			128537
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128538,
			128538
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128539,
			128539
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128540,
			128542
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128543,
			128543
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128544,
			128549
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128550,
			128551
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128552,
			128555
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128556,
			128556
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128557,
			128557
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128558,
			128559
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128560,
			128563
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128564,
			128564
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128565,
			128576
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128577,
			128578
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128579,
			128580
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128581,
			128591
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128592,
			128639
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128640,
			128709
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128710,
			128719
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128720,
			128720
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128721,
			128735
		],
		"disallowed"
	],
	[
		[
			128736,
			128748
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128749,
			128751
		],
		"disallowed"
	],
	[
		[
			128752,
			128755
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128756,
			128767
		],
		"disallowed"
	],
	[
		[
			128768,
			128883
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128884,
			128895
		],
		"disallowed"
	],
	[
		[
			128896,
			128980
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			128981,
			129023
		],
		"disallowed"
	],
	[
		[
			129024,
			129035
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129036,
			129039
		],
		"disallowed"
	],
	[
		[
			129040,
			129095
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129096,
			129103
		],
		"disallowed"
	],
	[
		[
			129104,
			129113
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129114,
			129119
		],
		"disallowed"
	],
	[
		[
			129120,
			129159
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129160,
			129167
		],
		"disallowed"
	],
	[
		[
			129168,
			129197
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129198,
			129295
		],
		"disallowed"
	],
	[
		[
			129296,
			129304
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129305,
			129407
		],
		"disallowed"
	],
	[
		[
			129408,
			129412
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129413,
			129471
		],
		"disallowed"
	],
	[
		[
			129472,
			129472
		],
		"valid",
		[
		],
		"NV8"
	],
	[
		[
			129473,
			131069
		],
		"disallowed"
	],
	[
		[
			131070,
			131071
		],
		"disallowed"
	],
	[
		[
			131072,
			173782
		],
		"valid"
	],
	[
		[
			173783,
			173823
		],
		"disallowed"
	],
	[
		[
			173824,
			177972
		],
		"valid"
	],
	[
		[
			177973,
			177983
		],
		"disallowed"
	],
	[
		[
			177984,
			178205
		],
		"valid"
	],
	[
		[
			178206,
			178207
		],
		"disallowed"
	],
	[
		[
			178208,
			183969
		],
		"valid"
	],
	[
		[
			183970,
			194559
		],
		"disallowed"
	],
	[
		[
			194560,
			194560
		],
		"mapped",
		[
			20029
		]
	],
	[
		[
			194561,
			194561
		],
		"mapped",
		[
			20024
		]
	],
	[
		[
			194562,
			194562
		],
		"mapped",
		[
			20033
		]
	],
	[
		[
			194563,
			194563
		],
		"mapped",
		[
			131362
		]
	],
	[
		[
			194564,
			194564
		],
		"mapped",
		[
			20320
		]
	],
	[
		[
			194565,
			194565
		],
		"mapped",
		[
			20398
		]
	],
	[
		[
			194566,
			194566
		],
		"mapped",
		[
			20411
		]
	],
	[
		[
			194567,
			194567
		],
		"mapped",
		[
			20482
		]
	],
	[
		[
			194568,
			194568
		],
		"mapped",
		[
			20602
		]
	],
	[
		[
			194569,
			194569
		],
		"mapped",
		[
			20633
		]
	],
	[
		[
			194570,
			194570
		],
		"mapped",
		[
			20711
		]
	],
	[
		[
			194571,
			194571
		],
		"mapped",
		[
			20687
		]
	],
	[
		[
			194572,
			194572
		],
		"mapped",
		[
			13470
		]
	],
	[
		[
			194573,
			194573
		],
		"mapped",
		[
			132666
		]
	],
	[
		[
			194574,
			194574
		],
		"mapped",
		[
			20813
		]
	],
	[
		[
			194575,
			194575
		],
		"mapped",
		[
			20820
		]
	],
	[
		[
			194576,
			194576
		],
		"mapped",
		[
			20836
		]
	],
	[
		[
			194577,
			194577
		],
		"mapped",
		[
			20855
		]
	],
	[
		[
			194578,
			194578
		],
		"mapped",
		[
			132380
		]
	],
	[
		[
			194579,
			194579
		],
		"mapped",
		[
			13497
		]
	],
	[
		[
			194580,
			194580
		],
		"mapped",
		[
			20839
		]
	],
	[
		[
			194581,
			194581
		],
		"mapped",
		[
			20877
		]
	],
	[
		[
			194582,
			194582
		],
		"mapped",
		[
			132427
		]
	],
	[
		[
			194583,
			194583
		],
		"mapped",
		[
			20887
		]
	],
	[
		[
			194584,
			194584
		],
		"mapped",
		[
			20900
		]
	],
	[
		[
			194585,
			194585
		],
		"mapped",
		[
			20172
		]
	],
	[
		[
			194586,
			194586
		],
		"mapped",
		[
			20908
		]
	],
	[
		[
			194587,
			194587
		],
		"mapped",
		[
			20917
		]
	],
	[
		[
			194588,
			194588
		],
		"mapped",
		[
			168415
		]
	],
	[
		[
			194589,
			194589
		],
		"mapped",
		[
			20981
		]
	],
	[
		[
			194590,
			194590
		],
		"mapped",
		[
			20995
		]
	],
	[
		[
			194591,
			194591
		],
		"mapped",
		[
			13535
		]
	],
	[
		[
			194592,
			194592
		],
		"mapped",
		[
			21051
		]
	],
	[
		[
			194593,
			194593
		],
		"mapped",
		[
			21062
		]
	],
	[
		[
			194594,
			194594
		],
		"mapped",
		[
			21106
		]
	],
	[
		[
			194595,
			194595
		],
		"mapped",
		[
			21111
		]
	],
	[
		[
			194596,
			194596
		],
		"mapped",
		[
			13589
		]
	],
	[
		[
			194597,
			194597
		],
		"mapped",
		[
			21191
		]
	],
	[
		[
			194598,
			194598
		],
		"mapped",
		[
			21193
		]
	],
	[
		[
			194599,
			194599
		],
		"mapped",
		[
			21220
		]
	],
	[
		[
			194600,
			194600
		],
		"mapped",
		[
			21242
		]
	],
	[
		[
			194601,
			194601
		],
		"mapped",
		[
			21253
		]
	],
	[
		[
			194602,
			194602
		],
		"mapped",
		[
			21254
		]
	],
	[
		[
			194603,
			194603
		],
		"mapped",
		[
			21271
		]
	],
	[
		[
			194604,
			194604
		],
		"mapped",
		[
			21321
		]
	],
	[
		[
			194605,
			194605
		],
		"mapped",
		[
			21329
		]
	],
	[
		[
			194606,
			194606
		],
		"mapped",
		[
			21338
		]
	],
	[
		[
			194607,
			194607
		],
		"mapped",
		[
			21363
		]
	],
	[
		[
			194608,
			194608
		],
		"mapped",
		[
			21373
		]
	],
	[
		[
			194609,
			194611
		],
		"mapped",
		[
			21375
		]
	],
	[
		[
			194612,
			194612
		],
		"mapped",
		[
			133676
		]
	],
	[
		[
			194613,
			194613
		],
		"mapped",
		[
			28784
		]
	],
	[
		[
			194614,
			194614
		],
		"mapped",
		[
			21450
		]
	],
	[
		[
			194615,
			194615
		],
		"mapped",
		[
			21471
		]
	],
	[
		[
			194616,
			194616
		],
		"mapped",
		[
			133987
		]
	],
	[
		[
			194617,
			194617
		],
		"mapped",
		[
			21483
		]
	],
	[
		[
			194618,
			194618
		],
		"mapped",
		[
			21489
		]
	],
	[
		[
			194619,
			194619
		],
		"mapped",
		[
			21510
		]
	],
	[
		[
			194620,
			194620
		],
		"mapped",
		[
			21662
		]
	],
	[
		[
			194621,
			194621
		],
		"mapped",
		[
			21560
		]
	],
	[
		[
			194622,
			194622
		],
		"mapped",
		[
			21576
		]
	],
	[
		[
			194623,
			194623
		],
		"mapped",
		[
			21608
		]
	],
	[
		[
			194624,
			194624
		],
		"mapped",
		[
			21666
		]
	],
	[
		[
			194625,
			194625
		],
		"mapped",
		[
			21750
		]
	],
	[
		[
			194626,
			194626
		],
		"mapped",
		[
			21776
		]
	],
	[
		[
			194627,
			194627
		],
		"mapped",
		[
			21843
		]
	],
	[
		[
			194628,
			194628
		],
		"mapped",
		[
			21859
		]
	],
	[
		[
			194629,
			194630
		],
		"mapped",
		[
			21892
		]
	],
	[
		[
			194631,
			194631
		],
		"mapped",
		[
			21913
		]
	],
	[
		[
			194632,
			194632
		],
		"mapped",
		[
			21931
		]
	],
	[
		[
			194633,
			194633
		],
		"mapped",
		[
			21939
		]
	],
	[
		[
			194634,
			194634
		],
		"mapped",
		[
			21954
		]
	],
	[
		[
			194635,
			194635
		],
		"mapped",
		[
			22294
		]
	],
	[
		[
			194636,
			194636
		],
		"mapped",
		[
			22022
		]
	],
	[
		[
			194637,
			194637
		],
		"mapped",
		[
			22295
		]
	],
	[
		[
			194638,
			194638
		],
		"mapped",
		[
			22097
		]
	],
	[
		[
			194639,
			194639
		],
		"mapped",
		[
			22132
		]
	],
	[
		[
			194640,
			194640
		],
		"mapped",
		[
			20999
		]
	],
	[
		[
			194641,
			194641
		],
		"mapped",
		[
			22766
		]
	],
	[
		[
			194642,
			194642
		],
		"mapped",
		[
			22478
		]
	],
	[
		[
			194643,
			194643
		],
		"mapped",
		[
			22516
		]
	],
	[
		[
			194644,
			194644
		],
		"mapped",
		[
			22541
		]
	],
	[
		[
			194645,
			194645
		],
		"mapped",
		[
			22411
		]
	],
	[
		[
			194646,
			194646
		],
		"mapped",
		[
			22578
		]
	],
	[
		[
			194647,
			194647
		],
		"mapped",
		[
			22577
		]
	],
	[
		[
			194648,
			194648
		],
		"mapped",
		[
			22700
		]
	],
	[
		[
			194649,
			194649
		],
		"mapped",
		[
			136420
		]
	],
	[
		[
			194650,
			194650
		],
		"mapped",
		[
			22770
		]
	],
	[
		[
			194651,
			194651
		],
		"mapped",
		[
			22775
		]
	],
	[
		[
			194652,
			194652
		],
		"mapped",
		[
			22790
		]
	],
	[
		[
			194653,
			194653
		],
		"mapped",
		[
			22810
		]
	],
	[
		[
			194654,
			194654
		],
		"mapped",
		[
			22818
		]
	],
	[
		[
			194655,
			194655
		],
		"mapped",
		[
			22882
		]
	],
	[
		[
			194656,
			194656
		],
		"mapped",
		[
			136872
		]
	],
	[
		[
			194657,
			194657
		],
		"mapped",
		[
			136938
		]
	],
	[
		[
			194658,
			194658
		],
		"mapped",
		[
			23020
		]
	],
	[
		[
			194659,
			194659
		],
		"mapped",
		[
			23067
		]
	],
	[
		[
			194660,
			194660
		],
		"mapped",
		[
			23079
		]
	],
	[
		[
			194661,
			194661
		],
		"mapped",
		[
			23000
		]
	],
	[
		[
			194662,
			194662
		],
		"mapped",
		[
			23142
		]
	],
	[
		[
			194663,
			194663
		],
		"mapped",
		[
			14062
		]
	],
	[
		[
			194664,
			194664
		],
		"disallowed"
	],
	[
		[
			194665,
			194665
		],
		"mapped",
		[
			23304
		]
	],
	[
		[
			194666,
			194667
		],
		"mapped",
		[
			23358
		]
	],
	[
		[
			194668,
			194668
		],
		"mapped",
		[
			137672
		]
	],
	[
		[
			194669,
			194669
		],
		"mapped",
		[
			23491
		]
	],
	[
		[
			194670,
			194670
		],
		"mapped",
		[
			23512
		]
	],
	[
		[
			194671,
			194671
		],
		"mapped",
		[
			23527
		]
	],
	[
		[
			194672,
			194672
		],
		"mapped",
		[
			23539
		]
	],
	[
		[
			194673,
			194673
		],
		"mapped",
		[
			138008
		]
	],
	[
		[
			194674,
			194674
		],
		"mapped",
		[
			23551
		]
	],
	[
		[
			194675,
			194675
		],
		"mapped",
		[
			23558
		]
	],
	[
		[
			194676,
			194676
		],
		"disallowed"
	],
	[
		[
			194677,
			194677
		],
		"mapped",
		[
			23586
		]
	],
	[
		[
			194678,
			194678
		],
		"mapped",
		[
			14209
		]
	],
	[
		[
			194679,
			194679
		],
		"mapped",
		[
			23648
		]
	],
	[
		[
			194680,
			194680
		],
		"mapped",
		[
			23662
		]
	],
	[
		[
			194681,
			194681
		],
		"mapped",
		[
			23744
		]
	],
	[
		[
			194682,
			194682
		],
		"mapped",
		[
			23693
		]
	],
	[
		[
			194683,
			194683
		],
		"mapped",
		[
			138724
		]
	],
	[
		[
			194684,
			194684
		],
		"mapped",
		[
			23875
		]
	],
	[
		[
			194685,
			194685
		],
		"mapped",
		[
			138726
		]
	],
	[
		[
			194686,
			194686
		],
		"mapped",
		[
			23918
		]
	],
	[
		[
			194687,
			194687
		],
		"mapped",
		[
			23915
		]
	],
	[
		[
			194688,
			194688
		],
		"mapped",
		[
			23932
		]
	],
	[
		[
			194689,
			194689
		],
		"mapped",
		[
			24033
		]
	],
	[
		[
			194690,
			194690
		],
		"mapped",
		[
			24034
		]
	],
	[
		[
			194691,
			194691
		],
		"mapped",
		[
			14383
		]
	],
	[
		[
			194692,
			194692
		],
		"mapped",
		[
			24061
		]
	],
	[
		[
			194693,
			194693
		],
		"mapped",
		[
			24104
		]
	],
	[
		[
			194694,
			194694
		],
		"mapped",
		[
			24125
		]
	],
	[
		[
			194695,
			194695
		],
		"mapped",
		[
			24169
		]
	],
	[
		[
			194696,
			194696
		],
		"mapped",
		[
			14434
		]
	],
	[
		[
			194697,
			194697
		],
		"mapped",
		[
			139651
		]
	],
	[
		[
			194698,
			194698
		],
		"mapped",
		[
			14460
		]
	],
	[
		[
			194699,
			194699
		],
		"mapped",
		[
			24240
		]
	],
	[
		[
			194700,
			194700
		],
		"mapped",
		[
			24243
		]
	],
	[
		[
			194701,
			194701
		],
		"mapped",
		[
			24246
		]
	],
	[
		[
			194702,
			194702
		],
		"mapped",
		[
			24266
		]
	],
	[
		[
			194703,
			194703
		],
		"mapped",
		[
			172946
		]
	],
	[
		[
			194704,
			194704
		],
		"mapped",
		[
			24318
		]
	],
	[
		[
			194705,
			194706
		],
		"mapped",
		[
			140081
		]
	],
	[
		[
			194707,
			194707
		],
		"mapped",
		[
			33281
		]
	],
	[
		[
			194708,
			194709
		],
		"mapped",
		[
			24354
		]
	],
	[
		[
			194710,
			194710
		],
		"mapped",
		[
			14535
		]
	],
	[
		[
			194711,
			194711
		],
		"mapped",
		[
			144056
		]
	],
	[
		[
			194712,
			194712
		],
		"mapped",
		[
			156122
		]
	],
	[
		[
			194713,
			194713
		],
		"mapped",
		[
			24418
		]
	],
	[
		[
			194714,
			194714
		],
		"mapped",
		[
			24427
		]
	],
	[
		[
			194715,
			194715
		],
		"mapped",
		[
			14563
		]
	],
	[
		[
			194716,
			194716
		],
		"mapped",
		[
			24474
		]
	],
	[
		[
			194717,
			194717
		],
		"mapped",
		[
			24525
		]
	],
	[
		[
			194718,
			194718
		],
		"mapped",
		[
			24535
		]
	],
	[
		[
			194719,
			194719
		],
		"mapped",
		[
			24569
		]
	],
	[
		[
			194720,
			194720
		],
		"mapped",
		[
			24705
		]
	],
	[
		[
			194721,
			194721
		],
		"mapped",
		[
			14650
		]
	],
	[
		[
			194722,
			194722
		],
		"mapped",
		[
			14620
		]
	],
	[
		[
			194723,
			194723
		],
		"mapped",
		[
			24724
		]
	],
	[
		[
			194724,
			194724
		],
		"mapped",
		[
			141012
		]
	],
	[
		[
			194725,
			194725
		],
		"mapped",
		[
			24775
		]
	],
	[
		[
			194726,
			194726
		],
		"mapped",
		[
			24904
		]
	],
	[
		[
			194727,
			194727
		],
		"mapped",
		[
			24908
		]
	],
	[
		[
			194728,
			194728
		],
		"mapped",
		[
			24910
		]
	],
	[
		[
			194729,
			194729
		],
		"mapped",
		[
			24908
		]
	],
	[
		[
			194730,
			194730
		],
		"mapped",
		[
			24954
		]
	],
	[
		[
			194731,
			194731
		],
		"mapped",
		[
			24974
		]
	],
	[
		[
			194732,
			194732
		],
		"mapped",
		[
			25010
		]
	],
	[
		[
			194733,
			194733
		],
		"mapped",
		[
			24996
		]
	],
	[
		[
			194734,
			194734
		],
		"mapped",
		[
			25007
		]
	],
	[
		[
			194735,
			194735
		],
		"mapped",
		[
			25054
		]
	],
	[
		[
			194736,
			194736
		],
		"mapped",
		[
			25074
		]
	],
	[
		[
			194737,
			194737
		],
		"mapped",
		[
			25078
		]
	],
	[
		[
			194738,
			194738
		],
		"mapped",
		[
			25104
		]
	],
	[
		[
			194739,
			194739
		],
		"mapped",
		[
			25115
		]
	],
	[
		[
			194740,
			194740
		],
		"mapped",
		[
			25181
		]
	],
	[
		[
			194741,
			194741
		],
		"mapped",
		[
			25265
		]
	],
	[
		[
			194742,
			194742
		],
		"mapped",
		[
			25300
		]
	],
	[
		[
			194743,
			194743
		],
		"mapped",
		[
			25424
		]
	],
	[
		[
			194744,
			194744
		],
		"mapped",
		[
			142092
		]
	],
	[
		[
			194745,
			194745
		],
		"mapped",
		[
			25405
		]
	],
	[
		[
			194746,
			194746
		],
		"mapped",
		[
			25340
		]
	],
	[
		[
			194747,
			194747
		],
		"mapped",
		[
			25448
		]
	],
	[
		[
			194748,
			194748
		],
		"mapped",
		[
			25475
		]
	],
	[
		[
			194749,
			194749
		],
		"mapped",
		[
			25572
		]
	],
	[
		[
			194750,
			194750
		],
		"mapped",
		[
			142321
		]
	],
	[
		[
			194751,
			194751
		],
		"mapped",
		[
			25634
		]
	],
	[
		[
			194752,
			194752
		],
		"mapped",
		[
			25541
		]
	],
	[
		[
			194753,
			194753
		],
		"mapped",
		[
			25513
		]
	],
	[
		[
			194754,
			194754
		],
		"mapped",
		[
			14894
		]
	],
	[
		[
			194755,
			194755
		],
		"mapped",
		[
			25705
		]
	],
	[
		[
			194756,
			194756
		],
		"mapped",
		[
			25726
		]
	],
	[
		[
			194757,
			194757
		],
		"mapped",
		[
			25757
		]
	],
	[
		[
			194758,
			194758
		],
		"mapped",
		[
			25719
		]
	],
	[
		[
			194759,
			194759
		],
		"mapped",
		[
			14956
		]
	],
	[
		[
			194760,
			194760
		],
		"mapped",
		[
			25935
		]
	],
	[
		[
			194761,
			194761
		],
		"mapped",
		[
			25964
		]
	],
	[
		[
			194762,
			194762
		],
		"mapped",
		[
			143370
		]
	],
	[
		[
			194763,
			194763
		],
		"mapped",
		[
			26083
		]
	],
	[
		[
			194764,
			194764
		],
		"mapped",
		[
			26360
		]
	],
	[
		[
			194765,
			194765
		],
		"mapped",
		[
			26185
		]
	],
	[
		[
			194766,
			194766
		],
		"mapped",
		[
			15129
		]
	],
	[
		[
			194767,
			194767
		],
		"mapped",
		[
			26257
		]
	],
	[
		[
			194768,
			194768
		],
		"mapped",
		[
			15112
		]
	],
	[
		[
			194769,
			194769
		],
		"mapped",
		[
			15076
		]
	],
	[
		[
			194770,
			194770
		],
		"mapped",
		[
			20882
		]
	],
	[
		[
			194771,
			194771
		],
		"mapped",
		[
			20885
		]
	],
	[
		[
			194772,
			194772
		],
		"mapped",
		[
			26368
		]
	],
	[
		[
			194773,
			194773
		],
		"mapped",
		[
			26268
		]
	],
	[
		[
			194774,
			194774
		],
		"mapped",
		[
			32941
		]
	],
	[
		[
			194775,
			194775
		],
		"mapped",
		[
			17369
		]
	],
	[
		[
			194776,
			194776
		],
		"mapped",
		[
			26391
		]
	],
	[
		[
			194777,
			194777
		],
		"mapped",
		[
			26395
		]
	],
	[
		[
			194778,
			194778
		],
		"mapped",
		[
			26401
		]
	],
	[
		[
			194779,
			194779
		],
		"mapped",
		[
			26462
		]
	],
	[
		[
			194780,
			194780
		],
		"mapped",
		[
			26451
		]
	],
	[
		[
			194781,
			194781
		],
		"mapped",
		[
			144323
		]
	],
	[
		[
			194782,
			194782
		],
		"mapped",
		[
			15177
		]
	],
	[
		[
			194783,
			194783
		],
		"mapped",
		[
			26618
		]
	],
	[
		[
			194784,
			194784
		],
		"mapped",
		[
			26501
		]
	],
	[
		[
			194785,
			194785
		],
		"mapped",
		[
			26706
		]
	],
	[
		[
			194786,
			194786
		],
		"mapped",
		[
			26757
		]
	],
	[
		[
			194787,
			194787
		],
		"mapped",
		[
			144493
		]
	],
	[
		[
			194788,
			194788
		],
		"mapped",
		[
			26766
		]
	],
	[
		[
			194789,
			194789
		],
		"mapped",
		[
			26655
		]
	],
	[
		[
			194790,
			194790
		],
		"mapped",
		[
			26900
		]
	],
	[
		[
			194791,
			194791
		],
		"mapped",
		[
			15261
		]
	],
	[
		[
			194792,
			194792
		],
		"mapped",
		[
			26946
		]
	],
	[
		[
			194793,
			194793
		],
		"mapped",
		[
			27043
		]
	],
	[
		[
			194794,
			194794
		],
		"mapped",
		[
			27114
		]
	],
	[
		[
			194795,
			194795
		],
		"mapped",
		[
			27304
		]
	],
	[
		[
			194796,
			194796
		],
		"mapped",
		[
			145059
		]
	],
	[
		[
			194797,
			194797
		],
		"mapped",
		[
			27355
		]
	],
	[
		[
			194798,
			194798
		],
		"mapped",
		[
			15384
		]
	],
	[
		[
			194799,
			194799
		],
		"mapped",
		[
			27425
		]
	],
	[
		[
			194800,
			194800
		],
		"mapped",
		[
			145575
		]
	],
	[
		[
			194801,
			194801
		],
		"mapped",
		[
			27476
		]
	],
	[
		[
			194802,
			194802
		],
		"mapped",
		[
			15438
		]
	],
	[
		[
			194803,
			194803
		],
		"mapped",
		[
			27506
		]
	],
	[
		[
			194804,
			194804
		],
		"mapped",
		[
			27551
		]
	],
	[
		[
			194805,
			194805
		],
		"mapped",
		[
			27578
		]
	],
	[
		[
			194806,
			194806
		],
		"mapped",
		[
			27579
		]
	],
	[
		[
			194807,
			194807
		],
		"mapped",
		[
			146061
		]
	],
	[
		[
			194808,
			194808
		],
		"mapped",
		[
			138507
		]
	],
	[
		[
			194809,
			194809
		],
		"mapped",
		[
			146170
		]
	],
	[
		[
			194810,
			194810
		],
		"mapped",
		[
			27726
		]
	],
	[
		[
			194811,
			194811
		],
		"mapped",
		[
			146620
		]
	],
	[
		[
			194812,
			194812
		],
		"mapped",
		[
			27839
		]
	],
	[
		[
			194813,
			194813
		],
		"mapped",
		[
			27853
		]
	],
	[
		[
			194814,
			194814
		],
		"mapped",
		[
			27751
		]
	],
	[
		[
			194815,
			194815
		],
		"mapped",
		[
			27926
		]
	],
	[
		[
			194816,
			194816
		],
		"mapped",
		[
			27966
		]
	],
	[
		[
			194817,
			194817
		],
		"mapped",
		[
			28023
		]
	],
	[
		[
			194818,
			194818
		],
		"mapped",
		[
			27969
		]
	],
	[
		[
			194819,
			194819
		],
		"mapped",
		[
			28009
		]
	],
	[
		[
			194820,
			194820
		],
		"mapped",
		[
			28024
		]
	],
	[
		[
			194821,
			194821
		],
		"mapped",
		[
			28037
		]
	],
	[
		[
			194822,
			194822
		],
		"mapped",
		[
			146718
		]
	],
	[
		[
			194823,
			194823
		],
		"mapped",
		[
			27956
		]
	],
	[
		[
			194824,
			194824
		],
		"mapped",
		[
			28207
		]
	],
	[
		[
			194825,
			194825
		],
		"mapped",
		[
			28270
		]
	],
	[
		[
			194826,
			194826
		],
		"mapped",
		[
			15667
		]
	],
	[
		[
			194827,
			194827
		],
		"mapped",
		[
			28363
		]
	],
	[
		[
			194828,
			194828
		],
		"mapped",
		[
			28359
		]
	],
	[
		[
			194829,
			194829
		],
		"mapped",
		[
			147153
		]
	],
	[
		[
			194830,
			194830
		],
		"mapped",
		[
			28153
		]
	],
	[
		[
			194831,
			194831
		],
		"mapped",
		[
			28526
		]
	],
	[
		[
			194832,
			194832
		],
		"mapped",
		[
			147294
		]
	],
	[
		[
			194833,
			194833
		],
		"mapped",
		[
			147342
		]
	],
	[
		[
			194834,
			194834
		],
		"mapped",
		[
			28614
		]
	],
	[
		[
			194835,
			194835
		],
		"mapped",
		[
			28729
		]
	],
	[
		[
			194836,
			194836
		],
		"mapped",
		[
			28702
		]
	],
	[
		[
			194837,
			194837
		],
		"mapped",
		[
			28699
		]
	],
	[
		[
			194838,
			194838
		],
		"mapped",
		[
			15766
		]
	],
	[
		[
			194839,
			194839
		],
		"mapped",
		[
			28746
		]
	],
	[
		[
			194840,
			194840
		],
		"mapped",
		[
			28797
		]
	],
	[
		[
			194841,
			194841
		],
		"mapped",
		[
			28791
		]
	],
	[
		[
			194842,
			194842
		],
		"mapped",
		[
			28845
		]
	],
	[
		[
			194843,
			194843
		],
		"mapped",
		[
			132389
		]
	],
	[
		[
			194844,
			194844
		],
		"mapped",
		[
			28997
		]
	],
	[
		[
			194845,
			194845
		],
		"mapped",
		[
			148067
		]
	],
	[
		[
			194846,
			194846
		],
		"mapped",
		[
			29084
		]
	],
	[
		[
			194847,
			194847
		],
		"disallowed"
	],
	[
		[
			194848,
			194848
		],
		"mapped",
		[
			29224
		]
	],
	[
		[
			194849,
			194849
		],
		"mapped",
		[
			29237
		]
	],
	[
		[
			194850,
			194850
		],
		"mapped",
		[
			29264
		]
	],
	[
		[
			194851,
			194851
		],
		"mapped",
		[
			149000
		]
	],
	[
		[
			194852,
			194852
		],
		"mapped",
		[
			29312
		]
	],
	[
		[
			194853,
			194853
		],
		"mapped",
		[
			29333
		]
	],
	[
		[
			194854,
			194854
		],
		"mapped",
		[
			149301
		]
	],
	[
		[
			194855,
			194855
		],
		"mapped",
		[
			149524
		]
	],
	[
		[
			194856,
			194856
		],
		"mapped",
		[
			29562
		]
	],
	[
		[
			194857,
			194857
		],
		"mapped",
		[
			29579
		]
	],
	[
		[
			194858,
			194858
		],
		"mapped",
		[
			16044
		]
	],
	[
		[
			194859,
			194859
		],
		"mapped",
		[
			29605
		]
	],
	[
		[
			194860,
			194861
		],
		"mapped",
		[
			16056
		]
	],
	[
		[
			194862,
			194862
		],
		"mapped",
		[
			29767
		]
	],
	[
		[
			194863,
			194863
		],
		"mapped",
		[
			29788
		]
	],
	[
		[
			194864,
			194864
		],
		"mapped",
		[
			29809
		]
	],
	[
		[
			194865,
			194865
		],
		"mapped",
		[
			29829
		]
	],
	[
		[
			194866,
			194866
		],
		"mapped",
		[
			29898
		]
	],
	[
		[
			194867,
			194867
		],
		"mapped",
		[
			16155
		]
	],
	[
		[
			194868,
			194868
		],
		"mapped",
		[
			29988
		]
	],
	[
		[
			194869,
			194869
		],
		"mapped",
		[
			150582
		]
	],
	[
		[
			194870,
			194870
		],
		"mapped",
		[
			30014
		]
	],
	[
		[
			194871,
			194871
		],
		"mapped",
		[
			150674
		]
	],
	[
		[
			194872,
			194872
		],
		"mapped",
		[
			30064
		]
	],
	[
		[
			194873,
			194873
		],
		"mapped",
		[
			139679
		]
	],
	[
		[
			194874,
			194874
		],
		"mapped",
		[
			30224
		]
	],
	[
		[
			194875,
			194875
		],
		"mapped",
		[
			151457
		]
	],
	[
		[
			194876,
			194876
		],
		"mapped",
		[
			151480
		]
	],
	[
		[
			194877,
			194877
		],
		"mapped",
		[
			151620
		]
	],
	[
		[
			194878,
			194878
		],
		"mapped",
		[
			16380
		]
	],
	[
		[
			194879,
			194879
		],
		"mapped",
		[
			16392
		]
	],
	[
		[
			194880,
			194880
		],
		"mapped",
		[
			30452
		]
	],
	[
		[
			194881,
			194881
		],
		"mapped",
		[
			151795
		]
	],
	[
		[
			194882,
			194882
		],
		"mapped",
		[
			151794
		]
	],
	[
		[
			194883,
			194883
		],
		"mapped",
		[
			151833
		]
	],
	[
		[
			194884,
			194884
		],
		"mapped",
		[
			151859
		]
	],
	[
		[
			194885,
			194885
		],
		"mapped",
		[
			30494
		]
	],
	[
		[
			194886,
			194887
		],
		"mapped",
		[
			30495
		]
	],
	[
		[
			194888,
			194888
		],
		"mapped",
		[
			30538
		]
	],
	[
		[
			194889,
			194889
		],
		"mapped",
		[
			16441
		]
	],
	[
		[
			194890,
			194890
		],
		"mapped",
		[
			30603
		]
	],
	[
		[
			194891,
			194891
		],
		"mapped",
		[
			16454
		]
	],
	[
		[
			194892,
			194892
		],
		"mapped",
		[
			16534
		]
	],
	[
		[
			194893,
			194893
		],
		"mapped",
		[
			152605
		]
	],
	[
		[
			194894,
			194894
		],
		"mapped",
		[
			30798
		]
	],
	[
		[
			194895,
			194895
		],
		"mapped",
		[
			30860
		]
	],
	[
		[
			194896,
			194896
		],
		"mapped",
		[
			30924
		]
	],
	[
		[
			194897,
			194897
		],
		"mapped",
		[
			16611
		]
	],
	[
		[
			194898,
			194898
		],
		"mapped",
		[
			153126
		]
	],
	[
		[
			194899,
			194899
		],
		"mapped",
		[
			31062
		]
	],
	[
		[
			194900,
			194900
		],
		"mapped",
		[
			153242
		]
	],
	[
		[
			194901,
			194901
		],
		"mapped",
		[
			153285
		]
	],
	[
		[
			194902,
			194902
		],
		"mapped",
		[
			31119
		]
	],
	[
		[
			194903,
			194903
		],
		"mapped",
		[
			31211
		]
	],
	[
		[
			194904,
			194904
		],
		"mapped",
		[
			16687
		]
	],
	[
		[
			194905,
			194905
		],
		"mapped",
		[
			31296
		]
	],
	[
		[
			194906,
			194906
		],
		"mapped",
		[
			31306
		]
	],
	[
		[
			194907,
			194907
		],
		"mapped",
		[
			31311
		]
	],
	[
		[
			194908,
			194908
		],
		"mapped",
		[
			153980
		]
	],
	[
		[
			194909,
			194910
		],
		"mapped",
		[
			154279
		]
	],
	[
		[
			194911,
			194911
		],
		"disallowed"
	],
	[
		[
			194912,
			194912
		],
		"mapped",
		[
			16898
		]
	],
	[
		[
			194913,
			194913
		],
		"mapped",
		[
			154539
		]
	],
	[
		[
			194914,
			194914
		],
		"mapped",
		[
			31686
		]
	],
	[
		[
			194915,
			194915
		],
		"mapped",
		[
			31689
		]
	],
	[
		[
			194916,
			194916
		],
		"mapped",
		[
			16935
		]
	],
	[
		[
			194917,
			194917
		],
		"mapped",
		[
			154752
		]
	],
	[
		[
			194918,
			194918
		],
		"mapped",
		[
			31954
		]
	],
	[
		[
			194919,
			194919
		],
		"mapped",
		[
			17056
		]
	],
	[
		[
			194920,
			194920
		],
		"mapped",
		[
			31976
		]
	],
	[
		[
			194921,
			194921
		],
		"mapped",
		[
			31971
		]
	],
	[
		[
			194922,
			194922
		],
		"mapped",
		[
			32000
		]
	],
	[
		[
			194923,
			194923
		],
		"mapped",
		[
			155526
		]
	],
	[
		[
			194924,
			194924
		],
		"mapped",
		[
			32099
		]
	],
	[
		[
			194925,
			194925
		],
		"mapped",
		[
			17153
		]
	],
	[
		[
			194926,
			194926
		],
		"mapped",
		[
			32199
		]
	],
	[
		[
			194927,
			194927
		],
		"mapped",
		[
			32258
		]
	],
	[
		[
			194928,
			194928
		],
		"mapped",
		[
			32325
		]
	],
	[
		[
			194929,
			194929
		],
		"mapped",
		[
			17204
		]
	],
	[
		[
			194930,
			194930
		],
		"mapped",
		[
			156200
		]
	],
	[
		[
			194931,
			194931
		],
		"mapped",
		[
			156231
		]
	],
	[
		[
			194932,
			194932
		],
		"mapped",
		[
			17241
		]
	],
	[
		[
			194933,
			194933
		],
		"mapped",
		[
			156377
		]
	],
	[
		[
			194934,
			194934
		],
		"mapped",
		[
			32634
		]
	],
	[
		[
			194935,
			194935
		],
		"mapped",
		[
			156478
		]
	],
	[
		[
			194936,
			194936
		],
		"mapped",
		[
			32661
		]
	],
	[
		[
			194937,
			194937
		],
		"mapped",
		[
			32762
		]
	],
	[
		[
			194938,
			194938
		],
		"mapped",
		[
			32773
		]
	],
	[
		[
			194939,
			194939
		],
		"mapped",
		[
			156890
		]
	],
	[
		[
			194940,
			194940
		],
		"mapped",
		[
			156963
		]
	],
	[
		[
			194941,
			194941
		],
		"mapped",
		[
			32864
		]
	],
	[
		[
			194942,
			194942
		],
		"mapped",
		[
			157096
		]
	],
	[
		[
			194943,
			194943
		],
		"mapped",
		[
			32880
		]
	],
	[
		[
			194944,
			194944
		],
		"mapped",
		[
			144223
		]
	],
	[
		[
			194945,
			194945
		],
		"mapped",
		[
			17365
		]
	],
	[
		[
			194946,
			194946
		],
		"mapped",
		[
			32946
		]
	],
	[
		[
			194947,
			194947
		],
		"mapped",
		[
			33027
		]
	],
	[
		[
			194948,
			194948
		],
		"mapped",
		[
			17419
		]
	],
	[
		[
			194949,
			194949
		],
		"mapped",
		[
			33086
		]
	],
	[
		[
			194950,
			194950
		],
		"mapped",
		[
			23221
		]
	],
	[
		[
			194951,
			194951
		],
		"mapped",
		[
			157607
		]
	],
	[
		[
			194952,
			194952
		],
		"mapped",
		[
			157621
		]
	],
	[
		[
			194953,
			194953
		],
		"mapped",
		[
			144275
		]
	],
	[
		[
			194954,
			194954
		],
		"mapped",
		[
			144284
		]
	],
	[
		[
			194955,
			194955
		],
		"mapped",
		[
			33281
		]
	],
	[
		[
			194956,
			194956
		],
		"mapped",
		[
			33284
		]
	],
	[
		[
			194957,
			194957
		],
		"mapped",
		[
			36766
		]
	],
	[
		[
			194958,
			194958
		],
		"mapped",
		[
			17515
		]
	],
	[
		[
			194959,
			194959
		],
		"mapped",
		[
			33425
		]
	],
	[
		[
			194960,
			194960
		],
		"mapped",
		[
			33419
		]
	],
	[
		[
			194961,
			194961
		],
		"mapped",
		[
			33437
		]
	],
	[
		[
			194962,
			194962
		],
		"mapped",
		[
			21171
		]
	],
	[
		[
			194963,
			194963
		],
		"mapped",
		[
			33457
		]
	],
	[
		[
			194964,
			194964
		],
		"mapped",
		[
			33459
		]
	],
	[
		[
			194965,
			194965
		],
		"mapped",
		[
			33469
		]
	],
	[
		[
			194966,
			194966
		],
		"mapped",
		[
			33510
		]
	],
	[
		[
			194967,
			194967
		],
		"mapped",
		[
			158524
		]
	],
	[
		[
			194968,
			194968
		],
		"mapped",
		[
			33509
		]
	],
	[
		[
			194969,
			194969
		],
		"mapped",
		[
			33565
		]
	],
	[
		[
			194970,
			194970
		],
		"mapped",
		[
			33635
		]
	],
	[
		[
			194971,
			194971
		],
		"mapped",
		[
			33709
		]
	],
	[
		[
			194972,
			194972
		],
		"mapped",
		[
			33571
		]
	],
	[
		[
			194973,
			194973
		],
		"mapped",
		[
			33725
		]
	],
	[
		[
			194974,
			194974
		],
		"mapped",
		[
			33767
		]
	],
	[
		[
			194975,
			194975
		],
		"mapped",
		[
			33879
		]
	],
	[
		[
			194976,
			194976
		],
		"mapped",
		[
			33619
		]
	],
	[
		[
			194977,
			194977
		],
		"mapped",
		[
			33738
		]
	],
	[
		[
			194978,
			194978
		],
		"mapped",
		[
			33740
		]
	],
	[
		[
			194979,
			194979
		],
		"mapped",
		[
			33756
		]
	],
	[
		[
			194980,
			194980
		],
		"mapped",
		[
			158774
		]
	],
	[
		[
			194981,
			194981
		],
		"mapped",
		[
			159083
		]
	],
	[
		[
			194982,
			194982
		],
		"mapped",
		[
			158933
		]
	],
	[
		[
			194983,
			194983
		],
		"mapped",
		[
			17707
		]
	],
	[
		[
			194984,
			194984
		],
		"mapped",
		[
			34033
		]
	],
	[
		[
			194985,
			194985
		],
		"mapped",
		[
			34035
		]
	],
	[
		[
			194986,
			194986
		],
		"mapped",
		[
			34070
		]
	],
	[
		[
			194987,
			194987
		],
		"mapped",
		[
			160714
		]
	],
	[
		[
			194988,
			194988
		],
		"mapped",
		[
			34148
		]
	],
	[
		[
			194989,
			194989
		],
		"mapped",
		[
			159532
		]
	],
	[
		[
			194990,
			194990
		],
		"mapped",
		[
			17757
		]
	],
	[
		[
			194991,
			194991
		],
		"mapped",
		[
			17761
		]
	],
	[
		[
			194992,
			194992
		],
		"mapped",
		[
			159665
		]
	],
	[
		[
			194993,
			194993
		],
		"mapped",
		[
			159954
		]
	],
	[
		[
			194994,
			194994
		],
		"mapped",
		[
			17771
		]
	],
	[
		[
			194995,
			194995
		],
		"mapped",
		[
			34384
		]
	],
	[
		[
			194996,
			194996
		],
		"mapped",
		[
			34396
		]
	],
	[
		[
			194997,
			194997
		],
		"mapped",
		[
			34407
		]
	],
	[
		[
			194998,
			194998
		],
		"mapped",
		[
			34409
		]
	],
	[
		[
			194999,
			194999
		],
		"mapped",
		[
			34473
		]
	],
	[
		[
			195000,
			195000
		],
		"mapped",
		[
			34440
		]
	],
	[
		[
			195001,
			195001
		],
		"mapped",
		[
			34574
		]
	],
	[
		[
			195002,
			195002
		],
		"mapped",
		[
			34530
		]
	],
	[
		[
			195003,
			195003
		],
		"mapped",
		[
			34681
		]
	],
	[
		[
			195004,
			195004
		],
		"mapped",
		[
			34600
		]
	],
	[
		[
			195005,
			195005
		],
		"mapped",
		[
			34667
		]
	],
	[
		[
			195006,
			195006
		],
		"mapped",
		[
			34694
		]
	],
	[
		[
			195007,
			195007
		],
		"disallowed"
	],
	[
		[
			195008,
			195008
		],
		"mapped",
		[
			34785
		]
	],
	[
		[
			195009,
			195009
		],
		"mapped",
		[
			34817
		]
	],
	[
		[
			195010,
			195010
		],
		"mapped",
		[
			17913
		]
	],
	[
		[
			195011,
			195011
		],
		"mapped",
		[
			34912
		]
	],
	[
		[
			195012,
			195012
		],
		"mapped",
		[
			34915
		]
	],
	[
		[
			195013,
			195013
		],
		"mapped",
		[
			161383
		]
	],
	[
		[
			195014,
			195014
		],
		"mapped",
		[
			35031
		]
	],
	[
		[
			195015,
			195015
		],
		"mapped",
		[
			35038
		]
	],
	[
		[
			195016,
			195016
		],
		"mapped",
		[
			17973
		]
	],
	[
		[
			195017,
			195017
		],
		"mapped",
		[
			35066
		]
	],
	[
		[
			195018,
			195018
		],
		"mapped",
		[
			13499
		]
	],
	[
		[
			195019,
			195019
		],
		"mapped",
		[
			161966
		]
	],
	[
		[
			195020,
			195020
		],
		"mapped",
		[
			162150
		]
	],
	[
		[
			195021,
			195021
		],
		"mapped",
		[
			18110
		]
	],
	[
		[
			195022,
			195022
		],
		"mapped",
		[
			18119
		]
	],
	[
		[
			195023,
			195023
		],
		"mapped",
		[
			35488
		]
	],
	[
		[
			195024,
			195024
		],
		"mapped",
		[
			35565
		]
	],
	[
		[
			195025,
			195025
		],
		"mapped",
		[
			35722
		]
	],
	[
		[
			195026,
			195026
		],
		"mapped",
		[
			35925
		]
	],
	[
		[
			195027,
			195027
		],
		"mapped",
		[
			162984
		]
	],
	[
		[
			195028,
			195028
		],
		"mapped",
		[
			36011
		]
	],
	[
		[
			195029,
			195029
		],
		"mapped",
		[
			36033
		]
	],
	[
		[
			195030,
			195030
		],
		"mapped",
		[
			36123
		]
	],
	[
		[
			195031,
			195031
		],
		"mapped",
		[
			36215
		]
	],
	[
		[
			195032,
			195032
		],
		"mapped",
		[
			163631
		]
	],
	[
		[
			195033,
			195033
		],
		"mapped",
		[
			133124
		]
	],
	[
		[
			195034,
			195034
		],
		"mapped",
		[
			36299
		]
	],
	[
		[
			195035,
			195035
		],
		"mapped",
		[
			36284
		]
	],
	[
		[
			195036,
			195036
		],
		"mapped",
		[
			36336
		]
	],
	[
		[
			195037,
			195037
		],
		"mapped",
		[
			133342
		]
	],
	[
		[
			195038,
			195038
		],
		"mapped",
		[
			36564
		]
	],
	[
		[
			195039,
			195039
		],
		"mapped",
		[
			36664
		]
	],
	[
		[
			195040,
			195040
		],
		"mapped",
		[
			165330
		]
	],
	[
		[
			195041,
			195041
		],
		"mapped",
		[
			165357
		]
	],
	[
		[
			195042,
			195042
		],
		"mapped",
		[
			37012
		]
	],
	[
		[
			195043,
			195043
		],
		"mapped",
		[
			37105
		]
	],
	[
		[
			195044,
			195044
		],
		"mapped",
		[
			37137
		]
	],
	[
		[
			195045,
			195045
		],
		"mapped",
		[
			165678
		]
	],
	[
		[
			195046,
			195046
		],
		"mapped",
		[
			37147
		]
	],
	[
		[
			195047,
			195047
		],
		"mapped",
		[
			37432
		]
	],
	[
		[
			195048,
			195048
		],
		"mapped",
		[
			37591
		]
	],
	[
		[
			195049,
			195049
		],
		"mapped",
		[
			37592
		]
	],
	[
		[
			195050,
			195050
		],
		"mapped",
		[
			37500
		]
	],
	[
		[
			195051,
			195051
		],
		"mapped",
		[
			37881
		]
	],
	[
		[
			195052,
			195052
		],
		"mapped",
		[
			37909
		]
	],
	[
		[
			195053,
			195053
		],
		"mapped",
		[
			166906
		]
	],
	[
		[
			195054,
			195054
		],
		"mapped",
		[
			38283
		]
	],
	[
		[
			195055,
			195055
		],
		"mapped",
		[
			18837
		]
	],
	[
		[
			195056,
			195056
		],
		"mapped",
		[
			38327
		]
	],
	[
		[
			195057,
			195057
		],
		"mapped",
		[
			167287
		]
	],
	[
		[
			195058,
			195058
		],
		"mapped",
		[
			18918
		]
	],
	[
		[
			195059,
			195059
		],
		"mapped",
		[
			38595
		]
	],
	[
		[
			195060,
			195060
		],
		"mapped",
		[
			23986
		]
	],
	[
		[
			195061,
			195061
		],
		"mapped",
		[
			38691
		]
	],
	[
		[
			195062,
			195062
		],
		"mapped",
		[
			168261
		]
	],
	[
		[
			195063,
			195063
		],
		"mapped",
		[
			168474
		]
	],
	[
		[
			195064,
			195064
		],
		"mapped",
		[
			19054
		]
	],
	[
		[
			195065,
			195065
		],
		"mapped",
		[
			19062
		]
	],
	[
		[
			195066,
			195066
		],
		"mapped",
		[
			38880
		]
	],
	[
		[
			195067,
			195067
		],
		"mapped",
		[
			168970
		]
	],
	[
		[
			195068,
			195068
		],
		"mapped",
		[
			19122
		]
	],
	[
		[
			195069,
			195069
		],
		"mapped",
		[
			169110
		]
	],
	[
		[
			195070,
			195071
		],
		"mapped",
		[
			38923
		]
	],
	[
		[
			195072,
			195072
		],
		"mapped",
		[
			38953
		]
	],
	[
		[
			195073,
			195073
		],
		"mapped",
		[
			169398
		]
	],
	[
		[
			195074,
			195074
		],
		"mapped",
		[
			39138
		]
	],
	[
		[
			195075,
			195075
		],
		"mapped",
		[
			19251
		]
	],
	[
		[
			195076,
			195076
		],
		"mapped",
		[
			39209
		]
	],
	[
		[
			195077,
			195077
		],
		"mapped",
		[
			39335
		]
	],
	[
		[
			195078,
			195078
		],
		"mapped",
		[
			39362
		]
	],
	[
		[
			195079,
			195079
		],
		"mapped",
		[
			39422
		]
	],
	[
		[
			195080,
			195080
		],
		"mapped",
		[
			19406
		]
	],
	[
		[
			195081,
			195081
		],
		"mapped",
		[
			170800
		]
	],
	[
		[
			195082,
			195082
		],
		"mapped",
		[
			39698
		]
	],
	[
		[
			195083,
			195083
		],
		"mapped",
		[
			40000
		]
	],
	[
		[
			195084,
			195084
		],
		"mapped",
		[
			40189
		]
	],
	[
		[
			195085,
			195085
		],
		"mapped",
		[
			19662
		]
	],
	[
		[
			195086,
			195086
		],
		"mapped",
		[
			19693
		]
	],
	[
		[
			195087,
			195087
		],
		"mapped",
		[
			40295
		]
	],
	[
		[
			195088,
			195088
		],
		"mapped",
		[
			172238
		]
	],
	[
		[
			195089,
			195089
		],
		"mapped",
		[
			19704
		]
	],
	[
		[
			195090,
			195090
		],
		"mapped",
		[
			172293
		]
	],
	[
		[
			195091,
			195091
		],
		"mapped",
		[
			172558
		]
	],
	[
		[
			195092,
			195092
		],
		"mapped",
		[
			172689
		]
	],
	[
		[
			195093,
			195093
		],
		"mapped",
		[
			40635
		]
	],
	[
		[
			195094,
			195094
		],
		"mapped",
		[
			19798
		]
	],
	[
		[
			195095,
			195095
		],
		"mapped",
		[
			40697
		]
	],
	[
		[
			195096,
			195096
		],
		"mapped",
		[
			40702
		]
	],
	[
		[
			195097,
			195097
		],
		"mapped",
		[
			40709
		]
	],
	[
		[
			195098,
			195098
		],
		"mapped",
		[
			40719
		]
	],
	[
		[
			195099,
			195099
		],
		"mapped",
		[
			40726
		]
	],
	[
		[
			195100,
			195100
		],
		"mapped",
		[
			40763
		]
	],
	[
		[
			195101,
			195101
		],
		"mapped",
		[
			173568
		]
	],
	[
		[
			195102,
			196605
		],
		"disallowed"
	],
	[
		[
			196606,
			196607
		],
		"disallowed"
	],
	[
		[
			196608,
			262141
		],
		"disallowed"
	],
	[
		[
			262142,
			262143
		],
		"disallowed"
	],
	[
		[
			262144,
			327677
		],
		"disallowed"
	],
	[
		[
			327678,
			327679
		],
		"disallowed"
	],
	[
		[
			327680,
			393213
		],
		"disallowed"
	],
	[
		[
			393214,
			393215
		],
		"disallowed"
	],
	[
		[
			393216,
			458749
		],
		"disallowed"
	],
	[
		[
			458750,
			458751
		],
		"disallowed"
	],
	[
		[
			458752,
			524285
		],
		"disallowed"
	],
	[
		[
			524286,
			524287
		],
		"disallowed"
	],
	[
		[
			524288,
			589821
		],
		"disallowed"
	],
	[
		[
			589822,
			589823
		],
		"disallowed"
	],
	[
		[
			589824,
			655357
		],
		"disallowed"
	],
	[
		[
			655358,
			655359
		],
		"disallowed"
	],
	[
		[
			655360,
			720893
		],
		"disallowed"
	],
	[
		[
			720894,
			720895
		],
		"disallowed"
	],
	[
		[
			720896,
			786429
		],
		"disallowed"
	],
	[
		[
			786430,
			786431
		],
		"disallowed"
	],
	[
		[
			786432,
			851965
		],
		"disallowed"
	],
	[
		[
			851966,
			851967
		],
		"disallowed"
	],
	[
		[
			851968,
			917501
		],
		"disallowed"
	],
	[
		[
			917502,
			917503
		],
		"disallowed"
	],
	[
		[
			917504,
			917504
		],
		"disallowed"
	],
	[
		[
			917505,
			917505
		],
		"disallowed"
	],
	[
		[
			917506,
			917535
		],
		"disallowed"
	],
	[
		[
			917536,
			917631
		],
		"disallowed"
	],
	[
		[
			917632,
			917759
		],
		"disallowed"
	],
	[
		[
			917760,
			917999
		],
		"ignored"
	],
	[
		[
			918000,
			983037
		],
		"disallowed"
	],
	[
		[
			983038,
			983039
		],
		"disallowed"
	],
	[
		[
			983040,
			1048573
		],
		"disallowed"
	],
	[
		[
			1048574,
			1048575
		],
		"disallowed"
	],
	[
		[
			1048576,
			1114109
		],
		"disallowed"
	],
	[
		[
			1114110,
			1114111
		],
		"disallowed"
	]
];

var hasRequiredTr46;

function requireTr46 () {
	if (hasRequiredTr46) return tr46;
	hasRequiredTr46 = 1;

	var punycode = require$$0$1;
	var mappingTable = require$$1;

	var PROCESSING_OPTIONS = {
	  TRANSITIONAL: 0,
	  NONTRANSITIONAL: 1
	};

	function normalize(str) { // fix bug in v8
	  return str.split('\u0000').map(function (s) { return s.normalize('NFC'); }).join('\u0000');
	}

	function findStatus(val) {
	  var start = 0;
	  var end = mappingTable.length - 1;

	  while (start <= end) {
	    var mid = Math.floor((start + end) / 2);

	    var target = mappingTable[mid];
	    if (target[0][0] <= val && target[0][1] >= val) {
	      return target;
	    } else if (target[0][0] > val) {
	      end = mid - 1;
	    } else {
	      start = mid + 1;
	    }
	  }

	  return null;
	}

	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

	function countSymbols(string) {
	  return string
	    // replace every surrogate pair with a BMP symbol
	    .replace(regexAstralSymbols, '_')
	    // then get the length
	    .length;
	}

	function mapChars(domain_name, useSTD3, processing_option) {
	  var hasError = false;
	  var processed = "";

	  var len = countSymbols(domain_name);
	  for (var i = 0; i < len; ++i) {
	    var codePoint = domain_name.codePointAt(i);
	    var status = findStatus(codePoint);

	    switch (status[1]) {
	      case "disallowed":
	        hasError = true;
	        processed += String.fromCodePoint(codePoint);
	        break;
	      case "ignored":
	        break;
	      case "mapped":
	        processed += String.fromCodePoint.apply(String, status[2]);
	        break;
	      case "deviation":
	        if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
	          processed += String.fromCodePoint.apply(String, status[2]);
	        } else {
	          processed += String.fromCodePoint(codePoint);
	        }
	        break;
	      case "valid":
	        processed += String.fromCodePoint(codePoint);
	        break;
	      case "disallowed_STD3_mapped":
	        if (useSTD3) {
	          hasError = true;
	          processed += String.fromCodePoint(codePoint);
	        } else {
	          processed += String.fromCodePoint.apply(String, status[2]);
	        }
	        break;
	      case "disallowed_STD3_valid":
	        if (useSTD3) {
	          hasError = true;
	        }

	        processed += String.fromCodePoint(codePoint);
	        break;
	    }
	  }

	  return {
	    string: processed,
	    error: hasError
	  };
	}

	var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;

	function validateLabel(label, processing_option) {
	  if (label.substr(0, 4) === "xn--") {
	    label = punycode.toUnicode(label);
	    PROCESSING_OPTIONS.NONTRANSITIONAL;
	  }

	  var error = false;

	  if (normalize(label) !== label ||
	      (label[3] === "-" && label[4] === "-") ||
	      label[0] === "-" || label[label.length - 1] === "-" ||
	      label.indexOf(".") !== -1 ||
	      label.search(combiningMarksRegex) === 0) {
	    error = true;
	  }

	  var len = countSymbols(label);
	  for (var i = 0; i < len; ++i) {
	    var status = findStatus(label.codePointAt(i));
	    if ((processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid") ||
	        (processing === PROCESSING_OPTIONS.NONTRANSITIONAL &&
	         status[1] !== "valid" && status[1] !== "deviation")) {
	      error = true;
	      break;
	    }
	  }

	  return {
	    label: label,
	    error: error
	  };
	}

	function processing(domain_name, useSTD3, processing_option) {
	  var result = mapChars(domain_name, useSTD3, processing_option);
	  result.string = normalize(result.string);

	  var labels = result.string.split(".");
	  for (var i = 0; i < labels.length; ++i) {
	    try {
	      var validation = validateLabel(labels[i]);
	      labels[i] = validation.label;
	      result.error = result.error || validation.error;
	    } catch(e) {
	      result.error = true;
	    }
	  }

	  return {
	    string: labels.join("."),
	    error: result.error
	  };
	}

	tr46.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
	  var result = processing(domain_name, useSTD3, processing_option);
	  var labels = result.string.split(".");
	  labels = labels.map(function(l) {
	    try {
	      return punycode.toASCII(l);
	    } catch(e) {
	      result.error = true;
	      return l;
	    }
	  });

	  if (verifyDnsLength) {
	    var total = labels.slice(0, labels.length - 1).join(".").length;
	    if (total.length > 253 || total.length === 0) {
	      result.error = true;
	    }

	    for (var i=0; i < labels.length; ++i) {
	      if (labels.length > 63 || labels.length === 0) {
	        result.error = true;
	        break;
	      }
	    }
	  }

	  if (result.error) return null;
	  return labels.join(".");
	};

	tr46.toUnicode = function(domain_name, useSTD3) {
	  var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);

	  return {
	    domain: result.string,
	    error: result.error
	  };
	};

	tr46.PROCESSING_OPTIONS = PROCESSING_OPTIONS;
	return tr46;
}

var hasRequiredUrlStateMachine;

function requireUrlStateMachine () {
	if (hasRequiredUrlStateMachine) return urlStateMachine.exports;
	hasRequiredUrlStateMachine = 1;
	(function (module) {
		const punycode = require$$0$1;
		const tr46 = requireTr46();

		const specialSchemes = {
		  ftp: 21,
		  file: null,
		  gopher: 70,
		  http: 80,
		  https: 443,
		  ws: 80,
		  wss: 443
		};

		const failure = Symbol("failure");

		function countSymbols(str) {
		  return punycode.ucs2.decode(str).length;
		}

		function at(input, idx) {
		  const c = input[idx];
		  return isNaN(c) ? undefined : String.fromCodePoint(c);
		}

		function isASCIIDigit(c) {
		  return c >= 0x30 && c <= 0x39;
		}

		function isASCIIAlpha(c) {
		  return (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
		}

		function isASCIIAlphanumeric(c) {
		  return isASCIIAlpha(c) || isASCIIDigit(c);
		}

		function isASCIIHex(c) {
		  return isASCIIDigit(c) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66);
		}

		function isSingleDot(buffer) {
		  return buffer === "." || buffer.toLowerCase() === "%2e";
		}

		function isDoubleDot(buffer) {
		  buffer = buffer.toLowerCase();
		  return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
		}

		function isWindowsDriveLetterCodePoints(cp1, cp2) {
		  return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
		}

		function isWindowsDriveLetterString(string) {
		  return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
		}

		function isNormalizedWindowsDriveLetterString(string) {
		  return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
		}

		function containsForbiddenHostCodePoint(string) {
		  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
		}

		function containsForbiddenHostCodePointExcludingPercent(string) {
		  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
		}

		function isSpecialScheme(scheme) {
		  return specialSchemes[scheme] !== undefined;
		}

		function isSpecial(url) {
		  return isSpecialScheme(url.scheme);
		}

		function defaultPort(scheme) {
		  return specialSchemes[scheme];
		}

		function percentEncode(c) {
		  let hex = c.toString(16).toUpperCase();
		  if (hex.length === 1) {
		    hex = "0" + hex;
		  }

		  return "%" + hex;
		}

		function utf8PercentEncode(c) {
		  const buf = new Buffer(c);

		  let str = "";

		  for (let i = 0; i < buf.length; ++i) {
		    str += percentEncode(buf[i]);
		  }

		  return str;
		}

		function utf8PercentDecode(str) {
		  const input = new Buffer(str);
		  const output = [];
		  for (let i = 0; i < input.length; ++i) {
		    if (input[i] !== 37) {
		      output.push(input[i]);
		    } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
		      output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
		      i += 2;
		    } else {
		      output.push(input[i]);
		    }
		  }
		  return new Buffer(output).toString();
		}

		function isC0ControlPercentEncode(c) {
		  return c <= 0x1F || c > 0x7E;
		}

		const extraPathPercentEncodeSet = new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
		function isPathPercentEncode(c) {
		  return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
		}

		const extraUserinfoPercentEncodeSet =
		  new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
		function isUserinfoPercentEncode(c) {
		  return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
		}

		function percentEncodeChar(c, encodeSetPredicate) {
		  const cStr = String.fromCodePoint(c);

		  if (encodeSetPredicate(c)) {
		    return utf8PercentEncode(cStr);
		  }

		  return cStr;
		}

		function parseIPv4Number(input) {
		  let R = 10;

		  if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
		    input = input.substring(2);
		    R = 16;
		  } else if (input.length >= 2 && input.charAt(0) === "0") {
		    input = input.substring(1);
		    R = 8;
		  }

		  if (input === "") {
		    return 0;
		  }

		  const regex = R === 10 ? /[^0-9]/ : (R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/);
		  if (regex.test(input)) {
		    return failure;
		  }

		  return parseInt(input, R);
		}

		function parseIPv4(input) {
		  const parts = input.split(".");
		  if (parts[parts.length - 1] === "") {
		    if (parts.length > 1) {
		      parts.pop();
		    }
		  }

		  if (parts.length > 4) {
		    return input;
		  }

		  const numbers = [];
		  for (const part of parts) {
		    if (part === "") {
		      return input;
		    }
		    const n = parseIPv4Number(part);
		    if (n === failure) {
		      return input;
		    }

		    numbers.push(n);
		  }

		  for (let i = 0; i < numbers.length - 1; ++i) {
		    if (numbers[i] > 255) {
		      return failure;
		    }
		  }
		  if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
		    return failure;
		  }

		  let ipv4 = numbers.pop();
		  let counter = 0;

		  for (const n of numbers) {
		    ipv4 += n * Math.pow(256, 3 - counter);
		    ++counter;
		  }

		  return ipv4;
		}

		function serializeIPv4(address) {
		  let output = "";
		  let n = address;

		  for (let i = 1; i <= 4; ++i) {
		    output = String(n % 256) + output;
		    if (i !== 4) {
		      output = "." + output;
		    }
		    n = Math.floor(n / 256);
		  }

		  return output;
		}

		function parseIPv6(input) {
		  const address = [0, 0, 0, 0, 0, 0, 0, 0];
		  let pieceIndex = 0;
		  let compress = null;
		  let pointer = 0;

		  input = punycode.ucs2.decode(input);

		  if (input[pointer] === 58) {
		    if (input[pointer + 1] !== 58) {
		      return failure;
		    }

		    pointer += 2;
		    ++pieceIndex;
		    compress = pieceIndex;
		  }

		  while (pointer < input.length) {
		    if (pieceIndex === 8) {
		      return failure;
		    }

		    if (input[pointer] === 58) {
		      if (compress !== null) {
		        return failure;
		      }
		      ++pointer;
		      ++pieceIndex;
		      compress = pieceIndex;
		      continue;
		    }

		    let value = 0;
		    let length = 0;

		    while (length < 4 && isASCIIHex(input[pointer])) {
		      value = value * 0x10 + parseInt(at(input, pointer), 16);
		      ++pointer;
		      ++length;
		    }

		    if (input[pointer] === 46) {
		      if (length === 0) {
		        return failure;
		      }

		      pointer -= length;

		      if (pieceIndex > 6) {
		        return failure;
		      }

		      let numbersSeen = 0;

		      while (input[pointer] !== undefined) {
		        let ipv4Piece = null;

		        if (numbersSeen > 0) {
		          if (input[pointer] === 46 && numbersSeen < 4) {
		            ++pointer;
		          } else {
		            return failure;
		          }
		        }

		        if (!isASCIIDigit(input[pointer])) {
		          return failure;
		        }

		        while (isASCIIDigit(input[pointer])) {
		          const number = parseInt(at(input, pointer));
		          if (ipv4Piece === null) {
		            ipv4Piece = number;
		          } else if (ipv4Piece === 0) {
		            return failure;
		          } else {
		            ipv4Piece = ipv4Piece * 10 + number;
		          }
		          if (ipv4Piece > 255) {
		            return failure;
		          }
		          ++pointer;
		        }

		        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

		        ++numbersSeen;

		        if (numbersSeen === 2 || numbersSeen === 4) {
		          ++pieceIndex;
		        }
		      }

		      if (numbersSeen !== 4) {
		        return failure;
		      }

		      break;
		    } else if (input[pointer] === 58) {
		      ++pointer;
		      if (input[pointer] === undefined) {
		        return failure;
		      }
		    } else if (input[pointer] !== undefined) {
		      return failure;
		    }

		    address[pieceIndex] = value;
		    ++pieceIndex;
		  }

		  if (compress !== null) {
		    let swaps = pieceIndex - compress;
		    pieceIndex = 7;
		    while (pieceIndex !== 0 && swaps > 0) {
		      const temp = address[compress + swaps - 1];
		      address[compress + swaps - 1] = address[pieceIndex];
		      address[pieceIndex] = temp;
		      --pieceIndex;
		      --swaps;
		    }
		  } else if (compress === null && pieceIndex !== 8) {
		    return failure;
		  }

		  return address;
		}

		function serializeIPv6(address) {
		  let output = "";
		  const seqResult = findLongestZeroSequence(address);
		  const compress = seqResult.idx;
		  let ignore0 = false;

		  for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
		    if (ignore0 && address[pieceIndex] === 0) {
		      continue;
		    } else if (ignore0) {
		      ignore0 = false;
		    }

		    if (compress === pieceIndex) {
		      const separator = pieceIndex === 0 ? "::" : ":";
		      output += separator;
		      ignore0 = true;
		      continue;
		    }

		    output += address[pieceIndex].toString(16);

		    if (pieceIndex !== 7) {
		      output += ":";
		    }
		  }

		  return output;
		}

		function parseHost(input, isSpecialArg) {
		  if (input[0] === "[") {
		    if (input[input.length - 1] !== "]") {
		      return failure;
		    }

		    return parseIPv6(input.substring(1, input.length - 1));
		  }

		  if (!isSpecialArg) {
		    return parseOpaqueHost(input);
		  }

		  const domain = utf8PercentDecode(input);
		  const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
		  if (asciiDomain === null) {
		    return failure;
		  }

		  if (containsForbiddenHostCodePoint(asciiDomain)) {
		    return failure;
		  }

		  const ipv4Host = parseIPv4(asciiDomain);
		  if (typeof ipv4Host === "number" || ipv4Host === failure) {
		    return ipv4Host;
		  }

		  return asciiDomain;
		}

		function parseOpaqueHost(input) {
		  if (containsForbiddenHostCodePointExcludingPercent(input)) {
		    return failure;
		  }

		  let output = "";
		  const decoded = punycode.ucs2.decode(input);
		  for (let i = 0; i < decoded.length; ++i) {
		    output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
		  }
		  return output;
		}

		function findLongestZeroSequence(arr) {
		  let maxIdx = null;
		  let maxLen = 1; // only find elements > 1
		  let currStart = null;
		  let currLen = 0;

		  for (let i = 0; i < arr.length; ++i) {
		    if (arr[i] !== 0) {
		      if (currLen > maxLen) {
		        maxIdx = currStart;
		        maxLen = currLen;
		      }

		      currStart = null;
		      currLen = 0;
		    } else {
		      if (currStart === null) {
		        currStart = i;
		      }
		      ++currLen;
		    }
		  }

		  // if trailing zeros
		  if (currLen > maxLen) {
		    maxIdx = currStart;
		    maxLen = currLen;
		  }

		  return {
		    idx: maxIdx,
		    len: maxLen
		  };
		}

		function serializeHost(host) {
		  if (typeof host === "number") {
		    return serializeIPv4(host);
		  }

		  // IPv6 serializer
		  if (host instanceof Array) {
		    return "[" + serializeIPv6(host) + "]";
		  }

		  return host;
		}

		function trimControlChars(url) {
		  return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
		}

		function trimTabAndNewline(url) {
		  return url.replace(/\u0009|\u000A|\u000D/g, "");
		}

		function shortenPath(url) {
		  const path = url.path;
		  if (path.length === 0) {
		    return;
		  }
		  if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
		    return;
		  }

		  path.pop();
		}

		function includesCredentials(url) {
		  return url.username !== "" || url.password !== "";
		}

		function cannotHaveAUsernamePasswordPort(url) {
		  return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
		}

		function isNormalizedWindowsDriveLetter(string) {
		  return /^[A-Za-z]:$/.test(string);
		}

		function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
		  this.pointer = 0;
		  this.input = input;
		  this.base = base || null;
		  this.encodingOverride = encodingOverride || "utf-8";
		  this.stateOverride = stateOverride;
		  this.url = url;
		  this.failure = false;
		  this.parseError = false;

		  if (!this.url) {
		    this.url = {
		      scheme: "",
		      username: "",
		      password: "",
		      host: null,
		      port: null,
		      path: [],
		      query: null,
		      fragment: null,

		      cannotBeABaseURL: false
		    };

		    const res = trimControlChars(this.input);
		    if (res !== this.input) {
		      this.parseError = true;
		    }
		    this.input = res;
		  }

		  const res = trimTabAndNewline(this.input);
		  if (res !== this.input) {
		    this.parseError = true;
		  }
		  this.input = res;

		  this.state = stateOverride || "scheme start";

		  this.buffer = "";
		  this.atFlag = false;
		  this.arrFlag = false;
		  this.passwordTokenSeenFlag = false;

		  this.input = punycode.ucs2.decode(this.input);

		  for (; this.pointer <= this.input.length; ++this.pointer) {
		    const c = this.input[this.pointer];
		    const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

		    // exec state machine
		    const ret = this["parse " + this.state](c, cStr);
		    if (!ret) {
		      break; // terminate algorithm
		    } else if (ret === failure) {
		      this.failure = true;
		      break;
		    }
		  }
		}

		URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
		  if (isASCIIAlpha(c)) {
		    this.buffer += cStr.toLowerCase();
		    this.state = "scheme";
		  } else if (!this.stateOverride) {
		    this.state = "no scheme";
		    --this.pointer;
		  } else {
		    this.parseError = true;
		    return failure;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
		  if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
		    this.buffer += cStr.toLowerCase();
		  } else if (c === 58) {
		    if (this.stateOverride) {
		      if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
		        return false;
		      }

		      if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
		        return false;
		      }

		      if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
		        return false;
		      }

		      if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
		        return false;
		      }
		    }
		    this.url.scheme = this.buffer;
		    this.buffer = "";
		    if (this.stateOverride) {
		      return false;
		    }
		    if (this.url.scheme === "file") {
		      if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
		        this.parseError = true;
		      }
		      this.state = "file";
		    } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
		      this.state = "special relative or authority";
		    } else if (isSpecial(this.url)) {
		      this.state = "special authority slashes";
		    } else if (this.input[this.pointer + 1] === 47) {
		      this.state = "path or authority";
		      ++this.pointer;
		    } else {
		      this.url.cannotBeABaseURL = true;
		      this.url.path.push("");
		      this.state = "cannot-be-a-base-URL path";
		    }
		  } else if (!this.stateOverride) {
		    this.buffer = "";
		    this.state = "no scheme";
		    this.pointer = -1;
		  } else {
		    this.parseError = true;
		    return failure;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
		  if (this.base === null || (this.base.cannotBeABaseURL && c !== 35)) {
		    return failure;
		  } else if (this.base.cannotBeABaseURL && c === 35) {
		    this.url.scheme = this.base.scheme;
		    this.url.path = this.base.path.slice();
		    this.url.query = this.base.query;
		    this.url.fragment = "";
		    this.url.cannotBeABaseURL = true;
		    this.state = "fragment";
		  } else if (this.base.scheme === "file") {
		    this.state = "file";
		    --this.pointer;
		  } else {
		    this.state = "relative";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
		  if (c === 47 && this.input[this.pointer + 1] === 47) {
		    this.state = "special authority ignore slashes";
		    ++this.pointer;
		  } else {
		    this.parseError = true;
		    this.state = "relative";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
		  if (c === 47) {
		    this.state = "authority";
		  } else {
		    this.state = "path";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
		  this.url.scheme = this.base.scheme;
		  if (isNaN(c)) {
		    this.url.username = this.base.username;
		    this.url.password = this.base.password;
		    this.url.host = this.base.host;
		    this.url.port = this.base.port;
		    this.url.path = this.base.path.slice();
		    this.url.query = this.base.query;
		  } else if (c === 47) {
		    this.state = "relative slash";
		  } else if (c === 63) {
		    this.url.username = this.base.username;
		    this.url.password = this.base.password;
		    this.url.host = this.base.host;
		    this.url.port = this.base.port;
		    this.url.path = this.base.path.slice();
		    this.url.query = "";
		    this.state = "query";
		  } else if (c === 35) {
		    this.url.username = this.base.username;
		    this.url.password = this.base.password;
		    this.url.host = this.base.host;
		    this.url.port = this.base.port;
		    this.url.path = this.base.path.slice();
		    this.url.query = this.base.query;
		    this.url.fragment = "";
		    this.state = "fragment";
		  } else if (isSpecial(this.url) && c === 92) {
		    this.parseError = true;
		    this.state = "relative slash";
		  } else {
		    this.url.username = this.base.username;
		    this.url.password = this.base.password;
		    this.url.host = this.base.host;
		    this.url.port = this.base.port;
		    this.url.path = this.base.path.slice(0, this.base.path.length - 1);

		    this.state = "path";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
		  if (isSpecial(this.url) && (c === 47 || c === 92)) {
		    if (c === 92) {
		      this.parseError = true;
		    }
		    this.state = "special authority ignore slashes";
		  } else if (c === 47) {
		    this.state = "authority";
		  } else {
		    this.url.username = this.base.username;
		    this.url.password = this.base.password;
		    this.url.host = this.base.host;
		    this.url.port = this.base.port;
		    this.state = "path";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
		  if (c === 47 && this.input[this.pointer + 1] === 47) {
		    this.state = "special authority ignore slashes";
		    ++this.pointer;
		  } else {
		    this.parseError = true;
		    this.state = "special authority ignore slashes";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
		  if (c !== 47 && c !== 92) {
		    this.state = "authority";
		    --this.pointer;
		  } else {
		    this.parseError = true;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
		  if (c === 64) {
		    this.parseError = true;
		    if (this.atFlag) {
		      this.buffer = "%40" + this.buffer;
		    }
		    this.atFlag = true;

		    // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
		    const len = countSymbols(this.buffer);
		    for (let pointer = 0; pointer < len; ++pointer) {
		      const codePoint = this.buffer.codePointAt(pointer);

		      if (codePoint === 58 && !this.passwordTokenSeenFlag) {
		        this.passwordTokenSeenFlag = true;
		        continue;
		      }
		      const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
		      if (this.passwordTokenSeenFlag) {
		        this.url.password += encodedCodePoints;
		      } else {
		        this.url.username += encodedCodePoints;
		      }
		    }
		    this.buffer = "";
		  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
		             (isSpecial(this.url) && c === 92)) {
		    if (this.atFlag && this.buffer === "") {
		      this.parseError = true;
		      return failure;
		    }
		    this.pointer -= countSymbols(this.buffer) + 1;
		    this.buffer = "";
		    this.state = "host";
		  } else {
		    this.buffer += cStr;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse hostname"] =
		URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
		  if (this.stateOverride && this.url.scheme === "file") {
		    --this.pointer;
		    this.state = "file host";
		  } else if (c === 58 && !this.arrFlag) {
		    if (this.buffer === "") {
		      this.parseError = true;
		      return failure;
		    }

		    const host = parseHost(this.buffer, isSpecial(this.url));
		    if (host === failure) {
		      return failure;
		    }

		    this.url.host = host;
		    this.buffer = "";
		    this.state = "port";
		    if (this.stateOverride === "hostname") {
		      return false;
		    }
		  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
		             (isSpecial(this.url) && c === 92)) {
		    --this.pointer;
		    if (isSpecial(this.url) && this.buffer === "") {
		      this.parseError = true;
		      return failure;
		    } else if (this.stateOverride && this.buffer === "" &&
		               (includesCredentials(this.url) || this.url.port !== null)) {
		      this.parseError = true;
		      return false;
		    }

		    const host = parseHost(this.buffer, isSpecial(this.url));
		    if (host === failure) {
		      return failure;
		    }

		    this.url.host = host;
		    this.buffer = "";
		    this.state = "path start";
		    if (this.stateOverride) {
		      return false;
		    }
		  } else {
		    if (c === 91) {
		      this.arrFlag = true;
		    } else if (c === 93) {
		      this.arrFlag = false;
		    }
		    this.buffer += cStr;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
		  if (isASCIIDigit(c)) {
		    this.buffer += cStr;
		  } else if (isNaN(c) || c === 47 || c === 63 || c === 35 ||
		             (isSpecial(this.url) && c === 92) ||
		             this.stateOverride) {
		    if (this.buffer !== "") {
		      const port = parseInt(this.buffer);
		      if (port > Math.pow(2, 16) - 1) {
		        this.parseError = true;
		        return failure;
		      }
		      this.url.port = port === defaultPort(this.url.scheme) ? null : port;
		      this.buffer = "";
		    }
		    if (this.stateOverride) {
		      return false;
		    }
		    this.state = "path start";
		    --this.pointer;
		  } else {
		    this.parseError = true;
		    return failure;
		  }

		  return true;
		};

		const fileOtherwiseCodePoints = new Set([47, 92, 63, 35]);

		URLStateMachine.prototype["parse file"] = function parseFile(c) {
		  this.url.scheme = "file";

		  if (c === 47 || c === 92) {
		    if (c === 92) {
		      this.parseError = true;
		    }
		    this.state = "file slash";
		  } else if (this.base !== null && this.base.scheme === "file") {
		    if (isNaN(c)) {
		      this.url.host = this.base.host;
		      this.url.path = this.base.path.slice();
		      this.url.query = this.base.query;
		    } else if (c === 63) {
		      this.url.host = this.base.host;
		      this.url.path = this.base.path.slice();
		      this.url.query = "";
		      this.state = "query";
		    } else if (c === 35) {
		      this.url.host = this.base.host;
		      this.url.path = this.base.path.slice();
		      this.url.query = this.base.query;
		      this.url.fragment = "";
		      this.state = "fragment";
		    } else {
		      if (this.input.length - this.pointer - 1 === 0 || // remaining consists of 0 code points
		          !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) ||
		          (this.input.length - this.pointer - 1 >= 2 && // remaining has at least 2 code points
		           !fileOtherwiseCodePoints.has(this.input[this.pointer + 2]))) {
		        this.url.host = this.base.host;
		        this.url.path = this.base.path.slice();
		        shortenPath(this.url);
		      } else {
		        this.parseError = true;
		      }

		      this.state = "path";
		      --this.pointer;
		    }
		  } else {
		    this.state = "path";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
		  if (c === 47 || c === 92) {
		    if (c === 92) {
		      this.parseError = true;
		    }
		    this.state = "file host";
		  } else {
		    if (this.base !== null && this.base.scheme === "file") {
		      if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
		        this.url.path.push(this.base.path[0]);
		      } else {
		        this.url.host = this.base.host;
		      }
		    }
		    this.state = "path";
		    --this.pointer;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
		  if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
		    --this.pointer;
		    if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
		      this.parseError = true;
		      this.state = "path";
		    } else if (this.buffer === "") {
		      this.url.host = "";
		      if (this.stateOverride) {
		        return false;
		      }
		      this.state = "path start";
		    } else {
		      let host = parseHost(this.buffer, isSpecial(this.url));
		      if (host === failure) {
		        return failure;
		      }
		      if (host === "localhost") {
		        host = "";
		      }
		      this.url.host = host;

		      if (this.stateOverride) {
		        return false;
		      }

		      this.buffer = "";
		      this.state = "path start";
		    }
		  } else {
		    this.buffer += cStr;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
		  if (isSpecial(this.url)) {
		    if (c === 92) {
		      this.parseError = true;
		    }
		    this.state = "path";

		    if (c !== 47 && c !== 92) {
		      --this.pointer;
		    }
		  } else if (!this.stateOverride && c === 63) {
		    this.url.query = "";
		    this.state = "query";
		  } else if (!this.stateOverride && c === 35) {
		    this.url.fragment = "";
		    this.state = "fragment";
		  } else if (c !== undefined) {
		    this.state = "path";
		    if (c !== 47) {
		      --this.pointer;
		    }
		  }

		  return true;
		};

		URLStateMachine.prototype["parse path"] = function parsePath(c) {
		  if (isNaN(c) || c === 47 || (isSpecial(this.url) && c === 92) ||
		      (!this.stateOverride && (c === 63 || c === 35))) {
		    if (isSpecial(this.url) && c === 92) {
		      this.parseError = true;
		    }

		    if (isDoubleDot(this.buffer)) {
		      shortenPath(this.url);
		      if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
		        this.url.path.push("");
		      }
		    } else if (isSingleDot(this.buffer) && c !== 47 &&
		               !(isSpecial(this.url) && c === 92)) {
		      this.url.path.push("");
		    } else if (!isSingleDot(this.buffer)) {
		      if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
		        if (this.url.host !== "" && this.url.host !== null) {
		          this.parseError = true;
		          this.url.host = "";
		        }
		        this.buffer = this.buffer[0] + ":";
		      }
		      this.url.path.push(this.buffer);
		    }
		    this.buffer = "";
		    if (this.url.scheme === "file" && (c === undefined || c === 63 || c === 35)) {
		      while (this.url.path.length > 1 && this.url.path[0] === "") {
		        this.parseError = true;
		        this.url.path.shift();
		      }
		    }
		    if (c === 63) {
		      this.url.query = "";
		      this.state = "query";
		    }
		    if (c === 35) {
		      this.url.fragment = "";
		      this.state = "fragment";
		    }
		  } else {
		    // TODO: If c is not a URL code point and not "%", parse error.

		    if (c === 37 &&
		      (!isASCIIHex(this.input[this.pointer + 1]) ||
		        !isASCIIHex(this.input[this.pointer + 2]))) {
		      this.parseError = true;
		    }

		    this.buffer += percentEncodeChar(c, isPathPercentEncode);
		  }

		  return true;
		};

		URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
		  if (c === 63) {
		    this.url.query = "";
		    this.state = "query";
		  } else if (c === 35) {
		    this.url.fragment = "";
		    this.state = "fragment";
		  } else {
		    // TODO: Add: not a URL code point
		    if (!isNaN(c) && c !== 37) {
		      this.parseError = true;
		    }

		    if (c === 37 &&
		        (!isASCIIHex(this.input[this.pointer + 1]) ||
		         !isASCIIHex(this.input[this.pointer + 2]))) {
		      this.parseError = true;
		    }

		    if (!isNaN(c)) {
		      this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
		    }
		  }

		  return true;
		};

		URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
		  if (isNaN(c) || (!this.stateOverride && c === 35)) {
		    if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
		      this.encodingOverride = "utf-8";
		    }

		    const buffer = new Buffer(this.buffer); // TODO: Use encoding override instead
		    for (let i = 0; i < buffer.length; ++i) {
		      if (buffer[i] < 0x21 || buffer[i] > 0x7E || buffer[i] === 0x22 || buffer[i] === 0x23 ||
		          buffer[i] === 0x3C || buffer[i] === 0x3E) {
		        this.url.query += percentEncode(buffer[i]);
		      } else {
		        this.url.query += String.fromCodePoint(buffer[i]);
		      }
		    }

		    this.buffer = "";
		    if (c === 35) {
		      this.url.fragment = "";
		      this.state = "fragment";
		    }
		  } else {
		    // TODO: If c is not a URL code point and not "%", parse error.
		    if (c === 37 &&
		      (!isASCIIHex(this.input[this.pointer + 1]) ||
		        !isASCIIHex(this.input[this.pointer + 2]))) {
		      this.parseError = true;
		    }

		    this.buffer += cStr;
		  }

		  return true;
		};

		URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
		  if (isNaN(c)) ; else if (c === 0x0) {
		    this.parseError = true;
		  } else {
		    // TODO: If c is not a URL code point and not "%", parse error.
		    if (c === 37 &&
		      (!isASCIIHex(this.input[this.pointer + 1]) ||
		        !isASCIIHex(this.input[this.pointer + 2]))) {
		      this.parseError = true;
		    }

		    this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
		  }

		  return true;
		};

		function serializeURL(url, excludeFragment) {
		  let output = url.scheme + ":";
		  if (url.host !== null) {
		    output += "//";

		    if (url.username !== "" || url.password !== "") {
		      output += url.username;
		      if (url.password !== "") {
		        output += ":" + url.password;
		      }
		      output += "@";
		    }

		    output += serializeHost(url.host);

		    if (url.port !== null) {
		      output += ":" + url.port;
		    }
		  } else if (url.host === null && url.scheme === "file") {
		    output += "//";
		  }

		  if (url.cannotBeABaseURL) {
		    output += url.path[0];
		  } else {
		    for (const string of url.path) {
		      output += "/" + string;
		    }
		  }

		  if (url.query !== null) {
		    output += "?" + url.query;
		  }

		  if (!excludeFragment && url.fragment !== null) {
		    output += "#" + url.fragment;
		  }

		  return output;
		}

		function serializeOrigin(tuple) {
		  let result = tuple.scheme + "://";
		  result += serializeHost(tuple.host);

		  if (tuple.port !== null) {
		    result += ":" + tuple.port;
		  }

		  return result;
		}

		module.exports.serializeURL = serializeURL;

		module.exports.serializeURLOrigin = function (url) {
		  // https://url.spec.whatwg.org/#concept-url-origin
		  switch (url.scheme) {
		    case "blob":
		      try {
		        return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
		      } catch (e) {
		        // serializing an opaque origin returns "null"
		        return "null";
		      }
		    case "ftp":
		    case "gopher":
		    case "http":
		    case "https":
		    case "ws":
		    case "wss":
		      return serializeOrigin({
		        scheme: url.scheme,
		        host: url.host,
		        port: url.port
		      });
		    case "file":
		      // spec says "exercise to the reader", chrome says "file://"
		      return "file://";
		    default:
		      // serializing an opaque origin returns "null"
		      return "null";
		  }
		};

		module.exports.basicURLParse = function (input, options) {
		  if (options === undefined) {
		    options = {};
		  }

		  const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
		  if (usm.failure) {
		    return "failure";
		  }

		  return usm.url;
		};

		module.exports.setTheUsername = function (url, username) {
		  url.username = "";
		  const decoded = punycode.ucs2.decode(username);
		  for (let i = 0; i < decoded.length; ++i) {
		    url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
		  }
		};

		module.exports.setThePassword = function (url, password) {
		  url.password = "";
		  const decoded = punycode.ucs2.decode(password);
		  for (let i = 0; i < decoded.length; ++i) {
		    url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
		  }
		};

		module.exports.serializeHost = serializeHost;

		module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;

		module.exports.serializeInteger = function (integer) {
		  return String(integer);
		};

		module.exports.parseURL = function (input, options) {
		  if (options === undefined) {
		    options = {};
		  }

		  // We don't handle blobs, so this just delegates:
		  return module.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
		}; 
	} (urlStateMachine));
	return urlStateMachine.exports;
}

var hasRequiredURLImpl;

function requireURLImpl () {
	if (hasRequiredURLImpl) return URLImpl;
	hasRequiredURLImpl = 1;
	const usm = requireUrlStateMachine();

	URLImpl.implementation = class URLImpl {
	  constructor(constructorArgs) {
	    const url = constructorArgs[0];
	    const base = constructorArgs[1];

	    let parsedBase = null;
	    if (base !== undefined) {
	      parsedBase = usm.basicURLParse(base);
	      if (parsedBase === "failure") {
	        throw new TypeError("Invalid base URL");
	      }
	    }

	    const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
	    if (parsedURL === "failure") {
	      throw new TypeError("Invalid URL");
	    }

	    this._url = parsedURL;

	    // TODO: query stuff
	  }

	  get href() {
	    return usm.serializeURL(this._url);
	  }

	  set href(v) {
	    const parsedURL = usm.basicURLParse(v);
	    if (parsedURL === "failure") {
	      throw new TypeError("Invalid URL");
	    }

	    this._url = parsedURL;
	  }

	  get origin() {
	    return usm.serializeURLOrigin(this._url);
	  }

	  get protocol() {
	    return this._url.scheme + ":";
	  }

	  set protocol(v) {
	    usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
	  }

	  get username() {
	    return this._url.username;
	  }

	  set username(v) {
	    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
	      return;
	    }

	    usm.setTheUsername(this._url, v);
	  }

	  get password() {
	    return this._url.password;
	  }

	  set password(v) {
	    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
	      return;
	    }

	    usm.setThePassword(this._url, v);
	  }

	  get host() {
	    const url = this._url;

	    if (url.host === null) {
	      return "";
	    }

	    if (url.port === null) {
	      return usm.serializeHost(url.host);
	    }

	    return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
	  }

	  set host(v) {
	    if (this._url.cannotBeABaseURL) {
	      return;
	    }

	    usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
	  }

	  get hostname() {
	    if (this._url.host === null) {
	      return "";
	    }

	    return usm.serializeHost(this._url.host);
	  }

	  set hostname(v) {
	    if (this._url.cannotBeABaseURL) {
	      return;
	    }

	    usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
	  }

	  get port() {
	    if (this._url.port === null) {
	      return "";
	    }

	    return usm.serializeInteger(this._url.port);
	  }

	  set port(v) {
	    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
	      return;
	    }

	    if (v === "") {
	      this._url.port = null;
	    } else {
	      usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
	    }
	  }

	  get pathname() {
	    if (this._url.cannotBeABaseURL) {
	      return this._url.path[0];
	    }

	    if (this._url.path.length === 0) {
	      return "";
	    }

	    return "/" + this._url.path.join("/");
	  }

	  set pathname(v) {
	    if (this._url.cannotBeABaseURL) {
	      return;
	    }

	    this._url.path = [];
	    usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
	  }

	  get search() {
	    if (this._url.query === null || this._url.query === "") {
	      return "";
	    }

	    return "?" + this._url.query;
	  }

	  set search(v) {
	    // TODO: query stuff

	    const url = this._url;

	    if (v === "") {
	      url.query = null;
	      return;
	    }

	    const input = v[0] === "?" ? v.substring(1) : v;
	    url.query = "";
	    usm.basicURLParse(input, { url, stateOverride: "query" });
	  }

	  get hash() {
	    if (this._url.fragment === null || this._url.fragment === "") {
	      return "";
	    }

	    return "#" + this._url.fragment;
	  }

	  set hash(v) {
	    if (v === "") {
	      this._url.fragment = null;
	      return;
	    }

	    const input = v[0] === "#" ? v.substring(1) : v;
	    this._url.fragment = "";
	    usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
	  }

	  toJSON() {
	    return this.href;
	  }
	};
	return URLImpl;
}

var hasRequiredURL;

function requireURL () {
	if (hasRequiredURL) return URL$2.exports;
	hasRequiredURL = 1;
	(function (module) {

		const conversions = requireLib();
		const utils = requireUtils();
		const Impl = requireURLImpl();

		const impl = utils.implSymbol;

		function URL(url) {
		  if (!this || this[impl] || !(this instanceof URL)) {
		    throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
		  }
		  if (arguments.length < 1) {
		    throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
		  }
		  const args = [];
		  for (let i = 0; i < arguments.length && i < 2; ++i) {
		    args[i] = arguments[i];
		  }
		  args[0] = conversions["USVString"](args[0]);
		  if (args[1] !== undefined) {
		  args[1] = conversions["USVString"](args[1]);
		  }

		  module.exports.setup(this, args);
		}

		URL.prototype.toJSON = function toJSON() {
		  if (!this || !module.exports.is(this)) {
		    throw new TypeError("Illegal invocation");
		  }
		  const args = [];
		  for (let i = 0; i < arguments.length && i < 0; ++i) {
		    args[i] = arguments[i];
		  }
		  return this[impl].toJSON.apply(this[impl], args);
		};
		Object.defineProperty(URL.prototype, "href", {
		  get() {
		    return this[impl].href;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].href = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		URL.prototype.toString = function () {
		  if (!this || !module.exports.is(this)) {
		    throw new TypeError("Illegal invocation");
		  }
		  return this.href;
		};

		Object.defineProperty(URL.prototype, "origin", {
		  get() {
		    return this[impl].origin;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "protocol", {
		  get() {
		    return this[impl].protocol;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].protocol = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "username", {
		  get() {
		    return this[impl].username;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].username = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "password", {
		  get() {
		    return this[impl].password;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].password = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "host", {
		  get() {
		    return this[impl].host;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].host = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "hostname", {
		  get() {
		    return this[impl].hostname;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].hostname = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "port", {
		  get() {
		    return this[impl].port;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].port = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "pathname", {
		  get() {
		    return this[impl].pathname;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].pathname = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "search", {
		  get() {
		    return this[impl].search;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].search = V;
		  },
		  enumerable: true,
		  configurable: true
		});

		Object.defineProperty(URL.prototype, "hash", {
		  get() {
		    return this[impl].hash;
		  },
		  set(V) {
		    V = conversions["USVString"](V);
		    this[impl].hash = V;
		  },
		  enumerable: true,
		  configurable: true
		});


		module.exports = {
		  is(obj) {
		    return !!obj && obj[impl] instanceof Impl.implementation;
		  },
		  create(constructorArgs, privateData) {
		    let obj = Object.create(URL.prototype);
		    this.setup(obj, constructorArgs, privateData);
		    return obj;
		  },
		  setup(obj, constructorArgs, privateData) {
		    if (!privateData) privateData = {};
		    privateData.wrapper = obj;

		    obj[impl] = new Impl.implementation(constructorArgs, privateData);
		    obj[impl][utils.wrapperSymbol] = obj;
		  },
		  interface: URL,
		  expose: {
		    Window: { URL: URL },
		    Worker: { URL: URL }
		  }
		}; 
	} (URL$2));
	return URL$2.exports;
}

var hasRequiredPublicApi;

function requirePublicApi () {
	if (hasRequiredPublicApi) return publicApi;
	hasRequiredPublicApi = 1;

	publicApi.URL = requireURL().interface;
	publicApi.serializeURL = requireUrlStateMachine().serializeURL;
	publicApi.serializeURLOrigin = requireUrlStateMachine().serializeURLOrigin;
	publicApi.basicURLParse = requireUrlStateMachine().basicURLParse;
	publicApi.setTheUsername = requireUrlStateMachine().setTheUsername;
	publicApi.setThePassword = requireUrlStateMachine().setThePassword;
	publicApi.serializeHost = requireUrlStateMachine().serializeHost;
	publicApi.serializeInteger = requireUrlStateMachine().serializeInteger;
	publicApi.parseURL = requireUrlStateMachine().parseURL;
	return publicApi;
}

var publicApiExports = requirePublicApi();
var whatwgUrl = /*@__PURE__*/getDefaultExportFromCjs(publicApiExports);

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

let Blob$1 = class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
};

Object.defineProperties(Blob$1.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob$1.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob$1([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');
const URL$1 = Url.URL || whatwgUrl.URL;

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

/**
 * Wrapper around `new URL` to handle arbitrary URLs
 *
 * @param  {string} urlStr
 * @return {void}
 */
function parseURL(urlStr) {
	/*
 	Check whether the URL is absolute or not
 		Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
 	Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
 */
	if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
		urlStr = new URL$1(urlStr).toString();
	}

	// Fallback to old implementation for arbitrary URLs
	return parse_url(urlStr);
}

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parseURL(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parseURL(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parseURL(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

const URL$1$1 = Url.URL || whatwgUrl.URL;

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;

const isDomainOrSubdomain = function isDomainOrSubdomain(destination, original) {
	const orig = new URL$1$1(original).hostname;
	const dest = new URL$1$1(destination).hostname;

	return orig === dest || orig[orig.length - dest.length - 1] === '.' && orig.endsWith(dest);
};

/**
 * isSameProtocol reports whether the two provided URLs use the same protocol.
 *
 * Both domains must already be in canonical form.
 * @param {string|URL} original
 * @param {string|URL} destination
 */
const isSameProtocol = function isSameProtocol(destination, original) {
	const orig = new URL$1$1(original).protocol;
	const dest = new URL$1$1(destination).protocol;

	return orig === dest;
};

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch$1(url, opts) {

	// allow custom promise
	if (!fetch$1.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch$1.Promise;

	// wrap http.request into fetch
	return new fetch$1.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? require$$4 : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				destroyStream(request.body, error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));

			if (response && response.body) {
				destroyStream(response.body, err);
			}

			finalize();
		});

		fixResponseChunkedTransferBadEnding(req, function (err) {
			if (signal && signal.aborted) {
				return;
			}

			if (response && response.body) {
				destroyStream(response.body, err);
			}
		});

		/* c8 ignore next 18 */
		if (parseInt(process.version.substring(1)) < 14) {
			// Before Node.js 14, pipeline() does not fully support async iterators and does not always
			// properly handle when the socket close/end events are out of order.
			req.on('socket', function (s) {
				s.addListener('close', function (hadError) {
					// if a data listener is still present we didn't end cleanly
					const hasDataListener = s.listenerCount('data') > 0;

					// if end happened before close but the socket didn't emit an error, do it now
					if (response && hasDataListener && !hadError && !(signal && signal.aborted)) {
						const err = new Error('Premature close');
						err.code = 'ERR_STREAM_PREMATURE_CLOSE';
						response.body.emit('error', err);
					}
				});
			});
		}

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch$1.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				let locationURL = null;
				try {
					locationURL = location === null ? null : new URL$1$1(location, request.url).toString();
				} catch (err) {
					// error here can only be invalid URL in Location: header
					// do not throw when options.redirect == manual
					// let the user extract the errorneous redirect URL
					if (request.redirect !== 'manual') {
						reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, 'invalid-redirect'));
						finalize();
						return;
					}
				}

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						if (!isDomainOrSubdomain(request.url, locationURL) || !isSameProtocol(request.url, locationURL)) {
							for (const name of ['authorization', 'www-authenticate', 'cookie', 'cookie2']) {
								requestOpts.headers.delete(name);
							}
						}

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch$1(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				raw.on('end', function () {
					// some old IIS servers return zero-length OK deflate responses, so 'data' is never emitted.
					if (!response) {
						response = new Response(body, response_options);
						resolve(response);
					}
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
	let socket;

	request.on('socket', function (s) {
		socket = s;
	});

	request.on('response', function (response) {
		const headers = response.headers;

		if (headers['transfer-encoding'] === 'chunked' && !headers['content-length']) {
			response.once('close', function (hadError) {
				// tests for socket presence, as in some situations the
				// the 'socket' event is not triggered for the request
				// (happens in deno), avoids `TypeError`
				// if a data listener is still present we didn't end cleanly
				const hasDataListener = socket && socket.listenerCount('data') > 0;

				if (hasDataListener && !hadError) {
					const err = new Error('Premature close');
					err.code = 'ERR_STREAM_PREMATURE_CLOSE';
					errorCallback(err);
				}
			});
		}
	});
}

function destroyStream(stream, err) {
	if (stream.destroy) {
		stream.destroy(err);
	} else {
		// node < 8
		stream.emit('error', err);
		stream.end();
	}
}

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch$1.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch$1.Promise = global.Promise;

var lib = /*#__PURE__*/Object.freeze({
	__proto__: null,
	AbortError: AbortError,
	FetchError: FetchError,
	Headers: Headers,
	Request: Request,
	Response: Response,
	default: fetch$1
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(lib);

var hasRequiredNodePonyfill;

function requireNodePonyfill () {
	if (hasRequiredNodePonyfill) return nodePonyfill.exports;
	hasRequiredNodePonyfill = 1;
	(function (module, exports) {
		const nodeFetch = require$$0;
		const realFetch = nodeFetch.default || nodeFetch;

		const fetch = function (url, options) {
		  // Support schemaless URIs on the server for parity with the browser.
		  // Ex: //github.com/ -> https://github.com/
		  if (/^\/\//.test(url)) {
		    url = 'https:' + url;
		  }
		  return realFetch.call(this, url, options)
		};

		fetch.ponyfill = true;

		module.exports = exports = fetch;
		exports.fetch = fetch;
		exports.Headers = nodeFetch.Headers;
		exports.Request = nodeFetch.Request;
		exports.Response = nodeFetch.Response;

		// Needed for TypeScript consumers without esModuleInterop.
		exports.default = fetch; 
	} (nodePonyfill, nodePonyfill.exports));
	return nodePonyfill.exports;
}

/*! xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported XLSX */
/*global process:false, Buffer:false, ArrayBuffer:false, DataView:false, Deno:false */
var XLSX = {};
XLSX.version = '0.19.3';
var current_codepage = 1200, current_ansi = 1252;
/*:: declare var cptable:any; */
/*global cptable:true, window */
var $cptable;

var VALID_ANSI = [ 874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 10000 ];
/* ECMA-376 Part I 18.4.1 charset to codepage mapping */
var CS2CP = ({
	/*::[*/0/*::]*/:    1252, /* ANSI */
	/*::[*/1/*::]*/:   65001, /* DEFAULT */
	/*::[*/2/*::]*/:   65001, /* SYMBOL */
	/*::[*/77/*::]*/:  10000, /* MAC */
	/*::[*/128/*::]*/:   932, /* SHIFTJIS */
	/*::[*/129/*::]*/:   949, /* HANGUL */
	/*::[*/130/*::]*/:  1361, /* JOHAB */
	/*::[*/134/*::]*/:   936, /* GB2312 */
	/*::[*/136/*::]*/:   950, /* CHINESEBIG5 */
	/*::[*/161/*::]*/:  1253, /* GREEK */
	/*::[*/162/*::]*/:  1254, /* TURKISH */
	/*::[*/163/*::]*/:  1258, /* VIETNAMESE */
	/*::[*/177/*::]*/:  1255, /* HEBREW */
	/*::[*/178/*::]*/:  1256, /* ARABIC */
	/*::[*/186/*::]*/:  1257, /* BALTIC */
	/*::[*/204/*::]*/:  1251, /* RUSSIAN */
	/*::[*/222/*::]*/:   874, /* THAI */
	/*::[*/238/*::]*/:  1250, /* EASTEUROPE */
	/*::[*/255/*::]*/:  1252, /* OEM */
	/*::[*/69/*::]*/:   6969  /* MISC */
}/*:any*/);

var set_ansi = function(cp/*:number*/) { if(VALID_ANSI.indexOf(cp) == -1) return; current_ansi = CS2CP[0] = cp; };
function reset_ansi() { set_ansi(1252); }

var set_cp = function(cp/*:number*/) { current_codepage = cp; set_ansi(cp); };
function reset_cp() { set_cp(1200); reset_ansi(); }

function char_codes(data/*:string*/)/*:Array<number>*/ { var o/*:Array<number>*/ = []; for(var i = 0, len = data.length; i < len; ++i) o[i] = data.charCodeAt(i); return o; }

function utf16leread(data/*:string*/)/*:string*/ {
	var o/*:Array<string>*/ = [];
	for(var i = 0; i < (data.length>>1); ++i) o[i] = String.fromCharCode(data.charCodeAt(2*i) + (data.charCodeAt(2*i+1)<<8));
	return o.join("");
}
function utf16lereadu(data/*:Uint8Array*/)/*:string*/ {
	var o/*:Array<string>*/ = [];
	for(var i = 0; i < (data.length>>1); ++i) o[i] = String.fromCharCode(data[2*i] + (data[2*i+1]<<8));
	return o.join("");
}
function utf16beread(data/*:string*/)/*:string*/ {
	var o/*:Array<string>*/ = [];
	for(var i = 0; i < (data.length>>1); ++i) o[i] = String.fromCharCode(data.charCodeAt(2*i+1) + (data.charCodeAt(2*i)<<8));
	return o.join("");
}

var debom = function(data/*:string*/)/*:string*/ {
	var c1 = data.charCodeAt(0), c2 = data.charCodeAt(1);
	if(c1 == 0xFF && c2 == 0xFE) return utf16leread(data.slice(2));
	if(c1 == 0xFE && c2 == 0xFF) return utf16beread(data.slice(2));
	if(c1 == 0xFEFF) return data.slice(1);
	return data;
};

var _getchar = function _gc1(x/*:number*/)/*:string*/ { return String.fromCharCode(x); };
var _getansi = function _ga1(x/*:number*/)/*:string*/ { return String.fromCharCode(x); };

function set_cptable(cptable) {
	$cptable = cptable;
	set_cp = function(cp/*:number*/) { current_codepage = cp; set_ansi(cp); };
	debom = function(data/*:string*/) {
		if(data.charCodeAt(0) === 0xFF && data.charCodeAt(1) === 0xFE) { return $cptable.utils.decode(1200, char_codes(data.slice(2))); }
		return data;
	};
	_getchar = function _gc2(x/*:number*/)/*:string*/ {
		if(current_codepage === 1200) return String.fromCharCode(x);
		return $cptable.utils.decode(current_codepage, [x&255,x>>8])[0];
	};
	_getansi = function _ga2(x/*:number*/)/*:string*/ {
		return $cptable.utils.decode(current_ansi, [x])[0];
	};
	cpdoit();
}
var DENSE = null;
var Base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function Base64_encode(input) {
  var o = "";
  var c1 = 0, c2 = 0, c3 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0;
  for (var i = 0; i < input.length; ) {
    c1 = input.charCodeAt(i++);
    e1 = c1 >> 2;
    c2 = input.charCodeAt(i++);
    e2 = (c1 & 3) << 4 | c2 >> 4;
    c3 = input.charCodeAt(i++);
    e3 = (c2 & 15) << 2 | c3 >> 6;
    e4 = c3 & 63;
    if (isNaN(c2)) {
      e3 = e4 = 64;
    } else if (isNaN(c3)) {
      e4 = 64;
    }
    o += Base64_map.charAt(e1) + Base64_map.charAt(e2) + Base64_map.charAt(e3) + Base64_map.charAt(e4);
  }
  return o;
}
function Base64_encode_pass(input) {
  var o = "";
  var c1 = 0, c2 = 0, c3 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0;
  for (var i = 0; i < input.length; ) {
    c1 = input.charCodeAt(i++);
    if (c1 > 255)
      c1 = 95;
    e1 = c1 >> 2;
    c2 = input.charCodeAt(i++);
    if (c2 > 255)
      c2 = 95;
    e2 = (c1 & 3) << 4 | c2 >> 4;
    c3 = input.charCodeAt(i++);
    if (c3 > 255)
      c3 = 95;
    e3 = (c2 & 15) << 2 | c3 >> 6;
    e4 = c3 & 63;
    if (isNaN(c2)) {
      e3 = e4 = 64;
    } else if (isNaN(c3)) {
      e4 = 64;
    }
    o += Base64_map.charAt(e1) + Base64_map.charAt(e2) + Base64_map.charAt(e3) + Base64_map.charAt(e4);
  }
  return o;
}
function Base64_decode(input) {
  var o = "";
  var c1 = 0, c2 = 0, c3 = 0, e1 = 0, e2 = 0, e3 = 0, e4 = 0;
  input = input.replace(/^data:([^\/]+\/[^\/]+)?;base64\,/, "").replace(/[^\w\+\/\=]/g, "");
  for (var i = 0; i < input.length; ) {
    e1 = Base64_map.indexOf(input.charAt(i++));
    e2 = Base64_map.indexOf(input.charAt(i++));
    c1 = e1 << 2 | e2 >> 4;
    o += String.fromCharCode(c1);
    e3 = Base64_map.indexOf(input.charAt(i++));
    c2 = (e2 & 15) << 4 | e3 >> 2;
    if (e3 !== 64) {
      o += String.fromCharCode(c2);
    }
    e4 = Base64_map.indexOf(input.charAt(i++));
    c3 = (e3 & 3) << 6 | e4;
    if (e4 !== 64) {
      o += String.fromCharCode(c3);
    }
  }
  return o;
}
var has_buf = /*#__PURE__*/(function() { return typeof Buffer !== 'undefined' && typeof process !== 'undefined' && typeof process.versions !== 'undefined' && !!process.versions.node; })();

var Buffer_from = /*#__PURE__*/(function() {
	if(typeof Buffer !== 'undefined') {
		var nbfs = !Buffer.from;
		if(!nbfs) try { Buffer.from("foo", "utf8"); } catch(e) { nbfs = true; }
		return nbfs ? function(buf, enc) { return (enc) ? new Buffer(buf, enc) : new Buffer(buf); } : Buffer.from.bind(Buffer);
	}
	return function() {};
})();
var buf_utf16le = /*#__PURE__*/(function() {
	if(typeof Buffer === 'undefined') return false;
	var x = Buffer_from([65,0]);
	if(!x) return false;
	var o = x.toString("utf16le");
	return o.length == 1;
})();


function new_raw_buf(len/*:number*/) {
	/* jshint -W056 */
	if(has_buf) return Buffer.alloc ? Buffer.alloc(len) : new Buffer(len);
	return typeof Uint8Array != "undefined" ? new Uint8Array(len) : new Array(len);
	/* jshint +W056 */
}

function new_unsafe_buf(len/*:number*/) {
	/* jshint -W056 */
	if(has_buf) return Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : new Buffer(len);
	return typeof Uint8Array != "undefined" ? new Uint8Array(len) : new Array(len);
	/* jshint +W056 */
}

var s2a = function s2a(s/*:string*/)/*:any*/ {
	if(has_buf) return Buffer_from(s, "binary");
	return s.split("").map(function(x/*:string*/)/*:number*/{ return x.charCodeAt(0) & 0xff; });
};

function s2ab(s/*:string*/)/*:any*/ {
	if(typeof ArrayBuffer === 'undefined') return s2a(s);
	var buf = new ArrayBuffer(s.length), view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function a2s(data/*:any*/)/*:string*/ {
	if(Array.isArray(data)) return data.map(function(c) { return String.fromCharCode(c); }).join("");
	var o/*:Array<string>*/ = []; for(var i = 0; i < data.length; ++i) o[i] = String.fromCharCode(data[i]); return o.join("");
}

function a2u(data/*:Array<number>*/)/*:Uint8Array*/ {
	if(typeof Uint8Array === 'undefined') throw new Error("Unsupported");
	return new Uint8Array(data);
}

function ab2a(data/*:ArrayBuffer|Uint8Array*/)/*:Array<number>*/ {
	if(typeof ArrayBuffer == 'undefined') throw new Error("Unsupported");
	if(data instanceof ArrayBuffer) return ab2a(new Uint8Array(data));
	/*:: if(data instanceof ArrayBuffer) throw new Error("unreachable"); */
	var o = new Array(data.length);
	for(var i = 0; i < data.length; ++i) o[i] = data[i];
	return o;
}

var bconcat = has_buf ? function(bufs) { return Buffer.concat(bufs.map(function(buf) { return Buffer.isBuffer(buf) ? buf : Buffer_from(buf); })); } : function(bufs) {
	if(typeof Uint8Array !== "undefined") {
		var i = 0, maxlen = 0;
		for(i = 0; i < bufs.length; ++i) maxlen += bufs[i].length;
		var o = new Uint8Array(maxlen);
		var len = 0;
		for(i = 0, maxlen = 0; i < bufs.length; maxlen += len, ++i) {
			len = bufs[i].length;
			if(bufs[i] instanceof Uint8Array) o.set(bufs[i], maxlen);
			else if(typeof bufs[i] == "string") o.set(new Uint8Array(s2a(bufs[i])), maxlen);
			else o.set(new Uint8Array(bufs[i]), maxlen);
		}
		return o;
	}
	return [].concat.apply([], bufs.map(function(buf) { return Array.isArray(buf) ? buf : [].slice.call(buf); }));
};

function utf8decode(content/*:string*/) {
	var out = [], widx = 0, L = content.length + 250;
	var o = new_raw_buf(content.length + 255);
	for(var ridx = 0; ridx < content.length; ++ridx) {
		var c = content.charCodeAt(ridx);
		if(c < 0x80) o[widx++] = c;
		else if(c < 0x800) {
			o[widx++] = (192|((c>>6)&31));
			o[widx++] = (128|(c&63));
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64;
			var d = content.charCodeAt(++ridx)&1023;
			o[widx++] = (240|((c>>8)&7));
			o[widx++] = (128|((c>>2)&63));
			o[widx++] = (128|((d>>6)&15)|((c&3)<<4));
			o[widx++] = (128|(d&63));
		} else {
			o[widx++] = (224|((c>>12)&15));
			o[widx++] = (128|((c>>6)&63));
			o[widx++] = (128|(c&63));
		}
		if(widx > L) {
			out.push(o.slice(0, widx));
			widx = 0;
			o = new_raw_buf(65535);
			L = 65530;
		}
	}
	out.push(o.slice(0, widx));
	return bconcat(out);
}

var chr0 = /\u0000/g, chr1 = /[\u0001-\u0006]/g;
/*::
declare type Block = any;
declare type BufArray = {
	newblk(sz:number):Block;
	next(sz:number):Block;
	end():any;
	push(buf:Block):void;
};

type RecordHopperCB = {(d:any, Rn:string, RT:number):?boolean;};

type EvertType = {[string]:string};
type EvertNumType = {[string]:number};
type EvertArrType = {[string]:Array<string>};

type StringConv = {(string):string};

*/
/* ssf.js (C) 2013-present SheetJS -- http://sheetjs.com */
/*jshint -W041 */
function _strrev(x/*:string*/)/*:string*/ { var o = "", i = x.length-1; while(i>=0) o += x.charAt(i--); return o; }
function pad0(v/*:any*/,d/*:number*/)/*:string*/{var t=""+v; return t.length>=d?t:fill('0',d-t.length)+t;}
function pad_(v/*:any*/,d/*:number*/)/*:string*/{var t=""+v;return t.length>=d?t:fill(' ',d-t.length)+t;}
function rpad_(v/*:any*/,d/*:number*/)/*:string*/{var t=""+v; return t.length>=d?t:t+fill(' ',d-t.length);}
function pad0r1(v/*:any*/,d/*:number*/)/*:string*/{var t=""+Math.round(v); return t.length>=d?t:fill('0',d-t.length)+t;}
function pad0r2(v/*:any*/,d/*:number*/)/*:string*/{var t=""+v; return t.length>=d?t:fill('0',d-t.length)+t;}
var p2_32 = /*#__PURE__*/Math.pow(2,32);
function pad0r(v/*:any*/,d/*:number*/)/*:string*/{if(v>p2_32||v<-p2_32) return pad0r1(v,d); var i = Math.round(v); return pad0r2(i,d); }
/* yes, in 2022 this is still faster than string compare */
function SSF_isgeneral(s/*:string*/, i/*:?number*/)/*:boolean*/ { i = i || 0; return s.length >= 7 + i && (s.charCodeAt(i)|32) === 103 && (s.charCodeAt(i+1)|32) === 101 && (s.charCodeAt(i+2)|32) === 110 && (s.charCodeAt(i+3)|32) === 101 && (s.charCodeAt(i+4)|32) === 114 && (s.charCodeAt(i+5)|32) === 97 && (s.charCodeAt(i+6)|32) === 108; }
var days/*:Array<Array<string> >*/ = [
	['Sun', 'Sunday'],
	['Mon', 'Monday'],
	['Tue', 'Tuesday'],
	['Wed', 'Wednesday'],
	['Thu', 'Thursday'],
	['Fri', 'Friday'],
	['Sat', 'Saturday']
];
var months/*:Array<Array<string> >*/ = [
	['J', 'Jan', 'January'],
	['F', 'Feb', 'February'],
	['M', 'Mar', 'March'],
	['A', 'Apr', 'April'],
	['M', 'May', 'May'],
	['J', 'Jun', 'June'],
	['J', 'Jul', 'July'],
	['A', 'Aug', 'August'],
	['S', 'Sep', 'September'],
	['O', 'Oct', 'October'],
	['N', 'Nov', 'November'],
	['D', 'Dec', 'December']
];
function SSF_init_table(t/*:any*/) {
	if(!t) t = {};
	t[0]=  'General';
	t[1]=  '0';
	t[2]=  '0.00';
	t[3]=  '#,##0';
	t[4]=  '#,##0.00';
	t[9]=  '0%';
	t[10]= '0.00%';
	t[11]= '0.00E+00';
	t[12]= '# ?/?';
	t[13]= '# ??/??';
	t[14]= 'm/d/yy';
	t[15]= 'd-mmm-yy';
	t[16]= 'd-mmm';
	t[17]= 'mmm-yy';
	t[18]= 'h:mm AM/PM';
	t[19]= 'h:mm:ss AM/PM';
	t[20]= 'h:mm';
	t[21]= 'h:mm:ss';
	t[22]= 'm/d/yy h:mm';
	t[37]= '#,##0 ;(#,##0)';
	t[38]= '#,##0 ;[Red](#,##0)';
	t[39]= '#,##0.00;(#,##0.00)';
	t[40]= '#,##0.00;[Red](#,##0.00)';
	t[45]= 'mm:ss';
	t[46]= '[h]:mm:ss';
	t[47]= 'mmss.0';
	t[48]= '##0.0E+0';
	t[49]= '@';
	t[56]= '"上午/下午 "hh"時"mm"分"ss"秒 "';
	return t;
}
/* repeated to satiate webpack */
var table_fmt = {
	0:  'General',
	1:  '0',
	2:  '0.00',
	3:  '#,##0',
	4:  '#,##0.00',
	9:  '0%',
	10: '0.00%',
	11: '0.00E+00',
	12: '# ?/?',
	13: '# ??/??',
	14: 'm/d/yy',
	15: 'd-mmm-yy',
	16: 'd-mmm',
	17: 'mmm-yy',
	18: 'h:mm AM/PM',
	19: 'h:mm:ss AM/PM',
	20: 'h:mm',
	21: 'h:mm:ss',
	22: 'm/d/yy h:mm',
	37: '#,##0 ;(#,##0)',
	38: '#,##0 ;[Red](#,##0)',
	39: '#,##0.00;(#,##0.00)',
	40: '#,##0.00;[Red](#,##0.00)',
	45: 'mm:ss',
	46: '[h]:mm:ss',
	47: 'mmss.0',
	48: '##0.0E+0',
	49: '@',
	56: '"上午/下午 "hh"時"mm"分"ss"秒 "'
};

/* Defaults determined by systematically testing in Excel 2019 */

/* These formats appear to default to other formats in the table */
var SSF_default_map = {
	5:  37, 6:  38, 7:  39, 8:  40,         //  5 -> 37 ...  8 -> 40

	23:  0, 24:  0, 25:  0, 26:  0,         // 23 ->  0 ... 26 ->  0

	27: 14, 28: 14, 29: 14, 30: 14, 31: 14, // 27 -> 14 ... 31 -> 14

	50: 14, 51: 14, 52: 14, 53: 14, 54: 14, // 50 -> 14 ... 58 -> 14
	55: 14, 56: 14, 57: 14, 58: 14,
	59:  1, 60:  2, 61:  3, 62:  4,         // 59 ->  1 ... 62 ->  4

	67:  9, 68: 10,                         // 67 ->  9 ... 68 -> 10
	69: 12, 70: 13, 71: 14,                 // 69 -> 12 ... 71 -> 14
	72: 14, 73: 15, 74: 16, 75: 17,         // 72 -> 14 ... 75 -> 17
	76: 20, 77: 21, 78: 22,                 // 76 -> 20 ... 78 -> 22
	79: 45, 80: 46, 81: 47,                 // 79 -> 45 ... 81 -> 47
	82: 0                                   // 82 ->  0 ... 65536 -> 0 (omitted)
};


/* These formats technically refer to Accounting formats with no equivalent */
var SSF_default_str = {
	//  5 -- Currency,   0 decimal, black negative
	5:  '"$"#,##0_);\\("$"#,##0\\)',
	63: '"$"#,##0_);\\("$"#,##0\\)',

	//  6 -- Currency,   0 decimal, red   negative
	6:  '"$"#,##0_);[Red]\\("$"#,##0\\)',
	64: '"$"#,##0_);[Red]\\("$"#,##0\\)',

	//  7 -- Currency,   2 decimal, black negative
	7:  '"$"#,##0.00_);\\("$"#,##0.00\\)',
	65: '"$"#,##0.00_);\\("$"#,##0.00\\)',

	//  8 -- Currency,   2 decimal, red   negative
	8:  '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
	66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',

	// 41 -- Accounting, 0 decimal, No Symbol
	41: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',

	// 42 -- Accounting, 0 decimal, $  Symbol
	42: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',

	// 43 -- Accounting, 2 decimal, No Symbol
	43: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',

	// 44 -- Accounting, 2 decimal, $  Symbol
	44: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)'
};

function SSF_frac(x/*:number*/, D/*:number*/, mixed/*:?boolean*/)/*:Array<number>*/ {
	var sgn = x < 0 ? -1 : 1;
	var B = x * sgn;
	var P_2 = 0, P_1 = 1, P = 0;
	var Q_2 = 1, Q_1 = 0, Q = 0;
	var A = Math.floor(B);
	while(Q_1 < D) {
		A = Math.floor(B);
		P = A * P_1 + P_2;
		Q = A * Q_1 + Q_2;
		if((B - A) < 0.00000005) break;
		B = 1 / (B - A);
		P_2 = P_1; P_1 = P;
		Q_2 = Q_1; Q_1 = Q;
	}
	if(Q > D) { if(Q_1 > D) { Q = Q_2; P = P_2; } else { Q = Q_1; P = P_1; } }
	if(!mixed) return [0, sgn * P, Q];
	var q = Math.floor(sgn * P/Q);
	return [q, sgn*P - q*Q, Q];
}
function SSF_parse_date_code(v/*:number*/,opts/*:?any*/,b2/*:?boolean*/) {
	if(v > 2958465 || v < 0) return null;
	var date = (v|0), time = Math.floor(86400 * (v - date)), dow=0;
	var dout=[];
	var out={D:date, T:time, u:86400*(v-date)-time,y:0,m:0,d:0,H:0,M:0,S:0,q:0};
	if(Math.abs(out.u) < 1e-6) out.u = 0;
	if(opts && opts.date1904) date += 1462;
	if(out.u > 0.9999) {
		out.u = 0;
		if(++time == 86400) { out.T = time = 0; ++date; ++out.D; }
	}
	if(date === 60) {dout = b2 ? [1317,10,29] : [1900,2,29]; dow=3;}
	else if(date === 0) {dout = b2 ? [1317,8,29] : [1900,1,0]; dow=6;}
	else {
		if(date > 60) --date;
		/* 1 = Jan 1 1900 in Gregorian */
		var d = new Date(1900, 0, 1);
		d.setDate(d.getDate() + date - 1);
		dout = [d.getFullYear(), d.getMonth()+1,d.getDate()];
		dow = d.getDay();
		if(date < 60) dow = (dow + 6) % 7;
		if(b2) dow = SSF_fix_hijri(d, dout);
	}
	out.y = dout[0]; out.m = dout[1]; out.d = dout[2];
	out.S = time % 60; time = Math.floor(time / 60);
	out.M = time % 60; time = Math.floor(time / 60);
	out.H = time;
	out.q = dow;
	return out;
}
var SSFbasedate = /*#__PURE__*/new Date(1899, 11, 31, 0, 0, 0);
var SSFdnthresh = /*#__PURE__*/SSFbasedate.getTime();
var SSFbase1904 = /*#__PURE__*/new Date(1900, 2, 1, 0, 0, 0);
function datenum_local(v/*:Date*/, date1904/*:?boolean*/)/*:number*/ {
	var epoch = /*#__PURE__*/v.getTime();
	if(date1904) epoch -= 1461*24*60*60*1000;
	else if(v >= SSFbase1904) epoch += 24*60*60*1000;
	return (epoch - (SSFdnthresh + (/*#__PURE__*/v.getTimezoneOffset() - /*#__PURE__*/SSFbasedate.getTimezoneOffset()) * 60000)) / (24 * 60 * 60 * 1000);
}
/* ECMA-376 18.8.30 numFmt*/
/* Note: `toPrecision` uses standard form when prec > E and E >= -6 */
/* exponent >= -9 and <= 9 */
function SSF_strip_decimal(o/*:string*/)/*:string*/ {
	return (o.indexOf(".") == -1) ? o : o.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}

/* General Exponential always shows 2 digits exp and trims the mantissa */
function SSF_normalize_exp(o/*:string*/)/*:string*/ {
	if(o.indexOf("E") == -1) return o;
	return o.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/,"$1E").replace(/(E[+-])(\d)$/,"$10$2");
}

/* exponent >= -9 and <= 9 */
function SSF_small_exp(v/*:number*/)/*:string*/ {
	var w = (v<0?12:11);
	var o = SSF_strip_decimal(v.toFixed(12)); if(o.length <= w) return o;
	o = v.toPrecision(10); if(o.length <= w) return o;
	return v.toExponential(5);
}

/* exponent >= 11 or <= -10 likely exponential */
function SSF_large_exp(v/*:number*/)/*:string*/ {
	var o = SSF_strip_decimal(v.toFixed(11));
	return (o.length > (v<0?12:11) || o === "0" || o === "-0") ? v.toPrecision(6) : o;
}

function SSF_general_num(v/*:number*/)/*:string*/ {
	var V = Math.floor(Math.log(Math.abs(v))*Math.LOG10E), o;

	if(V >= -4 && V <= -1) o = v.toPrecision(10+V);
	else if(Math.abs(V) <= 9) o = SSF_small_exp(v);
	else if(V === 10) o = v.toFixed(10).substr(0,12);
	else o = SSF_large_exp(v);

	return SSF_strip_decimal(SSF_normalize_exp(o.toUpperCase()));
}


/*
	"General" rules:
	- text is passed through ("@")
	- booleans are rendered as TRUE/FALSE
	- "up to 11 characters" displayed for numbers
	- Default date format (code 14) used for Dates

	The longest 32-bit integer text is "-2147483648", exactly 11 chars
	TODO: technically the display depends on the width of the cell
*/
function SSF_general(v/*:any*/, opts/*:any*/) {
	switch(typeof v) {
		case 'string': return v;
		case 'boolean': return v ? "TRUE" : "FALSE";
		case 'number': return (v|0) === v ? v.toString(10) : SSF_general_num(v);
		case 'undefined': return "";
		case 'object':
			if(v == null) return "";
			if(v instanceof Date) return SSF_format(14, datenum_local(v, opts && opts.date1904), opts);
	}
	throw new Error("unsupported value in General format: " + v);
}

function SSF_fix_hijri(date/*:Date*/, o/*:[number, number, number]*/) {
  /* TODO: properly adjust y/m/d and  */
  o[0] -= 581;
  var dow = date.getDay();
  if(date < 60) dow = (dow + 6) % 7;
  return dow;
}
//var THAI_DIGITS = "\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59".split("");
function SSF_write_date(type/*:number*/, fmt/*:string*/, val, ss0/*:?number*/)/*:string*/ {
	var o="", ss=0, tt=0, y = val.y, out, outl = 0;
	switch(type) {
		case 98: /* 'b' buddhist year */
			y = val.y + 543;
			/* falls through */
		case 121: /* 'y' year */
		switch(fmt.length) {
			case 1: case 2: out = y % 100; outl = 2; break;
			default: out = y % 10000; outl = 4; break;
		} break;
		case 109: /* 'm' month */
		switch(fmt.length) {
			case 1: case 2: out = val.m; outl = fmt.length; break;
			case 3: return months[val.m-1][1];
			case 5: return months[val.m-1][0];
			default: return months[val.m-1][2];
		} break;
		case 100: /* 'd' day */
		switch(fmt.length) {
			case 1: case 2: out = val.d; outl = fmt.length; break;
			case 3: return days[val.q][0];
			default: return days[val.q][1];
		} break;
		case 104: /* 'h' 12-hour */
		switch(fmt.length) {
			case 1: case 2: out = 1+(val.H+11)%12; outl = fmt.length; break;
			default: throw 'bad hour format: ' + fmt;
		} break;
		case 72: /* 'H' 24-hour */
		switch(fmt.length) {
			case 1: case 2: out = val.H; outl = fmt.length; break;
			default: throw 'bad hour format: ' + fmt;
		} break;
		case 77: /* 'M' minutes */
		switch(fmt.length) {
			case 1: case 2: out = val.M; outl = fmt.length; break;
			default: throw 'bad minute format: ' + fmt;
		} break;
		case 115: /* 's' seconds */
			if(fmt != 's' && fmt != 'ss' && fmt != '.0' && fmt != '.00' && fmt != '.000') throw 'bad second format: ' + fmt;
			if(val.u === 0 && (fmt == "s" || fmt == "ss")) return pad0(val.S, fmt.length);
			/*::if(!ss0) ss0 = 0; */
			if(ss0 >= 2) tt = ss0 === 3 ? 1000 : 100;
			else tt = ss0 === 1 ? 10 : 1;
			ss = Math.round((tt)*(val.S + val.u));
			if(ss >= 60*tt) ss = 0;
			if(fmt === 's') return ss === 0 ? "0" : ""+ss/tt;
			o = pad0(ss,2 + ss0);
			if(fmt === 'ss') return o.substr(0,2);
			return "." + o.substr(2,fmt.length-1);
		case 90: /* 'Z' absolute time */
		switch(fmt) {
			case '[h]': case '[hh]': out = val.D*24+val.H; break;
			case '[m]': case '[mm]': out = (val.D*24+val.H)*60+val.M; break;
			case '[s]': case '[ss]': out = ((val.D*24+val.H)*60+val.M)*60+Math.round(val.S+val.u); break;
			default: throw 'bad abstime format: ' + fmt;
		} outl = fmt.length === 3 ? 1 : 2; break;
		case 101: /* 'e' era */
			out = y; outl = 1; break;
	}
	var outstr = outl > 0 ? pad0(out, outl) : "";
	return outstr;
}


/*jshint -W086 */
/*jshint +W086 */
function commaify(s/*:string*/)/*:string*/ {
	var w = 3;
	if(s.length <= w) return s;
	var j = (s.length % w), o = s.substr(0,j);
	for(; j!=s.length; j+=w) o+=(o.length > 0 ? "," : "") + s.substr(j,w);
	return o;
}
var pct1 = /%/g;
function write_num_pct(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/{
	var sfmt = fmt.replace(pct1,""), mul = fmt.length - sfmt.length;
	return write_num(type, sfmt, val * Math.pow(10,2*mul)) + fill("%",mul);
}

function write_num_cm(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/{
	var idx = fmt.length - 1;
	while(fmt.charCodeAt(idx-1) === 44) --idx;
	return write_num(type, fmt.substr(0,idx), val / Math.pow(10,3*(fmt.length-idx)));
}

function write_num_exp(fmt/*:string*/, val/*:number*/)/*:string*/{
	var o/*:string*/;
	var idx = fmt.indexOf("E") - fmt.indexOf(".") - 1;
	if(fmt.match(/^#+0.0E\+0$/)) {
		if(val == 0) return "0.0E+0";
		else if(val < 0) return "-" + write_num_exp(fmt, -val);
		var period = fmt.indexOf("."); if(period === -1) period=fmt.indexOf('E');
		var ee = Math.floor(Math.log(val)*Math.LOG10E)%period;
		if(ee < 0) ee += period;
		o = (val/Math.pow(10,ee)).toPrecision(idx+1+(period+ee)%period);
		if(o.indexOf("e") === -1) {
			var fakee = Math.floor(Math.log(val)*Math.LOG10E);
			if(o.indexOf(".") === -1) o = o.charAt(0) + "." + o.substr(1) + "E+" + (fakee - o.length+ee);
			else o += "E+" + (fakee - ee);
			while(o.substr(0,2) === "0.") {
				o = o.charAt(0) + o.substr(2,period) + "." + o.substr(2+period);
				o = o.replace(/^0+([1-9])/,"$1").replace(/^0+\./,"0.");
			}
			o = o.replace(/\+-/,"-");
		}
		o = o.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/,function($$,$1,$2,$3) { return $1 + $2 + $3.substr(0,(period+ee)%period) + "." + $3.substr(ee) + "E"; });
	} else o = val.toExponential(idx);
	if(fmt.match(/E\+00$/) && o.match(/e[+-]\d$/)) o = o.substr(0,o.length-1) + "0" + o.charAt(o.length-1);
	if(fmt.match(/E\-/) && o.match(/e\+/)) o = o.replace(/e\+/,"e");
	return o.replace("e","E");
}
var frac1 = /# (\?+)( ?)\/( ?)(\d+)/;
function write_num_f1(r/*:Array<string>*/, aval/*:number*/, sign/*:string*/)/*:string*/ {
	var den = parseInt(r[4],10), rr = Math.round(aval * den), base = Math.floor(rr/den);
	var myn = (rr - base*den), myd = den;
	return sign + (base === 0 ? "" : ""+base) + " " + (myn === 0 ? fill(" ", r[1].length + 1 + r[4].length) : pad_(myn,r[1].length) + r[2] + "/" + r[3] + pad0(myd,r[4].length));
}
function write_num_f2(r/*:Array<string>*/, aval/*:number*/, sign/*:string*/)/*:string*/ {
	return sign + (aval === 0 ? "" : ""+aval) + fill(" ", r[1].length + 2 + r[4].length);
}
var dec1 = /^#*0*\.([0#]+)/;
var closeparen = /\).*[0#]/;
var phone = /\(###\) ###\\?-####/;
function hashq(str/*:string*/)/*:string*/ {
	var o = "", cc;
	for(var i = 0; i != str.length; ++i) switch((cc=str.charCodeAt(i))) {
		case 35: break;
		case 63: o+= " "; break;
		case 48: o+= "0"; break;
		default: o+= String.fromCharCode(cc);
	}
	return o;
}
function rnd(val/*:number*/, d/*:number*/)/*:string*/ { var dd = Math.pow(10,d); return ""+(Math.round(val * dd)/dd); }
function dec(val/*:number*/, d/*:number*/)/*:number*/ {
	var _frac = val - Math.floor(val), dd = Math.pow(10,d);
	if (d < ('' + Math.round(_frac * dd)).length) return 0;
	return Math.round(_frac * dd);
}
function carry(val/*:number*/, d/*:number*/)/*:number*/ {
	if (d < ('' + Math.round((val-Math.floor(val))*Math.pow(10,d))).length) {
		return 1;
	}
	return 0;
}
function flr(val/*:number*/)/*:string*/ {
	if(val < 2147483647 && val > -2147483648) return ""+(val >= 0 ? (val|0) : (val-1|0));
	return ""+Math.floor(val);
}
function write_num_flt(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/ {
	if(type.charCodeAt(0) === 40 && !fmt.match(closeparen)) {
		var ffmt = fmt.replace(/\( */,"").replace(/ \)/,"").replace(/\)/,"");
		if(val >= 0) return write_num_flt('n', ffmt, val);
		return '(' + write_num_flt('n', ffmt, -val) + ')';
	}
	if(fmt.charCodeAt(fmt.length - 1) === 44) return write_num_cm(type, fmt, val);
	if(fmt.indexOf('%') !== -1) return write_num_pct(type, fmt, val);
	if(fmt.indexOf('E') !== -1) return write_num_exp(fmt, val);
	if(fmt.charCodeAt(0) === 36) return "$"+write_num_flt(type,fmt.substr(fmt.charAt(1)==' '?2:1),val);
	var o;
	var r/*:?Array<string>*/, ri, ff, aval = Math.abs(val), sign = val < 0 ? "-" : "";
	if(fmt.match(/^00+$/)) return sign + pad0r(aval,fmt.length);
	if(fmt.match(/^[#?]+$/)) {
		o = pad0r(val,0); if(o === "0") o = "";
		return o.length > fmt.length ? o : hashq(fmt.substr(0,fmt.length-o.length)) + o;
	}
	if((r = fmt.match(frac1))) return write_num_f1(r, aval, sign);
	if(fmt.match(/^#+0+$/)) return sign + pad0r(aval,fmt.length - fmt.indexOf("0"));
	if((r = fmt.match(dec1))) {
		o = rnd(val, r[1].length).replace(/^([^\.]+)$/,"$1."+hashq(r[1])).replace(/\.$/,"."+hashq(r[1])).replace(/\.(\d*)$/,function($$, $1) { return "." + $1 + fill("0", hashq(/*::(*/r/*::||[""])*/[1]).length-$1.length); });
		return fmt.indexOf("0.") !== -1 ? o : o.replace(/^0\./,".");
	}
	fmt = fmt.replace(/^#+([0.])/, "$1");
	if((r = fmt.match(/^(0*)\.(#*)$/))) {
		return sign + rnd(aval, r[2].length).replace(/\.(\d*[1-9])0*$/,".$1").replace(/^(-?\d*)$/,"$1.").replace(/^0\./,r[1].length?"0.":".");
	}
	if((r = fmt.match(/^#{1,3},##0(\.?)$/))) return sign + commaify(pad0r(aval,0));
	if((r = fmt.match(/^#,##0\.([#0]*0)$/))) {
		return val < 0 ? "-" + write_num_flt(type, fmt, -val) : commaify(""+(Math.floor(val) + carry(val, r[1].length))) + "." + pad0(dec(val, r[1].length),r[1].length);
	}
	if((r = fmt.match(/^#,#*,#0/))) return write_num_flt(type,fmt.replace(/^#,#*,/,""),val);
	if((r = fmt.match(/^([0#]+)(\\?-([0#]+))+$/))) {
		o = _strrev(write_num_flt(type, fmt.replace(/[\\-]/g,""), val));
		ri = 0;
		return _strrev(_strrev(fmt.replace(/\\/g,"")).replace(/[0#]/g,function(x){return ri<o.length?o.charAt(ri++):x==='0'?'0':"";}));
	}
	if(fmt.match(phone)) {
		o = write_num_flt(type, "##########", val);
		return "(" + o.substr(0,3) + ") " + o.substr(3, 3) + "-" + o.substr(6);
	}
	var oa = "";
	if((r = fmt.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))) {
		ri = Math.min(/*::String(*/r[4]/*::)*/.length,7);
		ff = SSF_frac(aval, Math.pow(10,ri)-1, false);
		o = "" + sign;
		oa = write_num("n", /*::String(*/r[1]/*::)*/, ff[1]);
		if(oa.charAt(oa.length-1) == " ") oa = oa.substr(0,oa.length-1) + "0";
		o += oa + /*::String(*/r[2]/*::)*/ + "/" + /*::String(*/r[3]/*::)*/;
		oa = rpad_(ff[2],ri);
		if(oa.length < r[4].length) oa = hashq(r[4].substr(r[4].length-oa.length)) + oa;
		o += oa;
		return o;
	}
	if((r = fmt.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))) {
		ri = Math.min(Math.max(r[1].length, r[4].length),7);
		ff = SSF_frac(aval, Math.pow(10,ri)-1, true);
		return sign + (ff[0]||(ff[1] ? "" : "0")) + " " + (ff[1] ? pad_(ff[1],ri) + r[2] + "/" + r[3] + rpad_(ff[2],ri): fill(" ", 2*ri+1 + r[2].length + r[3].length));
	}
	if((r = fmt.match(/^[#0?]+$/))) {
		o = pad0r(val, 0);
		if(fmt.length <= o.length) return o;
		return hashq(fmt.substr(0,fmt.length-o.length)) + o;
	}
	if((r = fmt.match(/^([#0?]+)\.([#0]+)$/))) {
		o = "" + val.toFixed(Math.min(r[2].length,10)).replace(/([^0])0+$/,"$1");
		ri = o.indexOf(".");
		var lres = fmt.indexOf(".") - ri, rres = fmt.length - o.length - lres;
		return hashq(fmt.substr(0,lres) + o + fmt.substr(fmt.length-rres));
	}
	if((r = fmt.match(/^00,000\.([#0]*0)$/))) {
		ri = dec(val, r[1].length);
		return val < 0 ? "-" + write_num_flt(type, fmt, -val) : commaify(flr(val)).replace(/^\d,\d{3}$/,"0$&").replace(/^\d*$/,function($$) { return "00," + ($$.length < 3 ? pad0(0,3-$$.length) : "") + $$; }) + "." + pad0(ri,r[1].length);
	}
	switch(fmt) {
		case "###,##0.00": return write_num_flt(type, "#,##0.00", val);
		case "###,###":
		case "##,###":
		case "#,###": var x = commaify(pad0r(aval,0)); return x !== "0" ? sign + x : "";
		case "###,###.00": return write_num_flt(type, "###,##0.00",val).replace(/^0\./,".");
		case "#,###.00": return write_num_flt(type, "#,##0.00",val).replace(/^0\./,".");
	}
	throw new Error("unsupported format |" + fmt + "|");
}
function write_num_cm2(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/{
	var idx = fmt.length - 1;
	while(fmt.charCodeAt(idx-1) === 44) --idx;
	return write_num(type, fmt.substr(0,idx), val / Math.pow(10,3*(fmt.length-idx)));
}
function write_num_pct2(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/{
	var sfmt = fmt.replace(pct1,""), mul = fmt.length - sfmt.length;
	return write_num(type, sfmt, val * Math.pow(10,2*mul)) + fill("%",mul);
}
function write_num_exp2(fmt/*:string*/, val/*:number*/)/*:string*/{
	var o/*:string*/;
	var idx = fmt.indexOf("E") - fmt.indexOf(".") - 1;
	if(fmt.match(/^#+0.0E\+0$/)) {
		if(val == 0) return "0.0E+0";
		else if(val < 0) return "-" + write_num_exp2(fmt, -val);
		var period = fmt.indexOf("."); if(period === -1) period=fmt.indexOf('E');
		var ee = Math.floor(Math.log(val)*Math.LOG10E)%period;
		if(ee < 0) ee += period;
		o = (val/Math.pow(10,ee)).toPrecision(idx+1+(period+ee)%period);
		if(!o.match(/[Ee]/)) {
			var fakee = Math.floor(Math.log(val)*Math.LOG10E);
			if(o.indexOf(".") === -1) o = o.charAt(0) + "." + o.substr(1) + "E+" + (fakee - o.length+ee);
			else o += "E+" + (fakee - ee);
			o = o.replace(/\+-/,"-");
		}
		o = o.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/,function($$,$1,$2,$3) { return $1 + $2 + $3.substr(0,(period+ee)%period) + "." + $3.substr(ee) + "E"; });
	} else o = val.toExponential(idx);
	if(fmt.match(/E\+00$/) && o.match(/e[+-]\d$/)) o = o.substr(0,o.length-1) + "0" + o.charAt(o.length-1);
	if(fmt.match(/E\-/) && o.match(/e\+/)) o = o.replace(/e\+/,"e");
	return o.replace("e","E");
}
function write_num_int(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/ {
	if(type.charCodeAt(0) === 40 && !fmt.match(closeparen)) {
		var ffmt = fmt.replace(/\( */,"").replace(/ \)/,"").replace(/\)/,"");
		if(val >= 0) return write_num_int('n', ffmt, val);
		return '(' + write_num_int('n', ffmt, -val) + ')';
	}
	if(fmt.charCodeAt(fmt.length - 1) === 44) return write_num_cm2(type, fmt, val);
	if(fmt.indexOf('%') !== -1) return write_num_pct2(type, fmt, val);
	if(fmt.indexOf('E') !== -1) return write_num_exp2(fmt, val);
	if(fmt.charCodeAt(0) === 36) return "$"+write_num_int(type,fmt.substr(fmt.charAt(1)==' '?2:1),val);
	var o;
	var r/*:?Array<string>*/, ri, ff, aval = Math.abs(val), sign = val < 0 ? "-" : "";
	if(fmt.match(/^00+$/)) return sign + pad0(aval,fmt.length);
	if(fmt.match(/^[#?]+$/)) {
		o = (""+val); if(val === 0) o = "";
		return o.length > fmt.length ? o : hashq(fmt.substr(0,fmt.length-o.length)) + o;
	}
	if((r = fmt.match(frac1))) return write_num_f2(r, aval, sign);
	if(fmt.match(/^#+0+$/)) return sign + pad0(aval,fmt.length - fmt.indexOf("0"));
	if((r = fmt.match(dec1))) {
		/*:: if(!Array.isArray(r)) throw new Error("unreachable"); */
		o = (""+val).replace(/^([^\.]+)$/,"$1."+hashq(r[1])).replace(/\.$/,"."+hashq(r[1]));
		o = o.replace(/\.(\d*)$/,function($$, $1) {
		/*:: if(!Array.isArray(r)) throw new Error("unreachable"); */
			return "." + $1 + fill("0", hashq(r[1]).length-$1.length); });
		return fmt.indexOf("0.") !== -1 ? o : o.replace(/^0\./,".");
	}
	fmt = fmt.replace(/^#+([0.])/, "$1");
	if((r = fmt.match(/^(0*)\.(#*)$/))) {
		return sign + (""+aval).replace(/\.(\d*[1-9])0*$/,".$1").replace(/^(-?\d*)$/,"$1.").replace(/^0\./,r[1].length?"0.":".");
	}
	if((r = fmt.match(/^#{1,3},##0(\.?)$/))) return sign + commaify((""+aval));
	if((r = fmt.match(/^#,##0\.([#0]*0)$/))) {
		return val < 0 ? "-" + write_num_int(type, fmt, -val) : commaify((""+val)) + "." + fill('0',r[1].length);
	}
	if((r = fmt.match(/^#,#*,#0/))) return write_num_int(type,fmt.replace(/^#,#*,/,""),val);
	if((r = fmt.match(/^([0#]+)(\\?-([0#]+))+$/))) {
		o = _strrev(write_num_int(type, fmt.replace(/[\\-]/g,""), val));
		ri = 0;
		return _strrev(_strrev(fmt.replace(/\\/g,"")).replace(/[0#]/g,function(x){return ri<o.length?o.charAt(ri++):x==='0'?'0':"";}));
	}
	if(fmt.match(phone)) {
		o = write_num_int(type, "##########", val);
		return "(" + o.substr(0,3) + ") " + o.substr(3, 3) + "-" + o.substr(6);
	}
	var oa = "";
	if((r = fmt.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))) {
		ri = Math.min(/*::String(*/r[4]/*::)*/.length,7);
		ff = SSF_frac(aval, Math.pow(10,ri)-1, false);
		o = "" + sign;
		oa = write_num("n", /*::String(*/r[1]/*::)*/, ff[1]);
		if(oa.charAt(oa.length-1) == " ") oa = oa.substr(0,oa.length-1) + "0";
		o += oa + /*::String(*/r[2]/*::)*/ + "/" + /*::String(*/r[3]/*::)*/;
		oa = rpad_(ff[2],ri);
		if(oa.length < r[4].length) oa = hashq(r[4].substr(r[4].length-oa.length)) + oa;
		o += oa;
		return o;
	}
	if((r = fmt.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))) {
		ri = Math.min(Math.max(r[1].length, r[4].length),7);
		ff = SSF_frac(aval, Math.pow(10,ri)-1, true);
		return sign + (ff[0]||(ff[1] ? "" : "0")) + " " + (ff[1] ? pad_(ff[1],ri) + r[2] + "/" + r[3] + rpad_(ff[2],ri): fill(" ", 2*ri+1 + r[2].length + r[3].length));
	}
	if((r = fmt.match(/^[#0?]+$/))) {
		o = "" + val;
		if(fmt.length <= o.length) return o;
		return hashq(fmt.substr(0,fmt.length-o.length)) + o;
	}
	if((r = fmt.match(/^([#0]+)\.([#0]+)$/))) {
		o = "" + val.toFixed(Math.min(r[2].length,10)).replace(/([^0])0+$/,"$1");
		ri = o.indexOf(".");
		var lres = fmt.indexOf(".") - ri, rres = fmt.length - o.length - lres;
		return hashq(fmt.substr(0,lres) + o + fmt.substr(fmt.length-rres));
	}
	if((r = fmt.match(/^00,000\.([#0]*0)$/))) {
		return val < 0 ? "-" + write_num_int(type, fmt, -val) : commaify(""+val).replace(/^\d,\d{3}$/,"0$&").replace(/^\d*$/,function($$) { return "00," + ($$.length < 3 ? pad0(0,3-$$.length) : "") + $$; }) + "." + pad0(0,r[1].length);
	}
	switch(fmt) {
		case "###,###":
		case "##,###":
		case "#,###": var x = commaify(""+aval); return x !== "0" ? sign + x : "";
		default:
			if(fmt.match(/\.[0#?]*$/)) return write_num_int(type, fmt.slice(0,fmt.lastIndexOf(".")), val) + hashq(fmt.slice(fmt.lastIndexOf(".")));
	}
	throw new Error("unsupported format |" + fmt + "|");
}
function write_num(type/*:string*/, fmt/*:string*/, val/*:number*/)/*:string*/ {
	return (val|0) === val ? write_num_int(type, fmt, val) : write_num_flt(type, fmt, val);
}
function SSF_split_fmt(fmt/*:string*/)/*:Array<string>*/ {
	var out/*:Array<string>*/ = [];
	var in_str = false/*, cc*/;
	for(var i = 0, j = 0; i < fmt.length; ++i) switch((/*cc=*/fmt.charCodeAt(i))) {
		case 34: /* '"' */
			in_str = !in_str; break;
		case 95: case 42: case 92: /* '_' '*' '\\' */
			++i; break;
		case 59: /* ';' */
			out[out.length] = fmt.substr(j,i-j);
			j = i+1;
	}
	out[out.length] = fmt.substr(j);
	if(in_str === true) throw new Error("Format |" + fmt + "| unterminated string ");
	return out;
}

var SSF_abstime = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function fmt_is_date(fmt/*:string*/)/*:boolean*/ {
	var i = 0, /*cc = 0,*/ c = "", o = "";
	while(i < fmt.length) {
		switch((c = fmt.charAt(i))) {
			case 'G': if(SSF_isgeneral(fmt, i)) i+= 6; i++; break;
			case '"': for(;(/*cc=*/fmt.charCodeAt(++i)) !== 34 && i < fmt.length;){/*empty*/} ++i; break;
			case '\\': i+=2; break;
			case '_': i+=2; break;
			case '@': ++i; break;
			case 'B': case 'b':
				if(fmt.charAt(i+1) === "1" || fmt.charAt(i+1) === "2") return true;
				/* falls through */
			case 'M': case 'D': case 'Y': case 'H': case 'S': case 'E':
				/* falls through */
			case 'm': case 'd': case 'y': case 'h': case 's': case 'e': case 'g': return true;
			case 'A': case 'a': case '上':
				if(fmt.substr(i, 3).toUpperCase() === "A/P") return true;
				if(fmt.substr(i, 5).toUpperCase() === "AM/PM") return true;
				if(fmt.substr(i, 5).toUpperCase() === "上午/下午") return true;
				++i; break;
			case '[':
				o = c;
				while(fmt.charAt(i++) !== ']' && i < fmt.length) o += fmt.charAt(i);
				if(o.match(SSF_abstime)) return true;
				break;
			case '.':
				/* falls through */
			case '0': case '#':
				while(i < fmt.length && ("0#?.,E+-%".indexOf(c=fmt.charAt(++i)) > -1 || (c=='\\' && fmt.charAt(i+1) == "-" && "0#".indexOf(fmt.charAt(i+2))>-1))){/* empty */}
				break;
			case '?': while(fmt.charAt(++i) === c){/* empty */} break;
			case '*': ++i; if(fmt.charAt(i) == ' ' || fmt.charAt(i) == '*') ++i; break;
			case '(': case ')': ++i; break;
			case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
				while(i < fmt.length && "0123456789".indexOf(fmt.charAt(++i)) > -1){/* empty */} break;
			case ' ': ++i; break;
			default: ++i; break;
		}
	}
	return false;
}

function eval_fmt(fmt/*:string*/, v/*:any*/, opts/*:any*/, flen/*:number*/) {
	var out = [], o = "", i = 0, c = "", lst='t', dt, j, cc;
	var hr='H';
	/* Tokenize */
	while(i < fmt.length) {
		switch((c = fmt.charAt(i))) {
			case 'G': /* General */
				if(!SSF_isgeneral(fmt, i)) throw new Error('unrecognized character ' + c + ' in ' +fmt);
				out[out.length] = {t:'G', v:'General'}; i+=7; break;
			case '"': /* Literal text */
				for(o="";(cc=fmt.charCodeAt(++i)) !== 34 && i < fmt.length;) o += String.fromCharCode(cc);
				out[out.length] = {t:'t', v:o}; ++i; break;
			case '\\': var w = fmt.charAt(++i), t = (w === "(" || w === ")") ? w : 't';
				out[out.length] = {t:t, v:w}; ++i; break;
			case '_': out[out.length] = {t:'t', v:" "}; i+=2; break;
			case '@': /* Text Placeholder */
				out[out.length] = {t:'T', v:v}; ++i; break;
			case 'B': case 'b':
				if(fmt.charAt(i+1) === "1" || fmt.charAt(i+1) === "2") {
					if(dt==null) { dt=SSF_parse_date_code(v, opts, fmt.charAt(i+1) === "2"); if(dt==null) return ""; }
					out[out.length] = {t:'X', v:fmt.substr(i,2)}; lst = c; i+=2; break;
				}
				/* falls through */
			case 'M': case 'D': case 'Y': case 'H': case 'S': case 'E':
				c = c.toLowerCase();
				/* falls through */
			case 'm': case 'd': case 'y': case 'h': case 's': case 'e': case 'g':
				if(v < 0) return "";
				if(dt==null) { dt=SSF_parse_date_code(v, opts); if(dt==null) return ""; }
				o = c; while(++i < fmt.length && fmt.charAt(i).toLowerCase() === c) o+=c;
				if(c === 'm' && lst.toLowerCase() === 'h') c = 'M';
				if(c === 'h') c = hr;
				out[out.length] = {t:c, v:o}; lst = c; break;
			case 'A': case 'a': case '上':
				var q={t:c, v:c};
				if(dt==null) dt=SSF_parse_date_code(v, opts);
				if(fmt.substr(i, 3).toUpperCase() === "A/P") { if(dt!=null) q.v = dt.H >= 12 ? fmt.charAt(i+2) : c; q.t = 'T'; hr='h';i+=3;}
				else if(fmt.substr(i,5).toUpperCase() === "AM/PM") { if(dt!=null) q.v = dt.H >= 12 ? "PM" : "AM"; q.t = 'T'; i+=5; hr='h'; }
				else if(fmt.substr(i,5).toUpperCase() === "上午/下午") { if(dt!=null) q.v = dt.H >= 12 ? "下午" : "上午"; q.t = 'T'; i+=5; hr='h'; }
				else { q.t = "t"; ++i; }
				if(dt==null && q.t === 'T') return "";
				out[out.length] = q; lst = c; break;
			case '[':
				o = c;
				while(fmt.charAt(i++) !== ']' && i < fmt.length) o += fmt.charAt(i);
				if(o.slice(-1) !== ']') throw 'unterminated "[" block: |' + o + '|';
				if(o.match(SSF_abstime)) {
					if(dt==null) { dt=SSF_parse_date_code(v, opts); if(dt==null) return ""; }
					out[out.length] = {t:'Z', v:o.toLowerCase()};
					lst = o.charAt(1);
				} else if(o.indexOf("$") > -1) {
					o = (o.match(/\$([^-\[\]]*)/)||[])[1]||"$";
					if(!fmt_is_date(fmt)) out[out.length] = {t:'t',v:o};
				}
				break;
			/* Numbers */
			case '.':
				if(dt != null) {
					o = c; while(++i < fmt.length && (c=fmt.charAt(i)) === "0") o += c;
					out[out.length] = {t:'s', v:o}; break;
				}
				/* falls through */
			case '0': case '#':
				o = c; while(++i < fmt.length && "0#?.,E+-%".indexOf(c=fmt.charAt(i)) > -1) o += c;
				out[out.length] = {t:'n', v:o}; break;
			case '?':
				o = c; while(fmt.charAt(++i) === c) o+=c;
				out[out.length] = {t:c, v:o}; lst = c; break;
			case '*': ++i; if(fmt.charAt(i) == ' ' || fmt.charAt(i) == '*') ++i; break; // **
			case '(': case ')': out[out.length] = {t:(flen===1?'t':c), v:c}; ++i; break;
			case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
				o = c; while(i < fmt.length && "0123456789".indexOf(fmt.charAt(++i)) > -1) o+=fmt.charAt(i);
				out[out.length] = {t:'D', v:o}; break;
			case ' ': out[out.length] = {t:c, v:c}; ++i; break;
			case '$': out[out.length] = {t:'t', v:'$'}; ++i; break;
			default:
				if(",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(c) === -1) throw new Error('unrecognized character ' + c + ' in ' + fmt);
				out[out.length] = {t:'t', v:c}; ++i; break;
		}
	}

	/* Scan for date/time parts */
	var bt = 0, ss0 = 0, ssm;
	for(i=out.length-1, lst='t'; i >= 0; --i) {
		switch(out[i].t) {
			case 'h': case 'H': out[i].t = hr; lst='h'; if(bt < 1) bt = 1; break;
			case 's':
				if((ssm=out[i].v.match(/\.0+$/))) ss0=Math.max(ss0,ssm[0].length-1);
				if(bt < 3) bt = 3;
			/* falls through */
			case 'd': case 'y': case 'M': case 'e': lst=out[i].t; break;
			case 'm': if(lst === 's') { out[i].t = 'M'; if(bt < 2) bt = 2; } break;
			case 'X': /*if(out[i].v === "B2");*/
				break;
			case 'Z':
				if(bt < 1 && out[i].v.match(/[Hh]/)) bt = 1;
				if(bt < 2 && out[i].v.match(/[Mm]/)) bt = 2;
				if(bt < 3 && out[i].v.match(/[Ss]/)) bt = 3;
		}
	}
	/* time rounding depends on presence of minute / second / usec fields */
	switch(bt) {
		case 0: break;
		case 1:
			/*::if(!dt) break;*/
			if(dt.u >= 0.5) { dt.u = 0; ++dt.S; }
			if(dt.S >=  60) { dt.S = 0; ++dt.M; }
			if(dt.M >=  60) { dt.M = 0; ++dt.H; }
			break;
		case 2:
			/*::if(!dt) break;*/
			if(dt.u >= 0.5) { dt.u = 0; ++dt.S; }
			if(dt.S >=  60) { dt.S = 0; ++dt.M; }
			break;
	}

	/* replace fields */
	var nstr = "", jj;
	for(i=0; i < out.length; ++i) {
		switch(out[i].t) {
			case 't': case 'T': case ' ': case 'D': break;
			case 'X': out[i].v = ""; out[i].t = ";"; break;
			case 'd': case 'm': case 'y': case 'h': case 'H': case 'M': case 's': case 'e': case 'b': case 'Z':
				/*::if(!dt) throw "unreachable"; */
				out[i].v = SSF_write_date(out[i].t.charCodeAt(0), out[i].v, dt, ss0);
				out[i].t = 't'; break;
			case 'n': case '?':
				jj = i+1;
				while(out[jj] != null && (
					(c=out[jj].t) === "?" || c === "D" ||
					((c === " " || c === "t") && out[jj+1] != null && (out[jj+1].t === '?' || out[jj+1].t === "t" && out[jj+1].v === '/')) ||
					(out[i].t === '(' && (c === ' ' || c === 'n' || c === ')')) ||
					(c === 't' && (out[jj].v === '/' || out[jj].v === ' ' && out[jj+1] != null && out[jj+1].t == '?'))
				)) {
					out[i].v += out[jj].v;
					out[jj] = {v:"", t:";"}; ++jj;
				}
				nstr += out[i].v;
				i = jj-1; break;
			case 'G': out[i].t = 't'; out[i].v = SSF_general(v,opts); break;
		}
	}
	var vv = "", myv, ostr;
	if(nstr.length > 0) {
		if(nstr.charCodeAt(0) == 40) /* '(' */ {
			myv = (v<0&&nstr.charCodeAt(0) === 45 ? -v : v);
			ostr = write_num('n', nstr, myv);
		} else {
			myv = (v<0 && flen > 1 ? -v : v);
			ostr = write_num('n', nstr, myv);
			if(myv < 0 && out[0] && out[0].t == 't') {
				ostr = ostr.substr(1);
				out[0].v = "-" + out[0].v;
			}
		}
		jj=ostr.length-1;
		var decpt = out.length;
		for(i=0; i < out.length; ++i) if(out[i] != null && out[i].t != 't' && out[i].v.indexOf(".") > -1) { decpt = i; break; }
		var lasti=out.length;
		if(decpt === out.length && ostr.indexOf("E") === -1) {
			for(i=out.length-1; i>= 0;--i) {
				if(out[i] == null || 'n?'.indexOf(out[i].t) === -1) continue;
				if(jj>=out[i].v.length-1) { jj -= out[i].v.length; out[i].v = ostr.substr(jj+1, out[i].v.length); }
				else if(jj < 0) out[i].v = "";
				else { out[i].v = ostr.substr(0, jj+1); jj = -1; }
				out[i].t = 't';
				lasti = i;
			}
			if(jj>=0 && lasti<out.length) out[lasti].v = ostr.substr(0,jj+1) + out[lasti].v;
		}
		else if(decpt !== out.length && ostr.indexOf("E") === -1) {
			jj = ostr.indexOf(".")-1;
			for(i=decpt; i>= 0; --i) {
				if(out[i] == null || 'n?'.indexOf(out[i].t) === -1) continue;
				j=out[i].v.indexOf(".")>-1&&i===decpt?out[i].v.indexOf(".")-1:out[i].v.length-1;
				vv = out[i].v.substr(j+1);
				for(; j>=0; --j) {
					if(jj>=0 && (out[i].v.charAt(j) === "0" || out[i].v.charAt(j) === "#")) vv = ostr.charAt(jj--) + vv;
				}
				out[i].v = vv;
				out[i].t = 't';
				lasti = i;
			}
			if(jj>=0 && lasti<out.length) out[lasti].v = ostr.substr(0,jj+1) + out[lasti].v;
			jj = ostr.indexOf(".")+1;
			for(i=decpt; i<out.length; ++i) {
				if(out[i] == null || ('n?('.indexOf(out[i].t) === -1 && i !== decpt)) continue;
				j=out[i].v.indexOf(".")>-1&&i===decpt?out[i].v.indexOf(".")+1:0;
				vv = out[i].v.substr(0,j);
				for(; j<out[i].v.length; ++j) {
					if(jj<ostr.length) vv += ostr.charAt(jj++);
				}
				out[i].v = vv;
				out[i].t = 't';
				lasti = i;
			}
		}
	}
	for(i=0; i<out.length; ++i) if(out[i] != null && 'n?'.indexOf(out[i].t)>-1) {
		myv = (flen >1 && v < 0 && i>0 && out[i-1].v === "-" ? -v:v);
		out[i].v = write_num(out[i].t, out[i].v, myv);
		out[i].t = 't';
	}
	var retval = "";
	for(i=0; i !== out.length; ++i) if(out[i] != null) retval += out[i].v;
	return retval;
}

var cfregex2 = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function chkcond(v, rr) {
	if(rr == null) return false;
	var thresh = parseFloat(rr[2]);
	switch(rr[1]) {
		case "=":  if(v == thresh) return true; break;
		case ">":  if(v >  thresh) return true; break;
		case "<":  if(v <  thresh) return true; break;
		case "<>": if(v != thresh) return true; break;
		case ">=": if(v >= thresh) return true; break;
		case "<=": if(v <= thresh) return true; break;
	}
	return false;
}
function choose_fmt(f/*:string*/, v/*:any*/) {
	var fmt = SSF_split_fmt(f);
	var l = fmt.length, lat = fmt[l-1].indexOf("@");
	if(l<4 && lat>-1) --l;
	if(fmt.length > 4) throw new Error("cannot find right format for |" + fmt.join("|") + "|");
	if(typeof v !== "number") return [4, fmt.length === 4 || lat>-1?fmt[fmt.length-1]:"@"];
	switch(fmt.length) {
		case 1: fmt = lat>-1 ? ["General", "General", "General", fmt[0]] : [fmt[0], fmt[0], fmt[0], "@"]; break;
		case 2: fmt = lat>-1 ? [fmt[0], fmt[0], fmt[0], fmt[1]] : [fmt[0], fmt[1], fmt[0], "@"]; break;
		case 3: fmt = lat>-1 ? [fmt[0], fmt[1], fmt[0], fmt[2]] : [fmt[0], fmt[1], fmt[2], "@"]; break;
	}
	var ff = v > 0 ? fmt[0] : v < 0 ? fmt[1] : fmt[2];
	if(fmt[0].indexOf("[") === -1 && fmt[1].indexOf("[") === -1) return [l, ff];
	if(fmt[0].match(/\[[=<>]/) != null || fmt[1].match(/\[[=<>]/) != null) {
		var m1 = fmt[0].match(cfregex2);
		var m2 = fmt[1].match(cfregex2);
		return chkcond(v, m1) ? [l, fmt[0]] : chkcond(v, m2) ? [l, fmt[1]] : [l, fmt[m1 != null && m2 != null ? 2 : 1]];
	}
	return [l, ff];
}
function SSF_format(fmt/*:string|number*/,v/*:any*/,o/*:?any*/) {
	if(o == null) o = {};
	var sfmt = "";
	switch(typeof fmt) {
		case "string":
			if(fmt == "m/d/yy" && o.dateNF) sfmt = o.dateNF;
			else sfmt = fmt;
			break;
		case "number":
			if(fmt == 14 && o.dateNF) sfmt = o.dateNF;
			else sfmt = (o.table != null ? (o.table/*:any*/) : table_fmt)[fmt];
			if(sfmt == null) sfmt = (o.table && o.table[SSF_default_map[fmt]]) || table_fmt[SSF_default_map[fmt]];
			if(sfmt == null) sfmt = SSF_default_str[fmt] || "General";
			break;
	}
	if(SSF_isgeneral(sfmt,0)) return SSF_general(v, o);
	if(v instanceof Date) v = datenum_local(v, o.date1904);
	var f = choose_fmt(sfmt, v);
	if(SSF_isgeneral(f[1])) return SSF_general(v, o);
	if(v === true) v = "TRUE"; else if(v === false) v = "FALSE";
	else if(v === "" || v == null) return "";
	return eval_fmt(f[1], v, o, f[0]);
}
function SSF_load(fmt/*:string*/, idx/*:?number*/)/*:number*/ {
	if(typeof idx != 'number') {
		idx = +idx || -1;
/*::if(typeof idx != 'number') return 0x188; */
		for(var i = 0; i < 0x0188; ++i) {
/*::if(typeof idx != 'number') return 0x188; */
			if(table_fmt[i] == undefined) { if(idx < 0) idx = i; continue; }
			if(table_fmt[i] == fmt) { idx = i; break; }
		}
/*::if(typeof idx != 'number') return 0x188; */
		if(idx < 0) idx = 0x187;
	}
/*::if(typeof idx != 'number') return 0x188; */
	table_fmt[idx] = fmt;
	return idx;
}
function SSF_load_table(tbl/*:SSFTable*/)/*:void*/ {
	for(var i=0; i!=0x0188; ++i)
		if(tbl[i] !== undefined) SSF_load(tbl[i], i);
}

function make_ssf() {
	table_fmt = SSF_init_table();
}

var SSF = {
	format: SSF_format,
	load: SSF_load,
	_table: table_fmt,
	load_table: SSF_load_table,
	parse_date_code: SSF_parse_date_code,
	is_date: fmt_is_date,
	get_table: function get_table() { return SSF._table = table_fmt; }
};

var SSFImplicit/*{[number]:string}*/ = ({
	"5": '"$"#,##0_);\\("$"#,##0\\)',
	"6": '"$"#,##0_);[Red]\\("$"#,##0\\)',
	"7": '"$"#,##0.00_);\\("$"#,##0.00\\)',
	"8": '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
	"23": 'General', "24": 'General', "25": 'General', "26": 'General',
	"27": 'm/d/yy', "28": 'm/d/yy', "29": 'm/d/yy', "30": 'm/d/yy', "31": 'm/d/yy',
	"32": 'h:mm:ss', "33": 'h:mm:ss', "34": 'h:mm:ss', "35": 'h:mm:ss',
	"36": 'm/d/yy',
	"41": '_(* #,##0_);_(* \(#,##0\);_(* "-"_);_(@_)',
	"42": '_("$"* #,##0_);_("$"* \(#,##0\);_("$"* "-"_);_(@_)',
	"43": '_(* #,##0.00_);_(* \(#,##0.00\);_(* "-"??_);_(@_)',
	"44": '_("$"* #,##0.00_);_("$"* \(#,##0.00\);_("$"* "-"??_);_(@_)',
	"50": 'm/d/yy', "51": 'm/d/yy', "52": 'm/d/yy', "53": 'm/d/yy', "54": 'm/d/yy',
	"55": 'm/d/yy', "56": 'm/d/yy', "57": 'm/d/yy', "58": 'm/d/yy',
	"59": '0',
	"60": '0.00',
	"61": '#,##0',
	"62": '#,##0.00',
	"63": '"$"#,##0_);\\("$"#,##0\\)',
	"64": '"$"#,##0_);[Red]\\("$"#,##0\\)',
	"65": '"$"#,##0.00_);\\("$"#,##0.00\\)',
	"66": '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
	"67": '0%',
	"68": '0.00%',
	"69": '# ?/?',
	"70": '# ??/??',
	"71": 'm/d/yy',
	"72": 'm/d/yy',
	"73": 'd-mmm-yy',
	"74": 'd-mmm',
	"75": 'mmm-yy',
	"76": 'h:mm',
	"77": 'h:mm:ss',
	"78": 'm/d/yy h:mm',
	"79": 'mm:ss',
	"80": '[h]:mm:ss',
	"81": 'mmss.0'
}/*:any*/);

/* dateNF parse TODO: move to SSF */
var dateNFregex = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function dateNF_regex(dateNF/*:string|number*/)/*:RegExp*/ {
	var fmt = typeof dateNF == "number" ? table_fmt[dateNF] : dateNF;
	fmt = fmt.replace(dateNFregex, "(\\d+)");
	return new RegExp("^" + fmt + "$");
}
function dateNF_fix(str/*:string*/, dateNF/*:string*/, match/*:Array<string>*/)/*:string*/ {
	var Y = -1, m = -1, d = -1, H = -1, M = -1, S = -1;
	(dateNF.match(dateNFregex)||[]).forEach(function(n, i) {
		var v = parseInt(match[i+1], 10);
		switch(n.toLowerCase().charAt(0)) {
			case 'y': Y = v; break; case 'd': d = v; break;
			case 'h': H = v; break; case 's': S = v; break;
			case 'm': if(H >= 0) M = v; else m = v; break;
		}
	});
	if(S >= 0 && M == -1 && m >= 0) { M = m; m = -1; }
	var datestr = (("" + (Y>=0?Y: new Date().getFullYear())).slice(-4) + "-" + ("00" + (m>=1?m:1)).slice(-2) + "-" + ("00" + (d>=1?d:1)).slice(-2));
	if(datestr.length == 7) datestr = "0" + datestr;
	if(datestr.length == 8) datestr = "20" + datestr;
	var timestr = (("00" + (H>=0?H:0)).slice(-2) + ":" + ("00" + (M>=0?M:0)).slice(-2) + ":" + ("00" + (S>=0?S:0)).slice(-2));
	if(H == -1 && M == -1 && S == -1) return datestr;
	if(Y == -1 && m == -1 && d == -1) return timestr;
	return datestr + "T" + timestr;
}

/* table of bad formats written by third-party tools */
var bad_formats = {
	"d.m": "d\\.m" // Issue #2571 Google Sheets writes invalid format 'd.m', correct format is 'd"."m' or 'd\\.m'
};

function SSF__load(fmt, idx) {
	return SSF_load(bad_formats[fmt] || fmt, idx);
}

/*::
declare var ReadShift:any;
declare var CheckField:any;
declare var prep_blob:any;
declare var __readUInt32LE:any;
declare var __readInt32LE:any;
declare var __toBuffer:any;
declare var __utf16le:any;
declare var bconcat:any;
declare var s2a:any;
declare var chr0:any;
declare var chr1:any;
declare var has_buf:boolean;
declare var new_buf:any;
declare var new_raw_buf:any;
declare var new_unsafe_buf:any;
declare var Buffer_from:any;
*/
/* cfb.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*jshint eqnull:true */
/*exported CFB */
/*global Uint8Array:false, Uint16Array:false */

/*::
type SectorEntry = {
	name?:string;
	nodes?:Array<number>;
	data:RawBytes;
};
type SectorList = {
	[k:string|number]:SectorEntry;
	name:?string;
	fat_addrs:Array<number>;
	ssz:number;
}
type CFBFiles = {[n:string]:CFBEntry};
*/
/* crc32.js (C) 2014-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*exported CRC32 */
var CRC32 = /*#__PURE__*/(function() {
var CRC32 = {};
CRC32.version = '1.2.0';
/* see perf/crc32table.js */
/*global Int32Array */
function signed_crc_table()/*:any*/ {
	var c = 0, table/*:Array<number>*/ = new Array(256);

	for(var n =0; n != 256; ++n){
		c = n;
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		c = ((c&1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
		table[n] = c;
	}

	return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
}

var T0 = signed_crc_table();
function slice_by_16_tables(T) {
	var c = 0, v = 0, n = 0, table/*:Array<number>*/ = typeof Int32Array !== 'undefined' ? new Int32Array(4096) : new Array(4096) ;

	for(n = 0; n != 256; ++n) table[n] = T[n];
	for(n = 0; n != 256; ++n) {
		v = T[n];
		for(c = 256 + n; c < 4096; c += 256) v = table[c] = (v >>> 8) ^ T[v & 0xFF];
	}
	var out = [];
	for(n = 1; n != 16; ++n) out[n - 1] = typeof Int32Array !== 'undefined' && typeof table.subarray == "function" ? table.subarray(n * 256, n * 256 + 256) : table.slice(n * 256, n * 256 + 256);
	return out;
}
var TT = slice_by_16_tables(T0);
var T1 = TT[0],  T2 = TT[1],  T3 = TT[2],  T4 = TT[3],  T5 = TT[4];
var T6 = TT[5],  T7 = TT[6],  T8 = TT[7],  T9 = TT[8],  Ta = TT[9];
var Tb = TT[10], Tc = TT[11], Td = TT[12], Te = TT[13], Tf = TT[14];
function crc32_bstr(bstr/*:string*/, seed/*:number*/)/*:number*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1;
	for(var i = 0, L = bstr.length; i < L;) C = (C>>>8) ^ T0[(C^bstr.charCodeAt(i++))&0xFF];
	return ~C;
}

function crc32_buf(B/*:Uint8Array|Array<number>*/, seed/*:number*/)/*:number*/ {
	var C = seed/*:: ? 0 : 0 */ ^ -1, L = B.length - 15, i = 0;
	for(; i < L;) C =
		Tf[B[i++] ^ (C & 255)] ^
		Te[B[i++] ^ ((C >> 8) & 255)] ^
		Td[B[i++] ^ ((C >> 16) & 255)] ^
		Tc[B[i++] ^ (C >>> 24)] ^
		Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
		T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
		T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
	L += 15;
	while(i < L) C = (C>>>8) ^ T0[(C^B[i++])&0xFF];
	return ~C;
}

function crc32_str(str/*:string*/, seed/*:number*/)/*:number*/ {
	var C = seed ^ -1;
	for(var i = 0, L = str.length, c = 0, d = 0; i < L;) {
		c = str.charCodeAt(i++);
		if(c < 0x80) {
			C = (C>>>8) ^ T0[(C^c)&0xFF];
		} else if(c < 0x800) {
			C = (C>>>8) ^ T0[(C ^ (192|((c>>6)&31)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		} else if(c >= 0xD800 && c < 0xE000) {
			c = (c&1023)+64; d = str.charCodeAt(i++)&1023;
			C = (C>>>8) ^ T0[(C ^ (240|((c>>8)&7)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>2)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((d>>6)&15)|((c&3)<<4)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(d&63)))&0xFF];
		} else {
			C = (C>>>8) ^ T0[(C ^ (224|((c>>12)&15)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|((c>>6)&63)))&0xFF];
			C = (C>>>8) ^ T0[(C ^ (128|(c&63)))&0xFF];
		}
	}
	return ~C;
}
CRC32.table = T0;
CRC32.bstr = crc32_bstr;
CRC32.buf = crc32_buf;
CRC32.str = crc32_str;
return CRC32;
})();
/* [MS-CFB] v20171201 */
var CFB = /*#__PURE__*/(function _CFB(){
var exports/*:CFBModule*/ = /*::(*/{}/*:: :any)*/;
exports.version = '1.2.2';
/* [MS-CFB] 2.6.4 */
function namecmp(l/*:string*/, r/*:string*/)/*:number*/ {
	var L = l.split("/"), R = r.split("/");
	for(var i = 0, c = 0, Z = Math.min(L.length, R.length); i < Z; ++i) {
		if((c = L[i].length - R[i].length)) return c;
		if(L[i] != R[i]) return L[i] < R[i] ? -1 : 1;
	}
	return L.length - R.length;
}
function dirname(p/*:string*/)/*:string*/ {
	if(p.charAt(p.length - 1) == "/") return (p.slice(0,-1).indexOf("/") === -1) ? p : dirname(p.slice(0, -1));
	var c = p.lastIndexOf("/");
	return (c === -1) ? p : p.slice(0, c+1);
}

function filename(p/*:string*/)/*:string*/ {
	if(p.charAt(p.length - 1) == "/") return filename(p.slice(0, -1));
	var c = p.lastIndexOf("/");
	return (c === -1) ? p : p.slice(c+1);
}
/* -------------------------------------------------------------------------- */
/* DOS Date format:
   high|YYYYYYYm.mmmddddd.HHHHHMMM.MMMSSSSS|low
   add 1980 to stored year
   stored second should be doubled
*/

/* write JS date to buf as a DOS date */
function write_dos_date(buf/*:CFBlob*/, date/*:Date|string*/) {
	if(typeof date === "string") date = new Date(date);
	var hms/*:number*/ = date.getHours();
	hms = hms << 6 | date.getMinutes();
	hms = hms << 5 | (date.getSeconds()>>>1);
	buf.write_shift(2, hms);
	var ymd/*:number*/ = (date.getFullYear() - 1980);
	ymd = ymd << 4 | (date.getMonth()+1);
	ymd = ymd << 5 | date.getDate();
	buf.write_shift(2, ymd);
}

/* read four bytes from buf and interpret as a DOS date */
function parse_dos_date(buf/*:CFBlob*/)/*:Date*/ {
	var hms = buf.read_shift(2) & 0xFFFF;
	var ymd = buf.read_shift(2) & 0xFFFF;
	var val = new Date();
	var d = ymd & 0x1F; ymd >>>= 5;
	var m = ymd & 0x0F; ymd >>>= 4;
	val.setMilliseconds(0);
	val.setFullYear(ymd + 1980);
	val.setMonth(m-1);
	val.setDate(d);
	var S = hms & 0x1F; hms >>>= 5;
	var M = hms & 0x3F; hms >>>= 6;
	val.setHours(hms);
	val.setMinutes(M);
	val.setSeconds(S<<1);
	return val;
}
function parse_extra_field(blob/*:CFBlob*/)/*:any*/ {
	prep_blob(blob, 0);
	var o = /*::(*/{}/*:: :any)*/;
	var flags = 0;
	while(blob.l <= blob.length - 4) {
		var type = blob.read_shift(2);
		var sz = blob.read_shift(2), tgt = blob.l + sz;
		var p = {};
		switch(type) {
			/* UNIX-style Timestamps */
			case 0x5455: {
				flags = blob.read_shift(1);
				if(flags & 1) p.mtime = blob.read_shift(4);
				/* for some reason, CD flag corresponds to LFH */
				if(sz > 5) {
					if(flags & 2) p.atime = blob.read_shift(4);
					if(flags & 4) p.ctime = blob.read_shift(4);
				}
				if(p.mtime) p.mt = new Date(p.mtime*1000);
			} break;
			/* ZIP64 Extended Information Field */
			case 0x0001: {
				var sz1 = blob.read_shift(4), sz2 = blob.read_shift(4);
				p.usz = (sz2 * Math.pow(2,32) + sz1);
				sz1 = blob.read_shift(4); sz2 = blob.read_shift(4);
				p.csz = (sz2 * Math.pow(2,32) + sz1);
				// NOTE: volume fields are skipped
			} break;
		}
		blob.l = tgt;
		o[type] = p;
	}
	return o;
}
var fs/*:: = require('fs'); */;
function get_fs() { return fs || (fs = _fs); }
function parse(file/*:RawBytes*/, options/*:CFBReadOpts*/)/*:CFBContainer*/ {
if(file[0] == 0x50 && file[1] == 0x4b) return parse_zip(file, options);
if((file[0] | 0x20) == 0x6d && (file[1]|0x20) == 0x69) return parse_mad(file, options);
if(file.length < 512) throw new Error("CFB file size " + file.length + " < 512");
var mver = 3;
var ssz = 512;
var nmfs = 0; // number of mini FAT sectors
var difat_sec_cnt = 0;
var dir_start = 0;
var minifat_start = 0;
var difat_start = 0;

var fat_addrs/*:Array<number>*/ = []; // locations of FAT sectors

/* [MS-CFB] 2.2 Compound File Header */
var blob/*:CFBlob*/ = /*::(*/file.slice(0,512)/*:: :any)*/;
prep_blob(blob, 0);

/* major version */
var mv = check_get_mver(blob);
mver = mv[0];
switch(mver) {
	case 3: ssz = 512; break; case 4: ssz = 4096; break;
	case 0: if(mv[1] == 0) return parse_zip(file, options);
	/* falls through */
	default: throw new Error("Major Version: Expected 3 or 4 saw " + mver);
}

/* reprocess header */
if(ssz !== 512) { blob = /*::(*/file.slice(0,ssz)/*:: :any)*/; prep_blob(blob, 28 /* blob.l */); }
/* Save header for final object */
var header/*:RawBytes*/ = file.slice(0,ssz);

check_shifts(blob, mver);

// Number of Directory Sectors
var dir_cnt/*:number*/ = blob.read_shift(4, 'i');
if(mver === 3 && dir_cnt !== 0) throw new Error('# Directory Sectors: Expected 0 saw ' + dir_cnt);

// Number of FAT Sectors
blob.l += 4;

// First Directory Sector Location
dir_start = blob.read_shift(4, 'i');

// Transaction Signature
blob.l += 4;

// Mini Stream Cutoff Size
blob.chk('00100000', 'Mini Stream Cutoff Size: ');

// First Mini FAT Sector Location
minifat_start = blob.read_shift(4, 'i');

// Number of Mini FAT Sectors
nmfs = blob.read_shift(4, 'i');

// First DIFAT sector location
difat_start = blob.read_shift(4, 'i');

// Number of DIFAT Sectors
difat_sec_cnt = blob.read_shift(4, 'i');

// Grab FAT Sector Locations
for(var q = -1, j = 0; j < 109; ++j) { /* 109 = (512 - blob.l)>>>2; */
	q = blob.read_shift(4, 'i');
	if(q<0) break;
	fat_addrs[j] = q;
}

/** Break the file up into sectors */
var sectors/*:Array<RawBytes>*/ = sectorify(file, ssz);

sleuth_fat(difat_start, difat_sec_cnt, sectors, ssz, fat_addrs);

/** Chains */
var sector_list/*:SectorList*/ = make_sector_list(sectors, dir_start, fat_addrs, ssz);

if(dir_start < sector_list.length) sector_list[dir_start].name = "!Directory";
if(nmfs > 0 && minifat_start !== ENDOFCHAIN) sector_list[minifat_start].name = "!MiniFAT";
sector_list[fat_addrs[0]].name = "!FAT";
sector_list.fat_addrs = fat_addrs;
sector_list.ssz = ssz;

/* [MS-CFB] 2.6.1 Compound File Directory Entry */
var files/*:CFBFiles*/ = {}, Paths/*:Array<string>*/ = [], FileIndex/*:CFBFileIndex*/ = [], FullPaths/*:Array<string>*/ = [];
read_directory(dir_start, sector_list, sectors, Paths, nmfs, files, FileIndex, minifat_start);

build_full_paths(FileIndex, FullPaths, Paths);
Paths.shift();

var o = {
	FileIndex: FileIndex,
	FullPaths: FullPaths
};

// $FlowIgnore
if(options && options.raw) o.raw = {header: header, sectors: sectors};
return o;
} // parse

/* [MS-CFB] 2.2 Compound File Header -- read up to major version */
function check_get_mver(blob/*:CFBlob*/)/*:[number, number]*/ {
	if(blob[blob.l] == 0x50 && blob[blob.l + 1] == 0x4b) return [0, 0];
	// header signature 8
	blob.chk(HEADER_SIGNATURE, 'Header Signature: ');

	// clsid 16
	//blob.chk(HEADER_CLSID, 'CLSID: ');
	blob.l += 16;

	// minor version 2
	var mver/*:number*/ = blob.read_shift(2, 'u');

	return [blob.read_shift(2,'u'), mver];
}
function check_shifts(blob/*:CFBlob*/, mver/*:number*/)/*:void*/ {
	var shift = 0x09;

	// Byte Order
	//blob.chk('feff', 'Byte Order: '); // note: some writers put 0xffff
	blob.l += 2;

	// Sector Shift
	switch((shift = blob.read_shift(2))) {
		case 0x09: if(mver != 3) throw new Error('Sector Shift: Expected 9 saw ' + shift); break;
		case 0x0c: if(mver != 4) throw new Error('Sector Shift: Expected 12 saw ' + shift); break;
		default: throw new Error('Sector Shift: Expected 9 or 12 saw ' + shift);
	}

	// Mini Sector Shift
	blob.chk('0600', 'Mini Sector Shift: ');

	// Reserved
	blob.chk('000000000000', 'Reserved: ');
}

/** Break the file up into sectors */
function sectorify(file/*:RawBytes*/, ssz/*:number*/)/*:Array<RawBytes>*/ {
	var nsectors = Math.ceil(file.length/ssz)-1;
	var sectors/*:Array<RawBytes>*/ = [];
	for(var i=1; i < nsectors; ++i) sectors[i-1] = file.slice(i*ssz,(i+1)*ssz);
	sectors[nsectors-1] = file.slice(nsectors*ssz);
	return sectors;
}

/* [MS-CFB] 2.6.4 Red-Black Tree */
function build_full_paths(FI/*:CFBFileIndex*/, FP/*:Array<string>*/, Paths/*:Array<string>*/)/*:void*/ {
	var i = 0, L = 0, R = 0, C = 0, j = 0, pl = Paths.length;
	var dad/*:Array<number>*/ = [], q/*:Array<number>*/ = [];

	for(; i < pl; ++i) { dad[i]=q[i]=i; FP[i]=Paths[i]; }

	for(; j < q.length; ++j) {
		i = q[j];
		L = FI[i].L; R = FI[i].R; C = FI[i].C;
		if(dad[i] === i) {
			if(L !== -1 /*NOSTREAM*/ && dad[L] !== L) dad[i] = dad[L];
			if(R !== -1 && dad[R] !== R) dad[i] = dad[R];
		}
		if(C !== -1 /*NOSTREAM*/) dad[C] = i;
		if(L !== -1 && i != dad[i]) { dad[L] = dad[i]; if(q.lastIndexOf(L) < j) q.push(L); }
		if(R !== -1 && i != dad[i]) { dad[R] = dad[i]; if(q.lastIndexOf(R) < j) q.push(R); }
	}
	for(i=1; i < pl; ++i) if(dad[i] === i) {
		if(R !== -1 /*NOSTREAM*/ && dad[R] !== R) dad[i] = dad[R];
		else if(L !== -1 && dad[L] !== L) dad[i] = dad[L];
	}

	for(i=1; i < pl; ++i) {
		if(FI[i].type === 0 /* unknown */) continue;
		j = i;
		if(j != dad[j]) do {
			j = dad[j];
			FP[i] = FP[j] + "/" + FP[i];
		} while (j !== 0 && -1 !== dad[j] && j != dad[j]);
		dad[i] = -1;
	}

	FP[0] += "/";
	for(i=1; i < pl; ++i) {
		if(FI[i].type !== 2 /* stream */) FP[i] += "/";
	}
}

function get_mfat_entry(entry/*:CFBEntry*/, payload/*:RawBytes*/, mini/*:?RawBytes*/)/*:CFBlob*/ {
	var start = entry.start, size = entry.size;
	//return (payload.slice(start*MSSZ, start*MSSZ + size)/*:any*/);
	var o = [];
	var idx = start;
	while(mini && size > 0 && idx >= 0) {
		o.push(payload.slice(idx * MSSZ, idx * MSSZ + MSSZ));
		size -= MSSZ;
		idx = __readInt32LE(mini, idx * 4);
	}
	if(o.length === 0) return (new_buf(0)/*:any*/);
	return (bconcat(o).slice(0, entry.size)/*:any*/);
}

/** Chase down the rest of the DIFAT chain to build a comprehensive list
    DIFAT chains by storing the next sector number as the last 32 bits */
function sleuth_fat(idx/*:number*/, cnt/*:number*/, sectors/*:Array<RawBytes>*/, ssz/*:number*/, fat_addrs)/*:void*/ {
	var q/*:number*/ = ENDOFCHAIN;
	if(idx === ENDOFCHAIN) {
		if(cnt !== 0) throw new Error("DIFAT chain shorter than expected");
	} else if(idx !== -1 /*FREESECT*/) {
		var sector = sectors[idx], m = (ssz>>>2)-1;
		if(!sector) return;
		for(var i = 0; i < m; ++i) {
			if((q = __readInt32LE(sector,i*4)) === ENDOFCHAIN) break;
			fat_addrs.push(q);
		}
		if(cnt >= 1) sleuth_fat(__readInt32LE(sector,ssz-4),cnt - 1, sectors, ssz, fat_addrs);
	}
}

/** Follow the linked list of sectors for a given starting point */
function get_sector_list(sectors/*:Array<RawBytes>*/, start/*:number*/, fat_addrs/*:Array<number>*/, ssz/*:number*/, chkd/*:?Array<boolean>*/)/*:SectorEntry*/ {
	var buf/*:Array<number>*/ = [], buf_chain/*:Array<any>*/ = [];
	if(!chkd) chkd = [];
	var modulus = ssz - 1, j = 0, jj = 0;
	for(j=start; j>=0;) {
		chkd[j] = true;
		buf[buf.length] = j;
		buf_chain.push(sectors[j]);
		var addr = fat_addrs[Math.floor(j*4/ssz)];
		jj = ((j*4) & modulus);
		if(ssz < 4 + jj) throw new Error("FAT boundary crossed: " + j + " 4 "+ssz);
		if(!sectors[addr]) break;
		j = __readInt32LE(sectors[addr], jj);
	}
	return {nodes: buf, data:__toBuffer([buf_chain])};
}

/** Chase down the sector linked lists */
function make_sector_list(sectors/*:Array<RawBytes>*/, dir_start/*:number*/, fat_addrs/*:Array<number>*/, ssz/*:number*/)/*:SectorList*/ {
	var sl = sectors.length, sector_list/*:SectorList*/ = ([]/*:any*/);
	var chkd/*:Array<boolean>*/ = [], buf/*:Array<number>*/ = [], buf_chain/*:Array<RawBytes>*/ = [];
	var modulus = ssz - 1, i=0, j=0, k=0, jj=0;
	for(i=0; i < sl; ++i) {
		buf = ([]/*:Array<number>*/);
		k = (i + dir_start); if(k >= sl) k-=sl;
		if(chkd[k]) continue;
		buf_chain = [];
		var seen = [];
		for(j=k; j>=0;) {
			seen[j] = true;
			chkd[j] = true;
			buf[buf.length] = j;
			buf_chain.push(sectors[j]);
			var addr/*:number*/ = fat_addrs[Math.floor(j*4/ssz)];
			jj = ((j*4) & modulus);
			if(ssz < 4 + jj) throw new Error("FAT boundary crossed: " + j + " 4 "+ssz);
			if(!sectors[addr]) break;
			j = __readInt32LE(sectors[addr], jj);
			if(seen[j]) break;
		}
		sector_list[k] = ({nodes: buf, data:__toBuffer([buf_chain])}/*:SectorEntry*/);
	}
	return sector_list;
}

/* [MS-CFB] 2.6.1 Compound File Directory Entry */
function read_directory(dir_start/*:number*/, sector_list/*:SectorList*/, sectors/*:Array<RawBytes>*/, Paths/*:Array<string>*/, nmfs, files, FileIndex, mini) {
	var minifat_store = 0, pl = (Paths.length?2:0);
	var sector = sector_list[dir_start].data;
	var i = 0, namelen = 0, name;
	for(; i < sector.length; i+= 128) {
		var blob/*:CFBlob*/ = /*::(*/sector.slice(i, i+128)/*:: :any)*/;
		prep_blob(blob, 64);
		namelen = blob.read_shift(2);
		name = __utf16le(blob,0,namelen-pl);
		Paths.push(name);
		var o/*:CFBEntry*/ = ({
			name:  name,
			type:  blob.read_shift(1),
			color: blob.read_shift(1),
			L:     blob.read_shift(4, 'i'),
			R:     blob.read_shift(4, 'i'),
			C:     blob.read_shift(4, 'i'),
			clsid: blob.read_shift(16),
			state: blob.read_shift(4, 'i'),
			start: 0,
			size: 0
		});
		var ctime/*:number*/ = blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2);
		if(ctime !== 0) o.ct = read_date(blob, blob.l-8);
		var mtime/*:number*/ = blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2) + blob.read_shift(2);
		if(mtime !== 0) o.mt = read_date(blob, blob.l-8);
		o.start = blob.read_shift(4, 'i');
		o.size = blob.read_shift(4, 'i');
		if(o.size < 0 && o.start < 0) { o.size = o.type = 0; o.start = ENDOFCHAIN; o.name = ""; }
		if(o.type === 5) { /* root */
			minifat_store = o.start;
			if(nmfs > 0 && minifat_store !== ENDOFCHAIN) sector_list[minifat_store].name = "!StreamData";
			/*minifat_size = o.size;*/
		} else if(o.size >= 4096 /* MSCSZ */) {
			o.storage = 'fat';
			if(sector_list[o.start] === undefined) sector_list[o.start] = get_sector_list(sectors, o.start, sector_list.fat_addrs, sector_list.ssz);
			sector_list[o.start].name = o.name;
			o.content = (sector_list[o.start].data.slice(0,o.size)/*:any*/);
		} else {
			o.storage = 'minifat';
			if(o.size < 0) o.size = 0;
			else if(minifat_store !== ENDOFCHAIN && o.start !== ENDOFCHAIN && sector_list[minifat_store]) {
				o.content = get_mfat_entry(o, sector_list[minifat_store].data, (sector_list[mini]||{}).data);
			}
		}
		if(o.content) prep_blob(o.content, 0);
		files[name] = o;
		FileIndex.push(o);
	}
}

function read_date(blob/*:RawBytes|CFBlob*/, offset/*:number*/)/*:Date*/ {
	return new Date(( ( (__readUInt32LE(blob,offset+4)/1e7)*Math.pow(2,32)+__readUInt32LE(blob,offset)/1e7 ) - 11644473600)*1000);
}

function read_file(filename/*:string*/, options/*:CFBReadOpts*/) {
	get_fs();
	return parse(fs.readFileSync(filename), options);
}

function read(blob/*:RawBytes|string*/, options/*:CFBReadOpts*/) {
	var type = options && options.type;
	if(!type) {
		if(has_buf && Buffer.isBuffer(blob)) type = "buffer";
	}
	switch(type || "base64") {
		case "file": /*:: if(typeof blob !== 'string') throw "Must pass a filename when type='file'"; */return read_file(blob, options);
		case "base64": /*:: if(typeof blob !== 'string') throw "Must pass a base64-encoded binary string when type='file'"; */return parse(s2a(Base64_decode(blob)), options);
		case "binary": /*:: if(typeof blob !== 'string') throw "Must pass a binary string when type='file'"; */return parse(s2a(blob), options);
	}
	return parse(/*::typeof blob == 'string' ? new Buffer(blob, 'utf-8') : */blob, options);
}

function init_cfb(cfb/*:CFBContainer*/, opts/*:?any*/)/*:void*/ {
	var o = opts || {}, root = o.root || "Root Entry";
	if(!cfb.FullPaths) cfb.FullPaths = [];
	if(!cfb.FileIndex) cfb.FileIndex = [];
	if(cfb.FullPaths.length !== cfb.FileIndex.length) throw new Error("inconsistent CFB structure");
	if(cfb.FullPaths.length === 0) {
		cfb.FullPaths[0] = root + "/";
		cfb.FileIndex[0] = ({ name: root, type: 5 }/*:any*/);
	}
	if(o.CLSID) cfb.FileIndex[0].clsid = o.CLSID;
	seed_cfb(cfb);
}
function seed_cfb(cfb/*:CFBContainer*/)/*:void*/ {
	var nm = "\u0001Sh33tJ5";
	if(CFB.find(cfb, "/" + nm)) return;
	var p = new_buf(4); p[0] = 55; p[1] = p[3] = 50; p[2] = 54;
	cfb.FileIndex.push(({ name: nm, type: 2, content:p, size:4, L:69, R:69, C:69 }/*:any*/));
	cfb.FullPaths.push(cfb.FullPaths[0] + nm);
	rebuild_cfb(cfb);
}
function rebuild_cfb(cfb/*:CFBContainer*/, f/*:?boolean*/)/*:void*/ {
	init_cfb(cfb);
	var gc = false, s = false;
	for(var i = cfb.FullPaths.length - 1; i >= 0; --i) {
		var _file = cfb.FileIndex[i];
		switch(_file.type) {
			case 0:
				if(s) gc = true;
				else { cfb.FileIndex.pop(); cfb.FullPaths.pop(); }
				break;
			case 1: case 2: case 5:
				s = true;
				if(isNaN(_file.R * _file.L * _file.C)) gc = true;
				if(_file.R > -1 && _file.L > -1 && _file.R == _file.L) gc = true;
				break;
			default: gc = true; break;
		}
	}
	if(!gc && !f) return;

	var now = new Date(1987, 1, 19), j = 0;
	// Track which names exist
	var fullPaths = Object.create ? Object.create(null) : {};
	var data/*:Array<[string, CFBEntry]>*/ = [];
	for(i = 0; i < cfb.FullPaths.length; ++i) {
		fullPaths[cfb.FullPaths[i]] = true;
		if(cfb.FileIndex[i].type === 0) continue;
		data.push([cfb.FullPaths[i], cfb.FileIndex[i]]);
	}
	for(i = 0; i < data.length; ++i) {
		var dad = dirname(data[i][0]);
		s = fullPaths[dad];
		while(!s) {
			while(dirname(dad) && !fullPaths[dirname(dad)]) dad = dirname(dad);

			data.push([dad, ({
				name: filename(dad).replace("/",""),
				type: 1,
				clsid: HEADER_CLSID,
				ct: now, mt: now,
				content: null
			}/*:any*/)]);

			// Add name to set
			fullPaths[dad] = true;

			dad = dirname(data[i][0]);
			s = fullPaths[dad];
		}
	}

	data.sort(function(x,y) { return namecmp(x[0], y[0]); });
	cfb.FullPaths = []; cfb.FileIndex = [];
	for(i = 0; i < data.length; ++i) { cfb.FullPaths[i] = data[i][0]; cfb.FileIndex[i] = data[i][1]; }
	for(i = 0; i < data.length; ++i) {
		var elt = cfb.FileIndex[i];
		var nm = cfb.FullPaths[i];

		elt.name =  filename(nm).replace("/","");
		elt.L = elt.R = elt.C = -(elt.color = 1);
		elt.size = elt.content ? elt.content.length : 0;
		elt.start = 0;
		elt.clsid = (elt.clsid || HEADER_CLSID);
		if(i === 0) {
			elt.C = data.length > 1 ? 1 : -1;
			elt.size = 0;
			elt.type = 5;
		} else if(nm.slice(-1) == "/") {
			for(j=i+1;j < data.length; ++j) if(dirname(cfb.FullPaths[j])==nm) break;
			elt.C = j >= data.length ? -1 : j;
			for(j=i+1;j < data.length; ++j) if(dirname(cfb.FullPaths[j])==dirname(nm)) break;
			elt.R = j >= data.length ? -1 : j;
			elt.type = 1;
		} else {
			if(dirname(cfb.FullPaths[i+1]||"") == dirname(nm)) elt.R = i + 1;
			elt.type = 2;
		}
	}

}

function _write(cfb/*:CFBContainer*/, options/*:CFBWriteOpts*/)/*:RawBytes|string*/ {
	var _opts = options || {};
	/* MAD is order-sensitive, skip rebuild and sort */
	if(_opts.fileType == 'mad') return write_mad(cfb, _opts);
	rebuild_cfb(cfb);
	switch(_opts.fileType) {
		case 'zip': return write_zip(cfb, _opts);
		//case 'mad': return write_mad(cfb, _opts);
	}
	var L = (function(cfb/*:CFBContainer*/)/*:Array<number>*/{
		var mini_size = 0, fat_size = 0;
		for(var i = 0; i < cfb.FileIndex.length; ++i) {
			var file = cfb.FileIndex[i];
			if(!file.content) continue;
			var flen = file.content.length;
			if(flen > 0){
				if(flen < 0x1000) mini_size += (flen + 0x3F) >> 6;
				else fat_size += (flen + 0x01FF) >> 9;
			}
		}
		var dir_cnt = (cfb.FullPaths.length +3) >> 2;
		var mini_cnt = (mini_size + 7) >> 3;
		var mfat_cnt = (mini_size + 0x7F) >> 7;
		var fat_base = mini_cnt + fat_size + dir_cnt + mfat_cnt;
		var fat_cnt = (fat_base + 0x7F) >> 7;
		var difat_cnt = fat_cnt <= 109 ? 0 : Math.ceil((fat_cnt-109)/0x7F);
		while(((fat_base + fat_cnt + difat_cnt + 0x7F) >> 7) > fat_cnt) difat_cnt = ++fat_cnt <= 109 ? 0 : Math.ceil((fat_cnt-109)/0x7F);
		var L =  [1, difat_cnt, fat_cnt, mfat_cnt, dir_cnt, fat_size, mini_size, 0];
		cfb.FileIndex[0].size = mini_size << 6;
		L[7] = (cfb.FileIndex[0].start=L[0]+L[1]+L[2]+L[3]+L[4]+L[5])+((L[6]+7) >> 3);
		return L;
	})(cfb);
	var o = new_buf(L[7] << 9);
	var i = 0, T = 0;
	{
		for(i = 0; i < 8; ++i) o.write_shift(1, HEADER_SIG[i]);
		for(i = 0; i < 8; ++i) o.write_shift(2, 0);
		o.write_shift(2, 0x003E);
		o.write_shift(2, 0x0003);
		o.write_shift(2, 0xFFFE);
		o.write_shift(2, 0x0009);
		o.write_shift(2, 0x0006);
		for(i = 0; i < 3; ++i) o.write_shift(2, 0);
		o.write_shift(4, 0);
		o.write_shift(4, L[2]);
		o.write_shift(4, L[0] + L[1] + L[2] + L[3] - 1);
		o.write_shift(4, 0);
		o.write_shift(4, 1<<12);
		o.write_shift(4, L[3] ? L[0] + L[1] + L[2] - 1: ENDOFCHAIN);
		o.write_shift(4, L[3]);
		o.write_shift(-4, L[1] ? L[0] - 1: ENDOFCHAIN);
		o.write_shift(4, L[1]);
		for(i = 0; i < 109; ++i) o.write_shift(-4, i < L[2] ? L[1] + i : -1);
	}
	if(L[1]) {
		for(T = 0; T < L[1]; ++T) {
			for(; i < 236 + T * 127; ++i) o.write_shift(-4, i < L[2] ? L[1] + i : -1);
			o.write_shift(-4, T === L[1] - 1 ? ENDOFCHAIN : T + 1);
		}
	}
	var chainit = function(w/*:number*/)/*:void*/ {
		for(T += w; i<T-1; ++i) o.write_shift(-4, i+1);
		if(w) { ++i; o.write_shift(-4, ENDOFCHAIN); }
	};
	T = i = 0;
	for(T+=L[1]; i<T; ++i) o.write_shift(-4, consts.DIFSECT);
	for(T+=L[2]; i<T; ++i) o.write_shift(-4, consts.FATSECT);
	chainit(L[3]);
	chainit(L[4]);
	var j/*:number*/ = 0, flen/*:number*/ = 0;
	var file/*:CFBEntry*/ = cfb.FileIndex[0];
	for(; j < cfb.FileIndex.length; ++j) {
		file = cfb.FileIndex[j];
		if(!file.content) continue;
		/*:: if(file.content == null) throw new Error("unreachable"); */
		flen = file.content.length;
		if(flen < 0x1000) continue;
		file.start = T;
		chainit((flen + 0x01FF) >> 9);
	}
	chainit((L[6] + 7) >> 3);
	while(o.l & 0x1FF) o.write_shift(-4, consts.ENDOFCHAIN);
	T = i = 0;
	for(j = 0; j < cfb.FileIndex.length; ++j) {
		file = cfb.FileIndex[j];
		if(!file.content) continue;
		/*:: if(file.content == null) throw new Error("unreachable"); */
		flen = file.content.length;
		if(!flen || flen >= 0x1000) continue;
		file.start = T;
		chainit((flen + 0x3F) >> 6);
	}
	while(o.l & 0x1FF) o.write_shift(-4, consts.ENDOFCHAIN);
	for(i = 0; i < L[4]<<2; ++i) {
		var nm = cfb.FullPaths[i];
		if(!nm || nm.length === 0) {
			for(j = 0; j < 17; ++j) o.write_shift(4, 0);
			for(j = 0; j < 3; ++j) o.write_shift(4, -1);
			for(j = 0; j < 12; ++j) o.write_shift(4, 0);
			continue;
		}
		file = cfb.FileIndex[i];
		if(i === 0) file.start = file.size ? file.start - 1 : ENDOFCHAIN;
		var _nm/*:string*/ = (i === 0 && _opts.root) || file.name;
		if(_nm.length > 32) {
			console.error("Name " + _nm + " will be truncated to " + _nm.slice(0,32));
			_nm = _nm.slice(0, 32);
		}
		flen = 2*(_nm.length+1);
		o.write_shift(64, _nm, "utf16le");
		o.write_shift(2, flen);
		o.write_shift(1, file.type);
		o.write_shift(1, file.color);
		o.write_shift(-4, file.L);
		o.write_shift(-4, file.R);
		o.write_shift(-4, file.C);
		if(!file.clsid) for(j = 0; j < 4; ++j) o.write_shift(4, 0);
		else o.write_shift(16, file.clsid, "hex");
		o.write_shift(4, file.state || 0);
		o.write_shift(4, 0); o.write_shift(4, 0);
		o.write_shift(4, 0); o.write_shift(4, 0);
		o.write_shift(4, file.start);
		o.write_shift(4, file.size); o.write_shift(4, 0);
	}
	for(i = 1; i < cfb.FileIndex.length; ++i) {
		file = cfb.FileIndex[i];
		/*:: if(!file.content) throw new Error("unreachable"); */
		if(file.size >= 0x1000) {
			o.l = (file.start+1) << 9;
			if (has_buf && Buffer.isBuffer(file.content)) {
				file.content.copy(o, o.l, 0, file.size);
				// o is a 0-filled Buffer so just set next offset
				o.l += (file.size + 511) & -512;
			} else {
				for(j = 0; j < file.size; ++j) o.write_shift(1, file.content[j]);
				for(; j & 0x1FF; ++j) o.write_shift(1, 0);
			}
		}
	}
	for(i = 1; i < cfb.FileIndex.length; ++i) {
		file = cfb.FileIndex[i];
		/*:: if(!file.content) throw new Error("unreachable"); */
		if(file.size > 0 && file.size < 0x1000) {
			if (has_buf && Buffer.isBuffer(file.content)) {
				file.content.copy(o, o.l, 0, file.size);
				// o is a 0-filled Buffer so just set next offset
				o.l += (file.size + 63) & -64;
			} else {
				for(j = 0; j < file.size; ++j) o.write_shift(1, file.content[j]);
				for(; j & 0x3F; ++j) o.write_shift(1, 0);
			}
		}
	}
	if (has_buf) {
		o.l = o.length;
	} else {
		// When using Buffer, already 0-filled
		while(o.l < o.length) o.write_shift(1, 0);
	}
	return o;
}
/* [MS-CFB] 2.6.4 (Unicode 3.0.1 case conversion) */
function find(cfb/*:CFBContainer*/, path/*:string*/)/*:?CFBEntry*/ {
	var UCFullPaths/*:Array<string>*/ = cfb.FullPaths.map(function(x) { return x.toUpperCase(); });
	var UCPaths/*:Array<string>*/ = UCFullPaths.map(function(x) { var y = x.split("/"); return y[y.length - (x.slice(-1) == "/" ? 2 : 1)]; });
	var k/*:boolean*/ = false;
	if(path.charCodeAt(0) === 47 /* "/" */) { k = true; path = UCFullPaths[0].slice(0, -1) + path; }
	else k = path.indexOf("/") !== -1;
	var UCPath/*:string*/ = path.toUpperCase();
	var w/*:number*/ = k === true ? UCFullPaths.indexOf(UCPath) : UCPaths.indexOf(UCPath);
	if(w !== -1) return cfb.FileIndex[w];

	var m = !UCPath.match(chr1);
	UCPath = UCPath.replace(chr0,'');
	if(m) UCPath = UCPath.replace(chr1,'!');
	for(w = 0; w < UCFullPaths.length; ++w) {
		if((m ? UCFullPaths[w].replace(chr1,'!') : UCFullPaths[w]).replace(chr0,'') == UCPath) return cfb.FileIndex[w];
		if((m ? UCPaths[w].replace(chr1,'!') : UCPaths[w]).replace(chr0,'') == UCPath) return cfb.FileIndex[w];
	}
	return null;
}
/** CFB Constants */
var MSSZ = 64; /* Mini Sector Size = 1<<6 */
//var MSCSZ = 4096; /* Mini Stream Cutoff Size */
/* 2.1 Compound File Sector Numbers and Types */
var ENDOFCHAIN = -2;
/* 2.2 Compound File Header */
var HEADER_SIGNATURE = 'd0cf11e0a1b11ae1';
var HEADER_SIG = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1];
var HEADER_CLSID = '00000000000000000000000000000000';
var consts = {
	/* 2.1 Compund File Sector Numbers and Types */
	MAXREGSECT: -6,
	DIFSECT: -4,
	FATSECT: -3,
	ENDOFCHAIN: ENDOFCHAIN,
	FREESECT: -1,
	/* 2.2 Compound File Header */
	HEADER_SIGNATURE: HEADER_SIGNATURE,
	HEADER_MINOR_VERSION: '3e00',
	MAXREGSID: -6,
	NOSTREAM: -1,
	HEADER_CLSID: HEADER_CLSID,
	/* 2.6.1 Compound File Directory Entry */
	EntryTypes: ['unknown','storage','stream','lockbytes','property','root']
};

function write_file(cfb/*:CFBContainer*/, filename/*:string*/, options/*:CFBWriteOpts*/)/*:void*/ {
	get_fs();
	var o = _write(cfb, options);
	/*:: if(typeof Buffer == 'undefined' || !Buffer.isBuffer(o) || !(o instanceof Buffer)) throw new Error("unreachable"); */
	fs.writeFileSync(filename, o);
}

function a2s(o/*:RawBytes*/)/*:string*/ {
	var out = new Array(o.length);
	for(var i = 0; i < o.length; ++i) out[i] = String.fromCharCode(o[i]);
	return out.join("");
}

function write(cfb/*:CFBContainer*/, options/*:CFBWriteOpts*/)/*:RawBytes|string*/ {
	var o = _write(cfb, options);
	switch(options && options.type || "buffer") {
		case "file": get_fs(); fs.writeFileSync(options.filename, (o/*:any*/)); return o;
		case "binary": return typeof o == "string" ? o : a2s(o);
		case "base64": return Base64_encode(typeof o == "string" ? o : a2s(o));
		case "buffer": if(has_buf) return Buffer.isBuffer(o) ? o : Buffer_from(o);
			/* falls through */
		case "array": return typeof o == "string" ? s2a(o) : o;
	}
	return o;
}
/* node < 8.1 zlib does not expose bytesRead, so default to pure JS */
var _zlib;
function use_zlib(zlib) { try {
	var InflateRaw = zlib.InflateRaw;
	var InflRaw = new InflateRaw();
	InflRaw._processChunk(new Uint8Array([3, 0]), InflRaw._finishFlushFlag);
	if(InflRaw.bytesRead) _zlib = zlib;
	else throw new Error("zlib does not expose bytesRead");
} catch(e) {console.error("cannot use native zlib: " + (e.message || e)); } }

function _inflateRawSync(payload, usz) {
	if(!_zlib) return _inflate(payload, usz);
	var InflateRaw = _zlib.InflateRaw;
	var InflRaw = new InflateRaw();
	var out = InflRaw._processChunk(payload.slice(payload.l), InflRaw._finishFlushFlag);
	payload.l += InflRaw.bytesRead;
	return out;
}

function _deflateRawSync(payload) {
	return _zlib ? _zlib.deflateRawSync(payload) : _deflate(payload);
}
var CLEN_ORDER = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

/*  LEN_ID = [ 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285 ]; */
var LEN_LN = [   3,   4,   5,   6,   7,   8,   9,  10,  11,  13 , 15,  17,  19,  23,  27,  31,  35,  43,  51,  59,  67,  83,  99, 115, 131, 163, 195, 227, 258 ];

/*  DST_ID = [  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13,  14,  15,  16,  17,  18,  19,   20,   21,   22,   23,   24,   25,   26,    27,    28,    29 ]; */
var DST_LN = [  1,  2,  3,  4,  5,  7,  9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577 ];

function bit_swap_8(n) { var t = (((((n<<1)|(n<<11)) & 0x22110) | (((n<<5)|(n<<15)) & 0x88440))); return ((t>>16) | (t>>8) |t)&0xFF; }

var use_typed_arrays = typeof Uint8Array !== 'undefined';

var bitswap8 = use_typed_arrays ? new Uint8Array(1<<8) : [];
for(var q = 0; q < (1<<8); ++q) bitswap8[q] = bit_swap_8(q);

function bit_swap_n(n, b) {
	var rev = bitswap8[n & 0xFF];
	if(b <= 8) return rev >>> (8-b);
	rev = (rev << 8) | bitswap8[(n>>8)&0xFF];
	if(b <= 16) return rev >>> (16-b);
	rev = (rev << 8) | bitswap8[(n>>16)&0xFF];
	return rev >>> (24-b);
}

/* helpers for unaligned bit reads */
function read_bits_2(buf, bl) { var w = (bl&7), h = (bl>>>3); return ((buf[h]|(w <= 6 ? 0 : buf[h+1]<<8))>>>w)& 0x03; }
function read_bits_3(buf, bl) { var w = (bl&7), h = (bl>>>3); return ((buf[h]|(w <= 5 ? 0 : buf[h+1]<<8))>>>w)& 0x07; }
function read_bits_4(buf, bl) { var w = (bl&7), h = (bl>>>3); return ((buf[h]|(w <= 4 ? 0 : buf[h+1]<<8))>>>w)& 0x0F; }
function read_bits_5(buf, bl) { var w = (bl&7), h = (bl>>>3); return ((buf[h]|(w <= 3 ? 0 : buf[h+1]<<8))>>>w)& 0x1F; }
function read_bits_7(buf, bl) { var w = (bl&7), h = (bl>>>3); return ((buf[h]|(w <= 1 ? 0 : buf[h+1]<<8))>>>w)& 0x7F; }

/* works up to n = 3 * 8 + 1 = 25 */
function read_bits_n(buf, bl, n) {
	var w = (bl&7), h = (bl>>>3), f = ((1<<n)-1);
	var v = buf[h] >>> w;
	if(n < 8 - w) return v & f;
	v |= buf[h+1]<<(8-w);
	if(n < 16 - w) return v & f;
	v |= buf[h+2]<<(16-w);
	if(n < 24 - w) return v & f;
	v |= buf[h+3]<<(24-w);
	return v & f;
}

/* helpers for unaligned bit writes */
function write_bits_3(buf, bl, v) { var w = bl & 7, h = bl >>> 3;
	if(w <= 5) buf[h] |= (v & 7) << w;
	else {
		buf[h] |= (v << w) & 0xFF;
		buf[h+1] = (v&7) >> (8-w);
	}
	return bl + 3;
}

function write_bits_1(buf, bl, v) {
	var w = bl & 7, h = bl >>> 3;
	v = (v&1) << w;
	buf[h] |= v;
	return bl + 1;
}
function write_bits_8(buf, bl, v) {
	var w = bl & 7, h = bl >>> 3;
	v <<= w;
	buf[h] |=  v & 0xFF; v >>>= 8;
	buf[h+1] = v;
	return bl + 8;
}
function write_bits_16(buf, bl, v) {
	var w = bl & 7, h = bl >>> 3;
	v <<= w;
	buf[h] |=  v & 0xFF; v >>>= 8;
	buf[h+1] = v & 0xFF;
	buf[h+2] = v >>> 8;
	return bl + 16;
}

/* until ArrayBuffer#realloc is a thing, fake a realloc */
function realloc(b, sz/*:number*/) {
	var L = b.length, M = 2*L > sz ? 2*L : sz + 5, i = 0;
	if(L >= sz) return b;
	if(has_buf) {
		var o = new_unsafe_buf(M);
		// $FlowIgnore
		if(b.copy) b.copy(o);
		else for(; i < b.length; ++i) o[i] = b[i];
		return o;
	} else if(use_typed_arrays) {
		var a = new Uint8Array(M);
		if(a.set) a.set(b);
		else for(; i < L; ++i) a[i] = b[i];
		return a;
	}
	b.length = M;
	return b;
}

/* zero-filled arrays for older browsers */
function zero_fill_array(n) {
	var o = new Array(n);
	for(var i = 0; i < n; ++i) o[i] = 0;
	return o;
}

/* build tree (used for literals and lengths) */
function build_tree(clens, cmap, MAX/*:number*/)/*:number*/ {
	var maxlen = 1, w = 0, i = 0, j = 0, ccode = 0, L = clens.length;

	var bl_count  = use_typed_arrays ? new Uint16Array(32) : zero_fill_array(32);
	for(i = 0; i < 32; ++i) bl_count[i] = 0;

	for(i = L; i < MAX; ++i) clens[i] = 0;
	L = clens.length;

	var ctree = use_typed_arrays ? new Uint16Array(L) : zero_fill_array(L); // []

	/* build code tree */
	for(i = 0; i < L; ++i) {
		bl_count[(w = clens[i])]++;
		if(maxlen < w) maxlen = w;
		ctree[i] = 0;
	}
	bl_count[0] = 0;
	for(i = 1; i <= maxlen; ++i) bl_count[i+16] = (ccode = (ccode + bl_count[i-1])<<1);
	for(i = 0; i < L; ++i) {
		ccode = clens[i];
		if(ccode != 0) ctree[i] = bl_count[ccode+16]++;
	}

	/* cmap[maxlen + 4 bits] = (off&15) + (lit<<4) reverse mapping */
	var cleni = 0;
	for(i = 0; i < L; ++i) {
		cleni = clens[i];
		if(cleni != 0) {
			ccode = bit_swap_n(ctree[i], maxlen)>>(maxlen-cleni);
			for(j = (1<<(maxlen + 4 - cleni)) - 1; j>=0; --j)
				cmap[ccode|(j<<cleni)] = (cleni&15) | (i<<4);
		}
	}
	return maxlen;
}

/* Fixed Huffman */
var fix_lmap = use_typed_arrays ? new Uint16Array(512) : zero_fill_array(512);
var fix_dmap = use_typed_arrays ? new Uint16Array(32)  : zero_fill_array(32);
if(!use_typed_arrays) {
	for(var i = 0; i < 512; ++i) fix_lmap[i] = 0;
	for(i = 0; i < 32; ++i) fix_dmap[i] = 0;
}
(function() {
	var dlens/*:Array<number>*/ = [];
	var i = 0;
	for(;i<32; i++) dlens.push(5);
	build_tree(dlens, fix_dmap, 32);

	var clens/*:Array<number>*/ = [];
	i = 0;
	for(; i<=143; i++) clens.push(8);
	for(; i<=255; i++) clens.push(9);
	for(; i<=279; i++) clens.push(7);
	for(; i<=287; i++) clens.push(8);
	build_tree(clens, fix_lmap, 288);
})();var _deflateRaw = /*#__PURE__*/(function _deflateRawIIFE() {
	var DST_LN_RE = use_typed_arrays ? new Uint8Array(0x8000) : [];
	var j = 0, k = 0;
	for(; j < DST_LN.length - 1; ++j) {
		for(; k < DST_LN[j+1]; ++k) DST_LN_RE[k] = j;
	}
	for(;k < 32768; ++k) DST_LN_RE[k] = 29;

	var LEN_LN_RE = use_typed_arrays ? new Uint8Array(0x103) : [];
	for(j = 0, k = 0; j < LEN_LN.length - 1; ++j) {
		for(; k < LEN_LN[j+1]; ++k) LEN_LN_RE[k] = j;
	}

	function write_stored(data, out) {
		var boff = 0;
		while(boff < data.length) {
			var L = Math.min(0xFFFF, data.length - boff);
			var h = boff + L == data.length;
			out.write_shift(1, +h);
			out.write_shift(2, L);
			out.write_shift(2, (~L) & 0xFFFF);
			while(L-- > 0) out[out.l++] = data[boff++];
		}
		return out.l;
	}

	/* Fixed Huffman */
	function write_huff_fixed(data, out) {
		var bl = 0;
		var boff = 0;
		var addrs = use_typed_arrays ? new Uint16Array(0x8000) : [];
		while(boff < data.length) {
			var L = /* data.length - boff; */ Math.min(0xFFFF, data.length - boff);

			/* write a stored block for short data */
			if(L < 10) {
				bl = write_bits_3(out, bl, +!!(boff + L == data.length)); // jshint ignore:line
				if(bl & 7) bl += 8 - (bl & 7);
				out.l = (bl / 8) | 0;
				out.write_shift(2, L);
				out.write_shift(2, (~L) & 0xFFFF);
				while(L-- > 0) out[out.l++] = data[boff++];
				bl = out.l * 8;
				continue;
			}

			bl = write_bits_3(out, bl, +!!(boff + L == data.length) + 2); // jshint ignore:line
			var hash = 0;
			while(L-- > 0) {
				var d = data[boff];
				hash = ((hash << 5) ^ d) & 0x7FFF;

				var match = -1, mlen = 0;

				if((match = addrs[hash])) {
					match |= boff & ~0x7FFF;
					if(match > boff) match -= 0x8000;
					if(match < boff) while(data[match + mlen] == data[boff + mlen] && mlen < 250) ++mlen;
				}

				if(mlen > 2) {
					/* Copy Token  */
					d = LEN_LN_RE[mlen];
					if(d <= 22) bl = write_bits_8(out, bl, bitswap8[d+1]>>1) - 1;
					else {
						write_bits_8(out, bl, 3);
						bl += 5;
						write_bits_8(out, bl, bitswap8[d-23]>>5);
						bl += 3;
					}
					var len_eb = (d < 8) ? 0 : ((d - 4)>>2);
					if(len_eb > 0) {
						write_bits_16(out, bl, mlen - LEN_LN[d]);
						bl += len_eb;
					}

					d = DST_LN_RE[boff - match];
					bl = write_bits_8(out, bl, bitswap8[d]>>3);
					bl -= 3;

					var dst_eb = d < 4 ? 0 : (d-2)>>1;
					if(dst_eb > 0) {
						write_bits_16(out, bl, boff - match - DST_LN[d]);
						bl += dst_eb;
					}
					for(var q = 0; q < mlen; ++q) {
						addrs[hash] = boff & 0x7FFF;
						hash = ((hash << 5) ^ data[boff]) & 0x7FFF;
						++boff;
					}
					L-= mlen - 1;
				} else {
					/* Literal Token */
					if(d <= 143) d = d + 48;
					else bl = write_bits_1(out, bl, 1);
					bl = write_bits_8(out, bl, bitswap8[d]);
					addrs[hash] = boff & 0x7FFF;
					++boff;
				}
			}

			bl = write_bits_8(out, bl, 0) - 1;
		}
		out.l = ((bl + 7)/8)|0;
		return out.l;
	}
	return function _deflateRaw(data, out) {
		if(data.length < 8) return write_stored(data, out);
		return write_huff_fixed(data, out);
	};
})();

function _deflate(data) {
	var buf = new_buf(50+Math.floor(data.length*1.1));
	var off = _deflateRaw(data, buf);
	return buf.slice(0, off);
}
/* modified inflate function also moves original read head */

var dyn_lmap = use_typed_arrays ? new Uint16Array(32768) : zero_fill_array(32768);
var dyn_dmap = use_typed_arrays ? new Uint16Array(32768) : zero_fill_array(32768);
var dyn_cmap = use_typed_arrays ? new Uint16Array(128)   : zero_fill_array(128);
var dyn_len_1 = 1, dyn_len_2 = 1;

/* 5.5.3 Expanding Huffman Codes */
function dyn(data, boff/*:number*/) {
	/* nomenclature from RFC1951 refers to bit values; these are offset by the implicit constant */
	var _HLIT = read_bits_5(data, boff) + 257; boff += 5;
	var _HDIST = read_bits_5(data, boff) + 1; boff += 5;
	var _HCLEN = read_bits_4(data, boff) + 4; boff += 4;
	var w = 0;

	/* grab and store code lengths */
	var clens = use_typed_arrays ? new Uint8Array(19) : zero_fill_array(19);
	var ctree = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
	var maxlen = 1;
	var bl_count =  use_typed_arrays ? new Uint8Array(8) : zero_fill_array(8);
	var next_code = use_typed_arrays ? new Uint8Array(8) : zero_fill_array(8);
	var L = clens.length; /* 19 */
	for(var i = 0; i < _HCLEN; ++i) {
		clens[CLEN_ORDER[i]] = w = read_bits_3(data, boff);
		if(maxlen < w) maxlen = w;
		bl_count[w]++;
		boff += 3;
	}

	/* build code tree */
	var ccode = 0;
	bl_count[0] = 0;
	for(i = 1; i <= maxlen; ++i) next_code[i] = ccode = (ccode + bl_count[i-1])<<1;
	for(i = 0; i < L; ++i) if((ccode = clens[i]) != 0) ctree[i] = next_code[ccode]++;
	/* cmap[7 bits from stream] = (off&7) + (lit<<3) */
	var cleni = 0;
	for(i = 0; i < L; ++i) {
		cleni = clens[i];
		if(cleni != 0) {
			ccode = bitswap8[ctree[i]]>>(8-cleni);
			for(var j = (1<<(7-cleni))-1; j>=0; --j) dyn_cmap[ccode|(j<<cleni)] = (cleni&7) | (i<<3);
		}
	}

	/* read literal and dist codes at once */
	var hcodes/*:Array<number>*/ = [];
	maxlen = 1;
	for(; hcodes.length < _HLIT + _HDIST;) {
		ccode = dyn_cmap[read_bits_7(data, boff)];
		boff += ccode & 7;
		switch((ccode >>>= 3)) {
			case 16:
				w = 3 + read_bits_2(data, boff); boff += 2;
				ccode = hcodes[hcodes.length - 1];
				while(w-- > 0) hcodes.push(ccode);
				break;
			case 17:
				w = 3 + read_bits_3(data, boff); boff += 3;
				while(w-- > 0) hcodes.push(0);
				break;
			case 18:
				w = 11 + read_bits_7(data, boff); boff += 7;
				while(w -- > 0) hcodes.push(0);
				break;
			default:
				hcodes.push(ccode);
				if(maxlen < ccode) maxlen = ccode;
				break;
		}
	}

	/* build literal / length trees */
	var h1 = hcodes.slice(0, _HLIT), h2 = hcodes.slice(_HLIT);
	for(i = _HLIT; i < 286; ++i) h1[i] = 0;
	for(i = _HDIST; i < 30; ++i) h2[i] = 0;
	dyn_len_1 = build_tree(h1, dyn_lmap, 286);
	dyn_len_2 = build_tree(h2, dyn_dmap, 30);
	return boff;
}

/* return [ data, bytesRead ] */
function inflate(data, usz/*:number*/) {
	/* shortcircuit for empty buffer [0x03, 0x00] */
	if(data[0] == 3 && !(data[1] & 0x3)) { return [new_raw_buf(usz), 2]; }

	/* bit offset */
	var boff = 0;

	/* header includes final bit and type bits */
	var header = 0;

	var outbuf = new_unsafe_buf(usz ? usz : (1<<18));
	var woff = 0;
	var OL = outbuf.length>>>0;
	var max_len_1 = 0, max_len_2 = 0;

	while((header&1) == 0) {
		header = read_bits_3(data, boff); boff += 3;
		if((header >>> 1) == 0) {
			/* Stored block */
			if(boff & 7) boff += 8 - (boff&7);
			/* 2 bytes sz, 2 bytes bit inverse */
			var sz = data[boff>>>3] | data[(boff>>>3)+1]<<8;
			boff += 32;
			/* push sz bytes */
			if(sz > 0) {
				if(!usz && OL < woff + sz) { outbuf = realloc(outbuf, woff + sz); OL = outbuf.length; }
				while(sz-- > 0) { outbuf[woff++] = data[boff>>>3]; boff += 8; }
			}
			continue;
		} else if((header >> 1) == 1) {
			/* Fixed Huffman */
			max_len_1 = 9; max_len_2 = 5;
		} else {
			/* Dynamic Huffman */
			boff = dyn(data, boff);
			max_len_1 = dyn_len_1; max_len_2 = dyn_len_2;
		}
		for(;;) { // while(true) is apparently out of vogue in modern JS circles
			if(!usz && (OL < woff + 32767)) { outbuf = realloc(outbuf, woff + 32767); OL = outbuf.length; }
			/* ingest code and move read head */
			var bits = read_bits_n(data, boff, max_len_1);
			var code = (header>>>1) == 1 ? fix_lmap[bits] : dyn_lmap[bits];
			boff += code & 15; code >>>= 4;
			/* 0-255 are literals, 256 is end of block token, 257+ are copy tokens */
			if(((code>>>8)&0xFF) === 0) outbuf[woff++] = code;
			else if(code == 256) break;
			else {
				code -= 257;
				var len_eb = (code < 8) ? 0 : ((code-4)>>2); if(len_eb > 5) len_eb = 0;
				var tgt = woff + LEN_LN[code];
				/* length extra bits */
				if(len_eb > 0) {
					tgt += read_bits_n(data, boff, len_eb);
					boff += len_eb;
				}

				/* dist code */
				bits = read_bits_n(data, boff, max_len_2);
				code = (header>>>1) == 1 ? fix_dmap[bits] : dyn_dmap[bits];
				boff += code & 15; code >>>= 4;
				var dst_eb = (code < 4 ? 0 : (code-2)>>1);
				var dst = DST_LN[code];
				/* dist extra bits */
				if(dst_eb > 0) {
					dst += read_bits_n(data, boff, dst_eb);
					boff += dst_eb;
				}

				/* in the common case, manual byte copy is faster than TA set / Buffer copy */
				if(!usz && OL < tgt) { outbuf = realloc(outbuf, tgt + 100); OL = outbuf.length; }
				while(woff < tgt) { outbuf[woff] = outbuf[woff - dst]; ++woff; }
			}
		}
	}
	if(usz) return [outbuf, (boff+7)>>>3];
	return [outbuf.slice(0, woff), (boff+7)>>>3];
}

function _inflate(payload, usz) {
	var data = payload.slice(payload.l||0);
	var out = inflate(data, usz);
	payload.l += out[1];
	return out[0];
}

function warn_or_throw(wrn, msg) {
	if(wrn) { if(typeof console !== 'undefined') console.error(msg); }
	else throw new Error(msg);
}

function parse_zip(file/*:RawBytes*/, options/*:CFBReadOpts*/)/*:CFBContainer*/ {
	var blob/*:CFBlob*/ = /*::(*/file/*:: :any)*/;
	prep_blob(blob, 0);

	var FileIndex/*:CFBFileIndex*/ = [], FullPaths/*:Array<string>*/ = [];
	var o = {
		FileIndex: FileIndex,
		FullPaths: FullPaths
	};
	init_cfb(o, { root: options.root });

	/* find end of central directory, start just after signature */
	var i = blob.length - 4;
	while((blob[i] != 0x50 || blob[i+1] != 0x4b || blob[i+2] != 0x05 || blob[i+3] != 0x06) && i >= 0) --i;
	blob.l = i + 4;

	/* parse end of central directory */
	blob.l += 4;
	var fcnt = blob.read_shift(2);
	blob.l += 6;
	var start_cd = blob.read_shift(4);

	/* parse central directory */
	blob.l = start_cd;

	for(i = 0; i < fcnt; ++i) {
		/* trust local file header instead of CD entry */
		blob.l += 20;
		var csz = blob.read_shift(4);
		var usz = blob.read_shift(4);
		var namelen = blob.read_shift(2);
		var efsz = blob.read_shift(2);
		var fcsz = blob.read_shift(2);
		blob.l += 8;
		var offset = blob.read_shift(4);
		var EF = parse_extra_field(/*::(*/blob.slice(blob.l+namelen, blob.l+namelen+efsz)/*:: :any)*/);
		blob.l += namelen + efsz + fcsz;

		var L = blob.l;
		blob.l = offset + 4;
		/* ZIP64 lengths */
		if(EF && EF[0x0001]) {
			if((EF[0x0001]||{}).usz) usz = EF[0x0001].usz;
			if((EF[0x0001]||{}).csz) csz = EF[0x0001].csz;
		}
		parse_local_file(blob, csz, usz, o, EF);
		blob.l = L;
	}

	return o;
}


/* head starts just after local file header signature */
function parse_local_file(blob/*:CFBlob*/, csz/*:number*/, usz/*:number*/, o/*:CFBContainer*/, EF) {
	/* [local file header] */
	blob.l += 2;
	var flags = blob.read_shift(2);
	var meth = blob.read_shift(2);
	var date = parse_dos_date(blob);

	if(flags & 0x2041) throw new Error("Unsupported ZIP encryption");
	var crc32 = blob.read_shift(4);
	var _csz = blob.read_shift(4);
	var _usz = blob.read_shift(4);

	var namelen = blob.read_shift(2);
	var efsz = blob.read_shift(2);

	// TODO: flags & (1<<11) // UTF8
	var name = ""; for(var i = 0; i < namelen; ++i) name += String.fromCharCode(blob[blob.l++]);
	if(efsz) {
		var ef = parse_extra_field(/*::(*/blob.slice(blob.l, blob.l + efsz)/*:: :any)*/);
		if((ef[0x5455]||{}).mt) date = ef[0x5455].mt;
		if((ef[0x0001]||{}).usz) _usz = ef[0x0001].usz;
		if((ef[0x0001]||{}).csz) _csz = ef[0x0001].csz;
		if(EF) {
			if((EF[0x5455]||{}).mt) date = EF[0x5455].mt;
			if((EF[0x0001]||{}).usz) _usz = ef[0x0001].usz;
			if((EF[0x0001]||{}).csz) _csz = ef[0x0001].csz;
		}
	}
	blob.l += efsz;

	/* [encryption header] */

	/* [file data] */
	var data = blob.slice(blob.l, blob.l + _csz);
	switch(meth) {
		case 8: data = _inflateRawSync(blob, _usz); break;
		case 0: break; // TODO: scan for magic number
		default: throw new Error("Unsupported ZIP Compression method " + meth);
	}

	/* [data descriptor] */
	var wrn = false;
	if(flags & 8) {
		crc32 = blob.read_shift(4);
		if(crc32 == 0x08074b50) { crc32 = blob.read_shift(4); wrn = true; }
		_csz = blob.read_shift(4);
		_usz = blob.read_shift(4);
	}

	if(_csz != csz) warn_or_throw(wrn, "Bad compressed size: " + csz + " != " + _csz);
	if(_usz != usz) warn_or_throw(wrn, "Bad uncompressed size: " + usz + " != " + _usz);
	//var _crc32 = CRC32.buf(data, 0);
	//if((crc32>>0) != (_crc32>>0)) warn_or_throw(wrn, "Bad CRC32 checksum: " + crc32 + " != " + _crc32);
	cfb_add(o, name, data, {unsafe: true, mt: date});
}
function write_zip(cfb/*:CFBContainer*/, options/*:CFBWriteOpts*/)/*:RawBytes*/ {
	var _opts = options || {};
	var out = [], cdirs = [];
	var o/*:CFBlob*/ = new_buf(1);
	var method = (_opts.compression ? 8 : 0), flags = 0;
	var i = 0, j = 0;

	var start_cd = 0, fcnt = 0;
	var root = cfb.FullPaths[0], fp = root, fi = cfb.FileIndex[0];
	var crcs = [];
	var sz_cd = 0;

	for(i = 1; i < cfb.FullPaths.length; ++i) {
		fp = cfb.FullPaths[i].slice(root.length); fi = cfb.FileIndex[i];
		if(!fi.size || !fi.content || fp == "\u0001Sh33tJ5") continue;
		var start = start_cd;

		/* TODO: CP437 filename */
		var namebuf = new_buf(fp.length);
		for(j = 0; j < fp.length; ++j) namebuf.write_shift(1, fp.charCodeAt(j) & 0x7F);
		namebuf = namebuf.slice(0, namebuf.l);
		crcs[fcnt] = typeof fi.content == "string" ? CRC32.bstr(fi.content, 0) : CRC32.buf(/*::((*/fi.content/*::||[]):any)*/, 0);

		var outbuf = typeof fi.content == "string" ? s2a(fi.content) : fi.content/*::||[]*/;
		if(method == 8) outbuf = _deflateRawSync(outbuf);

		/* local file header */
		o = new_buf(30);
		o.write_shift(4, 0x04034b50);
		o.write_shift(2, 20);
		o.write_shift(2, flags);
		o.write_shift(2, method);
		/* TODO: last mod file time/date */
		if(fi.mt) write_dos_date(o, fi.mt);
		else o.write_shift(4, 0);
		o.write_shift(-4, crcs[fcnt]);
		o.write_shift(4,  outbuf.length);
		o.write_shift(4,  /*::(*/fi.content/*::||[])*/.length);
		o.write_shift(2, namebuf.length);
		o.write_shift(2, 0);

		start_cd += o.length;
		out.push(o);
		start_cd += namebuf.length;
		out.push(namebuf);

		/* TODO: extra fields? */

		/* TODO: encryption header ? */

		start_cd += outbuf.length;
		out.push(outbuf);

		/* central directory */
		o = new_buf(46);
		o.write_shift(4, 0x02014b50);
		o.write_shift(2, 0);
		o.write_shift(2, 20);
		o.write_shift(2, flags);
		o.write_shift(2, method);
		o.write_shift(4, 0); /* TODO: last mod file time/date */
		o.write_shift(-4, crcs[fcnt]);

		o.write_shift(4, outbuf.length);
		o.write_shift(4, /*::(*/fi.content/*::||[])*/.length);
		o.write_shift(2, namebuf.length);
		o.write_shift(2, 0);
		o.write_shift(2, 0);
		o.write_shift(2, 0);
		o.write_shift(2, 0);
		o.write_shift(4, 0);
		o.write_shift(4, start);

		sz_cd += o.l;
		cdirs.push(o);
		sz_cd += namebuf.length;
		cdirs.push(namebuf);
		++fcnt;
	}

	/* end of central directory */
	o = new_buf(22);
	o.write_shift(4, 0x06054b50);
	o.write_shift(2, 0);
	o.write_shift(2, 0);
	o.write_shift(2, fcnt);
	o.write_shift(2, fcnt);
	o.write_shift(4, sz_cd);
	o.write_shift(4, start_cd);
	o.write_shift(2, 0);

	return bconcat(([bconcat((out/*:any*/)), bconcat(cdirs), o]/*:any*/));
}
var ContentTypeMap = ({
	"htm": "text/html",
	"xml": "text/xml",

	"gif": "image/gif",
	"jpg": "image/jpeg",
	"png": "image/png",

	"mso": "application/x-mso",
	"thmx": "application/vnd.ms-officetheme",
	"sh33tj5": "application/octet-stream"
}/*:any*/);

function get_content_type(fi/*:CFBEntry*/, fp/*:string*/)/*:string*/ {
	if(fi.ctype) return fi.ctype;

	var ext = fi.name || "", m = ext.match(/\.([^\.]+)$/);
	if(m && ContentTypeMap[m[1]]) return ContentTypeMap[m[1]];

	if(fp) {
		m = (ext = fp).match(/[\.\\]([^\.\\])+$/);
		if(m && ContentTypeMap[m[1]]) return ContentTypeMap[m[1]];
	}

	return "application/octet-stream";
}

/* 76 character chunks TODO: intertwine encoding */
function write_base64_76(bstr/*:string*/)/*:string*/ {
	var data = Base64_encode(bstr);
	var o = [];
	for(var i = 0; i < data.length; i+= 76) o.push(data.slice(i, i+76));
	return o.join("\r\n") + "\r\n";
}

/*
Rules for QP:
	- escape =## applies for all non-display characters and literal "="
	- space or tab at end of line must be encoded
	- \r\n newlines can be preserved, but bare \r and \n must be escaped
	- lines must not exceed 76 characters, use soft breaks =\r\n

TODO: Some files from word appear to write line extensions with bare equals:

```
<table class=3DMsoTableGrid border=3D1 cellspacing=3D0 cellpadding=3D0 width=
="70%"
```
*/
function write_quoted_printable(text/*:string*/)/*:string*/ {
	var encoded = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function(c) {
		var w = c.charCodeAt(0).toString(16).toUpperCase();
		return "=" + (w.length == 1 ? "0" + w : w);
	});

	encoded = encoded.replace(/ $/mg, "=20").replace(/\t$/mg, "=09");

	if(encoded.charAt(0) == "\n") encoded = "=0D" + encoded.slice(1);
	encoded = encoded.replace(/\r(?!\n)/mg, "=0D").replace(/\n\n/mg, "\n=0A").replace(/([^\r\n])\n/mg, "$1=0A");

	var o/*:Array<string>*/ = [], split = encoded.split("\r\n");
	for(var si = 0; si < split.length; ++si) {
		var str = split[si];
		if(str.length == 0) { o.push(""); continue; }
		for(var i = 0; i < str.length;) {
			var end = 76;
			var tmp = str.slice(i, i + end);
			if(tmp.charAt(end - 1) == "=") end --;
			else if(tmp.charAt(end - 2) == "=") end -= 2;
			else if(tmp.charAt(end - 3) == "=") end -= 3;
			tmp = str.slice(i, i + end);
			i += end;
			if(i < str.length) tmp += "=";
			o.push(tmp);
		}
	}

	return o.join("\r\n");
}
function parse_quoted_printable(data/*:Array<string>*/)/*:RawBytes*/ {
	var o = [];

	/* unify long lines */
	for(var di = 0; di < data.length; ++di) {
		var line = data[di];
		while(di <= data.length && line.charAt(line.length - 1) == "=") line = line.slice(0, line.length - 1) + data[++di];
		o.push(line);
	}

	/* decode */
	for(var oi = 0; oi < o.length; ++oi) o[oi] = o[oi].replace(/[=][0-9A-Fa-f]{2}/g, function($$) { return String.fromCharCode(parseInt($$.slice(1), 16)); });
	return s2a(o.join("\r\n"));
}


function parse_mime(cfb/*:CFBContainer*/, data/*:Array<string>*/, root/*:string*/)/*:void*/ {
	var fname = "", cte = "", ctype = "", fdata;
	var di = 0;
	for(;di < 10; ++di) {
		var line = data[di];
		if(!line || line.match(/^\s*$/)) break;
		var m = line.match(/^(.*?):\s*([^\s].*)$/);
		if(m) switch(m[1].toLowerCase()) {
			case "content-location": fname = m[2].trim(); break;
			case "content-type": ctype = m[2].trim(); break;
			case "content-transfer-encoding": cte = m[2].trim(); break;
		}
	}
	++di;
	switch(cte.toLowerCase()) {
		case 'base64': fdata = s2a(Base64_decode(data.slice(di).join(""))); break;
		case 'quoted-printable': fdata = parse_quoted_printable(data.slice(di)); break;
		default: throw new Error("Unsupported Content-Transfer-Encoding " + cte);
	}
	var file = cfb_add(cfb, fname.slice(root.length), fdata, {unsafe: true});
	if(ctype) file.ctype = ctype;
}

function parse_mad(file/*:RawBytes*/, options/*:CFBReadOpts*/)/*:CFBContainer*/ {
	if(a2s(file.slice(0,13)).toLowerCase() != "mime-version:") throw new Error("Unsupported MAD header");
	var root = (options && options.root || "");
	// $FlowIgnore
	var data = (has_buf && Buffer.isBuffer(file) ? file.toString("binary") : a2s(file)).split("\r\n");
	var di = 0, row = "";

	/* if root is not specified, scan for the common prefix */
	for(di = 0; di < data.length; ++di) {
		row = data[di];
		if(!/^Content-Location:/i.test(row)) continue;
		row = row.slice(row.indexOf("file"));
		if(!root) root = row.slice(0, row.lastIndexOf("/") + 1);
		if(row.slice(0, root.length) == root) continue;
		while(root.length > 0) {
			root = root.slice(0, root.length - 1);
			root = root.slice(0, root.lastIndexOf("/") + 1);
			if(row.slice(0,root.length) == root) break;
		}
	}

	var mboundary = (data[1] || "").match(/boundary="(.*?)"/);
	if(!mboundary) throw new Error("MAD cannot find boundary");
	var boundary = "--" + (mboundary[1] || "");

	var FileIndex/*:CFBFileIndex*/ = [], FullPaths/*:Array<string>*/ = [];
	var o = {
		FileIndex: FileIndex,
		FullPaths: FullPaths
	};
	init_cfb(o);
	var start_di, fcnt = 0;
	for(di = 0; di < data.length; ++di) {
		var line = data[di];
		if(line !== boundary && line !== boundary + "--") continue;
		if(fcnt++) parse_mime(o, data.slice(start_di, di), root);
		start_di = di;
	}
	return o;
}

function write_mad(cfb/*:CFBContainer*/, options/*:CFBWriteOpts*/)/*:string*/ {
	var opts = options || {};
	var boundary = opts.boundary || "SheetJS";
	boundary = '------=' + boundary;

	var out = [
		'MIME-Version: 1.0',
		'Content-Type: multipart/related; boundary="' + boundary.slice(2) + '"',
		'',
		'',
		''
	];

	var root = cfb.FullPaths[0], fp = root, fi = cfb.FileIndex[0];
	for(var i = 1; i < cfb.FullPaths.length; ++i) {
		fp = cfb.FullPaths[i].slice(root.length);
		fi = cfb.FileIndex[i];
		if(!fi.size || !fi.content || fp == "\u0001Sh33tJ5") continue;

		/* Normalize filename */
		fp = fp.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function(c) {
			return "_x" + c.charCodeAt(0).toString(16) + "_";
		}).replace(/[\u0080-\uFFFF]/g, function(u) {
			return "_u" + u.charCodeAt(0).toString(16) + "_";
		});

		/* Extract content as binary string */
		var ca = fi.content;
		// $FlowIgnore
		var cstr = has_buf && Buffer.isBuffer(ca) ? ca.toString("binary") : a2s(ca);

		/* 4/5 of first 1024 chars ascii -> quoted printable, else base64 */
		var dispcnt = 0, L = Math.min(1024, cstr.length), cc = 0;
		for(var csl = 0; csl <= L; ++csl) if((cc=cstr.charCodeAt(csl)) >= 0x20 && cc < 0x80) ++dispcnt;
		var qp = dispcnt >= L * 4 / 5;

		out.push(boundary);
		out.push('Content-Location: ' + (opts.root || 'file:///C:/SheetJS/') + fp);
		out.push('Content-Transfer-Encoding: ' + (qp ? 'quoted-printable' : 'base64'));
		out.push('Content-Type: ' + get_content_type(fi, fp));
		out.push('');

		out.push(qp ? write_quoted_printable(cstr) : write_base64_76(cstr));
	}
	out.push(boundary + '--\r\n');
	return out.join("\r\n");
}
function cfb_new(opts/*:?any*/)/*:CFBContainer*/ {
	var o/*:CFBContainer*/ = ({}/*:any*/);
	init_cfb(o, opts);
	return o;
}

function cfb_add(cfb/*:CFBContainer*/, name/*:string*/, content/*:?RawBytes*/, opts/*:?any*/)/*:CFBEntry*/ {
	var unsafe = opts && opts.unsafe;
	if(!unsafe) init_cfb(cfb);
	var file = !unsafe && CFB.find(cfb, name);
	if(!file) {
		var fpath/*:string*/ = cfb.FullPaths[0];
		if(name.slice(0, fpath.length) == fpath) fpath = name;
		else {
			if(fpath.slice(-1) != "/") fpath += "/";
			fpath = (fpath + name).replace("//","/");
		}
		file = ({name: filename(name), type: 2}/*:any*/);
		cfb.FileIndex.push(file);
		cfb.FullPaths.push(fpath);
		if(!unsafe) CFB.utils.cfb_gc(cfb);
	}
	/*:: if(!file) throw new Error("unreachable"); */
	file.content = (content/*:any*/);
	file.size = content ? content.length : 0;
	if(opts) {
		if(opts.CLSID) file.clsid = opts.CLSID;
		if(opts.mt) file.mt = opts.mt;
		if(opts.ct) file.ct = opts.ct;
	}
	return file;
}

function cfb_del(cfb/*:CFBContainer*/, name/*:string*/)/*:boolean*/ {
	init_cfb(cfb);
	var file = CFB.find(cfb, name);
	if(file) for(var j = 0; j < cfb.FileIndex.length; ++j) if(cfb.FileIndex[j] == file) {
		cfb.FileIndex.splice(j, 1);
		cfb.FullPaths.splice(j, 1);
		return true;
	}
	return false;
}

function cfb_mov(cfb/*:CFBContainer*/, old_name/*:string*/, new_name/*:string*/)/*:boolean*/ {
	init_cfb(cfb);
	var file = CFB.find(cfb, old_name);
	if(file) for(var j = 0; j < cfb.FileIndex.length; ++j) if(cfb.FileIndex[j] == file) {
		cfb.FileIndex[j].name = filename(new_name);
		cfb.FullPaths[j] = new_name;
		return true;
	}
	return false;
}

function cfb_gc(cfb/*:CFBContainer*/)/*:void*/ { rebuild_cfb(cfb, true); }

exports.find = find;
exports.read = read;
exports.parse = parse;
exports.write = write;
exports.writeFile = write_file;
exports.utils = {
	cfb_new: cfb_new,
	cfb_add: cfb_add,
	cfb_del: cfb_del,
	cfb_mov: cfb_mov,
	cfb_gc: cfb_gc,
	ReadShift: ReadShift,
	CheckField: CheckField,
	prep_blob: prep_blob,
	bconcat: bconcat,
	use_zlib: use_zlib,
	_deflateRaw: _deflate,
	_inflateRaw: _inflate,
	consts: consts
};

return exports;
})();

var _fs;
function set_fs(fs) { _fs = fs; }

/* normalize data for blob ctor */
function blobify(data) {
	if(typeof data === "string") return s2ab(data);
	if(Array.isArray(data)) return a2u(data);
	return data;
}
/* write or download file */
function write_dl(fname/*:string*/, payload/*:any*/, enc/*:?string*/) {
	/*global IE_SaveFile, Blob, navigator, saveAs, document, File, chrome */
	if(typeof _fs !== 'undefined' && _fs.writeFileSync) return enc ? _fs.writeFileSync(fname, payload, enc) : _fs.writeFileSync(fname, payload);
	if(typeof Deno !== 'undefined') {
		/* in this spot, it's safe to assume typed arrays and TextEncoder/TextDecoder exist */
		if(enc && typeof payload == "string") switch(enc) {
			case "utf8": payload = new TextEncoder(enc).encode(payload); break;
			case "binary": payload = s2ab(payload); break;
			/* TODO: binary equivalent */
			default: throw new Error("Unsupported encoding " + enc);
		}
		return Deno.writeFileSync(fname, payload);
	}
	var data = (enc == "utf8") ? utf8write(payload) : payload;
	/*:: declare var IE_SaveFile: any; */
	if(typeof IE_SaveFile !== 'undefined') return IE_SaveFile(data, fname);
	if(typeof Blob !== 'undefined') {
		var blob = new Blob([blobify(data)], {type:"application/octet-stream"});
		/*:: declare var navigator: any; */
		if(typeof navigator !== 'undefined' && navigator.msSaveBlob) return navigator.msSaveBlob(blob, fname);
		/*:: declare var saveAs: any; */
		if(typeof saveAs !== 'undefined') return saveAs(blob, fname);
		if(typeof URL !== 'undefined' && typeof document !== 'undefined' && document.createElement && URL.createObjectURL) {
			var url = URL.createObjectURL(blob);
			/*:: declare var chrome: any; */
			if(typeof chrome === 'object' && typeof (chrome.downloads||{}).download == "function") {
				if(URL.revokeObjectURL && typeof setTimeout !== 'undefined') setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
				return chrome.downloads.download({ url: url, filename: fname, saveAs: true});
			}
			var a = document.createElement("a");
			if(a.download != null) {
				/*:: if(document.body == null) throw new Error("unreachable"); */
				a.download = fname; a.href = url; document.body.appendChild(a); a.click();
				/*:: if(document.body == null) throw new Error("unreachable"); */ document.body.removeChild(a);
				if(URL.revokeObjectURL && typeof setTimeout !== 'undefined') setTimeout(function() { URL.revokeObjectURL(url); }, 60000);
				return url;
			}
		}
	}
	// $FlowIgnore
	if(typeof $ !== 'undefined' && typeof File !== 'undefined' && typeof Folder !== 'undefined') try { // extendscript
		// $FlowIgnore
		var out = File(fname); out.open("w"); out.encoding = "binary";
		if(Array.isArray(payload)) payload = a2s(payload);
		out.write(payload); out.close(); return payload;
	} catch(e) { if(!e.message || !e.message.match(/onstruct/)) throw e; }
	throw new Error("cannot save file " + fname);
}

/* read binary data from file */
function read_binary(path/*:string*/) {
	if(typeof _fs !== 'undefined') return _fs.readFileSync(path);
	if(typeof Deno !== 'undefined') return Deno.readFileSync(path);
	// $FlowIgnore
	if(typeof $ !== 'undefined' && typeof File !== 'undefined' && typeof Folder !== 'undefined') try { // extendscript
		// $FlowIgnore
		var infile = File(path); infile.open("r"); infile.encoding = "binary";
		var data = infile.read(); infile.close();
		return data;
	} catch(e) { if(!e.message || !e.message.match(/onstruct/)) throw e; }
	throw new Error("Cannot access file " + path);
}
function keys(o/*:any*/)/*:Array<any>*/ {
	var ks = Object.keys(o), o2 = [];
	for(var i = 0; i < ks.length; ++i) if(Object.prototype.hasOwnProperty.call(o, ks[i])) o2.push(ks[i]);
	return o2;
}

function evert_key(obj/*:any*/, key/*:string*/)/*:EvertType*/ {
	var o = ([]/*:any*/), K = keys(obj);
	for(var i = 0; i !== K.length; ++i) if(o[obj[K[i]][key]] == null) o[obj[K[i]][key]] = K[i];
	return o;
}

function evert(obj/*:any*/)/*:EvertType*/ {
	var o = ([]/*:any*/), K = keys(obj);
	for(var i = 0; i !== K.length; ++i) o[obj[K[i]]] = K[i];
	return o;
}

function evert_num(obj/*:any*/)/*:EvertNumType*/ {
	var o = ([]/*:any*/), K = keys(obj);
	for(var i = 0; i !== K.length; ++i) o[obj[K[i]]] = parseInt(K[i],10);
	return o;
}

function evert_arr(obj/*:any*/)/*:EvertArrType*/ {
	var o/*:EvertArrType*/ = ([]/*:any*/), K = keys(obj);
	for(var i = 0; i !== K.length; ++i) {
		if(o[obj[K[i]]] == null) o[obj[K[i]]] = [];
		o[obj[K[i]]].push(K[i]);
	}
	return o;
}

var basedate = /*#__PURE__*/new Date(1899, 11, 30, 0, 0, 0); // 2209161600000
function datenum(v/*:Date*/, date1904/*:?boolean*/)/*:number*/ {
	var epoch = /*#__PURE__*/v.getTime();
	if(date1904) epoch -= 1462*24*60*60*1000;
	var dnthresh = /*#__PURE__*/basedate.getTime() + (/*#__PURE__*/v.getTimezoneOffset() - /*#__PURE__*/basedate.getTimezoneOffset()) * 60000;
	return (epoch - dnthresh) / (24 * 60 * 60 * 1000);
}
var refdate = /*#__PURE__*/new Date();
var dnthresh = /*#__PURE__*/basedate.getTime() + (/*#__PURE__*/refdate.getTimezoneOffset() - /*#__PURE__*/basedate.getTimezoneOffset()) * 60000;
var refoffset = /*#__PURE__*/refdate.getTimezoneOffset();
function numdate(v/*:number*/)/*:Date*/ {
	var out = new Date();
	out.setTime(v * 24 * 60 * 60 * 1000 + dnthresh);
	if (out.getTimezoneOffset() !== refoffset) {
		out.setTime(out.getTime() + (out.getTimezoneOffset() - refoffset) * 60000);
	}
	return out;
}

/* ISO 8601 Duration */
function parse_isodur(s) {
	var sec = 0, mt = 0, time = false;
	var m = s.match(/P([0-9\.]+Y)?([0-9\.]+M)?([0-9\.]+D)?T([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
	if(!m) throw new Error("|" + s + "| is not an ISO8601 Duration");
	for(var i = 1; i != m.length; ++i) {
		if(!m[i]) continue;
		mt = 1;
		if(i > 3) time = true;
		switch(m[i].slice(m[i].length-1)) {
			case 'Y':
				throw new Error("Unsupported ISO Duration Field: " + m[i].slice(m[i].length-1));
			case 'D': mt *= 24;
				/* falls through */
			case 'H': mt *= 60;
				/* falls through */
			case 'M':
				if(!time) throw new Error("Unsupported ISO Duration Field: M");
				else mt *= 60;
		}
		sec += mt * parseInt(m[i], 10);
	}
	return sec;
}

var good_pd_date_1 = /*#__PURE__*/new Date('2017-02-19T19:06:09.000Z');
var good_pd_date = /*#__PURE__*/isNaN(/*#__PURE__*/good_pd_date_1.getFullYear()) ? /*#__PURE__*/new Date('2/19/17') : good_pd_date_1;
var good_pd = /*#__PURE__*/good_pd_date.getFullYear() == 2017;
/* parses a date as a local date */
function parseDate(str/*:string|Date*/, fixdate/*:?number*/)/*:Date*/ {
	var d = new Date(str);
	if(good_pd) {
		/*:: if(fixdate == null) fixdate = 0; */
		if(fixdate > 0) d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
		else if(fixdate < 0) d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
		return d;
	}
	if(str instanceof Date) return str;
	if(good_pd_date.getFullYear() == 1917 && !isNaN(d.getFullYear())) {
		var s = d.getFullYear();
		if(str.indexOf("" + s) > -1) return d;
		d.setFullYear(d.getFullYear() + 100); return d;
	}
	var n = str.match(/\d+/g)||["2017","2","19","0","0","0"];
	var out = new Date(+n[0], +n[1] - 1, +n[2], (+n[3]||0), (+n[4]||0), (+n[5]||0));
	if(str.indexOf("Z") > -1) out = new Date(out.getTime() - out.getTimezoneOffset() * 60 * 1000);
	return out;
}

function cc2str(arr/*:Array<number>*/, debomit)/*:string*/ {
	if(has_buf && Buffer.isBuffer(arr)) {
		if(debomit && buf_utf16le) {
			// TODO: temporary patch
			if(arr[0] == 0xFF && arr[1] == 0xFE) return utf8write(arr.slice(2).toString("utf16le"));
			if(arr[1] == 0xFE && arr[2] == 0xFF) return utf8write(utf16beread(arr.slice(2).toString("binary")));
		}
		return arr.toString("binary");
	}

	if(typeof TextDecoder !== "undefined") try {
		if(debomit) {
			if(arr[0] == 0xFF && arr[1] == 0xFE) return utf8write(new TextDecoder("utf-16le").decode(arr.slice(2)));
			if(arr[0] == 0xFE && arr[1] == 0xFF) return utf8write(new TextDecoder("utf-16be").decode(arr.slice(2)));
		}
		var rev = {
			"\u20ac": "\x80", "\u201a": "\x82", "\u0192": "\x83", "\u201e": "\x84",
			"\u2026": "\x85", "\u2020": "\x86", "\u2021": "\x87", "\u02c6": "\x88",
			"\u2030": "\x89", "\u0160": "\x8a", "\u2039": "\x8b", "\u0152": "\x8c",
			"\u017d": "\x8e", "\u2018": "\x91", "\u2019": "\x92", "\u201c": "\x93",
			"\u201d": "\x94", "\u2022": "\x95", "\u2013": "\x96", "\u2014": "\x97",
			"\u02dc": "\x98", "\u2122": "\x99", "\u0161": "\x9a", "\u203a": "\x9b",
			"\u0153": "\x9c", "\u017e": "\x9e", "\u0178": "\x9f"
		};
		if(Array.isArray(arr)) arr = new Uint8Array(arr);
		return new TextDecoder("latin1").decode(arr).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(c) { return rev[c] || c; });
	} catch(e) {}

	var o = [];
	for(var i = 0; i != arr.length; ++i) o.push(String.fromCharCode(arr[i]));
	return o.join("");
}

function dup(o/*:any*/)/*:any*/ {
	if(typeof JSON != 'undefined' && !Array.isArray(o)) return JSON.parse(JSON.stringify(o));
	if(typeof o != 'object' || o == null) return o;
	if(o instanceof Date) return new Date(o.getTime());
	var out = {};
	for(var k in o) if(Object.prototype.hasOwnProperty.call(o, k)) out[k] = dup(o[k]);
	return out;
}

function fill(c/*:string*/,l/*:number*/)/*:string*/ { var o = ""; while(o.length < l) o+=c; return o; }

/* TODO: stress test */
function fuzzynum(s/*:string*/)/*:number*/ {
	var v/*:number*/ = Number(s);
	if(!isNaN(v)) return isFinite(v) ? v : NaN;
	if(!/\d/.test(s)) return v;
	var wt = 1;
	var ss = s.replace(/([\d]),([\d])/g,"$1$2").replace(/[$]/g,"").replace(/[%]/g, function() { wt *= 100; return "";});
	if(!isNaN(v = Number(ss))) return v / wt;
	ss = ss.replace(/[(](.*)[)]/,function($$, $1) { wt = -wt; return $1;});
	if(!isNaN(v = Number(ss))) return v / wt;
	return v;
}

/* NOTE: Chrome rejects bare times like 1:23 PM */
var FDRE1 = /^(0?\d|1[0-2])(?:|:([0-5]?\d)(?:|(\.\d+)(?:|:([0-5]?\d))|:([0-5]?\d)(|\.\d+)))\s+([ap])m?$/;

function fuzzytime1(M) /*:Date*/ {
    /* TODO: 1904 adjustment, keep in sync with base date */
    if(!M[2]) return new Date(1899,11,30,(+M[1]%12) + (M[7] == "p" ? 12 : 0), 0, 0, 0);
    if(M[3]) {
        if(M[4]) return new Date(1899,11,30,(+M[1]%12) + (M[7] == "p" ? 12 : 0), +M[2], +M[4], parseFloat(M[3])*1000);
        else return new Date(1899,11,30,(M[7] == "p" ? 12 : 0), +M[1], +M[2], parseFloat(M[3])*1000);
    }
    else if(M[5]) return new Date(1899,11,30, (+M[1]%12) + (M[7] == "p" ? 12 : 0), +M[2], +M[5], M[6] ? parseFloat(M[6]) * 1000 : 0);
    else return new Date(1899,11,30,(+M[1]%12) + (M[7] == "p" ? 12 : 0), +M[2], 0, 0);
}
var lower_months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
function fuzzydate(s/*:string*/)/*:Date*/ {
	var lower = s.toLowerCase();
	var lnos = lower.replace(/\s+/g, " ").trim();
	var M = lnos.match(FDRE1);
	if(M) return fuzzytime1(M);

	var o = new Date(s), n = new Date(NaN);
	var y = o.getYear(); o.getMonth(); var d = o.getDate();
	if(isNaN(d)) return n;
	if(lower.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
		lower = lower.replace(/[^a-z]/g,"").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/,"");
		if(lower.length > 3 && lower_months.indexOf(lower) == -1) return n;
	} else if(lower.replace(/[ap]m?/, "").match(/[a-z]/)) return n;
	if(y < 0 || y > 8099 || s.match(/[^-0-9:,\/\\]/)) return n;
	return o;
}

var split_regex = /*#__PURE__*/(function() {
	var safe_split_regex = "abacaba".split(/(:?b)/i).length == 5;
	return function split_regex(str/*:string*/, re, def/*:string*/)/*:Array<string>*/ {
		if(safe_split_regex || typeof re == "string") return str.split(re);
		var p = str.split(re), o = [p[0]];
		for(var i = 1; i < p.length; ++i) { o.push(def); o.push(p[i]); }
		return o;
	};
})();
function getdatastr(data)/*:?string*/ {
	if(!data) return null;
	if(data.content && data.type) return cc2str(data.content, true);
	if(data.data) return debom(data.data);
	if(data.asNodeBuffer && has_buf) return debom(data.asNodeBuffer().toString('binary'));
	if(data.asBinary) return debom(data.asBinary());
	if(data._data && data._data.getContent) return debom(cc2str(Array.prototype.slice.call(data._data.getContent(),0)));
	return null;
}

function getdatabin(data) {
	if(!data) return null;
	if(data.data) return char_codes(data.data);
	if(data.asNodeBuffer && has_buf) return data.asNodeBuffer();
	if(data._data && data._data.getContent) {
		var o = data._data.getContent();
		if(typeof o == "string") return char_codes(o);
		return Array.prototype.slice.call(o);
	}
	if(data.content && data.type) return data.content;
	return null;
}

function getdata(data) { return (data && data.name.slice(-4) === ".bin") ? getdatabin(data) : getdatastr(data); }

/* Part 2 Section 10.1.2 "Mapping Content Types" Names are case-insensitive */
/* OASIS does not comment on filename case sensitivity */
function safegetzipfile(zip, file/*:string*/) {
	var k = zip.FullPaths || keys(zip.files);
	var f = file.toLowerCase().replace(/[\/]/g, '\\'), g = f.replace(/\\/g,'\/');
	for(var i=0; i<k.length; ++i) {
		var n = k[i].replace(/^Root Entry[\/]/,"").toLowerCase();
		if(f == n || g == n) return zip.files ? zip.files[k[i]] : zip.FileIndex[i];
	}
	return null;
}

function getzipfile(zip, file/*:string*/) {
	var o = safegetzipfile(zip, file);
	if(o == null) throw new Error("Cannot find file " + file + " in zip");
	return o;
}

function getzipdata(zip, file/*:string*/, safe/*:?boolean*/)/*:any*/ {
	if(!safe) return getdata(getzipfile(zip, file));
	if(!file) return null;
	try { return getzipdata(zip, file); } catch(e) { return null; }
}

function getzipstr(zip, file/*:string*/, safe/*:?boolean*/)/*:?string*/ {
	if(!safe) return getdatastr(getzipfile(zip, file));
	if(!file) return null;
	try { return getzipstr(zip, file); } catch(e) { return null; }
}

function getzipbin(zip, file/*:string*/, safe/*:?boolean*/)/*:any*/ {
	if(!safe) return getdatabin(getzipfile(zip, file));
	if(!file) return null;
	try { return getzipbin(zip, file); } catch(e) { return null; }
}

function zipentries(zip) {
	var k = zip.FullPaths || keys(zip.files), o = [];
	for(var i = 0; i < k.length; ++i) if(k[i].slice(-1) != '/') o.push(k[i].replace(/^Root Entry[\/]/, ""));
	return o.sort();
}

function zip_add_file(zip, path, content) {
	if(zip.FullPaths) {
		if(typeof content == "string") {
			var res;
			if(has_buf) res = Buffer_from(content);
			/* TODO: investigate performance in Edge 13 */
			//else if(typeof TextEncoder !== "undefined") res = new TextEncoder().encode(content);
			else res = utf8decode(content);
			return CFB.utils.cfb_add(zip, path, res);
		}
		CFB.utils.cfb_add(zip, path, content);
	}
	else zip.file(path, content);
}

function zip_new() { return CFB.utils.cfb_new(); }

function zip_read(d, o) {
	switch(o.type) {
		case "base64": return CFB.read(d, { type: "base64" });
		case "binary": return CFB.read(d, { type: "binary" });
		case "buffer": case "array": return CFB.read(d, { type: "buffer" });
	}
	throw new Error("Unrecognized type " + o.type);
}

function resolve_path(path/*:string*/, base/*:string*/)/*:string*/ {
	if(path.charAt(0) == "/") return path.slice(1);
	var result = base.split('/');
	if(base.slice(-1) != "/") result.pop(); // folder path
	var target = path.split('/');
	while (target.length !== 0) {
		var step = target.shift();
		if (step === '..') result.pop();
		else if (step !== '.') result.push(step);
	}
	return result.join('/');
}
var XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
var attregexg=/([^"\s?>\/]+)\s*=\s*((?:")([^"]*)(?:")|(?:')([^']*)(?:')|([^'">\s]+))/g;
var tagregex1=/<[\/\?]?[a-zA-Z0-9:_-]+(?:\s+[^"\s?>\/]+\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s=]+))*\s*[\/\?]?>/mg, tagregex2 = /<[^>]*>/g;
var tagregex = /*#__PURE__*/XML_HEADER.match(tagregex1) ? tagregex1 : tagregex2;
var nsregex=/<\w*:/, nsregex2 = /<(\/?)\w+:/;
function parsexmltag(tag/*:string*/, skip_root/*:?boolean*/, skip_LC/*:?boolean*/)/*:any*/ {
	var z = ({}/*:any*/);
	var eq = 0, c = 0;
	for(; eq !== tag.length; ++eq) if((c = tag.charCodeAt(eq)) === 32 || c === 10 || c === 13) break;
	if(!skip_root) z[0] = tag.slice(0, eq);
	if(eq === tag.length) return z;
	var m = tag.match(attregexg), j=0, v="", i=0, q="", cc="", quot = 1;
	if(m) for(i = 0; i != m.length; ++i) {
		cc = m[i];
		for(c=0; c != cc.length; ++c) if(cc.charCodeAt(c) === 61) break;
		q = cc.slice(0,c).trim();
		while(cc.charCodeAt(c+1) == 32) ++c;
		quot = ((eq=cc.charCodeAt(c+1)) == 34 || eq == 39) ? 1 : 0;
		v = cc.slice(c+1+quot, cc.length-quot);
		for(j=0;j!=q.length;++j) if(q.charCodeAt(j) === 58) break;
		if(j===q.length) {
			if(q.indexOf("_") > 0) q = q.slice(0, q.indexOf("_")); // from ods
			z[q] = v;
			if(!skip_LC) z[q.toLowerCase()] = v;
		}
		else {
			var k = (j===5 && q.slice(0,5)==="xmlns"?"xmlns":"")+q.slice(j+1);
			if(z[k] && q.slice(j-3,j) == "ext") continue; // from ods
			z[k] = v;
			if(!skip_LC) z[k.toLowerCase()] = v;
		}
	}
	return z;
}
function strip_ns(x/*:string*/)/*:string*/ { return x.replace(nsregex2, "<$1"); }

var encodings = {
	'&quot;': '"',
	'&apos;': "'",
	'&gt;': '>',
	'&lt;': '<',
	'&amp;': '&'
};
var rencoding = /*#__PURE__*/evert(encodings);
//var rencstr = "&<>'\"".split("");

// TODO: CP remap (need to read file version to determine OS)
var unescapexml/*:StringConv*/ = /*#__PURE__*/(function() {
	/* 22.4.2.4 bstr (Basic String) */
	var encregex = /&(?:quot|apos|gt|lt|amp|#x?([\da-fA-F]+));/ig, coderegex = /_x([\da-fA-F]{4})_/ig;
	function raw_unescapexml(text/*:string*/)/*:string*/ {
		var s = text + '', i = s.indexOf("<![CDATA[");
		if(i == -1) return s.replace(encregex, function($$, $1) { return encodings[$$]||String.fromCharCode(parseInt($1,$$.indexOf("x")>-1?16:10))||$$; }).replace(coderegex,function(m,c) {return String.fromCharCode(parseInt(c,16));});
		var j = s.indexOf("]]>");
		return raw_unescapexml(s.slice(0, i)) + s.slice(i+9,j) + raw_unescapexml(s.slice(j+3));
	}
	return function unescapexml(text/*:string*/, xlsx/*:boolean*/) {
		var out = raw_unescapexml(text);
		return xlsx ? out.replace(/\r\n/g, "\n") : out;
	};
})();

var decregex=/[&<>'"]/g, charegex = /[\u0000-\u0008\u000b-\u001f\uFFFE-\uFFFF]/g;
function escapexml(text/*:string*/)/*:string*/{
	var s = text + '';
	return s.replace(decregex, function(y) { return rencoding[y]; }).replace(charegex,function(s) { return "_x" + ("000"+s.charCodeAt(0).toString(16)).slice(-4) + "_";});
}
function escapexmltag(text/*:string*/)/*:string*/{ return escapexml(text).replace(/ /g,"_x0020_"); }

var htmlcharegex = /[\u0000-\u001f]/g;
function escapehtml(text/*:string*/)/*:string*/{
	var s = text + '';
	return s.replace(decregex, function(y) { return rencoding[y]; }).replace(/\n/g, "<br/>").replace(htmlcharegex,function(s) { return "&#x" + ("000"+s.charCodeAt(0).toString(16)).slice(-4) + ";"; });
}

function escapexlml(text/*:string*/)/*:string*/{
	var s = text + '';
	return s.replace(decregex, function(y) { return rencoding[y]; }).replace(htmlcharegex,function(s) { return "&#x" + (s.charCodeAt(0).toString(16)).toUpperCase() + ";"; });
}

/* TODO: handle codepages */
var xlml_fixstr/*:StringConv*/ = /*#__PURE__*/(function() {
	var entregex = /&#(\d+);/g;
	function entrepl($$/*:string*/,$1/*:string*/)/*:string*/ { return String.fromCharCode(parseInt($1,10)); }
	return function xlml_fixstr(str/*:string*/)/*:string*/ { return str.replace(entregex,entrepl); };
})();
function xlml_unfixstr(str/*:string*/)/*:string*/ { return str.replace(/(\r\n|[\r\n])/g,"\&#10;"); }

/* note: xsd:boolean valid values: true / 1 / false / 0 */
function parsexmlbool(value/*:any*/)/*:boolean*/ {
	switch(value) {
		case 1: case true:  case '1': case 'true':  return true;
		case 0: case false: case '0': case 'false': return false;
		//default: throw new Error("Invalid xsd:boolean " + value);
	}
	return false;
}

function utf8reada(orig/*:string*/)/*:string*/ {
	var out = "", i = 0, c = 0, d = 0, e = 0, f = 0, w = 0;
	while (i < orig.length) {
		c = orig.charCodeAt(i++);
		if (c < 128) { out += String.fromCharCode(c); continue; }
		d = orig.charCodeAt(i++);
		if (c>191 && c<224) { f = ((c & 31) << 6); f |= (d & 63); out += String.fromCharCode(f); continue; }
		e = orig.charCodeAt(i++);
		if (c < 240) { out += String.fromCharCode(((c & 15) << 12) | ((d & 63) << 6) | (e & 63)); continue; }
		f = orig.charCodeAt(i++);
		w = (((c & 7) << 18) | ((d & 63) << 12) | ((e & 63) << 6) | (f & 63))-65536;
		out += String.fromCharCode(0xD800 + ((w>>>10)&1023));
		out += String.fromCharCode(0xDC00 + (w&1023));
	}
	return out;
}

function utf8readb(data) {
	var out = new_raw_buf(2*data.length), w, i, j = 1, k = 0, ww=0, c;
	for(i = 0; i < data.length; i+=j) {
		j = 1;
		if((c=data.charCodeAt(i)) < 128) w = c;
		else if(c < 224) { w = (c&31)*64+(data.charCodeAt(i+1)&63); j=2; }
		else if(c < 240) { w=(c&15)*4096+(data.charCodeAt(i+1)&63)*64+(data.charCodeAt(i+2)&63); j=3; }
		else { j = 4;
			w = (c & 7)*262144+(data.charCodeAt(i+1)&63)*4096+(data.charCodeAt(i+2)&63)*64+(data.charCodeAt(i+3)&63);
			w -= 65536; ww = 0xD800 + ((w>>>10)&1023); w = 0xDC00 + (w&1023);
		}
		if(ww !== 0) { out[k++] = ww&255; out[k++] = ww>>>8; ww = 0; }
		out[k++] = w%256; out[k++] = w>>>8;
	}
	return out.slice(0,k).toString('ucs2');
}

function utf8readc(data) { return Buffer_from(data, 'binary').toString('utf8'); }

var utf8corpus = "foo bar baz\u00e2\u0098\u0083\u00f0\u009f\u008d\u00a3";
var utf8read = has_buf && (/*#__PURE__*/utf8readc(utf8corpus) == /*#__PURE__*/utf8reada(utf8corpus) && utf8readc || /*#__PURE__*/utf8readb(utf8corpus) == /*#__PURE__*/utf8reada(utf8corpus) && utf8readb) || utf8reada;

var utf8write/*:StringConv*/ = has_buf ? function(data) { return Buffer_from(data, 'utf8').toString("binary"); } : function(orig/*:string*/)/*:string*/ {
	var out/*:Array<string>*/ = [], i = 0, c = 0, d = 0;
	while(i < orig.length) {
		c = orig.charCodeAt(i++);
		switch(true) {
			case c < 128: out.push(String.fromCharCode(c)); break;
			case c < 2048:
				out.push(String.fromCharCode(192 + (c >> 6)));
				out.push(String.fromCharCode(128 + (c & 63)));
				break;
			case c >= 55296 && c < 57344:
				c -= 55296; d = orig.charCodeAt(i++) - 56320 + (c<<10);
				out.push(String.fromCharCode(240 + ((d >>18) & 7)));
				out.push(String.fromCharCode(144 + ((d >>12) & 63)));
				out.push(String.fromCharCode(128 + ((d >> 6) & 63)));
				out.push(String.fromCharCode(128 + (d & 63)));
				break;
			default:
				out.push(String.fromCharCode(224 + (c >> 12)));
				out.push(String.fromCharCode(128 + ((c >> 6) & 63)));
				out.push(String.fromCharCode(128 + (c & 63)));
		}
	}
	return out.join("");
};

// matches <foo>...</foo> extracts content
var matchtag = /*#__PURE__*/(function() {
	var mtcache/*:{[k:string]:RegExp}*/ = ({}/*:any*/);
	return function matchtag(f/*:string*/,g/*:?string*/)/*:RegExp*/ {
		var t = f+"|"+(g||"");
		if(mtcache[t]) return mtcache[t];
		return (mtcache[t] = new RegExp('<(?:\\w+:)?'+f+'(?: xml:space="preserve")?(?:[^>]*)>([\\s\\S]*?)</(?:\\w+:)?'+f+'>',((g||"")/*:any*/)));
	};
})();

var htmldecode/*:{(s:string):string}*/ = /*#__PURE__*/(function() {
	var entities/*:Array<[RegExp, string]>*/ = [
		['nbsp', ' '], ['middot', '·'],
		['quot', '"'], ['apos', "'"], ['gt',   '>'], ['lt',   '<'], ['amp',  '&']
	].map(function(x/*:[string, string]*/) { return [new RegExp('&' + x[0] + ';', "ig"), x[1]]; });
	return function htmldecode(str/*:string*/)/*:string*/ {
		var o = str
				// Remove new lines and spaces from start of content
				.replace(/^[\t\n\r ]+/, "")
				// Remove new lines and spaces from end of content
				.replace(/[\t\n\r ]+$/,"")
				// Added line which removes any white space characters after and before html tags
				.replace(/>\s+/g,">").replace(/\s+</g,"<")
				// Replace remaining new lines and spaces with space
				.replace(/[\t\n\r ]+/g, " ")
				// Replace <br> tags with new lines
				.replace(/<\s*[bB][rR]\s*\/?>/g,"\n")
				// Strip HTML elements
				.replace(/<[^>]*>/g,"");
		for(var i = 0; i < entities.length; ++i) o = o.replace(entities[i][0], entities[i][1]);
		return o;
	};
})();

var vtregex = /*#__PURE__*/(function(){ var vt_cache = {};
	return function vt_regex(bt) {
		if(vt_cache[bt] !== undefined) return vt_cache[bt];
		return (vt_cache[bt] = new RegExp("<(?:vt:)?" + bt + ">([\\s\\S]*?)</(?:vt:)?" + bt + ">", 'g') );
};})();
var vtvregex = /<\/?(?:vt:)?variant>/g, vtmregex = /<(?:vt:)([^>]*)>([\s\S]*)</;
function parseVector(data/*:string*/, opts)/*:Array<{v:string,t:string}>*/ {
	var h = parsexmltag(data);

	var matches/*:Array<string>*/ = data.match(vtregex(h.baseType))||[];
	var res/*:Array<any>*/ = [];
	if(matches.length != h.size) {
		if(opts.WTF) throw new Error("unexpected vector length " + matches.length + " != " + h.size);
		return res;
	}
	matches.forEach(function(x/*:string*/) {
		var v = x.replace(vtvregex,"").match(vtmregex);
		if(v) res.push({v:utf8read(v[2]), t:v[1]});
	});
	return res;
}

var wtregex = /(^\s|\s$|\n)/;
function writetag(f/*:string*/,g/*:string*/)/*:string*/ { return '<' + f + (g.match(wtregex)?' xml:space="preserve"' : "") + '>' + g + '</' + f + '>'; }

function wxt_helper(h)/*:string*/ { return keys(h).map(function(k) { return " " + k + '="' + h[k] + '"';}).join(""); }
function writextag(f/*:string*/,g/*:?string*/,h) { return '<' + f + ((h != null) ? wxt_helper(h) : "") + ((g != null) ? (g.match(wtregex)?' xml:space="preserve"' : "") + '>' + g + '</' + f : "/") + '>';}

function write_w3cdtf(d/*:Date*/, t/*:?boolean*/)/*:string*/ { try { return d.toISOString().replace(/\.\d*/,""); } catch(e) { if(t) throw e; } return ""; }

function write_vt(s, xlsx/*:?boolean*/)/*:string*/ {
	switch(typeof s) {
		case 'string':
			var o = writextag('vt:lpwstr', escapexml(s));
			if(xlsx) o = o.replace(/&quot;/g, "_x0022_");
			return o;
		case 'number': return writextag((s|0)==s?'vt:i4':'vt:r8', escapexml(String(s)));
		case 'boolean': return writextag('vt:bool',s?'true':'false');
	}
	if(s instanceof Date) return writextag('vt:filetime', write_w3cdtf(s));
	throw new Error("Unable to serialize " + s);
}

function xlml_normalize(d)/*:string*/ {
	if(has_buf &&/*::typeof Buffer !== "undefined" && d != null && d instanceof Buffer &&*/ Buffer.isBuffer(d)) return d.toString('utf8');
	if(typeof d === 'string') return d;
	/* duktape */
	if(typeof Uint8Array !== 'undefined' && d instanceof Uint8Array) return utf8read(a2s(ab2a(d)));
	throw new Error("Bad input format: expected Buffer or string");
}
/* UOS uses CJK in tags */
var xlmlregex = /<(\/?)([^\s?><!\/:]*:|)([^\s?<>:\/]+)(?:[\s?:\/](?:[^>=]|="[^"]*?")*)?>/mg;
//var xlmlregex = /<(\/?)([a-z0-9]*:|)(\w+)[^>]*>/mg;

var XMLNS = ({
	CORE_PROPS: 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties',
	CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
	EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
	CT: 'http://schemas.openxmlformats.org/package/2006/content-types',
	RELS: 'http://schemas.openxmlformats.org/package/2006/relationships',
	TCMNT: 'http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments',
	'dc': 'http://purl.org/dc/elements/1.1/',
	'dcterms': 'http://purl.org/dc/terms/',
	'dcmitype': 'http://purl.org/dc/dcmitype/',
	'mx': 'http://schemas.microsoft.com/office/mac/excel/2008/main',
	'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
	'sjs': 'http://schemas.openxmlformats.org/package/2006/sheetjs/core-properties',
	'vt': 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes',
	'xsi': 'http://www.w3.org/2001/XMLSchema-instance',
	'xsd': 'http://www.w3.org/2001/XMLSchema'
}/*:any*/);

var XMLNS_main = [
	'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
	'http://purl.oclc.org/ooxml/spreadsheetml/main',
	'http://schemas.microsoft.com/office/excel/2006/main',
	'http://schemas.microsoft.com/office/excel/2006/2'
];

var XLMLNS = ({
	'o':    'urn:schemas-microsoft-com:office:office',
	'x':    'urn:schemas-microsoft-com:office:excel',
	'ss':   'urn:schemas-microsoft-com:office:spreadsheet',
	'dt':   'uuid:C2F41010-65B3-11d1-A29F-00AA00C14882',
	'mv':   'http://macVmlSchemaUri',
	'v':    'urn:schemas-microsoft-com:vml',
	'html': 'http://www.w3.org/TR/REC-html40'
}/*:any*/);
function read_double_le(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ {
	var s = 1 - 2 * (b[idx + 7] >>> 7);
	var e = ((b[idx + 7] & 0x7f) << 4) + ((b[idx + 6] >>> 4) & 0x0f);
	var m = (b[idx+6]&0x0f);
	for(var i = 5; i >= 0; --i) m = m * 256 + b[idx + i];
	if(e == 0x7ff) return m == 0 ? (s * Infinity) : NaN;
	if(e == 0) e = -1022;
	else { e -= 1023; m += Math.pow(2,52); }
	return s * Math.pow(2, e - 52) * m;
}

function write_double_le(b/*:RawBytes|CFBlob*/, v/*:number*/, idx/*:number*/) {
	var bs = ((((v < 0) || (1/v == -Infinity)) ? 1 : 0) << 7), e = 0, m = 0;
	var av = bs ? (-v) : v;
	if(!isFinite(av)) { e = 0x7ff; m = isNaN(v) ? 0x6969 : 0; }
	else if(av == 0) e = m = 0;
	else {
		e = Math.floor(Math.log(av) / Math.LN2);
		m = av * Math.pow(2, 52 - e);
		if((e <= -1023) && (!isFinite(m) || (m < Math.pow(2,52)))) { e = -1022; }
		else { m -= Math.pow(2,52); e+=1023; }
	}
	for(var i = 0; i <= 5; ++i, m/=256) b[idx + i] = m & 0xff;
	b[idx + 6] = ((e & 0x0f) << 4) | (m & 0xf);
	b[idx + 7] = (e >> 4) | bs;
}

var ___toBuffer = function(bufs/*:Array<Array<RawBytes> >*/)/*:RawBytes*/ { var x=[],w=10240; for(var i=0;i<bufs[0].length;++i) if(bufs[0][i]) for(var j=0,L=bufs[0][i].length;j<L;j+=w) x.push.apply(x, bufs[0][i].slice(j,j+w)); return x; };
var __toBuffer = has_buf ? function(bufs) { return (bufs[0].length > 0 && Buffer.isBuffer(bufs[0][0])) ? Buffer.concat(bufs[0].map(function(x) { return Buffer.isBuffer(x) ? x : Buffer_from(x); })) : ___toBuffer(bufs);} : ___toBuffer;

var ___utf16le = function(b/*:RawBytes|CFBlob*/,s/*:number*/,e/*:number*/)/*:string*/ { var ss/*:Array<string>*/=[]; for(var i=s; i<e; i+=2) ss.push(String.fromCharCode(__readUInt16LE(b,i))); return ss.join("").replace(chr0,''); };
var __utf16le = has_buf ? function(b/*:RawBytes|CFBlob*/,s/*:number*/,e/*:number*/)/*:string*/ { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/ || !buf_utf16le) return ___utf16le(b,s,e); return b.toString('utf16le',s,e).replace(chr0,'')/*.replace(chr1,'!')*/; } : ___utf16le;

var ___hexlify = function(b/*:RawBytes|CFBlob*/,s/*:number*/,l/*:number*/)/*:string*/ { var ss/*:Array<string>*/=[]; for(var i=s; i<s+l; ++i) ss.push(("0" + b[i].toString(16)).slice(-2)); return ss.join(""); };
var __hexlify = has_buf ? function(b/*:RawBytes|CFBlob*/,s/*:number*/,l/*:number*/)/*:string*/ { return Buffer.isBuffer(b)/*:: && b instanceof Buffer*/ ? b.toString('hex',s,s+l) : ___hexlify(b,s,l); } : ___hexlify;

var ___utf8 = function(b/*:RawBytes|CFBlob*/,s/*:number*/,e/*:number*/) { var ss=[]; for(var i=s; i<e; i++) ss.push(String.fromCharCode(__readUInt8(b,i))); return ss.join(""); };
var __utf8 = has_buf ? function utf8_b(b/*:RawBytes|CFBlob*/, s/*:number*/, e/*:number*/) { return (Buffer.isBuffer(b)/*:: && (b instanceof Buffer)*/) ? b.toString('utf8',s,e) : ___utf8(b,s,e); } : ___utf8;

var ___lpstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
var __lpstr = ___lpstr;

var ___cpstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
var __cpstr = ___cpstr;

var ___lpwstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = 2*__readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len-1) : "";};
var __lpwstr = ___lpwstr;

var ___lpp4 = function lpp4_(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? __utf16le(b, i+4,i+4+len) : "";};
var __lpp4 = ___lpp4;

var ___8lpp4 = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? __utf8(b, i+4,i+4+len) : "";};
var __8lpp4 = ___8lpp4;

var ___double = function(b/*:RawBytes|CFBlob*/, idx/*:number*/) { return read_double_le(b, idx);};
var __double = ___double;

var is_buf = function is_buf_a(a) { return Array.isArray(a) || (typeof Uint8Array !== "undefined" && a instanceof Uint8Array); };

if(has_buf/*:: && typeof Buffer !== 'undefined'*/) {
	__lpstr = function lpstr_b(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/) return ___lpstr(b, i); var len = b.readUInt32LE(i); return len > 0 ? b.toString('utf8',i+4,i+4+len-1) : "";};
	__cpstr = function cpstr_b(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/) return ___cpstr(b, i); var len = b.readUInt32LE(i); return len > 0 ? b.toString('utf8',i+4,i+4+len-1) : "";};
	__lpwstr = function lpwstr_b(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/ || !buf_utf16le) return ___lpwstr(b, i); var len = 2*b.readUInt32LE(i); return b.toString('utf16le',i+4,i+4+len-1);};
	__lpp4 = function lpp4_b(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/ || !buf_utf16le) return ___lpp4(b, i); var len = b.readUInt32LE(i); return b.toString('utf16le',i+4,i+4+len);};
	__8lpp4 = function lpp4_8b(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(!Buffer.isBuffer(b)/*:: || !(b instanceof Buffer)*/) return ___8lpp4(b, i); var len = b.readUInt32LE(i); return b.toString('utf8',i+4,i+4+len);};
	__double = function double_(b/*:RawBytes|CFBlob*/, i/*:number*/) { if(Buffer.isBuffer(b)/*::&& b instanceof Buffer*/) return b.readDoubleLE(i); return ___double(b,i); };
	is_buf = function is_buf_b(a) { return Buffer.isBuffer(a) || Array.isArray(a) || (typeof Uint8Array !== "undefined" && a instanceof Uint8Array); };
}

/* from js-xls */
function cpdoit() {
	__utf16le = function(b/*:RawBytes|CFBlob*/,s/*:number*/,e/*:number*/) { return $cptable.utils.decode(1200, b.slice(s,e)).replace(chr0, ''); };
	__utf8 = function(b/*:RawBytes|CFBlob*/,s/*:number*/,e/*:number*/) { return $cptable.utils.decode(65001, b.slice(s,e)); };
	__lpstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? $cptable.utils.decode(current_ansi, b.slice(i+4, i+4+len-1)) : "";};
	__cpstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? $cptable.utils.decode(current_codepage, b.slice(i+4, i+4+len-1)) : "";};
	__lpwstr = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = 2*__readUInt32LE(b,i); return len > 0 ? $cptable.utils.decode(1200, b.slice(i+4,i+4+len-1)) : "";};
	__lpp4 = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? $cptable.utils.decode(1200, b.slice(i+4,i+4+len)) : "";};
	__8lpp4 = function(b/*:RawBytes|CFBlob*/,i/*:number*/) { var len = __readUInt32LE(b,i); return len > 0 ? $cptable.utils.decode(65001, b.slice(i+4,i+4+len)) : "";};
}
if(typeof $cptable !== 'undefined') cpdoit();

var __readUInt8 = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { return b[idx]; };
var __readUInt16LE = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { return (b[idx+1]*(1<<8))+b[idx]; };
var __readInt16LE = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { var u = (b[idx+1]*(1<<8))+b[idx]; return (u < 0x8000) ? u : ((0xffff - u + 1) * -1); };
var __readUInt32LE = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { return b[idx+3]*(1<<24)+(b[idx+2]<<16)+(b[idx+1]<<8)+b[idx]; };
var __readInt32LE = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { return (b[idx+3]<<24)|(b[idx+2]<<16)|(b[idx+1]<<8)|b[idx]; };
var __readInt32BE = function(b/*:RawBytes|CFBlob*/, idx/*:number*/)/*:number*/ { return (b[idx]<<24)|(b[idx+1]<<16)|(b[idx+2]<<8)|b[idx+3]; };

function ReadShift(size/*:number*/, t/*:?string*/)/*:number|string*/ {
	var o="", oI/*:: :number = 0*/, oR, oo=[], w, vv, i, loc;
	switch(t) {
		case 'dbcs':
			loc = this.l;
			if(has_buf && Buffer.isBuffer(this)  && buf_utf16le) o = this.slice(this.l, this.l+2*size).toString("utf16le");
			else for(i = 0; i < size; ++i) { o+=String.fromCharCode(__readUInt16LE(this, loc)); loc+=2; }
			size *= 2;
			break;

		case 'utf8': o = __utf8(this, this.l, this.l + size); break;
		case 'utf16le': size *= 2; o = __utf16le(this, this.l, this.l + size); break;

		case 'wstr':
			if(typeof $cptable !== 'undefined') o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l+2*size));
			else return ReadShift.call(this, size, 'dbcs');
			size = 2 * size; break;

		/* [MS-OLEDS] 2.1.4 LengthPrefixedAnsiString */
		case 'lpstr-ansi': o = __lpstr(this, this.l); size = 4 + __readUInt32LE(this, this.l); break;
		case 'lpstr-cp': o = __cpstr(this, this.l); size = 4 + __readUInt32LE(this, this.l); break;
		/* [MS-OLEDS] 2.1.5 LengthPrefixedUnicodeString */
		case 'lpwstr': o = __lpwstr(this, this.l); size = 4 + 2 * __readUInt32LE(this, this.l); break;
		/* [MS-OFFCRYPTO] 2.1.2 Length-Prefixed Padded Unicode String (UNICODE-LP-P4) */
		case 'lpp4': size = 4 +  __readUInt32LE(this, this.l); o = __lpp4(this, this.l); if(size & 0x02) size += 2; break;
		/* [MS-OFFCRYPTO] 2.1.3 Length-Prefixed UTF-8 String (UTF-8-LP-P4) */
		case '8lpp4': size = 4 +  __readUInt32LE(this, this.l); o = __8lpp4(this, this.l); if(size & 0x03) size += 4 - (size & 0x03); break;

		case 'cstr': size = 0; o = "";
			while((w=__readUInt8(this, this.l + size++))!==0) oo.push(_getchar(w));
			o = oo.join(""); break;
		case '_wstr': size = 0; o = "";
			while((w=__readUInt16LE(this,this.l +size))!==0){oo.push(_getchar(w));size+=2;}
			size+=2; o = oo.join(""); break;

		/* sbcs and dbcs support continue records in the SST way TODO codepages */
		case 'dbcs-cont': o = ""; loc = this.l;
			for(i = 0; i < size; ++i) {
				if(this.lens && this.lens.indexOf(loc) !== -1) {
					w = __readUInt8(this, loc);
					this.l = loc + 1;
					vv = ReadShift.call(this, size-i, w ? 'dbcs-cont' : 'sbcs-cont');
					return oo.join("") + vv;
				}
				oo.push(_getchar(__readUInt16LE(this, loc)));
				loc+=2;
			} o = oo.join(""); size *= 2; break;

		case 'cpstr':
			if(typeof $cptable !== 'undefined') {
				o = $cptable.utils.decode(current_codepage, this.slice(this.l, this.l + size));
				break;
			}
		/* falls through */
		case 'sbcs-cont': o = ""; loc = this.l;
			for(i = 0; i != size; ++i) {
				if(this.lens && this.lens.indexOf(loc) !== -1) {
					w = __readUInt8(this, loc);
					this.l = loc + 1;
					vv = ReadShift.call(this, size-i, w ? 'dbcs-cont' : 'sbcs-cont');
					return oo.join("") + vv;
				}
				oo.push(_getchar(__readUInt8(this, loc)));
				loc+=1;
			} o = oo.join(""); break;

		default:
	switch(size) {
		case 1: oI = __readUInt8(this, this.l); this.l++; return oI;
		case 2: oI = (t === 'i' ? __readInt16LE : __readUInt16LE)(this, this.l); this.l += 2; return oI;
		case 4: case -4:
			if(t === 'i' || ((this[this.l+3] & 0x80)===0)) { oI = ((size > 0) ? __readInt32LE : __readInt32BE)(this, this.l); this.l += 4; return oI; }
			else { oR = __readUInt32LE(this, this.l); this.l += 4; } return oR;
		case 8: case -8:
			if(t === 'f') {
				if(size == 8) oR = __double(this, this.l);
				else oR = __double([this[this.l+7],this[this.l+6],this[this.l+5],this[this.l+4],this[this.l+3],this[this.l+2],this[this.l+1],this[this.l+0]], 0);
				this.l += 8; return oR;
			} else size = 8;
		/* falls through */
		case 16: o = __hexlify(this, this.l, size); break;
	}}
	this.l+=size; return o;
}

var __writeUInt32LE = function(b/*:RawBytes|CFBlob*/, val/*:number*/, idx/*:number*/)/*:void*/ { b[idx] = (val & 0xFF); b[idx+1] = ((val >>> 8) & 0xFF); b[idx+2] = ((val >>> 16) & 0xFF); b[idx+3] = ((val >>> 24) & 0xFF); };
var __writeInt32LE  = function(b/*:RawBytes|CFBlob*/, val/*:number*/, idx/*:number*/)/*:void*/ { b[idx] = (val & 0xFF); b[idx+1] = ((val >> 8) & 0xFF); b[idx+2] = ((val >> 16) & 0xFF); b[idx+3] = ((val >> 24) & 0xFF); };
var __writeUInt16LE = function(b/*:RawBytes|CFBlob*/, val/*:number*/, idx/*:number*/)/*:void*/ { b[idx] = (val & 0xFF); b[idx+1] = ((val >>> 8) & 0xFF); };

function WriteShift(t/*:number*/, val/*:string|number*/, f/*:?string*/)/*:any*/ {
	var size = 0, i = 0;
	if(f === 'dbcs') {
		/*:: if(typeof val !== 'string') throw new Error("unreachable"); */
		for(i = 0; i != val.length; ++i) __writeUInt16LE(this, val.charCodeAt(i), this.l + 2 * i);
		size = 2 * val.length;
	} else if(f === 'sbcs' || f == 'cpstr') {
		if(typeof $cptable !== 'undefined' && current_ansi == 874) {
			/* TODO: use tables directly, don't encode */
			/*:: if(typeof val !== "string") throw new Error("unreachable"); */
			for(i = 0; i != val.length; ++i) {
				var cpp = $cptable.utils.encode(current_ansi, val.charAt(i));
				this[this.l + i] = cpp[0];
			}
			size = val.length;
		} else if(typeof $cptable !== 'undefined' && f == 'cpstr') {
			cpp = $cptable.utils.encode(current_codepage, val);
			/* replace null bytes with _ when relevant */
      if(cpp.length == val.length) for(i = 0; i < val.length; ++i) if(cpp[i] == 0 && val.charCodeAt(i) != 0) cpp[i] = 0x5F;
      if(cpp.length == 2 * val.length) for(i = 0; i < val.length; ++i) if(cpp[2*i] == 0 && cpp[2*i+1] == 0 && val.charCodeAt(i) != 0) cpp[2*i] = 0x5F;
			for(i = 0; i < cpp.length; ++i) this[this.l + i] = cpp[i];
			size = cpp.length;
		} else {
			/*:: if(typeof val !== 'string') throw new Error("unreachable"); */
			val = val.replace(/[^\x00-\x7F]/g, "_");
			/*:: if(typeof val !== 'string') throw new Error("unreachable"); */
			for(i = 0; i != val.length; ++i) this[this.l + i] = (val.charCodeAt(i) & 0xFF);
			size = val.length;
		}
	} else if(f === 'hex') {
		for(; i < t; ++i) {
			/*:: if(typeof val !== "string") throw new Error("unreachable"); */
			this[this.l++] = (parseInt(val.slice(2*i, 2*i+2), 16)||0);
		} return this;
	} else if(f === 'utf16le') {
			/*:: if(typeof val !== "string") throw new Error("unreachable"); */
			var end/*:number*/ = Math.min(this.l + t, this.length);
			for(i = 0; i < Math.min(val.length, t); ++i) {
				var cc = val.charCodeAt(i);
				this[this.l++] = (cc & 0xff);
				this[this.l++] = (cc >> 8);
			}
			while(this.l < end) this[this.l++] = 0;
			return this;
	} else /*:: if(typeof val === 'number') */ switch(t) {
		case  1: size = 1; this[this.l] = val&0xFF; break;
		case  2: size = 2; this[this.l] = val&0xFF; val >>>= 8; this[this.l+1] = val&0xFF; break;
		case  3: size = 3; this[this.l] = val&0xFF; val >>>= 8; this[this.l+1] = val&0xFF; val >>>= 8; this[this.l+2] = val&0xFF; break;
		case  4: size = 4; __writeUInt32LE(this, val, this.l); break;
		case  8: size = 8; if(f === 'f') { write_double_le(this, val, this.l); break; }
		/* falls through */
		case 16: break;
		case -4: size = 4; __writeInt32LE(this, val, this.l); break;
	}
	this.l += size; return this;
}

function CheckField(hexstr/*:string*/, fld/*:string*/)/*:void*/ {
	var m = __hexlify(this,this.l,hexstr.length>>1);
	if(m !== hexstr) throw new Error(fld + 'Expected ' + hexstr + ' saw ' + m);
	this.l += hexstr.length>>1;
}

function prep_blob(blob, pos/*:number*/)/*:void*/ {
	blob.l = pos;
	blob.read_shift = /*::(*/ReadShift/*:: :any)*/;
	blob.chk = CheckField;
	blob.write_shift = WriteShift;
}

function parsenoop(blob, length/*:: :number, opts?:any */) { blob.l += length; }

function new_buf(sz/*:number*/)/*:Block*/ {
	var o = new_raw_buf(sz);
	prep_blob(o, 0);
	return o;
}

/* [MS-XLSB] 2.1.4 Record */
function recordhopper(data, cb/*:RecordHopperCB*/, opts/*:?any*/) {
	if(!data) return;
	var tmpbyte, cntbyte, length;
	prep_blob(data, data.l || 0);
	var L = data.length, RT = 0, tgt = 0;
	while(data.l < L) {
		RT = data.read_shift(1);
		if(RT & 0x80) RT = (RT & 0x7F) + ((data.read_shift(1) & 0x7F)<<7);
		var R = XLSBRecordEnum[RT] || XLSBRecordEnum[0xFFFF];
		tmpbyte = data.read_shift(1);
		length = tmpbyte & 0x7F;
		for(cntbyte = 1; cntbyte <4 && (tmpbyte & 0x80); ++cntbyte) length += ((tmpbyte = data.read_shift(1)) & 0x7F)<<(7*cntbyte);
		tgt = data.l + length;
		var d = R.f && R.f(data, length, opts);
		data.l = tgt;
		if(cb(d, R, RT)) return;
	}
}

/* control buffer usage for fixed-length buffers */
function buf_array()/*:BufArray*/ {
	var bufs/*:Array<Block>*/ = [], blksz = has_buf ? 256 : 2048;
	var newblk = function ba_newblk(sz/*:number*/)/*:Block*/ {
		var o/*:Block*/ = (new_buf(sz)/*:any*/);
		prep_blob(o, 0);
		return o;
	};

	var curbuf/*:Block*/ = newblk(blksz);

	var endbuf = function ba_endbuf() {
		if(!curbuf) return;
		// workaround for new Buffer(3).slice(0,0) bug in bun 0.1.3
		if(curbuf.l) {
			if(curbuf.length > curbuf.l) { curbuf = curbuf.slice(0, curbuf.l); curbuf.l = curbuf.length; }
			if(curbuf.length > 0) bufs.push(curbuf);
		}
		curbuf = null;
	};

	var next = function ba_next(sz/*:number*/)/*:Block*/ {
		if(curbuf && (sz < (curbuf.length - curbuf.l))) return curbuf;
		endbuf();
		return (curbuf = newblk(Math.max(sz+1, blksz)));
	};

	var end = function ba_end() {
		endbuf();
		return bconcat(bufs);
	};

	var push = function ba_push(buf) { endbuf(); curbuf = buf; if(curbuf.l == null) curbuf.l = curbuf.length; next(blksz); };

	return ({ next:next, push:push, end:end, _bufs:bufs }/*:any*/);
}

function write_record(ba/*:BufArray*/, type/*:number*/, payload, length/*:?number*/) {
	var t/*:number*/ = +type, l;
	if(isNaN(t)) return; // TODO: throw something here?
	if(!length) length = XLSBRecordEnum[t].p || (payload||[]).length || 0;
	l = 1 + (t >= 0x80 ? 1 : 0) + 1/* + length*/;
	if(length >= 0x80) ++l; if(length >= 0x4000) ++l; if(length >= 0x200000) ++l;
	var o = ba.next(l);
	if(t <= 0x7F) o.write_shift(1, t);
	else {
		o.write_shift(1, (t & 0x7F) + 0x80);
		o.write_shift(1, (t >> 7));
	}
	for(var i = 0; i != 4; ++i) {
		if(length >= 0x80) { o.write_shift(1, (length & 0x7F)+0x80); length >>= 7; }
		else { o.write_shift(1, length); break; }
	}
	if(/*:: length != null &&*/length > 0 && is_buf(payload)) ba.push(payload);
}
/* XLS ranges enforced */
function shift_cell_xls(cell/*:CellAddress*/, tgt/*:any*/, opts/*:?any*/)/*:CellAddress*/ {
	var out = dup(cell);
	if(tgt.s) {
		if(out.cRel) out.c += tgt.s.c;
		if(out.rRel) out.r += tgt.s.r;
	} else {
		if(out.cRel) out.c += tgt.c;
		if(out.rRel) out.r += tgt.r;
	}
	if(!opts || opts.biff < 12) {
		while(out.c >= 0x100) out.c -= 0x100;
		while(out.r >= 0x10000) out.r -= 0x10000;
	}
	return out;
}

function shift_range_xls(cell, range, opts) {
	var out = dup(cell);
	out.s = shift_cell_xls(out.s, range.s, opts);
	out.e = shift_cell_xls(out.e, range.s, opts);
	return out;
}

function encode_cell_xls(c/*:CellAddress*/, biff/*:number*/)/*:string*/ {
	if(c.cRel && c.c < 0) { c = dup(c); while(c.c < 0) c.c += (biff > 8) ? 0x4000 : 0x100; }
	if(c.rRel && c.r < 0) { c = dup(c); while(c.r < 0) c.r += (biff > 8) ? 0x100000 : ((biff > 5) ? 0x10000 : 0x4000); }
	var s = encode_cell(c);
	if(!c.cRel && c.cRel != null) s = fix_col(s);
	if(!c.rRel && c.rRel != null) s = fix_row(s);
	return s;
}

function encode_range_xls(r, opts)/*:string*/ {
	if(r.s.r == 0 && !r.s.rRel) {
		if(r.e.r == (opts.biff >= 12 ? 0xFFFFF : (opts.biff >= 8 ? 0x10000 : 0x4000)) && !r.e.rRel) {
			return (r.s.cRel ? "" : "$") + encode_col(r.s.c) + ":" + (r.e.cRel ? "" : "$") + encode_col(r.e.c);
		}
	}
	if(r.s.c == 0 && !r.s.cRel) {
		if(r.e.c == (opts.biff >= 12 ? 0x3FFF : 0xFF) && !r.e.cRel) {
			return (r.s.rRel ? "" : "$") + encode_row(r.s.r) + ":" + (r.e.rRel ? "" : "$") + encode_row(r.e.r);
		}
	}
	return encode_cell_xls(r.s, opts.biff) + ":" + encode_cell_xls(r.e, opts.biff);
}
function decode_row(rowstr/*:string*/)/*:number*/ { return parseInt(unfix_row(rowstr),10) - 1; }
function encode_row(row/*:number*/)/*:string*/ { return "" + (row + 1); }
function fix_row(cstr/*:string*/)/*:string*/ { return cstr.replace(/([A-Z]|^)(\d+)$/,"$1$$$2"); }
function unfix_row(cstr/*:string*/)/*:string*/ { return cstr.replace(/\$(\d+)$/,"$1"); }

function decode_col(colstr/*:string*/)/*:number*/ { var c = unfix_col(colstr), d = 0, i = 0; for(; i !== c.length; ++i) d = 26*d + c.charCodeAt(i) - 64; return d - 1; }
function encode_col(col/*:number*/)/*:string*/ { if(col < 0) throw new Error("invalid column " + col); var s=""; for(++col; col; col=Math.floor((col-1)/26)) s = String.fromCharCode(((col-1)%26) + 65) + s; return s; }
function fix_col(cstr/*:string*/)/*:string*/ { return cstr.replace(/^([A-Z])/,"$$$1"); }
function unfix_col(cstr/*:string*/)/*:string*/ { return cstr.replace(/^\$([A-Z])/,"$1"); }

function split_cell(cstr/*:string*/)/*:Array<string>*/ { return cstr.replace(/(\$?[A-Z]*)(\$?\d*)/,"$1,$2").split(","); }
function decode_cell(cstr/*:string*/)/*:CellAddress*/ {
	var R = 0, C = 0;
	for(var i = 0; i < cstr.length; ++i) {
		var cc = cstr.charCodeAt(i);
		if(cc >= 48 && cc <= 57) R = 10 * R + (cc - 48);
		else if(cc >= 65 && cc <= 90) C = 26 * C + (cc - 64);
	}
	return { c: C - 1, r:R - 1 };
}
function encode_cell(cell/*:CellAddress*/)/*:string*/ {
	var col = cell.c + 1;
	var s="";
	for(; col; col=((col-1)/26)|0) s = String.fromCharCode(((col-1)%26) + 65) + s;
	return s + (cell.r + 1);
}
function decode_range(range/*:string*/)/*:Range*/ {
	var idx = range.indexOf(":");
	if(idx == -1) return { s: decode_cell(range), e: decode_cell(range) };
	return { s: decode_cell(range.slice(0, idx)), e: decode_cell(range.slice(idx + 1)) };
}
/*# if only one arg, it is assumed to be a Range.  If 2 args, both are cell addresses */
function encode_range(cs/*:CellAddrSpec|Range*/,ce/*:?CellAddrSpec*/)/*:string*/ {
	if(typeof ce === 'undefined' || typeof ce === 'number') {
/*:: if(!(cs instanceof Range)) throw "unreachable"; */
		return encode_range(cs.s, cs.e);
	}
/*:: if((cs instanceof Range)) throw "unreachable"; */
	if(typeof cs !== 'string') cs = encode_cell((cs/*:any*/));
	if(typeof ce !== 'string') ce = encode_cell((ce/*:any*/));
/*:: if(typeof cs !== 'string') throw "unreachable"; */
/*:: if(typeof ce !== 'string') throw "unreachable"; */
	return cs == ce ? cs : cs + ":" + ce;
}
function fix_range(a1/*:string*/)/*:string*/ {
	var s = decode_range(a1);
	return "$" + encode_col(s.s.c) + "$" + encode_row(s.s.r) + ":$" + encode_col(s.e.c) + "$" + encode_row(s.e.r);
}

// List of invalid characters needs to be tested further
function formula_quote_sheet_name(sname/*:string*/, opts)/*:string*/ {
	if(!sname && !(opts && opts.biff <= 5 && opts.biff >= 2)) throw new Error("empty sheet name");
	if (/[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(sname)) return "'" + sname.replace(/'/g, "''") + "'";
	return sname;
}

function safe_decode_range(range/*:string*/)/*:Range*/ {
	var o = {s:{c:0,r:0},e:{c:0,r:0}};
	var idx = 0, i = 0, cc = 0;
	var len = range.length;
	for(idx = 0; i < len; ++i) {
		if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
		idx = 26*idx + cc;
	}
	o.s.c = --idx;

	for(idx = 0; i < len; ++i) {
		if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
		idx = 10*idx + cc;
	}
	o.s.r = --idx;

	if(i === len || cc != 10) { o.e.c=o.s.c; o.e.r=o.s.r; return o; }
	++i;

	for(idx = 0; i != len; ++i) {
		if((cc=range.charCodeAt(i)-64) < 1 || cc > 26) break;
		idx = 26*idx + cc;
	}
	o.e.c = --idx;

	for(idx = 0; i != len; ++i) {
		if((cc=range.charCodeAt(i)-48) < 0 || cc > 9) break;
		idx = 10*idx + cc;
	}
	o.e.r = --idx;
	return o;
}

function safe_format_cell(cell/*:Cell*/, v/*:any*/) {
	var q = (cell.t == 'd' && v instanceof Date);
	if(cell.z != null) try { return (cell.w = SSF_format(cell.z, q ? datenum(v) : v)); } catch(e) { }
	try { return (cell.w = SSF_format((cell.XF||{}).numFmtId||(q ? 14 : 0),  q ? datenum(v) : v)); } catch(e) { return ''+v; }
}

function format_cell(cell/*:Cell*/, v/*:any*/, o/*:any*/) {
	if(cell == null || cell.t == null || cell.t == 'z') return "";
	if(cell.w !== undefined) return cell.w;
	if(cell.t == 'd' && !cell.z && o && o.dateNF) cell.z = o.dateNF;
	if(cell.t == "e") return BErr[cell.v] || cell.v;
	if(v == undefined) return safe_format_cell(cell, cell.v);
	return safe_format_cell(cell, v);
}

function sheet_to_workbook(sheet/*:Worksheet*/, opts)/*:Workbook*/ {
	var n = opts && opts.sheet ? opts.sheet : "Sheet1";
	var sheets = {}; sheets[n] = sheet;
	return { SheetNames: [n], Sheets: sheets };
}

function sheet_add_aoa(_ws/*:?Worksheet*/, data/*:AOA*/, opts/*:?any*/)/*:Worksheet*/ {
	var o = opts || {};
	var dense = _ws ? (_ws["!data"] != null) : o.dense;
	var ws/*:Worksheet*/ = _ws || ({}/*:any*/);
	if(dense && !ws["!data"]) ws["!data"] = [];
	var _R = 0, _C = 0;
	if(ws && o.origin != null) {
		if(typeof o.origin == 'number') _R = o.origin;
		else {
			var _origin/*:CellAddress*/ = typeof o.origin == "string" ? decode_cell(o.origin) : o.origin;
			_R = _origin.r; _C = _origin.c;
		}
		if(!ws["!ref"]) ws["!ref"] = "A1:A1";
	}
	var range/*:Range*/ = ({s: {c:10000000, r:10000000}, e: {c:0, r:0}}/*:any*/);
	if(ws['!ref']) {
		var _range = safe_decode_range(ws['!ref']);
		range.s.c = _range.s.c;
		range.s.r = _range.s.r;
		range.e.c = Math.max(range.e.c, _range.e.c);
		range.e.r = Math.max(range.e.r, _range.e.r);
		if(_R == -1) range.e.r = _R = _range.e.r + 1;
	}
	var row = [];
	for(var R = 0; R != data.length; ++R) {
		if(!data[R]) continue;
		if(!Array.isArray(data[R])) throw new Error("aoa_to_sheet expects an array of arrays");
		var __R = _R + R, __Rstr = "" + (__R + 1);
		if(dense) {
			if(!ws["!data"][__R]) ws["!data"][__R] = [];
			row = ws["!data"][__R];
		}
		for(var C = 0; C != data[R].length; ++C) {
			if(typeof data[R][C] === 'undefined') continue;
			var cell/*:Cell*/ = ({v: data[R][C] }/*:any*/);
			var __C = _C + C;
			if(range.s.r > __R) range.s.r = __R;
			if(range.s.c > __C) range.s.c = __C;
			if(range.e.r < __R) range.e.r = __R;
			if(range.e.c < __C) range.e.c = __C;
			if(data[R][C] && typeof data[R][C] === 'object' && !Array.isArray(data[R][C]) && !(data[R][C] instanceof Date)) cell = data[R][C];
			else {
				if(Array.isArray(cell.v)) { cell.f = data[R][C][1]; cell.v = cell.v[0]; }
				if(cell.v === null) {
					if(cell.f) cell.t = 'n';
					else if(o.nullError) { cell.t = 'e'; cell.v = 0; }
					else if(!o.sheetStubs) continue;
					else cell.t = 'z';
				}
				else if(typeof cell.v === 'number') cell.t = 'n';
				else if(typeof cell.v === 'boolean') cell.t = 'b';
				else if(cell.v instanceof Date) {
					cell.z = o.dateNF || table_fmt[14];
					if(o.cellDates) { cell.t = 'd'; cell.w = SSF_format(cell.z, datenum(cell.v, o.date1904)); }
					else { cell.t = 'n'; cell.v = datenum(cell.v, o.date1904); cell.w = SSF_format(cell.z, cell.v); }
				}
				else cell.t = 's';
			}
			if(dense) {
				if(row[__C] && row[__C].z) cell.z = row[__C].z;
				row[__C] = cell;
			} else {
				var cell_ref = encode_col(__C) + __Rstr/*:any*/;
				if(ws[cell_ref] && ws[cell_ref].z) cell.z = ws[cell_ref].z;
				ws[cell_ref] = cell;
			}
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = encode_range(range);
	return ws;
}
function aoa_to_sheet(data/*:AOA*/, opts/*:?any*/)/*:Worksheet*/ { return sheet_add_aoa(null, data, opts); }

function parse_Int32LE(data) {
	return data.read_shift(4, 'i');
}
function write_UInt32LE(x/*:number*/, o) {
	if (!o) o = new_buf(4);
	o.write_shift(4, x);
	return o;
}

/* [MS-XLSB] 2.5.168 */
function parse_XLWideString(data/*::, length*/)/*:string*/ {
	var cchCharacters = data.read_shift(4);
	return cchCharacters === 0 ? "" : data.read_shift(cchCharacters, 'dbcs');
}
function write_XLWideString(data/*:string*/, o) {
	var _null = false; if (o == null) { _null = true; o = new_buf(4 + 2 * data.length); }
	o.write_shift(4, data.length);
	if (data.length > 0) o.write_shift(0, data, 'dbcs');
	return _null ? o.slice(0, o.l) : o;
}

/* [MS-XLSB] 2.5.91 */
//function parse_LPWideString(data/*::, length*/)/*:string*/ {
//	var cchCharacters = data.read_shift(2);
//	return cchCharacters === 0 ? "" : data.read_shift(cchCharacters, "utf16le");
//}

/* [MS-XLSB] 2.5.143 */
function parse_StrRun(data) {
	return { ich: data.read_shift(2), ifnt: data.read_shift(2) };
}
function write_StrRun(run, o) {
	if (!o) o = new_buf(4);
	o.write_shift(2, run.ich || 0);
	o.write_shift(2, run.ifnt || 0);
	return o;
}

/* [MS-XLSB] 2.5.121 */
function parse_RichStr(data, length/*:number*/)/*:XLString*/ {
	var start = data.l;
	var flags = data.read_shift(1);
	var str = parse_XLWideString(data);
	var rgsStrRun = [];
	var z = ({ t: str, h: str }/*:any*/);
	if ((flags & 1) !== 0) { /* fRichStr */
		/* TODO: formatted string */
		var dwSizeStrRun = data.read_shift(4);
		for (var i = 0; i != dwSizeStrRun; ++i) rgsStrRun.push(parse_StrRun(data));
		z.r = rgsStrRun;
	}
	else z.r = [{ ich: 0, ifnt: 0 }];
	//if((flags & 2) !== 0) { /* fExtStr */
	//	/* TODO: phonetic string */
	//}
	data.l = start + length;
	return z;
}
function write_RichStr(str/*:XLString*/, o/*:?Block*/)/*:Block*/ {
	/* TODO: formatted string */
	var _null = false; if (o == null) { _null = true; o = new_buf(15 + 4 * str.t.length); }
	o.write_shift(1, 0);
	write_XLWideString(str.t, o);
	return _null ? o.slice(0, o.l) : o;
}
/* [MS-XLSB] 2.4.328 BrtCommentText (RichStr w/1 run) */
var parse_BrtCommentText = parse_RichStr;
function write_BrtCommentText(str/*:XLString*/, o/*:?Block*/)/*:Block*/ {
	/* TODO: formatted string */
	var _null = false; if (o == null) { _null = true; o = new_buf(23 + 4 * str.t.length); }
	o.write_shift(1, 1);
	write_XLWideString(str.t, o);
	o.write_shift(4, 1);
	write_StrRun({ ich: 0, ifnt: 0 }, o);
	return _null ? o.slice(0, o.l) : o;
}

/* [MS-XLSB] 2.5.9 */
function parse_XLSBCell(data)/*:any*/ {
	var col = data.read_shift(4);
	var iStyleRef = data.read_shift(2);
	iStyleRef += data.read_shift(1) << 16;
	data.l++; //var fPhShow = data.read_shift(1);
	return { c: col, iStyleRef: iStyleRef };
}
function write_XLSBCell(cell/*:any*/, o/*:?Block*/) {
	if (o == null) o = new_buf(8);
	o.write_shift(-4, cell.c);
	o.write_shift(3, cell.iStyleRef || cell.s);
	o.write_shift(1, 0); /* fPhShow */
	return o;
}

/* Short XLSB Cell does not include column */
function parse_XLSBShortCell(data)/*:any*/ {
	var iStyleRef = data.read_shift(2);
	iStyleRef += data.read_shift(1) <<16;
	data.l++; //var fPhShow = data.read_shift(1);
	return { c:-1, iStyleRef: iStyleRef };
}
function write_XLSBShortCell(cell/*:any*/, o/*:?Block*/) {
	if(o == null) o = new_buf(4);
	o.write_shift(3, cell.iStyleRef || cell.s);
	o.write_shift(1, 0); /* fPhShow */
	return o;
}

/* [MS-XLSB] 2.5.21 */
var parse_XLSBCodeName = parse_XLWideString;
var write_XLSBCodeName = write_XLWideString;

/* [MS-XLSB] 2.5.166 */
function parse_XLNullableWideString(data/*::, length*/)/*:string*/ {
	var cchCharacters = data.read_shift(4);
	return cchCharacters === 0 || cchCharacters === 0xFFFFFFFF ? "" : data.read_shift(cchCharacters, 'dbcs');
}
function write_XLNullableWideString(data/*:string*/, o) {
	var _null = false; if (o == null) { _null = true; o = new_buf(127); }
	o.write_shift(4, data.length > 0 ? data.length : 0xFFFFFFFF);
	if (data.length > 0) o.write_shift(0, data, 'dbcs');
	return _null ? o.slice(0, o.l) : o;
}

/* [MS-XLSB] 2.5.165 */
var parse_XLNameWideString = parse_XLWideString;
//var write_XLNameWideString = write_XLWideString;

/* [MS-XLSB] 2.5.114 */
var parse_RelID = parse_XLNullableWideString;
var write_RelID = write_XLNullableWideString;


/* [MS-XLS] 2.5.217 ; [MS-XLSB] 2.5.122 */
function parse_RkNumber(data)/*:number*/ {
	var b = data.slice(data.l, data.l + 4);
	var fX100 = (b[0] & 1), fInt = (b[0] & 2);
	data.l += 4;
	var RK = fInt === 0 ? __double([0, 0, 0, 0, (b[0] & 0xFC), b[1], b[2], b[3]], 0) : __readInt32LE(b, 0) >> 2;
	return fX100 ? (RK / 100) : RK;
}
function write_RkNumber(data/*:number*/, o) {
	if (o == null) o = new_buf(4);
	var fX100 = 0, fInt = 0, d100 = data * 100;
	if ((data == (data | 0)) && (data >= -(1 << 29)) && (data < (1 << 29))) { fInt = 1; }
	else if ((d100 == (d100 | 0)) && (d100 >= -(1 << 29)) && (d100 < (1 << 29))) { fInt = 1; fX100 = 1; }
	if (fInt) o.write_shift(-4, ((fX100 ? d100 : data) << 2) + (fX100 + 2));
	else throw new Error("unsupported RkNumber " + data); // TODO
}


/* [MS-XLSB] 2.5.117 RfX */
function parse_RfX(data /*::, length*/)/*:Range*/ {
	var cell/*:Range*/ = ({ s: {}, e: {} }/*:any*/);
	cell.s.r = data.read_shift(4);
	cell.e.r = data.read_shift(4);
	cell.s.c = data.read_shift(4);
	cell.e.c = data.read_shift(4);
	return cell;
}
function write_RfX(r/*:Range*/, o) {
	if (!o) o = new_buf(16);
	o.write_shift(4, r.s.r);
	o.write_shift(4, r.e.r);
	o.write_shift(4, r.s.c);
	o.write_shift(4, r.e.c);
	return o;
}

/* [MS-XLSB] 2.5.153 UncheckedRfX */
var parse_UncheckedRfX = parse_RfX;
var write_UncheckedRfX = write_RfX;

/* [MS-XLSB] 2.5.155 UncheckedSqRfX */
//function parse_UncheckedSqRfX(data) {
//	var cnt = data.read_shift(4);
//	var out = [];
//	for(var i = 0; i < cnt; ++i) {
//		var rng = parse_UncheckedRfX(data);
//		out.push(encode_range(rng));
//	}
//	return out.join(",");
//}
//function write_UncheckedSqRfX(sqrfx/*:string*/) {
//	var parts = sqrfx.split(/\s*,\s*/);
//	var o = new_buf(4); o.write_shift(4, parts.length);
//	var out = [o];
//	parts.forEach(function(rng) {
//		out.push(write_UncheckedRfX(safe_decode_range(rng)));
//	});
//	return bconcat(out);
//}

/* [MS-XLS] 2.5.342 ; [MS-XLSB] 2.5.171 */
/* TODO: error checking, NaN and Infinity values are not valid Xnum */
function parse_Xnum(data/*::, length*/) {
	if(data.length - data.l < 8) throw "XLS Xnum Buffer underflow";
	return data.read_shift(8, 'f');
}
function write_Xnum(data, o) { return (o || new_buf(8)).write_shift(8, data, 'f'); }

/* [MS-XLSB] 2.4.324 BrtColor */
function parse_BrtColor(data/*::, length*/) {
	var out = {};
	var d = data.read_shift(1);

	//var fValidRGB = d & 1;
	var xColorType = d >>> 1;

	var index = data.read_shift(1);
	var nTS = data.read_shift(2, 'i');
	var bR = data.read_shift(1);
	var bG = data.read_shift(1);
	var bB = data.read_shift(1);
	data.l++; //var bAlpha = data.read_shift(1);

	switch (xColorType) {
		case 0: out.auto = 1; break;
		case 1:
			out.index = index;
			var icv = XLSIcv[index];
			/* automatic pseudo index 81 */
			if (icv) out.rgb = rgb2Hex(icv);
			break;
		case 2:
			/* if(!fValidRGB) throw new Error("invalid"); */
			out.rgb = rgb2Hex([bR, bG, bB]);
			break;
		case 3: out.theme = index; break;
	}
	if (nTS != 0) out.tint = nTS > 0 ? nTS / 32767 : nTS / 32768;

	return out;
}
function write_BrtColor(color, o) {
	if (!o) o = new_buf(8);
	if (!color || color.auto) { o.write_shift(4, 0); o.write_shift(4, 0); return o; }
	if (color.index != null) {
		o.write_shift(1, 0x02);
		o.write_shift(1, color.index);
	} else if (color.theme != null) {
		o.write_shift(1, 0x06);
		o.write_shift(1, color.theme);
	} else {
		o.write_shift(1, 0x05);
		o.write_shift(1, 0);
	}
	var nTS = color.tint || 0;
	if (nTS > 0) nTS *= 32767;
	else if (nTS < 0) nTS *= 32768;
	o.write_shift(2, nTS);
	if (!color.rgb || color.theme != null) {
		o.write_shift(2, 0);
		o.write_shift(1, 0);
		o.write_shift(1, 0);
	} else {
		var rgb = (color.rgb || 'FFFFFF');
		if (typeof rgb == 'number') rgb = ("000000" + rgb.toString(16)).slice(-6);
		o.write_shift(1, parseInt(rgb.slice(0, 2), 16));
		o.write_shift(1, parseInt(rgb.slice(2, 4), 16));
		o.write_shift(1, parseInt(rgb.slice(4, 6), 16));
		o.write_shift(1, 0xFF);
	}
	return o;
}

/* [MS-XLSB] 2.5.52 */
function parse_FontFlags(data/*::, length, opts*/) {
	var d = data.read_shift(1);
	data.l++;
	var out = {
		fBold: d & 0x01,
		fItalic: d & 0x02,
		fUnderline: d & 0x04,
		fStrikeout: d & 0x08,
		fOutline: d & 0x10,
		fShadow: d & 0x20,
		fCondense: d & 0x40,
		fExtend: d & 0x80
	};
	return out;
}
function write_FontFlags(font, o) {
	if (!o) o = new_buf(2);
	var grbit =
		(font.italic ? 0x02 : 0) |
		(font.strike ? 0x08 : 0) |
		(font.outline ? 0x10 : 0) |
		(font.shadow ? 0x20 : 0) |
		(font.condense ? 0x40 : 0) |
		(font.extend ? 0x80 : 0);
	o.write_shift(1, grbit);
	o.write_shift(1, 0);
	return o;
}

/* [MS-OLEDS] 2.3.1 and 2.3.2 */
function parse_ClipboardFormatOrString(o, w/*:number*/)/*:string*/ {
	// $FlowIgnore
	var ClipFmt = { 2: "BITMAP", 3: "METAFILEPICT", 8: "DIB", 14: "ENHMETAFILE" };
	var m/*:number*/ = o.read_shift(4);
	switch (m) {
		case 0x00000000: return "";
		case 0xffffffff: case 0xfffffffe: return ClipFmt[o.read_shift(4)] || "";
	}
	if (m > 0x190) throw new Error("Unsupported Clipboard: " + m.toString(16));
	o.l -= 4;
	return o.read_shift(0, w == 1 ? "lpstr" : "lpwstr");
}
function parse_ClipboardFormatOrAnsiString(o) { return parse_ClipboardFormatOrString(o, 1); }
function parse_ClipboardFormatOrUnicodeString(o) { return parse_ClipboardFormatOrString(o, 2); }

/* [MS-OLEPS] 2.2 PropertyType */
// Note: some tree shakers cannot handle VT_VECTOR | $CONST, hence extra vars
//var VT_EMPTY    = 0x0000;
//var VT_NULL     = 0x0001;
var VT_I2       = 0x0002;
var VT_I4       = 0x0003;
//var VT_R4       = 0x0004;
//var VT_R8       = 0x0005;
//var VT_CY       = 0x0006;
//var VT_DATE     = 0x0007;
//var VT_BSTR     = 0x0008;
//var VT_ERROR    = 0x000A;
var VT_BOOL     = 0x000B;
var VT_VARIANT  = 0x000C;
//var VT_DECIMAL  = 0x000E;
//var VT_I1       = 0x0010;
//var VT_UI1      = 0x0011;
//var VT_UI2      = 0x0012;
var VT_UI4      = 0x0013;
//var VT_I8       = 0x0014;
//var VT_UI8      = 0x0015;
//var VT_INT      = 0x0016;
//var VT_UINT     = 0x0017;
//var VT_LPSTR    = 0x001E;
//var VT_LPWSTR   = 0x001F;
var VT_FILETIME = 0x0040;
var VT_BLOB     = 0x0041;
//var VT_STREAM   = 0x0042;
//var VT_STORAGE  = 0x0043;
//var VT_STREAMED_Object  = 0x0044;
//var VT_STORED_Object    = 0x0045;
//var VT_BLOB_Object      = 0x0046;
var VT_CF       = 0x0047;
//var VT_CLSID    = 0x0048;
//var VT_VERSIONED_STREAM = 0x0049;
//var VT_VECTOR   = 0x1000;
var VT_VECTOR_VARIANT = 0x100C;
var VT_VECTOR_LPSTR   = 0x101E;
//var VT_ARRAY    = 0x2000;

var VT_STRING   = 0x0050; // 2.3.3.1.11 VtString
var VT_USTR     = 0x0051; // 2.3.3.1.12 VtUnalignedString
var VT_CUSTOM   = [VT_STRING, VT_USTR];

/* [MS-OSHARED] 2.3.3.2.2.1 Document Summary Information PIDDSI */
var DocSummaryPIDDSI = {
	/*::[*/0x01/*::]*/: { n: 'CodePage', t: VT_I2 },
	/*::[*/0x02/*::]*/: { n: 'Category', t: VT_STRING },
	/*::[*/0x03/*::]*/: { n: 'PresentationFormat', t: VT_STRING },
	/*::[*/0x04/*::]*/: { n: 'ByteCount', t: VT_I4 },
	/*::[*/0x05/*::]*/: { n: 'LineCount', t: VT_I4 },
	/*::[*/0x06/*::]*/: { n: 'ParagraphCount', t: VT_I4 },
	/*::[*/0x07/*::]*/: { n: 'SlideCount', t: VT_I4 },
	/*::[*/0x08/*::]*/: { n: 'NoteCount', t: VT_I4 },
	/*::[*/0x09/*::]*/: { n: 'HiddenCount', t: VT_I4 },
	/*::[*/0x0a/*::]*/: { n: 'MultimediaClipCount', t: VT_I4 },
	/*::[*/0x0b/*::]*/: { n: 'ScaleCrop', t: VT_BOOL },
	/*::[*/0x0c/*::]*/: { n: 'HeadingPairs', t: VT_VECTOR_VARIANT /* VT_VECTOR | VT_VARIANT */ },
	/*::[*/0x0d/*::]*/: { n: 'TitlesOfParts', t: VT_VECTOR_LPSTR /* VT_VECTOR | VT_LPSTR */ },
	/*::[*/0x0e/*::]*/: { n: 'Manager', t: VT_STRING },
	/*::[*/0x0f/*::]*/: { n: 'Company', t: VT_STRING },
	/*::[*/0x10/*::]*/: { n: 'LinksUpToDate', t: VT_BOOL },
	/*::[*/0x11/*::]*/: { n: 'CharacterCount', t: VT_I4 },
	/*::[*/0x13/*::]*/: { n: 'SharedDoc', t: VT_BOOL },
	/*::[*/0x16/*::]*/: { n: 'HyperlinksChanged', t: VT_BOOL },
	/*::[*/0x17/*::]*/: { n: 'AppVersion', t: VT_I4, p: 'version' },
	/*::[*/0x18/*::]*/: { n: 'DigSig', t: VT_BLOB },
	/*::[*/0x1A/*::]*/: { n: 'ContentType', t: VT_STRING },
	/*::[*/0x1B/*::]*/: { n: 'ContentStatus', t: VT_STRING },
	/*::[*/0x1C/*::]*/: { n: 'Language', t: VT_STRING },
	/*::[*/0x1D/*::]*/: { n: 'Version', t: VT_STRING },
	/*::[*/0xFF/*::]*/: {},
	/* [MS-OLEPS] 2.18 */
	/*::[*/0x80000000/*::]*/: { n: 'Locale', t: VT_UI4 },
	/*::[*/0x80000003/*::]*/: { n: 'Behavior', t: VT_UI4 },
	/*::[*/0x72627262/*::]*/: {}
};

/* [MS-OSHARED] 2.3.3.2.1.1 Summary Information Property Set PIDSI */
var SummaryPIDSI = {
	/*::[*/0x01/*::]*/: { n: 'CodePage', t: VT_I2 },
	/*::[*/0x02/*::]*/: { n: 'Title', t: VT_STRING },
	/*::[*/0x03/*::]*/: { n: 'Subject', t: VT_STRING },
	/*::[*/0x04/*::]*/: { n: 'Author', t: VT_STRING },
	/*::[*/0x05/*::]*/: { n: 'Keywords', t: VT_STRING },
	/*::[*/0x06/*::]*/: { n: 'Comments', t: VT_STRING },
	/*::[*/0x07/*::]*/: { n: 'Template', t: VT_STRING },
	/*::[*/0x08/*::]*/: { n: 'LastAuthor', t: VT_STRING },
	/*::[*/0x09/*::]*/: { n: 'RevNumber', t: VT_STRING },
	/*::[*/0x0A/*::]*/: { n: 'EditTime', t: VT_FILETIME },
	/*::[*/0x0B/*::]*/: { n: 'LastPrinted', t: VT_FILETIME },
	/*::[*/0x0C/*::]*/: { n: 'CreatedDate', t: VT_FILETIME },
	/*::[*/0x0D/*::]*/: { n: 'ModifiedDate', t: VT_FILETIME },
	/*::[*/0x0E/*::]*/: { n: 'PageCount', t: VT_I4 },
	/*::[*/0x0F/*::]*/: { n: 'WordCount', t: VT_I4 },
	/*::[*/0x10/*::]*/: { n: 'CharCount', t: VT_I4 },
	/*::[*/0x11/*::]*/: { n: 'Thumbnail', t: VT_CF },
	/*::[*/0x12/*::]*/: { n: 'Application', t: VT_STRING },
	/*::[*/0x13/*::]*/: { n: 'DocSecurity', t: VT_I4 },
	/*::[*/0xFF/*::]*/: {},
	/* [MS-OLEPS] 2.18 */
	/*::[*/0x80000000/*::]*/: { n: 'Locale', t: VT_UI4 },
	/*::[*/0x80000003/*::]*/: { n: 'Behavior', t: VT_UI4 },
	/*::[*/0x72627262/*::]*/: {}
};

/* [MS-XLS] 2.4.63 Country/Region codes */
var CountryEnum = {
	/*::[*/0x0001/*::]*/: "US", // United States
	/*::[*/0x0002/*::]*/: "CA", // Canada
	/*::[*/0x0003/*::]*/: "", // Latin America (except Brazil)
	/*::[*/0x0007/*::]*/: "RU", // Russia
	/*::[*/0x0014/*::]*/: "EG", // Egypt
	/*::[*/0x001E/*::]*/: "GR", // Greece
	/*::[*/0x001F/*::]*/: "NL", // Netherlands
	/*::[*/0x0020/*::]*/: "BE", // Belgium
	/*::[*/0x0021/*::]*/: "FR", // France
	/*::[*/0x0022/*::]*/: "ES", // Spain
	/*::[*/0x0024/*::]*/: "HU", // Hungary
	/*::[*/0x0027/*::]*/: "IT", // Italy
	/*::[*/0x0029/*::]*/: "CH", // Switzerland
	/*::[*/0x002B/*::]*/: "AT", // Austria
	/*::[*/0x002C/*::]*/: "GB", // United Kingdom
	/*::[*/0x002D/*::]*/: "DK", // Denmark
	/*::[*/0x002E/*::]*/: "SE", // Sweden
	/*::[*/0x002F/*::]*/: "NO", // Norway
	/*::[*/0x0030/*::]*/: "PL", // Poland
	/*::[*/0x0031/*::]*/: "DE", // Germany
	/*::[*/0x0034/*::]*/: "MX", // Mexico
	/*::[*/0x0037/*::]*/: "BR", // Brazil
	/*::[*/0x003d/*::]*/: "AU", // Australia
	/*::[*/0x0040/*::]*/: "NZ", // New Zealand
	/*::[*/0x0042/*::]*/: "TH", // Thailand
	/*::[*/0x0051/*::]*/: "JP", // Japan
	/*::[*/0x0052/*::]*/: "KR", // Korea
	/*::[*/0x0054/*::]*/: "VN", // Viet Nam
	/*::[*/0x0056/*::]*/: "CN", // China
	/*::[*/0x005A/*::]*/: "TR", // Turkey
	/*::[*/0x0069/*::]*/: "JS", // Ramastan
	/*::[*/0x00D5/*::]*/: "DZ", // Algeria
	/*::[*/0x00D8/*::]*/: "MA", // Morocco
	/*::[*/0x00DA/*::]*/: "LY", // Libya
	/*::[*/0x015F/*::]*/: "PT", // Portugal
	/*::[*/0x0162/*::]*/: "IS", // Iceland
	/*::[*/0x0166/*::]*/: "FI", // Finland
	/*::[*/0x01A4/*::]*/: "CZ", // Czech Republic
	/*::[*/0x0376/*::]*/: "TW", // Taiwan
	/*::[*/0x03C1/*::]*/: "LB", // Lebanon
	/*::[*/0x03C2/*::]*/: "JO", // Jordan
	/*::[*/0x03C3/*::]*/: "SY", // Syria
	/*::[*/0x03C4/*::]*/: "IQ", // Iraq
	/*::[*/0x03C5/*::]*/: "KW", // Kuwait
	/*::[*/0x03C6/*::]*/: "SA", // Saudi Arabia
	/*::[*/0x03CB/*::]*/: "AE", // United Arab Emirates
	/*::[*/0x03CC/*::]*/: "IL", // Israel
	/*::[*/0x03CE/*::]*/: "QA", // Qatar
	/*::[*/0x03D5/*::]*/: "IR", // Iran
	/*::[*/0xFFFF/*::]*/: "US"  // United States
};

/* [MS-XLS] 2.5.127 */
var XLSFillPattern = [
	null,
	'solid',
	'mediumGray',
	'darkGray',
	'lightGray',
	'darkHorizontal',
	'darkVertical',
	'darkDown',
	'darkUp',
	'darkGrid',
	'darkTrellis',
	'lightHorizontal',
	'lightVertical',
	'lightDown',
	'lightUp',
	'lightGrid',
	'lightTrellis',
	'gray125',
	'gray0625'
];

function rgbify(arr/*:Array<number>*/)/*:Array<[number, number, number]>*/ { return arr.map(function(x) { return [(x>>16)&255,(x>>8)&255,x&255]; }); }

/* [MS-XLS] 2.5.161 */
/* [MS-XLSB] 2.5.75 Icv */
var _XLSIcv = /*#__PURE__*/ rgbify([
	/* Color Constants */
	0x000000,
	0xFFFFFF,
	0xFF0000,
	0x00FF00,
	0x0000FF,
	0xFFFF00,
	0xFF00FF,
	0x00FFFF,

	/* Overridable Defaults */
	0x000000,
	0xFFFFFF,
	0xFF0000,
	0x00FF00,
	0x0000FF,
	0xFFFF00,
	0xFF00FF,
	0x00FFFF,

	0x800000,
	0x008000,
	0x000080,
	0x808000,
	0x800080,
	0x008080,
	0xC0C0C0,
	0x808080,
	0x9999FF,
	0x993366,
	0xFFFFCC,
	0xCCFFFF,
	0x660066,
	0xFF8080,
	0x0066CC,
	0xCCCCFF,

	0x000080,
	0xFF00FF,
	0xFFFF00,
	0x00FFFF,
	0x800080,
	0x800000,
	0x008080,
	0x0000FF,
	0x00CCFF,
	0xCCFFFF,
	0xCCFFCC,
	0xFFFF99,
	0x99CCFF,
	0xFF99CC,
	0xCC99FF,
	0xFFCC99,

	0x3366FF,
	0x33CCCC,
	0x99CC00,
	0xFFCC00,
	0xFF9900,
	0xFF6600,
	0x666699,
	0x969696,
	0x003366,
	0x339966,
	0x003300,
	0x333300,
	0x993300,
	0x993366,
	0x333399,
	0x333333,

	/* Other entries to appease BIFF8/12 */
	0x000000, /* 0x40 icvForeground ?? */
	0xFFFFFF, /* 0x41 icvBackground ?? */
	0x000000, /* 0x42 icvFrame ?? */
	0x000000, /* 0x43 icv3D ?? */
	0x000000, /* 0x44 icv3DText ?? */
	0x000000, /* 0x45 icv3DHilite ?? */
	0x000000, /* 0x46 icv3DShadow ?? */
	0x000000, /* 0x47 icvHilite ?? */
	0x000000, /* 0x48 icvCtlText ?? */
	0x000000, /* 0x49 icvCtlScrl ?? */
	0x000000, /* 0x4A icvCtlInv ?? */
	0x000000, /* 0x4B icvCtlBody ?? */
	0x000000, /* 0x4C icvCtlFrame ?? */
	0x000000, /* 0x4D icvCtlFore ?? */
	0x000000, /* 0x4E icvCtlBack ?? */
	0x000000, /* 0x4F icvCtlNeutral */
	0x000000, /* 0x50 icvInfoBk ?? */
	0x000000 /* 0x51 icvInfoText ?? */
]);
var XLSIcv = /*#__PURE__*/dup(_XLSIcv);

/* [MS-XLSB] 2.5.97.2 */
var BErr = {
	/*::[*/0x00/*::]*/: "#NULL!",
	/*::[*/0x07/*::]*/: "#DIV/0!",
	/*::[*/0x0F/*::]*/: "#VALUE!",
	/*::[*/0x17/*::]*/: "#REF!",
	/*::[*/0x1D/*::]*/: "#NAME?",
	/*::[*/0x24/*::]*/: "#NUM!",
	/*::[*/0x2A/*::]*/: "#N/A",
	/*::[*/0x2B/*::]*/: "#GETTING_DATA",
	/*::[*/0xFF/*::]*/: "#WTF?"
};
//var RBErr = evert_num(BErr);
var RBErr = {
	"#NULL!":        0x00,
	"#DIV/0!":       0x07,
	"#VALUE!":       0x0F,
	"#REF!":         0x17,
	"#NAME?":        0x1D,
	"#NUM!":         0x24,
	"#N/A":          0x2A,
	"#GETTING_DATA": 0x2B,
	"#WTF?":         0xFF
};

var XLSLblBuiltIn = [
	"_xlnm.Consolidate_Area",
	"_xlnm.Auto_Open",
	"_xlnm.Auto_Close",
	"_xlnm.Extract",
	"_xlnm.Database",
	"_xlnm.Criteria",
	"_xlnm.Print_Area",
	"_xlnm.Print_Titles",
	"_xlnm.Recorder",
	"_xlnm.Data_Form",
	"_xlnm.Auto_Activate",
	"_xlnm.Auto_Deactivate",
	"_xlnm.Sheet_Title",
	"_xlnm._FilterDatabase"
];

/* Parts enumerated in OPC spec, MS-XLSB and MS-XLSX */
/* 12.3 Part Summary <SpreadsheetML> */
/* 14.2 Part Summary <DrawingML> */
/* [MS-XLSX] 2.1 Part Enumerations ; [MS-XLSB] 2.1.7 Part Enumeration */
var ct2type/*{[string]:string}*/ = ({
	/* Workbook */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
	"application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
	"application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
	"application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",

	/* Worksheet */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
	"application/vnd.ms-excel.worksheet": "sheets",
	"application/vnd.ms-excel.binIndexWs": "TODO", /* Binary Index */

	/* Chartsheet */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
	"application/vnd.ms-excel.chartsheet": "charts",

	/* Macrosheet */
	"application/vnd.ms-excel.macrosheet+xml": "macros",
	"application/vnd.ms-excel.macrosheet": "macros",
	"application/vnd.ms-excel.intlmacrosheet": "TODO",
	"application/vnd.ms-excel.binIndexMs": "TODO", /* Binary Index */

	/* Dialogsheet */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
	"application/vnd.ms-excel.dialogsheet": "dialogs",

	/* Shared Strings */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
	"application/vnd.ms-excel.sharedStrings": "strs",

	/* Styles */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
	"application/vnd.ms-excel.styles": "styles",

	/* File Properties */
	"application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
	"application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
	"application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",

	/* Custom Data Properties */
	"application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",

	/* Comments */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
	"application/vnd.ms-excel.comments": "comments",
	"application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
	"application/vnd.ms-excel.person+xml": "people",

	/* Metadata (Stock/Geography and Dynamic Array) */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
	"application/vnd.ms-excel.sheetMetadata": "metadata",

	/* PivotTable */
	"application/vnd.ms-excel.pivotTable": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",

	/* Chart Objects */
	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",

	/* Chart Colors */
	"application/vnd.ms-office.chartcolorstyle+xml": "TODO",

	/* Chart Style */
	"application/vnd.ms-office.chartstyle+xml": "TODO",

	/* Chart Advanced */
	"application/vnd.ms-office.chartex+xml": "TODO",

	/* Calculation Chain */
	"application/vnd.ms-excel.calcChain": "calcchains",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",

	/* Printer Settings */
	"application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",

	/* ActiveX */
	"application/vnd.ms-office.activeX": "TODO",
	"application/vnd.ms-office.activeX+xml": "TODO",

	/* Custom Toolbars */
	"application/vnd.ms-excel.attachedToolbars": "TODO",

	/* External Data Connections */
	"application/vnd.ms-excel.connections": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",

	/* External Links */
	"application/vnd.ms-excel.externalLink": "links",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",

	/* PivotCache */
	"application/vnd.ms-excel.pivotCacheDefinition": "TODO",
	"application/vnd.ms-excel.pivotCacheRecords": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",

	/* Query Table */
	"application/vnd.ms-excel.queryTable": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",

	/* Shared Workbook */
	"application/vnd.ms-excel.userNames": "TODO",
	"application/vnd.ms-excel.revisionHeaders": "TODO",
	"application/vnd.ms-excel.revisionLog": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",

	/* Single Cell Table */
	"application/vnd.ms-excel.tableSingleCells": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",

	/* Slicer */
	"application/vnd.ms-excel.slicer": "TODO",
	"application/vnd.ms-excel.slicerCache": "TODO",
	"application/vnd.ms-excel.slicer+xml": "TODO",
	"application/vnd.ms-excel.slicerCache+xml": "TODO",

	/* Sort Map */
	"application/vnd.ms-excel.wsSortMap": "TODO",

	/* Table */
	"application/vnd.ms-excel.table": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",

	/* Themes */
	"application/vnd.openxmlformats-officedocument.theme+xml": "themes",

	/* Theme Override */
	"application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",

	/* Timeline */
	"application/vnd.ms-excel.Timeline+xml": "TODO", /* verify */
	"application/vnd.ms-excel.TimelineCache+xml": "TODO", /* verify */

	/* VBA */
	"application/vnd.ms-office.vbaProject": "vba",
	"application/vnd.ms-office.vbaProjectSignature": "TODO",

	/* Volatile Dependencies */
	"application/vnd.ms-office.volatileDependencies": "TODO",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",

	/* Control Properties */
	"application/vnd.ms-excel.controlproperties+xml": "TODO",

	/* Data Model */
	"application/vnd.openxmlformats-officedocument.model+data": "TODO",

	/* Survey */
	"application/vnd.ms-excel.Survey+xml": "TODO",

	/* Drawing */
	"application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
	"application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",

	/* VML */
	"application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",

	"application/vnd.openxmlformats-package.relationships+xml": "rels",
	"application/vnd.openxmlformats-officedocument.oleObject": "TODO",

	/* Image */
	"image/png": "TODO",

	"sheet": "js"
}/*:any*/);

var CT_LIST = {
	workbooks: {
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
		xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
		xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
		xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
		xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml"
	},
	strs: { /* Shared Strings */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
		xlsb: "application/vnd.ms-excel.sharedStrings"
	},
	comments: { /* Comments */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
		xlsb: "application/vnd.ms-excel.comments"
	},
	sheets: { /* Worksheet */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
		xlsb: "application/vnd.ms-excel.worksheet"
	},
	charts: { /* Chartsheet */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
		xlsb: "application/vnd.ms-excel.chartsheet"
	},
	dialogs: { /* Dialogsheet */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
		xlsb: "application/vnd.ms-excel.dialogsheet"
	},
	macros: { /* Macrosheet (Excel 4.0 Macros) */
		xlsx: "application/vnd.ms-excel.macrosheet+xml",
		xlsb: "application/vnd.ms-excel.macrosheet"
	},
	metadata: { /* Metadata (Stock/Geography and Dynamic Array) */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
		xlsb: "application/vnd.ms-excel.sheetMetadata"
	},
	styles: { /* Styles */
		xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
		xlsb: "application/vnd.ms-excel.styles"
	}
};

function new_ct()/*:any*/ {
	return ({
		workbooks:[], sheets:[], charts:[], dialogs:[], macros:[],
		rels:[], strs:[], comments:[], threadedcomments:[], links:[],
		coreprops:[], extprops:[], custprops:[], themes:[], styles:[],
		calcchains:[], vba: [], drawings: [], metadata: [], people:[],
		TODO:[], xmlns: "" }/*:any*/);
}

function parse_ct(data/*:?string*/) {
	var ct = new_ct();
	if(!data || !data.match) return ct;
	var ctext = {};
	(data.match(tagregex)||[]).forEach(function(x) {
		var y = parsexmltag(x);
		switch(y[0].replace(nsregex,"<")) {
			case '<?xml': break;
			case '<Types': ct.xmlns = y['xmlns' + (y[0].match(/<(\w+):/)||["",""])[1] ]; break;
			case '<Default': ctext[y.Extension.toLowerCase()] = y.ContentType; break;
			case '<Override':
				if(ct[ct2type[y.ContentType]] !== undefined) ct[ct2type[y.ContentType]].push(y.PartName);
				break;
		}
	});
	if(ct.xmlns !== XMLNS.CT) throw new Error("Unknown Namespace: " + ct.xmlns);
	ct.calcchain = ct.calcchains.length > 0 ? ct.calcchains[0] : "";
	ct.sst = ct.strs.length > 0 ? ct.strs[0] : "";
	ct.style = ct.styles.length > 0 ? ct.styles[0] : "";
	ct.defaults = ctext;
	delete ct.calcchains;
	return ct;
}

function write_ct(ct, opts, raw)/*:string*/ {
	var type2ct/*{[string]:Array<string>}*/ = evert_arr(ct2type);

	var o/*:Array<string>*/ = [], v;

	if(!raw) {
		o[o.length] = (XML_HEADER);
		o[o.length] = writextag('Types', null, {
			'xmlns': XMLNS.CT,
			'xmlns:xsd': XMLNS.xsd,
			'xmlns:xsi': XMLNS.xsi
		});
		o = o.concat([
			['xml', 'application/xml'],
			['bin', 'application/vnd.ms-excel.sheet.binary.macroEnabled.main'],
			['vml', 'application/vnd.openxmlformats-officedocument.vmlDrawing'],
			['data', 'application/vnd.openxmlformats-officedocument.model+data'],
			/* from test files */
			['bmp', 'image/bmp'],
			['png', 'image/png'],
			['gif', 'image/gif'],
			['emf', 'image/x-emf'],
			['wmf', 'image/x-wmf'],
			['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'],
			['tif', 'image/tiff'], ['tiff', 'image/tiff'],
			['pdf', 'application/pdf'],
			['rels', 'application/vnd.openxmlformats-package.relationships+xml']
		].map(function(x) {
			return writextag('Default', null, {'Extension':x[0], 'ContentType': x[1]});
		}));
	}

	/* only write first instance */
	var f1 = function(w) {
		if(ct[w] && ct[w].length > 0) {
			v = ct[w][0];
			o[o.length] = (writextag('Override', null, {
				'PartName': (v[0] == '/' ? "":"/") + v,
				'ContentType': CT_LIST[w][opts.bookType] || CT_LIST[w]['xlsx']
			}));
		}
	};

	/* book type-specific */
	var f2 = function(w) {
		(ct[w]||[]).forEach(function(v) {
			o[o.length] = (writextag('Override', null, {
				'PartName': (v[0] == '/' ? "":"/") + v,
				'ContentType': CT_LIST[w][opts.bookType] || CT_LIST[w]['xlsx']
			}));
		});
	};

	/* standard type */
	var f3 = function(t) {
		(ct[t]||[]).forEach(function(v) {
			o[o.length] = (writextag('Override', null, {
				'PartName': (v[0] == '/' ? "":"/") + v,
				'ContentType': type2ct[t][0]
			}));
		});
	};

	f1('workbooks');
	f2('sheets');
	f2('charts');
	f3('themes');
	['strs', 'styles'].forEach(f1);
	['coreprops', 'extprops', 'custprops'].forEach(f3);
	f3('vba');
	f3('comments');
	f3('threadedcomments');
	f3('drawings');
	f2('metadata');
	f3('people');
	if(!raw && o.length>2){ o[o.length] = ('</Types>'); o[1]=o[1].replace("/>",">"); }
	return o.join("");
}
/* 9.3 Relationships */
var RELS = ({
	WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
	SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
	HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
	VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
	XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
	XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
	XLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
	CXML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
	CXMLP: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
	CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
	CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
	EXT_PROPS: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties',
	CUST_PROPS: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties',
	SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
	STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
	THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
	CHART: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
	CHARTEX: "http://schemas.microsoft.com/office/2014/relationships/chartEx",
	CS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
	WS: [
		"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet",
		"http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"
	],
	DS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
	MS: "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet",
	IMG: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
	DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
	XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
	TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
	PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
	CONN: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/connections",
	VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
}/*:any*/);

/* 9.3.3 Representing Relationships */
function get_rels_path(file/*:string*/)/*:string*/ {
	var n = file.lastIndexOf("/");
	return file.slice(0,n+1) + '_rels/' + file.slice(n+1) + ".rels";
}

function parse_rels(data/*:?string*/, currentFilePath/*:string*/) {
	var rels = {"!id":{}};
	if (!data) return rels;
	if (currentFilePath.charAt(0) !== '/') {
		currentFilePath = '/'+currentFilePath;
	}
	var hash = {};

	(data.match(tagregex)||[]).forEach(function(x) {
		var y = parsexmltag(x);
		/* 9.3.2.2 OPC_Relationships */
		if (y[0] === '<Relationship') {
			var rel = {}; rel.Type = y.Type; rel.Target = unescapexml(y.Target); rel.Id = y.Id; if(y.TargetMode) rel.TargetMode = y.TargetMode;
			var canonictarget = y.TargetMode === 'External' ? y.Target : resolve_path(y.Target, currentFilePath);
			rels[canonictarget] = rel;
			hash[y.Id] = rel;
		}
	});
	rels["!id"] = hash;
	return rels;
}


/* TODO */
function write_rels(rels)/*:string*/ {
	var o = [XML_HEADER, writextag('Relationships', null, {
		//'xmlns:ns0': XMLNS.RELS,
		'xmlns': XMLNS.RELS
	})];
	keys(rels['!id']).forEach(function(rid) {
		o[o.length] = (writextag('Relationship', null, rels['!id'][rid]));
	});
	if(o.length>2){ o[o.length] = ('</Relationships>'); o[1]=o[1].replace("/>",">"); }
	return o.join("");
}

function add_rels(rels, rId/*:number*/, f, type, relobj, targetmode/*:?string*/)/*:number*/ {
	if(!relobj) relobj = {};
	if(!rels['!id']) rels['!id'] = {};
	if(!rels['!idx']) rels['!idx'] = 1;
	if(rId < 0) for(rId = rels['!idx']; rels['!id']['rId' + rId]; ++rId){/* empty */}
	rels['!idx'] = rId + 1;
	relobj.Id = 'rId' + rId;
	relobj.Type = type;
	relobj.Target = f;
	if(targetmode) relobj.TargetMode = targetmode;
	else if([RELS.HLINK, RELS.XPATH, RELS.XMISS].indexOf(relobj.Type) > -1) relobj.TargetMode = "External";
	if(rels['!id'][relobj.Id]) throw new Error("Cannot rewrite rId " + rId);
	rels['!id'][relobj.Id] = relobj;
	rels[('/' + relobj.Target).replace("//","/")] = relobj;
	return rId;
}
var CT_ODS = "application/vnd.oasis.opendocument.spreadsheet";
function parse_manifest(d, opts) {
  var str = xlml_normalize(d);
  var Rn;
  var FEtag;
  while (Rn = xlmlregex.exec(str))
    switch (Rn[3]) {
      case "manifest":
        break;
      case "file-entry":
        FEtag = parsexmltag(Rn[0], false);
        if (FEtag.path == "/" && FEtag.type !== CT_ODS)
          throw new Error("This OpenDocument is not a spreadsheet");
        break;
      case "encryption-data":
      case "algorithm":
      case "start-key-generation":
      case "key-derivation":
        throw new Error("Unsupported ODS Encryption");
      default:
        if (opts && opts.WTF)
          throw Rn;
    }
}
function write_manifest(manifest) {
  var o = [XML_HEADER];
  o.push('<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">\n');
  o.push('  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>\n');
  for (var i = 0; i < manifest.length; ++i)
    o.push('  <manifest:file-entry manifest:full-path="' + manifest[i][0] + '" manifest:media-type="' + manifest[i][1] + '"/>\n');
  o.push("</manifest:manifest>");
  return o.join("");
}
function write_rdf_type(file, res, tag) {
  return [
    '  <rdf:Description rdf:about="' + file + '">\n',
    '    <rdf:type rdf:resource="http://docs.oasis-open.org/ns/office/1.2/meta/' + (tag || "odf") + "#" + res + '"/>\n',
    "  </rdf:Description>\n"
  ].join("");
}
function write_rdf_has(base, file) {
  return [
    '  <rdf:Description rdf:about="' + base + '">\n',
    '    <ns0:hasPart xmlns:ns0="http://docs.oasis-open.org/ns/office/1.2/meta/pkg#" rdf:resource="' + file + '"/>\n',
    "  </rdf:Description>\n"
  ].join("");
}
function write_rdf(rdf) {
  var o = [XML_HEADER];
  o.push('<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n');
  for (var i = 0; i != rdf.length; ++i) {
    o.push(write_rdf_type(rdf[i][0], rdf[i][1]));
    o.push(write_rdf_has("", rdf[i][0]));
  }
  o.push(write_rdf_type("", "Document", "pkg"));
  o.push("</rdf:RDF>");
  return o.join("");
}
function write_meta_ods(wb, opts) {
  return '<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"><office:meta><meta:generator>SheetJS ' + XLSX.version + "</meta:generator></office:meta></office:document-meta>";
}
/* ECMA-376 Part II 11.1 Core Properties Part */
/* [MS-OSHARED] 2.3.3.2.[1-2].1 (PIDSI/PIDDSI) */
var CORE_PROPS/*:Array<Array<string> >*/ = [
	["cp:category", "Category"],
	["cp:contentStatus", "ContentStatus"],
	["cp:keywords", "Keywords"],
	["cp:lastModifiedBy", "LastAuthor"],
	["cp:lastPrinted", "LastPrinted"],
	["cp:revision", "RevNumber"],
	["cp:version", "Version"],
	["dc:creator", "Author"],
	["dc:description", "Comments"],
	["dc:identifier", "Identifier"],
	["dc:language", "Language"],
	["dc:subject", "Subject"],
	["dc:title", "Title"],
	["dcterms:created", "CreatedDate", 'date'],
	["dcterms:modified", "ModifiedDate", 'date']
];

var CORE_PROPS_REGEX/*:Array<RegExp>*/ = /*#__PURE__*/(function() {
	var r = new Array(CORE_PROPS.length);
	for(var i = 0; i < CORE_PROPS.length; ++i) {
		var f = CORE_PROPS[i];
		var g = "(?:"+ f[0].slice(0,f[0].indexOf(":")) +":)"+ f[0].slice(f[0].indexOf(":")+1);
		r[i] = new RegExp("<" + g + "[^>]*>([\\s\\S]*?)<\/" + g + ">");
	}
	return r;
})();

function parse_core_props(data) {
	var p = {};
	data = utf8read(data);

	for(var i = 0; i < CORE_PROPS.length; ++i) {
		var f = CORE_PROPS[i], cur = data.match(CORE_PROPS_REGEX[i]);
		if(cur != null && cur.length > 0) p[f[1]] = unescapexml(cur[1]);
		if(f[2] === 'date' && p[f[1]]) p[f[1]] = parseDate(p[f[1]]);
	}

	return p;
}

function cp_doit(f, g, h, o, p) {
	if(p[f] != null || g == null || g === "") return;
	p[f] = g;
	g = escapexml(g);
	o[o.length] = (h ? writextag(f,g,h) : writetag(f,g));
}

function write_core_props(cp, _opts) {
	var opts = _opts || {};
	var o = [XML_HEADER, writextag('cp:coreProperties', null, {
		//'xmlns': XMLNS.CORE_PROPS,
		'xmlns:cp': XMLNS.CORE_PROPS,
		'xmlns:dc': XMLNS.dc,
		'xmlns:dcterms': XMLNS.dcterms,
		'xmlns:dcmitype': XMLNS.dcmitype,
		'xmlns:xsi': XMLNS.xsi
	})], p = {};
	if(!cp && !opts.Props) return o.join("");

	if(cp) {
		if(cp.CreatedDate != null) cp_doit("dcterms:created", typeof cp.CreatedDate === "string" ? cp.CreatedDate : write_w3cdtf(cp.CreatedDate, opts.WTF), {"xsi:type":"dcterms:W3CDTF"}, o, p);
		if(cp.ModifiedDate != null) cp_doit("dcterms:modified", typeof cp.ModifiedDate === "string" ? cp.ModifiedDate : write_w3cdtf(cp.ModifiedDate, opts.WTF), {"xsi:type":"dcterms:W3CDTF"}, o, p);
	}

	for(var i = 0; i != CORE_PROPS.length; ++i) {
		var f = CORE_PROPS[i];
		var v = opts.Props && opts.Props[f[1]] != null ? opts.Props[f[1]] : cp ? cp[f[1]] : null;
		if(v === true) v = "1";
		else if(v === false) v = "0";
		else if(typeof v == "number") v = String(v);
		if(v != null) cp_doit(f[0], v, null, o, p);
	}
	if(o.length>2){ o[o.length] = ('</cp:coreProperties>'); o[1]=o[1].replace("/>",">"); }
	return o.join("");
}
/* 15.2.12.3 Extended File Properties Part */
/* [MS-OSHARED] 2.3.3.2.[1-2].1 (PIDSI/PIDDSI) */
var EXT_PROPS/*:Array<Array<string> >*/ = [
	["Application", "Application", "string"],
	["AppVersion", "AppVersion", "string"],
	["Company", "Company", "string"],
	["DocSecurity", "DocSecurity", "string"],
	["Manager", "Manager", "string"],
	["HyperlinksChanged", "HyperlinksChanged", "bool"],
	["SharedDoc", "SharedDoc", "bool"],
	["LinksUpToDate", "LinksUpToDate", "bool"],
	["ScaleCrop", "ScaleCrop", "bool"],
	["HeadingPairs", "HeadingPairs", "raw"],
	["TitlesOfParts", "TitlesOfParts", "raw"]
];

var PseudoPropsPairs = [
	"Worksheets",  "SheetNames",
	"NamedRanges", "DefinedNames",
	"Chartsheets", "ChartNames"
];
function load_props_pairs(HP/*:string|Array<Array<any>>*/, TOP, props, opts) {
	var v = [];
	if(typeof HP == "string") v = parseVector(HP, opts);
	else for(var j = 0; j < HP.length; ++j) v = v.concat(HP[j].map(function(hp) { return {v:hp}; }));
	var parts = (typeof TOP == "string") ? parseVector(TOP, opts).map(function (x) { return x.v; }) : TOP;
	var idx = 0, len = 0;
	if(parts.length > 0) for(var i = 0; i !== v.length; i += 2) {
		len = +(v[i+1].v);
		switch(v[i].v) {
			case "Worksheets":
			case "工作表":
			case "Листы":
			case "أوراق العمل":
			case "ワークシート":
			case "גליונות עבודה":
			case "Arbeitsblätter":
			case "Çalışma Sayfaları":
			case "Feuilles de calcul":
			case "Fogli di lavoro":
			case "Folhas de cálculo":
			case "Planilhas":
			case "Regneark":
			case "Hojas de cálculo":
			case "Werkbladen":
				props.Worksheets = len;
				props.SheetNames = parts.slice(idx, idx + len);
				break;

			case "Named Ranges":
			case "Rangos con nombre":
			case "名前付き一覧":
			case "Benannte Bereiche":
			case "Navngivne områder":
				props.NamedRanges = len;
				props.DefinedNames = parts.slice(idx, idx + len);
				break;

			case "Charts":
			case "Diagramme":
				props.Chartsheets = len;
				props.ChartNames = parts.slice(idx, idx + len);
				break;
		}
		idx += len;
	}
}

function parse_ext_props(data, p, opts) {
	var q = {}; if(!p) p = {};
	data = utf8read(data);

	EXT_PROPS.forEach(function(f) {
		var xml = (data.match(matchtag(f[0]))||[])[1];
		switch(f[2]) {
			case "string": if(xml) p[f[1]] = unescapexml(xml); break;
			case "bool": p[f[1]] = xml === "true"; break;
			case "raw":
				var cur = data.match(new RegExp("<" + f[0] + "[^>]*>([\\s\\S]*?)<\/" + f[0] + ">"));
				if(cur && cur.length > 0) q[f[1]] = cur[1];
				break;
		}
	});

	if(q.HeadingPairs && q.TitlesOfParts) load_props_pairs(q.HeadingPairs, q.TitlesOfParts, p, opts);

	return p;
}

function write_ext_props(cp/*::, opts*/)/*:string*/ {
	var o/*:Array<string>*/ = [], W = writextag;
	if(!cp) cp = {};
	cp.Application = "SheetJS";
	o[o.length] = (XML_HEADER);
	o[o.length] = (writextag('Properties', null, {
		'xmlns': XMLNS.EXT_PROPS,
		'xmlns:vt': XMLNS.vt
	}));

	EXT_PROPS.forEach(function(f) {
		if(cp[f[1]] === undefined) return;
		var v;
		switch(f[2]) {
			case 'string': v = escapexml(String(cp[f[1]])); break;
			case 'bool': v = cp[f[1]] ? 'true' : 'false'; break;
		}
		if(v !== undefined) o[o.length] = (W(f[0], v));
	});

	/* TODO: HeadingPairs, TitlesOfParts */
	o[o.length] = (W('HeadingPairs', W('vt:vector', W('vt:variant', '<vt:lpstr>Worksheets</vt:lpstr>')+W('vt:variant', W('vt:i4', String(cp.Worksheets))), {size:2, baseType:"variant"})));
	o[o.length] = (W('TitlesOfParts', W('vt:vector', cp.SheetNames.map(function(s) { return "<vt:lpstr>" + escapexml(s) + "</vt:lpstr>"; }).join(""), {size: cp.Worksheets, baseType:"lpstr"})));
	if(o.length>2){ o[o.length] = ('</Properties>'); o[1]=o[1].replace("/>",">"); }
	return o.join("");
}
/* 15.2.12.2 Custom File Properties Part */
var custregex = /<[^>]+>[^<]*/g;
function parse_cust_props(data/*:string*/, opts) {
	var p = {}, name = "";
	var m = data.match(custregex);
	if(m) for(var i = 0; i != m.length; ++i) {
		var x = m[i], y = parsexmltag(x);
		switch(strip_ns(y[0])) {
			case '<?xml': break;
			case '<Properties': break;
			case '<property': name = unescapexml(y.name); break;
			case '</property>': name = null; break;
			default: if (x.indexOf('<vt:') === 0) {
				var toks = x.split('>');
				var type = toks[0].slice(4), text = toks[1];
				/* 22.4.2.32 (CT_Variant). Omit the binary types from 22.4 (Variant Types) */
				switch(type) {
					case 'lpstr': case 'bstr': case 'lpwstr':
						p[name] = unescapexml(text);
						break;
					case 'bool':
						p[name] = parsexmlbool(text);
						break;
					case 'i1': case 'i2': case 'i4': case 'i8': case 'int': case 'uint':
						p[name] = parseInt(text, 10);
						break;
					case 'r4': case 'r8': case 'decimal':
						p[name] = parseFloat(text);
						break;
					case 'filetime': case 'date':
						p[name] = parseDate(text);
						break;
					case 'cy': case 'error':
						p[name] = unescapexml(text);
						break;
					default:
						if(type.slice(-1) == '/') break;
						if(opts.WTF && typeof console !== 'undefined') console.warn('Unexpected', x, type, toks);
				}
			} else if(x.slice(0,2) === "</") ; else if(opts.WTF) throw new Error(x);
		}
	}
	return p;
}

function write_cust_props(cp/*::, opts*/)/*:string*/ {
	var o = [XML_HEADER, writextag('Properties', null, {
		'xmlns': XMLNS.CUST_PROPS,
		'xmlns:vt': XMLNS.vt
	})];
	if(!cp) return o.join("");
	var pid = 1;
	keys(cp).forEach(function custprop(k) { ++pid;
		o[o.length] = (writextag('property', write_vt(cp[k], true), {
			'fmtid': '{D5CDD505-2E9C-101B-9397-08002B2CF9AE}',
			'pid': pid,
			'name': escapexml(k)
		}));
	});
	if(o.length>2){ o[o.length] = '</Properties>'; o[1]=o[1].replace("/>",">"); }
	return o.join("");
}
/* Common Name -> XLML Name */
var XLMLDocPropsMap = {
	Title: 'Title',
	Subject: 'Subject',
	Author: 'Author',
	Keywords: 'Keywords',
	Comments: 'Description',
	LastAuthor: 'LastAuthor',
	RevNumber: 'Revision',
	Application: 'AppName',
	/* TotalTime: 'TotalTime', */
	LastPrinted: 'LastPrinted',
	CreatedDate: 'Created',
	ModifiedDate: 'LastSaved',
	/* Pages */
	/* Words */
	/* Characters */
	Category: 'Category',
	/* PresentationFormat */
	Manager: 'Manager',
	Company: 'Company',
	/* Guid */
	/* HyperlinkBase */
	/* Bytes */
	/* Lines */
	/* Paragraphs */
	/* CharactersWithSpaces */
	AppVersion: 'Version',

	ContentStatus: 'ContentStatus', /* NOTE: missing from schema */
	Identifier: 'Identifier', /* NOTE: missing from schema */
	Language: 'Language' /* NOTE: missing from schema */
};
var evert_XLMLDPM;

function xlml_set_prop(Props, tag/*:string*/, val) {
	if(!evert_XLMLDPM) evert_XLMLDPM = evert(XLMLDocPropsMap);
	tag = evert_XLMLDPM[tag] || tag;
	Props[tag] = val;
}

function xlml_write_docprops(Props, opts) {
	var o/*:Array<string>*/ = [];
	keys(XLMLDocPropsMap).map(function(m) {
		for(var i = 0; i < CORE_PROPS.length; ++i) if(CORE_PROPS[i][1] == m) return CORE_PROPS[i];
		for(i = 0; i < EXT_PROPS.length; ++i) if(EXT_PROPS[i][1] == m) return EXT_PROPS[i];
		throw m;
	}).forEach(function(p) {
		if(Props[p[1]] == null) return;
		var m = opts && opts.Props && opts.Props[p[1]] != null ? opts.Props[p[1]] : Props[p[1]];
		switch(p[2]) {
			case 'date': m = new Date(m).toISOString().replace(/\.\d*Z/,"Z"); break;
		}
		if(typeof m == 'number') m = String(m);
		else if(m === true || m === false) { m = m ? "1" : "0"; }
		else if(m instanceof Date) m = new Date(m).toISOString().replace(/\.\d*Z/,"");
		o.push(writetag(XLMLDocPropsMap[p[1]] || p[1], m));
	});
	return writextag('DocumentProperties', o.join(""), {xmlns:XLMLNS.o });
}
function xlml_write_custprops(Props, Custprops/*::, opts*/) {
	var BLACKLIST = ["Worksheets","SheetNames"];
	var T = 'CustomDocumentProperties';
	var o/*:Array<string>*/ = [];
	if(Props) keys(Props).forEach(function(k) {
		/*:: if(!Props) return; */
		if(!Object.prototype.hasOwnProperty.call(Props, k)) return;
		for(var i = 0; i < CORE_PROPS.length; ++i) if(k == CORE_PROPS[i][1]) return;
		for(i = 0; i < EXT_PROPS.length; ++i) if(k == EXT_PROPS[i][1]) return;
		for(i = 0; i < BLACKLIST.length; ++i) if(k == BLACKLIST[i]) return;

		var m = Props[k];
		var t = "string";
		if(typeof m == 'number') { t = "float"; m = String(m); }
		else if(m === true || m === false) { t = "boolean"; m = m ? "1" : "0"; }
		else m = String(m);
		o.push(writextag(escapexmltag(k), m, {"dt:dt":t}));
	});
	if(Custprops) keys(Custprops).forEach(function(k) {
		/*:: if(!Custprops) return; */
		if(!Object.prototype.hasOwnProperty.call(Custprops, k)) return;
		if(Props && Object.prototype.hasOwnProperty.call(Props, k)) return;
		var m = Custprops[k];
		var t = "string";
		if(typeof m == 'number') { t = "float"; m = String(m); }
		else if(m === true || m === false) { t = "boolean"; m = m ? "1" : "0"; }
		else if(m instanceof Date) { t = "dateTime.tz"; m = m.toISOString(); }
		else m = String(m);
		o.push(writextag(escapexmltag(k), m, {"dt:dt":t}));
	});
	return '<' + T + ' xmlns="' + XLMLNS.o + '">' + o.join("") + '</' + T + '>';
}
/* [MS-DTYP] 2.3.3 FILETIME */
/* [MS-OLEDS] 2.1.3 FILETIME (Packet Version) */
/* [MS-OLEPS] 2.8 FILETIME (Packet Version) */
function parse_FILETIME(blob) {
	var dwLowDateTime = blob.read_shift(4), dwHighDateTime = blob.read_shift(4);
	return new Date(((dwHighDateTime/1e7*Math.pow(2,32) + dwLowDateTime/1e7) - 11644473600)*1000).toISOString().replace(/\.000/,"");
}
function write_FILETIME(time/*:string|Date*/) {
	var date = (typeof time == "string") ? new Date(Date.parse(time)) : time;
	var t = date.getTime() / 1000 + 11644473600;
	var l = t % Math.pow(2,32), h = (t - l) / Math.pow(2,32);
	l *= 1e7; h *= 1e7;
	var w = (l / Math.pow(2,32)) | 0;
	if(w > 0) { l = l % Math.pow(2,32); h += w; }
	var o = new_buf(8); o.write_shift(4, l); o.write_shift(4, h); return o;
}

/* [MS-OSHARED] 2.3.3.1.4 Lpstr */
function parse_lpstr(blob, type, pad/*:?number*/) {
	var start = blob.l;
	var str = blob.read_shift(0, 'lpstr-cp');
	if(pad) while((blob.l - start) & 3) ++blob.l;
	return str;
}

/* [MS-OSHARED] 2.3.3.1.6 Lpwstr */
function parse_lpwstr(blob, type, pad) {
	var str = blob.read_shift(0, 'lpwstr');
	if(pad) blob.l += (4 - ((str.length+1) & 3)) & 3;
	return str;
}


/* [MS-OSHARED] 2.3.3.1.11 VtString */
/* [MS-OSHARED] 2.3.3.1.12 VtUnalignedString */
function parse_VtStringBase(blob, stringType, pad) {
	if(stringType === 0x1F /*VT_LPWSTR*/) return parse_lpwstr(blob);
	return parse_lpstr(blob, stringType, pad);
}

function parse_VtString(blob, t/*:number*/, pad/*:?boolean*/) { return parse_VtStringBase(blob, t, pad === false ? 0: 4); }
function parse_VtUnalignedString(blob, t/*:number*/) { if(!t) throw new Error("VtUnalignedString must have positive length"); return parse_VtStringBase(blob, t, 0); }

/* [MS-OSHARED] 2.3.3.1.7 VtVecLpwstrValue */
function parse_VtVecLpwstrValue(blob)/*:Array<string>*/ {
	var length = blob.read_shift(4);
	var ret/*:Array<string>*/ = [];
	for(var i = 0; i != length; ++i) {
		var start = blob.l;
		ret[i] = blob.read_shift(0, 'lpwstr').replace(chr0,'');
		if((blob.l - start) & 0x02) blob.l += 2;
	}
	return ret;
}

/* [MS-OSHARED] 2.3.3.1.9 VtVecUnalignedLpstrValue */
function parse_VtVecUnalignedLpstrValue(blob)/*:Array<string>*/ {
	var length = blob.read_shift(4);
	var ret/*:Array<string>*/ = [];
	for(var i = 0; i != length; ++i) ret[i] = blob.read_shift(0, 'lpstr-cp').replace(chr0,'');
	return ret;
}


/* [MS-OSHARED] 2.3.3.1.13 VtHeadingPair */
function parse_VtHeadingPair(blob) {
	var start = blob.l;
	var headingString = parse_TypedPropertyValue(blob, VT_USTR);
	if(blob[blob.l] == 0x00 && blob[blob.l+1] == 0x00 && ((blob.l - start) & 0x02)) blob.l += 2;
	var headerParts = parse_TypedPropertyValue(blob, VT_I4);
	return [headingString, headerParts];
}

/* [MS-OSHARED] 2.3.3.1.14 VtVecHeadingPairValue */
function parse_VtVecHeadingPairValue(blob) {
	var cElements = blob.read_shift(4);
	var out = [];
	for(var i = 0; i < cElements / 2; ++i) out.push(parse_VtHeadingPair(blob));
	return out;
}

/* [MS-OLEPS] 2.18.1 Dictionary (uses 2.17, 2.16) */
function parse_dictionary(blob,CodePage) {
	var cnt = blob.read_shift(4);
	var dict/*:{[number]:string}*/ = ({}/*:any*/);
	for(var j = 0; j != cnt; ++j) {
		var pid = blob.read_shift(4);
		var len = blob.read_shift(4);
		dict[pid] = blob.read_shift(len, (CodePage === 0x4B0 ?'utf16le':'utf8')).replace(chr0,'').replace(chr1,'!');
		if(CodePage === 0x4B0 && (len % 2)) blob.l += 2;
	}
	if(blob.l & 3) blob.l = (blob.l>>2+1)<<2;
	return dict;
}

/* [MS-OLEPS] 2.9 BLOB */
function parse_BLOB(blob) {
	var size = blob.read_shift(4);
	var bytes = blob.slice(blob.l,blob.l+size);
	blob.l += size;
	if((size & 3) > 0) blob.l += (4 - (size & 3)) & 3;
	return bytes;
}

/* [MS-OLEPS] 2.11 ClipboardData */
function parse_ClipboardData(blob) {
	// TODO
	var o = {};
	o.Size = blob.read_shift(4);
	//o.Format = blob.read_shift(4);
	blob.l += o.Size + 3 - (o.Size - 1) % 4;
	return o;
}

/* [MS-OLEPS] 2.15 TypedPropertyValue */
function parse_TypedPropertyValue(blob, type/*:number*/, _opts)/*:any*/ {
	var t = blob.read_shift(2), ret, opts = _opts||{};
	blob.l += 2;
	if(type !== VT_VARIANT)
	if(t !== type && VT_CUSTOM.indexOf(type)===-1 && !((type & 0xFFFE) == 0x101E && (t & 0xFFFE) == 0x101E)) throw new Error('Expected type ' + type + ' saw ' + t);
	switch(type === VT_VARIANT ? t : type) {
		case 0x02 /*VT_I2*/: ret = blob.read_shift(2, 'i'); if(!opts.raw) blob.l += 2; return ret;
		case 0x03 /*VT_I4*/: ret = blob.read_shift(4, 'i'); return ret;
		case 0x0B /*VT_BOOL*/: return blob.read_shift(4) !== 0x0;
		case 0x13 /*VT_UI4*/: ret = blob.read_shift(4); return ret;
		case 0x1E /*VT_LPSTR*/: return parse_lpstr(blob, t, 4).replace(chr0,'');
		case 0x1F /*VT_LPWSTR*/: return parse_lpwstr(blob);
		case 0x40 /*VT_FILETIME*/: return parse_FILETIME(blob);
		case 0x41 /*VT_BLOB*/: return parse_BLOB(blob);
		case 0x47 /*VT_CF*/: return parse_ClipboardData(blob);
		case 0x50 /*VT_STRING*/: return parse_VtString(blob, t, !opts.raw).replace(chr0,'');
		case 0x51 /*VT_USTR*/: return parse_VtUnalignedString(blob, t/*, 4*/).replace(chr0,'');
		case 0x100C /*VT_VECTOR|VT_VARIANT*/: return parse_VtVecHeadingPairValue(blob);
		case 0x101E /*VT_VECTOR|VT_LPSTR*/:
		case 0x101F /*VT_VECTOR|VT_LPWSTR*/:
			return t == 0x101F ? parse_VtVecLpwstrValue(blob) : parse_VtVecUnalignedLpstrValue(blob);
		default: throw new Error("TypedPropertyValue unrecognized type " + type + " " + t);
	}
}
function write_TypedPropertyValue(type/*:number*/, value) {
	var o = new_buf(4), p = new_buf(4);
	o.write_shift(4, type == 0x50 ? 0x1F : type);
	switch(type) {
		case 0x03 /*VT_I4*/: p.write_shift(-4, value); break;
		case 0x05 /*VT_I4*/: p = new_buf(8); p.write_shift(8, value, 'f'); break;
		case 0x0B /*VT_BOOL*/: p.write_shift(4, value ? 0x01 : 0x00); break;
		case 0x40 /*VT_FILETIME*/: /*:: if(typeof value !== "string" && !(value instanceof Date)) throw "unreachable"; */ p = write_FILETIME(value); break;
		case 0x1F /*VT_LPWSTR*/:
		case 0x50 /*VT_STRING*/:
			/*:: if(typeof value !== "string") throw "unreachable"; */
			p = new_buf(4 + 2 * (value.length + 1) + (value.length % 2 ? 0 : 2));
			p.write_shift(4, value.length + 1);
			p.write_shift(0, value, "dbcs");
			while(p.l != p.length) p.write_shift(1, 0);
			break;
		default: throw new Error("TypedPropertyValue unrecognized type " + type + " " + value);
	}
	return bconcat([o, p]);
}

/* [MS-OLEPS] 2.20 PropertySet */
function parse_PropertySet(blob, PIDSI) {
	var start_addr = blob.l;
	var size = blob.read_shift(4);
	var NumProps = blob.read_shift(4);
	var Props = [], i = 0;
	var CodePage = 0;
	var Dictionary = -1, DictObj/*:{[number]:string}*/ = ({}/*:any*/);
	for(i = 0; i != NumProps; ++i) {
		var PropID = blob.read_shift(4);
		var Offset = blob.read_shift(4);
		Props[i] = [PropID, Offset + start_addr];
	}
	Props.sort(function(x,y) { return x[1] - y[1]; });
	var PropH = {};
	for(i = 0; i != NumProps; ++i) {
		if(blob.l !== Props[i][1]) {
			var fail = true;
			if(i>0 && PIDSI) switch(PIDSI[Props[i-1][0]].t) {
				case 0x02 /*VT_I2*/: if(blob.l+2 === Props[i][1]) { blob.l+=2; fail = false; } break;
				case 0x50 /*VT_STRING*/: if(blob.l <= Props[i][1]) { blob.l=Props[i][1]; fail = false; } break;
				case 0x100C /*VT_VECTOR|VT_VARIANT*/: if(blob.l <= Props[i][1]) { blob.l=Props[i][1]; fail = false; } break;
			}
			if((!PIDSI||i==0) && blob.l <= Props[i][1]) { fail=false; blob.l = Props[i][1]; }
			if(fail) throw new Error("Read Error: Expected address " + Props[i][1] + ' at ' + blob.l + ' :' + i);
		}
		if(PIDSI) {
			if(Props[i][0] == 0 && Props.length > i+1 && Props[i][1] == Props[i+1][1]) continue; // R9
			var piddsi = PIDSI[Props[i][0]];
			PropH[piddsi.n] = parse_TypedPropertyValue(blob, piddsi.t, {raw:true});
			if(piddsi.p === 'version') PropH[piddsi.n] = String(PropH[piddsi.n] >> 16) + "." + ("0000" + String(PropH[piddsi.n] & 0xFFFF)).slice(-4);
			if(piddsi.n == "CodePage") switch(PropH[piddsi.n]) {
				case 0: PropH[piddsi.n] = 1252;
					/* falls through */
				case 874:
				case 932:
				case 936:
				case 949:
				case 950:
				case 1250:
				case 1251:
				case 1253:
				case 1254:
				case 1255:
				case 1256:
				case 1257:
				case 1258:
				case 10000:
				case 1200:
				case 1201:
				case 1252:
				case 65000: case -536:
				case 65001: case -535:
					set_cp(CodePage = (PropH[piddsi.n]>>>0) & 0xFFFF); break;
				default: throw new Error("Unsupported CodePage: " + PropH[piddsi.n]);
			}
		} else {
			if(Props[i][0] === 0x1) {
				CodePage = PropH.CodePage = (parse_TypedPropertyValue(blob, VT_I2)/*:number*/);
				set_cp(CodePage);
				if(Dictionary !== -1) {
					var oldpos = blob.l;
					blob.l = Props[Dictionary][1];
					DictObj = parse_dictionary(blob,CodePage);
					blob.l = oldpos;
				}
			} else if(Props[i][0] === 0) {
				if(CodePage === 0) { Dictionary = i; blob.l = Props[i+1][1]; continue; }
				DictObj = parse_dictionary(blob,CodePage);
			} else {
				var name = DictObj[Props[i][0]];
				var val;
				/* [MS-OSHARED] 2.3.3.2.3.1.2 + PROPVARIANT */
				switch(blob[blob.l]) {
					case 0x41 /*VT_BLOB*/: blob.l += 4; val = parse_BLOB(blob); break;
					case 0x1E /*VT_LPSTR*/: blob.l += 4; val = parse_VtString(blob, blob[blob.l-4]).replace(/\u0000+$/,""); break;
					case 0x1F /*VT_LPWSTR*/: blob.l += 4; val = parse_VtString(blob, blob[blob.l-4]).replace(/\u0000+$/,""); break;
					case 0x03 /*VT_I4*/: blob.l += 4; val = blob.read_shift(4, 'i'); break;
					case 0x13 /*VT_UI4*/: blob.l += 4; val = blob.read_shift(4); break;
					case 0x05 /*VT_R8*/: blob.l += 4; val = blob.read_shift(8, 'f'); break;
					case 0x0B /*VT_BOOL*/: blob.l += 4; val = parsebool(blob, 4); break;
					case 0x40 /*VT_FILETIME*/: blob.l += 4; val = parseDate(parse_FILETIME(blob)); break;
					default: throw new Error("unparsed value: " + blob[blob.l]);
				}
				PropH[name] = val;
			}
		}
	}
	blob.l = start_addr + size; /* step ahead to skip padding */
	return PropH;
}
var XLSPSSkip = [ "CodePage", "Thumbnail", "_PID_LINKBASE", "_PID_HLINKS", "SystemIdentifier", "FMTID" ];
function guess_property_type(val/*:any*/)/*:number*/ {
	switch(typeof val) {
		case "boolean": return 0x0B;
		case "number": return ((val|0)==val) ? 0x03 : 0x05;
		case "string": return 0x1F;
		case "object": if(val instanceof Date) return 0x40; break;
	}
	return -1;
}
function write_PropertySet(entries, RE, PIDSI) {
	var hdr = new_buf(8), piao = [], prop = [];
	var sz = 8, i = 0;

	var pr = new_buf(8), pio = new_buf(8);
	pr.write_shift(4, 0x0002);
	pr.write_shift(4, 0x04B0);
	pio.write_shift(4, 0x0001);
	prop.push(pr); piao.push(pio);
	sz += 8 + pr.length;

	if(!RE) {
		pio = new_buf(8);
		pio.write_shift(4, 0);
		piao.unshift(pio);

		var bufs = [new_buf(4)];
		bufs[0].write_shift(4, entries.length);
		for(i = 0; i < entries.length; ++i) {
			var value = entries[i][0];
			pr = new_buf(4 + 4 + 2 * (value.length + 1) + (value.length % 2 ? 0 : 2));
			pr.write_shift(4, i+2);
			pr.write_shift(4, value.length + 1);
			pr.write_shift(0, value, "dbcs");
			while(pr.l != pr.length) pr.write_shift(1, 0);
			bufs.push(pr);
		}
		pr = bconcat(bufs);
		prop.unshift(pr);
		sz += 8 + pr.length;
	}

	for(i = 0; i < entries.length; ++i) {
		if(RE && !RE[entries[i][0]]) continue;
		if(XLSPSSkip.indexOf(entries[i][0]) > -1 || PseudoPropsPairs.indexOf(entries[i][0]) > -1) continue;
		if(entries[i][1] == null) continue;

		var val = entries[i][1], idx = 0;
		if(RE) {
			idx = +RE[entries[i][0]];
			var pinfo = (PIDSI/*:: || {}*/)[idx]/*:: || {} */;
			if(pinfo.p == "version" && typeof val == "string") {
				/*:: if(typeof val !== "string") throw "unreachable"; */
				var arr = val.split(".");
				val = ((+arr[0])<<16) + ((+arr[1])||0);
			}
			pr = write_TypedPropertyValue(pinfo.t, val);
		} else {
			var T = guess_property_type(val);
			if(T == -1) { T = 0x1F; val = String(val); }
			pr = write_TypedPropertyValue(T, val);
		}
		prop.push(pr);

		pio = new_buf(8);
		pio.write_shift(4, !RE ? 2+i : idx);
		piao.push(pio);

		sz += 8 + pr.length;
	}

	var w = 8 * (prop.length + 1);
	for(i = 0; i < prop.length; ++i) { piao[i].write_shift(4, w); w += prop[i].length; }
	hdr.write_shift(4, sz);
	hdr.write_shift(4, prop.length);
	return bconcat([hdr].concat(piao).concat(prop));
}

/* [MS-OLEPS] 2.21 PropertySetStream */
function parse_PropertySetStream(file, PIDSI, clsid) {
	var blob = file.content;
	if(!blob) return ({}/*:any*/);
	prep_blob(blob, 0);

	var NumSets, FMTID0, FMTID1, Offset0, Offset1 = 0;
	blob.chk('feff', 'Byte Order: ');

	/*var vers = */blob.read_shift(2); // TODO: check version
	var SystemIdentifier = blob.read_shift(4);
	var CLSID = blob.read_shift(16);
	if(CLSID !== CFB.utils.consts.HEADER_CLSID && CLSID !== clsid) throw new Error("Bad PropertySet CLSID " + CLSID);
	NumSets = blob.read_shift(4);
	if(NumSets !== 1 && NumSets !== 2) throw new Error("Unrecognized #Sets: " + NumSets);
	FMTID0 = blob.read_shift(16); Offset0 = blob.read_shift(4);

	if(NumSets === 1 && Offset0 !== blob.l) throw new Error("Length mismatch: " + Offset0 + " !== " + blob.l);
	else if(NumSets === 2) { FMTID1 = blob.read_shift(16); Offset1 = blob.read_shift(4); }
	var PSet0 = parse_PropertySet(blob, PIDSI);

	var rval = ({ SystemIdentifier: SystemIdentifier }/*:any*/);
	for(var y in PSet0) rval[y] = PSet0[y];
	//rval.blob = blob;
	rval.FMTID = FMTID0;
	//rval.PSet0 = PSet0;
	if(NumSets === 1) return rval;
	if(Offset1 - blob.l == 2) blob.l += 2;
	if(blob.l !== Offset1) throw new Error("Length mismatch 2: " + blob.l + " !== " + Offset1);
	var PSet1;
	try { PSet1 = parse_PropertySet(blob, null); } catch(e) {/* empty */}
	for(y in PSet1) rval[y] = PSet1[y];
	rval.FMTID = [FMTID0, FMTID1]; // TODO: verify FMTID0/1
	return rval;
}
function write_PropertySetStream(entries, clsid, RE, PIDSI/*:{[key:string|number]:any}*/, entries2/*:?any*/, clsid2/*:?any*/) {
	var hdr = new_buf(entries2 ? 68 : 48);
	var bufs = [hdr];
	hdr.write_shift(2, 0xFFFE);
	hdr.write_shift(2, 0x0000); /* TODO: type 1 props */
	hdr.write_shift(4, 0x32363237);
	hdr.write_shift(16, CFB.utils.consts.HEADER_CLSID, "hex");
	hdr.write_shift(4, (entries2 ? 2 : 1));
	hdr.write_shift(16, clsid, "hex");
	hdr.write_shift(4, (entries2 ? 68 : 48));
	var ps0 = write_PropertySet(entries, RE, PIDSI);
	bufs.push(ps0);

	if(entries2) {
		var ps1 = write_PropertySet(entries2, null, null);
		hdr.write_shift(16, clsid2, "hex");
		hdr.write_shift(4, 68 + ps0.length);
		bufs.push(ps1);
	}
	return bconcat(bufs);
}

function parsenoop2(blob, length) { blob.read_shift(length); return null; }
function writezeroes(n, o) { if(!o) o=new_buf(n); for(var j=0; j<n; ++j) o.write_shift(1, 0); return o; }

function parslurp(blob, length, cb) {
	var arr = [], target = blob.l + length;
	while(blob.l < target) arr.push(cb(blob, target - blob.l));
	if(target !== blob.l) throw new Error("Slurp error");
	return arr;
}

function parsebool(blob, length/*:number*/) { return blob.read_shift(length) === 0x1; }
function writebool(v/*:any*/, o) { if(!o) o=new_buf(2); o.write_shift(2, +!!v); return o; }

function parseuint16(blob/*::, length:?number, opts:?any*/) { return blob.read_shift(2, 'u'); }
function writeuint16(v/*:number*/, o) { if(!o) o=new_buf(2); o.write_shift(2, v); return o; }
function parseuint16a(blob, length/*:: :?number, opts:?any*/) { return parslurp(blob,length,parseuint16);}

/* --- 2.5 Structures --- */

/* [MS-XLS] 2.5.10 Bes (boolean or error) */
function parse_Bes(blob/*::, length*/) {
	var v = blob.read_shift(1), t = blob.read_shift(1);
	return t === 0x01 ? v : v === 0x01;
}
function write_Bes(v, t/*:string*/, o) {
	if(!o) o = new_buf(2);
	o.write_shift(1, ((t == 'e') ? +v : +!!v));
	o.write_shift(1, ((t == 'e') ? 1 : 0));
	return o;
}

/* [MS-XLS] 2.5.240 ShortXLUnicodeString */
function parse_ShortXLUnicodeString(blob, length, opts) {
	var cch = blob.read_shift(opts && opts.biff >= 12 ? 2 : 1);
	var encoding = 'sbcs-cont';
	var cp = current_codepage;
	if(opts && opts.biff >= 8) current_codepage = 1200;
	if(!opts || opts.biff == 8 ) {
		var fHighByte = blob.read_shift(1);
		if(fHighByte) { encoding = 'dbcs-cont'; }
	} else if(opts.biff == 12) {
		encoding = 'wstr';
	}
	if(opts.biff >= 2 && opts.biff <= 5) encoding = 'cpstr';
	var o = cch ? blob.read_shift(cch, encoding) : "";
	current_codepage = cp;
	return o;
}

/* 2.5.293 XLUnicodeRichExtendedString */
function parse_XLUnicodeRichExtendedString(blob) {
	var cp = current_codepage;
	current_codepage = 1200;
	var cch = blob.read_shift(2), flags = blob.read_shift(1);
	var /*fHighByte = flags & 0x1,*/ fExtSt = flags & 0x4, fRichSt = flags & 0x8;
	var width = 1 + (flags & 0x1); // 0x0 -> utf8, 0x1 -> dbcs
	var cRun = 0, cbExtRst;
	var z = {};
	if(fRichSt) cRun = blob.read_shift(2);
	if(fExtSt) cbExtRst = blob.read_shift(4);
	var encoding = width == 2 ? 'dbcs-cont' : 'sbcs-cont';
	var msg = cch === 0 ? "" : blob.read_shift(cch, encoding);
	if(fRichSt) blob.l += 4 * cRun; //TODO: parse this
	if(fExtSt) blob.l += cbExtRst; //TODO: parse this
	z.t = msg;
	if(!fRichSt) { z.raw = "<t>" + z.t + "</t>"; z.r = z.t; }
	current_codepage = cp;
	return z;
}
function write_XLUnicodeRichExtendedString(xlstr/*:: :XLString, opts*/) {
	var str = (xlstr.t||"");

	var hdr = new_buf(3 + (0));
	hdr.write_shift(2, str.length);
	hdr.write_shift(1, (0x00) | 0x01);

	var otext = new_buf(2 * str.length);
	otext.write_shift(2 * str.length, str, 'utf16le');

	var out = [hdr, otext];

	return bconcat(out);
}

/* 2.5.296 XLUnicodeStringNoCch */
function parse_XLUnicodeStringNoCch(blob, cch, opts) {
	var retval;
	if(opts) {
		if(opts.biff >= 2 && opts.biff <= 5) return blob.read_shift(cch, 'cpstr');
		if(opts.biff >= 12) return blob.read_shift(cch, 'dbcs-cont');
	}
	var fHighByte = blob.read_shift(1);
	if(fHighByte===0) { retval = blob.read_shift(cch, 'sbcs-cont'); }
	else { retval = blob.read_shift(cch, 'dbcs-cont'); }
	return retval;
}

/* 2.5.294 XLUnicodeString */
function parse_XLUnicodeString(blob, length, opts) {
	var cch = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
	if(cch === 0) { blob.l++; return ""; }
	return parse_XLUnicodeStringNoCch(blob, cch, opts);
}
/* BIFF5 override */
function parse_XLUnicodeString2(blob, length, opts) {
	if(opts.biff > 5) return parse_XLUnicodeString(blob, length, opts);
	var cch = blob.read_shift(1);
	if(cch === 0) { blob.l++; return ""; }
	return blob.read_shift(cch, (opts.biff <= 4 || !blob.lens ) ? 'cpstr' : 'sbcs-cont');
}
/* TODO: BIFF5 and lower, codepage awareness */
function write_XLUnicodeString(str, opts, o) {
	if(!o) o = new_buf(3 + 2 * str.length);
	o.write_shift(2, str.length);
	o.write_shift(1, 1);
	o.write_shift(31, str, 'utf16le');
	return o;
}

/* [MS-XLS] 2.5.61 ControlInfo */
function parse_ControlInfo(blob/*::, length, opts*/) {
	var flags = blob.read_shift(1);
	blob.l++;
	var accel = blob.read_shift(2);
	blob.l += 2;
	return [flags, accel];
}

/* [MS-OSHARED] 2.3.7.6 URLMoniker TODO: flags */
function parse_URLMoniker(blob/*::, length, opts*/) {
	var len = blob.read_shift(4), start = blob.l;
	var extra = false;
	if(len > 24) {
		/* look ahead */
		blob.l += len - 24;
		if(blob.read_shift(16) === "795881f43b1d7f48af2c825dc4852763") extra = true;
		blob.l = start;
	}
	var url = blob.read_shift((extra?len-24:len)>>1, 'utf16le').replace(chr0,"");
	if(extra) blob.l += 24;
	return url;
}

/* [MS-OSHARED] 2.3.7.8 FileMoniker TODO: all fields */
function parse_FileMoniker(blob/*::, length*/) {
	var cAnti = blob.read_shift(2);
	var preamble = ""; while(cAnti-- > 0) preamble += "../";
	var ansiPath = blob.read_shift(0, 'lpstr-ansi');
	blob.l += 2; //var endServer = blob.read_shift(2);
	if(blob.read_shift(2) != 0xDEAD) throw new Error("Bad FileMoniker");
	var sz = blob.read_shift(4);
	if(sz === 0) return preamble + ansiPath.replace(/\\/g,"/");
	var bytes = blob.read_shift(4);
	if(blob.read_shift(2) != 3) throw new Error("Bad FileMoniker");
	var unicodePath = blob.read_shift(bytes>>1, 'utf16le').replace(chr0,"");
	return preamble + unicodePath;
}

/* [MS-OSHARED] 2.3.7.2 HyperlinkMoniker TODO: all the monikers */
function parse_HyperlinkMoniker(blob, length) {
	var clsid = blob.read_shift(16);	switch(clsid) {
		case "e0c9ea79f9bace118c8200aa004ba90b": return parse_URLMoniker(blob);
		case "0303000000000000c000000000000046": return parse_FileMoniker(blob);
		default: throw new Error("Unsupported Moniker " + clsid);
	}
}

/* [MS-OSHARED] 2.3.7.9 HyperlinkString */
function parse_HyperlinkString(blob/*::, length*/) {
	var len = blob.read_shift(4);
	var o = len > 0 ? blob.read_shift(len, 'utf16le').replace(chr0, "") : "";
	return o;
}
function write_HyperlinkString(str/*:string*/, o) {
	if(!o) o = new_buf(6 + str.length * 2);
	o.write_shift(4, 1 + str.length);
	for(var i = 0; i < str.length; ++i) o.write_shift(2, str.charCodeAt(i));
	o.write_shift(2, 0);
	return o;
}

/* [MS-OSHARED] 2.3.7.1 Hyperlink Object */
function parse_Hyperlink(blob, length)/*:Hyperlink*/ {
	var end = blob.l + length;
	var sVer = blob.read_shift(4);
	if(sVer !== 2) throw new Error("Unrecognized streamVersion: " + sVer);
	var flags = blob.read_shift(2);
	blob.l += 2;
	var displayName, targetFrameName, moniker, oleMoniker, Loc="", guid, fileTime;
	if(flags & 0x0010) displayName = parse_HyperlinkString(blob, end - blob.l);
	if(flags & 0x0080) targetFrameName = parse_HyperlinkString(blob, end - blob.l);
	if((flags & 0x0101) === 0x0101) moniker = parse_HyperlinkString(blob, end - blob.l);
	if((flags & 0x0101) === 0x0001) oleMoniker = parse_HyperlinkMoniker(blob, end - blob.l);
	if(flags & 0x0008) Loc = parse_HyperlinkString(blob, end - blob.l);
	if(flags & 0x0020) guid = blob.read_shift(16);
	if(flags & 0x0040) fileTime = parse_FILETIME(blob/*, 8*/);
	blob.l = end;
	var target = targetFrameName||moniker||oleMoniker||"";
	if(target && Loc) target+="#"+Loc;
	if(!target) target = "#" + Loc;
	if((flags & 0x0002) && target.charAt(0) == "/" && target.charAt(1) != "/") target = "file://" + target;
	var out = ({Target:target}/*:any*/);
	if(guid) out.guid = guid;
	if(fileTime) out.time = fileTime;
	if(displayName) out.Tooltip = displayName;
	return out;
}
function write_Hyperlink(hl) {
	var out = new_buf(512), i = 0;
	var Target = hl.Target;
	if(Target.slice(0,7) == "file://") Target = Target.slice(7);
	var hashidx = Target.indexOf("#");
	var F = hashidx > -1 ? 0x1f : 0x17;
	switch(Target.charAt(0)) { case "#": F=0x1c; break; case ".": F&=~2; break; }
	out.write_shift(4,2); out.write_shift(4, F);
	var data = [8,6815827,6619237,4849780,83]; for(i = 0; i < data.length; ++i) out.write_shift(4, data[i]);
	if(F == 0x1C) {
		Target = Target.slice(1);
		write_HyperlinkString(Target, out);
	} else if(F & 0x02) {
		data = "e0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" ");
		for(i = 0; i < data.length; ++i) out.write_shift(1, parseInt(data[i], 16));
		var Pretarget = hashidx > -1 ? Target.slice(0, hashidx) : Target;
		out.write_shift(4, 2*(Pretarget.length + 1));
		for(i = 0; i < Pretarget.length; ++i) out.write_shift(2, Pretarget.charCodeAt(i));
		out.write_shift(2, 0);
		if(F & 0x08) write_HyperlinkString(hashidx > -1 ? Target.slice(hashidx+1): "", out);
	} else {
		data = "03 03 00 00 00 00 00 00 c0 00 00 00 00 00 00 46".split(" ");
		for(i = 0; i < data.length; ++i) out.write_shift(1, parseInt(data[i], 16));
		var P = 0;
		while(Target.slice(P*3,P*3+3)=="../"||Target.slice(P*3,P*3+3)=="..\\") ++P;
		out.write_shift(2, P);
		out.write_shift(4, Target.length - 3 * P + 1);
		for(i = 0; i < Target.length - 3 * P; ++i) out.write_shift(1, Target.charCodeAt(i + 3 * P) & 0xFF);
		out.write_shift(1, 0);
		out.write_shift(2, 0xFFFF);
		out.write_shift(2, 0xDEAD);
		for(i = 0; i < 6; ++i) out.write_shift(4, 0);
	}
	return out.slice(0, out.l);
}

/* 2.5.178 LongRGBA */
function parse_LongRGBA(blob/*::, length*/) { var r = blob.read_shift(1), g = blob.read_shift(1), b = blob.read_shift(1), a = blob.read_shift(1); return [r,g,b,a]; }

/* 2.5.177 LongRGB */
function parse_LongRGB(blob, length) { var x = parse_LongRGBA(blob); x[3] = 0; return x; }


/* [MS-XLS] 2.5.19 */
function parse_XLSCell(blob/*::, length*/)/*:Cell*/ {
	var rw = blob.read_shift(2); // 0-indexed
	var col = blob.read_shift(2);
	var ixfe = blob.read_shift(2);
	return ({r:rw, c:col, ixfe:ixfe}/*:any*/);
}
function write_XLSCell(R/*:number*/, C/*:number*/, ixfe/*:?number*/, o) {
	if(!o) o = new_buf(6);
	o.write_shift(2, R);
	o.write_shift(2, C);
	o.write_shift(2, ixfe||0);
	return o;
}

/* [MS-XLS] 2.5.134 */
function parse_frtHeader(blob) {
	var rt = blob.read_shift(2);
	var flags = blob.read_shift(2); // TODO: parse these flags
	blob.l += 8;
	return {type: rt, flags: flags};
}



function parse_OptXLUnicodeString(blob, length, opts) { return length === 0 ? "" : parse_XLUnicodeString2(blob, length, opts); }

/* [MS-XLS] 2.5.344 */
function parse_XTI(blob, length, opts) {
	var w = opts.biff > 8 ? 4 : 2;
	var iSupBook = blob.read_shift(w), itabFirst = blob.read_shift(w,'i'), itabLast = blob.read_shift(w,'i');
	return [iSupBook, itabFirst, itabLast];
}

/* [MS-XLS] 2.5.218 */
function parse_RkRec(blob) {
	var ixfe = blob.read_shift(2);
	var RK = parse_RkNumber(blob);
	return [ixfe, RK];
}

/* [MS-XLS] 2.5.1 */
function parse_AddinUdf(blob, length, opts) {
	blob.l += 4; length -= 4;
	var l = blob.l + length;
	var udfName = parse_ShortXLUnicodeString(blob, length, opts);
	var cb = blob.read_shift(2);
	l -= blob.l;
	if(cb !== l) throw new Error("Malformed AddinUdf: padding = " + l + " != " + cb);
	blob.l += cb;
	return udfName;
}

/* [MS-XLS] 2.5.209 TODO: Check sizes */
function parse_Ref8U(blob/*::, length*/) {
	var rwFirst = blob.read_shift(2);
	var rwLast = blob.read_shift(2);
	var colFirst = blob.read_shift(2);
	var colLast = blob.read_shift(2);
	return {s:{c:colFirst, r:rwFirst}, e:{c:colLast,r:rwLast}};
}
function write_Ref8U(r/*:Range*/, o) {
	if(!o) o = new_buf(8);
	o.write_shift(2, r.s.r);
	o.write_shift(2, r.e.r);
	o.write_shift(2, r.s.c);
	o.write_shift(2, r.e.c);
	return o;
}

/* [MS-XLS] 2.5.211 */
function parse_RefU(blob/*::, length*/) {
	var rwFirst = blob.read_shift(2);
	var rwLast = blob.read_shift(2);
	var colFirst = blob.read_shift(1);
	var colLast = blob.read_shift(1);
	return {s:{c:colFirst, r:rwFirst}, e:{c:colLast,r:rwLast}};
}

/* [MS-XLS] 2.5.207 */
var parse_Ref = parse_RefU;

/* [MS-XLS] 2.5.143 */
function parse_FtCmo(blob/*::, length*/) {
	blob.l += 4;
	var ot = blob.read_shift(2);
	var id = blob.read_shift(2);
	var flags = blob.read_shift(2);
	blob.l+=12;
	return [id, ot, flags];
}

/* [MS-XLS] 2.5.149 */
function parse_FtNts(blob) {
	var out = {};
	blob.l += 4;
	blob.l += 16; // GUID TODO
	out.fSharedNote = blob.read_shift(2);
	blob.l += 4;
	return out;
}

/* [MS-XLS] 2.5.142 */
function parse_FtCf(blob) {
	var out = {};
	blob.l += 4;
	blob.cf = blob.read_shift(2);
	return out;
}

/* [MS-XLS] 2.5.140 - 2.5.154 and friends */
function parse_FtSkip(blob) { blob.l += 2; blob.l += blob.read_shift(2); }
var FtTab = {
	/*::[*/0x00/*::]*/: parse_FtSkip,      /* FtEnd */
	/*::[*/0x04/*::]*/: parse_FtSkip,      /* FtMacro */
	/*::[*/0x05/*::]*/: parse_FtSkip,      /* FtButton */
	/*::[*/0x06/*::]*/: parse_FtSkip,      /* FtGmo */
	/*::[*/0x07/*::]*/: parse_FtCf,        /* FtCf */
	/*::[*/0x08/*::]*/: parse_FtSkip,      /* FtPioGrbit */
	/*::[*/0x09/*::]*/: parse_FtSkip,      /* FtPictFmla */
	/*::[*/0x0A/*::]*/: parse_FtSkip,      /* FtCbls */
	/*::[*/0x0B/*::]*/: parse_FtSkip,      /* FtRbo */
	/*::[*/0x0C/*::]*/: parse_FtSkip,      /* FtSbs */
	/*::[*/0x0D/*::]*/: parse_FtNts,       /* FtNts */
	/*::[*/0x0E/*::]*/: parse_FtSkip,      /* FtSbsFmla */
	/*::[*/0x0F/*::]*/: parse_FtSkip,      /* FtGboData */
	/*::[*/0x10/*::]*/: parse_FtSkip,      /* FtEdoData */
	/*::[*/0x11/*::]*/: parse_FtSkip,      /* FtRboData */
	/*::[*/0x12/*::]*/: parse_FtSkip,      /* FtCblsData */
	/*::[*/0x13/*::]*/: parse_FtSkip,      /* FtLbsData */
	/*::[*/0x14/*::]*/: parse_FtSkip,      /* FtCblsFmla */
	/*::[*/0x15/*::]*/: parse_FtCmo
};
function parse_FtArray(blob, length/*::, ot*/) {
	var tgt = blob.l + length;
	var fts = [];
	while(blob.l < tgt) {
		var ft = blob.read_shift(2);
		blob.l-=2;
		try {
			fts[ft] = FtTab[ft](blob, tgt - blob.l);
		} catch(e) { blob.l = tgt; return fts; }
	}
	if(blob.l != tgt) blob.l = tgt; //throw new Error("bad Object Ft-sequence");
	return fts;
}

/* --- 2.4 Records --- */

/* [MS-XLS] 2.4.21 */
function parse_BOF(blob, length) {
	var o = {BIFFVer:0, dt:0};
	o.BIFFVer = blob.read_shift(2); length -= 2;
	if(length >= 2) { o.dt = blob.read_shift(2); blob.l -= 2; }
	switch(o.BIFFVer) {
		case 0x0600: /* BIFF8 */
		case 0x0500: /* BIFF5 */
		case 0x0400: /* BIFF4 */
		case 0x0300: /* BIFF3 */
		case 0x0200: /* BIFF2 */
		case 0x0002: case 0x0007: /* BIFF2 */
			break;
		default: if(length > 6) throw new Error("Unexpected BIFF Ver " + o.BIFFVer);
	}

	blob.read_shift(length);
	return o;
}
function write_BOF(wb/*:Workbook*/, t/*:number*/, o) {
	var h = 0x0600, w = 16;
	switch(o.bookType) {
		case 'biff8': break;
		case 'biff5': h = 0x0500; w = 8; break;
		case 'biff4': h = 0x0004; w = 6; break;
		case 'biff3': h = 0x0003; w = 6; break;
		case 'biff2': h = 0x0002; w = 4; break;
		case 'xla': break;
		default: throw new Error("unsupported BIFF version");
	}
	var out = new_buf(w);
	out.write_shift(2, h);
	out.write_shift(2, t);
	if(w > 4) out.write_shift(2, 0x7262);
	if(w > 6) out.write_shift(2, 0x07CD);
	if(w > 8) {
		out.write_shift(2, 0xC009);
		out.write_shift(2, 0x0001);
		out.write_shift(2, 0x0706);
		out.write_shift(2, 0x0000);
	}
	return out;
}


/* [MS-XLS] 2.4.146 */
function parse_InterfaceHdr(blob, length) {
	if(length === 0) return 0x04b0;
	if((blob.read_shift(2))!==0x04b0);
	return 0x04b0;
}


/* [MS-XLS] 2.4.349 */
function parse_WriteAccess(blob, length, opts) {
	if(opts.enc) { blob.l += length; return ""; }
	var l = blob.l;
	// TODO: make sure XLUnicodeString doesnt overrun
	var UserName = parse_XLUnicodeString2(blob, 0, opts);
	blob.read_shift(length + l - blob.l);
	return UserName;
}
function write_WriteAccess(s/*:string*/, opts) {
	var b8 = !opts || opts.biff == 8;
	var o = new_buf(b8 ? 112 : 54);
	o.write_shift(opts.biff == 8 ? 2 : 1, 7);
	if(b8) o.write_shift(1, 0);
	o.write_shift(4, 0x33336853);
	o.write_shift(4, (0x00534A74 | (b8 ? 0 : 0x20000000)));
	while(o.l < o.length) o.write_shift(1, (b8 ? 0 : 32));
	return o;
}

/* [MS-XLS] 2.4.351 */
function parse_WsBool(blob, length, opts) {
	var flags = opts && opts.biff == 8 || length == 2 ? blob.read_shift(2) : (blob.l += length, 0);
	return { fDialog: flags & 0x10, fBelow: flags & 0x40, fRight: flags & 0x80 };
}

/* [MS-XLS] 2.4.28 */
function parse_BoundSheet8(blob, length, opts) {
	var pos = blob.read_shift(4);
	var hidden = blob.read_shift(1) & 0x03;
	var dt = blob.read_shift(1);
	switch(dt) {
		case 0: dt = 'Worksheet'; break;
		case 1: dt = 'Macrosheet'; break;
		case 2: dt = 'Chartsheet'; break;
		case 6: dt = 'VBAModule'; break;
	}
	var name = parse_ShortXLUnicodeString(blob, 0, opts);
	if(name.length === 0) name = "Sheet1";
	return { pos:pos, hs:hidden, dt:dt, name:name };
}
function write_BoundSheet8(data, opts) {
	var w = (!opts || opts.biff >= 8 ? 2 : 1);
	var o = new_buf(8 + w * data.name.length);
	o.write_shift(4, data.pos);
	o.write_shift(1, data.hs || 0);
	o.write_shift(1, data.dt);
	o.write_shift(1, data.name.length);
	if(opts.biff >= 8) o.write_shift(1, 1);
	o.write_shift(w * data.name.length, data.name, opts.biff < 8 ? 'sbcs' : 'utf16le');
	var out = o.slice(0, o.l);
	out.l = o.l; return out;
}

/* [MS-XLS] 2.4.265 TODO */
function parse_SST(blob, length)/*:SST*/ {
	var end = blob.l + length;
	var cnt = blob.read_shift(4);
	var ucnt = blob.read_shift(4);
	var strs/*:SST*/ = ([]/*:any*/);
	for(var i = 0; i != ucnt && blob.l < end; ++i) {
		strs.push(parse_XLUnicodeRichExtendedString(blob));
	}
	strs.Count = cnt; strs.Unique = ucnt;
	return strs;
}
function write_SST(sst, opts) {
	var header = new_buf(8);
	header.write_shift(4, sst.Count);
	header.write_shift(4, sst.Unique);
	var strs = [];
	for(var j = 0; j < sst.length; ++j) strs[j] = write_XLUnicodeRichExtendedString(sst[j]);
	var o = bconcat([header].concat(strs));
	/*::(*/o/*:: :any)*/.parts = [header.length].concat(strs.map(function(str) { return str.length; }));
	return o;
}

/* [MS-XLS] 2.4.107 */
function parse_ExtSST(blob, length) {
	var extsst = {};
	extsst.dsst = blob.read_shift(2);
	blob.l += length-2;
	return extsst;
}


/* [MS-XLS] 2.4.221 TODO: check BIFF2-4 */
function parse_Row(blob) {
	var z = ({}/*:any*/);
	z.r = blob.read_shift(2);
	z.c = blob.read_shift(2);
	z.cnt = blob.read_shift(2) - z.c;
	var miyRw = blob.read_shift(2);
	blob.l += 4; // reserved(2), unused(2)
	var flags = blob.read_shift(1); // various flags
	blob.l += 3; // reserved(8), ixfe(12), flags(4)
	if(flags & 0x07) z.level = flags & 0x07;
	// collapsed: flags & 0x10
	if(flags & 0x20) z.hidden = true;
	if(flags & 0x40) z.hpt = miyRw / 20;
	return z;
}


/* [MS-XLS] 2.4.125 */
function parse_ForceFullCalculation(blob) {
	var header = parse_frtHeader(blob);
	if(header.type != 0x08A3) throw new Error("Invalid Future Record " + header.type);
	var fullcalc = blob.read_shift(4);
	return fullcalc !== 0x0;
}





/* [MS-XLS] 2.4.215 rt */
function parse_RecalcId(blob) {
	blob.read_shift(2);
	return blob.read_shift(4);
}

/* [MS-XLS] 2.4.87 */
function parse_DefaultRowHeight(blob, length, opts) {
	var f = 0;
	if(!(opts && opts.biff == 2)) {
		f = blob.read_shift(2);
	}
	var miyRw = blob.read_shift(2);
	if((opts && opts.biff == 2)) {
		f = 1 - (miyRw >> 15); miyRw &= 0x7fff;
	}
	var fl = {Unsynced:f&1,DyZero:(f&2)>>1,ExAsc:(f&4)>>2,ExDsc:(f&8)>>3};
	return [fl, miyRw];
}

/* [MS-XLS] 2.4.345 TODO */
function parse_Window1(blob) {
	var xWn = blob.read_shift(2), yWn = blob.read_shift(2), dxWn = blob.read_shift(2), dyWn = blob.read_shift(2);
	var flags = blob.read_shift(2), iTabCur = blob.read_shift(2), iTabFirst = blob.read_shift(2);
	var ctabSel = blob.read_shift(2), wTabRatio = blob.read_shift(2);
	return { Pos: [xWn, yWn], Dim: [dxWn, dyWn], Flags: flags, CurTab: iTabCur,
		FirstTab: iTabFirst, Selected: ctabSel, TabRatio: wTabRatio };
}
function write_Window1(/*::opts*/) {
	var o = new_buf(18);
	o.write_shift(2, 0);
	o.write_shift(2, 0);
	o.write_shift(2, 0x7260);
	o.write_shift(2, 0x44c0);
	o.write_shift(2, 0x38);
	o.write_shift(2, 0);
	o.write_shift(2, 0);
	o.write_shift(2, 1);
	o.write_shift(2, 0x01f4);
	return o;
}
/* [MS-XLS] 2.4.346 TODO */
function parse_Window2(blob, length, opts) {
	if(opts && opts.biff >= 2 && opts.biff < 5) return {};
	var f = blob.read_shift(2);
	return { RTL: f & 0x40 };
}
function write_Window2(view) {
	var o = new_buf(18), f = 0x6b6;
	if(view && view.RTL) f |= 0x40;
	o.write_shift(2, f);
	o.write_shift(4, 0);
	o.write_shift(4, 64);
	o.write_shift(4, 0);
	o.write_shift(4, 0);
	return o;
}

/* [MS-XLS] 2.4.189 TODO */
function parse_Pane(/*blob, length, opts*/) {
}

/* [MS-XLS] 2.4.122 TODO */
function parse_Font(blob, length, opts) {
	var o/*:any*/ = {
		dyHeight: blob.read_shift(2),
		fl: blob.read_shift(2)
	};
	switch((opts && opts.biff) || 8) {
		case 2: break;
		case 3: case 4: blob.l += 2; break;
		default: blob.l += 10; break;
	}
	o.name = parse_ShortXLUnicodeString(blob, 0, opts);
	return o;
}
function write_Font(data, opts) {
	var name = data.name || "Arial";
	var b5 = (opts && (opts.biff == 5)), w = (b5 ? (15 + name.length) : (16 + 2 * name.length));
	var o = new_buf(w);
	o.write_shift(2, (data.sz || 12) * 20);
	o.write_shift(4, 0);
	o.write_shift(2, 400);
	o.write_shift(4, 0);
	o.write_shift(2, 0);
	o.write_shift(1, name.length);
	if(!b5) o.write_shift(1, 1);
	o.write_shift((b5 ? 1 : 2) * name.length, name, (b5 ? "sbcs" : "utf16le"));
	return o;
}

/* [MS-XLS] 2.4.149 */
function parse_LabelSst(blob) {
	var cell = parse_XLSCell(blob);
	cell.isst = blob.read_shift(4);
	return cell;
}
function write_LabelSst(R/*:number*/, C/*:number*/, v/*:number*/, os/*:number*/ /*::, opts*/) {
	var o = new_buf(10);
	write_XLSCell(R, C, os, o);
	o.write_shift(4, v);
	return o;
}

/* [MS-XLS] 2.4.148 */
function parse_Label(blob, length, opts) {
	if(opts.biffguess && opts.biff == 2) opts.biff = 5;
	var target = blob.l + length;
	var cell = parse_XLSCell(blob);
	if(opts.biff == 2) blob.l++;
	var str = parse_XLUnicodeString(blob, target - blob.l, opts);
	cell.val = str;
	return cell;
}
function write_Label(R/*:number*/, C/*:number*/, v/*:string*/, os/*:number*/, opts) {
	var b8 = !opts || opts.biff == 8;
	var o = new_buf(6 + 2 + (+b8) + (1 + b8) * v.length);
	write_XLSCell(R, C, os, o);
	o.write_shift(2, v.length);
	if(b8) o.write_shift(1, 1);
	o.write_shift((1 + b8) * v.length, v, b8 ? 'utf16le' : 'sbcs');
	return o;
}


/* [MS-XLS] 2.4.126 Number Formats */
function parse_Format(blob, length, opts) {
	var numFmtId = blob.read_shift(2);
	var fmtstr = parse_XLUnicodeString2(blob, 0, opts);
	return [numFmtId, fmtstr];
}
function write_Format(i/*:number*/, f/*:string*/, opts, o) {
	var b5 = (opts && (opts.biff == 5));
	if(!o) o = new_buf(b5 ? (3 + f.length) : (5 + 2 * f.length));
	o.write_shift(2, i);
	o.write_shift((b5 ? 1 : 2), f.length);
	if(!b5) o.write_shift(1, 1);
	o.write_shift((b5 ? 1 : 2) * f.length, f, (b5 ? 'sbcs' : 'utf16le'));
	var out = (o.length > o.l) ? o.slice(0, o.l) : o;
	if(out.l == null) out.l = out.length;
	return out;
}
var parse_BIFF2Format = parse_XLUnicodeString2;

/* [MS-XLS] 2.4.90 */
function parse_Dimensions(blob, length, opts) {
	var end = blob.l + length;
	var w = opts.biff == 8 || !opts.biff ? 4 : 2;
	var r = blob.read_shift(w), R = blob.read_shift(w);
	var c = blob.read_shift(2), C = blob.read_shift(2);
	blob.l = end;
	return {s: {r:r, c:c}, e: {r:R, c:C}};
}
function write_Dimensions(range, opts) {
	var w = opts.biff == 8 || !opts.biff ? 4 : 2;
	var o = new_buf(2*w + 6);
	o.write_shift(w, range.s.r);
	o.write_shift(w, range.e.r + 1);
	o.write_shift(2, range.s.c);
	o.write_shift(2, range.e.c + 1);
	o.write_shift(2, 0);
	return o;
}

/* [MS-XLS] 2.4.220 */
function parse_RK(blob) {
	var rw = blob.read_shift(2), col = blob.read_shift(2);
	var rkrec = parse_RkRec(blob);
	return {r:rw, c:col, ixfe:rkrec[0], rknum:rkrec[1]};
}

/* [MS-XLS] 2.4.175 */
function parse_MulRk(blob, length) {
	var target = blob.l + length - 2;
	var rw = blob.read_shift(2), col = blob.read_shift(2);
	var rkrecs = [];
	while(blob.l < target) rkrecs.push(parse_RkRec(blob));
	if(blob.l !== target) throw new Error("MulRK read error");
	var lastcol = blob.read_shift(2);
	if(rkrecs.length != lastcol - col + 1) throw new Error("MulRK length mismatch");
	return {r:rw, c:col, C:lastcol, rkrec:rkrecs};
}
/* [MS-XLS] 2.4.174 */
function parse_MulBlank(blob, length) {
	var target = blob.l + length - 2;
	var rw = blob.read_shift(2), col = blob.read_shift(2);
	var ixfes = [];
	while(blob.l < target) ixfes.push(blob.read_shift(2));
	if(blob.l !== target) throw new Error("MulBlank read error");
	var lastcol = blob.read_shift(2);
	if(ixfes.length != lastcol - col + 1) throw new Error("MulBlank length mismatch");
	return {r:rw, c:col, C:lastcol, ixfe:ixfes};
}

/* [MS-XLS] 2.5.20 2.5.249 TODO: interpret values here */
function parse_CellStyleXF(blob, length, style, opts) {
	var o = {};
	var a = blob.read_shift(4), b = blob.read_shift(4);
	var c = blob.read_shift(4), d = blob.read_shift(2);
	o.patternType = XLSFillPattern[c >> 26];

	if(!opts.cellStyles) return o;
	o.alc = a & 0x07;
	o.fWrap = (a >> 3) & 0x01;
	o.alcV = (a >> 4) & 0x07;
	o.fJustLast = (a >> 7) & 0x01;
	o.trot = (a >> 8) & 0xFF;
	o.cIndent = (a >> 16) & 0x0F;
	o.fShrinkToFit = (a >> 20) & 0x01;
	o.iReadOrder = (a >> 22) & 0x02;
	o.fAtrNum = (a >> 26) & 0x01;
	o.fAtrFnt = (a >> 27) & 0x01;
	o.fAtrAlc = (a >> 28) & 0x01;
	o.fAtrBdr = (a >> 29) & 0x01;
	o.fAtrPat = (a >> 30) & 0x01;
	o.fAtrProt = (a >> 31) & 0x01;

	o.dgLeft = b & 0x0F;
	o.dgRight = (b >> 4) & 0x0F;
	o.dgTop = (b >> 8) & 0x0F;
	o.dgBottom = (b >> 12) & 0x0F;
	o.icvLeft = (b >> 16) & 0x7F;
	o.icvRight = (b >> 23) & 0x7F;
	o.grbitDiag = (b >> 30) & 0x03;

	o.icvTop = c & 0x7F;
	o.icvBottom = (c >> 7) & 0x7F;
	o.icvDiag = (c >> 14) & 0x7F;
	o.dgDiag = (c >> 21) & 0x0F;

	o.icvFore = d & 0x7F;
	o.icvBack = (d >> 7) & 0x7F;
	o.fsxButton = (d >> 14) & 0x01;
	return o;
}
//function parse_CellXF(blob, length, opts) {return parse_CellStyleXF(blob,length,0, opts);}
//function parse_StyleXF(blob, length, opts) {return parse_CellStyleXF(blob,length,1, opts);}

/* [MS-XLS] 2.4.353 TODO: actually do this right */
function parse_XF(blob, length, opts) {
	var o = {};
	o.ifnt = blob.read_shift(2); o.numFmtId = blob.read_shift(2); o.flags = blob.read_shift(2);
	o.fStyle = (o.flags >> 2) & 0x01;
	length -= 6;
	o.data = parse_CellStyleXF(blob, length, o.fStyle, opts);
	return o;
}
function write_XF(data, ixfeP, opts, o) {
	var b5 = (opts && (opts.biff == 5));
	if(!o) o = new_buf(b5 ? 16 : 20);
	o.write_shift(2, 0);
	if(data.style) {
		o.write_shift(2, (data.numFmtId||0));
		o.write_shift(2, 0xFFF4);
	} else {
		o.write_shift(2, (data.numFmtId||0));
		o.write_shift(2, (ixfeP<<4));
	}
	var f = 0;
	if(data.numFmtId > 0 && b5) f |= 0x0400;
	o.write_shift(4, f);
	o.write_shift(4, 0);
	if(!b5) o.write_shift(4, 0);
	o.write_shift(2, 0);
	return o;
}

/* [MS-XLS] 2.4.134 */
function parse_Guts(blob) {
	blob.l += 4;
	var out = [blob.read_shift(2), blob.read_shift(2)];
	if(out[0] !== 0) out[0]--;
	if(out[1] !== 0) out[1]--;
	if(out[0] > 7 || out[1] > 7) throw new Error("Bad Gutters: " + out.join("|"));
	return out;
}
function write_Guts(guts/*:Array<number>*/) {
	var o = new_buf(8);
	o.write_shift(4, 0);
	o.write_shift(2, guts[0] ? guts[0] + 1 : 0);
	o.write_shift(2, guts[1] ? guts[1] + 1 : 0);
	return o;
}

/* [MS-XLS] 2.4.24 */
function parse_BoolErr(blob, length, opts) {
	var cell = parse_XLSCell(blob);
	if(opts.biff == 2 || length == 9) ++blob.l;
	var val = parse_Bes(blob);
	cell.val = val;
	cell.t = (val === true || val === false) ? 'b' : 'e';
	return cell;
}
function write_BoolErr(R/*:number*/, C/*:number*/, v, os/*:number*/, opts, t/*:string*/) {
	var o = new_buf(8);
	write_XLSCell(R, C, os, o);
	write_Bes(v, t, o);
	return o;
}

/* [MS-XLS] 2.4.180 Number */
function parse_Number(blob, length, opts) {
	if(opts.biffguess && opts.biff == 2) opts.biff = 5;
	var cell = parse_XLSCell(blob);
	var xnum = parse_Xnum(blob);
	cell.val = xnum;
	return cell;
}
function write_Number(R/*:number*/, C/*:number*/, v, os/*:: :number, opts*/) {
	var o = new_buf(14);
	write_XLSCell(R, C, os, o);
	write_Xnum(v, o);
	return o;
}

var parse_XLHeaderFooter = parse_OptXLUnicodeString; // TODO: parse 2.4.136

/* [MS-XLS] 2.4.271 */
function parse_SupBook(blob, length, opts) {
	var end = blob.l + length;
	var ctab = blob.read_shift(2);
	var cch = blob.read_shift(2);
	opts.sbcch = cch;
	if(cch == 0x0401 || cch == 0x3A01) return [cch, ctab];
	if(cch < 0x01 || cch >0xff) throw new Error("Unexpected SupBook type: "+cch);
	var virtPath = parse_XLUnicodeStringNoCch(blob, cch);
	/* TODO: 2.5.277 Virtual Path */
	var rgst = [];
	while(end > blob.l) rgst.push(parse_XLUnicodeString(blob));
	return [cch, ctab, virtPath, rgst];
}

/* [MS-XLS] 2.4.105 TODO */
function parse_ExternName(blob, length, opts) {
	var flags = blob.read_shift(2);
	var body;
	var o = ({
		fBuiltIn: flags & 0x01,
		fWantAdvise: (flags >>> 1) & 0x01,
		fWantPict: (flags >>> 2) & 0x01,
		fOle: (flags >>> 3) & 0x01,
		fOleLink: (flags >>> 4) & 0x01,
		cf: (flags >>> 5) & 0x3FF,
		fIcon: flags >>> 15 & 0x01
	}/*:any*/);
	if(opts.sbcch === 0x3A01) body = parse_AddinUdf(blob, length-2, opts);
	//else throw new Error("unsupported SupBook cch: " + opts.sbcch);
	o.body = body || blob.read_shift(length-2);
	if(typeof body === "string") o.Name = body;
	return o;
}

/* [MS-XLS] 2.4.150 TODO */
function parse_Lbl(blob, length, opts) {
	var target = blob.l + length;
	var flags = blob.read_shift(2);
	var chKey = blob.read_shift(1);
	var cch = blob.read_shift(1);
	var cce = blob.read_shift(opts && opts.biff == 2 ? 1 : 2);
	var itab = 0;
	if(!opts || opts.biff >= 5) {
		if(opts.biff != 5) blob.l += 2;
		itab = blob.read_shift(2);
		if(opts.biff == 5) blob.l += 2;
		blob.l += 4;
	}
	var name = parse_XLUnicodeStringNoCch(blob, cch, opts);
	if(flags & 0x20) name = XLSLblBuiltIn[name.charCodeAt(0)];
	var npflen = target - blob.l; if(opts && opts.biff == 2) --npflen;
	/*jshint -W018 */
	var rgce = (target == blob.l || cce === 0 || !(npflen > 0)) ? [] : parse_NameParsedFormula(blob, npflen, opts, cce);
	/*jshint +W018 */
	return {
		chKey: chKey,
		Name: name,
		itab: itab,
		rgce: rgce
	};
}

/* [MS-XLS] 2.4.106 TODO: legacy record filename encoding */
function parse_ExternSheet(blob, length, opts) {
	if(opts.biff < 8) return parse_BIFF5ExternSheet(blob, length, opts);
	/* see issue 2907 */
	if(!(opts.biff > 8) && (length == blob[blob.l] + (blob[blob.l+1] == 0x03 ? 1 : 0) + 1)) return parse_BIFF5ExternSheet(blob, length, opts);
	var o = [], target = blob.l + length, len = blob.read_shift(opts.biff > 8 ? 4 : 2);
	while(len-- !== 0) o.push(parse_XTI(blob, opts.biff > 8 ? 12 : 6, opts));
		// [iSupBook, itabFirst, itabLast];
	if(blob.l != target) throw new Error("Bad ExternSheet: " + blob.l + " != " + target);
	return o;
}
function parse_BIFF5ExternSheet(blob, length, opts) {
	if(blob[blob.l + 1] == 0x03) blob[blob.l]++;
	var o = parse_ShortXLUnicodeString(blob, length, opts);
	return o.charCodeAt(0) == 0x03 ? o.slice(1) : o;
}

/* [MS-XLS] 2.4.176 TODO: check older biff */
function parse_NameCmt(blob, length, opts) {
	if(opts.biff < 8) { blob.l += length; return; }
	var cchName = blob.read_shift(2);
	var cchComment = blob.read_shift(2);
	var name = parse_XLUnicodeStringNoCch(blob, cchName, opts);
	var comment = parse_XLUnicodeStringNoCch(blob, cchComment, opts);
	return [name, comment];
}

/* [MS-XLS] 2.4.260 */
function parse_ShrFmla(blob, length, opts) {
	var ref = parse_RefU(blob);
	blob.l++;
	var cUse = blob.read_shift(1);
	length -= 8;
	return [parse_SharedParsedFormula(blob, length, opts), cUse, ref];
}

/* [MS-XLS] 2.4.4 TODO */
function parse_Array(blob, length, opts) {
	var ref = parse_Ref(blob);
	/* TODO: fAlwaysCalc */
	switch(opts.biff) {
		case 2: blob.l ++; length -= 7; break;
		case 3: case 4: blob.l += 2; length -= 8; break;
		default: blob.l += 6; length -= 12;
	}
	return [ref, parse_ArrayParsedFormula(blob, length, opts)];
}

/* [MS-XLS] 2.4.173 */
function parse_MTRSettings(blob) {
	var fMTREnabled = blob.read_shift(4) !== 0x00;
	var fUserSetThreadCount = blob.read_shift(4) !== 0x00;
	var cUserThreadCount = blob.read_shift(4);
	return [fMTREnabled, fUserSetThreadCount, cUserThreadCount];
}

/* [MS-XLS] 2.5.186 TODO: BIFF5 */
function parse_NoteSh(blob, length, opts) {
	if(opts.biff < 8) return;
	var row = blob.read_shift(2), col = blob.read_shift(2);
	var flags = blob.read_shift(2), idObj = blob.read_shift(2);
	var stAuthor = parse_XLUnicodeString2(blob, 0, opts);
	if(opts.biff < 8) blob.read_shift(1);
	return [{r:row,c:col}, stAuthor, idObj, flags];
}

/* [MS-XLS] 2.4.179 */
function parse_Note(blob, length, opts) {
	/* TODO: Support revisions */
	return parse_NoteSh(blob, length, opts);
}

/* [MS-XLS] 2.4.168 */
function parse_MergeCells(blob, length)/*:Array<Range>*/ {
	var merges/*:Array<Range>*/ = [];
	var cmcs = blob.read_shift(2);
	while (cmcs--) merges.push(parse_Ref8U(blob));
	return merges;
}
function write_MergeCells(merges/*:Array<Range>*/) {
	var o = new_buf(2 + merges.length * 8);
	o.write_shift(2, merges.length);
	for(var i = 0; i < merges.length; ++i) write_Ref8U(merges[i], o);
	return o;
}

/* [MS-XLS] 2.4.181 TODO: parse all the things! */
function parse_Obj(blob, length, opts) {
	if(opts && opts.biff < 8) return parse_BIFF5Obj(blob, length, opts);
	var cmo = parse_FtCmo(blob); // id, ot, flags
	var fts = parse_FtArray(blob, length-22, cmo[1]);
	return { cmo: cmo, ft:fts };
}
/* from older spec */
var parse_BIFF5OT = {
0x08: function(blob, length) {
	var tgt = blob.l + length;
	blob.l += 10; // todo
	var cf = blob.read_shift(2);
	blob.l += 4;
	blob.l += 2; //var cbPictFmla = blob.read_shift(2);
	blob.l += 2;
	blob.l += 2; //var grbit = blob.read_shift(2);
	blob.l += 4;
	var cchName = blob.read_shift(1);
	blob.l += cchName; // TODO: stName
	blob.l = tgt; // TODO: fmla
	return { fmt:cf };
}
};

function parse_BIFF5Obj(blob, length, opts) {
	blob.l += 4; //var cnt = blob.read_shift(4);
	var ot = blob.read_shift(2);
	var id = blob.read_shift(2);
	var grbit = blob.read_shift(2);
	blob.l += 2; //var colL = blob.read_shift(2);
	blob.l += 2; //var dxL = blob.read_shift(2);
	blob.l += 2; //var rwT = blob.read_shift(2);
	blob.l += 2; //var dyT = blob.read_shift(2);
	blob.l += 2; //var colR = blob.read_shift(2);
	blob.l += 2; //var dxR = blob.read_shift(2);
	blob.l += 2; //var rwB = blob.read_shift(2);
	blob.l += 2; //var dyB = blob.read_shift(2);
	blob.l += 2; //var cbMacro = blob.read_shift(2);
	blob.l += 6;
	length -= 36;
	var fts = [];
	fts.push((parse_BIFF5OT[ot]||parsenoop)(blob, length, opts));
	return { cmo: [id, ot, grbit], ft:fts };
}

/* [MS-XLS] 2.4.329 TODO: parse properly */
function parse_TxO(blob, length, opts) {
	var s = blob.l;
	var texts = "";
try {
	blob.l += 4;
	var ot = (opts.lastobj||{cmo:[0,0]}).cmo[1];
	var controlInfo; // eslint-disable-line no-unused-vars
	if([0,5,7,11,12,14].indexOf(ot) == -1) blob.l += 6;
	else controlInfo = parse_ControlInfo(blob, 6, opts); // eslint-disable-line no-unused-vars
	var cchText = blob.read_shift(2);
	/*var cbRuns = */blob.read_shift(2);
	/*var ifntEmpty = */parseuint16(blob, 2);
	var len = blob.read_shift(2);
	blob.l += len;
	//var fmla = parse_ObjFmla(blob, s + length - blob.l);

	for(var i = 1; i < blob.lens.length-1; ++i) {
		if(blob.l-s != blob.lens[i]) throw new Error("TxO: bad continue record");
		var hdr = blob[blob.l];
		var t = parse_XLUnicodeStringNoCch(blob, blob.lens[i+1]-blob.lens[i]-1);
		texts += t;
		if(texts.length >= (hdr ? cchText : 2*cchText)) break;
	}
	if(texts.length !== cchText && texts.length !== cchText*2) {
		throw new Error("cchText: " + cchText + " != " + texts.length);
	}

	blob.l = s + length;
	/* [MS-XLS] 2.5.272 TxORuns */
//	var rgTxoRuns = [];
//	for(var j = 0; j != cbRuns/8-1; ++j) blob.l += 8;
//	var cchText2 = blob.read_shift(2);
//	if(cchText2 !== cchText) throw new Error("TxOLastRun mismatch: " + cchText2 + " " + cchText);
//	blob.l += 6;
//	if(s + length != blob.l) throw new Error("TxO " + (s + length) + ", at " + blob.l);
	return { t: texts };
} catch(e) { blob.l = s + length; return { t: texts }; }
}

/* [MS-XLS] 2.4.140 */
function parse_HLink(blob, length) {
	var ref = parse_Ref8U(blob);
	blob.l += 16; /* CLSID */
	var hlink = parse_Hyperlink(blob, length-24);
	return [ref, hlink];
}
function write_HLink(hl) {
	var O = new_buf(24);
	var ref = decode_cell(hl[0]);
	O.write_shift(2, ref.r); O.write_shift(2, ref.r);
	O.write_shift(2, ref.c); O.write_shift(2, ref.c);
	var clsid = "d0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" ");
	for(var i = 0; i < 16; ++i) O.write_shift(1, parseInt(clsid[i], 16));
	return bconcat([O, write_Hyperlink(hl[1])]);
}


/* [MS-XLS] 2.4.141 */
function parse_HLinkTooltip(blob, length) {
	blob.read_shift(2);
	var ref = parse_Ref8U(blob);
	var wzTooltip = blob.read_shift((length-10)/2, 'dbcs-cont');
	wzTooltip = wzTooltip.replace(chr0,"");
	return [ref, wzTooltip];
}
function write_HLinkTooltip(hl) {
	var TT = hl[1].Tooltip;
	var O = new_buf(10 + 2 * (TT.length + 1));
	O.write_shift(2, 0x0800);
	var ref = decode_cell(hl[0]);
	O.write_shift(2, ref.r); O.write_shift(2, ref.r);
	O.write_shift(2, ref.c); O.write_shift(2, ref.c);
	for(var i = 0; i < TT.length; ++i) O.write_shift(2, TT.charCodeAt(i));
	O.write_shift(2, 0);
	return O;
}

/* [MS-XLS] 2.4.63 */
function parse_Country(blob)/*:[string|number, string|number]*/ {
	var o = [0,0], d;
	d = blob.read_shift(2); o[0] = CountryEnum[d] || d;
	d = blob.read_shift(2); o[1] = CountryEnum[d] || d;
	return o;
}
function write_Country(o) {
	if(!o) o = new_buf(4);
	o.write_shift(2, 0x01);
	o.write_shift(2, 0x01);
	return o;
}

/* [MS-XLS] 2.4.50 ClrtClient */
function parse_ClrtClient(blob) {
	var ccv = blob.read_shift(2);
	var o = [];
	while(ccv-->0) o.push(parse_LongRGB(blob));
	return o;
}

/* [MS-XLS] 2.4.188 */
function parse_Palette(blob) {
	var ccv = blob.read_shift(2);
	var o = [];
	while(ccv-->0) o.push(parse_LongRGB(blob));
	return o;
}

/* [MS-XLS] 2.4.354 */
function parse_XFCRC(blob) {
	blob.l += 2;
	var o = {cxfs:0, crc:0};
	o.cxfs = blob.read_shift(2);
	o.crc = blob.read_shift(4);
	return o;
}

/* [MS-XLS] 2.4.53 TODO: parse flags */
/* [MS-XLSB] 2.4.323 TODO: parse flags */
function parse_ColInfo(blob, length, opts) {
	if(!opts.cellStyles) return parsenoop(blob, length);
	var w = opts && opts.biff >= 12 ? 4 : 2;
	var colFirst = blob.read_shift(w);
	var colLast = blob.read_shift(w);
	var coldx = blob.read_shift(w);
	var ixfe = blob.read_shift(w);
	var flags = blob.read_shift(2);
	if(w == 2) blob.l += 2;
	var o = ({s:colFirst, e:colLast, w:coldx, ixfe:ixfe, flags:flags}/*:any*/);
	if(opts.biff >= 5 || !opts.biff) o.level = (flags >> 8) & 0x7;
	return o;
}
function write_ColInfo(col, idx) {
	var o = new_buf(12);
	o.write_shift(2, idx);
	o.write_shift(2, idx);
	o.write_shift(2, col.width * 256);
	o.write_shift(2, 0);
	var f = 0;
	if(col.hidden) f |= 1;
	o.write_shift(1, f);
	f = col.level || 0;
	o.write_shift(1, f);
	o.write_shift(2, 0);
	return o;
}

/* [MS-XLS] 2.4.257 */
function parse_Setup(blob, length) {
	var o = {};
	if(length < 32) return o;
	blob.l += 16;
	o.header = parse_Xnum(blob);
	o.footer = parse_Xnum(blob);
	blob.l += 2;
	return o;
}

/* [MS-XLS] 2.4.261 */
function parse_ShtProps(blob, length, opts) {
	var def = {area:false};
	if(opts.biff != 5) { blob.l += length; return def; }
	var d = blob.read_shift(1); blob.l += 3;
	if((d & 0x10)) def.area = true;
	return def;
}

/* [MS-XLS] 2.4.241 */
function write_RRTabId(n/*:number*/) {
	var out = new_buf(2 * n);
	for(var i = 0; i < n; ++i) out.write_shift(2, i+1);
	return out;
}

var parse_Blank = parse_XLSCell; /* [MS-XLS] 2.4.20 Just the cell */
var parse_Scl = parseuint16a; /* [MS-XLS] 2.4.247 num, den */
var parse_String = parse_XLUnicodeString; /* [MS-XLS] 2.4.268 */

/* --- Specific to versions before BIFF8 --- */
function parse_ImData(blob) {
	var cf = blob.read_shift(2);
	var env = blob.read_shift(2);
	var lcb = blob.read_shift(4);
	var o = {fmt:cf, env:env, len:lcb, data:blob.slice(blob.l,blob.l+lcb)};
	blob.l += lcb;
	return o;
}

/* BIFF2_??? where ??? is the name from [XLS] */
function parse_BIFF2STR(blob, length, opts) {
	if(opts.biffguess && opts.biff == 5) opts.biff = 2;
	var cell = parse_XLSCell(blob);
	++blob.l;
	var str = parse_XLUnicodeString2(blob, length-7, opts);
	cell.t = 'str';
	cell.val = str;
	return cell;
}

function parse_BIFF2NUM(blob/*::, length*/) {
	var cell = parse_XLSCell(blob);
	++blob.l;
	var num = parse_Xnum(blob);
	cell.t = 'n';
	cell.val = num;
	return cell;
}
function write_BIFF2NUM(r/*:number*/, c/*:number*/, val/*:number*/) {
	var out = new_buf(15);
	write_BIFF2Cell(out, r, c);
	out.write_shift(8, val, 'f');
	return out;
}

function parse_BIFF2INT(blob) {
	var cell = parse_XLSCell(blob);
	++blob.l;
	var num = blob.read_shift(2);
	cell.t = 'n';
	cell.val = num;
	return cell;
}
function write_BIFF2INT(r/*:number*/, c/*:number*/, val/*:number*/) {
	var out = new_buf(9);
	write_BIFF2Cell(out, r, c);
	out.write_shift(2, val);
	return out;
}

function parse_BIFF2STRING(blob) {
	var cch = blob.read_shift(1);
	if(cch === 0) { blob.l++; return ""; }
	return blob.read_shift(cch, 'sbcs-cont');
}

/* TODO: convert to BIFF8 font struct */
function parse_BIFF2FONTXTRA(blob, length) {
	blob.l += 6; // unknown
	blob.l += 2; // font weight "bls"
	blob.l += 1; // charset
	blob.l += 3; // unknown
	blob.l += 1; // font family
	blob.l += length - 13;
}

/* TODO: parse rich text runs */
function parse_RString(blob, length, opts) {
	var end = blob.l + length;
	var cell = parse_XLSCell(blob);
	var cch = blob.read_shift(2);
	var str = parse_XLUnicodeStringNoCch(blob, cch, opts);
	blob.l = end;
	cell.t = 'str';
	cell.val = str;
	return cell;
}
var DBF_SUPPORTED_VERSIONS = [0x02, 0x03, 0x30, 0x31, 0x83, 0x8B, 0x8C, 0xF5];
var DBF = /*#__PURE__*/(function() {
var dbf_codepage_map = {
	/* Code Pages Supported by Visual FoxPro */
	/*::[*/0x01/*::]*/:   437,           /*::[*/0x02/*::]*/:   850,
	/*::[*/0x03/*::]*/:  1252,           /*::[*/0x04/*::]*/: 10000,
	/*::[*/0x64/*::]*/:   852,           /*::[*/0x65/*::]*/:   866,
	/*::[*/0x66/*::]*/:   865,           /*::[*/0x67/*::]*/:   861,
	/*::[*/0x68/*::]*/:   895,           /*::[*/0x69/*::]*/:   620,
	/*::[*/0x6A/*::]*/:   737,           /*::[*/0x6B/*::]*/:   857,
	/*::[*/0x78/*::]*/:   950,           /*::[*/0x79/*::]*/:   949,
	/*::[*/0x7A/*::]*/:   936,           /*::[*/0x7B/*::]*/:   932,
	/*::[*/0x7C/*::]*/:   874,           /*::[*/0x7D/*::]*/:  1255,
	/*::[*/0x7E/*::]*/:  1256,           /*::[*/0x96/*::]*/: 10007,
	/*::[*/0x97/*::]*/: 10029,           /*::[*/0x98/*::]*/: 10006,
	/*::[*/0xC8/*::]*/:  1250,           /*::[*/0xC9/*::]*/:  1251,
	/*::[*/0xCA/*::]*/:  1254,           /*::[*/0xCB/*::]*/:  1253,

	/* shapefile DBF extension */
	/*::[*/0x00/*::]*/: 20127,           /*::[*/0x08/*::]*/:   865,
	/*::[*/0x09/*::]*/:   437,           /*::[*/0x0A/*::]*/:   850,
	/*::[*/0x0B/*::]*/:   437,           /*::[*/0x0D/*::]*/:   437,
	/*::[*/0x0E/*::]*/:   850,           /*::[*/0x0F/*::]*/:   437,
	/*::[*/0x10/*::]*/:   850,           /*::[*/0x11/*::]*/:   437,
	/*::[*/0x12/*::]*/:   850,           /*::[*/0x13/*::]*/:   932,
	/*::[*/0x14/*::]*/:   850,           /*::[*/0x15/*::]*/:   437,
	/*::[*/0x16/*::]*/:   850,           /*::[*/0x17/*::]*/:   865,
	/*::[*/0x18/*::]*/:   437,           /*::[*/0x19/*::]*/:   437,
	/*::[*/0x1A/*::]*/:   850,           /*::[*/0x1B/*::]*/:   437,
	/*::[*/0x1C/*::]*/:   863,           /*::[*/0x1D/*::]*/:   850,
	/*::[*/0x1F/*::]*/:   852,           /*::[*/0x22/*::]*/:   852,
	/*::[*/0x23/*::]*/:   852,           /*::[*/0x24/*::]*/:   860,
	/*::[*/0x25/*::]*/:   850,           /*::[*/0x26/*::]*/:   866,
	/*::[*/0x37/*::]*/:   850,           /*::[*/0x40/*::]*/:   852,
	/*::[*/0x4D/*::]*/:   936,           /*::[*/0x4E/*::]*/:   949,
	/*::[*/0x4F/*::]*/:   950,           /*::[*/0x50/*::]*/:   874,
	/*::[*/0x57/*::]*/:  1252,           /*::[*/0x58/*::]*/:  1252,
	/*::[*/0x59/*::]*/:  1252,           /*::[*/0x6C/*::]*/:   863,
	/*::[*/0x86/*::]*/:   737,           /*::[*/0x87/*::]*/:   852,
	/*::[*/0x88/*::]*/:   857,           /*::[*/0xCC/*::]*/:  1257,

	/*::[*/0xFF/*::]*/: 16969
};
var dbf_reverse_map = evert({
	/*::[*/0x01/*::]*/:   437,           /*::[*/0x02/*::]*/:   850,
	/*::[*/0x03/*::]*/:  1252,           /*::[*/0x04/*::]*/: 10000,
	/*::[*/0x64/*::]*/:   852,           /*::[*/0x65/*::]*/:   866,
	/*::[*/0x66/*::]*/:   865,           /*::[*/0x67/*::]*/:   861,
	/*::[*/0x68/*::]*/:   895,           /*::[*/0x69/*::]*/:   620,
	/*::[*/0x6A/*::]*/:   737,           /*::[*/0x6B/*::]*/:   857,
	/*::[*/0x78/*::]*/:   950,           /*::[*/0x79/*::]*/:   949,
	/*::[*/0x7A/*::]*/:   936,           /*::[*/0x7B/*::]*/:   932,
	/*::[*/0x7C/*::]*/:   874,           /*::[*/0x7D/*::]*/:  1255,
	/*::[*/0x7E/*::]*/:  1256,           /*::[*/0x96/*::]*/: 10007,
	/*::[*/0x97/*::]*/: 10029,           /*::[*/0x98/*::]*/: 10006,
	/*::[*/0xC8/*::]*/:  1250,           /*::[*/0xC9/*::]*/:  1251,
	/*::[*/0xCA/*::]*/:  1254,           /*::[*/0xCB/*::]*/:  1253,
	/*::[*/0x00/*::]*/: 20127
});
/* TODO: find an actual specification */
function dbf_to_aoa(buf, opts)/*:AOA*/ {
	var out/*:AOA*/ = [];
	var d/*:Block*/ = (new_raw_buf(1)/*:any*/);
	switch(opts.type) {
		case 'base64': d = s2a(Base64_decode(buf)); break;
		case 'binary': d = s2a(buf); break;
		case 'buffer':
		case 'array': d = buf; break;
	}
	prep_blob(d, 0);

	/* header */
	var ft = d.read_shift(1);
	var memo = !!(ft & 0x88);
	var vfp = false, l7 = false;
	switch(ft) {
		case 0x02: break; // dBASE II
		case 0x03: break; // dBASE III
		case 0x30: vfp = true; memo = true; break; // VFP
		case 0x31: vfp = true; memo = true; break; // VFP with autoincrement
		// 0x43 dBASE IV SQL table files
		// 0x63 dBASE IV SQL system files
		case 0x83: break; // dBASE III with memo
		case 0x8B: break; // dBASE IV with memo
		case 0x8C: l7 = true; break; // dBASE Level 7 with memo
		// case 0xCB dBASE IV SQL table files with memo
		case 0xF5: break; // FoxPro 2.x with memo
		// case 0xFB FoxBASE
		default: throw new Error("DBF Unsupported Version: " + ft.toString(16));
	}

	var nrow = 0, fpos = 0x0209;
	if(ft == 0x02) nrow = d.read_shift(2);
	d.l += 3; // dBASE II stores DDMMYY date, others use YYMMDD
	if(ft != 0x02) nrow = d.read_shift(4);
	if(nrow > 1048576) nrow = 1e6;

	if(ft != 0x02) fpos = d.read_shift(2); // header length
	var rlen = d.read_shift(2); // record length

	var /*flags = 0,*/ current_cp = opts.codepage || 1252;
	if(ft != 0x02) { // 20 reserved bytes
		d.l+=16;
		/*flags = */d.read_shift(1);
		//if(memo && ((flags & 0x02) === 0)) throw new Error("DBF Flags " + flags.toString(16) + " ft " + ft.toString(16));

		/* codepage present in FoxPro and dBASE Level 7 */
		if(d[d.l] !== 0) current_cp = dbf_codepage_map[d[d.l]];
		d.l+=1;

		d.l+=2;
	}
	if(l7) d.l += 36; // Level 7: 32 byte "Language driver name", 4 byte reserved

/*:: type DBFField = { name:string; len:number; type:string; } */
	var fields/*:Array<DBFField>*/ = [], field/*:DBFField*/ = ({}/*:any*/);
	var hend = Math.min(d.length, (ft == 0x02 ? 0x209 : (fpos - 10 - (vfp ? 264 : 0))));
	var ww = l7 ? 32 : 11;
	while(d.l < hend && d[d.l] != 0x0d) {
		field = ({}/*:any*/);
		field.name = (typeof $cptable !== "undefined" ? $cptable.utils.decode(current_cp, d.slice(d.l, d.l+ww)) : a2s(d.slice(d.l, d.l + ww))).replace(/[\u0000\r\n].*$/g,"");
		d.l += ww;
		field.type = String.fromCharCode(d.read_shift(1));
		if(ft != 0x02 && !l7) field.offset = d.read_shift(4);
		field.len = d.read_shift(1);
		if(ft == 0x02) field.offset = d.read_shift(2);
		field.dec = d.read_shift(1);
		if(field.name.length) fields.push(field);
		if(ft != 0x02) d.l += l7 ? 13 : 14;
		switch(field.type) {
			case 'B': // Double (VFP) / Binary (dBASE L7)
				if((!vfp || field.len != 8) && opts.WTF) console.log('Skipping ' + field.name + ':' + field.type);
				break;
			case 'G': // General (FoxPro and dBASE L7)
			case 'P': // Picture (FoxPro and dBASE L7)
				if(opts.WTF) console.log('Skipping ' + field.name + ':' + field.type);
				break;
			case '+': // Autoincrement (dBASE L7 only)
			case '0': // _NullFlags (VFP only)
			case '@': // Timestamp (dBASE L7 only)
			case 'C': // Character (dBASE II)
			case 'D': // Date (dBASE III)
			case 'F': // Float (dBASE IV)
			case 'I': // Long (VFP and dBASE L7)
			case 'L': // Logical (dBASE II)
			case 'M': // Memo (dBASE III)
			case 'N': // Number (dBASE II)
			case 'O': // Double (dBASE L7 only)
			case 'T': // Datetime (VFP only)
			case 'Y': // Currency (VFP only)
				break;
			default: throw new Error('Unknown Field Type: ' + field.type);
		}
	}

	if(d[d.l] !== 0x0D) d.l = fpos-1;
	if(d.read_shift(1) !== 0x0D) throw new Error("DBF Terminator not found " + d.l + " " + d[d.l]);
	d.l = fpos;

	/* data */
	var R = 0, C = 0;
	out[0] = [];
	for(C = 0; C != fields.length; ++C) out[0][C] = fields[C].name;
	while(nrow-- > 0) {
		if(d[d.l] === 0x2A) {
			// TODO: record marked as deleted -- create a hidden row?
			d.l+=rlen;
			continue;
		}
		++d.l;
		out[++R] = []; C = 0;
		for(C = 0; C != fields.length; ++C) {
			var dd = d.slice(d.l, d.l+fields[C].len); d.l+=fields[C].len;
			prep_blob(dd, 0);
			var s = typeof $cptable !== "undefined" ? $cptable.utils.decode(current_cp, dd) : a2s(dd);
			switch(fields[C].type) {
				case 'C':
					// NOTE: it is conventional to write '  /  /  ' for empty dates
					if(s.trim().length) out[R][C] = s.replace(/\s+$/,"");
					break;
				case 'D':
					if(s.length === 8) out[R][C] = new Date(+s.slice(0,4), +s.slice(4,6)-1, +s.slice(6,8));
					else out[R][C] = s;
					break;
				case 'F': out[R][C] = parseFloat(s.trim()); break;
				case '+': case 'I': out[R][C] = l7 ? dd.read_shift(-4, 'i') ^ 0x80000000 : dd.read_shift(4, 'i'); break;
				case 'L': switch(s.trim().toUpperCase()) {
					case 'Y': case 'T': out[R][C] = true; break;
					case 'N': case 'F': out[R][C] = false; break;
					case '': case '?': break;
					default: throw new Error("DBF Unrecognized L:|" + s + "|");
					} break;
				case 'M': /* TODO: handle memo files */
					if(!memo) throw new Error("DBF Unexpected MEMO for type " + ft.toString(16));
					out[R][C] = "##MEMO##" + (l7 ? parseInt(s.trim(), 10): dd.read_shift(4));
					break;
				case 'N':
					s = s.replace(/\u0000/g,"").trim();
					// NOTE: dBASE II interprets "  .  " as 0
					if(s && s != ".") out[R][C] = +s || 0; break;
				case '@':
					// NOTE: dBASE specs appear to be incorrect
					out[R][C] = new Date(dd.read_shift(-8, 'f') - 0x388317533400);
					break;
				case 'T': out[R][C] = new Date((dd.read_shift(4) - 0x253D8C) * 0x5265C00 + dd.read_shift(4)); break;
				case 'Y': out[R][C] = dd.read_shift(4,'i')/1e4 + (dd.read_shift(4, 'i')/1e4)*Math.pow(2,32); break;
				case 'O': out[R][C] = -dd.read_shift(-8, 'f'); break;
				case 'B': if(vfp && fields[C].len == 8) { out[R][C] = dd.read_shift(8,'f'); break; }
					/* falls through */
				case 'G': case 'P': dd.l += fields[C].len; break;
				case '0':
					if(fields[C].name === '_NullFlags') break;
					/* falls through */
				default: throw new Error("DBF Unsupported data type " + fields[C].type);
			}
		}
	}
	if(ft != 0x02) if(d.l < d.length && d[d.l++] != 0x1A) throw new Error("DBF EOF Marker missing " + (d.l-1) + " of " + d.length + " " + d[d.l-1].toString(16));
	if(opts && opts.sheetRows) out = out.slice(0, opts.sheetRows);
	opts.DBF = fields;
	return out;
}

function dbf_to_sheet(buf, opts)/*:Worksheet*/ {
	var o = opts || {};
	if(!o.dateNF) o.dateNF = "yyyymmdd";
	var ws = aoa_to_sheet(dbf_to_aoa(buf, o), o);
	ws["!cols"] = o.DBF.map(function(field) { return {
		wch: field.len,
		DBF: field
	};});
	delete o.DBF;
	return ws;
}

function dbf_to_workbook(buf, opts)/*:Workbook*/ {
	try {
		var o = sheet_to_workbook(dbf_to_sheet(buf, opts), opts);
		o.bookType = "dbf";
		return o;
	} catch(e) { if(opts && opts.WTF) throw e; }
	return ({SheetNames:[],Sheets:{}});
}

var _RLEN = { 'B': 8, 'C': 250, 'L': 1, 'D': 8, '?': 0, '': 0 };
function sheet_to_dbf(ws/*:Worksheet*/, opts/*:WriteOpts*/) {
	var o = opts || {};
	var old_cp = current_codepage;
	if(+o.codepage >= 0) set_cp(+o.codepage);
	if(o.type == "string") throw new Error("Cannot write DBF to JS string");
	var ba = buf_array();
	var aoa/*:AOA*/ = sheet_to_json(ws, {header:1, raw:true, cellDates:true});
	var headers = aoa[0], data = aoa.slice(1), cols = ws["!cols"] || [];
	var i = 0, j = 0, hcnt = 0, rlen = 1;
	for(i = 0; i < headers.length; ++i) {
		if(((cols[i]||{}).DBF||{}).name) { headers[i] = cols[i].DBF.name; ++hcnt; continue; }
		if(headers[i] == null) continue;
		++hcnt;
		if(typeof headers[i] === 'number') headers[i] = headers[i].toString(10);
		if(typeof headers[i] !== 'string') throw new Error("DBF Invalid column name " + headers[i] + " |" + (typeof headers[i]) + "|");
		if(headers.indexOf(headers[i]) !== i) for(j=0; j<1024;++j)
			if(headers.indexOf(headers[i] + "_" + j) == -1) { headers[i] += "_" + j; break; }
	}
	var range = safe_decode_range(ws['!ref']);
	var coltypes/*:Array<string>*/ = [];
	var colwidths/*:Array<number>*/ = [];
	var coldecimals/*:Array<number>*/ = [];
	for(i = 0; i <= range.e.c - range.s.c; ++i) {
		var guess = '', _guess = '', maxlen = 0;
		var col/*:Array<any>*/ = [];
		for(j=0; j < data.length; ++j) {
			if(data[j][i] != null) col.push(data[j][i]);
		}
		if(col.length == 0 || headers[i] == null) { coltypes[i] = '?'; continue; }
		for(j = 0; j < col.length; ++j) {
			switch(typeof col[j]) {
				/* TODO: check if L2 compat is desired */
				case 'number': _guess = 'B'; break;
				case 'string': _guess = 'C'; break;
				case 'boolean': _guess = 'L'; break;
				case 'object': _guess = col[j] instanceof Date ? 'D' : 'C'; break;
				default: _guess = 'C';
			}
			/* TODO: cache the values instead of encoding twice */
			maxlen = Math.max(maxlen, (typeof $cptable !== "undefined" && typeof col[j] == "string" ? $cptable.utils.encode(current_ansi, col[j]): String(col[j])).length);
			guess = guess && guess != _guess ? 'C' : _guess;
			//if(guess == 'C') break;
		}
		if(maxlen > 250) maxlen = 250;
		_guess = ((cols[i]||{}).DBF||{}).type;
		/* TODO: more fine grained control over DBF type resolution */
		if(_guess == 'C') {
			if(cols[i].DBF.len > maxlen) maxlen = cols[i].DBF.len;
		}
		if(guess == 'B' && _guess == 'N') {
			guess = 'N';
			coldecimals[i] = cols[i].DBF.dec;
			maxlen = cols[i].DBF.len;
		}
		colwidths[i] = guess == 'C' || _guess == 'N' ? maxlen : (_RLEN[guess] || 0);
		rlen += colwidths[i];
		coltypes[i] = guess;
	}

	var h = ba.next(32);
	h.write_shift(4, 0x13021130);
	h.write_shift(4, data.length);
	h.write_shift(2, 296 + 32 * hcnt);
	h.write_shift(2, rlen);
	for(i=0; i < 4; ++i) h.write_shift(4, 0);
	var cp = +dbf_reverse_map[/*::String(*/current_codepage/*::)*/] || 0x03;
	h.write_shift(4, 0x00000000 | (cp<<8));
	if(dbf_codepage_map[cp] != +o.codepage) {
		if(o.codepage) console.error("DBF Unsupported codepage " + current_codepage + ", using 1252");
		current_codepage = 1252;
	}

	for(i = 0, j = 0; i < headers.length; ++i) {
		if(headers[i] == null) continue;
		var hf = ba.next(32);
		/* TODO: test how applications handle non-ASCII field names */
		var _f = (headers[i].slice(-10) + "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00").slice(0, 11);
		hf.write_shift(1, _f, "sbcs");
		hf.write_shift(1, coltypes[i] == '?' ? 'C' : coltypes[i], "sbcs");
		hf.write_shift(4, j);
		hf.write_shift(1, colwidths[i] || _RLEN[coltypes[i]] || 0);
		hf.write_shift(1, coldecimals[i] || 0);
		hf.write_shift(1, 0x02);
		hf.write_shift(4, 0);
		hf.write_shift(1, 0);
		hf.write_shift(4, 0);
		hf.write_shift(4, 0);
		j += (colwidths[i] || _RLEN[coltypes[i]] || 0);
	}

	var hb = ba.next(264);
	hb.write_shift(4, 0x0000000D);
	for(i=0; i < 65;++i) hb.write_shift(4, 0x00000000);
	for(i=0; i < data.length; ++i) {
		var rout = ba.next(rlen);
		rout.write_shift(1, 0);
		for(j=0; j<headers.length; ++j) {
			if(headers[j] == null) continue;
			switch(coltypes[j]) {
				case 'L': rout.write_shift(1, data[i][j] == null ? 0x3F : data[i][j] ? 0x54 : 0x46); break;
				case 'B': rout.write_shift(8, data[i][j]||0, 'f'); break;
				case 'N':
					var _n = "0";
					if(typeof data[i][j] == "number") _n = data[i][j].toFixed(coldecimals[j]||0);
					if(_n.length > colwidths[j]) _n = _n.slice(0, colwidths[j]); // addresses decimal > width
					for(hcnt=0; hcnt < colwidths[j]-_n.length; ++hcnt) rout.write_shift(1, 0x20);
					rout.write_shift(1, _n, "sbcs");
					break;
				case 'D':
					if(!data[i][j]) rout.write_shift(8, "00000000", "sbcs");
					else {
						rout.write_shift(4, ("0000"+data[i][j].getFullYear()).slice(-4), "sbcs");
						rout.write_shift(2, ("00"+(data[i][j].getMonth()+1)).slice(-2), "sbcs");
						rout.write_shift(2, ("00"+data[i][j].getDate()).slice(-2), "sbcs");
					} break;
				case 'C':
					var _l = rout.l;
					var _s = String(data[i][j] != null ? data[i][j] : "").slice(0, colwidths[j]);
					rout.write_shift(1, _s, "cpstr");
					_l += colwidths[j] - rout.l;
					for(hcnt=0; hcnt < _l; ++hcnt) rout.write_shift(1, 0x20); break;
			}
		}
		// data
	}
	current_codepage = old_cp;
	ba.next(1).write_shift(1, 0x1A);
	return ba.end();
}
	return {
		to_workbook: dbf_to_workbook,
		to_sheet: dbf_to_sheet,
		from_sheet: sheet_to_dbf
	};
})();

var SYLK = /*#__PURE__*/(function() {
	/* TODO: stress test sequences */
	var sylk_escapes = ({
		AA:'À', BA:'Á', CA:'Â', DA:195, HA:'Ä', JA:197,
		AE:'È', BE:'É', CE:'Ê',         HE:'Ë',
		AI:'Ì', BI:'Í', CI:'Î',         HI:'Ï',
		AO:'Ò', BO:'Ó', CO:'Ô', DO:213, HO:'Ö',
		AU:'Ù', BU:'Ú', CU:'Û',         HU:'Ü',
		Aa:'à', Ba:'á', Ca:'â', Da:227, Ha:'ä', Ja:229,
		Ae:'è', Be:'é', Ce:'ê',         He:'ë',
		Ai:'ì', Bi:'í', Ci:'î',         Hi:'ï',
		Ao:'ò', Bo:'ó', Co:'ô', Do:245, Ho:'ö',
		Au:'ù', Bu:'ú', Cu:'û',         Hu:'ü',
		KC:'Ç', Kc:'ç', q:'æ',  z:'œ',  a:'Æ',  j:'Œ',
		DN:209, Dn:241, Hy:255,
		S:169,  c:170,  R:174,  "B ":180,
		/*::[*/0/*::]*/:176,    /*::[*/1/*::]*/:177,  /*::[*/2/*::]*/:178,
		/*::[*/3/*::]*/:179,    /*::[*/5/*::]*/:181,  /*::[*/6/*::]*/:182,
		/*::[*/7/*::]*/:183,    Q:185,  k:186,  b:208,  i:216,  l:222,  s:240,  y:248,
		"!":161, '"':162, "#":163, "(":164, "%":165, "'":167, "H ":168,
		"+":171, ";":187, "<":188, "=":189, ">":190, "?":191, "{":223
	}/*:any*/);
	var sylk_char_regex = new RegExp("\u001BN(" + keys(sylk_escapes).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g,"\\$1") + "|\\|)", "gm");
	var sylk_char_fn = function(_, $1){ var o = sylk_escapes[$1]; return typeof o == "number" ? _getansi(o) : o; };
	var decode_sylk_char = function($$, $1, $2) { var newcc = (($1.charCodeAt(0) - 0x20)<<4) | ($2.charCodeAt(0) - 0x30); return newcc == 59 ? $$ : _getansi(newcc); };
	sylk_escapes["|"] = 254;
	/* https://oss.sheetjs.com/notes/sylk/ for more details */
	function sylk_to_aoa(d/*:RawData*/, opts)/*:[AOA, Worksheet]*/ {
		switch(opts.type) {
			case 'base64': return sylk_to_aoa_str(Base64_decode(d), opts);
			case 'binary': return sylk_to_aoa_str(d, opts);
			case 'buffer': return sylk_to_aoa_str(has_buf && Buffer.isBuffer(d) ? d.toString('binary') : a2s(d), opts);
			case 'array': return sylk_to_aoa_str(cc2str(d), opts);
		}
		throw new Error("Unrecognized type " + opts.type);
	}
	function sylk_to_aoa_str(str/*:string*/, opts)/*:[AOA, Worksheet]*/ {
		var records = str.split(/[\n\r]+/), R = -1, C = -1, ri = 0, rj = 0, arr/*:AOA*/ = [];
		var formats/*:Array<string>*/ = [];
		var next_cell_format/*:string|null*/ = null;
		var sht = {}, rowinfo/*:Array<RowInfo>*/ = [], colinfo/*:Array<ColInfo>*/ = [], cw/*:Array<string>*/ = [];
		var Mval = 0, j;
		var wb = { Workbook: { WBProps: {}, Names: [] } };
		if(+opts.codepage >= 0) set_cp(+opts.codepage);
		for (; ri !== records.length; ++ri) {
			Mval = 0;
			var rstr=records[ri].trim().replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, decode_sylk_char).replace(sylk_char_regex, sylk_char_fn);
			var record=rstr.replace(/;;/g, "\u0000").split(";").map(function(x) { return x.replace(/\u0000/g, ";"); });
			var RT=record[0], val;
			if(rstr.length > 0) switch(RT) {
			case 'ID': break; /* header */
			case 'E': break; /* EOF */
			case 'B': break; /* dimensions */
			case 'O': /* workbook options */
			for(rj=1; rj<record.length; ++rj) switch(record[rj].charAt(0)) {
				case 'V': {
					var d1904 = parseInt(record[rj].slice(1), 10);
					// NOTE: it is technically an error if d1904 >= 5 or < 0
					if(d1904 >= 1 && d1904 <= 4) wb.Workbook.WBProps.date1904 = true;
				} break;
			} break;
			case 'W': break; /* window */
			case 'P':
				switch(record[1].charAt(0)){
					case 'P': formats.push(rstr.slice(3).replace(/;;/g, ";")); break;
				} break;
			case 'NN': { /* defined name */
				var nn = {Sheet: 0};
				for(rj=1; rj<record.length; ++rj) switch(record[rj].charAt(0)) {
					case 'N': nn.Name = record[rj].slice(1); break;
					case 'E': nn.Ref = (opts && opts.sheet || "Sheet1") + "!" + rc_to_a1(record[rj].slice(1)); break;
				}
				wb.Workbook.Names.push(nn);
			} break;
			// case 'NE': // ??
			// case 'NU': // ??
			case 'C': /* cell */
			var C_seen_K = false, C_seen_X = false, C_seen_S = false, C_seen_E = false, _R = -1, _C = -1, formula = "", cell_t = "z";
			for(rj=1; rj<record.length; ++rj) switch(record[rj].charAt(0)) {
				case 'A': break; // TODO: comment
				case 'X': C = parseInt(record[rj].slice(1), 10)-1; C_seen_X = true; break;
				case 'Y':
					R = parseInt(record[rj].slice(1), 10)-1; if(!C_seen_X) C = 0;
					for(j = arr.length; j <= R; ++j) arr[j] = [];
					break;
				case 'K':
					val = record[rj].slice(1);
					if(val.charAt(0) === '"') { val = val.slice(1,val.length - 1); cell_t = "s"; }
					else if(val === 'TRUE' || val === 'FALSE') { val = val === 'TRUE'; cell_t = "b"; }
					else if(!isNaN(fuzzynum(val))) {
						val = fuzzynum(val); cell_t = "n";
						if(next_cell_format !== null && fmt_is_date(next_cell_format) && opts.cellDates) { val = numdate(wb.Workbook.WBProps.date1904 ? val + 1462 : val); cell_t = "d"; }
					} else if(!isNaN(fuzzydate(val).getDate())) {
						val = parseDate(val); cell_t = "d";
						if(!opts.cellDates) { cell_t = "n"; val = datenum(val, wb.Workbook.WBProps.date1904); }
					}
					if(typeof $cptable !== 'undefined' && typeof val == "string" && ((opts||{}).type != "string") && (opts||{}).codepage) val = $cptable.utils.decode(opts.codepage, val);
					C_seen_K = true;
					break;
				case 'E':
					C_seen_E = true;
					formula = rc_to_a1(record[rj].slice(1), {r:R,c:C});
					break;
				case 'S':
					C_seen_S = true;
					break;
				case 'G': break; // unknown
				case 'R': _R = parseInt(record[rj].slice(1), 10)-1; break;
				case 'C': _C = parseInt(record[rj].slice(1), 10)-1; break;
				// case 'P': // ??
				// case 'D': // ??
				default: if(opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
			}
			if(C_seen_K) {
				if(!arr[R][C]) arr[R][C] = { t: cell_t, v: val };
				else { arr[R][C].t = cell_t; arr[R][C].v = val; }
				if(next_cell_format) arr[R][C].z = next_cell_format;
				if(opts.cellText !== false && next_cell_format) arr[R][C].w = SSF_format(arr[R][C].z, arr[R][C].v, { date1904: wb.Workbook.WBProps.date1904 });
				next_cell_format = null;
			}
			if(C_seen_S) {
				if(C_seen_E) throw new Error("SYLK shared formula cannot have own formula");
				var shrbase = _R > -1 && arr[_R][_C];
				if(!shrbase || !shrbase[1]) throw new Error("SYLK shared formula cannot find base");
				formula = shift_formula_str(shrbase[1], {r: R - _R, c: C - _C});
			}
			if(formula) {
				if(!arr[R][C]) arr[R][C] = { t: 'n', f: formula };
				else arr[R][C].f = formula;
			}
			break;
			case 'F': /* Format */
			var F_seen = 0;
			for(rj=1; rj<record.length; ++rj) switch(record[rj].charAt(0)) {
				case 'X': C = parseInt(record[rj].slice(1), 10)-1; ++F_seen; break;
				case 'Y':
					R = parseInt(record[rj].slice(1), 10)-1; /*C = 0;*/
					for(j = arr.length; j <= R; ++j) arr[j] = [];
					break;
				case 'M': Mval = parseInt(record[rj].slice(1), 10) / 20; break;
				case 'F': break; /* ??? */
				case 'G': break; /* hide grid */
				case 'P':
					next_cell_format = formats[parseInt(record[rj].slice(1), 10)];
					break;
				case 'S': break; /* cell style */
				case 'D': break; /* column */
				case 'N': break; /* font */
				case 'W':
					cw = record[rj].slice(1).split(" ");
					for(j = parseInt(cw[0], 10); j <= parseInt(cw[1], 10); ++j) {
						Mval = parseInt(cw[2], 10);
						colinfo[j-1] = Mval === 0 ? {hidden:true}: {wch:Mval};
					} break;
				case 'C': /* default column format */
					C = parseInt(record[rj].slice(1), 10)-1;
					if(!colinfo[C]) colinfo[C] = {};
					break;
				case 'R': /* row properties */
					R = parseInt(record[rj].slice(1), 10)-1;
					if(!rowinfo[R]) rowinfo[R] = {};
					if(Mval > 0) { rowinfo[R].hpt = Mval; rowinfo[R].hpx = pt2px(Mval); }
					else if(Mval === 0) rowinfo[R].hidden = true;
					break;
				// case 'K': // ??
				// case 'E': // ??
				default: if(opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
			}
			if(F_seen < 1) next_cell_format = null; break;
			default: if(opts && opts.WTF) throw new Error("SYLK bad record " + rstr);
			}
		}
		if(rowinfo.length > 0) sht['!rows'] = rowinfo;
		if(colinfo.length > 0) sht['!cols'] = colinfo;
		colinfo.forEach(function(col) { process_col(col); });
		if(opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
		return [arr, sht, wb];
	}

	function sylk_to_workbook(d/*:RawData*/, opts)/*:Workbook*/ {
		var aoasht = sylk_to_aoa(d, opts);
		var aoa = aoasht[0], ws = aoasht[1], wb = aoasht[2];
		var _opts = dup(opts); _opts.date1904 = (((wb||{}).Workbook || {}).WBProps || {}).date1904;
		var o = aoa_to_sheet(aoa, _opts);
		keys(ws).forEach(function(k) { o[k] = ws[k]; });
		var outwb = sheet_to_workbook(o, opts);
		keys(wb).forEach(function(k) { outwb[k] = wb[k]; });
		outwb.bookType = "sylk";
		return outwb;
	}

	function write_ws_cell_sylk(cell/*:Cell*/, ws/*:Worksheet*/, R/*:number*/, C/*:number*//*::, opts*/)/*:string*/ {
		var o = "C;Y" + (R+1) + ";X" + (C+1) + ";K";
		switch(cell.t) {
			case 'n':
				o += (cell.v||0);
				if(cell.f && !cell.F) o += ";E" + a1_to_rc(cell.f, {r:R, c:C}); break;
			case 'b': o += cell.v ? "TRUE" : "FALSE"; break;
			case 'e': o += cell.w || cell.v; break;
			case 'd': o += '"' + (cell.w || cell.v) + '"'; break;
			case 's': o += '"' + (cell.v == null ? "" : String(cell.v)).replace(/"/g,"").replace(/;/g, ";;") + '"'; break;
		}
		return o;
	}

	function write_ws_cols_sylk(out, cols) {
		cols.forEach(function(col, i) {
			var rec = "F;W" + (i+1) + " " + (i+1) + " ";
			if(col.hidden) rec += "0";
			else {
				if(typeof col.width == 'number' && !col.wpx) col.wpx = width2px(col.width);
				if(typeof col.wpx == 'number' && !col.wch) col.wch = px2char(col.wpx);
				if(typeof col.wch == 'number') rec += Math.round(col.wch);
			}
			if(rec.charAt(rec.length - 1) != " ") out.push(rec);
		});
	}

	function write_ws_rows_sylk(out/*:Array<string>*/, rows/*:Array<RowInfo>*/) {
		rows.forEach(function(row, i) {
			var rec = "F;";
			if(row.hidden) rec += "M0;";
			else if(row.hpt) rec += "M" + 20 * row.hpt + ";";
			else if(row.hpx) rec += "M" + 20 * px2pt(row.hpx) + ";";
			if(rec.length > 2) out.push(rec + "R" + (i+1));
		});
	}

	function sheet_to_sylk(ws/*:Worksheet*/, opts/*:?any*/, wb/*:?WorkBook*/)/*:string*/ {
		/* TODO: codepage */
		var preamble/*:Array<string>*/ = ["ID;PSheetJS;N;E"], o/*:Array<string>*/ = [];
		var r = safe_decode_range(ws['!ref']), cell/*:Cell*/;
		var dense = ws["!data"] != null;
		var RS = "\r\n";
		var d1904 = (((wb||{}).Workbook||{}).WBProps||{}).date1904;

		preamble.push("P;PGeneral");
		preamble.push("F;P0;DG0G8;M255");
		if(ws['!cols']) write_ws_cols_sylk(preamble, ws['!cols']);
		if(ws['!rows']) write_ws_rows_sylk(preamble, ws['!rows']);

		preamble.push("B;Y" + (r.e.r - r.s.r + 1) + ";X" + (r.e.c - r.s.c + 1) + ";D" + [r.s.c,r.s.r,r.e.c,r.e.r].join(" "));
		preamble.push("O;L;D;B" + (d1904 ? ";V4" : "") + ";K47;G100 0.001");
		for(var R = r.s.r; R <= r.e.r; ++R) {
			if(dense && !ws["!data"][R]) continue;
			var p = [];
			for(var C = r.s.c; C <= r.e.c; ++C) {
				cell = dense ? ws["!data"][R][C] : ws[encode_col(C) + encode_row(R)];
				if(!cell || (cell.v == null && (!cell.f || cell.F))) continue;
				p.push(write_ws_cell_sylk(cell, ws, R, C)); // TODO: pass date1904 info
			}
			o.push(p.join(RS));
		}
		return preamble.join(RS) + RS + o.join(RS) + RS + "E" + RS;
	}

	return {
		to_workbook: sylk_to_workbook,
		from_sheet: sheet_to_sylk
	};
})();

var DIF = /*#__PURE__*/(function() {
	function dif_to_aoa(d/*:RawData*/, opts)/*:AOA*/ {
		switch(opts.type) {
			case 'base64': return dif_to_aoa_str(Base64_decode(d), opts);
			case 'binary': return dif_to_aoa_str(d, opts);
			case 'buffer': return dif_to_aoa_str(has_buf && Buffer.isBuffer(d) ? d.toString('binary') : a2s(d), opts);
			case 'array': return dif_to_aoa_str(cc2str(d), opts);
		}
		throw new Error("Unrecognized type " + opts.type);
	}
	function dif_to_aoa_str(str/*:string*/, opts)/*:AOA*/ {
		var records = str.split('\n'), R = -1, C = -1, ri = 0, arr/*:AOA*/ = [];
		for (; ri !== records.length; ++ri) {
			if (records[ri].trim() === 'BOT') { arr[++R] = []; C = 0; continue; }
			if (R < 0) continue;
			var metadata = records[ri].trim().split(",");
			var type = metadata[0], value = metadata[1];
			++ri;
			var data = records[ri] || "";
			while(((data.match(/["]/g)||[]).length & 1) && ri < records.length - 1) data += "\n" + records[++ri];
			data = data.trim();
			switch (+type) {
				case -1:
					if (data === 'BOT') { arr[++R] = []; C = 0; continue; }
					else if (data !== 'EOD') throw new Error("Unrecognized DIF special command " + data);
					break;
				case 0:
					if(data === 'TRUE') arr[R][C] = true;
					else if(data === 'FALSE') arr[R][C] = false;
					else if(!isNaN(fuzzynum(value))) arr[R][C] = fuzzynum(value);
					else if(!isNaN(fuzzydate(value).getDate())) arr[R][C] = parseDate(value);
					else arr[R][C] = value;
					++C; break;
				case 1:
					data = data.slice(1,data.length-1);
					data = data.replace(/""/g, '"');
					if(data && data.match(/^=".*"$/)) data = data.slice(2, -1);
					arr[R][C++] = data !== '' ? data : null;
					break;
			}
			if (data === 'EOD') break;
		}
		if(opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
		return arr;
	}

	function dif_to_sheet(str/*:string*/, opts)/*:Worksheet*/ { return aoa_to_sheet(dif_to_aoa(str, opts), opts); }
	function dif_to_workbook(str/*:string*/, opts)/*:Workbook*/ {
		var o = sheet_to_workbook(dif_to_sheet(str, opts), opts);
		o.bookType = "dif";
		return o;
	}

	function make_value(v/*:number*/, s/*:string*/)/*:string*/ { return "0," + String(v) + "\r\n" + s; }
	function make_value_str(s/*:string*/)/*:string*/ { return "1,0\r\n\"" + s.replace(/"/g,'""') + '"'; }
	function sheet_to_dif(ws/*:Worksheet*//*::, opts:?any*/)/*:string*/ {
		var r = safe_decode_range(ws['!ref']);
		var dense = ws["!data"] != null;
		var o/*:Array<string>*/ = [
			"TABLE\r\n0,1\r\n\"sheetjs\"\r\n",
			"VECTORS\r\n0," + (r.e.r - r.s.r + 1) + "\r\n\"\"\r\n",
			"TUPLES\r\n0," + (r.e.c - r.s.c + 1) + "\r\n\"\"\r\n",
			"DATA\r\n0,0\r\n\"\"\r\n"
		];
		for(var R = r.s.r; R <= r.e.r; ++R) {
			var row = dense ? ws["!data"][R] : [];
			var p = "-1,0\r\nBOT\r\n";
			for(var C = r.s.c; C <= r.e.c; ++C) {
				var cell/*:Cell*/ = dense ? (row && row[C]) : ws[encode_cell({r:R,c:C})];
				if(cell == null) { p +=("1,0\r\n\"\"\r\n"); continue;}
				switch(cell.t) {
					case 'n':
						{
							if(cell.w != null) p +=("0," + cell.w + "\r\nV");
							else if(cell.v != null) p +=(make_value(cell.v, "V")); // TODO: should this call SSF_format?
							else if(cell.f != null && !cell.F) p +=(make_value_str("=" + cell.f));
							else p +=("1,0\r\n\"\"");
						}
						break;
					case 'b':
						p +=(cell.v ? make_value(1, "TRUE") : make_value(0, "FALSE"));
						break;
					case 's':
						p +=(make_value_str((isNaN(+cell.v)) ? cell.v : '="' + cell.v + '"'));
						break;
					case 'd':
						if(!cell.w) cell.w = SSF_format(cell.z || table_fmt[14], datenum(parseDate(cell.v)));
						p +=(make_value(cell.w, "V"));
						break;
					default: p +=("1,0\r\n\"\"");
				}
				p += "\r\n";
			}
			o.push(p);
		}
		return o.join("") + "-1,0\r\nEOD";
	}
	return {
		to_workbook: dif_to_workbook,
		to_sheet: dif_to_sheet,
		from_sheet: sheet_to_dif
	};
})();

var ETH = /*#__PURE__*/(function() {
	function decode(s/*:string*/)/*:string*/ { return s.replace(/\\b/g,"\\").replace(/\\c/g,":").replace(/\\n/g,"\n"); }
	function encode(s/*:string*/)/*:string*/ { return s.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g,"\\n"); }

	function eth_to_aoa(str/*:string*/, opts)/*:AOA*/ {
		var records = str.split('\n'), R = -1, C = -1, ri = 0, arr/*:AOA*/ = [];
		for (; ri !== records.length; ++ri) {
			var record = records[ri].trim().split(":");
			if(record[0] !== 'cell') continue;
			var addr = decode_cell(record[1]);
			if(arr.length <= addr.r) for(R = arr.length; R <= addr.r; ++R) if(!arr[R]) arr[R] = [];
			R = addr.r; C = addr.c;
			switch(record[2]) {
				case 't': arr[R][C] = decode(record[3]); break;
				case 'v': arr[R][C] = +record[3]; break;
				case 'vtf': var _f = record[record.length - 1];
					/* falls through */
				case 'vtc':
					switch(record[3]) {
						case 'nl': arr[R][C] = +record[4] ? true : false; break;
						default: arr[R][C] = +record[4]; break;
					}
					if(record[2] == 'vtf') arr[R][C] = [arr[R][C], _f];
			}
		}
		if(opts && opts.sheetRows) arr = arr.slice(0, opts.sheetRows);
		return arr;
	}

	function eth_to_sheet(d/*:string*/, opts)/*:Worksheet*/ { return aoa_to_sheet(eth_to_aoa(d, opts), opts); }
	function eth_to_workbook(d/*:string*/, opts)/*:Workbook*/ { return sheet_to_workbook(eth_to_sheet(d, opts), opts); }

	var header = [
		"socialcalc:version:1.5",
		"MIME-Version: 1.0",
		"Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"
	].join("\n");

	var sep = [
		"--SocialCalcSpreadsheetControlSave",
		"Content-type: text/plain; charset=UTF-8"
	].join("\n") + "\n";

	/* TODO: the other parts */
	var meta = [
		"# SocialCalc Spreadsheet Control Save",
		"part:sheet"
	].join("\n");

	var end = "--SocialCalcSpreadsheetControlSave--";

	function sheet_to_eth_data(ws/*:Worksheet*/)/*:string*/ {
		if(!ws || !ws['!ref']) return "";
		var o/*:Array<string>*/ = [], oo/*:Array<string>*/ = [], cell, coord = "";
		var r = decode_range(ws['!ref']);
		var dense = ws["!data"] != null;
		for(var R = r.s.r; R <= r.e.r; ++R) {
			for(var C = r.s.c; C <= r.e.c; ++C) {
				coord = encode_cell({r:R,c:C});
				cell = dense ? (ws["!data"][R]||[])[C] : ws[coord];
				if(!cell || cell.v == null || cell.t === 'z') continue;
				oo = ["cell", coord, 't'];
				switch(cell.t) {
					case 's': case 'str': oo.push(encode(cell.v)); break;
					case 'n':
						if(!cell.f) { oo[2]='v'; oo[3]=cell.v; }
						else { oo[2]='vtf'; oo[3]='n'; oo[4]=cell.v; oo[5]=encode(cell.f); }
						break;
					case 'b':
						oo[2] = 'vt'+(cell.f?'f':'c'); oo[3]='nl'; oo[4]=cell.v?"1":"0";
						oo[5] = encode(cell.f||(cell.v?'TRUE':'FALSE'));
						break;
					case 'd':
						var t = datenum(parseDate(cell.v));
						oo[2] = 'vtc'; oo[3] = 'nd'; oo[4] = ""+t;
						oo[5] = cell.w || SSF_format(cell.z || table_fmt[14], t);
						break;
					case 'e': continue;
				}
				o.push(oo.join(":"));
			}
		}
		o.push("sheet:c:" + (r.e.c-r.s.c+1) + ":r:" + (r.e.r-r.s.r+1) + ":tvf:1");
		o.push("valueformat:1:text-wiki");
		//o.push("copiedfrom:" + ws['!ref']); // clipboard only
		return o.join("\n");
	}

	function sheet_to_eth(ws/*:Worksheet*//*::, opts:?any*/)/*:string*/ {
		return [header, sep, meta, sep, sheet_to_eth_data(ws), end].join("\n");
		// return ["version:1.5", sheet_to_eth_data(ws)].join("\n"); // clipboard form
	}

	return {
		to_workbook: eth_to_workbook,
		to_sheet: eth_to_sheet,
		from_sheet: sheet_to_eth
	};
})();

var PRN = /*#__PURE__*/(function() {
	function set_text_arr(data/*:string*/, arr/*:AOA*/, R/*:number*/, C/*:number*/, o/*:any*/) {
		if(o.raw) arr[R][C] = data;
		else if(data === "");
		else if(data === 'TRUE') arr[R][C] = true;
		else if(data === 'FALSE') arr[R][C] = false;
		else if(!isNaN(fuzzynum(data))) arr[R][C] = fuzzynum(data);
		else if(!isNaN(fuzzydate(data).getDate())) arr[R][C] = parseDate(data);
		else arr[R][C] = data;
	}

	function prn_to_aoa_str(f/*:string*/, opts)/*:AOA*/ {
		var o = opts || {};
		var arr/*:AOA*/ = ([]/*:any*/);
		if(!f || f.length === 0) return arr;
		var lines = f.split(/[\r\n]/);
		var L = lines.length - 1;
		while(L >= 0 && lines[L].length === 0) --L;
		var start = 10, idx = 0;
		var R = 0;
		for(; R <= L; ++R) {
			idx = lines[R].indexOf(" ");
			if(idx == -1) idx = lines[R].length; else idx++;
			start = Math.max(start, idx);
		}
		for(R = 0; R <= L; ++R) {
			arr[R] = [];
			/* TODO: confirm that widths are always 10 */
			var C = 0;
			set_text_arr(lines[R].slice(0, start).trim(), arr, R, C, o);
			for(C = 1; C <= (lines[R].length - start)/10 + 1; ++C)
				set_text_arr(lines[R].slice(start+(C-1)*10,start+C*10).trim(),arr,R,C,o);
		}
		if(o.sheetRows) arr = arr.slice(0, o.sheetRows);
		return arr;
	}

	// List of accepted CSV separators
	var guess_seps = {
		/*::[*/0x2C/*::]*/: ',',
		/*::[*/0x09/*::]*/: "\t",
		/*::[*/0x3B/*::]*/: ';',
		/*::[*/0x7C/*::]*/: '|'
	};

	// CSV separator weights to be used in case of equal numbers
	var guess_sep_weights = {
		/*::[*/0x2C/*::]*/: 3,
		/*::[*/0x09/*::]*/: 2,
		/*::[*/0x3B/*::]*/: 1,
		/*::[*/0x7C/*::]*/: 0
	};

	function guess_sep(str) {
		var cnt = {}, instr = false, end = 0, cc = 0;
		for(;end < str.length;++end) {
			if((cc=str.charCodeAt(end)) == 0x22) instr = !instr;
			else if(!instr && cc in guess_seps) cnt[cc] = (cnt[cc]||0)+1;
		}

		cc = [];
		for(end in cnt) if ( Object.prototype.hasOwnProperty.call(cnt, end) ) {
			cc.push([ cnt[end], end ]);
		}

		if ( !cc.length ) {
			cnt = guess_sep_weights;
			for(end in cnt) if ( Object.prototype.hasOwnProperty.call(cnt, end) ) {
				cc.push([ cnt[end], end ]);
			}
		}

		cc.sort(function(a, b) { return a[0] - b[0] || guess_sep_weights[a[1]] - guess_sep_weights[b[1]]; });

		return guess_seps[cc.pop()[1]] || 0x2C;
	}

	function dsv_to_sheet_str(str/*:string*/, opts)/*:Worksheet*/ {
		var o = opts || {};
		var sep = "";
		var ws/*:Worksheet*/ = ({}/*:any*/);
		if(o.dense) ws["!data"] = [];
		var range/*:Range*/ = ({s: {c:0, r:0}, e: {c:0, r:0}}/*:any*/);

		if(str.slice(0,4) == "sep=") {
			// If the line ends in \r\n
			if(str.charCodeAt(5) == 13 && str.charCodeAt(6) == 10 ) {
				sep = str.charAt(4); str = str.slice(7);
			}
			// If line ends in \r OR \n
			else if(str.charCodeAt(5) == 13 || str.charCodeAt(5) == 10 ) {
				sep = str.charAt(4); str = str.slice(6);
			}
			else sep = guess_sep(str.slice(0,1024));
		}
		else if(o && o.FS) sep = o.FS;
		else sep = guess_sep(str.slice(0,1024));
		var R = 0, C = 0, v = 0;
		var start = 0, end = 0, sepcc = sep.charCodeAt(0), instr = false, cc=0, startcc=str.charCodeAt(0);
		var _re/*:?RegExp*/ = o.dateNF != null ? dateNF_regex(o.dateNF) : null;
		function finish_cell() {
			var s = str.slice(start, end); if(s.slice(-1) == "\r") s = s.slice(0, -1);
			var cell = ({}/*:any*/);
			if(s.charAt(0) == '"' && s.charAt(s.length - 1) == '"') s = s.slice(1,-1).replace(/""/g,'"');
			if(s.length === 0) cell.t = 'z';
			else if(o.raw) { cell.t = 's'; cell.v = s; }
			else if(s.trim().length === 0) { cell.t = 's'; cell.v = s; }
			else if(s.charCodeAt(0) == 0x3D) {
				if(s.charCodeAt(1) == 0x22 && s.charCodeAt(s.length - 1) == 0x22) { cell.t = 's'; cell.v = s.slice(2,-1).replace(/""/g,'"'); }
				else if(fuzzyfmla(s)) { cell.t = 'n'; cell.f = s.slice(1); }
				else { cell.t = 's'; cell.v = s; } }
			else if(s == "TRUE") { cell.t = 'b'; cell.v = true; }
			else if(s == "FALSE") { cell.t = 'b'; cell.v = false; }
			else if(!isNaN(v = fuzzynum(s))) { cell.t = 'n'; if(o.cellText !== false) cell.w = s; cell.v = v; }
			else if(!isNaN((v = fuzzydate(s)).getDate()) || _re && s.match(_re)) {
				cell.z = o.dateNF || table_fmt[14];
				var k = 0;
				if(_re && s.match(_re)){ s=dateNF_fix(s, o.dateNF, (s.match(_re)||[])); k=1; v = parseDate(s, k); }
				if(o.cellDates) { cell.t = 'd'; cell.v = v; }
				else { cell.t = 'n'; cell.v = datenum(v); }
				if(o.cellText !== false) cell.w = SSF_format(cell.z, cell.v instanceof Date ? datenum(cell.v):cell.v);
				if(!o.cellNF) delete cell.z;
			} else {
				cell.t = 's';
				cell.v = s;
			}
			if(cell.t == 'z');
			else if(o.dense) { if(!ws["!data"][R]) ws["!data"][R] = []; ws["!data"][R][C] = cell; }
			else ws[encode_cell({c:C,r:R})] = cell;
			start = end+1; startcc = str.charCodeAt(start);
			if(range.e.c < C) range.e.c = C;
			if(range.e.r < R) range.e.r = R;
			if(cc == sepcc) ++C; else { C = 0; ++R; if(o.sheetRows && o.sheetRows <= R) return true; }
		}
		outer: for(;end < str.length;++end) switch((cc=str.charCodeAt(end))) {
			case 0x22: if(startcc === 0x22) instr = !instr; break;
			case 0x0d:
				if(instr) break;
				if(str.charCodeAt(end+1) == 0x0a) ++end;
				/* falls through */
			case sepcc: case 0x0a: if(!instr && finish_cell()) break outer; break;
		}
		if(end - start > 0) finish_cell();

		ws['!ref'] = encode_range(range);
		return ws;
	}

	function prn_to_sheet_str(str/*:string*/, opts)/*:Worksheet*/ {
		if(!(opts && opts.PRN)) return dsv_to_sheet_str(str, opts);
		if(opts.FS) return dsv_to_sheet_str(str, opts);
		if(str.slice(0,4) == "sep=") return dsv_to_sheet_str(str, opts);
		if(str.indexOf("\t") >= 0 || str.indexOf(",") >= 0 || str.indexOf(";") >= 0) return dsv_to_sheet_str(str, opts);
		return aoa_to_sheet(prn_to_aoa_str(str, opts), opts);
	}

	function prn_to_sheet(d/*:RawData*/, opts)/*:Worksheet*/ {
		var str = "", bytes = opts.type == 'string' ? [0,0,0,0] : firstbyte(d, opts);
		switch(opts.type) {
			case 'base64': str = Base64_decode(d); break;
			case 'binary': str = d; break;
			case 'buffer':
				if(opts.codepage == 65001) str = d.toString('utf8'); // TODO: test if buf
				else if(opts.codepage && typeof $cptable !== 'undefined') str = $cptable.utils.decode(opts.codepage, d);
				else str = has_buf && Buffer.isBuffer(d) ? d.toString('binary') : a2s(d);
				break;
			case 'array': str = cc2str(d); break;
			case 'string': str = d; break;
			default: throw new Error("Unrecognized type " + opts.type);
		}
		if(bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF) str = utf8read(str.slice(3));
		else if(opts.type != 'string' && opts.type != 'buffer' && opts.codepage == 65001) str = utf8read(str);
		else if((opts.type == 'binary') && typeof $cptable !== 'undefined' && opts.codepage)  str = $cptable.utils.decode(opts.codepage, $cptable.utils.encode(28591,str));
		if(str.slice(0,19) == "socialcalc:version:") return ETH.to_sheet(opts.type == 'string' ? str : utf8read(str), opts);
		return prn_to_sheet_str(str, opts);
	}

	function prn_to_workbook(d/*:RawData*/, opts)/*:Workbook*/ { return sheet_to_workbook(prn_to_sheet(d, opts), opts); }

	function sheet_to_prn(ws/*:Worksheet*//*::, opts:?any*/)/*:string*/ {
		var o/*:Array<string>*/ = [];
		var r = safe_decode_range(ws['!ref']), cell/*:Cell*/;
		var dense = ws["!data"] != null;
		for(var R = r.s.r; R <= r.e.r; ++R) {
			var oo/*:Array<string>*/ = [];
			for(var C = r.s.c; C <= r.e.c; ++C) {
				var coord = encode_cell({r:R,c:C});
				cell = dense ? (ws["!data"][R]||[])[C] : ws[coord];
				if(!cell || cell.v == null) { oo.push("          "); continue; }
				var w = (cell.w || (format_cell(cell), cell.w) || "").slice(0,10);
				while(w.length < 10) w += " ";
				oo.push(w + (C === 0 ? " " : ""));
			}
			o.push(oo.join(""));
		}
		return o.join("\n");
	}

	return {
		to_workbook: prn_to_workbook,
		to_sheet: prn_to_sheet,
		from_sheet: sheet_to_prn
	};
})();

/* Excel defaults to SYLK but warns if data is not valid */
function read_wb_ID(d, opts) {
	var o = opts || {}, OLD_WTF = !!o.WTF; o.WTF = true;
	try {
		var out = SYLK.to_workbook(d, o);
		o.WTF = OLD_WTF;
		return out;
	} catch(e) {
		o.WTF = OLD_WTF;
		if(!e.message.match(/SYLK bad record ID/) && OLD_WTF) throw e;
		return PRN.to_workbook(d, opts);
	}
}

var WK_ = /*#__PURE__*/(function() {
	function lotushopper(data, cb/*:RecordHopperCB*/, opts/*:any*/) {
		if(!data) return;
		prep_blob(data, data.l || 0);
		var Enum = opts.Enum || WK1Enum;
		while(data.l < data.length) {
			var RT = data.read_shift(2);
			var R = Enum[RT] || Enum[0xFFFF];
			var length = data.read_shift(2);
			var tgt = data.l + length;
			var d = R.f && R.f(data, length, opts);
			data.l = tgt;
			if(cb(d, R, RT)) return;
		}
	}

	function lotus_to_workbook(d/*:RawData*/, opts) {
		switch(opts.type) {
			case 'base64': return lotus_to_workbook_buf(s2a(Base64_decode(d)), opts);
			case 'binary': return lotus_to_workbook_buf(s2a(d), opts);
			case 'buffer':
			case 'array': return lotus_to_workbook_buf(d, opts);
		}
		throw "Unsupported type " + opts.type;
	}

	function lotus_to_workbook_buf(d, opts)/*:Workbook*/ {
		if(!d) return d;
		var o = opts || {};
		var s/*:Worksheet*/ = ({}/*:any*/), n = "Sheet1", next_n = "", sidx = 0;
		var sheets = {}, snames = [], realnames = [], sdata = [];
		if(o.dense) sdata = s["!data"] = [];

		var refguess = {s: {r:0, c:0}, e: {r:0, c:0} };
		var sheetRows = o.sheetRows || 0;

		if(d[4] == 0x51 && d[5] == 0x50 && d[6] == 0x57) return qpw_to_workbook_buf(d, opts);
		if(d[2] == 0x00) {
			if(d[3] == 0x08 || d[3] == 0x09) {
				if(d.length >= 16 && d[14] == 0x05 && d[15] === 0x6c) throw new Error("Unsupported Works 3 for Mac file");
			}
		}

		if(d[2] == 0x02) {
			o.Enum = WK1Enum;
			lotushopper(d, function(val, R, RT) { switch(RT) {
				case 0x00: /* BOF */
					o.vers = val;
					if(val >= 0x1000) o.qpro = true;
					break;
				case 0xFF: /* BOF (works 3+) */
					o.vers = val;
					o.works = true;
					break;
				case 0x06: refguess = val; break; /* RANGE */
				case 0xCC: if(val) next_n = val; break; /* SHEETNAMECS */
				case 0xDE: next_n = val; break; /* SHEETNAMELP */
				case 0x0F: /* LABEL */
				case 0x33: /* STRING */
					if((!o.qpro && !o.works || RT == 0x33) && val[1].v.charCodeAt(0) < 0x30) val[1].v = val[1].v.slice(1);
					if(o.works || o.works2) val[1].v = val[1].v.replace(/\r\n/g, "\n");
					/* falls through */
				case 0x0D: /* INTEGER */
				case 0x0E: /* NUMBER */
				case 0x10: /* FORMULA */
					/* TODO: actual translation of the format code */
					if(RT == 0x0E && (val[2] & 0x70) == 0x70 && (val[2] & 0x0F) > 1 && (val[2] & 0x0F) < 15) {
						val[1].z = o.dateNF || table_fmt[14];
						if(o.cellDates) { val[1].t = 'd'; val[1].v = numdate(val[1].v); }
					}

					if(o.qpro) {
						if(val[3] > sidx) {
							s["!ref"] = encode_range(refguess);
							sheets[n] = s;
							snames.push(n);
							s = ({}/*:any*/); if(o.dense) sdata = s["!data"] = [];
							refguess = {s: {r:0, c:0}, e: {r:0, c:0} };
							sidx = val[3]; n = next_n || "Sheet" + (sidx + 1); next_n = "";
						}
					}

					var tmpcell = o.dense ? (sdata[val[0].r]||[])[val[0].c] : s[encode_cell(val[0])];
					if(tmpcell) {
						tmpcell.t = val[1].t; tmpcell.v = val[1].v;
						if(val[1].z != null) tmpcell.z = val[1].z;
						if(val[1].f != null) tmpcell.f = val[1].f;
						break;
					}
					if(o.dense) {
						if(!sdata[val[0].r]) sdata[val[0].r] = [];
						sdata[val[0].r][val[0].c] = val[1];
					} else s[encode_cell(val[0])] = val[1];
					break;
				case 0x5405: o.works2 = true; break;
			}}, o);
		} else if(d[2] == 0x1A || d[2] == 0x0E) {
			o.Enum = WK3Enum;
			if(d[2] == 0x0E) { o.qpro = true; d.l = 0; }
			lotushopper(d, function(val, R, RT) { switch(RT) {
				case 0xCC: n = val; break; /* SHEETNAMECS */
				case 0x16: /* LABEL16 */
					if(val[1].v.charCodeAt(0) < 0x30) val[1].v = val[1].v.slice(1);
					// TODO: R9 appears to encode control codes this way -- verify against other versions
					val[1].v = val[1].v.replace(/\x0F./g, function($$) { return String.fromCharCode($$.charCodeAt(1) - 0x20); }).replace(/\r\n/g, "\n");
					/* falls through */
				case 0x17: /* NUMBER17 */
				case 0x18: /* NUMBER18 */
				case 0x19: /* FORMULA19 */
				case 0x25: /* NUMBER25 */
				case 0x27: /* NUMBER27 */
				case 0x28: /* FORMULA28 */
					if(val[3] > sidx) {
						s["!ref"] = encode_range(refguess);
						sheets[n] = s;
						snames.push(n);
						s = ({}/*:any*/); if(o.dense) sdata = s["!data"] = [];
						refguess = {s: {r:0, c:0}, e: {r:0, c:0} };
						sidx = val[3]; n = "Sheet" + (sidx + 1);
					}
					if(sheetRows > 0 && val[0].r >= sheetRows) break;
					if(o.dense) {
						if(!sdata[val[0].r]) sdata[val[0].r] = [];
						sdata[val[0].r][val[0].c] = val[1];
					} else s[encode_cell(val[0])] = val[1];
					if(refguess.e.c < val[0].c) refguess.e.c = val[0].c;
					if(refguess.e.r < val[0].r) refguess.e.r = val[0].r;
					break;
				case 0x1B: /* XFORMAT */
					if(val[0x36b0]) realnames[val[0x36b0][0]] = val[0x36b0][1];
					break;
				case 0x0601: /* SHEETINFOQP */
					realnames[val[0]] = val[1]; if(val[0] == sidx) n = val[1]; break;
			}}, o);
		} else throw new Error("Unrecognized LOTUS BOF " + d[2]);
		s["!ref"] = encode_range(refguess);
		sheets[next_n || n] = s;
		snames.push(next_n || n);
		if(!realnames.length) return { SheetNames: snames, Sheets: sheets };
		var osheets = {}, rnames = [];
		/* TODO: verify no collisions */
		for(var i = 0; i < realnames.length; ++i) if(sheets[snames[i]]) {
			rnames.push(realnames[i] || snames[i]);
			osheets[realnames[i]] = sheets[realnames[i]] || sheets[snames[i]];
		} else {
			rnames.push(realnames[i]);
			osheets[realnames[i]] = ({ "!ref": "A1" });
		}
		return { SheetNames: rnames, Sheets: osheets };
	}

	function sheet_to_wk1(ws/*:Worksheet*/, opts/*:WriteOpts*/) {
		var o = opts || {};
		if(+o.codepage >= 0) set_cp(+o.codepage);
		if(o.type == "string") throw new Error("Cannot write WK1 to JS string");
		var ba = buf_array();
		var range = safe_decode_range(ws["!ref"]);
		var dense = ws["!data"] != null;
		var cols = [];

		write_biff_rec(ba, 0x00, write_BOF_WK1(0x0406));
		write_biff_rec(ba, 0x06, write_RANGE(range));
		var max_R = Math.min(range.e.r, 8191);
		for(var C = range.s.c; C <= range.e.c; ++C) cols[C] = encode_col(C);
		for(var R = range.s.r; R <= max_R; ++R) {
			var rr = encode_row(R);
			for(C = range.s.c; C <= range.e.c; ++C) {
				var cell = dense ? (ws["!data"][R]||[])[C] : ws[cols[C] + rr];
				if(!cell || cell.t == "z") continue;
				/* TODO: formula records */
				if(cell.t == "n") {
					if((cell.v|0)==cell.v && cell.v >= -32768 && cell.v <= 32767) write_biff_rec(ba, 0x0d, write_INTEGER(R, C, cell.v));
					else write_biff_rec(ba, 0x0e, write_NUMBER(R, C, cell.v));
				} else {
					var str = format_cell(cell);
					write_biff_rec(ba, 0x0F, write_LABEL(R, C, str.slice(0, 239)));
				}
			}
		}

		write_biff_rec(ba, 0x01);
		return ba.end();
	}

	function book_to_wk3(wb/*:Workbook*/, opts/*:WriteOpts*/) {
		var o = opts || {};
		if(+o.codepage >= 0) set_cp(+o.codepage);
		if(o.type == "string") throw new Error("Cannot write WK3 to JS string");
		var ba = buf_array();

		write_biff_rec(ba, 0x00, write_BOF_WK3(wb));

		for(var i = 0, cnt = 0; i < wb.SheetNames.length; ++i) if((wb.Sheets[wb.SheetNames[i]] || {})["!ref"]) write_biff_rec(ba, 0x1b, write_XFORMAT_SHEETNAME(wb.SheetNames[i], cnt++));

		var wsidx = 0;
		for(i = 0; i < wb.SheetNames.length; ++i) {
			var ws = wb.Sheets[wb.SheetNames[i]];
			if(!ws || !ws["!ref"]) continue;
			var range = safe_decode_range(ws["!ref"]);
			var dense = ws["!data"] != null;
			var cols = [];
			var max_R = Math.min(range.e.r, 8191);
			for(var R = range.s.r; R <= max_R; ++R) {
				var rr = encode_row(R);
				for(var C = range.s.c; C <= range.e.c; ++C) {
					if(R === range.s.r) cols[C] = encode_col(C);
					var ref = cols[C] + rr;
					var cell = dense ? (ws["!data"][R]||[])[C] : ws[ref];
					if(!cell || cell.t == "z") continue;
					/* TODO: FORMULA19 NUMBER18 records */
					if(cell.t == "n") {
						write_biff_rec(ba, 0x17, write_NUMBER_17(R, C, wsidx, cell.v));
					} else {
						var str = format_cell(cell);
						/* TODO: max len? */
						write_biff_rec(ba, 0x16, write_LABEL_16(R, C, wsidx, str.slice(0, 239)));
					}
				}
			}
			++wsidx;
		}

		write_biff_rec(ba, 0x01);
		return ba.end();
	}


	function write_BOF_WK1(v/*:number*/) {
		var out = new_buf(2);
		out.write_shift(2, v);
		return out;
	}

	function write_BOF_WK3(wb/*:Workbook*/) {
		var out = new_buf(26);
		out.write_shift(2, 0x1000);
		out.write_shift(2, 0x0004);
		out.write_shift(4, 0x0000);
		var rows = 0, cols = 0, wscnt = 0;
		for(var i = 0; i < wb.SheetNames.length; ++i) {
			var name = wb.SheetNames[i];
			var ws = wb.Sheets[name];
			if(!ws || !ws["!ref"]) continue;
			++wscnt;
			var range = decode_range(ws["!ref"]);
			if(rows < range.e.r) rows = range.e.r;
			if(cols < range.e.c) cols = range.e.c;
		}
		if(rows > 8191) rows = 8191;
		out.write_shift(2, rows);
		out.write_shift(1, wscnt);
		out.write_shift(1, cols);
		out.write_shift(2, 0x00);
		out.write_shift(2, 0x00);
		out.write_shift(1, 0x01);
		out.write_shift(1, 0x02);
		out.write_shift(4, 0);
		out.write_shift(4, 0);
		return out;
	}

	function parse_RANGE(blob, length, opts) {
		var o = {s:{c:0,r:0},e:{c:0,r:0}};
		if(length == 8 && opts.qpro) {
			o.s.c = blob.read_shift(1);
			blob.l++;
			o.s.r = blob.read_shift(2);
			o.e.c = blob.read_shift(1);
			blob.l++;
			o.e.r = blob.read_shift(2);
			return o;
		}
		o.s.c = blob.read_shift(2);
		o.s.r = blob.read_shift(2);
		if(length == 12 && opts.qpro) blob.l += 2;
		o.e.c = blob.read_shift(2);
		o.e.r = blob.read_shift(2);
		if(length == 12 && opts.qpro) blob.l += 2;
		if(o.s.c == 0xFFFF) o.s.c = o.e.c = o.s.r = o.e.r = 0;
		return o;
	}
	function write_RANGE(range) {
		var out = new_buf(8);
		out.write_shift(2, range.s.c);
		out.write_shift(2, range.s.r);
		out.write_shift(2, range.e.c);
		out.write_shift(2, range.e.r);
		return out;
	}

	function parse_cell(blob, length, opts) {
		var o = [{c:0,r:0}, {t:'n',v:0}, 0, 0];
		if(opts.qpro && opts.vers != 0x5120) {
			o[0].c = blob.read_shift(1);
			o[3] = blob.read_shift(1);
			o[0].r = blob.read_shift(2);
			blob.l+=2;
		} else if(opts.works) { // TODO: verify with more complex works3-4 examples
			o[0].c = blob.read_shift(2); o[0].r = blob.read_shift(2);
			o[2] = blob.read_shift(2);
		} else {
			o[2] = blob.read_shift(1);
			o[0].c = blob.read_shift(2); o[0].r = blob.read_shift(2);
		}
		return o;
	}

	function parse_LABEL(blob, length, opts) {
		var tgt = blob.l + length;
		var o = parse_cell(blob, length, opts);
		o[1].t = 's';
		if(opts.vers == 0x5120) {
			blob.l++;
			var len = blob.read_shift(1);
			o[1].v = blob.read_shift(len, 'utf8');
			return o;
		}
		if(opts.qpro) blob.l++;
		o[1].v = blob.read_shift(tgt - blob.l, 'cstr');
		return o;
	}
	function write_LABEL(R, C, s) {
		/* TODO: encoding */
		var o = new_buf(7 + s.length);
		o.write_shift(1, 0xFF);
		o.write_shift(2, C);
		o.write_shift(2, R);
		o.write_shift(1, 0x27); // ??
		for(var i = 0; i < o.length; ++i) {
			var cc = s.charCodeAt(i);
			o.write_shift(1, cc >= 0x80 ? 0x5F : cc);
		}
		o.write_shift(1, 0);
		return o;
	}
	function parse_STRING(blob, length, opts) {
		var tgt = blob.l + length;
		var o = parse_cell(blob, length, opts);
		o[1].t = 's';
		if(opts.vers == 0x5120) {
			var len = blob.read_shift(1);
			o[1].v = blob.read_shift(len, 'utf8');
			return o;
		}
		o[1].v = blob.read_shift(tgt - blob.l, 'cstr');
		return o;
	}

	function parse_INTEGER(blob, length, opts) {
		var o = parse_cell(blob, length, opts);
		o[1].v = blob.read_shift(2, 'i');
		return o;
	}
	function write_INTEGER(R, C, v) {
		var o = new_buf(7);
		o.write_shift(1, 0xFF);
		o.write_shift(2, C);
		o.write_shift(2, R);
		o.write_shift(2, v, 'i');
		return o;
	}

	function parse_NUMBER(blob, length, opts) {
		var o = parse_cell(blob, length, opts);
		o[1].v = blob.read_shift(8, 'f');
		return o;
	}
	function write_NUMBER(R, C, v) {
		var o = new_buf(13);
		o.write_shift(1, 0xFF);
		o.write_shift(2, C);
		o.write_shift(2, R);
		o.write_shift(8, v, 'f');
		return o;
	}

	function parse_FORMULA(blob, length, opts) {
		var tgt = blob.l + length;
		var o = parse_cell(blob, length, opts);
		/* TODO: formula */
		o[1].v = blob.read_shift(8, 'f');
		if(opts.qpro) blob.l = tgt;
		else {
			var flen = blob.read_shift(2);
			wk1_fmla_to_csf(blob.slice(blob.l, blob.l + flen), o);
			blob.l += flen;
		}
		return o;
	}

	function wk1_parse_rc(B, V, col) {
		var rel = V & 0x8000;
		V &= ~0x8000;
		V = (rel ? B : 0) + ((V >= 0x2000) ? V - 0x4000 : V);
		return (rel ? "" : "$") + (col ? encode_col(V) : encode_row(V));
	}
	/* var oprec = [
		8, 8, 8, 8, 8, 8, 8, 8, 6, 4, 4, 5, 5, 7, 3, 3,
		3, 3, 3, 3, 1, 1, 2, 6, 8, 8, 8, 8, 8, 8, 8, 8
	]; */
	/* TODO: flesh out */
	var FuncTab = {
		0x1F: ["NA", 0],
		// 0x20: ["ERR", 0],
		0x21: ["ABS", 1],
		0x22: ["TRUNC", 1],
		0x23: ["SQRT", 1],
		0x24: ["LOG", 1],
		0x25: ["LN", 1],
		0x26: ["PI", 0],
		0x27: ["SIN", 1],
		0x28: ["COS", 1],
		0x29: ["TAN", 1],
		0x2A: ["ATAN2", 2],
		0x2B: ["ATAN", 1],
		0x2C: ["ASIN", 1],
		0x2D: ["ACOS", 1],
		0x2E: ["EXP", 1],
		0x2F: ["MOD", 2],
		// 0x30
		0x31: ["ISNA", 1],
		0x32: ["ISERR", 1],
		0x33: ["FALSE", 0],
		0x34: ["TRUE", 0],
		0x35: ["RAND", 0],
		// 0x36 DATE
		// 0x37 NOW
		// 0x38 PMT
		// 0x39 PV
		// 0x3A FV
		// 0x3B IF
		// 0x3C DAY
		// 0x3D MONTH
		// 0x3E YEAR
		0x3F: ["ROUND", 2],
		// 0x40 TIME
		// 0x41 HOUR
		// 0x42 MINUTE
		// 0x43 SECOND
		0x44: ["ISNUMBER", 1],
		0x45: ["ISTEXT", 1],
		0x46: ["LEN", 1],
		0x47: ["VALUE", 1],
		// 0x48: ["FIXED", ?? 1],
		0x49: ["MID", 3],
		0x4A: ["CHAR", 1],
		// 0x4B
		// 0x4C FIND
		// 0x4D DATEVALUE
		// 0x4E TIMEVALUE
		// 0x4F CELL
		0x50: ["SUM", 69],
		0x51: ["AVERAGEA", 69],
		0x52: ["COUNTA", 69],
		0x53: ["MINA", 69],
		0x54: ["MAXA", 69],
		// 0x55 VLOOKUP
		// 0x56 NPV
		// 0x57 VAR
		// 0x58 STD
		// 0x59 IRR
		// 0x5A HLOOKUP
		// 0x5B DSUM
		// 0x5C DAVERAGE
		// 0x5D DCOUNTA
		// 0x5E DMIN
		// 0x5F DMAX
		// 0x60 DVARP
		// 0x61 DSTDEVP
		// 0x62 INDEX
		// 0x63 COLS
		// 0x64 ROWS
		// 0x65 REPEAT
		0x66: ["UPPER", 1],
		0x67: ["LOWER", 1],
		// 0x68 LEFT
		// 0x69 RIGHT
		// 0x6A REPLACE
		0x6B: ["PROPER", 1],
		// 0x6C CELL
		0x6D: ["TRIM", 1],
		// 0x6E CLEAN
		0x6F: ["T", 1]
		// 0x70 V
	};
	var BinOpTab = [
		  "",   "",   "",   "",   "",   "",   "",   "", // eslint-disable-line no-mixed-spaces-and-tabs
		  "",  "+",  "-",  "*",  "/",  "^",  "=", "<>", // eslint-disable-line no-mixed-spaces-and-tabs
		"<=", ">=",  "<",  ">",   "",   "",   "",   "", // eslint-disable-line no-mixed-spaces-and-tabs
		 "&",   "",   "",   "",   "",   "",   "",   ""  // eslint-disable-line no-mixed-spaces-and-tabs
	];

	function wk1_fmla_to_csf(blob, o) {
		prep_blob(blob, 0);
		var out = [], argc = 0, R = "", C = "", argL = "", argR = "";
		while(blob.l < blob.length) {
			var cc = blob[blob.l++];
			switch(cc) {
				case 0x00: out.push(blob.read_shift(8, 'f')); break;
				case 0x01: {
					C = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
					R = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
					out.push(C + R);
				} break;
				case 0x02: {
					var c = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
					var r = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
					C = wk1_parse_rc(o[0].c, blob.read_shift(2), true);
					R = wk1_parse_rc(o[0].r, blob.read_shift(2), false);
					out.push(c + r + ":" + C + R);
				} break;
				case 0x03:
					if(blob.l < blob.length) { console.error("WK1 premature formula end"); return; }
					break;
				case 0x04: out.push("(" + out.pop() + ")"); break;
				case 0x05: out.push(blob.read_shift(2)); break;
				case 0x06: {
					/* TODO: text encoding */
					var Z = ""; while((cc = blob[blob.l++])) Z += String.fromCharCode(cc);
					out.push('"' + Z.replace(/"/g, '""') + '"');
				} break;

				case 0x08: out.push("-" + out.pop()); break;
				case 0x17: out.push("+" + out.pop()); break;
				case 0x16: out.push("NOT(" + out.pop() + ")"); break;

				case 0x14: case 0x15: {
					argR = out.pop(); argL = out.pop();
					out.push(["AND", "OR"][cc - 0x14] + "(" + argL + "," + argR + ")");
				} break;

				default:
					if(cc < 0x20 && BinOpTab[cc]) {
						argR = out.pop(); argL = out.pop();
						out.push(argL + BinOpTab[cc] + argR);
					} else if(FuncTab[cc]) {
						argc = FuncTab[cc][1];
						if(argc == 69) argc = blob[blob.l++];
						if(argc > out.length) { console.error("WK1 bad formula parse 0x" + cc.toString(16) + ":|" + out.join("|") + "|"); return; }
						var args = out.slice(-argc);
						out.length -= argc;
						out.push(FuncTab[cc][0] + "(" + args.join(",") + ")");
					}
					else if(cc <= 0x07) return console.error("WK1 invalid opcode " + cc.toString(16));
					else if(cc <= 0x18) return console.error("WK1 unsupported op " + cc.toString(16));
					else if(cc <= 0x1E) return console.error("WK1 invalid opcode " + cc.toString(16));
					else if(cc <= 0x73) return console.error("WK1 unsupported function opcode " + cc.toString(16));
					// possible future functions ??
					else return console.error("WK1 unrecognized opcode " + cc.toString(16));
			}
		}
		if(out.length == 1) o[1].f = "" + out[0];
		else console.error("WK1 bad formula parse |" + out.join("|") + "|");
	}


	function parse_cell_3(blob/*::, length*/) {
		var o = [{c:0,r:0}, {t:'n',v:0}, 0];
		o[0].r = blob.read_shift(2); o[3] = blob[blob.l++]; o[0].c = blob[blob.l++];
		return o;
	}

	function parse_LABEL_16(blob, length) {
		var o = parse_cell_3(blob);
		o[1].t = 's';
		o[1].v = blob.read_shift(length - 4, 'cstr');
		return o;
	}
	function write_LABEL_16(R, C, wsidx, s) {
		/* TODO: encoding */
		var o = new_buf(6 + s.length);
		o.write_shift(2, R);
		o.write_shift(1, wsidx);
		o.write_shift(1, C);
		o.write_shift(1, 0x27);
		for(var i = 0; i < s.length; ++i) {
			var cc = s.charCodeAt(i);
			o.write_shift(1, cc >= 0x80 ? 0x5F : cc);
		}
		o.write_shift(1, 0);
		return o;
	}

	function parse_NUMBER_18(blob, length) {
		var o = parse_cell_3(blob);
		o[1].v = blob.read_shift(2);
		var v = o[1].v >> 1;
		if(o[1].v & 0x1) {
			switch(v & 0x07) {
				case 0: v = (v >> 3) * 5000; break;
				case 1: v = (v >> 3) * 500; break;
				case 2: v = (v >> 3) / 20; break;
				case 3: v = (v >> 3) / 200; break;
				case 4: v = (v >> 3) / 2000; break;
				case 5: v = (v >> 3) / 20000; break;
				case 6: v = (v >> 3) / 16; break;
				case 7: v = (v >> 3) / 64; break;
			}
		}
		o[1].v = v;
		return o;
	}

	function parse_NUMBER_17(blob, length) {
		var o = parse_cell_3(blob);
		var v1 = blob.read_shift(4);
		var v2 = blob.read_shift(4);
		var e = blob.read_shift(2);
		if(e == 0xFFFF) {
			if(v1 === 0 && v2 === 0xC0000000) { o[1].t = "e"; o[1].v = 0x0F; } // ERR -> #VALUE!
			else if(v1 === 0 && v2 === 0xD0000000) { o[1].t = "e"; o[1].v = 0x2A; } // NA -> #N/A
			else o[1].v = 0;
			return o;
		}
		var s = e & 0x8000; e = (e&0x7FFF) - 16446;
		o[1].v = (1 - s*2) * (v2 * Math.pow(2, e+32) + v1 * Math.pow(2, e));
		return o;
	}
	function write_NUMBER_17(R, C, wsidx, v) {
		var o = new_buf(14);
		o.write_shift(2, R);
		o.write_shift(1, wsidx);
		o.write_shift(1, C);
		if(v == 0) {
			o.write_shift(4, 0);
			o.write_shift(4, 0);
			o.write_shift(2, 0xFFFF);
			return o;
		}
		var s = 0, e = 0, v1 = 0, v2 = 0;
		if(v < 0) { s = 1; v = -v; }
		e = Math.log2(v) | 0;
		v /= Math.pow(2, e-31);
		v2 = (v)>>>0;
		if((v2&0x80000000) == 0) { v/=2; ++e; v2 = v >>> 0; }
		v -= v2;
		v2 |= 0x80000000;
		v2 >>>= 0;
		v *= Math.pow(2, 32);
		v1 = v>>>0;
		o.write_shift(4, v1);
		o.write_shift(4, v2);
		e += 0x3FFF + (s ? 0x8000 : 0);
		o.write_shift(2, e);
		return o;
	}

	function parse_FORMULA_19(blob, length) {
		var o = parse_NUMBER_17(blob);
		blob.l += length - 14; /* TODO: WK3 formula */
		return o;
	}

	function parse_NUMBER_25(blob, length) {
		var o = parse_cell_3(blob);
		var v1 = blob.read_shift(4);
		o[1].v = v1 >> 6;
		return o;
	}

	function parse_NUMBER_27(blob, length) {
		var o = parse_cell_3(blob);
		var v1 = blob.read_shift(8,'f');
		o[1].v = v1;
		return o;
	}

	function parse_FORMULA_28(blob, length) {
		var o = parse_NUMBER_27(blob);
		blob.l += length - 12; /* TODO: formula */
		return o;
	}

	function parse_SHEETNAMECS(blob, length) {
		return blob[blob.l + length - 1] == 0 ? blob.read_shift(length, 'cstr') : "";
	}

	function parse_SHEETNAMELP(blob, length) {
		var len = blob[blob.l++];
		if(len > length - 1) len = length - 1;
		var o = ""; while(o.length < len) o += String.fromCharCode(blob[blob.l++]);
		return o;
	}

	function parse_SHEETINFOQP(blob, length, opts) {
		if(!opts.qpro || length < 21) return;
		var id = blob.read_shift(1);
		blob.l += 17;
		blob.l += 1; //var len = blob.read_shift(1);
		blob.l += 2;
		var nm = blob.read_shift(length - 21, 'cstr');
		return [id, nm];
	}

	function parse_XFORMAT(blob, length) {
		var o = {}, tgt = blob.l + length;
		while(blob.l < tgt) {
			var dt = blob.read_shift(2);
			if(dt == 0x36b0) {
				o[dt] = [0, ""];
				o[dt][0] = blob.read_shift(2);
				while(blob[blob.l]) { o[dt][1] += String.fromCharCode(blob[blob.l]); blob.l++; } blob.l++;
			}
			// TODO: 0x3a99 ??
		}
		return o;
	}
	function write_XFORMAT_SHEETNAME(name, wsidx) {
		var out = new_buf(5 + name.length);
		out.write_shift(2, 0x36b0);
		out.write_shift(2, wsidx);
		for(var i = 0; i < name.length; ++i) {
			var cc = name.charCodeAt(i);
			out[out.l++] = cc > 0x7F ? 0x5F : cc;
		}
		out[out.l++] = 0;
		return out;
	}

	var WK1Enum = {
		/*::[*/0x0000/*::]*/: { n:"BOF", f:parseuint16 },
		/*::[*/0x0001/*::]*/: { n:"EOF" },
		/*::[*/0x0002/*::]*/: { n:"CALCMODE" },
		/*::[*/0x0003/*::]*/: { n:"CALCORDER" },
		/*::[*/0x0004/*::]*/: { n:"SPLIT" },
		/*::[*/0x0005/*::]*/: { n:"SYNC" },
		/*::[*/0x0006/*::]*/: { n:"RANGE", f:parse_RANGE },
		/*::[*/0x0007/*::]*/: { n:"WINDOW1" },
		/*::[*/0x0008/*::]*/: { n:"COLW1" },
		/*::[*/0x0009/*::]*/: { n:"WINTWO" },
		/*::[*/0x000A/*::]*/: { n:"COLW2" },
		/*::[*/0x000B/*::]*/: { n:"NAME" },
		/*::[*/0x000C/*::]*/: { n:"BLANK" },
		/*::[*/0x000D/*::]*/: { n:"INTEGER", f:parse_INTEGER },
		/*::[*/0x000E/*::]*/: { n:"NUMBER", f:parse_NUMBER },
		/*::[*/0x000F/*::]*/: { n:"LABEL", f:parse_LABEL },
		/*::[*/0x0010/*::]*/: { n:"FORMULA", f:parse_FORMULA },
		/*::[*/0x0018/*::]*/: { n:"TABLE" },
		/*::[*/0x0019/*::]*/: { n:"ORANGE" },
		/*::[*/0x001A/*::]*/: { n:"PRANGE" },
		/*::[*/0x001B/*::]*/: { n:"SRANGE" },
		/*::[*/0x001C/*::]*/: { n:"FRANGE" },
		/*::[*/0x001D/*::]*/: { n:"KRANGE1" },
		/*::[*/0x0020/*::]*/: { n:"HRANGE" },
		/*::[*/0x0023/*::]*/: { n:"KRANGE2" },
		/*::[*/0x0024/*::]*/: { n:"PROTEC" },
		/*::[*/0x0025/*::]*/: { n:"FOOTER" },
		/*::[*/0x0026/*::]*/: { n:"HEADER" },
		/*::[*/0x0027/*::]*/: { n:"SETUP" },
		/*::[*/0x0028/*::]*/: { n:"MARGINS" },
		/*::[*/0x0029/*::]*/: { n:"LABELFMT" },
		/*::[*/0x002A/*::]*/: { n:"TITLES" },
		/*::[*/0x002B/*::]*/: { n:"SHEETJS" },
		/*::[*/0x002D/*::]*/: { n:"GRAPH" },
		/*::[*/0x002E/*::]*/: { n:"NGRAPH" },
		/*::[*/0x002F/*::]*/: { n:"CALCCOUNT" },
		/*::[*/0x0030/*::]*/: { n:"UNFORMATTED" },
		/*::[*/0x0031/*::]*/: { n:"CURSORW12" },
		/*::[*/0x0032/*::]*/: { n:"WINDOW" },
		/*::[*/0x0033/*::]*/: { n:"STRING", f:parse_STRING },
		/*::[*/0x0037/*::]*/: { n:"PASSWORD" },
		/*::[*/0x0038/*::]*/: { n:"LOCKED" },
		/*::[*/0x003C/*::]*/: { n:"QUERY" },
		/*::[*/0x003D/*::]*/: { n:"QUERYNAME" },
		/*::[*/0x003E/*::]*/: { n:"PRINT" },
		/*::[*/0x003F/*::]*/: { n:"PRINTNAME" },
		/*::[*/0x0040/*::]*/: { n:"GRAPH2" },
		/*::[*/0x0041/*::]*/: { n:"GRAPHNAME" },
		/*::[*/0x0042/*::]*/: { n:"ZOOM" },
		/*::[*/0x0043/*::]*/: { n:"SYMSPLIT" },
		/*::[*/0x0044/*::]*/: { n:"NSROWS" },
		/*::[*/0x0045/*::]*/: { n:"NSCOLS" },
		/*::[*/0x0046/*::]*/: { n:"RULER" },
		/*::[*/0x0047/*::]*/: { n:"NNAME" },
		/*::[*/0x0048/*::]*/: { n:"ACOMM" },
		/*::[*/0x0049/*::]*/: { n:"AMACRO" },
		/*::[*/0x004A/*::]*/: { n:"PARSE" },
		/*::[*/0x0066/*::]*/: { n:"PRANGES??" },
		/*::[*/0x0067/*::]*/: { n:"RRANGES??" },
		/*::[*/0x0068/*::]*/: { n:"FNAME??" },
		/*::[*/0x0069/*::]*/: { n:"MRANGES??" },
		/*::[*/0x00CC/*::]*/: { n:"SHEETNAMECS", f:parse_SHEETNAMECS },
		/*::[*/0x00DE/*::]*/: { n:"SHEETNAMELP", f:parse_SHEETNAMELP },
		/*::[*/0x00FF/*::]*/: { n:"BOF", f:parseuint16 },
		/*::[*/0xFFFF/*::]*/: { n:"" }
	};

	var WK3Enum = {
		/*::[*/0x0000/*::]*/: { n:"BOF" },
		/*::[*/0x0001/*::]*/: { n:"EOF" },
		/*::[*/0x0002/*::]*/: { n:"PASSWORD" },
		/*::[*/0x0003/*::]*/: { n:"CALCSET" },
		/*::[*/0x0004/*::]*/: { n:"WINDOWSET" },
		/*::[*/0x0005/*::]*/: { n:"SHEETCELLPTR" },
		/*::[*/0x0006/*::]*/: { n:"SHEETLAYOUT" },
		/*::[*/0x0007/*::]*/: { n:"COLUMNWIDTH" },
		/*::[*/0x0008/*::]*/: { n:"HIDDENCOLUMN" },
		/*::[*/0x0009/*::]*/: { n:"USERRANGE" },
		/*::[*/0x000A/*::]*/: { n:"SYSTEMRANGE" },
		/*::[*/0x000B/*::]*/: { n:"ZEROFORCE" },
		/*::[*/0x000C/*::]*/: { n:"SORTKEYDIR" },
		/*::[*/0x000D/*::]*/: { n:"FILESEAL" },
		/*::[*/0x000E/*::]*/: { n:"DATAFILLNUMS" },
		/*::[*/0x000F/*::]*/: { n:"PRINTMAIN" },
		/*::[*/0x0010/*::]*/: { n:"PRINTSTRING" },
		/*::[*/0x0011/*::]*/: { n:"GRAPHMAIN" },
		/*::[*/0x0012/*::]*/: { n:"GRAPHSTRING" },
		/*::[*/0x0013/*::]*/: { n:"??" },
		/*::[*/0x0014/*::]*/: { n:"ERRCELL" },
		/*::[*/0x0015/*::]*/: { n:"NACELL" },
		/*::[*/0x0016/*::]*/: { n:"LABEL16", f:parse_LABEL_16},
		/*::[*/0x0017/*::]*/: { n:"NUMBER17", f:parse_NUMBER_17 },
		/*::[*/0x0018/*::]*/: { n:"NUMBER18", f:parse_NUMBER_18 },
		/*::[*/0x0019/*::]*/: { n:"FORMULA19", f:parse_FORMULA_19},
		/*::[*/0x001A/*::]*/: { n:"FORMULA1A" },
		/*::[*/0x001B/*::]*/: { n:"XFORMAT", f:parse_XFORMAT },
		/*::[*/0x001C/*::]*/: { n:"DTLABELMISC" },
		/*::[*/0x001D/*::]*/: { n:"DTLABELCELL" },
		/*::[*/0x001E/*::]*/: { n:"GRAPHWINDOW" },
		/*::[*/0x001F/*::]*/: { n:"CPA" },
		/*::[*/0x0020/*::]*/: { n:"LPLAUTO" },
		/*::[*/0x0021/*::]*/: { n:"QUERY" },
		/*::[*/0x0022/*::]*/: { n:"HIDDENSHEET" },
		/*::[*/0x0023/*::]*/: { n:"??" },
		/*::[*/0x0025/*::]*/: { n:"NUMBER25", f:parse_NUMBER_25 },
		/*::[*/0x0026/*::]*/: { n:"??" },
		/*::[*/0x0027/*::]*/: { n:"NUMBER27", f:parse_NUMBER_27 },
		/*::[*/0x0028/*::]*/: { n:"FORMULA28", f:parse_FORMULA_28 },
		/*::[*/0x008E/*::]*/: { n:"??" },
		/*::[*/0x0093/*::]*/: { n:"??" },
		/*::[*/0x0096/*::]*/: { n:"??" },
		/*::[*/0x0097/*::]*/: { n:"??" },
		/*::[*/0x0098/*::]*/: { n:"??" },
		/*::[*/0x0099/*::]*/: { n:"??" },
		/*::[*/0x009A/*::]*/: { n:"??" },
		/*::[*/0x009B/*::]*/: { n:"??" },
		/*::[*/0x009C/*::]*/: { n:"??" },
		/*::[*/0x00A3/*::]*/: { n:"??" },
		/*::[*/0x00AE/*::]*/: { n:"??" },
		/*::[*/0x00AF/*::]*/: { n:"??" },
		/*::[*/0x00B0/*::]*/: { n:"??" },
		/*::[*/0x00B1/*::]*/: { n:"??" },
		/*::[*/0x00B8/*::]*/: { n:"??" },
		/*::[*/0x00B9/*::]*/: { n:"??" },
		/*::[*/0x00BA/*::]*/: { n:"??" },
		/*::[*/0x00BB/*::]*/: { n:"??" },
		/*::[*/0x00BC/*::]*/: { n:"??" },
		/*::[*/0x00C3/*::]*/: { n:"??" },
		/*::[*/0x00C9/*::]*/: { n:"??" },
		/*::[*/0x00CC/*::]*/: { n:"SHEETNAMECS", f:parse_SHEETNAMECS },
		/*::[*/0x00CD/*::]*/: { n:"??" },
		/*::[*/0x00CE/*::]*/: { n:"??" },
		/*::[*/0x00CF/*::]*/: { n:"??" },
		/*::[*/0x00D0/*::]*/: { n:"??" },
		/*::[*/0x0100/*::]*/: { n:"??" },
		/*::[*/0x0103/*::]*/: { n:"??" },
		/*::[*/0x0104/*::]*/: { n:"??" },
		/*::[*/0x0105/*::]*/: { n:"??" },
		/*::[*/0x0106/*::]*/: { n:"??" },
		/*::[*/0x0107/*::]*/: { n:"??" },
		/*::[*/0x0109/*::]*/: { n:"??" },
		/*::[*/0x010A/*::]*/: { n:"??" },
		/*::[*/0x010B/*::]*/: { n:"??" },
		/*::[*/0x010C/*::]*/: { n:"??" },
		/*::[*/0x010E/*::]*/: { n:"??" },
		/*::[*/0x010F/*::]*/: { n:"??" },
		/*::[*/0x0180/*::]*/: { n:"??" },
		/*::[*/0x0185/*::]*/: { n:"??" },
		/*::[*/0x0186/*::]*/: { n:"??" },
		/*::[*/0x0189/*::]*/: { n:"??" },
		/*::[*/0x018C/*::]*/: { n:"??" },
		/*::[*/0x0200/*::]*/: { n:"??" },
		/*::[*/0x0202/*::]*/: { n:"??" },
		/*::[*/0x0201/*::]*/: { n:"??" },
		/*::[*/0x0204/*::]*/: { n:"??" },
		/*::[*/0x0205/*::]*/: { n:"??" },
		/*::[*/0x0280/*::]*/: { n:"??" },
		/*::[*/0x0281/*::]*/: { n:"??" },
		/*::[*/0x0282/*::]*/: { n:"??" },
		/*::[*/0x0283/*::]*/: { n:"??" },
		/*::[*/0x0284/*::]*/: { n:"??" },
		/*::[*/0x0285/*::]*/: { n:"??" },
		/*::[*/0x0286/*::]*/: { n:"??" },
		/*::[*/0x0287/*::]*/: { n:"??" },
		/*::[*/0x0288/*::]*/: { n:"??" },
		/*::[*/0x0292/*::]*/: { n:"??" },
		/*::[*/0x0293/*::]*/: { n:"??" },
		/*::[*/0x0294/*::]*/: { n:"??" },
		/*::[*/0x0295/*::]*/: { n:"??" },
		/*::[*/0x0296/*::]*/: { n:"??" },
		/*::[*/0x0299/*::]*/: { n:"??" },
		/*::[*/0x029A/*::]*/: { n:"??" },
		/*::[*/0x0300/*::]*/: { n:"??" },
		/*::[*/0x0304/*::]*/: { n:"??" },
		/*::[*/0x0601/*::]*/: { n:"SHEETINFOQP", f:parse_SHEETINFOQP },
		/*::[*/0x0640/*::]*/: { n:"??" },
		/*::[*/0x0642/*::]*/: { n:"??" },
		/*::[*/0x0701/*::]*/: { n:"??" },
		/*::[*/0x0702/*::]*/: { n:"??" },
		/*::[*/0x0703/*::]*/: { n:"??" },
		/*::[*/0x0704/*::]*/: { n:"??" },
		/*::[*/0x0780/*::]*/: { n:"??" },
		/*::[*/0x0800/*::]*/: { n:"??" },
		/*::[*/0x0801/*::]*/: { n:"??" },
		/*::[*/0x0804/*::]*/: { n:"??" },
		/*::[*/0x0A80/*::]*/: { n:"??" },
		/*::[*/0x2AF6/*::]*/: { n:"??" },
		/*::[*/0x3231/*::]*/: { n:"??" },
		/*::[*/0x6E49/*::]*/: { n:"??" },
		/*::[*/0x6F44/*::]*/: { n:"??" },
		/*::[*/0xFFFF/*::]*/: { n:"" }
	};

	/* QPW uses a different set of record types */
	function qpw_to_workbook_buf(d, opts)/*:Workbook*/ {
		prep_blob(d, 0);
		var o = opts || {};
		var s/*:Worksheet*/ = ({}/*:any*/); if(o.dense) s["!data"] = [];
		var SST = [], sname = "";
		var range = {s:{r:-1,c:-1}, e:{r:-1,c:-1}};
		var cnt = 0, type = 0, C = 0, R = 0;
		var wb = { SheetNames: [], Sheets: {} };
		outer: while(d.l < d.length) {
			var RT = d.read_shift(2), length = d.read_shift(2);
			var p = d.slice(d.l, d.l + length);
			prep_blob(p, 0);
			switch(RT) {
				case 0x01: /* BOF */
					if(p.read_shift(4) != 0x39575051) throw "Bad QPW9 BOF!";
					break;
				case 0x02: /* EOF */ break outer;

				/* TODO: The behavior here should be consistent with Numbers: QP Notebook ~ .TN.SheetArchive, QP Sheet ~ .TST.TableModelArchive */
				case 0x0401: /* BON */ break;
				case 0x0402: /* EON */ /* TODO: backfill missing sheets based on BON cnt */ break;

				case 0x0407: { /* SST */
					p.l += 12;
					while(p.l < p.length) {
						cnt = p.read_shift(2);
						type = p.read_shift(1);
						SST.push(p.read_shift(cnt, 'cstr'));
					}
				} break;
				case 0x0408: break;

				case 0x0601: { /* BOS */
					var sidx = p.read_shift(2);
					s = ({}/*:any*/); if(o.dense) s["!data"] = [];
					range.s.c = p.read_shift(2);
					range.e.c = p.read_shift(2);
					range.s.r = p.read_shift(4);
					range.e.r = p.read_shift(4);
					p.l += 4;
					if(p.l + 2 < p.length) {
						cnt = p.read_shift(2);
						type = p.read_shift(1);
						sname = cnt == 0 ? "" : p.read_shift(cnt, 'cstr');
					}
					if(!sname) sname = encode_col(sidx);
					/* TODO: backfill empty sheets */
				} break;
				case 0x0602: { /* EOS */
					/* NOTE: QP valid range A1:IV1000000 */
					if(range.s.c > 0xFF || range.s.r > 999999) break;
					if(range.e.c < range.s.c) range.e.c = range.s.c;
					if(range.e.r < range.s.r) range.e.r = range.s.r;
					s["!ref"] = encode_range(range);
					book_append_sheet(wb, s, sname); // TODO: a barrel roll
				} break;

				case 0x0A01: { /* COL (like XLS Row, modulo the layout transposition) */
					C = p.read_shift(2);
					if(range.e.c < C) range.e.c = C;
					if(range.s.c > C) range.s.c = C;
					R = p.read_shift(4);
					if(range.s.r > R) range.s.r = R;
					R = p.read_shift(4);
					if(range.e.r < R) range.e.r = R;
				} break;

				case 0x0C01: { /* MulCells (like XLS MulRK, but takes advantage of common column data patterns) */
					R = p.read_shift(4), cnt = p.read_shift(4);
					if(range.s.r > R) range.s.r = R;
					if(range.e.r < R + cnt - 1) range.e.r = R + cnt - 1;
					var CC = encode_col(C);
					while(p.l < p.length) {
						var cell = { t: "z" };
						var flags = p.read_shift(1);
						if(flags & 0x80) p.l += 2;
						var mul = (flags & 0x40) ? p.read_shift(2) - 1: 0;
						switch(flags & 0x1F) {
							case 1: break;
							case 2: cell = { t: "n", v: p.read_shift(2) }; break;
							case 3: cell = { t: "n", v: p.read_shift(2, 'i') }; break;
							case 5: cell = { t: "n", v: p.read_shift(8, 'f') }; break;
							case 7: cell = { t: "s", v: SST[type = p.read_shift(4) - 1] }; break;
							case 8: cell = { t: "n", v: p.read_shift(8, 'f') }; p.l += 2; /* cell.f = formulae[p.read_shift(4)]; */ p.l += 4; break;
							default: throw "Unrecognized QPW cell type " + (flags & 0x1F);
						}
						var delta = 0;
						if(flags & 0x20) switch(flags & 0x1F) {
							case 2: delta = p.read_shift(2); break;
							case 3: delta = p.read_shift(2, 'i'); break;
							case 7: delta = p.read_shift(2); break;
							default: throw "Unsupported delta for QPW cell type " + (flags & 0x1F);
						}
						if(!(!o.sheetStubs && cell.t == "z")) {
							if(s["!data"] != null) {
								if(!s["!data"][R]) s["!data"][R] = [];
								s["!data"][R][C] = cell;
							} else s[CC + encode_row(R)] = cell;
						}
						++R; --cnt;
						while(mul-- > 0 && cnt >= 0) {
							if(flags & 0x20) switch(flags & 0x1F) {
								case 2: cell = { t: "n", v: (cell.v + delta) & 0xFFFF }; break;
								case 3: cell = { t: "n", v: (cell.v + delta) & 0xFFFF }; if(cell.v > 0x7FFF) cell.v -= 0x10000; break;
								case 7: cell = { t: "s", v: SST[type = (type + delta) >>> 0] }; break;
								default: throw "Cannot apply delta for QPW cell type " + (flags & 0x1F);
							}
							}
						}
			}