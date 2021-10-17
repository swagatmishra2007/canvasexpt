
export type nodeTypes = 'Coordinator' | 'Cohort';

export type coordinatorActions = 'PrepareT' | 'CommitT' | 'AbortT'

export type CoordinatorState = `${coordinatorActions}-${'Sent'}` | 'Waiting';

export type CohortState = `${Exclude<coordinatorActions, 'PrepareT'>}-${'Received'}` | 'Waiting';

export interface ProcessorNode {
  tag: nodeTypes,
  log: Log,
  requestQueue: requestMessage[],
  persistedStore: string[]
}

export interface IScheduler {
  broadcast: (message: requestMessage) => void

}

export type requestMessage = {
  message: string,
  tid: string
}

export type LogRecord = {
  tId: string,
  payload: LogPayload | 'Start' | 'Commit' | 'Abort',
  parent?: LogRecord
}

export type LogPayload = {
  oldValue: string,
  newValue: string
}

export class Log {
  private current: LogRecord;
  append(record: LogRecord) {
    record.parent = this.current;
    this.current = record;
  }

  findTrasactionState(tId: string) {
    let record = this.current;
    while (record) {
      if (record.tId === tId && (record.payload === 'Commit' || record.payload === 'Start')) {
        return record.payload;
      }
      record = record.parent;
    }
    throw new Error('tid not found');
  }
}
