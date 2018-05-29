"use strict";
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;    //模式构造器

var UserSchema = new Schema({
    firstName: String,
    lastName:  String,
    email: {
        type: String,
        index: true   //辅助索引
    },
    username: {
        type: String,
        trim: true,  //mongoose的修饰符,trim去掉两端的空格
        unique: true, //唯一属性,不能重复
        required: [true, 'uername must not be null'],  //检查对应的值的是否存在
        match: /.+\@.+\..+/  //使用正则匹配,只有被正则匹配才能被保存
    },
    password: {
        type: String,
        validate: [           //自定义验证 当试图保存文档的密码少于6位时,抛出Password should be longer的错误给回调函数
            function (password) {
                return password.length >= 6;
            },
            'Password should be longer'
        ] 
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User']
    },
    created: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String,
        set: function (url) {   //自定义setter修饰符,以便在保存文档前执行数据操作 setter修饰符(保存前)
            if(!url) {           //保证url前面有http://
                return url;
            } else {
                if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                    url = "http://" + url;
                }
                return url;
            }
        },
        // get: function (url) {    自定义getter修饰符,在文档向下级输出之前,对文档进行修改.
        //     if(!url) {
        //         return url;
        //     } else {
        //         if(url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
        //             url = "http://" + url;
        //         }
        //         return url;
        //     }
        // }
    },

});


//在res.json()等方法的时候,文档会被转化为JSON默认不会执行getter修饰符,调用这个使其强制执行
// UserSchema.set('toJSON', { getter: true }); 


//虚拟属性
UserSchema.virtual('fullname').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullname) {
    var split = fullname.split(' ');
    this.firstName = split[0];
    this.lastName = split[1];
});

//静态方法(只能在操控模型层)  RegExp()构造函数返回的是正则对象
UserSchema.statics.findOneByUsername = function (username, callback) {
    this.findOne({username: new RegExp(username, 'i')}, callback);  
};

//实例方法(可以处理实例化后的对象)
UserSchema.methods.authenticate = function (password) {
    return this.password === password;
};

//mongoose预处理中间件(在文档保存前执行)
UserSchema.pre('save', function (next) {

});


//mongoose后置处理中间件(在文档保存后执行)
UserSchema.post('save', function (doc) {
    if(this.isNew) {        //isNew用来确定是创建操作还是更新操作
        console.log('A new user was created');
    } else {
        console.log('A user updated is details');
    }
});


UserSchema.set('toJSON', { virtuals: true }); //文档转化为JSON时,强制执行虚拟属性
Mongoose.model('User', UserSchema); //创建一个User模型