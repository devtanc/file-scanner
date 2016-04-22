/* global require, setInterval, clearInterval */
var fs = require('fs');
var _ = require('lodash');
var q = require('q');

var directoryFiles = [];
var requiredDirFiles = {};

setInterval(function() { console.log(directoryFiles); }, 5000);
scanDir('scan');

function scanDir(dir) {
	var deferred = q.defer();
	fs.readdir('./' + dir, function(err, files) {
		if (err) { throw err; }
		var newDirectoryFiles =  _.clone(files);
		newDirectoryFiles.forEach(function(file) {
			if(directoryFiles.indexOf(file) < 0) {
				console.log('New file found', file);
				requiredDirFiles[file] = { timeout: {}, obj: require('./scan/' + file) };
				//Remove the module from the cache to be able to re-require
				delete require.cache[require.resolve('./scan/' + file)];
				requiredDirFiles[file].timeout = setInterval(function() { requiredDirFiles[file].obj.attack(); }, 2000);
			}
		});
		directoryFiles = newDirectoryFiles;
		deferred.resolve();
	});
	return deferred.promise;
}

fs.watch('./scan', { persistent: true }, function(event, filename) {
	if (event === 'rename') { console.log(filename, event); return; }
	scanDir('scan').then(function() {
		console.log('Updating ' + filename + ' require due to change type [' + event + '] in', filename);
		clearInterval(requiredDirFiles[filename].timeout);
		requiredDirFiles[filename].obj = require('./scan/' + filename);
		requiredDirFiles[filename].timeout = setInterval(function() { requiredDirFiles[filename].obj.attack(); }, 2000);
		//Remove the module from the cache to be able to re-require
		delete require.cache[require.resolve('./scan/' + filename)];
	});
});
