type nodeTypes = 'Coordinator' | 'Cohort';

type coordinatorActions = 'PrepareT' | 'CommitT' | 'AbortT'

type CoordinatorState = `${coordinatorActions}-${'Sent' | 'AckReceived'}`;
type CohortState = `${coordinatorActions}-${'Received' | 'AckSent'}`;

type ProcessorNode = {
	redoLog: string[],
	undoLog: string[],
}

type CoordinatorNode = ProcessorNode & {
	tag: 'Coordinator',
	currentState: CoordinatorState | 'Waiting'
};

type CohortNode = ProcessorNode & {
	tag: 'Cohort'
	currentState: CohortState | 'Waiting'
};

let takeNextAction = (node: CoordinatorNode | CohortNode, request: string) => {
	if (node.tag === 'Coordinator') {
		switch (node.currentState) {
			case 'Waiting':
			// update write ahead log
			// send out notification



		}


	}
}

type LogRecord =
