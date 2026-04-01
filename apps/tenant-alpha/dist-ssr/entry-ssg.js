import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import * as g from "react";
import g__default, { createContext, forwardRef, createElement, useLayoutEffect, useState, useEffect, useRef, useContext, Component, useMemo } from "react";
import * as Pn from "react-dom";
import Pn__default from "react-dom";
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
function Ul(e, t) {
  return t.header != null && e["global-header"] !== false;
}
const Ee = {
  INLINE_FIELD_UPDATE: "jsonpages:inline-field-update",
  REQUEST_INLINE_FLUSH: "jsonpages:request-inline-flush"
};
function Ba(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = Ba(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function Bl() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = Ba(e)) && (n && (n += " "), n += t);
  return n;
}
const Hl = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, Vl = (e, t) => ({
  classGroupId: e,
  validator: t
}), Ha = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), mn = "-", Oi = [], Kl = "arbitrary..", Yl = (e) => {
  const t = ql(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return Gl(a);
      const s = a.split(mn), c = s[0] === "" && s.length > 1 ? 1 : 0;
      return Va(s, c, t);
    },
    getConflictingClassGroupIds: (a, s) => {
      if (s) {
        const c = n[a], d = r[a];
        return c ? d ? Hl(d, c) : c : d || Oi;
      }
      return r[a] || Oi;
    }
  };
}, Va = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], i = r.nextPart.get(o);
  if (i) {
    const d = Va(e, t + 1, i);
    if (d) return d;
  }
  const a = r.validators;
  if (a === null)
    return;
  const s = t === 0 ? e.join(mn) : e.slice(t).join(mn), c = a.length;
  for (let d = 0; d < c; d++) {
    const u = a[d];
    if (u.validator(s))
      return u.classGroupId;
  }
}, Gl = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? Kl + n : void 0;
})(), ql = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return Xl(r, t);
}, Xl = (e, t) => {
  const r = Ha();
  for (const n in e) {
    const o = e[n];
    Zo(o, r, n, t);
  }
  return r;
}, Zo = (e, t, r, n) => {
  const o = e.length;
  for (let i = 0; i < o; i++) {
    const a = e[i];
    Jl(a, t, r, n);
  }
}, Jl = (e, t, r, n) => {
  if (typeof e == "string") {
    Zl(e, t, r);
    return;
  }
  if (typeof e == "function") {
    Ql(e, t, r, n);
    return;
  }
  ed(e, t, r, n);
}, Zl = (e, t, r) => {
  const n = e === "" ? t : Ka(t, e);
  n.classGroupId = r;
}, Ql = (e, t, r, n) => {
  if (td(e)) {
    Zo(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Vl(r, e));
}, ed = (e, t, r, n) => {
  const o = Object.entries(e), i = o.length;
  for (let a = 0; a < i; a++) {
    const [s, c] = o[a];
    Zo(c, Ka(t, s), r, n);
  }
}, Ka = (e, t) => {
  let r = e;
  const n = t.split(mn), o = n.length;
  for (let i = 0; i < o; i++) {
    const a = n[i];
    let s = r.nextPart.get(a);
    s || (s = Ha(), r.nextPart.set(a, s)), r = s;
  }
  return r;
}, td = (e) => "isThemeGetter" in e && e.isThemeGetter === true, rd = (e) => {
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
}, To = "!", Ii = ":", nd = [], Di = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), od = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const i = [];
    let a = 0, s = 0, c = 0, d;
    const u = o.length;
    for (let m = 0; m < u; m++) {
      const b = o[m];
      if (a === 0 && s === 0) {
        if (b === Ii) {
          i.push(o.slice(c, m)), c = m + 1;
          continue;
        }
        if (b === "/") {
          d = m;
          continue;
        }
      }
      b === "[" ? a++ : b === "]" ? a-- : b === "(" ? s++ : b === ")" && s--;
    }
    const f = i.length === 0 ? o : o.slice(c);
    let h = f, p = false;
    f.endsWith(To) ? (h = f.slice(0, -1), p = true) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      f.startsWith(To) && (h = f.slice(1), p = true)
    );
    const x = d && d > c ? d - c : void 0;
    return Di(i, p, h, x);
  };
  if (t) {
    const o = t + Ii, i = n;
    n = (a) => a.startsWith(o) ? i(a.slice(o.length)) : Di(nd, false, a, void 0, true);
  }
  if (r) {
    const o = n;
    n = (i) => r({
      className: i,
      parseClassName: o
    });
  }
  return n;
}, id$6 = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, n) => {
    t.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let o = [];
    for (let i = 0; i < r.length; i++) {
      const a = r[i], s = a[0] === "[", c = t.has(a);
      s || c ? (o.length > 0 && (o.sort(), n.push(...o), o = []), n.push(a)) : o.push(a);
    }
    return o.length > 0 && (o.sort(), n.push(...o)), n;
  };
}, ad = (e) => ({
  cache: rd(e.cacheSize),
  parseClassName: od(e),
  sortModifiers: id$6(e),
  ...Yl(e)
}), sd = /\s+/, cd = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: i
  } = t, a = [], s = e.trim().split(sd);
  let c = "";
  for (let d = s.length - 1; d >= 0; d -= 1) {
    const u = s[d], {
      isExternal: f,
      modifiers: h,
      hasImportantModifier: p,
      baseClassName: x,
      maybePostfixModifierPosition: m
    } = r(u);
    if (f) {
      c = u + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!m, w = n(b ? x.substring(0, m) : x);
    if (!w) {
      if (!b) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (w = n(x), !w) {
        c = u + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = false;
    }
    const y = h.length === 0 ? "" : h.length === 1 ? h[0] : i(h).join(":"), v = p ? y + To : y, k = v + w;
    if (a.indexOf(k) > -1)
      continue;
    a.push(k);
    const C = o(w, b);
    for (let E = 0; E < C.length; ++E) {
      const j = C[E];
      a.push(v + j);
    }
    c = u + (c.length > 0 ? " " + c : c);
  }
  return c;
}, ld = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Ya(r)) && (o && (o += " "), o += n);
  return o;
}, Ya = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Ya(e[n])) && (r && (r += " "), r += t);
  return r;
}, dd = (e, ...t) => {
  let r, n, o, i;
  const a = (c) => {
    const d = t.reduce((u, f) => f(u), e());
    return r = ad(d), n = r.cache.get, o = r.cache.set, i = s, s(c);
  }, s = (c) => {
    const d = n(c);
    if (d)
      return d;
    const u = cd(c, r);
    return o(c, u), u;
  };
  return i = a, (...c) => i(ld(...c));
}, ud = [], Oe = (e) => {
  const t = (r) => r[e] || ud;
  return t.isThemeGetter = true, t;
}, Ga = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, qa = /^\((?:(\w[\w-]*):)?(.+)\)$/i, fd = /^\d+\/\d+$/, pd = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, hd = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, md = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, gd = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, bd = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Bt = (e) => fd.test(e), ce = (e) => !!e && !Number.isNaN(Number(e)), Et = (e) => !!e && Number.isInteger(Number(e)), no = (e) => e.endsWith("%") && ce(e.slice(0, -1)), vt = (e) => pd.test(e), vd = () => true, xd = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  hd.test(e) && !md.test(e)
), Xa = () => false, wd = (e) => gd.test(e), yd = (e) => bd.test(e), kd = (e) => !H(e) && !V(e), Cd = (e) => ir(e, Qa, Xa), H = (e) => Ga.test(e), Dt = (e) => ir(e, es, xd), oo = (e) => ir(e, Rd, ce), Mi = (e) => ir(e, Ja, Xa), Sd = (e) => ir(e, Za, yd), Gr = (e) => ir(e, ts, wd), V = (e) => qa.test(e), vr = (e) => ar(e, es), Ed = (e) => ar(e, Td), _i = (e) => ar(e, Ja), jd = (e) => ar(e, Qa), Nd = (e) => ar(e, Za), qr = (e) => ar(e, ts, true), ir = (e, t, r) => {
  const n = Ga.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : false;
}, ar = (e, t, r = false) => {
  const n = qa.exec(e);
  return n ? n[1] ? t(n[1]) : r : false;
}, Ja = (e) => e === "position" || e === "percentage", Za = (e) => e === "image" || e === "url", Qa = (e) => e === "length" || e === "size" || e === "bg-size", es = (e) => e === "length", Rd = (e) => e === "number", Td = (e) => e === "family-name", ts = (e) => e === "shadow", Ad = () => {
  const e = Oe("color"), t = Oe("font"), r = Oe("text"), n = Oe("font-weight"), o = Oe("tracking"), i = Oe("leading"), a = Oe("breakpoint"), s = Oe("container"), c = Oe("spacing"), d = Oe("radius"), u = Oe("shadow"), f = Oe("inset-shadow"), h = Oe("text-shadow"), p = Oe("drop-shadow"), x = Oe("blur"), m = Oe("perspective"), b = Oe("aspect"), w = Oe("ease"), y = Oe("animate"), v = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], k = () => [
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
  ], C = () => [...k(), V, H], E = () => ["auto", "hidden", "clip", "visible", "scroll"], j = () => ["auto", "contain", "none"], S = () => [V, H, c], O = () => [Bt, "full", "auto", ...S()], M = () => [Et, "none", "subgrid", V, H], P = () => ["auto", {
    span: ["full", Et, V, H]
  }, Et, V, H], _ = () => [Et, "auto", V, H], D = () => ["auto", "min", "max", "fr", V, H], K = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], U = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], $ = () => ["auto", ...S()], W = () => [Bt, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...S()], R = () => [e, V, H], q = () => [...k(), _i, Mi, {
    position: [V, H]
  }], ne = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], N = () => ["auto", "cover", "contain", jd, Cd, {
    size: [V, H]
  }], L = () => [no, vr, Dt], G = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    d,
    V,
    H
  ], B = () => ["", ce, vr, Dt], xe = () => ["solid", "dashed", "dotted", "double"], se = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], z2 = () => [ce, no, _i, Mi], J = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    x,
    V,
    H
  ], te = () => ["none", ce, V, H], F = () => ["none", ce, V, H], oe = () => [ce, V, H], Q = () => [Bt, "full", ...S()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [vt],
      breakpoint: [vt],
      color: [vd],
      container: [vt],
      "drop-shadow": [vt],
      ease: ["in", "out", "in-out"],
      font: [kd],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [vt],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [vt],
      shadow: [vt],
      spacing: ["px", ce],
      text: [vt],
      "text-shadow": [vt],
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
        aspect: ["auto", "square", Bt, H, V, b]
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
        columns: [ce, H, V, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": v()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": v()
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
        object: C()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: E()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": E()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": E()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: j()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": j()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": j()
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
        inset: O()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": O()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": O()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: O()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: O()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: O()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: O()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: O()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: O()
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
        z: [Et, "auto", V, H]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Bt, "full", "auto", s, ...S()]
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
        flex: [ce, Bt, "auto", "initial", "none", H]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", ce, V, H]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", ce, V, H]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Et, "first", "last", "none", V, H]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": M()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: P()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": _()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": _()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": M()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: P()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": _()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": _()
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
        "auto-cols": D()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": D()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: S()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": S()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": S()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...K(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...U(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...U()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...K()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...U(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...U(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": K()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...U(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...U()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: S()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: S()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: S()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: S()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: S()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: S()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: S()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: S()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: S()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: $()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: $()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: $()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: $()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: $()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: $()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: $()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: $()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: $()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": S()
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
        "space-y": S()
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
        text: ["base", r, vr, Dt]
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
        font: [n, V, oo]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", no, H]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Ed, H, t]
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
        tracking: [o, V, H]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [ce, "none", V, oo]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ...S()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", V, H]
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
        list: ["disc", "decimal", "none", V, H]
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
        placeholder: R()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: R()
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
        decoration: [...xe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [ce, "from-font", "auto", V, Dt]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: R()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [ce, "auto", V, H]
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
        indent: S()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", V, H]
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
        content: ["none", V, H]
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
        bg: q()
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
        bg: N()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Et, V, H],
          radial: ["", V, H],
          conic: [Et, V, H]
        }, Nd, Sd]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: R()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: L()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: L()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: L()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: R()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: R()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: R()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: G()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": G()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": G()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": G()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": G()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": G()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": G()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": G()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": G()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": G()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": G()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": G()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": G()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": G()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": G()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: B()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": B()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": B()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": B()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": B()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": B()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": B()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": B()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": B()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": B()
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
        "divide-y": B()
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
        border: [...xe(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...xe(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: R()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": R()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": R()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": R()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": R()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": R()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": R()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": R()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": R()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: R()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...xe(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [ce, V, H]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", ce, vr, Dt]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: R()
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
          u,
          qr,
          Gr
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: R()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", f, qr, Gr]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": R()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: B()
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
        ring: R()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [ce, Dt]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": R()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": B()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": R()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", h, qr, Gr]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": R()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ce, V, H]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...se(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": se()
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
        "mask-linear": [ce]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": z2()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": z2()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": R()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": R()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": z2()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": z2()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": R()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": R()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": z2()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": z2()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": R()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": R()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": z2()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": z2()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": R()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": R()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": z2()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": z2()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": R()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": R()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": z2()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": z2()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": R()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": R()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": z2()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": z2()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": R()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": R()
      }],
      "mask-image-radial": [{
        "mask-radial": [V, H]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": z2()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": z2()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": R()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": R()
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
        "mask-radial-at": k()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [ce]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": z2()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": z2()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": R()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": R()
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
        mask: q()
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
        mask: N()
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
        mask: ["none", V, H]
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
          V,
          H
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: J()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [ce, V, H]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [ce, V, H]
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
          p,
          qr,
          Gr
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": R()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", ce, V, H]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [ce, V, H]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", ce, V, H]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [ce, V, H]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", ce, V, H]
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
          V,
          H
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": J()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [ce, V, H]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [ce, V, H]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", ce, V, H]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [ce, V, H]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", ce, V, H]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ce, V, H]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [ce, V, H]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", ce, V, H]
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
        "border-spacing": S()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": S()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": S()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", V, H]
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
        duration: [ce, "initial", V, H]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", w, V, H]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [ce, V, H]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", y, V, H]
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
        perspective: [m, V, H]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": C()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: te()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": te()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": te()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": te()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: F()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": F()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": F()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": F()
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
        skew: oe()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": oe()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": oe()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [V, H, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: C()
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
        translate: Q()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Q()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Q()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Q()
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
        accent: R()
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
        caret: R()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", V, H]
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
        "scroll-m": S()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": S()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": S()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": S()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": S()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": S()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": S()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": S()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": S()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": S()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": S()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": S()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": S()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": S()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": S()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": S()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": S()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": S()
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
        "will-change": ["auto", "scroll", "contents", "transform", V, H]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...R()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [ce, vr, Dt, oo]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...R()]
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
}, zd = /* @__PURE__ */ dd(Ad);
function ae(...e) {
  return zd(Bl(e));
}
var Xr = { exports: {} }, xr = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Li;
function Pd() {
  if (Li) return xr;
  Li = 1;
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
  return xr.Fragment = t, xr.jsx = r, xr.jsxs = r, xr;
}
var wr = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $i;
function Od() {
  return $i || ($i = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(N) {
      if (N == null) return null;
      if (typeof N == "function")
        return N.$$typeof === P ? null : N.displayName || N.name || null;
      if (typeof N == "string") return N;
      switch (N) {
        case b:
          return "Fragment";
        case y:
          return "Profiler";
        case w:
          return "StrictMode";
        case E:
          return "Suspense";
        case j:
          return "SuspenseList";
        case M:
          return "Activity";
      }
      if (typeof N == "object")
        switch (typeof N.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), N.$$typeof) {
          case m:
            return "Portal";
          case k:
            return N.displayName || "Context";
          case v:
            return (N._context.displayName || "Context") + ".Consumer";
          case C:
            var L = N.render;
            return N = N.displayName, N || (N = L.displayName || L.name || "", N = N !== "" ? "ForwardRef(" + N + ")" : "ForwardRef"), N;
          case S:
            return L = N.displayName || null, L !== null ? L : e(N.type) || "Memo";
          case O:
            L = N._payload, N = N._init;
            try {
              return e(N(L));
            } catch {
            }
        }
      return null;
    }
    function t(N) {
      return "" + N;
    }
    function r(N) {
      try {
        t(N);
        var L = false;
      } catch {
        L = true;
      }
      if (L) {
        L = console;
        var G = L.error, B = typeof Symbol == "function" && Symbol.toStringTag && N[Symbol.toStringTag] || N.constructor.name || "Object";
        return G.call(
          L,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          B
        ), t(N);
      }
    }
    function n(N) {
      if (N === b) return "<>";
      if (typeof N == "object" && N !== null && N.$$typeof === O)
        return "<...>";
      try {
        var L = e(N);
        return L ? "<" + L + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function o() {
      var N = _.A;
      return N === null ? null : N.getOwner();
    }
    function i() {
      return Error("react-stack-top-frame");
    }
    function a(N) {
      if (D.call(N, "key")) {
        var L = Object.getOwnPropertyDescriptor(N, "key").get;
        if (L && L.isReactWarning) return false;
      }
      return N.key !== void 0;
    }
    function s(N, L) {
      function G() {
        $ || ($ = true, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          L
        ));
      }
      G.isReactWarning = true, Object.defineProperty(N, "key", {
        get: G,
        configurable: true
      });
    }
    function c() {
      var N = e(this.type);
      return W[N] || (W[N] = true, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), N = this.props.ref, N !== void 0 ? N : null;
    }
    function d(N, L, G, B, xe, se) {
      var z2 = G.ref;
      return N = {
        $$typeof: x,
        type: N,
        key: L,
        props: G,
        _owner: B
      }, (z2 !== void 0 ? z2 : null) !== null ? Object.defineProperty(N, "ref", {
        enumerable: false,
        get: c
      }) : Object.defineProperty(N, "ref", { enumerable: false, value: null }), N._store = {}, Object.defineProperty(N._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      }), Object.defineProperty(N, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      }), Object.defineProperty(N, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: xe
      }), Object.defineProperty(N, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: se
      }), Object.freeze && (Object.freeze(N.props), Object.freeze(N)), N;
    }
    function u(N, L, G, B, xe, se) {
      var z2 = L.children;
      if (z2 !== void 0)
        if (B)
          if (K(z2)) {
            for (B = 0; B < z2.length; B++)
              f(z2[B]);
            Object.freeze && Object.freeze(z2);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else f(z2);
      if (D.call(L, "key")) {
        z2 = e(N);
        var J = Object.keys(L).filter(function(F) {
          return F !== "key";
        });
        B = 0 < J.length ? "{key: someKey, " + J.join(": ..., ") + ": ...}" : "{key: someKey}", ne[z2 + B] || (J = 0 < J.length ? "{" + J.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          B,
          z2,
          J,
          z2
        ), ne[z2 + B] = true);
      }
      if (z2 = null, G !== void 0 && (r(G), z2 = "" + G), a(L) && (r(L.key), z2 = "" + L.key), "key" in L) {
        G = {};
        for (var te in L)
          te !== "key" && (G[te] = L[te]);
      } else G = L;
      return z2 && s(
        G,
        typeof N == "function" ? N.displayName || N.name || "Unknown" : N
      ), d(
        N,
        z2,
        G,
        o(),
        xe,
        se
      );
    }
    function f(N) {
      h(N) ? N._store && (N._store.validated = 1) : typeof N == "object" && N !== null && N.$$typeof === O && (N._payload.status === "fulfilled" ? h(N._payload.value) && N._payload.value._store && (N._payload.value._store.validated = 1) : N._store && (N._store.validated = 1));
    }
    function h(N) {
      return typeof N == "object" && N !== null && N.$$typeof === x;
    }
    var p = g__default, x = Symbol.for("react.transitional.element"), m = Symbol.for("react.portal"), b = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), v = Symbol.for("react.consumer"), k = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), j = Symbol.for("react.suspense_list"), S = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), M = Symbol.for("react.activity"), P = Symbol.for("react.client.reference"), _ = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = Object.prototype.hasOwnProperty, K = Array.isArray, U = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(N) {
        return N();
      }
    };
    var $, W = {}, R = p.react_stack_bottom_frame.bind(
      p,
      i
    )(), q = U(n(i)), ne = {};
    wr.Fragment = b, wr.jsx = function(N, L, G) {
      var B = 1e4 > _.recentlyCreatedOwnerStacks++;
      return u(
        N,
        L,
        G,
        false,
        B ? Error("react-stack-top-frame") : R,
        B ? U(n(N)) : q
      );
    }, wr.jsxs = function(N, L, G) {
      var B = 1e4 > _.recentlyCreatedOwnerStacks++;
      return u(
        N,
        L,
        G,
        true,
        B ? Error("react-stack-top-frame") : R,
        B ? U(n(N)) : q
      );
    };
  })()), wr;
}
var Fi;
function Id() {
  return Fi || (Fi = 1, process.env.NODE_ENV === "production" ? Xr.exports = Pd() : Xr.exports = Od()), Xr.exports;
}
var l = Id();
const rs = createContext(void 0), Dd = ({
  config: e,
  children: t
}) => /* @__PURE__ */ l.jsx(
  rs.Provider,
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
function On() {
  const e = useContext(rs);
  if (e === void 0)
    throw new Error("useConfig must be used within ConfigProvider");
  return e;
}
const ns = createContext(void 0), Qo = ({ mode: e, children: t }) => (useEffect(() => {
  if (e !== "studio") return;
  const r = new MutationObserver((n) => {
    n.forEach((o) => {
      o.addedNodes.forEach((i) => {
        i instanceof HTMLElement && i.hasAttribute("data-radix-portal") && i.setAttribute("data-jp-studio-portal", "true");
      });
    });
  });
  return r.observe(document.body, { childList: true }), () => r.disconnect();
}, [e]), /* @__PURE__ */ l.jsx(ns.Provider, { value: { mode: e }, children: t })), Md = () => {
  const e = useContext(ns);
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
const _d = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), os = (...e) => e.filter((t, r, n) => !!t && t.trim() !== "" && n.indexOf(t) === r).join(" ").trim();
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Ld = {
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
const $d = forwardRef(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: n,
    className: o = "",
    children: i,
    iconNode: a,
    ...s
  }, c) => createElement(
    "svg",
    {
      ref: c,
      ...Ld,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: n ? Number(r) * 24 / Number(t) : r,
      className: os("lucide", o),
      ...s
    },
    [
      ...a.map(([d, u]) => createElement(d, u)),
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
const we = (e, t) => {
  const r = forwardRef(
    ({ className: n, ...o }, i) => createElement($d, {
      ref: i,
      iconNode: t,
      className: os(`lucide-${_d(e)}`, n),
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
const Fd = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
we("ArrowDown", Fd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ud = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
we("ArrowRight", Ud);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hd = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
we("ArrowUp", Hd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kd = [
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
we("Box", Kd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gd = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], ei = we("Check", Gd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qd = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]], In = we("ChevronDown", qd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xd = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
we("ChevronRight", Xd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zd = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]], ti = we("ChevronUp", Zd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qd = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
we("CircleAlert", Qd);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tu = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
we("FileText", tu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nu = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }]
];
we("Github", nu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const iu = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
we("GripVertical", iu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const au = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
we("Image", au);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const su = [
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
we("Layers", su);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cu = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
we("Link2", cu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lu = [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
];
we("Menu", lu);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
we("Pencil", uu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pu = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
we("Plus", pu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hu = [
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
we("Save", hu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mu = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
];
we("Search", mu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bu = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
we("Settings", bu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xu = [
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
we("Sparkles", xu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yu = [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
];
we("Terminal", yu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cu = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
we("Trash2", Cu);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
], Eu = we("TriangleAlert", Su);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ju = [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
];
we("Upload", ju);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nu = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
we("X", Nu);
/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ru = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
we("Zap", Ru);
class Au extends Component {
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
    return this.state.hasError ? /* @__PURE__ */ l.jsxs("div", { className: "p-8 m-4 bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-xl flex flex-col items-center text-center gap-3", children: [
      /* @__PURE__ */ l.jsx(Eu, { className: "text-amber-500", size: 32 }),
      /* @__PURE__ */ l.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ l.jsx("h4", { className: "text-sm font-bold text-amber-200 uppercase tracking-tight", children: "Component Error" }),
        /* @__PURE__ */ l.jsxs("p", { className: "text-xs text-amber-500/70 font-mono", children: [
          "Type: ",
          this.props.type
        ] })
      ] }),
      /* @__PURE__ */ l.jsx("p", { className: "text-xs text-zinc-400 max-w-[280px] leading-relaxed", children: "This section failed to render. Check the console for details or verify the JSON data structure." })
    ] }) : this.props.children;
  }
}
const zu = ({ type: e, scope: t, isSelected: r, sectionId: n, sectionIndex: o = 0, totalSections: i = 0, onReorder: a }) => {
  const s = typeof o == "number" && o > 0 && a, c = typeof o == "number" && o < i - 1 && a;
  return /* @__PURE__ */ l.jsx(
    "div",
    {
      "data-jp-section-overlay": true,
      "aria-hidden": true,
      className: ae(
        "absolute inset-0 pointer-events-none transition-all duration-200 z-[50]",
        "border-2 border-transparent group-hover:border-blue-400/50 group-hover:border-dashed",
        r && "border-2 border-blue-600 border-solid bg-blue-500/5"
      ),
      children: /* @__PURE__ */ l.jsxs(
        "div",
        {
          className: ae(
            "absolute top-0 right-0 flex flex-nowrap items-center gap-1 pl-1 pr-2 py-1 text-[9px] font-black uppercase tracking-widest transition-opacity pointer-events-auto",
            "bg-blue-600 text-white",
            r || "group-hover:opacity-100 opacity-0"
          ),
          children: [
            a && n != null && /* @__PURE__ */ l.jsxs("span", { className: "shrink-0 flex items-center gap-0.5", children: [
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  onClick: (d) => {
                    d.stopPropagation(), s && a(n, o - 1);
                  },
                  disabled: !s,
                  className: "inline-flex items-center justify-center min-w-[18px] min-h-[18px] rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none",
                  title: "Move section up",
                  "aria-label": "Move section up",
                  children: /* @__PURE__ */ l.jsx(ti, { size: 12, strokeWidth: 2.5 })
                }
              ),
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  onClick: (d) => {
                    d.stopPropagation(), c && a(n, o + 2);
                  },
                  disabled: !c,
                  className: "inline-flex items-center justify-center min-w-[18px] min-h-[18px] rounded bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none",
                  title: "Move section down",
                  "aria-label": "Move section down",
                  children: /* @__PURE__ */ l.jsx(In, { size: 12, strokeWidth: 2.5 })
                }
              )
            ] }),
            /* @__PURE__ */ l.jsx("span", { className: "shrink-0", children: e }),
            /* @__PURE__ */ l.jsx("span", { className: "opacity-50 shrink-0", children: "|" }),
            /* @__PURE__ */ l.jsx("span", { className: "shrink-0", children: t })
          ]
        }
      )
    }
  );
}, Jr = ({
  section: e,
  menu: t,
  selectedId: r,
  reorderable: n,
  sectionIndex: o,
  totalSections: i,
  onReorder: a
}) => {
  var y, v;
  const { mode: s } = Md(), { registry: c, overlayDisabledSectionTypes: d } = On(), u = s === "studio", f = u && r === e.id, h = c[e.type], p = e.type === "header" || e.type === "footer" ? "global" : "local", x = Array.isArray(d) ? d.includes(e.type) : false, m = e.type === "header" && ((y = e.settings) == null ? void 0 : y.sticky);
  if (!h)
    return /* @__PURE__ */ l.jsxs("div", { className: "p-6 m-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-mono", children: [
      /* @__PURE__ */ l.jsx("strong", { children: "Missing Component:" }),
      " ",
      e.type
    ] });
  const b = () => {
    const k = h;
    return e.type === "header" && t ? /* @__PURE__ */ l.jsx(k, { data: e.data, settings: e.settings, menu: t }) : /* @__PURE__ */ l.jsx(k, { data: e.data, settings: e.settings });
  }, w = (v = e.data) == null ? void 0 : v.anchorId;
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      id: w || void 0,
      "data-section-id": u ? e.id : void 0,
      "data-section-type": u ? e.type : void 0,
      "data-section-scope": u ? p : void 0,
      ...u && f ? { "data-jp-selected": true } : {},
      className: ae(
        "relative w-full",
        u && !x && "group cursor-pointer",
        u && m ? "sticky top-0 z-[60]" : e.type === "header" ? "relative" : "relative z-0",
        f && "z-[70]"
      ),
      children: [
        /* @__PURE__ */ l.jsx("div", { className: e.type === "header" ? "relative" : "relative z-0", children: /* @__PURE__ */ l.jsx(Au, { type: e.type, children: b() }) }),
        u && !x && /* @__PURE__ */ l.jsx(
          zu,
          {
            type: e.type,
            scope: p,
            isSelected: !!f,
            sectionId: n && p === "local" ? e.id : void 0,
            sectionIndex: n && p === "local" ? o : void 0,
            totalSections: n && p === "local" ? i : void 0,
            onReorder: n && p === "local" ? a : void 0
          }
        )
      ]
    }
  );
}, Pu = (e) => {
  useEffect(() => {
    document.title = e.title;
    let t = document.querySelector('meta[name="description"]');
    t || (t = document.createElement("meta"), t.setAttribute("name", "description"), document.head.appendChild(t)), t.setAttribute("content", e.description);
  }, [e.title, e.description]);
};
function Mr(e) {
  return typeof e == "object" && e !== null;
}
function dn(e) {
  if (!Mr(e)) return false;
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || t === null;
}
function Ou(e) {
  return Mr(e) && typeof e.$ref == "string" && e.$ref.trim().length > 0;
}
function Iu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function Bi(e, t) {
  if (!t || t === "#") return e;
  const r = t.startsWith("#") ? t.slice(1) : t;
  if (!r || r === "/") return e;
  let n = e;
  for (const o of r.replace(/^\//, "").split("/")) {
    const i = Iu(o);
    if (Array.isArray(n)) {
      const a = Number(i);
      if (!Number.isInteger(a) || a < 0 || a >= n.length) return;
      n = n[a];
      continue;
    }
    if (!Mr(n) || !(i in n)) return;
    n = n[i];
  }
  return n;
}
function er(e) {
  const n = e.trim().replace(/\\/g, "/").replace(/^\/+/, "").split("/"), o = [];
  for (const i of n)
    if (!(!i || i === ".")) {
      if (i === "..") {
        o.length > 0 && o.pop();
        continue;
      }
      o.push(i);
    }
  return o.join("/");
}
function Du(e) {
  const t = er(e), r = t.lastIndexOf("/");
  return r === -1 ? "" : t.slice(0, r);
}
function Mu(e, t) {
  const r = /* @__PURE__ */ new Set(), n = er(e);
  n && r.add(n);
  const o = Du(t), i = er(o ? `${o}/${e}` : e);
  return i && r.add(i), Array.from(r);
}
function Sr(e) {
  return Array.isArray(e) ? e.map((t) => Sr(t)) : dn(e) ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [t, Sr(r)])
  ) : e;
}
function yr(e, t, r) {
  for (const n of t) {
    const o = er(n);
    o && e.set(o, r);
  }
}
function _u({
  pages: e,
  siteConfig: t,
  themeConfig: r,
  menuConfig: n,
  refDocuments: o
}) {
  const i = /* @__PURE__ */ new Map();
  yr(i, [
    "site.json",
    "config/site.json",
    "src/data/config/site.json"
  ], t), yr(i, [
    "theme.json",
    "config/theme.json",
    "src/data/config/theme.json"
  ], r), yr(i, [
    "menu.json",
    "config/menu.json",
    "src/data/config/menu.json"
  ], n);
  for (const [a, s] of Object.entries(e)) {
    const c = a.replace(/^\/+|\/+$/g, "") || "home";
    yr(i, [
      `pages/${c}.json`,
      `src/data/pages/${c}.json`
    ], s);
  }
  for (const [a, s] of Object.entries(o ?? {}))
    yr(i, [a], s);
  return i;
}
function Lu(e, t, r) {
  const [n, o = ""] = e.split("#"), i = o ? `/${o.replace(/^\//, "")}` : "";
  if (!n) {
    const a = er(t), s = r.documents.get(a);
    if (s === void 0) return null;
    const c = Bi(s, i);
    return c === void 0 ? null : { value: c, documentPath: a };
  }
  for (const a of Mu(n, t)) {
    const s = r.documents.get(a);
    if (s === void 0) continue;
    const c = Bi(s, i);
    if (c !== void 0)
      return { value: c, documentPath: a };
  }
  return null;
}
function Mt(e, t, r) {
  if (Array.isArray(e))
    return e.map((n) => Mt(n, t, r));
  if (!dn(e))
    return e;
  if (Ou(e)) {
    const n = `${er(t)}::${e.$ref}`;
    if (r.stack.includes(n))
      return console.warn("[JsonPages] Circular $ref skipped", e.$ref), Sr(e);
    if (r.cache.has(n)) {
      const c = Sr(r.cache.get(n)), d = Object.entries(e).filter(([f]) => f !== "$ref");
      if (d.length === 0) return c;
      const u = Object.fromEntries(
        d.map(([f, h]) => [f, Mt(h, t, r)])
      );
      return dn(c) ? { ...c, ...u } : c;
    }
    const o = Lu(e.$ref, t, r);
    if (!o)
      return console.warn("[JsonPages] Unresolved $ref", e.$ref), Object.fromEntries(
        Object.entries(e).map(([c, d]) => [c, Mt(d, t, r)])
      );
    r.stack.push(n);
    const i = Mt(o.value, o.documentPath, r);
    r.stack.pop(), r.cache.set(n, Sr(i));
    const a = Object.entries(e).filter(([c]) => c !== "$ref");
    if (a.length === 0)
      return i;
    const s = Object.fromEntries(
      a.map(([c, d]) => [c, Mt(d, t, r)])
    );
    return dn(i) ? { ...i, ...s } : i;
  }
  return Object.fromEntries(
    Object.entries(e).map(([n, o]) => [n, Mt(o, t, r)])
  );
}
function Zr(e, t, r) {
  return Mt(e, t, {
    documents: r,
    cache: /* @__PURE__ */ new Map(),
    stack: []
  });
}
function io(e) {
  return Mr(e) ? typeof e.label == "string" && typeof e.href == "string" : false;
}
function $u(e) {
  if (!Mr(e)) return null;
  const t = e.links;
  if (Array.isArray(t) && t.every(io))
    return t;
  const r = e.menu;
  if (Array.isArray(r) && r.every(io))
    return r;
  const n = e.menuConfig;
  return Array.isArray(n) && n.every(io) ? n : null;
}
function oi(e, t) {
  const r = $u(e);
  return r || (Array.isArray(t) ? t : []);
}
function ao(e, t) {
  if (e.type === "header")
    return oi(e.data, t);
}
function Gt(e) {
  const t = _u(e);
  return {
    pages: Object.fromEntries(
      Object.entries(e.pages).map(([r, n]) => [
        r,
        Zr(n, `pages/${r.replace(/^\/+|\/+$/g, "") || "home"}.json`, t)
      ])
    ),
    siteConfig: Zr(e.siteConfig, "config/site.json", t),
    themeConfig: Zr(e.themeConfig, "config/theme.json", t),
    menuConfig: Zr(e.menuConfig, "config/menu.json", t)
  };
}
const Fu = "application/json", ss = ({
  pageConfig: e,
  siteConfig: t,
  menuConfig: r,
  selectedId: n,
  onReorder: o,
  scrollToSectionId: i,
  onActiveSectionChange: a
}) => {
  var w, y;
  Pu(e.meta);
  const [s, c] = useState(null), d = useRef({}), u = useRef(a);
  u.current = a;
  const f = Ul(e, t), h = (v) => {
    var k;
    (k = u.current) == null || k.call(u, v);
  };
  useEffect(() => {
    if (!i) return;
    const v = d.current[i];
    v && v.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [i]), useEffect(() => {
    if (!u.current) return;
    const k = [
      ...f && t.header ? [t.header.id] : [],
      ...e.sections.map((S) => S.id),
      ...t.footer ? [t.footer.id] : []
    ], C = new IntersectionObserver(
      (S) => {
        S.forEach((O) => {
          var M;
          if (O.isIntersecting && O.intersectionRatio > 0.5) {
            const P = O.target.getAttribute("data-section-id");
            P && ((M = u.current) == null || M.call(u, P));
          }
        });
      },
      { threshold: [0, 0.5, 1], rootMargin: "-20% 0px -20% 0px" }
    );
    let E = false;
    const j = requestAnimationFrame(() => {
      E || k.forEach((S) => {
        const O = d.current[S];
        O && C.observe(O);
      });
    });
    return () => {
      E = true, cancelAnimationFrame(j), C.disconnect();
    };
  }, [e.sections, e["global-header"], f, (w = t.header) == null ? void 0 : w.id, (y = t.footer) == null ? void 0 : y.id]);
  const p = (v, k) => {
    v.preventDefault(), v.dataTransfer.dropEffect = "move", c(k);
  }, x = () => {
    c(null);
  }, m = (v, k) => {
    if (v.preventDefault(), c(null), !!o)
      try {
        const C = v.dataTransfer.getData(Fu), { sectionId: E } = JSON.parse(C);
        typeof E == "string" && o(E, k);
      } catch {
      }
  }, b = () => {
    const v = typeof o == "function", k = e.sections.map((C, E) => {
      const j = s === E;
      return v ? /* @__PURE__ */ l.jsxs(
        "div",
        {
          ref: (S) => {
            d.current[C.id] = S;
          },
          "data-section-id": C.id,
          style: { position: "relative" },
          onMouseEnter: () => h(C.id),
          children: [
            /* @__PURE__ */ l.jsx(
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
                  backgroundColor: j ? "rgba(59, 130, 246, 0.4)" : "transparent",
                  borderTop: j ? "2px solid rgb(96, 165, 250)" : "2px solid transparent"
                },
                onDragOver: (S) => p(S, E),
                onDragLeave: x,
                onDrop: (S) => m(S, E)
              }
            ),
            /* @__PURE__ */ l.jsx(
              Jr,
              {
                section: C,
                menu: ao(C, r.main),
                selectedId: n,
                reorderable: true,
                sectionIndex: E,
                totalSections: e.sections.length,
                onReorder: o
              }
            )
          ]
        },
        C.id
      ) : /* @__PURE__ */ l.jsx(
        "div",
        {
          ref: (S) => {
            d.current[C.id] = S;
          },
          "data-section-id": C.id,
          onMouseEnter: () => h(C.id),
          children: /* @__PURE__ */ l.jsx(
            Jr,
            {
              section: C,
              menu: ao(C, r.main),
              selectedId: n
            }
          )
        },
        C.id
      );
    });
    if (v && k.length > 0) {
      const C = e.sections.length, E = s === C;
      k.push(
        /* @__PURE__ */ l.jsx(
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
              backgroundColor: E ? "rgba(59, 130, 246, 0.4)" : "transparent",
              borderTop: E ? "2px solid rgb(96, 165, 250)" : "2px solid transparent"
            },
            onDragOver: (j) => p(j, C),
            onDragLeave: x,
            onDrop: (j) => m(j, C)
          },
          "jp-drop-after-last"
        )
      );
    }
    return k;
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "min-h-screen flex flex-col bg-[var(--color-background)]", children: [
    f && t.header != null && /* @__PURE__ */ l.jsx(
      "div",
      {
        ref: (v) => {
          d.current[t.header.id] = v;
        },
        "data-section-id": t.header.id,
        onMouseEnter: () => h(t.header.id),
        children: /* @__PURE__ */ l.jsx(
          Jr,
          {
            section: t.header,
            menu: ao(t.header, r.main),
            selectedId: n
          }
        )
      }
    ),
    /* @__PURE__ */ l.jsx("main", { className: "flex-1", children: b() }),
    t.footer != null && /* @__PURE__ */ l.jsx(
      "div",
      {
        ref: (v) => {
          d.current[t.footer.id] = v;
        },
        "data-section-id": t.footer.id,
        onMouseEnter: () => h(t.footer.id),
        children: /* @__PURE__ */ l.jsx(Jr, { section: t.footer, selectedId: n })
      }
    )
  ] });
};
var De;
(function(e) {
  e.DragStart = "dragStart", e.DragMove = "dragMove", e.DragEnd = "dragEnd", e.DragCancel = "dragCancel", e.DragOver = "dragOver", e.RegisterDroppable = "registerDroppable", e.SetDroppableDisabled = "setDroppableDisabled", e.UnregisterDroppable = "unregisterDroppable";
})(De || (De = {}));
const at = /* @__PURE__ */ Object.freeze({
  x: 0,
  y: 0
});
var Le;
(function(e) {
  e[e.Forward = 1] = "Forward", e[e.Backward = -1] = "Backward";
})(Le || (Le = {}));
var rt;
(function(e) {
  e.Click = "click", e.DragStart = "dragstart", e.Keydown = "keydown", e.ContextMenu = "contextmenu", e.Resize = "resize", e.SelectionChange = "selectionchange", e.VisibilityChange = "visibilitychange";
})(rt || (rt = {}));
var ue;
(function(e) {
  e.Space = "Space", e.Down = "ArrowDown", e.Right = "ArrowRight", e.Left = "ArrowLeft", e.Up = "ArrowUp", e.Esc = "Escape", e.Enter = "Enter", e.Tab = "Tab";
})(ue || (ue = {}));
({
  start: [ue.Space, ue.Enter],
  cancel: [ue.Esc],
  end: [ue.Space, ue.Enter, ue.Tab]
});
var zo;
(function(e) {
  e[e.RightClick = 2] = "RightClick";
})(zo || (zo = {}));
var jr;
(function(e) {
  e[e.Pointer = 0] = "Pointer", e[e.DraggableRect = 1] = "DraggableRect";
})(jr || (jr = {}));
var yn;
(function(e) {
  e[e.TreeOrder = 0] = "TreeOrder", e[e.ReversedTreeOrder = 1] = "ReversedTreeOrder";
})(yn || (yn = {}));
({
  x: {
    [Le.Backward]: false,
    [Le.Forward]: false
  },
  y: {
    [Le.Backward]: false,
    [Le.Forward]: false
  }
});
var Pr;
(function(e) {
  e[e.Always = 0] = "Always", e[e.BeforeDragging = 1] = "BeforeDragging", e[e.WhileDragging = 2] = "WhileDragging";
})(Pr || (Pr = {}));
var Po;
(function(e) {
  e.Optimized = "optimized";
})(Po || (Po = {}));
({
  droppable: {
    strategy: Pr.WhileDragging,
    frequency: Po.Optimized
  }
});
/* @__PURE__ */ createContext({
  ...at,
  scaleX: 1,
  scaleY: 1
});
var Nt;
(function(e) {
  e[e.Uninitialized = 0] = "Uninitialized", e[e.Initializing = 1] = "Initializing", e[e.Initialized = 2] = "Initialized";
})(Nt || (Nt = {}));
[ue.Down, ue.Right, ue.Up, ue.Left];
function oa(e, [t, r]) {
  return Math.min(r, Math.max(t, e));
}
function be(e, t, { checkForDefaultPrevented: r = true } = {}) {
  return function(o) {
    if (e == null || e(o), r === false || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Wr(e, t = []) {
  let r = [];
  function n(i, a) {
    const s = g.createContext(a), c = r.length;
    r = [...r, a];
    const d = (f) => {
      var w;
      const { scope: h, children: p, ...x } = f, m = ((w = h == null ? void 0 : h[e]) == null ? void 0 : w[c]) || s, b = g.useMemo(() => x, Object.values(x));
      return /* @__PURE__ */ l.jsx(m.Provider, { value: b, children: p });
    };
    d.displayName = i + "Provider";
    function u(f, h) {
      var m;
      const p = ((m = h == null ? void 0 : h[e]) == null ? void 0 : m[c]) || s, x = g.useContext(p);
      if (x) return x;
      if (a !== void 0) return a;
      throw new Error(`\`${f}\` must be used within \`${i}\``);
    }
    return [d, u];
  }
  const o = () => {
    const i = r.map((a) => g.createContext(a));
    return function(s) {
      const c = (s == null ? void 0 : s[e]) || i;
      return g.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: c } }),
        [s, c]
      );
    };
  };
  return o.scopeName = e, [n, $p(o, ...t)];
}
function $p(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(i) {
      const a = n.reduce((s, { useScope: c, scopeName: d }) => {
        const f = c(i)[`__scope${d}`];
        return { ...s, ...f };
      }, {});
      return g.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
function ia(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function _s(...e) {
  return (t) => {
    let r = false;
    const n = e.map((o) => {
      const i = ia(o, t);
      return !r && typeof i == "function" && (r = true), i;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const i = n[o];
          typeof i == "function" ? i() : ia(e[o], null);
        }
      };
  };
}
function Ne(...e) {
  return g.useCallback(_s(...e), e);
}
// @__NO_SIDE_EFFECTS__
function tr(e) {
  const t = /* @__PURE__ */ Wp(e), r = g.forwardRef((n, o) => {
    const { children: i, ...a } = n, s = g.Children.toArray(i), c = s.find(Bp);
    if (c) {
      const d = c.props.children, u = s.map((f) => f === c ? g.Children.count(d) > 1 ? g.Children.only(null) : g.isValidElement(d) ? d.props.children : null : f);
      return /* @__PURE__ */ l.jsx(t, { ...a, ref: o, children: g.isValidElement(d) ? g.cloneElement(d, void 0, u) : null });
    }
    return /* @__PURE__ */ l.jsx(t, { ...a, ref: o, children: i });
  });
  return r.displayName = `${e}.Slot`, r;
}
var Fp = /* @__PURE__ */ tr("Slot");
// @__NO_SIDE_EFFECTS__
function Wp(e) {
  const t = g.forwardRef((r, n) => {
    const { children: o, ...i } = r;
    if (g.isValidElement(o)) {
      const a = Vp(o), s = Hp(i, o.props);
      return o.type !== g.Fragment && (s.ref = n ? _s(n, a) : a), g.cloneElement(o, s);
    }
    return g.Children.count(o) > 1 ? g.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Ls = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Up(e) {
  const t = ({ children: r }) => /* @__PURE__ */ l.jsx(l.Fragment, { children: r });
  return t.displayName = `${e}.Slottable`, t.__radixId = Ls, t;
}
function Bp(e) {
  return g.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Ls;
}
function Hp(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...s) => {
      const c = i(...s);
      return o(...s), c;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function Vp(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
function Kp(e) {
  const t = e + "CollectionProvider", [r, n] = Wr(t), [o, i] = r(
    t,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (m) => {
    const { scope: b, children: w } = m, y = g__default.useRef(null), v = g__default.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ l.jsx(o, { scope: b, itemMap: v, collectionRef: y, children: w });
  };
  a.displayName = t;
  const s = e + "CollectionSlot", c = /* @__PURE__ */ tr(s), d = g__default.forwardRef(
    (m, b) => {
      const { scope: w, children: y } = m, v = i(s, w), k = Ne(b, v.collectionRef);
      return /* @__PURE__ */ l.jsx(c, { ref: k, children: y });
    }
  );
  d.displayName = s;
  const u = e + "CollectionItemSlot", f = "data-radix-collection-item", h = /* @__PURE__ */ tr(u), p = g__default.forwardRef(
    (m, b) => {
      const { scope: w, children: y, ...v } = m, k = g__default.useRef(null), C = Ne(b, k), E = i(u, w);
      return g__default.useEffect(() => (E.itemMap.set(k, { ref: k, ...v }), () => void E.itemMap.delete(k))), /* @__PURE__ */ l.jsx(h, { [f]: "", ref: C, children: y });
    }
  );
  p.displayName = u;
  function x(m) {
    const b = i(e + "CollectionConsumer", m);
    return g__default.useCallback(() => {
      const y = b.collectionRef.current;
      if (!y) return [];
      const v = Array.from(y.querySelectorAll(`[${f}]`));
      return Array.from(b.itemMap.values()).sort(
        (E, j) => v.indexOf(E.ref.current) - v.indexOf(j.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return [
    { Provider: a, Slot: d, ItemSlot: p },
    x,
    n
  ];
}
g.createContext(void 0);
var qp = [
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
], je = qp.reduce((e, t) => {
  const r = /* @__PURE__ */ tr(`Primitive.${t}`), n = g.forwardRef((o, i) => {
    const { asChild: a, ...s } = o, c = a ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = true), /* @__PURE__ */ l.jsx(c, { ...s, ref: i });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function Xp(e, t) {
  e && Pn.flushSync(() => e.dispatchEvent(t));
}
function Lt(e) {
  const t = g.useRef(e);
  return g.useEffect(() => {
    t.current = e;
  }), g.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
function Jp(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Lt(e);
  g.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: true }), () => t.removeEventListener("keydown", n, { capture: true });
  }, [r, t]);
}
var Zp = "DismissableLayer", Oo = "dismissableLayer.update", Qp = "dismissableLayer.pointerDownOutside", eh = "dismissableLayer.focusOutside", aa, $s = g.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), Un = g.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = false,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: a,
      onDismiss: s,
      ...c
    } = e, d = g.useContext($s), [u, f] = g.useState(null), h = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, p] = g.useState({}), x = Ne(t, (j) => f(j)), m = Array.from(d.layers), [b] = [...d.layersWithOutsidePointerEventsDisabled].slice(-1), w = m.indexOf(b), y = u ? m.indexOf(u) : -1, v = d.layersWithOutsidePointerEventsDisabled.size > 0, k = y >= w, C = nh((j) => {
      const S = j.target, O = [...d.branches].some((M) => M.contains(S));
      !k || O || (o == null || o(j), a == null || a(j), j.defaultPrevented || s == null || s());
    }, h), E = oh((j) => {
      const S = j.target;
      [...d.branches].some((M) => M.contains(S)) || (i == null || i(j), a == null || a(j), j.defaultPrevented || s == null || s());
    }, h);
    return Jp((j) => {
      y === d.layers.size - 1 && (n == null || n(j), !j.defaultPrevented && s && (j.preventDefault(), s()));
    }, h), g.useEffect(() => {
      if (u)
        return r && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (aa = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(u)), d.layers.add(u), sa(), () => {
          r && d.layersWithOutsidePointerEventsDisabled.size === 1 && (h.body.style.pointerEvents = aa);
        };
    }, [u, h, r, d]), g.useEffect(() => () => {
      u && (d.layers.delete(u), d.layersWithOutsidePointerEventsDisabled.delete(u), sa());
    }, [u, d]), g.useEffect(() => {
      const j = () => p({});
      return document.addEventListener(Oo, j), () => document.removeEventListener(Oo, j);
    }, []), /* @__PURE__ */ l.jsx(
      je.div,
      {
        ...c,
        ref: x,
        style: {
          pointerEvents: v ? k ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: be(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: be(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: be(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
Un.displayName = Zp;
var th = "DismissableLayerBranch", rh = g.forwardRef((e, t) => {
  const r = g.useContext($s), n = g.useRef(null), o = Ne(t, n);
  return g.useEffect(() => {
    const i = n.current;
    if (i)
      return r.branches.add(i), () => {
        r.branches.delete(i);
      };
  }, [r.branches]), /* @__PURE__ */ l.jsx(je.div, { ...e, ref: o });
});
rh.displayName = th;
function nh(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Lt(e), n = g.useRef(false), o = g.useRef(() => {
  });
  return g.useEffect(() => {
    const i = (s) => {
      if (s.target && !n.current) {
        let c = function() {
          Fs(
            Qp,
            r,
            d,
            { discrete: true }
          );
        };
        const d = { originalEvent: s };
        s.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = c, t.addEventListener("click", o.current, { once: true })) : c();
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
function oh(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = Lt(e), n = g.useRef(false);
  return g.useEffect(() => {
    const o = (i) => {
      i.target && !n.current && Fs(eh, r, { originalEvent: i }, {
        discrete: false
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = true,
    onBlurCapture: () => n.current = false
  };
}
function sa() {
  const e = new CustomEvent(Oo);
  document.dispatchEvent(e);
}
function Fs(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, i = new CustomEvent(e, { bubbles: false, cancelable: true, detail: r });
  t && o.addEventListener(e, t, { once: true }), n ? Xp(o, i) : o.dispatchEvent(i);
}
var po = 0;
function Ws() {
  g.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? ca()), document.body.insertAdjacentElement("beforeend", e[1] ?? ca()), po++, () => {
      po === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), po--;
    };
  }, []);
}
function ca() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var ho = "focusScope.autoFocusOnMount", mo = "focusScope.autoFocusOnUnmount", la = { bubbles: false, cancelable: true }, ih = "FocusScope", hi = g.forwardRef((e, t) => {
  const {
    loop: r = false,
    trapped: n = false,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...a
  } = e, [s, c] = g.useState(null), d = Lt(o), u = Lt(i), f = g.useRef(null), h = Ne(t, (m) => c(m)), p = g.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  g.useEffect(() => {
    if (n) {
      let m = function(v) {
        if (p.paused || !s) return;
        const k = v.target;
        s.contains(k) ? f.current = k : jt(f.current, { select: true });
      }, b = function(v) {
        if (p.paused || !s) return;
        const k = v.relatedTarget;
        k !== null && (s.contains(k) || jt(f.current, { select: true }));
      }, w = function(v) {
        if (document.activeElement === document.body)
          for (const C of v)
            C.removedNodes.length > 0 && jt(s);
      };
      document.addEventListener("focusin", m), document.addEventListener("focusout", b);
      const y = new MutationObserver(w);
      return s && y.observe(s, { childList: true, subtree: true }), () => {
        document.removeEventListener("focusin", m), document.removeEventListener("focusout", b), y.disconnect();
      };
    }
  }, [n, s, p.paused]), g.useEffect(() => {
    if (s) {
      ua.add(p);
      const m = document.activeElement;
      if (!s.contains(m)) {
        const w = new CustomEvent(ho, la);
        s.addEventListener(ho, d), s.dispatchEvent(w), w.defaultPrevented || (ah(uh(Us(s)), { select: true }), document.activeElement === m && jt(s));
      }
      return () => {
        s.removeEventListener(ho, d), setTimeout(() => {
          const w = new CustomEvent(mo, la);
          s.addEventListener(mo, u), s.dispatchEvent(w), w.defaultPrevented || jt(m ?? document.body, { select: true }), s.removeEventListener(mo, u), ua.remove(p);
        }, 0);
      };
    }
  }, [s, d, u, p]);
  const x = g.useCallback(
    (m) => {
      if (!r && !n || p.paused) return;
      const b = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey, w = document.activeElement;
      if (b && w) {
        const y = m.currentTarget, [v, k] = sh(y);
        v && k ? !m.shiftKey && w === k ? (m.preventDefault(), r && jt(v, { select: true })) : m.shiftKey && w === v && (m.preventDefault(), r && jt(k, { select: true })) : w === y && m.preventDefault();
      }
    },
    [r, n, p.paused]
  );
  return /* @__PURE__ */ l.jsx(je.div, { tabIndex: -1, ...a, ref: h, onKeyDown: x });
});
hi.displayName = ih;
function ah(e, { select: t = false } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (jt(n, { select: t }), document.activeElement !== r) return;
}
function sh(e) {
  const t = Us(e), r = da(t, e), n = da(t.reverse(), e);
  return [r, n];
}
function Us(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function da(e, t) {
  for (const r of e)
    if (!ch(r, { upTo: t })) return r;
}
function ch(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return true;
  for (; e; ) {
    if (t !== void 0 && e === t) return false;
    if (getComputedStyle(e).display === "none") return true;
    e = e.parentElement;
  }
  return false;
}
function lh(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function jt(e, { select: t = false } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: true }), e !== r && lh(e) && t && e.select();
  }
}
var ua = dh();
function dh() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = fa(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = fa(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function fa(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function uh(e) {
  return e.filter((t) => t.tagName !== "A");
}
var He = globalThis != null && globalThis.document ? g.useLayoutEffect : () => {
}, fh = g[" useId ".trim().toString()] || (() => {
}), ph = 0;
function Ur(e) {
  const [t, r] = g.useState(fh());
  return He(() => {
    r((n) => n ?? String(ph++));
  }, [e]), t ? `radix-${t}` : "";
}
const hh = ["top", "right", "bottom", "left"], Tt = Math.min, Qe = Math.max, Cn = Math.round, tn = Math.floor, ft = (e) => ({
  x: e,
  y: e
}), mh = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, gh = {
  start: "end",
  end: "start"
};
function Io(e, t, r) {
  return Qe(e, Tt(t, r));
}
function xt(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function wt(e) {
  return e.split("-")[0];
}
function dr(e) {
  return e.split("-")[1];
}
function mi(e) {
  return e === "x" ? "y" : "x";
}
function gi(e) {
  return e === "y" ? "height" : "width";
}
const bh = /* @__PURE__ */ new Set(["top", "bottom"]);
function ut(e) {
  return bh.has(wt(e)) ? "y" : "x";
}
function bi(e) {
  return mi(ut(e));
}
function vh(e, t, r) {
  r === void 0 && (r = false);
  const n = dr(e), o = bi(e), i = gi(o);
  let a = o === "x" ? n === (r ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (a = Sn(a)), [a, Sn(a)];
}
function xh(e) {
  const t = Sn(e);
  return [Do(e), t, Do(t)];
}
function Do(e) {
  return e.replace(/start|end/g, (t) => gh[t]);
}
const pa = ["left", "right"], ha = ["right", "left"], wh = ["top", "bottom"], yh = ["bottom", "top"];
function kh(e, t, r) {
  switch (e) {
    case "top":
    case "bottom":
      return r ? t ? ha : pa : t ? pa : ha;
    case "left":
    case "right":
      return t ? wh : yh;
    default:
      return [];
  }
}
function Ch(e, t, r, n) {
  const o = dr(e);
  let i = kh(wt(e), r === "start", n);
  return o && (i = i.map((a) => a + "-" + o), t && (i = i.concat(i.map(Do)))), i;
}
function Sn(e) {
  return e.replace(/left|right|bottom|top/g, (t) => mh[t]);
}
function Sh(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function Bs(e) {
  return typeof e != "number" ? Sh(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function En(e) {
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
function ma(e, t, r) {
  let {
    reference: n,
    floating: o
  } = e;
  const i = ut(t), a = bi(t), s = gi(a), c = wt(t), d = i === "y", u = n.x + n.width / 2 - o.width / 2, f = n.y + n.height / 2 - o.height / 2, h = n[s] / 2 - o[s] / 2;
  let p;
  switch (c) {
    case "top":
      p = {
        x: u,
        y: n.y - o.height
      };
      break;
    case "bottom":
      p = {
        x: u,
        y: n.y + n.height
      };
      break;
    case "right":
      p = {
        x: n.x + n.width,
        y: f
      };
      break;
    case "left":
      p = {
        x: n.x - o.width,
        y: f
      };
      break;
    default:
      p = {
        x: n.x,
        y: n.y
      };
  }
  switch (dr(t)) {
    case "start":
      p[a] -= h * (r && d ? -1 : 1);
      break;
    case "end":
      p[a] += h * (r && d ? -1 : 1);
      break;
  }
  return p;
}
async function Eh(e, t) {
  var r;
  t === void 0 && (t = {});
  const {
    x: n,
    y: o,
    platform: i,
    rects: a,
    elements: s,
    strategy: c
  } = e, {
    boundary: d = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: f = "floating",
    altBoundary: h = false,
    padding: p = 0
  } = xt(t, e), x = Bs(p), b = s[h ? f === "floating" ? "reference" : "floating" : f], w = En(await i.getClippingRect({
    element: (r = await (i.isElement == null ? void 0 : i.isElement(b))) == null || r ? b : b.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(s.floating)),
    boundary: d,
    rootBoundary: u,
    strategy: c
  })), y = f === "floating" ? {
    x: n,
    y: o,
    width: a.floating.width,
    height: a.floating.height
  } : a.reference, v = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(s.floating)), k = await (i.isElement == null ? void 0 : i.isElement(v)) ? await (i.getScale == null ? void 0 : i.getScale(v)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = En(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: s,
    rect: y,
    offsetParent: v,
    strategy: c
  }) : y);
  return {
    top: (w.top - C.top + x.top) / k.y,
    bottom: (C.bottom - w.bottom + x.bottom) / k.y,
    left: (w.left - C.left + x.left) / k.x,
    right: (C.right - w.right + x.right) / k.x
  };
}
const jh = async (e, t, r) => {
  const {
    placement: n = "bottom",
    strategy: o = "absolute",
    middleware: i = [],
    platform: a
  } = r, s = i.filter(Boolean), c = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let d = await a.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: u,
    y: f
  } = ma(d, n, c), h = n, p = {}, x = 0;
  for (let b = 0; b < s.length; b++) {
    var m;
    const {
      name: w,
      fn: y
    } = s[b], {
      x: v,
      y: k,
      data: C,
      reset: E
    } = await y({
      x: u,
      y: f,
      initialPlacement: n,
      placement: h,
      strategy: o,
      middlewareData: p,
      rects: d,
      platform: {
        ...a,
        detectOverflow: (m = a.detectOverflow) != null ? m : Eh
      },
      elements: {
        reference: e,
        floating: t
      }
    });
    u = v ?? u, f = k ?? f, p = {
      ...p,
      [w]: {
        ...p[w],
        ...C
      }
    }, E && x <= 50 && (x++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (d = E.rects === true ? await a.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : E.rects), {
      x: u,
      y: f
    } = ma(d, h, c)), b = -1);
  }
  return {
    x: u,
    y: f,
    placement: h,
    strategy: o,
    middlewareData: p
  };
}, Nh = (e) => ({
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
      middlewareData: c
    } = t, {
      element: d,
      padding: u = 0
    } = xt(e, t) || {};
    if (d == null)
      return {};
    const f = Bs(u), h = {
      x: r,
      y: n
    }, p = bi(o), x = gi(p), m = await a.getDimensions(d), b = p === "y", w = b ? "top" : "left", y = b ? "bottom" : "right", v = b ? "clientHeight" : "clientWidth", k = i.reference[x] + i.reference[p] - h[p] - i.floating[x], C = h[p] - i.reference[p], E = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(d));
    let j = E ? E[v] : 0;
    (!j || !await (a.isElement == null ? void 0 : a.isElement(E))) && (j = s.floating[v] || i.floating[x]);
    const S = k / 2 - C / 2, O = j / 2 - m[x] / 2 - 1, M = Tt(f[w], O), P = Tt(f[y], O), _ = M, D = j - m[x] - P, K = j / 2 - m[x] / 2 + S, U = Io(_, K, D), $ = !c.arrow && dr(o) != null && K !== U && i.reference[x] / 2 - (K < _ ? M : P) - m[x] / 2 < 0, W = $ ? K < _ ? K - _ : K - D : 0;
    return {
      [p]: h[p] + W,
      data: {
        [p]: U,
        centerOffset: K - U - W,
        ...$ && {
          alignmentOffset: W
        }
      },
      reset: $
    };
  }
}), Rh = function(e) {
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
        platform: c,
        elements: d
      } = t, {
        mainAxis: u = true,
        crossAxis: f = true,
        fallbackPlacements: h,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: x = "none",
        flipAlignment: m = true,
        ...b
      } = xt(e, t);
      if ((r = i.arrow) != null && r.alignmentOffset)
        return {};
      const w = wt(o), y = ut(s), v = wt(s) === s, k = await (c.isRTL == null ? void 0 : c.isRTL(d.floating)), C = h || (v || !m ? [Sn(s)] : xh(s)), E = x !== "none";
      !h && E && C.push(...Ch(s, m, x, k));
      const j = [s, ...C], S = await c.detectOverflow(t, b), O = [];
      let M = ((n = i.flip) == null ? void 0 : n.overflows) || [];
      if (u && O.push(S[w]), f) {
        const K = vh(o, a, k);
        O.push(S[K[0]], S[K[1]]);
      }
      if (M = [...M, {
        placement: o,
        overflows: O
      }], !O.every((K) => K <= 0)) {
        var P, _;
        const K = (((P = i.flip) == null ? void 0 : P.index) || 0) + 1, U = j[K];
        if (U && (!(f === "alignment" ? y !== ut(U) : false) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((R) => ut(R.placement) === y ? R.overflows[0] > 0 : true)))
          return {
            data: {
              index: K,
              overflows: M
            },
            reset: {
              placement: U
            }
          };
        let $ = (_ = M.filter((W) => W.overflows[0] <= 0).sort((W, R) => W.overflows[1] - R.overflows[1])[0]) == null ? void 0 : _.placement;
        if (!$)
          switch (p) {
            case "bestFit": {
              var D;
              const W = (D = M.filter((R) => {
                if (E) {
                  const q = ut(R.placement);
                  return q === y || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  q === "y";
                }
                return true;
              }).map((R) => [R.placement, R.overflows.filter((q) => q > 0).reduce((q, ne) => q + ne, 0)]).sort((R, q) => R[1] - q[1])[0]) == null ? void 0 : D[0];
              W && ($ = W);
              break;
            }
            case "initialPlacement":
              $ = s;
              break;
          }
        if (o !== $)
          return {
            reset: {
              placement: $
            }
          };
      }
      return {};
    }
  };
};
function ga(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function ba(e) {
  return hh.some((t) => e[t] >= 0);
}
const Th = function(e) {
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
      } = xt(e, t);
      switch (o) {
        case "referenceHidden": {
          const a = await n.detectOverflow(t, {
            ...i,
            elementContext: "reference"
          }), s = ga(a, r.reference);
          return {
            data: {
              referenceHiddenOffsets: s,
              referenceHidden: ba(s)
            }
          };
        }
        case "escaped": {
          const a = await n.detectOverflow(t, {
            ...i,
            altBoundary: true
          }), s = ga(a, r.floating);
          return {
            data: {
              escapedOffsets: s,
              escaped: ba(s)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Hs = /* @__PURE__ */ new Set(["left", "top"]);
async function Ah(e, t) {
  const {
    placement: r,
    platform: n,
    elements: o
  } = e, i = await (n.isRTL == null ? void 0 : n.isRTL(o.floating)), a = wt(r), s = dr(r), c = ut(r) === "y", d = Hs.has(a) ? -1 : 1, u = i && c ? -1 : 1, f = xt(t, e);
  let {
    mainAxis: h,
    crossAxis: p,
    alignmentAxis: x
  } = typeof f == "number" ? {
    mainAxis: f,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: f.mainAxis || 0,
    crossAxis: f.crossAxis || 0,
    alignmentAxis: f.alignmentAxis
  };
  return s && typeof x == "number" && (p = s === "end" ? x * -1 : x), c ? {
    x: p * u,
    y: h * d
  } : {
    x: h * d,
    y: p * u
  };
}
const zh = function(e) {
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
      } = t, c = await Ah(t, e);
      return a === ((r = s.offset) == null ? void 0 : r.placement) && (n = s.arrow) != null && n.alignmentOffset ? {} : {
        x: o + c.x,
        y: i + c.y,
        data: {
          ...c,
          placement: a
        }
      };
    }
  };
}, Ph = function(e) {
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
        limiter: c = {
          fn: (w) => {
            let {
              x: y,
              y: v
            } = w;
            return {
              x: y,
              y: v
            };
          }
        },
        ...d
      } = xt(e, t), u = {
        x: r,
        y: n
      }, f = await i.detectOverflow(t, d), h = ut(wt(o)), p = mi(h);
      let x = u[p], m = u[h];
      if (a) {
        const w = p === "y" ? "top" : "left", y = p === "y" ? "bottom" : "right", v = x + f[w], k = x - f[y];
        x = Io(v, x, k);
      }
      if (s) {
        const w = h === "y" ? "top" : "left", y = h === "y" ? "bottom" : "right", v = m + f[w], k = m - f[y];
        m = Io(v, m, k);
      }
      const b = c.fn({
        ...t,
        [p]: x,
        [h]: m
      });
      return {
        ...b,
        data: {
          x: b.x - r,
          y: b.y - n,
          enabled: {
            [p]: a,
            [h]: s
          }
        }
      };
    }
  };
}, Oh = function(e) {
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
        mainAxis: c = true,
        crossAxis: d = true
      } = xt(e, t), u = {
        x: r,
        y: n
      }, f = ut(o), h = mi(f);
      let p = u[h], x = u[f];
      const m = xt(s, t), b = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (c) {
        const v = h === "y" ? "height" : "width", k = i.reference[h] - i.floating[v] + b.mainAxis, C = i.reference[h] + i.reference[v] - b.mainAxis;
        p < k ? p = k : p > C && (p = C);
      }
      if (d) {
        var w, y;
        const v = h === "y" ? "width" : "height", k = Hs.has(wt(o)), C = i.reference[f] - i.floating[v] + (k && ((w = a.offset) == null ? void 0 : w[f]) || 0) + (k ? 0 : b.crossAxis), E = i.reference[f] + i.reference[v] + (k ? 0 : ((y = a.offset) == null ? void 0 : y[f]) || 0) - (k ? b.crossAxis : 0);
        x < C ? x = C : x > E && (x = E);
      }
      return {
        [h]: p,
        [f]: x
      };
    }
  };
}, Ih = function(e) {
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
        apply: c = () => {
        },
        ...d
      } = xt(e, t), u = await a.detectOverflow(t, d), f = wt(o), h = dr(o), p = ut(o) === "y", {
        width: x,
        height: m
      } = i.floating;
      let b, w;
      f === "top" || f === "bottom" ? (b = f, w = h === (await (a.isRTL == null ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (w = f, b = h === "end" ? "top" : "bottom");
      const y = m - u.top - u.bottom, v = x - u.left - u.right, k = Tt(m - u[b], y), C = Tt(x - u[w], v), E = !t.middlewareData.shift;
      let j = k, S = C;
      if ((r = t.middlewareData.shift) != null && r.enabled.x && (S = v), (n = t.middlewareData.shift) != null && n.enabled.y && (j = y), E && !h) {
        const M = Qe(u.left, 0), P = Qe(u.right, 0), _ = Qe(u.top, 0), D = Qe(u.bottom, 0);
        p ? S = x - 2 * (M !== 0 || P !== 0 ? M + P : Qe(u.left, u.right)) : j = m - 2 * (_ !== 0 || D !== 0 ? _ + D : Qe(u.top, u.bottom));
      }
      await c({
        ...t,
        availableWidth: S,
        availableHeight: j
      });
      const O = await a.getDimensions(s.floating);
      return x !== O.width || m !== O.height ? {
        reset: {
          rects: true
        }
      } : {};
    }
  };
};
function Bn() {
  return typeof window < "u";
}
function ur(e) {
  return Vs(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function tt(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function mt(e) {
  var t;
  return (t = (Vs(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Vs(e) {
  return Bn() ? e instanceof Node || e instanceof tt(e).Node : false;
}
function st(e) {
  return Bn() ? e instanceof Element || e instanceof tt(e).Element : false;
}
function ht(e) {
  return Bn() ? e instanceof HTMLElement || e instanceof tt(e).HTMLElement : false;
}
function va(e) {
  return !Bn() || typeof ShadowRoot > "u" ? false : e instanceof ShadowRoot || e instanceof tt(e).ShadowRoot;
}
const Dh = /* @__PURE__ */ new Set(["inline", "contents"]);
function Br(e) {
  const {
    overflow: t,
    overflowX: r,
    overflowY: n,
    display: o
  } = ct(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + r) && !Dh.has(o);
}
const Mh = /* @__PURE__ */ new Set(["table", "td", "th"]);
function _h(e) {
  return Mh.has(ur(e));
}
const Lh = [":popover-open", ":modal"];
function Hn(e) {
  return Lh.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return false;
    }
  });
}
const $h = ["transform", "translate", "scale", "rotate", "perspective"], Fh = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Wh = ["paint", "layout", "strict", "content"];
function vi(e) {
  const t = xi(), r = st(e) ? ct(e) : e;
  return $h.some((n) => r[n] ? r[n] !== "none" : false) || (r.containerType ? r.containerType !== "normal" : false) || !t && (r.backdropFilter ? r.backdropFilter !== "none" : false) || !t && (r.filter ? r.filter !== "none" : false) || Fh.some((n) => (r.willChange || "").includes(n)) || Wh.some((n) => (r.contain || "").includes(n));
}
function Uh(e) {
  let t = At(e);
  for (; ht(t) && !rr(t); ) {
    if (vi(t))
      return t;
    if (Hn(t))
      return null;
    t = At(t);
  }
  return null;
}
function xi() {
  return typeof CSS > "u" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter", "none");
}
const Bh = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function rr(e) {
  return Bh.has(ur(e));
}
function ct(e) {
  return tt(e).getComputedStyle(e);
}
function Vn(e) {
  return st(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function At(e) {
  if (ur(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    va(e) && e.host || // Fallback.
    mt(e)
  );
  return va(t) ? t.host : t;
}
function Ks(e) {
  const t = At(e);
  return rr(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : ht(t) && Br(t) ? t : Ks(t);
}
function Or(e, t, r) {
  var n;
  t === void 0 && (t = []), r === void 0 && (r = true);
  const o = Ks(e), i = o === ((n = e.ownerDocument) == null ? void 0 : n.body), a = tt(o);
  if (i) {
    const s = Mo(a);
    return t.concat(a, a.visualViewport || [], Br(o) ? o : [], s && r ? Or(s) : []);
  }
  return t.concat(o, Or(o, [], r));
}
function Mo(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Ys(e) {
  const t = ct(e);
  let r = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0;
  const o = ht(e), i = o ? e.offsetWidth : r, a = o ? e.offsetHeight : n, s = Cn(r) !== i || Cn(n) !== a;
  return s && (r = i, n = a), {
    width: r,
    height: n,
    $: s
  };
}
function wi(e) {
  return st(e) ? e : e.contextElement;
}
function Jt(e) {
  const t = wi(e);
  if (!ht(t))
    return ft(1);
  const r = t.getBoundingClientRect(), {
    width: n,
    height: o,
    $: i
  } = Ys(t);
  let a = (i ? Cn(r.width) : r.width) / n, s = (i ? Cn(r.height) : r.height) / o;
  return (!a || !Number.isFinite(a)) && (a = 1), (!s || !Number.isFinite(s)) && (s = 1), {
    x: a,
    y: s
  };
}
const Hh = /* @__PURE__ */ ft(0);
function Gs(e) {
  const t = tt(e);
  return !xi() || !t.visualViewport ? Hh : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Vh(e, t, r) {
  return t === void 0 && (t = false), !r || t && r !== tt(e) ? false : t;
}
function $t(e, t, r, n) {
  t === void 0 && (t = false), r === void 0 && (r = false);
  const o = e.getBoundingClientRect(), i = wi(e);
  let a = ft(1);
  t && (n ? st(n) && (a = Jt(n)) : a = Jt(e));
  const s = Vh(i, r, n) ? Gs(i) : ft(0);
  let c = (o.left + s.x) / a.x, d = (o.top + s.y) / a.y, u = o.width / a.x, f = o.height / a.y;
  if (i) {
    const h = tt(i), p = n && st(n) ? tt(n) : n;
    let x = h, m = Mo(x);
    for (; m && n && p !== x; ) {
      const b = Jt(m), w = m.getBoundingClientRect(), y = ct(m), v = w.left + (m.clientLeft + parseFloat(y.paddingLeft)) * b.x, k = w.top + (m.clientTop + parseFloat(y.paddingTop)) * b.y;
      c *= b.x, d *= b.y, u *= b.x, f *= b.y, c += v, d += k, x = tt(m), m = Mo(x);
    }
  }
  return En({
    width: u,
    height: f,
    x: c,
    y: d
  });
}
function Kn(e, t) {
  const r = Vn(e).scrollLeft;
  return t ? t.left + r : $t(mt(e)).left + r;
}
function qs(e, t) {
  const r = e.getBoundingClientRect(), n = r.left + t.scrollLeft - Kn(e, r), o = r.top + t.scrollTop;
  return {
    x: n,
    y: o
  };
}
function Kh(e) {
  let {
    elements: t,
    rect: r,
    offsetParent: n,
    strategy: o
  } = e;
  const i = o === "fixed", a = mt(n), s = t ? Hn(t.floating) : false;
  if (n === a || s && i)
    return r;
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  }, d = ft(1);
  const u = ft(0), f = ht(n);
  if ((f || !f && !i) && ((ur(n) !== "body" || Br(a)) && (c = Vn(n)), ht(n))) {
    const p = $t(n);
    d = Jt(n), u.x = p.x + n.clientLeft, u.y = p.y + n.clientTop;
  }
  const h = a && !f && !i ? qs(a, c) : ft(0);
  return {
    width: r.width * d.x,
    height: r.height * d.y,
    x: r.x * d.x - c.scrollLeft * d.x + u.x + h.x,
    y: r.y * d.y - c.scrollTop * d.y + u.y + h.y
  };
}
function Yh(e) {
  return Array.from(e.getClientRects());
}
function Gh(e) {
  const t = mt(e), r = Vn(e), n = e.ownerDocument.body, o = Qe(t.scrollWidth, t.clientWidth, n.scrollWidth, n.clientWidth), i = Qe(t.scrollHeight, t.clientHeight, n.scrollHeight, n.clientHeight);
  let a = -r.scrollLeft + Kn(e);
  const s = -r.scrollTop;
  return ct(n).direction === "rtl" && (a += Qe(t.clientWidth, n.clientWidth) - o), {
    width: o,
    height: i,
    x: a,
    y: s
  };
}
const xa = 25;
function qh(e, t) {
  const r = tt(e), n = mt(e), o = r.visualViewport;
  let i = n.clientWidth, a = n.clientHeight, s = 0, c = 0;
  if (o) {
    i = o.width, a = o.height;
    const u = xi();
    (!u || u && t === "fixed") && (s = o.offsetLeft, c = o.offsetTop);
  }
  const d = Kn(n);
  if (d <= 0) {
    const u = n.ownerDocument, f = u.body, h = getComputedStyle(f), p = u.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, x = Math.abs(n.clientWidth - f.clientWidth - p);
    x <= xa && (i -= x);
  } else d <= xa && (i += d);
  return {
    width: i,
    height: a,
    x: s,
    y: c
  };
}
const Xh = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Jh(e, t) {
  const r = $t(e, true, t === "fixed"), n = r.top + e.clientTop, o = r.left + e.clientLeft, i = ht(e) ? Jt(e) : ft(1), a = e.clientWidth * i.x, s = e.clientHeight * i.y, c = o * i.x, d = n * i.y;
  return {
    width: a,
    height: s,
    x: c,
    y: d
  };
}
function wa(e, t, r) {
  let n;
  if (t === "viewport")
    n = qh(e, r);
  else if (t === "document")
    n = Gh(mt(e));
  else if (st(t))
    n = Jh(t, r);
  else {
    const o = Gs(e);
    n = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return En(n);
}
function Xs(e, t) {
  const r = At(e);
  return r === t || !st(r) || rr(r) ? false : ct(r).position === "fixed" || Xs(r, t);
}
function Zh(e, t) {
  const r = t.get(e);
  if (r)
    return r;
  let n = Or(e, [], false).filter((s) => st(s) && ur(s) !== "body"), o = null;
  const i = ct(e).position === "fixed";
  let a = i ? At(e) : e;
  for (; st(a) && !rr(a); ) {
    const s = ct(a), c = vi(a);
    !c && s.position === "fixed" && (o = null), (i ? !c && !o : !c && s.position === "static" && !!o && Xh.has(o.position) || Br(a) && !c && Xs(e, a)) ? n = n.filter((u) => u !== a) : o = s, a = At(a);
  }
  return t.set(e, n), n;
}
function Qh(e) {
  let {
    element: t,
    boundary: r,
    rootBoundary: n,
    strategy: o
  } = e;
  const a = [...r === "clippingAncestors" ? Hn(t) ? [] : Zh(t, this._c) : [].concat(r), n], s = a[0], c = a.reduce((d, u) => {
    const f = wa(t, u, o);
    return d.top = Qe(f.top, d.top), d.right = Tt(f.right, d.right), d.bottom = Tt(f.bottom, d.bottom), d.left = Qe(f.left, d.left), d;
  }, wa(t, s, o));
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top
  };
}
function em(e) {
  const {
    width: t,
    height: r
  } = Ys(e);
  return {
    width: t,
    height: r
  };
}
function tm(e, t, r) {
  const n = ht(t), o = mt(t), i = r === "fixed", a = $t(e, true, i, t);
  let s = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const c = ft(0);
  function d() {
    c.x = Kn(o);
  }
  if (n || !n && !i)
    if ((ur(t) !== "body" || Br(o)) && (s = Vn(t)), n) {
      const p = $t(t, true, i, t);
      c.x = p.x + t.clientLeft, c.y = p.y + t.clientTop;
    } else o && d();
  i && !n && o && d();
  const u = o && !n && !i ? qs(o, s) : ft(0), f = a.left + s.scrollLeft - c.x - u.x, h = a.top + s.scrollTop - c.y - u.y;
  return {
    x: f,
    y: h,
    width: a.width,
    height: a.height
  };
}
function go(e) {
  return ct(e).position === "static";
}
function ya(e, t) {
  if (!ht(e) || ct(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let r = e.offsetParent;
  return mt(e) === r && (r = r.ownerDocument.body), r;
}
function Js(e, t) {
  const r = tt(e);
  if (Hn(e))
    return r;
  if (!ht(e)) {
    let o = At(e);
    for (; o && !rr(o); ) {
      if (st(o) && !go(o))
        return o;
      o = At(o);
    }
    return r;
  }
  let n = ya(e, t);
  for (; n && _h(n) && go(n); )
    n = ya(n, t);
  return n && rr(n) && go(n) && !vi(n) ? r : n || Uh(e) || r;
}
const rm = async function(e) {
  const t = this.getOffsetParent || Js, r = this.getDimensions, n = await r(e.floating);
  return {
    reference: tm(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: n.width,
      height: n.height
    }
  };
};
function nm(e) {
  return ct(e).direction === "rtl";
}
const om = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Kh,
  getDocumentElement: mt,
  getClippingRect: Qh,
  getOffsetParent: Js,
  getElementRects: rm,
  getClientRects: Yh,
  getDimensions: em,
  getScale: Jt,
  isElement: st,
  isRTL: nm
};
function Zs(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function im(e, t) {
  let r = null, n;
  const o = mt(e);
  function i() {
    var s;
    clearTimeout(n), (s = r) == null || s.disconnect(), r = null;
  }
  function a(s, c) {
    s === void 0 && (s = false), c === void 0 && (c = 1), i();
    const d = e.getBoundingClientRect(), {
      left: u,
      top: f,
      width: h,
      height: p
    } = d;
    if (s || t(), !h || !p)
      return;
    const x = tn(f), m = tn(o.clientWidth - (u + h)), b = tn(o.clientHeight - (f + p)), w = tn(u), v = {
      rootMargin: -x + "px " + -m + "px " + -b + "px " + -w + "px",
      threshold: Qe(0, Tt(1, c)) || 1
    };
    let k = true;
    function C(E) {
      const j = E[0].intersectionRatio;
      if (j !== c) {
        if (!k)
          return a();
        j ? a(false, j) : n = setTimeout(() => {
          a(false, 1e-7);
        }, 1e3);
      }
      j === 1 && !Zs(d, e.getBoundingClientRect()) && a(), k = false;
    }
    try {
      r = new IntersectionObserver(C, {
        ...v,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(C, v);
    }
    r.observe(e);
  }
  return a(true), i;
}
function am(e, t, r, n) {
  n === void 0 && (n = {});
  const {
    ancestorScroll: o = true,
    ancestorResize: i = true,
    elementResize: a = typeof ResizeObserver == "function",
    layoutShift: s = typeof IntersectionObserver == "function",
    animationFrame: c = false
  } = n, d = wi(e), u = o || i ? [...d ? Or(d) : [], ...Or(t)] : [];
  u.forEach((w) => {
    o && w.addEventListener("scroll", r, {
      passive: true
    }), i && w.addEventListener("resize", r);
  });
  const f = d && s ? im(d, r) : null;
  let h = -1, p = null;
  a && (p = new ResizeObserver((w) => {
    let [y] = w;
    y && y.target === d && p && (p.unobserve(t), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var v;
      (v = p) == null || v.observe(t);
    })), r();
  }), d && !c && p.observe(d), p.observe(t));
  let x, m = c ? $t(e) : null;
  c && b();
  function b() {
    const w = $t(e);
    m && !Zs(m, w) && r(), m = w, x = requestAnimationFrame(b);
  }
  return r(), () => {
    var w;
    u.forEach((y) => {
      o && y.removeEventListener("scroll", r), i && y.removeEventListener("resize", r);
    }), f == null || f(), (w = p) == null || w.disconnect(), p = null, c && cancelAnimationFrame(x);
  };
}
const sm = zh, cm = Ph, lm = Rh, dm = Ih, um = Th, ka = Nh, fm = Oh, pm = (e, t, r) => {
  const n = /* @__PURE__ */ new Map(), o = {
    platform: om,
    ...r
  }, i = {
    ...o.platform,
    _c: n
  };
  return jh(e, t, {
    ...o,
    platform: i
  });
};
var hm = typeof document < "u", mm = function() {
}, fn = hm ? useLayoutEffect : mm;
function jn(e, t) {
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
        if (!jn(e[n], t[n]))
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
      if (!(i === "_owner" && e.$$typeof) && !jn(e[i], t[i]))
        return false;
    }
    return true;
  }
  return e !== e && t !== t;
}
function Qs(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ca(e, t) {
  const r = Qs(e);
  return Math.round(t * r) / r;
}
function bo(e) {
  const t = g.useRef(e);
  return fn(() => {
    t.current = e;
  }), t;
}
function gm(e) {
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
    whileElementsMounted: c,
    open: d
  } = e, [u, f] = g.useState({
    x: 0,
    y: 0,
    strategy: r,
    placement: t,
    middlewareData: {},
    isPositioned: false
  }), [h, p] = g.useState(n);
  jn(h, n) || p(n);
  const [x, m] = g.useState(null), [b, w] = g.useState(null), y = g.useCallback((R) => {
    R !== E.current && (E.current = R, m(R));
  }, []), v = g.useCallback((R) => {
    R !== j.current && (j.current = R, w(R));
  }, []), k = i || x, C = a || b, E = g.useRef(null), j = g.useRef(null), S = g.useRef(u), O = c != null, M = bo(c), P = bo(o), _ = bo(d), D = g.useCallback(() => {
    if (!E.current || !j.current)
      return;
    const R = {
      placement: t,
      strategy: r,
      middleware: h
    };
    P.current && (R.platform = P.current), pm(E.current, j.current, R).then((q) => {
      const ne = {
        ...q,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: _.current !== false
      };
      K.current && !jn(S.current, ne) && (S.current = ne, Pn.flushSync(() => {
        f(ne);
      }));
    });
  }, [h, t, r, P, _]);
  fn(() => {
    d === false && S.current.isPositioned && (S.current.isPositioned = false, f((R) => ({
      ...R,
      isPositioned: false
    })));
  }, [d]);
  const K = g.useRef(false);
  fn(() => (K.current = true, () => {
    K.current = false;
  }), []), fn(() => {
    if (k && (E.current = k), C && (j.current = C), k && C) {
      if (M.current)
        return M.current(k, C, D);
      D();
    }
  }, [k, C, D, M, O]);
  const U = g.useMemo(() => ({
    reference: E,
    floating: j,
    setReference: y,
    setFloating: v
  }), [y, v]), $ = g.useMemo(() => ({
    reference: k,
    floating: C
  }), [k, C]), W = g.useMemo(() => {
    const R = {
      position: r,
      left: 0,
      top: 0
    };
    if (!$.floating)
      return R;
    const q = Ca($.floating, u.x), ne = Ca($.floating, u.y);
    return s ? {
      ...R,
      transform: "translate(" + q + "px, " + ne + "px)",
      ...Qs($.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: r,
      left: q,
      top: ne
    };
  }, [r, s, $.floating, u.x, u.y]);
  return g.useMemo(() => ({
    ...u,
    update: D,
    refs: U,
    elements: $,
    floatingStyles: W
  }), [u, D, U, $, W]);
}
const bm = (e) => {
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
      return n && t(n) ? n.current != null ? ka({
        element: n.current,
        padding: o
      }).fn(r) : {} : n ? ka({
        element: n,
        padding: o
      }).fn(r) : {};
    }
  };
}, vm = (e, t) => ({
  ...sm(e),
  options: [e, t]
}), xm = (e, t) => ({
  ...cm(e),
  options: [e, t]
}), wm = (e, t) => ({
  ...fm(e),
  options: [e, t]
}), ym = (e, t) => ({
  ...lm(e),
  options: [e, t]
}), km = (e, t) => ({
  ...dm(e),
  options: [e, t]
}), Cm = (e, t) => ({
  ...um(e),
  options: [e, t]
}), Sm = (e, t) => ({
  ...bm(e),
  options: [e, t]
});
var Em = "Arrow", ec = g.forwardRef((e, t) => {
  const { children: r, width: n = 10, height: o = 5, ...i } = e;
  return /* @__PURE__ */ l.jsx(
    je.svg,
    {
      ...i,
      ref: t,
      width: n,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? r : /* @__PURE__ */ l.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
ec.displayName = Em;
var jm = ec;
function Nm(e) {
  const [t, r] = g.useState(void 0);
  return He(() => {
    if (e) {
      r({ width: e.offsetWidth, height: e.offsetHeight });
      const n = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const i = o[0];
        let a, s;
        if ("borderBoxSize" in i) {
          const c = i.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          a = d.inlineSize, s = d.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        r({ width: a, height: s });
      });
      return n.observe(e, { box: "border-box" }), () => n.unobserve(e);
    } else
      r(void 0);
  }, [e]), t;
}
var yi = "Popper", [tc, fr] = Wr(yi), [Rm, rc] = tc(yi);
var oc = "PopperAnchor", ic = g.forwardRef(
  (e, t) => {
    const { __scopePopper: r, virtualRef: n, ...o } = e, i = rc(oc, r), a = g.useRef(null), s = Ne(t, a), c = g.useRef(null);
    return g.useEffect(() => {
      const d = c.current;
      c.current = (n == null ? void 0 : n.current) || a.current, d !== c.current && i.onAnchorChange(c.current);
    }), n ? null : /* @__PURE__ */ l.jsx(je.div, { ...o, ref: s });
  }
);
ic.displayName = oc;
var ki = "PopperContent", [Tm, Am] = tc(ki), ac = g.forwardRef(
  (e, t) => {
    var z2, J, te, F, oe, Q;
    const {
      __scopePopper: r,
      side: n = "bottom",
      sideOffset: o = 0,
      align: i = "center",
      alignOffset: a = 0,
      arrowPadding: s = 0,
      avoidCollisions: c = true,
      collisionBoundary: d = [],
      collisionPadding: u = 0,
      sticky: f = "partial",
      hideWhenDetached: h = false,
      updatePositionStrategy: p = "optimized",
      onPlaced: x,
      ...m
    } = e, b = rc(ki, r), [w, y] = g.useState(null), v = Ne(t, (Ce) => y(Ce)), [k, C] = g.useState(null), E = Nm(k), j = (E == null ? void 0 : E.width) ?? 0, S = (E == null ? void 0 : E.height) ?? 0, O = n + (i !== "center" ? "-" + i : ""), M = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u }, P = Array.isArray(d) ? d : [d], _ = P.length > 0, D = {
      padding: M,
      boundary: P.filter(Pm),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: _
    }, { refs: K, floatingStyles: U, placement: $, isPositioned: W, middlewareData: R } = gm({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: O,
      whileElementsMounted: (...Ce) => am(...Ce, {
        animationFrame: p === "always"
      }),
      elements: {
        reference: b.anchor
      },
      middleware: [
        vm({ mainAxis: o + S, alignmentAxis: a }),
        c && xm({
          mainAxis: true,
          crossAxis: false,
          limiter: f === "partial" ? wm() : void 0,
          ...D
        }),
        c && ym({ ...D }),
        km({
          ...D,
          apply: ({ elements: Ce, rects: ye, availableWidth: ze, availableHeight: Me }) => {
            const { width: Ge, height: yt } = ye.reference, Ze = Ce.floating.style;
            Ze.setProperty("--radix-popper-available-width", `${ze}px`), Ze.setProperty("--radix-popper-available-height", `${Me}px`), Ze.setProperty("--radix-popper-anchor-width", `${Ge}px`), Ze.setProperty("--radix-popper-anchor-height", `${yt}px`);
          }
        }),
        k && Sm({ element: k, padding: s }),
        Om({ arrowWidth: j, arrowHeight: S }),
        h && Cm({ strategy: "referenceHidden", ...D })
      ]
    }), [q, ne] = lc($), N = Lt(x);
    He(() => {
      W && (N == null || N());
    }, [W, N]);
    const L = (z2 = R.arrow) == null ? void 0 : z2.x, G = (J = R.arrow) == null ? void 0 : J.y, B = ((te = R.arrow) == null ? void 0 : te.centerOffset) !== 0, [xe, se] = g.useState();
    return He(() => {
      w && se(window.getComputedStyle(w).zIndex);
    }, [w]), /* @__PURE__ */ l.jsx(
      "div",
      {
        ref: K.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...U,
          transform: W ? U.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: xe,
          "--radix-popper-transform-origin": [
            (F = R.transformOrigin) == null ? void 0 : F.x,
            (oe = R.transformOrigin) == null ? void 0 : oe.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Q = R.hide) == null ? void 0 : Q.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: e.dir,
        children: /* @__PURE__ */ l.jsx(
          Tm,
          {
            scope: r,
            placedSide: q,
            onArrowChange: C,
            arrowX: L,
            arrowY: G,
            shouldHideArrow: B,
            children: /* @__PURE__ */ l.jsx(
              je.div,
              {
                "data-side": q,
                "data-align": ne,
                ...m,
                ref: v,
                style: {
                  ...m.style,
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
ac.displayName = ki;
var sc = "PopperArrow", zm = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, cc = g.forwardRef(function(t, r) {
  const { __scopePopper: n, ...o } = t, i = Am(sc, n), a = zm[i.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ l.jsx(
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
        children: /* @__PURE__ */ l.jsx(
          jm,
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
cc.displayName = sc;
function Pm(e) {
  return e !== null;
}
var Om = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var b, w, y;
    const { placement: r, rects: n, middlewareData: o } = t, a = ((b = o.arrow) == null ? void 0 : b.centerOffset) !== 0, s = a ? 0 : e.arrowWidth, c = a ? 0 : e.arrowHeight, [d, u] = lc(r), f = { start: "0%", center: "50%", end: "100%" }[u], h = (((w = o.arrow) == null ? void 0 : w.x) ?? 0) + s / 2, p = (((y = o.arrow) == null ? void 0 : y.y) ?? 0) + c / 2;
    let x = "", m = "";
    return d === "bottom" ? (x = a ? f : `${h}px`, m = `${-c}px`) : d === "top" ? (x = a ? f : `${h}px`, m = `${n.floating.height + c}px`) : d === "right" ? (x = `${-c}px`, m = a ? f : `${p}px`) : d === "left" && (x = `${n.floating.width + c}px`, m = a ? f : `${p}px`), { data: { x, y: m } };
  }
});
function lc(e) {
  const [t, r = "center"] = e.split("-");
  return [t, r];
}
var Yn = ic, Si = ac, Ei = cc, Im = "Portal", Gn = g.forwardRef((e, t) => {
  var s;
  const { container: r, ...n } = e, [o, i] = g.useState(false);
  He(() => i(true), []);
  const a = r || o && ((s = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : s.body);
  return a ? Pn__default.createPortal(/* @__PURE__ */ l.jsx(je.div, { ...n, ref: t }), a) : null;
});
Gn.displayName = Im;
function Lm(e) {
  const t = g.useRef({ value: e, previous: e });
  return g.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
var dc = Object.freeze({
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
}), $m = "VisuallyHidden", uc = g.forwardRef(
  (e, t) => /* @__PURE__ */ l.jsx(
    je.span,
    {
      ...e,
      ref: t,
      style: { ...dc, ...e.style }
    }
  )
);
uc.displayName = $m;
var Fm = uc, Wm = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Ht = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap(), nn = {}, vo = 0, fc = function(e) {
  return e && (e.host || fc(e.parentNode));
}, Um = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = fc(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, Bm = function(e, t, r, n) {
  var o = Um(t, Array.isArray(e) ? e : [e]);
  nn[r] || (nn[r] = /* @__PURE__ */ new WeakMap());
  var i = nn[r], a = [], s = /* @__PURE__ */ new Set(), c = new Set(o), d = function(f) {
    !f || s.has(f) || (s.add(f), d(f.parentNode));
  };
  o.forEach(d);
  var u = function(f) {
    !f || c.has(f) || Array.prototype.forEach.call(f.children, function(h) {
      if (s.has(h))
        u(h);
      else
        try {
          var p = h.getAttribute(n), x = p !== null && p !== "false", m = (Ht.get(h) || 0) + 1, b = (i.get(h) || 0) + 1;
          Ht.set(h, m), i.set(h, b), a.push(h), m === 1 && x && rn.set(h, true), b === 1 && h.setAttribute(r, "true"), x || h.setAttribute(n, "true");
        } catch (w) {
          console.error("aria-hidden: cannot operate on ", h, w);
        }
    });
  };
  return u(t), s.clear(), vo++, function() {
    a.forEach(function(f) {
      var h = Ht.get(f) - 1, p = i.get(f) - 1;
      Ht.set(f, h), i.set(f, p), h || (rn.has(f) || f.removeAttribute(n), rn.delete(f)), p || f.removeAttribute(r);
    }), vo--, vo || (Ht = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), rn = /* @__PURE__ */ new WeakMap(), nn = {});
  };
}, pc = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = Wm(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), Bm(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, dt = function() {
  return dt = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
    }
    return t;
  }, dt.apply(this, arguments);
};
function hc(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function Hm(e, t, r) {
  for (var n = 0, o = t.length, i; n < o; n++)
    (i || !(n in t)) && (i || (i = Array.prototype.slice.call(t, 0, n)), i[n] = t[n]);
  return e.concat(i || Array.prototype.slice.call(t));
}
var pn = "right-scroll-bar-position", hn = "width-before-scroll-bar", Vm = "with-scroll-bars-hidden", Km = "--removed-body-scroll-bar-size";
function xo(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Ym(e, t) {
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
var Gm = typeof window < "u" ? g.useLayoutEffect : g.useEffect, Sa = /* @__PURE__ */ new WeakMap();
function qm(e, t) {
  var r = Ym(null, function(n) {
    return e.forEach(function(o) {
      return xo(o, n);
    });
  });
  return Gm(function() {
    var n = Sa.get(r);
    if (n) {
      var o = new Set(n), i = new Set(e), a = r.current;
      o.forEach(function(s) {
        i.has(s) || xo(s, null);
      }), i.forEach(function(s) {
        o.has(s) || xo(s, a);
      });
    }
    Sa.set(r, e);
  }, [e]), r;
}
function Xm(e) {
  return e;
}
function Jm(e, t) {
  t === void 0 && (t = Xm);
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
      var c = function() {
        var u = a;
        a = [], u.forEach(i);
      }, d = function() {
        return Promise.resolve().then(c);
      };
      d(), r = {
        push: function(u) {
          a.push(u), d();
        },
        filter: function(u) {
          return a = a.filter(u), r;
        }
      };
    }
  };
  return o;
}
function Zm(e) {
  e === void 0 && (e = {});
  var t = Jm(null);
  return t.options = dt({ async: true, ssr: false }, e), t;
}
var mc = function(e) {
  var t = e.sideCar, r = hc(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return g.createElement(n, dt({}, r));
};
mc.isSideCarExport = true;
function Qm(e, t) {
  return e.useMedium(t), mc;
}
var gc = Zm(), wo = function() {
}, qn = g.forwardRef(function(e, t) {
  var r = g.useRef(null), n = g.useState({
    onScrollCapture: wo,
    onWheelCapture: wo,
    onTouchMoveCapture: wo
  }), o = n[0], i = n[1], a = e.forwardProps, s = e.children, c = e.className, d = e.removeScrollBar, u = e.enabled, f = e.shards, h = e.sideCar, p = e.noRelative, x = e.noIsolation, m = e.inert, b = e.allowPinchZoom, w = e.as, y = w === void 0 ? "div" : w, v = e.gapMode, k = hc(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = h, E = qm([r, t]), j = dt(dt({}, k), o);
  return g.createElement(
    g.Fragment,
    null,
    u && g.createElement(C, { sideCar: gc, removeScrollBar: d, shards: f, noRelative: p, noIsolation: x, inert: m, setCallbacks: i, allowPinchZoom: !!b, lockRef: r, gapMode: v }),
    a ? g.cloneElement(g.Children.only(s), dt(dt({}, j), { ref: E })) : g.createElement(y, dt({}, j, { className: c, ref: E }), s)
  );
});
qn.defaultProps = {
  enabled: true,
  removeScrollBar: true,
  inert: false
};
qn.classNames = {
  fullWidth: hn,
  zeroRight: pn
};
var eg = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function tg() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = eg();
  return t && e.setAttribute("nonce", t), e;
}
function rg(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function ng(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var og = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = tg()) && (rg(t, r), ng(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, ig = function() {
  var e = og();
  return function(t, r) {
    g.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, bc = function() {
  var e = ig(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, ag = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, yo = function(e) {
  return parseInt(e || "", 10) || 0;
}, sg = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [yo(r), yo(n), yo(o)];
}, cg = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return ag;
  var t = sg(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, lg = bc(), Zt = "data-scroll-locked", dg = function(e, t, r, n) {
  var o = e.left, i = e.top, a = e.right, s = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Vm, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(s, "px ").concat(n, `;
  }
  body[`).concat(Zt, `] {
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
  
  .`).concat(pn, ` {
    right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(hn, ` {
    margin-right: `).concat(s, "px ").concat(n, `;
  }
  
  .`).concat(pn, " .").concat(pn, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(hn, " .").concat(hn, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(Zt, `] {
    `).concat(Km, ": ").concat(s, `px;
  }
`);
}, Ea = function() {
  var e = parseInt(document.body.getAttribute(Zt) || "0", 10);
  return isFinite(e) ? e : 0;
}, ug = function() {
  g.useEffect(function() {
    return document.body.setAttribute(Zt, (Ea() + 1).toString()), function() {
      var e = Ea() - 1;
      e <= 0 ? document.body.removeAttribute(Zt) : document.body.setAttribute(Zt, e.toString());
    };
  }, []);
}, fg = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  ug();
  var i = g.useMemo(function() {
    return cg(o);
  }, [o]);
  return g.createElement(lg, { styles: dg(i, !t, o, r ? "" : "!important") });
}, _o = false;
if (typeof window < "u")
  try {
    var on = Object.defineProperty({}, "passive", {
      get: function() {
        return _o = true, true;
      }
    });
    window.addEventListener("test", on, on), window.removeEventListener("test", on, on);
  } catch {
    _o = false;
  }
var Vt = _o ? { passive: false } : false, pg = function(e) {
  return e.tagName === "TEXTAREA";
}, vc = function(e, t) {
  if (!(e instanceof Element))
    return false;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !pg(e) && r[t] === "visible")
  );
}, hg = function(e) {
  return vc(e, "overflowY");
}, mg = function(e) {
  return vc(e, "overflowX");
}, ja = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = xc(e, n);
    if (o) {
      var i = wc(e, n), a = i[1], s = i[2];
      if (a > s)
        return true;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return false;
}, gg = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, bg = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, xc = function(e, t) {
  return e === "v" ? hg(t) : mg(t);
}, wc = function(e, t) {
  return e === "v" ? gg(t) : bg(t);
}, vg = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, xg = function(e, t, r, n, o) {
  var i = vg(e, window.getComputedStyle(t).direction), a = i * n, s = r.target, c = t.contains(s), d = false, u = a > 0, f = 0, h = 0;
  do {
    if (!s)
      break;
    var p = wc(e, s), x = p[0], m = p[1], b = p[2], w = m - b - i * x;
    (x || w) && xc(e, s) && (f += w, h += x);
    var y = s.parentNode;
    s = y && y.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? y.host : y;
  } while (
    // portaled content
    !c && s !== document.body || // self content
    c && (t.contains(s) || t === s)
  );
  return (u && Math.abs(f) < 1 || !u && Math.abs(h) < 1) && (d = true), d;
}, an = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Na = function(e) {
  return [e.deltaX, e.deltaY];
}, Ra = function(e) {
  return e && "current" in e ? e.current : e;
}, wg = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, yg = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, kg = 0, Kt = [];
function Cg(e) {
  var t = g.useRef([]), r = g.useRef([0, 0]), n = g.useRef(), o = g.useState(kg++)[0], i = g.useState(bc)[0], a = g.useRef(e);
  g.useEffect(function() {
    a.current = e;
  }, [e]), g.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var m = Hm([e.lockRef.current], (e.shards || []).map(Ra)).filter(Boolean);
      return m.forEach(function(b) {
        return b.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), m.forEach(function(b) {
          return b.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var s = g.useCallback(function(m, b) {
    if ("touches" in m && m.touches.length === 2 || m.type === "wheel" && m.ctrlKey)
      return !a.current.allowPinchZoom;
    var w = an(m), y = r.current, v = "deltaX" in m ? m.deltaX : y[0] - w[0], k = "deltaY" in m ? m.deltaY : y[1] - w[1], C, E = m.target, j = Math.abs(v) > Math.abs(k) ? "h" : "v";
    if ("touches" in m && j === "h" && E.type === "range")
      return false;
    var S = window.getSelection(), O = S && S.anchorNode, M = O ? O === E || O.contains(E) : false;
    if (M)
      return false;
    var P = ja(j, E);
    if (!P)
      return true;
    if (P ? C = j : (C = j === "v" ? "h" : "v", P = ja(j, E)), !P)
      return false;
    if (!n.current && "changedTouches" in m && (v || k) && (n.current = C), !C)
      return true;
    var _ = n.current || C;
    return xg(_, b, m, _ === "h" ? v : k);
  }, []), c = g.useCallback(function(m) {
    var b = m;
    if (!(!Kt.length || Kt[Kt.length - 1] !== i)) {
      var w = "deltaY" in b ? Na(b) : an(b), y = t.current.filter(function(C) {
        return C.name === b.type && (C.target === b.target || b.target === C.shadowParent) && wg(C.delta, w);
      })[0];
      if (y && y.should) {
        b.cancelable && b.preventDefault();
        return;
      }
      if (!y) {
        var v = (a.current.shards || []).map(Ra).filter(Boolean).filter(function(C) {
          return C.contains(b.target);
        }), k = v.length > 0 ? s(b, v[0]) : !a.current.noIsolation;
        k && b.cancelable && b.preventDefault();
      }
    }
  }, []), d = g.useCallback(function(m, b, w, y) {
    var v = { name: m, delta: b, target: w, should: y, shadowParent: Sg(w) };
    t.current.push(v), setTimeout(function() {
      t.current = t.current.filter(function(k) {
        return k !== v;
      });
    }, 1);
  }, []), u = g.useCallback(function(m) {
    r.current = an(m), n.current = void 0;
  }, []), f = g.useCallback(function(m) {
    d(m.type, Na(m), m.target, s(m, e.lockRef.current));
  }, []), h = g.useCallback(function(m) {
    d(m.type, an(m), m.target, s(m, e.lockRef.current));
  }, []);
  g.useEffect(function() {
    return Kt.push(i), e.setCallbacks({
      onScrollCapture: f,
      onWheelCapture: f,
      onTouchMoveCapture: h
    }), document.addEventListener("wheel", c, Vt), document.addEventListener("touchmove", c, Vt), document.addEventListener("touchstart", u, Vt), function() {
      Kt = Kt.filter(function(m) {
        return m !== i;
      }), document.removeEventListener("wheel", c, Vt), document.removeEventListener("touchmove", c, Vt), document.removeEventListener("touchstart", u, Vt);
    };
  }, []);
  var p = e.removeScrollBar, x = e.inert;
  return g.createElement(
    g.Fragment,
    null,
    x ? g.createElement(i, { styles: yg(o) }) : null,
    p ? g.createElement(fg, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Sg(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Eg = Qm(gc, Cg);
var ji = g.forwardRef(function(e, t) {
  return g.createElement(qn, dt({}, e, { ref: t, sideCar: Eg }));
});
ji.classNames = qn.classNames;
var jg = [" ", "Enter", "ArrowUp", "ArrowDown"], Ng = [" ", "Enter"], Ft = "Select", [Xn, Jn, Rg] = Kp(Ft), [pr] = Wr(Ft, [
  Rg,
  fr
]), Zn = fr(), [Tg, zt] = pr(Ft), [Ag, zg] = pr(Ft);
var kc = "SelectTrigger", Cc = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, disabled: n = false, ...o } = e, i = Zn(r), a = zt(kc, r), s = a.disabled || n, c = Ne(t, a.onTriggerChange), d = Jn(r), u = g.useRef("touch"), [f, h, p] = Bc((m) => {
      const b = d().filter((v) => !v.disabled), w = b.find((v) => v.value === a.value), y = Hc(b, m, w);
      y !== void 0 && a.onValueChange(y.value);
    }), x = (m) => {
      s || (a.onOpenChange(true), p()), m && (a.triggerPointerDownPosRef.current = {
        x: Math.round(m.pageX),
        y: Math.round(m.pageY)
      });
    };
    return /* @__PURE__ */ l.jsx(Yn, { asChild: true, ...i, children: /* @__PURE__ */ l.jsx(
      je.button,
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
        "data-placeholder": Uc(a.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: be(o.onClick, (m) => {
          m.currentTarget.focus(), u.current !== "mouse" && x(m);
        }),
        onPointerDown: be(o.onPointerDown, (m) => {
          u.current = m.pointerType;
          const b = m.target;
          b.hasPointerCapture(m.pointerId) && b.releasePointerCapture(m.pointerId), m.button === 0 && m.ctrlKey === false && m.pointerType === "mouse" && (x(m), m.preventDefault());
        }),
        onKeyDown: be(o.onKeyDown, (m) => {
          const b = f.current !== "";
          !(m.ctrlKey || m.altKey || m.metaKey) && m.key.length === 1 && h(m.key), !(b && m.key === " ") && jg.includes(m.key) && (x(), m.preventDefault());
        })
      }
    ) });
  }
);
Cc.displayName = kc;
var Sc = "SelectValue", Ec = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, children: i, placeholder: a = "", ...s } = e, c = zt(Sc, r), { onValueNodeHasChildrenChange: d } = c, u = i !== void 0, f = Ne(t, c.onValueNodeChange);
    return He(() => {
      d(u);
    }, [d, u]), /* @__PURE__ */ l.jsx(
      je.span,
      {
        ...s,
        ref: f,
        style: { pointerEvents: "none" },
        children: Uc(c.value) ? /* @__PURE__ */ l.jsx(l.Fragment, { children: a }) : i
      }
    );
  }
);
Ec.displayName = Sc;
var Pg = "SelectIcon", jc = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, children: n, ...o } = e;
    return /* @__PURE__ */ l.jsx(je.span, { "aria-hidden": true, ...o, ref: t, children: n || "▼" });
  }
);
jc.displayName = Pg;
var Og = "SelectPortal", Nc = (e) => /* @__PURE__ */ l.jsx(Gn, { asChild: true, ...e });
Nc.displayName = Og;
var Wt = "SelectContent", Rc = g.forwardRef(
  (e, t) => {
    const r = zt(Wt, e.__scopeSelect), [n, o] = g.useState();
    if (He(() => {
      o(new DocumentFragment());
    }, []), !r.open) {
      const i = n;
      return i ? Pn.createPortal(
        /* @__PURE__ */ l.jsx(Tc, { scope: e.__scopeSelect, children: /* @__PURE__ */ l.jsx(Xn.Slot, { scope: e.__scopeSelect, children: /* @__PURE__ */ l.jsx("div", { children: e.children }) }) }),
        i
      ) : null;
    }
    return /* @__PURE__ */ l.jsx(Ac, { ...e, ref: t });
  }
);
Rc.displayName = Wt;
var ot = 10, [Tc, Pt] = pr(Wt), Ig = "SelectContentImpl", Dg = /* @__PURE__ */ tr("SelectContent.RemoveScroll"), Ac = g.forwardRef(
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
      sideOffset: c,
      align: d,
      alignOffset: u,
      arrowPadding: f,
      collisionBoundary: h,
      collisionPadding: p,
      sticky: x,
      hideWhenDetached: m,
      avoidCollisions: b,
      //
      ...w
    } = e, y = zt(Wt, r), [v, k] = g.useState(null), [C, E] = g.useState(null), j = Ne(t, (z2) => k(z2)), [S, O] = g.useState(null), [M, P] = g.useState(
      null
    ), _ = Jn(r), [D, K] = g.useState(false), U = g.useRef(false);
    g.useEffect(() => {
      if (v) return pc(v);
    }, [v]), Ws();
    const $ = g.useCallback(
      (z2) => {
        const [J, ...te] = _().map((Q) => Q.ref.current), [F] = te.slice(-1), oe = document.activeElement;
        for (const Q of z2)
          if (Q === oe || (Q == null || Q.scrollIntoView({ block: "nearest" }), Q === J && C && (C.scrollTop = 0), Q === F && C && (C.scrollTop = C.scrollHeight), Q == null || Q.focus(), document.activeElement !== oe)) return;
      },
      [_, C]
    ), W = g.useCallback(
      () => $([S, v]),
      [$, S, v]
    );
    g.useEffect(() => {
      D && W();
    }, [D, W]);
    const { onOpenChange: R, triggerPointerDownPosRef: q } = y;
    g.useEffect(() => {
      if (v) {
        let z2 = { x: 0, y: 0 };
        const J = (F) => {
          var oe, Q;
          z2 = {
            x: Math.abs(Math.round(F.pageX) - (((oe = q.current) == null ? void 0 : oe.x) ?? 0)),
            y: Math.abs(Math.round(F.pageY) - (((Q = q.current) == null ? void 0 : Q.y) ?? 0))
          };
        }, te = (F) => {
          z2.x <= 10 && z2.y <= 10 ? F.preventDefault() : v.contains(F.target) || R(false), document.removeEventListener("pointermove", J), q.current = null;
        };
        return q.current !== null && (document.addEventListener("pointermove", J), document.addEventListener("pointerup", te, { capture: true, once: true })), () => {
          document.removeEventListener("pointermove", J), document.removeEventListener("pointerup", te, { capture: true });
        };
      }
    }, [v, R, q]), g.useEffect(() => {
      const z2 = () => R(false);
      return window.addEventListener("blur", z2), window.addEventListener("resize", z2), () => {
        window.removeEventListener("blur", z2), window.removeEventListener("resize", z2);
      };
    }, [R]);
    const [ne, N] = Bc((z2) => {
      const J = _().filter((oe) => !oe.disabled), te = J.find((oe) => oe.ref.current === document.activeElement), F = Hc(J, z2, te);
      F && setTimeout(() => F.ref.current.focus());
    }), L = g.useCallback(
      (z2, J, te) => {
        const F = !U.current && !te;
        (y.value !== void 0 && y.value === J || F) && (O(z2), F && (U.current = true));
      },
      [y.value]
    ), G = g.useCallback(() => v == null ? void 0 : v.focus(), [v]), B = g.useCallback(
      (z2, J, te) => {
        const F = !U.current && !te;
        (y.value !== void 0 && y.value === J || F) && P(z2);
      },
      [y.value]
    ), xe = n === "popper" ? Lo : zc, se = xe === Lo ? {
      side: s,
      sideOffset: c,
      align: d,
      alignOffset: u,
      arrowPadding: f,
      collisionBoundary: h,
      collisionPadding: p,
      sticky: x,
      hideWhenDetached: m,
      avoidCollisions: b
    } : {};
    return /* @__PURE__ */ l.jsx(
      Tc,
      {
        scope: r,
        content: v,
        viewport: C,
        onViewportChange: E,
        itemRefCallback: L,
        selectedItem: S,
        onItemLeave: G,
        itemTextRefCallback: B,
        focusSelectedItem: W,
        selectedItemText: M,
        position: n,
        isPositioned: D,
        searchRef: ne,
        children: /* @__PURE__ */ l.jsx(ji, { as: Dg, allowPinchZoom: true, children: /* @__PURE__ */ l.jsx(
          hi,
          {
            asChild: true,
            trapped: y.open,
            onMountAutoFocus: (z2) => {
              z2.preventDefault();
            },
            onUnmountAutoFocus: be(o, (z2) => {
              var J;
              (J = y.trigger) == null || J.focus({ preventScroll: true }), z2.preventDefault();
            }),
            children: /* @__PURE__ */ l.jsx(
              Un,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown: i,
                onPointerDownOutside: a,
                onFocusOutside: (z2) => z2.preventDefault(),
                onDismiss: () => y.onOpenChange(false),
                children: /* @__PURE__ */ l.jsx(
                  xe,
                  {
                    role: "listbox",
                    id: y.contentId,
                    "data-state": y.open ? "open" : "closed",
                    dir: y.dir,
                    onContextMenu: (z2) => z2.preventDefault(),
                    ...w,
                    ...se,
                    onPlaced: () => K(true),
                    ref: j,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...w.style
                    },
                    onKeyDown: be(w.onKeyDown, (z2) => {
                      const J = z2.ctrlKey || z2.altKey || z2.metaKey;
                      if (z2.key === "Tab" && z2.preventDefault(), !J && z2.key.length === 1 && N(z2.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(z2.key)) {
                        let F = _().filter((oe) => !oe.disabled).map((oe) => oe.ref.current);
                        if (["ArrowUp", "End"].includes(z2.key) && (F = F.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(z2.key)) {
                          const oe = z2.target, Q = F.indexOf(oe);
                          F = F.slice(Q + 1);
                        }
                        setTimeout(() => $(F)), z2.preventDefault();
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
Ac.displayName = Ig;
var Mg = "SelectItemAlignedPosition", zc = g.forwardRef((e, t) => {
  const { __scopeSelect: r, onPlaced: n, ...o } = e, i = zt(Wt, r), a = Pt(Wt, r), [s, c] = g.useState(null), [d, u] = g.useState(null), f = Ne(t, (j) => u(j)), h = Jn(r), p = g.useRef(false), x = g.useRef(true), { viewport: m, selectedItem: b, selectedItemText: w, focusSelectedItem: y } = a, v = g.useCallback(() => {
    if (i.trigger && i.valueNode && s && d && m && b && w) {
      const j = i.trigger.getBoundingClientRect(), S = d.getBoundingClientRect(), O = i.valueNode.getBoundingClientRect(), M = w.getBoundingClientRect();
      if (i.dir !== "rtl") {
        const oe = M.left - S.left, Q = O.left - oe, Ce = j.left - Q, ye = j.width + Ce, ze = Math.max(ye, S.width), Me = window.innerWidth - ot, Ge = oa(Q, [
          ot,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(ot, Me - ze)
        ]);
        s.style.minWidth = ye + "px", s.style.left = Ge + "px";
      } else {
        const oe = S.right - M.right, Q = window.innerWidth - O.right - oe, Ce = window.innerWidth - j.right - Q, ye = j.width + Ce, ze = Math.max(ye, S.width), Me = window.innerWidth - ot, Ge = oa(Q, [
          ot,
          Math.max(ot, Me - ze)
        ]);
        s.style.minWidth = ye + "px", s.style.right = Ge + "px";
      }
      const P = h(), _ = window.innerHeight - ot * 2, D = m.scrollHeight, K = window.getComputedStyle(d), U = parseInt(K.borderTopWidth, 10), $ = parseInt(K.paddingTop, 10), W = parseInt(K.borderBottomWidth, 10), R = parseInt(K.paddingBottom, 10), q = U + $ + D + R + W, ne = Math.min(b.offsetHeight * 5, q), N = window.getComputedStyle(m), L = parseInt(N.paddingTop, 10), G = parseInt(N.paddingBottom, 10), B = j.top + j.height / 2 - ot, xe = _ - B, se = b.offsetHeight / 2, z2 = b.offsetTop + se, J = U + $ + z2, te = q - J;
      if (J <= B) {
        const oe = P.length > 0 && b === P[P.length - 1].ref.current;
        s.style.bottom = "0px";
        const Q = d.clientHeight - m.offsetTop - m.offsetHeight, Ce = Math.max(
          xe,
          se + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (oe ? G : 0) + Q + W
        ), ye = J + Ce;
        s.style.height = ye + "px";
      } else {
        const oe = P.length > 0 && b === P[0].ref.current;
        s.style.top = "0px";
        const Ce = Math.max(
          B,
          U + m.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (oe ? L : 0) + se
        ) + te;
        s.style.height = Ce + "px", m.scrollTop = J - B + m.offsetTop;
      }
      s.style.margin = `${ot}px 0`, s.style.minHeight = ne + "px", s.style.maxHeight = _ + "px", n == null || n(), requestAnimationFrame(() => p.current = true);
    }
  }, [
    h,
    i.trigger,
    i.valueNode,
    s,
    d,
    m,
    b,
    w,
    i.dir,
    n
  ]);
  He(() => v(), [v]);
  const [k, C] = g.useState();
  He(() => {
    d && C(window.getComputedStyle(d).zIndex);
  }, [d]);
  const E = g.useCallback(
    (j) => {
      j && x.current === true && (v(), y == null || y(), x.current = false);
    },
    [v, y]
  );
  return /* @__PURE__ */ l.jsx(
    Lg,
    {
      scope: r,
      contentWrapper: s,
      shouldExpandOnScrollRef: p,
      onScrollButtonChange: E,
      children: /* @__PURE__ */ l.jsx(
        "div",
        {
          ref: c,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: k
          },
          children: /* @__PURE__ */ l.jsx(
            je.div,
            {
              ...o,
              ref: f,
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
zc.displayName = Mg;
var _g = "SelectPopperPosition", Lo = g.forwardRef((e, t) => {
  const {
    __scopeSelect: r,
    align: n = "start",
    collisionPadding: o = ot,
    ...i
  } = e, a = Zn(r);
  return /* @__PURE__ */ l.jsx(
    Si,
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
Lo.displayName = _g;
var [Lg, Ni] = pr(Wt, {}), $o = "SelectViewport", Pc = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, nonce: n, ...o } = e, i = Pt($o, r), a = Ni($o, r), s = Ne(t, i.onViewportChange), c = g.useRef(0);
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
          },
          nonce: n
        }
      ),
      /* @__PURE__ */ l.jsx(Xn.Slot, { scope: r, children: /* @__PURE__ */ l.jsx(
        je.div,
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
          onScroll: be(o.onScroll, (d) => {
            const u = d.currentTarget, { contentWrapper: f, shouldExpandOnScrollRef: h } = a;
            if (h != null && h.current && f) {
              const p = Math.abs(c.current - u.scrollTop);
              if (p > 0) {
                const x = window.innerHeight - ot * 2, m = parseFloat(f.style.minHeight), b = parseFloat(f.style.height), w = Math.max(m, b);
                if (w < x) {
                  const y = w + p, v = Math.min(x, y), k = y - v;
                  f.style.height = v + "px", f.style.bottom === "0px" && (u.scrollTop = k > 0 ? k : 0, f.style.justifyContent = "flex-end");
                }
              }
            }
            c.current = u.scrollTop;
          })
        }
      ) })
    ] });
  }
);
Pc.displayName = $o;
var Oc = "SelectGroup", [$g, Fg] = pr(Oc), Wg = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Ur();
    return /* @__PURE__ */ l.jsx($g, { scope: r, id: o, children: /* @__PURE__ */ l.jsx(je.div, { role: "group", "aria-labelledby": o, ...n, ref: t }) });
  }
);
Wg.displayName = Oc;
var Ic = "SelectLabel", Ug = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Fg(Ic, r);
    return /* @__PURE__ */ l.jsx(je.div, { id: o.id, ...n, ref: t });
  }
);
Ug.displayName = Ic;
var Rn = "SelectItem", [Bg, Dc] = pr(Rn), Mc = g.forwardRef(
  (e, t) => {
    const {
      __scopeSelect: r,
      value: n,
      disabled: o = false,
      textValue: i,
      ...a
    } = e, s = zt(Rn, r), c = Pt(Rn, r), d = s.value === n, [u, f] = g.useState(i ?? ""), [h, p] = g.useState(false), x = Ne(
      t,
      (y) => {
        var v;
        return (v = c.itemRefCallback) == null ? void 0 : v.call(c, y, n, o);
      }
    ), m = Ur(), b = g.useRef("touch"), w = () => {
      o || (s.onValueChange(n), s.onOpenChange(false));
    };
    if (n === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    return /* @__PURE__ */ l.jsx(
      Bg,
      {
        scope: r,
        value: n,
        disabled: o,
        textId: m,
        isSelected: d,
        onItemTextChange: g.useCallback((y) => {
          f((v) => v || ((y == null ? void 0 : y.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ l.jsx(
          Xn.ItemSlot,
          {
            scope: r,
            value: n,
            disabled: o,
            textValue: u,
            children: /* @__PURE__ */ l.jsx(
              je.div,
              {
                role: "option",
                "aria-labelledby": m,
                "data-highlighted": h ? "" : void 0,
                "aria-selected": d && h,
                "data-state": d ? "checked" : "unchecked",
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                tabIndex: o ? void 0 : -1,
                ...a,
                ref: x,
                onFocus: be(a.onFocus, () => p(true)),
                onBlur: be(a.onBlur, () => p(false)),
                onClick: be(a.onClick, () => {
                  b.current !== "mouse" && w();
                }),
                onPointerUp: be(a.onPointerUp, () => {
                  b.current === "mouse" && w();
                }),
                onPointerDown: be(a.onPointerDown, (y) => {
                  b.current = y.pointerType;
                }),
                onPointerMove: be(a.onPointerMove, (y) => {
                  var v;
                  b.current = y.pointerType, o ? (v = c.onItemLeave) == null || v.call(c) : b.current === "mouse" && y.currentTarget.focus({ preventScroll: true });
                }),
                onPointerLeave: be(a.onPointerLeave, (y) => {
                  var v;
                  y.currentTarget === document.activeElement && ((v = c.onItemLeave) == null || v.call(c));
                }),
                onKeyDown: be(a.onKeyDown, (y) => {
                  var k;
                  ((k = c.searchRef) == null ? void 0 : k.current) !== "" && y.key === " " || (Ng.includes(y.key) && w(), y.key === " " && y.preventDefault());
                })
              }
            )
          }
        )
      }
    );
  }
);
Mc.displayName = Rn;
var Cr = "SelectItemText", _c = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, className: n, style: o, ...i } = e, a = zt(Cr, r), s = Pt(Cr, r), c = Dc(Cr, r), d = zg(Cr, r), [u, f] = g.useState(null), h = Ne(
      t,
      (w) => f(w),
      c.onItemTextChange,
      (w) => {
        var y;
        return (y = s.itemTextRefCallback) == null ? void 0 : y.call(s, w, c.value, c.disabled);
      }
    ), p = u == null ? void 0 : u.textContent, x = g.useMemo(
      () => /* @__PURE__ */ l.jsx("option", { value: c.value, disabled: c.disabled, children: p }, c.value),
      [c.disabled, c.value, p]
    ), { onNativeOptionAdd: m, onNativeOptionRemove: b } = d;
    return He(() => (m(x), () => b(x)), [m, b, x]), /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(je.span, { id: c.textId, ...i, ref: h }),
      c.isSelected && a.valueNode && !a.valueNodeHasChildren ? Pn.createPortal(i.children, a.valueNode) : null
    ] });
  }
);
_c.displayName = Cr;
var Lc = "SelectItemIndicator", $c = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return Dc(Lc, r).isSelected ? /* @__PURE__ */ l.jsx(je.span, { "aria-hidden": true, ...n, ref: t }) : null;
  }
);
$c.displayName = Lc;
var Fo = "SelectScrollUpButton", Hg = g.forwardRef((e, t) => {
  const r = Pt(Fo, e.__scopeSelect), n = Ni(Fo, e.__scopeSelect), [o, i] = g.useState(false), a = Ne(t, n.onScrollButtonChange);
  return He(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const d = c.scrollTop > 0;
        i(d);
      };
      const c = r.viewport;
      return s(), c.addEventListener("scroll", s), () => c.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ l.jsx(
    Fc,
    {
      ...e,
      ref: a,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: c } = r;
        s && c && (s.scrollTop = s.scrollTop - c.offsetHeight);
      }
    }
  ) : null;
});
Hg.displayName = Fo;
var Wo = "SelectScrollDownButton", Vg = g.forwardRef((e, t) => {
  const r = Pt(Wo, e.__scopeSelect), n = Ni(Wo, e.__scopeSelect), [o, i] = g.useState(false), a = Ne(t, n.onScrollButtonChange);
  return He(() => {
    if (r.viewport && r.isPositioned) {
      let s = function() {
        const d = c.scrollHeight - c.clientHeight, u = Math.ceil(c.scrollTop) < d;
        i(u);
      };
      const c = r.viewport;
      return s(), c.addEventListener("scroll", s), () => c.removeEventListener("scroll", s);
    }
  }, [r.viewport, r.isPositioned]), o ? /* @__PURE__ */ l.jsx(
    Fc,
    {
      ...e,
      ref: a,
      onAutoScroll: () => {
        const { viewport: s, selectedItem: c } = r;
        s && c && (s.scrollTop = s.scrollTop + c.offsetHeight);
      }
    }
  ) : null;
});
Vg.displayName = Wo;
var Fc = g.forwardRef((e, t) => {
  const { __scopeSelect: r, onAutoScroll: n, ...o } = e, i = Pt("SelectScrollButton", r), a = g.useRef(null), s = Jn(r), c = g.useCallback(() => {
    a.current !== null && (window.clearInterval(a.current), a.current = null);
  }, []);
  return g.useEffect(() => () => c(), [c]), He(() => {
    var u;
    const d = s().find((f) => f.ref.current === document.activeElement);
    (u = d == null ? void 0 : d.ref.current) == null || u.scrollIntoView({ block: "nearest" });
  }, [s]), /* @__PURE__ */ l.jsx(
    je.div,
    {
      "aria-hidden": true,
      ...o,
      ref: t,
      style: { flexShrink: 0, ...o.style },
      onPointerDown: be(o.onPointerDown, () => {
        a.current === null && (a.current = window.setInterval(n, 50));
      }),
      onPointerMove: be(o.onPointerMove, () => {
        var d;
        (d = i.onItemLeave) == null || d.call(i), a.current === null && (a.current = window.setInterval(n, 50));
      }),
      onPointerLeave: be(o.onPointerLeave, () => {
        c();
      })
    }
  );
}), Kg = "SelectSeparator", Yg = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e;
    return /* @__PURE__ */ l.jsx(je.div, { "aria-hidden": true, ...n, ref: t });
  }
);
Yg.displayName = Kg;
var Uo = "SelectArrow", Gg = g.forwardRef(
  (e, t) => {
    const { __scopeSelect: r, ...n } = e, o = Zn(r), i = zt(Uo, r), a = Pt(Uo, r);
    return i.open && a.position === "popper" ? /* @__PURE__ */ l.jsx(Ei, { ...o, ...n, ref: t }) : null;
  }
);
Gg.displayName = Uo;
var qg = "SelectBubbleInput", Wc = g.forwardRef(
  ({ __scopeSelect: e, value: t, ...r }, n) => {
    const o = g.useRef(null), i = Ne(n, o), a = Lm(t);
    return g.useEffect(() => {
      const s = o.current;
      if (!s) return;
      const c = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(
        c,
        "value"
      ).set;
      if (a !== t && u) {
        const f = new Event("change", { bubbles: true });
        u.call(s, t), s.dispatchEvent(f);
      }
    }, [a, t]), /* @__PURE__ */ l.jsx(
      je.select,
      {
        ...r,
        style: { ...dc, ...r.style },
        ref: i,
        defaultValue: t
      }
    );
  }
);
Wc.displayName = qg;
function Uc(e) {
  return e === "" || e === void 0;
}
function Bc(e) {
  const t = Lt(e), r = g.useRef(""), n = g.useRef(0), o = g.useCallback(
    (a) => {
      const s = r.current + a;
      t(s), (function c(d) {
        r.current = d, window.clearTimeout(n.current), d !== "" && (n.current = window.setTimeout(() => c(""), 1e3));
      })(s);
    },
    [t]
  ), i = g.useCallback(() => {
    r.current = "", window.clearTimeout(n.current);
  }, []);
  return g.useEffect(() => () => window.clearTimeout(n.current), []), [r, o, i];
}
function Hc(e, t, r) {
  const o = t.length > 1 && Array.from(t).every((d) => d === t[0]) ? t[0] : t, i = r ? e.indexOf(r) : -1;
  let a = Xg(e, Math.max(i, 0));
  o.length === 1 && (a = a.filter((d) => d !== r));
  const c = a.find(
    (d) => d.textValue.toLowerCase().startsWith(o.toLowerCase())
  );
  return c !== r ? c : void 0;
}
function Xg(e, t) {
  return e.map((r, n) => e[(t + n) % e.length]);
}
var Vc = Cc, Qg = jc, e0 = Nc, Kc = Rc, t0 = Pc, Yc = Mc, r0 = _c, n0 = $c;
const Gc = g.forwardRef(({ className: e, children: t, ...r }, n) => /* @__PURE__ */ l.jsxs(
  Vc,
  {
    ref: n,
    className: ae(
      "flex h-8 w-full items-center justify-between gap-2 rounded-md border border-zinc-800 bg-black px-3 py-1.5 text-left text-xs font-medium text-white outline-none",
      "hover:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-inset focus-visible:border-zinc-600",
      "disabled:pointer-events-none disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:flex [&>span]:items-center [&>span]:gap-2",
      e
    ),
    style: { boxShadow: "none", WebkitBoxShadow: "none", MozBoxShadow: "none" },
    ...r,
    children: [
      t,
      /* @__PURE__ */ l.jsx(Qg, { asChild: true, children: /* @__PURE__ */ l.jsx(In, { className: "h-3 w-3 shrink-0 text-zinc-400", strokeWidth: 2 }) })
    ]
  }
));
Gc.displayName = Vc.displayName;
const qc = g.forwardRef(({ className: e, children: t, position: r = "popper", ...n }, o) => /* @__PURE__ */ l.jsx(e0, { children: /* @__PURE__ */ l.jsx(
  Kc,
  {
    ref: o,
    className: ae(
      "relative z-[9999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 text-white shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      r === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      e
    ),
    position: r,
    ...n,
    children: /* @__PURE__ */ l.jsx(
      t0,
      {
        className: ae(
          "p-1",
          r === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        ),
        children: t
      }
    )
  }
) }));
qc.displayName = Kc.displayName;
const Xc = g.forwardRef(({ className: e, children: t, ...r }, n) => /* @__PURE__ */ l.jsxs(
  Yc,
  {
    ref: n,
    className: ae(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none",
      "focus:bg-zinc-800 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e
    ),
    ...r,
    children: [
      /* @__PURE__ */ l.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ l.jsx(n0, { children: /* @__PURE__ */ l.jsx(ei, { className: "h-3 w-3", strokeWidth: 2 }) }) }),
      /* @__PURE__ */ l.jsx(r0, { children: t })
    ]
  }
));
Xc.displayName = Yc.displayName;
g.createContext(null);
const et = g.forwardRef(
  ({ className: e, variant: t = "default", size: r = "default", asChild: n = false, ...o }, i) => {
    const a = "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 cursor-pointer", s = {
      default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
      outline: "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600",
      ghost: "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800",
      destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25"
    }, c = {
      sm: "h-7 px-2.5 text-[11px]",
      default: "h-8 px-3 py-1.5 text-xs",
      lg: "h-9 px-5 text-sm",
      icon: "h-8 w-8",
      "icon-sm": "h-7 w-7",
      "icon-xs": "h-6 w-6"
    }, d = n ? Fp : "button";
    return /* @__PURE__ */ l.jsx(
      d,
      {
        ref: i,
        type: "button",
        className: ae(a, s[t], c[r], e),
        ...o
      }
    );
  }
);
et.displayName = "Button";
function g0(e, t) {
  return g.useReducer((r, n) => t[r][n] ?? r, e);
}
var Hr = (e) => {
  const { present: t, children: r } = e, n = b0(t), o = typeof r == "function" ? r({ present: n.isPresent }) : g.Children.only(r), i = Ne(n.ref, v0(o));
  return typeof r == "function" || n.isPresent ? g.cloneElement(o, { ref: i }) : null;
};
Hr.displayName = "Presence";
function b0(e) {
  const [t, r] = g.useState(), n = g.useRef(null), o = g.useRef(e), i = g.useRef("none"), a = e ? "mounted" : "unmounted", [s, c] = g0(a, {
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
  return g.useEffect(() => {
    const d = ln(n.current);
    i.current = s === "mounted" ? d : "none";
  }, [s]), He(() => {
    const d = n.current, u = o.current;
    if (u !== e) {
      const h = i.current, p = ln(d);
      e ? c("MOUNT") : p === "none" || (d == null ? void 0 : d.display) === "none" ? c("UNMOUNT") : c(u && h !== p ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), He(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, f = (p) => {
        const m = ln(n.current).includes(CSS.escape(p.animationName));
        if (p.target === t && m && (c("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, h = (p) => {
        p.target === t && (i.current = ln(n.current));
      };
      return t.addEventListener("animationstart", h), t.addEventListener("animationcancel", f), t.addEventListener("animationend", f), () => {
        u.clearTimeout(d), t.removeEventListener("animationstart", h), t.removeEventListener("animationcancel", f), t.removeEventListener("animationend", f);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: g.useCallback((d) => {
      n.current = d ? getComputedStyle(d) : null, r(d);
    }, [])
  };
}
function ln(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function v0(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var [Qn] = Wr("Tooltip", [
  fr
]), eo = fr(), il = "TooltipProvider", Ho = "tooltip.open", [w0, Ri] = Qn(il);
var Ir = "Tooltip", [y0, Vr] = Qn(Ir);
var Vo = "TooltipTrigger", cl = g.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = Vr(Vo, r), i = Ri(Vo, r), a = eo(r), s = g.useRef(null), c = Ne(t, s, o.onTriggerChange), d = g.useRef(false), u = g.useRef(false), f = g.useCallback(() => d.current = false, []);
    return g.useEffect(() => () => document.removeEventListener("pointerup", f), [f]), /* @__PURE__ */ l.jsx(Yn, { asChild: true, ...a, children: /* @__PURE__ */ l.jsx(
      je.button,
      {
        "aria-describedby": o.open ? o.contentId : void 0,
        "data-state": o.stateAttribute,
        ...n,
        ref: c,
        onPointerMove: be(e.onPointerMove, (h) => {
          h.pointerType !== "touch" && !u.current && !i.isPointerInTransitRef.current && (o.onTriggerEnter(), u.current = true);
        }),
        onPointerLeave: be(e.onPointerLeave, () => {
          o.onTriggerLeave(), u.current = false;
        }),
        onPointerDown: be(e.onPointerDown, () => {
          o.open && o.onClose(), d.current = true, document.addEventListener("pointerup", f, { once: true });
        }),
        onFocus: be(e.onFocus, () => {
          d.current || o.onOpen();
        }),
        onBlur: be(e.onBlur, o.onClose),
        onClick: be(e.onClick, o.onClose)
      }
    ) });
  }
);
cl.displayName = Vo;
var Ti = "TooltipPortal", [k0, C0] = Qn(Ti, {
  forceMount: void 0
}), ll = (e) => {
  const { __scopeTooltip: t, forceMount: r, children: n, container: o } = e, i = Vr(Ti, t);
  return /* @__PURE__ */ l.jsx(k0, { scope: t, forceMount: r, children: /* @__PURE__ */ l.jsx(Hr, { present: r || i.open, children: /* @__PURE__ */ l.jsx(Gn, { asChild: true, container: o, children: n }) }) });
};
ll.displayName = Ti;
var nr = "TooltipContent", dl = g.forwardRef(
  (e, t) => {
    const r = C0(nr, e.__scopeTooltip), { forceMount: n = r.forceMount, side: o = "top", ...i } = e, a = Vr(nr, e.__scopeTooltip);
    return /* @__PURE__ */ l.jsx(Hr, { present: n || a.open, children: a.disableHoverableContent ? /* @__PURE__ */ l.jsx(ul, { side: o, ...i, ref: t }) : /* @__PURE__ */ l.jsx(S0, { side: o, ...i, ref: t }) });
  }
), S0 = g.forwardRef((e, t) => {
  const r = Vr(nr, e.__scopeTooltip), n = Ri(nr, e.__scopeTooltip), o = g.useRef(null), i = Ne(t, o), [a, s] = g.useState(null), { trigger: c, onClose: d } = r, u = o.current, { onPointerInTransitChange: f } = n, h = g.useCallback(() => {
    s(null), f(false);
  }, [f]), p = g.useCallback(
    (x, m) => {
      const b = x.currentTarget, w = { x: x.clientX, y: x.clientY }, y = T0(w, b.getBoundingClientRect()), v = A0(w, y), k = z0(m.getBoundingClientRect()), C = O0([...v, ...k]);
      s(C), f(true);
    },
    [f]
  );
  return g.useEffect(() => () => h(), [h]), g.useEffect(() => {
    if (c && u) {
      const x = (b) => p(b, u), m = (b) => p(b, c);
      return c.addEventListener("pointerleave", x), u.addEventListener("pointerleave", m), () => {
        c.removeEventListener("pointerleave", x), u.removeEventListener("pointerleave", m);
      };
    }
  }, [c, u, p, h]), g.useEffect(() => {
    if (a) {
      const x = (m) => {
        const b = m.target, w = { x: m.clientX, y: m.clientY }, y = (c == null ? void 0 : c.contains(b)) || (u == null ? void 0 : u.contains(b)), v = !P0(w, a);
        y ? h() : v && (h(), d());
      };
      return document.addEventListener("pointermove", x), () => document.removeEventListener("pointermove", x);
    }
  }, [c, u, a, d, h]), /* @__PURE__ */ l.jsx(ul, { ...e, ref: i });
}), [E0, j0] = Qn(Ir, { isInside: false }), N0 = /* @__PURE__ */ Up("TooltipContent"), ul = g.forwardRef(
  (e, t) => {
    const {
      __scopeTooltip: r,
      children: n,
      "aria-label": o,
      onEscapeKeyDown: i,
      onPointerDownOutside: a,
      ...s
    } = e, c = Vr(nr, r), d = eo(r), { onClose: u } = c;
    return g.useEffect(() => (document.addEventListener(Ho, u), () => document.removeEventListener(Ho, u)), [u]), g.useEffect(() => {
      if (c.trigger) {
        const f = (h) => {
          const p = h.target;
          p != null && p.contains(c.trigger) && u();
        };
        return window.addEventListener("scroll", f, { capture: true }), () => window.removeEventListener("scroll", f, { capture: true });
      }
    }, [c.trigger, u]), /* @__PURE__ */ l.jsx(
      Un,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown: i,
        onPointerDownOutside: a,
        onFocusOutside: (f) => f.preventDefault(),
        onDismiss: u,
        children: /* @__PURE__ */ l.jsxs(
          Si,
          {
            "data-state": c.stateAttribute,
            ...d,
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
              /* @__PURE__ */ l.jsx(N0, { children: n }),
              /* @__PURE__ */ l.jsx(E0, { scope: r, isInside: true, children: /* @__PURE__ */ l.jsx(Fm, { id: c.contentId, role: "tooltip", children: o || n }) })
            ]
          }
        )
      }
    );
  }
);
dl.displayName = nr;
var fl = "TooltipArrow", R0 = g.forwardRef(
  (e, t) => {
    const { __scopeTooltip: r, ...n } = e, o = eo(r);
    return j0(
      fl,
      r
    ).isInside ? null : /* @__PURE__ */ l.jsx(Ei, { ...o, ...n, ref: t });
  }
);
R0.displayName = fl;
function T0(e, t) {
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
function A0(e, t, r = 5) {
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
function z0(e) {
  const { top: t, right: r, bottom: n, left: o } = e;
  return [
    { x: o, y: t },
    { x: r, y: t },
    { x: r, y: n },
    { x: o, y: n }
  ];
}
function P0(e, t) {
  const { x: r, y: n } = e;
  let o = false;
  for (let i = 0, a = t.length - 1; i < t.length; a = i++) {
    const s = t[i], c = t[a], d = s.x, u = s.y, f = c.x, h = c.y;
    u > n != h > n && r < (f - d) * (n - u) / (h - u) + d && (o = !o);
  }
  return o;
}
function O0(e) {
  const t = e.slice();
  return t.sort((r, n) => r.x < n.x ? -1 : r.x > n.x ? 1 : r.y < n.y ? -1 : r.y > n.y ? 1 : 0), I0(t);
}
function I0(e) {
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
var L0 = ll, pl = dl;
const Qt = g.forwardRef(({ className: e, sideOffset: t = 4, ...r }, n) => /* @__PURE__ */ l.jsx(L0, { children: /* @__PURE__ */ l.jsx(
  pl,
  {
    ref: n,
    sideOffset: t,
    className: ae(
      "z-50 rounded-md bg-zinc-800 px-2.5 py-1.5 text-[11px] text-zinc-200 shadow-md",
      "animate-in fade-in-0 zoom-in-95",
      e
    ),
    ...r
  }
) }));
Qt.displayName = pl.displayName;
var to = "Popover", [hl] = Wr(to, [
  fr
]), Kr = fr(), [F0, Ot] = hl(to);
var gl = "PopoverAnchor", W0 = g.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot(gl, r), i = Kr(r), { onCustomAnchorAdd: a, onCustomAnchorRemove: s } = o;
    return g.useEffect(() => (a(), () => s()), [a, s]), /* @__PURE__ */ l.jsx(Yn, { ...i, ...n, ref: t });
  }
);
W0.displayName = gl;
var bl = "PopoverTrigger", vl = g.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot(bl, r), i = Kr(r), a = Ne(t, o.triggerRef), s = /* @__PURE__ */ l.jsx(
      je.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": Cl(o.open),
        ...n,
        ref: a,
        onClick: be(e.onClick, o.onOpenToggle)
      }
    );
    return o.hasCustomAnchor ? s : /* @__PURE__ */ l.jsx(Yn, { asChild: true, ...i, children: s });
  }
);
vl.displayName = bl;
var Ai = "PopoverPortal", [U0, B0] = hl(Ai, {
  forceMount: void 0
}), xl = (e) => {
  const { __scopePopover: t, forceMount: r, children: n, container: o } = e, i = Ot(Ai, t);
  return /* @__PURE__ */ l.jsx(U0, { scope: t, forceMount: r, children: /* @__PURE__ */ l.jsx(Hr, { present: r || i.open, children: /* @__PURE__ */ l.jsx(Gn, { asChild: true, container: o, children: n }) }) });
};
xl.displayName = Ai;
var or = "PopoverContent", wl = g.forwardRef(
  (e, t) => {
    const r = B0(or, e.__scopePopover), { forceMount: n = r.forceMount, ...o } = e, i = Ot(or, e.__scopePopover);
    return /* @__PURE__ */ l.jsx(Hr, { present: n || i.open, children: i.modal ? /* @__PURE__ */ l.jsx(V0, { ...o, ref: t }) : /* @__PURE__ */ l.jsx(K0, { ...o, ref: t }) });
  }
);
wl.displayName = or;
var H0 = /* @__PURE__ */ tr("PopoverContent.RemoveScroll"), V0 = g.forwardRef(
  (e, t) => {
    const r = Ot(or, e.__scopePopover), n = g.useRef(null), o = Ne(t, n), i = g.useRef(false);
    return g.useEffect(() => {
      const a = n.current;
      if (a) return pc(a);
    }, []), /* @__PURE__ */ l.jsx(ji, { as: H0, allowPinchZoom: true, children: /* @__PURE__ */ l.jsx(
      yl,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: be(e.onCloseAutoFocus, (a) => {
          var s;
          a.preventDefault(), i.current || (s = r.triggerRef.current) == null || s.focus();
        }),
        onPointerDownOutside: be(
          e.onPointerDownOutside,
          (a) => {
            const s = a.detail.originalEvent, c = s.button === 0 && s.ctrlKey === true, d = s.button === 2 || c;
            i.current = d;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: be(
          e.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
), K0 = g.forwardRef(
  (e, t) => {
    const r = Ot(or, e.__scopePopover), n = g.useRef(false), o = g.useRef(false);
    return /* @__PURE__ */ l.jsx(
      yl,
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
          var c, d;
          (c = e.onInteractOutside) == null || c.call(e, i), i.defaultPrevented || (n.current = true, i.detail.originalEvent.type === "pointerdown" && (o.current = true));
          const a = i.target;
          ((d = r.triggerRef.current) == null ? void 0 : d.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }
      }
    );
  }
), yl = g.forwardRef(
  (e, t) => {
    const {
      __scopePopover: r,
      trapFocus: n,
      onOpenAutoFocus: o,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: a,
      onEscapeKeyDown: s,
      onPointerDownOutside: c,
      onFocusOutside: d,
      onInteractOutside: u,
      ...f
    } = e, h = Ot(or, r), p = Kr(r);
    return Ws(), /* @__PURE__ */ l.jsx(
      hi,
      {
        asChild: true,
        loop: true,
        trapped: n,
        onMountAutoFocus: o,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ l.jsx(
          Un,
          {
            asChild: true,
            disableOutsidePointerEvents: a,
            onInteractOutside: u,
            onEscapeKeyDown: s,
            onPointerDownOutside: c,
            onFocusOutside: d,
            onDismiss: () => h.onOpenChange(false),
            children: /* @__PURE__ */ l.jsx(
              Si,
              {
                "data-state": Cl(h.open),
                role: "dialog",
                id: h.contentId,
                ...p,
                ...f,
                ref: t,
                style: {
                  ...f.style,
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
), kl = "PopoverClose", Y0 = g.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Ot(kl, r);
    return /* @__PURE__ */ l.jsx(
      je.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: be(e.onClick, () => o.onOpenChange(false))
      }
    );
  }
);
Y0.displayName = kl;
var G0 = "PopoverArrow", q0 = g.forwardRef(
  (e, t) => {
    const { __scopePopover: r, ...n } = e, o = Kr(r);
    return /* @__PURE__ */ l.jsx(Ei, { ...o, ...n, ref: t });
  }
);
q0.displayName = G0;
function Cl(e) {
  return e ? "open" : "closed";
}
var Z0 = xl, Sl = wl;
const El = g.forwardRef(({ className: e, align: t = "start", sideOffset: r = 6, ...n }, o) => /* @__PURE__ */ l.jsx(Z0, { children: /* @__PURE__ */ l.jsx(
  Sl,
  {
    ref: o,
    align: t,
    sideOffset: r,
    className: ae(
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
El.displayName = Sl.displayName;
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
  const nucleusFill = theme === "dark" ? "#F4F3EF" : "#080808";
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
          /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#84ABFF" }),
          /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#0F52E0" })
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
  const h = 52 * scale;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: w,
      height: h,
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
const Button = g.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));
    if (asChild && g.isValidElement(children)) {
      return g.cloneElement(children, {
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
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "text-2xl text-foreground leading-none",
                  style: {
                    fontFamily: "var(--wordmark-font)",
                    letterSpacing: "var(--wordmark-tracking)",
                    fontWeight: "var(--wordmark-weight)",
                    fontVariationSettings: '"wdth" var(--wordmark-width)'
                  },
                  children: data.logoText
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-primary-light font-mono", children: data.badge })
            ] })
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
        /* @__PURE__ */ jsxs("div", { className: "border-t border-border/60 py-1 px-4 text-center text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex justify-center items-center gap-1.5 bg-background/50", children: [
          /* @__PURE__ */ jsx("span", { children: "Built with" }),
          /* @__PURE__ */ jsx("a", { href: "https://github.com/olonjs/npm-jpcore", target: "_blank", rel: "noopener noreferrer", className: "text-foreground hover:text-primary-light transition-colors font-bold", children: "OlonJS" })
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
  logoHighlight: z.string().optional().describe("ui:text"),
  logoIconText: z.string().optional().describe("ui:text"),
  badge: z.string().optional().describe("ui:text"),
  links: z.array(z.object({
    label: z.string().describe("ui:text"),
    href: z.string().describe("ui:text"),
    isCta: z.boolean().default(false).describe("ui:checkbox"),
    external: z.boolean().default(false).optional().describe("ui:checkbox")
  })).describe("ui:list")
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
            /* @__PURE__ */ jsx("h1", { className: "font-display font-bold text-7xl  text-foreground leading-tight tracking-tight mb-1", "data-jp-field": "title", children: data.title }),
            data.titleHighlight && /* @__PURE__ */ jsx("h2", { className: "font-display font-normal italic text-5xl md:text-6xl text-primary-light leading-tight tracking-tight mb-7", "data-jp-field": "titleHighlight", children: data.titleHighlight }),
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
  id: z.string().optional(),
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
const Input = g.forwardRef(
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
const Label = g.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-elevated border-b border-border", children: ["Token", "CSS var", "Value", "Tailwind class"].map((h) => /* @__PURE__ */ jsx("th", { className: "text-left px-4 py-3 text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground", children: h }, h)) }) }),
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
        crumbs.length > 0 && /* @__PURE__ */ jsx("nav", { className: "flex items-center gap-2 font-mono-olon text-xs tracking-label uppercase text-muted-foreground mb-6", children: crumbs.map((item, idx) => /* @__PURE__ */ jsxs(g__default.Fragment, { children: [
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
  if (g__default.isValidElement(node)) {
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
    const el = document.getElementById(id2);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= offsetPx) active = id2;
  }
  return active;
}
function computeActiveTocIdFromHeadings(container, toc, offsetPx) {
  const allowed = new Set(toc.map((e) => e.id));
  let active = "";
  container.querySelectorAll("h2, h3").forEach((h) => {
    const id2 = slugify(h.textContent ?? "");
    if (!allowed.has(id2)) return;
    if (h.getBoundingClientRect().top <= offsetPx) active = id2;
  });
  return active;
}
const DocsSidebar = ({ toc, activeId, onNav }) => {
  const navScrollRef = g__default.useRef(null);
  g__default.useEffect(() => {
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
      parseHTML: (el) => el.getAttribute(attr) === "true",
      renderHTML: (attrs) => attrs[attr.replace("data-", "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())] ? { [attr]: "true" } : {}
    });
    return {
      ...(_a = this.parent) == null ? void 0 : _a.call(this),
      uploadId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-upload-id"),
        renderHTML: (attrs) => attrs.uploadId ? { "data-upload-id": String(attrs.uploadId) } : {}
      },
      uploading: bool("data-uploading"),
      uploadError: bool("data-upload-error"),
      awaitingUpload: bool("data-awaiting-upload")
    };
  }
});
const getMarkdown = (ed2) => {
  var _a, _b, _c2;
  return ((_c2 = (_b = (_a = ed2 == null ? void 0 : ed2.storage) == null ? void 0 : _a.markdown) == null ? void 0 : _b.getMarkdown) == null ? void 0 : _c2.call(_b)) ?? "";
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
  const { assets } = On();
  const hostRef = g__default.useRef(null);
  const sectionRef = g__default.useRef(null);
  const fileInputRef = g__default.useRef(null);
  const editorRef = g__default.useRef(null);
  const pendingUploads = g__default.useRef(/* @__PURE__ */ new Map());
  const pendingPickerId = g__default.useRef(null);
  const latestMd = g__default.useRef(data.content ?? "");
  const emittedMd = g__default.useRef(data.content ?? "");
  const [linkOpen, setLinkOpen] = g__default.useState(false);
  const [linkUrl, setLinkUrl] = g__default.useState("");
  const linkInputRef = g__default.useRef(null);
  const getSectionId = g__default.useCallback(() => {
    var _a;
    const el = sectionRef.current ?? ((_a = hostRef.current) == null ? void 0 : _a.closest("[data-section-id]"));
    sectionRef.current = el;
    return (el == null ? void 0 : el.getAttribute("data-section-id")) ?? null;
  }, []);
  const emit = g__default.useCallback(
    (markdown) => {
      latestMd.current = markdown;
      const sectionId = getSectionId();
      if (!sectionId) return;
      window.parent.postMessage(
        {
          type: Ee.INLINE_FIELD_UPDATE,
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
  const setFocusLock = g__default.useCallback((on) => {
    var _a;
    (_a = sectionRef.current) == null ? void 0 : _a.classList.toggle("jp-editorial-focus", on);
  }, []);
  const insertPlaceholder = g__default.useCallback(
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
  const doUpload = g__default.useCallback(
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
  const uploadFile = g__default.useCallback(
    async (file) => {
      const id2 = crypto.randomUUID();
      insertPlaceholder(id2, UPLOADING_SRC, false);
      await doUpload(id2, file);
    },
    [insertPlaceholder, doUpload]
  );
  const uploadFileRef = g__default.useRef(uploadFile);
  uploadFileRef.current = uploadFile;
  const assetsRef = g__default.useRef(assets);
  assetsRef.current = assets;
  const editorProps = g__default.useMemo(
    () => ({
      attributes: { class: EDITOR_CLASSES },
      handleDrop: (_v, event) => {
        var _a, _b, _c2;
        const file = (_b = (_a = event.dataTransfer) == null ? void 0 : _a.files) == null ? void 0 : _b[0];
        if (!(file == null ? void 0 : file.type.startsWith("image/")) || !((_c2 = assetsRef.current) == null ? void 0 : _c2.onAssetUpload)) return false;
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
        var _a, _b, _c2;
        if (node.type.name !== "image" || ((_a = node.attrs) == null ? void 0 : _a.awaitingUpload) !== true) return false;
        const uploadId = typeof ((_b = node.attrs) == null ? void 0 : _b.uploadId) === "string" ? node.attrs.uploadId : null;
        if (!uploadId) return false;
        pendingPickerId.current = uploadId;
        (_c2 = fileInputRef.current) == null ? void 0 : _c2.click();
        return true;
      }
    }),
    []
    // intentionally empty — reads refs at call-time
  );
  const emitRef = g__default.useRef(emit);
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
  g__default.useEffect(() => {
    var _a;
    sectionRef.current = (_a = hostRef.current) == null ? void 0 : _a.closest("[data-section-id]");
  }, []);
  g__default.useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);
  g__default.useEffect(() => {
    if (!editor) return;
    const next = data.content ?? "";
    if (next === latestMd.current) return;
    editor.commands.setContent(next);
    latestMd.current = next;
  }, [data.content, editor]);
  g__default.useEffect(() => {
    const handler = () => {
      void (async () => {
        if (pendingUploads.current.size > 0) {
          await Promise.allSettled(Array.from(pendingUploads.current.values()));
        }
        emitRef.current(getMarkdown(editorRef.current));
      })();
    };
    window.addEventListener(Ee.REQUEST_INLINE_FLUSH, handler);
    return () => window.removeEventListener(Ee.REQUEST_INLINE_FLUSH, handler);
  }, []);
  g__default.useEffect(() => {
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
  g__default.useEffect(
    () => () => {
      const md2 = getMarkdown(editorRef.current);
      if (md2 !== emittedMd.current) emitRef.current(md2);
      setFocusLock(false);
    },
    [setFocusLock]
  );
  g__default.useEffect(() => {
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
  const { mode } = Md();
  const isStudio = mode === "studio";
  const toc = g__default.useMemo(() => extractToc(data.content ?? ""), [data.content]);
  const [activeId, setActiveId] = g__default.useState("");
  const contentRef = g__default.useRef(null);
  g__default.useEffect(() => {
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
  const handleNav = g__default.useCallback((id2) => {
    const el = document.getElementById(id2);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id2);
      return;
    }
    if (contentRef.current) {
      const headings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );
      const target = headings.find((h) => slugify(h.textContent ?? "") === id2);
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
function DawnBackground({
  dawnDuration = 3.5,
  breathingSpeed = 0.5,
  breathingRange = 0.03,
  intensity = 0.55
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    function resize() {
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    function draw(ts2) {
      if (!canvas || !ctx) return;
      if (!startRef.current) startRef.current = ts2;
      const elapsed = (ts2 - startRef.current) / 1e3;
      const dawnP = Math.min(elapsed / dawnDuration, 1);
      const dawnE = easeOut(dawnP);
      const breathT = Math.max(0, elapsed - dawnDuration);
      const breathe = dawnP >= 1 ? 1 + Math.sin(breathT * breathingSpeed) * breathingRange : 1;
      const W = canvas.width;
      const H2 = canvas.height;
      const masterIntensity = dawnE * intensity * breathe;
      ctx.clearRect(0, 0, W, H2);
      const lx = W * 0.18;
      const ly = H2 * 0.92;
      const lr = W * 0.75 * breathe;
      const gL = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      gL.addColorStop(0, `rgba(15,52,224,${0.7 * masterIntensity})`);
      gL.addColorStop(0.2, `rgba(23,99,255,${0.6 * masterIntensity})`);
      gL.addColorStop(0.45, `rgba(91,142,255,${0.35 * masterIntensity})`);
      gL.addColorStop(0.7, `rgba(84,171,255,${0.15 * masterIntensity})`);
      gL.addColorStop(1, "rgba(12,17,22,0)");
      ctx.fillStyle = gL;
      ctx.fillRect(0, 0, W, H2);
      const gR = ctx.createRadialGradient(W - lx, ly, 0, W - lx, ly, lr);
      gR.addColorStop(0, `rgba(15,52,224,${0.7 * masterIntensity})`);
      gR.addColorStop(0.2, `rgba(23,99,255,${0.6 * masterIntensity})`);
      gR.addColorStop(0.45, `rgba(91,142,255,${0.35 * masterIntensity})`);
      gR.addColorStop(0.7, `rgba(84,171,255,${0.15 * masterIntensity})`);
      gR.addColorStop(1, "rgba(12,17,22,0)");
      ctx.fillStyle = gR;
      ctx.fillRect(0, 0, W, H2);
      const vr2 = W * 0.32 * breathe;
      const gV = ctx.createRadialGradient(W * 0.5, H2 * 0.72, 0, W * 0.5, H2 * 0.72, vr2);
      gV.addColorStop(0, `rgba(9,64,184,${0.5 * masterIntensity})`);
      gV.addColorStop(0.4, `rgba(15,52,224,${0.25 * masterIntensity})`);
      gV.addColorStop(1, "rgba(12,17,22,0)");
      ctx.fillStyle = gV;
      ctx.fillRect(0, 0, W, H2);
      const gTop = ctx.createLinearGradient(0, 0, 0, H2 * 0.6);
      gTop.addColorStop(0, "rgba(12,17,22,1)");
      gTop.addColorStop(0.55, "rgba(12,17,22,0.85)");
      gTop.addColorStop(1, "rgba(12,17,22,0)");
      ctx.fillStyle = gTop;
      ctx.fillRect(0, 0, W, H2);
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [dawnDuration, breathingSpeed, breathingRange, intensity]);
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ref: containerRef,
      className: "absolute inset-0 overflow-hidden",
      animate: { opacity: 1, transition: { duration: 0.1 } },
      initial: { opacity: 0 },
      children: /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          className: "absolute inset-0 w-full h-full"
        }
      )
    }
  );
}
function OlonHeroView({ data }) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-fg": "var(--foreground)",
        "--local-muted": "var(--muted-foreground)",
        "--local-primary": "var(--primary)",
        "--local-p300": "var(--primary-light)"
      },
      className: "relative min-h-screen bg-[var(--local-bg)] text-[var(--local-fg)] pt-36 pb-24 overflow-hidden",
      "data-jp-section-id": data.id,
      "data-jp-section-type": "olon-hero",
      children: [
        /* @__PURE__ */ jsx(DawnBackground, {}),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)]",
                  "data-jp-field": "eyebrow",
                  children: data.eyebrow
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("a", { href: "https://www.npmjs.com/package/@olonjs/core", children: /* @__PURE__ */ jsx("img", { src: "https://img.shields.io/npm/v/@olonjs/core?color=blue&style=flat-square", alt: "npm version" }) }),
                /* @__PURE__ */ jsx("a", { href: "https://github.com/olonjs/npm-jpcore/blob/main/LICENSE", children: /* @__PURE__ */ jsx("img", { src: "https://img.shields.io/badge/license-MIT-green?style=flat-square", alt: "license" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "h1",
                {
                  className: "text-6xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05] text-white",
                  "data-jp-field": "headline",
                  children: data.headline
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.1] text-[var(--local-p300)] italic mt-1",
                  "data-jp-field": "subline",
                  children: data.subline
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                className: "text-base text-[var(--local-muted)] leading-relaxed max-w-lg",
                "data-jp-field": "body",
                children: data.body
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
              /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "font-semibold", children: /* @__PURE__ */ jsxs("a", { href: data.cta.primary.href, children: [
                data.cta.primary.label,
                " →"
              ] }) }),
              /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "font-semibold", children: /* @__PURE__ */ jsx("a", { href: data.cta.secondary.href, children: data.cta.secondary.label }) }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: data.cta.ghost.href,
                  className: "text-sm text-[var(--local-muted)] hover:text-[var(--local-fg)] transition-colors flex items-center gap-1.5",
                  children: data.cta.ghost.label
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center justify-center", children: /* @__PURE__ */ jsxs(
            "svg",
            {
              viewBox: "0 0 400 400",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              className: "w-full max-w-md",
              children: [
                /* @__PURE__ */ jsxs("defs", { children: [
                  /* @__PURE__ */ jsxs("linearGradient", { id: "hero-main", x1: "0", y1: "0", x2: "1", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#84ABFF" }),
                    /* @__PURE__ */ jsx("stop", { offset: "60%", stopColor: "#1763FF" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#0F52E0" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "hero-accent", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#EEF3FF" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#84ABFF" })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "hero-glow", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1763FF", stopOpacity: "0.3" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1763FF", stopOpacity: "0" })
                  ] }),
                  /* @__PURE__ */ jsxs("filter", { id: "glow", children: [
                    /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "8", result: "blur" }),
                    /* @__PURE__ */ jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "over" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("circle", { cx: "200", cy: "200", r: "160", fill: "url(#hero-glow)", opacity: "0.4" }),
                /* @__PURE__ */ jsx("rect", { x: "90", y: "90", width: "220", height: "220", rx: "28", fill: "none", stroke: "url(#hero-main)", strokeWidth: "14" }),
                /* @__PURE__ */ jsx("line", { x1: "16", y1: "148", x2: "90", y2: "148", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "16", y1: "200", x2: "90", y2: "200", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "16", y1: "252", x2: "90", y2: "252", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "310", y1: "148", x2: "384", y2: "148", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "310", y1: "200", x2: "384", y2: "200", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "310", y1: "252", x2: "384", y2: "252", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "148", y1: "16", x2: "148", y2: "90", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "200", y1: "16", x2: "200", y2: "90", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "252", y1: "16", x2: "252", y2: "90", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "148", y1: "310", x2: "148", y2: "384", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "200", y1: "310", x2: "200", y2: "384", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("line", { x1: "252", y1: "310", x2: "252", y2: "384", stroke: "url(#hero-main)", strokeWidth: "10", strokeLinecap: "round" }),
                /* @__PURE__ */ jsx("circle", { cx: "148", cy: "148", r: "13", fill: "url(#hero-main)" }),
                /* @__PURE__ */ jsx("circle", { cx: "252", cy: "148", r: "13", fill: "url(#hero-main)" }),
                /* @__PURE__ */ jsx("circle", { cx: "148", cy: "252", r: "13", fill: "url(#hero-main)" }),
                /* @__PURE__ */ jsx("circle", { cx: "252", cy: "252", r: "13", fill: "url(#hero-main)" }),
                /* @__PURE__ */ jsx("line", { x1: "148", y1: "148", x2: "200", y2: "200", stroke: "#84ABFF", strokeWidth: "2.5", opacity: "0.35" }),
                /* @__PURE__ */ jsx("line", { x1: "252", y1: "148", x2: "200", y2: "200", stroke: "#84ABFF", strokeWidth: "2.5", opacity: "0.35" }),
                /* @__PURE__ */ jsx("line", { x1: "148", y1: "252", x2: "200", y2: "200", stroke: "#84ABFF", strokeWidth: "2.5", opacity: "0.35" }),
                /* @__PURE__ */ jsx("line", { x1: "252", y1: "252", x2: "200", y2: "200", stroke: "#84ABFF", strokeWidth: "2.5", opacity: "0.35" }),
                /* @__PURE__ */ jsx("circle", { cx: "200", cy: "200", r: "18", fill: "url(#hero-accent)", filter: "url(#glow)" })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
const OlonHeroSchema = BaseSectionData.extend({
  eyebrow: z.string().default("CONTRACT LAYER · V1.5 · OPEN CORE"),
  headline: z.string().default("Contract Layer"),
  subline: z.string().default("for the agentic web."),
  body: z.string().default(""),
  cta: z.object({
    primary: z.object({ label: z.string(), href: z.string() }),
    secondary: z.object({ label: z.string(), href: z.string() }),
    ghost: z.object({ label: z.string(), href: z.string() })
  })
});
const ICONS$1 = {
  contract: /* @__PURE__ */ jsxs("svg", { width: "36", height: "36", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "w1", x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
      /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
    ] }) }),
    /* @__PURE__ */ jsx("rect", { x: "20", y: "20", width: "160", height: "160", rx: "16", fill: "none", stroke: "url(#w1)", strokeWidth: "10" }),
    /* @__PURE__ */ jsx("line", { x1: "20", y1: "70", x2: "180", y2: "70", stroke: "url(#w1)", strokeWidth: "7" }),
    /* @__PURE__ */ jsx("rect", { x: "40", y: "100", width: "60", height: "8", rx: "4", fill: "url(#w1)", opacity: "0.4" }),
    /* @__PURE__ */ jsx("rect", { x: "40", y: "118", width: "90", height: "8", rx: "4", fill: "url(#w1)", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "40", y: "136", width: "72", height: "8", rx: "4", fill: "url(#w1)", opacity: "0.5" })
  ] }),
  holon: /* @__PURE__ */ jsxs("svg", { width: "36", height: "36", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "w2", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "w2a", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "75", fill: "none", stroke: "url(#w2)", strokeWidth: "10" }),
    /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "28", fill: "url(#w2a)" })
  ] }),
  generated: /* @__PURE__ */ jsxs("svg", { width: "36", height: "36", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "w3", x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
      /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
    ] }) }),
    /* @__PURE__ */ jsx("circle", { cx: "100", cy: "40", r: "14", fill: "url(#w3)" }),
    /* @__PURE__ */ jsx("circle", { cx: "50", cy: "110", r: "12", fill: "url(#w3)", opacity: "0.6" }),
    /* @__PURE__ */ jsx("circle", { cx: "150", cy: "110", r: "12", fill: "url(#w3)", opacity: "0.6" }),
    /* @__PURE__ */ jsx("circle", { cx: "80", cy: "175", r: "10", fill: "url(#w3)", opacity: "0.35" }),
    /* @__PURE__ */ jsx("circle", { cx: "130", cy: "175", r: "14", fill: "url(#w3)" }),
    /* @__PURE__ */ jsx("line", { x1: "100", y1: "54", x2: "54", y2: "98", stroke: "url(#w3)", strokeWidth: "5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("line", { x1: "100", y1: "54", x2: "146", y2: "98", stroke: "url(#w3)", strokeWidth: "5", strokeLinecap: "round", opacity: "0.4" }),
    /* @__PURE__ */ jsx("line", { x1: "54", y1: "122", x2: "82", y2: "165", stroke: "url(#w3)", strokeWidth: "4", strokeLinecap: "round", opacity: "0.35" }),
    /* @__PURE__ */ jsx("line", { x1: "146", y1: "122", x2: "128", y2: "165", stroke: "url(#w3)", strokeWidth: "5", strokeLinecap: "round" })
  ] })
};
function OlonWhyView({ data }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-fg": "var(--foreground)",
        "--local-muted": "var(--muted-foreground)",
        "--local-p300": "var(--primary-light)",
        "--local-card": "var(--card)",
        "--local-border": "var(--border)"
      },
      className: "bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]",
      "data-jp-section-id": data.id,
      "data-jp-section-type": "olon-why",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8", children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3",
            "data-jp-field": "label",
            children: data.label
          }
        ),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-4xl font-bold tracking-[-0.03em] text-white leading-tight",
            "data-jp-field": "headline",
            children: data.headline
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-3xl font-semibold tracking-[-0.03em] text-[var(--local-p300)] leading-tight mb-4",
            "data-jp-field": "subline",
            children: data.subline
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12",
            "data-jp-field": "body",
            children: data.body
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden",
            "data-jp-array": "pillars",
            children: data.pillars.map((pillar) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-[var(--local-card)] p-8 flex flex-col gap-4 border-r last:border-r-0 border-[var(--local-border)]",
                "data-jp-item-id": pillar.id,
                children: [
                  /* @__PURE__ */ jsx("div", { children: ICONS$1[pillar.icon] }),
                  /* @__PURE__ */ jsx("div", { className: "font-bold text-white", "data-jp-field": "title", children: pillar.title }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-[var(--local-muted)] leading-relaxed", "data-jp-field": "body", children: pillar.body })
                ]
              },
              pillar.id
            ))
          }
        )
      ] })
    }
  );
}
const PillarSchema = BaseArrayItem.extend({
  title: z.string(),
  body: z.string(),
  icon: z.enum(["contract", "holon", "generated"])
});
const OlonWhySchema = BaseSectionData.extend({
  label: z.string().default("Why OlonJS"),
  headline: z.string().default("A Meaningful Web"),
  subline: z.string().default("Whole in itself, part of something greater."),
  body: z.string().default(""),
  pillars: z.array(PillarSchema).min(1).max(3)
});
const ICONS = {
  mtrp: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "am", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "amc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("rect", { x: "25", y: "30", width: "130", height: "140", rx: "10", fill: "none", stroke: "url(#am)", strokeWidth: "7" }),
    /* @__PURE__ */ jsx("line", { x1: "25", y1: "60", x2: "155", y2: "60", stroke: "url(#am)", strokeWidth: "5" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#am)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "4.5", d: "M72,42 c-5,0 -8,2 -8,6v2c0,4 -3,5 -6,5 3,0 6,1 6,5v2c0,4 3,6 8,6" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#am)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "4.5", d: "M108,42 c5,0 8,2 8,6v2c0,4 3,5 6,5 -3,0 -6,1 -6,5v2c0,4 -3,6 -8,6" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#am)", opacity: "0.35", cx: "46", cy: "90", r: "4.5" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#am)", opacity: "0.35", x: "59", y: "86.5", width: "68", height: "7", rx: "3.5" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#amc)", cx: "46", cy: "117", r: "6.5" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#amc)", x: "59", y: "113", width: "82", height: "8", rx: "4" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#am)", opacity: "0.55", cx: "46", cy: "145", r: "4.5" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#am)", opacity: "0.55", x: "59", y: "141.5", width: "50", height: "7", rx: "3.5" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#amc)", strokeLinecap: "round", strokeWidth: "5", d: "M192,117 h-35" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#amc)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "5", d: "M170,108 l17,9 -17,9" })
  ] }),
  tbp: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "at", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "atc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#at)", strokeWidth: "5.5", strokeLinejoin: "round", opacity: "0.3", x: "65", y: "22", width: "108", height: "74", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#at)", strokeWidth: "5.5", strokeLinejoin: "round", opacity: "0.6", x: "46", y: "50", width: "108", height: "74", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#at)", strokeWidth: "6.5", strokeLinejoin: "round", x: "27", y: "78", width: "108", height: "74", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#at)", opacity: "0.6", x: "42", y: "101", width: "52", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#atc)", x: "42", y: "116", width: "36", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#at)", opacity: "0.3", cx: "162", cy: "33", r: "4" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#at)", opacity: "0.6", cx: "143", cy: "61", r: "4" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#atc)", cx: "124", cy: "89", r: "5" })
  ] }),
  jsp: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "aj", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "ajc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#aj)", strokeWidth: "7", strokeLinejoin: "round", x: "14", y: "22", width: "172", height: "128", rx: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "14", y1: "52", x2: "186", y2: "52", stroke: "url(#aj)", strokeWidth: "5" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#aj)", opacity: "0.4", cx: "34", cy: "37", r: "5" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#aj)", opacity: "0.6", cx: "52", cy: "37", r: "5" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#ajc)", cx: "70", cy: "37", r: "5" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ajc)", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "6", d: "M28,75 l12,11 -12,11" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ajc)", x: "48", y: "80", width: "22", height: "7", rx: "3.5" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#aj)", opacity: "0.7", x: "28", y: "106", width: "88", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#aj)", opacity: "0.5", x: "28", y: "121", width: "62", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#aj)", opacity: "0.35", x: "28", y: "136", width: "76", height: "6", rx: "3" })
  ] }),
  idac: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "ai", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "aic", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#ai)", strokeWidth: "6.5", strokeLinejoin: "round", x: "8", y: "36", width: "72", height: "128", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ai)", opacity: "0.5", x: "20", y: "56", width: "48", height: "5.5", rx: "2.75" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#aic)", x: "20", y: "75", width: "48", height: "8", rx: "4" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ai)", opacity: "0.4", x: "20", y: "98", width: "48", height: "5.5", rx: "2.75" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#aic)", strokeLinecap: "round", strokeWidth: "5.5", d: "M80,100 h40" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#aic)", cx: "100", cy: "100", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ai)", strokeLinecap: "round", strokeWidth: "4", opacity: "0.4", d: "M80,75 h40" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ai)", strokeLinecap: "round", strokeWidth: "4", opacity: "0.4", d: "M80,125 h40" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#ai)", strokeWidth: "6.5", strokeLinejoin: "round", x: "120", y: "36", width: "72", height: "128", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ai)", opacity: "0.5", x: "132", y: "56", width: "48", height: "5.5", rx: "2.75" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#aic)", x: "132", y: "75", width: "48", height: "8", rx: "4" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ai)", opacity: "0.4", x: "132", y: "98", width: "48", height: "5.5", rx: "2.75" })
  ] }),
  bsds: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "ab", x1: "0", y1: "0", x2: "1", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "abc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#ab)", strokeWidth: "8", strokeLinejoin: "round", x: "16", y: "152", width: "168", height: "32", rx: "8" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#abc)", cx: "100", cy: "168", r: "7" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ab)", strokeLinecap: "round", strokeWidth: "5", opacity: "0.5", d: "M54,138 v14" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ab)", strokeLinecap: "round", strokeWidth: "5", opacity: "0.5", d: "M146,138 v14" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#ab)", strokeWidth: "6", strokeLinejoin: "round", x: "16", y: "68", width: "76", height: "70", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ab)", opacity: "0.55", x: "28", y: "84", width: "42", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#abc)", x: "28", y: "112", width: "32", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#ab)", strokeWidth: "6", strokeLinejoin: "round", x: "108", y: "44", width: "76", height: "94", rx: "9" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#ab)", opacity: "0.55", x: "120", y: "60", width: "42", height: "6", rx: "3" }),
    /* @__PURE__ */ jsx("rect", { fill: "url(#abc)", x: "120", y: "88", width: "32", height: "6", rx: "3" })
  ] }),
  pss: /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 200 200", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("linearGradient", { id: "ap", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#84ABFF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#0F52E0" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: "apc", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#EEF3FF" }),
        /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#84ABFF" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#apc)", strokeLinecap: "round", strokeWidth: "5.5", d: "M100,32 L52,90" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ap)", strokeLinecap: "round", strokeWidth: "5", opacity: "0.3", d: "M100,32 L148,90" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ap)", strokeLinecap: "round", strokeWidth: "4.5", opacity: "0.3", d: "M52,90 L22,158" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#apc)", strokeLinecap: "round", strokeWidth: "5.5", d: "M52,90 L90,158" }),
    /* @__PURE__ */ jsx("path", { fill: "none", stroke: "url(#ap)", strokeLinecap: "round", strokeWidth: "4", opacity: "0.25", d: "M148,90 L170,158" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#apc)", cx: "100", cy: "22", r: "11" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#apc)", cx: "52", cy: "90", r: "10" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#ap)", opacity: "0.3", cx: "148", cy: "90", r: "8" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#ap)", opacity: "0.3", cx: "22", cy: "165", r: "7" }),
    /* @__PURE__ */ jsx("circle", { fill: "url(#apc)", cx: "90", cy: "165", r: "11" }),
    /* @__PURE__ */ jsx("rect", { fill: "none", stroke: "url(#apc)", strokeWidth: "4", strokeLinejoin: "round", opacity: "0.5", x: "76", y: "151", width: "28", height: "28", rx: "5" })
  ] })
};
function OlonArchitectureView({ data }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-fg": "var(--foreground)",
        "--local-muted": "var(--muted-foreground)",
        "--local-p400": "var(--primary)",
        "--local-card": "var(--card)",
        "--local-border": "var(--border)"
      },
      className: "bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]",
      "data-jp-section-id": data.id,
      "data-jp-section-type": "olon-architecture",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8", children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3",
            "data-jp-field": "label",
            children: data.label
          }
        ),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-4xl font-bold tracking-[-0.03em] text-white mb-3",
            "data-jp-field": "headline",
            children: data.headline
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-3",
            "data-jp-field": "body",
            children: data.body
          }
        ),
        data.specHref && /* @__PURE__ */ jsxs("p", { className: "text-sm text-[var(--local-muted)] mb-12", children: [
          "Full specification:",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: data.specHref,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-[var(--local-p400)] hover:underline",
              children: "olonjsSpecs_V_1_5.md ↗"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden",
            "data-jp-array": "protocols",
            children: data.protocols.map((p) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-[var(--local-card)] p-7 flex flex-col gap-3 border-r border-b border-[var(--local-border)] hover:bg-[var(--elevated)] transition-colors",
                "data-jp-item-id": p.id,
                children: [
                  /* @__PURE__ */ jsx("div", { children: ICONS[p.icon] }),
                  /* @__PURE__ */ jsxs(
                    "p",
                    {
                      className: "text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--local-p400)] font-mono",
                      "data-jp-field": "version",
                      children: [
                        p.acronym,
                        " · ",
                        p.version
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-white text-base", "data-jp-field": "name", children: p.name }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "text-sm text-[var(--local-muted)] leading-relaxed flex-1",
                      "data-jp-field": "desc",
                      children: p.desc
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: p.specHref,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "text-xs text-[var(--local-p400)] hover:text-white transition-colors mt-auto",
                      "data-jp-field": "specHref",
                      children: "Read spec ↗"
                    }
                  )
                ]
              },
              p.id
            ))
          }
        )
      ] })
    }
  );
}
const ProtocolSchema = BaseArrayItem.extend({
  version: z.string(),
  acronym: z.string(),
  name: z.string(),
  desc: z.string(),
  specHref: z.string(),
  icon: z.enum(["mtrp", "tbp", "jsp", "idac", "bsds", "pss"])
});
const OlonArchitectureSchema = BaseSectionData.extend({
  label: z.string().default("Architecture"),
  headline: z.string().default("Six governing protocols."),
  body: z.string().default(""),
  specHref: z.string().default(""),
  protocols: z.array(ProtocolSchema).min(1).max(6)
});
function OlonExampleView({ data }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-fg": "var(--foreground)",
        "--local-muted": "var(--muted-foreground)",
        "--local-p400": "var(--primary)",
        "--local-p300": "var(--primary-light)",
        "--local-card": "var(--card)",
        "--local-border": "var(--border)"
      },
      className: "bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]",
      "data-jp-section-id": data.id,
      "data-jp-section-type": "olon-example",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8", children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3",
            "data-jp-field": "label",
            children: data.label
          }
        ),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-4xl font-bold tracking-[-0.03em] text-white mb-3",
            "data-jp-field": "headline",
            children: data.headline
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12",
            "data-jp-field": "body",
            children: data.body
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: data.steps.map((step) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-[var(--local-card)] border border-[var(--local-border)] rounded-2xl overflow-hidden",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-b border-[var(--local-border)] flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "w-6 h-6 rounded-full bg-[var(--local-p400)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0", children: step.number }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-white text-sm", children: step.title }),
                /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-[var(--local-muted)]", children: step.meta })
              ] }),
              /* @__PURE__ */ jsx("pre", { className: "p-6 font-mono text-xs leading-relaxed bg-[#080E14] text-[var(--local-fg)] overflow-x-auto whitespace-pre-wrap min-h-[200px]", children: step.code })
            ]
          },
          step.number
        )) }),
        data.note && /* @__PURE__ */ jsxs("div", { className: "mt-6 px-6 py-4 bg-[var(--local-card)] border border-[var(--local-border)] rounded-xl flex items-start gap-3", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              className: "text-[var(--local-p400)] mt-0.5 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-[var(--local-muted)]", "data-jp-field": "note", children: [
            data.note,
            " ",
            data.noteHref && /* @__PURE__ */ jsx("code", { className: "font-mono text-[var(--local-p300)] text-xs", children: data.noteHref })
          ] })
        ] })
      ] })
    }
  );
}
const StepSchema = z.object({
  number: z.number(),
  title: z.string(),
  meta: z.string(),
  code: z.string()
});
const OlonExampleSchema = BaseSectionData.extend({
  label: z.string().default("Quick Example"),
  headline: z.string().default("Two steps. One contract."),
  body: z.string().default(""),
  note: z.string().default(""),
  noteHref: z.string().default(""),
  steps: z.tuple([StepSchema, StepSchema])
});
const BADGE_STYLES = {
  oss: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  cli: "bg-primary/10 text-primary border border-primary/20",
  deploy: "bg-muted text-muted-foreground border border-border"
};
function OlonGetStartedView({ data }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      style: {
        "--local-bg": "var(--background)",
        "--local-fg": "var(--foreground)",
        "--local-muted": "var(--muted-foreground)",
        "--local-p400": "var(--primary)",
        "--local-p300": "var(--primary-light)",
        "--local-card": "var(--card)",
        "--local-border": "var(--border)"
      },
      className: "bg-[var(--local-bg)] text-[var(--local-fg)] py-24 border-t border-[var(--local-border)]",
      "data-jp-section-id": data.id,
      "data-jp-section-type": "olon-getstarted",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8", children: [
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-xs font-semibold tracking-[0.12em] uppercase text-[var(--local-muted)] mb-3",
            "data-jp-field": "label",
            children: data.label
          }
        ),
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-4xl font-bold tracking-[-0.03em] text-white mb-3",
            "data-jp-field": "headline",
            children: data.headline
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-base text-[var(--local-muted)] leading-relaxed max-w-2xl mb-12",
            "data-jp-field": "body",
            children: data.body
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-3 border border-[var(--local-border)] rounded-2xl overflow-hidden",
            "data-jp-array": "cards",
            children: data.cards.map((card) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-[var(--local-card)] p-8 flex flex-col gap-4 border-r last:border-r-0 border-[var(--local-border)] hover:bg-[var(--elevated)] transition-colors",
                "data-jp-item-id": card.id,
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-[11px] font-bold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full w-fit ${BADGE_STYLES[card.badgeStyle]}`,
                      "data-jp-field": "badge",
                      children: card.badge
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "font-bold text-white text-base", "data-jp-field": "title", children: card.title }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: "text-sm text-[var(--local-muted)] leading-relaxed flex-1",
                      "data-jp-field": "body",
                      children: card.body
                    }
                  ),
                  card.code && /* @__PURE__ */ jsx(
                    "code",
                    {
                      className: "font-mono text-xs bg-[#080E14] border border-[var(--local-border)] rounded-lg px-4 py-3 text-[var(--local-p300)] block",
                      "data-jp-field": "code",
                      children: card.code
                    }
                  ),
                  card.deployHref && card.deployLabel && /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "w-fit", children: /* @__PURE__ */ jsx("a", { href: card.deployHref, target: "_blank", rel: "noopener noreferrer", children: card.deployLabel }) }),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: card.linkHref,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "text-sm text-[var(--local-p400)] hover:text-[var(--local-p300)] transition-colors flex items-center gap-1 mt-auto",
                      "data-jp-field": "linkLabel",
                      children: [
                        card.linkLabel,
                        " ↗"
                      ]
                    }
                  )
                ]
              },
              card.id
            ))
          }
        )
      ] })
    }
  );
}
const StartCardSchema = BaseArrayItem.extend({
  badge: z.string(),
  badgeStyle: z.enum(["oss", "cli", "deploy"]),
  title: z.string(),
  body: z.string(),
  code: z.string().optional(),
  linkLabel: z.string(),
  linkHref: z.string(),
  deployLabel: z.string().optional(),
  deployHref: z.string().optional()
});
const OlonGetStartedSchema = BaseSectionData.extend({
  label: z.string().default("Get Started"),
  headline: z.string().default("Three paths in."),
  body: z.string().default(""),
  cards: z.array(StartCardSchema).min(1).max(3)
});
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
  "tiptap": Tiptap,
  "olon-hero": OlonHeroView,
  "olon-why": OlonWhyView,
  "olon-architecture": OlonArchitectureView,
  "olon-example": OlonExampleView,
  "olon-getstarted": OlonGetStartedView
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
  "tiptap": TiptapSchema,
  "olon-hero": OlonHeroSchema,
  "olon-why": OlonWhySchema,
  "olon-architecture": OlonArchitectureSchema,
  "olon-example": OlonExampleSchema,
  "olon-getstarted": OlonGetStartedSchema
};
const id$5 = "design-system-page";
const slug$5 = "design-system";
const meta$5 = { "title": "Olon Design System — Design Language", "description": "Token reference, color system, typography, components and brand identity for the OlonJS design language." };
const sections$5 = [{ "id": "ds-main", "type": "design-system", "data": { "title": "Olon" }, "settings": {} }];
const designSystem = {
  id: id$5,
  slug: slug$5,
  meta: meta$5,
  sections: sections$5,
  "global-header": false
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: designSystem,
  id: id$5,
  meta: meta$5,
  sections: sections$5,
  slug: slug$5
}, Symbol.toStringTag, { value: "Module" }));
const id$4 = "docs-page";
const slug$4 = "docs";
const meta$4 = { "title": "OlonJS Architecture Specifications v1.5", "description": "Mandatory Standard — Sovereign Core Edition. Canonical Studio actions, SSG, Save to file, and Hot Save." };
const sections$4 = [{ "id": "docs-main", "type": "tiptap", "data": { "content": "# 📐 OlonJS Architecture Specifications v1.5\n\n**Status:** Mandatory Standard\\\n**Version:** 1.5.0 (Sovereign Core Edition — Architecture + Studio/ICE UX, Path-Deterministic Nested Editing, Deterministic Local Design Tokens, Three-Layer CSS Bridge Contract)\\\n**Target:** Senior Architects / AI Agents / Enterprise Governance\n\nThis tenant follows the current OlonJS source-of-truth model: the tenant app owns content, schemas, theme, and persistence wiring; `@olonjs/core` owns the Studio shell, routing, preview, and editing engine.\n\n---\n\n## Canonical Editorial Flows\n\nThe supported Studio flows are now:\n\n- `SSG` for static HTML and route output.\n- `Save to file` for local JSON persistence back into tenant source files.\n- `Hot Save` for cloud/editorial persistence when the tenant config provides it.\n- `Add Section` for deterministic section lifecycle management inside Studio.\n\nPrevious one-off bake and JSON export paths are no longer part of Studio.\n\n---\n\n## Persistence Model\n\n`@olonjs/core` no longer performs HTML bake or ZIP export. Studio now invokes tenant-provided persistence callbacks:\n\n- `saveToFile(state, slug)`\n- `hotSave(state, slug)`\n\nThis keeps persistence explicit, tenant-owned, and aligned with the current `JsonPagesConfig` contract.\n\n---\n\n## Tenant Source Of Truth\n\n`apps/tenant-alpha` is the DNA source of truth for this tenant. Generated CLI templates are downstream artifacts and should be regenerated from source apps instead of being edited manually.\n\nThe canonical content and design files remain:\n\n- `src/data/config/site.json`\n- `src/data/config/menu.json`\n- `src/data/config/theme.json`\n- `src/data/pages/<slug>.json`\n\n---\n\n## Reference Specs\n\nUse these monorepo sources for the full protocol and architecture details:\n\n- `specs/olonjsSpecs_V_1_5.md`\n- `apps/tenant-alpha/specs/olonjsSpecs_V.1.3.md`\n\nThese source specs are the maintained references for architecture, Studio behavior, and tenant compliance." }, "settings": {} }];
const docs = {
  id: id$4,
  slug: slug$4,
  meta: meta$4,
  sections: sections$4
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: docs,
  id: id$4,
  meta: meta$4,
  sections: sections$4,
  slug: slug$4
}, Symbol.toStringTag, { value: "Module" }));
const id$3 = "home-page";
const slug$3 = "home";
const meta$3 = { "title": "OlonJS — Contract Layer for the Agentic Web", "description": "OlonJS is a TypeScript framework for building JSON-driven websites with a deterministic data contract. Every section is typed, validated, and structurally addressable." };
const sections$3 = [{ "id": "hero-main", "type": "olon-hero", "data": { "id": "hero-main", "eyebrow": "CONTRACT LAYER · V1.5 · OPEN SOURCE", "headline": "Contract Layer", "subline": "for the agentic web.", "body": "AI agents are becoming operational actors in commerce, marketing, and support. They need more than content — they need a contract. OlonJS is the deterministic machine contract for websites: every site typed, structured, and addressable by design. No custom glue. No fragile integrations. Just a contract any agent can read and operate.", "cta": { "primary": { "label": "Get started", "href": "#getstarted" }, "secondary": { "label": "GitHub", "href": "https://github.com/olonjs/core" }, "ghost": { "label": "Explore platform", "href": "#architecture" } } } }, { "id": "why-olon", "type": "olon-why", "data": { "id": "why-olon", "label": "Why OlonJS", "headline": "A Meaningful Web", "subline": "Whole in itself, part of something greater.", "body": "Most web frameworks separate concerns across layers — data, UI, validation, metadata — with no shared contract between them. OlonJS inverts this: the JSON data structure is the contract. Every layer — rendering, editing, validation, machine access — is a deterministic projection of the same typed source. The result is a site that is structurally coherent by construction, not by convention. Every site built with OlonJS is a holon: complete in itself, intelligible to the network around it. The meaningful web doesn't happen all at once. It grows one site at a time.", "pillars": [{ "id": "pillar-contract", "icon": "contract", "title": "The data is the contract", "body": "One typed JSON source. Every layer — UI, editor, agent, SEO — is a projection. No translation, no drift." }, { "id": "pillar-holon", "icon": "holon", "title": "Every site is a holon", "body": "Autonomous, complete, structurally intelligible. Each site is whole in itself and part of a network that understands it." }, { "id": "pillar-generated", "icon": "generated", "title": "Built to be generated", "body": "Every constraint is also an instruction. The spec is precise enough for AI agents to scaffold a fully compliant tenant from scratch." }], "anchorId": "Why" } }, { "id": "architecture-protocols", "type": "olon-architecture", "data": { "id": "architecture-protocols", "label": "Architecture", "headline": "Six governing protocols.", "body": "OlonJS is specified as a versioned set of architectural protocols. Each protocol is independently versioned and mandatory for compliant tenants.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md", "protocols": [{ "id": "proto-mtrp", "icon": "mtrp", "acronym": "MTRP", "version": "v1.2", "name": "Modular Type Registry", "desc": "Core exports an empty SectionDataRegistry. Tenants extend it via module augmentation. Full TypeScript inference across all section types at compile-time, zero Core changes.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#1--modular-type-registry-pattern-mtrp-v12" }, { "id": "proto-tbp", "icon": "tbp", "acronym": "TBP", "version": "v1.0", "name": "Tenant Block Protocol", "desc": "Each section type is a self-contained capsule: View.tsx, schema.ts, types.ts, index.ts. Renderable, validatable, and ingestible by the engine without additional configuration.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#3--tenant-block-protocol-tbp-v10" }, { "id": "proto-jsp", "icon": "jsp", "acronym": "JSP", "version": "v1.8", "name": "JsonPages Site Protocol", "desc": "Deterministic file system ontology and CLI projection engine. config/ separates global governance from per-page content. Reproducible across every environment.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#2--jsonpages-site-protocol-jsp-v18" }, { "id": "proto-idac", "icon": "idac", "acronym": "IDAC", "version": "v1.0", "name": "ICE Data Contract", "desc": "Mandatory data-jp-* DOM attributes bind every section to its data. Any consumer that can traverse the DOM can identify and operate any content node — human or agent.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }, { "id": "proto-bsds", "icon": "bsds", "acronym": "BSDS", "version": "v1.0", "name": "Base Schema Fragments", "desc": "BaseSectionData and BaseArrayItem enforce anchor IDs and stable React keys across all capsules. The foundation that doesn't move so your content never drifts.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }, { "id": "proto-pss", "icon": "pss", "acronym": "PSS", "version": "v1.4", "name": "Path-Based Selection", "desc": "Every node has an address. Content selection uses strict root-to-leaf path semantics — unambiguous, stable, operable by any consumer that knows the contract.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }], "anchorId": "Architecture" } }, { "id": "example-steps", "type": "olon-example", "data": { "id": "example-steps", "label": "Quick Example", "headline": "Two steps. One contract.", "body": "Scaffold a fully compliant tenant in under three minutes. Then read any page via the OlonJS protocol — from a browser, a script, or an AI agent.", "note": "Every OlonJS tenant exposes a machine-readable manifest at", "noteHref": "http://localhost:5173/mcp-manifest.json", "steps": [{ "number": 1, "title": "Scaffold a tenant", "meta": "~3 min", "code": "# Install the CLI\nnpm install -g @olonjs/cli\n\n# Scaffold a new tenant\nnpx @olonjs/cli new tenant\n\n✓ Projecting infrastructure...\n✓ Projecting source (src_tenant_alpha.sh)\n✓ Resolving dependencies\n✓ Tenant scaffolded\n\nsrc/\n  components/hero/\n    View.tsx\n    schema.ts\n    types.ts\n    index.ts\n  data/config/\n    site.json\n    theme.json\n    menu.json\n  lib/\n    schemas.ts\n    base-schemas.ts" }, { "number": 2, "title": "Read via OlonJS protocol", "meta": "Any consumer", "code": `// Read any page via the contract
// Works from browser, script, or AI agent

const page = await
  navigator.modelContextProtocol
    .readResource(
      'olon://pages/home'
    );

// Returns the full typed contract
// { slug, meta, sections: Section[] }
// No DOM scraping. No layout knowledge.
// Just the contract.

// {
//   "slug": "home",
//   "sections": [
//     { "type": "hero", "data": {...} },
//     { "type": "features", "data": {...} }
//   ]
// }` }], "anchorId": "Example" } }, { "id": "getstarted-cards", "type": "olon-getstarted", "data": { "id": "getstarted-cards", "label": "Get Started", "headline": "Three paths in.", "body": "Start with the Core package, scaffold a full tenant with the CLI, or deploy a working example in one click.", "cards": [{ "id": "card-core", "badge": "Open Core", "badgeStyle": "oss", "title": "Install Core", "body": "The Core package is free and open — forever. The contract, the protocols, the CLI. No lock-in on the foundation.", "code": "npm install @olonjs/core", "linkLabel": "View on GitHub", "linkHref": "https://github.com/olonjs/core" }, { "id": "card-cli", "badge": "CLI", "badgeStyle": "cli", "title": "Scaffold a tenant", "body": "The CLI scaffolds a fully compliant tenant from a canonical script. Same result on every machine, every run.", "code": "npx @olonjs/cli new tenant", "linkLabel": "View on npm", "linkHref": "https://www.npmjs.com/package/@olonjs/cli" }, { "id": "card-deploy", "badge": "Deploy", "badgeStyle": "deploy", "title": "Deploy a template", "body": "Clone a working OlonJS tenant and deploy it with one click. Explore the full capsule structure in a real project.", "deployLabel": "Deploy template →", "deployHref": "https://github.com/olonjs/core", "linkLabel": "View on npm", "linkHref": "https://www.npmjs.com/package/@olonjs/core" }], "anchorId": "Getstarted" } }];
const home = {
  id: id$3,
  slug: slug$3,
  meta: meta$3,
  sections: sections$3
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  id: id$3,
  meta: meta$3,
  sections: sections$3,
  slug: slug$3
}, Symbol.toStringTag, { value: "Module" }));
const id$2 = "home-page";
const slug$2 = "home";
const meta$2 = { "title": "OlonJS — Contract Layer for the Agentic Web", "description": "OlonJS is a TypeScript framework for building JSON-driven websites with a deterministic data contract. Every section is typed, validated, and structurally addressable." };
const sections$2 = [{ "id": "hero-main", "type": "olon-hero", "data": { "eyebrow": "AI GENERATED 🤖", "headline": "Contract Layer", "subline": "for the agentic web.", "body": "AI agents are becoming operational actors in commerce, marketing, and support. They need more than content — they need a contract. OlonJS is the deterministic machine contract for websites: every site typed, structured, and addressable by design. No custom glue. No fragile integrations. Just a contract any agent can read and operate.", "cta": { "primary": { "label": "Inizia Ora", "href": "/docs" }, "secondary": { "label": "GitHub", "href": "https://github.com" }, "ghost": { "label": "Contatti", "href": "/contact" } } } }, { "id": "why-olon", "type": "olon-why", "data": { "id": "why-olon", "label": "Why OlonJS", "headline": "A Meaningful Web", "subline": "Whole in itself, part of something greater.", "body": "Most web frameworks separate concerns across layers — data, UI, validation, metadata — with no shared contract between them. OlonJS inverts this: the JSON data structure is the contract. Every layer — rendering, editing, validation, machine access — is a deterministic projection of the same typed source. The result is a site that is structurally coherent by construction, not by convention. Every site built with OlonJS is a holon: complete in itself, intelligible to the network around it. The meaningful web doesn't happen all at once. It grows one site at a time.", "pillars": [{ "id": "pillar-contract", "icon": "contract", "title": "The data is the contract", "body": "One typed JSON source. Every layer — UI, editor, agent, SEO — is a projection. No translation, no drift." }, { "id": "pillar-holon", "icon": "holon", "title": "Every site is a holon", "body": "Autonomous, complete, structurally intelligible. Each site is whole in itself and part of a network that understands it." }, { "id": "pillar-generated", "icon": "generated", "title": "Built to be generated", "body": "Every constraint is also an instruction. The spec is precise enough for AI agents to scaffold a fully compliant tenant from scratch." }], "anchorId": "Why" } }, { "id": "architecture-protocols", "type": "olon-architecture", "data": { "id": "architecture-protocols", "label": "Architecture", "headline": "Six governing protocols.", "body": "OlonJS is specified as a versioned set of architectural protocols. Each protocol is independently versioned and mandatory for compliant tenants.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md", "protocols": [{ "id": "proto-mtrp", "icon": "mtrp", "acronym": "MTRP", "version": "v1.2", "name": "Modular Type Registry", "desc": "Core exports an empty SectionDataRegistry. Tenants extend it via module augmentation. Full TypeScript inference across all section types at compile-time, zero Core changes.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#1--modular-type-registry-pattern-mtrp-v12" }, { "id": "proto-tbp", "icon": "tbp", "acronym": "TBP", "version": "v1.0", "name": "Tenant Block Protocol", "desc": "Each section type is a self-contained capsule: View.tsx, schema.ts, types.ts, index.ts. Renderable, validatable, and ingestible by the engine without additional configuration.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#3--tenant-block-protocol-tbp-v10" }, { "id": "proto-jsp", "icon": "jsp", "acronym": "JSP", "version": "v1.8", "name": "JsonPages Site Protocol", "desc": "Deterministic file system ontology and CLI projection engine. config/ separates global governance from per-page content. Reproducible across every environment.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md#2--jsonpages-site-protocol-jsp-v18" }, { "id": "proto-idac", "icon": "idac", "acronym": "IDAC", "version": "v1.0", "name": "ICE Data Contract", "desc": "Mandatory data-jp-* DOM attributes bind every section to its data. Any consumer that can traverse the DOM can identify and operate any content node — human or agent.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }, { "id": "proto-bsds", "icon": "bsds", "acronym": "BSDS", "version": "v1.0", "name": "Base Schema Fragments", "desc": "BaseSectionData and BaseArrayItem enforce anchor IDs and stable React keys across all capsules. The foundation that doesn't move so your content never drifts.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }, { "id": "proto-pss", "icon": "pss", "acronym": "PSS", "version": "v1.4", "name": "Path-Based Selection", "desc": "Every node has an address. Content selection uses strict root-to-leaf path semantics — unambiguous, stable, operable by any consumer that knows the contract.", "specHref": "https://github.com/olonjs/core/blob/main/specs/olonjsSpecs_V_1_5.md" }], "anchorId": "Architecture" } }, { "id": "example-steps", "type": "olon-example", "data": { "id": "example-steps", "label": "Quick Example", "headline": "Two steps. One contract.", "body": "Scaffold a fully compliant tenant in under three minutes. Then read any page via the OlonJS protocol — from a browser, a script, or an AI agent.", "note": "Every OlonJS tenant exposes a machine-readable manifest at", "noteHref": "http://localhost:5173/mcp-manifest.json", "steps": [{ "number": 1, "title": "Scaffold a tenant", "meta": "~3 min", "code": "# Install the CLI\nnpm install -g @olonjs/cli\n\n# Scaffold a new tenant\nnpx @olonjs/cli new tenant\n\n✓ Projecting infrastructure...\n✓ Projecting source (src_tenant_alpha.sh)\n✓ Resolving dependencies\n✓ Tenant scaffolded\n\nsrc/\n  components/hero/\n    View.tsx\n    schema.ts\n    types.ts\n    index.ts\n  data/config/\n    site.json\n    theme.json\n    menu.json\n  lib/\n    schemas.ts\n    base-schemas.ts" }, { "number": 2, "title": "Read via OlonJS protocol", "meta": "Any consumer", "code": `// Read any page via the contract
// Works from browser, script, or AI agent

const page = await
  navigator.modelContextProtocol
    .readResource(
      'olon://pages/home'
    );

// Returns the full typed contract
// { slug, meta, sections: Section[] }
// No DOM scraping. No layout knowledge.
// Just the contract.

// {
//   "slug": "home",
//   "sections": [
//     { "type": "hero", "data": {...} },
//     { "type": "features", "data": {...} }
//   ]
// }` }], "anchorId": "Example" } }, { "id": "getstarted-cards", "type": "olon-getstarted", "data": { "id": "getstarted-cards", "label": "Get Started", "headline": "Three paths in.", "body": "Start with the Core package, scaffold a full tenant with the CLI, or deploy a working example in one click.", "cards": [{ "id": "card-core", "badge": "Open Core", "badgeStyle": "oss", "title": "Install Core", "body": "The Core package is free and open — forever. The contract, the protocols, the CLI. No lock-in on the foundation.", "code": "npm install @olonjs/core", "linkLabel": "View on GitHub", "linkHref": "https://github.com/olonjs/core" }, { "id": "card-cli", "badge": "CLI", "badgeStyle": "cli", "title": "Scaffold a tenant", "body": "The CLI scaffolds a fully compliant tenant from a canonical script. Same result on every machine, every run.", "code": "npx @olonjs/cli new tenant", "linkLabel": "View on npm", "linkHref": "https://www.npmjs.com/package/@olonjs/cli" }, { "id": "card-deploy", "badge": "Deploy", "badgeStyle": "deploy", "title": "Deploy a template", "body": "Clone a working OlonJS tenant and deploy it with one click. Explore the full capsule structure in a real project.", "deployLabel": "Deploy template →", "deployHref": "https://github.com/olonjs/core", "linkLabel": "View on npm", "linkHref": "https://www.npmjs.com/package/@olonjs/core" }], "anchorId": "Getstarted" } }];
const home_ = {
  id: id$2,
  slug: slug$2,
  meta: meta$2,
  sections: sections$2
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home_,
  id: id$2,
  meta: meta$2,
  sections: sections$2,
  slug: slug$2
}, Symbol.toStringTag, { value: "Module" }));
const id$1 = "overview-page";
const slug$1 = "platform/overview";
const meta$1 = { "title": "OlonJS — Platform Overview", "description": "Overview of the OlonJS platform, architecture direction, and product surface." };
const sections$1 = [{ "id": "doc-page-hero", "type": "page-hero", "data": { "breadcrumb": [{ "id": "crumb-home", "label": "Home", "href": "/" }, { "id": "crumb-platform", "label": "Platform", "href": "/platform/overview" }], "badge": "", "title": "Platform", "titleItalic": "Overview", "description": "High-level overview of the OlonJS platform." } }];
const overview = {
  id: id$1,
  slug: slug$1,
  meta: meta$1,
  sections: sections$1
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
  const glob = /* @__PURE__ */ Object.assign({ "/src/data/pages/design-system.json": __vite_glob_0_0, "/src/data/pages/docs.json": __vite_glob_0_1, "/src/data/pages/home.json": __vite_glob_0_2, "/src/data/pages/home_.json": __vite_glob_0_3, "/src/data/pages/platform/overview.json": __vite_glob_0_4, "/src/data/pages/post.json": __vite_glob_0_5 });
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
const header = { "id": "global-header", "type": "header", "data": { "logoText": "Olon", "badge": "JS", "links": [{ "label": "Why", "href": "#Why" }, { "label": "Architecture", "href": "#Architecture" }, { "label": "Example", "href": "#Example" }, { "label": "Get started", "href": "#Getstarted" }, { "label": "GitHub", "href": "https://github.com/olonjs/core" }], "ctaLabel": "", "ctaHref": "", "signinHref": "" } };
const footer = { "id": "global-footer", "type": "footer", "data": { "brandText": "OlonJS", "copyright": "© 2026 OlonJS · v1.5 · Guido Serio", "links": [{ "label": "GitHub", "href": "https://github.com/olonjs/core" }], "designSystemHref": "" }, "settings": { "showLogo": true } };
const siteData = {
  identity,
  pages: pages$1,
  header,
  footer
};
const main = [{ "label": "Why", "href": "#Why" }, { "label": "Architecture", "href": "#Architecture" }, { "label": "Example", "href": "#Example" }, { "label": "Get started", "href": "#Getstarted" }, { "label": "GitHub", "href": "https://github.com/olonjs/core" }];
const menuData = {
  main
};
const name = "Olon";
const tokens = { "colors": { "background": "hsl(215 28% 7%)", "card": "hsl(218 44% 9%)", "elevated": "#141B24", "overlay": "#1C2433", "popover": "hsl(218 44% 9%)", "popover-foreground": "hsl(214 33% 84%)", "foreground": "hsl(214 33% 84%)", "card-foreground": "hsl(214 33% 84%)", "muted-foreground": "hsl(215 23% 57%)", "placeholder": "#4A5C78", "primary": "hsl(222 100% 54%)", "primary-foreground": "hsl(0 0% 100%)", "primary-light": "#84ABFF", "primary-dark": "#0F52E0", "primary-50": "#EEF3FF", "primary-100": "#D6E4FF", "primary-200": "#ADC8FF", "primary-300": "#84ABFF", "primary-400": "#5B8EFF", "primary-500": "#1763FF", "primary-600": "#0F52E0", "primary-700": "#0940B8", "primary-800": "#063090", "primary-900": "#031E68", "accent": "hsl(216 28% 15%)", "accent-foreground": "hsl(214 33% 84%)", "secondary": "hsl(217 30% 11%)", "secondary-foreground": "hsl(214 33% 84%)", "muted": "hsl(217 30% 11%)", "border": "hsl(216 27% 21%)", "border-strong": "#2F3D55", "input": "hsl(216 27% 21%)", "ring": "hsl(222 100% 54%)", "destructive": "hsl(0 40% 46%)", "destructive-foreground": "hsl(210 58% 93%)", "destructive-border": "#7F2626", "destructive-ring": "#E06060", "success": "hsl(152 83% 26%)", "success-foreground": "hsl(210 58% 93%)", "success-border": "#1DB87A", "success-indicator": "#1DB87A", "warning": "hsl(46 100% 21%)", "warning-foreground": "hsl(210 58% 93%)", "warning-border": "#C49A00", "info": "hsl(214 100% 40%)", "info-foreground": "hsl(210 58% 93%)", "info-border": "#4D9FE0" }, "modes": { "light": { "colors": { "background": "hsl(0 0% 96%)", "card": "hsl(0 0% 100%)", "elevated": "#F4F3EF", "overlay": "#E5E3DC", "popover": "hsl(0 0% 100%)", "popover-foreground": "hsl(0 0% 3%)", "foreground": "hsl(0 0% 3%)", "card-foreground": "hsl(0 0% 3%)", "muted-foreground": "hsl(0 0% 42%)", "placeholder": "#B4B2AD", "primary": "hsl(222 100% 54%)", "primary-foreground": "hsl(0 0% 100%)", "primary-light": "#5B8EFF", "primary-dark": "#0F52E0", "primary-50": "#EEF3FF", "primary-100": "#D6E4FF", "primary-200": "#ADC8FF", "primary-300": "#84ABFF", "primary-400": "#5B8EFF", "primary-500": "#1763FF", "primary-600": "#0F52E0", "primary-700": "#0940B8", "primary-800": "#063090", "primary-900": "#031E68", "accent": "hsl(222 100% 92%)", "accent-foreground": "hsl(222 100% 54%)", "secondary": "hsl(0 0% 92%)", "secondary-foreground": "hsl(0 0% 3%)", "muted": "hsl(0 0% 92%)", "border": "hsl(0 0% 84%)", "border-strong": "#B4B2AD", "input": "hsl(0 0% 84%)", "ring": "hsl(222 100% 54%)", "destructive": "hsl(0 72% 51%)", "destructive-foreground": "hsl(0 0% 100%)", "destructive-border": "#FECACA", "destructive-ring": "#EF4444", "success": "hsl(160 84% 39%)", "success-foreground": "hsl(0 0% 100%)", "success-border": "#D4F0E2", "success-indicator": "#0A7C4E", "warning": "hsl(38 92% 50%)", "warning-foreground": "hsl(0 0% 3%)", "warning-border": "#F5EAD4", "info": "hsl(222 100% 54%)", "info-foreground": "hsl(0 0% 100%)", "info-border": "#D4E5F5" } } }, "typography": { "fontFamily": { "primary": '"Instrument Sans", Helvetica, Arial, sans-serif', "mono": '"JetBrains Mono", "Fira Code", monospace', "display": '"Instrument Sans", Helvetica, Arial, sans-serif' }, "wordmark": { "fontFamily": '"Instrument Sans", Helvetica, Arial, sans-serif', "weight": "700", "tracking": "-0.05em" }, "scale": { "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem", "6xl": "3rem", "7xl": "4.5rem" }, "tracking": { "tight": "-0.04em", "normal": "0em", "wide": "0.04em", "widest": "0.14em" }, "leading": { "tight": "1.2", "normal": "1.5", "relaxed": "1.7" } }, "borderRadius": { "xl": "1rem", "lg": "0.75rem", "md": "0.5rem", "sm": "0.25rem", "full": "9999px" }, "spacing": { "container-max": "72rem", "section-y": "4rem", "header-h": "4rem" }, "zIndex": { "base": "0", "elevated": "10", "dropdown": "20", "sticky": "40", "overlay": "50", "modal": "60", "toast": "100" } };
const themeData = {
  name,
  tokens
};
const tenantCss = `/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-pan-x:initial;--tw-pan-y:initial;--tw-pinch-zoom:initial;--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-divide-x-reverse:0;--tw-border-style:solid;--tw-divide-y-reverse:0;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-content:""}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:var(--theme-font-mono);--color-red-400:oklch(70.4% .191 22.216);--color-red-500:oklch(63.7% .237 25.331);--color-amber-200:oklch(92.4% .12 95.746);--color-amber-500:oklch(76.9% .188 70.08);--color-emerald-500:oklch(69.6% .17 162.48);--color-blue-400:oklch(70.7% .165 254.624);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-zinc-100:oklch(96.7% .001 286.375);--color-zinc-200:oklch(92% .004 286.32);--color-zinc-400:oklch(70.5% .015 286.067);--color-zinc-500:oklch(55.2% .016 285.938);--color-zinc-600:oklch(44.2% .017 285.786);--color-zinc-700:oklch(37% .013 285.805);--color-zinc-800:oklch(27.4% .006 286.033);--color-zinc-900:oklch(21% .006 285.885);--color-zinc-950:oklch(14.1% .005 285.823);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-md:28rem;--container-lg:32rem;--container-xl:36rem;--container-2xl:42rem;--container-4xl:56rem;--container-6xl:72rem;--text-xs:var(--theme-text-xs);--text-xs--line-height:calc(1/.75);--text-sm:var(--theme-text-sm);--text-sm--line-height:calc(1.25/.875);--text-base:var(--theme-text-base);--text-base--line-height: 1.5 ;--text-lg:var(--theme-text-lg);--text-lg--line-height:calc(1.75/1.125);--text-xl:var(--theme-text-xl);--text-xl--line-height:calc(1.75/1.25);--text-2xl:var(--theme-text-2xl);--text-2xl--line-height:calc(2/1.5);--text-3xl:var(--theme-text-3xl);--text-3xl--line-height: 1.2 ;--text-4xl:var(--theme-text-4xl);--text-4xl--line-height:calc(2.5/2.25);--text-5xl:var(--theme-text-5xl);--text-5xl--line-height:1;--text-6xl:var(--theme-text-6xl);--text-6xl--line-height:1;--text-7xl:var(--theme-text-7xl);--text-7xl--line-height:1;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-weight-black:900;--tracking-tight:var(--theme-tracking-tight);--tracking-wide:var(--theme-tracking-wide);--tracking-wider:.05em;--tracking-widest:.1em;--leading-tight:var(--theme-leading-tight);--leading-snug:var(--theme-leading-snug);--leading-relaxed:var(--theme-leading-relaxed);--radius-sm:var(--theme-radius-sm);--radius-md:var(--theme-radius-md);--radius-lg:var(--theme-radius-lg);--radius-xl:var(--theme-radius-xl);--radius-2xl:1rem;--ease-out:cubic-bezier(0,0,.2,1);--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-sm:8px;--blur-md:12px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-background:var(--background);--color-card:var(--card);--color-elevated:var(--elevated);--color-popover:var(--popover);--color-popover-foreground:var(--popover-foreground);--color-foreground:var(--foreground);--color-card-foreground:var(--card-foreground);--color-muted-foreground:var(--muted-foreground);--color-primary:var(--primary);--color-primary-foreground:var(--primary-foreground);--color-primary-light:var(--primary-light);--color-primary-200:var(--primary-200);--color-primary-400:var(--primary-400);--color-primary-800:var(--primary-800);--color-primary-900:var(--primary-900);--color-accent:var(--accent);--color-accent-foreground:var(--accent-foreground);--color-muted:var(--muted);--color-border:var(--border);--color-border-strong:var(--border-strong);--color-input:var(--input);--color-ring:var(--ring);--color-destructive:var(--destructive);--color-destructive-foreground:var(--destructive-foreground);--color-destructive-border:var(--destructive-border);--color-destructive-ring:var(--destructive-ring);--color-success:var(--success);--color-success-indicator:var(--success-indicator);--color-warning:var(--warning);--color-info:var(--info);--radius-full:var(--theme-radius-full);--font-primary:var(--theme-font-primary);--font-display:var(--theme-font-display);--text-md:var(--theme-text-md);--leading-none:var(--theme-leading-none);--tracking-display:var(--theme-tracking-display);--tracking-label:var(--theme-tracking-label)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){-webkit-appearance:button;-moz-appearance:button;appearance:button}::file-selector-button{-webkit-appearance:button;-moz-appearance:button;appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}*,:before,:after{box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%}body{background-color:var(--background);color:var(--foreground);font-family:var(--theme-font-primary);font-size:var(--theme-text-base);line-height:var(--theme-leading-normal);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}h1,h2,h3,h4,h5,h6{font-family:var(--theme-font-primary);font-weight:500;line-height:var(--theme-leading-tight);color:var(--foreground)}h1{font-size:var(--theme-text-5xl)}h2{font-size:var(--theme-text-4xl)}h3{font-size:var(--theme-text-3xl)}h4{font-size:var(--theme-text-2xl)}h5{font-size:var(--theme-text-xl)}h6{font-size:var(--theme-text-lg)}@media(min-width:768px){h1{font-size:var(--theme-text-6xl)}h2{font-size:var(--theme-text-5xl)}h3{font-size:var(--theme-text-4xl)}h4{font-size:var(--theme-text-3xl)}h5{font-size:var(--theme-text-2xl)}h6{font-size:var(--theme-text-xl)}}@media(min-width:1024px){h1{font-size:var(--theme-text-7xl)}h2{font-size:var(--theme-text-6xl)}h3{font-size:var(--theme-text-5xl)}h4{font-size:var(--theme-text-4xl)}h5{font-size:var(--theme-text-3xl)}h6{font-size:var(--theme-text-2xl)}}p{line-height:var(--theme-leading-normal)}code,pre,kbd,samp{font-family:var(--theme-font-mono)}a{color:inherit;text-decoration:none}button{cursor:pointer}input,textarea,select{font-family:var(--theme-font-primary);font-size:var(--theme-text-sm)}::selection{background-color:var(--primary);color:var(--primary-foreground)}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:var(--background)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}::-webkit-scrollbar-thumb:hover{background:var(--border-strong)}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.collapse{visibility:collapse}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.not-sr-only{clip-path:none;white-space:normal;width:auto;height:auto;margin:0;padding:0;position:static;overflow:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.inset-0{inset:calc(var(--spacing)*0)}.top-0{top:calc(var(--spacing)*0)}.top-1{top:calc(var(--spacing)*1)}.top-1\\/2{top:50%}.top-\\[82px\\]{top:82px}.top-\\[calc\\(100\\%\\+8px\\)\\]{top:calc(100% + 8px)}.right-0{right:calc(var(--spacing)*0)}.right-1{right:calc(var(--spacing)*1)}.right-2{right:calc(var(--spacing)*2)}.right-3{right:calc(var(--spacing)*3)}.left-0{left:calc(var(--spacing)*0)}.left-1{left:calc(var(--spacing)*1)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing)*2)}.isolate{isolation:isolate}.isolation-auto{isolation:auto}.z-0{z-index:0}.z-10{z-index:10}.z-40{z-index:40}.z-50,.z-\\[50\\]{z-index:50}.z-\\[60\\]{z-index:60}.z-\\[65\\]{z-index:65}.z-\\[70\\]{z-index:70}.z-\\[110\\]{z-index:110}.z-\\[1290\\]{z-index:1290}.z-\\[9999\\]{z-index:9999}.order-1{order:1}.order-2{order:2}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-4{margin:calc(var(--spacing)*4)}.-mx-1{margin-inline:calc(var(--spacing)*-1)}.mx-0{margin-inline:calc(var(--spacing)*0)}.mx-0\\.5{margin-inline:calc(var(--spacing)*.5)}.mx-2{margin-inline:calc(var(--spacing)*2)}.mx-2\\.5{margin-inline:calc(var(--spacing)*2.5)}.mx-auto{margin-inline:auto}.my-1{margin-block:calc(var(--spacing)*1)}.mt-0{margin-top:calc(var(--spacing)*0)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mt-3{margin-top:calc(var(--spacing)*3)}.mt-3\\.5{margin-top:calc(var(--spacing)*3.5)}.mt-4{margin-top:calc(var(--spacing)*4)}.mt-5{margin-top:calc(var(--spacing)*5)}.mt-6{margin-top:calc(var(--spacing)*6)}.mt-auto{margin-top:auto}.mt-px{margin-top:1px}.mr-2{margin-right:calc(var(--spacing)*2)}.mb-0{margin-bottom:calc(var(--spacing)*0)}.mb-0\\.5{margin-bottom:calc(var(--spacing)*.5)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.mb-5{margin-bottom:calc(var(--spacing)*5)}.mb-6{margin-bottom:calc(var(--spacing)*6)}.mb-7{margin-bottom:calc(var(--spacing)*7)}.mb-8{margin-bottom:calc(var(--spacing)*8)}.mb-9{margin-bottom:calc(var(--spacing)*9)}.mb-10{margin-bottom:calc(var(--spacing)*10)}.mb-12{margin-bottom:calc(var(--spacing)*12)}.mb-16{margin-bottom:calc(var(--spacing)*16)}.mb-24{margin-bottom:calc(var(--spacing)*24)}.mb-px{margin-bottom:1px}.ml-0{margin-left:calc(var(--spacing)*0)}.ml-0\\.5{margin-left:calc(var(--spacing)*.5)}.ml-1{margin-left:calc(var(--spacing)*1)}.ml-3{margin-left:calc(var(--spacing)*3)}.ml-auto{margin-left:auto}.line-clamp-3{-webkit-line-clamp:3;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.block{display:block}.contents{display:contents}.flex{display:flex}.flow-root{display:flow-root}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.inline-grid{display:inline-grid}.inline-table{display:inline-table}.list-item{display:list-item}.table{display:table}.table-caption{display:table-caption}.table-cell{display:table-cell}.table-column{display:table-column}.table-column-group{display:table-column-group}.table-footer-group{display:table-footer-group}.table-header-group{display:table-header-group}.table-row{display:table-row}.table-row-group{display:table-row-group}.field-sizing-content{field-sizing:content}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.h-\\(--radix-select-trigger-height\\){height:var(--radix-select-trigger-height)}.h-1{height:calc(var(--spacing)*1)}.h-1\\.5{height:calc(var(--spacing)*1.5)}.h-2{height:calc(var(--spacing)*2)}.h-2\\.5{height:calc(var(--spacing)*2.5)}.h-3{height:calc(var(--spacing)*3)}.h-3\\.5{height:calc(var(--spacing)*3.5)}.h-4{height:calc(var(--spacing)*4)}.h-5{height:calc(var(--spacing)*5)}.h-6{height:calc(var(--spacing)*6)}.h-7{height:calc(var(--spacing)*7)}.h-8{height:calc(var(--spacing)*8)}.h-9{height:calc(var(--spacing)*9)}.h-10{height:calc(var(--spacing)*10)}.h-14{height:calc(var(--spacing)*14)}.h-16{height:calc(var(--spacing)*16)}.h-18{height:calc(var(--spacing)*18)}.h-24{height:calc(var(--spacing)*24)}.h-35{height:calc(var(--spacing)*35)}.h-\\[0\\.5px\\]{height:.5px}.h-\\[5px\\]{height:5px}.h-\\[18px\\]{height:18px}.h-\\[72px\\]{height:72px}.h-\\[220px\\]{height:220px}.h-\\[var\\(--radix-select-trigger-height\\)\\]{height:var(--radix-select-trigger-height)}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\(--radix-select-content-available-height\\){max-height:var(--radix-select-content-available-height)}.max-h-0{max-height:calc(var(--spacing)*0)}.max-h-96{max-height:calc(var(--spacing)*96)}.max-h-\\[32rem\\]{max-height:32rem}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-16{min-height:calc(var(--spacing)*16)}.min-h-\\[18px\\]{min-height:18px}.min-h-\\[200px\\]{min-height:200px}.min-h-\\[220px\\]{min-height:220px}.min-h-screen{min-height:100vh}.w-1{width:calc(var(--spacing)*1)}.w-1\\.5{width:calc(var(--spacing)*1.5)}.w-2{width:calc(var(--spacing)*2)}.w-2\\.5{width:calc(var(--spacing)*2.5)}.w-3{width:calc(var(--spacing)*3)}.w-3\\.5{width:calc(var(--spacing)*3.5)}.w-4{width:calc(var(--spacing)*4)}.w-4\\/6{width:66.6667%}.w-5{width:calc(var(--spacing)*5)}.w-5\\/6{width:83.3333%}.w-6{width:calc(var(--spacing)*6)}.w-7{width:calc(var(--spacing)*7)}.w-8{width:calc(var(--spacing)*8)}.w-9{width:calc(var(--spacing)*9)}.w-10{width:calc(var(--spacing)*10)}.w-32{width:calc(var(--spacing)*32)}.w-60{width:calc(var(--spacing)*60)}.w-64{width:calc(var(--spacing)*64)}.w-\\[0\\.5px\\]{width:.5px}.w-\\[5px\\]{width:5px}.w-\\[18px\\]{width:18px}.w-\\[72px\\]{width:72px}.w-\\[min\\(240px\\,28vw\\)\\]{width:min(240px,28vw)}.w-\\[var\\(--radix-popover-trigger-width\\)\\]{width:var(--radix-popover-trigger-width)}.w-fit{width:fit-content}.w-full{width:100%}.w-px{width:1px}.max-w-2xl{max-width:var(--container-2xl)}.max-w-4xl{max-width:var(--container-4xl)}.max-w-6xl{max-width:var(--container-6xl)}.max-w-\\[280px\\]{max-width:280px}.max-w-\\[360px\\]{max-width:360px}.max-w-\\[1040px\\]{max-width:1040px}.max-w-\\[1600px\\]{max-width:1600px}.max-w-lg{max-width:var(--container-lg)}.max-w-md{max-width:var(--container-md)}.max-w-none{max-width:none}.max-w-xl{max-width:var(--container-xl)}.min-w-\\(--radix-select-trigger-width\\){min-width:var(--radix-select-trigger-width)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-7{min-width:calc(var(--spacing)*7)}.min-w-36{min-width:calc(var(--spacing)*36)}.min-w-\\[8rem\\]{min-width:8rem}.min-w-\\[18px\\]{min-width:18px}.min-w-\\[64px\\]{min-width:64px}.min-w-\\[220px\\]{min-width:220px}.min-w-\\[var\\(--radix-select-trigger-width\\)\\]{min-width:var(--radix-select-trigger-width)}.flex-1{flex:1}.flex-shrink-0{flex-shrink:0}.shrink{flex-shrink:1}.shrink-0{flex-shrink:0}.grow{flex-grow:1}.border-collapse{border-collapse:collapse}.origin-\\(--radix-select-content-transform-origin\\){transform-origin:var(--radix-select-content-transform-origin)}.origin-top-left{transform-origin:0 0}.-translate-x-1{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-none{translate:none}.scale-95{--tw-scale-x:95%;--tw-scale-y:95%;--tw-scale-z:95%;scale:var(--tw-scale-x)var(--tw-scale-y)}.scale-100{--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y)}.scale-3d{scale:var(--tw-scale-x)var(--tw-scale-y)var(--tw-scale-z)}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-pulse{animation:var(--animate-pulse)}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.touch-pinch-zoom{--tw-pinch-zoom:pinch-zoom;touch-action:var(--tw-pan-x,)var(--tw-pan-y,)var(--tw-pinch-zoom,)}.resize{resize:both}.resize-none{resize:none}.scroll-my-1{scroll-margin-block:calc(var(--spacing)*1)}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-nowrap{flex-wrap:nowrap}.flex-wrap{flex-wrap:wrap}.place-content-center{place-content:center}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.gap-0{gap:calc(var(--spacing)*0)}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-2\\.5{gap:calc(var(--spacing)*2.5)}.gap-3{gap:calc(var(--spacing)*3)}.gap-3\\.5{gap:calc(var(--spacing)*3.5)}.gap-4{gap:calc(var(--spacing)*4)}.gap-6{gap:calc(var(--spacing)*6)}.gap-7{gap:calc(var(--spacing)*7)}.gap-8{gap:calc(var(--spacing)*8)}.gap-14{gap:calc(var(--spacing)*14)}.gap-16{gap:calc(var(--spacing)*16)}.gap-px{gap:1px}:where(.space-y-0>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*0)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*0)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-1\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*1.5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*1.5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*2)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*2)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3\\.5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3.5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3.5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-5>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*5)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*5)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*6)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*6)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-reverse>:not(:last-child)){--tw-space-y-reverse:1}:where(.space-x-reverse>:not(:last-child)){--tw-space-x-reverse:1}:where(.divide-x>:not(:last-child)){--tw-divide-x-reverse:0;border-inline-style:var(--tw-border-style);border-inline-start-width:calc(1px*var(--tw-divide-x-reverse));border-inline-end-width:calc(1px*calc(1 - var(--tw-divide-x-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-y-reverse>:not(:last-child)){--tw-divide-y-reverse:1}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-hidden{overflow:hidden}.overflow-x-auto{overflow-x:auto}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.overscroll-y-contain{overscroll-behavior-y:contain}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[4px\\]{border-radius:4px}.rounded-\\[var\\(--local-radius-md\\)\\]{border-radius:var(--local-radius-md)}.rounded-\\[var\\(--local-radius-sm\\)\\]{border-radius:var(--local-radius-sm)}.rounded-full{border-radius:var(--radius-full)}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.rounded-s{border-start-start-radius:.25rem;border-end-start-radius:.25rem}.rounded-ss{border-start-start-radius:.25rem}.rounded-e{border-start-end-radius:.25rem;border-end-end-radius:.25rem}.rounded-se{border-start-end-radius:.25rem}.rounded-ee{border-end-end-radius:.25rem}.rounded-es{border-end-start-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-tl{border-top-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-tr{border-top-right-radius:.25rem}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-br{border-bottom-right-radius:.25rem}.rounded-bl{border-bottom-left-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-2{border-style:var(--tw-border-style);border-width:2px}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-s{border-inline-start-style:var(--tw-border-style);border-inline-start-width:1px}.border-e{border-inline-end-style:var(--tw-border-style);border-inline-end-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-l-2{border-left-style:var(--tw-border-style);border-left-width:2px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-solid{--tw-border-style:solid;border-style:solid}.border-\\[var\\(--local-border\\)\\]{border-color:var(--local-border)}.border-\\[var\\(--local-primary\\)\\]{border-color:var(--local-primary)}.border-\\[var\\(--local-toolbar-border\\)\\]{border-color:var(--local-toolbar-border)}.border-amber-500{border-color:var(--color-amber-500)}.border-amber-500\\/20{border-color:#f99c0033}@supports (color:color-mix(in lab,red,red)){.border-amber-500\\/20{border-color:color-mix(in oklab,var(--color-amber-500)20%,transparent)}}.border-blue-500\\/30{border-color:#3080ff4d}@supports (color:color-mix(in lab,red,red)){.border-blue-500\\/30{border-color:color-mix(in oklab,var(--color-blue-500)30%,transparent)}}.border-blue-600{border-color:var(--color-blue-600)}.border-border{border-color:var(--color-border)}.border-border-strong{border-color:var(--color-border-strong)}.border-border\\/50{border-color:var(--color-border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/50{border-color:color-mix(in oklab,var(--color-border)50%,transparent)}}.border-border\\/60{border-color:var(--color-border)}@supports (color:color-mix(in lab,red,red)){.border-border\\/60{border-color:color-mix(in oklab,var(--color-border)60%,transparent)}}.border-destructive-border{border-color:var(--color-destructive-border)}.border-input{border-color:var(--color-input)}.border-primary{border-color:var(--color-primary)}.border-primary-800{border-color:var(--color-primary-800)}.border-primary\\/20{border-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.border-primary\\/20{border-color:color-mix(in oklab,var(--color-primary)20%,transparent)}}.border-red-500{border-color:var(--color-red-500)}.border-red-500\\/20{border-color:#fb2c3633}@supports (color:color-mix(in lab,red,red)){.border-red-500\\/20{border-color:color-mix(in oklab,var(--color-red-500)20%,transparent)}}.border-transparent{border-color:#0000}.border-zinc-700{border-color:var(--color-zinc-700)}.border-zinc-700\\/80{border-color:#3f3f46cc}@supports (color:color-mix(in lab,red,red)){.border-zinc-700\\/80{border-color:color-mix(in oklab,var(--color-zinc-700)80%,transparent)}}.border-zinc-800{border-color:var(--color-zinc-800)}.bg-\\[\\#10b981\\]{background-color:#10b981}.bg-\\[\\#080E14\\]{background-color:#080e14}.bg-\\[\\#ef4444\\]{background-color:#ef4444}.bg-\\[\\#f59e0b\\]{background-color:#f59e0b}.bg-\\[color-mix\\(in_srgb\\,var\\(--local-toolbar-bg\\)_40\\%\\,transparent\\)\\]{background-color:var(--local-toolbar-bg)}@supports (color:color-mix(in lab,red,red)){.bg-\\[color-mix\\(in_srgb\\,var\\(--local-toolbar-bg\\)_40\\%\\,transparent\\)\\]{background-color:color-mix(in srgb,var(--local-toolbar-bg)40%,transparent)}}.bg-\\[var\\(--color-background\\)\\]{background-color:var(--color-background)}.bg-\\[var\\(--local-bg\\)\\]{background-color:var(--local-bg)}.bg-\\[var\\(--local-border\\)\\]{background-color:var(--local-border)}.bg-\\[var\\(--local-card\\)\\]{background-color:var(--local-card)}.bg-\\[var\\(--local-p400\\)\\]{background-color:var(--local-p400)}.bg-\\[var\\(--local-primary\\)\\]{background-color:var(--local-primary)}.bg-\\[var\\(--local-toolbar-active-bg\\)\\]{background-color:var(--local-toolbar-active-bg)}.bg-\\[var\\(--local-toolbar-bg\\)\\]{background-color:var(--local-toolbar-bg)}.bg-\\[var\\(--local-toolbar-border\\)\\]{background-color:var(--local-toolbar-border)}.bg-\\[var\\(--local-toolbar-hover-bg\\)\\]{background-color:var(--local-toolbar-hover-bg)}.bg-accent{background-color:var(--color-accent)}.bg-amber-500{background-color:var(--color-amber-500)}.bg-amber-500\\/5{background-color:#f99c000d}@supports (color:color-mix(in lab,red,red)){.bg-amber-500\\/5{background-color:color-mix(in oklab,var(--color-amber-500)5%,transparent)}}.bg-background,.bg-background\\/50{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/50{background-color:color-mix(in oklab,var(--color-background)50%,transparent)}}.bg-background\\/80{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/80{background-color:color-mix(in oklab,var(--color-background)80%,transparent)}}.bg-background\\/88{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/88{background-color:color-mix(in oklab,var(--color-background)88%,transparent)}}.bg-background\\/90{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/90{background-color:color-mix(in oklab,var(--color-background)90%,transparent)}}.bg-background\\/95{background-color:var(--color-background)}@supports (color:color-mix(in lab,red,red)){.bg-background\\/95{background-color:color-mix(in oklab,var(--color-background)95%,transparent)}}.bg-black{background-color:var(--color-black)}.bg-blue-500{background-color:var(--color-blue-500)}.bg-blue-500\\/5{background-color:#3080ff0d}@supports (color:color-mix(in lab,red,red)){.bg-blue-500\\/5{background-color:color-mix(in oklab,var(--color-blue-500)5%,transparent)}}.bg-blue-500\\/15{background-color:#3080ff26}@supports (color:color-mix(in lab,red,red)){.bg-blue-500\\/15{background-color:color-mix(in oklab,var(--color-blue-500)15%,transparent)}}.bg-blue-600{background-color:var(--color-blue-600)}.bg-border{background-color:var(--color-border)}.bg-border-strong{background-color:var(--color-border-strong)}.bg-card,.bg-card\\/60{background-color:var(--color-card)}@supports (color:color-mix(in lab,red,red)){.bg-card\\/60{background-color:color-mix(in oklab,var(--color-card)60%,transparent)}}.bg-destructive,.bg-destructive\\/15{background-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.bg-destructive\\/15{background-color:color-mix(in oklab,var(--color-destructive)15%,transparent)}}.bg-elevated,.bg-elevated\\/50{background-color:var(--color-elevated)}@supports (color:color-mix(in lab,red,red)){.bg-elevated\\/50{background-color:color-mix(in oklab,var(--color-elevated)50%,transparent)}}.bg-emerald-500{background-color:var(--color-emerald-500)}.bg-emerald-500\\/10{background-color:#00bb7f1a}@supports (color:color-mix(in lab,red,red)){.bg-emerald-500\\/10{background-color:color-mix(in oklab,var(--color-emerald-500)10%,transparent)}}.bg-info{background-color:var(--color-info)}.bg-muted,.bg-muted\\/20{background-color:var(--color-muted)}@supports (color:color-mix(in lab,red,red)){.bg-muted\\/20{background-color:color-mix(in oklab,var(--color-muted)20%,transparent)}}.bg-popover{background-color:var(--color-popover)}.bg-primary{background-color:var(--color-primary)}.bg-primary-900{background-color:var(--color-primary-900)}.bg-primary\\/10{background-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/10{background-color:color-mix(in oklab,var(--color-primary)10%,transparent)}}.bg-red-500{background-color:var(--color-red-500)}.bg-red-500\\/10{background-color:#fb2c361a}@supports (color:color-mix(in lab,red,red)){.bg-red-500\\/10{background-color:color-mix(in oklab,var(--color-red-500)10%,transparent)}}.bg-success{background-color:var(--color-success)}.bg-success-indicator{background-color:var(--color-success-indicator)}.bg-transparent{background-color:#0000}.bg-warning{background-color:var(--color-warning)}.bg-white{background-color:var(--color-white)}.bg-white\\/20{background-color:#fff3}@supports (color:color-mix(in lab,red,red)){.bg-white\\/20{background-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.bg-zinc-800{background-color:var(--color-zinc-800)}.bg-zinc-900{background-color:var(--color-zinc-900)}.bg-zinc-950{background-color:var(--color-zinc-950)}.bg-gradient-to-br{--tw-gradient-position:to bottom right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-\\[\\#84ABFF\\]{--tw-gradient-from:#84abff;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-primary-light{--tw-gradient-from:var(--color-primary-light);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-transparent{--tw-gradient-from:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.via-border{--tw-gradient-via:var(--color-border);--tw-gradient-via-stops:var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-via)var(--tw-gradient-via-position),var(--tw-gradient-to)var(--tw-gradient-to-position);--tw-gradient-stops:var(--tw-gradient-via-stops)}.to-\\[\\#1763FF\\]{--tw-gradient-to:#1763ff;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-accent{--tw-gradient-to:var(--color-accent);--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-transparent{--tw-gradient-to:transparent;--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.bg-clip-text{-webkit-background-clip:text;background-clip:text}.bg-repeat{background-repeat:repeat}.mask-no-clip{-webkit-mask-clip:no-clip;mask-clip:no-clip}.mask-repeat{-webkit-mask-repeat:repeat;mask-repeat:repeat}.object-cover{object-fit:cover}.p-0{padding:calc(var(--spacing)*0)}.p-1{padding:calc(var(--spacing)*1)}.p-1\\.5{padding:calc(var(--spacing)*1.5)}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-3\\.5{padding:calc(var(--spacing)*3.5)}.p-4{padding:calc(var(--spacing)*4)}.p-5{padding:calc(var(--spacing)*5)}.p-6{padding:calc(var(--spacing)*6)}.p-7{padding:calc(var(--spacing)*7)}.p-8{padding:calc(var(--spacing)*8)}.p-10{padding:calc(var(--spacing)*10)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-2\\.5{padding-inline:calc(var(--spacing)*2.5)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-5{padding-inline:calc(var(--spacing)*5)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-7{padding-inline:calc(var(--spacing)*7)}.px-8{padding-inline:calc(var(--spacing)*8)}.py-0{padding-block:calc(var(--spacing)*0)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-4{padding-block:calc(var(--spacing)*4)}.py-5{padding-block:calc(var(--spacing)*5)}.py-8{padding-block:calc(var(--spacing)*8)}.py-12{padding-block:calc(var(--spacing)*12)}.py-14{padding-block:calc(var(--spacing)*14)}.py-20{padding-block:calc(var(--spacing)*20)}.py-24{padding-block:calc(var(--spacing)*24)}.py-32{padding-block:calc(var(--spacing)*32)}.pt-3{padding-top:calc(var(--spacing)*3)}.pt-5{padding-top:calc(var(--spacing)*5)}.pt-36{padding-top:calc(var(--spacing)*36)}.pr-2{padding-right:calc(var(--spacing)*2)}.pr-8{padding-right:calc(var(--spacing)*8)}.pr-10{padding-right:calc(var(--spacing)*10)}.pb-5{padding-bottom:calc(var(--spacing)*5)}.pb-6{padding-bottom:calc(var(--spacing)*6)}.pb-24{padding-bottom:calc(var(--spacing)*24)}.pb-28{padding-bottom:calc(var(--spacing)*28)}.pl-1{padding-left:calc(var(--spacing)*1)}.pl-1\\.5{padding-left:calc(var(--spacing)*1.5)}.pl-2{padding-left:calc(var(--spacing)*2)}.pl-2\\.5{padding-left:calc(var(--spacing)*2.5)}.pl-3{padding-left:calc(var(--spacing)*3)}.pl-8{padding-left:calc(var(--spacing)*8)}.pl-\\[8px\\]{padding-left:8px}.pl-\\[22px\\]{padding-left:22px}.text-center{text-align:center}.text-left{text-align:left}.align-middle{vertical-align:middle}.font-mono{font-family:var(--font-mono)}.font-primary{font-family:var(--font-primary)}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-3xl{font-size:var(--text-3xl);line-height:var(--tw-leading,var(--text-3xl--line-height))}.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}.text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[0\\.58rem\\]{font-size:.58rem}.text-\\[0\\.72rem\\]{font-size:.72rem}.text-\\[0\\.76rem\\]{font-size:.76rem}.text-\\[8px\\]{font-size:8px}.text-\\[9px\\]{font-size:9px}.text-\\[10\\.5px\\]{font-size:10.5px}.text-\\[10px\\]{font-size:10px}.text-\\[11\\.5px\\]{font-size:11.5px}.text-\\[11px\\]{font-size:11px}.text-\\[12\\.5px\\]{font-size:12.5px}.text-\\[12px\\]{font-size:12px}.text-\\[13\\.5px\\]{font-size:13.5px}.text-\\[13px\\]{font-size:13px}.text-\\[14px\\]{font-size:14px}.text-\\[15px\\]{font-size:15px}.text-\\[16px\\]{font-size:16px}.text-\\[18px\\]{font-size:18px}.text-\\[21px\\]{font-size:21px}.text-\\[28px\\]{font-size:28px}.text-md{font-size:var(--text-md)}.leading-\\[1\\.1\\]{--tw-leading:1.1;line-height:1.1}.leading-\\[1\\.2\\]{--tw-leading:1.2;line-height:1.2}.leading-\\[1\\.05\\]{--tw-leading:1.05;line-height:1.05}.leading-\\[1\\.6\\]{--tw-leading:1.6;line-height:1.6}.leading-\\[1\\.8\\]{--tw-leading:1.8;line-height:1.8}.leading-\\[1\\.15\\]{--tw-leading:1.15;line-height:1.15}.leading-\\[1\\.65\\]{--tw-leading:1.65;line-height:1.65}.leading-\\[1\\.78\\]{--tw-leading:1.78;line-height:1.78}.leading-none{--tw-leading:var(--leading-none);line-height:var(--leading-none)}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-black{--tw-font-weight:var(--font-weight-black);font-weight:var(--font-weight-black)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-\\[-0\\.01em\\]{--tw-tracking:-.01em;letter-spacing:-.01em}.tracking-\\[-0\\.02em\\]{--tw-tracking:-.02em;letter-spacing:-.02em}.tracking-\\[-0\\.03em\\]{--tw-tracking:-.03em;letter-spacing:-.03em}.tracking-\\[-0\\.04em\\]{--tw-tracking:-.04em;letter-spacing:-.04em}.tracking-\\[-0\\.038em\\]{--tw-tracking:-.038em;letter-spacing:-.038em}.tracking-\\[\\.08em\\]{--tw-tracking:.08em;letter-spacing:.08em}.tracking-\\[\\.10em\\]{--tw-tracking:.1em;letter-spacing:.1em}.tracking-\\[\\.12em\\]{--tw-tracking:.12em;letter-spacing:.12em}.tracking-\\[0\\.1em\\]{--tw-tracking:.1em;letter-spacing:.1em}.tracking-\\[0\\.08em\\]{--tw-tracking:.08em;letter-spacing:.08em}.tracking-\\[0\\.12em\\]{--tw-tracking:.12em;letter-spacing:.12em}.tracking-\\[0\\.14em\\]{--tw-tracking:.14em;letter-spacing:.14em}.tracking-display{--tw-tracking:var(--tracking-display);letter-spacing:var(--tracking-display)}.tracking-label{--tw-tracking:var(--tracking-label);letter-spacing:var(--tracking-label)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-wide{--tw-tracking:var(--tracking-wide);letter-spacing:var(--tracking-wide)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.tracking-widest{--tw-tracking:var(--tracking-widest);letter-spacing:var(--tracking-widest)}.text-wrap{text-wrap:wrap}.text-clip{text-overflow:clip}.text-ellipsis{text-overflow:ellipsis}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.text-\\[\\#84ABFF\\]{color:#84abff}.text-\\[var\\(--local-bg\\)\\]{color:var(--local-bg)}.text-\\[var\\(--local-fg\\)\\]{color:var(--local-fg)}.text-\\[var\\(--local-muted\\)\\]{color:var(--local-muted)}.text-\\[var\\(--local-p300\\)\\]{color:var(--local-p300)}.text-\\[var\\(--local-p400\\)\\]{color:var(--local-p400)}.text-\\[var\\(--local-primary\\)\\]{color:var(--local-primary)}.text-\\[var\\(--local-text\\)\\]{color:var(--local-text)}.text-\\[var\\(--local-text-muted\\)\\]{color:var(--local-text-muted)}.text-\\[var\\(--local-toolbar-text\\)\\]{color:var(--local-toolbar-text)}.text-accent{color:var(--color-accent)}.text-accent-foreground{color:var(--color-accent-foreground)}.text-amber-200{color:var(--color-amber-200)}.text-amber-500{color:var(--color-amber-500)}.text-amber-500\\/70{color:#f99c00b3}@supports (color:color-mix(in lab,red,red)){.text-amber-500\\/70{color:color-mix(in oklab,var(--color-amber-500)70%,transparent)}}.text-blue-400{color:var(--color-blue-400)}.text-border-strong{color:var(--color-border-strong)}.text-card-foreground{color:var(--color-card-foreground)}.text-current{color:currentColor}.text-destructive{color:var(--color-destructive)}.text-destructive-foreground{color:var(--color-destructive-foreground)}.text-emerald-500{color:var(--color-emerald-500)}.text-foreground{color:var(--color-foreground)}.text-muted-foreground,.text-muted-foreground\\/40{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/40{color:color-mix(in oklab,var(--color-muted-foreground)40%,transparent)}}.text-muted-foreground\\/50{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/50{color:color-mix(in oklab,var(--color-muted-foreground)50%,transparent)}}.text-muted-foreground\\/60{color:var(--color-muted-foreground)}@supports (color:color-mix(in lab,red,red)){.text-muted-foreground\\/60{color:color-mix(in oklab,var(--color-muted-foreground)60%,transparent)}}.text-popover-foreground{color:var(--color-popover-foreground)}.text-primary{color:var(--color-primary)}.text-primary-200{color:var(--color-primary-200)}.text-primary-400{color:var(--color-primary-400)}.text-primary-foreground{color:var(--color-primary-foreground)}.text-primary-light{color:var(--color-primary-light)}.text-red-400{color:var(--color-red-400)}.text-red-500{color:var(--color-red-500)}.text-transparent{color:#0000}.text-white{color:var(--color-white)}.text-zinc-100{color:var(--color-zinc-100)}.text-zinc-200{color:var(--color-zinc-200)}.text-zinc-400{color:var(--color-zinc-400)}.text-zinc-500{color:var(--color-zinc-500)}.capitalize{text-transform:capitalize}.lowercase{text-transform:lowercase}.normal-case{text-transform:none}.uppercase{text-transform:uppercase}.italic{font-style:italic}.not-italic{font-style:normal}.diagonal-fractions{--tw-numeric-fraction:diagonal-fractions;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.lining-nums{--tw-numeric-figure:lining-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.oldstyle-nums{--tw-numeric-figure:oldstyle-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.ordinal{--tw-ordinal:ordinal;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.proportional-nums{--tw-numeric-spacing:proportional-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.slashed-zero{--tw-slashed-zero:slashed-zero;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.stacked-fractions{--tw-numeric-fraction:stacked-fractions;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.normal-nums{font-variant-numeric:normal}.line-through{text-decoration-line:line-through}.no-underline{text-decoration-line:none}.overline{text-decoration-line:overline}.underline{text-decoration-line:underline}.underline-offset-2{text-underline-offset:2px}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.subpixel-antialiased{-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.accent-foreground{accent-color:var(--color-foreground)}.opacity-0{opacity:0}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-70{opacity:.7}.opacity-100{opacity:1}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-\\[0_0_32px_rgba\\(23\\,99\\,255\\,\\.38\\)\\]{--tw-shadow:0 0 32px var(--tw-shadow-color,#1763ff61);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px var(--tw-shadow-color,#0000001a),0 8px 10px -6px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring,.ring-1{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.inset-ring{--tw-inset-ring-shadow:inset 0 0 0 1px var(--tw-inset-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-black{--tw-shadow-color:#000}@supports (color:color-mix(in lab,red,red)){.shadow-black{--tw-shadow-color:color-mix(in oklab,var(--color-black)var(--tw-shadow-alpha),transparent)}}.shadow-black\\/20{--tw-shadow-color:#0003}@supports (color:color-mix(in lab,red,red)){.shadow-black\\/20{--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black)20%,transparent)var(--tw-shadow-alpha),transparent)}}.shadow-black\\/30{--tw-shadow-color:#0000004d}@supports (color:color-mix(in lab,red,red)){.shadow-black\\/30{--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-black)30%,transparent)var(--tw-shadow-alpha),transparent)}}.shadow-primary{--tw-shadow-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.shadow-primary{--tw-shadow-color:color-mix(in oklab,var(--color-primary)var(--tw-shadow-alpha),transparent)}}.shadow-primary\\/20{--tw-shadow-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.shadow-primary\\/20{--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-primary)20%,transparent)var(--tw-shadow-alpha),transparent)}}.ring-foreground,.ring-foreground\\/10{--tw-ring-color:var(--color-foreground)}@supports (color:color-mix(in lab,red,red)){.ring-foreground\\/10{--tw-ring-color:color-mix(in oklab,var(--color-foreground)10%,transparent)}}.outline-hidden{--tw-outline-style:none;outline-style:none}@media(forced-colors:active){.outline-hidden{outline-offset:2px;outline:2px solid #0000}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.drop-shadow{--tw-drop-shadow-size:drop-shadow(0 1px 2px var(--tw-drop-shadow-color,#0000001a))drop-shadow(0 1px 1px var(--tw-drop-shadow-color,#0000000f));--tw-drop-shadow:drop-shadow(0 1px 2px #0000001a)drop-shadow(0 1px 1px #0000000f);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.grayscale{--tw-grayscale:grayscale(100%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.invert{--tw-invert:invert(100%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.sepia{--tw-sepia:sepia(100%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.filter{filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.backdrop-blur{--tw-backdrop-blur:blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-blur-\\[16px\\]{--tw-backdrop-blur:blur(16px);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-grayscale{--tw-backdrop-grayscale:grayscale(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-invert{--tw-backdrop-invert:invert(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-sepia{--tw-backdrop-sepia:sepia(100%);-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-filter{-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-none{transition-property:none}.delay-500{transition-delay:.5s}.duration-100{--tw-duration:.1s;transition-duration:.1s}.duration-150{--tw-duration:.15s;transition-duration:.15s}.duration-200{--tw-duration:.2s;transition-duration:.2s}.duration-300{--tw-duration:.3s;transition-duration:.3s}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.ease-out{--tw-ease:var(--ease-out);transition-timing-function:var(--ease-out)}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.\\[tenant-alpha\\:getFilePages\\]{tenant-alpha:getFilePages}:where(.divide-x-reverse>:not(:last-child)){--tw-divide-x-reverse:1}.ring-inset{--tw-ring-inset:inset}@media(hover:hover){.group-hover\\:border-dashed:is(:where(.group):hover *){--tw-border-style:dashed;border-style:dashed}.group-hover\\:border-blue-400\\/50:is(:where(.group):hover *){border-color:#54a2ff80}@supports (color:color-mix(in lab,red,red)){.group-hover\\:border-blue-400\\/50:is(:where(.group):hover *){border-color:color-mix(in oklab,var(--color-blue-400)50%,transparent)}}.group-hover\\:border-primary:is(:where(.group):hover *){border-color:var(--color-primary)}.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}}.group-has-disabled\\/field\\:opacity-50:is(:where(.group\\/field):has(:disabled) *){opacity:.5}.placeholder\\:text-\\[var\\(--local-toolbar-text\\)\\]::placeholder{color:var(--local-toolbar-text)}.placeholder\\:text-muted-foreground::placeholder{color:var(--color-muted-foreground)}.after\\:absolute:after{content:var(--tw-content);position:absolute}.after\\:-inset-x-3:after{content:var(--tw-content);inset-inline:calc(var(--spacing)*-3)}.after\\:-inset-y-2:after{content:var(--tw-content);inset-block:calc(var(--spacing)*-2)}.last\\:border-r-0:last-child{border-right-style:var(--tw-border-style);border-right-width:0}.last\\:border-b-0:last-child{border-bottom-style:var(--tw-border-style);border-bottom-width:0}@media(hover:hover){.hover\\:border-zinc-600:hover{border-color:var(--color-zinc-600)}.hover\\:bg-\\[var\\(--elevated\\)\\]:hover{background-color:var(--elevated)}.hover\\:bg-\\[var\\(--local-toolbar-hover-bg\\)\\]:hover{background-color:var(--local-toolbar-hover-bg)}.hover\\:bg-card:hover{background-color:var(--color-card)}.hover\\:bg-destructive\\/25:hover{background-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-destructive\\/25:hover{background-color:color-mix(in oklab,var(--color-destructive)25%,transparent)}}.hover\\:bg-elevated:hover,.hover\\:bg-elevated\\/70:hover{background-color:var(--color-elevated)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-elevated\\/70:hover{background-color:color-mix(in oklab,var(--color-elevated)70%,transparent)}}.hover\\:bg-muted:hover,.hover\\:bg-muted\\/20:hover{background-color:var(--color-muted)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-muted\\/20:hover{background-color:color-mix(in oklab,var(--color-muted)20%,transparent)}}.hover\\:bg-primary-900:hover{background-color:var(--color-primary-900)}.hover\\:bg-primary\\/90:hover{background-color:var(--color-primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--color-primary)90%,transparent)}}.hover\\:bg-white\\/30:hover{background-color:#ffffff4d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/30:hover{background-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.hover\\:bg-zinc-800:hover{background-color:var(--color-zinc-800)}.hover\\:bg-zinc-900:hover{background-color:var(--color-zinc-900)}.hover\\:pl-1:hover{padding-left:calc(var(--spacing)*1)}.hover\\:text-\\[var\\(--local-fg\\)\\]:hover{color:var(--local-fg)}.hover\\:text-\\[var\\(--local-p300\\)\\]:hover{color:var(--local-p300)}.hover\\:text-\\[var\\(--local-primary\\)\\]:hover{color:var(--local-primary)}.hover\\:text-\\[var\\(--local-text\\)\\]:hover{color:var(--local-text)}.hover\\:text-foreground:hover{color:var(--color-foreground)}.hover\\:text-muted-foreground:hover{color:var(--color-muted-foreground)}.hover\\:text-primary-200:hover{color:var(--color-primary-200)}.hover\\:text-primary-light:hover{color:var(--color-primary-light)}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:text-zinc-200:hover{color:var(--color-zinc-200)}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-90:hover{opacity:.9}.hover\\:brightness-110:hover{--tw-brightness:brightness(110%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}}.focus\\:border-destructive-ring:focus{border-color:var(--color-destructive-ring)}.focus\\:border-primary:focus{border-color:var(--color-primary)}.focus\\:bg-accent:focus{background-color:var(--color-accent)}.focus\\:bg-zinc-800:focus{background-color:var(--color-zinc-800)}.focus\\:text-accent-foreground:focus{color:var(--color-accent-foreground)}.focus\\:text-white:focus{color:var(--color-white)}.focus\\:ring-1:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-destructive-ring:focus{--tw-ring-color:var(--color-destructive-ring)}.focus\\:ring-primary:focus{--tw-ring-color:var(--color-primary)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}:is(.not-data-\\[variant\\=destructive\\]\\:focus\\:\\*\\*\\:text-accent-foreground:not([data-variant=destructive]):focus *){color:var(--color-accent-foreground)}.focus-visible\\:border-ring:focus-visible{border-color:var(--color-ring)}.focus-visible\\:border-zinc-600:focus-visible{border-color:var(--color-zinc-600)}.focus-visible\\:ring-2:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-3:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(3px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-\\[var\\(--ring\\)\\]:focus-visible{--tw-ring-color:var(--ring)}.focus-visible\\:ring-blue-500\\/80:focus-visible{--tw-ring-color:#3080ffcc}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-blue-500\\/80:focus-visible{--tw-ring-color:color-mix(in oklab,var(--color-blue-500)80%,transparent)}}.focus-visible\\:ring-ring:focus-visible,.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--color-ring)}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab,var(--color-ring)50%,transparent)}}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color)}.focus-visible\\:ring-offset-\\[var\\(--local-bg\\)\\]:focus-visible{--tw-ring-offset-color:var(--local-bg)}.focus-visible\\:outline-none:focus-visible{--tw-outline-style:none;outline-style:none}.focus-visible\\:ring-inset:focus-visible{--tw-ring-inset:inset}.active\\:scale-\\[0\\.98\\]:active{scale:.98}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:bg-input\\/50:disabled{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.disabled\\:bg-input\\/50:disabled{background-color:color-mix(in oklab,var(--color-input)50%,transparent)}}.disabled\\:opacity-30:disabled{opacity:.3}.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:opacity-50:disabled{opacity:.5}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--color-destructive)}.aria-invalid\\:ring-3[aria-invalid=true]{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(3px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--color-destructive)20%,transparent)}}.aria-invalid\\:aria-checked\\:border-primary[aria-invalid=true][aria-checked=true],.data-checked\\:border-primary[data-checked]{border-color:var(--color-primary)}.data-checked\\:bg-primary[data-checked]{background-color:var(--color-primary)}.data-checked\\:text-primary-foreground[data-checked]{color:var(--color-primary-foreground)}.data-disabled\\:pointer-events-none[data-disabled]{pointer-events:none}.data-disabled\\:opacity-50[data-disabled]{opacity:.5}.data-placeholder\\:text-muted-foreground[data-placeholder]{color:var(--color-muted-foreground)}.data-\\[align-trigger\\=true\\]\\:animate-none[data-align-trigger=true]{animation:none}.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{pointer-events:none}.data-\\[disabled\\]\\:opacity-50[data-disabled]{opacity:.5}.data-\\[side\\=bottom\\]\\:translate-y-1[data-side=bottom]{--tw-translate-y:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=left\\]\\:-translate-x-1[data-side=left]{--tw-translate-x:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=right\\]\\:translate-x-1[data-side=right]{--tw-translate-x:calc(var(--spacing)*1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[side\\=top\\]\\:-translate-y-1[data-side=top]{--tw-translate-y:calc(var(--spacing)*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[size\\=default\\]\\:h-8[data-size=default]{height:calc(var(--spacing)*8)}.data-\\[size\\=sm\\]\\:h-7[data-size=sm]{height:calc(var(--spacing)*7)}.data-\\[size\\=sm\\]\\:rounded-\\[min\\(var\\(--radius-md\\)\\,10px\\)\\][data-size=sm]{border-radius:min(var(--radius-md),10px)}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:line-clamp-1>*)[data-slot=select-value]{-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:flex>*)[data-slot=select-value]{display:flex}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:items-center>*)[data-slot=select-value]{align-items:center}:is(.\\*\\:data-\\[slot\\=select-value\\]\\:gap-1\\.5>*)[data-slot=select-value]{gap:calc(var(--spacing)*1.5)}@media(min-width:40rem){.sm\\:inline-flex{display:inline-flex}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}.sm\\:items-center{align-items:center}}@media(min-width:48rem){.md\\:order-1{order:1}.md\\:order-2{order:2}.md\\:col-span-9{grid-column:span 9/span 9}.md\\:col-span-11{grid-column:span 11/span 11}.md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.md\\:grid-cols-20{grid-template-columns:repeat(20,minmax(0,1fr))}.md\\:grid-cols-\\[280px_1fr\\]{grid-template-columns:280px 1fr}.md\\:p-\\[40px_42px\\]{padding:40px 42px}.md\\:text-5xl{font-size:var(--text-5xl);line-height:var(--tw-leading,var(--text-5xl--line-height))}.md\\:text-6xl{font-size:var(--text-6xl);line-height:var(--tw-leading,var(--text-6xl--line-height))}.md\\:text-7xl{font-size:var(--text-7xl);line-height:var(--tw-leading,var(--text-7xl--line-height))}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}}@media(min-width:64rem){.lg\\:sticky{position:sticky}.lg\\:ml-60{margin-left:calc(var(--spacing)*60)}.lg\\:flex{display:flex}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.lg\\:grid-cols-\\[1fr_420px\\]{grid-template-columns:1fr 420px}.lg\\:grid-cols-\\[1fr_440px\\]{grid-template-columns:1fr 440px}.lg\\:gap-10{gap:calc(var(--spacing)*10)}.lg\\:self-start{align-self:flex-start}.lg\\:px-12{padding-inline:calc(var(--spacing)*12)}}@media(prefers-color-scheme:dark){.dark\\:bg-input\\/30{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-input\\/30{background-color:color-mix(in oklab,var(--color-input)30%,transparent)}}@media(hover:hover){.dark\\:hover\\:bg-input\\/50:hover{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-input\\/50:hover{background-color:color-mix(in oklab,var(--color-input)50%,transparent)}}}.dark\\:disabled\\:bg-input\\/80:disabled{background-color:var(--color-input)}@supports (color:color-mix(in lab,red,red)){.dark\\:disabled\\:bg-input\\/80:disabled{background-color:color-mix(in oklab,var(--color-input)80%,transparent)}}.dark\\:aria-invalid\\:border-destructive\\/50[aria-invalid=true]{border-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:aria-invalid\\:border-destructive\\/50[aria-invalid=true]{border-color:color-mix(in oklab,var(--color-destructive)50%,transparent)}}.dark\\:aria-invalid\\:ring-destructive\\/40[aria-invalid=true]{--tw-ring-color:var(--color-destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:aria-invalid\\:ring-destructive\\/40[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--color-destructive)40%,transparent)}}.dark\\:data-checked\\:bg-primary[data-checked]{background-color:var(--color-primary)}}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}:is(.\\*\\:\\[span\\]\\:last\\:flex>*):is(span):last-child{display:flex}:is(.\\*\\:\\[span\\]\\:last\\:items-center>*):is(span):last-child{align-items:center}:is(.\\*\\:\\[span\\]\\:last\\:gap-2>*):is(span):last-child{gap:calc(var(--spacing)*2)}.\\[\\&\\>span\\]\\:line-clamp-1>span{-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.\\[\\&\\>span\\]\\:flex>span{display:flex}.\\[\\&\\>span\\]\\:items-center>span{align-items:center}.\\[\\&\\>span\\]\\:gap-2>span{gap:calc(var(--spacing)*2)}.\\[\\&\\>svg\\]\\:size-3\\.5>svg{width:calc(var(--spacing)*3.5);height:calc(var(--spacing)*3.5)}.font-display{font-family:var(--theme-font-display)}.font-mono-olon{font-family:var(--theme-font-mono)}.tracking-label{letter-spacing:var(--theme-tracking-label)}.tracking-display{letter-spacing:var(--theme-tracking-display)}.container-olon{width:100%;max-width:var(--theme-container-max);margin-left:auto;margin-right:auto;padding-left:1.5rem;padding-right:1.5rem}.section-anchor{scroll-margin-top:calc(var(--theme-header-h) + 24px)}[data-section-id]{position:relative}[data-jp-section-overlay]{pointer-events:none;z-index:9999;background:0 0;border:1px dashed #0000;transition:border-color .15s,background-color .15s;position:absolute;top:0;right:0;bottom:0;left:0}[data-section-id]:hover [data-jp-section-overlay]{border-color:var(--primary-light)}@supports (color:color-mix(in lab,red,red)){[data-section-id]:hover [data-jp-section-overlay]{border-color:color-mix(in srgb,var(--primary-light)75%,transparent)}}[data-section-id]:hover [data-jp-section-overlay]{background-color:var(--primary-900)}@supports (color:color-mix(in lab,red,red)){[data-section-id]:hover [data-jp-section-overlay]{background-color:color-mix(in srgb,var(--primary-900)12%,transparent)}}[data-section-id][data-jp-selected] [data-jp-section-overlay]{border-color:var(--primary-light);background-color:var(--primary-900)}@supports (color:color-mix(in lab,red,red)){[data-section-id][data-jp-selected] [data-jp-section-overlay]{background-color:color-mix(in srgb,var(--primary-900)20%,transparent)}}[data-jp-section-overlay]>div{font-family:var(--theme-font-mono);font-size:var(--theme-text-xs);letter-spacing:var(--theme-tracking-label);text-transform:uppercase;color:var(--primary-light);background:var(--background);position:absolute;top:8px;left:8px}@supports (color:color-mix(in lab,red,red)){[data-jp-section-overlay]>div{background:color-mix(in srgb,var(--background)82%,transparent)}}[data-jp-section-overlay]>div{border:1px solid var(--primary-light)}@supports (color:color-mix(in lab,red,red)){[data-jp-section-overlay]>div{border:1px solid color-mix(in srgb,var(--primary-light)50%,transparent)}}[data-jp-section-overlay]>div{border-radius:var(--theme-radius-sm);opacity:0;padding:2px 8px;transition:opacity .15s,transform .15s;transform:translateY(-2px)}[data-section-id]:hover [data-jp-section-overlay]>div,[data-section-id][data-jp-selected] [data-jp-section-overlay]>div{opacity:1;transform:translateY(0)}.ds-divider{border:none;border-top:.5px solid var(--border);margin:0}.token-label{font-family:var(--theme-font-mono);font-size:var(--theme-text-xs);color:var(--muted-foreground)}.nav-link{font-size:var(--theme-text-sm);color:var(--muted-foreground);border-radius:var(--theme-radius-sm);cursor:pointer;padding:5px 12px;text-decoration:none;transition:color .15s,background-color .15s;display:block}.nav-link:hover{color:var(--foreground);background-color:var(--elevated)}.nav-link.active{color:var(--primary-light);background-color:var(--elevated)}.focus-ring{box-shadow:0 0 0 2px var(--ring);outline:none}.code-inline{font-family:var(--theme-font-mono);background-color:var(--primary-900);color:var(--primary-light);border-radius:var(--theme-radius-sm);padding:1px 6px;font-size:.85em}.surface-base{background-color:var(--background)}.surface-card{background-color:var(--card)}.surface-elevated{background-color:var(--elevated)}.surface-overlay{background-color:var(--overlay)}.surface-destructive{background-color:var(--destructive);color:var(--destructive-foreground);border-color:var(--destructive-border)}.surface-success{background-color:var(--success);color:var(--success-foreground);border-color:var(--success-border)}.surface-warning{background-color:var(--warning);color:var(--warning-foreground);border-color:var(--warning-border)}.surface-info{background-color:var(--info);color:var(--info-foreground);border-color:var(--info-border)}.syntax-keyword{color:var(--primary-400)}.syntax-string{color:var(--primary-200)}.syntax-property{color:var(--accent)}.syntax-variable{color:var(--primary-light)}.syntax-comment{color:var(--muted-foreground)}.syntax-value{color:var(--primary-light)}.hero-media-overlay{background:linear-gradient(to right,var(--background)0%,var(--background)16%,var(--background)34%,var(--background)54%,var(--background)74%,var(--background)100%),linear-gradient(to top,var(--background)0%,var(--background)28%,var(--background)56%)}@supports (color:color-mix(in lab,red,red)){.hero-media-overlay{background:linear-gradient(to right,color-mix(in srgb,var(--background)100%,transparent),color-mix(in srgb,var(--background)82%,transparent)16%,color-mix(in srgb,var(--background)56%,transparent)34%,color-mix(in srgb,var(--background)22%,transparent),color-mix(in srgb,var(--background)6%,transparent)74%,color-mix(in srgb,var(--background)0%,transparent)),linear-gradient(to top,color-mix(in srgb,var(--background)24%,transparent),color-mix(in srgb,var(--background)8%,transparent),color-mix(in srgb,var(--background)0%,transparent)56%)}}.hero-media-portrait{aspect-ratio:3/4;min-height:26rem}@media(min-width:768px){.hero-media-portrait{min-height:34rem}}}:root{--background:var(--theme-colors-background);--card:var(--theme-colors-card);--elevated:var(--theme-colors-elevated);--overlay:var(--theme-colors-overlay);--popover:var(--theme-colors-popover);--popover-foreground:var(--theme-colors-popover-foreground);--foreground:var(--theme-colors-foreground);--card-foreground:var(--theme-colors-card-foreground);--muted-foreground:var(--theme-colors-muted-foreground);--placeholder:var(--theme-colors-placeholder);--primary:var(--theme-colors-primary);--primary-foreground:var(--theme-colors-primary-foreground);--primary-light:var(--theme-colors-primary-light);--primary-dark:var(--theme-colors-primary-dark);--primary-50:var(--theme-colors-primary-50);--primary-100:var(--theme-colors-primary-100);--primary-200:var(--theme-colors-primary-200);--primary-300:var(--theme-colors-primary-300);--primary-400:var(--theme-colors-primary-400);--primary-500:var(--theme-colors-primary-500);--primary-600:var(--theme-colors-primary-600);--primary-700:var(--theme-colors-primary-700);--primary-800:var(--theme-colors-primary-800);--primary-900:var(--theme-colors-primary-900);--accent:var(--theme-colors-accent);--accent-foreground:var(--theme-colors-accent-foreground);--secondary:var(--theme-colors-secondary);--secondary-foreground:var(--theme-colors-secondary-foreground);--muted:var(--theme-colors-muted);--border:var(--theme-colors-border);--border-strong:var(--theme-colors-border-strong);--input:var(--theme-colors-input);--ring:var(--theme-colors-ring);--destructive:var(--theme-colors-destructive);--destructive-foreground:var(--theme-colors-destructive-foreground);--destructive-border:var(--theme-colors-destructive-border);--destructive-ring:var(--theme-colors-destructive-ring);--success:var(--theme-colors-success);--success-foreground:var(--theme-colors-success-foreground);--success-border:var(--theme-colors-success-border);--success-indicator:var(--theme-colors-success-indicator);--warning:var(--theme-colors-warning);--warning-foreground:var(--theme-colors-warning-foreground);--warning-border:var(--theme-colors-warning-border);--info:var(--theme-colors-info);--info-foreground:var(--theme-colors-info-foreground);--info-border:var(--theme-colors-info-border);--theme-radius-xl:var(--theme-border-radius-xl);--theme-radius-full:var(--theme-border-radius-full);--theme-text-xs:var(--theme-typography-scale-xs);--theme-text-sm:var(--theme-typography-scale-sm);--theme-text-base:var(--theme-typography-scale-base);--theme-text-md:var(--theme-typography-scale-md);--theme-text-lg:var(--theme-typography-scale-lg);--theme-text-xl:var(--theme-typography-scale-xl);--theme-text-2xl:var(--theme-typography-scale-2xl);--theme-text-3xl:var(--theme-typography-scale-3xl);--theme-text-4xl:var(--theme-typography-scale-4xl);--theme-text-5xl:var(--theme-typography-scale-5xl);--theme-text-6xl:var(--theme-typography-scale-6xl);--theme-text-7xl:var(--theme-typography-scale-7xl);--theme-tracking-tight:var(--theme-typography-tracking-tight);--theme-tracking-display:var(--theme-typography-tracking-display);--theme-tracking-normal:var(--theme-typography-tracking-normal);--theme-tracking-wide:var(--theme-typography-tracking-wide);--theme-tracking-label:var(--theme-typography-tracking-label);--wordmark-font:var(--theme-typography-wordmark-font-family);--wordmark-tracking:var(--theme-typography-wordmark-tracking);--wordmark-weight:var(--theme-typography-wordmark-weight);--wordmark-width:var(--theme-typography-wordmark-width);--theme-leading-none:var(--theme-typography-leading-none);--theme-leading-tight:var(--theme-typography-leading-tight);--theme-leading-snug:var(--theme-typography-leading-snug);--theme-leading-normal:var(--theme-typography-leading-normal);--theme-leading-relaxed:var(--theme-typography-leading-relaxed);--theme-container-max:var(--theme-spacing-container-max);--theme-section-y:var(--theme-spacing-section-y);--theme-header-h:var(--theme-spacing-header-h);--theme-sidebar-w:var(--theme-spacing-sidebar-w);--z-base:var(--theme-z-index-base);--z-elevated:var(--theme-z-index-elevated);--z-dropdown:var(--theme-z-index-dropdown);--z-sticky:var(--theme-z-index-sticky);--z-overlay:var(--theme-z-index-overlay);--z-modal:var(--theme-z-index-modal);--z-toast:var(--theme-z-index-toast)}.jp-simple-editor .ProseMirror{word-break:break-word;outline:none}.jp-tiptap-content,.jp-simple-editor .ProseMirror{color:var(--foreground);font-family:var(--theme-font-primary);font-size:var(--theme-text-md);line-height:var(--theme-leading-relaxed)}.jp-tiptap-content>*+*,.jp-simple-editor .ProseMirror>*+*{margin-top:.75em}.jp-tiptap-content h1,.jp-simple-editor .ProseMirror h1{font-family:var(--theme-font-display,var(--theme-font-primary));font-size:var(--theme-text-4xl);font-weight:700;line-height:var(--theme-leading-tight);letter-spacing:var(--theme-tracking-display);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}@media(min-width:768px){.jp-tiptap-content h1,.jp-simple-editor .ProseMirror h1{font-size:var(--theme-text-5xl)}}.jp-tiptap-content h2,.jp-simple-editor .ProseMirror h2{font-family:var(--theme-font-display,var(--theme-font-primary));font-size:var(--theme-text-3xl);font-weight:700;line-height:var(--theme-leading-tight);letter-spacing:var(--theme-tracking-tight);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}.jp-tiptap-content h3,.jp-simple-editor .ProseMirror h3{font-size:var(--theme-text-2xl);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1.25em;margin-bottom:.25em}.jp-tiptap-content h4,.jp-simple-editor .ProseMirror h4{font-size:var(--theme-text-xl);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content h5,.jp-simple-editor .ProseMirror h5{font-size:var(--theme-text-lg);font-weight:600;line-height:var(--theme-leading-snug);color:var(--foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content h6,.jp-simple-editor .ProseMirror h6{font-size:var(--theme-text-md);font-weight:600;line-height:var(--theme-leading-normal);letter-spacing:var(--theme-tracking-wide);color:var(--muted-foreground);margin-top:1em;margin-bottom:.25em}.jp-tiptap-content p,.jp-simple-editor .ProseMirror p{line-height:var(--theme-leading-relaxed)}.jp-tiptap-content strong,.jp-simple-editor .ProseMirror strong{font-weight:700}.jp-tiptap-content em,.jp-simple-editor .ProseMirror em{font-style:italic}.jp-tiptap-content s,.jp-simple-editor .ProseMirror s{text-decoration:line-through}.jp-tiptap-content a,.jp-simple-editor .ProseMirror a{color:var(--primary);text-underline-offset:2px;text-decoration:underline}.jp-tiptap-content a:hover,.jp-simple-editor .ProseMirror a:hover{opacity:.88}.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{font-family:var(--theme-font-mono);font-size:var(--theme-text-sm);background:var(--foreground)}@supports (color:color-mix(in lab,red,red)){.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{background:color-mix(in srgb,var(--foreground)10%,transparent)}}.jp-tiptap-content code,.jp-simple-editor .ProseMirror code{border-radius:var(--theme-radius-sm);padding:.1em .35em}.jp-tiptap-content pre,.jp-simple-editor .ProseMirror pre{background:var(--elevated);border:1px solid var(--border);border-radius:var(--theme-radius-md);font-size:var(--theme-text-sm);line-height:var(--theme-leading-relaxed);padding:1em 1.25em;overflow-x:auto}.jp-tiptap-content pre code,.jp-simple-editor .ProseMirror pre code{font-size:inherit;background:0 0;padding:0}.jp-tiptap-content ul,.jp-simple-editor .ProseMirror ul{padding-left:1.625em;list-style-type:disc}.jp-tiptap-content ol,.jp-simple-editor .ProseMirror ol{padding-left:1.625em;list-style-type:decimal}.jp-tiptap-content li,.jp-simple-editor .ProseMirror li{line-height:var(--theme-leading-relaxed);margin-top:.25em}.jp-tiptap-content li+li,.jp-simple-editor .ProseMirror li+li{margin-top:.25em}.jp-tiptap-content blockquote,.jp-simple-editor .ProseMirror blockquote{border-left:3px solid var(--border);color:var(--muted-foreground);padding-left:1em;font-style:italic}.jp-tiptap-content hr,.jp-simple-editor .ProseMirror hr{border:none;border-top:1px solid var(--border);margin:1.5em 0}.jp-tiptap-content img,.jp-simple-editor .ProseMirror img{border-radius:var(--theme-radius-md);max-width:100%;height:auto}.jp-simple-editor .ProseMirror img[data-uploading=true]{opacity:.6;filter:grayscale(.25);outline:2px dashed var(--primary)}@supports (color:color-mix(in lab,red,red)){.jp-simple-editor .ProseMirror img[data-uploading=true]{outline:2px dashed color-mix(in srgb,var(--primary)70%,transparent)}}.jp-simple-editor .ProseMirror img[data-uploading=true]{outline-offset:2px}.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline:2px solid var(--destructive)}@supports (color:color-mix(in lab,red,red)){.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline:2px solid color-mix(in srgb,var(--destructive)85%,transparent)}}.jp-simple-editor .ProseMirror img[data-upload-error=true]{outline-offset:2px}.jp-simple-editor .ProseMirror p.is-editor-empty:first-child:before{content:attr(data-placeholder);color:var(--muted-foreground);opacity:.5;pointer-events:none;float:left;height:0}.jp-docs-toc-scroll{scrollbar-width:thin;scrollbar-color:var(--border)transparent}.jp-docs-toc-scroll::-webkit-scrollbar{width:6px}.jp-docs-toc-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:var(--theme-radius-sm)}.jp-docs-toc-scroll::-webkit-scrollbar-thumb:hover{background:var(--border-strong)}.animate-fadeInUp{animation:.6s forwards fadeInUp}.card-hover:hover{transform:translateY(-2px)}.jp-feature-card{background-color:var(--card);border-style:solid;border-width:1px;border-color:var(--border);border-radius:1rem;transition:all .2s}@keyframes fadeInUp{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}[data-theme=light]{--background:var(--theme-modes-light-colors-background);--card:var(--theme-modes-light-colors-card);--elevated:var(--theme-modes-light-colors-elevated);--overlay:var(--theme-modes-light-colors-overlay);--popover:var(--theme-modes-light-colors-popover);--popover-foreground:var(--theme-modes-light-colors-popover-foreground);--foreground:var(--theme-modes-light-colors-foreground);--card-foreground:var(--theme-modes-light-colors-card-foreground);--muted-foreground:var(--theme-modes-light-colors-muted-foreground);--placeholder:var(--theme-modes-light-colors-placeholder);--primary:var(--theme-modes-light-colors-primary);--primary-foreground:var(--theme-modes-light-colors-primary-foreground);--primary-light:var(--theme-modes-light-colors-primary-light);--primary-dark:var(--theme-modes-light-colors-primary-dark);--primary-50:var(--theme-modes-light-colors-primary-50);--primary-100:var(--theme-modes-light-colors-primary-100);--primary-200:var(--theme-modes-light-colors-primary-200);--primary-300:var(--theme-modes-light-colors-primary-300);--primary-400:var(--theme-modes-light-colors-primary-400);--primary-500:var(--theme-modes-light-colors-primary-500);--primary-600:var(--theme-modes-light-colors-primary-600);--primary-700:var(--theme-modes-light-colors-primary-700);--primary-800:var(--theme-modes-light-colors-primary-800);--primary-900:var(--theme-modes-light-colors-primary-900);--accent:var(--theme-modes-light-colors-accent);--accent-foreground:var(--theme-modes-light-colors-accent-foreground);--secondary:var(--theme-modes-light-colors-secondary);--secondary-foreground:var(--theme-modes-light-colors-secondary-foreground);--muted:var(--theme-modes-light-colors-muted);--border:var(--theme-modes-light-colors-border);--border-strong:var(--theme-modes-light-colors-border-strong);--input:var(--theme-modes-light-colors-input);--ring:var(--theme-modes-light-colors-ring);--destructive:var(--theme-modes-light-colors-destructive);--destructive-foreground:var(--theme-modes-light-colors-destructive-foreground);--destructive-border:var(--theme-modes-light-colors-destructive-border);--destructive-ring:var(--theme-modes-light-colors-destructive-ring);--success:var(--theme-modes-light-colors-success);--success-foreground:var(--theme-modes-light-colors-success-foreground);--success-border:var(--theme-modes-light-colors-success-border);--success-indicator:var(--theme-modes-light-colors-success-indicator);--warning:var(--theme-modes-light-colors-warning);--warning-foreground:var(--theme-modes-light-colors-warning-foreground);--warning-border:var(--theme-modes-light-colors-warning-border);--info:var(--theme-modes-light-colors-info);--info-foreground:var(--theme-modes-light-colors-info-foreground);--info-border:var(--theme-modes-light-colors-info-border)}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-pan-x{syntax:"*";inherits:false}@property --tw-pan-y{syntax:"*";inherits:false}@property --tw-pinch-zoom{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-space-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-x-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-gradient-position{syntax:"*";inherits:false}@property --tw-gradient-from{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:"*";inherits:false}@property --tw-gradient-via-stops{syntax:"*";inherits:false}@property --tw-gradient-from-position{syntax:"<length-percentage>";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:"<length-percentage>";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:"<length-percentage>";inherits:false;initial-value:100%}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-content{syntax:"*";inherits:false;initial-value:""}@keyframes pulse{50%{opacity:.5}}`;
const siteConfig = siteData;
const menuConfig = { main: [] };
const themeConfig = themeData;
const pages = getFilePages();
const refDocuments = {
  "menu.json": menuData,
  "config/menu.json": menuData,
  "src/data/config/menu.json": menuData
};
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
  const location = resolved.slug === "home" ? "/" : `/${resolved.slug}`;
  const resolvedRuntime = Gt({
    pages,
    siteConfig,
    themeConfig,
    menuConfig,
    refDocuments
  });
  const resolvedPage = resolvedRuntime.pages[resolved.slug] ?? resolved.page;
  return renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location, children: /* @__PURE__ */ jsx(
      Dd,
      {
        config: {
          registry: ComponentRegistry,
          schemas: SECTION_SCHEMAS,
          tenantId: resolveTenantId()
        },
        children: /* @__PURE__ */ jsx(Qo, { mode: "visitor", children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(
          ss,
          {
            pageConfig: resolvedPage,
            siteConfig: resolvedRuntime.siteConfig,
            menuConfig: resolvedRuntime.menuConfig
          }
        ) }) })
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
function getWebMcpBuildState() {
  return {
    pages,
    schemas: SECTION_SCHEMAS,
    siteConfig
  };
}
export {
  getCss,
  getPageMeta,
  getWebMcpBuildState,
  render
};
