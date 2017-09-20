layui.define(['layer'], function(exports){
    var layer = layui.layer;


    var list = new Vue({
        el: '#mainlist',
        data: {
            post: {}
        },
        watch: {
            post: function () {
                this.$nextTick(function () {
                    layer.msg('数据渲染完成');
                    $(".open_folder").on('click', function () {
                        var folder = $(this).attr('name');
                        console.log(folder);
                        getList('/'+folder);
                    });
                });
            }
        }
    });

    function getList(folder) {
        /**
         * 获取列表
         */
        $.get('/api/cos/getlist/folder' + folder, function (res) {
            console.log(res);
            if (res.code === 0) {
                list.post = res.data.infos;
                console.log(list.post);
            } else {
                layer.msg(res.message, function () {})
            }
        });
    }

    // 初始化列表
    getList('/');

    exports('api', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});