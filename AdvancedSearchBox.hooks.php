<?php
/**
 * Hooks for AdvancedSearchBox extension
 *
 * @file
 * @ingroup Extensions
 */

class AdvancedSearchBoxHooks {
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin) {
        $out->addModules( array( "ext.AdvancedSearchBox" ) );       
		return true;
	}
}
