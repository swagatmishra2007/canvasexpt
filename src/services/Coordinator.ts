import { CoordinatorState, IScheduler, Log, ProcessorNode, requestMessage } from './Processor';

export class CoordinatorNode implements ProcessorNode {
  log: Log;
  requestQueue: requestMessage[];
  persistedStore: string[];
  tag: 'Coordinator';
  currentState: CoordinatorState;
  private receiveCount: number;
  constructor() {
    this.log = new Log();
    this.requestQueue = [];
    this.persistedStore = [];
    this.currentState = 'Waiting';
    this.receiveCount = 0;
  }

  private receiveMessage(): boolean {
    if (this.currentState !== 'PrepareT-Sent') {
      return false;
    }
    this.receiveCount++;
    if (this.receiveCount === 4) {
      this.receiveCount = 0;
      return true;
    }
    return false;
  }

  receiveMessageExternal(scheduler: IScheduler, request: requestMessage): void {
    switch (this.currentState) {
      case 'Waiting':
        // update write ahead log
        // send out notification
        this.log.append({
          tId: request.tid,
          payload: 'Start'
        });
        scheduler.broadcast({
          tid: request.tid,
          message: 'prepareT'
        });
        this.currentState = 'PrepareT-Sent';
        break;
      case 'PrepareT-Sent':
        if (request.message === 'Abort') {
          scheduler.broadcast({
            tid: request.tid,
            message: 'AbortT'
          });
          this.receiveCount = 0;
          this.currentState = 'AbortT-Sent';
        }
        else {
          // count commits
          if (this.receiveMessage()) {
            scheduler.broadcast({
              tid: request.tid,
              message: 'CommitT'
            });
            this.currentState = 'CommitT-Sent';
          }
        }
        break;
      case 'AbortT-Sent':
        if (this.receiveMessage()) {
          this.log.append({
            tId: request.tid,
            payload: 'Abort'
          });
          // send back response to scheduler
          this.currentState = 'Waiting';
        }
        break;
      case 'CommitT-Sent':
        if (this.receiveMessage()) {
          this.log.append({
            tId: request.tid,
            payload: 'Abort'
          });
          // send back response to scheduler
          this.currentState = 'Waiting';
        }
        break;
    }
  }

  clearMessage() {
    this.receiveCount = 0;
  }
};
