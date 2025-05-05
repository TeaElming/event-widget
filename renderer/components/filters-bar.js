class FiltersBar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <link rel="stylesheet" href="renderer/components/filters-bar.css">
      <div class="bar">
        <select id="sort">
          <option value="added">Recently added</option>
          <option value="next">Next event</option>
          <option value="name">Alphabetically</option>
        </select>
        <select id="when">
          <option value="all">All</option>
          <option value="future">Yet to happen</option>
          <option value="past">Past events</option>
        </select>
        <input id="search" placeholder="Search…"/>
      </div>`
    this.shadowRoot
      .querySelectorAll('select,input')
      .forEach((el) => el.addEventListener('input', () => this.emit()))
  }
  emit() {
    const sort = this.shadowRoot.getElementById('sort').value
    const when = this.shadowRoot.getElementById('when').value
    const search = this.shadowRoot.getElementById('search').value.trim()
    this.dispatchEvent(
      new CustomEvent('filters-changed', {
        bubbles: true,
        detail: { sort, when, search }
      })
    )
  }
}
customElements.define('filters-bar', FiltersBar)
