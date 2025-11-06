import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class RecipeManager {
    private static final String RECIPES_FILE = "data/recipes.txt";
    private List<Recipe> recipes;

    public RecipeManager() {
        recipes = new ArrayList<>();
        loadRecipes();
    }

    public void suggestRecipes(List<String> availableIngredients) {
        System.out.println("\n=== Recipe Suggestions ===");
        boolean foundRecipe = false;
        
        for (Recipe recipe : recipes) {
            if (canMakeRecipe(recipe, availableIngredients)) {
                System.out.println("Recipe: " + recipe.name + " (uses: " + String.join(", ", recipe.ingredients) + ")");
                foundRecipe = true;
            }
        }
        
        if (!foundRecipe) {
            System.out.println("No recipes available with current ingredients.");
        }
    }

    private boolean canMakeRecipe(Recipe recipe, List<String> availableIngredients) {
        for (String ingredient : recipe.ingredients) {
            if (!availableIngredients.contains(ingredient.toLowerCase())) {
                return false;
            }
        }
        return true;
    }

    private void loadRecipes() {
        try (BufferedReader reader = new BufferedReader(new FileReader(RECIPES_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(":");
                if (parts.length == 2) {
                    String name = parts[0].trim();
                    String[] ingredients = parts[1].split(",");
                    List<String> ingredientList = new ArrayList<>();
                    for (String ingredient : ingredients) {
                        ingredientList.add(ingredient.trim().toLowerCase());
                    }
                    recipes.add(new Recipe(name, ingredientList));
                }
            }
        } catch (IOException e) {
            createDefaultRecipes();
        }
    }

    private void createDefaultRecipes() {
        try {
            new File("data").mkdirs();
            try (PrintWriter writer = new PrintWriter(new FileWriter(RECIPES_FILE))) {
                writer.println("Pancakes: milk, eggs");
                writer.println("Scrambled Eggs: eggs, milk");
                writer.println("Omelette: eggs");
                writer.println("Fruit Salad: apple, banana");
                writer.println("Sandwich: bread, cheese");
                writer.println("Pasta: pasta, cheese");
            }
            loadRecipes(); // Reload after creating
        } catch (IOException e) {
            System.out.println("Error creating recipes file: " + e.getMessage());
        }
    }

    private static class Recipe {
        String name;
        List<String> ingredients;

        Recipe(String name, List<String> ingredients) {
            this.name = name;
            this.ingredients = ingredients;
        }
    }
}