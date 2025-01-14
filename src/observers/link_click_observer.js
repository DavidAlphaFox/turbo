import { doesNotTargetIFrame, findLinkFromClickTarget, getLocationForLink } from "../util"

export class LinkClickObserver {
  started = false

  constructor(delegate, eventTarget) {
    this.delegate = delegate
    this.eventTarget = eventTarget
  }
  //启动后监听给定target的点击事件
  start() {
    if (!this.started) {
      this.eventTarget.addEventListener("click", this.clickCaptured, true)
      this.started = true
    }
  }

  stop() {
    if (this.started) {
      this.eventTarget.removeEventListener("click", this.clickCaptured, true)
      this.started = false
    }
  }

  clickCaptured = () => {
    this.eventTarget.removeEventListener("click", this.clickBubbled, false)
    this.eventTarget.addEventListener("click", this.clickBubbled, false)
  }

  clickBubbled = (event) => {
    if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
      const target = (event.composedPath && event.composedPath()[0]) || event.target
      const link = findLinkFromClickTarget(target) //在事件发生的元素上寻找链接
      if (link && doesNotTargetIFrame(link.target)) { //首先确定链接不是iframe
        const location = getLocationForLink(link)
        if (this.delegate.willFollowLinkToLocation(link, location, event)) {
          event.preventDefault()
          this.delegate.followedLinkToLocation(link, location)
        }
      }
    }
  }

  clickEventIsSignificant(event) {
    return !(
      (event.target && event.target.isContentEditable) ||
      event.defaultPrevented ||
      event.which > 1 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
  }
}
