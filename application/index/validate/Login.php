<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/25
 * Time: 19:25
 */
namespace app\index\validate;

use think\Validate;

class Login extends Validate{
    protected $rule = [
        'username'           => 'require',
        'password'           => 'require',
        'verify'             => 'require|captcha'
    ];

    protected $message = [
        'username.require'         => '请输入用户名',
        'password.require'         => '请输入密码',
        'verify.require'           => '验证码不能为空',
        'verify.captcha'           => '验证码不正确'
    ];

}