import { v4 as uuidv4 } from 'uuid'

export default class Page {
    constructor() {
        this.id = uuidv4(),
            this.background = null
        this.paths = []
    }
}