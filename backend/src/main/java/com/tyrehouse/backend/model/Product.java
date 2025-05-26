package com.tyrehouse.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    private String size;
    private Double price;
    private String brandName;

    @Column(length = 1000)
    private String description;

    private Boolean availability;

    @Transient
    private String base64Image;

    public Product() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }
    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
        if (base64Image != null && !base64Image.isEmpty()) {
            if (base64Image.contains(",")) {
                this.image = java.util.Base64.getDecoder().decode(base64Image.split(",")[1]);
            } else {
                this.image = java.util.Base64.getDecoder().decode(base64Image);
            }
        }
    }
    public String getBase64Image() {
        if (image != null) {
            return java.util.Base64.getEncoder().encodeToString(image);
        }
        return null;
    }
} 