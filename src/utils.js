import { c } from "./canvasContext.js";

export function loadSprite(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src + "?t=" + new Date().getTime();
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

export function generateFramesPositionInSprite(numberOfColumns, numberOfRows, frameSize) { 
    let framesPosition = [];
    let currentframeX = 0;
    let currentframeY = 0;

    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            framesPosition.push({ x: currentframeX, y: currentframeY });
            currentframeX += frameSize;
        }
        currentframeX = 0;
        currentframeY += frameSize;
    }
    return framesPosition;
}

export function drawFrame(
	sprite,
	framePosition,
	frameSize,
	canvasPosition,
	scale = 1
) {
    c.drawImage(sprite, framePosition.x, framePosition.y, frameSize, frameSize, canvasPosition.x, canvasPosition.y, frameSize * scale, frameSize * scale);
}

export function makeAnimatedSprite(sprite, anims, framesPosition, frameSize, pos, scale = 1) {
    const data = {
        currentAnim: null,
        currentAnimFrameIndex: null,
        animationTimer: 0,
        currentFrame: null,
        currentFramepos: null,
        pos,
    }

    return {
        setPos(x, y) {
            if (typeof x === "number" || typeof y === "number") throw new Error("x and y must be numbers");
            data.pos = { x, y };
        },
        setCurrentAnim(name) {
            if (!(name in anims)) throw new Error("Animation does not exist");
            data.currentAnim = anims[name];
            data.animationTimer = 0;
            data.currentFrame = null;
            data.currentFramepos = null;
        },
        update(deltaTime) { 
            data.animationTimer += deltaTime;

            if (typeof data.currentAnim === "number") { 
                data.currentFrame = data.currentAnim;
                data.currentFramepos = framesPosition[data.currentFrame];
                return;
            }

            if (!data.currentFrame) {
                data.currentAnimFrameIndex = 0;
                data.currentFrame = data.currentAnim.frames[data.currentAnimFrameIndex];
            }

            if (data.currentAnimFrameIndex >= data.currentAnim.frames.length - 1 && data.currentAnim.loop) {
                data.currentAnimFrameIndex = 0;
                data.currentFrame = data.currentAnim.frames[data.currentAnimFrameIndex];
            }

            data.currentFramepos = framesPosition[data.currentFrame];

            const durationPerFrame = 1 / data.currentAnim.speed;

            if (data.animationTimer >= durationPerFrame && data.currentAnimFrameIndex < data.currentAnim.frames.length - 1) { 
                data.currentAnimFrameIndex++;

                data.currentFrame = data.currentAnim.frames[data.currentAnimFrameIndex];
                data.animationTimer -= durationPerFrame;
            }
        },
        draw() {
            drawFrame(sprite, data.currentFramepos, frameSize, data.pos, scale);
        }
    }
}