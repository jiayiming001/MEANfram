"use strict";
var Mongoose = require('mongoose'),
    crypto = require('crypto'),      //提供加密功能模块,node自带的模块
    Schema = Mongoose.Schema;    //模式构造器

var UserSchema = new Schema({
    firstName: String,
    lastName:  String,
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill a vaild e-mail address"]//使用正则匹配,只有被正则匹配才能被保存
    },
    username: {
        type: String,
        trim: true,  //mongoose的修饰符,trim去掉两端的空格
        unique: true, //唯一属性,不能重复
        required:'uername must not be null' //检查对应的值的是否存在
       
    },
    password: {
        type: String,
        validate: [           //自定义验证 当试图保存文档的密码少于6位时,抛出Password should be longer的错误给回调函数
            function (password) {
                return password && password.length >= 6;
            },
            'Password should be longer'
        ] 
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },

    providerId: String,
    prociderData: {},
    role: {
        type: String,
        enum: ['Admin', 'Owner', 'User']
    },
    created: {
        type: Date,
        default: Date.now
    },
    // website: {
    //     type: String,
    //     set: function (url) {   //自定义setter修饰符,以便在保存文档前执行数据操作 setter修饰符(保存前)
    //         if(!url) {           //保证url前面有http://
    //             return url;
    //         } else {
    //             if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
    //                 url = "http://" + url;
    //             }
    //             return url;
    //         }
    //     }
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
    // },

});


//在res.json()等方法的时候,文档会被转化为JSON默认不会执行getter修饰符,调用这个使其强制执行
// UserSchema.set(true,'toJSON', { getter: true }); 


//虚拟属性
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function (fullname) {
    var split = fullname.split(' ');
    this.firstName = split[0] || '';
    this.lastName = split[1] || '';
});

//静态方法(只能在操控模型层)  RegExp()构造函数返回的是正则对象
// UserSchema.statics.findOneByUsername = function (username, callback) {
//     this.findOne({username: new RegExp(username, 'i')}, callback);  
// };


//实例方法:哈希密码
UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString();
};

//实例方法:验证密码(先哈希再比较)(可以处理实例化后的对象)
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

//静态方法:寻找一个不同的用户名
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
         username: possibleUsername
    }, function(err, user) {
        if(!err) {
            if(!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};

//实例方法(可以处理实例化后的对象)
// UserSchema.methods.authenticate = function (password) {
//     return this.password === password;
// };

//mongoose预处理中间件(在文档保存前执行)
UserSchema.pre('save', function (next) {
    if(this.password) {             
        this.salt = new            //先产生瞬间二进制数16位,然后在用'base64'编码生成字符串,在解码
            Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});


//mongoose后置处理中间件(在文档保存后执行)
UserSchema.post('save', function (doc) {
    if(this.isNew) {        //isNew用来确定是创建操作还是更新操作
        console.log('A new user was created');
    } else {
        console.log('A user updated is details');
    }
});


UserSchema.set('toJSON', { 
    virtuals: true,
    setters: true 
}); //文档转化为JSON时,强制执行虚拟属性


Mongoose.model('User', UserSchema); //创建一个User模型