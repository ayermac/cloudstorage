<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/19
 * Time: 21:22
 */
namespace app\api\controller;

use app\index\model\UserSetting;
use think\Controller;
use think\Cookie;
use think\Response;
use app\index\model\UserSetting as UserSettingModel;
use QCloud\Cos\Api;

/**
 * 云存储api控制器
 * Class Cos
 * @package app\api\controller
 */
class Cos extends Controller {

    protected $user_setting_model;
    protected $cosApi;
    protected $bucket;
    protected $cdn;

    public function _initialize()
    {
        parent::_initialize(); // TODO: Change the autogenerated stub
        $this->user_setting_model = new UserSettingModel();

        $count = $this->user_setting_model->where(['app_id'=>Cookie::get('appid')])->count();
        if (!Cookie::get('appid') || $count <=0) {
            $result = [
                'error'   => 1,
                'message' => '请先进行配置',
                'code'    => 10000, // api 初始化错误代码
            ];
            exit($this->response($result)->send());
        }
        $data = $this->user_setting_model->where(['app_id'=>Cookie::get('appid')])->find()->toArray();
        $config['app_id']      = $data['app_id'];
        $config['secret_id']   = $data['secret_id'];
        $config['secret_key']  = $data['secret_key'];
        $config['region']      = $data['region'];
        $config['timeout']     = $data['timeout'];

        $this->bucket = $data['bucketname'];
        // 判断是否使用 cdn
        $this->cdn    = $data['cdn'];

        $this->cosApi = new Api($config);
    }

    /**
     * 输出返回数据
     */
    public function response($result, $type = 'json')
    {
        return Response::create($result, $type)->code(200);
    }

    /**
     * 获取列表数据
     * url: /api/cos/getlist
     */
    public function listFolder($folder = "/")
    {
        $ret        = $this->cosApi->listFolder($this->bucket, $folder);
        $ret['cdn'] = $this->cdn;

        return json($ret);
    }

    /**
     * 腾讯云COS上传
     * @return \think\response\Json
     */
    public function CosUpload($folder = "/")
    {
        // 存储桶名字
        $bucket = $this->bucket;

        $config = [
            'size' => 10485760,//大小10M
            'ext'  => 'jpg,jpeg,gif,png,bmp'
        ];
        $images = $this->request->file('images');

        // 由于要验证上传的文件，ThinkPHP 必须传到本地之后才能验证。
        $upload_path = str_replace('\\', '/', ROOT_PATH . 'public' . DS . 'uploads' . DS . date('Ymd', time()) . DS);
        $info   = $images->validate($config)->move($upload_path,'',false);

        if($info) {
            $src = $info->getPathname();
            $dst = $folder . $info->getFilename();
            // 上传图片
            $ret = $this->cosApi->upload($bucket, $src, $dst);

            if ($ret['message'] == 'SUCCESS') {
                $result = [
                    'error'   => 0,
                    'url'     => $ret['data']['source_url'],
                    'message' => '上传成功'
                ];
            } else {
                return json($ret);
            }
        } else {
            $result = [
                'error'   => 1,
                'message' => $images->getError()
            ];
        }
        return json($result);
    }
}