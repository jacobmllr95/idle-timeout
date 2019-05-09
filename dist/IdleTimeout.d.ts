import OptionsInterface from './interfaces/Options';
/** Creates an idle timeout instnace. */
export default class IdleTimeout {
    /** The callback function to invoke when the timeout is complete. */
    protected callback: () => void;
    /** The merged configuration options for the timeout. */
    protected options: OptionsInterface;
    /** The timeout handle to reset the timeout. */
    protected timeoutHandle: number | null;
    /** Whether the timeout is idle. */
    protected isIdle: boolean;
    /** The start time of the timeout in milliseconds. */
    protected startTime: number;
    /** The remaining time of the timeout in milliseconds. */
    protected remainingTime: number;
    /** The last X-axis position on the page. */
    protected lastPageX: number;
    /** The last Y-axis position on the page. */
    protected lastPageY: number;
    /** The input event names. */
    protected eventNames: string[];
    /**
     * The idle timeout constructor.
     * @param {Function} callback The callback function to invoke when the timeout is complete.
     * @param {object} [options] The configuration options for the timeout.
     * @returns {void}
     */
    constructor(callback: () => void, options?: OptionsInterface);
    /**
     * Pause the timeout.
     * @returns {void}
     */
    pause(): void;
    /**
     * Resume the paused timeout.
     * @returns {void}
     */
    resume(): void;
    /**
     * Reset the timeout.
     * @returns {void}
     */
    reset(): void;
    /**
     * Destroy the instance.
     * @returns {void}
     */
    destroy(): void;
    /**
     * Reset the timeout function.
     * @returns {void}
     */
    protected resetTimeout(): void;
    /**
     * Handle the input events.
     * @param {Event} event The input event.
     * @returns {void}
     */
    protected handleEvent: (event: Event) => void;
    /**
     * Handle the completed timeout.
     * @returns {void}
     */
    protected handleTimeout(): void;
    /** Gets whether the timeout is idle. */
    /**
    * Sets whether the timeout is idle.
    * @param {boolean} value Whether the timeout is idle.
    */
    idle: boolean;
    /**
     * Sets wether the timeout should restart on completion.
     * @param {boolean} value Wether the timeout should restart on completion.
     */
    loop: boolean;
    /**
     * Sets the idle timeout in milliseconds.
     * @param {number} value The idle timeout in milliseconds.
     */
    timeout: number;
}
