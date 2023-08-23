// declare rectangle class
export class Rectangle {
  private height: number;
  private width: number;

  setHeight(height: number) {
    this.height = height;
  }

  setWidth(width: number) {
    this.width = width;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  getArea() {
    return this.height * this.width;
  }
}

// violate LSP by extending Rectangle
export class Square extends Rectangle {

  setHeight(height: number) {
    super.setHeight(height);
    super.setWidth(height);
  }

  setWidth(width: number) {
    super.setWidth(width);
    super.setHeight(width);
  }
}
