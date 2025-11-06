import java.time.LocalDate;

public class FoodItem {
    private String name;
    private String quantity;
    private LocalDate purchaseDate;
    private LocalDate expiryDate;

    public FoodItem(String name, String quantity, LocalDate purchaseDate, LocalDate expiryDate) {
        this.name = name;
        this.quantity = quantity;
        this.purchaseDate = purchaseDate;
        this.expiryDate = expiryDate;
    }

    public String getName() { return name; }
    public String getQuantity() { return quantity; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public LocalDate getExpiryDate() { return expiryDate; }

    public String toCsvString() {
        return name + "," + quantity + "," + purchaseDate + "," + expiryDate;
    }

    @Override
    public String toString() {
        return String.format("%-15s %-10s %-12s %-12s", name, quantity, purchaseDate, expiryDate);
    }
}