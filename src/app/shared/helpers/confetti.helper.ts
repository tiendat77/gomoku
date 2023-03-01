// -----------------------------------------------------------------------------------------------------
// @Types
// -----------------------------------------------------------------------------------------------------
export interface ConfettiOptions {
  particleCount: number;
  angle: number;
  spread: number;
  startVelocity: number;
  decay: number;
  gravity: number;
  drift: number;
  ticks: number;
  x: number;
  y: number;
  scalar: number;
  shapes: string[];
  colors: string[];
  zIndex: number;

  // todo: remove
  disableForReducedMotion: boolean;
}

export interface Fetti {
  x: number;
  y: number;
  wobble: number;
  wobbleSpeed: number;
  velocity: number;
  angle2D: number;
  tiltAngle: number;
  color: RgbColor;
  shape: string;
  tick: number;
  totalTicks: number;
  decay: number;
  drift: number;
  random: number;
  tiltSin: number;
  tiltCos: number;
  wobbleX: number;
  wobbleY: number;
  gravity: number;
  ovalScalar: number;
  scalar: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

// -----------------------------------------------------------------------------------------------------
// @Constants
// -----------------------------------------------------------------------------------------------------

export const DEFAULT_OPTIONS: ConfettiOptions = {
  particleCount: 100,
  angle: 90,
  spread: 45,
  startVelocity: 45,
  decay: 0.9,
  gravity: 1,
  drift: 0,
  ticks: 200,
  x: 0.5,
  y: 0.5,
  shapes: ['square', 'circle'],
  zIndex: 100,
  colors: [
    '#26ccff',
    '#a25afd',
    '#ff5e7e',
    '#88ff5a',
    '#fcff42',
    '#ffa62d',
    '#ff36ff'
  ],
  // probably should be true, but back-compat
  scalar: 1,
  disableForReducedMotion: false,
};

// -----------------------------------------------------------------------------------------------------
// @Utils
// -----------------------------------------------------------------------------------------------------

export function hexToRgb(color: string) {
  color = String(color).replace(/[^0-9a-f]/gi, '');

  if (color.length < 6) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }

  return {
    r: parseInt(color.substring(0, 2), 16),
    g: parseInt(color.substring(2, 4), 16),
    b: parseInt(color.substring(4, 6), 16)
  };
}

export function randomInt(min: number, max: number) {
  // [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
}


// -----------------------------------------------------------------------------------------------------
// @Confetti
// -----------------------------------------------------------------------------------------------------
export class Confetti {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private initialized = false;
  private resizer: any; // Window listener

  private animation = new Animation();

  private _options: ConfettiOptions = DEFAULT_OPTIONS;

  get options(): ConfettiOptions {
    return this._options;
  }

  set options(opts: Partial<ConfettiOptions>) {
    this._options = {
      ...this._options,
      ...opts
    };
  }

  constructor(canvas?: HTMLCanvasElement, opts?: Partial<ConfettiOptions>) {
    this.options = opts ?? {};
  }

  init(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? this._createCanvas();

    const ctx = this.canvas.getContext('2d');
    if(!ctx) {
      throw new Error('Could not get canvas context');
    }
    this.context = ctx;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  fire() {
    if (!this.canvas || !this.context) {
      this.init();
    }

    if (!this.initialized) {
      this._resize();
    }

    const size = this._size();

    this.initialized = true;
    this.resizer = (window: Window, ev: UIEvent) => {
      size.width = size.height = <any>null;
    };

    window.addEventListener('resize', this.resizer, false);

    const fettis = this._generate(
      this.options.particleCount,
      this.canvas.width * this.options.x,
      this.canvas.height * this.options.y,
    );

    if (this.animation && this.animation?.frame) {
      return this.animation.add(fettis);
    }

    this._animate(fettis);
  }

  reset() {
    this.canvas = <any>null;
    document.body.removeChild(this.canvas);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createCanvas() {
    const canvas = document.createElement('canvas');

    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '' + (this.options.zIndex || 100);

    document.body.appendChild(canvas);

    return canvas;
  }

  private _resize() {
    if (!this.canvas) {
      return;
    }

    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
  }

  private _size() {
    return {
      width: this.canvas?.width ?? 0,
      height: this.canvas?.height ?? 0,
    };
  }

  private _generate(
    count: number = 100,
    start: number,
    end: number
  ): Fetti[] {
    const fettis: Fetti[] = [];

    const radAngle = this.options.angle * (Math.PI / 180);
    const radSpread = this.options.spread * (Math.PI / 180);
    const colors = (this.options.colors ?? []).map(c => hexToRgb(c));
    const shapes = (this.options.shapes ?? []);

    while (count--) {
      fettis.push({
        x: start,
        y: end,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
        velocity: (this.options.startVelocity * 0.5) + (Math.random() * this.options.startVelocity),
        angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
        tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
        color: colors[count % colors.length],
        shape: shapes[randomInt(0, shapes.length)],
        tick: 0,
        totalTicks: this.options.ticks,
        decay: this.options.decay,
        drift: this.options.drift,
        random: Math.random() + 2,
        tiltSin: 0,
        tiltCos: 0,
        wobbleX: 0,
        wobbleY: 0,
        gravity: this.options.gravity * 3,
        ovalScalar: 0.6,
        scalar: this.options.scalar,
      });
    }

    return fettis;
  }

  private _done() {
    const size = this._size();

    window.removeEventListener('resize', this.resizer);
    this.context?.clearRect(0, 0, size.width, size.height);
    this.animation.frame = null;

    if (this.canvas) {
      document.body.removeChild(this.canvas);
      this.canvas = <any>null;
      this.initialized = false;
    }
  }

  private _animate(fettis: Fetti[]) {
    return new Promise<void>((resolve) => {
      const done = () => {
        this._done();
        resolve();
      };


      const update = () => {
        const size = this._size();

        if (!size.width && !size.height) {
          this._resize();
          size.width = this.canvas?.width ?? 0;
          size.height = this.canvas?.height ?? 0;
        }

        this.context?.clearRect(0, 0, size.width, size.height);

        this.animation.fettis = this.animation.fettis.filter(fetti =>
          this._update(fetti)
        );

        if (this.animation.fettis?.length) {
          this.animation.frame = Frame.frame(update);

        } else {
          done();
        }
      };

      this.animation.add(fettis);
      this.animation.frame = Frame.frame(update);
    });
  }

  private _update(fetti: Fetti): boolean {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.wobble += fetti.wobbleSpeed;
    fetti.velocity *= fetti.decay;
    fetti.tiltAngle += 0.1;
    fetti.tiltSin = Math.sin(fetti.tiltAngle);
    fetti.tiltCos = Math.cos(fetti.tiltAngle);
    fetti.random = Math.random() + 2;
    fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
    fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

    const progress = (fetti.tick++) / fetti.totalTicks;

    this.context.fillStyle = `
      rgba(
        ${fetti.color.r},
        ${fetti.color.g},
        ${fetti.color.b},
        ${1 - progress}
      )
    `;

    this.context?.beginPath();

    if (fetti.shape === 'circle') {
      this._drawEllipse(fetti);
    } else {
      this._drawRect(fetti);
    }

    this.context?.closePath();
    this.context?.fill();

    return fetti.tick < fetti.totalTicks;
  }

  private _drawEllipse(fetti: Fetti) {
    const x1 = fetti.x + (fetti.random * fetti.tiltCos);
    const y1 = fetti.y + (fetti.random * fetti.tiltSin);
    const x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    const y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);
    const radiusX = Math.abs(x2 - x1) * fetti.ovalScalar;
    const radiusY = Math.abs(y2 - y1) * fetti.ovalScalar;

    this.context?.save();
    this.context?.translate(fetti.x, fetti.y);
    this.context?.rotate(Math.PI / 10 * fetti.wobble);
    this.context?.scale(radiusX, radiusY);
    this.context?.arc(0, 0, 1, 0, 2 * Math.PI);
    this.context?.restore();
  }

  private _drawRect(fetti: Fetti) {
    const x1 = fetti.x + (fetti.random * fetti.tiltCos);
    const y1 = fetti.y + (fetti.random * fetti.tiltSin);
    const x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    const y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

    this.context?.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
    this.context?.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
    this.context?.lineTo(Math.floor(x2), Math.floor(y2));
    this.context?.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
  }

}

export class Animation {

  frame: any; // number | string | Timeout
  fettis: Fetti[] = [];

  constructor(fettis?: Fetti[]) {
    this.fettis = fettis ?? [];
  }

  add(fettis: Fetti[]) {
    this.fettis = this.fettis?.concat(fettis);
  }

  reset() {
    if (this.frame) {
      Frame.cancel(this.frame);
      this.frame = null;
    }
  }

}

export class Frame {

  static lastTime = 0;
  static mapper: {[key: number]: any} = {};

  static readonly TIME = Math.floor(1000 / 60);

  static isSupportedAnimation(): boolean {
    return (
      typeof requestAnimationFrame === 'function' &&
      typeof cancelAnimationFrame === 'function'
    );
  }

  static frame(update: Function) {
    if (!Frame.isSupportedAnimation()) {
      return setTimeout(update(), Frame.TIME);
    }

    const id = Math.random();

    const callback: FrameRequestCallback = (time) => {
      if (
        Frame.lastTime === time ||
        Frame.lastTime + Frame.TIME - 1 < time
      ) {
        Frame.lastTime = time;
        delete Frame.mapper[id];
        update();

      } else {
        Frame.mapper[id] = requestAnimationFrame(callback);
      }
    };

    Frame.mapper[id] = requestAnimationFrame(callback);

    return id;
  }

  static cancel(id: any) {
    if (!Frame.isSupportedAnimation()) {
      return clearTimeout(id);
    }

    if (Frame.mapper[id]) {
      cancelAnimationFrame(Frame.mapper[id]);
    }
  }

}
