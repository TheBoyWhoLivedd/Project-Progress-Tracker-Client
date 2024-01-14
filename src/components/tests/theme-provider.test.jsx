/* eslint-disable no-undef */
import React from "react";
import { render, cleanup ,renderHook} from "@testing-library/react";
import { ThemeProvider, useTheme, useResolvedTheme } from "../theme-provider";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock matchMedia
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), 
      removeListener: jest.fn(),
    };
  });
});

describe("ThemeProvider Component", () => {
  afterEach(cleanup);

  it("should apply the dark theme", () => {
    window.localStorage.setItem("vite-ui-theme", "dark");
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBeTruthy();
  });
});

describe("useTheme Hook", () => {
  it("should return the current theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe("dark");
  });
});

describe("useResolvedTheme Hook", () => {
  it("should resolve the correct theme", () => {
    const { result } = renderHook(() => useResolvedTheme(), {
      wrapper: ThemeProvider,
    });
    expect(result.current).toBe("dark");
  });
});
