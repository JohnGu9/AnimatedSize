import { existsSync, lstatSync, readdirSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';

function deleteFolderRecursive(path) {
  if (existsSync(path) && lstatSync(path).isDirectory()) {
    readdirSync(path).forEach(function (file) {
      const curPath = join(path, file);

      if (lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        unlinkSync(curPath);
      }
    });

    rmdirSync(path);
  }
};

deleteFolderRecursive("./dist");

