package com.tyrehouse.backend.service;

import com.tyrehouse.backend.model.Order;
import com.tyrehouse.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    public List<Order> getOrdersByUserEmail(String email) {
        return orderRepository.findByUserEmail(email);
    }
    public Optional<Order> getOrder(Long id) {
        return orderRepository.findById(id);
    }
    public Optional<Order> updateOrder(Long id, Order updatedOrder) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(updatedOrder.getStatus());
            order.setTotal(updatedOrder.getTotal());
            order.setPhone(updatedOrder.getPhone());
            order.setEmail(updatedOrder.getEmail());
            order.setUserEmail(updatedOrder.getUserEmail());
            order.setPaymentSlip(updatedOrder.getPaymentSlip());
            return orderRepository.save(order);
        });
    }
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
} 