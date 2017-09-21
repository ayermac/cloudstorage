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
                var $query = event.target;
                url += $query.name;
                window.history.pushState({}, 0, 'http://'+window.location.host+'/#/'+url);
                var hash = window.location.hash.replace('#', '');
                this.getList(hash);
            },
            preview_file: function (event) {
                var $query = event.target
                    ,file_url = $query.name;
                console.log(file_url);
                layer.open({
                    type: 1,
                    title: false,
                    // area: ['800px', '600px'],
                    offset: ['10%', '20%'],
                    closeBtn: 0,
                    shadeClose: true,
                    skin: '',
                    content: '<div><img src="' + file_url + '"></div>'
                });
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
           // 重置 url
           url = '';
       });

       // Trigger the event (useful on page load).
       $(window).hashchange();
    });
});