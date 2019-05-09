/** Configuration options for the timeout. */
export default interface IOptions {
    /** The element to listen for the timeout. */
    element: HTMLElement;
    /** Wether the timeout should restart on completion. */
    loop: boolean;
    /** The idle timeout in milliseconds. */
    timeout: number;
}
