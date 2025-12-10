package com.example.myservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyServiceRest {

    @GetMapping("/")
    public String sayHello(){
        return "Hello from MyService API!";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Service is running";
    }

}
