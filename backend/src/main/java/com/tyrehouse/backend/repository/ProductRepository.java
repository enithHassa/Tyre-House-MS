package com.tyrehouse.backend.repository;

import com.tyrehouse.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
} 