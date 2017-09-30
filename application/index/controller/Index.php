<?php
namespace app\index\controller;

use think\Controller;
use think\Session;
use app\index\model\UserSetting as UserSettingModel;

class Index extends Controller
{
    protected $user_setting_model;

    protected function _initialize()
    {
        parent::_initialize();
        // 判断用户是否登录
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

    /**
     * 用户存储账号设置页面
     * @return mixed
     */
    public function setting()
    {
        $data = $this->user_setting_model->where(['user_id' => Session::get('user_id')])->find();

        return $this->fetch('setting', ['setting' => $data]);
    }

    /**
     * 用户存储账号设置
     */
    public function userSetting()
    {
        if ($this->request->isPost()) {
            $data            = $this->request->post();
            $data['cdn']     = isset($data['cdn']) ? $data['cdn'] : '';
            $data['user_id'] = Session::get('user_id');
            $validate_result = $this->validate($data, 'UserSetting');

            if(true !== $validate_result) {
                $this->error($validate_result);
            } else {
                $count= $this->user_setting_model->where(['user_id'=>Session::get('user_id')])->count();

                // 存在则更新，不存在新增
                if ($count > 0) {
                    $res = $this->user_setting_model->allowField(true)->save($data, ['user_id'=>Session::get('user_id')]);
                } else {
                    $res = $this->user_setting_model->allowField(true)->save($data);
                }

                if(false !== $res) {
                    $this->success('保存成功');
                } else {
                    $this->error('保存失败');
                }
            }
        }
    }

    /**
     * 文件上传页面
     * @return mixed
     */
    public function uploadPage()
    {
        return $this->fetch('upload');
    }

}
