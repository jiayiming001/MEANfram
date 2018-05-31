'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AritcleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title can not be blank'
    },
    content: {
        type: String, 
        trim: true,
        default: ''
    },
    //ref属性使用了User模型填充author字段,检索的时候aritcle.find().populate('creator')来填充creator字段
    creator: {            
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Article', AritcleSchema);