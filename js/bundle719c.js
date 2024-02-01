(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCustomElement = exports.AeroCard = void 0;

var _client = require("@stencil/core/internal/client");

const aeroGrids = document.querySelectorAll('aero-grid');
const directions = ['left', 'top', 'right', 'bottom'];

function makeEffectDirectionAware(effect) {
  // Remove all the existing direction classes.
  directions.forEach(dir => {
    effect.classList.remove(dir);
  }); // Add current direction CSS class at mouse enter event to the current item.

  effect.addEventListener('mouseenter', currentDirection, false); // Add current direction CSS class at mouse leave event to the current item.

  effect.addEventListener('mouseleave', currentDirection, false); // Keep the last active effect on top of other effects while on grid. This
  // will exclude the current active effect which is always on top.

  if (aeroGrids.length > 0) {
    effect.addEventListener('mouseleave', lastActiveTimeout, false);
  }
} // Determine the current direction of the mouse movement and add the coresponding CSS class
// to the current item.


function currentDirection(mouseEvent) {
  // Create the bounding box of current grid item relative to the viewport.
  const rect = mouseEvent.currentTarget.getBoundingClientRect(); // Create a vector which contains all the deltas on all directions.

  const deltas = [mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top, rect.right - mouseEvent.clientX, rect.bottom - mouseEvent.clientY]; // Remove all the existing direction classes at mouse exit event on current grid item.

  directions.forEach(dir => {
    mouseEvent.currentTarget.classList.remove(dir);
  }); // Find the minimum delta. This delta is the current direction.

  const currentDir = deltas.indexOf(Math.min(...deltas)); // Add the current direction to the current grid item.

  mouseEvent.currentTarget.classList.add(directions[currentDir]);
}

function lastActiveTimeout(mouseEvent) {
  // Add the .last-active CSS class and remove it after a timeout.
  mouseEvent.target.classList.add('last-active'); // Remove .last-active CSS class after a timeout.
  // OBS: The timeout could be determined from the current running animation.

  setTimeout(() => {
    mouseEvent.target.classList.remove('last-active');
  }, 500);
}

function addSense3DMouseInterraction(effect) {
  // Add or remove event listeners based on the existance of .sense-3d CSS
  // class on the current effect.
  function toggleEventListeners(mouseEvent) {
    if (mouseEvent.currentTarget.classList.contains('sense-3d')) {
      // Convert mouse movement to CSS rotation and add it to the current effect.
      effect.addEventListener('mousemove', mouseMove2Rotation); // Reset the 2D rotation on mouse leave.

      effect.addEventListener('mouseleave', resetTransform);
    } else {
      // Reset the 2D rotations on the current effect.
      // resetTransform();
      // Remove the active event listeners from the current effect.
      effect.removeEventListener('mousemove', mouseMove2Rotation);
      effect.removeEventListener('mouseleave', resetTransform);
    }
  } // Toggle event listeners at mouse enter.


  effect.addEventListener('mouseenter', toggleEventListeners);
} // Map 2D translate to 2D rotation.


function mapTrans2Rot(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
} // Determine the 2D mouse movement and convert it to 2D rotation.


function mouseMove2Rotation(mouseEvent) {
  // Create the bounding box of current grid item relative to the viewport.
  const rect = mouseEvent.currentTarget.getBoundingClientRect(); // Calculate the relative offsets.

  const offsetLeft = rect.left + document.body.scrollLeft;
  const offsetTop = rect.top + document.body.scrollTop; // Calcultate the relative 2D coordinates based on the mouse movement.

  const x = mouseEvent.clientX - offsetLeft;
  const y = mouseEvent.clientY - offsetTop; // Map the 2D mouse movement to 2D rotation.

  const rY = mapTrans2Rot(x, 0, rect.width, -17, 17);
  const rX = mapTrans2Rot(y, 0, rect.height, -17, 17); // Get the image and content elements.

  const imageEl = mouseEvent.currentTarget.shadowRoot.querySelector('figure.image');
  const contentEl = mouseEvent.currentTarget.shadowRoot.querySelector('.content'); // Add the 2D rotations to the image and content elements.

  if (imageEl != null && contentEl != null) {
    imageEl.style.transform = 'rotateY(' + rY + 'deg)' + ' ' + 'rotateX(' + -rX + 'deg)';
    contentEl.style.transform = 'rotateY(' + rY + 'deg)' + ' ' + 'rotateX(' + -rX + 'deg) translateZ(20px) scale(0.95)';
  }
} // Reset the current element CSS transform 2D rotations.


function resetTransform(mouseEvent) {
  const imageEl = mouseEvent.currentTarget.shadowRoot.querySelector('figure.image');
  const contentEl = mouseEvent.currentTarget.shadowRoot.querySelector('.content');

  if (imageEl != null && contentEl != null) {
    imageEl.style.transform = '';
    contentEl.style.transform = '';
  }
}

const aeroCardCss = "@keyframes contentTranslateTopIn{0%{transform:translate(0, calc(-1 * var(--content-translate-offset)))}100%{transform:translate(0, 0)}}@keyframes contentTranslateTopOut{0%{transform:translate(0, 0)}100%{transform:translate(0, calc(-1 * var(--content-translate-offset)))}}@keyframes contentTranslateRightIn{0%{transform:translate(var(--content-translate-offset), 0)}100%{transform:translate(0, 0)}}@keyframes contentTranslateRightOut{0%{transform:translate(0, 0)}100%{transform:translate(var(--content-translate-offset), 0)}}@keyframes contentTranslateBottomIn{0%{transform:translate(0, var(--content-translate-offset))}100%{transform:translate(0, 0)}}@keyframes contentTranslateBottomOut{0%{transform:translate(0, 0)}100%{transform:translate(0, var(--content-translate-offset))}}@keyframes contentTranslateLeftIn{0%{transform:translate(calc(-1 * var(--content-translate-offset)), 0)}100%{transform:translate(0, 0)}}@keyframes contentTranslateLeftOut{0%{transform:translate(0, 0)}100%{transform:translate(calc(-1 * var(--content-translate-offset)), 0)}}@keyframes slideImageTopIn{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(0, 100%)}}@keyframes slideContentTopIn{0%{opacity:1;transform:translate(0, -100%)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideImageTopOut{0%{opacity:1;transform:translate(0, 100%)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideContentTopOut{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(0, -100%)}}@keyframes slideImageRightIn{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(-100%, 0)}}@keyframes slideContentRightIn{0%{opacity:1;transform:translate(100%, 0)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideImageRightOut{0%{opacity:1;transform:translate(-100%, 0)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideContentRightOut{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(100%, 0)}}@keyframes slideImageBottomIn{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(0, -100%)}}@keyframes slideContentBottomIn{0%{opacity:1;transform:translate(0, 100%)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideImageBottomOut{0%{opacity:1;transform:translate(0, -100%)}100%{transform:translate(0, 0);opacity:1}}@keyframes slideContentBottomOut{0%{opacity:1;transform:translate(0, 0)}100%{transform:translate(0, 100%);opacity:1}}@keyframes slideImageLeftIn{0%{opacity:1;transform:translate(0, 0)}100%{opacity:1;transform:translate(100%, 0)}}@keyframes slideContentLeftIn{0%{opacity:1;transform:translate(-100%, 0)}100%{opacity:1;transform:translate(0, 0)}}@keyframes slideImageLeftOut{0%{opacity:1;transform:translate(100%, 0)}100%{transform:translate(0, 0);opacity:1}}@keyframes slideContentLeftOut{0%{opacity:1;transform:translate(0, 0)}100%{transform:translate(-100%, 0);opacity:1}}@keyframes flipInTop{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 90deg)}40%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -20deg)}60%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 10deg)}80%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -5deg)}100%{transform:perspective(var(--perspective))}}@keyframes flipInRight{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 90deg)}40%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -20deg)}60%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 10deg)}80%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -5deg)}100%{transform:perspective(var(--perspective))}}@keyframes flipInBottom{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -90deg)}40%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 20deg)}60%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -10deg)}80%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 5deg)}100%{transform:perspective(var(--perspective))}}@keyframes flipInLeft{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -90deg)}40%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 20deg)}60%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -10deg)}80%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 5deg)}100%{transform:perspective(var(--perspective))}}@keyframes flipOutTop{0%{transform:perspective(var(--perspective))}30%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -20deg);opacity:1}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 90deg);opacity:0}}@keyframes flipOutRight{0%{transform:perspective(var(--perspective))}30%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -20deg);opacity:1}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 90deg);opacity:0}}@keyframes flipOutBottom{0%{transform:perspective(var(--perspective))}30%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 20deg);opacity:1}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -90deg);opacity:0}}@keyframes flipOutLeft{0%{transform:perspective(var(--perspective))}30%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 20deg);opacity:1}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -90deg);opacity:0}}:host{display:inline-block;position:relative;max-width:100%;transform:translate3d(0, 0, 0)}:host figure.image{position:relative;margin:0}:host figure.image img{position:relative;display:block;max-width:100%}:host .content{display:block;position:absolute;top:0;left:0;bottom:0;right:0;overflow:hidden;color:var(--content-color-text);background:var(--content-color-bg);will-change:opacity;transition-property:opacity;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host .content.align-center{text-align:center}:host .content.align-left{text-align:left}:host .content.align-right{text-align:right}:host .content .inner-content{display:flex;justify-content:center;flex-direction:column;position:absolute;top:0;left:0;bottom:0;right:0;padding:5%}:host,:host figure.image,:host figure.image>*,:host .content{border-radius:var(--image-border-radius)}:host(.wide){width:100%}:host(.wide) figure.image img{width:100%}:host(.edit-mode){opacity:1 !important;animation-name:none !important;transform:none !important}:host(.edit-mode) .content,:host(.edit-mode) .content *,:host(.edit-mode) .content::before,:host(.edit-mode) .content::after,:host(.edit-mode) figure.image,:host(.edit-mode) figure.image *,:host(.edit-mode) figure.image::before,:host(.edit-mode) figure.image::after{opacity:1 !important;animation-name:none !important;transform:none !important;z-index:unset !important}:host(.on-grid){z-index:0}:host(.on-grid) figure.image{width:100%;height:100%}:host(.on-grid) figure.image img{width:100%;height:100%;object-fit:cover}:host(.on-grid.square) figure.image img{position:absolute}:host(.on-grid.last-active){z-index:1}:host(.on-grid:hover),:host(.on-grid.last-active:hover){z-index:2}:host .content.translate .inner-content{opacity:0;will-change:opacity;transition-property:opacity;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function);animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:var(--content-translate-duration);animation-timing-function:var(--timing-function)}:host(:hover) .content.translate .inner-content{opacity:1}:host(.top) .content.translate .inner-content{animation-name:contentTranslateTopOut}:host(.top:hover) .content.translate .inner-content{animation-name:contentTranslateTopIn}:host(.right) .content.translate .inner-content{animation-name:contentTranslateRightOut}:host(.right:hover) .content.translate .inner-content{animation-name:contentTranslateRightIn}:host(.bottom) .content.translate .inner-content{animation-name:contentTranslateBottomOut}:host(.bottom:hover) .content.translate .inner-content{animation-name:contentTranslateBottomIn}:host(.left) .content.translate .inner-content{animation-name:contentTranslateLeftOut}:host(.left:hover) .content.translate .inner-content{animation-name:contentTranslateLeftIn}:host(.fade-in) .content{opacity:0}:host(.fade-in:hover) .content{opacity:1}:host(.fade-out) figure.image{opacity:1;z-index:1;will-change:opacity;transition-property:opacity;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host(.fade-out) .content .inner-content{z-index:2}:host(.fade-out:hover) figure.image{opacity:0}:host(.swipe) figure.image{display:flex;justify-content:center;align-items:center;overflow:hidden}:host(.swipe) figure.image::before{content:\"\";display:block;position:absolute;width:50%;height:100%;opacity:0;background:white;box-shadow:0 0 100px white;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function);z-index:2}:host(.swipe) .content{opacity:0;z-index:1}:host(.swipe:hover) .content{opacity:1}:host(.swipe.top) figure.image::before{animation-name:swipeTopOut}:host(.swipe.top:hover) figure.image::before{animation-name:swipeTopIn}:host(.swipe.right) figure.image::before{animation-name:swipeRightOut}:host(.swipe.right:hover) figure.image::before{animation-name:swipeRightIn}:host(.swipe.bottom) figure.image::before{animation-name:swipeBottomOut}:host(.swipe.bottom:hover) figure.image::before{animation-name:swipeBottomIn}:host(.swipe.left) figure.image::before{animation-name:swipeLeftOut}:host(.swipe.left:hover) figure.image::before{animation-name:swipeLeftIn}@keyframes swipeTopIn{0%{opacity:0.1;transform:skew(-20deg) translate(-250%)}100%{opacity:0.6;transform:skew(-20deg) translate(250%)}}@keyframes swipeTopOut{0%{opacity:0.6;transform:skew(-20deg) translate(250%)}100%{opacity:0.1;transform:skew(-20deg) translate(-250%)}}@keyframes swipeRightIn{0%{opacity:0.1;transform:skew(20deg) translate(250%)}100%{opacity:0.6;transform:skew(20deg) translate(-250%)}}@keyframes swipeRightOut{0%{opacity:0.6;transform:skew(20deg) translate(-250%)}100%{opacity:0.1;transform:skew(20deg) translate(250%)}}@keyframes swipeBottomIn{0%{opacity:0.1;transform:skew(-20deg) translate(250%)}100%{opacity:0.6;transform:skew(-20deg) translate(-250%)}}@keyframes swipeBottomOut{0%{opacity:0.6;transform:skew(-20deg) translate(-250%)}100%{opacity:0.1;transform:skew(-20deg) translate(250%)}}@keyframes swipeLeftIn{0%{opacity:0.1;transform:skew(20deg) translate(-250%)}100%{opacity:0.6;transform:skew(20deg) translate(250%)}}@keyframes swipeLeftOut{0%{opacity:0.6;transform:skew(20deg) translate(250%)}100%{opacity:0.1;transform:skew(20deg) translate(-250%)}}:host(.slide){overflow:hidden}:host(.slide) figure.image,:host(.slide) .content{animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:var(--animation-duration);animation-timing-function:var(--timing-function)}:host(.slide) .content{opacity:0}:host(.slide) .content .inner-content{transition-delay:calc(var(--animation-duration) * 0.5);animation-delay:calc(var(--animation-duration) * 0.5)}:host(.slide.top) figure.image{animation-name:slideImageTopOut}:host(.slide.top) .content{animation-name:slideContentTopOut}:host(.slide.top:hover) figure.image{animation-name:slideImageTopIn}:host(.slide.top:hover) .content{animation-name:slideContentTopIn}:host(.slide.right) figure.image{animation-name:slideImageRightOut}:host(.slide.right) .content{animation-name:slideContentRightOut}:host(.slide.right:hover) figure.image{animation-name:slideImageRightIn}:host(.slide.right:hover) .content{animation-name:slideContentRightIn}:host(.slide.bottom) figure.image{animation-name:slideImageBottomOut}:host(.slide.bottom) .content{animation-name:slideContentBottomOut}:host(.slide.bottom:hover) figure.image{animation-name:slideImageBottomIn}:host(.slide.bottom:hover) .content{animation-name:slideContentBottomIn}:host(.slide.left) figure.image{animation-name:slideImageLeftOut}:host(.slide.left) .content{animation-name:slideContentLeftOut}:host(.slide.left:hover) figure.image{animation-name:slideImageLeftIn}:host(.slide.left:hover) .content{animation-name:slideContentLeftIn}:host(.slide-over){overflow:hidden}:host(.slide-over) .content{opacity:0;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:var(--animation-duration);animation-timing-function:var(--timing-function)}:host(.slide-over) .content .inner-content{transition-delay:calc(var(--animation-duration) * 0.5);animation-delay:calc(var(--animation-duration) * 0.5)}:host(.slide-over.top) .content{animation-name:slideContentTopOut}:host(.slide-over.top:hover) .content{animation-name:slideContentTopIn}:host(.slide-over.right) .content{animation-name:slideContentRightOut}:host(.slide-over.right:hover) .content{animation-name:slideContentRightIn}:host(.slide-over.bottom) .content{animation-name:slideContentBottomOut}:host(.slide-over.bottom:hover) .content{animation-name:slideContentBottomIn}:host(.slide-over.left) .content{animation-name:slideContentLeftOut}:host(.slide-over.left:hover) .content{animation-name:slideContentLeftIn}:host(.zoom-in){overflow:hidden}:host(.zoom-in) figure.image img{transform:scale(1);will-change:transform;transition-property:transform;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host(.zoom-in) .content{opacity:0}:host(.zoom-in:hover) figure.image img{transform:scale(1.3)}:host(.zoom-in:hover) .content{opacity:1}:host(.zoom-out){overflow:hidden}:host(.zoom-out) figure.image img{transform:scale(1.3);will-change:transform;transition-property:transform;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host(.zoom-out) .content{opacity:0}:host(.zoom-out:hover) figure.image img{transform:scale(1)}:host(.zoom-out:hover) .content{opacity:1}:host(.shake){animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2.2);animation-timing-function:var(--timing-function)}:host(.shake) .content{opacity:0}:host(.shake:hover){animation-name:shake}:host(.shake:hover) .content{opacity:1}@keyframes shake{0%{transform:scale3d(1, 1, 1)}10%,20%{transform:scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)}30%,50%,70%,90%{transform:scale3d(1.02, 1.02, 1.02) rotate3d(0, 0, 1, 3deg)}40%,60%,80%{transform:scale3d(1.02, 1.02, 1.02) rotate3d(0, 0, 1, -3deg)}100%{transform:scale3d(1, 1, 1)}}:host(.trans){overflow:hidden}:host(.trans) figure.image{transform:scale(1.3)}:host(.trans) figure.image img{animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.trans) .content{opacity:0}:host(.trans:hover) .content{opacity:1}:host(.trans.top) figure.image img{animation-name:transTopOut}:host(.trans.top:hover) figure.image img{animation-name:transTopIn}:host(.trans.right) figure.image img{animation-name:transRightOut}:host(.trans.right:hover) figure.image img{animation-name:transRightIn}:host(.trans.bottom) figure.image img{animation-name:transBottomOut}:host(.trans.bottom:hover) figure.image img{animation-name:transBottomIn}:host(.trans.left) figure.image img{animation-name:transLeftOut}:host(.trans.left:hover) figure.image img{animation-name:transLeftIn}@keyframes transTopIn{0%{transform:translate(0, 0)}100%{transform:translate(0, 10%)}}@keyframes transTopOut{0%{transform:translate(0, 10%)}100%{transform:translate(0, 0)}}@keyframes transRightIn{0%{transform:translate(0, 0)}100%{transform:translate(-10%, 0)}}@keyframes transRightOut{0%{transform:translate(-10%, 0)}100%{transform:translate(0, 0)}}@keyframes transBottomIn{0%{transform:translate(0, 0)}100%{transform:translate(0, -10%)}}@keyframes transBottomOut{0%{transform:translate(0, -10%)}100%{transform:translate(0, 0)}}@keyframes transLeftIn{0%{transform:translate(0, 0)}100%{transform:translate(10%, 0)}}@keyframes transLeftOut{0%{transform:translate(10%, 0)}100%{transform:translate(0, 0)}}:host(.flip) figure.image{z-index:1;backface-visibility:hidden}:host(.flip) .content{z-index:0}:host(.flip) figure.image,:host(.flip) .content{animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.flip.left) .content .inner-content,:host(.flip.right) .content .inner-content{transform:rotateY(180deg)}:host(.flip.top) .content,:host(.flip.bottom) .content{flex-direction:column-reverse}:host(.flip.top) .content .inner-content,:host(.flip.bottom) .content .inner-content{transform:rotateX(180deg)}:host(.flip.top) figure.image,:host(.flip.top) .content{animation-name:flipBackTop}:host(.flip.top:hover) figure.image,:host(.flip.top:hover) .content{animation-name:flipFrontTop}:host(.flip.right) figure.image,:host(.flip.right) .content{animation-name:flipBackRight}:host(.flip.right:hover) figure.image,:host(.flip.right:hover) .content{animation-name:flipFrontRight}:host(.flip.bottom) figure.image,:host(.flip.bottom) .content{animation-name:flipBackBottom}:host(.flip.bottom:hover) figure.image,:host(.flip.bottom:hover) .content{animation-name:flipFrontBottom}:host(.flip.left) figure.image,:host(.flip.left) .content{animation-name:flipBackLeft}:host(.flip.left:hover) figure.image,:host(.flip.left:hover) .content{animation-name:flipFrontLeft}:host(.flip) .content.translate .inner-content{animation-name:none}:host(.flip:hover) .content.translate .inner-content{animation-name:none}@keyframes flipFrontTop{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 0deg)}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 180deg)}}@keyframes flipFrontRight{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 0deg)}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 180deg)}}@keyframes flipFrontBottom{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 0deg)}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -180deg)}}@keyframes flipFrontLeft{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 0deg)}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -180deg)}}@keyframes flipBackTop{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 180deg)}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 0deg)}}@keyframes flipBackRight{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 180deg)}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 0deg)}}@keyframes flipBackBottom{0%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, -180deg)}100%{transform:perspective(var(--perspective)) rotate3d(1, 0, 0, 0deg)}}@keyframes flipBackLeft{0%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, -180deg)}100%{transform:perspective(var(--perspective)) rotate3d(0, 1, 0, 0deg)}}:host(.flip-in) .content{opacity:0;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.flip-in:hover) .content{opacity:1;transition-duration:calc(var(--transition-duration) / 4)}:host(.flip-in.top:hover) .content{animation-name:flipInTop}:host(.flip-in.right:hover) .content{animation-name:flipInRight}:host(.flip-in.bottom:hover) .content{animation-name:flipInBottom}:host(.flip-in.left:hover) .content{animation-name:flipInLeft}:host(.flip-out) .content{z-index:0;-webkit-transform:translateZ(-9000px)}:host(.flip-out) .content .inner-content{opacity:0}:host(.flip-out) figure.image{z-index:1;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.flip-out:hover) .content .inner-content{animation-name:none;opacity:1;will-change:opacity;transition-delay:var(--animation-duration);transition-property:opacity;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host(.flip-out.top) figure.image{animation-name:flipInTop}:host(.flip-out.top:hover) figure.image{animation-name:flipOutTop}:host(.flip-out.right) figure.image{animation-name:flipInRight}:host(.flip-out.right:hover) figure.image{animation-name:flipOutRight}:host(.flip-out.bottom) figure.image{animation-name:flipInBottom}:host(.flip-out.bottom:hover) figure.image{animation-name:flipOutBottom}:host(.flip-out.left) figure.image{animation-name:flipInLeft}:host(.flip-out.left:hover) figure.image{animation-name:flipOutLeft}:host(.bubble) .content{opacity:0;animation-name:bubbleOut;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:var(--animation-duration);animation-timing-function:var(--timing-function)}:host(.bubble:hover) .content{opacity:1;animation-name:bubbleIn;animation-duration:calc(var(--animation-duration) * 2)}:host(.bubble.top) .content{transform-origin:center top}:host(.bubble.right) .content{transform-origin:center right}:host(.bubble.bottom) .content{transform-origin:center bottom}:host(.bubble.left) .content{transform-origin:center left}@keyframes bubbleIn{0%{transform:scale(0.1) rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}100%{transform:scale(1)}}@keyframes bubbleOut{0%{opacity:1;transform:scale(1)}30%{transform:rotate(3deg)}50%{opacity:1;transform:rotate(-10deg)}100%{opacity:0;transform:scale(0.1) rotate(30deg)}}:host(.bounce-in) .content{opacity:0;animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.bounce-in:hover) .content{opacity:1;animation-name:bounceIn}@keyframes bounceIn{0%{transform:scale(0.3, 0.3)}20%{transform:scale(1.1, 1.1)}40%{transform:scale(0.9, 0.9)}60%{transform:scale(1.03, 1.03)}80%{transform:scale(0.97, 0.97)}100%{transform:scale(1, 1)}}:host(.bounce-out) figure.image{z-index:1;opacity:1;will-change:opacity;transition-delay:var(--animation-duration);transition-property:opacity;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function);animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.bounce-out) .content{z-index:0}:host(.bounce-out:hover) .content .inner-content{animation-name:none}:host(.bounce-out:hover) figure.image{opacity:0;animation-name:bounceOut}@keyframes bounceOut{20%{transform:scale(0.9, 0.9)}50%,55%{transform:scale(1.1, 1.1)}100%{transform:scale(0.3, 0.3)}}:host(.flip-forward) figure.image{z-index:1;backface-visibility:hidden}:host(.flip-forward) .content{z-index:0}:host(.flip-forward) figure.image,:host(.flip-forward) .content{animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.flip-forward.last-active){-webkit-transform:translateZ(9000px)}:host(.flip-forward.left) .content .inner-content,:host(.flip-forward.right) .content .inner-content{transform:rotateY(180deg)}:host(.flip-forward.top) .content,:host(.flip-forward.bottom) .content{flex-direction:column-reverse}:host(.flip-forward.top) .content .inner-content,:host(.flip-forward.bottom) .content .inner-content{transform:rotateX(180deg)}:host(.flip-forward.top) figure.image,:host(.flip-forward.top) .content{animation-name:flipForwardOutTop}:host(.flip-forward.top:hover) figure.image,:host(.flip-forward.top:hover) .content{animation-name:flipForwardInTop}:host(.flip-forward.right) figure.image,:host(.flip-forward.right) .content{animation-name:flipForwardOutRight}:host(.flip-forward.right:hover) figure.image,:host(.flip-forward.right:hover) .content{animation-name:flipForwardInRight}:host(.flip-forward.bottom) figure.image,:host(.flip-forward.bottom) .content{animation-name:flipForwardOutBottom}:host(.flip-forward.bottom:hover) figure.image,:host(.flip-forward.bottom:hover) .content{animation-name:flipForwardInBottom}:host(.flip-forward.left) figure.image,:host(.flip-forward.left) .content{animation-name:flipForwardOutLeft}:host(.flip-forward.left:hover) figure.image,:host(.flip-forward.left:hover) .content{animation-name:flipForwardInLeft}:host(.flip-forward) .content.translate .inner-content{animation-name:none}:host(.flip-forward:hover) .content.translate .inner-content{animation-name:none}@keyframes flipForwardInTop{0%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateX(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(-180deg)}}@keyframes flipForwardOutTop{0%{transform:perspective(var(--perspective)) scale(1) rotateX(-180deg)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateX(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}}@keyframes flipForwardInRight{0%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateY(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(-180deg)}}@keyframes flipForwardOutRight{0%{transform:perspective(var(--perspective)) scale(1) rotateY(-180deg)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateY(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}}@keyframes flipForwardInBottom{0%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateX(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(180deg)}}@keyframes flipForwardOutBottom{0%{transform:perspective(var(--perspective)) scale(1) rotateX(180deg)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateX(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}}@keyframes flipForwardInLeft{0%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateY(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(180deg)}}@keyframes flipForwardOutLeft{0%{transform:perspective(var(--perspective)) scale(1) rotateY(180deg)}50%{transform:perspective(var(--perspective)) scale(1.3) rotateY(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}}:host(.flip-backward) figure.image{z-index:1;backface-visibility:hidden}:host(.flip-backward) .content{z-index:0}:host(.flip-backward) figure.image,:host(.flip-backward) .content{animation-iteration-count:1;animation-fill-mode:forwards;animation-duration:calc(var(--animation-duration) * 2);animation-timing-function:var(--timing-function)}:host(.flip-backward.left) .content .inner-content,:host(.flip-backward.right) .content .inner-content{transform:rotateY(180deg)}:host(.flip-backward.top) .content,:host(.flip-backward.bottom) .content{flex-direction:column-reverse}:host(.flip-backward.top) .content .inner-content,:host(.flip-backward.bottom) .content .inner-content{transform:rotateX(180deg)}:host(.flip-backward.top) figure.image,:host(.flip-backward.top) .content{animation-name:flipBackwardOutTop}:host(.flip-backward.top:hover) figure.image,:host(.flip-backward.top:hover) .content{animation-name:flipBackwardInTop}:host(.flip-backward.right) figure.image,:host(.flip-backward.right) .content{animation-name:flipBackwardOutRight}:host(.flip-backward.right:hover) figure.image,:host(.flip-backward.right:hover) .content{animation-name:flipBackwardInRight}:host(.flip-backward.bottom) figure.image,:host(.flip-backward.bottom) .content{animation-name:flipBackwardOutBottom}:host(.flip-backward.bottom:hover) figure.image,:host(.flip-backward.bottom:hover) .content{animation-name:flipBackwardInBottom}:host(.flip-backward.left) figure.image,:host(.flip-backward.left) .content{animation-name:flipBackwardOutLeft}:host(.flip-backward.left:hover) figure.image,:host(.flip-backward.left:hover) .content{animation-name:flipBackwardInLeft}:host(.flip-backward) .content.translate .inner-content{animation-name:none}:host(.flip-backward:hover) .content.translate .inner-content{animation-name:none}@keyframes flipBackwardInTop{0%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateX(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(-180deg)}}@keyframes flipBackwardOutTop{0%{transform:perspective(var(--perspective)) scale(1) rotateX(-180deg)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateX(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}}@keyframes flipBackwardInRight{0%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateY(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(-180deg)}}@keyframes flipBackwardOutRight{0%{transform:perspective(var(--perspective)) scale(1) rotateY(-180deg)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateY(-90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}}@keyframes flipBackwardInBottom{0%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateX(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(180deg)}}@keyframes flipBackwardOutBottom{0%{transform:perspective(var(--perspective)) scale(1) rotateX(180deg)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateX(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateX(0)}}@keyframes flipBackwardInLeft{0%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateY(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(180deg)}}@keyframes flipBackwardOutLeft{0%{transform:perspective(var(--perspective)) scale(1) rotateY(180deg)}50%{transform:perspective(var(--perspective)) scale(0.7) rotateY(90deg)}100%{transform:perspective(var(--perspective)) scale(1) rotateY(0)}}:host(.sense-3d){transform-style:preserve-3d;transform:perspective(var(--perspective)) rotateY(0deg) rotateX(0deg)}:host(.sense-3d) figure.image{will-change:transform;transition-property:transform;transition-duration:var(--transition-duration);transition-timing-function:var(--timing-function)}:host(.sense-3d) .content{opacity:0;will-change:opacity, transform;transition-property:opacity, transform}:host(.sense-3d:hover) figure.image{transition:transform 50ms linear}:host(.sense-3d:hover) .content{opacity:1;transition:transform 50ms linear, opacity var(--transition-duration) var(--timing-function)}";
const AeroCard$1 = /*@__PURE__*/(0, _client.proxyCustomElement)(class extends _client.HTMLElement {
  constructor() {
    super();

    this.__registerHost();

    this.__attachShadow();

    this.newCardAdded = (0, _client.createEvent)(this, "newCardAdded", 7);
    /**
     * Sets the card image hover effect. This can be one of the following:
     * fade-in, fade-out, swipe, slide, slide-over, zoom-in, zoom-out, shake,
     * trans, flip, flip-in, flip-out, bubble, bounce-in, bounce-out, flip-forward,
     * flip-backward, sense-3d
     */

    this.effect = 'sense-3d';
    /**
     * Align the card text content to: none, left, center, right
     */

    this.contentAlign = 'none';
    /**
     * Specifies the speed curve of the animations
     */

    this.timingFunction = 'ease';
    /**
     * Specifies how long a transition should take to complete one cycle
     */

    this.transitionDuration = '500ms';
    /**
     * Specifies how long an animation should take to complete one cycle
     */

    this.animationDuration = 'calc(var(--transition-duration) - 150ms)';
    /**
     * Specifies the content text color
     */

    this.contentColorText = 'white';
    /**
     * Specifies the content background color
     */

    this.contentColorBg = 'rgba(0, 5, 15, .7)';
    /**
     * Activate/deactivate mouse based content translate
     */

    this.contentTranslate = true;
    /**
     * Specifies the content translate offset.
     */

    this.contentTranslateOffset = '100px';
    /**
     * Specifies the content translate animation duration
     */

    this.contentTranslateDuration = 'calc(var(--animation-duration) - 20ms)';
    /**
     * Specifies the card border radius
     */

    this.borderRadius = '0';
    /**
     * Specifies how far the object is away from the user
     */

    this.perspective = '750px';
  }

  getContentClasses() {
    const classes = ['content'];

    if (this.contentTranslate) {
      classes.push('translate');
    }

    if (this.contentAlign !== 'none') {
      classes.push('align-' + this.contentAlign);
    }

    return classes.join(' ');
  }

  connectedCallback() {
    this.newCardAdded.emit(this.el);
    makeEffectDirectionAware(this.el);
    addSense3DMouseInterraction(this.el);
  }

  render() {
    return (0, _client.h)(_client.Host, {
      class: this.effect
    }, (0, _client.h)("style", null, "\n          :host {\n            --timing-function: ".concat(this.timingFunction, ";\n            --transition-duration: ").concat(this.transitionDuration, ";\n            --animation-duration: ").concat(this.animationDuration, ";\n          \n            --content-color-text: ").concat(this.contentColorText, ";\n            --content-color-bg: ").concat(this.contentColorBg, ";\n          \n            --content-translate-offset: ").concat(this.contentTranslateOffset, ";\n            --content-translate-duration: ").concat(this.contentTranslateDuration, ";\n          \n            --image-border-radius: ").concat(this.borderRadius, ";\n            --perspective: ").concat(this.perspective, ";\n          }\n        ")), (0, _client.h)("figure", {
      class: 'image'
    }, (0, _client.h)("img", {
      src: this.src,
      srcset: this.srcset,
      sizes: this.sizes,
      alt: this.alt,
      width: this.width,
      height: this.height
    })), (0, _client.h)("div", {
      class: this.getContentClasses()
    }, (0, _client.h)("div", {
      class: 'inner-content'
    }, (0, _client.h)("slot", null))));
  }

  get el() {
    return this;
  }

  static get style() {
    return aeroCardCss;
  }

}, [1, "aero-card", {
  "effect": [1],
  "contentAlign": [1, "content-align"],
  "alt": [1],
  "src": [1],
  "srcset": [1],
  "sizes": [1],
  "width": [1],
  "height": [1],
  "timingFunction": [1, "timing-function"],
  "transitionDuration": [1, "transition-duration"],
  "animationDuration": [1, "animation-duration"],
  "contentColorText": [1, "content-color-text"],
  "contentColorBg": [1, "content-color-bg"],
  "contentTranslate": [4, "content-translate"],
  "contentTranslateOffset": [1, "content-translate-offset"],
  "contentTranslateDuration": [1, "content-translate-duration"],
  "borderRadius": [1, "border-radius"],
  "perspective": [1]
}]);

function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }

  const components = ["aero-card"];
  components.forEach(tagName => {
    switch (tagName) {
      case "aero-card":
        if (!customElements.get(tagName)) {
          customElements.define(tagName, AeroCard$1);
        }

        break;
    }
  });
}

defineCustomElement$1();
const AeroCard = AeroCard$1;
exports.AeroCard = AeroCard;
const defineCustomElement = defineCustomElement$1;
exports.defineCustomElement = defineCustomElement;

},{"@stencil/core/internal/client":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCustomElement = exports.AeroGrid = void 0;

var _client = require("@stencil/core/internal/client");

const aeroGridCss = ":host{display:grid;position:relative;grid-gap:var(--grid-gap);grid-auto-flow:dense;grid-template-columns:repeat(auto-fit, minmax(var(--grid-item-size), 1fr))}:host(.squares){grid-auto-rows:1fr}:host(.squares)::before{content:\"\";width:0;height:0;padding-bottom:100%;grid-row:1/1;grid-column:1/1}:host(.squares) ::slotted(*:first-child){grid-row:1/1;grid-column:1/1}@media screen and (min-width: 768px){:host(.variations) ::slotted(*:nth-child(12n-8)){grid-column:span 1;grid-row:span 2}:host(.variations) ::slotted(*:nth-child(16n-8)){grid-column:span 2;grid-row:span 2}}";
const AeroGrid$1 = /*@__PURE__*/(0, _client.proxyCustomElement)(class extends _client.HTMLElement {
  constructor() {
    super();

    this.__registerHost();

    this.__attachShadow();
    /**
     * Sets the gaps (gutters) between grid rows and columns
     */


    this.gap = '1rem';
    /**
     * Sets the children cards image width and min-height
     */

    this.itemSize = '300px';
    /**
     * Activate/deactivate grid children cards size variation
     */

    this.variations = true;
    /**
     * Activate/deactivate grid children cards square (1:1) aspect ratio
     */

    this.squares = true;
    /**
     * Sets the children cards image hover effect. This can be one of the following:
     * fade-in, fade-out, swipe, slide, slide-over, zoom-in, zoom-out, shake,
     * trans, flip, flip-in, flip-out, bubble, bounce-in, bounce-out, flip-forward,
     * flip-backward, sense-3d
     */

    this.globalEffect = 'sense-3d';
    /**
     * Specifies children cards border radius
     */

    this.globalBorderRadius = '0';
  }

  newCardAddedHandler(event) {
    const card = event.detail;
    card.classList.add('on-grid');
    card.setAttribute('effect', this.globalEffect);
    card.setAttribute('border-radius', this.globalBorderRadius);

    if (this.squares) {
      card.classList.add('square');
    }
  }

  watchSquaresHandler(isSquaresAspectRatio) {
    isSquaresAspectRatio ? this.addChildrenClass('square') : this.removeChildrenClass('square');
  }

  watchGlobalEffect(newGlobalEffect) {
    this.setChildrenAttribute('effect', newGlobalEffect);
  }

  watchGlobalBorderRadius(newGlobalBorderRadius) {
    this.setChildrenAttribute('border-radius', newGlobalBorderRadius);
  }

  setChildrenAttribute(name, value) {
    const cards = this.el.querySelectorAll('aero-card');
    cards.forEach(effect => effect.setAttribute(name, value));
  }

  addChildrenClass(className) {
    const cards = this.el.querySelectorAll('aero-card');
    cards.forEach(effect => effect.classList.add(className));
  }

  removeChildrenClass(className) {
    const cards = this.el.querySelectorAll('aero-card');
    cards.forEach(effect => effect.classList.remove(className));
  }

  componentWillRender() {
    this.variations ? this.el.classList.add('variations') : this.el.classList.remove('variations');
    this.squares ? this.el.classList.add('squares') : this.el.classList.remove('squares');
  }

  connectedCallback() {
    this.addChildrenClass('on-grid');
    this.setChildrenAttribute('effect', this.globalEffect);
    this.setChildrenAttribute('border-radius', this.globalBorderRadius);

    if (this.squares) {
      this.addChildrenClass('square');
    }
  }

  render() {
    return (0, _client.h)(_client.Host, null, (0, _client.h)("style", null, "\n          :host {\n            --grid-gap: ".concat(this.gap, ";\n            --grid-item-size: ").concat(this.itemSize, ";\n          }\n        ")), (0, _client.h)("slot", null));
  }

  get el() {
    return this;
  }

  static get watchers() {
    return {
      "squares": ["watchSquaresHandler"],
      "globalEffect": ["watchGlobalEffect"],
      "globalBorderRadius": ["watchGlobalBorderRadius"]
    };
  }

  static get style() {
    return aeroGridCss;
  }

}, [1, "aero-grid", {
  "gap": [1],
  "itemSize": [1, "item-size"],
  "variations": [4],
  "squares": [4],
  "globalEffect": [1, "global-effect"],
  "globalBorderRadius": [1, "global-border-radius"]
}, [[2, "newCardAdded", "newCardAddedHandler"]]]);

function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }

  const components = ["aero-grid"];
  components.forEach(tagName => {
    switch (tagName) {
      case "aero-grid":
        if (!customElements.get(tagName)) {
          customElements.define(tagName, AeroGrid$1);
        }

        break;
    }
  });
}

defineCustomElement$1();
const AeroGrid = AeroGrid$1;
exports.AeroGrid = AeroGrid;
const defineCustomElement = defineCustomElement$1;
exports.defineCustomElement = defineCustomElement;

},{"@stencil/core/internal/client":4}],3:[function(require,module,exports){
'use strict';

const BUILD = {
    allRenderFn: false,
    cmpDidLoad: true,
    cmpDidUnload: false,
    cmpDidUpdate: true,
    cmpDidRender: true,
    cmpWillLoad: true,
    cmpWillUpdate: true,
    cmpWillRender: true,
    connectedCallback: true,
    disconnectedCallback: true,
    element: true,
    event: true,
    hasRenderFn: true,
    lifecycle: true,
    hostListener: true,
    hostListenerTargetWindow: true,
    hostListenerTargetDocument: true,
    hostListenerTargetBody: true,
    hostListenerTargetParent: false,
    hostListenerTarget: true,
    member: true,
    method: true,
    mode: true,
    observeAttribute: true,
    prop: true,
    propMutable: true,
    reflect: true,
    scoped: true,
    shadowDom: true,
    slot: true,
    cssAnnotations: true,
    state: true,
    style: true,
    svg: true,
    updatable: true,
    vdomAttribute: true,
    vdomXlink: true,
    vdomClass: true,
    vdomFunctional: true,
    vdomKey: true,
    vdomListener: true,
    vdomRef: true,
    vdomPropOrAttr: true,
    vdomRender: true,
    vdomStyle: true,
    vdomText: true,
    watchCallback: true,
    taskQueue: true,
    hotModuleReplacement: false,
    isDebug: false,
    isDev: false,
    isTesting: false,
    hydrateServerSide: false,
    hydrateClientSide: false,
    lifecycleDOMEvents: false,
    lazyLoad: false,
    profile: false,
    slotRelocation: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    hydratedAttribute: false,
    hydratedClass: true,
    safari10: false,
    scriptDataOpts: false,
    scopedSlotTextContentFix: false,
    shadowDomShim: false,
    slotChildNodesFix: false,
    invisiblePrehydration: true,
    propBoolean: true,
    propNumber: true,
    propString: true,
    cssVarShim: false,
    constructableCSS: true,
    cmpShouldUpdate: true,
    devTools: false,
    dynamicImportShim: false,
    shadowDelegatesFocus: true,
    initializeNextTick: false,
    asyncLoading: false,
    asyncQueue: false,
    transformTagName: false,
    attachStyles: true,
};
const Env = {};
const NAMESPACE = /* default */ 'app';

exports.BUILD = BUILD;
exports.Env = Env;
exports.NAMESPACE = NAMESPACE;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BUILD", {
  enumerable: true,
  get: function get() {
    return _appData.BUILD;
  }
});
exports.Context = exports.CSS = exports.Build = void 0;
Object.defineProperty(exports, "Env", {
  enumerable: true,
  get: function get() {
    return _appData.Env;
  }
});
exports.Host = exports.HTMLElement = exports.H = exports.Fragment = void 0;
Object.defineProperty(exports, "NAMESPACE", {
  enumerable: true,
  get: function get() {
    return _appData.NAMESPACE;
  }
});
exports.writeTask = exports.win = exports.supportsShadow = exports.supportsListenerOptions = exports.supportsConstructibleStylesheets = exports.styles = exports.setValue = exports.setPlatformOptions = exports.setPlatformHelpers = exports.setMode = exports.setErrorHandler = exports.setAssetPath = exports.renderVdom = exports.registerInstance = exports.registerHost = exports.readTask = exports.proxyCustomElement = exports.proxyComponent = exports.promiseResolve = exports.postUpdateComponent = exports.plt = exports.parsePropertyValue = exports.nextTick = exports.modeResolutionChain = exports.loadModule = exports.isMemberInElement = exports.insertVdomAnnotations = exports.h = exports.getValue = exports.getRenderingRef = exports.getMode = exports.getHostRef = exports.getElement = exports.getContext = exports.getConnect = exports.getAssetPath = exports.forceUpdate = exports.forceModeUpdate = exports.doc = exports.disconnectedCallback = exports.defineCustomElement = exports.createEvent = exports.consoleError = exports.consoleDevWarn = exports.consoleDevInfo = exports.consoleDevError = exports.connectedCallback = exports.cmpModules = exports.bootstrapLazy = exports.addHostEventListeners = exports.STENCIL_DEV_MODE = void 0;

var _appData = require("@stencil/core/internal/app-data");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let scopeId;
let contentRef;
let hostTagName;
let customError;
let i = 0;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;
let renderingRef = null;
let queueCongestion = 0;
let queuePending = false;
/*
 Stencil Client Platform v2.15.0 | MIT Licensed | https://stenciljs.com
 */

const win = typeof window !== 'undefined' ? window : {};
exports.win = win;
const CSS = _appData.BUILD.cssVarShim ? win.CSS : null;
exports.CSS = CSS;
const doc = win.document || {
  head: {}
};
exports.doc = doc;
const H = win.HTMLElement || class {};
exports.HTMLElement = exports.H = H;
const plt = {
  $flags$: 0,
  $resourcesUrl$: '',
  jmp: h => h(),
  raf: h => requestAnimationFrame(h),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
  ce: (eventName, opts) => new CustomEvent(eventName, opts)
};
exports.plt = plt;

const setPlatformHelpers = helpers => {
  Object.assign(plt, helpers);
};

exports.setPlatformHelpers = setPlatformHelpers;
const supportsShadow = _appData.BUILD.shadowDomShim && _appData.BUILD.shadowDom ? /*@__PURE__*/(() => (doc.head.attachShadow + '').indexOf('[native') > -1)() : true;
exports.supportsShadow = supportsShadow;

const supportsListenerOptions = /*@__PURE__*/(() => {
  let supportsListenerOptions = false;

  try {
    doc.addEventListener('e', null, Object.defineProperty({}, 'passive', {
      get() {
        supportsListenerOptions = true;
      }

    }));
  } catch (e) {}

  return supportsListenerOptions;
})();

exports.supportsListenerOptions = supportsListenerOptions;

const promiseResolve = v => Promise.resolve(v);

exports.promiseResolve = promiseResolve;
const supportsConstructibleStylesheets = _appData.BUILD.constructableCSS ? /*@__PURE__*/(() => {
  try {
    new CSSStyleSheet();
    return typeof new CSSStyleSheet().replace === 'function';
  } catch (e) {}

  return false;
})() : false;
exports.supportsConstructibleStylesheets = supportsConstructibleStylesheets;
const Context = {};
exports.Context = Context;

const addHostEventListeners = (elm, hostRef, listeners, attachParentListeners) => {
  if (_appData.BUILD.hostListener && listeners) {
    // this is called immediately within the element's constructor
    // initialize our event listeners on the host element
    // we do this now so that we can listen to events that may
    // have fired even before the instance is ready
    if (_appData.BUILD.hostListenerTargetParent) {
      // this component may have event listeners that should be attached to the parent
      if (attachParentListeners) {
        // this is being ran from within the connectedCallback
        // which is important so that we know the host element actually has a parent element
        // filter out the listeners to only have the ones that ARE being attached to the parent
        listeners = listeners.filter(_ref2 => {
          let [flags] = _ref2;
          return flags & 32;
        }
        /* TargetParent */
        );
      } else {
        // this is being ran from within the component constructor
        // everything BUT the parent element listeners should be attached at this time
        // filter out the listeners that are NOT being attached to the parent
        listeners = listeners.filter(_ref3 => {
          let [flags] = _ref3;
          return !(flags & 32
          /* TargetParent */
          );
        });
      }
    }

    listeners.map(_ref4 => {
      let [flags, name, method] = _ref4;
      const target = _appData.BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm;
      const handler = hostListenerProxy(hostRef, method);
      const opts = hostListenerOpts(flags);
      plt.ael(target, name, handler, opts);
      (hostRef.$rmListeners$ = hostRef.$rmListeners$ || []).push(() => plt.rel(target, name, handler, opts));
    });
  }
};

exports.addHostEventListeners = addHostEventListeners;

const hostListenerProxy = (hostRef, methodName) => ev => {
  try {
    if (_appData.BUILD.lazyLoad) {
      if (hostRef.$flags$ & 256
      /* isListenReady */
      ) {
        // instance is ready, let's call it's member method for this event
        hostRef.$lazyInstance$[methodName](ev);
      } else {
        (hostRef.$queuedListeners$ = hostRef.$queuedListeners$ || []).push([methodName, ev]);
      }
    } else {
      hostRef.$hostElement$[methodName](ev);
    }
  } catch (e) {
    consoleError(e);
  }
};

const getHostListenerTarget = (elm, flags) => {
  if (_appData.BUILD.hostListenerTargetDocument && flags & 4
  /* TargetDocument */
  ) return doc;
  if (_appData.BUILD.hostListenerTargetWindow && flags & 8
  /* TargetWindow */
  ) return win;
  if (_appData.BUILD.hostListenerTargetBody && flags & 16
  /* TargetBody */
  ) return doc.body;
  if (_appData.BUILD.hostListenerTargetParent && flags & 32
  /* TargetParent */
  ) return elm.parentElement;
  return elm;
}; // prettier-ignore


const hostListenerOpts = flags => supportsListenerOptions ? {
  passive: (flags & 1
  /* Passive */
  ) !== 0,
  capture: (flags & 2
  /* Capture */
  ) !== 0
} : (flags & 2
/* Capture */
) !== 0;

const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const HYDRATE_ID = 's-id';
const HYDRATED_STYLE_ID = 'sty-id';
const HYDRATE_CHILD_ID = 'c-id';
const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const createTime = function createTime(fnName) {
  let tagName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (_appData.BUILD.profile && performance.mark) {
    const key = "st:".concat(fnName, ":").concat(tagName, ":").concat(i++); // Start

    performance.mark(key); // End

    return () => performance.measure("[Stencil] ".concat(fnName, "() <").concat(tagName, ">"), key);
  } else {
    return () => {
      return;
    };
  }
};

const uniqueTime = (key, measureText) => {
  if (_appData.BUILD.profile && performance.mark) {
    if (performance.getEntriesByName(key).length === 0) {
      performance.mark(key);
    }

    return () => {
      if (performance.getEntriesByName(measureText).length === 0) {
        performance.measure(measureText, key);
      }
    };
  } else {
    return () => {
      return;
    };
  }
};

const inspect = ref => {
  const hostRef = getHostRef(ref);

  if (!hostRef) {
    return undefined;
  }

  const flags = hostRef.$flags$;
  const hostElement = hostRef.$hostElement$;
  return {
    renderCount: hostRef.$renderCount$,
    flags: {
      hasRendered: !!(flags & 2
      /* hasRendered */
      ),
      hasConnected: !!(flags & 1
      /* hasConnected */
      ),
      isWaitingForChildren: !!(flags & 4
      /* isWaitingForChildren */
      ),
      isConstructingInstance: !!(flags & 8
      /* isConstructingInstance */
      ),
      isQueuedForUpdate: !!(flags & 16
      /* isQueuedForUpdate */
      ),
      hasInitializedComponent: !!(flags & 32
      /* hasInitializedComponent */
      ),
      hasLoadedComponent: !!(flags & 64
      /* hasLoadedComponent */
      ),
      isWatchReady: !!(flags & 128
      /* isWatchReady */
      ),
      isListenReady: !!(flags & 256
      /* isListenReady */
      ),
      needsRerender: !!(flags & 512
      /* needsRerender */
      )
    },
    instanceValues: hostRef.$instanceValues$,
    ancestorComponent: hostRef.$ancestorComponent$,
    hostElement,
    lazyInstance: hostRef.$lazyInstance$,
    vnode: hostRef.$vnode$,
    modeName: hostRef.$modeName$,
    onReadyPromise: hostRef.$onReadyPromise$,
    onReadyResolve: hostRef.$onReadyResolve$,
    onInstancePromise: hostRef.$onInstancePromise$,
    onInstanceResolve: hostRef.$onInstanceResolve$,
    onRenderResolve: hostRef.$onRenderResolve$,
    queuedListeners: hostRef.$queuedListeners$,
    rmListeners: hostRef.$rmListeners$,
    ['s-id']: hostElement['s-id'],
    ['s-cr']: hostElement['s-cr'],
    ['s-lr']: hostElement['s-lr'],
    ['s-p']: hostElement['s-p'],
    ['s-rc']: hostElement['s-rc'],
    ['s-sc']: hostElement['s-sc']
  };
};

const installDevTools = () => {
  if (_appData.BUILD.devTools) {
    const stencil = win.stencil = win.stencil || {};
    const originalInspect = stencil.inspect;

    stencil.inspect = ref => {
      let result = inspect(ref);

      if (!result && typeof originalInspect === 'function') {
        result = originalInspect(ref);
      }

      return result;
    };
  }
};

const rootAppliedStyles = new WeakMap();

const registerStyle = (scopeId, cssText, allowCS) => {
  let style = styles.get(scopeId);

  if (supportsConstructibleStylesheets && allowCS) {
    style = style || new CSSStyleSheet();
    style.replace(cssText);
  } else {
    style = cssText;
  }

  styles.set(scopeId, style);
};

const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
  let scopeId = getScopeId(cmpMeta, mode);
  let style = styles.get(scopeId);

  if (!_appData.BUILD.attachStyles) {
    return scopeId;
  } // if an element is NOT connected then getRootNode() will return the wrong root node
  // so the fallback is to always use the document for the root node in those cases


  styleContainerNode = styleContainerNode.nodeType === 11
  /* DocumentFragment */
  ? styleContainerNode : doc;

  if (style) {
    if (typeof style === 'string') {
      styleContainerNode = styleContainerNode.head || styleContainerNode;
      let appliedStyles = rootAppliedStyles.get(styleContainerNode);
      let styleElm;

      if (!appliedStyles) {
        rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
      }

      if (!appliedStyles.has(scopeId)) {
        if (_appData.BUILD.hydrateClientSide && styleContainerNode.host && (styleElm = styleContainerNode.querySelector("[".concat(HYDRATED_STYLE_ID, "=\"").concat(scopeId, "\"]")))) {
          // This is only happening on native shadow-dom, do not needs CSS var shim
          styleElm.innerHTML = style;
        } else {
          if (_appData.BUILD.cssVarShim && plt.$cssShim$) {
            styleElm = plt.$cssShim$.createHostStyle(hostElm, scopeId, style, !!(cmpMeta.$flags$ & 10
            /* needsScopedEncapsulation */
            ));
            const newScopeId = styleElm['s-sc'];

            if (newScopeId) {
              scopeId = newScopeId; // we don't want to add this styleID to the appliedStyles Set
              // since the cssVarShim might need to apply several different
              // stylesheets for the same component

              appliedStyles = null;
            }
          } else {
            styleElm = doc.createElement('style');
            styleElm.innerHTML = style;
          }

          if (_appData.BUILD.hydrateServerSide || _appData.BUILD.hotModuleReplacement) {
            styleElm.setAttribute(HYDRATED_STYLE_ID, scopeId);
          }

          styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
        }

        if (appliedStyles) {
          appliedStyles.add(scopeId);
        }
      }
    } else if (_appData.BUILD.constructableCSS && !styleContainerNode.adoptedStyleSheets.includes(style)) {
      styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
    }
  }

  return scopeId;
};

const attachStyles = hostRef => {
  const cmpMeta = hostRef.$cmpMeta$;
  const elm = hostRef.$hostElement$;
  const flags = cmpMeta.$flags$;
  const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
  const scopeId = addStyle(_appData.BUILD.shadowDom && supportsShadow && elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(), cmpMeta, hostRef.$modeName$, elm);

  if ((_appData.BUILD.shadowDom || _appData.BUILD.scoped) && _appData.BUILD.cssAnnotations && flags & 10
  /* needsScopedEncapsulation */
  ) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    elm['s-sc'] = scopeId;
    elm.classList.add(scopeId + '-h');

    if (_appData.BUILD.scoped && flags & 2
    /* scopedCssEncapsulation */
    ) {
      elm.classList.add(scopeId + '-s');
    }
  }

  endAttachStyles();
};

const getScopeId = (cmp, mode) => 'sc-' + (_appData.BUILD.mode && mode && cmp.$flags$ & 32
/* hasMode */
? cmp.$tagName$ + '-' + mode : cmp.$tagName$);

const convertScopedToShadow = css => css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{'); // Private


const computeMode = elm => modeResolutionChain.map(h => h(elm)).find(m => !!m); // Public


const setMode = handler => modeResolutionChain.push(handler);

exports.setMode = setMode;

const getMode = ref => getHostRef(ref).$modeName$;
/**
 * Default style mode id
 */

/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */


exports.getMode = getMode;
const EMPTY_OBJ = {};
/**
 * Namespaces
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';

const isDef = v => v != null;

const isComplexType = o => {
  // https://jsperf.com/typeof-fn-object/5
  o = typeof o;
  return o === 'object' || o === 'function';
};
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// const stack: any[] = [];
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;


const h = function h(nodeName, vnodeData) {
  let child = null;
  let key = null;
  let slotName = null;
  let simple = false;
  let lastSimple = false;
  let vNodeChildren = [];

  const walk = c => {
    for (let i = 0; i < c.length; i++) {
      child = c[i];

      if (Array.isArray(child)) {
        walk(child);
      } else if (child != null && typeof child !== 'boolean') {
        if (simple = typeof nodeName !== 'function' && !isComplexType(child)) {
          child = String(child);
        } else if (_appData.BUILD.isDev && typeof nodeName !== 'function' && child.$flags$ === undefined) {
          consoleDevError("vNode passed as children has unexpected type.\nMake sure it's using the correct h() function.\nEmpty objects can also be the cause, look for JSX comments that became objects.");
        }

        if (simple && lastSimple) {
          // If the previous child was simple (string), we merge both
          vNodeChildren[vNodeChildren.length - 1].$text$ += child;
        } else {
          // Append a new vNode, if it's text, we create a text vNode
          vNodeChildren.push(simple ? newVNode(null, child) : child);
        }

        lastSimple = simple;
      }
    }
  };

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  walk(children);

  if (vnodeData) {
    if (_appData.BUILD.isDev && nodeName === 'input') {
      validateInputProperties(vnodeData);
    } // normalize class / classname attributes


    if (_appData.BUILD.vdomKey && vnodeData.key) {
      key = vnodeData.key;
    }

    if (_appData.BUILD.slotRelocation && vnodeData.name) {
      slotName = vnodeData.name;
    }

    if (_appData.BUILD.vdomClass) {
      const classData = vnodeData.className || vnodeData.class;

      if (classData) {
        vnodeData.class = typeof classData !== 'object' ? classData : Object.keys(classData).filter(k => classData[k]).join(' ');
      }
    }
  }

  if (_appData.BUILD.isDev && vNodeChildren.some(isHost)) {
    consoleDevError("The <Host> must be the single root component. Make sure:\n- You are NOT using hostData() and <Host> in the same component.\n- <Host> is used once, and it's the single root component of the render() function.");
  }

  if (_appData.BUILD.vdomFunctional && typeof nodeName === 'function') {
    // nodeName is a functional component
    return nodeName(vnodeData === null ? {} : vnodeData, vNodeChildren, vdomFnUtils);
  }

  const vnode = newVNode(nodeName, null);
  vnode.$attrs$ = vnodeData;

  if (vNodeChildren.length > 0) {
    vnode.$children$ = vNodeChildren;
  }

  if (_appData.BUILD.vdomKey) {
    vnode.$key$ = key;
  }

  if (_appData.BUILD.slotRelocation) {
    vnode.$name$ = slotName;
  }

  return vnode;
};

exports.h = h;

const newVNode = (tag, text) => {
  const vnode = {
    $flags$: 0,
    $tag$: tag,
    $text$: text,
    $elm$: null,
    $children$: null
  };

  if (_appData.BUILD.vdomAttribute) {
    vnode.$attrs$ = null;
  }

  if (_appData.BUILD.vdomKey) {
    vnode.$key$ = null;
  }

  if (_appData.BUILD.slotRelocation) {
    vnode.$name$ = null;
  }

  return vnode;
};

const Host = {};
exports.Host = Host;

const isHost = node => node && node.$tag$ === Host;

const vdomFnUtils = {
  forEach: (children, cb) => children.map(convertToPublic).forEach(cb),
  map: (children, cb) => children.map(convertToPublic).map(cb).map(convertToPrivate)
};

const convertToPublic = node => ({
  vattrs: node.$attrs$,
  vchildren: node.$children$,
  vkey: node.$key$,
  vname: node.$name$,
  vtag: node.$tag$,
  vtext: node.$text$
});

const convertToPrivate = node => {
  if (typeof node.vtag === 'function') {
    const vnodeData = Object.assign({}, node.vattrs);

    if (node.vkey) {
      vnodeData.key = node.vkey;
    }

    if (node.vname) {
      vnodeData.name = node.vname;
    }

    return h(node.vtag, vnodeData, ...(node.vchildren || []));
  }

  const vnode = newVNode(node.vtag, node.vtext);
  vnode.$attrs$ = node.vattrs;
  vnode.$children$ = node.vchildren;
  vnode.$key$ = node.vkey;
  vnode.$name$ = node.vname;
  return vnode;
};
/**
 * Validates the ordering of attributes on an input element
 * @param inputElm the element to validate
 */


const validateInputProperties = inputElm => {
  const props = Object.keys(inputElm);
  const value = props.indexOf('value');

  if (value === -1) {
    return;
  }

  const typeIndex = props.indexOf('type');
  const minIndex = props.indexOf('min');
  const maxIndex = props.indexOf('max');
  const stepIndex = props.indexOf('step');

  if (value < typeIndex || value < minIndex || value < maxIndex || value < stepIndex) {
    consoleDevWarn("The \"value\" prop of <input> should be set after \"min\", \"max\", \"type\" and \"step\"");
  }
};
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */


const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
  if (oldValue !== newValue) {
    let isProp = isMemberInElement(elm, memberName);
    let ln = memberName.toLowerCase();

    if (_appData.BUILD.vdomClass && memberName === 'class') {
      const classList = elm.classList;
      const oldClasses = parseClassList(oldValue);
      const newClasses = parseClassList(newValue);
      classList.remove(...oldClasses.filter(c => c && !newClasses.includes(c)));
      classList.add(...newClasses.filter(c => c && !oldClasses.includes(c)));
    } else if (_appData.BUILD.vdomStyle && memberName === 'style') {
      // update style attribute, css properties and values
      if (_appData.BUILD.updatable) {
        for (const prop in oldValue) {
          if (!newValue || newValue[prop] == null) {
            if (!_appData.BUILD.hydrateServerSide && prop.includes('-')) {
              elm.style.removeProperty(prop);
            } else {
              elm.style[prop] = '';
            }
          }
        }
      }

      for (const prop in newValue) {
        if (!oldValue || newValue[prop] !== oldValue[prop]) {
          if (!_appData.BUILD.hydrateServerSide && prop.includes('-')) {
            elm.style.setProperty(prop, newValue[prop]);
          } else {
            elm.style[prop] = newValue[prop];
          }
        }
      }
    } else if (_appData.BUILD.vdomKey && memberName === 'key') ;else if (_appData.BUILD.vdomRef && memberName === 'ref') {
      // minifier will clean this up
      if (newValue) {
        newValue(elm);
      }
    } else if (_appData.BUILD.vdomListener && (_appData.BUILD.lazyLoad ? !isProp : !elm.__lookupSetter__(memberName)) && memberName[0] === 'o' && memberName[1] === 'n') {
      // Event Handlers
      // so if the member name starts with "on" and the 3rd characters is
      // a capital letter, and it's not already a member on the element,
      // then we're assuming it's an event listener
      if (memberName[2] === '-') {
        // on- prefixed events
        // allows to be explicit about the dom event to listen without any magic
        // under the hood:
        // <my-cmp on-click> // listens for "click"
        // <my-cmp on-Click> // listens for "Click"
        // <my-cmp on-ionChange> // listens for "ionChange"
        // <my-cmp on-EVENTS> // listens for "EVENTS"
        memberName = memberName.slice(3);
      } else if (isMemberInElement(win, ln)) {
        // standard event
        // the JSX attribute could have been "onMouseOver" and the
        // member name "onmouseover" is on the window's prototype
        // so let's add the listener "mouseover", which is all lowercased
        memberName = ln.slice(2);
      } else {
        // custom event
        // the JSX attribute could have been "onMyCustomEvent"
        // so let's trim off the "on" prefix and lowercase the first character
        // and add the listener "myCustomEvent"
        // except for the first character, we keep the event name case
        memberName = ln[2] + memberName.slice(3);
      }

      if (oldValue) {
        plt.rel(elm, memberName, oldValue, false);
      }

      if (newValue) {
        plt.ael(elm, memberName, newValue, false);
      }
    } else if (_appData.BUILD.vdomPropOrAttr) {
      // Set property if it exists and it's not a SVG
      const isComplex = isComplexType(newValue);

      if ((isProp || isComplex && newValue !== null) && !isSvg) {
        try {
          if (!elm.tagName.includes('-')) {
            let n = newValue == null ? '' : newValue; // Workaround for Safari, moving the <input> caret when re-assigning the same valued

            if (memberName === 'list') {
              isProp = false;
            } else if (oldValue == null || elm[memberName] != n) {
              elm[memberName] = n;
            }
          } else {
            elm[memberName] = newValue;
          }
        } catch (e) {}
      }
      /**
       * Need to manually update attribute if:
       * - memberName is not an attribute
       * - if we are rendering the host element in order to reflect attribute
       * - if it's a SVG, since properties might not work in <svg>
       * - if the newValue is null/undefined or 'false'.
       */


      let xlink = false;

      if (_appData.BUILD.vdomXlink) {
        if (ln !== (ln = ln.replace(/^xlink\:?/, ''))) {
          memberName = ln;
          xlink = true;
        }
      }

      if (newValue == null || newValue === false) {
        if (newValue !== false || elm.getAttribute(memberName) === '') {
          if (_appData.BUILD.vdomXlink && xlink) {
            elm.removeAttributeNS(XLINK_NS, memberName);
          } else {
            elm.removeAttribute(memberName);
          }
        }
      } else if ((!isProp || flags & 4
      /* isHost */
      || isSvg) && !isComplex) {
        newValue = newValue === true ? '' : newValue;

        if (_appData.BUILD.vdomXlink && xlink) {
          elm.setAttributeNS(XLINK_NS, memberName, newValue);
        } else {
          elm.setAttribute(memberName, newValue);
        }
      }
    }
  }
};

const parseClassListRegex = /\s/;

const parseClassList = value => !value ? [] : value.split(parseClassListRegex);

const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm = newVnode.$elm$.nodeType === 11
  /* DocumentFragment */
  && newVnode.$elm$.host ? newVnode.$elm$.host : newVnode.$elm$;
  const oldVnodeAttrs = oldVnode && oldVnode.$attrs$ || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;

  if (_appData.BUILD.updatable) {
    // remove attributes no longer present on the vnode by setting them to undefined
    for (memberName in oldVnodeAttrs) {
      if (!(memberName in newVnodeAttrs)) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
      }
    }
  } // add new & update changed attributes


  for (memberName in newVnodeAttrs) {
    setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
  }
};

const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
  // tslint:disable-next-line: prefer-const
  let newVNode = newParentVNode.$children$[childIndex];
  let i = 0;
  let elm;
  let childNode;
  let oldVNode;

  if (_appData.BUILD.slotRelocation && !useNativeShadowDom) {
    // remember for later we need to check to relocate nodes
    checkSlotRelocate = true;

    if (newVNode.$tag$ === 'slot') {
      if (scopeId) {
        // scoped css needs to add its scoped id to the parent element
        parentElm.classList.add(scopeId + '-s');
      }

      newVNode.$flags$ |= newVNode.$children$ ? // slot element has fallback content
      2
      /* isSlotFallback */
      : // slot element does not have fallback content
      1
      /* isSlotReference */
      ;
    }
  }

  if (_appData.BUILD.isDev && newVNode.$elm$) {
    consoleDevError("The JSX ".concat(newVNode.$text$ !== null ? "\"".concat(newVNode.$text$, "\" text") : "\"".concat(newVNode.$tag$, "\" element"), " node should not be shared within the same renderer. The renderer caches element lookups in order to improve performance. However, a side effect from this is that the exact same JSX node should not be reused. For more information please see https://stenciljs.com/docs/templating-jsx#avoid-shared-jsx-nodes"));
  }

  if (_appData.BUILD.vdomText && newVNode.$text$ !== null) {
    // create text node
    elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
  } else if (_appData.BUILD.slotRelocation && newVNode.$flags$ & 1
  /* isSlotReference */
  ) {
    // create a slot reference node
    elm = newVNode.$elm$ = _appData.BUILD.isDebug || _appData.BUILD.hydrateServerSide ? slotReferenceDebugNode(newVNode) : doc.createTextNode('');
  } else {
    if (_appData.BUILD.svg && !isSvgMode) {
      isSvgMode = newVNode.$tag$ === 'svg';
    } // create element


    elm = newVNode.$elm$ = _appData.BUILD.svg ? doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS, _appData.BUILD.slotRelocation && newVNode.$flags$ & 2
    /* isSlotFallback */
    ? 'slot-fb' : newVNode.$tag$) : doc.createElement(_appData.BUILD.slotRelocation && newVNode.$flags$ & 2
    /* isSlotFallback */
    ? 'slot-fb' : newVNode.$tag$);

    if (_appData.BUILD.svg && isSvgMode && newVNode.$tag$ === 'foreignObject') {
      isSvgMode = false;
    } // add css classes, attrs, props, listeners, etc.


    if (_appData.BUILD.vdomAttribute) {
      updateElement(null, newVNode, isSvgMode);
    }

    if ((_appData.BUILD.shadowDom || _appData.BUILD.scoped) && isDef(scopeId) && elm['s-si'] !== scopeId) {
      // if there is a scopeId and this is the initial render
      // then let's add the scopeId as a css class
      elm.classList.add(elm['s-si'] = scopeId);
    }

    if (newVNode.$children$) {
      for (i = 0; i < newVNode.$children$.length; ++i) {
        // create the node
        childNode = createElm(oldParentVNode, newVNode, i, elm); // return node could have been null

        if (childNode) {
          // append our new node
          elm.appendChild(childNode);
        }
      }
    }

    if (_appData.BUILD.svg) {
      if (newVNode.$tag$ === 'svg') {
        // Only reset the SVG context when we're exiting <svg> element
        isSvgMode = false;
      } else if (elm.tagName === 'foreignObject') {
        // Reenter SVG context when we're exiting <foreignObject> element
        isSvgMode = true;
      }
    }
  }

  if (_appData.BUILD.slotRelocation) {
    elm['s-hn'] = hostTagName;

    if (newVNode.$flags$ & (2
    /* isSlotFallback */
    | 1
    /* isSlotReference */
    )) {
      // remember the content reference comment
      elm['s-sr'] = true; // remember the content reference comment

      elm['s-cr'] = contentRef; // remember the slot name, or empty string for default slot

      elm['s-sn'] = newVNode.$name$ || ''; // check if we've got an old vnode for this slot

      oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];

      if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
        // we've got an old slot vnode and the wrapper is being replaced
        // so let's move the old slot content back to it's original location
        putBackInOriginalLocation(oldParentVNode.$elm$, false);
      }
    }
  }

  return elm;
};

const putBackInOriginalLocation = (parentElm, recursive) => {
  plt.$flags$ |= 1
  /* isTmpDisconnected */
  ;
  const oldSlotChildNodes = parentElm.childNodes;

  for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
    const childNode = oldSlotChildNodes[i];

    if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
      // // this child node in the old element is from another component
      // // remove this node from the old slot's parent
      // childNode.remove();
      // and relocate it back to it's original location
      parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode)); // remove the old original location comment entirely
      // later on the patch function will know what to do
      // and move this to the correct spot in need be

      childNode['s-ol'].remove();
      childNode['s-ol'] = undefined;
      checkSlotRelocate = true;
    }

    if (recursive) {
      putBackInOriginalLocation(childNode, recursive);
    }
  }

  plt.$flags$ &= ~1
  /* isTmpDisconnected */
  ;
};

const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
  let containerElm = _appData.BUILD.slotRelocation && parentElm['s-cr'] && parentElm['s-cr'].parentNode || parentElm;
  let childNode;

  if (_appData.BUILD.shadowDom && containerElm.shadowRoot && containerElm.tagName === hostTagName) {
    containerElm = containerElm.shadowRoot;
  }

  for (; startIdx <= endIdx; ++startIdx) {
    if (vnodes[startIdx]) {
      childNode = createElm(null, parentVNode, startIdx, parentElm);

      if (childNode) {
        vnodes[startIdx].$elm$ = childNode;
        containerElm.insertBefore(childNode, _appData.BUILD.slotRelocation ? referenceNode(before) : before);
      }
    }
  }
};

const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
  for (; startIdx <= endIdx; ++startIdx) {
    if (vnode = vnodes[startIdx]) {
      elm = vnode.$elm$;
      callNodeRefs(vnode);

      if (_appData.BUILD.slotRelocation) {
        // we're removing this element
        // so it's possible we need to show slot fallback content now
        checkSlotFallbackVisibility = true;

        if (elm['s-ol']) {
          // remove the original location comment
          elm['s-ol'].remove();
        } else {
          // it's possible that child nodes of the node
          // that's being removed are slot nodes
          putBackInOriginalLocation(elm, true);
        }
      } // remove the vnode's element from the dom


      elm.remove();
    }
  }
};

const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let idxInOld = 0;
  let i = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let node;
  let elmToMove;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      // Vnode might have been moved left
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      if (_appData.BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
      }

      patch(oldStartVnode, newEndVnode);
      parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      if (_appData.BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
      }

      patch(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // createKeyToOldIdx
      idxInOld = -1;

      if (_appData.BUILD.vdomKey) {
        for (i = oldStartIdx; i <= oldEndIdx; ++i) {
          if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
            idxInOld = i;
            break;
          }
        }
      }

      if (_appData.BUILD.vdomKey && idxInOld >= 0) {
        elmToMove = oldCh[idxInOld];

        if (elmToMove.$tag$ !== newStartVnode.$tag$) {
          node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
        } else {
          patch(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          node = elmToMove.$elm$;
        }

        newStartVnode = newCh[++newStartIdx];
      } else {
        // new element
        node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
        newStartVnode = newCh[++newStartIdx];
      }

      if (node) {
        if (_appData.BUILD.slotRelocation) {
          parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
        } else {
          oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
  } else if (_appData.BUILD.updatable && newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
};

const isSameVnode = (vnode1, vnode2) => {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  if (vnode1.$tag$ === vnode2.$tag$) {
    if (_appData.BUILD.slotRelocation && vnode1.$tag$ === 'slot') {
      return vnode1.$name$ === vnode2.$name$;
    }

    if (_appData.BUILD.vdomKey) {
      return vnode1.$key$ === vnode2.$key$;
    }

    return true;
  }

  return false;
};

const referenceNode = node => {
  // this node was relocated to a new location in the dom
  // because of some other component's slot
  // but we still have an html comment in place of where
  // it's original location was according to it's original vdom
  return node && node['s-ol'] || node;
};

const parentReferenceNode = node => (node['s-ol'] ? node['s-ol'] : node).parentNode;

const patch = (oldVNode, newVNode) => {
  const elm = newVNode.$elm$ = oldVNode.$elm$;
  const oldChildren = oldVNode.$children$;
  const newChildren = newVNode.$children$;
  const tag = newVNode.$tag$;
  const text = newVNode.$text$;
  let defaultHolder;

  if (!_appData.BUILD.vdomText || text === null) {
    if (_appData.BUILD.svg) {
      // test if we're rendering an svg element, or still rendering nodes inside of one
      // only add this to the when the compiler sees we're using an svg somewhere
      isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : isSvgMode;
    } // element node


    if (_appData.BUILD.vdomAttribute || _appData.BUILD.reflect) {
      if (_appData.BUILD.slot && tag === 'slot') ;else {
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(oldVNode, newVNode, isSvgMode);
      }
    }

    if (_appData.BUILD.updatable && oldChildren !== null && newChildren !== null) {
      // looks like there's child vnodes for both the old and new vnodes
      updateChildren(elm, oldChildren, newVNode, newChildren);
    } else if (newChildren !== null) {
      // no old child vnodes, but there are new child vnodes to add
      if (_appData.BUILD.updatable && _appData.BUILD.vdomText && oldVNode.$text$ !== null) {
        // the old vnode was text, so be sure to clear it out
        elm.textContent = '';
      } // add the new vnode children


      addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
    } else if (_appData.BUILD.updatable && oldChildren !== null) {
      // no new child vnodes, but there are old child vnodes to remove
      removeVnodes(oldChildren, 0, oldChildren.length - 1);
    }

    if (_appData.BUILD.svg && isSvgMode && tag === 'svg') {
      isSvgMode = false;
    }
  } else if (_appData.BUILD.vdomText && _appData.BUILD.slotRelocation && (defaultHolder = elm['s-cr'])) {
    // this element has slotted content
    defaultHolder.parentNode.textContent = text;
  } else if (_appData.BUILD.vdomText && oldVNode.$text$ !== text) {
    // update the text content for the text only vnode
    // and also only if the text is different than before
    elm.data = text;
  }
};

const updateFallbackSlotVisibility = elm => {
  // tslint:disable-next-line: prefer-const
  let childNodes = elm.childNodes;
  let childNode;
  let i;
  let ilen;
  let j;
  let slotNameAttr;
  let nodeType;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode.nodeType === 1
    /* ElementNode */
    ) {
      if (childNode['s-sr']) {
        // this is a slot fallback node
        // get the slot name for this slot reference node
        slotNameAttr = childNode['s-sn']; // by default always show a fallback slot node
        // then hide it if there are other slots in the light dom

        childNode.hidden = false;

        for (j = 0; j < ilen; j++) {
          nodeType = childNodes[j].nodeType;

          if (childNodes[j]['s-hn'] !== childNode['s-hn'] || slotNameAttr !== '') {
            // this sibling node is from a different component OR is a named fallback slot node
            if (nodeType === 1
            /* ElementNode */
            && slotNameAttr === childNodes[j].getAttribute('slot')) {
              childNode.hidden = true;
              break;
            }
          } else {
            // this is a default fallback slot node
            // any element or text node (with content)
            // should hide the default fallback slot node
            if (nodeType === 1
            /* ElementNode */
            || nodeType === 3
            /* TextNode */
            && childNodes[j].textContent.trim() !== '') {
              childNode.hidden = true;
              break;
            }
          }
        }
      } // keep drilling down


      updateFallbackSlotVisibility(childNode);
    }
  }
};

const relocateNodes = [];

const relocateSlotContent = elm => {
  // tslint:disable-next-line: prefer-const
  let childNode;
  let node;
  let hostContentNodes;
  let slotNameAttr;
  let relocateNodeData;
  let j;
  let i = 0;
  let childNodes = elm.childNodes;
  let ilen = childNodes.length;

  for (; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr'] && (node = childNode['s-cr']) && node.parentNode) {
      // first got the content reference comment node
      // then we got it's parent, which is where all the host content is in now
      hostContentNodes = node.parentNode.childNodes;
      slotNameAttr = childNode['s-sn'];

      for (j = hostContentNodes.length - 1; j >= 0; j--) {
        node = hostContentNodes[j];

        if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
          // let's do some relocating to its new home
          // but never relocate a content reference node
          // that is suppose to always represent the original content location
          if (isNodeLocatedInSlot(node, slotNameAttr)) {
            // it's possible we've already decided to relocate this node
            relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node); // made some changes to slots
            // let's make sure we also double check
            // fallbacks are correctly hidden or shown

            checkSlotFallbackVisibility = true;
            node['s-sn'] = node['s-sn'] || slotNameAttr;

            if (relocateNodeData) {
              // previously we never found a slot home for this node
              // but turns out we did, so let's remember it now
              relocateNodeData.$slotRefNode$ = childNode;
            } else {
              // add to our list of nodes to relocate
              relocateNodes.push({
                $slotRefNode$: childNode,
                $nodeToRelocate$: node
              });
            }

            if (node['s-sr']) {
              relocateNodes.map(relocateNode => {
                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                  relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node);

                  if (relocateNodeData && !relocateNode.$slotRefNode$) {
                    relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                  }
                }
              });
            }
          } else if (!relocateNodes.some(r => r.$nodeToRelocate$ === node)) {
            // so far this element does not have a slot home, not setting slotRefNode on purpose
            // if we never find a home for this element then we'll need to hide it
            relocateNodes.push({
              $nodeToRelocate$: node
            });
          }
        }
      }
    }

    if (childNode.nodeType === 1
    /* ElementNode */
    ) {
      relocateSlotContent(childNode);
    }
  }
};

const isNodeLocatedInSlot = (nodeToRelocate, slotNameAttr) => {
  if (nodeToRelocate.nodeType === 1
  /* ElementNode */
  ) {
    if (nodeToRelocate.getAttribute('slot') === null && slotNameAttr === '') {
      return true;
    }

    if (nodeToRelocate.getAttribute('slot') === slotNameAttr) {
      return true;
    }

    return false;
  }

  if (nodeToRelocate['s-sn'] === slotNameAttr) {
    return true;
  }

  return slotNameAttr === '';
};

const callNodeRefs = vNode => {
  if (_appData.BUILD.vdomRef) {
    vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
    vNode.$children$ && vNode.$children$.map(callNodeRefs);
  }
};

const renderVdom = (hostRef, renderFnResults) => {
  const hostElm = hostRef.$hostElement$;
  const cmpMeta = hostRef.$cmpMeta$;
  const oldVNode = hostRef.$vnode$ || newVNode(null, null);
  const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
  hostTagName = hostElm.tagName; // <Host> runtime check

  if (_appData.BUILD.isDev && Array.isArray(renderFnResults) && renderFnResults.some(isHost)) {
    throw new Error("The <Host> must be the single root component.\nLooks like the render() function of \"".concat(hostTagName.toLowerCase(), "\" is returning an array that contains the <Host>.\n\nThe render() function should look like this instead:\n\nrender() {\n  // Do not return an array\n  return (\n    <Host>{content}</Host>\n  );\n}\n  "));
  }

  if (_appData.BUILD.reflect && cmpMeta.$attrsToReflect$) {
    rootVnode.$attrs$ = rootVnode.$attrs$ || {};
    cmpMeta.$attrsToReflect$.map(_ref5 => {
      let [propName, attribute] = _ref5;
      return rootVnode.$attrs$[attribute] = hostElm[propName];
    });
  }

  rootVnode.$tag$ = null;
  rootVnode.$flags$ |= 4
  /* isHost */
  ;
  hostRef.$vnode$ = rootVnode;
  rootVnode.$elm$ = oldVNode.$elm$ = _appData.BUILD.shadowDom ? hostElm.shadowRoot || hostElm : hostElm;

  if (_appData.BUILD.scoped || _appData.BUILD.shadowDom) {
    scopeId = hostElm['s-sc'];
  }

  if (_appData.BUILD.slotRelocation) {
    contentRef = hostElm['s-cr'];
    useNativeShadowDom = supportsShadow && (cmpMeta.$flags$ & 1
    /* shadowDomEncapsulation */
    ) !== 0; // always reset

    checkSlotFallbackVisibility = false;
  } // synchronous patch


  patch(oldVNode, rootVnode);

  if (_appData.BUILD.slotRelocation) {
    // while we're moving nodes around existing nodes, temporarily disable
    // the disconnectCallback from working
    plt.$flags$ |= 1
    /* isTmpDisconnected */
    ;

    if (checkSlotRelocate) {
      relocateSlotContent(rootVnode.$elm$);
      let relocateData;
      let nodeToRelocate;
      let orgLocationNode;
      let parentNodeRef;
      let insertBeforeNode;
      let refNode;
      let i = 0;

      for (; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (!nodeToRelocate['s-ol']) {
          // add a reference node marking this node's original location
          // keep a reference to this node for later lookups
          orgLocationNode = _appData.BUILD.isDebug || _appData.BUILD.hydrateServerSide ? originalLocationDebugNode(nodeToRelocate) : doc.createTextNode('');
          orgLocationNode['s-nr'] = nodeToRelocate;
          nodeToRelocate.parentNode.insertBefore(nodeToRelocate['s-ol'] = orgLocationNode, nodeToRelocate);
        }
      }

      for (i = 0; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (relocateData.$slotRefNode$) {
          // by default we're just going to insert it directly
          // after the slot reference node
          parentNodeRef = relocateData.$slotRefNode$.parentNode;
          insertBeforeNode = relocateData.$slotRefNode$.nextSibling;
          orgLocationNode = nodeToRelocate['s-ol'];

          while (orgLocationNode = orgLocationNode.previousSibling) {
            refNode = orgLocationNode['s-nr'];

            if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
              refNode = refNode.nextSibling;

              if (!refNode || !refNode['s-nr']) {
                insertBeforeNode = refNode;
                break;
              }
            }
          }

          if (!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode || nodeToRelocate.nextSibling !== insertBeforeNode) {
            // we've checked that it's worth while to relocate
            // since that the node to relocate
            // has a different next sibling or parent relocated
            if (nodeToRelocate !== insertBeforeNode) {
              if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                // probably a component in the index.html that doesn't have it's hostname set
                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
              } // add it back to the dom but in its new home


              parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
            }
          }
        } else {
          // this node doesn't have a slot home to go to, so let's hide it
          if (nodeToRelocate.nodeType === 1
          /* ElementNode */
          ) {
            nodeToRelocate.hidden = true;
          }
        }
      }
    }

    if (checkSlotFallbackVisibility) {
      updateFallbackSlotVisibility(rootVnode.$elm$);
    } // done moving nodes around
    // allow the disconnect callback to work again


    plt.$flags$ &= ~1
    /* isTmpDisconnected */
    ; // always reset

    relocateNodes.length = 0;
  }
}; // slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content


exports.renderVdom = renderVdom;

const slotReferenceDebugNode = slotVNode => doc.createComment("<slot".concat(slotVNode.$name$ ? ' name="' + slotVNode.$name$ + '"' : '', "> (host=").concat(hostTagName.toLowerCase(), ")"));

const originalLocationDebugNode = nodeToRelocate => doc.createComment("org-location for " + (nodeToRelocate.localName ? "<".concat(nodeToRelocate.localName, "> (host=").concat(nodeToRelocate['s-hn'], ")") : "[".concat(nodeToRelocate.textContent, "]")));

const getElement = ref => _appData.BUILD.lazyLoad ? getHostRef(ref).$hostElement$ : ref;

exports.getElement = getElement;

const createEvent = (ref, name, flags) => {
  const elm = getElement(ref);
  return {
    emit: detail => {
      if (_appData.BUILD.isDev && !elm.isConnected) {
        consoleDevWarn("The \"".concat(name, "\" event was emitted, but the dispatcher node is no longer connected to the dom."));
      }

      return emitEvent(elm, name, {
        bubbles: !!(flags & 4
        /* Bubbles */
        ),
        composed: !!(flags & 2
        /* Composed */
        ),
        cancelable: !!(flags & 1
        /* Cancellable */
        ),
        detail
      });
    }
  };
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */


exports.createEvent = createEvent;

const emitEvent = (elm, name, opts) => {
  const ev = plt.ce(name, opts);
  elm.dispatchEvent(ev);
  return ev;
};

const attachToAncestor = (hostRef, ancestorComponent) => {
  if (_appData.BUILD.asyncLoading && ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent['s-p']) {
    ancestorComponent['s-p'].push(new Promise(r => hostRef.$onRenderResolve$ = r));
  }
};

const scheduleUpdate = (hostRef, isInitialLoad) => {
  if (_appData.BUILD.taskQueue && _appData.BUILD.updatable) {
    hostRef.$flags$ |= 16
    /* isQueuedForUpdate */
    ;
  }

  if (_appData.BUILD.asyncLoading && hostRef.$flags$ & 4
  /* isWaitingForChildren */
  ) {
    hostRef.$flags$ |= 512
    /* needsRerender */
    ;
    return;
  }

  attachToAncestor(hostRef, hostRef.$ancestorComponent$); // there is no ancestor component or the ancestor component
  // has already fired off its lifecycle update then
  // fire off the initial update

  const dispatch = () => dispatchHooks(hostRef, isInitialLoad);

  return _appData.BUILD.taskQueue ? writeTask(dispatch) : dispatch();
};

const dispatchHooks = (hostRef, isInitialLoad) => {
  const elm = hostRef.$hostElement$;
  const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
  const instance = _appData.BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
  let promise;

  if (isInitialLoad) {
    if (_appData.BUILD.lazyLoad && _appData.BUILD.hostListener) {
      hostRef.$flags$ |= 256
      /* isListenReady */
      ;

      if (hostRef.$queuedListeners$) {
        hostRef.$queuedListeners$.map(_ref6 => {
          let [methodName, event] = _ref6;
          return safeCall(instance, methodName, event);
        });
        hostRef.$queuedListeners$ = null;
      }
    }

    emitLifecycleEvent(elm, 'componentWillLoad');

    if (_appData.BUILD.cmpWillLoad) {
      promise = safeCall(instance, 'componentWillLoad');
    }
  } else {
    emitLifecycleEvent(elm, 'componentWillUpdate');

    if (_appData.BUILD.cmpWillUpdate) {
      promise = safeCall(instance, 'componentWillUpdate');
    }
  }

  emitLifecycleEvent(elm, 'componentWillRender');

  if (_appData.BUILD.cmpWillRender) {
    promise = then(promise, () => safeCall(instance, 'componentWillRender'));
  }

  endSchedule();
  return then(promise, () => updateComponent(hostRef, instance, isInitialLoad));
};

const updateComponent = async (hostRef, instance, isInitialLoad) => {
  // updateComponent
  const elm = hostRef.$hostElement$;
  const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
  const rc = elm['s-rc'];

  if (_appData.BUILD.style && isInitialLoad) {
    // DOM WRITE!
    attachStyles(hostRef);
  }

  const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);

  if (_appData.BUILD.isDev) {
    hostRef.$flags$ |= 1024
    /* devOnRender */
    ;
  }

  if (_appData.BUILD.hydrateServerSide) {
    await callRender(hostRef, instance, elm);
  } else {
    callRender(hostRef, instance, elm);
  }

  if (_appData.BUILD.cssVarShim && plt.$cssShim$) {
    plt.$cssShim$.updateHost(elm);
  }

  if (_appData.BUILD.isDev) {
    hostRef.$renderCount$++;
    hostRef.$flags$ &= ~1024
    /* devOnRender */
    ;
  }

  if (_appData.BUILD.hydrateServerSide) {
    try {
      // manually connected child components during server-side hydrate
      serverSideConnected(elm);

      if (isInitialLoad) {
        // using only during server-side hydrate
        if (hostRef.$cmpMeta$.$flags$ & 1
        /* shadowDomEncapsulation */
        ) {
          elm['s-en'] = '';
        } else if (hostRef.$cmpMeta$.$flags$ & 2
        /* scopedCssEncapsulation */
        ) {
          elm['s-en'] = 'c';
        }
      }
    } catch (e) {
      consoleError(e, elm);
    }
  }

  if (_appData.BUILD.asyncLoading && rc) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    rc.map(cb => cb());
    elm['s-rc'] = undefined;
  }

  endRender();
  endUpdate();

  if (_appData.BUILD.asyncLoading) {
    const childrenPromises = elm['s-p'];

    const postUpdate = () => postUpdateComponent(hostRef);

    if (childrenPromises.length === 0) {
      postUpdate();
    } else {
      Promise.all(childrenPromises).then(postUpdate);
      hostRef.$flags$ |= 4
      /* isWaitingForChildren */
      ;
      childrenPromises.length = 0;
    }
  } else {
    postUpdateComponent(hostRef);
  }
};

const callRender = (hostRef, instance, elm) => {
  // in order for bundlers to correctly treeshake the BUILD object
  // we need to ensure BUILD is not deoptimized within a try/catch
  // https://rollupjs.org/guide/en/#treeshake tryCatchDeoptimization
  const allRenderFn = _appData.BUILD.allRenderFn ? true : false;
  const lazyLoad = _appData.BUILD.lazyLoad ? true : false;
  const taskQueue = _appData.BUILD.taskQueue ? true : false;
  const updatable = _appData.BUILD.updatable ? true : false;

  try {
    renderingRef = instance;
    instance = allRenderFn ? instance.render() : instance.render && instance.render();

    if (updatable && taskQueue) {
      hostRef.$flags$ &= ~16
      /* isQueuedForUpdate */
      ;
    }

    if (updatable || lazyLoad) {
      hostRef.$flags$ |= 2
      /* hasRendered */
      ;
    }

    if (_appData.BUILD.hasRenderFn || _appData.BUILD.reflect) {
      if (_appData.BUILD.vdomRender || _appData.BUILD.reflect) {
        // looks like we've got child nodes to render into this host element
        // or we need to update the css class/attrs on the host element
        // DOM WRITE!
        if (_appData.BUILD.hydrateServerSide) {
          return Promise.resolve(instance).then(value => renderVdom(hostRef, value));
        } else {
          renderVdom(hostRef, instance);
        }
      } else {
        elm.textContent = instance;
      }
    }
  } catch (e) {
    consoleError(e, hostRef.$hostElement$);
  }

  renderingRef = null;
  return null;
};

const getRenderingRef = () => renderingRef;

exports.getRenderingRef = getRenderingRef;

const postUpdateComponent = hostRef => {
  const tagName = hostRef.$cmpMeta$.$tagName$;
  const elm = hostRef.$hostElement$;
  const endPostUpdate = createTime('postUpdate', tagName);
  const instance = _appData.BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
  const ancestorComponent = hostRef.$ancestorComponent$;

  if (_appData.BUILD.cmpDidRender) {
    if (_appData.BUILD.isDev) {
      hostRef.$flags$ |= 1024
      /* devOnRender */
      ;
    }

    safeCall(instance, 'componentDidRender');

    if (_appData.BUILD.isDev) {
      hostRef.$flags$ &= ~1024
      /* devOnRender */
      ;
    }
  }

  emitLifecycleEvent(elm, 'componentDidRender');

  if (!(hostRef.$flags$ & 64
  /* hasLoadedComponent */
  )) {
    hostRef.$flags$ |= 64
    /* hasLoadedComponent */
    ;

    if (_appData.BUILD.asyncLoading && _appData.BUILD.cssAnnotations) {
      // DOM WRITE!
      addHydratedFlag(elm);
    }

    if (_appData.BUILD.cmpDidLoad) {
      if (_appData.BUILD.isDev) {
        hostRef.$flags$ |= 2048
        /* devOnDidLoad */
        ;
      }

      safeCall(instance, 'componentDidLoad');

      if (_appData.BUILD.isDev) {
        hostRef.$flags$ &= ~2048
        /* devOnDidLoad */
        ;
      }
    }

    emitLifecycleEvent(elm, 'componentDidLoad');
    endPostUpdate();

    if (_appData.BUILD.asyncLoading) {
      hostRef.$onReadyResolve$(elm);

      if (!ancestorComponent) {
        appDidLoad(tagName);
      }
    }
  } else {
    if (_appData.BUILD.cmpDidUpdate) {
      // we've already loaded this component
      // fire off the user's componentDidUpdate method (if one was provided)
      // componentDidUpdate runs AFTER render() has been called
      // and all child components have finished updating
      if (_appData.BUILD.isDev) {
        hostRef.$flags$ |= 1024
        /* devOnRender */
        ;
      }

      safeCall(instance, 'componentDidUpdate');

      if (_appData.BUILD.isDev) {
        hostRef.$flags$ &= ~1024
        /* devOnRender */
        ;
      }
    }

    emitLifecycleEvent(elm, 'componentDidUpdate');
    endPostUpdate();
  }

  if (_appData.BUILD.hotModuleReplacement) {
    elm['s-hmr-load'] && elm['s-hmr-load']();
  }

  if (_appData.BUILD.method && _appData.BUILD.lazyLoad) {
    hostRef.$onInstanceResolve$(elm);
  } // load events fire from bottom to top
  // the deepest elements load first then bubbles up


  if (_appData.BUILD.asyncLoading) {
    if (hostRef.$onRenderResolve$) {
      hostRef.$onRenderResolve$();
      hostRef.$onRenderResolve$ = undefined;
    }

    if (hostRef.$flags$ & 512
    /* needsRerender */
    ) {
      nextTick(() => scheduleUpdate(hostRef, false));
    }

    hostRef.$flags$ &= ~(4
    /* isWaitingForChildren */
    | 512
    /* needsRerender */
    );
  } // ( •_•)
  // ( •_•)>⌐■-■
  // (⌐■_■)

};

exports.postUpdateComponent = postUpdateComponent;

const forceUpdate = ref => {
  if (_appData.BUILD.updatable) {
    const hostRef = getHostRef(ref);
    const isConnected = hostRef.$hostElement$.isConnected;

    if (isConnected && (hostRef.$flags$ & (2
    /* hasRendered */
    | 16
    /* isQueuedForUpdate */
    )) === 2
    /* hasRendered */
    ) {
      scheduleUpdate(hostRef, false);
    } // Returns "true" when the forced update was successfully scheduled


    return isConnected;
  }

  return false;
};

exports.forceUpdate = forceUpdate;

const appDidLoad = who => {
  // on appload
  // we have finish the first big initial render
  if (_appData.BUILD.cssAnnotations) {
    addHydratedFlag(doc.documentElement);
  }

  if (_appData.BUILD.asyncQueue) {
    plt.$flags$ |= 2
    /* appLoaded */
    ;
  }

  nextTick(() => emitEvent(win, 'appload', {
    detail: {
      namespace: _appData.NAMESPACE
    }
  }));

  if (_appData.BUILD.profile && performance.measure) {
    performance.measure("[Stencil] ".concat(_appData.NAMESPACE, " initial load (by ").concat(who, ")"), 'st:app:start');
  }
};

const safeCall = (instance, method, arg) => {
  if (instance && instance[method]) {
    try {
      return instance[method](arg);
    } catch (e) {
      consoleError(e);
    }
  }

  return undefined;
};

const then = (promise, thenFn) => {
  return promise && promise.then ? promise.then(thenFn) : thenFn();
};

const emitLifecycleEvent = (elm, lifecycleName) => {
  if (_appData.BUILD.lifecycleDOMEvents) {
    emitEvent(elm, 'stencil_' + lifecycleName, {
      bubbles: true,
      composed: true,
      detail: {
        namespace: _appData.NAMESPACE
      }
    });
  }
};

const addHydratedFlag = elm => _appData.BUILD.hydratedClass ? elm.classList.add('hydrated') : _appData.BUILD.hydratedAttribute ? elm.setAttribute('hydrated', '') : undefined;

const serverSideConnected = elm => {
  const children = elm.children;

  if (children != null) {
    for (let i = 0, ii = children.length; i < ii; i++) {
      const childElm = children[i];

      if (typeof childElm.connectedCallback === 'function') {
        childElm.connectedCallback();
      }

      serverSideConnected(childElm);
    }
  }
};

const initializeClientHydrate = (hostElm, tagName, hostId, hostRef) => {
  const endHydrate = createTime('hydrateClient', tagName);
  const shadowRoot = hostElm.shadowRoot;
  const childRenderNodes = [];
  const slotNodes = [];
  const shadowRootNodes = _appData.BUILD.shadowDom && shadowRoot ? [] : null;
  const vnode = hostRef.$vnode$ = newVNode(tagName, null);

  if (!plt.$orgLocNodes$) {
    initializeDocumentHydrate(doc.body, plt.$orgLocNodes$ = new Map());
  }

  hostElm[HYDRATE_ID] = hostId;
  hostElm.removeAttribute(HYDRATE_ID);
  clientHydrate(vnode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, hostElm, hostId);
  childRenderNodes.map(c => {
    const orgLocationId = c.$hostId$ + '.' + c.$nodeId$;
    const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
    const node = c.$elm$;

    if (orgLocationNode && supportsShadow && orgLocationNode['s-en'] === '') {
      orgLocationNode.parentNode.insertBefore(node, orgLocationNode.nextSibling);
    }

    if (!shadowRoot) {
      node['s-hn'] = tagName;

      if (orgLocationNode) {
        node['s-ol'] = orgLocationNode;
        node['s-ol']['s-nr'] = node;
      }
    }

    plt.$orgLocNodes$.delete(orgLocationId);
  });

  if (_appData.BUILD.shadowDom && shadowRoot) {
    shadowRootNodes.map(shadowRootNode => {
      if (shadowRootNode) {
        shadowRoot.appendChild(shadowRootNode);
      }
    });
  }

  endHydrate();
};

const clientHydrate = (parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node, hostId) => {
  let childNodeType;
  let childIdSplt;
  let childVNode;
  let i;

  if (node.nodeType === 1
  /* ElementNode */
  ) {
    childNodeType = node.getAttribute(HYDRATE_CHILD_ID);

    if (childNodeType) {
      // got the node data from the element's attribute
      // `${hostId}.${nodeId}.${depth}.${index}`
      childIdSplt = childNodeType.split('.');

      if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
        childVNode = {
          $flags$: 0,
          $hostId$: childIdSplt[0],
          $nodeId$: childIdSplt[1],
          $depth$: childIdSplt[2],
          $index$: childIdSplt[3],
          $tag$: node.tagName.toLowerCase(),
          $elm$: node,
          $attrs$: null,
          $children$: null,
          $key$: null,
          $name$: null,
          $text$: null
        };
        childRenderNodes.push(childVNode);
        node.removeAttribute(HYDRATE_CHILD_ID); // this is a new child vnode
        // so ensure its parent vnode has the vchildren array

        if (!parentVNode.$children$) {
          parentVNode.$children$ = [];
        } // add our child vnode to a specific index of the vnode's children


        parentVNode.$children$[childVNode.$index$] = childVNode; // this is now the new parent vnode for all the next child checks

        parentVNode = childVNode;

        if (shadowRootNodes && childVNode.$depth$ === '0') {
          shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
        }
      }
    } // recursively drill down, end to start so we can remove nodes


    for (i = node.childNodes.length - 1; i >= 0; i--) {
      clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.childNodes[i], hostId);
    }

    if (node.shadowRoot) {
      // keep drilling down through the shadow root nodes
      for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
        clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.shadowRoot.childNodes[i], hostId);
      }
    }
  } else if (node.nodeType === 8
  /* CommentNode */
  ) {
    // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}`
    childIdSplt = node.nodeValue.split('.');

    if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
      // comment node for either the host id or a 0 host id
      childNodeType = childIdSplt[0];
      childVNode = {
        $flags$: 0,
        $hostId$: childIdSplt[1],
        $nodeId$: childIdSplt[2],
        $depth$: childIdSplt[3],
        $index$: childIdSplt[4],
        $elm$: node,
        $attrs$: null,
        $children$: null,
        $key$: null,
        $name$: null,
        $tag$: null,
        $text$: null
      };

      if (childNodeType === TEXT_NODE_ID) {
        childVNode.$elm$ = node.nextSibling;

        if (childVNode.$elm$ && childVNode.$elm$.nodeType === 3
        /* TextNode */
        ) {
          childVNode.$text$ = childVNode.$elm$.textContent;
          childRenderNodes.push(childVNode); // remove the text comment since it's no longer needed

          node.remove();

          if (!parentVNode.$children$) {
            parentVNode.$children$ = [];
          }

          parentVNode.$children$[childVNode.$index$] = childVNode;

          if (shadowRootNodes && childVNode.$depth$ === '0') {
            shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
          }
        }
      } else if (childVNode.$hostId$ === hostId) {
        // this comment node is specifcally for this host id
        if (childNodeType === SLOT_NODE_ID) {
          // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}`;
          childVNode.$tag$ = 'slot';

          if (childIdSplt[5]) {
            node['s-sn'] = childVNode.$name$ = childIdSplt[5];
          } else {
            node['s-sn'] = '';
          }

          node['s-sr'] = true;

          if (_appData.BUILD.shadowDom && shadowRootNodes) {
            // browser support shadowRoot and this is a shadow dom component
            // create an actual slot element
            childVNode.$elm$ = doc.createElement(childVNode.$tag$);

            if (childVNode.$name$) {
              // add the slot name attribute
              childVNode.$elm$.setAttribute('name', childVNode.$name$);
            } // insert the new slot element before the slot comment


            node.parentNode.insertBefore(childVNode.$elm$, node); // remove the slot comment since it's not needed for shadow

            node.remove();

            if (childVNode.$depth$ === '0') {
              shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
            }
          }

          slotNodes.push(childVNode);

          if (!parentVNode.$children$) {
            parentVNode.$children$ = [];
          }

          parentVNode.$children$[childVNode.$index$] = childVNode;
        } else if (childNodeType === CONTENT_REF_ID) {
          // `${CONTENT_REF_ID}.${hostId}`;
          if (_appData.BUILD.shadowDom && shadowRootNodes) {
            // remove the content ref comment since it's not needed for shadow
            node.remove();
          } else if (_appData.BUILD.slotRelocation) {
            hostElm['s-cr'] = node;
            node['s-cn'] = true;
          }
        }
      }
    }
  } else if (parentVNode && parentVNode.$tag$ === 'style') {
    const vnode = newVNode(null, node.textContent);
    vnode.$elm$ = node;
    vnode.$index$ = '0';
    parentVNode.$children$ = [vnode];
  }
};

const initializeDocumentHydrate = (node, orgLocNodes) => {
  if (node.nodeType === 1
  /* ElementNode */
  ) {
    let i = 0;

    for (; i < node.childNodes.length; i++) {
      initializeDocumentHydrate(node.childNodes[i], orgLocNodes);
    }

    if (node.shadowRoot) {
      for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
        initializeDocumentHydrate(node.shadowRoot.childNodes[i], orgLocNodes);
      }
    }
  } else if (node.nodeType === 8
  /* CommentNode */
  ) {
    const childIdSplt = node.nodeValue.split('.');

    if (childIdSplt[0] === ORG_LOCATION_ID) {
      orgLocNodes.set(childIdSplt[1] + '.' + childIdSplt[2], node);
      node.nodeValue = ''; // useful to know if the original location is
      // the root light-dom of a shadow dom component

      node['s-en'] = childIdSplt[3];
    }
  }
};
/**
 * Parse a new property value for a given property type.
 *
 * While the prop value can reasonably be expected to be of `any` type as far as TypeScript's type checker is concerned,
 * it is not safe to assume that the string returned by evaluating `typeof propValue` matches:
 *   1. `any`, the type given to `propValue` in the function signature
 *   2. the type stored from `propType`.
 *
 * This function provides the capability to parse/coerce a property's value to potentially any other JavaScript type.
 *
 * Property values represented in TSX preserve their type information. In the example below, the number 0 is passed to
 * a component. This `propValue` will preserve its type information (`typeof propValue === 'number'`). Note that is
 * based on the type of the value being passed in, not the type declared of the class member decorated with `@Prop`.
 * ```tsx
 * <my-cmp prop-val={0}></my-cmp>
 * ```
 *
 * HTML prop values on the other hand, will always a string
 *
 * @param propValue the new value to coerce to some type
 * @param propType the type of the prop, expressed as a binary number
 * @returns the parsed/coerced value
 */


const parsePropertyValue = (propValue, propType) => {
  // ensure this value is of the correct prop type
  if (propValue != null && !isComplexType(propValue)) {
    if (_appData.BUILD.propBoolean && propType & 4
    /* Boolean */
    ) {
      // per the HTML spec, any string value means it is a boolean true value
      // but we'll cheat here and say that the string "false" is the boolean false
      return propValue === 'false' ? false : propValue === '' || !!propValue;
    }

    if (_appData.BUILD.propNumber && propType & 2
    /* Number */
    ) {
      // force it to be a number
      return parseFloat(propValue);
    }

    if (_appData.BUILD.propString && propType & 1
    /* String */
    ) {
      // could have been passed as a number or boolean
      // but we still want it as a string
      return String(propValue);
    } // redundant return here for better minification


    return propValue;
  } // not sure exactly what type we want
  // so no need to change to a different type


  return propValue;
};

exports.parsePropertyValue = parsePropertyValue;

const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);

exports.getValue = getValue;

const setValue = (ref, propName, newVal, cmpMeta) => {
  // check our new property value against our internal value
  const hostRef = getHostRef(ref);
  const elm = _appData.BUILD.lazyLoad ? hostRef.$hostElement$ : ref;
  const oldVal = hostRef.$instanceValues$.get(propName);
  const flags = hostRef.$flags$;
  const instance = _appData.BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
  newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]); // explicitly check for NaN on both sides, as `NaN === NaN` is always false

  const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
  const didValueChange = newVal !== oldVal && !areBothNaN;

  if ((!_appData.BUILD.lazyLoad || !(flags & 8
  /* isConstructingInstance */
  ) || oldVal === undefined) && didValueChange) {
    // gadzooks! the property's value has changed!!
    // set our new value!
    hostRef.$instanceValues$.set(propName, newVal);

    if (_appData.BUILD.isDev) {
      if (hostRef.$flags$ & 1024
      /* devOnRender */
      ) {
        consoleDevWarn("The state/prop \"".concat(propName, "\" changed during rendering. This can potentially lead to infinite-loops and other bugs."), '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
      } else if (hostRef.$flags$ & 2048
      /* devOnDidLoad */
      ) {
        consoleDevWarn("The state/prop \"".concat(propName, "\" changed during \"componentDidLoad()\", this triggers extra re-renders, try to setup on \"componentWillLoad()\""), '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
      }
    }

    if (!_appData.BUILD.lazyLoad || instance) {
      // get an array of method names of watch functions to call
      if (_appData.BUILD.watchCallback && cmpMeta.$watchers$ && flags & 128
      /* isWatchReady */
      ) {
        const watchMethods = cmpMeta.$watchers$[propName];

        if (watchMethods) {
          // this instance is watching for when this property changed
          watchMethods.map(watchMethodName => {
            try {
              // fire off each of the watch methods that are watching this property
              instance[watchMethodName](newVal, oldVal, propName);
            } catch (e) {
              consoleError(e, elm);
            }
          });
        }
      }

      if (_appData.BUILD.updatable && (flags & (2
      /* hasRendered */
      | 16
      /* isQueuedForUpdate */
      )) === 2
      /* hasRendered */
      ) {
        if (_appData.BUILD.cmpShouldUpdate && instance.componentShouldUpdate) {
          if (instance.componentShouldUpdate(newVal, oldVal, propName) === false) {
            return;
          }
        } // looks like this value actually changed, so we've got work to do!
        // but only if we've already rendered, otherwise just chill out
        // queue that we need to do an update, but don't worry about queuing
        // up millions cuz this function ensures it only runs once


        scheduleUpdate(hostRef, false);
      }
    }
  }
};

exports.setValue = setValue;

const proxyComponent = (Cstr, cmpMeta, flags) => {
  if (_appData.BUILD.member && cmpMeta.$members$) {
    if (_appData.BUILD.watchCallback && Cstr.watchers) {
      cmpMeta.$watchers$ = Cstr.watchers;
    } // It's better to have a const than two Object.entries()


    const members = Object.entries(cmpMeta.$members$);
    const prototype = Cstr.prototype;
    members.map(_ref7 => {
      let [memberName, [memberFlags]] = _ref7;

      if ((_appData.BUILD.prop || _appData.BUILD.state) && (memberFlags & 31
      /* Prop */
      || (!_appData.BUILD.lazyLoad || flags & 2
      /* proxyState */
      ) && memberFlags & 32
      /* State */
      )) {
        // proxyComponent - prop
        Object.defineProperty(prototype, memberName, {
          get() {
            // proxyComponent, get value
            return getValue(this, memberName);
          },

          set(newValue) {
            // only during dev time
            if (_appData.BUILD.isDev) {
              const ref = getHostRef(this);

              if ( // we are proxying the instance (not element)
              (flags & 1
              /* isElementConstructor */
              ) === 0 && // the element is not constructing
              (ref.$flags$ & 8
              /* isConstructingInstance */
              ) === 0 && // the member is a prop
              (memberFlags & 31
              /* Prop */
              ) !== 0 && // the member is not mutable
              (memberFlags & 1024
              /* Mutable */
              ) === 0) {
                consoleDevWarn("@Prop() \"".concat(memberName, "\" on <").concat(cmpMeta.$tagName$, "> is immutable but was modified from within the component.\nMore information: https://stenciljs.com/docs/properties#prop-mutability"));
              }
            } // proxyComponent, set value


            setValue(this, memberName, newValue, cmpMeta);
          },

          configurable: true,
          enumerable: true
        });
      } else if (_appData.BUILD.lazyLoad && _appData.BUILD.method && flags & 1
      /* isElementConstructor */
      && memberFlags & 64
      /* Method */
      ) {
        // proxyComponent - method
        Object.defineProperty(prototype, memberName, {
          value() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            const ref = getHostRef(this);
            return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
          }

        });
      }
    });

    if (_appData.BUILD.observeAttribute && (!_appData.BUILD.lazyLoad || flags & 1
    /* isElementConstructor */
    )) {
      const attrNameToPropName = new Map();

      prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
        plt.jmp(() => {
          const propName = attrNameToPropName.get(attrName); //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
          //  in the case where an attribute was set inline.
          //  ```html
          //    <my-component some-attribute="some-value"></my-component>
          //  ```
          //
          //  There is an edge case where a developer sets the attribute inline on a custom element and then
          //  programmatically changes it before it has been upgraded as shown below:
          //
          //  ```html
          //    <!-- this component has _not_ been upgraded yet -->
          //    <my-component id="test" some-attribute="some-value"></my-component>
          //    <script>
          //      // grab non-upgraded component
          //      el = document.querySelector("#test");
          //      el.someAttribute = "another-value";
          //      // upgrade component
          //      customElements.define('my-component', MyComponent);
          //    </script>
          //  ```
          //  In this case if we do not unshadow here and use the value of the shadowing property, attributeChangedCallback
          //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
          //  to the value that was set inline i.e. "some-value" from above example. When
          //  the connectedCallback attempts to unshadow it will use "some-value" as the initial value rather than "another-value"
          //
          //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/unshadowed
          //  by connectedCallback as this attributeChangedCallback will not fire.
          //
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
          //
          //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
          //  properties here given that this goes against best practices outlined here
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy

          if (this.hasOwnProperty(propName)) {
            newValue = this[propName];
            delete this[propName];
          } else if (prototype.hasOwnProperty(propName) && typeof this[propName] === 'number' && this[propName] == newValue) {
            // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
            // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
            // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
            return;
          }

          this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
        });
      }; // create an array of attributes to observe
      // and also create a map of html attribute name to js property name


      Cstr.observedAttributes = members.filter(_ref8 => {
        let [_, m] = _ref8;
        return m[0] & 15;
      }
      /* HasAttribute */
      ) // filter to only keep props that should match attributes
      .map(_ref9 => {
        let [propName, m] = _ref9;
        const attrName = m[1] || propName;
        attrNameToPropName.set(attrName, propName);

        if (_appData.BUILD.reflect && m[0] & 512
        /* ReflectAttr */
        ) {
          cmpMeta.$attrsToReflect$.push([propName, attrName]);
        }

        return attrName;
      });
    }
  }

  return Cstr;
};

exports.proxyComponent = proxyComponent;

const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
  // initializeComponent
  if ((_appData.BUILD.lazyLoad || _appData.BUILD.hydrateServerSide || _appData.BUILD.style) && (hostRef.$flags$ & 32
  /* hasInitializedComponent */
  ) === 0) {
    if (_appData.BUILD.lazyLoad || _appData.BUILD.hydrateClientSide) {
      // we haven't initialized this element yet
      hostRef.$flags$ |= 32
      /* hasInitializedComponent */
      ; // lazy loaded components
      // request the component's implementation to be
      // wired up with the host element

      Cstr = loadModule(cmpMeta, hostRef, hmrVersionId);

      if (Cstr.then) {
        // Await creates a micro-task avoid if possible
        const endLoad = uniqueTime("st:load:".concat(cmpMeta.$tagName$, ":").concat(hostRef.$modeName$), "[Stencil] Load module for <".concat(cmpMeta.$tagName$, ">"));
        Cstr = await Cstr;
        endLoad();
      }

      if ((_appData.BUILD.isDev || _appData.BUILD.isDebug) && !Cstr) {
        throw new Error("Constructor for \"".concat(cmpMeta.$tagName$, "#").concat(hostRef.$modeName$, "\" was not found"));
      }

      if (_appData.BUILD.member && !Cstr.isProxied) {
        // we've never proxied this Constructor before
        // let's add the getters/setters to its prototype before
        // the first time we create an instance of the implementation
        if (_appData.BUILD.watchCallback) {
          cmpMeta.$watchers$ = Cstr.watchers;
        }

        proxyComponent(Cstr, cmpMeta, 2
        /* proxyState */
        );
        Cstr.isProxied = true;
      }

      const endNewInstance = createTime('createInstance', cmpMeta.$tagName$); // ok, time to construct the instance
      // but let's keep track of when we start and stop
      // so that the getters/setters don't incorrectly step on data

      if (_appData.BUILD.member) {
        hostRef.$flags$ |= 8
        /* isConstructingInstance */
        ;
      } // construct the lazy-loaded component implementation
      // passing the hostRef is very important during
      // construction in order to directly wire together the
      // host element and the lazy-loaded instance


      try {
        new Cstr(hostRef);
      } catch (e) {
        consoleError(e);
      }

      if (_appData.BUILD.member) {
        hostRef.$flags$ &= ~8
        /* isConstructingInstance */
        ;
      }

      if (_appData.BUILD.watchCallback) {
        hostRef.$flags$ |= 128
        /* isWatchReady */
        ;
      }

      endNewInstance();
      fireConnectedCallback(hostRef.$lazyInstance$);
    } else {
      // sync constructor component
      Cstr = elm.constructor;
      hostRef.$flags$ |= 32
      /* hasInitializedComponent */
      ; // wait for the CustomElementRegistry to mark the component as ready before setting `isWatchReady`. Otherwise,
      // watchers may fire prematurely if `customElements.get()`/`customElements.whenDefined()` resolves _before_
      // Stencil has completed instantiating the component.

      customElements.whenDefined(cmpMeta.$tagName$).then(() => hostRef.$flags$ |= 128
      /* isWatchReady */
      );
    }

    if (_appData.BUILD.style && Cstr.style) {
      // this component has styles but we haven't registered them yet
      let style = Cstr.style;

      if (_appData.BUILD.mode && typeof style !== 'string') {
        style = style[hostRef.$modeName$ = computeMode(elm)];

        if (_appData.BUILD.hydrateServerSide && hostRef.$modeName$) {
          elm.setAttribute('s-mode', hostRef.$modeName$);
        }
      }

      const scopeId = getScopeId(cmpMeta, hostRef.$modeName$);

      if (!styles.has(scopeId)) {
        const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);

        if (!_appData.BUILD.hydrateServerSide && _appData.BUILD.shadowDom && _appData.BUILD.shadowDomShim && cmpMeta.$flags$ & 8
        /* needsShadowDomShim */
        ) {
          style = await Promise.resolve().then(() => _interopRequireWildcard(require('./shadow-css.js'))).then(m => m.scopeCss(style, scopeId, false));
        }

        registerStyle(scopeId, style, !!(cmpMeta.$flags$ & 1
        /* shadowDomEncapsulation */
        ));
        endRegisterStyles();
      }
    }
  } // we've successfully created a lazy instance


  const ancestorComponent = hostRef.$ancestorComponent$;

  const schedule = () => scheduleUpdate(hostRef, true);

  if (_appData.BUILD.asyncLoading && ancestorComponent && ancestorComponent['s-rc']) {
    // this is the initial load and this component it has an ancestor component
    // but the ancestor component has NOT fired its will update lifecycle yet
    // so let's just cool our jets and wait for the ancestor to continue first
    // this will get fired off when the ancestor component
    // finally gets around to rendering its lazy self
    // fire off the initial update
    ancestorComponent['s-rc'].push(schedule);
  } else {
    schedule();
  }
};

const fireConnectedCallback = instance => {
  if (_appData.BUILD.lazyLoad && _appData.BUILD.connectedCallback) {
    safeCall(instance, 'connectedCallback');
  }
};

const connectedCallback = elm => {
  if ((plt.$flags$ & 1
  /* isTmpDisconnected */
  ) === 0) {
    const hostRef = getHostRef(elm);
    const cmpMeta = hostRef.$cmpMeta$;
    const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);

    if (_appData.BUILD.hostListenerTargetParent) {
      // only run if we have listeners being attached to a parent
      addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, true);
    }

    if (!(hostRef.$flags$ & 1
    /* hasConnected */
    )) {
      // first time this component has connected
      hostRef.$flags$ |= 1
      /* hasConnected */
      ;
      let hostId;

      if (_appData.BUILD.hydrateClientSide) {
        hostId = elm.getAttribute(HYDRATE_ID);

        if (hostId) {
          if (_appData.BUILD.shadowDom && supportsShadow && cmpMeta.$flags$ & 1
          /* shadowDomEncapsulation */
          ) {
            const scopeId = _appData.BUILD.mode ? addStyle(elm.shadowRoot, cmpMeta, elm.getAttribute('s-mode')) : addStyle(elm.shadowRoot, cmpMeta);
            elm.classList.remove(scopeId + '-h', scopeId + '-s');
          }

          initializeClientHydrate(elm, cmpMeta.$tagName$, hostId, hostRef);
        }
      }

      if (_appData.BUILD.slotRelocation && !hostId) {
        // initUpdate
        // if the slot polyfill is required we'll need to put some nodes
        // in here to act as original content anchors as we move nodes around
        // host element has been connected to the DOM
        if (_appData.BUILD.hydrateServerSide || (_appData.BUILD.slot || _appData.BUILD.shadowDom) && cmpMeta.$flags$ & (4
        /* hasSlotRelocation */
        | 8
        /* needsShadowDomShim */
        )) {
          setContentReference(elm);
        }
      }

      if (_appData.BUILD.asyncLoading) {
        // find the first ancestor component (if there is one) and register
        // this component as one of the actively loading child components for its ancestor
        let ancestorComponent = elm;

        while (ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host) {
          // climb up the ancestors looking for the first
          // component that hasn't finished its lifecycle update yet
          if (_appData.BUILD.hydrateClientSide && ancestorComponent.nodeType === 1
          /* ElementNode */
          && ancestorComponent.hasAttribute('s-id') && ancestorComponent['s-p'] || ancestorComponent['s-p']) {
            // we found this components first ancestor component
            // keep a reference to this component's ancestor component
            attachToAncestor(hostRef, hostRef.$ancestorComponent$ = ancestorComponent);
            break;
          }
        }
      } // Lazy properties
      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties


      if (_appData.BUILD.prop && !_appData.BUILD.hydrateServerSide && cmpMeta.$members$) {
        Object.entries(cmpMeta.$members$).map(_ref10 => {
          let [memberName, [memberFlags]] = _ref10;

          if (memberFlags & 31
          /* Prop */
          && elm.hasOwnProperty(memberName)) {
            const value = elm[memberName];
            delete elm[memberName];
            elm[memberName] = value;
          }
        });
      }

      if (_appData.BUILD.initializeNextTick) {
        // connectedCallback, taskQueue, initialLoad
        // angular sets attribute AFTER connectCallback
        // https://github.com/angular/angular/issues/18909
        // https://github.com/angular/angular/issues/19940
        nextTick(() => initializeComponent(elm, hostRef, cmpMeta));
      } else {
        initializeComponent(elm, hostRef, cmpMeta);
      }
    } else {
      // not the first time this has connected
      // reattach any event listeners to the host
      // since they would have been removed when disconnected
      addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false); // fire off connectedCallback() on component instance

      fireConnectedCallback(hostRef.$lazyInstance$);
    }

    endConnected();
  }
};

exports.connectedCallback = connectedCallback;

const setContentReference = elm => {
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  const contentRefElm = elm['s-cr'] = doc.createComment(_appData.BUILD.isDebug ? "content-ref (host=".concat(elm.localName, ")") : '');
  contentRefElm['s-cn'] = true;
  elm.insertBefore(contentRefElm, elm.firstChild);
};

const disconnectedCallback = elm => {
  if ((plt.$flags$ & 1
  /* isTmpDisconnected */
  ) === 0) {
    const hostRef = getHostRef(elm);
    const instance = _appData.BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;

    if (_appData.BUILD.hostListener) {
      if (hostRef.$rmListeners$) {
        hostRef.$rmListeners$.map(rmListener => rmListener());
        hostRef.$rmListeners$ = undefined;
      }
    } // clear CSS var-shim tracking


    if (_appData.BUILD.cssVarShim && plt.$cssShim$) {
      plt.$cssShim$.removeHost(elm);
    }

    if (_appData.BUILD.lazyLoad && _appData.BUILD.disconnectedCallback) {
      safeCall(instance, 'disconnectedCallback');
    }

    if (_appData.BUILD.cmpDidUnload) {
      safeCall(instance, 'componentDidUnload');
    }
  }
};

exports.disconnectedCallback = disconnectedCallback;

const defineCustomElement = (Cstr, compactMeta) => {
  customElements.define(compactMeta[1], proxyCustomElement(Cstr, compactMeta));
};

exports.defineCustomElement = defineCustomElement;

const proxyCustomElement = (Cstr, compactMeta) => {
  const cmpMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1]
  };

  if (_appData.BUILD.member) {
    cmpMeta.$members$ = compactMeta[2];
  }

  if (_appData.BUILD.hostListener) {
    cmpMeta.$listeners$ = compactMeta[3];
  }

  if (_appData.BUILD.watchCallback) {
    cmpMeta.$watchers$ = Cstr.$watchers$;
  }

  if (_appData.BUILD.reflect) {
    cmpMeta.$attrsToReflect$ = [];
  }

  if (_appData.BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1
  /* shadowDomEncapsulation */
  ) {
    cmpMeta.$flags$ |= 8
    /* needsShadowDomShim */
    ;
  }

  const originalConnectedCallback = Cstr.prototype.connectedCallback;
  const originalDisconnectedCallback = Cstr.prototype.disconnectedCallback;
  Object.assign(Cstr.prototype, {
    __registerHost() {
      registerHost(this, cmpMeta);
    },

    connectedCallback() {
      connectedCallback(this);

      if (_appData.BUILD.connectedCallback && originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    },

    disconnectedCallback() {
      disconnectedCallback(this);

      if (_appData.BUILD.disconnectedCallback && originalDisconnectedCallback) {
        originalDisconnectedCallback.call(this);
      }
    },

    __attachShadow() {
      if (supportsShadow) {
        if (_appData.BUILD.shadowDelegatesFocus) {
          this.attachShadow({
            mode: 'open',
            delegatesFocus: !!(cmpMeta.$flags$ & 16
            /* shadowDelegatesFocus */
            )
          });
        } else {
          this.attachShadow({
            mode: 'open'
          });
        }
      } else {
        this.shadowRoot = this;
      }
    }

  });
  Cstr.is = cmpMeta.$tagName$;
  return proxyComponent(Cstr, cmpMeta, 1
  /* isElementConstructor */
  | 2
  /* proxyState */
  );
};

exports.proxyCustomElement = proxyCustomElement;

const forceModeUpdate = elm => {
  if (_appData.BUILD.style && _appData.BUILD.mode && !_appData.BUILD.lazyLoad) {
    const mode = computeMode(elm);
    const hostRef = getHostRef(elm);

    if (hostRef.$modeName$ !== mode) {
      const cmpMeta = hostRef.$cmpMeta$;
      const oldScopeId = elm['s-sc'];
      const scopeId = getScopeId(cmpMeta, mode);
      const style = elm.constructor.style[mode];
      const flags = cmpMeta.$flags$;

      if (style) {
        if (!styles.has(scopeId)) {
          registerStyle(scopeId, style, !!(flags & 1
          /* shadowDomEncapsulation */
          ));
        }

        hostRef.$modeName$ = mode;
        elm.classList.remove(oldScopeId + '-h', oldScopeId + '-s');
        attachStyles(hostRef);
        forceUpdate(elm);
      }
    }
  }
};

exports.forceModeUpdate = forceModeUpdate;

const hmrStart = (elm, cmpMeta, hmrVersionId) => {
  // ¯\_(ツ)_/¯
  const hostRef = getHostRef(elm); // reset state flags to only have been connected

  hostRef.$flags$ = 1
  /* hasConnected */
  ; // TODO
  // detatch any event listeners that may have been added
  // because we're not passing an exact event name it'll
  // remove all of this element's event, which is good
  // create a callback for when this component finishes hmr

  elm['s-hmr-load'] = () => {
    // finished hmr for this element
    delete elm['s-hmr-load'];
  }; // re-initialize the component


  initializeComponent(elm, hostRef, cmpMeta, hmrVersionId);
};

const patchCloneNode = HostElementPrototype => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function (deep) {
    const srcNode = this;
    const isShadowDom = _appData.BUILD.shadowDom ? srcNode.shadowRoot && supportsShadow : false;
    const clonedNode = orgCloneNode.call(srcNode, isShadowDom ? deep : false);

    if (_appData.BUILD.slot && !isShadowDom && deep) {
      let i = 0;
      let slotted, nonStencilNode;
      let stencilPrivates = ['s-id', 's-cr', 's-lr', 's-rc', 's-sc', 's-p', 's-cn', 's-sr', 's-sn', 's-hn', 's-ol', 's-nr', 's-si'];

      for (; i < srcNode.childNodes.length; i++) {
        slotted = srcNode.childNodes[i]['s-nr'];
        nonStencilNode = stencilPrivates.every(privateField => !srcNode.childNodes[i][privateField]);

        if (slotted) {
          if (_appData.BUILD.appendChildSlotFix && clonedNode.__appendChild) {
            clonedNode.__appendChild(slotted.cloneNode(true));
          } else {
            clonedNode.appendChild(slotted.cloneNode(true));
          }
        }

        if (nonStencilNode) {
          clonedNode.appendChild(srcNode.childNodes[i].cloneNode(true));
        }
      }
    }

    return clonedNode;
  };
};

const patchSlotAppendChild = HostElementPrototype => {
  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;

  HostElementPrototype.appendChild = function (newChild) {
    const slotName = newChild['s-sn'] = getSlotName(newChild);
    const slotNode = getHostSlotNode(this.childNodes, slotName);

    if (slotNode) {
      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];
      return appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
    }

    return this.__appendChild(newChild);
  };
};
/**
 * Patches the text content of an unnamed slotted node inside a scoped component
 * @param hostElementPrototype the `Element` to be patched
 * @param cmpMeta component runtime metadata used to determine if the component should be patched or not
 */


const patchTextContent = (hostElementPrototype, cmpMeta) => {
  if (_appData.BUILD.scoped && cmpMeta.$flags$ & 2
  /* scopedCssEncapsulation */
  ) {
    const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
    Object.defineProperty(hostElementPrototype, '__textContent', descriptor);
    Object.defineProperty(hostElementPrototype, 'textContent', {
      get() {
        var _a; // get the 'default slot', which would be the first slot in a shadow tree (if we were using one), whose name is
        // the empty string


        const slotNode = getHostSlotNode(this.childNodes, ''); // when a slot node is found, the textContent _may_ be found in the next sibling (text) node, depending on how
        // nodes were reordered during the vdom render. first try to get the text content from the sibling.

        if (((_a = slotNode === null || slotNode === void 0 ? void 0 : slotNode.nextSibling) === null || _a === void 0 ? void 0 : _a.nodeType) === 3
        /* TEXT_NODE */
        ) {
          return slotNode.nextSibling.textContent;
        } else if (slotNode) {
          return slotNode.textContent;
        } else {
          // fallback to the original implementation
          return this.__textContent;
        }
      },

      set(value) {
        var _a; // get the 'default slot', which would be the first slot in a shadow tree (if we were using one), whose name is
        // the empty string


        const slotNode = getHostSlotNode(this.childNodes, ''); // when a slot node is found, the textContent _may_ need to be placed in the next sibling (text) node,
        // depending on how nodes were reordered during the vdom render. first try to set the text content on the
        // sibling.

        if (((_a = slotNode === null || slotNode === void 0 ? void 0 : slotNode.nextSibling) === null || _a === void 0 ? void 0 : _a.nodeType) === 3
        /* TEXT_NODE */
        ) {
          slotNode.nextSibling.textContent = value;
        } else if (slotNode) {
          slotNode.textContent = value;
        } else {
          // we couldn't find a slot, but that doesn't mean that there isn't one. if this check ran before the DOM
          // loaded, we could have missed it. check for a content reference element on the scoped component and insert
          // it there
          this.__textContent = value;
          const contentRefElm = this['s-cr'];

          if (contentRefElm) {
            this.insertBefore(contentRefElm, this.firstChild);
          }
        }
      }

    });
  }
};

const patchChildSlotNodes = (elm, cmpMeta) => {
  class FakeNodeList extends Array {
    item(n) {
      return this[n];
    }

  }

  if (cmpMeta.$flags$ & 8
  /* needsShadowDomShim */
  ) {
    const childNodesFn = elm.__lookupGetter__('childNodes');

    Object.defineProperty(elm, 'children', {
      get() {
        return this.childNodes.map(n => n.nodeType === 1);
      }

    });
    Object.defineProperty(elm, 'childElementCount', {
      get() {
        return elm.children.length;
      }

    });
    Object.defineProperty(elm, 'childNodes', {
      get() {
        const childNodes = childNodesFn.call(this);

        if ((plt.$flags$ & 1
        /* isTmpDisconnected */
        ) === 0 && getHostRef(this).$flags$ & 2
        /* hasRendered */
        ) {
          const result = new FakeNodeList();

          for (let i = 0; i < childNodes.length; i++) {
            const slot = childNodes[i]['s-nr'];

            if (slot) {
              result.push(slot);
            }
          }

          return result;
        }

        return FakeNodeList.from(childNodes);
      }

    });
  }
};

const getSlotName = node => node['s-sn'] || node.nodeType === 1 && node.getAttribute('slot') || '';
/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */


const getHostSlotNode = (childNodes, slotName) => {
  let i = 0;
  let childNode;

  for (; i < childNodes.length; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr'] && childNode['s-sn'] === slotName) {
      return childNode;
    }

    childNode = getHostSlotNode(childNode.childNodes, slotName);

    if (childNode) {
      return childNode;
    }
  }

  return null;
};

const getHostSlotChildNodes = (n, slotName) => {
  const childNodes = [n];

  while ((n = n.nextSibling) && n['s-sn'] === slotName) {
    childNodes.push(n);
  }

  return childNodes;
};

const bootstrapLazy = function bootstrapLazy(lazyBundles) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (_appData.BUILD.profile && performance.mark) {
    performance.mark('st:app:start');
  }

  installDevTools();
  const endBootstrap = createTime('bootstrapLazy');
  const cmpTags = [];
  const exclude = options.exclude || [];
  const customElements = win.customElements;
  const head = doc.head;
  const metaCharset = /*@__PURE__*/head.querySelector('meta[charset]');
  const visibilityStyle = /*@__PURE__*/doc.createElement('style');
  const deferredConnectedCallbacks = [];
  const styles = /*@__PURE__*/doc.querySelectorAll("[".concat(HYDRATED_STYLE_ID, "]"));
  let appLoadFallback;
  let isBootstrapping = true;
  let i = 0;
  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;

  if (_appData.BUILD.asyncQueue) {
    if (options.syncQueue) {
      plt.$flags$ |= 4
      /* queueSync */
      ;
    }
  }

  if (_appData.BUILD.hydrateClientSide) {
    // If the app is already hydrated there is not point to disable the
    // async queue. This will improve the first input delay
    plt.$flags$ |= 2
    /* appLoaded */
    ;
  }

  if (_appData.BUILD.hydrateClientSide && _appData.BUILD.shadowDom) {
    for (; i < styles.length; i++) {
      registerStyle(styles[i].getAttribute(HYDRATED_STYLE_ID), convertScopedToShadow(styles[i].innerHTML), true);
    }
  }

  lazyBundles.map(lazyBundle => {
    lazyBundle[1].map(compactMeta => {
      const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3]
      };

      if (_appData.BUILD.member) {
        cmpMeta.$members$ = compactMeta[2];
      }

      if (_appData.BUILD.hostListener) {
        cmpMeta.$listeners$ = compactMeta[3];
      }

      if (_appData.BUILD.reflect) {
        cmpMeta.$attrsToReflect$ = [];
      }

      if (_appData.BUILD.watchCallback) {
        cmpMeta.$watchers$ = {};
      }

      if (_appData.BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1
      /* shadowDomEncapsulation */
      ) {
        cmpMeta.$flags$ |= 8
        /* needsShadowDomShim */
        ;
      }

      const tagName = _appData.BUILD.transformTagName && options.transformTagName ? options.transformTagName(cmpMeta.$tagName$) : cmpMeta.$tagName$;
      const HostElement = class extends HTMLElement {
        // StencilLazyHost
        constructor(self) {
          // @ts-ignore
          super(self);
          self = this;
          registerHost(self, cmpMeta);

          if (_appData.BUILD.shadowDom && cmpMeta.$flags$ & 1
          /* shadowDomEncapsulation */
          ) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            // adding the shadow root build conditionals to minimize runtime
            if (supportsShadow) {
              if (_appData.BUILD.shadowDelegatesFocus) {
                self.attachShadow({
                  mode: 'open',
                  delegatesFocus: !!(cmpMeta.$flags$ & 16
                  /* shadowDelegatesFocus */
                  )
                });
              } else {
                self.attachShadow({
                  mode: 'open'
                });
              }
            } else if (!_appData.BUILD.hydrateServerSide && !('shadowRoot' in self)) {
              self.shadowRoot = self;
            }
          }

          if (_appData.BUILD.slotChildNodesFix) {
            patchChildSlotNodes(self, cmpMeta);
          }
        }

        connectedCallback() {
          if (appLoadFallback) {
            clearTimeout(appLoadFallback);
            appLoadFallback = null;
          }

          if (isBootstrapping) {
            // connectedCallback will be processed once all components have been registered
            deferredConnectedCallbacks.push(this);
          } else {
            plt.jmp(() => connectedCallback(this));
          }
        }

        disconnectedCallback() {
          plt.jmp(() => disconnectedCallback(this));
        }

        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }

      };

      if (_appData.BUILD.cloneNodeFix) {
        patchCloneNode(HostElement.prototype);
      }

      if (_appData.BUILD.appendChildSlotFix) {
        patchSlotAppendChild(HostElement.prototype);
      }

      if (_appData.BUILD.hotModuleReplacement) {
        HostElement.prototype['s-hmr'] = function (hmrVersionId) {
          hmrStart(this, cmpMeta, hmrVersionId);
        };
      }

      if (_appData.BUILD.scopedSlotTextContentFix) {
        patchTextContent(HostElement.prototype, cmpMeta);
      }

      cmpMeta.$lazyBundleId$ = lazyBundle[0];

      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        cmpTags.push(tagName);
        customElements.define(tagName, proxyComponent(HostElement, cmpMeta, 1
        /* isElementConstructor */
        ));
      }
    });
  });

  if (_appData.BUILD.invisiblePrehydration && (_appData.BUILD.hydratedClass || _appData.BUILD.hydratedAttribute)) {
    visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
    visibilityStyle.setAttribute('data-styles', '');
    head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
  } // Process deferred connectedCallbacks now all components have been registered


  isBootstrapping = false;

  if (deferredConnectedCallbacks.length) {
    deferredConnectedCallbacks.map(host => host.connectedCallback());
  } else {
    if (_appData.BUILD.profile) {
      plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30, 'timeout'));
    } else {
      plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30));
    }
  } // Fallback appLoad event


  endBootstrap();
};

exports.bootstrapLazy = bootstrapLazy;

const getAssetPath = path => {
  const assetUrl = new URL(path, plt.$resourcesUrl$);
  return assetUrl.origin !== win.location.origin ? assetUrl.href : assetUrl.pathname;
};

exports.getAssetPath = getAssetPath;

const setAssetPath = path => plt.$resourcesUrl$ = path;

exports.setAssetPath = setAssetPath;

const getConnect = (_ref, tagName) => {
  const componentOnReady = () => {
    let elm = doc.querySelector(tagName);

    if (!elm) {
      elm = doc.createElement(tagName);
      doc.body.appendChild(elm);
    }

    return typeof elm.componentOnReady === 'function' ? elm.componentOnReady() : Promise.resolve(elm);
  };

  const create = function create() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return componentOnReady().then(el => el.create(...args));
  };

  return {
    create,
    componentOnReady
  };
};

exports.getConnect = getConnect;

const getContext = (_elm, context) => {
  if (context in Context) {
    return Context[context];
  } else if (context === 'window') {
    return win;
  } else if (context === 'document') {
    return doc;
  } else if (context === 'isServer' || context === 'isPrerender') {
    return _appData.BUILD.hydrateServerSide ? true : false;
  } else if (context === 'isClient') {
    return _appData.BUILD.hydrateServerSide ? false : true;
  } else if (context === 'resourcesUrl' || context === 'publicPath') {
    return getAssetPath('.');
  } else if (context === 'queue') {
    return {
      write: writeTask,
      read: readTask,
      tick: {
        then(cb) {
          return nextTick(cb);
        }

      }
    };
  }

  return undefined;
};

exports.getContext = getContext;

const insertVdomAnnotations = (doc, staticComponents) => {
  if (doc != null) {
    const docData = {
      hostIds: 0,
      rootLevelIds: 0,
      staticComponents: new Set(staticComponents)
    };
    const orgLocationNodes = [];
    parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);
    orgLocationNodes.forEach(orgLocationNode => {
      if (orgLocationNode != null) {
        const nodeRef = orgLocationNode['s-nr'];
        let hostId = nodeRef['s-host-id'];
        let nodeId = nodeRef['s-node-id'];
        let childId = "".concat(hostId, ".").concat(nodeId);

        if (hostId == null) {
          hostId = 0;
          docData.rootLevelIds++;
          nodeId = docData.rootLevelIds;
          childId = "".concat(hostId, ".").concat(nodeId);

          if (nodeRef.nodeType === 1
          /* ElementNode */
          ) {
            nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
          } else if (nodeRef.nodeType === 3
          /* TextNode */
          ) {
            if (hostId === 0) {
              const textContent = nodeRef.nodeValue.trim();

              if (textContent === '') {
                // useless whitespace node at the document root
                orgLocationNode.remove();
                return;
              }
            }

            const commentBeforeTextNode = doc.createComment(childId);
            commentBeforeTextNode.nodeValue = "".concat(TEXT_NODE_ID, ".").concat(childId);
            nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
          }
        }

        let orgLocationNodeId = "".concat(ORG_LOCATION_ID, ".").concat(childId);
        const orgLocationParentNode = orgLocationNode.parentElement;

        if (orgLocationParentNode) {
          if (orgLocationParentNode['s-en'] === '') {
            // ending with a "." means that the parent element
            // of this node's original location is a SHADOW dom element
            // and this node is apart of the root level light dom
            orgLocationNodeId += ".";
          } else if (orgLocationParentNode['s-en'] === 'c') {
            // ending with a ".c" means that the parent element
            // of this node's original location is a SCOPED element
            // and this node is apart of the root level light dom
            orgLocationNodeId += ".c";
          }
        }

        orgLocationNode.nodeValue = orgLocationNodeId;
      }
    });
  }
};

exports.insertVdomAnnotations = insertVdomAnnotations;

const parseVNodeAnnotations = (doc, node, docData, orgLocationNodes) => {
  if (node == null) {
    return;
  }

  if (node['s-nr'] != null) {
    orgLocationNodes.push(node);
  }

  if (node.nodeType === 1
  /* ElementNode */
  ) {
    node.childNodes.forEach(childNode => {
      const hostRef = getHostRef(childNode);

      if (hostRef != null && !docData.staticComponents.has(childNode.nodeName.toLowerCase())) {
        const cmpData = {
          nodeIds: 0
        };
        insertVNodeAnnotations(doc, childNode, hostRef.$vnode$, docData, cmpData);
      }

      parseVNodeAnnotations(doc, childNode, docData, orgLocationNodes);
    });
  }
};

const insertVNodeAnnotations = (doc, hostElm, vnode, docData, cmpData) => {
  if (vnode != null) {
    const hostId = ++docData.hostIds;
    hostElm.setAttribute(HYDRATE_ID, hostId);

    if (hostElm['s-cr'] != null) {
      hostElm['s-cr'].nodeValue = "".concat(CONTENT_REF_ID, ".").concat(hostId);
    }

    if (vnode.$children$ != null) {
      const depth = 0;
      vnode.$children$.forEach((vnodeChild, index) => {
        insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
      });
    }

    if (hostElm && vnode && vnode.$elm$ && !hostElm.hasAttribute('c-id')) {
      const parent = hostElm.parentElement;

      if (parent && parent.childNodes) {
        const parentChildNodes = Array.from(parent.childNodes);
        const comment = parentChildNodes.find(node => node.nodeType === 8
        /* CommentNode */
        && node['s-sr']);

        if (comment) {
          const index = parentChildNodes.indexOf(hostElm) - 1;
          vnode.$elm$.setAttribute(HYDRATE_CHILD_ID, "".concat(comment['s-host-id'], ".").concat(comment['s-node-id'], ".0.").concat(index));
        }
      }
    }
  }
};

const insertChildVNodeAnnotations = (doc, vnodeChild, cmpData, hostId, depth, index) => {
  const childElm = vnodeChild.$elm$;

  if (childElm == null) {
    return;
  }

  const nodeId = cmpData.nodeIds++;
  const childId = "".concat(hostId, ".").concat(nodeId, ".").concat(depth, ".").concat(index);
  childElm['s-host-id'] = hostId;
  childElm['s-node-id'] = nodeId;

  if (childElm.nodeType === 1
  /* ElementNode */
  ) {
    childElm.setAttribute(HYDRATE_CHILD_ID, childId);
  } else if (childElm.nodeType === 3
  /* TextNode */
  ) {
    const parentNode = childElm.parentNode;
    const nodeName = parentNode.nodeName;

    if (nodeName !== 'STYLE' && nodeName !== 'SCRIPT') {
      const textNodeId = "".concat(TEXT_NODE_ID, ".").concat(childId);
      const commentBeforeTextNode = doc.createComment(textNodeId);
      parentNode.insertBefore(commentBeforeTextNode, childElm);
    }
  } else if (childElm.nodeType === 8
  /* CommentNode */
  ) {
    if (childElm['s-sr']) {
      const slotName = childElm['s-sn'] || '';
      const slotNodeId = "".concat(SLOT_NODE_ID, ".").concat(childId, ".").concat(slotName);
      childElm.nodeValue = slotNodeId;
    }
  }

  if (vnodeChild.$children$ != null) {
    const childDepth = depth + 1;
    vnodeChild.$children$.forEach((vnode, index) => {
      insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
    });
  }
};

const setPlatformOptions = opts => Object.assign(plt, opts);

exports.setPlatformOptions = setPlatformOptions;

const Fragment = (_, children) => children;

exports.Fragment = Fragment;
const hostRefs = new WeakMap();

const getHostRef = ref => hostRefs.get(ref);

exports.getHostRef = getHostRef;

const registerInstance = (lazyInstance, hostRef) => hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

exports.registerInstance = registerInstance;

const registerHost = (elm, cmpMeta) => {
  const hostRef = {
    $flags$: 0,
    $hostElement$: elm,
    $cmpMeta$: cmpMeta,
    $instanceValues$: new Map()
  };

  if (_appData.BUILD.isDev) {
    hostRef.$renderCount$ = 0;
  }

  if (_appData.BUILD.method && _appData.BUILD.lazyLoad) {
    hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
  }

  if (_appData.BUILD.asyncLoading) {
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    elm['s-p'] = [];
    elm['s-rc'] = [];
  }

  addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
  return hostRefs.set(elm, hostRef);
};

exports.registerHost = registerHost;

const isMemberInElement = (elm, memberName) => memberName in elm;

exports.isMemberInElement = isMemberInElement;

const consoleError = (e, el) => (customError || console.error)(e, el);

exports.consoleError = consoleError;
const STENCIL_DEV_MODE = _appData.BUILD.isTesting ? ['STENCIL:'] // E2E testing
: ['%cstencil', 'color: white;background:#4c47ff;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px'];
exports.STENCIL_DEV_MODE = STENCIL_DEV_MODE;

const consoleDevError = function consoleDevError() {
  for (var _len4 = arguments.length, m = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    m[_key4] = arguments[_key4];
  }

  return console.error(...STENCIL_DEV_MODE, ...m);
};

exports.consoleDevError = consoleDevError;

const consoleDevWarn = function consoleDevWarn() {
  for (var _len5 = arguments.length, m = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    m[_key5] = arguments[_key5];
  }

  return console.warn(...STENCIL_DEV_MODE, ...m);
};

exports.consoleDevWarn = consoleDevWarn;

const consoleDevInfo = function consoleDevInfo() {
  for (var _len6 = arguments.length, m = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    m[_key6] = arguments[_key6];
  }

  return console.info(...STENCIL_DEV_MODE, ...m);
};

exports.consoleDevInfo = consoleDevInfo;

const setErrorHandler = handler => customError = handler;

exports.setErrorHandler = setErrorHandler;
const cmpModules = /*@__PURE__*/new Map();
exports.cmpModules = cmpModules;

const loadModule = (cmpMeta, hostRef, hmrVersionId) => {
  // loadModuleImport
  const exportName = cmpMeta.$tagName$.replace(/-/g, '_');
  const bundleId = cmpMeta.$lazyBundleId$;

  if (_appData.BUILD.isDev && typeof bundleId !== 'string') {
    consoleDevError("Trying to lazily load component <".concat(cmpMeta.$tagName$, "> with style mode \"").concat(hostRef.$modeName$, "\", but it does not exist."));
    return undefined;
  }

  const module = !_appData.BUILD.hotModuleReplacement ? cmpModules.get(bundleId) : false;

  if (module) {
    return module[exportName];
  }

  return Promise.resolve("./".concat(bundleId, ".entry.js").concat(_appData.BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : '')).then(s => _interopRequireWildcard(require(s))).then(importedModule => {
    if (!_appData.BUILD.hotModuleReplacement) {
      cmpModules.set(bundleId, importedModule);
    }

    return importedModule[exportName];
  }, consoleError);
};

exports.loadModule = loadModule;
const styles = new Map();
exports.styles = styles;
const modeResolutionChain = [];
exports.modeResolutionChain = modeResolutionChain;
const queueDomReads = [];
const queueDomWrites = [];
const queueDomWritesLow = [];

const queueTask = (queue, write) => cb => {
  queue.push(cb);

  if (!queuePending) {
    queuePending = true;

    if (write && plt.$flags$ & 4
    /* queueSync */
    ) {
      nextTick(flush);
    } else {
      plt.raf(flush);
    }
  }
};

const consume = queue => {
  for (let i = 0; i < queue.length; i++) {
    try {
      queue[i](performance.now());
    } catch (e) {
      consoleError(e);
    }
  }

  queue.length = 0;
};

const consumeTimeout = (queue, timeout) => {
  let i = 0;
  let ts = 0;

  while (i < queue.length && (ts = performance.now()) < timeout) {
    try {
      queue[i++](ts);
    } catch (e) {
      consoleError(e);
    }
  }

  if (i === queue.length) {
    queue.length = 0;
  } else if (i !== 0) {
    queue.splice(0, i);
  }
};

const flush = () => {
  if (_appData.BUILD.asyncQueue) {
    queueCongestion++;
  } // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time
  // DOM READS!!!


  consume(queueDomReads); // DOM WRITES!!!

  if (_appData.BUILD.asyncQueue) {
    const timeout = (plt.$flags$ & 6
    /* queueMask */
    ) === 2
    /* appLoaded */
    ? performance.now() + 14 * Math.ceil(queueCongestion * (1.0 / 10.0)) : Infinity;
    consumeTimeout(queueDomWrites, timeout);
    consumeTimeout(queueDomWritesLow, timeout);

    if (queueDomWrites.length > 0) {
      queueDomWritesLow.push(...queueDomWrites);
      queueDomWrites.length = 0;
    }

    if (queuePending = queueDomReads.length + queueDomWrites.length + queueDomWritesLow.length > 0) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next tick
      plt.raf(flush);
    } else {
      queueCongestion = 0;
    }
  } else {
    consume(queueDomWrites);

    if (queuePending = queueDomReads.length > 0) {
      // still more to do yet, but we've run out of time
      // let's let this thing cool off and try again in the next tick
      plt.raf(flush);
    }
  }
};

const nextTick = /*@__PURE__*/cb => promiseResolve().then(cb);

exports.nextTick = nextTick;
const readTask = /*@__PURE__*/queueTask(queueDomReads, false);
exports.readTask = readTask;
const writeTask = /*@__PURE__*/queueTask(queueDomWrites, true);
exports.writeTask = writeTask;
const Build = {
  isDev: _appData.BUILD.isDev ? true : false,
  isBrowser: true,
  isServer: false,
  isTesting: _appData.BUILD.isTesting ? true : false
};
exports.Build = Build;

},{"./shadow-css.js":5,"@stencil/core/internal/app-data":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scopeCss = void 0;

/*
 Stencil Client Platform v2.15.0 | MIT Licensed | https://stenciljs.com
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 * https://github.com/angular/angular/blob/master/packages/compiler/src/shadow_css.ts
 */
const safeSelector = selector => {
  const placeholders = [];
  let index = 0;
  let content; // Replaces attribute selectors with placeholders.
  // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.

  selector = selector.replace(/(\[[^\]]*\])/g, (_, keep) => {
    const replaceBy = "__ph-".concat(index, "__");
    placeholders.push(keep);
    index++;
    return replaceBy;
  }); // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
  // WS and "+" would otherwise be interpreted as selector separators.

  content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, (_, pseudo, exp) => {
    const replaceBy = "__ph-".concat(index, "__");
    placeholders.push(exp);
    index++;
    return pseudo + replaceBy;
  });
  const ss = {
    content,
    placeholders
  };
  return ss;
};

const restoreSafeSelector = (placeholders, content) => {
  return content.replace(/__ph-(\d+)__/g, (_, index) => placeholders[+index]);
};

const _polyfillHost = '-shadowcsshost';
const _polyfillSlotted = '-shadowcssslotted'; // note: :host-context pre-processed to -shadowcsshostcontext.

const _polyfillHostContext = '-shadowcsscontext';

const _parenSuffix = ')(?:\\((' + '(?:\\([^)(]*\\)|[^)(]*)+?' + ')\\))?([^,{]*)';

const _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');

const _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');

const _cssColonSlottedRe = new RegExp('(' + _polyfillSlotted + _parenSuffix, 'gim');

const _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';

const _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
const _shadowDOMSelectorsRe = [/::shadow/g, /::content/g];
const _selectorReSuffix = '([>\\s~+[.,{:][\\s\\S]*)?$';
const _polyfillHostRe = /-shadowcsshost/gim;
const _colonHostRe = /:host/gim;
const _colonSlottedRe = /::slotted/gim;
const _colonHostContextRe = /:host-context/gim;
const _commentRe = /\/\*\s*[\s\S]*?\*\//g;

const stripComments = input => {
  return input.replace(_commentRe, '');
};

const _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g;

const extractCommentsWithHash = input => {
  return input.match(_commentWithHashRe) || [];
};

const _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
const _curlyRe = /([{}])/g;
const _selectorPartsRe = /(^.*?[^\\])??((:+)(.*)|$)/;
const OPEN_CURLY = '{';
const CLOSE_CURLY = '}';
const BLOCK_PLACEHOLDER = '%BLOCK%';

const processRules = (input, ruleCallback) => {
  const inputWithEscapedBlocks = escapeBlocks(input);
  let nextBlockIndex = 0;
  return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
    const selector = arguments.length <= 2 ? undefined : arguments[2];
    let content = '';
    let suffix = arguments.length <= 4 ? undefined : arguments[4];
    let contentPrefix = '';

    if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
      content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
      suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
      contentPrefix = '{';
    }

    const cssRule = {
      selector,
      content
    };
    const rule = ruleCallback(cssRule);
    return "".concat(arguments.length <= 1 ? undefined : arguments[1]).concat(rule.selector).concat(arguments.length <= 3 ? undefined : arguments[3]).concat(contentPrefix).concat(rule.content).concat(suffix);
  });
};

const escapeBlocks = input => {
  const inputParts = input.split(_curlyRe);
  const resultParts = [];
  const escapedBlocks = [];
  let bracketCount = 0;
  let currentBlockParts = [];

  for (let partIndex = 0; partIndex < inputParts.length; partIndex++) {
    const part = inputParts[partIndex];

    if (part === CLOSE_CURLY) {
      bracketCount--;
    }

    if (bracketCount > 0) {
      currentBlockParts.push(part);
    } else {
      if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
        currentBlockParts = [];
      }

      resultParts.push(part);
    }

    if (part === OPEN_CURLY) {
      bracketCount++;
    }
  }

  if (currentBlockParts.length > 0) {
    escapedBlocks.push(currentBlockParts.join(''));
    resultParts.push(BLOCK_PLACEHOLDER);
  }

  const strEscapedBlocks = {
    escapedString: resultParts.join(''),
    blocks: escapedBlocks
  };
  return strEscapedBlocks;
};

const insertPolyfillHostInCssText = selector => {
  selector = selector.replace(_colonHostContextRe, _polyfillHostContext).replace(_colonHostRe, _polyfillHost).replace(_colonSlottedRe, _polyfillSlotted);
  return selector;
};

const convertColonRule = (cssText, regExp, partReplacer) => {
  // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
  return cssText.replace(regExp, function () {
    for (var _len = arguments.length, m = new Array(_len), _key = 0; _key < _len; _key++) {
      m[_key] = arguments[_key];
    }

    if (m[2]) {
      const parts = m[2].split(',');
      const r = [];

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i].trim();
        if (!p) break;
        r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
      }

      return r.join(',');
    } else {
      return _polyfillHostNoCombinator + m[3];
    }
  });
};

const colonHostPartReplacer = (host, part, suffix) => {
  return host + part.replace(_polyfillHost, '') + suffix;
};

const convertColonHost = cssText => {
  return convertColonRule(cssText, _cssColonHostRe, colonHostPartReplacer);
};

const colonHostContextPartReplacer = (host, part, suffix) => {
  if (part.indexOf(_polyfillHost) > -1) {
    return colonHostPartReplacer(host, part, suffix);
  } else {
    return host + part + suffix + ', ' + part + ' ' + host + suffix;
  }
};

const convertColonSlotted = (cssText, slotScopeId) => {
  const slotClass = '.' + slotScopeId + ' > ';
  const selectors = [];
  cssText = cssText.replace(_cssColonSlottedRe, function () {
    for (var _len2 = arguments.length, m = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      m[_key2] = arguments[_key2];
    }

    if (m[2]) {
      const compound = m[2].trim();
      const suffix = m[3];
      const slottedSelector = slotClass + compound + suffix;
      let prefixSelector = '';

      for (let i = m[4] - 1; i >= 0; i--) {
        const char = m[5][i];

        if (char === '}' || char === ',') {
          break;
        }

        prefixSelector = char + prefixSelector;
      }

      const orgSelector = prefixSelector + slottedSelector;
      const addedSelector = "".concat(prefixSelector.trimRight()).concat(slottedSelector.trim());

      if (orgSelector.trim() !== addedSelector.trim()) {
        const updatedSelector = "".concat(addedSelector, ", ").concat(orgSelector);
        selectors.push({
          orgSelector,
          updatedSelector
        });
      }

      return slottedSelector;
    } else {
      return _polyfillHostNoCombinator + m[3];
    }
  });
  return {
    selectors,
    cssText
  };
};

const convertColonHostContext = cssText => {
  return convertColonRule(cssText, _cssColonHostContextRe, colonHostContextPartReplacer);
};

const convertShadowDOMSelectors = cssText => {
  return _shadowDOMSelectorsRe.reduce((result, pattern) => result.replace(pattern, ' '), cssText);
};

const makeScopeMatcher = scopeSelector => {
  const lre = /\[/g;
  const rre = /\]/g;
  scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
  return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
};

const selectorNeedsScoping = (selector, scopeSelector) => {
  const re = makeScopeMatcher(scopeSelector);
  return !re.test(selector);
};

const injectScopingSelector = (selector, scopingSelector) => {
  return selector.replace(_selectorPartsRe, function (_) {
    let before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    let _colonGroup = arguments.length > 2 ? arguments[2] : undefined;

    let colon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    let after = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    return before + scopingSelector + colon + after;
  });
};

const applySimpleSelectorScope = (selector, scopeSelector, hostSelector) => {
  // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
  _polyfillHostRe.lastIndex = 0;

  if (_polyfillHostRe.test(selector)) {
    const replaceBy = ".".concat(hostSelector);
    return selector.replace(_polyfillHostNoCombinatorRe, (_, selector) => injectScopingSelector(selector, replaceBy)).replace(_polyfillHostRe, replaceBy + ' ');
  }

  return scopeSelector + ' ' + selector;
};

const applyStrictSelectorScope = (selector, scopeSelector, hostSelector) => {
  const isRe = /\[is=([^\]]*)\]/g;
  scopeSelector = scopeSelector.replace(isRe, function (_) {
    return arguments.length <= 1 ? undefined : arguments[1];
  });
  const className = '.' + scopeSelector;

  const _scopeSelectorPart = p => {
    let scopedP = p.trim();

    if (!scopedP) {
      return '';
    }

    if (p.indexOf(_polyfillHostNoCombinator) > -1) {
      scopedP = applySimpleSelectorScope(p, scopeSelector, hostSelector);
    } else {
      // remove :host since it should be unnecessary
      const t = p.replace(_polyfillHostRe, '');

      if (t.length > 0) {
        scopedP = injectScopingSelector(t, className);
      }
    }

    return scopedP;
  };

  const safeContent = safeSelector(selector);
  selector = safeContent.content;
  let scopedSelector = '';
  let startIndex = 0;
  let res;
  const sep = /( |>|\+|~(?!=))\s*/g; // If a selector appears before :host it should not be shimmed as it
  // matches on ancestor elements and not on elements in the host's shadow
  // `:host-context(div)` is transformed to
  // `-shadowcsshost-no-combinatordiv, div -shadowcsshost-no-combinator`
  // the `div` is not part of the component in the 2nd selectors and should not be scoped.
  // Historically `component-tag:host` was matching the component so we also want to preserve
  // this behavior to avoid breaking legacy apps (it should not match).
  // The behavior should be:
  // - `tag:host` -> `tag[h]` (this is to avoid breaking legacy apps, should not match anything)
  // - `tag :host` -> `tag [h]` (`tag` is not scoped because it's considered part of a
  //   `:host-context(tag)`)

  const hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1; // Only scope parts after the first `-shadowcsshost-no-combinator` when it is present

  let shouldScope = !hasHost;

  while ((res = sep.exec(selector)) !== null) {
    const separator = res[1];
    const part = selector.slice(startIndex, res.index).trim();
    shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
    const scopedPart = shouldScope ? _scopeSelectorPart(part) : part;
    scopedSelector += "".concat(scopedPart, " ").concat(separator, " ");
    startIndex = sep.lastIndex;
  }

  const part = selector.substring(startIndex);
  shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
  scopedSelector += shouldScope ? _scopeSelectorPart(part) : part; // replace the placeholders with their original values

  return restoreSafeSelector(safeContent.placeholders, scopedSelector);
};

const scopeSelector = (selector, scopeSelectorText, hostSelector, slotSelector) => {
  return selector.split(',').map(shallowPart => {
    if (slotSelector && shallowPart.indexOf('.' + slotSelector) > -1) {
      return shallowPart.trim();
    }

    if (selectorNeedsScoping(shallowPart, scopeSelectorText)) {
      return applyStrictSelectorScope(shallowPart, scopeSelectorText, hostSelector).trim();
    } else {
      return shallowPart.trim();
    }
  }).join(', ');
};

const scopeSelectors = (cssText, scopeSelectorText, hostSelector, slotSelector, commentOriginalSelector) => {
  return processRules(cssText, rule => {
    let selector = rule.selector;
    let content = rule.content;

    if (rule.selector[0] !== '@') {
      selector = scopeSelector(rule.selector, scopeSelectorText, hostSelector, slotSelector);
    } else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') || rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
      content = scopeSelectors(rule.content, scopeSelectorText, hostSelector, slotSelector);
    }

    const cssRule = {
      selector: selector.replace(/\s{2,}/g, ' ').trim(),
      content
    };
    return cssRule;
  });
};

const scopeCssText = (cssText, scopeId, hostScopeId, slotScopeId, commentOriginalSelector) => {
  cssText = insertPolyfillHostInCssText(cssText);
  cssText = convertColonHost(cssText);
  cssText = convertColonHostContext(cssText);
  const slotted = convertColonSlotted(cssText, slotScopeId);
  cssText = slotted.cssText;
  cssText = convertShadowDOMSelectors(cssText);

  if (scopeId) {
    cssText = scopeSelectors(cssText, scopeId, hostScopeId, slotScopeId);
  }

  cssText = cssText.replace(/-shadowcsshost-no-combinator/g, ".".concat(hostScopeId));
  cssText = cssText.replace(/>\s*\*\s+([^{, ]+)/gm, ' $1 ');
  return {
    cssText: cssText.trim(),
    slottedSelectors: slotted.selectors
  };
};

const scopeCss = (cssText, scopeId, commentOriginalSelector) => {
  const hostScopeId = scopeId + '-h';
  const slotScopeId = scopeId + '-s';
  const commentsWithHash = extractCommentsWithHash(cssText);
  cssText = stripComments(cssText);
  const orgSelectors = [];

  if (commentOriginalSelector) {
    const processCommentedSelector = rule => {
      const placeholder = "/*!@___".concat(orgSelectors.length, "___*/");
      const comment = "/*!@".concat(rule.selector, "*/");
      orgSelectors.push({
        placeholder,
        comment
      });
      rule.selector = placeholder + rule.selector;
      return rule;
    };

    cssText = processRules(cssText, rule => {
      if (rule.selector[0] !== '@') {
        return processCommentedSelector(rule);
      } else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') || rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
        rule.content = processRules(rule.content, processCommentedSelector);
        return rule;
      }

      return rule;
    });
  }

  const scoped = scopeCssText(cssText, scopeId, hostScopeId, slotScopeId);
  cssText = [scoped.cssText, ...commentsWithHash].join('\n');

  if (commentOriginalSelector) {
    orgSelectors.forEach(_ref => {
      let {
        placeholder,
        comment
      } = _ref;
      cssText = cssText.replace(placeholder, comment);
    });
  }

  scoped.slottedSelectors.forEach(slottedSelector => {
    cssText = cssText.replace(slottedSelector.orgSelector, slottedSelector.updatedSelector);
  });
  return cssText;
};

exports.scopeCss = scopeCss;

},{}],6:[function(require,module,exports){
(function (global){(function (){
"use strict";

// ------------------------------------------
// Rellax.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Rellax = factory();
  }
})(typeof window !== "undefined" ? window : global, function () {
  var Rellax = function Rellax(el, options) {
    "use strict";

    var self = Object.create(Rellax.prototype);
    var posY = 0;
    var screenY = 0;
    var posX = 0;
    var screenX = 0;
    var blocks = [];
    var pause = true; // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event

    var loop = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
      return setTimeout(callback, 1000 / 60);
    }; // store the id for later use


    var loopId = null; // Test via a getter in the options object to see if the passive property is accessed

    var supportsPassive = false;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
        }
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {} // check what cancelAnimation method to use


    var clearLoop = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout; // check which transform property to use

    var transformProp = window.transformProp || function () {
      var testEl = document.createElement('div');

      if (testEl.style.transform === null) {
        var vendors = ['Webkit', 'Moz', 'ms'];

        for (var vendor in vendors) {
          if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
            return vendors[vendor] + 'Transform';
          }
        }
      }

      return 'transform';
    }(); // Default Settings


    self.options = {
      speed: -2,
      verticalSpeed: null,
      horizontalSpeed: null,
      breakpoints: [576, 768, 1201],
      center: false,
      wrapper: null,
      relativeToWrapper: false,
      round: true,
      vertical: true,
      horizontal: false,
      verticalScrollAxis: "y",
      horizontalScrollAxis: "x",
      callback: function callback() {}
    }; // User defined options (might have more in the future)

    if (options) {
      Object.keys(options).forEach(function (key) {
        self.options[key] = options[key];
      });
    }

    function validateCustomBreakpoints() {
      if (self.options.breakpoints.length === 3 && Array.isArray(self.options.breakpoints)) {
        var isAscending = true;
        var isNumerical = true;
        var lastVal;
        self.options.breakpoints.forEach(function (i) {
          if (typeof i !== 'number') isNumerical = false;

          if (lastVal !== null) {
            if (i < lastVal) isAscending = false;
          }

          lastVal = i;
        });
        if (isAscending && isNumerical) return;
      } // revert defaults if set incorrectly


      self.options.breakpoints = [576, 768, 1201];
      console.warn("Rellax: You must pass an array of 3 numbers in ascending order to the breakpoints option. Defaults reverted");
    }

    if (options && options.breakpoints) {
      validateCustomBreakpoints();
    } // By default, rellax class


    if (!el) {
      el = '.rellax';
    } // check if el is a className or a node


    var elements = typeof el === 'string' ? document.querySelectorAll(el) : [el]; // Now query selector

    if (elements.length > 0) {
      self.elems = elements;
    } // The elements don't exist
    else {
      console.warn("Rellax: The elements you're trying to select don't exist.");
      return;
    } // Has a wrapper and it exists


    if (self.options.wrapper) {
      if (!self.options.wrapper.nodeType) {
        var wrapper = document.querySelector(self.options.wrapper);

        if (wrapper) {
          self.options.wrapper = wrapper;
        } else {
          console.warn("Rellax: The wrapper you're trying to use doesn't exist.");
          return;
        }
      }
    } // set a placeholder for the current breakpoint


    var currentBreakpoint; // helper to determine current breakpoint

    var getCurrentBreakpoint = function getCurrentBreakpoint(w) {
      var bp = self.options.breakpoints;
      if (w < bp[0]) return 'xs';
      if (w >= bp[0] && w < bp[1]) return 'sm';
      if (w >= bp[1] && w < bp[2]) return 'md';
      return 'lg';
    }; // Get and cache initial position of all elements


    var cacheBlocks = function cacheBlocks() {
      for (var i = 0; i < self.elems.length; i++) {
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }
    }; // Let's kick this script off
    // Build array for cached element values


    var init = function init() {
      for (var i = 0; i < blocks.length; i++) {
        self.elems[i].style.cssText = blocks[i].style;
      }

      blocks = [];
      screenY = window.innerHeight;
      screenX = window.innerWidth;
      currentBreakpoint = getCurrentBreakpoint(screenX);
      setPosition();
      cacheBlocks();
      animate(); // If paused, unpause and set listener for window resizing events

      if (pause) {
        window.addEventListener('resize', init);
        pause = false; // Start the loop

        update();
      }
    }; // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values


    var createBlock = function createBlock(el) {
      var dataPercentage = el.getAttribute('data-rellax-percentage');
      var dataSpeed = el.getAttribute('data-rellax-speed');
      var dataXsSpeed = el.getAttribute('data-rellax-xs-speed');
      var dataMobileSpeed = el.getAttribute('data-rellax-mobile-speed');
      var dataTabletSpeed = el.getAttribute('data-rellax-tablet-speed');
      var dataDesktopSpeed = el.getAttribute('data-rellax-desktop-speed');
      var dataVerticalSpeed = el.getAttribute('data-rellax-vertical-speed');
      var dataHorizontalSpeed = el.getAttribute('data-rellax-horizontal-speed');
      var dataVericalScrollAxis = el.getAttribute('data-rellax-vertical-scroll-axis');
      var dataHorizontalScrollAxis = el.getAttribute('data-rellax-horizontal-scroll-axis');
      var dataZindex = el.getAttribute('data-rellax-zindex') || 0;
      var dataMin = el.getAttribute('data-rellax-min');
      var dataMax = el.getAttribute('data-rellax-max');
      var dataMinX = el.getAttribute('data-rellax-min-x');
      var dataMaxX = el.getAttribute('data-rellax-max-x');
      var dataMinY = el.getAttribute('data-rellax-min-y');
      var dataMaxY = el.getAttribute('data-rellax-max-y');
      var mapBreakpoints;
      var breakpoints = true;

      if (!dataXsSpeed && !dataMobileSpeed && !dataTabletSpeed && !dataDesktopSpeed) {
        breakpoints = false;
      } else {
        mapBreakpoints = {
          'xs': dataXsSpeed,
          'sm': dataMobileSpeed,
          'md': dataTabletSpeed,
          'lg': dataDesktopSpeed
        };
      } // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
      // ensures elements are positioned based on HTML layout.
      //
      // If the element has the percentage attribute, the posY and posX needs to be
      // the current scroll position's value, so that the elements are still positioned based on HTML layout


      var wrapperPosY = self.options.wrapper ? self.options.wrapper.scrollTop : window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; // If the option relativeToWrapper is true, use the wrappers offset to top, subtracted from the current page scroll.

      if (self.options.relativeToWrapper) {
        var scrollPosY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        wrapperPosY = scrollPosY - self.options.wrapper.offsetTop;
      }

      var posY = self.options.vertical ? dataPercentage || self.options.center ? wrapperPosY : 0 : 0;
      var posX = self.options.horizontal ? dataPercentage || self.options.center ? self.options.wrapper ? self.options.wrapper.scrollLeft : window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft : 0 : 0;
      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;
      var blockLeft = posX + el.getBoundingClientRect().left;
      var blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth; // apparently parallax equation everyone uses

      var percentageY = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY);
      var percentageX = dataPercentage ? dataPercentage : (posX - blockLeft + screenX) / (blockWidth + screenX);

      if (self.options.center) {
        percentageX = 0.5;
        percentageY = 0.5;
      } // Optional individual block speed as data attr, otherwise global speed


      var speed = breakpoints && mapBreakpoints[currentBreakpoint] !== null ? Number(mapBreakpoints[currentBreakpoint]) : dataSpeed ? dataSpeed : self.options.speed;
      var verticalSpeed = dataVerticalSpeed ? dataVerticalSpeed : self.options.verticalSpeed;
      var horizontalSpeed = dataHorizontalSpeed ? dataHorizontalSpeed : self.options.horizontalSpeed; // Optional individual block movement axis direction as data attr, otherwise gobal movement direction

      var verticalScrollAxis = dataVericalScrollAxis ? dataVericalScrollAxis : self.options.verticalScrollAxis;
      var horizontalScrollAxis = dataHorizontalScrollAxis ? dataHorizontalScrollAxis : self.options.horizontalScrollAxis;
      var bases = updatePosition(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed); // ~~Store non-translate3d transforms~~
      // Store inline styles and extract transforms

      var style = el.style.cssText;
      var transform = ''; // Check if there's an inline styled transform

      var searchResult = /transform\s*:/i.exec(style);

      if (searchResult) {
        // Get the index of the transform
        var index = searchResult.index; // Trim the style to the transform point and get the following semi-colon index

        var trimmedStyle = style.slice(index);
        var delimiter = trimmedStyle.indexOf(';'); // Remove "transform" string and save the attribute

        if (delimiter) {
          transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
        } else {
          transform = " " + trimmedStyle.slice(11).replace(/\s/g, '');
        }
      }

      return {
        baseX: bases.x,
        baseY: bases.y,
        top: blockTop,
        left: blockLeft,
        height: blockHeight,
        width: blockWidth,
        speed: speed,
        verticalSpeed: verticalSpeed,
        horizontalSpeed: horizontalSpeed,
        verticalScrollAxis: verticalScrollAxis,
        horizontalScrollAxis: horizontalScrollAxis,
        style: style,
        transform: transform,
        zindex: dataZindex,
        min: dataMin,
        max: dataMax,
        minX: dataMinX,
        maxX: dataMaxX,
        minY: dataMinY,
        maxY: dataMaxY
      };
    }; // set scroll position (posY, posX)
    // side effect method is not ideal, but okay for now
    // returns true if the scroll changed, false if nothing happened


    var setPosition = function setPosition() {
      var oldY = posY;
      var oldX = posX;
      posY = self.options.wrapper ? self.options.wrapper.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
      posX = self.options.wrapper ? self.options.wrapper.scrollLeft : (document.documentElement || document.body.parentNode || document.body).scrollLeft || window.pageXOffset; // If option relativeToWrapper is true, use relative wrapper value instead.

      if (self.options.relativeToWrapper) {
        var scrollPosY = (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;
        posY = scrollPosY - self.options.wrapper.offsetTop;
      }

      if (oldY != posY && self.options.vertical) {
        // scroll changed, return true
        return true;
      }

      if (oldX != posX && self.options.horizontal) {
        // scroll changed, return true
        return true;
      } // scroll did not change


      return false;
    }; // Ahh a pure function, gets new transform value
    // based on scrollPosition and speed
    // Allow for decimal pixel values


    var updatePosition = function updatePosition(percentageX, percentageY, speed, verticalSpeed, horizontalSpeed) {
      var result = {};
      var valueX = (horizontalSpeed ? horizontalSpeed : speed) * (100 * (1 - percentageX));
      var valueY = (verticalSpeed ? verticalSpeed : speed) * (100 * (1 - percentageY));
      result.x = self.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
      result.y = self.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;
      return result;
    }; // Remove event listeners and loop again


    var deferredUpdate = function deferredUpdate() {
      window.removeEventListener('resize', deferredUpdate);
      window.removeEventListener('orientationchange', deferredUpdate);
      (self.options.wrapper ? self.options.wrapper : window).removeEventListener('scroll', deferredUpdate);
      (self.options.wrapper ? self.options.wrapper : document).removeEventListener('touchmove', deferredUpdate); // loop again

      loopId = loop(update);
    }; // Loop


    var update = function update() {
      if (setPosition() && pause === false) {
        animate(); // loop again

        loopId = loop(update);
      } else {
        loopId = null; // Don't animate until we get a position updating event

        window.addEventListener('resize', deferredUpdate);
        window.addEventListener('orientationchange', deferredUpdate);
        (self.options.wrapper ? self.options.wrapper : window).addEventListener('scroll', deferredUpdate, supportsPassive ? {
          passive: true
        } : false);
        (self.options.wrapper ? self.options.wrapper : document).addEventListener('touchmove', deferredUpdate, supportsPassive ? {
          passive: true
        } : false);
      }
    }; // Transform3d on parallax element


    var animate = function animate() {
      var positions;

      for (var i = 0; i < self.elems.length; i++) {
        // Determine relevant movement directions
        var verticalScrollAxis = blocks[i].verticalScrollAxis.toLowerCase();
        var horizontalScrollAxis = blocks[i].horizontalScrollAxis.toLowerCase();
        var verticalScrollX = verticalScrollAxis.indexOf("x") != -1 ? posY : 0;
        var verticalScrollY = verticalScrollAxis.indexOf("y") != -1 ? posY : 0;
        var horizontalScrollX = horizontalScrollAxis.indexOf("x") != -1 ? posX : 0;
        var horizontalScrollY = horizontalScrollAxis.indexOf("y") != -1 ? posX : 0;
        var percentageY = (verticalScrollY + horizontalScrollY - blocks[i].top + screenY) / (blocks[i].height + screenY);
        var percentageX = (verticalScrollX + horizontalScrollX - blocks[i].left + screenX) / (blocks[i].width + screenX); // Subtracting initialize value, so element stays in same spot as HTML

        positions = updatePosition(percentageX, percentageY, blocks[i].speed, blocks[i].verticalSpeed, blocks[i].horizontalSpeed);
        var positionY = positions.y - blocks[i].baseY;
        var positionX = positions.x - blocks[i].baseX; // The next two "if" blocks go like this:
        // Check if a limit is defined (first "min", then "max");
        // Check if we need to change the Y or the X
        // (Currently working only if just one of the axes is enabled)
        // Then, check if the new position is inside the allowed limit
        // If so, use new position. If not, set position to limit.
        // Check if a min limit is defined

        if (blocks[i].min !== null) {
          if (self.options.vertical && !self.options.horizontal) {
            positionY = positionY <= blocks[i].min ? blocks[i].min : positionY;
          }

          if (self.options.horizontal && !self.options.vertical) {
            positionX = positionX <= blocks[i].min ? blocks[i].min : positionX;
          }
        } // Check if directional min limits are defined


        if (blocks[i].minY != null) {
          positionY = positionY <= blocks[i].minY ? blocks[i].minY : positionY;
        }

        if (blocks[i].minX != null) {
          positionX = positionX <= blocks[i].minX ? blocks[i].minX : positionX;
        } // Check if a max limit is defined


        if (blocks[i].max !== null) {
          if (self.options.vertical && !self.options.horizontal) {
            positionY = positionY >= blocks[i].max ? blocks[i].max : positionY;
          }

          if (self.options.horizontal && !self.options.vertical) {
            positionX = positionX >= blocks[i].max ? blocks[i].max : positionX;
          }
        } // Check if directional max limits are defined


        if (blocks[i].maxY != null) {
          positionY = positionY >= blocks[i].maxY ? blocks[i].maxY : positionY;
        }

        if (blocks[i].maxX != null) {
          positionX = positionX >= blocks[i].maxX ? blocks[i].maxX : positionX;
        }

        var zindex = blocks[i].zindex; // Move that element
        // (Set the new translation and append initial inline transforms.)

        var translate = 'translate3d(' + (self.options.horizontal ? positionX : '0') + 'px,' + (self.options.vertical ? positionY : '0') + 'px,' + zindex + 'px) ' + blocks[i].transform;
        self.elems[i].style[transformProp] = translate;
      }

      self.options.callback(positions);
    };

    self.destroy = function () {
      for (var i = 0; i < self.elems.length; i++) {
        self.elems[i].style.cssText = blocks[i].style;
      } // Remove resize event listener if not pause, and pause


      if (!pause) {
        window.removeEventListener('resize', init);
        pause = true;
      } // Clear the animation loop to prevent possible memory leak


      clearLoop(loopId);
      loopId = null;
    }; // Init


    init(); // Allow to recalculate the initial values whenever we want

    self.refresh = init;
    return self;
  };

  return Rellax;
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const themeToggle_1 = require("./modules/themeToggle");

const themeAutodetect_1 = require("./modules/themeAutodetect");

const parallax_1 = require("./modules/parallax");

const portfolioMenu_1 = require("./modules/portfolioMenu");

const backToTop_1 = require("./modules/backToTop");

const anchorSmoothScroll_1 = require("./modules/anchorSmoothScroll");

const pageLoader_1 = require("./modules/pageLoader");

const switchUrls_1 = require("./modules/switchUrls");

const aero_card_1 = require("@ohkimur/aero/dist/components/aero-card");

const aero_grid_1 = require("@ohkimur/aero/dist/components/aero-grid"); // Wait for the DOM to be loaded.


window.addEventListener("DOMContentLoaded", _event => {
  (0, themeAutodetect_1.themeAutodetect)();
  (0, switchUrls_1.switchUrls)();
  (0, themeToggle_1.themeToggle)();
  (0, parallax_1.initParallax)();
  (0, backToTop_1.initBackToTop)();
  (0, portfolioMenu_1.initPortfolioMenu)("portfolioMenu");
  (0, pageLoader_1.initPageLoader)();
  (0, anchorSmoothScroll_1.addSmoothScrollingToAnchors)();
  customElements.define("aero-card", aero_card_1.AeroCard);
  customElements.define("aero-grid", aero_grid_1.AeroGrid);
});

},{"./modules/anchorSmoothScroll":8,"./modules/backToTop":9,"./modules/pageLoader":11,"./modules/parallax":12,"./modules/portfolioMenu":13,"./modules/switchUrls":14,"./modules/themeAutodetect":15,"./modules/themeToggle":16,"@ohkimur/aero/dist/components/aero-card":1,"@ohkimur/aero/dist/components/aero-grid":2}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSmoothScrollingToAnchors = void 0;

function addSmoothScrollingToAnchors() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', anchorSmoothScroll);
  });
}

exports.addSmoothScrollingToAnchors = addSmoothScrollingToAnchors;

function anchorSmoothScroll(event) {
  event.preventDefault();
  const destinationName = this.getAttribute('href');

  if (destinationName && destinationName != '#') {
    const destinationEl = document.querySelector(destinationName);

    if (destinationEl) {
      destinationEl.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBackToTop = void 0;
const backToTopButton = document.querySelector('.button.back-to-top');

function initBackToTop() {
  window.addEventListener('scroll', makeBackToTopButtonVisible);
}

exports.initBackToTop = initBackToTop;

function makeBackToTopButtonVisible(_event) {
  if (backToTopButton) {
    if (document.body.scrollTop >= window.innerHeight || document.documentElement.scrollTop >= window.innerHeight) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  }
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eraseCookie = exports.getCookie = exports.setCookie = void 0;

function setCookie(name, value, days) {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

exports.setCookie = setCookie;

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

exports.getCookie = getCookie;

function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

exports.eraseCookie = eraseCookie;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPageLoader = void 0;
const pageLoader = document.querySelector('.page-loader');

function initPageLoader() {
  if (pageLoader) {
    pageLoader.classList.add('done');
  }
}

exports.initPageLoader = initPageLoader;

},{}],12:[function(require,module,exports){
"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initParallax = void 0;

const rellax_1 = __importDefault(require("rellax"));

function initParallax() {
  const rellax = (0, rellax_1.default)('.rellax', {
    horizontal: false,
    callback: function callback(_pos) {
      if (this.breakpoints) {
        updateOpacity(this.breakpoints);
      }
    }
  });
}

exports.initParallax = initParallax;

function updateOpacity(breakpoints) {
  const rellaxElems = document.querySelectorAll('.rellax');
  const currentScrollPosition = window.pageYOffset;
  const scrollingArea = window.document.documentElement.scrollHeight - window.innerHeight;
  const scrollPositionPercent = currentScrollPosition / scrollingArea;
  const currentBreakpoint = getCurrentBreakpoint(breakpoints, window.innerWidth);
  rellaxElems.forEach(rellaxElem => {
    const opacitySeed = getElOpacitySeed(rellaxElem, currentBreakpoint);

    if (opacitySeed > 0) {
      rellaxElem.style.opacity = (1 - scrollPositionPercent * opacitySeed).toString();
    }
  });
}

function getCurrentBreakpoint(breakpoints, width) {
  if (width < breakpoints[0]) return 'xs';
  if (width >= breakpoints[0] && width < breakpoints[1]) return 'sm';
  if (width >= breakpoints[1] && width < breakpoints[2]) return 'md';
  return 'lg';
}

;

function getElOpacitySeed(el, currentBreakpoint) {
  if (el.hasAttribute('data-rellax-' + currentBreakpoint + '-opacity-seed')) {
    return Number(el.getAttribute('data-rellax-' + currentBreakpoint + '-opacity-seed'));
  } else if (el.hasAttribute('data-rellax-opacity-seed')) {
    return Number(el.getAttribute('data-rellax-opacity-seed'));
  }

  return 0;
}

},{"rellax":6}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPortfolioMenu = void 0;
let newCurrentMenuIndex = 0;
let touchStartPoint = 0;

function initPortfolioMenu(menuId) {
  const menu = document.getElementById(menuId);

  if (menu) {
    const menuButtons = menu.querySelectorAll('.button');
    const currentMenuItemIndex = Number(menu.dataset.currentMenuItemIndex);
    setActiveMenuItem(menu, currentMenuItemIndex);
    menuButtons.forEach((button, index) => {
      button.addEventListener('click', event => {
        event.preventDefault();
        setActiveMenuItem(menu, index);
      }, false);
    });
    menu.addEventListener('touchmove', touchDragMenu.bind(null, menu), false);
    menu.addEventListener('touchstart', function (event) {
      touchStartPoint = event.targetTouches[0].pageX;
    }, false);
    menu.addEventListener('touchend', function (_event) {
      setActiveMenuItem(menu, newCurrentMenuIndex);
    }, false);
    window.addEventListener('resize', function (_event) {
      const currentMenuItemIndex = Number(menu.dataset.currentMenuItemIndex);
      setActiveMenuItem(menu, currentMenuItemIndex);
    });
  }
}

exports.initPortfolioMenu = initPortfolioMenu;

function setActiveMenuItem(menu, position) {
  updateMenuRotationPosition(menu, position);
  const menuButtons = menu.querySelectorAll('.button');
  menuButtons.forEach(button => {
    button.classList.remove('active');
  });
  const currentButton = menuButtons.item(position);
  currentButton.classList.add('active');

  if (currentButton.dataset.name) {
    const currentEffectName = currentButton.dataset.name;
    updateGridEffects(currentEffectName);
  }

  menu.dataset.currentMenuItemIndex = String(position);
}

function updateMenuRotationPosition(menu, position) {
  const circle = menu.querySelector('ul');
  const menuButtons = menu.querySelectorAll('.button');

  if (circle) {
    let angleIncrement = Number(menu.dataset.angleIncrement);

    if (window.innerWidth <= 576) {
      angleIncrement = Number(menu.dataset.angleIncrementMobile);
    }

    circle.style.transform = "rotate(-".concat((menuButtons.length - 1 - position) * angleIncrement, "deg)");
  }
}

function updateGridEffects(currentEffect) {
  const animationSpeed = 200;
  const aeroGrid = document.querySelector('aero-grid');

  if (aeroGrid) {
    aeroGrid.setAttribute('global-effect', currentEffect);
    const aeroEffects = aeroGrid.querySelectorAll('aero-card');
    aeroEffects.forEach(effect => {
      ['top', 'right', 'bottom', 'left'].forEach(direction => {
        effect.classList.remove(direction);
      });
      effect.classList.add('show');
      setTimeout(() => {
        effect.classList.remove('show');
      }, animationSpeed);
    });
  }
}

function touchDragMenu(menu, event) {
  const touchLocation = event.targetTouches[0];
  const dragInertia = 2.5;
  const dragDirection = (touchStartPoint - touchLocation.pageX) / window.innerWidth * dragInertia;
  const currentMenuIndex = Number(menu.dataset.currentMenuItemIndex);
  const newPosition = currentMenuIndex + Math.round(dragDirection);
  newCurrentMenuIndex = Math.round(newPosition);
  updateMenuRotationPosition(menu, newPosition);
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchUrls = void 0;

function switchUrls() {
  const isSecondLink = getParam('sl') === 'true';

  if (isSecondLink) {
    switchToSecondLink();
  }

  const isWordPress = getParam('wp') === 'true';

  if (isWordPress) {
    switchToAltLinks(isSecondLink);
    switchToAltContent();
  }
}

exports.switchUrls = switchUrls;

function switchToSecondLink() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const secondLink = link.getAttribute('data-link2');

    if (secondLink) {
      link.setAttribute('href', secondLink);
    }
  });
}

function switchToAltLinks() {
  let isSecondLink = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const altLink = !isSecondLink ? link.getAttribute('data-alt-link1') : link.getAttribute('data-alt-link2');

    if (altLink) {
      link.setAttribute('href', altLink);
    }
  });
}

function switchToAltContent() {
  const elements = document.querySelectorAll('.alt-content');
  elements.forEach(element => {
    const altContent = element.getAttribute('data-alt-content');

    if (altContent) {
      element.innerHTML = altContent;
    }
  });
}

function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeAutodetect = void 0;

const cookies_1 = require("./cookies");

function themeAutodetect() {
  const initialTheme = (0, cookies_1.getCookie)('theme');

  if (!initialTheme) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      (0, cookies_1.setCookie)('theme', 'dark', 7);
    } else {
      (0, cookies_1.setCookie)('theme', 'light', 7);
    }
  }

  const isSafari = navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0;
  const isEdge = navigator.appVersion.indexOf('Edge') > -1;

  if (!isSafari && !isEdge) {
    watchThemeChange();
  }
}

exports.themeAutodetect = themeAutodetect;

function watchThemeChange() {
  const themeToggleButton = document.querySelector('#themeToggleButton');
  const body = document.querySelector('body');
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? 'dark' : 'light';
    (0, cookies_1.setCookie)('theme', newColorScheme, 7);

    if (themeToggleButton != null && body != null) {
      if (newColorScheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleButton.classList.add('active');
      } else {
        body.classList.remove('dark-theme');
        themeToggleButton.classList.remove('active');
      }
    }
  });
}

},{"./cookies":10}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.themeToggle = void 0;

const cookies_1 = require("./cookies");

function themeToggle() {
  const themeToggleButton = document.querySelector('#themeToggleButton');
  const body = document.querySelector('body');

  if (themeToggleButton != null && body != null) {
    // Set the last saved theme.
    let theme = (0, cookies_1.getCookie)('theme');

    if (theme === 'dark') {
      body.classList.add('dark-theme');
      themeToggleButton.classList.add('active');
    } // Set the theme color on themeToggleButton click event.


    themeToggleButton.addEventListener('click', function toggleTheme(mouseEvent) {
      mouseEvent.preventDefault(); // Toggle the dark theme classes.

      body.classList.toggle('dark-theme');
      this.classList.toggle('active'); // Save the current theme with cookies.

      if (body.classList.contains('dark-theme')) {
        (0, cookies_1.setCookie)('theme', 'dark', 7);
      } else {
        (0, cookies_1.setCookie)('theme', 'light', 7);
      }
    });
  }
}

exports.themeToggle = themeToggle;

},{"./cookies":10}]},{},[7])

//# sourceMappingURL=bundle.js.map
