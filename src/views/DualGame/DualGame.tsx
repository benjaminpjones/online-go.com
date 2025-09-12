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

import * as React from "react";
import { useParams } from "react-router-dom";
import { GobanController } from "@/lib/GobanController";

interface SimpleGobanProps {
    gameId: number;
    title: string;
}

function SimpleGoban({ gameId, title }: SimpleGobanProps): React.ReactElement | null {
    const gobanRef = React.useRef<HTMLDivElement>(null);
    const controllerRef = React.useRef<GobanController | null>(null);

    React.useEffect(() => {
        if (gameId > 0 && gobanRef.current) {
            // Create a new GobanController for this game
            const opts = {
                board_div: gobanRef.current,
                interactive: true,
                connect_to_chat: false,
                game_id: gameId,
                draw_top_labels: true,
                draw_left_labels: true,
                draw_right_labels: true,
                draw_bottom_labels: true,
            };

            const controller = new GobanController(opts);
            controllerRef.current = controller;

            // Clean up when component unmounts
            return () => {
                if (controllerRef.current) {
                    controllerRef.current.destroy();
                }
            };
        }
        return undefined;
    }, [gameId]);

    if (gameId <= 0) {
        return (
            <div className="simple-goban-error">
                <p>Invalid game ID: {gameId}</p>
            </div>
        );
    }

    return (
        <div className="simple-goban">
            <div className="simple-goban-title">{title}</div>
            <div ref={gobanRef} className="simple-goban-container"></div>
        </div>
    );
}

export function DualGame(): React.ReactElement | null {
    const params = useParams<"game_id_1" | "game_id_2">();

    const game_id_1 = params.game_id_1 ? parseInt(params.game_id_1) : 0;
    const game_id_2 = params.game_id_2 ? parseInt(params.game_id_2) : 0;

    if (game_id_1 <= 0 || game_id_2 <= 0) {
        return (
            <div className="DualGame error">
                <h1>Dual Game View</h1>
                <p>Error: Both games must be specified in the URL.</p>
                <p>Example: /dual-game/123/456 for games 123 and 456</p>
            </div>
        );
    }

    return (
        <div className="DualGame">
            <div className="dual-game-header">
                <h1>Dual Game View</h1>
                <p>
                    Games {game_id_1} and {game_id_2}
                </p>
            </div>

            <div className="dual-game-container">
                <SimpleGoban gameId={game_id_1} title={`Game ${game_id_1}`} />
                <SimpleGoban gameId={game_id_2} title={`Game ${game_id_2}`} />
            </div>
        </div>
    );
}
