class FiltersBar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <link rel="stylesheet" href="renderer/components/css/filters-bar.css" />
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

        <input id="search" placeholder="Search…" />
      </div>
    `

    /* emit on every change */
    this.shadowRoot
      .querySelectorAll('select,input')
      .forEach((el) => el.addEventListener('input', () => this.emit()))
  }

  /** current state as an object */
  getValues() {
    return {
      sort: this.shadowRoot.getElementById('sort').value,
      when: this.shadowRoot.getElementById('when').value,
      search: this.shadowRoot.getElementById('search').value.trim()
    }
  }

  /** allow parent to preset dropdowns */
  setValues({ sort, when, search }) {
    if (sort) this.shadowRoot.getElementById('sort').value = sort
    if (when) this.shadowRoot.getElementById('when').value = when
    if (search !== undefined)
      this.shadowRoot.getElementById('search').value = search
  }

  emit() {
    this.dispatchEvent(
      new CustomEvent('filters-changed', {
        bubbles: true,
        detail: this.getValues()
      })
    )
  }
}
customElements.define('filters-bar', FiltersBar)
