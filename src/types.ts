/** Configuration options for the idle timeout. */
export interface UserOptions {
  /** The element to listen for the timeout. */
  element?: HTMLElement;

  /** Wether the timeout should restart on completion. */
  loop?: boolean;

  /** The idle timeout in milliseconds. */
  timeout?: number;
}

export type Options = Required<UserOptions>;
