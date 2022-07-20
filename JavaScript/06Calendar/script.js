// 宣告
const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let click, dateStr, dynamicDate
let monthCounter = 0

const today = new Date()

let day = today.getDate()
let year = today.getFullYear()
let month = today.getMonth()


// DOM
const monthDisplay = document.querySelector('#month-display')
const calendar = document.querySelector('#calendar')
const backBtn = document.getElementById('back')
const nextBtn = document.getElementById('next')
const deleteBtn = document.getElementById('deleteBtn')
const saveBtn = document.getElementById('saveBtn')
const inputAll = document.querySelectorAll('input')

// window.onload
window.onload = function () {
    // calendar

    initCalendar()
    backBtn.addEventListener('click', goback)
    nextBtn.addEventListener('click', goforward)

    // inside Modal
    saveBtn.addEventListener('click', saveEvent)
}


// function
function initCalendar() {
    monthString = months[month]
    document.querySelector('#month-display').innerHTML = `${year}  ${monthString}`

    // 這個月第一天禮拜幾
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let firstDayWeekday = new Date(year, month, 1)
    const options = { weekday: 'long' }
    firstDayWeekday = new Intl.DateTimeFormat('en-US', options).format(firstDayWeekday)
    let previousDays = weekdays.indexOf(firstDayWeekday)

    // 這個月有幾天
    let daysInMonth = new Date(year, month + 1, 0).getDate()

    calendar.innerText = ''
    for (let i = 1; i <= daysInMonth + previousDays; i++) {
        let square = document.createElement('div')
        if (i > previousDays) {
            square.innerText = i - previousDays
            square.classList.add('day')
            $(square).attr({
                "data-bs-toggle": "modal",
                "data-bs-target": "#exampleModalToggle",
                "role": "button"
            })

            if (localStorage.getItem(`${year}-${(month + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`) != null) {
                let todoList = JSON.parse(localStorage.getItem(`${year}-${(month + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`))
                // console.log(todoList)
                todoList.forEach((e) => {
                    // event顯示在行事曆上
                    let eventDiv = document.createElement('div')
                    eventDiv.innerText = e.eventTitle
                    eventDiv.classList.add('withEvent')
                    eventDiv.style.backgroundColor = e.color
                    square.appendChild(eventDiv)
                })
            }

            square.addEventListener('click', (event) => {
                console.log(event)
                let chosenDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${event.target.childNodes[0].data.toString().padStart(2, '0')}`
                console.log(chosenDate)

                // first Modal Page-設定Title
                // second Modal 帶入日期 
                document.querySelector('.first-modal-title').innerText = `${chosenDate} Schedule`
                inputAll[1].value = chosenDate



                let mBody = document.querySelector('.first-modal-body')
                mBody.innerHTML = ''

                if (localStorage.getItem(`${year}-${(month + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`) != null) {

                    let todoList = JSON.parse(localStorage.getItem(`${year}-${(month + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`))

                    todoList.forEach((e) => {
                        // event顯示在第一個Modal上
                        let modalEventDiv = document.createElement('div')
                        modalEventDiv.classList.add('schedule')
                        let title = document.createElement('span')
                        title.innerText = `${e.eventTitle}`
                        let time = document.createElement('span')
                        time.innerText = `${e.eventTime}`
                        modalEventDiv.append(title)
                        modalEventDiv.insertBefore(time, title)
                        mBody.innerHTML = ''
                        mBody.appendChild(modalEventDiv)
                        modalEventDiv.style.backgroundColor = e.color
                        modalEventDiv.style.cursor = 'pointer'
                        modalEventDiv.style.color = '#fffcf0'

                    })
                }
                // event.stopPropagation()

            })



            // 今日 添加'current'class
            if (i - previousDays == day && monthCounter == 0) {
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

    initCalendar()
}

function goforward() {
    monthCounter
    month++
    if (month == 12) {
        year++
        month = 0
    }

    initCalendar()
}

// function clickDay() {
//     // click = inputdate
//     // console.log(click)
//     // dynamicDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${event.target.innerText.toString().padStart(2, '0')}`
//     // inputAll[1].value = `${year}-${(month + 1).toString().padStart(2, '0')}-${event.target.innerText.toString().padStart(2, '0')}`
//     event.target.setAttribute('data-id', `${dynamicDate}`)
//     // let dayWithEvent = eventArr.find(x => x.eventDate === inputdate)
//     let dayWithEvent = localKey.find(x => x.id === dynamicDate)
//     if (dayWithEvent != undefined && withEventCounter == 0) {
//         console.log('event has exist')
//         deleteBtn.classList.add('already')
//         deleteBtn.disabled = false
//         deleteBtn.addEventListener('click', deleteEvent)
//         withEventCounter++
//     } else {
//         console.log('dont\'t have event')
//     }

// }

function clearInput() {
    inputAll.forEach((i, index) => {
        if (index != inputAll.length - 1) {
            i.value = ''
        }
        else {
            i.value = '#000000'
        }
    })
    let option = document.querySelector('option')
    if (option.value != undefined) {
        document.getElementById('typeSelector').selectedIndex = 0
    }
}

function closeModal() {
    document.querySelector('.newEventModal').style.display = 'none'
    // document.querySelector('.modal-backdrop').style.display = 'none'

    // 清除預填的東西
    clearInput()
    initCalendar()
}

function saveEvent() {
    // 下拉式選單取值
    let typeSelector = document.getElementById('typeSelector')
    let typeVal = typeSelector.options[typeSelector.selectedIndex].value;

    // 過濾必填,把資訊推入eventArr
    let date = inputAll[1].value
    if (inputAll[0].value != '' && inputAll[1].value != '' && inputAll[2].value != '') {
        saveBtn.classList.add('inputComplete')
        let scheduleObj = {
            eventTitle: inputAll[0].value,
            eventDate: date,
            eventTime: inputAll[2].value,
            location: inputAll[3].value,
            type: typeVal,
            color: inputAll[4].value
        }

        let scheduleList = []
        if (localStorage.getItem(date, scheduleObj) == null) {
            scheduleList.push(scheduleObj)
        } else {
            scheduleList = JSON.parse(localStorage.getItem(date))
            scheduleList.push(scheduleObj)
        }
        localStorage.setItem(date, JSON.stringify(scheduleList))

        // 存完關閉Modal
        closeModal()
        initCalendar()
    }
}

function deleteEvent() {
    let text = chosenEvent(event)

    // 留下與點選日期不符的
    eventArr = eventArr.filter(x => x.eventDate !== click && x.eventTitle != text)
    localStorage.setItem('events', JSON.stringify(eventArr))
    closeModal()
}

function chosenEvent(event) {
    let data = event.target.dataset.id
    let text = event.target.innerText
    let dayWithEvent = JSON.stringify(eventArr.filter(x => x.eventDate === data && text === x.eventTitle))
    let eventStr = dayWithEvent.split('","')
    console.log(eventStr)

    let arr = []
    eventStr.forEach(x => {
        console.log(x)
        x = x.split('":"')
        arr.push(x[1])
    })

    // 帶入該筆資料
    if (arr[1] == click) {
        inputAll.forEach((x, index) => {
            if (index != inputAll.length - 1) {
                x.value = arr[index]
            } else {
                x.value = arr[index + 1]
            }
        })
    }
    return text
}