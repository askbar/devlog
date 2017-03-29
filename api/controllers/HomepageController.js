var chokidar = require('chokidar');
var watcher = chokidar.watch('D:\\Data\\Typo3_Sites\\mit_topdanmark_dk\\typo3temp', {
	ignored: /^\./, 
	persistent: true
});

module.exports = {
	index: function(req, res) {

	watcher
  	.on('add', function(path) {
  		console.log('File', path, 'has been added');
  	})
  	.on('change', function(path) {
  		console.log('File', path, 'has been changed');
  	})
  	.on('unlink', function(path) {
  		console.log('File', path, 'has been removed');
  	});

		res.status(200);

		return res.view('homepage');
	}
};