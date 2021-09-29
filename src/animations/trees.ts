import { drawCircle } from '../models/circle';
import { Point } from '../models/point';

export const Radius = 10;

export interface CanvasInfo {
	point: Point;
	radius: number;
}

export interface Node {
	value: number;
	leftNode: Node;
	rightNode: Node;
	parent: Node;
	canvasInfo: CanvasInfo;
}

export const drawLine = (source: Node, destination: Node, canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext('2d');
	const moveToX = source.canvasInfo.point.x;
	const moveToY = source.canvasInfo.point.y + source.canvasInfo.radius;
	const lineToX = destination.canvasInfo.point.x;
	const lineToY = destination.canvasInfo.point.y - destination.canvasInfo.radius;
	ctx.beginPath();
	ctx.moveTo(moveToX, moveToY);
	ctx.lineTo(lineToX, lineToY);
	ctx.stroke();
};

const drawNode = (node: Node, canvas: HTMLCanvasElement) => {
	drawCircle(canvas, node.canvasInfo.point, node.canvasInfo.radius, node.value.toString());
};

export const bTree = (root: Node, value: number, canvas: HTMLCanvasElement): Node => {
	const node: Node = {
		value,
		leftNode: undefined,
		rightNode: undefined,
		parent: undefined,
		canvasInfo: null
	};
	if (!root) {
		node.canvasInfo = {
			point: new Point(500, 100),
			radius: Radius
		};
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

export const recursiveAddNode = (currentNode: Node, nodeToAdd: Node) => {
	if (nodeToAdd.value < currentNode.value) {
		if (currentNode.leftNode) {
			recursiveAddNode(currentNode.leftNode, nodeToAdd);
			return;
		} else {
			currentNode.leftNode = nodeToAdd;
			nodeToAdd.parent = currentNode;
			nodeToAdd.canvasInfo = null;
			populateCanvasInfo(nodeToAdd, false);
		}
	} else {
		if (currentNode.rightNode) {
			recursiveAddNode(currentNode.rightNode, nodeToAdd);
			return;
		} else {
			currentNode.rightNode = nodeToAdd;
			nodeToAdd.parent = currentNode;
			nodeToAdd.canvasInfo = null;
			populateCanvasInfo(nodeToAdd, false);
		}
	}
};

export const populateCanvasInfo = (node: Node, forcePopulate: boolean) => {
	if (node && (forcePopulate || !node.canvasInfo)) {
		let ptLocation: Point;
		if (node.parent) {
			if (!node.parent.canvasInfo) {
				throw new Error('parent canvas info for node is null ' + node.value);
			}
			const isLeft = node.parent.leftNode !== null && node.parent.leftNode === node;
			ptLocation = isLeft ? getLeftNodePoint(node.parent.canvasInfo.point, node.parent.canvasInfo.radius) : getRightNodePoint(node.parent.canvasInfo.point, node.parent.canvasInfo.radius);
		} else {
			ptLocation = new Point(500, 100);
		}
		node.canvasInfo = {
			point: ptLocation,
			radius: node.parent ? node.parent.canvasInfo.radius : Radius
		};
		populateCanvasInfo(node.leftNode, forcePopulate);
		populateCanvasInfo(node.rightNode, forcePopulate);
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

export const rightRotate = (node: Node, root: Node) => {
	if (!node.leftNode) {
		alert('node must have left node to be left rotated');
		return root;
	}

	const x = node.leftNode;
	const y = node;

	y.leftNode = x.rightNode;
	changeParent(y.leftNode, y);
	x.rightNode = y;
	if (y.parent) {
		if (y.parent.leftNode === y) {
			y.parent.leftNode = x;
		} else {
			y.parent.rightNode = x;
		}
		changeParent(x, y.parent);
	} else {
		// y is root, so override root
		changeParent(x, null);
		root = x;
	}
	changeParent(y, x);
	return root;
};

const changeParent = (node: Node, newParent: Node) => {
	if (node) {
		node.parent = newParent;
		node.canvasInfo = null;
	}
};
