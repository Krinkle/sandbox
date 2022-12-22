<?php

class Less_Parser {
	public function __construct() {
	}

	/**
	 * @param string $name
	 */
	public function unregisterFunction( $name ) {
		if ( isset( $this->env->functions[$name] ) )
			unset( $this->env->functions[$name] );
	}
}
