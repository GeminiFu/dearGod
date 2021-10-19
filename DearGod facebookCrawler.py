from selenium import webdriver
from bs4 import BeautifulSoup
import json
driverPath = 'C:\Users\User\Desktop\前端工程師\作品集\deargod\chromedriver'
driver = webdriver.Chrome(executable_path=driverPath)

# 設定要前往的網址
url = 'https://www.facebook.com/NTUA.Drama107/photos/304303517911694'
person = [[], [], [], [], [], [], [], []]


# 跑 43
for i in range(43):
    # 前往該網址
    driver.get(url)

    # 取得網頁原始碼
    soup = driver.page_source

    # 取得文章內容
    # 從 'Dear God\\u00b7' 取到 '\\u5287\\u4f5c\\u5bb6\\uff5c\\u99ae\\u52c3\\u68e3'
    start = soup.find('Dear God\\u00b7')
    end = soup.find('\\u5287\\u4f5c\\u5bb6\\uff5c\\u99ae\\u52c3\\u68e3')
    whole_text = soup[start:end]

    # 名字 從 '\\n\\nDear' 反方向找到 '\\u00b7'
    # 從'\\u00b7' + len('\\u00b7') 開始擷取到 '\\n\\nDear'
    start = whole_text.find('\\n\\nDear')
    name = whole_text[whole_text.rfind(
        '\\u00b7', 0, start) + len('\\u00b7'):start]
    # 文字錯誤BUG
    if len(name) > 18:
        name = '\\u80e1\\u54c1\\u542b'

    # 照片 找 as 屬性為 'image' 元素的 href 元素
    html = BeautifulSoup(soup, 'html.parser')
    sel = html.find(attrs={'as': 'image'})
    img = sel['href']
    # print (img)

    # 文字 從 '\\n\\nDear' + '\\n\\nDear'.length 開始到 '\\u570b\\u7acb\\u81fa'
    start = whole_text.find('\\n\\nDear') + len('\\n\\nDear')
    end = whole_text.find('\\u570b\\u7acb\\u81fa')
    text = whole_text[start:end].replace('\\n', '<br>')
    # print(text)

    # 職務名稱 從 '\\u2595 \\n\\n' 擷取到 '\\u00b7'
    start = whole_text.find('\\u2595 \\n\\n') + len('\\u2595 \\n\\n')
    end = whole_text.find('\\u00b7', start)
    title = whole_text[start:end]
    # 文字錯誤BUG
    if len(title) > 60:
        title = '\\u2746 \\u5316\\u599d\\u57f7\\u884c'
    # 演員
    if title == "\\u2661\\u6f14\\u54e1":
        start = whole_text.find('\\u00b7', end + len('\\u00b7'))
        title += '\\u00b7 ' + whole_text[end + len('\\u00b7'):start]

    # 組別 從 'Dear God\\u00b7' + 'Dear God\\u00b7'.length 開始到 '\\u2595 \n\n'
    start = whole_text.find('Dear God\\u00b7') + len('Dear God\\u00b7')
    end = whole_text.find('\\u2595 \\n\\n')
    group = whole_text[start:end]
    # print(group)

    # 辨別 group 是什麼，放入對應的矩陣內
    if group == '\\u5c0e\\u8868\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[0].append(director_and_performer)
    elif group == '\\u821e\\u76e3\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[1].append(director_and_performer)
    elif group == '\\u5316\\u599d\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[2].append(director_and_performer)
    elif group == '\\u884c\\u653f\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[3].append(director_and_performer)
    elif group == '\\u670d\\u88dd\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[4].append(director_and_performer)
    elif group == '\\u71c8\\u5149\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[5].append(director_and_performer)
    elif group == '\\u97f3\\u6a02\\u97f3\\u6548\\u7d44':
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[6].append(director_and_performer)
    else:
        director_and_performer = {'name': name,
                                  'title': title, 'img': img, 'text': text}
        person[7].append(director_and_performer)

    # 從 \"nextMedia\" 之後找到 \"id\"\:\"
    # 從 \"id\"\:\" 取到 \"
    start = soup.find("nextMedia")
    start = soup.find('\"id\":\"', start) + len('\"id\"\:\"') - 1
    end = soup.find('\"', start)
    url = 'https://www.facebook.com/NTUA.Drama107/photos/' + soup[start:end]


# 關閉瀏覽器
driver.quit()

# print(person)

# 存入至 data.json
file = 'C:\\Users\\User\\Desktop\前端工程師\\sPj\\sPj-DramaPage\\deargod.json'
with open(file, 'w') as obj:
    json.dump(person, obj)
    print('done')
