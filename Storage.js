export class Storage {
    constructor(key) {
        this.key = key
    }

    load() {
        return JSON.parse(localStorage.getItem(this.key)) || { 'Основная колода': [] }
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data))
    }
}