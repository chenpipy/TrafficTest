/**
 * Created by Steven on 2016-10-25.
 */
var oTxt = document.getElementById('txt');
var oBtn = document.getElementById('btn');
var oList = document.getElementById('list');

var fruits = ["怀南路与南环路交叉路口北向南","怀南路与南环路交叉路口东向西","怀南路与南环路交叉路口南向北","怀南路与南环路交叉路口西向东","天星东路与湖天大道交叉路口北向南","天星东路与湖天大道交叉路口东向西","天星东路与湖天大道交叉路口南向北","天星东路与湖天大道交叉路口西向东","天星东路与绵溪南路交叉路口北向南","天星东路与绵溪南路交叉路口东向西","天星东路与绵溪南路交叉路口南向北","天星东路与绵溪南路交叉路口西向东","天星中路与红星路交叉路口北向南","天星中路与红星路交叉路口东向西","天星中路与红星路交叉路口南向北","天星中路与红星路交叉路口西向东","舞水路与榆市路交叉路口北向南","舞水路与榆市路交叉路口东向西","舞水路与榆市路交叉路口南向北","舞阳大道与滨江路交叉路口由北向南","舞阳大道与滨江路交叉路口由东向西","舞阳大道与滨江路交叉路口由南向北","舞阳大道与滨江路交叉路口由西向东","迎丰路与顺天路交叉路口北向南","迎丰路与顺天路交叉路口东向西","迎丰路与顺天路交叉路口南向北","迎丰路与顺天路交叉路口西向东","迎丰路与红星路交叉路口东向西","迎丰路与红星路交叉路口南向北","迎丰路与红星路交叉路口西向东","迎丰路与湖天北路交叉路口北向南","迎丰路与湖天北路交叉路口南向北","迎丰路与湖天北路交叉路口西向东","迎丰路与湖天北路交叉路口东向西","迎丰路与锦溪南路交叉路口北向南","迎丰路与锦溪南路交叉路口东向西","迎丰路与锦溪南路交叉路口南向北","迎丰路与锦溪南路交叉路口西向东","迎丰路与人民路交叉路口北向南","迎丰路与人民路交叉路口东向西","迎丰路与人民路交叉路口南向北","迎丰路与人民路交叉路口西向东","正清路与红星路交叉路口北向南","正清路与红星路交叉路口东向西","正清路与红星路交叉路口南向北","正清路与湖天大道交叉路口北向南","正清路与湖天大道交叉路口东向西","正清路与湖天大道交叉路口南向北","正清路与湖天大道交叉路口西向东","正清路与锦园路交叉路口北向南","正清路与锦园路交叉路口东向西","正清路与锦园路交叉路口南向北","正清路与锦园路交叉路口西向东","正清路与顺天路交叉路口北向南","正清路与顺天路交叉路口东向西","正清路与顺天路交叉路口南向北","正清路与顺天路交叉路口西向东","湖天北大道路段","湖天北大道路段","湖天南大道段","湖天南大道段","怀北高速路口段","怀北高速路口段","怀西高速路口段","怀西高速路口段","黄岩路段","黄岩路段","南环五桥路段","南环五桥路段","舞阳南大道路段","舞阳南大道路段","怀化高铁南站高堰路东向西","怀化高铁南站高堰路西向东","象鼻子至麻阳卡口出城","象鼻子至麻阳卡口进城","杨村高速路收费站进城","杨村高速路收费站出城","钟坡后山南段卡口-中坡山游乐场-西向东","钟坡后山南段卡口-中坡山游乐场-东向西","城东出入城卡口进城","城东出入城卡口出城","新怀南高速路收费站进城","新怀南高速路收费站出城1","新怀南高速路收费站出城2","顺天路与花溪路路口-由南往北","顺天路与花溪路路口-由东往西","顺天路与花溪路路口-由北往南","顺天路与花溪路路口-由西往东","怀化学院西校区卡口东向西","怀化学院西校区卡口西向东","天星西路与舞阳大道路口-由东往西","天星西路与舞阳大道路口-由北往南","天星西路与舞阳大道路口-由西往东","天星西路与舞阳大道路口-由南往北","北环路与209国道卡口(象鼻子卡口)进城","北环路与209国道卡口(象鼻子卡口)出城","天星西路与府星路路口-由东往西","天星西路与府星路路口-由西往东","天星西路与府星路路口-由北往南","天星西路与神龙路路口-东往西","天星西路与神龙路路口-南往北","天星西路与神龙路路口-西往东","天星西路与神龙路路口-北往南","怀东泸阳卡口-进城","怀化市怀南至鸭嘴岩卡口-进城","怀化市杨村卡口-进城","怀化市杨村卡口-出城","怀化市芷江路卡口-进城","怀化市芷江路卡口-出城","人民路与鹤州路交叉路口","人民路与鹤州路交叉路口","人民路与鹤州路交叉路口","怀化市怀南至鸭嘴岩卡口-出城","怀东泸阳卡口-出城"];
//点击事件
oBtn.addEventListener('click', function(){
    var keyWord = oTxt.value;
    // var fruitList = searchByIndexOf(keyWord,fruits);
    console.log(fruitList);
    var fruitList = searchByRegExp(keyWord, fruits);
    renderFruits(fruitList);
}, false);
//回车查询
oTxt.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
        var keyWord = oTxt.value;
        // var fruitList = searchByIndexOf(keyWord,fruits);
        var fruitList = searchByRegExp(keyWord, fruits);
        renderFruits(fruitList);
    }
}, false);

function renderFruits(list){
    if(!(list instanceof Array)){
        return ;
    }
    oList.innerHTML = '';
    var len = list.length;
    var item = null;
    for(var i=0;i<len;i++){
        item = document.createElement('li');
        item.innerHTML = list[i];
        oList.appendChild(item);
    }
}

//模糊查询1:利用字符串的indexOf方法
function searchByIndexOf(keyWord, list){
    if(!(list instanceof Array)){
        return ;
    }
    var len = list.length;
    var arr = [];
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        if(list[i].indexOf(keyWord)>=0){
            arr.push(list[i]);
        }
    }
    return arr;
}
//正则匹配
function searchByRegExp(keyWord, list){
    if(!(list instanceof Array)){
        return ;
    }
    var len = list.length;
    var arr = [];
    var reg = new RegExp(keyWord);
    for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        if(list[i].match(reg)){
            arr.push(list[i]);
        }
    }
    return arr;
}
renderFruits(fruits);