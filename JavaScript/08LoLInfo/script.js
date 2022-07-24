// 宣告
const url = 'https://ddragon.leagueoflegends.com/cdn/10.22.1/data/zh_TW/champion.json'
let championObj = {}
let namesArr = []
let heroArr = []

// DOM
let row = document.querySelector('.row')
let modalPart = document.querySelector('.modal-part')
let cardTemplate = document.querySelector('#cardTemp')
// window.onload
window.onload = function () {

    document.querySelector('.container').display = 'none'
    document.querySelector('#call-ajax').addEventListener('click', () => {
        // fetch
        fetch(url)
            .then(resp => resp.json())
            .then(result => {
                document.querySelector('.container').display = 'block'
                championObj = result.data
                namesArr = Object.keys(championObj)

                // 資料拿到後 先map出我要的東西成新的陣列
                namesArr.forEach((heroName, index) => {
                    // console.log(heroName)
                    let nameCorVal = Object.values(championObj[heroName])
                    // console.log(nameCorVal[10])
                    let heroObj = {
                        english: championObj[heroName].id,
                        chinese: championObj[heroName].name,
                        img: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${heroName}_0.jpg`,
                        descrip: championObj[heroName].blurb,
                        hp: nameCorVal[10].hp,
                        movespeed: nameCorVal[10].movespeed,
                        armor: nameCorVal[10].armor,
                        spellblock: nameCorVal[10].spellblock,
                        attackrange: nameCorVal[10].attackrange
                    }
                    heroArr.push(heroObj)
                })
                // console.log(heroArr)
                heroArr.forEach((hero, index) => {
                    row.append(setCard(index, hero.english, hero.chinese, hero.img, hero.descrip))

                    let detailBtn = document.querySelectorAll('.more')
                    let videoBtn = document.querySelectorAll('.video')

                    let infoObj = {
                        name: `${hero.english} - ${hero.chinese}`,
                        url: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${hero.english}_0.jpg`,
                        hp: hero.hp,
                        speed: hero.movespeed,
                        armor: hero.armor,
                        spell: hero.spellblock,
                        attack: hero.attackrange
                    }
                    detailBtn[index].setAttribute('info', `${JSON.stringify(infoObj)}`)
                    videoBtn[index].setAttribute('name', `${hero.english} - ${hero.chinese}`)

                    detailBtn[index].addEventListener('click', setImgModal.bind(event))
                    videoBtn[index].addEventListener('click', setVideoModal.bind(event))

                })
            })

    })

}

// function
function setCard(index, name1, name2, url, descrip) {
    let cloneCard = cardTemplate.content.cloneNode(true)
    cloneCard.querySelector('h2').innerText = `${index + 1} : ${name1} - ${name2}`
    cloneCard.querySelector('img').src = url
    cloneCard.querySelector('.card-text').innerText = `${descrip.substring(0, 25)}...`

    // console.log(`${descrip.substring(0,25)}...`)
    return cloneCard
}

function setImgModal(event) {
    let mBody = document.querySelector('.modal-body')
    mBody.innerHTML = ''
    let info = JSON.parse(event.target.getAttribute('info'))
    document.querySelector('h3').innerText = info.name
    let imgTag = document.createElement('img')

    imgTag.src = info.url
    imgTag.style.width = '100%'
    mBody.append(imgTag)

    for (let i = 0; i < 5; i++) {
        let span = document.createElement('span')
        switch (i) {
            case 0:
                span.innerText = `hp : ${info.hp}`
                break;
            case 1:
                span.innerText = `movespeed : ${info.speed}`
                break;
            case 2:
                span.innerText = `armor : ${info.armor}`
                break;
            case 3:
                span.innerText = `spellblock : ${info.spell}`
                break;
            case 4:
                span.innerText = `attackrange : ${info.attack}`
                break;
            default:
                break;
        }



        span.style.display = 'block'
        mBody.append(span)
    }

}

function setVideoModal(event) {
   
    let info = event.target.getAttribute('name')
    document.querySelector('#video-title').innerText = info

    let iframe = document.querySelector('iframe')
    iframe.src = 'https://www.youtube.com/embed/d2eA8wDBEXw'

    iframe.classList.add('w-100')
}

