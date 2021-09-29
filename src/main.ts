import { displayRedBlackTree, RedBlackNode, redBlackTree } from './animations/redBlackTrees';
import { displayBTree, leftRotate, Node, populateCanvasInfo, rightRotate } from './animations/trees';

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
  const btn = document.getElementById('add-to-tree');
  btn.addEventListener('click', () => {
    const input = <HTMLInputElement>document.getElementById('tree-input');
    let values: number[];
    if (input.value.indexOf(',') > -1) {
      values = input.value.split(',').map(x => parseInt(x));
    }
    else {
      values = [parseInt(input.value)];
    }
    if (values.every((elem) => elem !== null && elem !== undefined && !isNaN(elem))) {
      node = null;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const x of values) {
        //node = bTree(node, x, canvas);
        node = redBlackTree(node as RedBlackNode, x);
        populateCanvasInfo(node, true);
      }
      displayTree(node);
      //displayBTree(node, canvas);
      displayRedBlackTree(node as RedBlackNode, canvas);
    } else {
      alert('Wrong input');
    }
  });

  document.getElementById('left-rotate').addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    node = leftRotate(node, node);
    populateCanvasInfo(node, true);
    displayBTree(node, canvas);
  });
  document.getElementById('right-rotate').addEventListener('click', () => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    node = rightRotate(node, node);
    populateCanvasInfo(node, true);
    displayBTree(node, canvas);
  });
}

const displayTree = (item: Node) => {
  if (item) {
    console.log(item.value + ' with parent ' + (item.parent ? item.parent.value : null));
    displayTree(item.leftNode);
    displayTree(item.rightNode);
  }
}

main();
