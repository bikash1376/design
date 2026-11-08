"use client";

import { createContext, useContext } from "react";

// True only for the selected node. Everything else on the canvas holds still, so a
// demo's clocks, intervals and morphs run for the one component being looked at.
export const DemoActive = createContext(false);
export const useDemoActive = () => useContext(DemoActive);
