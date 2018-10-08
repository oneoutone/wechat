## Client

This is the place for your application front-end files.

lb-ng server/server.js client/scripts/services/lb-service.js

"mongodb": {
    "url": "mongodb://zc.salty-egg.com.cn:27017/espace_staging",
    "database": "espace_staging",
    "name": "mongodb",
    "connector": "mongodb",
    "allowExtendedOperators": true
  },


用户名: phone.15618906755
密码: saltyegg_2016


微信启动 : NODE_ENV=lzh node .

natapp启动：LZHdeMacBook-Pro:natapp lzh$ ./natapp 

weChatRobot配置：LZHdeMacBook-Pro:zc lzh$ NODE_ENV=yk_lzh mocha tests/testWechatRobot.js


datasource config

{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "mongodb": {
    "url": "mongodb://saltyegg:saltyegg_2016@zc.salty-egg.com.cn:27017/zc_staging",
    "database": "zc_staging",
    "name": "mongodb",
    "connector": "mongodb",
    "allowExtendedOperators": true
  },
  "mongodbForPolicy": {
    "url": "mongodb://saltyegg:saltyegg_2016@zc.salty-egg.com.cn:27017/policy_db",
    "database": "policy_db",
    "name": "mongodbForPolicy",
    "connector": "mongodb",
    "allowExtendedOperators": true
  },
  "storage": {
    "name": "storage",
    "connector": "loopback-component-storage",
    "provider": "filesystem",
    "root": "../zc_storage"
  }
}

