function instructionsUtilsGetHTML(dirtyText=""){
    function getParagraphs(pArray){
        let pHTML = ""
        pArray.forEach(text => {
            if (text.trim() !== ""){
                pHTML += `<p>${text.trim()}</p>`
            }
        })
        console.log(pHTML)
        return pHTML
    }

    const paragraphArray = dirtyText.split("\n").map(p => {
        return p.replace("\r", "")
    })
    return getParagraphs(paragraphArray)
}