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

/**
 * Development harness for the game chat input row.
 *
 * The row is copied from the GameChat render, which cannot be mounted on its
 * own because it needs a GobanController, a socket and a signed in user. Keep
 * the markup here in step with the `.chat-input-container` element in
 * `src/views/Game/GameChat.tsx`.
 *
 * Open /dev-harness/chat-input-row.html on the dev server to see the row, and
 * see `e2e-tests/harness/chat-input-row.spec.ts` for the test that measures it.
 */

import * as React from "react";
import { TabCompleteInput } from "@/components/TabCompleteInput";
import "@/views/Game/GameChat.css";

export function ChatInputRow(): React.ReactElement {
    return (
        <div className="GameChat">
            <div className="log-player-container">
                <div className="chat-log-container">
                    <div className="chat-log autoscrolling">
                        <div className="chat-log-spacer" />
                        <div className="chat-log-inner" />
                    </div>
                </div>
            </div>
            <div className="chat-input-container input-group">
                <button className="chat-input-chat-log-toggle sm main">
                    Chat <i className="fa fa-caret-down" />
                </button>
                <TabCompleteInput className="chat-input  main" placeholder="Message ..." />
                <i className="qc-toggle fa fa-caret-up" />
                <button className="chat-input-player-list-toggle sm">
                    <i className="fa fa-users" /> 1
                </button>
            </div>
        </div>
    );
}
