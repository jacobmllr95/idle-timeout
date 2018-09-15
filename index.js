import IdleTiemout from './lib/idle-timeout';

const idleTimeout = (...args) => new IdleTiemout(...args);

export default idleTimeout;
