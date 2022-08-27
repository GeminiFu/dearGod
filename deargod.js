window.onload = function () {
    const url = "./people.json"
    const request = new XMLHttpRequest()
    request.open("get", url)/*设置请求方法与路径*/
    request.send(null)/*不发送数据到服务器*/

    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            const personList = JSON.parse(request.responseText)
                , introPerson = document.querySelectorAll(".intro_person")[0]
            // 建立一個物件依組別存取
            const peopleDataByGroup = {}

            // 一個函式
            // if (peopleDataByGroup[group])
            // false: 在資料內建立資料
            // 透過資料建立 element
            function buildPersonElementByGroup(group) {
                if (!peopleDataByGroup.hasOwnProperty(group)) {
                    buildGroupData(group)
                }

                introPerson.innerHTML = ''

                for (const [index, person] of peopleDataByGroup[group].entries()) {
                    introPerson.innerHTML += `
                    <div class="intro_who" data-group=${person.group} data-id=${index}>
                        <div class="intro_basic">
                            <img class="img_round" src=${person.imgUrl} alt="">
                            <p class="intro_person_title">${person.title}</p>
                            <p class="intro_person_name">${person.name}</p>
                        </div>
                    </div>
                    `
                }

                // personDetailClickEvent()
            }

            // TODO: 詳細介紹
            function personDetailClickEvent() {
                const elements = [...document.getElementsByClassName('intro_who')]

                console.log(elements)

                for (const element of elements) {
                    element.addEventListener('click', () => {
                        const group = element.dataset.group
                        const id = element.dataset.id
                        const person = peopleDataByGroup[group][id]

                        console.log(person)
                        element.innerHTML = `
                        <div class="intro_basic">
                            <img class="img_round" src=${person.imgUrl} alt="">
                            <p class="intro_person_title">${person.title}</p>
                            <p class="intro_person_name">${person.name}</p>
                        </div>
                        <p>${person.describe}</p>
                        `
                    })
                }
            }

            function buildGroupData(group) {
                const deleteIndex = []
                peopleDataByGroup[group] = []

                for (const [index, value] of personList.entries()) {

                    if (value.group === group) {
                        peopleDataByGroup[group].push(value)
                        deleteIndex.unshift(index)
                    }
                }

                for (i of deleteIndex) {
                    personList.splice(i, 1)
                }
            }

            // 按鈕點擊事件
            const navByGroupButton = [...document.getElementsByName('navByGroupButton')]

            for (const element of navByGroupButton) {
                element.addEventListener('click', () => {
                    const group = element.value

                    buttonClickStyle(element)
                    buildPersonElementByGroup(group)
                })
            }

            navByGroupButton[0].click()

            function buttonClickStyle(element) {
                const buttonClicked = document.getElementsByClassName('button_onclick')[0]
                buttonClicked.classList.remove("button_onclick");
                element.classList.add("button_onclick")
            }
        }
    }
}