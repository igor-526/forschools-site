function instructionsNewMain(){
    instructionsNewFormInstructionSaveButton.addEventListener("click", instructionsNewSave)
    if (instructionID){
        instructionsNewSetInstruction()
    }
    instructionsNewFormInstructionFilesCardNew.addEventListener("click", function (){
        instructionsNewFormInstructionFilesCardNewInput.click()
    })
    instructionsNewFilesGetAll()
    instructionsNewFormInstructionFilesCardNewInput.addEventListener("input", instructionsNewAddFiles)
}

function instructionsNewSetInstruction(){
    instructionsAPIGetItem(instructionID).then(request => {
        switch (request.status){
            case 200:
                console.log(request.response)
                instructionsNewFormNameField.value = request.response.name
                instructionsNewFormInstructionField.value = request.response.instruction
                request.response.visibility.forEach(role => {
                    switch (role){
                        case 'listeners':
                            instructionsNewFormInstructionCheckboxListeners.checked = true
                            break
                        case 'teachers':
                            instructionsNewFormInstructionCheckboxTeachers.checked = true
                            break
                        case 'curators':
                            instructionsNewFormInstructionCheckboxCurators.checked = true
                            break
                        case 'methodists':
                            instructionsNewFormInstructionCheckboxMethodists.checked = true
                            break
                        case 'administrators':
                            instructionsNewFormInstructionCheckboxAdministrators.checked = true
                            break
                    }
                })
                break
            default:
                break
        }
    })
}

function instructionsNewValidate(){
    return true
}

function instructionsNewSave(){
    function getFormData(){
        return new FormData(instructionsNewForm)
    }

    if (instructionsNewValidate()){
        if (instructionID){
            instructionsAPIUpdate(instructionID, getFormData()).then(request => {
                switch (request.status){
                    case 200:
                        console.log(request.response)
                        break
                    default:
                        console.log(request.status)
                        break
                }
            })
        } else {
            instructionsAPICreate(getFormData()).then(request => {
                switch (request.status){
                    case 201:
                        console.log(request.response)
                        break
                    default:
                        console.log(request.status)
                        break
                }
            })
        }
    }
}

function instructionsNewFilesGetAll(){
    instructionsAPIFilesGetAll().then(request => {
        switch (request.status){
            case 200:
                instructionsNewFilesShow(request.response)
                break
            default:
                break
        }
    })
}

function instructionsNewFilesShow(files=[]){
    function getAddListener(fileID){
instructionsNewFormInstructionField.value += `\n[file:${fileID}]\n`
    }

    function getImgListener(fileID){

    }

    function getElement(file){
        const col = document.createElement("div")
        col.classList.add("col-2", "mb-1")
        const card = document.createElement("div")
        card.classList.add("card")
        col.insertAdjacentElement("beforeend", card)
        const img = document.createElement("img")
        img.src = file.file
        img.classList.add("card-img-top")
        img.alt = file.alt
        img.addEventListener("click", function () {
            getImgListener(file.id)
        })
        card.insertAdjacentElement("beforeend", img)
        const cardBody = document.createElement("div")
        const cardBodyA = document.createElement("a")
        card.classList.add("card-body")
        cardBodyA.classList.add("card-link")
        cardBodyA.href = "#instructionsNewFormInstructionField"
        cardBodyA.innerHTML = "Вставить в текст"
        cardBodyA.addEventListener("click", function () {
            getAddListener(file.id)
        })
        card.insertAdjacentElement("beforeend", cardBody)
        cardBody.insertAdjacentElement("beforeend", cardBodyA)
        return col
    }

    files.forEach(file => {
        instructionsNewFormInstructionFilesCardNewCol.insertAdjacentElement("afterend", getElement(file))
    })
}

function instructionsNewAddFiles(){
    instructionsAPIFilesCreate(new FormData(instructionsFilesNewForm)).then(request => {
        switch (request.status){
            case 201:
                instructionsNewFilesShow([request.response])
                break
            default:
                console.log(request.status)
        }
    })
    instructionsFilesNewForm.reset()
}

const instructionsNewForm = document.querySelector("#instructionsNewForm")
const instructionsNewFormNameField = instructionsNewForm.querySelector("#instructionsNewFormNameField")
const instructionsNewFormNameError = instructionsNewForm.querySelector("#instructionsNewFormNameError")
const instructionsNewFormInstructionCheckboxListeners = instructionsNewForm.querySelector("#instructionsNewFormInstructionCheckboxListeners")
const instructionsNewFormInstructionCheckboxTeachers = instructionsNewForm.querySelector("#instructionsNewFormInstructionCheckboxTeachers")
const instructionsNewFormInstructionCheckboxCurators = instructionsNewForm.querySelector("#instructionsNewFormInstructionCheckboxCurators")
const instructionsNewFormInstructionCheckboxMethodists = instructionsNewForm.querySelector("#instructionsNewFormInstructionCheckboxMethodists")
const instructionsNewFormInstructionCheckboxAdministrators = instructionsNewForm.querySelector("#instructionsNewFormInstructionCheckboxAdministrators")
const instructionsNewFormInstructionField = instructionsNewForm.querySelector("#instructionsNewFormInstructionField")
const instructionsNewFormInstructionError = instructionsNewForm.querySelector("#instructionsNewFormInstructionError")
const instructionsNewFormInstructionSaveButton = document.querySelector("#instructionsNewFormInstructionSaveButton")

const instructionsFilesNewForm = document.querySelector("#instructionsFilesNewForm")
const instructionsNewFormInstructionFilesCard = document.querySelector("#instructionsNewFormInstructionFilesCard")
const instructionsNewFormInstructionFilesCardNew = document.querySelector("#instructionsNewFormInstructionFilesCardNew")
const instructionsNewFormInstructionFilesCardNewInput = instructionsFilesNewForm.querySelector("#instructionsNewFormInstructionFilesCardNewInput")
const instructionsNewFormInstructionFilesCardNewCol = document.querySelector("#instructionsNewFormInstructionFilesCardNewCol")

instructionsNewMain()