var watch = require('node-watch');

module.exports = {
	index: function(req, res) {

		console.log('index action of homepage!');

		var watcher = watch('D:\\Data\\Typo3_Sites\\mit_topdanmark_dk\\typo3.log', { recursive: true });
		// watcher.on('change', function(evt, name) {
		// 	console.log(name, ' changed.');
		// });
		 
		res.status(200);

		return res.view('homepage');
	}
};