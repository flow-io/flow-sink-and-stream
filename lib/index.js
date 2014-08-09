/**
*
*	STREAM: sink-and-stream
*
*
*	DESCRIPTION:
*		- Transform stream factory to sink a specified number of streamed data values and then stream new data values as they arrive.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/08/09: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] through2
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Through module:
		through2 = require( 'through2' );


	// FUNCTIONS //

	/**
	* FUNCTION: onData( numValues )
	*	Returns a callback which sinks and then streams streamed data values.
	*
	* @private
	* @param {Number} numValues - number of values to initially sink
	* @returns {Function} callback
	*/
	function onData( numValues ) {
		var flg = true,
			i = -1,
			buffer;

		// Initialize the buffer array used for initial sinking:
		buffer = new Array( numValues );

		/**
		* FUNCTION: onData( newVal, encoding, clbk )
		*	Data event handler. Sinks and then streams data.
		*
		* @private
		* @param {Number} newVal - new streamed data value
		* @param {String} encoding
		* @param {Function} clbk - callback to invoke after handling streamed data. Function accepts two arguments: [ error, chunk ].
		*/
		return function onData( newVal, encoding, clbk ) {
			if ( flg && numValues ) {
				buffer[ ++i ] = newVal;
				if ( i === numValues-1 ) {
					flg = false;
					clbk( null, buffer );
					return;
				}
				clbk();
				return;
			}
			clbk( null, newVal );
		}; // end FUNCTION onData()
	} // end FUNCTION onData()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @constructor
	* @returns {Stream} Stream instance
	*/
	function Stream() {
		this._numValues = 0;
		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: numValues( value )
	*	Setter and getter for number of values to initially sink. If a value is provided, sets the number of values. If no value is provided, returns the number of values.
	*
	* @param {Number} value - number of values to initially sink
	* @returns {Stream|Number} Stream instance or number of values to initially sink
	*/
	Stream.prototype.numValues = function( value ) {
		if ( !arguments.length ) {
			return this._numValues;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'numValues()::invalid input argument. Number of values must be numeric.' );
		}
		if ( value < 0 ) {
			throw new Error( 'numValues()::invalid input argument. Number of values should be a positive integer or zero.' );
		}
		this._numValues = parseInt( value, 10 );
		return this;
	}; // end METHOD numValues()

	/**
	* METHOD: stream()
	*	Returns a through stream for sinking and then streaming data values.
	*
	* @returns {object} through stream
	*/
	Stream.prototype.stream = function() {
		return through2( {'objectMode': true}, onData( this._numValues ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();