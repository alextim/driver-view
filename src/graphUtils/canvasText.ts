import * as THREE from 'three';

export function makeTextSprite(message: string, parameters: Record<string, any> = {}) {
  // if (parameters === undefined) parameters = {};

  const fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Arial';

  const fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 18;

  const borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 4;

  const borderColor = parameters.hasOwnProperty('borderColor') ? parameters['borderColor'] : { r: 0, g: 0, b: 0, a: 1.0 };

  const backgroundColor = parameters.hasOwnProperty('backgroundColor') ? parameters['backgroundColor'] : { r: 255, g: 255, b: 255, a: 1.0 };

  //var spriteAlignment = THREE.SpriteAlignment.topLeft;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    console.error('Failed to get context');
    return;
  }
  context.font = 'Bold ' + fontsize + 'px ' + fontface;

  // get size data (height depends only on font size)
  const metrics = context.measureText(message);
  const textWidth = metrics.width;

  // background color
  context.fillStyle = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')';
  // border color
  context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')';

  context.lineWidth = borderThickness;
  //roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  // 1.4 is extra height factor for text below baseline: g,j,p,q.

  // text color
  context.fillStyle = 'rgba(0, 0, 0, 1.0)';

  context.fillText(message, borderThickness, fontsize + borderThickness);

  // canvas contents will be used for a texture
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // TODO: const spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false }); // , alignment: spriteAlignment
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    useScreenCoordinates: false /* !!!useScreenCoordinates is not a member */,
  } as THREE.SpriteMaterialParameters); // , alignment: spriteAlignment
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(100, 50, 1.0);
  return sprite;
}

// function for drawing rounded rectangles
export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
