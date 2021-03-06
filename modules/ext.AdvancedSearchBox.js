/**
 * ext.AdvancedSearchBox
 *
 * @author Hagai Asaban
 * @license MIT
 */

( function ( mw, $ ) {

    // Compute form data for search suggestions functionality.
    function computeResultRenderCache( context ) {
        var $form, baseHref, linkParams;

        // Compute common parameters for links' hrefs
        $form = context.config.$region.closest( 'form' );

        baseHref = $form.attr( 'action' );
        baseHref += baseHref.indexOf( '?' ) > -1 ? '&' : '?';

        linkParams = {};
        $.each( $form.serializeArray(), function ( idx, obj ) {
            linkParams[ obj.name ] = obj.value;
        } );

        return {
            textParam: context.data.$textbox.attr( 'name' ),
            linkParams: linkParams,
            baseHref: baseHref
        };
    }

    // The function used to render the suggestions.
    function customRenderFunction( text, context ) {
        var page, namespace,
            title = mw.Title.newFromText( text ),
            info = computeResultRenderCache( context );
            
        info.linkParams[ info.textParam ] = text;

        page = title.getMainText();
        
        namespace = $( '<span>' )
            .text( mw.config.get( 'wgFormattedNamespaces' )[ title.namespace ] )
            .addClass( 'mw-mnss-srcc' );
        
        // 'this' is the container <div>, jQueryfied
        this.append( page, namespace )
            .wrap(
            $( '<a>' )
            .attr( 'href', info.baseHref + $.param( info.linkParams ) )
            .addClass( 'mw-searchSuggest-link' )
        );
    }

    function loadAdvancedSearchBox(api, allNamespaces, $searchInput) {        
         $searchInput.suggestions( {
            fetch: function ( searchQuery ) {
                var $el;
                
                if ( searchQuery.length !== 0 ) {                    
                    $el = $( this );
                    
                    $el.data( 'request', api.get( {                        
                        action: 'query',
                        list: 'search',
                        srsearch: searchQuery,
                        srwhat: 'text',
                        srnamespace: allNamespaces,
                        srredirects: true,
                        srprop: 'timestamp|snippet'
                    } ).done( function ( data ) {
                        var suggetions = Array.prototype.map.call(data.query.search, function(obj) {
                            return obj.title;
                        });
                        $el.suggestions( 'suggestions', suggetions );
                    } ) );
                }
            },
            result: {
                render: customRenderFunction
            }
        } ); 
        
    };

    $( function () {
        var api = new mw.Api();
        var allNamespaces = Object.keys( mw.config.get( 'wgFormattedNamespaces' ) ).join( '|' );
        var $searchInput = $( '#searchInput' );
        loadAdvancedSearchBox(api, allNamespaces, $searchInput);
    });

}( mediaWiki, jQuery ) );