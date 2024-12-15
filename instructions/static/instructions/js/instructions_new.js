function instructionsNewMain(){
    instructionsNewFormInstructionSaveButton.addEventListener("click", instructionsNewSave)
}

function instructionsNewValidate(){
    return true
}

function instructionsNewSave(){
    function getFormData(){
        return new FormData(instructionsNewForm)
    }

    if (instructionsNewValidate()){
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

instructionsNewMain()