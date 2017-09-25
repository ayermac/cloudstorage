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
use think\Session;
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
        if (!Session::has('user_id')) {
            $result = [
                'error'   => 1,
                'message' => '未登录'
            ];
            exit($this->response($result)->send());
        }

        $this->user_setting_model = new UserSettingModel();

        $count = $this->user_setting_model->where(['app_id'=>Cookie::get('appid')])->count();
        if (!Cookie::get('appid') || $count <=0) {
            $result = [
                'msg' => '请先进行配置',
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

        if ($ret['code'] === -97) {
            $ret['msg'] = '账号认证错误，请重新配置';
        }

        return json($ret);
    }

    /**
     * 腾讯云COS上传
     * @return \think\response\Json
     */
    public function cosUpload($folder = "/")
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
        $info   = $images->validate($config)->move($upload_path,'',true);

        if($info) {
            $src = $info->getPathname();
            $dst = $folder . $info->getFilename();
            // 上传图片
            $ret = $this->cosApi->upload($bucket, $src, $dst, null, null, 0);

            if ($ret['message'] == 'SUCCESS') {
                $result = [
                    'code'   => 0,
                    'url'     => $ret['data']['source_url'],
                    'msg' => '上传成功'
                ];
            } else {
                return json($ret);
            }
        } else {
            $result = [
                'code'   => 1,
                'msg' => $images->getError()
            ];
        }
        return json($result);
    }

    /**
     * 删除文件
     * @param $dst
     * @return \think\response\Json
     */
    public function delFile($dst)
    {
        if (empty($dst)) {
            $ret = [
                'code'   => 1,
                'msg' => '请选择需要删除的文件'
            ];
        } else {
            $ret= $this->cosApi->delFile($this->bucket, $dst);

            if ($ret['code'] === 0) {
                $ret['msg'] = '删除成功';
            } else {
                // 这里只给自定义的错误，详细错误 message 请在 response 查看
                $ret['msg'] = '删除失败';
            }
        }

        return json($ret);
    }

    /**
     * 删除文件夹
     * @param $dst
     * @return \think\response\Json
     */
    public function delFolder($dst)
    {
        if (empty($dst)) {
            $ret = [
                'code'   => 1,
                'msg' => '请选择需要删除的文件夹'
            ];
        } else {
            $ret = $this->cosApi->delFolder($this->bucket, $dst);

            if ($ret['code'] === 0) {
                $ret['msg'] = '删除成功';
            } elseif ($ret['code'] === -197) {
                $ret['msg'] = '删除失败，当前文件夹中存在有效数据，请确认。';
            } else {
                // 这里只给自定义的错误，详细错误 message 请在 response 查看
                $ret['msg'] = '删除失败';
            }
        }

        return json($ret);
    }

    /**
     * 创建文件夹
     * @param string $folder
     * @return \think\response\Json
     */
    public function createFolder($folder = "/")
    {
        $data = $this->request->post();
        // 去除所有空格
        $folder     = preg_replace('# #','',$folder);
        // 计算长度
        $folder_len = mb_strlen($data['value'], 'utf-8');

        if ($folder_len > 20) {
            $ret['code'] = 1;
            $ret['msg'] = '最多支持 20 个字符';
        } else {
            $ret = $this->cosApi->createFolder($this->bucket, $folder);

            if ($ret['code'] === 0) {
                $ret['msg'] = '创建成功';
            } elseif ($ret['code'] === -178) {
                $ret['msg'] = '存在重复的文件夹';
            } else {
                // 这里只给自定义的错误，详细错误 message 请在 response 查看
                $ret['msg'] = '创建失败';
            }
        }

        return json($ret);
    }

}