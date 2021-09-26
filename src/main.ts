import { bTree, displayBTree, Node } from "./animations/trees";

let node: Node;
function main() {
  // if (navigator.serviceWorker.controller) {
  //   console.log('Active service worker found, no need to register');
  // } else {
  //   navigator.serviceWorker
  //     .register('sw.js', {
  //       scope: './'
  //     })
  //     .then(function(reg) {
  //       console.log(`SW has been registered for scope (${reg.scope})`);
  //     });
  // }

  const canvas = <HTMLCanvasElement>document.getElementById('flowers');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  // const flowers = new InteractiveFlowers(canvas);
  // const rectangles = new Rectangles(canvas);
  // configureForDrawCircle(canvas);
  // drawCircle(canvas, new Point(200, 200), 50);
  // node = bTree(null, 5, canvas);

  // const btn = document.getElementById('clearBtn');
  // btn.addEventListener('click', () => {
  //   //flowers.clearCanvas();
  //   // rectangles.clearCanvas();
  // });
  const btn = document.getElementById('add-to-tree');
  btn.addEventListener('click', () => {
    const input = <HTMLInputElement>document.getElementById('tree-input');
    const canvas = <HTMLCanvasElement>document.getElementById('flowers');
    const value = parseInt(input.value);
    if (value) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      // node = bTree(node, value, canvas);
      node = bTree(node, value, canvas);
      displayBTree(node, canvas);
    }

    else
      alert("Wrong input");
  });
}

main();
