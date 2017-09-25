<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/24
 * Time: 22:07
 */
namespace app\index\controller;

use think\Controller;
use think\Session;
use think\Db;
use think\Cookie;
use app\index\model\User as UserModel;

class Login extends Controller
{
    protected $user_model;

    protected function _initialize()
    {
        parent::_initialize();
        $this->user_model = new UserModel();
    }

    public function index()
    {
        return $this->fetch();
    }

    public function register()
    {
        return $this->fetch();
    }

    /**
     * 用户注册
     */
    public function doRegister()
    {
        if ($this->request->isPost()) {
            $data = $this->request->only(['username', 'password', 'verify']);

            $validate_result = $this->validate($data, 'Register');
            if(true !== $validate_result) {
                $this->error($validate_result);
            } else {
                $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT );
                $res = $this->user_model->allowField(true)->save($data);

                if(false !== $res) {
                    $this->success('注册成功', 'index/login/index');
                } else {
                    $this->error('注册失败');
                }
            }
        }
    }

    /**
     * 用户登录
     */
    public function doLogin()
    {
        if ($this->request->isPost()) {
            $data = $this->request->only(['username', 'password', 'verify']);

            $validate_result = $this->validate($data, 'Login');
            if(true !== $validate_result) {
                $this->error($validate_result);
            } else {
                $where['username'] = $data['username'];

                $user = Db::name('user')
                    ->field('id,username,password')
                    ->where($where)
                    ->find();
                $verify_password = password_verify($data['password'], $user['password']);
                if(!empty($user) && !empty($verify_password)) {
                    Session::set('user_id', $user['id']);
                    Session::set('user_name', $user['username']);
                    $this->success('登录成功', '/');
                } else {
                    $this->error('用户名或密码错误');
                }
            }
        }
    }

    /**
     * 退出登录
     */
    public function Logout()
    {
        Session::delete('user_id');
        Session::delete('user_name');
        $this->redirect('index/login/index');
    }
}