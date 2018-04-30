var fs = require('fs');
var crypto = require('crypto');
var files = [];

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var regExp = new RegExp(/<svgud(.+?)\/>/i);

    if (regExp.test(content)) {
        var options = this.query;

        content = content.replace(new RegExp(regExp, 'g'), function (tag) {
            var attrName = /name=(.)(.+?)\1/i.exec(tag);
            // var attrPath = /path=(.)(.+?)\1/i.exec(tag);

            if (attrName == null) {
                throw new Error(
                    `Attribute "name" is required`
                );
            }

            var file = options.path + '/' + attrName[2] + '.svg';
            var hashFile = crypto.createHmac('sha256', file);

            if (files.hasOwnProperty(hashFile)) {
                return files[hashFile];
            }

            if (fs.existsSync(file)) {
                console.log('File load!');
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
