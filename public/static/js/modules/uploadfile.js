layui.define(['layer', 'element'], function(exports){
    var layer = layui.layer
        ,element = layui.element
        ,hash = '/' + parent.location.hash.replace('#', '');
    console.log(hash);

    /**
     * 上传
     * @type {plupload.Uploader}
     */
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4', //上传插件初始化选用那种方式的优先级顺序
        browse_button : 'start_upload', //触发文件选择对话框的按钮，为那个元素id
        drop_element: 'start_upload',
        url : '/api/cos/cosupload/', //服务器端的上传页面地址
        flash_swf_url : '/static/lb/plupload/Moxie.swf', //swf文件，当需要使用swf方式进行上传时需要配置该参数
        silverlight_xap_url : '/static/lb/plupload/Moxie.xap', //silverlight文件，当需要使用silverlight方式进行上传时需要配置该参数
        multipart_params: {
            folder: hash
        },
        filters: {
            max_file_size: '10mb', //最大上传文件大小（格式100b, 10kb, 10mb, 1gb）
            mime_types: [//允许文件上传类型
                {title: "Image files", extensions: "jpg,png,gif"}
            ]
        },
        multi_selection: true, //true:多文件上传, false 单文件上传
        file_data_name: 'images',
        resize: {//图片压缩，只对jpg格式的图片有效
            width: 800,
            height: 600,
            crop: false,
            quality: 50,
            preserve_headers: false
        },
        init: {
            FilesAdded: function (up, files) { //文件上传前
                element.init();
                element.progress('uploadprogress', '0%');
                uploader.start();
            },
            UploadProgress: function (up, file) { //上传中，显示进度条
                var percent = file.percent;
                element.progress('uploadprogress', percent+'%');
            },
            FileUploaded: function (up, file, info) { //文件上传成功的时候触发
                var data = JSON.parse(info.response);

                if (data.error === 0) {
                    layer.msg(data.message, { icon: 1 }, function () {});
                } else {
                    layer.msg(data.message, function () {});
                }
            },
            UploadComplete: function () { // 当上传队列中所有文件都上传完成后触发监听
                // parent.location.reload();
            },
            Error: function (up, err) { //上传出错的时候触发
                layer.msg(err.message, function(){});
            }
        }
    });
    //在实例对象上调用init()方法进行初始化
    uploader.init();

    exports('uploadfile', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});