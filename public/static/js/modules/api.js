layui.use(['layer'], function(){
    var layer = layui.layer
        ,url = '';

    var list = new Vue({
        el: '#mainlist',
        data: {
            post: {}
        },
        methods: {
            getList: function (folder) {
                /**
                 * 获取列表
                 */
                $.get('/api/cos/listFolder/', { "folder": folder }, function (res) {
                    if (res.code === 0) {
                        list.post = res.data.infos;
                        console.log(list.post);
                    } else {
                        layer.msg(res.message, function () {})
                    }
                });
            },
            open_folder: function (event) {
                var $ = event.target;
                url += $.name;
                window.history.pushState({}, 0, 'http://'+window.location.host+'/#/'+url);
                var hash = window.location.hash.replace('#', '');
                this.getList(hash);
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
           list.getList(window.location.hash.replace('#', ''));
           // 重置 url
           url = '';
       });

       // Trigger the event (useful on page load).
       $(window).hashchange();
    });
});