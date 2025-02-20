function capitalizeSentences(text) {
    return text.replace(/(?:^|[\.\!\?]\s+)([a-z])|(?<=\s|^)i(?=\s|$)/g, (match, firstLetter) => {

        // If "i" is alone, capitalize it
        if (match === "i") return "I";

        return match.replace(firstLetter, firstLetter.toUpperCase());
    });
}

module.exports = capitalizeSentences;


