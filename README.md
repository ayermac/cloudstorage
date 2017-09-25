# CloudStorage
由 ThinkPHP 驱动，使用腾讯云对象存储 PHP SDK 写的一套简易云存储管理

![cloud storage](http://cblog-1252077432.file.myqcloud.com/cloudstorage/cloudstorage1.3.gif)

# 主要使用到的 JS 插件
* Layui ( UI )
* Vue (  数据渲染  )
* Plupload ( 上传 )
* Jquery-hashchange ( 浏览器 Hash 监听 )

# 功能
* 管理账号注册和登录
* 腾讯云存储账号配置
* 上传 ( 暂时只支持图片 )
* 图片预览 和 文件下载
* 文件和文件夹删除
* 创建文件夹

# 部署
* 直接上传到服务器指定目录, 数据库文件存放在根目录下sql文件夹里。
* 安装 Composer，然后执行 composer install 安装依赖包
* 数据库配置文件 application/database.php
* 如果需要使用 cdn 链接，可以在账号配置界面开启 cdn

> 说明: CDN 为付费产品，使用之前请先确保开启这项服务。新用户可以免费使用腾讯云 50G 的云存储空间，对于一般的存储来说已经够用了。具体情况请查看[腾讯云官网](https://cloud.tencent.com/product/cos)。


# 服务器环境
* PHP5.4以上版本（注意：PHP5.4dev版本和PHP6均不支持）, 推荐使用PHP7以达到最优效果
* Nginx 可以在Nginx.conf中配置如下转发规则:
```
location / { 
   if (!-e $request_filename) {
   rewrite  ^(.*)$  /index.php?s=/$1  last;
   break;
    }
 }
```
* 其他配置具体请参考`ThinkPHP`官方文档配置,[官方文档链接](https://www.kancloud.cn/manual/thinkphp5/129745)。

