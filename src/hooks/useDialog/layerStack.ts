/**
 * Stack of open overlays (Modal, Drawer, BottomSheet), in the order they
 * opened. Every overlay listens for keys on the document, so only the
 * top-most one may react — otherwise a single Escape would close a modal
 * and the drawer underneath it at once.
 */
const layers: symbol[] = [];

/** Registers an overlay as the new top layer; returns its release function. */
export function pushLayer(layer: symbol): () => void {
  layers.push(layer);
  return () => {
    const index = layers.lastIndexOf(layer);
    if (index !== -1) layers.splice(index, 1);
  };
}

export function isTopLayer(layer: symbol): boolean {
  return layers[layers.length - 1] === layer;
}
