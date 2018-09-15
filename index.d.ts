export as namespace idleTimeout;
export = idleTimeout;

/**
 * Creates an idle timeout listener.
 * @param callback The callback function to invoke when the timeout is complete.
 * @param options Configuration options for the timeout.
 * @returns The timeout instance.
 */
declare function idleTimeout(
  callback: () => void,
  options?: idleTimeout.Options
): idleTimeout.Instance;

declare namespace idleTimeout {
  /**
   * Configuration options for the timeout.
   */
  export type Options = Partial<{
    /**
     * The element to listen for the timeout (document by default).
     */
    element: HTMLElement;
    /**
     * The idle timeout in milliseconds (5 minutes by default).
     */
    timeout: number;
    /**
     * Wether the timeout should restart on completion (false by default).
     */
    loop: boolean;
  }>;

  /**
   * A timeout instance that can be used to observe/control the state.
   */
  export interface Instance {
    /**
     * Pause the timeout.
     */
    pause(): void;
    /**
     * Resume the paused timeout.
     */
    resume(): void;
    /**
     * Reset the timeout.
     */
    reset(): void;
    /**
     * Destroy the instance.
     */
    destroy(): void;
    /**
     * Gets/sets whether the timeout is idle.
     */
    idle: boolean;
    /**
     * Sets the idle timeout in milliseconds.
     */
    timeout: number;
    /**
     * Sets wether the timeout should restart on completion.
     */
    loop: boolean;
  }
}
