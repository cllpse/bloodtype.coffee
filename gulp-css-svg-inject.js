var fs = require("fs");
var through = require("through2");

var ruleExpression = /background-image: url\("[./a-z]+"\);/gmi;
var linebreakExpression = /(?:\r\n|\r|\n)/g;

module.exports = function ()
{
    return through.obj(function (file, encoding, callback)
    {
        if (file.isNull())
        {
            return callback(null, file);
        }

        if (file.isBuffer())
        {
            var contents = new Buffer(file.contents).toString();

            var matches = contents.match(ruleExpression);

            if (matches)
            {
                var i = matches.length || 0;

                while(i--)
                {
                    var match = matches[i];
                    var path = match.replace('background-image: url("', "").replace('");', "");
                    var svg = fs.readFileSync(path, "utf8");
                    var out = 'background-image:url("data:image/svg+xml;utf8,' + escape(svg.replace(linebreakExpression, "")) + '");';

                    contents = contents.replace(match, out);
                }

                file.contents = new Buffer(contents);
            }
        }

        if (file.isStream())
        {
            return callback(new Error("css-svg-inject does not support streams"));

            // file.contents = file.contents.pipe("");
        }

        callback(null, file);
    });
};
