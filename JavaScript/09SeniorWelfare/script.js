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
            let distSelect = document.querySelector('#district')
            setSelectOpt(districts, distSelect)


            // 選單2-type(
            let types = Object.keys(orgData.groupBy('u'))
            // console.log(types)
            let typeSelect = document.querySelector('#type')
            setSelectOpt(types, typeSelect)

            // 選區,產生表格
            // marker移到目標區域
            document.querySelector('#district')
                .addEventListener('change', function () {
                    // console.log(this.value)
                    if (this.value != '') {
                        let countrys = sortData[this.value]
                        map.setView([countrys[0].lat, countrys[0].lng], 11)
                    }
                    districtSelected(event, sortData)
                    setMarker()
                })


            // 選type,產生表格
            document.querySelector('#type').addEventListener('change', function () {
                typeSelected(event, sortData)
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

function setSelectOpt(optContentArr, selector) {
    const orgOpt = document.createElement('option')
    orgOpt.innerText = '請選擇'
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

function districtSelected(event, groupObj) {
    let selectDistrict = groupObj[event.target.value]
    // console.log(selectDistrict)
    createTable(selectDistrict)

    return selectDistrict
}

function typeSelected(event, groupObj) {
    let result = []
    Object.keys(groupObj).forEach(x => {
        let data = groupObj[x]
        let filterarr = data.filter(y => y.type == event.target.value)
        result = result.concat(filterarr)
    })

    createTable(result)
}

function createTable(inputInfo) {
    document.querySelector('.info .col-12').innerHTML = ''
    let table = document.createElement('table')
    table.classList.add('table', 'table-bordered', 'table-striped', 'text-center', 'align-middle')

    // tbody
    let tbody = document.createElement('tobdy')
    let theadTr = document.createElement('tr')
    theadThArr.forEach(item => {
        let th = document.createElement('th')
        th.innerText = item
        theadTr.appendChild(th)
    })
    tbody.appendChild(theadTr)

    inputInfo.forEach(organization => {
        let tr = document.createElement('tr')
        // console.log(organization)
        Object.keys(organization).forEach((y, index) => {
            // console.log(y)
            if (index < 5) {
                let td = document.createElement('td')
                switch (index) {
                    case 0:
                        td.innerText = organization['name'];
                        break;
                    case 1:
                        td.innerText = organization['address'];
                        break;
                    case 2:
                        td.innerText = organization['contact'];
                        break;
                    case 3:
                        td.innerHTML = organization['type'];
                        break;
                    case 4:
                        td.innerText = organization['descrip'].replaceAll('"', '')
                        break;
                    default:
                        break;
                }
                tr.appendChild(td)
            }
        })
        tbody.appendChild(tr)
    })
    table.append(tbody)


    document.querySelector('.info .col-12').append(table)

}



