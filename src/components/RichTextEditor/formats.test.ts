import { describe, expect, it } from "vitest";
import { closestInside, NO_FORMATS, readActiveFormats } from "./formats";

function editable(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root;
}

describe("readActiveFormats", () => {
  it("reads b/i/u as bold, italic and underline", () => {
    const root = editable("<p><b><i><u>x</u></i></b></p>");
    const formats = readActiveFormats(root, root.querySelector("u")!.firstChild);
    expect(formats).toMatchObject({ bold: true, italic: true, underline: true, paragraph: true });
  });

  it("reads strong/em, ordered lists and quotes", () => {
    const root = editable("<blockquote><ol><li><strong><em>x</em></strong></li></ol></blockquote>");
    const formats = readActiveFormats(root, root.querySelector("em")!.firstChild);
    expect(formats).toMatchObject({ bold: true, italic: true, ol: true, ul: false, blockquote: true, paragraph: false });
  });

  it("reads the nearest block only, for headings", () => {
    const root = editable("<h3>sub</h3><div><h2>t</h2></div>");
    expect(readActiveFormats(root, root.querySelector("h3")!.firstChild)).toMatchObject({ h3: true, h2: false });
    expect(readActiveFormats(root, root.querySelector("h2"))).toMatchObject({ h2: true, paragraph: false });
  });

  it("reads the innermost link and its href, or none for an hrefless anchor", () => {
    const root = editable('<p><a href="https://a.com">a</a><a>b</a></p>');
    const [withHref, without] = Array.from(root.querySelectorAll("a"));
    expect(readActiveFormats(root, withHref.firstChild)).toMatchObject({ link: true, linkHref: "https://a.com" });
    const bare = readActiveFormats(root, without.firstChild);
    expect(bare.link).toBe(true);
    expect(bare.linkHref).toBeUndefined();
  });

  it("reports nothing for no node, a node outside the editor or the editor itself", () => {
    const root = editable("<p><b>x</b></p>");
    const outside = document.createElement("b");
    expect(readActiveFormats(root, null)).toEqual(NO_FORMATS);
    expect(readActiveFormats(root, outside)).toEqual(NO_FORMATS);
    expect(readActiveFormats(root, root)).toEqual(NO_FORMATS);
  });
});

describe("closestInside", () => {
  it("finds the ancestor with the tag, but never past the editor", () => {
    const root = editable("<blockquote><p>x</p></blockquote>");
    const text = root.querySelector("p")!.firstChild;
    expect(closestInside(root, text, "blockquote")).toBe(root.querySelector("blockquote"));
    expect(closestInside(root, text, "div")).toBeNull();
    expect(closestInside(root, null, "p")).toBeNull();
  });
});
