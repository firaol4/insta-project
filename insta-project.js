/**
 * Copyright 2025 Firaol Tulu Firew
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `insta-project`
 * 
 * @demo index.html
 * @element insta-project
 */
export class InstaProject extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "insta-project";
  }

  constructor() {
    super();
    this.title = "";
    this.photos = null;
    
    
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/insta-project.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.loadPhoto(); 
  }
  async loadPhoto() {
    try {
      const res = await fetch("https://randomfox.ca/floof/");
      const data = await res.json();
      this.photo = { source: data.image, link: data.link };
    } catch (err) {
      console.error("Error loading fox:", err);
    }
  }
 
  

  likePhoto(photo) {
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[photo.source] = true;
    localStorage.setItem("likes", JSON.stringify(likes));
    
  }

  dislikePhoto(photo) {
    const likes = JSON.parse(localStorage.getItem("likes") || "{}");
    likes[photo.source] = false;
    localStorage.setItem("likes", JSON.stringify(likes));
    
  }

  sharePhoto(photo) {
    navigator.clipboard.writeText(photo.source);
    alert("Fox image link copied to clipboard!");
  }

  async nextFox() {
    await this.loadPhoto(); // fetch a new random fox
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      photo: { type: Array },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
     
      
      
      .photo-card {
          background-color: white;
          border: 1px solid #dbdbdb;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        
        
        

        img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-top: 1px solid #efefef;
          border-bottom: 1px solid #efefef;
        }

        .actions button {
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          transition: transform 0.1s ease;
        }

        .actions button:hover {
          transform: scale(1.1);
        }

        .details {
          padding: 10px 15px;
        }

        .link {
          margin-top: 5px;
        }

        .link a {
          color: #00376b;
          text-decoration: none;
          font-size: 0.9em;
        }

        .link a:hover {
          text-decoration: underline;
        }

       
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="photo-card">
        <h3>${this.title}</h3>
        <img src="${this.photo.source}" alt="Random Fox" />
        <div class="actions">
          <button @click=${() => this.likePhoto(this.photo)}>👍</button>
          <button @click=${() => this.dislikePhoto(this.photo)}>👎</button>
          <button @click=${() => this.sharePhoto(this.photo)}>🔗</button>
          <button @click=${this.nextFox}>➡️ Next</button>
        </div>
        <div class="link">
          <a href="${this.photo.link}" target="_blank">View source</a>
        </div>
      </div>
  </div>
`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(InstaProject.tag, InstaProject);