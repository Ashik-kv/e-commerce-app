package org.ecommercesample.backend.service;


import org.ecommercesample.backend.exceptions.UserAlreadyExistsException;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User saveUser(User user){
        if (userRepo.findByEmail(user.getEmail()) != null) {
            throw new UserAlreadyExistsException("A user with email " + user.getEmail() + " already exists.");
        }
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return  userRepo.findAll();
    }

    public User getUserById(Long userId) {
        return userRepo.findById(userId).get();
    }
}
