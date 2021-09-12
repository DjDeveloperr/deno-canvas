import { encodeBase64 } from "./base64.ts";
import { WASM_BUFFER as wasmBuff } from "./wasm.js";
import { hslToRgb } from "./color_util.ts";

let document = { getElementById: () => undefined };

function maybeHSL(k) {
  if (typeof k === "string") {
    const match = k.match(/^hsla?\((\d+), *(\d+)%, *(\d+)%(, *([\d\.]+))?\)$/);

    if (match !== null) {
      const h = Number(match[1]);
      const s = Number(match[2]);
      const l = Number(match[3]);
      const a = k.startsWith("hsla") && match[5] ? Number(match[5]) : undefined;

      k = "rgb";
      if (a !== undefined) {
        k += "a";
      }
      k += "(";

      const [r, g, b] = hslToRgb(h, s, l);
      k += r + ", ";
      k += g + ", ";
      k += b;

      if (a !== undefined) {
        k += ", " + a;
      }

      k += ")";
    }
  }

  return k;
}

export var CanvasKitInit = (function () {
  var _scriptDir = typeof document !== "undefined" && document.currentScript
    ? document.currentScript.src
    : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return (
    function (CanvasKitInit) {
      CanvasKitInit = CanvasKitInit || {};

      null;
      var r;
      r || (r = typeof CanvasKitInit !== "undefined" ? CanvasKitInit : {});
      var ca, ea;
      r.ready = new Promise(function (a, b) {
        ca = a;
        ea = b;
      });
      (function (a) {
        a.Zd = a.Zd || [];
        a.Zd.push(function () {
          a.MakeSWCanvasSurface = function (b) {
            var c = b;
            if (
              "CANVAS" !== c.tagName && (c = document.getElementById(b), !c)
            ) {
              throw "Canvas with id " + b + " was not found";
            }
            if (b = a.MakeSurface(c.width, c.height)) b.Sd = c;
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
              g = b * c * 4,
              l = a._malloc(g);
            if (f = a.Surface._makeRasterDirect(f, l, 4 * b)) {
              f.Sd = null,
                f.Gf = b,
                f.Df = c,
                f.Ff = g,
                f.ff = l,
                f.getCanvas().clear(a.TRANSPARENT);
            }
            return f;
          };
          a.MakeRasterDirectSurface = function (b, c, f) {
            return a.Surface._makeRasterDirect(b, c.byteOffset, f);
          };
          a.Surface.prototype.flush = function (b) {
            this._flush();
            if (this.Sd) {
              var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.ff, this.Ff);
              c = new ImageData(c, this.Gf, this.Df);
              b
                ? this.Sd.getContext("2d").putImageData(
                  c,
                  0,
                  0,
                  b[0],
                  b[1],
                  b[2] - b[0],
                  b[3] - b[1],
                )
                : this.Sd.getContext("2d").putImageData(c, 0, 0);
            }
          };
          a.Surface.prototype.dispose = function () {
            this.ff &&
              a._free(this.ff);
            this.delete();
          };
          a.currentContext = a.currentContext || function () {};
          a.setCurrentContext = a.setCurrentContext || function () {};
        });
      })(r);
      (function (a) {
        a.Zd = a.Zd || [];
        a.Zd.push(function () {
          function b(c, f, g) {
            return c && c.hasOwnProperty(f) ? c[f] : g;
          }
          a.GetWebGLContext = function (c, f) {
            if (!c) throw "null canvas passed into makeWebGLContext";
            var g = {
              alpha: b(f, "alpha", 1),
              depth: b(f, "depth", 1),
              stencil: b(f, "stencil", 8),
              antialias: b(f, "antialias", 0),
              premultipliedAlpha: b(f, "premultipliedAlpha", 1),
              preserveDrawingBuffer: b(f, "preserveDrawingBuffer", 0),
              preferLowPowerToHighPerformance: b(
                f,
                "preferLowPowerToHighPerformance",
                0,
              ),
              failIfMajorPerformanceCaveat: b(
                f,
                "failIfMajorPerformanceCaveat",
                0,
              ),
              enableExtensionsByDefault: b(f, "enableExtensionsByDefault", 1),
              explicitSwapControl: b(f, "explicitSwapControl", 0),
              renderViaOffscreenBackBuffer: b(
                f,
                "renderViaOffscreenBackBuffer",
                0,
              ),
            };
            g.majorVersion = f && f.majorVersion
              ? f.majorVersion
              : "undefined" !== typeof WebGL2RenderingContext
              ? 2
              : 1;
            if (g.explicitSwapControl) {
              throw "explicitSwapControl is not supported";
            }
            c = ha(c, g);
            if (!c) return 0;
            ia(c);
            return c;
          };
          a.deleteContext = function (c) {
            v === ma[c] && (v = null);
            "object" === typeof JSEvents && JSEvents.Kg(ma[c].qe.canvas);
            ma[c] && ma[c].qe.canvas &&
              (ma[c].qe.canvas.qf = void 0);
            ma[c] = null;
          };
          a._setTextureCleanup({
            deleteTexture: function (c, f) {
              var g = na[f];
              g && ma[c].qe.deleteTexture(g);
              na[f] = null;
            },
          });
          a.MakeWebGLCanvasSurface = function (c, f, g) {
            f = f || null;
            var l = c,
              p = "undefined" !== typeof OffscreenCanvas &&
                l instanceof OffscreenCanvas;
            if (
              !("undefined" !== typeof HTMLCanvasElement &&
                  l instanceof HTMLCanvasElement ||
                p || (l = document.getElementById(c), l))
            ) {
              throw "Canvas with id " + c + " was not found";
            }
            c = this.GetWebGLContext(l, g);
            if (!c || 0 > c) {
              throw "failed to create webgl context: err " +
                c;
            }
            g = this.MakeGrContext(c);
            f = this.MakeOnScreenGLSurface(g, l.width, l.height, f);
            if (!f) {
              return f = l.cloneNode(!0),
                l.parentNode.replaceChild(f, l),
                f.classList.add("ck-replaced"),
                a.MakeSWCanvasSurface(f);
            }
            f.re = c;
            f.grContext = g;
            f.openGLversion = l.qf.version;
            return f;
          };
          a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
          a.Surface.prototype.makeImageFromTexture = function (c, f) {
            f.colorSpace || (f.colorSpace = a.ColorSpace.SRGB);
            var g = na.length;
            g || (na.push(null), g = 1);
            na.push(c);
            return this._makeImageFromTexture(v.yf, g, f);
          };
          a.Surface.prototype.makeImageFromTextureSource = function (c, f, g) {
            g = g || c.naturalHeight || c.videoHeight || c.height;
            f = f || c.naturalWidth || c.videoWidth || c.width;
            var l = v.qe, p = l.createTexture();
            l.bindTexture(l.TEXTURE_2D, p);
            2 === v.version
              ? l.texImage2D(
                l.TEXTURE_2D,
                0,
                l.RGBA,
                f,
                g,
                0,
                l.RGBA,
                l.UNSIGNED_BYTE,
                c,
              )
              : l.texImage2D(
                l.TEXTURE_2D,
                0,
                l.RGBA,
                l.RGBA,
                l.UNSIGNED_BYTE,
                c,
              );
            l.bindTexture(l.TEXTURE_2D, null);
            return this.makeImageFromTexture(p, {
              height: g,
              width: f,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.ColorSpace.SRGB,
            });
          };
        });
      })(r);
      (function (a) {
        function b(d, e, h, m, q) {
          for (var z = 0; z < d.length; z++) {
            e[z * h + (z * q + m + h) % h] = d[z];
          }
          return e;
        }
        function c(d) {
          for (var e = d * d, h = Array(e); e--;) {
            h[e] = 0 === e % (d + 1)
              ? 1
              : 0;
          }
          return h;
        }
        function f(d) {
          return d ? d.constructor === Float32Array && 4 === d.length : !1;
        }
        function g(d) {
          return (u(255 * d[3]) << 24 | u(255 * d[0]) << 16 |
            u(255 * d[1]) << 8 | u(255 * d[2]) << 0) >>> 0;
        }
        function l(d) {
          if (d && d._ck) return d;
          if (d instanceof Float32Array) {
            for (
              var e = Math.floor(d.length / 4), h = new Uint32Array(e), m = 0;
              m < e;
              m++
            ) {
              h[m] = g(d.slice(4 * m, 4 * (m + 1)));
            }
            return h;
          }
          if (
            d instanceof
              Uint32Array
          ) {
            return d;
          }
          if (d instanceof Array && d[0] instanceof Float32Array) {
            return d.map(g);
          }
        }
        function p(d) {
          if (void 0 === d) return 1;
          var e = parseFloat(d);
          return d && -1 !== d.indexOf("%") ? e / 100 : e;
        }
        function u(d) {
          return Math.round(Math.max(0, Math.min(d || 0, 255)));
        }
        function x(d, e) {
          e && e._ck || a._free(d);
        }
        function w(d, e, h) {
          if (!d || !d.length) return T;
          if (d && d._ck) return d.byteOffset;
          var m = a[e].BYTES_PER_ELEMENT;
          h || (h = a._malloc(d.length * m));
          a[e].set(d, h / m);
          return h;
        }
        function H(d) {
          var e = { ge: T, count: d.length, Pe: a.ColorType.RGBA_F32 };
          if (d instanceof Float32Array) {
            e.ge = w(d, "HEAPF32"), e.count = d.length / 4;
          } else if (d instanceof Uint32Array) {
            e.ge = w(d, "HEAPU32"), e.Pe = a.ColorType.RGBA_8888;
          } else if (d instanceof Array) {
            if (d && d.length) {
              for (
                var h = a._malloc(16 * d.length), m = 0, q = h / 4, z = 0;
                z < d.length;
                z++
              ) {
                for (var D = 0; 4 > D; D++) a.HEAPF32[q + m] = d[z][D], m++;
              }
              d = h;
            } else d = T;
            e.ge = d;
          } else {
            throw "Invalid argument to copyFlexibleColorArray, Not a color array " +
              typeof d;
          }
          return e;
        }
        function K(d) {
          if (!d) return T;
          if (d.length) {
            if (6 === d.length || 9 === d.length) {
              return w(d, "HEAPF32", Na),
                6 === d.length && a.HEAPF32.set(Gd, 6 + Na / 4),
                Na;
            }
            if (16 === d.length) {
              var e = Cb.toTypedArray();
              e[0] = d[0];
              e[1] = d[1];
              e[2] = d[3];
              e[3] = d[4];
              e[4] = d[5];
              e[5] = d[7];
              e[6] = d[12];
              e[7] = d[13];
              e[8] = d[15];
              return Na;
            }
            throw "invalid matrix size";
          }
          e = Cb.toTypedArray();
          e[0] = d.m11;
          e[1] = d.m21;
          e[2] = d.m41;
          e[3] = d.m12;
          e[4] = d.m22;
          e[5] = d.m42;
          e[6] = d.m14;
          e[7] = d.m24;
          e[8] = d.m44;
          return Na;
        }
        function O(d) {
          if (!d) return T;
          var e = ec.toTypedArray();
          if (d.length) {
            if (16 !== d.length && 6 !== d.length && 9 !== d.length) {
              throw "invalid matrix size";
            }
            if (16 === d.length) return w(d, "HEAPF32", Oa);
            e.fill(0);
            e[0] = d[0];
            e[1] = d[1];
            e[3] = d[2];
            e[4] = d[3];
            e[5] = d[4];
            e[7] = d[5];
            e[12] = d[6];
            e[13] = d[7];
            e[15] = d[8];
            6 === d.length && (e[12] = 0, e[13] = 0, e[15] = 1);
            return Oa;
          }
          e[0] = d.m11;
          e[1] = d.m21;
          e[2] = d.m31;
          e[3] = d.m41;
          e[4] = d.m12;
          e[5] = d.m22;
          e[6] = d.m32;
          e[7] = d.m42;
          e[8] = d.m13;
          e[9] = d.m23;
          e[10] = d.m33;
          e[11] = d.m43;
          e[12] = d.m14;
          e[13] = d.m24;
          e[14] = d.m34;
          e[15] = d.m44;
          return Oa;
        }
        function A(d) {
          for (var e = Array(16), h = 0; 16 > h; h++) {
            e[h] = a.HEAPF32[d / 4 + h];
          }
          return e;
        }
        function M(d, e) {
          return w(d, "HEAPF32", e || hb);
        }
        function X(d, e, h, m) {
          var q = fc.toTypedArray();
          q[0] = d;
          q[1] = e;
          q[2] = h;
          q[3] = m;
          return hb;
        }
        function da(d) {
          for (var e = new Float32Array(4), h = 0; 4 > h; h++) {
            e[h] = a.HEAPF32[d / 4 + h];
          }
          return e;
        }
        function ba(d, e) {
          return w(d, "HEAPF32", e || ja);
        }
        function pa(d, e) {
          return w(d, "HEAPF32", e || hc);
        }
        function ib() {
          for (var d = 0, e = 0; e < arguments.length - 1; e += 2) {
            d += arguments[e] * arguments[e + 1];
          }
          return d;
        }
        function jb(d, e, h) {
          for (var m = Array(d.length), q = 0; q < h; q++) {
            for (var z = 0; z < h; z++) {
              for (var D = 0, J = 0; J < h; J++) {
                D += d[h * q + J] * e[h * J + z];
              }
              m[q * h + z] = D;
            }
          }
          return m;
        }
        function Lc(d, e) {
          for (var h = jb(e[0], e[1], d), m = 2; m < e.length;) {
            h = jb(h, e[m], d), m++;
          }
          return h;
        }
        a.Color = function (d, e, h, m) {
          void 0 === m && (m = 1);
          return a.Color4f(u(d) / 255, u(e) / 255, u(h) / 255, m);
        };
        a.ColorAsInt = function (d, e, h, m) {
          void 0 === m && (m = 255);
          return (u(m) << 24 | u(d) << 16 | u(e) << 8 |
            u(h) << 0 & 268435455) >>> 0;
        };
        a.Color4f = function (d, e, h, m) {
          void 0 === m && (m = 1);
          return Float32Array.of(d, e, h, m);
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
        a.getColorComponents = function (d) {
          return [
            Math.floor(255 * d[0]),
            Math.floor(255 * d[1]),
            Math.floor(255 * d[2]),
            d[3],
          ];
        };
        a.parseColorString = function (d, e) {
          d = d.toLowerCase();
          if (d.startsWith("#")) {
            e = 255;
            switch (d.length) {
              case 9:
                e = parseInt(d.slice(7, 9), 16);
              case 7:
                var h = parseInt(d.slice(1, 3), 16);
                var m = parseInt(d.slice(3, 5), 16);
                var q = parseInt(d.slice(5, 7), 16);
                break;
              case 5:
                e = 17 * parseInt(d.slice(4, 5), 16);
              case 4:
                h = 17 * parseInt(d.slice(1, 2), 16),
                  m = 17 * parseInt(d.slice(2, 3), 16),
                  q = 17 * parseInt(d.slice(3, 4), 16);
            }
            return a.Color(h, m, q, e / 255);
          }
          return d.startsWith("rgba")
            ? (d = d.slice(5, -1),
              d = d.split(","),
              a.Color(+d[0], +d[1], +d[2], p(d[3])))
            : d.startsWith("rgb")
            ? (d = d.slice(4, -1),
              d = d.split(","),
              a.Color(+d[0], +d[1], +d[2], p(d[3])))
            : d.startsWith("gray(") || d.startsWith("hsl") || !e ||
                (d = e[d], void 0 === d)
            ? a.BLACK
            : d;
        };
        a.multiplyByAlpha = function (d, e) {
          d = d.slice();
          d[3] = Math.max(0, Math.min(d[3] * e, 1));
          return d;
        };
        a.Malloc = function (d, e) {
          var h = a._malloc(e * d.BYTES_PER_ELEMENT);
          return {
            _ck: !0,
            length: e,
            byteOffset: h,
            te: null,
            subarray: function (m, q) {
              m = this.toTypedArray().subarray(m, q);
              m._ck = !0;
              return m;
            },
            toTypedArray: function () {
              if (this.te && this.te.length) return this.te;
              this.te = new d(a.HEAPU8.buffer, h, e);
              this.te._ck = !0;
              return this.te;
            },
          };
        };
        a.Free = function (d) {
          a._free(d.byteOffset);
          d.byteOffset = T;
          d.toTypedArray = null;
          d.te = null;
        };
        var Na = T,
          Cb,
          Oa = T,
          ec,
          hb = T,
          fc,
          Ha,
          ja = T,
          Mc,
          Va = T,
          Nc,
          ic = T,
          Oc,
          jc = T,
          Pc,
          kc = T,
          Qc,
          hc = T,
          Rc,
          Sc = T,
          Gd = Float32Array.of(0, 0, 1),
          T = 0;
        a.onRuntimeInitialized = function () {
          function d(e, h, m, q, z, D) {
            D ||
              (D = 4 * q.width,
                q.colorType === a.ColorType.RGBA_F16
                  ? D *= 2
                  : q.colorType === a.ColorType.RGBA_F32 &&
                    (D *= 4));
            var J = D * q.height;
            var N = z ? z.byteOffset : a._malloc(J);
            if (!e._readPixels(q, N, D, h, m)) return z || a._free(N), null;
            if (z) return z.toTypedArray();
            switch (q.colorType) {
              case a.ColorType.RGBA_8888:
              case a.ColorType.RGBA_F16:
                e = (new Uint8Array(a.HEAPU8.buffer, N, J));
                if (!q.raw) e = e.slice();
                break;
              case a.ColorType.RGBA_F32:
                e = (new Float32Array(a.HEAPU8.buffer, N, J));
                if (!q.raw) e = e.slice();
                break;
              default:
                return null;
            }
            a._free(N);
            return e;
          }
          fc = a.Malloc(Float32Array, 4);
          hb = fc.byteOffset;
          ec = a.Malloc(Float32Array, 16);
          Oa = ec.byteOffset;
          Cb = a.Malloc(Float32Array, 9);
          Na = Cb.byteOffset;
          Qc = a.Malloc(Float32Array, 12);
          hc = Qc.byteOffset;
          Rc = a.Malloc(Float32Array, 12);
          Sc = Rc.byteOffset;
          Ha = a.Malloc(Float32Array, 4);
          ja = Ha.byteOffset;
          Mc = a.Malloc(Float32Array, 4);
          Va = Mc.byteOffset;
          Nc = a.Malloc(Float32Array, 3);
          ic = Nc.byteOffset;
          Oc = a.Malloc(Float32Array, 3);
          jc = Oc.byteOffset;
          Pc = a.Malloc(Int32Array, 4);
          kc = Pc.byteOffset;
          a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
          a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
          a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
          a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
          a.Path.MakeFromCmds = function (e) {
            var h = w(e, "HEAPF32"), m = a.Path._MakeFromCmds(h, e.length);
            x(h, e);
            return m;
          };
          a.Path.MakeFromVerbsPointsWeights = function (e, h, m) {
            var q = w(e, "HEAPU8"),
              z = w(h, "HEAPF32"),
              D = w(m, "HEAPF32"),
              J = a.Path._MakeFromVerbsPointsWeights(
                q,
                e.length,
                z,
                h.length,
                D,
                m && m.length || 0,
              );
            x(q, e);
            x(z, h);
            x(D, m);
            return J;
          };
          a.Path.prototype.addArc = function (e, h, m) {
            e = ba(e);
            this._addArc(e, h, m);
            return this;
          };
          a.Path.prototype.addOval = function (e, h, m) {
            void 0 === m && (m = 1);
            e = ba(e);
            this._addOval(e, !!h, m);
            return this;
          };
          a.Path.prototype.addPath = function () {
            var e = Array.prototype.slice.call(arguments), h = e[0], m = !1;
            "boolean" === typeof e[e.length - 1] && (m = e.pop());
            if (1 === e.length) this._addPath(h, 1, 0, 0, 0, 1, 0, 0, 0, 1, m);
            else if (2 === e.length) {
              e = e[1],
                this._addPath(
                  h,
                  e[0],
                  e[1],
                  e[2],
                  e[3],
                  e[4],
                  e[5],
                  e[6] || 0,
                  e[7] || 0,
                  e[8] || 1,
                  m,
                );
            } else if (7 === e.length || 10 === e.length) {
              this._addPath(
                h,
                e[1],
                e[2],
                e[3],
                e[4],
                e[5],
                e[6],
                e[7] || 0,
                e[8] || 0,
                e[9] || 1,
                m,
              );
            } else return null;
            return this;
          };
          a.Path.prototype.addPoly = function (e, h) {
            var m = w(e, "HEAPF32");
            this._addPoly(m, e.length / 2, h);
            x(m, e);
            return this;
          };
          a.Path.prototype.addRect = function (e, h) {
            e = ba(e);
            this._addRect(e, !!h);
            return this;
          };
          a.Path.prototype.addRRect = function (e, h) {
            e = pa(e);
            this._addRRect(e, !!h);
            return this;
          };
          a.Path.prototype.addVerbsPointsWeights = function (e, h, m) {
            var q = w(e, "HEAPU8"), z = w(h, "HEAPF32"), D = w(m, "HEAPF32");
            this._addVerbsPointsWeights(
              q,
              e.length,
              z,
              h.length,
              D,
              m && m.length || 0,
            );
            x(q, e);
            x(z, h);
            x(D, m);
          };
          a.Path.prototype.arc = function (e, h, m, q, z, D) {
            e = a.LTRBRect(e - m, h - m, e + m, h + m);
            z = (z - q) / Math.PI * 180 - 360 * !!D;
            D = new a.Path();
            D.addArc(e, q / Math.PI * 180, z);
            this.addPath(D, !0);
            D.delete();
            return this;
          };
          a.Path.prototype.arcToOval = function (e, h, m, q) {
            e = ba(e);
            this._arcToOval(e, h, m, q);
            return this;
          };
          a.Path.prototype.arcToRotated = function (e, h, m, q, z, D, J) {
            this._arcToRotated(e, h, m, !!q, !!z, D, J);
            return this;
          };
          a.Path.prototype.arcToTangent = function (e, h, m, q, z) {
            this._arcToTangent(e, h, m, q, z);
            return this;
          };
          a.Path.prototype.close = function () {
            this._close();
            return this;
          };
          a.Path.prototype.conicTo = function (e, h, m, q, z) {
            this._conicTo(e, h, m, q, z);
            return this;
          };
          a.Path.prototype.computeTightBounds = function (e) {
            this._computeTightBounds(ja);
            var h = Ha.toTypedArray();
            return e ? (e.set(h), e) : h.slice();
          };
          a.Path.prototype.cubicTo = function (e, h, m, q, z, D) {
            this._cubicTo(e, h, m, q, z, D);
            return this;
          };
          a.Path.prototype.dash = function (e, h, m) {
            return this._dash(e, h, m) ? this : null;
          };
          a.Path.prototype.getBounds = function (e) {
            this._getBounds(ja);
            var h = Ha.toTypedArray();
            return e ? (e.set(h), e) : h.slice();
          };
          a.Path.prototype.lineTo = function (e, h) {
            this._lineTo(e, h);
            return this;
          };
          a.Path.prototype.moveTo = function (e, h) {
            this._moveTo(e, h);
            return this;
          };
          a.Path.prototype.offset = function (e, h) {
            this._transform(1, 0, e, 0, 1, h, 0, 0, 1);
            return this;
          };
          a.Path.prototype.quadTo = function (e, h, m, q) {
            this._quadTo(e, h, m, q);
            return this;
          };
          a.Path.prototype.rArcTo = function (e, h, m, q, z, D, J) {
            this._rArcTo(e, h, m, q, z, D, J);
            return this;
          };
          a.Path.prototype.rConicTo = function (e, h, m, q, z) {
            this._rConicTo(e, h, m, q, z);
            return this;
          };
          a.Path.prototype.rCubicTo = function (e, h, m, q, z, D) {
            this._rCubicTo(e, h, m, q, z, D);
            return this;
          };
          a.Path.prototype.rLineTo = function (e, h) {
            this._rLineTo(e, h);
            return this;
          };
          a.Path.prototype.rMoveTo = function (e, h) {
            this._rMoveTo(e, h);
            return this;
          };
          a.Path.prototype.rQuadTo = function (e, h, m, q) {
            this._rQuadTo(e, h, m, q);
            return this;
          };
          a.Path.prototype.stroke = function (e) {
            e = e || {};
            e.width = e.width || 1;
            e.miter_limit = e.miter_limit || 4;
            e.cap = e.cap || a.StrokeCap.Butt;
            e.join = e.join || a.StrokeJoin.Miter;
            e.precision = e.precision || 1;
            return this._stroke(e) ? this : null;
          };
          a.Path.prototype.transform = function () {
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
              e = arguments,
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
              throw "transform expected to take 1 or 9 arguments. Got " +
                arguments.length;
            }
            return this;
          };
          a.Path.prototype.trim = function (e, h, m) {
            return this._trim(e, h, !!m) ? this : null;
          };
          a.Image.prototype.makeShaderCubic = function (e, h, m, q, z) {
            z = K(z);
            return this._makeShaderCubic(e, h, m, q, z);
          };
          a.Image.prototype.makeShaderOptions = function (e, h, m, q, z) {
            z = K(z);
            return this._makeShaderOptions(e, h, m, q, z);
          };
          a.Image.prototype.readPixels = function (e, h, m, q, z) {
            return d(this, e, h, m, q, z);
          };
          a.Canvas.prototype.clear = function (e) {
            e = M(e);
            this._clear(e);
          };
          a.Canvas.prototype.clipRRect = function (e, h, m) {
            e = pa(e);
            this._clipRRect(e, h, m);
          };
          a.Canvas.prototype.clipRect = function (e, h, m) {
            e = ba(e);
            this._clipRect(e, h, m);
          };
          a.Canvas.prototype.concat = function (e) {
            e = O(e);
            this._concat(e);
          };
          a.Canvas.prototype.drawArc = function (e, h, m, q, z) {
            e = ba(e);
            this._drawArc(e, h, m, q, z);
          };
          a.Canvas.prototype.drawAtlas = function (e, h, m, q, z, D, J) {
            if (e && q && h && m && h.length === m.length) {
              z || (z = a.BlendMode.SrcOver);
              var N = w(h, "HEAPF32"),
                Q = w(m, "HEAPF32"),
                U = m.length / 4,
                t = w(l(D), "HEAPU32");
              if (J && "B" in J && "C" in J) {
                this._drawAtlasCubic(e, Q, N, t, U, z, J.B, J.C, q);
              } else {
                let I = a.FilterMode.Linear, R = a.MipmapMode.None;
                J && (I = J.filter, "mipmap" in J && (R = J.mipmap));
                this._drawAtlasOptions(e, Q, N, t, U, z, I, R, q);
              }
              x(N, h);
              x(Q, m);
              x(t, D);
            }
          };
          a.Canvas.prototype.drawColor = function (e, h) {
            e = M(e);
            void 0 !== h ? this._drawColor(e, h) : this._drawColor(e);
          };
          a.Canvas.prototype.drawColorComponents = function (e, h, m, q, z) {
            e = X(e, h, m, q);
            void 0 !== z ? this._drawColor(e, z) : this._drawColor(e);
          };
          a.Canvas.prototype.drawDRRect = function (e, h, m) {
            e = pa(e, hc);
            h = pa(h, Sc);
            this._drawDRRect(e, h, m);
          };
          a.Canvas.prototype.drawGlyphs = function (e, h, m, q, z, D) {
            if (!(2 * e.length <= h.length)) {
              throw "Not enough positions for the array of gyphs";
            }
            const J = w(e, "HEAPU16"), N = w(h, "HEAPF32");
            this._drawGlyphs(e.length, J, N, m, q, z, D);
            x(N, h);
            x(J, e);
          };
          a.Canvas.prototype.drawImageNine = function (e, h, m, q, z) {
            h = w(h, "HEAP32", kc);
            m = ba(m);
            this._drawImageNine(e, h, m, q, z || null);
          };
          a.Canvas.prototype.drawImageRect = function (e, h, m, q, z) {
            ba(h, ja);
            ba(m, Va);
            this._drawImageRect(e, ja, Va, q, !!z);
          };
          a.Canvas.prototype.drawImageRectCubic = function (e, h, m, q, z, D) {
            ba(h, ja);
            ba(m, Va);
            this._drawImageRectCubic(e, ja, Va, q, z, D || null);
          };
          a.Canvas.prototype.drawImageRectOptions = function (
            e,
            h,
            m,
            q,
            z,
            D,
          ) {
            ba(h, ja);
            ba(m, Va);
            this._drawImageRectOptions(e, ja, Va, q, z, D || null);
          };
          a.Canvas.prototype.drawOval = function (e, h) {
            e = ba(e);
            this._drawOval(e, h);
          };
          a.Canvas.prototype.drawPatch = function (e, h, m, q, z) {
            if (
              24 >
                e.length
            ) {
              throw "Need 12 cubic points";
            }
            if (h && 4 > h.length) throw "Need 4 colors";
            if (m && 8 > m.length) throw "Need 4 shader coordinates";
            const D = w(e, "HEAPF32"),
              J = h ? w(l(h), "HEAPU32") : T,
              N = m ? w(m, "HEAPF32") : T;
            q || (q = a.BlendMode.Modulate);
            this._drawPatch(D, J, N, q, z);
            x(N, m);
            x(J, h);
            x(D, e);
          };
          a.Canvas.prototype.drawPoints = function (e, h, m) {
            var q = w(h, "HEAPF32");
            this._drawPoints(e, q, h.length / 2, m);
            x(q, h);
          };
          a.Canvas.prototype.drawRRect = function (e, h) {
            e = pa(e);
            this._drawRRect(e, h);
          };
          a.Canvas.prototype.drawRect = function (e, h) {
            e = ba(e);
            this._drawRect(e, h);
          };
          a.Canvas.prototype.drawShadow = function (e, h, m, q, z, D, J) {
            var N = w(z, "HEAPF32"), Q = w(D, "HEAPF32");
            h = w(h, "HEAPF32", ic);
            m = w(m, "HEAPF32", jc);
            this._drawShadow(e, h, m, q, N, Q, J);
            x(N, z);
            x(Q, D);
          };
          a.getShadowLocalBounds = function (e, h, m, q, z, D, J) {
            e = K(e);
            m = w(m, "HEAPF32", ic);
            q = w(q, "HEAPF32", jc);
            if (!this._getShadowLocalBounds(e, h, m, q, z, D, ja)) return null;
            h = Ha.toTypedArray();
            return J ? (J.set(h), J) : h.slice();
          };
          a.Canvas.prototype.getLocalToDevice = function () {
            this._getLocalToDevice(Oa);
            return A(Oa);
          };
          a.Canvas.prototype.findMarkedCTM = function (e) {
            return this._findMarkedCTM(e, Oa) ? A(Oa) : null;
          };
          a.Canvas.prototype.getTotalMatrix = function () {
            this._getTotalMatrix(Na);
            for (var e = Array(9), h = 0; 9 > h; h++) {
              e[h] = a.HEAPF32[Na / 4 + h];
            }
            return e;
          };
          a.Canvas.prototype.readPixels = function (e, h, m, q, z) {
            return d(this, e, h, m, q, z);
          };
          a.Canvas.prototype.saveLayer = function (e, h, m, q) {
            h = ba(h);
            return this._saveLayer(e || null, h, m || null, q || 0);
          };
          a.Canvas.prototype.writePixels = function (e, h, m, q, z, D, J, N) {
            if (e.byteLength % (h * m)) {
              throw "pixels length must be a multiple of the srcWidth * srcHeight";
            }
            var Q = e.byteLength / (h * m);
            D = D || a.AlphaType.Unpremul;
            J = J || a.ColorType.RGBA_8888;
            N = N || a.ColorSpace.SRGB;
            var U = Q * h;
            Q = w(e, "HEAPU8");
            h = this._writePixels(
              {
                width: h,
                height: m,
                colorType: J,
                alphaType: D,
                colorSpace: N,
              },
              Q,
              U,
              q,
              z,
            );
            x(Q, e);
            return h;
          };
          a.ColorFilter.MakeBlend = function (e, h) {
            e = M(e);
            return a.ColorFilter._MakeBlend(e, h);
          };
          a.ColorFilter.MakeMatrix = function (e) {
            if (!e || 20 !== e.length) throw "invalid color matrix";
            var h = w(e, "HEAPF32"), m = a.ColorFilter._makeMatrix(h);
            x(h, e);
            return m;
          };
          a.ContourMeasure.prototype.getPosTan = function (e, h) {
            this._getPosTan(e, ja);
            e = Ha.toTypedArray();
            return h ? (h.set(e), h) : e.slice();
          };
          a.ImageFilter.MakeMatrixTransform = function (e, h, m) {
            e = K(e);
            if ("B" in h && "C" in h) {
              return a.ImageFilter._MakeMatrixTransformCubic(e, h.Dg, h.Eg, m);
            }
            const q = h.filter;
            let z = a.MipmapMode.None;
            "mipmap" in h && (z = h.mipmap);
            return a.ImageFilter._MakeMatrixTransformOptions(e, q, z, m);
          };
          a.Paint.prototype.getColor = function () {
            this._getColor(hb);
            return da(hb);
          };
          a.Paint.prototype.setColor = function (e, h) {
            h = h || null;
            e = M(e);
            this._setColor(e, h);
          };
          a.Paint.prototype.setColorComponents = function (e, h, m, q, z) {
            z = z || null;
            e = X(e, h, m, q);
            this._setColor(e, z);
          };
          a.Path.prototype.getPoint = function (e, h) {
            this._getPoint(e, ja);
            e = Ha.toTypedArray();
            return h ? (h[0] = e[0], h[1] = e[1], h) : e.slice(0, 2);
          };
          a.PictureRecorder.prototype.beginRecording = function (e) {
            e = ba(e);
            return this._beginRecording(e);
          };
          a.Surface.prototype.makeImageSnapshot = function (e) {
            e = w(e, "HEAP32", kc);
            return this._makeImageSnapshot(e);
          };
          a.Surface.prototype.requestAnimationFrame = function (e, h) {
            this.Le || (this.Le = this.getCanvas());
            requestAnimationFrame(function () {
              void 0 !== this.re && a.setCurrentContext(this.re);
              e(this.Le);
              this.flush(h);
            }.bind(this));
          };
          a.Surface.prototype.drawOnce = function (e, h) {
            this.Le || (this.Le = this.getCanvas());
            requestAnimationFrame(function () {
              void 0 !== this.re && a.setCurrentContext(this.re);
              e(this.Le);
              this.flush(h);
              this.dispose();
            }.bind(this));
          };
          a.PathEffect.MakeDash = function (e, h) {
            h || (h = 0);
            if (!e.length || 1 === e.length % 2) {
              throw "Intervals array must have even length";
            }
            var m = w(e, "HEAPF32");
            h = a.PathEffect._MakeDash(m, e.length, h);
            x(m, e);
            return h;
          };
          a.Shader.MakeColor = function (e, h) {
            h = h || null;
            e = M(e);
            return a.Shader._MakeColor(e, h);
          };
          a.Shader.Blend = a.Shader.MakeBlend;
          a.Shader.Color = a.Shader.MakeColor;
          a.Shader.MakeLinearGradient = function (e, h, m, q, z, D, J, N) {
            N = N || null;
            var Q = H(m), U = w(q, "HEAPF32");
            J = J || 0;
            D = K(D);
            var t = Ha.toTypedArray();
            t.set(e);
            t.set(h, 2);
            e = a.Shader._MakeLinearGradient(
              ja,
              Q.ge,
              Q.Pe,
              U,
              Q.count,
              z,
              J,
              D,
              N,
            );
            x(Q.ge, m);
            q && x(U, q);
            return e;
          };
          a.Shader.MakeRadialGradient = function (e, h, m, q, z, D, J, N) {
            N = N || null;
            var Q = H(m), U = w(q, "HEAPF32");
            J = J || 0;
            D = K(D);
            e = a.Shader._MakeRadialGradient(
              e[0],
              e[1],
              h,
              Q.ge,
              Q.Pe,
              U,
              Q.count,
              z,
              J,
              D,
              N,
            );
            x(Q.ge, m);
            q && x(U, q);
            return e;
          };
          a.Shader.MakeSweepGradient = function (e, h, m, q, z, D, J, N, Q, U) {
            U = U || null;
            var t = H(m), I = w(q, "HEAPF32");
            J = J || 0;
            N = N || 0;
            Q = Q || 360;
            D = K(D);
            e = a.Shader._MakeSweepGradient(
              e,
              h,
              t.ge,
              t.Pe,
              I,
              t.count,
              z,
              N,
              Q,
              J,
              D,
              U,
            );
            x(t.ge, m);
            q && x(I, q);
            return e;
          };
          a.Shader.MakeTwoPointConicalGradient = function (
            e,
            h,
            m,
            q,
            z,
            D,
            J,
            N,
            Q,
            U,
          ) {
            U = U || null;
            var t = H(z), I = w(D, "HEAPF32");
            Q = Q || 0;
            N = K(N);
            var R = Ha.toTypedArray();
            R.set(e);
            R.set(m, 2);
            e = a.Shader._MakeTwoPointConicalGradient(
              ja,
              h,
              q,
              t.ge,
              t.Pe,
              I,
              t.count,
              J,
              Q,
              N,
              U,
            );
            x(t.ge, z);
            D && x(I, D);
            return e;
          };
          a.Vertices.prototype.bounds = function (e) {
            this._bounds(ja);
            var h = Ha.toTypedArray();
            return e ? (e.set(h), e) : h.slice();
          };
          a.Zd && a.Zd.forEach(function (e) {
            e();
          });
        };
        a.computeTonalColors = function (d) {
          var e = w(d.ambient, "HEAPF32"), h = w(d.spot, "HEAPF32");
          this._computeTonalColors(e, h);
          var m = { ambient: da(e), spot: da(h) };
          x(e, d.ambient);
          x(h, d.spot);
          return m;
        };
        a.LTRBRect = function (d, e, h, m) {
          return Float32Array.of(d, e, h, m);
        };
        a.XYWHRect = function (d, e, h, m) {
          return Float32Array.of(d, e, d + h, e + m);
        };
        a.LTRBiRect = function (d, e, h, m) {
          return Int32Array.of(d, e, h, m);
        };
        a.XYWHiRect = function (d, e, h, m) {
          return Int32Array.of(d, e, d + h, e + m);
        };
        a.RRectXY = function (d, e, h) {
          return Float32Array.of(
            d[0],
            d[1],
            d[2],
            d[3],
            e,
            h,
            e,
            h,
            e,
            h,
            e,
            h,
          );
        };
        a.MakeAnimatedImageFromEncoded = function (d) {
          d = new Uint8Array(d);
          var e = a._malloc(d.byteLength);
          a.HEAPU8.set(d, e);
          return (d = a._decodeAnimatedImage(e, d.byteLength)) ? d : null;
        };
        a.MakeImageFromEncoded = function (d) {
          d = new Uint8Array(d);
          var e = a._malloc(d.byteLength);
          a.HEAPU8.set(d, e);
          return (d = a._decodeImage(e, d.byteLength)) ? d : null;
        };
        var kb = null;
        a.MakeImageFromCanvasImageSource = function (d) {
          var e = d.width, h = d.height;
          kb || (kb = document.createElement("canvas"));
          kb.width = e;
          kb.height = h;
          var m = kb.getContext("2d");
          m.drawImage(d, 0, 0);
          d = m.getImageData(0, 0, e, h);
          return a.MakeImage(
            {
              width: e,
              height: h,
              alphaType: a.AlphaType.Unpremul,
              colorType: a.ColorType.RGBA_8888,
              colorSpace: a.ColorSpace.SRGB,
            },
            d.data,
            4 * e,
          );
        };
        a.MakeImage = function (d, e, h) {
          var m = a._malloc(e.length);
          a.HEAPU8.set(e, m);
          return a._MakeImage(d, m, e.length, h);
        };
        a.MakeVertices = function (d, e, h, m, q, z) {
          var D = q && q.length || 0, J = 0;
          h && h.length && (J |= 1);
          m && m.length && (J |= 2);
          void 0 === z || z || (J |= 4);
          d = new a._VerticesBuilder(d, e.length / 2, D, J);
          w(e, "HEAPF32", d.positions());
          d.texCoords() && w(h, "HEAPF32", d.texCoords());
          d.colors() && w(l(m), "HEAPU32", d.colors());
          d.indices() && w(q, "HEAPU16", d.indices());
          return d.detach();
        };
        a.Matrix = {};
        a.Matrix.identity = function () {
          return c(3);
        };
        a.Matrix.invert = function (d) {
          var e = d[0] * d[4] * d[8] + d[1] *
              d[5] * d[6] +
            d[2] * d[3] * d[7] - d[2] * d[4] * d[6] - d[1] * d[3] * d[8] -
            d[0] * d[5] * d[7];
          return e
            ? [
              (d[4] * d[8] - d[5] * d[7]) / e,
              (d[2] * d[7] - d[1] * d[8]) / e,
              (d[1] * d[5] - d[2] * d[4]) / e,
              (d[5] * d[6] - d[3] * d[8]) / e,
              (d[0] * d[8] - d[2] * d[6]) / e,
              (d[2] * d[3] - d[0] * d[5]) / e,
              (d[3] * d[7] - d[4] * d[6]) / e,
              (d[1] * d[6] - d[0] * d[7]) / e,
              (d[0] * d[4] - d[1] * d[3]) / e,
            ]
            : null;
        };
        a.Matrix.mapPoints = function (d, e) {
          for (var h = 0; h < e.length; h += 2) {
            var m = e[h],
              q = e[h + 1],
              z = d[6] * m + d[7] * q + d[8],
              D = d[3] * m + d[4] * q + d[5];
            e[h] = (d[0] * m + d[1] * q + d[2]) / z;
            e[h + 1] = D / z;
          }
          return e;
        };
        a.Matrix.multiply = function () {
          return Lc(3, arguments);
        };
        a.Matrix.rotated = function (d, e, h) {
          e = e || 0;
          h = h || 0;
          var m = Math.sin(d);
          d = Math.cos(d);
          return [
            d,
            -m,
            ib(m, h, 1 - d, e),
            m,
            d,
            ib(-m, e, 1 - d, h),
            0,
            0,
            1,
          ];
        };
        a.Matrix.scaled = function (d, e, h, m) {
          h = h || 0;
          m = m || 0;
          var q = b([d, e], c(3), 3, 0, 1);
          return b([h - d * h, m - e * m], q, 3, 2, 0);
        };
        a.Matrix.skewed = function (d, e, h, m) {
          h = h || 0;
          m = m || 0;
          var q = b([d, e], c(3), 3, 1, -1);
          return b([-d * h, -e * m], q, 3, 2, 0);
        };
        a.Matrix.translated = function (d, e) {
          return b(arguments, c(3), 3, 2, 0);
        };
        a.Vector = {};
        a.Vector.dot = function (d, e) {
          return d.map(function (h, m) {
            return h * e[m];
          }).reduce(function (h, m) {
            return h + m;
          });
        };
        a.Vector.lengthSquared = function (d) {
          return a.Vector.dot(d, d);
        };
        a.Vector.length = function (d) {
          return Math.sqrt(a.Vector.lengthSquared(d));
        };
        a.Vector.mulScalar = function (d, e) {
          return d.map(function (h) {
            return h * e;
          });
        };
        a.Vector.add = function (d, e) {
          return d.map(function (h, m) {
            return h + e[m];
          });
        };
        a.Vector.sub = function (d, e) {
          return d.map(function (h, m) {
            return h - e[m];
          });
        };
        a.Vector.dist = function (d, e) {
          return a.Vector.length(a.Vector.sub(d, e));
        };
        a.Vector.normalize = function (d) {
          return a.Vector.mulScalar(d, 1 / a.Vector.length(d));
        };
        a.Vector.cross = function (d, e) {
          return [
            d[1] * e[2] - d[2] * e[1],
            d[2] * e[0] - d[0] * e[2],
            d[0] * e[1] - d[1] * e[0],
          ];
        };
        a.M44 = {};
        a.M44.identity = function () {
          return c(4);
        };
        a.M44.translated = function (d) {
          return b(d, c(4), 4, 3, 0);
        };
        a.M44.scaled = function (d) {
          return b(d, c(4), 4, 0, 1);
        };
        a.M44.rotated = function (d, e) {
          return a.M44.rotatedUnitSinCos(
            a.Vector.normalize(d),
            Math.sin(e),
            Math.cos(e),
          );
        };
        a.M44.rotatedUnitSinCos = function (d, e, h) {
          var m = d[0], q = d[1];
          d = d[2];
          var z = 1 - h;
          return [
            z * m * m + h,
            z * m * q - e * d,
            z * m * d + e * q,
            0,
            z * m * q + e * d,
            z * q * q + h,
            z * q * d - e * m,
            0,
            z * m *
              d - e * q,
            z * q * d + e * m,
            z * d * d + h,
            0,
            0,
            0,
            0,
            1,
          ];
        };
        a.M44.lookat = function (d, e, h) {
          e = a.Vector.normalize(a.Vector.sub(e, d));
          h = a.Vector.normalize(h);
          h = a.Vector.normalize(a.Vector.cross(e, h));
          var m = a.M44.identity();
          b(h, m, 4, 0, 0);
          b(a.Vector.cross(h, e), m, 4, 1, 0);
          b(a.Vector.mulScalar(e, -1), m, 4, 2, 0);
          b(d, m, 4, 3, 0);
          d = a.M44.invert(m);
          return null === d ? a.M44.identity() : d;
        };
        a.M44.perspective = function (d, e, h) {
          var m = 1 / (e - d);
          h /= 2;
          h = Math.cos(h) / Math.sin(h);
          return [
            h,
            0,
            0,
            0,
            0,
            h,
            0,
            0,
            0,
            0,
            (e + d) * m,
            2 * e * d * m,
            0,
            0,
            -1,
            1,
          ];
        };
        a.M44.rc = function (d, e, h) {
          return d[
            4 *
              e + h
          ];
        };
        a.M44.multiply = function () {
          return Lc(4, arguments);
        };
        a.M44.invert = function (d) {
          var e = d[0],
            h = d[4],
            m = d[8],
            q = d[12],
            z = d[1],
            D = d[5],
            J = d[9],
            N = d[13],
            Q = d[2],
            U = d[6],
            t = d[10],
            I = d[14],
            R = d[3],
            aa = d[7],
            ka = d[11];
          d = d[15];
          var ua = e * D - h * z,
            va = e * J - m * z,
            la = e * N - q * z,
            F = h * J - m * D,
            k = h * N - q * D,
            n = m * N - q * J,
            y = Q * aa - U * R,
            B = Q * ka - t * R,
            C = Q * d - I * R,
            E = U * ka - t * aa,
            L = U * d - I * aa,
            Y = t * d - I * ka,
            qa = ua * Y - va * L + la * E + F * C - k * B + n * y,
            fa = 1 / qa;
          if (0 === qa || Infinity === fa) return null;
          ua *= fa;
          va *= fa;
          la *= fa;
          F *= fa;
          k *= fa;
          n *= fa;
          y *= fa;
          B *= fa;
          C *= fa;
          E *= fa;
          L *= fa;
          Y *= fa;
          e = [
            D * Y - J * L + N *
              E,
            J * C - z * Y - N * B,
            z * L - D * C + N * y,
            D * B - z * E - J * y,
            m * L - h * Y - q * E,
            e * Y - m * C + q * B,
            h * C - e * L - q * y,
            e * E - h * B + m * y,
            aa * n - ka * k + d * F,
            ka * la - R * n - d * va,
            R * k - aa * la + d * ua,
            aa * va - R * F - ka * ua,
            t * k - U * n - I * F,
            Q * n - t * la + I * va,
            U * la - Q * k - I * ua,
            Q * F - U * va + t * ua,
          ];
          return e.every(function (Ia) {
              return !isNaN(Ia) && Infinity !== Ia && -Infinity !== Ia;
            })
            ? e
            : null;
        };
        a.M44.transpose = function (d) {
          return [
            d[0],
            d[4],
            d[8],
            d[12],
            d[1],
            d[5],
            d[9],
            d[13],
            d[2],
            d[6],
            d[10],
            d[14],
            d[3],
            d[7],
            d[11],
            d[15],
          ];
        };
        a.M44.mustInvert = function (d) {
          d = a.M44.invert(d);
          if (null === d) throw "Matrix not invertible";
          return d;
        };
        a.M44.setupCamera = function (d, e, h) {
          var m = a.M44.lookat(h.eye, h.coa, h.up);
          h = a.M44.perspective(h.near, h.far, h.angle);
          e = [(d[2] - d[0]) / 2, (d[3] - d[1]) / 2, e];
          d = a.M44.multiply(
            a.M44.translated([(d[0] + d[2]) / 2, (d[1] + d[3]) / 2, 0]),
            a.M44.scaled(e),
          );
          return a.M44.multiply(d, h, m, a.M44.mustInvert(d));
        };
        a.ColorMatrix = {};
        a.ColorMatrix.identity = function () {
          var d = new Float32Array(20);
          d[0] = 1;
          d[6] = 1;
          d[12] = 1;
          d[18] = 1;
          return d;
        };
        a.ColorMatrix.scaled = function (d, e, h, m) {
          var q = new Float32Array(20);
          q[0] = d;
          q[6] = e;
          q[12] = h;
          q[18] = m;
          return q;
        };
        var Hd = [[6, 7, 11, 12], [0, 10, 2, 12], [0, 1, 5, 6]];
        a.ColorMatrix.rotated = function (d, e, h) {
          var m = a.ColorMatrix.identity();
          d = Hd[d];
          m[d[0]] = h;
          m[d[1]] = e;
          m[d[2]] = -e;
          m[d[3]] = h;
          return m;
        };
        a.ColorMatrix.postTranslate = function (d, e, h, m, q) {
          d[4] += e;
          d[9] += h;
          d[14] += m;
          d[19] += q;
          return d;
        };
        a.ColorMatrix.concat = function (d, e) {
          for (var h = new Float32Array(20), m = 0, q = 0; 20 > q; q += 5) {
            for (var z = 0; 4 > z; z++) {
              h[m++] = d[q] * e[z] + d[q + 1] * e[z + 5] +
                d[q + 2] * e[z + 10] + d[q + 3] * e[z + 15];
            }
            h[m++] = d[q] * e[4] + d[q + 1] * e[9] + d[q + 2] * e[14] +
              d[q + 3] * e[19] + d[q + 4];
          }
          return h;
        };
        (function (d) {
          d.Zd = d.Zd || [];
          d.Zd.push(function () {
            function e(t) {
              if (!t || !t.length) return [];
              for (var I = [], R = 0; R < t.length; R += 5) {
                var aa = d.LTRBRect(t[R], t[R + 1], t[R + 2], t[R + 3]);
                aa.direction = 0 === t[R + 4]
                  ? d.TextDirection.RTL
                  : d.TextDirection.LTR;
                I.push(aa);
              }
              d._free(t.byteOffset);
              return I;
            }
            function h(t) {
              t = t || {};
              void 0 === t.weight && (t.weight = d.FontWeight.Normal);
              t.width = t.width || d.FontWidth.Normal;
              t.slant = t.slant || d.FontSlant.Upright;
              return t;
            }
            function m(t) {
              if (!t || !t.length) return T;
              for (var I = [], R = 0; R < t.length; R++) {
                var aa = q(t[R]);
                I.push(aa);
              }
              return w(I, "HEAPU32");
            }
            function q(t) {
              if (J[t]) return J[t];
              var I = oa(t) + 1, R = d._malloc(I);
              ra(t, G, R, I);
              return J[t] = R;
            }
            function z(t) {
              t._colorPtr = M(t.color);
              t._foregroundColorPtr = T;
              t._backgroundColorPtr = T;
              t._decorationColorPtr = T;
              t.foregroundColor &&
                (t._foregroundColorPtr = M(t.foregroundColor, N));
              t.backgroundColor &&
                (t._backgroundColorPtr = M(t.backgroundColor, Q));
              t.decorationColor &&
                (t._decorationColorPtr = M(t.decorationColor, U));
              Array.isArray(t.fontFamilies) && t.fontFamilies.length
                ? (t._fontFamiliesPtr = m(t.fontFamilies),
                  t._fontFamiliesLen = t.fontFamilies.length)
                : (t._fontFamiliesPtr = T, t._fontFamiliesLen = 0);
              if (t.locale) {
                var I = t.locale;
                t._localePtr = q(I);
                t._localeLen = oa(I) + 1;
              } else t._localePtr = T, t._localeLen = 0;
              if (Array.isArray(t.shadows) && t.shadows.length) {
                I = t.shadows;
                var R = I.map(function (F) {
                    return F.color || d.BLACK;
                  }),
                  aa = I.map(function (F) {
                    return F.blurRadius || 0;
                  });
                t._shadowLen = I.length;
                for (
                  var ka = d._malloc(8 * I.length), ua = ka / 4, va = 0;
                  va < I.length;
                  va++
                ) {
                  var la = I[va].offset || [0, 0];
                  d.HEAPF32[ua] = la[0];
                  d.HEAPF32[
                    ua +
                    1
                  ] = la[1];
                  ua += 2;
                }
                t._shadowColorsPtr = H(R).ge;
                t._shadowOffsetsPtr = ka;
                t._shadowBlurRadiiPtr = w(aa, "HEAPF32");
              } else {
                t._shadowLen = 0,
                  t._shadowColorsPtr = T,
                  t._shadowOffsetsPtr = T,
                  t._shadowBlurRadiiPtr = T;
              }
              Array.isArray(t.fontFeatures) && t.fontFeatures.length
                ? (I = t.fontFeatures,
                  R = I.map(function (F) {
                    return F.name;
                  }),
                  aa = I.map(function (F) {
                    return F.value;
                  }),
                  t._fontFeatureLen = I.length,
                  t._fontFeatureNamesPtr = m(R),
                  t._fontFeatureValuesPtr = w(aa, "HEAPU32"))
                : (t._fontFeatureLen = 0,
                  t._fontFeatureNamesPtr = T,
                  t._fontFeatureValuesPtr = T);
            }
            function D(t) {
              d._free(t._fontFamiliesPtr);
              d._free(t._localePtr);
              d._free(t._shadowColorsPtr);
              d._free(t._shadowOffsetsPtr);
              d._free(t._shadowBlurRadiiPtr);
              d._free(t._fontFeatureNamesPtr);
              d._free(t._fontFeatureValuesPtr);
            }
            d.Paragraph.prototype.getRectsForRange = function (t, I, R, aa) {
              t = this._getRectsForRange(t, I, R, aa);
              return e(t);
            };
            d.Paragraph.prototype.getRectsForPlaceholders = function () {
              var t = this._getRectsForPlaceholders();
              return e(t);
            };
            d.TypefaceFontProvider.prototype.registerFont = function (t, I) {
              t = d.FontMgr.RefDefault().MakeTypefaceFromData(t);
              if (!t) return null;
              I = q(I);
              this._registerFont(t, I);
            };
            d.ParagraphStyle = function (t) {
              t.disableHinting = t.disableHinting || !1;
              if (t.ellipsis) {
                var I = t.ellipsis;
                t._ellipsisPtr = q(I);
                t._ellipsisLen = oa(I) + 1;
              } else t._ellipsisPtr = T, t._ellipsisLen = 0;
              t.heightMultiplier = t.heightMultiplier || 0;
              t.maxLines = t.maxLines || 0;
              I = (I = t.strutStyle) || {};
              I.strutEnabled = I.strutEnabled || !1;
              I.strutEnabled && Array.isArray(I.fontFamilies) &&
                I.fontFamilies.length
                ? (I._fontFamiliesPtr = m(I.fontFamilies),
                  I._fontFamiliesLen = I.fontFamilies.length)
                : (I._fontFamiliesPtr = T, I._fontFamiliesLen = 0);
              I.fontStyle = h(I.fontStyle);
              I.fontSize = I.fontSize || 0;
              I.heightMultiplier = I.heightMultiplier || 0;
              I.halfLeading = I.halfLeading || !1;
              I.leading = I.leading || 0;
              I.forceStrutHeight = I.forceStrutHeight || !1;
              t.strutStyle = I;
              t.textAlign = t.textAlign || d.TextAlign.Start;
              t.textDirection = t.textDirection || d.TextDirection.LTR;
              t.textHeightBehavior = t.textHeightBehavior ||
                d.TextHeightBehavior.All;
              t.textStyle = d.TextStyle(t.textStyle);
              return t;
            };
            d.TextStyle = function (t) {
              t.color || (t.color = d.BLACK);
              t.decoration = t.decoration || 0;
              t.decorationThickness = t.decorationThickness || 0;
              t.decorationStyle = t.decorationStyle || d.DecorationStyle.Solid;
              t.textBaseline = t.textBaseline || d.TextBaseline.Alphabetic;
              t.fontSize = t.fontSize || 0;
              t.letterSpacing = t.letterSpacing || 0;
              t.wordSpacing = t.wordSpacing || 0;
              t.heightMultiplier = t.heightMultiplier || 0;
              t.halfLeading = t.halfLeading || !1;
              t.fontStyle = h(t.fontStyle);
              return t;
            };
            var J = {}, N = d._malloc(16), Q = d._malloc(16), U = d._malloc(16);
            d.ParagraphBuilder.Make = function (t, I) {
              z(t.textStyle);
              I = d.ParagraphBuilder._Make(t, I);
              D(t.textStyle);
              return I;
            };
            d.ParagraphBuilder.MakeFromFontProvider = function (t, I) {
              z(t.textStyle);
              I = d.ParagraphBuilder._MakeFromFontProvider(t, I);
              D(t.textStyle);
              return I;
            };
            d.ParagraphBuilder.ShapeText = function (t, I, R) {
              let aa = 0;
              for (const ka of I) aa += ka.length;
              if (aa !== t.length) {
                throw "Accumulated block lengths must equal text.length";
              }
              return d.ParagraphBuilder._ShapeText(t, I, R);
            };
            d.ParagraphBuilder.prototype.pushStyle = function (t) {
              z(t);
              this._pushStyle(t);
              D(t);
            };
            d.ParagraphBuilder.prototype.pushPaintStyle = function (t, I, R) {
              z(t);
              this._pushPaintStyle(t, I, R);
              D(t);
            };
            d.ParagraphBuilder.prototype.addPlaceholder = function (
              t,
              I,
              R,
              aa,
              ka,
            ) {
              R = R || d.PlaceholderAlignment.Baseline;
              aa = aa || d.TextBaseline.Alphabetic;
              this._addPlaceholder(t || 0, I || 0, R, aa, ka || 0);
            };
          });
        })(r);
        a.Zd = a.Zd || [];
        a.Zd.push(function () {
          a.Path.prototype.op = function (d, e) {
            return this._op(d, e) ? this : null;
          };
          a.Path.prototype.simplify = function () {
            return this._simplify() ? this : null;
          };
        });
        a.Zd = a.Zd || [];
        a.Zd.push(function () {
          a.Canvas.prototype.drawText = function (d, e, h, m, q) {
            var z = oa(d), D = a._malloc(z + 1);
            ra(d, G, D, z + 1);
            this._drawSimpleText(D, z, e, h, q, m);
            a._free(D);
          };
          a.Font.prototype.getGlyphBounds = function (d, e, h) {
            var m = w(d, "HEAPU16"), q = a._malloc(16 * d.length);
            this._getGlyphWidthBounds(m, d.length, T, q, e || null);
            e = new Float32Array(a.HEAPU8.buffer, q, 4 * d.length);
            x(m, d);
            if (h) return h.set(e), a._free(q), h;
            d = Float32Array.from(e);
            a._free(q);
            return d;
          };
          a.Font.prototype.getGlyphIDs = function (d, e, h) {
            e || (e = d.length);
            var m = oa(d) + 1, q = a._malloc(m);
            ra(d, G, q, m);
            d = a._malloc(2 * e);
            e = this._getGlyphIDs(q, m - 1, e, d);
            a._free(q);
            if (0 > e) return a._free(d), null;
            q = new Uint16Array(a.HEAPU8.buffer, d, e);
            if (h) return h.set(q), a._free(d), h;
            h = Uint16Array.from(q);
            a._free(d);
            return h;
          };
          a.Font.prototype.getGlyphIntercepts = function (d, e, h, m) {
            var q = w(d, "HEAPU16"), z = w(e, "HEAPF32");
            return this._getGlyphIntercepts(
              q,
              d.length,
              !(d && d._ck),
              z,
              e.length,
              !(e && e._ck),
              h,
              m,
            );
          };
          a.Font.prototype.getGlyphWidths = function (d, e, h) {
            var m = w(d, "HEAPU16"), q = a._malloc(4 * d.length);
            this._getGlyphWidthBounds(m, d.length, q, T, e || null);
            e = new Float32Array(a.HEAPU8.buffer, q, d.length);
            x(m, d);
            if (h) return h.set(e), a._free(q), h;
            d = Float32Array.from(e);
            a._free(q);
            return d;
          };
          a.FontMgr.FromData = function () {
            if (!arguments.length) return null;
            var d = arguments;
            1 === d.length && Array.isArray(d[0]) && (d = arguments[0]);
            if (!d.length) return null;
            for (var e = [], h = [], m = 0; m < d.length; m++) {
              var q = new Uint8Array(d[m]), z = w(q, "HEAPU8");
              e.push(z);
              h.push(q.byteLength);
            }
            e = w(e, "HEAPU32");
            h = w(h, "HEAPU32");
            d = a.FontMgr._fromData(e, h, d.length);
            a._free(e);
            a._free(h);
            return d;
          };
          a.FontMgr.prototype.MakeTypefaceFromData = function (d) {
            d = new Uint8Array(d);
            var e = w(d, "HEAPU8");
            return (d = this._makeTypefaceFromData(e, d.byteLength)) ? d : null;
          };
          a.Typeface.MakeFreeTypeFaceFromData = function (d) {
            d = new Uint8Array(d);
            var e = w(d, "HEAPU8");
            return (d = a.Typeface._MakeFreeTypeFaceFromData(e, d.byteLength))
              ? d
              : null;
          };
          a.Typeface.prototype.getGlyphIDs = function (d, e, h) {
            e || (e = d.length);
            var m = oa(d) + 1, q = a._malloc(m);
            ra(d, G, q, m);
            d = a._malloc(2 * e);
            e = this._getGlyphIDs(q, m - 1, e, d);
            a._free(q);
            if (0 > e) return a._free(d), null;
            q = new Uint16Array(a.HEAPU8.buffer, d, e);
            if (h) return h.set(q), a._free(d), h;
            h = Uint16Array.from(q);
            a._free(d);
            return h;
          };
          a.TextBlob.MakeOnPath = function (d, e, h, m) {
            if (d && d.length && e && e.countPoints()) {
              if (1 === e.countPoints()) return this.MakeFromText(d, h);
              m || (m = 0);
              var q = h.getGlyphIDs(d);
              q = h.getGlyphWidths(q);
              var z = [];
              e = new a.ContourMeasureIter(e, !1, 1);
              for (
                var D = e.next(), J = new Float32Array(4), N = 0;
                N < d.length && D;
                N++
              ) {
                var Q = q[N];
                m += Q / 2;
                if (m > D.length()) {
                  D.delete();
                  D = e.next();
                  if (!D) {
                    d = d.substring(0, N);
                    break;
                  }
                  m = Q / 2;
                }
                D.getPosTan(m, J);
                var U = J[2], t = J[3];
                z.push(U, t, J[0] - Q / 2 * U, J[1] - Q / 2 * t);
                m += Q / 2;
              }
              d = this.MakeFromRSXform(d, z, h);
              D && D.delete();
              e.delete();
              return d;
            }
          };
          a.TextBlob.MakeFromRSXform = function (d, e, h) {
            var m = oa(d) + 1, q = a._malloc(m);
            ra(d, G, q, m);
            d = w(e, "HEAPF32");
            h = a.TextBlob._MakeFromRSXform(q, m - 1, d, h);
            a._free(q);
            return h ? h : null;
          };
          a.TextBlob.MakeFromRSXformGlyphs = function (d, e, h) {
            var m = w(d, "HEAPU16");
            e = w(e, "HEAPF32");
            h = a.TextBlob._MakeFromRSXformGlyphs(m, 2 * d.length, e, h);
            x(m, d);
            return h ? h : null;
          };
          a.TextBlob.MakeFromGlyphs = function (d, e) {
            var h = w(d, "HEAPU16");
            e = a.TextBlob._MakeFromGlyphs(h, 2 * d.length, e);
            x(h, d);
            return e ? e : null;
          };
          a.TextBlob.MakeFromText = function (d, e) {
            var h = oa(d) + 1, m = a._malloc(h);
            ra(d, G, m, h);
            d = a.TextBlob._MakeFromText(m, h - 1, e);
            a._free(m);
            return d ? d : null;
          };
          a.MallocGlyphIDs = function (d) {
            return a.Malloc(Uint16Array, d);
          };
        });
        a.Zd = a.Zd || [];
        a.Zd.push(function () {
          a.MakePicture = function (d) {
            d = new Uint8Array(d);
            var e = a._malloc(d.byteLength);
            a.HEAPU8.set(d, e);
            return (d = a._MakePicture(e, d.byteLength)) ? d : null;
          };
        });
        (function () {
          function d(F) {
            for (var k = 0; k < F.length; k++) {
              if (
                void 0 !==
                  F[k] && !Number.isFinite(F[k])
              ) {
                return !1;
              }
            }
            return !0;
          }
          function e(F) {
            var k = a.getColorComponents(F);
            F = k[0];
            var n = k[1], y = k[2];
            k = k[3];
            if (1 === k) {
              return F = F.toString(16).toLowerCase(),
                n = n.toString(16).toLowerCase(),
                y = y.toString(16).toLowerCase(),
                F = 1 === F.length ? "0" + F : F,
                n = 1 === n.length ? "0" + n : n,
                y = 1 === y.length ? "0" + y : y,
                "#" + F + n + y;
            }
            k = 0 === k || 1 === k ? k : k.toFixed(8);
            return "rgba(" + F + ", " + n + ", " + y + ", " + k + ")";
          }
          function h(F) {
            return a.parseColorString(F, ua);
          }
          function m(F) {
            F = va.exec(F);
            if (!F) return null;
            var k = parseFloat(F[4]), n = 16;
            switch (F[5]) {
              case "em":
              case "rem":
                n = 16 * k;
                break;
              case "pt":
                n = 4 * k / 3;
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
                n = 96 * k / 2.54;
                break;
              case "mm":
                n = 96 / 25.4 * k;
                break;
              case "q":
                n = 96 / 25.4 / 4 * k;
                break;
              case "%":
                n = 16 / 75 * k;
            }
            return {
              style: F[1],
              variant: F[2],
              weight: F[3],
              sizePx: n,
              family: F[6].trim(),
            };
          }
          function q(F) {
            this.Sd = F;
            this.Ud = new a.Paint();
            this.Ud.setAntiAlias(!0);
            this.Ud.setStrokeMiter(10);
            this.Ud.setStrokeCap(a.StrokeCap.Butt);
            this.Ud.setStrokeJoin(a.StrokeJoin.Miter);
            this.Ue = "10px monospace";
            this.we = new a.Font(null, 10);
            this.we.setSubpixel(!0);
            this.fe = this.le = a.BLACK;
            this.ze = 0;
            this.Ne = a.TRANSPARENT;
            this.Be = this.Ae = 0;
            this.Oe = this.ne = 1;
            this.Me = 0;
            this.ye = [];
            this.Td = a.BlendMode.SrcOver;
            this.Ud.setStrokeWidth(this.Oe);
            this.Ud.setBlendMode(this.Td);
            this.Xd = new a.Path();
            this.Yd = a.Matrix.identity();
            this.rf = [];
            this.Fe = [];
            this.pe = function () {
              this.Xd.delete();
              this.Ud.delete();
              this.we.delete();
              this.Fe.forEach(function (k) {
                k.pe();
              });
            };
            Object.defineProperty(this, "currentTransform", {
              enumerable: !0,
              get: function () {
                return {
                  a: this.Yd[0],
                  c: this.Yd[1],
                  e: this.Yd[2],
                  b: this.Yd[3],
                  d: this.Yd[4],
                  f: this.Yd[5],
                };
              },
              set: function (k) {
                k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
              },
            });
            Object.defineProperty(this, "fillStyle", {
              enumerable: !0,
              get: function () {
                return f(this.fe) ? e(this.fe) : this.fe;
              },
              set: function (k) {
                k = maybeHSL(k);
                "string" === typeof k ? this.fe = h(k) : k.xe && (this.fe = k);
              },
            });
            Object.defineProperty(this, "font", {
              enumerable: !0,
              get: function () {
                return this.Ue;
              },
              set: function (k) {
                var n = m(k), y = n.family;
                n.typeface = la[y]
                  ? la[y][
                    (n.style || "normal") + "|" + (n.variant || "normal") +
                    "|" +
                    (n.weight || "normal")
                  ] || la[y]["*"]
                  : null;
                n &&
                  (this.we.setSize(n.sizePx),
                    this.we.setTypeface(n.typeface),
                    this.Ue = k);
              },
            });
            Object.defineProperty(this, "globalAlpha", {
              enumerable: !0,
              get: function () {
                return this.ne;
              },
              set: function (k) {
                !isFinite(k) || 0 > k || 1 < k || (this.ne = k);
              },
            });
            Object.defineProperty(this, "globalCompositeOperation", {
              enumerable: !0,
              get: function () {
                switch (this.Td) {
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
                    this.Td = a.BlendMode.SrcOver;
                    break;
                  case "destination-over":
                    this.Td = a.BlendMode.DstOver;
                    break;
                  case "copy":
                    this.Td = a.BlendMode.Src;
                    break;
                  case "destination":
                    this.Td = a.BlendMode.Dst;
                    break;
                  case "clear":
                    this.Td = a.BlendMode.Clear;
                    break;
                  case "source-in":
                    this.Td = a.BlendMode.SrcIn;
                    break;
                  case "destination-in":
                    this.Td = a.BlendMode.DstIn;
                    break;
                  case "source-out":
                    this.Td = a.BlendMode.SrcOut;
                    break;
                  case "destination-out":
                    this.Td = a.BlendMode.DstOut;
                    break;
                  case "source-atop":
                    this.Td = a.BlendMode.SrcATop;
                    break;
                  case "destination-atop":
                    this.Td = a.BlendMode.DstATop;
                    break;
                  case "xor":
                    this.Td = a.BlendMode.Xor;
                    break;
                  case "lighter":
                    this.Td = a.BlendMode.Plus;
                    break;
                  case "plus-lighter":
                    this.Td = a.BlendMode.Plus;
                    break;
                  case "plus-darker":
                    throw "plus-darker is not supported";
                  case "multiply":
                    this.Td = a.BlendMode.Multiply;
                    break;
                  case "screen":
                    this.Td = a.BlendMode.Screen;
                    break;
                  case "overlay":
                    this.Td = a.BlendMode.Overlay;
                    break;
                  case "darken":
                    this.Td = a.BlendMode.Darken;
                    break;
                  case "lighten":
                    this.Td = a.BlendMode.Lighten;
                    break;
                  case "color-dodge":
                    this.Td = a.BlendMode.ColorDodge;
                    break;
                  case "color-burn":
                    this.Td = a.BlendMode.ColorBurn;
                    break;
                  case "hard-light":
                    this.Td = a.BlendMode.HardLight;
                    break;
                  case "soft-light":
                    this.Td = a.BlendMode.SoftLight;
                    break;
                  case "difference":
                    this.Td = a.BlendMode.Difference;
                    break;
                  case "exclusion":
                    this.Td = a.BlendMode.Exclusion;
                    break;
                  case "hue":
                    this.Td = a.BlendMode.Hue;
                    break;
                  case "saturation":
                    this.Td = a.BlendMode.Saturation;
                    break;
                  case "color":
                    this.Td = a.BlendMode.Color;
                    break;
                  case "luminosity":
                    this.Td = a.BlendMode.Luminosity;
                    break;
                  default:
                    return;
                }
                this.Ud.setBlendMode(this.Td);
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
                switch (this.Ud.getStrokeCap()) {
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
                    this.Ud.setStrokeCap(a.StrokeCap.Butt);
                    break;
                  case "round":
                    this.Ud.setStrokeCap(a.StrokeCap.Round);
                    break;
                  case "square":
                    this.Ud.setStrokeCap(a.StrokeCap.Square);
                }
              },
            });
            Object.defineProperty(this, "lineDashOffset", {
              enumerable: !0,
              get: function () {
                return this.Me;
              },
              set: function (k) {
                isFinite(k) && (this.Me = k);
              },
            });
            Object.defineProperty(this, "lineJoin", {
              enumerable: !0,
              get: function () {
                switch (this.Ud.getStrokeJoin()) {
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
                    this.Ud.setStrokeJoin(a.StrokeJoin.Miter);
                    break;
                  case "round":
                    this.Ud.setStrokeJoin(a.StrokeJoin.Round);
                    break;
                  case "bevel":
                    this.Ud.setStrokeJoin(a.StrokeJoin.Bevel);
                }
              },
            });
            Object.defineProperty(this, "lineWidth", {
              enumerable: !0,
              get: function () {
                return this.Ud.getStrokeWidth();
              },
              set: function (k) {
                0 >= k || !k || (this.Oe = k, this.Ud.setStrokeWidth(k));
              },
            });
            Object.defineProperty(this, "miterLimit", {
              enumerable: !0,
              get: function () {
                return this.Ud.getStrokeMiter();
              },
              set: function (k) {
                0 >= k || !k || this.Ud.setStrokeMiter(k);
              },
            });
            Object.defineProperty(this, "shadowBlur", {
              enumerable: !0,
              get: function () {
                return this.ze;
              },
              set: function (k) {
                0 > k || !isFinite(k) || (this.ze = k);
              },
            });
            Object.defineProperty(this, "shadowColor", {
              enumerable: !0,
              get: function () {
                return e(this.Ne);
              },
              set: function (k) {
                this.Ne = h(maybeHSL(k));
              },
            });
            Object.defineProperty(this, "shadowOffsetX", {
              enumerable: !0,
              get: function () {
                return this.Ae;
              },
              set: function (k) {
                isFinite(k) && (this.Ae = k);
              },
            });
            Object.defineProperty(this, "shadowOffsetY", {
              enumerable: !0,
              get: function () {
                return this.Be;
              },
              set: function (k) {
                isFinite(k) && (this.Be = k);
              },
            });
            Object.defineProperty(this, "strokeStyle", {
              enumerable: !0,
              get: function () {
                return e(this.le);
              },
              set: function (k) {
                "string" === typeof k ? this.le = h(maybeHSL(k)) : k.xe && (this.le = k);
              },
            });
            this.arc = function (k, n, y, B, C, E) {
              t(this.Xd, k, n, y, y, 0, B, C, E);
            };
            this.arcTo = function (k, n, y, B, C) {
              N(this.Xd, k, n, y, B, C);
            };
            this.beginPath = function () {
              this.Xd.delete();
              this.Xd = new a.Path();
            };
            this.bezierCurveTo = function (k, n, y, B, C, E) {
              var L = this.Xd;
              d([k, n, y, B, C, E]) &&
                (L.isEmpty() && L.moveTo(k, n), L.cubicTo(k, n, y, B, C, E));
            };
            this.clearRect = function (k, n, y, B) {
              this.Ud.setStyle(a.PaintStyle.Fill);
              this.Ud.setBlendMode(a.BlendMode.Clear);
              this.Sd.drawRect(a.XYWHRect(k, n, y, B), this.Ud);
              this.Ud.setBlendMode(this.Td);
            };
            this.clip = function (k, n) {
              "string" === typeof k
                ? (n = k, k = this.Xd)
                : k && k.ef && (k = k.$d);
              k || (k = this.Xd);
              k = k.copy();
              n && "evenodd" === n.toLowerCase()
                ? k.setFillType(a.FillType.EvenOdd)
                : k.setFillType(a.FillType.Winding);
              this.Sd.clipPath(k, a.ClipOp.Intersect, !0);
              k.delete();
            };
            this.closePath = function () {
              Q(this.Xd);
            };
            this.createImageData = function () {
              if (1 === arguments.length) {
                var k = arguments[0];
                return new D(
                  new Uint8ClampedArray(4 * k.width * k.height),
                  k.width,
                  k.height,
                );
              }
              if (2 === arguments.length) {
                k = arguments[0];
                var n = arguments[1];
                return new D(new Uint8ClampedArray(4 * k * n), k, n);
              }
              throw "createImageData expects 1 or 2 arguments, got " +
                arguments.length;
            };
            this.createLinearGradient = function (k, n, y, B) {
              if (d(arguments)) {
                var C = new J(k, n, y, B);
                this.Fe.push(C);
                return C;
              }
            };
            this.createPattern = function (k, n) {
              k = new aa(k, n);
              this.Fe.push(k);
              return k;
            };
            this.createRadialGradient = function (k, n, y, B, C, E) {
              if (d(arguments)) {
                var L = new ka(k, n, y, B, C, E);
                this.Fe.push(L);
                return L;
              }
            };
            this.drawImage = function (k) {
              var n = this.Te();
              if (3 === arguments.length || 5 === arguments.length) {
                var y = a.XYWHRect(
                    arguments[1],
                    arguments[2],
                    arguments[3] || k.width(),
                    arguments[4] || k.height(),
                  ),
                  B = a.XYWHRect(0, 0, k.width(), k.height());
              } else if (9 === arguments.length) {
                y = a.XYWHRect(
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
              this.Sd.drawImageRect(k, B, y, n, !1);
              n.dispose();
            };
            this.ellipse = function (k, n, y, B, C, E, L, Y) {
              t(this.Xd, k, n, y, B, C, E, L, Y);
            };
            this.Te = function () {
              var k = this.Ud.copy();
              k.setStyle(a.PaintStyle.Fill);
              if (f(this.fe)) {
                var n = a.multiplyByAlpha(this.fe, this.ne);
                k.setColor(n);
              } else {
                n = this.fe.xe(this.Yd),
                  k.setColor(a.Color(0, 0, 0, this.ne)),
                  k.setShader(n);
              }
              k.dispose = function () {
                this.delete();
              };
              return k;
            };
            this.fill = function (k, n) {
              "string" === typeof k
                ? (n = k, k = this.Xd)
                : k && k.ef && (k = k.$d);
              if ("evenodd" === n) this.Xd.setFillType(a.FillType.EvenOdd);
              else {
                if ("nonzero" !== n && n) throw "invalid fill rule";
                this.Xd.setFillType(a.FillType.Winding);
              }
              k || (k = this.Xd);
              n = this.Te();
              var y = this.Ce(n);
              y &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawPath(k, y),
                  this.Sd.restore(),
                  y.dispose());
              this.Sd.drawPath(k, n);
              n.dispose();
            };
            this.fillRect = function (k, n, y, B) {
              var C = this.Te(), E = this.Ce(C);
              E &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawRect(a.XYWHRect(k, n, y, B), E),
                  this.Sd.restore(),
                  E.dispose());
              this.Sd.drawRect(a.XYWHRect(k, n, y, B), C);
              C.dispose();
            };
            this.fillText = function (k, n, y) {
              var B = this.Te();
              k = a.TextBlob.MakeFromText(k, this.we);
              var C = this.Ce(B);
              C &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawTextBlob(k, n, y, C),
                  this.Sd.restore(),
                  C.dispose());
              this.Sd.drawTextBlob(k, n, y, B);
              k.delete();
              B.dispose();
            };
            this.measureText = function (txt) {
              const glyphWidths = this.we.getGlyphWidths(txt);
              let width = 0;
              for (const w of glyphWidths) {
                width += w;
              }
              let glyphBounds = this.we
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
              const metrics = this.we.getMetrics();
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
            this.getImageData = function (k, n, y, B) {
              return (k = this.Sd.readPixels(k, n, {
                  width: y,
                  height: B,
                  colorType: a.ColorType.RGBA_8888,
                  alphaType: a.AlphaType.Unpremul,
                  colorSpace: a.ColorSpace.SRGB
                }))
                ? new D(new Uint8ClampedArray(k.buffer), y, B)
                : null;
            };
            this.getLineDash = function () {
              return this.ye.slice();
            };
            this.sf = function (k) {
              var n = a.Matrix.invert(this.Yd);
              a.Matrix.mapPoints(n, k);
              return k;
            };
            this.isPointInPath = function (k, n, y) {
              var B = arguments;
              if (3 === B.length) var C = this.Xd;
              else if (4 === B.length) C = B[0], k = B[1], n = B[2], y = B[3];
              else throw "invalid arg count, need 3 or 4, got " + B.length;
              if (!isFinite(k) || !isFinite(n)) return !1;
              y = y || "nonzero";
              if ("nonzero" !== y && "evenodd" !== y) return !1;
              B = this.sf([k, n]);
              k = B[0];
              n = B[1];
              C.setFillType(
                "nonzero" === y ? a.FillType.Winding : a.FillType.EvenOdd,
              );
              return C.contains(k, n);
            };
            this.isPointInStroke = function (k, n) {
              var y = arguments;
              if (2 === y.length) var B = this.Xd;
              else if (
                3 ===
                  y.length
              ) {
                B = y[0], k = y[1], n = y[2];
              } else throw "invalid arg count, need 2 or 3, got " + y.length;
              if (!isFinite(k) || !isFinite(n)) return !1;
              y = this.sf([k, n]);
              k = y[0];
              n = y[1];
              B = B.copy();
              B.setFillType(a.FillType.Winding);
              B.stroke({
                width: this.lineWidth,
                miter_limit: this.miterLimit,
                cap: this.Ud.getStrokeCap(),
                join: this.Ud.getStrokeJoin(),
                precision: .3,
              });
              y = B.contains(k, n);
              B.delete();
              return y;
            };
            this.lineTo = function (k, n) {
              I(this.Xd, k, n);
            };
            this.moveTo = function (k, n) {
              var y = this.Xd;
              d([k, n]) && y.moveTo(k, n);
            };
            this.putImageData = function (k, n, y, B, C, E, L) {
              if (d([n, y, B, C, E, L])) {
                if (void 0 === B) {
                  this.Sd.writePixels(k.data, k.width, k.height, n, y);
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
                  var Y = a.XYWHRect(B, C, E, L);
                  n = a.XYWHRect(n + B, y + C, E, L);
                  y = a.Matrix.invert(this.Yd);
                  this.Sd.save();
                  this.Sd.concat(y);
                  this.Sd.drawImageRect(k, Y, n, null, !1);
                  this.Sd.restore();
                  k.delete();
                }
              }
            };
            this.quadraticCurveTo = function (k, n, y, B) {
              var C = this.Xd;
              d([k, n, y, B]) &&
                (C.isEmpty() && C.moveTo(k, n), C.quadTo(k, n, y, B));
            };
            this.rect = function (k, n, y, B) {
              var C = this.Xd;
              k = a.XYWHRect(k, n, y, B);
              d(k) && C.addRect(k);
            };
            this.resetTransform = function () {
              this.Xd.transform(this.Yd);
              var k = a.Matrix.invert(this.Yd);
              this.Sd.concat(k);
              this.Yd = this.Sd.getTotalMatrix();
            };
            this.restore = function () {
              var k = this.rf.pop();
              if (k) {
                var n = a.Matrix.multiply(this.Yd, a.Matrix.invert(k.Jf));
                this.Xd.transform(n);
                this.Ud.delete();
                this.Ud = k.fg;
                this.ye = k.bg;
                this.Oe = k.xg;
                this.le = k.wg;
                this.fe = k.fs;
                this.Ae = k.ug;
                this.Be = k.vg;
                this.ze = k.jg;
                this.Ne = k.tg;
                this.ne = k.Qf;
                this.Td = k.Rf;
                this.Me = k.cg;
                this.Ue = k.Pf;
                this.Sd.restore();
                this.Yd = this.Sd.getTotalMatrix();
              }
            };
            this.rotate = function (k) {
              if (isFinite(k)) {
                var n = a.Matrix.rotated(-k);
                this.Xd.transform(n);
                this.Sd.rotate(k / Math.PI * 180, 0, 0);
                this.Yd = this.Sd.getTotalMatrix();
              }
            };
            this.save = function () {
              if (this.fe.ve) {
                var k = this.fe.ve();
                this.Fe.push(k);
              } else k = this.fe;
              if (this.le.ve) {
                var n = this.le.ve();
                this.Fe.push(n);
              } else n = this.le;
              this.rf.push({
                Jf: this.Yd.slice(),
                bg: this.ye.slice(),
                xg: this.Oe,
                wg: n,
                fs: k,
                ug: this.Ae,
                vg: this.Be,
                jg: this.ze,
                tg: this.Ne,
                Qf: this.ne,
                cg: this.Me,
                Rf: this.Td,
                fg: this.Ud.copy(),
                Pf: this.Ue,
              });
              this.Sd.save();
            };
            this.scale = function (k, n) {
              if (d(arguments)) {
                var y = a.Matrix.scaled(1 / k, 1 / n);
                this.Xd.transform(y);
                this.Sd.scale(k, n);
                this.Yd = this.Sd.getTotalMatrix();
              }
            };
            this.setLineDash = function (k) {
              for (var n = 0; n < k.length; n++) {
                if (!isFinite(k[n]) || 0 > k[n]) return;
              }
              1 === k.length % 2 && Array.prototype.push.apply(k, k);
              this.ye = k;
            };
            this.setTransform = function (k, n, y, B, C, E) {
              d(arguments) &&
                (this.resetTransform(), this.transform(k, n, y, B, C, E));
            };
            this.ue = function () {
              var k = a.Matrix.invert(this.Yd);
              this.Sd.concat(k);
              this.Sd.concat(a.Matrix.translated(this.Ae, this.Be));
              this.Sd.concat(this.Yd);
            };
            this.Ce = function (k) {
              var n = a.multiplyByAlpha(this.Ne, this.ne);
              if (
                !a.getColorComponents(n)[3] || !(this.ze || this.Be || this.Ae)
              ) {
                return null;
              }
              k = k.copy();
              k.setColor(n);
              var y = a.MaskFilter.MakeBlur(
                a.BlurStyle.Normal,
                this.ze / 2,
                !1,
              );
              k.setMaskFilter(y);
              k.dispose = function () {
                y.delete();
                this.delete();
              };
              return k;
            };
            this.gf = function () {
              var k = this.Ud.copy();
              k.setStyle(a.PaintStyle.Stroke);
              if (f(this.le)) {
                var n = a.multiplyByAlpha(this.le, this.ne);
                k.setColor(n);
              } else {
                n = this.le.xe(this.Yd),
                  k.setColor(a.Color(0, 0, 0, this.ne)),
                  k.setShader(n);
              }
              k.setStrokeWidth(this.Oe);
              if (this.ye.length) {
                var y = a.PathEffect.MakeDash(this.ye, this.Me);
                k.setPathEffect(y);
              }
              k.dispose = function () {
                y &&
                  y.delete();
                this.delete();
              };
              return k;
            };
            this.stroke = function (k) {
              k = k ? k.$d : this.Xd;
              var n = this.gf(), y = this.Ce(n);
              y &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawPath(k, y),
                  this.Sd.restore(),
                  y.dispose());
              this.Sd.drawPath(k, n);
              n.dispose();
            };
            this.strokeRect = function (k, n, y, B) {
              var C = this.gf(), E = this.Ce(C);
              E &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawRect(a.XYWHRect(k, n, y, B), E),
                  this.Sd.restore(),
                  E.dispose());
              this.Sd.drawRect(a.XYWHRect(k, n, y, B), C);
              C.dispose();
            };
            this.strokeText = function (k, n, y) {
              var B = this.gf();
              k = a.TextBlob.MakeFromText(k, this.we);
              var C = this.Ce(B);
              C &&
                (this.Sd.save(),
                  this.ue(),
                  this.Sd.drawTextBlob(k, n, y, C),
                  this.Sd.restore(),
                  C.dispose());
              this.Sd.drawTextBlob(k, n, y, B);
              k.delete();
              B.dispose();
            };
            this.translate = function (k, n) {
              if (d(arguments)) {
                var y = a.Matrix.translated(-k, -n);
                this.Xd.transform(y);
                this.Sd.translate(k, n);
                this.Yd = this.Sd.getTotalMatrix();
              }
            };
            this.transform = function (k, n, y, B, C, E) {
              k = [k, y, C, n, B, E, 0, 0, 1];
              n = a.Matrix.invert(k);
              this.Xd.transform(n);
              this.Sd.concat(k);
              this.Yd = this.Sd.getTotalMatrix();
            };
            this.addHitRegion = function () {};
            this.clearHitRegions = function () {};
            this.drawFocusIfNeeded = function () {};
            this.removeHitRegion = function () {};
            this.scrollPathIntoView = function () {};
            Object.defineProperty(this, "canvas", {
              value: F,
              writable: !1,
            });
          }
          function z(F) {
            this.hf = F;
            this.re = new q(F.getCanvas());
            this.Ve = [];
            this.Cf = a.FontMgr.RefDefault();
            this.decodeImage = function (k) {
              k = a.MakeImageFromEncoded(k);
              if (!k) throw "Invalid input";
              this.Ve.push(k);
              return k;
            };
            this.loadFont = function (k, n) {
              k = this.Cf.MakeTypefaceFromData(k);
              if (!k) return null;
              this.Ve.push(k);
              var y = (n.style || "normal") + "|" + (n.variant || "normal") +
                "|" + (n.weight || "normal");
              n = n.family;
              la[n] || (la[n] = { "*": k });
              la[n][y] = k;
            };
            this.makePath2D = function (k) {
              k = new R(k);
              this.Ve.push(k.$d);
              return k;
            };
            this.getContext = function (k) {
              const ctx = "2d" === k ? this.re : null;
              if (null !== ctx && ctx.canvas) {
                ctx.canvas.width = this.width;
                ctx.canvas.height = this.height;
              }
              return ctx;
            };
            this.getRawBuffer = function (k, n, y, B) {
              return this.hf.getCanvas().readPixels(k || 0, n || 0, {
                width: y || this.width,
                height: B || this.height,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
                raw: true,
              });
            };
            this.toDataURL = function (k, n) {
              this.hf.flush();
              var y = this.hf.makeImageSnapshot();
              if (y) {
                k = k || "image/png";
                var B = a.ImageFormat.PNG;
                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                if (n = y.encodeToBytes(B, n || .92)) {
                  y.delete();
                  k = "data:" + k + ";base64,";
                  n = encodeBase64(n);
                  return k + n;
                }
              }
            };
            this.toBuffer = function (k, n) {
              this.hf.flush();
              var y = this.hf.makeImageSnapshot();
              if (y) {
                k = k || "image/png";
                var B = a.ImageFormat.PNG;
                "image/jpeg" === k && (B = a.ImageFormat.JPEG);
                if (n = y.encodeToBytes(B, n || .92)) {
                  y.delete();
                  return n;
                }
              }
            };
            this.dispose = function () {
              this.re.pe();
              this.Ve.forEach(function (k) {
                k.delete();
              });
              this.hf.dispose();
            };
          }
          function D(F, k, n) {
            if (!k || 0 === n) {
              throw "invalid dimensions, width and height must be non-zero";
            }
            if (F.length % 4) throw "arr must be a multiple of 4";
            n = n || F.length / (4 * k);
            Object.defineProperty(this, "data", { value: F, writable: !1 });
            Object.defineProperty(this, "height", { value: n, writable: !1 });
            Object.defineProperty(this, "width", { value: k, writable: !1 });
          }
          function J(F, k, n, y) {
            this.be = null;
            this.ie = [];
            this.de = [];
            this.addColorStop = function (B, C) {
              if (0 > B || 1 < B || !isFinite(B)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              C = h(C);
              var E = this.de.indexOf(B);
              if (-1 !== E) this.ie[E] = C;
              else {
                for (E = 0; E < this.de.length && !(this.de[E] > B); E++);
                this.de.splice(E, 0, B);
                this.ie.splice(E, 0, C);
              }
            };
            this.ve = function () {
              var B = new J(F, k, n, y);
              B.ie = this.ie.slice();
              B.de = this.de.slice();
              return B;
            };
            this.pe = function () {
              this.be && (this.be.delete(), this.be = null);
            };
            this.xe = function (B) {
              var C = [F, k, n, y];
              a.Matrix.mapPoints(B, C);
              B = C[0];
              var E = C[1], L = C[2];
              C = C[3];
              this.pe();
              return this.be = a.Shader.MakeLinearGradient(
                [B, E],
                [L, C],
                this.ie,
                this.de,
                a.TileMode.Clamp,
              );
            };
          }
          function N(F, k, n, y, B, C) {
            if (d([k, n, y, B, C])) {
              if (0 > C) throw "radii cannot be negative";
              F.isEmpty() && F.moveTo(k, n);
              F.arcToTangent(k, n, y, B, C);
            }
          }
          function Q(F) {
            if (!F.isEmpty()) {
              var k = F.getBounds();
              (k[3] - k[1] || k[2] - k[0]) && F.close();
            }
          }
          function U(F, k, n, y, B, C, E) {
            E = (E - C) /
              Math.PI * 180;
            C = C / Math.PI * 180;
            k = a.LTRBRect(k - y, n - B, k + y, n + B);
            1E-5 > Math.abs(Math.abs(E) - 360)
              ? (n = E / 2,
                F.arcToOval(k, C, n, !1),
                F.arcToOval(k, C + n, n, !1))
              : F.arcToOval(k, C, E, !1);
          }
          function t(F, k, n, y, B, C, E, L, Y) {
            if (d([k, n, y, B, C, E, L])) {
              if (0 > y || 0 > B) throw "radii cannot be negative";
              var qa = 2 * Math.PI, fa = E % qa;
              0 > fa && (fa += qa);
              var Ia = fa - E;
              E = fa;
              L += Ia;
              !Y && L - E >= qa
                ? L = E + qa
                : Y && E - L >= qa
                ? L = E - qa
                : !Y && E > L
                ? L = E + (qa - (E - L) % qa)
                : Y && E < L && (L = E - (qa - (L - E) % qa));
              C
                ? (Y = a.Matrix.rotated(C, k, n),
                  C = a.Matrix.rotated(-C, k, n),
                  F.transform(C),
                  U(F, k, n, y, B, E, L),
                  F.transform(Y))
                : U(F, k, n, y, B, E, L);
            }
          }
          function I(F, k, n) {
            d([k, n]) && (F.isEmpty() && F.moveTo(k, n), F.lineTo(k, n));
          }
          function R(F) {
            this.$d = null;
            this.$d = "string" === typeof F
              ? a.Path.MakeFromSVGString(F)
              : F && F.ef
              ? F.$d.copy()
              : new a.Path();
            this.ef = function () {
              return this.$d;
            };
            this.addPath = function (k, n) {
              n || (n = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
              this.$d.addPath(k.$d, [n.a, n.c, n.e, n.b, n.d, n.f]);
            };
            this.arc = function (k, n, y, B, C, E) {
              t(this.$d, k, n, y, y, 0, B, C, E);
            };
            this.arcTo = function (k, n, y, B, C) {
              N(this.$d, k, n, y, B, C);
            };
            this.bezierCurveTo = function (k, n, y, B, C, E) {
              var L = this.$d;
              d([k, n, y, B, C, E]) &&
                (L.isEmpty() && L.moveTo(k, n), L.cubicTo(k, n, y, B, C, E));
            };
            this.closePath = function () {
              Q(this.$d);
            };
            this.ellipse = function (k, n, y, B, C, E, L, Y) {
              t(this.$d, k, n, y, B, C, E, L, Y);
            };
            this.lineTo = function (k, n) {
              I(this.$d, k, n);
            };
            this.moveTo = function (k, n) {
              var y = this.$d;
              d([k, n]) && y.moveTo(k, n);
            };
            this.quadraticCurveTo = function (k, n, y, B) {
              var C = this.$d;
              d([k, n, y, B]) &&
                (C.isEmpty() && C.moveTo(k, n), C.quadTo(k, n, y, B));
            };
            this.rect = function (k, n, y, B) {
              var C = this.$d;
              k = a.XYWHRect(k, n, y, B);
              d(k) && C.addRect(k);
            };
          }
          function aa(F, k) {
            this.be = null;
            this.Ef = F;
            this._transform = a.Matrix.identity();
            "" === k && (k = "repeat");
            switch (k) {
              case "repeat-x":
                this.De = a.TileMode.Repeat;
                this.Ee = a.TileMode.Decal;
                break;
              case "repeat-y":
                this.De = a.TileMode.Decal;
                this.Ee = a.TileMode.Repeat;
                break;
              case "repeat":
                this.Ee = this.De = a.TileMode.Repeat;
                break;
              case "no-repeat":
                this.Ee = this.De = a.TileMode.Decal;
                break;
              default:
                throw "invalid repetition mode " + k;
            }
            this.setTransform = function (n) {
              n = [n.a, n.c, n.e, n.b, n.d, n.f, 0, 0, 1];
              d(n) && (this._transform = n);
            };
            this.ve = function () {
              var n = new aa();
              n.De = this.De;
              n.Ee = this.Ee;
              return n;
            };
            this.pe = function () {
              this.be && (this.be.delete(), this.be = null);
            };
            this.xe = function () {
              this.pe();
              return this.be = this.Ef.makeShaderCubic(
                this.De,
                this.Ee,
                1 / 3,
                1 / 3,
                this._transform,
              );
            };
          }
          function ka(F, k, n, y, B, C) {
            this.be = null;
            this.ie = [];
            this.de = [];
            this.addColorStop = function (E, L) {
              if (0 > E || 1 < E || !isFinite(E)) {
                throw "offset must be between 0 and 1 inclusively";
              }
              L = h(L);
              var Y = this.de.indexOf(E);
              if (-1 !== Y) this.ie[Y] = L;
              else {
                for (Y = 0; Y < this.de.length && !(this.de[Y] > E); Y++);
                this.de.splice(Y, 0, E);
                this.ie.splice(Y, 0, L);
              }
            };
            this.ve = function () {
              var E = new ka(F, k, n, y, B, C);
              E.ie = this.ie.slice();
              E.de = this.de.slice();
              return E;
            };
            this.pe = function () {
              this.be && (this.be.delete(), this.be = null);
            };
            this.xe = function (E) {
              var L = [F, k, y, B];
              a.Matrix.mapPoints(E, L);
              var Y = L[0], qa = L[1], fa = L[2];
              L = L[3];
              var Ia = (Math.abs(E[0]) + Math.abs(E[4])) / 2;
              E = n * Ia;
              Ia *= C;
              this.pe();
              return this.be = a.Shader.MakeTwoPointConicalGradient(
                [Y, qa],
                E,
                [fa, L],
                Ia,
                this.ie,
                this.de,
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
          a._testing.parseColor = h;
          a._testing.colorToString = e;
          var va =
              /(italic|oblique|normal|)\s*(small-caps|normal|)\s*(bold|bolder|lighter|[1-9]00|normal|)\s*([\d\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)/,
            la = { "Noto Mono": { "*": null }, monospace: { "*": null } };
          a._testing.parseFontString = m;
          a.MakeCanvas = function (F, k) {
            const canvas = (F = a.MakeSurface(F, k)) ? new z(F) : null;
            if (null !== canvas) {
              canvas.width = F.Gf;
              canvas.height = F.Df;
            }
            return canvas;
          };
          a.ImageData = function () {
            if (2 === arguments.length) {
              var F = arguments[0], k = arguments[1];
              return new D(new Uint8ClampedArray(4 * F * k), F, k);
            }
            if (3 === arguments.length) {
              var n = arguments[0];
              if (n.prototype.constructor !== Uint8ClampedArray) {
                throw "bytes must be given as a Uint8ClampedArray";
              }
              F = arguments[1];
              k = arguments[2];
              if (n % 4) throw "bytes must be given in a multiple of 4";
              if (n % F) throw "bytes must divide evenly by width";
              if (k && k !== n / (4 * F)) throw "invalid height given";
              return new D(n, F, n / (4 * F));
            }
            throw "invalid number of arguments - takes 2 or 3, saw " +
              arguments.length;
          };
        })();
      })(r);
      var sa = {}, ta;
      for (ta in r) r.hasOwnProperty(ta) && (sa[ta] = r[ta]);
      var wa = "./this.program";
      function xa(a, b) {
        throw b;
      }
      var ya = !1, za = !1, Aa = !1, Ba = !1;
      ya = "object" === typeof window;
      za = "function" === typeof importScripts;
      Aa = "object" === typeof process &&
        "object" === typeof process.versions &&
        "string" === typeof process.versions.node;
      Ba = !ya && !Aa && !za;
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
          1 < process.argv.length && (wa = process.argv[1].replace(/\\/g, "/")),
          process.argv.slice(2),
          process.on("uncaughtException", function (a) {
            if (!(a instanceof Ka)) throw a;
          }),
          process.on("unhandledRejection", La),
          xa = function (a) {
            process.exit(a);
          },
          r.inspect = function () {
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
          "function" === typeof quit && (xa = function (a) {
            quit(a);
          }),
          "undefined" !== typeof print &&
          ("undefined" === typeof console && (console = {}),
            console.log = print,
            console.warn = console.error = "undefined" !== typeof printErr
              ? printErr
              : print);
      } else if (ya || za) {
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
      var Ma = r.print || console.log.bind(console),
        Pa = r.printErr || console.warn.bind(console);
      for (ta in sa) sa.hasOwnProperty(ta) && (r[ta] = sa[ta]);
      sa = null;
      r.thisProgram && (wa = r.thisProgram);
      r.quit && (xa = r.quit);
      var Qa = 0, Ra;
      r.wasmBinary && (Ra = r.wasmBinary);
      var noExitRuntime = r.noExitRuntime || !0;
      "object" !== typeof WebAssembly && La("no native wasm support detected");
      var Sa, Ta = !1;
      function assert(a, b) {
        a || La("Assertion failed: " + b);
      }
      var Ua = "undefined" !== typeof TextDecoder
        ? new TextDecoder("utf8")
        : void 0;
      function Wa(a, b, c) {
        var f = b + c;
        for (c = b; a[c] && !(c >= f);) ++c;
        if (16 < c - b && a.subarray && Ua) return Ua.decode(a.subarray(b, c));
        for (f = ""; b < c;) {
          var g = a[b++];
          if (g & 128) {
            var l = a[b++] & 63;
            if (192 == (g & 224)) f += String.fromCharCode((g & 31) << 6 | l);
            else {
              var p = a[b++] & 63;
              g = 224 == (g & 240)
                ? (g & 15) << 12 | l << 6 | p
                : (g & 7) << 18 | l << 12 | p << 6 | a[b++] & 63;
              65536 > g
                ? f += String.fromCharCode(g)
                : (g -= 65536,
                  f += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
            }
          } else f += String.fromCharCode(g);
        }
        return f;
      }
      function Xa(a, b) {
        return a ? Wa(G, a, b) : "";
      }
      function ra(a, b, c, f) {
        if (!(0 < f)) return 0;
        var g = c;
        f = c + f - 1;
        for (var l = 0; l < a.length; ++l) {
          var p = a.charCodeAt(l);
          if (55296 <= p && 57343 >= p) {
            var u = a.charCodeAt(++l);
            p = 65536 + ((p & 1023) << 10) | u & 1023;
          }
          if (127 >= p) {
            if (c >= f) break;
            b[c++] = p;
          } else {
            if (2047 >= p) {
              if (c + 1 >= f) break;
              b[c++] = 192 | p >> 6;
            } else {
              if (65535 >= p) {
                if (c + 2 >= f) break;
                b[c++] = 224 | p >> 12;
              } else {
                if (c + 3 >= f) break;
                b[c++] = 240 | p >> 18;
                b[c++] = 128 | p >> 12 & 63;
              }
              b[c++] = 128 | p >> 6 & 63;
            }
            b[c++] = 128 | p & 63;
          }
        }
        b[c] = 0;
        return c - g;
      }
      function oa(a) {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          55296 <= f && 57343 >= f &&
            (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++c) & 1023);
          127 >= f ? ++b : b = 2047 >= f ? b + 2 : 65535 >= f ? b + 3 : b + 4;
        }
        return b;
      }
      var Ya = "undefined" !== typeof TextDecoder
        ? new TextDecoder("utf-16le")
        : void 0;
      function Za(a, b) {
        var c = a >> 1;
        for (var f = c + b / 2; !(c >= f) && $a[c];) ++c;
        c <<= 1;
        if (32 < c - a && Ya) return Ya.decode(G.subarray(a, c));
        c = "";
        for (f = 0; !(f >= b / 2); ++f) {
          var g = ab[a + 2 * f >> 1];
          if (0 == g) break;
          c += String.fromCharCode(g);
        }
        return c;
      }
      function bb(a, b, c) {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var f = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var g = 0; g < c; ++g) ab[b >> 1] = a.charCodeAt(g), b += 2;
        ab[b >> 1] = 0;
        return b - f;
      }
      function cb(a) {
        return 2 * a.length;
      }
      function db(a, b) {
        for (var c = 0, f = ""; !(c >= b / 4);) {
          var g = P[a + 4 * c >> 2];
          if (0 == g) break;
          ++c;
          65536 <= g
            ? (g -= 65536,
              f += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023))
            : f += String.fromCharCode(g);
        }
        return f;
      }
      function eb(a, b, c) {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var f = b;
        c = f + c - 4;
        for (var g = 0; g < a.length; ++g) {
          var l = a.charCodeAt(g);
          if (55296 <= l && 57343 >= l) {
            var p = a.charCodeAt(++g);
            l = 65536 + ((l & 1023) << 10) | p & 1023;
          }
          P[b >> 2] = l;
          b += 4;
          if (b + 4 > c) break;
        }
        P[b >> 2] = 0;
        return b - f;
      }
      function fb(a) {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          55296 <= f && 57343 >= f && ++c;
          b += 4;
        }
        return b;
      }
      var gb, lb, G, ab, $a, P, mb, S, nb;
      function ob() {
        var a = Sa.buffer;
        gb = a;
        r.HEAP8 = lb = new Int8Array(a);
        r.HEAP16 = ab = new Int16Array(a);
        r.HEAP32 = P = new Int32Array(a);
        r.HEAPU8 = G = new Uint8Array(a);
        r.HEAPU16 = $a = new Uint16Array(a);
        r.HEAPU32 = mb = new Uint32Array(a);
        r.HEAPF32 = S = new Float32Array(a);
        r.HEAPF64 = nb = new Float64Array(a);
      }
      var pb, qb = [], rb = [], sb = [];
      function tb() {
        var a = r.preRun.shift();
        qb.unshift(a);
      }
      var ub = 0, vb = null, wb = null;
      r.preloadedImages = {};
      r.preloadedAudios = {};
      function La(a) {
        if (r.onAbort) r.onAbort(a);
        Pa(a);
        Ta = !0;
        a = new WebAssembly.RuntimeError(
          "abort(" + a + "). Build with -s ASSERTIONS=1 for more info.",
        );
        ea(a);
        throw a;
      }
      function xb() {
        return yb.startsWith("data:application/octet-stream;base64,");
      }
      var yb = "canvaskit.wasm";
      if (!xb()) {
        var zb = yb;
        yb = r.locateFile ? r.locateFile(zb, Ca) : Ca + zb;
      }
      function Ab() {
        var a = yb;
        try {
          if (a == yb && Ra) return new Uint8Array(Ra);
          if (Fa) return Fa(a);
          throw "both async and sync fetching of the wasm failed";
        } catch (b) {
          La(b);
        }
      }
      function Bb() {
        if (!Ra && (ya || za)) {
          if ("function" === typeof fetch && !yb.startsWith("file://")) {
            return fetch(yb, { credentials: "same-origin" }).then(function (a) {
              if (!a.ok) {
                throw "failed to load wasm binary file at '" + yb + "'";
              }
              return a.arrayBuffer();
            }).catch(function () {
              return Ab();
            });
          }
          if (Ea) {
            return new Promise(function (a, b) {
              Ea(yb, function (c) {
                a(new Uint8Array(c));
              }, b);
            });
          }
        }
        return Promise.resolve().then(function () {
          return Ab();
        });
      }
      function Db(a) {
        for (; 0 < a.length;) {
          var b = a.shift();
          if ("function" == typeof b) b(r);
          else {
            var c = b.Gg;
            "number" === typeof c
              ? void 0 === b.jf ? pb.get(c)() : pb.get(c)(b.jf)
              : c(void 0 === b.jf ? null : b.jf);
          }
        }
      }
      function Eb(a) {
        this.Vd = a - 16;
        this.og = function (b) {
          P[this.Vd + 8 >> 2] = b;
        };
        this.lg = function (b) {
          P[this.Vd + 0 >> 2] = b;
        };
        this.mg = function () {
          P[this.Vd + 4 >> 2] = 0;
        };
        this.kg = function () {
          lb[this.Vd + 12 >> 0] = 0;
        };
        this.ng = function () {
          lb[this.Vd + 13 >> 0] = 0;
        };
        this.Zf = function (b, c) {
          this.og(b);
          this.lg(c);
          this.mg();
          this.kg();
          this.ng();
        };
      }
      var Fb = 0, Gb = {}, Hb = [null, [], []], Ib = {}, Jb = {};
      function Kb(a) {
        for (; a.length;) {
          var b = a.pop();
          a.pop()(b);
        }
      }
      function Lb(a) {
        return this.fromWireType(mb[a >> 2]);
      }
      var Mb = {}, Nb = {}, Ob = {};
      function Pb(a) {
        if (void 0 === a) return "_unknown";
        a = a.replace(/[^a-zA-Z0-9_]/g, "$");
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? "_" + a : a;
      }
      function Qb(a, b) {
        a = Pb(a);
        return (new Function(
          "body",
          "return function " + a +
            '() {\n    "use strict";    return body.apply(this, arguments);\n};\n',
        ))(b);
      }
      function Rb(a) {
        var b = Error,
          c = Qb(a, function (f) {
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
      var Sb = void 0;
      function Tb(a) {
        throw new Sb(a);
      }
      function Ub(a, b, c) {
        function f(u) {
          u = c(u);
          u.length !== a.length && Tb("Mismatched type converter count");
          for (var x = 0; x < a.length; ++x) Vb(a[x], u[x]);
        }
        a.forEach(function (u) {
          Ob[u] = b;
        });
        var g = Array(b.length), l = [], p = 0;
        b.forEach(function (u, x) {
          Nb.hasOwnProperty(u)
            ? g[x] = Nb[u]
            : (l.push(u),
              Mb.hasOwnProperty(u) || (Mb[u] = []),
              Mb[u].push(function () {
                g[x] = Nb[u];
                ++p;
                p === l.length && f(g);
              }));
        });
        0 === l.length && f(g);
      }
      function Wb(a) {
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
      var Xb = void 0;
      function Yb(a) {
        for (var b = ""; G[a];) b += Xb[G[a++]];
        return b;
      }
      var Zb = void 0;
      function V(a) {
        throw new Zb(a);
      }
      function Vb(a, b, c) {
        c = c || {};
        if (!("argPackAdvance" in b)) {
          throw new TypeError(
            "registerType registeredInstance requires argPackAdvance",
          );
        }
        var f = b.name;
        a || V('type "' + f + '" must have a positive integer typeid pointer');
        if (Nb.hasOwnProperty(a)) {
          if (c.Yf) return;
          V("Cannot register type '" + f + "' twice");
        }
        Nb[a] = b;
        delete Ob[a];
        Mb.hasOwnProperty(a) &&
          (b = Mb[a],
            delete Mb[a],
            b.forEach(function (g) {
              g();
            }));
      }
      function $b(a) {
        V(a.Rd.ae.Wd.name + " instance already deleted");
      }
      var ac = !1;
      function bc() {}
      function cc(a) {
        --a.count.value;
        0 === a.count.value && (a.he ? a.ke.oe(a.he) : a.ae.Wd.oe(a.Vd));
      }
      function dc(a) {
        if ("undefined" === typeof FinalizationGroup) {
          return dc = function (b) {
            return b;
          },
            a;
        }
        ac = new FinalizationGroup(function (b) {
          for (var c = b.next(); !c.done; c = b.next()) {
            c = c.value,
              c.Vd ? cc(c) : console.warn("object already deleted: " + c.Vd);
          }
        });
        dc = function (b) {
          ac.register(b, b.Rd, b.Rd);
          return b;
        };
        bc = function (b) {
          ac.unregister(b.Rd);
        };
        return dc(a);
      }
      var lc = void 0, mc = [];
      function nc() {
        for (; mc.length;) {
          var a = mc.pop();
          a.Rd.Ie = !1;
          a["delete"]();
        }
      }
      function oc() {}
      var pc = {};
      function qc(a, b, c) {
        if (void 0 === a[b].ce) {
          var f = a[b];
          a[b] = function () {
            a[b].ce.hasOwnProperty(arguments.length) ||
              V(
                "Function '" + c +
                  "' called with an invalid number of arguments (" +
                  arguments.length + ") - expects one of (" + a[b].ce + ")!",
              );
            return a[b].ce[arguments.length].apply(this, arguments);
          };
          a[b].ce = [];
          a[b].ce[f.Ge] = f;
        }
      }
      function rc(a, b, c) {
        r.hasOwnProperty(a)
          ? ((void 0 === c || void 0 !== r[a].ce && void 0 !== r[a].ce[c]) &&
            V("Cannot register public name '" + a + "' twice"),
            qc(r, a, a),
            r.hasOwnProperty(c) &&
            V(
              "Cannot register multiple overloads of a function with the same number of arguments (" +
                c + ")!",
            ),
            r[a].ce[c] = b)
          : (r[a] = b, void 0 !== c && (r[a].Ig = c));
      }
      function sc(a, b, c, f, g, l, p, u) {
        this.name = a;
        this.constructor = b;
        this.Je = c;
        this.oe = f;
        this.me = g;
        this.Sf = l;
        this.Se = p;
        this.Mf = u;
        this.hg = [];
      }
      function tc(a, b, c) {
        for (; b !== c;) {
          b.Se ||
          V(
            "Expected null or instance of " + c.name + ", got an instance of " +
              b.name,
          ),
            a = b.Se(a),
            b = b.me;
        }
        return a;
      }
      function uc(a, b) {
        if (null === b) {
          return this.lf && V("null is not a valid " + this.name), 0;
        }
        b.Rd || V('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Rd.Vd ||
          V("Cannot pass deleted object as a pointer of type " + this.name);
        return tc(b.Rd.Vd, b.Rd.ae.Wd, this.Wd);
      }
      function wc(a, b) {
        if (null === b) {
          this.lf && V("null is not a valid " + this.name);
          if (this.Xe) {
            var c = this.mf();
            null !== a && a.push(this.oe, c);
            return c;
          }
          return 0;
        }
        b.Rd || V('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Rd.Vd ||
          V("Cannot pass deleted object as a pointer of type " + this.name);
        !this.We && b.Rd.ae.We &&
          V(
            "Cannot convert argument of type " + (b.Rd.ke
              ? b.Rd.ke.name
              : b.Rd.ae.name) + " to parameter type " + this.name,
          );
        c = tc(b.Rd.Vd, b.Rd.ae.Wd, this.Wd);
        if (this.Xe) {
          switch (
            void 0 === b.Rd.he &&
            V("Passing raw pointer to smart pointer is illegal"), this.sg
          ) {
            case 0:
              b.Rd.ke === this
                ? c = b.Rd.he
                : V(
                  "Cannot convert argument of type " + (b.Rd.ke
                    ? b.Rd.ke.name
                    : b.Rd.ae.name) + " to parameter type " + this.name,
                );
              break;
            case 1:
              c = b.Rd.he;
              break;
            case 2:
              if (b.Rd.ke === this) c = b.Rd.he;
              else {
                var f = b.clone();
                c = this.ig(
                  c,
                  xc(function () {
                    f["delete"]();
                  }),
                );
                null !== a && a.push(this.oe, c);
              }
              break;
            default:
              V("Unsupporting sharing policy");
          }
        }
        return c;
      }
      function yc(a, b) {
        if (null === b) {
          return this.lf && V("null is not a valid " + this.name), 0;
        }
        b.Rd || V('Cannot pass "' + vc(b) + '" as a ' + this.name);
        b.Rd.Vd ||
          V("Cannot pass deleted object as a pointer of type " + this.name);
        b.Rd.ae.We &&
          V(
            "Cannot convert argument of type " + b.Rd.ae.name +
              " to parameter type " + this.name,
          );
        return tc(b.Rd.Vd, b.Rd.ae.Wd, this.Wd);
      }
      function zc(a, b, c) {
        if (b === c) return a;
        if (void 0 === c.me) return null;
        a = zc(a, b, c.me);
        return null === a ? null : c.Mf(a);
      }
      var Ac = {};
      function Bc(a, b) {
        for (void 0 === b && V("ptr should not be undefined"); a.me;) {
          b = a.Se(b), a = a.me;
        }
        return Ac[b];
      }
      function Cc(a, b) {
        b.ae && b.Vd || Tb("makeClassHandle requires ptr and ptrType");
        !!b.ke !== !!b.he &&
          Tb("Both smartPtrType and smartPtr must be specified");
        b.count = { value: 1 };
        return dc(Object.create(a, { Rd: { value: b } }));
      }
      function Dc(a, b, c, f, g, l, p, u, x, w, H) {
        this.name = a;
        this.Wd = b;
        this.lf = c;
        this.We = f;
        this.Xe = g;
        this.gg = l;
        this.sg = p;
        this.Af = u;
        this.mf = x;
        this.ig = w;
        this.oe = H;
        g || void 0 !== b.me
          ? this.toWireType = wc
          : (this.toWireType = f ? uc : yc, this.je = null);
      }
      function Ec(a, b, c) {
        r.hasOwnProperty(a) || Tb("Replacing nonexistant public symbol");
        void 0 !== r[a].ce && void 0 !== c
          ? r[a].ce[c] = b
          : (r[a] = b, r[a].Ge = c);
      }
      function Fc(a, b) {
        var c = [];
        return function () {
          c.length = arguments.length;
          for (var f = 0; f < arguments.length; f++) c[f] = arguments[f];
          a.includes("j")
            ? (f = r["dynCall_" + a],
              f = c && c.length
                ? f.apply(null, [b].concat(c))
                : f.call(null, b))
            : f = pb.get(b).apply(null, c);
          return f;
        };
      }
      function Gc(a, b) {
        a = Yb(a);
        var c = a.includes("j") ? Fc(a, b) : pb.get(b);
        "function" !== typeof c &&
          V("unknown function pointer with signature " + a + ": " + b);
        return c;
      }
      var Hc = void 0;
      function Ic(a) {
        a = Jc(a);
        var b = Yb(a);
        Kc(a);
        return b;
      }
      function Tc(a, b) {
        function c(l) {
          g[l] || Nb[l] || (Ob[l] ? Ob[l].forEach(c) : (f.push(l), g[l] = !0));
        }
        var f = [], g = {};
        b.forEach(c);
        throw new Hc(a + ": " + f.map(Ic).join([", "]));
      }
      function Uc(a) {
        var b = Function;
        if (!(b instanceof Function)) {
          throw new TypeError(
            "new_ called with constructor type " + typeof b +
              " which is not a function",
          );
        }
        var c = Qb(b.name || "unknownFunctionName", function () {});
        c.prototype = b.prototype;
        c = new c();
        a = b.apply(c, a);
        return a instanceof Object ? a : c;
      }
      function Vc(a, b, c, f, g) {
        var l = b.length;
        2 > l &&
          V("argTypes array size mismatch! Must at least get return value and 'this' types!");
        var p = null !== b[1] && null !== c, u = !1;
        for (c = 1; c < b.length; ++c) {
          if (null !== b[c] && void 0 === b[c].je) {
            u = !0;
            break;
          }
        }
        var x = "void" !== b[0].name, w = "", H = "";
        for (c = 0; c < l - 2; ++c) {
          w += (0 !== c ? ", " : "") + "arg" + c,
            H += (0 !== c ? ", " : "") + "arg" + c + "Wired";
        }
        a = "return function " + Pb(a) + "(" + w +
          ") {\nif (arguments.length !== " + (l - 2) +
          ") {\nthrowBindingError('function " + a +
          " called with ' + arguments.length + ' arguments, expected " +
          (l - 2) + " args!');\n}\n";
        u && (a += "var destructors = [];\n");
        var K = u ? "destructors" : "null";
        w = "throwBindingError invoker fn runDestructors retType classParam"
          .split(" ");
        f = [V, f, g, Kb, b[0], b[1]];
        p && (a += "var thisWired = classParam.toWireType(" + K + ", this);\n");
        for (c = 0; c < l - 2; ++c) {
          a += "var arg" + c + "Wired = argType" + c + ".toWireType(" + K +
            ", arg" + c + "); // " + b[c + 2].name + "\n",
            w.push("argType" + c),
            f.push(b[c + 2]);
        }
        p && (H = "thisWired" + (0 < H.length ? ", " : "") + H);
        a += (x ? "var rv = " : "") + "invoker(fn" + (0 < H.length
          ? ", "
          : "") +
          H + ");\n";
        if (u) a += "runDestructors(destructors);\n";
        else {
          for (c = p ? 1 : 2; c < b.length; ++c) {
            l = 1 === c ? "thisWired" : "arg" + (c - 2) + "Wired",
              null !== b[c].je &&
              (a += l + "_dtor(" + l + "); // " + b[c].name + "\n",
                w.push(l + "_dtor"),
                f.push(b[c].je));
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
        4 < a && 0 === --Yc[a].nf && (Yc[a] = void 0, Xc.push(a));
      }
      function xc(a) {
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
            Yc[b] = { nf: 1, value: a };
            return b;
        }
      }
      function $c(a, b, c) {
        switch (b) {
          case 0:
            return function (f) {
              return this.fromWireType((c ? lb : G)[f]);
            };
          case 1:
            return function (f) {
              return this.fromWireType((c ? ab : $a)[f >> 1]);
            };
          case 2:
            return function (f) {
              return this.fromWireType((c ? P : mb)[f >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      function ad(a, b) {
        var c = Nb[a];
        void 0 === c && V(b + " has unknown type " + Ic(a));
        return c;
      }
      function vc(a) {
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
      function cd(a, b, c) {
        switch (b) {
          case 0:
            return c
              ? function (f) {
                return lb[f];
              }
              : function (f) {
                return G[f];
              };
          case 1:
            return c
              ? function (f) {
                return ab[f >> 1];
              }
              : function (f) {
                return $a[f >> 1];
              };
          case 2:
            return c
              ? function (f) {
                return P[f >> 2];
              }
              : function (f) {
                return mb[f >> 2];
              };
          default:
            throw new TypeError("Unknown integer type: " + a);
        }
      }
      function dd(a) {
        a || V("Cannot use deleted val. handle = " + a);
        return Yc[a].value;
      }
      var ed = {};
      function fd(a) {
        var b = ed[a];
        return void 0 === b ? Yb(a) : b;
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
          a.drawArraysInstanced = function (c, f, g, l) {
            b.drawArraysInstancedANGLE(c, f, g, l);
          },
          a.drawElementsInstanced = function (c, f, g, l, p) {
            b.drawElementsInstancedANGLE(c, f, g, l, p);
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
        na = [],
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
      function ha(a, b) {
        a.xf || (a.xf = a.getContext,
          a.getContext = function (f, g) {
            g = a.xf(f, g);
            return "webgl" == f == g instanceof WebGLRenderingContext
              ? g
              : null;
          });
        var c = 1 < b.majorVersion
          ? a.getContext("webgl2", b)
          : a.getContext("webgl", b);
        return c ? Fd(c, b) : 0;
      }
      function Fd(a, b) {
        var c = Ed(ma),
          f = { yf: c, attributes: b, version: b.majorVersion, qe: a };
        a.canvas && (a.canvas.qf = f);
        ma[c] = f;
        ("undefined" === typeof b.Nf || b.Nf) && Id(f);
        return c;
      }
      function ia(a) {
        v = ma[a];
        r.Fg = W = v && v.qe;
        return !(a && !W);
      }
      function Id(a) {
        a || (a = v);
        if (!a.$f) {
          a.$f = !0;
          var b = a.qe;
          nd(b);
          od(b);
          pd(b);
          b.uf = b.getExtension(
            "WEBGL_draw_instanced_base_vertex_base_instance",
          );
          b.zf = b.getExtension(
            "WEBGL_multi_draw_instanced_base_vertex_base_instance",
          );
          2 <= a.version &&
            (b.vf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
          if (2 > a.version || !b.vf) {
            b.vf = b.getExtension("EXT_disjoint_timer_query");
          }
          b.Hg = b.getExtension("WEBGL_multi_draw");
          (b.getSupportedExtensions() || []).forEach(function (c) {
            c.includes("lose_context") || c.includes("debug") ||
              b.getExtension(c);
          });
        }
      }
      var v, Dd, Jd = [];
      function Kd(a, b, c, f) {
        for (var g = 0; g < a; g++) {
          var l = W[c](), p = l && Ed(f);
          l ? (l.name = p, f[p] = l) : Cd(1282);
          P[b + 4 * g >> 2] = p;
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
              var f = W.getParameter(34467);
              c = f ? f.length : 0;
              break;
            case 33309:
              if (2 > v.version) {
                Cd(1282);
                return;
              }
              c = 2 * (W.getSupportedExtensions() || []).length;
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
            switch (f = W.getParameter(a), typeof f) {
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
                  } catch (g) {
                    Cd(1280);
                    Pa(
                      "GL_INVALID_ENUM in glGet0v: Unknown object returned from WebGL getParameter(" +
                        a + ")! (error: " + g + ")",
                    );
                    return;
                  }
                }
                break;
              default:
                Cd(1280);
                Pa(
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
        var b = oa(a) + 1, c = Nd(b);
        ra(a, G, c, b);
        return c;
      }
      function Od(a) {
        a -= 5120;
        return 0 == a
          ? lb
          : 1 == a
          ? G
          : 2 == a
          ? ab
          : 4 == a
          ? P
          : 6 == a
          ? S
          : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
          ? mb
          : $a;
      }
      function Pd(a, b, c, f, g) {
        a = Od(a);
        var l = 31 - Math.clz32(a.BYTES_PER_ELEMENT), p = Bd;
        return a.subarray(
          g >> l,
          g + f *
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
                        }[b - 6402] || 1) * (1 << l) + p - 1 & -p) >> l,
        );
      }
      function Z(a) {
        var b = W.Kf, c = b.df[a];
        0 <= c &&
          (b.df[a] = c = W.getUniformLocation(
            b,
            b.Bf[a] + (0 < c ? "[" + c + "]" : ""),
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
              LANG:
                ("object" === typeof navigator && navigator.languages &&
                    navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
              _: wa || "./this.program",
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
        function g(A, M, X) {
          for (
            A = "number" === typeof A ? A.toString() : A || ""; A.length < M;
          ) {
            A = X[0] + A;
          }
          return A;
        }
        function l(A, M) {
          return g(A, M, "0");
        }
        function p(A, M) {
          function X(ba) {
            return 0 > ba ? -1 : 0 < ba ? 1 : 0;
          }
          var da;
          0 === (da = X(A.getFullYear() - M.getFullYear())) &&
            0 === (da = X(A.getMonth() - M.getMonth())) &&
            (da = X(A.getDate() - M.getDate()));
          return da;
        }
        function u(A) {
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
          A = Zd(new Date(A.ee + 1900, 0, 1), A.cf);
          var M = new Date(A.getFullYear() + 1, 0, 4),
            X = u(new Date(A.getFullYear(), 0, 4));
          M = u(M);
          return 0 >= p(X, A)
            ? 0 >= p(M, A) ? A.getFullYear() + 1 : A.getFullYear()
            : A.getFullYear() - 1;
        }
        var w = P[f + 40 >> 2];
        f = {
          Ag: P[f >> 2],
          zg: P[f + 4 >> 2],
          af: P[f + 8 >> 2],
          Re: P[f + 12 >> 2],
          Ke: P[f + 16 >> 2],
          ee: P[f + 20 >> 2],
          bf: P[f + 24 >> 2],
          cf: P[f + 28 >> 2],
          Lg: P[f + 32 >> 2],
          yg: P[
            f +
              36 >> 2
          ],
          Bg: w ? Xa(w) : "",
        };
        c = Xa(c);
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
        for (var H in w) c = c.replace(new RegExp(H, "g"), w[H]);
        var K = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday"
            .split(" "),
          O =
            "January February March April May June July August September October November December"
              .split(" ");
        w = {
          "%a": function (A) {
            return K[A.bf].substring(0, 3);
          },
          "%A": function (A) {
            return K[A.bf];
          },
          "%b": function (A) {
            return O[A.Ke].substring(0, 3);
          },
          "%B": function (A) {
            return O[A.Ke];
          },
          "%C": function (A) {
            return l((A.ee + 1900) / 100 | 0, 2);
          },
          "%d": function (A) {
            return l(A.Re, 2);
          },
          "%e": function (A) {
            return g(A.Re, 2, " ");
          },
          "%g": function (A) {
            return x(A).toString().substring(2);
          },
          "%G": function (A) {
            return x(A);
          },
          "%H": function (A) {
            return l(A.af, 2);
          },
          "%I": function (A) {
            A = A.af;
            0 == A ? A = 12 : 12 < A && (A -= 12);
            return l(A, 2);
          },
          "%j": function (A) {
            return l(A.Re + Wd(Vd(A.ee + 1900) ? Xd : Yd, A.Ke - 1), 3);
          },
          "%m": function (A) {
            return l(A.Ke + 1, 2);
          },
          "%M": function (A) {
            return l(A.zg, 2);
          },
          "%n": function () {
            return "\n";
          },
          "%p": function (A) {
            return 0 <= A.af && 12 > A.af ? "AM" : "PM";
          },
          "%S": function (A) {
            return l(A.Ag, 2);
          },
          "%t": function () {
            return "\t";
          },
          "%u": function (A) {
            return A.bf || 7;
          },
          "%U": function (A) {
            var M = new Date(A.ee + 1900, 0, 1),
              X = 0 === M.getDay() ? M : Zd(M, 7 - M.getDay());
            A = new Date(A.ee + 1900, A.Ke, A.Re);
            return 0 >
                p(X, A)
              ? l(
                Math.ceil(
                  (31 - X.getDate() + (Wd(
                    Vd(A.getFullYear())
                      ? Xd
                      : Yd,
                    A.getMonth() - 1,
                  ) - 31) + A.getDate()) / 7,
                ),
                2,
              ) : 0 === p(X, M) ? "01" : "00";
          },
          "%V": function (A) {
            var M = new Date(A.ee + 1901, 0, 4),
              X = u(new Date(A.ee + 1900, 0, 4));
            M = u(M);
            var da = Zd(new Date(A.ee + 1900, 0, 1), A.cf);
            return 0 > p(da, X) ? "53"
            : 0 >= p(M, da) ? "01"
            : l(
              Math.ceil(
                (X.getFullYear() < A.ee + 1900
                  ? A.cf + 32 - X.getDate()
                  : A.cf + 1 - X.getDate()) / 7,
              ),
              2,
            );
          },
          "%w": function (A) {
            return A.bf;
          },
          "%W": function (A) {
            var M = new Date(A.ee, 0, 1),
              X = 1 === M.getDay()
                ? M
                : Zd(M, 0 === M.getDay() ? 1 : 7 - M.getDay() + 1);
            A = new Date(A.ee + 1900, A.Ke, A.Re);
            return 0 > p(X, A)
              ? l(
                Math.ceil(
                  (31 - X.getDate() + (Wd(
                    Vd(A.getFullYear())
                      ? Xd
                      : Yd,
                    A.getMonth() - 1,
                  ) - 31) + A.getDate()) / 7,
                ),
                2,
              ) : 0 === p(X, M) ? "01" : "00";
          },
          "%y": function (A) {
            return (A.ee + 1900).toString().substring(2);
          },
          "%Y": function (A) {
            return A.ee + 1900;
          },
          "%z": function (A) {
            A = A.yg;
            var M = 0 <= A;
            A = Math.abs(A) / 60;
            return (M ? "+" : "-") +
              String("0000" + (A / 60 * 100 + A % 60)).slice(-4);
          },
          "%Z": function (A) {
            return A.Bg;
          },
          "%%": function () {
            return "%";
          },
        };
        for (H in w) {
          c.includes(H) && (c = c.replace(new RegExp(H, "g"), w[H](f)));
        }
        H = ae(c);
        if (H.length > b) return 0;
        lb.set(H, a);
        return H.length - 1;
      }
      Sb = r.InternalError = Rb("InternalError");
      for (var be = Array(256), ce = 0; 256 > ce; ++ce) {
        be[ce] = String.fromCharCode(ce);
      }
      Xb = be;
      Zb = r.BindingError = Rb("BindingError");
      oc.prototype.isAliasOf = function (a) {
        if (!(this instanceof oc && a instanceof oc)) return !1;
        var b = this.Rd.ae.Wd, c = this.Rd.Vd, f = a.Rd.ae.Wd;
        for (a = a.Rd.Vd; b.me;) c = b.Se(c), b = b.me;
        for (; f.me;) a = f.Se(a), f = f.me;
        return b === f && c === a;
      };
      oc.prototype.clone = function () {
        this.Rd.Vd || $b(this);
        if (this.Rd.Qe) return this.Rd.count.value += 1, this;
        var a = dc,
          b = Object,
          c = b.create,
          f = Object.getPrototypeOf(this),
          g = this.Rd;
        a = a(
          c.call(b, f, {
            Rd: {
              value: {
                count: g.count,
                Ie: g.Ie,
                Qe: g.Qe,
                Vd: g.Vd,
                ae: g.ae,
                he: g.he,
                ke: g.ke,
              },
            },
          }),
        );
        a.Rd.count.value += 1;
        a.Rd.Ie = !1;
        return a;
      };
      oc.prototype["delete"] = function () {
        this.Rd.Vd || $b(this);
        this.Rd.Ie && !this.Rd.Qe && V("Object already scheduled for deletion");
        bc(this);
        cc(this.Rd);
        this.Rd.Qe || (this.Rd.he = void 0, this.Rd.Vd = void 0);
      };
      oc.prototype.isDeleted = function () {
        return !this.Rd.Vd;
      };
      oc.prototype.deleteLater = function () {
        this.Rd.Vd || $b(this);
        this.Rd.Ie && !this.Rd.Qe && V("Object already scheduled for deletion");
        mc.push(this);
        1 === mc.length && lc && lc(nc);
        this.Rd.Ie = !0;
        return this;
      };
      Dc.prototype.Tf = function (a) {
        this.Af && (a = this.Af(a));
        return a;
      };
      Dc.prototype.tf = function (a) {
        this.oe && this.oe(a);
      };
      Dc.prototype.argPackAdvance = 8;
      Dc.prototype.readValueFromPointer = Lb;
      Dc.prototype.deleteObject = function (a) {
        if (null !== a) a["delete"]();
      };
      Dc.prototype.fromWireType = function (a) {
        function b() {
          return this.Xe
            ? Cc(this.Wd.Je, { ae: this.gg, Vd: c, ke: this, he: a })
            : Cc(this.Wd.Je, { ae: this, Vd: a });
        }
        var c = this.Tf(a);
        if (!c) return this.tf(a), null;
        var f = Bc(this.Wd, c);
        if (void 0 !== f) {
          if (0 === f.Rd.count.value) {
            return f.Rd.Vd = c, f.Rd.he = a, f.clone();
          }
          f = f.clone();
          this.tf(a);
          return f;
        }
        f = this.Wd.Sf(c);
        f = pc[f];
        if (!f) return b.call(this);
        f = this.We ? f.If : f.pointerType;
        var g = zc(c, this.Wd, f.Wd);
        return null === g
          ? b.call(this)
          : this.Xe
          ? Cc(f.Wd.Je, { ae: f, Vd: g, ke: this, he: a })
          : Cc(f.Wd.Je, { ae: f, Vd: g });
      };
      r.getInheritedInstanceCount = function () {
        return Object.keys(Ac).length;
      };
      r.getLiveInheritedInstances = function () {
        var a = [], b;
        for (b in Ac) Ac.hasOwnProperty(b) && a.push(Ac[b]);
        return a;
      };
      r.flushPendingDeletes = nc;
      r.setDelayFunction = function (a) {
        lc = a;
        mc.length && lc && lc(nc);
      };
      Hc = r.UnboundTypeError = Rb("UnboundTypeError");
      r.count_emval_handles = function () {
        for (var a = 0, b = 5; b < Yc.length; ++b) void 0 !== Yc[b] && ++a;
        return a;
      };
      r.get_first_emval = function () {
        for (var a = 5; a < Yc.length; ++a) if (void 0 !== Yc[a]) return Yc[a];
        return null;
      };
      for (var W, de = 0; 32 > de; ++de) Jd.push(Array(de));
      var ee = new Float32Array(288);
      for (de = 0; 288 > de; ++de) Qd[de] = ee.subarray(0, de + 1);
      var fe = new Int32Array(288);
      for (de = 0; 288 > de; ++de) Rd[de] = fe.subarray(0, de + 1);
      function ae(a) {
        var b = Array(oa(a) + 1);
        ra(a, b, 0, b.length);
        return b;
      }
      var ze = {
        Bb: function (a) {
          return Nd(a + 16) + 16;
        },
        xb: function (a, b, c) {
          (new Eb(a)).Zf(b, c);
          Fb++;
          throw a;
        },
        M: function () {
          return 0;
        },
        Ab: function () {},
        wb: function () {
          return 0;
        },
        yb: function (a, b, c, f, g, l) {
          l <<= 12;
          0 !== (f & 16) && 0 !== a % 65536 ? b = -28 : 0 !== (f & 32)
            ? (a = ge(65536, b))
              ? (he(a, 0, b),
                Gb[a] = {
                  eg: a,
                  dg: b,
                  Hf: !0,
                  fd: g,
                  Jg: c,
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
            var c = Gb[a];
            c && b === c.dg && (Gb[a] = null, c.Hf && Kc(c.eg));
            a = 0;
          }
          return a;
        },
        O: function () {},
        N: function () {},
        y: function (a) {
          var b = Jb[a];
          delete Jb[a];
          var c = b.mf,
            f = b.oe,
            g = b.wf,
            l = g.map(function (p) {
              return p.Xf;
            }).concat(g.map(function (p) {
              return p.qg;
            }));
          Ub([a], l, function (p) {
            var u = {};
            g.forEach(function (x, w) {
              var H = p[w],
                K = x.Vf,
                O = x.Wf,
                A = p[w + g.length],
                M = x.pg,
                X = x.rg;
              u[x.Of] = {
                read: function (da) {
                  return H.fromWireType(K(O, da));
                },
                write: function (da, ba) {
                  var pa = [];
                  M(X, da, A.toWireType(pa, ba));
                  Kb(pa);
                },
              };
            });
            return [{
              name: b.name,
              fromWireType: function (x) {
                var w = {}, H;
                for (H in u) w[H] = u[H].read(x);
                f(x);
                return w;
              },
              toWireType: function (x, w) {
                for (var H in u) {
                  if (
                    !(H in
                      w)
                  ) {
                    throw new TypeError('Missing field:  "' + H + '"');
                  }
                }
                var K = c();
                for (H in u) u[H].write(K, w[H]);
                null !== x && x.push(f, K);
                return K;
              },
              argPackAdvance: 8,
              readValueFromPointer: Lb,
              je: f,
            }];
          });
        },
        ob: function () {},
        Eb: function (a, b, c, f, g) {
          var l = Wb(c);
          b = Yb(b);
          Vb(a, {
            name: b,
            fromWireType: function (p) {
              return !!p;
            },
            toWireType: function (p, u) {
              return u ? f : g;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (p) {
              if (1 === c) var u = lb;
              else if (2 === c) u = ab;
              else if (4 === c) u = P;
              else throw new TypeError("Unknown boolean type size: " + b);
              return this.fromWireType(
                u[
                  p >>
                  l
                ],
              );
            },
            je: null,
          });
        },
        n: function (a, b, c, f, g, l, p, u, x, w, H, K, O) {
          H = Yb(H);
          l = Gc(g, l);
          u && (u = Gc(p, u));
          w && (w = Gc(x, w));
          O = Gc(K, O);
          var A = Pb(H);
          rc(A, function () {
            Tc("Cannot construct " + H + " due to unbound types", [f]);
          });
          Ub([a, b, c], f ? [f] : [], function (M) {
            M = M[0];
            if (f) {
              var X = M.Wd;
              var da = X.Je;
            } else da = oc.prototype;
            M = Qb(A, function () {
              if (Object.getPrototypeOf(this) !== ba) {
                throw new Zb("Use 'new' to construct " + H);
              }
              if (void 0 === pa.se) {
                throw new Zb(H + " has no accessible constructor");
              }
              var jb = pa.se[arguments.length];
              if (void 0 === jb) {
                throw new Zb(
                  "Tried to invoke ctor of " +
                    H + " with invalid number of parameters (" +
                    arguments.length + ") - expected (" +
                    Object.keys(pa.se).toString() + ") parameters instead!",
                );
              }
              return jb.apply(this, arguments);
            });
            var ba = Object.create(da, { constructor: { value: M } });
            M.prototype = ba;
            var pa = new sc(H, M, ba, O, X, l, u, w);
            X = new Dc(H, pa, !0, !1, !1);
            da = new Dc(H + "*", pa, !1, !1, !1);
            var ib = new Dc(H + " const*", pa, !1, !0, !1);
            pc[a] = { pointerType: da, If: ib };
            Ec(A, M);
            return [X, da, ib];
          });
        },
        f: function (a, b, c, f, g, l, p) {
          var u = Wc(c, f);
          b = Yb(b);
          l = Gc(g, l);
          Ub([], [a], function (x) {
            function w() {
              Tc(
                "Cannot call " +
                  H + " due to unbound types",
                u,
              );
            }
            x = x[0];
            var H = x.name + "." + b, K = x.Wd.constructor;
            void 0 === K[b]
              ? (w.Ge = c - 1, K[b] = w)
              : (qc(K, b, H), K[b].ce[c - 1] = w);
            Ub([], u, function (O) {
              O = [O[0], null].concat(O.slice(1));
              O = Vc(H, O, null, l, p);
              void 0 === K[b].ce
                ? (O.Ge = c - 1, K[b] = O)
                : K[b].ce[c - 1] = O;
              return [];
            });
            return [];
          });
        },
        v: function (a, b, c, f, g, l) {
          assert(0 < b);
          var p = Wc(b, c);
          g = Gc(f, g);
          var u = [l], x = [];
          Ub([], [a], function (w) {
            w = w[0];
            var H = "constructor " + w.name;
            void 0 === w.Wd.se && (w.Wd.se = []);
            if (void 0 !== w.Wd.se[b - 1]) {
              throw new Zb(
                "Cannot register multiple constructors with identical number of parameters (" +
                  (b - 1) + ") for class '" + w.name +
                  "'! Overload resolution is currently only performed using the parameter count, not actual type info!",
              );
            }
            w.Wd.se[b - 1] = function () {
              Tc("Cannot construct " + w.name + " due to unbound types", p);
            };
            Ub([], p, function (K) {
              w.Wd.se[b - 1] = function () {
                arguments.length !== b - 1 &&
                  V(
                    H + " called with " + arguments.length +
                      " arguments, expected " + (b - 1),
                  );
                x.length = 0;
                u.length = b;
                for (var O = 1; O < b; ++O) {
                  u[O] = K[O].toWireType(x, arguments[O - 1]);
                }
                O = g.apply(null, u);
                Kb(x);
                return K[0].fromWireType(O);
              };
              return [];
            });
            return [];
          });
        },
        c: function (a, b, c, f, g, l, p, u) {
          var x = Wc(c, f);
          b = Yb(b);
          l = Gc(g, l);
          Ub([], [a], function (w) {
            function H() {
              Tc("Cannot call " + K + " due to unbound types", x);
            }
            w = w[0];
            var K = w.name + "." + b;
            u && w.Wd.hg.push(b);
            var O = w.Wd.Je, A = O[b];
            void 0 === A ||
              void 0 === A.ce && A.className !== w.name && A.Ge === c - 2
              ? (H.Ge = c - 2, H.className = w.name, O[b] = H)
              : (qc(O, b, K), O[b].ce[c - 2] = H);
            Ub([], x, function (M) {
              M = Vc(K, M, w, l, p);
              void 0 === O[b].ce
                ? (M.Ge = c - 2, O[b] = M)
                : O[b].ce[c - 2] = M;
              return [];
            });
            return [];
          });
        },
        U: function (a, b, c) {
          a = Yb(a);
          Ub([], [b], function (f) {
            f = f[0];
            r[a] = f.fromWireType(c);
            return [];
          });
        },
        Db: function (a, b) {
          b = Yb(b);
          Vb(a, {
            name: b,
            fromWireType: function (c) {
              var f = Yc[c].value;
              Zc(c);
              return f;
            },
            toWireType: function (c, f) {
              return xc(f);
            },
            argPackAdvance: 8,
            readValueFromPointer: Lb,
            je: null,
          });
        },
        k: function (a, b, c, f) {
          function g() {}
          c = Wb(c);
          b = Yb(b);
          g.values = {};
          Vb(a, {
            name: b,
            constructor: g,
            fromWireType: function (l) {
              return this.constructor.values[l];
            },
            toWireType: function (l, p) {
              return p.value;
            },
            argPackAdvance: 8,
            readValueFromPointer: $c(b, c, f),
            je: null,
          });
          rc(b, g);
        },
        j: function (a, b, c) {
          var f = ad(a, "enum");
          b = Yb(b);
          a = f.constructor;
          f = Object.create(f.constructor.prototype, {
            value: { value: c },
            constructor: { value: Qb(f.name + "_" + b, function () {}) },
          });
          a.values[c] = f;
          a[b] = f;
        },
        P: function (a, b, c) {
          c = Wb(c);
          b = Yb(b);
          Vb(a, {
            name: b,
            fromWireType: function (f) {
              return f;
            },
            toWireType: function (f, g) {
              if (
                "number" !== typeof g && "boolean" !== typeof g
              ) {
                throw new TypeError(
                  'Cannot convert "' + vc(g) + '" to ' + this.name,
                );
              }
              return g;
            },
            argPackAdvance: 8,
            readValueFromPointer: bd(b, c),
            je: null,
          });
        },
        s: function (a, b, c, f, g, l) {
          var p = Wc(b, c);
          a = Yb(a);
          g = Gc(f, g);
          rc(a, function () {
            Tc("Cannot call " + a + " due to unbound types", p);
          }, b - 1);
          Ub([], p, function (u) {
            u = [u[0], null].concat(u.slice(1));
            Ec(a, Vc(a, u, null, g, l), b - 1);
            return [];
          });
        },
        x: function (a, b, c, f, g) {
          function l(w) {
            return w;
          }
          b = Yb(b);
          -1 === g && (g = 4294967295);
          var p = Wb(c);
          if (0 === f) {
            var u = 32 - 8 * c;
            l = function (w) {
              return w << u >>> u;
            };
          }
          var x = b.includes("unsigned");
          Vb(a, {
            name: b,
            fromWireType: l,
            toWireType: function (w, H) {
              if (
                "number" !== typeof H && "boolean" !== typeof H
              ) {
                throw new TypeError(
                  'Cannot convert "' + vc(H) + '" to ' + this.name,
                );
              }
              if (
                H < f ||
                H > g
              ) {
                throw new TypeError(
                  'Passing a number "' + vc(H) +
                    '" from JS side to C/C++ side to an argument of type "' +
                    b + '", which is outside the valid range [' + f + ", " + g +
                    "]!",
                );
              }
              return x ? H >>> 0 : H | 0;
            },
            argPackAdvance: 8,
            readValueFromPointer: cd(b, p, 0 !== f),
            je: null,
          });
        },
        u: function (a, b, c) {
          function f(l) {
            l >>= 2;
            var p = mb;
            return new g(gb, p[l + 1], p[l]);
          }
          var g =
            [
              Int8Array,
              Uint8Array,
              Int16Array,
              Uint16Array,
              Int32Array,
              Uint32Array,
              Float32Array,
              Float64Array,
            ][b];
          c = Yb(c);
          Vb(a, {
            name: c,
            fromWireType: f,
            argPackAdvance: 8,
            readValueFromPointer: f,
          }, { Yf: !0 });
        },
        q: function (a, b, c, f, g, l, p, u, x, w, H, K) {
          c = Yb(c);
          l = Gc(g, l);
          u = Gc(p, u);
          w = Gc(x, w);
          K = Gc(H, K);
          Ub([a], [b], function (O) {
            O = O[0];
            return [new Dc(c, O.Wd, !1, !1, !0, O, f, l, u, w, K)];
          });
        },
        Q: function (a, b) {
          b = Yb(b);
          var c = "std::string" === b;
          Vb(a, {
            name: b,
            fromWireType: function (f) {
              var g = mb[f >> 2];
              if (c) {
                for (var l = f + 4, p = 0; p <= g; ++p) {
                  var u = f + 4 + p;
                  if (p == g || 0 == G[u]) {
                    l = Xa(l, u - l);
                    if (void 0 === x) var x = l;
                    else x += String.fromCharCode(0), x += l;
                    l = u + 1;
                  }
                }
              } else {
                x = Array(g);
                for (p = 0; p < g; ++p) {
                  x[p] = String.fromCharCode(G[f + 4 + p]);
                }
                x = x.join("");
              }
              Kc(f);
              return x;
            },
            toWireType: function (f, g) {
              g instanceof ArrayBuffer && (g = new Uint8Array(g));
              var l = "string" === typeof g;
              l || g instanceof Uint8Array || g instanceof Uint8ClampedArray ||
                g instanceof Int8Array ||
                V("Cannot pass non-string to std::string");
              var p = (c && l
                  ? function () {
                    return oa(g);
                  }
                  : function () {
                    return g.length;
                  })(),
                u = Nd(4 + p + 1);
              mb[u >> 2] = p;
              if (c && l) ra(g, G, u + 4, p + 1);
              else if (l) {
                for (l = 0; l < p; ++l) {
                  var x = g.charCodeAt(l);
                  255 < x &&
                    (Kc(u),
                      V("String has UTF-16 code units that do not fit in 8 bits"));
                  G[u + 4 + l] = x;
                }
              } else {
                for (l = 0; l < p; ++l) {
                  G[
                    u +
                    4 + l
                  ] = g[l];
                }
              }
              null !== f && f.push(Kc, u);
              return u;
            },
            argPackAdvance: 8,
            readValueFromPointer: Lb,
            je: function (f) {
              Kc(f);
            },
          });
        },
        G: function (a, b, c) {
          c = Yb(c);
          if (2 === b) {
            var f = Za;
            var g = bb;
            var l = cb;
            var p = function () {
              return $a;
            };
            var u = 1;
          } else {
            4 === b && (f = db,
              g = eb,
              l = fb,
              p = function () {
                return mb;
              },
              u = 2);
          }
          Vb(a, {
            name: c,
            fromWireType: function (x) {
              for (
                var w = mb[x >> 2], H = p(), K, O = x + 4, A = 0; A <= w; ++A
              ) {
                var M = x + 4 + A * b;
                if (A == w || 0 == H[M >> u]) {
                  O = f(O, M - O),
                    void 0 === K
                      ? K = O
                      : (K += String.fromCharCode(0), K += O),
                    O = M + b;
                }
              }
              Kc(x);
              return K;
            },
            toWireType: function (x, w) {
              "string" !==
                  typeof w &&
                V("Cannot pass non-string to C++ string type " + c);
              var H = l(w), K = Nd(4 + H + b);
              mb[K >> 2] = H >> u;
              g(w, K + 4, H + b);
              null !== x && x.push(Kc, K);
              return K;
            },
            argPackAdvance: 8,
            readValueFromPointer: Lb,
            je: function (x) {
              Kc(x);
            },
          });
        },
        z: function (a, b, c, f, g, l) {
          Jb[a] = { name: Yb(b), mf: Gc(c, f), oe: Gc(g, l), wf: [] };
        },
        h: function (a, b, c, f, g, l, p, u, x, w) {
          Jb[a].wf.push({
            Of: Yb(b),
            Xf: c,
            Vf: Gc(f, g),
            Wf: l,
            qg: p,
            pg: Gc(u, x),
            rg: w,
          });
        },
        Fb: function (a, b) {
          b = Yb(b);
          Vb(a, {
            ag: !0,
            name: b,
            argPackAdvance: 0,
            fromWireType: function () {},
            toWireType: function () {},
          });
        },
        A: function (a, b, c) {
          a = dd(a);
          b = ad(b, "emval::as");
          var f = [], g = xc(f);
          P[c >> 2] = g;
          return b.toWireType(f, a);
        },
        jb: function (a, b, c, f, g) {
          a = gd[a];
          b = dd(b);
          c = fd(c);
          var l = [];
          P[f >> 2] = xc(l);
          return a(b, c, l, g);
        },
        E: function (a, b, c, f) {
          a = gd[a];
          b = dd(b);
          c = fd(c);
          a(b, c, null, f);
        },
        D: Zc,
        nb: function (a) {
          if (0 === a) return xc(hd());
          a = fd(a);
          return xc(hd()[a]);
        },
        B: function (a, b) {
          b = kd(a, b);
          for (
            var c = b[0],
              f = c.name + "_$" + b.slice(1).map(function (w) {
                return w.name;
              }).join("_") + "$",
              g = ["retType"],
              l = [c],
              p = "",
              u = 0;
            u < a - 1;
            ++u
          ) {
            p += (0 !== u ? ", " : "") + "arg" + u,
              g.push(
                "argType" +
                  u,
              ),
              l.push(b[1 + u]);
          }
          f = "return function " + Pb("methodCaller_" + f) +
            "(handle, name, destructors, args) {\n";
          var x = 0;
          for (u = 0; u < a - 1; ++u) {
            f += "    var arg" + u + " = argType" + u +
              ".readValueFromPointer(args" + (x ? "+" + x : "") + ");\n",
              x += b[u + 1].argPackAdvance;
          }
          f += "    var rv = handle[name](" + p + ");\n";
          for (u = 0; u < a - 1; ++u) {
            b[u + 1].deleteObject &&
              (f += "    argType" + u + ".deleteObject(arg" + u + ");\n");
          }
          c.ag || (f += "    return retType.toWireType(destructors, rv);\n");
          g.push(f + "};\n");
          a = Uc(g).apply(null, l);
          return jd(a);
        },
        J: function (a, b) {
          a = dd(a);
          b = dd(b);
          return xc(a[b]);
        },
        K: function (a) {
          4 < a && (Yc[a].nf += 1);
        },
        kb: function (a, b, c, f) {
          a = dd(a);
          var g = ld[b];
          if (!g) {
            g = "";
            for (var l = 0; l < b; ++l) g += (0 !== l ? ", " : "") + "arg" + l;
            var p = "return function emval_allocator_" + b +
              "(constructor, argTypes, args) {\n";
            for (l = 0; l < b; ++l) {
              p += "var argType" + l +
                " = requireRegisteredType(Module['HEAP32'][(argTypes >>> 2) + " +
                l + '], "parameter ' + l + '");\nvar arg' + l + " = argType" +
                l + ".readValueFromPointer(args);\nargs += argType" + l +
                "['argPackAdvance'];\n";
            }
            g =
              (new Function(
                "requireRegisteredType",
                "Module",
                "__emval_register",
                p +
                  ("var obj = new constructor(" + g +
                    ");\nreturn __emval_register(obj);\n}\n"),
              ))(ad, r, xc);
            ld[b] = g;
          }
          return g(a, c, f);
        },
        fb: function () {
          return xc([]);
        },
        za: function (a) {
          return xc(fd(a));
        },
        gb: function () {
          return xc({});
        },
        eb: function (a) {
          a = dd(a);
          return !a;
        },
        ib: function (a) {
          Kb(Yc[a].value);
          Zc(a);
        },
        w: function (a, b, c) {
          a = dd(a);
          b = dd(b);
          c = dd(c);
          a[b] = c;
        },
        t: function (a, b) {
          a = ad(a, "_emval_take_value");
          a = a.readValueFromPointer(b);
          return xc(a);
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
          W.activeTexture(a);
        },
        _c: function (a, b) {
          W.attachShader(sd[a], vd[b]);
        },
        $c: function (a, b, c) {
          W.bindAttribLocation(sd[a], b, Xa(c));
        },
        ad: function (a, b) {
          35051 == a ? W.kf = b : 35052 == a && (W.He = b);
          W.bindBuffer(a, rd[b]);
        },
        ac: function (a, b) {
          W.bindFramebuffer(a, td[b]);
        },
        bc: function (a, b) {
          W.bindRenderbuffer(a, ud[b]);
        },
        Ob: function (a, b) {
          W.bindSampler(a, xd[b]);
        },
        bd: function (a, b) {
          W.bindTexture(a, na[b]);
        },
        vc: function (a) {
          W.bindVertexArray(wd[a]);
        },
        yc: function (a) {
          W.bindVertexArray(wd[a]);
        },
        cd: function (a, b, c, f) {
          W.blendColor(a, b, c, f);
        },
        dd: function (a) {
          W.blendEquation(a);
        },
        ed: function (a, b) {
          W.blendFunc(a, b);
        },
        Vb: function (a, b, c, f, g, l, p, u, x, w) {
          W.blitFramebuffer(a, b, c, f, g, l, p, u, x, w);
        },
        W: function (a, b, c, f) {
          2 <= v.version
            ? c ? W.bufferData(a, G, f, c, b) : W.bufferData(a, b, f)
            : W.bufferData(a, c ? G.subarray(c, c + b) : b, f);
        },
        X: function (a, b, c, f) {
          2 <= v.version ? W.bufferSubData(a, b, G, f, c)
          : W.bufferSubData(a, b, G.subarray(f, f + c));
        },
        cc: function (a) {
          return W.checkFramebufferStatus(a);
        },
        Y: function (a) {
          W.clear(a);
        },
        Z: function (a, b, c, f) {
          W.clearColor(a, b, c, f);
        },
        _: function (a) {
          W.clearStencil(a);
        },
        bb: function (a, b, c, f) {
          return W.clientWaitSync(yd[a], b, (c >>> 0) + 4294967296 * f);
        },
        $: function (a, b, c, f) {
          W.colorMask(!!a, !!b, !!c, !!f);
        },
        aa: function (a) {
          W.compileShader(vd[a]);
        },
        ba: function (a, b, c, f, g, l, p, u) {
          2 <= v.version
            ? W.He ? W.compressedTexImage2D(a, b, c, f, g, l, p, u)
            : W.compressedTexImage2D(a, b, c, f, g, l, G, u, p)
            : W.compressedTexImage2D(
              a,
              b,
              c,
              f,
              g,
              l,
              u ? G.subarray(u, u + p) : null,
            );
        },
        ca: function (a, b, c, f, g, l, p, u, x) {
          2 <= v.version
            ? W.He ? W.compressedTexSubImage2D(a, b, c, f, g, l, p, u, x)
            : W.compressedTexSubImage2D(a, b, c, f, g, l, p, G, x, u)
            : W.compressedTexSubImage2D(
              a,
              b,
              c,
              f,
              g,
              l,
              p,
              x ? G.subarray(x, x + u) : null,
            );
        },
        da: function (a, b, c, f, g, l, p, u) {
          W.copyTexSubImage2D(a, b, c, f, g, l, p, u);
        },
        fa: function () {
          var a = Ed(sd), b = W.createProgram();
          b.name = a;
          b.$e = b.Ye = b.Ze = 0;
          b.pf = 1;
          sd[a] = b;
          return a;
        },
        ga: function (a) {
          var b = Ed(vd);
          vd[b] = W.createShader(a);
          return b;
        },
        ha: function (a) {
          W.cullFace(a);
        },
        ia: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], g = rd[f];
            g && (W.deleteBuffer(g),
              g.name = 0,
              rd[f] = null,
              f == W.kf &&
              (W.kf = 0),
              f == W.He && (W.He = 0));
          }
        },
        dc: function (a, b) {
          for (var c = 0; c < a; ++c) {
            var f = P[b + 4 * c >> 2], g = td[f];
            g && (W.deleteFramebuffer(g), g.name = 0, td[f] = null);
          }
        },
        ja: function (a) {
          if (a) {
            var b = sd[a];
            b ? (W.deleteProgram(b), b.name = 0, sd[a] = null) : Cd(1281);
          }
        },
        ec: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], g = ud[f];
            g && (W.deleteRenderbuffer(g), g.name = 0, ud[f] = null);
          }
        },
        Pb: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], g = xd[f];
            g && (W.deleteSampler(g), g.name = 0, xd[f] = null);
          }
        },
        ka: function (a) {
          if (a) {
            var b = vd[a];
            b ? (W.deleteShader(b), vd[a] = null) : Cd(1281);
          }
        },
        Xb: function (a) {
          if (a) {
            var b = yd[a];
            b ? (W.deleteSync(b), b.name = 0, yd[a] = null) : Cd(1281);
          }
        },
        la: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2], g = na[f];
            g && (W.deleteTexture(g), g.name = 0, na[f] = null);
          }
        },
        wc: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2];
            W.deleteVertexArray(wd[f]);
            wd[f] = null;
          }
        },
        zc: function (a, b) {
          for (var c = 0; c < a; c++) {
            var f = P[b + 4 * c >> 2];
            W.deleteVertexArray(wd[f]);
            wd[f] = null;
          }
        },
        ma: function (a) {
          W.depthMask(!!a);
        },
        na: function (a) {
          W.disable(a);
        },
        oa: function (a) {
          W.disableVertexAttribArray(a);
        },
        pa: function (a, b, c) {
          W.drawArrays(a, b, c);
        },
        tc: function (a, b, c, f) {
          W.drawArraysInstanced(a, b, c, f);
        },
        rc: function (a, b, c, f, g) {
          W.uf.drawArraysInstancedBaseInstanceWEBGL(a, b, c, f, g);
        },
        pc: function (a, b) {
          for (var c = Jd[a], f = 0; f < a; f++) c[f] = P[b + 4 * f >> 2];
          W.drawBuffers(c);
        },
        qa: function (a, b, c, f) {
          W.drawElements(a, b, c, f);
        },
        uc: function (a, b, c, f, g) {
          W.drawElementsInstanced(a, b, c, f, g);
        },
        sc: function (a, b, c, f, g, l, p) {
          W.uf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            b,
            c,
            f,
            g,
            l,
            p,
          );
        },
        jc: function (a, b, c, f, g, l) {
          W.drawElements(a, f, g, l);
        },
        ra: function (a) {
          W.enable(a);
        },
        sa: function (a) {
          W.enableVertexAttribArray(a);
        },
        Tb: function (a, b) {
          return (a = W.fenceSync(a, b))
            ? (b = Ed(yd), a.name = b, yd[b] = a, b) : 0;
        },
        ta: function () {
          W.finish();
        },
        ua: function () {
          W.flush();
        },
        fc: function (a, b, c, f) {
          W.framebufferRenderbuffer(a, b, c, ud[f]);
        },
        gc: function (a, b, c, f, g) {
          W.framebufferTexture2D(a, b, c, na[f], g);
        },
        va: function (a) {
          W.frontFace(a);
        },
        wa: function (a, b) {
          Kd(a, b, "createBuffer", rd);
        },
        hc: function (a, b) {
          Kd(a, b, "createFramebuffer", td);
        },
        ic: function (a, b) {
          Kd(a, b, "createRenderbuffer", ud);
        },
        Qb: function (a, b) {
          Kd(a, b, "createSampler", xd);
        },
        xa: function (a, b) {
          Kd(a, b, "createTexture", na);
        },
        xc: function (a, b) {
          Kd(a, b, "createVertexArray", wd);
        },
        Ac: function (a, b) {
          Kd(a, b, "createVertexArray", wd);
        },
        Yb: function (a) {
          W.generateMipmap(a);
        },
        ya: function (a, b, c) {
          c ? P[c >> 2] = W.getBufferParameter(a, b) : Cd(1281);
        },
        Aa: function () {
          var a = W.getError() || Dd;
          Dd = 0;
          return a;
        },
        Zb: function (a, b, c, f) {
          a = W.getFramebufferAttachmentParameter(a, b, c);
          if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) {
            a = a.name | 0;
          }
          P[f >> 2] = a;
        },
        $a: function (a, b) {
          Ld(a, b);
        },
        Ba: function (a, b, c, f) {
          a = W.getProgramInfoLog(sd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? ra(a, G, f, b) : 0;
          c && (P[c >> 2] = b);
        },
        Ca: function (a, b, c) {
          if (c) {
            if (a >= qd) Cd(1281);
            else if (a = sd[a], 35716 == b) {
              a = W.getProgramInfoLog(a),
                null === a && (a = "(unknown error)"),
                P[c >> 2] = a.length + 1;
            } else if (35719 == b) {
              if (!a.$e) {
                for (b = 0; b < W.getProgramParameter(a, 35718); ++b) {
                  a.$e = Math.max(
                    a.$e,
                    W.getActiveUniform(a, b).name.length + 1,
                  );
                }
              }
              P[c >> 2] = a.$e;
            } else if (35722 == b) {
              if (!a.Ye) {
                for (b = 0; b < W.getProgramParameter(a, 35721); ++b) {
                  a.Ye = Math.max(
                    a.Ye,
                    W.getActiveAttrib(a, b).name.length + 1,
                  );
                }
              }
              P[c >> 2] = a.Ye;
            } else if (35381 == b) {
              if (!a.Ze) {
                for (b = 0; b < W.getProgramParameter(a, 35382); ++b) {
                  a.Ze = Math.max(
                    a.Ze,
                    W.getActiveUniformBlockName(a, b).length + 1,
                  );
                }
              }
              P[c >> 2] = a.Ze;
            } else P[c >> 2] = W.getProgramParameter(a, b);
          } else Cd(1281);
        },
        _b: function (a, b, c) {
          c ? P[c >> 2] = W.getRenderbufferParameter(a, b) : Cd(1281);
        },
        Da: function (a, b, c, f) {
          a = W.getShaderInfoLog(vd[a]);
          null === a && (a = "(unknown error)");
          b = 0 < b && f ? ra(a, G, f, b) : 0;
          c && (P[c >> 2] = b);
        },
        Lb: function (a, b, c, f) {
          a = W.getShaderPrecisionFormat(a, b);
          P[c >> 2] = a.rangeMin;
          P[
            c +
              4 >> 2
          ] = a.rangeMax;
          P[f >> 2] = a.precision;
        },
        Ea: function (a, b, c) {
          c
            ? 35716 == b
              ? (a = W.getShaderInfoLog(vd[a]),
                null === a && (a = "(unknown error)"),
                P[c >> 2] = a ? a.length + 1 : 0)
              : 35720 == b
              ? (a = W.getShaderSource(vd[a]), P[c >> 2] = a ? a.length + 1 : 0)
              : P[c >> 2] = W.getShaderParameter(vd[a], b) : Cd(1281);
        },
        I: function (a) {
          var b = zd[a];
          if (!b) {
            switch (a) {
              case 7939:
                b = W.getSupportedExtensions() || [];
                b = b.concat(b.map(function (f) {
                  return "GL_" + f;
                }));
                b = Md(b.join(" "));
                break;
              case 7936:
              case 7937:
              case 37445:
              case 37446:
                (b = W.getParameter(a)) || Cd(1280);
                b = b && Md(b);
                break;
              case 7938:
                b = W.getParameter(7938);
                b = 2 <= v.version
                  ? "OpenGL ES 3.0 (" + b + ")"
                  : "OpenGL ES 2.0 (" + b + ")";
                b = Md(b);
                break;
              case 35724:
                b = W.getParameter(35724);
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
        ab: function (a, b) {
          if (2 > v.version) return Cd(1282), 0;
          var c = Ad[a];
          if (c) return 0 > b || b >= c.length ? (Cd(1281), 0) : c[b];
          switch (a) {
            case 7939:
              return c = W.getSupportedExtensions() ||
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
        Fa: function (a, b) {
          function c(A) {
            return "]" == A.slice(-1) && A.lastIndexOf("[");
          }
          b = Xa(b);
          a = sd[a];
          var f = a.df, g = a.Cg, l, p = 0, u = b, x = c(b);
          if (!f) {
            for (
              a.df = f = {}, a.Bf = {}, l = 0;
              l < W.getProgramParameter(a, 35718);
              ++l
            ) {
              var w = W.getActiveUniform(a, l);
              var H = w.name;
              w = w.size;
              var K = c(H);
              K = 0 < K ? H.slice(0, K) : H;
              var O = a.pf;
              a.pf += w;
              g[K] = [w, O];
              for (H = 0; H < w; ++H) f[O] = H, a.Bf[O++] = K;
            }
          }
          0 <
              x && (p = parseInt(b.slice(x + 1)) >>> 0, u = b.slice(0, x));
          return (g = g[u]) && p < g[0] &&
              (p += g[1], f[p] = f[p] || W.getUniformLocation(a, b)) ? p : -1;
        },
        Mb: function (a, b, c) {
          for (var f = Jd[b], g = 0; g < b; g++) f[g] = P[c + 4 * g >> 2];
          W.invalidateFramebuffer(a, f);
        },
        Nb: function (a, b, c, f, g, l, p) {
          for (var u = Jd[b], x = 0; x < b; x++) u[x] = P[c + 4 * x >> 2];
          W.invalidateSubFramebuffer(a, u, f, g, l, p);
        },
        Ub: function (a) {
          return W.isSync(yd[a]);
        },
        Ga: function (a) {
          return (a = na[a]) ? W.isTexture(a) : 0;
        },
        Ha: function (a) {
          W.lineWidth(a);
        },
        Ia: function (a) {
          a = sd[a];
          W.linkProgram(a);
          a.df = 0;
          a.Cg = {};
        },
        nc: function (a, b, c, f, g, l) {
          W.zf.multiDrawArraysInstancedBaseInstanceWEBGL(
            a,
            P,
            b >> 2,
            P,
            c >> 2,
            P,
            f >> 2,
            mb,
            g >> 2,
            l,
          );
        },
        oc: function (a, b, c, f, g, l, p, u) {
          W.zf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(
            a,
            P,
            b >> 2,
            c,
            P,
            f >> 2,
            P,
            g >> 2,
            P,
            l >> 2,
            mb,
            p >> 2,
            u,
          );
        },
        Ja: function (a, b) {
          3317 == a && (Bd = b);
          W.pixelStorei(a, b);
        },
        qc: function (a) {
          W.readBuffer(a);
        },
        Ka: function (a, b, c, f, g, l, p) {
          if (2 <= v.version) {
            if (W.kf) W.readPixels(a, b, c, f, g, l, p);
            else {
              var u = Od(l);
              W.readPixels(
                a,
                b,
                c,
                f,
                g,
                l,
                u,
                p >> 31 - Math.clz32(u.BYTES_PER_ELEMENT),
              );
            }
          } else {
            (p = Pd(l, g, c, f, p)) ? W.readPixels(a, b, c, f, g, l, p)
            : Cd(1280);
          }
        },
        $b: function (a, b, c, f) {
          W.renderbufferStorage(a, b, c, f);
        },
        Wb: function (a, b, c, f, g) {
          W.renderbufferStorageMultisample(a, b, c, f, g);
        },
        Rb: function (a, b, c) {
          W.samplerParameteri(xd[a], b, c);
        },
        Sb: function (a, b, c) {
          W.samplerParameteri(xd[a], b, P[c >> 2]);
        },
        La: function (a, b, c, f) {
          W.scissor(a, b, c, f);
        },
        Ma: function (a, b, c, f) {
          for (var g = "", l = 0; l < b; ++l) {
            var p = f ? P[f + 4 * l >> 2] : -1;
            g += Xa(P[c + 4 * l >> 2], 0 > p ? void 0 : p);
          }
          W.shaderSource(vd[a], g);
        },
        Na: function (a, b, c) {
          W.stencilFunc(a, b, c);
        },
        Oa: function (a, b, c, f) {
          W.stencilFuncSeparate(a, b, c, f);
        },
        Pa: function (a) {
          W.stencilMask(a);
        },
        Qa: function (a, b) {
          W.stencilMaskSeparate(a, b);
        },
        Ra: function (a, b, c) {
          W.stencilOp(a, b, c);
        },
        Sa: function (a, b, c, f) {
          W.stencilOpSeparate(a, b, c, f);
        },
        Ta: function (a, b, c, f, g, l, p, u, x) {
          if (2 <= v.version) {
            if (W.He) W.texImage2D(a, b, c, f, g, l, p, u, x);
            else if (x) {
              var w = Od(u);
              W.texImage2D(
                a,
                b,
                c,
                f,
                g,
                l,
                p,
                u,
                w,
                x >> 31 - Math.clz32(w.BYTES_PER_ELEMENT),
              );
            } else W.texImage2D(a, b, c, f, g, l, p, u, null);
          } else {
            W.texImage2D(
              a,
              b,
              c,
              f,
              g,
              l,
              p,
              u,
              x ? Pd(u, p, f, g, x) : null,
            );
          }
        },
        Ua: function (a, b, c) {
          W.texParameterf(a, b, c);
        },
        Va: function (a, b, c) {
          W.texParameterf(a, b, S[c >> 2]);
        },
        Wa: function (a, b, c) {
          W.texParameteri(a, b, c);
        },
        Xa: function (a, b, c) {
          W.texParameteri(a, b, P[c >> 2]);
        },
        kc: function (a, b, c, f, g) {
          W.texStorage2D(a, b, c, f, g);
        },
        Ya: function (a, b, c, f, g, l, p, u, x) {
          if (2 <= v.version) {
            if (W.He) W.texSubImage2D(a, b, c, f, g, l, p, u, x);
            else if (x) {
              var w = Od(u);
              W.texSubImage2D(
                a,
                b,
                c,
                f,
                g,
                l,
                p,
                u,
                w,
                x >> 31 - Math.clz32(w.BYTES_PER_ELEMENT),
              );
            } else W.texSubImage2D(a, b, c, f, g, l, p, u, null);
          } else {
            w = null,
              x && (w = Pd(u, p, g, l, x)),
              W.texSubImage2D(a, b, c, f, g, l, p, u, w);
          }
        },
        Za: function (a, b) {
          W.uniform1f(Z(a), b);
        },
        _a: function (a, b, c) {
          if (2 <= v.version) W.uniform1fv(Z(a), S, c >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Qd[b - 1], g = 0; g < b; ++g) {
                f[g] = S[c + 4 * g >> 2];
              }
            } else f = S.subarray(c >> 2, c + 4 * b >> 2);
            W.uniform1fv(Z(a), f);
          }
        },
        Vc: function (a, b) {
          W.uniform1i(Z(a), b);
        },
        Wc: function (a, b, c) {
          if (2 <= v.version) W.uniform1iv(Z(a), P, c >> 2, b);
          else {
            if (288 >= b) {
              for (var f = Rd[b - 1], g = 0; g < b; ++g) {
                f[g] = P[c + 4 * g >> 2];
              }
            } else f = P.subarray(c >> 2, c + 4 * b >> 2);
            W.uniform1iv(Z(a), f);
          }
        },
        Xc: function (a, b, c) {
          W.uniform2f(Z(a), b, c);
        },
        Yc: function (a, b, c) {
          if (2 <= v.version) W.uniform2fv(Z(a), S, c >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (var f = Qd[2 * b - 1], g = 0; g < 2 * b; g += 2) {
                f[g] = S[c + 4 * g >> 2], f[g + 1] = S[c + (4 * g + 4) >> 2];
              }
            } else f = S.subarray(c >> 2, c + 8 * b >> 2);
            W.uniform2fv(Z(a), f);
          }
        },
        Uc: function (a, b, c) {
          W.uniform2i(Z(a), b, c);
        },
        Tc: function (a, b, c) {
          if (2 <= v.version) W.uniform2iv(Z(a), P, c >> 2, 2 * b);
          else {
            if (144 >= b) {
              for (var f = Rd[2 * b - 1], g = 0; g < 2 * b; g += 2) {
                f[g] = P[c + 4 * g >> 2], f[g + 1] = P[c + (4 * g + 4) >> 2];
              }
            } else f = P.subarray(c >> 2, c + 8 * b >> 2);
            W.uniform2iv(Z(a), f);
          }
        },
        Sc: function (a, b, c, f) {
          W.uniform3f(Z(a), b, c, f);
        },
        Rc: function (a, b, c) {
          if (2 <= v.version) W.uniform3fv(Z(a), S, c >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (var f = Qd[3 * b - 1], g = 0; g < 3 * b; g += 3) {
                f[g] = S[c + 4 * g >> 2],
                  f[g + 1] = S[c + (4 * g + 4) >> 2],
                  f[g + 2] = S[c + (4 * g + 8) >> 2];
              }
            } else f = S.subarray(c >> 2, c + 12 * b >> 2);
            W.uniform3fv(Z(a), f);
          }
        },
        Qc: function (a, b, c, f) {
          W.uniform3i(Z(a), b, c, f);
        },
        Pc: function (a, b, c) {
          if (2 <= v.version) W.uniform3iv(Z(a), P, c >> 2, 3 * b);
          else {
            if (96 >= b) {
              for (var f = Rd[3 * b - 1], g = 0; g < 3 * b; g += 3) {
                f[g] = P[c + 4 * g >> 2],
                  f[g + 1] = P[c + (4 * g + 4) >> 2],
                  f[g + 2] = P[c + (4 * g + 8) >> 2];
              }
            } else f = P.subarray(c >> 2, c + 12 * b >> 2);
            W.uniform3iv(Z(a), f);
          }
        },
        Oc: function (a, b, c, f, g) {
          W.uniform4f(Z(a), b, c, f, g);
        },
        Nc: function (a, b, c) {
          if (2 <= v.version) W.uniform4fv(Z(a), S, c >> 2, 4 * b);
          else {
            if (72 >= b) {
              var f = Qd[4 * b - 1], g = S;
              c >>= 2;
              for (var l = 0; l < 4 * b; l += 4) {
                var p = c + l;
                f[l] = g[p];
                f[l + 1] = g[p + 1];
                f[l + 2] = g[p + 2];
                f[l + 3] = g[p + 3];
              }
            } else f = S.subarray(c >> 2, c + 16 * b >> 2);
            W.uniform4fv(Z(a), f);
          }
        },
        Bc: function (a, b, c, f, g) {
          W.uniform4i(Z(a), b, c, f, g);
        },
        Cc: function (a, b, c) {
          if (2 <= v.version) W.uniform4iv(Z(a), P, c >> 2, 4 * b);
          else {
            if (72 >= b) {
              for (var f = Rd[4 * b - 1], g = 0; g < 4 * b; g += 4) {
                f[g] = P[c + 4 * g >> 2],
                  f[g + 1] = P[c + (4 * g + 4) >> 2],
                  f[g + 2] = P[c + (4 * g + 8) >> 2],
                  f[g + 3] = P[
                    c + (4 *
                          g + 12) >> 2
                  ];
              }
            } else f = P.subarray(c >> 2, c + 16 * b >> 2);
            W.uniform4iv(Z(a), f);
          }
        },
        Dc: function (a, b, c, f) {
          if (2 <= v.version) W.uniformMatrix2fv(Z(a), !!c, S, f >> 2, 4 * b);
          else {
            if (72 >= b) {
              for (var g = Qd[4 * b - 1], l = 0; l < 4 * b; l += 4) {
                g[l] = S[f + 4 * l >> 2],
                  g[l + 1] = S[f + (4 * l + 4) >> 2],
                  g[l + 2] = S[f + (4 * l + 8) >> 2],
                  g[l + 3] = S[f + (4 * l + 12) >> 2];
              }
            } else g = S.subarray(f >> 2, f + 16 * b >> 2);
            W.uniformMatrix2fv(Z(a), !!c, g);
          }
        },
        Ec: function (a, b, c, f) {
          if (2 <= v.version) W.uniformMatrix3fv(Z(a), !!c, S, f >> 2, 9 * b);
          else {
            if (32 >= b) {
              for (var g = Qd[9 * b - 1], l = 0; l < 9 * b; l += 9) {
                g[l] = S[f + 4 * l >> 2],
                  g[l + 1] = S[
                    f +
                      (4 * l + 4) >> 2
                  ],
                  g[l + 2] = S[f + (4 * l + 8) >> 2],
                  g[l + 3] = S[f + (4 * l + 12) >> 2],
                  g[l + 4] = S[f + (4 * l + 16) >> 2],
                  g[l + 5] = S[f + (4 * l + 20) >> 2],
                  g[l + 6] = S[f + (4 * l + 24) >> 2],
                  g[l + 7] = S[f + (4 * l + 28) >> 2],
                  g[l + 8] = S[f + (4 * l + 32) >> 2];
              }
            } else g = S.subarray(f >> 2, f + 36 * b >> 2);
            W.uniformMatrix3fv(Z(a), !!c, g);
          }
        },
        Fc: function (a, b, c, f) {
          if (2 <= v.version) W.uniformMatrix4fv(Z(a), !!c, S, f >> 2, 16 * b);
          else {
            if (18 >= b) {
              var g = Qd[16 * b - 1], l = S;
              f >>= 2;
              for (var p = 0; p < 16 * b; p += 16) {
                var u = f + p;
                g[p] = l[u];
                g[p + 1] = l[u + 1];
                g[p + 2] = l[u + 2];
                g[p + 3] = l[u + 3];
                g[p + 4] = l[u + 4];
                g[p + 5] = l[u + 5];
                g[p + 6] = l[u + 6];
                g[p + 7] = l[u + 7];
                g[p + 8] = l[u + 8];
                g[p + 9] = l[u + 9];
                g[p + 10] = l[u + 10];
                g[p + 11] = l[u + 11];
                g[p + 12] = l[u + 12];
                g[p + 13] = l[u + 13];
                g[p + 14] = l[u + 14];
                g[p + 15] = l[u + 15];
              }
            } else g = S.subarray(f >> 2, f + 64 * b >> 2);
            W.uniformMatrix4fv(Z(a), !!c, g);
          }
        },
        Gc: function (a) {
          a = sd[a];
          W.useProgram(a);
          W.Kf = a;
        },
        Hc: function (a, b) {
          W.vertexAttrib1f(a, b);
        },
        Ic: function (a, b) {
          W.vertexAttrib2f(a, S[b >> 2], S[b + 4 >> 2]);
        },
        Jc: function (a, b) {
          W.vertexAttrib3f(a, S[b >> 2], S[b + 4 >> 2], S[b + 8 >> 2]);
        },
        Kc: function (a, b) {
          W.vertexAttrib4f(
            a,
            S[b >> 2],
            S[b + 4 >> 2],
            S[b + 8 >> 2],
            S[b + 12 >> 2],
          );
        },
        lc: function (a, b) {
          W.vertexAttribDivisor(a, b);
        },
        mc: function (a, b, c, f, g) {
          W.vertexAttribIPointer(a, b, c, f, g);
        },
        Lc: function (a, b, c, f, g, l) {
          W.vertexAttribPointer(a, b, c, !!f, g, l);
        },
        Mc: function (a, b, c, f) {
          W.viewport(a, b, c, f);
        },
        db: function (a, b, c, f) {
          W.waitSync(yd[a], b, (c >>> 0) + 4294967296 * f);
        },
        e: function (a, b) {
          je(a, b || 1);
          throw "longjmp";
        },
        pb: function (a) {
          var b = G.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var f = b * (1 + .2 / c);
            f = Math.min(f, a + 100663296);
            f = Math.max(a, f);
            0 < f % 65536 && (f += 65536 - f % 65536);
            a: {
              try {
                Sa.grow(
                  Math.min(2147483648, f) - gb.byteLength + 65535 >>>
                    16,
                );
                ob();
                var g = 1;
                break a;
              } catch (l) {}
              g = void 0;
            }
            if (g) return !0;
          }
          return !1;
        },
        ea: function () {
          return v ? v.yf : 0;
        },
        V: function (a) {
          return ia(a) ? 0 : -5;
        },
        tb: function (a, b) {
          var c = 0;
          Td().forEach(function (f, g) {
            var l = b + c;
            g = P[a + 4 * g >> 2] = l;
            for (l = 0; l < f.length; ++l) lb[g++ >> 0] = f.charCodeAt(l);
            lb[g >> 0] = 0;
            c += f.length + 1;
          });
          return 0;
        },
        ub: function (a, b) {
          var c = Td();
          P[a >> 2] = c.length;
          var f = 0;
          c.forEach(function (g) {
            f += g.length + 1;
          });
          P[b >> 2] = f;
          return 0;
        },
        Gb: function (a) {
          if (!noExitRuntime) {
            if (r.onExit) r.onExit(a);
            Ta = !0;
          }
          xa(a, new Ka(a));
        },
        F: function () {
          return 0;
        },
        sb: function (a, b) {
          a = 1 == a || 2 == a ? 2 : La();
          lb[b >> 0] = a;
          return 0;
        },
        mb: function (a, b, c, f, g, l) {
          a = Ib.Uf(a);
          b = Ib.Lf(a, b, c, f);
          P[l >> 2] = b;
          return 0;
        },
        vb: function (a, b, c, f) {
          a = Ib.Uf(a);
          b = Ib.Lf(a, b, c);
          P[f >> 2] = b;
          return 0;
        },
        lb: function () {},
        L: function (a, b, c, f) {
          for (var g = 0, l = 0; l < c; l++) {
            for (
              var p = P[b + 8 * l >> 2], u = P[b + (8 * l + 4) >> 2], x = 0;
              x < u;
              x++
            ) {
              var w = G[p + x], H = Hb[a];
              0 === w || 10 === w
                ? ((1 === a ? Ma : Pa)(Wa(H, 0)), H.length = 0)
                : H.push(w);
            }
            g += u;
          }
          P[f >> 2] = g;
          return 0;
        },
        a: function () {
          return Qa;
        },
        fd: function (a, b) {
          W.bindFramebuffer(a, td[b]);
        },
        cb: function (a) {
          W.clear(a);
        },
        Cb: function (a, b, c, f) {
          W.clearColor(a, b, c, f);
        },
        hb: function (a) {
          W.clearStencil(a);
        },
        H: function (a, b) {
          Ld(a, b);
        },
        l: ke,
        o: le,
        g: me,
        C: ne,
        Kb: oe,
        T: pe,
        S: qe,
        R: re,
        m: se,
        r: te,
        i: ue,
        p: ve,
        Jb: we,
        Hb: xe,
        Ib: ye,
        b: function (a) {
          Qa = a;
        },
        rb: function (a, b, c, f) {
          return $d(a, b, c, f);
        },
      };
      (function () {
        function a(g) {
          r.asm = g.exports;
          Sa = r.asm.gd;
          ob();
          pb = r.asm.jd;
          rb.unshift(r.asm.hd);
          ub--;
          r.monitorRunDependencies && r.monitorRunDependencies(ub);
          0 == ub &&
            (null !== vb && (clearInterval(vb), vb = null),
              wb && (g = wb, wb = null, g()));
        }
        function b(g) {
          a(g.instance);
        }
        function c(g) {
          return Bb().then(function (l) {
            return WebAssembly.instantiate(wasmBuff, f);
          }).then(g, function (l) {
            Pa("failed to asynchronously prepare wasm: " + l);
            La(l);
          });
        }
        var f = { a: ze };
        ub++;
        r.monitorRunDependencies && r.monitorRunDependencies(ub);
        if (r.instantiateWasm) {
          try {
            return r.instantiateWasm(f, a);
          } catch (g) {
            return Pa(
              "Module.instantiateWasm callback failed with error: " + g,
            ),
              !1;
          }
        }
        (function () {
          return Ra || "function" !== typeof WebAssembly.instantiateStreaming ||
              xb() || yb.startsWith("file://") || "function" !== typeof fetch
            ? c(b)
            : Promise.resolve().then(function (g) {
              return WebAssembly.instantiate(wasmBuff, f).then(
                b,
                function (l) {
                  Pa("wasm streaming compile failed: " + l);
                  Pa("falling back to ArrayBuffer instantiation");
                  return c(b);
                },
              );
            });
        })().catch(ea);
        return {};
      })();
      r.___wasm_call_ctors = function () {
        return (r.___wasm_call_ctors = r.asm.hd).apply(null, arguments);
      };
      var he = r._memset = function () {
          return (he = r._memset = r.asm.id).apply(null, arguments);
        },
        Nd = r._malloc = function () {
          return (Nd = r._malloc = r.asm.kd).apply(null, arguments);
        },
        Kc = r._free = function () {
          return (Kc = r._free = r.asm.ld).apply(null, arguments);
        },
        ie = r.___errno_location = function () {
          return (ie = r.___errno_location = r.asm.md).apply(null, arguments);
        },
        Jc = r.___getTypeName = function () {
          return (Jc = r.___getTypeName = r.asm.nd).apply(null, arguments);
        };
      r.___embind_register_native_and_builtin_types = function () {
        return (r.___embind_register_native_and_builtin_types = r.asm.od).apply(
          null,
          arguments,
        );
      };
      var Ae = r.stackSave = function () {
          return (Ae = r.stackSave = r.asm.pd).apply(null, arguments);
        },
        Be = r.stackRestore = function () {
          return (Be = r.stackRestore = r.asm.qd).apply(null, arguments);
        },
        je = r._setThrew = function () {
          return (je = r._setThrew = r.asm.rd).apply(null, arguments);
        },
        ge = r._memalign = function () {
          return (ge = r._memalign = r.asm.sd).apply(null, arguments);
        };
      r.dynCall_iiiji = function () {
        return (r.dynCall_iiiji = r.asm.td).apply(null, arguments);
      };
      r.dynCall_ji = function () {
        return (r.dynCall_ji = r.asm.ud).apply(null, arguments);
      };
      r.dynCall_iiji = function () {
        return (r.dynCall_iiji = r.asm.vd).apply(null, arguments);
      };
      r.dynCall_iijjiii = function () {
        return (r.dynCall_iijjiii = r.asm.wd).apply(null, arguments);
      };
      r.dynCall_iij = function () {
        return (r.dynCall_iij = r.asm.xd).apply(null, arguments);
      };
      r.dynCall_vijjjii = function () {
        return (r.dynCall_vijjjii = r.asm.yd).apply(null, arguments);
      };
      r.dynCall_viji = function () {
        return (r.dynCall_viji = r.asm.zd).apply(null, arguments);
      };
      r.dynCall_vijiii = function () {
        return (r.dynCall_vijiii = r.asm.Ad).apply(null, arguments);
      };
      r.dynCall_viiiiij = function () {
        return (r.dynCall_viiiiij = r.asm.Bd).apply(null, arguments);
      };
      r.dynCall_viijii = function () {
        return (r.dynCall_viijii = r.asm.Cd).apply(null, arguments);
      };
      r.dynCall_jiiii = function () {
        return (r.dynCall_jiiii = r.asm.Dd).apply(null, arguments);
      };
      r.dynCall_jii = function () {
        return (r.dynCall_jii = r.asm.Ed).apply(null, arguments);
      };
      r.dynCall_iiij = function () {
        return (r.dynCall_iiij = r.asm.Fd).apply(null, arguments);
      };
      r.dynCall_iiiij = function () {
        return (r.dynCall_iiiij = r.asm.Gd).apply(null, arguments);
      };
      r.dynCall_viij = function () {
        return (r.dynCall_viij = r.asm.Hd).apply(null, arguments);
      };
      r.dynCall_viiij = function () {
        return (r.dynCall_viiij = r.asm.Id).apply(null, arguments);
      };
      r.dynCall_vij = function () {
        return (r.dynCall_vij = r.asm.Jd).apply(null, arguments);
      };
      r.dynCall_jiiiiii = function () {
        return (r.dynCall_jiiiiii = r.asm.Kd).apply(null, arguments);
      };
      r.dynCall_jiiiiji = function () {
        return (r.dynCall_jiiiiji = r.asm.Ld).apply(null, arguments);
      };
      r.dynCall_iijj = function () {
        return (r.dynCall_iijj = r.asm.Md).apply(null, arguments);
      };
      r.dynCall_jiji = function () {
        return (r.dynCall_jiji = r.asm.Nd).apply(null, arguments);
      };
      r.dynCall_iiiiij = function () {
        return (r.dynCall_iiiiij = r.asm.Od).apply(null, arguments);
      };
      r.dynCall_iiiiijj = function () {
        return (r.dynCall_iiiiijj = r.asm.Pd).apply(null, arguments);
      };
      r.dynCall_iiiiiijj = function () {
        return (r.dynCall_iiiiiijj = r.asm.Qd).apply(null, arguments);
      };
      function ke(a, b) {
        var c = Ae();
        try {
          return pb.get(a)(b);
        } catch (f) {
          Be(c);
          if (f !== f + 0 && "longjmp" !== f) throw f;
          je(1, 0);
        }
      }
      function le(a, b, c) {
        var f = Ae();
        try {
          return pb.get(a)(b, c);
        } catch (g) {
          Be(f);
          if (g !== g + 0 && "longjmp" !== g) throw g;
          je(1, 0);
        }
      }
      function ue(a, b, c, f) {
        var g = Ae();
        try {
          pb.get(a)(b, c, f);
        } catch (l) {
          Be(g);
          if (l !== l + 0 && "longjmp" !== l) throw l;
          je(1, 0);
        }
      }
      function me(a, b, c, f) {
        var g = Ae();
        try {
          return pb.get(a)(b, c, f);
        } catch (l) {
          Be(g);
          if (l !== l + 0 && "longjmp" !== l) throw l;
          je(1, 0);
        }
      }
      function se(a, b) {
        var c = Ae();
        try {
          pb.get(a)(b);
        } catch (f) {
          Be(c);
          if (f !== f + 0 && "longjmp" !== f) throw f;
          je(1, 0);
        }
      }
      function te(a, b, c) {
        var f = Ae();
        try {
          pb.get(a)(b, c);
        } catch (g) {
          Be(f);
          if (g !== g + 0 && "longjmp" !== g) throw g;
          je(1, 0);
        }
      }
      function oe(a, b, c, f, g, l) {
        var p = Ae();
        try {
          return pb.get(a)(b, c, f, g, l);
        } catch (u) {
          Be(p);
          if (u !== u + 0 && "longjmp" !== u) throw u;
          je(1, 0);
        }
      }
      function ve(a, b, c, f, g) {
        var l = Ae();
        try {
          pb.get(a)(b, c, f, g);
        } catch (p) {
          Be(l);
          if (p !== p + 0 && "longjmp" !== p) throw p;
          je(1, 0);
        }
      }
      function pe(a, b, c, f, g, l, p) {
        var u = Ae();
        try {
          return pb.get(a)(b, c, f, g, l, p);
        } catch (x) {
          Be(u);
          if (x !== x + 0 && "longjmp" !== x) throw x;
          je(1, 0);
        }
      }
      function ne(a, b, c, f, g) {
        var l = Ae();
        try {
          return pb.get(a)(b, c, f, g);
        } catch (p) {
          Be(l);
          if (p !== p + 0 && "longjmp" !== p) throw p;
          je(1, 0);
        }
      }
      function we(a, b, c, f, g, l) {
        var p = Ae();
        try {
          pb.get(a)(b, c, f, g, l);
        } catch (u) {
          Be(p);
          if (u !== u + 0 && "longjmp" !== u) throw u;
          je(1, 0);
        }
      }
      function ye(a, b, c, f, g, l, p, u, x, w) {
        var H = Ae();
        try {
          pb.get(a)(b, c, f, g, l, p, u, x, w);
        } catch (K) {
          Be(H);
          if (K !== K + 0 && "longjmp" !== K) throw K;
          je(1, 0);
        }
      }
      function xe(a, b, c, f, g, l, p) {
        var u = Ae();
        try {
          pb.get(a)(b, c, f, g, l, p);
        } catch (x) {
          Be(u);
          if (x !== x + 0 && "longjmp" !== x) throw x;
          je(1, 0);
        }
      }
      function qe(a, b, c, f, g, l, p, u, x, w) {
        var H = Ae();
        try {
          return pb.get(a)(b, c, f, g, l, p, u, x, w);
        } catch (K) {
          Be(H);
          if (K !== K + 0 && "longjmp" !== K) throw K;
          je(1, 0);
        }
      }
      function re(a) {
        var b = Ae();
        try {
          pb.get(a)();
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
      wb = function De() {
        Ce || Ee();
        Ce || (wb = De);
      };
      function Ee() {
        function a() {
          if (!Ce && (Ce = !0, r.calledRun = !0, !Ta)) {
            Db(rb);
            ca(r);
            if (r.onRuntimeInitialized) r.onRuntimeInitialized();
            if (r.postRun) {
              for (
                "function" == typeof r.postRun && (r.postRun = [r.postRun]);
                r.postRun.length;
              ) {
                var b = r.postRun.shift();
                sb.unshift(b);
              }
            }
            Db(sb);
          }
        }
        if (!(0 < ub)) {
          if (r.preRun) {
            for (
              "function" == typeof r.preRun && (r.preRun = [r.preRun]);
              r.preRun.length;
            ) {
              tb();
            }
          }
          Db(qb);
          0 < ub ||
            (r.setStatus
              ? (r.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    r.setStatus("");
                  }, 1);
                  a();
                }, 1))
              : a());
        }
      }
      r.run = Ee;
      if (r.preInit) {
        for (
          "function" == typeof r.preInit && (r.preInit = [r.preInit]);
          0 < r.preInit.length;
        ) {
          r.preInit.pop()();
        }
      }
      Ee();

      return CanvasKitInit.ready;
    }
  );
})();
if (typeof exports === "object" && typeof module === "object") {
  module.exports = CanvasKitInit;
} else if (typeof define === "function" && define["amd"]) {
  define([], function () {
    return CanvasKitInit;
  });
} else if (typeof exports === "object") {
  exports["CanvasKitInit"] = CanvasKitInit;
}
