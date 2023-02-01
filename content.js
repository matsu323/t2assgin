const url = 'https://t2schola.titech.ac.jp/calendar/view.php'
var veryLongText = ''; // 細切れの値をここに結合していく。
const decoder = new TextDecoder();
window.onload = function () {
  fetch(url, {
    'method': 'GET'
  })
  .then((response) => response.body.getReader()) // ReadableStreamを取得する。
  .then((reader) => {
    // ReadableStream.read()はPromiseを返す。
    // Promiseは{ done, value }として解決される。
    function readChunk({done, value}) {
      if(done) {
        // 読み込みが終わっていれば最終的なテキストを表示する。
        // console.log(veryLongText);
        parse();
        return ;
      }

      veryLongText += decoder.decode(value);

      // 次の値を読みにいく。
      reader.read().then(readChunk);
    }
    
    
    reader.read().then(readChunk);
    
  });
}
function parse() {
    var parser = new DOMParser();
    var html = parser.parseFromString(veryLongText, "text/html")
    // console.log(html.querySelectorAll('.col-11'))
    
    // div.innerHTML = veryLongText; 
    // document.body.appendChild(div); //bodyに追加
    // // console.log(document.getElementById('col-11')); //abc
    // console.log(div)
    let result = [];
    let targetParent = Array.from(html.querySelectorAll('.m-t-1'));
    // console.log(targetParent)
    targetParent.forEach(function (element) {
        let targetList = Array.from(element.querySelectorAll('.col-11'));
        // console.log(targetList)
        let outputlist = [];
        if (targetList.length == 4) {
            targetList.forEach(function (value, index) {
                if (index != 1 &&index!=2) {
                    outputlist.push(value.innerText)   
                }
            });
                // result.push([element[0],element[1],element[3]])
        } else {
            targetList.forEach(function(value, index){
                if (index != 1 ) {
                    outputlist.push(value.innerText)   
                }
            });
                // result.push([element[0],element[1],element[2]])
        }
        result.push(outputlist)
    });
    let div = document.createElement("div");
    var temp = "<table>";
    temp += "<tr><td>提出時間</td><td>講義名</td></tr>";
    result.forEach(function (value) {
        div.textContent = temp;
        temp += "<tr><td>"+ value[0]+"</td><td>"+value[1].slice(0,6)+"</td></tr>";
    });
    temp +="</table>"
    div.innerHTML = temp;
    // console.log(result)
    var output = document.getElementById("region-main")
    output.insertBefore(div, output.firstElementChild)
}