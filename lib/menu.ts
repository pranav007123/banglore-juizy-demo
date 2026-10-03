export type VegType = "veg" | "nonveg";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  veg: VegType;
  bestseller?: boolean;
  customizable?: boolean;
}

export const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "Special Malba & Shakes", label: "Special Malba" },
  { key: "Arabic Samoona & Rolls", label: "Samoona & Rolls" },
  { key: "Loaded Fries & Quick Bites", label: "Loaded Fries" },
  { key: "Coolers & Fresh Juices", label: "Coolers" },
];

export const MENU: MenuItem[] = [
  {
    id: "tender-malba",
    name: "Tender Malba",
    price: 195,
    description: "Fresh tender coconut pulp with rich vanilla scoops, honey, and dry fruits.",
    category: "Special Malba & Shakes",
    veg: "veg",
    bestseller: true,
    customizable: true,
  },
  {
    id: "strawberry-malba",
    name: "Strawberry Malba",
    price: 195,
    description: "Fresh layered strawberry cream, fruit chunks, and double ice cream scoops.",
    category: "Special Malba & Shakes",
    veg: "veg",
    customizable: true,
  },
  {
    id: "brownie-shake",
    name: "Brownie Shake with Ice Cream",
    price: 175,
    description: "Blended fudge brownie topped with vanilla scoop and hot fudge.",
    category: "Special Malba & Shakes",
    veg: "veg",
    customizable: true,
  },
  {
    id: "sharjah-shake",
    name: "Sharjah Special Shake",
    price: 125,
    description: "Classic Kerala banana, chilled milk, Boost, and cashews.",
    category: "Special Malba & Shakes",
    veg: "veg",
    customizable: true,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee with Ice Cream",
    price: 135,
    description: "Thick chilled espresso blend with creamy vanilla ice cream.",
    category: "Special Malba & Shakes",
    veg: "veg",
    customizable: true,
  },
  {
    id: "chicken-samoona",
    name: "Chicken Samoona",
    price: 140,
    description: "Authentic soft Arabic Samoona bread stuffed with seasoned shredded chicken & garlic mayo.",
    category: "Arabic Samoona & Rolls",
    veg: "nonveg",
    bestseller: true,
    customizable: true,
  },
  {
    id: "egg-samoona",
    name: "Egg Samoona",
    price: 105,
    description: "Fluffy spiced egg scramble packed inside fresh Samoona bread.",
    category: "Arabic Samoona & Rolls",
    veg: "nonveg",
    customizable: true,
  },
  {
    id: "veg-samoona",
    name: "Veg Samoona",
    price: 105,
    description: "Sautéed fresh garden veggies with herbed mayo in warm Samoona bread.",
    category: "Arabic Samoona & Rolls",
    veg: "veg",
    customizable: true,
  },
  {
    id: "kolkata-roll",
    name: "Chicken Kolkata Kathi Roll",
    price: 155,
    description: "Flaky paratha wrap filled with tandoori-spiced chicken, onions, and mint chutney.",
    category: "Arabic Samoona & Rolls",
    veg: "nonveg",
    customizable: true,
  },
  {
    id: "cheesy-chilli-fries",
    name: "Cheesy Chilli Fries",
    price: 210,
    description: "Crispy potato fries drenched in spicy melted jalapeño cheese sauce.",
    category: "Loaded Fries & Quick Bites",
    veg: "veg",
    customizable: false,
  },
  {
    id: "jumbo-fries",
    name: "Jumbo Fries",
    price: 130,
    description: "Classic salted 11mm crispy golden fries with garlic dip.",
    category: "Loaded Fries & Quick Bites",
    veg: "veg",
    customizable: false,
  },
  {
    id: "potato-wedges",
    name: "Potato Wedges",
    price: 145,
    description: "Seasoned crispy V-cut spiced wedges.",
    category: "Loaded Fries & Quick Bites",
    veg: "veg",
    customizable: false,
  },
  {
    id: "mosambi-sarbath",
    name: "Mosambi Kulukki Sarbath",
    price: 105,
    description: "Traditional Kerala shaken cooler with sweet lime, green chillies, and chia seeds.",
    category: "Coolers & Fresh Juices",
    veg: "veg",
    customizable: true,
  },
  {
    id: "orange-carrot",
    name: "Orange Carrot Juice",
    price: 140,
    description: "100% cold-pressed natural immunity booster (no added water).",
    category: "Coolers & Fresh Juices",
    veg: "veg",
    customizable: true,
  },
  {
    id: "mint-lime-soda",
    name: "Mint Lime Soda",
    price: 65,
    description: "Freshly crushed mint, zesty lime, and chilled club soda.",
    category: "Coolers & Fresh Juices",
    veg: "veg",
    customizable: true,
  },
];
