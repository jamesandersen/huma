export class Loadable<T> {
    constructor(public value: T = null, public loading = false) { }
}