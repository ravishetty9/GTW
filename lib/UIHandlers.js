Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue
    }[operator];
});

Handlebars.registerHelper("returnNonZeroValue", function(value) {
    if (value==undefined)
    	return 'N/A';
    else
    	return value;
});

Handlebars.registerHelper("returnValidProfilePicture", function(value) {
	if (value==undefined)
    	return _gtw_defaultProfileImage;
    else
    	return value;
});