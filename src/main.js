async function main() { 
    console.imageSmoothEnabled = false

    function gameLoop(timeStamp) {
        requestAnimationFrame(gameLoop)
        // console.log(timeStamp)
    }

    requestAnimationFrame(gameLoop)
}

main()