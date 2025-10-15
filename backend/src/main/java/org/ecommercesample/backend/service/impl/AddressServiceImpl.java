package org.ecommercesample.backend.service.impl;

import org.ecommercesample.backend.exceptions.AddressInUseException;
import org.ecommercesample.backend.exceptions.ResourceNotFoundException;
import org.ecommercesample.backend.model.Address;
import org.ecommercesample.backend.model.User;
import org.ecommercesample.backend.repo.AddressRepo;
import org.ecommercesample.backend.repo.UserRepo;
import org.ecommercesample.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public Address addAddress(Address address, Long userId) {
        User user=userRepo.findById(userId).orElseThrow(()->new ResourceNotFoundException("User not found with id:"+userId));
        address.setUser(user);
        return addressRepo.save(address);
    }

    @Override
    public List<Address> getAddresses(Long userId) {
        if(!userRepo.existsById(userId)){
            throw new ResourceNotFoundException("User not found with id:"+userId);
        }
        return addressRepo.findByUserIdAndActiveTrue(userId);
    }

    @Transactional
    @Override
    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new SecurityException("You are not authorized to delete this address.");
        }

        if (!address.getOrders().isEmpty()) {
            address.setActive(false); // Add this line
            addressRepo.save(address); // Add this line
        } else {
            addressRepo.delete(address); // Keep this for addresses with no orders
        }

        addressRepo.delete(address);
    }
}
