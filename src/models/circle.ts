import { Point } from "./point";

export interface Circle {
	x: number,
	y: number
}

export const drawCircle = (canvas: HTMLCanvasElement, pt: Point, radius: number) => {
	const context = canvas.getContext('2d');
	const canvasWidth = canvas.width;
	const canvasHeight = canvas.height;

	context.beginPath();
	context.arc(pt.x, pt.y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = 'green';
	context.lineWidth = 5;
	context.fill;
	context.strokeStyle = '#003300';
	context.stroke();
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
