import { drawCircle } from '../models/circle';
import { Point } from '../models/point';

export const Radius = 10;

export interface Node {
	value: number;
	leftNode: Node;
	rightNode: Node;
	point: Point;
	radius: number;
	parent: Node;
}

const drawLine = (source: Node, destination: Node, canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d');
	const moveToX = source.point.x;
	const moveToY = source.point.y + source.radius;
	const lineToX = destination.point.x;
	const lineToY = destination.point.y - destination.radius;
	ctx.beginPath();
	ctx.moveTo(moveToX, moveToY);
	ctx.lineTo(lineToX, lineToY);
	ctx.stroke();
};

const drawNode = (node: Node, canvas: HTMLCanvasElement) => {
	drawCircle(canvas, node.point, node.radius, node.value.toString());
};

export const bTree = (root: Node, value: number, canvas: HTMLCanvasElement): Node => {
	const node: Node = {
		value,
		leftNode: undefined,
		rightNode: undefined,
		point: new Point(500, 100),
		radius: Radius,
		parent: undefined
	};
	if (!root) {
		drawNode(node, canvas);
		return node;
	} else {
		// node needs to be added to root
		recursiveAddNode(root, node);
		return root;
	}
};

export const displayBTree = (root: Node, canvas: HTMLCanvasElement) => {
	displayBTreeSubTree(null, root, canvas);
};

const displayBTreeSubTree = (previousNode: Node, currentNode: Node, canvas: HTMLCanvasElement) => {
	if (currentNode) {
		display(previousNode, currentNode, canvas);
		displayBTreeSubTree(currentNode, currentNode.leftNode, canvas);
		displayBTreeSubTree(currentNode, currentNode.rightNode, canvas);
	}
};

const display = (previousNode: Node, node: Node, canvas: HTMLCanvasElement) => {
	if (node) {
		drawNode(node, canvas);
		if (previousNode) {
			drawLine(previousNode, node, canvas);
		}
	}
};

const recursiveAddNode = (currentNode: Node, nodeToAdd: Node) => {
	if (nodeToAdd.value < currentNode.value) {
		if (currentNode.leftNode) {
			recursiveAddNode(currentNode.leftNode, nodeToAdd);
			return;
		} else {
			const location = getLeftNodePoint(currentNode.point, nodeToAdd.radius);
			nodeToAdd.point = location;
			currentNode.leftNode = nodeToAdd;
			nodeToAdd.parent = currentNode;
		}
	} else {
		if (currentNode.rightNode) {
			recursiveAddNode(currentNode.rightNode, nodeToAdd);
			return;
		} else {
			const location = getRightNodePoint(currentNode.point, nodeToAdd.radius);
			nodeToAdd.point = location;
			currentNode.rightNode = nodeToAdd;
			nodeToAdd.parent = currentNode;
		}
	}
};

export const getLeftNodePoint = (point: Point, radius: number) => {
	return new Point(point.x - (3 * radius), point.y + (3 * radius));
};
export const getRightNodePoint = (point: Point, radius: number) => {
	return new Point(point.x + (3 * radius), point.y + (3 * radius));
};

export const leftRotate = (node: Node, root: Node) => {
	if (!node.rightNode) {
		alert('node must have right node to be left rotated');
		return root;
	}
	const x = node;
	const y = node.rightNode;

	x.rightNode = y.leftNode;
	changeParent(x.rightNode, x);
	y.leftNode = x;
	if (x.parent) {
		if (x.parent.leftNode === x) {
			x.parent.leftNode = y;
		} else {
			x.parent.rightNode = y;
		}
		changeParent(y, x.parent);
	} else {
		// x is root, so override root
		changeParent(y, null);
		root = y;
	}

	changeParent(x, y);
	return root;
};

const changeParent = (node: Node, newParent: Node) => {
	if (!newParent) {
		// node is new root
		node.point = new Point(500, 100);
	} else {
		node.point = newParent.leftNode === node ? getLeftNodePoint(newParent.point, newParent.radius) : getRightNodePoint(newParent.point, newParent.radius);
	}
	if (node.leftNode) {
		changeParent(node.leftNode, node);
	}
	if (node.rightNode) {
		changeParent(node.rightNode, node);
	}
};
