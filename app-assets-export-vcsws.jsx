//bring PS to focus
#target photoshop

//utils - duplicate
function duplicate() { 
	var desc143 = new ActionDescriptor();
	var ref73 = new ActionReference();
	ref73.putClass( charIDToTypeID('Dcmn') );
	desc143.putReference( charIDToTypeID('null'), ref73 );
	desc143.putString( charIDToTypeID('Nm  '), activeDocument.activeLayer.name );
	var ref74 = new ActionReference();
	ref74.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
	desc143.putReference( charIDToTypeID('Usng'), ref74 );
	executeAction( charIDToTypeID('Mk  '), desc143, DialogModes.NO );
};

//utils - export
function exportFile(file, format, path){
	//vars
	var opts = new ExportOptionsSaveForWeb(),
		filepath = Folder(path);
	//formats
	if ( format == 'png' ) {
		opts.format = SaveDocumentType.PNG;
		opts.PNG8 = false;
		opts.transparency = true;
		opts.interlaced = false;
		opts.optimized = true;
		opts.includeProfile = false;
	}
	else if ( format == 'jpg' ) {
		opts.format = SaveDocumentType.JPEG;
		opts.quality = 60;
		opts.interlaced = true;
		opts.optimized = false;
		opts.includeProfile = false;
	}
	//create and save file
	if ( !filepath.exists ) filepath.create();
	activeDocument.exportDocument( file, ExportType.SAVEFORWEB, opts );
}

//main procedure
function main(){
	//exit if no open doc
	if(!documents.length) {
		alert('No open document!');
		return;
	}

	//vars
	var doc = activeDocument,
		docPath = activeDocument.path;

	//loop through all layersets
	for( var i=0; i<doc.layerSets.length; i++ ){
		//skip all guide layerset
		if (doc.layerSets[i].name.indexOf('_') != -1) {	continue; }
		//select target layerset
		activeDocument.activeLayer = activeDocument.layers.getByName( doc.layerSets[i].name );
		//duplicate layerset
		duplicate();
		//merge layerset
		activeDocument.mergeVisibleLayers();
		//trim the document
		activeDocument.trim( TrimType.TRANSPARENT, true, true, true, true );
		//create target file
		var newFile = File( docPath + '/' + doc.layerSets[i].name ),
			format = doc.layerSets[i].name.substr( doc.layerSets[i].name.lastIndexOf('.')+1 ),
			path = docPath + '/' + ( doc.layerSets[i].name.substr(0, doc.layerSets[i].name.lastIndexOf('/') ) );
		//save file
		exportFile( newFile, format, path );
		app.activeDocument.close( SaveOptions.DONOTSAVECHANGES );
	}
}

//kick-off procedure
main();
