import { drawCircle } from '../models/circle';
import { Point } from '../models/point';
import { Node, Radius } from './trees';

export type Color = 'Red' | 'Black';

export interface RedBlackNode extends Node {
	color: Color;
}

export const redBlackTree = (root: RedBlackNode, value: number, canvas: HTMLCanvasElement) => {
	const node: RedBlackNode = {
		value,
		leftNode: undefined,
		rightNode: undefined,
		point: new Point(500, 100),
		radius: Radius,
		color: 'Red',
		parent: null
	};

	if (!root) {
		node.color = 'Black';
		drawRedBlackNode(node, canvas);
	}

	return node;


};

const drawRedBlackNode = (node: RedBlackNode, canvas: HTMLCanvasElement) => {
	drawCircle(canvas, node.point, node.radius, node.value.toString(), (context) => { context.strokeStyle = node.color.toString(); });
};
