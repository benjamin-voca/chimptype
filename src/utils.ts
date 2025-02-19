export const diffTuple = (s: string, t: string): [string, string] => {
    // If t starts with s, then s is “kept” and the extra part of t is the diff.
    if (t.startsWith(s)) {
        return [s, t.substring(s.length)];
    }
    // If s starts with t, then t is kept and nothing is appended.
    if (s.startsWith(t)) {
        return [t, ""];
    }
    // Otherwise, we compare a “target” substring.
    // When t is shorter than s, we use s.substring(0, t.length); otherwise use all of s.
    const sTarget = s.length > t.length ? s.substring(0, t.length) : s;

    let commonPrefix = "";
    for (let i = 0; i < Math.min(sTarget.length, t.length); i++) {
        if (sTarget[i] === t[i]) {
            commonPrefix += sTarget[i];
        } else {
            break;
        }
    }
    // The diff tuple is [commonPrefix, the rest of sTarget]
    return [commonPrefix, sTarget.substring(commonPrefix.length)];
};

// console.log(diffTuple("ben" + " ", "ben"))
export const getLists = async () => (await fetch("./static/_groups.json"))
export const getWords = async (list: string) => { await fetch(`./static/${list}.json`) }

