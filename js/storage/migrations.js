export const Migrations = [
    player => {
        const seenBFS = player.breadth.seen;
        const seenBFS2 = player.breadth.otherSeen;
        const seenDFS = player.depth.seen;
        const deadDFS = player.depth.dead;
        const s2 = player.map.currentSize * player.map.currentSize;
        player.breadth.seen = Array(s2).fill(false).map(x => seenBFS.includes(x));
        player.breadth.otherSeen = Array(s2).fill(false).map(x => seenBFS2.includes(x));
        player.depth.seen = Array(s2).fill(false).map(x => seenDFS.includes(x));
        player.depth.dead = Array(s2).fill(false).map(x => deadDFS.includes(x));
    }
];