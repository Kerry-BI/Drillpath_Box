(function() { 
	const template = document.createElement('template')
	template.innerHTML = `
	<div id="container">
        <div id="box1" class="small-rectangle" draggable="false"></div>
        <div id="box2" class="small-rectangle" draggable="false"></div>
        <div id="box3" class="small-rectangle" draggable="false"></div>
        <div id="box4" class="small-rectangle" draggable="false"></div>
        <div id="box5" class="small-rectangle" draggable="false"></div>
        <div id="box6" class="small-rectangle" draggable="false"></div>
    </div>


	<style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 32px;
			width: 768px;
            margin: 0;
			border-radius: 10px;
        }

        #container {
            position: relative;
            width: 768px;
            height: 32px;
            background-color:transparent;
            display: flex;
        }

		.small-rectangle {
			flex: 1;
			width: 124px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			height: 32px;
			line-height: 32px;
			text-align: center;
			border: 1px solid gray;
			box-sizing: border-box;
			padding-left: 8px;
			padding-right: 8px;
			display: block;
			border-width: 0;
			font-size: 12px;
			border-radius: 3px;
			background-color: white;
			color: black;
		}

		/*css for selected box*/
		.selected{
			background-color: #346187 !important; 
			color:#ffffff !important;
		}

		/*css for drill path trail box */
		.selectedTrail{
			background-color: lightblue; 
			color:black; 
		}

		.hoverEffect{
			background: #b3b3b3 ;
			opacity: 0.5;
		}
		  
    </style>
	`;

	//var items;
	var dragSrcEl = null;
	class Drillpath extends HTMLElement {

		
		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: 'open'});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			//container for the drill path boxes 
			this._container = this._shadowRoot.getElementById('container');
			//the 6 boxes that will hold the drill path options 
            this._box1 = this._shadowRoot.getElementById('box1');
            this._box2 = this._shadowRoot.getElementById('box2');
            this._box3 = this._shadowRoot.getElementById('box3');
            this._box4 = this._shadowRoot.getElementById('box4');
            this._box5 = this._shadowRoot.getElementById('box5');
            this._box6 = this._shadowRoot.getElementById('box6');

			this._box1.addEventListener('click', this._buttonClicked.bind(this,this._box1));
            this._box2.addEventListener('click', this._buttonClicked.bind(this,this._box2));
            this._box3.addEventListener('click', this._buttonClicked.bind(this,this._box3));
			this._box4.addEventListener('click', this._buttonClicked.bind(this,this._box4));
            this._box5.addEventListener('click', this._buttonClicked.bind(this,this._box5));
            this._box6.addEventListener('click', this._buttonClicked.bind(this,this._box6));


			//the selected value in the drillpath
			//default it to the first value / box 1
			this.selectedBox=this._box1;
			this.numberOfSelectedBox ='0';
			this.drillpathSelectedIndex="0";

			this.drillpathSelectedID="";
			this.drillpathSelectedDescription="";

			//array for the boxes in the drillpath
			this.boxArray = [this._box1,this._box2,this._box3,this._box4,this._box5,this._box6];
			
            // Sample text array for testing
            this.descriptionArray = ['Value 1', 'Value 2', 'Value 3', 'Value 4','Value 5',"Value 6"];
			this.idArray = ['Value 1', 'Value 2', 'Value 3', 'Value 4','Value 5',"Value 6"];


            // Initial content update, selected item/css/ hiding boxes / populating content
            //this._updateContent();
			//this._setHoverEffects();
			

			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});

			this._props = {};
			} //end constructor 

			 //called when a month button is clicked. updates the new selected box 
			 _buttonClicked(BoxSelected) {
				this.selectedBox= BoxSelected;

				if(BoxSelected.id==="box6"){
					this.dispatchEvent(new CustomEvent("propertiesChanged", {
						detail: {
						  properties: {
							isLastDimensionInPath: true,
						  }
						}
					}));
				}else{
					this.dispatchEvent(new CustomEvent("propertiesChanged", {
						detail: {
						  properties: {
							isLastDimensionInPath: false,
						  }
						}
					}));
				}

				this._updateSelectedBox();
			  }

			onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
			}

			getdescriptionandid(dimensions){
				//dimensions = ["dim1|abc123", "dim2|agc457"];
				let descriptions = [];
				let ids = [];

				dimensions.forEach(dim => {
					const [id, description] = dim.split('|');
					descriptions.push(description);
					ids.push(id);
				});

				this.descriptionArray = descriptions;
				this.idArray = ids;
			}

			
			//updates the css when a box is selected
			_updateSelectedBox(){
				this.selectedBox.classList.remove('hoverEffect');
				this.selectedBox.classList.remove('selectedTrail');
				this.selectedBox.classList.remove('selected');
				
				//remove all additional css on all of the boxes 
				for(var i=0;i<this.boxArray.length;i++){
					//this.boxArray[i].style.backgroundColor='white'
					//this.boxArray[i].style.color='black'
					this.boxArray[i].classList.remove('selectedTrail');
					 this.boxArray[i].classList.remove('selected');
					 this.boxArray[i].classList.remove('hoverEffect');
				}

				//get the number in the array of the box that is selected 
				this.numberOfSelectedBox = this.selectedBox.id.match(/.$/)[0];

				this.drillpathSelectedIndex = this.numberOfSelectedBox;
				
				//style the trail boxes up to the selected box 
				for(var j=0;j<Number(this.numberOfSelectedBox);j++){
					//this.boxArray[j].style.backgroundColor='lightblue'
					this.selectedBox.style.color='black';
					this.boxArray[j].classList.add('selectedTrail');
					this.boxArray[j].classList.remove('hoverEffect');
					
				}

				//this.selectedBox.style.backgroundColor='#346187';
				//this.selectedBox.style.color='white';
				this.selectedBox.classList.add('selected');

				this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
					  properties: {
						selectedItemDrillpathIndex: this.drillpathSelectedIndex,
						selectedItemID:this.idArray[this.idArray.length-(6-(this.drillpathSelectedIndex-1))],
						selectedItemDescription:this.descriptionArray[this.descriptionArray.length-(6-(this.drillpathSelectedIndex-1))]
					  }
					}
				  
				}));
				this._setHoverEffects();
			}
			_getSelectedIDandDescription(){

			}

			onCustomWidgetAfterUpdate(changedProperties) {
				if ("selectedItemDrillpathIndex" in changedProperties) {
					//here call code to update the drill path 
					this.drillpathSelectedIndex = changedProperties["selectedItemDrillpathIndex"];
					
				}
				if ("color" in changedProperties) {
					//this._rootTile.style["background-color"] = changedProperties["color"];
				}
				if ("borderRadius" in changedProperties) {
					//this._rootTile.style["background-color"] = changedProperties["color"];
				}
				if ("selectedItem" in changedProperties) {
					//this._rootTile.style["background-color"] = changedProperties["color"];
				}
				if ("drillpathOptions" in changedProperties) {
					//here call code to update the drill path 
					this.getdescriptionandid(changedProperties["drillpathOptions"])
					this._updateContent();
				}
				if ("selectedItemDrillpathIndex" in changedProperties) {
					//here call code to update the drill path to the selected index 
					this.drillpathSelectedIndex=changedProperties["selectedItemDrillpathIndex"]

					var temp = this.drillpathSelectedIndex
				}

				if ("nextDimensionIndex" in changedProperties) {
					//here call code to update the drill path to the selected index 
					this.drillpathSelectedIndex=changedProperties["nextDimensionIndex"]

					var temp= changedProperties["nextDimensionIndex"];

					if(temp==="1"){
						this._buttonClicked(this._box1);
					}else if(temp==="2"){
						this._buttonClicked(this._box2);
					}
					else if(temp==="3"){
						this._buttonClicked(this._box3);
					}
					else if(temp==="4"){
						this._buttonClicked(this._box4);
					}
					else if(temp==="5"){
						this._buttonClicked(this._box5);
					}
					else if(temp==="6"){
						this._buttonClicked(this._box6);
					}

					var event = new Event("onClick");
				    this.dispatchEvent(event);

				}
				
			}

			onCustomWidgetResize (width, height) {
				
			  }

              
		// Function to update the content of small rectangles
		_updateContent() {

			for (let k = 0; k < this.boxArray.length; k++) {
				this.boxArray[k].style.visibility = 'visible';
				}

			//starting position for first box is 6(total number of boxes) - length of array that will feed the boxes info
			let start = 6-this.descriptionArray.length;

			//set the intial selected box to the first box with info
			this.selectedBox=this.boxArray[start];

			//update what box is selected
			this._updateSelectedBox();
			

			//Update the content of small rectangles with info 
			for (let i = 0; i < this.descriptionArray.length; i++) {
			this.boxArray[start+i].innerText = this.descriptionArray[i];
			}
			//Iterate through boxes and hide ones not in use 
			for (let j = 0; j < start; j++) {
				this.boxArray[j].style.visibility = 'hidden';
				}
		}


		//method to set the different on hover effects for the boxes in the drillpath 
		_setHoverEffects(){
			for (let i = 0; i < this.boxArray.length; i++) {
				// this is the function to set hover effects 
				 
				this.boxArray[i].addEventListener('mouseover', function() {
					
					if (!this.classList.contains('selectedTrail') && !this.classList.contains('selected') ) {
					  this.classList.add('hoverEffect');
					}
				  });

				this.boxArray[i].addEventListener('mouseout', function() {
					if (!this.classList.contains('selectedTrail') && !this.classList.contains('selected')  ) {
					  this.classList.remove('hoverEffect');
					}
				  });

				  if (this.classList.contains('selectedTrail')){
					this.classList.remove('hoverEffect');
				}
			}
		}

		set selectedItemDrillpathIndex(newCurrentDrillpathIndex) {
			this.drillpathSelectedIndex = newCurrentDrillpathIndex;
		}
		
		get selectedItemDrillpathIndex() {
			return this.drillpathSelectedIndex;
		}}

		customElements.define('com-sap-sample-drillpathbox', Drillpath)
	  })()
