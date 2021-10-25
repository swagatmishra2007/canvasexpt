import { Scheduler } from './services/scheduler';

const scheduler = new Scheduler();
let tIdCounter = 0;

const db = function () {
	const writebtn = document.getElementById('write');
	writebtn.addEventListener('click', () => {
		const input = <HTMLInputElement>document.getElementById('db-input');
		tIdCounter++;
		scheduler.sendToCoordinator({
			tid: tIdCounter.toString(),
			message: 'dont care',
			variable: 'a',
			value: 5
		});
	});
	const tickbtn = document.getElementById('tick');
	tickbtn.addEventListener('click', () => {
		scheduler.nextTick();
	});

};
db();
