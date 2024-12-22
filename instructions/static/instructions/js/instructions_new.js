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

function instructionsNewSetInstruction(setData=true){
    if (setData){
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
    instructionsNewFormInstructionDeleteButton.classList.remove("d-none")
    instructionsNewFormInstructionDeleteButton.addEventListener("click", function () {
        bsInstructionsNewDeleteConfModal.show()
    })
    instructionsNewDeleteConfModalDeleteButton.addEventListener("click", instructionsNewDelete)
}

function instructionsNewValidate(errors = null){
    function resetValidation(){
        instructionsNewFormNameField.classList.remove("is-invalid")
        instructionsNewFormInstructionField.classList.remove("is-invalid")
        instructionsNewFormNameError.innerHTML = ""
        instructionsNewFormInstructionError.innerHTML = ""
    }

    function setInvalid(element=null, errorElement=null, error=null){
        if (element){
            element.classList.add("is-invalid")
        }
        if (error && errorElement){
            errorElement.innerHTML = error
        }
        validationStatus = false
    }

    function validateName(error=null){
        if (error){
            setInvalid(instructionsNewFormNameField, instructionsNewFormNameError, error)
        } else {
            if (instructionsNewFormNameField.value.trim() === ""){
                setInvalid(instructionsNewFormNameField, instructionsNewFormNameError,
                    "Поле не может быть пустым")
            } else {
                if (instructionsNewFormNameField.value.trim().length > 250){
                    setInvalid(instructionsNewFormNameField, instructionsNewFormNameError,
                        "Поле не может превышать 250 символов")
                }
            }
        }
    }

    function validateInstruction(error=null){
        if (error){
            setInvalid(instructionsNewFormInstructionField, instructionsNewFormInstructionError, error)
        } else {
            if (instructionsNewFormInstructionField.value.trim() === ""){
                setInvalid(instructionsNewFormInstructionField, instructionsNewFormInstructionError,
                    "Поле не может быть пустым")
            } else {
                if (instructionsNewFormInstructionField.value.trim().length > 5000){
                    setInvalid(instructionsNewFormInstructionField, instructionsNewFormInstructionError,
                        "Поле не может превышать 5000 символов")
                }
            }
        }
    }

    resetValidation()
    let validationStatus = true
    if (errors){
        if (errors.hasOwnProperty("name")){
            validateName(errors.name)
        }
        if (errors.hasOwnProperty("instruction")){
            validateInstruction(errors.instruction)
        }
    } else {
        validateName()
        validateInstruction()
    }

    return validationStatus
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
                        alert("Инструкция успешно изменена")
                        break
                    default:
                        alert(request.response)
                        break
                }
            })
        } else {
            instructionsAPICreate(getFormData()).then(request => {
                switch (request.status){
                    case 201:
                        location.assign("/instructions/management/")
                        break
                    default:
                        alert(request.response)
                        break
                }
            })
        }
    }
}

function instructionsNewDelete(){
    instructionsAPIDestroy(instructionID).then(request => {
        switch (request.status){
            case 204:
                location.assign("/instructions/management/")
                break
            default:
                alert(request.response)
                break
        }
    })
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
const instructionsNewFormInstructionDeleteButton = document.querySelector("#instructionsNewFormInstructionDeleteButton")

const instructionsFilesNewForm = document.querySelector("#instructionsFilesNewForm")
const instructionsNewFormInstructionFilesCard = document.querySelector("#instructionsNewFormInstructionFilesCard")
const instructionsNewFormInstructionFilesCardNew = document.querySelector("#instructionsNewFormInstructionFilesCardNew")
const instructionsNewFormInstructionFilesCardNewInput = instructionsFilesNewForm.querySelector("#instructionsNewFormInstructionFilesCardNewInput")
const instructionsNewFormInstructionFilesCardNewCol = document.querySelector("#instructionsNewFormInstructionFilesCardNewCol")

const instructionsNewDeleteConfModal = document.querySelector("#instructionsNewDeleteConfModal")
const bsInstructionsNewDeleteConfModal = new bootstrap.Modal(instructionsNewDeleteConfModal)
const instructionsNewDeleteConfModalDeleteButton = instructionsNewDeleteConfModal.querySelector("#instructionsNewDeleteConfModalDeleteButton")

instructionsNewMain()