package com.tyrehouse.backend.service;

import com.tyrehouse.backend.model.Product;
import com.tyrehouse.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setBrandName(updatedProduct.getBrandName());
            product.setSize(updatedProduct.getSize());
            product.setPrice(updatedProduct.getPrice());
            product.setDescription(updatedProduct.getDescription());
            product.setAvailability(updatedProduct.getAvailability());
            if (updatedProduct.getImage() != null) {
                product.setImage(updatedProduct.getImage());
            }
            return productRepository.save(product);
        });
    }
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
} 