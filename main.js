import { Storage } from './Storage.js'
import { FlashcardManager } from './FlashcardManager.js'
import { FlashcardUI } from './FlashcardUI.js'

const storage = new Storage('flashcards-collections')
const manager = new FlashcardManager(storage)
const ui = new FlashcardUI(manager)

ui.render()