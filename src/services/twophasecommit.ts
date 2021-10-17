// Reference Links
// https://www.cs.sjsu.edu/faculty/pollett/157b.12.05s/Lec20042005.pdf
// https://en.wikipedia.org/wiki/Two-phase_commit_protocol#Commit_(or_completion)_phase
// http://www.cs.fsu.edu/~xyuan/cop5611/lecture15.html
// https://scaling.dev/storage/log
// http://dbmsmusings.blogspot.com/2019/01/its-time-to-move-on-from-two-phase.html
// http://www.mathcs.emory.edu/~cheung/Courses/554/Syllabus/9-parallel/2-phase.html

// unrelated or UI related
// https://basarat.gitbook.io/typescript/future-javascript/destructuring
// https://www.w3.org/TR/WCAG20-TECHS/H84.html


type nodeTypes = 'Coordinator' | 'Cohort';

type coordinatorActions = 'PrepareT' | 'CommitT' | 'AbortT'

type CoordinatorState = `${coordinatorActions}-${'Sent'}`;
type CohortState = `${coordinatorActions}-${'Received' | 'AckSent'}`;

interface ProcessorNode {
	tag: nodeTypes,
	log: Log,
	requestQueue: requestMessage[],
	persistedStore: string[]
}

class CoordinatorNode implements ProcessorNode {
	log: Log;
	requestQueue: requestMessage[];
	persistedStore: string[];
	tag: 'Coordinator';
	currentState: CoordinatorState | 'Waiting';
	private receiveCount: number;
	constructor() {
		this.log = new Log();
		this.requestQueue = [];
		this.persistedStore = [];
		this.currentState = 'Waiting';
		this.receiveCount = 0;
	}

	receiveMessage(): boolean {
		this.receiveCount++;
		if (this.receiveCount === 4) {
			this.receiveCount = 0;
			return true;
		}
		return false;
	}

	receiveMessageExternal(scheduler: Scheduler, request: requestMessage) {
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
				// no prepare t ack
				if (request.message === 'Abort') {
					scheduler.broadcast({
						tid: request.tid,
						message: 'AbortT'
					});
					this.currentState = 'AbortT-Sent';
				}
				else {
					// count commits
				}
				break;
			case 'AbortT-Sent':
				break;
			case 'CommitT-Sent':
				break;

		}
	}

	clearMessage() {
		this.receiveCount = 0;
	}
};

class CohortNode implements ProcessorNode {
	tag: 'Cohort'
	currentState: CohortState | 'Waiting'
	constructor() {
		this.log = new Log();
		this.requestQueue = [];
		this.persistedStore = [];
		this.currentState = 'Waiting';
	}
	log: Log;
	requestQueue: requestMessage[];
	persistedStore: string[];
};

let takeNextAction = (node: CoordinatorNode | CohortNode, request: requestMessage, scheduler: Scheduler) => {
	if (node.tag === 'Coordinator') {
		switch (node.currentState) {
			case 'Waiting':
				// update write ahead log
				// send out notification
				node.log.append({
					tId: request.tid,
					payload: 'Start'
				});
				scheduler.broadcast({
					tid: request.tid,
					message: 'prepareT'
				});
				node.currentState = 'PrepareT-Sent';
				break;
			case 'AbortT-Sent':
				if (request.message !== 'Abort-Ack') {
					// drop message
					return;
				}
				if (node.receiveMessage()) {
					// Abort WAL
					node.currentState = 'Waiting';
				}
				break;
			case 'CommitT-Sent':
				if (request.message === 'Commit-Ack') {
					if (node.receiveMessage()) {
						// respond to user
					}
					node.currentState = 'Waiting';
					return;
				}
				else {
					throw new Error('impossible state');
				}
			case 'PrepareT-Sent':
				break;
		}
	}
	else {
		switch (node.currentState) {
			case 'Waiting':
				break;
			case 'AbortT-AckSent':
				break;
			case 'AbortT-Received':
				break;
			case 'CommitT-AckSent':
				break;
			case 'CommitT-Received':
				break;
			case 'PrepareT-AckSent':
				break;
			case 'PrepareT-Received':
				break;
		}
	}
}

type LogRecord = {
	tId: string,
	payload: LogPayload | 'Start' | 'Commit',
	parent?: LogRecord
}

type LogPayload = {
	oldValue: string,
	newValue: string
}

class Log {
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

type requestMessage = {
	message: string,
	tid: string
}

class Scheduler {
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
