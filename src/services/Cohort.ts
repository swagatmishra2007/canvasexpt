import { CohortState, IScheduler, Log, nodeTypes, ProcessorNode, requestMessage } from './Processor';

export class CohortNode implements ProcessorNode {
  store: { [key: string]: number };
  tag: nodeTypes = 'Cohort'
  currentState: { [key: string]: CohortState };
  log: Log;
  requestQueue: requestMessage[];
  persistedStore: string[];
  constructor() {
    this.log = new Log();
    this.requestQueue = [];
    this.persistedStore = [];
    this.currentState = {};
    this.store = new Proxy<{ [key: string]: number }>({}, { get: (target, name) => name in target ? (target[name as string]) : -1 })
  }
  receiveMessageExternal(scheduler: IScheduler, request: requestMessage): void {
    if (!this.currentState[request.tid]) {
      this.currentState[request.tid] = 'Waiting';
    }
    switch (this.currentState[request.tid]) {
      case 'Waiting':
        // request mesage might be PrepareT
        if (request.message === 'prepareT') {
          this.log.append({
            tId: request.tid,
            payload: {
              variable: request.variable,
              oldValue: this.store[request.variable],
              newValue: request.value
            }
          });
          // check wal and send abort/commit
          if (this.log.findStateOfVariable(request.variable)) {
            scheduler.sendToCoordinator({
              message: 'Ack',
              tid: request.tid
            });
          }
          else {
            scheduler.sendToCoordinator({
              message: 'Abort',
              tid: request.tid
            });
          }
        }
        break;
      case 'CommitT-Received':
        // write commit to wal for transaction
        this.log.append({
          tId: request.tid,
          payload: 'Commit'
        });
        // update persisted store
        // send commit ack
        break;
      case 'AbortT-Received':
        // write abort to wal for transaction
        this.log.append({
          tId: request.tid,
          payload: 'Abort'
        });
        // send abort ack
        break;
    }
  }
};
