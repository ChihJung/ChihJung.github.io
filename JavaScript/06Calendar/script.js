// 宣告
const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let click, dateStr, dynamicDate
let monthCounter = 0
let memoArray = []

const today = new Date()

let day = today.getDate()
let year = today.getFullYear()
let month = today.getMonth()


// DOM
const hourHand = document.querySelector('[data-hour-hand]')
const minuteHand = document.querySelector('[data-minute-hand]')
const monthDisplay = document.querySelector('#month-display')
const post = document.querySelector('.post')
const calendar = document.querySelector('#calendar')
const calMonth = document.querySelector('.today-date')
const calDate = document.querySelector('.today-date>span')
const backBtn = document.getElementById('back')
const nextBtn = document.getElementById('next')
const deleteBtn = document.getElementById('deleteBtn')
const saveBtn = document.getElementById('saveBtn')

const addDateInput = document.querySelector('#add-date')
const addValueInput = document.querySelector('#add-value')
const editDateInput = document.querySelector('#edit-date')
const editValueInput = document.querySelector('#edit-value')

// window.onload
window.onload = function () {

    // today date
    calMonth.innerHTML = `${months[month].substring(0, 3).toUpperCase()}<span>${day}</span>`
    post.addEventListener('click', initCalendar.bind(this, year, month))

    // choose Month
    document.querySelector('#choser').addEventListener('change', () => {
        let getValue = document.querySelector('#choser').value
        let chooseYear = getValue.split('-')[0]
        let chooseMonth
        if (parseInt(getValue.split('-')[1]) < 10) {
            chooseMonth = parseInt(getValue.split('-')[1].charAt(1)) - 1
        } else {
            chooseMonth = parseInt(getValue.split('-')[1]) - 1
        }
        initCalendar(chooseYear, chooseMonth)
    })


    // clock
    setClock()
    setInterval(setClock, 1000)


    // calendar
    initCalendar(year, month)
    backBtn.addEventListener('click', goback)
    nextBtn.addEventListener('click', goforward)

    // inside Modal
    //saveBtn


}


// function
function initCalendar(inputYear, inputMonth) {
    monthString = months[inputMonth]
    document.querySelector('#month-display').innerHTML = `${inputYear}  ${monthString}`

    // 這個月第一天禮拜幾
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let firstDayWeekday = new Date(inputYear, inputMonth, 1)
    const options = { weekday: 'long' }
    firstDayWeekday = new Intl.DateTimeFormat('en-US', options).format(firstDayWeekday)
    let previousDays = weekdays.indexOf(firstDayWeekday)

    // 這個月有幾天
    let daysInMonth = new Date(inputYear, inputMonth + 1, 0).getDate()

    calendar.innerText = ''
    for (let i = 1; i <= daysInMonth + previousDays; i++) {
        let square = document.createElement('div')
        if (i > previousDays) {
            square.innerText = i - previousDays
            square.classList.add('day')
            $(square).attr({
                "data-bs-toggle": "modal",
                "data-bs-target": "#exampleModalToggle",
                "role": "button",
                "date": `${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`
            })

            if (localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`) != null) {
                let todoList = JSON.parse(localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`))
                // console.log(todoList)

                todoList.sort((a, b) => { return a.eventTime.localeCompare(b.eventTime) })
                todoList.forEach((e) => {
                    // event顯示在行事曆上
                    let eventDiv = document.createElement('div')
                    eventDiv.innerText = e.eventTitle
                    eventDiv.classList.add('withEvent')
                    eventDiv.style.backgroundColor = e.color

                    eventDiv.setAttribute('date', `${e.eventDate}`)
                    square.appendChild(eventDiv)
                })
            }

            square.addEventListener('click', (event) => {

                // first Modal Page-設定Title
                // second Modal 帶入日期
                // let chosenDate = event.target.getAttribute('date')
                // document.querySelector('.first-modal-title').innerText = `${chosenDate} Schedule`
                // inputAll.forEach((item, index) => {
                //     if (index == 1) {
                //         inputAll[1].value = `${chosenDate}T00:00`
                //     } else {
                //         inputAll[0].value = ''
                //     }
                // })



                // let mBody = document.querySelector('.first-modal-body')
                // mBody.innerHTML = ''

                // if (localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`) != null) {


                //     let todoList = JSON.parse(localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`))

                //     todoList.sort((a, b) => { return a.eventTime.localeCompare(b.eventTime) })

                //     todoList.forEach((e) => {
                //         // event顯示在第一個Modal上
                //         let modalEventDiv = document.createElement('div')
                //         modalEventDiv.classList.add('schedule')
                //         let title = document.createElement('span')
                //         title.innerText = `${e.eventTitle}`
                //         let time = document.createElement('span')
                //         time.innerText = `${e.eventTime}`
                //         title.setAttribute('info', `${e.eventDate}/${e.eventTitle}/${e.eventTime}`)
                //         modalEventDiv.append(title)
                //         time.setAttribute('info', `${e.eventDate}/${e.eventTitle}/${e.eventTime}`)
                //         modalEventDiv.insertBefore(time, title)
                //         mBody.appendChild(modalEventDiv)
                //         modalEventDiv.style.backgroundColor = e.color
                //         modalEventDiv.style.cursor = 'pointer'
                //         modalEventDiv.style.color = '#fffcf0'
                //         modalEventDiv.style.marginBottom = '5px'
                //         $(modalEventDiv).attr({
                //             "data-bs-toggle": "modal",
                //             "data-bs-target": "#exampleModalToggle2",
                //             "role": "button",
                //             "info": `${e.eventDate}/${e.eventTitle}/${e.eventTime}`
                //         })


                //         modalEventDiv.addEventListener('click', (event) => {
                //             // clearInput()
                //             let date = (event.target.getAttribute('info').split('/'))[0]
                //             let title = (event.target.getAttribute('info').split('/'))[1]
                //             let time = (event.target.getAttribute('info').split('/'))[2]
                //             let todo = JSON.parse(localStorage.getItem(date)).filter(e => e.eventTitle == title && e.eventTime == time)

                //             inputAll[0].value = title
                //             inputAll[1].value = `${date}T${time}`
                //             inputAll[2].value == undefined ? '' : todo[0].location
                //             inputAll[3].value = todo[0].color

                //             deleteBtn.style.display = 'block'
                //             if (inputAll[0].value != '' && inputAll[1].value != '' && todo.find(x => x.eventTitle == inputAll[0].value && `${x.eventDate}T${x.eventTime}` == inputAll[1].value)) {
                //                 saveBtn.disabled = false
                //             }


                //             // deleteBtn
                //             inputAll[0].addEventListener('input', function () {
                //                 title = inputAll[0].value
                //                 if (title == '') {
                //                     deleteBtn.disabled = true
                //                 } else {
                //                     deleteBtn.disabled = false
                //                 }
                //             })
                //             deleteBtn.addEventListener('click', function () {
                //                 deleteEvent(date)
                //             })
                //         })
                //     })

                // }
                currentIndex = index
                editDateInput.value = `${year}-${month+1}-${td.childNodes[0].data}`
                editValueInput.value = item.title
                event.stopPropagation()
            })
            // 今日 添加'current'class
            if (i - previousDays == day && inputMonth == today.getMonth()) {
                square.classList.add('current')
            }
        } else {
            square.classList.add('blank')
        }
        calendar.append(square)
    }
}

function goback() {
    monthCounter--
    month--
    if (month == -1) {
        year--
        month = 11
    }

    initCalendar(year, month)
}

function goforward() {
    monthCounter++
    month++
    if (month == 12) {
        year++
        month = 0
    }

    initCalendar(year, month)
}








function setClock() {
    const secondsRatio = today.getSeconds() / 60
    const minutesRatio = (secondsRatio + today.getMinutes()) / 60
    const hoursRatio = (minutesRatio + today.getHours()) / 12
    setRotation(minuteHand, minutesRatio)
    setRotation(hourHand, hoursRatio)
}

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360)
}

function addToDoItem(){
    let date = addDateInput.value
    let todoItem = addValueInput.value

    let todoObj = {
        title : todoItem
    }

    let todoList = []
    if(localStorage.getItem(date) == null){
        todoList.push(todoObj)
    }else{
        todoList = JSON.parse(localStorage.getItem(date))
        todoList.push(todoObj)
    }

    localStorage.setItem(date, JSON.stringify(todoList))
    bootstrap.Modal.getOrCreateInstance(addModal).hide()
    setCalendar()
}

function editTodoItem(){
    let date = editDateInput.value
    let todoItem = editValueInput.value

    todoList = JSON.parse(localStorage.getItem(date))
    todoList[currentIndex] = { title : todoItem}
    localStorage.setItem(date, JSON.stringify(todoList))
    bootstrap.Modal.getOrCreateInstance(addModal).hide()
    setCalendar()
}

function deleteTodoItem(){
    let date = editDateInput.value

    let todoList = JSON.parse(localStorage.getItem(date))
    todoList.splice(currentIndex, 1)

    localStorage.setItem(date, JSON.stringify(todoList))
    bootstrap.Modal.getOrCreateInstance(editModal).hide()
    setCalendar()
}