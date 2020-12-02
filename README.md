# schedule.js
A javascript for a responsive schedule. With schedule.js you can create a shift schedule for your department, event etc.

# Installation
Load the plugin and styles in your HTML Header from the `app` folder:
```html
<link rel="stylesheet" href="app/css/schedule.css">
<script src="app/js/schedule.js"></script>
```

Add a schedule placeholder:
```html
<div id="schedule"></div>
```

# Usage
Create a schedule object:
```javascript
var schedule = new Schedule();
```

Add Rows with this code
```javascript
schedule.addRow('Employee A');
schedule.addRow('Employee B');
```

Render your schedule to your div
```javascript
var renderer = new Schedule.Renderer(schedule);
renderer.draw('#schedule');
```

Get the value of the schedule as object
```javascript
schedule.getSchedule();
```

Here are some optional options
```javascript
var table = JSON.parse(schedule.getSchedule()); // example to get the object in the correct structure
schedule.setSchedule(table); // set an object to schedule

schedule.setTime(0,23); // set time range of schedule

schedule.setDate(new Date('2020-01-01'), new Date('2020-01-08')); // set date range of schedule

schedule.setTimeDivision(15); // set division of hour
```