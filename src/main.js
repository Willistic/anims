import { canvas, c } from "./canvasContext.js";
import { generateFramesPositionInSprite, loadSprite, makeAnimatedSprite } from "./utils.js";

const container = document.querySelector(".container");

window.onresize = () => {
	document.documentElement.style.setProperty(
		"--scale",
		Math.min(
			container.parentElement.offsetWidth / container.offsetWidth,
			container.parentElement.offsetHeight / container.offsetHeight
		)
	);
};

async function main() {
    c.imageSmoothingEnabled = false;
    const cavalierOneSprite = await loadSprite("./assets/cavalier-anims1.png");
    const cavalierTwoSprite = await loadSprite("assets/cavalier-anims2.png");

    const frameSize = 80;

    const cavalierOneFramePosition = generateFramesPositionInSprite(10, 4, frameSize);
    const cavalierOneAnims = {
        idle: 30,
        attack: {
            frames: Array.from({ length: 31 }, (_, index) => index),
            speed: 12,
            loop: true,
        }
    }

    const cavaliertwoFramePosition = generateFramesPositionInSprite(11, 4, frameSize);
    const cavalierTwoAnims = {
        attack: {
            frames: Array.from({ length: 39 }, (_, index) => index),
            speed: 12,
            loop: true,
        }
    }

	let deltaTime;
	let oldTimeStamp = 0;
	let fps;
    const minFrameRate = 5;
    const debugMode = true

    const cavalierOneSpriteData = makeAnimatedSprite(cavalierOneSprite, cavalierOneAnims, cavalierOneFramePosition, frameSize, { x: 250, y: 100 }, 8);
    cavalierOneSpriteData.setCurrentAnim("attack");

    const cavalierTwoSpriteData = makeAnimatedSprite(cavalierTwoSprite, cavalierTwoAnims, cavaliertwoFramePosition, frameSize, { x: 1200, y: 100 }, 8);
    cavalierTwoSpriteData.setCurrentAnim("attack");

	function gameLoop(timeStamp) {
		deltaTime = (timeStamp - oldTimeStamp) / 1000;
		oldTimeStamp = timeStamp;
		fps = Math.round(1 / deltaTime);

		if (fps >= minFrameRate) {
			// clear the canvas
			c.clearRect(0, 0, canvas.width, canvas.height);
			c.fillStyle = "#F6F6DB";
            c.fillRect(0, 0, canvas.width, canvas.height);
            
            cavalierOneSpriteData.update(deltaTime);
            cavalierOneSpriteData.draw();

            cavalierTwoSpriteData.update(deltaTime);
            cavalierTwoSpriteData.draw();
        }
        
        if (debugMode) { 
            c.font = "128px Arial";
            c.fillStyle = "black";
            c.fillText(fps, 25, 120);
        }

		requestAnimationFrame(gameLoop);
	}

	requestAnimationFrame(gameLoop);
}

main();
