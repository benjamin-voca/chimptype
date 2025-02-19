function diffTuple(s: string, t: string): [string, string] {
    // If t starts with s, then s is “kept” and the extra part of t is the diff.
    if (t.startsWith(s)) {
        return [s, t.substring(s.length)];
    }
    // Otherwise, find the common prefix.
    let commonPrefix = "";
    for (let i = 0; i < Math.min(s.length, t.length); i++) {
        if (s[i] === t[i]) {
            commonPrefix += s[i];
        } else {
            break;
        }
    }
    return [commonPrefix, s.substring(commonPrefix.length)];
};

console.log(diffTuple("ben" + " ", "ben"))
