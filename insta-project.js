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
  
    const urlParams = new URLSearchParams(window.location.search);
    const photoParam = urlParams.get("photo");
  
    if (photoParam) {
      const found = this.photos.find(p => p.id == photoParam);
      if (found) {
        this.currentIndex = this.photos.indexOf(found) + 1;
      } else {
        this.currentIndex = Number(photoParam) || 1;
      }
    }
  
    this.loadPhoto();
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

  loadPhoto() { // Display the current artwork based on currentIndex
    if (!this.photos || this.photos.length === 0) return;

    const idx = this.currentIndex - 1;  // Convert 1-based index to 0-based array index
    const art = this.photos[idx];
    if (!art) return;

    this.photo = { // Set current photo data
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
    this.changeSettings("photo", this.photo.id || this.currentIndex);

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
    const currentReaction = reactions[photo.image]; // Get reaction from browser storage

    if (currentReaction === "dislike") {
      // If already disliked, unpress 
      delete reactions[photo.image];
    } else {
      // Set to dislike and remove like if it was set
      reactions[photo.image] = "dislike";
    }

    
    localStorage.setItem("reactions", JSON.stringify(reactions));
    this.requestUpdate(); // Save updated reactions and refresh display
  }
  
  getUserReaction(image) { // Check if user liked or disliked this image
    const reactions = JSON.parse(localStorage.getItem("reactions") || "{}");
    return reactions[image] || null; // Returns "like", "dislike", or nothing
  } 


  sharePhoto(photo) {
    const currentPhotoId = photo.id || this.currentIndex;
    this.changeSettings("photo", currentPhotoId);
  
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.href);
  
    alert("Link copied to clipboard!");
  }

  nextArtwork() {
    if (this.currentIndex < this.totalPhotos) {
      this.currentIndex++; // Go to next artwork only if not at max
      this.loadPhoto();
    }
  }

  prevArtwork() {
    if (this.currentIndex > 1) {
      this.currentIndex--; // Go to prev artwork only if not first artwork
      this.loadPhoto();
    }
  }
  changeSettings(key, value) {
    const url = new URL(window.location);
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", url);
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
        color: light-dark(var(--ddd-theme-default-charcoal), var(--ddd-theme-default-white));
        font-family: var(--ddd-font-navigation);
        padding: var(--ddd-spacing-4);
      }
  
      .photo-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: min(90vw, 600px);
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-midnight));
        border-radius: var(--ddd-radius-md);
        box-shadow: var(--ddd-boxShadow-md);
        overflow: hidden;
        transition: box-shadow 0.3s ease, transform 0.3s ease;
      }
  
      .photo-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--ddd-boxShadow-lg);
      }
  
      h3 {
        margin: var(--ddd-spacing-2) 0 0 0;
        font-size: var(--ddd-font-size-l);
        color: var(--ddd-theme-default-ink);
        text-align: center;
      }
  
      p {
        margin: var(--ddd-spacing-1) 0;
        color: var(--ddd-theme-default-carbon);
        text-align: center;
        font-size: var(--ddd-font-size-s);
      }
  
      img {
        width: 100%;
        height: auto;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-bottom: 1px solid var(--ddd-theme-default-pebble);
        transition: transform 0.3s ease, filter 0.3s ease;
      }
  
      img:hover {
        transform: scale(1.02);
        filter: brightness(1.05);
      }
  
      .actions {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: var(--ddd-spacing-2);
        width: 100%;
        border-top: 1px solid var(--ddd-theme-default-pebble);
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-graphite));
      }
  
      .actions button {
        background: none;
        border: none;
        font-size: var(--ddd-font-size-xl);
        cursor: pointer;
        padding: var(--ddd-spacing-1);
        color: var(--ddd-theme-default-carbon);
        transition: transform 0.2s ease, color 0.3s ease;
      }
  
      .actions button:hover {
        transform: scale(1.15);
        color: var(--ddd-theme-default-keystoneYellow);
      }
  
      .actions button.liked {
        color: var(--ddd-theme-default-forestGreen);
        text-shadow: 0 0 6px var(--ddd-theme-default-creekTeal);
      }
  
      .actions button.disliked {
        color: var(--ddd-theme-default-original87Pink);
        text-shadow: 0 0 6px var(--ddd-theme-default-discoveryCoral);
      }
  
      .actions button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
  
      .details {
        padding: var(--ddd-spacing-3);
        font-size: var(--ddd-font-size-s);
        line-height: 1.6;
        color: light-dark(var(--ddd-theme-default-carbon), var(--ddd-theme-default-white));
        background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-graphite));
        width: 100%;
        box-sizing: border-box;
        text-align: left;
      }
  
      @media (max-width: 600px) {
        .photo-card {
          width: 95vw;
          border-radius: var(--ddd-radius-sm);
        }
  
        h3 {
          font-size: var(--ddd-font-size-m);
        }
  
        .actions button {
          font-size: var(--ddd-font-size-l);
        }
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
        <div class="title">
        <h3>${this.photo.title} (${this.photo.year})</h3>
        </div>
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