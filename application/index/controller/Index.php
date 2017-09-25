<?php
namespace app\index\controller;

use think\Controller;
use think\Cookie;
use think\Session;
use app\index\model\UserSetting as UserSettingModel;

class Index extends Controller
{
    protected $user_setting_model;

    protected function _initialize()
    {
        parent::_initialize();
        if(!Session::has('user_id')) {
            $this->redirect('index/login/index');
        }
        $this->user_setting_model = new UserSettingModel();
    }

    public function index()
    {
        $username = Session::get('user_name');
        return $this->fetch('index', ['name' => $username]);
    }

    public function setting()
    {
        $app_id = Cookie::get('appid');
        $data = $this->user_setting_model->where(['app_id' => $app_id])->find();

        return $this->fetch('setting', ['setting' => $data]);
    }

    public function userSetting()
    {
        if ($this->request->isPost()) {
            $data = $this->request->post();
            $data['cdn'] = isset($data['cdn']) ? $data['cdn'] : '';
            $validate_result = $this->validate($data, 'UserSetting');

            if(true !== $validate_result) {
                $this->error($validate_result);
            } else {
                $count= $this->user_setting_model->where(['app_id'=>$data['app_id']])->count();

                // 存在则更新，不存在新增
                if ($count > 0) {
                    $res = $this->user_setting_model->allowField(true)->save($data, ['app_id'=>$data['app_id']]);
                } else {
                    $res = $this->user_setting_model->allowField(true)->save($data);
                }

                if(false !== $res) {
                    Cookie::set('appid', $data['app_id'],3600*24*7);
                    $this->success('保存成功');
                } else {
                    $this->error('保存失败');
                }
            }
        }
    }

    public function uploadPage()
    {
        return $this->fetch('upload');
    }

}
