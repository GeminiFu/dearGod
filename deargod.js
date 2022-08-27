window.onload = function () {
    const url = "./people.json"
    const request = new XMLHttpRequest()
    request.open("get", url)/*设置请求方法与路径*/
    request.send(null)/*不发送数据到服务器*/

    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            const personList = JSON.parse(request.responseText)
                , introPerson = document.querySelectorAll(".intro_person")[0]

            console.log(personList)
            console.log(introPerson)

            let idNumber = 0;
            for (let i = 0; i < personList.length; i++) {
                for (var j = 0; j < personList[i].length; j++) {
                    var img = personList[i][j]["img"];
                    var title = stringToUnicode(personList[i][j]["title"]);
                    var text = stringToUnicode(personList[i][j]["text"]);
                    personByGroup[i].innerHTML += `
                        <div class="intro_who">
                            <div class="intro_basic" data-person-id=${idNumber}>
                                <img class="img_round" src=${img} alt="">
                                <p class="intro_person_name">${name}</p>
                                <p>${title}</p>
                            </div>
                            <p class="intro_text">${text}</p>
                        </div>`;
                    idNumber++;
                }
            }

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

                console.log(peopleDataByGroup[group])

                for (const [index, person] of peopleDataByGroup[group].entries()) {
                    introPerson.innerHTML += `
                    <div class="intro_who">
                        <div class="intro_basic" data-person-id=${index}>
                            <img class="img_round" src=${person.imgUrl} alt="">
                            <p class="intro_person_name">${person.titleAndName}</p>
                        </div>
                        <p class="intro_text">${person.describe}</p>
                    </div>`
                }
            }

            function buildGroupData(group) {
                const deleteIndex = []
                peopleDataByGroup[group] = []

                for (const [index, value] of personList.entries()) {

                    if (value.group === group) {
                        peopleDataByGroup[group].push(value)
                        deleteIndex.push(index)
                    }
                }

                for (i of deleteIndex) {
                    personList.splice(i, 1)
                }

                console.log(personList)
                console.log(peopleDataByGroup)
            }

            buildPersonElementByGroup('導表組')

            // 按鈕點擊事件
            $(".intro_group > input").click(function () {
                // button事件
                // 刪除 .button_onclick
                $(".button_onclick")[0].classList.remove("button_onclick");
                // 增加 button_onclick
                this.classList.add("button_onclick")

                // group 事件
                // 刪除 .intro_group_show
                $(".intro_group_show")[0].classList.remove("intro_group_show");
                var id = this.dataset.group,
                    group = document.getElementsByClassName("intro_person_group");
                // 找到按鈕相對應的 group
                for (var i = 0; i < group.length; i++) {
                    if (group[i].dataset.group == id) {
                        group[i].classList.add("intro_group_show");
                    }
                }

                // title 事件
                $(".title")[0].innerHTML = this.value;
            })
        }
    }
}