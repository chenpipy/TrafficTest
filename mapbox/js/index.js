/**
 * Created by Administrator on 2017/3/13.
 */
define(function (require,exports,module) {
    var Person=function (name,age) {
        this.name=name;
        this.age=age;
    }
    module.exports.Person=Person;
});