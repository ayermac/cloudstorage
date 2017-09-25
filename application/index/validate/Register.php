<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/25
 * Time: 20:03
 */
namespace app\index\validate;

use think\Validate;

class Register extends Validate{
    protected $rule = [
        'username'           => 'require|unique:user',
        'password'           => 'require',
        'verify'             => 'require|captcha'
    ];

    protected $message = [
        'username.require'         => '请输入用户名',
        'username.unique'          => '用户名已存在',
        'password.require'         => '请输入密码',
        'verify.require'           => '验证码不能为空',
        'verify.captcha'           => '验证码不正确'
    ];

}