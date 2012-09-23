var ns = function (name) {
    var parts = name.split('.'), l = parts.length, last = parts[l-1],
    	scope = (l > 1) ? ns( parts.slice(0, l-1).join('.') ) : window;
    
    return ( scope[last] = scope[last] || {} );
}
