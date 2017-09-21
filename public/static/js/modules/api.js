layui.use(['layer'], function(){
    var layer = layui.layer
        ,url = '';

    var list = new Vue({
        el: '#mainlist',
        data: {
            post: {}
            ,cdn: ''
            ,navbar: ''
        },
        methods: {
            getList: function (folder) {
                /**
                 * 获取列表
                 */
                $.ajax({
                   url: '/api/cos/listFolder/',
                   type: 'post',
                   dataType: 'json',
                   data: { "folder": folder },
                   beforeSend: function () {
                        $(".layui-loading-mask").addClass('active');
                   },
                   success: function (res) {
                       if (res.code === 0) {
                           list.post = res.data.infos;
                           list.cdn  = res.cdn;
                           list.navbar = window.location.hash.replace('#', '');
                       } else {
                           layer.msg(res.message, function () {})
                       }
                       $(".layui-loading-mask").removeClass('active');
                   },
                   error: function () {
                       layer.msg('HTTP ERROR', function () {});
                   }
                });
            },
            openFolder: function (event) {
                var $query = event.target
                    ,hash;
                url += $query.name;
                window.history.pushState({}, 0, 'http://'+window.location.host+'/#'+url);
                // 获取当前 url hash 值
                hash = window.location.hash.replace('#', '');
                // console.log(hash);
                this.getList(hash);
            },
            previewFile: function (event) {
                var $query = event.target
                    ,file_url = $query.name
                    ,img = '<div class="center"><img src="' + file_url + '"></div>'
                    ,files = '<div class="center"><i class="layui-icon" style="font-size: 100px;">&#xe61d;</i><div><a class="layui-btn" href="' + file_url + '">下载</a></div></div>'
                    ,imgArray = ['.png', '.jpg', '.jpeg', '.gif'];

                var index = layer.open({
                    type: 1
                    ,area: ['100%', '100%']
                    ,title: '预览'
                    ,shade: 0.6
                    ,maxmin: false
                    ,anim: 0
                    ,content: this.checkString(file_url, imgArray) ? img : files
                });
                layer.full(index);
            },
            checkString: function (checkedString, checkArray) {
                /**
                 * 检查字符串中是否包含指定数组中的元素
                 */
                for (var i = 0; i < checkArray.length; i++)
                {
                    if (checkedString.indexOf(checkArray[i]) > -1) {
                        return true;
                    }
                }
                return false;
            }
        },
        watch: {
            post: function () {
                this.$nextTick(function () {
                    // layer.msg('数据渲染完成');
                });
            }
        }
    });

    // 监听 hash 变化
    $(function(){
       // Bind the event.
       $(window).hashchange( function(){
           list.getList(window.location.hash.replace('#', '') ? window.location.hash.replace('#', '') : '/');
           // 当浏览器前进回退时，保存当前的 url hash 值，以便于下次直接调用
           url = window.location.hash.replace('#', '');
       });

       // Trigger the event (useful on page load).
       $(window).hashchange();
    });
});