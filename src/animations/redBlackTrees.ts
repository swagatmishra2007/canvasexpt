import { drawCircle } from '../models/circle';
import { drawLine, Node, populateCanvasInfo, recursiveAddNode, rightRotate } from './trees';

export type Color = 'Red' | 'Black';

export interface RedBlackNode extends Node {
	color: Color;
}

export const redBlackTree = (root: RedBlackNode, value: number) => {
	const node: RedBlackNode = {
		value,
		leftNode: undefined,
		rightNode: undefined,
		color: 'Red',
		parent: null,
		canvasInfo: null
	};

	if (!root) {
		node.color = 'Black';
		populateCanvasInfo(node, true);
		return node;
	}
	else {
		insertNode(root, node);
		return root;
	}
};

const insertNode = (root: RedBlackNode, nodeToAdd: RedBlackNode) => {
	nodeToAdd.color = 'Red';
	recursiveAddNode(root, nodeToAdd);
	fixAfterInsert(nodeToAdd, root);
};

const fixAfterInsert = (node: RedBlackNode, root: Node) => {
	if (!node.parent) {
		// node is root, nothing to do
		node.color = 'Black';
		return;
	}

	if ((node.parent as RedBlackNode).color === 'Black') {
		return;
	}

	const gp = node.parent.parent as RedBlackNode;
	const p = node.parent as RedBlackNode;
	const newNode = node;

	// if (gp.leftNode === p) {
	// 	if (getColor(gp.rightNode) === 'Red') {
	// 		setColor(gp.leftNode, 'Black');
	// 		setColor(gp.rightNode, 'Black');
	// 		setColor(gp, 'Red');
	// 		fixAfterInsert(gp, root);
	// 		return;
	// 	}
	// 	else if (p.rightNode === newNode) {
	// 		root = leftRotate(p, root);
	// 	}

	// }
	// else {
	// 	if(getColor(gp.leftNode) === 'Red') {
	// 		setColor(gp.leftNode, 'Black')
	// 		setColor(gp.rightNode, 'Black')
	// 		setColor(gp, 'Red');
	// 	}
	// }
	// find color of sibling of p
	if (gp.leftNode === p) { // parent is left node of g
		if (getColor(gp.rightNode) === 'Red') { // sibling case
			setColor(gp.leftNode, 'Black');
			setColor(gp.rightNode, 'Black');
			setColor(gp, 'Red');
			fixAfterInsert(gp, root);
			return;
		}
		else {
			setColor(p, 'Black');
			setColor(gp, 'Red');
			rightRotate(gp, root);
			return;
		}

	}
	else { // parent is right node of g
		if (getColor(gp.leftNode) === 'Red') { // sibling case
			setColor(gp.leftNode, 'Black');
			setColor(gp.rightNode, 'Black');
			setColor(gp, 'Red');
			fixAfterInsert(gp, root);
			return;
		}
		else {

		}
	}
}

const getColor = (node: Node) => node ? (node as RedBlackNode).color : 'Black';

const setColor = (node: Node, color: Color) => {
	if (node) {
		(node as RedBlackNode).color = color;
	}
}

export const displayRedBlackTree = (root: RedBlackNode, canvas: HTMLCanvasElement) => {
	displayRedBlackTreeSubTree(null, root, canvas);
};

const displayRedBlackTreeSubTree = (previousNode: RedBlackNode, currentNode: RedBlackNode, canvas: HTMLCanvasElement) => {
	if (currentNode) {
		display(previousNode, currentNode, canvas);
		displayRedBlackTreeSubTree(currentNode, currentNode.leftNode as RedBlackNode, canvas);
		displayRedBlackTreeSubTree(currentNode, currentNode.rightNode as RedBlackNode, canvas);
	}
};

const display = (previousNode: RedBlackNode, node: RedBlackNode, canvas: HTMLCanvasElement) => {
	if (node) {
		drawRedBlackNode(node, canvas);
		if (previousNode) {
			drawLine(previousNode, node, canvas);
		}
	}
};

const drawRedBlackNode = (node: RedBlackNode, canvas: HTMLCanvasElement) => {
	drawCircle(canvas, node.canvasInfo.point, node.canvasInfo.radius, node.value.toString(), (context) => { context.strokeStyle = node.color.toString(); });
};
