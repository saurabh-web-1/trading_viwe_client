export default class Scale {
  constructor(min, max, size) {
    this.min = min;
    this.max = max;
    this.size = size;
  }

  toPixel(value) {
    return ((value - this.min) / (this.max - this.min)) * this.size;
  }

  fromPixel(px) {
    return this.min + (px / this.size) * (this.max - this.min);
  }
}
