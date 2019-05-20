#!/usr/bin/env node

const fs = require('fs');

function getVersion() {
  const date = new Date();
  const month = (date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
  const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

  return `${date.getFullYear()}${month}${day}${hours}${minutes}${seconds}`;
}

(function (target = process.argv.slice(2)[0], des = process.argv.slice(2)[1], target_type = process.argv.slice(2)[2]) {

  if (!target || !des || !target_type) {
    console.log('变量不全');
    return;
  }
  const watch_files = fs.readdirSync(des);
  watch_files.forEach(item => {
    fs.watch(`${des}${item}`, (eventType, filename) => {
      console.log(eventType);
      if (filename) {
        let arr = filename.split('.');
        let suffix = arr[arr.length - 1].toLocaleLowerCase();
        // 修改结果到目标文件
        let result = fs.readFileSync(target, {
          encoding: 'utf-8'
        }).toString();
        let reg = null;
        switch (target_type) {
          case 'html':
            // 用来识别获取script以及script标签中的src内容
            reg = suffix == "js" ? /<script src=(.*)><\/script>/g : /<script src=(.*)><\/script>/g;
            break;
          case 'jade':
            reg = suffix == "js" ? /script\(src=(.*)\)/g : /link\(rel="stylesheet", href=(.*)\)/g;
            break;
          default:
            console.log('不支持该文件');
            return;
        }
        var list = result.match(reg);
        for (let i = 0; i < list.length; i++) {
          if (list[i].indexOf(filename) > -1) {
            // 得到类似 script(src='js/main.js?v=2018080911171')
            var script = list[i];
            // 得到类似  "../ddd/ddd/xxx.js";
            var script_file_name = (reg).exec(script)[1];
            var script_file_name_1 = script_file_name.replace(/"/g, '').replace(/'/g, '');
            var new_script = script_file_name_1.split('?')[0] + '?v=' + getVersion();
            new_script = script.replace(script_file_name, `"${new_script}"`);
            result = result.replace(script, new_script);
            fs.writeFileSync(target, result, {
              encoding: 'utf-8'
            })
            console.log('更新成功11');
            break;
          }
        }
      }
    })
  })
})();

console.log("watching file change...");