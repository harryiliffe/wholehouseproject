var mkdirp = require('mkdirp');

mkdirp('./src/logs', function (err) {
    if (err) console.error(err)
    else console.log('Created logs folder')
});

mkdirp('./src/public/assets', function (err) {
    if (err) console.error(err)
    else console.log('Created assets folder')
});

mkdirp('./src/tmp_uploads', function (err) {
    if (err) console.error(err)
    else console.log('Created tmp_uploads folder')
});

mkdirp('./src/db', function (err) {
    if (err) console.error(err)
    else console.log('Created db folder')
});
