import request from 'superagent';

Vue.component("nice-thing", {
	props: ['thing'],
	template: '<li class="collection-item">' + 
			'<div><a type="text" style="margin-right: 1em"> {{ thing.text }}</a>' +
			'<a class="secondary-content red white-text small" v-on:click="$emit(\'remove\')">' +
			'<i class="material-icons">close</i></a></div></li>'
})

var listApp = new Vue( {
	el: '#list',
	data: {
		things: [],
		newthing: '',
		errortext: '',
		infotext: '',
		isDisabled: true
	},
	mounted() {
		this.startLoading(0);
		request
	   	.get('/list/retrieveThings')
	   	.then(res => {
	      console.log(res.body);
	      if(res.body.msg === undefined) {
		      for(var i = 0; i < res.body.length; i++) {
		      	var id = this.things.length === 0 ? 0 : this.things[this.things.length-1].id + 1;
					this.things.push({
						id: id,
						text: res.body[i].name
					});
		      }
		  }
		  else {
		  	this.errortext = res.body.msg;
		  }
	   	})
	   	.catch(err => {
	      this.errortext = "Error retrieving things: " + err.message;
   		});
	    this.stopLoading(0);
	},
	methods: { 
		addThing: function(){
			var testResult = this.checkThing(this.newthing);
			if(testResult === true) {
				this.startLoading(1);
				request
				.post("/list/addThing")
				.type('json')
				.send({ thing: this.newthing })
				.then((res) => {
						if(res.body.msg !== undefined) {
				        	this.errortext = res.body.msg;
							this.stopLoading(2);
				        	return;
						}
						else {						
							var id = this.things.length === 0 ? 0 : this.things[this.things.length-1].id + 1;
							this.things.push({
								id: id,
								text: this.newthing
							});
							this.newthing = "";
							this.stopLoading(1);
						}
				    }
				)
				.catch((err) => console.log(err));
			}
			else {
				this.errortext = "Juttu saa olla 20 merkkiä pitkä ja sisältää vain kirjaimia, numeroita, pisteitä ja pilkkuja!";
			}
		},
		removeThing: function(id){	
			var index;		
			var rmThing;

			for (var i = 0; i < this.things.length; i++) {
				if(this.things[i].id === id) {
					index = i;
					break;
				}
			}
			rmThing = this.things[index].text;

			this.startLoading(1);
			request
			.post("/list/removeThing")
			.type('json')
			.send({ thing: rmThing })
			.then((res) => {
					console.log(res.body);
					if(res.body.msg !== undefined) {
			        	this.errortext = res.body.msg;
						this.stopLoading(2);
			        	return;
					}
					else {	
						this.things.splice(index,1);
						this.stopLoading(1);
					}
				}
			)
			.catch((err) => console.log(err));
		},
		checkThing: function(thing) {
			var regex = RegExp("^[A-za-z1-9.,\\s]{1,20}$");
			return regex.test(thing);
		},
		startLoading: function(i) {
			if(i === 0)
				this.infotext = "Ladataan dataa...";
			if(i === 1)
				this.infotext = "Tallennetaan muutoksia...";
			this.isDisabled = true;
		},
		stopLoading: function(i) {
			setTimeout(() => { 
				if(i === 0)
					this.infotext = "Data ladattu!";
				if(i === 1)
					this.infotext = "Muutokset tallennettu!";
				if(i === 2)
					this.infotext = "";
				this.isDisabled = false;
			}, 1000);
		}
	}
})
