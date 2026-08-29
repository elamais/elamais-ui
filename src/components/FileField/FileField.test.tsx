import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileField } from "./FileField";

describe("FileField", () => {
  it("delivers the chosen file and derives the input label", () => {
    const onFile = vi.fn();
    render(<FileField label="Ícone" onFile={onFile} hint="PNG até 5 MB" />);
    expect(screen.getByText("PNG até 5 MB")).toBeInTheDocument();
    const input = screen.getByLabelText("Enviar ícone");
    const file = new File(["x"], "icon.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it("switches action text for preview and uploading states", () => {
    const { rerender } = render(<FileField label="Banner" onFile={() => {}} />);
    expect(screen.getByText("Enviar imagem")).toBeInTheDocument();

    rerender(<FileField label="Banner" onFile={() => {}} previewUrl="https://cdn.test/b.png" />);
    expect(screen.getByText("Trocar imagem")).toBeInTheDocument();
    expect(screen.getByAltText("Banner")).toBeInTheDocument();

    rerender(<FileField label="Banner" onFile={() => {}} uploading />);
    expect(screen.getByText("Enviando…")).toBeInTheDocument();
    expect(screen.getByLabelText("Enviar banner")).toBeDisabled();
  });
});
