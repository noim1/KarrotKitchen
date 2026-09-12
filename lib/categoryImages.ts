import { FoodCategory } from "@/types";

export function getCategoryImage(category: FoodCategory) {
  switch (category) {
    case "meat":
      return "/images/categories/Meat.png";

    case "dairy":
      return "/images/categories/Dairy.png";

    case "fruit":
      return "/images/categories/Fruit.png";

    case "vegetables":
      return "/images/categories/Vegetable.png";

    case "condiments":
      return "/images/categories/Condiments.png";

    case "staple":
      return "/images/categories/Staple Foods.png";

    case "other":
      return "/images/categories/Other.png";

    default:
      return "/images/categories/Other.png";
  }
}