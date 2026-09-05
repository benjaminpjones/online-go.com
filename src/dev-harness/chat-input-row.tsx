/*
 * Copyright (C)  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Entry point for the chat input row harness page. Dev server only: the
 * production build has a single entry, src/main.tsx. */

import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChatInputRow } from "./ChatInputRow";
import "@/ogs.css";
import "./chat-input-row.css";

const container = document.getElementById("harness-root");
if (!container) {
    throw new Error("Harness root element is missing");
}
createRoot(container).render(<ChatInputRow />);
