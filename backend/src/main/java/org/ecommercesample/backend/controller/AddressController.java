package org.ecommercesample.backend.controller;

import jakarta.validation.Valid;
import org.ecommercesample.backend.model.Address;
import org.ecommercesample.backend.model.UserPrincipal;
import org.ecommercesample.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<Address> addAddress(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody Address address) {
        System.out.println("ADDRESSES");
        Long userId=userPrincipal.getUser().getId();
        Address newAddress=addressService.addAddress(address,userId);
        return new ResponseEntity<>(newAddress, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId=userPrincipal.getUser().getId();
        List<Address> addresses=addressService.getAddresses(userId);
        return ResponseEntity.ok(addresses);
    }
}
