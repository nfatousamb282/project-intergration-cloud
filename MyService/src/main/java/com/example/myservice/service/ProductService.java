package com.example.myservice.service;

import com.example.myservice.model.Product;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProductService {
    private final Map<Long, Product> products = new HashMap<>();
    private final AtomicLong counter = new AtomicLong();

    public ProductService() {
        // Initialiser avec quelques produits de démonstration
        createProduct(new Product(null, "Laptop", "Ordinateur portable haute performance", 999.99, 10));
        createProduct(new Product(null, "Smartphone", "Téléphone intelligent dernière génération", 699.99, 25));
        createProduct(new Product(null, "Tablette", "Tablette tactile 10 pouces", 399.99, 15));
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products.values());
    }

    public Optional<Product> getProductById(Long id) {
        return Optional.ofNullable(products.get(id));
    }

    public Product createProduct(Product product) {
        Long id = counter.incrementAndGet();
        product.setId(id);
        products.put(id, product);
        return product;
    }

    public Optional<Product> updateProduct(Long id, Product product) {
        if (products.containsKey(id)) {
            product.setId(id);
            products.put(id, product);
            return Optional.of(product);
        }
        return Optional.empty();
    }

    public boolean deleteProduct(Long id) {
        return products.remove(id) != null;
    }

    public List<Product> searchProducts(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return products.values().stream()
                .filter(p -> p.getName().toLowerCase().contains(lowerKeyword) ||
                            p.getDescription().toLowerCase().contains(lowerKeyword))
                .toList();
    }
}

