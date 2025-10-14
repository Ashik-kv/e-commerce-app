package org.ecommercesample.backend.controller;

import org.ecommercesample.backend.model.ERole;
import org.ecommercesample.backend.model.SellerRequest;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")

public class AdminController {

    @Autowired
    private UserService userService;
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @PutMapping("/users/{userId}/promote")
    public ResponseEntity<String> promoteUserToSeller(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            user.setRole(ERole.ROLE_SELLER);
            userService.saveUser(user);
            return ResponseEntity.ok("User promoted to seller successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to promote user");
        }
    }
    @GetMapping("/seller-requests")
    public ResponseEntity<List<SellerRequest>> getSellerRequests() {
        return ResponseEntity.ok(userService.getPendingSellerRequests());
    }

    @PostMapping("/seller-requests/{requestId}/approve")
    public ResponseEntity<String> approveSellerRequest(@PathVariable Long requestId) {
        try {
            userService.approveSellerRequest(requestId);
            return ResponseEntity.ok("Seller request approved.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/seller-requests/{requestId}/reject")
    public ResponseEntity<String> rejectSellerRequest(@PathVariable Long requestId) {
        try {
            userService.rejectSellerRequest(requestId);
            return ResponseEntity.ok("Seller request rejected.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
