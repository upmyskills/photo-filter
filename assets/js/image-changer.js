class TimeOfDay {
    whatIsNow() {
        const time = new Date().getHours();
        if (time < 6) return this.timesOfDay[3];
        if (time < 12) return this.timesOfDay[0];
        if (time < 18) return this.timesOfDay[1];
        if (time < 24) return this.timesOfDay[2];
    }

    constructor () {
        this.timesOfDay = ['morning', 'day', 'evening', 'night'];
        this.pics = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        this.ext = '.jpg';
        this.currentPic = 0;
        this.totalPic = 20;
        this.lastTime = this.whatIsNow();
        this.basePath = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images';
    }

    next() {
        if (this.currentPic > this.totalPic - 1 || this.lastTime !== this.whatIsNow()) {
            this.currentPic = 0;
            this.lastTime = this.whatIsNow();
        };
        return [this.basePath, this.whatIsNow(), this.pics[this.currentPic++]+this.ext].join('/');
    }
}