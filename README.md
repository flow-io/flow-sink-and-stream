flow-sink-and-stream
====================




## Installation

``` bash
$ npm install flow-sink-and-stream
```

## API

To create a stream factory,

``` javascript
var sasStream = require( 'flow-sink-and-stream' );

// Create a new factory:
var tStream = sasStream();
```

### tStream.numValues( [numValues] )

This method is a setter/getter. If no `numValues` is provided, returns the `numValues` to initially sink; default is `0`. To set the `numValues`,

``` javascript
tStream.numValues( 10 );
```

### tStream.stream()

To create a new sink-and-stream stream,

``` javascript
var stream = tStream.stream();
```


## Usage

Methods are chainable.

``` javascript
sasStream()
	.numValues( 10 )
	.stream()
	.pipe( /* writable stream */ );
```



## Examples

``` javascript
var eventStream = require( 'event-stream' ),
	tStream = require( 'flow-sink-and-stream' );

// Create some data...
var data = new Array( 20 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = eventStream.readArray( data );

// Create a new sink-and-stream stream:
var stream = tStream()
	.numValues( 10 )
	.stream();

// Pipe the data:
readStream.pipe( stream )
	.pipe( eventStream.map( function( d, clbk ){
		clbk( null, d.toString()+'\n' );
	}))
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have globally installed Mocha, execute the following command in the top-level application directory to run the tests:

``` bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality.


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.

