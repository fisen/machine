/**
 * The undoRedo class handles the Undo and Redo functionalities of the machine site.
 * 
 */

function UndoRedo() {
	this.done = new Array();
	this.unDone = new Array();
};

UndoRedo.prototype.save = function(gearUpdate){
	
	this.done.push(gearUpdate);

	return this.done;
};	

UndoRedo.prototype.undo = function(){
		console.log("done: "+this.done.length);
		console.log("unDone: "+this.unDone.length);
		if(this.done.length>0){
		var a = this.done.pop();

		this.unDone.push(a);

		return a;
		}
		console.log("done: "+this.done.length);
		console.log("unDone: "+this.unDone.length);
};

UndoRedo.prototype.redo = function( gm){
	console.log("done.length: "+ this.done.length);
	console.log("unDone.length: "+ this.unDone.length);
	if(this.unDone.length>0){
		
		var a = this.unDone.pop();
		if(a!=undefined){
			if(a[0]=="Add"){
				gm.removeGear(a[1]);
				this.done.push(a);
				return;
			}
			if(a[0]=="Delete"){
				gm.placeGear(a[1]);
				this.done.push(a);
				return;
			}
			if(a[0]=="Color"){
				a[1].setColor(a[3]);
				this.done.push(a);
				return;
			}
			if(a[0]=="Transparancy"){
				a[1].setTransparancy(a[2].getTransparancy());
				this.done.push(a);
				return;
			} 
			
		}
		
		console.log("done.length: "+ this.done.length);
		console.log("unDone.length: "+ this.unDone.length);
	}
	UndoRedo.prototype.del = function (){
		this.done.pop();	
	};
};