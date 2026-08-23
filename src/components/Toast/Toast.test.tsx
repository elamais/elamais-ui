import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { Toast } from "./Toast";
import { ToastProvider, useToast } from "./ToastProvider";

function Trigger({
  message,
  variant,
}: {
  message: string;
  variant?: "brand" | "success" | "error" | "info";
}) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast.show(message, { variant })}>
      disparar
    </button>
  );
}

describe("Toast", () => {
  it("renders as status by default and alert for errors", () => {
    const { rerender } = render(<Toast message="Resgate confirmado." />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Resgate confirmado.",
    );

    rerender(<Toast message="Não conseguimos validar." variant="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não conseguimos validar.",
    );
  });

  it("applies the variant class", () => {
    render(<Toast message="Saldo libera em 12/09." variant="info" />);
    expect(screen.getByRole("status")).toHaveClass("ela-toast--info");
  });
});

describe("ToastProvider / useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a toast and auto-dismisses it after 4s", () => {
    render(
      <ToastProvider>
        <Trigger message="Benefício salvo nos seus favoritos." />
      </ToastProvider>,
    );

    act(() => {
      screen.getByRole("button", { name: "disparar" }).click();
    });
    expect(
      screen.getByText("Benefício salvo nos seus favoritos."),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(
      screen.getByText("Benefício salvo nos seus favoritos."),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(
      screen.queryByText("Benefício salvo nos seus favoritos."),
    ).not.toBeInTheDocument();
  });

  it("stacks multiple toasts and dismisses each on its own clock", () => {
    render(
      <ToastProvider>
        <Trigger message="Primeiro aviso." />
      </ToastProvider>,
    );
    const trigger = screen.getByRole("button", { name: "disparar" });

    act(() => {
      trigger.click();
    });
    act(() => {
      vi.advanceTimersByTime(2000);
      trigger.click();
    });
    expect(screen.getAllByText("Primeiro aviso.")).toHaveLength(2);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getAllByText("Primeiro aviso.")).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.queryByText("Primeiro aviso.")).not.toBeInTheDocument();
  });

  it("useToast throws outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<Trigger message="fora do provider" />),
    ).toThrowError(/ToastProvider/);
    spy.mockRestore();
  });
});
