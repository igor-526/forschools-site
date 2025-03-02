function instructionsMain(){
    const hashValRole = hashUtilsGetHashValue("role")
    const hashValInstrID = hashUtilsGetHashValue("instrID")
    instructionsSelectedRole = hashValRole ? hashValRole : "listeners"
    instructionsSelectedID = hashValInstrID
    instructionsRoleTabListeners()
    instructionsGetQuestions()
    if (instructionsSelectedID){
        instructionsShowItem(null)
    }
}

function instructionsRoleTabListeners(){
    function setListeners(){
        instructionsTabListeners.classList.add("active")
        instructionsTabTeachers.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsSelectedRole = "listeners"
        instructionsGetQuestions()
    }

    function setTeachers(){
        instructionsTabTeachers.classList.add("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsSelectedRole = "teachers"
        instructionsGetQuestions()
    }

    function setCurators(){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.add("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsSelectedRole = "curators"
        instructionsGetQuestions()
    }

    function setMethodists(){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.add("active")
        instructionsTabAdministrators.classList.remove("active")
        instructionsSelectedRole = "methodists"
        instructionsGetQuestions()
    }

    function setAdmins(){
        instructionsTabTeachers.classList.remove("active")
        instructionsTabListeners.classList.remove("active")
        instructionsTabCurators.classList.remove("active")
        instructionsTabMethodists.classList.remove("active")
        instructionsTabAdministrators.classList.add("active")
        instructionsSelectedRole = "administrators"
        instructionsGetQuestions()
    }
    instructionsTabListeners.addEventListener("click", setListeners)
    instructionsTabTeachers.addEventListener("click", setTeachers)
    instructionsTabCurators.addEventListener("click", setCurators)
    instructionsTabMethodists.addEventListener("click", setMethodists)
    instructionsTabAdministrators.addEventListener("click", setAdmins)

    switch (instructionsSelectedRole){
        case "listeners":
            setListeners()
            break
        case "teachers":
            setTeachers()
            break
        case "curators":
            setCurators()
            break
        case "methodists":
            setMethodists()
            break
        case "admins":
            setAdmins()
            break
    }
}

function instructionsShowItem(button){
    function replaceFiles(files, element){
        let inner = ""
        files.forEach(file => {
            switch (file.file_type){
                case "image":
                    inner = `<img src="${file.file}" alt="${file.alt}" class="mx-1" style="width: 18rem;">`
                    break
                case "video":
                    inner = `<video src="${file.file}" class="mx-1" style="width: 18rem;" controls>`
                    break
            }
            element.innerHTML = element.innerHTML.replace(`[file:${file.id}]`, inner)
        })
    }

    instructionsAPIGetItem(instructionsSelectedID).then(request => {
        switch (request.status){
            case 200:
                hashUtilsSetURL({
                    role: instructionsSelectedRole,
                    instrID: instructionsSelectedID
                })
                if (button){
                    instructionsQuestions.querySelectorAll(".nav-link").forEach(elem => {
                        elem.classList.remove("active")
                    })
                }
                if (screen.width >= 576){
                    button?.classList.add("active")
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

function instructionsShow(instructions){
    function getElement(ins){
        const button = document.createElement("button")
        button.type = "button"
        button.role = "tab"
        button.classList.add("nav-link")
        button.innerHTML = ins.name
        button.addEventListener("click", function () {
            instructionsSelectedID = ins.id
            instructionsShowItem(button)
        })
        return button
    }

    instructionsQuestions.innerHTML = ""
    instructions.forEach(ins => {
        instructionsQuestions.insertAdjacentElement("beforeend", getElement(ins))
    })
}

function instructionsGetQuestions(role= instructionsSelectedRole){
    instructionsAPIGetAll([role]).then(request => {
        switch (request.status){
            case 200:
                hashUtilsSetURL({
                    role: instructionsSelectedRole,
                    instrID: instructionsSelectedID
                })
                instructionsShow(request.response)
                break
            default:
                break
        }
    })
}


let instructionsSelectedRole = "listeners"
let instructionsSelectedID = null

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