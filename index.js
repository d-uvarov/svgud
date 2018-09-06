var fs = require('fs');
var path = require("path");
var crypto = require('crypto');
var files = {};
var filesWithIds = {};
var regExp = new RegExp(/<svgud(.+?)\/>/i);

/**
 *
 * @param svg string
 * @returns {Array}
 */
function findIdMatches(svg) {
    let match = null;
    let regx = new RegExp(/id="(.+?)"/gi);
    let matches = [];

    do {
        match = regx.exec(svg);
        if (match) {
            matches.push(match[1]);
        }
    } while (match);

    return matches;
}


/**
 *
 * @param svg string
 * @param matches array
 * @returns {*}
 */
function randomIds(svg, matches) {
    for (let id of matches) {
        let rnd = Math.random().toString(36).substring(2);
        svg = svg.replace(new RegExp(`id="${id}"`, "g"), `id="${rnd}-${id}"`);
        svg = svg.replace(new RegExp(`#${id}`, "g"), `#${rnd}-${id}`);
    }

    return svg;
}

module.exports = function (content) {
    this.cacheable && this.cacheable();

    let options = this.query;

    if (!options.path || !options.path.trim()) {
        throw new Error(
            `Option "path" is required`
        );
    }

    if (regExp.test(content)) {
        let svgFolder = path.resolve(options.path);

        content = content.replace(new RegExp(regExp, 'g'), function (tag) {
            let attrName = /name=(.)(.+?)\1/i.exec(tag);

            if (attrName == null) {
                throw new Error(
                    `Attribute "name" is required`
                );
            }

            let file = svgFolder + '/' + attrName[2] + '.svg';
            let hashFile = crypto.createHmac('sha256', file).digest('hex');

            if (files.hasOwnProperty(hashFile)) {
                return files[hashFile];
            } else if (filesWithIds.hasOwnProperty(hashFile)) {
                return randomIds(filesWithIds[hashFile], findIdMatches(filesWithIds[hashFile]));
            }

            if (fs.existsSync(file)) {
                let svgFile = fs.readFileSync(file);
                let svg = svgFile.toString();
                let matches = findIdMatches(svg);

                if (matches.length) {
                    filesWithIds[hashFile] = svg;

                    return randomIds(filesWithIds[hashFile], matches);
                } else {
                    files[hashFile] = svg;
                    return files[hashFile];
                }
            } else {
                throw new Error(
                    `Svg {${file}} not found`
                );
            }
        });
    }

    return content;
};
