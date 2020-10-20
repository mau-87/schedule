var Schedule = function() {
	this.time_range = {
		startHour: 0,
		endHour: 23
	};
	
	this.date_range = {
		startDate: new Date('1970-01-01'),
		endDate: new Date('1970-01-01'),	
	};
	
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
				this.startHour = startHour;
				this.endHour = endHour;
			} else {
				throw new Error('the start hour must less the end hour');
			}
			
		} else {
			throw new Error('function setTime need a number between 0 and 23');
		}
	},

	isValidTimeRange: function(startHour, endHour) {
		return (startHour <= endHour); 
	},

	isValidHour: function(hour) {
		return hour >= 0 && hour < 23;
	},

	setDate: function(startDate, endDate) {
		if(this.isValidDate(startDate) && this.isValidDate(endDate)) {
			if(this.isValidDateRange(startDate, endDate)) {
				this.date_range.startDate = startDate;
				this.date_range.endDate = endDate;

				this.DiffDays();
			} else {
				throw new Error('the start date must earlier or equals to the end date');
			}
		} else {
			throw new Error('function setDate need a date');
		}
	},

	isValidDate: function(date) {
		return date instanceof Date && !isNaN(date);
	},

	isValidDateRange: function(startDate, endDate) {
		return startDate.getTime() <= endDate.getTime();
	}
};

Schedule.Renderer = function(s) {
	if (!(s instanceof Schedule)) {
		throw new Error('Is not a Object of Schedule');
	}
	this.Schedule = s;
};
