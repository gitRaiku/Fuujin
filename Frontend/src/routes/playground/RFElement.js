class RFElement {
  constructor(name) {
    this.name = name
    this.cursample = 0.0
    this.input = 0.0
    this.output = 0.0
    this.nextElem = null
  }

  update() {}
}

class AudioReader extends RFElement {
  constructor(name) { super(name) }

  update() {

  }
}

class DcOffset extends RFElement {
  constructor(name, offset) { super(name); this.offset = offset }

  update() {
    this.output = this.input + this.offset;
  }
}
