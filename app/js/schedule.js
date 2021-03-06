var Schedule = function() {
	this.time_range = {
		startHour: 0,
		endHour: 23,
		timeDivision: 15
	};
	
	this.date_range = {
		startDate: new Date('1970-01-01'),
		endDate: new Date('1970-01-01'),
		days: 1	
	};
	
	this.table = {
		colSpanDate: 96,
		colSpanHour: 4,
		schedule_data: {},
		selector: "#schedule"
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

	getHourSpan: function() {
		return this.table.colSpanHour;
	},

	getTimeSpan: function() {
		return (this.time_range.endHour - this.time_range.startHour) + 1;
	},

	getTableRow: function() {
		return  document.getElementById('table_timeline').rows.length;
	},

	getTableDate: function(column) {
		return document.getElementById('table_timeline').rows[0].cells[column].innerHTML;
	},

	getTableTime: function(column) {
		return document.getElementById('table_timeline').rows[1].cells[column].innerHTML;
	},

	addRow: function(text) {
		var table_designation = document.getElementById('table_designation');
		var tr = table_designation.appendChild(document.createElement('tr'));
		var td = document.createElement('td');

		td.appendChild(document.createTextNode(text));
		tr.appendChild(td);

		var table_timeline = document.getElementById('table_timeline');
		tr = table_timeline.appendChild(document.createElement('tr'));
		
		var row = this.getTableRow();

		for (let index_day = 0; index_day <= this.date_range.days; index_day++) {
			var date_parts = this.getTableDate(index_day).split(".");
			var column_date = new Date(date_parts[2], date_parts[1] - 1, date_parts[0]);

			for (let index_hour = 0; index_hour < this.table.colSpanDate; index_hour++) {
				var column_hour = this.lpad(this.getNumberColumnHour(index_hour),"0",2);

				td = document.createElement('td');
				td.appendChild(document.createTextNode('\u00A0'));
				td.setAttribute("id", row + "_" + this.formatDate(column_date) + "_" + column_hour);
				tr.appendChild(td);				
			}
		}	

	}, 

	getNumberColumnHour: function(value) {
		var column_hour = value / this.table.colSpanHour;
		return column_hour.toString().split(".")[0];
	},

	formatDate: function(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
	
		return [year, month, day].join('-');
	},

	lpad: function(value, padString, length) {
		while (value.length < length)
			value = padString + value;
		return value;
	},

	setSchedule: function(obj) {
		if(typeof obj === 'object' && obj !== null) {
			this.table.schedule_data = obj;
		} else {
			throw new Error('function setSchedule need an Object!');
		}
	},

	getSchedule: function () {
		var table_designation = document.getElementById('table_designation');
		var table_timeline = document.getElementById("table_timeline");
		var obj_date = new Object();
		var obj_employee = new Object();
		
		for (var iTableRow = 2, row_designation ; row_designation  = table_designation.rows[iTableRow]; iTableRow++) {
			var tdCounter = 0;
			var obj_date = new Object();
			var obj_schedule = new Object();

			for (var iDateTh = 0, colDateTh ; colDateTh  = table_timeline.rows[0].cells[iDateTh]; iDateTh++) {
				var obj_time = new Object();
				
				for (var iTimeTh = 0; iTimeTh <= this.getTimeSpan()-1; iTimeTh++) {
					var obj_minute = new Object();
					var counter_minute = 0;

					for (var iMinute = tdCounter; iMinute <= tdCounter + this.getHourSpan()-1; iMinute++) {
						var temp = 0;
						if(table_timeline.rows[iTableRow].cells[iMinute].className == "activated") {
							temp = 1;
						}
						
						obj_minute[counter_minute] = temp;
						counter_minute++;
					}
					tdCounter = iMinute
					obj_time[table_timeline.rows[1].cells[iTimeTh].innerText] = obj_minute;
				}
				
				obj_date[colDateTh.innerText] = obj_time;

			}
			obj_schedule['schedule'] = obj_date;
			obj_schedule['employee'] = row_designation.innerText;
			obj_employee[iTableRow-2] = obj_schedule;
		}

		return obj_employee;
	},

	isScheduleAvalible: function () {
		if(Object.keys(this.table.schedule_data).length > 0) {
			var table_timeline = document.getElementById("table_timeline");
			var schedule_data = this.table.schedule_data;
			for (var employee in schedule_data) {
				this.addRow(schedule_data[employee]['employee']);
				var schedules = schedule_data[employee];
				for (var schedule in schedules) {
					if(schedule == "schedule" && typeof schedules[schedule] === 'object' && schedules[schedule] !== null) {
						var dates = schedules[schedule];
						for (var date in dates) {
							var hours = dates[date];
							for (var column_date = 0, col_date; col_date = table_timeline.rows[0].cells[column_date]; column_date++) {
								if(date == col_date.innerHTML) {
									for (var hour in hours) {
										for (var column_hour = 0, col_hour; col_hour = table_timeline.rows[1].cells[column_hour]; column_hour++) {
											if(hour == col_hour.innerHTML) {
												var minutes = hours[hour];
												if(Object.keys(hours[hour]).length == this.table.colSpanHour) {
													for (var minute in minutes) {
														if(minutes[minute] == 1) {
															var column = this.getColumnToSetActiv(column_date, column_hour, minute);
															var row = this.getRows("table_timeline");
															table_timeline.rows[row-1].cells[column].className = "activated";
														}
													}
												} else {
													this.clearScheduleData();
													return;
												}
												
												break;
											}
										}
										
									}
									break;
								}
							} 
						}
					}					
				}
			}
		} 
	},

	getColumnToSetActiv: function(column_date, column_hour, column_minute) {
		return (column_date * this.table.colSpanDate) + (column_hour * this.table.colSpanHour) + (column_minute * 1);
	},

	getRows: function(table) {
		return document.getElementById(table).rows.length;
	},

	destroy: function() {
		var selector = this.table.selector;
		document.getElementById(selector.replace("#","")).innerHTML = "";
	},

	clearScheduleData: function() {
		var table_designation = document.getElementById('table_designation');
		var table_timeline = document.getElementById("table_timeline");

		this.table.schedule_data = new Object();

		for (var row = table_designation.rows.length; row  > 2; row--) { 
			table_timeline.deleteRow(row-1);
			table_designation.deleteRow(row-1);
		}
	}

};

Schedule.Renderer = function(s) {
	if (!(s instanceof Schedule)) {
		throw new Error('Is not a Object of schedule!');
	}
	this.schedule = s;
};

Schedule.Renderer.prototype = {
	draw: function() {
		var schedule = this.schedule;
		var selector = schedule.table.selector;

		schedule.setColSpanHour();
		schedule.setColSpanDate();

		var container = document.querySelector(selector);

		var divDesignation = appendDivDesignation(container);
		var divTimeline = appendDivTimeline(container);
		
		schedule.isScheduleAvalible();

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
					var th = document.createElement('th');
					
					th.colSpan = schedule.table.colSpanHour;
					th.appendChild(document.createTextNode(index+' Uhr'));
					tr.appendChild(th);
					
				}
			}
		}

	}
};