import { Point } from '../models/point';

export class Rectangle {
    public readonly bottomLeft: Point;
    public readonly topRight: Point;
    constructor(bottomLeft: Point, rightTop: Point) {
        // determine which is actually bottom left
        this.bottomLeft = new Point(Math.min(bottomLeft.x, rightTop.x), Math.min(bottomLeft.y, rightTop.y));
        this.topRight = new Point(Math.max(bottomLeft.x, rightTop.x), Math.max(bottomLeft.y, rightTop.y));
    }

}

export class Rectangles {
  private rectangles: Rectangle[] = [];
  private readonly context: CanvasRenderingContext2D;
  private readonly canvasWidth: number;
  private readonly canvasHeight: number;
  private ctrlIsPressed = false;
  private mousePosition = new Point(-100, -100);
  private inCompleteRectangle: Point = undefined;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.addInteractions();
  }

  clearCanvas() {
      this.rectangles = [];
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawRectanges() {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.rectangles.forEach(rect => {
        this.context.beginPath();
        this.context.fillStyle = 'green';
        this.context.fillRect(rect.bottomLeft.x, rect.bottomLeft.y, (rect.topRight.x - rect.bottomLeft.x), (rect.topRight.y - rect.bottomLeft.y));
        this.context.stroke();
      });
      for (let i = 0; i < this.rectangles.length; i++) {
          for (let j = i + 1; j < this.rectangles.length; j++) {
            // determine if they intersect
            const rect1 = this.rectangles[i];
            const rect2 = this.rectangles[j];
            if (rect1.bottomLeft.x > rect2.topRight.x || rect1.bottomLeft.y > rect2.topRight.y || rect1.topRight.x  < rect2.bottomLeft.x || rect1.topRight.y < rect2.bottomLeft.y) {
              // no intersection
            } else {
              const bottomLeft = new Point(Math.max(rect1.bottomLeft.x, rect2.bottomLeft.x), Math.max(rect1.bottomLeft.y, rect2.bottomLeft.y));
              const topRight = new Point(Math.min(rect1.topRight.x, rect2.topRight.x), Math.min(rect1.topRight.y, rect2.topRight.y));
              const rect = new Rectangle(bottomLeft, topRight);
              this.context.beginPath();
              this.context.fillStyle = 'teal';
              this.context.fillRect(rect.bottomLeft.x, rect.bottomLeft.y, (rect.topRight.x - rect.bottomLeft.x), (rect.topRight.y - rect.bottomLeft.y));
              this.context.stroke();
            }
          }
      }
  }

  private addInteractions() {
      this.canvas.addEventListener('click', e => {
          if (this.ctrlIsPressed) {
              this.clearCanvas();
              return;
          }
          this.calculateMouseRelativePositionInCanvas(e);
          if (!this.inCompleteRectangle) {
              this.inCompleteRectangle = this.mousePosition;
          } else {
              this.rectangles.push(new Rectangle(this.inCompleteRectangle, this.mousePosition));
              this.inCompleteRectangle = undefined;
          }
          this.drawRectanges();
      });

      window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.which === 17 || e.keyCode === 17) {
          this.ctrlIsPressed = true;
        }
      });
      window.addEventListener('keyup', () => {
        this.ctrlIsPressed = false;
      });

  }

  private calculateMouseRelativePositionInCanvas(e: MouseEvent) {
    this.mousePosition = new Point(
      e.clientX +
        (document.documentElement.scrollLeft || document.body.scrollLeft) -
        this.canvas.offsetLeft,
      e.clientY +
        (document.documentElement.scrollTop || document.body.scrollTop) -
        this.canvas.offsetTop
    );
  }
}
