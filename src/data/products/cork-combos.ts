import type { Product } from "../types";
import { productPhoto } from "../media";

/** Festive Cork Gifting Catalogue 2026 — codes and contents follow the PDF. */
const combo = (
  n: number,
  items: number,
  contents: string[],
  extra: Partial<Product> = {},
): Product => ({
  slug: `cork-combo-${n}`,
  name: `Cork Gift Combo ${n}`,
  code: `AG-CK-00${n}`,
  description: `A ready-to-gift cork combo of ${items} items, for corporate and festive gifting.`,
  collection: "corporate-gifts",
  type: "Gift Sets",
  occasions: ["pooja-festive", "corporate"],
  setInfo: `${items} items`,
  contents,
  material: "Cork",
  minQuantity: 25,
  sortOrder: n,
  image: productPhoto(`cork-combo-${n}`),
  ...extra,
});

export const corkComboProducts: Product[] = [
  combo(
    1,
    6,
    [
      "Cork signature desk organizer",
      "Cork wavy photo frame",
      "Cork clock square",
      "2 cork tea light holders",
      "Premium cork box",
    ],
    { featured: true },
  ),
  combo(2, 5, [
    "Cork passport holder",
    "Cork calendar",
    "Borosil glass bottle with cork veneer",
    "Glass tea light holder",
    "Premium cork box",
  ]),
  combo(
    3,
    8,
    [
      "Cork tray",
      "2 borosilicate jars with cork lids",
      "4 cork belly coasters",
      "Cork belly tea light holder",
    ],
    { featured: true },
  ),
  combo(4, 8, [
    "2 borosilicate jars with cork lids",
    "4 cork printed coasters",
    "Cork belly planter",
    "Premium cork box",
  ]),
  combo(
    5,
    11,
    [
      "Cork tic tac toe game",
      "Set of 4 round coasters with case",
      "Heart keychain",
      "Cork cylindrical tea light holder",
      "Cork belly planter",
      "Cork neo photo frame",
      "Premium cork fabric box",
    ],
    { featured: true },
  ),
  combo(6, 7, [
    "Cork rectangular tray (16 x 8 inches)",
    "4 cork coasters with veneer",
    "Cork bark planter",
    "4-in-one cork tea light holder",
  ]),
  combo(7, 8, [
    "Cork square tray",
    "Cork desktop organizer",
    "4 cork premium coasters (8 mm)",
    "Cork bark planter",
    "3 cork tea light holders",
  ]),
  combo(8, 7, [
    "Premium cork box",
    "Borosilicate bottle with cork sleeve",
    "Cork magnetic planter",
    "2 tea light holders",
    "Cork dry fruit jar tray",
    "Cork tissue holder",
  ]),
];
