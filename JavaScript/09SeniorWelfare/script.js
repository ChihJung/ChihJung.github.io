// org website     https://data.gov.tw/dataset/126517
// data            http://tnsmap.tainan.gov.tw/api/list.aspx?org=20130118171933

// 宣告
let orgData
let sortData
let sortType
let markers = L.markerClusterGroup()
let marks = []
let choseMark
const theadThArr = ['單位', '地址', '電話', '服務類型', '服務內容']
var map = L.map('map').setView([22.9970861, 120.2129832,], 9)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 8
}).addTo(map);
const dataUrl = 'https://opengov.tainan.gov.tw:443/OpenApi/api/service/Get/9113c7c8-7819-4ac7-902f-3933e3b539db'

// DOM
const distSelect = document.querySelector('#district')
const typeSelect = document.querySelector('#type')
const search = document.querySelector('input')
const outcome = document.querySelector('.outcome')
const mybutton = document.getElementById("backToTopBtn")





// window.onload
window.onload = function () {
    fetch(dataUrl)
        .then(resp => resp.json())
        .then(result => {
            // get data 轉換資料
            orgData = result.data.list
            sortData = orgData
                .map(org => {
                    return {
                        district: org.d,
                        address: org.addr,
                        name: org.name,
                        contact: org.phone,
                        type: org.u,
                        service: org.k,
                        descrip: org.content,
                        lat: org.y,
                        lng: org.x
                    }
                })
                .groupBy('district')


            // 選單1-district
            let districts = Object.keys(sortData)
            setSelectOpt(districts, distSelect, '區域')


            // 選單2-type(
            let types = Object.keys(orgData.groupBy('u'))
            setSelectOpt(types, typeSelect, '類型')

            // 選區
            // marker移到目標區域
            let districtValue
            let typeValue
            distSelect.addEventListener('change', function () {
                districtValue = distSelect.selectedOptions[0].value
                if (districtValue != '' || typeValue != '') {
                    search.disabled = false
                }
                if (districtValue == '' && typeValue == '') {
                    search.disabled = true
                }
                if (this.value != '') {
                    let countrys = sortData[this.value]
                    map.setView([countrys[0].lat, countrys[0].lng], 11)
                }
                setMarker()
            })


            // 選type
            typeSelect.addEventListener('change', function () {
                typeValue = typeSelect.selectedOptions[0].value
                if (districtValue != '' || typeValue != '') {
                    search.disabled = false
                }
                if (districtValue == '' && typeValue == '') {
                    search.disabled = true
                }

            })

            search.addEventListener('click', function () {
                map.removeLayer(markers)

                districtValue = distSelect.selectedOptions[0].value
                typeValue = typeSelect.selectedOptions[0].value

                let goalData
                if (districtValue != '' && typeValue != '') {
                    goalData = sortData[districtValue].filter(x => x.type == typeValue)
                    // console.log(goalData)
                    createTable(theadThArr, goalData)
                    conditionMarker(goalData)
                } else if (districtValue != '' && typeValue == '') {
                    goalData = sortData[districtValue]
                    // console.log(goalData)
                    createTable(theadThArr, goalData)
                    conditionMarker(goalData)
                } else if (districtValue == '' && typeValue != '') {
                    goalData = Object.keys(sortData).map(x => sortData[x].filter(y => y.type == typeValue))
                    // console.log(goalData)

                    // createTable
                    outcome.innerHTML = ""
                    table = document.createElement('table')
                    thead = createThead(theadThArr)
                    tbody = createTbody2(goalData)
                    table.append(thead, tbody)
                    outcome.appendChild(table)
                    table.className = "table table-bordered table-striped"

                    // conditionMarker(orgData.filter(x => x.u == typeValue))
                    removeLastSetting()

                    let redIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })

                    let data = orgData.filter(x => x.u == typeValue)
                    // console.log(data)
                    data.forEach(item => {
                        let mark
                        mark = L.marker([item.y, item.x], { icon: redIcon }).addTo(map)
                        mark.bindPopup(`
                            <h5>${item.name}</h5>
                            <p>服務內容:${item.content}</p>
                        `).addTo(map)
                        mark.on('mouseover', function (e) {
                            this.openPopup()
                        })
                        mark.on('mouseout', function (e) {
                            this.closePopup()
                        })
                        mark.addEventListener('click', function () {
                            if ((choseMark != null || choseMark != undefined) && document.querySelector(`#${choseMark}`) != null) {
                                document.querySelector(`#${choseMark}`).style.backgroundColor = 'unset'
                                // debugger
                            }
                            $('html,body').animate({ scrollTop: $(`#${x.name}`).offset().top - 8 }, 200)
                            document.querySelector(`#${x.name}`).style.backgroundColor = '#ceefe4'
                            choseMark = x.name
                        })
                        marks.push(mark)
                    })
                }

            })


        })
        .catch(err => {
            console.log('sorry there\'s something wrong')
        })

}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
}


// function
Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}

function setSelectOpt(optContentArr, selector, text) {
    const orgOpt = document.createElement('option')
    orgOpt.innerText = `----請選擇${text}----`
    orgOpt.value = ''
    selector.appendChild(orgOpt)
    optContentArr
        .forEach(x => {
            const opt = document.createElement('option')
            opt.innerText = x
            opt.value = x
            selector.appendChild(opt)
        })
}

function setMarker() {
    Object.keys(sortData).forEach(x => {
        let marker
        sortData[x].forEach((y, index) => {
            marker = L.marker([y.lat, y.lng])
            marker.bindPopup(`
                <h5>${y.name}</h5>
                <p>服務內容:${y.descrip}</p>
            `)
            // marker.addTo(map)
        })
        markers.addLayer(marker)
    })
    map.addLayer(markers)
}



function conditionMarker(dataArr) {

    removeLastSetting()

    let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    dataArr.forEach(x => {
        let mark
        mark = L.marker([x.lat, x.lng], { icon: redIcon }).addTo(map)
        console.log(mark)

        mark.bindPopup(`
                <h5>${x.name}</h5>
                <p>服務內容:${x.descrip}</p>
            `).addTo(map)
        mark.on('mouseover', function (e) {
            this.openPopup()
        })
        mark.on('mouseout', function (e) {
            this.closePopup()
        })
        mark.addEventListener('click', function () {
            if ((choseMark != null || choseMark != undefined) && document.querySelector(`#${choseMark}`) != null) {
                document.querySelector(`#${choseMark}`).style.backgroundColor = 'unset'

                // debugger
            }
            $('html,body').animate({ scrollTop: $(`#${x.name}`).offset().top - 8 }, 200)
            document.querySelector(`#${x.name}`).style.backgroundColor = '#ceefe4'
            choseMark = x.name
        })
        marks.push(mark)
    })

}

function removeLastSetting() {
    if (marks != undefined || marks != null) {
        marks.forEach(mark => {
            map.removeLayer(mark)
        })
    }
}




function createThead(titles) {

    let thead = document.createElement('thead')
    let tr = document.createElement('tr')

    titles.forEach(title => {
        let th = document.createElement('th')
        th.innerText = title

        tr.append(th)
    });
    thead.append(tr)

    //debugger;
    return thead
}

function createTbody(rowsArray) {
    let tbody = document.createElement('tbody')
    rowsArray.forEach(row => {
        let tr = document.createElement('tr')
        tr.setAttribute('id', row.name)
        for (let i = 0; i < 5; i++) {
            let td = document.createElement('td')
            switch (i) {
                case 0:
                    td.innerText = row.name;
                    break;
                case 1:
                    td.innerText = row.address;
                    break;
                case 2:
                    td.innerText = row.contact;
                    break;
                case 3:
                    td.innerHTML = row.type;
                    break;
                case 4:
                    td.innerText = row.descrip.replaceAll('"', '')
                    break;
                default:
                    break;
            }
            tr.append(td)
        }
        tbody.append(tr)
    })
    return tbody
}


function createTable(titles, rowsArray) {
    //Create a table dynamically
    outcome.innerHTML = ""
    table = document.createElement('table')
    thead = createThead(titles)
    tbody = createTbody(rowsArray)

    table.append(thead, tbody)

    outcome.appendChild(table)

    table.className = "table table-bordered table-striped"
}


function createTbody2(inputInfo) {
    let tbody = document.createElement('tbody')
    inputInfo.forEach((row, index) => {
        if (row.length == 0) {
            return
        } else {
            inputInfo[index].forEach((column) => {
                let tr = document.createElement('tr')
                tr.setAttribute('id', column.name)
                for (let i = 0; i < 5; i++) {
                    let td = document.createElement('td')
                    switch (i) {
                        case 0:
                            td.innerText = column.name;
                            tr.append(td)
                            break;
                        case 1:
                            td.innerText = column.address;
                            tr.append(td)
                            break;
                        case 2:
                            td.innerText = column.contact;
                            tr.append(td)
                            break;
                        case 3:
                            td.innerHTML = column.type;
                            tr.append(td)
                            break;
                        case 4:
                            td.innerText = column.descrip.replaceAll('"', '')
                            tr.append(td)
                            break;
                        default:
                            break;
                    }
                }
                tbody.append(tr)
            })
        }
    })
    return tbody
}



function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

