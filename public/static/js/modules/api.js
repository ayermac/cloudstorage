layui.define(['layer'], function(exports){
    var layer = layui.layer;

    var list = new Vue({
        el: '#mainlist',
        data: {
            post: {}
        }
    });
    /**
     * 获取列表
     */
    $.get('/api/cos/getlist', function (res) {
        console.log(res);
        if (res.code === 0) {
            list.post = res.data.infos;
            console.log(list.post);
        } else {
            layer.msg(res.message, function () {})
        }
    });
    exports('api', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});