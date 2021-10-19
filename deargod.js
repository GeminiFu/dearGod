function stringToUnicode(stringCode) {
    var start = 0, end = 0, codeId, newWord, tillNotFound = "True";
    // 進入迴圈 沒找到 "\\u" 跳出迴圈
    while (tillNotFound) {
        // 預先判斷有沒有找到文字
        tillNotFound = stringCode.includes("\\u", end);
        // stringCode 找 "\\u" 後面的 codeId
        start = stringCode.indexOf("\\u");
        end = start + "\\u".length + 4;
        codeId = stringCode.slice(start + "\\u".length, end);
        // 有找到 "\\u"；沒有則跳過
        // 轉換成新的文字
        newWord = String.fromCodePoint(parseInt(codeId, 16));
        // stringCode += 前面的字串 + 新的文字 + 後面的字串
        stringCode = stringCode.slice(0, start) + newWord + stringCode.slice(end);
    }
    // 回傳 stringCode
    return stringCode;
}


// 依組歸類
var personList,
    personByGroup = document.querySelectorAll(".intro_person > div");
window.onload = function () {
    var url = "./deargod.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    var request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            personList = JSON.parse(request.responseText);
            var idNumber;
            for (let i = 0; i < personList.length; i++) {
                for (var j = 0; j < personList[i].length; j++) {
                    var name = stringToUnicode(personList[i][j]["name"]);
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