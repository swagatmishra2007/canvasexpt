import { drawCircle } from "../models/circle";
import { Point } from "../models/point";

const Radius: number = 10;

export interface Node {
	value: number,
	leftNode: Node,
	rightNode: Node,
	point: Point,
	radius: number
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
		radius: Radius
	};
	if (!root) {
		drawNode(node, canvas);
		return node;
	}
	else {
		// node needs to be added to root
		recursiveAddNode(root, node, canvas);
		return root;
	}

}

const recursiveAddNode = (currentNode: Node, nodeToAdd: Node, canvas: HTMLCanvasElement) => {
	if (nodeToAdd.value < currentNode.value) {
		if (currentNode.leftNode) {
			recursiveAddNode(currentNode.leftNode, nodeToAdd, canvas);
			return;
		}
		else {
			const location = getLeftNodePoint(currentNode.point, nodeToAdd.radius);
			nodeToAdd.point = location;
			currentNode.leftNode = nodeToAdd;
			drawNode(nodeToAdd, canvas);
			drawLine(currentNode, nodeToAdd, canvas);
			return;
		}
	}
	else {
		if (currentNode.rightNode) {
			recursiveAddNode(currentNode.rightNode, nodeToAdd, canvas);
			return;
		}
		else {
			const location = getRightNodePoint(currentNode.point, nodeToAdd.radius);
			nodeToAdd.point = location;
			currentNode.rightNode = nodeToAdd;
			drawNode(nodeToAdd, canvas);
			drawLine(currentNode, nodeToAdd, canvas);
			return;
		}
	}

}

const getLeftNodePoint = (point: Point, radius: number) => {
	return new Point(point.x - (3 * radius), point.y + (3 * radius));
}
const getRightNodePoint = (point: Point, radius: number) => {
	return new Point(point.x + (3 * radius), point.y + (3 * radius));
}
