export class FlashcardUI {
    constructor(manager) {
        this.manager = manager
        this.currentIndex = 0
        this.showQuestion = true
        this.initEventListeners()
    }

    render() {
        this.renderTable()
        this.renderStudyArea()
        this.updateCollectionSelect()
    }

    renderTable() {
        const container = document.querySelector("#table-container")
        const deck = this.manager.getCurrentDeck()
        let html = `<table><thead><tr><th>Вопрос</th><th>Ответ</th><th style="text-align:center">Выучено</th><th>Действия</th></tr></thead><tbody>`
        
        deck.forEach(card => {
            html += `<tr>
                <td>${card.question}</td>
                <td>${card.answer}</td>
                <td style="text-align:center"><input type="checkbox" class="action-check" data-id="${card.id}" ${card.learned ? 'checked' : ''}></td>
                <td>
                    <button class="btn-edit action-edit" data-id="${card.id}">Ред.</button>
                    <button class="btn-delete action-delete" data-id="${card.id}">Удалить</button>
                </td>
            </tr>`
        })
        container.innerHTML = html + '</tbody></table>'
    }

    renderStudyArea() {
        const mode = document.querySelector("#modeSelect").value
        const deck = this.manager.getCurrentDeck()
        const filtered = mode === 'all' ? deck : deck.filter(card => !card.learned)
        
        const display = document.querySelector("#cardDisplay")
        const counter = document.querySelector("#counter")
        const markBtn = document.querySelector("#markLearnedBtn")

        if (filtered.length === 0) {
            display.textContent = "Колода пуста или всё выучено"
            counter.textContent = "0 / 0"
            markBtn.style.display = "none"
            return
        }

        markBtn.style.display = "block"
        if (this.currentIndex >= filtered.length) this.currentIndex = Math.max(0, filtered.length - 1)
        
        const card = filtered[this.currentIndex]
        display.textContent = this.showQuestion ? card.question : card.answer
        counter.textContent = `${this.currentIndex + 1} / ${filtered.length}`
        markBtn.textContent = card.learned ? "Вернуть в обучение" : "Я выучил!"

        document.querySelector("#prevBtn").disabled = this.currentIndex === 0
        document.querySelector("#nextBtn").disabled = this.currentIndex === filtered.length - 1
    }

    updateCollectionSelect() {
        const select = document.querySelector("#collectionSelect")
        select.innerHTML = Object.keys(this.manager.collections).map(name => 
            `<option value="${name}" ${name === this.manager.currentCollectionName ? 'selected' : ''}>${name}</option>`
        ).join('')
    }

    initEventListeners() {
        document.querySelector("#table-container").onclick = (e) => {
            const id = parseInt(e.target.dataset.id)
            if (!id) return
            if (e.target.classList.contains("action-delete")) { this.manager.deleteCard(id); this.render() }
            if (e.target.classList.contains("action-edit")) {
                const card = this.manager.getCurrentDeck().find(c => c.id === id)
                document.querySelector("#questionInput").value = card.question
                document.querySelector("#answerInput").value = card.answer
                this.manager.deleteCard(id)
                this.render()
            }
        }

        document.querySelector("#table-container").onchange = (e) => {
            if (e.target.classList.contains("action-check")) {
                this.manager.toggleLearned(parseInt(e.target.dataset.id))
                this.render()
            }
        }

        document.querySelector("#addingCard").onclick = () => {
            const q = document.querySelector("#questionInput")
            const a = document.querySelector("#answerInput")
            if (q.value.trim() && a.value.trim()) {
                this.manager.addCard(q.value, a.value)
                q.value = ''
                a.value = ''
                this.render()
            }
        }

        document.querySelector("#flipBtn").onclick = () => { this.showQuestion = !this.showQuestion; this.renderStudyArea() }
        document.querySelector("#nextBtn").onclick = () => { this.currentIndex++; this.showQuestion = true; this.renderStudyArea() }
        document.querySelector("#prevBtn").onclick = () => { this.currentIndex--; this.showQuestion = true; this.renderStudyArea() }
        document.querySelector("#modeSelect").onchange = () => { this.currentIndex = 0; this.renderStudyArea() }
        document.querySelector("#shuffleBtn").onclick = () => { this.manager.shuffleDeck(); this.currentIndex = 0; this.render() }
        document.querySelector("#collectionSelect").onchange = (e) => { this.manager.currentCollectionName = e.target.value; this.currentIndex = 0; this.render() }
        document.querySelector("#newCollectionBtn").onclick = () => {
            const name = prompt('Название новой колоды:')
            this.manager.addCollection(name)
            this.render()
        }
        document.querySelector("#markLearnedBtn").onclick = () => {
            const mode = document.querySelector("#modeSelect").value
            const filtered = mode === 'all' ? this.manager.getCurrentDeck() : this.manager.getCurrentDeck().filter(c => !c.learned)
            this.manager.toggleLearned(filtered[this.currentIndex].id)
            this.render()
        }
    }
}