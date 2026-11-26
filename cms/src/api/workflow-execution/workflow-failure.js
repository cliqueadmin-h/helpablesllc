const knownCodes = new Set(['configuration', 'missing-record', 'network', 'timeout', 'upstream-http']);

class WorkflowFailure extends Error {
  constructor(code, status) {
    super('Workflow operation failed');
    this.code = knownCodes.has(code) ? code : 'unexpected';
    this.status = Number.isInteger(status) && status >= 400 && status <= 599 ? status : null;
    this.transient = ['network', 'timeout'].includes(this.code)
      || (this.code === 'upstream-http' && ([408, 425, 429].includes(this.status) || this.status >= 500));
  }
}

module.exports = { WorkflowFailure };
