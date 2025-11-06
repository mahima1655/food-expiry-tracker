import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class Main {
    private static FoodManager foodManager = new FoodManager();
    private static RecipeManager recipeManager = new RecipeManager();
    private static Scanner scanner = new Scanner(System.in);
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public static void main(String[] args) {
        System.out.println("==== Food Expiry Tracker ====");
        
        while (true) {
            showMenu();
            int choice = getChoice();
            
            switch (choice) {
                case 1: addFoodItem(); break;
                case 2: foodManager.viewAllItems(); break;
                case 3: foodManager.checkExpiryAlerts(); break;
                case 4: recipeManager.suggestRecipes(foodManager.getAvailableIngredients()); break;
                case 5: 
                    System.out.println("Goodbye!");
                    return;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
            System.out.println();
        }
    }

    private static void showMenu() {
        System.out.println("1. Add Food Item");
        System.out.println("2. View Items");
        System.out.println("3. Check Expiry Alerts");
        System.out.println("4. Suggest Recipe");
        System.out.println("5. Exit");
        System.out.print("Choose option: ");
    }

    private static int getChoice() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static void addFoodItem() {
        System.out.print("Name: ");
        String name = scanner.nextLine();
        
        System.out.print("Quantity: ");
        String quantity = scanner.nextLine();
        
        LocalDate purchaseDate = getDate("Purchase Date (dd-MM-yyyy): ");
        LocalDate expiryDate = getDate("Expiry Date (dd-MM-yyyy): ");
        
        foodManager.addFoodItem(name, quantity, purchaseDate, expiryDate);
        System.out.println("Food item added successfully!");
    }

    private static LocalDate getDate(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                return LocalDate.parse(scanner.nextLine(), formatter);
            } catch (DateTimeParseException e) {
                System.out.println("Invalid date format. Please use dd-MM-yyyy");
            }
        }
    }
}