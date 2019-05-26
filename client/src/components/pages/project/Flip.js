class Flip {
  constructor() {
    this.list = {};
    this.removeAnimation = [
      [
        { transform: "none", opacity: "1" },
        { transform: "translate(500px)", opacity: "0" },
      ],
      {
        duration: 200,
        fill: "both",
      },
    ];
  }

  /**
   *
   * @param {Translate on X axis in pixel} tX
   * @param {Translate on Y axis in pixel} tY
   */
  moveAnimation(tX, tY) {
    return [
      [{ transform: `translate(${tX}px, ${tY}px)` }, { transform: "none" }],
      { duration: 200, fill: "both" },
    ];
  }

  /**
   * Sauvegarde l'état actuel des éléments envoyés
   * @param {Array[Node]} elms
   */
  read(elms) {
    elms = Array.from(elms);
    elms.forEach(elm => {
      let id = elm.getAttribute("id");
      if (!(id in this.list)) this.list[id] = elm.getBoundingClientRect();
    });
  }

  /**
   * Remove node element from the array and executes changes => animations
   * @param {Node} elm
   */
  removeElm(elm) {
    let id = elm.getAttribute("id");
    delete this.list[id];
    elm.animate(...this.removeAnimation);
    let that = this;
    window.setTimeout(function() {
      elm.parentNode.removeChild(elm);
      that.animateMove();
    }, this.removeAnimation[1].duration + 50);
  }

  /**
   * Anime en fonction des nouveaux états
   * @param {Array[Node]} nList
   */
  animateMove() {
    for (let id in this.list) {
      let node = document.getElementById(id);
      if (node) {
        let newRect = node.getBoundingClientRect();
        let tX = this.list[id].x - newRect.x;
        let tY = this.list[id].y - newRect.y;
        let animation = this.moveAnimation(tX, tY);
        node.animate(...animation);
        this.list[id] = newRect;
      }
    }
  }
}

export default Flip;
