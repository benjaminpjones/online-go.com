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
 * Config for the harness tests, which mount single components on the pages in
 * src/dev-harness. They need no backend and no user, so they start their own
 * server and can run anywhere.
 *
 * Screenshots are compared against golden images that hold for one platform
 * only, because text is drawn differently on each. Playwright puts the
 * platform in the file name, so a golden for each platform can be kept side by
 * side. To make or update the golden for your platform:
 *
 *   yarn test:harness --update-snapshots
 */

import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.HARNESS_PORT || "8081";

export default defineConfig({
    testDir: "./e2e-tests/harness",
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
        toHaveScreenshot: {
            // Text rendering differs a little between machines of one platform.
            maxDiffPixelRatio: 0.01,
        },
    },
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: [["list"]],
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: `yarn harness --port ${PORT}`,
        url: `http://localhost:${PORT}/chat-input-row.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
