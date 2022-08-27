const { Builder, By, WebElement, WebDriver, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const fs = require('fs')

const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
        // // 輸入 chrome.exe 的位址
        // .setChromeBinaryPath()
        // .headless()
    )
    .build()

async function openPage(urlId) {
    // 開啟網頁
    await driver.get(`https://www.facebook.com/NTUA.Drama107/photos/${urlId}`)

    // 等待元素載入
    await driver.wait(
        until.elementLocated((By.css('.nch0832m.sglrnj1k.oxkhqvkx.jpugfq45 > span > div')))
        , 10000)
}

// input
// output webElement
async function getArticle() {
    // 取到完整文章
    const showMore = await driver.findElement(By.css('.nch0832m.sglrnj1k.oxkhqvkx.jpugfq45 > span > div'))

    await showMore.click()

    const webElement = await driver.findElement(By.css('.nch0832m.sglrnj1k.oxkhqvkx.jpugfq45 > span')).getText()

    return webElement
}

// input
// output id
async function getNextId() {
    // 取到下一篇網址的 id
    const nextPageHtml = (await driver.getPageSource()).valueOf()

    let index = nextPageHtml.indexOf('"id":"', nextPageHtml.indexOf("nextMedia")) + '"id":"'.length
    const end = nextPageHtml.indexOf('"', index)

    let nextId = nextPageHtml.slice(index, end)

    return nextId
}

// input
// output img
async function getImgUrl() {
    const imgElement = await driver.findElement(By.css('img[data-visualcompletion="media-vc-image"'))
    const imgUrl = await imgElement.getAttribute('src')

    return imgUrl
}

// input webElement
// output {group, titleAndName, describe}
async function personDetail(webElement) {
    // 提取需要的段落
    const person = {}

    const groupStart = 'Dear God·'
        , groupEnd = '▕'
        , titleAndNameStart = '\n\n'
        , titleAndNameEnd = '\n'
        , describeStart = '\n\n'
        , describeEnd = '\n-\n'

    const paragraphs = {
        group: [groupStart, groupEnd]
        , titleAndName: [titleAndNameStart, titleAndNameEnd]
        , describe: [describeStart, describeEnd]
    }

    let startHead

    for (i in paragraphs) {
        const { paragraph, end } = sliceString(webElement, startHead, paragraphs[i][0], paragraphs[i][1])
        person[i] = paragraph

        startHead = end
    }

    return person
}

async function mainAndOutput() {
    const people = []
    let urlId = '304303517911694'

    for (let i = 0; i < 43; i++) {
        await openPage(urlId)

        const text = await getArticle()
        const nextId = await getNextId()
        const imgUrl = await getImgUrl()

        urlId = nextId

        const person = await personDetail(text)

        person['imgUrl'] = imgUrl

        people.push(person)
    }

    console.log(people)

    driver.quit()

    // 寫入檔案
    fs.writeFile('people.json', JSON.stringify(people), (err) => { console.log(err) })
}

mainAndOutput()

// input (完整文章, 搜尋起始點, 開始前的字串, 結束後的字串)
// output {paragraph, end}
function sliceString(text, startHead, startSign, endSign) {
    const start = text.indexOf(startSign, startHead) + startSign.length
    const end = text.indexOf(endSign, start)

    const paragraph = text.slice(start, end)

    text = text.slice(end)

    return { paragraph, end }
}