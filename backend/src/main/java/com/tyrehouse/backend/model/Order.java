package com.tyrehouse.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Double total;

    private String status; // e.g., PENDING, PAID, CANCELLED

    private LocalDateTime createdAt;

    private String phone;
    private String email;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] paymentSlip;

    @Transient
    private String base64PaymentSlip;

    public Order() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public byte[] getPaymentSlip() { return paymentSlip; }
    public void setPaymentSlip(byte[] paymentSlip) { this.paymentSlip = paymentSlip; }
    public String getBase64PaymentSlip() {
        if (paymentSlip != null) {
            return java.util.Base64.getEncoder().encodeToString(paymentSlip);
        }
        return null;
    }
    public void setBase64PaymentSlip(String base64PaymentSlip) {
        this.base64PaymentSlip = base64PaymentSlip;
        if (base64PaymentSlip != null && !base64PaymentSlip.isEmpty()) {
            if (base64PaymentSlip.contains(",")) {
                this.paymentSlip = java.util.Base64.getDecoder().decode(base64PaymentSlip.split(",")[1]);
            } else {
                this.paymentSlip = java.util.Base64.getDecoder().decode(base64PaymentSlip);
            }
        }
    }
} 