
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	sasStream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-sink-and-stream', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( sasStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to set/get the number of values to initially sink', function test() {
		var tStream = sasStream();
		expect( tStream.numValues ).to.be.a( 'function' );
	});

	it( 'should set the number of values to initially sink', function test() {
		var tStream = sasStream();
		tStream.numValues( 25 );
		assert.strictEqual( tStream.numValues(), 25 );
	});

	it( 'should not allow a non-numeric number of values to initially sink', function test() {
		var tStream = sasStream(),
			values = [
				'5',
				[],
				{},
				null,
				undefined,
				NaN,
				false,
				function(){}
			];
		
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				tStream.numValues( value );
			};
		}
	});

	it( 'should not allow a negative number of values to initially sink', function test() {
		var tStream = sasStream();

		expect( badValue( -5 ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				tStream.numValues( value );
			};
		}
	});

	it( 'should convert a non-integer number of values to initially sink to an integer', function test() {
		var tStream = sasStream();

		tStream.numValues( 5.2334 );

		assert.strictEqual( tStream.numValues(), 5 );
	});

	it( 'should have a default behavior of not sinking, but streaming individual values', function test( done ) {
		var data, expected, tStream;

		// Simulate some data...
		data = [ 1,2,3,4,5 ];

		// Expected values:
		expected = [ 1,2,3,4,5 ];

		// Create a new sink-and-stream stream:
		tStream = sasStream().stream();

		// Mock reading from the stream:
		utils.readStream( tStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, tStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			for ( var i = 0; i < expected.length; i++ ) {
				assert.deepEqual(
					actual[ i ],
					expected[ i ]
				);
			}

			done();
		} // end FUNCTION onRead()
	});

	it( 'should initially sink and then stream streamed data values', function test( done ) {
		var data, expected, tStream, NUMVALUES = 3;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 4, 5 ];

		// Expected values:
		expected = [ [2,2,2], 3, 4, 5 ];

		// Create a new sink-and-stream stream:
		tStream = sasStream()
			.numValues( NUMVALUES )
			.stream();

		// Mock reading from the stream:
		utils.readStream( tStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, tStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			for ( var i = 0; i < expected.length; i++ ) {
				assert.deepEqual(
					actual[ i ],
					expected[ i ]
				);
			}

			done();
		} // end FUNCTION onRead()
	});

});