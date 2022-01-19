// NOTE: ported from https://unpkg.com/canvaskit-wasm@0.32.0

import { encodeBase64 } from "./base64.ts";
import { WASM_BUFFER as wasmBuff } from "./wasm.js";
import { maybeHSL } from "./color_util.ts";

let document = { getElementById: () => undefined };

export var CanvasKitInit = (function () {
  var _scriptDir = typeof document !== "undefined" && document.currentScript
    ? document.currentScript.src
    : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return (
    function (CanvasKitInit) {
      CanvasKitInit = CanvasKitInit || {};

      null;
      var t;
      t || (t = typeof CanvasKitInit !== "undefined" ? CanvasKitInit : {});
      var da, fa;
      t.ready = new Promise(function (a, b) {
        da = a;
        fa = b;
      });
      (function (a) {
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.MakeSWCanvasSurface = function (b) {
            var c = b;
            if (
              "CANVAS" !== c.tagName && (c = document.getElementById(b), !c)
            ) {
              throw "Canvas with id " + b + " was not found";
            }
            if (b = a.MakeSurface(c.width, c.height)) b.Nd = c;
            return b;
          };
          a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
          a.MakeSurface = function (b, c) {
            var f = {
                width: b,
                height: c,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
              },
              h = b * c * 4,
              l = a._malloc(h);
            if (f = a.Surface._makeRasterDirect(f, l, 4 * b)) {
              f.Nd = null,
                f.Af = b,
                f.xf = c,
                f.zf = h,
                f.af = l,
                f.getCanvas().clear(a.TRANSPARENT);
            }
            return f;
          };
          a.MakeRasterDirectSurface = function (b, c, f) {
            return a.Surface._makeRasterDirect(b, c.byteOffset, f);
          };
          a.Surface.prototype.flush = function (b) {
            a.Od(this.Md);
            this._flush();
            if (this.Nd) {
              var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.af, this.zf);
              c = new ImageData(c, this.Af, this.xf);
              b
                ? this.Nd.getContext("2d").putImageData(
                  c,
                  0,
                  0,
                  b[0],
                  b[1],
                  b[2] - b[0],
                  b[3] - b[1],
                )
                : this.Nd.getContext("2d").putImageData(c, 0, 0);
            }
          };
          a.Surface.prototype.dispose = function () {
            this.af && a._free(this.af);
            this.delete();
          };
          a.Od = a.Od || function () {};
        });
      })(t);
      (function (a) {
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          function b(l, n, q) {
            return l && l.hasOwnProperty(n) ? l[n] : q;
          }
          function c(l) {
            var n = ha.length;
            n || (ha.push(null), n = 1);
            ha.push(l);
            return n;
          }
          function f(l) {
            return l.naturalHeight || l.videoHeight || l.displayHeight ||
              l.height;
          }
          function h(l) {
            return l.naturalWidth || l.videoWidth || l.displayWidth || l.width;
          }
          a.GetWebGLContext = function (l, n) {
            if (!l) throw "null canvas passed into makeWebGLContext";
            var q = {
              alpha: b(n, "alpha", 1),
              depth: b(n, "depth", 1),
              stencil: b(n, "stencil", 8),
              antialias: b(n, "antialias", 0),
              premultipliedAlpha: b(n, "premultipliedAlpha", 1),
              preserveDrawingBuffer: b(n, "preserveDrawingBuffer", 0),
              preferLowPowerToHighPerformance: b(
                n,
                "preferLowPowerToHighPerformance",
                0,
              ),
              failIfMajorPerformanceCaveat: b(
                n,
                "failIfMajorPerformanceCaveat",
                0,
              ),
              enableExtensionsByDefault: b(n, "enableExtensionsByDefault", 1),
              explicitSwapControl: b(n, "explicitSwapControl", 0),
              renderViaOffscreenBackBuffer: b(
                n,
                "renderViaOffscreenBackBuffer",
                0,
              ),
            };
            q.majorVersion = n && n.majorVersion
              ? n.majorVersion
              : "undefined" !== typeof WebGL2RenderingContext
              ? 2
              : 1;
            if (q.explicitSwapControl) {
              throw "explicitSwapControl is not supported";
            }
            l = ia(l, q);
            if (!l) return 0;
            la(l);
            return l;
          };
          a.deleteContext = function (l) {
            v === ma[l] && (v = null);
            "object" === typeof JSEvents && JSEvents.Fg(ma[l].le.canvas);
            ma[l] && ma[l].le.canvas && (ma[l].le.canvas.wf = void 0);
            ma[l] = null;
          };
          a._setTextureCleanup({
            deleteTexture: function (l, n) {
              var q = ha[n];
              q && ma[l].le.deleteTexture(q);
              ha[n] = null;
            },
          });
          a.MakeGrContext = function (l) {
            if (!this.Od(l)) return null;
            var n = this._MakeGrContext();
            if (!n) return null;
            n.Md = l;
            return n;
          };
          a.MakeOnScreenGLSurface = function (l, n, q, x) {
            n = this._MakeOnScreenGLSurface(l, n, q, x);
            if (!n) return null;
            n.Md = l.Md;
            return n;
          };
          a.MakeRenderTarget = function (l, n, q) {
            n = this._MakeRenderTargetWH(l, n, q);
            if (!n) return null;
            n.Md = l.Md;
            return n;
          };
          a.MakeRenderTarget = function (l, n) {
            n = this._MakeRenderTargetII(l, n);
            if (!n) return null;
            n.Md = l.Md;
            return n;
          };
          a.MakeWebGLCanvasSurface = function (l, n, q) {
            n = n || null;
            var x = l,
              w = "undefined" !== typeof OffscreenCanvas &&
                x instanceof OffscreenCanvas;
            if (
              !("undefined" !== typeof HTMLCanvasElement &&
                  x instanceof HTMLCanvasElement ||
                w || (x = document.getElementById(l), x))
            ) {
              throw "Canvas with id " + l + " was not found";
            }
            l = this.GetWebGLContext(x, q);
            if (!l || 0 > l) throw "failed to create webgl context: err " + l;
            l = this.MakeGrContext(l);
            n = this.MakeOnScreenGLSurface(l, x.width, x.height, n);
            return n
              ? n
              : (n = x.cloneNode(!0),
                x.parentNode.replaceChild(n, x),
                n.classList.add("ck-replaced"),
                a.MakeSWCanvasSurface(n));
          };
          a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
          a.Surface.prototype.makeImageFromTexture = function (l, n) {
            a.Od(this.Md);
            l = c(l);
            return this._makeImageFromTexture(this.Md, l, n);
          };
          a.Surface.prototype.makeImageFromTextureSource = function (l, n) {
            n ||
              (n = {
                height: f(l),
                width: h(l),
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
              });
            n.colorSpace || (n.colorSpace = a.ColorSpace.SRGB);
            a.Od(this.Md);
            var q = v.le, x = q.createTexture();
            q.bindTexture(q.TEXTURE_2D, x);
            2 === v.version
              ? q.texImage2D(
                q.TEXTURE_2D,
                0,
                q.RGBA,
                n.width,
                n.height,
                0,
                q.RGBA,
                q.UNSIGNED_BYTE,
                l,
              )
              : q.texImage2D(
                q.TEXTURE_2D,
                0,
                q.RGBA,
                q.RGBA,
                q.UNSIGNED_BYTE,
                l,
              );
            q.bindTexture(q.TEXTURE_2D, null);
            return this.makeImageFromTexture(x, n);
          };
          a.MakeLazyImageFromTextureSource = function (l, n) {
            n ||
              (n = {
                height: f(l),
                width: h(l),
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
              });
            n.colorSpace || (n.colorSpace = a.ColorSpace.SRGB);
            var q = {
              makeTexture: function () {
                var x = v, w = x.le, F = w.createTexture();
                w.bindTexture(w.TEXTURE_2D, F);
                2 === x.version
                  ? w.texImage2D(
                    w.TEXTURE_2D,
                    0,
                    w.RGBA,
                    n.width,
                    n.height,
                    0,
                    w.RGBA,
                    w.UNSIGNED_BYTE,
                    l,
                  )
                  : w.texImage2D(
                    w.TEXTURE_2D,
                    0,
                    w.RGBA,
                    w.RGBA,
                    w.UNSIGNED_BYTE,
                    l,
                  );
                w.bindTexture(w.TEXTURE_2D, null);
                return c(F);
              },
              freeSrc: function () {},
            };
            "VideoFrame" === l.constructor.name && (q.freeSrc = function () {
              l.close();
            });
            return a.Image._makeFromGenerator(n, q);
          };
          a.Od = function (l) {
            return l ? la(l) : !1;
          };
        });
      })(t);
      (function (a) {
        function b(e, d, g, m, r) {
          for (var y = 0; y < e.length; y++) {
            d[y * g + (y * r + m + g) % g] = e[y];
          }
          return d;
        }
        function c(e) {
          for (var d = e * e, g = Array(d); d--;) {
            g[d] = 0 === d % (e + 1) ? 1 : 0;
          }
          return g;
        }
        function f(e) {
          return e ? e.constructor === Float32Array && 4 === e.length : !1;
        }
        function h(e) {
          return (q(255 * e[3]) << 24 | q(255 * e[0]) << 16 |
            q(255 * e[1]) << 8 | q(255 * e[2]) << 0) >>> 0;
        }
        function l(e) {
          if (e && e._ck) return e;
          if (e instanceof Float32Array) {
            for (
              var d = Math.floor(e.length / 4), g = new Uint32Array(d), m = 0;
              m < d;
              m++
            ) {
              g[m] = h(e.slice(4 * m, 4 * (m + 1)));
            }
            return g;
          }
          if (
            e instanceof
              Uint32Array
          ) {
            return e;
          }
          if (e instanceof Array && e[0] instanceof Float32Array) {
            return e.map(h);
          }
        }
        function n(e) {
          if (void 0 === e) return 1;
          var d = parseFloat(e);
          return e && -1 !== e.indexOf("%") ? d / 100 : d;
        }
        function q(e) {
          return Math.round(Math.max(0, Math.min(e || 0, 255)));
        }
        function x(e, d) {
          d && d._ck || a._free(e);
        }
        function w(e, d, g) {
          if (!e || !e.length) return U;
          if (e && e._ck) return e.byteOffset;
          var m = a[d].BYTES_PER_ELEMENT;
          g || (g = a._malloc(e.length * m));
          a[d].set(e, g / m);
          return g;
        }
        function F(e) {
          var d = { ce: U, count: e.length, Ke: a.ColorType.RGBA_F32 };
          if (e instanceof Float32Array) {
            d.ce = w(e, "HEAPF32"), d.count = e.length / 4;
          } else if (e instanceof Uint32Array) {
            d.ce = w(e, "HEAPU32"), d.Ke = a.ColorType.RGBA_8888;
          } else if (e instanceof Array) {
            if (e && e.length) {
              for (
                var g = a._malloc(16 * e.length), m = 0, r = g / 4, y = 0;
                y < e.length;
                y++
              ) {
                for (var D = 0; 4 > D; D++) a.HEAPF32[r + m] = e[y][D], m++;
              }
              e = g;
            } else e = U;
            d.ce = e;
          } else {
            throw "Invalid argument to copyFlexibleColorArray, Not a color array " +
              typeof e;
          }
          return d;
        }
        function K(e) {
          if (!e) return U;
          if (e.length) {
            if (6 === e.length || 9 === e.length) {
              return w(e, "HEAPF32", Na),
                6 === e.length && a.HEAPF32.set(Fd, 6 + Na / 4),
                Na;
            }
            if (16 === e.length) {
              var d = Cb.toTypedArray();
              d[0] = e[0];
              d[1] = e[1];
              d[2] = e[3];
              d[3] = e[4];
              d[4] = e[5];
              d[5] = e[7];
              d[6] = e[12];
              d[7] = e[13];
              d[8] = e[15];
              return Na;
            }
            throw "invalid matrix size";
          }
          d = Cb.toTypedArray();
          d[0] = e.m11;
          d[1] = e.m21;
          d[2] = e.m41;
          d[3] = e.m12;
          d[4] = e.m22;
          d[5] = e.m42;
          d[6] = e.m14;
          d[7] = e.m24;
          d[8] = e.m44;
          return Na;
        }
        function O(e) {
          if (!e) return U;
          var d = fc.toTypedArray();
          if (e.length) {
            if (16 !== e.length && 6 !== e.length && 9 !== e.length) {
              throw "invalid matrix size";
            }
            if (16 === e.length) return w(e, "HEAPF32", ab);
            d.fill(0);
            d[0] = e[0];
            d[1] = e[1];
            d[3] = e[2];
            d[4] = e[3];
            d[5] = e[4];
            d[7] = e[5];
            d[12] = e[6];
            d[13] = e[7];
            d[15] = e[8];
            6 === e.length && (d[12] = 0, d[13] = 0, d[15] = 1);
            return ab;
          }
          d[0] = e.m11;
          d[1] = e.m21;
          d[2] = e.m31;
          d[3] = e.m41;
          d[4] = e.m12;
          d[5] = e.m22;
          d[6] = e.m32;
          d[7] = e.m42;
          d[8] = e.m13;
          d[9] = e.m23;
          d[10] = e.m33;
          d[11] = e.m43;
          d[12] = e.m14;
          d[13] = e.m24;
          d[14] = e.m34;
          d[15] = e.m44;
          return ab;
        }
        function A(e, d) {
          return w(e, "HEAPF32", d || ib);
        }
        function N(e, d, g, m) {
          var r = hc.toTypedArray();
          r[0] = e;
          r[1] = d;
          r[2] = g;
          r[3] = m;
          return ib;
        }
        function Y(e) {
          for (var d = new Float32Array(4), g = 0; 4 > g; g++) {
            d[g] = a.HEAPF32[e / 4 + g];
          }
          return d;
        }
        function S(e, d) {
          return w(e, "HEAPF32", d || ja);
        }
        function oa(e, d) {
          return w(e, "HEAPF32", d || ic);
        }
        function ta() {
          for (var e = 0, d = 0; d < arguments.length - 1; d += 2) {
            e += arguments[d] * arguments[d + 1];
          }
          return e;
        }
        function jb(e, d, g) {
          for (var m = Array(e.length), r = 0; r < g; r++) {
            for (var y = 0; y < g; y++) {
              for (var D = 0, J = 0; J < g; J++) {
                D += e[g * r + J] * d[g * J + y];
              }
              m[r * g + y] = D;
            }
          }
          return m;
        }
        function kb(e, d) {
          for (var g = jb(d[0], d[1], e), m = 2; m < d.length;) {
            g = jb(g, d[m], e), m++;
          }
          return g;
        }
        a.Color = function (e, d, g, m) {
          void 0 === m && (m = 1);
          return a.Color4f(q(e) / 255, q(d) / 255, q(g) / 255, m);
        };
        a.ColorAsInt = function (e, d, g, m) {
          void 0 === m && (m = 255);
          return (q(m) << 24 | q(e) << 16 | q(d) << 8 |
            q(g) << 0 & 268435455) >>> 0;
        };
        a.Color4f = function (e, d, g, m) {
          void 0 === m && (m = 1);
          return Float32Array.of(e, d, g, m);
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
        a.getColorComponents = function (e) {
          return [
            Math.floor(255 * e[0]),
            Math.floor(
              255 *
                e[1],
            ),
            Math.floor(255 * e[2]),
            e[3],
          ];
        };
        a.parseColorString = function (e, d) {
          e = e.toLowerCase();
          if (e.startsWith("#")) {
            d = 255;
            switch (e.length) {
              case 9:
                d = parseInt(e.slice(7, 9), 16);
              case 7:
                var g = parseInt(e.slice(1, 3), 16);
                var m = parseInt(e.slice(3, 5), 16);
                var r = parseInt(e.slice(5, 7), 16);
                break;
              case 5:
                d = 17 * parseInt(e.slice(4, 5), 16);
              case 4:
                g = 17 * parseInt(e.slice(1, 2), 16),
                  m = 17 * parseInt(e.slice(2, 3), 16),
                  r = 17 * parseInt(e.slice(3, 4), 16);
            }
            return a.Color(g, m, r, d / 255);
          }
          return e.startsWith("rgba")
            ? (e = e.slice(5, -1),
              e = e.split(","),
              a.Color(+e[0], +e[1], +e[2], n(e[3])))
            : e.startsWith("rgb")
            ? (e = e.slice(4, -1),
              e = e.split(","),
              a.Color(+e[0], +e[1], +e[2], n(e[3])))
            : e.startsWith("gray(") || e.startsWith("hsl") || !d ||
                (e = d[e], void 0 === e)
            ? a.BLACK
            : e;
        };
        a.multiplyByAlpha = function (e, d) {
          e = e.slice();
          e[3] = Math.max(0, Math.min(e[3] * d, 1));
          return e;
        };
        a.Malloc = function (e, d) {
          var g = a._malloc(d * e.BYTES_PER_ELEMENT);
          return {
            _ck: !0,
            length: d,
            byteOffset: g,
            pe: null,
            subarray: function (m, r) {
              m = this.toTypedArray().subarray(m, r);
              m._ck = !0;
              return m;
            },
            toTypedArray: function () {
              if (this.pe && this.pe.length) return this.pe;
              this.pe = new e(a.HEAPU8.buffer, g, d);
              this.pe._ck = !0;
              return this.pe;
            },
          };
        };
        a.Free = function (e) {
          a._free(e.byteOffset);
          e.byteOffset = U;
          e.toTypedArray = null;
          e.pe = null;
        };
        var Na = U,
          Cb,
          ab = U,
          fc,
          ib = U,
          hc,
          Ha,
          ja = U,
          Mc,
          Ua = U,
          Nc,
          jc = U,
          Oc,
          kc = U,
          Pc,
          lc = U,
          Qc,
          ic = U,
          Rc,
          Sc = U,
          Fd = Float32Array.of(0, 0, 1),
          U = 0;
        a.onRuntimeInitialized = function () {
          function e(d, g, m, r, y, D) {
            D ||
              (D = 4 * r.width,
                r.colorType === a.ColorType.RGBA_F16
                  ? D *= 2
                  : r.colorType === a.ColorType.RGBA_F32 && (D *= 4));
            var J = D * r.height;
            var M = y ? y.byteOffset : a._malloc(J);
            if (!d._readPixels(r, M, D, g, m)) {
              return y || a._free(M), null;
            }
            if (y) return y.toTypedArray();
            switch (r.colorType) {
              case a.ColorType.RGBA_8888:
              case a.ColorType.RGBA_F16:
                d = new Uint8Array(a.HEAPU8.buffer, M, J);
                if (!r.__raw) d = d.slice();
                break;
              case a.ColorType.RGBA_F32:
                d = new Float32Array(a.HEAPU8.buffer, M, J);
                if (!r.__raw) d = d.slice();
                break;
              default:
                return null;
            }
            a._free(M);
            return d;
          }
          hc = a.Malloc(Float32Array, 4);
          ib = hc.byteOffset;
          fc = a.Malloc(Float32Array, 16);
          ab = fc.byteOffset;
          Cb = a.Malloc(Float32Array, 9);
          Na = Cb.byteOffset;
          Qc = a.Malloc(Float32Array, 12);
          ic = Qc.byteOffset;
          Rc = a.Malloc(Float32Array, 12);
          Sc = Rc.byteOffset;
          Ha = a.Malloc(Float32Array, 4);
          ja = Ha.byteOffset;
          Mc = a.Malloc(Float32Array, 4);
          Ua = Mc.byteOffset;
          Nc = a.Malloc(Float32Array, 3);
          jc = Nc.byteOffset;
          Oc = a.Malloc(Float32Array, 3);
          kc = Oc.byteOffset;
          Pc = a.Malloc(Int32Array, 4);
          lc = Pc.byteOffset;
          a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
          a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
          a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
          a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
          a.Path.MakeFromCmds = function (d) {
            var g = w(d, "HEAPF32"),
              m = a.Path._MakeFromCmds(g, d.length);
            x(g, d);
            return m;
          };
          a.Path.MakeFromVerbsPointsWeights = function (d, g, m) {
            var r = w(d, "HEAPU8"),
              y = w(g, "HEAPF32"),
              D = w(m, "HEAPF32"),
              J = a.Path._MakeFromVerbsPointsWeights(
                r,
                d.length,
                y,
                g.length,
                D,
                m && m.length || 0,
              );
            x(r, d);
            x(y, g);
            x(D, m);
            return J;
          };
          a.Path.prototype.addArc = function (d, g, m) {
            d = S(d);
            this._addArc(d, g, m);
            return this;
          };
          a.Path.prototype.addOval = function (d, g, m) {
            void 0 === m && (m = 1);
            d = S(d);
            this._addOval(d, !!g, m);
            return this;
          };
          a.Path.prototype.addPath = function () {
            var d = Array.prototype.slice.call(arguments),
              g = d[0],
              m = !1;
            "boolean" === typeof d[d.length - 1] && (m = d.pop());
            if (1 === d.length) this._addPath(g, 1, 0, 0, 0, 1, 0, 0, 0, 1, m);
            else if (2 === d.length) {
              d = d[1],
                this._addPath(
                  g,
                  d[0],
                  d[1],
                  d[2],
                  d[3],
                  d[4],
                  d[5],
                  d[6] || 0,
                  d[7] || 0,
                  d[8] || 1,
                  m,
                );
            } else if (7 === d.length || 10 === d.length) {
              this._addPath(
                g,
                d[1],
                d[2],
                d[3],
                d[4],
                d[5],
                d[6],
                d[7] || 0,
                d[8] || 0,
                d[9] || 1,
                m,
              );
            } else return null;
            return this;
          };
          a.Path.prototype.addPoly = function (d, g) {
            var m = w(d, "HEAPF32");
            this._addPoly(m, d.length / 2, g);
            x(m, d);
            return this;
          };
          a.Path.prototype.addRect = function (d, g) {
            d = S(d);
            this._addRect(d, !!g);
            return this;
          };
          a.Path.prototype.addRRect = function (d, g) {
            d = oa(d);
            this._addRRect(d, !!g);
            return this;
          };
          a.Path.prototype.addVerbsPointsWeights = function (d, g, m) {
            var r = w(d, "HEAPU8"), y = w(g, "HEAPF32"), D = w(m, "HEAPF32");
            this._addVerbsPointsWeights(
              r,
              d.length,
              y,
              g.length,
              D,
              m && m.length || 0,
            );
            x(r, d);
            x(y, g);
            x(D, m);
          };
          a.Path.prototype.arc = function (d, g, m, r, y, D) {
            d = a.LTRBRect(d - m, g - m, d + m, g + m);
            y = (y - r) / Math.PI * 180 - 360 * !!D;
            D = new a.Path();
            D.addArc(d, r / Math.PI * 180, y);
            this.addPath(D, !0);
            D.delete();
            return this;
          };
          a.Path.prototype.arcToOval = function (d, g, m, r) {
            d = S(d);
            this._arcToOval(d, g, m, r);
            return this;
          };
          a.Path.prototype.arcToRotated = function (d, g, m, r, y, D, J) {
            this._arcToRotated(d, g, m, !!r, !!y, D, J);
            return this;
          };
          a.Path.prototype.arcToTangent = function (d, g, m, r, y) {
            this._arcToTangent(d, g, m, r, y);
            return this;
          };
          a.Path.prototype.close = function () {
            this._close();
            return this;
          };
          a.Path.prototype.conicTo = function (d, g, m, r, y) {
            this._conicTo(d, g, m, r, y);
            return this;
          };
          a.Path.prototype.computeTightBounds = function (d) {
            this._computeTightBounds(ja);
            var g = Ha.toTypedArray();
            return d ? (d.set(g), d) : g.slice();
          };
          a.Path.prototype.cubicTo = function (d, g, m, r, y, D) {
            this._cubicTo(d, g, m, r, y, D);
            return this;
          };
          a.Path.prototype.dash = function (d, g, m) {
            return this._dash(d, g, m) ? this : null;
          };
          a.Path.prototype.getBounds = function (d) {
            this._getBounds(ja);
            var g = Ha.toTypedArray();
            return d ? (d.set(g), d) : g.slice();
          };
          a.Path.prototype.lineTo = function (d, g) {
            this._lineTo(d, g);
            return this;
          };
          a.Path.prototype.moveTo = function (d, g) {
            this._moveTo(d, g);
            return this;
          };
          a.Path.prototype.offset = function (d, g) {
            this._transform(1, 0, d, 0, 1, g, 0, 0, 1);
            return this;
          };
          a.Path.prototype.quadTo = function (d, g, m, r) {
            this._quadTo(d, g, m, r);
            return this;
          };
          a.Path.prototype.rArcTo = function (d, g, m, r, y, D, J) {
            this._rArcTo(d, g, m, r, y, D, J);
            return this;
          };
          a.Path.prototype.rConicTo = function (d, g, m, r, y) {
            this._rConicTo(d, g, m, r, y);
            return this;
          };
          a.Path.prototype.rCubicTo = function (d, g, m, r, y, D) {
            this._rCubicTo(d, g, m, r, y, D);
            return this;
          };
          a.Path.prototype.rLineTo = function (d, g) {
            this._rLineTo(d, g);
            return this;
          };
          a.Path.prototype.rMoveTo = function (d, g) {
            this._rMoveTo(d, g);
            return this;
          };
          a.Path.prototype.rQuadTo = function (d, g, m, r) {
            this._rQuadTo(d, g, m, r);
            return this;
          };
          a.Path.prototype.stroke = function (d) {
            d = d || {};
            d.width = d.width || 1;
            d.miter_limit = d.miter_limit || 4;
            d.cap = d.cap || a.StrokeCap.Butt;
            d.join = d.join || a.StrokeJoin.Miter;
            d.precision = d.precision || 1;
            return this._stroke(d) ? this : null;
          };
          a.Path.prototype.transform = function () {
            if (1 === arguments.length) {
              var d = arguments[0];
              this._transform(
                d[0],
                d[1],
                d[2],
                d[3],
                d[4],
                d[5],
                d[6] || 0,
                d[7] || 0,
                d[8] || 1,
              );
            } else if (
              6 === arguments.length || 9 ===
                arguments.length
            ) {
              d = arguments,
                this._transform(
                  d[0],
                  d[1],
                  d[2],
                  d[3],
                  d[4],
                  d[5],
                  d[6] || 0,
                  d[7] || 0,
                  d[8] || 1,
                );
            } else {
              throw "transform expected to take 1 or 9 arguments. Got " +
                arguments.length;
            }
            return this;
          };
          a.Path.prototype.trim = function (d, g, m) {
            return this._trim(d, g, !!m) ? this : null;
          };
          a.Image.prototype.makeShaderCubic = function (d, g, m, r, y) {
            y = K(y);
            return this._makeShaderCubic(d, g, m, r, y);
          };
          a.Image.prototype.makeShaderOptions = function (d, g, m, r, y) {
            y = K(y);
            return this._makeShaderOptions(d, g, m, r, y);
          };
          a.Image.prototype.readPixels = function (d, g, m, r, y) {
            return e(this, d, g, m, r, y);
          };
          a.Canvas.prototype.clear = function (d) {
            a.Od(this.Md);
            d = A(d);
            this._clear(d);
          };
          a.Canvas.prototype.clipRRect = function (d, g, m) {
            a.Od(this.Md);
            d = oa(d);
            this._clipRRect(d, g, m);
          };
          a.Canvas.prototype.clipRect = function (d, g, m) {
            a.Od(this.Md);
            d = S(d);
            this._clipRect(d, g, m);
          };
          a.Canvas.prototype.concat = function (d) {
            a.Od(this.Md);
            d = O(d);
            this._concat(d);
          };
          a.Canvas.prototype.drawArc = function (d, g, m, r, y) {
            a.Od(this.Md);
            d = S(d);
            this._drawArc(d, g, m, r, y);
          };
          a.Canvas.prototype.drawAtlas = function (d, g, m, r, y, D, J) {
            if (d && r && g && m && g.length === m.length) {
              a.Od(this.Md);
              y || (y = a.BlendMode.SrcOver);
              var M = w(g, "HEAPF32"),
                Q = w(m, "HEAPF32"),
                V = m.length / 4,
                u = w(l(D), "HEAPU32");
              if (J && "B" in J && "C" in J) {
                this._drawAtlasCubic(d, Q, M, u, V, y, J.B, J.C, r);
              } else {
                let I = a.FilterMode.Linear, R = a.MipmapMode.None;
                J && (I = J.filter, "mipmap" in J && (R = J.mipmap));
                this._drawAtlasOptions(d, Q, M, u, V, y, I, R, r);
              }
              x(M, g);
              x(Q, m);
              x(u, D);
            }
          };
          a.Canvas.prototype.drawCircle = function (d, g, m, r) {
            a.Od(this.Md);
            this._drawCircle(d, g, m, r);
          };
          a.Canvas.prototype.drawColor = function (d, g) {
            a.Od(this.Md);
            d = A(d);
            void 0 !== g ? this._drawColor(d, g) : this._drawColor(d);
          };
          a.Canvas.prototype.drawColorInt = function (d, g) {
            a.Od(this.Md);
            this._drawColorInt(d, g || a.BlendMode.SrcOver);
          };
          a.Canvas.prototype.drawColorComponents = function (d, g, m, r, y) {
            a.Od(this.Md);
            d = N(d, g, m, r);
            void 0 !== y ? this._drawColor(d, y) : this._drawColor(d);
          };
          a.Canvas.prototype.drawDRRect = function (d, g, m) {
            a.Od(this.Md);
            d = oa(d, ic);
            g = oa(g, Sc);
            this._drawDRRect(d, g, m);
          };
          a.Canvas.prototype.drawGlyphs = function (d, g, m, r, y, D) {
            if (
              !(2 * d.length <=
                g.length)
            ) {
              throw "Not enough positions for the array of gyphs";
            }
            a.Od(this.Md);
            const J = w(d, "HEAPU16"), M = w(g, "HEAPF32");
            this._drawGlyphs(d.length, J, M, m, r, y, D);
            x(M, g);
            x(J, d);
          };
          a.Canvas.prototype.drawImage = function (d, g, m, r) {
            a.Od(this.Md);
            this._drawImage(d, g, m, r || null);
          };
          a.Canvas.prototype.drawImageCubic = function (d, g, m, r, y, D) {
            a.Od(this.Md);
            this._drawImageCubic(d, g, m, r, y, D || null);
          };
          a.Canvas.prototype.drawImageOptions = function (d, g, m, r, y, D) {
            a.Od(this.Md);
            this._drawImageOptions(d, g, m, r, y, D || null);
          };
          a.Canvas.prototype.drawImageNine = function (d, g, m, r, y) {
            a.Od(this.Md);
            g = w(g, "HEAP32", lc);
            m = S(m);
            this._drawImageNine(d, g, m, r, y || null);
          };
          a.Canvas.prototype.drawImageRect = function (d, g, m, r, y) {
            a.Od(this.Md);
            S(g, ja);
            S(m, Ua);
            this._drawImageRect(d, ja, Ua, r, !!y);
          };
          a.Canvas.prototype.drawImageRectCubic = function (d, g, m, r, y, D) {
            a.Od(this.Md);
            S(g, ja);
            S(m, Ua);
            this._drawImageRectCubic(d, ja, Ua, r, y, D || null);
          };
          a.Canvas.prototype.drawImageRectOptions = function (
            d,
            g,
            m,
            r,
            y,
            D,
          ) {
            a.Od(this.Md);
            S(g, ja);
            S(m, Ua);
            this._drawImageRectOptions(d, ja, Ua, r, y, D || null);
          };
          a.Canvas.prototype.drawLine = function (d, g, m, r, y) {
            a.Od(this.Md);
            this._drawLine(d, g, m, r, y);
          };
          a.Canvas.prototype.drawOval = function (d, g) {
            a.Od(this.Md);
            d = S(d);
            this._drawOval(d, g);
          };
          a.Canvas.prototype.drawPaint = function (d) {
            a.Od(this.Md);
            this._drawPaint(d);
          };
          a.Canvas.prototype.drawParagraph = function (d, g, m) {
            a.Od(this.Md);
            this._drawParagraph(d, g, m);
          };
          a.Canvas.prototype.drawPatch = function (d, g, m, r, y) {
            if (24 > d.length) throw "Need 12 cubic points";
            if (g && 4 > g.length) throw "Need 4 colors";
            if (m && 8 > m.length) throw "Need 4 shader coordinates";
            a.Od(this.Md);
            const D = w(d, "HEAPF32"),
              J = g ? w(l(g), "HEAPU32") : U,
              M = m ? w(m, "HEAPF32") : U;
            r || (r = a.BlendMode.Modulate);
            this._drawPatch(D, J, M, r, y);
            x(M, m);
            x(J, g);
            x(D, d);
          };
          a.Canvas.prototype.drawPath = function (d, g) {
            a.Od(this.Md);
            this._drawPath(d, g);
          };
          a.Canvas.prototype.drawPicture = function (d) {
            a.Od(this.Md);
            this._drawPicture(d);
          };
          a.Canvas.prototype.drawPoints = function (d, g, m) {
            a.Od(this.Md);
            var r = w(g, "HEAPF32");
            this._drawPoints(d, r, g.length / 2, m);
            x(r, g);
          };
          a.Canvas.prototype.drawRRect = function (d, g) {
            a.Od(this.Md);
            d = oa(d);
            this._drawRRect(d, g);
          };
          a.Canvas.prototype.drawRect = function (d, g) {
            a.Od(this.Md);
            d = S(d);
            this._drawRect(d, g);
          };
          a.Canvas.prototype.drawRect4f = function (d, g, m, r, y) {
            a.Od(this.Md);
            this._drawRect4f(d, g, m, r, y);
          };
          a.Canvas.prototype.drawShadow = function (d, g, m, r, y, D, J) {
            a.Od(this.Md);
            var M = w(y, "HEAPF32"), Q = w(D, "HEAPF32");
            g = w(g, "HEAPF32", jc);
            m = w(m, "HEAPF32", kc);
            this._drawShadow(d, g, m, r, M, Q, J);
            x(M, y);
            x(Q, D);
          };
          a.getShadowLocalBounds = function (d, g, m, r, y, D, J) {
            d = K(d);
            m = w(m, "HEAPF32", jc);
            r = w(r, "HEAPF32", kc);
            if (!this._getShadowLocalBounds(d, g, m, r, y, D, ja)) {
              return null;
            }
            g = Ha.toTypedArray();
            return J ? (J.set(g), J) : g.slice();
          };
          a.Canvas.prototype.drawTextBlob = function (d, g, m, r) {
            a.Od(this.Md);
            this._drawTextBlob(d, g, m, r);
          };
          a.Canvas.prototype.drawVertices = function (d, g, m) {
            a.Od(this.Md);
            this._drawVertices(d, g, m);
          };
          a.Canvas.prototype.getLocalToDevice = function () {
            this._getLocalToDevice(ab);
            for (var d = ab, g = Array(16), m = 0; 16 > m; m++) {
              g[m] = a.HEAPF32[d / 4 + m];
            }
            return g;
          };
          a.Canvas.prototype.getTotalMatrix = function () {
            this._getTotalMatrix(Na);
            for (var d = Array(9), g = 0; 9 > g; g++) {
              d[g] = a.HEAPF32[Na / 4 + g];
            }
            return d;
          };
          a.Canvas.prototype.makeSurface = function (d) {
            d = this._makeSurface(d);
            d.Md = this.Md;
            return d;
          };
          a.Canvas.prototype.readPixels = function (d, g, m, r, y) {
            a.Od(this.Md);
            return e(this, d, g, m, r, y);
          };
          a.Canvas.prototype.saveLayer = function (d, g, m, r) {
            g = S(g);
            return this._saveLayer(d || null, g, m || null, r || 0);
          };
          a.Canvas.prototype.writePixels = function (d, g, m, r, y, D, J, M) {
            if (d.byteLength % (g * m)) {
              throw "pixels length must be a multiple of the srcWidth * srcHeight";
            }
            a.Od(this.Md);
            var Q = d.byteLength / (g * m);
            D = D || a.AlphaType.Unpremul;
            J = J || a.ColorType.RGBA_8888;
            M = M || a.ColorSpace.SRGB;
            var V = Q * g;
            Q = w(d, "HEAPU8");
            g = this._writePixels(
              {
                width: g,
                height: m,
                colorType: J,
                alphaType: D,
                colorSpace: M,
              },
              Q,
              V,
              r,
              y,
            );
            x(Q, d);
            return g;
          };
          a.ColorFilter.MakeBlend = function (d, g) {
            d = A(d);
            return a.ColorFilter._MakeBlend(d, g);
          };
          a.ColorFilter.MakeMatrix = function (d) {
            if (!d || 20 !== d.length) throw "invalid color matrix";
            var g = w(d, "HEAPF32"), m = a.ColorFilter._makeMatrix(g);
            x(g, d);
            return m;
          };
          a.ContourMeasure.prototype.getPosTan = function (d, g) {
            this._getPosTan(d, ja);
            d = Ha.toTypedArray();
            return g ? (g.set(d), g) : d.slice();
          };
          a.ImageFilter.MakeMatrixTransform = function (d, g, m) {
            d = K(d);
            if ("B" in g && "C" in g) {
              return a.ImageFilter._MakeMatrixTransformCubic(d, g.yg, g.zg, m);
            }
            const r = g.filter;
            let y = a.MipmapMode.None;
            "mipmap" in g && (y = g.mipmap);
            return a.ImageFilter._MakeMatrixTransformOptions(d, r, y, m);
          };
          a.Paint.prototype.getColor = function () {
            this._getColor(ib);
            return Y(ib);
          };
          a.Paint.prototype.setColor = function (d, g) {
            g = g || null;
            d = A(d);
            this._setColor(d, g);
          };
          a.Paint.prototype.setColorComponents = function (d, g, m, r, y) {
            y = y || null;
            d = N(d, g, m, r);
            this._setColor(d, y);
          };
          a.Path.prototype.getPoint = function (d, g) {
            this._getPoint(d, ja);
            d = Ha.toTypedArray();
            return g ? (g[0] = d[0], g[1] = d[1], g) : d.slice(0, 2);
          };
          a.PictureRecorder.prototype.beginRecording = function (d) {
            d = S(d);
            return this._beginRecording(d);
          };
          a.Surface.prototype.getCanvas = function () {
            var d = this._getCanvas();
            d.Md = this.Md;
            return d;
          };
          a.Surface.prototype.makeImageSnapshot = function (d) {
            a.Od(this.Md);
            d = w(d, "HEAP32", lc);
            return this._makeImageSnapshot(d);
          };
          a.Surface.prototype.makeSurface = function (d) {
            a.Od(this.Md);
            d = this._makeSurface(d);
            d.Md = this.Md;
            return d;
          };
          a.Surface.prototype.requestAnimationFrame = function (d, g) {
            this.Ge || (this.Ge = this.getCanvas());
            requestAnimationFrame(function () {
              a.Od(this.Md);
              d(this.Ge);
              this.flush(g);
            }.bind(this));
          };
          a.Surface.prototype.drawOnce = function (d, g) {
            this.Ge || (this.Ge = this.getCanvas());
            requestAnimationFrame(function () {
              a.Od(this.Md);
              d(this.Ge);
              this.flush(g);
              this.dispose();
            }.bind(this));
          };
          a.PathEffect.MakeDash = function (d, g) {
            g || (g = 0);
            if (
              !d.length || 1 === d.length %
                  2
            ) {
              throw "Intervals array must have even length";
            }
            var m = w(d, "HEAPF32");
            g = a.PathEffect._MakeDash(m, d.length, g);
            x(m, d);
            return g;
          };
          a.Shader.MakeColor = function (d, g) {
            g = g || null;
            d = A(d);
            return a.Shader._MakeColor(d, g);
          };
          a.Shader.Blend = a.Shader.MakeBlend;
          a.Shader.Color = a.Shader.MakeColor;
          a.Shader.MakeLinearGradient = function (d, g, m, r, y, D, J, M) {
            M = M || null;
            var Q = F(m), V = w(r, "HEAPF32");
            J = J || 0;
            D = K(D);
            var u = Ha.toTypedArray();
            u.set(d);
            u.set(g, 2);
            d = a.Shader._MakeLinearGradient(
              ja,
              Q.ce,
              Q.Ke,
              V,
              Q.count,
              y,
              J,
              D,
              M,
            );
            x(Q.ce, m);
            r &&
              x(V, r);
            return d;
          };
          a.Shader.MakeRadialGradient = function (d, g, m, r, y, D, J, M) {
            M = M || null;
            var Q = F(m), V = w(r, "HEAPF32");
            J = J || 0;
            D = K(D);
            d = a.Shader._MakeRadialGradient(
              d[0],
              d[1],
              g,
              Q.ce,
              Q.Ke,
              V,
              Q.count,
              y,
              J,
              D,
              M,
            );
            x(Q.ce, m);
            r && x(V, r);
            return d;
          };
          a.Shader.MakeSweepGradient = function (d, g, m, r, y, D, J, M, Q, V) {
            V = V || null;
            var u = F(m), I = w(r, "HEAPF32");
            J = J || 0;
            M = M || 0;
            Q = Q || 360;
            D = K(D);
            d = a.Shader._MakeSweepGradient(
              d,
              g,
              u.ce,
              u.Ke,
              I,
              u.count,
              y,
              M,
              Q,
              J,
              D,
              V,
            );
            x(u.ce, m);
            r && x(I, r);
            return d;
          };
          a.Shader.MakeTwoPointConicalGradient = function (
            d,
            g,
            m,
            r,
            y,
            D,
            J,
            M,
            Q,
            V,
          ) {
            V = V || null;
            var u = F(y), I = w(D, "HEAPF32");
            Q = Q || 0;
            M = K(M);
            var R = Ha.toTypedArray();
            R.set(d);
            R.set(m, 2);
            d = a.Shader._MakeTwoPointConicalGradient(
              ja,
              g,
              r,
              u.ce,
              u.Ke,
              I,
              u.count,
              J,
              Q,
              M,
              V,
            );
            x(u.ce, y);
            D && x(I, D);
            return d;
          };
          a.Vertices.prototype.bounds = function (d) {
            this._bounds(ja);
            var g = Ha.toTypedArray();
            return d ? (d.set(g), d) : g.slice();
          };
          a.Vd && a.Vd.forEach(function (d) {
            d();
          });
        };
        a.computeTonalColors = function (e) {
          var d = w(e.ambient, "HEAPF32"), g = w(e.spot, "HEAPF32");
          this._computeTonalColors(d, g);
          var m = { ambient: Y(d), spot: Y(g) };
          x(d, e.ambient);
          x(g, e.spot);
          return m;
        };
        a.LTRBRect = function (e, d, g, m) {
          return Float32Array.of(e, d, g, m);
        };
        a.XYWHRect = function (e, d, g, m) {
          return Float32Array.of(e, d, e + g, d + m);
        };
        a.LTRBiRect = function (e, d, g, m) {
          return Int32Array.of(e, d, g, m);
        };
        a.XYWHiRect = function (e, d, g, m) {
          return Int32Array.of(e, d, e + g, d + m);
        };
        a.RRectXY = function (e, d, g) {
          return Float32Array.of(
            e[0],
            e[1],
            e[2],
            e[3],
            d,
            g,
            d,
            g,
            d,
            g,
            d,
            g,
          );
        };
        a.MakeAnimatedImageFromEncoded = function (e) {
          e = new Uint8Array(e);
          var d = a._malloc(e.byteLength);
          a.HEAPU8.set(e, d);
          return (e = a._decodeAnimatedImage(d, e.byteLength)) ? e : null;
        };
        a.MakeImageFromEncoded = function (e) {
          e = new Uint8Array(e);
          var d = a._malloc(e.byteLength);
          a.HEAPU8.set(e, d);
          return (e = a._decodeImage(d, e.byteLength)) ? e : null;
        };
        var lb = null;
        a.MakeImageFromCanvasImageSource = function (e) {
          var d = e.width, g = e.height;
          lb || (lb = document.createElement("canvas"));
          lb.width = d;
          lb.height = g;
          var m = lb.getContext("2d");
          m.drawImage(e, 0, 0);
          e = m.getImageData(0, 0, d, g);
          return a.MakeImage(
            {
              width: d,
              height: g,
              alphaType: a.AlphaType.Unpremul,
              colorType: a.ColorType.RGBA_8888,
              colorSpace: a.ColorSpace.SRGB,
            },
            e.data,
            4 * d,
          );
        };
        a.MakeImage = function (e, d, g) {
          var m = a._malloc(d.length);
          a.HEAPU8.set(d, m);
          return a._MakeImage(e, m, d.length, g);
        };
        a.MakeVertices = function (e, d, g, m, r, y) {
          var D = r && r.length || 0, J = 0;
          g && g.length && (J |= 1);
          m && m.length && (J |= 2);
          void 0 === y || y || (J |= 4);
          e = new a._VerticesBuilder(e, d.length / 2, D, J);
          w(d, "HEAPF32", e.positions());
          e.texCoords() && w(g, "HEAPF32", e.texCoords());
          e.colors() && w(l(m), "HEAPU32", e.colors());
          e.indices() && w(r, "HEAPU16", e.indices());
          return e.detach();
        };
        a.Matrix = {};
        a.Matrix.identity = function () {
          return c(3);
        };
        a.Matrix.invert = function (e) {
          var d = e[0] * e[4] * e[8] + e[1] * e[5] * e[6] + e[2] * e[3] * e[7] -
            e[2] * e[4] * e[6] - e[1] * e[3] * e[8] - e[0] * e[5] * e[7];
          return d
            ? [
              (e[4] * e[8] - e[5] * e[7]) / d,
              (e[2] * e[7] - e[1] * e[8]) / d,
              (e[1] * e[5] - e[2] * e[4]) / d,
              (e[5] * e[6] - e[3] * e[8]) / d,
              (e[0] * e[8] - e[2] * e[6]) / d,
              (e[2] * e[3] - e[0] * e[5]) / d,
              (e[3] * e[7] - e[4] * e[6]) / d,
              (e[1] * e[6] - e[0] * e[7]) / d,
              (e[0] * e[4] - e[1] * e[3]) / d,
            ]
            : null;
        };
        a.Matrix.mapPoints = function (e, d) {
          for (var g = 0; g < d.length; g += 2) {
            var m = d[g],
              r = d[g + 1],
              y = e[6] * m + e[7] * r + e[8],
              D = e[3] * m + e[4] * r + e[5];
            d[g] = (e[0] * m + e[1] * r + e[2]) / y;
            d[g + 1] = D / y;
          }
          return d;
        };
        a.Matrix.multiply = function () {
          return kb(3, arguments);
        };
        a.Matrix.rotated = function (e, d, g) {
          d = d || 0;
          g = g || 0;
          var m = Math.sin(e);
          e = Math.cos(e);
          return [
            e,
            -m,
            ta(m, g, 1 - e, d),
            m,
            e,
            ta(-m, d, 1 - e, g),
            0,
            0,
            1,
          ];
        };
        a.Matrix.scaled = function (e, d, g, m) {
          g = g || 0;
          m = m || 0;
          var r = b([e, d], c(3), 3, 0, 1);
          return b([g - e * g, m - d * m], r, 3, 2, 0);
        };
        a.Matrix.skewed = function (e, d, g, m) {
          g = g || 0;
          m = m || 0;
          var r = b([e, d], c(3), 3, 1, -1);
          return b([-e * g, -d * m], r, 3, 2, 0);
        };
        a.Matrix.translated = function (e, d) {
          return b(arguments, c(3), 3, 2, 0);
        };
        a.Vector = {};
        a.Vector.dot = function (e, d) {
          return e.map(function (g, m) {
            return g * d[m];
          }).reduce(function (g, m) {
            return g + m;
          });
        };
        a.Vector.lengthSquared = function (e) {
          return a.Vector.dot(e, e);
        };
        a.Vector.length = function (e) {
          return Math.sqrt(a.Vector.lengthSquared(e));
        };
        a.Vector.mulScalar = function (e, d) {
          return e.map(function (g) {
            return g * d;
          });
        };
        a.Vector.add = function (e, d) {
          return e.map(function (g, m) {
            return g + d[m];
          });
        };
        a.Vector.sub = function (e, d) {
          return e.map(function (g, m) {
            return g - d[m];
          });
        };
        a.Vector.dist = function (e, d) {
          return a.Vector.length(a.Vector.sub(e, d));
        };
        a.Vector.normalize = function (e) {
          return a.Vector.mulScalar(e, 1 / a.Vector.length(e));
        };
        a.Vector.cross = function (e, d) {
          return [
            e[1] * d[2] - e[2] * d[1],
            e[2] * d[0] - e[0] * d[2],
            e[0] * d[1] - e[1] * d[0],
          ];
        };
        a.M44 = {};
        a.M44.identity = function () {
          return c(4);
        };
        a.M44.translated = function (e) {
          return b(e, c(4), 4, 3, 0);
        };
        a.M44.scaled = function (e) {
          return b(e, c(4), 4, 0, 1);
        };
        a.M44.rotated = function (e, d) {
          return a.M44.rotatedUnitSinCos(
            a.Vector.normalize(e),
            Math.sin(d),
            Math.cos(d),
          );
        };
        a.M44.rotatedUnitSinCos = function (e, d, g) {
          var m = e[0], r = e[1];
          e = e[2];
          var y = 1 - g;
          return [
            y * m * m + g,
            y * m * r - d * e,
            y * m * e + d * r,
            0,
            y * m * r + d * e,
            y * r * r + g,
            y * r * e - d * m,
            0,
            y * m * e - d * r,
            y * r * e + d * m,
            y * e * e + g,
            0,
            0,
            0,
            0,
            1,
          ];
        };
        a.M44.lookat = function (e, d, g) {
          d = a.Vector.normalize(a.Vector.sub(d, e));
          g = a.Vector.normalize(g);
          g = a.Vector.normalize(a.Vector.cross(d, g));
          var m = a.M44.identity();
          b(g, m, 4, 0, 0);
          b(a.Vector.cross(g, d), m, 4, 1, 0);
          b(a.Vector.mulScalar(d, -1), m, 4, 2, 0);
          b(e, m, 4, 3, 0);
          e = a.M44.invert(m);
          return null === e ? a.M44.identity() : e;
        };
        a.M44.perspective = function (e, d, g) {
          var m = 1 / (d - e);
          g /= 2;
          g = Math.cos(g) / Math.sin(g);
          return [
            g,
            0,
            0,
            0,
            0,
            g,
            0,
            0,
            0,
            0,
            (d + e) * m,
            2 * d * e * m,
            0,
            0,
            -1,
            1,
          ];
        };
        a.M44.rc = function (e, d, g) {
          return e[4 * d + g];
        };
        a.M44.multiply = function () {
          return kb(4, arguments);
        };
        a.M44.invert = function (e) {
          var d = e[0],
            g = e[4],
            m = e[8],
            r = e[12],
            y = e[1],
            D = e[5],
            J = e[9],
            M = e[13],
            Q = e[2],
            V = e[6],
            u = e[10],
            I = e[14],
            R = e[3],
            aa = e[7],
            ka = e[11];
          e = e[15];
          var qa = d * D - g * y,
            ua = d * J - m * y,
            ya = d * M - r * y,
            ea = g * J - m * D,
            G = g * M - r * D,
            k = m * M - r * J,
            p = Q * aa - V * R,
            z = Q * ka - u * R,
            B = Q * e - I * R,
            C = V * ka - u * aa,
            E = V * e - I * aa,
            L = u * e - I * ka,
            ba = qa * L - ua * E + ya * C + ea * B - G * z + k * p,
            ca = 1 / ba;
          if (0 === ba || Infinity === ca) return null;
          qa *= ca;
          ua *= ca;
          ya *= ca;
          ea *= ca;
          G *= ca;
          k *= ca;
          p *= ca;
          z *= ca;
          B *= ca;
          C *= ca;
          E *= ca;
          L *= ca;
          d = [
            D * L - J * E + M * C,
            J * B - y * L - M * z,
            y * E - D * B + M * p,
            D * z - y * C - J * p,
            m * E - g * L - r * C,
            d * L - m * B + r * z,
            g * B - d * E - r * p,
            d * C - g * z + m * p,
            aa * k - ka * G + e * ea,
            ka * ya - R * k - e * ua,
            R * G - aa * ya + e * qa,
            aa * ua - R * ea - ka * qa,
            u * G - V * k - I * ea,
            Q * k - u * ya + I * ua,
            V * ya - Q * G - I * qa,
            Q * ea - V * ua + u * qa,
          ];
          return d.every(function (Ia) {
              return !isNaN(Ia) && Infinity !== Ia && -Infinity !== Ia;
            })
            ? d
            : null;
        };
        a.M44.transpose = function (e) {
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
        a.M44.mustInvert = function (e) {
          e = a.M44.invert(e);
          if (null === e) throw "Matrix not invertible";
          return e;
        };
        a.M44.setupCamera = function (e, d, g) {
          var m = a.M44.lookat(g.eye, g.coa, g.up);
          g = a.M44.perspective(g.near, g.far, g.angle);
          d = [(e[2] - e[0]) / 2, (e[3] - e[1]) / 2, d];
          e = a.M44.multiply(
            a.M44.translated([(e[0] + e[2]) / 2, (e[1] + e[3]) / 2, 0]),
            a.M44.scaled(d),
          );
          return a.M44.multiply(e, g, m, a.M44.mustInvert(e));
        };
        a.ColorMatrix = {};
        a.ColorMatrix.identity = function () {
          var e = new Float32Array(20);
          e[0] = 1;
          e[6] = 1;
          e[12] = 1;
          e[18] = 1;
          return e;
        };
        a.ColorMatrix.scaled = function (e, d, g, m) {
          var r = new Float32Array(20);
          r[0] = e;
          r[6] = d;
          r[12] = g;
          r[18] = m;
          return r;
        };
        var Gd = [[6, 7, 11, 12], [0, 10, 2, 12], [0, 1, 5, 6]];
        a.ColorMatrix.rotated = function (e, d, g) {
          var m = a.ColorMatrix.identity();
          e = Gd[e];
          m[e[0]] = g;
          m[e[1]] = d;
          m[e[2]] = -d;
          m[e[3]] = g;
          return m;
        };
        a.ColorMatrix.postTranslate = function (e, d, g, m, r) {
          e[4] += d;
          e[9] += g;
          e[14] += m;
          e[19] += r;
          return e;
        };
        a.ColorMatrix.concat = function (e, d) {
          for (var g = new Float32Array(20), m = 0, r = 0; 20 > r; r += 5) {
            for (
              var y = 0;
              4 >
                y;
              y++
            ) {
              g[m++] = e[r] * d[y] + e[r + 1] * d[y + 5] +
                e[r + 2] * d[y + 10] + e[r + 3] * d[y + 15];
            }
            g[m++] = e[r] * d[4] + e[r + 1] * d[9] + e[r + 2] * d[14] +
              e[r + 3] * d[19] + e[r + 4];
          }
          return g;
        };
        (function (e) {
          e.Vd = e.Vd || [];
          e.Vd.push(function () {
            function d(u) {
              if (!u || !u.length) return [];
              for (var I = [], R = 0; R < u.length; R += 5) {
                var aa = e.LTRBRect(u[R], u[R + 1], u[R + 2], u[R + 3]);
                aa.direction = 0 === u[R + 4]
                  ? e.TextDirection.RTL
                  : e.TextDirection.LTR;
                I.push(aa);
              }
              e._free(u.byteOffset);
              return I;
            }
            function g(u) {
              u = u || {};
              void 0 === u.weight && (u.weight = e.FontWeight.Normal);
              u.width = u.width ||
                e.FontWidth.Normal;
              u.slant = u.slant || e.FontSlant.Upright;
              return u;
            }
            function m(u) {
              if (!u || !u.length) return U;
              for (var I = [], R = 0; R < u.length; R++) {
                var aa = r(u[R]);
                I.push(aa);
              }
              return w(I, "HEAPU32");
            }
            function r(u) {
              if (J[u]) return J[u];
              var I = na(u) + 1, R = e._malloc(I);
              pa(u, H, R, I);
              return J[u] = R;
            }
            function y(u) {
              u._colorPtr = A(u.color);
              u._foregroundColorPtr = U;
              u._backgroundColorPtr = U;
              u._decorationColorPtr = U;
              u.foregroundColor &&
                (u._foregroundColorPtr = A(u.foregroundColor, M));
              u.backgroundColor &&
                (u._backgroundColorPtr = A(u.backgroundColor, Q));
              u.decorationColor &&
                (u._decorationColorPtr = A(u.decorationColor, V));
              Array.isArray(u.fontFamilies) && u.fontFamilies.length
                ? (u._fontFamiliesPtr = m(u.fontFamilies),
                  u._fontFamiliesLen = u.fontFamilies.length)
                : (u._fontFamiliesPtr = U, u._fontFamiliesLen = 0);
              if (u.locale) {
                var I = u.locale;
                u._localePtr = r(I);
                u._localeLen = na(I) + 1;
              } else u._localePtr = U, u._localeLen = 0;
              if (Array.isArray(u.shadows) && u.shadows.length) {
                I = u.shadows;
                var R = I.map(function (ea) {
                    return ea.color || e.BLACK;
                  }),
                  aa = I.map(function (ea) {
                    return ea.blurRadius ||
                      0;
                  });
                u._shadowLen = I.length;
                for (
                  var ka = e._malloc(8 * I.length), qa = ka / 4, ua = 0;
                  ua < I.length;
                  ua++
                ) {
                  var ya = I[ua].offset || [0, 0];
                  e.HEAPF32[qa] = ya[0];
                  e.HEAPF32[qa + 1] = ya[1];
                  qa += 2;
                }
                u._shadowColorsPtr = F(R).ce;
                u._shadowOffsetsPtr = ka;
                u._shadowBlurRadiiPtr = w(aa, "HEAPF32");
              } else {
                u._shadowLen = 0,
                  u._shadowColorsPtr = U,
                  u._shadowOffsetsPtr = U,
                  u._shadowBlurRadiiPtr = U;
              }
              Array.isArray(u.fontFeatures) && u.fontFeatures.length
                ? (I = u.fontFeatures,
                  R = I.map(function (ea) {
                    return ea.name;
                  }),
                  aa = I.map(function (ea) {
                    return ea.value;
                  }),
                  u._fontFeatureLen = I.length,
                  u._fontFeatureNamesPtr = m(R),
                  u._fontFeatureValuesPtr = w(aa, "HEAPU32"))
                : (u._fontFeatureLen = 0,
                  u._fontFeatureNamesPtr = U,
                  u._fontFeatureValuesPtr = U);
            }
            function D(u) {
              e._free(u._fontFamiliesPtr);
              e._free(u._shadowColorsPtr);
              e._free(u._shadowOffsetsPtr);
              e._free(u._shadowBlurRadiiPtr);
              e._free(u._fontFeatureNamesPtr);
              e._free(u._fontFeatureValuesPtr);
            }
            e.Paragraph.prototype.getRectsForRange = function (u, I, R, aa) {
              u = this._getRectsForRange(u, I, R, aa);
              return d(u);
            };
            e.Paragraph.prototype.getRectsForPlaceholders = function () {
              var u = this._getRectsForPlaceholders();
              return d(u);
            };
            e.TypefaceFontProvider.prototype.registerFont = function (u, I) {
              u = e.Typeface.MakeFreeTypeFaceFromData(u);
              if (!u) return null;
              I = r(I);
              this._registerFont(u, I);
            };
            e.ParagraphStyle = function (u) {
              u.disableHinting = u.disableHinting || !1;
              if (u.ellipsis) {
                var I = u.ellipsis;
                u._ellipsisPtr = r(I);
                u._ellipsisLen = na(I) + 1;
              } else u._ellipsisPtr = U, u._ellipsisLen = 0;
              u.heightMultiplier = u.heightMultiplier || 0;
              u.maxLines = u.maxLines || 0;
              I = (I = u.strutStyle) || {};
              I.strutEnabled = I.strutEnabled || !1;
              I.strutEnabled &&
                Array.isArray(I.fontFamilies) && I.fontFamilies.length
                ? (I._fontFamiliesPtr = m(I.fontFamilies),
                  I._fontFamiliesLen = I.fontFamilies.length)
                : (I._fontFamiliesPtr = U, I._fontFamiliesLen = 0);
              I.fontStyle = g(I.fontStyle);
              I.fontSize = I.fontSize || 0;
              I.heightMultiplier = I.heightMultiplier || 0;
              I.halfLeading = I.halfLeading || !1;
              I.leading = I.leading || 0;
              I.forceStrutHeight = I.forceStrutHeight || !1;
              u.strutStyle = I;
              u.textAlign = u.textAlign || e.TextAlign.Start;
              u.textDirection = u.textDirection || e.TextDirection.LTR;
              u.textHeightBehavior = u.textHeightBehavior ||
                e.TextHeightBehavior.All;
              u.textStyle = e.TextStyle(u.textStyle);
              return u;
            };
            e.TextStyle = function (u) {
              u.color || (u.color = e.BLACK);
              u.decoration = u.decoration || 0;
              u.decorationThickness = u.decorationThickness || 0;
              u.decorationStyle = u.decorationStyle || e.DecorationStyle.Solid;
              u.textBaseline = u.textBaseline || e.TextBaseline.Alphabetic;
              u.fontSize = u.fontSize || 0;
              u.letterSpacing = u.letterSpacing || 0;
              u.wordSpacing = u.wordSpacing || 0;
              u.heightMultiplier = u.heightMultiplier || 0;
              u.halfLeading = u.halfLeading || !1;
              u.fontStyle = g(u.fontStyle);
              return u;
            };
            var J = {}, M = e._malloc(16), Q = e._malloc(16), V = e._malloc(16);
            e.ParagraphBuilder.Make = function (u, I) {
              y(u.textStyle);
              I = e.ParagraphBuilder._Make(u, I);
              D(u.textStyle);
              return I;
            };
            e.ParagraphBuilder.MakeFromFontProvider = function (u, I) {
              y(u.textStyle);
              I = e.ParagraphBuilder._MakeFromFontProvider(u, I);
              D(u.textStyle);
              return I;
            };
            e.ParagraphBuilder.ShapeText = function (u, I, R) {
              let aa = 0;
              for (const ka of I) aa += ka.length;
              if (aa !== u.length) {
                throw "Accumulated block lengths must equal text.length";
              }
              return e.ParagraphBuilder._ShapeText(u, I, R);
            };
            e.ParagraphBuilder.prototype.pushStyle = function (u) {
              y(u);
              this._pushStyle(u);
              D(u);
            };
            e.ParagraphBuilder.prototype.pushPaintStyle = function (u, I, R) {
              y(u);
              this._pushPaintStyle(u, I, R);
              D(u);
            };
            e.ParagraphBuilder.prototype.addPlaceholder = function (
              u,
              I,
              R,
              aa,
              ka,
            ) {
              R = R || e.PlaceholderAlignment.Baseline;
              aa = aa || e.TextBaseline.Alphabetic;
              this._addPlaceholder(u || 0, I || 0, R, aa, ka || 0);
            };
          });
        })(t);
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.Path.prototype.op = function (e, d) {
            return this._op(e, d) ? this : null;
          };
          a.Path.prototype.simplify = function () {
            return this._simplify() ? this : null;
          };
        });
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.Canvas.prototype.drawText = function (e, d, g, m, r) {
            var y = na(e), D = a._malloc(y + 1);
            pa(e, H, D, y + 1);
            this._drawSimpleText(D, y, d, g, r, m);
            a._free(D);
          };
          a.Font.prototype.getGlyphBounds = function (e, d, g) {
            var m = w(e, "HEAPU16"), r = a._malloc(16 * e.length);
            this._getGlyphWidthBounds(m, e.length, U, r, d || null);
            d = new Float32Array(a.HEAPU8.buffer, r, 4 * e.length);
            x(m, e);
            if (g) return g.set(d), a._free(r), g;
            e = Float32Array.from(d);
            a._free(r);
            return e;
          };
          a.Font.prototype.getGlyphIDs = function (e, d, g) {
            d || (d = e.length);
            var m = na(e) + 1, r = a._malloc(m);
            pa(e, H, r, m);
            e = a._malloc(2 * d);
            d = this._getGlyphIDs(r, m - 1, d, e);
            a._free(r);
            if (0 > d) return a._free(e), null;
            r = new Uint16Array(a.HEAPU8.buffer, e, d);
            if (g) return g.set(r), a._free(e), g;
            g = Uint16Array.from(r);
            a._free(e);
            return g;
          };
          a.Font.prototype.getGlyphIntercepts = function (e, d, g, m) {
            var r = w(e, "HEAPU16"), y = w(d, "HEAPF32");
            return this._getGlyphIntercepts(
              r,
              e.length,
              !(e && e._ck),
              y,
              d.length,
              !(d && d._ck),
              g,
              m,
            );
          };
          a.Font.prototype.getGlyphWidths = function (e, d, g) {
            var m = w(e, "HEAPU16"), r = a._malloc(4 * e.length);
            this._getGlyphWidthBounds(m, e.length, r, U, d || null);
            d = new Float32Array(a.HEAPU8.buffer, r, e.length);
            x(m, e);
            if (g) return g.set(d), a._free(r), g;
            e = Float32Array.from(d);
            a._free(r);
            return e;
          };
          a.FontMgr.FromData = function () {
            if (!arguments.length) return null;
            var e = arguments;
            1 === e.length && Array.isArray(e[0]) && (e = arguments[0]);
            if (!e.length) return null;
            for (var d = [], g = [], m = 0; m < e.length; m++) {
              var r = new Uint8Array(e[m]), y = w(r, "HEAPU8");
              d.push(y);
              g.push(r.byteLength);
            }
            d = w(d, "HEAPU32");
            g = w(g, "HEAPU32");
            e = a.FontMgr._fromData(d, g, e.length);
            a._free(d);
            a._free(g);
            return e;
          };
          a.Typeface.MakeFreeTypeFaceFromData = function (e) {
            e = new Uint8Array(e);
            var d = w(e, "HEAPU8");
            return (e = a.Typeface._MakeFreeTypeFaceFromData(d, e.byteLength))
              ? e
              : null;
          };
          a.Typeface.prototype.getGlyphIDs = function (e, d, g) {
            d || (d = e.length);
            var m = na(e) + 1, r = a._malloc(m);
            pa(e, H, r, m);
            e = a._malloc(2 * d);
            d = this._getGlyphIDs(r, m - 1, d, e);
            a._free(r);
            if (0 > d) return a._free(e), null;
            r = new Uint16Array(a.HEAPU8.buffer, e, d);
            if (g) return g.set(r), a._free(e), g;
            g = Uint16Array.from(r);
            a._free(e);
            return g;
          };
          a.TextBlob.MakeOnPath = function (e, d, g, m) {
            if (e && e.length && d && d.countPoints()) {
              if (1 === d.countPoints()) return this.MakeFromText(e, g);
              m || (m = 0);
              var r = g.getGlyphIDs(e);
              r = g.getGlyphWidths(r);
              var y = [];
              d = new a.ContourMeasureIter(d, !1, 1);
              for (
                var D = d.next(), J = new Float32Array(4), M = 0;
                M < e.length && D;
                M++
              ) {
                var Q = r[M];
                m += Q / 2;
                if (m > D.length()) {
                  D.delete();
                  D = d.next();
                  if (!D) {
                    e = e.substring(0, M);
                    break;
                  }
                  m = Q / 2;
                }
                D.getPosTan(m, J);
                var V = J[2], u = J[3];
                y.push(V, u, J[0] - Q / 2 * V, J[1] - Q / 2 * u);
                m += Q / 2;
              }
              e = this.MakeFromRSXform(e, y, g);
              D && D.delete();
              d.delete();
              return e;
            }
          };
          a.TextBlob.MakeFromRSXform = function (e, d, g) {
            var m = na(e) + 1, r = a._malloc(m);
            pa(e, H, r, m);
            e = w(d, "HEAPF32");
            g = a.TextBlob._MakeFromRSXform(r, m - 1, e, g);
            a._free(r);
            return g ? g : null;
          };
          a.TextBlob.MakeFromRSXformGlyphs = function (e, d, g) {
            var m = w(e, "HEAPU16");
            d = w(d, "HEAPF32");
            g = a.TextBlob._MakeFromRSXformGlyphs(m, 2 * e.length, d, g);
            x(m, e);
            return g ? g : null;
          };
          a.TextBlob.MakeFromGlyphs = function (e, d) {
            var g = w(e, "HEAPU16");
            d = a.TextBlob._MakeFromGlyphs(g, 2 * e.length, d);
            x(g, e);
            return d ? d : null;
          };
          a.TextBlob.MakeFromText = function (e, d) {
            var g = na(e) + 1, m = a._malloc(g);
            pa(e, H, m, g);
            e = a.TextBlob._MakeFromText(m, g - 1, d);
            a._free(m);
            return e ? e : null;
          };
          a.MallocGlyphIDs = function (e) {
            return a.Malloc(Uint16Array, e);
          };
        });
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.MakePicture = function (e) {
            e = new Uint8Array(e);
            var d = a._malloc(e.byteLength);
            a.HEAPU8.set(e, d);
            return (e = a._MakePicture(d, e.byteLength)) ? e : null;
          };
        });
        (function () {
          function e(G) {
            for (var k = 0; k < G.length; k++) {
              if (void 0 !== G[k] && !Number.isFinite(G[k])) return !1;
            }
            return !0;
          }
          function d(G) {
            var k = a.getColorComponents(G);
            G = k[0];
            var p = k[1], z = k[2];
            k = k[3];
            if (1 === k) {
              return G = G.toString(16).toLowerCase(),
                p = p.toString(16).toLowerCase(),
                z = z.toString(16).toLowerCase(),
                G = 1 === G.length ? "0" + G : G,
                p = 1 === p.length ? "0" + p : p,
                z = 1 === z.length ? "0" + z : z,
                "#" + G + p + z;
            }
            k = 0 === k || 1 === k ? k : k.toFixed(8);
            return "rgba(" + G + ", " + p + ", " + z + ", " + k + ")";
          }
          function g(G) {
            return a.parseColorString(G, ua);
          }
          function m(G) {
            G = ya.exec(G);
            if (!G) return null;
            var k = parseFloat(G[4]), p = 16;
            switch (G[5]) {
              case "em":
              case "rem":
                p = 16 *
                  k;
                break;
              case "pt":
                p = 4 * k / 3;
                break;
              case "px":
                p = k;
                break;
              case "pc":
                p = 16 * k;
                break;
              case "in":
                p = 96 * k;
                break;
              case "cm":
                p = 96 * k / 2.54;
                break;
              case "mm":
                p = 96 / 25.4 * k;
                break;
              case "q":
                p = 96 / 25.4 / 4 * k;
                break;
              case "%":
                p = 16 / 75 * k;
            }
            return {
              style: G[1],
              variant: G[2],
              weight: G[3],
              sizePx: p,
              family: G[6].trim(),
            };
          }
          function r(G) {
            this.Nd = G;
            this.Qd = new a.Paint();
            this.Qd.setAntiAlias(!0);
            this.Qd.setStrokeMiter(10);
            this.Qd.setStrokeCap(a.StrokeCap.Butt);
            this.Qd.setStrokeJoin(a.StrokeJoin.Miter);
            this.Pe = "10px monospace";
            this.ne = new a.Font(null, 10);
            this.ne.setSubpixel(!0);
            this.be = this.he = a.BLACK;
            this.ue = 0;
            this.Ie = a.TRANSPARENT;
            this.we = this.ve = 0;
            this.Je = this.je = 1;
            this.He = 0;
            this.te = [];
            this.Pd = a.BlendMode.SrcOver;
            this.Qd.setStrokeWidth(this.Je);
            this.Qd.setBlendMode(this.Pd);
            this.Td = new a.Path();
            this.Ud = a.Matrix.identity();
            this.kf = [];
            this.Ae = [];
            this.me = function () {
              this.Td.delete();
              this.Qd.delete();
              this.ne.delete();
              this.Ae.forEach(function (k) {
                k.me();
              });
            };

            Object.defineProperty(this, "currentTransform", {
              enumerable: !0,
              get: function () {
                return {
                  a: this.Ud[0],
                  c: this.Ud[1],
                  e: this.Ud[2],
                  b: this.Ud[3],
                  d: this.Ud[4],
                  f: this.Ud[5],
                };
              },
              set: function (k) {
                k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
              },
            });
            Object.defineProperty(this, "fillStyle", {
              enumerable: !0,
              get: function () {
                return f(this.be) ? d(this.be) : this.be;
              },
              set: function (k) {
                k = maybeHSL(k);
                "string" === typeof k ? this.be = g(k) : k.se && (this.be = k);
              },
            });
            Object.defineProperty(this, "font", {
              enumerable: !0,
              get: function () {
                return this.Pe;
              },
              set: function (k) {
                var p = m(k), z = p.family;
                p.typeface = ea[z]
                  ? ea[z][
                    (p.style || "normal") + "|" + (p.variant || "normal") +
                    "|" + (p.weight || "normal")
                  ] ||
                    ea[z]["*"]
                  : null;
                p &&
                  (this.ne.setSize(p.sizePx),
                    this.ne.setTypeface(p.typeface),
                    this.Pe = k);
              },
            });
            Object.defineProperty(this, "globalAlpha", {
              enumerable: !0,
              get: function () {
                return this.je;
              },
              set: function (k) {
                !isFinite(k) || 0 > k || 1 < k || (this.je = k);
              },
            });
            Object.defineProperty(this, "globalCompositeOperation", {
              enumerable: !0,
              get: function () {
                switch (this.Pd) {
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
                    this.Pd = a.BlendMode.SrcOver;
                    break;
                  case "destination-over":
                    this.Pd = a.BlendMode.DstOver;
                    break;
                  case "copy":
                    this.Pd = a.BlendMode.Src;
                    break;
                  case "destination":
                    this.Pd = a.BlendMode.Dst;
                    break;
                  case "clear":
                    this.Pd = a.BlendMode.Clear;
                    break;
                  case "source-in":
                    this.Pd = a.BlendMode.SrcIn;
                    break;
                  case "destination-in":
                    this.Pd = a.BlendMode.DstIn;
                    break;
                  case "source-out":
                    this.Pd = a.BlendMode.SrcOut;
                    break;
                  case "destination-out":
                    this.Pd = a.BlendMode.DstOut;
                    break;
                  case "source-atop":
                    this.Pd = a.BlendMode.SrcATop;
                    break;
                  case "destination-atop":
                    this.Pd = a.BlendMode.DstATop;
                    break;
                  case "xor":
                    this.Pd = a.BlendMode.Xor;
                    break;
                  case "lighter":
                    this.Pd = a.BlendMode.Plus;
                    break;
                  case "plus-lighter":
                    this.Pd = a.BlendMode.Plus;
                    break;
                  case "plus-darker":
                    throw "plus-darker is not supported";
                  case "multiply":
                    this.Pd = a.BlendMode.Multiply;
                    break;
                  case "screen":
                    this.Pd = a.BlendMode.Screen;
                    break;
                  case "overlay":
                    this.Pd = a.BlendMode.Overlay;
                    break;
                  case "darken":
                    this.Pd = a.BlendMode.Darken;
                    break;
                  case "lighten":
                    this.Pd = a.BlendMode.Lighten;
                    break;
                  case "color-dodge":
                    this.Pd = a.BlendMode.ColorDodge;
                    break;
                  case "color-burn":
                    this.Pd = a.BlendMode.ColorBurn;
                    break;
                  case "hard-light":
                    this.Pd = a.BlendMode.HardLight;
                    break;
                  case "soft-light":
                    this.Pd = a.BlendMode.SoftLight;
                    break;
                  case "difference":
                    this.Pd = a.BlendMode.Difference;
                    break;
                  case "exclusion":
                    this.Pd = a.BlendMode.Exclusion;
                    break;
                  case "hue":
                    this.Pd = a.BlendMode.Hue;
                    break;
                  case "saturation":
                    this.Pd = a.BlendMode.Saturation;
                    break;
                  case "color":
                    this.Pd = a.BlendMode.Color;
                    break;
                  case "luminosity":
                    this.Pd = a.BlendMode.Luminosity;
                    break;
                  default:
                    return;
                }
                this.Qd.setBlendMode(this.Pd);
              },
            });
            Object.defineProperty(this, "imageSmoothingEnabled", {
              enumerable: !0,
              get: function () {
                return !0;
              },
              set: function () {},
            });
            Object.defineProperty(this, "imageSmoothingQuality", {
              enumerable: !0,
              get: function () {
                return "high";
              },
              set: function () {},
            });
            Object.defineProperty(this, "lineCap", {
              enumerable: !0,
              get: function () {
                switch (this.Qd.getStrokeCap()) {
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
                    this.Qd.setStrokeCap(a.StrokeCap.Butt);
                    break;
                  case "round":
                    this.Qd.setStrokeCap(a.StrokeCap.Round);
                    break;
                  case "square":
                    this.Qd.setStrokeCap(a.StrokeCap.Square);
                }
              },
            });
            Object.defineProperty(this, "lineDashOffset", {
              enumerable: !0,
              get: function () {
                return this.He;
              },
              set: function (k) {
                isFinite(k) && (this.He = k);
              },
            });
            Object.defineProperty(this, "lineJoin", {
              enumerable: !0,
              get: function () {
                switch (this.Qd.getStrokeJoin()) {
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
                    this.Qd.setStrokeJoin(a.StrokeJoin.Miter);
                    break;
                  case "round":
                    this.Qd.setStrokeJoin(a.StrokeJoin.Round);
                    break;
                  case "bevel":
                    this.Qd.setStrokeJoin(a.StrokeJoin.Bevel);
                }
              },
            });
            Object.defineProperty(this, "lineWidth", {
              enumerable: !0,
              get: function () {
                return this.Qd.getStrokeWidth();
              },
              set: function (k) {
                0 >= k || !k || (this.Je = k, this.Qd.setStrokeWidth(k));
              },
            });
            Object.defineProperty(this, "miterLimit", {
              enumerable: !0,
              get: function () {
                return this.Qd.getStrokeMiter();
              },
              set: function (k) {
                0 >= k || !k || this.Qd.setStrokeMiter(k);
              },
            });
            Object.defineProperty(this, "shadowBlur", {
              enumerable: !0,
              get: function () {
                return this.ue;
              },
              set: function (k) {
                0 > k || !isFinite(k) || (this.ue = k);
              },
            });
            Object.defineProperty(this, "shadowColor", {
              enumerable: !0,
              get: function () {
                return d(this.Ie);
              },
              set: function (k) {
                this.Ie = g(maybeHSL(k));
              },
            });
            Object.defineProperty(this, "shadowOffsetX", {
              enumerable: !0,
              get: function () {
                return this.ve;
              },
              set: function (k) {
                isFinite(k) && (this.ve = k);
              },
            });
            Object.defineProperty(this, "shadowOffsetY", {
              enumerable: !0,
              get: function () {
                return this.we;
              },
              set: function (k) {
                isFinite(k) && (this.we = k);
              },
            });
            Object.defineProperty(this, "strokeStyle", {
              enumerable: !0,
              get: function () {
                return d(this.he);
              },
              set: function (k) {
                "string" === typeof k
                  ? this.he = g(maybeHSL(k))
                  : k.se && (this.he = k);
              },
            });
            this.arc = function (k, p, z, B, C, E) {
              I(this.Td, k, p, z, z, 0, B, C, E);
            };
            this.arcTo = function (k, p, z, B, C) {
              Q(this.Td, k, p, z, B, C);
            };
            this.beginPath = function () {
              this.Td.delete();
              this.Td = new a.Path();
            };
            this.bezierCurveTo = function (k, p, z, B, C, E) {
              var L = this.Td;
              e([k, p, z, B, C, E]) &&
                (L.isEmpty() && L.moveTo(k, p), L.cubicTo(k, p, z, B, C, E));
            };
            this.clearRect = function (k, p, z, B) {
              this.Qd.setStyle(a.PaintStyle.Fill);
              this.Qd.setBlendMode(a.BlendMode.Clear);
              this.Nd.drawRect(a.XYWHRect(k, p, z, B), this.Qd);
              this.Qd.setBlendMode(this.Pd);
            };
            this.clip = function (k, p) {
              "string" === typeof k
                ? (p = k, k = this.Td)
                : k && k.$e && (k = k.Wd);
              k || (k = this.Td);
              k = k.copy();
              p && "evenodd" === p.toLowerCase()
                ? k.setFillType(a.FillType.EvenOdd)
                : k.setFillType(a.FillType.Winding);
              this.Nd.clipPath(k, a.ClipOp.Intersect, !0);
              k.delete();
            };
            this.closePath = function () {
              V(this.Td);
            };
            this.createImageData = function () {
              if (1 === arguments.length) {
                var k = arguments[0];
                return new J(
                  new Uint8ClampedArray(4 * k.width * k.height),
                  k.width,
                  k.height,
                );
              }
              if (2 === arguments.length) {
                k = arguments[0];
                var p = arguments[1];
                return new J(new Uint8ClampedArray(4 * k * p), k, p);
              }
              throw "createImageData expects 1 or 2 arguments, got " +
                arguments.length;
            };
            this.createLinearGradient = function (k, p, z, B) {
              if (e(arguments)) {
                var C = new M(k, p, z, B);
                this.Ae.push(C);
                return C;
              }
            };
            this.createPattern = function (k, p) {
              k = new ka(k, p);
              this.Ae.push(k);
              return k;
            };
            this.createRadialGradient = function (k, p, z, B, C, E) {
              if (e(arguments)) {
                var L = new qa(k, p, z, B, C, E);
                this.Ae.push(L);
                return L;
              }
            };
            this.drawImage = function (k) {
              k instanceof D && (k = k.sf());
              if (k instanceof y) {
                k = a.MakeImage(
                  {
                    width: k.cf.Af,
                    height: k.cf.xf,
                    alphaType: a.AlphaType.Unpremul,
                    colorType: a.ColorType.RGBA_8888,
                    colorSpace: a.ColorSpace.SRGB,
                  },
                  k.getRawBuffer(0, 0, k.cf.Af, k.cf.xf),
                  4 * k.cf.Af,
                );
              }
              var p = this.Oe();
              if (3 === arguments.length || 5 === arguments.length) {
                var z = a.XYWHRect(
                    arguments[1],
                    arguments[2],
                    arguments[3] || k.width(),
                    arguments[4] || k.height(),
                  ),
                  B = a.XYWHRect(0, 0, k.width(), k.height());
              } else if (9 === arguments.length) {
                z = a.XYWHRect(
                  arguments[5],
                  arguments[6],
                  arguments[7],
                  arguments[8],
                ),
                  B = a.XYWHRect(
                    arguments[1],
                    arguments[2],
                    arguments[3],
                    arguments[4],
                  );
              } else {
                throw "invalid number of args for drawImage, need 3, 5, or 9; got " +
                  arguments.length;
              }
              this.Nd.drawImageRect(k, B, z, p, !1);
              p.dispose();
            };
            this.ellipse = function (k, p, z, B, C, E, L, ba) {
              I(this.Td, k, p, z, B, C, E, L, ba);
            };
            this.Oe = function () {
              var k = this.Qd.copy();
              k.setStyle(a.PaintStyle.Fill);
              if (f(this.be)) {
                var p = a.multiplyByAlpha(this.be, this.je);
                k.setColor(p);
              } else {
                p = this.be.se(this.Ud),
                  k.setColor(a.Color(0, 0, 0, this.je)),
                  k.setShader(p);
              }
              k.dispose = function () {
                this.delete();
              };
              return k;
            };
            this.fill = function (k, p) {
              "string" === typeof k
                ? (p = k, k = this.Td)
                : k && k.$e && (k = k.Wd);
              if ("evenodd" === p) this.Td.setFillType(a.FillType.EvenOdd);
              else {
                if (
                  "nonzero" !==
                    p && p
                ) {
                  throw "invalid fill rule";
                }
                this.Td.setFillType(a.FillType.Winding);
              }
              k || (k = this.Td);
              p = this.Oe();
              var z = this.xe(p);
              z &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawPath(k, z),
                  this.Nd.restore(),
                  z.dispose());
              this.Nd.drawPath(k, p);
              p.dispose();
            };
            this.fillRect = function (k, p, z, B) {
              var C = this.Oe(), E = this.xe(C);
              E &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawRect(a.XYWHRect(k, p, z, B), E),
                  this.Nd.restore(),
                  E.dispose());
              this.Nd.drawRect(a.XYWHRect(k, p, z, B), C);
              C.dispose();
            };
            this.fillText = function (k, p, z) {
              var B = this.Oe();
              k = a.TextBlob.MakeFromText(k, this.ne);
              var C = this.xe(B);
              C &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawTextBlob(k, p, z, C),
                  this.Nd.restore(),
                  C.dispose());
              this.Nd.drawTextBlob(k, p, z, B);
              k.delete();
              B.dispose();
            };
            this.getImageData = function (k, p, z, B) {
              return (k = this.Nd.readPixels(k, p, {
                  width: z,
                  height: B,
                  colorType: a.ColorType.RGBA_8888,
                  alphaType: a.AlphaType.Unpremul,
                  colorSpace: a.ColorSpace.SRGB,
                }))
                ? new J(new Uint8ClampedArray(k.buffer), z, B)
                : null;
            };
            this.getLineDash = function () {
              return this.te.slice();
            };
            this.lf = function (k) {
              var p = a.Matrix.invert(this.Ud);
              a.Matrix.mapPoints(p, k);
              return k;
            };
            this.isPointInPath = function (k, p, z) {
              var B = arguments;
              if (3 === B.length) var C = this.Td;
              else if (4 === B.length) C = B[0], k = B[1], p = B[2], z = B[3];
              else throw "invalid arg count, need 3 or 4, got " + B.length;
              if (!isFinite(k) || !isFinite(p)) return !1;
              z = z || "nonzero";
              if ("nonzero" !== z && "evenodd" !== z) return !1;
              B = this.lf([k, p]);
              k = B[0];
              p = B[1];
              C.setFillType(
                "nonzero" === z ? a.FillType.Winding : a.FillType.EvenOdd,
              );
              return C.contains(k, p);
            };
            this.isPointInStroke = function (k, p) {
              var z = arguments;
              if (2 === z.length) var B = this.Td;
              else if (3 === z.length) B = z[0], k = z[1], p = z[2];
              else throw "invalid arg count, need 2 or 3, got " + z.length;
              if (!isFinite(k) || !isFinite(p)) return !1;
              z = this.lf([k, p]);
              k = z[0];
              p = z[1];
              B = B.copy();
              B.setFillType(a.FillType.Winding);
              B.stroke({
                width: this.lineWidth,
                miter_limit: this.miterLimit,
                cap: this.Qd.getStrokeCap(),
                join: this.Qd.getStrokeJoin(),
                precision: .3,
              });
              z = B.contains(k, p);
              B.delete();
              return z;
            };
            this.lineTo = function (k, p) {
              R(this.Td, k, p);
            };
            this.measureText = function (txt) {
              const glyphWidths = this.ne.getGlyphWidths(txt);
              let width = 0;
              for (const w of glyphWidths) {
                width += w;
              }
              let glyphBounds = this.ne
                .getGlyphBounds(txt)
                .reduce((all, one, i) => {
                const ch = Math.floor(i / 4);
                  all[ch] = [].concat(all[ch] || [], one);
                  return all;
                }, []);
              let actualBoundingBoxAscent = Math.abs(
                glyphBounds.map((e) => e[1]).reduce((p, a) => p + a, 0),
              ) / glyphBounds.length;
              let actualBoundingBoxDescent = Math.abs(
                glyphBounds.map((e) => e[0]).reduce((p, a) => p + a, 0),
              ) / glyphBounds.length;
              let actualBoundingBoxLeft = Math.abs(
                glyphBounds.map((e) => e[3]).reduce((p, a) => p + a, 0),
              ) / glyphBounds.length;
              // let actualBoundingBoxRight = Math.abs(
              //   glyphBounds.map((e) => e[2]).reduce((p, a) => p + a, 0),
              // ) / glyphBounds.length;
              const metrics = this.ne.getMetrics();
              const res = {
                width,
                actualBoundingBoxAscent,
                actualBoundingBoxDescent,
                actualBoundingBoxLeft,
                actualBoundingBoxRight: width + actualBoundingBoxLeft,
                fontBoundingBoxAscent: Math.abs(metrics.ascent),
                fontBoundingBoxDescent: Math.abs(metrics.descent),
              };
              return res;
            };
            this.moveTo = function (k, p) {
              var z = this.Td;
              e([k, p]) && z.moveTo(k, p);
            };
            this.putImageData = function (k, p, z, B, C, E, L) {
              if (e([p, z, B, C, E, L])) {
                if (void 0 === B) {
                  this.Nd.writePixels(k.data, k.width, k.height, p, z);
                } else if (
                  B = B || 0,
                    C = C || 0,
                    E = E || k.width,
                    L = L || k.height,
                    0 > E && (B += E, E = Math.abs(E)),
                    0 > L && (C += L, L = Math.abs(L)),
                    0 > B && (E += B, B = 0),
                    0 > C && (L += C, C = 0),
                    !(0 >= E || 0 >= L)
                ) {
                  k = a.MakeImage(
                    {
                      width: k.width,
                      height: k.height,
                      alphaType: a.AlphaType.Unpremul,
                      colorType: a.ColorType.RGBA_8888,
                      colorSpace: a.ColorSpace.SRGB,
                    },
                    k.data,
                    4 * k.width,
                  );
                  var ba = a.XYWHRect(B, C, E, L);
                  p = a.XYWHRect(p + B, z + C, E, L);
                  z = a.Matrix.invert(this.Ud);
                  this.Nd.save();
                  this.Nd.concat(z);
                  this.Nd.drawImageRect(k, ba, p, null, !1);
                  this.Nd.restore();
                  k.delete();
                }
              }
            };
            this.quadraticCurveTo = function (k, p, z, B) {
              var C = this.Td;
              e([k, p, z, B]) &&
                (C.isEmpty() && C.moveTo(k, p), C.quadTo(k, p, z, B));
            };
            this.rect = function (k, p, z, B) {
              var C = this.Td;
              k = a.XYWHRect(k, p, z, B);
              e(k) && C.addRect(k);
            };
            this.resetTransform = function () {
              this.Td.transform(this.Ud);
              var k = a.Matrix.invert(this.Ud);
              this.Nd.concat(k);
              this.Ud = this.Nd.getTotalMatrix();
            };
            this.restore = function () {
              var k = this.kf.pop();
              if (k) {
                var p = a.Matrix.multiply(this.Ud, a.Matrix.invert(k.Df));
                this.Td.transform(p);
                this.Qd.delete();
                this.Qd = k.ag;
                this.te = k.Xf;
                this.Je = k.sg;
                this.he = k.rg;
                this.be = k.fs;
                this.ve = k.pg;
                this.we = k.qg;
                this.ue = k.eg;
                this.Ie = k.og;
                this.je = k.Kf;
                this.Pd = k.Lf;
                this.He = k.Yf;
                this.Pe = k.Jf;
                this.Nd.restore();
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.rotate = function (k) {
              if (isFinite(k)) {
                var p = a.Matrix.rotated(-k);
                this.Td.transform(p);
                this.Nd.rotate(
                  k /
                    Math.PI * 180,
                  0,
                  0,
                );
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.save = function () {
              if (this.be.re) {
                var k = this.be.re();
                this.Ae.push(k);
              } else k = this.be;
              if (this.he.re) {
                var p = this.he.re();
                this.Ae.push(p);
              } else p = this.he;
              this.kf.push({
                Df: this.Ud.slice(),
                Xf: this.te.slice(),
                sg: this.Je,
                rg: p,
                fs: k,
                pg: this.ve,
                qg: this.we,
                eg: this.ue,
                og: this.Ie,
                Kf: this.je,
                Yf: this.He,
                Lf: this.Pd,
                ag: this.Qd.copy(),
                Jf: this.Pe,
              });
              this.Nd.save();
            };
            this.scale = function (k, p) {
              if (e(arguments)) {
                var z = a.Matrix.scaled(1 / k, 1 / p);
                this.Td.transform(z);
                this.Nd.scale(k, p);
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.setLineDash = function (k) {
              for (var p = 0; p < k.length; p++) {
                if (!isFinite(k[p]) || 0 > k[p]) return;
              }
              1 === k.length % 2 && Array.prototype.push.apply(k, k);
              this.te = k;
            };
            this.setTransform = function (k, p, z, B, C, E) {
              e(arguments) &&
                (this.resetTransform(), this.transform(k, p, z, B, C, E));
            };
            this.qe = function () {
              var k = a.Matrix.invert(this.Ud);
              this.Nd.concat(k);
              this.Nd.concat(a.Matrix.translated(this.ve, this.we));
              this.Nd.concat(this.Ud);
            };
            this.xe = function (k) {
              var p = a.multiplyByAlpha(this.Ie, this.je);
              if (
                !a.getColorComponents(p)[3] || !(this.ue || this.we || this.ve)
              ) {
                return null;
              }
              k = k.copy();
              k.setColor(p);
              var z = a.MaskFilter.MakeBlur(
                a.BlurStyle.Normal,
                this.ue / 2,
                !1,
              );
              k.setMaskFilter(z);
              k.dispose = function () {
                z.delete();
                this.delete();
              };
              return k;
            };
            this.bf = function () {
              var k = this.Qd.copy();
              k.setStyle(a.PaintStyle.Stroke);
              if (f(this.he)) {
                var p = a.multiplyByAlpha(this.he, this.je);
                k.setColor(p);
              } else {
                p = this.he.se(this.Ud),
                  k.setColor(a.Color(0, 0, 0, this.je)),
                  k.setShader(p);
              }
              k.setStrokeWidth(this.Je);
              if (this.te.length) {
                var z = a.PathEffect.MakeDash(this.te, this.He);
                k.setPathEffect(z);
              }
              k.dispose = function () {
                z && z.delete();
                this.delete();
              };
              return k;
            };
            this.stroke = function (k) {
              k = k ? k.Wd : this.Td;
              var p = this.bf(), z = this.xe(p);
              z &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawPath(k, z),
                  this.Nd.restore(),
                  z.dispose());
              this.Nd.drawPath(k, p);
              p.dispose();
            };
            this.strokeRect = function (k, p, z, B) {
              var C = this.bf(), E = this.xe(C);
              E &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawRect(a.XYWHRect(k, p, z, B), E),
                  this.Nd.restore(),
                  E.dispose());
              this.Nd.drawRect(a.XYWHRect(k, p, z, B), C);
              C.dispose();
            };
            this.strokeText = function (k, p, z) {
              var B = this.bf();
              k = a.TextBlob.MakeFromText(k, this.ne);
              var C = this.xe(B);
              C &&
                (this.Nd.save(),
                  this.qe(),
                  this.Nd.drawTextBlob(k, p, z, C),
                  this.Nd.restore(),
                  C.dispose());
              this.Nd.drawTextBlob(k, p, z, B);
              k.delete();
              B.dispose();
            };
            this.translate = function (k, p) {
              if (e(arguments)) {
                var z = a.Matrix.translated(-k, -p);
                this.Td.transform(z);
                this.Nd.translate(k, p);
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.transform = function (k, p, z, B, C, E) {
              k = [k, z, C, p, B, E, 0, 0, 1];
              p = a.Matrix.invert(k);
              this.Td.transform(p);
              this.Nd.concat(k);
              this.Ud = this.Nd.getTotalMatrix();
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
          function y(G) {
            this.cf = G;
            this.Md = new r(G.getCanvas());
            Object.defineProperty(this, "width", {
              value: this.cf.Af,
            });
            Object.defineProperty(this, "height", {
              value: this.cf.xf,
            });
            this.Qe = [];
            this.decodeImage = function (k) {
              k = a.MakeImageFromEncoded(k);
              if (!k) throw "Invalid input";
              this.Qe.push(k);
              return new D(k);
            };
            this.loadFont = function (k, p) {
              k = a.Typeface.MakeFreeTypeFaceFromData(k);
              if (!k) return null;
              this.Qe.push(k);
              var z = (p.style || "normal") + "|" + (p.variant || "normal") +
                "|" + (p.weight || "normal");
              p = p.family;
              ea[p] || (ea[p] = { "*": k });
              ea[p][z] = k;
            };
            this.makePath2D = function (k) {
              k = new aa(k);
              this.Qe.push(k.Wd);
              return k;
            };
            this.getContext = function (k) {
              const ctx = "2d" === k ? this.Md : null;
              if (null !== ctx && ctx.canvas) {
                ctx.canvas.width = this.width;
                ctx.canvas.height = this.height;
              }
              return ctx;
            };
            this.getRawBuffer = function (k, n, y, B) {
              return this.cf.getCanvas().readPixels(k || 0, n || 0, {
                width: y || this.width,
                height: B || this.height,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
                raw: true,
              });
            };
            this.toDataURL = function (k, p) {
              this.cf.flush();
              var z = this.cf.makeImageSnapshot();
              if (z) {
                k = k || "image/png";
                var B = a.ImageFormat.PNG;
                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                if (p = z.encodeToBytes(B, p || .92)) {
                  z.delete();
                  k = "data:" + k + ";base64,";
                  p = encodeBase64(p);
                  return k + p;
                }
              }
            };
            this.toBuffer = function (k, p) {
              this.cf.flush();
              var z = this.cf.makeImageSnapshot();
              if (z) {
                k = k || "image/png";
                var B = a.ImageFormat.PNG;
                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                if (p = z.encodeToBytes(B, p || .92)) {
                  z.delete();
                  return p;
                }
              }
            };
            this.dispose = function () {
              this.Md.me();
              this.Qe.forEach(function (k) {
                k.delete();
              });
              this.cf.dispose();
            };
          }
          function D(G) {
            this.width = G.width();
            this.height = G.height();
            this.naturalWidth = this.width;
            this.naturalHeight = this.height;
            this.sf = function () {
              return G;
            };
          }
          function J(G, k, p) {
            if (!k || 0 === p) {
              throw "invalid dimensions, width and height must be non-zero";
            }
            if (G.length % 4) throw "arr must be a multiple of 4";
            p = p || G.length / (4 * k);
            Object.defineProperty(this, "data", { value: G, writable: !1 });
            Object.defineProperty(this, "height", { value: p, writable: !1 });
            Object.defineProperty(this, "width", { value: k, writable: !1 });
          }
          function M(G, k, p, z) {
            this.Yd = null;
            this.ee = [];
            this.$d = [];
            this.addColorStop = function (B, C) {
              if (0 > B || 1 < B || !isFinite(B)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              C = g(C);
              var E = this.$d.indexOf(B);
              if (-1 !== E) this.ee[E] = C;
              else {
                for (E = 0; E < this.$d.length && !(this.$d[E] > B); E++);
                this.$d.splice(E, 0, B);
                this.ee.splice(E, 0, C);
              }
            };
            this.re = function () {
              var B = new M(G, k, p, z);
              B.ee = this.ee.slice();
              B.$d = this.$d.slice();
              return B;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.se = function (B) {
              var C = [G, k, p, z];
              a.Matrix.mapPoints(B, C);
              B = C[0];
              var E = C[1], L = C[2];
              C = C[3];
              this.me();
              return this.Yd = a.Shader.MakeLinearGradient(
                [B, E],
                [L, C],
                this.ee,
                this.$d,
                a.TileMode.Clamp,
              );
            };
          }
          function Q(G, k, p, z, B, C) {
            if (e([k, p, z, B, C])) {
              if (0 > C) throw "radii cannot be negative";
              G.isEmpty() && G.moveTo(k, p);
              G.arcToTangent(k, p, z, B, C);
            }
          }
          function V(G) {
            if (!G.isEmpty()) {
              var k = G.getBounds();
              (k[3] - k[1] || k[2] - k[0]) && G.close();
            }
          }
          function u(G, k, p, z, B, C, E) {
            E = (E - C) / Math.PI * 180;
            C = C / Math.PI * 180;
            k = a.LTRBRect(k - z, p - B, k + z, p + B);
            1E-5 > Math.abs(Math.abs(E) - 360)
              ? (p = E / 2,
                G.arcToOval(k, C, p, !1),
                G.arcToOval(k, C + p, p, !1))
              : G.arcToOval(k, C, E, !1);
          }
          function I(G, k, p, z, B, C, E, L, ba) {
            if (e([k, p, z, B, C, E, L])) {
              if (0 > z || 0 > B) throw "radii cannot be negative";
              var ca = 2 * Math.PI, Ia = E % ca;
              0 > Ia && (Ia += ca);
              var bb = Ia - E;
              E = Ia;
              L += bb;
              !ba && L - E >= ca
                ? L = E + ca
                : ba && E - L >= ca
                ? L = E - ca
                : !ba && E > L
                ? L = E + (ca - (E - L) % ca)
                : ba && E < L && (L = E - (ca - (L - E) % ca));
              C
                ? (ba = a.Matrix.rotated(C, k, p),
                  C = a.Matrix.rotated(-C, k, p),
                  G.transform(C),
                  u(G, k, p, z, B, E, L),
                  G.transform(ba))
                : u(G, k, p, z, B, E, L);
            }
          }
          function R(G, k, p) {
            e([k, p]) && (G.isEmpty() && G.moveTo(k, p), G.lineTo(k, p));
          }
          function aa(G) {
            this.Wd = null;
            this.Wd = "string" === typeof G
              ? a.Path.MakeFromSVGString(G)
              : G && G.$e
              ? G.Wd.copy()
              : new a.Path();
            this.$e = function () {
              return this.Wd;
            };
            this.addPath = function (k, p) {
              p || (p = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
              this.Wd.addPath(k.Wd, [p.a, p.c, p.e, p.b, p.d, p.f]);
            };
            this.arc = function (k, p, z, B, C, E) {
              I(this.Wd, k, p, z, z, 0, B, C, E);
            };
            this.arcTo = function (k, p, z, B, C) {
              Q(this.Wd, k, p, z, B, C);
            };
            this.bezierCurveTo = function (k, p, z, B, C, E) {
              var L = this.Wd;
              e([k, p, z, B, C, E]) &&
                (L.isEmpty() && L.moveTo(k, p), L.cubicTo(k, p, z, B, C, E));
            };
            this.closePath = function () {
              V(this.Wd);
            };
            this.ellipse = function (k, p, z, B, C, E, L, ba) {
              I(this.Wd, k, p, z, B, C, E, L, ba);
            };
            this.lineTo = function (k, p) {
              R(this.Wd, k, p);
            };
            this.moveTo = function (k, p) {
              var z = this.Wd;
              e([k, p]) && z.moveTo(k, p);
            };
            this.quadraticCurveTo = function (k, p, z, B) {
              var C = this.Wd;
              e([k, p, z, B]) &&
                (C.isEmpty() && C.moveTo(k, p), C.quadTo(k, p, z, B));
            };
            this.rect = function (k, p, z, B) {
              var C = this.Wd;
              k = a.XYWHRect(k, p, z, B);
              e(k) && C.addRect(k);
            };
          }
          function ka(G, k) {
            this.Yd = null;
            G instanceof D && (G = G.sf());
            this.yf = G;
            this._transform = a.Matrix.identity();
            "" === k && (k = "repeat");
            switch (k) {
              case "repeat-x":
                this.ye = a.TileMode.Repeat;
                this.ze = a.TileMode.Decal;
                break;
              case "repeat-y":
                this.ye = a.TileMode.Decal;
                this.ze = a.TileMode.Repeat;
                break;
              case "repeat":
                this.ze = this.ye = a.TileMode.Repeat;
                break;
              case "no-repeat":
                this.ze = this.ye = a.TileMode.Decal;
                break;
              default:
                throw "invalid repetition mode " + k;
            }
            this.setTransform = function (p) {
              p = [p.a, p.c, p.e, p.b, p.d, p.f, 0, 0, 1];
              e(p) && (this._transform = p);
            };
            this.re = function () {
              var p = new ka();
              p.ye = this.ye;
              p.ze = this.ze;
              return p;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.se = function () {
              this.me();
              return this.Yd = this.yf.makeShaderCubic(
                this.ye,
                this.ze,
                1 / 3,
                1 / 3,
                this._transform,
              );
            };
          }
          function qa(G, k, p, z, B, C) {
            this.Yd = null;
            this.ee = [];
            this.$d = [];
            this.addColorStop = function (E, L) {
              if (0 > E || 1 < E || !isFinite(E)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              L = g(L);
              var ba = this.$d.indexOf(E);
              if (-1 !== ba) this.ee[ba] = L;
              else {
                for (ba = 0; ba < this.$d.length && !(this.$d[ba] > E); ba++);
                this.$d.splice(ba, 0, E);
                this.ee.splice(ba, 0, L);
              }
            };
            this.re = function () {
              var E = new qa(G, k, p, z, B, C);
              E.ee = this.ee.slice();
              E.$d = this.$d.slice();
              return E;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.se = function (E) {
              var L = [G, k, z, B];
              a.Matrix.mapPoints(E, L);
              var ba = L[0], ca = L[1], Ia = L[2];
              L = L[3];
              var bb = (Math.abs(E[0]) + Math.abs(E[4])) / 2;
              E = p * bb;
              bb *= C;
              this.me();
              return this.Yd = a.Shader.MakeTwoPointConicalGradient(
                [ba, ca],
                E,
                [Ia, L],
                bb,
                this.ee,
                this.$d,
                a.TileMode.Clamp,
              );
            };
          }
          a._testing = {};
          var ua = {
            aliceblue: Float32Array.of(.941, .973, 1, 1),
            antiquewhite: Float32Array.of(.98, .922, .843, 1),
            aqua: Float32Array.of(0, 1, 1, 1),
            aquamarine: Float32Array.of(.498, 1, .831, 1),
            azure: Float32Array.of(.941, 1, 1, 1),
            beige: Float32Array.of(.961, .961, .863, 1),
            bisque: Float32Array.of(1, .894, .769, 1),
            black: Float32Array.of(0, 0, 0, 1),
            blanchedalmond: Float32Array.of(1, .922, .804, 1),
            blue: Float32Array.of(0, 0, 1, 1),
            blueviolet: Float32Array.of(.541, .169, .886, 1),
            brown: Float32Array.of(.647, .165, .165, 1),
            burlywood: Float32Array.of(.871, .722, .529, 1),
            cadetblue: Float32Array.of(.373, .62, .627, 1),
            chartreuse: Float32Array.of(.498, 1, 0, 1),
            chocolate: Float32Array.of(.824, .412, .118, 1),
            coral: Float32Array.of(1, .498, .314, 1),
            cornflowerblue: Float32Array.of(.392, .584, .929, 1),
            cornsilk: Float32Array.of(1, .973, .863, 1),
            crimson: Float32Array.of(.863, .078, .235, 1),
            cyan: Float32Array.of(0, 1, 1, 1),
            darkblue: Float32Array.of(0, 0, .545, 1),
            darkcyan: Float32Array.of(0, .545, .545, 1),
            darkgoldenrod: Float32Array.of(.722, .525, .043, 1),
            darkgray: Float32Array.of(.663, .663, .663, 1),
            darkgreen: Float32Array.of(0, .392, 0, 1),
            darkgrey: Float32Array.of(.663, .663, .663, 1),
            darkkhaki: Float32Array.of(.741, .718, .42, 1),
            darkmagenta: Float32Array.of(.545, 0, .545, 1),
            darkolivegreen: Float32Array.of(.333, .42, .184, 1),
            darkorange: Float32Array.of(1, .549, 0, 1),
            darkorchid: Float32Array.of(.6, .196, .8, 1),
            darkred: Float32Array.of(.545, 0, 0, 1),
            darksalmon: Float32Array.of(.914, .588, .478, 1),
            darkseagreen: Float32Array.of(.561, .737, .561, 1),
            darkslateblue: Float32Array.of(.282, .239, .545, 1),
            darkslategray: Float32Array.of(.184, .31, .31, 1),
            darkslategrey: Float32Array.of(.184, .31, .31, 1),
            darkturquoise: Float32Array.of(0, .808, .82, 1),
            darkviolet: Float32Array.of(.58, 0, .827, 1),
            deeppink: Float32Array.of(1, .078, .576, 1),
            deepskyblue: Float32Array.of(0, .749, 1, 1),
            dimgray: Float32Array.of(.412, .412, .412, 1),
            dimgrey: Float32Array.of(.412, .412, .412, 1),
            dodgerblue: Float32Array.of(.118, .565, 1, 1),
            firebrick: Float32Array.of(.698, .133, .133, 1),
            floralwhite: Float32Array.of(1, .98, .941, 1),
            forestgreen: Float32Array.of(.133, .545, .133, 1),
            fuchsia: Float32Array.of(1, 0, 1, 1),
            gainsboro: Float32Array.of(.863, .863, .863, 1),
            ghostwhite: Float32Array.of(.973, .973, 1, 1),
            gold: Float32Array.of(1, .843, 0, 1),
            goldenrod: Float32Array.of(.855, .647, .125, 1),
            gray: Float32Array.of(.502, .502, .502, 1),
            green: Float32Array.of(0, .502, 0, 1),
            greenyellow: Float32Array.of(.678, 1, .184, 1),
            grey: Float32Array.of(.502, .502, .502, 1),
            honeydew: Float32Array.of(.941, 1, .941, 1),
            hotpink: Float32Array.of(1, .412, .706, 1),
            indianred: Float32Array.of(.804, .361, .361, 1),
            indigo: Float32Array.of(.294, 0, .51, 1),
            ivory: Float32Array.of(1, 1, .941, 1),
            khaki: Float32Array.of(.941, .902, .549, 1),
            lavender: Float32Array.of(.902, .902, .98, 1),
            lavenderblush: Float32Array.of(1, .941, .961, 1),
            lawngreen: Float32Array.of(.486, .988, 0, 1),
            lemonchiffon: Float32Array.of(1, .98, .804, 1),
            lightblue: Float32Array.of(.678, .847, .902, 1),
            lightcoral: Float32Array.of(.941, .502, .502, 1),
            lightcyan: Float32Array.of(.878, 1, 1, 1),
            lightgoldenrodyellow: Float32Array.of(.98, .98, .824, 1),
            lightgray: Float32Array.of(.827, .827, .827, 1),
            lightgreen: Float32Array.of(.565, .933, .565, 1),
            lightgrey: Float32Array.of(.827, .827, .827, 1),
            lightpink: Float32Array.of(1, .714, .757, 1),
            lightsalmon: Float32Array.of(1, .627, .478, 1),
            lightseagreen: Float32Array.of(.125, .698, .667, 1),
            lightskyblue: Float32Array.of(.529, .808, .98, 1),
            lightslategray: Float32Array.of(.467, .533, .6, 1),
            lightslategrey: Float32Array.of(.467, .533, .6, 1),
            lightsteelblue: Float32Array.of(.69, .769, .871, 1),
            lightyellow: Float32Array.of(1, 1, .878, 1),
            lime: Float32Array.of(0, 1, 0, 1),
            limegreen: Float32Array.of(.196, .804, .196, 1),
            linen: Float32Array.of(.98, .941, .902, 1),
            magenta: Float32Array.of(1, 0, 1, 1),
            maroon: Float32Array.of(.502, 0, 0, 1),
            mediumaquamarine: Float32Array.of(.4, .804, .667, 1),
            mediumblue: Float32Array.of(0, 0, .804, 1),
            mediumorchid: Float32Array.of(.729, .333, .827, 1),
            mediumpurple: Float32Array.of(.576, .439, .859, 1),
            mediumseagreen: Float32Array.of(.235, .702, .443, 1),
            mediumslateblue: Float32Array.of(.482, .408, .933, 1),
            mediumspringgreen: Float32Array.of(0, .98, .604, 1),
            mediumturquoise: Float32Array.of(.282, .82, .8, 1),
            mediumvioletred: Float32Array.of(.78, .082, .522, 1),
            midnightblue: Float32Array.of(.098, .098, .439, 1),
            mintcream: Float32Array.of(.961, 1, .98, 1),
            mistyrose: Float32Array.of(1, .894, .882, 1),
            moccasin: Float32Array.of(1, .894, .71, 1),
            navajowhite: Float32Array.of(1, .871, .678, 1),
            navy: Float32Array.of(0, 0, .502, 1),
            oldlace: Float32Array.of(.992, .961, .902, 1),
            olive: Float32Array.of(.502, .502, 0, 1),
            olivedrab: Float32Array.of(.42, .557, .137, 1),
            orange: Float32Array.of(1, .647, 0, 1),
            orangered: Float32Array.of(1, .271, 0, 1),
            orchid: Float32Array.of(.855, .439, .839, 1),
            palegoldenrod: Float32Array.of(.933, .91, .667, 1),
            palegreen: Float32Array.of(.596, .984, .596, 1),
            paleturquoise: Float32Array.of(.686, .933, .933, 1),
            palevioletred: Float32Array.of(.859, .439, .576, 1),
            papayawhip: Float32Array.of(1, .937, .835, 1),
            peachpuff: Float32Array.of(1, .855, .725, 1),
            peru: Float32Array.of(.804, .522, .247, 1),
            pink: Float32Array.of(1, .753, .796, 1),
            plum: Float32Array.of(.867, .627, .867, 1),
            powderblue: Float32Array.of(.69, .878, .902, 1),
            purple: Float32Array.of(.502, 0, .502, 1),
            rebeccapurple: Float32Array.of(.4, .2, .6, 1),
            red: Float32Array.of(1, 0, 0, 1),
            rosybrown: Float32Array.of(.737, .561, .561, 1),
            royalblue: Float32Array.of(.255, .412, .882, 1),
            saddlebrown: Float32Array.of(.545, .271, .075, 1),
            salmon: Float32Array.of(.98, .502, .447, 1),
            sandybrown: Float32Array.of(.957, .643, .376, 1),
            seagreen: Float32Array.of(.18, .545, .341, 1),
            seashell: Float32Array.of(1, .961, .933, 1),
            sienna: Float32Array.of(.627, .322, .176, 1),
            silver: Float32Array.of(.753, .753, .753, 1),
            skyblue: Float32Array.of(.529, .808, .922, 1),
            slateblue: Float32Array.of(.416, .353, .804, 1),
            slategray: Float32Array.of(.439, .502, .565, 1),
            slategrey: Float32Array.of(.439, .502, .565, 1),
            snow: Float32Array.of(1, .98, .98, 1),
            springgreen: Float32Array.of(0, 1, .498, 1),
            steelblue: Float32Array.of(.275, .51, .706, 1),
            tan: Float32Array.of(.824, .706, .549, 1),
            teal: Float32Array.of(0, .502, .502, 1),
            thistle: Float32Array.of(.847, .749, .847, 1),
            tomato: Float32Array.of(1, .388, .278, 1),
            transparent: Float32Array.of(0, 0, 0, 0),
            turquoise: Float32Array.of(.251, .878, .816, 1),
            violet: Float32Array.of(.933, .51, .933, 1),
            wheat: Float32Array.of(.961, .871, .702, 1),
            white: Float32Array.of(1, 1, 1, 1),
            whitesmoke: Float32Array.of(.961, .961, .961, 1),
            yellow: Float32Array.of(1, 1, 0, 1),
            yellowgreen: Float32Array.of(.604, .804, .196, 1),
          };
          a._testing.parseColor = g;
          a._testing.colorToString = d;
          var ya =
              /(italic|oblique|normal|)\s*(small-caps|normal|)\s*(bold|bolder|lighter|[1-9]00|normal|)\s*([\d\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)/,
            ea = { "Noto Mono": { "*": null }, monospace: { "*": null } };
          a._testing.parseFontString = m;
          a.MakeCanvas = function (G, k) {
            return (G = a.MakeSurface(G, k)) ? new y(G) : null;
          };
          a.ImageData = function () {
            if (2 === arguments.length) {
              var G = arguments[0], k = arguments[1];
              return new J(new Uint8ClampedArray(4 * G * k), G, k);
            }
            if (3 === arguments.length) {
              var p = arguments[0];
              if (p.prototype.constructor !== Uint8ClampedArray) {
                throw "bytes must be given as a Uint8ClampedArray";
              }
              G = arguments[1];
              k = arguments[2];
              if (p % 4) throw "bytes must be given in a multiple of 4";
              if (p % G) throw "bytes must divide evenly by width";
              if (k && k !== p / (4 * G)) throw "invalid height given";
              return new J(p, G, p / (4 * G));
            }
            throw "invalid number of arguments - takes 2 or 3, saw " +
              arguments.length;
          };
        })();
      })(t);
      var ra = {}, sa;
      for (sa in t) t.hasOwnProperty(sa) && (ra[sa] = t[sa]);
      var va = "./this.program";
      function wa(a, b) {
        throw b;
      }
      var xa = !1, za = !1, Aa = !1, Ba = !1;
      xa = "object" === typeof window;
      za = "function" === typeof importScripts;
      Aa = "object" === typeof process &&
        "object" === typeof process.versions &&
        "string" === typeof process.versions.node;
      Ba = !xa && !Aa && !za;
      var Ca = "", Da, Ea, Fa, Ga, Ja;
      if (Aa) {
        Ca = za ? require("path").dirname(Ca) + "/" : __dirname + "/",
          Da = function (a, b) {
            Ga || (Ga = require("fs"));
            Ja || (Ja = require("path"));
            a = Ja.normalize(a);
            return Ga.readFileSync(a, b ? null : "utf8");
          },
          Fa = function (a) {
            a = Da(a, !0);
            a.buffer || (a = new Uint8Array(a));
            assert(a.buffer);
            return a;
          },
          1 < process.argv.length && (va = process.argv[1].replace(/\\/g, "/")),
          process.argv.slice(2),
          process.on("uncaughtException", function (a) {
            if (!(a instanceof Ka)) throw a;
          }),
          process.on("unhandledRejection", La),
          wa = function (a) {
            process.exit(a);
          },
          t.inspect = function () {
            return "[Emscripten Module object]";
          };
      } else if (Ba) {
        "undefined" != typeof read && (Da = function (a) {
          return read(a);
        }),
          Fa = function (a) {
            if ("function" === typeof readbuffer) {
              return new Uint8Array(readbuffer(a));
            }
            a = read(a, "binary");
            assert("object" === typeof a);
            return a;
          },
          "function" === typeof quit && (wa = function (a) {
            quit(a);
          }),
          "undefined" !== typeof print &&
          ("undefined" === typeof console && (console = {}),
            console.log = print,
            console.warn = console.error = "undefined" !== typeof printErr
              ? printErr
              : print);
      } else if (xa || za) {
        za
          ? Ca = self.location.href
          : "undefined" !== typeof document && document.currentScript &&
            (Ca = document.currentScript.src),
          _scriptDir && (Ca = _scriptDir),
          0 !== Ca.indexOf("blob:")
            ? Ca = Ca.substr(0, Ca.lastIndexOf("/") + 1)
            : Ca = "",
          Da = function (a) {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.send(null);
            return b.responseText;
          },
          za && (Fa = function (a) {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
          Ea = function (a, b, c) {
            var f = new XMLHttpRequest();
            f.open("GET", a, !0);
            f.responseType = "arraybuffer";
            f.onload = function () {
              200 == f.status || 0 == f.status && f.response
                ? b(f.response)
                : c();
            };
            f.onerror = c;
            f.send(null);
          };
      }
      var Ma = t.print || console.log.bind(console),
        Oa = t.printErr || console.warn.bind(console);
      for (sa in ra) ra.hasOwnProperty(sa) && (t[sa] = ra[sa]);
      ra = null;
      t.thisProgram && (va = t.thisProgram);
      t.quit && (wa = t.quit);
      var Pa = 0, Qa;
      t.wasmBinary && (Qa = t.wasmBinary);
      var noExitRuntime = t.noExitRuntime || !0;
      "object" !== typeof WebAssembly && La("no native wasm support detected");
      var Ra, Sa = !1;
      function assert(a, b) {
        a || La("Assertion failed: " + b);
      }
      var Ta = "undefined" !== typeof TextDecoder
        ? new TextDecoder("utf8")
        : void 0;
      function Va(a, b, c) {
        var f = b + c;
        for (c = b; a[c] && !(c >= f);) ++c;
        if (16 < c - b && a.subarray && Ta) return Ta.decode(a.subarray(b, c));
        for (f = ""; b < c;) {
          var h = a[b++];
          if (h & 128) {
            var l = a[b++] & 63;
            if (192 == (h & 224)) f += String.fromCharCode((h & 31) << 6 | l);
            else {
              var n = a[b++] & 63;
              h = 224 == (h & 240)
                ? (h & 15) << 12 | l << 6 | n
                : (h & 7) << 18 | l << 12 | n << 6 | a[b++] & 63;
              65536 > h
                ? f += String.fromCharCode(h)
                : (h -= 65536,
                  f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023));
            }
          } else f += String.fromCharCode(h);
        }
        return f;
      }
      function Wa(a, b) {
        return a ? Va(H, a, b) : "";
      }
      function pa(a, b, c, f) {
        if (!(0 < f)) return 0;
        var h = c;
        f = c + f - 1;
        for (var l = 0; l < a.length; ++l) {
          var n = a.charCodeAt(l);
          if (55296 <= n && 57343 >= n) {
            var q = a.charCodeAt(++l);
            n = 65536 + ((n & 1023) << 10) | q & 1023;
          }
          if (127 >= n) {
            if (c >= f) break;
            b[c++] = n;
          } else {
            if (2047 >= n) {
              if (c + 1 >= f) break;
              b[c++] = 192 | n >> 6;
            } else {
              if (65535 >= n) {
                if (c + 2 >= f) break;
                b[c++] = 224 | n >> 12;
              } else {
                if (c + 3 >= f) break;
                b[c++] = 240 | n >> 18;
                b[c++] = 128 | n >> 12 & 63;
              }
              b[c++] = 128 | n >> 6 & 63;
            }
            b[c++] = 128 | n & 63;
          }
        }
        b[c] = 0;
        return c - h;
      }
      function na(a) {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          55296 <= f && 57343 >= f &&
            (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++c) & 1023);
          127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4;
        }
        return b;
      }
      var Xa = "undefined" !== typeof TextDecoder
        ? new TextDecoder("utf-16le")
        : void 0;
      function Ya(a, b) {
        var c = a >> 1;
        for (var f = c + b / 2; !(c >= f) && Za[c];) ++c;
        c <<= 1;
        if (32 < c - a && Xa) return Xa.decode(H.subarray(a, c));
        c = "";
        for (f = 0; !(f >= b / 2); ++f) {
          var h = $a[a + 2 * f >> 1];
          if (0 == h) break;
          c += String.fromCharCode(h);
        }
        return c;
      }
      function cb(a, b, c) {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var f = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var h = 0; h < c; ++h) $a[b >> 1] = a.charCodeAt(h), b += 2;
        $a[b >> 1] = 0;
        return b - f;
      }
      function db(a) {
        return 2 * a.length;
      }
      function eb(a, b) {
        for (var c = 0, f = ""; !(c >= b / 4);) {
          var h = P[a + 4 * c >> 2];
          if (0 == h) break;
          ++c;
          65536 <= h
            ? (h -= 65536,
              f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023))
            : f += String.fromCharCode(h);
        }
        return f;
      }
      function fb(a, b, c) {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var f = b;
        c = f + c - 4;
        for (var h = 0; h < a.length; ++h) {
          var l = a.charCodeAt(h);
          if (55296 <= l && 57343 >= l) {
            var n = a.charCodeAt(++h);
            l = 65536 + ((l & 1023) << 10) | n & 1023;
          }
          P[b >> 2] = l;
          b += 4;
          if (b + 4 > c) break;
        }
        P[b >> 2] = 0;
        return b - f;
      }
      function gb(a) {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          55296 <= f && 57343 >= f && ++c;
          b += 4;
        }
        return b;
      }
      var hb, mb, H, $a, Za, P, nb, T, ob;
      function pb() {
        var a = Ra.buffer;
        hb = a;
        t.HEAP8 = mb = new Int8Array(a);
        t.HEAP16 = $a = new Int16Array(a);
        t.HEAP32 = P = new Int32Array(a);
        t.HEAPU8 = H = new Uint8Array(a);
        t.HEAPU16 = Za = new Uint16Array(a);
        t.HEAPU32 = nb = new Uint32Array(a);
        t.HEAPF32 = T = new Float32Array(a);
        t.HEAPF64 = ob = new Float64Array(a);
      }
      var qb, rb = [], sb = [], tb = [];
      function ub() {
        var a = t.preRun.shift();
        rb.unshift(a);
      }
      var vb = 0, wb = null, xb = null;
      t.preloadedImages = {};
      t.preloadedAudios = {};
      function La(a) {
        if (t.onAbort) t.onAbort(a);
        Oa(a);
        Sa = !0;
        a = new WebAssembly.RuntimeError(
          "abort(" + a + "). Build with -s ASSERTIONS=1 for more info.",
        );
        fa(a);
        throw a;
      }
      function yb() {
        return zb.startsWith("data:application/octet-stream;base64,");
      }
      var zb = "canvaskit.wasm";
      if (!yb()) {
        var Ab = zb;
        zb = t.locateFile ? t.locateFile(Ab, Ca) : Ca + Ab;
      }
      function Bb() {
        var a = zb;
        try {
          if (a == zb && Qa) return new Uint8Array(Qa);
          if (Fa) return Fa(a);
          throw "both async and sync fetching of the wasm failed";
        } catch (b) {
          La(b);
        }
      }
      function Db() {
        if (!Qa && (xa || za)) {
          if ("function" === typeof fetch && !zb.startsWith("file://")) {
            return fetch(zb, { credentials: "same-origin" }).then(function (a) {
              if (!a.ok) {
                throw "failed to load wasm binary file at '" + zb + "'";
              }
              return a.arrayBuffer();
            }).catch(function () {
              return Bb();
            });
          }
          if (Ea) {
            return new Promise(function (a, b) {
              Ea(zb, function (c) {
                a(new Uint8Array(c));
              }, b);
            });
          }
        }
        return Promise.resolve().then(function () {
          return Bb();
        });
      }
      function Eb(a) {
        for (; 0 < a.length;) {
          var b = a.shift();
          if ("function" == typeof b) b(t);
          else {
            var c = b.Bg;
            "number" === typeof c
              ? void 0 === b.df ? qb.get(c)() : qb.get(c)(b.df)
              : c(void 0 === b.df ? null : b.df);
          }
        }
      }
      function Fb(a) {
        this.Rd = a - 16;
        this.jg = function (b) {
          P[this.Rd + 8 >> 2] = b;
        };
        this.gg = function (b) {
          P[this.Rd + 0 >> 2] = b;
        };
        this.hg = function () {
          P[this.Rd + 4 >> 2] = 0;
        };
        this.fg = function () {
          mb[this.Rd + 12 >> 0] = 0;
        };
        this.ig = function () {
          mb[this.Rd + 13 >> 0] = 0;
        };
        this.Uf = function (b, c) {
          this.jg(b);
          this.gg(c);
          this.hg();
          this.fg();
          this.ig();
        };
      }
      var Gb = 0, Hb = {}, Ib = [null, [], []], Jb = {}, Kb = {};
      function Lb(a) {
        for (; a.length;) {
          var b = a.pop();
          a.pop()(b);
        }
      }
      function Mb(a) {
        return this.fromWireType(nb[a >> 2]);
      }
      var Nb = {}, Ob = {}, Pb = {};
      function Qb(a) {
        if (void 0 === a) return "_unknown";
        a = a.replace(/[^a-zA-Z0-9_]/g, "$");
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? "_" + a : a;
      }
      function Rb(a, b) {
        a = Qb(a);
        return (new Function(
          "body",
          "return function " + a +
            '() {\n    "use strict";    return body.apply(this, arguments);\n};\n',
        ))(b);
      }
      function Sb(a) {
        var b = Error,
          c = Rb(a, function (f) {
            this.name = a;
            this.message = f;
            f = Error(f).stack;
            void 0 !== f &&
              (this.stack = this.toString() + "\n" +
                f.replace(/^Error(:[^\n]*)?\n/, ""));
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
      var Tb = void 0;
      function Ub(a) {
        throw new Tb(a);
      }
      function Vb(a, b, c) {
        function f(q) {
          q = c(q);
          q.length !== a.length && Ub("Mismatched type converter count");
          for (var x = 0; x < a.length; ++x) Wb(a[x], q[x]);
        }
        a.forEach(function (q) {
          Pb[q] = b;
        });
        var h = Array(b.length), l = [], n = 0;
        b.forEach(function (q, x) {
          Ob.hasOwnProperty(q)
            ? h[x] = Ob[q]
            : (l.push(q),
              Nb.hasOwnProperty(q) || (Nb[q] = []),
              Nb[q].push(function () {
                h[x] = Ob[q];
                ++n;
                n === l.length && f(h);
              }));
        });
        0 === l.length && f(h);
      }
      function Xb(a) {
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
      var Yb = void 0;
      function Zb(a) {
        for (var b = ""; H[a];) b += Yb[H[a++]];
        return b;
      }
      var $b = void 0;
      function W(a) {
        throw new $b(a);
      }
      function Wb(a, b, c) {
        c = c || {};
        if (!("argPackAdvance" in b)) {
          throw new TypeError(
            "registerType registeredInstance requires argPackAdvance",
          );
        }
        var f = b.name;
        a || W('type "' + f + '" must have a positive integer typeid pointer');
        if (Ob.hasOwnProperty(a)) {
          if (c.Tf) return;
          W("Cannot register type '" + f + "' twice");
        }
        Ob[a] = b;
        delete Pb[a];
        Nb.hasOwnProperty(a) &&
          (b = Nb[a],
            delete Nb[a],
            b.forEach(function (h) {
              h();
            }));
      }
      function ac(a) {
        W(a.Ld.Xd.Sd.name + " instance already deleted");
      }
      var bc = !1;
      function cc() {}
      function dc(a) {
        --a.count.value;
        0 === a.count.value && (a.de ? a.ge.ke(a.de) : a.Xd.Sd.ke(a.Rd));
      }
      function ec(a) {
        if ("undefined" === typeof FinalizationGroup) {
          return ec = function (b) {
            return b;
          },
            a;
        }
        bc = new FinalizationGroup(function (b) {
          for (var c = b.next(); !c.done; c = b.next()) {
            c = c.value,
              c.Rd ? dc(c) : console.warn("object already deleted: " + c.Rd);
          }
        });
        ec = function (b) {
          bc.register(b, b.Ld, b.Ld);
          return b;
        };
        cc = function (b) {
          bc.unregister(b.Ld);
        };
        return ec(a);
      }
      var mc = void 0, nc = [];
      function oc() {
        for (; nc.length;) {
          var a = nc.pop();
          a.Ld.De = !1;
          a["delete"]();
        }
      }
      function pc() {}
      var qc = {};
      function rc(a, b, c) {
        if (void 0 === a[b].Zd) {
          var f = a[b];
          a[b] = function () {
            a[b].Zd.hasOwnProperty(arguments.length) ||
              W(
                "Function '" + c +
                  "' called with an invalid number of arguments (" +
                  arguments.length + ") - expects one of (" + a[b].Zd + ")!",
              );
            return a[b].Zd[arguments.length].apply(this, arguments);
          };
          a[b].Zd = [];
          a[b].Zd[f.Be] = f;
        }
      }
      function sc(a, b, c) {
        t.hasOwnProperty(a)
          ? ((void 0 === c || void 0 !== t[a].Zd && void 0 !== t[a].Zd[c]) &&
            W("Cannot register public name '" + a + "' twice"),
            rc(t, a, a),
            t.hasOwnProperty(c) &&
            W(
              "Cannot register multiple overloads of a function with the same number of arguments (" +
                c + ")!",
            ),
            t[a].Zd[c] = b)
          : (t[a] = b, void 0 !== c && (t[a].Dg = c));
      }
      function tc(a, b, c, f, h, l, n, q) {
        this.name = a;
        this.constructor = b;
        this.Ee = c;
        this.ke = f;
        this.ie = h;
        this.Mf = l;
        this.Ne = n;
        this.Gf = q;
        this.cg = [];
      }
      function uc(a, b, c) {
        for (; b !== c;) {
          b.Ne ||
          W(
            "Expected null or instance of " + c.name + ", got an instance of " +
              b.name,
          ),
            a = b.Ne(a),
            b = b.ie;
        }
        return a;
      }
      function vc(a, b) {
        if (null === b) {
          return this.ff && W("null is not a valid " + this.name), 0;
        }
        b.Ld || W('Cannot pass "' + wc(b) + '" as a ' + this.name);
        b.Ld.Rd ||
          W("Cannot pass deleted object as a pointer of type " + this.name);
        return uc(b.Ld.Rd, b.Ld.Xd.Sd, this.Sd);
      }
      function xc(a, b) {
        if (null === b) {
          this.ff && W("null is not a valid " + this.name);
          if (this.Se) {
            var c = this.gf();
            null !== a && a.push(this.ke, c);
            return c;
          }
          return 0;
        }
        b.Ld || W('Cannot pass "' + wc(b) + '" as a ' + this.name);
        b.Ld.Rd ||
          W("Cannot pass deleted object as a pointer of type " + this.name);
        !this.Re && b.Ld.Xd.Re &&
          W(
            "Cannot convert argument of type " +
              (b.Ld.ge ? b.Ld.ge.name : b.Ld.Xd.name) + " to parameter type " +
              this.name,
          );
        c = uc(b.Ld.Rd, b.Ld.Xd.Sd, this.Sd);
        if (this.Se) {
          switch (
            void 0 === b.Ld.de &&
            W("Passing raw pointer to smart pointer is illegal"), this.ng
          ) {
            case 0:
              b.Ld.ge === this ? c = b.Ld.de : W(
                "Cannot convert argument of type " + (b.Ld.ge
                  ? b.Ld.ge.name
                  : b.Ld.Xd.name) +
                  " to parameter type " + this.name,
              );
              break;
            case 1:
              c = b.Ld.de;
              break;
            case 2:
              if (b.Ld.ge === this) c = b.Ld.de;
              else {
                var f = b.clone();
                c = this.dg(
                  c,
                  yc(function () {
                    f["delete"]();
                  }),
                );
                null !== a && a.push(this.ke, c);
              }
              break;
            default:
              W("Unsupporting sharing policy");
          }
        }
        return c;
      }
      function zc(a, b) {
        if (null === b) {
          return this.ff && W("null is not a valid " + this.name), 0;
        }
        b.Ld || W('Cannot pass "' + wc(b) + '" as a ' + this.name);
        b.Ld.Rd ||
          W("Cannot pass deleted object as a pointer of type " + this.name);
        b.Ld.Xd.Re &&
          W(
            "Cannot convert argument of type " + b.Ld.Xd.name +
              " to parameter type " + this.name,
          );
        return uc(b.Ld.Rd, b.Ld.Xd.Sd, this.Sd);
      }
      function Ac(a, b, c) {
        if (b === c) return a;
        if (void 0 === c.ie) return null;
        a = Ac(a, b, c.ie);
        return null === a ? null : c.Gf(a);
      }
      var Bc = {};
      function Cc(a, b) {
        for (void 0 === b && W("ptr should not be undefined"); a.ie;) {
          b = a.Ne(b), a = a.ie;
        }
        return Bc[b];
      }
      function Dc(a, b) {
        b.Xd && b.Rd || Ub("makeClassHandle requires ptr and ptrType");
        !!b.ge !== !!b.de &&
          Ub("Both smartPtrType and smartPtr must be specified");
        b.count = { value: 1 };
        return ec(Object.create(a, { Ld: { value: b } }));
      }
      function Ec(a, b, c, f, h, l, n, q, x, w, F) {
        this.name = a;
        this.Sd = b;
        this.ff = c;
        this.Re = f;
        this.Se = h;
        this.bg = l;
        this.ng = n;
        this.uf = q;
        this.gf = x;
        this.dg = w;
        this.ke = F;
        h || void 0 !== b.ie
          ? this.toWireType = xc
          : (this.toWireType = f ? vc : zc, this.fe = null);
      }
      function Fc(a, b, c) {
        t.hasOwnProperty(a) || Ub("Replacing nonexistant public symbol");
        void 0 !== t[a].Zd && void 0 !== c
          ? t[a].Zd[c] = b
          : (t[a] = b, t[a].Be = c);
      }
      function Gc(a, b) {
        var c = [];
        return function () {
          c.length = arguments.length;
          for (var f = 0; f < arguments.length; f++) c[f] = arguments[f];
          a.includes("j")
            ? (f = t["dynCall_" + a],
              f = c && c.length
                ? f.apply(null, [b].concat(c))
                : f.call(null, b))
            : f = qb.get(b).apply(null, c);
          return f;
        };
      }
      function Hc(a, b) {
        a = Zb(a);
        var c = a.includes("j") ? Gc(a, b) : qb.get(b);
        "function" !== typeof c &&
          W("unknown function pointer with signature " + a + ": " + b);
        return c;
      }
      var Ic = void 0;
      function Jc(a) {
        a = Kc(a);
        var b = Zb(a);
        Lc(a);
        return b;
      }
      function Tc(a, b) {
        function c(l) {
          h[l] || Ob[l] || (Pb[l] ? Pb[l].forEach(c) : (f.push(l), h[l] = !0));
        }
        var f = [], h = {};
        b.forEach(c);
        throw new Ic(a + ": " + f.map(Jc).join([", "]));
      }
      function Uc(a) {
        var b = Function;
        if (!(b instanceof Function)) {
          throw new TypeError(
            "new_ called with constructor type " + typeof b +
              " which is not a function",
          );
        }
        var c = Rb(b.name || "unknownFunctionName", function () {});
        c.prototype = b.prototype;
        c = new c();
        a = b.apply(c, a);
        return a instanceof Object ? a : c;
      }
      function Vc(a, b, c, f, h) {
        var l = b.length;
        2 > l &&
          W("argTypes array size mismatch! Must at least get return value and 'this' types!");
        var n = null !== b[1] && null !== c, q = !1;
        for (c = 1; c < b.length; ++c) {
          if (null !== b[c] && void 0 === b[c].fe) {
            q = !0;
            break;
          }
        }
        var x = "void" !== b[0].name, w = "", F = "";
        for (c = 0; c < l - 2; ++c) {
          w += (0 !== c ? ", " : "") + "arg" + c,
            F += (0 !== c ? ", " : "") + "arg" + c + "Wired";
        }
        a = "return function " + Qb(a) + "(" + w +
          ") {\nif (arguments.length !== " + (l - 2) +
          ") {\nthrowBindingError('function " + a +
          " called with ' + arguments.length + ' arguments, expected " +
          (l - 2) + " args!');\n}\n";
        q && (a += "var destructors = [];\n");
        var K = q ? "destructors" : "null";
        w = "throwBindingError invoker fn runDestructors retType classParam"
          .split(" ");
        f = [W, f, h, Lb, b[0], b[1]];
        n && (a += "var thisWired = classParam.toWireType(" + K + ", this);\n");
        for (c = 0; c < l - 2; ++c) {
          a += "var arg" + c + "Wired = argType" + c + ".toWireType(" + K +
            ", arg" + c + "); // " + b[c + 2].name + "\n",
            w.push("argType" + c),
            f.push(b[c + 2]);
        }
        n && (F = "thisWired" + (0 < F.length ? ", " : "") + F);
        a += (x ? "var rv = " : "") + "invoker(fn" + (0 < F.length
          ? ", "
          : "") +
          F + ");\n";
        if (q) a += "runDestructors(destructors);\n";
        else {
          for (c = n ? 1 : 2; c < b.length; ++c) {
            l = 1 === c ? "thisWired" : "arg" + (c - 2) + "Wired",
              null !== b[c].fe &&
              (a += l + "_dtor(" + l + "); // " + b[c].name + "\n",
                w.push(l + "_dtor"),
                f.push(b[c].fe));
          }
        }
        x && (a += "var ret = retType.fromWireType(rv);\nreturn ret;\n");
        w.push(a + "}\n");
        return Uc(w).apply(null, f);
      }
      function Wc(a, b) {
        for (var c = [], f = 0; f < a; f++) c.push(P[(b >> 2) + f]);
        return c;
      }
      var Xc = [],
        Yc = [{}, { value: void 0 }, { value: null }, { value: !0 }, {
          value: !1,
        }];
      function Zc(a) {
        4 < a && 0 === --Yc[a].hf && (Yc[a] = void 0, Xc.push(a));
      }
      function yc(a) {
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
            var b = Xc.length ? Xc.pop() : Yc.length;
            Yc[b] = { hf: 1, value: a };
            return b;
        }
      }
      function $c(a, b, c) {
        switch (b) {
          case 0:
            return function (f) {
              return this.fromWireType((c ? mb : H)[f]);
            };
          case 1:
            return function (f) {
              return this.fromWireType((c ? $a : Za)[f >> 1]);
            };
          case 2:
            return function (f) {
              return this.fromWireType((c ? P : nb)[f >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      function ad(a, b) {
        var c = Ob[a];
        void 0 === c && W(b + " has unknown type " + Jc(a));
        return c;
      }
      function wc(a) {
        if (null === a) return "null";
        var b = typeof a;
        return "object" === b || "array" === b || "function" === b
          ? a.toString()
          : "" + a;
      }
      function bd(a, b) {
        switch (b) {
          case 2:
            return function (c) {
              return this.fromWireType(T[c >> 2]);
            };
          case 3:
            return function (c) {
              return this.fromWireType(ob[c >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + a);
        }
      }
      function cd(a, b, c) {
        switch (b) {
          case 0:
            return c
              ? function (f) {
                return mb[f];
              }
              : function (f) {
                return H[f];
              };
          case 1:
            return c
              ? function (f) {
                return $a[f >> 1];
              }
              : function (f) {
                return Za[f >> 1];
              };
          case 2:
            return c
              ? function (f) {
                return P[f >> 2];
              }
              : function (f) {
                return nb[f >> 2];
              };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      function dd(a) {
        a || W("Cannot use deleted val. handle = " + a);
        return Yc[a].value;
      }
      var ed = {};
      function fd(a) {
        var b = ed[a];
        return void 0 === b ? Zb(a) : b;
      }
      var gd = [];
      function hd() {
        return "object" === typeof globalThis
          ? globalThis
          : Function("return this")();
      }
      function jd(a) {
        var b = gd.length;
        gd.push(a);
        return b;
      }
      function kd(a, b) {
        for (var c = Array(a), f = 0; f < a; ++f) {
          c[f] = ad(P[(b >> 2) + f], "parameter " + f);
        }
        return c;
      }
      var ld = {}, md;
      Aa
        ? md = function () {
          var a = process.hrtime();
          return 1E3 * a[0] + a[1] / 1E6;
        }
        : "undefined" !== typeof dateNow
        ? md = dateNow
        : md = function () {
          return performance.now();
        };
      function nd(a) {
        var b = a.getExtension("ANGLE_instanced_arrays");
        b && (a.vertexAttribDivisor = function (c, f) {
          b.vertexAttribDivisorANGLE(c, f);
        },
          a.drawArraysInstanced = function (c, f, h, l) {
            b.drawArraysInstancedANGLE(c, f, h, l);
          },
          a.drawElementsInstanced = function (c, f, h, l, n) {
            b.drawElementsInstancedANGLE(c, f, h, l, n);
          });
      }
      function od(a) {
        var b = a.getExtension("OES_vertex_array_object");
        b && (a.createVertexArray = function () {
          return b.createVertexArrayOES();
        },
          a.deleteVertexArray = function (c) {
            b.deleteVertexArrayOES(c);
          },
          a.bindVertexArray = function (c) {
            b.bindVertexArrayOES(c);
          },
          a.isVertexArray = function (c) {
            return b.isVertexArrayOES(c);
          });
      }
      function pd(a) {
        var b = a.getExtension("WEBGL_draw_buffers");
        b && (a.drawBuffers = function (c, f) {
          b.drawBuffersWEBGL(c, f);
        });
      }
      var qd = 1,
        rd = [],
        sd = [],
        td = [],
        ud = [],
        ha = [],
        vd = [],
        wd = [],
        ma = [],
        xd = [],
        yd = [],
        zd = {},
        Ad = {},
        Bd = 4;
      function Cd(a) {
        Dd || (Dd = a);
      }
      function Ed(a) {
        for (var b = qd++, c = a.length; c < b; c++) a[c] = null;
        return b;
      }
      function ia(a, b) {
        a.rf || (a.rf = a.getContext,
          a.getContext = function (f, h) {
            h = a.rf(f, h);
            return "webgl" == f == h instanceof WebGLRenderingContext
              ? h
              : null;
          });
        var c = 1 < b.majorVersion
          ? a.getContext("webgl2", b)
          : a.getContext("webgl", b);
        return c ? Hd(c, b) : 0;
      }
      function Hd(a, b) {
        var c = Ed(ma),
          f = { Sf: c, attributes: b, version: b.majorVersion, le: a };
        a.canvas && (a.canvas.wf = f);
        ma[c] = f;
        ("undefined" === typeof b.Hf || b.Hf) && Id(f);
        return c;
      }
      function la(a) {
        v = ma[a];
        t.Ag = X = v && v.le;
        return !(a && !X);
      }
      function Id(a) {
        a || (a = v);
        if (!a.Vf) {
          a.Vf = !0;
          var b = a.le;
          nd(b);
          od(b);
          pd(b);
          b.nf = b.getExtension(
            "WEBGL_draw_instanced_base_vertex_base_instance",
          );
          b.tf = b.getExtension(
            "WEBGL_multi_draw_instanced_base_vertex_base_instance",
          );
          2 <= a.version &&
            (b.pf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
          if (2 > a.version || !b.pf) {
            b.pf = b.getExtension("EXT_disjoint_timer_query");
          }
          b.Cg = b.getExtension("WEBGL_multi_draw");
          (b.getSupportedExtensions() || []).forEach(function (c) {
            c.includes("lose_context") || c.includes("debug") ||
              b.getExtension(c);
          });
        }
      }
      var v, Dd, Jd = [];
      function Kd(a, b, c, f) {
        for (var h = 0; h < a; h++) {
          var l = X[c](), n = l && Ed(f);
          l ? (l.name = n, f[n] = l) : Cd(1282);
          P[b + 4 * h >> 2] = n;
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
              var f = X.getParameter(34467);
              c = f ? f.length : 0;
              break;
            case 33309:
              if (2 > v.version) {
                Cd(1282);
                return;
              }
              c = 2 * (X.getSupportedExtensions() || []).length;
              break;
            case 33307:
            case 33308:
              if (2 > v.version) {
                Cd(1280);
                return;
              }
              c = 33307 == a ? 3 : 0;
          }
          if (void 0 === c) {
            switch (f = X.getParameter(a), typeof f) {
              case "number":
                c = f;
                break;
              case "boolean":
                c = f ? 1 : 0;
                break;
              case "string":
                Cd(1280);
                return;
              case "object":
                if (null === f) {
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
                      Cd(1280);
                      return;
                  }
                } else {
                  if (
                    f instanceof Float32Array || f instanceof Uint32Array ||
                    f instanceof Int32Array || f instanceof Array
                  ) {
                    for (a = 0; a < f.length; ++a) P[b + 4 * a >> 2] = f[a];
                    return;
                  }
                  try {
                    c = f.name | 0;
                  } catch (h) {
                    Cd(1280);
                    Oa(
                      "GL_INVALID_ENUM in glGet0v: Unknown object returned from WebGL getParameter(" +
                        a + ")! (error: " + h + ")",
                    );
                    return;
                  }
                }
                break;
              default:
                Cd(1280);
                Oa(
                  "GL_INVALID_ENUM in glGet0v: Native code calling glGet0v(" +
                    a + ") and it returns " + f + " of type " + typeof f + "!",
                );
                return;
            }
          }
          P[b >> 2] = c;
        } else Cd(1281);
      }
      function Md(a) {
        var b = na(a) + 1, c = Nd(b);
        pa(a, H, c, b);
        return c;
      }
      function Od(a) {
        a -= 5120;
        return 0 == a
          ? mb
          : 1 == a
          ? H
          : 2 == a
          ? $a
          : 4 == a
          ? P
          : 6 == a
          ? T
          : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
          ? nb
          : Za;
      }
      function Pd(a, b, c, f, h) {
        a = Od(a);
        var l = 31 - Math.clz32(a.BYTES_PER_ELEMENT), n = Bd;
        return a.subarray(
          h >> l,
          h + f *
                (c *
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
                        }[b - 6402] || 1) * (1 << l) + n - 1 & -n) >> l,
        );
      }
      function Z(a) {
        var b = X.Ef, c = b.Ze[a];
        0 <= c &&
          (b.Ze[a] = c = X.getUniformLocation(
            b,
            b.vf[a] + (0 < c ? "[" + c + "]" : ""),
          ));
        return c;
      }
      var Qd = [], Rd = [], Sd = {};
      function Td() {
        if (!Ud) {
          var a = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG: ("object" === typeof navigator && navigator.languages &&
                  navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
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
        for (var c = 0, f = 0; f <= b; c += a[f++]);
        return c;
      }
      var Xd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Yd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function Zd(a, b) {
        for (a = new Date(a.getTime()); 0 < b;) {
          var c = a.getMonth(), f = (Vd(a.getFullYear()) ? Xd : Yd)[c];
          if (b > f - a.getDate()) {
            b -= f - a.getDate() + 1,
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
      function $d(a, b, c, f) {
        function h(A, N, Y) {
          for (
            A = "number" === typeof A ? A.toString() : A || "";
            A.length < N;
          ) {
            A = Y[0] + A;
          }
          return A;
        }
        function l(A, N) {
          return h(A, N, "0");
        }
        function n(A, N) {
          function Y(oa) {
            return 0 > oa ? -1 : 0 < oa ? 1 : 0;
          }
          var S;
          0 === (S = Y(A.getFullYear() - N.getFullYear())) &&
            0 === (S = Y(A.getMonth() - N.getMonth())) &&
            (S = Y(A.getDate() - N.getDate()));
          return S;
        }
        function q(A) {
          switch (A.getDay()) {
            case 0:
              return new Date(A.getFullYear() - 1, 11, 29);
            case 1:
              return A;
            case 2:
              return new Date(A.getFullYear(), 0, 3);
            case 3:
              return new Date(A.getFullYear(), 0, 2);
            case 4:
              return new Date(A.getFullYear(), 0, 1);
            case 5:
              return new Date(A.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(A.getFullYear() - 1, 11, 30);
          }
        }
        function x(A) {
          A = Zd(new Date(A.ae + 1900, 0, 1), A.Ye);
          var N = new Date(A.getFullYear() + 1, 0, 4),
            Y = q(new Date(A.getFullYear(), 0, 4));
          N = q(N);
          return 0 >= n(Y, A)
            ? 0 >= n(N, A) ? A.getFullYear() + 1 : A.getFullYear()
            : A.getFullYear() - 1;
        }
        var w = P[f + 40 >> 2];
        f = {
          vg: P[f >> 2],
          ug: P[f + 4 >> 2],
          We: P[f + 8 >> 2],
          Me: P[f + 12 >> 2],
          Fe: P[f + 16 >> 2],
          ae: P[f + 20 >> 2],
          Xe: P[f + 24 >> 2],
          Ye: P[f + 28 >> 2],
          Gg: P[f + 32 >> 2],
          tg: P[
            f +
              36 >> 2
          ],
          wg: w ? Wa(w) : "",
        };
        c = Wa(c);
        w = {
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
        for (var F in w) c = c.replace(new RegExp(F, "g"), w[F]);
        var K = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday"
            .split(" "),
          O =
            "January February March April May June July August September October November December"
              .split(" ");
        w = {
          "%a": function (A) {
            return K[A.Xe].substring(0, 3);
          },
          "%A": function (A) {
            return K[A.Xe];
          },
          "%b": function (A) {
            return O[A.Fe].substring(0, 3);
          },
          "%B": function (A) {
            return O[A.Fe];
          },
          "%C": function (A) {
            return l((A.ae + 1900) / 100 | 0, 2);
          },
          "%d": function (A) {
            return l(A.Me, 2);
          },
          "%e": function (A) {
            return h(A.Me, 2, " ");
          },
          "%g": function (A) {
            return x(A).toString().substring(2);
          },
          "%G": function (A) {
            return x(A);
          },
          "%H": function (A) {
            return l(A.We, 2);
          },
          "%I": function (A) {
            A = A.We;
            0 == A ? A = 12 : 12 < A && (A -= 12);
            return l(A, 2);
          },
          "%j": function (A) {
            return l(A.Me + Wd(Vd(A.ae + 1900) ? Xd : Yd, A.Fe - 1), 3);
          },
          "%m": function (A) {
            return l(A.Fe + 1, 2);
          },
          "%M": function (A) {
            return l(A.ug, 2);
          },
          "%n": function () {
            return "\n";
          },
          "%p": function (A) {
            return 0 <= A.We && 12 > A.We ? "AM" : "PM";
          },
          "%S": function (A) {
            return l(A.vg, 2);
          },
          "%t": function () {
            return "\t";
          },
          "%u": function (A) {
            return A.Xe || 7;
          },
          "%U": function (A) {
            var N = new Date(A.ae + 1900, 0, 1),
              Y = 0 === N.getDay() ? N : Zd(N, 7 - N.getDay());
            A = new Date(A.ae + 1900, A.Fe, A.Me);
            return 0 >
                n(Y, A)
              ? l(
                Math.ceil(
                  (31 - Y.getDate() + (Wd(
                    Vd(A.getFullYear()) ? Xd : Yd,
                    A.getMonth() - 1,
                  ) - 31) + A.getDate()) / 7,
                ),
                2,
              )
              : 0 === n(Y, N)
              ? "01"
              : "00";
          },
          "%V": function (A) {
            var N = new Date(A.ae + 1901, 0, 4),
              Y = q(new Date(A.ae + 1900, 0, 4));
            N = q(N);
            var S = Zd(new Date(A.ae + 1900, 0, 1), A.Ye);
            return 0 > n(S, Y) ? "53" : 0 >= n(N, S) ? "01" : l(
              Math.ceil(
                (Y.getFullYear() < A.ae + 1900
                  ? A.Ye + 32 - Y.getDate()
                  : A.Ye + 1 - Y.getDate()) / 7,
              ),
              2,
            );
          },
          "%w": function (A) {
            return A.Xe;
          },
          "%W": function (A) {
            var N = new Date(A.ae, 0, 1),
              Y = 1 === N.getDay()
                ? N
                : Zd(N, 0 === N.getDay() ? 1 : 7 - N.getDay() + 1);
            A = new Date(A.ae + 1900, A.Fe, A.Me);
            return 0 > n(Y, A)
              ? l(
                Math.ceil(
                  (31 - Y.getDate() + (Wd(
                    Vd(A.getFullYear()) ? Xd : Yd,
                    A.getMonth() - 1,
                  ) - 31) + A.getDate()) / 7,
                ),
                2,
              )
              : 0 === n(Y, N)
              ? "01"
              : "00";
          },
          "%y": function (A) {
            return (A.ae + 1900).toString().substring(2);
          },
          "%Y": function (A) {
            return A.ae + 1900;
          },
          "%z": function (A) {
            A = A.tg;
            var N = 0 <= A;
            A = Math.abs(A) / 60;
            return (N ? "+" : "-") +
              String("0000" + (A / 60 * 100 + A % 60)).slice(-4);
          },
          "%Z": function (A) {
            return A.wg;
          },
          "%%": function () {
            return "%";
          },
        };
        for (F in w) {
          c.includes(F) && (c = c.replace(new RegExp(F, "g"), w[F](f)));
        }
        F = ae(c);
        if (F.length > b) return 0;
        mb.set(F, a);
        return F.length - 1;
      }
      Tb = t.InternalError = Sb("InternalError");
      for (var be = Array(256), ce = 0; 256 > ce; ++ce) {
        be[ce] = String.fromCharCode(ce);
      }
      Yb = be;
      $b = t.BindingError = Sb("BindingError");
      pc.prototype.isAliasOf = function (a) {
        if (!(this instanceof pc && a instanceof pc)) return !1;
        var b = this.Ld.Xd.Sd, c = this.Ld.Rd, f = a.Ld.Xd.Sd;
        for (a = a.Ld.Rd; b.ie;) c = b.Ne(c), b = b.ie;
        for (; f.ie;) a = f.Ne(a), f = f.ie;
        return b === f && c === a;
      };
      pc.prototype.clone = function () {
        this.Ld.Rd || ac(this);
        if (this.Ld.Le) return this.Ld.count.value += 1, this;
        var a = ec,
          b = Object,
          c = b.create,
          f = Object.getPrototypeOf(this),
          h = this.Ld;
        a = a(
          c.call(b, f, {
            Ld: {
              value: {
                count: h.count,
                De: h.De,
                Le: h.Le,
                Rd: h.Rd,
                Xd: h.Xd,
                de: h.de,
                ge: h.ge,
              },
            },
          }),
        );
        a.Ld.count.value += 1;
        a.Ld.De = !1;
        return a;
      };
      pc.prototype["delete"] = function () {
        this.Ld.Rd || ac(this);
        this.Ld.De && !this.Ld.Le && W("Object already scheduled for deletion");
        cc(this);
        dc(this.Ld);
        this.Ld.Le || (this.Ld.de = void 0, this.Ld.Rd = void 0);
      };
      pc.prototype.isDeleted = function () {
        return !this.Ld.Rd;
      };
      pc.prototype.deleteLater = function () {
        this.Ld.Rd || ac(this);
        this.Ld.De && !this.Ld.Le && W("Object already scheduled for deletion");
        nc.push(this);
        1 === nc.length && mc && mc(oc);
        this.Ld.De = !0;
        return this;
      };
      Ec.prototype.Nf = function (a) {
        this.uf && (a = this.uf(a));
        return a;
      };
      Ec.prototype.mf = function (a) {
        this.ke && this.ke(a);
      };
      Ec.prototype.argPackAdvance = 8;
      Ec.prototype.readValueFromPointer = Mb;
      Ec.prototype.deleteObject = function (a) {
        if (null !== a) a["delete"]();
      };
      Ec.prototype.fromWireType = function (a) {
        function b() {
          return this.Se
            ? Dc(this.Sd.Ee, { Xd: this.bg, Rd: c, ge: this, de: a })
            : Dc(this.Sd.Ee, { Xd: this, Rd: a });
        }
        var c = this.Nf(a);
        if (!c) return this.mf(a), null;
        var f = Cc(this.Sd, c);
        if (void 0 !== f) {
          if (0 === f.Ld.count.value) {
            return f.Ld.Rd = c, f.Ld.de = a, f.clone();
          }
          f = f.clone();
          this.mf(a);
          return f;
        }
        f = this.Sd.Mf(c);
        f = qc[f];
        if (!f) return b.call(this);
        f = this.Re ? f.Cf : f.pointerType;
        var h = Ac(c, this.Sd, f.Sd);
        return null === h
          ? b.call(this)
          : this.Se
          ? Dc(f.Sd.Ee, { Xd: f, Rd: h, ge: this, de: a })
          : Dc(f.Sd.Ee, { Xd: f, Rd: h });
      };
      t.getInheritedInstanceCount = function () {
        return Object.keys(Bc).length;
      };
      t.getLiveInheritedInstances = function () {
        var a = [], b;
        for (b in Bc) Bc.hasOwnProperty(b) && a.push(Bc[b]);
        return a;
      };
      t.flushPendingDeletes = oc;
      t.setDelayFunction = function (a) {
        mc = a;
        nc.length && mc && mc(oc);
      };
      Ic = t.UnboundTypeError = Sb("UnboundTypeError");
      t.count_emval_handles = function () {
        for (var a = 0, b = 5; b < Yc.length; ++b) void 0 !== Yc[b] && ++a;
        return a;
      };
      t.get_first_emval = function () {
        for (var a = 5; a < Yc.length; ++a) if (void 0 !== Yc[a]) return Yc[a];
        return null;
      };
      for (var X, de = 0; 32 > de; ++de) Jd.push(Array(de));
      var ee = new Float32Array(288);
      for (de = 0; 288 > de; ++de) Qd[de] = ee.subarray(0, de + 1);
      var fe = new Int32Array(288);
      for (de = 0; 288 > de; ++de) Rd[de] = fe.subarray(0, de + 1);
      function ae(a) {
        var b = Array(na(a) + 1);
        pa(a, b, 0, b.length);
        return b;
      }
      var ze = {
        Kb: function (a) {
          return Nd(a + 16) + 16;
        },
        Eb: function (a, b, c) {
          (new Fb(a)).Uf(b, c);
          Gb++;
          throw a;
        },
        O: function () {
          return 0;
        },
        Bb: function () {},
        xb: function () {
          return 0;
        },
        yb: function (a, b, c, f, h, l) {
          l <<= 12;
          0 !== (f & 16) && 0 !== a % 65536
            ? b = -28
            : 0 !== (f & 32)
            ? (a = ge(65536, b))
              ? (he(a, 0, b),
                Hb[a] = {
                  $f: a,
                  Zf: b,
                  Bf: !0,
                  fd: h,
                  Eg: c,
                  flags: f,
                  offset: l,
                },
                b = a)
              : b = -48
            : b = -52;
          return b;
        },
        zb: function (a, b) {
          if (-1 === (a | 0) || 0 === b) a = -28;
          else {
            var c = Hb[a];
            c && b === c.Zf && (Hb[a] = null, c.Bf && Lc(c.$f));
            a = 0;
          }
          return a;
        },
        R: function () {},
        Q: function () {},
        y: function (a) {
          var b = Kb[a];
          delete Kb[a];
          var c = b.gf,
            f = b.ke,
            h = b.qf,
            l = h.map(function (n) {
              return n.Rf;
            }).concat(h.map(function (n) {
              return n.lg;
            }));
          Vb([a], l, function (n) {
            var q = {};
            h.forEach(function (x, w) {
              var F = n[w],
                K = x.Pf,
                O = x.Qf,
                A = n[w + h.length],
                N = x.kg,
                Y = x.mg;
              q[x.If] = {
                read: function (S) {
                  return F.fromWireType(K(O, S));
                },
                write: function (S, oa) {
                  var ta = [];
                  N(Y, S, A.toWireType(ta, oa));
                  Lb(ta);
                },
              };
            });
            return [{
              name: b.name,
              fromWireType: function (x) {
                var w = {}, F;
                for (F in q) w[F] = q[F].read(x);
                f(x);
                return w;
              },
              toWireType: function (x, w) {
                for (var F in q) {
                  if (
                    !(F in
                      w)
                  ) {
                    throw new TypeError('Missing field:  "' + F + '"');
                  }
                }
                var K = c();
                for (F in q) q[F].write(K, w[F]);
                null !== x && x.push(f, K);
                return K;
              },
              argPackAdvance: 8,
              readValueFromPointer: Mb,
              fe: f,
            }];
          });
        },
        ob: function () {},
        Db: function (a, b, c, f, h) {
          var l = Xb(c);
          b = Zb(b);
          Wb(a, {
            name: b,
            fromWireType: function (n) {
              return !!n;
            },
            toWireType: function (n, q) {
              return q ? f : h;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (n) {
              if (1 === c) var q = mb;
              else if (2 === c) q = $a;
              else if (4 === c) q = P;
              else throw new TypeError("Unknown boolean type size: " + b);
              return this.fromWireType(
                q[
                  n >>
                  l
                ],
              );
            },
            fe: null,
          });
        },
        m: function (a, b, c, f, h, l, n, q, x, w, F, K, O) {
          F = Zb(F);
          l = Hc(h, l);
          q && (q = Hc(n, q));
          w && (w = Hc(x, w));
          O = Hc(K, O);
          var A = Qb(F);
          sc(A, function () {
            Tc("Cannot construct " + F + " due to unbound types", [f]);
          });
          Vb([a, b, c], f ? [f] : [], function (N) {
            N = N[0];
            if (f) {
              var Y = N.Sd;
              var S = Y.Ee;
            } else S = pc.prototype;
            N = Rb(A, function () {
              if (Object.getPrototypeOf(this) !== oa) {
                throw new $b("Use 'new' to construct " + F);
              }
              if (void 0 === ta.oe) {
                throw new $b(F + " has no accessible constructor");
              }
              var kb = ta.oe[arguments.length];
              if (void 0 === kb) {
                throw new $b(
                  "Tried to invoke ctor of " +
                    F + " with invalid number of parameters (" +
                    arguments.length + ") - expected (" +
                    Object.keys(ta.oe).toString() + ") parameters instead!",
                );
              }
              return kb.apply(this, arguments);
            });
            var oa = Object.create(S, { constructor: { value: N } });
            N.prototype = oa;
            var ta = new tc(F, N, oa, O, Y, l, q, w);
            Y = new Ec(F, ta, !0, !1, !1);
            S = new Ec(F + "*", ta, !1, !1, !1);
            var jb = new Ec(F + " const*", ta, !1, !0, !1);
            qc[a] = { pointerType: S, Cf: jb };
            Fc(A, N);
            return [Y, S, jb];
          });
        },
        f: function (a, b, c, f, h, l, n) {
          var q = Wc(c, f);
          b = Zb(b);
          l = Hc(h, l);
          Vb([], [a], function (x) {
            function w() {
              Tc(
                "Cannot call " +
                  F + " due to unbound types",
                q,
              );
            }
            x = x[0];
            var F = x.name + "." + b, K = x.Sd.constructor;
            void 0 === K[b]
              ? (w.Be = c - 1, K[b] = w)
              : (rc(K, b, F), K[b].Zd[c - 1] = w);
            Vb([], q, function (O) {
              O = [O[0], null].concat(O.slice(1));
              O = Vc(F, O, null, l, n);
              void 0 === K[b].Zd
                ? (O.Be = c - 1, K[b] = O)
                : K[b].Zd[c - 1] = O;
              return [];
            });
            return [];
          });
        },
        v: function (a, b, c, f, h, l) {
          assert(0 < b);
          var n = Wc(b, c);
          h = Hc(f, h);
          var q = [l], x = [];
          Vb([], [a], function (w) {
            w = w[0];
            var F = "constructor " + w.name;
            void 0 === w.Sd.oe && (w.Sd.oe = []);
            if (void 0 !== w.Sd.oe[b - 1]) {
              throw new $b(
                "Cannot register multiple constructors with identical number of parameters (" +
                  (b - 1) + ") for class '" + w.name +
                  "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
              );
            }
            w.Sd.oe[b - 1] = function () {
              Tc("Cannot construct " + w.name + " due to unbound types", n);
            };
            Vb([], n, function (K) {
              w.Sd.oe[b - 1] = function () {
                arguments.length !== b - 1 &&
                  W(
                    F + " called with " + arguments.length +
                      " arguments, expected " + (b - 1),
                  );
                x.length = 0;
                q.length = b;
                for (var O = 1; O < b; ++O) {
                  q[O] = K[O].toWireType(x, arguments[O - 1]);
                }
                O = h.apply(null, q);
                Lb(x);
                return K[0].fromWireType(O);
              };
              return [];
            });
            return [];
          });
        },
        c: function (a, b, c, f, h, l, n, q) {
          var x = Wc(c, f);
          b = Zb(b);
          l = Hc(h, l);
          Vb([], [a], function (w) {
            function F() {
              Tc("Cannot call " + K + " due to unbound types", x);
            }
            w = w[0];
            var K = w.name + "." + b;
            q && w.Sd.cg.push(b);
            var O = w.Sd.Ee, A = O[b];
            void 0 === A ||
              void 0 === A.Zd && A.className !== w.name && A.Be === c - 2
              ? (F.Be = c - 2, F.className = w.name, O[b] = F)
              : (rc(O, b, K), O[b].Zd[c - 2] = F);
            Vb([], x, function (N) {
              N = Vc(K, N, w, l, n);
              void 0 === O[b].Zd
                ? (N.Be = c - 2, O[b] = N)
                : O[b].Zd[c - 2] = N;
              return [];
            });
            return [];
          });
        },
        X: function (a, b, c) {
          a = Zb(a);
          Vb([], [b], function (f) {
            f = f[0];
            t[a] = f.fromWireType(c);
            return [];
          });
        },
        Cb: function (a, b) {
          b = Zb(b);
          Wb(a, {
            name: b,
            fromWireType: function (c) {
              var f = Yc[c].value;
              Zc(c);
              return f;
            },
            toWireType: function (c, f) {
              return yc(f);
            },
            argPackAdvance: 8,
            readValueFromPointer: Mb,
            fe: null,
          });
        },
        k: function (a, b, c, f) {
          function h() {}
          c = Xb(c);
          b = Zb(b);
          h.values = {};
          Wb(a, {
            name: b,
            constructor: h,
            fromWireType: function (l) {
              return this.constructor.values[l];
            },
            toWireType: function (l, n) {
              return n.value;
            },
            argPackAdvance: 8,
            readValueFromPointer: $c(b, c, f),
            fe: null,
          });
          sc(b, h);
        },
        j: function (a, b, c) {
          var f = ad(a, "enum");
          b = Zb(b);
          a = f.constructor;
          f = Object.create(f.constructor.prototype, {
            value: { value: c },
            constructor: { value: Rb(f.name + "_" + b, function () {}) },
          });
          a.values[c] = f;
          a[b] = f;
        },
        S: function (a, b, c) {
          c = Xb(c);
          b = Zb(b);
          Wb(a, {
            name: b,
            fromWireType: function (f) {
              return f;
            },
            toWireType: function (f, h) {
              if (
                "number" !== typeof h && "boolean" !== typeof h
              ) {
                throw new TypeError(
                  'Cannot convert "' + wc(h) + '" to ' + this.name,
                );
              }
              return h;
            },
            argPackAdvance: 8,
            readValueFromPointer: bd(b, c),
            fe: null,
          });
        },
        t: function (a, b, c, f, h, l) {
          var n = Wc(b, c);
          a = Zb(a);
          h = Hc(f, h);
          sc(a, function () {
            Tc("Cannot call " + a + " due to unbound types", n);
          }, b - 1);
          Vb([], n, function (q) {
            q = [q[0], null].concat(q.slice(1));
            Fc(a, Vc(a, q, null, h, l), b - 1);
            return [];
          });
        },
        x: function (a, b, c, f, h) {
          function l(w) {
            return w;
          }
          b = Zb(b);
          -1 === h && (h = 4294967295);
          var n = Xb(c);
          if (0 === f) {
            var q = 32 - 8 * c;
            l = function (w) {
              return w << q >>> q;
            };
          }
          var x = b.includes("unsigned");
          Wb(a, {
            name: b,
            fromWireType: l,
            toWireType: function (w, F) {
              if (
                "number" !== typeof F && "boolean" !== typeof F
              ) {
                throw new TypeError(
                  'Cannot convert "' + wc(F) + '" to ' + this.name,
                );
              }
              if (
                F < f ||
                F > h
              ) {
                throw new TypeError(
                  'Passing a number "' + wc(F) +
                    '" from JS side to C/C++ side to an argument of type "' +
                    b + '", which is outside the valid range [' + f + ", " + h +
                    "]!",
                );
              }
              return x ? F >>> 0 : F | 0;
            },
            argPackAdvance: 8,
            readValueFromPointer: cd(b, n, 0 !== f),
            fe: null,
          });
        },
        u: function (a, b, c) {
          function f(l) {
            l >>= 2;
            var n = nb;
            return new h(hb, n[l + 1], n[l]);
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
          c = Zb(c);
          Wb(a, {
            name: c,
            fromWireType: f,
            argPackAdvance: 8,
            readValueFromPointer: f,
          }, { Tf: !0 });
        },
        p: function (a, b, c, f, h, l, n, q, x, w, F, K) {
          c = Zb(c);
          l = Hc(h, l);
          q = Hc(n, q);
          w = Hc(x, w);
          K = Hc(F, K);
          Vb([a], [b], function (O) {
            O = O[0];
            return [new Ec(c, O.Sd, !1, !1, !0, O, f, l, q, w, K)];
          });
        },
        T: function (a, b) {
          b = Zb(b);
          var c = "std::string" === b;
          Wb(a, {
            name: b,
            fromWireType: function (f) {
              var h = nb[f >> 2];
              if (c) {
                for (var l = f + 4, n = 0; n <= h; ++n) {
                  var q = f + 4 + n;
                  if (n == h || 0 == H[q]) {
                    l = Wa(l, q - l);
                    if (void 0 === x) var x = l;
                    else x += String.fromCharCode(0), x += l;
                    l = q + 1;
                  }
                }
              } else {
                x = Array(h);
                for (n = 0; n < h; ++n) {
                  x[n] = String.fromCharCode(H[f + 4 + n]);
                }
                x = x.join("");
              }
              Lc(f);
              return x;
            },
            toWireType: function (f, h) {
              h instanceof ArrayBuffer && (h = new Uint8Array(h));
              var l = "string" === typeof h;
              l || h instanceof Uint8Array || h instanceof Uint8ClampedArray ||
                h instanceof Int8Array ||
                W("Cannot pass non-string to std::string");
              var n = (c && l
                  ? function () {
                    return na(h);
                  }
                  : function () {
                    return h.length;
                  })(),
                q = Nd(4 + n + 1);
              nb[q >> 2] = n;
              if (c && l) pa(h, H, q + 4, n + 1);
              else if (l) {
                for (l = 0; l < n; ++l) {
                  var x = h.charCodeAt(l);
                  255 < x &&
                    (Lc(q),
                      W("String has UTF-16 code units that do not fit in 8 bits"));
                  H[q + 4 + l] = x;
                }
              } else {
                for (l = 0; l < n; ++l) {
                  H[
                    q +
                    4 + l
                  ] = h[l];
                }
              }
              null !== f && f.push(Lc, q);
              return q;
            },
            argPackAdvance: 8,
            readValueFromPointer: Mb,
            fe: function (f) {
              Lc(f);
            },
          });
        },
        I: function (a, b, c) {
          c = Zb(c);
          if (2 === b) {
            var f = Ya;
            var h = cb;
            var l = db;
            var n = function () {
              return Za;
            };
            var q = 1;
          } else {
            4 === b && (f = eb,
              h = fb,
              l = gb,
              n = function () {
                return nb;
              },
              q = 2);
          }
          Wb(a, {
            name: c,
            fromWireType: function (x) {
              for (
                var w = nb[x >> 2], F = n(), K, O = x + 4, A = 0;
                A <= w;
                ++A
              ) {
                var N = x + 4 + A * b;
                if (A == w || 0 == F[N >> q]) {
                  O = f(O, N - O),
                    void 0 === K
                      ? K = O
                      : (K += String.fromCharCode(0), K += O),
                    O = N + b;
                }
              }
              Lc(x);
              return K;
            },
            toWireType: function (x, w) {
              "string" !==
                  typeof w &&
                W("Cannot pass non-string to C++ string type " + c);
              var F = l(w), K = Nd(4 + F + b);
              nb[K >> 2] = F >> q;
              h(w, K + 4, F + b);
              null !== x && x.push(Lc, K);
              return K;
            },
            argPackAdvance: 8,
            readValueFromPointer: Mb,
            fe: function (x) {
              Lc(x);
            },
          });
        },
        z: function (a, b, c, f, h, l) {
          Kb[a] = { name: Zb(b), gf: Hc(c, f), ke: Hc(h, l), qf: [] };
        },
        h: function (a, b, c, f, h, l, n, q, x, w) {
          Kb[a].qf.push({
            If: Zb(b),
            Rf: c,
            Pf: Hc(f, h),
            Qf: l,
            lg: n,
            kg: Hc(q, x),
            mg: w,
          });
        },
        Fb: function (a, b) {
          b = Zb(b);
          Wb(a, {
            Wf: !0,
            name: b,
            argPackAdvance: 0,
            fromWireType: function () {},
            toWireType: function () {},
          });
        },
        B: function (a, b, c) {
          a = dd(a);
          b = ad(b, "emval::as");
          var f = [], h = yc(f);
          P[c >> 2] = h;
          return b.toWireType(f, a);
        },
        M: function (a, b, c, f, h) {
          a = gd[a];
          b = dd(b);
          c = fd(c);
          var l = [];
          P[f >> 2] = yc(l);
          return a(b, c, l, h);
        },
        C: function (a, b, c, f) {
          a = gd[a];
          b = dd(b);
          c = fd(c);
          a(b, c, null, f);
        },
        E: Zc,
        Ab: function (a) {
          if (0 === a) return yc(hd());
          a = fd(a);
          return yc(hd()[a]);
        },
        A: function (a, b) {
          b = kd(a, b);
          for (
            var c = b[0],
              f = c.name + "_$" + b.slice(1).map(function (w) {
                return w.name;
              }).join("_") + "$",
              h = ["retType"],
              l = [c],
              n = "",
              q = 0;
            q < a - 1;
            ++q
          ) {
            n += (0 !== q ? ", " : "") + "arg" + q,
              h.push(
                "argType" +
                  q,
              ),
              l.push(b[1 + q]);
          }
          f = "return function " + Qb("methodCaller_" + f) +
            "(handle, name, destructors, args) {\n";
          var x = 0;
          for (q = 0; q < a - 1; ++q) {
            f += "    var arg" + q + " = argType" + q +
              ".readValueFromPointer(args" + (x ? "+" + x : "") + ");\n",
              x += b[q + 1].argPackAdvance;
          }
          f += "    var rv = handle[name](" + n + ");\n";
          for (q = 0; q < a - 1; ++q) {
            b[q + 1].deleteObject &&
              (f += "    argType" + q + ".deleteObject(arg" + q + ");\n");
          }
          c.Wf || (f += "    return retType.toWireType(destructors, rv);\n");
          h.push(f + "};\n");
          a = Uc(h).apply(null, l);
          return jd(a);
        },
        K: function (a, b) {
          a = dd(a);
          b = dd(b);
          return yc(a[b]);
        },
        G: function (a) {
          4 < a && (Yc[a].hf += 1);
        },
        sb: function (a, b, c, f) {
          a = dd(a);
          var h = ld[b];
          if (!h) {
            h = "";
            for (var l = 0; l < b; ++l) h += (0 !== l ? ", " : "") + "arg" + l;
            var n = "return function emval_allocator_" + b +
              "(constructor, argTypes, args) {\n";
            for (l = 0; l < b; ++l) {
              n += "var argType" + l +
                " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
                l + '], "parameter ' + l + '");\nvar arg' + l + " = argType" +
                l + ".readValueFromPointer(args);\nargs += argType" + l +
                "['argPackAdvance'];\n";
            }
            h = (new Function(
              "requireRegisteredType",
              "Module",
              "__emval_register",
              n +
                ("var obj = new constructor(" + h +
                  ");\nreturn __emval_register(obj);\n}\n"),
            ))(ad, t, yc);
            ld[b] = h;
          }
          return h(a, c, f);
        },
        ib: function () {
          return yc([]);
        },
        Ma: function (a) {
          return yc(fd(a));
        },
        jb: function () {
          return yc({});
        },
        hb: function (a) {
          a = dd(a);
          return !a;
        },
        lb: function (a) {
          Lb(Yc[a].value);
          Zc(a);
        },
        w: function (a, b, c) {
          a = dd(a);
          b = dd(b);
          c = dd(c);
          a[b] = c;
        },
        s: function (a, b) {
          a = ad(a, "_emval_take_value");
          a = a.readValueFromPointer(b);
          return yc(a);
        },
        d: function () {
          La();
        },
        qb: function (a, b) {
          if (0 === a) a = Date.now();
          else if (
            1 ===
              a || 4 === a
          ) {
            a = md();
          } else return P[ie() >> 2] = 28, -1;
          P[b >> 2] = a / 1E3 | 0;
          P[b + 4 >> 2] = a % 1E3 * 1E6 | 0;
          return 0;
        },
        Zc: function (a) {
          X.activeTexture(a);
        },
        _c: function (a, b) {
          X.attachShader(sd[a], vd[b]);
        },
        $c: function (a, b, c) {
          X.bindAttribLocation(sd[a], b, Wa(c));
        },
        _: function (a, b) {
          35051 == a ? X.ef = b : 35052 == a && (X.Ce = b);
          X.bindBuffer(a, rd[b]);
        },
        Z: function (a, b) {
          X.bindFramebuffer(a, td[b]);
        },
        bc: function (a, b) {
          X.bindRenderbuffer(a, ud[b]);
        },
        Pb: function (a, b) {
          X.bindSampler(a, xd[b]);
        },
        $: function (a, b) {
          X.bindTexture(a, ha[b]);
        },
        vc: function (a) {
          X.bindVertexArray(wd[a]);
        },
        yc: function (a) {
          X.bindVertexArray(wd[a]);
        },
        aa: function (a, b, c, f) {
          X.blendColor(a, b, c, f);
        },
        ba: function (a) {
          X.blendEquation(a);
        },
        ca: function (a, b) {
          X.blendFunc(a, b);
        },
        Wb: function (a, b, c, f, h, l, n, q, x, w) {
          X.blitFramebuffer(a, b, c, f, h, l, n, q, x, w);
        },
        da: function (a, b, c, f) {
          2 <= v.version
            ? c ? X.bufferData(a, H, f, c, b) : X.bufferData(a, b, f)
            : X.bufferData(a, c ? H.subarray(c, c + b) : b, f);
        },
        ea: function (a, b, c, f) {
          2 <= v.version
            ? X.bufferSubData(a, b, H, f, c)
            : X.bufferSubData(a, b, H.subarray(f, f + c));
        },
        cc: function (a) {
          return X.checkFramebufferStatus(a);
        },
        L: function (a) {
          X.clear(a);
        },
        Y: function (a, b, c, f) {
          X.clearColor(a, b, c, f);
        },
        P: function (a) {
          X.clearStencil(a);
        },
        fb: function (a, b, c, f) {
          return X.clientWaitSync(yd[a], b, (c >>> 0) + 4294967296 * f);
        },
        fa: function (a, b, c, f) {
          X.colorMask(!!a, !!b, !!c, !!f);
        },
        ga: function (a) {
          X.compileShader(vd[a]);
        },
        ha: function (a, b, c, f, h, l, n, q) {
          2 <= v.version
            ? X.Ce
              ? X.compressedTexImage2D(a, b, c, f, h, l, n, q)
              : X.compressedTexImage2D(a, b, c, f, h, l, H, q, n)
            : X.compressedTexImage2D(
              a,
              b,
              c,
              f,
              h,
              l,
              q ? H.subarray(q, q + n) : null,
            );
        },
        ia: function (a, b, c, f, h, l, n, q, x) {
          2 <= v.version
            ? X.Ce
              ? X.compressedTexSubImage2D(a, b, c, f, h, l, n, q, x)
              : X.compressedTexSubImage2D(a, b, c, f, h, l, n, H, x, q)
            : X.compressedTexSubImage2D(
              a,
              b,
              c,
              f,
              h,
              l,
              n,
              x ? H.subarray(x, x + q) : null,
            );
        },
        ja: function (a, b, c, f, h, l, n, q) {
          X.copyTexSubImage2D(a, b, c, f, h, l, n, q);
        },
        ka: function () {
          var a = Ed(sd), b = X.createProgram();
          b.name = a;
          b.Ve = b.Te = b.Ue = 0;
          b.jf = 1;
          sd[a] = b;
          return a;
        },
        la: function (a) {
          var b = Ed(vd);
          vd[b] = X.createShader(a);
          return b;
        },
        ma: function (a) {
          X.cullFace(a);
        },
        na: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], h = rd[f];
            h &&
              (X.deleteBuffer(h),
                h.name = 0,
                rd[f] = null,
                f == X.ef && (X.ef = 0),
                f == X.Ce && (X.Ce = 0));
          }
        },
        dc: function (a, b) {
          for (var c = 0; c < a; ++c) {
            var f = P[b + 4 * c >> 2], h = td[f];
            h && (X.deleteFramebuffer(h), h.name = 0, td[f] = null);
          }
        },
        oa: function (a) {
          if (a) {
            var b = sd[a];
            b ? (X.deleteProgram(b), b.name = 0, sd[a] = null) : Cd(1281);
          }
        },
        ec: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], h = ud[f];
            h && (X.deleteRenderbuffer(h), h.name = 0, ud[f] = null);
          }
        },
        Qb: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], h = xd[f];
            h && (X.deleteSampler(h), h.name = 0, xd[f] = null);
          }
        },
        pa: function (a) {
          if (a) {
            var b = vd[a];
            b ? (X.deleteShader(b), vd[a] = null) : Cd(1281);
          }
        },
        Yb: function (a) {
          if (a) {
            var b = yd[a];
            b ? (X.deleteSync(b), b.name = 0, yd[a] = null) : Cd(1281);
          }
        },
        qa: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], h = ha[f];
            h && (X.deleteTexture(h), h.name = 0, ha[f] = null);
          }
        },
        wc: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2];
            X.deleteVertexArray(wd[f]);
            wd[f] = null;
          }
        },
        zc: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2];
            X.deleteVertexArray(wd[f]);
            wd[f] = null;
          }
        },
        ra: function (a) {
          X.depthMask(!!a);
        },
        sa: function (a) {
          X.disable(a);
        },
        ta: function (a) {
          X.disableVertexAttribArray(a);
        },
        ua: function (a, b, c) {
          X.drawArrays(a, b, c);
        },
        tc: function (a, b, c, f) {
          X.drawArraysInstanced(a, b, c, f);
        },
        rc: function (a, b, c, f, h) {
          X.nf.drawArraysInstancedBaseInstanceWEBGL(a, b, c, f, h);
        },
        pc: function (a, b) {
          for (var c = Jd[a], f = 0; f < a; f++) c[f] = P[b + 4 * f >> 2];
          X.drawBuffers(c);
        },
        va: function (a, b, c, f) {
          X.drawElements(a, b, c, f);
        },
        uc: function (a, b, c, f, h) {
          X.drawElementsInstanced(a, b, c, f, h);
        },
        sc: function (a, b, c, f, h, l, n) {
          X.nf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            b,
            c,
            f,
            h,
            l,
            n,
          );
        },
        jc: function (a, b, c, f, h, l) {
          X.drawElements(a, f, h, l);
        },
        wa: function (a) {
          X.enable(a);
        },
        xa: function (a) {
          X.enableVertexAttribArray(a);
        },
        Ub: function (a, b) {
          return (a = X.fenceSync(a, b))
            ? (b = Ed(yd), a.name = b, yd[b] = a, b)
            : 0;
        },
        ya: function () {
          X.finish();
        },
        za: function () {
          X.flush();
        },
        fc: function (a, b, c, f) {
          X.framebufferRenderbuffer(a, b, c, ud[f]);
        },
        gc: function (a, b, c, f, h) {
          X.framebufferTexture2D(a, b, c, ha[f], h);
        },
        Aa: function (a) {
          X.frontFace(a);
        },
        Ba: function (a, b) {
          Kd(a, b, "createBuffer", rd);
        },
        hc: function (a, b) {
          Kd(a, b, "createFramebuffer", td);
        },
        ic: function (a, b) {
          Kd(a, b, "createRenderbuffer", ud);
        },
        Rb: function (a, b) {
          Kd(a, b, "createSampler", xd);
        },
        Ca: function (a, b) {
          Kd(a, b, "createTexture", ha);
        },
        xc: function (a, b) {
          Kd(a, b, "createVertexArray", wd);
        },
        Ac: function (a, b) {
          Kd(a, b, "createVertexArray", wd);
        },
        Zb: function (a) {
          X.generateMipmap(a);
        },
        Da: function (a, b, c) {
          c ? P[c >> 2] = X.getBufferParameter(a, b) : Cd(1281);
        },
        Ea: function () {
          var a = X.getError() || Dd;
          Dd = 0;
          return a;
        },
        _b: function (a, b, c, f) {
          a = X.getFramebufferAttachmentParameter(a, b, c);
          if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) {
            a = a.name | 0;
          }
          P[f >> 2] = a;
        },
        F: function (a, b) {
          Ld(a, b);
        },
        Fa: function (a, b, c, f) {
          a = X.getProgramInfoLog(sd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? pa(a, H, f, b) : 0;
          c && (P[c >> 2] = b);
        },
        Ga: function (a, b, c) {
          if (c) {
            if (a >= qd) Cd(1281);
            else if (a = sd[a], 35716 == b) {
              a = X.getProgramInfoLog(a),
                null === a && (a = "(unknown error)"),
                P[c >> 2] = a.length + 1;
            } else if (35719 == b) {
              if (!a.Ve) {
                for (b = 0; b < X.getProgramParameter(a, 35718); ++b) {
                  a.Ve = Math.max(
                    a.Ve,
                    X.getActiveUniform(a, b).name.length + 1,
                  );
                }
              }
              P[c >> 2] = a.Ve;
            } else if (35722 == b) {
              if (!a.Te) {
                for (b = 0; b < X.getProgramParameter(a, 35721); ++b) {
                  a.Te = Math.max(
                    a.Te,
                    X.getActiveAttrib(a, b).name.length + 1,
                  );
                }
              }
              P[c >> 2] = a.Te;
            } else if (35381 == b) {
              if (!a.Ue) {
                for (b = 0; b < X.getProgramParameter(a, 35382); ++b) {
                  a.Ue = Math.max(
                    a.Ue,
                    X.getActiveUniformBlockName(a, b).length + 1,
                  );
                }
              }
              P[c >> 2] = a.Ue;
            } else P[c >> 2] = X.getProgramParameter(a, b);
          } else Cd(1281);
        },
        $b: function (a, b, c) {
          c ? P[c >> 2] = X.getRenderbufferParameter(a, b) : Cd(1281);
        },
        Ha: function (a, b, c, f) {
          a = X.getShaderInfoLog(vd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? pa(a, H, f, b) : 0;
          c && (P[c >> 2] = b);
        },
        Mb: function (a, b, c, f) {
          a = X.getShaderPrecisionFormat(a, b);
          P[c >> 2] = a.rangeMin;
          P[
            c +
              4 >> 2
          ] = a.rangeMax;
          P[f >> 2] = a.precision;
        },
        Ia: function (a, b, c) {
          c
            ? 35716 == b
              ? (a = X.getShaderInfoLog(vd[a]),
                null === a && (a = "(unknown error)"),
                P[c >> 2] = a ? a.length + 1 : 0)
              : 35720 == b
              ? (a = X.getShaderSource(vd[a]), P[c >> 2] = a ? a.length + 1 : 0)
              : P[c >> 2] = X.getShaderParameter(vd[a], b)
            : Cd(1281);
        },
        J: function (a) {
          var b = zd[a];
          if (!b) {
            switch (a) {
              case 7939:
                b = X.getSupportedExtensions() || [];
                b = b.concat(b.map(function (f) {
                  return "GL_" + f;
                }));
                b = Md(b.join(" "));
                break;
              case 7936:
              case 7937:
              case 37445:
              case 37446:
                (b = X.getParameter(a)) || Cd(1280);
                b = b && Md(b);
                break;
              case 7938:
                b = X.getParameter(7938);
                b = 2 <= v.version
                  ? "OpenGL ES 3.0 (" + b + ")"
                  : "OpenGL ES 2.0 (" + b + ")";
                b = Md(b);
                break;
              case 35724:
                b = X.getParameter(35724);
                var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                null !== c &&
                  (3 == c[1].length && (c[1] += "0"),
                    b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
                b = Md(b);
                break;
              default:
                Cd(1280);
            }
            zd[a] = b;
          }
          return b;
        },
        eb: function (a, b) {
          if (2 > v.version) return Cd(1282), 0;
          var c = Ad[a];
          if (c) return 0 > b || b >= c.length ? (Cd(1281), 0) : c[b];
          switch (a) {
            case 7939:
              return c = X.getSupportedExtensions() ||
                [],
                c = c.concat(c.map(function (f) {
                  return "GL_" + f;
                })),
                c = c.map(function (f) {
                  return Md(f);
                }),
                c = Ad[a] = c,
                0 > b || b >= c.length ? (Cd(1281), 0) : c[b];
            default:
              return Cd(1280), 0;
          }
        },
        Ja: function (a, b) {
          function c(A) {
            return "]" == A.slice(-1) && A.lastIndexOf("[");
          }
          b = Wa(b);
          a = sd[a];
          var f = a.Ze, h = a.xg, l, n = 0, q = b, x = c(b);
          if (!f) {
            for (
              a.Ze = f = {}, a.vf = {}, l = 0;
              l < X.getProgramParameter(a, 35718);
              ++l
            ) {
              var w = X.getActiveUniform(a, l);
              var F = w.name;
              w = w.size;
              var K = c(F);
              K = 0 < K ? F.slice(0, K) : F;
              var O = a.jf;
              a.jf += w;
              h[K] = [w, O];
              for (F = 0; F < w; ++F) f[O] = F, a.vf[O++] = K;
            }
          }
          0 <
              x && (n = parseInt(b.slice(x + 1)) >>> 0, q = b.slice(0, x));
          return (h = h[q]) && n < h[0] &&
              (n += h[1], f[n] = f[n] || X.getUniformLocation(a, b))
            ? n
            : -1;
        },
        Nb: function (a, b, c) {
          for (var f = Jd[b], h = 0; h < b; h++) f[h] = P[c + 4 * h >> 2];
          X.invalidateFramebuffer(a, f);
        },
        Ob: function (a, b, c, f, h, l, n) {
          for (var q = Jd[b], x = 0; x < b; x++) q[x] = P[c + 4 * x >> 2];
          X.invalidateSubFramebuffer(a, q, f, h, l, n);
        },
        Vb: function (a) {
          return X.isSync(yd[a]);
        },
        Ka: function (a) {
          return (a = ha[a]) ? X.isTexture(a) : 0;
        },
        La: function (a) {
          X.lineWidth(a);
        },
        Na: function (a) {
          a = sd[a];
          X.linkProgram(a);
          a.Ze = 0;
          a.xg = {};
        },
        nc: function (a, b, c, f, h, l) {
          X.tf.multiDrawArraysInstancedBaseInstanceWEBGL(
            a,
            P,
            b >> 2,
            P,
            c >> 2,
            P,
            f >> 2,
            nb,
            h >> 2,
            l,
          );
        },
        oc: function (a, b, c, f, h, l, n, q) {
          X.tf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            P,
            b >> 2,
            c,
            P,
            f >> 2,
            P,
            h >> 2,
            P,
            l >> 2,
            nb,
            n >> 2,
            q,
          );
        },
        Oa: function (a, b) {
          3317 == a && (Bd = b);
          X.pixelStorei(a, b);
        },
        qc: function (a) {
          X.readBuffer(a);
        },
        Pa: function (a, b, c, f, h, l, n) {
          if (2 <= v.version) {
            if (X.ef) X.readPixels(a, b, c, f, h, l, n);
            else {
              var q = Od(l);
              X.readPixels(
                a,
                b,
                c,
                f,
                h,
                l,
                q,
                n >> 31 - Math.clz32(q.BYTES_PER_ELEMENT),
              );
            }
          } else {
            (n = Pd(l, h, c, f, n))
              ? X.readPixels(a, b, c, f, h, l, n)
              : Cd(1280);
          }
        },
        ac: function (a, b, c, f) {
          X.renderbufferStorage(a, b, c, f);
        },
        Xb: function (a, b, c, f, h) {
          X.renderbufferStorageMultisample(a, b, c, f, h);
        },
        Sb: function (a, b, c) {
          X.samplerParameteri(xd[a], b, c);
        },
        Tb: function (a, b, c) {
          X.samplerParameteri(xd[a], b, P[c >> 2]);
        },
        Qa: function (a, b, c, f) {
          X.scissor(a, b, c, f);
        },
        Ra: function (a, b, c, f) {
          for (var h = "", l = 0; l < b; ++l) {
            var n = f ? P[f + 4 * l >> 2] : -1;
            h += Wa(P[c + 4 * l >> 2], 0 > n ? void 0 : n);
          }
          X.shaderSource(vd[a], h);
        },
        Sa: function (a, b, c) {
          X.stencilFunc(a, b, c);
        },
        Ta: function (a, b, c, f) {
          X.stencilFuncSeparate(a, b, c, f);
        },
        Ua: function (a) {
          X.stencilMask(a);
        },
        Va: function (a, b) {
          X.stencilMaskSeparate(a, b);
        },
        Wa: function (a, b, c) {
          X.stencilOp(a, b, c);
        },
        Xa: function (a, b, c, f) {
          X.stencilOpSeparate(a, b, c, f);
        },
        Ya: function (a, b, c, f, h, l, n, q, x) {
          if (2 <= v.version) {
            if (X.Ce) X.texImage2D(a, b, c, f, h, l, n, q, x);
            else if (x) {
              var w = Od(q);
              X.texImage2D(
                a,
                b,
                c,
                f,
                h,
                l,
                n,
                q,
                w,
                x >> 31 - Math.clz32(w.BYTES_PER_ELEMENT),
              );
            } else X.texImage2D(a, b, c, f, h, l, n, q, null);
          } else {
            X.texImage2D(
              a,
              b,
              c,
              f,
              h,
              l,
              n,
              q,
              x ? Pd(q, n, f, h, x) : null,
            );
          }
        },
        Za: function (a, b, c) {
          X.texParameterf(a, b, c);
        },
        _a: function (a, b, c) {
          X.texParameterf(a, b, T[c >> 2]);
        },
        $a: function (a, b, c) {
          X.texParameteri(a, b, c);
        },
        ab: function (a, b, c) {
          X.texParameteri(a, b, P[c >> 2]);
        },
        kc: function (a, b, c, f, h) {
          X.texStorage2D(a, b, c, f, h);
        },
        bb: function (a, b, c, f, h, l, n, q, x) {
          if (2 <= v.version) {
            if (X.Ce) X.texSubImage2D(a, b, c, f, h, l, n, q, x);
            else if (x) {
              var w = Od(q);
              X.texSubImage2D(
                a,
                b,
                c,
                f,
                h,
                l,
                n,
                q,
                w,
                x >> 31 - Math.clz32(w.BYTES_PER_ELEMENT),
              );
            } else X.texSubImage2D(a, b, c, f, h, l, n, q, null);
          } else {
            w = null,
              x && (w = Pd(q, n, h, l, x)),
              X.texSubImage2D(a, b, c, f, h, l, n, q, w);
          }
        },
        cb: function (a, b) {
          X.uniform1f(Z(a), b);
        },
        db: function (a, b, c) {
          if (2 <= v.version) X.uniform1fv(Z(a), T, c >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Qd[b - 1], h = 0; h < b; ++h) {
                f[h] = T[c + 4 * h >> 2];
              }
            } else f = T.subarray(c >> 2, c + 4 * b >> 2);
            X.uniform1fv(Z(a), f);
          }
        },
        Vc: function (a, b) {
          X.uniform1i(Z(a), b);
        },
        Wc: function (a, b, c) {
          if (2 <= v.version) X.uniform1iv(Z(a), P, c >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Rd[b - 1], h = 0; h < b; ++h) {
                f[h] = P[c + 4 * h >> 2];
              }
            } else f = P.subarray(c >> 2, c + 4 * b >> 2);
            X.uniform1iv(Z(a), f);
          }
        },
        Xc: function (a, b, c) {
          X.uniform2f(Z(a), b, c);
        },
        Yc: function (a, b, c) {
          if (2 <= v.version) X.uniform2fv(Z(a), T, c >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (var f = Qd[2 * b - 1], h = 0; h < 2 * b; h += 2) {
                f[h] = T[c + 4 * h >> 2], f[h + 1] = T[c + (4 * h + 4) >> 2];
              }
            } else f = T.subarray(c >> 2, c + 8 * b >> 2);
            X.uniform2fv(Z(a), f);
          }
        },
        Uc: function (a, b, c) {
          X.uniform2i(Z(a), b, c);
        },
        Tc: function (a, b, c) {
          if (2 <= v.version) X.uniform2iv(Z(a), P, c >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (var f = Rd[2 * b - 1], h = 0; h < 2 * b; h += 2) {
                f[h] = P[c + 4 * h >> 2], f[h + 1] = P[c + (4 * h + 4) >> 2];
              }
            } else f = P.subarray(c >> 2, c + 8 * b >> 2);
            X.uniform2iv(Z(a), f);
          }
        },
        Sc: function (a, b, c, f) {
          X.uniform3f(Z(a), b, c, f);
        },
        Rc: function (a, b, c) {
          if (2 <= v.version) X.uniform3fv(Z(a), T, c >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (var f = Qd[3 * b - 1], h = 0; h < 3 * b; h += 3) {
                f[h] = T[c + 4 * h >> 2],
                  f[h + 1] = T[c + (4 * h + 4) >> 2],
                  f[h + 2] = T[c + (4 * h + 8) >> 2];
              }
            } else f = T.subarray(c >> 2, c + 12 * b >> 2);
            X.uniform3fv(Z(a), f);
          }
        },
        Qc: function (a, b, c, f) {
          X.uniform3i(Z(a), b, c, f);
        },
        Pc: function (a, b, c) {
          if (2 <= v.version) X.uniform3iv(Z(a), P, c >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (var f = Rd[3 * b - 1], h = 0; h < 3 * b; h += 3) {
                f[h] = P[c + 4 * h >> 2],
                  f[h + 1] = P[c + (4 * h + 4) >> 2],
                  f[h + 2] = P[c + (4 * h + 8) >> 2];
              }
            } else f = P.subarray(c >> 2, c + 12 * b >> 2);
            X.uniform3iv(Z(a), f);
          }
        },
        Oc: function (a, b, c, f, h) {
          X.uniform4f(Z(a), b, c, f, h);
        },
        Nc: function (a, b, c) {
          if (2 <= v.version) X.uniform4fv(Z(a), T, c >> 2, 4 * b);
          else {
            if (72 >= b) {
              var f = Qd[4 * b - 1], h = T;
              c >>= 2;
              for (var l = 0; l < 4 * b; l += 4) {
                var n = c + l;
                f[l] = h[n];
                f[l + 1] = h[n + 1];
                f[l + 2] = h[n + 2];
                f[l + 3] = h[n + 3];
              }
            } else f = T.subarray(c >> 2, c + 16 * b >> 2);
            X.uniform4fv(Z(a), f);
          }
        },
        Bc: function (a, b, c, f, h) {
          X.uniform4i(Z(a), b, c, f, h);
        },
        Cc: function (a, b, c) {
          if (2 <= v.version) X.uniform4iv(Z(a), P, c >> 2, 4 * b);
          else {
            if (72 >= b) {
              for (var f = Rd[4 * b - 1], h = 0; h < 4 * b; h += 4) {
                f[h] = P[c + 4 * h >> 2],
                  f[h + 1] = P[c + (4 * h + 4) >> 2],
                  f[h + 2] = P[c + (4 * h + 8) >> 2],
                  f[h + 3] = P[
                    c + (4 *
                          h + 12) >> 2
                  ];
              }
            } else f = P.subarray(c >> 2, c + 16 * b >> 2);
            X.uniform4iv(Z(a), f);
          }
        },
        Dc: function (a, b, c, f) {
          if (2 <= v.version) X.uniformMatrix2fv(Z(a), !!c, T, f >> 2, 4 * b);
          else {
            if (72 >= b) {
              for (var h = Qd[4 * b - 1], l = 0; l < 4 * b; l += 4) {
                h[l] = T[f + 4 * l >> 2],
                  h[l + 1] = T[f + (4 * l + 4) >> 2],
                  h[l + 2] = T[f + (4 * l + 8) >> 2],
                  h[l + 3] = T[f + (4 * l + 12) >> 2];
              }
            } else h = T.subarray(f >> 2, f + 16 * b >> 2);
            X.uniformMatrix2fv(Z(a), !!c, h);
          }
        },
        Ec: function (a, b, c, f) {
          if (2 <= v.version) X.uniformMatrix3fv(Z(a), !!c, T, f >> 2, 9 * b);
          else {
            if (32 >= b) {
              for (var h = Qd[9 * b - 1], l = 0; l < 9 * b; l += 9) {
                h[l] = T[f + 4 * l >> 2],
                  h[l + 1] = T[
                    f +
                      (4 * l + 4) >> 2
                  ],
                  h[l + 2] = T[f + (4 * l + 8) >> 2],
                  h[l + 3] = T[f + (4 * l + 12) >> 2],
                  h[l + 4] = T[f + (4 * l + 16) >> 2],
                  h[l + 5] = T[f + (4 * l + 20) >> 2],
                  h[l + 6] = T[f + (4 * l + 24) >> 2],
                  h[l + 7] = T[f + (4 * l + 28) >> 2],
                  h[l + 8] = T[f + (4 * l + 32) >> 2];
              }
            } else h = T.subarray(f >> 2, f + 36 * b >> 2);
            X.uniformMatrix3fv(Z(a), !!c, h);
          }
        },
        Fc: function (a, b, c, f) {
          if (2 <= v.version) X.uniformMatrix4fv(Z(a), !!c, T, f >> 2, 16 * b);
          else {
            if (18 >= b) {
              var h = Qd[16 * b - 1], l = T;
              f >>= 2;
              for (var n = 0; n < 16 * b; n += 16) {
                var q = f + n;
                h[n] = l[q];
                h[n + 1] = l[q + 1];
                h[n + 2] = l[q + 2];
                h[n + 3] = l[q + 3];
                h[n + 4] = l[q + 4];
                h[n + 5] = l[q + 5];
                h[n + 6] = l[q + 6];
                h[n + 7] = l[q + 7];
                h[n + 8] = l[q + 8];
                h[n + 9] = l[q + 9];
                h[n + 10] = l[q + 10];
                h[n + 11] = l[q + 11];
                h[n + 12] = l[q + 12];
                h[n + 13] = l[q + 13];
                h[n + 14] = l[q + 14];
                h[n + 15] = l[q + 15];
              }
            } else h = T.subarray(f >> 2, f + 64 * b >> 2);
            X.uniformMatrix4fv(Z(a), !!c, h);
          }
        },
        Gc: function (a) {
          a = sd[a];
          X.useProgram(a);
          X.Ef = a;
        },
        Hc: function (a, b) {
          X.vertexAttrib1f(a, b);
        },
        Ic: function (a, b) {
          X.vertexAttrib2f(a, T[b >> 2], T[b + 4 >> 2]);
        },
        Jc: function (a, b) {
          X.vertexAttrib3f(a, T[b >> 2], T[b + 4 >> 2], T[b + 8 >> 2]);
        },
        Kc: function (a, b) {
          X.vertexAttrib4f(
            a,
            T[b >> 2],
            T[b + 4 >> 2],
            T[b + 8 >> 2],
            T[b + 12 >> 2],
          );
        },
        lc: function (a, b) {
          X.vertexAttribDivisor(a, b);
        },
        mc: function (a, b, c, f, h) {
          X.vertexAttribIPointer(a, b, c, f, h);
        },
        Lc: function (a, b, c, f, h, l) {
          X.vertexAttribPointer(a, b, c, !!f, h, l);
        },
        Mc: function (a, b, c, f) {
          X.viewport(a, b, c, f);
        },
        gb: function (a, b, c, f) {
          X.waitSync(yd[a], b, (c >>> 0) + 4294967296 * f);
        },
        e: function (a, b) {
          je(a, b || 1);
          throw "longjmp";
        },
        pb: function (a) {
          var b = H.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var f = b * (1 + .2 / c);
            f = Math.min(f, a + 100663296);
            f = Math.max(a, f);
            0 < f % 65536 && (f += 65536 - f % 65536);
            a: {
              try {
                Ra.grow(
                  Math.min(2147483648, f) - hb.byteLength + 65535 >>>
                    16,
                );
                pb();
                var h = 1;
                break a;
              } catch (l) {}
              h = void 0;
            }
            if (h) return !0;
          }
          return !1;
        },
        kb: function () {
          return v ? v.Sf : 0;
        },
        ub: function (a, b) {
          var c = 0;
          Td().forEach(function (f, h) {
            var l = b + c;
            h = P[a + 4 * h >> 2] = l;
            for (l = 0; l < f.length; ++l) mb[h++ >> 0] = f.charCodeAt(l);
            mb[h >> 0] = 0;
            c += f.length + 1;
          });
          return 0;
        },
        vb: function (a, b) {
          var c = Td();
          P[a >> 2] = c.length;
          var f = 0;
          c.forEach(function (h) {
            f += h.length + 1;
          });
          P[b >> 2] = f;
          return 0;
        },
        Gb: function (a) {
          if (!noExitRuntime) {
            if (t.onExit) t.onExit(a);
            Sa = !0;
          }
          wa(a, new Ka(a));
        },
        H: function () {
          return 0;
        },
        tb: function (a, b) {
          a = 1 ==
                a || 2 == a
            ? 2
            : La();
          mb[b >> 0] = a;
          return 0;
        },
        nb: function (a, b, c, f, h, l) {
          a = Jb.Of(a);
          b = Jb.Ff(a, b, c, f);
          P[l >> 2] = b;
          return 0;
        },
        wb: function (a, b, c, f) {
          a = Jb.Of(a);
          b = Jb.Ff(a, b, c);
          P[f >> 2] = b;
          return 0;
        },
        mb: function () {},
        N: function (a, b, c, f) {
          for (var h = 0, l = 0; l < c; l++) {
            for (
              var n = P[b + 8 * l >> 2], q = P[b + (8 * l + 4) >> 2], x = 0;
              x < q;
              x++
            ) {
              var w = H[n + x], F = Ib[a];
              0 === w || 10 === w
                ? ((1 === a ? Ma : Oa)(Va(F, 0)), F.length = 0)
                : F.push(w);
            }
            h += q;
          }
          P[f >> 2] = h;
          return 0;
        },
        a: function () {
          return Pa;
        },
        l: ke,
        o: le,
        g: me,
        D: ne,
        Lb: oe,
        W: pe,
        V: qe,
        U: re,
        n: se,
        r: te,
        i: ue,
        q: ve,
        Jb: we,
        Hb: xe,
        Ib: ye,
        b: function (a) {
          Pa = a;
        },
        rb: function (a, b, c, f) {
          return $d(a, b, c, f);
        },
      };
      (function () {
        function a(h) {
          t.asm = h.exports;
          Ra = t.asm.ad;
          pb();
          qb = t.asm.dd;
          sb.unshift(t.asm.bd);
          vb--;
          t.monitorRunDependencies && t.monitorRunDependencies(vb);
          0 == vb &&
            (null !== wb && (clearInterval(wb), wb = null),
              xb && (h = xb, xb = null, h()));
        }
        function b(h) {
          a(h.instance);
        }
        function c(h) {
          return Db().then(function (l) {
            return WebAssembly.instantiate(wasmBuff, f);
          }).then(h, function (l) {
            Oa("failed to asynchronously prepare wasm: " + l);
            La(l);
          });
        }
        var f = { a: ze };
        vb++;
        t.monitorRunDependencies && t.monitorRunDependencies(vb);
        if (t.instantiateWasm) {
          try {
            return t.instantiateWasm(f, a);
          } catch (h) {
            return Oa(
              "Module.instantiateWasm callback failed with error: " + h,
            ),
              !1;
          }
        }
        (function () {
          return Qa || "function" !== typeof WebAssembly.instantiateStreaming ||
              yb() || zb.startsWith("file://") || "function" !== typeof fetch
            ? c(b)
            : Promise.resolve().then(function (h) {
              return WebAssembly.instantiate(wasmBuff, f).then(
                b,
                function (l) {
                  Oa("wasm streaming compile failed: " + l);
                  Oa("falling back to ArrayBuffer instantiation");
                  return c(b);
                },
              );
            });
        })().catch(fa);
        return {};
      })();
      t.___wasm_call_ctors = function () {
        return (t.___wasm_call_ctors = t.asm.bd).apply(null, arguments);
      };
      var he = t._memset = function () {
          return (he = t._memset = t.asm.cd).apply(null, arguments);
        },
        Nd = t._malloc = function () {
          return (Nd = t._malloc = t.asm.ed).apply(null, arguments);
        },
        Lc = t._free = function () {
          return (Lc = t._free = t.asm.fd).apply(null, arguments);
        },
        ie = t.___errno_location = function () {
          return (ie = t.___errno_location = t.asm.gd).apply(null, arguments);
        },
        Kc = t.___getTypeName = function () {
          return (Kc = t.___getTypeName = t.asm.hd).apply(null, arguments);
        };
      t.___embind_register_native_and_builtin_types = function () {
        return (t.___embind_register_native_and_builtin_types = t.asm.id).apply(
          null,
          arguments,
        );
      };
      var Ae = t.stackSave = function () {
          return (Ae = t.stackSave = t.asm.jd).apply(null, arguments);
        },
        Be = t.stackRestore = function () {
          return (Be = t.stackRestore = t.asm.kd).apply(null, arguments);
        },
        je = t._setThrew = function () {
          return (je = t._setThrew = t.asm.ld).apply(null, arguments);
        },
        ge = t._memalign = function () {
          return (ge = t._memalign = t.asm.md).apply(null, arguments);
        };
      t.dynCall_iiiji = function () {
        return (t.dynCall_iiiji = t.asm.nd).apply(null, arguments);
      };
      t.dynCall_ji = function () {
        return (t.dynCall_ji = t.asm.od).apply(null, arguments);
      };
      t.dynCall_iiji = function () {
        return (t.dynCall_iiji = t.asm.pd).apply(null, arguments);
      };
      t.dynCall_iijjiii = function () {
        return (t.dynCall_iijjiii = t.asm.qd).apply(null, arguments);
      };
      t.dynCall_iij = function () {
        return (t.dynCall_iij = t.asm.rd).apply(null, arguments);
      };
      t.dynCall_vijjjii = function () {
        return (t.dynCall_vijjjii = t.asm.sd).apply(null, arguments);
      };
      t.dynCall_viji = function () {
        return (t.dynCall_viji = t.asm.td).apply(null, arguments);
      };
      t.dynCall_vijiii = function () {
        return (t.dynCall_vijiii = t.asm.ud).apply(null, arguments);
      };
      t.dynCall_viiiiij = function () {
        return (t.dynCall_viiiiij = t.asm.vd).apply(null, arguments);
      };
      t.dynCall_viijii = function () {
        return (t.dynCall_viijii = t.asm.wd).apply(null, arguments);
      };
      t.dynCall_jii = function () {
        return (t.dynCall_jii = t.asm.xd).apply(null, arguments);
      };
      t.dynCall_iiij = function () {
        return (t.dynCall_iiij = t.asm.yd).apply(null, arguments);
      };
      t.dynCall_iiiij = function () {
        return (t.dynCall_iiiij = t.asm.zd).apply(null, arguments);
      };
      t.dynCall_viij = function () {
        return (t.dynCall_viij = t.asm.Ad).apply(null, arguments);
      };
      t.dynCall_viiij = function () {
        return (t.dynCall_viiij = t.asm.Bd).apply(null, arguments);
      };
      t.dynCall_vij = function () {
        return (t.dynCall_vij = t.asm.Cd).apply(null, arguments);
      };
      t.dynCall_jiiii = function () {
        return (t.dynCall_jiiii = t.asm.Dd).apply(null, arguments);
      };
      t.dynCall_jiiiiii = function () {
        return (t.dynCall_jiiiiii = t.asm.Ed).apply(null, arguments);
      };
      t.dynCall_jiiiiji = function () {
        return (t.dynCall_jiiiiji = t.asm.Fd).apply(null, arguments);
      };
      t.dynCall_iijj = function () {
        return (t.dynCall_iijj = t.asm.Gd).apply(null, arguments);
      };
      t.dynCall_jiji = function () {
        return (t.dynCall_jiji = t.asm.Hd).apply(null, arguments);
      };
      t.dynCall_iiiiij = function () {
        return (t.dynCall_iiiiij = t.asm.Id).apply(null, arguments);
      };
      t.dynCall_iiiiijj = function () {
        return (t.dynCall_iiiiijj = t.asm.Jd).apply(null, arguments);
      };
      t.dynCall_iiiiiijj = function () {
        return (t.dynCall_iiiiiijj = t.asm.Kd).apply(null, arguments);
      };
      function ke(a, b) {
        var c = Ae();
        try {
          return qb.get(a)(b);
        } catch (f) {
          Be(c);
          if (f !== f + 0 && "longjmp" !== f) throw f;
          je(1, 0);
        }
      }
      function le(a, b, c) {
        var f = Ae();
        try {
          return qb.get(a)(b, c);
        } catch (h) {
          Be(f);
          if (h !== h + 0 && "longjmp" !== h) throw h;
          je(1, 0);
        }
      }
      function ue(a, b, c, f) {
        var h = Ae();
        try {
          qb.get(a)(b, c, f);
        } catch (l) {
          Be(h);
          if (l !== l + 0 && "longjmp" !== l) throw l;
          je(1, 0);
        }
      }
      function me(a, b, c, f) {
        var h = Ae();
        try {
          return qb.get(a)(b, c, f);
        } catch (l) {
          Be(h);
          if (l !== l + 0 && "longjmp" !== l) throw l;
          je(1, 0);
        }
      }
      function se(a, b) {
        var c = Ae();
        try {
          qb.get(a)(b);
        } catch (f) {
          Be(c);
          if (f !== f + 0 && "longjmp" !== f) throw f;
          je(1, 0);
        }
      }
      function te(a, b, c) {
        var f = Ae();
        try {
          qb.get(a)(b, c);
        } catch (h) {
          Be(f);
          if (h !== h + 0 && "longjmp" !== h) throw h;
          je(1, 0);
        }
      }
      function oe(a, b, c, f, h, l) {
        var n = Ae();
        try {
          return qb.get(a)(b, c, f, h, l);
        } catch (q) {
          Be(n);
          if (q !== q + 0 && "longjmp" !== q) throw q;
          je(1, 0);
        }
      }
      function ve(a, b, c, f, h) {
        var l = Ae();
        try {
          qb.get(a)(b, c, f, h);
        } catch (n) {
          Be(l);
          if (n !== n + 0 && "longjmp" !== n) throw n;
          je(1, 0);
        }
      }
      function pe(a, b, c, f, h, l, n) {
        var q = Ae();
        try {
          return qb.get(a)(b, c, f, h, l, n);
        } catch (x) {
          Be(q);
          if (x !== x + 0 && "longjmp" !== x) throw x;
          je(1, 0);
        }
      }
      function ne(a, b, c, f, h) {
        var l = Ae();
        try {
          return qb.get(a)(b, c, f, h);
        } catch (n) {
          Be(l);
          if (n !== n + 0 && "longjmp" !== n) throw n;
          je(1, 0);
        }
      }
      function we(a, b, c, f, h, l) {
        var n = Ae();
        try {
          qb.get(a)(b, c, f, h, l);
        } catch (q) {
          Be(n);
          if (q !== q + 0 && "longjmp" !== q) throw q;
          je(1, 0);
        }
      }
      function ye(a, b, c, f, h, l, n, q, x, w) {
        var F = Ae();
        try {
          qb.get(a)(b, c, f, h, l, n, q, x, w);
        } catch (K) {
          Be(F);
          if (K !== K + 0 && "longjmp" !== K) throw K;
          je(1, 0);
        }
      }
      function xe(a, b, c, f, h, l, n) {
        var q = Ae();
        try {
          qb.get(a)(b, c, f, h, l, n);
        } catch (x) {
          Be(q);
          if (x !== x + 0 && "longjmp" !== x) throw x;
          je(1, 0);
        }
      }
      function qe(a, b, c, f, h, l, n, q, x, w) {
        var F = Ae();
        try {
          return qb.get(a)(b, c, f, h, l, n, q, x, w);
        } catch (K) {
          Be(F);
          if (K !== K + 0 && "longjmp" !== K) throw K;
          je(1, 0);
        }
      }
      function re(a) {
        var b = Ae();
        try {
          qb.get(a)();
        } catch (c) {
          Be(b);
          if (c !== c + 0 && "longjmp" !== c) throw c;
          je(1, 0);
        }
      }
      var Ce;
      function Ka(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a;
      }
      xb = function De() {
        Ce || Ee();
        Ce || (xb = De);
      };
      function Ee() {
        function a() {
          if (!Ce && (Ce = !0, t.calledRun = !0, !Sa)) {
            Eb(sb);
            da(t);
            if (t.onRuntimeInitialized) t.onRuntimeInitialized();
            if (t.postRun) {
              for (
                "function" == typeof t.postRun && (t.postRun = [t.postRun]);
                t.postRun.length;
              ) {
                var b = t.postRun.shift();
                tb.unshift(b);
              }
            }
            Eb(tb);
          }
        }
        if (!(0 < vb)) {
          if (t.preRun) {
            for (
              "function" == typeof t.preRun && (t.preRun = [t.preRun]);
              t.preRun.length;
            ) {
              ub();
            }
          }
          Eb(rb);
          0 < vb ||
            (t.setStatus
              ? (t.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    t.setStatus("");
                  }, 1);
                  a();
                }, 1))
              : a());
        }
      }
      t.run = Ee;
      if (t.preInit) {
        for (
          "function" == typeof t.preInit && (t.preInit = [t.preInit]);
          0 < t.preInit.length;
        ) {
          t.preInit.pop()();
        }
      }
      Ee();

      return CanvasKitInit.ready;
    }
  );
})();
