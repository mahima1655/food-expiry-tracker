import java.io.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class FoodManager {
    private static final String DATA_FILE = "data/food_data.csv";
    private List<FoodItem> foodItems;

    public FoodManager() {
        foodItems = new ArrayList<>();
        loadData();
    }

    public void addFoodItem(String name, String quantity, LocalDate purchaseDate, LocalDate expiryDate) {
        foodItems.add(new FoodItem(name, quantity, purchaseDate, expiryDate));
        saveData();
    }

    public void viewAllItems() {
        if (foodItems.isEmpty()) {
            System.out.println("No food items found.");
            return;
        }
        
        System.out.println("\n=== All Food Items ===");
        System.out.printf("%-15s %-10s %-12s %-12s%n", "Name", "Quantity", "Purchase", "Expiry");
        System.out.println("-".repeat(50));
        for (FoodItem item : foodItems) {
            System.out.println(item);
        }
    }

    public void checkExpiryAlerts() {
        LocalDate today = LocalDate.now();
        boolean hasAlerts = false;
        
        System.out.println("\n=== Expiry Alerts ===");
        for (FoodItem item : foodItems) {
            long daysUntilExpiry = ChronoUnit.DAYS.between(today, item.getExpiryDate());
            
            if (daysUntilExpiry < 0) {
                System.out.println("EXPIRED: " + item.getName() + " expired " + Math.abs(daysUntilExpiry) + " days ago!");
                hasAlerts = true;
            } else if (daysUntilExpiry <= 3) {
                System.out.println("WARNING: " + item.getName() + " will expire in " + daysUntilExpiry + " days!");
                hasAlerts = true;
            }
        }
        
        if (!hasAlerts) {
            System.out.println("No items expiring soon.");
        }
    }

    public List<String> getAvailableIngredients() {
        List<String> ingredients = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (FoodItem item : foodItems) {
            if (!item.getExpiryDate().isBefore(today)) {
                ingredients.add(item.getName().toLowerCase());
            }
        }
        return ingredients;
    }

    private void loadData() {
        try (BufferedReader reader = new BufferedReader(new FileReader(DATA_FILE))) {
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 4) {
                    foodItems.add(new FoodItem(
                        parts[0], parts[1], 
                        LocalDate.parse(parts[2]), 
                        LocalDate.parse(parts[3])
                    ));
                }
            }
        } catch (IOException e) {
            // File doesn't exist yet, will be created on first save
        }
    }

    private void saveData() {
        try {
            new File("data").mkdirs();
            try (PrintWriter writer = new PrintWriter(new FileWriter(DATA_FILE))) {
                writer.println("Name,Quantity,PurchaseDate,ExpiryDate");
                for (FoodItem item : foodItems) {
                    writer.println(item.toCsvString());
                }
            }
        } catch (IOException e) {
            System.out.println("Error saving data: " + e.getMessage());
        }
    }
}