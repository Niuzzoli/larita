import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Polaroid } from "./Polaroid";

const photo = { src: "/images/memories/foto-01.jpg", alt: "Una foto", width: 960, height: 1280 };

describe("Polaroid", () => {
  it("muestra la foto y el epígrafe", () => {
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" />);
    expect(screen.getByAltText("Una foto")).toBeInTheDocument();
    expect(screen.getByText("Super mirada")).toBeInTheDocument();
  });

  it("si la foto no carga, muestra un marcador con la ruta y conserva el epígrafe", () => {
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" />);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(screen.getByText("public/images/memories/foto-01.jpg")).toBeInTheDocument();
    expect(screen.getByText("Super mirada")).toBeInTheDocument();
  });

  it("con onMissing='hide', si la foto no carga no dibuja nada", () => {
    const { container } = render(<Polaroid photo={photo} sizes="100vw" onMissing="hide" />);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(container).toBeEmptyDOMElement();
  });

  it("con onOpen expone un botón que lo llama, y sin foto cargada no hay botón", () => {
    const onOpen = vi.fn();
    render(<Polaroid photo={photo} caption="Super mirada" sizes="100vw" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Ampliar foto: Super mirada" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    fireEvent.error(screen.getByAltText("Una foto"));
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
