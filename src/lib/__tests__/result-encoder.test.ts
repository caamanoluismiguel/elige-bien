import { describe, it, expect } from "vitest";
import { encodeTest1, encodeTest2, decodeResult } from "@/lib/result-encoder";

describe("result-encoder", () => {
  describe("Test 1 roundtrip", () => {
    it("encodes and decodes a normalized cognitive profile correctly", () => {
      const profile = {
        espacial: 100,
        analitica: 50,
        creativa: 33,
        social: 67,
        practica: 15,
      };

      const encoded = encodeTest1(profile);
      // 100=64, 50=32, 33=21, 67=43, 15=0f
      expect(encoded).toBe("1-643221430f");

      const decoded = decodeResult(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded!.test).toBe(1);
      expect(decoded!.profile).toEqual(profile);
      if (decoded!.test === 1) {
        expect(decoded!.dominantType).toBe("espacial");
      }
    });

    it("identifies correct dominant type when creativa is highest", () => {
      const profile = {
        espacial: 15,
        analitica: 30,
        creativa: 100,
        social: 45,
        practica: 15,
      };

      const encoded = encodeTest1(profile);
      const decoded = decodeResult(encoded);
      expect(decoded).not.toBeNull();
      if (decoded!.test === 1) {
        expect(decoded!.dominantType).toBe("creativa");
      }
    });
  });

  describe("Test 2 roundtrip", () => {
    it("encodes and decodes a normalized architect profile correctly", () => {
      const profile = {
        forma: 60,
        sistemas: 100,
        impacto: 30,
        innovacion: 45,
      };

      const encoded = encodeTest2(profile);
      // 60=3c, 100=64, 30=1e, 45=2d
      expect(encoded).toBe("2-3c641e2d");

      const decoded = decodeResult(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded!.test).toBe(2);
      expect(decoded!.profile).toEqual(profile);
      if (decoded!.test === 2) {
        expect(decoded!.dominantType).toBe("sistemas");
      }
    });
  });

  describe("edge cases", () => {
    it("returns null for empty string", () => {
      expect(decodeResult("")).toBeNull();
    });

    it("returns null for invalid format", () => {
      expect(decodeResult("abc")).toBeNull();
      expect(decodeResult("3-1234567890")).toBeNull();
    });

    it("returns null for wrong score length", () => {
      expect(decodeResult("1-1234")).toBeNull(); // too short for test 1 (needs 10)
      expect(decodeResult("2-123456")).toBeNull(); // too short for test 2 (needs 8)
    });

    it("clamps scores above 100", () => {
      const profile = {
        espacial: 120,
        analitica: 0,
        creativa: 0,
        social: 0,
        practica: 0,
      };
      const encoded = encodeTest1(profile);
      const decoded = decodeResult(encoded);
      if (decoded?.test === 1) {
        expect(decoded.profile.espacial).toBe(100);
      }
    });

    it("handles zero scores", () => {
      const profile = {
        forma: 0,
        sistemas: 0,
        impacto: 0,
        innovacion: 0,
      };
      const encoded = encodeTest2(profile);
      expect(encoded).toBe("2-00000000");
      const decoded = decodeResult(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded!.profile).toEqual(profile);
    });
  });
});
