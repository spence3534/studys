"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var Request;
(function (Request) {
    var Get;
    (function (Get) {
        function get(url) {
            return new Promise(function (resolve) {
                resolve("\u8BF7\u6C42url\u4E3A" + url);
            });
        }
        Get.get = get;
    })(Get = Request.Get || (Request.Get = {}));
})(Request = exports.Request || (exports.Request = {}));
(function (Request) {
    var Post;
    (function (Post) {
        function post(url, data) {
            return new Promise(function (resolve) {
                resolve("\u8BF7\u6C42url\u4E3A" + url);
            });
        }
        Post.post = post;
    })(Post = Request.Post || (Request.Post = {}));
})(Request = exports.Request || (exports.Request = {}));
//# sourceMappingURL=get.js.map