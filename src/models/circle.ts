import { Point } from "./point";

export interface Circle {
	x: number,
	y: number
}

export type ContextCallback = (context: CanvasRenderingContext2D) => void;

export const drawCircle = (canvas: HTMLCanvasElement, pt: Point, radius: number, text?: string, contextCallback?: ContextCallback) => {
	const context = canvas.getContext('2d');

	context.beginPath();
	if (contextCallback) {
		contextCallback(context);
	}
	context.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
	// context.fillStyle = 'green';
	// context.lineWidth = 5;
	// context.fill;
	// context.strokeStyle = '#003300';
	context.stroke();
	context.closePath()
	if (text) {
		context.strokeText(text, pt.x, pt.y);

	}
};

export const calculateMouseRelativePositionInCanvas = (e: MouseEvent, canvas: HTMLCanvasElement) => {
	return new Point(
		e.clientX +
		(document.documentElement.scrollLeft || document.body.scrollLeft) -
		canvas.offsetLeft,
		e.clientY +
		(document.documentElement.scrollTop || document.body.scrollTop) -
		canvas.offsetTop
	);
}

export const configureForDrawCircle = (canvas: HTMLCanvasElement) => {
	canvas.addEventListener('click', (e) => {
		const pt = calculateMouseRelativePositionInCanvas(e, canvas);
		drawCircle(canvas, pt, 70);
	});
}
