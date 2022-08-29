// NOTE: ported from https://unpkg.com/canvaskit-wasm@0.36.1

import { encodeBase64 } from "./base64.ts";
import { WASM_BUFFER as wasmBuff } from "./wasm.js";
import { maybeHSL } from "./color_util.ts";

let document = { getElementById: () => undefined };

export var CanvasKitInit = (() => {
  var _scriptDir = typeof document !== "undefined" && document.currentScript
    ? document.currentScript.src
    : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return (
    function (CanvasKitInit) {
      CanvasKitInit = CanvasKitInit || {};

      null;
      var v;
      v || (v = typeof CanvasKitInit !== "undefined" ? CanvasKitInit : {});
      var da, ea;
      v.ready = new Promise(function (a, b) {
        da = a;
        ea = b;
      });
      (function (a) {
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.MakeSWCanvasSurface = function (b) {
            var d = b;
            if (
              "CANVAS" !== d.tagName && (d = document.getElementById(b), !d)
            ) {
              throw "Canvas with id " + b + " was not found";
            }
            if (b = a.MakeSurface(d.width, d.height)) b.Nd = d;
            return b;
          };
          a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
          a.MakeSurface = function (b, d) {
            var f = {
                width: b,
                height: d,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
              },
              h = b * d * 4,
              m = a._malloc(h);
            if (f = a.Surface._makeRasterDirect(f, m, 4 * b)) {
              f.Nd = null,
                f.Df = b,
                f.zf = d,
                f.Bf = h,
                f.$e = m,
                f.getCanvas().clear(a.TRANSPARENT);
            }
            return f;
          };
          a.MakeRasterDirectSurface = function (b, d, f) {
            return a.Surface._makeRasterDirect(b, d.byteOffset, f);
          };
          a.Surface.prototype.flush = function (b) {
            a.Od(this.Md);
            this._flush();
            if (this.Nd) {
              var d = new Uint8ClampedArray(a.HEAPU8.buffer, this.$e, this.Bf);
              d = new ImageData(d, this.Df, this.zf);
              b
                ? this.Nd.getContext("2d").putImageData(
                  d,
                  0,
                  0,
                  b[0],
                  b[1],
                  b[2] - b[0],
                  b[3] - b[1],
                )
                : this.Nd.getContext("2d").putImageData(d, 0, 0);
            }
          };
          a.Surface.prototype.dispose = function () {
            this.$e && a._free(this.$e);
            this.delete();
          };
          a.Od = a.Od || function () {};
          a.df = a.df || function () {
            return null;
          };
        });
      })(v);
      (function (a) {
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          function b(n, q, x) {
            return n && n.hasOwnProperty(q) ? n[q] : x;
          }
          function d(n) {
            var q = ha(ja);
            ja[q] = n;
            return q;
          }
          function f(n) {
            return n.naturalHeight || n.videoHeight || n.displayHeight ||
              n.height;
          }
          function h(n) {
            return n.naturalWidth || n.videoWidth || n.displayWidth || n.width;
          }
          function m(n, q, x, D) {
            n.bindTexture(n.TEXTURE_2D, q);
            D || x.alphaType !== a.AlphaType.Premul ||
              n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
            return q;
          }
          function t(n, q, x) {
            x || q.alphaType !== a.AlphaType.Premul ||
              n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
            n.bindTexture(n.TEXTURE_2D, null);
          }
          a.GetWebGLContext = function (n, q) {
            if (!n) throw "null canvas passed into makeWebGLContext";
            var x = {
              alpha: b(q, "alpha", 1),
              depth: b(q, "depth", 1),
              stencil: b(q, "stencil", 8),
              antialias: b(q, "antialias", 0),
              premultipliedAlpha: b(q, "premultipliedAlpha", 1),
              preserveDrawingBuffer: b(q, "preserveDrawingBuffer", 0),
              preferLowPowerToHighPerformance: b(
                q,
                "preferLowPowerToHighPerformance",
                0,
              ),
              failIfMajorPerformanceCaveat: b(
                q,
                "failIfMajorPerformanceCaveat",
                0,
              ),
              enableExtensionsByDefault: b(q, "enableExtensionsByDefault", 1),
              explicitSwapControl: b(q, "explicitSwapControl", 0),
              renderViaOffscreenBackBuffer: b(
                q,
                "renderViaOffscreenBackBuffer",
                0,
              ),
            };
            x.majorVersion = q && q.majorVersion
              ? q.majorVersion
              : "undefined" !== typeof WebGL2RenderingContext
              ? 2
              : 1;
            if (x.explicitSwapControl) {
              throw "explicitSwapControl is not supported";
            }
            n = la(n, x);
            if (!n) return 0;
            ma(n);
            w.ge.getExtension("WEBGL_debug_renderer_info");
            return n;
          };
          a.deleteContext = function (n) {
            w === na[n] && (w = null);
            "object" == typeof JSEvents &&
              JSEvents.ug(na[n].ge.canvas);
            na[n] && na[n].ge.canvas && (na[n].ge.canvas.xf = void 0);
            na[n] = null;
          };
          a._setTextureCleanup({
            deleteTexture: function (n, q) {
              var x = ja[q];
              x && na[n].ge.deleteTexture(x);
              ja[q] = null;
            },
          });
          a.MakeWebGLContext = function (n) {
            if (!this.Od(n)) return null;
            var q = this._MakeGrContext();
            if (!q) return null;
            q.Md = n;
            return w.Tf = q;
          };
          a.MakeGrContext = a.MakeWebGLContext;
          a.MakeOnScreenGLSurface = function (n, q, x, D) {
            if (!this.Od(n.Md)) return null;
            q = this._MakeOnScreenGLSurface(n, q, x, D);
            if (!q) return null;
            q.Md = n.Md;
            return q;
          };
          a.MakeRenderTarget = function () {
            var n = arguments[0];
            if (!this.Od(n.Md)) return null;
            if (3 === arguments.length) {
              var q = this._MakeRenderTargetWH(n, arguments[1], arguments[2]);
              if (!q) return null;
            } else if (2 === arguments.length) {
              if (q = this._MakeRenderTargetII(n, arguments[1]), !q) {
                return null;
              }
            } else return null;
            q.Md = n.Md;
            return q;
          };
          a.MakeWebGLCanvasSurface = function (n, q, x) {
            q = q || null;
            var D = n,
              I = "undefined" !== typeof OffscreenCanvas &&
                D instanceof OffscreenCanvas;
            if (
              !("undefined" !== typeof HTMLCanvasElement &&
                  D instanceof HTMLCanvasElement ||
                I || (D = document.getElementById(n), D))
            ) {
              throw "Canvas with id " + n + " was not found";
            }
            n = this.GetWebGLContext(D, x);
            if (!n || 0 > n) throw "failed to create webgl context: err " + n;
            n = this.MakeWebGLContext(n);
            q = this.MakeOnScreenGLSurface(n, D.width, D.height, q);
            return q
              ? q
              : (q = D.cloneNode(!0),
                D.parentNode.replaceChild(q, D),
                q.classList.add("ck-replaced"),
                a.MakeSWCanvasSurface(q));
          };
          a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
          a.Surface.prototype.makeImageFromTexture = function (n, q) {
            a.Od(this.Md);
            n = d(n);
            if (q = this._makeImageFromTexture(this.Md, n, q)) {
              q.Le = n;
            }
            return q;
          };
          a.Surface.prototype.makeImageFromTextureSource = function (n, q, x) {
            q ||
              (q = {
                height: f(n),
                width: h(n),
                colorType: a.ColorType.RGBA_8888,
                alphaType: x ? a.AlphaType.Premul : a.AlphaType.Unpremul,
              });
            q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
            a.Od(this.Md);
            var D = w.ge;
            x = m(D, D.createTexture(), q, x);
            2 === w.version
              ? D.texImage2D(
                D.TEXTURE_2D,
                0,
                D.RGBA,
                q.width,
                q.height,
                0,
                D.RGBA,
                D.UNSIGNED_BYTE,
                n,
              )
              : D.texImage2D(
                D.TEXTURE_2D,
                0,
                D.RGBA,
                D.RGBA,
                D.UNSIGNED_BYTE,
                n,
              );
            t(D, q);
            return this.makeImageFromTexture(x, q);
          };
          a.Surface.prototype.updateTextureFromSource = function (n, q, x) {
            if (n.Le) {
              a.Od(this.Md);
              var D = n.getImageInfo(), I = w.ge, M = m(I, ja[n.Le], D, x);
              2 === w.version
                ? I.texImage2D(
                  I.TEXTURE_2D,
                  0,
                  I.RGBA,
                  h(q),
                  f(q),
                  0,
                  I.RGBA,
                  I.UNSIGNED_BYTE,
                  q,
                )
                : I.texImage2D(
                  I.TEXTURE_2D,
                  0,
                  I.RGBA,
                  I.RGBA,
                  I.UNSIGNED_BYTE,
                  q,
                );
              t(I, D, x);
              this._resetContext();
              ja[n.Le] = null;
              n.Le = d(M);
              D.colorSpace = n.getColorSpace();
              q = this._makeImageFromTexture(this.Md, n.Le, D);
              x = n.Ld.Td;
              I = n.Ld.$d;
              n.Ld.Td = q.Ld.Td;
              n.Ld.$d = q.Ld.$d;
              q.Ld.Td = x;
              q.Ld.$d = I;
              q.delete();
              D.colorSpace.delete();
            }
          };
          a.MakeLazyImageFromTextureSource = function (n, q, x) {
            q ||
              (q = {
                height: f(n),
                width: h(n),
                colorType: a.ColorType.RGBA_8888,
                alphaType: x ? a.AlphaType.Premul : a.AlphaType.Unpremul,
              });
            q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
            var D = {
              makeTexture: function () {
                var I = w, M = I.ge, z = m(M, M.createTexture(), q, x);
                2 === I.version
                  ? M.texImage2D(
                    M.TEXTURE_2D,
                    0,
                    M.RGBA,
                    q.width,
                    q.height,
                    0,
                    M.RGBA,
                    M.UNSIGNED_BYTE,
                    n,
                  )
                  : M.texImage2D(
                    M.TEXTURE_2D,
                    0,
                    M.RGBA,
                    M.RGBA,
                    M.UNSIGNED_BYTE,
                    n,
                  );
                t(M, q, x);
                return d(z);
              },
              freeSrc: function () {},
            };
            "VideoFrame" === n.constructor.name &&
              (D.freeSrc = function () {
                n.close();
              });
            return a.Image._makeFromGenerator(q, D);
          };
          a.Od = function (n) {
            return n ? ma(n) : !1;
          };
          a.df = function () {
            return w ? w.Tf : null;
          };
        });
      })(v);
      (function (a) {
        function b(e, c, g, l, r) {
          for (var y = 0; y < e.length; y++) {
            c[y * g + (y * r + l + g) % g] = e[y];
          }
          return c;
        }
        function d(e) {
          for (var c = e * e, g = Array(c); c--;) {
            g[c] = 0 === c % (e + 1) ? 1 : 0;
          }
          return g;
        }
        function f(e) {
          return e ? e.constructor === Float32Array && 4 === e.length : !1;
        }
        function h(e) {
          return (n(255 * e[3]) << 24 | n(255 * e[0]) << 16 |
            n(255 * e[1]) << 8 | n(255 * e[2]) << 0) >>> 0;
        }
        function m(e) {
          if (e && e._ck) return e;
          if (e instanceof Float32Array) {
            for (
              var c = Math.floor(e.length / 4), g = new Uint32Array(c), l = 0;
              l < c;
              l++
            ) {
              g[l] = h(e.slice(4 * l, 4 * (l + 1)));
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
        function t(e) {
          if (void 0 === e) return 1;
          var c = parseFloat(e);
          return e && -1 !== e.indexOf("%") ? c / 100 : c;
        }
        function n(e) {
          return Math.round(Math.max(0, Math.min(e || 0, 255)));
        }
        function q(e, c) {
          c && c._ck || a._free(e);
        }
        function x(e, c, g) {
          if (!e || !e.length) return V;
          if (e && e._ck) return e.byteOffset;
          var l = a[c].BYTES_PER_ELEMENT;
          g || (g = a._malloc(e.length * l));
          a[c].set(e, g / l);
          return g;
        }
        function D(e) {
          var c = { ce: V, count: e.length, colorType: a.ColorType.RGBA_F32 };
          if (e instanceof Float32Array) {
            c.ce = x(e, "HEAPF32"), c.count = e.length / 4;
          } else if (e instanceof Uint32Array) {
            c.ce = x(e, "HEAPU32"), c.colorType = a.ColorType.RGBA_8888;
          } else if (e instanceof Array) {
            if (e && e.length) {
              for (
                var g = a._malloc(16 * e.length), l = 0, r = g / 4, y = 0;
                y < e.length;
                y++
              ) {
                for (var C = 0; 4 > C; C++) a.HEAPF32[r + l] = e[y][C], l++;
              }
              e = g;
            } else e = V;
            c.ce = e;
          } else {
            throw "Invalid argument to copyFlexibleColorArray, Not a color array " +
              typeof e;
          }
          return c;
        }
        function I(e) {
          if (!e) return V;
          var c = Ub.toTypedArray();
          if (e.length) {
            if (
              6 === e.length ||
              9 === e.length
            ) {
              return x(e, "HEAPF32", Oa),
                6 === e.length && a.HEAPF32.set(yd, 6 + Oa / 4),
                Oa;
            }
            if (16 === e.length) {
              return c[0] = e[0],
                c[1] = e[1],
                c[2] = e[3],
                c[3] = e[4],
                c[4] = e[5],
                c[5] = e[7],
                c[6] = e[12],
                c[7] = e[13],
                c[8] = e[15],
                Oa;
            }
            throw "invalid matrix size";
          }
          if (void 0 === e.m11) throw "invalid matrix argument";
          c[0] = e.m11;
          c[1] = e.m21;
          c[2] = e.m41;
          c[3] = e.m12;
          c[4] = e.m22;
          c[5] = e.m42;
          c[6] = e.m14;
          c[7] = e.m24;
          c[8] = e.m44;
          return Oa;
        }
        function M(e) {
          if (!e) return V;
          var c = Vb.toTypedArray();
          if (e.length) {
            if (16 !== e.length && 6 !== e.length && 9 !== e.length) {
              throw "invalid matrix size";
            }
            if (16 === e.length) return x(e, "HEAPF32", ab);
            c.fill(0);
            c[0] = e[0];
            c[1] = e[1];
            c[3] = e[2];
            c[4] = e[3];
            c[5] = e[4];
            c[7] = e[5];
            c[10] = 1;
            c[12] = e[6];
            c[13] = e[7];
            c[15] = e[8];
            6 === e.length && (c[12] = 0, c[13] = 0, c[15] = 1);
            return ab;
          }
          if (void 0 === e.m11) throw "invalid matrix argument";
          c[0] = e.m11;
          c[1] = e.m21;
          c[2] = e.m31;
          c[3] = e.m41;
          c[4] = e.m12;
          c[5] = e.m22;
          c[6] = e.m32;
          c[7] = e.m42;
          c[8] = e.m13;
          c[9] = e.m23;
          c[10] = e.m33;
          c[11] = e.m43;
          c[12] = e.m14;
          c[13] = e.m24;
          c[14] = e.m34;
          c[15] = e.m44;
          return ab;
        }
        function z(e, c) {
          return x(e, "HEAPF32", c || Ua);
        }
        function N(e, c, g, l) {
          var r = Wb.toTypedArray();
          r[0] = e;
          r[1] = c;
          r[2] = g;
          r[3] = l;
          return Ua;
        }
        function S(e) {
          for (var c = new Float32Array(4), g = 0; 4 > g; g++) {
            c[g] = a.HEAPF32[e / 4 + g];
          }
          return c;
        }
        function T(e, c) {
          return x(e, "HEAPF32", c || ia);
        }
        function pa(e, c) {
          return x(e, "HEAPF32", c || Xb);
        }
        function ta() {
          for (var e = 0, c = 0; c < arguments.length - 1; c += 2) {
            e += arguments[c] * arguments[c + 1];
          }
          return e;
        }
        function gb(e, c, g) {
          for (var l = Array(e.length), r = 0; r < g; r++) {
            for (var y = 0; y < g; y++) {
              for (var C = 0, J = 0; J < g; J++) {
                C += e[g * r + J] * c[g * J + y];
              }
              l[r * g + y] = C;
            }
          }
          return l;
        }
        function hb(e, c) {
          for (var g = gb(c[0], c[1], e), l = 2; l < c.length;) {
            g = gb(g, c[l], e), l++;
          }
          return g;
        }
        a.Color = function (e, c, g, l) {
          void 0 === l && (l = 1);
          return a.Color4f(n(e) / 255, n(c) / 255, n(g) / 255, l);
        };
        a.ColorAsInt = function (e, c, g, l) {
          void 0 === l && (l = 255);
          return (n(l) << 24 | n(e) << 16 | n(c) << 8 |
            n(g) << 0 & 268435455) >>> 0;
        };
        a.Color4f = function (e, c, g, l) {
          void 0 === l && (l = 1);
          return Float32Array.of(e, c, g, l);
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
            Math.floor(255 * e[1]),
            Math.floor(255 * e[2]),
            e[3],
          ];
        };
        a.parseColorString = function (e, c) {
          e = e.toLowerCase();
          if (e.startsWith("#")) {
            c = 255;
            switch (e.length) {
              case 9:
                c = parseInt(e.slice(7, 9), 16);
              case 7:
                var g = parseInt(e.slice(1, 3), 16);
                var l = parseInt(e.slice(3, 5), 16);
                var r = parseInt(e.slice(5, 7), 16);
                break;
              case 5:
                c = 17 * parseInt(e.slice(4, 5), 16);
              case 4:
                g = 17 * parseInt(e.slice(1, 2), 16),
                  l = 17 * parseInt(e.slice(2, 3), 16),
                  r = 17 * parseInt(e.slice(3, 4), 16);
            }
            return a.Color(g, l, r, c / 255);
          }
          return e.startsWith("rgba")
            ? (e = e.slice(5, -1),
              e = e.split(","),
              a.Color(+e[0], +e[1], +e[2], t(e[3])))
            : e.startsWith("rgb")
            ? (e = e.slice(4, -1),
              e = e.split(","),
              a.Color(+e[0], +e[1], +e[2], t(e[3])))
            : e.startsWith("gray(") || e.startsWith("hsl") || !c ||
                (e = c[e], void 0 === e)
            ? a.BLACK
            : e;
        };
        a.multiplyByAlpha = function (e, c) {
          e = e.slice();
          e[3] = Math.max(0, Math.min(e[3] * c, 1));
          return e;
        };
        a.Malloc = function (e, c) {
          var g = a._malloc(c * e.BYTES_PER_ELEMENT);
          return {
            _ck: !0,
            length: c,
            byteOffset: g,
            re: null,
            subarray: function (l, r) {
              l = this.toTypedArray().subarray(l, r);
              l._ck = !0;
              return l;
            },
            toTypedArray: function () {
              if (this.re && this.re.length) return this.re;
              this.re = new e(a.HEAPU8.buffer, g, c);
              this.re._ck = !0;
              return this.re;
            },
          };
        };
        a.Free = function (e) {
          a._free(e.byteOffset);
          e.byteOffset = V;
          e.toTypedArray = null;
          e.re = null;
        };
        var Oa = V,
          Ub,
          ab = V,
          Vb,
          Ua = V,
          Wb,
          Ha,
          ia = V,
          Cc,
          Pa = V,
          Dc,
          Yb = V,
          Ec,
          Zb = V,
          $b,
          xb = V,
          Fc,
          Xb = V,
          Gc,
          Hc = V,
          yd = Float32Array.of(0, 0, 1),
          V = 0;
        a.onRuntimeInitialized = function () {
          function e(c, g, l, r, y, C, J) {
            C ||
              (C = 4 * r.width,
                r.colorType === a.ColorType.RGBA_F16
                  ? C *= 2
                  : r.colorType === a.ColorType.RGBA_F32 &&
                    (C *= 4));
            var P = C * r.height;
            var O = y ? y.byteOffset : a._malloc(P);
            if (
              J
                ? !c._readPixels(r, O, C, g, l, J)
                : !c._readPixels(r, O, C, g, l)
            ) {
              return y || a._free(O), null;
            }
            if (y) return y.toTypedArray();
            switch (r.colorType) {
              case a.ColorType.RGBA_8888:
              case a.ColorType.RGBA_F16:
                c = new Uint8Array(a.HEAPU8.buffer, O, P);
                if (!r.__raw) c = c.slice();
                break;
              case a.ColorType.RGBA_F32:
                c = new Float32Array(a.HEAPU8.buffer, O, P);
                if (!r.__raw) c = c.slice();
                break;
              default:
                return null;
            }
            a._free(O);
            return c;
          }
          Wb = a.Malloc(Float32Array, 4);
          Ua = Wb.byteOffset;
          Vb = a.Malloc(Float32Array, 16);
          ab = Vb.byteOffset;
          Ub = a.Malloc(Float32Array, 9);
          Oa = Ub.byteOffset;
          Fc = a.Malloc(Float32Array, 12);
          Xb = Fc.byteOffset;
          Gc = a.Malloc(Float32Array, 12);
          Hc = Gc.byteOffset;
          Ha = a.Malloc(Float32Array, 4);
          ia = Ha.byteOffset;
          Cc = a.Malloc(Float32Array, 4);
          Pa = Cc.byteOffset;
          Dc = a.Malloc(Float32Array, 3);
          Yb = Dc.byteOffset;
          Ec = a.Malloc(Float32Array, 3);
          Zb = Ec.byteOffset;
          $b = a.Malloc(Int32Array, 4);
          xb = $b.byteOffset;
          a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
          a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
          a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
          a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
          a.Path.MakeFromCmds = function (c) {
            var g = x(c, "HEAPF32"), l = a.Path._MakeFromCmds(g, c.length);
            q(g, c);
            return l;
          };
          a.Path.MakeFromVerbsPointsWeights = function (c, g, l) {
            var r = x(c, "HEAPU8"),
              y = x(g, "HEAPF32"),
              C = x(l, "HEAPF32"),
              J = a.Path._MakeFromVerbsPointsWeights(
                r,
                c.length,
                y,
                g.length,
                C,
                l && l.length || 0,
              );
            q(r, c);
            q(y, g);
            q(C, l);
            return J;
          };
          a.Path.prototype.addArc = function (c, g, l) {
            c = T(c);
            this._addArc(c, g, l);
            return this;
          };
          a.Path.prototype.addCircle = function (c, g, l, r) {
            this._addCircle(c, g, l, !!r);
            return this;
          };
          a.Path.prototype.addOval = function (c, g, l) {
            void 0 === l && (l = 1);
            c = T(c);
            this._addOval(c, !!g, l);
            return this;
          };
          a.Path.prototype.addPath = function () {
            var c = Array.prototype.slice.call(arguments), g = c[0], l = !1;
            "boolean" === typeof c[c.length - 1] && (l = c.pop());
            if (1 === c.length) this._addPath(g, 1, 0, 0, 0, 1, 0, 0, 0, 1, l);
            else if (2 === c.length) {
              c = c[1],
                this._addPath(
                  g,
                  c[0],
                  c[1],
                  c[2],
                  c[3],
                  c[4],
                  c[5],
                  c[6] || 0,
                  c[7] || 0,
                  c[8] || 1,
                  l,
                );
            } else if (7 === c.length || 10 === c.length) {
              this._addPath(
                g,
                c[1],
                c[2],
                c[3],
                c[4],
                c[5],
                c[6],
                c[7] ||
                  0,
                c[8] || 0,
                c[9] || 1,
                l,
              );
            } else return null;
            return this;
          };
          a.Path.prototype.addPoly = function (c, g) {
            var l = x(c, "HEAPF32");
            this._addPoly(l, c.length / 2, g);
            q(l, c);
            return this;
          };
          a.Path.prototype.addRect = function (c, g) {
            c = T(c);
            this._addRect(c, !!g);
            return this;
          };
          a.Path.prototype.addRRect = function (c, g) {
            c = pa(c);
            this._addRRect(c, !!g);
            return this;
          };
          a.Path.prototype.addVerbsPointsWeights = function (c, g, l) {
            var r = x(c, "HEAPU8"), y = x(g, "HEAPF32"), C = x(l, "HEAPF32");
            this._addVerbsPointsWeights(
              r,
              c.length,
              y,
              g.length,
              C,
              l && l.length || 0,
            );
            q(r, c);
            q(y, g);
            q(C, l);
          };
          a.Path.prototype.arc = function (c, g, l, r, y, C) {
            c = a.LTRBRect(c - l, g - l, c + l, g + l);
            y = (y - r) / Math.PI * 180 - 360 * !!C;
            C = new a.Path();
            C.addArc(c, r / Math.PI * 180, y);
            this.addPath(C, !0);
            C.delete();
            return this;
          };
          a.Path.prototype.arcToOval = function (c, g, l, r) {
            c = T(c);
            this._arcToOval(c, g, l, r);
            return this;
          };
          a.Path.prototype.arcToRotated = function (c, g, l, r, y, C, J) {
            this._arcToRotated(c, g, l, !!r, !!y, C, J);
            return this;
          };
          a.Path.prototype.arcToTangent = function (c, g, l, r, y) {
            this._arcToTangent(c, g, l, r, y);
            return this;
          };
          a.Path.prototype.close = function () {
            this._close();
            return this;
          };
          a.Path.prototype.conicTo = function (c, g, l, r, y) {
            this._conicTo(c, g, l, r, y);
            return this;
          };
          a.Path.prototype.computeTightBounds = function (c) {
            this._computeTightBounds(ia);
            var g = Ha.toTypedArray();
            return c ? (c.set(g), c) : g.slice();
          };
          a.Path.prototype.cubicTo = function (c, g, l, r, y, C) {
            this._cubicTo(c, g, l, r, y, C);
            return this;
          };
          a.Path.prototype.dash = function (c, g, l) {
            return this._dash(c, g, l) ? this : null;
          };
          a.Path.prototype.getBounds = function (c) {
            this._getBounds(ia);
            var g = Ha.toTypedArray();
            return c ? (c.set(g), c) : g.slice();
          };
          a.Path.prototype.lineTo = function (c, g) {
            this._lineTo(c, g);
            return this;
          };
          a.Path.prototype.moveTo = function (c, g) {
            this._moveTo(c, g);
            return this;
          };
          a.Path.prototype.offset = function (c, g) {
            this._transform(1, 0, c, 0, 1, g, 0, 0, 1);
            return this;
          };
          a.Path.prototype.quadTo = function (c, g, l, r) {
            this._quadTo(c, g, l, r);
            return this;
          };
          a.Path.prototype.rArcTo = function (c, g, l, r, y, C, J) {
            this._rArcTo(c, g, l, r, y, C, J);
            return this;
          };
          a.Path.prototype.rConicTo = function (c, g, l, r, y) {
            this._rConicTo(c, g, l, r, y);
            return this;
          };
          a.Path.prototype.rCubicTo = function (c, g, l, r, y, C) {
            this._rCubicTo(c, g, l, r, y, C);
            return this;
          };
          a.Path.prototype.rLineTo = function (c, g) {
            this._rLineTo(c, g);
            return this;
          };
          a.Path.prototype.rMoveTo = function (c, g) {
            this._rMoveTo(c, g);
            return this;
          };
          a.Path.prototype.rQuadTo = function (c, g, l, r) {
            this._rQuadTo(c, g, l, r);
            return this;
          };
          a.Path.prototype.stroke = function (c) {
            c = c || {};
            c.width = c.width || 1;
            c.miter_limit = c.miter_limit || 4;
            c.cap = c.cap || a.StrokeCap.Butt;
            c.join = c.join || a.StrokeJoin.Miter;
            c.precision = c.precision || 1;
            return this._stroke(c) ? this : null;
          };
          a.Path.prototype.transform = function () {
            if (1 === arguments.length) {
              var c = arguments[0];
              this._transform(
                c[0],
                c[1],
                c[2],
                c[3],
                c[4],
                c[5],
                c[6] || 0,
                c[7] || 0,
                c[8] || 1,
              );
            } else if (6 === arguments.length || 9 === arguments.length) {
              c = arguments,
                this._transform(
                  c[0],
                  c[1],
                  c[2],
                  c[3],
                  c[4],
                  c[5],
                  c[6] || 0,
                  c[7] || 0,
                  c[8] || 1,
                );
            } else {
              throw "transform expected to take 1 or 9 arguments. Got " +
                arguments.length;
            }
            return this;
          };
          a.Path.prototype.trim = function (c, g, l) {
            return this._trim(c, g, !!l) ? this : null;
          };
          a.Image.prototype.makeShaderCubic = function (c, g, l, r, y) {
            y = I(y);
            return this._makeShaderCubic(c, g, l, r, y);
          };
          a.Image.prototype.makeShaderOptions = function (c, g, l, r, y) {
            y = I(y);
            return this._makeShaderOptions(c, g, l, r, y);
          };
          a.Image.prototype.readPixels = function (c, g, l, r, y) {
            return e(this, c, g, l, r, y, a.df());
          };
          a.Canvas.prototype.clear = function (c) {
            a.Od(this.Md);
            c = z(c);
            this._clear(c);
          };
          a.Canvas.prototype.clipRRect = function (c, g, l) {
            a.Od(this.Md);
            c = pa(c);
            this._clipRRect(c, g, l);
          };
          a.Canvas.prototype.clipRect = function (c, g, l) {
            a.Od(this.Md);
            c = T(c);
            this._clipRect(c, g, l);
          };
          a.Canvas.prototype.concat = function (c) {
            a.Od(this.Md);
            c = M(c);
            this._concat(c);
          };
          a.Canvas.prototype.drawArc = function (c, g, l, r, y) {
            a.Od(this.Md);
            c = T(c);
            this._drawArc(c, g, l, r, y);
          };
          a.Canvas.prototype.drawAtlas = function (c, g, l, r, y, C, J) {
            if (c && r && g && l && g.length === l.length) {
              a.Od(this.Md);
              y || (y = a.BlendMode.SrcOver);
              var P = x(g, "HEAPF32"),
                O = x(l, "HEAPF32"),
                W = l.length / 4,
                u = x(m(C), "HEAPU32");
              if (J && "B" in J && "C" in J) {
                this._drawAtlasCubic(c, O, P, u, W, y, J.B, J.C, r);
              } else {
                let G = a.FilterMode.Linear, R = a.MipmapMode.None;
                J && (G = J.filter, "mipmap" in J && (R = J.mipmap));
                this._drawAtlasOptions(c, O, P, u, W, y, G, R, r);
              }
              q(P, g);
              q(O, l);
              q(u, C);
            }
          };
          a.Canvas.prototype.drawCircle = function (c, g, l, r) {
            a.Od(this.Md);
            this._drawCircle(c, g, l, r);
          };
          a.Canvas.prototype.drawColor = function (c, g) {
            a.Od(this.Md);
            c = z(c);
            void 0 !== g ? this._drawColor(c, g) : this._drawColor(c);
          };
          a.Canvas.prototype.drawColorInt = function (c, g) {
            a.Od(this.Md);
            this._drawColorInt(c, g || a.BlendMode.SrcOver);
          };
          a.Canvas.prototype.drawColorComponents = function (c, g, l, r, y) {
            a.Od(this.Md);
            c = N(c, g, l, r);
            void 0 !== y ? this._drawColor(c, y) : this._drawColor(c);
          };
          a.Canvas.prototype.drawDRRect = function (c, g, l) {
            a.Od(this.Md);
            c = pa(c, Xb);
            g = pa(g, Hc);
            this._drawDRRect(c, g, l);
          };
          a.Canvas.prototype.drawImage = function (c, g, l, r) {
            a.Od(this.Md);
            this._drawImage(c, g, l, r || null);
          };
          a.Canvas.prototype.drawImageCubic = function (c, g, l, r, y, C) {
            a.Od(this.Md);
            this._drawImageCubic(c, g, l, r, y, C || null);
          };
          a.Canvas.prototype.drawImageOptions = function (c, g, l, r, y, C) {
            a.Od(this.Md);
            this._drawImageOptions(c, g, l, r, y, C || null);
          };
          a.Canvas.prototype.drawImageNine = function (c, g, l, r, y) {
            a.Od(this.Md);
            g = x(g, "HEAP32", xb);
            l = T(l);
            this._drawImageNine(c, g, l, r, y || null);
          };
          a.Canvas.prototype.drawImageRect = function (c, g, l, r, y) {
            a.Od(this.Md);
            T(g, ia);
            T(l, Pa);
            this._drawImageRect(c, ia, Pa, r, !!y);
          };
          a.Canvas.prototype.drawImageRectCubic = function (c, g, l, r, y, C) {
            a.Od(this.Md);
            T(g, ia);
            T(l, Pa);
            this._drawImageRectCubic(c, ia, Pa, r, y, C || null);
          };
          a.Canvas.prototype.drawImageRectOptions = function (
            c,
            g,
            l,
            r,
            y,
            C,
          ) {
            a.Od(this.Md);
            T(g, ia);
            T(l, Pa);
            this._drawImageRectOptions(c, ia, Pa, r, y, C || null);
          };
          a.Canvas.prototype.drawLine = function (c, g, l, r, y) {
            a.Od(this.Md);
            this._drawLine(c, g, l, r, y);
          };
          a.Canvas.prototype.drawOval = function (c, g) {
            a.Od(this.Md);
            c = T(c);
            this._drawOval(c, g);
          };
          a.Canvas.prototype.drawPaint = function (c) {
            a.Od(this.Md);
            this._drawPaint(c);
          };
          a.Canvas.prototype.drawParagraph = function (c, g, l) {
            a.Od(this.Md);
            this._drawParagraph(c, g, l);
          };
          a.Canvas.prototype.drawPatch = function (c, g, l, r, y) {
            if (24 > c.length) throw "Need 12 cubic points";
            if (g && 4 > g.length) throw "Need 4 colors";
            if (l && 8 > l.length) throw "Need 4 shader coordinates";
            a.Od(this.Md);
            const C = x(c, "HEAPF32"),
              J = g ? x(m(g), "HEAPU32") : V,
              P = l ? x(l, "HEAPF32") : V;
            r || (r = a.BlendMode.Modulate);
            this._drawPatch(C, J, P, r, y);
            q(P, l);
            q(J, g);
            q(C, c);
          };
          a.Canvas.prototype.drawPath = function (c, g) {
            a.Od(this.Md);
            this._drawPath(c, g);
          };
          a.Canvas.prototype.drawPicture = function (c) {
            a.Od(this.Md);
            this._drawPicture(c);
          };
          a.Canvas.prototype.drawPoints = function (c, g, l) {
            a.Od(this.Md);
            var r = x(g, "HEAPF32");
            this._drawPoints(c, r, g.length / 2, l);
            q(r, g);
          };
          a.Canvas.prototype.drawRRect = function (c, g) {
            a.Od(this.Md);
            c = pa(c);
            this._drawRRect(c, g);
          };
          a.Canvas.prototype.drawRect = function (c, g) {
            a.Od(this.Md);
            c = T(c);
            this._drawRect(c, g);
          };
          a.Canvas.prototype.drawRect4f = function (c, g, l, r, y) {
            a.Od(this.Md);
            this._drawRect4f(c, g, l, r, y);
          };
          a.Canvas.prototype.drawShadow = function (c, g, l, r, y, C, J) {
            a.Od(this.Md);
            var P = x(y, "HEAPF32"), O = x(C, "HEAPF32");
            g = x(g, "HEAPF32", Yb);
            l = x(l, "HEAPF32", Zb);
            this._drawShadow(c, g, l, r, P, O, J);
            q(P, y);
            q(O, C);
          };
          a.getShadowLocalBounds = function (c, g, l, r, y, C, J) {
            c = I(c);
            l = x(l, "HEAPF32", Yb);
            r = x(r, "HEAPF32", Zb);
            if (!this._getShadowLocalBounds(c, g, l, r, y, C, ia)) return null;
            g = Ha.toTypedArray();
            return J ? (J.set(g), J) : g.slice();
          };
          a.Canvas.prototype.drawTextBlob = function (c, g, l, r) {
            a.Od(this.Md);
            this._drawTextBlob(c, g, l, r);
          };
          a.Canvas.prototype.drawVertices = function (c, g, l) {
            a.Od(this.Md);
            this._drawVertices(c, g, l);
          };
          a.Canvas.prototype.getDeviceClipBounds = function (c) {
            this._getDeviceClipBounds(xb);
            var g = $b.toTypedArray();
            c ? c.set(g) : c = g.slice();
            return c;
          };
          a.Canvas.prototype.getLocalToDevice = function () {
            this._getLocalToDevice(ab);
            for (var c = ab, g = Array(16), l = 0; 16 > l; l++) {
              g[l] = a.HEAPF32[c / 4 + l];
            }
            return g;
          };
          a.Canvas.prototype.getTotalMatrix = function () {
            this._getTotalMatrix(Oa);
            for (var c = Array(9), g = 0; 9 > g; g++) {
              c[g] = a.HEAPF32[Oa / 4 + g];
            }
            return c;
          };
          a.Canvas.prototype.makeSurface = function (c) {
            c = this._makeSurface(c);
            c.Md = this.Md;
            return c;
          };
          a.Canvas.prototype.readPixels = function (c, g, l, r, y) {
            a.Od(this.Md);
            return e(this, c, g, l, r, y);
          };
          a.Canvas.prototype.saveLayer = function (c, g, l, r) {
            g = T(g);
            return this._saveLayer(c || null, g, l || null, r || 0);
          };
          a.Canvas.prototype.writePixels = function (c, g, l, r, y, C, J, P) {
            if (c.byteLength % (g * l)) {
              throw "pixels length must be a multiple of the srcWidth * srcHeight";
            }
            a.Od(this.Md);
            var O = c.byteLength / (g * l);
            C = C || a.AlphaType.Unpremul;
            J = J || a.ColorType.RGBA_8888;
            P = P || a.ColorSpace.SRGB;
            var W = O * g;
            O = x(c, "HEAPU8");
            g = this._writePixels(
              {
                width: g,
                height: l,
                colorType: J,
                alphaType: C,
                colorSpace: P,
              },
              O,
              W,
              r,
              y,
            );
            q(O, c);
            return g;
          };
          a.ColorFilter.MakeBlend = function (c, g, l) {
            c = z(c);
            l = l || a.ColorSpace.SRGB;
            return a.ColorFilter._MakeBlend(c, g, l);
          };
          a.ColorFilter.MakeMatrix = function (c) {
            if (!c || 20 !== c.length) throw "invalid color matrix";
            var g = x(c, "HEAPF32"), l = a.ColorFilter._makeMatrix(g);
            q(g, c);
            return l;
          };
          a.ContourMeasure.prototype.getPosTan = function (c, g) {
            this._getPosTan(c, ia);
            c = Ha.toTypedArray();
            return g ? (g.set(c), g) : c.slice();
          };
          a.ImageFilter.MakeDropShadow = function (c, g, l, r, y, C) {
            y = z(y, Ua);
            return a.ImageFilter._MakeDropShadow(c, g, l, r, y, C);
          };
          a.ImageFilter.MakeDropShadowOnly = function (c, g, l, r, y, C) {
            y = z(y, Ua);
            return a.ImageFilter._MakeDropShadowOnly(c, g, l, r, y, C);
          };
          a.ImageFilter.MakeImage = function (c, g, l, r) {
            l = T(l, ia);
            r = T(r, Pa);
            if ("B" in g && "C" in g) {
              return a.ImageFilter._MakeImageCubic(c, g.B, g.C, l, r);
            }
            const y = g.filter;
            let C = a.MipmapMode.None;
            "mipmap" in g && (C = g.mipmap);
            return a.ImageFilter._MakeImageOptions(c, y, C, l, r);
          };
          a.ImageFilter.MakeMatrixTransform = function (c, g, l) {
            c = I(c);
            if ("B" in g && "C" in g) {
              return a.ImageFilter._MakeMatrixTransformCubic(c, g.B, g.C, l);
            }
            const r = g.filter;
            let y = a.MipmapMode.None;
            "mipmap" in g && (y = g.mipmap);
            return a.ImageFilter._MakeMatrixTransformOptions(c, r, y, l);
          };
          a.Paint.prototype.getColor = function () {
            this._getColor(Ua);
            return S(Ua);
          };
          a.Paint.prototype.setColor = function (c, g) {
            g = g || null;
            c = z(c);
            this._setColor(c, g);
          };
          a.Paint.prototype.setColorComponents = function (c, g, l, r, y) {
            y = y || null;
            c = N(c, g, l, r);
            this._setColor(c, y);
          };
          a.Path.prototype.getPoint = function (c, g) {
            this._getPoint(c, ia);
            c = Ha.toTypedArray();
            return g ? (g[0] = c[0], g[1] = c[1], g) : c.slice(0, 2);
          };
          a.Picture.prototype.makeShader = function (c, g, l, r, y) {
            r = I(r);
            y = T(y);
            return this._makeShader(c, g, l, r, y);
          };
          a.PictureRecorder.prototype.beginRecording = function (c) {
            c = T(c);
            return this._beginRecording(c);
          };
          a.Surface.prototype.getCanvas = function () {
            var c = this._getCanvas();
            c.Md = this.Md;
            return c;
          };
          a.Surface.prototype.makeImageSnapshot = function (c) {
            a.Od(this.Md);
            c = x(c, "HEAP32", xb);
            return this._makeImageSnapshot(c);
          };
          a.Surface.prototype.makeSurface = function (c) {
            a.Od(this.Md);
            c = this._makeSurface(c);
            c.Md = this.Md;
            return c;
          };
          a.Surface.prototype.Cf = function (c, g) {
            this.He || (this.He = this.getCanvas());
            requestAnimationFrame(function () {
              a.Od(this.Md);
              c(this.He);
              this.flush(g);
            }.bind(this));
          };
          a.Surface.prototype.requestAnimationFrame ||
            (a.Surface.prototype.requestAnimationFrame =
              a.Surface.prototype.Cf);
          a.Surface.prototype.yf = function (c, g) {
            this.He || (this.He = this.getCanvas());
            requestAnimationFrame(function () {
              a.Od(this.Md);
              c(this.He);
              this.flush(g);
              this.dispose();
            }.bind(this));
          };
          a.Surface.prototype.drawOnce ||
            (a.Surface.prototype.drawOnce = a.Surface.prototype.yf);
          a.PathEffect.MakeDash = function (c, g) {
            g || (g = 0);
            if (!c.length || 1 === c.length % 2) {
              throw "Intervals array must have even length";
            }
            var l = x(c, "HEAPF32");
            g = a.PathEffect._MakeDash(l, c.length, g);
            q(l, c);
            return g;
          };
          a.PathEffect.MakeLine2D = function (c, g) {
            g = I(g);
            return a.PathEffect._MakeLine2D(c, g);
          };
          a.PathEffect.MakePath2D = function (c, g) {
            c = I(c);
            return a.PathEffect._MakePath2D(c, g);
          };
          a.Shader.MakeColor = function (c, g) {
            g = g || null;
            c = z(c);
            return a.Shader._MakeColor(c, g);
          };
          a.Shader.Blend = a.Shader.MakeBlend;
          a.Shader.Color = a.Shader.MakeColor;
          a.Shader.MakeLinearGradient = function (c, g, l, r, y, C, J, P) {
            P = P || null;
            var O = D(l), W = x(r, "HEAPF32");
            J = J || 0;
            C = I(C);
            var u = Ha.toTypedArray();
            u.set(c);
            u.set(g, 2);
            c = a.Shader._MakeLinearGradient(
              ia,
              O.ce,
              O.colorType,
              W,
              O.count,
              y,
              J,
              C,
              P,
            );
            q(O.ce, l);
            r && q(W, r);
            return c;
          };
          a.Shader.MakeRadialGradient = function (c, g, l, r, y, C, J, P) {
            P = P || null;
            var O = D(l), W = x(r, "HEAPF32");
            J = J || 0;
            C = I(C);
            c = a.Shader._MakeRadialGradient(
              c[0],
              c[1],
              g,
              O.ce,
              O.colorType,
              W,
              O.count,
              y,
              J,
              C,
              P,
            );
            q(O.ce, l);
            r && q(W, r);
            return c;
          };
          a.Shader.MakeSweepGradient = function (c, g, l, r, y, C, J, P, O, W) {
            W = W || null;
            var u = D(l), G = x(r, "HEAPF32");
            J = J || 0;
            P = P || 0;
            O = O || 360;
            C = I(C);
            c = a.Shader._MakeSweepGradient(
              c,
              g,
              u.ce,
              u.colorType,
              G,
              u.count,
              y,
              P,
              O,
              J,
              C,
              W,
            );
            q(u.ce, l);
            r && q(G, r);
            return c;
          };
          a.Shader.MakeTwoPointConicalGradient = function (
            c,
            g,
            l,
            r,
            y,
            C,
            J,
            P,
            O,
            W,
          ) {
            W = W || null;
            var u = D(y),
              G = x(C, "HEAPF32");
            O = O || 0;
            P = I(P);
            var R = Ha.toTypedArray();
            R.set(c);
            R.set(l, 2);
            c = a.Shader._MakeTwoPointConicalGradient(
              ia,
              g,
              r,
              u.ce,
              u.colorType,
              G,
              u.count,
              J,
              O,
              P,
              W,
            );
            q(u.ce, y);
            C && q(G, C);
            return c;
          };
          a.Vertices.prototype.bounds = function (c) {
            this._bounds(ia);
            var g = Ha.toTypedArray();
            return c ? (c.set(g), c) : g.slice();
          };
          a.Vd && a.Vd.forEach(function (c) {
            c();
          });
        };
        a.computeTonalColors = function (e) {
          var c = x(e.ambient, "HEAPF32"), g = x(e.spot, "HEAPF32");
          this._computeTonalColors(c, g);
          var l = { ambient: S(c), spot: S(g) };
          q(c, e.ambient);
          q(g, e.spot);
          return l;
        };
        a.LTRBRect = function (e, c, g, l) {
          return Float32Array.of(e, c, g, l);
        };
        a.XYWHRect = function (e, c, g, l) {
          return Float32Array.of(e, c, e + g, c + l);
        };
        a.LTRBiRect = function (e, c, g, l) {
          return Int32Array.of(e, c, g, l);
        };
        a.XYWHiRect = function (e, c, g, l) {
          return Int32Array.of(e, c, e + g, c + l);
        };
        a.RRectXY = function (e, c, g) {
          return Float32Array.of(
            e[0],
            e[1],
            e[2],
            e[3],
            c,
            g,
            c,
            g,
            c,
            g,
            c,
            g,
          );
        };
        a.MakeAnimatedImageFromEncoded = function (e) {
          e = new Uint8Array(e);
          var c = a._malloc(e.byteLength);
          a.HEAPU8.set(e, c);
          return (e = a._decodeAnimatedImage(c, e.byteLength)) ? e : null;
        };
        a.MakeImageFromEncoded = function (e) {
          e = new Uint8Array(e);
          var c = a._malloc(e.byteLength);
          a.HEAPU8.set(e, c);
          return (e = a._decodeImage(c, e.byteLength)) ? e : null;
        };
        var ib = null;
        a.MakeImageFromCanvasImageSource = function (e) {
          var c = e.width, g = e.height;
          ib || (ib = document.createElement("canvas"));
          ib.width = c;
          ib.height = g;
          var l = ib.getContext("2d", { wg: !0 });
          l.drawImage(e, 0, 0);
          e = l.getImageData(0, 0, c, g);
          return a.MakeImage(
            {
              width: c,
              height: g,
              alphaType: a.AlphaType.Unpremul,
              colorType: a.ColorType.RGBA_8888,
              colorSpace: a.ColorSpace.SRGB,
            },
            e.data,
            4 * c,
          );
        };
        a.MakeImage = function (e, c, g) {
          var l = a._malloc(c.length);
          a.HEAPU8.set(c, l);
          return a._MakeImage(e, l, c.length, g);
        };
        a.MakeVertices = function (e, c, g, l, r, y) {
          var C = r && r.length || 0, J = 0;
          g && g.length && (J |= 1);
          l && l.length && (J |= 2);
          void 0 === y || y || (J |= 4);
          e = new a._VerticesBuilder(e, c.length / 2, C, J);
          x(c, "HEAPF32", e.positions());
          e.texCoords() && x(g, "HEAPF32", e.texCoords());
          e.colors() && x(m(l), "HEAPU32", e.colors());
          e.indices() && x(r, "HEAPU16", e.indices());
          return e.detach();
        };
        a.Matrix = {};
        a.Matrix.identity = function () {
          return d(3);
        };
        a.Matrix.invert = function (e) {
          var c = e[0] * e[4] * e[8] + e[1] * e[5] * e[6] + e[2] * e[3] * e[7] -
            e[2] * e[4] * e[6] - e[1] * e[3] * e[8] - e[0] * e[5] * e[7];
          return c
            ? [
              (e[4] * e[8] - e[5] * e[7]) / c,
              (e[2] * e[7] - e[1] * e[8]) / c,
              (e[1] * e[5] - e[2] * e[4]) / c,
              (e[5] * e[6] - e[3] * e[8]) / c,
              (e[0] * e[8] - e[2] * e[6]) / c,
              (e[2] * e[3] - e[0] * e[5]) / c,
              (e[3] * e[7] - e[4] * e[6]) / c,
              (e[1] * e[6] - e[0] * e[7]) / c,
              (e[0] * e[4] - e[1] * e[3]) / c,
            ]
            : null;
        };
        a.Matrix.mapPoints = function (e, c) {
          for (var g = 0; g < c.length; g += 2) {
            var l = c[g],
              r = c[g + 1],
              y = e[6] * l + e[7] * r + e[8],
              C = e[3] * l + e[4] * r + e[5];
            c[g] = (e[0] * l + e[1] * r + e[2]) / y;
            c[g + 1] = C / y;
          }
          return c;
        };
        a.Matrix.multiply = function () {
          return hb(3, arguments);
        };
        a.Matrix.rotated = function (e, c, g) {
          c = c || 0;
          g = g || 0;
          var l = Math.sin(e);
          e = Math.cos(e);
          return [
            e,
            -l,
            ta(l, g, 1 - e, c),
            l,
            e,
            ta(-l, c, 1 - e, g),
            0,
            0,
            1,
          ];
        };
        a.Matrix.scaled = function (e, c, g, l) {
          g = g || 0;
          l = l || 0;
          var r = b([e, c], d(3), 3, 0, 1);
          return b([g - e * g, l - c * l], r, 3, 2, 0);
        };
        a.Matrix.skewed = function (e, c, g, l) {
          g = g || 0;
          l = l || 0;
          var r = b([e, c], d(3), 3, 1, -1);
          return b([-e * g, -c * l], r, 3, 2, 0);
        };
        a.Matrix.translated = function (e, c) {
          return b(arguments, d(3), 3, 2, 0);
        };
        a.Vector = {};
        a.Vector.dot = function (e, c) {
          return e.map(function (g, l) {
            return g * c[l];
          }).reduce(function (g, l) {
            return g + l;
          });
        };
        a.Vector.lengthSquared = function (e) {
          return a.Vector.dot(e, e);
        };
        a.Vector.length = function (e) {
          return Math.sqrt(a.Vector.lengthSquared(e));
        };
        a.Vector.mulScalar = function (e, c) {
          return e.map(function (g) {
            return g * c;
          });
        };
        a.Vector.add = function (e, c) {
          return e.map(function (g, l) {
            return g + c[l];
          });
        };
        a.Vector.sub = function (e, c) {
          return e.map(function (g, l) {
            return g - c[l];
          });
        };
        a.Vector.dist = function (e, c) {
          return a.Vector.length(a.Vector.sub(e, c));
        };
        a.Vector.normalize = function (e) {
          return a.Vector.mulScalar(e, 1 / a.Vector.length(e));
        };
        a.Vector.cross = function (e, c) {
          return [
            e[1] * c[2] - e[2] * c[1],
            e[2] * c[0] - e[0] * c[2],
            e[0] * c[1] - e[1] * c[0],
          ];
        };
        a.M44 = {};
        a.M44.identity = function () {
          return d(4);
        };
        a.M44.translated = function (e) {
          return b(e, d(4), 4, 3, 0);
        };
        a.M44.scaled = function (e) {
          return b(e, d(4), 4, 0, 1);
        };
        a.M44.rotated = function (e, c) {
          return a.M44.rotatedUnitSinCos(
            a.Vector.normalize(e),
            Math.sin(c),
            Math.cos(c),
          );
        };
        a.M44.rotatedUnitSinCos = function (e, c, g) {
          var l = e[0], r = e[1];
          e = e[2];
          var y = 1 - g;
          return [
            y * l * l + g,
            y * l * r - c * e,
            y * l * e + c * r,
            0,
            y * l * r + c * e,
            y * r * r + g,
            y * r * e - c * l,
            0,
            y * l * e - c * r,
            y * r * e + c * l,
            y * e * e + g,
            0,
            0,
            0,
            0,
            1,
          ];
        };
        a.M44.lookat = function (e, c, g) {
          c = a.Vector.normalize(a.Vector.sub(c, e));
          g = a.Vector.normalize(g);
          g = a.Vector.normalize(a.Vector.cross(c, g));
          var l = a.M44.identity();
          b(g, l, 4, 0, 0);
          b(a.Vector.cross(g, c), l, 4, 1, 0);
          b(a.Vector.mulScalar(c, -1), l, 4, 2, 0);
          b(e, l, 4, 3, 0);
          e = a.M44.invert(l);
          return null === e ? a.M44.identity() : e;
        };
        a.M44.perspective = function (e, c, g) {
          var l = 1 / (c - e);
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
            (c + e) * l,
            2 * c * e * l,
            0,
            0,
            -1,
            1,
          ];
        };
        a.M44.rc = function (e, c, g) {
          return e[4 * c + g];
        };
        a.M44.multiply = function () {
          return hb(4, arguments);
        };
        a.M44.invert = function (e) {
          var c = e[0],
            g = e[4],
            l = e[8],
            r = e[12],
            y = e[1],
            C = e[5],
            J = e[9],
            P = e[13],
            O = e[2],
            W = e[6],
            u = e[10],
            G = e[14],
            R = e[3],
            aa = e[7],
            ka = e[11];
          e = e[15];
          var qa = c * C - g * y,
            ua = c * J - l * y,
            Aa = c * P - r * y,
            fa = g * J - l * C,
            H = g * P - r * C,
            k = l * P - r * J,
            p = O * aa - W * R,
            A = O * ka - u * R,
            B = O * e - G * R,
            E = W * ka - u * aa,
            F = W * e - G * aa,
            L = u * e - G * ka,
            ba = qa * L - ua * F + Aa * E + fa * B - H * A + k * p,
            ca = 1 / ba;
          if (0 === ba || Infinity === ca) return null;
          qa *= ca;
          ua *= ca;
          Aa *= ca;
          fa *= ca;
          H *= ca;
          k *= ca;
          p *= ca;
          A *= ca;
          B *= ca;
          E *= ca;
          F *= ca;
          L *= ca;
          c = [
            C * L - J * F + P * E,
            J * B - y * L - P * A,
            y * F - C * B + P * p,
            C * A - y * E - J * p,
            l * F - g * L - r * E,
            c * L - l * B + r * A,
            g * B - c * F - r * p,
            c * E - g * A + l * p,
            aa * k - ka * H + e * fa,
            ka * Aa - R * k - e * ua,
            R * H - aa * Aa + e * qa,
            aa * ua - R * fa - ka * qa,
            u * H - W * k - G * fa,
            O * k - u * Aa + G * ua,
            W * Aa - O * H - G * qa,
            O * fa - W * ua + u * qa,
          ];
          return c.every(function (Ia) {
              return !isNaN(Ia) && Infinity !== Ia && -Infinity !== Ia;
            })
            ? c
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
        a.M44.setupCamera = function (e, c, g) {
          var l = a.M44.lookat(g.eye, g.coa, g.up);
          g = a.M44.perspective(g.near, g.far, g.angle);
          c = [(e[2] - e[0]) / 2, (e[3] - e[1]) / 2, c];
          e = a.M44.multiply(
            a.M44.translated([(e[0] + e[2]) / 2, (e[1] + e[3]) / 2, 0]),
            a.M44.scaled(c),
          );
          return a.M44.multiply(e, g, l, a.M44.mustInvert(e));
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
        a.ColorMatrix.scaled = function (e, c, g, l) {
          var r = new Float32Array(20);
          r[0] = e;
          r[6] = c;
          r[12] = g;
          r[18] = l;
          return r;
        };
        var zd = [[6, 7, 11, 12], [0, 10, 2, 12], [0, 1, 5, 6]];
        a.ColorMatrix.rotated = function (e, c, g) {
          var l = a.ColorMatrix.identity();
          e = zd[e];
          l[e[0]] = g;
          l[e[1]] = c;
          l[e[2]] = -c;
          l[e[3]] = g;
          return l;
        };
        a.ColorMatrix.postTranslate = function (e, c, g, l, r) {
          e[4] += c;
          e[9] += g;
          e[14] += l;
          e[19] += r;
          return e;
        };
        a.ColorMatrix.concat = function (e, c) {
          for (var g = new Float32Array(20), l = 0, r = 0; 20 > r; r += 5) {
            for (
              var y = 0;
              4 >
                y;
              y++
            ) {
              g[l++] = e[r] * c[y] + e[r + 1] * c[y + 5] +
                e[r + 2] * c[y + 10] + e[r + 3] * c[y + 15];
            }
            g[l++] = e[r] * c[4] + e[r + 1] * c[9] + e[r + 2] * c[14] +
              e[r + 3] * c[19] + e[r + 4];
          }
          return g;
        };
        (function (e) {
          e.Vd = e.Vd || [];
          e.Vd.push(function () {
            function c(u) {
              if (!u || !u.length) return [];
              for (var G = [], R = 0; R < u.length; R += 5) {
                var aa = e.LTRBRect(u[R], u[R + 1], u[R + 2], u[R + 3]);
                aa.direction = 0 === u[R + 4]
                  ? e.TextDirection.RTL
                  : e.TextDirection.LTR;
                G.push(aa);
              }
              e._free(u.byteOffset);
              return G;
            }
            function g(u) {
              u = u || {};
              void 0 === u.weight && (u.weight = e.FontWeight.Normal);
              u.width = u.width ||
                e.FontWidth.Normal;
              u.slant = u.slant || e.FontSlant.Upright;
              return u;
            }
            function l(u) {
              if (!u || !u.length) return V;
              for (var G = [], R = 0; R < u.length; R++) {
                var aa = r(u[R]);
                G.push(aa);
              }
              return x(G, "HEAPU32");
            }
            function r(u) {
              if (J[u]) return J[u];
              var G = oa(u) + 1, R = e._malloc(G);
              ra(u, K, R, G);
              return J[u] = R;
            }
            function y(u) {
              u._colorPtr = z(u.color);
              u._foregroundColorPtr = V;
              u._backgroundColorPtr = V;
              u._decorationColorPtr = V;
              u.foregroundColor &&
                (u._foregroundColorPtr = z(u.foregroundColor, P));
              u.backgroundColor &&
                (u._backgroundColorPtr = z(u.backgroundColor, O));
              u.decorationColor &&
                (u._decorationColorPtr = z(u.decorationColor, W));
              Array.isArray(u.fontFamilies) && u.fontFamilies.length
                ? (u._fontFamiliesPtr = l(u.fontFamilies),
                  u._fontFamiliesLen = u.fontFamilies.length)
                : (u._fontFamiliesPtr = V, u._fontFamiliesLen = 0);
              if (u.locale) {
                var G = u.locale;
                u._localePtr = r(G);
                u._localeLen = oa(G) + 1;
              } else u._localePtr = V, u._localeLen = 0;
              if (Array.isArray(u.shadows) && u.shadows.length) {
                G = u.shadows;
                var R = G.map(function (fa) {
                    return fa.color || e.BLACK;
                  }),
                  aa = G.map(function (fa) {
                    return fa.blurRadius ||
                      0;
                  });
                u._shadowLen = G.length;
                for (
                  var ka = e._malloc(8 * G.length), qa = ka / 4, ua = 0;
                  ua < G.length;
                  ua++
                ) {
                  var Aa = G[ua].offset || [0, 0];
                  e.HEAPF32[qa] = Aa[0];
                  e.HEAPF32[qa + 1] = Aa[1];
                  qa += 2;
                }
                u._shadowColorsPtr = D(R).ce;
                u._shadowOffsetsPtr = ka;
                u._shadowBlurRadiiPtr = x(aa, "HEAPF32");
              } else {
                u._shadowLen = 0,
                  u._shadowColorsPtr = V,
                  u._shadowOffsetsPtr = V,
                  u._shadowBlurRadiiPtr = V;
              }
              Array.isArray(u.fontFeatures) && u.fontFeatures.length
                ? (G = u.fontFeatures,
                  R = G.map(function (fa) {
                    return fa.name;
                  }),
                  aa = G.map(function (fa) {
                    return fa.value;
                  }),
                  u._fontFeatureLen = G.length,
                  u._fontFeatureNamesPtr = l(R),
                  u._fontFeatureValuesPtr = x(aa, "HEAPU32"))
                : (u._fontFeatureLen = 0,
                  u._fontFeatureNamesPtr = V,
                  u._fontFeatureValuesPtr = V);
              Array.isArray(u.fontVariations) && u.fontVariations.length
                ? (G = u.fontVariations,
                  R = G.map(function (fa) {
                    return fa.axis;
                  }),
                  aa = G.map(function (fa) {
                    return fa.value;
                  }),
                  u._fontVariationLen = G.length,
                  u._fontVariationAxesPtr = l(R),
                  u._fontVariationValuesPtr = x(aa, "HEAPF32"))
                : (u._fontVariationLen = 0,
                  u._fontVariationAxesPtr = V,
                  u._fontVariationValuesPtr = V);
            }
            function C(u) {
              e._free(u._fontFamiliesPtr);
              e._free(u._shadowColorsPtr);
              e._free(u._shadowOffsetsPtr);
              e._free(u._shadowBlurRadiiPtr);
              e._free(u._fontFeatureNamesPtr);
              e._free(u._fontFeatureValuesPtr);
            }
            e.Paragraph.prototype.getRectsForRange = function (u, G, R, aa) {
              u = this._getRectsForRange(u, G, R, aa);
              return c(u);
            };
            e.Paragraph.prototype.getRectsForPlaceholders = function () {
              var u = this._getRectsForPlaceholders();
              return c(u);
            };
            e.TypefaceFontProvider.prototype.registerFont = function (u, G) {
              u = e.Typeface.MakeFreeTypeFaceFromData(u);
              if (!u) return null;
              G = r(G);
              this._registerFont(u, G);
            };
            e.ParagraphStyle = function (u) {
              u.disableHinting = u.disableHinting || !1;
              if (u.ellipsis) {
                var G = u.ellipsis;
                u._ellipsisPtr = r(G);
                u._ellipsisLen = oa(G) + 1;
              } else u._ellipsisPtr = V, u._ellipsisLen = 0;
              u.heightMultiplier = u.heightMultiplier || 0;
              u.maxLines = u.maxLines || 0;
              G = (G = u.strutStyle) || {};
              G.strutEnabled = G.strutEnabled || !1;
              G.strutEnabled && Array.isArray(G.fontFamilies) &&
                G.fontFamilies.length
                ? (G._fontFamiliesPtr = l(G.fontFamilies),
                  G._fontFamiliesLen = G.fontFamilies.length)
                : (G._fontFamiliesPtr = V, G._fontFamiliesLen = 0);
              G.fontStyle = g(G.fontStyle);
              G.fontSize = G.fontSize || 0;
              G.heightMultiplier = G.heightMultiplier || 0;
              G.halfLeading = G.halfLeading || !1;
              G.leading = G.leading || 0;
              G.forceStrutHeight = G.forceStrutHeight || !1;
              u.strutStyle = G;
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
            var J = {}, P = e._malloc(16), O = e._malloc(16), W = e._malloc(16);
            e.ParagraphBuilder.Make = function (u, G) {
              y(u.textStyle);
              G = e.ParagraphBuilder._Make(u, G);
              C(u.textStyle);
              return G;
            };
            e.ParagraphBuilder.MakeFromFontProvider = function (u, G) {
              y(u.textStyle);
              G = e.ParagraphBuilder._MakeFromFontProvider(u, G);
              C(u.textStyle);
              return G;
            };
            e.ParagraphBuilder.ShapeText = function (u, G, R) {
              let aa = 0;
              for (const ka of G) aa += ka.length;
              if (aa !== u.length) {
                throw "Accumulated block lengths must equal text.length";
              }
              return e.ParagraphBuilder._ShapeText(u, G, R);
            };
            e.ParagraphBuilder.prototype.pushStyle = function (u) {
              y(u);
              this._pushStyle(u);
              C(u);
            };
            e.ParagraphBuilder.prototype.pushPaintStyle = function (u, G, R) {
              y(u);
              this._pushPaintStyle(u, G, R);
              C(u);
            };
            e.ParagraphBuilder.prototype.addPlaceholder = function (
              u,
              G,
              R,
              aa,
              ka,
            ) {
              R = R || e.PlaceholderAlignment.Baseline;
              aa = aa || e.TextBaseline.Alphabetic;
              this._addPlaceholder(u || 0, G || 0, R, aa, ka || 0);
            };
          });
        })(v);
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.Path.prototype.op = function (e, c) {
            return this._op(e, c) ? this : null;
          };
          a.Path.prototype.simplify = function () {
            return this._simplify() ? this : null;
          };
        });
        a.Vd = a.Vd || [];
        a.Vd.push(function () {
          a.Canvas.prototype.drawText = function (e, c, g, l, r) {
            var y = oa(e),
              C = a._malloc(
                y +
                  1,
              );
            ra(e, K, C, y + 1);
            this._drawSimpleText(C, y, c, g, r, l);
            a._free(C);
          };
          a.Canvas.prototype.drawGlyphs = function (e, c, g, l, r, y) {
            if (!(2 * e.length <= c.length)) {
              throw "Not enough positions for the array of gyphs";
            }
            a.Od(this.Md);
            const C = x(e, "HEAPU16"), J = x(c, "HEAPF32");
            this._drawGlyphs(e.length, C, J, g, l, r, y);
            q(J, c);
            q(C, e);
          };
          a.Font.prototype.getGlyphBounds = function (e, c, g) {
            var l = x(e, "HEAPU16"), r = a._malloc(16 * e.length);
            this._getGlyphWidthBounds(l, e.length, V, r, c || null);
            c = new Float32Array(a.HEAPU8.buffer, r, 4 * e.length);
            q(l, e);
            if (g) return g.set(c), a._free(r), g;
            e = Float32Array.from(c);
            a._free(r);
            return e;
          };
          a.Font.prototype.getGlyphIDs = function (e, c, g) {
            c || (c = e.length);
            var l = oa(e) + 1, r = a._malloc(l);
            ra(e, K, r, l);
            e = a._malloc(2 * c);
            c = this._getGlyphIDs(r, l - 1, c, e);
            a._free(r);
            if (0 > c) return a._free(e), null;
            r = new Uint16Array(a.HEAPU8.buffer, e, c);
            if (g) return g.set(r), a._free(e), g;
            g = Uint16Array.from(r);
            a._free(e);
            return g;
          };
          a.Font.prototype.getGlyphIntercepts = function (e, c, g, l) {
            var r = x(e, "HEAPU16"), y = x(c, "HEAPF32");
            return this._getGlyphIntercepts(
              r,
              e.length,
              !(e && e._ck),
              y,
              c.length,
              !(c && c._ck),
              g,
              l,
            );
          };
          a.Font.prototype.getGlyphWidths = function (e, c, g) {
            var l = x(e, "HEAPU16"), r = a._malloc(4 * e.length);
            this._getGlyphWidthBounds(l, e.length, r, V, c || null);
            c = new Float32Array(a.HEAPU8.buffer, r, e.length);
            q(l, e);
            if (g) return g.set(c), a._free(r), g;
            e = Float32Array.from(c);
            a._free(r);
            return e;
          };
          a.FontMgr.FromData = function () {
            if (!arguments.length) return null;
            var e = arguments;
            1 === e.length && Array.isArray(e[0]) && (e = arguments[0]);
            if (!e.length) return null;
            for (var c = [], g = [], l = 0; l < e.length; l++) {
              var r = new Uint8Array(e[l]), y = x(r, "HEAPU8");
              c.push(y);
              g.push(r.byteLength);
            }
            c = x(c, "HEAPU32");
            g = x(g, "HEAPU32");
            e = a.FontMgr._fromData(c, g, e.length);
            a._free(c);
            a._free(g);
            return e;
          };
          a.Typeface.MakeFreeTypeFaceFromData = function (e) {
            e = new Uint8Array(e);
            var c = x(e, "HEAPU8");
            return (e = a.Typeface._MakeFreeTypeFaceFromData(c, e.byteLength))
              ? e
              : null;
          };
          a.Typeface.prototype.getGlyphIDs = function (e, c, g) {
            c || (c = e.length);
            var l = oa(e) + 1, r = a._malloc(l);
            ra(e, K, r, l);
            e = a._malloc(2 * c);
            c = this._getGlyphIDs(r, l - 1, c, e);
            a._free(r);
            if (0 > c) return a._free(e), null;
            r = new Uint16Array(a.HEAPU8.buffer, e, c);
            if (g) return g.set(r), a._free(e), g;
            g = Uint16Array.from(r);
            a._free(e);
            return g;
          };
          a.TextBlob.MakeOnPath = function (e, c, g, l) {
            if (e && e.length && c && c.countPoints()) {
              if (1 === c.countPoints()) return this.MakeFromText(e, g);
              l || (l = 0);
              var r = g.getGlyphIDs(e);
              r = g.getGlyphWidths(r);
              var y = [];
              c = new a.ContourMeasureIter(c, !1, 1);
              for (
                var C = c.next(), J = new Float32Array(4), P = 0;
                P < e.length && C;
                P++
              ) {
                var O = r[P];
                l += O / 2;
                if (l > C.length()) {
                  C.delete();
                  C = c.next();
                  if (!C) {
                    e = e.substring(0, P);
                    break;
                  }
                  l = O / 2;
                }
                C.getPosTan(l, J);
                var W = J[2], u = J[3];
                y.push(W, u, J[0] - O / 2 * W, J[1] - O / 2 * u);
                l += O / 2;
              }
              e = this.MakeFromRSXform(e, y, g);
              C && C.delete();
              c.delete();
              return e;
            }
          };
          a.TextBlob.MakeFromRSXform = function (e, c, g) {
            var l = oa(e) + 1, r = a._malloc(l);
            ra(e, K, r, l);
            e = x(c, "HEAPF32");
            g = a.TextBlob._MakeFromRSXform(r, l - 1, e, g);
            a._free(r);
            return g ? g : null;
          };
          a.TextBlob.MakeFromRSXformGlyphs = function (e, c, g) {
            var l = x(e, "HEAPU16");
            c = x(c, "HEAPF32");
            g = a.TextBlob._MakeFromRSXformGlyphs(l, 2 * e.length, c, g);
            q(l, e);
            return g ? g : null;
          };
          a.TextBlob.MakeFromGlyphs = function (e, c) {
            var g = x(e, "HEAPU16");
            c = a.TextBlob._MakeFromGlyphs(g, 2 * e.length, c);
            q(g, e);
            return c ? c : null;
          };
          a.TextBlob.MakeFromText = function (e, c) {
            var g = oa(e) + 1, l = a._malloc(g);
            ra(e, K, l, g);
            e = a.TextBlob._MakeFromText(l, g - 1, c);
            a._free(l);
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
            var c = a._malloc(e.byteLength);
            a.HEAPU8.set(e, c);
            return (e = a._MakePicture(c, e.byteLength)) ? e : null;
          };
        });
        (function () {
          function e(H) {
            for (var k = 0; k < H.length; k++) {
              if (void 0 !== H[k] && !Number.isFinite(H[k])) return !1;
            }
            return !0;
          }
          function c(H) {
            var k = a.getColorComponents(H);
            H = k[0];
            var p = k[1], A = k[2];
            k = k[3];
            if (1 === k) {
              return H = H.toString(16).toLowerCase(),
                p = p.toString(16).toLowerCase(),
                A = A.toString(16).toLowerCase(),
                H = 1 === H.length ? "0" + H : H,
                p = 1 === p.length ? "0" + p : p,
                A = 1 === A.length ? "0" + A : A,
                "#" + H + p + A;
            }
            k = 0 === k || 1 === k ? k : k.toFixed(8);
            return "rgba(" + H + ", " + p + ", " + A + ", " + k + ")";
          }
          function g(H) {
            return a.parseColorString(H, ua);
          }
          function l(H) {
            H = Aa.exec(H);
            if (!H) return null;
            var k = parseFloat(H[4]), p = 16;
            switch (H[5]) {
              case "em":
              case "rem":
                p = 16 * k;
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
              style: H[1],
              variant: H[2],
              weight: H[3],
              sizePx: p,
              family: H[6].trim(),
            };
          }
          function r(H) {
            this.Nd = H;
            this.Qd = new a.Paint();
            this.Qd.setAntiAlias(!0);
            this.Qd.setStrokeMiter(10);
            this.Qd.setStrokeCap(a.StrokeCap.Butt);
            this.Qd.setStrokeJoin(a.StrokeJoin.Miter);
            this.Qe = "10px monospace";
            this.ne = new a.Font(null, 10);
            this.ne.setSubpixel(!0);
            this.be = this.he = a.BLACK;
            this.we = 0;
            this.Je = a.TRANSPARENT;
            this.ye = this.xe = 0;
            this.Ke = this.ke = 1;
            this.Ie = 0;
            this.ve = [];
            this.Pd = a.BlendMode.SrcOver;
            this.Qd.setStrokeWidth(this.Ke);
            this.Qd.setBlendMode(this.Pd);
            this.Sd = new a.Path();
            this.Ud = a.Matrix.identity();
            this.lf = [];
            this.Ce = [];
            this.me = function () {
              this.Sd.delete();
              this.Qd.delete();
              this.ne.delete();
              this.Ce.forEach(function (k) {
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
                return f(this.be) ? c(this.be) : this.be;
              },
              set: function (k) {
                k = maybeHSL(k);
                "string" === typeof k ? this.be = g(k) : k.ue && (this.be = k);
              },
            });
            Object.defineProperty(this, "font", {
              enumerable: !0,
              get: function () {
                return this.Qe;
              },
              set: function (k) {
                var p = l(k), A = p.family;
                p.typeface = fa[A]
                  ? fa[A][
                    (p.style || "normal") + "|" + (p.variant || "normal") +
                    "|" + (p.weight || "normal")
                  ] || fa[A]["*"]
                  : null;
                p &&
                  (this.ne.setSize(p.sizePx),
                    this.ne.setTypeface(p.typeface),
                    this.Qe = k);
              },
            });
            Object.defineProperty(this, "globalAlpha", {
              enumerable: !0,
              get: function () {
                return this.ke;
              },
              set: function (k) {
                !isFinite(k) || 0 > k || 1 < k || (this.ke = k);
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
                return this.Ie;
              },
              set: function (k) {
                isFinite(k) && (this.Ie = k);
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
                0 >= k || !k || (this.Ke = k, this.Qd.setStrokeWidth(k));
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
                return this.we;
              },
              set: function (k) {
                0 > k || !isFinite(k) || (this.we = k);
              },
            });
            Object.defineProperty(this, "shadowColor", {
              enumerable: !0,
              get: function () {
                return c(this.Je);
              },
              set: function (k) {
                this.Je = g(maybeHSL(k));
              },
            });
            Object.defineProperty(this, "shadowOffsetX", {
              enumerable: !0,
              get: function () {
                return this.xe;
              },
              set: function (k) {
                isFinite(k) && (this.xe = k);
              },
            });
            Object.defineProperty(this, "shadowOffsetY", {
              enumerable: !0,
              get: function () {
                return this.ye;
              },
              set: function (k) {
                isFinite(k) && (this.ye = k);
              },
            });
            Object.defineProperty(this, "strokeStyle", {
              enumerable: !0,
              get: function () {
                return c(this.he);
              },
              set: function (k) {
                "string" === typeof k
                  ? this.he = g(maybeHSL(k))
                  : k.ue && (this.he = k);
              },
            });
            this.arc = function (k, p, A, B, E, F) {
              G(this.Sd, k, p, A, A, 0, B, E, F);
            };
            this.arcTo = function (k, p, A, B, E) {
              O(this.Sd, k, p, A, B, E);
            };
            this.beginPath = function () {
              this.Sd.delete();
              this.Sd = new a.Path();
            };
            this.bezierCurveTo = function (k, p, A, B, E, F) {
              var L = this.Sd;
              e([k, p, A, B, E, F]) &&
                (L.isEmpty() && L.moveTo(k, p), L.cubicTo(k, p, A, B, E, F));
            };
            this.clearRect = function (k, p, A, B) {
              this.Qd.setStyle(a.PaintStyle.Fill);
              this.Qd.setBlendMode(a.BlendMode.Clear);
              this.Nd.drawRect(a.XYWHRect(k, p, A, B), this.Qd);
              this.Qd.setBlendMode(this.Pd);
            };
            this.clip = function (k, p) {
              "string" === typeof k
                ? (p = k, k = this.Sd)
                : k && k.Ze && (k = k.Wd);
              k || (k = this.Sd);
              k = k.copy();
              p && "evenodd" === p.toLowerCase()
                ? k.setFillType(a.FillType.EvenOdd)
                : k.setFillType(a.FillType.Winding);
              this.Nd.clipPath(k, a.ClipOp.Intersect, !0);
              k.delete();
            };
            this.closePath = function () {
              W(this.Sd);
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
            this.createLinearGradient = function (k, p, A, B) {
              if (e(arguments)) {
                var E = new P(k, p, A, B);
                this.Ce.push(E);
                return E;
              }
            };
            this.createPattern = function (k, p) {
              k = new ka(k, p);
              this.Ce.push(k);
              return k;
            };
            this.createRadialGradient = function (k, p, A, B, E, F) {
              if (e(arguments)) {
                var L = new qa(k, p, A, B, E, F);
                this.Ce.push(L);
                return L;
              }
            };
            this.drawImage = function (k) {
              k instanceof C && (k = k.sf());
              if (k instanceof y) {
                k = a.MakeImage(
                  {
                    width: k.bf.Df,
                    height: k.bf.zf,
                    alphaType: a.AlphaType.Unpremul,
                    colorType: a.ColorType.RGBA_8888,
                    colorSpace: a.ColorSpace.SRGB,
                  },
                  k.getRawBuffer(0, 0, k.bf.Df, k.bf.zf),
                  4 * k.bf.Df,
                );
              }
              var p = this.Pe();
              if (3 === arguments.length || 5 === arguments.length) {
                var A = a.XYWHRect(
                    arguments[1],
                    arguments[2],
                    arguments[3] || k.width(),
                    arguments[4] || k.height(),
                  ),
                  B = a.XYWHRect(0, 0, k.width(), k.height());
              } else if (9 === arguments.length) {
                A = a.XYWHRect(
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
              this.Nd.drawImageRect(k, B, A, p, !1);
              p.dispose();
            };
            this.ellipse = function (k, p, A, B, E, F, L, ba) {
              G(this.Sd, k, p, A, B, E, F, L, ba);
            };
            this.Pe = function () {
              var k = this.Qd.copy();
              k.setStyle(a.PaintStyle.Fill);
              if (f(this.be)) {
                var p = a.multiplyByAlpha(this.be, this.ke);
                k.setColor(p);
              } else {
                p = this.be.ue(this.Ud),
                  k.setColor(a.Color(0, 0, 0, this.ke)),
                  k.setShader(p);
              }
              k.dispose = function () {
                this.delete();
              };
              return k;
            };
            this.fill = function (k, p) {
              "string" === typeof k
                ? (p = k, k = this.Sd)
                : k && k.Ze && (k = k.Wd);
              if ("evenodd" === p) this.Sd.setFillType(a.FillType.EvenOdd);
              else {
                if ("nonzero" !== p && p) throw "invalid fill rule";
                this.Sd.setFillType(a.FillType.Winding);
              }
              k || (k = this.Sd);
              p = this.Pe();
              var A = this.ze(p);
              A &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawPath(k, A),
                  this.Nd.restore(),
                  A.dispose());
              this.Nd.drawPath(k, p);
              p.dispose();
            };
            this.fillRect = function (k, p, A, B) {
              var E = this.Pe(), F = this.ze(E);
              F &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawRect(a.XYWHRect(k, p, A, B), F),
                  this.Nd.restore(),
                  F.dispose());
              this.Nd.drawRect(a.XYWHRect(k, p, A, B), E);
              E.dispose();
            };
            this.fillText = function (k, p, A) {
              var B = this.Pe();
              k = a.TextBlob.MakeFromText(k, this.ne);
              var E = this.ze(B);
              E &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawTextBlob(k, p, A, E),
                  this.Nd.restore(),
                  E.dispose());
              this.Nd.drawTextBlob(k, p, A, B);
              k.delete();
              B.dispose();
            };
            this.getImageData = function (k, p, A, B) {
              return (k = this.Nd.readPixels(k, p, {
                  width: A,
                  height: B,
                  colorType: a.ColorType.RGBA_8888,
                  alphaType: a.AlphaType.Unpremul,
                  colorSpace: a.ColorSpace.SRGB,
                }))
                ? new J(new Uint8ClampedArray(k.buffer), A, B)
                : null;
            };
            this.getLineDash = function () {
              return this.ve.slice();
            };
            this.mf = function (k) {
              var p = a.Matrix.invert(this.Ud);
              a.Matrix.mapPoints(p, k);
              return k;
            };
            this.isPointInPath = function (k, p, A) {
              var B = arguments;
              if (3 === B.length) var E = this.Sd;
              else if (4 === B.length) E = B[0], k = B[1], p = B[2], A = B[3];
              else throw "invalid arg count, need 3 or 4, got " + B.length;
              if (!isFinite(k) || !isFinite(p)) return !1;
              A = A || "nonzero";
              if ("nonzero" !== A && "evenodd" !== A) return !1;
              B = this.mf([k, p]);
              k = B[0];
              p = B[1];
              E.setFillType(
                "nonzero" ===
                    A
                  ? a.FillType.Winding
                  : a.FillType.EvenOdd,
              );
              return E.contains(k, p);
            };
            this.isPointInStroke = function (k, p) {
              var A = arguments;
              if (2 === A.length) var B = this.Sd;
              else if (3 === A.length) B = A[0], k = A[1], p = A[2];
              else throw "invalid arg count, need 2 or 3, got " + A.length;
              if (!isFinite(k) || !isFinite(p)) return !1;
              A = this.mf([k, p]);
              k = A[0];
              p = A[1];
              B = B.copy();
              B.setFillType(a.FillType.Winding);
              B.stroke({
                width: this.lineWidth,
                miter_limit: this.miterLimit,
                cap: this.Qd.getStrokeCap(),
                join: this.Qd.getStrokeJoin(),
                precision: .3,
              });
              A = B.contains(k, p);
              B.delete();
              return A;
            };
            this.lineTo = function (k, p) {
              R(this.Sd, k, p);
            };
            this.measureText = function (k) {
              k = this.ne.getGlyphIDs(k);
              k = this.ne.getGlyphWidths(k);
              let p = 0;
              for (const A of k) p += A;
              return { width: p };
            };
            this.moveTo = function (k, p) {
              var A = this.Sd;
              e([k, p]) && A.moveTo(k, p);
            };
            this.putImageData = function (k, p, A, B, E, F, L) {
              if (e([p, A, B, E, F, L])) {
                if (void 0 === B) {
                  this.Nd.writePixels(k.data, k.width, k.height, p, A);
                } else if (
                  B = B || 0,
                    E = E || 0,
                    F = F || k.width,
                    L = L || k.height,
                    0 > F && (B += F, F = Math.abs(F)),
                    0 > L && (E += L, L = Math.abs(L)),
                    0 > B && (F += B, B = 0),
                    0 > E && (L += E, E = 0),
                    !(0 >= F || 0 >= L)
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
                  var ba = a.XYWHRect(B, E, F, L);
                  p = a.XYWHRect(p + B, A + E, F, L);
                  A = a.Matrix.invert(this.Ud);
                  this.Nd.save();
                  this.Nd.concat(A);
                  this.Nd.drawImageRect(k, ba, p, null, !1);
                  this.Nd.restore();
                  k.delete();
                }
              }
            };
            this.quadraticCurveTo = function (k, p, A, B) {
              var E = this.Sd;
              e([k, p, A, B]) &&
                (E.isEmpty() && E.moveTo(k, p), E.quadTo(k, p, A, B));
            };
            this.rect = function (k, p, A, B) {
              var E = this.Sd;
              k = a.XYWHRect(k, p, A, B);
              e(k) && E.addRect(k);
            };
            this.resetTransform = function () {
              this.Sd.transform(this.Ud);
              var k = a.Matrix.invert(this.Ud);
              this.Nd.concat(k);
              this.Ud = this.Nd.getTotalMatrix();
            };
            this.restore = function () {
              var k = this.lf.pop();
              if (k) {
                var p = a.Matrix.multiply(this.Ud, a.Matrix.invert(k.Ff));
                this.Sd.transform(p);
                this.Qd.delete();
                this.Qd = k.$f;
                this.ve = k.Yf;
                this.Ke = k.mg;
                this.he = k.lg;
                this.be = k.fs;
                this.xe = k.jg;
                this.ye = k.kg;
                this.we = k.dg;
                this.Je = k.ig;
                this.ke = k.Mf;
                this.Pd = k.Nf;
                this.Ie = k.Zf;
                this.Qe = k.Lf;
                this.Nd.restore();
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.rotate = function (k) {
              if (isFinite(k)) {
                var p = a.Matrix.rotated(-k);
                this.Sd.transform(p);
                this.Nd.rotate(k / Math.PI * 180, 0, 0);
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.save = function () {
              if (this.be.te) {
                var k = this.be.te();
                this.Ce.push(k);
              } else k = this.be;
              if (this.he.te) {
                var p = this.he.te();
                this.Ce.push(p);
              } else p = this.he;
              this.lf.push({
                Ff: this.Ud.slice(),
                Yf: this.ve.slice(),
                mg: this.Ke,
                lg: p,
                fs: k,
                jg: this.xe,
                kg: this.ye,
                dg: this.we,
                ig: this.Je,
                Mf: this.ke,
                Zf: this.Ie,
                Nf: this.Pd,
                $f: this.Qd.copy(),
                Lf: this.Qe,
              });
              this.Nd.save();
            };
            this.scale = function (k, p) {
              if (e(arguments)) {
                var A = a.Matrix.scaled(1 / k, 1 / p);
                this.Sd.transform(A);
                this.Nd.scale(k, p);
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.setLineDash = function (k) {
              for (var p = 0; p < k.length; p++) {
                if (!isFinite(k[p]) || 0 > k[p]) return;
              }
              1 === k.length % 2 && Array.prototype.push.apply(k, k);
              this.ve = k;
            };
            this.setTransform = function (k, p, A, B, E, F) {
              e(arguments) &&
                (this.resetTransform(), this.transform(k, p, A, B, E, F));
            };
            this.se = function () {
              var k = a.Matrix.invert(this.Ud);
              this.Nd.concat(k);
              this.Nd.concat(a.Matrix.translated(this.xe, this.ye));
              this.Nd.concat(this.Ud);
            };
            this.ze = function (k) {
              var p = a.multiplyByAlpha(this.Je, this.ke);
              if (
                !a.getColorComponents(p)[3] || !(this.we || this.ye || this.xe)
              ) {
                return null;
              }
              k = k.copy();
              k.setColor(p);
              var A = a.MaskFilter.MakeBlur(
                a.BlurStyle.Normal,
                this.we / 2,
                !1,
              );
              k.setMaskFilter(A);
              k.dispose = function () {
                A.delete();
                this.delete();
              };
              return k;
            };
            this.af = function () {
              var k = this.Qd.copy();
              k.setStyle(a.PaintStyle.Stroke);
              if (f(this.he)) {
                var p = a.multiplyByAlpha(this.he, this.ke);
                k.setColor(p);
              } else {
                p = this.he.ue(this.Ud),
                  k.setColor(a.Color(0, 0, 0, this.ke)),
                  k.setShader(p);
              }
              k.setStrokeWidth(this.Ke);
              if (this.ve.length) {
                var A = a.PathEffect.MakeDash(this.ve, this.Ie);
                k.setPathEffect(A);
              }
              k.dispose = function () {
                A && A.delete();
                this.delete();
              };
              return k;
            };
            this.stroke = function (k) {
              k = k ? k.Wd : this.Sd;
              var p = this.af(), A = this.ze(p);
              A &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawPath(k, A),
                  this.Nd.restore(),
                  A.dispose());
              this.Nd.drawPath(k, p);
              p.dispose();
            };
            this.strokeRect = function (k, p, A, B) {
              var E = this.af(),
                F = this.ze(E);
              F &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawRect(a.XYWHRect(k, p, A, B), F),
                  this.Nd.restore(),
                  F.dispose());
              this.Nd.drawRect(a.XYWHRect(k, p, A, B), E);
              E.dispose();
            };
            this.strokeText = function (k, p, A) {
              var B = this.af();
              k = a.TextBlob.MakeFromText(k, this.ne);
              var E = this.ze(B);
              E &&
                (this.Nd.save(),
                  this.se(),
                  this.Nd.drawTextBlob(k, p, A, E),
                  this.Nd.restore(),
                  E.dispose());
              this.Nd.drawTextBlob(k, p, A, B);
              k.delete();
              B.dispose();
            };
            this.translate = function (k, p) {
              if (e(arguments)) {
                var A = a.Matrix.translated(-k, -p);
                this.Sd.transform(A);
                this.Nd.translate(k, p);
                this.Ud = this.Nd.getTotalMatrix();
              }
            };
            this.transform = function (k, p, A, B, E, F) {
              k = [k, A, E, p, B, F, 0, 0, 1];
              p = a.Matrix.invert(k);
              this.Sd.transform(p);
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
          function y(H) {
            this.bf = H;
            this.Md = new r(H.getCanvas());
            this.Re = [];
            this.decodeImage = function (k) {
              k = a.MakeImageFromEncoded(k);
              if (!k) throw "Invalid input";
              this.Re.push(k);
              return new C(k);
            };
            this.loadFont = function (k, p) {
              k = a.Typeface.MakeFreeTypeFaceFromData(k);
              if (!k) return null;
              this.Re.push(k);
              var A = (p.style || "normal") + "|" + (p.variant || "normal") +
                "|" + (p.weight || "normal");
              p = p.family;
              fa[p] || (fa[p] = { "*": k });
              fa[p][A] = k;
            };
            this.makePath2D = function (k) {
              k = new aa(k);
              this.Re.push(k.Wd);
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
              return this.bf.getCanvas().readPixels(k || 0, n || 0, {
                width: y || this.width,
                height: B || this.height,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
                raw: true,
              });
            };
            this.toDataURL = function (k, p) {
              this.bf.flush();
              var A = this.bf.makeImageSnapshot();
              if (A) {
                k = k || "image/png";
                var B = a.ImageFormat.PNG;
                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                if (p = A.encodeToBytes(B, p || .92)) {
                  A.delete();
                  k = "data:" + k + ";base64,";
                  p = encodeBase64(p);
                  return k + p;
                }
              }
            };
            this.toBuffer = function (k, p) {
              this.bf.flush();
              var z = this.bf.makeImageSnapshot();
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
              this.Re.forEach(function (k) {
                k.delete();
              });
              this.bf.dispose();
            };
          }
          function C(H) {
            this.width = H.width();
            this.height = H.height();
            this.naturalWidth = this.width;
            this.naturalHeight = this.height;
            this.sf = function () {
              return H;
            };
          }
          function J(H, k, p) {
            if (!k || 0 === p) {
              throw "invalid dimensions, width and height must be non-zero";
            }
            if (H.length % 4) throw "arr must be a multiple of 4";
            p = p || H.length / (4 * k);
            Object.defineProperty(this, "data", { value: H, writable: !1 });
            Object.defineProperty(this, "height", { value: p, writable: !1 });
            Object.defineProperty(this, "width", { value: k, writable: !1 });
          }
          function P(H, k, p, A) {
            this.Yd = null;
            this.de = [];
            this.ae = [];
            this.addColorStop = function (B, E) {
              if (0 > B || 1 < B || !isFinite(B)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              E = g(E);
              var F = this.ae.indexOf(B);
              if (-1 !== F) this.de[F] = E;
              else {
                for (F = 0; F < this.ae.length && !(this.ae[F] > B); F++);
                this.ae.splice(F, 0, B);
                this.de.splice(F, 0, E);
              }
            };
            this.te = function () {
              var B = new P(H, k, p, A);
              B.de = this.de.slice();
              B.ae = this.ae.slice();
              return B;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.ue = function (B) {
              var E = [H, k, p, A];
              a.Matrix.mapPoints(B, E);
              B = E[0];
              var F = E[1],
                L = E[2];
              E = E[3];
              this.me();
              return this.Yd = a.Shader.MakeLinearGradient(
                [B, F],
                [L, E],
                this.de,
                this.ae,
                a.TileMode.Clamp,
              );
            };
          }
          function O(H, k, p, A, B, E) {
            if (e([k, p, A, B, E])) {
              if (0 > E) throw "radii cannot be negative";
              H.isEmpty() && H.moveTo(k, p);
              H.arcToTangent(k, p, A, B, E);
            }
          }
          function W(H) {
            if (!H.isEmpty()) {
              var k = H.getBounds();
              (k[3] - k[1] || k[2] - k[0]) && H.close();
            }
          }
          function u(H, k, p, A, B, E, F) {
            F = (F - E) / Math.PI * 180;
            E = E / Math.PI * 180;
            k = a.LTRBRect(k - A, p - B, k + A, p + B);
            1E-5 > Math.abs(Math.abs(F) - 360)
              ? (p = F / 2,
                H.arcToOval(k, E, p, !1),
                H.arcToOval(k, E + p, p, !1))
              : H.arcToOval(k, E, F, !1);
          }
          function G(H, k, p, A, B, E, F, L, ba) {
            if (e([k, p, A, B, E, F, L])) {
              if (0 > A || 0 > B) throw "radii cannot be negative";
              var ca = 2 * Math.PI, Ia = F % ca;
              0 > Ia && (Ia += ca);
              var bb = Ia - F;
              F = Ia;
              L += bb;
              !ba && L - F >= ca
                ? L = F + ca
                : ba && F - L >= ca
                ? L = F - ca
                : !ba && F > L
                ? L = F + (ca - (F - L) % ca)
                : ba && F < L && (L = F - (ca - (L - F) % ca));
              E
                ? (ba = a.Matrix.rotated(E, k, p),
                  E = a.Matrix.rotated(-E, k, p),
                  H.transform(E),
                  u(H, k, p, A, B, F, L),
                  H.transform(ba))
                : u(H, k, p, A, B, F, L);
            }
          }
          function R(H, k, p) {
            e([k, p]) && (H.isEmpty() && H.moveTo(k, p), H.lineTo(k, p));
          }
          function aa(H) {
            this.Wd = null;
            this.Wd = "string" === typeof H
              ? a.Path.MakeFromSVGString(H)
              : H && H.Ze
              ? H.Wd.copy()
              : new a.Path();
            this.Ze = function () {
              return this.Wd;
            };
            this.addPath = function (k, p) {
              p || (p = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
              this.Wd.addPath(k.Wd, [p.a, p.c, p.e, p.b, p.d, p.f]);
            };
            this.arc = function (k, p, A, B, E, F) {
              G(this.Wd, k, p, A, A, 0, B, E, F);
            };
            this.arcTo = function (k, p, A, B, E) {
              O(this.Wd, k, p, A, B, E);
            };
            this.bezierCurveTo = function (k, p, A, B, E, F) {
              var L = this.Wd;
              e([k, p, A, B, E, F]) &&
                (L.isEmpty() && L.moveTo(k, p), L.cubicTo(k, p, A, B, E, F));
            };
            this.closePath = function () {
              W(this.Wd);
            };
            this.ellipse = function (k, p, A, B, E, F, L, ba) {
              G(this.Wd, k, p, A, B, E, F, L, ba);
            };
            this.lineTo = function (k, p) {
              R(this.Wd, k, p);
            };
            this.moveTo = function (k, p) {
              var A = this.Wd;
              e([k, p]) && A.moveTo(k, p);
            };
            this.quadraticCurveTo = function (k, p, A, B) {
              var E = this.Wd;
              e([k, p, A, B]) &&
                (E.isEmpty() && E.moveTo(k, p), E.quadTo(k, p, A, B));
            };
            this.rect = function (k, p, A, B) {
              var E = this.Wd;
              k = a.XYWHRect(k, p, A, B);
              e(k) && E.addRect(k);
            };
          }
          function ka(H, k) {
            this.Yd = null;
            H instanceof C && (H = H.sf());
            this.Af = H;
            this._transform = a.Matrix.identity();
            "" === k && (k = "repeat");
            switch (k) {
              case "repeat-x":
                this.Ae = a.TileMode.Repeat;
                this.Be = a.TileMode.Decal;
                break;
              case "repeat-y":
                this.Ae = a.TileMode.Decal;
                this.Be = a.TileMode.Repeat;
                break;
              case "repeat":
                this.Be = this.Ae = a.TileMode.Repeat;
                break;
              case "no-repeat":
                this.Be = this.Ae = a.TileMode.Decal;
                break;
              default:
                throw "invalid repetition mode " + k;
            }
            this.setTransform = function (p) {
              p = [p.a, p.c, p.e, p.b, p.d, p.f, 0, 0, 1];
              e(p) && (this._transform = p);
            };
            this.te = function () {
              var p = new ka();
              p.Ae = this.Ae;
              p.Be = this.Be;
              return p;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.ue = function () {
              this.me();
              return this.Yd = this.Af.makeShaderCubic(
                this.Ae,
                this.Be,
                1 / 3,
                1 / 3,
                this._transform,
              );
            };
          }
          function qa(H, k, p, A, B, E) {
            this.Yd = null;
            this.de = [];
            this.ae = [];
            this.addColorStop = function (F, L) {
              if (0 > F || 1 < F || !isFinite(F)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              L = g(L);
              var ba = this.ae.indexOf(F);
              if (-1 !== ba) this.de[ba] = L;
              else {
                for (ba = 0; ba < this.ae.length && !(this.ae[ba] > F); ba++);
                this.ae.splice(ba, 0, F);
                this.de.splice(ba, 0, L);
              }
            };
            this.te = function () {
              var F = new qa(H, k, p, A, B, E);
              F.de = this.de.slice();
              F.ae = this.ae.slice();
              return F;
            };
            this.me = function () {
              this.Yd && (this.Yd.delete(), this.Yd = null);
            };
            this.ue = function (F) {
              var L = [H, k, A, B];
              a.Matrix.mapPoints(F, L);
              var ba = L[0], ca = L[1], Ia = L[2];
              L = L[3];
              var bb = (Math.abs(F[0]) + Math.abs(F[4])) / 2;
              F = p * bb;
              bb *= E;
              this.me();
              return this.Yd = a.Shader.MakeTwoPointConicalGradient(
                [ba, ca],
                F,
                [Ia, L],
                bb,
                this.de,
                this.ae,
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
          a._testing.colorToString = c;
          var Aa = RegExp(
              "(italic|oblique|normal|)\\s*(small-caps|normal|)\\s*(bold|bolder|lighter|[1-9]00|normal|)\\s*([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)",
            ),
            fa = { "Noto Mono": { "*": null }, monospace: { "*": null } };
          a._testing.parseFontString = l;
          a.MakeCanvas = function (H, k) {
            return (H = a.MakeSurface(H, k)) ? new y(H) : null;
          };
          a.ImageData = function () {
            if (2 === arguments.length) {
              var H = arguments[0], k = arguments[1];
              return new J(new Uint8ClampedArray(4 * H * k), H, k);
            }
            if (3 === arguments.length) {
              var p = arguments[0];
              if (p.prototype.constructor !== Uint8ClampedArray) {
                throw "bytes must be given as a Uint8ClampedArray";
              }
              H = arguments[1];
              k = arguments[2];
              if (p % 4) throw "bytes must be given in a multiple of 4";
              if (p % H) throw "bytes must divide evenly by width";
              if (k && k !== p / (4 * H)) throw "invalid height given";
              return new J(p, H, p / (4 * H));
            }
            throw "invalid number of arguments - takes 2 or 3, saw " +
              arguments.length;
          };
        })();
      })(v);
      var sa = Object.assign({}, v),
        va = "./this.program",
        wa = (a, b) => {
          throw b;
        },
        xa = "object" == typeof window,
        ya = "function" == typeof importScripts,
        za = "object" == typeof process &&
          "object" == typeof process.versions &&
          "string" == typeof process.versions.node,
        Ba = "",
        Ca,
        Da,
        Ea,
        fs,
        Fa,
        Ga;
      if (za) {
        Ba = ya ? require("path").dirname(Ba) + "/" : __dirname + "/",
          Ga = () => {
            Fa || (fs = require("fs"), Fa = require("path"));
          },
          Ca = function (a, b) {
            Ga();
            a = Fa.normalize(a);
            return fs.readFileSync(a, b ? void 0 : "utf8");
          },
          Ea = (a) => {
            a = Ca(a, !0);
            a.buffer || (a = new Uint8Array(a));
            return a;
          },
          Da = (a, b, d) => {
            Ga();
            a = Fa.normalize(a);
            fs.readFile(a, function (f, h) {
              f ? d(f) : b(h.buffer);
            });
          },
          1 < process.argv.length && (va = process.argv[1].replace(/\\/g, "/")),
          process.argv.slice(2),
          process.on("unhandledRejection", function (a) {
            throw a;
          }),
          wa = (a, b) => {
            if (noExitRuntime) throw process.exitCode = a, b;
            b instanceof Ja || Ka("exiting due to exception: " + b);
            process.exit(a);
          },
          v.inspect = function () {
            return "[Emscripten Module object]";
          };
      } else if (xa || ya) {
        ya
          ? Ba = self.location.href
          : "undefined" != typeof document && document.currentScript &&
            (Ba = document.currentScript.src),
          _scriptDir && (Ba = _scriptDir),
          0 !== Ba.indexOf("blob:")
            ? Ba = Ba.substr(0, Ba.replace(/[?#].*/, "").lastIndexOf("/") + 1)
            : Ba = "",
          Ca = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.send(null);
            return b.responseText;
          },
          ya && (Ea = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
          Da = (a, b, d) => {
            var f = new XMLHttpRequest();
            f.open("GET", a, !0);
            f.responseType = "arraybuffer";
            f.onload = () => {
              200 == f.status || 0 == f.status && f.response
                ? b(f.response)
                : d();
            };
            f.onerror = d;
            f.send(null);
          };
      }
      var La = v.print || console.log.bind(console),
        Ka = v.printErr || console.warn.bind(console);
      Object.assign(v, sa);
      sa = null;
      v.thisProgram && (va = v.thisProgram);
      v.quit && (wa = v.quit);
      var Ma = 0, Na;
      v.wasmBinary && (Na = v.wasmBinary);
      var noExitRuntime = v.noExitRuntime || !0;
      "object" != typeof WebAssembly && Qa("no native wasm support detected");
      var Ra,
        Sa = !1,
        Ta = "undefined" != typeof TextDecoder
          ? new TextDecoder("utf8")
          : void 0;
      function Va(a, b, d) {
        var f = b + d;
        for (d = b; a[d] && !(d >= f);) ++d;
        if (16 < d - b && a.buffer && Ta) return Ta.decode(a.subarray(b, d));
        for (f = ""; b < d;) {
          var h = a[b++];
          if (h & 128) {
            var m = a[b++] & 63;
            if (192 == (h & 224)) f += String.fromCharCode((h & 31) << 6 | m);
            else {
              var t = a[b++] & 63;
              h = 224 == (h & 240)
                ? (h & 15) << 12 | m << 6 | t
                : (h & 7) << 18 | m << 12 | t << 6 | a[b++] & 63;
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
        return a ? Va(K, a, b) : "";
      }
      function ra(a, b, d, f) {
        if (!(0 < f)) return 0;
        var h = d;
        f = d + f - 1;
        for (var m = 0; m < a.length; ++m) {
          var t = a.charCodeAt(m);
          if (55296 <= t && 57343 >= t) {
            var n = a.charCodeAt(++m);
            t = 65536 + ((t & 1023) << 10) | n & 1023;
          }
          if (127 >= t) {
            if (d >= f) break;
            b[d++] = t;
          } else {
            if (2047 >= t) {
              if (d + 1 >= f) break;
              b[d++] = 192 | t >> 6;
            } else {
              if (65535 >= t) {
                if (d + 2 >= f) break;
                b[d++] = 224 | t >> 12;
              } else {
                if (d + 3 >= f) break;
                b[d++] = 240 | t >> 18;
                b[d++] = 128 | t >> 12 & 63;
              }
              b[d++] = 128 | t >> 6 & 63;
            }
            b[d++] = 128 | t & 63;
          }
        }
        b[d] = 0;
        return d - h;
      }
      function oa(a) {
        for (var b = 0, d = 0; d < a.length; ++d) {
          var f = a.charCodeAt(d);
          55296 <= f && 57343 >= f &&
            (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++d) & 1023);
          127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4;
        }
        return b;
      }
      var Xa = "undefined" != typeof TextDecoder
        ? new TextDecoder("utf-16le")
        : void 0;
      function Ya(a, b) {
        var d = a >> 1;
        for (var f = d + b / 2; !(d >= f) && Za[d];) ++d;
        d <<= 1;
        if (32 < d - a && Xa) return Xa.decode(K.subarray(a, d));
        d = "";
        for (f = 0; !(f >= b / 2); ++f) {
          var h = $a[a + 2 * f >> 1];
          if (0 == h) break;
          d += String.fromCharCode(h);
        }
        return d;
      }
      function cb(a, b, d) {
        void 0 === d && (d = 2147483647);
        if (2 > d) return 0;
        d -= 2;
        var f = b;
        d = d < 2 * a.length ? d / 2 : a.length;
        for (var h = 0; h < d; ++h) $a[b >> 1] = a.charCodeAt(h), b += 2;
        $a[b >> 1] = 0;
        return b - f;
      }
      function db(a) {
        return 2 * a.length;
      }
      function eb(a, b) {
        for (var d = 0, f = ""; !(d >= b / 4);) {
          var h = Q[a + 4 * d >> 2];
          if (0 == h) break;
          ++d;
          65536 <= h
            ? (h -= 65536,
              f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023))
            : f += String.fromCharCode(h);
        }
        return f;
      }
      function fb(a, b, d) {
        void 0 === d && (d = 2147483647);
        if (4 > d) return 0;
        var f = b;
        d = f + d - 4;
        for (var h = 0; h < a.length; ++h) {
          var m = a.charCodeAt(h);
          if (55296 <= m && 57343 >= m) {
            var t = a.charCodeAt(++h);
            m = 65536 + ((m & 1023) << 10) | t & 1023;
          }
          Q[b >> 2] = m;
          b += 4;
          if (b + 4 > d) break;
        }
        Q[b >> 2] = 0;
        return b - f;
      }
      function jb(a) {
        for (var b = 0, d = 0; d < a.length; ++d) {
          var f = a.charCodeAt(d);
          55296 <= f && 57343 >= f && ++d;
          b += 4;
        }
        return b;
      }
      var kb, lb, K, $a, Za, Q, mb, U, nb;
      function ob() {
        var a = Ra.buffer;
        kb = a;
        v.HEAP8 = lb = new Int8Array(a);
        v.HEAP16 = $a = new Int16Array(a);
        v.HEAP32 = Q = new Int32Array(a);
        v.HEAPU8 = K = new Uint8Array(a);
        v.HEAPU16 = Za = new Uint16Array(a);
        v.HEAPU32 = mb = new Uint32Array(a);
        v.HEAPF32 = U = new Float32Array(a);
        v.HEAPF64 = nb = new Float64Array(a);
      }
      var pb, qb = [], rb = [], sb = [];
      function tb() {
        var a = v.preRun.shift();
        qb.unshift(a);
      }
      var ub = 0, vb = null, wb = null;
      function Qa(a) {
        if (v.onAbort) v.onAbort(a);
        a = "Aborted(" + a + ")";
        Ka(a);
        Sa = !0;
        a = new WebAssembly.RuntimeError(
          a + ". Build with -sASSERTIONS for more info.",
        );
        ea(a);
        throw a;
      }
      function yb() {
        return zb.startsWith("data:application/octet-stream;base64,");
      }
      var zb;
      zb = "canvaskit.wasm";
      if (!yb()) {
        var Ab = zb;
        zb = v.locateFile ? v.locateFile(Ab, Ba) : Ba + Ab;
      }
      function Bb() {
        var a = zb;
        try {
          if (a == zb && Na) return new Uint8Array(Na);
          if (Ea) return Ea(a);
          throw "both async and sync fetching of the wasm failed";
        } catch (b) {
          Qa(b);
        }
      }
      function Cb() {
        if (!Na && (xa || ya)) {
          if ("function" == typeof fetch && !zb.startsWith("file://")) {
            return fetch(zb, { credentials: "same-origin" }).then(function (a) {
              if (!a.ok) {
                throw "failed to load wasm binary file at '" + zb + "'";
              }
              return a.arrayBuffer();
            }).catch(function () {
              return Bb();
            });
          }
          if (Da) {
            return new Promise(function (a, b) {
              Da(zb, function (d) {
                a(new Uint8Array(d));
              }, b);
            });
          }
        }
        return Promise.resolve().then(function () {
          return Bb();
        });
      }
      function Db(a) {
        for (; 0 < a.length;) a.shift()(v);
      }
      function Eb(a) {
        return pb.get(a);
      }
      var Fb = {};
      function Gb(a) {
        for (; a.length;) {
          var b = a.pop();
          a.pop()(b);
        }
      }
      function Hb(a) {
        return this.fromWireType(Q[a >> 2]);
      }
      var Ib = {}, Jb = {}, Kb = {};
      function Lb(a) {
        if (void 0 === a) return "_unknown";
        a = a.replace(/[^a-zA-Z0-9_]/g, "$");
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? "_" + a : a;
      }
      function Mb(a, b) {
        a = Lb(a);
        return function () {
          null;
          return b.apply(this, arguments);
        };
      }
      function Nb(a) {
        var b = Error,
          d = Mb(a, function (f) {
            this.name = a;
            this.message = f;
            f = Error(f).stack;
            void 0 !== f &&
              (this.stack = this.toString() + "\n" +
                f.replace(/^Error(:[^\n]*)?\n/, ""));
          });
        d.prototype = Object.create(b.prototype);
        d.prototype.constructor = d;
        d.prototype.toString = function () {
          return void 0 === this.message
            ? this.name
            : this.name + ": " + this.message;
        };
        return d;
      }
      var Ob = void 0;
      function Pb(a) {
        throw new Ob(a);
      }
      function Qb(a, b, d) {
        function f(n) {
          n = d(n);
          n.length !== a.length && Pb("Mismatched type converter count");
          for (var q = 0; q < a.length; ++q) Rb(a[q], n[q]);
        }
        a.forEach(function (n) {
          Kb[n] = b;
        });
        var h = Array(b.length), m = [], t = 0;
        b.forEach((n, q) => {
          Jb.hasOwnProperty(n)
            ? h[q] = Jb[n]
            : (m.push(n),
              Ib.hasOwnProperty(n) || (Ib[n] = []),
              Ib[n].push(() => {
                h[q] = Jb[n];
                ++t;
                t === m.length && f(h);
              }));
        });
        0 === m.length && f(h);
      }
      function Sb(a) {
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
      var Tb = void 0;
      function ac(a) {
        for (var b = ""; K[a];) b += Tb[K[a++]];
        return b;
      }
      var bc = void 0;
      function X(a) {
        throw new bc(a);
      }
      function Rb(a, b, d = {}) {
        if (!("argPackAdvance" in b)) {
          throw new TypeError(
            "registerType registeredInstance requires argPackAdvance",
          );
        }
        var f = b.name;
        a || X('type "' + f + '" must have a positive integer typeid pointer');
        if (Jb.hasOwnProperty(a)) {
          if (d.Vf) return;
          X("Cannot register type '" + f + "' twice");
        }
        Jb[a] = b;
        delete Kb[a];
        Ib.hasOwnProperty(a) &&
          (b = Ib[a], delete Ib[a], b.forEach((h) => h()));
      }
      function cc(a) {
        X(a.Ld.Xd.Rd.name + " instance already deleted");
      }
      var dc = !1;
      function ec() {}
      function fc(a) {
        --a.count.value;
        0 === a.count.value && (a.$d ? a.fe.le(a.$d) : a.Xd.Rd.le(a.Td));
      }
      function gc(a, b, d) {
        if (b === d) return a;
        if (void 0 === d.ie) return null;
        a = gc(a, b, d.ie);
        return null === a ? null : d.If(a);
      }
      var hc = {}, ic = [];
      function jc() {
        for (; ic.length;) {
          var a = ic.pop();
          a.Ld.Fe = !1;
          a["delete"]();
        }
      }
      var kc = void 0, lc = {};
      function mc(a, b) {
        for (void 0 === b && X("ptr should not be undefined"); a.ie;) {
          b = a.Oe(b), a = a.ie;
        }
        return lc[b];
      }
      function nc(a, b) {
        b.Xd && b.Td || Pb("makeClassHandle requires ptr and ptrType");
        !!b.fe !== !!b.$d &&
          Pb("Both smartPtrType and smartPtr must be specified");
        b.count = { value: 1 };
        return oc(Object.create(a, { Ld: { value: b } }));
      }
      function oc(a) {
        if ("undefined" === typeof FinalizationRegistry) {
          return oc = (b) => b, a;
        }
        dc = new FinalizationRegistry((b) => {
          fc(b.Ld);
        });
        oc = (b) => {
          var d = b.Ld;
          d.$d && dc.register(b, { Ld: d }, b);
          return b;
        };
        ec = (b) => {
          dc.unregister(b);
        };
        return oc(a);
      }
      function pc() {}
      function qc(a, b, d) {
        if (void 0 === a[b].Zd) {
          var f = a[b];
          a[b] = function () {
            a[b].Zd.hasOwnProperty(arguments.length) ||
              X(
                "Function '" + d +
                  "' called with an invalid number of arguments (" +
                  arguments.length + ") - expects one of (" + a[b].Zd + ")!",
              );
            return a[b].Zd[arguments.length].apply(this, arguments);
          };
          a[b].Zd = [];
          a[b].Zd[f.De] = f;
        }
      }
      function rc(a, b, d) {
        v.hasOwnProperty(a)
          ? ((void 0 === d || void 0 !== v[a].Zd && void 0 !== v[a].Zd[d]) &&
            X("Cannot register public name '" + a + "' twice"),
            qc(v, a, a),
            v.hasOwnProperty(d) &&
            X(
              "Cannot register multiple overloads of a function with the same number of arguments (" +
                d + ")!",
            ),
            v[a].Zd[d] = b)
          : (v[a] = b, void 0 !== d && (v[a].tg = d));
      }
      function sc(a, b, d, f, h, m, t, n) {
        this.name = a;
        this.constructor = b;
        this.Ge = d;
        this.le = f;
        this.ie = h;
        this.Of = m;
        this.Oe = t;
        this.If = n;
        this.bg = [];
      }
      function tc(a, b, d) {
        for (; b !== d;) {
          b.Oe ||
          X(
            "Expected null or instance of " + d.name + ", got an instance of " +
              b.name,
          ),
            a = b.Oe(a),
            b = b.ie;
        }
        return a;
      }
      function uc(a, b) {
        if (null === b) {
          return this.ef && X("null is not a valid " + this.name), 0;
        }
        b.Ld || X('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Ld.Td ||
          X("Cannot pass deleted object as a pointer of type " + this.name);
        return tc(b.Ld.Td, b.Ld.Xd.Rd, this.Rd);
      }
      function wc(a, b) {
        if (null === b) {
          this.ef && X("null is not a valid " + this.name);
          if (this.Te) {
            var d = this.ff();
            null !== a && a.push(this.le, d);
            return d;
          }
          return 0;
        }
        b.Ld || X('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Ld.Td ||
          X("Cannot pass deleted object as a pointer of type " + this.name);
        !this.Se && b.Ld.Xd.Se &&
          X(
            "Cannot convert argument of type " +
              (b.Ld.fe ? b.Ld.fe.name : b.Ld.Xd.name) + " to parameter type " +
              this.name,
          );
        d = tc(b.Ld.Td, b.Ld.Xd.Rd, this.Rd);
        if (this.Te) {
          switch (
            void 0 === b.Ld.$d &&
            X("Passing raw pointer to smart pointer is illegal"), this.hg
          ) {
            case 0:
              b.Ld.fe === this ? d = b.Ld.$d : X(
                "Cannot convert argument of type " +
                  (b.Ld.fe ? b.Ld.fe.name : b.Ld.Xd.name) +
                  " to parameter type " + this.name,
              );
              break;
            case 1:
              d = b.Ld.$d;
              break;
            case 2:
              if (b.Ld.fe === this) d = b.Ld.$d;
              else {
                var f = b.clone();
                d = this.cg(
                  d,
                  xc(function () {
                    f["delete"]();
                  }),
                );
                null !== a && a.push(this.le, d);
              }
              break;
            default:
              X("Unsupporting sharing policy");
          }
        }
        return d;
      }
      function yc(a, b) {
        if (null === b) {
          return this.ef && X("null is not a valid " + this.name), 0;
        }
        b.Ld || X('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Ld.Td ||
          X("Cannot pass deleted object as a pointer of type " + this.name);
        b.Ld.Xd.Se &&
          X(
            "Cannot convert argument of type " + b.Ld.Xd.name +
              " to parameter type " + this.name,
          );
        return tc(b.Ld.Td, b.Ld.Xd.Rd, this.Rd);
      }
      function zc(a, b, d, f, h, m, t, n, q, x, D) {
        this.name = a;
        this.Rd = b;
        this.ef = d;
        this.Se = f;
        this.Te = h;
        this.ag = m;
        this.hg = t;
        this.uf = n;
        this.ff = q;
        this.cg = x;
        this.le = D;
        h || void 0 !== b.ie
          ? this.toWireType = wc
          : (this.toWireType = f ? uc : yc, this.ee = null);
      }
      function Ac(a, b, d) {
        v.hasOwnProperty(a) || Pb("Replacing nonexistant public symbol");
        void 0 !== v[a].Zd && void 0 !== d
          ? v[a].Zd[d] = b
          : (v[a] = b, v[a].De = d);
      }
      function Bc(a, b) {
        var d = [];
        return function () {
          d.length = 0;
          Object.assign(d, arguments);
          if (a.includes("j")) {
            var f = v["dynCall_" + a];
            f = d && d.length ? f.apply(null, [b].concat(d)) : f.call(null, b);
          } else f = Eb(b).apply(null, d);
          return f;
        };
      }
      function Ic(a, b) {
        a = ac(a);
        var d = a.includes("j") ? Bc(a, b) : Eb(b);
        "function" != typeof d &&
          X("unknown function pointer with signature " + a + ": " + b);
        return d;
      }
      var Jc = void 0;
      function Kc(a) {
        a = Lc(a);
        var b = ac(a);
        Mc(a);
        return b;
      }
      function Nc(a, b) {
        function d(m) {
          h[m] || Jb[m] || (Kb[m] ? Kb[m].forEach(d) : (f.push(m), h[m] = !0));
        }
        var f = [], h = {};
        b.forEach(d);
        throw new Jc(a + ": " + f.map(Kc).join([", "]));
      }
      function Oc(a, b, d, f, h) {
        var m = b.length;
        2 > m &&
          X("argTypes array size mismatch! Must at least get return value and 'this' types!");
        var t = null !== b[1] && null !== d, n = !1;
        for (d = 1; d < b.length; ++d) {
          if (null !== b[d] && void 0 === b[d].ee) {
            n = !0;
            break;
          }
        }
        var q = "void" !== b[0].name, x = m - 2, D = Array(x), I = [], M = [];
        return function () {
          arguments.length !== x &&
            X(
              "function " + a + " called with " + arguments.length +
                " arguments, expected " + x + " args!",
            );
          M.length = 0;
          I.length = t ? 2 : 1;
          I[0] = h;
          if (t) {
            var z = b[1].toWireType(M, this);
            I[1] = z;
          }
          for (var N = 0; N < x; ++N) {
            D[N] = b[N + 2].toWireType(M, arguments[N]), I.push(D[N]);
          }
          N = f.apply(null, I);
          if (n) Gb(M);
          else {
            for (var S = t ? 1 : 2; S < b.length; S++) {
              var T = 1 === S ? z : D[S - 2];
              null !== b[S].ee && b[S].ee(T);
            }
          }
          z = q ? b[0].fromWireType(N) : void 0;
          return z;
        };
      }
      function Pc(a, b) {
        for (var d = [], f = 0; f < a; f++) d.push(mb[b + 4 * f >> 2]);
        return d;
      }
      var Qc = [],
        Rc = [{}, { value: void 0 }, { value: null }, { value: !0 }, {
          value: !1,
        }];
      function Sc(a) {
        4 < a && 0 === --Rc[a].gf && (Rc[a] = void 0, Qc.push(a));
      }
      var Tc = (a) => {
          a || X("Cannot use deleted val. handle = " + a);
          return Rc[a].value;
        },
        xc = (a) => {
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
              var b = Qc.length ? Qc.pop() : Rc.length;
              Rc[b] = { gf: 1, value: a };
              return b;
          }
        };
      function Uc(a, b, d) {
        switch (b) {
          case 0:
            return function (f) {
              return this.fromWireType((d ? lb : K)[f]);
            };
          case 1:
            return function (f) {
              return this.fromWireType((d ? $a : Za)[f >> 1]);
            };
          case 2:
            return function (f) {
              return this.fromWireType((d ? Q : mb)[f >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      function Vc(a, b) {
        var d = Jb[a];
        void 0 === d && X(b + " has unknown type " + Kc(a));
        return d;
      }
      function vc(a) {
        if (null === a) return "null";
        var b = typeof a;
        return "object" === b || "array" === b || "function" === b
          ? a.toString()
          : "" + a;
      }
      function Wc(a, b) {
        switch (b) {
          case 2:
            return function (d) {
              return this.fromWireType(U[d >> 2]);
            };
          case 3:
            return function (d) {
              return this.fromWireType(nb[d >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + a);
        }
      }
      function Xc(a, b, d) {
        switch (b) {
          case 0:
            return d
              ? function (f) {
                return lb[f];
              }
              : function (f) {
                return K[f];
              };
          case 1:
            return d
              ? function (f) {
                return $a[f >> 1];
              }
              : function (f) {
                return Za[f >> 1];
              };
          case 2:
            return d
              ? function (f) {
                return Q[f >> 2];
              }
              : function (f) {
                return mb[f >> 2];
              };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      var Yc = {};
      function Zc(a) {
        var b = Yc[a];
        return void 0 === b ? ac(a) : b;
      }
      var $c = [];
      function ad() {
        function a(b) {
          b.$$$embind_global$$$ = b;
          var d = "object" == typeof $$$embind_global$$$ &&
            b.$$$embind_global$$$ == b;
          d || delete b.$$$embind_global$$$;
          return d;
        }
        if ("object" == typeof globalThis) return globalThis;
        if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
        "object" == typeof global && a(global)
          ? $$$embind_global$$$ = global
          : "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
        if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
        throw Error("unable to get global object.");
      }
      function bd(a) {
        var b = $c.length;
        $c.push(a);
        return b;
      }
      function cd(a, b) {
        for (var d = Array(a), f = 0; f < a; ++f) {
          d[f] = Vc(mb[b + 4 * f >> 2], "parameter " + f);
        }
        return d;
      }
      var dd = [];
      function ed(a) {
        var b = Array(a + 1);
        return function (d, f, h) {
          b[0] = d;
          for (var m = 0; m < a; ++m) {
            var t = Vc(mb[f + 4 * m >> 2], "parameter " + m);
            b[m + 1] = t.readValueFromPointer(h);
            h += t.argPackAdvance;
          }
          d = new (d.bind.apply(d, b))();
          return xc(d);
        };
      }
      var fd = {}, gd;
      gd = za
        ? () => {
          var a = process.hrtime();
          return 1E3 * a[0] + a[1] / 1E6;
        }
        : () => performance.now();
      function hd(a) {
        var b = a.getExtension("ANGLE_instanced_arrays");
        b && (a.vertexAttribDivisor = function (d, f) {
          b.vertexAttribDivisorANGLE(d, f);
        },
          a.drawArraysInstanced = function (d, f, h, m) {
            b.drawArraysInstancedANGLE(d, f, h, m);
          },
          a.drawElementsInstanced = function (d, f, h, m, t) {
            b.drawElementsInstancedANGLE(d, f, h, m, t);
          });
      }
      function jd(a) {
        var b = a.getExtension("OES_vertex_array_object");
        b && (a.createVertexArray = function () {
          return b.createVertexArrayOES();
        },
          a.deleteVertexArray = function (d) {
            b.deleteVertexArrayOES(d);
          },
          a.bindVertexArray = function (d) {
            b.bindVertexArrayOES(d);
          },
          a.isVertexArray = function (d) {
            return b.isVertexArrayOES(d);
          });
      }
      function kd(a) {
        var b = a.getExtension("WEBGL_draw_buffers");
        b && (a.drawBuffers = function (d, f) {
          b.drawBuffersWEBGL(d, f);
        });
      }
      var ld = 1,
        md = [],
        nd = [],
        od = [],
        pd = [],
        ja = [],
        qd = [],
        rd = [],
        na = [],
        sd = [],
        td = [],
        ud = {},
        vd = {},
        wd = 4;
      function xd(a) {
        Ad || (Ad = a);
      }
      function ha(a) {
        for (var b = ld++, d = a.length; d < b; d++) a[d] = null;
        return b;
      }
      function la(a, b) {
        a.kf || (a.kf = a.getContext,
          a.getContext = function (f, h) {
            h = a.kf(f, h);
            return "webgl" == f == h instanceof WebGLRenderingContext
              ? h
              : null;
          });
        var d = 1 < b.majorVersion
          ? a.getContext("webgl2", b)
          : a.getContext("webgl", b);
        return d ? Bd(d, b) : 0;
      }
      function Bd(a, b) {
        var d = ha(na),
          f = { Uf: d, attributes: b, version: b.majorVersion, ge: a };
        a.canvas && (a.canvas.xf = f);
        na[d] = f;
        ("undefined" == typeof b.Jf || b.Jf) && Cd(f);
        return d;
      }
      function ma(a) {
        w = na[a];
        v.rg = Y = w && w.ge;
        return !(a && !Y);
      }
      function Cd(a) {
        a || (a = w);
        if (!a.Wf) {
          a.Wf = !0;
          var b = a.ge;
          hd(b);
          jd(b);
          kd(b);
          b.pf = b.getExtension(
            "WEBGL_draw_instanced_base_vertex_base_instance",
          );
          b.tf = b.getExtension(
            "WEBGL_multi_draw_instanced_base_vertex_base_instance",
          );
          2 <= a.version &&
            (b.qf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
          if (2 > a.version || !b.qf) {
            b.qf = b.getExtension("EXT_disjoint_timer_query");
          }
          b.sg = b.getExtension("WEBGL_multi_draw");
          (b.getSupportedExtensions() || []).forEach(function (d) {
            d.includes("lose_context") || d.includes("debug") ||
              b.getExtension(d);
          });
        }
      }
      var w, Ad, Dd = [];
      function Ed(a, b, d, f) {
        for (var h = 0; h < a; h++) {
          var m = Y[d](), t = m && ha(f);
          m ? (m.name = t, f[t] = m) : xd(1282);
          Q[b + 4 * h >> 2] = t;
        }
      }
      function Fd(a, b, d) {
        if (b) {
          var f = void 0;
          switch (a) {
            case 36346:
              f = 1;
              break;
            case 36344:
              0 != d && 1 != d && xd(1280);
              return;
            case 34814:
            case 36345:
              f = 0;
              break;
            case 34466:
              var h = Y.getParameter(34467);
              f = h ? h.length : 0;
              break;
            case 33309:
              if (2 > w.version) {
                xd(1282);
                return;
              }
              f = 2 * (Y.getSupportedExtensions() || []).length;
              break;
            case 33307:
            case 33308:
              if (2 > w.version) {
                xd(1280);
                return;
              }
              f = 33307 == a ? 3 : 0;
          }
          if (void 0 === f) {
            switch (h = Y.getParameter(a), typeof h) {
              case "number":
                f = h;
                break;
              case "boolean":
                f = h ? 1 : 0;
                break;
              case "string":
                xd(1280);
                return;
              case "object":
                if (
                  null ===
                    h
                ) {
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
                      f = 0;
                      break;
                    default:
                      xd(1280);
                      return;
                  }
                } else {
                  if (
                    h instanceof Float32Array || h instanceof Uint32Array ||
                    h instanceof Int32Array || h instanceof Array
                  ) {
                    for (a = 0; a < h.length; ++a) {
                      switch (d) {
                        case 0:
                          Q[b + 4 * a >> 2] = h[a];
                          break;
                        case 2:
                          U[b + 4 * a >> 2] = h[a];
                          break;
                        case 4:
                          lb[b + a >> 0] = h[a] ? 1 : 0;
                      }
                    }
                    return;
                  }
                  try {
                    f = h.name |
                      0;
                  } catch (m) {
                    xd(1280);
                    Ka(
                      "GL_INVALID_ENUM in glGet" + d +
                        "v: Unknown object returned from WebGL getParameter(" +
                        a + ")! (error: " + m + ")",
                    );
                    return;
                  }
                }
                break;
              default:
                xd(1280);
                Ka(
                  "GL_INVALID_ENUM in glGet" + d +
                    "v: Native code calling glGet" + d + "v(" + a +
                    ") and it returns " + h + " of type " + typeof h + "!",
                );
                return;
            }
          }
          switch (d) {
            case 1:
              d = f;
              mb[b >> 2] = d;
              mb[b + 4 >> 2] = (d - mb[b >> 2]) / 4294967296;
              break;
            case 0:
              Q[b >> 2] = f;
              break;
            case 2:
              U[b >> 2] = f;
              break;
            case 4:
              lb[b >> 0] = f ? 1 : 0;
          }
        } else xd(1281);
      }
      function Gd(a) {
        var b = oa(a) + 1, d = Hd(b);
        ra(a, K, d, b);
        return d;
      }
      function Id(a) {
        return "]" == a.slice(-1) && a.lastIndexOf("[");
      }
      function Jd(a) {
        a -= 5120;
        return 0 == a
          ? lb
          : 1 == a
          ? K
          : 2 == a
          ? $a
          : 4 == a
          ? Q
          : 6 == a
          ? U
          : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
          ? mb
          : Za;
      }
      function Kd(a, b, d, f, h) {
        a = Jd(a);
        var m = 31 - Math.clz32(a.BYTES_PER_ELEMENT), t = wd;
        return a.subarray(
          h >> m,
          h + f *
                (d *
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
                        }[b - 6402] || 1) * (1 << m) + t - 1 & -t) >> m,
        );
      }
      function Z(a) {
        var b = Y.Gf;
        if (b) {
          var d = b.Ne[a];
          "number" == typeof d &&
            (b.Ne[a] = d = Y.getUniformLocation(
              b,
              b.vf[a] + (0 < d ? "[" + d + "]" : ""),
            ));
          return d;
        }
        xd(1282);
      }
      var Ld = [], Md = [], Nd = {};
      function Od() {
        if (!Pd) {
          var a = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG: ("object" == typeof navigator && navigator.languages &&
                  navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
              _: va || "./this.program",
            },
            b;
          for (b in Nd) void 0 === Nd[b] ? delete a[b] : a[b] = Nd[b];
          var d = [];
          for (b in a) d.push(b + "=" + a[b]);
          Pd = d;
        }
        return Pd;
      }
      var Pd, Qd = [null, [], []];
      function Rd(a) {
        return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
      }
      var Sd = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Td = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function Ud(a, b, d, f) {
        function h(z, N, S) {
          for (
            z = "number" == typeof z ? z.toString() : z || "";
            z.length < N;
          ) {
            z = S[0] + z;
          }
          return z;
        }
        function m(z, N) {
          return h(z, N, "0");
        }
        function t(z, N) {
          function S(pa) {
            return 0 > pa ? -1 : 0 < pa ? 1 : 0;
          }
          var T;
          0 === (T = S(z.getFullYear() - N.getFullYear())) &&
            0 === (T = S(z.getMonth() - N.getMonth())) &&
            (T = S(z.getDate() - N.getDate()));
          return T;
        }
        function n(z) {
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
        function q(z) {
          var N = z.pe;
          for (z = new Date((new Date(z.qe + 1900, 0, 1)).getTime()); 0 < N;) {
            var S = z.getMonth(), T = (Rd(z.getFullYear()) ? Sd : Td)[S];
            if (N > T - z.getDate()) {
              N -= T - z.getDate() + 1,
                z.setDate(1),
                11 > S
                  ? z.setMonth(S + 1)
                  : (z.setMonth(0), z.setFullYear(z.getFullYear() + 1));
            } else {
              z.setDate(z.getDate() + N);
              break;
            }
          }
          S = new Date(z.getFullYear() + 1, 0, 4);
          N = n(new Date(z.getFullYear(), 0, 4));
          S = n(S);
          return 0 >= t(N, z)
            ? 0 >= t(S, z) ? z.getFullYear() + 1 : z.getFullYear()
            : z.getFullYear() - 1;
        }
        var x = Q[f + 40 >> 2];
        f = {
          pg: Q[f >> 2],
          og: Q[f + 4 >> 2],
          Xe: Q[f + 8 >> 2],
          hf: Q[f + 12 >> 2],
          Ye: Q[f + 16 >> 2],
          qe: Q[f + 20 >> 2],
          je: Q[f + 24 >> 2],
          pe: Q[f + 28 >> 2],
          vg: Q[f + 32 >> 2],
          ng: Q[f + 36 >> 2],
          qg: x ? Wa(x) : "",
        };
        d = Wa(d);
        x = {
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
        for (var D in x) d = d.replace(new RegExp(D, "g"), x[D]);
        var I = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday"
            .split(" "),
          M =
            "January February March April May June July August September October November December"
              .split(" ");
        x = {
          "%a": function (z) {
            return I[z.je].substring(0, 3);
          },
          "%A": function (z) {
            return I[z.je];
          },
          "%b": function (z) {
            return M[z.Ye].substring(0, 3);
          },
          "%B": function (z) {
            return M[z.Ye];
          },
          "%C": function (z) {
            return m((z.qe + 1900) / 100 | 0, 2);
          },
          "%d": function (z) {
            return m(z.hf, 2);
          },
          "%e": function (z) {
            return h(z.hf, 2, " ");
          },
          "%g": function (z) {
            return q(z).toString().substring(2);
          },
          "%G": function (z) {
            return q(z);
          },
          "%H": function (z) {
            return m(z.Xe, 2);
          },
          "%I": function (z) {
            z = z.Xe;
            0 == z ? z = 12 : 12 < z && (z -= 12);
            return m(z, 2);
          },
          "%j": function (z) {
            for (
              var N = 0, S = 0;
              S <= z.Ye - 1;
              N += (Rd(z.qe + 1900) ? Sd : Td)[S++]
            );
            return m(z.hf + N, 3);
          },
          "%m": function (z) {
            return m(z.Ye + 1, 2);
          },
          "%M": function (z) {
            return m(z.og, 2);
          },
          "%n": function () {
            return "\n";
          },
          "%p": function (z) {
            return 0 <= z.Xe && 12 > z.Xe ? "AM" : "PM";
          },
          "%S": function (z) {
            return m(z.pg, 2);
          },
          "%t": function () {
            return "\t";
          },
          "%u": function (z) {
            return z.je || 7;
          },
          "%U": function (z) {
            return m(Math.floor((z.pe + 7 - z.je) / 7), 2);
          },
          "%V": function (z) {
            var N = Math.floor((z.pe + 7 - (z.je + 6) % 7) / 7);
            2 >= (z.je + 371 - z.pe - 2) % 7 && N++;
            if (N) {
              53 == N &&
                (S = (z.je + 371 - z.pe) % 7,
                  4 == S || 3 == S && Rd(z.qe) || (N = 1));
            } else {
              N = 52;
              var S = (z.je + 7 - z.pe - 1) % 7;
              (4 == S || 5 == S && Rd(z.qe % 400 - 1)) && N++;
            }
            return m(N, 2);
          },
          "%w": function (z) {
            return z.je;
          },
          "%W": function (z) {
            return m(
              Math.floor(
                (z.pe +
                  7 - (z.je + 6) % 7) / 7,
              ),
              2,
            );
          },
          "%y": function (z) {
            return (z.qe + 1900).toString().substring(2);
          },
          "%Y": function (z) {
            return z.qe + 1900;
          },
          "%z": function (z) {
            z = z.ng;
            var N = 0 <= z;
            z = Math.abs(z) / 60;
            return (N ? "+" : "-") +
              String("0000" + (z / 60 * 100 + z % 60)).slice(-4);
          },
          "%Z": function (z) {
            return z.qg;
          },
          "%%": function () {
            return "%";
          },
        };
        d = d.replace(/%%/g, "\x00\x00");
        for (D in x) {
          d.includes(D) && (d = d.replace(new RegExp(D, "g"), x[D](f)));
        }
        d = d.replace(/\0\0/g, "%");
        D = Vd(d);
        if (D.length > b) return 0;
        lb.set(D, a);
        return D.length - 1;
      }
      Ob = v.InternalError = Nb("InternalError");
      for (var Wd = Array(256), Xd = 0; 256 > Xd; ++Xd) {
        Wd[Xd] = String.fromCharCode(Xd);
      }
      Tb = Wd;
      bc = v.BindingError = Nb("BindingError");
      pc.prototype.isAliasOf = function (a) {
        if (!(this instanceof pc && a instanceof pc)) return !1;
        var b = this.Ld.Xd.Rd, d = this.Ld.Td, f = a.Ld.Xd.Rd;
        for (a = a.Ld.Td; b.ie;) d = b.Oe(d), b = b.ie;
        for (; f.ie;) a = f.Oe(a), f = f.ie;
        return b === f && d === a;
      };
      pc.prototype.clone = function () {
        this.Ld.Td || cc(this);
        if (this.Ld.Me) return this.Ld.count.value += 1, this;
        var a = oc,
          b = Object,
          d = b.create,
          f = Object.getPrototypeOf(this),
          h = this.Ld;
        a = a(
          d.call(b, f, {
            Ld: {
              value: {
                count: h.count,
                Fe: h.Fe,
                Me: h.Me,
                Td: h.Td,
                Xd: h.Xd,
                $d: h.$d,
                fe: h.fe,
              },
            },
          }),
        );
        a.Ld.count.value += 1;
        a.Ld.Fe = !1;
        return a;
      };
      pc.prototype["delete"] = function () {
        this.Ld.Td || cc(this);
        this.Ld.Fe && !this.Ld.Me && X("Object already scheduled for deletion");
        ec(this);
        fc(this.Ld);
        this.Ld.Me || (this.Ld.$d = void 0, this.Ld.Td = void 0);
      };
      pc.prototype.isDeleted = function () {
        return !this.Ld.Td;
      };
      pc.prototype.deleteLater = function () {
        this.Ld.Td || cc(this);
        this.Ld.Fe && !this.Ld.Me && X("Object already scheduled for deletion");
        ic.push(this);
        1 === ic.length && kc && kc(jc);
        this.Ld.Fe = !0;
        return this;
      };
      v.getInheritedInstanceCount = function () {
        return Object.keys(lc).length;
      };
      v.getLiveInheritedInstances = function () {
        var a = [], b;
        for (b in lc) lc.hasOwnProperty(b) && a.push(lc[b]);
        return a;
      };
      v.flushPendingDeletes = jc;
      v.setDelayFunction = function (a) {
        kc = a;
        ic.length && kc && kc(jc);
      };
      zc.prototype.Pf = function (a) {
        this.uf && (a = this.uf(a));
        return a;
      };
      zc.prototype.nf = function (a) {
        this.le && this.le(a);
      };
      zc.prototype.argPackAdvance = 8;
      zc.prototype.readValueFromPointer = Hb;
      zc.prototype.deleteObject = function (a) {
        if (null !== a) a["delete"]();
      };
      zc.prototype.fromWireType = function (a) {
        function b() {
          return this.Te
            ? nc(this.Rd.Ge, { Xd: this.ag, Td: d, fe: this, $d: a })
            : nc(this.Rd.Ge, { Xd: this, Td: a });
        }
        var d = this.Pf(a);
        if (!d) return this.nf(a), null;
        var f = mc(this.Rd, d);
        if (void 0 !== f) {
          if (0 === f.Ld.count.value) {
            return f.Ld.Td = d, f.Ld.$d = a, f.clone();
          }
          f = f.clone();
          this.nf(a);
          return f;
        }
        f = this.Rd.Of(d);
        f = hc[f];
        if (!f) return b.call(this);
        f = this.Se ? f.Ef : f.pointerType;
        var h = gc(d, this.Rd, f.Rd);
        return null === h
          ? b.call(this)
          : this.Te
          ? nc(f.Rd.Ge, { Xd: f, Td: h, fe: this, $d: a })
          : nc(f.Rd.Ge, { Xd: f, Td: h });
      };
      Jc = v.UnboundTypeError = Nb("UnboundTypeError");
      v.count_emval_handles = function () {
        for (var a = 0, b = 5; b < Rc.length; ++b) void 0 !== Rc[b] && ++a;
        return a;
      };
      v.get_first_emval = function () {
        for (var a = 5; a < Rc.length; ++a) if (void 0 !== Rc[a]) return Rc[a];
        return null;
      };
      for (var Y, Yd = 0; 32 > Yd; ++Yd) Dd.push(Array(Yd));
      var Zd = new Float32Array(288);
      for (Yd = 0; 288 > Yd; ++Yd) Ld[Yd] = Zd.subarray(0, Yd + 1);
      var $d = new Int32Array(288);
      for (Yd = 0; 288 > Yd; ++Yd) Md[Yd] = $d.subarray(0, Yd + 1);
      function Vd(a) {
        var b = Array(oa(a) + 1);
        ra(a, b, 0, b.length);
        return b;
      }
      var pe = {
        U: function () {
          return 0;
        },
        Bb: function () {},
        Db: function () {
          return 0;
        },
        yb: function () {},
        zb: function () {},
        V: function () {},
        Ab: function () {},
        D: function (a) {
          var b = Fb[a];
          delete Fb[a];
          var d = b.ff,
            f = b.le,
            h = b.rf,
            m = h.map((t) => t.Sf).concat(h.map((t) => t.fg));
          Qb([a], m, (t) => {
            var n = {};
            h.forEach((q, x) => {
              var D = t[x],
                I = q.Qf,
                M = q.Rf,
                z = t[x + h.length],
                N = q.eg,
                S = q.gg;
              n[q.Kf] = {
                read: (T) => D.fromWireType(I(M, T)),
                write: (T, pa) => {
                  var ta = [];
                  N(S, T, z.toWireType(ta, pa));
                  Gb(ta);
                },
              };
            });
            return [{
              name: b.name,
              fromWireType: function (q) {
                var x = {}, D;
                for (D in n) x[D] = n[D].read(q);
                f(q);
                return x;
              },
              toWireType: function (q, x) {
                for (var D in n) {
                  if (!(D in x)) {
                    throw new TypeError('Missing field:  "' + D + '"');
                  }
                }
                var I = d();
                for (D in n) n[D].write(I, x[D]);
                null !== q && q.push(f, I);
                return I;
              },
              argPackAdvance: 8,
              readValueFromPointer: Hb,
              ee: f,
            }];
          });
        },
        qb: function () {},
        Hb: function (a, b, d, f, h) {
          var m = Sb(d);
          b = ac(b);
          Rb(a, {
            name: b,
            fromWireType: function (t) {
              return !!t;
            },
            toWireType: function (t, n) {
              return n ? f : h;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (t) {
              if (1 === d) var n = lb;
              else if (2 === d) n = $a;
              else if (4 === d) n = Q;
              else throw new TypeError("Unknown boolean type size: " + b);
              return this.fromWireType(n[t >> m]);
            },
            ee: null,
          });
        },
        p: function (a, b, d, f, h, m, t, n, q, x, D, I, M) {
          D = ac(D);
          m = Ic(h, m);
          n && (n = Ic(t, n));
          x && (x = Ic(q, x));
          M = Ic(I, M);
          var z = Lb(D);
          rc(z, function () {
            Nc("Cannot construct " + D + " due to unbound types", [f]);
          });
          Qb([a, b, d], f ? [f] : [], function (N) {
            N = N[0];
            if (f) {
              var S = N.Rd;
              var T = S.Ge;
            } else T = pc.prototype;
            N = Mb(z, function () {
              if (Object.getPrototypeOf(this) !== pa) {
                throw new bc("Use 'new' to construct " + D);
              }
              if (void 0 === ta.oe) {
                throw new bc(
                  D +
                    " has no accessible constructor",
                );
              }
              var hb = ta.oe[arguments.length];
              if (void 0 === hb) {
                throw new bc(
                  "Tried to invoke ctor of " + D +
                    " with invalid number of parameters (" + arguments.length +
                    ") - expected (" + Object.keys(ta.oe).toString() +
                    ") parameters instead!",
                );
              }
              return hb.apply(this, arguments);
            });
            var pa = Object.create(T, { constructor: { value: N } });
            N.prototype = pa;
            var ta = new sc(D, N, pa, M, S, m, n, x);
            S = new zc(D, ta, !0, !1, !1);
            T = new zc(D + "*", ta, !1, !1, !1);
            var gb = new zc(D + " const*", ta, !1, !0, !1);
            hc[a] = { pointerType: T, Ef: gb };
            Ac(z, N);
            return [S, T, gb];
          });
        },
        h: function (a, b, d, f, h, m, t) {
          var n = Pc(d, f);
          b = ac(b);
          m = Ic(h, m);
          Qb([], [a], function (q) {
            function x() {
              Nc("Cannot call " + D + " due to unbound types", n);
            }
            q = q[0];
            var D = q.name + "." + b;
            b.startsWith("@@") && (b = Symbol[b.substring(2)]);
            var I = q.Rd.constructor;
            void 0 === I[b]
              ? (x.De = d - 1, I[b] = x)
              : (qc(I, b, D), I[b].Zd[d - 1] = x);
            Qb([], n, function (M) {
              M = [M[0], null].concat(M.slice(1));
              M = Oc(D, M, null, m, t);
              void 0 === I[b].Zd
                ? (M.De = d - 1, I[b] = M)
                : I[b].Zd[d - 1] = M;
              return [];
            });
            return [];
          });
        },
        z: function (a, b, d, f, h, m) {
          0 < b || Qa();
          var t = Pc(b, d);
          h = Ic(f, h);
          Qb([], [a], function (n) {
            n = n[0];
            var q = "constructor " + n.name;
            void 0 === n.Rd.oe && (n.Rd.oe = []);
            if (void 0 !== n.Rd.oe[b - 1]) {
              throw new bc(
                "Cannot register multiple constructors with identical number of parameters (" +
                  (b - 1) + ") for class '" + n.name +
                  "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
              );
            }
            n.Rd.oe[b - 1] = () => {
              Nc("Cannot construct " + n.name + " due to unbound types", t);
            };
            Qb([], t, function (x) {
              x.splice(1, 0, null);
              n.Rd.oe[b - 1] = Oc(q, x, null, h, m);
              return [];
            });
            return [];
          });
        },
        b: function (a, b, d, f, h, m, t, n) {
          var q = Pc(d, f);
          b = ac(b);
          m = Ic(h, m);
          Qb([], [a], function (x) {
            function D() {
              Nc("Cannot call " + I + " due to unbound types", q);
            }
            x = x[0];
            var I = x.name + "." + b;
            b.startsWith("@@") && (b = Symbol[b.substring(2)]);
            n && x.Rd.bg.push(b);
            var M = x.Rd.Ge, z = M[b];
            void 0 === z ||
              void 0 === z.Zd && z.className !== x.name && z.De === d - 2
              ? (D.De = d - 2, D.className = x.name, M[b] = D)
              : (qc(M, b, I), M[b].Zd[d - 2] = D);
            Qb([], q, function (N) {
              N = Oc(I, N, x, m, t);
              void 0 === M[b].Zd
                ? (N.De = d - 2, M[b] = N)
                : M[b].Zd[d - 2] = N;
              return [];
            });
            return [];
          });
        },
        w: function (a, b, d) {
          a = ac(a);
          Qb([], [b], function (f) {
            f = f[0];
            v[a] = f.fromWireType(d);
            return [];
          });
        },
        Gb: function (a, b) {
          b = ac(b);
          Rb(a, {
            name: b,
            fromWireType: function (d) {
              var f = Tc(d);
              Sc(d);
              return f;
            },
            toWireType: function (d, f) {
              return xc(f);
            },
            argPackAdvance: 8,
            readValueFromPointer: Hb,
            ee: null,
          });
        },
        n: function (a, b, d, f) {
          function h() {}
          d = Sb(d);
          b = ac(b);
          h.values = {};
          Rb(a, {
            name: b,
            constructor: h,
            fromWireType: function (m) {
              return this.constructor.values[m];
            },
            toWireType: function (m, t) {
              return t.value;
            },
            argPackAdvance: 8,
            readValueFromPointer: Uc(b, d, f),
            ee: null,
          });
          rc(b, h);
        },
        e: function (a, b, d) {
          var f = Vc(a, "enum");
          b = ac(b);
          a = f.constructor;
          f = Object.create(f.constructor.prototype, {
            value: { value: d },
            constructor: { value: Mb(f.name + "_" + b, function () {}) },
          });
          a.values[d] = f;
          a[b] = f;
        },
        Y: function (a, b, d) {
          d = Sb(d);
          b = ac(b);
          Rb(a, {
            name: b,
            fromWireType: function (f) {
              return f;
            },
            toWireType: function (f, h) {
              return h;
            },
            argPackAdvance: 8,
            readValueFromPointer: Wc(b, d),
            ee: null,
          });
        },
        x: function (a, b, d, f, h, m) {
          var t = Pc(b, d);
          a = ac(a);
          h = Ic(f, h);
          rc(a, function () {
            Nc("Cannot call " + a + " due to unbound types", t);
          }, b - 1);
          Qb([], t, function (n) {
            n = [n[0], null].concat(n.slice(1));
            Ac(a, Oc(a, n, null, h, m), b - 1);
            return [];
          });
        },
        B: function (a, b, d, f, h) {
          b = ac(b);
          -1 === h && (h = 4294967295);
          h = Sb(d);
          var m = (n) => n;
          if (0 === f) {
            var t = 32 - 8 * d;
            m = (n) => n << t >>> t;
          }
          d = b.includes("unsigned")
            ? function (n, q) {
              return q >>> 0;
            }
            : function (n, q) {
              return q;
            };
          Rb(a, {
            name: b,
            fromWireType: m,
            toWireType: d,
            argPackAdvance: 8,
            readValueFromPointer: Xc(b, h, 0 !== f),
            ee: null,
          });
        },
        t: function (a, b, d) {
          function f(m) {
            m >>= 2;
            var t = mb;
            return new h(kb, t[m + 1], t[m]);
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
          d = ac(d);
          Rb(a, {
            name: d,
            fromWireType: f,
            argPackAdvance: 8,
            readValueFromPointer: f,
          }, { Vf: !0 });
        },
        u: function (a, b, d, f, h, m, t, n, q, x, D, I) {
          d = ac(d);
          m = Ic(h, m);
          n = Ic(t, n);
          x = Ic(q, x);
          I = Ic(D, I);
          Qb([a], [b], function (M) {
            M = M[0];
            return [new zc(d, M.Rd, !1, !1, !0, M, f, m, n, x, I)];
          });
        },
        X: function (a, b) {
          b = ac(b);
          var d = "std::string" === b;
          Rb(a, {
            name: b,
            fromWireType: function (f) {
              var h = mb[f >> 2], m = f + 4;
              if (d) {
                for (var t = m, n = 0; n <= h; ++n) {
                  var q = m + n;
                  if (n == h || 0 == K[q]) {
                    t = Wa(t, q - t);
                    if (void 0 === x) var x = t;
                    else x += String.fromCharCode(0), x += t;
                    t = q + 1;
                  }
                }
              } else {
                x = Array(h);
                for (n = 0; n < h; ++n) x[n] = String.fromCharCode(K[m + n]);
                x = x.join("");
              }
              Mc(f);
              return x;
            },
            toWireType: function (f, h) {
              h instanceof ArrayBuffer && (h = new Uint8Array(h));
              var m = "string" == typeof h;
              m || h instanceof Uint8Array || h instanceof Uint8ClampedArray ||
                h instanceof Int8Array ||
                X("Cannot pass non-string to std::string");
              var t = d && m ? oa(h) : h.length;
              var n = Hd(4 + t + 1), q = n + 4;
              mb[n >> 2] = t;
              if (d && m) ra(h, K, q, t + 1);
              else if (m) {
                for (m = 0; m < t; ++m) {
                  var x = h.charCodeAt(m);
                  255 < x &&
                    (Mc(q),
                      X("String has UTF-16 code units that do not fit in 8 bits"));
                  K[q + m] = x;
                }
              } else for (m = 0; m < t; ++m) K[q + m] = h[m];
              null !== f && f.push(Mc, n);
              return n;
            },
            argPackAdvance: 8,
            readValueFromPointer: Hb,
            ee: function (f) {
              Mc(f);
            },
          });
        },
        P: function (a, b, d) {
          d = ac(d);
          if (2 === b) {
            var f = Ya;
            var h = cb;
            var m = db;
            var t = () => Za;
            var n = 1;
          } else 4 === b && (f = eb, h = fb, m = jb, t = () => mb, n = 2);
          Rb(a, {
            name: d,
            fromWireType: function (q) {
              for (
                var x = mb[q >> 2], D = t(), I, M = q + 4, z = 0;
                z <= x;
                ++z
              ) {
                var N = q + 4 + z * b;
                if (z == x || 0 == D[N >> n]) {
                  M = f(M, N - M),
                    void 0 === I
                      ? I = M
                      : (I += String.fromCharCode(0), I += M),
                    M = N + b;
                }
              }
              Mc(q);
              return I;
            },
            toWireType: function (q, x) {
              "string" != typeof x &&
                X("Cannot pass non-string to C++ string type " + d);
              var D = m(x), I = Hd(4 + D + b);
              mb[I >> 2] = D >> n;
              h(x, I + 4, D + b);
              null !== q && q.push(Mc, I);
              return I;
            },
            argPackAdvance: 8,
            readValueFromPointer: Hb,
            ee: function (q) {
              Mc(q);
            },
          });
        },
        E: function (a, b, d, f, h, m) {
          Fb[a] = { name: ac(b), ff: Ic(d, f), le: Ic(h, m), rf: [] };
        },
        g: function (a, b, d, f, h, m, t, n, q, x) {
          Fb[a].rf.push({
            Kf: ac(b),
            Sf: d,
            Qf: Ic(f, h),
            Rf: m,
            fg: t,
            eg: Ic(n, q),
            gg: x,
          });
        },
        Ib: function (a, b) {
          b = ac(b);
          Rb(a, {
            Xf: !0,
            name: b,
            argPackAdvance: 0,
            fromWireType: function () {},
            toWireType: function () {},
          });
        },
        Fb: function () {
          return !0;
        },
        sb: function () {
          throw Infinity;
        },
        I: function (a, b, d) {
          a = Tc(a);
          b = Vc(b, "emval::as");
          var f = [], h = xc(f);
          mb[d >> 2] = h;
          return b.toWireType(f, a);
        },
        $: function (a, b, d, f, h) {
          a = $c[a];
          b = Tc(b);
          d = Zc(d);
          var m = [];
          mb[f >> 2] = xc(m);
          return a(b, d, m, h);
        },
        C: function (a, b, d, f) {
          a = $c[a];
          b = Tc(b);
          d = Zc(d);
          a(b, d, null, f);
        },
        f: Sc,
        L: function (a) {
          if (0 === a) return xc(ad());
          a = Zc(a);
          return xc(ad()[a]);
        },
        A: function (a, b) {
          var d = cd(a, b), f = d[0];
          b = f.name + "_$" + d.slice(1).map(function (t) {
            return t.name;
          }).join("_") +
            "$";
          var h = dd[b];
          if (void 0 !== h) return h;
          var m = Array(a - 1);
          h = bd((t, n, q, x) => {
            for (
              var D = 0, I = 0;
              I < a - 1;
              ++I
            ) {
              m[I] = d[I + 1].readValueFromPointer(x + D),
                D += d[I + 1].argPackAdvance;
            }
            t = t[n].apply(t, m);
            for (I = 0; I < a - 1; ++I) d[I + 1].Hf && d[I + 1].Hf(m[I]);
            if (!f.Xf) return f.toWireType(q, t);
          });
          return dd[b] = h;
        },
        H: function (a, b) {
          a = Tc(a);
          b = Tc(b);
          return xc(a[b]);
        },
        r: function (a) {
          4 < a && (Rc[a].gf += 1);
        },
        K: function (a, b, d, f) {
          a = Tc(a);
          var h = fd[b];
          h || (h = ed(b), fd[b] = h);
          return h(a, d, f);
        },
        N: function () {
          return xc([]);
        },
        i: function (a) {
          return xc(Zc(a));
        },
        G: function () {
          return xc({});
        },
        mb: function (a) {
          a = Tc(a);
          return !a;
        },
        F: function (a) {
          var b = Tc(a);
          Gb(b);
          Sc(a);
        },
        l: function (a, b, d) {
          a = Tc(a);
          b = Tc(b);
          d = Tc(d);
          a[b] = d;
        },
        j: function (a, b) {
          a = Vc(a, "_emval_take_value");
          a = a.readValueFromPointer(b);
          return xc(a);
        },
        ub: function () {
          return -52;
        },
        vb: function () {},
        a: function () {
          Qa("");
        },
        Eb: gd,
        bd: function (a) {
          Y.activeTexture(a);
        },
        cd: function (a, b) {
          Y.attachShader(nd[a], qd[b]);
        },
        ca: function (a, b, d) {
          Y.bindAttribLocation(nd[a], b, Wa(d));
        },
        da: function (a, b) {
          35051 == a ? Y.cf = b : 35052 == a && (Y.Ee = b);
          Y.bindBuffer(a, md[b]);
        },
        ba: function (a, b) {
          Y.bindFramebuffer(a, od[b]);
        },
        fc: function (a, b) {
          Y.bindRenderbuffer(a, pd[b]);
        },
        Rb: function (a, b) {
          Y.bindSampler(a, sd[b]);
        },
        ea: function (a, b) {
          Y.bindTexture(a, ja[b]);
        },
        Cc: function (a) {
          Y.bindVertexArray(rd[a]);
        },
        xc: function (a) {
          Y.bindVertexArray(rd[a]);
        },
        fa: function (a, b, d, f) {
          Y.blendColor(a, b, d, f);
        },
        ga: function (a) {
          Y.blendEquation(a);
        },
        ha: function (a, b) {
          Y.blendFunc(a, b);
        },
        $b: function (a, b, d, f, h, m, t, n, q, x) {
          Y.blitFramebuffer(a, b, d, f, h, m, t, n, q, x);
        },
        ia: function (a, b, d, f) {
          2 <= w.version
            ? d && b ? Y.bufferData(a, K, f, d, b) : Y.bufferData(a, b, f)
            : Y.bufferData(a, d ? K.subarray(d, d + b) : b, f);
        },
        ja: function (a, b, d, f) {
          2 <= w.version
            ? d && Y.bufferSubData(a, b, K, f, d)
            : Y.bufferSubData(a, b, K.subarray(f, f + d));
        },
        gc: function (a) {
          return Y.checkFramebufferStatus(a);
        },
        S: function (a) {
          Y.clear(a);
        },
        aa: function (a, b, d, f) {
          Y.clearColor(a, b, d, f);
        },
        W: function (a) {
          Y.clearStencil(a);
        },
        kb: function (a, b, d, f) {
          return Y.clientWaitSync(td[a], b, (d >>> 0) + 4294967296 * f);
        },
        ka: function (a, b, d, f) {
          Y.colorMask(!!a, !!b, !!d, !!f);
        },
        la: function (a) {
          Y.compileShader(qd[a]);
        },
        ma: function (a, b, d, f, h, m, t, n) {
          2 <=
              w.version
            ? Y.Ee || !t
              ? Y.compressedTexImage2D(a, b, d, f, h, m, t, n)
              : Y.compressedTexImage2D(a, b, d, f, h, m, K, n, t)
            : Y.compressedTexImage2D(
              a,
              b,
              d,
              f,
              h,
              m,
              n ? K.subarray(n, n + t) : null,
            );
        },
        na: function (a, b, d, f, h, m, t, n, q) {
          2 <= w.version
            ? Y.Ee || !n
              ? Y.compressedTexSubImage2D(a, b, d, f, h, m, t, n, q)
              : Y.compressedTexSubImage2D(a, b, d, f, h, m, t, K, q, n)
            : Y.compressedTexSubImage2D(
              a,
              b,
              d,
              f,
              h,
              m,
              t,
              q ? K.subarray(q, q + n) : null,
            );
        },
        Zb: function (a, b, d, f, h) {
          Y.copyBufferSubData(a, b, d, f, h);
        },
        oa: function (a, b, d, f, h, m, t, n) {
          Y.copyTexSubImage2D(a, b, d, f, h, m, t, n);
        },
        pa: function () {
          var a = ha(nd), b = Y.createProgram();
          b.name = a;
          b.We = b.Ue = b.Ve = 0;
          b.jf = 1;
          nd[a] = b;
          return a;
        },
        qa: function (a) {
          var b = ha(qd);
          qd[b] = Y.createShader(a);
          return b;
        },
        ra: function (a) {
          Y.cullFace(a);
        },
        sa: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2], h = md[f];
            h &&
              (Y.deleteBuffer(h),
                h.name = 0,
                md[f] = null,
                f == Y.cf && (Y.cf = 0),
                f == Y.Ee && (Y.Ee = 0));
          }
        },
        hc: function (a, b) {
          for (var d = 0; d < a; ++d) {
            var f = Q[b + 4 * d >> 2], h = od[f];
            h && (Y.deleteFramebuffer(h), h.name = 0, od[f] = null);
          }
        },
        ta: function (a) {
          if (a) {
            var b = nd[a];
            b ? (Y.deleteProgram(b), b.name = 0, nd[a] = null) : xd(1281);
          }
        },
        ic: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2], h = pd[f];
            h && (Y.deleteRenderbuffer(h), h.name = 0, pd[f] = null);
          }
        },
        Sb: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2], h = sd[f];
            h && (Y.deleteSampler(h), h.name = 0, sd[f] = null);
          }
        },
        ua: function (a) {
          if (a) {
            var b = qd[a];
            b ? (Y.deleteShader(b), qd[a] = null) : xd(1281);
          }
        },
        _b: function (a) {
          if (a) {
            var b = td[a];
            b ? (Y.deleteSync(b), b.name = 0, td[a] = null) : xd(1281);
          }
        },
        va: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2], h = ja[f];
            h && (Y.deleteTexture(h), h.name = 0, ja[f] = null);
          }
        },
        Dc: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2];
            Y.deleteVertexArray(rd[f]);
            rd[f] = null;
          }
        },
        yc: function (a, b) {
          for (var d = 0; d < a; d++) {
            var f = Q[b + 4 * d >> 2];
            Y.deleteVertexArray(rd[f]);
            rd[f] = null;
          }
        },
        wa: function (a) {
          Y.depthMask(!!a);
        },
        xa: function (a) {
          Y.disable(a);
        },
        ya: function (a) {
          Y.disableVertexAttribArray(a);
        },
        za: function (a, b, d) {
          Y.drawArrays(a, b, d);
        },
        Ac: function (a, b, d, f) {
          Y.drawArraysInstanced(a, b, d, f);
        },
        vc: function (a, b, d, f, h) {
          Y.pf.drawArraysInstancedBaseInstanceWEBGL(a, b, d, f, h);
        },
        tc: function (a, b) {
          for (
            var d = Dd[a],
              f = 0;
            f < a;
            f++
          ) {
            d[f] = Q[b + 4 * f >> 2];
          }
          Y.drawBuffers(d);
        },
        Aa: function (a, b, d, f) {
          Y.drawElements(a, b, d, f);
        },
        Bc: function (a, b, d, f, h) {
          Y.drawElementsInstanced(a, b, d, f, h);
        },
        wc: function (a, b, d, f, h, m, t) {
          Y.pf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            b,
            d,
            f,
            h,
            m,
            t,
          );
        },
        nc: function (a, b, d, f, h, m) {
          Y.drawElements(a, f, h, m);
        },
        Ba: function (a) {
          Y.enable(a);
        },
        Ca: function (a) {
          Y.enableVertexAttribArray(a);
        },
        Xb: function (a, b) {
          return (a = Y.fenceSync(a, b))
            ? (b = ha(td), a.name = b, td[b] = a, b)
            : 0;
        },
        Da: function () {
          Y.finish();
        },
        Ea: function () {
          Y.flush();
        },
        jc: function (a, b, d, f) {
          Y.framebufferRenderbuffer(a, b, d, pd[f]);
        },
        kc: function (a, b, d, f, h) {
          Y.framebufferTexture2D(a, b, d, ja[f], h);
        },
        Fa: function (a) {
          Y.frontFace(a);
        },
        Ga: function (a, b) {
          Ed(a, b, "createBuffer", md);
        },
        lc: function (a, b) {
          Ed(a, b, "createFramebuffer", od);
        },
        mc: function (a, b) {
          Ed(a, b, "createRenderbuffer", pd);
        },
        Tb: function (a, b) {
          Ed(a, b, "createSampler", sd);
        },
        Ha: function (a, b) {
          Ed(a, b, "createTexture", ja);
        },
        Ec: function (a, b) {
          Ed(a, b, "createVertexArray", rd);
        },
        zc: function (a, b) {
          Ed(a, b, "createVertexArray", rd);
        },
        bc: function (a) {
          Y.generateMipmap(a);
        },
        Ia: function (a, b, d) {
          d ? Q[d >> 2] = Y.getBufferParameter(a, b) : xd(1281);
        },
        Ja: function () {
          var a = Y.getError() || Ad;
          Ad = 0;
          return a;
        },
        Ka: function (a, b) {
          Fd(a, b, 2);
        },
        cc: function (a, b, d, f) {
          a = Y.getFramebufferAttachmentParameter(a, b, d);
          if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) {
            a = a.name | 0;
          }
          Q[f >> 2] = a;
        },
        M: function (a, b) {
          Fd(a, b, 0);
        },
        La: function (a, b, d, f) {
          a = Y.getProgramInfoLog(nd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? ra(a, K, f, b) : 0;
          d && (Q[d >> 2] = b);
        },
        Ma: function (a, b, d) {
          if (d) {
            if (a >= ld) xd(1281);
            else if (
              a = nd[a],
                35716 ==
                  b
            ) {
              a = Y.getProgramInfoLog(a),
                null === a && (a = "(unknown error)"),
                Q[d >> 2] = a.length + 1;
            } else if (35719 == b) {
              if (!a.We) {
                for (
                  b = 0;
                  b < Y.getProgramParameter(a, 35718);
                  ++b
                ) {
                  a.We = Math.max(
                    a.We,
                    Y.getActiveUniform(a, b).name.length + 1,
                  );
                }
              }
              Q[d >> 2] = a.We;
            } else if (35722 == b) {
              if (!a.Ue) {
                for (
                  b = 0;
                  b < Y.getProgramParameter(a, 35721);
                  ++b
                ) {
                  a.Ue = Math.max(
                    a.Ue,
                    Y.getActiveAttrib(a, b).name.length + 1,
                  );
                }
              }
              Q[d >> 2] = a.Ue;
            } else if (35381 == b) {
              if (!a.Ve) {
                for (
                  b = 0;
                  b < Y.getProgramParameter(a, 35382);
                  ++b
                ) {
                  a.Ve = Math.max(
                    a.Ve,
                    Y.getActiveUniformBlockName(a, b).length + 1,
                  );
                }
              }
              Q[
                d >>
                2
              ] = a.Ve;
            } else Q[d >> 2] = Y.getProgramParameter(a, b);
          } else xd(1281);
        },
        dc: function (a, b, d) {
          d ? Q[d >> 2] = Y.getRenderbufferParameter(a, b) : xd(1281);
        },
        Na: function (a, b, d, f) {
          a = Y.getShaderInfoLog(qd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? ra(a, K, f, b) : 0;
          d && (Q[d >> 2] = b);
        },
        Ob: function (a, b, d, f) {
          a = Y.getShaderPrecisionFormat(a, b);
          Q[d >> 2] = a.rangeMin;
          Q[d + 4 >> 2] = a.rangeMax;
          Q[f >> 2] = a.precision;
        },
        Oa: function (a, b, d) {
          d
            ? 35716 == b
              ? (a = Y.getShaderInfoLog(qd[a]),
                null === a && (a = "(unknown error)"),
                Q[d >> 2] = a ? a.length + 1 : 0)
              : 35720 == b
              ? (a = Y.getShaderSource(qd[a]), Q[d >> 2] = a ? a.length + 1 : 0)
              : Q[d >> 2] = Y.getShaderParameter(qd[a], b)
            : xd(1281);
        },
        R: function (a) {
          var b = ud[a];
          if (!b) {
            switch (a) {
              case 7939:
                b = Y.getSupportedExtensions() || [];
                b = b.concat(b.map(function (f) {
                  return "GL_" + f;
                }));
                b = Gd(b.join(" "));
                break;
              case 7936:
              case 7937:
              case 37445:
              case 37446:
                (b = Y.getParameter(a)) || xd(1280);
                b = b && Gd(b);
                break;
              case 7938:
                b = Y.getParameter(7938);
                b = 2 <= w.version
                  ? "OpenGL ES 3.0 (" + b + ")"
                  : "OpenGL ES 2.0 (" + b + ")";
                b = Gd(b);
                break;
              case 35724:
                b = Y.getParameter(35724);
                var d = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                null !== d &&
                  (3 == d[1].length && (d[1] += "0"),
                    b = "OpenGL ES GLSL ES " + d[1] + " (" + b + ")");
                b = Gd(b);
                break;
              default:
                xd(1280);
            }
            ud[a] = b;
          }
          return b;
        },
        jb: function (a, b) {
          if (2 > w.version) return xd(1282), 0;
          var d = vd[a];
          if (d) return 0 > b || b >= d.length ? (xd(1281), 0) : d[b];
          switch (a) {
            case 7939:
              return d = Y.getSupportedExtensions() || [],
                d = d.concat(d.map(function (f) {
                  return "GL_" + f;
                })),
                d = d.map(function (f) {
                  return Gd(f);
                }),
                d = vd[a] = d,
                0 > b || b >= d.length ? (xd(1281), 0) : d[b];
            default:
              return xd(1280), 0;
          }
        },
        Pa: function (a, b) {
          b = Wa(b);
          if (a = nd[a]) {
            var d = a, f = d.Ne, h = d.wf, m;
            if (!f) {
              for (
                d.Ne = f = {}, d.vf = {}, m = 0;
                m < Y.getProgramParameter(d, 35718);
                ++m
              ) {
                var t = Y.getActiveUniform(d, m);
                var n = t.name;
                t = t.size;
                var q = Id(n);
                q = 0 < q ? n.slice(0, q) : n;
                var x = d.jf;
                d.jf += t;
                h[q] = [t, x];
                for (n = 0; n < t; ++n) f[x] = n, d.vf[x++] = q;
              }
            }
            d = a.Ne;
            f = 0;
            h = b;
            m = Id(b);
            0 < m && (f = parseInt(b.slice(m + 1)) >>> 0, h = b.slice(0, m));
            if (
              (h = a.wf[h]) && f < h[0] &&
              (f += h[1], d[f] = d[f] || Y.getUniformLocation(a, b))
            ) {
              return f;
            }
          } else xd(1281);
          return -1;
        },
        Pb: function (a, b, d) {
          for (var f = Dd[b], h = 0; h < b; h++) f[h] = Q[d + 4 * h >> 2];
          Y.invalidateFramebuffer(a, f);
        },
        Qb: function (a, b, d, f, h, m, t) {
          for (var n = Dd[b], q = 0; q < b; q++) n[q] = Q[d + 4 * q >> 2];
          Y.invalidateSubFramebuffer(a, n, f, h, m, t);
        },
        Yb: function (a) {
          return Y.isSync(td[a]);
        },
        Qa: function (a) {
          return (a = ja[a]) ? Y.isTexture(a) : 0;
        },
        Ra: function (a) {
          Y.lineWidth(a);
        },
        Sa: function (a) {
          a = nd[a];
          Y.linkProgram(a);
          a.Ne = 0;
          a.wf = {};
        },
        rc: function (a, b, d, f, h, m) {
          Y.tf.multiDrawArraysInstancedBaseInstanceWEBGL(
            a,
            Q,
            b >> 2,
            Q,
            d >> 2,
            Q,
            f >> 2,
            mb,
            h >> 2,
            m,
          );
        },
        sc: function (a, b, d, f, h, m, t, n) {
          Y.tf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            Q,
            b >> 2,
            d,
            Q,
            f >> 2,
            Q,
            h >> 2,
            Q,
            m >> 2,
            mb,
            t >> 2,
            n,
          );
        },
        Ta: function (a, b) {
          3317 == a && (wd = b);
          Y.pixelStorei(a, b);
        },
        uc: function (a) {
          Y.readBuffer(a);
        },
        Ua: function (a, b, d, f, h, m, t) {
          if (2 <= w.version) {
            if (Y.cf) Y.readPixels(a, b, d, f, h, m, t);
            else {
              var n = Jd(m);
              Y.readPixels(
                a,
                b,
                d,
                f,
                h,
                m,
                n,
                t >> 31 - Math.clz32(n.BYTES_PER_ELEMENT),
              );
            }
          } else {
            (t = Kd(m, h, d, f, t))
              ? Y.readPixels(a, b, d, f, h, m, t)
              : xd(1280);
          }
        },
        ec: function (a, b, d, f) {
          Y.renderbufferStorage(a, b, d, f);
        },
        ac: function (a, b, d, f, h) {
          Y.renderbufferStorageMultisample(a, b, d, f, h);
        },
        Ub: function (a, b, d) {
          Y.samplerParameterf(sd[a], b, d);
        },
        Vb: function (a, b, d) {
          Y.samplerParameteri(sd[a], b, d);
        },
        Wb: function (a, b, d) {
          Y.samplerParameteri(sd[a], b, Q[d >> 2]);
        },
        Va: function (a, b, d, f) {
          Y.scissor(a, b, d, f);
        },
        Wa: function (a, b, d, f) {
          for (var h = "", m = 0; m < b; ++m) {
            var t = f ? Q[f + 4 * m >> 2] : -1;
            h += Wa(Q[d + 4 * m >> 2], 0 > t ? void 0 : t);
          }
          Y.shaderSource(qd[a], h);
        },
        Xa: function (a, b, d) {
          Y.stencilFunc(a, b, d);
        },
        Ya: function (a, b, d, f) {
          Y.stencilFuncSeparate(a, b, d, f);
        },
        Za: function (a) {
          Y.stencilMask(a);
        },
        _a: function (a, b) {
          Y.stencilMaskSeparate(a, b);
        },
        $a: function (a, b, d) {
          Y.stencilOp(a, b, d);
        },
        ab: function (a, b, d, f) {
          Y.stencilOpSeparate(a, b, d, f);
        },
        bb: function (a, b, d, f, h, m, t, n, q) {
          if (2 <= w.version) {
            if (Y.Ee) {
              Y.texImage2D(a, b, d, f, h, m, t, n, q);
            } else if (q) {
              var x = Jd(n);
              Y.texImage2D(
                a,
                b,
                d,
                f,
                h,
                m,
                t,
                n,
                x,
                q >> 31 - Math.clz32(x.BYTES_PER_ELEMENT),
              );
            } else Y.texImage2D(a, b, d, f, h, m, t, n, null);
          } else {
            Y
              .texImage2D(
                a,
                b,
                d,
                f,
                h,
                m,
                t,
                n,
                q ? Kd(n, t, f, h, q) : null,
              );
          }
        },
        cb: function (a, b, d) {
          Y.texParameterf(a, b, d);
        },
        db: function (a, b, d) {
          Y.texParameterf(a, b, U[d >> 2]);
        },
        eb: function (a, b, d) {
          Y.texParameteri(a, b, d);
        },
        fb: function (a, b, d) {
          Y.texParameteri(a, b, Q[d >> 2]);
        },
        oc: function (a, b, d, f, h) {
          Y.texStorage2D(a, b, d, f, h);
        },
        gb: function (a, b, d, f, h, m, t, n, q) {
          if (2 <= w.version) {
            if (Y.Ee) {
              Y.texSubImage2D(a, b, d, f, h, m, t, n, q);
            } else if (q) {
              var x = Jd(n);
              Y.texSubImage2D(
                a,
                b,
                d,
                f,
                h,
                m,
                t,
                n,
                x,
                q >> 31 - Math.clz32(x.BYTES_PER_ELEMENT),
              );
            } else {
              Y.texSubImage2D(a, b, d, f, h, m, t, n, null);
            }
          } else {
            x = null,
              q && (x = Kd(n, t, h, m, q)),
              Y.texSubImage2D(a, b, d, f, h, m, t, n, x);
          }
        },
        hb: function (a, b) {
          Y.uniform1f(Z(a), b);
        },
        ib: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform1fv(Z(a), U, d >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Ld[b - 1], h = 0; h < b; ++h) {
                f[h] = U[d + 4 * h >> 2];
              }
            } else {
              f = U.subarray(d >> 2, d + 4 * b >> 2);
            }
            Y.uniform1fv(Z(a), f);
          }
        },
        Zc: function (a, b) {
          Y.uniform1i(Z(a), b);
        },
        _c: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform1iv(Z(a), Q, d >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Md[b - 1], h = 0; h < b; ++h) {
                f[h] = Q[d + 4 * h >> 2];
              }
            } else {
              f = Q.subarray(d >> 2, d + 4 * b >> 2);
            }
            Y.uniform1iv(Z(a), f);
          }
        },
        $c: function (a, b, d) {
          Y.uniform2f(Z(a), b, d);
        },
        ad: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform2fv(Z(a), U, d >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (
                var f = Ld[2 * b - 1], h = 0;
                h < 2 * b;
                h += 2
              ) {
                f[h] = U[d + 4 * h >> 2], f[h + 1] = U[d + (4 * h + 4) >> 2];
              }
            } else {
              f = U.subarray(
                d >> 2,
                d + 8 * b >>
                  2,
              );
            }
            Y.uniform2fv(Z(a), f);
          }
        },
        Yc: function (a, b, d) {
          Y.uniform2i(Z(a), b, d);
        },
        Xc: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform2iv(Z(a), Q, d >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (
                var f = Md[2 * b - 1], h = 0;
                h < 2 * b;
                h += 2
              ) {
                f[h] = Q[d + 4 * h >> 2], f[h + 1] = Q[d + (4 * h + 4) >> 2];
              }
            } else f = Q.subarray(d >> 2, d + 8 * b >> 2);
            Y.uniform2iv(Z(a), f);
          }
        },
        Wc: function (a, b, d, f) {
          Y.uniform3f(Z(a), b, d, f);
        },
        Vc: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform3fv(Z(a), U, d >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (
                var f = Ld[3 * b - 1], h = 0;
                h < 3 * b;
                h += 3
              ) {
                f[h] = U[d + 4 * h >> 2],
                  f[h + 1] = U[d + (4 * h + 4) >> 2],
                  f[h + 2] = U[
                    d + (4 * h +
                        8) >> 2
                  ];
              }
            } else f = U.subarray(d >> 2, d + 12 * b >> 2);
            Y.uniform3fv(Z(a), f);
          }
        },
        Uc: function (a, b, d, f) {
          Y.uniform3i(Z(a), b, d, f);
        },
        Tc: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform3iv(Z(a), Q, d >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (
                var f = Md[3 * b - 1], h = 0;
                h < 3 * b;
                h += 3
              ) {
                f[h] = Q[d + 4 * h >> 2],
                  f[h + 1] = Q[d + (4 * h + 4) >> 2],
                  f[h + 2] = Q[d + (4 * h + 8) >> 2];
              }
            } else f = Q.subarray(d >> 2, d + 12 * b >> 2);
            Y.uniform3iv(Z(a), f);
          }
        },
        Sc: function (a, b, d, f, h) {
          Y.uniform4f(Z(a), b, d, f, h);
        },
        Rc: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform4fv(Z(a), U, d >> 2, 4 * b);
          else {
            if (72 >= b) {
              var f = Ld[4 * b - 1], h = U;
              d >>= 2;
              for (var m = 0; m < 4 * b; m += 4) {
                var t = d + m;
                f[m] = h[t];
                f[m + 1] = h[t + 1];
                f[m + 2] = h[t + 2];
                f[m + 3] = h[t + 3];
              }
            } else f = U.subarray(d >> 2, d + 16 * b >> 2);
            Y.uniform4fv(Z(a), f);
          }
        },
        Fc: function (a, b, d, f, h) {
          Y.uniform4i(Z(a), b, d, f, h);
        },
        Gc: function (a, b, d) {
          if (2 <= w.version) b && Y.uniform4iv(Z(a), Q, d >> 2, 4 * b);
          else {
            if (72 >= b) {
              for (
                var f = Md[4 * b - 1], h = 0;
                h < 4 * b;
                h += 4
              ) {
                f[h] = Q[d + 4 * h >> 2],
                  f[h + 1] = Q[d + (4 * h + 4) >> 2],
                  f[h + 2] = Q[d + (4 * h + 8) >> 2],
                  f[h + 3] = Q[d + (4 * h + 12) >> 2];
              }
            } else f = Q.subarray(d >> 2, d + 16 * b >> 2);
            Y.uniform4iv(Z(a), f);
          }
        },
        Hc: function (a, b, d, f) {
          if (2 <= w.version) {
            b &&
              Y.uniformMatrix2fv(Z(a), !!d, U, f >> 2, 4 * b);
          } else {
            if (72 >= b) {
              for (
                var h = Ld[4 * b - 1], m = 0;
                m < 4 * b;
                m += 4
              ) {
                h[m] = U[f + 4 * m >> 2],
                  h[m + 1] = U[f + (4 * m + 4) >> 2],
                  h[m + 2] = U[f + (4 * m + 8) >> 2],
                  h[m + 3] = U[f + (4 * m + 12) >> 2];
              }
            } else h = U.subarray(f >> 2, f + 16 * b >> 2);
            Y.uniformMatrix2fv(Z(a), !!d, h);
          }
        },
        Ic: function (a, b, d, f) {
          if (2 <= w.version) {
            b &&
              Y.uniformMatrix3fv(Z(a), !!d, U, f >> 2, 9 * b);
          } else {
            if (32 >= b) {
              for (
                var h = Ld[9 * b - 1], m = 0;
                m < 9 * b;
                m += 9
              ) {
                h[m] = U[f + 4 * m >> 2],
                  h[m + 1] = U[f + (4 * m + 4) >> 2],
                  h[m + 2] = U[f + (4 * m + 8) >> 2],
                  h[m + 3] = U[f + (4 * m + 12) >> 2],
                  h[m + 4] = U[f + (4 * m + 16) >> 2],
                  h[m + 5] = U[f + (4 * m + 20) >> 2],
                  h[m + 6] = U[
                    f + (4 * m + 24) >>
                    2
                  ],
                  h[m + 7] = U[f + (4 * m + 28) >> 2],
                  h[m + 8] = U[f + (4 * m + 32) >> 2];
              }
            } else h = U.subarray(f >> 2, f + 36 * b >> 2);
            Y.uniformMatrix3fv(Z(a), !!d, h);
          }
        },
        Jc: function (a, b, d, f) {
          if (2 <= w.version) {
            b &&
              Y.uniformMatrix4fv(Z(a), !!d, U, f >> 2, 16 * b);
          } else {
            if (18 >= b) {
              var h = Ld[16 * b - 1], m = U;
              f >>= 2;
              for (var t = 0; t < 16 * b; t += 16) {
                var n = f + t;
                h[t] = m[n];
                h[t + 1] = m[n + 1];
                h[t + 2] = m[n + 2];
                h[t + 3] = m[n + 3];
                h[t + 4] = m[n + 4];
                h[t + 5] = m[n + 5];
                h[t + 6] = m[n + 6];
                h[t + 7] = m[n + 7];
                h[t + 8] = m[n + 8];
                h[t + 9] = m[n + 9];
                h[t + 10] = m[n + 10];
                h[t + 11] = m[n + 11];
                h[t + 12] = m[n + 12];
                h[t + 13] = m[n + 13];
                h[t + 14] = m[n + 14];
                h[t + 15] = m[n + 15];
              }
            } else h = U.subarray(f >> 2, f + 64 * b >> 2);
            Y.uniformMatrix4fv(Z(a), !!d, h);
          }
        },
        Kc: function (a) {
          a = nd[a];
          Y.useProgram(a);
          Y.Gf = a;
        },
        Lc: function (a, b) {
          Y.vertexAttrib1f(a, b);
        },
        Mc: function (a, b) {
          Y.vertexAttrib2f(a, U[b >> 2], U[b + 4 >> 2]);
        },
        Nc: function (a, b) {
          Y.vertexAttrib3f(a, U[b >> 2], U[b + 4 >> 2], U[b + 8 >> 2]);
        },
        Oc: function (a, b) {
          Y.vertexAttrib4f(
            a,
            U[b >> 2],
            U[b + 4 >> 2],
            U[b + 8 >> 2],
            U[b + 12 >> 2],
          );
        },
        pc: function (a, b) {
          Y.vertexAttribDivisor(a, b);
        },
        qc: function (a, b, d, f, h) {
          Y.vertexAttribIPointer(a, b, d, f, h);
        },
        Pc: function (a, b, d, f, h, m) {
          Y.vertexAttribPointer(a, b, d, !!f, h, m);
        },
        Qc: function (a, b, d, f) {
          Y.viewport(a, b, d, f);
        },
        lb: function (a, b, d, f) {
          Y.waitSync(td[a], b, (d >>> 0) + 4294967296 * f);
        },
        tb: function (a) {
          var b = K.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var d = 1; 4 >= d; d *= 2) {
            var f = b * (1 + .2 / d);
            f = Math.min(f, a + 100663296);
            var h = Math;
            f = Math.max(a, f);
            h = h.min.call(h, 2147483648, f + (65536 - f % 65536) % 65536);
            a: {
              try {
                Ra.grow(h - kb.byteLength + 65535 >>> 16);
                ob();
                var m = 1;
                break a;
              } catch (t) {}
              m = void 0;
            }
            if (m) return !0;
          }
          return !1;
        },
        nb: function () {
          return w ? w.Uf : 0;
        },
        wb: function (a, b) {
          var d = 0;
          Od().forEach(function (f, h) {
            var m = b + d;
            h = mb[a + 4 * h >> 2] = m;
            for (m = 0; m < f.length; ++m) lb[h++ >> 0] = f.charCodeAt(m);
            lb[h >> 0] = 0;
            d += f.length + 1;
          });
          return 0;
        },
        xb: function (a, b) {
          var d = Od();
          mb[a >> 2] = d.length;
          var f = 0;
          d.forEach(function (h) {
            f += h.length + 1;
          });
          mb[b >> 2] = f;
          return 0;
        },
        Jb: function (a) {
          if (!noExitRuntime) {
            if (v.onExit) v.onExit(a);
            Sa = !0;
          }
          wa(a, new Ja(a));
        },
        O: function () {
          return 52;
        },
        ob: function () {
          return 52;
        },
        Cb: function () {
          return 52;
        },
        pb: function () {
          return 70;
        },
        T: function (a, b, d, f) {
          for (var h = 0, m = 0; m < d; m++) {
            var t = mb[b >> 2], n = mb[b + 4 >> 2];
            b += 8;
            for (
              var q = 0;
              q <
                n;
              q++
            ) {
              var x = K[t + q], D = Qd[a];
              0 === x || 10 === x
                ? ((1 === a ? La : Ka)(Va(D, 0)), D.length = 0)
                : D.push(x);
            }
            h += n;
          }
          mb[f >> 2] = h;
          return 0;
        },
        c: function () {
          return Ma;
        },
        m: ae,
        s: be,
        k: ce,
        J: de,
        Nb: ee,
        _: fe,
        Z: ge,
        Q: he,
        q: ie,
        y: je,
        o: ke,
        v: le,
        Mb: me,
        Kb: ne,
        Lb: oe,
        d: function (a) {
          Ma = a;
        },
        rb: function (a, b, d, f) {
          return Ud(a, b, d, f);
        },
      };
      (function () {
        function a(h) {
          v.asm = h.exports;
          Ra = v.asm.dd;
          ob();
          pb = v.asm.fd;
          rb.unshift(v.asm.ed);
          ub--;
          v.monitorRunDependencies && v.monitorRunDependencies(ub);
          0 == ub &&
            (null !== vb && (clearInterval(vb), vb = null),
              wb && (h = wb, wb = null, h()));
        }
        function b(h) {
          a(h.instance);
        }
        function d(h) {
          return Cb().then(function (m) {
            return WebAssembly.instantiate(wasmBuff, f);
          }).then(function (m) {
            return m;
          }).then(h, function (m) {
            Ka("failed to asynchronously prepare wasm: " + m);
            Qa(m);
          });
        }
        var f = { a: pe };
        ub++;
        v.monitorRunDependencies && v.monitorRunDependencies(ub);
        if (v.instantiateWasm) {
          try {
            return v.instantiateWasm(f, a);
          } catch (h) {
            return Ka(
              "Module.instantiateWasm callback failed with error: " + h,
            ),
              !1;
          }
        }
        (function () {
          return Na || "function" != typeof WebAssembly.instantiateStreaming ||
              yb() || zb.startsWith("file://") || za ||
              "function" != typeof fetch
            ? d(b)
            : Promise.resolve().then(function (h) {
              return WebAssembly.instantiate(wasmBuff, f).then(
                b,
                function (m) {
                  Ka("wasm streaming compile failed: " + m);
                  Ka("falling back to ArrayBuffer instantiation");
                  return d(b);
                },
              );
            });
        })().catch(ea);
        return {};
      })();
      v.___wasm_call_ctors = function () {
        return (v.___wasm_call_ctors = v.asm.ed).apply(null, arguments);
      };
      var Mc = v._free = function () {
          return (Mc = v._free = v.asm.gd).apply(null, arguments);
        },
        Hd = v._malloc = function () {
          return (Hd = v._malloc = v.asm.hd).apply(null, arguments);
        },
        Lc = v.___getTypeName = function () {
          return (Lc = v.___getTypeName = v.asm.id).apply(null, arguments);
        };
      v.___embind_register_native_and_builtin_types = function () {
        return (v.___embind_register_native_and_builtin_types = v.asm.jd).apply(
          null,
          arguments,
        );
      };
      var qe = v._setThrew = function () {
          return (qe = v._setThrew = v.asm.kd).apply(null, arguments);
        },
        re = v.stackSave = function () {
          return (re = v.stackSave = v.asm.ld).apply(null, arguments);
        },
        se = v.stackRestore = function () {
          return (se = v.stackRestore = v.asm.md).apply(null, arguments);
        };
      v.dynCall_viji = function () {
        return (v.dynCall_viji = v.asm.nd).apply(null, arguments);
      };
      v.dynCall_vijiii = function () {
        return (v.dynCall_vijiii = v.asm.od).apply(null, arguments);
      };
      v.dynCall_viiiiij = function () {
        return (v.dynCall_viiiiij = v.asm.pd).apply(null, arguments);
      };
      v.dynCall_jiiiijiiiii = function () {
        return (v.dynCall_jiiiijiiiii = v.asm.qd).apply(null, arguments);
      };
      v.dynCall_viiij = function () {
        return (v.dynCall_viiij = v.asm.rd).apply(null, arguments);
      };
      v.dynCall_jii = function () {
        return (v.dynCall_jii = v.asm.sd).apply(null, arguments);
      };
      v.dynCall_vij = function () {
        return (v.dynCall_vij = v.asm.td).apply(null, arguments);
      };
      v.dynCall_iiij = function () {
        return (v.dynCall_iiij = v.asm.ud).apply(null, arguments);
      };
      v.dynCall_iiiij = function () {
        return (v.dynCall_iiiij = v.asm.vd).apply(null, arguments);
      };
      v.dynCall_viij = function () {
        return (v.dynCall_viij = v.asm.wd).apply(null, arguments);
      };
      v.dynCall_ji = function () {
        return (v.dynCall_ji = v.asm.xd).apply(null, arguments);
      };
      v.dynCall_iij = function () {
        return (v.dynCall_iij = v.asm.yd).apply(null, arguments);
      };
      v.dynCall_jiiiiii = function () {
        return (v.dynCall_jiiiiii = v.asm.zd).apply(null, arguments);
      };
      v.dynCall_jiiiiji = function () {
        return (v.dynCall_jiiiiji = v.asm.Ad).apply(null, arguments);
      };
      v.dynCall_iijj = function () {
        return (v.dynCall_iijj = v.asm.Bd).apply(null, arguments);
      };
      v.dynCall_iiiji = function () {
        return (v.dynCall_iiiji = v.asm.Cd).apply(null, arguments);
      };
      v.dynCall_iiji = function () {
        return (v.dynCall_iiji = v.asm.Dd).apply(null, arguments);
      };
      v.dynCall_iijjiii = function () {
        return (v.dynCall_iijjiii = v.asm.Ed).apply(null, arguments);
      };
      v.dynCall_vijjjii = function () {
        return (v.dynCall_vijjjii = v.asm.Fd).apply(null, arguments);
      };
      v.dynCall_jiji = function () {
        return (v.dynCall_jiji = v.asm.Gd).apply(null, arguments);
      };
      v.dynCall_viijii = function () {
        return (v.dynCall_viijii = v.asm.Hd).apply(null, arguments);
      };
      v.dynCall_iiiiij = function () {
        return (v.dynCall_iiiiij = v.asm.Id).apply(null, arguments);
      };
      v.dynCall_iiiiijj = function () {
        return (v.dynCall_iiiiijj = v.asm.Jd).apply(null, arguments);
      };
      v.dynCall_iiiiiijj = function () {
        return (v.dynCall_iiiiiijj = v.asm.Kd).apply(null, arguments);
      };
      function ae(a, b) {
        var d = re();
        try {
          return Eb(a)(b);
        } catch (f) {
          se(d);
          if (f !== f + 0) throw f;
          qe(1, 0);
        }
      }
      function be(a, b, d) {
        var f = re();
        try {
          return Eb(a)(b, d);
        } catch (h) {
          se(f);
          if (h !== h + 0) throw h;
          qe(1, 0);
        }
      }
      function ke(a, b, d, f) {
        var h = re();
        try {
          Eb(a)(b, d, f);
        } catch (m) {
          se(h);
          if (m !== m + 0) throw m;
          qe(1, 0);
        }
      }
      function ce(a, b, d, f) {
        var h = re();
        try {
          return Eb(a)(b, d, f);
        } catch (m) {
          se(h);
          if (m !== m + 0) throw m;
          qe(1, 0);
        }
      }
      function ie(a, b) {
        var d = re();
        try {
          Eb(a)(b);
        } catch (f) {
          se(d);
          if (f !== f + 0) throw f;
          qe(1, 0);
        }
      }
      function ee(a, b, d, f, h, m) {
        var t = re();
        try {
          return Eb(a)(b, d, f, h, m);
        } catch (n) {
          se(t);
          if (n !== n + 0) throw n;
          qe(1, 0);
        }
      }
      function le(a, b, d, f, h) {
        var m = re();
        try {
          Eb(a)(b, d, f, h);
        } catch (t) {
          se(m);
          if (t !== t + 0) throw t;
          qe(1, 0);
        }
      }
      function fe(a, b, d, f, h, m, t) {
        var n = re();
        try {
          return Eb(a)(b, d, f, h, m, t);
        } catch (q) {
          se(n);
          if (q !== q + 0) throw q;
          qe(1, 0);
        }
      }
      function de(a, b, d, f, h) {
        var m = re();
        try {
          return Eb(a)(b, d, f, h);
        } catch (t) {
          se(m);
          if (t !== t + 0) throw t;
          qe(1, 0);
        }
      }
      function me(a, b, d, f, h, m) {
        var t = re();
        try {
          Eb(a)(b, d, f, h, m);
        } catch (n) {
          se(t);
          if (n !== n + 0) throw n;
          qe(1, 0);
        }
      }
      function je(a, b, d) {
        var f = re();
        try {
          Eb(a)(b, d);
        } catch (h) {
          se(f);
          if (h !== h + 0) throw h;
          qe(1, 0);
        }
      }
      function oe(a, b, d, f, h, m, t, n, q, x) {
        var D = re();
        try {
          Eb(a)(b, d, f, h, m, t, n, q, x);
        } catch (I) {
          se(D);
          if (I !== I + 0) throw I;
          qe(1, 0);
        }
      }
      function he(a) {
        var b = re();
        try {
          Eb(a)();
        } catch (d) {
          se(b);
          if (d !== d + 0) throw d;
          qe(1, 0);
        }
      }
      function ne(a, b, d, f, h, m, t) {
        var n = re();
        try {
          Eb(a)(b, d, f, h, m, t);
        } catch (q) {
          se(n);
          if (q !== q + 0) throw q;
          qe(1, 0);
        }
      }
      function ge(a, b, d, f, h, m, t, n, q, x) {
        var D = re();
        try {
          return Eb(a)(b, d, f, h, m, t, n, q, x);
        } catch (I) {
          se(D);
          if (I !== I + 0) throw I;
          qe(1, 0);
        }
      }
      var te;
      function Ja(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a;
      }
      wb = function ue() {
        te || ve();
        te || (wb = ue);
      };
      function ve() {
        function a() {
          if (!te && (te = !0, v.calledRun = !0, !Sa)) {
            Db(rb);
            da(v);
            if (v.onRuntimeInitialized) v.onRuntimeInitialized();
            if (v.postRun) {
              for (
                "function" == typeof v.postRun && (v.postRun = [v.postRun]);
                v.postRun.length;
              ) {
                var b = v.postRun.shift();
                sb.unshift(b);
              }
            }
            Db(sb);
          }
        }
        if (!(0 < ub)) {
          if (v.preRun) {
            for (
              "function" == typeof v.preRun && (v.preRun = [v.preRun]);
              v.preRun.length;
            ) {
              tb();
            }
          }
          Db(qb);
          0 < ub ||
            (v.setStatus
              ? (v.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    v.setStatus("");
                  }, 1);
                  a();
                }, 1))
              : a());
        }
      }
      v.run = ve;
      if (v.preInit) {
        for (
          "function" == typeof v.preInit && (v.preInit = [v.preInit]);
          0 < v.preInit.length;
        ) {
          v.preInit.pop()();
        }
      }
      ve();

      return CanvasKitInit.ready;
    }
  );
})();
