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
 * Test the game chat input row when the message has more than one line.
 *
 * The textarea gets taller as lines are added (adjustHeight in
 * TabCompleteInput). The controls on each side of it must get taller with it.
 * They used to keep a height of 30px and sit at the bottom of the row, which
 * left an empty gap above each of them.
 *
 * This runs against the harness page in src/dev-harness, so it needs no
 * backend and no user. Run it with `yarn test:harness`.
 */

import { Locator, expect, test } from "@playwright/test";

// Borders and fractional line heights make small differences. More than this
// means a control is not tracking the row.
const ALIGNMENT_TOLERANCE_PX = 1.5;

const boxOf = async (locator: Locator, description: string) => {
    const box = await locator.boundingBox();
    if (!box) {
        throw new Error(`Could not measure ${description}`);
    }
    return box;
};

test.describe("Game chat input row", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/chat-input-row.html");
        await expect(page.locator(".chat-input-container")).toBeVisible();
    });

    test("controls match the height of a multi-line input", async ({ page }) => {
        const row = page.locator(".chat-input-container");
        const textarea = row.locator("textarea");
        const controls = row.locator("button, .qc-toggle");

        const control_count = await controls.count();
        expect(control_count).toBe(3);

        await textarea.click();
        await textarea.pressSequentially("line one");
        await expect(textarea).toHaveValue("line one");

        const single_line = await boxOf(textarea, "single-line textarea");
        for (let i = 0; i < control_count; ++i) {
            const control = await boxOf(controls.nth(i), `control ${i}, single line`);
            expect(Math.abs(control.height - single_line.height)).toBeLessThanOrEqual(
                ALIGNMENT_TOLERANCE_PX,
            );
        }
        await expect(row).toHaveScreenshot("chat-input-row-one-line.png");

        // Shift+Enter adds a line. Enter alone sends the message.
        await textarea.press("Shift+Enter");
        await textarea.pressSequentially("line two");
        await textarea.press("Shift+Enter");
        await textarea.pressSequentially("line three");
        await expect(textarea).toHaveValue("line one\nline two\nline three");

        const three_lines = await boxOf(textarea, "three-line textarea");
        expect(three_lines.height).toBeGreaterThan(single_line.height);

        for (let i = 0; i < control_count; ++i) {
            const control = await boxOf(controls.nth(i), `control ${i}, three lines`);
            expect(Math.abs(control.height - three_lines.height)).toBeLessThanOrEqual(
                ALIGNMENT_TOLERANCE_PX,
            );
            expect(Math.abs(control.y - three_lines.y)).toBeLessThanOrEqual(ALIGNMENT_TOLERANCE_PX);
        }
        await expect(row).toHaveScreenshot("chat-input-row-three-lines.png");
    });
});
