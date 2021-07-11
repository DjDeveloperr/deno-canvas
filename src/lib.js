import { decodeBase64 } from "./base64.ts";
import { WASM_BASE64 } from "./wasm.js";

// Some compatibility stuff
let document = { getElementById: () => undefined };
let wasmBuff = decodeBase64(WASM_BASE64);
let storeWasm;

export const CanvasKitInit = (function () {
  var _scriptDir = typeof document !== "undefined" && document.currentScript
    ? document.currentScript.src
    : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (CanvasKitInit) {
    CanvasKitInit = CanvasKitInit || {};

    null;
    var f;
    f || (f = typeof CanvasKitInit !== "undefined" ? CanvasKitInit : {});
    var ba, ea;
    f.ready = new Promise(function (a, b) {
      ba = a;
      ea = b;
    });
    (function (a) {
      a.Of = a.Of || [];
      a.Of.push(function () {
        a.MakeSWCanvasSurface = function (b) {
          var c = b;
          if (
            "CANVAS" !== c.tagName &&
            ((c = document.getElementById(b)), !c)
          ) {
            throw "Canvas with id " + b + " was not found";
          }
          if ((b = a.MakeSurface(c.width, c.height))) b.Ff = c;
          return b;
        };
        a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
        a.MakeSurface = function (b, c) {
          var d = {
              width: b,
              height: c,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.SkColorSpace.SRGB,
            },
            h = b * c * 4,
            m = a._malloc(h);
          if ((d = this._getRasterDirectSurface(d, m, 4 * b))) {
            (d.Ff = null),
              (d.Ah = b),
              (d.wh = c),
              (d.zh = h),
              (d.Yg = m),
              d.getCanvas().clear(a.TRANSPARENT);
          }
          return d;
        };
        a.SkSurface.prototype.flush = function (b) {
          this._flush();
          if (this.Ff) {
            var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.Yg, this.zh);
            c = new ImageData(c, this.Ah, this.wh);
            b
              ? this.Ff.getContext("2d").putImageData(
                c,
                0,
                0,
                b[0],
                b[1],
                b[2] - b[0],
                b[3] - b[1],
              )
              : this.Ff.getContext("2d").putImageData(c, 0, 0);
          }
        };
        a.SkSurface.prototype.dispose = function () {
          this.Yg && a._free(this.Yg);
          this.delete();
        };
        a.currentContext = a.currentContext || function () {};
        a.setCurrentContext = a.setCurrentContext || function () {};
      });
    })(f);
    (function (a) {
      a.Of = a.Of || [];
      a.Of.push(function () {
        function b(c, d, h) {
          return c && c.hasOwnProperty(d) ? c[d] : h;
        }
        a.GetWebGLContext = function (c, d) {
          if (!c) throw "null canvas passed into makeWebGLContext";
          var h = {
            alpha: b(d, "alpha", 1),
            depth: b(d, "depth", 1),
            stencil: b(d, "stencil", 8),
            antialias: b(d, "antialias", 0),
            premultipliedAlpha: b(d, "premultipliedAlpha", 1),
            preserveDrawingBuffer: b(d, "preserveDrawingBuffer", 0),
            preferLowPowerToHighPerformance: b(
              d,
              "preferLowPowerToHighPerformance",
              0,
            ),
            failIfMajorPerformanceCaveat: b(
              d,
              "failIfMajorPerformanceCaveat",
              0,
            ),
            enableExtensionsByDefault: b(d, "enableExtensionsByDefault", 1),
            explicitSwapControl: b(d, "explicitSwapControl", 0),
            renderViaOffscreenBackBuffer: b(
              d,
              "renderViaOffscreenBackBuffer",
              0,
            ),
          };
          h.majorVersion = d && d.majorVersion
            ? d.majorVersion
            : "undefined" !== typeof WebGL2RenderingContext
            ? 2
            : 1;
          if (h.explicitSwapControl) {
            throw "explicitSwapControl is not supported";
          }
          if (
            (c = 1 < h.majorVersion
              ? c.getContext("webgl2", h)
              : c.getContext("webgl", h))
          ) {
            d = fa(ha);
            var m = { Nh: d, attributes: h, version: h.majorVersion, nh: c };
            c.canvas && (c.canvas.uh = m);
            ha[d] = m;
            ("undefined" === typeof h.Fh || h.Fh) && ja(m);
            h = d;
          } else h = 0;
          if (!h) return 0;
          ka(h);
          return h;
        };
        a.MakeWebGLCanvasSurface = function (c, d, h) {
          d = d || null;
          var m = c,
            q = "undefined" !== typeof OffscreenCanvas &&
              m instanceof OffscreenCanvas;
          if (
            !(
              ("undefined" !== typeof HTMLCanvasElement &&
                m instanceof HTMLCanvasElement) ||
              q ||
              ((m = document.getElementById(c)), m)
            )
          ) {
            throw "Canvas with id " + c + " was not found";
          }
          c = this.GetWebGLContext(m, h);
          h = m.uh.version;
          if (!c || 0 > c) throw "failed to create webgl context: err " + c;
          q = this.MakeGrContext(c);
          d = this.MakeOnScreenGLSurface(q, m.width, m.height, d);
          if (!d) {
            return (
              (d = m.cloneNode(!0)),
                m.parentNode.replaceChild(d, m),
                d.classList.add("ck-replaced"),
                a.MakeSWCanvasSurface(d)
            );
          }
          d.fg = c;
          d.grContext = q;
          d.openGLversion = h;
          return d;
        };
        a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
      });
    })(f);
    (function (a) {
      function b(g) {
        return Math.round(Math.max(0, Math.min(g || 0, 255)));
      }
      function c(g) {
        return g ? g.constructor === Float32Array && 4 === g.length : !1;
      }
      function d(g) {
        return (
          ((b(255 * g[3]) << 24) |
            (b(255 * g[0]) << 16) |
            (b(255 * g[1]) << 8) |
            (b(255 * g[2]) << 0)) >>>
          0
        );
      }
      function h(g) {
        if (g instanceof Float32Array) {
          for (
            var r = Math.floor(g.length / 4), A = new Uint32Array(r), D = 0;
            D < r;
            D++
          ) {
            A[D] = d(g.slice(4 * D, 4 * (D + 1)));
          }
          return A;
        }
        if (g instanceof Uint32Array) return g;
        if (g instanceof Array && g[0] instanceof Float32Array) {
          return g.map(d);
        }
      }
      function m(g) {
        if (void 0 === g) {
          return 1;
        }
        var r = parseFloat(g);
        return g && -1 !== g.indexOf("%") ? r / 100 : r;
      }
      function q(g, r, A) {
        if (!g || !g.length) return 0;
        if (g._ck) return g.byteOffset;
        var D = a[r].BYTES_PER_ELEMENT;
        A || (A = a._malloc(g.length * D));
        a[r].set(g, A / D);
        return A;
      }
      function u(g, r, A) {
        if (!g || !g.length) return 0;
        var D = a[r].BYTES_PER_ELEMENT;
        A || (A = a._malloc(g.length * g[0].length * D));
        r = a[r];
        var M = 0;
        D = A / D;
        for (var ca = 0; ca < g.length; ca++) {
          for (var e = 0; e < g[0].length; e++) {
            (r[D + M] = g[ca][e]), M++;
          }
        }
        return A;
      }
      function y(g) {
        var r = { Vf: 0, count: g.length, Ig: a.ColorType.RGBA_F32 };
        if (g instanceof Float32Array) {
          (r.Vf = q(g, "HEAPF32")), (r.count = g.length / 4);
        } else if (g instanceof Uint32Array) {
          (r.Vf = q(g, "HEAPU32")), (r.Ig = a.ColorType.RGBA_8888);
        } else if (g instanceof Array && g[0] instanceof Float32Array) {
          r.Vf = u(g, "HEAPF32");
        } else {
          throw (
            "Invalid argument to copyFlexibleColorArray, Not a color array " +
            typeof g
          );
        }
        return r;
      }
      function E(g) {
        if (!g) return 0;
        if (g.length) {
          if (6 !== g.length && 9 !== g.length) throw "invalid matrix size";
          var r = q(g, "HEAPF32", ib);
          6 === g.length && a.HEAPF32.set(Cb, 6 + r / 4);
          return r;
        }
        r = ec.toTypedArray();
        r[0] = g.m11;
        r[1] = g.m21;
        r[2] = g.m41;
        r[3] = g.m12;
        r[4] = g.m22;
        r[5] = g.m42;
        r[6] = g.m14;
        r[7] = g.m24;
        r[8] = g.m44;
        return ib;
      }
      function I(g) {
        if (!g) return 0;
        var r = fc.toTypedArray();
        if (g.length) {
          if (16 !== g.length && 6 !== g.length && 9 !== g.length) {
            throw "invalid matrix size";
          }
          if (16 === g.length) return q(g, "HEAPF32", Fa);
          r.fill(0);
          r[0] = g[0];
          r[1] = g[1];
          r[3] = g[2];
          r[4] = g[3];
          r[5] = g[4];
          r[7] = g[5];
          r[12] = g[6];
          r[13] = g[7];
          r[15] = g[8];
          6 === g.length && ((r[12] = 0), (r[13] = 0), (r[15] = 1));
          return Fa;
        }
        r[0] = g.m11;
        r[1] = g.m21;
        r[2] = g.m31;
        r[3] = g.m41;
        r[4] = g.m12;
        r[5] = g.m22;
        r[6] = g.m32;
        r[7] = g.m42;
        r[8] = g.m13;
        r[9] = g.m23;
        r[10] = g.m33;
        r[11] = g.m43;
        r[12] = g.m14;
        r[13] = g.m24;
        r[14] = g.m34;
        r[15] = g.m44;
        return Fa;
      }
      function N(g) {
        for (var r = Array(16), A = 0; 16 > A; A++) {
          r[A] = a.HEAPF32[g / 4 + A];
        }
        return r;
      }
      function Q(g, r) {
        return q(g, "HEAPF32", r || jb);
      }
      function z(g, r, A, D) {
        var M = hc.toTypedArray();
        M[0] = g;
        M[1] = r;
        M[2] = A;
        M[3] = D;
        return jb;
      }
      function R(g) {
        for (var r = new Float32Array(4), A = 0; 4 > A; A++) {
          r[A] = a.HEAPF32[g / 4 + A];
        }
        return r;
      }
      function T(g, r) {
        return q(g, "HEAPF32", r || Na);
      }
      function da(g, r) {
        return q(g, "HEAPF32", r || ic);
      }
      function ua(g, r) {
        if (kb) {
          require("fs").writeFile(r, new Buffer(g), function (D) {
            if (D) throw D;
          });
        } else {
          url = window.URL.createObjectURL(
            new Blob([g], { type: "application/octet-stream" }),
          );
          var A = document.createElement("a");
          document.body.appendChild(A);
          A.href = url;
          A.download = r;
          A.click();
          setTimeout(function () {
            URL.revokeObjectURL(url);
            A.remove();
          }, 50);
        }
      }
      function U(g, r) {
        r && !r._ck && a._free(g);
      }
      a.Color = function (g, r, A, D) {
        void 0 === D && (D = 1);
        return a.Color4f(b(g) / 255, b(r) / 255, b(A) / 255, D);
      };
      a.ColorAsInt = function (g, r, A, D) {
        void 0 === D && (D = 255);
        return (
          ((b(D) << 24) |
            (b(g) << 16) |
            (b(r) << 8) |
            ((b(A) << 0) & 268435455)) >>>
          0
        );
      };
      a.Color4f = function (g, r, A, D) {
        void 0 === D && (D = 1);
        return Float32Array.of(g, r, A, D);
      };
      Object.defineProperty(a, "TRANSPARENT", {
        get: function () {
          return a.Color4f(0, 0, 0, 0);
        },
      });
      Object.defineProperty(a, "BLACK", {
        get: function () {
          return a.Color4f(0, 0, 0, 1);
        },
      });
      Object.defineProperty(a, "WHITE", {
        get: function () {
          return a.Color4f(1, 1, 1, 1);
        },
      });
      Object.defineProperty(a, "RED", {
        get: function () {
          return a.Color4f(1, 0, 0, 1);
        },
      });
      Object.defineProperty(a, "GREEN", {
        get: function () {
          return a.Color4f(0, 1, 0, 1);
        },
      });
      Object.defineProperty(a, "BLUE", {
        get: function () {
          return a.Color4f(0, 0, 1, 1);
        },
      });
      Object.defineProperty(a, "YELLOW", {
        get: function () {
          return a.Color4f(1, 1, 0, 1);
        },
      });
      Object.defineProperty(a, "CYAN", {
        get: function () {
          return a.Color4f(0, 1, 1, 1);
        },
      });
      Object.defineProperty(a, "MAGENTA", {
        get: function () {
          return a.Color4f(1, 0, 1, 1);
        },
      });
      a.getColorComponents = function (g) {
        return [
          Math.floor(255 * g[0]),
          Math.floor(255 * g[1]),
          Math.floor(255 * g[2]),
          g[3],
        ];
      };
      a.parseColorString = function (g, r) {
        g = g.toLowerCase();
        if (g.startsWith("#")) {
          r = 255;
          switch (g.length) {
            case 9:
              r = parseInt(g.slice(7, 9), 16);
            case 7:
              var A = parseInt(g.slice(1, 3), 16);
              var D = parseInt(g.slice(3, 5), 16);
              var M = parseInt(g.slice(5, 7), 16);
              break;
            case 5:
              r = 17 * parseInt(g.slice(4, 5), 16);
            case 4:
              (A = 17 * parseInt(g.slice(1, 2), 16)),
                (D = 17 * parseInt(g.slice(2, 3), 16)),
                (M = 17 * parseInt(g.slice(3, 4), 16));
          }
          return a.Color(A, D, M, r / 255);
        }
        return g.startsWith("rgba")
          ? ((g = g.slice(5, -1)),
            (g = g.split(",")),
            a.Color(+g[0], +g[1], +g[2], m(g[3])))
          : g.startsWith("rgb")
          ? ((g = g.slice(4, -1)),
            (g = g.split(",")),
            a.Color(+g[0], +g[1], +g[2], m(g[3])))
          : g.startsWith("gray(") ||
              g.startsWith("hsl") ||
              !r ||
              ((g = r[g]), void 0 === g)
          ? a.BLACK
          : g;
      };
      a.multiplyByAlpha = function (g, r) {
        g = g.slice();
        g[3] = Math.max(0, Math.min(g[3] * r, 1));
        return g;
      };
      var kb = !(function () {
          try {
            return this === window;
          } catch (e) {
            return false;
          }
        })(),
        Cb = Float32Array.of(0, 0, 1),
        ib = 0,
        ec,
        Fa = 0,
        fc,
        jb = 0,
        hc,
        Wa,
        Na = 0,
        Mc,
        Nc = 0,
        Oc,
        jc = 0,
        Pc,
        ic = 0,
        Qc,
        Rc = 0,
        kc = {};
      a.kg = function () {
        this.eg = [];
        this.Mf = null;
        Object.defineProperty(this, "length", {
          enumerable: !0,
          get: function () {
            return this.eg.length / 4;
          },
        });
      };
      a.kg.prototype.push = function (g, r, A, D) {
        this.Mf || this.eg.push(g, r, A, D);
      };
      a.kg.prototype.set = function (g, r, A, D, M) {
        0 > g ||
          g >= this.eg.length / 4 ||
          ((g *= 4),
            this.Mf
              ? ((g = this.Mf / 4 + g),
                (a.HEAPF32[g] = r),
                (a.HEAPF32[g + 1] = A),
                (a.HEAPF32[g + 2] = D),
                (a.HEAPF32[g + 3] = M))
              : ((this.eg[g] = r),
                (this.eg[g + 1] = A),
                (this.eg[g + 2] = D),
                (this.eg[g + 3] = M)));
      };
      a.kg.prototype.build = function () {
        return this.Mf ? this.Mf : (this.Mf = q(this.eg, "HEAPF32"));
      };
      a.kg.prototype.delete = function () {
        this.Mf && (a._free(this.Mf), (this.Mf = null));
      };
      a.Bg = function () {
        this.Hg = [];
        this.Mf = null;
        Object.defineProperty(this, "length", {
          enumerable: !0,
          get: function () {
            return this.Hg.length;
          },
        });
      };
      a.Bg.prototype.push = function (g) {
        this.Mf || this.Hg.push(g);
      };
      a.Bg.prototype.set = function (g, r) {
        0 > g ||
          g >= this.Hg.length ||
          ((g *= 4),
            this.Mf ? (a.HEAPU32[this.Mf / 4 + g] = r) : (this.Hg[g] = r));
      };
      a.Bg.prototype.build = function () {
        return this.Mf ? this.Mf : (this.Mf = q(this.Hg, "HEAPU32"));
      };
      a.Bg.prototype.delete = function () {
        this.Mf && (a._free(this.Mf), (this.Mf = null));
      };
      a.SkRectBuilder = a.kg;
      a.RSXFormBuilder = a.kg;
      a.SkColorBuilder = a.Bg;
      a.Malloc = function (g, r) {
        var A = a._malloc(r * g.BYTES_PER_ELEMENT);
        return {
          _ck: !0,
          length: r,
          byteOffset: A,
          jg: null,
          subarray: function (D, M) {
            D = this.toTypedArray().subarray(D, M);
            D._ck = !0;
            return D;
          },
          toTypedArray: function () {
            if (this.jg && this.jg.length) return this.jg;
            this.jg = new g(a.HEAPU8.buffer, A, r);
            this.jg._ck = !0;
            return this.jg;
          },
        };
      };
      a.Free = function (g) {
        a._free(g.byteOffset);
        g.byteOffset = 0;
        g.toTypedArray = null;
        g.jg = null;
      };
      a.onRuntimeInitialized = function () {
        function g(e, l, t, w, C) {
          for (var p = 0; p < e.length; p++) {
            l[p * t + ((p * C + w + t) % t)] = e[p];
          }
          return l;
        }
        function r(e) {
          for (var l = e * e, t = Array(l); l--;) {
            t[l] = 0 == l % (e + 1) ? 1 : 0;
          }
          return t;
        }
        function A() {
          for (var e = 0, l = 0; l < arguments.length - 1; l += 2) {
            e += arguments[l] * arguments[l + 1];
          }
          return e;
        }
        function D(e, l, t) {
          for (var w = Array(e.length), C = 0; C < t; C++) {
            for (var p = 0; p < t; p++) {
              for (var F = 0, L = 0; L < t; L++) {
                F += e[t * C + L] * l[t * L + p];
              }
              w[C * t + p] = F;
            }
          }
          return w;
        }
        function M(e, l) {
          for (var t = D(l[0], l[1], e), w = 2; w < l.length;) {
            (t = D(t, l[w], e)), w++;
          }
          return t;
        }
        hc = a.Malloc(Float32Array, 4);
        jb = hc.byteOffset;
        fc = a.Malloc(Float32Array, 16);
        Fa = fc.byteOffset;
        ec = a.Malloc(Float32Array, 9);
        ib = ec.byteOffset;
        Pc = a.Malloc(Float32Array, 12);
        ic = Pc.byteOffset;
        Qc = a.Malloc(Float32Array, 12);
        Rc = Qc.byteOffset;
        Wa = a.Malloc(Float32Array, 4);
        Na = Wa.byteOffset;
        Mc = a.Malloc(Float32Array, 4);
        Nc = Mc.byteOffset;
        Oc = a.Malloc(Int32Array, 4);
        jc = Oc.byteOffset;
        a.SkColorSpace.SRGB = a.SkColorSpace._MakeSRGB();
        a.SkColorSpace.DISPLAY_P3 = a.SkColorSpace._MakeDisplayP3();
        a.SkColorSpace.ADOBE_RGB = a.SkColorSpace._MakeAdobeRGB();
        a.SkMatrix = {};
        a.SkMatrix.identity = function () {
          return r(3);
        };
        a.SkMatrix.invert = function (e) {
          var l = e[0] * e[4] * e[8] +
            e[1] * e[5] * e[6] +
            e[2] * e[3] * e[7] -
            e[2] * e[4] * e[6] -
            e[1] * e[3] * e[8] -
            e[0] * e[5] * e[7];
          return l
            ? [
              (e[4] * e[8] - e[5] * e[7]) / l,
              (e[2] * e[7] - e[1] * e[8]) / l,
              (e[1] * e[5] - e[2] * e[4]) / l,
              (e[5] * e[6] - e[3] * e[8]) / l,
              (e[0] * e[8] - e[2] * e[6]) / l,
              (e[2] * e[3] - e[0] * e[5]) / l,
              (e[3] * e[7] - e[4] * e[6]) / l,
              (e[1] * e[6] - e[0] * e[7]) / l,
              (e[0] * e[4] - e[1] * e[3]) / l,
            ]
            : null;
        };
        a.SkMatrix.mapPoints = function (e, l) {
          for (var t = 0; t < l.length; t += 2) {
            var w = l[t],
              C = l[t + 1],
              p = e[6] * w + e[7] * C + e[8],
              F = e[3] * w + e[4] * C + e[5];
            l[t] = (e[0] * w + e[1] * C + e[2]) / p;
            l[t + 1] = F / p;
          }
          return l;
        };
        a.SkMatrix.multiply = function () {
          return M(3, arguments);
        };
        a.SkMatrix.rotated = function (e, l, t) {
          l = l || 0;
          t = t || 0;
          var w = Math.sin(e);
          e = Math.cos(e);
          return [e, -w, A(w, t, 1 - e, l), w, e, A(-w, l, 1 - e, t), 0, 0, 1];
        };
        a.SkMatrix.scaled = function (e, l, t, w) {
          t = t || 0;
          w = w || 0;
          var C = g([e, l], r(3), 3, 0, 1);
          return g([t - e * t, w - l * w], C, 3, 2, 0);
        };
        a.SkMatrix.skewed = function (e, l, t, w) {
          t = t || 0;
          w = w || 0;
          var C = g([e, l], r(3), 3, 1, -1);
          return g([-e * t, -l * w], C, 3, 2, 0);
        };
        a.SkMatrix.translated = function (e, l) {
          return g(arguments, r(3), 3, 2, 0);
        };
        a.SkVector = {};
        a.SkVector.dot = function (e, l) {
          return e
            .map(function (t, w) {
              return t * l[w];
            })
            .reduce(function (t, w) {
              return t + w;
            });
        };
        a.SkVector.lengthSquared = function (e) {
          return a.SkVector.dot(e, e);
        };
        a.SkVector.length = function (e) {
          return Math.sqrt(a.SkVector.lengthSquared(e));
        };
        a.SkVector.mulScalar = function (e, l) {
          return e.map(function (t) {
            return t * l;
          });
        };
        a.SkVector.add = function (e, l) {
          return e.map(function (t, w) {
            return t + l[w];
          });
        };
        a.SkVector.sub = function (e, l) {
          return e.map(function (t, w) {
            return t - l[w];
          });
        };
        a.SkVector.dist = function (e, l) {
          return a.SkVector.length(a.SkVector.sub(e, l));
        };
        a.SkVector.normalize = function (e) {
          return a.SkVector.mulScalar(e, 1 / a.SkVector.length(e));
        };
        a.SkVector.cross = function (e, l) {
          return [
            e[1] * l[2] - e[2] * l[1],
            e[2] * l[0] - e[0] * l[2],
            e[0] * l[1] - e[1] * l[0],
          ];
        };
        a.SkM44 = {};
        a.SkM44.identity = function () {
          return r(4);
        };
        a.SkM44.translated = function (e) {
          return g(e, r(4), 4, 3, 0);
        };
        a.SkM44.scaled = function (e) {
          return g(e, r(4), 4, 0, 1);
        };
        a.SkM44.rotated = function (e, l) {
          return a.SkM44.rotatedUnitSinCos(
            a.SkVector.normalize(e),
            Math.sin(l),
            Math.cos(l),
          );
        };
        a.SkM44.rotatedUnitSinCos = function (e, l, t) {
          var w = e[0],
            C = e[1];
          e = e[2];
          var p = 1 - t;
          return [
            p * w * w + t,
            p * w * C - l * e,
            p * w * e + l * C,
            0,
            p * w * C + l * e,
            p * C * C + t,
            p * C * e - l * w,
            0,
            p * w * e - l * C,
            p * C * e + l * w,
            p * e * e + t,
            0,
            0,
            0,
            0,
            1,
          ];
        };
        a.SkM44.lookat = function (e, l, t) {
          l = a.SkVector.normalize(a.SkVector.sub(l, e));
          t = a.SkVector.normalize(t);
          t = a.SkVector.normalize(a.SkVector.cross(l, t));
          var w = a.SkM44.identity();
          g(t, w, 4, 0, 0);
          g(a.SkVector.cross(t, l), w, 4, 1, 0);
          g(a.SkVector.mulScalar(l, -1), w, 4, 2, 0);
          g(e, w, 4, 3, 0);
          e = a.SkM44.invert(w);
          return null === e ? a.SkM44.identity() : e;
        };
        a.SkM44.perspective = function (e, l, t) {
          var w = 1 / (l - e);
          t /= 2;
          t = Math.cos(t) / Math.sin(t);
          return [
            t,
            0,
            0,
            0,
            0,
            t,
            0,
            0,
            0,
            0,
            (l + e) * w,
            2 * l * e * w,
            0,
            0,
            -1,
            1,
          ];
        };
        a.SkM44.rc = function (e, l, t) {
          return e[4 * l + t];
        };
        a.SkM44.multiply = function () {
          return M(4, arguments);
        };
        a.SkM44.invert = function (e) {
          var l = e[0],
            t = e[4],
            w = e[8],
            C = e[12],
            p = e[1],
            F = e[5],
            L = e[9],
            P = e[13],
            V = e[2],
            aa = e[6],
            ma = e[10],
            oa = e[14],
            J = e[3],
            k = e[7],
            n = e[11];
          e = e[15];
          var x = l * F - t * p,
            B = l * L - w * p,
            G = l * P - C * p,
            H = t * L - w * F,
            O = t * P - C * F,
            Z = w * P - C * L,
            ia = V * k - aa * J,
            pa = V * n - ma * J,
            qa = V * e - oa * J,
            Xa = aa * n - ma * k,
            Ya = aa * e - oa * k,
            Za = ma * e - oa * n,
            Sc = x * Za - B * Ya + G * Xa + H * qa - O * pa + Z * ia,
            ra = 1 / Sc;
          if (0 === Sc || Infinity === ra) return null;
          x *= ra;
          B *= ra;
          G *= ra;
          H *= ra;
          O *= ra;
          Z *= ra;
          ia *= ra;
          pa *= ra;
          qa *= ra;
          Xa *= ra;
          Ya *= ra;
          Za *= ra;
          l = [
            F * Za - L * Ya + P * Xa,
            L * qa - p * Za - P * pa,
            p * Ya - F * qa + P * ia,
            F * pa - p * Xa - L * ia,
            w * Ya - t * Za - C * Xa,
            l * Za - w * qa + C * pa,
            t * qa - l * Ya - C * ia,
            l * Xa - t * pa + w * ia,
            k * Z - n * O + e * H,
            n * G - J * Z - e * B,
            J * O - k * G + e * x,
            k * B - J * H - n * x,
            ma * O - aa * Z - oa * H,
            V * Z - ma * G + oa * B,
            aa * G - V * O - oa * x,
            V * H - aa * B + ma * x,
          ];
          return l.every(function (Tc) {
              return Infinity !== Tc && -Infinity !== Tc;
            })
            ? l
            : null;
        };
        a.SkM44.transpose = function (e) {
          return [
            e[0],
            e[4],
            e[8],
            e[12],
            e[1],
            e[5],
            e[9],
            e[13],
            e[2],
            e[6],
            e[10],
            e[14],
            e[3],
            e[7],
            e[11],
            e[15],
          ];
        };
        a.SkM44.mustInvert = function (e) {
          e = a.SkM44.invert(e);
          if (null === e) throw "Matrix not invertible";
          return e;
        };
        a.SkM44.setupCamera = function (e, l, t) {
          var w = a.SkM44.lookat(t.eye, t.coa, t.up);
          t = a.SkM44.perspective(t.near, t.far, t.angle);
          l = [(e[2] - e[0]) / 2, (e[3] - e[1]) / 2, l];
          e = a.SkM44.multiply(
            a.SkM44.translated([(e[0] + e[2]) / 2, (e[1] + e[3]) / 2, 0]),
            a.SkM44.scaled(l),
          );
          return a.SkM44.multiply(e, t, w, a.SkM44.mustInvert(e));
        };
        a.SkColorMatrix = {};
        a.SkColorMatrix.identity = function () {
          var e = new Float32Array(20);
          e[0] = 1;
          e[6] = 1;
          e[12] = 1;
          e[18] = 1;
          return e;
        };
        a.SkColorMatrix.scaled = function (e, l, t, w) {
          var C = new Float32Array(20);
          C[0] = e;
          C[6] = l;
          C[12] = t;
          C[18] = w;
          return C;
        };
        var ca = [
          [6, 7, 11, 12],
          [0, 10, 2, 12],
          [0, 1, 5, 6],
        ];
        a.SkColorMatrix.rotated = function (e, l, t) {
          var w = a.SkColorMatrix.identity();
          e = ca[e];
          w[e[0]] = t;
          w[e[1]] = l;
          w[e[2]] = -l;
          w[e[3]] = t;
          return w;
        };
        a.SkColorMatrix.postTranslate = function (e, l, t, w, C) {
          e[4] += l;
          e[9] += t;
          e[14] += w;
          e[19] += C;
          return e;
        };
        a.SkColorMatrix.concat = function (e, l) {
          for (var t = new Float32Array(20), w = 0, C = 0; 20 > C; C += 5) {
            for (var p = 0; 4 > p; p++) {
              t[w++] = e[C] * l[p] +
                e[C + 1] * l[p + 5] +
                e[C + 2] * l[p + 10] +
                e[C + 3] * l[p + 15];
            }
            t[w++] = e[C] * l[4] +
              e[C + 1] * l[9] +
              e[C + 2] * l[14] +
              e[C + 3] * l[19] +
              e[C + 4];
          }
          return t;
        };
        a.SkPath.MakeFromCmds = function (e) {
          for (var l = 0, t = 0; t < e.length; t++) l += e[t].length;
          if (kc[l]) var w = kc[l];
          else (w = new Float32Array(l)), (kc[l] = w);
          var C = 0;
          for (t = 0; t < e.length; t++) {
            for (var p = 0; p < e[t].length; p++) {
              (w[C] = e[t][p]), C++;
            }
          }
          e = [q(w, "HEAPF32"), l];
          l = a.SkPath._MakeFromCmds(e[0], e[1]);
          a._free(e[0]);
          return l;
        };
        a.MakePathFromCmds = a.SkPath.MakeFromCmds;
        a.SkPath.MakeFromVerbsPointsWeights = function (e, l, t) {
          var w = q(e, "HEAPU8"),
            C = q(l, "HEAPF32"),
            p = q(t, "HEAPF32"),
            F = a.SkPath._MakeFromVerbsPointsWeights(
              w,
              e.length,
              C,
              l.length,
              p,
              (t && t.length) || 0,
            );
          U(w, e);
          U(C, l);
          U(p, t);
          return F;
        };
        a.SkPath.prototype.addArc = function (e, l, t) {
          e = T(e);
          this._addArc(e, l, t);
          return this;
        };
        a.SkPath.prototype.addOval = function (e, l, t) {
          void 0 === t && (t = 1);
          e = T(e);
          this._addOval(e, !!l, t);
          return this;
        };
        a.SkPath.prototype.addPath = function () {
          var e = Array.prototype.slice.call(arguments),
            l = e[0],
            t = !1;
          "boolean" === typeof e[e.length - 1] && (t = e.pop());
          if (1 === e.length) {
            this._addPath(l, 1, 0, 0, 0, 1, 0, 0, 0, 1, t);
          } else if (2 === e.length) {
            (e = e[1]),
              this._addPath(
                l,
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5],
                e[6] || 0,
                e[7] || 0,
                e[8] || 1,
                t,
              );
          } else if (7 === e.length || 10 === e.length) {
            this._addPath(
              l,
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7] || 0,
              e[8] || 0,
              e[9] || 1,
              t,
            );
          } else return null;
          return this;
        };
        a.SkPath.prototype.addPoly = function (e, l) {
          if (e._ck) {
            var t = e.byteOffset;
            var w = e.length / 2;
          } else (t = u(e, "HEAPF32")), (w = e.length);
          this._addPoly(t, w, l);
          U(t, e);
          return this;
        };
        a.SkPath.prototype.addRect = function (e, l) {
          e = T(e);
          this._addRect(e, !!l);
          return this;
        };
        a.SkPath.prototype.addRRect = function (e, l) {
          e = da(e);
          this._addRRect(e, !!l);
          return this;
        };
        a.SkPath.prototype.addVerbsPointsWeights = function (e, l, t) {
          var w = q(e, "HEAPU8"),
            C = q(l, "HEAPF32"),
            p = q(t, "HEAPF32");
          this._addVerbsPointsWeights(
            w,
            e.length,
            C,
            l.length,
            p,
            (t && t.length) || 0,
          );
          U(w, e);
          U(C, l);
          U(p, t);
        };
        a.SkPath.prototype.arc = function (e, l, t, w, C, p) {
          e = a.LTRBRect(e - t, l - t, e + t, l + t);
          C = ((C - w) / Math.PI) * 180 - 360 * !!p;
          p = new a.SkPath();
          p.addArc(e, (w / Math.PI) * 180, C);
          this.addPath(p, !0);
          p.delete();
          return this;
        };
        a.SkPath.prototype.arcToOval = function (e, l, t, w) {
          e = T(e);
          this._arcToOval(e, l, t, w);
          return this;
        };
        a.SkPath.prototype.arcToRotated = function (e, l, t, w, C, p, F) {
          this._arcToRotated(e, l, t, !!w, !!C, p, F);
          return this;
        };
        a.SkPath.prototype.arcToTangent = function (e, l, t, w, C) {
          this._arcToTangent(e, l, t, w, C);
          return this;
        };
        a.SkPath.prototype.close = function () {
          this._close();
          return this;
        };
        a.SkPath.prototype.conicTo = function (e, l, t, w, C) {
          this._conicTo(e, l, t, w, C);
          return this;
        };
        a.SkPath.prototype.computeTightBounds = function (e) {
          this._computeTightBounds(Na);
          var l = Wa.toTypedArray();
          return e ? (e.set(l), e) : l.slice();
        };
        a.SkPath.prototype.cubicTo = function (e, l, t, w, C, p) {
          this._cubicTo(e, l, t, w, C, p);
          return this;
        };
        a.SkPath.prototype.dash = function (e, l, t) {
          return this._dash(e, l, t) ? this : null;
        };
        a.SkPath.prototype.getBounds = function (e) {
          this._getBounds(Na);
          var l = Wa.toTypedArray();
          return e ? (e.set(l), e) : l.slice();
        };
        a.SkPath.prototype.lineTo = function (e, l) {
          this._lineTo(e, l);
          return this;
        };
        a.SkPath.prototype.moveTo = function (e, l) {
          this._moveTo(e, l);
          return this;
        };
        a.SkPath.prototype.offset = function (e, l) {
          this._transform(1, 0, e, 0, 1, l, 0, 0, 1);
          return this;
        };
        a.SkPath.prototype.quadTo = function (e, l, t, w) {
          this._quadTo(e, l, t, w);
          return this;
        };
        a.SkPath.prototype.rArcTo = function (e, l, t, w, C, p, F) {
          this._rArcTo(e, l, t, w, C, p, F);
          return this;
        };
        a.SkPath.prototype.rConicTo = function (e, l, t, w, C) {
          this._rConicTo(e, l, t, w, C);
          return this;
        };
        a.SkPath.prototype.rCubicTo = function (e, l, t, w, C, p) {
          this._rCubicTo(e, l, t, w, C, p);
          return this;
        };
        a.SkPath.prototype.rLineTo = function (e, l) {
          this._rLineTo(e, l);
          return this;
        };
        a.SkPath.prototype.rMoveTo = function (e, l) {
          this._rMoveTo(e, l);
          return this;
        };
        a.SkPath.prototype.rQuadTo = function (e, l, t, w) {
          this._rQuadTo(e, l, t, w);
          return this;
        };
        a.SkPath.prototype.stroke = function (e) {
          e = e || {};
          e.width = e.width || 1;
          e.miter_limit = e.miter_limit || 4;
          e.cap = e.cap || a.StrokeCap.Butt;
          e.join = e.join || a.StrokeJoin.Miter;
          e.precision = e.precision || 1;
          return this._stroke(e) ? this : null;
        };
        a.SkPath.prototype.transform = function () {
          if (1 === arguments.length) {
            var e = arguments[0];
            this._transform(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6] || 0,
              e[7] || 0,
              e[8] || 1,
            );
          } else if (6 === arguments.length || 9 === arguments.length) {
            (e = arguments),
              this._transform(
                e[0],
                e[1],
                e[2],
                e[3],
                e[4],
                e[5],
                e[6] || 0,
                e[7] || 0,
                e[8] || 1,
              );
          } else {
            throw (
              "transform expected to take 1 or 9 arguments. Got " +
              arguments.length
            );
          }
          return this;
        };
        a.SkPath.prototype.trim = function (e, l, t) {
          return this._trim(e, l, !!t) ? this : null;
        };
        a.SkImage.prototype.encodeToData = function () {
          if (!arguments.length) return this._encodeToData();
          if (2 === arguments.length) {
            var e = arguments;
            return this._encodeToDataWithFormat(e[0], e[1]);
          }
          throw (
            "encodeToData expected to take 0 or 2 arguments. Got " +
            arguments.length
          );
        };
        a.SkImage.prototype.makeShader = function (e, l, t) {
          t = E(t);
          return this._makeShader(e, l, t);
        };
        a.SkImage.prototype.readPixels = function (e, l, t) {
          switch (e.colorType) {
            case a.ColorType.RGBA_8888:
              var w = 4 * e.width;
              break;
            case a.ColorType.RGBA_F32:
              w = 16 * e.width;
              break;
            default:
              return;
          }
          var C = w * e.height,
            p = a._malloc(C);
          if (!this._readPixels(e, p, w, l, t)) return null;
          l = null;
          switch (e.colorType) {
            case a.ColorType.RGBA_8888:
              l = new Uint8Array(a.HEAPU8.buffer, p, C).slice();
              break;
            case a.ColorType.RGBA_F32:
              l = new Float32Array(a.HEAPU8.buffer, p, C).slice();
          }
          a._free(p);
          return l;
        };
        a.SkCanvas.prototype.clear = function (e) {
          e = Q(e);
          this._clear(e);
        };
        a.SkCanvas.prototype.clipRRect = function (e, l, t) {
          e = da(e);
          this._clipRRect(e, l, t);
        };
        a.SkCanvas.prototype.clipRect = function (e, l, t) {
          e = T(e);
          this._clipRect(e, l, t);
        };
        a.SkCanvas.prototype.concat = function (e) {
          e = I(e);
          this._concat(e);
        };
        a.SkCanvas.prototype.concat44 = a.SkCanvas.prototype.concat;
        a.SkCanvas.prototype.drawArc = function (e, l, t, w, C) {
          e = T(e);
          this._drawArc(e, l, t, w, C);
        };
        a.SkCanvas.prototype.drawAtlas = function (e, l, t, w, C, p) {
          if (e && w && l && t && l.length === t.length) {
            C || (C = a.BlendMode.SrcOver);
            var F;
            l.build ? (F = l.build()) : (F = q(l, "HEAPF32"));
            if (t.build) {
              var L = t.build();
              var P = t.length;
            } else (L = q(t, "HEAPF32")), (P = t.length / 4);
            var V = 0;
            p && (p.build ? (V = p.build()) : (V = q(h(p), "HEAPU32")));
            this._drawAtlas(e, L, F, V, P, C, w);
            F && !l.build && U(F, l);
            L && !t.build && U(L, t);
            V && !p.build && U(V, p);
          }
        };
        a.SkCanvas.prototype.drawColor = function (e, l) {
          e = Q(e);
          void 0 !== l ? this._drawColor(e, l) : this._drawColor(e);
        };
        a.SkCanvas.prototype.drawColorComponents = function (e, l, t, w, C) {
          e = z(e, l, t, w);
          void 0 !== C ? this._drawColor(e, C) : this._drawColor(e);
        };
        a.SkCanvas.prototype.drawDRRect = function (e, l, t) {
          e = da(e, ic);
          l = da(l, Rc);
          this._drawDRRect(e, l, t);
        };
        a.SkCanvas.prototype.drawImageNine = function (e, l, t, w) {
          l = q(l, "HEAP32", jc);
          t = T(t);
          this._drawImageNine(e, l, t, w);
        };
        a.SkCanvas.prototype.drawImageRect = function (e, l, t, w, C) {
          l = T(l, Na);
          t = T(t, Nc);
          this._drawImageRect(e, l, t, w, !!C);
        };
        a.SkCanvas.prototype.drawOval = function (e, l) {
          e = T(e);
          this._drawOval(e, l);
        };
        a.SkCanvas.prototype.drawPoints = function (e, l, t) {
          if (l._ck) {
            var w = l.byteOffset;
            var C = l.length / 2;
          } else (w = u(l, "HEAPF32")), (C = l.length);
          this._drawPoints(e, w, C, t);
          U(w, l);
        };
        a.SkCanvas.prototype.drawRRect = function (e, l) {
          e = da(e);
          this._drawRRect(e, l);
        };
        a.SkCanvas.prototype.drawRect = function (e, l) {
          e = T(e);
          this._drawRect(e, l);
        };
        a.SkCanvas.prototype.drawShadow = function (e, l, t, w, C, p, F) {
          var L = q(C, "HEAPF32"),
            P = q(p, "HEAPF32");
          this._drawShadow(e, l, t, w, L, P, F);
          U(L, C);
          U(P, p);
        };
        a.SkCanvas.prototype.getLocalToDevice = function () {
          this._getLocalToDevice(Fa);
          return N(Fa);
        };
        a.SkCanvas.prototype.findMarkedCTM = function (e) {
          return this._findMarkedCTM(e, Fa) ? N(Fa) : null;
        };
        a.SkCanvas.prototype.getTotalMatrix = function () {
          this._getTotalMatrix(ib);
          for (var e = Array(9), l = 0; 9 > l; l++) {
            e[l] = a.HEAPF32[ib / 4 + l];
          }
          return e;
        };
        a.SkCanvas.prototype.readPixels = function (e, l, t, w, C, p, F, L) {
          C = C || a.AlphaType.Unpremul;
          p = p || a.ColorType.RGBA_8888;
          F = F || a.SkColorSpace.SRGB;
          var P = 4;
          p === a.ColorType.RGBA_F16 && (P = 8);
          L = L || P * t;
          var V = w * L;
          P = a._malloc(V);
          if (
            !this._readPixels(
              {
                width: t,
                height: w,
                colorType: p,
                alphaType: C,
                colorSpace: F,
              },
              P,
              L,
              e,
              l,
            )
          ) {
            return a._free(P), null;
          }
          e = new Uint8Array(a.HEAPU8.buffer, P, V).slice();
          a._free(P);
          return e;
        };
        a.SkCanvas.prototype.saveLayer = function (e, l, t, w) {
          l = T(l);
          return this._saveLayer(e || null, l, t || null, w || 0);
        };
        a.SkCanvas.prototype.writePixels = function (e, l, t, w, C, p, F, L) {
          if (e.byteLength % (l * t)) {
            throw "pixels length must be a multiple of the srcWidth * srcHeight";
          }
          var P = e.byteLength / (l * t);
          p = p || a.AlphaType.Unpremul;
          F = F || a.ColorType.RGBA_8888;
          L = L || a.SkColorSpace.SRGB;
          var V = P * l;
          P = q(e, "HEAPU8");
          l = this._writePixels(
            {
              width: l,
              height: t,
              colorType: F,
              alphaType: p,
              colorSpace: L,
            },
            P,
            V,
            w,
            C,
          );
          U(P, e);
          return l;
        };
        a.SkColorFilter.MakeBlend = function (e, l) {
          e = Q(e);
          return a.SkColorFilter._MakeBlend(e, l);
        };
        a.SkColorFilter.MakeMatrix = function (e) {
          if (!e || 20 !== e.length) throw "invalid color matrix";
          var l = q(e, "HEAPF32"),
            t = a.SkColorFilter._makeMatrix(l);
          U(l, e);
          return t;
        };
        a.SkImageFilter.MakeMatrixTransform = function (e, l, t) {
          e = E(e);
          return a.SkImageFilter._MakeMatrixTransform(e, l, t);
        };
        a.SkPaint.prototype.getColor = function () {
          this._getColor(jb);
          return R(jb);
        };
        a.SkPaint.prototype.setColor = function (e, l) {
          l = l || null;
          e = Q(e);
          this._setColor(e, l);
        };
        a.SkPaint.prototype.setColorComponents = function (e, l, t, w, C) {
          C = C || null;
          e = z(e, l, t, w);
          this._setColor(e, C);
        };
        a.SkPictureRecorder.prototype.beginRecording = function (e) {
          e = T(e);
          return this._beginRecording(e);
        };
        a.SkSurface.prototype.captureFrameAsSkPicture = function (e) {
          var l = new a.SkPictureRecorder(),
            t = l.beginRecording(a.LTRBRect(0, 0, this.width(), this.height()));
          e(t);
          e = l.finishRecordingAsPicture();
          l.delete();
          return e;
        };
        a.SkSurface.prototype.makeImageSnapshot = function (e) {
          e = q(e, "HEAP32", jc);
          return this._makeImageSnapshot(e);
        };
        a.SkSurface.prototype.requestAnimationFrame = function (e, l) {
          this.Cg || (this.Cg = this.getCanvas());
          requestAnimationFrame(
            function () {
              void 0 !== this.fg && a.setCurrentContext(this.fg);
              e(this.Cg);
              this.flush(l);
            }.bind(this),
          );
        };
        a.SkSurface.prototype.drawOnce = function (e, l) {
          this.Cg || (this.Cg = this.getCanvas());
          requestAnimationFrame(
            function () {
              void 0 !== this.fg && a.setCurrentContext(this.fg);
              e(this.Cg);
              this.flush(l);
              this.dispose();
            }.bind(this),
          );
        };
        a.SkPathEffect.MakeDash = function (e, l) {
          l || (l = 0);
          if (!e.length || 1 === e.length % 2) {
            throw "Intervals array must have even length";
          }
          var t = q(e, "HEAPF32");
          l = a.SkPathEffect._MakeDash(t, e.length, l);
          U(t, e);
          return l;
        };
        a.SkShader.Color = function (e, l) {
          l = l || null;
          e = Q(e);
          return a.SkShader._Color(e, l);
        };
        a.SkShader.MakeLinearGradient = function (e, l, t, w, C, p, F, L) {
          L = L || null;
          var P = y(t),
            V = q(w, "HEAPF32");
          F = F || 0;
          p = E(p);
          e = a._MakeLinearGradientShader(
            e,
            l,
            P.Vf,
            P.Ig,
            V,
            P.count,
            C,
            F,
            p,
            L,
          );
          U(P.Vf, t);
          w && U(V, w);
          return e;
        };
        a.SkShader.MakeRadialGradient = function (e, l, t, w, C, p, F, L) {
          L = L || null;
          var P = y(t),
            V = q(w, "HEAPF32");
          F = F || 0;
          p = E(p);
          e = a._MakeRadialGradientShader(
            e,
            l,
            P.Vf,
            P.Ig,
            V,
            P.count,
            C,
            F,
            p,
            L,
          );
          U(P.Vf, t);
          w && U(V, w);
          return e;
        };
        a.SkShader.MakeSweepGradient = function (e, l, t, w, C, p, F, L, P, V) {
          V = V || null;
          var aa = y(t),
            ma = q(w, "HEAPF32");
          F = F || 0;
          L = L || 0;
          P = P || 360;
          p = E(p);
          e = a._MakeSweepGradientShader(
            e,
            l,
            aa.Vf,
            aa.Ig,
            ma,
            aa.count,
            C,
            L,
            P,
            F,
            p,
            V,
          );
          U(aa.Vf, t);
          w && U(ma, w);
          return e;
        };
        a.SkShader.MakeTwoPointConicalGradient = function (
          e,
          l,
          t,
          w,
          C,
          p,
          F,
          L,
          P,
          V,
        ) {
          V = V || null;
          var aa = y(C),
            ma = q(p, "HEAPF32");
          P = P || 0;
          L = E(L);
          e = a._MakeTwoPointConicalGradientShader(
            e,
            l,
            t,
            w,
            aa.Vf,
            aa.Ig,
            ma,
            aa.count,
            F,
            P,
            L,
            V,
          );
          U(aa.Vf, C);
          p && U(ma, p);
          return e;
        };
        a.SkVertices.prototype.bounds = function (e) {
          this._bounds(Na);
          var l = Wa.toTypedArray();
          return e ? (e.set(l), e) : l.slice();
        };
        a.ui = a.SkPathEffect.MakeDash;
        a.si = a.SkShader.MakeLinearGradient;
        a.ti = a.SkShader.MakeRadialGradient;
        a.vi = a.SkShader.MakeTwoPointConicalGradient;
        a.Of &&
          a.Of.forEach(function (e) {
            e();
          });
      };
      a.computeTonalColors = function (g) {
        var r = q(g.ambient, "HEAPF32"),
          A = q(g.spot, "HEAPF32");
        this._computeTonalColors(r, A);
        var D = { ambient: R(r), spot: R(A) };
        U(r, g.ambient);
        U(A, g.spot);
        return D;
      };
      a.LTRBRect = function (g, r, A, D) {
        return Float32Array.of(g, r, A, D);
      };
      a.XYWHRect = function (g, r, A, D) {
        return Float32Array.of(g, r, g + A, r + D);
      };
      a.LTRBiRect = function (g, r, A, D) {
        return Int32Array.of(g, r, A, D);
      };
      a.XYWHiRect = function (g, r, A, D) {
        return Int32Array.of(g, r, g + A, r + D);
      };
      a.RRectXY = function (g, r, A) {
        return Float32Array.of(g[0], g[1], g[2], g[3], r, A, r, A, r, A, r, A);
      };
      a.MakeAnimatedImageFromEncoded = function (g) {
        g = new Uint8Array(g);
        var r = a._malloc(g.byteLength);
        a.HEAPU8.set(g, r);
        return (g = a._decodeAnimatedImage(r, g.byteLength)) ? g : null;
      };
      a.MakeImageFromEncoded = function (g) {
        g = new Uint8Array(g);
        var r = a._malloc(g.byteLength);
        a.HEAPU8.set(g, r);
        return (g = a._decodeImage(r, g.byteLength)) ? g : null;
      };
      var lb = null;
      a.MakeImageFromCanvasImageSource = function (g) {
        var r = g.width,
          A = g.height;
        lb || (lb = document.createElement("canvas"));
        lb.width = r;
        lb.height = A;
        var D = lb.getContext("2d");
        D.drawImage(g, 0, 0);
        g = D.getImageData(0, 0, r, A);
        return a.MakeImage(
          g.data,
          r,
          A,
          a.AlphaType.Unpremul,
          a.ColorType.RGBA_8888,
          a.SkColorSpace.SRGB,
        );
      };
      a.MakeImage = function (g, r, A, D, M, ca) {
        var e = g.length / (r * A);
        A = {
          width: r,
          height: A,
          alphaType: D,
          colorType: M,
          colorSpace: ca,
        };
        D = q(g, "HEAPU8");
        return a._MakeImage(A, D, g.length, r * e);
      };
      a.MakeSkVertices = function (g, r, A, D, M, ca) {
        var e = (M && M.length) || 0,
          l = 0;
        A && A.length && (l |= 1);
        D && D.length && (l |= 2);
        void 0 === ca || ca || (l |= 4);
        g = new a._SkVerticesBuilder(g, r.length, e, l);
        u(r, "HEAPF32", g.positions());
        g.texCoords() && u(A, "HEAPF32", g.texCoords());
        if (g.colors()) {
          if (D.build) {
            throw "Color builder not accepted by MakeSkVertices, use array of ints";
          }
          q(h(D), "HEAPU32", g.colors());
        }
        g.indices() && q(M, "HEAPU16", g.indices());
        return g.detach();
      };
      (function (g) {
        g.Of = g.Of || [];
        g.Of.push(function () {
          function r(p) {
            if (!p || !p.length) return [];
            for (var F = [], L = 0; L < p.length; L += 5) {
              var P = g.LTRBRect(p[L], p[L + 1], p[L + 2], p[L + 3]);
              P.direction = 0 === p[L + 4]
                ? g.TextDirection.RTL
                : g.TextDirection.LTR;
              F.push(P);
            }
            g._free(p.byteOffset);
            return F;
          }
          function A(p) {
            p = p || {};
            void 0 === p.weight && (p.weight = g.FontWeight.Normal);
            p.width = p.width || g.FontWidth.Normal;
            p.slant = p.slant || g.FontSlant.Upright;
            return p;
          }
          function D(p) {
            if (!p || !p.length) return 0;
            for (var F = [], L = 0; L < p.length; L++) {
              var P = M(p[L]);
              F.push(P);
            }
            return q(F, "HEAPU32");
          }
          function M(p) {
            if (l[p]) return l[p];
            var F = la(p) + 1,
              L = g._malloc(F);
            na(p, v, L, F);
            return (l[p] = L);
          }
          function ca(p) {
            p._colorPtr = Q(p.color);
            p._foregroundColorPtr = 0;
            p._backgroundColorPtr = 0;
            p._decorationColorPtr = 0;
            p.foregroundColor &&
              (p._foregroundColorPtr = Q(p.foregroundColor, t));
            p.backgroundColor &&
              (p._backgroundColorPtr = Q(p.backgroundColor, w));
            p.decorationColor &&
              (p._decorationColorPtr = Q(p.decorationColor, C));
            Array.isArray(p.fontFamilies) && p.fontFamilies.length
              ? ((p._fontFamiliesPtr = D(p.fontFamilies)),
                (p._fontFamiliesLen = p.fontFamilies.length))
              : ((p._fontFamiliesPtr = 0), (p._fontFamiliesLen = 0));
          }
          function e(p) {
            g._free(p._fontFamiliesPtr);
          }
          g.Paragraph.prototype.getRectsForRange = function (p, F, L, P) {
            p = this._getRectsForRange(p, F, L, P);
            return r(p);
          };
          g.Paragraph.prototype.getRectsForPlaceholders = function () {
            var p = this._getRectsForPlaceholders();
            return r(p);
          };
          g.TypefaceFontProvider.prototype.registerFont = function (p, F) {
            p = g.SkFontMgr.RefDefault().MakeTypefaceFromData(p);
            if (!p) return null;
            F = M(F);
            this._registerFont(p, F);
          };
          g.ParagraphStyle = function (p) {
            p.disableHinting = p.disableHinting || !1;
            if (p.ellipsis) {
              var F = p.ellipsis;
              p._ellipsisPtr = M(F);
              p._ellipsisLen = la(F) + 1;
            } else (p._ellipsisPtr = 0), (p._ellipsisLen = 0);
            p.heightMultiplier = p.heightMultiplier || 0;
            p.maxLines = p.maxLines || 0;
            p.textAlign = p.textAlign || g.TextAlign.Start;
            p.textDirection = p.textDirection || g.TextDirection.LTR;
            p.textStyle = g.TextStyle(p.textStyle);
            F = (F = p.strutStyle) || {};
            F.strutEnabled = F.strutEnabled || !1;
            F.strutEnabled &&
              Array.isArray(F.fontFamilies) &&
              F.fontFamilies.length
              ? ((F._fontFamiliesPtr = D(F.fontFamilies)),
                (F._fontFamiliesLen = F.fontFamilies.length))
              : ((F._fontFamiliesPtr = 0), (F._fontFamiliesLen = 0));
            F.fontStyle = A(F.fontStyle);
            F.fontSize = F.fontSize || 0;
            F.heightMultiplier = F.heightMultiplier || 0;
            F.leading = F.leading || 0;
            F.forceStrutHeight = F.forceStrutHeight || !1;
            p.strutStyle = F;
            return p;
          };
          g.TextStyle = function (p) {
            p.color || (p.color = g.BLACK);
            p.decoration = p.decoration || 0;
            p.decorationThickness = p.decorationThickness || 0;
            p.decorationStyle = p.decorationStyle || g.DecorationStyle.Solid;
            p.textBaseline = p.textBaseline || g.TextBaseline.Alphabetic;
            p.fontSize = p.fontSize || 0;
            p.letterSpacing = p.letterSpacing || 0;
            p.wordSpacing = p.wordSpacing || 0;
            p.heightMultiplier = p.heightMultiplier || 0;
            if (p.locale) {
              var F = p.locale;
              p._localePtr = M(F);
              p._localeLen = la(F) + 1;
            } else (p._localePtr = 0), (p._localeLen = 0);
            p.fontStyle = A(p.fontStyle);
            if (p.shadows) {
              F = p.shadows;
              var L = F.map(function (aa) {
                  return aa.color || g.BLACK;
                }),
                P = F.map(function (aa) {
                  return aa.offset || [0, 0];
                }),
                V = F.map(function (aa) {
                  return aa.blurRadius || 0;
                });
              p._shadowLen = F.length;
              p._shadowColorsPtr = y(L).Vf;
              p._shadowOffsetsPtr = u(P, "HEAPF32");
              p._shadowBlurRadiiPtr = q(V, "HEAPF32");
            } else {
              (p._shadowLen = 0),
                (p._shadowColorsPtr = 0),
                (p._shadowOffsetsPtr = 0),
                (p._shadowBlurRadiiPtr = 0);
            }
            p.fontFeatures
              ? ((F = p.fontFeatures),
                (L = F.map(function (aa) {
                  return aa.name;
                })),
                (P = F.map(function (aa) {
                  return aa.value;
                })),
                (p._fontFeatureLen = F.length),
                (p._fontFeatureNamesPtr = D(L)),
                (p._fontFeatureValuesPtr = q(P, "HEAPU32")))
              : ((p._fontFeatureLen = 0),
                (p._fontFeatureNamesPtr = 0),
                (p._fontFeatureValuesPtr = 0));
            return p;
          };
          var l = {},
            t = g._malloc(16),
            w = g._malloc(16),
            C = g._malloc(16);
          g.ParagraphBuilder.Make = function (p, F) {
            ca(p.textStyle);
            F = g.ParagraphBuilder._Make(p, F);
            e(p.textStyle);
            return F;
          };
          g.ParagraphBuilder.MakeFromFontProvider = function (p, F) {
            ca(p.textStyle);
            F = g.ParagraphBuilder._MakeFromFontProvider(p, F);
            e(p.textStyle);
            return F;
          };
          g.ParagraphBuilder.prototype.pushStyle = function (p) {
            ca(p);
            this._pushStyle(p);
            e(p);
          };
          g.ParagraphBuilder.prototype.pushPaintStyle = function (p, F, L) {
            ca(p);
            this._pushPaintStyle(p, F, L);
            e(p);
          };
          g.ParagraphBuilder.prototype.addPlaceholder = function (
            p,
            F,
            L,
            P,
            V,
          ) {
            L = L || g.PlaceholderAlignment.Baseline;
            P = P || g.TextBaseline.Alphabetic;
            this._addPlaceholder(p || 0, F || 0, L, P, V || 0);
          };
        });
      })(f);
      a.Of = a.Of || [];
      a.Of.push(function () {
        a.SkPath.prototype.op = function (g, r) {
          return this._op(g, r) ? this : null;
        };
        a.SkPath.prototype.simplify = function () {
          return this._simplify() ? this : null;
        };
      });
      a.Of = a.Of || [];
      a.Of.push(function () {
        a.SkCanvas.prototype.drawText = function (g, r, A, D, M) {
          if ("string" === typeof g) {
            var ca = la(g),
              e = a._malloc(ca + 1);
            na(g, v, e, ca + 1);
            this._drawSimpleText(e, ca, r, A, M, D);
            a._free(e);
          } else this._drawShapedText(g, r, A, D);
        };
        a.SkFont.prototype.getGlyphBounds = function (g, r, A) {
          var D = q(g, "HEAPU16"),
            M = a._malloc(16 * g.length);
          this._getGlyphWidthBounds(D, g.length, 0, M, r || null);
          r = new Float32Array(a.HEAPU8.buffer, M, 4 * g.length);
          U(D, g);
          if (A) return A.set(r), a._free(M), A;
          g = Float32Array.from(r);
          a._free(M);
          return g;
        };
        a.SkFont.prototype.getGlyphIDs = function (g, r, A) {
          r || (r = g.length);
          var D = la(g) + 1,
            M = a._malloc(D);
          na(g, v, M, D);
          g = a._malloc(2 * r);
          r = this._getGlyphIDs(M, D - 1, r, g);
          a._free(M);
          if (0 > r) return a._free(g), null;
          M = new Uint16Array(a.HEAPU8.buffer, g, r);
          if (A) return A.set(M), a._free(g), A;
          A = Uint32Array.from(M);
          a._free(g);
          return A;
        };
        a.SkFont.prototype.getGlyphWidths = function (g, r, A) {
          var D = q(g, "HEAPU16"),
            M = a._malloc(4 * g.length);
          this._getGlyphWidthBounds(D, g.length, M, 0, r || null);
          r = new Float32Array(a.HEAPU8.buffer, M, g.length);
          U(D, g);
          if (A) return A.set(r), a._free(M), A;
          g = Float32Array.from(r);
          a._free(M);
          return g;
        };
        a.SkFont.prototype.getWidths = function (g) {
          var r = g.length + 1,
            A = la(g) + 1,
            D = a._malloc(A);
          na(g, v, D, A);
          g = a._malloc(4 * r);
          if (!this._getWidths(D, A, r, g)) {
            return a._free(D), a._free(g), null;
          }
          r = new Float32Array(a.HEAPU8.buffer, g, r);
          r = Array.from(r);
          a._free(D);
          a._free(g);
          return r;
        };
        a.SkFontMgr.FromData = function () {
          if (!arguments.length) return null;
          var g = arguments;
          1 === g.length && Array.isArray(g[0]) && (g = arguments[0]);
          if (!g.length) return null;
          for (var r = [], A = [], D = 0; D < g.length; D++) {
            var M = new Uint8Array(g[D]),
              ca = q(M, "HEAPU8");
            r.push(ca);
            A.push(M.byteLength);
          }
          r = q(r, "HEAPU32");
          A = q(A, "HEAPU32");
          g = a.SkFontMgr._fromData(r, A, g.length);
          a._free(r);
          a._free(A);
          return g;
        };
        a.SkFontMgr.prototype.MakeTypefaceFromData = function (g) {
          g = new Uint8Array(g);
          var r = q(g, "HEAPU8");
          return (g = this._makeTypefaceFromData(r, g.byteLength)) ? g : null;
        };
        a.ShapedText.prototype.getBounds = function (g) {
          this._getBounds(Na);
          var r = Wa.toTypedArray();
          return g ? (g.set(r), g) : r.slice();
        };
        a.SkTextBlob.MakeOnPath = function (g, r, A, D) {
          if (g && g.length && r && r.countPoints()) {
            if (1 === r.countPoints()) return this.MakeFromText(g, A);
            D || (D = 0);
            var M = A.getWidths(g),
              ca = new a.RSXFormBuilder();
            r = new a.SkPathMeasure(r, !1, 1);
            for (var e = 0; e < g.length; e++) {
              var l = M[e];
              D += l / 2;
              if (D > r.getLength()) {
                if (!r.nextContour()) {
                  g = g.substring(0, e);
                  break;
                }
                D = l / 2;
              }
              var t = r.getPosTan(D),
                w = t[2],
                C = t[3];
              ca.push(w, C, t[0] - (l / 2) * w, t[1] - (l / 2) * C);
              D += l / 2;
            }
            g = this.MakeFromRSXform(g, ca, A);
            ca.delete();
            r.delete();
            return g;
          }
        };
        a.SkTextBlob.MakeFromRSXform = function (g, r, A) {
          var D = la(g) + 1,
            M = a._malloc(D);
          na(g, v, M, D);
          g = 0;
          r.build ? (g = r.build()) : (g = q(r, "HEAPF32"));
          r = a.SkTextBlob._MakeFromRSXform(M, D - 1, g, A);
          a._free(M);
          return r ? r : null;
        };
        a.SkTextBlob.MakeFromRSXformGlyphs = function (g, r, A) {
          var D = q(g, "HEAPU16"),
            M = 0;
          r.build ? (M = r.build()) : (M = q(r, "HEAPF32"));
          r = a.SkTextBlob._MakeFromRSXformGlyphs(D, 2 * g.length, M, A);
          U(D, g);
          return r ? r : null;
        };
        a.SkTextBlob.MakeFromGlyphs = function (g, r) {
          var A = q(g, "HEAPU16");
          r = a.SkTextBlob._MakeFromGlyphs(A, 2 * g.length, r);
          U(A, g);
          return r ? r : null;
        };
        a.SkTextBlob.MakeFromText = function (g, r) {
          var A = la(g) + 1,
            D = a._malloc(A);
          na(g, v, D, A);
          g = a.SkTextBlob._MakeFromText(D, A - 1, r);
          a._free(D);
          return g ? g : null;
        };
        a.MallocGlyphIDs = function (g) {
          return a.Malloc(Uint16Array, g);
        };
      });
      a.Of = a.Of || [];
      a.Of.push(function () {
        a.MakeSkPicture = function (g) {
          g = new Uint8Array(g);
          var r = a._malloc(g.byteLength);
          a.HEAPU8.set(g, r);
          return (g = a._MakeSkPicture(r, g.byteLength)) ? g : null;
        };
        a.SkPicture.prototype.saveAsFile = function (g) {
          var r = this.serialize();
          if (r) {
            var A = a.getSkDataBytes(r);
            ua(A, g);
            r.delete();
          }
        };
      });
      (function () {
        function g(J) {
          for (var k = 0; k < J.length; k++) {
            if (void 0 !== J[k] && !Number.isFinite(J[k])) {
              return !1;
            }
          }
          return !0;
        }
        function r(J) {
          var k = a.getColorComponents(J);
          J = k[0];
          var n = k[1],
            x = k[2];
          k = k[3];
          if (1 === k) {
            return (
              (J = J.toString(16).toLowerCase()),
                (n = n.toString(16).toLowerCase()),
                (x = x.toString(16).toLowerCase()),
                (J = 1 === J.length ? "0" + J : J),
                (n = 1 === n.length ? "0" + n : n),
                (x = 1 === x.length ? "0" + x : x),
                "#" + J + n + x
            );
          }
          k = 0 === k || 1 === k ? k : k.toFixed(8);
          return "rgba(" + J + ", " + n + ", " + x + ", " + k + ")";
        }
        function A(J) {
          return a.parseColorString(J, aa);
        }
        function D(J) {
          J = ma.exec(J);
          if (!J) return null;
          var k = parseFloat(J[4]),
            n = 16;
          switch (J[5]) {
            case "em":
            case "rem":
              n = 16 * k;
              break;
            case "pt":
              n = (4 * k) / 3;
              break;
            case "px":
              n = k;
              break;
            case "pc":
              n = 16 * k;
              break;
            case "in":
              n = 96 * k;
              break;
            case "cm":
              n = (96 * k) / 2.54;
              break;
            case "mm":
              n = (96 / 25.4) * k;
              break;
            case "q":
              n = (96 / 25.4 / 4) * k;
              break;
            case "%":
              n = (16 / 75) * k;
          }
          return {
            style: J[1],
            variant: J[2],
            weight: J[3],
            sizePx: n,
            family: J[6].trim(),
          };
        }
        function M(J) {
          this.Ff = J;
          this.Hf = new a.SkPaint();
          this.Hf.setAntiAlias(!0);
          this.Hf.setStrokeMiter(10);
          this.Hf.setStrokeCap(a.StrokeCap.Butt);
          this.Hf.setStrokeJoin(a.StrokeJoin.Miter);
          this.Qg = "10px monospace";
          this.gg = new a.SkFont(null, 10);
          this.gg.setSubpixel(!0);
          this.Uf = this.ag = a.BLACK;
          this.pg = 0;
          this.Fg = a.TRANSPARENT;
          this.rg = this.qg = 0;
          this.Gg = this.cg = 1;
          this.Eg = 0;
          this.og = [];
          this.Gf = a.BlendMode.SrcOver;
          this.hg = a.FilterQuality.Low;
          this.Dg = !0;
          this.Hf.setStrokeWidth(this.Gg);
          this.Hf.setBlendMode(this.Gf);
          this.Kf = new a.SkPath();
          this.Lf = a.SkMatrix.identity();
          this.oh = [];
          this.vg = [];
          this.dg = function () {
            this.Kf.delete();
            this.Hf.delete();
            this.gg.delete();
            this.vg.forEach(function (k) {
              k.dg();
            });
          };
          Object.defineProperty(this, "currentTransform", {
            enumerable: !0,
            get: function () {
              return {
                a: this.Lf[0],
                c: this.Lf[1],
                e: this.Lf[2],
                b: this.Lf[3],
                d: this.Lf[4],
                f: this.Lf[5],
              };
            },
            set: function (k) {
              k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
            },
          });
          Object.defineProperty(this, "fillStyle", {
            enumerable: !0,
            get: function () {
              return c(this.Uf) ? r(this.Uf) : this.Uf;
            },
            set: function (k) {
              "string" === typeof k ? (this.Uf = A(k)) : k.ng && (this.Uf = k);
            },
          });
          Object.defineProperty(this, "font", {
            enumerable: !0,
            get: function () {
              return this.Qg;
            },
            set: function (k) {
              var n = D(k),
                x = n.family;
              n.typeface = oa[x]
                ? oa[x][
                  (n.style || "normal") +
                  "|" +
                  (n.variant || "normal") +
                  "|" +
                  (n.weight || "normal")
                ] || oa[x]["*"]
                : null;
              n &&
                (this.gg.setSize(n.sizePx),
                  this.gg.setTypeface(n.typeface),
                  (this.Qg = k));
            },
          });
          Object.defineProperty(this, "globalAlpha", {
            enumerable: !0,
            get: function () {
              return this.cg;
            },
            set: function (k) {
              !isFinite(k) || 0 > k || 1 < k || (this.cg = k);
            },
          });
          Object.defineProperty(this, "globalCompositeOperation", {
            enumerable: !0,
            get: function () {
              switch (this.Gf) {
                case a.BlendMode.SrcOver:
                  return "source-over";
                case a.BlendMode.DstOver:
                  return "destination-over";
                case a.BlendMode.Src:
                  return "copy";
                case a.BlendMode.Dst:
                  return "destination";
                case a.BlendMode.Clear:
                  return "clear";
                case a.BlendMode.SrcIn:
                  return "source-in";
                case a.BlendMode.DstIn:
                  return "destination-in";
                case a.BlendMode.SrcOut:
                  return "source-out";
                case a.BlendMode.DstOut:
                  return "destination-out";
                case a.BlendMode.SrcATop:
                  return "source-atop";
                case a.BlendMode.DstATop:
                  return "destination-atop";
                case a.BlendMode.Xor:
                  return "xor";
                case a.BlendMode.Plus:
                  return "lighter";
                case a.BlendMode.Multiply:
                  return "multiply";
                case a.BlendMode.Screen:
                  return "screen";
                case a.BlendMode.Overlay:
                  return "overlay";
                case a.BlendMode.Darken:
                  return "darken";
                case a.BlendMode.Lighten:
                  return "lighten";
                case a.BlendMode.ColorDodge:
                  return "color-dodge";
                case a.BlendMode.ColorBurn:
                  return "color-burn";
                case a.BlendMode.HardLight:
                  return "hard-light";
                case a.BlendMode.SoftLight:
                  return "soft-light";
                case a.BlendMode.Difference:
                  return "difference";
                case a.BlendMode.Exclusion:
                  return "exclusion";
                case a.BlendMode.Hue:
                  return "hue";
                case a.BlendMode.Saturation:
                  return "saturation";
                case a.BlendMode.Color:
                  return "color";
                case a.BlendMode.Luminosity:
                  return "luminosity";
              }
            },
            set: function (k) {
              switch (k) {
                case "source-over":
                  this.Gf = a.BlendMode.SrcOver;
                  break;
                case "destination-over":
                  this.Gf = a.BlendMode.DstOver;
                  break;
                case "copy":
                  this.Gf = a.BlendMode.Src;
                  break;
                case "destination":
                  this.Gf = a.BlendMode.Dst;
                  break;
                case "clear":
                  this.Gf = a.BlendMode.Clear;
                  break;
                case "source-in":
                  this.Gf = a.BlendMode.SrcIn;
                  break;
                case "destination-in":
                  this.Gf = a.BlendMode.DstIn;
                  break;
                case "source-out":
                  this.Gf = a.BlendMode.SrcOut;
                  break;
                case "destination-out":
                  this.Gf = a.BlendMode.DstOut;
                  break;
                case "source-atop":
                  this.Gf = a.BlendMode.SrcATop;
                  break;
                case "destination-atop":
                  this.Gf = a.BlendMode.DstATop;
                  break;
                case "xor":
                  this.Gf = a.BlendMode.Xor;
                  break;
                case "lighter":
                  this.Gf = a.BlendMode.Plus;
                  break;
                case "plus-lighter":
                  this.Gf = a.BlendMode.Plus;
                  break;
                case "plus-darker":
                  throw "plus-darker is not supported";
                case "multiply":
                  this.Gf = a.BlendMode.Multiply;
                  break;
                case "screen":
                  this.Gf = a.BlendMode.Screen;
                  break;
                case "overlay":
                  this.Gf = a.BlendMode.Overlay;
                  break;
                case "darken":
                  this.Gf = a.BlendMode.Darken;
                  break;
                case "lighten":
                  this.Gf = a.BlendMode.Lighten;
                  break;
                case "color-dodge":
                  this.Gf = a.BlendMode.ColorDodge;
                  break;
                case "color-burn":
                  this.Gf = a.BlendMode.ColorBurn;
                  break;
                case "hard-light":
                  this.Gf = a.BlendMode.HardLight;
                  break;
                case "soft-light":
                  this.Gf = a.BlendMode.SoftLight;
                  break;
                case "difference":
                  this.Gf = a.BlendMode.Difference;
                  break;
                case "exclusion":
                  this.Gf = a.BlendMode.Exclusion;
                  break;
                case "hue":
                  this.Gf = a.BlendMode.Hue;
                  break;
                case "saturation":
                  this.Gf = a.BlendMode.Saturation;
                  break;
                case "color":
                  this.Gf = a.BlendMode.Color;
                  break;
                case "luminosity":
                  this.Gf = a.BlendMode.Luminosity;
                  break;
                default:
                  return;
              }
              this.Hf.setBlendMode(this.Gf);
            },
          });
          Object.defineProperty(this, "imageSmoothingEnabled", {
            enumerable: !0,
            get: function () {
              return this.Dg;
            },
            set: function (k) {
              this.Dg = !!k;
            },
          });
          Object.defineProperty(this, "imageSmoothingQuality", {
            enumerable: !0,
            get: function () {
              switch (this.hg) {
                case a.FilterQuality.Low:
                  return "low";
                case a.FilterQuality.Medium:
                  return "medium";
                case a.FilterQuality.High:
                  return "high";
              }
            },
            set: function (k) {
              switch (k) {
                case "low":
                  this.hg = a.FilterQuality.Low;
                  break;
                case "medium":
                  this.hg = a.FilterQuality.Medium;
                  break;
                case "high":
                  this.hg = a.FilterQuality.High;
              }
            },
          });
          Object.defineProperty(this, "lineCap", {
            enumerable: !0,
            get: function () {
              switch (this.Hf.getStrokeCap()) {
                case a.StrokeCap.Butt:
                  return "butt";
                case a.StrokeCap.Round:
                  return "round";
                case a.StrokeCap.Square:
                  return "square";
              }
            },
            set: function (k) {
              switch (k) {
                case "butt":
                  this.Hf.setStrokeCap(a.StrokeCap.Butt);
                  break;
                case "round":
                  this.Hf.setStrokeCap(a.StrokeCap.Round);
                  break;
                case "square":
                  this.Hf.setStrokeCap(a.StrokeCap.Square);
              }
            },
          });
          Object.defineProperty(this, "lineDashOffset", {
            enumerable: !0,
            get: function () {
              return this.Eg;
            },
            set: function (k) {
              isFinite(k) && (this.Eg = k);
            },
          });
          Object.defineProperty(this, "lineJoin", {
            enumerable: !0,
            get: function () {
              switch (this.Hf.getStrokeJoin()) {
                case a.StrokeJoin.Miter:
                  return "miter";
                case a.StrokeJoin.Round:
                  return "round";
                case a.StrokeJoin.Bevel:
                  return "bevel";
              }
            },
            set: function (k) {
              switch (k) {
                case "miter":
                  this.Hf.setStrokeJoin(a.StrokeJoin.Miter);
                  break;
                case "round":
                  this.Hf.setStrokeJoin(a.StrokeJoin.Round);
                  break;
                case "bevel":
                  this.Hf.setStrokeJoin(a.StrokeJoin.Bevel);
              }
            },
          });
          Object.defineProperty(this, "lineWidth", {
            enumerable: !0,
            get: function () {
              return this.Hf.getStrokeWidth();
            },
            set: function (k) {
              0 >= k || !k || ((this.Gg = k), this.Hf.setStrokeWidth(k));
            },
          });
          Object.defineProperty(this, "miterLimit", {
            enumerable: !0,
            get: function () {
              return this.Hf.getStrokeMiter();
            },
            set: function (k) {
              0 >= k || !k || this.Hf.setStrokeMiter(k);
            },
          });
          Object.defineProperty(this, "shadowBlur", {
            enumerable: !0,
            get: function () {
              return this.pg;
            },
            set: function (k) {
              0 > k || !isFinite(k) || (this.pg = k);
            },
          });
          Object.defineProperty(this, "shadowColor", {
            enumerable: !0,
            get: function () {
              return r(this.Fg);
            },
            set: function (k) {
              this.Fg = A(k);
            },
          });
          Object.defineProperty(this, "shadowOffsetX", {
            enumerable: !0,
            get: function () {
              return this.qg;
            },
            set: function (k) {
              isFinite(k) && (this.qg = k);
            },
          });
          Object.defineProperty(this, "shadowOffsetY", {
            enumerable: !0,
            get: function () {
              return this.rg;
            },
            set: function (k) {
              isFinite(k) && (this.rg = k);
            },
          });
          Object.defineProperty(this, "strokeStyle", {
            enumerable: !0,
            get: function () {
              return r(this.ag);
            },
            set: function (k) {
              "string" === typeof k ? (this.ag = A(k)) : k.ng && (this.ag = k);
            },
          });
          this.arc = function (k, n, x, B, G, H) {
            p(this.Kf, k, n, x, x, 0, B, G, H);
          };
          this.arcTo = function (k, n, x, B, G) {
            t(this.Kf, k, n, x, B, G);
          };
          this.beginPath = function () {
            this.Kf.delete();
            this.Kf = new a.SkPath();
          };
          this.bezierCurveTo = function (k, n, x, B, G, H) {
            var O = this.Kf;
            g([k, n, x, B, G, H]) &&
              (O.isEmpty() && O.moveTo(k, n), O.cubicTo(k, n, x, B, G, H));
          };
          this.clearRect = function (k, n, x, B) {
            this.Hf.setStyle(a.PaintStyle.Fill);
            this.Hf.setBlendMode(a.BlendMode.Clear);
            this.Ff.drawRect(a.XYWHRect(k, n, x, B), this.Hf);
            this.Hf.setBlendMode(this.Gf);
          };
          this.clip = function (k, n) {
            "string" === typeof k
              ? ((n = k), (k = this.Kf))
              : k && k.Xg && (k = k.Nf);
            k || (k = this.Kf);
            k = k.copy();
            n && "evenodd" === n.toLowerCase()
              ? k.setFillType(a.FillType.EvenOdd)
              : k.setFillType(a.FillType.Winding);
            this.Ff.clipPath(k, a.ClipOp.Intersect, !0);
            k.delete();
          };
          this.closePath = function () {
            w(this.Kf);
          };
          this.createImageData = function () {
            if (1 === arguments.length) {
              var k = arguments[0];
              return new e(
                new Uint8ClampedArray(4 * k.width * k.height),
                k.width,
                k.height,
              );
            }
            if (2 === arguments.length) {
              k = arguments[0];
              var n = arguments[1];
              return new e(new Uint8ClampedArray(4 * k * n), k, n);
            }
            throw (
              "createImageData expects 1 or 2 arguments, got " +
              arguments.length
            );
          };
          this.createLinearGradient = function (k, n, x, B) {
            if (g(arguments)) {
              var G = new l(k, n, x, B);
              this.vg.push(G);
              return G;
            }
          };
          this.createPattern = function (k, n) {
            k = new P(k, n);
            this.vg.push(k);
            return k;
          };
          this.createRadialGradient = function (k, n, x, B, G, H) {
            if (g(arguments)) {
              var O = new V(k, n, x, B, G, H);
              this.vg.push(O);
              return O;
            }
          };
          this.yh = function () {
            var k = this.Pg();
            this.Dg
              ? k.setFilterQuality(this.hg)
              : k.setFilterQuality(a.FilterQuality.None);
            return k;
          };
          this.drawImage = function (k) {
            var n = this.yh();
            if (3 === arguments.length || 5 === arguments.length) {
              var x = a.XYWHRect(
                  arguments[1],
                  arguments[2],
                  arguments[3] || k.width(),
                  arguments[4] || k.height(),
                ),
                B = a.XYWHRect(0, 0, k.width(), k.height());
            } else if (9 === arguments.length) {
              (x = a.XYWHRect(
                arguments[5],
                arguments[6],
                arguments[7],
                arguments[8],
              )),
                (B = a.XYWHRect(
                  arguments[1],
                  arguments[2],
                  arguments[3],
                  arguments[4],
                ));
            } else {
              throw (
                "invalid number of args for drawImage, need 3, 5, or 9; got " +
                arguments.length
              );
            }
            this.Ff.drawImageRect(k, B, x, n, !1);
            n.dispose();
          };
          this.ellipse = function (k, n, x, B, G, H, O, Z) {
            p(this.Kf, k, n, x, B, G, H, O, Z);
          };
          this.Pg = function () {
            var k = this.Hf.copy();
            k.setStyle(a.PaintStyle.Fill);
            if (c(this.Uf)) {
              var n = a.multiplyByAlpha(this.Uf, this.cg);
              k.setColor(n);
            } else {
              (n = this.Uf.ng(this.Lf)),
                k.setColor(a.Color(0, 0, 0, this.cg)),
                k.setShader(n);
            }
            k.dispose = function () {
              this.delete();
            };
            return k;
          };
          this.fill = function (k, n) {
            "string" === typeof k
              ? ((n = k), (k = this.Kf))
              : k && k.Xg && (k = k.Nf);
            if ("evenodd" === n) this.Kf.setFillType(a.FillType.EvenOdd);
            else {
              if ("nonzero" !== n && n) {
                throw "invalid fill rule";
              }
              this.Kf.setFillType(a.FillType.Winding);
            }
            k || (k = this.Kf);
            n = this.Pg();
            var x = this.sg(n);
            x &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawPath(k, x),
                this.Ff.restore(),
                x.dispose());
            this.Ff.drawPath(k, n);
            n.dispose();
          };
          this.fillRect = function (k, n, x, B) {
            var G = this.Pg(),
              H = this.sg(G);
            H &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawRect(a.XYWHRect(k, n, x, B), H),
                this.Ff.restore(),
                H.dispose());
            this.Ff.drawRect(a.XYWHRect(k, n, x, B), G);
            G.dispose();
          };
          this.fillText = function (k, n, x) {
            var B = this.Pg();
            k = a.SkTextBlob.MakeFromText(k, this.gg);
            var G = this.sg(B);
            G &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawTextBlob(k, n, x, G),
                this.Ff.restore(),
                G.dispose());
            this.Ff.drawTextBlob(k, n, x, B);
            k.delete();
            B.dispose();
          };
          this.getImageData = function (k, n, x, B) {
            return (k = this.Ff.readPixels(k, n, x, B))
              ? new e(new Uint8ClampedArray(k.buffer), x, B)
              : null;
          };
          this.getLineDash = function () {
            return this.og.slice();
          };
          this.ph = function (k) {
            var n = a.SkMatrix.invert(this.Lf);
            a.SkMatrix.mapPoints(n, k);
            return k;
          };
          this.isPointInPath = function (k, n, x) {
            var B = arguments;
            if (3 === B.length) var G = this.Kf;
            else if (4 === B.length) {
              (G = B[0]), (k = B[1]), (n = B[2]), (x = B[3]);
            } else throw "invalid arg count, need 3 or 4, got " + B.length;
            if (!isFinite(k) || !isFinite(n)) return !1;
            x = x || "nonzero";
            if ("nonzero" !== x && "evenodd" !== x) return !1;
            B = this.ph([k, n]);
            k = B[0];
            n = B[1];
            G.setFillType(
              "nonzero" === x ? a.FillType.Winding : a.FillType.EvenOdd,
            );
            return G.contains(k, n);
          };
          this.isPointInStroke = function (k, n) {
            var x = arguments;
            if (2 === x.length) var B = this.Kf;
            else if (3 === x.length) (B = x[0]), (k = x[1]), (n = x[2]);
            else {
              throw "invalid arg count, need 2 or 3, got " + x.length;
            }
            if (!isFinite(k) || !isFinite(n)) return !1;
            x = this.ph([k, n]);
            k = x[0];
            n = x[1];
            B = B.copy();
            B.setFillType(a.FillType.Winding);
            B.stroke({
              width: this.lineWidth,
              miter_limit: this.miterLimit,
              cap: this.Hf.getStrokeCap(),
              join: this.Hf.getStrokeJoin(),
              precision: 0.3,
            });
            x = B.contains(k, n);
            B.delete();
            return x;
          };
          this.lineTo = function (k, n) {
            F(this.Kf, k, n);
          };

          this.measureText = function (k) {
            let width = this.gg.measureText(k);
            let glyphBounds = this.gg
              .getGlyphBounds(k)
              .reduce((all, one, i) => {
                const ch = Math.floor(i / 4);
                all[ch] = [].concat(all[ch] || [], one);
                return all;
              }, []);
            let actualBoundingBoxAscent = Math.abs(
              glyphBounds.map((e) => e[1]).reduce((p, a) => p + a, 0),
            ) / glyphBounds.length;
            return {
              width,
              actualBoundingBoxAscent,
            };
          };

          this.moveTo = function (k, n) {
            var x = this.Kf;
            g([k, n]) && x.moveTo(k, n);
          };
          this.putImageData = function (k, n, x, B, G, H, O) {
            if (g([n, x, B, G, H, O])) {
              if (void 0 === B) {
                this.Ff.writePixels(k.data, k.width, k.height, n, x);
              } else if (
                ((B = B || 0),
                  (G = G || 0),
                  (H = H || k.width),
                  (O = O || k.height),
                  0 > H && ((B += H), (H = Math.abs(H))),
                  0 > O && ((G += O), (O = Math.abs(O))),
                  0 > B && ((H += B), (B = 0)),
                  0 > G && ((O += G), (G = 0)),
                  !(0 >= H || 0 >= O))
              ) {
                k = a.MakeImage(
                  k.data,
                  k.width,
                  k.height,
                  a.AlphaType.Unpremul,
                  a.ColorType.RGBA_8888,
                  a.SkColorSpace.SRGB,
                );
                var Z = a.XYWHRect(B, G, H, O);
                n = a.XYWHRect(n + B, x + G, H, O);
                x = a.SkMatrix.invert(this.Lf);
                this.Ff.save();
                this.Ff.concat(x);
                this.Ff.drawImageRect(k, Z, n, null, !1);
                this.Ff.restore();
                k.delete();
              }
            }
          };
          this.quadraticCurveTo = function (k, n, x, B) {
            var G = this.Kf;
            g([k, n, x, B]) &&
              (G.isEmpty() && G.moveTo(k, n), G.quadTo(k, n, x, B));
          };
          this.rect = function (k, n, x, B) {
            var G = this.Kf;
            k = a.XYWHRect(k, n, x, B);
            g(k) && G.addRect(k);
          };
          this.resetTransform = function () {
            this.Kf.transform(this.Lf);
            var k = a.SkMatrix.invert(this.Lf);
            this.Ff.concat(k);
            this.Lf = this.Ff.getTotalMatrix();
          };
          this.restore = function () {
            var k = this.oh.pop();
            if (k) {
              var n = a.SkMatrix.multiply(this.Lf, a.SkMatrix.invert(k.Dh));
              this.Kf.transform(n);
              this.Hf.delete();
              this.Hf = k.Yh;
              this.og = k.Uh;
              this.Gg = k.mi;
              this.ag = k.li;
              this.Uf = k.fs;
              this.qg = k.ji;
              this.rg = k.ki;
              this.pg = k.bi;
              this.Fg = k.ii;
              this.cg = k.Jh;
              this.Gf = k.Kh;
              this.Eg = k.Vh;
              this.Dg = k.Sh;
              this.hg = k.Th;
              this.Qg = k.Hh;
              this.Ff.restore();
              this.Lf = this.Ff.getTotalMatrix();
            }
          };
          this.rotate = function (k) {
            if (isFinite(k)) {
              var n = a.SkMatrix.rotated(-k);
              this.Kf.transform(n);
              this.Ff.rotate((k / Math.PI) * 180, 0, 0);
              this.Lf = this.Ff.getTotalMatrix();
            }
          };
          this.save = function () {
            if (this.Uf.mg) {
              var k = this.Uf.mg();
              this.vg.push(k);
            } else k = this.Uf;
            if (this.ag.mg) {
              var n = this.ag.mg();
              this.vg.push(n);
            } else n = this.ag;
            this.oh.push({
              Dh: this.Lf.slice(),
              Uh: this.og.slice(),
              mi: this.Gg,
              li: n,
              fs: k,
              ji: this.qg,
              ki: this.rg,
              bi: this.pg,
              ii: this.Fg,
              Jh: this.cg,
              Vh: this.Eg,
              Kh: this.Gf,
              Sh: this.Dg,
              Th: this.hg,
              Yh: this.Hf.copy(),
              Hh: this.Qg,
            });
            this.Ff.save();
          };
          this.scale = function (k, n) {
            if (g(arguments)) {
              var x = a.SkMatrix.scaled(1 / k, 1 / n);
              this.Kf.transform(x);
              this.Ff.scale(k, n);
              this.Lf = this.Ff.getTotalMatrix();
            }
          };
          this.setLineDash = function (k) {
            for (var n = 0; n < k.length; n++) {
              if (!isFinite(k[n]) || 0 > k[n]) {
                return;
              }
            }
            1 === k.length % 2 && Array.prototype.push.apply(k, k);
            this.og = k;
          };
          this.setTransform = function (k, n, x, B, G, H) {
            g(arguments) &&
              (this.resetTransform(), this.transform(k, n, x, B, G, H));
          };
          this.lg = function () {
            var k = a.SkMatrix.invert(this.Lf);
            this.Ff.concat(k);
            this.Ff.concat(a.SkMatrix.translated(this.qg, this.rg));
            this.Ff.concat(this.Lf);
          };
          this.sg = function (k) {
            var n = a.multiplyByAlpha(this.Fg, this.cg);
            if (
              !a.getColorComponents(n)[3] ||
              !(this.pg || this.rg || this.qg)
            ) {
              return null;
            }
            k = k.copy();
            k.setColor(n);
            var x = a.SkMaskFilter.MakeBlur(
              a.BlurStyle.Normal,
              this.pg / 2,
              !1,
            );
            k.setMaskFilter(x);
            k.dispose = function () {
              x.delete();
              this.delete();
            };
            return k;
          };
          this.Zg = function () {
            var k = this.Hf.copy();
            k.setStyle(a.PaintStyle.Stroke);
            if (c(this.ag)) {
              var n = a.multiplyByAlpha(this.ag, this.cg);
              k.setColor(n);
            } else {
              (n = this.ag.ng(this.Lf)),
                k.setColor(a.Color(0, 0, 0, this.cg)),
                k.setShader(n);
            }
            k.setStrokeWidth(this.Gg);
            if (this.og.length) {
              var x = a.SkPathEffect.MakeDash(this.og, this.Eg);
              k.setPathEffect(x);
            }
            k.dispose = function () {
              x && x.delete();
              this.delete();
            };
            return k;
          };
          this.stroke = function (k) {
            k = k ? k.Nf : this.Kf;
            var n = this.Zg(),
              x = this.sg(n);
            x &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawPath(k, x),
                this.Ff.restore(),
                x.dispose());
            this.Ff.drawPath(k, n);
            n.dispose();
          };
          this.strokeRect = function (k, n, x, B) {
            var G = this.Zg(),
              H = this.sg(G);
            H &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawRect(a.XYWHRect(k, n, x, B), H),
                this.Ff.restore(),
                H.dispose());
            this.Ff.drawRect(a.XYWHRect(k, n, x, B), G);
            G.dispose();
          };
          this.strokeText = function (k, n, x) {
            var B = this.Zg();
            k = a.SkTextBlob.MakeFromText(k, this.gg);
            var G = this.sg(B);
            G &&
              (this.Ff.save(),
                this.lg(),
                this.Ff.drawTextBlob(k, n, x, G),
                this.Ff.restore(),
                G.dispose());
            this.Ff.drawTextBlob(k, n, x, B);
            k.delete();
            B.dispose();
          };
          this.translate = function (k, n) {
            if (g(arguments)) {
              var x = a.SkMatrix.translated(-k, -n);
              this.Kf.transform(x);
              this.Ff.translate(k, n);
              this.Lf = this.Ff.getTotalMatrix();
            }
          };
          this.transform = function (k, n, x, B, G, H) {
            k = [k, x, G, n, B, H, 0, 0, 1];
            n = a.SkMatrix.invert(k);
            this.Kf.transform(n);
            this.Ff.concat(k);
            this.Lf = this.Ff.getTotalMatrix();
          };
          this.addHitRegion = function () {};
          this.clearHitRegions = function () {};
          this.drawFocusIfNeeded = function () {};
          this.removeHitRegion = function () {};
          this.scrollPathIntoView = function () {};
          Object.defineProperty(this, "canvas", {
            value: null,
            writable: !1,
          });
        }
        function ca(J) {
          this.$g = J;
          this.fg = new M(J.getCanvas());
          this.Rg = [];
          this.vh = a.SkFontMgr.RefDefault();
          this.decodeImage = function (k) {
            k = a.MakeImageFromEncoded(k);
            if (!k) throw "Invalid input";
            this.Rg.push(k);
            return k;
          };
          this.loadFont = function (k, n) {
            k = this.vh.MakeTypefaceFromData(k);
            if (!k) return null;
            this.Rg.push(k);
            var x = (n.style || "normal") +
              "|" +
              (n.variant || "normal") +
              "|" +
              (n.weight || "normal");
            n = n.family;
            oa[n] || (oa[n] = { "*": k });
            oa[n][x] = k;
          };
          this.makePath2D = function (k) {
            k = new L(k);
            this.Rg.push(k.Nf);
            return k;
          };
          this.getContext = function (k) {
            return "2d" === k ? this.fg : null;
          };
          this.toDataURL = function (k, n) {
            this.$g.flush();
            var x = this.$g.makeImageSnapshot();
            if (x) {
              k = k || "image/png";
              var B = a.ImageFormat.PNG;
              "image/jpeg" === k && (B = a.ImageFormat.JPEG);
              if ((n = x.encodeToData(B, n || 0.92))) {
                n = a.getSkDataBytes(n);
                k = "data:" + k + ";base64,";
                if (kb) n = Buffer.from(n).toString("base64");
                else {
                  x = 0;
                  B = n.length;
                  for (var G = "", H; x < B;) {
                    (H = n.slice(x, Math.min(x + 32768, B))),
                      (G += String.fromCharCode.apply(null, H)),
                      (x += 32768);
                  }
                  n = btoa(G);
                }
                return k + n;
              }
            }
          };
          this.toBuffer = function (k, n) {
            this.$g.flush();
            var x = this.$g.makeImageSnapshot();
            if (x) {
              k = k || "image/png";
              var B = a.ImageFormat.PNG;
              "image/jpeg" === k && (B = a.ImageFormat.JPEG);
              if ((n = x.encodeToData(B, n || 0.92))) {
                n = a.getSkDataBytes(n);
                return n;
              }
            }
          };
          this.registerFont = async function (src, desc) {
            let data = src.startsWith("http:") || src.startsWith("https:")
              ? await fetch(src).then((res) => res.buffer())
              : await Deno.readFile(src);
            return this.loadFont(data, desc);
          };
          this.dispose = function () {
            this.fg.dg();
            this.Rg.forEach(function (k) {
              k.delete();
            });
            this.$g.dispose();
          };
        }
        function e(J, k, n) {
          if (!k || 0 === n) {
            throw "invalid dimensions, width and height must be non-zero";
          }
          if (J.length % 4) throw "arr must be a multiple of 4";
          n = n || J.length / (4 * k);
          Object.defineProperty(this, "data", { value: J, writable: !1 });
          Object.defineProperty(this, "height", { value: n, writable: !1 });
          Object.defineProperty(this, "width", { value: k, writable: !1 });
        }
        function l(J, k, n, x) {
          this.Qf = null;
          this.Yf = [];
          this.Sf = [];
          this.addColorStop = function (B, G) {
            if (0 > B || 1 < B || !isFinite(B)) {
              throw "offset must be between 0 and 1 inclusively";
            }
            G = A(G);
            var H = this.Sf.indexOf(B);
            if (-1 !== H) this.Yf[H] = G;
            else {
              for (H = 0; H < this.Sf.length && !(this.Sf[H] > B); H++);
              this.Sf.splice(H, 0, B);
              this.Yf.splice(H, 0, G);
            }
          };
          this.mg = function () {
            var B = new l(J, k, n, x);
            B.Yf = this.Yf.slice();
            B.Sf = this.Sf.slice();
            return B;
          };
          this.dg = function () {
            this.Qf && (this.Qf.delete(), (this.Qf = null));
          };
          this.ng = function (B) {
            var G = [J, k, n, x];
            a.SkMatrix.mapPoints(B, G);
            B = G[0];
            var H = G[1],
              O = G[2];
            G = G[3];
            this.dg();
            return (this.Qf = a.SkShader.MakeLinearGradient(
              [B, H],
              [O, G],
              this.Yf,
              this.Sf,
              a.TileMode.Clamp,
            ));
          };
        }
        function t(J, k, n, x, B, G) {
          if (g([k, n, x, B, G])) {
            if (0 > G) throw "radii cannot be negative";
            J.isEmpty() && J.moveTo(k, n);
            J.arcToTangent(k, n, x, B, G);
          }
        }
        function w(J) {
          if (!J.isEmpty()) {
            var k = J.getBounds();
            (k[3] - k[1] || k[2] - k[0]) && J.close();
          }
        }
        function C(J, k, n, x, B, G, H) {
          H = ((H - G) / Math.PI) * 180;
          G = (G / Math.PI) * 180;
          k = a.LTRBRect(k - x, n - B, k + x, n + B);
          1e-5 > Math.abs(Math.abs(H) - 360)
            ? ((n = H / 2),
              J.arcToOval(k, G, n, !1),
              J.arcToOval(k, G + n, n, !1))
            : J.arcToOval(k, G, H, !1);
        }
        function p(J, k, n, x, B, G, H, O, Z) {
          if (g([k, n, x, B, G, H, O])) {
            if (0 > x || 0 > B) throw "radii cannot be negative";
            var ia = 2 * Math.PI,
              pa = H % ia;
            0 > pa && (pa += ia);
            var qa = pa - H;
            H = pa;
            O += qa;
            !Z && O - H >= ia
              ? (O = H + ia)
              : Z && H - O >= ia
              ? (O = H - ia)
              : !Z && H > O
              ? (O = H + (ia - ((H - O) % ia)))
              : Z && H < O && (O = H - (ia - ((O - H) % ia)));
            G
              ? ((Z = a.SkMatrix.rotated(G, k, n)),
                (G = a.SkMatrix.rotated(-G, k, n)),
                J.transform(G),
                C(J, k, n, x, B, H, O),
                J.transform(Z))
              : C(J, k, n, x, B, H, O);
          }
        }
        function F(J, k, n) {
          g([k, n]) && (J.isEmpty() && J.moveTo(k, n), J.lineTo(k, n));
        }
        function L(J) {
          this.Nf = null;
          "string" === typeof J
            ? (this.Nf = a.MakePathFromSVGString(J))
            : J && J.Xg
            ? (this.Nf = J.Nf.copy())
            : (this.Nf = new a.SkPath());
          this.Xg = function () {
            return this.Nf;
          };
          this.addPath = function (k, n) {
            n || (n = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
            this.Nf.addPath(k.Nf, [n.a, n.c, n.e, n.b, n.d, n.f]);
          };
          this.arc = function (k, n, x, B, G, H) {
            p(this.Nf, k, n, x, x, 0, B, G, H);
          };
          this.arcTo = function (k, n, x, B, G) {
            t(this.Nf, k, n, x, B, G);
          };
          this.bezierCurveTo = function (k, n, x, B, G, H) {
            var O = this.Nf;
            g([k, n, x, B, G, H]) &&
              (O.isEmpty() && O.moveTo(k, n), O.cubicTo(k, n, x, B, G, H));
          };
          this.closePath = function () {
            w(this.Nf);
          };
          this.ellipse = function (k, n, x, B, G, H, O, Z) {
            p(this.Nf, k, n, x, B, G, H, O, Z);
          };
          this.lineTo = function (k, n) {
            F(this.Nf, k, n);
          };
          this.moveTo = function (k, n) {
            var x = this.Nf;
            g([k, n]) && x.moveTo(k, n);
          };
          this.quadraticCurveTo = function (k, n, x, B) {
            var G = this.Nf;
            g([k, n, x, B]) &&
              (G.isEmpty() && G.moveTo(k, n), G.quadTo(k, n, x, B));
          };
          this.rect = function (k, n, x, B) {
            var G = this.Nf;
            k = a.XYWHRect(k, n, x, B);
            g(k) && G.addRect(k);
          };
        }
        function P(J, k) {
          this.Qf = null;
          this.xh = J;
          this._transform = a.SkMatrix.identity();
          "" === k && (k = "repeat");
          switch (k) {
            case "repeat-x":
              this.tg = a.TileMode.Repeat;
              this.ug = a.TileMode.Decal;
              break;
            case "repeat-y":
              this.tg = a.TileMode.Decal;
              this.ug = a.TileMode.Repeat;
              break;
            case "repeat":
              this.ug = this.tg = a.TileMode.Repeat;
              break;
            case "no-repeat":
              this.ug = this.tg = a.TileMode.Decal;
              break;
            default:
              throw "invalid repetition mode " + k;
          }
          this.setTransform = function (n) {
            n = [n.a, n.c, n.e, n.b, n.d, n.f, 0, 0, 1];
            g(n) && (this._transform = n);
          };
          this.mg = function () {
            var n = new P();
            n.tg = this.tg;
            n.ug = this.ug;
            return n;
          };
          this.dg = function () {
            this.Qf && (this.Qf.delete(), (this.Qf = null));
          };
          this.ng = function () {
            this.dg();
            return (this.Qf = this.xh.makeShader(
              this.tg,
              this.ug,
              this._transform,
            ));
          };
        }
        function V(J, k, n, x, B, G) {
          this.Qf = null;
          this.Yf = [];
          this.Sf = [];
          this.addColorStop = function (H, O) {
            if (0 > H || 1 < H || !isFinite(H)) {
              throw "offset must be between 0 and 1 inclusively";
            }
            O = A(O);
            var Z = this.Sf.indexOf(H);
            if (-1 !== Z) this.Yf[Z] = O;
            else {
              for (Z = 0; Z < this.Sf.length && !(this.Sf[Z] > H); Z++);
              this.Sf.splice(Z, 0, H);
              this.Yf.splice(Z, 0, O);
            }
          };
          this.mg = function () {
            var H = new V(J, k, n, x, B, G);
            H.Yf = this.Yf.slice();
            H.Sf = this.Sf.slice();
            return H;
          };
          this.dg = function () {
            this.Qf && (this.Qf.delete(), (this.Qf = null));
          };
          this.ng = function (H) {
            var O = [J, k, x, B];
            a.SkMatrix.mapPoints(H, O);
            var Z = O[0],
              ia = O[1],
              pa = O[2];
            O = O[3];
            var qa = (Math.abs(H[0]) + Math.abs(H[4])) / 2;
            H = n * qa;
            qa *= G;
            this.dg();
            return (this.Qf = a.SkShader.MakeTwoPointConicalGradient(
              [Z, ia],
              H,
              [pa, O],
              qa,
              this.Yf,
              this.Sf,
              a.TileMode.Clamp,
            ));
          };
        }
        a._testing = {};
        var aa = {
          aliceblue: Float32Array.of(0.941, 0.973, 1, 1),
          antiquewhite: Float32Array.of(0.98, 0.922, 0.843, 1),
          aqua: Float32Array.of(0, 1, 1, 1),
          aquamarine: Float32Array.of(0.498, 1, 0.831, 1),
          azure: Float32Array.of(0.941, 1, 1, 1),
          beige: Float32Array.of(0.961, 0.961, 0.863, 1),
          bisque: Float32Array.of(1, 0.894, 0.769, 1),
          black: Float32Array.of(0, 0, 0, 1),
          blanchedalmond: Float32Array.of(1, 0.922, 0.804, 1),
          blue: Float32Array.of(0, 0, 1, 1),
          blueviolet: Float32Array.of(0.541, 0.169, 0.886, 1),
          brown: Float32Array.of(0.647, 0.165, 0.165, 1),
          burlywood: Float32Array.of(0.871, 0.722, 0.529, 1),
          cadetblue: Float32Array.of(0.373, 0.62, 0.627, 1),
          chartreuse: Float32Array.of(0.498, 1, 0, 1),
          chocolate: Float32Array.of(0.824, 0.412, 0.118, 1),
          coral: Float32Array.of(1, 0.498, 0.314, 1),
          cornflowerblue: Float32Array.of(0.392, 0.584, 0.929, 1),
          cornsilk: Float32Array.of(1, 0.973, 0.863, 1),
          crimson: Float32Array.of(0.863, 0.078, 0.235, 1),
          cyan: Float32Array.of(0, 1, 1, 1),
          darkblue: Float32Array.of(0, 0, 0.545, 1),
          darkcyan: Float32Array.of(0, 0.545, 0.545, 1),
          darkgoldenrod: Float32Array.of(0.722, 0.525, 0.043, 1),
          darkgray: Float32Array.of(0.663, 0.663, 0.663, 1),
          darkgreen: Float32Array.of(0, 0.392, 0, 1),
          darkgrey: Float32Array.of(0.663, 0.663, 0.663, 1),
          darkkhaki: Float32Array.of(0.741, 0.718, 0.42, 1),
          darkmagenta: Float32Array.of(0.545, 0, 0.545, 1),
          darkolivegreen: Float32Array.of(0.333, 0.42, 0.184, 1),
          darkorange: Float32Array.of(1, 0.549, 0, 1),
          darkorchid: Float32Array.of(0.6, 0.196, 0.8, 1),
          darkred: Float32Array.of(0.545, 0, 0, 1),
          darksalmon: Float32Array.of(0.914, 0.588, 0.478, 1),
          darkseagreen: Float32Array.of(0.561, 0.737, 0.561, 1),
          darkslateblue: Float32Array.of(0.282, 0.239, 0.545, 1),
          darkslategray: Float32Array.of(0.184, 0.31, 0.31, 1),
          darkslategrey: Float32Array.of(0.184, 0.31, 0.31, 1),
          darkturquoise: Float32Array.of(0, 0.808, 0.82, 1),
          darkviolet: Float32Array.of(0.58, 0, 0.827, 1),
          deeppink: Float32Array.of(1, 0.078, 0.576, 1),
          deepskyblue: Float32Array.of(0, 0.749, 1, 1),
          dimgray: Float32Array.of(0.412, 0.412, 0.412, 1),
          dimgrey: Float32Array.of(0.412, 0.412, 0.412, 1),
          dodgerblue: Float32Array.of(0.118, 0.565, 1, 1),
          firebrick: Float32Array.of(0.698, 0.133, 0.133, 1),
          floralwhite: Float32Array.of(1, 0.98, 0.941, 1),
          forestgreen: Float32Array.of(0.133, 0.545, 0.133, 1),
          fuchsia: Float32Array.of(1, 0, 1, 1),
          gainsboro: Float32Array.of(0.863, 0.863, 0.863, 1),
          ghostwhite: Float32Array.of(0.973, 0.973, 1, 1),
          gold: Float32Array.of(1, 0.843, 0, 1),
          goldenrod: Float32Array.of(0.855, 0.647, 0.125, 1),
          gray: Float32Array.of(0.502, 0.502, 0.502, 1),
          green: Float32Array.of(0, 0.502, 0, 1),
          greenyellow: Float32Array.of(0.678, 1, 0.184, 1),
          grey: Float32Array.of(0.502, 0.502, 0.502, 1),
          honeydew: Float32Array.of(0.941, 1, 0.941, 1),
          hotpink: Float32Array.of(1, 0.412, 0.706, 1),
          indianred: Float32Array.of(0.804, 0.361, 0.361, 1),
          indigo: Float32Array.of(0.294, 0, 0.51, 1),
          ivory: Float32Array.of(1, 1, 0.941, 1),
          khaki: Float32Array.of(0.941, 0.902, 0.549, 1),
          lavender: Float32Array.of(0.902, 0.902, 0.98, 1),
          lavenderblush: Float32Array.of(1, 0.941, 0.961, 1),
          lawngreen: Float32Array.of(0.486, 0.988, 0, 1),
          lemonchiffon: Float32Array.of(1, 0.98, 0.804, 1),
          lightblue: Float32Array.of(0.678, 0.847, 0.902, 1),
          lightcoral: Float32Array.of(0.941, 0.502, 0.502, 1),
          lightcyan: Float32Array.of(0.878, 1, 1, 1),
          lightgoldenrodyellow: Float32Array.of(0.98, 0.98, 0.824, 1),
          lightgray: Float32Array.of(0.827, 0.827, 0.827, 1),
          lightgreen: Float32Array.of(0.565, 0.933, 0.565, 1),
          lightgrey: Float32Array.of(0.827, 0.827, 0.827, 1),
          lightpink: Float32Array.of(1, 0.714, 0.757, 1),
          lightsalmon: Float32Array.of(1, 0.627, 0.478, 1),
          lightseagreen: Float32Array.of(0.125, 0.698, 0.667, 1),
          lightskyblue: Float32Array.of(0.529, 0.808, 0.98, 1),
          lightslategray: Float32Array.of(0.467, 0.533, 0.6, 1),
          lightslategrey: Float32Array.of(0.467, 0.533, 0.6, 1),
          lightsteelblue: Float32Array.of(0.69, 0.769, 0.871, 1),
          lightyellow: Float32Array.of(1, 1, 0.878, 1),
          lime: Float32Array.of(0, 1, 0, 1),
          limegreen: Float32Array.of(0.196, 0.804, 0.196, 1),
          linen: Float32Array.of(0.98, 0.941, 0.902, 1),
          magenta: Float32Array.of(1, 0, 1, 1),
          maroon: Float32Array.of(0.502, 0, 0, 1),
          mediumaquamarine: Float32Array.of(0.4, 0.804, 0.667, 1),
          mediumblue: Float32Array.of(0, 0, 0.804, 1),
          mediumorchid: Float32Array.of(0.729, 0.333, 0.827, 1),
          mediumpurple: Float32Array.of(0.576, 0.439, 0.859, 1),
          mediumseagreen: Float32Array.of(0.235, 0.702, 0.443, 1),
          mediumslateblue: Float32Array.of(0.482, 0.408, 0.933, 1),
          mediumspringgreen: Float32Array.of(0, 0.98, 0.604, 1),
          mediumturquoise: Float32Array.of(0.282, 0.82, 0.8, 1),
          mediumvioletred: Float32Array.of(0.78, 0.082, 0.522, 1),
          midnightblue: Float32Array.of(0.098, 0.098, 0.439, 1),
          mintcream: Float32Array.of(0.961, 1, 0.98, 1),
          mistyrose: Float32Array.of(1, 0.894, 0.882, 1),
          moccasin: Float32Array.of(1, 0.894, 0.71, 1),
          navajowhite: Float32Array.of(1, 0.871, 0.678, 1),
          navy: Float32Array.of(0, 0, 0.502, 1),
          oldlace: Float32Array.of(0.992, 0.961, 0.902, 1),
          olive: Float32Array.of(0.502, 0.502, 0, 1),
          olivedrab: Float32Array.of(0.42, 0.557, 0.137, 1),
          orange: Float32Array.of(1, 0.647, 0, 1),
          orangered: Float32Array.of(1, 0.271, 0, 1),
          orchid: Float32Array.of(0.855, 0.439, 0.839, 1),
          palegoldenrod: Float32Array.of(0.933, 0.91, 0.667, 1),
          palegreen: Float32Array.of(0.596, 0.984, 0.596, 1),
          paleturquoise: Float32Array.of(0.686, 0.933, 0.933, 1),
          palevioletred: Float32Array.of(0.859, 0.439, 0.576, 1),
          papayawhip: Float32Array.of(1, 0.937, 0.835, 1),
          peachpuff: Float32Array.of(1, 0.855, 0.725, 1),
          peru: Float32Array.of(0.804, 0.522, 0.247, 1),
          pink: Float32Array.of(1, 0.753, 0.796, 1),
          plum: Float32Array.of(0.867, 0.627, 0.867, 1),
          powderblue: Float32Array.of(0.69, 0.878, 0.902, 1),
          purple: Float32Array.of(0.502, 0, 0.502, 1),
          rebeccapurple: Float32Array.of(0.4, 0.2, 0.6, 1),
          red: Float32Array.of(1, 0, 0, 1),
          rosybrown: Float32Array.of(0.737, 0.561, 0.561, 1),
          royalblue: Float32Array.of(0.255, 0.412, 0.882, 1),
          saddlebrown: Float32Array.of(0.545, 0.271, 0.075, 1),
          salmon: Float32Array.of(0.98, 0.502, 0.447, 1),
          sandybrown: Float32Array.of(0.957, 0.643, 0.376, 1),
          seagreen: Float32Array.of(0.18, 0.545, 0.341, 1),
          seashell: Float32Array.of(1, 0.961, 0.933, 1),
          sienna: Float32Array.of(0.627, 0.322, 0.176, 1),
          silver: Float32Array.of(0.753, 0.753, 0.753, 1),
          skyblue: Float32Array.of(0.529, 0.808, 0.922, 1),
          slateblue: Float32Array.of(0.416, 0.353, 0.804, 1),
          slategray: Float32Array.of(0.439, 0.502, 0.565, 1),
          slategrey: Float32Array.of(0.439, 0.502, 0.565, 1),
          snow: Float32Array.of(1, 0.98, 0.98, 1),
          springgreen: Float32Array.of(0, 1, 0.498, 1),
          steelblue: Float32Array.of(0.275, 0.51, 0.706, 1),
          tan: Float32Array.of(0.824, 0.706, 0.549, 1),
          teal: Float32Array.of(0, 0.502, 0.502, 1),
          thistle: Float32Array.of(0.847, 0.749, 0.847, 1),
          tomato: Float32Array.of(1, 0.388, 0.278, 1),
          transparent: Float32Array.of(0, 0, 0, 0),
          turquoise: Float32Array.of(0.251, 0.878, 0.816, 1),
          violet: Float32Array.of(0.933, 0.51, 0.933, 1),
          wheat: Float32Array.of(0.961, 0.871, 0.702, 1),
          white: Float32Array.of(1, 1, 1, 1),
          whitesmoke: Float32Array.of(0.961, 0.961, 0.961, 1),
          yellow: Float32Array.of(1, 1, 0, 1),
          yellowgreen: Float32Array.of(0.604, 0.804, 0.196, 1),
        };
        a._testing.parseColor = A;
        a._testing.colorToString = r;
        var ma =
            /(italic|oblique|normal|)\s*(small-caps|normal|)\s*(bold|bolder|lighter|[1-9]00|normal|)\s*([\d\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)/,
          oa = { "Noto Mono": { "*": null }, monospace: { "*": null } };
        a._testing.parseFontString = D;
        a.MakeCanvas = function (J, k) {
          return (J = a.MakeSurface(J, k)) ? new ca(J) : null;
        };
        a.ImageData = function () {
          if (2 === arguments.length) {
            var J = arguments[0],
              k = arguments[1];
            return new e(new Uint8ClampedArray(4 * J * k), J, k);
          }
          if (3 === arguments.length) {
            var n = arguments[0];
            if (n.prototype.constructor !== Uint8ClampedArray) {
              throw "bytes must be given as a Uint8ClampedArray";
            }
            J = arguments[1];
            k = arguments[2];
            if (n % 4) throw "bytes must be given in a multiple of 4";
            if (n % J) throw "bytes must divide evenly by width";
            if (k && k !== n / (4 * J)) throw "invalid height given";
            return new e(n, J, n / (4 * J));
          }
          throw (
            "invalid number of arguments - takes 2 or 3, saw " +
            arguments.length
          );
        };
      })();
    })(f);
    var sa = {},
      ta;
    for (ta in f) f.hasOwnProperty(ta) && (sa[ta] = f[ta]);
    var va = "./this.program";
    function wa(a, b) {
      throw b;
    }
    var xa = !1,
      ya = !1,
      za = !1,
      Aa = !1;
    xa = "object" === typeof window;
    ya = "function" === typeof importScripts;
    za = "object" === typeof process &&
      "object" === typeof process.versions &&
      "string" === typeof process.versions.node;
    Aa = !xa && !za && !ya;
    var Ba = "",
      Ca,
      Da,
      Ea,
      Ga;
    if (za) {
      (Ba = ya ? require("path").dirname(Ba) + "/" : __dirname + "/"),
        (Ca = function (a, b) {
          Ea || (Ea = require("fs"));
          Ga || (Ga = require("path"));
          a = Ga.normalize(a);
          return Ea.readFileSync(a, b ? null : "utf8");
        }),
        (Da = function (a) {
          a = Ca(a, !0);
          a.buffer || (a = new Uint8Array(a));
          assert(a.buffer);
          return a;
        }),
        1 < process.argv.length && (va = process.argv[1].replace(/\\/g, "/")),
        process.argv.slice(2),
        process.on("uncaughtException", function (a) {
          if (!(a instanceof Ha)) throw a;
        }),
        process.on("unhandledRejection", Ia),
        (wa = function (a) {
          process.exit(a);
        }),
        (f.inspect = function () {
          return "[Emscripten Module object]";
        });
    } else if (Aa) {
      "undefined" != typeof read &&
      (Ca = function (a) {
        return read(a);
      }),
        (Da = function (a) {
          if ("function" === typeof readbuffer) {
            return new Uint8Array(readbuffer(a));
          }
          a = read(a, "binary");
          assert("object" === typeof a);
          return a;
        }),
        "function" === typeof quit &&
        (wa = function (a) {
          quit(a);
        }),
        "undefined" !== typeof print &&
        ("undefined" === typeof console && (console = {}),
          (console.log = print),
          (console.warn = console.error = "undefined" !== typeof printErr
            ? printErr
            : print));
    } else if (xa || ya) {
      ya ? (Ba = self.location.href) : (document || {}).currentScript &&
        (Ba = (document || {}).currentScript.src),
        _scriptDir && (Ba = _scriptDir),
        0 !== Ba.indexOf("blob:")
          ? (Ba = Ba.substr(0, Ba.lastIndexOf("/") + 1))
          : (Ba = ""),
        (Ca = function (a) {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        ya &&
        (Da = function (a) {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        });
    }
    var Ja = f.print || console.log.bind(console),
      Ka = f.printErr || console.warn.bind(console);
    for (ta in sa) sa.hasOwnProperty(ta) && (f[ta] = sa[ta]);
    sa = null;
    f.thisProgram && (va = f.thisProgram);
    f.quit && (wa = f.quit);
    var La = 0,
      Ma;
    f.wasmBinary && (Ma = f.wasmBinary);
    var noExitRuntime;
    f.noExitRuntime && (noExitRuntime = f.noExitRuntime);
    "object" !== typeof WebAssembly && Ia("no native wasm support detected");
    var Oa,
      Pa = new WebAssembly.Table({
        initial: 8111,
        maximum: 8111,
        element: "anyfunc",
      }),
      Qa = !1;
    function assert(a, b) {
      a || Ia("Assertion failed: " + b);
    }
    var Ra = "undefined" !== typeof TextDecoder
      ? new TextDecoder("utf8")
      : void 0;
    function Sa(a, b, c) {
      var d = b + c;
      for (c = b; a[c] && !(c >= d);) ++c;
      if (16 < c - b && a.subarray && Ra) return Ra.decode(a.subarray(b, c));
      for (d = ""; b < c;) {
        var h = a[b++];
        if (h & 128) {
          var m = a[b++] & 63;
          if (192 == (h & 224)) d += String.fromCharCode(((h & 31) << 6) | m);
          else {
            var q = a[b++] & 63;
            h = 224 == (h & 240)
              ? ((h & 15) << 12) | (m << 6) | q
              : ((h & 7) << 18) | (m << 12) | (q << 6) | (a[b++] & 63);
            65536 > h
              ? (d += String.fromCharCode(h))
              : ((h -= 65536),
                (d += String.fromCharCode(
                  55296 | (h >> 10),
                  56320 | (h & 1023),
                )));
          }
        } else d += String.fromCharCode(h);
      }
      return d;
    }
    function Ta(a, b) {
      return a ? Sa(v, a, b) : "";
    }
    function na(a, b, c, d) {
      if (!(0 < d)) return 0;
      var h = c;
      d = c + d - 1;
      for (var m = 0; m < a.length; ++m) {
        var q = a.charCodeAt(m);
        if (55296 <= q && 57343 >= q) {
          var u = a.charCodeAt(++m);
          q = (65536 + ((q & 1023) << 10)) | (u & 1023);
        }
        if (127 >= q) {
          if (c >= d) break;
          b[c++] = q;
        } else {
          if (2047 >= q) {
            if (c + 1 >= d) break;
            b[c++] = 192 | (q >> 6);
          } else {
            if (65535 >= q) {
              if (c + 2 >= d) break;
              b[c++] = 224 | (q >> 12);
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | (q >> 18);
              b[c++] = 128 | ((q >> 12) & 63);
            }
            b[c++] = 128 | ((q >> 6) & 63);
          }
          b[c++] = 128 | (q & 63);
        }
      }
      b[c] = 0;
      return c - h;
    }
    function la(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d &&
          57343 >= d &&
          (d = (65536 + ((d & 1023) << 10)) | (a.charCodeAt(++c) & 1023));
        127 >= d ? ++b : (b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4);
      }
      return b;
    }
    var Ua = "undefined" !== typeof TextDecoder
      ? new TextDecoder("utf-8")
      : void 0;
    function Va(a, b) {
      var c = a >> 1;
      for (var d = c + b / 2; !(c >= d) && $a[c];) ++c;
      c <<= 1;
      if (32 < c - a && Ua) return Ua.decode(v.subarray(a, c));
      c = 0;
      for (d = "";;) {
        var h = ab[(a + 2 * c) >> 1];
        if (0 == h || c == b / 2) return d;
        ++c;
        d += String.fromCharCode(h);
      }
    }
    function bb(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var h = 0; h < c; ++h) (ab[b >> 1] = a.charCodeAt(h)), (b += 2);
      ab[b >> 1] = 0;
      return b - d;
    }
    function cb(a) {
      return 2 * a.length;
    }
    function db(a, b) {
      for (var c = 0, d = ""; !(c >= b / 4);) {
        var h = K[(a + 4 * c) >> 2];
        if (0 == h) break;
        ++c;
        65536 <= h
          ? ((h -= 65536),
            (d += String.fromCharCode(55296 | (h >> 10), 56320 | (h & 1023))))
          : (d += String.fromCharCode(h));
      }
      return d;
    }
    function eb(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (4 > c) return 0;
      var d = b;
      c = d + c - 4;
      for (var h = 0; h < a.length; ++h) {
        var m = a.charCodeAt(h);
        if (55296 <= m && 57343 >= m) {
          var q = a.charCodeAt(++h);
          m = (65536 + ((m & 1023) << 10)) | (q & 1023);
        }
        K[b >> 2] = m;
        b += 4;
        if (b + 4 > c) break;
      }
      K[b >> 2] = 0;
      return b - d;
    }
    function fb(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d && 57343 >= d && ++c;
        b += 4;
      }
      return b;
    }
    var gb, hb, v, ab, $a, K, mb, S, nb;
    function ob(a) {
      gb = a;
      f.HEAP8 = hb = new Int8Array(a);
      f.HEAP16 = ab = new Int16Array(a);
      f.HEAP32 = K = new Int32Array(a);
      f.HEAPU8 = v = new Uint8Array(a);
      f.HEAPU16 = $a = new Uint16Array(a);
      f.HEAPU32 = mb = new Uint32Array(a);
      f.HEAPF32 = S = new Float32Array(a);
      f.HEAPF64 = nb = new Float64Array(a);
    }
    var pb = f.INITIAL_MEMORY || 134217728;
    f.wasmMemory
      ? (Oa = f.wasmMemory)
      : (Oa = new WebAssembly.Memory({ initial: pb / 65536, maximum: 32768 }));
    Oa && (gb = Oa.buffer);
    pb = gb.byteLength;
    ob(gb);
    K[457140] = 7071600;
    function qb(a) {
      for (; 0 < a.length;) {
        var b = a.shift();
        if ("function" == typeof b) b(f);
        else {
          var c = b.Ih;
          "number" === typeof c
            ? void 0 === b.ah ? f.dynCall_v(c) : f.dynCall_vi(c, b.ah)
            : c(void 0 === b.ah ? null : b.ah);
        }
      }
    }
    var rb = [],
      sb = [],
      tb = [],
      ub = [];
    function vb() {
      var a = f.preRun.shift();
      rb.unshift(a);
    }
    var wb = Math.ceil,
      xb = Math.floor,
      yb = 0,
      zb = null,
      Ab = null;
    f.preloadedImages = {};
    f.preloadedAudios = {};
    function Ia(a) {
      if (f.onAbort) f.onAbort(a);
      Ka(a);
      Qa = !0;
      a = new WebAssembly.RuntimeError(
        "abort(" + a + "). Build with -s ASSERTIONS=1 for more info.",
      );
      ea(a);
      throw a;
    }
    function Bb(a) {
      var b = Db;
      return String.prototype.startsWith ? b.startsWith(a) : 0 === b.indexOf(a);
    }
    function Eb() {
      return Bb("data:application/octet-stream;base64,");
    }
    var Db = "canvaskit.wasm";
    if (!Eb()) {
      var Fb = Db;
      Db = f.locateFile ? f.locateFile(Fb, Ba) : Ba + Fb;
    }
    function Gb() {
      try {
        if (Ma) return new Uint8Array(Ma);
        if (Da) return Da(Db);
        throw "both async and sync fetching of the wasm failed";
      } catch (a) {
        Ia(a);
      }
    }
    function Hb() {
      return Ma || (!xa && !ya) || "function" !== typeof fetch || Bb("file://")
        ? new Promise(function (a) {
          a(Gb());
        })
        : fetch(Db, { credentials: "same-origin" })
          .then(function (a) {
            if (!a.ok) {
              throw "failed to load wasm binary file at '" + Db + "'";
            }
            return a.arrayBuffer();
          })
          .catch(function () {
            return Gb();
          });
    }
    sb.push({
      Ih: function () {
        Ib();
      },
    });
    function Jb(a) {
      this.If = a - 16;
      this.gi = function (b) {
        K[(this.If + 8) >> 2] = b;
      };
      this.di = function (b) {
        K[(this.If + 0) >> 2] = b;
      };
      this.ei = function () {
        K[(this.If + 4) >> 2] = 0;
      };
      this.ci = function () {
        hb[(this.If + 12) >> 0] = 0;
      };
      this.fi = function () {
        hb[(this.If + 13) >> 0] = 0;
      };
      this.Ph = function (b, c) {
        this.gi(b);
        this.di(c);
        this.ei();
        this.ci();
        this.fi();
      };
    }
    function Kb() {
      return 0 < Kb.mh;
    }
    var Lb = {},
      Mb = [null, [], []],
      Nb = {},
      Ob = {};
    function Pb(a) {
      for (; a.length;) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function Qb(a) {
      return this.fromWireType(mb[a >> 2]);
    }
    var Rb = {},
      Sb = {},
      Tb = {};
    function Ub(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? "_" + a : a;
    }
    function Vb(name, body) {
      name = Ub(name);
      return (function (body) {
        const res = function () {
          "use strict";
          return body.apply(this, arguments);
        };
        Object.defineProperty(res, "name", { value: name });
        return res;
      })(body);
    }
    function Wb(a) {
      var b = Error,
        c = Vb(a, function (d) {
          this.name = a;
          this.message = d;
          d = Error(d).stack;
          void 0 !== d &&
            (this.stack = this.toString() + "\n" +
              d.replace(/^Error(:[^\n]*)?\n/, ""));
        });
      c.prototype = Object.create(b.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message
          ? this.name
          : this.name + ": " + this.message;
      };
      return c;
    }
    var Xb = void 0;
    function Yb(a) {
      throw new Xb(a);
    }
    function Zb(a, b, c) {
      function d(u) {
        u = c(u);
        u.length !== a.length && Yb("Mismatched type converter count");
        for (var y = 0; y < a.length; ++y) $b(a[y], u[y]);
      }
      a.forEach(function (u) {
        Tb[u] = b;
      });
      var h = Array(b.length),
        m = [],
        q = 0;
      b.forEach(function (u, y) {
        Sb.hasOwnProperty(u)
          ? (h[y] = Sb[u])
          : (m.push(u),
            Rb.hasOwnProperty(u) || (Rb[u] = []),
            Rb[u].push(function () {
              h[y] = Sb[u];
              ++q;
              q === m.length && d(h);
            }));
      });
      0 === m.length && d(h);
    }
    var ac = {};
    function bc(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + a);
      }
    }
    var cc = void 0;
    function dc(a) {
      for (var b = ""; v[a];) b += cc[v[a++]];
      return b;
    }
    var lc = void 0;
    function W(a) {
      throw new lc(a);
    }
    function $b(a, b, c) {
      c = c || {};
      if (!("argPackAdvance" in b)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance",
        );
      }
      var d = b.name;
      a || W('type "' + d + '" must have a positive integer typeid pointer');
      if (Sb.hasOwnProperty(a)) {
        if (c.Oh) return;
        W("Cannot register type '" + d + "' twice");
      }
      Sb[a] = b;
      delete Tb[a];
      Rb.hasOwnProperty(a) &&
        ((b = Rb[a]),
          delete Rb[a],
          b.forEach(function (h) {
            h();
          }));
    }
    function mc(a) {
      return {
        count: a.count,
        yg: a.yg,
        Lg: a.Lg,
        If: a.If,
        Pf: a.Pf,
        Xf: a.Xf,
        $f: a.$f,
      };
    }
    function nc(a) {
      W(a.Ef.Pf.Jf.name + " instance already deleted");
    }
    var oc = !1;
    function pc() {}
    function qc(a) {
      --a.count.value;
      0 === a.count.value && (a.Xf ? a.$f.Zf(a.Xf) : a.Pf.Jf.Zf(a.If));
    }
    function rc(a) {
      if ("undefined" === typeof FinalizationGroup) {
        return (
          (rc = function (b) {
            return b;
          }), a
        );
      }
      oc = new FinalizationGroup(function (b) {
        for (var c = b.next(); !c.done; c = b.next()) {
          (c = c.value),
            c.If ? qc(c) : console.warn("object already deleted: " + c.If);
        }
      });
      rc = function (b) {
        oc.register(b, b.Ef, b.Ef);
        return b;
      };
      pc = function (b) {
        oc.unregister(b.Ef);
      };
      return rc(a);
    }
    var sc = void 0,
      tc = [];
    function uc() {
      for (; tc.length;) {
        var a = tc.pop();
        a.Ef.yg = !1;
        a["delete"]();
      }
    }
    function vc() {}
    var wc = {};
    function xc(a, b, c) {
      if (void 0 === a[b].Rf) {
        var d = a[b];
        a[b] = function () {
          a[b].Rf.hasOwnProperty(arguments.length) ||
            W(
              "Function '" +
                c +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                a[b].Rf +
                ")!",
            );
          return a[b].Rf[arguments.length].apply(this, arguments);
        };
        a[b].Rf = [];
        a[b].Rf[d.wg] = d;
      }
    }
    function yc(a, b, c) {
      f.hasOwnProperty(a)
        ? ((void 0 === c || (void 0 !== f[a].Rf && void 0 !== f[a].Rf[c])) &&
          W("Cannot register public name '" + a + "' twice"),
          xc(f, a, a),
          f.hasOwnProperty(c) &&
          W(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              c +
              ")!",
          ),
          (f[a].Rf[c] = b))
        : ((f[a] = b), void 0 !== c && (f[a].Ci = c));
    }
    function zc(a, b, c, d, h, m, q, u) {
      this.name = a;
      this.constructor = b;
      this.zg = c;
      this.Zf = d;
      this.bg = h;
      this.Lh = m;
      this.Og = q;
      this.Eh = u;
      this.$h = [];
    }
    function Ac(a, b, c) {
      for (; b !== c;) {
        b.Og ||
        W(
          "Expected null or instance of " +
            c.name +
            ", got an instance of " +
            b.name,
        ),
          (a = b.Og(a)),
          (b = b.bg);
      }
      return a;
    }
    function Bc(a, b) {
      if (null === b) {
        return this.gh && W("null is not a valid " + this.name), 0;
      }
      b.Ef || W('Cannot pass "' + Cc(b) + '" as a ' + this.name);
      b.Ef.If ||
        W("Cannot pass deleted object as a pointer of type " + this.name);
      return Ac(b.Ef.If, b.Ef.Pf.Jf, this.Jf);
    }
    function Dc(a, b) {
      if (null === b) {
        this.gh && W("null is not a valid " + this.name);
        if (this.Tg) {
          var c = this.Mg();
          null !== a && a.push(this.Zf, c);
          return c;
        }
        return 0;
      }
      b.Ef || W('Cannot pass "' + Cc(b) + '" as a ' + this.name);
      b.Ef.If ||
        W("Cannot pass deleted object as a pointer of type " + this.name);
      !this.Sg &&
        b.Ef.Pf.Sg &&
        W(
          "Cannot convert argument of type " +
            (b.Ef.$f ? b.Ef.$f.name : b.Ef.Pf.name) +
            " to parameter type " +
            this.name,
        );
      c = Ac(b.Ef.If, b.Ef.Pf.Jf, this.Jf);
      if (this.Tg) {
        switch (
          (void 0 === b.Ef.Xf &&
            W("Passing raw pointer to smart pointer is illegal"),
            this.hi)
        ) {
          case 0:
            b.Ef.$f === this ? (c = b.Ef.Xf) : W(
              "Cannot convert argument of type " +
                (b.Ef.$f ? b.Ef.$f.name : b.Ef.Pf.name) +
                " to parameter type " +
                this.name,
            );
            break;
          case 1:
            c = b.Ef.Xf;
            break;
          case 2:
            if (b.Ef.$f === this) c = b.Ef.Xf;
            else {
              var d = b.clone();
              c = this.ai(
                c,
                Ec(function () {
                  d["delete"]();
                }),
              );
              null !== a && a.push(this.Zf, c);
            }
            break;
          default:
            W("Unsupporting sharing policy");
        }
      }
      return c;
    }
    function Fc(a, b) {
      if (null === b) {
        return this.gh && W("null is not a valid " + this.name), 0;
      }
      b.Ef || W('Cannot pass "' + Cc(b) + '" as a ' + this.name);
      b.Ef.If ||
        W("Cannot pass deleted object as a pointer of type " + this.name);
      b.Ef.Pf.Sg &&
        W(
          "Cannot convert argument of type " +
            b.Ef.Pf.name +
            " to parameter type " +
            this.name,
        );
      return Ac(b.Ef.If, b.Ef.Pf.Jf, this.Jf);
    }
    function Gc(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.bg) return null;
      a = Gc(a, b, c.bg);
      return null === a ? null : c.Eh(a);
    }
    var Hc = {};
    function Ic(a, b) {
      for (void 0 === b && W("ptr should not be undefined"); a.bg;) {
        (b = a.Og(b)), (a = a.bg);
      }
      return Hc[b];
    }
    function Jc(a, b) {
      (b.Pf && b.If) || Yb("makeClassHandle requires ptr and ptrType");
      !!b.$f !== !!b.Xf &&
        Yb("Both smartPtrType and smartPtr must be specified");
      b.count = { value: 1 };
      return rc(Object.create(a, { Ef: { value: b } }));
    }
    function Kc(a, b, c, d, h, m, q, u, y, E, I) {
      this.name = a;
      this.Jf = b;
      this.gh = c;
      this.Sg = d;
      this.Tg = h;
      this.Zh = m;
      this.hi = q;
      this.sh = u;
      this.Mg = y;
      this.ai = E;
      this.Zf = I;
      h || void 0 !== b.bg
        ? (this.toWireType = Dc)
        : ((this.toWireType = d ? Bc : Fc), (this.Wf = null));
    }
    function Lc(a, b, c) {
      f.hasOwnProperty(a) || Yb("Replacing nonexistant public symbol");
      void 0 !== f[a].Rf && void 0 !== c
        ? (f[a].Rf[c] = b)
        : ((f[a] = b), (f[a].wg = c));
    }
    function Uc(a, b) {
      a = dc(a);
      var c = f["dynCall_" + a];
      for (var d = [], h = 1; h < a.length; ++h) d.push("a" + h);
      c = (function (dynCall, rawFunction) {
        const res = function dynCall_impl() {
          return dynCall(rawFunction, ...arguments);
        };
        Object.defineProperty(res, "name", { value: `dynCall_${a}_${b}` });
        return res;
      })(c, b);
      "function" !== typeof c &&
        W("unknown function pointer with signature " + a + ": " + b);
      return c;
    }
    var Vc = void 0;
    function Wc(a) {
      a = Xc(a);
      var b = dc(a);
      Yc(a);
      return b;
    }
    function Zc(a, b) {
      function c(m) {
        h[m] || Sb[m] || (Tb[m] ? Tb[m].forEach(c) : (d.push(m), (h[m] = !0)));
      }
      var d = [],
        h = {};
      b.forEach(c);
      throw new Vc(a + ": " + d.map(Wc).join([", "]));
    }
    function $c(a) {
      var b = Function;
      if (!(b instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof b +
            " which is not a function",
        );
      }
      var c = Vb(b.name || "unknownFunctionName", function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function ad(a, b, c, d, h) {
      var m = b.length;
      2 > m &&
        W(
          "argTypes array size mismatch! Must at least get return value and 'this' types!",
        );
      var q = null !== b[1] && null !== c,
        u = !1;
      for (c = 1; c < b.length; ++c) {
        if (null !== b[c] && void 0 === b[c].Wf) {
          u = !0;
          break;
        }
      }
      var y = "void" !== b[0].name,
        E = "",
        I = "";
      for (c = 0; c < m - 2; ++c) {
        (E += (0 !== c ? ", " : "") + "arg" + c),
          (I += (0 !== c ? ", " : "") + "arg" + c + "Wired");
      }
      a = "return function " +
        Ub(a) +
        "(" +
        E +
        ") {\nif (arguments.length !== " +
        (m - 2) +
        ") {\nthrowBindingError('function " +
        a +
        " called with ' + arguments.length + ' arguments, expected " +
        (m - 2) +
        " args!');\n}\n";
      u && (a += "var destructors = [];\n");
      var N = u ? "destructors" : "null";
      E = "throwBindingError invoker fn runDestructors retType classParam"
        .split(
          " ",
        );
      d = [W, d, h, Pb, b[0], b[1]];
      q && (a += "var thisWired = classParam.toWireType(" + N + ", this);\n");
      for (c = 0; c < m - 2; ++c) {
        (a += "var arg" +
          c +
          "Wired = argType" +
          c +
          ".toWireType(" +
          N +
          ", arg" +
          c +
          "); // " +
          b[c + 2].name +
          "\n"),
          E.push("argType" + c),
          d.push(b[c + 2]);
      }
      q && (I = "thisWired" + (0 < I.length ? ", " : "") + I);
      a += (y ? "var rv = " : "") +
        "invoker(fn" +
        (0 < I.length ? ", " : "") +
        I +
        ");\n";
      if (u) a += "runDestructors(destructors);\n";
      else {
        for (c = q ? 1 : 2; c < b.length; ++c) {
          (m = 1 === c ? "thisWired" : "arg" + (c - 2) + "Wired"),
            null !== b[c].Wf &&
            ((a += m + "_dtor(" + m + "); // " + b[c].name + "\n"),
              E.push(m + "_dtor"),
              d.push(b[c].Wf));
        }
      }
      y && (a += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
      E.push(a + "}\n");
      return $c(E).apply(null, d);
    }
    function bd(a, b) {
      for (var c = [], d = 0; d < a; d++) c.push(K[(b >> 2) + d]);
      return c;
    }
    var cd = [],
      dd = [
        {},
        { value: void 0 },
        { value: null },
        { value: !0 },
        {
          value: !1,
        },
      ];
    function ed(a) {
      4 < a && 0 === --dd[a].ih && ((dd[a] = void 0), cd.push(a));
    }
    function Ec(a) {
      switch (a) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          var b = cd.length ? cd.pop() : dd.length;
          dd[b] = { ih: 1, value: a };
          return b;
      }
    }
    function fd(a, b, c) {
      switch (b) {
        case 0:
          return function (d) {
            return this.fromWireType((c ? hb : v)[d]);
          };
        case 1:
          return function (d) {
            return this.fromWireType((c ? ab : $a)[d >> 1]);
          };
        case 2:
          return function (d) {
            return this.fromWireType((c ? K : mb)[d >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    function gd(a, b) {
      var c = Sb[a];
      void 0 === c && W(b + " has unknown type " + Wc(a));
      return c;
    }
    function Cc(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b
        ? a.toString()
        : "" + a;
    }
    function hd(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(S[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(nb[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }
    function id(a, b, c) {
      switch (b) {
        case 0:
          return c
            ? function (d) {
              return hb[d];
            }
            : function (d) {
              return v[d];
            };
        case 1:
          return c
            ? function (d) {
              return ab[d >> 1];
            }
            : function (d) {
              return $a[d >> 1];
            };
        case 2:
          return c
            ? function (d) {
              return K[d >> 2];
            }
            : function (d) {
              return mb[d >> 2];
            };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    var jd = {};
    function kd(a) {
      var b = jd[a];
      return void 0 === b ? dc(a) : b;
    }
    var ld = [];
    function md(a) {
      var b = ld.length;
      ld.push(a);
      return b;
    }
    function nd(a, b) {
      for (var c = Array(a), d = 0; d < a; ++d) {
        c[d] = gd(K[(b >> 2) + d], "parameter " + d);
      }
      return c;
    }
    var od;
    za
      ? (od = function () {
        var a = process.hrtime();
        return 1e3 * a[0] + a[1] / 1e6;
      })
      : "undefined" !== typeof dateNow
      ? (od = dateNow)
      : (od = function () {
        return performance.now();
      });
    function pd(a) {
      var b = a.getExtension("ANGLE_instanced_arrays");
      b &&
        ((a.vertexAttribDivisor = function (c, d) {
          b.vertexAttribDivisorANGLE(c, d);
        }),
          (a.drawArraysInstanced = function (c, d, h, m) {
            b.drawArraysInstancedANGLE(c, d, h, m);
          }),
          (a.drawElementsInstanced = function (c, d, h, m, q) {
            b.drawElementsInstancedANGLE(c, d, h, m, q);
          }));
    }
    function qd(a) {
      var b = a.getExtension("OES_vertex_array_object");
      b &&
        ((a.createVertexArray = function () {
          return b.createVertexArrayOES();
        }),
          (a.deleteVertexArray = function (c) {
            b.deleteVertexArrayOES(c);
          }),
          (a.bindVertexArray = function (c) {
            b.bindVertexArrayOES(c);
          }),
          (a.isVertexArray = function (c) {
            return b.isVertexArrayOES(c);
          }));
    }
    function rd(a) {
      var b = a.getExtension("WEBGL_draw_buffers");
      b &&
        (a.drawBuffers = function (c, d) {
          b.drawBuffersWEBGL(c, d);
        });
    }
    var sd = 1,
      td = [],
      ud = [],
      vd = [],
      wd = [],
      xd = [],
      X = [],
      yd = [],
      zd = [],
      ha = [],
      Ad = [],
      Bd = [],
      Cd = {},
      Dd = {},
      Ed = {},
      Fd = 4;
    function Gd(a) {
      Hd || (Hd = a);
    }
    function fa(a) {
      for (var b = sd++, c = a.length; c < b; c++) a[c] = null;
      return b;
    }
    function ka(a) {
      Id = ha[a];
      f.wi = Y = Id && Id.nh;
      return !(a && !Y);
    }
    function ja(a) {
      a || (a = Id);
      if (!a.Qh) {
        a.Qh = !0;
        var b = a.nh;
        pd(b);
        qd(b);
        rd(b);
        b.xi = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
        b.yi = b.getExtension("EXT_disjoint_timer_query");
        b.Bi = b.getExtension("WEBGL_multi_draw");
        var c =
          "OES_texture_float OES_texture_half_float OES_standard_derivatives OES_vertex_array_object WEBGL_compressed_texture_s3tc WEBGL_depth_texture OES_element_index_uint EXT_texture_filter_anisotropic EXT_frag_depth WEBGL_draw_buffers ANGLE_instanced_arrays OES_texture_float_linear OES_texture_half_float_linear EXT_blend_minmax EXT_shader_texture_lod EXT_texture_norm16 WEBGL_compressed_texture_pvrtc EXT_color_buffer_half_float WEBGL_color_buffer_float EXT_sRGB WEBGL_compressed_texture_etc1 EXT_disjoint_timer_query WEBGL_compressed_texture_etc WEBGL_compressed_texture_astc EXT_color_buffer_float WEBGL_compressed_texture_s3tc_srgb EXT_disjoint_timer_query_webgl2 WEBKIT_WEBGL_compressed_texture_pvrtc"
            .split(
              " ",
            );
        (b.getSupportedExtensions() || []).forEach(function (d) {
          -1 != c.indexOf(d) && b.getExtension(d);
        });
      }
    }
    var Hd,
      Id,
      Jd = [];
    function Kd(a, b, c, d) {
      for (var h = 0; h < a; h++) {
        var m = Y[c](),
          q = m && fa(d);
        m ? ((m.name = q), (d[q] = m)) : Gd(1282);
        K[(b + 4 * h) >> 2] = q;
      }
    }
    function Ld(a, b) {
      if (b) {
        var c = void 0;
        switch (a) {
          case 36346:
            c = 1;
            break;
          case 36344:
            return;
          case 34814:
          case 36345:
            c = 0;
            break;
          case 34466:
            var d = Y.getParameter(34467);
            c = d ? d.length : 0;
            break;
          case 33309:
            if (2 > Id.version) {
              Gd(1282);
              return;
            }
            c = 2 * (Y.getSupportedExtensions() || []).length;
            break;
          case 33307:
          case 33308:
            if (2 > Id.version) {
              Gd(1280);
              return;
            }
            c = 33307 == a ? 3 : 0;
        }
        if (void 0 === c) {
          switch (((d = Y.getParameter(a)), typeof d)) {
            case "number":
              c = d;
              break;
            case "boolean":
              c = d ? 1 : 0;
              break;
            case "string":
              Gd(1280);
              return;
            case "object":
              if (null === d) {
                switch (a) {
                  case 34964:
                  case 35725:
                  case 34965:
                  case 36006:
                  case 36007:
                  case 32873:
                  case 34229:
                  case 36662:
                  case 36663:
                  case 35053:
                  case 35055:
                  case 36010:
                  case 35097:
                  case 35869:
                  case 32874:
                  case 36389:
                  case 35983:
                  case 35368:
                  case 34068:
                    c = 0;
                    break;
                  default:
                    Gd(1280);
                    return;
                }
              } else {
                if (
                  d instanceof Float32Array ||
                  d instanceof Uint32Array ||
                  d instanceof Int32Array ||
                  d instanceof Array
                ) {
                  for (a = 0; a < d.length; ++a) K[(b + 4 * a) >> 2] = d[a];
                  return;
                }
                try {
                  c = d.name | 0;
                } catch (h) {
                  Gd(1280);
                  Ka(
                    "GL_INVALID_ENUM in glGet0v: Unknown object returned from WebGL getParameter(" +
                      a +
                      ")! (error: " +
                      h +
                      ")",
                  );
                  return;
                }
              }
              break;
            default:
              Gd(1280);
              Ka(
                "GL_INVALID_ENUM in glGet0v: Native code calling glGet0v(" +
                  a +
                  ") and it returns " +
                  d +
                  " of type " +
                  typeof d +
                  "!",
              );
              return;
          }
        }
        K[b >> 2] = c;
      } else Gd(1281);
    }
    function Md(a) {
      var b = la(a) + 1,
        c = Nd(b);
      na(a, v, c, b);
      return c;
    }
    function Od(a) {
      a -= 5120;
      return 0 == a
        ? hb
        : 1 == a
        ? v
        : 2 == a
        ? ab
        : 4 == a
        ? K
        : 6 == a
        ? S
        : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
        ? mb
        : $a;
    }
    function Pd(a, b, c, d, h) {
      a = Od(a);
      var m = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
        q = Fd;
      return a.subarray(
        h >> m,
        (h +
          d *
            ((c *
                ({
                  5: 3,
                  6: 4,
                  8: 2,
                  29502: 3,
                  29504: 4,
                  26917: 2,
                  26918: 2,
                  29846: 3,
                  29847: 4,
                }[b - 6402] || 1) *
                (1 << m) +
              q -
              1) &
              -q)) >>
          m,
      );
    }
    var Qd = [],
      Rd = [],
      Sd = {};
    function Td() {
      if (!Ud) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: (
              ("object" === typeof navigator &&
                navigator.languages &&
                navigator.languages[0]) ||
              "C"
            ).replace("-", "_") + ".UTF-8",
            _: va || "./this.program",
          },
          b;
        for (b in Sd) a[b] = Sd[b];
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        Ud = c;
      }
      return Ud;
    }
    var Ud;
    function Vd(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    function Wd(a, b) {
      for (var c = 0, d = 0; d <= b; c += a[d++]);
      return c;
    }
    var Xd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Yd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Zd(a, b) {
      for (a = new Date(a.getTime()); 0 < b;) {
        var c = a.getMonth(),
          d = (Vd(a.getFullYear()) ? Xd : Yd)[c];
        if (b > d - a.getDate()) {
          (b -= d - a.getDate() + 1),
            a.setDate(1),
            11 > c
              ? a.setMonth(c + 1)
              : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
        } else {
          a.setDate(a.getDate() + b);
          break;
        }
      }
      return a;
    }
    function $d(a, b, c, d) {
      function h(z, R, T) {
        for (
          z = "number" === typeof z ? z.toString() : z || "";
          z.length < R;
        ) {
          z = T[0] + z;
        }
        return z;
      }
      function m(z, R) {
        return h(z, R, "0");
      }
      function q(z, R) {
        function T(ua) {
          return 0 > ua ? -1 : 0 < ua ? 1 : 0;
        }
        var da;
        0 === (da = T(z.getFullYear() - R.getFullYear())) &&
          0 === (da = T(z.getMonth() - R.getMonth())) &&
          (da = T(z.getDate() - R.getDate()));
        return da;
      }
      function u(z) {
        switch (z.getDay()) {
          case 0:
            return new Date(z.getFullYear() - 1, 11, 29);
          case 1:
            return z;
          case 2:
            return new Date(z.getFullYear(), 0, 3);
          case 3:
            return new Date(z.getFullYear(), 0, 2);
          case 4:
            return new Date(z.getFullYear(), 0, 1);
          case 5:
            return new Date(z.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(z.getFullYear() - 1, 11, 30);
        }
      }
      function y(z) {
        z = Zd(new Date(z.Tf + 1900, 0, 1), z.Wg);
        var R = new Date(z.getFullYear() + 1, 0, 4),
          T = u(new Date(z.getFullYear(), 0, 4));
        R = u(R);
        return 0 >= q(T, z)
          ? 0 >= q(R, z) ? z.getFullYear() + 1 : z.getFullYear()
          : z.getFullYear() - 1;
      }
      var E = K[(d + 40) >> 2];
      d = {
        pi: K[d >> 2],
        oi: K[(d + 4) >> 2],
        Ug: K[(d + 8) >> 2],
        Ng: K[(d + 12) >> 2],
        Ag: K[(d + 16) >> 2],
        Tf: K[(d + 20) >> 2],
        Vg: K[(d + 24) >> 2],
        Wg: K[(d + 28) >> 2],
        Ei: K[(d + 32) >> 2],
        ni: K[(d + 36) >> 2],
        ri: E ? Ta(E) : "",
      };
      c = Ta(c);
      E = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var I in E) c = c.replace(new RegExp(I, "g"), E[I]);
      var N = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " ",
        ),
        Q =
          "January February March April May June July August September October November December"
            .split(
              " ",
            );
      E = {
        "%a": function (z) {
          return N[z.Vg].substring(0, 3);
        },
        "%A": function (z) {
          return N[z.Vg];
        },
        "%b": function (z) {
          return Q[z.Ag].substring(0, 3);
        },
        "%B": function (z) {
          return Q[z.Ag];
        },
        "%C": function (z) {
          return m(((z.Tf + 1900) / 100) | 0, 2);
        },
        "%d": function (z) {
          return m(z.Ng, 2);
        },
        "%e": function (z) {
          return h(z.Ng, 2, " ");
        },
        "%g": function (z) {
          return y(z).toString().substring(2);
        },
        "%G": function (z) {
          return y(z);
        },
        "%H": function (z) {
          return m(z.Ug, 2);
        },
        "%I": function (z) {
          z = z.Ug;
          0 == z ? (z = 12) : 12 < z && (z -= 12);
          return m(z, 2);
        },
        "%j": function (z) {
          return m(z.Ng + Wd(Vd(z.Tf + 1900) ? Xd : Yd, z.Ag - 1), 3);
        },
        "%m": function (z) {
          return m(z.Ag + 1, 2);
        },
        "%M": function (z) {
          return m(z.oi, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (z) {
          return 0 <= z.Ug && 12 > z.Ug ? "AM" : "PM";
        },
        "%S": function (z) {
          return m(z.pi, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (z) {
          return z.Vg || 7;
        },
        "%U": function (z) {
          var R = new Date(z.Tf + 1900, 0, 1),
            T = 0 === R.getDay() ? R : Zd(R, 7 - R.getDay());
          z = new Date(z.Tf + 1900, z.Ag, z.Ng);
          return 0 > q(T, z)
            ? m(
              Math.ceil(
                (31 -
                  T.getDate() +
                  (Wd(Vd(z.getFullYear()) ? Xd : Yd, z.getMonth() - 1) - 31) +
                  z.getDate()) /
                  7,
              ),
              2,
            )
            : 0 === q(T, R)
            ? "01"
            : "00";
        },
        "%V": function (z) {
          var R = new Date(z.Tf + 1901, 0, 4),
            T = u(new Date(z.Tf + 1900, 0, 4));
          R = u(R);
          var da = Zd(new Date(z.Tf + 1900, 0, 1), z.Wg);
          return 0 > q(da, T) ? "53" : 0 >= q(R, da) ? "01" : m(
            Math.ceil(
              (T.getFullYear() < z.Tf + 1900
                ? z.Wg + 32 - T.getDate()
                : z.Wg + 1 - T.getDate()) / 7,
            ),
            2,
          );
        },
        "%w": function (z) {
          return z.Vg;
        },
        "%W": function (z) {
          var R = new Date(z.Tf, 0, 1),
            T = 1 === R.getDay()
              ? R
              : Zd(R, 0 === R.getDay() ? 1 : 7 - R.getDay() + 1);
          z = new Date(z.Tf + 1900, z.Ag, z.Ng);
          return 0 > q(T, z)
            ? m(
              Math.ceil(
                (31 -
                  T.getDate() +
                  (Wd(Vd(z.getFullYear()) ? Xd : Yd, z.getMonth() - 1) - 31) +
                  z.getDate()) /
                  7,
              ),
              2,
            )
            : 0 === q(T, R)
            ? "01"
            : "00";
        },
        "%y": function (z) {
          return (z.Tf + 1900).toString().substring(2);
        },
        "%Y": function (z) {
          return z.Tf + 1900;
        },
        "%z": function (z) {
          z = z.ni;
          var R = 0 <= z;
          z = Math.abs(z) / 60;
          return (
            (R ? "+" : "-") +
            String("0000" + ((z / 60) * 100 + (z % 60))).slice(-4)
          );
        },
        "%Z": function (z) {
          return z.ri;
        },
        "%%": function () {
          return "%";
        },
      };
      for (I in E) {
        0 <= c.indexOf(I) && (c = c.replace(new RegExp(I, "g"), E[I](d)));
      }
      I = ae(c);
      if (I.length > b) return 0;
      hb.set(I, a);
      return I.length - 1;
    }
    Xb = f.InternalError = Wb("InternalError");
    for (var be = Array(256), ce = 0; 256 > ce; ++ce) {
      be[ce] = String.fromCharCode(ce);
    }
    cc = be;
    lc = f.BindingError = Wb("BindingError");
    vc.prototype.isAliasOf = function (a) {
      if (!(this instanceof vc && a instanceof vc)) return !1;
      var b = this.Ef.Pf.Jf,
        c = this.Ef.If,
        d = a.Ef.Pf.Jf;
      for (a = a.Ef.If; b.bg;) (c = b.Og(c)), (b = b.bg);
      for (; d.bg;) (a = d.Og(a)), (d = d.bg);
      return b === d && c === a;
    };
    vc.prototype.clone = function () {
      this.Ef.If || nc(this);
      if (this.Ef.Lg) return (this.Ef.count.value += 1), this;
      var a = rc(
        Object.create(Object.getPrototypeOf(this), {
          Ef: { value: mc(this.Ef) },
        }),
      );
      a.Ef.count.value += 1;
      a.Ef.yg = !1;
      return a;
    };
    vc.prototype["delete"] = function () {
      this.Ef.If || nc(this);
      this.Ef.yg && !this.Ef.Lg && W("Object already scheduled for deletion");
      pc(this);
      qc(this.Ef);
      this.Ef.Lg || ((this.Ef.Xf = void 0), (this.Ef.If = void 0));
    };
    vc.prototype.isDeleted = function () {
      return !this.Ef.If;
    };
    vc.prototype.deleteLater = function () {
      this.Ef.If || nc(this);
      this.Ef.yg && !this.Ef.Lg && W("Object already scheduled for deletion");
      tc.push(this);
      1 === tc.length && sc && sc(uc);
      this.Ef.yg = !0;
      return this;
    };
    Kc.prototype.Mh = function (a) {
      this.sh && (a = this.sh(a));
      return a;
    };
    Kc.prototype.qh = function (a) {
      this.Zf && this.Zf(a);
    };
    Kc.prototype.argPackAdvance = 8;
    Kc.prototype.readValueFromPointer = Qb;
    Kc.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    Kc.prototype.fromWireType = function (a) {
      function b() {
        return this.Tg
          ? Jc(this.Jf.zg, { Pf: this.Zh, If: c, $f: this, Xf: a })
          : Jc(this.Jf.zg, { Pf: this, If: a });
      }
      var c = this.Mh(a);
      if (!c) return this.qh(a), null;
      var d = Ic(this.Jf, c);
      if (void 0 !== d) {
        if (0 === d.Ef.count.value) {
          return (d.Ef.If = c), (d.Ef.Xf = a), d.clone();
        }
        d = d.clone();
        this.qh(a);
        return d;
      }
      d = this.Jf.Lh(c);
      d = wc[d];
      if (!d) return b.call(this);
      d = this.Sg ? d.Ch : d.pointerType;
      var h = Gc(c, this.Jf, d.Jf);
      return null === h
        ? b.call(this)
        : this.Tg
        ? Jc(d.Jf.zg, { Pf: d, If: h, $f: this, Xf: a })
        : Jc(d.Jf.zg, { Pf: d, If: h });
    };
    f.getInheritedInstanceCount = function () {
      return Object.keys(Hc).length;
    };
    f.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Hc) Hc.hasOwnProperty(b) && a.push(Hc[b]);
      return a;
    };
    f.flushPendingDeletes = uc;
    f.setDelayFunction = function (a) {
      sc = a;
      tc.length && sc && sc(uc);
    };
    Vc = f.UnboundTypeError = Wb("UnboundTypeError");
    f.count_emval_handles = function () {
      for (var a = 0, b = 5; b < dd.length; ++b) void 0 !== dd[b] && ++a;
      return a;
    };
    f.get_first_emval = function () {
      for (var a = 5; a < dd.length; ++a) if (void 0 !== dd[a]) return dd[a];
      return null;
    };
    for (var Y, de = 0; 32 > de; ++de) Jd.push(Array(de));
    var ee = new Float32Array(288);
    for (de = 0; 288 > de; ++de) Qd[de] = ee.subarray(0, de + 1);
    var fe = new Int32Array(288);
    for (de = 0; 288 > de; ++de) Rd[de] = fe.subarray(0, de + 1);
    function ae(a) {
      var b = Array(la(a) + 1);
      na(a, b, 0, b.length);
      return b;
    }
    var ze = {
      lb: function (a) {
        return Nd(a + 16) + 16;
      },
      jb: function (a, b, c) {
        new Jb(a).Ph(b, c);
        "uncaught_exception" in Kb ? Kb.mh++ : (Kb.mh = 1);
        throw a;
      },
      vb: function () {
        K[ge() >> 2] = 63;
        return -1;
      },
      M: function () {
        return 0;
      },
      Cb: function () {},
      xb: function () {
        return 0;
      },
      yb: function (a, b, c, d, h, m) {
        m <<= 12;
        0 !== (d & 16) && 0 !== a % 16384
          ? (b = -28)
          : 0 !== (d & 32)
          ? (a = he(16384, b))
            ? (ie(a, 0, b),
              (Lb[a] = {
                Xh: a,
                Wh: b,
                Bh: !0,
                fd: h,
                Di: c,
                flags: d,
                offset: m,
              }),
              (b = a))
            : (b = -48)
          : (b = -52);
        return b;
      },
      zb: function (a, b) {
        if (-1 === (a | 0) || 0 === b) a = -28;
        else {
          var c = Lb[a];
          c && b === c.Wh && ((Lb[a] = null), c.Bh && Yc(c.Xh));
          a = 0;
        }
        return a;
      },
      O: function () {},
      Ab: function () {},
      N: function () {},
      D: function (a) {
        var b = Ob[a];
        delete Ob[a];
        var c = b.elements,
          d = c.length,
          h = c
            .map(function (u) {
              return u.fh;
            })
            .concat(
              c.map(function (u) {
                return u.kh;
              }),
            ),
          m = b.Mg,
          q = b.Zf;
        Zb([a], h, function (u) {
          c.forEach(function (y, E) {
            var I = u[E],
              N = y.dh,
              Q = y.eh,
              z = u[E + d],
              R = y.jh,
              T = y.lh;
            y.read = function (da) {
              return I.fromWireType(N(Q, da));
            };
            y.write = function (da, ua) {
              var U = [];
              R(T, da, z.toWireType(U, ua));
              Pb(U);
            };
          });
          return [
            {
              name: b.name,
              fromWireType: function (y) {
                for (var E = Array(d), I = 0; I < d; ++I) {
                  E[I] = c[I].read(y);
                }
                q(y);
                return E;
              },
              toWireType: function (y, E) {
                if (d !== E.length) {
                  throw new TypeError(
                    "Incorrect number of tuple elements for " +
                      b.name +
                      ": expected=" +
                      d +
                      ", actual=" +
                      E.length,
                  );
                }
                for (var I = m(), N = 0; N < d; ++N) c[N].write(I, E[N]);
                null !== y && y.push(q, I);
                return I;
              },
              argPackAdvance: 8,
              readValueFromPointer: Qb,
              Wf: q,
            },
          ];
        });
      },
      v: function (a) {
        var b = ac[a];
        delete ac[a];
        var c = b.Mg,
          d = b.Zf,
          h = b.rh,
          m = h
            .map(function (q) {
              return q.fh;
            })
            .concat(
              h.map(function (q) {
                return q.kh;
              }),
            );
        Zb([a], m, function (q) {
          var u = {};
          h.forEach(function (y, E) {
            var I = q[E],
              N = y.dh,
              Q = y.eh,
              z = q[E + h.length],
              R = y.jh,
              T = y.lh;
            u[y.Gh] = {
              read: function (da) {
                return I.fromWireType(N(Q, da));
              },
              write: function (da, ua) {
                var U = [];
                R(T, da, z.toWireType(U, ua));
                Pb(U);
              },
            };
          });
          return [
            {
              name: b.name,
              fromWireType: function (y) {
                var E = {},
                  I;
                for (I in u) E[I] = u[I].read(y);
                d(y);
                return E;
              },
              toWireType: function (y, E) {
                for (var I in u) {
                  if (!(I in E)) {
                    throw new TypeError('Missing field:  "' + I + '"');
                  }
                }
                var N = c();
                for (I in u) u[I].write(N, E[I]);
                null !== y && y.push(d, N);
                return N;
              },
              argPackAdvance: 8,
              readValueFromPointer: Qb,
              Wf: d,
            },
          ];
        });
      },
      Eb: function (a, b, c, d, h) {
        var m = bc(c);
        b = dc(b);
        $b(a, {
          name: b,
          fromWireType: function (q) {
            return !!q;
          },
          toWireType: function (q, u) {
            return u ? d : h;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (q) {
            if (1 === c) var u = hb;
            else if (2 === c) u = ab;
            else if (4 === c) u = K;
            else throw new TypeError("Unknown boolean type size: " + b);
            return this.fromWireType(u[q >> m]);
          },
          Wf: null,
        });
      },
      k: function (a, b, c, d, h, m, q, u, y, E, I, N, Q) {
        I = dc(I);
        m = Uc(h, m);
        u && (u = Uc(q, u));
        E && (E = Uc(y, E));
        Q = Uc(N, Q);
        var z = Ub(I);
        yc(z, function () {
          Zc("Cannot construct " + I + " due to unbound types", [d]);
        });
        Zb([a, b, c], d ? [d] : [], function (R) {
          R = R[0];
          if (d) {
            var T = R.Jf;
            var da = T.zg;
          } else da = vc.prototype;
          R = Vb(z, function () {
            if (Object.getPrototypeOf(this) !== ua) {
              throw new lc("Use 'new' to construct " + I);
            }
            if (void 0 === U.ig) {
              throw new lc(I + " has no accessible constructor");
            }
            var Cb = U.ig[arguments.length];
            if (void 0 === Cb) {
              throw new lc(
                "Tried to invoke ctor of " +
                  I +
                  " with invalid number of parameters (" +
                  arguments.length +
                  ") - expected (" +
                  Object.keys(U.ig).toString() +
                  ") parameters instead!",
              );
            }
            return Cb.apply(this, arguments);
          });
          var ua = Object.create(da, { constructor: { value: R } });
          R.prototype = ua;
          var U = new zc(I, R, ua, Q, T, m, u, E);
          T = new Kc(I, U, !0, !1, !1);
          da = new Kc(I + "*", U, !1, !1, !1);
          var kb = new Kc(I + " const*", U, !1, !0, !1);
          wc[a] = { pointerType: da, Ch: kb };
          Lc(z, R);
          return [T, da, kb];
        });
      },
      j: function (a, b, c, d, h, m, q) {
        var u = bd(c, d);
        b = dc(b);
        m = Uc(h, m);
        Zb([], [a], function (y) {
          function E() {
            Zc("Cannot call " + I + " due to unbound types", u);
          }
          y = y[0];
          var I = y.name + "." + b,
            N = y.Jf.constructor;
          void 0 === N[b]
            ? ((E.wg = c - 1), (N[b] = E))
            : (xc(N, b, I), (N[b].Rf[c - 1] = E));
          Zb([], u, function (Q) {
            Q = [Q[0], null].concat(Q.slice(1));
            Q = ad(I, Q, null, m, q);
            void 0 === N[b].Rf
              ? ((Q.wg = c - 1), (N[b] = Q))
              : (N[b].Rf[c - 1] = Q);
            return [];
          });
          return [];
        });
      },
      u: function (a, b, c, d, h, m) {
        assert(0 < b);
        var q = bd(b, c);
        h = Uc(d, h);
        var u = [m],
          y = [];
        Zb([], [a], function (E) {
          E = E[0];
          var I = "constructor " + E.name;
          void 0 === E.Jf.ig && (E.Jf.ig = []);
          if (void 0 !== E.Jf.ig[b - 1]) {
            throw new lc(
              "Cannot register multiple constructors with identical number of parameters (" +
                (b - 1) +
                ") for class '" +
                E.name +
                "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
            );
          }
          E.Jf.ig[b - 1] = function () {
            Zc("Cannot construct " + E.name + " due to unbound types", q);
          };
          Zb([], q, function (N) {
            E.Jf.ig[b - 1] = function () {
              arguments.length !== b - 1 &&
                W(
                  I +
                    " called with " +
                    arguments.length +
                    " arguments, expected " +
                    (b - 1),
                );
              y.length = 0;
              u.length = b;
              for (var Q = 1; Q < b; ++Q) {
                u[Q] = N[Q].toWireType(y, arguments[Q - 1]);
              }
              Q = h.apply(null, u);
              Pb(y);
              return N[0].fromWireType(Q);
            };
            return [];
          });
          return [];
        });
      },
      c: function (a, b, c, d, h, m, q, u) {
        var y = bd(c, d);
        b = dc(b);
        m = Uc(h, m);
        Zb([], [a], function (E) {
          function I() {
            Zc("Cannot call " + N + " due to unbound types", y);
          }
          E = E[0];
          var N = E.name + "." + b;
          u && E.Jf.$h.push(b);
          var Q = E.Jf.zg,
            z = Q[b];
          void 0 === z ||
            (void 0 === z.Rf && z.className !== E.name && z.wg === c - 2)
            ? ((I.wg = c - 2), (I.className = E.name), (Q[b] = I))
            : (xc(Q, b, N), (Q[b].Rf[c - 2] = I));
          Zb([], y, function (R) {
            R = ad(N, R, E, m, q);
            void 0 === Q[b].Rf
              ? ((R.wg = c - 2), (Q[b] = R))
              : (Q[b].Rf[c - 2] = R);
            return [];
          });
          return [];
        });
      },
      U: function (a, b, c) {
        a = dc(a);
        Zb([], [b], function (d) {
          d = d[0];
          f[a] = d.fromWireType(c);
          return [];
        });
      },
      Db: function (a, b) {
        b = dc(b);
        $b(a, {
          name: b,
          fromWireType: function (c) {
            var d = dd[c].value;
            ed(c);
            return d;
          },
          toWireType: function (c, d) {
            return Ec(d);
          },
          argPackAdvance: 8,
          readValueFromPointer: Qb,
          Wf: null,
        });
      },
      n: function (a, b, c, d) {
        function h() {}
        c = bc(c);
        b = dc(b);
        h.values = {};
        $b(a, {
          name: b,
          constructor: h,
          fromWireType: function (m) {
            return this.constructor.values[m];
          },
          toWireType: function (m, q) {
            return q.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: fd(b, c, d),
          Wf: null,
        });
        yc(b, h);
      },
      m: function (a, b, c) {
        var d = gd(a, "enum");
        b = dc(b);
        a = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: { value: c },
          constructor: { value: Vb(d.name + "_" + b, function () {}) },
        });
        a.values[c] = d;
        a[b] = d;
      },
      P: function (a, b, c) {
        c = bc(c);
        b = dc(b);
        $b(a, {
          name: b,
          fromWireType: function (d) {
            return d;
          },
          toWireType: function (d, h) {
            if ("number" !== typeof h && "boolean" !== typeof h) {
              throw new TypeError(
                'Cannot convert "' + Cc(h) + '" to ' + this.name,
              );
            }
            return h;
          },
          argPackAdvance: 8,
          readValueFromPointer: hd(b, c),
          Wf: null,
        });
      },
      o: function (a, b, c, d, h, m) {
        var q = bd(b, c);
        a = dc(a);
        h = Uc(d, h);
        yc(
          a,
          function () {
            Zc("Cannot call " + a + " due to unbound types", q);
          },
          b - 1,
        );
        Zb([], q, function (u) {
          u = [u[0], null].concat(u.slice(1));
          Lc(a, ad(a, u, null, h, m), b - 1);
          return [];
        });
      },
      y: function (a, b, c, d, h) {
        function m(E) {
          return E;
        }
        b = dc(b);
        -1 === h && (h = 4294967295);
        var q = bc(c);
        if (0 === d) {
          var u = 32 - 8 * c;
          m = function (E) {
            return (E << u) >>> u;
          };
        }
        var y = -1 != b.indexOf("unsigned");
        $b(a, {
          name: b,
          fromWireType: m,
          toWireType: function (E, I) {
            if ("number" !== typeof I && "boolean" !== typeof I) {
              throw new TypeError(
                'Cannot convert "' + Cc(I) + '" to ' + this.name,
              );
            }
            if (I < d || I > h) {
              throw new TypeError(
                'Passing a number "' +
                  Cc(I) +
                  '" from JS side to C/C++ side to an argument of type "' +
                  b +
                  '", which is outside the valid range [' +
                  d +
                  ", " +
                  h +
                  "]!",
              );
            }
            return y ? I >>> 0 : I | 0;
          },
          argPackAdvance: 8,
          readValueFromPointer: id(b, q, 0 !== d),
          Wf: null,
        });
      },
      w: function (a, b, c) {
        function d(m) {
          m >>= 2;
          var q = mb;
          return new h(gb, q[m + 1], q[m]);
        }
        var h = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][b];
        c = dc(c);
        $b(
          a,
          {
            name: c,
            fromWireType: d,
            argPackAdvance: 8,
            readValueFromPointer: d,
          },
          { Oh: !0 },
        );
      },
      q: function (a, b, c, d, h, m, q, u, y, E, I, N) {
        c = dc(c);
        m = Uc(h, m);
        u = Uc(q, u);
        E = Uc(y, E);
        N = Uc(I, N);
        Zb([a], [b], function (Q) {
          Q = Q[0];
          return [new Kc(c, Q.Jf, !1, !1, !0, Q, d, m, u, E, N)];
        });
      },
      Q: function (a, b) {
        b = dc(b);
        var c = "std::string" === b;
        $b(a, {
          name: b,
          fromWireType: function (d) {
            var h = mb[d >> 2];
            if (c) {
              for (var m = d + 4, q = 0; q <= h; ++q) {
                var u = d + 4 + q;
                if (q == h || 0 == v[u]) {
                  m = Ta(m, u - m);
                  if (void 0 === y) var y = m;
                  else (y += String.fromCharCode(0)), (y += m);
                  m = u + 1;
                }
              }
            } else {
              y = Array(h);
              for (q = 0; q < h; ++q) {
                y[q] = String.fromCharCode(v[d + 4 + q]);
              }
              y = y.join("");
            }
            Yc(d);
            return y;
          },
          toWireType: function (d, h) {
            h instanceof ArrayBuffer && (h = new Uint8Array(h));
            var m = "string" === typeof h;
            m ||
              h instanceof Uint8Array ||
              h instanceof Uint8ClampedArray ||
              h instanceof Int8Array ||
              W("Cannot pass non-string to std::string");
            var q = (
                c && m
                  ? function () {
                    return la(h);
                  }
                  : function () {
                    return h.length;
                  }
              )(),
              u = Nd(4 + q + 1);
            mb[u >> 2] = q;
            if (c && m) na(h, v, u + 4, q + 1);
            else if (m) {
              for (m = 0; m < q; ++m) {
                var y = h.charCodeAt(m);
                255 < y &&
                  (Yc(u),
                    W("String has UTF-16 code units that do not fit in 8 bits"));
                v[u + 4 + m] = y;
              }
            } else for (m = 0; m < q; ++m) v[u + 4 + m] = h[m];
            null !== d && d.push(Yc, u);
            return u;
          },
          argPackAdvance: 8,
          readValueFromPointer: Qb,
          Wf: function (d) {
            Yc(d);
          },
        });
      },
      H: function (a, b, c) {
        c = dc(c);
        if (2 === b) {
          var d = Va;
          var h = bb;
          var m = cb;
          var q = function () {
            return $a;
          };
          var u = 1;
        } else {
          4 === b &&
            ((d = db),
              (h = eb),
              (m = fb),
              (q = function () {
                return mb;
              }),
              (u = 2));
        }
        $b(a, {
          name: c,
          fromWireType: function (y) {
            for (
              var E = mb[y >> 2], I = q(), N, Q = y + 4, z = 0;
              z <= E;
              ++z
            ) {
              var R = y + 4 + z * b;
              if (z == E || 0 == I[R >> u]) {
                (Q = d(Q, R - Q)),
                  void 0 === N
                    ? (N = Q)
                    : ((N += String.fromCharCode(0)), (N += Q)),
                  (Q = R + b);
              }
            }
            Yc(y);
            return N;
          },
          toWireType: function (y, E) {
            "string" !== typeof E &&
              W("Cannot pass non-string to C++ string type " + c);
            var I = m(E),
              N = Nd(4 + I + b);
            mb[N >> 2] = I >> u;
            h(E, N + 4, I + b);
            null !== y && y.push(Yc, N);
            return N;
          },
          argPackAdvance: 8,
          readValueFromPointer: Qb,
          Wf: function (y) {
            Yc(y);
          },
        });
      },
      F: function (a, b, c, d, h, m) {
        Ob[a] = { name: dc(b), Mg: Uc(c, d), Zf: Uc(h, m), elements: [] };
      },
      E: function (a, b, c, d, h, m, q, u, y) {
        Ob[a].elements.push({
          fh: b,
          dh: Uc(c, d),
          eh: h,
          kh: m,
          jh: Uc(q, u),
          lh: y,
        });
      },
      x: function (a, b, c, d, h, m) {
        ac[a] = { name: dc(b), Mg: Uc(c, d), Zf: Uc(h, m), rh: [] };
      },
      g: function (a, b, c, d, h, m, q, u, y, E) {
        ac[a].rh.push({
          Gh: dc(b),
          fh: c,
          dh: Uc(d, h),
          eh: m,
          kh: q,
          jh: Uc(u, y),
          lh: E,
        });
      },
      Fb: function (a, b) {
        b = dc(b);
        $b(a, {
          Rh: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      A: function (a, b, c, d) {
        a = ld[a];
        b || W("Cannot use deleted val. handle = " + b);
        b = dd[b].value;
        c = kd(c);
        a(b, c, null, d);
      },
      ea: ed,
      z: function (a, b) {
        b = nd(a, b);
        for (
          var c = b[0],
            d = c.name +
              "_$" +
              b
                .slice(1)
                .map(function (E) {
                  return E.name;
                })
                .join("_") +
              "$",
            h = ["retType"],
            m = [c],
            q = "",
            u = 0;
          u < a - 1;
          ++u
        ) {
          (q += (0 !== u ? ", " : "") + "arg" + u),
            h.push("argType" + u),
            m.push(b[1 + u]);
        }
        d = "return function " +
          Ub("methodCaller_" + d) +
          "(handle, name, destructors, args) {\n";
        var y = 0;
        for (u = 0; u < a - 1; ++u) {
          (d += "    var arg" +
            u +
            " = argType" +
            u +
            ".readValueFromPointer(args" +
            (y ? "+" + y : "") +
            ");\n"), (y += b[u + 1].argPackAdvance);
        }
        d += "    var rv = handle[name](" + q + ");\n";
        for (u = 0; u < a - 1; ++u) {
          b[u + 1].deleteObject &&
            (d += "    argType" + u + ".deleteObject(arg" + u + ");\n");
        }
        c.Rh || (d += "    return retType.toWireType(destructors, rv);\n");
        h.push(d + "};\n");
        a = $c(h).apply(null, m);
        return md(a);
      },
      mb: function (a) {
        4 < a && (dd[a].ih += 1);
      },
      pa: function () {
        return Ec([]);
      },
      Aa: function (a) {
        return Ec(kd(a));
      },
      C: function (a, b) {
        a = gd(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return Ec(a);
      },
      d: function () {
        Ia();
      },
      rb: function (a, b) {
        if (0 === a) a = Date.now();
        else if (1 === a || 4 === a) a = od();
        else return (K[ge() >> 2] = 28), -1;
        K[b >> 2] = (a / 1e3) | 0;
        K[(b + 4) >> 2] = ((a % 1e3) * 1e6) | 0;
        return 0;
      },
      Vc: function (a) {
        Y.activeTexture(a);
      },
      Wc: function (a, b) {
        Y.attachShader(ud[a], yd[b]);
      },
      Xc: function (a, b, c) {
        Y.bindAttribLocation(ud[a], b, Ta(c));
      },
      Yc: function (a, b) {
        35051 == a ? (Y.bh = b) : 35052 == a && (Y.xg = b);
        Y.bindBuffer(a, td[b]);
      },
      ac: function (a, b) {
        Y.bindFramebuffer(a, vd[b]);
      },
      bc: function (a, b) {
        Y.bindRenderbuffer(a, wd[b]);
      },
      Ob: function (a, b) {
        Y.bindSampler(a, Ad[b]);
      },
      Zc: function (a, b) {
        Y.bindTexture(a, xd[b]);
      },
      rc: function (a) {
        Y.bindVertexArray(zd[a]);
      },
      uc: function (a) {
        Y.bindVertexArray(zd[a]);
      },
      _c: function (a, b, c, d) {
        Y.blendColor(a, b, c, d);
      },
      $c: function (a) {
        Y.blendEquation(a);
      },
      W: function (a, b) {
        Y.blendFunc(a, b);
      },
      Vb: function (a, b, c, d, h, m, q, u, y, E) {
        Y.blitFramebuffer(a, b, c, d, h, m, q, u, y, E);
      },
      X: function (a, b, c, d) {
        2 <= Id.version
          ? c ? Y.bufferData(a, v, d, c, b) : Y.bufferData(a, b, d)
          : Y.bufferData(a, c ? v.subarray(c, c + b) : b, d);
      },
      Y: function (a, b, c, d) {
        2 <= Id.version
          ? Y.bufferSubData(a, b, v, d, c)
          : Y.bufferSubData(a, b, v.subarray(d, d + c));
      },
      cc: function (a) {
        return Y.checkFramebufferStatus(a);
      },
      Z: function (a) {
        Y.clear(a);
      },
      _: function (a, b, c, d) {
        Y.clearColor(a, b, c, d);
      },
      $: function (a) {
        Y.clearStencil(a);
      },
      eb: function (a, b, c, d) {
        return Y.clientWaitSync(Bd[a], b, (c >>> 0) + 4294967296 * d);
      },
      aa: function (a, b, c, d) {
        Y.colorMask(!!a, !!b, !!c, !!d);
      },
      ba: function (a) {
        Y.compileShader(yd[a]);
      },
      ca: function (a, b, c, d, h, m, q, u) {
        2 <= Id.version
          ? Y.xg
            ? Y.compressedTexImage2D(a, b, c, d, h, m, q, u)
            : Y.compressedTexImage2D(a, b, c, d, h, m, v, u, q)
          : Y.compressedTexImage2D(
            a,
            b,
            c,
            d,
            h,
            m,
            u ? v.subarray(u, u + q) : null,
          );
      },
      da: function (a, b, c, d, h, m, q, u, y) {
        2 <= Id.version
          ? Y.xg
            ? Y.compressedTexSubImage2D(a, b, c, d, h, m, q, u, y)
            : Y.compressedTexSubImage2D(a, b, c, d, h, m, q, v, y, u)
          : Y.compressedTexSubImage2D(
            a,
            b,
            c,
            d,
            h,
            m,
            q,
            y ? v.subarray(y, y + u) : null,
          );
      },
      fa: function (a, b, c, d, h, m, q, u) {
        Y.copyTexSubImage2D(a, b, c, d, h, m, q, u);
      },
      ga: function () {
        var a = fa(ud),
          b = Y.createProgram();
        b.name = a;
        ud[a] = b;
        return a;
      },
      ha: function (a) {
        var b = fa(yd);
        yd[b] = Y.createShader(a);
        return b;
      },
      ia: function (a) {
        Y.cullFace(a);
      },
      ja: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2],
            h = td[d];
          h &&
            (Y.deleteBuffer(h),
              (h.name = 0),
              (td[d] = null),
              d == Y.bh && (Y.bh = 0),
              d == Y.xg && (Y.xg = 0));
        }
      },
      dc: function (a, b) {
        for (var c = 0; c < a; ++c) {
          var d = K[(b + 4 * c) >> 2],
            h = vd[d];
          h && (Y.deleteFramebuffer(h), (h.name = 0), (vd[d] = null));
        }
      },
      ka: function (a) {
        if (a) {
          var b = ud[a];
          b
            ? (Y.deleteProgram(b), (b.name = 0), (ud[a] = null), (Cd[a] = null))
            : Gd(1281);
        }
      },
      ec: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2],
            h = wd[d];
          h && (Y.deleteRenderbuffer(h), (h.name = 0), (wd[d] = null));
        }
      },
      Pb: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2],
            h = Ad[d];
          h && (Y.deleteSampler(h), (h.name = 0), (Ad[d] = null));
        }
      },
      la: function (a) {
        if (a) {
          var b = yd[a];
          b ? (Y.deleteShader(b), (yd[a] = null)) : Gd(1281);
        }
      },
      Xb: function (a) {
        if (a) {
          var b = Bd[a];
          b ? (Y.deleteSync(b), (b.name = 0), (Bd[a] = null)) : Gd(1281);
        }
      },
      ma: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2],
            h = xd[d];
          h && (Y.deleteTexture(h), (h.name = 0), (xd[d] = null));
        }
      },
      sc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2];
          Y.deleteVertexArray(zd[d]);
          zd[d] = null;
        }
      },
      vc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var d = K[(b + 4 * c) >> 2];
          Y.deleteVertexArray(zd[d]);
          zd[d] = null;
        }
      },
      na: function (a) {
        Y.depthMask(!!a);
      },
      oa: function (a) {
        Y.disable(a);
      },
      qa: function (a) {
        Y.disableVertexAttribArray(a);
      },
      ra: function (a, b, c) {
        Y.drawArrays(a, b, c);
      },
      pc: function (a, b, c, d) {
        Y.drawArraysInstanced(a, b, c, d);
      },
      nc: function (a, b) {
        for (var c = Jd[a], d = 0; d < a; d++) c[d] = K[(b + 4 * d) >> 2];
        Y.drawBuffers(c);
      },
      sa: function (a, b, c, d) {
        Y.drawElements(a, b, c, d);
      },
      qc: function (a, b, c, d, h) {
        Y.drawElementsInstanced(a, b, c, d, h);
      },
      jc: function (a, b, c, d, h, m) {
        Y.drawElements(a, d, h, m);
      },
      ta: function (a) {
        Y.enable(a);
      },
      ua: function (a) {
        Y.enableVertexAttribArray(a);
      },
      Tb: function (a, b) {
        return (a = Y.fenceSync(a, b))
          ? ((b = fa(Bd)), (a.name = b), (Bd[b] = a), b)
          : 0;
      },
      va: function () {
        Y.finish();
      },
      wa: function () {
        Y.flush();
      },
      fc: function (a, b, c, d) {
        Y.framebufferRenderbuffer(a, b, c, wd[d]);
      },
      gc: function (a, b, c, d, h) {
        Y.framebufferTexture2D(a, b, c, xd[d], h);
      },
      xa: function (a) {
        Y.frontFace(a);
      },
      ya: function (a, b) {
        Kd(a, b, "createBuffer", td);
      },
      hc: function (a, b) {
        Kd(a, b, "createFramebuffer", vd);
      },
      ic: function (a, b) {
        Kd(a, b, "createRenderbuffer", wd);
      },
      Qb: function (a, b) {
        Kd(a, b, "createSampler", Ad);
      },
      za: function (a, b) {
        Kd(a, b, "createTexture", xd);
      },
      tc: function (a, b) {
        Kd(a, b, "createVertexArray", zd);
      },
      wc: function (a, b) {
        Kd(a, b, "createVertexArray", zd);
      },
      Yb: function (a) {
        Y.generateMipmap(a);
      },
      Ba: function (a, b, c) {
        c ? (K[c >> 2] = Y.getBufferParameter(a, b)) : Gd(1281);
      },
      Ca: function () {
        var a = Y.getError() || Hd;
        Hd = 0;
        return a;
      },
      Zb: function (a, b, c, d) {
        a = Y.getFramebufferAttachmentParameter(a, b, c);
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) {
          a = a.name | 0;
        }
        K[d >> 2] = a;
      },
      bb: function (a, b) {
        Ld(a, b);
      },
      Da: function (a, b, c, d) {
        a = Y.getProgramInfoLog(ud[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? na(a, v, d, b) : 0;
        c && (K[c >> 2] = b);
      },
      Ea: function (a, b, c) {
        if (c) {
          if (a >= sd) Gd(1281);
          else {
            var d = Cd[a];
            if (d) {
              if (35716 == b) {
                (a = Y.getProgramInfoLog(ud[a])),
                  null === a && (a = "(unknown error)"),
                  (K[c >> 2] = a.length + 1);
              } else if (35719 == b) K[c >> 2] = d.hh;
              else if (35722 == b) {
                if (-1 == d.Jg) {
                  a = ud[a];
                  var h = Y.getProgramParameter(a, 35721);
                  for (b = d.Jg = 0; b < h; ++b) {
                    d.Jg = Math.max(
                      d.Jg,
                      Y.getActiveAttrib(a, b).name.length + 1,
                    );
                  }
                }
                K[c >> 2] = d.Jg;
              } else if (35381 == b) {
                if (-1 == d.Kg) {
                  for (
                    a = ud[a],
                      h = Y.getProgramParameter(a, 35382),
                      b = d.Kg = 0;
                    b < h;
                    ++b
                  ) {
                    d.Kg = Math.max(
                      d.Kg,
                      Y.getActiveUniformBlockName(a, b).length + 1,
                    );
                  }
                }
                K[c >> 2] = d.Kg;
              } else K[c >> 2] = Y.getProgramParameter(ud[a], b);
            } else Gd(1282);
          }
        } else Gd(1281);
      },
      _b: function (a, b, c) {
        c ? (K[c >> 2] = Y.getRenderbufferParameter(a, b)) : Gd(1281);
      },
      Fa: function (a, b, c, d) {
        a = Y.getShaderInfoLog(yd[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? na(a, v, d, b) : 0;
        c && (K[c >> 2] = b);
      },
      Lb: function (a, b, c, d) {
        a = Y.getShaderPrecisionFormat(a, b);
        K[c >> 2] = a.rangeMin;
        K[(c + 4) >> 2] = a.rangeMax;
        K[d >> 2] = a.precision;
      },
      Ga: function (a, b, c) {
        c
          ? 35716 == b
            ? ((a = Y.getShaderInfoLog(yd[a])),
              null === a && (a = "(unknown error)"),
              (K[c >> 2] = a ? a.length + 1 : 0))
            : 35720 == b
            ? ((a = Y.getShaderSource(yd[a])),
              (K[c >> 2] = a ? a.length + 1 : 0))
            : (K[c >> 2] = Y.getShaderParameter(yd[a], b))
          : Gd(1281);
      },
      J: function (a) {
        if (Dd[a]) return Dd[a];
        switch (a) {
          case 7939:
            var b = Y.getSupportedExtensions() || [];
            b = b.concat(
              b.map(function (d) {
                return "GL_" + d;
              }),
            );
            b = Md(b.join(" "));
            break;
          case 7936:
          case 7937:
          case 37445:
          case 37446:
            (b = Y.getParameter(a)) || Gd(1280);
            b = Md(b);
            break;
          case 7938:
            b = Y.getParameter(7938);
            b = 2 <= Id.version
              ? "OpenGL ES 3.0 (" + b + ")"
              : "OpenGL ES 2.0 (" + b + ")";
            b = Md(b);
            break;
          case 35724:
            b = Y.getParameter(35724);
            var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
            null !== c &&
              (3 == c[1].length && (c[1] += "0"),
                (b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")"));
            b = Md(b);
            break;
          default:
            return Gd(1280), 0;
        }
        return (Dd[a] = b);
      },
      cb: function (a, b) {
        if (2 > Id.version) return Gd(1282), 0;
        var c = Ed[a];
        if (c) return 0 > b || b >= c.length ? (Gd(1281), 0) : c[b];
        switch (a) {
          case 7939:
            return (
              (c = Y.getSupportedExtensions() || []),
                (c = c.concat(
                  c.map(function (d) {
                    return "GL_" + d;
                  }),
                )),
                (c = c.map(function (d) {
                  return Md(d);
                })),
                (c = Ed[a] = c),
                0 > b || b >= c.length ? (Gd(1281), 0) : c[b]
            );
          default:
            return Gd(1280), 0;
        }
      },
      Ha: function (a, b) {
        b = Ta(b);
        var c = 0;
        if ("]" == b[b.length - 1]) {
          var d = b.lastIndexOf("[");
          c = "]" != b[d + 1] ? parseInt(b.slice(d + 1)) : 0;
          b = b.slice(0, d);
        }
        return (a = Cd[a] && Cd[a].th[b]) && 0 <= c && c < a[0] ? a[1] + c : -1;
      },
      Mb: function (a, b, c) {
        for (var d = Jd[b], h = 0; h < b; h++) d[h] = K[(c + 4 * h) >> 2];
        Y.invalidateFramebuffer(a, d);
      },
      Nb: function (a, b, c, d, h, m, q) {
        for (var u = Jd[b], y = 0; y < b; y++) u[y] = K[(c + 4 * y) >> 2];
        Y.invalidateSubFramebuffer(a, u, d, h, m, q);
      },
      Ub: function (a) {
        return Y.isSync(Bd[a]);
      },
      Ia: function (a) {
        return (a = xd[a]) ? Y.isTexture(a) : 0;
      },
      Ja: function (a) {
        Y.lineWidth(a);
      },
      Ka: function (a) {
        Y.linkProgram(ud[a]);
        var b = ud[a];
        a = Cd[a] = { th: {}, hh: 0, Jg: -1, Kg: -1 };
        for (
          var c = a.th, d = Y.getProgramParameter(b, 35718), h = 0;
          h < d;
          ++h
        ) {
          var m = Y.getActiveUniform(b, h),
            q = m.name;
          a.hh = Math.max(a.hh, q.length + 1);
          "]" == q.slice(-1) && (q = q.slice(0, q.lastIndexOf("[")));
          var u = Y.getUniformLocation(b, q);
          if (u) {
            var y = fa(X);
            c[q] = [m.size, y];
            X[y] = u;
            for (var E = 1; E < m.size; ++E) {
              (u = Y.getUniformLocation(b, q + "[" + E + "]")),
                (y = fa(X)),
                (X[y] = u);
            }
          }
        }
      },
      La: function (a, b) {
        3317 == a && (Fd = b);
        Y.pixelStorei(a, b);
      },
      oc: function (a) {
        Y.readBuffer(a);
      },
      Ma: function (a, b, c, d, h, m, q) {
        if (2 <= Id.version) {
          if (Y.bh) Y.readPixels(a, b, c, d, h, m, q);
          else {
            var u = Od(m);
            Y.readPixels(
              a,
              b,
              c,
              d,
              h,
              m,
              u,
              q >> (31 - Math.clz32(u.BYTES_PER_ELEMENT)),
            );
          }
        } else {
          (q = Pd(m, h, c, d, q))
            ? Y.readPixels(a, b, c, d, h, m, q)
            : Gd(1280);
        }
      },
      $b: function (a, b, c, d) {
        Y.renderbufferStorage(a, b, c, d);
      },
      Wb: function (a, b, c, d, h) {
        Y.renderbufferStorageMultisample(a, b, c, d, h);
      },
      Rb: function (a, b, c) {
        Y.samplerParameteri(Ad[a], b, c);
      },
      Sb: function (a, b, c) {
        Y.samplerParameteri(Ad[a], b, K[c >> 2]);
      },
      Na: function (a, b, c, d) {
        Y.scissor(a, b, c, d);
      },
      Oa: function (a, b, c, d) {
        for (var h = "", m = 0; m < b; ++m) {
          var q = d ? K[(d + 4 * m) >> 2] : -1;
          h += Ta(K[(c + 4 * m) >> 2], 0 > q ? void 0 : q);
        }
        Y.shaderSource(yd[a], h);
      },
      Pa: function (a, b, c) {
        Y.stencilFunc(a, b, c);
      },
      Qa: function (a, b, c, d) {
        Y.stencilFuncSeparate(a, b, c, d);
      },
      Ra: function (a) {
        Y.stencilMask(a);
      },
      Sa: function (a, b) {
        Y.stencilMaskSeparate(a, b);
      },
      Ta: function (a, b, c) {
        Y.stencilOp(a, b, c);
      },
      Ua: function (a, b, c, d) {
        Y.stencilOpSeparate(a, b, c, d);
      },
      Va: function (a, b, c, d, h, m, q, u, y) {
        if (2 <= Id.version) {
          if (Y.xg) Y.texImage2D(a, b, c, d, h, m, q, u, y);
          else if (y) {
            var E = Od(u);
            Y.texImage2D(
              a,
              b,
              c,
              d,
              h,
              m,
              q,
              u,
              E,
              y >> (31 - Math.clz32(E.BYTES_PER_ELEMENT)),
            );
          } else Y.texImage2D(a, b, c, d, h, m, q, u, null);
        } else {
          Y.texImage2D(a, b, c, d, h, m, q, u, y ? Pd(u, q, d, h, y) : null);
        }
      },
      Wa: function (a, b, c) {
        Y.texParameterf(a, b, c);
      },
      Xa: function (a, b, c) {
        Y.texParameterf(a, b, S[c >> 2]);
      },
      Ya: function (a, b, c) {
        Y.texParameteri(a, b, c);
      },
      Za: function (a, b, c) {
        Y.texParameteri(a, b, K[c >> 2]);
      },
      kc: function (a, b, c, d, h) {
        Y.texStorage2D(a, b, c, d, h);
      },
      _a: function (a, b, c, d, h, m, q, u, y) {
        if (2 <= Id.version) {
          if (Y.xg) Y.texSubImage2D(a, b, c, d, h, m, q, u, y);
          else if (y) {
            var E = Od(u);
            Y.texSubImage2D(
              a,
              b,
              c,
              d,
              h,
              m,
              q,
              u,
              E,
              y >> (31 - Math.clz32(E.BYTES_PER_ELEMENT)),
            );
          } else Y.texSubImage2D(a, b, c, d, h, m, q, u, null);
        } else {
          (E = null),
            y && (E = Pd(u, q, h, m, y)),
            Y.texSubImage2D(a, b, c, d, h, m, q, u, E);
        }
      },
      $a: function (a, b) {
        Y.uniform1f(X[a], b);
      },
      ab: function (a, b, c) {
        if (2 <= Id.version) Y.uniform1fv(X[a], S, c >> 2, b);
        else {
          if (288 >= b) {
            for (var d = Qd[b - 1], h = 0; h < b; ++h) {
              d[h] = S[(c + 4 * h) >> 2];
            }
          } else d = S.subarray(c >> 2, (c + 4 * b) >> 2);
          Y.uniform1fv(X[a], d);
        }
      },
      Rc: function (a, b) {
        Y.uniform1i(X[a], b);
      },
      Sc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform1iv(X[a], K, c >> 2, b);
        else {
          if (288 >= b) {
            for (var d = Rd[b - 1], h = 0; h < b; ++h) {
              d[h] = K[(c + 4 * h) >> 2];
            }
          } else {
            d = K.subarray(c >> 2, (c + 4 * b) >> 2);
          }
          Y.uniform1iv(X[a], d);
        }
      },
      Tc: function (a, b, c) {
        Y.uniform2f(X[a], b, c);
      },
      Uc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform2fv(X[a], S, c >> 2, 2 * b);
        else {
          if (144 >= b) {
            for (var d = Qd[2 * b - 1], h = 0; h < 2 * b; h += 2) {
              (d[h] = S[(c + 4 * h) >> 2]),
                (d[h + 1] = S[(c + (4 * h + 4)) >> 2]);
            }
          } else d = S.subarray(c >> 2, (c + 8 * b) >> 2);
          Y.uniform2fv(X[a], d);
        }
      },
      Qc: function (a, b, c) {
        Y.uniform2i(X[a], b, c);
      },
      Pc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform2iv(X[a], K, c >> 2, 2 * b);
        else {
          if (144 >= b) {
            for (var d = Rd[2 * b - 1], h = 0; h < 2 * b; h += 2) {
              (d[h] = K[(c + 4 * h) >> 2]),
                (d[h + 1] = K[(c + (4 * h + 4)) >> 2]);
            }
          } else d = K.subarray(c >> 2, (c + 8 * b) >> 2);
          Y.uniform2iv(X[a], d);
        }
      },
      Oc: function (a, b, c, d) {
        Y.uniform3f(X[a], b, c, d);
      },
      Nc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform3fv(X[a], S, c >> 2, 3 * b);
        else {
          if (96 >= b) {
            for (var d = Qd[3 * b - 1], h = 0; h < 3 * b; h += 3) {
              (d[h] = S[(c + 4 * h) >> 2]),
                (d[h + 1] = S[(c + (4 * h + 4)) >> 2]),
                (d[h + 2] = S[(c + (4 * h + 8)) >> 2]);
            }
          } else d = S.subarray(c >> 2, (c + 12 * b) >> 2);
          Y.uniform3fv(X[a], d);
        }
      },
      Mc: function (a, b, c, d) {
        Y.uniform3i(X[a], b, c, d);
      },
      Lc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform3iv(X[a], K, c >> 2, 3 * b);
        else {
          if (96 >= b) {
            for (var d = Rd[3 * b - 1], h = 0; h < 3 * b; h += 3) {
              (d[h] = K[(c + 4 * h) >> 2]),
                (d[h + 1] = K[(c + (4 * h + 4)) >> 2]),
                (d[h + 2] = K[(c + (4 * h + 8)) >> 2]);
            }
          } else d = K.subarray(c >> 2, (c + 12 * b) >> 2);
          Y.uniform3iv(X[a], d);
        }
      },
      Kc: function (a, b, c, d, h) {
        Y.uniform4f(X[a], b, c, d, h);
      },
      Jc: function (a, b, c) {
        if (2 <= Id.version) Y.uniform4fv(X[a], S, c >> 2, 4 * b);
        else {
          if (72 >= b) {
            var d = Qd[4 * b - 1],
              h = S;
            c >>= 2;
            for (var m = 0; m < 4 * b; m += 4) {
              var q = c + m;
              d[m] = h[q];
              d[m + 1] = h[q + 1];
              d[m + 2] = h[q + 2];
              d[m + 3] = h[q + 3];
            }
          } else d = S.subarray(c >> 2, (c + 16 * b) >> 2);
          Y.uniform4fv(X[a], d);
        }
      },
      xc: function (a, b, c, d, h) {
        Y.uniform4i(X[a], b, c, d, h);
      },
      yc: function (a, b, c) {
        if (2 <= Id.version) {
          Y.uniform4iv(X[a], K, c >> 2, 4 * b);
        } else {
          if (72 >= b) {
            for (var d = Rd[4 * b - 1], h = 0; h < 4 * b; h += 4) {
              (d[h] = K[(c + 4 * h) >> 2]),
                (d[h + 1] = K[(c + (4 * h + 4)) >> 2]),
                (d[h + 2] = K[(c + (4 * h + 8)) >> 2]),
                (d[h + 3] = K[(c + (4 * h + 12)) >> 2]);
            }
          } else d = K.subarray(c >> 2, (c + 16 * b) >> 2);
          Y.uniform4iv(X[a], d);
        }
      },
      zc: function (a, b, c, d) {
        if (2 <= Id.version) Y.uniformMatrix2fv(X[a], !!c, S, d >> 2, 4 * b);
        else {
          if (72 >= b) {
            for (var h = Qd[4 * b - 1], m = 0; m < 4 * b; m += 4) {
              (h[m] = S[(d + 4 * m) >> 2]),
                (h[m + 1] = S[(d + (4 * m + 4)) >> 2]),
                (h[m + 2] = S[(d + (4 * m + 8)) >> 2]),
                (h[m + 3] = S[(d + (4 * m + 12)) >> 2]);
            }
          } else h = S.subarray(d >> 2, (d + 16 * b) >> 2);
          Y.uniformMatrix2fv(X[a], !!c, h);
        }
      },
      Ac: function (a, b, c, d) {
        if (2 <= Id.version) {
          Y.uniformMatrix3fv(X[a], !!c, S, d >> 2, 9 * b);
        } else {
          if (32 >= b) {
            for (var h = Qd[9 * b - 1], m = 0; m < 9 * b; m += 9) {
              (h[m] = S[(d + 4 * m) >> 2]),
                (h[m + 1] = S[(d + (4 * m + 4)) >> 2]),
                (h[m + 2] = S[(d + (4 * m + 8)) >> 2]),
                (h[m + 3] = S[(d + (4 * m + 12)) >> 2]),
                (h[m + 4] = S[(d + (4 * m + 16)) >> 2]),
                (h[m + 5] = S[(d + (4 * m + 20)) >> 2]),
                (h[m + 6] = S[(d + (4 * m + 24)) >> 2]),
                (h[m + 7] = S[(d + (4 * m + 28)) >> 2]),
                (h[m + 8] = S[(d + (4 * m + 32)) >> 2]);
            }
          } else h = S.subarray(d >> 2, (d + 36 * b) >> 2);
          Y.uniformMatrix3fv(X[a], !!c, h);
        }
      },
      Bc: function (a, b, c, d) {
        if (2 <= Id.version) Y.uniformMatrix4fv(X[a], !!c, S, d >> 2, 16 * b);
        else {
          if (18 >= b) {
            var h = Qd[16 * b - 1],
              m = S;
            d >>= 2;
            for (var q = 0; q < 16 * b; q += 16) {
              var u = d + q;
              h[q] = m[u];
              h[q + 1] = m[u + 1];
              h[q + 2] = m[u + 2];
              h[q + 3] = m[u + 3];
              h[q + 4] = m[u + 4];
              h[q + 5] = m[u + 5];
              h[q + 6] = m[u + 6];
              h[q + 7] = m[u + 7];
              h[q + 8] = m[u + 8];
              h[q + 9] = m[u + 9];
              h[q + 10] = m[u + 10];
              h[q + 11] = m[u + 11];
              h[q + 12] = m[u + 12];
              h[q + 13] = m[u + 13];
              h[q + 14] = m[u + 14];
              h[q + 15] = m[u + 15];
            }
          } else h = S.subarray(d >> 2, (d + 64 * b) >> 2);
          Y.uniformMatrix4fv(X[a], !!c, h);
        }
      },
      Cc: function (a) {
        Y.useProgram(ud[a]);
      },
      Dc: function (a, b) {
        Y.vertexAttrib1f(a, b);
      },
      Ec: function (a, b) {
        Y.vertexAttrib2f(a, S[b >> 2], S[(b + 4) >> 2]);
      },
      Fc: function (a, b) {
        Y.vertexAttrib3f(a, S[b >> 2], S[(b + 4) >> 2], S[(b + 8) >> 2]);
      },
      Gc: function (a, b) {
        Y.vertexAttrib4f(
          a,
          S[b >> 2],
          S[(b + 4) >> 2],
          S[(b + 8) >> 2],
          S[(b + 12) >> 2],
        );
      },
      lc: function (a, b) {
        Y.vertexAttribDivisor(a, b);
      },
      mc: function (a, b, c, d, h) {
        Y.vertexAttribIPointer(a, b, c, d, h);
      },
      Hc: function (a, b, c, d, h, m) {
        Y.vertexAttribPointer(a, b, c, !!d, h, m);
      },
      Ic: function (a, b, c, d) {
        Y.viewport(a, b, c, d);
      },
      fb: function (a, b, c, d) {
        Y.waitSync(Bd[a], b, (c >>> 0) + 4294967296 * d);
      },
      e: function (a, b) {
        je(a, b || 1);
        throw "longjmp";
      },
      ob: function (a, b, c) {
        v.copyWithin(a, b, b + c);
      },
      pb: function (a) {
        a >>>= 0;
        var b = v.length;
        if (2147483648 < a) {
          return !1;
        }
        for (var c = 1; 4 >= c; c *= 2) {
          var d = b * (1 + 0.2 / c);
          d = Math.min(d, a + 100663296);
          d = Math.max(16777216, a, d);
          0 < d % 65536 && (d += 65536 - (d % 65536));
          a: {
            try {
              Oa.grow((Math.min(2147483648, d) - gb.byteLength + 65535) >>> 16);
              ob(Oa.buffer);
              var h = 1;
              break a;
            } catch (m) {}
            h = void 0;
          }
          if (h) return !0;
        }
        return !1;
      },
      ad: function () {
        return Id ? Id.Nh : 0;
      },
      V: function (a) {
        return ka(a) ? 0 : -5;
      },
      tb: function (a, b) {
        var c = 0;
        Td().forEach(function (d, h) {
          var m = b + c;
          h = K[(a + 4 * h) >> 2] = m;
          for (m = 0; m < d.length; ++m) hb[h++ >> 0] = d.charCodeAt(m);
          hb[h >> 0] = 0;
          c += d.length + 1;
        });
        return 0;
      },
      ub: function (a, b) {
        var c = Td();
        K[a >> 2] = c.length;
        var d = 0;
        c.forEach(function (h) {
          d += h.length + 1;
        });
        K[b >> 2] = d;
        return 0;
      },
      Gb: function (a) {
        if (!noExitRuntime && ((Qa = !0), f.onExit)) f.onExit(a);
        wa(a, new Ha(a));
      },
      G: function () {
        return 0;
      },
      sb: function (a, b) {
        a = 1 == a || 2 == a ? 2 : Ia();
        hb[b >> 0] = a;
        return 0;
      },
      wb: function (a, b, c, d) {
        a = Nb.Ai(a);
        b = Nb.zi(a, b, c);
        K[d >> 2] = b;
        return 0;
      },
      nb: function () {},
      L: function (a, b, c, d) {
        for (var h = 0, m = 0; m < c; m++) {
          for (
            var q = K[(b + 8 * m) >> 2], u = K[(b + (8 * m + 4)) >> 2], y = 0;
            y < u;
            y++
          ) {
            var E = v[q + y],
              I = Mb[a];
            0 === E || 10 === E
              ? ((1 === a ? Ja : Ka)(Sa(I, 0)), (I.length = 0))
              : I.push(E);
          }
          h += u;
        }
        K[d >> 2] = h;
        return 0;
      },
      a: function () {
        return La | 0;
      },
      bd: function (a, b) {
        Y.bindFramebuffer(a, vd[b]);
      },
      db: function (a) {
        Y.clear(a);
      },
      Bb: function (a, b, c, d) {
        Y.clearColor(a, b, c, d);
      },
      kb: function (a) {
        Y.clearStencil(a);
      },
      I: function (a, b) {
        Ld(a, b);
      },
      i: ke,
      t: le,
      f: me,
      B: ne,
      Kb: oe,
      T: pe,
      S: qe,
      R: re,
      h: se,
      l: te,
      r: ue,
      s: ve,
      Jb: we,
      Hb: xe,
      Ib: ye,
      memory: Oa,
      p: function (a) {
        a = +a;
        return 0 <= a ? +xb(a + 0.5) : +wb(a - 0.5);
      },
      ib: function () {},
      K: function () {},
      hb: function () {},
      gb: function () {},
      b: function (a) {
        La = a | 0;
      },
      qb: function (a, b, c, d) {
        return $d(a, b, c, d);
      },
      table: Pa,
    };
    (function () {
      function a(h) {
        f.asm = storeWasm.exports;
        yb--;
        f.monitorRunDependencies && f.monitorRunDependencies(yb);
        0 == yb &&
          (null !== zb && (clearInterval(zb), (zb = null)),
            Ab && ((h = Ab), (Ab = null), h()));
      }
      function b(h) {
        a(h.instance);
      }
      function c(h) {
        return Promise.resolve()
          .then(function (m) {
            return new Promise((res) => {
              WebAssembly.instantiate(wasmBuff, d).then(
                ({ instance: inst }) => {
                  storeWasm = inst;
                  return res(inst);
                },
              );
            });
          })
          .then(h, function (m) {
            Ka("failed to asynchronously prepare wasm: " + m);
            Ia(m);
          });
      }
      var d = { a: ze };
      yb++;
      f.monitorRunDependencies && f.monitorRunDependencies(yb);
      if (f.instantiateWasm) {
        try {
          return f.instantiateWasm(d, a);
        } catch (h) {
          return (
            Ka("Module.instantiateWasm callback failed with error: " + h), !1
          );
        }
      }
      (function () {
        if (
          Ma ||
          "function" !== typeof WebAssembly.instantiateStreaming ||
          Eb() ||
          Bb("file://") ||
          "function" !== typeof fetch
        ) {
          return c(b);
        }
        new Promise((res) => res(true)).then(function () {
          return new Promise((res) => {
            WebAssembly.instantiate(wasmBuff, d).then(({ instance: inst }) => {
              storeWasm = inst;
              return res(inst);
            });
          }).then(b, function (m) {
            Ka("wasm streaming compile failed: " + m);
            Ka("falling back to ArrayBuffer instantiation");
            return c(b);
          });
        });
      })();
      return {};
    })();
    var Ib = (f.___wasm_call_ctors = function () {
        return (Ib = f.___wasm_call_ctors = f.asm.cd).apply(null, arguments);
      }),
      ie = (f._memset = function () {
        return (ie = f._memset = f.asm.dd).apply(null, arguments);
      }),
      Nd = (f._malloc = function () {
        return (Nd = f._malloc = f.asm.ed).apply(null, arguments);
      }),
      Yc = (f._free = function () {
        return (Yc = f._free = f.asm.fd).apply(null, arguments);
      }),
      ge = (f.___errno_location = function () {
        return (ge = f.___errno_location = f.asm.gd).apply(null, arguments);
      }),
      Xc = (f.___getTypeName = function () {
        return (Xc = f.___getTypeName = f.asm.hd).apply(null, arguments);
      });
    f.___embind_register_native_and_builtin_types = function () {
      return (f.___embind_register_native_and_builtin_types = f.asm.id).apply(
        null,
        arguments,
      );
    };
    var je = (f._setThrew = function () {
        return (je = f._setThrew = f.asm.jd).apply(null, arguments);
      }),
      Ae = (f.stackSave = function () {
        return (Ae = f.stackSave = f.asm.kd).apply(null, arguments);
      }),
      Be = (f.stackRestore = function () {
        return (Be = f.stackRestore = f.asm.ld).apply(null, arguments);
      }),
      he = (f._memalign = function () {
        return (he = f._memalign = f.asm.md).apply(null, arguments);
      }),
      Ce = (f.dynCall_v = function () {
        return (Ce = f.dynCall_v = f.asm.nd).apply(null, arguments);
      }),
      De = (f.dynCall_vi = function () {
        return (De = f.dynCall_vi = f.asm.od).apply(null, arguments);
      }),
      Ee = (f.dynCall_vii = function () {
        return (Ee = f.dynCall_vii = f.asm.pd).apply(null, arguments);
      }),
      Fe = (f.dynCall_viii = function () {
        return (Fe = f.dynCall_viii = f.asm.qd).apply(null, arguments);
      }),
      Ge = (f.dynCall_viiii = function () {
        return (Ge = f.dynCall_viiii = f.asm.rd).apply(null, arguments);
      }),
      He = (f.dynCall_viiiii = function () {
        return (He = f.dynCall_viiiii = f.asm.sd).apply(null, arguments);
      }),
      Ie = (f.dynCall_viiiiii = function () {
        return (Ie = f.dynCall_viiiiii = f.asm.td).apply(null, arguments);
      }),
      Je = (f.dynCall_viiiiiiiii = function () {
        return (Je = f.dynCall_viiiiiiiii = f.asm.ud).apply(null, arguments);
      }),
      Ke = (f.dynCall_ii = function () {
        return (Ke = f.dynCall_ii = f.asm.vd).apply(null, arguments);
      }),
      Le = (f.dynCall_iii = function () {
        return (Le = f.dynCall_iii = f.asm.wd).apply(null, arguments);
      }),
      Me = (f.dynCall_iiii = function () {
        return (Me = f.dynCall_iiii = f.asm.xd).apply(null, arguments);
      }),
      Ne = (f.dynCall_iiiii = function () {
        return (Ne = f.dynCall_iiiii = f.asm.yd).apply(null, arguments);
      }),
      Oe = (f.dynCall_iiiiii = function () {
        return (Oe = f.dynCall_iiiiii = f.asm.zd).apply(null, arguments);
      }),
      Pe = (f.dynCall_iiiiiii = function () {
        return (Pe = f.dynCall_iiiiiii = f.asm.Ad).apply(null, arguments);
      }),
      Qe = (f.dynCall_iiiiiiiiii = function () {
        return (Qe = f.dynCall_iiiiiiiiii = f.asm.Bd).apply(null, arguments);
      });
    f.dynCall_i = function () {
      return (f.dynCall_i = f.asm.Cd).apply(null, arguments);
    };
    f.dynCall_vif = function () {
      return (f.dynCall_vif = f.asm.Dd).apply(null, arguments);
    };
    f.dynCall_viffi = function () {
      return (f.dynCall_viffi = f.asm.Ed).apply(null, arguments);
    };
    f.dynCall_viifi = function () {
      return (f.dynCall_viifi = f.asm.Fd).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiiii = function () {
      return (f.dynCall_viiiiiiiiiii = f.asm.Gd).apply(null, arguments);
    };
    f.dynCall_viifiiiiiiii = function () {
      return (f.dynCall_viifiiiiiiii = f.asm.Hd).apply(null, arguments);
    };
    f.dynCall_viffiiiiiffiii = function () {
      return (f.dynCall_viffiiiiiffiii = f.asm.Id).apply(null, arguments);
    };
    f.dynCall_viififiiiiiiii = function () {
      return (f.dynCall_viififiiiiiiii = f.asm.Jd).apply(null, arguments);
    };
    f.dynCall_viiffii = function () {
      return (f.dynCall_viiffii = f.asm.Kd).apply(null, arguments);
    };
    f.dynCall_viiiiiiii = function () {
      return (f.dynCall_viiiiiiii = f.asm.Ld).apply(null, arguments);
    };
    f.dynCall_vifffi = function () {
      return (f.dynCall_vifffi = f.asm.Md).apply(null, arguments);
    };
    f.dynCall_viiffi = function () {
      return (f.dynCall_viiffi = f.asm.Nd).apply(null, arguments);
    };
    f.dynCall_viffffi = function () {
      return (f.dynCall_viffffi = f.asm.Od).apply(null, arguments);
    };
    f.dynCall_viiff = function () {
      return (f.dynCall_viiff = f.asm.Pd).apply(null, arguments);
    };
    f.dynCall_viiiifiii = function () {
      return (f.dynCall_viiiifiii = f.asm.Qd).apply(null, arguments);
    };
    f.dynCall_viiiffii = function () {
      return (f.dynCall_viiiffii = f.asm.Rd).apply(null, arguments);
    };
    f.dynCall_vifff = function () {
      return (f.dynCall_vifff = f.asm.Sd).apply(null, arguments);
    };
    f.dynCall_viff = function () {
      return (f.dynCall_viff = f.asm.Td).apply(null, arguments);
    };
    f.dynCall_iifii = function () {
      return (f.dynCall_iifii = f.asm.Ud).apply(null, arguments);
    };
    f.dynCall_vifii = function () {
      return (f.dynCall_vifii = f.asm.Vd).apply(null, arguments);
    };
    f.dynCall_viif = function () {
      return (f.dynCall_viif = f.asm.Wd).apply(null, arguments);
    };
    f.dynCall_fi = function () {
      return (f.dynCall_fi = f.asm.Xd).apply(null, arguments);
    };
    f.dynCall_fii = function () {
      return (f.dynCall_fii = f.asm.Yd).apply(null, arguments);
    };
    f.dynCall_iiffii = function () {
      return (f.dynCall_iiffii = f.asm.Zd).apply(null, arguments);
    };
    f.dynCall_viffii = function () {
      return (f.dynCall_viffii = f.asm._d).apply(null, arguments);
    };
    f.dynCall_iiifi = function () {
      return (f.dynCall_iiifi = f.asm.$d).apply(null, arguments);
    };
    f.dynCall_iif = function () {
      return (f.dynCall_iif = f.asm.ae).apply(null, arguments);
    };
    f.dynCall_iiiif = function () {
      return (f.dynCall_iiiif = f.asm.be).apply(null, arguments);
    };
    f.dynCall_viiif = function () {
      return (f.dynCall_viiif = f.asm.ce).apply(null, arguments);
    };
    f.dynCall_iiffi = function () {
      return (f.dynCall_iiffi = f.asm.de).apply(null, arguments);
    };
    f.dynCall_iiiiiiii = function () {
      return (f.dynCall_iiiiiiii = f.asm.ee).apply(null, arguments);
    };
    f.dynCall_viiiiiii = function () {
      return (f.dynCall_viiiiiii = f.asm.fe).apply(null, arguments);
    };
    f.dynCall_viifffffffffi = function () {
      return (f.dynCall_viifffffffffi = f.asm.ge).apply(null, arguments);
    };
    f.dynCall_vifffiiff = function () {
      return (f.dynCall_vifffiiff = f.asm.he).apply(null, arguments);
    };
    f.dynCall_vifffff = function () {
      return (f.dynCall_vifffff = f.asm.ie).apply(null, arguments);
    };
    f.dynCall_iiff = function () {
      return (f.dynCall_iiff = f.asm.je).apply(null, arguments);
    };
    f.dynCall_viffffff = function () {
      return (f.dynCall_viffffff = f.asm.ke).apply(null, arguments);
    };
    f.dynCall_viffff = function () {
      return (f.dynCall_viffff = f.asm.le).apply(null, arguments);
    };
    f.dynCall_vifffffffff = function () {
      return (f.dynCall_vifffffffff = f.asm.me).apply(null, arguments);
    };
    f.dynCall_iifff = function () {
      return (f.dynCall_iifff = f.asm.ne).apply(null, arguments);
    };
    f.dynCall_iiiiiiiiiiii = function () {
      return (f.dynCall_iiiiiiiiiiii = f.asm.oe).apply(null, arguments);
    };
    f.dynCall_iiifiiiiiiii = function () {
      return (f.dynCall_iiifiiiiiiii = f.asm.pe).apply(null, arguments);
    };
    f.dynCall_iiffiiiiiffiii = function () {
      return (f.dynCall_iiffiiiiiffiii = f.asm.qe).apply(null, arguments);
    };
    f.dynCall_iiififiiiiiiii = function () {
      return (f.dynCall_iiififiiiiiiii = f.asm.re).apply(null, arguments);
    };
    f.dynCall_viifffi = function () {
      return (f.dynCall_viifffi = f.asm.se).apply(null, arguments);
    };
    f.dynCall_viiiffi = function () {
      return (f.dynCall_viiiffi = f.asm.te).apply(null, arguments);
    };
    f.dynCall_viiffffi = function () {
      return (f.dynCall_viiffffi = f.asm.ue).apply(null, arguments);
    };
    f.dynCall_viiiff = function () {
      return (f.dynCall_viiiff = f.asm.ve).apply(null, arguments);
    };
    f.dynCall_viiiiifiii = function () {
      return (f.dynCall_viiiiifiii = f.asm.we).apply(null, arguments);
    };
    f.dynCall_viiiiffii = function () {
      return (f.dynCall_viiiiffii = f.asm.xe).apply(null, arguments);
    };
    f.dynCall_viifff = function () {
      return (f.dynCall_viifff = f.asm.ye).apply(null, arguments);
    };
    f.dynCall_iiif = function () {
      return (f.dynCall_iiif = f.asm.ze).apply(null, arguments);
    };
    f.dynCall_iiiffi = function () {
      return (f.dynCall_iiiffi = f.asm.Ae).apply(null, arguments);
    };
    f.dynCall_iiifff = function () {
      return (f.dynCall_iiifff = f.asm.Be).apply(null, arguments);
    };
    f.dynCall_fiii = function () {
      return (f.dynCall_fiii = f.asm.Ce).apply(null, arguments);
    };
    f.dynCall_viiifffffffffi = function () {
      return (f.dynCall_viiifffffffffi = f.asm.De).apply(null, arguments);
    };
    f.dynCall_viifffiiff = function () {
      return (f.dynCall_viifffiiff = f.asm.Ee).apply(null, arguments);
    };
    f.dynCall_viifffff = function () {
      return (f.dynCall_viifffff = f.asm.Fe).apply(null, arguments);
    };
    f.dynCall_iiiff = function () {
      return (f.dynCall_iiiff = f.asm.Ge).apply(null, arguments);
    };
    f.dynCall_viiffffff = function () {
      return (f.dynCall_viiffffff = f.asm.He).apply(null, arguments);
    };
    f.dynCall_viiffff = function () {
      return (f.dynCall_viiffff = f.asm.Ie).apply(null, arguments);
    };
    f.dynCall_viifffffffff = function () {
      return (f.dynCall_viifffffffff = f.asm.Je).apply(null, arguments);
    };
    f.dynCall_viffiif = function () {
      return (f.dynCall_viffiif = f.asm.Ke).apply(null, arguments);
    };
    f.dynCall_viiffiif = function () {
      return (f.dynCall_viiffiif = f.asm.Le).apply(null, arguments);
    };
    f.dynCall_fiiiiii = function () {
      return (f.dynCall_fiiiiii = f.asm.Me).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiiiii = function () {
      return (f.dynCall_viiiiiiiiiiii = f.asm.Ne).apply(null, arguments);
    };
    f.dynCall_viiiiifi = function () {
      return (f.dynCall_viiiiifi = f.asm.Oe).apply(null, arguments);
    };
    f.dynCall_viiiiiiifi = function () {
      return (f.dynCall_viiiiiiifi = f.asm.Pe).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiifi = function () {
      return (f.dynCall_viiiiiiiiifi = f.asm.Qe).apply(null, arguments);
    };
    f.dynCall_iiiiiiiii = function () {
      return (f.dynCall_iiiiiiiii = f.asm.Re).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiiifi = function () {
      return (f.dynCall_viiiiiiiiiifi = f.asm.Se).apply(null, arguments);
    };
    f.dynCall_ji = function () {
      return (f.dynCall_ji = f.asm.Te).apply(null, arguments);
    };
    f.dynCall_iiji = function () {
      return (f.dynCall_iiji = f.asm.Ue).apply(null, arguments);
    };
    f.dynCall_iijjiii = function () {
      return (f.dynCall_iijjiii = f.asm.Ve).apply(null, arguments);
    };
    f.dynCall_iij = function () {
      return (f.dynCall_iij = f.asm.We).apply(null, arguments);
    };
    f.dynCall_vijjjii = function () {
      return (f.dynCall_vijjjii = f.asm.Xe).apply(null, arguments);
    };
    f.dynCall_viifii = function () {
      return (f.dynCall_viifii = f.asm.Ye).apply(null, arguments);
    };
    f.dynCall_iidi = function () {
      return (f.dynCall_iidi = f.asm.Ze).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiiiiiiii = function () {
      return (f.dynCall_viiiiiiiiiiiiiii = f.asm._e).apply(null, arguments);
    };
    f.dynCall_viji = function () {
      return (f.dynCall_viji = f.asm.$e).apply(null, arguments);
    };
    f.dynCall_vijiii = function () {
      return (f.dynCall_vijiii = f.asm.af).apply(null, arguments);
    };
    f.dynCall_viiiiij = function () {
      return (f.dynCall_viiiiij = f.asm.bf).apply(null, arguments);
    };
    f.dynCall_fiff = function () {
      return (f.dynCall_fiff = f.asm.cf).apply(null, arguments);
    };
    f.dynCall_viiiiiffii = function () {
      return (f.dynCall_viiiiiffii = f.asm.df).apply(null, arguments);
    };
    f.dynCall_viid = function () {
      return (f.dynCall_viid = f.asm.ef).apply(null, arguments);
    };
    f.dynCall_viddi = function () {
      return (f.dynCall_viddi = f.asm.ff).apply(null, arguments);
    };
    f.dynCall_viifd = function () {
      return (f.dynCall_viifd = f.asm.gf).apply(null, arguments);
    };
    f.dynCall_jii = function () {
      return (f.dynCall_jii = f.asm.hf).apply(null, arguments);
    };
    f.dynCall_viijii = function () {
      return (f.dynCall_viijii = f.asm.jf).apply(null, arguments);
    };
    f.dynCall_vijii = function () {
      return (f.dynCall_vijii = f.asm.kf).apply(null, arguments);
    };
    f.dynCall_viiiiff = function () {
      return (f.dynCall_viiiiff = f.asm.lf).apply(null, arguments);
    };
    f.dynCall_viiiiiiiiii = function () {
      return (f.dynCall_viiiiiiiiii = f.asm.mf).apply(null, arguments);
    };
    f.dynCall_vf = function () {
      return (f.dynCall_vf = f.asm.nf).apply(null, arguments);
    };
    f.dynCall_vffff = function () {
      return (f.dynCall_vffff = f.asm.of).apply(null, arguments);
    };
    f.dynCall_iiij = function () {
      return (f.dynCall_iiij = f.asm.pf).apply(null, arguments);
    };
    f.dynCall_viij = function () {
      return (f.dynCall_viij = f.asm.qf).apply(null, arguments);
    };
    f.dynCall_iiiij = function () {
      return (f.dynCall_iiiij = f.asm.rf).apply(null, arguments);
    };
    f.dynCall_viiij = function () {
      return (f.dynCall_viiij = f.asm.sf).apply(null, arguments);
    };
    f.dynCall_vij = function () {
      return (f.dynCall_vij = f.asm.tf).apply(null, arguments);
    };
    f.dynCall_iiiiiiiiiii = function () {
      return (f.dynCall_iiiiiiiiiii = f.asm.uf).apply(null, arguments);
    };
    f.dynCall_jiiii = function () {
      return (f.dynCall_jiiii = f.asm.vf).apply(null, arguments);
    };
    f.dynCall_jiiiiii = function () {
      return (f.dynCall_jiiiiii = f.asm.wf).apply(null, arguments);
    };
    f.dynCall_iijj = function () {
      return (f.dynCall_iijj = f.asm.xf).apply(null, arguments);
    };
    f.dynCall_jiji = function () {
      return (f.dynCall_jiji = f.asm.yf).apply(null, arguments);
    };
    f.dynCall_iidiiii = function () {
      return (f.dynCall_iidiiii = f.asm.zf).apply(null, arguments);
    };
    f.dynCall_iiiiij = function () {
      return (f.dynCall_iiiiij = f.asm.Af).apply(null, arguments);
    };
    f.dynCall_iiiiid = function () {
      return (f.dynCall_iiiiid = f.asm.Bf).apply(null, arguments);
    };
    f.dynCall_iiiiijj = function () {
      return (f.dynCall_iiiiijj = f.asm.Cf).apply(null, arguments);
    };
    f.dynCall_iiiiiijj = function () {
      return (f.dynCall_iiiiiijj = f.asm.Df).apply(null, arguments);
    };
    function ke(a, b) {
      var c = Ae();
      try {
        return Ke(a, b);
      } catch (d) {
        Be(c);
        if (d !== d + 0 && "longjmp" !== d) throw d;
        je(1, 0);
      }
    }
    function le(a, b, c) {
      var d = Ae();
      try {
        return Le(a, b, c);
      } catch (h) {
        Be(d);
        if (h !== h + 0 && "longjmp" !== h) throw h;
        je(1, 0);
      }
    }
    function te(a, b, c) {
      var d = Ae();
      try {
        Ee(a, b, c);
      } catch (h) {
        Be(d);
        if (h !== h + 0 && "longjmp" !== h) throw h;
        je(1, 0);
      }
    }
    function me(a, b, c, d) {
      var h = Ae();
      try {
        return Me(a, b, c, d);
      } catch (m) {
        Be(h);
        if (m !== m + 0 && "longjmp" !== m) throw m;
        je(1, 0);
      }
    }
    function se(a, b) {
      var c = Ae();
      try {
        De(a, b);
      } catch (d) {
        Be(c);
        if (d !== d + 0 && "longjmp" !== d) throw d;
        je(1, 0);
      }
    }
    function ue(a, b, c, d) {
      var h = Ae();
      try {
        Fe(a, b, c, d);
      } catch (m) {
        Be(h);
        if (m !== m + 0 && "longjmp" !== m) throw m;
        je(1, 0);
      }
    }
    function oe(a, b, c, d, h, m) {
      var q = Ae();
      try {
        return Oe(a, b, c, d, h, m);
      } catch (u) {
        Be(q);
        if (u !== u + 0 && "longjmp" !== u) throw u;
        je(1, 0);
      }
    }
    function ve(a, b, c, d, h) {
      var m = Ae();
      try {
        Ge(a, b, c, d, h);
      } catch (q) {
        Be(m);
        if (q !== q + 0 && "longjmp" !== q) throw q;
        je(1, 0);
      }
    }
    function pe(a, b, c, d, h, m, q) {
      var u = Ae();
      try {
        return Pe(a, b, c, d, h, m, q);
      } catch (y) {
        Be(u);
        if (y !== y + 0 && "longjmp" !== y) throw y;
        je(1, 0);
      }
    }
    function we(a, b, c, d, h, m) {
      var q = Ae();
      try {
        He(a, b, c, d, h, m);
      } catch (u) {
        Be(q);
        if (u !== u + 0 && "longjmp" !== u) throw u;
        je(1, 0);
      }
    }
    function ne(a, b, c, d, h) {
      var m = Ae();
      try {
        return Ne(a, b, c, d, h);
      } catch (q) {
        Be(m);
        if (q !== q + 0 && "longjmp" !== q) throw q;
        je(1, 0);
      }
    }
    function ye(a, b, c, d, h, m, q, u, y, E) {
      var I = Ae();
      try {
        Je(a, b, c, d, h, m, q, u, y, E);
      } catch (N) {
        Be(I);
        if (N !== N + 0 && "longjmp" !== N) throw N;
        je(1, 0);
      }
    }
    function xe(a, b, c, d, h, m, q) {
      var u = Ae();
      try {
        Ie(a, b, c, d, h, m, q);
      } catch (y) {
        Be(u);
        if (y !== y + 0 && "longjmp" !== y) throw y;
        je(1, 0);
      }
    }
    function qe(a, b, c, d, h, m, q, u, y, E) {
      var I = Ae();
      try {
        return Qe(a, b, c, d, h, m, q, u, y, E);
      } catch (N) {
        Be(I);
        if (N !== N + 0 && "longjmp" !== N) throw N;
        je(1, 0);
      }
    }
    function re(a) {
      var b = Ae();
      try {
        Ce(a);
      } catch (c) {
        Be(b);
        if (c !== c + 0 && "longjmp" !== c) throw c;
        je(1, 0);
      }
    }
    var Re;
    function Ha(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    Ab = function Se() {
      Re || Te();
      Re || (Ab = Se);
    };
    function Te() {
      function a() {
        if (!Re && ((Re = !0), (f.calledRun = !0), !Qa)) {
          qb(sb);
          qb(tb);
          ba(f);
          if (f.onRuntimeInitialized) f.onRuntimeInitialized();
          if (f.postRun) {
            for (
              "function" == typeof f.postRun && (f.postRun = [f.postRun]);
              f.postRun.length;
            ) {
              var b = f.postRun.shift();
              ub.unshift(b);
            }
          }
          qb(ub);
        }
      }
      if (!(0 < yb)) {
        if (f.preRun) {
          for (
            "function" == typeof f.preRun && (f.preRun = [f.preRun]);
            f.preRun.length;
          ) {
            vb();
          }
        }
        qb(rb);
        0 < yb ||
          (f.setStatus
            ? (f.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  f.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    f.run = Te;
    if (f.preInit) {
      for (
        "function" == typeof f.preInit && (f.preInit = [f.preInit]);
        0 < f.preInit.length;
      ) {
        f.preInit.pop()();
      }
    }
    noExitRuntime = !0;
    Te();

    return CanvasKitInit.ready;
  };
})();
