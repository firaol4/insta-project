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
    this.photos = [];
    this.photo = null;
    this.currentIndex = 1;
    this.totalPhotos = 50;
    
    
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/insta-project.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }
  async connectedCallback() {
    super.connectedCallback();
    await this.loadAllPhotos();
    if (this.photos.length > 0) {
      this.loadPhoto();
    } else {
      console.error("No artworks found in data.json");
    }
  }

  async loadAllPhotos() {
    try {
      const res = await fetch("/api/basquiat");
      const data = await res.json();
      this.photos = data.artworks || [];
      this.totalPhotos = this.photos.length;
    } catch (err) {
      console.error("Error loading artworks:", err);
    }
  }

  loadPhoto() {
    if (!this.photos || this.photos.length === 0) return;

    const idx = this.currentIndex - 1;
    const art = this.photos[idx];
    if (!art) return;

    this.photo = {
      image: art.image,
      title: art.title,
      artist: art.artist,
      year: art.year,
      description: art.description,
      id: art.id,
      likes: 0,
      dislikes: 0,
    };
    this.requestUpdate();
  }
 
  

  likePhoto(photo) {
    const reactions = JSON.parse(localStorage.getItem("reactions") || "{}");
    const currentReaction = reactions[photo.image];

    if (currentReaction === "like") {
      // If already liked, unpress (remove reaction)
      delete reactions[photo.image];
    } else {
      // Set to like and remove dislike if it was set
      reactions[photo.image] = "like";
    }
    
    localStorage.setItem("reactions", JSON.stringify(reactions));
    this.requestUpdate();
    
  }

  dislikePhoto(photo) {
    const reactions = JSON.parse(localStorage.getItem("reactions") || "{}");
    const currentReaction = reactions[photo.image];

    if (currentReaction === "dislike") {
      // If already disliked, unpress 
      delete reactions[photo.image];
    } else {
      // Set to dislike and remove like if it was set
      reactions[photo.image] = "dislike";
    }

    
    localStorage.setItem("reactions", JSON.stringify(reactions));
    this.requestUpdate();
  }
  
  getUserReaction(image) {
    const reactions = JSON.parse(localStorage.getItem("reactions") || "{}");
    return reactions[image] || null;
  }


  sharePhoto(photo) {
    navigator.clipboard.writeText(photo.image);
   
  }

  nextArtwork() {
    if (this.currentIndex < this.totalPhotos) {
      this.currentIndex++;
      this.loadPhoto();
    }
  }

  prevArtwork() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
      this.loadPhoto();
    }
  }

  // Lit reactive properties
  static get styles() {
    return [super.styles, css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: light-dark(var(--ddd-theme-default-slateLight), var(--ddd-theme-default-charcoal));
        color: light-dark(var(--ddd-theme-default-creekTeal), var(--ddd-theme-default-keystoneYellow));
        font-family: var(--ddd-font-navigation);
      }
  
      .photo-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 400px;
        height: 600px;
        background-color: var(--ddd-theme-default-white);
        border: var(--ddd-border-xs);
        border-radius: var(--ddd-radius-sm);
        box-shadow: var(--ddd-boxShadow-sm);
        overflow: hidden;
        text-align: center;
      }
  
      h3, p {
        margin: 4px 0;
        color: inherit;
      }
  
      img {
        width: 100%;
        height: 300px;
        object-fit: contain;
        
        flex-shrink: 0;
      }
  
      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        width: 100%;
        border-top: var(--ddd-border-xs);
        
      }
  
      .actions button {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
  
      .actions button:hover {
        transform: scale(1.1);
      }
  
      .actions button.liked {
        color:var(--ddd-theme-default-creekTeal);
        text-shadow: 0 0 8px var(--ddd-theme-default-forestGreen);
      }
  
      .actions button.disliked {
        color: var(--ddd-theme-default-discoveryCoral);
        text-shadow: 0 0 8px var(--ddd-theme-default-original87Pink);
      }
  
      .actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
  
      .details {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px 15px;
        width: 100%;
        box-sizing: border-box;
        color: var(--ddd-theme-default-potentialMidnight);
        text-align: left;
        line-height: 1.4;
      }
    `];
  }
  
  

  // Lit render the HTML
  render() {
    if (!this.photo) {
      return html`<p>Loading artwork...</p>`;
    }
    const reaction = this.getUserReaction(this.photo.image);

    return html`
      <div class="photo-card">
        <h3>${this.photo.title} (${this.photo.year})</h3>
        <p><strong>${this.photo.artist}</strong></p>

        <img src="${this.photo.image}" alt="${this.photo.title}" />
  
        <div class="actions">
          <button @click=${this.prevArtwork} ?disabled=${this.currentIndex === 1}>⬅️</button>
          <button 
          class=${reaction === "like" ? "liked" : ""}
          @click=${() => this.likePhoto(this.photo)}>
          👍
        </button>
        <button 
          class=${reaction === "dislike" ? "disliked" : ""}
          @click=${() => this.dislikePhoto(this.photo)}>
          👎
        </button>
          
          <button @click=${() => this.sharePhoto(this.photo)}>🔗</button>
          <button @click=${this.nextArtwork} ?disabled=${this.currentIndex === this.totalPhotos}>➡️</button>
        </div>
  
        <div class="details">
          <p>${this.photo.description}</p>
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