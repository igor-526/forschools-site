function instructionNewImgModalSet(src){
    instructionsNewImageModalBody.innerHTML = `<img alt="Изображение" src="${src}" style="width: 100%;">`
    bsInstructionsNewImageModal.show()
}

const instructionsNewImageModal = document.querySelector("#instructionsNewImageModal")
const bsInstructionsNewImageModal = new bootstrap.Modal(instructionsNewImageModal)
const instructionsNewImageModalBody = instructionsNewImageModal.querySelector("#instructionsNewImageModalBody")