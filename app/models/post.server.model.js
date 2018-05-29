"use strict";
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;    //模式构造器

var PostSchema = new Schema({
    title: {
        type: String,
        required: [true, "Post title is must"]
    },
    content: {
        type: String,
        required: [true, "Post Content is must"],
        validate: {
            validator: function (content) {
                return content.length >= 20;
            },
            message: 'Post content is too short'
        },
        author: {           //ref属性使用了User模型填充author字段
            type: Schema.ObjectId,
            ref: 'User'
        }
    }
});

Mongoose.model('Post', PostSchema); 