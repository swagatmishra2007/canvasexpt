// Reference Links

// unrelated or UI related
// https://basarat.gitbook.io/typescript/future-javascript/destructuring
// https://www.w3.org/TR/WCAG20-TECHS/H84.html



let takeNextAction = (node: CoordinatorNode | CohortNode, request: requestMessage, scheduler: Scheduler) => {
	if (node.tag === 'Coordinator') {
		node.receiveMessageExternal(scheduler, request);
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
