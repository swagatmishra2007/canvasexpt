import { CanvasInfo, drawLine } from './animations/trees';
import { drawCircle } from './models/circle';
import { Point } from './models/point';
let mainNode: LinkedListNode;
const mainFunction = function () {
	const canvas = <HTMLCanvasElement>document.getElementById('canvas');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	const btn = document.getElementById('add-to-list');
	btn.addEventListener('click', () => {
		const input = <HTMLInputElement>document.getElementById('linkedlist-input');
		let values: number[];
		if (input.value.indexOf(',') > -1) {
			values = input.value.split(',').map(x => parseInt(x));
		} else {
			values = [parseInt(input.value)];
		}
		if (values.every((elem) => elem !== null && elem !== undefined && !isNaN(elem))) {
			mainNode = null;
			const context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (const x of values) {
				mainNode = addToLinkedList(mainNode, x);
			}
			displayLinkedList(mainNode, canvas);
		}
	});

	const smallestPostiveBtn = document.getElementById('find-missing');
	smallestPostiveBtn.addEventListener('click', () => {
		const input = <HTMLInputElement>document.getElementById('linkedlist-input');
		const itemIndex = input.value.lastIndexOf('.')

	});
};

mainFunction();

interface LinkedListNode {
	value: number;
	next: LinkedListNode;
	canvasInfo: CanvasInfo
};

const addToLinkedList = (rootNode: LinkedListNode, value: number) => {
	if (!rootNode) {
		rootNode = {
			value,
			next: null,
			canvasInfo: nextCanvasInfo(null)
		};
	}
	else {
		let currentNode = rootNode;
		while (currentNode.next) {
			currentNode = currentNode.next;
		}
		currentNode.next = {
			value,
			next: null,
			canvasInfo: nextCanvasInfo(currentNode)
		}
	}
	return rootNode;
};

const Radius = 10;
const nextCanvasInfo = (prevNode: LinkedListNode) => {
	let canvasInfo: CanvasInfo;
	if (!prevNode) {
		canvasInfo = {
			point: new Point(500, 100),
			radius: Radius
		};
	}
	else {
		const prevPt = prevNode.canvasInfo.point;
		canvasInfo = {
			point: new Point(prevPt.x + 4 * Radius, prevPt.y),
			radius: Radius
		};
	}
	return canvasInfo;
}

const displayLinkedList = (node: LinkedListNode, canvas: HTMLCanvasElement) => {
	if (node && node.canvasInfo) {
		drawCircle(canvas, node.canvasInfo.point, node.canvasInfo.radius, node.value.toString());
		if (node.next && node.next.canvasInfo) {
			drawLine(node.canvasInfo, node.next.canvasInfo, canvas);
			displayLinkedList(node.next, canvas);
		}
	}
	else {
		throw new Error('either node or canvasinfo is null');
	}
};
