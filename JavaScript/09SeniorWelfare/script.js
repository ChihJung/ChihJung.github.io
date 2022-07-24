// org website     https://data.gov.tw/dataset/126517
// data            http://tnsmap.tainan.gov.tw/api/list.aspx?org=20130118171933

// 23.9666584,119.644869,8z

// 宣告
let orgData
let sortData
let sortType
let markers = L.markerClusterGroup()
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
            // console.log(districts)
            setSelectOpt(districts, distSelect, '區域')


            // 選單2-type(
            let types = Object.keys(orgData.groupBy('u'))
            // console.log(types)
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
                // console.log(this.value)
                if (this.value != '') {
                    let countrys = sortData[this.value]
                    map.setView([countrys[0].lat, countrys[0].lng], 11)
                }
                // districtSelected(event, sortData)
                setMarker()
            })


            // 選type
            typeSelect.addEventListener('change', function () {
                // typeSelected(event, sortData)
                typeValue = typeSelect.selectedOptions[0].value
                if (districtValue != '' || typeValue != '') {
                    search.disabled = false
                }
                if (districtValue == '' && typeValue == '') {
                    search.disabled = true
                }

            })

            search.addEventListener('click', function () {
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
                    console.log(goalData)
                    outcome.innerHTML = ""
                    table = document.createElement('table')
                    thead = createThead(theadThArr)
                    tbody = createTbody2(goalData)

                    table.append(thead, tbody)

                    outcome.appendChild(table)

                    table.className = "table table-bordered table-striped"
                }

            })


        })
        .catch(err => {
            console.log('sorry there\'s something wrong')
        })

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
        sortData[x].forEach(y => {
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
    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
    dataArr.forEach(x =>{
        L.marker([x.lat, x.lng], { icon: redIcon }).addTo(map)
    })

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
                tr = document.createElement('tr')
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
            })
        }
        tbody.append(tr)
    })
    return tbody
}



