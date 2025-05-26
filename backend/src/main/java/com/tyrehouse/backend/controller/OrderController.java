package com.tyrehouse.backend.controller;

import com.tyrehouse.backend.model.Order;
import com.tyrehouse.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        if (order.getPaymentSlip() != null) {
            System.out.println("[DEBUG] Saving payment slip, byte length: " + order.getPaymentSlip().length);
        }
        // base64PaymentSlip is handled in the model setter
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    @GetMapping
    public List<Order> getOrders(@RequestParam(value = "user", required = false) String user) {
        List<Order> orders = (user != null && !user.isEmpty()) ? orderService.getOrdersByUserEmail(user) : orderService.getAllOrders();
        // Set base64PaymentSlip for all orders
        orders.forEach(o -> {
            o.setBase64PaymentSlip(o.getBase64PaymentSlip());
            if (o.getPaymentSlip() != null) {
                System.out.println("[DEBUG] Returning payment slip for order " + o.getId() + ", byte length: " + o.getPaymentSlip().length);
            }
        });
        return orders;
    }
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrder(id);
        order.ifPresent(o -> o.setBase64PaymentSlip(o.getBase64PaymentSlip()));
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        Optional<Order> updated = orderService.updateOrder(id, order);
        updated.ifPresent(o -> o.setBase64PaymentSlip(o.getBase64PaymentSlip()));
        return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
} 