
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
  broadcast: (message: requestMessage) => void,
  sendToCoordinator: (message: requestMessage) => void
}

export type requestMessage = {
  message: string,
  tid: string,
  variable?: string,
  value?: number
}

export type LogRecord = {
  tId: string,
  payload: LogPayload | 'Commit' | 'Abort',
  parent?: LogRecord
}

export type LogPayload = {
  variable: string,
  oldValue: number,
  newValue: number
}

export class Log {
  private current: LogRecord;
  append(record: LogRecord) {
    record.parent = this.current;
    this.current = record;
  }

  display() {
    let record = this.current;
    this.displayInternal(record);
  }

  private displayInternal(item: LogRecord) {
    if (!item) {
      return;
    }
    if (!item.parent) {
      console.log(JSON.stringify(item) + '\n');
    }
    else {
      this.displayInternal(item.parent);
    }
  }

  // findTrasactionState(tId: string) {
  //   let record = this.current;
  //   while (record) {
  //     if (record.tId === tId && (record.payload === 'Commit' || record.payload === 'Abort')) {
  //       return record.payload;
  //     }
  //     record = record.parent;
  //   }
  //   throw new Error('tid not found');
  // }

  // return true if committed
  findStateOfVariable(variable: string) {
    let dict: any = {};
    let record = this.current;
    while (record) {
      if (dict[record.tId]) {
        if (record.payload === 'Commit' || record.payload === 'Abort') {
          throw new Error('not possible');
        }
        else if (record.payload.variable === variable) {
          return true;
        }
        else {
          delete dict[record.tId];
        }

      }
      else {
        if (record.payload === 'Commit' || record.payload === 'Abort') {
          //tid not present in dict, so add
          dict[record.tId] = true;
        }
        else if (record.payload.variable === variable) {
          return false;
        }
      }
    }
    return true;
  }
}
