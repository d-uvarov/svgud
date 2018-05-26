var fs = require('fs');
var path = require("path");
var crypto = require('crypto');
var files = [];
var regExp = new RegExp(/<svgud(.+?)\/>/i);

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var options = this.query;

    if (!options.path || !options.path.trim()) {
        throw new Error(
            `Option "path" is required`
        );
    }

    if (regExp.test(content)) {
        var svgFolder = path.resolve(options.path);

        content = content.replace(new RegExp(regExp, 'g'), function (tag) {
            var attrName = /name=(.)(.+?)\1/i.exec(tag);

            if (attrName == null) {
                throw new Error(
                    `Attribute "name" is required`
                );
            }

            var file = svgFolder + '/' + attrName[2] + '.svg';
            var hashFile = crypto.createHmac('sha256', file).digest('hex');

            if (files.hasOwnProperty(hashFile)) {
                return files[hashFile];
            }

            if (fs.existsSync(file)) {
                files[hashFile] = fs.readFileSync(file);
                return files[hashFile];
            } else {
                throw new Error(
                    `Svg {${file}} not found`
                );
            }
        });
    }

    return content;
};
