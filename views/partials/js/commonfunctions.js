function setFileDefaults(value) {
    if (value == "") {
        return "default";
    } else {
        return value;
    }
}

function setDropDownValue(element, value) {

    var el = document.getElementById(element);

    document.getElementById(element).selectedOptions[0].innerText = value;


}

function setDropDownValueParent(element, value) {

    var el = document.getElementById(element);

    document.getElementById(element).selectedOptions[1].innerText = value;


}


function clearFileDefaults(value) {
    if (value.startsWith("default")) {
        return "";
    } else {
        return value;
    }
}

function SetCheckboxElement(id, valueToSelect) {
    var element = document.getElementById(id);
    var check = false;
    if (valueToSelect != undefined) {
        if (valueToSelect == "Y") {
            check = true;
        } else if (valueToSelect == "true") {
            check = true;
        }
    }
    element.checked = check;
}

function SetSelectElement(id, valueToSelect) {
    var element = document.getElementById(id);
    element.value = valueToSelect;
}

function UnCheckElement(id) {

    var element = document.getElementById(id);
    element.checked = false;

}



// function getUsers() {
//     // Code here
// }

module.exports = {
    setFileDefaults,
    clearFileDefaults,
    SetCheckboxElement,
    SetSelectElement,
    UnCheckElement,
    setDropDownValue,
    setDropDownValueParent

}