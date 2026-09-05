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

/*
 * Dev server for the component harness pages in src/dev-harness.
 *
 * The main dev server cannot serve them: it answers every URL that ends in
 * .html with the OGS index template. This config serves the harness directory
 * as an ordinary Vite root, with the CSS pipeline and the path aliases of the
 * main config, so the pages get the same styles as the app. It needs no
 * backend, which is what lets the harness tests run anywhere.
 *
 *   yarn harness              - serve the pages for a look in a browser
 *   yarn test:harness         - run the tests in e2e-tests/harness
 */

import { UserConfig, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
/* The extension is left off because tsc rejects a .ts import path unless
 * allowImportingTsExtensions is on. Vite warns about this, and resolves it. */
import main_config from "./vite.config";

const { css, resolve } = main_config as UserConfig;

export default defineConfig({
    root: path.resolve(import.meta.dirname, "src/dev-harness"),
    base: "./",
    css,
    resolve,
    plugins: [react()],
    server: {
        port: process.env.HARNESS_PORT ? parseInt(process.env.HARNESS_PORT) : 8081,
        strictPort: true,
    },
});
