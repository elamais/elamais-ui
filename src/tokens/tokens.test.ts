import { tokens } from "./tokens";

/** Relative luminance, per WCAG 2.1. */
function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const int = parseInt(hex.replace("#", ""), 16);
  return (
    0.2126 * channel((int >> 16) & 255) +
    0.7152 * channel((int >> 8) & 255) +
    0.0722 * channel(int & 255)
  );
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("brand colours", () => {
  it("matches the official brand manual", () => {
    // Manual da Marca ELA+ (GNA Publicidade), page 08.1 — RGB:
    // ameixa R66 G16 B43, champagne R218 G166 B122.
    //
    // These were wrong for months because the reference image in
    // design-reference did not match the manual. The numbers live here now so
    // the drift cannot happen quietly again.
    expect(tokens.color.brand.plum.base).toBe("#42102B");
    expect(tokens.color.brand.champagne.base).toBe("#DAA67A");
    expect(tokens.color.surface.brand).toBe("#42102B");
    expect(tokens.color.border.gold).toBe("#DAA67A");
  });
});

describe("colour contrast", () => {
  const goldText = tokens.color.text.gold;

  it("keeps gold text readable on every light surface it lands on", () => {
    // Champagne is decorative; this is the tone text is allowed to use.
    for (const surface of [
      tokens.color.surface.card,
      tokens.color.surface.page,
      tokens.color.surface.gold,
    ]) {
      expect(contrast(goldText, surface)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("never lets the decorative champagne pass as text on light", () => {
    expect(
      contrast(tokens.color.brand.champagne.base, tokens.color.surface.card),
    ).toBeLessThan(4.5);
  });

  it("keeps champagne and off-white readable on the brand surface", () => {
    for (const ink of [
      tokens.color.brand.champagne.base,
      tokens.color.text.onBrand,
    ]) {
      expect(
        contrast(ink, tokens.color.surface.brand),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps the champagne icon tone visible on white", () => {
    // Graphic element, so the bar is 3:1 rather than 4.5:1.
    expect(
      contrast(tokens.color.brand.champagne.icon, tokens.color.surface.card),
    ).toBeGreaterThanOrEqual(3);
  });
});
