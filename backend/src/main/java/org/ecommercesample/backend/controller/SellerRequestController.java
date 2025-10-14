package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller-requests")
public class SellerRequestController {
    @Autowired
    private UserService userService;
    @PostMapping
    public ResponseEntity<String> createSellerRequest(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            userService.createSellerRequest(userPrincipal.getUser().getId());
            return ResponseEntity.ok("Seller request submitted successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
