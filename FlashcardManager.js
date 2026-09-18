export class FlashcardManager {
    constructor(storage) {
        this.storage = storage
        this.collections = this.storage.load()
        this.currentCollectionName = Object.keys(this.collections)[0]
        
        setInterval(() => this.storage.save(this.collections), 5000)
    }

    getCurrentDeck() {
        return this.collections[this.currentCollectionName] || []
    }

    addCard(question, answer) {
        this.getCurrentDeck().push({ id: Date.now(), question, answer, learned: false })
    }

    deleteCard(id) {
        this.collections[this.currentCollectionName] = this.getCurrentDeck().filter(c => c.id !== id)
    }

    toggleLearned(id) {
        const card = this.getCurrentDeck().find(c => c.id === id)
        if (card) card.learned = !card.learned
    }

    shuffleDeck() {
        this.getCurrentDeck().sort(() => Math.random() - 0.5)
    }

    addCollection(name) {
        if (name && !this.collections[name]) {
            this.collections[name] = []
            this.currentCollectionName = name
        }
    }
}