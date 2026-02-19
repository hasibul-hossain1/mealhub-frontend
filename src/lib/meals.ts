export type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Snacks"

export type Meal = {
  id: number
  name: string
  shopName: string
  description: string
  category: MealCategory
  price: number
  isAvailable: boolean
  image: string
}

export const mealsData: Meal[] = [
  {
    id: 1,
    name: "Smoked Chicken Bowl",
    shopName: "Green Fork Kitchen",
    description: "Grilled chicken, brown rice, roasted vegetables and lemon herb sauce.",
    category: "Lunch",
    price: 14.99,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 2,
    name: "Avocado Toast Deluxe",
    shopName: "Morning Crust Cafe",
    description: "Sourdough toast topped with avocado, poached egg and feta.",
    category: "Breakfast",
    price: 8.5,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 3,
    name: "Spicy Beef Wrap",
    shopName: "Wrap District",
    description: "Tender beef strips, peppers, onions and smoky chili mayo.",
    category: "Dinner",
    price: 12.75,
    isAvailable: false,
    image: "/test/food.png",
  },
  {
    id: 4,
    name: "Mediterranean Salad",
    shopName: "Olive Gardenette",
    description: "Cucumber, olives, tomato, chickpeas and house vinaigrette.",
    category: "Lunch",
    price: 9.99,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 5,
    name: "Protein Pancake Stack",
    shopName: "FitFuel Breakfast Bar",
    description: "Fluffy protein pancakes with berries and maple drizzle.",
    category: "Breakfast",
    price: 10.25,
    isAvailable: false,
    image: "/test/food.png",
  },
  {
    id: 6,
    name: "Crispy Veggie Bites",
    shopName: "Crisp Corner",
    description: "Crunchy seasonal vegetables with yogurt garlic dip.",
    category: "Snacks",
    price: 6.25,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 7,
    name: "Lemon Butter Salmon",
    shopName: "Harbor Plate",
    description: "Pan-seared salmon, mashed potato and sauteed green beans.",
    category: "Dinner",
    price: 17.5,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 8,
    name: "Fruit & Granola Cup",
    shopName: "Berry Lane Deli",
    description: "Fresh seasonal fruit with Greek yogurt and crunchy granola.",
    category: "Snacks",
    price: 5.99,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 9,
    name: "This is the test",
    shopName: "Test Kitchen One",
    description: "Fresh seasonal fruit with Greek yogurt and crunchy granola.",
    category: "Snacks",
    price: 50,
    isAvailable: true,
    image: "/test/food.png",
  },
  {
    id: 10,
    name: "This is the test 2",
    shopName: "Test Kitchen Two",
    description: "Fresh seasonal fruit with Greek yogurt and crunchy granola.",
    category: "Snacks",
    price: 1,
    isAvailable: true,
    image: "/test/food.png",
  },
]

export function getMealById(id: number) {
  return mealsData.find((meal) => meal.id === id)
}
