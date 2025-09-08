package org.ecommercesample.backend.controller;

import jakarta.validation.Valid;
import org.ecommercesample.backend.dto.LoginRequest;
import org.ecommercesample.backend.dto.LoginResponse;
import org.ecommercesample.backend.model.ERole;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.service.JWTService;
import org.ecommercesample.backend.service.TokenBlacklistService;
import org.ecommercesample.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;


    @PostMapping("register")
    public User registerUser(@RequestBody@Valid User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole(ERole.ROLE_USER);
        return userService.saveUser(user);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest  request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if (authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token=jwtService.generateToken(userDetails);
            return ResponseEntity.ok(new LoginResponse(token));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        String tokenValue = token.substring(7);
        tokenBlacklistService.blacklistToken(tokenValue);
        return ResponseEntity.ok("Logged out successfully");
    }
}
