/**
 * Created by Administrator on 2017/3/13.
 */
define(function (require,exports,module) {
    var model=require('./index.js');
    var p=new model.Person('zhangsan',21);
    module.exports=p;
});