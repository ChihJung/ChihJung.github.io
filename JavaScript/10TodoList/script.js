// 宣告
let todoArray = []
let listIndex = 0
let inputVal


// DOM
const todoGroup = document.querySelector('#todo-group')
const addBtn = document.querySelector('#addBtn')
const inputText = document.querySelector('.input-group input')
const todoItemTemp = document.querySelector('#todoItem-template')
let editBtn, delBtn




// window.onload
window.onload = function () {
    if (localStorage.getItem('todoList') != null) {
        setTodoGroup()
    }
    addBtn.addEventListener('click', addTodo)

}




// function
function addTodo() {
    // console.log('i clicked addBtn')



    inputVal = inputText.value
    todoGroup.append(setTodoTemplate(inputVal, false))

    // setTodoGroup()


    inputText.value = ''
}

function editTodo(event) {
    // console.log('i clicked eidtBtn')
    event.target.parentElement.querySelector('#todoTitle').disabled = false
    event.target.style.display = 'none'
    event.target.parentElement.querySelector('#saveBtn').style.display = 'block'
    inputVal = event.target.parentElement.querySelector('#todoTitle').value


    saveBtn.addEventListener('click', () => {

    })
}

function saveTodo(event) {
    // event.target.parentElement.querySelector('#todoTitle').disabled = true
    // event.target.style.display = 'none'
    // event.target.parentElement.querySelector('#editBtn').style.display = 'block'



    let todoObj
    if (localStorage.getItem('todoList') != null) {
        let storageRec = JSON.parse(localStorage.getItem('todoList'))
        let removeIndex = storageRec.filter(x => x.title == inputVal).map(x => x.index)
        if (removeIndex.length == 0) {
            todoArray = JSON.parse(localStorage.getItem('todoList'))
            listIndex = parseInt(todoArray[todoArray.length - 1].index) + 1
            todoObj = { index: `${listIndex++}`, title: `${inputVal}`, checkBoxStatus: false }
            todoArray.push(todoObj)
        } else if (removeIndex.length != 0) {

            let newInputVal = event.target.parentElement.querySelector('#todoTitle').value

            let todoObj = { index: `${removeIndex}`, title: `${newInputVal}`, checkBoxStatus: `${storageRec[removeIndex[0]].checkBoxStatus}` }
            todoArray = storageRec.splice(removeIndex[0], 1, todoObj)
            // todoArray = todoArray.splice(todoObj, removeIndex[0], 1)
        }
    } else {
        todoObj = { index: `${listIndex++}`, title: `${inputVal}`, checkBoxStatus: false }
        todoArray.push(todoObj)
    }
    localStorage.setItem('todoList', JSON.stringify(todoArray))
    setTodoGroup()
}

function delTodo(event) {

}

function setTodoGroup() {
    let todoItems = JSON.parse(localStorage.getItem('todoList'))
    todoGroup.innerHTML = ''
    todoItems.forEach(item => {
        todoGroup.append(setTodoTemplate(item.title, item.checkBoxStatus))
    })
    document.querySelectorAll('#todoTitle').forEach(item => {
        item.disabled = true
    })
    document.querySelectorAll('#saveBtn').forEach(item => {
        item.style.display = 'none'
    })
    document.querySelectorAll('#editBtn').forEach(item => {
        item.style.display = 'block'
    })
}


function setTodoTemplate(title, checkVal) {
    let templateClone = todoItemTemp.content.cloneNode(true)
    templateClone.querySelector('#todoTitle').value = title
    templateClone.querySelector('#todoTitle').disabled = false
    templateClone.querySelector('#checkStatus').checked = checkVal

    editBtn = templateClone.querySelector('#editBtn')
    saveBtn = templateClone.querySelector('#saveBtn')
    delBtn = templateClone.querySelector('#delBtn')

    saveBtn.addEventListener('click', saveTodo)
    delBtn.addEventListener('click', delTodo)
    editBtn.addEventListener('click', editTodo)



    return templateClone
}

// addClick -> 渲染畫面 -> oldevent出現 編輯/刪除 -> 新增的出現 儲存/刪除