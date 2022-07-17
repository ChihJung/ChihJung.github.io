// 宣告
const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let day, month, year, click
let monthCounter = 0, withEventCounter = 0
let eventArr
if (localStorage.getItem('events')) {
    eventArr = JSON.parse(localStorage.getItem('events'))
} else {
    eventArr = []
}

// DOM
const monthDisplay = document.querySelector('#month-display')
const calendar = document.querySelector('#calendar')
const backBtn = document.getElementById('back')
const nextBtn = document.getElementById('next')
const saveBtn = document.getElementById('saveBtn')
const cancelBtn = document.getElementById('cancelBtn')
const inputAll = document.querySelectorAll('input')

// window.onload
window.onload = function () {
    // calendar
    setHeader()
    getNsetDays()
    backBtn.addEventListener('click', goback)
    nextBtn.addEventListener('click', goforward)

    // inside Modal
    saveBtn.addEventListener('click', saveEvent)
    cancelBtn.addEventListener('click', closeModal)
}


// function
function setHeader() {
    const date = new Date()
    if (monthCounter !== 0) {
        date.setMonth(new Date().getMonth() + monthCounter)
    }

    day = date.getDate()
    year = date.getFullYear()
    month = date.getMonth()

    monthString = months[month]
    document.querySelector('#month-display').innerHTML = `${year}  ${monthString}`
}

function getNsetDays() {
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
                "data-bs-target": "#exampleModal"
            })
            //每日加上click事件 => [開啟modal addevent]
            let dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${(i - previousDays).toString().padStart(2, '0')}`
            square.addEventListener('click', ()=>{
                clickDay(dateStr)
            })

            // event顯示在行事曆上
            let dayWithEvent = eventArr.filter(x => x.eventDate === dateStr)
            if (dayWithEvent != undefined) {
                dayWithEvent.forEach(e => {
                    let eventDiv = document.createElement('div')
                    eventDiv.classList.add('with-event')
                    eventDiv.innerText = e.eventTitle
                    eventDiv.style.backgroundColor = e.color
                    square.appendChild(eventDiv)
                })
            }

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
    setHeader()
    getNsetDays()
}

function goforward() {
    monthCounter++
    setHeader()
    getNsetDays()
}

function clickDay(inputdate) {
    click = inputdate
    inputAll[1].value = inputdate
    // if(inputAll[0].focus == true){
    //     inputAll[0].placeholder 
    // }
    let dayWithEvent = eventArr.find(x => x.eventDate === inputdate)
    if (dayWithEvent != undefined && withEventCounter == 0) {
        console.log('event has exist')
        // add 'deleteBtn' before saveBtn
        let button = document.createElement('button')
        button.classList.add('deleteBtn')
        button.innerText = 'DELETE'
        saveBtn.insertAdjacentElement('beforebegin', button)
        button.addEventListener('click', deleteEvent)
        withEventCounter++

        // 帶入第一筆資料
        let filterlist = eventArr.filter(x => x.eventDate === click)
        inputAll.forEach((x, index) => {
            let key = Object.keys(filterlist[0])
            if (index != inputAll.length - 1) {
                x.value = filterlist[0][key[index]]
            } else {
                x.value = filterlist[0][key[index + 1]]
            }
        })
    } else {
        console.log('dont\'t have event')
    }

}

function closeModal() {
    click = null

    document.querySelector('.newEventModal').style.display = 'none'
    document.querySelector('.modal-backdrop').style.display = 'none'

    // 清除預填的東西
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
    setHeader()
    getNsetDays()
}

function saveEvent() {
    // 下拉式選單取值
    let typeSelector = document.getElementById('typeSelector')
    let typeVal = typeSelector.options[typeSelector.selectedIndex].value;


    // 過濾必填,把資訊推入eventArr
    if (inputAll[0].value != '' && inputAll[1].value != '' && inputAll[2].value != '') {
        saveBtn.classList.add('inputComplete')
        eventArr.push({
            eventTitle: inputAll[0].value,
            eventDate: inputAll[1].value,
            eventTime: inputAll[2].value,
            location: inputAll[3].value,
            type: typeVal,
            color: inputAll[4].value
        })

        // localStorage
        localStorage.setItem('events', JSON.stringify(eventArr))

        // 存完關閉Modal
        closeModal()
    }

}

function deleteEvent() {
    // 留下與點選日期不符的
    console.log(eventArr)
    eventArr = eventArr.filter(x => x.eventDate !== click)
    console.log(eventArr)
    localStorage.setItem('events', JSON.stringify(eventArr))
    closeModal()
}