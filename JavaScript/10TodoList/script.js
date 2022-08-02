// 宣告
let todoArray = []


// DOM
const todoGroup = document.querySelector('#todo-group')
const addBtn = document.querySelector('#addBtn')
const inputText = document.querySelector('.input-group input')
const todoItemTemp = document.querySelector('#todoItem-template')

let editBtn, delBtn, saveBtn, todoTitle, checkBox




// window.onload
window.onload = function () {
    if (localStorage.getItem('todoList') != null) {
        setTodoGroup()
    }
    addBtn.addEventListener('click', () => {
        if (inputText.value == '' || inputText.value == null || inputText.value == undefined) {
            return
        } else {
            addTodo()
        }
    })
    
    inputText.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault()
        addBtn.click()
      }
    })
}




// function
function setTodoGroup() {
    let todoItems = JSON.parse(localStorage.getItem('todoList'))
    todoGroup.innerHTML = ''
    todoItems.forEach((item, index) => {
        todoGroup.append(setTodoTemplate(item.title, item.checkBoxState, index))

        // btn/input 狀態
        todoTitle.setAttribute('disabled', '')
        saveBtn.classList.add('d-none')


    })
}

function setTodoTemplate(title, checkVal, index) {
    let templateClone = todoItemTemp.content.cloneNode(true)
    templateClone.querySelector('#todoTitle').value = title
    templateClone.querySelector('#todoTitle').removeAttribute('disabled')
    templateClone.querySelector('#checkState').checked = checkVal

    todoTitle = templateClone.querySelector('#todoTitle')
    editBtn = templateClone.querySelector('#editBtn')
    saveBtn = templateClone.querySelector('#saveBtn')
    delBtn = templateClone.querySelector('#delBtn')
    checkBox = templateClone.querySelector('#checkState')

    todoTitle.setAttribute('input', index)
    saveBtn.setAttribute('save', index)
    delBtn.setAttribute('del', index)
    editBtn.setAttribute('edit', index)
    checkBox.setAttribute('check', index)

    saveBtn.addEventListener('click', saveTodo.bind(event, index))
    delBtn.addEventListener('click', delTodo.bind(event, index))
    editBtn.addEventListener('click', editTodo.bind(event, index))
    checkBox.addEventListener('click', checkboxChange.bind(event, index))

    return templateClone
}



// (btns) event
function addTodo() {

    if (localStorage.getItem('todoList') != null) {
        todoArray = JSON.parse(localStorage.getItem('todoList'))
    }

    let inputVal = inputText.value
    let todoObj
    todoObj = { title: `${inputVal}`, checkBoxState: false }
    todoArray.push(todoObj)
    localStorage.setItem('todoList', JSON.stringify(todoArray))

    setTodoGroup()
    inputText.value = ''
}


function editTodo(idx) {
    document.querySelector(`[edit="${idx}"]`).classList.add('d-none')
    document.querySelector(`[save="${idx}"]`).classList.remove('d-none')
    document.querySelector(`[input="${idx}"]`).removeAttribute('disabled')
}

function saveTodo(idx) {
    let currentInput = document.querySelector(`[input="${idx}"]`)
    let todoItems = JSON.parse(localStorage.getItem('todoList'))
    todoItems[idx].title = currentInput.value
    localStorage.setItem('todoList', JSON.stringify(todoItems))
    setTodoGroup()
}

function delTodo(idx) {
    let todoItems = JSON.parse(localStorage.getItem('todoList'))
    todoItems.splice(idx, 1)
    localStorage.setItem('todoList', JSON.stringify(todoItems))
    setTodoGroup()
}

function checkboxChange(idx) {
    let todoItems = JSON.parse(localStorage.getItem('todoList'))
    todoItems[idx].checkBoxState = document.querySelector(`[check="${idx}"]`).checked
    localStorage.setItem('todoList', JSON.stringify(todoItems))
    setTodoGroup()
}


