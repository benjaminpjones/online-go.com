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

// (No seeded data in use)

/*
 * Test that the game chat input row stays coherent when the message being
 * composed wraps onto several lines.
 *
 * The chat textarea grows as the user adds lines (TabCompleteInput's
 * adjustHeight, up to 150px). The buttons flanking it used to be a fixed
 * 30px pinned to the bottom of the row (GameChat.css: align-items: flex-end
 * plus button { height: 30px }), which left an empty gap above each of them
 * once the textarea was taller than one line. They now stretch, which also
 * needs height: auto to beat the global button height of 2em - a definite
 * cross size stops a flex item stretching.
 *
 * This test verifies that:
 * 1. With a single-line message every control in the input row is the same
 *    height as the textarea.
 * 2. After composing a three-line message the textarea has grown, and the
 *    controls have grown with it - same top edge, same height.
 *
 * A demo board is used as a cheap host for the GameChat component: it needs
 * only one user and no opponent. On a demo board the row renders the chat
 * user-count button (the chat-log toggle needs the viewer to be a player in
 * a real game), which is enough to catch the regression - the CSS rule under
 * test applies to every button in the row.
 */

import type { CreateContextOptions } from "@helpers";

import { BrowserContext, Locator, expect } from "@playwright/test";
import { newTestUsername, prepareNewUser } from "@helpers/user-utils";
import { createDemoBoard } from "@helpers/demo-board-utils";
import { log } from "@helpers/logger";

// Sub-pixel differences are expected from borders and fractional line
// heights; anything more than this means a control is not tracking the row.
const ALIGNMENT_TOLERANCE_PX = 1.5;

const boxOf = async (locator: Locator, description: string) => {
    const box = await locator.boundingBox();
    if (!box) {
        throw new Error(`Could not measure ${description}`);
    }
    return box;
};

export const gameChatMultilineInputTest = async ({
    createContext,
}: {
    createContext: (options?: CreateContextOptions) => Promise<BrowserContext>;
}) => {
    log("=== Game Chat Multiline Input Test ===");

    const { userPage: page, userContext } = await prepareNewUser(
        createContext,
        newTestUsername("ChatMultiline"), // cspell:disable-line
        "test",
    );

    // 1. A demo board gives us a Game view (and therefore a GameChat) without
    //    needing a second player.
    await createDemoBoard(page, {});
    log("Demo board created");

    // Located by CSS rather than expectOGSClickable* because this is a
    // geometry check over every control in the row, whatever it renders,
    // and nothing here is clicked by name.
    const input_row = page.locator(".GameChat .chat-input-container");
    const textarea = input_row.locator("textarea");
    const controls = input_row.locator("button, .qc-toggle");

    await expect(input_row).toBeVisible();
    await expect(textarea).toBeEnabled();
    const control_count = await controls.count();
    expect(control_count).toBeGreaterThan(0);
    log(`Chat input row visible with ${control_count} control(s)`);

    // 2. Baseline: one line of text, everything the same height.
    await textarea.click();
    await textarea.pressSequentially("line one");
    await expect(textarea).toHaveValue("line one");

    const single_line_box = await boxOf(textarea, "single-line textarea");
    for (let i = 0; i < control_count; ++i) {
        const control_box = await boxOf(controls.nth(i), `control ${i} (single line)`);
        expect(Math.abs(control_box.height - single_line_box.height)).toBeLessThanOrEqual(
            ALIGNMENT_TOLERANCE_PX,
        );
    }
    log(`Single-line row height: ${single_line_box.height}px`);

    // 3. Compose two more lines. Shift+Enter inserts a newline; plain Enter
    //    would send the message (GameChat.onKeyPress).
    await textarea.press("Shift+Enter");
    await textarea.pressSequentially("line two");
    await textarea.press("Shift+Enter");
    await textarea.pressSequentially("line three");
    await expect(textarea).toHaveValue("line one\nline two\nline three");
    log("Three-line message composed");

    // 4. The textarea must actually have grown, otherwise the assertions
    //    below would pass without exercising anything.
    const multi_line_box = await boxOf(textarea, "multi-line textarea");
    expect(multi_line_box.height).toBeGreaterThan(single_line_box.height);
    log(`Three-line row height: ${multi_line_box.height}px`);

    // 5. Every control grew with it: same top edge, same height. Before the
    //    fix the controls stayed 30px tall and sat at the bottom of the row.
    for (let i = 0; i < control_count; ++i) {
        const control_box = await boxOf(controls.nth(i), `control ${i} (multi line)`);
        expect(Math.abs(control_box.height - multi_line_box.height)).toBeLessThanOrEqual(
            ALIGNMENT_TOLERANCE_PX,
        );
        expect(Math.abs(control_box.y - multi_line_box.y)).toBeLessThanOrEqual(
            ALIGNMENT_TOLERANCE_PX,
        );
    }

    await page.close();
    await userContext.close();

    log("=== Game Chat Multiline Input Test Complete ===");
    log("Chat input controls track the height of a multi-line composer");
};
