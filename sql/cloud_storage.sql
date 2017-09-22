/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : cloud_storage

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-09-22 21:08:03
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user_setting
-- ----------------------------
DROP TABLE IF EXISTS `user_setting`;
CREATE TABLE `user_setting` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bucketname` varchar(32) NOT NULL COMMENT '存储桶名称',
  `app_id` int(10) unsigned NOT NULL,
  `secret_id` varchar(64) NOT NULL,
  `secret_key` varchar(64) NOT NULL,
  `region` varchar(2) NOT NULL COMMENT '区域',
  `timeout` smallint(3) unsigned NOT NULL DEFAULT '60' COMMENT '超时',
  `cdn` varchar(2) DEFAULT NULL COMMENT '是否开启cdn',
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_id` (`app_id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
