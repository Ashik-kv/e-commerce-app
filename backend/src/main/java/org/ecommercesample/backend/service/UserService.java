package org.ecommercesample.backend.service;


import org.ecommercesample.backend.dto.UpdatePasswordDto;
import org.ecommercesample.backend.dto.UpdateUserDto;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.exceptions.UserAlreadyExistsException;
import org.ecommercesample.backend.model.ERole;
import org.ecommercesample.backend.model.RequestStatus;
import org.ecommercesample.backend.model.SellerRequest;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.SellerRequestRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private SellerRequestRepo sellerRequestRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User saveUser(User user){
        if (userRepo.findByEmail(user.getEmail()) != null && user.getId()==null) {
            throw new UserAlreadyExistsException("A user with email " + user.getEmail() + " already exists.");
        }
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return  userRepo.findAll();
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public User updateUser(Long userId, UpdateUserDto updateUserDto) {
        User user = getUserById(userId);
        user.setFirstName(updateUserDto.getFirstName());
        user.setLastName(updateUserDto.getLastName());
        return userRepo.save(user);
    }

    public void updatePassword(Long userId, UpdatePasswordDto updatePasswordDto) {
        User user = getUserById(userId);
        if (!passwordEncoder.matches(updatePasswordDto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password");
        }
        user.setPassword(passwordEncoder.encode(updatePasswordDto.getNewPassword()));
        userRepo.save(user);
    }

    public void createSellerRequest(Long userId) {
        if (sellerRequestRepo.findByUserIdAndStatus(userId, RequestStatus.PENDING).isPresent()) {
            throw new IllegalStateException("You already have a pending seller request.");
        }
        User user = getUserById(userId);
        SellerRequest sellerRequest = SellerRequest.builder()
                .user(user)
                .status(RequestStatus.PENDING)
                .build();
        sellerRequestRepo.save(sellerRequest);
    }

    public List<SellerRequest> getPendingSellerRequests() {
        return sellerRequestRepo.findByStatus(RequestStatus.PENDING);
    }

    public void approveSellerRequest(Long requestId) {
        SellerRequest request = sellerRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller request not found."));
        request.setStatus(RequestStatus.APPROVED);
        User user = request.getUser();
        user.setRole(ERole.ROLE_SELLER);
        userRepo.save(user);
        sellerRequestRepo.save(request);
    }

    public void rejectSellerRequest(Long requestId) {
        SellerRequest request = sellerRequestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller request not found."));
        request.setStatus(RequestStatus.REJECTED);
        sellerRequestRepo.save(request);
    }
}
