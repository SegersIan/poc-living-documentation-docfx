# POC: Living Documentation with DocFX

## How To Build Site

* Clone repo
* `cd ~reporoot/documentation`
* `docfx metadata docfx.json`
* `cd process-metadata`
* `npm install`
* `node index.js`
* `cd ..`
* `docfx docfx.json --serve`
* Open `localhost:8080` in browser