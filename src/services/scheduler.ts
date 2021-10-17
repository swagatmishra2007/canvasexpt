import { CohortNode } from './Cohort';
import { CoordinatorNode } from './Coordinator';
import { IScheduler, requestMessage } from './Processor';

class Scheduler implements IScheduler {
  private currentTick: number = -1;
  private nodes: [CoordinatorNode | CohortNode];

  constructor() {
    this.nodes = [new CoordinatorNode()];
    for (let i = 1; i < 5; i++) {
      this.nodes.push(new CohortNode());
    }
  }

  nextTick() {
    this.currentTick = (this.currentTick + 1) % 5;
    takeNextAction(this.nodes[this.currentTick], 'blah', this);
  }

  broadcast(message: requestMessage) {
    for (let item of this.nodes) {
      if (item.tag === 'Cohort') {
        item.requestQueue.push(message);
      }
    }
  }

  sendToCoordinator(message: requestMessage) {
    const item = this.nodes.filter(item => item.tag === 'Coordinator');
    if (item.length !== 1) {
      throw new Error('only 1 coordinator should be present');
    }
    item[0].requestQueue.push(message);
  }
}
