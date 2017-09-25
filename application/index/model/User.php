<?php
/**
 * Created by PhpStorm.
 * User: Jason
 * Date: 2017/9/24
 * Time: 22:09
 */
namespace app\index\model;

use think\Model;
use think\Db;

/*
 * 用户模型
 */
class User extends Model{
    protected $insert = ['create_time'];

    /**
     * 创建时间
     * @return bool|string
     */
    protected function setCreateTimeAttr()
    {
        return date('Y-m-d H:i:s');
    }
}