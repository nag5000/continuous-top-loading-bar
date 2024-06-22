type CSSDeclaration = {
  [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
};

/**
 * A stupidly simple Continuous Top Loader Bar component.
 */
export class ContinuousTopLoadingBar {
  #progressAnimation: Animation;
  #doneAnimation: Animation;

  /**
   * Create a new `ContinuousTopLoadingBar` instance.
   * @param bar - The `HTMLElement` to use as the loading bar.
   * @param style - The style to apply to the loading bar.
   *                If `null`, the loading bar will be unstyled (use your own CSS).
   *                If `undefined`, the default style will be used.
   *                If an object, the default style will be merged with the provided style.
   *
   * @example
   * ```ts
   * const bar = document.createElement("div");
   * document.body.appendChild(bar);
   *
   * const loader = new ContinuousTopLoadingBar(bar, { zIndex: "100" });
   * // loader.start();
   * // loader.done();
   * ```
   */
  constructor(bar: HTMLElement, style?: CSSDeclaration | undefined | null) {
    // style: null - unstyled
    // style: undefined - use default style
    // style: {...} - merge with default style
    if (style !== null) {
      style = {
        position: "fixed",
        zIndex: "1",
        top: "0",
        left: "0",
        width: "100%",
        height: "4px",
        backgroundColor: "violet",
        transform: "translate(-100%, 0)",
        opacity: "0",
        pointerEvents: "none",
        ...style,
      };

      Object.assign(bar.style, style);
    }

    const progressAnimation = new Animation(this.getProgressKeyframes(bar));
    const doneAnimation = new Animation(this.getDoneKeyframes(bar));

    doneAnimation.onfinish = () => {
      progressAnimation.cancel();
    };

    this.#progressAnimation = progressAnimation;
    this.#doneAnimation = doneAnimation;
  }

  /**
   * Get the keyframes for the progress animation.
   *
   * To define a custom animation, override this method:
   * @example
   * ```ts
   * class CustomLoadingBar extends ContinuousTopLoadingBar {
   *   getProgressKeyframes(bar: HTMLElement): KeyframeEffect {
   *     return new KeyframeEffect(bar, ...);
   *   }
   * }
   * ```

   * As an option, to define custom keyframes, you may use the following code:
   * ```js
   * let timeIntervalsMs = [0, 500, 2500, 500, 2500, 10_000]
   * let dur = 0;
   * let offsets = timeIntervalsMs.map((x) => { dur += x; return dur; }).map((x) => x / dur)
   * console.log(dur, offsets)
   * // -> 16000, [0, 0.03125, 0.1875, 0.21875, 0.375, 1]
   * ```
   *
   * @param bar - The loading bar element.
   */
  getProgressKeyframes(bar: HTMLElement): KeyframeEffect {
    return new KeyframeEffect(
      bar,
      [
        { opacity: 1, offset: 0 },
        { transform: "translate(-70%, 0)", offset: 0.03125 },
        { transform: "translate(-60%, 0)", offset: 0.1875 },
        { transform: "translate(-30%, 0)", offset: 0.21875 },
        { transform: "translate(-20%, 0)", offset: 0.375 },
        { opacity: 1, transform: "translate(-4%, 0)", offset: 1 },
      ],
      {
        duration: 16000,
        fill: "forwards",
      },
    );
  }

  /**
   * Get the keyframes for the done animation.
   *
   * To define a custom animation, override this method:
   * @example
   * ```ts
   * class CustomLoadingBar extends ContinuousTopLoadingBar {
   *   getDoneKeyframes(bar: HTMLElement): KeyframeEffect {
   *     return new KeyframeEffect(bar, ...);
   *   }
   * }
   * ```
   *
   * @param bar - The loading bar element.
   */
  getDoneKeyframes(bar: HTMLElement): KeyframeEffect {
    return new KeyframeEffect(
      bar,
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.4 },
        { transform: "translate(0%, 0)", offset: 0.5 },
        { opacity: 0, transform: "translate(0%, 0)", offset: 1 },
      ],
      {
        duration: 1000,
        easing: "ease",
        fill: "forwards",
      },
    );
  }

  /**
   * Start the loading bar animation.
   * @param force - Whether to force the animation to start, even if it is already running.
   */
  start(force = false) {
    if (force || this.#progressAnimation.playState === "idle") {
      this.#doneAnimation.cancel();
      this.#progressAnimation.cancel();
      this.#progressAnimation.play();
    }
  }

  /**
   * Finish the loading bar animation.
   * @param force - Whether to play the animation from start to finish if it is not currently running.
   */
  done(force = false) {
    if (force || this.#progressAnimation.playState === "running") {
      this.#progressAnimation.pause();
      this.#doneAnimation.play();
    }
  }

  /**
   * Cancel the loading bar animation.
   */
  cancel() {
    this.#progressAnimation.cancel();
  }
}
