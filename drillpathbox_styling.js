(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
	<form id="form_text">
	<fieldset>
	  <legend>KPI Tile Value Properties</legend>
	  <table>
		<tr>
		  <td>Heading Text</td>
		  <td><input id="selectedItemDrillpathIndex" type="text" size="40" maxlength="40"></td>
		</tr>
		
	  <input type="submit">
	</fieldset>
  </form>
		
		
	`;

	class drillpathboxStyle extends HTMLElement {
		constructor() {
			super();	
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form_text").addEventListener("submit", this._submittext.bind(this));
		}

		_submittext(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							selectedItemDrillpathIndex: this.selectedItemDrillpathIndex,
						}
					}
			}));
		}

		set selectedItemDrillpathIndex(newselectedItemDrillpathIndex) {
			this._shadowRoot.getElementById("selectedItemDrillpathIndex").value = newselectedItemDrillpathIndex;
		}

		get selectedItemDrillpathIndex() {
			return this._shadowRoot.getElementById("selectedItemDrillpathIndex").value;
		}

   
	}

customElements.define("drillpathbox-style", drillpathboxStyle);
})();