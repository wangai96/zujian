// http://www.cnblogs.com/fayin/p/6907849.html
// 验证方法
var VerifyPolicies = {
    isEmpty: function(value, errMsg) {
        if(value == '') return errMsg;
    },

    // 最小长度
    minLength: function(value, length, errMsg) {
        if (value.length < length) return errMsg;
    },
    // 手机号码
    isMobile: function(value, errMsg) {
        if(!/^1[34578]\d{9}$/.test(value)) return errMsg;
    },
    // 是否相等
    isEqualTo: function (value, toDom, errMsg) {
        var toValue = document.getElementById(toDom).value;

        if(value !== toValue) return errMsg;
    }
};

function FormValidator(VerifyPolicy) {
    this.verifyPolicies = VerifyPolicy ? VerifyPolicy : VerifyPolicies;
    // 待执行的验证函数数组
    this.validateFn = [];
}


FormValidator.prototype.add = function(dom, rules, errMsg) {
    var _this = this;

    this.validateFn.push(function() {
        var args = [];
        var rule = rules.split(':');
        var ruleName = rule[0];
        var ruleParam = rule[1];
        var value = dom.value;

        args.push(value);
        if(ruleParam) args.push(ruleParam.trim());
        args.push(errMsg);

        // 这里调用apply只是为了传参，如果支持ES6，也可以这样做：
        // return _this.verifyPolicies[ruleName](...args)
        return _this.verifyPolicies[ruleName].apply(null, args);
    })
};

FormValidator.prototype.single = function () {

};

FormValidator.prototype.start = function() {
    var fn = this.validateFn,
            len = fn.length;
    for(var i = 0; i< len ; i++) {
        var msg = fn[i]();
        if(msg && Object.keys(msg).length > 0) {
            return {
                index: i,
                msg: msg
            };
        }
    }

};