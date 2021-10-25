import { CoordinatorState, IScheduler, Log, nodeTypes, ProcessorNode, requestMessage } from './Processor';

export class CoordinatorNode implements ProcessorNode {
  log: Log;
  requestQueue: requestMessage[];
  persistedStore: string[];
  tag: nodeTypes = 'Coordinator';
  currentState: { [key: string]: CoordinatorState };
  private receiveCount: { [key: string]: number };
  constructor() {
    this.log = new Log();
    this.requestQueue = [];
    this.persistedStore = [];
    this.currentState = {};
    this.receiveCount = {};
  }

  private receiveMessage(tid: string): boolean {
    if (this.currentState[tid] !== 'PrepareT-Sent') {
      return false;
    }
    this.receiveCount[tid] = this.receiveCount[tid] ? this.receiveCount[tid] + 1 : 1;
    if (this.receiveCount[tid] === 4) {
      delete this.receiveCount[tid];
      return true;
    }
    return false;
  }

  receiveMessageExternal(scheduler: IScheduler, request: requestMessage): void {
    if (!this.currentState[request.tid]) {
      this.currentState[request.tid] = 'Waiting';
    }

    switch (this.currentState[request.tid]) {
      case 'Waiting':
        // update write ahead log
        // send out notification
        this.log.append({
          tId: request.tid,
          payload: {
            variable: request.variable,
            oldValue: -1,
            newValue: request.value
          }
        });
        scheduler.broadcast({
          tid: request.tid,
          message: 'prepareT', //todo: need a payload
          variable: request.variable,
          value: request.value
        });
        this.currentState[request.tid] = 'PrepareT-Sent';
        break;
      case 'PrepareT-Sent':
        if (request.message === 'Abort') {
          scheduler.broadcast({
            tid: request.tid,
            message: 'AbortT'
          });
          delete this.receiveCount[request.tid];
          this.currentState[request.tid] = 'AbortT-Sent';
        }
        else {
          // count commits
          if (this.receiveMessage(request.tid)) {
            scheduler.broadcast({
              tid: request.tid,
              message: 'CommitT'
            });
            this.currentState[request.tid] = 'CommitT-Sent';
          }
        }
        break;
      case 'AbortT-Sent':
        if (this.receiveMessage(request.tid)) {
          this.log.append({
            tId: request.tid,
            payload: 'Abort'
          });
          // send back response to scheduler
          this.currentState[request.tid] = 'Waiting';
        }
        break;
      case 'CommitT-Sent':
        if (this.receiveMessage(request.tid)) {
          this.log.append({
            tId: request.tid,
            payload: 'Commit'
          });
          // send back response to scheduler
          this.currentState[request.tid] = 'Waiting';
        }
        break;
    }
  }
};
