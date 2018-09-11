const fs = require('fs');
const exec = require('child_process').exec;
const cssFiles = ['./src/layout.css', './src/default-style.css'];
const cssDist = './dist/dual-range-bar.css';

var run = cmd => new Promise((resolve, reject) => {
    let childProcess = exec(cmd, (err, stdout, stderr) => {
        let errMsg = err? stdout? stderr? null: stderr: stdout: err;
        console.log(stdout);
        console.log(stderr);
        if(errMsg) reject(`${errMsg}`);
        resolve(childProcess);
    })
});

console.log('Bundling .js');
run('webpack')
.then(() => {
    console.log('Bundling .css');
    if(cssFiles.length <= 0) return;
    fs.writeFileSync(cssDist, fs.readFileSync(cssFiles[0]).toString());
    for(let i = 1; i in cssFiles; i++) {
        fs.appendFileSync(cssDist, '\n');
        fs.appendFileSync(cssDist, fs.readFileSync(cssFiles[i]).toString());
    }
})
.then(() => console.log('Done.'))
.catch(err => console.log(err));
