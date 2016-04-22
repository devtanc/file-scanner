# file-scanner
Upon running `node scanner.js` you can create new files in the `/scan` directory.
When a new file is created, the scanner will pick it up, but will not require that file
until the file is modified and saved. The file should have this format (simply for the basic code that in there):
```
module.exports = {
	attack: function() {
		//attack function code
	}
};

```
The scanner will require this module and begin running it's attack function automatically.
It will also update the module whenever the code is changed and begin running the newly modified attack function.
