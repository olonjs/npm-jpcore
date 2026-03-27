import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import * as E from "react";
import E__default, { createContext, forwardRef, createElement, useLayoutEffect, useState, useEffect, useRef, useContext, Component, useMemo } from "react";
import * as Sn from "react-dom";
import Sn__default from "react-dom";
import { Sun, Moon, ChevronDown, X, Menu, ArrowRight, Github, Terminal, EyeOff, Eye, Undo2, Redo2, Bold, Italic, Strikethrough, Code2, List, ListOrdered, Quote, SquareCode, Link2, Unlink2, ImagePlus, Eraser } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { z } from "zod";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
function Sc(e, t) {
  return t.header != null && e["global-header"] !== false;
}
const Te = {
  INLINE_FIELD_UPDATE: "jsonpages:inline-field-update",
  REQUEST_INLINE_FLUSH: "jsonpages:request-inline-flush"
};
var _t = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Br(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var qn = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var ki;
function Ec() {
  return ki || (ki = 1, (function(e, t) {
    (function(r) {
      e.exports = r();
    })(function() {
      return (function r(n, o, i) {
        function a(c, d) {
          if (!o[c]) {
            if (!n[c]) {
              var u = typeof Br == "function" && Br;
              if (!d && u) return u(c, true);
              if (s) return s(c, true);
              var g = new Error("Cannot find module '" + c + "'");
              throw g.code = "MODULE_NOT_FOUND", g;
            }
            var f = o[c] = { exports: {} };
            n[c][0].call(f.exports, function(w) {
              var p = n[c][1][w];
              return a(p || w);
            }, f, f.exports, r, n, o, i);
          }
          return o[c].exports;
        }
        for (var s = typeof Br == "function" && Br, l = 0; l < i.length; l++) a(i[l]);
        return a;
      })({ 1: [function(r, n, o) {
        var i = r("./utils"), a = r("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        o.encode = function(l) {
          for (var c, d, u, g, f, w, p, v = [], m = 0, x = l.length, k = x, _ = i.getTypeOf(l) !== "string"; m < l.length; ) k = x - m, u = _ ? (c = l[m++], d = m < x ? l[m++] : 0, m < x ? l[m++] : 0) : (c = l.charCodeAt(m++), d = m < x ? l.charCodeAt(m++) : 0, m < x ? l.charCodeAt(m++) : 0), g = c >> 2, f = (3 & c) << 4 | d >> 4, w = 1 < k ? (15 & d) << 2 | u >> 6 : 64, p = 2 < k ? 63 & u : 64, v.push(s.charAt(g) + s.charAt(f) + s.charAt(w) + s.charAt(p));
          return v.join("");
        }, o.decode = function(l) {
          var c, d, u, g, f, w, p = 0, v = 0, m = "data:";
          if (l.substr(0, m.length) === m) throw new Error("Invalid base64 input, it looks like a data url.");
          var x, k = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === s.charAt(64) && k--, l.charAt(l.length - 2) === s.charAt(64) && k--, k % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (x = a.uint8array ? new Uint8Array(0 | k) : new Array(0 | k); p < l.length; ) c = s.indexOf(l.charAt(p++)) << 2 | (g = s.indexOf(l.charAt(p++))) >> 4, d = (15 & g) << 4 | (f = s.indexOf(l.charAt(p++))) >> 2, u = (3 & f) << 6 | (w = s.indexOf(l.charAt(p++))), x[v++] = c, f !== 64 && (x[v++] = d), w !== 64 && (x[v++] = u);
          return x;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(r, n, o) {
        var i = r("./external"), a = r("./stream/DataWorker"), s = r("./stream/Crc32Probe"), l = r("./stream/DataLengthProbe");
        function c(d, u, g, f, w) {
          this.compressedSize = d, this.uncompressedSize = u, this.crc32 = g, this.compression = f, this.compressedContent = w;
        }
        c.prototype = { getContentWorker: function() {
          var d = new a(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), u = this;
          return d.on("end", function() {
            if (this.streamInfo.data_length !== u.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), d;
        }, getCompressedWorker: function() {
          return new a(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, c.createWorkerFrom = function(d, u, g) {
          return d.pipe(new s()).pipe(new l("uncompressedSize")).pipe(u.compressWorker(g)).pipe(new l("compressedSize")).withStreamInfo("compression", u);
        }, n.exports = c;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(r, n, o) {
        var i = r("./stream/GenericWorker");
        o.STORE = { magic: "\0\0", compressWorker: function() {
          return new i("STORE compression");
        }, uncompressWorker: function() {
          return new i("STORE decompression");
        } }, o.DEFLATE = r("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(r, n, o) {
        var i = r("./utils"), a = (function() {
          for (var s, l = [], c = 0; c < 256; c++) {
            s = c;
            for (var d = 0; d < 8; d++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            l[c] = s;
          }
          return l;
        })();
        n.exports = function(s, l) {
          return s !== void 0 && s.length ? i.getTypeOf(s) !== "string" ? (function(c, d, u, g) {
            var f = a, w = g + u;
            c ^= -1;
            for (var p = g; p < w; p++) c = c >>> 8 ^ f[255 & (c ^ d[p])];
            return -1 ^ c;
          })(0 | l, s, s.length, 0) : (function(c, d, u, g) {
            var f = a, w = g + u;
            c ^= -1;
            for (var p = g; p < w; p++) c = c >>> 8 ^ f[255 & (c ^ d.charCodeAt(p))];
            return -1 ^ c;
          })(0 | l, s, s.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(r, n, o) {
        o.base64 = false, o.binary = false, o.dir = false, o.createFolders = true, o.date = null, o.compression = null, o.compressionOptions = null, o.comment = null, o.unixPermissions = null, o.dosPermissions = null;
      }, {}], 6: [function(r, n, o) {
        var i = null;
        i = typeof Promise < "u" ? Promise : r("lie"), n.exports = { Promise: i };
      }, { lie: 37 }], 7: [function(r, n, o) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = r("pako"), s = r("./utils"), l = r("./stream/GenericWorker"), c = i ? "uint8array" : "array";
        function d(u, g) {
          l.call(this, "FlateWorker/" + u), this._pako = null, this._pakoAction = u, this._pakoOptions = g, this.meta = {};
        }
        o.magic = "\b\0", s.inherits(d, l), d.prototype.processChunk = function(u) {
          this.meta = u.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(c, u.data), false);
        }, d.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], true);
        }, d.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, d.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
          var u = this;
          this._pako.onData = function(g) {
            u.push({ data: g, meta: u.meta });
          };
        }, o.compressWorker = function(u) {
          return new d("Deflate", u);
        }, o.uncompressWorker = function() {
          return new d("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(r, n, o) {
        function i(f, w) {
          var p, v = "";
          for (p = 0; p < w; p++) v += String.fromCharCode(255 & f), f >>>= 8;
          return v;
        }
        function a(f, w, p, v, m, x) {
          var k, _, S = f.file, R = f.compression, A = x !== c.utf8encode, T = s.transformTo("string", x(S.name)), D = s.transformTo("string", c.utf8encode(S.name)), U = S.comment, M = s.transformTo("string", x(U)), C = s.transformTo("string", c.utf8encode(U)), P = D.length !== S.name.length, y = C.length !== U.length, F = "", te = "", W = "", $ = S.dir, V = S.date, ne = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          w && !p || (ne.crc32 = f.crc32, ne.compressedSize = f.compressedSize, ne.uncompressedSize = f.uncompressedSize);
          var z2 = 0;
          w && (z2 |= 8), A || !P && !y || (z2 |= 2048);
          var O = 0, Q = 0;
          $ && (O |= 16), m === "UNIX" ? (Q = 798, O |= (function(J, de) {
            var q = J;
            return J || (q = de ? 16893 : 33204), (65535 & q) << 16;
          })(S.unixPermissions, $)) : (Q = 20, O |= (function(J) {
            return 63 & (J || 0);
          })(S.dosPermissions)), k = V.getUTCHours(), k <<= 6, k |= V.getUTCMinutes(), k <<= 5, k |= V.getUTCSeconds() / 2, _ = V.getUTCFullYear() - 1980, _ <<= 4, _ |= V.getUTCMonth() + 1, _ <<= 5, _ |= V.getUTCDate(), P && (te = i(1, 1) + i(d(T), 4) + D, F += "up" + i(te.length, 2) + te), y && (W = i(1, 1) + i(d(M), 4) + C, F += "uc" + i(W.length, 2) + W);
          var G = "";
          return G += `
\0`, G += i(z2, 2), G += R.magic, G += i(k, 2), G += i(_, 2), G += i(ne.crc32, 4), G += i(ne.compressedSize, 4), G += i(ne.uncompressedSize, 4), G += i(T.length, 2), G += i(F.length, 2), { fileRecord: u.LOCAL_FILE_HEADER + G + T + F, dirRecord: u.CENTRAL_FILE_HEADER + i(Q, 2) + G + i(M.length, 2) + "\0\0\0\0" + i(O, 4) + i(v, 4) + T + F + M };
        }
        var s = r("../utils"), l = r("../stream/GenericWorker"), c = r("../utf8"), d = r("../crc32"), u = r("../signature");
        function g(f, w, p, v) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = w, this.zipPlatform = p, this.encodeFileName = v, this.streamFiles = f, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        s.inherits(g, l), g.prototype.push = function(f) {
          var w = f.meta.percent || 0, p = this.entriesCount, v = this._sources.length;
          this.accumulate ? this.contentBuffer.push(f) : (this.bytesWritten += f.data.length, l.prototype.push.call(this, { data: f.data, meta: { currentFile: this.currentFile, percent: p ? (w + 100 * (p - v - 1)) / p : 100 } }));
        }, g.prototype.openedSource = function(f) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = f.file.name;
          var w = this.streamFiles && !f.file.dir;
          if (w) {
            var p = a(f, w, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: p.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = true;
        }, g.prototype.closedSource = function(f) {
          this.accumulate = false;
          var w = this.streamFiles && !f.file.dir, p = a(f, w, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(p.dirRecord), w) this.push({ data: (function(v) {
            return u.DATA_DESCRIPTOR + i(v.crc32, 4) + i(v.compressedSize, 4) + i(v.uncompressedSize, 4);
          })(f), meta: { percent: 100 } });
          else for (this.push({ data: p.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, g.prototype.flush = function() {
          for (var f = this.bytesWritten, w = 0; w < this.dirRecords.length; w++) this.push({ data: this.dirRecords[w], meta: { percent: 100 } });
          var p = this.bytesWritten - f, v = (function(m, x, k, _, S) {
            var R = s.transformTo("string", S(_));
            return u.CENTRAL_DIRECTORY_END + "\0\0\0\0" + i(m, 2) + i(m, 2) + i(x, 4) + i(k, 4) + i(R.length, 2) + R;
          })(this.dirRecords.length, p, f, this.zipComment, this.encodeFileName);
          this.push({ data: v, meta: { percent: 100 } });
        }, g.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, g.prototype.registerPrevious = function(f) {
          this._sources.push(f);
          var w = this;
          return f.on("data", function(p) {
            w.processChunk(p);
          }), f.on("end", function() {
            w.closedSource(w.previous.streamInfo), w._sources.length ? w.prepareNextSource() : w.end();
          }), f.on("error", function(p) {
            w.error(p);
          }), this;
        }, g.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
        }, g.prototype.error = function(f) {
          var w = this._sources;
          if (!l.prototype.error.call(this, f)) return false;
          for (var p = 0; p < w.length; p++) try {
            w[p].error(f);
          } catch {
          }
          return true;
        }, g.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var f = this._sources, w = 0; w < f.length; w++) f[w].lock();
        }, n.exports = g;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(r, n, o) {
        var i = r("../compressions"), a = r("./ZipFileWorker");
        o.generateWorker = function(s, l, c) {
          var d = new a(l.streamFiles, c, l.platform, l.encodeFileName), u = 0;
          try {
            s.forEach(function(g, f) {
              u++;
              var w = (function(x, k) {
                var _ = x || k, S = i[_];
                if (!S) throw new Error(_ + " is not a valid compression method !");
                return S;
              })(f.options.compression, l.compression), p = f.options.compressionOptions || l.compressionOptions || {}, v = f.dir, m = f.date;
              f._compressWorker(w, p).withStreamInfo("file", { name: g, dir: v, date: m, comment: f.comment || "", unixPermissions: f.unixPermissions, dosPermissions: f.dosPermissions }).pipe(d);
            }), d.entriesCount = u;
          } catch (g) {
            d.error(g);
          }
          return d;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(r, n, o) {
        function i() {
          if (!(this instanceof i)) return new i();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new i();
            for (var s in this) typeof this[s] != "function" && (a[s] = this[s]);
            return a;
          };
        }
        (i.prototype = r("./object")).loadAsync = r("./load"), i.support = r("./support"), i.defaults = r("./defaults"), i.version = "3.10.1", i.loadAsync = function(a, s) {
          return new i().loadAsync(a, s);
        }, i.external = r("./external"), n.exports = i;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(r, n, o) {
        var i = r("./utils"), a = r("./external"), s = r("./utf8"), l = r("./zipEntries"), c = r("./stream/Crc32Probe"), d = r("./nodejsUtils");
        function u(g) {
          return new a.Promise(function(f, w) {
            var p = g.decompressed.getContentWorker().pipe(new c());
            p.on("error", function(v) {
              w(v);
            }).on("end", function() {
              p.streamInfo.crc32 !== g.decompressed.crc32 ? w(new Error("Corrupted zip : CRC32 mismatch")) : f();
            }).resume();
          });
        }
        n.exports = function(g, f) {
          var w = this;
          return f = i.extend(f || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: s.utf8decode }), d.isNode && d.isStream(g) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", g, true, f.optimizedBinaryString, f.base64).then(function(p) {
            var v = new l(f);
            return v.load(p), v;
          }).then(function(p) {
            var v = [a.Promise.resolve(p)], m = p.files;
            if (f.checkCRC32) for (var x = 0; x < m.length; x++) v.push(u(m[x]));
            return a.Promise.all(v);
          }).then(function(p) {
            for (var v = p.shift(), m = v.files, x = 0; x < m.length; x++) {
              var k = m[x], _ = k.fileNameStr, S = i.resolve(k.fileNameStr);
              w.file(S, k.decompressed, { binary: true, optimizedBinaryString: true, date: k.date, dir: k.dir, comment: k.fileCommentStr.length ? k.fileCommentStr : null, unixPermissions: k.unixPermissions, dosPermissions: k.dosPermissions, createFolders: f.createFolders }), k.dir || (w.file(S).unsafeOriginalName = _);
            }
            return v.zipComment.length && (w.comment = v.zipComment), w;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(r, n, o) {
        var i = r("../utils"), a = r("../stream/GenericWorker");
        function s(l, c) {
          a.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = false, this._bindStream(c);
        }
        i.inherits(s, a), s.prototype._bindStream = function(l) {
          var c = this;
          (this._stream = l).pause(), l.on("data", function(d) {
            c.push({ data: d, meta: { percent: 0 } });
          }).on("error", function(d) {
            c.isPaused ? this.generatedError = d : c.error(d);
          }).on("end", function() {
            c.isPaused ? c._upstreamEnded = true : c.end();
          });
        }, s.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), true);
        }, s.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
        }, n.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(r, n, o) {
        var i = r("readable-stream").Readable;
        function a(s, l, c) {
          i.call(this, l), this._helper = s;
          var d = this;
          s.on("data", function(u, g) {
            d.push(u) || d._helper.pause(), c && c(g);
          }).on("error", function(u) {
            d.emit("error", u);
          }).on("end", function() {
            d.push(null);
          });
        }
        r("../utils").inherits(a, i), a.prototype._read = function() {
          this._helper.resume();
        }, n.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(r, n, o) {
        n.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(i, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(i, a);
          if (typeof i == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(i, a);
        }, allocBuffer: function(i) {
          if (Buffer.alloc) return Buffer.alloc(i);
          var a = new Buffer(i);
          return a.fill(0), a;
        }, isBuffer: function(i) {
          return Buffer.isBuffer(i);
        }, isStream: function(i) {
          return i && typeof i.on == "function" && typeof i.pause == "function" && typeof i.resume == "function";
        } };
      }, {}], 15: [function(r, n, o) {
        function i(S, R, A) {
          var T, D = s.getTypeOf(R), U = s.extend(A || {}, d);
          U.date = U.date || /* @__PURE__ */ new Date(), U.compression !== null && (U.compression = U.compression.toUpperCase()), typeof U.unixPermissions == "string" && (U.unixPermissions = parseInt(U.unixPermissions, 8)), U.unixPermissions && 16384 & U.unixPermissions && (U.dir = true), U.dosPermissions && 16 & U.dosPermissions && (U.dir = true), U.dir && (S = m(S)), U.createFolders && (T = v(S)) && x.call(this, T, true);
          var M = D === "string" && U.binary === false && U.base64 === false;
          A && A.binary !== void 0 || (U.binary = !M), (R instanceof u && R.uncompressedSize === 0 || U.dir || !R || R.length === 0) && (U.base64 = false, U.binary = true, R = "", U.compression = "STORE", D = "string");
          var C = null;
          C = R instanceof u || R instanceof l ? R : w.isNode && w.isStream(R) ? new p(S, R) : s.prepareContent(S, R, U.binary, U.optimizedBinaryString, U.base64);
          var P = new g(S, C, U);
          this.files[S] = P;
        }
        var a = r("./utf8"), s = r("./utils"), l = r("./stream/GenericWorker"), c = r("./stream/StreamHelper"), d = r("./defaults"), u = r("./compressedObject"), g = r("./zipObject"), f = r("./generate"), w = r("./nodejsUtils"), p = r("./nodejs/NodejsStreamInputAdapter"), v = function(S) {
          S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
          var R = S.lastIndexOf("/");
          return 0 < R ? S.substring(0, R) : "";
        }, m = function(S) {
          return S.slice(-1) !== "/" && (S += "/"), S;
        }, x = function(S, R) {
          return R = R !== void 0 ? R : d.createFolders, S = m(S), this.files[S] || i.call(this, S, null, { dir: true, createFolders: R }), this.files[S];
        };
        function k(S) {
          return Object.prototype.toString.call(S) === "[object RegExp]";
        }
        var _ = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(S) {
          var R, A, T;
          for (R in this.files) T = this.files[R], (A = R.slice(this.root.length, R.length)) && R.slice(0, this.root.length) === this.root && S(A, T);
        }, filter: function(S) {
          var R = [];
          return this.forEach(function(A, T) {
            S(A, T) && R.push(T);
          }), R;
        }, file: function(S, R, A) {
          if (arguments.length !== 1) return S = this.root + S, i.call(this, S, R, A), this;
          if (k(S)) {
            var T = S;
            return this.filter(function(U, M) {
              return !M.dir && T.test(U);
            });
          }
          var D = this.files[this.root + S];
          return D && !D.dir ? D : null;
        }, folder: function(S) {
          if (!S) return this;
          if (k(S)) return this.filter(function(D, U) {
            return U.dir && S.test(D);
          });
          var R = this.root + S, A = x.call(this, R), T = this.clone();
          return T.root = A.name, T;
        }, remove: function(S) {
          S = this.root + S;
          var R = this.files[S];
          if (R || (S.slice(-1) !== "/" && (S += "/"), R = this.files[S]), R && !R.dir) delete this.files[S];
          else for (var A = this.filter(function(D, U) {
            return U.name.slice(0, S.length) === S;
          }), T = 0; T < A.length; T++) delete this.files[A[T].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(S) {
          var R, A = {};
          try {
            if ((A = s.extend(S || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = A.type.toLowerCase(), A.compression = A.compression.toUpperCase(), A.type === "binarystring" && (A.type = "string"), !A.type) throw new Error("No output type specified.");
            s.checkSupport(A.type), A.platform !== "darwin" && A.platform !== "freebsd" && A.platform !== "linux" && A.platform !== "sunos" || (A.platform = "UNIX"), A.platform === "win32" && (A.platform = "DOS");
            var T = A.comment || this.comment || "";
            R = f.generateWorker(this, A, T);
          } catch (D) {
            (R = new l("error")).error(D);
          }
          return new c(R, A.type || "string", A.mimeType);
        }, generateAsync: function(S, R) {
          return this.generateInternalStream(S).accumulate(R);
        }, generateNodeStream: function(S, R) {
          return (S = S || {}).type || (S.type = "nodebuffer"), this.generateInternalStream(S).toNodejsStream(R);
        } };
        n.exports = _;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(r, n, o) {
        n.exports = r("stream");
      }, { stream: void 0 }], 17: [function(r, n, o) {
        var i = r("./DataReader");
        function a(s) {
          i.call(this, s);
          for (var l = 0; l < this.data.length; l++) s[l] = 255 & s[l];
        }
        r("../utils").inherits(a, i), a.prototype.byteAt = function(s) {
          return this.data[this.zero + s];
        }, a.prototype.lastIndexOfSignature = function(s) {
          for (var l = s.charCodeAt(0), c = s.charCodeAt(1), d = s.charCodeAt(2), u = s.charCodeAt(3), g = this.length - 4; 0 <= g; --g) if (this.data[g] === l && this.data[g + 1] === c && this.data[g + 2] === d && this.data[g + 3] === u) return g - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(s) {
          var l = s.charCodeAt(0), c = s.charCodeAt(1), d = s.charCodeAt(2), u = s.charCodeAt(3), g = this.readData(4);
          return l === g[0] && c === g[1] && d === g[2] && u === g[3];
        }, a.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, n.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(r, n, o) {
        var i = r("../utils");
        function a(s) {
          this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(s) {
          this.checkIndex(this.index + s);
        }, checkIndex: function(s) {
          if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
        }, setIndex: function(s) {
          this.checkIndex(s), this.index = s;
        }, skip: function(s) {
          this.setIndex(this.index + s);
        }, byteAt: function() {
        }, readInt: function(s) {
          var l, c = 0;
          for (this.checkOffset(s), l = this.index + s - 1; l >= this.index; l--) c = (c << 8) + this.byteAt(l);
          return this.index += s, c;
        }, readString: function(s) {
          return i.transformTo("string", this.readData(s));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var s = this.readInt(4);
          return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
        } }, n.exports = a;
      }, { "../utils": 32 }], 19: [function(r, n, o) {
        var i = r("./Uint8ArrayReader");
        function a(s) {
          i.call(this, s);
        }
        r("../utils").inherits(a, i), a.prototype.readData = function(s) {
          this.checkOffset(s);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, n.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(r, n, o) {
        var i = r("./DataReader");
        function a(s) {
          i.call(this, s);
        }
        r("../utils").inherits(a, i), a.prototype.byteAt = function(s) {
          return this.data.charCodeAt(this.zero + s);
        }, a.prototype.lastIndexOfSignature = function(s) {
          return this.data.lastIndexOf(s) - this.zero;
        }, a.prototype.readAndCheckSignature = function(s) {
          return s === this.readData(4);
        }, a.prototype.readData = function(s) {
          this.checkOffset(s);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, n.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(r, n, o) {
        var i = r("./ArrayReader");
        function a(s) {
          i.call(this, s);
        }
        r("../utils").inherits(a, i), a.prototype.readData = function(s) {
          if (this.checkOffset(s), s === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
          return this.index += s, l;
        }, n.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(r, n, o) {
        var i = r("../utils"), a = r("../support"), s = r("./ArrayReader"), l = r("./StringReader"), c = r("./NodeBufferReader"), d = r("./Uint8ArrayReader");
        n.exports = function(u) {
          var g = i.getTypeOf(u);
          return i.checkSupport(g), g !== "string" || a.uint8array ? g === "nodebuffer" ? new c(u) : a.uint8array ? new d(i.transformTo("uint8array", u)) : new s(i.transformTo("array", u)) : new l(u);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(r, n, o) {
        o.LOCAL_FILE_HEADER = "PK", o.CENTRAL_FILE_HEADER = "PK", o.CENTRAL_DIRECTORY_END = "PK", o.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", o.ZIP64_CENTRAL_DIRECTORY_END = "PK", o.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(r, n, o) {
        var i = r("./GenericWorker"), a = r("../utils");
        function s(l) {
          i.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        a.inherits(s, i), s.prototype.processChunk = function(l) {
          this.push({ data: a.transformTo(this.destType, l.data), meta: l.meta });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(r, n, o) {
        var i = r("./GenericWorker"), a = r("../crc32");
        function s() {
          i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        r("../utils").inherits(s, i), s.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = a(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, n.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(r, n, o) {
        var i = r("../utils"), a = r("./GenericWorker");
        function s(l) {
          a.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        i.inherits(s, a), s.prototype.processChunk = function(l) {
          if (l) {
            var c = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = c + l.data.length;
          }
          a.prototype.processChunk.call(this, l);
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(r, n, o) {
        var i = r("../utils"), a = r("./GenericWorker");
        function s(l) {
          a.call(this, "DataWorker");
          var c = this;
          this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, l.then(function(d) {
            c.dataIsReady = true, c.data = d, c.max = d && d.length || 0, c.type = i.getTypeOf(d), c.isPaused || c._tickAndRepeat();
          }, function(d) {
            c.error(d);
          });
        }
        i.inherits(s, a), s.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, i.delay(this._tickAndRepeat, [], this)), true);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return false;
          var l = null, c = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, c);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, c);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, c);
          }
          return this.index = c, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, n.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(r, n, o) {
        function i(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        i.prototype = { push: function(a) {
          this.emit("data", a);
        }, end: function() {
          if (this.isFinished) return false;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = true;
          } catch (a) {
            this.emit("error", a);
          }
          return true;
        }, error: function(a) {
          return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = true, this.emit("error", a), this.previous && this.previous.error(a), this.cleanUp()), true);
        }, on: function(a, s) {
          return this._listeners[a].push(s), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, s) {
          if (this._listeners[a]) for (var l = 0; l < this._listeners[a].length; l++) this._listeners[a][l].call(this, s);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var s = this;
          return a.on("data", function(l) {
            s.processChunk(l);
          }), a.on("end", function() {
            s.end();
          }), a.on("error", function(l) {
            s.error(l);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return false;
          var a = this.isPaused = false;
          return this.generatedError && (this.error(this.generatedError), a = true), this.previous && this.previous.resume(), !a;
        }, flush: function() {
        }, processChunk: function(a) {
          this.push(a);
        }, withStreamInfo: function(a, s) {
          return this.extraStreamInfo[a] = s, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = true, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, n.exports = i;
      }, {}], 29: [function(r, n, o) {
        var i = r("../utils"), a = r("./ConvertWorker"), s = r("./GenericWorker"), l = r("../base64"), c = r("../support"), d = r("../external"), u = null;
        if (c.nodestream) try {
          u = r("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function g(w, p) {
          return new d.Promise(function(v, m) {
            var x = [], k = w._internalType, _ = w._outputType, S = w._mimeType;
            w.on("data", function(R, A) {
              x.push(R), p && p(A);
            }).on("error", function(R) {
              x = [], m(R);
            }).on("end", function() {
              try {
                var R = (function(A, T, D) {
                  switch (A) {
                    case "blob":
                      return i.newBlob(i.transformTo("arraybuffer", T), D);
                    case "base64":
                      return l.encode(T);
                    default:
                      return i.transformTo(A, T);
                  }
                })(_, (function(A, T) {
                  var D, U = 0, M = null, C = 0;
                  for (D = 0; D < T.length; D++) C += T[D].length;
                  switch (A) {
                    case "string":
                      return T.join("");
                    case "array":
                      return Array.prototype.concat.apply([], T);
                    case "uint8array":
                      for (M = new Uint8Array(C), D = 0; D < T.length; D++) M.set(T[D], U), U += T[D].length;
                      return M;
                    case "nodebuffer":
                      return Buffer.concat(T);
                    default:
                      throw new Error("concat : unsupported type '" + A + "'");
                  }
                })(k, x), S);
                v(R);
              } catch (A) {
                m(A);
              }
              x = [];
            }).resume();
          });
        }
        function f(w, p, v) {
          var m = p;
          switch (p) {
            case "blob":
            case "arraybuffer":
              m = "uint8array";
              break;
            case "base64":
              m = "string";
          }
          try {
            this._internalType = m, this._outputType = p, this._mimeType = v, i.checkSupport(m), this._worker = w.pipe(new a(m)), w.lock();
          } catch (x) {
            this._worker = new s("error"), this._worker.error(x);
          }
        }
        f.prototype = { accumulate: function(w) {
          return g(this, w);
        }, on: function(w, p) {
          var v = this;
          return w === "data" ? this._worker.on(w, function(m) {
            p.call(v, m.data, m.meta);
          }) : this._worker.on(w, function() {
            i.delay(p, arguments, v);
          }), this;
        }, resume: function() {
          return i.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(w) {
          if (i.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new u(this, { objectMode: this._outputType !== "nodebuffer" }, w);
        } }, n.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(r, n, o) {
        if (o.base64 = true, o.array = true, o.string = true, o.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", o.nodebuffer = typeof Buffer < "u", o.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") o.blob = false;
        else {
          var i = new ArrayBuffer(0);
          try {
            o.blob = new Blob([i], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(i), o.blob = a.getBlob("application/zip").size === 0;
            } catch {
              o.blob = false;
            }
          }
        }
        try {
          o.nodestream = !!r("readable-stream").Readable;
        } catch {
          o.nodestream = false;
        }
      }, { "readable-stream": 16 }], 31: [function(r, n, o) {
        for (var i = r("./utils"), a = r("./support"), s = r("./nodejsUtils"), l = r("./stream/GenericWorker"), c = new Array(256), d = 0; d < 256; d++) c[d] = 252 <= d ? 6 : 248 <= d ? 5 : 240 <= d ? 4 : 224 <= d ? 3 : 192 <= d ? 2 : 1;
        c[254] = c[254] = 1;
        function u() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function g() {
          l.call(this, "utf-8 encode");
        }
        o.utf8encode = function(f) {
          return a.nodebuffer ? s.newBufferFrom(f, "utf-8") : (function(w) {
            var p, v, m, x, k, _ = w.length, S = 0;
            for (x = 0; x < _; x++) (64512 & (v = w.charCodeAt(x))) == 55296 && x + 1 < _ && (64512 & (m = w.charCodeAt(x + 1))) == 56320 && (v = 65536 + (v - 55296 << 10) + (m - 56320), x++), S += v < 128 ? 1 : v < 2048 ? 2 : v < 65536 ? 3 : 4;
            for (p = a.uint8array ? new Uint8Array(S) : new Array(S), x = k = 0; k < S; x++) (64512 & (v = w.charCodeAt(x))) == 55296 && x + 1 < _ && (64512 & (m = w.charCodeAt(x + 1))) == 56320 && (v = 65536 + (v - 55296 << 10) + (m - 56320), x++), v < 128 ? p[k++] = v : (v < 2048 ? p[k++] = 192 | v >>> 6 : (v < 65536 ? p[k++] = 224 | v >>> 12 : (p[k++] = 240 | v >>> 18, p[k++] = 128 | v >>> 12 & 63), p[k++] = 128 | v >>> 6 & 63), p[k++] = 128 | 63 & v);
            return p;
          })(f);
        }, o.utf8decode = function(f) {
          return a.nodebuffer ? i.transformTo("nodebuffer", f).toString("utf-8") : (function(w) {
            var p, v, m, x, k = w.length, _ = new Array(2 * k);
            for (p = v = 0; p < k; ) if ((m = w[p++]) < 128) _[v++] = m;
            else if (4 < (x = c[m])) _[v++] = 65533, p += x - 1;
            else {
              for (m &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && p < k; ) m = m << 6 | 63 & w[p++], x--;
              1 < x ? _[v++] = 65533 : m < 65536 ? _[v++] = m : (m -= 65536, _[v++] = 55296 | m >> 10 & 1023, _[v++] = 56320 | 1023 & m);
            }
            return _.length !== v && (_.subarray ? _ = _.subarray(0, v) : _.length = v), i.applyFromCharCode(_);
          })(f = i.transformTo(a.uint8array ? "uint8array" : "array", f));
        }, i.inherits(u, l), u.prototype.processChunk = function(f) {
          var w = i.transformTo(a.uint8array ? "uint8array" : "array", f.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var p = w;
              (w = new Uint8Array(p.length + this.leftOver.length)).set(this.leftOver, 0), w.set(p, this.leftOver.length);
            } else w = this.leftOver.concat(w);
            this.leftOver = null;
          }
          var v = (function(x, k) {
            var _;
            for ((k = k || x.length) > x.length && (k = x.length), _ = k - 1; 0 <= _ && (192 & x[_]) == 128; ) _--;
            return _ < 0 || _ === 0 ? k : _ + c[x[_]] > k ? _ : k;
          })(w), m = w;
          v !== w.length && (a.uint8array ? (m = w.subarray(0, v), this.leftOver = w.subarray(v, w.length)) : (m = w.slice(0, v), this.leftOver = w.slice(v, w.length))), this.push({ data: o.utf8decode(m), meta: f.meta });
        }, u.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: o.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, o.Utf8DecodeWorker = u, i.inherits(g, l), g.prototype.processChunk = function(f) {
          this.push({ data: o.utf8encode(f.data), meta: f.meta });
        }, o.Utf8EncodeWorker = g;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(r, n, o) {
        var i = r("./support"), a = r("./base64"), s = r("./nodejsUtils"), l = r("./external");
        function c(p) {
          return p;
        }
        function d(p, v) {
          for (var m = 0; m < p.length; ++m) v[m] = 255 & p.charCodeAt(m);
          return v;
        }
        r("setimmediate"), o.newBlob = function(p, v) {
          o.checkSupport("blob");
          try {
            return new Blob([p], { type: v });
          } catch {
            try {
              var m = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return m.append(p), m.getBlob(v);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var u = { stringifyByChunk: function(p, v, m) {
          var x = [], k = 0, _ = p.length;
          if (_ <= m) return String.fromCharCode.apply(null, p);
          for (; k < _; ) v === "array" || v === "nodebuffer" ? x.push(String.fromCharCode.apply(null, p.slice(k, Math.min(k + m, _)))) : x.push(String.fromCharCode.apply(null, p.subarray(k, Math.min(k + m, _)))), k += m;
          return x.join("");
        }, stringifyByChar: function(p) {
          for (var v = "", m = 0; m < p.length; m++) v += String.fromCharCode(p[m]);
          return v;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return i.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return false;
          }
        })(), nodebuffer: (function() {
          try {
            return i.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
          } catch {
            return false;
          }
        })() } };
        function g(p) {
          var v = 65536, m = o.getTypeOf(p), x = true;
          if (m === "uint8array" ? x = u.applyCanBeUsed.uint8array : m === "nodebuffer" && (x = u.applyCanBeUsed.nodebuffer), x) for (; 1 < v; ) try {
            return u.stringifyByChunk(p, m, v);
          } catch {
            v = Math.floor(v / 2);
          }
          return u.stringifyByChar(p);
        }
        function f(p, v) {
          for (var m = 0; m < p.length; m++) v[m] = p[m];
          return v;
        }
        o.applyFromCharCode = g;
        var w = {};
        w.string = { string: c, array: function(p) {
          return d(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return w.string.uint8array(p).buffer;
        }, uint8array: function(p) {
          return d(p, new Uint8Array(p.length));
        }, nodebuffer: function(p) {
          return d(p, s.allocBuffer(p.length));
        } }, w.array = { string: g, array: c, arraybuffer: function(p) {
          return new Uint8Array(p).buffer;
        }, uint8array: function(p) {
          return new Uint8Array(p);
        }, nodebuffer: function(p) {
          return s.newBufferFrom(p);
        } }, w.arraybuffer = { string: function(p) {
          return g(new Uint8Array(p));
        }, array: function(p) {
          return f(new Uint8Array(p), new Array(p.byteLength));
        }, arraybuffer: c, uint8array: function(p) {
          return new Uint8Array(p);
        }, nodebuffer: function(p) {
          return s.newBufferFrom(new Uint8Array(p));
        } }, w.uint8array = { string: g, array: function(p) {
          return f(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return p.buffer;
        }, uint8array: c, nodebuffer: function(p) {
          return s.newBufferFrom(p);
        } }, w.nodebuffer = { string: g, array: function(p) {
          return f(p, new Array(p.length));
        }, arraybuffer: function(p) {
          return w.nodebuffer.uint8array(p).buffer;
        }, uint8array: function(p) {
          return f(p, new Uint8Array(p.length));
        }, nodebuffer: c }, o.transformTo = function(p, v) {
          if (v = v || "", !p) return v;
          o.checkSupport(p);
          var m = o.getTypeOf(v);
          return w[m][p](v);
        }, o.resolve = function(p) {
          for (var v = p.split("/"), m = [], x = 0; x < v.length; x++) {
            var k = v[x];
            k === "." || k === "" && x !== 0 && x !== v.length - 1 || (k === ".." ? m.pop() : m.push(k));
          }
          return m.join("/");
        }, o.getTypeOf = function(p) {
          return typeof p == "string" ? "string" : Object.prototype.toString.call(p) === "[object Array]" ? "array" : i.nodebuffer && s.isBuffer(p) ? "nodebuffer" : i.uint8array && p instanceof Uint8Array ? "uint8array" : i.arraybuffer && p instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, o.checkSupport = function(p) {
          if (!i[p.toLowerCase()]) throw new Error(p + " is not supported by this platform");
        }, o.MAX_VALUE_16BITS = 65535, o.MAX_VALUE_32BITS = -1, o.pretty = function(p) {
          var v, m, x = "";
          for (m = 0; m < (p || "").length; m++) x += "\\x" + ((v = p.charCodeAt(m)) < 16 ? "0" : "") + v.toString(16).toUpperCase();
          return x;
        }, o.delay = function(p, v, m) {
          setImmediate(function() {
            p.apply(m || null, v || []);
          });
        }, o.inherits = function(p, v) {
          function m() {
          }
          m.prototype = v.prototype, p.prototype = new m();
        }, o.extend = function() {
          var p, v, m = {};
          for (p = 0; p < arguments.length; p++) for (v in arguments[p]) Object.prototype.hasOwnProperty.call(arguments[p], v) && m[v] === void 0 && (m[v] = arguments[p][v]);
          return m;
        }, o.prepareContent = function(p, v, m, x, k) {
          return l.Promise.resolve(v).then(function(_) {
            return i.blob && (_ instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(_)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(S, R) {
              var A = new FileReader();
              A.onload = function(T) {
                S(T.target.result);
              }, A.onerror = function(T) {
                R(T.target.error);
              }, A.readAsArrayBuffer(_);
            }) : _;
          }).then(function(_) {
            var S = o.getTypeOf(_);
            return S ? (S === "arraybuffer" ? _ = o.transformTo("uint8array", _) : S === "string" && (k ? _ = a.decode(_) : m && x !== true && (_ = (function(R) {
              return d(R, i.uint8array ? new Uint8Array(R.length) : new Array(R.length));
            })(_))), _) : l.Promise.reject(new Error("Can't read the data of '" + p + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(r, n, o) {
        var i = r("./reader/readerFor"), a = r("./utils"), s = r("./signature"), l = r("./zipEntry"), c = r("./support");
        function d(u) {
          this.files = [], this.loadOptions = u;
        }
        d.prototype = { checkSignature: function(u) {
          if (!this.reader.readAndCheckSignature(u)) {
            this.reader.index -= 4;
            var g = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(g) + ", expected " + a.pretty(u) + ")");
          }
        }, isSignature: function(u, g) {
          var f = this.reader.index;
          this.reader.setIndex(u);
          var w = this.reader.readString(4) === g;
          return this.reader.setIndex(f), w;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var u = this.reader.readData(this.zipCommentLength), g = c.uint8array ? "uint8array" : "array", f = a.transformTo(g, u);
          this.zipComment = this.loadOptions.decodeFileName(f);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var u, g, f, w = this.zip64EndOfCentralSize - 44; 0 < w; ) u = this.reader.readInt(2), g = this.reader.readInt(4), f = this.reader.readData(g), this.zip64ExtensibleData[u] = { id: u, length: g, value: f };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var u, g;
          for (u = 0; u < this.files.length; u++) g = this.files[u], this.reader.setIndex(g.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), g.readLocalPart(this.reader), g.handleUTF8(), g.processAttributes();
        }, readCentralDir: function() {
          var u;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (u = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(u);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var u = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (u < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(u);
          var g = u;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = true, (u = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(u), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var f = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (f += 20, f += 12 + this.zip64EndOfCentralSize);
          var w = g - f;
          if (0 < w) this.isSignature(g, s.CENTRAL_FILE_HEADER) || (this.reader.zero = w);
          else if (w < 0) throw new Error("Corrupted zip: missing " + Math.abs(w) + " bytes.");
        }, prepareReader: function(u) {
          this.reader = i(u);
        }, load: function(u) {
          this.prepareReader(u), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, n.exports = d;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(r, n, o) {
        var i = r("./reader/readerFor"), a = r("./utils"), s = r("./compressedObject"), l = r("./crc32"), c = r("./utf8"), d = r("./compressions"), u = r("./support");
        function g(f, w) {
          this.options = f, this.loadOptions = w;
        }
        g.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(f) {
          var w, p;
          if (f.skip(22), this.fileNameLength = f.readInt(2), p = f.readInt(2), this.fileName = f.readData(this.fileNameLength), f.skip(p), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((w = (function(v) {
            for (var m in d) if (Object.prototype.hasOwnProperty.call(d, m) && d[m].magic === v) return d[m];
            return null;
          })(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
          this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, w, f.readData(this.compressedSize));
        }, readCentralPart: function(f) {
          this.versionMadeBy = f.readInt(2), f.skip(2), this.bitFlag = f.readInt(2), this.compressionMethod = f.readString(2), this.date = f.readDate(), this.crc32 = f.readInt(4), this.compressedSize = f.readInt(4), this.uncompressedSize = f.readInt(4);
          var w = f.readInt(2);
          if (this.extraFieldsLength = f.readInt(2), this.fileCommentLength = f.readInt(2), this.diskNumberStart = f.readInt(2), this.internalFileAttributes = f.readInt(2), this.externalFileAttributes = f.readInt(4), this.localHeaderOffset = f.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          f.skip(w), this.readExtraFields(f), this.parseZIP64ExtraField(f), this.fileComment = f.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var f = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), f == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), f == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = true);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var f = i(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = f.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = f.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = f.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = f.readInt(4));
          }
        }, readExtraFields: function(f) {
          var w, p, v, m = f.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); f.index + 4 < m; ) w = f.readInt(2), p = f.readInt(2), v = f.readData(p), this.extraFields[w] = { id: w, length: p, value: v };
          f.setIndex(m);
        }, handleUTF8: function() {
          var f = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = c.utf8decode(this.fileName), this.fileCommentStr = c.utf8decode(this.fileComment);
          else {
            var w = this.findExtraFieldUnicodePath();
            if (w !== null) this.fileNameStr = w;
            else {
              var p = a.transformTo(f, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(p);
            }
            var v = this.findExtraFieldUnicodeComment();
            if (v !== null) this.fileCommentStr = v;
            else {
              var m = a.transformTo(f, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(m);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var f = this.extraFields[28789];
          if (f) {
            var w = i(f.value);
            return w.readInt(1) !== 1 || l(this.fileName) !== w.readInt(4) ? null : c.utf8decode(w.readData(f.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var f = this.extraFields[25461];
          if (f) {
            var w = i(f.value);
            return w.readInt(1) !== 1 || l(this.fileComment) !== w.readInt(4) ? null : c.utf8decode(w.readData(f.length - 5));
          }
          return null;
        } }, n.exports = g;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(r, n, o) {
        function i(w, p, v) {
          this.name = w, this.dir = v.dir, this.date = v.date, this.comment = v.comment, this.unixPermissions = v.unixPermissions, this.dosPermissions = v.dosPermissions, this._data = p, this._dataBinary = v.binary, this.options = { compression: v.compression, compressionOptions: v.compressionOptions };
        }
        var a = r("./stream/StreamHelper"), s = r("./stream/DataWorker"), l = r("./utf8"), c = r("./compressedObject"), d = r("./stream/GenericWorker");
        i.prototype = { internalStream: function(w) {
          var p = null, v = "string";
          try {
            if (!w) throw new Error("No output type specified.");
            var m = (v = w.toLowerCase()) === "string" || v === "text";
            v !== "binarystring" && v !== "text" || (v = "string"), p = this._decompressWorker();
            var x = !this._dataBinary;
            x && !m && (p = p.pipe(new l.Utf8EncodeWorker())), !x && m && (p = p.pipe(new l.Utf8DecodeWorker()));
          } catch (k) {
            (p = new d("error")).error(k);
          }
          return new a(p, v, "");
        }, async: function(w, p) {
          return this.internalStream(w).accumulate(p);
        }, nodeStream: function(w, p) {
          return this.internalStream(w || "nodebuffer").toNodejsStream(p);
        }, _compressWorker: function(w, p) {
          if (this._data instanceof c && this._data.compression.magic === w.magic) return this._data.getCompressedWorker();
          var v = this._decompressWorker();
          return this._dataBinary || (v = v.pipe(new l.Utf8EncodeWorker())), c.createWorkerFrom(v, w, p);
        }, _decompressWorker: function() {
          return this._data instanceof c ? this._data.getContentWorker() : this._data instanceof d ? this._data : new s(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], g = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < u.length; f++) i.prototype[u[f]] = g;
        n.exports = i;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(r, n, o) {
        (function(i) {
          var a, s, l = i.MutationObserver || i.WebKitMutationObserver;
          if (l) {
            var c = 0, d = new l(w), u = i.document.createTextNode("");
            d.observe(u, { characterData: true }), a = function() {
              u.data = c = ++c % 2;
            };
          } else if (i.setImmediate || i.MessageChannel === void 0) a = "document" in i && "onreadystatechange" in i.document.createElement("script") ? function() {
            var p = i.document.createElement("script");
            p.onreadystatechange = function() {
              w(), p.onreadystatechange = null, p.parentNode.removeChild(p), p = null;
            }, i.document.documentElement.appendChild(p);
          } : function() {
            setTimeout(w, 0);
          };
          else {
            var g = new i.MessageChannel();
            g.port1.onmessage = w, a = function() {
              g.port2.postMessage(0);
            };
          }
          var f = [];
          function w() {
            var p, v;
            s = true;
            for (var m = f.length; m; ) {
              for (v = f, f = [], p = -1; ++p < m; ) v[p]();
              m = f.length;
            }
            s = false;
          }
          n.exports = function(p) {
            f.push(p) !== 1 || s || a();
          };
        }).call(this, typeof _t < "u" ? _t : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(r, n, o) {
        var i = r("immediate");
        function a() {
        }
        var s = {}, l = ["REJECTED"], c = ["FULFILLED"], d = ["PENDING"];
        function u(m) {
          if (typeof m != "function") throw new TypeError("resolver must be a function");
          this.state = d, this.queue = [], this.outcome = void 0, m !== a && p(this, m);
        }
        function g(m, x, k) {
          this.promise = m, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof k == "function" && (this.onRejected = k, this.callRejected = this.otherCallRejected);
        }
        function f(m, x, k) {
          i(function() {
            var _;
            try {
              _ = x(k);
            } catch (S) {
              return s.reject(m, S);
            }
            _ === m ? s.reject(m, new TypeError("Cannot resolve promise with itself")) : s.resolve(m, _);
          });
        }
        function w(m) {
          var x = m && m.then;
          if (m && (typeof m == "object" || typeof m == "function") && typeof x == "function") return function() {
            x.apply(m, arguments);
          };
        }
        function p(m, x) {
          var k = false;
          function _(A) {
            k || (k = true, s.reject(m, A));
          }
          function S(A) {
            k || (k = true, s.resolve(m, A));
          }
          var R = v(function() {
            x(S, _);
          });
          R.status === "error" && _(R.value);
        }
        function v(m, x) {
          var k = {};
          try {
            k.value = m(x), k.status = "success";
          } catch (_) {
            k.status = "error", k.value = _;
          }
          return k;
        }
        (n.exports = u).prototype.finally = function(m) {
          if (typeof m != "function") return this;
          var x = this.constructor;
          return this.then(function(k) {
            return x.resolve(m()).then(function() {
              return k;
            });
          }, function(k) {
            return x.resolve(m()).then(function() {
              throw k;
            });
          });
        }, u.prototype.catch = function(m) {
          return this.then(null, m);
        }, u.prototype.then = function(m, x) {
          if (typeof m != "function" && this.state === c || typeof x != "function" && this.state === l) return this;
          var k = new this.constructor(a);
          return this.state !== d ? f(k, this.state === c ? m : x, this.outcome) : this.queue.push(new g(k, m, x)), k;
        }, g.prototype.callFulfilled = function(m) {
          s.resolve(this.promise, m);
        }, g.prototype.otherCallFulfilled = function(m) {
          f(this.promise, this.onFulfilled, m);
        }, g.prototype.callRejected = function(m) {
          s.reject(this.promise, m);
        }, g.prototype.otherCallRejected = function(m) {
          f(this.promise, this.onRejected, m);
        }, s.resolve = function(m, x) {
          var k = v(w, x);
          if (k.status === "error") return s.reject(m, k.value);
          var _ = k.value;
          if (_) p(m, _);
          else {
            m.state = c, m.outcome = x;
            for (var S = -1, R = m.queue.length; ++S < R; ) m.queue[S].callFulfilled(x);
          }
          return m;
        }, s.reject = function(m, x) {
          m.state = l, m.outcome = x;
          for (var k = -1, _ = m.queue.length; ++k < _; ) m.queue[k].callRejected(x);
          return m;
        }, u.resolve = function(m) {
          return m instanceof this ? m : s.resolve(new this(a), m);
        }, u.reject = function(m) {
          var x = new this(a);
          return s.reject(x, m);
        }, u.all = function(m) {
          var x = this;
          if (Object.prototype.toString.call(m) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = m.length, _ = false;
          if (!k) return this.resolve([]);
          for (var S = new Array(k), R = 0, A = -1, T = new this(a); ++A < k; ) D(m[A], A);
          return T;
          function D(U, M) {
            x.resolve(U).then(function(C) {
              S[M] = C, ++R !== k || _ || (_ = true, s.resolve(T, S));
            }, function(C) {
              _ || (_ = true, s.reject(T, C));
            });
          }
        }, u.race = function(m) {
          var x = this;
          if (Object.prototype.toString.call(m) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var k = m.length, _ = false;
          if (!k) return this.resolve([]);
          for (var S = -1, R = new this(a); ++S < k; ) A = m[S], x.resolve(A).then(function(T) {
            _ || (_ = true, s.resolve(R, T));
          }, function(T) {
            _ || (_ = true, s.reject(R, T));
          });
          var A;
          return R;
        };
      }, { immediate: 36 }], 38: [function(r, n, o) {
        var i = {};
        (0, r("./lib/utils/common").assign)(i, r("./lib/deflate"), r("./lib/inflate"), r("./lib/zlib/constants")), n.exports = i;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(r, n, o) {
        var i = r("./zlib/deflate"), a = r("./utils/common"), s = r("./utils/strings"), l = r("./zlib/messages"), c = r("./zlib/zstream"), d = Object.prototype.toString, u = 0, g = -1, f = 0, w = 8;
        function p(m) {
          if (!(this instanceof p)) return new p(m);
          this.options = a.assign({ level: g, method: w, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: f, to: "" }, m || {});
          var x = this.options;
          x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new c(), this.strm.avail_out = 0;
          var k = i.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
          if (k !== u) throw new Error(l[k]);
          if (x.header && i.deflateSetHeader(this.strm, x.header), x.dictionary) {
            var _;
            if (_ = typeof x.dictionary == "string" ? s.string2buf(x.dictionary) : d.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (k = i.deflateSetDictionary(this.strm, _)) !== u) throw new Error(l[k]);
            this._dict_set = true;
          }
        }
        function v(m, x) {
          var k = new p(x);
          if (k.push(m, true), k.err) throw k.msg || l[k.err];
          return k.result;
        }
        p.prototype.push = function(m, x) {
          var k, _, S = this.strm, R = this.options.chunkSize;
          if (this.ended) return false;
          _ = x === ~~x ? x : x === true ? 4 : 0, typeof m == "string" ? S.input = s.string2buf(m) : d.call(m) === "[object ArrayBuffer]" ? S.input = new Uint8Array(m) : S.input = m, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new a.Buf8(R), S.next_out = 0, S.avail_out = R), (k = i.deflate(S, _)) !== 1 && k !== u) return this.onEnd(k), !(this.ended = true);
            S.avail_out !== 0 && (S.avail_in !== 0 || _ !== 4 && _ !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(a.shrinkBuf(S.output, S.next_out))) : this.onData(a.shrinkBuf(S.output, S.next_out)));
          } while ((0 < S.avail_in || S.avail_out === 0) && k !== 1);
          return _ === 4 ? (k = i.deflateEnd(this.strm), this.onEnd(k), this.ended = true, k === u) : _ !== 2 || (this.onEnd(u), !(S.avail_out = 0));
        }, p.prototype.onData = function(m) {
          this.chunks.push(m);
        }, p.prototype.onEnd = function(m) {
          m === u && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = m, this.msg = this.strm.msg;
        }, o.Deflate = p, o.deflate = v, o.deflateRaw = function(m, x) {
          return (x = x || {}).raw = true, v(m, x);
        }, o.gzip = function(m, x) {
          return (x = x || {}).gzip = true, v(m, x);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(r, n, o) {
        var i = r("./zlib/inflate"), a = r("./utils/common"), s = r("./utils/strings"), l = r("./zlib/constants"), c = r("./zlib/messages"), d = r("./zlib/zstream"), u = r("./zlib/gzheader"), g = Object.prototype.toString;
        function f(p) {
          if (!(this instanceof f)) return new f(p);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, p || {});
          var v = this.options;
          v.raw && 0 <= v.windowBits && v.windowBits < 16 && (v.windowBits = -v.windowBits, v.windowBits === 0 && (v.windowBits = -15)), !(0 <= v.windowBits && v.windowBits < 16) || p && p.windowBits || (v.windowBits += 32), 15 < v.windowBits && v.windowBits < 48 && (15 & v.windowBits) == 0 && (v.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new d(), this.strm.avail_out = 0;
          var m = i.inflateInit2(this.strm, v.windowBits);
          if (m !== l.Z_OK) throw new Error(c[m]);
          this.header = new u(), i.inflateGetHeader(this.strm, this.header);
        }
        function w(p, v) {
          var m = new f(v);
          if (m.push(p, true), m.err) throw m.msg || c[m.err];
          return m.result;
        }
        f.prototype.push = function(p, v) {
          var m, x, k, _, S, R, A = this.strm, T = this.options.chunkSize, D = this.options.dictionary, U = false;
          if (this.ended) return false;
          x = v === ~~v ? v : v === true ? l.Z_FINISH : l.Z_NO_FLUSH, typeof p == "string" ? A.input = s.binstring2buf(p) : g.call(p) === "[object ArrayBuffer]" ? A.input = new Uint8Array(p) : A.input = p, A.next_in = 0, A.avail_in = A.input.length;
          do {
            if (A.avail_out === 0 && (A.output = new a.Buf8(T), A.next_out = 0, A.avail_out = T), (m = i.inflate(A, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && D && (R = typeof D == "string" ? s.string2buf(D) : g.call(D) === "[object ArrayBuffer]" ? new Uint8Array(D) : D, m = i.inflateSetDictionary(this.strm, R)), m === l.Z_BUF_ERROR && U === true && (m = l.Z_OK, U = false), m !== l.Z_STREAM_END && m !== l.Z_OK) return this.onEnd(m), !(this.ended = true);
            A.next_out && (A.avail_out !== 0 && m !== l.Z_STREAM_END && (A.avail_in !== 0 || x !== l.Z_FINISH && x !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (k = s.utf8border(A.output, A.next_out), _ = A.next_out - k, S = s.buf2string(A.output, k), A.next_out = _, A.avail_out = T - _, _ && a.arraySet(A.output, A.output, k, _, 0), this.onData(S)) : this.onData(a.shrinkBuf(A.output, A.next_out)))), A.avail_in === 0 && A.avail_out === 0 && (U = true);
          } while ((0 < A.avail_in || A.avail_out === 0) && m !== l.Z_STREAM_END);
          return m === l.Z_STREAM_END && (x = l.Z_FINISH), x === l.Z_FINISH ? (m = i.inflateEnd(this.strm), this.onEnd(m), this.ended = true, m === l.Z_OK) : x !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(A.avail_out = 0));
        }, f.prototype.onData = function(p) {
          this.chunks.push(p);
        }, f.prototype.onEnd = function(p) {
          p === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = p, this.msg = this.strm.msg;
        }, o.Inflate = f, o.inflate = w, o.inflateRaw = function(p, v) {
          return (v = v || {}).raw = true, w(p, v);
        }, o.ungzip = w;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(r, n, o) {
        var i = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        o.assign = function(l) {
          for (var c = Array.prototype.slice.call(arguments, 1); c.length; ) {
            var d = c.shift();
            if (d) {
              if (typeof d != "object") throw new TypeError(d + "must be non-object");
              for (var u in d) d.hasOwnProperty(u) && (l[u] = d[u]);
            }
          }
          return l;
        }, o.shrinkBuf = function(l, c) {
          return l.length === c ? l : l.subarray ? l.subarray(0, c) : (l.length = c, l);
        };
        var a = { arraySet: function(l, c, d, u, g) {
          if (c.subarray && l.subarray) l.set(c.subarray(d, d + u), g);
          else for (var f = 0; f < u; f++) l[g + f] = c[d + f];
        }, flattenChunks: function(l) {
          var c, d, u, g, f, w;
          for (c = u = 0, d = l.length; c < d; c++) u += l[c].length;
          for (w = new Uint8Array(u), c = g = 0, d = l.length; c < d; c++) f = l[c], w.set(f, g), g += f.length;
          return w;
        } }, s = { arraySet: function(l, c, d, u, g) {
          for (var f = 0; f < u; f++) l[g + f] = c[d + f];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        o.setTyped = function(l) {
          l ? (o.Buf8 = Uint8Array, o.Buf16 = Uint16Array, o.Buf32 = Int32Array, o.assign(o, a)) : (o.Buf8 = Array, o.Buf16 = Array, o.Buf32 = Array, o.assign(o, s));
        }, o.setTyped(i);
      }, {}], 42: [function(r, n, o) {
        var i = r("./common"), a = true, s = true;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = false;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          s = false;
        }
        for (var l = new i.Buf8(256), c = 0; c < 256; c++) l[c] = 252 <= c ? 6 : 248 <= c ? 5 : 240 <= c ? 4 : 224 <= c ? 3 : 192 <= c ? 2 : 1;
        function d(u, g) {
          if (g < 65537 && (u.subarray && s || !u.subarray && a)) return String.fromCharCode.apply(null, i.shrinkBuf(u, g));
          for (var f = "", w = 0; w < g; w++) f += String.fromCharCode(u[w]);
          return f;
        }
        l[254] = l[254] = 1, o.string2buf = function(u) {
          var g, f, w, p, v, m = u.length, x = 0;
          for (p = 0; p < m; p++) (64512 & (f = u.charCodeAt(p))) == 55296 && p + 1 < m && (64512 & (w = u.charCodeAt(p + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (w - 56320), p++), x += f < 128 ? 1 : f < 2048 ? 2 : f < 65536 ? 3 : 4;
          for (g = new i.Buf8(x), p = v = 0; v < x; p++) (64512 & (f = u.charCodeAt(p))) == 55296 && p + 1 < m && (64512 & (w = u.charCodeAt(p + 1))) == 56320 && (f = 65536 + (f - 55296 << 10) + (w - 56320), p++), f < 128 ? g[v++] = f : (f < 2048 ? g[v++] = 192 | f >>> 6 : (f < 65536 ? g[v++] = 224 | f >>> 12 : (g[v++] = 240 | f >>> 18, g[v++] = 128 | f >>> 12 & 63), g[v++] = 128 | f >>> 6 & 63), g[v++] = 128 | 63 & f);
          return g;
        }, o.buf2binstring = function(u) {
          return d(u, u.length);
        }, o.binstring2buf = function(u) {
          for (var g = new i.Buf8(u.length), f = 0, w = g.length; f < w; f++) g[f] = u.charCodeAt(f);
          return g;
        }, o.buf2string = function(u, g) {
          var f, w, p, v, m = g || u.length, x = new Array(2 * m);
          for (f = w = 0; f < m; ) if ((p = u[f++]) < 128) x[w++] = p;
          else if (4 < (v = l[p])) x[w++] = 65533, f += v - 1;
          else {
            for (p &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && f < m; ) p = p << 6 | 63 & u[f++], v--;
            1 < v ? x[w++] = 65533 : p < 65536 ? x[w++] = p : (p -= 65536, x[w++] = 55296 | p >> 10 & 1023, x[w++] = 56320 | 1023 & p);
          }
          return d(x, w);
        }, o.utf8border = function(u, g) {
          var f;
          for ((g = g || u.length) > u.length && (g = u.length), f = g - 1; 0 <= f && (192 & u[f]) == 128; ) f--;
          return f < 0 || f === 0 ? g : f + l[u[f]] > g ? f : g;
        };
      }, { "./common": 41 }], 43: [function(r, n, o) {
        n.exports = function(i, a, s, l) {
          for (var c = 65535 & i | 0, d = i >>> 16 & 65535 | 0, u = 0; s !== 0; ) {
            for (s -= u = 2e3 < s ? 2e3 : s; d = d + (c = c + a[l++] | 0) | 0, --u; ) ;
            c %= 65521, d %= 65521;
          }
          return c | d << 16 | 0;
        };
      }, {}], 44: [function(r, n, o) {
        n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(r, n, o) {
        var i = (function() {
          for (var a, s = [], l = 0; l < 256; l++) {
            a = l;
            for (var c = 0; c < 8; c++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            s[l] = a;
          }
          return s;
        })();
        n.exports = function(a, s, l, c) {
          var d = i, u = c + l;
          a ^= -1;
          for (var g = c; g < u; g++) a = a >>> 8 ^ d[255 & (a ^ s[g])];
          return -1 ^ a;
        };
      }, {}], 46: [function(r, n, o) {
        var i, a = r("../utils/common"), s = r("./trees"), l = r("./adler32"), c = r("./crc32"), d = r("./messages"), u = 0, g = 4, f = 0, w = -2, p = -1, v = 4, m = 2, x = 8, k = 9, _ = 286, S = 30, R = 19, A = 2 * _ + 1, T = 15, D = 3, U = 258, M = U + D + 1, C = 42, P = 113, y = 1, F = 2, te = 3, W = 4;
        function $(b, K) {
          return b.msg = d[K], K;
        }
        function V(b) {
          return (b << 1) - (4 < b ? 9 : 0);
        }
        function ne(b) {
          for (var K = b.length; 0 <= --K; ) b[K] = 0;
        }
        function z2(b) {
          var K = b.state, H = K.pending;
          H > b.avail_out && (H = b.avail_out), H !== 0 && (a.arraySet(b.output, K.pending_buf, K.pending_out, H, b.next_out), b.next_out += H, K.pending_out += H, b.total_out += H, b.avail_out -= H, K.pending -= H, K.pending === 0 && (K.pending_out = 0));
        }
        function O(b, K) {
          s._tr_flush_block(b, 0 <= b.block_start ? b.block_start : -1, b.strstart - b.block_start, K), b.block_start = b.strstart, z2(b.strm);
        }
        function Q(b, K) {
          b.pending_buf[b.pending++] = K;
        }
        function G(b, K) {
          b.pending_buf[b.pending++] = K >>> 8 & 255, b.pending_buf[b.pending++] = 255 & K;
        }
        function J(b, K) {
          var H, j, N = b.max_chain_length, L = b.strstart, Y = b.prev_length, ee = b.nice_match, B = b.strstart > b.w_size - M ? b.strstart - (b.w_size - M) : 0, re = b.window, le = b.w_mask, ie = b.prev, I = b.strstart + U, Z = re[L + Y - 1], X2 = re[L + Y];
          b.prev_length >= b.good_match && (N >>= 2), ee > b.lookahead && (ee = b.lookahead);
          do
            if (re[(H = K) + Y] === X2 && re[H + Y - 1] === Z && re[H] === re[L] && re[++H] === re[L + 1]) {
              L += 2, H++;
              do
                ;
              while (re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && re[++L] === re[++H] && L < I);
              if (j = U - (I - L), L = I - U, Y < j) {
                if (b.match_start = K, ee <= (Y = j)) break;
                Z = re[L + Y - 1], X2 = re[L + Y];
              }
            }
          while ((K = ie[K & le]) > B && --N != 0);
          return Y <= b.lookahead ? Y : b.lookahead;
        }
        function de(b) {
          var K, H, j, N, L, Y, ee, B, re, le, ie = b.w_size;
          do {
            if (N = b.window_size - b.lookahead - b.strstart, b.strstart >= ie + (ie - M)) {
              for (a.arraySet(b.window, b.window, ie, ie, 0), b.match_start -= ie, b.strstart -= ie, b.block_start -= ie, K = H = b.hash_size; j = b.head[--K], b.head[K] = ie <= j ? j - ie : 0, --H; ) ;
              for (K = H = ie; j = b.prev[--K], b.prev[K] = ie <= j ? j - ie : 0, --H; ) ;
              N += ie;
            }
            if (b.strm.avail_in === 0) break;
            if (Y = b.strm, ee = b.window, B = b.strstart + b.lookahead, re = N, le = void 0, le = Y.avail_in, re < le && (le = re), H = le === 0 ? 0 : (Y.avail_in -= le, a.arraySet(ee, Y.input, Y.next_in, le, B), Y.state.wrap === 1 ? Y.adler = l(Y.adler, ee, le, B) : Y.state.wrap === 2 && (Y.adler = c(Y.adler, ee, le, B)), Y.next_in += le, Y.total_in += le, le), b.lookahead += H, b.lookahead + b.insert >= D) for (L = b.strstart - b.insert, b.ins_h = b.window[L], b.ins_h = (b.ins_h << b.hash_shift ^ b.window[L + 1]) & b.hash_mask; b.insert && (b.ins_h = (b.ins_h << b.hash_shift ^ b.window[L + D - 1]) & b.hash_mask, b.prev[L & b.w_mask] = b.head[b.ins_h], b.head[b.ins_h] = L, L++, b.insert--, !(b.lookahead + b.insert < D)); ) ;
          } while (b.lookahead < M && b.strm.avail_in !== 0);
        }
        function q(b, K) {
          for (var H, j; ; ) {
            if (b.lookahead < M) {
              if (de(b), b.lookahead < M && K === u) return y;
              if (b.lookahead === 0) break;
            }
            if (H = 0, b.lookahead >= D && (b.ins_h = (b.ins_h << b.hash_shift ^ b.window[b.strstart + D - 1]) & b.hash_mask, H = b.prev[b.strstart & b.w_mask] = b.head[b.ins_h], b.head[b.ins_h] = b.strstart), H !== 0 && b.strstart - H <= b.w_size - M && (b.match_length = J(b, H)), b.match_length >= D) if (j = s._tr_tally(b, b.strstart - b.match_start, b.match_length - D), b.lookahead -= b.match_length, b.match_length <= b.max_lazy_match && b.lookahead >= D) {
              for (b.match_length--; b.strstart++, b.ins_h = (b.ins_h << b.hash_shift ^ b.window[b.strstart + D - 1]) & b.hash_mask, H = b.prev[b.strstart & b.w_mask] = b.head[b.ins_h], b.head[b.ins_h] = b.strstart, --b.match_length != 0; ) ;
              b.strstart++;
            } else b.strstart += b.match_length, b.match_length = 0, b.ins_h = b.window[b.strstart], b.ins_h = (b.ins_h << b.hash_shift ^ b.window[b.strstart + 1]) & b.hash_mask;
            else j = s._tr_tally(b, 0, b.window[b.strstart]), b.lookahead--, b.strstart++;
            if (j && (O(b, false), b.strm.avail_out === 0)) return y;
          }
          return b.insert = b.strstart < D - 1 ? b.strstart : D - 1, K === g ? (O(b, true), b.strm.avail_out === 0 ? te : W) : b.last_lit && (O(b, false), b.strm.avail_out === 0) ? y : F;
        }
        function ae(b, K) {
          for (var H, j, N; ; ) {
            if (b.lookahead < M) {
              if (de(b), b.lookahead < M && K === u) return y;
              if (b.lookahead === 0) break;
            }
            if (H = 0, b.lookahead >= D && (b.ins_h = (b.ins_h << b.hash_shift ^ b.window[b.strstart + D - 1]) & b.hash_mask, H = b.prev[b.strstart & b.w_mask] = b.head[b.ins_h], b.head[b.ins_h] = b.strstart), b.prev_length = b.match_length, b.prev_match = b.match_start, b.match_length = D - 1, H !== 0 && b.prev_length < b.max_lazy_match && b.strstart - H <= b.w_size - M && (b.match_length = J(b, H), b.match_length <= 5 && (b.strategy === 1 || b.match_length === D && 4096 < b.strstart - b.match_start) && (b.match_length = D - 1)), b.prev_length >= D && b.match_length <= b.prev_length) {
              for (N = b.strstart + b.lookahead - D, j = s._tr_tally(b, b.strstart - 1 - b.prev_match, b.prev_length - D), b.lookahead -= b.prev_length - 1, b.prev_length -= 2; ++b.strstart <= N && (b.ins_h = (b.ins_h << b.hash_shift ^ b.window[b.strstart + D - 1]) & b.hash_mask, H = b.prev[b.strstart & b.w_mask] = b.head[b.ins_h], b.head[b.ins_h] = b.strstart), --b.prev_length != 0; ) ;
              if (b.match_available = 0, b.match_length = D - 1, b.strstart++, j && (O(b, false), b.strm.avail_out === 0)) return y;
            } else if (b.match_available) {
              if ((j = s._tr_tally(b, 0, b.window[b.strstart - 1])) && O(b, false), b.strstart++, b.lookahead--, b.strm.avail_out === 0) return y;
            } else b.match_available = 1, b.strstart++, b.lookahead--;
          }
          return b.match_available && (j = s._tr_tally(b, 0, b.window[b.strstart - 1]), b.match_available = 0), b.insert = b.strstart < D - 1 ? b.strstart : D - 1, K === g ? (O(b, true), b.strm.avail_out === 0 ? te : W) : b.last_lit && (O(b, false), b.strm.avail_out === 0) ? y : F;
        }
        function ce(b, K, H, j, N) {
          this.good_length = b, this.max_lazy = K, this.nice_length = H, this.max_chain = j, this.func = N;
        }
        function oe() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * A), this.dyn_dtree = new a.Buf16(2 * (2 * S + 1)), this.bl_tree = new a.Buf16(2 * (2 * R + 1)), ne(this.dyn_ltree), ne(this.dyn_dtree), ne(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(T + 1), this.heap = new a.Buf16(2 * _ + 1), ne(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * _ + 1), ne(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ue(b) {
          var K;
          return b && b.state ? (b.total_in = b.total_out = 0, b.data_type = m, (K = b.state).pending = 0, K.pending_out = 0, K.wrap < 0 && (K.wrap = -K.wrap), K.status = K.wrap ? C : P, b.adler = K.wrap === 2 ? 0 : 1, K.last_flush = u, s._tr_init(K), f) : $(b, w);
        }
        function he(b) {
          var K = ue(b);
          return K === f && (function(H) {
            H.window_size = 2 * H.w_size, ne(H.head), H.max_lazy_match = i[H.level].max_lazy, H.good_match = i[H.level].good_length, H.nice_match = i[H.level].nice_length, H.max_chain_length = i[H.level].max_chain, H.strstart = 0, H.block_start = 0, H.lookahead = 0, H.insert = 0, H.match_length = H.prev_length = D - 1, H.match_available = 0, H.ins_h = 0;
          })(b.state), K;
        }
        function ye(b, K, H, j, N, L) {
          if (!b) return w;
          var Y = 1;
          if (K === p && (K = 6), j < 0 ? (Y = 0, j = -j) : 15 < j && (Y = 2, j -= 16), N < 1 || k < N || H !== x || j < 8 || 15 < j || K < 0 || 9 < K || L < 0 || v < L) return $(b, w);
          j === 8 && (j = 9);
          var ee = new oe();
          return (b.state = ee).strm = b, ee.wrap = Y, ee.gzhead = null, ee.w_bits = j, ee.w_size = 1 << ee.w_bits, ee.w_mask = ee.w_size - 1, ee.hash_bits = N + 7, ee.hash_size = 1 << ee.hash_bits, ee.hash_mask = ee.hash_size - 1, ee.hash_shift = ~~((ee.hash_bits + D - 1) / D), ee.window = new a.Buf8(2 * ee.w_size), ee.head = new a.Buf16(ee.hash_size), ee.prev = new a.Buf16(ee.w_size), ee.lit_bufsize = 1 << N + 6, ee.pending_buf_size = 4 * ee.lit_bufsize, ee.pending_buf = new a.Buf8(ee.pending_buf_size), ee.d_buf = 1 * ee.lit_bufsize, ee.l_buf = 3 * ee.lit_bufsize, ee.level = K, ee.strategy = L, ee.method = H, he(b);
        }
        i = [new ce(0, 0, 0, 0, function(b, K) {
          var H = 65535;
          for (H > b.pending_buf_size - 5 && (H = b.pending_buf_size - 5); ; ) {
            if (b.lookahead <= 1) {
              if (de(b), b.lookahead === 0 && K === u) return y;
              if (b.lookahead === 0) break;
            }
            b.strstart += b.lookahead, b.lookahead = 0;
            var j = b.block_start + H;
            if ((b.strstart === 0 || b.strstart >= j) && (b.lookahead = b.strstart - j, b.strstart = j, O(b, false), b.strm.avail_out === 0) || b.strstart - b.block_start >= b.w_size - M && (O(b, false), b.strm.avail_out === 0)) return y;
          }
          return b.insert = 0, K === g ? (O(b, true), b.strm.avail_out === 0 ? te : W) : (b.strstart > b.block_start && (O(b, false), b.strm.avail_out), y);
        }), new ce(4, 4, 8, 4, q), new ce(4, 5, 16, 8, q), new ce(4, 6, 32, 32, q), new ce(4, 4, 16, 16, ae), new ce(8, 16, 32, 32, ae), new ce(8, 16, 128, 128, ae), new ce(8, 32, 128, 256, ae), new ce(32, 128, 258, 1024, ae), new ce(32, 258, 258, 4096, ae)], o.deflateInit = function(b, K) {
          return ye(b, K, x, 15, 8, 0);
        }, o.deflateInit2 = ye, o.deflateReset = he, o.deflateResetKeep = ue, o.deflateSetHeader = function(b, K) {
          return b && b.state ? b.state.wrap !== 2 ? w : (b.state.gzhead = K, f) : w;
        }, o.deflate = function(b, K) {
          var H, j, N, L;
          if (!b || !b.state || 5 < K || K < 0) return b ? $(b, w) : w;
          if (j = b.state, !b.output || !b.input && b.avail_in !== 0 || j.status === 666 && K !== g) return $(b, b.avail_out === 0 ? -5 : w);
          if (j.strm = b, H = j.last_flush, j.last_flush = K, j.status === C) if (j.wrap === 2) b.adler = 0, Q(j, 31), Q(j, 139), Q(j, 8), j.gzhead ? (Q(j, (j.gzhead.text ? 1 : 0) + (j.gzhead.hcrc ? 2 : 0) + (j.gzhead.extra ? 4 : 0) + (j.gzhead.name ? 8 : 0) + (j.gzhead.comment ? 16 : 0)), Q(j, 255 & j.gzhead.time), Q(j, j.gzhead.time >> 8 & 255), Q(j, j.gzhead.time >> 16 & 255), Q(j, j.gzhead.time >> 24 & 255), Q(j, j.level === 9 ? 2 : 2 <= j.strategy || j.level < 2 ? 4 : 0), Q(j, 255 & j.gzhead.os), j.gzhead.extra && j.gzhead.extra.length && (Q(j, 255 & j.gzhead.extra.length), Q(j, j.gzhead.extra.length >> 8 & 255)), j.gzhead.hcrc && (b.adler = c(b.adler, j.pending_buf, j.pending, 0)), j.gzindex = 0, j.status = 69) : (Q(j, 0), Q(j, 0), Q(j, 0), Q(j, 0), Q(j, 0), Q(j, j.level === 9 ? 2 : 2 <= j.strategy || j.level < 2 ? 4 : 0), Q(j, 3), j.status = P);
          else {
            var Y = x + (j.w_bits - 8 << 4) << 8;
            Y |= (2 <= j.strategy || j.level < 2 ? 0 : j.level < 6 ? 1 : j.level === 6 ? 2 : 3) << 6, j.strstart !== 0 && (Y |= 32), Y += 31 - Y % 31, j.status = P, G(j, Y), j.strstart !== 0 && (G(j, b.adler >>> 16), G(j, 65535 & b.adler)), b.adler = 1;
          }
          if (j.status === 69) if (j.gzhead.extra) {
            for (N = j.pending; j.gzindex < (65535 & j.gzhead.extra.length) && (j.pending !== j.pending_buf_size || (j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), z2(b), N = j.pending, j.pending !== j.pending_buf_size)); ) Q(j, 255 & j.gzhead.extra[j.gzindex]), j.gzindex++;
            j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), j.gzindex === j.gzhead.extra.length && (j.gzindex = 0, j.status = 73);
          } else j.status = 73;
          if (j.status === 73) if (j.gzhead.name) {
            N = j.pending;
            do {
              if (j.pending === j.pending_buf_size && (j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), z2(b), N = j.pending, j.pending === j.pending_buf_size)) {
                L = 1;
                break;
              }
              L = j.gzindex < j.gzhead.name.length ? 255 & j.gzhead.name.charCodeAt(j.gzindex++) : 0, Q(j, L);
            } while (L !== 0);
            j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), L === 0 && (j.gzindex = 0, j.status = 91);
          } else j.status = 91;
          if (j.status === 91) if (j.gzhead.comment) {
            N = j.pending;
            do {
              if (j.pending === j.pending_buf_size && (j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), z2(b), N = j.pending, j.pending === j.pending_buf_size)) {
                L = 1;
                break;
              }
              L = j.gzindex < j.gzhead.comment.length ? 255 & j.gzhead.comment.charCodeAt(j.gzindex++) : 0, Q(j, L);
            } while (L !== 0);
            j.gzhead.hcrc && j.pending > N && (b.adler = c(b.adler, j.pending_buf, j.pending - N, N)), L === 0 && (j.status = 103);
          } else j.status = 103;
          if (j.status === 103 && (j.gzhead.hcrc ? (j.pending + 2 > j.pending_buf_size && z2(b), j.pending + 2 <= j.pending_buf_size && (Q(j, 255 & b.adler), Q(j, b.adler >> 8 & 255), b.adler = 0, j.status = P)) : j.status = P), j.pending !== 0) {
            if (z2(b), b.avail_out === 0) return j.last_flush = -1, f;
          } else if (b.avail_in === 0 && V(K) <= V(H) && K !== g) return $(b, -5);
          if (j.status === 666 && b.avail_in !== 0) return $(b, -5);
          if (b.avail_in !== 0 || j.lookahead !== 0 || K !== u && j.status !== 666) {
            var ee = j.strategy === 2 ? (function(B, re) {
              for (var le; ; ) {
                if (B.lookahead === 0 && (de(B), B.lookahead === 0)) {
                  if (re === u) return y;
                  break;
                }
                if (B.match_length = 0, le = s._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++, le && (O(B, false), B.strm.avail_out === 0)) return y;
              }
              return B.insert = 0, re === g ? (O(B, true), B.strm.avail_out === 0 ? te : W) : B.last_lit && (O(B, false), B.strm.avail_out === 0) ? y : F;
            })(j, K) : j.strategy === 3 ? (function(B, re) {
              for (var le, ie, I, Z, X2 = B.window; ; ) {
                if (B.lookahead <= U) {
                  if (de(B), B.lookahead <= U && re === u) return y;
                  if (B.lookahead === 0) break;
                }
                if (B.match_length = 0, B.lookahead >= D && 0 < B.strstart && (ie = X2[I = B.strstart - 1]) === X2[++I] && ie === X2[++I] && ie === X2[++I]) {
                  Z = B.strstart + U;
                  do
                    ;
                  while (ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && ie === X2[++I] && I < Z);
                  B.match_length = U - (Z - I), B.match_length > B.lookahead && (B.match_length = B.lookahead);
                }
                if (B.match_length >= D ? (le = s._tr_tally(B, 1, B.match_length - D), B.lookahead -= B.match_length, B.strstart += B.match_length, B.match_length = 0) : (le = s._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++), le && (O(B, false), B.strm.avail_out === 0)) return y;
              }
              return B.insert = 0, re === g ? (O(B, true), B.strm.avail_out === 0 ? te : W) : B.last_lit && (O(B, false), B.strm.avail_out === 0) ? y : F;
            })(j, K) : i[j.level].func(j, K);
            if (ee !== te && ee !== W || (j.status = 666), ee === y || ee === te) return b.avail_out === 0 && (j.last_flush = -1), f;
            if (ee === F && (K === 1 ? s._tr_align(j) : K !== 5 && (s._tr_stored_block(j, 0, 0, false), K === 3 && (ne(j.head), j.lookahead === 0 && (j.strstart = 0, j.block_start = 0, j.insert = 0))), z2(b), b.avail_out === 0)) return j.last_flush = -1, f;
          }
          return K !== g ? f : j.wrap <= 0 ? 1 : (j.wrap === 2 ? (Q(j, 255 & b.adler), Q(j, b.adler >> 8 & 255), Q(j, b.adler >> 16 & 255), Q(j, b.adler >> 24 & 255), Q(j, 255 & b.total_in), Q(j, b.total_in >> 8 & 255), Q(j, b.total_in >> 16 & 255), Q(j, b.total_in >> 24 & 255)) : (G(j, b.adler >>> 16), G(j, 65535 & b.adler)), z2(b), 0 < j.wrap && (j.wrap = -j.wrap), j.pending !== 0 ? f : 1);
        }, o.deflateEnd = function(b) {
          var K;
          return b && b.state ? (K = b.state.status) !== C && K !== 69 && K !== 73 && K !== 91 && K !== 103 && K !== P && K !== 666 ? $(b, w) : (b.state = null, K === P ? $(b, -3) : f) : w;
        }, o.deflateSetDictionary = function(b, K) {
          var H, j, N, L, Y, ee, B, re, le = K.length;
          if (!b || !b.state || (L = (H = b.state).wrap) === 2 || L === 1 && H.status !== C || H.lookahead) return w;
          for (L === 1 && (b.adler = l(b.adler, K, le, 0)), H.wrap = 0, le >= H.w_size && (L === 0 && (ne(H.head), H.strstart = 0, H.block_start = 0, H.insert = 0), re = new a.Buf8(H.w_size), a.arraySet(re, K, le - H.w_size, H.w_size, 0), K = re, le = H.w_size), Y = b.avail_in, ee = b.next_in, B = b.input, b.avail_in = le, b.next_in = 0, b.input = K, de(H); H.lookahead >= D; ) {
            for (j = H.strstart, N = H.lookahead - (D - 1); H.ins_h = (H.ins_h << H.hash_shift ^ H.window[j + D - 1]) & H.hash_mask, H.prev[j & H.w_mask] = H.head[H.ins_h], H.head[H.ins_h] = j, j++, --N; ) ;
            H.strstart = j, H.lookahead = D - 1, de(H);
          }
          return H.strstart += H.lookahead, H.block_start = H.strstart, H.insert = H.lookahead, H.lookahead = 0, H.match_length = H.prev_length = D - 1, H.match_available = 0, b.next_in = ee, b.input = B, b.avail_in = Y, H.wrap = L, f;
        }, o.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(r, n, o) {
        n.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
        };
      }, {}], 48: [function(r, n, o) {
        n.exports = function(i, a) {
          var s, l, c, d, u, g, f, w, p, v, m, x, k, _, S, R, A, T, D, U, M, C, P, y, F;
          s = i.state, l = i.next_in, y = i.input, c = l + (i.avail_in - 5), d = i.next_out, F = i.output, u = d - (a - i.avail_out), g = d + (i.avail_out - 257), f = s.dmax, w = s.wsize, p = s.whave, v = s.wnext, m = s.window, x = s.hold, k = s.bits, _ = s.lencode, S = s.distcode, R = (1 << s.lenbits) - 1, A = (1 << s.distbits) - 1;
          e: do {
            k < 15 && (x += y[l++] << k, k += 8, x += y[l++] << k, k += 8), T = _[x & R];
            t: for (; ; ) {
              if (x >>>= D = T >>> 24, k -= D, (D = T >>> 16 & 255) === 0) F[d++] = 65535 & T;
              else {
                if (!(16 & D)) {
                  if ((64 & D) == 0) {
                    T = _[(65535 & T) + (x & (1 << D) - 1)];
                    continue t;
                  }
                  if (32 & D) {
                    s.mode = 12;
                    break e;
                  }
                  i.msg = "invalid literal/length code", s.mode = 30;
                  break e;
                }
                U = 65535 & T, (D &= 15) && (k < D && (x += y[l++] << k, k += 8), U += x & (1 << D) - 1, x >>>= D, k -= D), k < 15 && (x += y[l++] << k, k += 8, x += y[l++] << k, k += 8), T = S[x & A];
                r: for (; ; ) {
                  if (x >>>= D = T >>> 24, k -= D, !(16 & (D = T >>> 16 & 255))) {
                    if ((64 & D) == 0) {
                      T = S[(65535 & T) + (x & (1 << D) - 1)];
                      continue r;
                    }
                    i.msg = "invalid distance code", s.mode = 30;
                    break e;
                  }
                  if (M = 65535 & T, k < (D &= 15) && (x += y[l++] << k, (k += 8) < D && (x += y[l++] << k, k += 8)), f < (M += x & (1 << D) - 1)) {
                    i.msg = "invalid distance too far back", s.mode = 30;
                    break e;
                  }
                  if (x >>>= D, k -= D, (D = d - u) < M) {
                    if (p < (D = M - D) && s.sane) {
                      i.msg = "invalid distance too far back", s.mode = 30;
                      break e;
                    }
                    if (P = m, (C = 0) === v) {
                      if (C += w - D, D < U) {
                        for (U -= D; F[d++] = m[C++], --D; ) ;
                        C = d - M, P = F;
                      }
                    } else if (v < D) {
                      if (C += w + v - D, (D -= v) < U) {
                        for (U -= D; F[d++] = m[C++], --D; ) ;
                        if (C = 0, v < U) {
                          for (U -= D = v; F[d++] = m[C++], --D; ) ;
                          C = d - M, P = F;
                        }
                      }
                    } else if (C += v - D, D < U) {
                      for (U -= D; F[d++] = m[C++], --D; ) ;
                      C = d - M, P = F;
                    }
                    for (; 2 < U; ) F[d++] = P[C++], F[d++] = P[C++], F[d++] = P[C++], U -= 3;
                    U && (F[d++] = P[C++], 1 < U && (F[d++] = P[C++]));
                  } else {
                    for (C = d - M; F[d++] = F[C++], F[d++] = F[C++], F[d++] = F[C++], 2 < (U -= 3); ) ;
                    U && (F[d++] = F[C++], 1 < U && (F[d++] = F[C++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < c && d < g);
          l -= U = k >> 3, x &= (1 << (k -= U << 3)) - 1, i.next_in = l, i.next_out = d, i.avail_in = l < c ? c - l + 5 : 5 - (l - c), i.avail_out = d < g ? g - d + 257 : 257 - (d - g), s.hold = x, s.bits = k;
        };
      }, {}], 49: [function(r, n, o) {
        var i = r("../utils/common"), a = r("./adler32"), s = r("./crc32"), l = r("./inffast"), c = r("./inftrees"), d = 1, u = 2, g = 0, f = -2, w = 1, p = 852, v = 592;
        function m(C) {
          return (C >>> 24 & 255) + (C >>> 8 & 65280) + ((65280 & C) << 8) + ((255 & C) << 24);
        }
        function x() {
          this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new i.Buf16(320), this.work = new i.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function k(C) {
          var P;
          return C && C.state ? (P = C.state, C.total_in = C.total_out = P.total = 0, C.msg = "", P.wrap && (C.adler = 1 & P.wrap), P.mode = w, P.last = 0, P.havedict = 0, P.dmax = 32768, P.head = null, P.hold = 0, P.bits = 0, P.lencode = P.lendyn = new i.Buf32(p), P.distcode = P.distdyn = new i.Buf32(v), P.sane = 1, P.back = -1, g) : f;
        }
        function _(C) {
          var P;
          return C && C.state ? ((P = C.state).wsize = 0, P.whave = 0, P.wnext = 0, k(C)) : f;
        }
        function S(C, P) {
          var y, F;
          return C && C.state ? (F = C.state, P < 0 ? (y = 0, P = -P) : (y = 1 + (P >> 4), P < 48 && (P &= 15)), P && (P < 8 || 15 < P) ? f : (F.window !== null && F.wbits !== P && (F.window = null), F.wrap = y, F.wbits = P, _(C))) : f;
        }
        function R(C, P) {
          var y, F;
          return C ? (F = new x(), (C.state = F).window = null, (y = S(C, P)) !== g && (C.state = null), y) : f;
        }
        var A, T, D = true;
        function U(C) {
          if (D) {
            var P;
            for (A = new i.Buf32(512), T = new i.Buf32(32), P = 0; P < 144; ) C.lens[P++] = 8;
            for (; P < 256; ) C.lens[P++] = 9;
            for (; P < 280; ) C.lens[P++] = 7;
            for (; P < 288; ) C.lens[P++] = 8;
            for (c(d, C.lens, 0, 288, A, 0, C.work, { bits: 9 }), P = 0; P < 32; ) C.lens[P++] = 5;
            c(u, C.lens, 0, 32, T, 0, C.work, { bits: 5 }), D = false;
          }
          C.lencode = A, C.lenbits = 9, C.distcode = T, C.distbits = 5;
        }
        function M(C, P, y, F) {
          var te, W = C.state;
          return W.window === null && (W.wsize = 1 << W.wbits, W.wnext = 0, W.whave = 0, W.window = new i.Buf8(W.wsize)), F >= W.wsize ? (i.arraySet(W.window, P, y - W.wsize, W.wsize, 0), W.wnext = 0, W.whave = W.wsize) : (F < (te = W.wsize - W.wnext) && (te = F), i.arraySet(W.window, P, y - F, te, W.wnext), (F -= te) ? (i.arraySet(W.window, P, y - F, F, 0), W.wnext = F, W.whave = W.wsize) : (W.wnext += te, W.wnext === W.wsize && (W.wnext = 0), W.whave < W.wsize && (W.whave += te))), 0;
        }
        o.inflateReset = _, o.inflateReset2 = S, o.inflateResetKeep = k, o.inflateInit = function(C) {
          return R(C, 15);
        }, o.inflateInit2 = R, o.inflate = function(C, P) {
          var y, F, te, W, $, V, ne, z2, O, Q, G, J, de, q, ae, ce, oe, ue, he, ye, b, K, H, j, N = 0, L = new i.Buf8(4), Y = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!C || !C.state || !C.output || !C.input && C.avail_in !== 0) return f;
          (y = C.state).mode === 12 && (y.mode = 13), $ = C.next_out, te = C.output, ne = C.avail_out, W = C.next_in, F = C.input, V = C.avail_in, z2 = y.hold, O = y.bits, Q = V, G = ne, K = g;
          e: for (; ; ) switch (y.mode) {
            case w:
              if (y.wrap === 0) {
                y.mode = 13;
                break;
              }
              for (; O < 16; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if (2 & y.wrap && z2 === 35615) {
                L[y.check = 0] = 255 & z2, L[1] = z2 >>> 8 & 255, y.check = s(y.check, L, 2, 0), O = z2 = 0, y.mode = 2;
                break;
              }
              if (y.flags = 0, y.head && (y.head.done = false), !(1 & y.wrap) || (((255 & z2) << 8) + (z2 >> 8)) % 31) {
                C.msg = "incorrect header check", y.mode = 30;
                break;
              }
              if ((15 & z2) != 8) {
                C.msg = "unknown compression method", y.mode = 30;
                break;
              }
              if (O -= 4, b = 8 + (15 & (z2 >>>= 4)), y.wbits === 0) y.wbits = b;
              else if (b > y.wbits) {
                C.msg = "invalid window size", y.mode = 30;
                break;
              }
              y.dmax = 1 << b, C.adler = y.check = 1, y.mode = 512 & z2 ? 10 : 12, O = z2 = 0;
              break;
            case 2:
              for (; O < 16; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if (y.flags = z2, (255 & y.flags) != 8) {
                C.msg = "unknown compression method", y.mode = 30;
                break;
              }
              if (57344 & y.flags) {
                C.msg = "unknown header flags set", y.mode = 30;
                break;
              }
              y.head && (y.head.text = z2 >> 8 & 1), 512 & y.flags && (L[0] = 255 & z2, L[1] = z2 >>> 8 & 255, y.check = s(y.check, L, 2, 0)), O = z2 = 0, y.mode = 3;
            case 3:
              for (; O < 32; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              y.head && (y.head.time = z2), 512 & y.flags && (L[0] = 255 & z2, L[1] = z2 >>> 8 & 255, L[2] = z2 >>> 16 & 255, L[3] = z2 >>> 24 & 255, y.check = s(y.check, L, 4, 0)), O = z2 = 0, y.mode = 4;
            case 4:
              for (; O < 16; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              y.head && (y.head.xflags = 255 & z2, y.head.os = z2 >> 8), 512 & y.flags && (L[0] = 255 & z2, L[1] = z2 >>> 8 & 255, y.check = s(y.check, L, 2, 0)), O = z2 = 0, y.mode = 5;
            case 5:
              if (1024 & y.flags) {
                for (; O < 16; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                y.length = z2, y.head && (y.head.extra_len = z2), 512 & y.flags && (L[0] = 255 & z2, L[1] = z2 >>> 8 & 255, y.check = s(y.check, L, 2, 0)), O = z2 = 0;
              } else y.head && (y.head.extra = null);
              y.mode = 6;
            case 6:
              if (1024 & y.flags && (V < (J = y.length) && (J = V), J && (y.head && (b = y.head.extra_len - y.length, y.head.extra || (y.head.extra = new Array(y.head.extra_len)), i.arraySet(y.head.extra, F, W, J, b)), 512 & y.flags && (y.check = s(y.check, F, J, W)), V -= J, W += J, y.length -= J), y.length)) break e;
              y.length = 0, y.mode = 7;
            case 7:
              if (2048 & y.flags) {
                if (V === 0) break e;
                for (J = 0; b = F[W + J++], y.head && b && y.length < 65536 && (y.head.name += String.fromCharCode(b)), b && J < V; ) ;
                if (512 & y.flags && (y.check = s(y.check, F, J, W)), V -= J, W += J, b) break e;
              } else y.head && (y.head.name = null);
              y.length = 0, y.mode = 8;
            case 8:
              if (4096 & y.flags) {
                if (V === 0) break e;
                for (J = 0; b = F[W + J++], y.head && b && y.length < 65536 && (y.head.comment += String.fromCharCode(b)), b && J < V; ) ;
                if (512 & y.flags && (y.check = s(y.check, F, J, W)), V -= J, W += J, b) break e;
              } else y.head && (y.head.comment = null);
              y.mode = 9;
            case 9:
              if (512 & y.flags) {
                for (; O < 16; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                if (z2 !== (65535 & y.check)) {
                  C.msg = "header crc mismatch", y.mode = 30;
                  break;
                }
                O = z2 = 0;
              }
              y.head && (y.head.hcrc = y.flags >> 9 & 1, y.head.done = true), C.adler = y.check = 0, y.mode = 12;
              break;
            case 10:
              for (; O < 32; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              C.adler = y.check = m(z2), O = z2 = 0, y.mode = 11;
            case 11:
              if (y.havedict === 0) return C.next_out = $, C.avail_out = ne, C.next_in = W, C.avail_in = V, y.hold = z2, y.bits = O, 2;
              C.adler = y.check = 1, y.mode = 12;
            case 12:
              if (P === 5 || P === 6) break e;
            case 13:
              if (y.last) {
                z2 >>>= 7 & O, O -= 7 & O, y.mode = 27;
                break;
              }
              for (; O < 3; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              switch (y.last = 1 & z2, O -= 1, 3 & (z2 >>>= 1)) {
                case 0:
                  y.mode = 14;
                  break;
                case 1:
                  if (U(y), y.mode = 20, P !== 6) break;
                  z2 >>>= 2, O -= 2;
                  break e;
                case 2:
                  y.mode = 17;
                  break;
                case 3:
                  C.msg = "invalid block type", y.mode = 30;
              }
              z2 >>>= 2, O -= 2;
              break;
            case 14:
              for (z2 >>>= 7 & O, O -= 7 & O; O < 32; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if ((65535 & z2) != (z2 >>> 16 ^ 65535)) {
                C.msg = "invalid stored block lengths", y.mode = 30;
                break;
              }
              if (y.length = 65535 & z2, O = z2 = 0, y.mode = 15, P === 6) break e;
            case 15:
              y.mode = 16;
            case 16:
              if (J = y.length) {
                if (V < J && (J = V), ne < J && (J = ne), J === 0) break e;
                i.arraySet(te, F, W, J, $), V -= J, W += J, ne -= J, $ += J, y.length -= J;
                break;
              }
              y.mode = 12;
              break;
            case 17:
              for (; O < 14; ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if (y.nlen = 257 + (31 & z2), z2 >>>= 5, O -= 5, y.ndist = 1 + (31 & z2), z2 >>>= 5, O -= 5, y.ncode = 4 + (15 & z2), z2 >>>= 4, O -= 4, 286 < y.nlen || 30 < y.ndist) {
                C.msg = "too many length or distance symbols", y.mode = 30;
                break;
              }
              y.have = 0, y.mode = 18;
            case 18:
              for (; y.have < y.ncode; ) {
                for (; O < 3; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                y.lens[Y[y.have++]] = 7 & z2, z2 >>>= 3, O -= 3;
              }
              for (; y.have < 19; ) y.lens[Y[y.have++]] = 0;
              if (y.lencode = y.lendyn, y.lenbits = 7, H = { bits: y.lenbits }, K = c(0, y.lens, 0, 19, y.lencode, 0, y.work, H), y.lenbits = H.bits, K) {
                C.msg = "invalid code lengths set", y.mode = 30;
                break;
              }
              y.have = 0, y.mode = 19;
            case 19:
              for (; y.have < y.nlen + y.ndist; ) {
                for (; ce = (N = y.lencode[z2 & (1 << y.lenbits) - 1]) >>> 16 & 255, oe = 65535 & N, !((ae = N >>> 24) <= O); ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                if (oe < 16) z2 >>>= ae, O -= ae, y.lens[y.have++] = oe;
                else {
                  if (oe === 16) {
                    for (j = ae + 2; O < j; ) {
                      if (V === 0) break e;
                      V--, z2 += F[W++] << O, O += 8;
                    }
                    if (z2 >>>= ae, O -= ae, y.have === 0) {
                      C.msg = "invalid bit length repeat", y.mode = 30;
                      break;
                    }
                    b = y.lens[y.have - 1], J = 3 + (3 & z2), z2 >>>= 2, O -= 2;
                  } else if (oe === 17) {
                    for (j = ae + 3; O < j; ) {
                      if (V === 0) break e;
                      V--, z2 += F[W++] << O, O += 8;
                    }
                    O -= ae, b = 0, J = 3 + (7 & (z2 >>>= ae)), z2 >>>= 3, O -= 3;
                  } else {
                    for (j = ae + 7; O < j; ) {
                      if (V === 0) break e;
                      V--, z2 += F[W++] << O, O += 8;
                    }
                    O -= ae, b = 0, J = 11 + (127 & (z2 >>>= ae)), z2 >>>= 7, O -= 7;
                  }
                  if (y.have + J > y.nlen + y.ndist) {
                    C.msg = "invalid bit length repeat", y.mode = 30;
                    break;
                  }
                  for (; J--; ) y.lens[y.have++] = b;
                }
              }
              if (y.mode === 30) break;
              if (y.lens[256] === 0) {
                C.msg = "invalid code -- missing end-of-block", y.mode = 30;
                break;
              }
              if (y.lenbits = 9, H = { bits: y.lenbits }, K = c(d, y.lens, 0, y.nlen, y.lencode, 0, y.work, H), y.lenbits = H.bits, K) {
                C.msg = "invalid literal/lengths set", y.mode = 30;
                break;
              }
              if (y.distbits = 6, y.distcode = y.distdyn, H = { bits: y.distbits }, K = c(u, y.lens, y.nlen, y.ndist, y.distcode, 0, y.work, H), y.distbits = H.bits, K) {
                C.msg = "invalid distances set", y.mode = 30;
                break;
              }
              if (y.mode = 20, P === 6) break e;
            case 20:
              y.mode = 21;
            case 21:
              if (6 <= V && 258 <= ne) {
                C.next_out = $, C.avail_out = ne, C.next_in = W, C.avail_in = V, y.hold = z2, y.bits = O, l(C, G), $ = C.next_out, te = C.output, ne = C.avail_out, W = C.next_in, F = C.input, V = C.avail_in, z2 = y.hold, O = y.bits, y.mode === 12 && (y.back = -1);
                break;
              }
              for (y.back = 0; ce = (N = y.lencode[z2 & (1 << y.lenbits) - 1]) >>> 16 & 255, oe = 65535 & N, !((ae = N >>> 24) <= O); ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if (ce && (240 & ce) == 0) {
                for (ue = ae, he = ce, ye = oe; ce = (N = y.lencode[ye + ((z2 & (1 << ue + he) - 1) >> ue)]) >>> 16 & 255, oe = 65535 & N, !(ue + (ae = N >>> 24) <= O); ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                z2 >>>= ue, O -= ue, y.back += ue;
              }
              if (z2 >>>= ae, O -= ae, y.back += ae, y.length = oe, ce === 0) {
                y.mode = 26;
                break;
              }
              if (32 & ce) {
                y.back = -1, y.mode = 12;
                break;
              }
              if (64 & ce) {
                C.msg = "invalid literal/length code", y.mode = 30;
                break;
              }
              y.extra = 15 & ce, y.mode = 22;
            case 22:
              if (y.extra) {
                for (j = y.extra; O < j; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                y.length += z2 & (1 << y.extra) - 1, z2 >>>= y.extra, O -= y.extra, y.back += y.extra;
              }
              y.was = y.length, y.mode = 23;
            case 23:
              for (; ce = (N = y.distcode[z2 & (1 << y.distbits) - 1]) >>> 16 & 255, oe = 65535 & N, !((ae = N >>> 24) <= O); ) {
                if (V === 0) break e;
                V--, z2 += F[W++] << O, O += 8;
              }
              if ((240 & ce) == 0) {
                for (ue = ae, he = ce, ye = oe; ce = (N = y.distcode[ye + ((z2 & (1 << ue + he) - 1) >> ue)]) >>> 16 & 255, oe = 65535 & N, !(ue + (ae = N >>> 24) <= O); ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                z2 >>>= ue, O -= ue, y.back += ue;
              }
              if (z2 >>>= ae, O -= ae, y.back += ae, 64 & ce) {
                C.msg = "invalid distance code", y.mode = 30;
                break;
              }
              y.offset = oe, y.extra = 15 & ce, y.mode = 24;
            case 24:
              if (y.extra) {
                for (j = y.extra; O < j; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                y.offset += z2 & (1 << y.extra) - 1, z2 >>>= y.extra, O -= y.extra, y.back += y.extra;
              }
              if (y.offset > y.dmax) {
                C.msg = "invalid distance too far back", y.mode = 30;
                break;
              }
              y.mode = 25;
            case 25:
              if (ne === 0) break e;
              if (J = G - ne, y.offset > J) {
                if ((J = y.offset - J) > y.whave && y.sane) {
                  C.msg = "invalid distance too far back", y.mode = 30;
                  break;
                }
                de = J > y.wnext ? (J -= y.wnext, y.wsize - J) : y.wnext - J, J > y.length && (J = y.length), q = y.window;
              } else q = te, de = $ - y.offset, J = y.length;
              for (ne < J && (J = ne), ne -= J, y.length -= J; te[$++] = q[de++], --J; ) ;
              y.length === 0 && (y.mode = 21);
              break;
            case 26:
              if (ne === 0) break e;
              te[$++] = y.length, ne--, y.mode = 21;
              break;
            case 27:
              if (y.wrap) {
                for (; O < 32; ) {
                  if (V === 0) break e;
                  V--, z2 |= F[W++] << O, O += 8;
                }
                if (G -= ne, C.total_out += G, y.total += G, G && (C.adler = y.check = y.flags ? s(y.check, te, G, $ - G) : a(y.check, te, G, $ - G)), G = ne, (y.flags ? z2 : m(z2)) !== y.check) {
                  C.msg = "incorrect data check", y.mode = 30;
                  break;
                }
                O = z2 = 0;
              }
              y.mode = 28;
            case 28:
              if (y.wrap && y.flags) {
                for (; O < 32; ) {
                  if (V === 0) break e;
                  V--, z2 += F[W++] << O, O += 8;
                }
                if (z2 !== (4294967295 & y.total)) {
                  C.msg = "incorrect length check", y.mode = 30;
                  break;
                }
                O = z2 = 0;
              }
              y.mode = 29;
            case 29:
              K = 1;
              break e;
            case 30:
              K = -3;
              break e;
            case 31:
              return -4;
            case 32:
            default:
              return f;
          }
          return C.next_out = $, C.avail_out = ne, C.next_in = W, C.avail_in = V, y.hold = z2, y.bits = O, (y.wsize || G !== C.avail_out && y.mode < 30 && (y.mode < 27 || P !== 4)) && M(C, C.output, C.next_out, G - C.avail_out) ? (y.mode = 31, -4) : (Q -= C.avail_in, G -= C.avail_out, C.total_in += Q, C.total_out += G, y.total += G, y.wrap && G && (C.adler = y.check = y.flags ? s(y.check, te, G, C.next_out - G) : a(y.check, te, G, C.next_out - G)), C.data_type = y.bits + (y.last ? 64 : 0) + (y.mode === 12 ? 128 : 0) + (y.mode === 20 || y.mode === 15 ? 256 : 0), (Q == 0 && G === 0 || P === 4) && K === g && (K = -5), K);
        }, o.inflateEnd = function(C) {
          if (!C || !C.state) return f;
          var P = C.state;
          return P.window && (P.window = null), C.state = null, g;
        }, o.inflateGetHeader = function(C, P) {
          var y;
          return C && C.state ? (2 & (y = C.state).wrap) == 0 ? f : ((y.head = P).done = false, g) : f;
        }, o.inflateSetDictionary = function(C, P) {
          var y, F = P.length;
          return C && C.state ? (y = C.state).wrap !== 0 && y.mode !== 11 ? f : y.mode === 11 && a(1, P, F, 0) !== y.check ? -3 : M(C, P, F, F) ? (y.mode = 31, -4) : (y.havedict = 1, g) : f;
        }, o.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(r, n, o) {
        var i = r("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], c = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        n.exports = function(d, u, g, f, w, p, v, m) {
          var x, k, _, S, R, A, T, D, U, M = m.bits, C = 0, P = 0, y = 0, F = 0, te = 0, W = 0, $ = 0, V = 0, ne = 0, z2 = 0, O = null, Q = 0, G = new i.Buf16(16), J = new i.Buf16(16), de = null, q = 0;
          for (C = 0; C <= 15; C++) G[C] = 0;
          for (P = 0; P < f; P++) G[u[g + P]]++;
          for (te = M, F = 15; 1 <= F && G[F] === 0; F--) ;
          if (F < te && (te = F), F === 0) return w[p++] = 20971520, w[p++] = 20971520, m.bits = 1, 0;
          for (y = 1; y < F && G[y] === 0; y++) ;
          for (te < y && (te = y), C = V = 1; C <= 15; C++) if (V <<= 1, (V -= G[C]) < 0) return -1;
          if (0 < V && (d === 0 || F !== 1)) return -1;
          for (J[1] = 0, C = 1; C < 15; C++) J[C + 1] = J[C] + G[C];
          for (P = 0; P < f; P++) u[g + P] !== 0 && (v[J[u[g + P]]++] = P);
          if (A = d === 0 ? (O = de = v, 19) : d === 1 ? (O = a, Q -= 257, de = s, q -= 257, 256) : (O = l, de = c, -1), C = y, R = p, $ = P = z2 = 0, _ = -1, S = (ne = 1 << (W = te)) - 1, d === 1 && 852 < ne || d === 2 && 592 < ne) return 1;
          for (; ; ) {
            for (T = C - $, U = v[P] < A ? (D = 0, v[P]) : v[P] > A ? (D = de[q + v[P]], O[Q + v[P]]) : (D = 96, 0), x = 1 << C - $, y = k = 1 << W; w[R + (z2 >> $) + (k -= x)] = T << 24 | D << 16 | U | 0, k !== 0; ) ;
            for (x = 1 << C - 1; z2 & x; ) x >>= 1;
            if (x !== 0 ? (z2 &= x - 1, z2 += x) : z2 = 0, P++, --G[C] == 0) {
              if (C === F) break;
              C = u[g + v[P]];
            }
            if (te < C && (z2 & S) !== _) {
              for ($ === 0 && ($ = te), R += y, V = 1 << (W = C - $); W + $ < F && !((V -= G[W + $]) <= 0); ) W++, V <<= 1;
              if (ne += 1 << W, d === 1 && 852 < ne || d === 2 && 592 < ne) return 1;
              w[_ = z2 & S] = te << 24 | W << 16 | R - p | 0;
            }
          }
          return z2 !== 0 && (w[R + z2] = C - $ << 24 | 64 << 16 | 0), m.bits = te, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(r, n, o) {
        n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(r, n, o) {
        var i = r("../utils/common"), a = 0, s = 1;
        function l(N) {
          for (var L = N.length; 0 <= --L; ) N[L] = 0;
        }
        var c = 0, d = 29, u = 256, g = u + 1 + d, f = 30, w = 19, p = 2 * g + 1, v = 15, m = 16, x = 7, k = 256, _ = 16, S = 17, R = 18, A = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], T = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], M = new Array(2 * (g + 2));
        l(M);
        var C = new Array(2 * f);
        l(C);
        var P = new Array(512);
        l(P);
        var y = new Array(256);
        l(y);
        var F = new Array(d);
        l(F);
        var te, W, $, V = new Array(f);
        function ne(N, L, Y, ee, B) {
          this.static_tree = N, this.extra_bits = L, this.extra_base = Y, this.elems = ee, this.max_length = B, this.has_stree = N && N.length;
        }
        function z2(N, L) {
          this.dyn_tree = N, this.max_code = 0, this.stat_desc = L;
        }
        function O(N) {
          return N < 256 ? P[N] : P[256 + (N >>> 7)];
        }
        function Q(N, L) {
          N.pending_buf[N.pending++] = 255 & L, N.pending_buf[N.pending++] = L >>> 8 & 255;
        }
        function G(N, L, Y) {
          N.bi_valid > m - Y ? (N.bi_buf |= L << N.bi_valid & 65535, Q(N, N.bi_buf), N.bi_buf = L >> m - N.bi_valid, N.bi_valid += Y - m) : (N.bi_buf |= L << N.bi_valid & 65535, N.bi_valid += Y);
        }
        function J(N, L, Y) {
          G(N, Y[2 * L], Y[2 * L + 1]);
        }
        function de(N, L) {
          for (var Y = 0; Y |= 1 & N, N >>>= 1, Y <<= 1, 0 < --L; ) ;
          return Y >>> 1;
        }
        function q(N, L, Y) {
          var ee, B, re = new Array(v + 1), le = 0;
          for (ee = 1; ee <= v; ee++) re[ee] = le = le + Y[ee - 1] << 1;
          for (B = 0; B <= L; B++) {
            var ie = N[2 * B + 1];
            ie !== 0 && (N[2 * B] = de(re[ie]++, ie));
          }
        }
        function ae(N) {
          var L;
          for (L = 0; L < g; L++) N.dyn_ltree[2 * L] = 0;
          for (L = 0; L < f; L++) N.dyn_dtree[2 * L] = 0;
          for (L = 0; L < w; L++) N.bl_tree[2 * L] = 0;
          N.dyn_ltree[2 * k] = 1, N.opt_len = N.static_len = 0, N.last_lit = N.matches = 0;
        }
        function ce(N) {
          8 < N.bi_valid ? Q(N, N.bi_buf) : 0 < N.bi_valid && (N.pending_buf[N.pending++] = N.bi_buf), N.bi_buf = 0, N.bi_valid = 0;
        }
        function oe(N, L, Y, ee) {
          var B = 2 * L, re = 2 * Y;
          return N[B] < N[re] || N[B] === N[re] && ee[L] <= ee[Y];
        }
        function ue(N, L, Y) {
          for (var ee = N.heap[Y], B = Y << 1; B <= N.heap_len && (B < N.heap_len && oe(L, N.heap[B + 1], N.heap[B], N.depth) && B++, !oe(L, ee, N.heap[B], N.depth)); ) N.heap[Y] = N.heap[B], Y = B, B <<= 1;
          N.heap[Y] = ee;
        }
        function he(N, L, Y) {
          var ee, B, re, le, ie = 0;
          if (N.last_lit !== 0) for (; ee = N.pending_buf[N.d_buf + 2 * ie] << 8 | N.pending_buf[N.d_buf + 2 * ie + 1], B = N.pending_buf[N.l_buf + ie], ie++, ee === 0 ? J(N, B, L) : (J(N, (re = y[B]) + u + 1, L), (le = A[re]) !== 0 && G(N, B -= F[re], le), J(N, re = O(--ee), Y), (le = T[re]) !== 0 && G(N, ee -= V[re], le)), ie < N.last_lit; ) ;
          J(N, k, L);
        }
        function ye(N, L) {
          var Y, ee, B, re = L.dyn_tree, le = L.stat_desc.static_tree, ie = L.stat_desc.has_stree, I = L.stat_desc.elems, Z = -1;
          for (N.heap_len = 0, N.heap_max = p, Y = 0; Y < I; Y++) re[2 * Y] !== 0 ? (N.heap[++N.heap_len] = Z = Y, N.depth[Y] = 0) : re[2 * Y + 1] = 0;
          for (; N.heap_len < 2; ) re[2 * (B = N.heap[++N.heap_len] = Z < 2 ? ++Z : 0)] = 1, N.depth[B] = 0, N.opt_len--, ie && (N.static_len -= le[2 * B + 1]);
          for (L.max_code = Z, Y = N.heap_len >> 1; 1 <= Y; Y--) ue(N, re, Y);
          for (B = I; Y = N.heap[1], N.heap[1] = N.heap[N.heap_len--], ue(N, re, 1), ee = N.heap[1], N.heap[--N.heap_max] = Y, N.heap[--N.heap_max] = ee, re[2 * B] = re[2 * Y] + re[2 * ee], N.depth[B] = (N.depth[Y] >= N.depth[ee] ? N.depth[Y] : N.depth[ee]) + 1, re[2 * Y + 1] = re[2 * ee + 1] = B, N.heap[1] = B++, ue(N, re, 1), 2 <= N.heap_len; ) ;
          N.heap[--N.heap_max] = N.heap[1], (function(X2, se) {
            var be, me, we, _e, Ae, ft, Xe = se.dyn_tree, Pr = se.max_code, Lr = se.stat_desc.static_tree, Kn = se.stat_desc.has_stree, Yn = se.stat_desc.extra_bits, Mr = se.stat_desc.extra_base, Ie = se.stat_desc.max_length, Fe = 0;
            for (_e = 0; _e <= v; _e++) X2.bl_count[_e] = 0;
            for (Xe[2 * X2.heap[X2.heap_max] + 1] = 0, be = X2.heap_max + 1; be < p; be++) Ie < (_e = Xe[2 * Xe[2 * (me = X2.heap[be]) + 1] + 1] + 1) && (_e = Ie, Fe++), Xe[2 * me + 1] = _e, Pr < me || (X2.bl_count[_e]++, Ae = 0, Mr <= me && (Ae = Yn[me - Mr]), ft = Xe[2 * me], X2.opt_len += ft * (_e + Ae), Kn && (X2.static_len += ft * (Lr[2 * me + 1] + Ae)));
            if (Fe !== 0) {
              do {
                for (_e = Ie - 1; X2.bl_count[_e] === 0; ) _e--;
                X2.bl_count[_e]--, X2.bl_count[_e + 1] += 2, X2.bl_count[Ie]--, Fe -= 2;
              } while (0 < Fe);
              for (_e = Ie; _e !== 0; _e--) for (me = X2.bl_count[_e]; me !== 0; ) Pr < (we = X2.heap[--be]) || (Xe[2 * we + 1] !== _e && (X2.opt_len += (_e - Xe[2 * we + 1]) * Xe[2 * we], Xe[2 * we + 1] = _e), me--);
            }
          })(N, L), q(re, Z, N.bl_count);
        }
        function b(N, L, Y) {
          var ee, B, re = -1, le = L[1], ie = 0, I = 7, Z = 4;
          for (le === 0 && (I = 138, Z = 3), L[2 * (Y + 1) + 1] = 65535, ee = 0; ee <= Y; ee++) B = le, le = L[2 * (ee + 1) + 1], ++ie < I && B === le || (ie < Z ? N.bl_tree[2 * B] += ie : B !== 0 ? (B !== re && N.bl_tree[2 * B]++, N.bl_tree[2 * _]++) : ie <= 10 ? N.bl_tree[2 * S]++ : N.bl_tree[2 * R]++, re = B, Z = (ie = 0) === le ? (I = 138, 3) : B === le ? (I = 6, 3) : (I = 7, 4));
        }
        function K(N, L, Y) {
          var ee, B, re = -1, le = L[1], ie = 0, I = 7, Z = 4;
          for (le === 0 && (I = 138, Z = 3), ee = 0; ee <= Y; ee++) if (B = le, le = L[2 * (ee + 1) + 1], !(++ie < I && B === le)) {
            if (ie < Z) for (; J(N, B, N.bl_tree), --ie != 0; ) ;
            else B !== 0 ? (B !== re && (J(N, B, N.bl_tree), ie--), J(N, _, N.bl_tree), G(N, ie - 3, 2)) : ie <= 10 ? (J(N, S, N.bl_tree), G(N, ie - 3, 3)) : (J(N, R, N.bl_tree), G(N, ie - 11, 7));
            re = B, Z = (ie = 0) === le ? (I = 138, 3) : B === le ? (I = 6, 3) : (I = 7, 4);
          }
        }
        l(V);
        var H = false;
        function j(N, L, Y, ee) {
          G(N, (c << 1) + (ee ? 1 : 0), 3), (function(B, re, le, ie) {
            ce(B), Q(B, le), Q(B, ~le), i.arraySet(B.pending_buf, B.window, re, le, B.pending), B.pending += le;
          })(N, L, Y);
        }
        o._tr_init = function(N) {
          H || ((function() {
            var L, Y, ee, B, re, le = new Array(v + 1);
            for (B = ee = 0; B < d - 1; B++) for (F[B] = ee, L = 0; L < 1 << A[B]; L++) y[ee++] = B;
            for (y[ee - 1] = B, B = re = 0; B < 16; B++) for (V[B] = re, L = 0; L < 1 << T[B]; L++) P[re++] = B;
            for (re >>= 7; B < f; B++) for (V[B] = re << 7, L = 0; L < 1 << T[B] - 7; L++) P[256 + re++] = B;
            for (Y = 0; Y <= v; Y++) le[Y] = 0;
            for (L = 0; L <= 143; ) M[2 * L + 1] = 8, L++, le[8]++;
            for (; L <= 255; ) M[2 * L + 1] = 9, L++, le[9]++;
            for (; L <= 279; ) M[2 * L + 1] = 7, L++, le[7]++;
            for (; L <= 287; ) M[2 * L + 1] = 8, L++, le[8]++;
            for (q(M, g + 1, le), L = 0; L < f; L++) C[2 * L + 1] = 5, C[2 * L] = de(L, 5);
            te = new ne(M, A, u + 1, g, v), W = new ne(C, T, 0, f, v), $ = new ne(new Array(0), D, 0, w, x);
          })(), H = true), N.l_desc = new z2(N.dyn_ltree, te), N.d_desc = new z2(N.dyn_dtree, W), N.bl_desc = new z2(N.bl_tree, $), N.bi_buf = 0, N.bi_valid = 0, ae(N);
        }, o._tr_stored_block = j, o._tr_flush_block = function(N, L, Y, ee) {
          var B, re, le = 0;
          0 < N.level ? (N.strm.data_type === 2 && (N.strm.data_type = (function(ie) {
            var I, Z = 4093624447;
            for (I = 0; I <= 31; I++, Z >>>= 1) if (1 & Z && ie.dyn_ltree[2 * I] !== 0) return a;
            if (ie.dyn_ltree[18] !== 0 || ie.dyn_ltree[20] !== 0 || ie.dyn_ltree[26] !== 0) return s;
            for (I = 32; I < u; I++) if (ie.dyn_ltree[2 * I] !== 0) return s;
            return a;
          })(N)), ye(N, N.l_desc), ye(N, N.d_desc), le = (function(ie) {
            var I;
            for (b(ie, ie.dyn_ltree, ie.l_desc.max_code), b(ie, ie.dyn_dtree, ie.d_desc.max_code), ye(ie, ie.bl_desc), I = w - 1; 3 <= I && ie.bl_tree[2 * U[I] + 1] === 0; I--) ;
            return ie.opt_len += 3 * (I + 1) + 5 + 5 + 4, I;
          })(N), B = N.opt_len + 3 + 7 >>> 3, (re = N.static_len + 3 + 7 >>> 3) <= B && (B = re)) : B = re = Y + 5, Y + 4 <= B && L !== -1 ? j(N, L, Y, ee) : N.strategy === 4 || re === B ? (G(N, 2 + (ee ? 1 : 0), 3), he(N, M, C)) : (G(N, 4 + (ee ? 1 : 0), 3), (function(ie, I, Z, X2) {
            var se;
            for (G(ie, I - 257, 5), G(ie, Z - 1, 5), G(ie, X2 - 4, 4), se = 0; se < X2; se++) G(ie, ie.bl_tree[2 * U[se] + 1], 3);
            K(ie, ie.dyn_ltree, I - 1), K(ie, ie.dyn_dtree, Z - 1);
          })(N, N.l_desc.max_code + 1, N.d_desc.max_code + 1, le + 1), he(N, N.dyn_ltree, N.dyn_dtree)), ae(N), ee && ce(N);
        }, o._tr_tally = function(N, L, Y) {
          return N.pending_buf[N.d_buf + 2 * N.last_lit] = L >>> 8 & 255, N.pending_buf[N.d_buf + 2 * N.last_lit + 1] = 255 & L, N.pending_buf[N.l_buf + N.last_lit] = 255 & Y, N.last_lit++, L === 0 ? N.dyn_ltree[2 * Y]++ : (N.matches++, L--, N.dyn_ltree[2 * (y[Y] + u + 1)]++, N.dyn_dtree[2 * O(L)]++), N.last_lit === N.lit_bufsize - 1;
        }, o._tr_align = function(N) {
          G(N, 2, 3), J(N, k, M), (function(L) {
            L.bi_valid === 16 ? (Q(L, L.bi_buf), L.bi_buf = 0, L.bi_valid = 0) : 8 <= L.bi_valid && (L.pending_buf[L.pending++] = 255 & L.bi_buf, L.bi_buf >>= 8, L.bi_valid -= 8);
          })(N);
        };
      }, { "../utils/common": 41 }], 53: [function(r, n, o) {
        n.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(r, n, o) {
        (function(i) {
          (function(a, s) {
            if (!a.setImmediate) {
              var l, c, d, u, g = 1, f = {}, w = false, p = a.document, v = Object.getPrototypeOf && Object.getPrototypeOf(a);
              v = v && v.setTimeout ? v : a, l = {}.toString.call(a.process) === "[object process]" ? function(_) {
                process.nextTick(function() {
                  x(_);
                });
              } : (function() {
                if (a.postMessage && !a.importScripts) {
                  var _ = true, S = a.onmessage;
                  return a.onmessage = function() {
                    _ = false;
                  }, a.postMessage("", "*"), a.onmessage = S, _;
                }
              })() ? (u = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", k, false) : a.attachEvent("onmessage", k), function(_) {
                a.postMessage(u + _, "*");
              }) : a.MessageChannel ? ((d = new MessageChannel()).port1.onmessage = function(_) {
                x(_.data);
              }, function(_) {
                d.port2.postMessage(_);
              }) : p && "onreadystatechange" in p.createElement("script") ? (c = p.documentElement, function(_) {
                var S = p.createElement("script");
                S.onreadystatechange = function() {
                  x(_), S.onreadystatechange = null, c.removeChild(S), S = null;
                }, c.appendChild(S);
              }) : function(_) {
                setTimeout(x, 0, _);
              }, v.setImmediate = function(_) {
                typeof _ != "function" && (_ = new Function("" + _));
                for (var S = new Array(arguments.length - 1), R = 0; R < S.length; R++) S[R] = arguments[R + 1];
                var A = { callback: _, args: S };
                return f[g] = A, l(g), g++;
              }, v.clearImmediate = m;
            }
            function m(_) {
              delete f[_];
            }
            function x(_) {
              if (w) setTimeout(x, 0, _);
              else {
                var S = f[_];
                if (S) {
                  w = true;
                  try {
                    (function(R) {
                      var A = R.callback, T = R.args;
                      switch (T.length) {
                        case 0:
                          A();
                          break;
                        case 1:
                          A(T[0]);
                          break;
                        case 2:
                          A(T[0], T[1]);
                          break;
                        case 3:
                          A(T[0], T[1], T[2]);
                          break;
                        default:
                          A.apply(s, T);
                      }
                    })(S);
                  } finally {
                    m(_), w = false;
                  }
                }
              }
            }
            function k(_) {
              _.source === a && typeof _.data == "string" && _.data.indexOf(u) === 0 && x(+_.data.slice(u.length));
            }
          })(typeof self > "u" ? i === void 0 ? this : i : self);
        }).call(this, typeof _t < "u" ? _t : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(qn)), qn.exports;
}
Ec();
var tn = { exports: {} }, Ac = tn.exports, _i;
function jc() {
  return _i || (_i = 1, (function(e, t) {
    (function(r, n) {
      n();
    })(Ac, function() {
      function r(c, d) {
        return typeof d > "u" ? d = { autoBom: false } : typeof d != "object" && (console.warn("Deprecated: Expected third argument to be a object"), d = { autoBom: !d }), d.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(c.type) ? new Blob(["\uFEFF", c], { type: c.type }) : c;
      }
      function n(c, d, u) {
        var g = new XMLHttpRequest();
        g.open("GET", c), g.responseType = "blob", g.onload = function() {
          l(g.response, d, u);
        }, g.onerror = function() {
          console.error("could not download file");
        }, g.send();
      }
      function o(c) {
        var d = new XMLHttpRequest();
        d.open("HEAD", c, false);
        try {
          d.send();
        } catch {
        }
        return 200 <= d.status && 299 >= d.status;
      }
      function i(c) {
        try {
          c.dispatchEvent(new MouseEvent("click"));
        } catch {
          var d = document.createEvent("MouseEvents");
          d.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), c.dispatchEvent(d);
        }
      }
      var a = typeof window == "object" && window.window === window ? window : typeof self == "object" && self.self === self ? self : typeof _t == "object" && _t.global === _t ? _t : void 0, s = a.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), l = a.saveAs || (typeof window != "object" || window !== a ? function() {
      } : "download" in HTMLAnchorElement.prototype && !s ? function(c, d, u) {
        var g = a.URL || a.webkitURL, f = document.createElement("a");
        d = d || c.name || "download", f.download = d, f.rel = "noopener", typeof c == "string" ? (f.href = c, f.origin === location.origin ? i(f) : o(f.href) ? n(c, d, u) : i(f, f.target = "_blank")) : (f.href = g.createObjectURL(c), setTimeout(function() {
          g.revokeObjectURL(f.href);
        }, 4e4), setTimeout(function() {
          i(f);
        }, 0));
      } : "msSaveOrOpenBlob" in navigator ? function(c, d, u) {
        if (d = d || c.name || "download", typeof c != "string") navigator.msSaveOrOpenBlob(r(c, u), d);
        else if (o(c)) n(c, d, u);
        else {
          var g = document.createElement("a");
          g.href = c, g.target = "_blank", setTimeout(function() {
            i(g);
          });
        }
      } : function(c, d, u, g) {
        if (g = g || open("", "_blank"), g && (g.document.title = g.document.body.innerText = "downloading..."), typeof c == "string") return n(c, d, u);
        var f = c.type === "application/octet-stream", w = /constructor/i.test(a.HTMLElement) || a.safari, p = /CriOS\/[\d]+/.test(navigator.userAgent);
        if ((p || f && w || s) && typeof FileReader < "u") {
          var v = new FileReader();
          v.onloadend = function() {
            var k = v.result;
            k = p ? k : k.replace(/^data:[^;]*;/, "data:attachment/file;"), g ? g.location.href = k : location = k, g = null;
          }, v.readAsDataURL(c);
        } else {
          var m = a.URL || a.webkitURL, x = m.createObjectURL(c);
          g ? g.location = x : location.href = x, g = null, setTimeout(function() {
            m.revokeObjectURL(x);
          }, 4e4);
        }
      });
      a.saveAs = l.saveAs = l, e.exports = l;
    });
  })(tn)), tn.exports;
}
jc();
function ja(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = ja(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function Oc() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = ja(e)) && (n && (n += " "), n += t);
  return n;
}
const Ic = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, Dc = (e, t) => ({
  classGroupId: e,
  validator: t
}), Ra = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), sn = "-", Si = [], Pc = "arbitrary..", Lc = (e) => {
  const t = Fc(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return Mc(a);
      const s = a.split(sn), l = s[0] === "" && s.length > 1 ? 1 : 0;
      return Ta(s, l, t);
    },
    getConflictingClassGroupIds: (a, s) => {
      if (s) {
        const l = n[a], c = r[a];
        return l ? c ? Ic(c, l) : l : c || Si;
      }
      return r[a] || Si;
    }
  };
}, Ta = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], i = r.nextPart.get(o);
  if (i) {
    const c = Ta(e, t + 1, i);
    if (c) return c;
  }
  const a = r.validators;
  if (a === null)
    return;
  const s = t === 0 ? e.join(sn) : e.slice(t).join(sn), l = a.length;
  for (let c = 0; c < l; c++) {
    const d = a[c];
    if (d.validator(s))
      return d.classGroupId;
  }
}, Mc = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? Pc + n : void 0;
})(), Fc = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return Bc(r, t);
}, Bc = (e, t) => {
  const r = Ra();
  for (const n in e) {
    const o = e[n];
    $o(o, r, n, t);
  }
  return r;
}, $o = (e, t, r, n) => {
  const o = e.length;
  for (let i = 0; i < o; i++) {
    const a = e[i];
    Uc(a, t, r, n);
  }
}, Uc = (e, t, r, n) => {
  if (typeof e == "string") {
    Wc(e, t, r);
    return;
  }
  if (typeof e == "function") {
    $c(e, t, r, n);
    return;
  }
  Hc(e, t, r, n);
}, Wc = (e, t, r) => {
  const n = e === "" ? t : Oa(t, e);
  n.classGroupId = r;
}, $c = (e, t, r, n) => {
  if (Vc(e)) {
    $o(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Dc(r, e));
}, Hc = (e, t, r, n) => {
  const o = Object.entries(e), i = o.length;
  for (let a = 0; a < i; a++) {
    const [s, l] = o[a];
    $o(l, Oa(t, s), r, n);
  }
}, Oa = (e, t) => {
  let r = e;
  const n = t.split(sn), o = n.length;
  for (let i = 0; i < o; i++) {
    const a = n[i];
    let s = r.nextPart.get(a);
    s || (s = Ra(), r.nextPart.set(a, s)), r = s;
  }
  return r;
}, Vc = (e) => "isThemeGetter" in e && e.isThemeGetter === true, Zc = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const o = (i, a) => {
    r[i] = a, t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(i) {
      let a = r[i];
      if (a !== void 0)
        return a;
      if ((a = n[i]) !== void 0)
        return o(i, a), a;
    },
    set(i, a) {
      i in r ? r[i] = a : o(i, a);
    }
  };
}, yo = "!", Ci = ":", Gc = [], Ei = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), Kc = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const i = [];
    let a = 0, s = 0, l = 0, c;
    const d = o.length;
    for (let p = 0; p < d; p++) {
      const v = o[p];
      if (a === 0 && s === 0) {
        if (v === Ci) {
          i.push(o.slice(l, p)), l = p + 1;
          continue;
        }
        if (v === "/") {
          c = p;
          continue;
        }
      }
      v === "[" ? a++ : v === "]" ? a-- : v === "(" ? s++ : v === ")" && s--;
    }
    const u = i.length === 0 ? o : o.slice(l);
    let g = u, f = false;
    u.endsWith(yo) ? (g = u.slice(0, -1), f = true) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(yo) && (g = u.slice(1), f = true)
    );
    const w = c && c > l ? c - l : void 0;
    return Ei(i, f, g, w);
  };
  if (t) {
    const o = t + Ci, i = n;
    n = (a) => a.startsWith(o) ? i(a.slice(o.length)) : Ei(Gc, false, a, void 0, true);
  }
  if (r) {
    const o = n;
    n = (i) => r({
      className: i,
      parseClassName: o
    });
  }
  return n;
}, Yc = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, n) => {
    t.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let o = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[i], s = a[0] === "[", l = t.has(a);
      s || l ? (o.length > 0 && (o.sort(), n.push(...o), o = []), n.push(a)) : o.push(a);
    }
    return o.length > 0 && (o.sort(), n.push(...o)), n;
  };
}, Xc = (e) => ({
  cache: Zc(e.cacheSize),
  parseClassName: Kc(e),
  sortModifiers: Yc(e),
  ...Lc(e)
}), qc = /\s+/, Jc = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: i
  } = t, a = [], s = e.trim().split(qc);
  let l = "";
  for (let c = s.length - 1; c >= 0; c -= 1) {
    const d = s[c], {
      isExternal: u,
      modifiers: g,
      hasImportantModifier: f,
      baseClassName: w,
      maybePostfixModifierPosition: p
    } = r(d);
    if (u) {
      l = d + (l.length > 0 ? " " + l : l);
      continue;
    }
    let v = !!p, m = n(v ? w.substring(0, p) : w);
    if (!m) {
      if (!v) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (m = n(w), !m) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      v = false;
    }
    const x = g.length === 0 ? "" : g.length === 1 ? g[0] : i(g).join(":"), k = f ? x + yo : x, _ = k + m;
    if (a.indexOf(_) > -1)
      continue;
    a.push(_);
    const S = o(m, v);
    for (let R = 0; R < S.length; ++R) {
      const A = S[R];
      a.push(k + A);
    }
    l = d + (l.length > 0 ? " " + l : l);
  }
  return l;
}, Qc = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Ia(r)) && (o && (o += " "), o += n);
  return o;
}, Ia = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Ia(e[n])) && (r && (r += " "), r += t);
  return r;
}, ed = (e, ...t) => {
  let r, n, o, i;
  const a = (l) => {
    const c = t.reduce((d, u) => u(d), e());
    return r = Xc(c), n = r.cache.get, o = r.cache.set, i = s, s(l);
  }, s = (l) => {
    const c = n(l);
    if (c)
      return c;
    const d = Jc(l, r);
    return o(l, d), d;
  };
  return i = a, (...l) => i(Qc(...l));
}, td = [], Pe = (e) => {
  const t = (r) => r[e] || td;
  return t.isThemeGetter = true, t;
}, Da = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Pa = /^\((?:(\w[\w-]*):)?(.+)\)$/i, rd = /^\d+\/\d+$/, nd = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, od = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, id$5 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ad = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, sd = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ft = (e) => rd.test(e), ke = (e) => !!e && !Number.isNaN(Number(e)), wt = (e) => !!e && Number.isInteger(Number(e)), Jn = (e) => e.endsWith("%") && ke(e.slice(0, -1)), ht = (e) => nd.test(e), ld = () => true, cd = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  od.test(e) && !id$5.test(e)
), La = () => false, dd = (e) => ad.test(e), ud = (e) => sd.test(e), fd = (e) => !fe(e) && !pe(e), pd = (e) => Qt(e, Ba, La), fe = (e) => Da.test(e), Rt = (e) => Qt(e, Ua, cd), Qn = (e) => Qt(e, bd, ke), zi = (e) => Qt(e, Ma, La), hd = (e) => Qt(e, Fa, ud), Ur = (e) => Qt(e, Wa, dd), pe = (e) => Pa.test(e), ur = (e) => er(e, Ua), md = (e) => er(e, xd), Ni = (e) => er(e, Ma), gd = (e) => er(e, Ba), vd = (e) => er(e, Fa), Wr = (e) => er(e, Wa, true), Qt = (e, t, r) => {
  const n = Da.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : false;
}, er = (e, t, r = false) => {
  const n = Pa.exec(e);
  return n ? n[1] ? t(n[1]) : r : false;
}, Ma = (e) => e === "position" || e === "percentage", Fa = (e) => e === "image" || e === "url", Ba = (e) => e === "length" || e === "size" || e === "bg-size", Ua = (e) => e === "length", bd = (e) => e === "number", xd = (e) => e === "family-name", Wa = (e) => e === "shadow", wd = () => {
  const e = Pe("color"), t = Pe("font"), r = Pe("text"), n = Pe("font-weight"), o = Pe("tracking"), i = Pe("leading"), a = Pe("breakpoint"), s = Pe("container"), l = Pe("spacing"), c = Pe("radius"), d = Pe("shadow"), u = Pe("inset-shadow"), g = Pe("text-shadow"), f = Pe("drop-shadow"), w = Pe("blur"), p = Pe("perspective"), v = Pe("aspect"), m = Pe("ease"), x = Pe("animate"), k = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], S = () => [..._(), pe, fe], R = () => ["auto", "hidden", "clip", "visible", "scroll"], A = () => ["auto", "contain", "none"], T = () => [pe, fe, l], D = () => [Ft, "full", "auto", ...T()], U = () => [wt, "none", "subgrid", pe, fe], M = () => ["auto", {
    span: ["full", wt, pe, fe]
  }, wt, pe, fe], C = () => [wt, "auto", pe, fe], P = () => ["auto", "min", "max", "fr", pe, fe], y = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], F = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], te = () => ["auto", ...T()], W = () => [Ft, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...T()], $ = () => [e, pe, fe], V = () => [..._(), Ni, zi, {
    position: [pe, fe]
  }], ne = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], z2 = () => ["auto", "cover", "contain", gd, pd, {
    size: [pe, fe]
  }], O = () => [Jn, ur, Rt], Q = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    pe,
    fe
  ], G = () => ["", ke, ur, Rt], J = () => ["solid", "dashed", "dotted", "double"], de = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], q = () => [ke, Jn, Ni, zi], ae = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    w,
    pe,
    fe
  ], ce = () => ["none", ke, pe, fe], oe = () => ["none", ke, pe, fe], ue = () => [ke, pe, fe], he = () => [Ft, "full", ...T()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ht],
      breakpoint: [ht],
      color: [ld],
      container: [ht],
      "drop-shadow": [ht],
      ease: ["in", "out", "in-out"],
      font: [fd],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ht],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ht],
      shadow: [ht],
      spacing: ["px", ke],
      text: [ht],
      "text-shadow": [ht],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Ft, fe, pe, v]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [ke, fe, pe, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": k()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": k()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: R()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": R()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": R()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: A()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": A()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": A()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: D()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": D()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": D()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: D()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: D()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: D()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: D()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: D()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: D()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [wt, "auto", pe, fe]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Ft, "full", "auto", s, ...T()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [ke, Ft, "auto", "initial", "none", fe]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", ke, pe, fe]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", ke, pe, fe]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [wt, "first", "last", "none", pe, fe]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": U()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: M()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": C()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": C()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": U()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: M()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": C()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": C()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": P()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": P()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: T()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": T()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": T()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...y(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...F(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...F()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...y()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...F(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...F(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": y()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...F(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...F()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: T()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: T()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: T()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: T()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: T()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: T()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: T()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: T()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: T()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: te()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: te()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: te()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: te()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: te()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: te()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: te()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: te()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: te()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": T()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": T()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: W()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [s, "screen", ...W()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          s,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...W()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          s,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...W()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...W()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...W()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...W()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, ur, Rt]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [n, pe, Qn]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Jn, fe]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [md, fe, t]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, pe, fe]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [ke, "none", pe, Qn]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ...T()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", pe, fe]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", pe, fe]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: $()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: $()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...J(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [ke, "from-font", "auto", pe, Rt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: $()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [ke, "auto", pe, fe]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: T()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", pe, fe]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", pe, fe]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: V()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ne()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: z2()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, wt, pe, fe],
          radial: ["", pe, fe],
          conic: [wt, pe, fe]
        }, vd, hd]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: $()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: O()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: O()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: O()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: $()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: $()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: $()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: Q()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": Q()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": Q()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": Q()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": Q()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": Q()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": Q()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": Q()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": Q()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": Q()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": Q()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": Q()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": Q()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": Q()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": Q()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: G()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": G()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": G()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": G()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": G()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": G()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": G()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": G()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": G()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": G()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": G()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...J(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...J(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: $()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": $()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": $()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": $()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": $()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": $()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": $()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": $()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": $()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: $()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...J(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [ke, pe, fe]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", ke, ur, Rt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: $()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          d,
          Wr,
          Ur
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: $()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, Wr, Ur]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": $()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: G()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: $()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [ke, Rt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": $()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": G()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": $()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", g, Wr, Ur]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": $()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ke, pe, fe]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...de(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": de()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [ke]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": q()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": q()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": $()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": $()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": q()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": q()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": $()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": $()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": q()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": q()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": $()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": $()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": q()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": q()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": $()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": $()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": q()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": q()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": $()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": $()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": q()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": q()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": $()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": $()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": q()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": q()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": $()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": $()
      }],
      "mask-image-radial": [{
        "mask-radial": [pe, fe]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": q()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": q()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": $()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": $()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": _()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ke]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": q()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": q()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": $()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": $()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: V()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: ne()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: z2()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", pe, fe]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          pe,
          fe
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ae()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [ke, pe, fe]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [ke, pe, fe]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          f,
          Wr,
          Ur
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": $()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", ke, pe, fe]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [ke, pe, fe]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", ke, pe, fe]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [ke, pe, fe]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", ke, pe, fe]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          pe,
          fe
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ae()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [ke, pe, fe]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [ke, pe, fe]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ke, pe, fe]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ke, pe, fe]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", ke, pe, fe]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ke, pe, fe]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [ke, pe, fe]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ke, pe, fe]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": T()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": T()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": T()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", pe, fe]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [ke, "initial", pe, fe]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", m, pe, fe]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [ke, pe, fe]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", x, pe, fe]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [p, pe, fe]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: ce()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ce()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ce()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ce()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: oe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": oe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": oe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": oe()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: ue()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ue()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ue()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [pe, fe, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: S()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: he()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": he()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": he()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": he()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: $()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: $()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", pe, fe]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": T()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": T()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": T()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": T()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": T()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": T()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": T()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": T()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": T()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": T()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": T()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": T()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": T()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": T()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": T()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": T()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": T()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": T()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", pe, fe]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...$()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [ke, ur, Rt, Qn]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...$()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, yd = /* @__PURE__ */ ed(wd);
function xe(...e) {
  return yd(Oc(e));
}
var $r = { exports: {} }, fr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ai;
function kd() {
  if (Ai) return fr;
  Ai = 1;
  var e = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function r(n, o, i) {
    var a = null;
    if (i !== void 0 && (a = "" + i), o.key !== void 0 && (a = "" + o.key), "key" in o) {
      i = {};
      for (var s in o)
        s !== "key" && (i[s] = o[s]);
    } else i = o;
    return o = i.ref, {
      $$typeof: e,
      type: n,
      key: a,
      ref: o !== void 0 ? o : null,
      props: i
    };
  }
  return fr.Fragment = t, fr.jsx = r, fr.jsxs = r, fr;
}
var pr = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ji;
function _d() {
  return ji || (ji = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(z2) {
      if (z2 == null) return null;
      if (typeof z2 == "function")
        return z2.$$typeof === M ? null : z2.displayName || z2.name || null;
      if (typeof z2 == "string") return z2;
      switch (z2) {
        case v:
          return "Fragment";
        case x:
          return "Profiler";
        case m:
          return "StrictMode";
        case R:
          return "Suspense";
        case A:
          return "SuspenseList";
        case U:
          return "Activity";
      }
      if (typeof z2 == "object")
        switch (typeof z2.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), z2.$$typeof) {
          case p:
            return "Portal";
          case _:
            return z2.displayName || "Context";
          case k:
            return (z2._context.displayName || "Context") + ".Consumer";
          case S:
            var O = z2.render;
            return z2 = z2.displayName, z2 || (z2 = O.displayName || O.name || "", z2 = z2 !== "" ? "ForwardRef(" + z2 + ")" : "ForwardRef"), z2;
          case T:
            return O = z2.displayName || null, O !== null ? O : e(z2.type) || "Memo";
          case D:
            O = z2._payload, z2 = z2._init;
            try {
              return e(z2(O));
            } catch {
            }
        }
      return null;
    }
    function t(z2) {
      return "" + z2;
    }
    function r(z2) {
      try {
        t(z2);
        var O = false;
      } catch {
        O = true;
      }
      if (O) {
        O = console;
        var Q = O.error, G = typeof Symbol == "function" && Symbol.toStringTag && z2[Symbol.toStringTag] || z2.constructor.name || "Object";
        return Q.call(
          O,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          G
        ), t(z2);
      }
    }
    function n(z2) {
      if (z2 === v) return "<>";
      if (typeof z2 == "object" && z2 !== null && z2.$$typeof === D)
        return "<...>";
      try {
        var O = e(z2);
        return O ? "<" + O + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function o() {
      var z2 = C.A;
      return z2 === null ? null : z2.getOwner();
    }
    function i() {
      return Error("react-stack-top-frame");
    }
    function a(z2) {
      if (P.call(z2, "key")) {
        var O = Object.getOwnPropertyDescriptor(z2, "key").get;
        if (O && O.isReactWarning) return false;
      }
      return z2.key !== void 0;
    }
    function s(z2, O) {
      function Q() {
        te || (te = true, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          O
        ));
      }
      Q.isReactWarning = true, Object.defineProperty(z2, "key", {
        get: Q,
        configurable: true
      });
    }
    function l() {
      var z2 = e(this.type);
      return W[z2] || (W[z2] = true, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), z2 = this.props.ref, z2 !== void 0 ? z2 : null;
    }
    function c(z2, O, Q, G, J, de) {
      var q = Q.ref;
      return z2 = {
        $$typeof: w,
        type: z2,
        key: O,
        props: Q,
        _owner: G
      }, (q !== void 0 ? q : null) !== null ? Object.defineProperty(z2, "ref", {
        enumerable: false,
        get: l
      }) : Object.defineProperty(z2, "ref", { enumerable: false, value: null }), z2._store = {}, Object.defineProperty(z2._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      }), Object.defineProperty(z2, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      }), Object.defineProperty(z2, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: J
      }), Object.defineProperty(z2, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: de
      }), Object.freeze && (Object.freeze(z2.props), Object.freeze(z2)), z2;
    }
    function d(z2, O, Q, G, J, de) {
      var q = O.children;
      if (q !== void 0)
        if (G)
          if (y(q)) {
            for (G = 0; G < q.length; G++)
              u(q[G]);
            Object.freeze && Object.freeze(q);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(q);
      if (P.call(O, "key")) {
        q = e(z2);
        var ae = Object.keys(O).filter(function(oe) {
          return oe !== "key";
        });
        G = 0 < ae.length ? "{key: someKey, " + ae.join(": ..., ") + ": ...}" : "{key: someKey}", ne[q + G] || (ae = 0 < ae.length ? "{" + ae.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          G,
          q,
          ae,
          q
        ), ne[q + G] = true);
      }
      if (q = null, Q !== void 0 && (r(Q), q = "" + Q), a(O) && (r(O.key), q = "" + O.key), "key" in O) {
        Q = {};
        for (var ce in O)
          ce !== "key" && (Q[ce] = O[ce]);
      } else Q = O;
      return q && s(
        Q,
        typeof z2 == "function" ? z2.displayName || z2.name || "Unknown" : z2
      ), c(
        z2,
        q,
        Q,
        o(),
        J,
        de
      );
    }
    function u(z2) {
      g(z2) ? z2._store && (z2._store.validated = 1) : typeof z2 == "object" && z2 !== null && z2.$$typeof === D && (z2._payload.status === "fulfilled" ? g(z2._payload.value) && z2._payload.value._store && (z2._payload.value._store.validated = 1) : z2._store && (z2._store.validated = 1));
    }
    function g(z2) {
      return typeof z2 == "object" && z2 !== null && z2.$$typeof === w;
    }
    var f = E__default, w = Symbol.for("react.transitional.element"), p = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), k = Symbol.for("react.consumer"), _ = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), R = Symbol.for("react.suspense"), A = Symbol.for("react.suspense_list"), T = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), U = Symbol.for("react.activity"), M = Symbol.for("react.client.reference"), C = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = Object.prototype.hasOwnProperty, y = Array.isArray, F = console.createTask ? console.createTask : function() {
      return null;
    };
    f = {
      react_stack_bottom_frame: function(z2) {
        return z2();
      }
    };
    var te, W = {}, $ = f.react_stack_bottom_frame.bind(
      f,
      i
    )(), V = F(n(i)), ne = {};
    pr.Fragment = v, pr.jsx = function(z2, O, Q) {
      var G = 1e4 > C.recentlyCreatedOwnerStacks++;
      return d(
        z2,
        O,
        Q,
        false,
        G ? Error("react-stack-top-frame") : $,
        G ? F(n(z2)) : V
      );
    }, pr.jsxs = function(z2, O, Q) {
      var G = 1e4 > C.recentlyCreatedOwnerStacks++;
      return d(
        z2,
        O,
        Q,
        true,
        G ? Error("react-stack-top-frame") : $,
        G ? F(n(z2)) : V
      );
    };
  })()), pr;
}
var Ri;
function Sd() {
  return Ri || (Ri = 1, process.env.NODE_ENV === "production" ? $r.exports = kd() : $r.exports = _d()), $r.exports;
}
var h = Sd();
const $a = createContext(void 0), Cd = ({
  config: e,
  children: t
}) => /* @__PURE__ */ h.jsx(
  $a.Provider,
  {
    value: {
      registry: e.registry,
      schemas: e.schemas,
      tenantId: e.tenantId,
      assets: e.assets,
      overlayDisabledSectionTypes: e.overlayDisabledSectionTypes
    },
    children: t
  }
);
function Cn() {
  const e = useContext($a);
  if (e === void 0)
    throw new Error("useConfig must be used within ConfigProvider");
  return e;
}
const Ha = createContext(void 0), Ho = ({ mode: e, children: t }) => (useEffect(() => {
  if (e !== "studio") return;
  const r = new MutationObserver((n) => {
    n.forEach((o) => {
      o.addedNodes.forEach((i) => {
        i instanceof HTMLElement && i.hasAttribute("data-radix-portal") && i.setAttribute("data-jp-studio-portal", "true");
      });
    });
  });
  return r.observe(document.body, { childList: true }), () => r.disconnect();
}, [e]), /* @__PURE__ */ h.jsx(Ha.Provider, { value: { mode: e }, children: t })), Ed = () => {
  const e = useContext(Ha);
  if (e === void 0)
    throw new Error("useStudio must be used within a StudioProvider");
  return e;
};
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zd = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Va = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Nd = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ad = forwardRef(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: o = "",
    children: i,
    iconNode: a,
    ...s
  }, l) => createElement(
    "svg",
    {
      ref: l,
      ...Nd,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: Va("lucide", o),
      ...s
    },
    [
      ...a.map(([c, d]) => createElement(c, d)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ne = (e, t) => {
  const r = forwardRef(
    ({ className: n, ...o }, i) => createElement(Ad, {
      ref: i,
      iconNode: t,
      className: Va(`lucide-${zd(e)}`, n),
      ...o
    })
  );
  return r.displayName = `${e}`, r;
};
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jd = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
Ne("ArrowDown", jd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Td = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
Ne("ArrowRight", Td);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Id = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
Ne("ArrowUp", Id);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pd = [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      key: "hh9hay"
    }
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
  ["path", { d: "M12 22V12", key: "d0xqtd" }]
];
Ne("Box", Pd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Md = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Vo = Ne("Check", Md);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fd = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], En = Ne("ChevronDown", Fd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bd = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
Ne("ChevronRight", Bd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wd = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], Zo = Ne("ChevronUp", Wd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $d = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
Ne("CircleAlert", $d);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vd = [
  ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }]
];
Ne("FileCode", Vd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gd = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
];
Ne("FileJson", Gd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yd = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
Ne("FileText", Yd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qd = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
];
Ne("Github", qd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qd = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
Ne("GripVertical", Qd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const eu = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
Ne("Image", eu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tu = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
Ne("Layers", tu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ru = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
Ne("Link2", ru);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nu = [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
];
Ne("Menu", nu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iu = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
Ne("Pencil", iu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const su = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
Ne("Plus", su);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lu = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
Ne("Save", lu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cu = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
];
Ne("Search", cu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const uu = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
Ne("Settings", uu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pu = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
Ne("Sparkles", pu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mu = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
Ne("SquarePlus", mu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vu = [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
];
Ne("Terminal", vu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xu = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
Ne("Trash2", xu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wu = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], yu = Ne("TriangleAlert", wu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ku = [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
];
Ne("Upload", ku);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _u = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
Ne("X", _u);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Su = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
Ne("Zap", Su);
class Eu extends Component {
  constructor(t) {
    super(t), this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(t, r) {
    console.error(`[JsonPages] Component Crash [${this.props.type}]:`, t, r);
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ h.jsxs("div", { className: "p-8 m-4 bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-xl flex flex-col items-center text-center gap-3", children: [
      /* @__PURE__ */ h.jsx(yu, { className: "text-amber-500", size: 32 }),
      /* @__PURE__ */ h.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ h.jsx("h4", { className: "text-sm font-bold text-amber-200 uppercase tracking-tight", children: "Component Error" }),
        /* @__PURE__ */ h.jsxs("p", { className: "text-xs text-amber-500/70 font-mono", children: [
          "Type: ",
          this.props.type
        ] })
      ] }),
      /* @__PURE__ */ h.jsx("p", { className: "text-xs text-zinc-400 max-w-[280px] leading-relaxed", children: "This section failed to render. Check the console for details or verify the JSON data structure." })
    ] }) : this.props.children;
  }
}
const zu = ({ type: e, scope: t, isSelected: r, sectionId: n, sectionIndex: o = 0, totalSections: i = 0, onReorder: a }) => {
  const s = typeof o == "number" && o > 0 && a, l = typeof o == "number" && o < i - 1 && a;
  return /* @__PURE__ */ h.jsx(
    "div",
    {
      "data-jp-section-overlay": true,
      "aria-hidden": true,
      className: xe(
        "absolute inset-0 pointer-events-none transition-all duration-200 z-[50]",
        "border-2 border-transparent group-hover:border-blue-400/50 group-hover:border-dashed",
        r && "border-2 border-blue-600 border-solid bg-blue-500/5"
      ),
      children: /* @__PURE__ */ h.jsxs(
        "div",
        {
          className: xe(
            "absolute top-0 right-0 flex flex-nowrap items-center gap-1 pl-1 pr-2 py-1 text-[9px] font-black uppercase tracking-widest transition-opacity pointer-events-auto",
            "bg-blue-600 text-white",
            r || "group-hover:opacity-100 opacity-0"
          ),
          children: [
            a && n != null && /* @__PURE__ */ h.jsxs("span", { className: "shrink-0 flex items-center gap-0.5", children: [
              /* @__PURE__ */ h.jsx(
                "button",
                {
                  type: "button",
                  onClick: (c) => {
                    c.stopPropagation(), s && a(n, o - 1);
                  },
                  disabled: !s,
                  className: "inline-flex items-center justify-center min-w-[18px] min-h-[18px] rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none",
                  title: "Move section up",
                  "aria-label": "Move section up",
                  children: /* @__PURE__ */ h.jsx(Zo, { size: 12, strokeWidth: 2.5 })
                }
              ),
              /* @__PURE__ */ h.jsx(
                "button",
                {
                  type: "button",
                  onClick: (c) => {
                    c.stopPropagation(), l && a(n, o + 2);
                  },
                  disabled: !l,
                  className: "inline-flex items-center justify-center min-w-[18px] min-h-[18px] rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none",
                  title: "Move section down",
                  "aria-label": "Move section down",
                  children: /* @__PURE__ */ h.jsx(En, { size: 12, strokeWidth: 2.5 })
                }
              )
            ] }),
            /* @__PURE__ */ h.jsx("span", { className: "shrink-0", children: e }),
            /* @__PURE__ */ h.jsx("span", { className: "opacity-50 shrink-0", children: "|" }),
            /* @__PURE__ */ h.jsx("span", { className: "shrink-0", children: t })
          ]
        }
      )
    }
  );
}, Hr = ({
  section: e,
  menu: t,
  selectedId: r,
  reorderable: n,
  sectionIndex: o,
  totalSections: i,
  onReorder: a
}) => {
  var x, k;
  const { mode: s } = Ed(), { registry: l, overlayDisabledSectionTypes: c } = Cn(), d = s === "studio", u = d && r === e.id, g = l[e.type], f = e.type === "header" || e.type === "footer" ? "global" : "local", w = Array.isArray(c) ? c.includes(e.type) : false, p = e.type === "header" && ((x = e.settings) == null ? void 0 : x.sticky);
  if (!g)
    return /* @__PURE__ */ h.jsxs("div", { className: "p-6 m-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-mono", children: [
      /* @__PURE__ */ h.jsx("strong", { children: "Missing Component:" }),
      " ",
      e.type
    ] });
  const v = () => {
    const _ = g;
    return e.type === "header" && t ? /* @__PURE__ */ h.jsx(_, { data: e.data, settings: e.settings, menu: t }) : /* @__PURE__ */ h.jsx(_, { data: e.data, settings: e.settings });
  }, m = (k = e.data) == null ? void 0 : k.anchorId;
  return /* @__PURE__ */ h.jsxs(
    "div",
    {
      id: m || void 0,
      "data-section-id": d ? e.id : void 0,
      "data-section-type": d ? e.type : void 0,
      "data-section-scope": d ? f : void 0,
      ...d && u ? { "data-jp-selected": true } : {},
      className: xe(
        "relative w-full",
        d && !w && "group cursor-pointer",
        d && p ? "sticky top-0 z-[60]" : e.type === "header" ? "relative" : "relative z-0",
        u && "z-[70]"
      ),
      children: [
        /* @__PURE__ */ h.jsx("div", { className: e.type === "header" ? "relative" : "relative z-0", children: /* @__PURE__ */ h.jsx(Eu, { type: e.type, children: v() }) }),
        d && !w && /* @__PURE__ */ h.jsx(
          zu,
          {
            type: e.type,
            scope: f,
            isSelected: !!u,
            sectionId: n && f === "local" ? e.id : void 0,
            sectionIndex: n && f === "local" ? o : void 0,
            totalSections: n && f === "local" ? i : void 0,
            onReorder: n && f === "local" ? a : void 0
          }
        )
      ]
    }
  );
}, Nu = (e) => {
  useEffect(() => {
    document.title = e.title;
    let t = document.querySelector('meta[name="description"]');
    t || (t = document.createElement("meta"), t.setAttribute("name", "description"), document.head.appendChild(t)), t.setAttribute("content", e.description);
  }, [e.title, e.description]);
}, Au = "application/json", Ka = ({
  pageConfig: e,
  siteConfig: t,
  menuConfig: r,
  selectedId: n,
  onReorder: o,
  scrollToSectionId: i,
  onActiveSectionChange: a
}) => {
  var m, x;
  Nu(e.meta);
  const [s, l] = useState(null), c = useRef({}), d = useRef(a);
  d.current = a;
  const u = Sc(e, t), g = (k) => {
    var _;
    (_ = d.current) == null || _.call(d, k);
  };
  useEffect(() => {
    if (!i) return;
    const k = c.current[i];
    k && k.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [i]), useEffect(() => {
    if (!d.current) return;
    const _ = [
      ...u && t.header ? [t.header.id] : [],
      ...e.sections.map((T) => T.id),
      ...t.footer ? [t.footer.id] : []
    ], S = new IntersectionObserver(
      (T) => {
        T.forEach((D) => {
          var U;
          if (D.isIntersecting && D.intersectionRatio > 0.5) {
            const M = D.target.getAttribute("data-section-id");
            M && ((U = d.current) == null || U.call(d, M));
          }
        });
      },
      { threshold: [0, 0.5, 1], rootMargin: "-20% 0px -20% 0px" }
    );
    let R = false;
    const A = requestAnimationFrame(() => {
      R || _.forEach((T) => {
        const D = c.current[T];
        D && S.observe(D);
      });
    });
    return () => {
      R = true, cancelAnimationFrame(A), S.disconnect();
    };
  }, [e.sections, e["global-header"], u, (m = t.header) == null ? void 0 : m.id, (x = t.footer) == null ? void 0 : x.id]);
  const f = (k, _) => {
    k.preventDefault(), k.dataTransfer.dropEffect = "move", l(_);
  }, w = () => {
    l(null);
  }, p = (k, _) => {
    if (k.preventDefault(), l(null), !!o)
      try {
        const S = k.dataTransfer.getData(Au), { sectionId: R } = JSON.parse(S);
        typeof R == "string" && o(R, _);
      } catch {
      }
  }, v = () => {
    const k = typeof o == "function", _ = e.sections.map((S, R) => {
      const A = s === R;
      return k ? /* @__PURE__ */ h.jsxs(
        "div",
        {
          ref: (T) => {
            c.current[S.id] = T;
          },
          "data-section-id": S.id,
          style: { position: "relative" },
          onMouseEnter: () => g(S.id),
          children: [
            /* @__PURE__ */ h.jsx(
              "div",
              {
                "data-jp-drop-zone": true,
                style: {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: -1,
                  height: 12,
                  zIndex: 55,
                  pointerEvents: "auto",
                  backgroundColor: A ? "rgba(59, 130, 246, 0.4)" : "transparent",
                  borderTop: A ? "2px solid rgb(96, 165, 250)" : "2px solid transparent"
                },
                onDragOver: (T) => f(T, R),
                onDragLeave: w,
                onDrop: (T) => p(T, R)
              }
            ),
            /* @__PURE__ */ h.jsx(
              Hr,
              {
                section: S,
                menu: r.main,
                selectedId: n,
                reorderable: true,
                sectionIndex: R,
                totalSections: e.sections.length,
                onReorder: o
              }
            )
          ]
        },
        S.id
      ) : /* @__PURE__ */ h.jsx(
        "div",
        {
          ref: (T) => {
            c.current[S.id] = T;
          },
          "data-section-id": S.id,
          onMouseEnter: () => g(S.id),
          children: /* @__PURE__ */ h.jsx(Hr, { section: S, menu: r.main, selectedId: n })
        },
        S.id
      );
    });
    if (k && _.length > 0) {
      const S = e.sections.length, R = s === S;
      _.push(
        /* @__PURE__ */ h.jsx(
          "div",
          {
            "data-jp-drop-zone": true,
            style: {
              position: "relative",
              left: 0,
              right: 0,
              height: 24,
              minHeight: 24,
              zIndex: 55,
              pointerEvents: "auto",
              backgroundColor: R ? "rgba(59, 130, 246, 0.4)" : "transparent",
              borderTop: R ? "2px solid rgb(96, 165, 250)" : "2px solid transparent"
            },
            onDragOver: (A) => f(A, S),
            onDragLeave: w,
            onDrop: (A) => p(A, S)
          },
          "jp-drop-after-last"
        )
      );
    }
    return _;
  };
  return /* @__PURE__ */ h.jsxs("div", { className: "min-h-screen flex flex-col bg-[var(--color-background)]", children: [
    u && t.header != null && /* @__PURE__ */ h.jsx(
      "div",
      {
        ref: (k) => {
          c.current[t.header.id] = k;
        },
        "data-section-id": t.header.id,
        onMouseEnter: () => g(t.header.id),
        children: /* @__PURE__ */ h.jsx(
          Hr,
          {
            section: t.header,
            menu: r.main,
            selectedId: n
          }
        )
      }
    ),
    /* @__PURE__ */ h.jsx("main", { className: "flex-1", children: v() }),
    t.footer != null && /* @__PURE__ */ h.jsx(
      "div",
      {
        ref: (k) => {
          c.current[t.footer.id] = k;
        },
        "data-section-id": t.footer.id,
        onMouseEnter: () => g(t.footer.id),
        children: /* @__PURE__ */ h.jsx(Hr, { section: t.footer, selectedId: n })
      }
    )
  ] });
};
var Me;
(function(e) {
  e.DragStart = "dragStart", e.DragMove = "dragMove", e.DragEnd = "dragEnd", e.DragCancel = "dragCancel", e.DragOver = "dragOver", e.RegisterDroppable = "registerDroppable", e.SetDroppableDisabled = "setDroppableDisabled", e.UnregisterDroppable = "unregisterDroppable";
})(Me || (Me = {}));
const tt = /* @__PURE__ */ Object.freeze({
  x: 0,
  y: 0
});
var Be;
(function(e) {
  e[e.Forward = 1] = "Forward", e[e.Backward = -1] = "Backward";
})(Be || (Be = {}));
var Je;
(function(e) {
  e.Click = "click", e.DragStart = "dragstart", e.Keydown = "keydown", e.ContextMenu = "contextmenu", e.Resize = "resize", e.SelectionChange = "selectionchange", e.VisibilityChange = "visibilitychange";
})(Je || (Je = {}));
var Ce;
(function(e) {
  e.Space = "Space", e.Down = "ArrowDown", e.Right = "ArrowRight", e.Left = "ArrowLeft", e.Up = "ArrowUp", e.Esc = "Escape", e.Enter = "Enter", e.Tab = "Tab";
})(Ce || (Ce = {}));
({
  start: [Ce.Space, Ce.Enter],
  cancel: [Ce.Esc],
  end: [Ce.Space, Ce.Enter, Ce.Tab]
});
var _o;
(function(e) {
  e[e.RightClick = 2] = "RightClick";
})(_o || (_o = {}));
var vr;
(function(e) {
  e[e.Pointer = 0] = "Pointer", e[e.DraggableRect = 1] = "DraggableRect";
})(vr || (vr = {}));
var pn;
(function(e) {
  e[e.TreeOrder = 0] = "TreeOrder", e[e.ReversedTreeOrder = 1] = "ReversedTreeOrder";
})(pn || (pn = {}));
({
  x: {
    [Be.Backward]: false,
    [Be.Forward]: false
  },
  y: {
    [Be.Backward]: false,
    [Be.Forward]: false
  }
});
var _r;
(function(e) {
  e[e.Always = 0] = "Always", e[e.BeforeDragging = 1] = "BeforeDragging", e[e.WhileDragging = 2] = "WhileDragging";
})(_r || (_r = {}));
var So;
(function(e) {
  e.Optimized = "optimized";
})(So || (So = {}));
({
  droppable: {
    strategy: _r.WhileDragging,
    frequency: So.Optimized
  }
});
/* @__PURE__ */ createContext({
  ...tt,
  scaleX: 1,
  scaleY: 1
});
var kt;
(function(e) {
  e[e.Uninitialized = 0] = "Uninitialized", e[e.Initializing = 1] = "Initializing", e[e.Initialized = 2] = "Initialized";
})(kt || (kt = {}));
[Ce.Down, Ce.Right, Ce.Up, Ce.Left];
function Ki(e, [t, r]) {
  return Math.min(r, Math.max(t, e));
}
function ze(e, t, { checkForDefaultPrevented: r = true } = {}) {
  return function(o) {
    if (e == null || e(o), r === false || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function jr(e, t = []) {
  let r = [];
  function n(i, a) {
    const s = E.createContext(a), l = r.length;
    r = [...r, a];
    const c = (u) => {
      var m;
      const { scope: g, children: f, ...w } = u, p = ((m = g == null ? void 0 : g[e]) == null ? void 0 : m[l]) || s, v = E.useMemo(() => w, Object.values(w));
      return /* @__PURE__ */ h.jsx(p.Provider, { value: v, children: f });
    };
    c.displayName = i + "Provider";
    function d(u, g) {
      var p;
      const f = ((p = g == null ? void 0 : g[e]) == null ? void 0 : p[l]) || s, w = E.useContext(f);
      if (w) return w;
      if (a !== void 0) return a;
      throw new Error(`\`${u}\` must be used within \`${i}\``);
    }
    return [c, d];
  }
  const o = () => {
    const i = r.map((a) => E.createContext(a));
    return function(s) {
      const l = (s == null ? void 0 : s[e]) || i;
      return E.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: l } }),
        [s, l]
      );
    };
  };
  return o.scopeName = e, [n, Np(o, ...t)];
}
function Np(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const a = n.reduce((s, { useScope: l, scopeName: c }) => {
        const u = l(i)[`__scope${c}`];
        return { ...s, ...u };
      }, {});
      return E.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
function Yi(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Ss(...e) {
  return (t) => {
    let r = false;
    const n = e.map((o) => {
      const i = Yi(o, t);
      return !r && typeof i == "function" && (r = true), i;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const i = n[o];
          typeof i == "function" ? i() : Yi(e[o], null);
        }
      };
  };
}
function De(...e) {
  return E.useCallback(Ss(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
  const t = /* @__PURE__ */ jp(e), r = E.forwardRef((n, o) => {
    const { children: i, ...a } = n, s = E.Children.toArray(i), l = s.find(Tp);
    if (l) {
      const c = l.props.children, d = s.map((u) => u === l ? E.Children.count(c) > 1 ? E.Children.only(null) : E.isValidElement(c) ? c.props.children : null : u);
      return /* @__PURE__ */ h.jsx(t, { ...a, ref: o, children: E.isValidElement(c) ? E.cloneElement(c, void 0, d) : null });
    }
    return /* @__PURE__ */ h.jsx(t, { ...a, ref: o, children: i });
  });
  return r.displayName = `${e}.Slot`, r;
}
var Ap = /* @__PURE__ */ Yt("Slot");
// @__NO_SIDE_EFFECTS__
function jp(e) {
  const t = E.forwardRef((r, n) => {
    const { children: o, ...i } = r;
    if (E.isValidElement(o)) {
      const a = Ip(o), s = Op(i, o.props);
      return o.type !== E.Fragment && (s.ref = n ? Ss(n, a) : a), E.cloneElement(o, s);
    }
    return E.Children.count(o) > 1 ? E.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Cs = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Rp(e) {
  const t = ({ children: r }) => /* @__PURE__ */ h.jsx(h.Fragment, { children: r });
  return t.displayName = `${e}.Slottable`, t.__radixId = Cs, t;
}
function Tp(e) {
  return E.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Cs;
}
function Op(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...s) => {
      const l = i(...s);
      return o(...s), l;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function Ip(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
function Dp(e) {
  const t = e + "CollectionProvider", [r, n] = jr(t), [o, i] = r(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (p) => {
    const { scope: v, children: m } = p, x = E__default.useRef(null), k = E__default.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ h.jsx(o, { scope: v, itemMap: k, collectionRef: x, children: m });
  };
  a.displayName = t;
  const s = e + "CollectionSlot", l = /* @__PURE__ */ Yt(s), c = E__default.forwardRef(
    (p, v) => {
      const { scope: m, children: x } = p, k = i(s, m), _ = De(v, k.collectionRef);
      return /* @__PURE__ */ h.jsx(l, { ref: _, children: x });
    }
  );
  c.displayName = s;
  const d = e + "CollectionItemSlot", u = "data-radix-collection-item", g = /* @__PURE__ */ Yt(d), f = E__default.forwardRef(
    (p, v) => {
      const { scope: m, children: x, ...k } = p, _ = E__default.useRef(null), S = De(v, _), R = i(d, m);
      return E__default.useEffect(() => (R.itemMap.set(_, { ref: _, ...k }), () => void R.itemMap.delete(_))), /* @__PURE__ */ h.jsx(g, { [u]: "", ref: S, children: x });
    }
  );
  f.displayName = d;
  function w(p) {
    const v = i(e + "CollectionConsumer", p);
    return E__default.useCallback(() => {
      const x = v.collectionRef.current;
      if (!x) return [];
      const k = Array.from(x.querySelectorAll(`[${u}]`));
      return Array.from(v.itemMap.values()).sort(
        (R, A) => k.indexOf(R.ref.current) - k.indexOf(A.ref.current)
      );
    }, [v.collectionRef, v.itemMap]);
  }
  return [
    { Provider: a, Slot: c, ItemSlot: f },
    w,
    n
  ];
}
E.createContext(void 0);
var Mp = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Oe = Mp.reduce((e, t) => {
  const r = /* @__PURE__ */ Yt(`Primitive.${t}`), n = E.forwardRef((o, i) => {
    const { asChild: a, ...s } = o, l = a ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), /* @__PURE__ */ h.jsx(l, { ...s, ref: i });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function Fp(e, t) {
  e && Sn.flushSync(() => e.dispatchEvent(t));
}
function Ot(e) {
  const t = E.useRef(e);
  return E.useEffect(() => {
    t.current = e;
  }), E.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
function Bp(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ot(e);
  E.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: true }), () => t.removeEventListener("keydown", n, { capture: true });
  }, [r, t]);
}
var Up = "DismissableLayer", Co = "dismissableLayer.update", Wp = "dismissableLayer.pointerDownOutside", $p = "dismissableLayer.focusOutside", Xi, Es = E.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), In = E.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = false,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: a,
      onDismiss: s,
      ...l
    } = e, c = E.useContext(Es), [d, u] = E.useState(null), g = (d == null ? void 0 : d.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, f] = E.useState({}), w = De(t, (A) => u(A)), p = Array.from(c.layers), [v] = [...c.layersWithOutsidePointerEventsDisabled].slice(-1), m = p.indexOf(v), x = d ? p.indexOf(d) : -1, k = c.layersWithOutsidePointerEventsDisabled.size > 0, _ = x >= m, S = Zp((A) => {
      const T = A.target, D = [...c.branches].some((U) => U.contains(T));
      !_ || D || (o == null || o(A), a == null || a(A), A.defaultPrevented || s == null || s());
    }, g), R = Gp((A) => {
      const T = A.target;
      [...c.branches].some((U) => U.contains(T)) || (i == null || i(A), a == null || a(A), A.defaultPrevented || s == null || s());
    }, g);
    return Bp((A) => {
      x === c.layers.size - 1 && (n == null || n(A), !A.defaultPrevented && s && (A.preventDefault(), s()));
    }, g), E.useEffect(() => {
      if (d)
        return r && (c.layersWithOutsidePointerEventsDisabled.size === 0 && (Xi = g.body.style.pointerEvents, g.body.style.pointerEvents = "none"), c.layersWithOutsidePointerEventsDisabled.add(d)), c.layers.add(d), qi(), () => {
          r && c.layersWithOutsidePointerEventsDisabled.size === 1 && (g.body.style.pointerEvents = Xi);
        };
    }, [d, g, r, c]), E.useEffect(() => () => {
      d && (c.layers.delete(d), c.layersWithOutsidePointerEventsDisabled.delete(d), qi());
    }, [d, c]), E.useEffect(() => {
      const A = () => f({});
      return document.addEventListener(Co, A), () => document.removeEventListener(Co, A);
    }, []), /* @__PURE__ */ h.jsx(
      Oe.div,
      {
        ...l,
        ref: w,
        style: {
          pointerEvents: k ? _ ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: ze(e.onFocusCapture, R.onFocusCapture),
        onBlurCapture: ze(e.onBlurCapture, R.onBlurCapture),
        onPointerDownCapture: ze(
          e.onPointerDownCapture,
          S.onPointerDownCapture
        )
      }
    );
  }
);
In.displayName = Up;
var Hp = "DismissableLayerBranch", Vp = E.forwardRef((e, t) => {
  const r = E.useContext(Es), n = E.useRef(null), o = De(t, n);
  return E.useEffect(() => {
    const i = n.current;
    if (i)
      return r.branches.add(i), () => {
        r.branches.delete(i);
      };
  }, [r.branches]), /* @__PURE__ */ h.jsx(Oe.div, { ...e, ref: o });
});
Vp.displayName = Hp;
function Zp(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ot(e), n = E.useRef(false), o = E.useRef(() => {
  });
  return E.useEffect(() => {
    const i = (s) => {
      if (s.target && !n.current) {
        let l = function() {
          zs(
            Wp,
            r,
            c,
            { discrete: true }
          );
        };
        const c = { originalEvent: s };
        s.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = l, t.addEventListener("click", o.current, { once: true })) : l();
      } else
        t.removeEventListener("click", o.current);
      n.current = false;
    }, a = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(a), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current);
    };
  }, [t, r]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => n.current = true
  };
}
function Gp(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Ot(e), n = E.useRef(false);
  return E.useEffect(() => {
    const o = (i) => {
      i.target && !n.current && zs($p, r, { originalEvent: i }, {
        discrete: false
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = true,
    onBlurCapture: () => n.current = false
  };
}
function qi() {
  const e = new CustomEvent(Co);
  document.dispatchEvent(e);
}
function zs(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, i = new CustomEvent(e, { bubbles: false, cancelable: true, detail: r });
  t && o.addEventListener(e, t, { once: true }), n ? Fp(o, i) : o.dispatchEvent(i);
}
var io = 0;
function Ns() {
  E.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? Ji()), document.body.insertAdjacentElement("beforeend", e[1] ?? Ji()), io++, () => {
      io === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), io--;
    };
  }, []);
}
function Ji() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var ao = "focusScope.autoFocusOnMount", so = "focusScope.autoFocusOnUnmount", Qi = { bubbles: false, cancelable: true }, Kp = "FocusScope", oi = E.forwardRef((e, t) => {
  const {
    loop: r = false,
    trapped: n = false,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...a
  } = e, [s, l] = E.useState(null), c = Ot(o), d = Ot(i), u = E.useRef(null), g = De(t, (p) => l(p)), f = E.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  E.useEffect(() => {
    if (n) {
      let p = function(k) {
        if (f.paused || !s) return;
        const _ = k.target;
        s.contains(_) ? u.current = _ : yt(u.current, { select: true });
      }, v = function(k) {
        if (f.paused || !s) return;
        const _ = k.relatedTarget;
        _ !== null && (s.contains(_) || yt(u.current, { select: true }));
      }, m = function(k) {
        if (document.activeElement === document.body)
          for (const S of k)
            S.removedNodes.length > 0 && yt(s);
      };
      document.addEventListener("focusin", p), document.addEventListener("focusout", v);
      const x = new MutationObserver(m);
      return s && x.observe(s, { childList: true, subtree: true }), () => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", v), x.disconnect();
      };
    }
  }, [n, s, f.paused]), E.useEffect(() => {
    if (s) {
      ta.add(f);
      const p = document.activeElement;
      if (!s.contains(p)) {
        const m = new CustomEvent(ao, Qi);
        s.addEventListener(ao, c), s.dispatchEvent(m), m.defaultPrevented || (Yp(eh(As(s)), { select: true }), document.activeElement === p && yt(s));
      }
      return () => {
        s.removeEventListener(ao, c), setTimeout(() => {
          const m = new CustomEvent(so, Qi);
          s.addEventListener(so, d), s.dispatchEvent(m), m.defaultPrevented || yt(p ?? document.body, { select: true }), s.removeEventListener(so, d), ta.remove(f);
        }, 0);
      };
    }
  }, [s, c, d, f]);
  const w = E.useCallback(
    (p) => {
      if (!r && !n || f.paused) return;
      const v = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey, m = document.activeElement;
      if (v && m) {
        const x = p.currentTarget, [k, _] = Xp(x);
        k && _ ? !p.shiftKey && m === _ ? (p.preventDefault(), r && yt(k, { select: true })) : p.shiftKey && m === k && (p.preventDefault(), r && yt(_, { select: true })) : m === x && p.preventDefault();
      }
    },
    [r, n, f.paused]
  );
  return /* @__PURE__ */ h.jsx(Oe.div, { tabIndex: -1, ...a, ref: g, onKeyDown: w });
});
oi.displayName = Kp;
function Yp(e, { select: t = false } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (yt(n, { select: t }), document.activeElement !== r) return;
}
function Xp(e) {
  const t = As(e), r = ea(t, e), n = ea(t.reverse(), e);
  return [r, n];
}
function As(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function ea(e, t) {
  for (const r of e)
    if (!qp(r, { upTo: t })) return r;
}
function qp(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return true;
  for (; e; ) {
    if (t !== void 0 && e === t) return false;
    if (getComputedStyle(e).display === "none") return true;
    e = e.parentElement;
  }
  return false;
}
function Jp(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function yt(e, { select: t = false } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: true }), e !== r && Jp(e) && t && e.select();
  }
}
var ta = Qp();
function Qp() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = ra(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = ra(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function ra(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function eh(e) {
  return e.filter((t) => t.tagName !== "A");
}
var We = globalThis != null && globalThis.document ? E.useLayoutEffect : () => {
}, th = E[" useId ".trim().toString()] || (() => {
}), rh = 0;
function Rr(e) {
  const [t, r] = E.useState(th());
  return We(() => {
    r((n) => n ?? String(rh++));
  }, [e]), t ? `radix-${t}` : "";
}
const nh = ["top", "right", "bottom", "left"], Ct = Math.min, Ge = Math.max, mn = Math.round, Gr = Math.floor, lt = (e) => ({
  x: e,
  y: e
}), oh = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ih = {
  start: "end",
  end: "start"
};
function Eo(e, t, r) {
  return Ge(e, Ct(t, r));
}
function mt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function gt(e) {
  return e.split("-")[0];
}
function or(e) {
  return e.split("-")[1];
}
function ii(e) {
  return e === "x" ? "y" : "x";
}
function ai(e) {
  return e === "y" ? "height" : "width";
}
const ah = /* @__PURE__ */ new Set(["top", "bottom"]);
function st(e) {
  return ah.has(gt(e)) ? "y" : "x";
}
function si(e) {
  return ii(st(e));
}
function sh(e, t, r) {
  r === void 0 && (r = false);
  const n = or(e), o = si(e), i = ai(o);
  let a = o === "x" ? n === (r ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (a = gn(a)), [a, gn(a)];
}
function lh(e) {
  const t = gn(e);
  return [zo(e), t, zo(t)];
}
function zo(e) {
  return e.replace(/start|end/g, (t) => ih[t]);
}
const na = ["left", "right"], oa = ["right", "left"], ch = ["top", "bottom"], dh = ["bottom", "top"];
function uh(e, t, r) {
  switch (e) {
    case "top":
    case "bottom":
      return r ? t ? oa : na : t ? na : oa;
    case "left":
    case "right":
      return t ? ch : dh;
    default:
      return [];
  }
}
function fh(e, t, r, n) {
  const o = or(e);
  let i = uh(gt(e), r === "start", n);
  return o && (i = i.map((a) => a + "-" + o), t && (i = i.concat(i.map(zo)))), i;
}
function gn(e) {
  return e.replace(/left|right|bottom|top/g, (t) => oh[t]);
}
function ph(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function js(e) {
  return typeof e != "number" ? ph(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function vn(e) {
  const {
    x: t,
    y: r,
    width: n,
    height: o
  } = e;
  return {
    width: n,
    height: o,
    top: r,
    left: t,
    right: t + n,
    bottom: r + o,
    x: t,
    y: r
  };
}
function ia(e, t, r) {
  let {
    reference: n,
    floating: o
  } = e;
  const i = st(t), a = si(t), s = ai(a), l = gt(t), c = i === "y", d = n.x + n.width / 2 - o.width / 2, u = n.y + n.height / 2 - o.height / 2, g = n[s] / 2 - o[s] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: d,
        y: n.y - o.height
      };
      break;
    case "bottom":
      f = {
        x: d,
        y: n.y + n.height
      };
      break;
    case "right":
      f = {
        x: n.x + n.width,
        y: u
      };
      break;
    case "left":
      f = {
        x: n.x - o.width,
        y: u
      };
      break;
    default:
      f = {
        x: n.x,
        y: n.y
      };
  }
  switch (or(t)) {
    case "start":
      f[a] -= g * (r && c ? -1 : 1);
      break;
    case "end":
      f[a] += g * (r && c ? -1 : 1);
      break;
  }
  return f;
}
async function hh(e, t) {
  var r;
  t === void 0 && (t = {});
  const {
    x: n,
    y: o,
    platform: i,
    rects: a,
    elements: s,
    strategy: l
  } = e, {
    boundary: c = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: u = "floating",
    altBoundary: g = false,
    padding: f = 0
  } = mt(t, e), w = js(f), v = s[g ? u === "floating" ? "reference" : "floating" : u], m = vn(await i.getClippingRect({
    element: (r = await (i.isElement == null ? void 0 : i.isElement(v))) == null || r ? v : v.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(s.floating)),
    boundary: c,
    rootBoundary: d,
    strategy: l
  })), x = u === "floating" ? {
    x: n,
    y: o,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, k = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(s.floating)), _ = await (i.isElement == null ? void 0 : i.isElement(k)) ? await (i.getScale == null ? void 0 : i.getScale(k)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, S = vn(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: x,
    offsetParent: k,
    strategy: l
  }) : x);
  return {
    top: (m.top - S.top + w.top) / _.y,
    bottom: (S.bottom - m.bottom + w.bottom) / _.y,
    left: (m.left - S.left + w.left) / _.x,
    right: (S.right - m.right + w.right) / _.x
  };
}
const mh = async (e, t, r) => {
  const {
    placement: n = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: a
  } = r, s = i.filter(Boolean), l = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let c = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: d,
    y: u
  } = ia(c, n, l), g = n, f = {}, w = 0;
  for (let v = 0; v < s.length; v++) {
    var p;
    const {
      name: m,
      fn: x
    } = s[v], {
      x: k,
      y: _,
      data: S,
      reset: R
    } = await x({
      x: d,
      y: u,
      initialPlacement: n,
      placement: g,
      strategy: o,
      middlewareData: f,
      rects: c,
      platform: {
        ...a,
        detectOverflow: (p = a.detectOverflow) != null ? p : hh
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    d = k ?? d, u = _ ?? u, f = {
      ...f,
      [m]: {
        ...f[m],
        ...S
      }
    }, R && w <= 50 && (w++, typeof R == "object" && (R.placement && (g = R.placement), R.rects && (c = R.rects === true ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : R.rects), {
      x: d,
      y: u
    } = ia(c, g, l)), v = -1);
  }
  return {
    x: d,
    y: u,
    placement: g,
    strategy: o,
    middlewareData: f
  };
}, gh = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: r,
      y: n,
      placement: o,
      rects: i,
      platform: a,
      elements: s,
      middlewareData: l
    } = t, {
      element: c,
      padding: d = 0
    } = mt(e, t) || {};
    if (c == null)
      return {};
    const u = js(d), g = {
      x: r,
      y: n
    }, f = si(o), w = ai(f), p = await a.getDimensions(c), v = f === "y", m = v ? "top" : "left", x = v ? "bottom" : "right", k = v ? "clientHeight" : "clientWidth", _ = i.reference[w] + i.reference[f] - g[f] - i.floating[w], S = g[f] - i.reference[f], R = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(c));
    let A = R ? R[k] : 0;
    (!A || !await (a.isElement == null ? void 0 : a.isElement(R))) && (A = s.floating[k] || i.floating[w]);
    const T = _ / 2 - S / 2, D = A / 2 - p[w] / 2 - 1, U = Ct(u[m], D), M = Ct(u[x], D), C = U, P = A - p[w] - M, y = A / 2 - p[w] / 2 + T, F = Eo(C, y, P), te = !l.arrow && or(o) != null && y !== F && i.reference[w] / 2 - (y < C ? U : M) - p[w] / 2 < 0, W = te ? y < C ? y - C : y - P : 0;
    return {
      [f]: g[f] + W,
      data: {
        [f]: F,
        centerOffset: y - F - W,
        ...te && {
          alignmentOffset: W
        }
      },
      reset: te
    };
  }
}), vh = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var r, n;
      const {
        placement: o,
        middlewareData: i,
        rects: a,
        initialPlacement: s,
        platform: l,
        elements: c
      } = t, {
        mainAxis: d = true,
        crossAxis: u = true,
        fallbackPlacements: g,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: w = "none",
        flipAlignment: p = true,
        ...v
      } = mt(e, t);
      if ((r = i.arrow) != null && r.alignmentOffset)
        return {};
      const m = gt(o), x = st(s), k = gt(s) === s, _ = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), S = g || (k || !p ? [gn(s)] : lh(s)), R = w !== "none";
      !g && R && S.push(...fh(s, p, w, _));
      const A = [s, ...S], T = await l.detectOverflow(t, v), D = [];
      let U = ((n = i.flip) == null ? void 0 : n.overflows) || [];
      if (d && D.push(T[m]), u) {
        const y = sh(o, a, _);
        D.push(T[y[0]], T[y[1]]);
      }
      if (U = [...U, {
        placement: o,
        overflows: D
      }], !D.every((y) => y <= 0)) {
        var M, C;
        const y = (((M = i.flip) == null ? void 0 : M.index) || 0) + 1, F = A[y];
        if (F && (!(u === "alignment" ? x !== st(F) : false) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        U.every(($) => st($.placement) === x ? $.overflows[0] > 0 : true)))
          return {
            data: {
              index: y,
              overflows: U
            },
            reset: {
              placement: F
            }
          };
        let te = (C = U.filter((W) => W.overflows[0] <= 0).sort((W, $) => W.overflows[1] - $.overflows[1])[0]) == null ? void 0 : C.placement;
        if (!te)
          switch (f) {
            case "bestFit": {
              var P;
              const W = (P = U.filter(($) => {
                if (R) {
                  const V = st($.placement);
                  return V === x || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  V === "y";
                }
                return true;
              }).map(($) => [$.placement, $.overflows.filter((V) => V > 0).reduce((V, ne) => V + ne, 0)]).sort(($, V) => $[1] - V[1])[0]) == null ? void 0 : P[0];
              W && (te = W);
              break;
            }
            case "initialPlacement":
              te = s;
              break;
          }
        if (o !== te)
          return {
            reset: {
              placement: te
            }
          };
      }
      return {};
    }
  };
};
function aa(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function sa(e) {
  return nh.some((t) => e[t] >= 0);
}
const bh = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: r,
        platform: n
      } = t, {
        strategy: o = "referenceHidden",
        ...i
      } = mt(e, t);
      switch (o) {
        case "referenceHidden": {
          const a = await n.detectOverflow(t, {
            ...i,
            elementContext: "reference"
          }), s = aa(a, r.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: sa(s)
            }
          };
        }
        case "escaped": {
          const a = await n.detectOverflow(t, {
            ...i,
            altBoundary: true
          }), s = aa(a, r.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: sa(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Rs = /* @__PURE__ */ new Set(["left", "top"]);
async function xh(e, t) {
  const {
    placement: r,
    platform: n,
    elements: o
  } = e, i = await (n.isRTL == null ? void 0 : n.isRTL(o.floating)), a = gt(r), s = or(r), l = st(r) === "y", c = Rs.has(a) ? -1 : 1, d = i && l ? -1 : 1, u = mt(t, e);
  let {
    mainAxis: g,
    crossAxis: f,
    alignmentAxis: w
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return s && typeof w == "number" && (f = s === "end" ? w * -1 : w), l ? {
    x: f * d,
    y: g * c
  } : {
    x: g * c,
    y: f * d
  };
}
const wh = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var r, n;
      const {
        x: o,
        y: i,
        placement: a,
        middlewareData: s
      } = t, l = await xh(t, e);
      return a === ((r = s.offset) == null ? void 0 : r.placement) && (n = s.arrow) != null && n.alignmentOffset ? {} : {
        x: o + l.x,
        y: i + l.y,
        data: {
          ...l,
          placement: a
        }
      };
    }
  };
}, yh = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: r,
        y: n,
        placement: o,
        platform: i
      } = t, {
        mainAxis: a = true,
        crossAxis: s = false,
        limiter: l = {
          fn: (m) => {
            let {
              x,
              y: k
            } = m;
            return {
              x,
              y: k
            };
          }
        },
        ...c
      } = mt(e, t), d = {
        x: r,
        y: n
      }, u = await i.detectOverflow(t, c), g = st(gt(o)), f = ii(g);
      let w = d[f], p = d[g];
      if (a) {
        const m = f === "y" ? "top" : "left", x = f === "y" ? "bottom" : "right", k = w + u[m], _ = w - u[x];
        w = Eo(k, w, _);
      }
      if (s) {
        const m = g === "y" ? "top" : "left", x = g === "y" ? "bottom" : "right", k = p + u[m], _ = p - u[x];
        p = Eo(k, p, _);
      }
      const v = l.fn({
        ...t,
        [f]: w,
        [g]: p
      });
      return {
        ...v,
        data: {
          x: v.x - r,
          y: v.y - n,
          enabled: {
            [f]: a,
            [g]: s
          }
        }
      };
    }
  };
}, kh = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      const {
        x: r,
        y: n,
        placement: o,
        rects: i,
        middlewareData: a
      } = t, {
        offset: s = 0,
        mainAxis: l = true,
        crossAxis: c = true
      } = mt(e, t), d = {
        x: r,
        y: n
      }, u = st(o), g = ii(u);
      let f = d[g], w = d[u];
      const p = mt(s, t), v = typeof p == "number" ? {
        mainAxis: p,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...p
      };
      if (l) {
        const k = g === "y" ? "height" : "width", _ = i.reference[g] - i.floating[k] + v.mainAxis, S = i.reference[g] + i.reference[k] - v.mainAxis;
        f < _ ? f = _ : f > S && (f = S);
      }
      if (c) {
        var m, x;
        const k = g === "y" ? "width" : "height", _ = Rs.has(gt(o)), S = i.reference[u] - i.floating[k] + (_ && ((m = a.offset) == null ? void 0 : m[u]) || 0) + (_ ? 0 : v.crossAxis), R = i.reference[u] + i.reference[k] + (_ ? 0 : ((x = a.offset) == null ? void 0 : x[u]) || 0) - (_ ? v.crossAxis : 0);
        w < S ? w = S : w > R && (w = R);
      }
      return {
        [g]: f,
        [u]: w
      };
    }
  };
}, _h = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      var r, n;
      const {
        placement: o,
        rects: i,
        platform: a,
        elements: s
      } = t, {
        apply: l = () => {
        },
        ...c
      } = mt(e, t), d = await a.detectOverflow(t, c), u = gt(o), g = or(o), f = st(o) === "y", {
        width: w,
        height: p
      } = i.floating;
      let v, m;
      u === "top" || u === "bottom" ? (v = u, m = g === (await (a.isRTL == null ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (m = u, v = g === "end" ? "top" : "bottom");
      const x = p - d.top - d.bottom, k = w - d.left - d.right, _ = Ct(p - d[v], x), S = Ct(w - d[m], k), R = !t.middlewareData.shift;
      let A = _, T = S;
      if ((r = t.middlewareData.shift) != null && r.enabled.x && (T = k), (n = t.middlewareData.shift) != null && n.enabled.y && (A = x), R && !g) {
        const U = Ge(d.left, 0), M = Ge(d.right, 0), C = Ge(d.top, 0), P = Ge(d.bottom, 0);
        f ? T = w - 2 * (U !== 0 || M !== 0 ? U + M : Ge(d.left, d.right)) : A = p - 2 * (C !== 0 || P !== 0 ? C + P : Ge(d.top, d.bottom));
      }
      await l({
        ...t,
        availableWidth: T,
        availableHeight: A
      });
      const D = await a.getDimensions(s.floating);
      return w !== D.width || p !== D.height ? {
        reset: {
          rects: true
        }
      } : {};
    }
  };
};
function Dn() {
  return typeof window < "u";
}
function ir(e) {
  return Ts(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ye(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ut(e) {
  var t;
  return (t = (Ts(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Ts(e) {
  return Dn() ? e instanceof Node || e instanceof Ye(e).Node : false;
}
function rt(e) {
  return Dn() ? e instanceof Element || e instanceof Ye(e).Element : false;
}
function dt(e) {
  return Dn() ? e instanceof HTMLElement || e instanceof Ye(e).HTMLElement : false;
}
function la(e) {
  return !Dn() || typeof ShadowRoot > "u" ? false : e instanceof ShadowRoot || e instanceof Ye(e).ShadowRoot;
}
const Sh = /* @__PURE__ */ new Set(["inline", "contents"]);
function Tr(e) {
  const {
    overflow: t,
    overflowX: r,
    overflowY: n,
    display: o
  } = nt(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && !Sh.has(o);
}
const Ch = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Eh(e) {
  return Ch.has(ir(e));
}
const zh = [":popover-open", ":modal"];
function Pn(e) {
  return zh.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return false;
    }
  });
}
const Nh = ["transform", "translate", "scale", "rotate", "perspective"], Ah = ["transform", "translate", "scale", "rotate", "perspective", "filter"], jh = ["paint", "layout", "strict", "content"];
function li(e) {
  const t = ci(), r = rt(e) ? nt(e) : e;
  return Nh.some((n) => r[n] ? r[n] !== "none" : false) || (r.containerType ? r.containerType !== "normal" : false) || !t && (r.backdropFilter ? r.backdropFilter !== "none" : false) || !t && (r.filter ? r.filter !== "none" : false) || Ah.some((n) => (r.willChange || "").includes(n)) || jh.some((n) => (r.contain || "").includes(n));
}
function Rh(e) {
  let t = Et(e);
  for (; dt(t) && !Xt(t); ) {
    if (li(t))
      return t;
    if (Pn(t))
      return null;
    t = Et(t);
  }
  return null;
}
function ci() {
  return typeof CSS > "u" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter", "none");
}
const Th = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Xt(e) {
  return Th.has(ir(e));
}
function nt(e) {
  return Ye(e).getComputedStyle(e);
}
function Ln(e) {
  return rt(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Et(e) {
  if (ir(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    la(e) && e.host || // Fallback.
    ut(e)
  );
  return la(t) ? t.host : t;
}
function Os(e) {
  const t = Et(e);
  return Xt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : dt(t) && Tr(t) ? t : Os(t);
}
function Sr(e, t, r) {
  var n;
  t === void 0 && (t = []), r === void 0 && (r = true);
  const o = Os(e), i = o === ((n = e.ownerDocument) == null ? void 0 : n.body), a = Ye(o);
  if (i) {
    const s = No(a);
    return t.concat(a, a.visualViewport || [], Tr(o) ? o : [], s && r ? Sr(s) : []);
  }
  return t.concat(o, Sr(o, [], r));
}
function No(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Is(e) {
  const t = nt(e);
  let r = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const o = dt(e), i = o ? e.offsetWidth : r, a = o ? e.offsetHeight : n, s = mn(r) !== i || mn(n) !== a;
  return s && (r = i, n = a), {
    width: r,
    height: n,
    $: s
  };
}
function di(e) {
  return rt(e) ? e : e.contextElement;
}
function Zt(e) {
  const t = di(e);
  if (!dt(t))
    return lt(1);
  const r = t.getBoundingClientRect(), {
    width: n,
    height: o,
    $: i
  } = Is(t);
  let a = (i ? mn(r.width) : r.width) / n, s = (i ? mn(r.height) : r.height) / o;
  return (!a || !Number.isFinite(a)) && (a = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: a,
    y: s
  };
}
const Oh = /* @__PURE__ */ lt(0);
function Ds(e) {
  const t = Ye(e);
  return !ci() || !t.visualViewport ? Oh : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Ih(e, t, r) {
  return t === void 0 && (t = false), !r || t && r !== Ye(e) ? false : t;
}
function It(e, t, r, n) {
  t === void 0 && (t = false), r === void 0 && (r = false);
  const o = e.getBoundingClientRect(), i = di(e);
  let a = lt(1);
  t && (n ? rt(n) && (a = Zt(n)) : a = Zt(e));
  const s = Ih(i, r, n) ? Ds(i) : lt(0);
  let l = (o.left + s.x) / a.x, c = (o.top + s.y) / a.y, d = o.width / a.x, u = o.height / a.y;
  if (i) {
    const g = Ye(i), f = n && rt(n) ? Ye(n) : n;
    let w = g, p = No(w);
    for (; p && n && f !== w; ) {
      const v = Zt(p), m = p.getBoundingClientRect(), x = nt(p), k = m.left + (p.clientLeft + parseFloat(x.paddingLeft)) * v.x, _ = m.top + (p.clientTop + parseFloat(x.paddingTop)) * v.y;
      l *= v.x, c *= v.y, d *= v.x, u *= v.y, l += k, c += _, w = Ye(p), p = No(w);
    }
  }
  return vn({
    width: d,
    height: u,
    x: l,
    y: c
  });
}
function Mn(e, t) {
  const r = Ln(e).scrollLeft;
  return t ? t.left + r : It(ut(e)).left + r;
}
function Ps(e, t) {
  const r = e.getBoundingClientRect(), n = r.left + t.scrollLeft - Mn(e, r), o = r.top + t.scrollTop;
  return {
    x: n,
    y: o
  };
}
function Dh(e) {
  let {
    elements: t,
    rect: r,
    offsetParent: n,
    strategy: o
  } = e;
  const i = o === "fixed", a = ut(n), s = t ? Pn(t.floating) : false;
  if (n === a || s && i)
    return r;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = lt(1);
  const d = lt(0), u = dt(n);
  if ((u || !u && !i) && ((ir(n) !== "body" || Tr(a)) && (l = Ln(n)), dt(n))) {
    const f = It(n);
    c = Zt(n), d.x = f.x + n.clientLeft, d.y = f.y + n.clientTop;
  }
  const g = a && !u && !i ? Ps(a, l) : lt(0);
  return {
    width: r.width * c.x,
    height: r.height * c.y,
    x: r.x * c.x - l.scrollLeft * c.x + d.x + g.x,
    y: r.y * c.y - l.scrollTop * c.y + d.y + g.y
  };
}
function Ph(e) {
  return Array.from(e.getClientRects());
}
function Lh(e) {
  const t = ut(e), r = Ln(e), n = e.ownerDocument.body, o = Ge(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), i = Ge(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -r.scrollLeft + Mn(e);
  const s = -r.scrollTop;
  return nt(n).direction === "rtl" && (a += Ge(t.clientWidth, n.clientWidth) - o), {
    width: o,
    height: i,
    x: a,
    y: s
  };
}
const ca = 25;
function Mh(e, t) {
  const r = Ye(e), n = ut(e), o = r.visualViewport;
  let i = n.clientWidth, a = n.clientHeight, s = 0, l = 0;
  if (o) {
    i = o.width, a = o.height;
    const d = ci();
    (!d || d && t === "fixed") && (s = o.offsetLeft, l = o.offsetTop);
  }
  const c = Mn(n);
  if (c <= 0) {
    const d = n.ownerDocument, u = d.body, g = getComputedStyle(u), f = d.compatMode === "CSS1Compat" && parseFloat(g.marginLeft) + parseFloat(g.marginRight) || 0, w = Math.abs(n.clientWidth - u.clientWidth - f);
    w <= ca && (i -= w);
  } else c <= ca && (i += c);
  return {
    width: i,
    height: a,
    x: s,
    y: l
  };
}
const Fh = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Bh(e, t) {
  const r = It(e, true, t === "fixed"), n = r.top + e.clientTop, o = r.left + e.clientLeft, i = dt(e) ? Zt(e) : lt(1), a = e.clientWidth * i.x, s = e.clientHeight * i.y, l = o * i.x, c = n * i.y;
  return {
    width: a,
    height: s,
    x: l,
    y: c
  };
}
function da(e, t, r) {
  let n;
  if (t === "viewport")
    n = Mh(e, r);
  else if (t === "document")
    n = Lh(ut(e));
  else if (rt(t))
    n = Bh(t, r);
  else {
    const o = Ds(e);
    n = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return vn(n);
}
function Ls(e, t) {
  const r = Et(e);
  return r === t || !rt(r) || Xt(r) ? false : nt(r).position === "fixed" || Ls(r, t);
}
function Uh(e, t) {
  const r = t.get(e);
  if (r)
    return r;
  let n = Sr(e, [], false).filter((s) => rt(s) && ir(s) !== "body"), o = null;
  const i = nt(e).position === "fixed";
  let a = i ? Et(e) : e;
  for (; rt(a) && !Xt(a); ) {
    const s = nt(a), l = li(a);
    !l && s.position === "fixed" && (o = null), (i ? !l && !o : !l && s.position === "static" && !!o && Fh.has(o.position) || Tr(a) && !l && Ls(e, a)) ? n = n.filter((d) => d !== a) : o = s, a = Et(a);
  }
  return t.set(e, n), n;
}
function Wh(e) {
  let {
    element: t,
    boundary: r,
    rootBoundary: n,
    strategy: o
  } = e;
  const a = [...r === "clippingAncestors" ? Pn(t) ? [] : Uh(t, this._c) : [].concat(r), n], s = a[0], l = a.reduce((c, d) => {
    const u = da(t, d, o);
    return c.top = Ge(u.top, c.top), c.right = Ct(u.right, c.right), c.bottom = Ct(u.bottom, c.bottom), c.left = Ge(u.left, c.left), c;
  }, da(t, s, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function $h(e) {
  const {
    width: t,
    height: r
  } = Is(e);
  return {
    width: t,
    height: r
  };
}
function Hh(e, t, r) {
  const n = dt(t), o = ut(t), i = r === "fixed", a = It(e, true, i, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = lt(0);
  function c() {
    l.x = Mn(o);
  }
  if (n || !n && !i)
    if ((ir(t) !== "body" || Tr(o)) && (s = Ln(t)), n) {
      const f = It(t, true, i, t);
      l.x = f.x + t.clientLeft, l.y = f.y + t.clientTop;
    } else o && c();
  i && !n && o && c();
  const d = o && !n && !i ? Ps(o, s) : lt(0), u = a.left + s.scrollLeft - l.x - d.x, g = a.top + s.scrollTop - l.y - d.y;
  return {
    x: u,
    y: g,
    width: a.width,
    height: a.height
  };
}
function lo(e) {
  return nt(e).position === "static";
}
function ua(e, t) {
  if (!dt(e) || nt(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let r = e.offsetParent;
  return ut(e) === r && (r = r.ownerDocument.body), r;
}
function Ms(e, t) {
  const r = Ye(e);
  if (Pn(e))
    return r;
  if (!dt(e)) {
    let o = Et(e);
    for (; o && !Xt(o); ) {
      if (rt(o) && !lo(o))
        return o;
      o = Et(o);
    }
    return r;
  }
  let n = ua(e, t);
  for (; n && Eh(n) && lo(n); )
    n = ua(n, t);
  return n && Xt(n) && lo(n) && !li(n) ? r : n || Rh(e) || r;
}
const Vh = async function(e) {
  const t = this.getOffsetParent || Ms, r = this.getDimensions, n = await r(e.floating);
  return {
    reference: Hh(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function Zh(e) {
  return nt(e).direction === "rtl";
}
const Gh = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Dh,
  getDocumentElement: ut,
  getClippingRect: Wh,
  getOffsetParent: Ms,
  getElementRects: Vh,
  getClientRects: Ph,
  getDimensions: $h,
  getScale: Zt,
  isElement: rt,
  isRTL: Zh
};
function Fs(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Kh(e, t) {
  let r = null, n;
  const o = ut(e);
  function i() {
    var s;
    clearTimeout(n), (s = r) == null || s.disconnect(), r = null;
  }
  function a(s, l) {
    s === void 0 && (s = false), l === void 0 && (l = 1), i();
    const c = e.getBoundingClientRect(), {
      left: d,
      top: u,
      width: g,
      height: f
    } = c;
    if (s || t(), !g || !f)
      return;
    const w = Gr(u), p = Gr(o.clientWidth - (d + g)), v = Gr(o.clientHeight - (u + f)), m = Gr(d), k = {
      rootMargin: -w + "px " + -p + "px " + -v + "px " + -m + "px",
      threshold: Ge(0, Ct(1, l)) || 1
    };
    let _ = true;
    function S(R) {
      const A = R[0].intersectionRatio;
      if (A !== l) {
        if (!_)
          return a();
        A ? a(false, A) : n = setTimeout(() => {
          a(false, 1e-7);
        }, 1e3);
      }
      A === 1 && !Fs(c, e.getBoundingClientRect()) && a(), _ = false;
    }
    try {
      r = new IntersectionObserver(S, {
        ...k,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(S, k);
    }
    r.observe(e);
  }
  return a(true), i;
}
function Yh(e, t, r, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: o = true,
    ancestorResize: i = true,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: l = false
  } = n, c = di(e), d = o || i ? [...c ? Sr(c) : [], ...Sr(t)] : [];
  d.forEach((m) => {
    o && m.addEventListener("scroll", r, {
      passive: true
    }), i && m.addEventListener("resize", r);
  });
  const u = c && s ? Kh(c, r) : null;
  let g = -1, f = null;
  a && (f = new ResizeObserver((m) => {
    let [x] = m;
    x && x.target === c && f && (f.unobserve(t), cancelAnimationFrame(g), g = requestAnimationFrame(() => {
      var k;
      (k = f) == null || k.observe(t);
    })), r();
  }), c && !l && f.observe(c), f.observe(t));
  let w, p = l ? It(e) : null;
  l && v();
  function v() {
    const m = It(e);
    p && !Fs(p, m) && r(), p = m, w = requestAnimationFrame(v);
  }
  return r(), () => {
    var m;
    d.forEach((x) => {
      o && x.removeEventListener("scroll", r), i && x.removeEventListener("resize", r);
    }), u == null || u(), (m = f) == null || m.disconnect(), f = null, l && cancelAnimationFrame(w);
  };
}
const Xh = wh, qh = yh, Jh = vh, Qh = _h, em = bh, fa = gh, tm = kh, rm = (e, t, r) => {
  const n = /* @__PURE__ */ new Map(), o = {
    platform: Gh,
    ...r
  }, i = {
    ...o.platform,
    _c: n
  };
  return mh(e, t, {
    ...o,
    platform: i
  });
};
var nm = typeof document < "u", om = function() {
}, nn = nm ? useLayoutEffect : om;
function bn(e, t) {
  if (e === t)
    return true;
  if (typeof e != typeof t)
    return false;
  if (typeof e == "function" && e.toString() === t.toString())
    return true;
  let r, n, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (r = e.length, r !== t.length) return false;
      for (n = r; n-- !== 0; )
        if (!bn(e[n], t[n]))
          return false;
      return true;
    }
    if (o = Object.keys(e), r = o.length, r !== Object.keys(t).length)
      return false;
    for (n = r; n-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[n]))
        return false;
    for (n = r; n-- !== 0; ) {
      const i = o[n];
      if (!(i === "_owner" && e.$$typeof) && !bn(e[i], t[i]))
        return false;
    }
    return true;
  }
  return e !== e && t !== t;
}
function Bs(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function pa(e, t) {
  const r = Bs(e);
  return Math.round(t * r) / r;
}
function co(e) {
  const t = E.useRef(e);
  return nn(() => {
    t.current = e;
  }), t;
}
function im(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: r = "absolute",
    middleware: n = [],
    platform: o,
    elements: {
      reference: i,
      floating: a
    } = {},
    transform: s = true,
    whileElementsMounted: l,
    open: c
  } = e, [d, u] = E.useState({
    x: 0,
    y: 0,
    strategy: r,
    placement: t,
    middlewareData: {},
    isPositioned: false
  }), [g, f] = E.useState(n);
  bn(g, n) || f(n);
  const [w, p] = E.useState(null), [v, m] = E.useState(null), x = E.useCallback(($) => {
    $ !== R.current && (R.current = $, p($));
  }, []), k = E.useCallback(($) => {
    $ !== A.current && (A.current = $, m($));
  }, []), _ = i || w, S = a || v, R = E.useRef(null), A = E.useRef(null), T = E.useRef(d), D = l != null, U = co(l), M = co(o), C = co(c), P = E.useCallback(() => {
    if (!R.current || !A.current)
      return;
    const $ = {
      placement: t,
      strategy: r,
      middleware: g
    };
    M.current && ($.platform = M.current), rm(R.current, A.current, $).then((V) => {
      const ne = {
        ...V,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: C.current !== false
      };
      y.current && !bn(T.current, ne) && (T.current = ne, Sn.flushSync(() => {
        u(ne);
      }));
    });
  }, [g, t, r, M, C]);
  nn(() => {
    c === false && T.current.isPositioned && (T.current.isPositioned = false, u(($) => ({
      ...$,
      isPositioned: false
    })));
  }, [c]);
  const y = E.useRef(false);
  nn(() => (y.current = true, () => {
    y.current = false;
  }), []), nn(() => {
    if (_ && (R.current = _), S && (A.current = S), _ && S) {
      if (U.current)
        return U.current(_, S, P);
      P();
    }
  }, [_, S, P, U, D]);
  const F = E.useMemo(() => ({
    reference: R,
    floating: A,
    setReference: x,
    setFloating: k
  }), [x, k]), te = E.useMemo(() => ({
    reference: _,
    floating: S
  }), [_, S]), W = E.useMemo(() => {
    const $ = {
      position: r,
      left: 0,
      top: 0
    };
    if (!te.floating)
      return $;
    const V = pa(te.floating, d.x), ne = pa(te.floating, d.y);
    return s ? {
      ...$,
      transform: "translate(" + V + "px, " + ne + "px)",
      ...Bs(te.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: r,
      left: V,
      top: ne
    };
  }, [r, s, te.floating, d.x, d.y]);
  return E.useMemo(() => ({
    ...d,
    update: P,
    refs: F,
    elements: te,
    floatingStyles: W
  }), [d, P, F, te, W]);
}
const am = (e) => {
  function t(r) {
    return {}.hasOwnProperty.call(r, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(r) {
      const {
        element: n,
        padding: o
      } = typeof e == "function" ? e(r) : e;
      return n && t(n) ? n.current != null ? fa({
        element: n.current,
        padding: o
      }).fn(r) : {} : n ? fa({
        element: n,
        padding: o
      }).fn(r) : {};
    }
  };
}, sm = (e, t) => ({
  ...Xh(e),
  options: [e, t]
}), lm = (e, t) => ({
  ...qh(e),
  options: [e, t]
}), cm = (e, t) => ({
  ...tm(e),
  options: [e, t]
}), dm = (e, t) => ({
  ...Jh(e),
  options: [e, t]
}), um = (e, t) => ({
  ...Qh(e),
  options: [e, t]
}), fm = (e, t) => ({
  ...em(e),
  options: [e, t]
}), pm = (e, t) => ({
  ...am(e),
  options: [e, t]
});
var hm = "Arrow", Us = E.forwardRef((e, t) => {
  const { children: r, width: n = 10, height: o = 5, ...i } = e;
  return /* @__PURE__ */ h.jsx(
    Oe.svg,
    {
      ...i,
      ref: t,
      width: n,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? r : /* @__PURE__ */ h.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Us.displayName = hm;
var mm = Us;
function gm(e) {
  const [t, r] = E.useState(void 0);
  return We(() => {
    if (e) {
      r({ width: e.offsetWidth, height: e.offsetHeight });
      const n = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let a, s;
        if ("borderBoxSize" in i) {
          const l = i.borderBoxSize, c = Array.isArray(l) ? l[0] : l;
          a = c.inlineSize, s = c.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        r({ width: a, height: s });
      });
      return n.observe(e, { box: "border-box" }), () => n.unobserve(e);
    } else
      r(void 0);
  }, [e]), t;
}
var ui = "Popper", [Ws, ar] = jr(ui), [vm, $s] = Ws(ui);
var Vs = "PopperAnchor", Zs = E.forwardRef(
  (e, t) => {
    const { __scopePopper: r, virtualRef: n, ...o } = e, i = $s(Vs, r), a = E.useRef(null), s = De(t, a), l = E.useRef(null);
    return E.useEffect(() => {
      const c = l.current;
      l.current = (n == null ? void 0 : n.current) || a.current, c !== l.current && i.onAnchorChange(l.current);
    }), n ? null : /* @__PURE__ */ h.jsx(Oe.div, { ...o, ref: s });
  }
);
Zs.displayName = Vs;
var fi = "PopperContent", [bm, xm] = Ws(fi), Gs = E.forwardRef(
  (e, t) => {
    var q, ae, ce, oe, ue, he;
    const {
      __scopePopper: r,
      side: n = "bottom",
      sideOffset: o = 0,
      align: i = "center",
      alignOffset: a = 0,
      arrowPadding: s = 0,
      avoidCollisions: l = true,
      collisionBoundary: c = [],
      collisionPadding: d = 0,
      sticky: u = "partial",
      hideWhenDetached: g = false,
      updatePositionStrategy: f = "optimized",
      onPlaced: w,
      ...p
    } = e, v = $s(fi, r), [m, x] = E.useState(null), k = De(t, (ye) => x(ye)), [_, S] = E.useState(null), R = gm(_), A = (R == null ? void 0 : R.width) ?? 0, T = (R == null ? void 0 : R.height) ?? 0, D = n + (i !== "center" ? "-" + i : ""), U = typeof d == "number" ? d : { top: 0, right: 0, bottom: 0, left: 0, ...d }, M = Array.isArray(c) ? c : [c], C = M.length > 0, P = {
      padding: U,
      boundary: M.filter(ym),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: C
    }, { refs: y, floatingStyles: F, placement: te, isPositioned: W, middlewareData: $ } = im({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: D,
      whileElementsMounted: (...ye) => Yh(...ye, {
        animationFrame: f === "always"
      }),
      elements: {
        reference: v.anchor
      },
      middleware: [
        sm({ mainAxis: o + T, alignmentAxis: a }),
        l && lm({
          mainAxis: true,
          crossAxis: false,
          limiter: u === "partial" ? cm() : void 0,
          ...P
        }),
        l && dm({ ...P }),
        um({
          ...P,
          apply: ({ elements: ye, rects: b, availableWidth: K, availableHeight: H }) => {
            const { width: j, height: N } = b.reference, L = ye.floating.style;
            L.setProperty("--radix-popper-available-width", `${K}px`), L.setProperty("--radix-popper-available-height", `${H}px`), L.setProperty("--radix-popper-anchor-width", `${j}px`), L.setProperty("--radix-popper-anchor-height", `${N}px`);
          }
        }),
        _ && pm({ element: _, padding: s }),
        km({ arrowWidth: A, arrowHeight: T }),
        g && fm({ strategy: "referenceHidden", ...P })
      ]
    }), [V, ne] = Xs(te), z2 = Ot(w);
    We(() => {
      W && (z2 == null || z2());
    }, [W, z2]);
    const O = (q = $.arrow) == null ? void 0 : q.x, Q = (ae = $.arrow) == null ? void 0 : ae.y, G = ((ce = $.arrow) == null ? void 0 : ce.centerOffset) !== 0, [J, de] = E.useState();
    return We(() => {
      m && de(window.getComputedStyle(m).zIndex);
    }, [m]), /* @__PURE__ */ h.jsx(
      "div",
      {
        ref: y.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...F,
          transform: W ? F.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: J,
          "--radix-popper-transform-origin": [
            (oe = $.transformOrigin) == null ? void 0 : oe.x,
            (ue = $.transformOrigin) == null ? void 0 : ue.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((he = $.hide) == null ? void 0 : he.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ h.jsx(
          bm,
          {
            scope: r,
            placedSide: V,
            onArrowChange: S,
            arrowX: O,
            arrowY: Q,
            shouldHideArrow: G,
            children: /* @__PURE__ */ h.jsx(
              Oe.div,
              {
                "data-side": V,
                "data-align": ne,
                ...p,
                ref: k,
                style: {
                  ...p.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: W ? void 0 : "none"
                }
              }
            )
          }
        )
      }
    );
  }
);
Gs.displayName = fi;
var Ks = "PopperArrow", wm = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Ys = E.forwardRef(function(t, r) {
  const { __scopePopper: n, ...o } = t, i = xm(Ks, n), a = wm[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ h.jsx(
      "span",
      {
        ref: i.onArrowChange,
        style: {
          position: "absolute",
          left: i.arrowX,
          top: i.arrowY,
          [a]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[i.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[i.placedSide],
          visibility: i.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ h.jsx(
          mm,
          {
            ...o,
            ref: r,
            style: {
              ...o.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
Ys.displayName = Ks;
function ym(e) {
  return e !== null;
}
var km = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var v, m, x;
    const { placement: r, rects: n, middlewareData: o } = t, a = ((v = o.arrow) == null ? void 0 : v.centerOffset) !== 0, s = a ? 0 : e.arrowWidth, l = a ? 0 : e.arrowHeight, [c, d] = Xs(r), u = { start: "0%", center: "50%", end: "100%" }[d], g = (((m = o.arrow) == null ? void 0 : m.x) ?? 0) + s / 2, f = (((x = o.arrow) == null ? void 0 : x.y) ?? 0) + l / 2;
    let w = "", p = "";
    return c === "bottom" ? (w = a ? u : `${g}px`, p = `${-l}px`) : c === "top" ? (w = a ? u : `${g}px`, p = `${n.floating.height + l}px`) : c === "right" ? (w = `${-l}px`, p = a ? u : `${f}px`) : c === "left" && (w = `${n.floating.width + l}px`, p = a ? u : `${f}px`), { data: { x: w, y: p } };
  }
});
function Xs(e) {
  const [t, r = "center"] = e.split("-");
  return [t, r];
}
var Fn = Zs, hi = Gs, mi = Ys, _m = "Portal", Bn = E.forwardRef((e, t) => {
  var s;
  const { container: r, ...n } = e, [o, i] = E.useState(false);
  We(() => i(true), []);
  const a = r || o && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return a ? Sn__default.createPortal(/* @__PURE__ */ h.jsx(Oe.div, { ...n, ref: t }), a) : null;
});
Bn.displayName = _m;
function zm(e) {
  const t = E.useRef({ value: e, previous: e });
  return E.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
var qs = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), Nm = "VisuallyHidden", Js = E.forwardRef(
  (e, t) => /* @__PURE__ */ h.jsx(
    Oe.span,
    {
      ...e,
      ref: t,
      style: { ...qs, ...e.style }
    }
  )
);
Js.displayName = Nm;
var Am = Js, jm = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Bt = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap(), Yr = {}, uo = 0, Qs = function(e) {
  return e && (e.host || Qs(e.parentNode));
}, Rm = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = Qs(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, Tm = function(e, t, r, n) {
  var o = Rm(t, Array.isArray(e) ? e : [e]);
  Yr[r] || (Yr[r] = /* @__PURE__ */ new WeakMap());
  var i = Yr[r], a = [], s = /* @__PURE__ */ new Set(), l = new Set(o), c = function(u) {
    !u || s.has(u) || (s.add(u), c(u.parentNode));
  };
  o.forEach(c);
  var d = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(g) {
      if (s.has(g))
        d(g);
      else
        try {
          var f = g.getAttribute(n), w = f !== null && f !== "false", p = (Bt.get(g) || 0) + 1, v = (i.get(g) || 0) + 1;
          Bt.set(g, p), i.set(g, v), a.push(g), p === 1 && w && Kr.set(g, true), v === 1 && g.setAttribute(r, "true"), w || g.setAttribute(n, "true");
        } catch (m) {
          console.error("aria-hidden: cannot operate on ", g, m);
        }
    });
  };
  return d(t), s.clear(), uo++, function() {
    a.forEach(function(u) {
      var g = Bt.get(u) - 1, f = i.get(u) - 1;
      Bt.set(u, g), i.set(u, f), g || (Kr.has(u) || u.removeAttribute(n), Kr.delete(u)), f || u.removeAttribute(r);
    }), uo--, uo || (Bt = /* @__PURE__ */ new WeakMap(), Bt = /* @__PURE__ */ new WeakMap(), Kr = /* @__PURE__ */ new WeakMap(), Yr = {});
  };
}, el = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = jm(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), Tm(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, at = function() {
  return at = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
    }
    return t;
  }, at.apply(this, arguments);
};
function tl(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function Om(e, t, r) {
  for (var n = 0, o = t.length, i; n < o; n++)
    (i || !(n in t)) && (i || (i = Array.prototype.slice.call(t, 0, n)), i[n] = t[n]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var on = "right-scroll-bar-position", an = "width-before-scroll-bar", Im = "with-scroll-bars-hidden", Dm = "--removed-body-scroll-bar-size";
function fo(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Pm(e, t) {
  var r = useState(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
var Lm = typeof window < "u" ? E.useLayoutEffect : E.useEffect, ha = /* @__PURE__ */ new WeakMap();
function Mm(e, t) {
  var r = Pm(null, function(n) {
    return e.forEach(function(o) {
      return fo(o, n);
    });
  });
  return Lm(function() {
    var n = ha.get(r);
    if (n) {
      var o = new Set(n), i = new Set(e), a = r.current;
      o.forEach(function(s) {
        i.has(s) || fo(s, null);
      }), i.forEach(function(s) {
        o.has(s) || fo(s, a);
      });
    }
    ha.set(r, e);
  }, [e]), r;
}
function Fm(e) {
  return e;
}
function Bm(e, t) {
  t === void 0 && (t = Fm);
  var r = [], n = false, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(i) {
      var a = t(i, n);
      return r.push(a), function() {
        r = r.filter(function(s) {
          return s !== a;
        });
      };
    },
    assignSyncMedium: function(i) {
      for (n = true; r.length; ) {
        var a = r;
        r = [], a.forEach(i);
      }
      r = {
        push: function(s) {
          return i(s);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(i) {
      n = true;
      var a = [];
      if (r.length) {
        var s = r;
        r = [], s.forEach(i), a = r;
      }
      var l = function() {
        var d = a;
        a = [], d.forEach(i);
      }, c = function() {
        return Promise.resolve().then(l);
      };
      c(), r = {
        push: function(d) {
          a.push(d), c();
        },
        filter: function(d) {
          return a = a.filter(d), r;
        }
      };
    }
  };
  return o;
}
function Um(e) {
  e === void 0 && (e = {});
  var t = Bm(null);
  return t.options = at({ async: true, ssr: false }, e), t;
}
var rl = function(e) {
  var t = e.sideCar, r = tl(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return E.createElement(n, at({}, r));
};
rl.isSideCarExport = true;
function Wm(e, t) {
  return e.useMedium(t), rl;
}
var nl = Um(), po = function() {
}, Un = E.forwardRef(function(e, t) {
  var r = E.useRef(null), n = E.useState({
    onScrollCapture: po,
    onWheelCapture: po,
    onTouchMoveCapture: po
  }), o = n[0], i = n[1], a = e.forwardProps, s = e.children, l = e.className, c = e.removeScrollBar, d = e.enabled, u = e.shards, g = e.sideCar, f = e.noRelative, w = e.noIsolation, p = e.inert, v = e.allowPinchZoom, m = e.as, x = m === void 0 ? "div" : m, k = e.gapMode, _ = tl(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), S = g, R = Mm([r, t]), A = at(at({}, _), o);
  return E.createElement(
    E.Fragment,
    null,
    d && E.createElement(S, { sideCar: nl, removeScrollBar: c, shards: u, noRelative: f, noIsolation: w, inert: p, setCallbacks: i, allowPinchZoom: !!v, lockRef: r, gapMode: k }),
    a ? E.cloneElement(E.Children.only(s), at(at({}, A), { ref: R })) : E.createElement(x, at({}, A, { className: l, ref: R }), s)
  );
});
Un.defaultProps = {
  enabled: true,
  removeScrollBar: true,
  inert: false
};
Un.classNames = {
  fullWidth: an,
  zeroRight: on
};
var $m = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Hm() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = $m();
  return t && e.setAttribute("nonce", t), e;
}
function Vm(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Zm(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Gm = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = Hm()) && (Vm(t, r), Zm(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Km = function() {
  var e = Gm();
  return function(t, r) {
    E.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, ol = function() {
  var e = Km(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, Ym = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, ho = function(e) {
  return parseInt(e || "", 10) || 0;
}, Xm = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [ho(r), ho(n), ho(o)];
}, qm = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Ym;
  var t = Xm(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, Jm = ol(), Gt = "data-scroll-locked", Qm = function(e, t, r, n) {
  var o = e.left, i = e.top, a = e.right, s = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Im, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(s, "px ").concat(n, `;
  }
  body[`).concat(Gt, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(a, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(s, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(s, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(on, ` {
    right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(an, ` {
    margin-right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(on, " .").concat(on, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(an, " .").concat(an, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(Gt, `] {
    `).concat(Dm, ": ").concat(s, `px;
  }
`);
}, ma = function() {
  var e = parseInt(document.body.getAttribute(Gt) || "0", 10);
  return isFinite(e) ? e : 0;
}, eg = function() {
  E.useEffect(function() {
    return document.body.setAttribute(Gt, (ma() + 1).toString()), function() {
      var e = ma() - 1;
      e <= 0 ? document.body.removeAttribute(Gt) : document.body.setAttribute(Gt, e.toString());
    };
  }, []);
}, tg = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  eg();
  var i = E.useMemo(function() {
    return qm(o);
  }, [o]);
  return E.createElement(Jm, { styles: Qm(i, !t, o, r ? "" : "!important") });
}, Ao = false;
if (typeof window < "u")
  try {
    var Xr = Object.defineProperty({}, "passive", {
      get: function() {
        return Ao = true, true;
      }
    });
    window.addEventListener("test", Xr, Xr), window.removeEventListener("test", Xr, Xr);
  } catch {
    Ao = false;
  }
var Ut = Ao ? { passive: false } : false, rg = function(e) {
  return e.tagName === "TEXTAREA";
}, il = function(e, t) {
  if (!(e instanceof Element))
    return false;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !rg(e) && r[t] === "visible")
  );
}, ng = function(e) {
  return il(e, "overflowY");
}, og = function(e) {
  return il(e, "overflowX");
}, ga = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = al(e, n);
    if (o) {
      var i = sl(e, n), a = i[1], s = i[2];
      if (a > s)
        return true;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return false;
}, ig = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, ag = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, al = function(e, t) {
  return e === "v" ? ng(t) : og(t);
}, sl = function(e, t) {
  return e === "v" ? ig(t) : ag(t);
}, sg = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, lg = function(e, t, r, n, o) {
  var i = sg(e, window.getComputedStyle(t).direction), a = i * n, s = r.target, l = t.contains(s), c = false, d = a > 0, u = 0, g = 0;
  do {
    if (!s)
      break;
    var f = sl(e, s), w = f[0], p = f[1], v = f[2], m = p - v - i * w;
    (w || m) && al(e, s) && (u += m, g += w);
    var x = s.parentNode;
    s = x && x.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? x.host : x;
  } while (
    // portaled content
    !l && s !== document.body || // self content
    l && (t.contains(s) || t === s)
  );
  return (d && Math.abs(u) < 1 || !d && Math.abs(g) < 1) && (c = true), c;
}, qr = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, va = function(e) {
  return [e.deltaX, e.deltaY];
}, ba = function(e) {
  return e && "current" in e ? e.current : e;
}, cg = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, dg = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, ug = 0, Wt = [];
function fg(e) {
  var t = E.useRef([]), r = E.useRef([0, 0]), n = E.useRef(), o = E.useState(ug++)[0], i = E.useState(ol)[0], a = E.useRef(e);
  E.useEffect(function() {
    a.current = e;
  }, [e]), E.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var p = Om([e.lockRef.current], (e.shards || []).map(ba)).filter(Boolean);
      return p.forEach(function(v) {
        return v.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), p.forEach(function(v) {
          return v.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = E.useCallback(function(p, v) {
    if ("touches" in p && p.touches.length === 2 || p.type === "wheel" && p.ctrlKey)
      return !a.current.allowPinchZoom;
    var m = qr(p), x = r.current, k = "deltaX" in p ? p.deltaX : x[0] - m[0], _ = "deltaY" in p ? p.deltaY : x[1] - m[1], S, R = p.target, A = Math.abs(k) > Math.abs(_) ? "h" : "v";
    if ("touches" in p && A === "h" && R.type === "range")
      return false;
    var T = window.getSelection(), D = T && T.anchorNode, U = D ? D === R || D.contains(R) : false;
    if (U)
      return false;
    var M = ga(A, R);
    if (!M)
      return true;
    if (M ? S = A : (S = A === "v" ? "h" : "v", M = ga(A, R)), !M)
      return false;
    if (!n.current && "changedTouches" in p && (k || _) && (n.current = S), !S)
      return true;
    var C = n.current || S;
    return lg(C, v, p, C === "h" ? k : _);
  }, []), l = E.useCallback(function(p) {
    var v = p;
    if (!(!Wt.length || Wt[Wt.length - 1] !== i)) {
      var m = "deltaY" in v ? va(v) : qr(v), x = t.current.filter(function(S) {
        return S.name === v.type && (S.target === v.target || v.target === S.shadowParent) && cg(S.delta, m);
      })[0];
      if (x && x.should) {
        v.cancelable && v.preventDefault();
        return;
      }
      if (!x) {
        var k = (a.current.shards || []).map(ba).filter(Boolean).filter(function(S) {
          return S.contains(v.target);
        }), _ = k.length > 0 ? s(v, k[0]) : !a.current.noIsolation;
        _ && v.cancelable && v.preventDefault();
      }
    }
  }, []), c = E.useCallback(function(p, v, m, x) {
    var k = { name: p, delta: v, target: m, should: x, shadowParent: pg(m) };
    t.current.push(k), setTimeout(function() {
      t.current = t.current.filter(function(_) {
        return _ !== k;
      });
    }, 1);
  }, []), d = E.useCallback(function(p) {
    r.current = qr(p), n.current = void 0;
  }, []), u = E.useCallback(function(p) {
    c(p.type, va(p), p.target, s(p, e.lockRef.current));
  }, []), g = E.useCallback(function(p) {
    c(p.type, qr(p), p.target, s(p, e.lockRef.current));
  }, []);
  E.useEffect(function() {
    return Wt.push(i), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: g
    }), document.addEventListener("wheel", l, Ut), document.addEventListener("touchmove", l, Ut), document.addEventListener("touchstart", d, Ut), function() {
      Wt = Wt.filter(function(p) {
        return p !== i;
      }), document.removeEventListener("wheel", l, Ut), document.removeEventListener("touchmove", l, Ut), document.removeEventListener("touchstart", d, Ut);
    };
  }, []);
  var f = e.removeScrollBar, w = e.inert;
  return E.createElement(
    E.Fragment,
    null,
    w ? E.createElement(i, { styles: dg(o) }) : null,
    f ? E.createElement(tg, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function pg(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const hg = Wm(nl, fg);
var gi = E.forwardRef(function(e, t) {
  return E.createElement(Un, at({}, e, { ref: t, sideCar: hg }));
});
gi.classNames = Un.classNames;
var mg = [" ", "Enter", "ArrowUp", "ArrowDown"], gg = [" ", "Enter"], Dt = "Select", [Wn, $n, vg] = Dp(Dt), [sr] = jr(Dt, [
  vg,
  ar
]), Hn = ar(), [bg, zt] = sr(Dt), [xg, wg] = sr(Dt);
var cl = "SelectTrigger", dl = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, disabled: n = false, ...o } = e, i = Hn(r), a = zt(cl, r), s = a.disabled || n, l = De(t, a.onTriggerChange), c = $n(r), d = E.useRef("touch"), [u, g, f] = jl((p) => {
      const v = c().filter((k) => !k.disabled), m = v.find((k) => k.value === a.value), x = Rl(v, p, m);
      x !== void 0 && a.onValueChange(x.value);
    }), w = (p) => {
      s || (a.onOpenChange(true), f()), p && (a.triggerPointerDownPosRef.current = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      });
    };
    return /* @__PURE__ */ h.jsx(Fn, { asChild: true, ...i, children: /* @__PURE__ */ h.jsx(
      Oe.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": a.contentId,
        "aria-expanded": a.open,
        "aria-required": a.required,
        "aria-autocomplete": "none",
        dir: a.dir,
        "data-state": a.open ? "open" : "closed",
        disabled: s,
        "data-disabled": s ? "" : void 0,
        "data-placeholder": Al(a.value) ? "" : void 0,
        ...o,
        ref: l,
        onClick: ze(o.onClick, (p) => {
          p.currentTarget.focus(), d.current !== "mouse" && w(p);
        }),
        onPointerDown: ze(o.onPointerDown, (p) => {
          d.current = p.pointerType;
          const v = p.target;
          v.hasPointerCapture(p.pointerId) && v.releasePointerCapture(p.pointerId), p.button === 0 && p.ctrlKey === false && p.pointerType === "mouse" && (w(p), p.preventDefault());
        }),
        onKeyDown: ze(o.onKeyDown, (p) => {
          const v = u.current !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && g(p.key), !(v && p.key === " ") && mg.includes(p.key) && (w(), p.preventDefault());
        })
      }
    ) });
  }
);
dl.displayName = cl;
var ul = "SelectValue", fl = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, children: i, placeholder: a = "", ...s } = e, l = zt(ul, r), { onValueNodeHasChildrenChange: c } = l, d = i !== void 0, u = De(t, l.onValueNodeChange);
    return We(() => {
      c(d);
    }, [c, d]), /* @__PURE__ */ h.jsx(
      Oe.span,
      {
        ...s,
        ref: u,
        style: { pointerEvents: "none" },
        children: Al(l.value) ? /* @__PURE__ */ h.jsx(h.Fragment, { children: a }) : i
      }
    );
  }
);
fl.displayName = ul;
var yg = "SelectIcon", pl = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, children: n, ...o } = e;
    return /* @__PURE__ */ h.jsx(Oe.span, { "aria-hidden": true, ...o, ref: t, children: n || "▼" });
  }
);
pl.displayName = yg;
var kg = "SelectPortal", hl = (e) => /* @__PURE__ */ h.jsx(Bn, { asChild: true, ...e });
hl.displayName = kg;
var Pt = "SelectContent", ml = E.forwardRef(
  (e, t) => {
    const r = zt(Pt, e.__scopeSelect), [n, o] = E.useState();
    if (We(() => {
      o(new DocumentFragment());
    }, []), !r.open) {
      const i = n;
      return i ? Sn.createPortal(
        /* @__PURE__ */ h.jsx(gl, { scope: e.__scopeSelect, children: /* @__PURE__ */ h.jsx(Wn.Slot, { scope: e.__scopeSelect, children: /* @__PURE__ */ h.jsx("div", { children: e.children }) }) }),
        i
      ) : null;
    }
    return /* @__PURE__ */ h.jsx(vl, { ...e, ref: t });
  }
);
ml.displayName = Pt;
var Qe = 10, [gl, Nt] = sr(Pt), _g = "SelectContentImpl", Sg = /* @__PURE__ */ Yt("SelectContent.RemoveScroll"), vl = E.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      position: n = "item-aligned",
      onCloseAutoFocus: o,
      onEscapeKeyDown: i,
      onPointerDownOutside: a,
      //
      // PopperContent props
      side: s,
      sideOffset: l,
      align: c,
      alignOffset: d,
      arrowPadding: u,
      collisionBoundary: g,
      collisionPadding: f,
      sticky: w,
      hideWhenDetached: p,
      avoidCollisions: v,
      //
      ...m
    } = e, x = zt(Pt, r), [k, _] = E.useState(null), [S, R] = E.useState(null), A = De(t, (q) => _(q)), [T, D] = E.useState(null), [U, M] = E.useState(
      null
    ), C = $n(r), [P, y] = E.useState(false), F = E.useRef(false);
    E.useEffect(() => {
      if (k) return el(k);
    }, [k]), Ns();
    const te = E.useCallback(
      (q) => {
        const [ae, ...ce] = C().map((he) => he.ref.current), [oe] = ce.slice(-1), ue = document.activeElement;
        for (const he of q)
          if (he === ue || (he == null || he.scrollIntoView({ block: "nearest" }), he === ae && S && (S.scrollTop = 0), he === oe && S && (S.scrollTop = S.scrollHeight), he == null || he.focus(), document.activeElement !== ue)) return;
      },
      [C, S]
    ), W = E.useCallback(
      () => te([T, k]),
      [te, T, k]
    );
    E.useEffect(() => {
      P && W();
    }, [P, W]);
    const { onOpenChange: $, triggerPointerDownPosRef: V } = x;
    E.useEffect(() => {
      if (k) {
        let q = { x: 0, y: 0 };
        const ae = (oe) => {
          var ue, he;
          q = {
            x: Math.abs(Math.round(oe.pageX) - (((ue = V.current) == null ? void 0 : ue.x) ?? 0)),
            y: Math.abs(Math.round(oe.pageY) - (((he = V.current) == null ? void 0 : he.y) ?? 0))
          };
        }, ce = (oe) => {
          q.x <= 10 && q.y <= 10 ? oe.preventDefault() : k.contains(oe.target) || $(false), document.removeEventListener("pointermove", ae), V.current = null;
        };
        return V.current !== null && (document.addEventListener("pointermove", ae), document.addEventListener("pointerup", ce, { capture: true, once: true })), () => {
          document.removeEventListener("pointermove", ae), document.removeEventListener("pointerup", ce, { capture: true });
        };
      }
    }, [k, $, V]), E.useEffect(() => {
      const q = () => $(false);
      return window.addEventListener("blur", q), window.addEventListener("resize", q), () => {
        window.removeEventListener("blur", q), window.removeEventListener("resize", q);
      };
    }, [$]);
    const [ne, z2] = jl((q) => {
      const ae = C().filter((ue) => !ue.disabled), ce = ae.find((ue) => ue.ref.current === document.activeElement), oe = Rl(ae, q, ce);
      oe && setTimeout(() => oe.ref.current.focus());
    }), O = E.useCallback(
      (q, ae, ce) => {
        const oe = !F.current && !ce;
        (x.value !== void 0 && x.value === ae || oe) && (D(q), oe && (F.current = true));
      },
      [x.value]
    ), Q = E.useCallback(() => k == null ? void 0 : k.focus(), [k]), G = E.useCallback(
      (q, ae, ce) => {
        const oe = !F.current && !ce;
        (x.value !== void 0 && x.value === ae || oe) && M(q);
      },
      [x.value]
    ), J = n === "popper" ? jo : bl, de = J === jo ? {
      side: s,
      sideOffset: l,
      align: c,
      alignOffset: d,
      arrowPadding: u,
      collisionBoundary: g,
      collisionPadding: f,
      sticky: w,
      hideWhenDetached: p,
      avoidCollisions: v
    } : {};
    return /* @__PURE__ */ h.jsx(
      gl,
      {
        scope: r,
        content: k,
        viewport: S,
        onViewportChange: R,
        itemRefCallback: O,
        selectedItem: T,
        onItemLeave: Q,
        itemTextRefCallback: G,
        focusSelectedItem: W,
        selectedItemText: U,
        position: n,
        isPositioned: P,
        searchRef: ne,
        children: /* @__PURE__ */ h.jsx(gi, { as: Sg, allowPinchZoom: true, children: /* @__PURE__ */ h.jsx(
          oi,
          {
            asChild: true,
            trapped: x.open,
            onMountAutoFocus: (q) => {
              q.preventDefault();
            },
            onUnmountAutoFocus: ze(o, (q) => {
              var ae;
              (ae = x.trigger) == null || ae.focus({ preventScroll: true }), q.preventDefault();
            }),
            children: /* @__PURE__ */ h.jsx(
              In,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown: i,
                onPointerDownOutside: a,
                onFocusOutside: (q) => q.preventDefault(),
                onDismiss: () => x.onOpenChange(false),
                children: /* @__PURE__ */ h.jsx(
                  J,
                  {
                    role: "listbox",
                    id: x.contentId,
                    "data-state": x.open ? "open" : "closed",
                    dir: x.dir,
                    onContextMenu: (q) => q.preventDefault(),
                    ...m,
                    ...de,
                    onPlaced: () => y(true),
                    ref: A,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...m.style
                    },
                    onKeyDown: ze(m.onKeyDown, (q) => {
                      const ae = q.ctrlKey || q.altKey || q.metaKey;
                      if (q.key === "Tab" && q.preventDefault(), !ae && q.key.length === 1 && z2(q.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(q.key)) {
                        let oe = C().filter((ue) => !ue.disabled).map((ue) => ue.ref.current);
                        if (["ArrowUp", "End"].includes(q.key) && (oe = oe.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(q.key)) {
                          const ue = q.target, he = oe.indexOf(ue);
                          oe = oe.slice(he + 1);
                        }
                        setTimeout(() => te(oe)), q.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
vl.displayName = _g;
var Cg = "SelectItemAlignedPosition", bl = E.forwardRef((e, t) => {
  const { __scopeSelect: r, onPlaced: n, ...o } = e, i = zt(Pt, r), a = Nt(Pt, r), [s, l] = E.useState(null), [c, d] = E.useState(null), u = De(t, (A) => d(A)), g = $n(r), f = E.useRef(false), w = E.useRef(true), { viewport: p, selectedItem: v, selectedItemText: m, focusSelectedItem: x } = a, k = E.useCallback(() => {
    if (i.trigger && i.valueNode && s && c && p && v && m) {
      const A = i.trigger.getBoundingClientRect(), T = c.getBoundingClientRect(), D = i.valueNode.getBoundingClientRect(), U = m.getBoundingClientRect();
      if (i.dir !== "rtl") {
        const ue = U.left - T.left, he = D.left - ue, ye = A.left - he, b = A.width + ye, K = Math.max(b, T.width), H = window.innerWidth - Qe, j = Ki(he, [
          Qe,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(Qe, H - K)
        ]);
        s.style.minWidth = b + "px", s.style.left = j + "px";
      } else {
        const ue = T.right - U.right, he = window.innerWidth - D.right - ue, ye = window.innerWidth - A.right - he, b = A.width + ye, K = Math.max(b, T.width), H = window.innerWidth - Qe, j = Ki(he, [
          Qe,
          Math.max(Qe, H - K)
        ]);
        s.style.minWidth = b + "px", s.style.right = j + "px";
      }
      const M = g(), C = window.innerHeight - Qe * 2, P = p.scrollHeight, y = window.getComputedStyle(c), F = parseInt(y.borderTopWidth, 10), te = parseInt(y.paddingTop, 10), W = parseInt(y.borderBottomWidth, 10), $ = parseInt(y.paddingBottom, 10), V = F + te + P + $ + W, ne = Math.min(v.offsetHeight * 5, V), z2 = window.getComputedStyle(p), O = parseInt(z2.paddingTop, 10), Q = parseInt(z2.paddingBottom, 10), G = A.top + A.height / 2 - Qe, J = C - G, de = v.offsetHeight / 2, q = v.offsetTop + de, ae = F + te + q, ce = V - ae;
      if (ae <= G) {
        const ue = M.length > 0 && v === M[M.length - 1].ref.current;
        s.style.bottom = "0px";
        const he = c.clientHeight - p.offsetTop - p.offsetHeight, ye = Math.max(
          J,
          de + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (ue ? Q : 0) + he + W
        ), b = ae + ye;
        s.style.height = b + "px";
      } else {
        const ue = M.length > 0 && v === M[0].ref.current;
        s.style.top = "0px";
        const ye = Math.max(
          G,
          F + p.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (ue ? O : 0) + de
        ) + ce;
        s.style.height = ye + "px", p.scrollTop = ae - G + p.offsetTop;
      }
      s.style.margin = `${Qe}px 0`, s.style.minHeight = ne + "px", s.style.maxHeight = C + "px", n == null || n(), requestAnimationFrame(() => f.current = true);
    }
  }, [
    g,
    i.trigger,
    i.valueNode,
    s,
    c,
    p,
    v,
    m,
    i.dir,
    n
  ]);
  We(() => k(), [k]);
  const [_, S] = E.useState();
  We(() => {
    c && S(window.getComputedStyle(c).zIndex);
  }, [c]);
  const R = E.useCallback(
    (A) => {
      A && w.current === true && (k(), x == null || x(), w.current = false);
    },
    [k, x]
  );
  return /* @__PURE__ */ h.jsx(
    zg,
    {
      scope: r,
      contentWrapper: s,
      shouldExpandOnScrollRef: f,
      onScrollButtonChange: R,
      children: /* @__PURE__ */ h.jsx(
        "div",
        {
          ref: l,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: _
          },
          children: /* @__PURE__ */ h.jsx(
            Oe.div,
            {
              ...o,
              ref: u,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...o.style
              }
            }
          )
        }
      )
    }
  );
});
bl.displayName = Cg;
var Eg = "SelectPopperPosition", jo = E.forwardRef((e, t) => {
  const {
    __scopeSelect: r,
    align: n = "start",
    collisionPadding: o = Qe,
    ...i
  } = e, a = Hn(r);
  return /* @__PURE__ */ h.jsx(
    hi,
    {
      ...a,
      ...i,
      ref: t,
      align: n,
      collisionPadding: o,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...i.style,
        "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width": "var(--radix-popper-available-width)",
        "--radix-select-content-available-height": "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
      }
    }
  );
});
jo.displayName = Eg;
var [zg, vi] = sr(Pt, {}), Ro = "SelectViewport", xl = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, nonce: n, ...o } = e, i = Nt(Ro, r), a = vi(Ro, r), s = De(t, i.onViewportChange), l = E.useRef(0);
    return /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: n
        }
      ),
      /* @__PURE__ */ h.jsx(Wn.Slot, { scope: r, children: /* @__PURE__ */ h.jsx(
        Oe.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...o,
          ref: s,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...o.style
          },
          onScroll: ze(o.onScroll, (c) => {
            const d = c.currentTarget, { contentWrapper: u, shouldExpandOnScrollRef: g } = a;
            if (g != null && g.current && u) {
              const f = Math.abs(l.current - d.scrollTop);
              if (f > 0) {
                const w = window.innerHeight - Qe * 2, p = parseFloat(u.style.minHeight), v = parseFloat(u.style.height), m = Math.max(p, v);
                if (m < w) {
                  const x = m + f, k = Math.min(w, x), _ = x - k;
                  u.style.height = k + "px", u.style.bottom === "0px" && (d.scrollTop = _ > 0 ? _ : 0, u.style.justifyContent = "flex-end");
                }
              }
            }
            l.current = d.scrollTop;
          })
        }
      ) })
    ] });
  }
);
xl.displayName = Ro;
var wl = "SelectGroup", [Ng, Ag] = sr(wl), jg = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Rr();
    return /* @__PURE__ */ h.jsx(Ng, { scope: r, id: o, children: /* @__PURE__ */ h.jsx(Oe.div, { role: "group", "aria-labelledby": o, ...n, ref: t }) });
  }
);
jg.displayName = wl;
var yl = "SelectLabel", Rg = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Ag(yl, r);
    return /* @__PURE__ */ h.jsx(Oe.div, { id: o.id, ...n, ref: t });
  }
);
Rg.displayName = yl;
var wn = "SelectItem", [Tg, kl] = sr(wn), _l = E.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      value: n,
      disabled: o = false,
      textValue: i,
      ...a
    } = e, s = zt(wn, r), l = Nt(wn, r), c = s.value === n, [d, u] = E.useState(i ?? ""), [g, f] = E.useState(false), w = De(
      t,
      (x) => {
        var k;
        return (k = l.itemRefCallback) == null ? void 0 : k.call(l, x, n, o);
      }
    ), p = Rr(), v = E.useRef("touch"), m = () => {
      o || (s.onValueChange(n), s.onOpenChange(false));
    };
    if (n === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ h.jsx(
      Tg,
      {
        scope: r,
        value: n,
        disabled: o,
        textId: p,
        isSelected: c,
        onItemTextChange: E.useCallback((x) => {
          u((k) => k || ((x == null ? void 0 : x.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ h.jsx(
          Wn.ItemSlot,
          {
            scope: r,
            value: n,
            disabled: o,
            textValue: d,
            children: /* @__PURE__ */ h.jsx(
              Oe.div,
              {
                role: "option",
                "aria-labelledby": p,
                "data-highlighted": g ? "" : void 0,
                "aria-selected": c && g,
                "data-state": c ? "checked" : "unchecked",
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                tabIndex: o ? void 0 : -1,
                ...a,
                ref: w,
                onFocus: ze(a.onFocus, () => f(true)),
                onBlur: ze(a.onBlur, () => f(false)),
                onClick: ze(a.onClick, () => {
                  v.current !== "mouse" && m();
                }),
                onPointerUp: ze(a.onPointerUp, () => {
                  v.current === "mouse" && m();
                }),
                onPointerDown: ze(a.onPointerDown, (x) => {
                  v.current = x.pointerType;
                }),
                onPointerMove: ze(a.onPointerMove, (x) => {
                  var k;
                  v.current = x.pointerType, o ? (k = l.onItemLeave) == null || k.call(l) : v.current === "mouse" && x.currentTarget.focus({ preventScroll: true });
                }),
                onPointerLeave: ze(a.onPointerLeave, (x) => {
                  var k;
                  x.currentTarget === document.activeElement && ((k = l.onItemLeave) == null || k.call(l));
                }),
                onKeyDown: ze(a.onKeyDown, (x) => {
                  var _;
                  ((_ = l.searchRef) == null ? void 0 : _.current) !== "" && x.key === " " || (gg.includes(x.key) && m(), x.key === " " && x.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
_l.displayName = wn;
var mr = "SelectItemText", Sl = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, ...i } = e, a = zt(mr, r), s = Nt(mr, r), l = kl(mr, r), c = wg(mr, r), [d, u] = E.useState(null), g = De(
      t,
      (m) => u(m),
      l.onItemTextChange,
      (m) => {
        var x;
        return (x = s.itemTextRefCallback) == null ? void 0 : x.call(s, m, l.value, l.disabled);
      }
    ), f = d == null ? void 0 : d.textContent, w = E.useMemo(
      () => /* @__PURE__ */ h.jsx("option", { value: l.value, disabled: l.disabled, children: f }, l.value),
      [l.disabled, l.value, f]
    ), { onNativeOptionAdd: p, onNativeOptionRemove: v } = c;
    return We(() => (p(w), () => v(w)), [p, v, w]), /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
      /* @__PURE__ */ h.jsx(Oe.span, { id: l.textId, ...i, ref: g }),
      l.isSelected && a.valueNode && !a.valueNodeHasChildren ? Sn.createPortal(i.children, a.valueNode) : null
    ] });
  }
);
Sl.displayName = mr;
var Cl = "SelectItemIndicator", El = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return kl(Cl, r).isSelected ? /* @__PURE__ */ h.jsx(Oe.span, { "aria-hidden": true, ...n, ref: t }) : null;
  }
);
El.displayName = Cl;
var To = "SelectScrollUpButton", Og = E.forwardRef((e, t) => {
  const r = Nt(To, e.__scopeSelect), n = vi(To, e.__scopeSelect), [o, i] = E.useState(false), a = De(t, n.onScrollButtonChange);
  return We(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const c = l.scrollTop > 0;
        i(c);
      };
      const l = r.viewport;
      return s(), l.addEventListener("scroll", s), () => l.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ h.jsx(
    zl,
    {
      ...e,
      ref: a,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: l } = r;
        s && l && (s.scrollTop = s.scrollTop - l.offsetHeight);
      }
    }
  ) : null;
});
Og.displayName = To;
var Oo = "SelectScrollDownButton", Ig = E.forwardRef((e, t) => {
  const r = Nt(Oo, e.__scopeSelect), n = vi(Oo, e.__scopeSelect), [o, i] = E.useState(false), a = De(t, n.onScrollButtonChange);
  return We(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const c = l.scrollHeight - l.clientHeight, d = Math.ceil(l.scrollTop) < c;
        i(d);
      };
      const l = r.viewport;
      return s(), l.addEventListener("scroll", s), () => l.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ h.jsx(
    zl,
    {
      ...e,
      ref: a,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: l } = r;
        s && l && (s.scrollTop = s.scrollTop + l.offsetHeight);
      }
    }
  ) : null;
});
Ig.displayName = Oo;
var zl = E.forwardRef((e, t) => {
  const { __scopeSelect: r, onAutoScroll: n, ...o } = e, i = Nt("SelectScrollButton", r), a = E.useRef(null), s = $n(r), l = E.useCallback(() => {
    a.current !== null && (window.clearInterval(a.current), a.current = null);
  }, []);
  return E.useEffect(() => () => l(), [l]), We(() => {
    var d;
    const c = s().find((u) => u.ref.current === document.activeElement);
    (d = c == null ? void 0 : c.ref.current) == null || d.scrollIntoView({ block: "nearest" });
  }, [s]), /* @__PURE__ */ h.jsx(
    Oe.div,
    {
      "aria-hidden": true,
      ...o,
      ref: t,
      style: { flexShrink: 0, ...o.style },
      onPointerDown: ze(o.onPointerDown, () => {
        a.current === null && (a.current = window.setInterval(n, 50));
      }),
      onPointerMove: ze(o.onPointerMove, () => {
        var c;
        (c = i.onItemLeave) == null || c.call(i), a.current === null && (a.current = window.setInterval(n, 50));
      }),
      onPointerLeave: ze(o.onPointerLeave, () => {
        l();
      })
    }
  );
}), Dg = "SelectSeparator", Pg = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return /* @__PURE__ */ h.jsx(Oe.div, { "aria-hidden": true, ...n, ref: t });
  }
);
Pg.displayName = Dg;
var Io = "SelectArrow", Lg = E.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Hn(r), i = zt(Io, r), a = Nt(Io, r);
    return i.open && a.position === "popper" ? /* @__PURE__ */ h.jsx(mi, { ...o, ...n, ref: t }) : null;
  }
);
Lg.displayName = Io;
var Mg = "SelectBubbleInput", Nl = E.forwardRef(
  ({ __scopeSelect: e, value: t, ...r }, n) => {
    const o = E.useRef(null), i = De(n, o), a = zm(t);
    return E.useEffect(() => {
      const s = o.current;
      if (!s) return;
      const l = window.HTMLSelectElement.prototype, d = Object.getOwnPropertyDescriptor(
        l,
        "value"
      ).set;
      if (a !== t && d) {
        const u = new Event("change", { bubbles: true });
        d.call(s, t), s.dispatchEvent(u);
      }
    }, [a, t]), /* @__PURE__ */ h.jsx(
      Oe.select,
      {
        ...r,
        style: { ...qs, ...r.style },
        ref: i,
        defaultValue: t
      }
    );
  }
);
Nl.displayName = Mg;
function Al(e) {
  return e === "" || e === void 0;
}
function jl(e) {
  const t = Ot(e), r = E.useRef(""), n = E.useRef(0), o = E.useCallback(
    (a) => {
      const s = r.current + a;
      t(s), (function l(c) {
        r.current = c, window.clearTimeout(n.current), c !== "" && (n.current = window.setTimeout(() => l(""), 1e3));
      })(s);
    },
    [t]
  ), i = E.useCallback(() => {
    r.current = "", window.clearTimeout(n.current);
  }, []);
  return E.useEffect(() => () => window.clearTimeout(n.current), []), [r, o, i];
}
function Rl(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((c) => c === t[0]) ? t[0] : t, i = r ? e.indexOf(r) : -1;
  let a = Fg(e, Math.max(i, 0));
  o.length === 1 && (a = a.filter((c) => c !== r));
  const l = a.find(
    (c) => c.textValue.toLowerCase().startsWith(o.toLowerCase())
  );
  return l !== r ? l : void 0;
}
function Fg(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var Tl = dl, Wg = pl, $g = hl, Ol = ml, Hg = xl, Il = _l, Vg = Sl, Zg = El;
const Dl = E.forwardRef(({ className: e, children: t, ...r }, n) => /* @__PURE__ */ h.jsxs(
  Tl,
  {
    ref: n,
    className: xe(
      "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-zinc-800 bg-black px-3 py-1.5 text-left text-xs font-medium text-white outline-none",
      "hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-inset focus-visible:border-zinc-600",
      "disabled:pointer-events-none disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:gap-2",
      e
    ),
    style: { boxShadow: "none", WebkitBoxShadow: "none", MozBoxShadow: "none" },
    ...r,
    children: [
      t,
      /* @__PURE__ */ h.jsx(Wg, { asChild: true, children: /* @__PURE__ */ h.jsx(En, { className: "h-3 w-3 shrink-0 text-zinc-400", strokeWidth: 2 }) })
    ]
  }
));
Dl.displayName = Tl.displayName;
const Pl = E.forwardRef(({ className: e, children: t, position: r = "popper", ...n }, o) => /* @__PURE__ */ h.jsx($g, { children: /* @__PURE__ */ h.jsx(
  Ol,
  {
    ref: o,
    className: xe(
      "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 text-white shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      r === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      e
    ),
    position: r,
    ...n,
    children: /* @__PURE__ */ h.jsx(
      Hg,
      {
        className: xe(
          "p-1",
          r === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        ),
        children: t
      }
    )
  }
) }));
Pl.displayName = Ol.displayName;
const Ll = E.forwardRef(({ className: e, children: t, ...r }, n) => /* @__PURE__ */ h.jsxs(
  Il,
  {
    ref: n,
    className: xe(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none",
      "focus:bg-zinc-800 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...r,
    children: [
      /* @__PURE__ */ h.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ h.jsx(Zg, { children: /* @__PURE__ */ h.jsx(Vo, { className: "h-3 w-3", strokeWidth: 2 }) }) }),
      /* @__PURE__ */ h.jsx(Vg, { children: t })
    ]
  }
));
Ll.displayName = Il.displayName;
E.createContext(null);
const Ke = E.forwardRef(
  ({ className: e, variant: t = "default", size: r = "default", asChild: n = false, ...o }, i) => {
    const a = "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 cursor-pointer", s = {
      default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
      outline: "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600",
      ghost: "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800",
      destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25"
    }, l = {
      sm: "h-7 px-2.5 text-[11px]",
      default: "h-8 px-3 py-1.5 text-xs",
      lg: "h-9 px-5 text-sm",
      icon: "h-8 w-8",
      "icon-sm": "h-7 w-7",
      "icon-xs": "h-6 w-6"
    }, c = n ? Ap : "button";
    return /* @__PURE__ */ h.jsx(
      c,
      {
        ref: i,
        type: "button",
        className: xe(a, s[t], l[r], e),
        ...o
      }
    );
  }
);
Ke.displayName = "Button";
function i0(e, t) {
  return E.useReducer((r, n) => t[r][n] ?? r, e);
}
var Or = (e) => {
  const { present: t, children: r } = e, n = a0(t), o = typeof r == "function" ? r({ present: n.isPresent }) : E.Children.only(r), i = De(n.ref, s0(o));
  return typeof r == "function" || n.isPresent ? E.cloneElement(o, { ref: i }) : null;
};
Or.displayName = "Presence";
function a0(e) {
  const [t, r] = E.useState(), n = E.useRef(null), o = E.useRef(e), i = E.useRef("none"), a = e ? "mounted" : "unmounted", [s, l] = i0(a, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return E.useEffect(() => {
    const c = en(n.current);
    i.current = s === "mounted" ? c : "none";
  }, [s]), We(() => {
    const c = n.current, d = o.current;
    if (d !== e) {
      const g = i.current, f = en(c);
      e ? l("MOUNT") : f === "none" || (c == null ? void 0 : c.display) === "none" ? l("UNMOUNT") : l(d && g !== f ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, l]), We(() => {
    if (t) {
      let c;
      const d = t.ownerDocument.defaultView ?? window, u = (f) => {
        const p = en(n.current).includes(CSS.escape(f.animationName));
        if (f.target === t && p && (l("ANIMATION_END"), !o.current)) {
          const v = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", c = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = v);
          });
        }
      }, g = (f) => {
        f.target === t && (i.current = en(n.current));
      };
      return t.addEventListener("animationstart", g), t.addEventListener("animationcancel", u), t.addEventListener("animationend", u), () => {
        d.clearTimeout(c), t.removeEventListener("animationstart", g), t.removeEventListener("animationcancel", u), t.removeEventListener("animationend", u);
      };
    } else
      l("ANIMATION_END");
  }, [t, l]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: E.useCallback((c) => {
      n.current = c ? getComputedStyle(c) : null, r(c);
    }, [])
  };
}
function en(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function s0(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var [Vn] = jr("Tooltip", [
  ar
]), Zn = ar(), Zl = "TooltipProvider", Po = "tooltip.open", [c0, bi] = Vn(Zl);
var Cr = "Tooltip", [d0, Ir] = Vn(Cr);
var Lo = "TooltipTrigger", Yl = E.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = Ir(Lo, r), i = bi(Lo, r), a = Zn(r), s = E.useRef(null), l = De(t, s, o.onTriggerChange), c = E.useRef(false), d = E.useRef(false), u = E.useCallback(() => c.current = false, []);
    return E.useEffect(() => () => document.removeEventListener("pointerup", u), [u]), /* @__PURE__ */ h.jsx(Fn, { asChild: true, ...a, children: /* @__PURE__ */ h.jsx(
      Oe.button,
      {
        "aria-describedby": o.open ? o.contentId : void 0,
        "data-state": o.stateAttribute,
        ...n,
        ref: l,
        onPointerMove: ze(e.onPointerMove, (g) => {
          g.pointerType !== "touch" && !d.current && !i.isPointerInTransitRef.current && (o.onTriggerEnter(), d.current = true);
        }),
        onPointerLeave: ze(e.onPointerLeave, () => {
          o.onTriggerLeave(), d.current = false;
        }),
        onPointerDown: ze(e.onPointerDown, () => {
          o.open && o.onClose(), c.current = true, document.addEventListener("pointerup", u, { once: true });
        }),
        onFocus: ze(e.onFocus, () => {
          c.current || o.onOpen();
        }),
        onBlur: ze(e.onBlur, o.onClose),
        onClick: ze(e.onClick, o.onClose)
      }
    ) });
  }
);
Yl.displayName = Lo;
var xi = "TooltipPortal", [u0, f0] = Vn(xi, {
  forceMount: void 0
}), Xl = (e) => {
  const { __scopeTooltip: t, forceMount: r, children: n, container: o } = e, i = Ir(xi, t);
  return /* @__PURE__ */ h.jsx(u0, { scope: t, forceMount: r, children: /* @__PURE__ */ h.jsx(Or, { present: r || i.open, children: /* @__PURE__ */ h.jsx(Bn, { asChild: true, container: o, children: n }) }) });
};
Xl.displayName = xi;
var qt = "TooltipContent", ql = E.forwardRef(
  (e, t) => {
    const r = f0(qt, e.__scopeTooltip), { forceMount: n = r.forceMount, side: o = "top", ...i } = e, a = Ir(qt, e.__scopeTooltip);
    return /* @__PURE__ */ h.jsx(Or, { present: n || a.open, children: a.disableHoverableContent ? /* @__PURE__ */ h.jsx(Jl, { side: o, ...i, ref: t }) : /* @__PURE__ */ h.jsx(p0, { side: o, ...i, ref: t }) });
  }
), p0 = E.forwardRef((e, t) => {
  const r = Ir(qt, e.__scopeTooltip), n = bi(qt, e.__scopeTooltip), o = E.useRef(null), i = De(t, o), [a, s] = E.useState(null), { trigger: l, onClose: c } = r, d = o.current, { onPointerInTransitChange: u } = n, g = E.useCallback(() => {
    s(null), u(false);
  }, [u]), f = E.useCallback(
    (w, p) => {
      const v = w.currentTarget, m = { x: w.clientX, y: w.clientY }, x = b0(m, v.getBoundingClientRect()), k = x0(m, x), _ = w0(p.getBoundingClientRect()), S = k0([...k, ..._]);
      s(S), u(true);
    },
    [u]
  );
  return E.useEffect(() => () => g(), [g]), E.useEffect(() => {
    if (l && d) {
      const w = (v) => f(v, d), p = (v) => f(v, l);
      return l.addEventListener("pointerleave", w), d.addEventListener("pointerleave", p), () => {
        l.removeEventListener("pointerleave", w), d.removeEventListener("pointerleave", p);
      };
    }
  }, [l, d, f, g]), E.useEffect(() => {
    if (a) {
      const w = (p) => {
        const v = p.target, m = { x: p.clientX, y: p.clientY }, x = (l == null ? void 0 : l.contains(v)) || (d == null ? void 0 : d.contains(v)), k = !y0(m, a);
        x ? g() : k && (g(), c());
      };
      return document.addEventListener("pointermove", w), () => document.removeEventListener("pointermove", w);
    }
  }, [l, d, a, c, g]), /* @__PURE__ */ h.jsx(Jl, { ...e, ref: i });
}), [h0, m0] = Vn(Cr, { isInside: false }), g0 = /* @__PURE__ */ Rp("TooltipContent"), Jl = E.forwardRef(
  (e, t) => {
    const {
      __scopeTooltip: r,
      children: n,
      "aria-label": o,
      onEscapeKeyDown: i,
      onPointerDownOutside: a,
      ...s
    } = e, l = Ir(qt, r), c = Zn(r), { onClose: d } = l;
    return E.useEffect(() => (document.addEventListener(Po, d), () => document.removeEventListener(Po, d)), [d]), E.useEffect(() => {
      if (l.trigger) {
        const u = (g) => {
          const f = g.target;
          f != null && f.contains(l.trigger) && d();
        };
        return window.addEventListener("scroll", u, { capture: true }), () => window.removeEventListener("scroll", u, { capture: true });
      }
    }, [l.trigger, d]), /* @__PURE__ */ h.jsx(
      In,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown: i,
        onPointerDownOutside: a,
        onFocusOutside: (u) => u.preventDefault(),
        onDismiss: d,
        children: /* @__PURE__ */ h.jsxs(
          hi,
          {
            "data-state": l.stateAttribute,
            ...c,
            ...s,
            ref: t,
            style: {
              ...s.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ h.jsx(g0, { children: n }),
              /* @__PURE__ */ h.jsx(h0, { scope: r, isInside: true, children: /* @__PURE__ */ h.jsx(Am, { id: l.contentId, role: "tooltip", children: o || n }) })
            ]
          }
        )
      }
    );
  }
);
ql.displayName = qt;
var Ql = "TooltipArrow", v0 = E.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = Zn(r);
    return m0(
      Ql,
      r
    ).isInside ? null : /* @__PURE__ */ h.jsx(mi, { ...o, ...n, ref: t });
  }
);
v0.displayName = Ql;
function b0(e, t) {
  const r = Math.abs(t.top - e.y), n = Math.abs(t.bottom - e.y), o = Math.abs(t.right - e.x), i = Math.abs(t.left - e.x);
  switch (Math.min(r, n, o, i)) {
    case i:
      return "left";
    case o:
      return "right";
    case r:
      return "top";
    case n:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function x0(e, t, r = 5) {
  const n = [];
  switch (t) {
    case "top":
      n.push(
        { x: e.x - r, y: e.y + r },
        { x: e.x + r, y: e.y + r }
      );
      break;
    case "bottom":
      n.push(
        { x: e.x - r, y: e.y - r },
        { x: e.x + r, y: e.y - r }
      );
      break;
    case "left":
      n.push(
        { x: e.x + r, y: e.y - r },
        { x: e.x + r, y: e.y + r }
      );
      break;
    case "right":
      n.push(
        { x: e.x - r, y: e.y - r },
        { x: e.x - r, y: e.y + r }
      );
      break;
  }
  return n;
}
function w0(e) {
  const { top: t, right: r, bottom: n, left: o } = e;
  return [
    { x: o, y: t },
    { x: r, y: t },
    { x: r, y: n },
    { x: o, y: n }
  ];
}
function y0(e, t) {
  const { x: r, y: n } = e;
  let o = false;
  for (let i = 0, a = t.length - 1; i < t.length; a = i++) {
    const s = t[i], l = t[a], c = s.x, d = s.y, u = l.x, g = l.y;
    d > n != g > n && r < (u - c) * (n - d) / (g - d) + c && (o = !o);
  }
  return o;
}
function k0(e) {
  const t = e.slice();
  return t.sort((r, n) => r.x < n.x ? -1 : r.x > n.x ? 1 : r.y < n.y ? -1 : r.y > n.y ? 1 : 0), _0(t);
}
function _0(e) {
  if (e.length <= 1) return e.slice();
  const t = [];
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (; t.length >= 2; ) {
      const i = t[t.length - 1], a = t[t.length - 2];
      if ((i.x - a.x) * (o.y - a.y) >= (i.y - a.y) * (o.x - a.x)) t.pop();
      else break;
    }
    t.push(o);
  }
  t.pop();
  const r = [];
  for (let n = e.length - 1; n >= 0; n--) {
    const o = e[n];
    for (; r.length >= 2; ) {
      const i = r[r.length - 1], a = r[r.length - 2];
      if ((i.x - a.x) * (o.y - a.y) >= (i.y - a.y) * (o.x - a.x)) r.pop();
      else break;
    }
    r.push(o);
  }
  return r.pop(), t.length === 1 && r.length === 1 && t[0].x === r[0].x && t[0].y === r[0].y ? t : t.concat(r);
}
var z0 = Xl, ec = ql;
const Kt = E.forwardRef(({ className: e, sideOffset: t = 4, ...r }, n) => /* @__PURE__ */ h.jsx(z0, { children: /* @__PURE__ */ h.jsx(
  ec,
  {
    ref: n,
    sideOffset: t,
    className: xe(
      "z-50 rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] text-zinc-200 shadow-md",
      "animate-in fade-in-0 zoom-in-95",
      e
    ),
    ...r
  }
) }));
Kt.displayName = ec.displayName;
var Gn = "Popover", [tc] = jr(Gn, [
  ar
]), Dr = ar(), [A0, At] = tc(Gn);
var nc = "PopoverAnchor", j0 = E.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = At(nc, r), i = Dr(r), { onCustomAnchorAdd: a, onCustomAnchorRemove: s } = o;
    return E.useEffect(() => (a(), () => s()), [a, s]), /* @__PURE__ */ h.jsx(Fn, { ...i, ...n, ref: t });
  }
);
j0.displayName = nc;
var oc = "PopoverTrigger", ic = E.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = At(oc, r), i = Dr(r), a = De(t, o.triggerRef), s = /* @__PURE__ */ h.jsx(
      Oe.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": dc(o.open),
        ...n,
        ref: a,
        onClick: ze(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? s : /* @__PURE__ */ h.jsx(Fn, { asChild: true, ...i, children: s });
  }
);
ic.displayName = oc;
var wi = "PopoverPortal", [R0, T0] = tc(wi, {
  forceMount: void 0
}), ac = (e) => {
  const { __scopePopover: t, forceMount: r, children: n, container: o } = e, i = At(wi, t);
  return /* @__PURE__ */ h.jsx(R0, { scope: t, forceMount: r, children: /* @__PURE__ */ h.jsx(Or, { present: r || i.open, children: /* @__PURE__ */ h.jsx(Bn, { asChild: true, container: o, children: n }) }) });
};
ac.displayName = wi;
var Jt = "PopoverContent", sc = E.forwardRef(
  (e, t) => {
    const r = T0(Jt, e.__scopePopover), { forceMount: n = r.forceMount, ...o } = e, i = At(Jt, e.__scopePopover);
    return /* @__PURE__ */ h.jsx(Or, { present: n || i.open, children: i.modal ? /* @__PURE__ */ h.jsx(I0, { ...o, ref: t }) : /* @__PURE__ */ h.jsx(D0, { ...o, ref: t }) });
  }
);
sc.displayName = Jt;
var O0 = /* @__PURE__ */ Yt("PopoverContent.RemoveScroll"), I0 = E.forwardRef(
  (e, t) => {
    const r = At(Jt, e.__scopePopover), n = E.useRef(null), o = De(t, n), i = E.useRef(false);
    return E.useEffect(() => {
      const a = n.current;
      if (a) return el(a);
    }, []), /* @__PURE__ */ h.jsx(gi, { as: O0, allowPinchZoom: true, children: /* @__PURE__ */ h.jsx(
      lc,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: ze(e.onCloseAutoFocus, (a) => {
          var s;
          a.preventDefault(), i.current || (s = r.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: ze(
          e.onPointerDownOutside,
          (a) => {
            const s = a.detail.originalEvent, l = s.button === 0 && s.ctrlKey === true, c = s.button === 2 || l;
            i.current = c;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: ze(
          e.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
), D0 = E.forwardRef(
  (e, t) => {
    const r = At(Jt, e.__scopePopover), n = E.useRef(false), o = E.useRef(false);
    return /* @__PURE__ */ h.jsx(
      lc,
      {
        ...e,
        ref: t,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (i) => {
          var a, s;
          (a = e.onCloseAutoFocus) == null || a.call(e, i), i.defaultPrevented || (n.current || (s = r.triggerRef.current) == null || s.focus(), i.preventDefault()), n.current = false, o.current = false;
        },
        onInteractOutside: (i) => {
          var l, c;
          (l = e.onInteractOutside) == null || l.call(e, i), i.defaultPrevented || (n.current = true, i.detail.originalEvent.type === "pointerdown" && (o.current = true));
          const a = i.target;
          ((c = r.triggerRef.current) == null ? void 0 : c.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), lc = E.forwardRef(
  (e, t) => {
    const {
      __scopePopover: r,
      trapFocus: n,
      onOpenAutoFocus: o,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: a,
      onEscapeKeyDown: s,
      onPointerDownOutside: l,
      onFocusOutside: c,
      onInteractOutside: d,
      ...u
    } = e, g = At(Jt, r), f = Dr(r);
    return Ns(), /* @__PURE__ */ h.jsx(
      oi,
      {
        asChild: true,
        loop: true,
        trapped: n,
        onMountAutoFocus: o,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ h.jsx(
          In,
          {
            asChild: true,
            disableOutsidePointerEvents: a,
            onInteractOutside: d,
            onEscapeKeyDown: s,
            onPointerDownOutside: l,
            onFocusOutside: c,
            onDismiss: () => g.onOpenChange(false),
            children: /* @__PURE__ */ h.jsx(
              hi,
              {
                "data-state": dc(g.open),
                role: "dialog",
                id: g.contentId,
                ...f,
                ...u,
                ref: t,
                style: {
                  ...u.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }
), cc = "PopoverClose", P0 = E.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = At(cc, r);
    return /* @__PURE__ */ h.jsx(
      Oe.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: ze(e.onClick, () => o.onOpenChange(false))
      }
    );
  }
);
P0.displayName = cc;
var L0 = "PopoverArrow", M0 = E.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Dr(r);
    return /* @__PURE__ */ h.jsx(mi, { ...o, ...n, ref: t });
  }
);
M0.displayName = L0;
function dc(e) {
  return e ? "open" : "closed";
}
var U0 = ac, uc = sc;
const fc = E.forwardRef(({ className: e, align: t = "start", sideOffset: r = 6, ...n }, o) => /* @__PURE__ */ h.jsx(U0, { children: /* @__PURE__ */ h.jsx(
  uc,
  {
    ref: o,
    align: t,
    sideOffset: r,
    className: xe(
      "z-50 w-[var(--radix-popover-trigger-width)] rounded-lg border border-zinc-700/80 bg-zinc-950 p-1 text-white shadow-xl shadow-black/30",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      e
    ),
    ...n
  }
) }));
fc.displayName = uc.displayName;
const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {
  },
  setTheme: () => {
  }
});
const STORAGE_KEY = "olon:theme";
function isTheme(value) {
  return value === "dark" || value === "light";
}
function resolveInitialTheme() {
  var _a;
  if (typeof window === "undefined") return "dark";
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (isTheme(fromDom)) return fromDom;
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (isTheme(fromStorage)) return fromStorage;
  const prefersLight = (_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-color-scheme: light)").matches;
  return prefersLight ? "light" : "dark";
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(resolveInitialTheme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);
  function setTheme(t) {
    setThemeState(t);
  }
  function toggleTheme() {
    setThemeState((prev) => prev === "dark" ? "light" : "dark");
  }
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
}
function useTheme() {
  return useContext(ThemeContext);
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function OlonMark({ size = 32, className }) {
  const { theme } = useTheme();
  const nucleusFill = theme === "dark" ? "#E2D5B0" : "#1E1814";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      fill: "none",
      className: cn("shrink-0", className),
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "olon-ring", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#B8A4E0" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#5B3F9A" })
        ] }) }),
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "38", stroke: "url(#olon-ring)", strokeWidth: "20" }),
        /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "15", fill: nucleusFill, style: { transition: "fill 0.2s ease" } })
      ]
    }
  );
}
function OlonWordmark({ markSize = 48, className }) {
  const scale = markSize / 48;
  const w = 168 * scale;
  const h2 = 52 * scale;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: w,
      height: h2,
      viewBox: "0 0 168 52",
      fill: "none",
      overflow: "visible",
      className: cn("shrink-0", className),
      children: [
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "olon-wm-ring", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#B8A4E0" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#5B3F9A" })
        ] }) }),
        /* @__PURE__ */ jsx("circle", { cx: "24", cy: "24", r: "18.24", stroke: "url(#olon-wm-ring)", strokeWidth: "9.6" }),
        /* @__PURE__ */ jsx("circle", { cx: "24", cy: "24", r: "7.2", fill: "#E2D5B0" }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "57",
            y: "38",
            fill: "#E2D5B0",
            style: {
              fontFamily: "var(--wordmark-font)",
              fontSize: "48px",
              letterSpacing: "var(--wordmark-tracking)",
              fontWeight: "var(--wordmark-weight)",
              fontVariationSettings: '"wdth" var(--wordmark-width)'
            },
            children: "Olon"
          }
        )
      ]
    }
  );
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",
        secondary: "bg-transparent text-primary-light border border-primary hover:bg-primary-900 active:scale-[0.98]",
        outline: "bg-transparent text-foreground border border-border hover:bg-elevated active:scale-[0.98]",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated active:scale-[0.98]",
        accent: "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground border border-destructive-border hover:opacity-90 active:scale-[0.98]"
      },
      size: {
        default: "h-9 px-4 text-sm rounded-md",
        sm: "h-8 px-3.5 text-sm rounded-md",
        lg: "h-10 px-5 text-base rounded-md",
        icon: "h-9 w-9 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = E.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild && E.isValidElement(children)) {
      return E.cloneElement(children, {
        className: cn(classes, children.props.className)
      });
    }
    return /* @__PURE__ */ jsx("button", { className: classes, ref, ...props, children });
  }
);
Button.displayName = "Button";
function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleTheme,
      "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      className: cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-md",
        "text-muted-foreground hover:text-foreground hover:bg-elevated",
        "transition-colors duration-150",
        className
      ),
      children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { size: 15 }) : /* @__PURE__ */ jsx(Moon, { size: 15 })
    }
  );
}
function isMenuRef(value) {
  if (!value || typeof value !== "object") return false;
  const rec = value;
  return typeof rec.$ref === "string" && rec.$ref.trim().length > 0;
}
function toNavItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw;
  if (typeof rec.label !== "string" || typeof rec.href !== "string") return null;
  const children = Array.isArray(rec.children) ? rec.children.map((c) => toNavItem(c)).filter((c) => c !== null) : void 0;
  const variant = typeof rec.variant === "string" ? rec.variant : void 0;
  return { label: rec.label, href: rec.href, ...variant ? { variant } : {}, ...children && children.length > 0 ? { children } : {} };
}
function Header({ data, settings, menu }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const isSticky = (settings == null ? void 0 : settings.sticky) ?? true;
  const navRef = useRef(null);
  const linksField = data.links;
  const rawLinks = Array.isArray(linksField) ? linksField : [];
  const menuItems = Array.isArray(menu) ? menu : [];
  const source = isMenuRef(linksField) ? menuItems : rawLinks.length > 0 ? rawLinks : menuItems;
  const navItems = source.map(toNavItem).filter((i) => i !== null);
  useEffect(() => {
    if (!openDropdown) return;
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn(
        "top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md",
        isSticky ? "fixed" : "relative"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 h-18 flex items-center gap-8", children: [
          /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2 shrink-0", "aria-label": "OlonJS home", children: [
            /* @__PURE__ */ jsx(OlonMark, { size: 26, className: "mb-0.5" }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-2xl text-accent leading-none",
                style: {
                  fontFamily: "var(--wordmark-font)",
                  letterSpacing: "var(--wordmark-tracking)",
                  fontWeight: "var(--wordmark-weight)",
                  fontVariationSettings: '"wdth" var(--wordmark-width)'
                },
                children: data.logoText
              }
            ),
            data.badge && /* @__PURE__ */ jsx("span", { className: "hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium font-mono-olon bg-primary-900 text-primary-light border border-primary-800 rounded-sm", children: data.badge })
          ] }),
          /* @__PURE__ */ jsx("nav", { ref: navRef, className: "hidden md:flex items-center gap-0.5 flex-1", children: navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdown === item.label;
            const isSecondary = item.variant === "secondary";
            if (isSecondary) {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  className: "flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md border border-border bg-elevated hover:bg-elevated/70 transition-colors duration-150",
                  children: item.label
                },
                item.label
              );
            }
            if (!hasChildren) {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  className: "flex items-center gap-1 px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground rounded-md transition-colors duration-150 hover:bg-elevated",
                  children: item.label
                },
                item.label
              );
            }
            return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setOpenDropdown(isOpen ? null : item.label),
                  className: cn(
                    "flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-md transition-colors duration-150",
                    isOpen ? "text-foreground bg-elevated" : "text-muted-foreground hover:text-foreground hover:bg-elevated"
                  ),
                  "aria-expanded": hasChildren ? isOpen : void 0,
                  children: [
                    item.label,
                    hasChildren && /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        size: 11,
                        className: cn("opacity-40 mt-px transition-transform duration-150", isOpen && "rotate-180 opacity-70")
                      }
                    )
                  ]
                }
              ),
              hasChildren && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "absolute left-0 top-[calc(100%+8px)] min-w-[220px] rounded-lg border border-border bg-card shadow-lg shadow-black/20 overflow-hidden",
                    "transition-all duration-150 origin-top-left",
                    isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  ),
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1.5", children: item.children.map((child, i) => /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: child.href,
                        onClick: () => setOpenDropdown(null),
                        className: cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors duration-100 group",
                          i < item.children.length - 1 && ""
                        ),
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-md bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[10px] font-medium font-mono-olon text-primary-light group-hover:border-primary transition-colors", children: child.label.slice(0, 2).toUpperCase() }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium", children: child.label })
                        ]
                      },
                      child.label
                    )) }),
                    /* @__PURE__ */ jsx("div", { className: "px-3 py-2 border-t border-border bg-elevated/50", children: /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: item.href,
                        onClick: () => setOpenDropdown(null),
                        className: "text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
                        children: [
                          "View all ",
                          item.label.toLowerCase(),
                          " →"
                        ]
                      }
                    ) })
                  ]
                }
              )
            ] }, item.label);
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-1 ml-auto shrink-0", children: [
            /* @__PURE__ */ jsx(ThemeToggle, {}),
            data.signinHref && /* @__PURE__ */ jsx(
              "a",
              {
                href: data.signinHref,
                className: "text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 rounded-md hover:bg-elevated",
                children: "Sign in"
              }
            ),
            data.ctaHref && /* @__PURE__ */ jsx(Button, { variant: "accent", size: "sm", className: "h-8 px-4 text-[13px] font-medium", asChild: true, children: /* @__PURE__ */ jsx("a", { href: data.ctaHref, children: data.ctaLabel ?? "Get started →" }) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden ml-auto p-1.5 text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setMobileOpen(!mobileOpen),
              "aria-label": "Toggle menu",
              children: mobileOpen ? /* @__PURE__ */ jsx(X, { size: 16 }) : /* @__PURE__ */ jsx(Menu, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: cn(
          "md:hidden border-t border-border bg-card overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-[32rem]" : "max-h-0"
        ), children: /* @__PURE__ */ jsxs("nav", { className: "px-4 py-3 flex flex-col gap-0.5", children: [
          navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = mobileExpanded === item.label;
            const isSecondary = item.variant === "secondary";
            if (isSecondary) {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  onClick: () => setMobileOpen(false),
                  className: "mt-1 flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground border border-border bg-elevated hover:bg-elevated/70 rounded-md transition-colors",
                  children: item.label
                },
                item.label
              );
            }
            if (!hasChildren) {
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: item.href,
                  onClick: () => setMobileOpen(false),
                  className: "flex items-center px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors",
                  children: item.label
                },
                item.label
              );
            }
            return /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (hasChildren) {
                      setMobileExpanded(isExpanded ? null : item.label);
                    }
                  },
                  className: "w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors text-left",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: item.label }),
                    hasChildren && /* @__PURE__ */ jsx(
                      ChevronDown,
                      {
                        size: 13,
                        className: cn("opacity-40 transition-transform duration-150", isExpanded && "rotate-180 opacity-70")
                      }
                    )
                  ]
                }
              ),
              hasChildren && isExpanded && /* @__PURE__ */ jsxs("div", { className: "ml-3 pl-3 border-l border-border mt-0.5 mb-1 flex flex-col gap-0.5", children: [
                item.children.map((child) => /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: child.href,
                    onClick: () => {
                      setMobileOpen(false);
                      setMobileExpanded(null);
                    },
                    className: "flex items-center gap-2.5 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "w-5 h-5 rounded bg-primary-900 border border-primary-800 flex items-center justify-center shrink-0 text-[9px] font-medium font-mono-olon text-primary-light", children: child.label.slice(0, 2).toUpperCase() }),
                      child.label
                    ]
                  },
                  child.label
                )),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: item.href,
                    onClick: () => {
                      setMobileOpen(false);
                      setMobileExpanded(null);
                    },
                    className: "px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors",
                    children: "View all →"
                  }
                )
              ] })
            ] }, item.label);
          }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-3 mt-2 border-t border-border", children: [
            data.signinHref && /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "flex-1 text-[13px]", asChild: true, children: /* @__PURE__ */ jsx("a", { href: data.signinHref, children: "Sign in" }) }),
            data.ctaHref && /* @__PURE__ */ jsx(Button, { variant: "accent", size: "sm", className: "flex-1 text-[13px]", asChild: true, children: /* @__PURE__ */ jsx("a", { href: data.ctaHref, children: data.ctaLabel ?? "Get started" }) })
          ] })
        ] }) })
      ]
    }
  );
}
const HeaderSchema = z.object({
  logoText: z.string().describe("ui:text"),
  badge: z.string().optional().describe("ui:text"),
  links: z.array(z.object({
    label: z.string().describe("ui:text"),
    href: z.string().describe("ui:text"),
    variant: z.string().optional().describe("ui:text"),
    children: z.array(z.object({
      label: z.string().describe("ui:text"),
      href: z.string().describe("ui:text")
    })).optional().describe("ui:list")
  })).describe("ui:list"),
  ctaLabel: z.string().optional().describe("ui:text"),
  ctaHref: z.string().optional().describe("ui:text"),
  signinHref: z.string().optional().describe("ui:text")
});
z.object({
  sticky: z.boolean().default(true).describe("ui:checkbox")
});
function Footer({ data, settings }) {
  const showLogo = (settings == null ? void 0 : settings.showLogo) ?? true;
  const links = data.links ?? [];
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl px-6 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      showLogo && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx(OlonMark, { size: 18 }),
        /* @__PURE__ */ jsx("span", { className: "text-base  font-display text-foreground tracking-[-0.02em]", children: data.brandText })
      ] }),
      links.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        links.map((link) => /* @__PURE__ */ jsx(
          "a",
          {
            href: link.href,
            className: "text-[12px] text-muted-foreground hover:text-foreground transition-colors",
            children: link.label
          },
          link.label
        )),
        data.designSystemHref && /* @__PURE__ */ jsx(
          "a",
          {
            href: data.designSystemHref,
            className: "text-[12px] text-muted-foreground hover:text-foreground transition-colors",
            children: "Design System"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[11px] text-muted-foreground", children: data.copyright })
  ] }) });
}
const FooterSchema = z.object({
  brandText: z.string().describe("ui:text"),
  copyright: z.string().describe("ui:text"),
  links: z.array(z.object({
    label: z.string().describe("ui:text"),
    href: z.string().describe("ui:text")
  })).optional().describe("ui:list"),
  designSystemHref: z.string().optional().describe("ui:text")
});
z.object({
  showLogo: z.boolean().default(true).describe("ui:checkbox")
});
const TOKEN_VARS = [
  "--background",
  // #0B0907 center
  "--background",
  // #130F0D
  "--background",
  // #1E1814
  "--background",
  // #2E271F
  "--background",
  // #241D17
  "--elevated",
  // #1E1814
  "--background"
  // #0B0907 outer
];
const STOPS = [0, 30, 55, 72, 84, 93, 100];
function readTokenColors() {
  if (typeof document === "undefined") return TOKEN_VARS.map(() => "#000");
  const s = getComputedStyle(document.documentElement);
  return TOKEN_VARS.map((v) => s.getPropertyValue(v).trim() || "#000");
}
function RadialBackground({
  startingGap = 80,
  breathing = true,
  animationSpeed = 0.01,
  breathingRange = 180,
  topOffset = 0
}) {
  const containerRef = useRef(null);
  const [colors, setColors] = useState(() => readTokenColors());
  useEffect(() => {
    setColors(readTokenColors());
    const observer = new MutationObserver(() => setColors(readTokenColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let animationFrame;
    let width = startingGap;
    let direction = 1;
    const animate = () => {
      if (width >= startingGap + breathingRange) direction = -1;
      if (width <= startingGap - breathingRange) direction = 1;
      if (!breathing) direction = 0;
      width += direction * animationSpeed;
      const stops = STOPS.map((s, i) => `${colors[i]} ${s}%`).join(", ");
      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;
      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startingGap, breathing, animationSpeed, breathingRange, topOffset, colors]);
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      animate: { opacity: 1, scale: 1, transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] } },
      className: "absolute inset-0 overflow-hidden",
      initial: { opacity: 0, scale: 1.5 },
      children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0", ref: containerRef })
    }
  );
}
function Hero({ data, settings }) {
  const showCode = (settings == null ? void 0 : settings.showCode) ?? true;
  const ctas = data.ctas ?? [];
  const heroImage = data.heroImage;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "relative overflow-hidden pt-36 pb-28 px-6",
      id: data.anchorId,
      style: {
        "--local-bg": "var(--background)",
        "--local-text": "var(--foreground)",
        "--local-text-muted": "var(--muted-foreground)",
        "--local-border": "var(--border)"
      },
      children: [
        /* @__PURE__ */ jsx(RadialBackground, {}),
        /* @__PURE__ */ jsx("div", { className: "relative z-10 max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-20 gap-8 lg:gap-10 items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "order-2 md:order-1 md:col-span-11", children: [
            data.eyebrow && /* @__PURE__ */ jsx("p", { className: "font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-3", "data-jp-field": "eyebrow", children: data.eyebrow }),
            /* @__PURE__ */ jsx("h1", { className: "font-display font-normal text-7xl  text-foreground leading-tight tracking-display mb-1", "data-jp-field": "title", children: data.title }),
            data.titleHighlight && /* @__PURE__ */ jsx("h2", { className: "font-display font-normal italic text-5xl md:text-6xl text-primary-light leading-tight tracking-display mb-7", "data-jp-field": "titleHighlight", children: data.titleHighlight }),
            data.description && /* @__PURE__ */ jsx("p", { className: "text-md text-muted-foreground leading-relaxed max-w-xl mb-10", "data-jp-field": "description", children: data.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-16", children: [
              ctas.map((cta) => /* @__PURE__ */ jsx(
                Button,
                {
                  variant: cta.variant === "accent" ? "accent" : cta.variant === "secondary" ? "outline" : "default",
                  size: "lg",
                  className: "text-base",
                  asChild: true,
                  children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: cta.href,
                      "data-jp-item-id": cta.id ?? cta.label,
                      "data-jp-item-field": "ctas",
                      "data-jp-field": "href",
                      children: cta.variant === "accent" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx("span", { "data-jp-field": "label", children: cta.label }),
                        " ",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                      ] }) : cta.variant === "secondary" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Github, { className: "h-4 w-4" }),
                        " ",
                        /* @__PURE__ */ jsx("span", { "data-jp-field": "label", children: cta.label })
                      ] }) : /* @__PURE__ */ jsx("span", { "data-jp-field": "label", children: cta.label })
                    }
                  )
                },
                cta.id ?? cta.label
              )),
              data.docsHref && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: data.docsHref,
                  "data-jp-field": "docsHref",
                  className: "text-base text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsx(Terminal, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsx("span", { "data-jp-field": "docsLabel", children: data.docsLabel ?? "Read the docs" })
                  ]
                }
              )
            ] }),
            showCode && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border overflow-hidden max-w-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" }),
                  /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" }),
                  /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-xs text-muted-foreground", children: "olon.config.ts" }),
                /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-xs text-primary-400 hover:text-primary-light cursor-default transition-colors", "data-jp-field": "codeLabel", children: data.codeLabel ?? "Copy" })
              ] }),
              /* @__PURE__ */ jsx("pre", { className: "px-5 py-5 bg-card font-mono-olon text-sm leading-[1.8] overflow-x-auto", children: /* @__PURE__ */ jsxs("code", { children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-primary-400", children: "import" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
                    " ",
                    "{ defineConfig }",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-400", children: "from" }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-200", children: " 'olonjs'" })
                ] }),
                "\n\n",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-primary-400", children: "export default" }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-light", children: " defineConfig" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "({" })
                ] }),
                "\n  ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "tenants" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
                    ": [",
                    "{"
                  ] })
                ] }),
                "\n    ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "slug" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-200", children: "'acme-corp'" }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "," })
                ] }),
                "\n    ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "routes" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-light", children: "autoDiscover" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "(" }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-200", children: "'./src/pages'" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ")," })
                ] }),
                "\n    ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "schema" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-200", children: "'./schemas/page.json'" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "," })
                ] }),
                "\n  ",
                /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "}]," }) }),
                "\n  ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "output" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-200", children: "'vercel'" }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: ",  " }),
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "// 'nx' | 'vercel' | 'custom'" })
                ] }),
                "\n  ",
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "governance" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
                    ": ",
                    "{",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "audit" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-light", children: "true" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ", " }),
                  /* @__PURE__ */ jsx("span", { className: "text-accent", children: "strict" }),
                  /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
                  /* @__PURE__ */ jsx("span", { className: "text-primary-light", children: "true" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
                    " ",
                    "}"
                  ] })
                ] }),
                "\n",
                /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "}" }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "order-1 md:order-2 md:col-span-9", children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-md overflow-hidden bg-card hero-media-portrait", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: (heroImage == null ? void 0 : heroImage.url) ?? "/images/olon-hero.png",
                alt: (heroImage == null ? void 0 : heroImage.alt) ?? "Olon hero visual",
                "data-jp-field": "heroImage",
                className: "absolute inset-0 w-full h-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none hero-media-overlay" })
          ] }) })
        ] }) })
      ]
    }
  );
}
const ImageSelectionSchema = z.object({
  url: z.string(),
  alt: z.string().optional()
}).describe("ui:image-picker");
const BaseSectionData = z.object({
  anchorId: z.string().optional().describe("ui:text")
});
const BaseArrayItem = z.object({
  id: z.string().optional()
});
z.object({
  paddingTop: z.enum(["none", "sm", "md", "lg", "xl", "2xl"]).default("md").describe("ui:select"),
  paddingBottom: z.enum(["none", "sm", "md", "lg", "xl", "2xl"]).default("md").describe("ui:select"),
  theme: z.enum(["dark", "light", "accent"]).default("dark").describe("ui:select"),
  container: z.enum(["boxed", "fluid"]).default("boxed").describe("ui:select")
});
const CtaSchema = z.object({
  id: z.string().optional(),
  label: z.string().describe("ui:text"),
  href: z.string().describe("ui:text"),
  variant: z.enum(["primary", "secondary", "accent"]).default("primary").describe("ui:select")
});
const HeroSchema = BaseSectionData.extend({
  eyebrow: z.string().optional().describe("ui:text"),
  title: z.string().describe("ui:text"),
  titleHighlight: z.string().optional().describe("ui:text"),
  description: z.string().optional().describe("ui:textarea"),
  ctas: z.array(CtaSchema).optional().describe("ui:list"),
  docsLabel: z.string().optional().describe("ui:text"),
  docsHref: z.string().optional().describe("ui:text"),
  codeLabel: z.string().optional().describe("ui:text"),
  heroImage: ImageSelectionSchema.optional().describe("ui:image-picker")
});
z.object({
  showCode: z.boolean().default(true).describe("ui:checkbox")
});
function FeatureGrid({ data, settings }) {
  const columns = (settings == null ? void 0 : settings.columns) ?? 3;
  const cards = data.cards ?? [];
  const tiers = data.tiers ?? [];
  const colClass = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "features",
      className: "py-24 px-6 border-t border-border section-anchor",
      style: {
        "--local-bg": "var(--background)",
        "--local-text": "var(--foreground)",
        "--local-text-muted": "var(--muted-foreground)",
        "--local-border": "var(--border)"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-xl mb-16", children: [
          data.label && /* @__PURE__ */ jsx("p", { className: "font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5", "data-jp-field": "label", children: data.label }),
          /* @__PURE__ */ jsxs("h2", { className: "font-display font-normal text-foreground leading-tight tracking-tight mb-5", "data-jp-field": "sectionTitle", children: [
            data.sectionTitle,
            data.sectionTitleItalic && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("em", { className: "not-italic text-primary-light", "data-jp-field": "sectionTitleItalic", children: data.sectionTitleItalic })
            ] })
          ] }),
          data.sectionLead && /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground leading-relaxed", "data-jp-field": "sectionLead", children: data.sectionLead })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `grid grid-cols-1 ${colClass} gap-px bg-border`, children: cards.map((card) => {
          return /* @__PURE__ */ jsxs(
            "div",
            {
              "data-jp-item-id": card.id ?? card.title,
              "data-jp-item-field": "cards",
              className: "bg-background p-7 flex flex-col gap-4 group hover:bg-card transition-colors duration-200",
              children: [
                card.icon && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: card.icon.url,
                    alt: card.icon.alt ?? "",
                    "aria-hidden": card.icon.alt ? void 0 : true,
                    "data-jp-field": "icon",
                    className: "w-10 h-10 shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-foreground mb-2 leading-snug", "data-jp-field": "title", children: card.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", "data-jp-field": "description", children: card.description })
                ] })
              ]
            },
            card.id ?? card.title
          );
        }) }),
        (data.proofStatement || tiers.length > 0) && /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 px-7 py-5 rounded-lg border border-border bg-card", children: [
          data.proofStatement && /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground mb-0.5", children: /* @__PURE__ */ jsx("span", { "data-jp-field": "proofStatement", children: data.proofStatement }) }),
            data.proofSub && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-muted-foreground", "data-jp-field": "proofSub", children: data.proofSub })
          ] }),
          tiers.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 shrink-0", children: tiers.map((tier) => /* @__PURE__ */ jsx(
            "div",
            {
              "data-jp-item-id": tier.id ?? tier.label,
              "data-jp-item-field": "tiers",
              className: "text-center",
              children: /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-foreground", "data-jp-field": "label", children: tier.label })
            },
            tier.id ?? tier.label
          )) })
        ] })
      ] })
    }
  );
}
const FeatureCardSchema$1 = BaseArrayItem.extend({
  icon: ImageSelectionSchema.optional().describe("ui:image-picker"),
  title: z.string().describe("ui:text"),
  description: z.string().describe("ui:textarea")
});
const ProofTierSchema = BaseArrayItem.extend({
  label: z.string().describe("ui:text")
});
const FeatureGridSchema = BaseSectionData.extend({
  label: z.string().optional().describe("ui:text"),
  sectionTitle: z.string().describe("ui:text"),
  sectionTitleItalic: z.string().optional().describe("ui:text"),
  sectionLead: z.string().optional().describe("ui:textarea"),
  cards: z.array(FeatureCardSchema$1).describe("ui:list"),
  proofStatement: z.string().optional().describe("ui:text"),
  proofSub: z.string().optional().describe("ui:text"),
  tiers: z.array(ProofTierSchema).optional().describe("ui:list")
});
z.object({
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3).describe("ui:number")
});
const Input = E.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-150",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Label = E.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "label",
  {
    ref,
    className: cn("block text-xs font-medium text-foreground mb-1.5 cursor-default", className),
    ...props
  }
));
Label.displayName = "Label";
function Contact({ data, settings }) {
  const [submitted, setSubmitted] = useState(false);
  const showTiers = (settings == null ? void 0 : settings.showTiers) ?? true;
  const tiers = data.tiers ?? [];
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "contact",
      className: "py-24 px-6 border-t border-border section-anchor",
      style: {
        "--local-bg": "var(--background)",
        "--local-text": "var(--foreground)",
        "--local-text-muted": "var(--muted-foreground)",
        "--local-border": "var(--border)"
      },
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "max-w-md", children: [
          data.label && /* @__PURE__ */ jsx("p", { className: "font-mono-olon text-xs font-medium tracking-label uppercase text-muted-foreground mb-5", "data-jp-field": "label", children: data.label }),
          /* @__PURE__ */ jsxs("h2", { className: "font-display font-normal text-foreground leading-tight tracking-tight mb-5", "data-jp-field": "title", children: [
            data.title,
            data.titleHighlight && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("em", { className: "not-italic text-primary-light", "data-jp-field": "titleHighlight", children: data.titleHighlight })
            ] })
          ] }),
          data.description && /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground leading-relaxed mb-10", "data-jp-field": "description", children: data.description }),
          showTiers && tiers.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-0 border border-border rounded-lg overflow-hidden", children: tiers.map((tier, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              "data-jp-item-id": tier.id ?? tier.label,
              "data-jp-item-field": "tiers",
              className: `flex items-start gap-4 px-5 py-4 ${i < tiers.length - 1 ? "border-b border-border" : ""}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide bg-primary-900 text-primary-light border border-primary-800 rounded-sm mt-0.5 shrink-0 min-w-[64px] justify-center", "data-jp-field": "label", children: tier.label }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground leading-snug", "data-jp-field": "desc", children: tier.desc }),
                  tier.sub && /* @__PURE__ */ jsx("p", { className: "text-[12px] text-muted-foreground mt-0.5", "data-jp-field": "sub", children: tier.sub })
                ] })
              ]
            },
            tier.id ?? tier.label
          )) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-6", children: submitted ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary-900 border border-primary flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(ArrowRight, { size: 15, className: "text-primary-light" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-foreground mb-1.5", "data-jp-field": "successTitle", children: data.successTitle ?? "Message received" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", "data-jp-field": "successBody", children: data.successBody ?? "We'll respond within one business day." })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground mb-4", "data-jp-field": "formTitle", children: data.formTitle ?? "Get in touch" }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contact-first", children: "First name" }),
              /* @__PURE__ */ jsx(Input, { id: "contact-first", placeholder: "Ada", required: true })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "contact-last", children: "Last name" }),
              /* @__PURE__ */ jsx(Input, { id: "contact-last", placeholder: "Lovelace", required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "contact-email", children: "Work email" }),
            /* @__PURE__ */ jsx(Input, { id: "contact-email", type: "email", placeholder: "ada@acme.com", required: true })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "contact-company", children: "Company" }),
            /* @__PURE__ */ jsx(Input, { id: "contact-company", placeholder: "Acme Corp" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "contact-usecase", children: "Use case" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "contact-usecase",
                rows: 3,
                placeholder: "Tell us about your deployment context...",
                className: "flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150 resize-none font-primary"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "accent", className: "w-full", children: [
            "Send message ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
          ] }),
          data.disclaimer && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground text-center", "data-jp-field": "disclaimer", children: data.disclaimer })
        ] }) })
      ] }) })
    }
  );
}
const ContactTierSchema = BaseArrayItem.extend({
  label: z.string().describe("ui:text"),
  desc: z.string().describe("ui:text"),
  sub: z.string().optional().describe("ui:text")
});
const ContactSchema = BaseSectionData.extend({
  label: z.string().optional().describe("ui:text"),
  title: z.string().describe("ui:text"),
  titleHighlight: z.string().optional().describe("ui:text"),
  description: z.string().optional().describe("ui:textarea"),
  tiers: z.array(ContactTierSchema).optional().describe("ui:list"),
  formTitle: z.string().optional().describe("ui:text"),
  successTitle: z.string().optional().describe("ui:text"),
  successBody: z.string().optional().describe("ui:text"),
  disclaimer: z.string().optional().describe("ui:text")
});
z.object({
  showTiers: z.boolean().default(true).describe("ui:checkbox")
});
const GoogleIcon = () => /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", children: [
  /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
  /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
  /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
  /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
] });
const GitHubIcon = () => /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" }) });
function Login({ data, settings }) {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const showOauth = (settings == null ? void 0 : settings.showOauth) ?? true;
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }
  return /* @__PURE__ */ jsx("section", { id: "login", className: "py-24 px-6 border-t border-border section-anchor", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[360px]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-8 text-center", children: [
      /* @__PURE__ */ jsx(OlonMark, { size: 32, className: "mb-5" }),
      /* @__PURE__ */ jsx("h2", { className: "text-[18px] font-display text-foreground tracking-[-0.02em] mb-1.5", "data-jp-field": "title", children: data.title }),
      data.subtitle && /* @__PURE__ */ jsx("p", { className: "text-[13px] text-muted-foreground", "data-jp-field": "subtitle", children: data.subtitle })
    ] }),
    showOauth && /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-6", children: [
      { label: "Continue with Google", icon: /* @__PURE__ */ jsx(GoogleIcon, {}), id: "google" },
      { label: "Continue with GitHub", icon: /* @__PURE__ */ jsx(GitHubIcon, {}), id: "github" }
    ].map(({ label, icon, id: id2 }) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "w-full flex items-center justify-center gap-2.5 h-9 px-4 text-[13px] font-medium text-foreground border border-border rounded-md bg-transparent hover:bg-elevated transition-colors duration-150",
        children: [
          icon,
          label
        ]
      },
      id2
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground font-mono-olon tracking-wide", children: "OR" }),
      /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "login-email", children: "Email" }),
        /* @__PURE__ */ jsx(Input, { id: "login-email", type: "email", placeholder: "ada@acme.com", autoComplete: "email", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "login-password", className: "mb-0", children: "Password" }),
          data.forgotHref && /* @__PURE__ */ jsx("a", { href: data.forgotHref, "data-jp-field": "forgotHref", className: "text-[11px] text-primary-400 hover:text-primary-light transition-colors", children: "Forgot password?" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "login-password",
              type: showPwd ? "text" : "password",
              placeholder: "••••••••",
              autoComplete: "current-password",
              required: true,
              className: "pr-10"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              onClick: () => setShowPwd(!showPwd),
              children: showPwd ? /* @__PURE__ */ jsx(EyeOff, { size: 13 }) : /* @__PURE__ */ jsx(Eye, { size: 13 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", variant: "accent", className: "w-full", disabled: loading, children: loading ? "Signing in…" : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { children: "Sign in" }),
        /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
      ] }) })
    ] }),
    data.signupHref && /* @__PURE__ */ jsxs("p", { className: "text-center text-[12px] text-muted-foreground mt-6", children: [
      "No account?",
      " ",
      /* @__PURE__ */ jsx("a", { href: data.signupHref, "data-jp-field": "signupHref", className: "text-primary-light hover:text-primary-200 transition-colors", children: "Request access →" })
    ] }),
    (data.termsHref || data.privacyHref) && /* @__PURE__ */ jsxs("p", { className: "text-center text-[11px] text-muted-foreground/60 mt-4", children: [
      "By signing in you agree to our",
      " ",
      data.termsHref && /* @__PURE__ */ jsx("a", { href: data.termsHref, "data-jp-field": "termsHref", className: "hover:text-muted-foreground transition-colors underline underline-offset-2", children: "Terms" }),
      data.termsHref && data.privacyHref && " and ",
      data.privacyHref && /* @__PURE__ */ jsx("a", { href: data.privacyHref, "data-jp-field": "privacyHref", className: "hover:text-muted-foreground transition-colors underline underline-offset-2", children: "Privacy Policy" }),
      "."
    ] })
  ] }) }) });
}
const LoginSchema = BaseSectionData.extend({
  title: z.string().describe("ui:text"),
  subtitle: z.string().optional().describe("ui:text"),
  forgotHref: z.string().optional().describe("ui:text"),
  signupHref: z.string().optional().describe("ui:text"),
  termsHref: z.string().optional().describe("ui:text"),
  privacyHref: z.string().optional().describe("ui:text")
});
z.object({
  showOauth: z.boolean().default(true).describe("ui:checkbox")
});
const nav = [
  {
    group: "Foundation",
    links: [
      { id: "tokens", label: "Tokens" },
      { id: "colors", label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "spacing", label: "Spacing & Radius" }
    ]
  },
  {
    group: "Identity",
    links: [
      { id: "mark", label: "Mark & Logo" }
    ]
  },
  {
    group: "Components",
    links: [
      { id: "buttons", label: "Button" },
      { id: "badges", label: "Badge" },
      { id: "inputs", label: "Input" },
      { id: "cards", label: "Card" },
      { id: "code", label: "Code Block" }
    ]
  }
];
const tokenRows = [
  {
    group: "Backgrounds",
    rows: [
      { name: "background", varName: "--background", tw: "bg-background", swatch: true },
      { name: "card", varName: "--card", tw: "bg-card", swatch: true },
      { name: "elevated", varName: "--elevated", tw: "bg-elevated", swatch: true }
    ]
  },
  {
    group: "Text",
    rows: [
      { name: "foreground", varName: "--foreground", tw: "text-foreground", swatch: true },
      { name: "muted-foreground", varName: "--muted-foreground", tw: "text-muted-foreground", swatch: true }
    ]
  },
  {
    group: "Brand",
    rows: [
      { name: "primary", varName: "--primary", tw: "bg-primary / text-primary", swatch: true },
      { name: "primary-foreground", varName: "--primary-foreground", tw: "text-primary-foreground", swatch: true }
    ]
  },
  {
    group: "Accent",
    rows: [
      { name: "accent", varName: "--accent", tw: "bg-accent / text-accent", swatch: true }
    ]
  },
  {
    group: "Border",
    rows: [
      { name: "border", varName: "--border", tw: "border-border", swatch: true },
      { name: "border-strong", varName: "--border-strong", tw: "border-border-strong", swatch: true }
    ]
  },
  {
    group: "Feedback",
    rows: [
      { name: "destructive", varName: "--destructive", tw: "bg-destructive", swatch: true },
      { name: "success", varName: "--success", tw: "bg-success", swatch: true },
      { name: "warning", varName: "--warning", tw: "bg-warning", swatch: true },
      { name: "info", varName: "--info", tw: "bg-info", swatch: true }
    ]
  },
  {
    group: "Typography",
    rows: [
      { name: "font-primary", varName: "--theme-font-primary", tw: "font-primary" },
      { name: "font-display", varName: "--theme-font-display", tw: "font-display" },
      { name: "font-mono", varName: "--theme-font-mono", tw: "font-mono" }
    ]
  }
];
const ramp = [
  { stop: "50", varName: "--primary-50", dark: false },
  { stop: "100", varName: "--primary-100", dark: false },
  { stop: "200", varName: "--primary-200", dark: false },
  { stop: "300", varName: "--primary-300", dark: false },
  { stop: "400", varName: "--primary-400", dark: true },
  { stop: "500", varName: "--primary-500", dark: true },
  { stop: "600", varName: "--primary-600", dark: true, brand: true },
  { stop: "700", varName: "--primary-700", dark: true },
  { stop: "800", varName: "--primary-800", dark: true },
  { stop: "900", varName: "--primary-900", dark: true }
];
const backgroundSwatches = [
  { label: "Base", varName: "--background", tw: "bg-background" },
  { label: "Surface", varName: "--card", tw: "bg-card" },
  { label: "Elevated", varName: "--elevated", tw: "bg-elevated" },
  { label: "Border", varName: "--border", tw: "border-border" }
];
const feedbackSwatches = [
  { label: "Destructive", bgVarName: "--destructive", fgVarName: "--destructive-foreground" },
  { label: "Success", bgVarName: "--success", fgVarName: "--success-foreground" },
  { label: "Warning", bgVarName: "--warning", fgVarName: "--warning-foreground" },
  { label: "Info", bgVarName: "--info", fgVarName: "--info-foreground" }
];
function readCssVar(varName) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || "n/a";
}
function DesignSystemView({ data, settings }) {
  const [activeId, setActiveId] = useState("tokens");
  const [cssVars, setCssVars] = useState((settings == null ? void 0 : settings.initialCssVars) ?? {});
  const mainRef = useRef(null);
  useEffect(() => {
    const allVars = /* @__PURE__ */ new Set();
    tokenRows.forEach((group) => group.rows.forEach((row) => allVars.add(row.varName)));
    ramp.forEach((item) => allVars.add(item.varName));
    backgroundSwatches.forEach((item) => allVars.add(item.varName));
    allVars.add("--accent");
    feedbackSwatches.forEach((item) => {
      allVars.add(item.bgVarName);
      allVars.add(item.fgVarName);
    });
    const syncVars = () => {
      const next = {};
      for (const varName of allVars) next[varName] = readCssVar(varName);
      setCssVars(next);
    };
    syncVars();
    const observer = new MutationObserver(syncVars);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const sections2 = document.querySelectorAll("section[data-ds-id]");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.getAttribute("data-ds-id") ?? "");
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections2.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  function scrollTo(id2) {
    var _a;
    (_a = document.getElementById(id2)) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 border-r border-border bg-background z-40 overflow-y-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-border", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2.5 shrink-0", "aria-label": "OlonJS home", children: [
        /* @__PURE__ */ jsx(OlonMark, { size: 22 }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-display text-accent tracking-[-0.04em] leading-none", children: data.title ?? "Olon" })
      ] }) }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-4 space-y-5", children: nav.map((section) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground px-3 mb-2", children: section.group }),
        section.links.map((link) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => scrollTo(link.id),
            className: cn("nav-link w-full text-left", activeId === link.id && "active"),
            children: link.label
          },
          link.id
        ))
      ] }, section.group)) }),
      /* @__PURE__ */ jsx("div", { className: "px-5 py-4 border-t border-border", children: /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-[11px] text-muted-foreground", children: "v1.4 · Labradorite · Merriweather Variable" }) })
    ] }),
    /* @__PURE__ */ jsxs("main", { ref: mainRef, className: "flex-1 lg:ml-60 px-6 lg:px-12 py-12 max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-16", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center text-[11px] font-medium tracking-[0.1em] uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-6", children: "Design System" }),
        /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(OlonWordmark, { markSize: 64 }) }),
        /* @__PURE__ */ jsx("p", { className: "font-display text-2xl font-normal text-primary-light tracking-[-0.01em] mb-3", children: "Design Language" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-[15px] max-w-lg leading-relaxed", children: "A contract layer for the agentic web — and a design system built to communicate it. Every token, component, and decision is grounded in the concept of the holon: whole in itself, part of something greater." })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "tokens", "data-ds-id": "tokens", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Token Reference" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "All tokens defined in",
            " ",
            /* @__PURE__ */ jsx("code", { className: "code-inline", children: "theme.json" }),
            " ",
            "and bridged via",
            " ",
            /* @__PURE__ */ jsx("code", { className: "code-inline", children: "index.css" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-elevated border-b border-border", children: ["Token", "CSS var", "Value", "Tailwind class"].map((h2) => /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground", children: h2 }, h2)) }) }),
          /* @__PURE__ */ jsx("tbody", { children: tokenRows.map((group) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("tr", { className: "border-b border-border", children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-4 py-2 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground bg-card", children: group.group }) }, group.group),
            group.rows.map((row) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border hover:bg-elevated transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-foreground font-medium text-sm", children: row.name }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono-olon text-xs text-primary-light", children: row.varName }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono-olon text-xs text-muted-foreground", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                row.swatch && /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 rounded-sm border border-border-strong shrink-0", style: { background: `var(${row.varName})` } }),
                cssVars[row.varName] ?? "n/a"
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono-olon text-xs text-accent", children: row.tw })
            ] }, row.name))
          ] })) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "colors", "data-ds-id": "colors", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Color System" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Labradorite brand ramp + semantic layer. Dark-first. Every stop has a role." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3", children: "Backgrounds" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: backgroundSwatches.map((s) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "h-14 rounded-md border border-border-strong", style: { background: `var(${s.varName})` } }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-foreground", children: s.label }),
              /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-[11px] text-muted-foreground", children: cssVars[s.varName] ?? "n/a" }),
              /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-[10px] text-primary-light", children: s.tw })
            ] })
          ] }, s.label)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3", children: "Brand Ramp — Labradorite" }),
          /* @__PURE__ */ jsx("div", { className: "flex rounded-lg overflow-hidden h-16 border border-border", children: ramp.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-end p-1.5 relative", style: { background: `var(${s.varName})` }, children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[9px] font-medium", style: { color: s.dark ? "#EDE8F8" : "#3D2770" }, children: s.stop }),
            s.brand && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 text-[8px] font-medium text-primary-200 font-mono-olon", children: "brand" })
          ] }, s.stop)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3", children: "Accent — Parchment" }),
            /* @__PURE__ */ jsx("div", { className: "h-14 rounded-md border border-border", style: { background: "var(--accent)" } }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-foreground", children: "Accent" }),
              /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-[11px] text-muted-foreground", children: cssVars["--accent"] ?? "n/a" }),
              /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-[10px] text-primary-light", children: "text-accent" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3", children: "Feedback" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: feedbackSwatches.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2 rounded-md", style: { background: `var(${f.bgVarName})` }, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[12px] font-medium", style: { color: `var(${f.fgVarName})` }, children: f.label }),
              /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[10px] ml-auto", style: { color: `var(${f.fgVarName})` }, children: cssVars[f.bgVarName] ?? "n/a" })
            ] }, f.label)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "typography", "data-ds-id": "typography", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Typography" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Three typefaces, three voices. Built on contrast." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1", children: "Display · font-display" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: "Merriweather Variable" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm", children: "Google Fonts" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-border pt-5", children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-5xl font-normal text-foreground leading-none", children: "The contract layer" }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-normal text-primary-light leading-tight italic", children: "for the agentic web." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1", children: "UI · font-primary" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: "Geist" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[11px] text-muted-foreground border border-border px-2 py-1 rounded-sm", children: "400 · 500" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-border pt-5", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mb-2", children: "15px / 400" }),
              /* @__PURE__ */ jsx("div", { className: "text-foreground", children: "Machine-readable endpoints." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mb-2", children: "13px / 500" }),
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-medium text-foreground", children: "Schema contracts." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground mb-2", children: "11px / 400 · muted" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: "Governance, audit." })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-5", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-1", children: "Code · font-mono" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: "Geist Mono" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-5 space-y-1.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-mono-olon text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "import" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-accent", children: "Olon" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "from" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "syntax-string", children: "'olonjs'" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-mono-olon text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "const" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "page" }),
              " = ",
              /* @__PURE__ */ jsx("span", { className: "text-accent", children: "Olon" }),
              ".",
              /* @__PURE__ */ jsx("span", { className: "text-primary-light", children: "contract" }),
              "(",
              /* @__PURE__ */ jsx("span", { className: "syntax-string", children: "'/about.json'" }),
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "spacing", "data-ds-id": "spacing", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Spacing & Radius" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Radius scale is deliberate — corners communicate hierarchy." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-4", children: [
          { token: "radius-sm · 4px", r: 4, desc: "Badges, tags, chips." },
          { token: "radius-md · 8px", r: 8, desc: "Inputs, buttons, inline." },
          { token: "radius-lg · 12px", r: 12, desc: "Cards, panels, modals." }
        ].map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full h-14 border border-primary bg-primary-900 mb-4", style: { borderRadius: item.r } }),
          /* @__PURE__ */ jsx("div", { className: "font-mono-olon text-xs text-primary-light mb-1", children: item.token }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: item.desc })
        ] }, item.r)) })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "mark", "data-ds-id": "mark", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Mark & Logo" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "The mark is a holon: a nucleus held inside a ring. Two circles, one concept." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground", children: "Mark · Dark" }),
            /* @__PURE__ */ jsx(OlonMark, { size: 64 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-elevated p-8 flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground", children: "Mark · Mono" }),
            /* @__PURE__ */ jsxs("svg", { width: "64", height: "64", viewBox: "0 0 100 100", fill: "none", children: [
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "38", stroke: "#F2EDE6", strokeWidth: "20" }),
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "15", fill: "#F2EDE6" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6 space-y-6", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground", children: "Logo Lockups" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-3", children: "Standard (nav, sidebar ≥ 18px)" }),
            /* @__PURE__ */ jsx(OlonWordmark, { markSize: 36 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border pt-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-3", children: "Hero display (marketing · ≥ 48px)" }),
            /* @__PURE__ */ jsx(OlonWordmark, { markSize: 64 })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "buttons", "data-ds-id": "buttons", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Button" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Five variants. All use semantic tokens — no hardcoded colors." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-6 space-y-6", children: [
          {
            label: "Default (primary)",
            buttons: [
              /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity", children: "Get started" }, "1")
            ]
          },
          {
            label: "Accent (CTA)",
            buttons: [
              /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity", children: "Get started →" }, "1")
            ]
          },
          {
            label: "Secondary (outline)",
            buttons: [
              /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-primary-light border border-primary rounded-md hover:bg-primary-900 transition-colors", children: "Documentation" }, "1"),
              /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-foreground border border-border rounded-md hover:bg-elevated transition-colors", children: "View on GitHub" }, "2")
            ]
          },
          {
            label: "Ghost",
            buttons: [
              /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-transparent text-muted-foreground hover:text-foreground hover:bg-elevated rounded-md transition-colors", children: "Cancel" }, "1")
            ]
          }
        ].map((group, i, arr) => /* @__PURE__ */ jsxs("div", { className: i < arr.length - 1 ? "border-b border-border pb-6" : "", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-4", children: group.label }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: group.buttons })
        ] }, group.label)) })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "badges", "data-ds-id": "badges", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Badge" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Status, versioning, feature flags. Small but precise." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm", children: "Stable" }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-200 border border-primary-800 rounded-sm", children: "OSS" }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-sm", children: "v1.4" }),
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-sm", children: "New" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium bg-elevated text-muted-foreground border border-border rounded-full", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-success-indicator inline-block" }),
            "Deployed"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "inputs", "data-ds-id": "inputs", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Input" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Form elements. Precision over decoration." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-foreground mb-1.5", children: "Tenant slug" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "my-tenant", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-medium text-foreground mb-1.5", children: [
              "Schema version ",
              /* @__PURE__ */ jsx("span", { className: "text-destructive-foreground ml-1", children: "Invalid format" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", defaultValue: "1.x.x", className: "w-full px-3 py-2 text-sm bg-background border border-destructive-border rounded-md text-foreground focus:outline-none focus:border-destructive-ring focus:ring-1 focus:ring-destructive-ring transition-colors" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-destructive-foreground", children: "Must follow semver (e.g. 1.4.0)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "cards", "data-ds-id": "cards", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Card" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "The primary container primitive. Three elevation levels." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4", children: "Default · bg-card" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground mb-1", children: "JsonPages contract" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Tenant: acme-corp · 4 routes · Last sync 2m ago" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-primary-900 text-primary-light border border-primary rounded-sm", children: "Active" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border-strong bg-elevated p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4", children: "Elevated · bg-elevated" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-md bg-primary-900 border border-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(OlonMark, { size: 18 }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: "OlonJS Enterprise" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "NX monorepo · Private cloud · SOC2 ready" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-primary bg-primary-900 p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium tracking-[0.1em] uppercase text-primary-light mb-4", children: "Accent · border-primary bg-primary-900" }),
            /* @__PURE__ */ jsxs("div", { className: "font-display text-lg font-normal text-foreground mb-2", children: [
              "Ship your first tenant in hours,",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("em", { className: "not-italic text-accent", children: "not weeks." })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity", children: "Start building →" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("hr", { className: "ds-divider mb-16" }),
      /* @__PURE__ */ jsxs("section", { id: "code", "data-ds-id": "code", className: "section-anchor mb-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-foreground mb-1", children: "Code Block" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Developer-first. Syntax highlighting uses brand ramp stops only." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" }),
              /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" }),
              /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-border-strong" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-mono-olon text-[11px] text-muted-foreground", children: "olon.config.ts" }),
            /* @__PURE__ */ jsx("button", { className: "font-mono-olon text-[11px] text-muted-foreground hover:text-foreground transition-colors", children: "Copy" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-card px-5 py-5 overflow-x-auto", children: /* @__PURE__ */ jsx("pre", { className: "font-mono-olon text-sm leading-relaxed", children: /* @__PURE__ */ jsxs("code", { children: [
            /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "import" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "{ defineConfig }" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "from" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "syntax-string", children: "'olonjs'" }),
            "\n\n",
            /* @__PURE__ */ jsx("span", { className: "syntax-keyword", children: "export default" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "syntax-value", children: "defineConfig" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "({" }),
            "\n  ",
            /* @__PURE__ */ jsx("span", { className: "syntax-property", children: "tenants" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": [{" }),
            "\n    ",
            /* @__PURE__ */ jsx("span", { className: "syntax-property", children: "slug" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: ": " }),
            /* @__PURE__ */ jsx("span", { className: "syntax-string", children: "'olon-ds'" }),
            "\n  ",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "}]" }),
            "\n",
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "}" })
          ] }) }) })
        ] })
      ] })
    ] })
  ] });
}
const DesignSystemSchema = BaseSectionData.extend({
  title: z.string().optional().describe("ui:text")
});
z.object({
  /** Pre-resolved CSS var map injected at SSG bake time. Keys are var names (e.g. "--background"), values are resolved hex strings. */
  initialCssVars: z.record(z.string()).optional()
});
function CloudAiNativeGridView({ data }) {
  const mattersMatch = data.titleGradient.match(/^(.*)\s(MATTERS|Matters|matters)$/);
  const gradientPart = mattersMatch ? mattersMatch[1] : data.titleGradient;
  const whiteSuffix = mattersMatch ? ` ${mattersMatch[2]}` : null;
  return /* @__PURE__ */ jsxs("section", { id: data.anchorId, className: "max-w-4xl mx-auto px-6 mb-24 animate-fadeInUp delay-500 section-anchor", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-left text-5xl font-display font-bold mb-4 text-foreground", children: [
      /* @__PURE__ */ jsxs("span", { "data-jp-field": "titlePrefix", children: [
        data.titlePrefix,
        " "
      ] }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent",
          "data-jp-field": "titleGradient",
          children: gradientPart
        }
      ),
      whiteSuffix && /* @__PURE__ */ jsx("span", { className: "text-foreground", children: whiteSuffix })
    ] }),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-left text-base text-muted-foreground mb-12 max-w-2xl ",
        "data-jp-field": "description",
        children: data.description
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: data.cards.map((card) => /* @__PURE__ */ jsxs(
      "article",
      {
        "data-jp-item-id": card.id ?? card.title,
        "data-jp-item-field": "cards",
        className: "jp-feature-card card-hover p-8 rounded-2xl",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: card.icon.url,
              alt: card.icon.alt ?? card.title,
              className: "w-10 h-10 mb-4",
              "data-jp-field": "icon"
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display mb-3 text-foreground", "data-jp-field": "title", children: card.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", "data-jp-field": "description", children: card.description })
        ]
      },
      card.id ?? card.title
    )) })
  ] });
}
const FeatureCardSchema = BaseArrayItem.extend({
  icon: ImageSelectionSchema.describe("ui:image-picker"),
  title: z.string().describe("ui:text"),
  description: z.string().describe("ui:textarea")
});
const CloudAiNativeGridSchema = BaseSectionData.extend({
  titlePrefix: z.string().describe("ui:text"),
  titleGradient: z.string().describe("ui:text"),
  description: z.string().describe("ui:textarea"),
  cards: z.array(FeatureCardSchema).describe("ui:list")
});
z.object({});
function PageHero({ data }) {
  const crumbs = data.breadcrumb ?? [];
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: "py-14 px-6 border-b border-[var(--local-border)] bg-[var(--local-bg)]",
      style: {
        "--local-bg": "var(--card)",
        "--local-text": "var(--foreground)",
        "--local-text-muted": "var(--muted-foreground)",
        "--local-border": "var(--border)"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
        crumbs.length > 0 && /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-2 font-mono-olon text-xs tracking-label uppercase text-muted-foreground mb-6", children: crumbs.map((item, idx) => /* @__PURE__ */ jsxs(E__default.Fragment, { children: [
          idx > 0 && /* @__PURE__ */ jsx("span", { className: "text-border-strong select-none", children: "/" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: item.href,
              "data-jp-item-id": item.id ?? `crumb-${idx}`,
              "data-jp-item-field": "breadcrumb",
              className: "hover:text-[var(--local-text)] transition-colors",
              children: item.label
            }
          )
        ] }, item.id ?? `crumb-${idx}`)) }),
        data.badge && /* @__PURE__ */ jsx(
          "div",
          {
            className: "inline-flex items-center font-mono-olon text-xs font-medium tracking-label uppercase text-primary-light bg-primary-900 border border-primary px-3 py-1 rounded-sm mb-5",
            "data-jp-field": "badge",
            children: data.badge
          }
        ),
        /* @__PURE__ */ jsx(
          "h1",
          {
            className: "font-display font-normal text-4xl md:text-5xl leading-tight tracking-display text-[var(--local-text)] mb-1",
            "data-jp-field": "title",
            children: data.title
          }
        ),
        data.titleItalic && /* @__PURE__ */ jsx(
          "p",
          {
            className: "font-display font-normal italic text-4xl md:text-5xl leading-tight tracking-display text-primary-light mb-0",
            "data-jp-field": "titleItalic",
            children: data.titleItalic
          }
        ),
        data.description && /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-base text-[var(--local-text-muted)] leading-relaxed max-w-xl mt-5",
            "data-jp-field": "description",
            children: data.description
          }
        )
      ] })
    }
  );
}
const BreadcrumbItemSchema = BaseArrayItem.extend({
  label: z.string().describe("ui:text"),
  href: z.string().describe("ui:text")
});
const PageHeroSchema = BaseSectionData.extend({
  badge: z.string().optional().describe("ui:text"),
  title: z.string().describe("ui:text"),
  titleItalic: z.string().optional().describe("ui:text"),
  description: z.string().optional().describe("ui:textarea"),
  breadcrumb: z.array(BreadcrumbItemSchema).optional().describe("ui:list")
});
function slugify(raw) {
  return raw.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/[*_`#[\]()]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s.-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function extractToc(markdown) {
  const entries = [];
  for (const line of markdown.split("\n")) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/[*_`#[\]]/g, "").replace(/[\u{1F300}-\u{1FFFF}]/gu, "").trim();
      entries.push({ id: slugify(h2[1]), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/[*_`#[\]]/g, "").trim();
      entries.push({ id: slugify(h3[1]), text, level: 3 });
    }
  }
  return entries;
}
function mdChildrenToPlainText(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(mdChildrenToPlainText).join("");
  if (E__default.isValidElement(node)) {
    const ch2 = node.props.children;
    if (ch2 != null) return mdChildrenToPlainText(ch2);
  }
  return "";
}
function readScrollSpyOffsetPx() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--theme-header-h").trim();
  const n = parseFloat(raw);
  const header2 = Number.isFinite(n) ? n : 56;
  return header2 + 24;
}
function computeActiveTocId(ids, offsetPx) {
  let active = "";
  for (const id2 of ids) {
    const el2 = document.getElementById(id2);
    if (!el2) continue;
    if (el2.getBoundingClientRect().top <= offsetPx) active = id2;
  }
  return active;
}
function computeActiveTocIdFromHeadings(container, toc, offsetPx) {
  const allowed = new Set(toc.map((e) => e.id));
  let active = "";
  container.querySelectorAll("h2, h3").forEach((h2) => {
    const id2 = slugify(h2.textContent ?? "");
    if (!allowed.has(id2)) return;
    if (h2.getBoundingClientRect().top <= offsetPx) active = id2;
  });
  return active;
}
const DocsSidebar = ({ toc, activeId, onNav }) => {
  const navScrollRef = E__default.useRef(null);
  E__default.useEffect(() => {
    if (!activeId || !navScrollRef.current) return;
    const btn = navScrollRef.current.querySelector(
      `button[data-toc-id="${CSS.escape(activeId)}"]`
    );
    btn == null ? void 0 : btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId, toc]);
  return /* @__PURE__ */ jsx(
    "aside",
    {
      className: "hidden w-[min(240px,28vw)] flex-shrink-0 flex-col lg:flex lg:sticky lg:self-start",
      style: {
        top: "calc(var(--theme-header-h, 56px) + 1rem)",
        maxHeight: "calc(100vh - var(--theme-header-h, 56px) - 4rem)"
      },
      children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--local-radius-md)] border border-[var(--local-border)] bg-[color-mix(in_srgb,var(--local-toolbar-bg)_40%,transparent)]", children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0 border-b border-[var(--local-border)] px-3 py-2.5", children: /* @__PURE__ */ jsx("div", { className: "text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--local-toolbar-text)]", children: "On this page" }) }),
        /* @__PURE__ */ jsx(
          "nav",
          {
            ref: navScrollRef,
            className: "jp-docs-toc-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain px-1.5 py-2",
            "aria-label": "Table of contents",
            children: toc.map((entry) => /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                "data-toc-id": entry.id,
                onClick: () => onNav(entry.id),
                className: [
                  "text-left rounded-[var(--local-radius-sm)] transition-colors duration-150 no-underline",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--local-bg)]",
                  entry.level === 3 ? "pl-[22px] pr-2 py-1.5 text-[0.72rem] ml-0.5" : "px-2.5 py-2 font-bold text-[0.76rem]",
                  activeId === entry.id ? entry.level === 2 ? "text-[var(--local-primary)] bg-[var(--local-toolbar-hover-bg)] border-l-2 border-[var(--local-primary)] pl-[8px]" : "text-[var(--local-primary)] font-semibold bg-[var(--local-toolbar-active-bg)]" : "text-[var(--local-text-muted)] hover:text-[var(--local-text)] hover:bg-[var(--local-toolbar-hover-bg)]"
                ].join(" "),
                children: [
                  entry.level === 3 && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `mr-2 inline-block h-[5px] w-[5px] flex-shrink-0 rounded-full align-middle mb-px ${activeId === entry.id ? "bg-[var(--local-primary)]" : "bg-[var(--local-border)]"}`
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "line-clamp-3", children: entry.text })
                ]
              },
              entry.id
            ))
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "shrink-0 border-t border-[var(--local-border)] px-2 py-2.5", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            className: "flex w-full items-center gap-2 px-2 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--local-text-muted)] transition-colors hover:text-[var(--local-primary)]",
            children: "↑ Back to top"
          }
        ) })
      ] })
    }
  );
};
const Btn = ({ active = false, title, onClick, children }) => /* @__PURE__ */ jsx(
  "button",
  {
    type: "button",
    title,
    onMouseDown: (e) => e.preventDefault(),
    onClick,
    className: [
      "inline-flex h-7 min-w-7 items-center justify-center rounded-[var(--local-radius-sm)] px-2 text-xs transition-colors",
      active ? "bg-[var(--local-toolbar-active-bg)] text-[var(--local-text)]" : "text-[var(--local-toolbar-text)] hover:bg-[var(--local-toolbar-hover-bg)] hover:text-[var(--local-text)]"
    ].join(" "),
    children
  }
);
const Sep = () => /* @__PURE__ */ jsx("span", { className: "mx-0.5 h-5 w-px shrink-0 bg-[var(--local-toolbar-border)]", "aria-hidden": true });
const UploadableImage = Image.extend({
  addAttributes() {
    var _a;
    const bool = (attr) => ({
      default: false,
      parseHTML: (el2) => el2.getAttribute(attr) === "true",
      renderHTML: (attrs) => attrs[attr.replace("data-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())] ? { [attr]: "true" } : {}
    });
    return {
      ...(_a = this.parent) == null ? void 0 : _a.call(this),
      uploadId: {
        default: null,
        parseHTML: (el2) => el2.getAttribute("data-upload-id"),
        renderHTML: (attrs) => attrs.uploadId ? { "data-upload-id": String(attrs.uploadId) } : {}
      },
      uploading: bool("data-uploading"),
      uploadError: bool("data-upload-error"),
      awaitingUpload: bool("data-awaiting-upload")
    };
  }
});
const getMarkdown = (ed2) => {
  var _a, _b, _c;
  return ((_c = (_b = (_a = ed2 == null ? void 0 : ed2.storage) == null ? void 0 : _a.markdown) == null ? void 0 : _b.getMarkdown) == null ? void 0 : _c.call(_b)) ?? "";
};
const svg = (body) => "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'>${body}</svg>`
);
const RECT = `<rect width='1200' height='420' fill='#090B14' stroke='#3F3F46' stroke-width='3' stroke-dasharray='10 10' rx='12'/>`;
const UPLOADING_SRC = svg(
  RECT + `<text x='600' y='215' font-family='Inter,Arial,sans-serif' font-size='28' font-weight='700' fill='#A1A1AA' text-anchor='middle'>Uploading image…</text>`
);
const PICKER_SRC = svg(
  RECT + `<text x='600' y='200' font-family='Inter,Arial,sans-serif' font-size='32' font-weight='700' fill='#E4E4E7' text-anchor='middle'>Click to upload or drag &amp; drop</text><text x='600' y='248' font-family='Inter,Arial,sans-serif' font-size='22' fill='#A1A1AA' text-anchor='middle'>Max 5 MB per file</text>`
);
const patchImage = (ed2, uploadId, patch) => {
  let pos = null;
  ed2.state.doc.descendants(
    (node, p) => {
      var _a;
      if (node.type.name === "image" && ((_a = node.attrs) == null ? void 0 : _a.uploadId) === uploadId) {
        pos = p;
        return false;
      }
      return true;
    }
  );
  if (pos == null) return false;
  const cur = ed2.state.doc.nodeAt(pos);
  if (!cur) return false;
  ed2.view.dispatch(ed2.state.tr.setNodeMarkup(pos, void 0, { ...cur.attrs, ...patch }));
  return true;
};
const EXTENSIONS = [
  StarterKit,
  Link.configure({ openOnClick: false, autolink: true }),
  UploadableImage,
  // NOTE: Underline is intentionally excluded.
  // tiptap-markdown with html:false cannot round-trip <u> tags, so underline
  // would be silently dropped on save. Use bold/italic instead.
  Markdown.configure({ html: false })
];
const EDITOR_CLASSES = "min-h-[220px] p-4 outline-none";
const StudioTiptapEditor = ({ data }) => {
  const { assets } = Cn();
  const hostRef = E__default.useRef(null);
  const sectionRef = E__default.useRef(null);
  const fileInputRef = E__default.useRef(null);
  const editorRef = E__default.useRef(null);
  const pendingUploads = E__default.useRef(/* @__PURE__ */ new Map());
  const pendingPickerId = E__default.useRef(null);
  const latestMd = E__default.useRef(data.content ?? "");
  const emittedMd = E__default.useRef(data.content ?? "");
  const [linkOpen, setLinkOpen] = E__default.useState(false);
  const [linkUrl, setLinkUrl] = E__default.useState("");
  const linkInputRef = E__default.useRef(null);
  const getSectionId = E__default.useCallback(() => {
    var _a;
    const el2 = sectionRef.current ?? ((_a = hostRef.current) == null ? void 0 : _a.closest("[data-section-id]"));
    sectionRef.current = el2;
    return (el2 == null ? void 0 : el2.getAttribute("data-section-id")) ?? null;
  }, []);
  const emit = E__default.useCallback(
    (markdown) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
      if (!sectionId) return;
      window.parent.postMessage(
        {
          type: Te.INLINE_FIELD_UPDATE,
          sectionId,
          fieldKey: "content",
          value: markdown
        },
        window.location.origin
      );
      emittedMd.current = markdown;
    },
    [getSectionId]
  );
  const setFocusLock = E__default.useCallback((on2) => {
    var _a;
    (_a = sectionRef.current) == null ? void 0 : _a.classList.toggle("jp-editorial-focus", on2);
  }, []);
  const insertPlaceholder = E__default.useCallback(
    (uploadId, src, awaitingUpload) => {
      const ed2 = editorRef.current;
      if (!ed2) return;
      ed2.chain().focus().setImage({
        src,
        alt: "upload-placeholder",
        title: awaitingUpload ? "Click to upload" : "Uploading…",
        uploadId,
        uploading: !awaitingUpload,
        awaitingUpload,
        uploadError: false
      }).run();
      emit(getMarkdown(ed2));
    },
    [emit]
  );
  const doUpload = E__default.useCallback(
    async (uploadId, file) => {
      const uploadFn = assets == null ? void 0 : assets.onAssetUpload;
      if (!uploadFn) return;
      const ed2 = editorRef.current;
      if (!ed2) return;
      patchImage(ed2, uploadId, {
        src: UPLOADING_SRC,
        alt: file.name,
        title: file.name,
        uploading: true,
        awaitingUpload: false,
        uploadError: false
      });
      const task = (async () => {
        try {
          const url = await uploadFn(file);
          const cur = editorRef.current;
          if (cur) {
            patchImage(cur, uploadId, {
              src: url,
              alt: file.name,
              title: file.name,
              uploadId: null,
              uploading: false,
              awaitingUpload: false,
              uploadError: false
            });
            emit(getMarkdown(cur));
          }
        } catch (err) {
          console.error("[tiptap] upload failed", err);
          const cur = editorRef.current;
          if (cur)
            patchImage(cur, uploadId, {
              uploading: false,
              awaitingUpload: false,
              uploadError: true
            });
        } finally {
          pendingUploads.current.delete(uploadId);
        }
      })();
      pendingUploads.current.set(uploadId, task);
      await task;
    },
    [assets, emit]
  );
  const uploadFile = E__default.useCallback(
    async (file) => {
      const id2 = crypto.randomUUID();
      insertPlaceholder(id2, UPLOADING_SRC, false);
      await doUpload(id2, file);
    },
    [insertPlaceholder, doUpload]
  );
  const uploadFileRef = E__default.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = E__default.useRef(assets);
  assetsRef.current = assets;
  const editorProps = E__default.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v, event) => {
        var _a, _b, _c;
        const file = (_b = (_a = event.dataTransfer) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
        if (!(file == null ? void 0 : file.type.startsWith("image/")) || !((_c = assetsRef.current) == null ? void 0 : _c.onAssetUpload)) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch(
          (e) => console.error("[tiptap] drop upload failed", e)
        );
        return true;
      },
      handlePaste: (_v, event) => {
        var _a, _b;
        const file = Array.from(((_a = event.clipboardData) == null ? void 0 : _a.files) ?? []).find(
          (f) => f.type.startsWith("image/")
        );
        if (!file || !((_b = assetsRef.current) == null ? void 0 : _b.onAssetUpload)) return false;
        event.preventDefault();
        void uploadFileRef.current(file).catch(
          (e) => console.error("[tiptap] paste upload failed", e)
        );
        return true;
      },
      handleClickOn: (_v, _p, node) => {
        var _a, _b, _c;
        if (node.type.name !== "image" || ((_a = node.attrs) == null ? void 0 : _a.awaitingUpload) !== true) return false;
        const uploadId = typeof ((_b = node.attrs) == null ? void 0 : _b.uploadId) === "string" ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        (_c = fileInputRef.current) == null ? void 0 : _c.click();
        return true;
      }
    }),
    []
    // intentionally empty — reads refs at call-time
  );
  const emitRef = E__default.useRef(emit);
  emitRef.current = emit;
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: data.content ?? "",
    autofocus: false,
    editorProps,
    onUpdate: ({ editor: e }) => emitRef.current(getMarkdown(e)),
    onFocus: () => setFocusLock(true),
    onBlur: ({ editor: e }) => {
      const md2 = getMarkdown(e);
      if (md2 !== emittedMd.current) emitRef.current(md2);
      setFocusLock(false);
    }
  });
  E__default.useEffect(() => {
    var _a;
    sectionRef.current = (_a = hostRef.current) == null ? void 0 : _a.closest("[data-section-id]");
  }, []);
  E__default.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);
  E__default.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? "";
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);
  E__default.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(Te.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(Te.REQUEST_INLINE_FLUSH, handler);
  }, []);
  E__default.useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;
    const onCancel = () => {
      const pickId = pendingPickerId.current;
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true
        });
      }
      pendingPickerId.current = null;
    };
    input.addEventListener("cancel", onCancel);
    return () => input.removeEventListener("cancel", onCancel);
  }, []);
  E__default.useEffect(
    () => () => {
      const md2 = getMarkdown(editorRef.current);
      if (md2 !== emittedMd.current) emitRef.current(md2);
      setFocusLock(false);
    },
    [setFocusLock]
  );
  E__default.useEffect(() => {
    if (linkOpen) {
      const t = setTimeout(() => {
        var _a;
        return (_a = linkInputRef.current) == null ? void 0 : _a.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [linkOpen]);
  const openLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    setLinkUrl(prev ?? "https://");
    setLinkOpen(true);
  };
  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (href === "" || href === "https://") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
  };
  const onFileSelected = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    const pickId = pendingPickerId.current;
    e.target.value = "";
    if (!(file == null ? void 0 : file.type.startsWith("image/")) || !(assets == null ? void 0 : assets.onAssetUpload)) {
      if (pickId && editorRef.current) {
        patchImage(editorRef.current, pickId, {
          uploading: false,
          awaitingUpload: false,
          uploadError: true
        });
      }
      pendingPickerId.current = null;
      return;
    }
    void (async () => {
      try {
        if (pickId) {
          await doUpload(pickId, file);
          pendingPickerId.current = null;
        } else {
          await uploadFile(file);
        }
      } catch (err) {
        console.error("[tiptap] picker upload failed", err);
        pendingPickerId.current = null;
      }
    })();
  };
  const onPickImage = () => {
    if (pendingPickerId.current) return;
    const id2 = crypto.randomUUID();
    pendingPickerId.current = id2;
    insertPlaceholder(id2, PICKER_SRC, true);
  };
  const isActive = (name2, attrs) => (editor == null ? void 0 : editor.isActive(name2, attrs)) ?? false;
  return /* @__PURE__ */ jsxs("div", { ref: hostRef, "data-jp-field": "content", className: "space-y-2", children: [
    editor && /* @__PURE__ */ jsxs(
      "div",
      {
        "data-jp-ignore-select": "true",
        className: "sticky top-0 z-[65] border-b border-[var(--local-toolbar-border)] bg-[var(--local-toolbar-bg)]",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-1 p-2", children: [
            /* @__PURE__ */ jsx(Btn, { title: "Undo", onClick: () => editor.chain().focus().undo().run(), children: /* @__PURE__ */ jsx(Undo2, { size: 13 }) }),
            /* @__PURE__ */ jsx(Btn, { title: "Redo", onClick: () => editor.chain().focus().redo().run(), children: /* @__PURE__ */ jsx(Redo2, { size: 13 }) }),
            /* @__PURE__ */ jsx(Sep, {}),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("paragraph"),
                title: "Paragraph",
                onClick: () => editor.chain().focus().setParagraph().run(),
                children: "P"
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("heading", { level: 1 }),
                title: "Heading 1",
                onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                children: "H1"
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("heading", { level: 2 }),
                title: "Heading 2",
                onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                children: "H2"
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("heading", { level: 3 }),
                title: "Heading 3",
                onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                children: "H3"
              }
            ),
            /* @__PURE__ */ jsx(Sep, {}),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("bold"),
                title: "Bold (Ctrl+B)",
                onClick: () => editor.chain().focus().toggleBold().run(),
                children: /* @__PURE__ */ jsx(Bold, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("italic"),
                title: "Italic (Ctrl+I)",
                onClick: () => editor.chain().focus().toggleItalic().run(),
                children: /* @__PURE__ */ jsx(Italic, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("strike"),
                title: "Strikethrough",
                onClick: () => editor.chain().focus().toggleStrike().run(),
                children: /* @__PURE__ */ jsx(Strikethrough, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("code"),
                title: "Inline code",
                onClick: () => editor.chain().focus().toggleCode().run(),
                children: /* @__PURE__ */ jsx(Code2, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(Sep, {}),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("bulletList"),
                title: "Bullet list",
                onClick: () => editor.chain().focus().toggleBulletList().run(),
                children: /* @__PURE__ */ jsx(List, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("orderedList"),
                title: "Ordered list",
                onClick: () => editor.chain().focus().toggleOrderedList().run(),
                children: /* @__PURE__ */ jsx(ListOrdered, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("blockquote"),
                title: "Blockquote",
                onClick: () => editor.chain().focus().toggleBlockquote().run(),
                children: /* @__PURE__ */ jsx(Quote, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("codeBlock"),
                title: "Code block",
                onClick: () => editor.chain().focus().toggleCodeBlock().run(),
                children: /* @__PURE__ */ jsx(SquareCode, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(Sep, {}),
            /* @__PURE__ */ jsx(
              Btn,
              {
                active: isActive("link") || linkOpen,
                title: "Set link",
                onClick: openLink,
                children: /* @__PURE__ */ jsx(Link2, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(
              Btn,
              {
                title: "Remove link",
                onClick: () => editor.chain().focus().unsetLink().run(),
                children: /* @__PURE__ */ jsx(Unlink2, { size: 13 })
              }
            ),
            /* @__PURE__ */ jsx(Btn, { title: "Insert image", onClick: onPickImage, children: /* @__PURE__ */ jsx(ImagePlus, { size: 13 }) }),
            /* @__PURE__ */ jsx(
              Btn,
              {
                title: "Clear formatting",
                onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
                children: /* @__PURE__ */ jsx(Eraser, { size: 13 })
              }
            )
          ] }),
          linkOpen && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-t border-[var(--local-toolbar-border)] px-2 py-1.5", children: [
            /* @__PURE__ */ jsx(Link2, { size: 12, className: "shrink-0 text-[var(--local-toolbar-text)]" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: linkInputRef,
                type: "url",
                value: linkUrl,
                onChange: (e) => setLinkUrl(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyLink();
                  }
                  if (e.key === "Escape") setLinkOpen(false);
                },
                placeholder: "https://example.com",
                className: "min-w-0 flex-1 bg-transparent text-xs text-[var(--local-text)] placeholder:text-[var(--local-toolbar-text)] outline-none"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onMouseDown: (e) => e.preventDefault(),
                onClick: applyLink,
                className: "shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-primary)] hover:brightness-110 text-white transition-colors",
                children: "Set"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => setLinkOpen(false),
                className: "shrink-0 rounded-[var(--local-radius-sm)] px-2 py-0.5 text-xs bg-[var(--local-toolbar-active-bg)] hover:bg-[var(--local-toolbar-hover-bg)] text-[var(--local-text)] transition-colors",
                children: "Cancel"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(EditorContent, { editor, className: "jp-simple-editor" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: onFileSelected
      }
    )
  ] });
};
const mdHeading = (level) => ({ children, node: _node, ...rest }) => {
  const plain = mdChildrenToPlainText(children);
  const id2 = slugify(plain);
  const Tag = `h${level}`;
  return /* @__PURE__ */ jsx(Tag, { id: id2, ...rest, children });
};
const MD_COMPONENTS = {
  h2: mdHeading(2),
  h3: mdHeading(3)
};
const PublicTiptapContent = ({ content }) => /* @__PURE__ */ jsx("article", { className: "jp-tiptap-content max-w-none", "data-jp-field": "content", children: /* @__PURE__ */ jsx(
  ReactMarkdown,
  {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSanitize],
    components: MD_COMPONENTS,
    children: content
  }
) });
const Tiptap = ({ data, settings: _settings }) => {
  const { mode } = Ed();
  const isStudio = mode === "studio";
  const toc = E__default.useMemo(() => extractToc(data.content ?? ""), [data.content]);
  const [activeId, setActiveId] = E__default.useState("");
  const contentRef = E__default.useRef(null);
  E__default.useEffect(() => {
    if (toc.length === 0) return;
    const ids = toc.map((e) => e.id);
    let raf = 0;
    const tick = () => {
      const offset = readScrollSpyOffsetPx();
      const next = isStudio ? contentRef.current ? computeActiveTocIdFromHeadings(contentRef.current, toc, offset) : "" : computeActiveTocId(ids, offset);
      if (next) setActiveId((prev) => prev === next ? prev : next);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => {
      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }, 100);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc, isStudio]);
  const handleNav = E__default.useCallback((id2) => {
    const el2 = document.getElementById(id2);
    if (el2) {
      el2.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id2);
      return;
    }
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );
      const target = headings.find((h2) => slugify(h2.textContent ?? "") === id2);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id2);
      }
    }
  }, []);
  return /* @__PURE__ */ jsx(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-text": "var(--foreground)",
        "--local-text-muted": "var(--muted-foreground)",
        "--local-primary": "var(--primary)",
        "--local-accent": "var(--accent)",
        "--local-border": "var(--border)",
        "--local-radius-sm": "var(--theme-radius-sm)",
        "--local-radius-md": "var(--theme-radius-md)",
        "--local-radius-lg": "var(--theme-radius-lg)",
        "--local-toolbar-bg": "var(--demo-surface-strong)",
        "--local-toolbar-hover-bg": "var(--demo-surface)",
        "--local-toolbar-active-bg": "var(--demo-accent-soft)",
        "--local-toolbar-border": "var(--demo-border-soft)",
        "--local-toolbar-text": "var(--demo-text-faint)"
      },
      className: "w-full py-12 bg-[var(--local-bg)]",
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 max-w-6xl", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-8 py-12", children: [
        toc.length > 0 && /* @__PURE__ */ jsx(DocsSidebar, { toc, activeId, onNav: handleNav }),
        /* @__PURE__ */ jsx("div", { ref: contentRef, className: "flex-1 min-w-0", children: isStudio ? /* @__PURE__ */ jsx(StudioTiptapEditor, { data }) : /* @__PURE__ */ jsx(PublicTiptapContent, { content: data.content ?? "" }) })
      ] }) })
    }
  );
};
const TiptapSchema = BaseSectionData.extend({
  content: z.string().default("").describe("ui:editorial-markdown")
});
z.object({});
const ComponentRegistry = {
  "header": Header,
  "footer": Footer,
  "hero": Hero,
  "feature-grid": FeatureGrid,
  "contact": Contact,
  "login": Login,
  "design-system": DesignSystemView,
  "cloud-ai-native-grid": CloudAiNativeGridView,
  "page-hero": PageHero,
  "tiptap": Tiptap
};
const SECTION_SCHEMAS = {
  "header": HeaderSchema,
  "footer": FooterSchema,
  "hero": HeroSchema,
  "feature-grid": FeatureGridSchema,
  "contact": ContactSchema,
  "login": LoginSchema,
  "design-system": DesignSystemSchema,
  "cloud-ai-native-grid": CloudAiNativeGridSchema,
  "page-hero": PageHeroSchema,
  "tiptap": TiptapSchema
};
const id$4 = "design-system-page";
const slug$4 = "design-system";
const meta$4 = { "title": "Olon Design System — Design Language", "description": "Token reference, color system, typography, components and brand identity for the OlonJS design language." };
const sections$4 = [{ "id": "ds-main", "type": "design-system", "data": { "title": "Olon" }, "settings": {} }];
const designSystem = {
  id: id$4,
  slug: slug$4,
  "global-header": false,
  meta: meta$4,
  sections: sections$4
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: designSystem,
  id: id$4,
  meta: meta$4,
  sections: sections$4,
  slug: slug$4
}, Symbol.toStringTag, { value: "Module" }));
const id$3 = "docs-page";
const slug$3 = "docs";
const meta$3 = { "title": "OlonJS Architecture Specifications v1.3", "description": "Mandatory Standard — Sovereign Core Edition. Architecture, Studio/ICE UX, Path-Deterministic Nested Editing." };
const sections$3 = /* @__PURE__ */ JSON.parse("[{\"id\":\"docs-main\",\"type\":\"tiptap\",\"data\":{\"content\":\"# 📐 OlonJS Architecture Specifications v1.5s\\n\\n**Status:** Mandatory Standard\\\\\\n**Version:** 1.5.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing, Deterministic Local Design Tokens, Three-Layer CSS Bridge Contract)\\\\\\n**Target:** Senior Architects / AI Agents / Enterprise Governance\\n\\n**Scope v1.5:** This edition preserves the complete v1.4 architecture (MTRP, JSP, TBP, CIP, ECIP, JAP + Studio/ICE UX contract: IDAC, TOCC, BSDS, ASC, JEB + Tenant Type & Code-Generation Annex + strict path-based/nested-array behavior) as a **faithful superset**, and upgrades **Local Design Tokens** from a principle to a deterministic implementation contract.\\\\\\n⚠️ **Scope note (breaking):** In strict v1.3+ Studio semantics, the legacy flat protocol (`itemField` / `itemId`) is removed in favor of `itemPath` (root-to-leaf path segments).\\\\\\nℹ️ **Scope note (clarification):** In v1.5, `theme.json` is the tenant theme source of truth for themed tenants; runtime theme publication is mandatory for compliant themed tenants; section-local tokens (`--local-*`) are the required scoping layer for section-owned color and radius concerns.\\n\\n---\\n\\n## 1. 📐 Modular Type Registry Pattern (MTRP) v1.2\\n\\n**Objective:** Establish a strictly typed, open-ended protocol for extending content data structures where the **Core Engine** is the orchestrator and the **Tenant** is the provider.\\n\\n### 1.1 The Sovereign Dependency Inversion\\n\\nThe **Core** defines the empty `SectionDataRegistry`. The **Tenant** \\\"injects\\\" its specific definitions using **Module Augmentation**. This allows the Core to be distributed as a compiled NPM package while remaining aware of Tenant-specific types at compile-time.\\n\\n### 1.2 Technical Implementation (`@olonjs/core/kernel`)\\n\\n```typescript\\nexport interface SectionDataRegistry {} // Augmented by Tenant\\nexport interface SectionSettingsRegistry {} // Augmented by Tenant\\n\\nexport interface BaseSection<K extends keyof SectionDataRegistry> {\\n  id: string;\\n  type: K;\\n  data: SectionDataRegistry[K];\\n  settings?: K extends keyof SectionSettingsRegistry\\n    ? SectionSettingsRegistry[K]\\n    : BaseSectionSettings;\\n}\\n\\nexport type Section = {\\n  [K in keyof SectionDataRegistry]: BaseSection<K>\\n}[keyof SectionDataRegistry];\\n```\\n\\n**SectionType:** Core exports (or Tenant infers) `SectionType` as `keyof SectionDataRegistry`. After Tenant module augmentation, this is the union of all section type keys (e.g. `'header' | 'footer' | 'hero' | ...`). The Tenant uses this type for the ComponentRegistry and SECTION_SCHEMAS keys.\\n\\n**Why ❔:** The Core must be able to render section without knowing the concrete types to compile-time; the Tenant must be able to add new types without modifying the Core. Empty registry + module augmentation allow you to deploy Core as an NPM package and keep type-safety end-to-end (Section, registry, config). Without MTRP, each new type would require changes in the Core or weak types (any).\\n\\n---\\n\\n## 2. 📐 JsonPages Site Protocol (JSP) v1.8\\n\\n**Objective:** Define the deterministic file system and the **Sovereign Projection Engine** (CLI).\\n\\n### 2.1 The File System Ontology (The Silo Contract)\\n\\nEvery site must reside in an isolated directory. Global Governance is physically separated from Local Content.\\n\\n- `/config/site.json` — Global Identity & Reserved System Blocks (Header/Footer). See Appendix A for typed shape.\\n- `/config/menu.json` — Navigation Tree (SSOT for System Header). See Appendix A.\\n- `/config/theme.json` — Theme tokens for themed tenants. See Appendix A.\\n- `/pages/[slug].json` — Local Body Content per page. See Appendix A (PageConfig).\\n\\n**Application path convention:** The runtime app typically imports these via an alias (e.g. `@/data/config/` and `@/data/pages/`). The physical silo may be `src/data/config/` and `src/data/pages/` so that `site.json`, `menu.json`, `theme.json` live under `src/data/config/`, and page JSONs under `src/data/pages/`. The CLI or projection script may use `/config/` and `/pages/` at repo root; the **contract** is that the app receives **siteConfig**, **menuConfig**, **themeConfig**, and **pages** as defined in JEB (§10) and Appendix A.\\n\\n**Rule:** For a tenant that claims v1.4 design-token compliance, `theme.json` is not optional in practice. If a tenant omits a physical `theme.json`, it must still provide an equivalent `ThemeConfig` object before bootstrap; otherwise the tenant is outside full v1.4 theme compliance.\\n\\n### 2.2 Deterministic Projection (CLI Workflow)\\n\\nThe CLI (`@olonjs/cli`) creates new tenants by:\\n\\n1. **Infra Projection:** Generating `package.json`, `tsconfig.json`, and `vite.config.ts` (The Shell).\\n2. **Source Projection:** Executing a deterministic script (`src_tenant_alpha.sh`) to reconstruct the `src` folder (The DNA).\\n3. **Dependency Resolution:** Enforcing specific versions of React, Radix, and Tailwind v4.\\n\\n**Why they are needed:** A deterministic file structure (config vs pages) separates global governance (site, menu, theme) from content per page; CLI can regenerate tenants and tooling can find data and schematics always in the same paths. Without JSP, each tenant would be an ad hoc structure and ingestion/export/Bake would be fragile.\\n\\n---\\n\\n## 3. 🧱 Tenant Block Protocol (TBP) v1.0\\n\\n**Objective:** Standardize the \\\"Capsule\\\" structure for components to enable automated ingestion (Pull) by the SaaS.\\n\\n### 3.1 The Atomic Capsule Structure\\n\\nComponents are self-contained directories under `src/components/<sectionType>/`:\\n\\n- `View.tsx` — The pure React component (Dumb View). Props: see Appendix A (SectionComponentPropsMap).\\n- `schema.ts` — Zod schema(s) for the **data** contract (and optionally **settings**). Exports at least one schema (e.g. `HeroSchema`) used as the **data** schema for that type. Must extend BaseSectionData (§8) for data; array items must extend BaseArrayItem (§8).\\n- `types.ts` — TypeScript interfaces inferred from the schema (e.g. `HeroData`, `HeroSettings`). Export types with names `<SectionType>Data` and `<SectionType>Settings` (or equivalent) so the Tenant can aggregate them in a single types module.\\n- `index.ts` — Public API: re-exports View, schema(s), and types.\\n\\n### 3.2 Reserved System Types\\n\\n- `type: 'header'` — Reserved for `site.json`. Receives `menu: MenuItem[]` in addition to `data` and `settings`. Menu is sourced from `menu.json` (see Appendix A). The Tenant **must** type `SectionComponentPropsMap['header']` as `{ data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] }`.\\n- `type: 'footer'` — Reserved for `site.json`. Props: `{ data: FooterData; settings?: FooterSettings }` only (no `menu`).\\n- `type: 'sectionHeader'` — A standard local block. Must define its own `links` array in its local schema if used.\\n\\n**Perché servono:** La capsula (View + schema + types + index) è l’unità di estensione: il Core e il Form Factory possono scoprire tipi e contratti per tipo senza convenzioni ad hoc. Header/footer riservati evitano conflitti tra globale e locale. Senza TBP, aggregazione di SECTION_SCHEMAS e registry sarebbe incoerente e l’ingestion da SaaS non sarebbe automatizzabile.\\n\\n---\\n\\n## 4. 🧱 Component Implementation Protocol (CIP) v1.6\\n\\n**Objective:** Ensure system-wide stability and Admin UI integrity.\\n\\n1. **The \\\"Sovereign View\\\" Law:** Components receive `data` and `settings` (and `menu` for header only) and return JSX. They are metadata-blind (never import Zod schemas).\\n2. **Z-Index Neutrality:** Components must not use `z-index > 1`. Layout delegation (sticky/fixed) is managed by the `SectionRenderer`.\\n3. **Agnostic Asset Protocol:** Use `resolveAssetUrl(path, tenantId)` for all media. Resolved URLs are under `/assets/...` with no tenantId segment in the path (e.g. relative `img/hero.jpg` → `/assets/img/hero.jpg`).\\n\\n### 4.4 Local Design Tokens (v1.4)\\n\\n**Objective:** Standardize how a section consumes tenant theme values without leaking global styling assumptions into the section implementation.\\n\\n#### 4.4.1 The Required Four-Layer Chain\\n\\nFor any section that controls background, text color, border color, accent color, or radii, the following chain is normative:\\n\\n1. **Tenant theme source of truth** — Values are declared in `src/data/config/theme.json`.\\n2. **Runtime theme publication** — The Core and/or tenant bootstrap **must** publish those values as CSS custom properties.\\n3. **Section-local scope** — The View root **must** define `--local-*` variables mapped to the published theme variables for the concerns the section owns.\\n4. **Rendered classes** — Section-owned color/radius utilities **must** consume `var(--local-*)`.\\n\\n**Rule:** A section may not skip layer 3 when it visually owns those concerns. Directly using global theme variables throughout the JSX is non-canonical for a fully themed section and must be treated as non-compliant unless the usage falls under an explicitly allowed exception.\\n\\n#### 4.4.2 Source Of Truth: `theme.json`\\n\\n`theme.json` is the tenant-level source of truth for theme values. Example:\\n\\n```json\\n{\\n  \\\"name\\\": \\\"JsonPages Landing\\\",\\n  \\\"tokens\\\": {\\n    \\\"colors\\\": {\\n      \\\"primary\\\": \\\"#3b82f6\\\",\\n      \\\"secondary\\\": \\\"#22d3ee\\\",\\n      \\\"accent\\\": \\\"#60a5fa\\\",\\n      \\\"background\\\": \\\"#060d1b\\\",\\n      \\\"surface\\\": \\\"#0b1529\\\",\\n      \\\"surfaceAlt\\\": \\\"#101e38\\\",\\n      \\\"text\\\": \\\"#e2e8f0\\\",\\n      \\\"textMuted\\\": \\\"#94a3b8\\\",\\n      \\\"border\\\": \\\"#162a4d\\\"\\n    },\\n    \\\"typography\\\": {\\n      \\\"fontFamily\\\": {\\n        \\\"primary\\\": \\\"'Instrument Sans', system-ui, sans-serif\\\",\\n        \\\"mono\\\": \\\"'JetBrains Mono', monospace\\\",\\n        \\\"display\\\": \\\"'Bricolage Grotesque', system-ui, sans-serif\\\"\\n      }\\n    },\\n    \\\"borderRadius\\\": {\\n      \\\"sm\\\": \\\"0px\\\",\\n      \\\"md\\\": \\\"0px\\\",\\n      \\\"lg\\\": \\\"2px\\\"\\n    }\\n  }\\n}\\n```\\n\\n**Rule:** For a themed tenant, `theme.json` must contain the canonical semantic keys defined in Appendix A. Extra brand-specific keys are allowed only as extensions to those canonical groups, not as replacements for them.\\n\\n#### 4.4.3 Runtime Theme Publication\\n\\nThe tenant and/or Core **must** expose theme values as CSS variables before section rendering. The compliant bridge is a **three-layer chain** implemented in the tenant's `index.css`. Runtime publication is mandatory for themed tenants.\\n\\n##### Layer architecture\\n\\n```\\ntheme.json  →  engine injection  →  :root bridge  →  @theme (Tailwind)  →  JSX classes\\n```\\n\\n**Layer 0 — Engine injection (Core-provided)** `@olonjs/core` reads `theme.json` and injects all token values as flattened CSS custom properties before section rendering. The naming convention is:\\n\\nJSON path Injected CSS var `tokens.colors.{name}` `--theme-colors-{name}` `tokens.typography.fontFamily.{role}` `--theme-font-{role}` `tokens.typography.scale.{step}` `--theme-typography-scale-{step}` `tokens.typography.tracking.{name}` `--theme-typography-tracking-{name}` `tokens.typography.leading.{name}` `--theme-typography-leading-{name}` `tokens.typography.wordmark.*` `--theme-typography-wordmark-*` `tokens.borderRadius.{name}` `--theme-border-radius-{name}` `tokens.spacing.{name}` `--theme-spacing-{name}` `tokens.zIndex.{name}` `--theme-z-index-{name}` `tokens.modes.{mode}.colors.{name}` `--theme-modes-{mode}-colors-{name}`\\n\\nThe engine also publishes shorthand aliases for the most common radius and font tokens (e.g. `--theme-radius-sm`, `--theme-font-primary`). Tokens not covered by the shorthand aliases must be bridged in the tenant `:root`.\\n\\n**Layer 1 —** `:root` **semantic bridge (Tenant-provided,** `index.css`**)** The tenant maps engine-injected vars to its own semantic naming. **The naming in this layer is the tenant's sovereign choice** — it is not imposed by the Core. Any naming convention is valid as long as it is consistent throughout the tenant.\\n\\n```css\\n:root {\\n  /* Backgrounds */\\n  --background:           var(--theme-colors-background);\\n  --card:                 var(--theme-colors-card);\\n  --elevated:             var(--theme-colors-elevated);\\n  --overlay:              var(--theme-colors-overlay);\\n  --popover:              var(--theme-colors-popover);\\n  --popover-foreground:   var(--theme-colors-popover-foreground);\\n\\n  /* Foregrounds */\\n  --foreground:           var(--theme-colors-foreground);\\n  --card-foreground:      var(--theme-colors-card-foreground);\\n  --muted-foreground:     var(--theme-colors-muted-foreground);\\n  --placeholder:          var(--theme-colors-placeholder);\\n\\n  /* Brand ramp */\\n  --primary:              var(--theme-colors-primary);\\n  --primary-foreground:   var(--theme-colors-primary-foreground);\\n  --primary-light:        var(--theme-colors-primary-light);\\n  --primary-dark:         var(--theme-colors-primary-dark);\\n  /* ... full ramp --primary-50 through --primary-900 ... */\\n\\n  /* Accent, secondary, muted, border, input, ring */\\n  --accent:               var(--theme-colors-accent);\\n  --accent-foreground:    var(--theme-colors-accent-foreground);\\n  --secondary:            var(--theme-colors-secondary);\\n  --secondary-foreground: var(--theme-colors-secondary-foreground);\\n  --muted:                var(--theme-colors-muted);\\n  --border:               var(--theme-colors-border);\\n  --border-strong:        var(--theme-colors-border-strong);\\n  --input:                var(--theme-colors-input);\\n  --ring:                 var(--theme-colors-ring);\\n\\n  /* Feedback */\\n  --destructive:              var(--theme-colors-destructive);\\n  --destructive-foreground:   var(--theme-colors-destructive-foreground);\\n  --success:                  var(--theme-colors-success);\\n  --success-foreground:       var(--theme-colors-success-foreground);\\n  --warning:                  var(--theme-colors-warning);\\n  --warning-foreground:       var(--theme-colors-warning-foreground);\\n  --info:                     var(--theme-colors-info);\\n  --info-foreground:          var(--theme-colors-info-foreground);\\n\\n  /* Typography scale, tracking, leading */\\n  --theme-text-xs:        var(--theme-typography-scale-xs);\\n  --theme-text-sm:        var(--theme-typography-scale-sm);\\n  /* ... full scale ... */\\n  --theme-tracking-tight: var(--theme-typography-tracking-tight);\\n  --theme-leading-normal: var(--theme-typography-leading-normal);\\n  /* ... */\\n\\n  /* Spacing */\\n  --theme-container-max:  var(--theme-spacing-container-max);\\n  --theme-section-y:      var(--theme-spacing-section-y);\\n  --theme-header-h:       var(--theme-spacing-header-h);\\n  --theme-sidebar-w:      var(--theme-spacing-sidebar-w);\\n\\n  /* Z-index */\\n  --z-base:     var(--theme-z-index-base);\\n  --z-elevated: var(--theme-z-index-elevated);\\n  --z-dropdown: var(--theme-z-index-dropdown);\\n  --z-sticky:   var(--theme-z-index-sticky);\\n  --z-overlay:  var(--theme-z-index-overlay);\\n  --z-modal:    var(--theme-z-index-modal);\\n  --z-toast:    var(--theme-z-index-toast);\\n}\\n```\\n\\n**Layer 2 —** `@theme` **Tailwind v4 bridge (Tenant-provided,** `index.css`**)** Every semantic variable from Layer 1 is re-exposed under the Tailwind v4 `@theme` namespace so it becomes a utility class. Pattern: `--color-{slug}: var(--{slug})`.\\n\\n```css\\n@theme {\\n  --color-background:    var(--background);\\n  --color-card:          var(--card);\\n  --color-foreground:    var(--foreground);\\n  --color-primary:       var(--primary);\\n  --color-accent:        var(--accent);\\n  --color-border:        var(--border);\\n  /* ... full token set ... */\\n\\n  --font-primary:        var(--theme-font-primary);\\n  --font-mono:           var(--theme-font-mono);\\n  --font-display:        var(--theme-font-display);\\n\\n  --radius-sm:           var(--theme-radius-sm);\\n  --radius-md:           var(--theme-radius-md);\\n  --radius-lg:           var(--theme-radius-lg);\\n  --radius-xl:           var(--theme-radius-xl);\\n  --radius-full:         var(--theme-radius-full);\\n}\\n```\\n\\nAfter this bridge, the full Tailwind utility vocabulary (`bg-primary`, `text-foreground`, `rounded-lg`, `font-display`, etc.) resolves to live theme values — with no hardcoded hex anywhere in the React layer.\\n\\n**Light mode / additional modes** are bridged by overriding the Layer 1 semantic vars under a `[data-theme=\\\"light\\\"]` selector (or equivalent), pointing to the engine-injected mode vars (`--theme-modes-light-colors-*`). The `@theme` layer requires no changes.\\n\\n**Rule:** A tenant `index.css` must implement all three layers. Skipping Layer 2 breaks Tailwind utility resolution. Skipping Layer 1 couples sections to engine-internal naming. Hardcoding values in either layer is non-compliant.\\n\\n#### 4.4.4 Section-Local Scope\\n\\nIf a section controls its own visual language, it **shall** establish a local token scope on the section root. Example:\\n\\n```tsx\\n<section\\n  style={{\\n    '--local-bg': 'var(--background)',\\n    '--local-text': 'var(--foreground)',\\n    '--local-text-muted': 'var(--muted-foreground)',\\n    '--local-primary': 'var(--primary)',\\n    '--local-border': 'var(--border)',\\n    '--local-surface': 'var(--card)',\\n    '--local-radius-sm': 'var(--theme-radius-sm)',\\n    '--local-radius-md': 'var(--theme-radius-md)',\\n    '--local-radius-lg': 'var(--theme-radius-lg)',\\n  } as React.CSSProperties}\\n>\\n```\\n\\n**Rule:** `--local-*` values must map to published theme variables. They must **not** be defined as hardcoded brand values such as `#fff`, `#111827`, `12px`, or `Inter, sans-serif` if those values belong to the tenant theme layer.\\n\\n**Rule:** Local tokens are **mandatory** for section-owned color and radius concerns. They are **optional** for font-family concerns unless the section must remap or isolate font roles locally.\\n\\n#### 4.4.5 Canonical Typography Rule\\n\\nTypography follows a deterministic rule distinct from color/radius:\\n\\n1. **Canonical font publication** — Tenant/Core must publish semantic font variables such as `--theme-font-primary`, `--theme-font-mono`, and `--theme-font-display` when those roles exist in the theme.\\n2. **Canonical font consumption** — Sections must consume typography through semantic tenant font utilities or variables backed by those published theme roles (for example `.font-display` backed by `--font-display`, itself backed by `--theme-font-display`).\\n3. **Local font tokens** — `--local-font-*` is optional and should be used only when a section needs to remap a font role locally rather than simply consume the canonical tenant font role.\\n\\nExample of canonical global semantic bridge:\\n\\n```css\\n:root {\\n  --font-primary: var(--theme-font-primary);\\n  --font-display: var(--theme-font-display);\\n}\\n\\n.font-display {\\n  font-family: var(--font-display, var(--font-primary));\\n}\\n```\\n\\n**Rule:** A section is compliant if it consumes themed fonts through this published semantic chain. It is **not** required to define `--local-font-display` unless the section needs local remapping. This closes the ambiguity between global semantic typography utilities and local color/radius scoping.\\n\\n#### 4.4.6 View Consumption\\n\\nAll section-owned classes that affect color or radius must consume local variables. Font consumption must follow the typography rule above. Example:\\n\\n```tsx\\n<section\\n  style={{\\n    '--local-bg': 'var(--background)',\\n    '--local-text': 'var(--foreground)',\\n    '--local-primary': 'var(--primary)',\\n    '--local-border': 'var(--border)',\\n    '--local-radius-md': 'var(--theme-radius-md)',\\n    '--local-radius-lg': 'var(--theme-radius-lg)',\\n  } as React.CSSProperties}\\n  className=\\\"bg-[var(--local-bg)]\\\"\\n>\\n  <h1 className=\\\"font-display text-[var(--local-text)]\\\">Build Tenant DNA</h1>\\n\\n  <a className=\\\"bg-[var(--local-primary)] rounded-[var(--local-radius-md)] text-white\\\">\\n    Read the Docs\\n  </a>\\n\\n  <div className=\\\"border border-[var(--local-border)] rounded-[var(--local-radius-lg)]\\\">\\n    {/* illustration / mockup / card */}\\n  </div>\\n</section>\\n```\\n\\n#### 4.4.7 Compliance Rules\\n\\nA section is compliant when all of the following are true:\\n\\n1. `theme.json` is the source of truth for the theme values being used.\\n2. Those values are published at runtime as CSS custom properties before the section renders.\\n3. The section root defines a local token scope for the color/radius concerns it controls.\\n4. Local color/radius tokens map to published theme variables rather than hardcoded literals.\\n5. JSX classes use `var(--local-*)` for section-owned color/radius concerns.\\n6. Fonts are consumed through the published semantic font chain, and only use local font tokens when local remapping is required.\\n7. Hardcoded colors/radii are absent from the primary visual contract of the section.\\n\\n#### 4.4.8 Allowed Exceptions\\n\\nThe following are acceptable if documented and intentionally limited:\\n\\n- Tiny decorative one-off values that are not part of the tenant theme contract (for example an isolated translucent pixel-grid overlay).\\n- Temporary compatibility shims during migration, provided the section still exposes a clear compliant path and the literal is not the primary themed value.\\n- Semantic alias bridges in tenant CSS (for example `--font-display: var(--theme-font-display)`), as long as the source remains the theme layer.\\n\\n#### 4.4.9 Non-Compliant Patterns\\n\\nThe following are non-compliant:\\n\\n- `style={{ '--local-bg': '#060d1b' }}` when that background belongs to tenant theme.\\n- Buttons using `rounded-[7px]`, `bg-blue-500`, `text-zinc-100`, or similar hardcoded utilities inside a section that claims to be theme-driven.\\n- A section root that defines `--local-*`, but child elements still use raw `bg-*`, `text-*`, or `rounded-*` utilities for the same owned concerns.\\n- Reading `theme.json` directly inside a View instead of consuming published runtime theme variables.\\n- Treating brand-specific extension keys as a replacement for canonical semantic keys such as `primary`, `background`, `text`, `border`, or `fontFamily.primary`.\\n\\n#### 4.4.10 Practical Interpretation\\n\\n`--local-*` is not the source of truth. It is the **local scoping layer** between tenant theme and section implementation.\\n\\nCanonical chain:\\n\\n`theme.json` → published runtime theme vars → section `--local-*` → JSX classes\\\\`\\n\\nCanonical font chain:\\n\\n`theme.json` → published semantic font vars → tenant font utility/variable → section typography\\\\`\\n\\n### 4.5 Z-Index & Overlay Governance (v1.2)\\n\\nSection content root **must** stay at `z-index` **≤ 1** (prefer `z-0`) so the Sovereign Overlay can sit above with high z-index in Tenant CSS (§7). Header/footer may use a higher z-index (e.g. 50) only as a documented exception for global chrome.\\n\\n**Perché servono (CIP):** View “dumb” (solo data/settings) e senza import di Zod evita accoppiamento e permette al Form Factory di essere l’unica fonte di verità sugli schemi. Z-index basso evita che il contenuto copra l’overlay di selezione in Studio. Asset via `resolveAssetUrl`: i path relativi vengono risolti in `/assets/...` (senza segmento tenantId nel path). In v1.4 la catena `theme.json -> runtime vars -> --local-* -> JSX classes` rende i tenant temabili, riproducibili e compatibili con la Studio UX; senza questa separazione, stili “nudi” o valori hardcoded creano drift visivo, rompono il contratto del brand, e rendono ambiguo ciò che appartiene al tema contro ciò che appartiene alla section.\\n\\n---\\n\\n## 5. 🛠️ Editor Component Implementation Protocol (ECIP) v1.5\\n\\n**Objective:** Standardize the Polymorphic ICE engine.\\n\\n1. **Recursive Form Factory:** The Admin UI builds forms by traversing the Zod ontology.\\n2. **UI Metadata:** Use `.describe('ui:[widget]')` in schemas to pass instructions to the Form Factory.\\n3. **Deterministic IDs:** Every object in a `ZodArray` must extend `BaseArrayItem` (containing an `id`) to ensure React reconciliation stability during reordering.\\n\\n### 5.4 UI Metadata Vocabulary (v1.2)\\n\\nStandard keys for the Form Factory:\\n\\nKey Use case `ui:text` Single-line text input. `ui:textarea` Multi-line text. `ui:select` Enum / single choice. `ui:number` Numeric input. `ui:list` Array of items; list editor (add/remove/reorder). `ui:icon-picker` Icon selection.\\n\\nUnknown keys may be treated as `ui:text`. Array fields must use `BaseArrayItem` for items.\\n\\n### 5.5 Path-Only Nested Selection & Expansion (v1.3, breaking)\\n\\nIn strict v1.3 Studio/Inspector behavior, nested editing targets are represented by **path segments from root to leaf**.\\n\\n```typescript\\nexport type SelectionPathSegment = { fieldKey: string; itemId?: string };\\nexport type SelectionPath = SelectionPathSegment[];\\n```\\n\\nRules:\\n\\n- Expansion and focus for nested arrays **must** be computed from `SelectionPath` (root → leaf), not from a single flat pair.\\n- Matching by `fieldKey` alone is non-compliant for nested structures.\\n- Legacy flat payload fields `itemField` and `itemId` are removed in strict v1.3 selection protocol.\\n\\n**Perché servono (ECIP):** Il Form Factory deve sapere quale widget usare (text, textarea, select, list, …) senza hardcodare per tipo; `.describe('ui:...')` è il contratto. BaseArrayItem con `id` su ogni item di array garantisce chiavi stabili in React e reorder/delete corretti nell’Inspector. In v1.3 la selezione/espansione path-only elimina ambiguità su array annidati: senza path completo root→leaf, la sidebar può aprire il ramo sbagliato o non aprire il target.\\n\\n---\\n\\n## 6. 🎯 ICE Data Attribute Contract (IDAC) v1.1\\n\\n**Objective:** Mandatory data attributes so the Stage (iframe) and Inspector can bind selection and field/item editing without coupling to Tenant DOM.\\n\\n### 6.1 Section-Level Markup (Core-Provided)\\n\\n**SectionRenderer** (Core) wraps each section root with:\\n\\n- `data-section-id` — Section instance ID (e.g. UUID). On the wrapper that contains content + overlay.\\n- Sibling overlay element `data-jp-section-overlay` — Selection ring and type label. **Tenant does not add this;** Core injects it.\\n\\nTenant Views render the **content** root only (e.g. `<section>` or `<div>`), placed **inside** the Core wrapper.\\n\\n### 6.2 Field-Level Binding (Tenant-Provided)\\n\\nFor every **editable scalar field** the View **must** attach `data-jp-field=\\\"<fieldKey>\\\"` (key matches schema path: e.g. `title`, `description`, `sectionTitle`, `label`).\\n\\n### 6.3 Array-Item Binding (Tenant-Provided)\\n\\nFor every **editable array item** the View **must** attach:\\n\\n- `data-jp-item-id=\\\"<stableId>\\\"` — Prefer `item.id`; fallback e.g. `legacy-${index}` only outside strict mode.\\n- `data-jp-item-field=\\\"<arrayKey>\\\"` — e.g. `cards`, `layers`, `products`, `paragraphs`.\\n\\n### 6.4 Compliance\\n\\n**Reserved types** (`header`, `footer`): ICE attributes optional unless Studio edits them. **All other section types** in the Stage and in `SECTION_SCHEMAS` **must** implement §6.2 and §6.3 for every editable field and array item.\\n\\n### 6.5 Strict Path Extraction for Nested Arrays (v1.3, breaking)\\n\\nFor nested array targets, the Core/Inspector contract is path-based:\\n\\n- The runtime selection target is expressed as `itemPath: SelectionPath` (root → leaf).\\n- Flat identity (`itemField` + `itemId`) is not sufficient for nested structures and is removed in strict v1.3 payloads.\\n- In strict mode, index-based identity fallback is non-compliant for editable object arrays.\\n\\n**Perché servono (IDAC):** Lo Stage è in un iframe e l’Inspector deve sapere **quale campo o item** corrisponde al click (o alla selezione) senza conoscere la struttura DOM del Tenant. `data-jp-field` associa un nodo DOM al path dello schema (es. `title`, `description`): così il Core può evidenziare la riga giusta nella sidebar, applicare opacità attivo/inattivo e aprire il form sul campo corretto. `data-jp-item-id` e `data-jp-item-field` fanno lo stesso per gli item di array (liste, reorder, delete). In v1.3, `itemPath` rende deterministico anche il caso nested (array dentro array), eliminando mismatch tra selezione canvas e ramo aperto in sidebar.\\n\\n---\\n\\n## 7. 🎨 Tenant Overlay CSS Contract (TOCC) v1.0\\n\\n**Objective:** The Stage iframe loads only Tenant HTML/CSS. Core injects overlay **markup** but does **not** ship overlay styles. The Tenant **must** supply CSS so overlay is visible.\\n\\n### 7.1 Required Selectors (Tenant global CSS)\\n\\n1. `[data-jp-section-overlay]` — `position: absolute; inset: 0`; `pointer-events: none`; base state transparent.\\n2. `[data-section-id]:hover [data-jp-section-overlay]` — Hover: e.g. dashed border, subtle tint.\\n3. `[data-section-id][data-jp-selected] [data-jp-section-overlay]` — Selected: solid border, optional tint.\\n4. `[data-jp-section-overlay] > div` (type label) — Position and visibility (e.g. visible on hover/selected).\\n\\n### 7.2 Z-Index\\n\\nOverlay **z-index** high (e.g. 9999). Section content at or below CIP limit (§4.5).\\n\\n### 7.3 Responsibility\\n\\n**Core:** Injects wrapper and overlay DOM; sets `data-jp-selected`. **Tenant:** All overlay **visual** rules.\\n\\n**Perché servono (TOCC):** L’iframe dello Stage carica solo HTML/CSS del Tenant; il Core inietta il markup dell’overlay ma non gli stili. Senza CSS Tenant per i selettori TOCC, bordo hover/selected e type label non sarebbero visibili: l’autore non vedrebbe quale section è selezionata né il label del tipo. TOCC chiarisce la responsabilità (Core = markup, Tenant = aspetto) e garantisce UX uniforme tra tenant.\\n\\n---\\n\\n## 8. 📦 Base Section Data & Settings (BSDS) v1.0\\n\\n**Objective:** Standardize base schema fragments for anchors, array items, and section settings.\\n\\n### 8.1 BaseSectionData\\n\\nEvery section data schema **must** extend a base with at least `anchorId` (optional string). Canonical Zod (Tenant `lib/base-schemas.ts` or equivalent):\\n\\n```typescript\\nexport const BaseSectionData = z.object({\\n  anchorId: z.string().optional().describe('ui:text'),\\n});\\n```\\n\\n### 8.2 BaseArrayItem\\n\\nEvery array item schema editable in the Inspector **must** include `id` (optional string minimum). Canonical Zod:\\n\\n```typescript\\nexport const BaseArrayItem = z.object({\\n  id: z.string().optional(),\\n});\\n```\\n\\nRecommended: required UUID for new items. Used by `data-jp-item-id` and React reconciliation.\\n\\n### 8.3 BaseSectionSettings (Optional)\\n\\nCommon section-level settings. Canonical Zod (name **BaseSectionSettingsSchema** or as exported by Core):\\n\\n```typescript\\nexport const BaseSectionSettingsSchema = z.object({\\n  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\\n  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).default('md').describe('ui:select'),\\n  theme: z.enum(['dark', 'light', 'accent']).default('dark').describe('ui:select'),\\n  container: z.enum(['boxed', 'fluid']).default('boxed').describe('ui:select'),\\n});\\n```\\n\\nCapsules may extend this for type-specific settings. Core may export **BaseSectionSettings** as the TypeScript type inferred from this or a superset.\\n\\n**Perché servono (BSDS):** anchorId permette deep-link e navigazione in-page; id sugli array item è necessario per `data-jp-item-id`, reorder e React reconciliation. BaseSectionSettings comuni (padding, theme, container) evitano ripetizione e allineano il Form Factory tra capsule. Senza base condivisi, ogni capsule inventa convenzioni e validazione/add-section diventano fragili.\\n\\n---\\n\\n## 9. 📌 AddSectionConfig (ASC) v1.0\\n\\n**Objective:** Formalize the \\\"Add Section\\\" contract used by the Studio.\\n\\n**Type (Core exports** `AddSectionConfig`**):**\\n\\n```typescript\\ninterface AddSectionConfig {\\n  addableSectionTypes: readonly string[];\\n  sectionTypeLabels: Record<string, string>;\\n  getDefaultSectionData(sectionType: string): Record<string, unknown>;\\n}\\n```\\n\\n**Shape:** Tenant provides one object (e.g. `addSectionConfig`) with:\\n\\n- `addableSectionTypes` — Readonly array of section type keys. Only these types appear in the Add Section Library. Must be a subset of (or equal to) the keys in SectionDataRegistry.\\n- `sectionTypeLabels` — Map type key → display string (e.g. `{ hero: 'Hero', 'cta-banner': 'CTA Banner' }`).\\n- `getDefaultSectionData(sectionType: string): Record<string, unknown>` — Returns default `data` for a new section. Must conform to the capsule’s data schema so the new section validates.\\n\\nCore creates a new section with deterministic UUID, `type`, and `data` from `getDefaultSectionData(type)`.\\n\\n**Perché servono (ASC):** Lo Studio deve mostrare una libreria “Aggiungi sezione” con nomi leggibili e, alla scelta, creare una section con dati iniziali validi. addableSectionTypes, sectionTypeLabels e getDefaultSectionData sono il contratto: il Tenant è l’unica fonte di verità su quali tipi sono addabili e con quali default. Senza ASC, il Core non saprebbe cosa mostrare in modal né come popolare i dati della nuova section.\\n\\n---\\n\\n## 10. ⚙️ JsonPagesConfig & Engine Bootstrap (JEB) v1.1\\n\\n**Objective:** Bootstrap contract between Tenant app and `@olonjs/core`.\\n\\n### 10.1 JsonPagesConfig (required fields)\\n\\nThe Tenant passes a single **config** object to **JsonPagesEngine**. Required fields:\\n\\nField Type Description **tenantId** string Passed to `resolveAssetUrl(path, tenantId)`; resolved asset URLs are `/assets/...` with no tenantId segment in the path. **registry** `{ [K in SectionType]: React.FC<SectionComponentPropsMap[K]> }` Component registry. Must match MTRP keys. See Appendix A. **schemas** `Record<SectionType, ZodType>` or equivalent SECTION_SCHEMAS: type → **data** Zod schema. Form Factory uses this. See Appendix A. **pages** `Record<string, PageConfig>` Slug → page config. See Appendix A. **siteConfig** SiteConfig Global site (identity, header/footer blocks). See Appendix A. **themeConfig** ThemeConfig Theme tokens. See Appendix A. **menuConfig** MenuConfig Navigation tree (SSOT for header menu). See Appendix A. **themeCss** `{ tenant: string }` At least **tenant**: string (inline CSS or URL) for Stage iframe injection. **addSection** AddSectionConfig Add-section config (§9).\\n\\nCore may define optional fields. The Tenant must not omit required fields.\\n\\n### 10.2 JsonPagesEngine\\n\\nRoot component: `<JsonPagesEngine config={config} />`. Responsibilities: route → page, SectionRenderer per section; in Studio mode Sovereign Shell (Inspector, Control Bar, postMessage); section wrappers and overlay per IDAC and JAP. Tenant does not implement the Shell.\\n\\n### 10.3 Studio Selection Event Contract (v1.3, breaking)\\n\\nIn strict v1.3 Studio, section selection payload for nested targets is path-based:\\n\\n```typescript\\ntype SectionSelectMessage = {\\n  type: 'SECTION_SELECT';\\n  section: { id: string; type: string; scope: 'global' | 'local' };\\n  itemPath?: SelectionPath; // root -> leaf\\n};\\n```\\n\\nRemoved from strict protocol:\\n\\n- `itemField`\\n- `itemId`\\n\\n**Perché servono (JEB):** Un unico punto di bootstrap (config + Engine) evita che il Tenant replichi logica di routing, Shell e overlay. I campi obbligatori in JsonPagesConfig (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss, addSection) sono il minimo per far funzionare rendering, Studio e Form Factory; omissioni causano errori a runtime. In v1.3, il payload `itemPath` sincronizza in modo non ambiguo Stage e Inspector su nested arrays.\\n\\n---\\n\\n# 🏛️ OlonJS_ADMIN_PROTOCOL (JAP) v1.2\\n\\n**Status:** Mandatory Standard\\\\\\n**Version:** 1.2.0 (Sovereign Shell Edition — Path/Nested Strictness)\\\\\\n**Objective:** Deterministic orchestration of the \\\"Studio\\\" environment (ICE Level 1).\\n\\n---\\n\\n## 1. The Sovereign Shell Topology\\n\\nThe Admin interface is a **Sovereign Shell** from `@olonjs/core`.\\n\\n1. **The Stage (Canvas):** Isolated Iframe; postMessage for data updates and selection mirroring. Section markup follows **IDAC** (§6); overlay styling follows **TOCC** (§7).\\n2. **The Inspector (Sidebar):** Consumes Tenant Zod schemas to generate editors; binding via `data-jp-field` and `data-jp-item-*`.\\n3. **The Control Bar:** Save, Export, Add Section.\\n\\n## 2. State Orchestration & Persistence\\n\\n- **Working Draft:** Reactive local state for unsaved changes.\\n- **Sync Law:** Inspector changes → Working Draft → Stage via `STUDIO_EVENTS.UPDATE_DRAFTS`.\\n- **Bake Protocol:** \\\"Bake HTML\\\" requests snapshot from Iframe, injects `ProjectState` as JSON, triggers download.\\n\\n## 3. Context Switching (Global vs. Local)\\n\\n- **Header/Footer** selection → Global Mode, `site.json`.\\n- Any other section → Page Mode, current `[slug].json`.\\n\\n## 4. Section Lifecycle Management\\n\\n1. **Add Section:** Modal from Tenant `SECTION_SCHEMAS`; UUID + default data via **AddSectionConfig** (§9).\\n2. **Reorder:** Inspector or Stage Overlay; array mutation in Working Draft.\\n3. **Delete:** Confirmation; remove from array, clear selection.\\n\\n## 5. Stage Isolation & Overlay\\n\\n- **CSS Shielding:** Stage in Iframe; Tenant CSS does not leak into Admin.\\n- **Sovereign Overlay:** Selection ring and type labels injected per **IDAC** (§6); Tenant styles them per **TOCC** (§7).\\n\\n## 6. \\\"Green Build\\\" Validation\\n\\nStudio enforces `tsc && vite build`. No export with TypeScript errors.\\n\\n## 7. Path-Deterministic Selection & Sidebar Expansion (v1.3, breaking)\\n\\n- Section/item focus synchronization uses `itemPath` (root → leaf), not flat `itemField/itemId`.\\n- Sidebar expansion state for nested arrays must be derived from all path segments.\\n- Flat-only matching may open/close wrong branches and is non-compliant in strict mode.\\n\\n**Perché servono (JAP):** Stage in iframe + Inspector + Control Bar separano il contesto di editing dal sito; postMessage e Working Draft permettono modifiche senza toccare subito i file. Bake ed Export richiedono uno stato coerente. Global vs Page mode evita confusione su dove si sta editando (site.json vs \\\\[slug\\\\].json). Add/Reorder/Delete sono gestiti in un solo modo (Working Draft + ASC). Green Build garantisce che ciò che si esporta compili. In v1.3, il path completo elimina ambiguità nella sincronizzazione Stage↔Sidebar su strutture annidate.\\n\\n---\\n\\n## Compliance: Legacy vs Full UX (v1.4)\\n\\nDimension Legacy / Less UX Full UX (Core-aligned) **ICE binding** No `data-jp-*`; Inspector cannot bind. IDAC (§6) on every editable section/field/item. **Section wrapper** Plain `<section>`; no overlay contract. Core wrapper + overlay; Tenant CSS per TOCC (§7). **Design tokens** Raw BEM / fixed classes, or local vars fed by literals. `theme.json` as source of truth, mandatory runtime publication, local color/radius scope via `--local-*`, typography via canonical semantic font chain, no primary hardcoded themed values. **Base schemas** Ad hoc. BSDS (§8): BaseSectionData, BaseArrayItem, BaseSectionSettings. **Add Section** Ad hoc defaults. ASC (§9): addableSectionTypes, labels, getDefaultSectionData. **Bootstrap** Implicit. JEB (§10): JsonPagesConfig + JsonPagesEngine. **Selection payload** Flat `itemField/itemId`. Path-only `itemPath: SelectionPath` (JEB §10.3). **Nested array expansion** Single-segment or field-only heuristics. Root-to-leaf path expansion (ECIP §5.5, JAP §7). **Array item identity (strict)** Index fallback tolerated. Stable `id` required for editable object arrays.\\n\\n**Rule:** Every page section (non-header/footer) that appears in the Stage and in `SECTION_SCHEMAS` must comply with §6, §7, §4.4, §8, §9, §10 for full Studio UX.\\n\\n---\\n\\n## Summary of v1.5 Additions\\n\\n§ Title Purpose 4.4.3 Three-Layer CSS Bridge Replaces the informal \\\"publish CSS vars\\\" rule with the deterministic Layer 0 (engine injection) → Layer 1 (`:root` semantic bridge) → Layer 2 (`@theme` Tailwind bridge) architecture. Documents the engine's `--theme-colors-{name}` naming convention and the tenant's sovereign naming freedom in Layer 1. A.2.6 ThemeConfig (v1.5) Replaces the incorrect `surface/surfaceAlt/text/textMuted` canonical keys with the actual schema-aligned keys (`card`, `elevated`, `foreground`, `muted-foreground`, etc.). Adds `spacing`, `zIndex`, full typography sub-interfaces (`scale`, `tracking`, `leading`, `wordmark`), and `modes`. Establishes `theme.json` as SOT with schema as the formalisation layer.\\n\\n---\\n\\n## Summary of v1.4 Additions\\n\\n§ Title Purpose 4.4 Local Design Tokens Makes the `theme.json -> runtime vars -> --local-* -> JSX classes` chain explicit and normative. 4.4.3 Runtime Theme Publication Makes runtime CSS publication mandatory for themed tenants. 4.4.5 Canonical Typography Rule Removes ambiguity between global semantic font utilities and local token scoping. 4.4.7 Compliance Rules Turns Local Design Tokens into a checklist-grade compliance contract. 4.4.9 Non-Compliant Patterns Makes hardcoded token anti-patterns explicit. **Appendix A.2.6** **Deterministic ThemeConfig** Aligns the spec-level theme contract with the core’s structured semantic keys plus extension policy. **Appendix A.7** **Local Design Tokens Implementation Addendum** Operational checklist and implementation examples for compliant tenant sections.\\n\\n---\\n\\n# Appendix A — Tenant Type & Code-Generation Annex\\n\\n**Objective:** Make the specification **sufficient** to generate or audit a full tenant (new site, new components, new data) without a reference codebase. Defines TypeScript types, JSON shapes, schema contract, file paths, and integration pattern.\\n\\n**Status:** Mandatory for code-generation and governance. Compliance ensures generated tenants are typed and wired like the reference implementation.\\n\\n---\\n\\n## A.1 Core-Provided Types (from `@olonjs/core`)\\n\\nThe following are assumed to be exported by Core. The Tenant augments **SectionDataRegistry** and **SectionSettingsRegistry**; all other types are consumed as-is.\\n\\nType Description **SectionType** `keyof SectionDataRegistry` (after Tenant augmentation). Union of all section type keys. **Section** Union of `BaseSection<K>` for all K in SectionDataRegistry. See MTRP §1.2. **BaseSectionSettings** Optional base type for section settings (may align with BSDS §8.3). **MenuItem** Navigation item. **Minimum shape:** `{ label: string; href: string }`. Core may extend (e.g. `children?: MenuItem[]`). **AddSectionConfig** See §9. **JsonPagesConfig** See §10.1.\\n\\n**Perché servono (A.1):** Il Tenant deve conoscere i tipi esportati dal Core (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig) per tipizzare registry, config e augmentation senza dipendere da implementazioni interne.\\n\\n---\\n\\n## A.2 Tenant-Provided Types (single source: `src/types.ts` or equivalent)\\n\\nThe Tenant **must** define the following in one module (e.g. `src/types.ts`). This module **must** perform the **module augmentation** of `@olonjs/core` for **SectionDataRegistry** and **SectionSettingsRegistry**, and **must** export **SectionComponentPropsMap** and re-export from `@olonjs/core` so that **SectionType** is available after augmentation.\\n\\n### A.2.1 SectionComponentPropsMap\\n\\nMaps each section type to the props of its React component. **Header** is the only type that receives **menu**.\\n\\n**Option A — Explicit (recommended for clarity and tooling):** For each section type K, add one entry. Header receives **menu**.\\n\\n```typescript\\nimport type { MenuItem } from '@olonjs/core';\\n// Import Data/Settings from each capsule.\\n\\nexport type SectionComponentPropsMap = {\\n  'header': { data: HeaderData; settings?: HeaderSettings; menu: MenuItem[] };\\n  'footer': { data: FooterData; settings?: FooterSettings };\\n  'hero': { data: HeroData; settings?: HeroSettings };\\n  // ... one entry per SectionType, e.g. 'feature-grid', 'cta-banner', etc.\\n};\\n```\\n\\n**Option B — Mapped type (DRY, requires SectionDataRegistry/SectionSettingsRegistry in scope):**\\n\\n```typescript\\nimport type { MenuItem } from '@olonjs/core';\\n\\nexport type SectionComponentPropsMap = {\\n  [K in SectionType]: K extends 'header'\\n    ? { data: SectionDataRegistry[K]; settings?: SectionSettingsRegistry[K]; menu: MenuItem[] }\\n    : { data: SectionDataRegistry[K]; settings?: K extends keyof SectionSettingsRegistry ? SectionSettingsRegistry[K] : BaseSectionSettings };\\n};\\n```\\n\\nSectionType is imported from Core (after Tenant augmentation). In practice Option A is the reference pattern; Option B is valid if the Tenant prefers a single derived definition.\\n\\n**Perché servono (A.2):** SectionComponentPropsMap e i tipi di config (PageConfig, SiteConfig, MenuConfig, ThemeConfig) definiscono il contratto tra dati (JSON, API) e componente; l’augmentation è l’unico modo per estendere i registry del Core senza fork. Senza questi tipi, generazione tenant e refactor sarebbero senza guida e il type-check fallirebbe.\\n\\n### A.2.2 ComponentRegistry type\\n\\nThe registry object **must** be typed as:\\n\\n```typescript\\nimport type { SectionType } from '@olonjs/core';\\nimport type { SectionComponentPropsMap } from '@/types';\\n\\nexport const ComponentRegistry: {\\n  [K in SectionType]: React.FC<SectionComponentPropsMap[K]>;\\n} = { /* ... */ };\\n```\\n\\nFile: `src/lib/ComponentRegistry.tsx` (or equivalent). Imports one View per section type and assigns it to the corresponding key.\\n\\n### A.2.3 PageConfig\\n\\nMinimum shape for a single page (used in **pages** and in each `[slug].json`):\\n\\n```typescript\\nexport interface PageConfig {\\n  id?: string;\\n  slug: string;\\n  meta?: {\\n    title?: string;\\n    description?: string;\\n  };\\n  sections: Section[];\\n}\\n```\\n\\n**Section** is the union type from MTRP (§1.2). Each element of **sections** has **id**, **type**, **data**, **settings** and conforms to the capsule schemas.\\n\\n### A.2.4 SiteConfig\\n\\nMinimum shape for **site.json** (and for **siteConfig** in JsonPagesConfig):\\n\\n```typescript\\nexport interface SiteConfigIdentity {\\n  title?: string;\\n  logoUrl?: string;\\n}\\n\\nexport interface SiteConfig {\\n  identity?: SiteConfigIdentity;\\n  pages?: Array<{ slug: string; label: string }>;\\n  header: {\\n    id: string;\\n    type: 'header';\\n    data: HeaderData;\\n    settings?: HeaderSettings;\\n  };\\n  footer: {\\n    id: string;\\n    type: 'footer';\\n    data: FooterData;\\n    settings?: FooterSettings;\\n  };\\n}\\n```\\n\\n**HeaderData**, **FooterData**, **HeaderSettings**, **FooterSettings** are the types exported from the header and footer capsules.\\n\\n### A.2.5 MenuConfig\\n\\nMinimum shape for **menu.json** (and for **menuConfig** in JsonPagesConfig). Structure is tenant-defined; Core expects the header to receive **MenuItem\\\\[\\\\]**. Common pattern: an object with a key (e.g. **main**) whose value is **MenuItem\\\\[\\\\]**.\\n\\n```typescript\\nexport interface MenuConfig {\\n  main?: MenuItem[];\\n  [key: string]: MenuItem[] | undefined;\\n}\\n```\\n\\nOr simply `MenuItem[]` if the app uses a single flat list. The Tenant must ensure that the value passed to the header component as **menu** conforms to **MenuItem\\\\[\\\\]** (e.g. `menuConfig.main` or `menuConfig` if it is the array).\\n\\n### A.2.6 ThemeConfig\\n\\nMinimum shape for **theme.json** (and for **themeConfig** in JsonPagesConfig). `theme.json` is the **source of truth** for the entire visual contract of the tenant. The schema (`design-system.schema.json`) is the machine-readable formalisation of this contract — if the TypeScript interfaces and the JSON Schema diverge, the JSON Schema wins.\\n\\n**Naming policy:** The keys within `tokens.colors` are the tenant's sovereign choice. The engine flattens all keys to `--theme-colors-{name}` regardless of naming convention. The required keys listed below are the ones the engine's `:root` bridge and the `@theme` Tailwind bridge must be able to resolve. Extra brand-specific keys are always allowed as additive extensions.\\n\\n```typescript\\nexport interface ThemeColors {\\n  /* Required — backgrounds */\\n  background: string;\\n  card: string;\\n  elevated: string;\\n  overlay: string;\\n  popover: string;\\n  'popover-foreground': string;\\n\\n  /* Required — foregrounds */\\n  foreground: string;\\n  'card-foreground': string;\\n  'muted-foreground': string;\\n  placeholder: string;\\n\\n  /* Required — brand */\\n  primary: string;\\n  'primary-foreground': string;\\n  'primary-light': string;\\n  'primary-dark': string;\\n\\n  /* Optional — brand ramp (50–900) */\\n  'primary-50'?: string;\\n  'primary-100'?: string;\\n  'primary-200'?: string;\\n  'primary-300'?: string;\\n  'primary-400'?: string;\\n  'primary-500'?: string;\\n  'primary-600'?: string;\\n  'primary-700'?: string;\\n  'primary-800'?: string;\\n  'primary-900'?: string;\\n\\n  /* Required — accent, secondary, muted */\\n  accent: string;\\n  'accent-foreground': string;\\n  secondary: string;\\n  'secondary-foreground': string;\\n  muted: string;\\n\\n  /* Required — border, form */\\n  border: string;\\n  'border-strong': string;\\n  input: string;\\n  ring: string;\\n\\n  /* Required — feedback */\\n  destructive: string;\\n  'destructive-foreground': string;\\n  'destructive-border': string;\\n  'destructive-ring': string;\\n  success: string;\\n  'success-foreground': string;\\n  'success-border': string;\\n  'success-indicator': string;\\n  warning: string;\\n  'warning-foreground': string;\\n  'warning-border': string;\\n  info: string;\\n  'info-foreground': string;\\n  'info-border': string;\\n\\n  [key: string]: string | undefined;\\n}\\n\\nexport interface ThemeFontFamily {\\n  primary: string;\\n  mono: string;\\n  display?: string;\\n  [key: string]: string | undefined;\\n}\\n\\nexport interface ThemeWordmark {\\n  fontFamily: string;\\n  weight: string;\\n  width: string;\\n}\\n\\nexport interface ThemeTypography {\\n  fontFamily: ThemeFontFamily;\\n  wordmark?: ThemeWordmark;\\n  scale?: Record<string, string>;     /* xs sm base md lg xl 2xl 3xl 4xl 5xl 6xl 7xl */\\n  tracking?: Record<string, string>;  /* tight display normal wide label */\\n  leading?: Record<string, string>;   /* none tight snug normal relaxed */\\n}\\n\\nexport interface ThemeBorderRadius {\\n  sm: string;\\n  md: string;\\n  lg: string;\\n  xl?: string;\\n  full?: string;\\n  [key: string]: string | undefined;\\n}\\n\\nexport interface ThemeSpacing {\\n  'container-max'?: string;\\n  'section-y'?: string;\\n  'header-h'?: string;\\n  'sidebar-w'?: string;\\n  [key: string]: string | undefined;\\n}\\n\\nexport interface ThemeZIndex {\\n  base?: string;\\n  elevated?: string;\\n  dropdown?: string;\\n  sticky?: string;\\n  overlay?: string;\\n  modal?: string;\\n  toast?: string;\\n  [key: string]: string | undefined;\\n}\\n\\nexport interface ThemeModes {\\n  [mode: string]: { colors: Partial<ThemeColors> };\\n}\\n\\nexport interface ThemeTokens {\\n  colors: ThemeColors;\\n  typography: ThemeTypography;\\n  borderRadius: ThemeBorderRadius;\\n  spacing?: ThemeSpacing;\\n  zIndex?: ThemeZIndex;\\n  modes?: ThemeModes;\\n}\\n\\nexport interface ThemeConfig {\\n  name: string;\\n  tokens: ThemeTokens;\\n}\\n```\\n\\n**Rule:** `theme.json` is the single source of truth. All layers downstream (engine injection, `:root` bridge, `@theme` bridge, React JSX) are read-only consumers. No layer below `theme.json` may hardcode a value that belongs to the theme contract.\\n\\n**Rule:** Brand-specific extension keys (e.g. `colors.primary-50` through `primary-900`, custom spacing tokens) are always allowed as additive extensions within the canonical groups. They must not replace the required semantic keys.\\n\\n---\\n\\n## A.3 Schema Contract (SECTION_SCHEMAS)\\n\\n**Location:** `src/lib/schemas.ts` (or equivalent).\\n\\n**Contract:**\\n\\n- **SECTION_SCHEMAS** is a **single object** whose keys are **SectionType** and whose values are **Zod schemas for the section data** (not settings, unless the Form Factory contract expects a combined or per-type settings schema; then each value may be the data schema only, and settings may be defined per capsule and aggregated elsewhere if needed).\\n- The Tenant **must** re-export **BaseSectionData**, **BaseArrayItem**, and optionally **BaseSectionSettingsSchema** from `src/lib/base-schemas.ts` (or equivalent). Each capsule’s data schema **must** extend BaseSectionData; each array item schema **must** extend or include BaseArrayItem.\\n- **SECTION_SCHEMAS** is typed as `Record<SectionType, ZodType>` or `{ [K in SectionType]: ZodType }` so that keys match the registry and SectionDataRegistry.\\n\\n**Export:** The app imports **SECTION_SCHEMAS** and passes it as **config.schemas** to JsonPagesEngine. The Form Factory traverses these schemas to build editors.\\n\\n**Perché servono (A.3):** Un unico oggetto SECTION_SCHEMAS con chiavi = SectionType e valori = schema data permette al Form Factory di costruire form per tipo senza convenzioni ad hoc; i base schema garantiscono anchorId e id su item. Senza questo contratto, l’Inspector non saprebbe quali campi mostrare né come validare.\\n\\n---\\n\\n## A.4 File Paths & Data Layout\\n\\nPurpose Path (conventional) Description Site config `src/data/config/site.json` SiteConfig (identity, header, footer, pages list). Menu config `src/data/config/menu.json` MenuConfig (e.g. main nav). Theme config `src/data/config/theme.json` ThemeConfig (tokens). Page data `src/data/pages/<slug>.json` One file per page; content is PageConfig (slug, meta, sections). Base schemas `src/lib/base-schemas.ts` BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema. Schema aggregate `src/lib/schemas.ts` SECTION_SCHEMAS; re-exports base schemas. Registry `src/lib/ComponentRegistry.tsx` ComponentRegistry object. Add-section config `src/lib/addSectionConfig.ts` addSectionConfig (AddSectionConfig). Tenant types & augmentation `src/types.ts` SectionComponentPropsMap, PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** for SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`. Bootstrap `src/App.tsx` Imports config (site, theme, menu, pages), registry, schemas, addSection, themeCss; builds JsonPagesConfig; renders .\\n\\nThe app entry (e.g. **main.tsx**) renders **App**. No other bootstrap contract is specified; the Tenant may use Vite aliases (e.g. **@/**) for the paths above.\\n\\n**Perché servono (A.4):** Path fissi (data/config, data/pages, lib/schemas, types.ts, App.tsx) permettono a CLI, tooling e agenti di trovare sempre gli stessi file; l’onboarding e la generazione da spec sono deterministici. Senza convenzione, ogni tenant sarebbe una struttura diversa.\\n\\n---\\n\\n## A.5 Integration Checklist (Code-Generation)\\n\\nWhen generating or auditing a tenant, ensure the following in order:\\n\\n 1. **Capsules** — For each section type, create `src/components/<type>/` with View.tsx, schema.ts, types.ts, index.ts. Data schema extends BaseSectionData; array items extend BaseArrayItem; View complies with CIP and IDAC (§6.2–6.3 for non-reserved types).\\n 2. **Base schemas** — **src/lib/base-schemas.ts** exports BaseSectionData, BaseArrayItem, BaseSectionSettingsSchema (and optional CtaSchema or similar shared fragments).\\n 3. **types.ts** — Define SectionComponentPropsMap (header with **menu**), PageConfig, SiteConfig, MenuConfig, ThemeConfig; **declare module '@olonjs/core'** and augment SectionDataRegistry and SectionSettingsRegistry; re-export from `@olonjs/core`.\\n 4. **ComponentRegistry** — Import every View; build object **{ \\\\[K in SectionType\\\\]: ViewComponent }**; type as **{ \\\\[K in SectionType\\\\]: React.FC&lt;SectionComponentPropsMap\\\\[K\\\\]&gt; }**.\\n 5. **schemas.ts** — Import base schemas and each capsule’s data schema; export SECTION_SCHEMAS as **{ \\\\[K in SectionType\\\\]: SchemaK }**; export SectionType as **keyof typeof SECTION_SCHEMAS** if not using Core’s SectionType.\\n 6. **addSectionConfig** — addableSectionTypes, sectionTypeLabels, getDefaultSectionData; export as AddSectionConfig.\\n 7. **App.tsx** — Import site, theme, menu, pages from data paths; build config (tenantId, registry, schemas, pages, siteConfig, themeConfig, menuConfig, themeCss: { tenant }, addSection); render JsonPagesEngine.\\n 8. **Data files** — Create or update site.json, menu.json, theme.json, and one or more **.json** under the paths in A.4. Ensure JSON shapes match SiteConfig, MenuConfig, ThemeConfig, PageConfig.\\n 9. **Runtime theme publication** — Publish the theme contract as runtime CSS custom properties before themed sections render.\\n10. **Tenant CSS** — Include TOCC (§7) selectors in global CSS so the Stage overlay is visible, and bridge semantic theme variables where needed.\\n11. **Reserved types** — Header and footer capsules receive props per SectionComponentPropsMap; menu is populated from menuConfig (e.g. menuConfig.main) when building the config or inside Core when rendering the header.\\n\\n**Perché servono (A.5):** La checklist in ordine evita di dimenticare passi (es. augmentation prima del registry, TOCC dopo le View) e rende la spec sufficiente per generare o verificare un tenant senza codebase di riferimento.\\n\\n---\\n\\n## A.6 v1.3 Path/Nested Strictness Addendum (breaking)\\n\\nThis addendum extends Appendix A without removing prior v1.2 obligations:\\n\\n1. **Type exports** — Core and/or shared types module should expose `SelectionPathSegment` and `SelectionPath` for Studio messaging and Inspector expansion logic.\\n2. **Protocol migration** — Replace flat payload fields `itemField` / `itemId` with `itemPath?: SelectionPath` in strict v1.3 channels.\\n3. **Nested array compliance** — For editable object arrays, item identity must be stable (`id`) and propagated to DOM attributes (`data-jp-item-id`), schema items (BaseArrayItem), and selection path segments (`itemId` when segment targets array item).\\n4. **Backward compatibility policy** — Legacy flat fields may exist only in transitional adapters outside strict mode; normative v1.3 contract is path-only.\\n\\n---\\n\\n## A.7 v1.4 Local Design Tokens Implementation Addendum\\n\\nThis addendum extends Appendix A without removing prior v1.3 obligations:\\n\\n1. **Theme source of truth** — Tenant theme values belong in `src/data/config/theme.json`.\\n2. **Runtime publication** — Core and/or tenant bootstrap **must** expose those values as runtime CSS custom properties before section rendering.\\n3. **Local scope** — A themed section must define `--local-*` variables on its root for the color/radius concerns it owns.\\n4. **Class consumption** — Section-owned color/radius utilities must consume `var(--local-*)`, not raw hardcoded theme values.\\n5. **Typography policy** — Fonts must consume the published semantic font chain; local font tokens are optional and only for local remapping.\\n6. **Migration policy** — Hardcoded colors/radii may exist only as temporary compatibility shims or purely decorative exceptions, not as the primary section contract.\\n\\nCanonical implementation pattern:\\n\\n```text\\ntheme.json -> published runtime theme vars -> section --local-* -> JSX classes\\n```\\n\\nCanonical typography pattern:\\n\\n```text\\ntheme.json -> published semantic font vars -> tenant font utility/variable -> section typography\\n```\\n\\nMinimal compliant example:\\n\\n```tsx\\n<section\\n  style={{\\n    '--local-bg': 'var(--background)',\\n    '--local-text': 'var(--foreground)',\\n    '--local-primary': 'var(--primary)',\\n    '--local-radius-md': 'var(--theme-radius-md)',\\n  } as React.CSSProperties}\\n  className=\\\"bg-[var(--local-bg)]\\\"\\n>\\n  <h2 className=\\\"font-display text-[var(--local-text)]\\\">Title</h2>\\n  <a className=\\\"bg-[var(--local-primary)] rounded-[var(--local-radius-md)]\\\">CTA</a>\\n</section>\\n```\\n\\nDeterministic compliance checklist:\\n\\n1. Canonical semantic theme keys exist.\\n2. Runtime publication exists.\\n3. Section-local color/radius scope exists.\\n4. Section-owned color/radius classes consume `var(--local-*)`.\\n5. Fonts consume the semantic published font chain.\\n6. Primary themed values are not hardcoded.\\n\\n---\\n\\n**Validation:** Align with current `@olonjs/core` exports (SectionType, MenuItem, AddSectionConfig, JsonPagesConfig, and in v1.3+ path types for Studio selection), with the deterministic `ThemeConfig` contract, and with the runtime theme publication contract used by tenant CSS.\\\\\\n**Distribution:** Core via `.yalc`; tenant projections via `@olonjs/cli`. This annex makes the spec **necessary and sufficient** for tenant code-generation and governance at enterprise grade.\"},\"settings\":{}}]");
const docs = {
  id: id$3,
  slug: slug$3,
  meta: meta$3,
  sections: sections$3
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: docs,
  id: id$3,
  meta: meta$3,
  sections: sections$3,
  slug: slug$3
}, Symbol.toStringTag, { value: "Module" }));
const id$2 = "home-page";
const slug$2 = "home";
const meta$2 = { "title": "OlonJS — The Contract Layer for the Agentic Web", "description": "OlonJS standardizes machine-readable web content across tenants. Predictable page endpoints for agents, typed schema contracts, repeatable governance." };
const sections$2 = [{ "id": "global-header", "type": "header", "data": { "logoText": "Olon", "badge": "", "links": { "$ref": "../config/menu.json#/main" }, "ctaLabel": "Get started →", "ctaHref": "#contact", "signinHref": "#login" }, "settings": { "sticky": true } }, { "id": "hero-main", "type": "hero", "data": { "eyebrow": "Contract layer · v1.4 · Open Core", "title": "Start building   ", "titleHighlight": "for the agentic web.", "description": "AI agents are becoming operational actors in commerce, marketing, and support. But websites are still built for humans first: HTML-heavy, CMS-fragmented, and inconsistent across properties. That makes agent integration slow, brittle, and expensive. Olon introduces a deterministic machine contract for websites OlonJS. This makes content reliably readable and operable by agents while preserving normal human UI.", "ctas": [{ "id": "cta-started", "label": "Get started", "href": "#contact", "variant": "accent" }, { "id": "cta-github", "label": "GitHub", "href": "#", "variant": "secondary" }], "docsLabel": "Read the docs", "docsHref": "#", "heroImage": { "url": "https://bat5elmxofxdroan.public.blob.vercel-storage.com/tenant-assets/511f18d7-d8ac-4292-ad8a-b0efa99401a3/1774286598548-adac7c36-9001-451d-9b16-c3787ac27f57-signup-hero-olon-graded_1_.png", "alt": "" } }, "settings": { "showCode": false } }, { "id": "features-section", "type": "feature-grid", "data": { "label": "Why OlonJS", "sectionTitle": "A whole in itself,", "sectionTitleItalic": "part of something greater.", "sectionLead": "Built on the concept of the holon — every component autonomous yet part of the larger contract. Governance and developer experience, unified.", "cards": [{ "id": "card-endpoints", "icon": { "url": "/icons/features/icon-json-files.svg", "alt": "JSON files icon" }, "title": "Canonical JSON endpoints", "description": "Every page available at /{slug}.json — deterministic, typed, agent-readable. No custom integration per tenant." }, { "id": "card-schema", "icon": { "url": "/icons/features/icon-zod-schemas.svg", "alt": "Zod schemas icon" }, "title": "Schema-driven contracts", "description": "Typed components validated against your schema. Shared conventions eliminate prompt ambiguity across teams." }, { "id": "card-ai", "icon": { "url": "/icons/features/icon-ai-specs.svg", "alt": "AI specs icon" }, "title": "AI-native velocity", "description": "Structure is deterministic, so AI can scaffold and evolve tenants faster. Ship new experiences in hours, not weeks." }, { "id": "card-multitenant", "icon": { "url": "/icons/features/icon-own-data.svg", "alt": "Own data icon" }, "title": "Multi-tenant at scale", "description": "One convention across many tenants enables reusable automations. No per-tenant custom integration work." }, { "id": "card-governance", "icon": { "url": "/icons/features/icon-governance.svg", "alt": "Governance icon" }, "title": "Enterprise governance", "description": "Audit trails, compliance controls, and private cloud deployment via NX monorepo. SOC2-ready by design." }, { "id": "card-deploy", "icon": { "url": "/icons/features/icon-clean-commits.svg", "alt": "Clean commits icon" }, "title": "Deployment flexibility", "description": "OSS core you can trust. Vercel-native cloud for speed. Private cloud for governance-heavy orgs." }], "proofStatement": "Working end-to-end with production routing parity.", "proofSub": "Early customer usage across real tenant deployments · Clear hardening path to enterprise-grade governance.", "tiers": [{ "id": "tier-oss", "label": "OSS" }, { "id": "tier-cloud", "label": "Cloud" }, { "id": "tier-enterprise", "label": "Enterprise" }] }, "settings": { "columns": 3 } }, { "id": "contact-section", "type": "contact", "data": { "label": "Contact", "title": "Ready to define", "titleHighlight": "your contract?", "description": "Whether you're running a single tenant or deploying enterprise-grade governance across dozens of properties — let's talk.", "tiers": [{ "id": "tier-oss", "label": "OSS", "desc": "Open source core — free forever", "sub": "Adoption, trust, ecosystem growth" }, { "id": "tier-cloud", "label": "Cloud", "desc": "Vercel-native self-serve workflow", "sub": "Fast for modern dev teams" }, { "id": "tier-enterprise", "label": "Enterprise", "desc": "Private cloud + NX monorepo", "sub": "Security, compliance, controlled deployment" }], "formTitle": "Get in touch", "successTitle": "Message received", "successBody": "We'll respond within one business day.", "disclaimer": "No spam. Unsubscribe at any time." }, "settings": { "showTiers": true } }, { "id": "login-section", "type": "login", "data": { "title": "Start your journey", "subtitle": "Enter your credentials to continue", "forgotHref": "#", "signupHref": "#contact", "termsHref": "#", "privacyHref": "#" }, "settings": { "showOauth": true } }];
const home = {
  id: id$2,
  slug: slug$2,
  meta: meta$2,
  sections: sections$2,
  "global-header": false
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  id: id$2,
  meta: meta$2,
  sections: sections$2,
  slug: slug$2
}, Symbol.toStringTag, { value: "Module" }));
const id$1 = "overview-page";
const slug$1 = "platform/overview";
const meta$1 = { "title": "OlonJS — Documentation", "description": "Architecture specifications, tenant protocol, and developer reference for the OlonJS contract layer." };
const sections$1 = [{ "id": "doc-page-hero", "type": "page-hero", "data": { "breadcrumb": [{ "id": "crumb-home", "label": "Home", "href": "/" }, { "id": "crumb-docs", "label": "Docs", "href": "/doc" }], "badge": "", "title": "Platform", "titleItalic": "Overview", "description": "The platform overview page." } }];
const overview = {
  id: id$1,
  slug: slug$1,
  meta: meta$1,
  sections: sections$1
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: overview,
  id: id$1,
  meta: meta$1,
  sections: sections$1,
  slug: slug$1
}, Symbol.toStringTag, { value: "Module" }));
const id = "post-page";
const slug = "post";
const meta = { "title": "Post", "description": "Smoke test page for header + tiptap + footer flow." };
const sections = [{ "id": "post-editorial-main", "type": "tiptap", "data": { "content": '# JsonPages Cloud – Terms of Service & EULA\n\n---\n\n### **Last Updated:** March 2026\n\n### 1. THE SERVICE\n\nJsonPages provides a hybrid content management infrastructure consisting of:\n\n- **The Core:** An open-source library (@jsonpages/core) governed by the **MIT License**.\n- **The Cloud:** A proprietary SaaS platform (`cloud.jsonpages.io`) that provides the "Git Bridge," Asset Pipeline, and Managed Infrastructure.\n\nBy using the Cloud Service, you agree to these terms.\n\n### 2. DATA SOVEREIGNTY & OWNERSHIP\n\n- **Your Content:** All data (JSON files), code, and assets managed through JsonPages remain your exclusive property. JsonPages acts only as an **orchestrator**.\n- **The Bridge:** You grant JsonPages the necessary permissions to perform Git operations (commits/pushes) on your behalf to your designated repositories (GitHub/GitLab).\n- **Portability:** Since your content is stored as flat JSON files in your own repository, you retain the right to migrate away from the Cloud Service at any time without data lock-in.\n- \n\n### 3. SUBSCRIPTIONS & ENTITLEMENTS\n\n- **Billing:** The Cloud Service is billed on a subscription basis (**Monthly Recurring Revenue**).\n- **Entitlements:** Each "Project" or "Tenant" consumes one entitlement. Active entitlements grant access to the Visual Studio (ICE) and the Cloud Save API.\n- **Third-Party Costs:** You are solely responsible for any costs incurred on third-party platforms (e.g., **Vercel** hosting, **GitHub** storage, **Cloudflare** workers).\n\n### 4. ACCEPTABLE USE\n\nYou may not use JsonPages Cloud to:\n\n- Host or manage illegal, harmful, or offensive content.\n- Attempt to reverse-engineer the proprietary Cloud Bridge or bypass entitlement checks.\n- Interfere with the stability of the API for other users.\n- \n\n### 5. LIMITATION OF LIABILITY\n\n- **"As-Is" Basis:** The service is provided "as-is." While we strive for 99.9% uptime, JsonPages is not liable for data loss resulting from Git conflicts, third-party outages (Vercel/GitHub), or user error.\n- **No Warranty:** We do not warrant that the service will be error-free or uninterrupted.\n- \n\n### 6. TERMINATION\n\n- **By You:** You can cancel your subscription at any time. Your Studio access will remain active until the end of the current billing cycle.\n- \n- **By Us:** We reserve the right to suspend accounts that violate these terms or fail to settle outstanding invoices.\n\n### 7. GOVERNING LAW\n\nThese terms are governed by the laws of **Italy/European Union**, without regard to conflict of law principles.' }, "settings": {} }];
const post = {
  id,
  slug,
  meta,
  sections
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: post,
  id,
  meta,
  sections,
  slug
}, Symbol.toStringTag, { value: "Module" }));
function slugFromPath(filePath) {
  var _a;
  const normalizedPath = filePath.replace(/\\/g, "/");
  const match = normalizedPath.match(/\/data\/pages\/(.+)\.json$/i);
  const rawSlug = (match == null ? void 0 : match[1]) ?? ((_a = normalizedPath.split("/").pop()) == null ? void 0 : _a.replace(/\.json$/i, "")) ?? "";
  const canonical = rawSlug.split("/").map((segment) => segment.trim()).filter(Boolean).join("/");
  return canonical || "home";
}
function getFilePages() {
  const glob = /* @__PURE__ */ Object.assign({ "/src/data/pages/design-system.json": __vite_glob_0_0, "/src/data/pages/docs.json": __vite_glob_0_1, "/src/data/pages/home.json": __vite_glob_0_2, "/src/data/pages/platform/overview.json": __vite_glob_0_3, "/src/data/pages/post.json": __vite_glob_0_4 });
  const bySlug = /* @__PURE__ */ new Map();
  const entries = Object.entries(glob).sort(([a], [b]) => a.localeCompare(b));
  for (const [path, mod] of entries) {
    const slug2 = slugFromPath(path);
    const raw = mod == null ? void 0 : mod.default;
    if (raw == null || typeof raw !== "object") {
      console.warn(`[tenant-alpha:getFilePages] Ignoring invalid page module at "${path}".`);
      continue;
    }
    if (bySlug.has(slug2)) {
      console.warn(`[tenant-alpha:getFilePages] Duplicate slug "${slug2}" at "${path}". Keeping latest match.`);
    }
    bySlug.set(slug2, raw);
  }
  const slugs = Array.from(bySlug.keys()).sort(
    (a, b) => a === "home" ? -1 : b === "home" ? 1 : a.localeCompare(b)
  );
  const record = {};
  for (const slug2 of slugs) {
    const config = bySlug.get(slug2);
    if (config) record[slug2] = config;
  }
  return record;
}
const identity = { "title": "OlonJS", "logoUrl": "/brand/mark/olon-mark-dark.svg" };
const pages$1 = [{ "slug": "home", "label": "Home" }, { "slug": "design-system", "label": "Design System" }];
const header = { "id": "global-header", "type": "header", "data": { "logoText": "Olon", "badge": "", "links": [{ "label": "Platform", "href": "/platform", "children": [{ "label": "Overview", "href": "/platform/overview" }, { "label": "Architecture", "href": "/platform/architecture" }, { "label": "Security", "href": "/platform/security" }, { "label": "Integrations", "href": "/platform/integrations" }, { "label": "Roadmap", "href": "/platform/roadmap" }] }, { "label": "Solutions", "href": "/solutions" }, { "label": "Pricing", "href": "/pricing" }, { "label": "Resources", "href": "/resources" }], "ctaLabel": "Get started →", "ctaHref": "#contact", "signinHref": "#login" } };
const footer = { "id": "global-footer", "type": "footer", "data": { "brandText": "Olon", "copyright": "© 2025 OlonJS · v1.4 · Holon", "links": [{ "label": "Docs", "href": "/docs" }, { "label": "GitHub", "href": "#" }, { "label": "Privacy", "href": "#" }, { "label": "Terms", "href": "#" }], "designSystemHref": "/design-system" }, "settings": { "showLogo": true } };
const siteData = {
  identity,
  pages: pages$1,
  header,
  footer
};
const main = [{ "label": "Platform", "href": "/platform", "children": [{ "label": "Overview", "href": "/platform/overview" }, { "label": "Architecture", "href": "/platform/architecture" }, { "label": "Security", "href": "/platform/security" }, { "label": "Integrations", "href": "/platform/integrations" }, { "label": "Roadmap", "href": "/platform/roadmap" }] }, { "label": "Solutions", "href": "/solutions" }, { "label": "Pricing", "href": "/pricing" }, { "label": "Resources", "href": "/resources" }];
const menuData = {
  main
};
const name = "Olon";
const tokens = { "colors": { "background": "#0B0907", "card": "#130F0D", "elevated": "#1E1814", "overlay": "#241D17", "popover": "#1A1410", "popover-foreground": "#F2EDE6", "foreground": "#F2EDE6", "card-foreground": "#F2EDE6", "muted-foreground": "#9A8D80", "placeholder": "#5C5248", "primary": "#5B3F9A", "primary-foreground": "#EDE8F8", "primary-light": "#B8A4E0", "primary-dark": "#3D2770", "primary-50": "#EDE8F8", "primary-100": "#CEC1F0", "primary-200": "#B8A4E0", "primary-300": "#A48ED5", "primary-400": "#8B6FC6", "primary-500": "#7254B0", "primary-600": "#5B3F9A", "primary-700": "#4C3482", "primary-800": "#3D2770", "primary-900": "#271852", "accent": "#E2D5B0", "accent-foreground": "#0B0907", "secondary": "#1E1814", "secondary-foreground": "#F2EDE6", "muted": "#1E1814", "border": "#2E271F", "border-strong": "#4A3D30", "input": "#2E271F", "ring": "#5B3F9A", "destructive": "#7F1D1D", "destructive-foreground": "#FCA5A5", "destructive-border": "#991B1B", "destructive-ring": "#EF4444", "success": "#14532D", "success-foreground": "#86EFAC", "success-border": "#166534", "success-indicator": "#22C55E", "warning": "#78350F", "warning-foreground": "#FCD34D", "warning-border": "#92400E", "info": "#1E3A5F", "info-foreground": "#93C5FD", "info-border": "#1E40AF" }, "modes": { "light": { "colors": { "background": "#F2EDE6", "card": "#FFFFFF", "elevated": "#F5F2EE", "overlay": "#EDE9E3", "popover": "#FFFFFF", "popover-foreground": "#1A1410", "foreground": "#1A1410", "card-foreground": "#1A1410", "muted-foreground": "#6B6058", "placeholder": "#A89E96", "primary": "#5B3F9A", "primary-foreground": "#FAFAF8", "primary-light": "#7254B0", "primary-dark": "#3D2770", "primary-50": "#EDE8F8", "primary-100": "#CEC1F0", "primary-200": "#B8A4E0", "primary-300": "#A48ED5", "primary-400": "#8B6FC6", "primary-500": "#7254B0", "primary-600": "#5B3F9A", "primary-700": "#4C3482", "primary-800": "#3D2770", "primary-900": "#271852", "accent": "#2E271F", "accent-foreground": "#FFFFFF", "secondary": "#F5F2EE", "secondary-foreground": "#1A1410", "muted": "#F5F2EE", "border": "#DDD8D2", "border-strong": "#C4BEB8", "input": "#DDD8D2", "ring": "#5B3F9A", "destructive": "#FEF2F2", "destructive-foreground": "#991B1B", "destructive-border": "#FECACA", "destructive-ring": "#EF4444", "success": "#F0FDF4", "success-foreground": "#166534", "success-border": "#BBF7D0", "success-indicator": "#16A34A", "warning": "#FFFBEB", "warning-foreground": "#92400E", "warning-border": "#FDE68A", "info": "#EFF6FF", "info-foreground": "#1E40AF", "info-border": "#BFDBFE" } } }, "typography": { "fontFamily": { "primary": "'Geist', 'Geist Fallback', system-ui, sans-serif", "mono": "'Geist Mono', 'Geist Mono Fallback', monospace", "display": "'Merriweather Variable', Georgia, serif" }, "wordmark": { "fontFamily": "'Merriweather Variable', sans-serif", "weight": "500", "width": "112" }, "scale": { "xs": "11px", "sm": "13px", "base": "1rem", "md": "1.125rem", "lg": "1.25rem", "xl": "1.5rem", "2xl": "1.625rem", "3xl": "1.75rem", "4xl": "2rem", "5xl": "2.5rem", "6xl": "3rem", "7xl": "4.5rem" }, "tracking": { "tight": "-0.03em", "display": "-0.035em", "normal": "0em", "wide": "0.04em", "label": "0.12em" }, "leading": { "none": "1", "tight": "1.2", "snug": "1.35", "normal": "1.65", "relaxed": "1.75" } }, "borderRadius": { "xl": "16px", "lg": "12px", "md": "8px", "sm": "4px", "full": "9999px" }, "spacing": { "container-max": "1152px", "section-y": "96px", "header-h": "56px", "sidebar-w": "240px" }, "zIndex": { "base": "0", "elevated": "10", "dropdown": "100", "sticky": "200", "overlay": "300", "modal": "400", "toast": "500" } };
const themeData = {
  name,
  tokens
};
const tenantCss = `/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-content:"";--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:var(--theme-font-mono);--color-red-500:oklch(63.7% .237 25.331);--color-emerald-500:oklch(69.6% .17 162.48);--color-blue-500:oklch(62.3% .214 259.815);--color-zinc-100:oklch(96.7% .001 286.375);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-md:28rem;--container-lg:32rem;--container-xl:36rem;--container-2xl:42rem;--container-4xl:56rem;--container-6xl:72rem;--text-xs:var(--theme-text-xs);--text-xs--line-height:calc(1/.75);--text-sm:var(--theme-text-sm);--text-sm--line-height:calc(1.25/.875);--text-base:var(--theme-text-base);--text-base--line-height: 1.5 ;--text-lg:var(--theme-text-lg);--text-lg--line-height:calc(1.75/1.125);--text-xl:var(--theme-text-xl);--text-xl--line-height:calc(1.75/1.25);--text-2xl:var(--theme-text-2xl);--text-2xl--line-height:calc(2/1.5);--text-3xl:var(--theme-text-3xl);--text-3xl--line-height: 1.2 ;--text-4xl:var(--theme-text-4xl);--text-4xl--line-height:calc(2.5/2.25);--text-5xl:var(--theme-text-5xl);--text-5xl--line-height:1;--text-6xl:var(--theme-text-6xl);--text-6xl--line-height:1;--text-7xl:var(--theme-text-7xl);--text-7xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--tracking-tight:var(--theme-tracking-tight);--tracking-wide:var(--theme-tracking-wide);--tracking-widest:.1em;--leading-tight:var(--theme-leading-tight);--leading-snug:var(--theme-leading-snug);--leading-relaxed:var(--theme-leading-relaxed);--radius-sm:var(--theme-radius-sm);--radius-md:var(--theme-radius-md);--radius-lg:var(--theme-radius-lg);--radius-xl:var(--theme-radius-xl);--radius-2xl:1rem;--ease-out:cubic-bezier(0,0,.2,1);--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-sm:8px;--blur-md:12px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-background:var(--background);--color-card:var(--card);--color-elevated:var(--elevated);--color-popover:var(--popover);--color-popover-foreground:var(--popover-foreground);--color-foreground:var(--foreground);--color-card-foreground:var(--card-foreground);--color-muted-foreground:var(--muted-foreground);--color-primary:var(--primary);--color-primary-foreground:var(--primary-foreground);--color-primary-light:var(--primary-light);--color-primary-200:var(--primary-200);--color-primary-400:var(--primary-400);--color-primary-800:var(--primary-800);--color-primary-900:var(--primary-900);--color-accent:var(--accent);--color-accent-foreground:var(--accent-foreground);--color-muted:var(--muted);--color-border:var(--border);--color-border-strong:var(--border-strong);--color-input:var(--input);--color-ring:var(--ring);--color-destructive:var(--destructive);--color-destructive-foreground:var(--destructive-foreground);--color-destructive-border:var(--destructive-border);--color-destructive-ring:var(--destructive-ring);--color-success:var(--success);--color-success-indicator:var(--success-indicator);--color-warning:var(--warning);--color-info:var(--info);--radius-full:var(--theme-radius-full);--font-primary:var(--theme-font-primary);--font-display:var(--theme-font-display);--text-md:var(--theme-text-md);--leading-none:var(--theme-leading-none);--tracking-display:var(--theme-tracking-display);--tracking-label:var(--theme-tracking-label)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}*,:before,:after{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%}body{background-color:var(--background);color:var(--foreground);font-family:var(--theme-font-primary);font-size:var(--theme-text-base);line-height:var(--theme-leading-normal);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}h1,h2,h3,h4,h5,h6{font-family:var(--theme-font-primary);font-weight:500;line-height:var(--theme-leading-tight);color:var(--foreground)}h1{font-size:var(--theme-text-5xl)}h2{font-size:var(--theme-text-4xl)}h3{font-size:var(--theme-text-3xl)}h4{font-size:var(--theme-text-2xl)}h5{font-size:var(--theme-text-xl)}h6{font-size:var(--theme-text-lg)}@media(min-width:768px){h1{font-size:var(--theme-text-6xl)}h2{font-size:var(--theme-text-5xl)}h3{font-size:var(--theme-text-4xl)}h4{font-size:var(--theme-text-3xl)}h5{font-size:var(--theme-text-2xl)}h6{font-size:var(--theme-text-xl)}}@media(min-width:1024px){h1{font-size:var(--theme-text-7xl)}h2{font-size:var(--theme-text-6xl)}h3{font-size:var(--theme-text-5xl)}h4{font-size:var(--theme-text-4xl)}h5{font-size:var(--theme-text-3xl)}h6{font-size:var(--theme-text-2xl)}}p{line-height:var(--theme-leading-normal)}code,pre,kbd,samp{font-family:var(--theme-font-mono)}a{color:inherit;text-decoration:none}button{cursor:pointer}input,textarea,select{font-family:var(--theme-font-primary);font-size:var(--theme-text-sm)}::selection{background-color:var(--primary);color:var(--primary-foreground)}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:var(--background)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}::-webkit-scrollbar-thumb:hover{background:var(--border-strong)}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.invisible{visibility:hidden}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.sticky{position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.top-0{top:calc(var(--spacing)*0)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.right-0{right:calc(var(--spacing)*0)}.right-1{right:calc(var(--spacing)*1)}.right-2{right:calc(var(--spacing)*2)}.right-3{right:calc(var(--spacing)*3)}.left-0{left:calc(var(--spacing)*0)}.left-1\\/2{left:50%}.isolate{isolation:isolate}.z-0{z-index:0}.z-10{z-index:10}.z-40{z-index:40}.z-50{z-index:50}.z-\\[65\\]{z-index:65}.z-\\[110\\]{z-index:110}.z-\\[1290\\]{z-index:1290}.order-1{order:1}.order-2{order:2}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.-mx-1{margin-inline:calc(var(--spacing)*-1)}.mx-0\\.5{margin-inline:calc(var(--spacing)*.5)}.mx-2\\.5{margin-inline:calc(var(--spacing)*2.5)}.mx-auto{margin-inline:auto}.my-1{margin-block:calc(var(--spacing)*1)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3\\.5{margin-top:calc(var(--spacing)*3.5)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-5{margin-top:calc(var(--spacing)*5)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-px{margin-top:1px}.mr-2{margin-right:calc(var(--spacing)*2)}.mb-0{margin-bottom:calc(var(--spacing)*0)}.mb-0\\.5{margin-bottom:calc(var(--spacing)*.5)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-5{margin-bottom:calc(var(--spacing)*5)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-7{margin-bottom:calc(var(--spacing)*7)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.mb-9{margin-bottom:calc(var(--spacing)*9)}.mb-10{margin-bottom:calc(var(--spacing)*10)}.mb-12{margin-bottom:calc(var(--spacing)*12)}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-24{margin-bottom:calc(var(--spacing)*24)}.mb-px{margin-bottom:1px}.ml-0\\.5{margin-left:calc(var(--spacing)*.5)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-auto{margin-left:auto}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.field-sizing-content{field-sizing:content}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.h-\\(--radix-select-trigger-height\\){height:var(--radix-select-trigger-height)}.h-1\\.5{height:calc(var(--spacing)*1.5)}.h-2{height:calc(var(--spacing)*2)}.h-2\\.5{height:calc(var(--spacing)*2.5)}.h-3{height:calc(var(--spacing)*3)}.h-4{height:calc(var(--spacing)*4)}.h-5{height:calc(var(--spacing)*5)}.h-6{height:calc(var(--spacing)*6)}.h-7{height:calc(var(--spacing)*7)}.h-8{height:calc(var(--spacing)*8)}.h-9{height:calc(var(--spacing)*9)}.h-10{height:calc(var(--spacing)*10)}.h-14{height:calc(var(--spacing)*14)}.h-16{height:calc(var(--spacing)*16)}.h-18{height:calc(var(--spacing)*18)}.h-24{height:calc(var(--spacing)*24)}.h-\\[0\\.5px\\]{height:.5px}.h-\\[5px\\]{height:5px}.h-\\[18px\\]{height:18px}.h-\\[72px\\]{height:72px}.h-\\[220px\\]{height:220px}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\(--radix-select-content-available-height\\){max-height:var(--radix-select-content-available-height)}.max-h-0{max-height:calc(var(--spacing)*0)}.max-h-\\[32rem\\]{max-height:32rem}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-16{min-height:calc(var(--spacing)*16)}.min-h-\\[220px\\]{min-height:220px}.min-h-screen{min-height:100vh}.w-1\\.5{width:calc(var(--spacing)*1.5)}.w-2{width:calc(var(--spacing)*2)}.w-2\\.5{width:calc(var(--spacing)*2.5)}.w-3{width:calc(var(--spacing)*3)}.w-4{width:calc(var(--spacing)*4)}.w-4\\/6{width:66.6667%}.w-5{width:calc(var(--spacing)*5)}.w-5\\/6{width:83.3333%}.w-6{width:calc(var(--spacing)*6)}.w-8{width:calc(var(--spacing)*8)}.w-9{width:calc(var(--spacing)*9)}.w-10{width:calc(var(--spacing)*10)}.w-32{width:calc(var(--spacing)*32)}.w-60{width:calc(var(--spacing)*60)}.w-64{width:calc(var(--spacing)*64)}.w-\\[0\\.5px\\]{width:.5px}.w-\\[5px\\]{width:5px}.w-\\[18px\\]{width:18px}.w-\\[72px\\]{width:72px}.w-\\[min\\(240px\\,28vw\\)\\]{width:min(240px,28vw)}.w-full{width:100%}.w-px{width:1px}.max-w-2xl{max-width:var(--container-2xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-\\[360px\\]{max-width:360px}.max-w-\\[1040px\\]{max-width:1040px}.max-w-\\[1600px\\]{max-width:1600px}.max-w-lg{max-width:var(--container-lg)}.max-w-md{max-width:var(--container-md)}.max-w-none{max-width:none}.max-w-xl{max-width:var(--container-xl)}.min-w-\\(--radix-select-trigger-width\\){min-width:var(--radix-select-trigger-width)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-7{min-width:calc(var(--spacing)*7)}.min-w-36{min-width:calc(var(--spacing)*36)}.min-w-\\[64px\\]{min-width:64px}.min-w-\\[220px\\]{min-width:220px}.flex-1{flex:1}.flex-shrink-0,.shrink-0{flex-shrink:0}.border-collapse{border-collapse:collapse}.origin-\\(--radix-select-content-transform-origin\\){transform-origin:var(--radix-select-content-transform-origin)}.origin-top-left{transform-origin:0 0}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-95{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x)var(--tw-scale-y)}.scale-100{--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y)}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-pulse{animation:var(--animate-pulse)}.cursor-default{cursor:default}.resize{resize:both}.resize-none{resize:none}.scroll-my-1{scroll-margin-block:calc(var(--spacing)*1)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.place-content-center{place-content:center}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-2\\.5{gap:calc(var(--spacing)*2.5)}.gap-3{gap:calc(var(--spacing)*3)}.gap-3\\.5{gap:calc(var(--spacing)*3.5)}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}.gap-7{gap:calc(var(--spacing)*7)}.gap-8{gap:calc(var(--spacing)*8)}.gap-14{gap:calc(var(--spacing)*14)}.gap-16{gap:calc(var(--spacing)*16)}.gap-px{gap:1px}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*0)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*0)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-1\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*1.5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*1.5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*2)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*2)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3.5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3.5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*6)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*6)*calc(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-y-contain{overscroll-behavior-y:contain}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[4px\\]{border-radius:4px}.rounded-\\[7px\\]{border-radius:7px}.rounded-\\[var\\(--local-radius-lg\\)\\]{border-radius:var(--local-radius-lg)}.rounded-\\[var\\(--local-radius-md\\)\\]{border-radius:var(--local-radius-md)}.rounded-\\[var\\(--local-radius-sm\\)\\]{border-radius:var(--local-radius-sm)}.rounded-full{border-radius:var(--radius-full)}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-\\[var\\(--local-border\\)\\]{border-color:var(--local-border)}.border-\\[var\\(--local-primary\\)\\]{border-color:var(--local-primary)}.border-\\[var\\(--local-toolbar-border\\)\\]{border-color:var(--local-toolbar-border)}.border-border{border-color:var(--color-border)}.border-border-strong{border-color:var(--color-border-strong)}.border-border\\/50{border-color:var(--color-border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/50{border-color:color-mix(in oklab,var(--color-border)50%,transparent)}}.border-destructive-border{border-color:var(--color-destructive-border)}.border-input{border-color:var(--color-input)}.border-primary{border-color:var(--color-primary)}.border-primary-800{border-color:var(--color-primary-800)}.bg-\\[\\#10b981\\]{background-color:#10b981}.bg-\\[\\#ef4444\\]{background-color:#ef4444}.bg-\\[\\#f59e0b\\]{background-color:#f59e0b}.bg-\\[color-mix\\(in_srgb\\,var\\(--local-toolbar-bg\\)_40\\%\\,transparent\\)\\]{background-color:var(--local-toolbar-bg)}@supports (color:color-mix(in lab,red,red)){.bg-\\[color-mix\\(in_srgb\\,var\\(--local-toolbar-bg\\)_40\\%\\,transparent\\)\\]{background-color:color-mix(in srgb,var(--local-toolbar-bg)40%,transparent)}}.bg-\\[var\\(--local-bg\\)\\]{background-color:var(--local-bg)}.bg-\\[var\\(--local-border\\)\\]{background-color:var(--local-border)}.bg-\\[var\\(--local-primary\\)\\]{background-color:var(--local-primary)}.bg-\\[var\\(--local-toolbar-active-bg\\)\\]{background-color:var(--local-toolbar-active-bg)}.bg-\\[var\\(--local-toolbar-bg\\)\\]{background-color:var(--local-toolbar-bg)}.bg-\\[var\\(--local-toolbar-border\\)\\]{background-color:var(--local-toolbar-border)}.bg-\\[var\\(--local-toolbar-hover-bg\\)\\]{background-color:var(--local-toolbar-hover-bg)}.bg-accent{background-color:var(--color-accent)}.bg-background,.bg-background\\/80{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/80{background-color:color-mix(in oklab,var(--color-background)80%,transparent)}}.bg-background\\/90{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/90{background-color:color-mix(in oklab,var(--color-background)90%,transparent)}}.bg-blue-500{background-color:var(--color-blue-500)}.bg-border{background-color:var(--color-border)}.bg-border-strong{background-color:var(--color-border-strong)}.bg-card,.bg-card\\/60{background-color:var(--color-card)}@supports (color:color-mix(in lab,red,red)){.bg-card\\/60{background-color:color-mix(in oklab,var(--color-card)60%,transparent)}}.bg-destructive{background-color:var(--color-destructive)}.bg-elevated,.bg-elevated\\/50{background-color:var(--color-elevated)}@supports (color:color-mix(in lab,red,red)){.bg-elevated\\/50{background-color:color-mix(in oklab,var(--color-elevated)50%,transparent)}}.bg-emerald-500\\/10{background-color:#00bb7f1a}@supports (color:color-mix(in lab,red,red)){.bg-emerald-500\\/10{background-color:color-mix(in oklab,var(--color-emerald-500)10%,transparent)}}.bg-info{background-color:var(--color-info)}.bg-muted,.bg-muted\\/20{background-color:var(--color-muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/20{background-color:color-mix(in oklab,var(--color-muted)20%,transparent)}}.bg-popover{background-color:var(--color-popover)}.bg-primary{background-color:var(--color-primary)}.bg-primary-900{background-color:var(--color-primary-900)}.bg-primary\\/10{background-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/10{background-color:color-mix(in oklab,var(--color-primary)10%,transparent)}}.bg-red-500\\/10{background-color:#fb2c361a}@supports (color:color-mix(in lab,red,red)){.bg-red-500\\/10{background-color:color-mix(in oklab,var(--color-red-500)10%,transparent)}}.bg-success{background-color:var(--color-success)}.bg-success-indicator{background-color:var(--color-success-indicator)}.bg-transparent{background-color:#0000}.bg-warning{background-color:var(--color-warning)}.bg-gradient-to-br{--tw-gradient-position:to bottom right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-\\[\\#84ABFF\\]{--tw-gradient-from:#84abff;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-primary-light{--tw-gradient-from:var(--color-primary-light);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-transparent{--tw-gradient-from:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.via-border{--tw-gradient-via:var(--color-border);--tw-gradient-via-stops:var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-via)var(--tw-gradient-via-position),var(--tw-gradient-to)var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-via-stops)}.to-\\[\\#1763FF\\]{--tw-gradient-to:#1763ff;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-accent{--tw-gradient-to:var(--color-accent);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-transparent{--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.object-cover{object-fit:cover}.p-0{padding:calc(var(--spacing)*0)}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-3\\.5{padding:calc(var(--spacing)*3.5)}.p-4{padding:calc(var(--spacing)*4)}.p-5{padding:calc(var(--spacing)*5)}.p-6{padding:calc(var(--spacing)*6)}.p-7{padding:calc(var(--spacing)*7)}.p-8{padding:calc(var(--spacing)*8)}.p-10{padding:calc(var(--spacing)*10)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-5{padding-inline:calc(var(--spacing)*5)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-7{padding-inline:calc(var(--spacing)*7)}.px-8{padding-inline:calc(var(--spacing)*8)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-4{padding-block:calc(var(--spacing)*4)}.py-5{padding-block:calc(var(--spacing)*5)}.py-8{padding-block:calc(var(--spacing)*8)}.py-12{padding-block:calc(var(--spacing)*12)}.py-14{padding-block:calc(var(--spacing)*14)}.py-20{padding-block:calc(var(--spacing)*20)}.py-24{padding-block:calc(var(--spacing)*24)}.py-32{padding-block:calc(var(--spacing)*32)}.pt-3{padding-top:calc(var(--spacing)*3)}.pt-5{padding-top:calc(var(--spacing)*5)}.pt-36{padding-top:calc(var(--spacing)*36)}.pr-2{padding-right:calc(var(--spacing)*2)}.pr-8{padding-right:calc(var(--spacing)*8)}.pr-10{padding-right:calc(var(--spacing)*10)}.pb-5{padding-bottom:calc(var(--spacing)*5)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-28{padding-bottom:calc(var(--spacing)*28)}.pl-1\\.5{padding-left:calc(var(--spacing)*1.5)}.pl-2\\.5{padding-left:calc(var(--spacing)*2.5)}.pl-3{padding-left:calc(var(--spacing)*3)}.pl-\\[8px\\]{padding-left:8px}.pl-\\[22px\\]{padding-left:22px}.text-center{text-align:center}.text-left{text-align:left}.align-middle{vertical-align:middle}.font-mono{font-family:var(--font-mono)}.font-primary{font-family:var(--font-primary)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.58rem\\]{font-size:.58rem}.text-\\[0\\.72rem\\]{font-size:.72rem}.text-\\[0\\.76rem\\]{font-size:.76rem}.text-\\[8px\\]{font-size:8px}.text-\\[9px\\]{font-size:9px}.text-\\[10\\.5px\\]{font-size:10.5px}.text-\\[10px\\]{font-size:10px}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[11px\\]{font-size:11px}.text-\\[12\\.5px\\]{font-size:12.5px}.text-\\[12px\\]{font-size:12px}.text-\\[13\\.5px\\]{font-size:13.5px}.text-\\[13px\\]{font-size:13px}.text-\\[14px\\]{font-size:14px}.text-\\[15px\\]{font-size:15px}.text-\\[16px\\]{font-size:16px}.text-\\[18px\\]{font-size:18px}.text-\\[21px\\]{font-size:21px}.text-\\[28px\\]{font-size:28px}.text-md{font-size:var(--text-md)}.leading-\\[1\\.1\\]{--tw-leading:1.1;line-height:1.1}.leading-\\[1\\.2\\]{--tw-leading:1.2;line-height:1.2}.leading-\\[1\\.6\\]{--tw-leading:1.6;line-height:1.6}.leading-\\[1\\.8\\]{--tw-leading:1.8;line-height:1.8}.leading-\\[1\\.15\\]{--tw-leading:1.15;line-height:1.15}.leading-\\[1\\.65\\]{--tw-leading:1.65;line-height:1.65}.leading-\\[1\\.78\\]{--tw-leading:1.78;line-height:1.78}.leading-none{--tw-leading:var(--leading-none);line-height:var(--leading-none)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[-0\\.01em\\]{--tw-tracking:-.01em;letter-spacing:-.01em}.tracking-\\[-0\\.02em\\]{--tw-tracking:-.02em;letter-spacing:-.02em}.tracking-\\[-0\\.03em\\]{--tw-tracking:-.03em;letter-spacing:-.03em}.tracking-\\[-0\\.04em\\]{--tw-tracking:-.04em;letter-spacing:-.04em}.tracking-\\[-0\\.038em\\]{--tw-tracking:-.038em;letter-spacing:-.038em}.tracking-\\[\\.08em\\]{--tw-tracking:.08em;letter-spacing:.08em}.tracking-\\[\\.10em\\]{--tw-tracking:.1em;letter-spacing:.1em}.tracking-\\[\\.12em\\]{--tw-tracking:.12em;letter-spacing:.12em}.tracking-\\[0\\.1em\\]{--tw-tracking:.1em;letter-spacing:.1em}.tracking-\\[0\\.12em\\]{--tw-tracking:.12em;letter-spacing:.12em}.tracking-\\[0\\.14em\\]{--tw-tracking:.14em;letter-spacing:.14em}.tracking-display{--tw-tracking:var(--tracking-display);letter-spacing:var(--tracking-display)}.tracking-label{--tw-tracking:var(--tracking-label);letter-spacing:var(--tracking-label)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-widest{--tw-tracking:var(--tracking-widest);letter-spacing:var(--tracking-widest)}.whitespace-nowrap{white-space:nowrap}.text-\\[\\#84ABFF\\]{color:#84abff}.text-\\[var\\(--local-bg\\)\\]{color:var(--local-bg)}.text-\\[var\\(--local-primary\\)\\]{color:var(--local-primary)}.text-\\[var\\(--local-text\\)\\]{color:var(--local-text)}.text-\\[var\\(--local-text-muted\\)\\]{color:var(--local-text-muted)}.text-\\[var\\(--local-toolbar-text\\)\\]{color:var(--local-toolbar-text)}.text-accent{color:var(--color-accent)}.text-accent-foreground{color:var(--color-accent-foreground)}.text-border-strong{color:var(--color-border-strong)}.text-card-foreground{color:var(--color-card-foreground)}.text-current{color:currentColor}.text-destructive-foreground{color:var(--color-destructive-foreground)}.text-emerald-500{color:var(--color-emerald-500)}.text-foreground{color:var(--color-foreground)}.text-muted-foreground,.text-muted-foreground\\/40{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/40{color:color-mix(in oklab,var(--color-muted-foreground)40%,transparent)}}.text-muted-foreground\\/50{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/50{color:color-mix(in oklab,var(--color-muted-foreground)50%,transparent)}}.text-muted-foreground\\/60{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/60{color:color-mix(in oklab,var(--color-muted-foreground)60%,transparent)}}.text-popover-foreground{color:var(--color-popover-foreground)}.text-primary{color:var(--color-primary)}.text-primary-200{color:var(--color-primary-200)}.text-primary-400{color:var(--color-primary-400)}.text-primary-foreground{color:var(--color-primary-foreground)}.text-primary-light{color:var(--color-primary-light)}.text-red-500{color:var(--color-red-500)}.text-transparent{color:#0000}.text-white{color:var(--color-white)}.text-zinc-100{color:var(--color-zinc-100)}.lowercase{text-transform:lowercase}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.no-underline{text-decoration-line:none}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.accent-foreground{accent-color:var(--color-foreground)}.opacity-0{opacity:0}.opacity-40{opacity:.4}.opacity-70{opacity:.7}.opacity-100{opacity:1}.shadow-\\[0_0_32px_rgba\\(23\\,99\\,255\\,\\.38\\)\\]{--tw-shadow:0 0 32px var(--tw-shadow-color,#1763ff61);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring,.ring-1{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-black\\/20{--tw-shadow-color:#0003}@supports (color:color-mix(in lab,red,red)){.shadow-black\\/20{--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black)20%,transparent)var(--tw-shadow-alpha),transparent)}}.ring-foreground\\/10{--tw-ring-color:var(--color-foreground)}@supports (color:color-mix(in lab,red,red)){.ring-foreground\\/10{--tw-ring-color:color-mix(in oklab,var(--color-foreground)10%,transparent)}}.outline-hidden{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.outline-hidden{outline-offset:2px;outline:2px solid #0000}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-none{transition-property:none}.delay-500{transition-delay:.5s}.duration-100{--tw-duration:.1s;transition-duration:.1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[tenant-alpha\\:getFilePages\\]{tenant-alpha:getFilePages}@media(hover:hover){.group-hover\\:border-primary:is(:where(.group):hover *){border-color:var(--color-primary)}}.group-has-disabled\\/field\\:opacity-50:is(:where(.group\\/field):has(:disabled) *){opacity:.5}.placeholder\\:text-\\[var\\(--local-toolbar-text\\)\\]::placeholder{color:var(--local-toolbar-text)}.placeholder\\:text-muted-foreground::placeholder{color:var(--color-muted-foreground)}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:-inset-x-3:after{content:var(--tw-content);inset-inline:calc(var(--spacing)*-3)}.after\\:-inset-y-2:after{content:var(--tw-content);inset-block:calc(var(--spacing)*-2)}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}@media(hover:hover){.hover\\:bg-\\[var\\(--local-toolbar-hover-bg\\)\\]:hover{background-color:var(--local-toolbar-hover-bg)}.hover\\:bg-card:hover{background-color:var(--color-card)}.hover\\:bg-elevated:hover,.hover\\:bg-elevated\\/70:hover{background-color:var(--color-elevated)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-elevated\\/70:hover{background-color:color-mix(in oklab,var(--color-elevated)70%,transparent)}}.hover\\:bg-muted\\/20:hover{background-color:var(--color-muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/20:hover{background-color:color-mix(in oklab,var(--color-muted)20%,transparent)}}.hover\\:bg-primary-900:hover{background-color:var(--color-primary-900)}.hover\\:pl-1:hover{padding-left:calc(var(--spacing)*1)}.hover\\:text-\\[var\\(--local-primary\\)\\]:hover{color:var(--local-primary)}.hover\\:text-\\[var\\(--local-text\\)\\]:hover{color:var(--local-text)}.hover\\:text-foreground:hover{color:var(--color-foreground)}.hover\\:text-muted-foreground:hover{color:var(--color-muted-foreground)}.hover\\:text-primary-200:hover{color:var(--color-primary-200)}.hover\\:text-primary-light:hover{color:var(--color-primary-light)}.hover\\:opacity-90:hover{opacity:.9}.hover\\:brightness-110:hover{--tw-brightness:brightness(110%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}}.focus\\:border-destructive-ring:focus{border-color:var(--color-destructive-ring)}.focus\\:border-primary:focus{border-color:var(--color-primary)}.focus\\:bg-accent:focus{background-color:var(--color-accent)}.focus\\:text-accent-foreground:focus{color:var(--color-accent-foreground)}.focus\\:ring-1:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-destructive-ring:focus{--tw-ring-color:var(--color-destructive-ring)}.focus\\:ring-primary:focus{--tw-ring-color:var(--color-primary)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}:is(.not-data-\\[variant\\=destructive\\]\\:focus\\:\\*\\*\\:text-accent-foreground:not([data-variant=destructive]):focus *){color:var(--color-accent-foreground)}.focus-visible\\:border-ring:focus-visible{border-color:var(--color-ring)}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-3:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(3px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-\\[var\\(--ring\\)\\]:focus-visible{--tw-ring-color:var(--ring)}.focus-visible\\:ring-ring:focus-visible,.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--color-ring)}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab,var(--color-ring)50%,transparent)}}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color)}.focus-visible\\:ring-offset-\\[var\\(--local-bg\\)\\]:focus-visible{--tw-ring-offset-color:var(--local-bg)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:bg-input\\/50:disabled{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.disabled\\:bg-input\\/50:disabled{background-color:color-mix(in oklab,var(--color-input)50%,transparent)}}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:opacity-50:disabled{opacity:.5}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--color-destructive)}.aria-invalid\\:ring-3[aria-invalid=true]{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(3px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--color-destructive)20%,transparent)}}.aria-invalid\\:aria-checked\\:border-primary[aria-invalid=true][aria-checked=true],.data-checked\\:border-primary[data-checked]{border-color:var(--color-primary)}.data-checked\\:bg-primary[data-checked]{background-color:var(--color-primary)}.data-checked\\:text-primary-foreground[data-checked]{color:var(--color-primary-foreground)}.data-disabled\\:pointer-events-none[data-disabled]{pointer-events:none}.data-disabled\\:opacity-50[data-disabled]{opacity:.5}.data-placeholder\\:text-muted-foreground[data-placeholder]{color:var(--color-muted-foreground)}.data-\\[align-trigger\\=true\\]\\:animate-none[data-align-trigger=true]{animation:none}.data-\\[side\\=bottom\\]\\:translate-y-1[data-side=bottom]{--tw-translate-y:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=left\\]\\:-translate-x-1[data-side=left]{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=right\\]\\:translate-x-1[data-side=right]{--tw-translate-x:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=top\\]\\:-translate-y-1[data-side=top]{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[size\\=default\\]\\:h-8[data-size=default]{height:calc(var(--spacing)*8)}.data-\\[size\\=sm\\]\\:h-7[data-size=sm]{height:calc(var(--spacing)*7)}.data-\\[size\\=sm\\]\\:rounded-\\[min\\(var\\(--radius-md\\)\\,10px\\)\\][data-size=sm]{border-radius:min(var(--radius-md),10px)}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:line-clamp-1>*)[data-slot=select-value]{-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:flex>*)[data-slot=select-value]{display:flex}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:items-center>*)[data-slot=select-value]{align-items:center}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:gap-1\\.5>*)[data-slot=select-value]{gap:calc(var(--spacing)*1.5)}@media(min-width:40rem){.sm\\:inline-flex{display:inline-flex}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}}@media(min-width:48rem){.md\\:order-1{order:1}.md\\:order-2{order:2}.md\\:col-span-9{grid-column:span 9/span 9}.md\\:col-span-11{grid-column:span 11/span 11}.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-20{grid-template-columns:repeat(20,minmax(0,1fr))}.md\\:grid-cols-\\[280px_1fr\\]{grid-template-columns:280px 1fr}.md\\:p-\\[40px_42px\\]{padding:40px 42px}.md\\:text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.md\\:text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}}@media(min-width:64rem){.lg\\:sticky{position:sticky}.lg\\:ml-60{margin-left:calc(var(--spacing)*60)}.lg\\:flex{display:flex}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-\\[1fr_420px\\]{grid-template-columns:1fr 420px}.lg\\:grid-cols-\\[1fr_440px\\]{grid-template-columns:1fr 440px}.lg\\:gap-10{gap:calc(var(--spacing)*10)}.lg\\:self-start{align-self:flex-start}.lg\\:px-12{padding-inline:calc(var(--spacing)*12)}}@media(prefers-color-scheme:dark){.dark\\:bg-input\\/30{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-input\\/30{background-color:color-mix(in oklab,var(--color-input)30%,transparent)}}@media(hover:hover){.dark\\:hover\\:bg-input\\/50:hover{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-input\\/50:hover{background-color:color-mix(in oklab,var(--color-input)50%,transparent)}}}.dark\\:disabled\\:bg-input\\/80:disabled{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:disabled\\:bg-input\\/80:disabled{background-color:color-mix(in oklab,var(--color-input)80%,transparent)}}.dark\\:aria-invalid\\:border-destructive\\/50[aria-invalid=true]{border-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:aria-invalid\\:border-destructive\\/50[aria-invalid=true]{border-color:color-mix(in oklab,var(--color-destructive)50%,transparent)}}.dark\\:aria-invalid\\:ring-destructive\\/40[aria-invalid=true]{--tw-ring-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:aria-invalid\\:ring-destructive\\/40[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--color-destructive)40%,transparent)}}.dark\\:data-checked\\:bg-primary[data-checked]{background-color:var(--color-primary)}}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}:is(.\\*\\:\\[span\\]\\:last\\:flex>*):is(span):last-child{display:flex}:is(.\\*\\:\\[span\\]\\:last\\:items-center>*):is(span):last-child{align-items:center}:is(.\\*\\:\\[span\\]\\:last\\:gap-2>*):is(span):last-child{gap:calc(var(--spacing)*2)}.\\[\\&\\>svg\\]\\:size-3\\.5>svg{width:calc(var(--spacing)*3.5);height:calc(var(--spacing)*3.5)}.font-display{font-family:var(--theme-font-display)}.font-mono-olon{font-family:var(--theme-font-mono)}.tracking-label{letter-spacing:var(--theme-tracking-label)}.tracking-display{letter-spacing:var(--theme-tracking-display)}.container-olon{width:100%;max-width:var(--theme-container-max);margin-left:auto;margin-right:auto;padding-left:1.5rem;padding-right:1.5rem}.section-anchor{scroll-margin-top:calc(var(--theme-header-h) + 24px)}[data-section-id]{position:relative}[data-jp-section-overlay]{pointer-events:none;z-index:9999;background:0 0;border:1px dashed #0000;transition:border-color .15s,background-color .15s;position:absolute;top:0;right:0;bottom:0;left:0}[data-section-id]:hover [data-jp-section-overlay]{border-color:var(--primary-light)}@supports (color:color-mix(in lab,red,red)){[data-section-id]:hover [data-jp-section-overlay]{border-color:color-mix(in srgb,var(--primary-light)75%,transparent)}}[data-section-id]:hover [data-jp-section-overlay]{background-color:var(--primary-900)}@supports (color:color-mix(in lab,red,red)){[data-section-id]:hover [data-jp-section-overlay]{background-color:color-mix(in srgb,var(--primary-900)12%,transparent)}}[data-section-id][data-jp-selected] [data-jp-section-overlay]{border-color:var(--primary-light);background-color:var(--primary-900)}@supports (color:color-mix(in lab,red,red)){[data-section-id][data-jp-selected] [data-jp-section-overlay]{background-color:color-mix(in srgb,var(--primary-900)20%,transparent)}}[data-jp-section-overlay]>div{font-family:var(--theme-font-mono);font-size:var(--theme-text-xs);letter-spacing:var(--theme-tracking-label);text-transform:uppercase;color:var(--primary-light);background:var(--background);position:absolute;top:8px;left:8px}@supports (color:color-mix(in lab,red,red)){[data-jp-section-overlay]>div{background:color-mix(in srgb,var(--background)82%,transparent)}}[data-jp-section-overlay]>div{border:1px solid var(--primary-light)}@supports (color:color-mix(in lab,red,red)){[data-jp-section-overlay]>div{border:1px solid color-mix(in srgb,var(--primary-light)50%,transparent)}}[data-jp-section-overlay]>div{border-radius:var(--theme-radius-sm);opacity:0;padding:2px 8px;transition:opacity .15s,transform .15s;transform:translateY(-2px)}[data-section-id]:hover [data-jp-section-overlay]>div,[data-section-id][data-jp-selected] [data-jp-section-overlay]>div{opacity:1;transform:translateY(0)}.ds-divider{border:none;border-top:.5px solid var(--border);margin:0}.token-label{font-family:var(--theme-font-mono);font-size:var(--theme-text-xs);color:var(--muted-foreground)}.nav-link{font-size:var(--theme-text-sm);color:var(--muted-foreground);border-radius:var(--theme-radius-sm);cursor:pointer;padding:5px 12px;text-decoration:none;transition:color .15s,background-color .15s;display:block}.nav-link:hover{color:var(--foreground);background-color:var(--elevated)}.nav-link.active{color:var(--primary-light);background-color:var(--elevated)}.focus-ring{box-shadow:0 0 0 2px var(--ring);outline:none}.code-inline{font-family:var(--theme-font-mono);background-color:var(--primary-900);color:var(--primary-light);border-radius:var(--theme-radius-sm);padding:1px 6px;font-size:.85em}.surface-base{background-color:var(--background)}.surface-card{background-color:var(--card)}.surface-elevated{background-color:var(--elevated)}.surface-overlay{background-color:var(--overlay)}.surface-destructive{background-color:var(--destructive);color:var(--destructive-foreground);border-color:var(--destructive-border)}.surface-success{background-color:var(--success);color:var(--success-foreground);border-color:var(--success-border)}.surface-warning{background-color:var(--warning);color:var(--warning-foreground);border-color:var(--warning-border)}.surface-info{background-color:var(--info);color:var(--info-foreground);border-color:var(--info-border)}.syntax-keyword{color:var(--primary-400)}.syntax-string{color:var(--primary-200)}.syntax-property{color:var(--accent)}.syntax-variable{color:var(--primary-light)}.syntax-comment{color:var(--muted-foreground)}.syntax-value{color:var(--primary-light)}.hero-media-overlay{background:linear-gradient(to right,var(--background)0%,var(--background)16%,var(--background)34%,var(--background)54%,var(--background)74%,var(--background)100%),linear-gradient(to top,var(--background)0%,var(--background)28%,var(--background)56%)}@supports (color:color-mix(in lab,red,red)){.hero-media-overlay{background:linear-gradient(to right,color-mix(in srgb,var(--background)100%,transparent),color-mix(in srgb,var(--background)82%,transparent)16%,color-mix(in srgb,var(--background)56%,transparent)34%,color-mix(in srgb,var(--background)22%,transparent),color-mix(in srgb,var(--background)6%,transparent)74%,color-mix(in srgb,var(--background)0%,transparent)),linear-gradient(to top,color-mix(in srgb,var(--background)24%,transparent),color-mix(in srgb,var(--background)8%,transparent),color-mix(in srgb,var(--background)0%,transparent)56%)}}.hero-media-portrait{aspect-ratio:3/4;min-height:26rem}@media(min-width:768px){.hero-media-portrait{min-height:34rem}}}:root{--background:var(--theme-colors-background);--card:var(--theme-colors-card);--elevated:var(--theme-colors-elevated);--overlay:var(--theme-colors-overlay);--popover:var(--theme-colors-popover);--popover-foreground:var(--theme-colors-popover-foreground);--foreground:var(--theme-colors-foreground);--card-foreground:var(--theme-colors-card-foreground);--muted-foreground:var(--theme-colors-muted-foreground);--placeholder:var(--theme-colors-placeholder);--primary:var(--theme-colors-primary);--primary-foreground:var(--theme-colors-primary-foreground);--primary-light:var(--theme-colors-primary-light);--primary-dark:var(--theme-colors-primary-dark);--primary-50:var(--theme-colors-primary-50);--primary-100:var(--theme-colors-primary-100);--primary-200:var(--theme-colors-primary-200);--primary-300:var(--theme-colors-primary-300);--primary-400:var(--theme-colors-primary-400);--primary-500:var(--theme-colors-primary-500);--primary-600:var(--theme-colors-primary-600);--primary-700:var(--theme-colors-primary-700);--primary-800:var(--theme-colors-primary-800);--primary-900:var(--theme-colors-primary-900);--accent:var(--theme-colors-accent);--accent-foreground:var(--theme-colors-accent-foreground);--secondary:var(--theme-colors-secondary);--secondary-foreground:var(--theme-colors-secondary-foreground);--muted:var(--theme-colors-muted);--border:var(--theme-colors-border);--border-strong:var(--theme-colors-border-strong);--input:var(--theme-colors-input);--ring:var(--theme-colors-ring);--destructive:var(--theme-colors-destructive);--destructive-foreground:var(--theme-colors-destructive-foreground);--destructive-border:var(--theme-colors-destructive-border);--destructive-ring:var(--theme-colors-destructive-ring);--success:var(--theme-colors-success);--success-foreground:var(--theme-colors-success-foreground);--success-border:var(--theme-colors-success-border);--success-indicator:var(--theme-colors-success-indicator);--warning:var(--theme-colors-warning);--warning-foreground:var(--theme-colors-warning-foreground);--warning-border:var(--theme-colors-warning-border);--info:var(--theme-colors-info);--info-foreground:var(--theme-colors-info-foreground);--info-border:var(--theme-colors-info-border);--theme-radius-xl:var(--theme-border-radius-xl);--theme-radius-full:var(--theme-border-radius-full);--theme-text-xs:var(--theme-typography-scale-xs);--theme-text-sm:var(--theme-typography-scale-sm);--theme-text-base:var(--theme-typography-scale-base);--theme-text-md:var(--theme-typography-scale-md);--theme-text-lg:var(--theme-typography-scale-lg);--theme-text-xl:var(--theme-typography-scale-xl);--theme-text-2xl:var(--theme-typography-scale-2xl);--theme-text-3xl:var(--theme-typography-scale-3xl);--theme-text-4xl:var(--theme-typography-scale-4xl);--theme-text-5xl:var(--theme-typography-scale-5xl);--theme-text-6xl:var(--theme-typography-scale-6xl);--theme-text-7xl:var(--theme-typography-scale-7xl);--theme-tracking-tight:var(--theme-typography-tracking-tight);--theme-tracking-display:var(--theme-typography-tracking-display);--theme-tracking-normal:var(--theme-typography-tracking-normal);--theme-tracking-wide:var(--theme-typography-tracking-wide);--theme-tracking-label:var(--theme-typography-tracking-label);--wordmark-font:var(--theme-typography-wordmark-font-family);--wordmark-tracking:var(--theme-typography-wordmark-tracking);--wordmark-weight:var(--theme-typography-wordmark-weight);--wordmark-width:var(--theme-typography-wordmark-width);--theme-leading-none:var(--theme-typography-leading-none);--theme-leading-tight:var(--theme-typography-leading-tight);--theme-leading-snug:var(--theme-typography-leading-snug);--theme-leading-normal:var(--theme-typography-leading-normal);--theme-leading-relaxed:var(--theme-typography-leading-relaxed);--theme-container-max:var(--theme-spacing-container-max);--theme-section-y:var(--theme-spacing-section-y);--theme-header-h:var(--theme-spacing-header-h);--theme-sidebar-w:var(--theme-spacing-sidebar-w);--z-base:var(--theme-z-index-base);--z-elevated:var(--theme-z-index-elevated);--z-dropdown:var(--theme-z-index-dropdown);--z-sticky:var(--theme-z-index-sticky);--z-overlay:var(--theme-z-index-overlay);--z-modal:var(--theme-z-index-modal);--z-toast:var(--theme-z-index-toast)}.jp-simple-editor .ProseMirror{word-break:break-word;outline:none}.jp-tiptap-content,.jp-simple-editor .ProseMirror{color:var(--foreground);font-family:var(--theme-font-primary);font-size:var(--theme-text-md);line-height:var(--theme-leading-relaxed)}.jp-tiptap-content>*+*,.jp-simple-editor .ProseMirror>*+*{margin-top:.75em}.jp-tiptap-content h1,.jp-simple-editor .ProseMirror h1{font-family:var(--theme-font-display,var(--theme-font-primary));font-size:var(--theme-text-4xl);font-weight:700;line-height:var(--theme-leading-tight);letter-spacing:var(--theme-tracking-display);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}@media(min-width:768px){.jp-tiptap-content h1,.jp-simple-editor .ProseMirror h1{font-size:var(--theme-text-5xl)}}.jp-tiptap-content h2,.jp-simple-editor .ProseMirror h2{font-family:var(--theme-font-display,var(--theme-font-primary));font-size:var(--theme-text-3xl);font-weight:700;line-height:var(--theme-leading-tight);letter-spacing:var(--theme-tracking-tight);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}.jp-tiptap-content h3,.jp-simple-editor .ProseMirror h3{font-size:var(--theme-text-2xl);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}.jp-tiptap-content h4,.jp-simple-editor .ProseMirror h4{font-size:var(--theme-text-xl);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content h5,.jp-simple-editor .ProseMirror h5{font-size:var(--theme-text-lg);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content h6,.jp-simple-editor .ProseMirror h6{font-size:var(--theme-text-md);font-weight:600;line-height:var(--theme-leading-normal);letter-spacing:var(--theme-tracking-wide);color:var(--muted-foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content p,.jp-simple-editor .ProseMirror p{line-height:var(--theme-leading-relaxed)}.jp-tiptap-content strong,.jp-simple-editor .ProseMirror strong{font-weight:700}.jp-tiptap-content em,.jp-simple-editor .ProseMirror em{font-style:italic}.jp-tiptap-content s,.jp-simple-editor .ProseMirror s{text-decoration:line-through}.jp-tiptap-content a,.jp-simple-editor .ProseMirror a{color:var(--primary);text-underline-offset:2px;text-decoration:underline}.jp-tiptap-content a:hover,.jp-simple-editor .ProseMirror a:hover{opacity:.88}.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{font-family:var(--theme-font-mono);font-size:var(--theme-text-sm);background:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{background:color-mix(in srgb,var(--foreground)10%,transparent)}}.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{border-radius:var(--theme-radius-sm);padding:.1em .35em}.jp-tiptap-content pre,.jp-simple-editor .ProseMirror pre{background:var(--elevated);border:1px solid var(--border);border-radius:var(--theme-radius-md);font-size:var(--theme-text-sm);line-height:var(--theme-leading-relaxed);padding:1em 1.25em;overflow-x:auto}.jp-tiptap-content pre code,.jp-simple-editor .ProseMirror pre code{font-size:inherit;background:0 0;padding:0}.jp-tiptap-content ul,.jp-simple-editor .ProseMirror ul{padding-left:1.625em;list-style-type:disc}.jp-tiptap-content ol,.jp-simple-editor .ProseMirror ol{padding-left:1.625em;list-style-type:decimal}.jp-tiptap-content li,.jp-simple-editor .ProseMirror li{line-height:var(--theme-leading-relaxed);margin-top:.25em}.jp-tiptap-content li+li,.jp-simple-editor .ProseMirror li+li{margin-top:.25em}.jp-tiptap-content blockquote,.jp-simple-editor .ProseMirror blockquote{border-left:3px solid var(--border);color:var(--muted-foreground);padding-left:1em;font-style:italic}.jp-tiptap-content hr,.jp-simple-editor .ProseMirror hr{border:none;border-top:1px solid var(--border);margin:1.5em 0}.jp-tiptap-content img,.jp-simple-editor .ProseMirror img{border-radius:var(--theme-radius-md);max-width:100%;height:auto}.jp-simple-editor .ProseMirror img[data-uploading=true]{opacity:.6;filter:grayscale(.25);outline:2px dashed var(--primary)}@supports (color:color-mix(in lab,red,red)){.jp-simple-editor .ProseMirror img[data-uploading=true]{outline:2px dashed color-mix(in srgb,var(--primary)70%,transparent)}}.jp-simple-editor .ProseMirror img[data-uploading=true]{outline-offset:2px}.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline:2px solid var(--destructive)}@supports (color:color-mix(in lab,red,red)){.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline:2px solid color-mix(in srgb,var(--destructive)85%,transparent)}}.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline-offset:2px}.jp-simple-editor .ProseMirror p.is-editor-empty:first-child:before{content:attr(data-placeholder);color:var(--muted-foreground);opacity:.5;pointer-events:none;float:left;height:0}.jp-docs-toc-scroll{scrollbar-width:thin;scrollbar-color:var(--border)transparent}.jp-docs-toc-scroll::-webkit-scrollbar{width:6px}.jp-docs-toc-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:var(--theme-radius-sm)}.jp-docs-toc-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-strong)}.animate-fadeInUp{animation:.6s forwards fadeInUp}.card-hover:hover{transform:translateY(-2px)}.jp-feature-card{background-color:var(--card);border-style:solid;border-width:1px;border-color:var(--border);border-radius:1rem;transition:all .2s}@keyframes fadeInUp{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}[data-theme=light]{--background:var(--theme-modes-light-colors-background);--card:var(--theme-modes-light-colors-card);--elevated:var(--theme-modes-light-colors-elevated);--overlay:var(--theme-modes-light-colors-overlay);--popover:var(--theme-modes-light-colors-popover);--popover-foreground:var(--theme-modes-light-colors-popover-foreground);--foreground:var(--theme-modes-light-colors-foreground);--card-foreground:var(--theme-modes-light-colors-card-foreground);--muted-foreground:var(--theme-modes-light-colors-muted-foreground);--placeholder:var(--theme-modes-light-colors-placeholder);--primary:var(--theme-modes-light-colors-primary);--primary-foreground:var(--theme-modes-light-colors-primary-foreground);--primary-light:var(--theme-modes-light-colors-primary-light);--primary-dark:var(--theme-modes-light-colors-primary-dark);--primary-50:var(--theme-modes-light-colors-primary-50);--primary-100:var(--theme-modes-light-colors-primary-100);--primary-200:var(--theme-modes-light-colors-primary-200);--primary-300:var(--theme-modes-light-colors-primary-300);--primary-400:var(--theme-modes-light-colors-primary-400);--primary-500:var(--theme-modes-light-colors-primary-500);--primary-600:var(--theme-modes-light-colors-primary-600);--primary-700:var(--theme-modes-light-colors-primary-700);--primary-800:var(--theme-modes-light-colors-primary-800);--primary-900:var(--theme-modes-light-colors-primary-900);--accent:var(--theme-modes-light-colors-accent);--accent-foreground:var(--theme-modes-light-colors-accent-foreground);--secondary:var(--theme-modes-light-colors-secondary);--secondary-foreground:var(--theme-modes-light-colors-secondary-foreground);--muted:var(--theme-modes-light-colors-muted);--border:var(--theme-modes-light-colors-border);--border-strong:var(--theme-modes-light-colors-border-strong);--input:var(--theme-modes-light-colors-input);--ring:var(--theme-modes-light-colors-ring);--destructive:var(--theme-modes-light-colors-destructive);--destructive-foreground:var(--theme-modes-light-colors-destructive-foreground);--destructive-border:var(--theme-modes-light-colors-destructive-border);--destructive-ring:var(--theme-modes-light-colors-destructive-ring);--success:var(--theme-modes-light-colors-success);--success-foreground:var(--theme-modes-light-colors-success-foreground);--success-border:var(--theme-modes-light-colors-success-border);--success-indicator:var(--theme-modes-light-colors-success-indicator);--warning:var(--theme-modes-light-colors-warning);--warning-foreground:var(--theme-modes-light-colors-warning-foreground);--warning-border:var(--theme-modes-light-colors-warning-border);--info:var(--theme-modes-light-colors-info);--info-foreground:var(--theme-modes-light-colors-info-foreground);--info-border:var(--theme-modes-light-colors-info-border)}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:"*";inherits:false}@property --tw-gradient-from{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:"*";inherits:false}@property --tw-gradient-via-stops{syntax:"*";inherits:false}@property --tw-gradient-from-position{syntax:"<length-percentage>";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:"<length-percentage>";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:"<length-percentage>";inherits:false;initial-value:100%}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-content{syntax:"*";inherits:false;initial-value:""}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@keyframes pulse{50%{opacity:.5}}`;
const siteConfig = siteData;
const menuConfig = menuData;
const themeConfig = themeData;
const pages = getFilePages();
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeSlug(input) {
  return input.trim().toLowerCase().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
}
function getSortedSlugs() {
  return Object.keys(pages).sort((a, b) => a.localeCompare(b));
}
function resolvePage(slug2) {
  const normalized = normalizeSlug(slug2);
  if (normalized && pages[normalized]) {
    return { slug: normalized, page: pages[normalized] };
  }
  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error("[SSG_CONFIG_ERROR] No pages found under src/data/pages");
  }
  const home2 = slugs.find((item) => item === "home");
  const fallbackSlug = home2 ?? slugs[0];
  return { slug: fallbackSlug, page: pages[fallbackSlug] };
}
function flattenThemeTokens(input, pathSegments = [], out = []) {
  if (typeof input === "string") {
    const cleaned = input.trim();
    if (cleaned.length > 0 && pathSegments.length > 0) {
      out.push({ name: `--theme-${pathSegments.join("-")}`, value: cleaned });
    }
    return out;
  }
  if (!isRecord(input)) return out;
  const entries = Object.entries(input).sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of entries) {
    flattenThemeTokens(value, [...pathSegments, key], out);
  }
  return out;
}
function buildThemeCssFromSot(theme) {
  const root = isRecord(theme) ? theme : {};
  const tokens2 = root["tokens"];
  const flattened = flattenThemeTokens(tokens2);
  if (flattened.length === 0) return "";
  const serialized = flattened.map((item) => `${item.name}:${item.value}`).join(";");
  return `:root{${serialized}}`;
}
function resolveTenantId() {
  const site = isRecord(siteConfig) ? siteConfig : {};
  const identityRaw = site["identity"];
  const identity2 = isRecord(identityRaw) ? identityRaw : {};
  const titleRaw = typeof identity2.title === "string" ? identity2.title : "";
  const title = titleRaw.trim();
  if (title.length > 0) {
    const normalized = title.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    if (normalized.length > 0) return normalized;
  }
  const slugs = getSortedSlugs();
  if (slugs.length === 0) {
    throw new Error("[SSG_CONFIG_ERROR] Cannot resolve tenantId without site.identity.title or pages");
  }
  return slugs[0].replace(/\//g, "-");
}
function render(slug2) {
  const resolved = resolvePage(slug2);
  const location2 = resolved.slug === "home" ? "/" : `/${resolved.slug}`;
  return renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: location2, children: /* @__PURE__ */ jsx(
      Cd,
      {
        config: {
          registry: ComponentRegistry,
          schemas: SECTION_SCHEMAS,
          tenantId: resolveTenantId()
        },
        children: /* @__PURE__ */ jsx(Ho, { mode: "visitor", children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(Ka, { pageConfig: resolved.page, siteConfig, menuConfig }) }) })
      }
    ) })
  );
}
function getCss() {
  const themeCss = buildThemeCssFromSot(themeConfig);
  if (!themeCss) return tenantCss;
  return `${themeCss}
${tenantCss}`;
}
function getPageMeta(slug2) {
  const resolved = resolvePage(slug2);
  const rawMeta = isRecord(resolved.page.meta) ? resolved.page.meta : {};
  const title = typeof rawMeta.title === "string" ? rawMeta.title : resolved.slug;
  const description = typeof rawMeta.description === "string" ? rawMeta.description : "";
  return { title, description };
}
export {
  getCss,
  getPageMeta,
  render
};
