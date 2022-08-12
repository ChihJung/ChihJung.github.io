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
const memoList = document.querySelector('#memo-list')
const memoTitles = document.querySelectorAll('#memoTitle')
const deleteBtn = document.getElementById('deleteBtn')
const saveBtn = document.getElementById('saveBtn')
const inputAll = document.querySelectorAll('input[class="form-control"]')

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


    // memo
    console.log(memoTitles)
    memoTitles.forEach((eachTitle, index) => {
        eachTitle.addEventListener('change', () => {
            event.target.setAttribute('disabled', '')
            if (localStorage.getItem('memoList') != null) {
                memoArray = JSON.parse(localStorage.getItem('memoList'))
            }
            memoArray.push(eachTitle.value)
            localStorage.setItem('memoList', JSON.stringify(memoArray))
            setMemo()
        })
        eachTitle.addEventListener('dbclick', () =>{})
    })

    // calendar
    initCalendar(year, month)
    backBtn.addEventListener('click', goback)
    nextBtn.addEventListener('click', goforward)

    // inside Modal
    //saveBtn
    inputAll[0].addEventListener('input', saveBtnControl)
    inputAll[1].addEventListener('input', saveBtnControl)
    saveBtn.addEventListener('click', saveEvent)


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
                let chosenDate = event.target.getAttribute('date')
                document.querySelector('.first-modal-title').innerText = `${chosenDate} Schedule`
                inputAll.forEach((item, index) => {
                    if (index == 1) {
                        inputAll[1].value = `${chosenDate}T00:00`
                    } else {
                        inputAll[0].value = ''
                    }
                })



                let mBody = document.querySelector('.first-modal-body')
                mBody.innerHTML = ''

                if (localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`) != null) {


                    let todoList = JSON.parse(localStorage.getItem(`${inputYear}-${(inputMonth + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`))

                    todoList.sort((a, b) => { return a.eventTime.localeCompare(b.eventTime) })

                    todoList.forEach((e) => {
                        // event顯示在第一個Modal上
                        let modalEventDiv = document.createElement('div')
                        modalEventDiv.classList.add('schedule')
                        let title = document.createElement('span')
                        title.innerText = `${e.eventTitle}`
                        let time = document.createElement('span')
                        time.innerText = `${e.eventTime}`
                        title.setAttribute('info', `${e.eventDate}/${e.eventTitle}/${e.eventTime}`)
                        modalEventDiv.append(title)
                        time.setAttribute('info', `${e.eventDate}/${e.eventTitle}/${e.eventTime}`)
                        modalEventDiv.insertBefore(time, title)
                        mBody.appendChild(modalEventDiv)
                        modalEventDiv.style.backgroundColor = e.color
                        modalEventDiv.style.cursor = 'pointer'
                        modalEventDiv.style.color = '#fffcf0'
                        modalEventDiv.style.marginBottom = '5px'
                        $(modalEventDiv).attr({
                            "data-bs-toggle": "modal",
                            "data-bs-target": "#exampleModalToggle2",
                            "role": "button",
                            "info": `${e.eventDate}/${e.eventTitle}/${e.eventTime}`
                        })


                        modalEventDiv.addEventListener('click', (event) => {
                            // clearInput()
                            let date = (event.target.getAttribute('info').split('/'))[0]
                            let title = (event.target.getAttribute('info').split('/'))[1]
                            let time = (event.target.getAttribute('info').split('/'))[2]
                            let todo = JSON.parse(localStorage.getItem(date)).filter(e => e.eventTitle == title && e.eventTime == time)

                            inputAll[0].value = title
                            inputAll[1].value = `${date}T${time}`
                            inputAll[2].value == undefined ? '' : todo[0].location
                            inputAll[3].value = todo[0].color

                            deleteBtn.style.display = 'block'
                            if (inputAll[0].value != '' && inputAll[1].value != '' && todo.find(x => x.eventTitle == inputAll[0].value && `${x.eventDate}T${x.eventTime}` == inputAll[1].value)) {
                                saveBtn.disabled = false
                            }


                            // deleteBtn
                            inputAll[0].addEventListener('input', function () {
                                title = inputAll[0].value
                                if (title == '') {
                                    deleteBtn.disabled = true
                                } else {
                                    deleteBtn.disabled = false
                                }
                            })
                            deleteBtn.addEventListener('click', function () {
                                deleteEvent(date)
                            })
                        })
                    })

                }

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

function clearInput() {
    inputAll.forEach((i, index) => {
        if (index != inputAll.length - 1) {
            i.value = ''
        } else {
            i.value = '#000000'
        }
    })
    let option = document.querySelector('option')
    if (option.value != undefined) {
        document.getElementById('typeSelector').selectedIndex = 0
    }
    deleteBtn.style.display = 'none'

}

function closeModal() {
    document.querySelector('.newEventModal').style.display = 'none'
    deleteBtn.style.display = 'none'

    // document.querySelector('.modal-backdrop').style.display = 'none'

    // 清除預填的東西
    clearInput()
    initCalendar()
}

function saveEvent() {
    // 下拉式選單取值
    let typeSelector = document.getElementById('typeSelector')
    let typeVal = typeSelector.options[typeSelector.selectedIndex].value;

    // 取得輸入的內容
    let date = inputAll[1].value.split('T')[0]
    let scheduleObj = {
        eventTitle: inputAll[0].value,
        eventDate: date,
        eventTime: inputAll[1].value.split('T')[1],
        location: inputAll[2].value,
        type: typeVal,
        color: inputAll[3].value
    }

    let scheduleList = []
    if (localStorage.getItem(date) == null) {
        scheduleList.push(scheduleObj)
    } else {
        scheduleList = JSON.parse(localStorage.getItem(date))
        let existItem = scheduleList.find(x => x.eventTime == scheduleObj.eventTime)
        let idx = scheduleList.indexOf(existItem)
        if (existItem) {
            scheduleList.splice(idx, 1)
        }
        scheduleList.push(scheduleObj)

    }
    localStorage.setItem(date, JSON.stringify(scheduleList))

    // 存完關閉Modal
    closeModal()
    initCalendar()

}

function saveBtnControl() {
    if (inputAll[0].value != '' && inputAll[1].value != '') {
        saveBtn.disabled = false
        saveBtn.classList.add('inputComplete')
    } else {
        saveBtn.disabled = true
        saveBtn.classList.remove('inputComplete')
    }
}

function deleteEvent(date) {
    let delTitle = inputAll[0].value
    let delTime = inputAll[1].value.split('T')[1]
    console.log(delTitle)
    console.log(delTime)
    // 留下與點選日期不符的
    let remain = JSON.parse(localStorage.getItem(date)).filter(e => e.eventTitle != delTitle && e.eventTime != delTime)
    localStorage.setItem(date, JSON.stringify(remain))
    initCalendar()
    closeModal()
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

function setMemo() {
    if (localStorage.getItem('memoList') != null) {
        let memoItems = JSON.parse(localStorage.getItem('memoList'))
        memoItems.forEach((item, index) => {
            let input = document.querySelector(`[title]="${index}"`)
            input.value = item
        })
    }
}