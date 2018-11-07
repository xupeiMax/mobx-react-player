由于babel为7.X版本
需要在node_modules/babel-preset-react-app/create.js 的plugins里把 
[ require('@babel/plugin-proposal-decorators'), false ] 
改为 
[ require('@babel/plugin-proposal-decorators'), { "legacy":true, } ]