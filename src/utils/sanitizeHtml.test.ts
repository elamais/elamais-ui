import { describe, expect, it } from "vitest";
import { isSafeLinkUrl, plainTextToHtml, sanitizeHtml } from "./sanitizeHtml";

const LINK = 'target="_blank" rel="noopener noreferrer"';

describe("sanitizeHtml — allowlist", () => {
  it("keeps every allowed tag", () => {
    const html =
      "<h2>Termos</h2><h3>1. Uso</h3><p>Texto <strong>forte</strong>, <em>ênfase</em> e <u>sublinhado</u>.<br>Linha</p>" +
      "<ul><li>um</li></ul><ol><li>dois</li></ol><blockquote><p>citação</p></blockquote>";
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("renames b/i to strong/em and off-scale headings to h2/h3", () => {
    expect(sanitizeHtml("<p><b>a</b><i>b</i></p>")).toBe("<p><strong>a</strong><em>b</em></p>");
    expect(sanitizeHtml("<h1>A</h1><h4>B</h4><h6>C</h6>")).toBe("<h2>A</h2><h3>B</h3><h3>C</h3>");
  });

  it("returns an empty string for empty input", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("is idempotent", () => {
    const once = sanitizeHtml('<div>a<b>b</b></div><a href="https://x.com">x</a> solto');
    expect(sanitizeHtml(once)).toBe(once);
  });

  it("wraps loose top-level text in paragraphs and drops whitespace between blocks", () => {
    expect(sanitizeHtml("solto<p>p</p>  \n <br>")).toBe("<p>solto</p><p>p</p>");
  });

  it("turns generic containers into paragraphs and unwraps them around blocks", () => {
    expect(sanitizeHtml("<div>um</div><div>dois</div>")).toBe("<p>um</p><p>dois</p>");
    expect(sanitizeHtml("<section><div>a</div><p>b</p></section>")).toBe("<p>a</p><p>b</p>");
  });

  it("unwraps unknown inline tags but keeps their text", () => {
    expect(sanitizeHtml('<p><span style="color:red">a</span><font>b</font><code>c</code></p>')).toBe(
      "<p>abc</p>",
    );
  });

  it("does not nest blocks inside inline or text blocks", () => {
    expect(sanitizeHtml("<p><strong><h2>x</h2></strong></p>")).not.toMatch(/<strong><h2>/);
    expect(sanitizeHtml("<h2><ul><li>a</li></ul></h2>")).toBe("<h2>a</h2>");
  });

  it("drops empty wrappers but keeps intentional blank lines", () => {
    expect(sanitizeHtml("<p></p><ul><li>a</li><li></li></ul><p></p><h2></h2><p><strong></strong>b</p>")).toBe(
      "<ul><li>a</li></ul><p>b</p>",
    );
    expect(sanitizeHtml("<p>a</p><p><br></p><p>b</p>")).toBe("<p>a</p><p><br></p><p>b</p>");
    expect(sanitizeHtml('<p><a href="https://x.com"></a>c</p>')).toBe("<p>c</p>");
  });

  it("turns list items outside a list into paragraphs", () => {
    expect(sanitizeHtml("<li>solto</li>")).toBe("<p>solto</p>");
  });
});

describe("sanitizeHtml — XSS vectors", () => {
  it("drops <script> with its content", () => {
    expect(sanitizeHtml("<p>oi</p><script>alert(1)</script>")).toBe("<p>oi</p>");
    expect(sanitizeHtml("<p>a<script>alert(1)</script>b</p>")).toBe("<p>ab</p>");
  });

  it("drops <style>, <iframe>, <object>, <embed>, <svg>, <math> and <template> with content", () => {
    const html =
      "<style>p{}</style><iframe src=x>t</iframe><object data=x>o</object><embed src=x>" +
      "<svg><script>alert(1)</script></svg><math><mi>x</mi></math><template><p>t</p></template><p>ok</p>";
    expect(sanitizeHtml(html)).toBe("<p>ok</p>");
  });

  it("strips event handlers and drops media carrying them", () => {
    expect(sanitizeHtml('<img src=x onerror="alert(1)">')).toBe("");
    expect(sanitizeHtml('<p onclick="alert(1)" onmouseover="x()">t</p>')).toBe("<p>t</p>");
    expect(sanitizeHtml('<strong onfocus="x()" tabindex="0">t</strong>')).toBe("<p><strong>t</strong></p>");
  });

  it("strips style, class, id and data attributes", () => {
    expect(
      sanitizeHtml('<p style="background:url(javascript:alert(1))" class="c" id="i" data-x="1">t</p>'),
    ).toBe("<p>t</p>");
  });

  it("removes javascript:, data: and vbscript: links but keeps their text", () => {
    expect(sanitizeHtml('<p><a href="javascript:alert(1)">x</a></p>')).toBe("<p>x</p>");
    expect(sanitizeHtml('<p><a href="JaVaScRiPt:alert(1)">x</a></p>')).toBe("<p>x</p>");
    expect(sanitizeHtml('<p><a href=" java\tscript:alert(1)">x</a></p>')).toBe("<p>x</p>");
    expect(sanitizeHtml('<p><a href="jav&#x09;ascript:alert(1)">x</a></p>')).toBe("<p>x</p>");
    expect(sanitizeHtml('<p><a href="data:text/html,<script>alert(1)</script>">x</a></p>')).toBe("<p>x</p>");
    expect(sanitizeHtml('<p><a href="vbscript:msgbox(1)">x</a></p>')).toBe("<p>x</p>");
  });

  it("drops relative, anchor-only and hrefless links", () => {
    expect(sanitizeHtml('<p><a href="/x">a</a><a href="#top">b</a><a>c</a></p>')).toBe("<p>abc</p>");
  });

  it("keeps safe links, forcing target and rel and removing other attributes", () => {
    expect(
      sanitizeHtml('<p><a href="https://elamais.com" onclick="x()" target="_self" rel="opener" title="t">ELA+</a></p>'),
    ).toBe(`<p><a href="https://elamais.com" ${LINK}>ELA+</a></p>`);
    expect(sanitizeHtml('<p><a href="mailto:oi@elamais.com">mail</a></p>')).toBe(
      `<p><a href="mailto:oi@elamais.com" ${LINK}>mail</a></p>`,
    );
  });

  it("escapes attribute-breaking quotes in hrefs", () => {
    const out = sanitizeHtml('<p><a href="https://x.com/&quot;onmouseover=&quot;alert(1)">x</a></p>');
    expect(out).not.toMatch(/\sonmouseover=/);
  });

  it("does not nest links", () => {
    expect(sanitizeHtml('<p><a href="https://a.com"><a href="https://b.com">x</a></a></p>')).not.toMatch(
      /<a[^>]*><a/,
    );
  });

  it("cleans nested disallowed tags at any depth", () => {
    const html =
      '<div><span><font color="red"><script>alert(1)</script><b onclick="x()">oi<img src=x onerror=alert(1)></b></font></span></div>';
    expect(sanitizeHtml(html)).toBe("<p><strong>oi</strong></p>");
  });

  it("removes comments and conditional comments", () => {
    expect(sanitizeHtml("<p>a<!-- <script>alert(1)</script> -->b</p><!--[if IE]><p>x</p><![endif]-->")).toBe(
      "<p>ab</p>",
    );
  });

  it("keeps markup-looking text escaped", () => {
    expect(sanitizeHtml("<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>")).toBe(
      "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
    );
  });

  it("drops forms and their controls", () => {
    expect(sanitizeHtml('<form action="https://evil"><input value="x"><button>go</button></form><p>ok</p>')).toBe(
      "<p>ok</p>",
    );
  });
});

describe("isSafeLinkUrl", () => {
  it("accepts http, https and mailto only", () => {
    expect(isSafeLinkUrl("https://elamais.com")).toBe(true);
    expect(isSafeLinkUrl("http://elamais.com")).toBe(true);
    expect(isSafeLinkUrl("MAILTO:oi@elamais.com")).toBe(true);
    expect(isSafeLinkUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeLinkUrl("ftp://x")).toBe(false);
    expect(isSafeLinkUrl("elamais.com")).toBe(false);
    expect(isSafeLinkUrl("https:")).toBe(false);
  });
});

describe("plainTextToHtml", () => {
  it("keeps line breaks and splits paragraphs on blank lines", () => {
    expect(plainTextToHtml("linha 1\nlinha 2\n\nparágrafo 2\r\n")).toBe(
      "<p>linha 1<br>linha 2</p><p>parágrafo 2</p>",
    );
  });

  it("escapes markup", () => {
    expect(plainTextToHtml("<script>alert(1)</script>")).toBe("<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
  });
});
