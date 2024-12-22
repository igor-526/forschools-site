function instructionsMain(){
    instructionsRoleTabListeners()
    instructionsGetQuestions()
}

function instructionsRoleTabListeners(){
    instructionsTabListeners.addEventListener("click", function (){
        instructionsTabListeners.classList.add("active")
        instructionsTabTeachers.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsGetQuestions("listeners")
    })
    instructionsTabTeachers.addEventListener("click", function (){
        instructionsTabTeachers.classList.add("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsGetQuestions("teachers")
    })
    instructionsTabCurators.addEventListener("click", function (){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.add("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsGetQuestions("curators")
    })
    instructionsTabMethodists.addEventListener("click", function (){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.add("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsGetQuestions("methodists")
    })
    instructionsTabAdministrators.addEventListener("click", function (){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.add("active")
        instructionsGetQuestions("administrators")
    })
}

function instructionsShow(instructions){
    function replaceFiles(files, element){
        files.forEach(file => {
            element.innerHTML = element.innerHTML.replace(`[file:${file.id}]`,
                `<img src="${file.file}" alt="${file.alt}" class="mx-1" style="width: 18rem;">`)
        })
    }

    function getListener(insID, button){
        instructionsAPIGetItem(insID).then(request => {
            switch (request.status){
                case 200:
                    instructionsQuestions.querySelectorAll(".nav-link").forEach(elem => {
                        elem.classList.remove("active")
                    })
                    if (screen.width >= 576){
                        button.classList.add("active")
                        instructionsContent.innerHTML = instructionsUtilsGetHTML(request.response.instruction)
                        instructionsTitle.innerHTML = request.response.name
                        replaceFiles(request.response.files, instructionsContent)
                    } else {
                        instructionsModalMobileTitle.innerHTML = request.response.name
                        instructionsModalMobileBody.innerHTML = instructionsUtilsGetHTML(request.response.instruction)
                        bsInstructionsModalMobile.show()
                        replaceFiles(request.response.files, instructionsModalMobileBody)

                    }
                    break
                default:
                    break
            }
        })
    }

    function getElement(ins){
        const button = document.createElement("button")
        button.type = "button"
        button.role = "tab"
        button.classList.add("nav-link")
        button.innerHTML = ins.name
        button.addEventListener("click", function () {
            getListener(ins.id, button)
        })
        return button
    }

    instructionsQuestions.innerHTML = ""
    instructions.forEach(ins => {
        instructionsQuestions.insertAdjacentElement("beforeend", getElement(ins))
    })
}

function instructionsGetQuestions(role="listeners"){
    instructionsAPIGetAll([role]).then(request => {
        switch (request.status){
            case 200:
                instructionsShow(request.response)
                break
            default:
                break
        }
    })
}


const instructionsTabListeners = document.querySelector("#instructionsTabListeners")
const instructionsTabTeachers = document.querySelector("#instructionsTabTeachers")
const instructionsTabCurators = document.querySelector("#instructionsTabCurators")
const instructionsTabMethodists = document.querySelector("#instructionsTabMethodists")
const instructionsTabAdministrators = document.querySelector("#instructionsTabAdministrators")
const instructionsQuestions = document.querySelector("#instructionsQuestions")
const instructionsContent = document.querySelector("#instructionsContent")
const instructionsTitle = document.querySelector("#instructionsTitle")

const instructionsModalMobile = document.querySelector("#instructionsModalMobile")
const bsInstructionsModalMobile = new bootstrap.Modal(instructionsModalMobile)
const instructionsModalMobileTitle = instructionsModalMobile.querySelector("#instructionsModalMobileTitle")
const instructionsModalMobileBody = instructionsModalMobile.querySelector("#instructionsModalMobileBody")

instructionsMain()