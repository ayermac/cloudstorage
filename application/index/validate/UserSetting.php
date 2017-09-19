<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/18
 * Time: 22:30
 */
namespace app\index\validate;

use think\Validate;

class UserSetting extends Validate{
    protected $rule = [
        'bucketname'         => 'require',
        'app_id'             => 'require|number',
        'secret_id'          => 'require',
        'secret_key'         => 'require',
        'region'             => 'require',
        '__token__'          => 'require|token'
    ];

    protected $message = [
        'bucketname.require'         => '请输入存储桶名称',
        'app_id.require'             => '请输入app_id',
        'app_id.number'              => '请输入正确的app_id',
        'secret_id.require'          => '请输入secret_id',
        'secret_key.require'         => '请输入secret_key',
        'region.require'             => '请选择一项区域',
    ];
}