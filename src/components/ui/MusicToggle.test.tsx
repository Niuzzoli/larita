import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MusicToggle } from "./MusicToggle";

const music = { src: "/audio/cancion.mp3", title: "Nuestra canción" };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MusicToggle", () => {
  it("no dibuja nada si no hay música configurada", () => {
    const { container } = render(<MusicToggle />);
    expect(container).toBeEmptyDOMElement();
  });

  it("empieza pausado y no reproduce solo", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    render(<MusicToggle music={music} />);
    expect(screen.getByRole("button", { name: "Reproducir música" })).toHaveAttribute("aria-pressed", "false");
    expect(play).not.toHaveBeenCalled();
  });

  it("reproduce y pausa", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    render(<MusicToggle music={music} />);

    fireEvent.click(screen.getByRole("button", { name: "Reproducir música" }));
    const pauseButton = await screen.findByRole("button", { name: "Pausar música" });
    expect(pauseButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(pauseButton);
    expect(pause).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Reproducir música" })).toBeInTheDocument();
  });

  it("si play() falla, queda pausado y avisa", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("NotAllowedError"));
    render(<MusicToggle music={music} />);

    fireEvent.click(screen.getByRole("button", { name: "Reproducir música" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("No se pudo reproducir la música"));
    expect(screen.getByRole("button", { name: "Reproducir música" })).toHaveAttribute("aria-pressed", "false");
  });

  it("si el archivo de audio da error, queda pausado y avisa", () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const { container } = render(<MusicToggle music={music} />);
    fireEvent.error(container.querySelector("audio")!);
    expect(screen.getByRole("status")).toHaveTextContent("No se pudo reproducir la música");
  });
});
