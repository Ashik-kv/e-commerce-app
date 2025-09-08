package org.ecommercesample.backend.service;


import org.ecommercesample.backend.exceptions.UserAlreadyExistsException;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
