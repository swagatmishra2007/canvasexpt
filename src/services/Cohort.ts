import { CohortState, IScheduler, Log, ProcessorNode, requestMessage } from './Processor';

export class CohortNode implements ProcessorNode {
  tag: 'Cohort'
  currentState: CohortState
  log: Log;
  requestQueue: requestMessage[];
  persistedStore: string[];
  constructor() {
    this.log = new Log();
    this.requestQueue = [];
    this.persistedStore = [];
    this.currentState = 'Waiting';
  }
  receiveMessageExternal(scheduler: IScheduler, request: requestMessage): void {
    switch (this.currentState) {
      case 'Waiting':
        // request mesage might be PrepareT
        // check wal and send abort/commit
        break;
      case 'CommitT-Received':
      // write commit to wal for transaction
      // update persisted store
      // send commit ack
      case 'AbortT-Received':
        // write abort to wal for transaction
        // send abort ack
        break;
    }
  }
};
