package org.ecommercesample.backend.service;



import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException(username+" not found");
        }
        return new UserPrincipal(user);
    }
}
