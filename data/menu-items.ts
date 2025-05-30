export const menuItems = [
  // North Indian
  {
    id: 1,
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato sauce",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
    category: "north-indian",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.7,
    review_count: 42,
  },
  {
    id: 2,
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese in a spiced tomato gravy",
    price: 249.99,
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkannanskitchen.com%2Fpaneer-tikka-masala%2F&psig=AOvVaw1wyrZcr_BtvfwZuLFJ7qpu&ust=1748244577163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCB0NmMvo0DFQAAAAAdAAAAABAE",
    category: "north-indian",
    is_vegetarian: true,
    is_spicy: true,
    average_rating: 4.5,
    review_count: 36,
  },
  {
    id: 3,
    name: "Dal Makhani",
    description: "Black lentils and kidney beans in a creamy butter sauce",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=800",
    category: "north-indian",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.3,
    review_count: 28,
  },
  {
    id: 13,
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with fried bread",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1626132647523-66c6300f7f0b?q=80&w=800",
    category: "north-indian",
    is_vegetarian: true,
    is_spicy: true,
    average_rating: 4.6,
    review_count: 31,
  },
  {
    id: 14,
    name: "Malai Kofta",
    description: "Vegetable dumplings in a rich, creamy sauce",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800",
    category: "north-indian",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.4,
    review_count: 25,
  },
  // South Indian
  {
    id: 4,
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato filling",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
    category: "south-indian",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.8,
    review_count: 45,
  },
  {
    id: 5,
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil soup and chutney",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1589301761966-e6506b293111?q=80&w=800",
    category: "south-indian",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.2,
    review_count: 33,
  },
  {
    id: 6,
    name: "Chettinad Chicken",
    description: "Spicy chicken curry with aromatic spices",
    price: 279.99,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800",
    category: "south-indian",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.6,
    review_count: 29,
  },
  {
    id: 15,
    name: "Mysore Masala Dosa",
    description: "Crispy dosa with spicy red chutney and potato filling",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?q=80&w=800",
    category: "south-indian",
    is_vegetarian: true,
    is_spicy: true,
    average_rating: 4.7,
    review_count: 38,
  },
  {
    id: 16,
    name: "Medu Vada",
    description: "Crispy lentil donuts served with sambar and coconut chutney",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1630409352591-c2e9af15b290?q=80&w=800",
    category: "south-indian",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.3,
    review_count: 27,
  },
  // Biryani
  {
    id: 7,
    name: "Hyderabadi Chicken Biryani",
    description: "Fragrant basmati rice cooked with chicken and spices",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800",
    category: "biryani",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.9,
    review_count: 56,
  },
  {
    id: 8,
    name: "Vegetable Biryani",
    description: "Basmati rice cooked with mixed vegetables and spices",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?q=80&w=800",
    category: "biryani",
    is_vegetarian: true,
    is_spicy: true,
    average_rating: 4.4,
    review_count: 32,
  },
  {
    id: 9,
    name: "Mutton Biryani",
    description: "Tender mutton pieces cooked with aromatic rice",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800",
    category: "biryani",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.8,
    review_count: 47,
  },
  {
    id: 17,
    name: "Prawn Biryani",
    description: "Succulent prawns cooked with fragrant basmati rice",
    price: 329.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800",
    category: "biryani",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.7,
    review_count: 34,
  },
  {
    id: 18,
    name: "Egg Biryani",
    description: "Flavorful rice dish with boiled eggs and aromatic spices",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800",
    category: "biryani",
    is_vegetarian: false,
    is_spicy: true,
    average_rating: 4.5,
    review_count: 29,
  },
  // Desserts
  {
    id: 10,
    name: "Gulab Jamun",
    description: "Deep-fried milk solids soaked in sugar syrup",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1601303516534-bf0b1eb70df0?q=80&w=800",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.7,
    review_count: 41,
  },
  {
    id: 11,
    name: "Rasgulla",
    description: "Soft cheese balls soaked in light sugar syrup",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1605197161470-5d2a9af0ac7e?q=80&w=800",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.5,
    review_count: 38,
  },
  {
    id: 12,
    name: "Kulfi",
    description: "Traditional Indian ice cream with nuts and cardamom",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.6,
    review_count: 35,
  },
  {
    id: 19,
    name: "Jalebi",
    description: "Crispy, syrup-soaked sweet pretzel-like dessert",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1589116215257-a0a8d4e722e3?q=80&w=800",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.4,
    review_count: 31,
  },
  {
    id: 20,
    name: "Gajar Ka Halwa",
    description: "Sweet carrot pudding with nuts and cardamom",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?q=80&w=800",
    category: "desserts",
    is_vegetarian: true,
    is_spicy: false,
    average_rating: 4.8,
    review_count: 43,
  },
]
