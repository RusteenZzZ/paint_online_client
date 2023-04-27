import Tool from './Tool.js'
import toolState from '../store/toolState.js'

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id)
    this.listen()
    this.ctx.lineWidth = 1
    this.setColor(toolState.savedColor || "black")
  }

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
  }

  mouseUpHandler(e) {
    this.mouseDown = false
    this.socket.send(JSON.stringify({
      method: "draw",
      id: this.id,
      figure: {
        type: "line",
        color: toolState.color,
        startX: this.startX,
        startY: this.startY,
        x: this.x,
        y: this.y
      }
    }))
    this.socket.send(JSON.stringify({
      method: "draw",
      id: this.id,
      figure: {
        type: "finish"
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true
    this.startX = e.pageX-e.target.offsetLeft
    this.startY = e.pageY-e.target.offsetTop
    this.ctx.beginPath()
    this.ctx.moveTo(this.startX, this.startY)
    this.saved = this.canvas.toDataURL()
  }

  mouseMoveHandler(e) {
    if(this.mouseDown) {
      this.x = e.pageX - e.target.offsetLeft
      this.y = e.pageY - e.target.offsetTop
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
  }

  draw(x, y) {
    const img = new Image()
    img.src = this.saved
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
      this.ctx.beginPath()
      this.ctx.moveTo(this.startX, this.startY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }

  static staticDraw(ctx, startX, startY, x, y) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
}