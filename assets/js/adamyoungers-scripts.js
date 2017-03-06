/*!
* adamyoungers - v0.0.1 - MIT LICENSE 2017-03-05. 
* @author Adam Youngers
*/
/**
 * Sample content to test the concat and minify grunt plugins.
 */
function sampleA() {
	
	'use strict';
	
	window.console.log("Sample A");
}
	
sampleA();

/**
 * Sample content to test the concat and minify grunt plugins.
 */
function sampleB() {
	
	'use strict';
	
	window.console.log("Sample Z");
}
	
sampleB();
/**
*	Sample content to illustrate the use of Mocha for tests. 
*/

var Apple = function (opts) {
	
	'use strict';
	
    opts = opts || {};

    this.name = opts.name || 'Fuji';

    this.sound = opts.sound || 'crunch';

    return this;
};