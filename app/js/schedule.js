var Schedule = function() {
	this.time_range = {
		startHour: 0,
		endHour: 23,
		timeDivision: 15
	};
	
	this.date_range = {
		startDate: new Date('1970-01-01'),
		endDate: new Date('1970-01-01'),	
	};
	
	this.table = {
		colSpanDate: 96,
		colSpanHour: 4
	}

	this.data = [];
	this.DiffDays();
};

Schedule.prototype = {
	
	DiffDays: function() {
		this.date_range.days = (new Date(this.date_range.endDate).getTime() - new Date(this.date_range.startDate).getTime()) / (1000 * 3600 * 24);

	},

	setTime: function(startHour,endHour) {
		if(this.isValidHour(startHour) && this.isValidHour(endHour)) {
			if(this.isValidTimeRange(startHour, endHour)) {
				this.time_range.startHour = startHour;
				this.time_range.endHour = endHour;
			} else {
				throw new Error('the start hour must less the end hour!');
			}
			
		} else {
			throw new Error('function setTime need a number between 0 and 23!');
		}
	},

	isValidTimeRange: function(startHour, endHour) {
		return (startHour <= endHour); 
	},

	isValidHour: function(hour) {
		return hour >= 0 && hour <= 23;
	},

	setDate: function(startDate, endDate) {
		if(this.isValidDate(startDate) && this.isValidDate(endDate)) {
			if(this.isValidDateRange(startDate, endDate)) {
				this.date_range.startDate = startDate;
				this.date_range.endDate = endDate;

				this.DiffDays();
			} else {
				throw new Error('the start date must earlier or equals to the end date!');
			}
		} else {
			throw new Error('function setDate need a date!');
		}
	},

	isValidDate: function(date) {
		return date instanceof Date && !isNaN(date);
	},

	isValidDateRange: function(startDate, endDate) {
		return startDate.getTime() <= endDate.getTime();
	},

	setTimeDivision: function(timeDivision) {
		if (Number.isInteger(60 / timeDivision)) {
			this.time_range.timeDivision = timeDivision;
		} else {
			throw new Error('Please enter a correct number!');
		}
		
	},

	setColSpanDate: function() {
		this.table.colSpanDate = ((this.time_range.endHour - this.time_range.startHour) + 1) * this.table.colSpanHour;
	},

	setColSpanHour: function() {
		this.table.colSpanHour = 60 / this.time_range.timeDivision;
	},

	}

};

Schedule.Renderer = function(s) {
	if (!(s instanceof Schedule)) {
		throw new Error('Is not a Object of schedule!');
	}
	this.schedule = s;
};

Schedule.Renderer.prototype = {
	draw: function(selector) {
		var schedule = this.schedule;

		schedule.setColSpanHour();
		schedule.setColSpanDate();

		var container = document.querySelector(selector);

		var divDesignation = appendDivDesignation(container);
		var divTimeline = appendDivTimeline(container);
	

		function appendDivDesignation(container) {
			div = container.appendChild(document.createElement('div'));
			div.id = "designation"
			div.className = 'col-25';
			return appendTableDesignation(div);
		}

		function appendTableDesignation(div) {
			table = div.appendChild(document.createElement('table'));
			table.id = "table_designation"
			return appendTableTrHeaderDesignation(table);
		}

		function appendTableTrHeaderDesignation(table) {
			for (let index = 0; index < 2; index++) {
				var tr = table.appendChild(document.createElement('tr'));
				var td = document.createElement('td');

				td.appendChild(document.createTextNode('\u00A0'));
				tr.appendChild(td);
				
			}		
		}

		function appendDivTimeline(container) {
			div = container.appendChild(document.createElement('div'));
			div.id = "timeline"
			div.className = 'col-75';
			return appendTableTimeline(div);
		}

		function appendTableTimeline(div) {
			table = div.appendChild(document.createElement('table'));
			table.id = "table_timeline"
			return appendTableTrHeaderTimeline(table);
		}

		function appendTableTrHeaderTimeline(table) {
			var tr = table.appendChild(document.createElement('tr'));
			var date = schedule.date_range.startDate;

			for (let index = 0; index <= schedule.date_range.days; index++) {
				var th = document.createElement('th');

				th.colSpan = schedule.table.colSpanDate;
				th.appendChild(document.createTextNode(date.toLocaleDateString()));
				tr.appendChild(th);
				
				date.setDate(date.getDate() +1);
			}	
			
			tr = table.appendChild(document.createElement('tr'));
			
			for (let date_counter = 0; date_counter <= schedule.date_range.days; date_counter++) {
				for (let index = schedule.time_range.startHour; index <= schedule.time_range.endHour; index++) {
					var td = document.createElement('td');
					
					td.colSpan = schedule.table.colSpanHour;
					td.appendChild(document.createTextNode(index+' Uhr'));
					tr.appendChild(td);
					
				}
			}
		}

	}
};