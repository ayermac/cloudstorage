/**
 项目JS主入口
 **/
layui.define(['layer', 'form', 'element'], function(exports){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;

    $('.open_setting').on('click', function () {
        var index = layer.open({
            type: 2,
            title: '设置',
            shadeClose: false,
            shade: 0.6,
            maxmin: false,
            area: ['600px', '500px'],
            content: '/index/index/setting' //iframe的url
        });
        if(window.screen.width < 768) {
            layer.full(index);
        }
    });

    $('.open_upload').on('click', function () {
        var index = layer.open({
            type: 2,
            title: '上传',
            maxmin: false,
            shadeClose: false,
            shade: 0.6,
            area: ['600px', '500px'],
            content: '/index/index/uploadpage', //iframe的url
            end: function () {
                window.location.reload();
            }
        });
        if(window.screen.width < 768) {
            layer.full(index);
        }
    });

    // 监听提交
    form.on('submit(setting)', function(data){
        var index;
        $.ajax({
            url: data.form.action,
            type: data.form.method,
            data: $(data.form).serialize(),
            beforeSend: function() {
                index = layer.load(2);
            },
            success: function (res) {
                if (res.code === 1) {
                    layer.msg(res.msg, {
                        icon: 1,
                        time: 1000
                    }, function(){
                        parent.location.reload();
                    });
                } else {
                    layer.msg(res.msg, function(){});
                }

                layer.close(index);
            },
            error: function () {
                layer.msg('HTTP ERROR', function () {});
                layer.close(index);
            }
        });
        return false;
    });

    // 关闭 ifame 层
    $('.close-iframe').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});