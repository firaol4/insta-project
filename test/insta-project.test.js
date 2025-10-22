import { html, fixture, expect } from '@open-wc/testing';
import "../insta-project.js";

describe("InstaProject test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <insta-project
        title="title"
      ></insta-project>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
