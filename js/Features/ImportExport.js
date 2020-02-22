// 	#############  IMPORTEXPORT.JS  ################
//	 		Authors : 	FERSULA Jérémy
// 	################################################
// 
// 	To help you dig into this code, the main parts
// 	in this file are indexed via comments.	
//
//		Ex:  [ 2.4 ] - Something
//
//	References to other parts of the app are linked
//	via indexes.
//
//		### indexes a section
//		--- indexes a sub-section
//
//	---
//
//	All relations between indexing in files can be
// 	found on our GitHub :
//
// 		https://github.com/huacayacauh/JS-Sandpile
//
// 	---
//
//  This file is under CC-BY.
//
//	Feel free to edit it as long as you provide 
// 	a link to its original source.
//
// 	################################################

// ################################################
//
// 	[ 1.0 ] 	JSON Translation of Tilings
//
// ################################################

jsonToTilling = function(json){

	var tiles = [];
    for(var i = 0; i < json.tiles.length; i++){
        var tileJson = json.tiles[i]
		var til = new Tile(tileJson.id, tileJson.neighbors, tileJson.bounds, tileJson.lim);
		til.sand = tileJson.sand;
        tiles.push(til);
    }

    currentTiling = new Tiling(tiles);
	
	while(app.scene.children.length > 0){
		app.scene.remove(app.scene.children[0]);
		console.log("cleared");
	}
	
	selectedTile = null;
	currentIdentity = null;
	app.controls.zoomCamera();
	app.controls.object.updateProjectionMatrix();

	app.scene.add(currentTiling.mesh);
	currentTiling.colorTiles();
	//console.log(currentTiling);

	playWithDelay();

	var render = function () {
		requestAnimationFrame( render );
		app.controls.update();
		app.renderer.render( app.scene, app.camera );
	};
	render();
}


tillingToJson = function(sandpile){

    var json = {};
	
    var tiles = []

    for(var i = 0; i < sandpile.tiles.length; i++){
        var tile = sandpile.tiles[i];
        tiles.push({id: tile.id, neighbors: tile.neighbors, bounds: tile.bounds, lim: tile.limit, sand:tile.sand});
        
    }

    json.tiles = tiles;

    var text = JSON.stringify(json);

    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile; 
};

// ################################################
//
// 	[ 2.0 ] 	Tiling Download
//
// ################################################

//cette fonction est applé quand on clique sur le bouton selection
handleFileSelect = function(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    //console.log("Type:", file.type);

    // files is a FileList of File objects. List some properties.
    reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = function(evt){
        
        var fileString = evt.target.result;
        //console.log(fileString);

        var json = JSON.parse(fileString);

        //app.sandpile = json;

        jsonToTilling(json);


    }
}

//cette fonction est appelé quand on clique sur le bouton create file
handleDownload = function(evt){

    if(currentTiling === undefined) return
    var link = document.getElementById('downloadlink');
    link.href = tillingToJson(currentTiling);
	link.setAttribute('download', "Sandpile.JSON");
    //link.style.display = 'block';
	link.click();
}

var create = document.getElementById('create')
var textFile = null;

create.addEventListener('click', handleDownload, false);

document.getElementById('files').addEventListener('change', handleFileSelect, false);


// ################################################
//
// 	EOF
//
// ################################################

