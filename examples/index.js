var eventStream = require( 'event-stream' ),
	tStream = require( '../lib' );

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
		if ( Array.isArray( d ) ) {
			clbk( null, JSON.stringify( d )+'\n' );
			return;
		}
		clbk( null, d.toString()+'\n' );
	}))
	.pipe( process.stdout );