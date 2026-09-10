// A picture the user has just chosen but not yet uploaded is an in-memory
// `blob:` URL. `next/image` optimizes by having the server fetch the source,
// which it cannot do for a URL that only exists in this browser tab — those
// have to be handed to the browser untouched.
export const isLocalPreview = (src) => Boolean(src?.startsWith("blob:"));
