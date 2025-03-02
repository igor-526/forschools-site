function instructionsManagementMain(){
    instructionsManagementGet()
    instructionsManagementFiltersSetRoles()
    instructionsManagementFiltersSetListeners()
    instructionsManagementFiltersEraseSetListeners()
}

function instructionsManagementGet(){
    instructionsAPIGetAll(instructionsManagementFilterRoles,
        instructionsManagementFilterName,
        instructionsManagementFilterUploadedStart,
        instructionsManagementFilterUploadedEnd,
        instructionsManagementFilterChangedStart,
        instructionsManagementFilterChangedEnd
    ).then(request => {
        switch (request.status){
            case 200:
                instructionsManagementShow(request.response)
                break
            default:
                break
        }
    })
}

function instructionsManagementShow(instructions){
    function getVisibilityHTML(visibility){
        const visibilityRU = visibility.map(role => {
            switch (role){
                case 'listeners':
                    return 'Ученики'
                case 'teachers':
                    return 'Преподаватели'
                case 'curators':
                    return 'Кураторы'
                case 'methodists':
                    return 'Методисты'
                case 'administrators':
                    return 'Администраторы'
            }
        })
        return visibilityRU.join("<br>")
    }

    function getReplaceListener(insID, direction){
        instructionsAPIReplace(insID, instructionsManagementFilterRoles[0], direction).then(request => {
            switch (request.status){
                case 200:
                    alert("Инструкция успешно перемещена")
                    instructionsManagementGet()
                    break
                default:
                    alert("Произошла ошибка. Не удалось переместить инструкцию")
                    break
            }
        })
    }

    function getElement(ins){
        const tr = document.createElement("tr")
        const tdName = document.createElement("td")
        const tdUploaded = document.createElement("td")
        const tdChanged = document.createElement("td")
        const tdVisibility = document.createElement("td")
        const tdActions = document.createElement("td")

        tdName.innerHTML = ins.name

        if (instructionsManagementFilterRoles.length === 1 &&
            instructionsManagementFilterName === null &&
            instructionsManagementFilterUploadedStart === null &&
            instructionsManagementFilterUploadedEnd === null &&
            instructionsManagementFilterChangedStart === null &&
            instructionsManagementFilterChangedEnd === null
        ) {
            tdName.classList.add("d-flex")
            const replaceButtonsBlock = document.createElement("div")
            const replaceButtonUPBlock = document.createElement("div")
            const replaceButtonDOWNBlock = document.createElement("div")
            const replaceButtonUP = document.createElement("button")
            const replaceButtonDOWN = document.createElement("button")
            replaceButtonsBlock.classList.add("me-3")
            replaceButtonUP.classList.add("btn", "btn-sm", "btn-primary", "my-1")
            replaceButtonUP.innerHTML = '<i class="bi bi-chevron-up"></i>'
            replaceButtonDOWN.classList.add("btn", "btn-sm", "btn-primary", "my-1")
            replaceButtonDOWN.innerHTML = '<i class="bi bi-chevron-down"></i>'
            replaceButtonUP.addEventListener("click", function (){
                getReplaceListener(ins.id, "up")
            })
            replaceButtonDOWN.addEventListener("click", function (){
                getReplaceListener(ins.id, "down")
            })
            replaceButtonsBlock.insertAdjacentElement("beforeend", replaceButtonUPBlock)
            replaceButtonsBlock.insertAdjacentElement("beforeend", replaceButtonDOWNBlock)
            replaceButtonUPBlock.insertAdjacentElement("beforeend", replaceButtonUP)
            replaceButtonDOWNBlock.insertAdjacentElement("beforeend", replaceButtonDOWN)
            tdName.insertAdjacentElement("afterbegin", replaceButtonsBlock)
        }

        tdUploaded.innerHTML = timeutilsDateTimeToStr(ins.uploaded_at)
        tdChanged.innerHTML = timeutilsDateTimeToStr(ins.changed_at)
        tdVisibility.innerHTML = getVisibilityHTML(ins.visibility)

        const tdActionsChangeA = document.createElement("a")
        tdActionsChangeA.href = `/instructions/new/${ins.id}/`
        const tdActionsChangeButton = document.createElement("button")
        tdActionsChangeButton.type = "button"
        tdActionsChangeButton.innerHTML = '<i class="bi bi-pen"></i>'
        tdActionsChangeButton.classList.add("btn", "btn-primary")
        tdActions.insertAdjacentElement("beforeend", tdActionsChangeA)
        tdActionsChangeA.insertAdjacentElement("beforeend", tdActionsChangeButton)

        tr.insertAdjacentElement("beforeend", tdName)
        tr.insertAdjacentElement("beforeend", tdUploaded)
        tr.insertAdjacentElement("beforeend", tdChanged)
        tr.insertAdjacentElement("beforeend", tdVisibility)
        tr.insertAdjacentElement("beforeend", tdActions)
        return tr
    }

    instructionsManagementTableBody.innerHTML = ""
    instructions.forEach(ins => {
        instructionsManagementTableBody.insertAdjacentElement("beforeend", getElement(ins))
    })
}

function instructionsManagementFiltersSetRoles(){
    function getListener(value, element){
        const index = instructionsManagementFilterRoles.indexOf(value)
        switch (index){
            case -1:
                instructionsManagementFilterRoles.push(value)
                element.classList.add("active")
                break
            default:
                instructionsManagementFilterRoles.splice(index, 1)
                element.classList.remove("active")
                break
        }
        instructionsManagementGet()
    }

    function getElement(name, value){
        const li = document.createElement("li")
        li.classList.add("dropdown-item")
        li.innerHTML = name
        li.addEventListener("click", function (){
            getListener(value, li)
        })
        return li
    }

    instructionsManagementFilterVisibleList.insertAdjacentElement("beforeend",
        getElement("Ученики", "listeners"))
    instructionsManagementFilterVisibleList.insertAdjacentElement("beforeend",
        getElement("Преподаватели", "teachers"))
    instructionsManagementFilterVisibleList.insertAdjacentElement("beforeend",
        getElement("Кураторы", "curators"))
    instructionsManagementFilterVisibleList.insertAdjacentElement("beforeend",
        getElement("Методисты", "methodists"))
    instructionsManagementFilterVisibleList.insertAdjacentElement("beforeend",
        getElement("Администраторы", "administrators"))
}

function instructionsManagementFiltersSetListeners(){
    instructionsManagementFilterNameField.addEventListener("input", function () {
        if (instructionsManagementFilterNameField.value.trim() !== ""){
            instructionsManagementFilterName = instructionsManagementFilterNameField.value.trim().toLowerCase()
        } else {
            instructionsManagementFilterName = null
        }
        instructionsManagementGet()
    })
    instructionsManagementFilterUploadedStartField.addEventListener("input", function () {
        if (instructionsManagementFilterUploadedStartField.value !== ""){
            instructionsManagementFilterUploadedStart = instructionsManagementFilterUploadedStartField.value
        } else {
            instructionsManagementFilterUploadedStart = null
        }
        instructionsManagementGet()
    })
    instructionsManagementFilterUploadedEndField.addEventListener("input", function () {
        if (instructionsManagementFilterUploadedEndField.value !== ""){
            instructionsManagementFilterUploadedEnd = instructionsManagementFilterUploadedEndField.value
        } else {
            instructionsManagementFilterUploadedEnd = null
        }
        instructionsManagementGet()
    })
    instructionsManagementFilterChangedStartField.addEventListener("input", function () {
        if (instructionsManagementFilterChangedStartField.value !== ""){
            instructionsManagementFilterChangedStart = instructionsManagementFilterChangedStartField.value
        } else {
            instructionsManagementFilterChangedStart = null
        }
        instructionsManagementGet()
    })
    instructionsManagementFilterChangedEndField.addEventListener("input", function () {
        if (instructionsManagementFilterChangedEndField.value !== ""){
            instructionsManagementFilterChangedEnd = instructionsManagementFilterChangedEndField.value
        } else {
            instructionsManagementFilterChangedEnd = null
        }
        instructionsManagementGet()
    })
}

function instructionsManagementFiltersEraseSetListeners(){
    function eraseName(){
        instructionsManagementFilterNameField.value = ""
        instructionsManagementFilterName = null
    }

    function eraseUploadedStart(){
        instructionsManagementFilterUploadedStartField.value = ""
        instructionsManagementFilterUploadedStart = null
    }

    function eraseUploadedEnd(){
        instructionsManagementFilterUploadedEndField.value = ""
        instructionsManagementFilterUploadedEnd = null
    }

    function eraseChangedStart(){
        instructionsManagementFilterChangedStartField.value = ""
        instructionsManagementFilterChangedStart = null
    }

    function eraseChangedEnd(){
        instructionsManagementFilterChangedEndField.value = ""
        instructionsManagementFilterChangedEnd = null
    }

    function eraseRoles(){
        instructionsManagementFilterVisibleList.querySelectorAll("li").forEach(elem => {
            elem.classList.remove("active")
        })
        instructionsManagementFilterRoles = []
    }

    instructionsManagementFilterNameFieldErase.addEventListener("click", function () {
        eraseName()
        instructionsManagementGet()
    })
    instructionsManagementFilterUploadedStartFieldErase.addEventListener("click", function () {
        eraseUploadedStart()
        instructionsManagementGet()
    })
    instructionsManagementFilterUploadedEndFieldErase.addEventListener("click", function () {
        eraseUploadedEnd()
        instructionsManagementGet()
    })
    instructionsManagementFilterChangedStartFieldErase.addEventListener("click", function () {
        eraseChangedStart()
        instructionsManagementGet()
    })
    instructionsManagementFilterChangedEndFieldErase.addEventListener("click", function () {
        eraseChangedEnd()
        instructionsManagementGet()
    })
    instructionsManagementFilterEraseAll.addEventListener("click", function () {
        eraseName()
        eraseUploadedStart()
        eraseUploadedEnd()
        eraseChangedStart()
        eraseChangedEnd()
        eraseRoles()
        instructionsManagementGet()
    })
}

function timeutilsDateTimeToStr(dt){
    const date = new Date(dt)
    const month = date.getMonth() === 12 ? 1 : date.getMonth()+1
    let datestring
    const difference = (new Date()
        .setHours(0,0,0,0) - new Date(dt)
        .setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)
    switch (difference){
        case 0:
            datestring = "сегодня в "
            break
        case 1:
            datestring = "вчера в "
            break
        default:
            datestring = `${date.getDate().toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}`
            break
    }
    datestring += ` ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    return datestring
}


let instructionsManagementFilterName = null
let instructionsManagementFilterUploadedStart = null
let instructionsManagementFilterUploadedEnd = null
let instructionsManagementFilterChangedStart = null
let instructionsManagementFilterChangedEnd = null
let instructionsManagementFilterRoles = []

const instructionsManagementFilterNameField = document.querySelector("#instructionsManagementFilterNameField")
const instructionsManagementFilterNameFieldErase = document.querySelector("#instructionsManagementFilterNameFieldErase")
const instructionsManagementFilterUploadedStartField = document.querySelector("#instructionsManagementFilterUploadedStartField")
const instructionsManagementFilterUploadedStartFieldErase = document.querySelector("#instructionsManagementFilterUploadedStartFieldErase")
const instructionsManagementFilterUploadedEndField = document.querySelector("#instructionsManagementFilterUploadedEndField")
const instructionsManagementFilterUploadedEndFieldErase = document.querySelector("#instructionsManagementFilterUploadedEndFieldErase")
const instructionsManagementFilterChangedStartField = document.querySelector("#instructionsManagementFilterChangedStartField")
const instructionsManagementFilterChangedStartFieldErase = document.querySelector("#instructionsManagementFilterChangedStartFieldErase")
const instructionsManagementFilterChangedEndField = document.querySelector("#instructionsManagementFilterChangedEndField")
const instructionsManagementFilterChangedEndFieldErase = document.querySelector("#instructionsManagementFilterChangedEndFieldErase")
const instructionsManagementFilterVisibleList = document.querySelector("#instructionsManagementFilterVisibleList")
const instructionsManagementTableBody = document.querySelector("#instructionsManagementTableBody")
const instructionsManagementFilterEraseAll = document.querySelector("#instructionsManagementFilterEraseAll")

instructionsManagementMain()