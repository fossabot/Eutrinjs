async function copyDir(src, target, excludeDirs=[]) {
    try {
        await Neutralino.filesystem.getStats(src);
    } catch {
        return;
    }
    try {
        await Neutralino.filesystem.getStats(target);
    } catch {
        await Neutralino.filesystem.createDirectory(target);
    }
    let entries = await Neutralino.filesystem.readDirectory(src);
    for (var i = 0; i < entries.length; i++) {
        let data = entries[i];
        if (!(/\.+/.test(data.entry))) {
            if (data.type === "DIRECTORY" && !excludeDirs.includes(data.entry)) {
                await copyDir(
                    src.replace(/\/$/, "") + "/" + data.entry,
                    target.replace(/\/$/, "") + "/" + data.entry
                );
            } else {
                await Neutralino.filesystem.copyFile(
                    src.replace(/\/$/, "") + "/" + data.entry,
                    target.replace(/\/$/, "") + "/" + data.entry
                );
            }
        }
    }
}
