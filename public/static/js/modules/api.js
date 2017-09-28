layui.use(['layer'], function(){
    var layer = layui.layer
        ,url = ''
        ,loading;

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
                   type: 'get',
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
                           layer.msg(res.msg, function () {
                               if (res.code === 10000 || res.code === -97 || res.code === -133) {
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
                               }
                           });
                       }
                       $(".layui-loading-mask").removeClass('active');
                   },
                   error: function () {
                       layer.msg('HTTP ERROR', function () {});
                   }
                });
            },
            delFile: function (api, dst, hash) {
                /**
                 * 删除文件和文件夹
                 */
                $.ajax({
                    url: api,
                    type: 'post',
                    dataType: 'json',
                    data: { "dst": dst },
                    beforeSend: function () {
                        loading = layer.load();
                    },
                    success: function (res) {
                        if (res.code === 0) {
                            layer.msg(res.msg, { icon: 1 }, function () {
                                // 重新渲染列表
                                list.getList(hash);
                            });
                        } else {
                            layer.msg(res.msg, function () {});
                        }
                        layer.close(loading);
                    },
                    error: function () {
                        layer.msg('HTTP ERROR', function () {
                            layer.close(loading);
                        });
                    }
                });
            },

            createFolder: function (folder, value, hash) {
                /**
                 * 创建文件夹
                 */
                $.ajax({
                    url: '/api/cos/createFolder/',
                    type: 'post',
                    dataType: 'json',
                    data: { "folder": folder, "value": value },
                    beforeSend: function () {
                        loading = layer.load();
                    },
                    success: function (res) {
                        if (res.code === 0) {
                            layer.msg(res.msg, { icon: 1 }, function () {
                                // 重新渲染列表
                                list.getList(hash);
                            });
                        } else {
                            layer.msg(res.msg, function () {});
                        }
                        layer.close(loading);
                    },
                    error: function () {
                        layer.msg('HTTP ERROR', function () {
                            layer.close(loading);
                        });
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
            delAction: function (event) {
                var $query = event.target
                    ,hash = '/' + window.location.hash.replace('#', '')
                    ,name = $query.name
                    ,type = $query.value
                    ,dst = hash + name;

                layer.confirm('确定删除 <b>"'+ name +'"</b> 吗？<br> 删除后数据不可恢复和访问。', {
                    icon: 7,
                    btn: ['确定','取消'] //按钮
                }, function(index){
                    layer.close(index);
                    // 判断删除的是文件还是文件夹
                    type==='d' ? list.delFile('/api/cos/delFolder/', dst, hash) : list.delFile('/api/cos/delFile/', dst, hash);
                }, function(){
                });
            },
            createAction: function (event) {
                var $query = event.target
                    ,hash = '/' + window.location.hash.replace('#', '')
                    ,folder;

                layer.prompt({
                    title:'新建文件夹'
                }, function(value, index, elem){
                    folder = hash + value;
                    if (!$.trim(value)) {
                        layer.msg('文件夹名称不能为空', function () {});
                    } else {
                        // 创建文件夹
                        list.createFolder(folder, value, hash);
                        layer.close(index);
                    }
                });
            },
            previewFile: function (event) {
                var $query = event.target
                    ,file_url = $query.name
                    ,img = '<div class="center" id="preview-photos"><img layer-src="' + file_url + '" src="' + file_url + '"></div>'
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
                // 点击图片弹出层
                layer.photos({
                    photos: '#preview-photos'
                    ,anim: 5
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