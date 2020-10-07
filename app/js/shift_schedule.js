class Shift_schedule {

    constructor(start_date, end_date) {
        if (this.isDate(start_date) && this.isDate(end_date) && this.isValidTimeRange(start_date, end_date)) {
            this.start_date = start_date;
            this.end_date = end_date;

            this.getDays();
        } else {
            throw new Error('Can not initialize a shift schedule');
        }
    }

    isDate(value) {
        switch (typeof value) {
            case 'object':
                if (value instanceof Date) {
                    return !isNaN(value.getTime());
                }
            default:
                return false;
        }
    }

    isValidTimeRange(start_date, end_date) {
        if(start_date.getTime() <= end_date.getTime()) {
            return true;
        }
    }

    getDays() {
        this.days = Math.round((this.end_date.setHours(23,59,59,999)- this.start_date.getTime()) / (1000 * 3600 * 24)); 
    } 
}


